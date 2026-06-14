# Gaming Admin Platform

A full-stack gaming platform with an **admin dashboard** for configuring games and a **player client** for playing them. Operators manage **Wheels (Spin-to-Win)** and **Fruit Slots** through a modular admin interface; players register, log in, and play with a server-authoritative coin balance.

---

## Architecture

The project follows a **feature-sliced architecture** where each gaming feature is a fully independent, self-contained module. The key principle: if you delete any single feature folder from `src/features/`, only the route registration in `AppRoutes.tsx` needs to change — nothing else breaks.

### Module Boundaries

Each feature owns its entire vertical slice — types, validation schemas, API layer, React Query hooks, components, and pages. Features never import from each other. Shared code lives in `src/shared/` and contains only generic, business-logic-free utilities.

### Folder Structure

The repository is an **npm workspaces monorepo**. All apps live under `apps/` and share a single root `node_modules` and lockfile.

```
gaming-admin/                  # npm workspaces monorepo (root)
├── package.json               # Workspaces config + delegating scripts
├── package-lock.json          # Single lockfile for all apps
├── docs/
│   └── DOCUMENTATION_KA.md    # Full Georgian technical documentation
├── apps/
│   ├── admin/                 # React + TypeScript admin dashboard (Vite)
│   ├── client/                # React + TypeScript player app (Vite)
│   └── server/                # Express + MongoDB REST API
└── README.MD
```

**`apps/server/`** — Express + MongoDB REST API

```
apps/server/
├── config/
│   └── db.js                    # Mongoose connection
├── models/                      # Mongoose schemas
│   ├── Wheel.js
│   ├── Slot.js
│   ├── User.js                  # Player accounts
│   ├── Admin.js                 # Admin user (bcrypt-hashed password)
│   ├── PlayHistory.js           # Server-side play log
│   └── _transform.js            # Shared toJSON: exposes `id`, hides `_id`/`__v`
├── controllers/
│   ├── crudController.js        # Generic CRUD factory (shared by all resources)
│   ├── playController.js        # Server-authoritative game outcomes
│   └── authController.js        # Admin login + me
├── lib/
│   └── slotEngine.js            # Slot RNG and payline logic
├── middleware/
│   ├── auth.js                  # Admin JWT verification
│   └── userAuth.js              # Player JWT verification
├── routes/
│   ├── resource.js              # REST router factory
│   ├── auth.js                  # /api/auth routes
│   ├── userAuth.js              # /api/user-auth routes
│   ├── games.js                 # Player read-only active game configs
│   └── play.js                  # Player play actions + history
├── scripts/
│   └── createAdmin.js           # CLI to add/update an admin user
├── seed.js                      # Seed collections + default admin
├── .env                         # MONGO_URI, JWT_SECRET (gitignored)
├── .env.example                 # Env template
└── index.js                     # App entry: connect DB, mount routes
```

**`apps/admin/`** — Admin dashboard (React + TypeScript)

```
apps/admin/
├── src/
│   ├── app/                         # Application shell (layout, providers, routes)
│   ├── shared/                      # Generic reusable code (no business logic)
│   └── features/
│       ├── wheel/                   # Wheel CRUD module
│       └── slot/                    # Slot CRUD module
```

**`apps/client/`** — Player-facing app (React + TypeScript)

```
apps/client/
├── src/
│   ├── app/                         # Layout, providers, routes
│   ├── shared/                      # API client, types, shared components
│   └── features/
│       ├── auth/                    # Login, register, email verification
│       ├── lobby/                   # Home / game picker
│       ├── games/                   # Wheel + Slot list and play pages
│       └── history/                 # Play history table
```

---

## Tech Stack

