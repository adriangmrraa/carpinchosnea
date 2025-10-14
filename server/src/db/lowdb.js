const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const path = require('path');

// Usar /tmp para Render (writable), o local en desarrollo
const file = process.env.RENDER ? '/tmp/data.json' : path.join(__dirname, 'data.json');
const adapter = new JSONFile(file);
const db = new Low(adapter, {});

async function initDb() {
  await db.read();
  if (!db.data || !db.data._meta) {
    db.data = {
      users: [],
      projects: [],
      votes: [],
      _meta: { seededAt: null, version: 1 }
    };
    await db.write();
  }
}

module.exports = { db, initDb };