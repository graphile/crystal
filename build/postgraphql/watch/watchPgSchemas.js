"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const path_1 = require('path');
const fs_1 = require('fs');
const chalk = require('chalk');
const minify = require('pg-minify');
/**
 * This query creates some fixtures required to watch a Postgres database.
 * Most notably an event trigger.
 */
exports._watchFixturesQuery = new Promise((resolve, reject) => {
    fs_1.readFile(path_1.resolve(__dirname, '../../../resources/watch-fixtures.sql'), (error, data) => {
        if (error)
            reject(error);
        else
            resolve(minify(data.toString()));
    });
});
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
function watchPgSchemas({ pgPool, pgSchemas, onChange }) {
    return __awaiter(this, void 0, void 0, function* () {
        // Connect a client from our pool. Note that we never release this query
        // back to the pool. We keep it forever to receive notifications.
        const pgClient = yield pgPool.connect();
        // Try to apply our watch fixtures to the database. If the query fails, fail
        // gracefully with a warning as the feature may still work.
        try {
            yield pgClient.query(yield exports._watchFixturesQuery);
        }
        catch (error) {
            // tslint:disable no-console
            console.warn(`${chalk.bold.yellow('Failed to setup watch fixtures in Postgres database')} ️️⚠️`);
            console.warn(chalk.yellow('This is likely because your Postgres user is not a superuser. If the'));
            console.warn(chalk.yellow('fixtures already exist, the watch functionality may still work.'));
        }
        // Listen to the `postgraphql_watch` channel. Any and all updates will come
        // through here.
        yield pgClient.query('listen postgraphql_watch');
        // Flushes our `commandsQueue` to the `onChange` listener. This function is
        // debounced, so it may not flush synchronously. It will accumulate commands
        // and send them in batches all at once.
        const flushCommands = (() => {
            // tslint:disable-next-line no-any
            let lastTimeoutId = null;
            let commandsBuffer = [];
            return (commands) => {
                // Add all of our commands to our internal buffer.
                commandsBuffer = commandsBuffer.concat(commands);
                // Clear the last timeout and start a new timer. This is effectively our
                // ‘debounce’ implementation.
                clearTimeout(lastTimeoutId);
                lastTimeoutId = setTimeout(() => {
                    // Run the `onChange` listener with our commands buffer and clear
                    // our buffer.
                    onChange({ commands: commandsBuffer });
                    commandsBuffer = [];
                }, 500);
            };
        })();
        // Process any notifications we may get.
        pgClient.on('notification', notification => {
            // If the notification is for the wrong channel or if the notification
            // payload is falsy (when it’s an empty string), don’t process this
            // notification.
            if (notification.channel !== 'postgraphql_watch' || !notification.payload)
                return;
            // Parse our payload into a JSON object and give it some type information.
            const payload = JSON.parse(notification.payload);
            // Take our payload and filter out all of the ‘noise,’ i.e. the commands
            // aren’t in the schemas we are watching. Then map to a format we can
            // share.
            const commands = payload
                .filter(({ schema }) => schema == null || pgSchemas.indexOf(schema) !== -1)
                .map(({ command }) => command);
            // If we filtered everything away, let’s return ang ignore those commands.
            if (commands.length === 0)
                return;
            // Finally flush our commands. This will happen asynchronously.
            flushCommands(commands);
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = watchPgSchemas;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2F0Y2hQZ1NjaGVtYXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcG9zdGdyYXBocWwvd2F0Y2gvd2F0Y2hQZ1NjaGVtYXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsdUJBQXVDLE1BQ3ZDLENBQUMsQ0FENEM7QUFDN0MscUJBQXlCLElBQ3pCLENBQUMsQ0FENEI7QUFDN0IsTUFBTyxLQUFLLFdBQVcsT0FBTyxDQUFDLENBQUE7QUFFL0IsTUFBTyxNQUFNLFdBQVcsV0FBVyxDQUFDLENBQUE7QUFFcEM7OztHQUdHO0FBQ1UsMkJBQW1CLEdBQUcsSUFBSSxPQUFPLENBQVMsQ0FBQyxPQUFPLEVBQUUsTUFBTTtJQUNyRSxhQUFRLENBQUMsY0FBVyxDQUFDLFNBQVMsRUFBRSx1Q0FBdUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLElBQUk7UUFDcEYsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ3hCLElBQUk7WUFBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUE7SUFDdkMsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQTtBQUVGOzs7Ozs7Ozs7R0FTRztBQUNILHdCQUE4QyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUkxRTs7UUFDQyx3RUFBd0U7UUFDeEUsaUVBQWlFO1FBQ2pFLE1BQU0sUUFBUSxHQUFHLE1BQU0sTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFBO1FBRXZDLDRFQUE0RTtRQUM1RSwyREFBMkQ7UUFDM0QsSUFBSSxDQUFDO1lBQ0gsTUFBTSxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sMkJBQW1CLENBQUMsQ0FBQTtRQUNqRCxDQUNBO1FBQUEsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNiLDRCQUE0QjtZQUM1QixPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMscURBQXFELENBQUMsT0FBTyxDQUFDLENBQUE7WUFDaEcsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLHNFQUFzRSxDQUFDLENBQUMsQ0FBQTtZQUNsRyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsaUVBQWlFLENBQUMsQ0FBQyxDQUFBO1FBRS9GLENBQUM7UUFFRCwyRUFBMkU7UUFDM0UsZ0JBQWdCO1FBQ2hCLE1BQU0sUUFBUSxDQUFDLEtBQUssQ0FBQywwQkFBMEIsQ0FBQyxDQUFBO1FBRWhELDJFQUEyRTtRQUMzRSw0RUFBNEU7UUFDNUUsd0NBQXdDO1FBQ3hDLE1BQU0sYUFBYSxHQUFHLENBQUM7WUFDckIsa0NBQWtDO1lBQ2xDLElBQUksYUFBYSxHQUFRLElBQUksQ0FBQTtZQUM3QixJQUFJLGNBQWMsR0FBa0IsRUFBRSxDQUFBO1lBRXRDLE1BQU0sQ0FBQyxDQUFDLFFBQXVCO2dCQUM3QixrREFBa0Q7Z0JBQ2xELGNBQWMsR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFBO2dCQUVoRCx3RUFBd0U7Z0JBQ3hFLDZCQUE2QjtnQkFDN0IsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFBO2dCQUMzQixhQUFhLEdBQUcsVUFBVSxDQUFDO29CQUN6QixpRUFBaUU7b0JBQ2pFLGNBQWM7b0JBQ2QsUUFBUSxDQUFDLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUE7b0JBQ3RDLGNBQWMsR0FBRyxFQUFFLENBQUE7Z0JBQ3JCLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQTtZQUNULENBQUMsQ0FBQTtRQUNILENBQUMsQ0FBQyxFQUFFLENBQUE7UUFFSix3Q0FBd0M7UUFDeEMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxjQUFjLEVBQUUsWUFBWTtZQUN0QyxzRUFBc0U7WUFDdEUsbUVBQW1FO1lBQ25FLGdCQUFnQjtZQUNoQixFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsT0FBTyxLQUFLLG1CQUFtQixJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQztnQkFDeEUsTUFBTSxDQUFBO1lBRVIsMEVBQTBFO1lBQzFFLE1BQU0sT0FBTyxHQUFzRCxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUVuRyx3RUFBd0U7WUFDeEUscUVBQXFFO1lBQ3JFLFNBQVM7WUFDVCxNQUFNLFFBQVEsR0FDWixPQUFPO2lCQUNKLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLEtBQUssTUFBTSxJQUFJLElBQUksSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2lCQUMxRSxHQUFHLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxLQUFLLE9BQU8sQ0FBQyxDQUFBO1lBRWxDLDBFQUEwRTtZQUMxRSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztnQkFDeEIsTUFBTSxDQUFBO1lBRVIsK0RBQStEO1lBQy9ELGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUN6QixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUM7O0FBNUVEO2dDQTRFQyxDQUFBIn0=