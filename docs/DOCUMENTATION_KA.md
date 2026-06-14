# Gaming Admin Platform — ტექნიკური დოკუმენტაცია

**ვერსია:** 1.0  
**ენა:** ქართული  
**თარიღი:** 2026 წლის 14 ივნისი

---

## სარჩევი

1. [შესავალი](#1-შესავალი)
2. [პროექტის მიმოხილვა](#2-პროექტის-მიმოხილვა)
3. [არქიტექტურა](#3-არქიტექტურა)
4. [ძირითადი ფუნქციები](#4-ძირითადი-ფუნქციები)
5. [დაყენება და ინსტალაცია](#5-დაყენება-და-ინსტალაცია)
6. [განვითარების სამუშაო პროცესი](#6-განვითარების-სამუშაო-პროცესი)
7. [API-ის სტრუქტურა](#7-api-ის-სტრუქტურა)
8. [გაშვება და დეპლოიმენტი](#8-გაშვება-და-დეპლოიმენტი)
9. [პრობლემების გადაჭრა](#9-პრობლემების-გადაჭრა)
10. [საუკეთესო პრაქტიკები](#10-საუკეთესო-პრაქტიკები)

---

## 1. შესავალი

**Gaming Admin Platform** არის სრული სტეკის (`full-stack`) ვებ-პლატფორმა, რომელიც ოპერატორებსა და მოთამაშეებს ერთიან გარემოში აერთიანებს. სისტემა სამ დამოუკიდებელ, მაგრამ ერთმანეთთან თავსებად აპლიკაციადაა ორგანიზებული:

| აპლიკაცია | საქაღალდე | პორტი | დანიშნულება |
|-----------|-----------|-------|-------------|
| Admin Dashboard | `apps/admin` | 3000 | თამაშების კონფიგურაცია და მართვა |
| Player Client | `apps/client` | 3001 | მოთამაშის ინტერფეისი — რეგისტრაცია, თამაში, ისტორია |
| Backend Server | `apps/server` | 5000 | `Express` REST API და `MongoDB` |

პროექტი აგებულია **npm workspaces** მონორეპოზიტორიის პრინციპით: ერთი root `package.json`, ერთი `node_modules` და სამი workspace (`admin`, `client`, `server`). ეს მიდგომა საშუალებას იძლევა დამოკიდებულებები ერთხელ დაინსტალირდეს, ხოლო სკრიპტები root დონიდან მართოს.

ამ დოკუმენტის მიზანია მოგაწოდოთ სრული, პრაქტიკული და პროფესიონალური სახელმძღვანელო პროექტის გასაგებად, განვითარებად, გაშვებად და მხარდაჭერად. დოკუმენტაცია მოიცავს არქიტექტურულ გადაწყვეტილებებს, API-ის აღწერას, ინსტალაციის ინსტრუქციებს და პრობლემების გადაჭრის რეკომენდაციებს.

---

## 2. პროექტის მიმოხილვა

### 2.1. დანიშნულება

პლატფორმა განკუთვნილია ონლაინ თამაშების მართვისა და მოთამაშეებისთვის მოწოდებისთვის. ადმინისტრატორს შეუძლია:

- შექმნას და რედაქტირებდეს **ბორბლის (Wheel)** კონფიგურაციებს — სეგმენტები, წონები, ფსონის ზომები, ვიზუალური პარამეტრები.
- შექმნას და რედაქტირებდეს **სლოტის (Slot)** კონფიგურაციებს — მოგების ალბათობა, ფსონის ზომები, სტატუსი.

მოთამაშეს შეუძლია:

- დარეგისტრირდეს და შევიდეს სისტემაში.
- აირჩიოს თამაში ლობიდან (`Lobby`).
- ითამაშოს ბორბალი ან ხილის სლოტი.
- ნახოს თავისი ბალანსი და თამაშის ისტორია.

### 2.2. თამაშების მოკლე აღწერა

**ბორბალი (Wheel / Spin-to-Win)** — მოთამაშე ირჩევს ფსონს და ატრიალებს ბორბალს. სერვერი წონების მიხედვით (`weighted random`) ირჩევს სეგმენტს და განსაზღვრავს მოგებას. კლიენტი მხოლოდ ანიმაციას აჩვენებს.

**სლოტი (Fruit Slots)** — 3×3 ბადის (`reel grid`) თამაში ხილის სიმბოლოებით. მოთამაშე ირჩევს 1, 3 ან 9 გადახდის ხაზს (`payline`). სერვერი `slotEngine.js`-ით გენერირებს შედეგს და ამოწმებს ხაზებს.

### 2.3. ტექნოლოგიური სტეკი

| შრე | ტექნოლოგია | დანიშნულება |
|-----|-----------|-------------|
| Frontend | `React 19`, `TypeScript`, `Vite 8` | ინტერფეისი და ტიპიზაცია |
| UI | `Material UI (MUI) 7` | კომპონენტების ბიბლიოთეკა |
| State | `TanStack React Query 5` | სერვერის მონაცემების ქეში და მუტაციები |
| Forms | `React Hook Form`, `Zod` | ფორმები და ვალიდაცია |
| HTTP | `Axios` | API კლიენტი ინტერცეპტორებით |
| Backend | `Express.js 5`, `Node.js 20+` | REST API |
| Database | `MongoDB`, `Mongoose 9` | მონაცემთა შენახვა |
| Auth | `JWT`, `bcryptjs` | ავტორიზაცია და პაროლის ჰეში |
| Testing | `Vitest`, `Testing Library` | ერთეულის ტესტები |
| Drag & Drop | `@dnd-kit` | ბორბლის სეგმენტების გადალაგება (admin) |

### 2.4. მონორეპოზიტორიის სტრუქტურა

```
gaming-admin/
├── apps/
│   ├── admin/      # ადმინისტრაციის პანელი (პორტი 3000)
│   ├── client/     # მოთამაშის აპლიკაცია (პორტი 3001)
│   └── server/     # REST API (პორტი 5000)
├── docs/
│   └── DOCUMENTATION_KA.md
├── package.json
└── README.MD
```

---

## 3. არქიტექტურა

### 3.1. Feature-Sliced Architecture (FSA)

პროექტის frontend-ები (`admin` და `client`) აგებულია **ფიჩერზე დაფუძნებული არქიტექტურით**. თითოეული ბიზნეს-ფუნქცია (მაგ. `wheel`, `slot`) წარმოადგენს დამოუკიდებელ მოდულს:

```
features/wheel/
├── api/           # API გამოძახებები და React Query hooks
├── components/    # UI კომპონენტები
├── pages/         # გვერდები (List, Create, Edit, Detail)
├── schemas/       # Zod ვალიდაციის სქემები
└── types/         # TypeScript ტიპები
```

**ძირითადი წესები:**

1. ფიჩერები **არ იმპორტირებენ** ერთმანეთისგან.
2. გაზიარებული კოდი (`shared/`) შეიცავს მხოლოდ უნივერსალურ უტილიტებს — `axios` კლიენტი, route კონსტანტები, ზოგადი კომპონენტები.
3. ფიჩერის წაშლა მოითხოვს მხოლოდ route-ის რეგისტრაციის განახლებას `AppRoutes.tsx`-ში — სხვა ფიჩერები არ ირღვევა.

ეს პრინციპი უზრუნველყოფს მოდულურობას: ახალი თამაშის დამატება იზოლირებული ფოლდერით ხდება, ხოლო არსებული კოდი მინიმალურად იცვლება.

### 3.2. Backend არქიტექტურა

Backend-ი ორგანიზებულია კლასიკური MVC-ის მსგავსად:

| ფოლდერი | დანიშნულება |
|---------|-------------|
| `models/` | Mongoose სქემები (`Wheel`, `Slot`, `User`, `Admin`, `PlayHistory`) |
| `controllers/` | ბიზნეს-ლოგიკა (CRUD, play, auth) |
| `routes/` | Express router-ები |
| `middleware/` | JWT ავთენტიფიკაცია (admin და player) |
| `lib/` | დამხმარე ბიბლიოთეკები (`slotEngine`) |
| `config/` | მონაცემთა ბაზის კავშირი |

`crudController.js` და `resource.js` უზრუნველყოფენ გენერიკულ CRUD ფაბრიკას, რომელიც `Wheel` და `Slot` რესურსებს ემსახურება. ეს ამცირებს კოდის დუბლირებას და უზრუნველყოფს ერთგვაროვან API ქცევას.

### 3.3. ორი API ზედაპირი

Backend-ი უზრუნველყოფს **ორ განსხვავებულ API-ს**:

1. **Admin API** (`/api/wheels`, `/api/slots`) — სრული CRUD, დაცული admin JWT-ით (`protect` middleware).
2. **Player API** (`/api/games/*`, `/api/play/*`) — მხოლოდ აქტიური თამაშების წაკითხვა და თამაში, დაცული player JWT-ით (`protectUser` middleware).

ეს განცალკევება უზრუნველყოფს, რომ მოთამაშეებს არ ჰქონდეთ ადმინისტრაციული ოპერაციების წვდომა, ხოლო admin-ს არ სჭირდება player-ის სპეციფიკური endpoints.

### 3.4. სერვერ-ავტორიტეტული თამაში

**ყველა თამაშის შედეგი გამოითვლება სერვერზე.** კლიენტი არასდროს განსაზღვრავს მოგებას — ის მხოლოდ აჩვენებს სერვერის პასუხს. ეს აუცილებელია:

- თაღლითობის პრევენციისთვის.
- ბალანსის კონსისტენტობისთვის.
- `PlayHistory`-ის სწორი ჩაწერისთვის.

**ბორბალი:** სერვერი `weightedPick()` ფუნქციით ირჩევს სეგმენტს წონების მიხედვით. მოგება გამოითვლება `prizeType` და `prizeAmount`-ის საფუძველზე.

**სლოტი:** სერვერი `slotEngine.js`-ით გენერირებს 3×3 გრიდს, ამოწმებს არჩეულ payline-ებს და აბრუნებს მოგების ოდენობას. `winRate` პარამეტრი (0–100%) განსაზღვრავს მოგების სპინის ალბათობას.

### 2.5. ეკონომიკა და ბალანსი

ყოველი თამაში იყენებს ერთ ფორმულას:

```
ბალანსის ცვლილება (net) = payout − stake
```

- **`stake`** — რასაც იხდით ამ სპინისთვის.
- **`payout`** — მთლიანი მოგება შედეგიდან (ფსონის გამოკლებამდე).
- **`amountWon`** API-ში და ისტორიაში — **net** ცვლილება (შეიძლება იყოს უარყოფითი).

**ბორბალი:**

- ფსონი: არჩეული `bet` `betSizes`-დან.
- მოგება მხოლოდ `coins` / `bonus` ტიპისთვის: `payout = prizeAmount × (bet ÷ min(betSizes))`.
- `freeSpin`, `nothing` → payout `0` (ფსონი მაინც იკარიება).

**სლოტი:**

- `stake = bet × lines` (lines: 1, 3 ან 9).
- თითო მოგებული ხაზი: `bet × სიმბოლოს მულტიპლიკატორი` (🍒×2 … 🍉×12).
- `payout` = ყველა მოგებული ხაზის ჯამი.

**UI ბალანსი:** სერვერზე ბალანსი იცვლება API პასუხისთანავე (ატომური `$gte stake` შემოწმებით). ჰედერის chip კი **ანიმაციის დასრულების შემდეგ** განახლდება — რილების გაჩერება / ბორბლის შეჩერება — რათა ვიზუალი და თანხა ერთად „გამოჩნდეს“.

### 3.5. მონაცემთა მოდელები

| მოდელი | აღწერა |
|--------|--------|
| `Wheel` | ბორბლის კონფიგურაცია: სეგმენტები, betSizes, maxSpinsPerUser, spinCost |
| `Slot` | სლოტის კონფიგურაცია: winRate, betSizes, სტატუსი |
| `User` | მოთამაშის ანგარიში: email, balance, isVerified |
| `Admin` | ადმინისტრატორი: email, bcrypt-ჰეშირებული პაროლი, role |
| `PlayHistory` | თამაშის ჩანაწერი: gameType, bet, outcome, amountWon, balanceAfter |

---

## 4. ძირითადი ფუნქციები

### 4.1. Admin Dashboard

#### ბორბალი (Wheel)

- სეგმენტების CRUD (`label`, `color`, `weight`, `prizeType`, `prizeAmount`).
- Drag-and-drop სეგმენტების გადალაგება (`@dnd-kit`).
- ცოცხალი SVG preview და ანიმირებული spin demo detail გვერდზე.
- `betSizes`, `maxSpinsPerUser`, `spinCost`, `backgroundColor`, `borderColor`.
- სტატუსები: `draft`, `active`.

#### სლოტი (Slot)

- `name`, `description`, `winRate` (0–100%), `betSizes`.
- სტატუსები: `draft`, `active`.

#### საერთო admin ფუნქციები

- Dark/Light mode (`localStorage`-ში ინახება).
- CSV export list გვერდებიდან.
- Pagination, sorting, status filter.
- Unsaved changes guard (`useBlocker` — `createBrowserRouter`-თან).
- Toast შეტყობინებები (`react-hot-toast`).

### 4.2. Player Client

#### ავთენტიფიკაცია

- რეგისტრაცია (`email`, `password`, `name`).
- შესვლა (JWT token `localStorage`-ში).
- ელფოსტის ვერიფიკაცია (`Resend` API-ით, თუ `RESEND_API_KEY` კონფიგურირებულია; dev რეჟიმში ბმული კონსოლში იბეჭდება).

#### ლობი (Lobby)

- მისალმების banner ბალანსით.
- `GameCard`-ები Slots, Wheels და History-ზე გადასასვლელად.
- ბალანსის chip განახლდება spin-ის ანიმაციის დასრულების შემდეგ (სერვერზე უკვე განახლებულია).

#### ბორბალი

- SVG ანიმაცია spin-ის დროს.
- `BetSelector` — ფსონის არჩევა.
- სეგმენტების სია sidebar-ში.

#### სლოტი

- 3×3 reel grid ანიმაციით.
- 1, 3 ან 9 payline-ის არჩევა.
- Paytable sidebar-ში.
- მოგებული უჯრების highlight spin-ის შემდეგ.

#### ისტორია

- Paginated ცხრილი: `gameType`, `gameName`, `outcome`, `bet`, `result`, `balance`, `timestamp`.
- Responsive — მობილურზე ზოგიერთი სვეტი იმალება.

---

## 5. დაყენება და ინსტალაცია

### 5.1. წინაპირობები

- **Node.js** 20 ან უფრო ახალი
- **npm** 9 ან უფრო ახალი
- **MongoDB** — Atlas cloud ან ლოკალური ინსტანცია
- **Git** — რეპოზიტორიის კლონირებისთვის

### 5.2. ნაბიჯ-ნაბიჯ ინსტალაცია

```bash
# 1. რეპოზიტორიის კლონირება
git clone <repo-url>
cd gaming-admin

# 2. დამოკიდებულებების ინსტალაცია
npm install

# 3. გარემოს ცვლადების კონფიგურაცია
cp apps/server/.env.example apps/server/.env
```

`.env` ფაილში დააყენეთ:

```env
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/gaming
JWT_SECRET=your-very-long-random-secret-string
JWT_EXPIRES_IN=7d
PORT=5000
DEFAULT_BALANCE=1000
```

```bash
# 4. მონაცემთა ბაზის seed
npm run seed

# 5. ყველა სერვისის გაშვება
npm run start:all
```

### 5.3. Default მომხმარებლები

Seed-ის შემდეგ:

| როლი | Email | Password |
|------|-------|----------|
| Admin | admin@gaming.com | admin123 |

ახალი admin-ის დამატება:

```bash
npm run create-admin -- email@example.com password123 "Admin Name" admin
```

`role` შეიძლება იყოს `admin` (ნაგულისხმევი) ან `superadmin`. არსებული email-ის გამეორებით გაშვება განაახლებს პაროლს, სახელსა და როლს.

### 5.4. პორტები და URL-ები

| სერვისი | URL | აღწერა |
|---------|-----|--------|
| Admin | http://localhost:3000 | ადმინ პანელი |
| Client | http://localhost:3001 | მოთამაშის აპი |
| Server | http://localhost:5000 | REST API |

Vite dev server-ები proxy-ს `/api` მოთხოვნებს `localhost:5000`-ზე, ამიტომ frontend-ები და backend ურთიერთობენ ერთი origin-ის მეშვეობით განვითარების დროს.

### 5.5. გარემოს ცვლადები

| ცვლადი | აღწერა | მაგალითი |
|--------|--------|----------|
| `MONGO_URI` | MongoDB კავშირის სტრიქონი | `mongodb+srv://...` |
| `JWT_SECRET` | JWT ხელმოწერის საიდუმლო | გრძელი შემთხვევითი სტრიქონი |
| `JWT_EXPIRES_IN` | ტოკენის ვადა | `7d` |
| `PORT` | API სერვერის პორტი | `5000` |
| `DEFAULT_BALANCE` | ახალი მოთამაშის საწყისი ბალანსი | `1000` |
| `CLIENT_URL` | მოთამაშის აპის URL (ვერიფიკაციის ბმულები) | `http://localhost:3001` |
| `RESEND_API_KEY` | ელფოსტის ვერიფიკაცია (არასავალდებულო) | — |

> `apps/server/.env` gitignore-შია. არასდროს commit-ეთ რეალურ credentials-ებს.

---

## 6. განვითარების სამუშაო პროცესი

### 6.1. Root სკრიპტები

| ბრძანება | აღწერა |
|----------|--------|
| `npm run dev` | Admin dev server (პორტი 3000) |
| `npm run dev:admin` | იგივე, რაც `dev` |
| `npm run client` | Client dev server (პორტი 3001) |
| `npm run dev:client` | იგივე, რაც `client` |
| `npm run server` | Backend API (პორტი 5000) |
| `npm run start:all` | სამივე ერთად (`concurrently`) |
| `npm run check` | lint + test + tsc + build (CI-სთვის) |
| `npm run lint:all` | Client + Admin ESLint |
| `npm run build:all` | ორივე frontend production build |
| `npm run test:all` | ყველა unit test ერთხელ |
| `npm run build` | Admin production build |
| `npm run client:build` | Client production build |
| `npm run test:run` | Admin unit tests |
| `npm run client:test:run` | Client unit tests |
| `npm run lint` | Admin ESLint |
| `npm run client:lint` | Client ESLint |
| `npm run seed` | DB reset + sample data |
| `npm run create-admin` | Admin მომხმარებლის დამატება/განახლება |

Workspace-ის დონეზე ბრძანებებიც მუშაობს, მაგ.: `npm run lint --workspace client`.

### 6.2. ახალი ფიჩერის დამატება

1. შექმენით `apps/admin/src/features/<name>/` სტრუქტურა FSA-ის მიხედვით.
2. დაამატეთ Mongoose model `apps/server/models/`.
3. დაარეგისტრირეთ route `apps/server/index.js`-ში `resourceRouter()`-ით.
4. Player read/play endpoints — `games.js` და `playController.js`.
5. Client UI — `apps/client/src/features/games/<name>/`.
6. Route-ები — admin და client `AppRoutes.tsx`, `routes.ts`, Sidebar/Nav.

### 6.3. კოდის სტილი

- TypeScript strict mode frontend-ებში.
- Zod schema + `z.infer` ტიპებისთვის.
- React Query cache invalidation mutation-ის შემდეგ.
- MUI `sx` prop styling-ისთვის.
- Async controller შეცდომები — Express central error handler.

### 6.4. ტესტირება

Admin-ში Vitest ტესტები:

- Zod schema validation (`schemas/__tests__/`).
- Utility functions (`shared/lib/__tests__/`).

```bash
npm run test:run
npm run test:run --workspace client
```

---

## 7. API-ის სტრუქტურა

Base URL: `http://localhost:5000/api` (Vite proxy-ით `/api` განვითარების დროს).

### 7.1. Admin Auth

| Method | Endpoint | აღწერა | Request Body |
|--------|----------|--------|--------------|
| POST | `/api/auth/login` | შესვლა, აბრუნებს JWT + admin | `{ email, password }` |
| GET | `/api/auth/me` | მიმდინარე admin (საჭიროებს auth) | — |

დაცულ მოთხოვნებზე გაგზავნეთ: `Authorization: Bearer <token>`.

### 7.2. Player Auth

| Method | Endpoint | აღწერა |
|--------|----------|--------|
| POST | `/api/user-auth/register` | ახალი მოთამაშის რეგისტრაცია |
| POST | `/api/user-auth/login` | შესვლა, აბრუნებს JWT |
| GET | `/api/user-auth/me` | მიმდინარე მოთამაშის პროფილი |
| POST | `/api/user-auth/verify` | ელფოსტის ვერიფიკაცია `{ token }`-ით |

### 7.3. Admin CRUD — Wheels

| Method | Endpoint | აღწერა |
|--------|----------|--------|
| GET | `/api/wheels` | სია pagination-ით |
| GET | `/api/wheels/:id` | ID-ით მიღება |
| POST | `/api/wheels` | შექმნა |
| PUT | `/api/wheels/:id` | განახლება |
| DELETE | `/api/wheels/:id` | წაშლა |

### 7.4. Admin CRUD — Slots

| Method | Endpoint | აღწერა |
|--------|----------|--------|
| GET | `/api/slots` | სია pagination-ით |
| GET | `/api/slots/:id` | ID-ით მიღება |
| POST | `/api/slots` | შექმნა |
| PUT | `/api/slots/:id` | განახლება |
| DELETE | `/api/slots/:id` | წაშლა |

List endpoints-ის query პარამეტრები: `page`, `limit`, `sortBy`, `order`, `status`.

### 7.5. Player Games (მხოლოდ წაკითხვა, აქტიური)

| Method | Endpoint | აღწერა |
|--------|----------|--------|
| GET | `/api/games/wheels` | აქტიური ბორბლების სია |
| GET | `/api/games/wheels/:id` | აქტიური ბორბალი ID-ით |
| GET | `/api/games/slots` | აქტიური სლოტების სია |
| GET | `/api/games/slots/:id` | აქტიური სლოტი ID-ით |

### 7.6. Player Play Actions

ყველა play endpoint საჭიროებს player JWT-ს. შედეგები სერვერზე გამოითვლება.

| Method | Endpoint | აღწერა | Request Body |
|--------|----------|--------|--------------|
| POST | `/api/play/wheel/:id` | ბორბლის ატრიალება | `{ bet }` |
| POST | `/api/play/slot/:id` | სლოტის spin | `{ bet, lines }` — lines: 1, 3, 9 |
| GET | `/api/play/history` | თამაშის ისტორია | `?page=&limit=` |

### 7.7. PlayHistory მოდელი

| ველი | ტიპი | აღწერა |
|------|------|--------|
| `userId` | ObjectId | მოთამაშის ID |
| `gameType` | `wheel` \| `slot` | თამაშის ტიპი |
| `gameId` | ObjectId | თამაშის ID |
| `gameName` | String | თამაშის სახელი |
| `bet` | Number | ფსონი |
| `outcome` | String | შედეგის აღწერა |
| `amountWon` | Number | ბალანსის ცვლილება (net) |
| `balanceAfter` | Number | ბალანსი თამაშის შემდეგ |

---

## 8. გაშვება და დეპლოიმენტი

### 8.1. Production Build

```bash
# Admin
npm run build

# Client
npm run client:build
```

Build artifacts:

- `apps/admin/dist/` — static ფაილები admin-ისთვის.
- `apps/client/dist/` — static ფაილები client-ისთვის.

### 8.2. Backend Production

```bash
cd apps/server
NODE_ENV=production node index.js
```

**Production checklist:**

- [ ] `JWT_SECRET` — ძლიერი, უნიკალური სტრიქონი (არასდროს commit).
- [ ] `MONGO_URI` — production cluster.
- [ ] CORS — დაარეგულირეთ allowed origins.
- [ ] HTTPS — reverse proxy (`Nginx`, `Caddy`) SSL-ით.
- [ ] Process manager — `PM2`, `systemd`, `Docker`.

### 8.3. Static Frontend Hosting

Admin და Client build-ები შეიძლება განთავსდეს:

- **Nginx** — `root` → `dist/`, `try_files $uri /index.html`.
- **Vercel / Netlify** — SPA redirect rule (`apps/*/public/_redirects`):

  ```
  /*    /index.html   200
  ```

  პირდაპირი URL-ებზე (მაგ. `/login`) ეს rule გარეშე 404 დააბრუნებს.
- **S3 + CloudFront** — static hosting.

Production-ში client/admin axios `baseURL` არის სრული API მისამართი (`urls.ts`: dev → `http://localhost:5000/api`, prod → Render URL). Vite proxy მხოლოდ განვითარების დროს მუშაობს.

API proxy მაგალითი:

```nginx
location /api {
    proxy_pass http://localhost:5000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

### 8.4. Docker

Server-ისთვის Dockerfile მაგალითი:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY apps/server/package*.json ./
RUN npm ci --omit=dev
COPY apps/server/ .
EXPOSE 5000
CMD ["node", "index.js"]
```

`Docker Compose`-ით `MongoDB` + Server + Nginx (static) შეიძლება ერთად დაიორკესტრიროს.

### 8.5. CI/CD

რეკომენდებული pipeline:

1. `npm install`
2. `npm run check` (ან ცალ-ცალკე: `lint:all`, `test:all`, `tsc -b`, `build:all`)
3. Deploy artifacts

---

## 9. პრობლემების გადაჭრა

### 9.1. MongoDB კავშირი

**სიმპტომი:** `MongooseServerSelectionError: connect ECONNREFUSED`

**გადაწყვეტა:**

- შეამოწმეთ `MONGO_URI` `.env`-ში.
- Atlas-ზე: IP whitelist (`0.0.0.0/0` dev-ისთვის).
- ლოკალური MongoDB: `sudo systemctl start mongod`.

### 9.2. API 401 Unauthorized

**სიმპტომი:** დაცული endpoint-ები 401-ს აბრუნებენ.

**გადაწყვეტა:**

- Token `localStorage`-ში (admin ან client auth).
- Token-ის ვადა (`JWT_EXPIRES_IN`).
- Header: `Authorization: Bearer <token>`.
- Admin vs Player token — სწორი middleware.

### 9.3. Vite Proxy არ მუშაობს

**სიმპტომი:** Frontend `/api/*` → 404.

**გადაწყვეტა:**

- Server გაშვებულია პორტ 5000-ზე?
- `vite.config.ts` proxy target: `http://localhost:5000` (მხოლოდ dev).
- Client/admin `BACKEND_BASE_URL`: dev-ში `http://localhost:5000/api`.

### 9.4. Seed ვერ მუშაობს

**სიმპტომი:** `Seed complete` არ ჩანს ან error.

**გადაწყვეტა:**

- MongoDB ხელმისაწვდომია.
- `.env` loaded (`dotenv` seed.js-ის თავში).
- Duplicate key errors — `deleteMany` seed-ში უნდა გაეშვას.

### 9.5. Build TypeScript Errors

**სიმპტომი:** `tsc -b` fails.

**გადაწყვეტა:**

- `npm install` root-დან.
- Import paths — `@/` alias `vite.config` + `tsconfig`.
- წაშლილი ფიჩერის orphaned imports — `grep`-ით მოძებნეთ.

### 9.6. Insufficient Balance (Play)

**სიმპტომი:** 400 "Insufficient balance".

**გადაწყვეტა:**

- `User` მოდელის `balance` — default `DEFAULT_BALANCE` (1000) რეგისტრაციაში.
- Admin-მა manually DB-ში შეიძლება გაზარდოს.

### 9.7. CORS Production-ში

**სიმპტომი:** Browser ბლოკავს API მოთხოვნებს.

**გადაწყვეტა:**

- `cors()` middleware server-ში — production-ში restrict origins.
- Same-origin proxy (Nginx `/api` → backend) — CORS არ სჭირდება.

### 9.9. Netlify / SPA — 404 პირდაპირ route-ზე

**სიმპტომი:** `/login` ან `/wheels/:id` გვიდებაზე 404.

**გადაწყვეტა:**

- დარწმუნდით, რომ `apps/client/public/_redirects` (და admin-ის ანალოგი) build-ში შედის.
- შემდეგ `npm run client:build` და თავიდან deploy.

### 9.10. Spin Limit (Wheel)

**სიმპტომი:** 403 "You have reached the spin limit for this wheel".

**გადაწყვეტა:**

- ბორბალს აქვს `maxSpinsPerUser` — შეამოწმეთ `PlayHistory` ჩანაწერები.
- Admin-მა შეიძლება გაზარდოს ლიმიტი ან წაშალოს ისტორია dev-ისთვის.

---

## 10. საუკეთესო პრაქტიკები

### 10.1. უსაფრთხოება

1. **JWT_SECRET** — მინიმუმ 32 შემთხვევითი სიმბოლო; პერიოდულად შეცვალეთ.
2. **Passwords** — bcrypt hash (`Admin`/`User` models pre-save hook).
3. **Never trust client** — ყველა payout server-side.
4. **Rate limiting** — production-ში დაამატეთ `express-rate-limit` play endpoints-ზე.
5. **Input validation** — Zod (frontend) + Mongoose schema (backend).

### 10.2. არქიტექტურა

1. **Feature isolation** — ახალი ფიჩერი = ახალი `features/<name>/` ფოლდერი.
2. **Shared code** — მხოლოდ generic utilities `shared/`-ში.
3. **Query keys** — ცენტრალიზებული factory (`queryKeys.ts`).
4. **Route constants** — `routes.ts`, hardcoded paths არა.

### 10.3. Frontend

1. **React Query** — `staleTime`, cache invalidation mutation-ის შემდეგ.
2. **Loading/Error/Empty states** — `QueryState` კომპონენტი.
3. **Responsive design** — MUI breakpoints, `display: { xs, sm, md }`.
4. **Theme consistency** — `ThemeProvider`, shared typography/spacing.
5. **Accessibility** — MUI კომპონენტები, სემანტიკური HTML, tooltips.

### 10.4. Backend

1. **Async error handling** — ცენტრალური Express error middleware.
2. **Indexes** — `PlayHistory` `userId`, unique indexes საჭიროებისამებრ.
3. **Idempotent seed** — admin შექმნამდე არსებობის შემოწმება.
4. **Environment separation** — `.env` გარემოზე, საიდუმლოებები არასდროს commit.

### 10.5. Git და თანამშრომლობა

1. **Branch strategy** — feature branches, PR reviews.
2. **Commit messages** — იმპერატიული ფორმა, ფოკუსი „რატომ"-ზე.
3. **Pre-commit** — lint + test merge-მდე.
4. **Documentation** — README და `docs/` განახლება არქიტექტურული ცვლილებებისას.

### 10.6. Performance

1. **Pagination** — list endpoints ყოველთვის paginated.
2. **Lazy loading** — admin routes `Suspense` + lazy import (არასავალდებულო).
3. **MongoDB projections** — დიდ სიებში მხოლოდ საჭირო ველები.
4. **Static assets** — CDN production frontend build-ებისთვის.

---

## დასკვნა

Gaming Admin Platform არის მოდულური, გაფართოებადი და production-ready არქიტექტურით აგებული სისტემა. Feature-sliced frontend, server-authoritative game logic და monorepo workspace-ები უზრუნველყოფენ:

- **მარტივ განვითარებას** — ახალი თამაშის დამატება იზოლირებული მოდულით.
- **უსაფრთხოებას** — ყველა payout server-side.
- **მოქნილობას** — admin, client და server დამოუკიდებლად deploy-დება.

დამატებითი ინგლისური დოკუმენტაცია: [`README.MD`](../README.MD)

---

*დოკუმენტი მომზადებულია Gaming Admin Platform პროექტისთვის.*
