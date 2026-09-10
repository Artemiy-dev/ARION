from django.conf import settings
from django.db import models

from catalog.models import Product


class Cart(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        verbose_name="Пользователь",
        on_delete=models.CASCADE,
        related_name="cart",
    )

    class Meta:
        verbose_name = "корзина"
        verbose_name_plural = "Корзины"

    def __str__(self):
        return f"Корзина {self.user}"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, verbose_name="Корзина", related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, verbose_name="Товар", on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField("Количество", default=1)

    class Meta:
        verbose_name = "товар в корзине"
        verbose_name_plural = "Товары в корзинах"
        unique_together = ["cart", "product"]

    def __str__(self):
        return f"{self.product} x{self.quantity}"
