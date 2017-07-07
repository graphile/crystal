"use strict";
/**
 * This user-defined type guard will check to see if the value being passed in
 * is a type. We do this by checking the value is an object and has a string
 * `kind` field.
 */
function isType(value) {
    return value != null && typeof value === 'object' && typeof value['kind'] === 'string';
}
exports.isType = isType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9pbnRlcmZhY2UvdHlwZS9UeXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFnQ0E7Ozs7R0FJRztBQUNILGdCQUF3QixLQUFZO0lBQ2xDLE1BQU0sQ0FBQyxLQUFLLElBQUksSUFBSSxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxPQUFPLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxRQUFRLENBQUE7QUFDeEYsQ0FBQztBQUZELHdCQUVDIn0=