from django.conf import settings
from django.db import models


class Profile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, verbose_name="Пользователь", on_delete=models.CASCADE, related_name="profile"
    )
    avatar = models.ImageField("Фото профиля", upload_to="avatars/", blank=True, null=True)

    class Meta:
        verbose_name = "профиль"
        verbose_name_plural = "Профили"

    def __str__(self):
        return f"Профиль {self.user}"
