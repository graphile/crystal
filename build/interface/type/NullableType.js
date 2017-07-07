"use strict";
/**
 * A nullable type is a type whose value may be null (realistically any
 * constant value), or the value of a base type.
 *
 * You can think of a nullable like `Option` in Rust or `Maybe` in Haskell.
 *
 * A nullable type has two associated types, `TNullValue` and `TNonNullValue`.
 * Nullable types do not expect the null value to be the JavaScript
 * `null`/`undefined`. That is for data producers to decide.
 *
 * There should only ever be one value for `TNullValue`.
 *
 * Why did we choose to default to non-nullable when the two original
 * technologies (PostgreSql and GraphQL) have every type as nullable by
 * default?
 *
 * 1. Non-nullable makes sense. It’s hard to remember that the domain of every
 *    type includes `null`. However, if we specify that a type’s domain *must*
 *    include `null` through this nullable type, our programs are easier to
 *    think about.
 * 2. It’s easier to statically type. With TypeScript we can easily *add* types
 *    with a union, but we can’t take away a type. It would also be a pain to
 *    add `| null` to every `TValue`. Note that we are looking at this problem
 *    from the perspective of `strictNullTypes` on. Without `strictNullTypes`
 *    this choice doesn’t matter.
 * 3. Matches functional programming patterns. As mentioned before, this is a
 *    ubiquitous pattern in functional programming languages.
 *
 * Also note that a nullable type may wrap another nullable type unlike in
 * GraphQL where a non-null type may not wrap another non-null type.
 */
var NullableType = (function () {
    function NullableType(nonNullType) {
        // The unique type kind.
        this.kind = 'NULLABLE';
        this.nonNullType = nonNullType;
    }
    /**
     * Determines if the value passed in is the non-null variant.
     */
    NullableType.prototype.isNonNull = function (value) {
        return value != null;
    };
    /**
     * Checks if the value is null, if so returns true. Otherwise we run
     * `nonNullType.isTypeOf` on the value.
     */
    NullableType.prototype.isTypeOf = function (value) {
        return value == null || this.nonNullType.isTypeOf(value);
    };
    return NullableType;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NullableType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTnVsbGFibGVUeXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2ludGVyZmFjZS90eXBlL051bGxhYmxlVHlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQThCRztBQUNIO0lBU0Usc0JBQWEsV0FBZ0M7UUFSN0Msd0JBQXdCO1FBQ1IsU0FBSSxHQUFlLFVBQVUsQ0FBQTtRQVEzQyxJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQTtJQUNoQyxDQUFDO0lBRUQ7O09BRUc7SUFDSSxnQ0FBUyxHQUFoQixVQUFrQixLQUF1QztRQUN2RCxNQUFNLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQTtJQUN0QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksK0JBQVEsR0FBZixVQUFpQixLQUFZO1FBQzNCLE1BQU0sQ0FBQyxLQUFLLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQzFELENBQUM7SUFDSCxtQkFBQztBQUFELENBQUMsQUEzQkQsSUEyQkM7O0FBRUQsa0JBQWUsWUFBWSxDQUFBIn0=