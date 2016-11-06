"use strict";
/**
 * Any type in our system.
 *
 * Every type object has (in it’s type definition) an associated type, named
 * `TValue`. The difference between a `Type` and `TValue` (often expressed
 * together as `Type<TValue>`) is important to understand. A `Type` we can
 * statically introspect, getting the name, description, and more information.
 * `TValue` represents the compiler type of the `Type` object’s value.
 * So both `Type` and `TValue` represent the same thing, the difference is in
 * the usage. `TValue` is statically defined in code used by the compiler
 * whereas `Type` is defined at runtime.
 *
 * Note that although all types are classes, you could easily use the
 * Typescript `implements` feature to manually implement the interface. Even
 * though these are classes all branching logic is done with functions that
 * don’t require exact inheritance.
 */
class Type {
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Type;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9pbnRlcmZhY2UvdHlwZS9UeXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFQTs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRztBQUNIO0FBZUEsQ0FBQztBQUVEO2tCQUFlLElBQUksQ0FBQSJ9