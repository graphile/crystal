import { resolve as resolvePath } from 'path'
import { readFile } from 'fs'
import getTestPGClient from './getTestPGClient'

let created = false

export default async function createKitchenSinkSchema () {
  // If this function has already been run, bail early.
  if (created) return

  const testSchema = await new Promise<string>((resolve, reject) => {
    readFile(resolvePath(__dirname, 'kitchen-sink-schema.sql'), (error, data) => {
      if (error) reject(error)
      else resolve(data.toString())
    })
  })

  const client = await getTestPGClient()
  await client.query(testSchema)
  client.release()

  created = true
}
