"use strict";
var memoize_1 = require("../../graphql/utils/memoize");
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
    var internalMethod = descriptor.value;
    // Use the special `memoize` implementation which allows us to memoize a
    // function with any number of arguments, including the `thisArg` argument.
    var memoizedMethod = memoize_1._memoize(function (thisArg) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return internalMethod.apply(thisArg, args);
    });
    // Create a function which redirects to the `memoizedMethod` using the
    // `this` context as the first argument.
    // tslint:disable-next-line only-arrow-functions
    descriptor.value = function memoizeRedirectMethod() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        // tslint:disable-next-line no-invalid-this
        return memoizedMethod.apply(void 0, [this].concat(args));
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = memoizeMethod;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVtb2l6ZU1ldGhvZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wb3N0Z3Jlcy91dGlscy9tZW1vaXplTWV0aG9kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx1REFBc0Q7QUFFdEQ7Ozs7OztHQU1HO0FBQ0gsc0VBQXNFO0FBQ3RFLHVCQUF1QyxPQUFjLEVBQUUsWUFBb0IsRUFBRSxVQUE2QztJQUN4SCxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUM7UUFDcEIsTUFBTSxJQUFJLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFBO0lBRWxELCtCQUErQjtJQUMvQixJQUFNLGNBQWMsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFBO0lBRXZDLHdFQUF3RTtJQUN4RSwyRUFBMkU7SUFDM0UsSUFBTSxjQUFjLEdBQUcsa0JBQVEsQ0FBQyxVQUFDLE9BQWM7UUFBRSxjQUFxQjthQUFyQixVQUFxQixFQUFyQixxQkFBcUIsRUFBckIsSUFBcUI7WUFBckIsNkJBQXFCOztRQUNwRSxNQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUE7SUFDNUMsQ0FBQyxDQUFDLENBQUE7SUFFRixzRUFBc0U7SUFDdEUsd0NBQXdDO0lBQ3hDLGdEQUFnRDtJQUNoRCxVQUFVLENBQUMsS0FBSyxHQUFHO1FBQWdDLGNBQXFCO2FBQXJCLFVBQXFCLEVBQXJCLHFCQUFxQixFQUFyQixJQUFxQjtZQUFyQix5QkFBcUI7O1FBQ3RFLDJDQUEyQztRQUMzQyxNQUFNLENBQUMsY0FBYyxnQkFBQyxJQUFJLFNBQUssSUFBSSxHQUFDO0lBQ3RDLENBQUMsQ0FBQTtBQUNILENBQUM7O0FBcEJELGdDQW9CQyJ9