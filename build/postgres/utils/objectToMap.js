"use strict";
/**
 * Converts a JavaScript object into an ES6 map.
 */
function objectToMap(object) {
    const map = new Map();
    for (const key of Object.keys(object))
        map.set(key, object[key]);
    return map;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = objectToMap;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JqZWN0VG9NYXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcG9zdGdyZXMvdXRpbHMvb2JqZWN0VG9NYXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOztHQUVHO0FBQ0gscUJBQXFDLE1BQWdDO0lBQ25FLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxFQUFpQixDQUFBO0lBRXBDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDcEMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7SUFFM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQTtBQUNaLENBQUM7QUFQRDs2QkFPQyxDQUFBIn0=