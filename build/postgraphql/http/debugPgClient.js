"use strict";
const Debugger = require('debug');
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
        pgClient.query = function (...args) {
            // Debug just the query text. We don’t want to debug variables because
            // there may be passwords in there.
            debugPg(args[0] && args[0].text ? args[0].text : args[0]);
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
                        .then(result => debugPgExplain(`\n${result.rows.map(row => row['QUERY PLAN']).join('\n')}`))
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVidWdQZ0NsaWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wb3N0Z3JhcGhxbC9odHRwL2RlYnVnUGdDbGllbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUVqQyxNQUFNLG1CQUFtQixHQUFHLE1BQU0sRUFBRSxDQUFBO0FBRXBDLE1BQU0sT0FBTyxHQUFHLElBQUksUUFBUSxDQUFDLHNCQUFzQixDQUFDLENBQUE7QUFDcEQsTUFBTSxjQUFjLEdBQUcsSUFBSSxRQUFRLENBQUMsOEJBQThCLENBQUMsQ0FBQTtBQUVuRSx1QkFBdUMsUUFBUTtJQUM3Qyx5RUFBeUU7SUFDekUscUJBQXFCO0lBQ3JCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLElBQUksY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDOUMsdUVBQXVFO1FBQ3ZFLHlCQUF5QjtRQUN6QixRQUFRLENBQUMsbUJBQW1CLENBQUMsR0FBRyxRQUFRLENBQUMsbUJBQW1CLENBQUMsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFBO1FBRS9FLFFBQVEsQ0FBQyxLQUFLLEdBQUcsVUFBVSxHQUFHLElBQUk7WUFDaEMsc0VBQXNFO1lBQ3RFLG1DQUFtQztZQUNuQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUV6RCxNQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFBO1lBRXJFLCtDQUErQztZQUMvQyxhQUFhLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQTtZQUU1QyxrQ0FBa0M7WUFDbEMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTTtnQkFDOUIsMkRBQTJEO2dCQUMzRCxpRUFBaUU7Z0JBQ2pFLGlFQUFpRTtnQkFDakUsaUVBQWlFO2dCQUNqRSxFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUMsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3hFLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQzt5QkFFMUIsSUFBSSxDQUFDLElBQUksRUFBRTt3QkFDVixJQUFJLEVBQUUsbUJBQW1CLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO3dCQUMzRSxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRTtxQkFDbkUsQ0FBQzt5QkFDRCxJQUFJLENBQUMsTUFBTSxJQUNWLGNBQWMsQ0FBQyxLQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3lCQUM3RSxLQUFLLENBQUMsS0FBSyxJQUNWLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFBO2dCQUM1QixDQUFDO2dCQUVELE1BQU0sQ0FBQyxNQUFNLENBQUE7WUFDZixDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQTtJQUNILENBQUM7SUFFRCxNQUFNLENBQUMsUUFBUSxDQUFBO0FBQ2pCLENBQUM7QUEzQ0Q7K0JBMkNDLENBQUEifQ==