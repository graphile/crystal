import Promise from 'bluebird'
import pg, { Client } from 'pg'
import jwt from 'jsonwebtoken'

// Side effect…
Promise.promisifyAll(pg)
Promise.promisifyAll(Client)
Promise.promisifyAll(jwt)
