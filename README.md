# Calendar Task Manager

A full-stack calendar application built with **Next.js 16**, **React 19**, **MongoDB**, and **styled-components**. It displays a monthly calendar view with task management per day, and automatically fetches Ukrainian public holidays from an external API.


## Prerequisites

- **Node.js** 18.17+ (or 20+)
- **npm** 9+
- A running **MongoDB** instance 

---

## Getting Started Localy

### 1. Clone the repository

```bash
git clone https://github.com/PLATnya/calendar_test.git
cd calendar_test
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the environment

Create a `.env.local` file in the project root and set the MongoDB connection string:

```env
MONGODB_URI=mongodb://localhost:27017/calendar_db
```

### 4. Verify the MongoDB connection (optional)

Run the built-in connection check script:

```bash
npm run db:check
```

This script connects to MongoDB, prints the database name, host, port, and lists all existing collections, then disconnects.

### 5. Start the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

---

## Run with Docker
### 1. Clone the repository

```bash
git clone https://github.com/PLATnya/calendar_test.git
cd calendar_test
```

### 2. Build and run the Docker containers

```bash
docker compose up --build -d
```


## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Next.js in development mode with hot-reload |
| `npm run build` | Build the application for production |
| `npm start` | Start the production server (requires `build` first) |
| `npm run lint` | Run ESLint across the project |
| `npm run format` | Format all files with Prettier |
| `npm run format:check` | Check formatting without modifying files |
| `npm run db:check` | Verify MongoDB connectivity and list collections |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx           # Main calendar page (client component)
│   ├── layout.tsx         # Root layout with styled-components registry
│   ├── error.tsx          # Global error boundary
│   ├── loading.tsx        # Global loading state
│   ├── not-found.tsx      # 404 page
│   ├── globals.css        # Global CSS reset
│   └── api/
│       └── tasks/
│           ├── route.ts         # GET (list), POST (create) tasks
│           ├── [id]/route.ts    # GET, PUT, DELETE single task
│           └── reorder/route.ts # PATCH reorder tasks within a day
├── core/
│   └── calendar-layout.ts # Pure calendar grid computation logic
├── hooks/
│   ├── use-tasks.ts         # Task CRUD state, holiday fetching, optimistic updates
│   └── use-calendar-layout.ts # Calendar grid memoization hook
├── lib/
│   ├── mongodb.ts           # Mongoose connection with global caching
│   ├── task-model.ts        # Mongoose Task schema and model
│   └── registry.tsx         # styled-components SSR registry (Next.js App Router)
└── styles/
    ├── theme.ts             # Design tokens (colors, spacing, radii, shadows)
    ├── animations.ts        # Keyframe animations
    ├── GlobalStyles.ts      # Global styled-components styles
    ├── CalendarStyles.ts    # All calendar UI component styles
    ├── ThemeProvider.tsx    # Wraps app with styled-components ThemeProvider
    └── ...                  # Other page-specific style files

scripts/
└── check-mongodb.ts         # MongoDB connectivity diagnostic script

postman/
└── calendar-api.json        # Postman collection for the REST API
```

---

## REST API

The application exposes a REST API under `/api/tasks`.

### `GET /api/tasks`
Returns all tasks sorted by date and order.

### `POST /api/tasks`
Creates a new task.

**Body:**
```json
{
  "title": "Team meeting",
  "description": "Weekly sync",
  "day": 15,
  "month": 6,
  "year": 2025
}
```

### `PUT /api/tasks/:id`
Updates a task by its MongoDB `_id`.

### `DELETE /api/tasks/:id`
Deletes a task by its MongoDB `_id`.

### `PATCH /api/tasks/reorder`
Reorders tasks within a specific day.

**Body:**
```json
{
  "day": 15,
  "month": 6,
  "year": 2025,
  "taskIds": ["<id1>", "<id2>", "<id3>"]
}
```

Import the ready-made [Postman collection](postman/calendar-api.json) to explore the API interactively.
