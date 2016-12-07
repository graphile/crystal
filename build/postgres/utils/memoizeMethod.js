"use strict";
const memoize_1 = require('../../graphql/utils/memoize');
/**
 * Memoizes an object method with any number of arguments. This will not change
 * the method type signature.
 *
 * This decorator will also capture `this` and memoize against that object as
 * well.
 */
// TODO: Decorator could use some variadic types as its function call.
function memoizeMethod(_target, _propertyKey, descriptor) {
    if (!descriptor.value)
        throw new Error('No method defined to memoize.');
    // Extract the internal method.
    const internalMethod = descriptor.value;
    // Use the special `memoize` implementation which allows us to memoize a
    // function with any number of arguments, including the `thisArg` argument.
    const memoizedMethod = memoize_1._memoize((thisArg, ...args) => {
        return internalMethod.apply(thisArg, args);
    });
    // Create a function which redirects to the `memoizedMethod` using the
    // `this` context as the first argument.
    // tslint:disable-next-line only-arrow-functions
    descriptor.value = function memoizeRedirectMethod(...args) {
        // tslint:disable-next-line no-invalid-this
        return memoizedMethod(this, ...args);
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = memoizeMethod;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVtb2l6ZU1ldGhvZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wb3N0Z3Jlcy91dGlscy9tZW1vaXplTWV0aG9kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwwQkFBeUIsNkJBVXpCLENBQUMsQ0FWcUQ7QUFFdEQ7Ozs7OztHQU1HO0FBQ0gsc0VBQXNFO0FBQ3RFLHVCQUF1QyxPQUFjLEVBQUUsWUFBb0IsRUFBRSxVQUE2QztJQUN4SCxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUM7UUFDcEIsTUFBTSxJQUFJLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFBO0lBRWxELCtCQUErQjtJQUMvQixNQUFNLGNBQWMsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFBO0lBRXZDLHdFQUF3RTtJQUN4RSwyRUFBMkU7SUFDM0UsTUFBTSxjQUFjLEdBQUcsa0JBQVEsQ0FBQyxDQUFDLE9BQWMsRUFBRSxHQUFHLElBQWtCO1FBQ3BFLE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQTtJQUM1QyxDQUFDLENBQUMsQ0FBQTtJQUVGLHNFQUFzRTtJQUN0RSx3Q0FBd0M7SUFDeEMsZ0RBQWdEO0lBQ2hELFVBQVUsQ0FBQyxLQUFLLEdBQUcsK0JBQWdDLEdBQUcsSUFBa0I7UUFDdEUsMkNBQTJDO1FBQzNDLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUE7SUFDdEMsQ0FBQyxDQUFBO0FBQ0gsQ0FBQztBQXBCRDsrQkFvQkMsQ0FBQSJ9