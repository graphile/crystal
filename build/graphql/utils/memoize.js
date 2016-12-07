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
    const initialCache = createEmptyCache();
    return (...args) => {
        const finalCache = args.reduce((cache, arg) => {
            // Because we can’t insert primitive values into `WeakMap`s, we need a
            // seperate map for primitive values. Here we select the appropriate map
            // for our argument type.
            const next = typeof arg === 'object'
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
            finalCache.value = fn(...args);
            finalCache.isSet = true;
        }
        // Return the final value!
        return finalCache.value;
    };
}
exports._memoize = _memoize;
exports.memoize1 = (fn) => _memoize(fn);
exports.memoize2 = (fn) => _memoize(fn);
exports.memoize3 = (fn) => _memoize(fn);
exports.memoize4 = (fn) => _memoize(fn);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVtb2l6ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ncmFwaHFsL3V0aWxzL21lbW9pemUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQW1CQTs7OztHQUlHO0FBQ0g7SUFDRSxNQUFNLENBQUM7UUFDTCxLQUFLLEVBQUUsS0FBSztRQUNaLEtBQUssRUFBRSxTQUFTO1FBQ2hCLFdBQVcsRUFBRSxJQUFJLE9BQU8sRUFBbUI7UUFDM0MsY0FBYyxFQUFFLElBQUksR0FBRyxFQUFtQjtLQUMzQyxDQUFBO0FBQ0gsQ0FBQztBQUVEOzs7Ozs7Ozs7R0FTRztBQUNILDZFQUE2RTtBQUM3RSxpREFBaUQ7QUFDakQsa0JBQTZCLEVBQWdDO0lBQzNELE1BQU0sWUFBWSxHQUFhLGdCQUFnQixFQUFLLENBQUE7SUFFcEQsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFrQjtRQUMzQixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFXLENBQUMsS0FBSyxFQUFFLEdBQUc7WUFDbEQsc0VBQXNFO1lBQ3RFLHdFQUF3RTtZQUN4RSx5QkFBeUI7WUFDekIsTUFBTSxJQUFJLEdBQUcsT0FBTyxHQUFHLEtBQUssUUFBUTtrQkFDaEMsS0FBSyxDQUFDLFdBQVc7a0JBQ2pCLEtBQUssQ0FBQyxjQUFjLENBQUE7WUFFeEIsc0VBQXNFO1lBQ3RFLDZEQUE2RDtZQUM3RCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2pCLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLGdCQUFnQixFQUFLLENBQUMsQ0FBQTtZQUV0Qyx3RUFBd0U7WUFDeEUsMkNBQTJDO1lBQzNDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBRSxDQUFBO1FBQ3ZCLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQTtRQUVoQixxRUFBcUU7UUFDckUsWUFBWTtRQUNaLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDdEIsVUFBVSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQTtZQUM5QixVQUFVLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQTtRQUN6QixDQUFDO1FBRUQsMEJBQTBCO1FBQzFCLE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBTSxDQUFBO0lBQzFCLENBQUMsQ0FBQTtBQUNILENBQUM7QUFoQ2UsZ0JBQVEsV0FnQ3ZCLENBQUE7QUFFWSxnQkFBUSxHQUFHLENBQU8sRUFBZSxLQUFrQixRQUFRLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDL0QsZ0JBQVEsR0FBRyxDQUFVLEVBQXFCLEtBQXdCLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQTtBQUM5RSxnQkFBUSxHQUFHLENBQWEsRUFBMkIsS0FBOEIsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0FBQzdGLGdCQUFRLEdBQUcsQ0FBZ0IsRUFBaUMsS0FBb0MsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFBIn0=