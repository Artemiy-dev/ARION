from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Banner
from .serializers import BannerSerializer


@api_view(["GET"])
@permission_classes([AllowAny])
def banner_list(request):
    banners = Banner.objects.filter(is_active=True)
    return Response(BannerSerializer(banners, many=True, context={"request": request}).data)