| Layer           | Technology               | Purpose                                                      |
| --------------- | ------------------------ | ------------------------------------------------------------ |
| Framework       | React + TypeScript       | UI framework with static typing                              |
| Build Tool      | Vite                     | Dev server with HMR, proxy, path aliases                     |
| Routing         | React Router             | Data router (`createBrowserRouter`) for navigation guards    |
| UI Library      | Material UI (MUI)        | Component library with `sx` prop styling                     |
| Server State    | TanStack React Query     | Data fetching, caching, mutations                            |
| Form Management | React Hook Form          | Performant form state, field arrays                          |
| Validation      | Zod                      | Schema validation, type inference via `z.infer`              |
| HTTP Client     | Axios                    | Centralized API client with interceptors                     |
| Notifications   | react-hot-toast          | Toast notifications for mutations                            |
| Drag & Drop     | @dnd-kit                 | Sortable wheel segments in admin                             |
| Testing         | Vitest + Testing Library | Unit tests for schemas and utilities                         |
| Backend         | Express.js               | REST API server                                              |
| Database        | MongoDB + Mongoose       | Persistent document store with schema models                 |
| Auth            | JWT + bcryptjs           | Email/password login, hashed passwords, Bearer-token auth    |

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

# 2. Install all dependencies (one install covers all workspaces)
npm install

# 3. Configure environment variables
cp apps/server/.env.example apps/server/.env
# then edit apps/server/.env and set MONGO_URI and JWT_SECRET

# 4. Seed the database (loads sample wheels/slots + a default admin user)
npm run seed

# 5. Start all services (recommended)
npm run start:all
```

Or run each app in a separate terminal:

```bash
# Terminal 1 — Admin dashboard (port 3000)
npm run dev

# Terminal 2 — Player client (port 3001)
npm run client

# Terminal 3 — Backend API (port 5000)
npm run server
```

> All commands run from the repository root. `npm install` installs all workspaces into a single hoisted `node_modules`.

| App    | URL                      | Purpose                          |
| ------ | ------------------------ | -------------------------------- |
| Admin  | http://localhost:3000    | Operator dashboard               |
| Client | http://localhost:3001    | Player gaming app                |
| Server | http://localhost:5000    | REST API                         |

> Vite dev servers proxy `/api` requests to `http://localhost:5000`, so frontends and backend communicate seamlessly during development.

### Environment Variables (`apps/server/.env`)

| Variable         | Description                                  | Example                              |
| ---------------- | -------------------------------------------- | ------------------------------------ |
| `MONGO_URI`      | MongoDB connection string                    | `mongodb+srv://user:pass@cluster...` |
| `JWT_SECRET`     | Secret used to sign JWT tokens               | `a-long-random-string`               |
| `JWT_EXPIRES_IN` | Token lifetime                               | `7d`                                 |
| `PORT`           | API server port                              | `5000`                               |
| `CLIENT_URL`     | Player app URL (email verification links)    | `http://localhost:3001`              |
| `DEFAULT_BALANCE`| Starting coins for new players               | `1000`                               |
| `RESEND_API_KEY` | Email provider key (optional in dev)         | —                                    |

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
| `npm run dev`          | admin     | Start admin Vite dev server (3000)   |
| `npm run dev:admin`    | admin     | Same as `dev`                        |
| `npm run client`       | client    | Start player client dev server (3001)|
| `npm run dev:client`   | client    | Same as `client`                     |
| `npm run build`        | admin     | Type-check and build admin           |
| `npm run client:build` | client    | Type-check and build player client   |
| `npm run lint`         | admin     | Lint admin source files              |
| `npm run client:lint`  | client    | Lint player client source files      |
| `npm run lint:all`     | all       | Lint client + admin                  |
| `npm run build:all`    | all       | Production build client + admin      |
| `npm run test:run`     | admin     | Run admin unit tests once            |
| `npm run test:all`     | all       | Run all unit tests once              |
| `npm run check`        | all       | lint + test + tsc + build (CI-ready) |
| `npm test`             | admin     | Run admin unit tests (watch mode)    |
| `npm run server`       | server    | Start the Express API on port 5000   |
| `npm run seed`         | server    | Reset collections + seed sample data |
| `npm run create-admin` | server    | Add or update an admin user          |
| `npm run start:all`    | all       | Run server, client, and admin together |

Workspace-scoped commands also work directly, e.g. `npm run lint --workspace client`.

---

## API Reference

