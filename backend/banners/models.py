from django.db import models


class Banner(models.Model):
    title = models.CharField("Заголовок", max_length=200, blank=True)
    image = models.ImageField("Изображение", upload_to="banners/")
    link = models.CharField(
        "Ссылка",
        max_length=300,
        blank=True,
        help_text="Куда вести при клике на баннер, например /catalog или https://...",
    )
    order = models.PositiveIntegerField("Порядок", default=0)
    is_active = models.BooleanField("Показывать на сайте", default=True)
    created_at = models.DateTimeField("Добавлен", auto_now_add=True)

    class Meta:
        verbose_name = "баннер"
        verbose_name_plural = "Баннеры"
        ordering = ["order", "-created_at"]

    def __str__(self):
        return self.title or f"Баннер №{self.pk}"
