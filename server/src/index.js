import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import cors from 'cors'
import projectsRouter from './routes/projects.js'
import votesRouter from './routes/votes.js'
import { initDB } from './db/lowdb.js'
import seed from './db/seed.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(express.json())

// CORS solo en dev
if (process.env.NODE_ENV !== 'production') {
  app.use(cors({ origin: 'http://localhost:5173' }))
}

// API
app.use('/api/projects', projectsRouter)
app.use('/api/projects', votesRouter) // p.ej. POST /:id/vote

// Healthcheck para Render
app.get('/healthz', (_, res) => res.status(200).send('ok'))

// Servir frontend en prod
const clientDist = path.join(__dirname, '..', '..', 'client', 'dist')
app.use(express.static(clientDist))
app.get('*', (_, res) => res.sendFile(path.join(clientDist, 'index.html')))

// Start
const PORT = process.env.PORT || 3000
initDB(seed).then(() => {
  app.listen(PORT, () => console.log(`Server running on :${PORT}`))
})