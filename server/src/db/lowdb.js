import { JSONFile, Low } from 'lowdb'
import path from 'node:path'
import fs from 'node:fs'

const DATA_DIR = process.env.DATA_DIR || '/tmp'
fs.mkdirSync(DATA_DIR, { recursive: true })
const DATA_FILE = path.join(DATA_DIR, 'data.json')
const defaultData = { users: [], projects: [], votes: [], _meta: {} }

const adapter = new JSONFile(DATA_FILE)
export const db = new Low(adapter, defaultData)

export async function initDB(seedFn) {
  await db.read()
  const needsSeed = !db.data || !db.data.projects || db.data.projects.length === 0
  if (needsSeed && typeof seedFn === 'function') {
    await seedFn(db)
    db.data._meta = { seededAt: new Date().toISOString(), ephemeral: true }
    await db.write()
  }
  return db
}