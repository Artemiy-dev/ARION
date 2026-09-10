from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.decorators import api_view
from rest_framework.response import Response


@ensure_csrf_cookie
def index(request):
    return render(request, "index.html")


@api_view(["GET"])
def ping(request):
    return Response({"status": "ok"})
