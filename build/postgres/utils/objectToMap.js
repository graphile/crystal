"use strict";
/**
 * Converts a JavaScript object into an ES6 map.
 */
function objectToMap(object) {
    var map = new Map();
    for (var _i = 0, _a = Object.keys(object); _i < _a.length; _i++) {
        var key = _a[_i];
        map.set(key, object[key]);
    }
    return map;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = objectToMap;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JqZWN0VG9NYXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcG9zdGdyZXMvdXRpbHMvb2JqZWN0VG9NYXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOztHQUVHO0FBQ0gscUJBQXFDLE1BQWdDO0lBQ25FLElBQU0sR0FBRyxHQUFHLElBQUksR0FBRyxFQUFpQixDQUFBO0lBRXBDLEdBQUcsQ0FBQyxDQUFjLFVBQW1CLEVBQW5CLEtBQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBbkIsY0FBbUIsRUFBbkIsSUFBbUI7UUFBaEMsSUFBTSxHQUFHLFNBQUE7UUFDWixHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtLQUFBO0lBRTNCLE1BQU0sQ0FBQyxHQUFHLENBQUE7QUFDWixDQUFDOztBQVBELDhCQU9DIn0=