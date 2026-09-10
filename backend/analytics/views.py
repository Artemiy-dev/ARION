from datetime import timedelta

from django.db.models import Count
from django.db.models.functions import TruncDate
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response

from .models import PageVisit


@api_view(["POST"])
@permission_classes([AllowAny])
def log_visit(request):
    path = request.data.get("path", "")[:300]
    if not path:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    PageVisit.objects.create(
        path=path, user=request.user if request.user.is_authenticated else None
    )
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
@permission_classes([IsAdminUser])
def stats(request):
    since = timezone.now() - timedelta(days=14)

    total = PageVisit.objects.count()
    last_14_days_total = PageVisit.objects.filter(created_at__gte=since).count()
    unique_visitors = (
        PageVisit.objects.filter(user__isnull=False).values("user").distinct().count()
    )

    by_day = (
        PageVisit.objects.filter(created_at__gte=since)
        .annotate(day=TruncDate("created_at"))
        .values("day")
        .annotate(count=Count("id"))
        .order_by("day")
    )

    top_pages = (
        PageVisit.objects.values("path")
        .annotate(count=Count("id"))
        .order_by("-count")[:8]
    )

    return Response(
        {
            "total": total,
            "last_14_days_total": last_14_days_total,
            "unique_visitors": unique_visitors,
            "by_day": [{"day": row["day"].isoformat(), "count": row["count"]} for row in by_day],
            "top_pages": list(top_pages),
        }
    )
