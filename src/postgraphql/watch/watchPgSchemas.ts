import { resolve as resolvePath } from 'path'
import { readFile } from 'fs'
import chalk = require('chalk')
import { Pool } from 'pg'
import minify = require('pg-minify')

/**
 * This query creates some fixtures required to watch a Postgres database.
 * Most notably an event trigger.
 */
export const _watchFixturesQuery = new Promise<string>((resolve, reject) => {
  readFile(resolvePath(__dirname, '../../../resources/watch-fixtures.sql'), (error, data) => {
    if (error) reject(error)
    else resolve(minify(data.toString()))
  })
})

/**
 * Watches a Postgres schema for changes. Does this by running a query which
 * sets up some fixtures for watching the database including, most importantly,
 * a DDL event trigger (if the script can’t be applied it isn’t fatal, just a
 * warning).
 *
 * The event trigger will then notify PostGraphQL whenever DDL queries are
 * succesfully run. PostGraphQL will emit these notifications to a provided
 * `onChange` handler.
 */
export default async function watchPgSchemas ({ pgPool, pgSchemas, onChange }: {
  pgPool: Pool,
  pgSchemas: Array<string>,
  onChange: (info: { commands: Array<string> }) => void,
}): Promise<void> {
  // Connect a client from our pool. Note that we never release this query
  // back to the pool. We keep it forever to receive notifications.
  const pgClient = await pgPool.connect()

  // If the watch fixtures query fails then we will need to rollback the
  // database to an uncorrupted state, so make a savepoint here in the
  // uncorrupted state.
  await pgClient.query('savepoint postgraphql_pre_watch_fixtures')

  // Try to apply our watch fixtures to the database. If the query fails, fail
  // gracefully with a warning as the feature may still work.
  try {
    await pgClient.query(await _watchFixturesQuery)
  }
  catch (error) {
    // The database state is corrupted because the watch fixtures query failed!
    // Rollback to before we ran the watch fixtures query.
    await pgClient.query('rollback to postgraphql_pre_watch_fixtures')

    // tslint:disable no-console
    console.warn(`${chalk.bold.yellow('Failed to setup watch fixtures in Postgres database')} ️️⚠️`)
    console.warn(chalk.yellow('This is likely because your Postgres user is not a superuser. If the'))
    console.warn(chalk.yellow('fixtures already exist, the watch functionality may still work.'))
    // tslint:enable no-console
  }

  // Listen to the `postgraphql_watch` channel. Any and all updates will come
  // through here.
  await pgClient.query('listen postgraphql_watch')

  // Flushes our `commandsQueue` to the `onChange` listener. This function is
  // debounced, so it may not flush synchronously. It will accumulate commands
  // and send them in batches all at once.
  const flushCommands = (() => {
    // tslint:disable-next-line no-any
    let lastTimeoutId: any = null
    let commandsBuffer: Array<string> = []

    return (commands: Array<string>) => {
      // Add all of our commands to our internal buffer.
      commandsBuffer = commandsBuffer.concat(commands)

      // Clear the last timeout and start a new timer. This is effectively our
      // ‘debounce’ implementation.
      clearTimeout(lastTimeoutId)
      lastTimeoutId = setTimeout(() => {
        // Run the `onChange` listener with our commands buffer and clear
        // our buffer.
        onChange({ commands: commandsBuffer })
        commandsBuffer = []
      }, 500)
    }
  })()

  // Process any notifications we may get.
  pgClient.on('notification', notification => {
    // If the notification is for the wrong channel or if the notification
    // payload is falsy (when it’s an empty string), don’t process this
    // notification.
    if (notification.channel !== 'postgraphql_watch' || !notification.payload)
      return

    // Parse our payload into a JSON object and give it some type information.
    const payload: Array<{ schema: string | null, command: string }> = JSON.parse(notification.payload)

    // Take our payload and filter out all of the ‘noise,’ i.e. the commands
    // aren’t in the schemas we are watching. Then map to a format we can
    // share.
    const commands: Array<string> =
      payload
        .filter(({ schema }) => schema == null || pgSchemas.indexOf(schema) !== -1)
        .map(({ command }) => command)

    // If we filtered everything away, let’s return ang ignore those commands.
    if (commands.length === 0)
      return

    // Finally flush our commands. This will happen asynchronously.
    flushCommands(commands)
  })
}