Base URL: `http://localhost:5000/api` (proxied via Vite at `/api`)

All admin list endpoints support query parameters: `page`, `limit`, `sortBy`, `order`, `status`.

### Admin Auth

| Method | Endpoint          | Description                   | Request Body          |
| ------ | ----------------- | ----------------------------- | --------------------- |
| POST   | `/api/auth/login` | Log in, returns JWT + admin   | `{ email, password }` |
| GET    | `/api/auth/me`    | Current admin (requires auth) | —                     |

Send the token on protected requests via the `Authorization: Bearer <token>` header.

### Player Auth

| Method | Endpoint                      | Description              |
| ------ | ----------------------------- | ------------------------ |
| POST   | `/api/user-auth/register`     | Register a new player    |
| POST   | `/api/user-auth/login`        | Log in, returns JWT      |
| GET    | `/api/user-auth/me`           | Current player profile   |
| POST   | `/api/user-auth/verify`       | Verify email with token  |

### Admin CRUD — Wheels

| Method | Endpoint          | Description          |
| ------ | ----------------- | -------------------- |
| GET    | `/api/wheels`     | List with pagination |
| GET    | `/api/wheels/:id` | Get by ID            |
| POST   | `/api/wheels`     | Create new           |
| PUT    | `/api/wheels/:id` | Update existing      |
| DELETE | `/api/wheels/:id` | Delete               |

### Admin CRUD — Slots

| Method | Endpoint         | Description          |
| ------ | ---------------- | -------------------- |
| GET    | `/api/slots`     | List with pagination |
| GET    | `/api/slots/:id` | Get by ID            |
| POST   | `/api/slots`     | Create new           |
| PUT    | `/api/slots/:id` | Update existing      |
| DELETE | `/api/slots/:id` | Delete               |

### Player Games (read-only, active only)

| Method | Endpoint                 | Description              |
| ------ | ------------------------ | ------------------------ |
| GET    | `/api/games/wheels`      | List active wheels       |
| GET    | `/api/games/wheels/:id`  | Get active wheel by ID   |
| GET    | `/api/games/slots`       | List active slots        |
| GET    | `/api/games/slots/:id`   | Get active slot by ID    |

### Player Play Actions

All play endpoints require a player JWT. Outcomes are computed server-side; the client only renders results.

**Balance on the server** is updated atomically when the play API responds (`balance >= stake` check, then apply net change).

**Balance in the UI** (header chip) updates when the spin animation finishes — reels stop or the wheel stops spinning — so the display stays in sync with the reveal. If you leave the page mid-animation, balance still syncs on unmount.

| Method | Endpoint              | Description                    | Request Body        |
| ------ | --------------------- | ------------------------------ | ------------------- |
| POST   | `/api/play/wheel/:id` | Spin a wheel                   | `{ bet }`           |
| POST   | `/api/play/slot/:id`  | Spin slot reels                | `{ bet, lines }`    |
| GET    | `/api/play/history`   | Paginated play history         | `?page=&limit=`     |

---

## Game economy (how much you pay & get)

Every play uses the same formula:

```
net change to balance = payout − stake
```

- **`payout`** — gross coins won from the result (before subtracting stake).
- **`stake`** — what you pay for the spin.
- **`amountWon` in API/history** — the **net** change (can be negative).

### Wheel

1. You pick a bet from the wheel’s configured `betSizes`.
2. Server picks a segment by **weight** (higher weight = more likely).
3. **Payout** (only for `coins` or `bonus` prize types):

   ```
   payout = prizeAmount × (your bet ÷ smallest allowed bet)
   ```

4. `freeSpin`, `nothing`, etc. → payout `0` (you still lose the bet).

**Example:** smallest bet `10`, prize `500 coins`, you bet `50` → payout `2500`, net `2500 − 50 = +2450`.

### Fruit slots

1. **Stake** = `bet per line × lines` (lines: 1, 3, or 9).
2. Each **winning payline** pays: `bet per line × symbol multiplier`.
3. **Total payout** = sum of all winning lines on that spin.
4. **Net** = payout − stake.

