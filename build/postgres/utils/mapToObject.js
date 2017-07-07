"use strict";
/**
 * Converts an ES6 Map into a JavaScript object.
 */
function mapToObject(map) {
    var object = {};
    for (var _i = 0, _a = Array.from(map); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        object[key] = value;
    }
    return object;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = mapToObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwVG9PYmplY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcG9zdGdyZXMvdXRpbHMvbWFwVG9PYmplY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOztHQUVHO0FBQ0gscUJBQXFDLEdBQXVCO0lBQzFELElBQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQTtJQUVqQixHQUFHLENBQUMsQ0FBdUIsVUFBZSxFQUFmLEtBQUEsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBZixjQUFlLEVBQWYsSUFBZTtRQUEvQixJQUFBLFdBQVksRUFBWCxXQUFHLEVBQUUsYUFBSztRQUNwQixNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFBO0tBQUE7SUFFckIsTUFBTSxDQUFDLE1BQU0sQ0FBQTtBQUNmLENBQUM7O0FBUEQsOEJBT0MifQ==