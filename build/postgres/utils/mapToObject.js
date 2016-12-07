"use strict";
/**
 * Converts an ES6 Map into a JavaScript object.
 */
function mapToObject(map) {
    const object = {};
    for (const [key, value] of map)
        object[key] = value;
    return object;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = mapToObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwVG9PYmplY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcG9zdGdyZXMvdXRpbHMvbWFwVG9PYmplY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOztHQUVHO0FBQ0gscUJBQXFDLEdBQXVCO0lBQzFELE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQTtJQUVqQixHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQztRQUM3QixNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFBO0lBRXJCLE1BQU0sQ0FBQyxNQUFNLENBQUE7QUFDZixDQUFDO0FBUEQ7NkJBT0MsQ0FBQSJ9