| Symbol | Multiplier |
| ------ | ---------- |
| 🍒 cherry | ×2 |
| 🍋 lemon | ×3 |
| 🍊 orange | ×4 |
| 🍓 strawberry | ×5 |
| 🍇 grape | ×8 |
| 🍉 watermelon | ×12 |

**Example:** bet/line `10`, `3` lines → stake `30`. One cherry line wins → payout `20`, net `−10` (you can “hit a line” but still lose overall).

### Reading the player UI

| UI element | Meaning |
| ---------- | ------- |
| Balance chip | Current coins |
| `SPIN · 30` | Total stake this spin |
| Toast “You won X coins!” | Gross **payout** |
| Result alert `+N` / `−N` | **Net** balance change |
| History “Result” column | Net change per play |

---

## Features

### Admin Dashboard

- **Wheel management** — Configure segments, weights, bet sizes, spin limits, and visual styling. Live wheel preview and animated spin on the detail page.
- **Slot management** — Configure win rate, bet sizes, and status.
- **Dark mode** — Toggle in sidebar, persisted via `localStorage`.
- **CSV export** — Export table data from list pages.
- **Drag-and-drop** — Reorder wheel segments using `@dnd-kit`.
- **Unsaved changes guard** — Warns before navigating away from dirty forms.

### Player Client

- **Registration & login** — Email/password auth with optional email verification.
- **Lobby** — Game picker with balance display.
- **Wheel of Fortune** — Animated spin with server-authoritative outcomes.
- **Fruit Slots** — 3×3 reels with 1, 3, or 9 paylines.
- **Play history** — Paginated table of all past plays.
- **Responsive UI** — Consistent design system with dark/light mode.
- **Production API URL** — Client/admin use `localhost:5000/api` in dev and the deployed Render API in production (`apps/*/src/shared/constants/urls.ts`).

### Static hosting (Netlify / Vercel)

Both frontends include `public/_redirects` for SPA routing:

```
/*    /index.html   200
```

Without this rule, direct URLs (e.g. `/login`) return 404 on static hosts. Rebuild and redeploy after changing `public/`.

---

## Testing

```bash
# Full quality gate (lint + test + TypeScript + build)
npm run check

# Admin unit tests only
npm run test:run

# Player client (passes even with no test files yet)
npm run client:test:run
```

---

## Documentation

Full technical documentation in Georgian: [`docs/DOCUMENTATION_KA.md`](docs/DOCUMENTATION_KA.md)

---

## Design Decisions (ქართულ ენაზე)

### 1. ფიჩერზე დაფუძნებული არქიტექტურა (Feature-Sliced Architecture)

პროექტის მთავარი არქიტექტურული გადაწყვეტილება იყო ფიჩერზე დაფუძნებული სტრუქტურის არჩევა, სადაც Wheel და Slot თითოეული წარმოადგენს სრულიად დამოუკიდებელ მოდულს. ყოველ მოდულს აქვს საკუთარი ტიპები, ვალიდაციის სქემები, API ფენა, React Query ჰუკები, კომპონენტები და გვერდები.

### 2. React Router Data Router + useBlocker

`BrowserRouter`-ის ნაცვლად გამოვიყენე `createBrowserRouter` (Data Router), რადგან `useBlocker` ჰუკი, რომელიც საჭიროა შეუნახავი ცვლილებების გაფრთხილებისთვის, მხოლოდ Data Router-ით მუშაობს.

### 3. სერვერ-ავტორიტეტული თამაშის ლოგიკა

ყველა თამაშის შედეგი (ბორბლის სეგმენტი, სლოტის გრიდი, მოგება) გამოითვლება სერვერზე. კლიენტი მხოლოდ აჩვენებს შედეგს — ეს უზრუნველყოფს უსაფრთხოებას და თაღლითობის პრევენციას.

---

## Bonus Features

- **Dark Mode** — Available in both admin and client apps.
- **Animated Wheel** — Interactive spin animation on wheel play pages.
- **CSV Export** — Export table data from admin list pages.
- **Unit Tests** — Vitest tests for Zod validation schemas and utilities.
