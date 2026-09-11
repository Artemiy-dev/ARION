from django.contrib import admin
from django.utils.html import format_html

from .models import Banner


@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ["thumbnail", "title", "link", "order", "is_active", "created_at"]
    list_display_links = ["thumbnail", "title"]
    list_editable = ["order", "is_active"]
    fields = ["title", "image", "link", "order", "is_active"]

    @admin.display(description="Превью")
    def thumbnail(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="height:40px;width:80px;object-fit:cover;border-radius:4px;" />',
                obj.image.url,
            )
        return "—"
