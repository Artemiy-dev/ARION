from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from django.core.management.base import BaseCommand
from django.utils.crypto import get_random_string

from analytics.models import PageVisit
from catalog.models import Category, Product, ProductCharacteristic
from orders.models import Order, OrderItem

FULL_ACCESS_MODELS = [Category, Product, ProductCharacteristic, Order, OrderItem]
VIEW_ONLY_MODELS = [PageVisit]


class Command(BaseCommand):
    help = (
        "Создаёт группу 'Менеджеры каталога' с правами на товары, категории и "
        "заявки (полный доступ) и просмотр статистики посещений, плюс тестового "
        "пользователя-менеджера в этой группе."
    )

    def add_arguments(self, parser):
        parser.add_argument("--username", default="manager")
        parser.add_argument(
            "--password",
            default=None,
            help="Пароль менеджера. Если не указан, будет сгенерирован случайно.",
        )

    def handle(self, *args, **options):
        group, _ = Group.objects.get_or_create(name="Менеджеры каталога")

        permissions = []

        def collect(model, actions):
            content_type = ContentType.objects.get_for_model(model)
            for action in actions:
                codename = f"{action}_{model._meta.model_name}"
                try:
                    permissions.append(
                        Permission.objects.get(content_type=content_type, codename=codename)
                    )
                except Permission.DoesNotExist:
                    pass

        for model in FULL_ACCESS_MODELS:
            collect(model, ["add", "change", "delete", "view"])
        for model in VIEW_ONLY_MODELS:
            collect(model, ["view"])

        group.permissions.set(permissions)

        User = get_user_model()
        username = options["username"]

        user, created = User.objects.get_or_create(
            username=username, defaults={"is_staff": True}
        )
        user.is_staff = True
        user.is_superuser = False

        generated_password = None
        if options["password"]:
            user.set_password(options["password"])
        elif created:
            generated_password = get_random_string(16)
            user.set_password(generated_password)

        user.save()
        user.groups.set([group])

        action_word = "создан" if created else "обновлён"
        self.stdout.write(self.style.SUCCESS(f"Пользователь-менеджер {action_word}: {username}"))
        if generated_password:
            self.stdout.write(
                self.style.WARNING(
                    f"Пароль сгенерирован автоматически: {generated_password} "
                    "— сохраните его, он больше нигде не будет показан."
                )
            )
        elif not options["password"]:
            self.stdout.write("Пароль не менялся (передайте --password, чтобы задать новый).")
