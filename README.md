# lead-tracker

Оскільки в ТЗ (Технічному Завданні) зазвичай є чіткий зразок того, як має виглядати **README.md**, давай зробимо його максимально близьким до вимог, але з твоїм крутим описом.

Ось фінальний варіант **README.md**, який ти можеш просто скопіювати. Він структурований так, як полюбляють техліди.

---

````markdown
# Lead Tracker CRM 🚀

Повнофункціональна CRM-система для відстеження лідів та керування воронкою продажів. Проєкт реалізований як Fullstack додаток із використанням сучасних стандартів веб-розробки 2026 року.

## 🏗 Архітектура проєкту

Проєкт розділений на два основні модулі:

- **/frontend**: Next.js 15 додаток (App Router).
- **/backend**: NestJS API з використанням Prisma ORM.

## 🛠 Технологічний стек

- **Frontend**: React 19, Next.js 15, Tailwind CSS, Zustand (State Management), Lucide Icons.
- **Backend**: NestJS, PostgreSQL, Prisma, Class-Validator (DTO Validation).
- **DevOps**: Docker, Docker Compose.

## 🚀 Швидкий запуск (Docker Compose)

Найпростіший спосіб запустити весь проєкт (Frontend, Backend та Database) однією командою:

```bash
docker-compose up --build
```
````

Після успішного запуску додаток буде доступний за адресами:

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:3001/api](http://localhost:3001/api)
- **Swagger Documentation**: [http://localhost:3001/api/docs](http://localhost:3001/api/docs)

## 📋 Виконані вимоги ТЗ

### Backend:

- [x] Реалізовано REST API на NestJS.
- [x] Робота з базою даних PostgreSQL через Prisma.
- [x] Валідація вхідних даних через DTO (class-validator).
- [x] Серверна пагінація, фільтрація за статусом та пошук.
- [x] Сортування за полями `createdAt`, `value`, `name`.
- [x] Система коментарів (Relation One-to-Many).

### Frontend:

- [x] Побудовано на Next.js (App Router).
- [x] Управління станом через Zustand.
- [x] Реалізовано CRUD для лідів (Create, Read, Update, Delete).
- [x] Динамічна пагінація та фільтрація без перезавантаження сторінки.
- [x] Детальна сторінка ліда з можливістю редагування та додавання коментарів.
- [x] Повністю адаптивний дизайн (Mobile First).

## 🗄 Структура бази даних (Prisma)

Проєкт використовує дві основні моделі:

- `Lead`: основна інформація про клієнта, бюджет та статус.
- `Comment`: коментарі, прив'язані до конкретного ліда.
