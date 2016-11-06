"use strict";
const minify = require('pg-minify');
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
    function query(strings, ...values) {
        return strings.reduce((items, text, i) => !values[i]
            ? [...items, { type: 'RAW', text }]
            : [...items, { type: 'RAW', text }, ...flatten(values[i])], []);
    }
    sql_1.query = query;
    /**
     * Compiles a Sql query (with an optional name) to a query that can be
     * executed by our PostgreSql driver. Escapes all of the relevant values.
     */
    function compile(sql) {
        // Text holds the query string.
        let text = '';
        // Values hold the JavaScript values that are represented in the query
        // string by placeholders. They are eager because they were provided before
        // compile time.
        const values = [];
        // When we come accross a symbol in our identifier, we create a unique
        // alias for it that shouldn’t be in the users schema. This helps maintain
        // sanity when constructing large Sql queries with many aliases.
        let nextSymbolId = 0;
        const symbolToIdentifier = new Map();
        for (const item of Array.isArray(sql) ? sql : [sql]) {
            switch (item.type) {
                case 'RAW':
                    text += item.text;
                    break;
                // TODO: Identifier escaping? I know `pg-promise` does some of this.
                // Most of the time identifiers are trusted, but this could be a source
                // of Sql injection. Replacing double quotes (") is the minimal
                // implementation.
                case 'IDENTIFIER':
                    if (item.names.length === 0)
                        throw new Error('Identifier must have a name');
                    text += item.names.map(name => {
                        if (typeof name === 'string')
                            return escapeSqlIdentifier(name);
                        // Get the correct identifier string for this symbol.
                        let identifier = symbolToIdentifier.get(name);
                        // If there is no identifier, create one and set it.
                        if (!identifier) {
                            identifier = `__local_${nextSymbolId++}__`;
                            symbolToIdentifier.set(name, identifier);
                        }
                        // Return the identifier. Since we create it, we won’t have to
                        // escape it because we know all of the characters are fine.
                        return identifier;
                    }).join('.');
                    break;
                case 'VALUE':
                    values.push(item.value);
                    text += `$${values.length}`;
                    break;
                default:
                    throw new Error(`Unexpected Sql item type '${item['type']}'.`);
            }
        }
        // Finally, minify our query text.
        text = minify(text);
        return {
            text,
            values,
        };
    }
    sql_1.compile = compile;
    /**
     * Creates a Sql item for some raw Sql text. Just plain ol‘ raw Sql. This
     * method is dangerous though because it involves no escaping, so proceed
     * with caution!
     */
    sql_1.raw = (text) => ({ type: 'RAW', text });
    /**
     * Creates a Sql item for a Sql identifier. A Sql identifier is anything like
     * a table, schema, or column name. An identifier may also have a namespace,
     * thus why many names are accepted.
     */
    sql_1.identifier = (...names) => ({ type: 'IDENTIFIER', names });
    /**
     * Creates a Sql item for a value that will be included in our final query.
     * This value will be added in a way which avoids Sql injection.
     */
    sql_1.value = (val) => ({ type: 'VALUE', value: val });
    /**
     * Join some Sql items together seperated by a string. Useful when dealing
     * with lists of Sql items that doesn’t make sense as a Sql query.
     */
    sql_1.join = (items, seperator) => items.reduce((currentItems, item, i) => i === 0 || !seperator
        ? [...currentItems, ...flatten(item)]
        : [...currentItems, { type: 'RAW', text: seperator }, ...flatten(item)], []);
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
        return array.reduce((currentArray, item) => Array.isArray(item)
            ? [...currentArray, ...flatten(item)]
            : [...currentArray, item], []);
    }
    /**
     * Escapes a Sql identifier. Adapted from the `pg` module.
     *
     * @private
     * @see https://github.com/brianc/node-postgres/blob/a536afb1a8baa6d584bd460e7c1286d75bb36fe3/lib/client.js#L255-L272
     */
    function escapeSqlIdentifier(str) {
        let escaped = '"';
        for (let i = 0; i < str.length; i++) {
            let c = str[i];
            if (c === '"')
                escaped += c + c;
            else
                escaped += c;
        }
        escaped += '"';
        return escaped;
    }
})(sql || (sql = {}));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = sql;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3FsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3Bvc3RncmVzL3V0aWxzL3NxbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsTUFBTyxNQUFNLFdBQVcsV0FBVyxDQUFDLENBQUE7QUFFcEMsSUFBVSxHQUFHLENBMEtaO0FBMUtELFdBQVUsS0FBRyxFQUFDLENBQUM7SUFrQmI7Ozs7Ozs7T0FPRztJQUNILGVBQXVCLE9BQTZCLEVBQUUsR0FBRyxNQUE2QztRQUNwRyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBaUIsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsS0FDbkQsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2NBQ04sQ0FBQyxHQUFHLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUM7Y0FDakMsQ0FBQyxHQUFHLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsR0FBRyxPQUFPLENBQVUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDckUsRUFBRSxDQUFDLENBQUE7SUFDUCxDQUFDO0lBTmUsV0FBSyxRQU1wQixDQUFBO0lBRUQ7OztPQUdHO0lBQ0gsaUJBQXlCLEdBQVE7UUFDL0IsK0JBQStCO1FBQy9CLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQTtRQUViLHNFQUFzRTtRQUN0RSwyRUFBMkU7UUFDM0UsZ0JBQWdCO1FBQ2hCLE1BQU0sTUFBTSxHQUFpQixFQUFFLENBQUE7UUFFL0Isc0VBQXNFO1FBQ3RFLDBFQUEwRTtRQUMxRSxnRUFBZ0U7UUFDaEUsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFBO1FBQ3BCLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxHQUFHLEVBQWtCLENBQUE7UUFFcEQsR0FBRyxDQUFDLENBQUMsTUFBTSxJQUFJLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEQsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLEtBQUssS0FBSztvQkFDUixJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQTtvQkFDakIsS0FBSyxDQUFBO2dCQUNQLG9FQUFvRTtnQkFDcEUsdUVBQXVFO2dCQUN2RSwrREFBK0Q7Z0JBQy9ELGtCQUFrQjtnQkFDbEIsS0FBSyxZQUFZO29CQUNmLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQzt3QkFDMUIsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFBO29CQUVoRCxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSTt3QkFDekIsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLEtBQUssUUFBUSxDQUFDOzRCQUMzQixNQUFNLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUE7d0JBRWxDLHFEQUFxRDt3QkFDckQsSUFBSSxVQUFVLEdBQUcsa0JBQWtCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO3dCQUU3QyxvREFBb0Q7d0JBQ3BELEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQzs0QkFDaEIsVUFBVSxHQUFHLFdBQVcsWUFBWSxFQUFFLElBQUksQ0FBQTs0QkFDMUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQTt3QkFDMUMsQ0FBQzt3QkFFRCw4REFBOEQ7d0JBQzlELDREQUE0RDt3QkFDNUQsTUFBTSxDQUFDLFVBQVUsQ0FBQTtvQkFDbkIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO29CQUNaLEtBQUssQ0FBQTtnQkFDUCxLQUFLLE9BQU87b0JBQ1YsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7b0JBQ3ZCLElBQUksSUFBSSxJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQTtvQkFDM0IsS0FBSyxDQUFBO2dCQUNQO29CQUNFLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDbEUsQ0FBQztRQUNILENBQUM7UUFFRCxrQ0FBa0M7UUFDbEMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUVuQixNQUFNLENBQUM7WUFDTCxJQUFJO1lBQ0osTUFBTTtTQUNQLENBQUE7SUFDSCxDQUFDO0lBOURlLGFBQU8sVUE4RHRCLENBQUE7SUFFRDs7OztPQUlHO0lBQ1UsU0FBRyxHQUFHLENBQUMsSUFBWSxLQUFjLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7SUFFckU7Ozs7T0FJRztJQUNVLGdCQUFVLEdBQUcsQ0FBQyxHQUFHLEtBQTZCLEtBQWMsQ0FBQyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQTtJQUV4Rzs7O09BR0c7SUFDVSxXQUFLLEdBQUcsQ0FBQyxHQUFVLEtBQWMsQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUE7SUFFN0U7OztPQUdHO0lBQ1UsVUFBSSxHQUFHLENBQUMsS0FBMkIsRUFBRSxTQUFrQixLQUNqRSxLQUF3QixDQUFDLE1BQU0sQ0FBaUIsQ0FBQyxZQUFZLEVBQUUsSUFBSSxFQUFFLENBQUMsS0FDckUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVM7VUFDakIsQ0FBQyxHQUFHLFlBQVksRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztVQUNuQyxDQUFDLEdBQUcsWUFBWSxFQUFFLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsRUFDekUsRUFBRSxDQUFDLENBQUE7SUFFUDs7OztPQUlHO0lBQ0gsaUJBQXFCLEtBQXlCO1FBQzVDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN4QixNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUVoQiwyRUFBMkU7UUFDM0Usc0NBQXNDO1FBQ3RDLE1BQU0sQ0FBRSxLQUFrQixDQUFDLE1BQU0sQ0FBVyxDQUFDLFlBQVksRUFBRSxJQUFJLEtBQzdELEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO2NBQ2YsQ0FBQyxHQUFHLFlBQVksRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztjQUNuQyxDQUFDLEdBQUcsWUFBWSxFQUFFLElBQUksQ0FBQyxFQUMzQixFQUFFLENBQUMsQ0FBQTtJQUNQLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILDZCQUE4QixHQUFXO1FBQ3ZDLElBQUksT0FBTyxHQUFHLEdBQUcsQ0FBQTtRQUVqQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUNwQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDZCxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDO2dCQUFDLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBQy9CLElBQUk7Z0JBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQTtRQUNuQixDQUFDO1FBRUQsT0FBTyxJQUFJLEdBQUcsQ0FBQTtRQUVkLE1BQU0sQ0FBQyxPQUFPLENBQUE7SUFDaEIsQ0FBQztBQUNILENBQUMsRUExS1MsR0FBRyxLQUFILEdBQUcsUUEwS1o7QUFFRDtrQkFBZSxHQUFHLENBQUEifQ==