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
function buildObject(...entriess) {
    const object = {};
    entriess.forEach(entries => entries.forEach(entry => {
        if (!entry)
            return;
        const [key, value] = entry;
        if (object.hasOwnProperty(key))
            throw new Error(`Naming conflict when building object. Cannot have two definitions for property '${key}'.`);
        object[key] = value;
    }));
    return object;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = buildObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGRPYmplY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZ3JhcGhxbC91dGlscy9idWlsZE9iamVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQThCRztBQUNILHFCQUNFLEdBQUcsUUFBOEQ7SUFFakUsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFBO0lBRWpCLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSztRQUMvQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUNULE1BQU0sQ0FBQTtRQUVSLE1BQU0sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFBO1FBRTFCLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDN0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxtRkFBbUYsR0FBRyxJQUFJLENBQUMsQ0FBQTtRQUU3RyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFBO0lBQ3JCLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFFSCxNQUFNLENBQUMsTUFBTSxDQUFBO0FBQ2YsQ0FBQztBQWxCRDs2QkFrQkMsQ0FBQSJ9