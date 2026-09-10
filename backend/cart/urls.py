from django.urls import path

from . import views

urlpatterns = [
    path("", views.cart_detail),
    path("add/", views.cart_add),
    path("items/<int:item_id>/", views.cart_item_detail),
]
