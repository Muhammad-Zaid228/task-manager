const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const DB_PATH = process.env.DB_PATH || './database/tasks.db';
const dbDir = path.dirname(path.resolve(DB_PATH));

// Ensure database directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(path.resolve(DB_PATH), (err) => {
  if (err) {
    console.error('❌ Failed to connect to SQLite database:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to SQLite database at', path.resolve(DB_PATH));
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Initialize schema + seed data on first run
const initDB = () => {
  return new Promise((resolve, reject) => {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    db.exec(schema, (err) => {
      if (err) {
        console.error('❌ Schema initialization failed:', err.message);
        return reject(err);
      }
      console.log('✅ Database schema initialized');
      resolve();
    });
  });
};

// Promisify db methods
const dbAll = (sql, params = []) =>
  new Promise((resolve, reject) =>
    db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)))
  );

const dbGet = (sql, params = []) =>
  new Promise((resolve, reject) =>
    db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)))
  );

const dbRun = (sql, params = []) =>
  new Promise((resolve, reject) =>
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    })
  );

module.exports = { db, initDB, dbAll, dbGet, dbRun };
