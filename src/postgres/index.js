import Promise from 'bluebird'
import pg, { Client } from 'pg'

// Side effect…
Promise.promisifyAll(pg)
Promise.promisifyAll(Client)

export { getCatalog } from './catalog.js'
