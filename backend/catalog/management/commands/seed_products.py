from django.core.management.base import BaseCommand

from catalog.models import Category, Product, ProductCharacteristic

CATEGORIES = ["Лазерные принтеры", "Струйные принтеры", "МФУ", "Плоттеры", "Сканеры"]

PRODUCTS = [
    {
        "name": "Arion LaserJet P2100",
        "category": "Лазерные принтеры",
        "brand": "Arion",
        "description": "Лазерный принтер, ч/б, A4, 22 стр/мин",
        "price": 89990,
        "in_stock": True,
        "is_hit": True,
        "characteristics": [
            ("Технология печати", "Лазерная"),
            ("Цвет печати", "Чёрно-белая"),
            ("Формат", "A4"),
            ("Скорость печати", "22 стр/мин"),
        ],
    },
    {
        "name": "Arion InkFlow C300",
        "category": "Струйные принтеры",
        "brand": "Arion",
        "description": "Струйный принтер, цветной, A4, СНПЧ",
        "price": 64990,
        "in_stock": True,
        "is_hit": False,
        "characteristics": [
            ("Технология печати", "Струйная"),
            ("Цвет печати", "Цветная"),
            ("Формат", "A4"),
            ("СНПЧ", "Да"),
        ],
    },
    {
        "name": "Arion MFP X500",
        "category": "МФУ",
        "brand": "Arion",
        "description": "МФУ 3в1: принтер, сканер, копир, Wi-Fi",
        "price": 129990,
        "in_stock": True,
        "is_hit": True,
        "characteristics": [
            ("Функции", "Печать, сканирование, копирование"),
            ("Формат", "A4"),
            ("Wi-Fi", "Да"),
        ],
    },
    {
        "name": "Arion LaserJet P2100 Plus",
        "category": "Лазерные принтеры",
        "brand": "Arion",
        "description": "Лазерный принтер, ч/б, A4, дуплекс, сеть",
        "price": 109990,
        "in_stock": False,
        "is_hit": False,
        "characteristics": [
            ("Технология печати", "Лазерная"),
            ("Двусторонняя печать", "Да"),
            ("Сетевой интерфейс", "Ethernet"),
        ],
    },
    {
        "name": "Arion ColorPro C700",
        "category": "Лазерные принтеры",
        "brand": "Arion",
        "description": "Лазерный принтер, цветной, A4, 26 стр/мин",
        "price": 189990,
        "in_stock": True,
        "is_hit": False,
        "characteristics": [
            ("Технология печати", "Лазерная"),
            ("Цвет печати", "Цветная"),
            ("Скорость печати", "26 стр/мин"),
        ],
    },
    {
        "name": "Arion InkFlow C300 Wi-Fi",
        "category": "Струйные принтеры",
        "brand": "Arion",
        "description": "Струйный принтер, цветной, A4, Wi-Fi, СНПЧ",
        "price": 74990,
        "in_stock": True,
        "is_hit": False,
        "characteristics": [
            ("Технология печати", "Струйная"),
            ("Wi-Fi", "Да"),
            ("СНПЧ", "Да"),
        ],
    },
    {
        "name": "Arion MFP X500 Duplex",
        "category": "МФУ",
        "brand": "Arion",
        "description": "МФУ 3в1, автоподача, двусторонняя печать",
        "price": 154990,
        "in_stock": True,
        "is_hit": False,
        "characteristics": [
            ("Функции", "Печать, сканирование, копирование"),
            ("Двусторонняя печать", "Да"),
            ("Автоподача", "Да"),
        ],
    },
    {
        "name": "Arion PlotWorks A1",
        "category": "Плоттеры",
        "brand": "Arion",
        "description": "Плоттер, широкоформатная печать, A1",
        "price": 349990,
        "in_stock": False,
        "is_hit": False,
        "characteristics": [
            ("Максимальный формат", "A1"),
            ("Технология печати", "Струйная"),
        ],
    },
    {
        "name": "Arion ScanLite S100",
        "category": "Сканеры",
        "brand": "Arion",
        "description": "Планшетный сканер, A4, 1200 dpi",
        "price": 39990,
        "in_stock": True,
        "is_hit": False,
        "characteristics": [
            ("Тип", "Планшетный"),
            ("Разрешение", "1200 dpi"),
            ("Формат", "A4"),
        ],
    },
]


class Command(BaseCommand):
    help = "Заполняет каталог демо-категориями и товарами"

    def handle(self, *args, **options):
        categories = {}
        for name in CATEGORIES:
            category, _ = Category.objects.get_or_create(name=name)
            categories[name] = category

        created = 0
        for item in PRODUCTS:
            product, was_created = Product.objects.get_or_create(
                name=item["name"],
                defaults={
                    "category": categories[item["category"]],
                    "brand": item["brand"],
                    "description": item["description"],
                    "price": item["price"],
                    "in_stock": item["in_stock"],
                    "is_hit": item["is_hit"],
                },
            )
            if was_created:
                created += 1
                for order, (name, value) in enumerate(item["characteristics"]):
                    ProductCharacteristic.objects.create(
                        product=product, name=name, value=value, order=order
                    )

        self.stdout.write(self.style.SUCCESS(f"Готово: создано {created} новых товаров"))
