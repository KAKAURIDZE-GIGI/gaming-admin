# Gaming Features Admin Panel

A configuration dashboard for managing three independent gaming features: **Leaderboard**, **Raffle**, and **Wheel (Spin-to-Win)**. Built as a modular admin interface where operators can create, configure, and manage each feature through a clean, professional UI.

---

## Architecture

The project follows a **feature-sliced architecture** where each gaming feature is a fully independent, self-contained module. The key principle: if you delete any single feature folder from `src/features/`, only the route registration in `AppRoutes.tsx` needs to change — nothing else breaks.

### Module Boundaries

Each feature owns its entire vertical slice — types, validation schemas, API layer, React Query hooks, components, and pages. Features never import from each other. Shared code lives in `src/shared/` and contains only generic, business-logic-free utilities.

### Folder Structure

The repository is an **npm workspaces monorepo**. Both apps live under `apps/` and
share a single root `node_modules` and lockfile.

```
gaming-admin/                  # npm workspaces monorepo (root)
├── package.json               # Workspaces config + delegating scripts
├── package-lock.json          # Single lockfile for both apps
├── apps/
│   ├── admin/                 # React + TypeScript frontend (Vite)  — see below
│   └── server/                # Express + MongoDB REST API          — see below
└── README.md
```

**`apps/server/`** — Express + MongoDB REST API

```
apps/server/
├── config/
│   └── db.js                    # Mongoose connection
├── models/                      # Mongoose schemas
│   ├── Leaderboard.js
│   ├── Raffle.js
│   ├── Wheel.js
│   ├── Admin.js                 # Admin user (bcrypt-hashed password)
│   └── _transform.js            # Shared toJSON: exposes `id`, hides `_id`/`__v`
├── controllers/
│   ├── crudController.js        # Generic CRUD factory (shared by all resources)
│   └── authController.js        # login + me
├── middleware/
│   └── auth.js                  # protect: JWT verification
├── routes/
│   ├── resource.js              # REST router factory
│   └── auth.js                  # /api/auth routes
├── scripts/
│   └── createAdmin.js           # CLI to add/update an admin user
├── seed.js                      # Seed collections + default admin
├── .env                         # MONGO_URI, JWT_SECRET (gitignored)
├── .env.example                 # Env template
└── index.js                     # App entry: connect DB, mount routes
```

**`apps/admin/`** — React + TypeScript frontend

```
apps/admin/
├── src/
│   ├── app/                         # Application shell
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx          # Navigation sidebar with dark mode toggle
│   │   │   ├── Breadcrumbs.tsx      # Dynamic breadcrumb navigation
│   │   │   ├── MainLayout.tsx       # Root layout with sidebar + content area
│   │   │   └── index.ts
│   │   ├── providers/
│   │   │   ├── ThemeContext.tsx      # MUI theme + dark mode context
│   │   │   └── AppProviders.tsx     # QueryClient, Theme, Router, Toast providers
│   │   └── routes/
│   │       └── AppRoutes.tsx        # createBrowserRouter config, lazy-loaded pages
│   ├── shared/                      # Generic, reusable code (no business logic)
│   │   ├── api/
│   │   │   └── axios.ts            # Axios instance with base URL + error interceptor
│   │   ├── components/
│   │   │   ├── ErrorBoundary.tsx    # Reusable error boundary (global + per-feature)
│   │   │   ├── NotFound.tsx         # 404 page
│   │   │   ├── SortableItem.tsx     # Drag-and-drop wrapper for dnd-kit
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useUnsavedChanges.ts # Dirty form navigation guard (useBlocker)
│   │   │   └── index.ts
│   │   ├── lib/
│   │   │   ├── routes.ts           # Centralized route path constants
│   │   │   ├── queryKeys.ts        # React Query key factory constants
│   │   │   ├── exportCsv.ts        # CSV export utility
│   │   │   └── index.ts
│   │   └── types/
│   │       └── index.ts            # Shared type definitions
│   ├── features/
│   │   ├── leaderboard/             # 100% self-contained module
│   │   │   ├── api/
│   │   │   │   ├── leaderboardApi.ts
│   │   │   │   ├── useLeaderboardQueries.ts
│   │   │   │   └── index.ts
│   │   │   ├── components/
│   │   │   │   ├── StatusChip.tsx
│   │   │   │   ├── PrizeListForm.tsx   # With drag-and-drop reordering
│   │   │   │   ├── LeaderboardForm.tsx
│   │   │   │   └── index.ts
│   │   │   ├── pages/
│   │   │   │   ├── LeaderboardList.tsx    # Table + pagination + sorting + filters + CSV export
│   │   │   │   ├── LeaderboardCreate.tsx
│   │   │   │   ├── LeaderboardEdit.tsx
│   │   │   │   └── LeaderboardDetail.tsx
│   │   │   ├── schemas/
│   │   │   │   ├── index.ts               # Zod schema + z.infer type
│   │   │   │   └── __tests__/
│   │   │   │       └── leaderboardSchema.test.ts
│   │   │   └── types/
│   │   │       └── index.ts
│   │   ├── raffle/                  # Same structure as leaderboard
│   │   │   ├── api/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── schemas/
│   │   │   │   └── __tests__/
│   │   │   └── types/
│   │   └── wheel/                   # Same structure + WheelPreview + AnimatedWheel
│   │       ├── api/
│   │       ├── components/
│   │       │   ├── WheelPreview.tsx        # Static SVG wheel visualization
│   │       │   ├── AnimatedWheel.tsx       # Interactive spin animation
│   │       │   ├── SegmentListForm.tsx     # With drag-and-drop + live weight counter
│   │       │   ├── WheelForm.tsx           # Split layout with live preview
│   │       │   ├── StatusChip.tsx
│   │       │   └── index.ts
│   │       ├── pages/
│   │       ├── schemas/
│   │       │   └── __tests__/
│   │       └── types/
│   ├── test/
│   │   └── setup.ts                # Vitest + Testing Library setup
│   ├── App.tsx
│   └── main.tsx
├── vitest.config.ts
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
└── package.json
```

