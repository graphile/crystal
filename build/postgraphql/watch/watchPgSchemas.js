"use strict";
var tslib_1 = require("tslib");
var path_1 = require("path");
var fs_1 = require("fs");
var chalk = require("chalk");
var minify = require("pg-minify");
/**
 * This query creates some fixtures required to watch a Postgres database.
 * Most notably an event trigger.
 */
exports._watchFixturesQuery = new Promise(function (resolve, reject) {
    fs_1.readFile(path_1.resolve(__dirname, '../../../resources/watch-fixtures.sql'), function (error, data) {
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
function watchPgSchemas(_a) {
    var pgPool = _a.pgPool, pgSchemas = _a.pgSchemas, onChange = _a.onChange;
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var pgClient, _a, _b, _c, error_1, flushCommands;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, pgPool.connect()];
                case 1:
                    pgClient = _d.sent();
                    _d.label = 2;
                case 2:
                    _d.trys.push([2, 5, , 7]);
                    _b = (_a = pgClient).query;
                    return [4 /*yield*/, exports._watchFixturesQuery];
                case 3: return [4 /*yield*/, _b.apply(_a, [_d.sent()])];
                case 4:
                    _d.sent();
                    return [3 /*break*/, 7];
                case 5:
                    error_1 = _d.sent();
                    // tslint:disable no-console
                    console.warn(chalk.bold.yellow('Failed to setup watch fixtures in Postgres database') + " \uFE0F\uFE0F\u26A0\uFE0F");
                    console.warn(chalk.yellow('This is likely because your Postgres user is not a superuser. If the'));
                    console.warn(chalk.yellow('fixtures already exist, the watch functionality may still work.'));
                    // tslint:enable no-console
                    return [4 /*yield*/, pgClient.query('rollback')];
                case 6:
                    // tslint:enable no-console
                    _d.sent();
                    return [3 /*break*/, 7];
                case 7: 
                // Listen to the `postgraphql_watch` channel. Any and all updates will come
                // through here.
                return [4 /*yield*/, pgClient.query('listen postgraphql_watch')];
                case 8:
                    // Listen to the `postgraphql_watch` channel. Any and all updates will come
                    // through here.
                    _d.sent();
                    flushCommands = (function () {
                        // tslint:disable-next-line no-any
                        var lastTimeoutId = null;
                        var commandsBuffer = [];
                        return function (commands) {
                            // Add all of our commands to our internal buffer.
                            commandsBuffer = commandsBuffer.concat(commands);
                            // Clear the last timeout and start a new timer. This is effectively our
                            // ‘debounce’ implementation.
                            clearTimeout(lastTimeoutId);
                            lastTimeoutId = setTimeout(function () {
                                // Run the `onChange` listener with our commands buffer and clear
                                // our buffer.
                                onChange({ commands: commandsBuffer });
                                commandsBuffer = [];
                            }, 500);
                        };
                    })();
                    // Process any notifications we may get.
                    pgClient.on('notification', function (notification) {
                        // If the notification is for the wrong channel or if the notification
                        // payload is falsy (when it’s an empty string), don’t process this
                        // notification.
                        if (notification.channel !== 'postgraphql_watch' || !notification.payload)
                            return;
                        // Parse our payload into a JSON object and give it some type information.
                        var payload = JSON.parse(notification.payload);
                        // Take our payload and filter out all of the ‘noise,’ i.e. the commands
                        // aren’t in the schemas we are watching. Then map to a format we can
                        // share.
                        var commands = payload
                            .filter(function (_a) {
                            var schema = _a.schema;
                            return schema == null || pgSchemas.indexOf(schema) !== -1;
                        })
                            .map(function (_a) {
                            var command = _a.command;
                            return command;
                        });
                        // If we filtered everything away, let’s return ang ignore those commands.
                        if (commands.length === 0)
                            return;
                        // Finally flush our commands. This will happen asynchronously.
                        flushCommands(commands);
                    });
                    return [2 /*return*/];
            }
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = watchPgSchemas;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2F0Y2hQZ1NjaGVtYXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcG9zdGdyYXBocWwvd2F0Y2gvd2F0Y2hQZ1NjaGVtYXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNkM7QUFDN0MseUJBQTZCO0FBQzdCLDZCQUErQjtBQUUvQixrQ0FBb0M7QUFFcEM7OztHQUdHO0FBQ1UsUUFBQSxtQkFBbUIsR0FBRyxJQUFJLE9BQU8sQ0FBUyxVQUFDLE9BQU8sRUFBRSxNQUFNO0lBQ3JFLGFBQVEsQ0FBQyxjQUFXLENBQUMsU0FBUyxFQUFFLHVDQUF1QyxDQUFDLEVBQUUsVUFBQyxLQUFLLEVBQUUsSUFBSTtRQUNwRixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDeEIsSUFBSTtZQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQTtJQUN2QyxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBO0FBRUY7Ozs7Ozs7OztHQVNHO0FBQ0gsd0JBQThDLEVBSTdDO1FBSitDLGtCQUFNLEVBQUUsd0JBQVMsRUFBRSxzQkFBUTs7MkNBOEJuRSxhQUFhOzs7d0JBdkJGLHFCQUFNLE1BQU0sQ0FBQyxPQUFPLEVBQUUsRUFBQTs7K0JBQXRCLFNBQXNCOzs7O29CQUsvQixLQUFBLENBQUEsS0FBQSxRQUFRLENBQUEsQ0FBQyxLQUFLLENBQUE7b0JBQUMscUJBQU0sMkJBQW1CLEVBQUE7d0JBQTlDLHFCQUFNLGNBQWUsU0FBeUIsRUFBQyxFQUFBOztvQkFBL0MsU0FBK0MsQ0FBQTs7OztvQkFHL0MsNEJBQTRCO29CQUM1QixPQUFPLENBQUMsSUFBSSxDQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLHFEQUFxRCxDQUFDLDhCQUFPLENBQUMsQ0FBQTtvQkFDaEcsT0FBTyxDQUFDLElBQUks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