from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    name = models.CharField("Название", max_length=100, unique=True)
    slug = models.SlugField("Слаг", max_length=120, unique=True, blank=True)

    class Meta:
        verbose_name = "категория"
        verbose_name_plural = "Категории"
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name, allow_unicode=True)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField("Название", max_length=200)
    slug = models.SlugField("Слаг", max_length=220, unique=True, blank=True)
    category = models.ForeignKey(
        Category, verbose_name="Категория", related_name="products", on_delete=models.PROTECT
    )
    brand = models.CharField("Бренд", max_length=100, blank=True)
    description = models.TextField("Описание", blank=True)
    price = models.DecimalField("Цена", max_digits=10, decimal_places=2)
    image = models.ImageField("Фото", upload_to="products/", blank=True, null=True)
    in_stock = models.BooleanField("В наличии", default=True)
    is_hit = models.BooleanField("Хит продаж", default=False)
    created_at = models.DateTimeField("Добавлен", auto_now_add=True)

    class Meta:
        verbose_name = "товар"
        verbose_name_plural = "Товары"
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name, allow_unicode=True)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class ProductCharacteristic(models.Model):
    product = models.ForeignKey(
        Product, verbose_name="Товар", related_name="characteristics", on_delete=models.CASCADE
    )
    name = models.CharField("Характеристика", max_length=100)
    value = models.CharField("Значение", max_length=200)
    order = models.PositiveIntegerField("Порядок", default=0)

    class Meta:
        verbose_name = "характеристика"
        verbose_name_plural = "Характеристики"
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.name}: {self.value}"
