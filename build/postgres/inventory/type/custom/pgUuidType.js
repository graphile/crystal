"use strict";
var pgStringType_1 = require("../scalar/pgStringType");
var PgAliasType_1 = require("../PgAliasType");
/**
 * The type for a universal identifier as defined by [RFC 4122][1].
 *
 * [1]: https://tools.ietf.org/html/rfc4122
 */
var pgUuidType = new PgAliasType_1.default({
    name: 'uuid',
    description: 'A universally unique identifier as defined by [RFC 4122](https://tools.ietf.org/html/rfc4122).',
    baseType: pgStringType_1.default,
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = pgUuidType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGdVdWlkVHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9wb3N0Z3Jlcy9pbnZlbnRvcnkvdHlwZS9jdXN0b20vcGdVdWlkVHlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdURBQWlEO0FBQ2pELDhDQUF3QztBQUV4Qzs7OztHQUlHO0FBQ0gsSUFBTSxVQUFVLEdBQUcsSUFBSSxxQkFBVyxDQUFDO0lBQ2pDLElBQUksRUFBRSxNQUFNO0lBQ1osV0FBVyxFQUFFLGdHQUFnRztJQUM3RyxRQUFRLEVBQUUsc0JBQVk7Q0FDdkIsQ0FBQyxDQUFBOztBQUVGLGtCQUFlLFVBQVUsQ0FBQSJ9