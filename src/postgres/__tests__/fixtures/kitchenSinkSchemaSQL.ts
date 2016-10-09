import { resolve as resolvePath } from 'path'
import { readFile } from 'fs'
import minify = require('pg-minify')

const kitchenSinkSchemaSQL = new Promise<string>((resolve, reject) => {
  readFile(resolvePath(__dirname, '../../../../examples/kitchen-sink/schema.sql'), (error, data) => {
    if (error) reject(error)
    else resolve(minify(data.toString()))
  })
})

export default kitchenSinkSchemaSQL
