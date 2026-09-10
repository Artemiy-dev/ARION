#!/bin/bash
set -euo pipefail

echo "== Frontend: сборка Vite (JS/CSS + manifest.json) =="
cd frontend
npm install
npm run build
cd ..

echo "== Backend: зависимости + сбор статики (vite-бандл + админка/DRF) =="
python3 -m pip install --upgrade pip
pip install -r requirements.txt

cd backend
python manage.py collectstatic --noinput
cd ..
