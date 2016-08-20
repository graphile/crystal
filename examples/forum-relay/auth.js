import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import pg from 'pg'

const app = express()

dotenv.load()
const { DB_STRING, SECRET } = process.env

// We need to be able to parse the body so we can
// get the email and password from the post request
app.use(bodyParser.json())

app.post('/authenticate', (req, res) => {
  const { email, password } = req.body

  pg.connect(DB_STRING, (err, client, done) => {
    const query = 'SELECT person_id, email, pass_hash FROM forum_example_utils.person_account WHERE email = $1'

    client.query(query, [email], (err, result) => {
      done()

      if (result.rows.length === 0) {
        res.status(401)
        res.json({ success: false })
      }

      const user = result.rows[0]

      if (!bcrypt.compareSync(password, user.pass_hash)) {
        res.status(401)
        res.json({ success: false })
      }

      user.aud = 'postgraphql'
      const token = jwt.sign(user, SECRET, { expiresIn: '30 min' })
      res.json({ success: true, token })
    })
  })
})

export default app
