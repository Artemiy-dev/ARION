from django.urls import path

from . import views

urlpatterns = [
    path("", views.create_order),
    path("mine/", views.my_orders),
]
