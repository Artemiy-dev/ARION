from rest_framework import serializers

from .models import Category, Product, ProductCharacteristic


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]


class ProductCharacteristicSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCharacteristic
        fields = ["name", "value"]


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    characteristics = ProductCharacteristicSerializer(many=True, read_only=True)
    price = serializers.DecimalField(max_digits=10, decimal_places=2, coerce_to_string=False)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "category",
            "brand",
            "description",
            "price",
            "image",
            "in_stock",
            "is_hit",
            "characteristics",
        ]
