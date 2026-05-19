const express = require('express');
const router = express.Router();
const { dbAll, dbGet, dbRun } = require('../database/db');

// ─── GET /api/tasks ─────────────────────────────────────────
// Query params: status, priority, category_id, search
router.get('/', async (req, res) => {
  try {
    const { status, priority, category_id, search } = req.query;
    let sql = `
      SELECT t.*, c.name AS category_name, c.color AS category_color
      FROM tasks t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (status)      { sql += ' AND t.status = ?';      params.push(status); }
    if (priority)    { sql += ' AND t.priority = ?';    params.push(priority); }
    if (category_id) { sql += ' AND t.category_id = ?'; params.push(category_id); }
    if (search)      { sql += ' AND (t.title LIKE ? OR t.description LIKE ?)';
                       params.push(`%${search}%`, `%${search}%`); }

    sql += ' ORDER BY t.created_at DESC';

    const tasks = await dbAll(sql, params);
    res.json({ success: true, data: tasks, count: tasks.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /api/tasks/stats ────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const total      = await dbGet('SELECT COUNT(*) AS count FROM tasks');
    const pending    = await dbGet("SELECT COUNT(*) AS count FROM tasks WHERE status='pending'");
    const inProgress = await dbGet("SELECT COUNT(*) AS count FROM tasks WHERE status='in_progress'");
    const completed  = await dbGet("SELECT COUNT(*) AS count FROM tasks WHERE status='completed'");
    const highPrio   = await dbGet("SELECT COUNT(*) AS count FROM tasks WHERE priority='high' AND status != 'completed'");

    res.json({
      success: true,
      data: {
        total:      total.count,
        pending:    pending.count,
        inProgress: inProgress.count,
        completed:  completed.count,
        highPriority: highPrio.count,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /api/tasks/:id ──────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const task = await dbGet(
      `SELECT t.*, c.name AS category_name, c.color AS category_color
       FROM tasks t LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.id = ?`,
      [req.params.id]
    );
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── POST /api/tasks ─────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { title, description, status, priority, due_date, category_id } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const result = await dbRun(
      `INSERT INTO tasks (title, description, status, priority, due_date, category_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        title.trim(),
        description || null,
        status || 'pending',
        priority || 'medium',
        due_date || null,
        category_id || null,
      ]
    );

    const newTask = await dbGet(
      `SELECT t.*, c.name AS category_name, c.color AS category_color
       FROM tasks t LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.id = ?`,
      [result.lastID]
    );

    res.status(201).json({ success: true, data: newTask, message: 'Task created successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── PUT /api/tasks/:id ──────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const { title, description, status, priority, due_date, category_id } = req.body;
    const existing = await dbGet('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ success: false, message: 'Task not found' });

    await dbRun(
      `UPDATE tasks
       SET title=?, description=?, status=?, priority=?, due_date=?, category_id=?, updated_at=CURRENT_TIMESTAMP
       WHERE id=?`,
      [
        title ?? existing.title,
        description ?? existing.description,
        status ?? existing.status,
        priority ?? existing.priority,
        due_date ?? existing.due_date,
        category_id ?? existing.category_id,
        req.params.id,
      ]
    );

    const updated = await dbGet(
      `SELECT t.*, c.name AS category_name, c.color AS category_color
       FROM tasks t LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.id = ?`,
      [req.params.id]
    );

    res.json({ success: true, data: updated, message: 'Task updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── PATCH /api/tasks/:id/status ────────────────────────────
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['pending', 'in_progress', 'completed'];
    if (!valid.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const result = await dbRun(
      'UPDATE tasks SET status=?, updated_at=CURRENT_TIMESTAMP WHERE id=?',
      [status, req.params.id]
    );
    if (result.changes === 0) return res.status(404).json({ success: false, message: 'Task not found' });

    const updated = await dbGet('SELECT * FROM tasks WHERE id=?', [req.params.id]);
    res.json({ success: true, data: updated, message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── DELETE /api/tasks/:id ───────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const result = await dbRun('DELETE FROM tasks WHERE id = ?', [req.params.id]);
    if (result.changes === 0) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
