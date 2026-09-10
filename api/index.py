"""
Точка входа для Python-функции Vercel.

Vercel по умолчанию превращает любой .py-файл в каталоге /api в serverless
function и ищет в нём WSGI/ASGI-приложение в переменной `app`. Здесь мы просто
подключаем путь до backend/ и отдаём обычное Django WSGI-приложение — весь
роутинг (в т.ч. /admin/, /api/*, и SPA) остаётся как есть, в backend/config/urls.py.
"""

import os
import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(BACKEND_DIR))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

from django.core.wsgi import get_wsgi_application  # noqa: E402

app = get_wsgi_application()
