# Игорь Велютич — Мебель на заказ

Сайт-портфолио мастера по изготовлению мебели. Реализован полностью на фронтенде с Supabase (БД, Storage, Auth).

## Технологии

- **React 19** + TypeScript
- **Vite** — сборка
- **Tailwind CSS** — стили
- **Supabase** — данные, хранилище файлов, авторизация
- **React Router** — маршрутизация

## Возможности

- Портфолио с masonry-галереей и модальным просмотром
- Форма обратной связи (сохранение заявок в БД)
- Админ-панель: CRUD работ, загрузка фото, drag-and-drop сортировка
- Регистрация только для первого администратора
- Адаптивный интерфейс
- SEO: meta, Open Graph, JSON-LD, robots.txt, sitemap.xml

## Быстрый старт

```bash
npm install
cp .env.example .env
# Заполните VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY
npm run dev
```

## Переменные окружения

| Переменная | Описание |
|------------|----------|
| `VITE_SUPABASE_URL` | URL проекта Supabase |
| `VITE_SUPABASE_ANON_KEY` | anon public key (Dashboard → API) |
| `VITE_BASE_PATH` | Базовый путь (для GitHub Pages: `/имя-репо/`) |

## Supabase

Миграции, RLS, Storage и настройка Auth описаны в [supabase/README.md](supabase/README.md).

## Сборка и запуск

```bash
npm run build    # Сборка в dist/
npm run preview  # Локальный просмотр собраной версии
```

## Деплой на GitHub Pages

Подробная инструкция в [DEPLOY.md](DEPLOY.md).

## Структура проекта

```
src/
├── components/     # React-компоненты
├── hooks/          # useWorks, useContact, useAdminAuth, useAdminWorks
├── lib/            # supabase, formValidation
└── main.tsx
supabase/
├── migrations/     # SQL-миграции
└── README.md       # Настройка Supabase
```
