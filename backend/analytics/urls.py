from django.urls import path

from . import views

urlpatterns = [
    path("visit/", views.log_visit),
    path("stats/", views.stats),
]
