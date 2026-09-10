from django.conf import settings
from django.db import models


class PageVisit(models.Model):
    path = models.CharField("Страница", max_length=300)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name="Пользователь",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
    )
    created_at = models.DateTimeField("Дата", auto_now_add=True)

    class Meta:
        verbose_name = "посещение"
        verbose_name_plural = "Посещения"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.path} — {self.created_at:%d.%m.%Y %H:%M}"
