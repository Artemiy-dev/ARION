from datetime import timedelta

from django.db.models import Count, F, Sum
from django.db.models.functions import TruncDate
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response

from orders.models import Order, OrderItem

from .models import PageVisit


# Пишет лог посещения страницы. Дергается фронтендом при каждом переходе
# (см. useTrackVisit), доступно всем — и гостям, и авторизованным.
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


# Сводная статистика для страницы /stats. Доступна только менеджерам/админам
# (IsAdminUser = is_staff).
@api_view(["GET"])
@permission_classes([IsAdminUser])
def stats(request):
    since = timezone.now() - timedelta(days=14)

    # --- Посещения сайта ---
    total = PageVisit.objects.count()
    last_14_days_total = PageVisit.objects.filter(created_at__gte=since).count()
    unique_visitors = (
        PageVisit.objects.filter(user__isnull=False).values("user").distinct().count()
    )

    # Посещения по дням за последние 14 дней — данные для графика
    by_day = (
        PageVisit.objects.filter(created_at__gte=since)
        .annotate(day=TruncDate("created_at"))
        .values("day")
        .annotate(count=Count("id"))
        .order_by("day")
    )

    # Топ-8 самых посещаемых страниц за всё время
    top_pages = (
        PageVisit.objects.values("path")
        .annotate(count=Count("id"))
        .order_by("-count")[:8]
    )

    # --- Заявки и продажи ---
    orders_total = Order.objects.count()
    orders_last_14_days = Order.objects.filter(created_at__gte=since).count()

    # Количество заявок в каждом статусе (Новая / В обработке / Выполнена / Отменена)
    status_labels = dict(Order.Status.choices)
    orders_by_status_raw = (
        Order.objects.values("status").annotate(count=Count("id")).order_by("status")
    )
    orders_by_status = [
        {
            "status": row["status"],
            "label": status_labels.get(row["status"], row["status"]),
            "count": row["count"],
        }
        for row in orders_by_status_raw
    ]

    # Реальная выручка — сумма по товарам только выполненных заявок
    revenue_done = OrderItem.objects.filter(order__status=Order.Status.DONE).aggregate(
        total=Sum(F("price") * F("quantity"))
    )["total"] or 0
    # Сумма в заявках, которые ещё не обработаны (потенциальная выручка)
    revenue_pending = OrderItem.objects.filter(
        order__status__in=[Order.Status.NEW, Order.Status.IN_PROGRESS]
    ).aggregate(total=Sum(F("price") * F("quantity")))["total"] or 0

    return Response(
        {
            "total": total,
            "last_14_days_total": last_14_days_total,
            "unique_visitors": unique_visitors,
            "by_day": [{"day": row["day"].isoformat(), "count": row["count"]} for row in by_day],
            "top_pages": list(top_pages),
            "orders": {
                "total": orders_total,
                "last_14_days_total": orders_last_14_days,
                "by_status": orders_by_status,
                "revenue_done": revenue_done,
                "revenue_pending": revenue_pending,
            },
        }
    )
