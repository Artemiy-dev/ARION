from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from cart.models import Cart

from .models import Order, OrderItem
from .serializers import OrderCreateSerializer, OrderSerializer


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_order(request):
    payload = OrderCreateSerializer(data=request.data)
    payload.is_valid(raise_exception=True)

    cart = get_object_or_404(Cart, user=request.user)
    cart_items = list(cart.items.select_related("product").all())
    if not cart_items:
        return Response({"detail": "Корзина пуста"}, status=status.HTTP_400_BAD_REQUEST)

    order = Order.objects.create(user=request.user, **payload.validated_data)
    OrderItem.objects.bulk_create(
        [
            OrderItem(order=order, product=item.product, quantity=item.quantity, price=item.product.price)
            for item in cart_items
        ]
    )
    cart_items_ids = [item.id for item in cart_items]
    cart.items.filter(id__in=cart_items_ids).delete()

    return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_orders(request):
    orders = Order.objects.filter(user=request.user).prefetch_related("items__product")
    return Response(OrderSerializer(orders, many=True).data)
