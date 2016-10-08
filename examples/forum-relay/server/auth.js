import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'
import { Forbidden } from 'http-errors'
import bcrypt from 'bcrypt'
import pg, { Client } from 'pg'

// A wrapper to catch those errors in async functions
const wrap = fn => (...args) => fn(...args).catch(args[2])

dotenv.load() // Load config from the .env file.
const { DB_STRING, SECRET } = process.env
const app = express()
app.use(bodyParser.json()) // so we can parse the json body

app.post('/', wrap(async (req, res) => {
  const { email, password } = req.body
  const joinPersonAccount = `
  SELECT * FROM forum_example_utils.person_account AS a
  JOIN forum_example.person AS p
  ON a.person_id = p.id WHERE email = $1
  `

  const client = await pg.connect(DB_STRING)
  const result = await client.query(joinPersonAccount, [email])
  client.end() // returns the client to the connection pool

  const userRow = result.rows[0]
  if (!userRow || !bcrypt.compareSync(password, userRow.pass_hash))
    throw new Forbidden('Your email and password are incorrect.')

  const token = prepareToken(userRow)
  return res.json({ err: null, token })
}))

// Here we get a hold of the errors that were thrown higher up the chain
app.use((err, req, res, next) => {
  if (err instanceof Forbidden) {
    res.status(403)
    return res.json({ err: err.message })
  } else {
    res.status(500)
    return res.json({ err: err.message })
  }
})

function prepareToken(userRow) {
  return jwt.sign({
    // This is the payload of the jwt token
    personId: userRow.person_id,
    givenName: userRow.given_name,
    familyName: userRow.family_name,
    email: userRow.email,
    role: 'user_role', // we need to set the role otherwise it will be the anon role
  }, SECRET, { // the secret we specified in the .env file
    audience: 'postgraphql', // PostGraphQL expects this to be set to `postgraphql`
    expiresIn: '10 min',
  })
}

export default app
