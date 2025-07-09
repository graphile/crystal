import { GraphQLSchema } from "graphql";
/**
 * This function is heavily based on
 * {@link https://github.com/graphql/graphql-js/blob/0eb088b3d1228ac60568912c705401341f3b769d/src/utilities/lexicographicSortSchema.js | `lexicographicSortSchema` from `graphql`}
 * (MIT license), but differs in that it does not change the order of fields,
 * arguments or enum values.
 */
export declare function consistentlyOrderedSchema(schema: GraphQLSchema): GraphQLSchema;
/**
 * Returns a number indicating whether a reference string comes before, or after,
 * or is the same as the given string in natural sort order.
 *
 * See: https://en.wikipedia.org/wiki/Natural_sort_order
 *
 */
export declare function naturalCompare(aStr: string, bStr: string): number;
//# sourceMappingURL=consistentlyOrderedSchema.d.ts.map