const Debugger = require('debug')

const $$pgClientOrigQuery = Symbol()

const debugPG = new Debugger('postgraphql:postgres')
const debugPGExplain = new Debugger('postgraphql:postgres:explain')

export default function debugPGClient (pgClient) {
  // If Postgres debugging is enabled, enhance our query function by adding
  // a debug statement.
  if (debugPG.enabled || debugPGExplain.enabled) {
    // Set the original query method to a key on our client. If that key is
    // already set, use that.
    pgClient[$$pgClientOrigQuery] = pgClient[$$pgClientOrigQuery] || pgClient.query

    pgClient.query = function (...args) {
      // Debug just the query text. We don’t want to debug variables because
      // there may be passwords in there.
      debugPG(args[0] && args[0].text ? args[0].text : args[0])

      const promiseResult = pgClient[$$pgClientOrigQuery].apply(this, args)

      // Report the error with our Postgres debugger.
      promiseResult.catch(error => debugPG(error))

      // Call the original query method.
      return promiseResult.then(result => {
        // If we have enabled our explain debugger, we will log the
        // explanation for any query that we get. This does mean making a
        // SQL query though. We only want this to run if the query we are
        // explaining was successful and it was a command we can explain.
        if (debugPGExplain.enabled && ['SELECT'].indexOf(result.command) !== -1) {
          pgClient[$$pgClientOrigQuery]
            // Call the query function and prepend `explain analyze`.
            .call(this, {
              text: `explain analyze ${args[0] && args[0].text ? args[0].text : args[0]}`,
              values: args[0] && args[0].values ? args[0].values : args[1] || [],
            })
            .then(result =>
              debugPGExplain(`\n${result.rows.map(row => row['QUERY PLAN']).join('\n')}`))
            .catch(error =>
              debugPGExplain(error))
        }

        return result
      })
    }
  }

  return pgClient
}
