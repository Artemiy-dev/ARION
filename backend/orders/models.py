from django.conf import settings
from django.db import models

from catalog.models import Product


class Order(models.Model):
    class Status(models.TextChoices):
        NEW = "new", "Новая"
        IN_PROGRESS = "in_progress", "В обработке"
        DONE = "done", "Выполнена"
        CANCELED = "canceled", "Отменена"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, verbose_name="Пользователь", related_name="orders", on_delete=models.CASCADE
    )
    full_name = models.CharField("Имя", max_length=150)
    phone = models.CharField("Телефон", max_length=32)
    comment = models.TextField("Комментарий", blank=True)
    status = models.CharField("Статус", max_length=20, choices=Status.choices, default=Status.NEW)
    created_at = models.DateTimeField("Создана", auto_now_add=True)

    class Meta:
        verbose_name = "заявка"
        verbose_name_plural = "Заявки"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Заявка №{self.id} от {self.full_name}"

    @property
    def total(self):
        return sum(item.price * item.quantity for item in self.items.all())


class OrderItem(models.Model):
    order = models.ForeignKey(Order, verbose_name="Заявка", related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, verbose_name="Товар", on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField("Количество", default=1)
    price = models.DecimalField("Цена на момент заявки", max_digits=10, decimal_places=2)

    class Meta:
        verbose_name = "товар в заявке"
        verbose_name_plural = "Товары в заявках"

    def __str__(self):
        return f"{self.product} x{self.quantity}"