---

## Tech Stack

| Layer           | Technology               | Version | Purpose                                                      |
| --------------- | ------------------------ | ------- | ------------------------------------------------------------ |
| Framework       | React + TypeScript       | 19.x    | UI framework with static typing                              |
| Build Tool      | Vite                     | 8.x     | Dev server with HMR, proxy, path aliases                     |
| Routing         | React Router             | 6.x     | Data router (`createBrowserRouter`) for `useBlocker` support |
| UI Library      | Material UI (MUI)        | 7.x     | Component library with `sx` prop styling                     |
| Server State    | TanStack React Query     | 5.x     | Data fetching, caching, mutations                            |
| Form Management | React Hook Form          | 7.x     | Performant form state, field arrays                          |
| Validation      | Zod                      | 3.24.x  | Schema validation, type inference via `z.infer`              |
| HTTP Client     | Axios                    | 1.x     | Centralized API client with interceptors                     |
| Notifications   | react-hot-toast          | 2.x     | Toast notifications for mutations                            |
| Drag & Drop     | @dnd-kit                 | 6.x     | Sortable lists for prizes and wheel segments                 |
| Testing         | Vitest + Testing Library | 3.x     | Unit tests for schemas and utilities                         |
| Backend         | Express.js               | 5.x     | REST API server                                              |
| Database        | MongoDB + Mongoose       | 9.x     | Persistent document store with schema models                 |
| Auth            | JWT + bcryptjs           | —       | Email/password login, hashed passwords, Bearer-token auth    |

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 9+
- A MongoDB database (MongoDB Atlas or a local instance)

### Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd gaming-admin

# 2. Install all dependencies (one install covers both workspaces)
npm install

# 3. Configure environment variables
cp apps/server/.env.example apps/server/.env
# then edit apps/server/.env and set MONGO_URI and JWT_SECRET

# 4. Seed the database (loads sample data + a default admin user)
npm run seed

# 5. Start both apps (use two terminals)

# Terminal 1 — Frontend (port 3000)
npm run dev

# Terminal 2 — Backend (port 5000)
npm run server
```

> All commands run from the repository root. `npm install` installs both workspaces
> (`apps/admin` and `apps/server`) into a single hoisted `node_modules`.

Open **http://localhost:3000** — the app should be running with seed data for all three features.

> The Vite dev server proxies `/api` requests to `http://localhost:5000`, so the frontend and backend communicate seamlessly during development.

### Environment Variables (`apps/server/.env`)

| Variable         | Description                                  | Example                              |
| ---------------- | -------------------------------------------- | ------------------------------------ |
| `MONGO_URI`      | MongoDB connection string                    | `mongodb+srv://user:pass@cluster...` |
| `JWT_SECRET`     | Secret used to sign JWT tokens               | `a-long-random-string`               |
| `JWT_EXPIRES_IN` | Token lifetime                               | `7d`                                 |
| `PORT`           | API server port                              | `5000`                               |

> `apps/server/.env` is gitignored. Never commit real credentials — use `.env.example` as the committed template.

### Admin Users

The seed script creates a default admin: **`admin@gaming.com` / `admin123`**.

Add or update an admin from the repository root:

```bash
npm run create-admin -- <email> <password> [name] [role]
# e.g. npm run create-admin -- boss@gaming.com pass123 "Big Boss" superadmin
```

`role` is `admin` (default) or `superadmin`. Re-running with an existing email updates that user's password, name, and role.

---

## Available Scripts

All scripts run from the **repository root** and delegate to the right workspace.

| Script                 | Workspace | Description                          |
| ---------------------- | --------- | ------------------------------------ |
| `npm run dev`          | admin     | Start Vite dev server on port 3000   |
| `npm run build`        | admin     | Type-check and build for production   |
| `npm run lint`         | admin     | Lint all source files                 |
| `npm test`             | admin     | Run unit tests in watch mode          |
| `npm run test:run`     | admin     | Run unit tests once                   |
| `npm run server`       | server    | Start the Express API on port 5000    |
| `npm run seed`         | server    | Reset collections + seed sample data  |
| `npm run create-admin` | server    | Add or update an admin user           |

