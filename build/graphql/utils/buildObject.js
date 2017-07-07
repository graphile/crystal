"use strict";
/**
 * A utility function for easily building an object from lists *without*
 * tolerating duplicate keys. If any duplicate keys are seen an error will be
 * thrown.
 *
 * This is useful for when we are building map objects as is often done for
 * GraphQL configs.
 *
 * This is pretty much identical to the Lodash `_.fromPairs` function.
 *
 * ## Example:
 * ```js
 * const actual = buildObject(
 *   [
 *     ['a', 1],
 *     ['b', 2],
 *   ],
 *   [
 *     ['c', 3],
 *   ]
 * )
 *
 * const expected = {
 *   a: 1,
 *   b: 2,
 *   c: 3,
 * }
 *
 * assert.deepEqual(actual, expected)
 * ```
 */
function buildObject() {
    var entriess = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        entriess[_i] = arguments[_i];
    }
    var object = {};
    entriess.forEach(function (entries) { return entries.forEach(function (entry) {
        if (!entry)
            return;
        var key;
        var value;
        if (Array.isArray(entry)) {
            key = entry[0];
            value = entry[1];
        }
        else {
            key = entry.key;
            value = entry.value;
        }
        if (object.hasOwnProperty(key))
            throw new Error("Naming conflict when building object. Cannot have two definitions for property '" + key + "'.");
        object[key] = value;
    }); });
    return object;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = buildObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGRPYmplY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZ3JhcGhxbC91dGlscy9idWlsZE9iamVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQThCRztBQUNIO0lBQ0Usa0JBQTZGO1NBQTdGLFVBQTZGLEVBQTdGLHFCQUE2RixFQUE3RixJQUE2RjtRQUE3Riw2QkFBNkY7O0lBRTdGLElBQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQTtJQUVqQixRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUEsT0FBTyxJQUFJLE9BQUEsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFBLEtBQUs7UUFDL0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFDVCxNQUFNLENBQUE7UUFFUixJQUFJLEdBQVcsQ0FBQTtRQUNmLElBQUksS0FBUSxDQUFBO1FBRVosRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekIsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUNkLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDbEIsQ0FBQztRQUNELElBQUksQ0FBQyxDQUFDO1lBQ0osR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUE7WUFDZixLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQTtRQUNyQixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM3QixNQUFNLElBQUksS0FBSyxDQUFDLHFGQUFtRixHQUFHLE9BQUksQ0FBQyxDQUFBO1FBRTdHLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUE7SUFDckIsQ0FBQyxDQUFDLEVBcEIwQixDQW9CMUIsQ0FBQyxDQUFBO0lBRUgsTUFBTSxDQUFDLE1BQU0sQ0FBQTtBQUNmLENBQUM7O0FBNUJELDhCQTRCQyJ9