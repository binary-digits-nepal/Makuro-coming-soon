import express from 'express'
import fs from 'fs'
import path from 'path'

const app = express()
app.use(express.json())
app.use(express.static('public'))

const DATA_DIR = process.env.DATA_DIR || 'data'
const WAITLIST_FILE = path.join(DATA_DIR, 'waitlist.txt')
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })

app.post('/waitlist', (req, res) => {
  const { email } = req.body
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' })
  }
  const lc = email.toLowerCase().trim()
  const existing = fs.existsSync(WAITLIST_FILE)
    ? fs.readFileSync(WAITLIST_FILE, 'utf8').toLowerCase().split('\n').map(e => e.trim())
    : []
  if (existing.includes(lc)) {
    return res.json({ ok: true, duplicate: true })
  }
  fs.appendFileSync(WAITLIST_FILE, lc + '\n')
  res.json({ ok: true, duplicate: false })
})

app.get('/waitlist/count', (req, res) => {
  if (!fs.existsSync(WAITLIST_FILE)) return res.json({ count: 0 })
  const lines = fs.readFileSync(WAITLIST_FILE, 'utf8').split('\n').filter(e => e.trim())
  res.json({ count: 26 + lines.length })
})

app.listen(3000, () => console.log('Running on http://localhost:3000'))