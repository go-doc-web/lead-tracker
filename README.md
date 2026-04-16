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

Важливо: Оскільки база даних ініціалізується вперше, потрібно створити структуру таблиць за допомогою Prisma:

```bash
docker-compose exec backend npx prisma generate
docker-compose exec backend npx prisma db push
```

Після успішного запуску додаток буде доступний за адресами:

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:3001/api](http://localhost:3001/api)
- **Swagger Documentation**: [http://localhost:3001/api/docs](http://localhost:3001/api/docs)

# 🌐 Живе демо (Links)

| Service                     | URL                                                                                                  |
| :-------------------------- | :--------------------------------------------------------------------------------------------------- |
| **🌍 Frontend (Vercel)**    | [https://lead-tracker-woad.vercel.app/](https://lead-tracker-woad.vercel.app/)                       |
| **⚙️ Backend API (Render)** | [https://lead-tracker-eqiy.onrender.com/api/leads](https://lead-tracker-eqiy.onrender.com/api/leads) |
| **📄 Swagger UI (Docs)**    | [https://lead-tracker-eqiy.onrender.com/api/docs](https://lead-tracker-eqiy.onrender.com/api/docs)   |

---

## 💡 Важлива примітка щодо деплою

Бекенд розміщено на безкоштовному тарифі **Render.com**.

⚠️ **Особливість:** Якщо сервіс не використовувався певний час, він переходить у «сплячий режим».

- При першому відкритті сайту завантаження даних може тривати **30-50 секунд**.
- Будь ласка, зачекайте або оновіть сторінку через хвилину — після «пробудження» сервер працюватиме стабільно та швидко.

---

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

Деплой: Проект розгорнуто (Vercel + Render + Neon). Всі частини взаємодіють через змінні оточення.

Docker: Створено docker-compose.yml для швидкого локального розгортання всього оточення однією командою.

## Що не встиг і як би доробив:

«На даному етапі проект не покритий автоматизованими тестами (Unit/E2E), оскільки я наразі лише вивчаю цей напрямок і зосередився на стабільній роботі бізнес-логіки та деплої. У майбутньому я б додав авторизацію користувачів (JWT) та інтегрував би інструменти аналітики для відстеження бюджетів у реальному часі».

## 🗄 Структура бази даних (Prisma)

Проєкт використовує дві основні моделі:

- `Lead`: основна інформація про клієнта, бюджет та статус.
- `Comment`: коментарі, прив'язані до конкретного ліда.

```
model Lead {
  id        String    @id @default(uuid())
  name      String
  email     String?
  company   String?
  status    Status    @default(NEW)
  value     Float     @default(0)
  notes     String?
  comments  Comment[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Comment {
  id        String   @id @default(uuid())
  text      String
  leadId    String
  lead      Lead     @relation(fields: [leadId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
}

enum Status {
  NEW
  CONTACTED
  IN_PROGRESS
  WON
  LOST
}
```
