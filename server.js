const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ── Database ──────────────────────────────────────────────────────────────────
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL
    ? { rejectUnauthorized: false }
    : false,
});

async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS novels (
      id          TEXT PRIMARY KEY,
      data        JSONB        NOT NULL,
      updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    )
  `);
  console.log('Database ready.');
}

// ── API routes ────────────────────────────────────────────────────────────────

// GET all novels (newest first)
app.get('/api/novels', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT data FROM novels ORDER BY updated_at DESC'
    );
    res.json(result.rows.map(r => r.data));
  } catch (err) {
    console.error('GET /api/novels', err);
    res.status(500).json({ error: 'Failed to load novels' });
  }
});

// PUT upsert a novel (create or update)
app.put('/api/novels/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    await pool.query(
      `INSERT INTO novels (id, data, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (id) DO UPDATE
         SET data = EXCLUDED.data,
             updated_at = NOW()`,
      [id, JSON.stringify(data)]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error('PUT /api/novels/:id', err);
    res.status(500).json({ error: 'Failed to save novel' });
  }
});

// DELETE a novel
app.delete('/api/novels/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM novels WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/novels/:id', err);
    res.status(500).json({ error: 'Failed to delete novel' });
  }
});

// Catch-all: serve the SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Boot ──────────────────────────────────────────────────────────────────────
initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Inkwell is running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to initialise database:', err);
    process.exit(1);
  });
