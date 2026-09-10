from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from catalog.models import Product

from .models import Cart, CartItem
from .serializers import CartSerializer


def _get_cart(user):
    cart, _ = Cart.objects.get_or_create(user=user)
    return cart


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def cart_detail(request):
    cart = _get_cart(request.user)
    return Response(CartSerializer(cart).data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def cart_add(request):
    slug = request.data.get("product_slug")
    quantity = int(request.data.get("quantity", 1))
    product = get_object_or_404(Product, slug=slug)
    cart = _get_cart(request.user)

    item, created = CartItem.objects.get_or_create(
        cart=cart, product=product, defaults={"quantity": quantity}
    )
    if not created:
        item.quantity += quantity
        item.save()

    return Response(CartSerializer(cart).data, status=status.HTTP_201_CREATED)


@api_view(["PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def cart_item_detail(request, item_id):
    cart = _get_cart(request.user)
    item = get_object_or_404(CartItem, cart=cart, id=item_id)

    if request.method == "DELETE":
        item.delete()
    else:
        quantity = int(request.data.get("quantity", item.quantity))
        if quantity <= 0:
            item.delete()
        else:
            item.quantity = quantity
            item.save()

    return Response(CartSerializer(cart).data)
