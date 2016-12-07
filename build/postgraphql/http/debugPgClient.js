"use strict";
const Debugger = require('debug'); // tslint:disable-line variable-name
const $$pgClientOrigQuery = Symbol();
const debugPg = new Debugger('postgraphql:postgres');
const debugPgExplain = new Debugger('postgraphql:postgres:explain');
function debugPgClient(pgClient) {
    // If Postgres debugging is enabled, enhance our query function by adding
    // a debug statement.
    if (debugPg.enabled || debugPgExplain.enabled) {
        // Set the original query method to a key on our client. If that key is
        // already set, use that.
        pgClient[$$pgClientOrigQuery] = pgClient[$$pgClientOrigQuery] || pgClient.query;
        // tslint:disable-next-line only-arrow-functions
        pgClient.query = function (...args) {
            // Debug just the query text. We don’t want to debug variables because
            // there may be passwords in there.
            debugPg(args[0] && args[0].text ? args[0].text : args[0]);
            // tslint:disable-next-line no-invalid-this
            const promiseResult = pgClient[$$pgClientOrigQuery].apply(this, args);
            // Report the error with our Postgres debugger.
            promiseResult.catch(error => debugPg(error));
            // Call the original query method.
            return promiseResult.then(result => {
                // If we have enabled our explain debugger, we will log the
                // explanation for any query that we get. This does mean making a
                // Sql query though. We only want this to run if the query we are
                // explaining was successful and it was a command we can explain.
                if (debugPgExplain.enabled && ['SELECT'].indexOf(result.command) !== -1) {
                    pgClient[$$pgClientOrigQuery]
                        .call(this, {
                        text: `explain analyze ${args[0] && args[0].text ? args[0].text : args[0]}`,
                        values: args[0] && args[0].values ? args[0].values : args[1] || [],
                    })
                        .then(explainResult => debugPgExplain(`\n${explainResult.rows.map(row => row['QUERY PLAN']).join('\n')}`))
                        .catch(error => debugPgExplain(error));
                }
                return result;
            });
        };
    }
    return pgClient;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = debugPgClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVidWdQZ0NsaWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wb3N0Z3JhcGhxbC9odHRwL2RlYnVnUGdDbGllbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQSxDQUFDLG9DQUFvQztBQUV0RSxNQUFNLG1CQUFtQixHQUFHLE1BQU0sRUFBRSxDQUFBO0FBRXBDLE1BQU0sT0FBTyxHQUFHLElBQUksUUFBUSxDQUFDLHNCQUFzQixDQUFDLENBQUE7QUFDcEQsTUFBTSxjQUFjLEdBQUcsSUFBSSxRQUFRLENBQUMsOEJBQThCLENBQUMsQ0FBQTtBQUVuRSx1QkFBdUMsUUFBUTtJQUM3Qyx5RUFBeUU7SUFDekUscUJBQXFCO0lBQ3JCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLElBQUksY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDOUMsdUVBQXVFO1FBQ3ZFLHlCQUF5QjtRQUN6QixRQUFRLENBQUMsbUJBQW1CLENBQUMsR0FBRyxRQUFRLENBQUMsbUJBQW1CLENBQUMsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFBO1FBRS9FLGdEQUFnRDtRQUNoRCxRQUFRLENBQUMsS0FBSyxHQUFHLFVBQVUsR0FBRyxJQUFJO1lBQ2hDLHNFQUFzRTtZQUN0RSxtQ0FBbUM7WUFDbkMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFFekQsMkNBQTJDO1lBQzNDLE1BQU0sYUFBYSxHQUFHLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUE7WUFFckUsK0NBQStDO1lBQy9DLGFBQWEsQ0FBQyxLQUFLLENBQUMsS0FBSyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFBO1lBRTVDLGtDQUFrQztZQUNsQyxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNO2dCQUM5QiwyREFBMkQ7Z0JBQzNELGlFQUFpRTtnQkFDakUsaUVBQWlFO2dCQUNqRSxpRUFBaUU7Z0JBQ2pFLEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDeEUsUUFBUSxDQUFDLG1CQUFtQixDQUFDO3lCQUcxQixJQUFJLENBQUMsSUFBSSxFQUFFO3dCQUNWLElBQUksRUFBRSxtQkFBbUIsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7d0JBQzNFLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFO3FCQUNuRSxDQUFDO3lCQUNELElBQUksQ0FBQyxhQUFhLElBQ2pCLGNBQWMsQ0FBQyxLQUFLLGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3lCQUNwRixLQUFLLENBQUMsS0FBSyxJQUNWLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFBO2dCQUM1QixDQUFDO2dCQUVELE1BQU0sQ0FBQyxNQUFNLENBQUE7WUFDZixDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQTtJQUNILENBQUM7SUFFRCxNQUFNLENBQUMsUUFBUSxDQUFBO0FBQ2pCLENBQUM7QUE5Q0Q7K0JBOENDLENBQUEifQ==