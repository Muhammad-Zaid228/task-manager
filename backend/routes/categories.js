const express = require('express');
const router = express.Router();
const { dbAll, dbGet, dbRun } = require('../database/db');

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const categories = await dbAll(
      `SELECT c.*, COUNT(t.id) AS task_count
       FROM categories c
       LEFT JOIN tasks t ON t.category_id = c.id
       GROUP BY c.id
       ORDER BY c.name ASC`
    );
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/categories
router.post('/', async (req, res) => {
  try {
    const { name, color } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }
    const result = await dbRun(
      'INSERT INTO categories (name, color) VALUES (?, ?)',
      [name.trim(), color || '#6366f1']
    );
    const created = await dbGet('SELECT * FROM categories WHERE id = ?', [result.lastID]);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ success: false, message: 'Category already exists' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/categories/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await dbRun('DELETE FROM categories WHERE id = ?', [req.params.id]);
    if (result.changes === 0) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
