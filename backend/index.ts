import express from 'express'
import cors from 'cors'
import pkg from 'pg'
const { Pool } = pkg

const app = express()
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())


const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres123@localhost:5432/college_discovery',
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
})

app.get('/colleges', async (req, res) => {
  try {
    const { search, state, course, minFees, maxFees } = req.query

    let query = `SELECT * FROM "College" WHERE 1=1`
    const params: any[] = []
    let i = 1

    if (search) {
      query += ` AND name ILIKE $${i++}`
      params.push(`%${search}%`)
    }
    if (state) {
      query += ` AND state = $${i++}`
      params.push(state)
    }
    if (minFees) {
      query += ` AND fees >= $${i++}`
      params.push(Number(minFees))
    }
    if (maxFees) {
      query += ` AND fees <= $${i++}`
      params.push(Number(maxFees))
    }
    if (course) {
      query += ` AND $${i++} = ANY(courses)`
      params.push(course)
    }

    query += ` ORDER BY rating DESC`

    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch colleges' })
  }
})

app.get('/colleges/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(`SELECT * FROM "College" WHERE id = $1`, [id])
    if (result.rows.length === 0) return res.status(404).json({ error: 'College not found' })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch college' })
  }
})

app.get('/compare', async (req, res) => {
  try {
    const { ids } = req.query
    if (!ids) return res.status(400).json({ error: 'No ids provided' })

    const idList = (ids as string).split(',').map(Number)
    if (idList.length < 2 || idList.length > 3) {
      return res.status(400).json({ error: 'Please provide 2-3 college ids' })
    }

    const placeholders = idList.map((_, i) => `$${i + 1}`).join(',')
    const result = await pool.query(
      `SELECT * FROM "College" WHERE id IN (${placeholders})`,
      idList
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to compare colleges' })
  }
})

app.get('/states', async (req, res) => {
  try {
    const result = await pool.query(`SELECT DISTINCT state FROM "College" ORDER BY state`)
    res.json(result.rows.map((r: any) => r.state))
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch states' })
  }
})


app.get('/courses', async (req, res) => {
  try {
    const result = await pool.query(`SELECT DISTINCT UNNEST(courses) as course FROM "College" ORDER BY course`)
    res.json(result.rows.map((r: any) => r.course))
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch courses' })
  }
})

app.listen(5000, () => console.log(' Backend running on https://marvelous-transformation-production-8e9a.up.railway.app'))