-- ============================================================
--  Task Manager Database Schema
--  Database: SQLite
-- ============================================================

-- Drop tables if they exist (useful for fresh migrations)
DROP TABLE IF EXISTS task_tags;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE users (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  username   TEXT    NOT NULL UNIQUE,
  email      TEXT    NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- CATEGORIES TABLE
-- ============================================================
CREATE TABLE categories (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT    NOT NULL UNIQUE,
  color      TEXT    NOT NULL DEFAULT '#6366f1',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TASKS TABLE
-- ============================================================
CREATE TABLE tasks (
  id          INTEGER  PRIMARY KEY AUTOINCREMENT,
  title       TEXT     NOT NULL,
  description TEXT,
  status      TEXT     NOT NULL DEFAULT 'pending'
                       CHECK(status IN ('pending', 'in_progress', 'completed')),
  priority    TEXT     NOT NULL DEFAULT 'medium'
                       CHECK(priority IN ('low', 'medium', 'high')),
  due_date    DATETIME,
  category_id INTEGER  REFERENCES categories(id) ON DELETE SET NULL,
  user_id     INTEGER  REFERENCES users(id) ON DELETE CASCADE,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TAGS TABLE
-- ============================================================
CREATE TABLE tags (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT    NOT NULL UNIQUE
);

-- ============================================================
-- TASK_TAGS (Many-to-Many join table)
-- ============================================================
CREATE TABLE task_tags (
  task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  tag_id  INTEGER NOT NULL REFERENCES tags(id)  ON DELETE CASCADE,
  PRIMARY KEY (task_id, tag_id)
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_tasks_status      ON tasks(status);
CREATE INDEX idx_tasks_priority    ON tasks(priority);
CREATE INDEX idx_tasks_category_id ON tasks(category_id);
CREATE INDEX idx_tasks_user_id     ON tasks(user_id);
CREATE INDEX idx_tasks_due_date    ON tasks(due_date);

-- ============================================================
-- SEED DATA
-- ============================================================
INSERT INTO categories (name, color) VALUES
  ('Work',     '#6366f1'),
  ('Personal', '#ec4899'),
  ('Shopping', '#f59e0b'),
  ('Health',   '#10b981'),
  ('Learning', '#3b82f6');

INSERT INTO tasks (title, description, status, priority, category_id, due_date) VALUES
  ('Set up CI/CD pipeline',       'Configure GitHub Actions for automated testing and deployment', 'in_progress', 'high',   1, datetime('now', '+3 days')),
  ('Write unit tests',            'Add Jest tests for all API endpoints',                         'pending',     'high',   1, datetime('now', '+5 days')),
  ('Design database schema',      'Model entities and relationships for the app',                 'completed',   'medium', 5, datetime('now', '-1 days')),
  ('Buy groceries',               'Milk, bread, eggs, and vegetables',                            'pending',     'low',    3, datetime('now', '+1 days')),
  ('Morning workout',             '30 minutes cardio + stretching',                               'completed',   'medium', 4, datetime('now')),
  ('Read Clean Code book',        'Finish chapters 5–8',                                          'in_progress', 'low',    5, datetime('now', '+7 days')),
  ('Deploy to production',        'Use Docker + Nginx for the final deployment',                  'pending',     'high',   1, datetime('now', '+10 days'));
