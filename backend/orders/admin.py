from django.contrib import admin

from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ["product", "quantity", "price"]
    can_delete = False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ["id", "full_name", "phone", "user", "status", "total_display", "created_at"]
    list_editable = ["status"]
    list_filter = ["status", "created_at"]
    search_fields = ["full_name", "phone", "user__username"]
    date_hierarchy = "created_at"
    inlines = [OrderItemInline]
    readonly_fields = ["user", "full_name", "phone", "comment", "created_at"]

    @admin.display(description="Сумма")
    def total_display(self, obj):
        return f"{obj.total:,.0f} ₸".replace(",", " ")

    def has_add_permission(self, request):
        return False