Workspace-scoped commands also work directly, e.g. `npm run lint --workspace admin`
or running any script from inside `apps/admin` / `apps/server`.

---

## API Reference

Base URL: `http://localhost:5000/api` (proxied via Vite at `/api`)

All list endpoints support query parameters: `page`, `limit`, `sortBy`, `order`, `status`.

### Auth

| Method | Endpoint          | Description                   | Request Body          |
| ------ | ----------------- | ----------------------------- | --------------------- |
| POST   | `/api/auth/login` | Log in, returns JWT + admin   | `{ email, password }` |
| GET    | `/api/auth/me`    | Current admin (requires auth) | —                     |

`POST /api/auth/login` responds with `{ token, admin }`. Send the token on protected
requests via the `Authorization: Bearer <token>` header. Admin passwords are hashed
with bcrypt and never returned in responses. There is no public registration endpoint —
admins are created with the `create-admin` script.

> The `protect` middleware (`middleware/auth.js`) is implemented and ready to guard the
> resource routes; it is mounted on `/api/auth/me` and can be applied to the resource
> routers once the frontend login flow is in place.

### Leaderboards

| Method | Endpoint                | Description          | Request Body            |
| ------ | ----------------------- | -------------------- | ----------------------- |
| GET    | `/api/leaderboards`     | List with pagination | —                       |
| GET    | `/api/leaderboards/:id` | Get by ID            | —                       |
| POST   | `/api/leaderboards`     | Create new           | `LeaderboardFormValues` |
| PUT    | `/api/leaderboards/:id` | Update existing      | `LeaderboardFormValues` |
| DELETE | `/api/leaderboards/:id` | Delete               | —                       |

**Response shape (list):**

```json
{
  "data": [
    { "id": "lb-001", "title": "...", "status": "active", "...": "..." }
  ],
  "total": 3,
  "page": 1,
  "limit": 10
}
```

### Raffles

| Method | Endpoint           | Description          | Request Body       |
| ------ | ------------------ | -------------------- | ------------------ |
| GET    | `/api/raffles`     | List with pagination | —                  |
| GET    | `/api/raffles/:id` | Get by ID            | —                  |
| POST   | `/api/raffles`     | Create new           | `RaffleFormValues` |
| PUT    | `/api/raffles/:id` | Update existing      | `RaffleFormValues` |
| DELETE | `/api/raffles/:id` | Delete               | —                  |

### Wheels

| Method | Endpoint          | Description          | Request Body      |
| ------ | ----------------- | -------------------- | ----------------- |
| GET    | `/api/wheels`     | List with pagination | —                 |
| GET    | `/api/wheels/:id` | Get by ID            | —                 |
| POST   | `/api/wheels`     | Create new           | `WheelFormValues` |
| PUT    | `/api/wheels/:id` | Update existing      | `WheelFormValues` |
| DELETE | `/api/wheels/:id` | Delete               | —                 |

---

## Design Decisions (ქართულ ენაზე)

### 1. ფიჩერზე დაფუძნებული არქიტექტურა (Feature-Sliced Architecture)

პროექტის მთავარი არქიტექტურული გადაწყვეტილება იყო ფიჩერზე დაფუძნებული სტრუქტურის არჩევა, სადაც Leaderboard, Raffle და Wheel თითოეული წარმოადგენს სრულიად დამოუკიდებელ მოდულს. ყოველ მოდულს აქვს საკუთარი ტიპები, ვალიდაციის სქემები, API ფენა, React Query ჰუკები, კომპონენტები და გვერდები. ეს გადაწყვეტილება მოტივირებული იყო დავალების მოთხოვნით — თითოეული ფიჩერის წაშლა უნდა შეიძლებოდეს სრულად და ამავდროულად სხვა ფიჩერები არ უნდა დაზიანდეს.

### 2. React Router Data Router + useBlocker

`BrowserRouter`-ის ნაცვლად გამოვიყენე `createBrowserRouter` (Data Router), რადგან `useBlocker` ჰუკი, რომელიც საჭიროა შეუნახავი ცვლილებების გაფრთხილებისთვის (unsaved changes prompt), მხოლოდ Data Router-ით მუშაობს. ეს გადაწყვეტილება აუცილებელი იყო UX მოთხოვნის დასაკმაყოფილებლად — მომხმარებელი უნდა გაფრთხილდეს ფორმიდან გასვლისას, თუ შეუნახავი ცვლილებები არსებობს.

---

## Bonus Features

- **Dark Mode** — Toggle in sidebar, persisted via `localStorage`. Full MUI theme with adjusted palette for both modes.
- **Animated Wheel** — Interactive spin animation on the Wheel detail page with CSS transitions, weighted random result selection, and winner announcement.
- **CSV Export** — Export table data from any list page as a `.csv` file.
- **Drag-and-Drop** — Reorder prizes (Leaderboard, Raffle) and wheel segments using `@dnd-kit` sortable lists.
- **Unit Tests** — Vitest tests for all three Zod validation schemas and the CSV export utility (56 tests total).
