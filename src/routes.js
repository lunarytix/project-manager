const express = require('express');
const router = express.Router();
const db = require('./db');

const VALID_STATUSES = ['pending', 'in-progress', 'completed', 'on-hold', 'cancelled'];
const VALID_PRIORITIES = ['low', 'medium', 'high', 'critical'];

// GET /api/projects - List all projects
router.get('/', (req, res) => {
  const { status, priority, search } = req.query;
  let query = 'SELECT * FROM projects WHERE 1=1';
  const params = [];

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }
  if (priority) {
    query += ' AND priority = ?';
    params.push(priority);
  }
  if (search) {
    query += ' AND (name LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY created_at DESC';

  const projects = db.prepare(query).all(...params);
  res.json(projects);
});

// GET /api/projects/:id - Get a single project
router.get('/:id', (req, res) => {
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.json(project);
});

// POST /api/projects - Create a project
router.post('/', (req, res) => {
  const { name, description, status, priority, due_date } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Project name is required' });
  }
  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
  }
  if (priority && !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({ error: `Invalid priority. Must be one of: ${VALID_PRIORITIES.join(', ')}` });
  }

  const result = db.prepare(`
    INSERT INTO projects (name, description, status, priority, due_date)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    name.trim(),
    description || null,
    status || 'pending',
    priority || 'medium',
    due_date || null
  );

  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(project);
});

// PUT /api/projects/:id - Update a project
router.put('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const { name, description, status, priority, due_date } = req.body;

  if (name !== undefined && !name.trim()) {
    return res.status(400).json({ error: 'Project name cannot be empty' });
  }
  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
  }
  if (priority && !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({ error: `Invalid priority. Must be one of: ${VALID_PRIORITIES.join(', ')}` });
  }

  db.prepare(`
    UPDATE projects SET
      name = ?,
      description = ?,
      status = ?,
      priority = ?,
      due_date = ?,
      updated_at = datetime('now')
    WHERE id = ?
  `).run(
    name !== undefined ? name.trim() : existing.name,
    description !== undefined ? description : existing.description,
    status || existing.status,
    priority || existing.priority,
    due_date !== undefined ? due_date : existing.due_date,
    req.params.id
  );

  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  res.json(project);
});

// DELETE /api/projects/:id - Delete a project
router.delete('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Project not found' });
  }
  db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

module.exports = router;
