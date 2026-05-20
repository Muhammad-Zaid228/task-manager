# TaskFlow — Task Manager App

A full-stack Task Manager (To-Do) application built for learning CI/CD pipelines.

## Tech Stack

| Layer     | Technology              |
|-----------|-------------------------|
| Frontend  | React + Vite            |
| Backend   | Node.js + Express       |
| Database  | SQLite                  |
| Styling   | Vanilla CSS (Glassmorphism dark theme) |

## Project Structure

```
task-manager/
├── backend/
│   ├── database/
│   │   ├── db.js          # SQLite connection & helpers
│   │   └── schema.sql     # Database schema + seed data
│   ├── routes/
│   │   ├── tasks.js       # Task CRUD endpoints
│   │   └── categories.js  # Category endpoints
│   ├── server.js          # Express entry point
│   ├── .env               # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TaskBoard.jsx
│   │   │   └── TaskForm.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   └── package.json
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites
- Node.js v18+
- npm

### Installation

```bash
# Clone the repo
git clone https://github.com/<your-username>/task-manager.git
cd task-manager

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### Running Locally

```bash
# Terminal 1 — Backend (port 5000)
cd backend && npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend && npm run dev
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

## API Endpoints

| Method   | Route                    | Description            |
|----------|--------------------------|------------------------|
| GET      | `/api/tasks`             | List all tasks         |
| GET      | `/api/tasks/stats`       | Get task statistics    |
| GET      | `/api/tasks/:id`         | Get a single task      |
| POST     | `/api/tasks`             | Create a task          |
| PUT      | `/api/tasks/:id`         | Update a task          |
| PATCH    | `/api/tasks/:id/status`  | Update task status     |
| DELETE   | `/api/tasks/:id`         | Delete a task          |
| GET      | `/api/categories`        | List categories        |
| POST     | `/api/categories`        | Create a category      |
| DELETE   | `/api/categories/:id`    | Delete a category      |

## License
MIT
