import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'
import { Forbidden } from 'http-errors'
import bcrypt from 'bcrypt'
import pg, { Client } from 'pg'
import Promise from 'bluebird'

Promise.promisifyAll(pg)
Promise.promisifyAll(Client)

const wrap = fn => (...args) => fn(...args).catch(args[2])

dotenv.load() // Load the config from .env file.
const { DB_STRING, SECRET } = process.env
const app = express()
app.use(bodyParser.json())

app.post('/', wrap(async (req, res) => {
  const { email, password } = req.body
  const query = 'SELECT person_id, email, pass_hash FROM forum_example_utils.person_account WHERE email = $1'
  const client = await pg.connectAsync(DB_STRING)
  const result = await client.queryAsync(query, [email])
  client.end()

  const user = result.rows[0]
  if (!user || !bcrypt.compareSync(password, user.pass_hash)) {
    throw new Forbidden('Your email and password are incorrect.')
  }

  user.aud = 'postgraphql'
  user.role = 'user_role'
  const token = jwt.sign(user, SECRET, { expiresIn: '30 min' })
  return res.json({ success: true, token })
}))

app.use((err, req, res, next) => {
  if (err instanceof Forbidden) {
    res.status(403)
    return res.json({ message: err.message })
  }
})

export default app
