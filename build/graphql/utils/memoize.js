"use strict";
/**
 * Creates an empty cache object.
 *
 * @private
 */
function createEmptyCache() {
    return {
        isSet: false,
        value: undefined,
        nextObjects: new WeakMap(),
        nextPrimitives: new Map(),
    };
}
/**
 * A memoization implementation that will memoize any number of function
 * arguments using `WeakMap`s so memory isn’t abused.
 *
 * The memoization cache is in a tree shape where each node may have a cached
 * value and child nodes. If you call a memoized function with 3 arguments, the
 * memoized tree will be 3 nodes deep.
 *
 * @private
 */
// TODO: Have this use variadic types when they are added to Typescript. Then
// we shouldn’t need `memoize1`, `memoize2`, etc.
function _memoize(fn) {
    var initialCache = createEmptyCache();
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var finalCache = args.reduce(function (cache, arg) {
            // Because we can’t insert primitive values into `WeakMap`s, we need a
            // seperate map for primitive values. Here we select the appropriate map
            // for our argument type.
            var next = typeof arg === 'object'
                ? cache.nextObjects
                : cache.nextPrimitives;
            // If we need a cache for this position and none has been set, we need
            // to create a cache object that has not yet had a value set.
            if (!next.has(arg))
                next.set(arg, createEmptyCache());
            // Grab the cache for this argument, we know it exists because we create
            // it in the last step if it doesn’t exist.
            return next.get(arg);
        }, initialCache);
        // If no value has been set in our cache, we actually need to run the
        // function.
        if (!finalCache.isSet) {
            finalCache.value = fn.apply(void 0, args);
            finalCache.isSet = true;
        }
        // Return the final value!
        return finalCache.value;
    };
}
exports._memoize = _memoize;
exports.memoize1 = function (fn) { return _memoize(fn); };
exports.memoize2 = function (fn) { return _memoize(fn); };
exports.memoize3 = function (fn) { return _memoize(fn); };
exports.memoize4 = function (fn) { return _memoize(fn); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVtb2l6ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ncmFwaHFsL3V0aWxzL21lbW9pemUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQW1CQTs7OztHQUlHO0FBQ0g7SUFDRSxNQUFNLENBQUM7UUFDTCxLQUFLLEVBQUUsS0FBSztRQUNaLEtBQUssRUFBRSxTQUFTO1FBQ2hCLFdBQVcsRUFBRSxJQUFJLE9BQU8sRUFBbUI7UUFDM0MsY0FBYyxFQUFFLElBQUksR0FBRyxFQUFtQjtLQUMzQyxDQUFBO0FBQ0gsQ0FBQztBQUVEOzs7Ozs7Ozs7R0FTRztBQUNILDZFQUE2RTtBQUM3RSxpREFBaUQ7QUFDakQsa0JBQTZCLEVBQWdDO0lBQzNELElBQU0sWUFBWSxHQUFhLGdCQUFnQixFQUFLLENBQUE7SUFFcEQsTUFBTSxDQUFDO1FBQUMsY0FBcUI7YUFBckIsVUFBcUIsRUFBckIscUJBQXFCLEVBQXJCLElBQXFCO1lBQXJCLHlCQUFxQjs7UUFDM0IsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBVyxVQUFDLEtBQUssRUFBRSxHQUFHO1lBQ2xELHNFQUFzRTtZQUN0RSx3RUFBd0U7WUFDeEUseUJBQXlCO1lBQ3pCLElBQU0sSUFBSSxHQUFHLE9BQU8sR0FBRyxLQUFLLFFBQVE7a0JBQ2hDLEtBQUssQ0FBQyxXQUFXO2tCQUNqQixLQUFLLENBQUMsY0FBYyxDQUFBO1lBRXhCLHNFQUFzRTtZQUN0RSw2REFBNkQ7WUFDN0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNqQixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxnQkFBZ0IsRUFBSyxDQUFDLENBQUE7WUFFdEMsd0VBQXdFO1lBQ3hFLDJDQUEyQztZQUMzQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUUsQ0FBQTtRQUN2QixDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUE7UUFFaEIscUVBQXFFO1FBQ3JFLFlBQVk7UUFDWixFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLFVBQVUsQ0FBQyxLQUFLLEdBQUcsRUFBRSxlQUFJLElBQUksQ0FBQyxDQUFBO1lBQzlCLFVBQVUsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFBO1FBQ3pCLENBQUM7UUFFRCwwQkFBMEI7UUFDMUIsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFNLENBQUE7SUFDMUIsQ0FBQyxDQUFBO0FBQ0gsQ0FBQztBQWhDRCw0QkFnQ0M7QUFFWSxRQUFBLFFBQVEsR0FBRyxVQUFPLEVBQWUsSUFBa0IsT0FBQSxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQVosQ0FBWSxDQUFBO0FBQy9ELFFBQUEsUUFBUSxHQUFHLFVBQVUsRUFBcUIsSUFBd0IsT0FBQSxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQVosQ0FBWSxDQUFBO0FBQzlFLFFBQUEsUUFBUSxHQUFHLFVBQWEsRUFBMkIsSUFBOEIsT0FBQSxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQVosQ0FBWSxDQUFBO0FBQzdGLFFBQUEsUUFBUSxHQUFHLFVBQWdCLEVBQWlDLElBQW9DLE9BQUEsUUFBUSxDQUFDLEVBQUUsQ0FBQyxFQUFaLENBQVksQ0FBQSJ9