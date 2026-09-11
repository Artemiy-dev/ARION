from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from catalog.models import Product

from .models import Order, OrderItem
from .serializers import OrderCreateSerializer, OrderSerializer


@api_view(["POST"])
@permission_classes([AllowAny])
def create_order(request):
    payload = OrderCreateSerializer(data=request.data)
    payload.is_valid(raise_exception=True)
    items_data = payload.validated_data.pop("items")

    order = Order.objects.create(
        user=request.user if request.user.is_authenticated else None,
        **payload.validated_data,
    )
    order_items = []
    for item in items_data:
        product = get_object_or_404(Product, slug=item["product_slug"])
        order_items.append(
            OrderItem(order=order, product=product, quantity=item["quantity"], price=product.price)
        )
    OrderItem.objects.bulk_create(order_items)

    return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_orders(request):
    orders = Order.objects.filter(user=request.user).prefetch_related("items__product")
    return Response(OrderSerializer(orders, many=True).data)
