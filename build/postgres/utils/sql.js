"use strict";
var minify = require("pg-minify");
var Client = require("pg/lib/client");
var sql;
(function (sql_1) {
    /**
     * A template string tag that creates a `Sql` query out of some strings and
     * some values. Use this to construct all PostgreSql queries to avoid Sql
     * injection.
     *
     * Note that using this function, the user *must* specify if they are injecting
     * raw text. This makes a Sql injection vulnerability harder to create.
     */
    function query(strings) {
        var values = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            values[_i - 1] = arguments[_i];
        }
        return strings.reduce(function (items, text, i) {
            return !values[i]
                ? items.concat([{ type: 'RAW', text: text }]) : items.concat([{ type: 'RAW', text: text }], flatten(values[i]));
        }, []);
    }
    sql_1.query = query;
    /**
     * Compiles a Sql query (with an optional name) to a query that can be
     * executed by our PostgreSql driver. Escapes all of the relevant values.
     */
    function compile(sql) {
        // Text holds the query string.
        var text = '';
        // Values hold the JavaScript values that are represented in the query
        // string by placeholders. They are eager because they were provided before
        // compile time.
        var values = [];
        // When we come accross a symbol in our identifier, we create a unique
        // alias for it that shouldn’t be in the users schema. This helps maintain
        // sanity when constructing large Sql queries with many aliases.
        var nextSymbolId = 0;
        var symbolToIdentifier = new Map();
        for (var _i = 0, _a = Array.isArray(sql) ? sql : [sql]; _i < _a.length; _i++) {
            var item = _a[_i];
            switch (item.type) {
                case 'RAW':
                    text += item.text;
                    break;
                case 'LITERAL':
                    text += escapeSqlLiteral(item.text);
                    break;
                // TODO: Identifier escaping? I know `pg-promise` does some of this.
                // Most of the time identifiers are trusted, but this could be a source
                // of Sql injection. Replacing double quotes (") is the minimal
                // implementation.
                case 'IDENTIFIER':
                    if (item.names.length === 0)
                        throw new Error('Identifier must have a name');
                    text += item.names.map(function (name) {
                        if (typeof name === 'string')
                            return escapeSqlIdentifier(name);
                        // Get the correct identifier string for this symbol.
                        var identifier = symbolToIdentifier.get(name);
                        // If there is no identifier, create one and set it.
                        if (!identifier) {
                            identifier = "__local_" + nextSymbolId++ + "__";
                            symbolToIdentifier.set(name, identifier);
                        }
                        // Return the identifier. Since we create it, we won’t have to
                        // escape it because we know all of the characters are fine.
                        return identifier;
                    }).join('.');
                    break;
                case 'VALUE':
                    values.push(item.value);
                    text += "$" + values.length;
                    break;
                default:
                    throw new Error("Unexpected Sql item type '" + item['type'] + "'.");
            }
        }
        // Finally, minify our query text.
        text = minify(text);
        return {
            text: text,
            values: values,
        };
    }
    sql_1.compile = compile;
    /**
     * Creates a Sql item for some raw Sql text. Just plain ol‘ raw Sql. This
     * method is dangerous though because it involves no escaping, so proceed
     * with caution!
     */
    sql_1.raw = function (text) { return ({ type: 'RAW', text: text }); };
    /**
     * Creates a Sql item for a string that will be escaped so it is safe against
     * Sql injection
     */
    sql_1.literal = function (text) { return ({ type: 'LITERAL', text: text }); };
    /**
     * Creates a Sql item for a Sql identifier. A Sql identifier is anything like
     * a table, schema, or column name. An identifier may also have a namespace,
     * thus why many names are accepted.
     */
    sql_1.identifier = function () {
        var names = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            names[_i] = arguments[_i];
        }
        return ({ type: 'IDENTIFIER', names: names });
    };
    /**
     * Creates a Sql item for a value that will be included in our final query.
     * This value will be added in a way which avoids Sql injection.
     */
    sql_1.value = function (val) { return ({ type: 'VALUE', value: val }); };
    /**
     * Join some Sql items together seperated by a string. Useful when dealing
     * with lists of Sql items that doesn’t make sense as a Sql query.
     */
    sql_1.join = function (items, seperator) {
        return items.reduce(function (currentItems, item, i) {
            return i === 0 || !seperator
                ? currentItems.concat(flatten(item)) : currentItems.concat([{ type: 'RAW', text: seperator }], flatten(item));
        }, []);
    };
    /**
     * Flattens a deeply nested array.
     *
     * @private
     */
    function flatten(array) {
        if (!Array.isArray(array))
            return [array];
        // Type cheats ahead! Making TypeScript compile here is more important then
        // making the code statically correct.
        return array.reduce(function (currentArray, item) {
            return Array.isArray(item)
                ? currentArray.concat(flatten(item)) : currentArray.concat([item]);
        }, []);
    }
    /**
     * Escapes a Sql identifier. From the `pg` module.
     *
     * @private
     * @see https://github.com/brianc/node-postgres/blob/a536afb1a8baa6d584bd460e7c1286d75bb36fe3/lib/client.js#L255-L272
     */
    function escapeSqlIdentifier(str) {
        return Client.prototype.escapeIdentifier(str);
    }
    /**
     * Escapes a string. From the `pg` module.
     */
    function escapeSqlLiteral(str) {
        return Client.prototype.escapeLiteral(str);
    }
})(sql || (sql = {}));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = sql;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3FsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3Bvc3RncmVzL3V0aWxzL3NxbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0Esa0NBQW9DO0FBQ3BDLHNDQUF3QztBQUV4QyxJQUFVLEdBQUcsQ0FpTFo7QUFqTEQsV0FBVSxLQUFHO0lBbUJYOzs7Ozs7O09BT0c7SUFDSCxlQUF1QixPQUE2QjtRQUFFLGdCQUFnRDthQUFoRCxVQUFnRCxFQUFoRCxxQkFBZ0QsRUFBaEQsSUFBZ0Q7WUFBaEQsK0JBQWdEOztRQUNwRyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBaUIsVUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUM7WUFDbkQsT0FBQSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7a0JBQ0YsS0FBSyxTQUFFLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLE1BQUEsRUFBRSxLQUM1QixLQUFLLFNBQUUsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksTUFBQSxFQUFFLEdBQUssT0FBTyxDQUFVLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRnJFLENBRXFFLEVBQ3JFLEVBQUUsQ0FBQyxDQUFBO0lBQ1AsQ0FBQztJQU5lLFdBQUssUUFNcEIsQ0FBQTtJQUVEOzs7T0FHRztJQUNILGlCQUF5QixHQUFRO1FBQy9CLCtCQUErQjtRQUMvQixJQUFJLElBQUksR0FBRyxFQUFFLENBQUE7UUFFYixzRUFBc0U7UUFDdEUsMkVBQTJFO1FBQzNFLGdCQUFnQjtRQUNoQixJQUFNLE1BQU0sR0FBaUIsRUFBRSxDQUFBO1FBRS9CLHNFQUFzRTtRQUN0RSwwRUFBMEU7UUFDMUUsZ0VBQWdFO1FBQ2hFLElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQTtRQUNwQixJQUFNLGtCQUFrQixHQUFHLElBQUksR0FBRyxFQUFrQixDQUFBO1FBRXBELEdBQUcsQ0FBQyxDQUFlLFVBQWdDLEVBQWhDLEtBQUEsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBaEMsY0FBZ0MsRUFBaEMsSUFBZ0M7WUFBOUMsSUFBTSxJQUFJLFNBQUE7WUFDYixNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDbEIsS0FBSyxLQUFLO29CQUNSLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFBO29CQUNqQixLQUFLLENBQUE7Z0JBQ1AsS0FBSyxTQUFTO29CQUNaLElBQUksSUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7b0JBQ25DLEtBQUssQ0FBQTtnQkFDUCxvRUFBb0U7Z0JBQ3BFLHVFQUF1RTtnQkFDdkUsK0RBQStEO2dCQUMvRCxrQkFBa0I7Z0JBQ2xCLEtBQUssWUFBWTtvQkFDZixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7d0JBQzFCLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQTtvQkFFaEQsSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSTt3QkFDekIsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLEtBQUssUUFBUSxDQUFDOzRCQUMzQixNQUFNLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUE7d0JBRWxDLHFEQUFxRDt3QkFDckQsSUFBSSxVQUFVLEdBQUcsa0JBQWtCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO3dCQUU3QyxvREFBb0Q7d0JBQ3BELEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQzs0QkFDaEIsVUFBVSxHQUFHLGFBQVcsWUFBWSxFQUFFLE9BQUksQ0FBQTs0QkFDMUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQTt3QkFDMUMsQ0FBQzt3QkFFRCw4REFBOEQ7d0JBQzlELDREQUE0RDt3QkFDNUQsTUFBTSxDQUFDLFVBQVUsQ0FBQTtvQkFDbkIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO29CQUNaLEtBQUssQ0FBQTtnQkFDUCxLQUFLLE9BQU87b0JBQ1YsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7b0JBQ3ZCLElBQUksSUFBSSxNQUFJLE1BQU0sQ0FBQyxNQUFRLENBQUE7b0JBQzNCLEtBQUssQ0FBQTtnQkFDUDtvQkFDRSxNQUFNLElBQUksS0FBSyxDQUFDLCtCQUE2QixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQUksQ0FBQyxDQUFBO1lBQ2xFLENBQUM7U0FDRjtRQUVELGtDQUFrQztRQUNsQyxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBRW5CLE1BQU0sQ0FBQztZQUNMLElBQUksTUFBQTtZQUNKLE1BQU0sUUFBQTtTQUNQLENBQUE7SUFDSCxDQUFDO0lBakVlLGFBQU8sVUFpRXRCLENBQUE7SUFFRDs7OztPQUlHO0lBQ1UsU0FBRyxHQUFHLFVBQUMsSUFBWSxJQUFjLE9BQUEsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxNQUFBLEVBQUUsQ0FBQyxFQUF2QixDQUF1QixDQUFBO0lBRXJFOzs7T0FHRztJQUNVLGFBQU8sR0FBRyxVQUFDLElBQVksSUFBYyxPQUFBLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksTUFBQSxFQUFFLENBQUMsRUFBM0IsQ0FBMkIsQ0FBQTtJQUU3RTs7OztPQUlHO0lBQ1UsZ0JBQVUsR0FBRztRQUFDLGVBQWdDO2FBQWhDLFVBQWdDLEVBQWhDLHFCQUFnQyxFQUFoQyxJQUFnQztZQUFoQywwQkFBZ0M7O1FBQWMsT0FBQSxDQUFDLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxLQUFLLE9BQUEsRUFBRSxDQUFDO0lBQS9CLENBQStCLENBQUE7SUFFeEc7OztPQUdHO0lBQ1UsV0FBSyxHQUFHLFVBQUMsR0FBVSxJQUFjLE9BQUEsQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQS9CLENBQStCLENBQUE7SUFFN0U7OztPQUdHO0lBQ1UsVUFBSSxHQUFHLFVBQUMsS0FBMkIsRUFBRSxTQUFrQjtRQUNsRSxPQUFDLEtBQXdCLENBQUMsTUFBTSxDQUFpQixVQUFDLFlBQVksRUFBRSxJQUFJLEVBQUUsQ0FBQztZQUNyRSxPQUFBLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTO2tCQUNiLFlBQVksUUFBSyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQzlCLFlBQVksU0FBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxHQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUZ6RSxDQUV5RSxFQUN6RSxFQUFFLENBQUM7SUFKTCxDQUlLLENBQUE7SUFFUDs7OztPQUlHO0lBQ0gsaUJBQXFCLEtBQXlCO1FBQzVDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN4QixNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUVoQiwyRUFBMkU7UUFDM0Usc0NBQXNDO1FBQ3RDLE1BQU0sQ0FBRSxLQUFrQixDQUFDLE1BQU0sQ0FBVyxVQUFDLFlBQVksRUFBRSxJQUFJO1lBQzdELE9BQUEsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7a0JBQ1gsWUFBWSxRQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFDOUIsWUFBWSxTQUFFLElBQUksRUFBQztRQUYzQixDQUUyQixFQUMzQixFQUFFLENBQUMsQ0FBQTtJQUNQLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILDZCQUE4QixHQUFXO1FBQ3ZDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQy9DLENBQUM7SUFFRDs7T0FFRztJQUNILDBCQUEyQixHQUFXO1FBQ3BDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUM1QyxDQUFDO0FBQ0gsQ0FBQyxFQWpMUyxHQUFHLEtBQUgsR0FBRyxRQWlMWjs7QUFFRCxrQkFBZSxHQUFHLENBQUEifQ==