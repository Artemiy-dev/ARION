# arionKz — React + TypeScript + Django

Frontend (Vite + React + TypeScript) интегрирован с бэкендом (Django) через
[django-vite](https://github.com/MrBin99/django-vite): один HTML-шаблон, Django
раздаёт страницу и API, а Vite отвечает за сборку и HMR фронтенда.

## Структура

```
arionKz/
├── backend/           # Django-проект
│   ├── config/        # settings.py, urls.py
│   ├── core/          # index-view (SPA-шаблон) и /api/ping/
│   ├── catalog/       # Category/Product/характеристики + админка + API
│   ├── accounts/      # регистрация/вход/профиль (аватар) покупателей
│   ├── cart/          # корзина покупателя, привязанная к аккаунту
│   ├── orders/        # заявки, оформленные из корзины
│   ├── analytics/     # учёт посещений и статистика для менеджеров
│   ├── templates/      # index.html с {% vite_asset %}
│   ├── static/         # сюда собирается фронтенд (dist Vite)
│   └── venv/           # виртуальное окружение Python
└── frontend/          # Vite + React + TS проект (src/)
```

## Первый запуск

```bash
# Backend
cd backend
source venv/bin/activate      # если ещё не активировано
pip install -r requirements.txt
python manage.py migrate

# Frontend
cd ../frontend
npm install
```

## Разработка (два терминала)

Терминал 1 — Vite dev-сервер (HMR):

```bash
cd frontend
npm run dev
```

Терминал 2 — Django:

```bash
cd backend
source venv/bin/activate
python manage.py runserver
```

Открыть http://localhost:8000/ — Django отдаёт HTML, скрипты подключаются
с dev-сервера Vite (localhost:5173) с горячей перезагрузкой.

## Продакшн-сборка

```bash
cd frontend
npm run build          # соберёт файлы в ../backend/static

cd ../backend
source venv/bin/activate
DJANGO_DEBUG=False python manage.py collectstatic --noinput
DJANGO_DEBUG=False python manage.py runserver   # или gunicorn/uwsgi
```

При `DJANGO_DEBUG=False` django-vite читает `backend/static/.vite/manifest.json`
и подставляет в шаблон реальные (хешированные) пути к собранным JS/CSS.

## Переменные окружения (backend)

- `DJANGO_DEBUG` — `True`/`False` (по умолчанию `True`)
- `DJANGO_SECRET_KEY` — секретный ключ для продакшна
- `DJANGO_ALLOWED_HOSTS` — список хостов через запятую
- `DJANGO_CSRF_TRUSTED_ORIGINS` — список доверенных origin'ов через запятую,
  со схемой (`https://example.com`) — нужно для продакшна за HTTPS
- `DATABASE_URL` — строка подключения к БД (например
  `postgres://user:pass@host:5432/dbname`); если не задана — используется
  локальный `db.sqlite3`
- `AWS_STORAGE_BUCKET_NAME`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`,
  `AWS_S3_REGION_NAME`, `AWS_S3_ENDPOINT_URL` — S3-совместимое хранилище для
  загружаемых файлов (аватары, фото товаров); без него файлы хранятся на
  локальном диске

## Деплой на Vercel

Проект целиком (Django + собранный фронтенд) деплоится на Vercel как одна
Python-функция (`api/index.py`) + статическая сборка. Сборкой управляют
`vercel.json` и `build_files.sh` в корне репозитория — они сами прогоняют
`npm run build` и `collectstatic`, вручную ничего собирать не нужно.

**Важно — SQLite и медиафайлы не подходят для Vercel** (serverless-функции не
хранят диск между запросами): обязательно нужны внешняя БД (`DATABASE_URL`,
например [Neon](https://neon.tech) или [Supabase](https://supabase.com) —
у обоих есть бесплатный Postgres) и S3-совместимое хранилище для аватаров и
фото товаров (`AWS_STORAGE_BUCKET_NAME` и т.д. — подходит Cloudflare R2,
AWS S3, Backblaze B2). Без них сайт откроется, но загрузка файлов и все
записи в БД будут пропадать между запросами.

```bash
npm install -g vercel      # если ещё не установлен Vercel CLI
vercel login
vercel link                # привязать текущую папку к проекту в Vercel

# переменные окружения (минимум для рабочего деплоя)
vercel env add DJANGO_SECRET_KEY production
vercel env add DJANGO_DEBUG production          # значение: False
vercel env add DATABASE_URL production          # строка подключения к Postgres
vercel env add AWS_STORAGE_BUCKET_NAME production
vercel env add AWS_ACCESS_KEY_ID production
vercel env add AWS_SECRET_ACCESS_KEY production
vercel env add AWS_S3_REGION_NAME production
vercel env add AWS_S3_ENDPOINT_URL production   # только если хранилище не AWS S3

vercel --prod               # деплой
vercel env pull .env.vercel # скачать реальные значения env, если нужно применить миграции локально

# применить миграции и создать пользователей на новой (production) БД:
DATABASE_URL=<значение из .env.vercel> python backend/manage.py migrate
DATABASE_URL=<значение из .env.vercel> python backend/manage.py createsuperuser
DATABASE_URL=<значение из .env.vercel> python backend/manage.py create_manager --username manager --password <свой-пароль>
```

## API

- `GET /api/ping/` → `{"status": "ok"}`
- `GET /api/products/` — список товаров (с категорией и характеристиками)
- `GET /api/products/<slug>/` — один товар
- `GET /api/categories/` — список категорий
- `POST /api/auth/register/`, `POST /api/auth/login/`, `POST /api/auth/logout/`,
  `GET /api/auth/me/` — регистрация/вход покупателей (сессия Django + CSRF)
- `GET /api/cart/`, `POST /api/cart/add/`, `PATCH|DELETE /api/cart/items/<id>/`
  — корзина текущего покупателя (требует входа)
- `POST /api/auth/avatar/` — загрузка фото профиля (multipart, требует входа)
- `POST /api/orders/`, `GET /api/orders/mine/` — оформить заявку из корзины /
  список своих заявок
- `POST /api/analytics/visit/` — лог посещения страницы (шлётся фронтендом
  при каждом переходе)
- `GET /api/analytics/stats/` — агрегированная статистика (только для
  `is_staff`, т.е. менеджеров)

## Покупатели: регистрация, вход, корзина

На сайте у покупателей есть настоящие аккаунты (обычные пользователи Django,
без прав в админке). Работает через сессии Django + CSRF-куку, которую
подставляет `core.views.index` (`@ensure_csrf_cookie`).

- Кнопка **«Войти»** в шапке — форма входа/регистрации покупателя (`/login`,
  `/register`), не путать со входом менеджера в `/admin/`.
- Клик **«В корзину»** неавторизованным пользователем сохраняет товар и
  перекидывает на регистрацию; после успешной регистрации (или входа) товар
  автоматически добавляется в корзину.
- Корзина (`/cart`) и её содержимое хранятся в базе (`cart.Cart` /
  `cart.CartItem`), привязаны к пользователю — не теряются при перезаходе с
  другого устройства.
- **Избранное** — локальная фича для гостей и покупателей (хранится в
  `localStorage` браузера, аккаунт не требуется).

## Оформление заявки и личный кабинет

- На странице корзины кнопка **«Оформить заявку»** открывает плавно
  всплывающее модальное окно с полями (имя, телефон, комментарий) и списком
  выбранных товаров. После отправки создаётся `orders.Order` — заявка видна
  менеджеру в админке (раздел «Заявки»), там же можно менять её статус
  (Новая / В обработке / Выполнена / Отменена).
- Клик по аватарке в шапке открывает **личный кабинет** (тоже модальное
  окно): загрузка своего фото профиля (сразу отображается в кружке в шапке),
  переключатель темы сайта (светлая / тёмная / системная — сохраняется в
  браузере), и для менеджеров — ссылка на статистику посещений.
- **Статистика посещений** (`/stats`, доступна только `is_staff`-пользователям)
  — общее число посещений, уникальные посетители, график по дням и топ
  страниц. Каждый переход по сайту логируется через `/api/analytics/visit/`.

## Админка для менеджеров

Django-админка полностью на русском (`LANGUAGE_CODE = 'ru'` + русские
`verbose_name` у всех моделей и приложений). Товарами (карточки, фото, цена,
наличие, характеристики, удаление) и заявками управляют прямо там — отдельную
панель для этого писать не пришлось. У менеджера — своя роль с правами
**только на каталог и заявки** (добавление/изменение/удаление категорий,
товаров и заявок + просмотр статистики), без доступа к пользователям,
группам и прочим системным разделам.

Открыть **http://localhost:8000/admin/**. Учётные записи не поставляются с
проектом — создайте их локально:

```bash
# Суперпользователь (полный доступ, включая пользователей и группы)
python manage.py createsuperuser

# Менеджер каталога (доступ только к разделам "Каталог" и "Заявки" + просмотр статистики)
python manage.py create_manager --username manager --password <свой-пароль>
# без --password будет сгенерирован случайный пароль и выведен один раз в консоль
```

Тот же логин/пароль менеджера работает и на самом сайте (кнопка «Войти») —
после входа в личном кабинете (клик по аватарке) появляется дополнительная
ссылка «Статистика посещений».

`create_manager` идемпотентна — можно перезапускать, если меняете права
менеджера в будущем: она пересоздаёт группу и права с нуля (пароль при этом
обновится только если передан явно через `--password`).

Демо-данные (9 товаров) можно накатить/восстановить командой:

```bash
python manage.py seed_products
```

Загруженные фото хранятся в `backend/media/` (при `DEBUG=True` раздаются
самим Django; в проде нужно отдавать `MEDIA_ROOT` через nginx/S3).
