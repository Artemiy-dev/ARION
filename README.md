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
│   ├── cart/          # legacy server-корзина (сейчас не используется фронтендом)
│   ├── orders/        # заявки, оформленные из корзины (без входа тоже можно)
│   ├── analytics/     # учёт посещений и статистика (посещения + заявки/продажи)
│   ├── banners/       # баннеры-карусель на главной, загружаются в админке
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

Проект целиком (Django + собранный фронтенд) деплоится на Vercel — Vercel сам
распознаёт Django-проект (по `backend/manage.py`) и запускает
`backend/config/wsgi.py` как serverless-функцию на все пути. Сборкой
управляют `vercel.json` (Build Command) и `build_files.sh` в корне
репозитория — они сами прогоняют `npm run build` и `collectstatic`, вручную
ничего собирать не нужно.

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
  `GET /api/auth/me/` — регистрация/вход покупателей (сессия Django + CSRF,
  необязательно для покупки — см. ниже)
- `POST /api/auth/avatar/` — загрузка фото профиля (multipart, требует входа)
- `POST /api/orders/` — оформить заявку: `{full_name, phone, comment, items:
  [{product_slug, quantity}]}`, работает без входа (`user` в заявке будет
  `null` для гостей); `GET /api/orders/mine/` — список своих заявок (только
  для вошедших)
- `GET /api/banners/` — активные баннеры для карусели на главной
  (`id, title, image, link`), отсортированы по полю `order`
- `POST /api/analytics/visit/` — лог посещения страницы (шлётся фронтендом
  при каждом переходе)
- `GET /api/analytics/stats/` — статистика посещений и заявок/продаж (только
  для `is_staff`, т.е. менеджеров)

## Покупатели: корзина, сравнение, избранное — без обязательной регистрации

Оформить заявку можно без аккаунта — регистрация нужна только по желанию
(личный кабинет, аватар, история заявок).

- **Корзина** (`/cart`), **Избранное** (`/favorites`) и **Сравнение**
  (`/compare`, до 4 товаров) хранятся в `localStorage` браузера — работают
  сразу, без входа, но не синхронизируются между устройствами.
- Кнопка **«В корзину»** сразу добавляет товар, без переходов на
  регистрацию/вход.
- Кнопка **«Войти»** в шапке — форма входа/регистрации покупателя (`/login`,
  `/register`), не путать со входом менеджера в `/admin/`; нужна только для
  личного кабинета и истории заявок (`/api/orders/mine/`).
- **Поиск** в шапке — подсказки по мере набора (имя/бренд/описание), Enter
  или клик «Все результаты» ведёт на `/catalog?q=...`.

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
наличие, характеристики, удаление), заявками и баннерами карусели управляют
прямо там — отдельную панель для этого писать не пришлось. У менеджера —
своя роль с правами **на каталог, заявки и баннеры** (добавление/изменение/
удаление категорий, товаров, заявок и баннеров + просмотр статистики), без
доступа к пользователям, группам и прочим системным разделам.

Баннеры для карусели на главной — раздел **Баннеры** в админке: фото,
заголовок (необязательно), ссылка при клике (`/catalog`, `/product/slug` или
внешний `https://...`), порядок показа и переключатель «Показывать на
сайте». Карусель сама скрывается, если активных баннеров нет.

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
