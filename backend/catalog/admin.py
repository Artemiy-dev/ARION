from django.contrib import admin
from django.utils.html import format_html

from .models import Category, Product, ProductCharacteristic


class ProductCharacteristicInline(admin.TabularInline):
    model = ProductCharacteristic
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "slug"]
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ["name"]


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["thumbnail", "name", "category", "brand", "price", "in_stock", "is_hit"]
    list_display_links = ["thumbnail", "name"]
    list_filter = ["category", "brand", "in_stock", "is_hit"]
    search_fields = ["name", "brand", "description"]
    prepopulated_fields = {"slug": ("name",)}
    list_editable = ["price", "in_stock", "is_hit"]
    inlines = [ProductCharacteristicInline]
    fieldsets = [
        ("Основное", {"fields": ["name", "slug", "category", "brand", "image"]}),
        ("Описание", {"fields": ["description"]}),
        ("Цена и статус", {"fields": ["price", "in_stock", "is_hit"]}),
    ]

    @admin.display(description="Фото")
    def thumbnail(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="height:40px;width:40px;object-fit:cover;border-radius:4px;" />',
                obj.image.url,
            )
        return "—"
