"use strict";
var pgStringType_1 = require("../scalar/pgStringType");
var PgAliasType_1 = require("../PgAliasType");
var pgTimeType = new PgAliasType_1.default({
    name: 'time',
    description: 'The exact time of day, does not include the date. May or may not have a timezone offset.',
    baseType: pgStringType_1.default,
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = pgTimeType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGdUaW1lVHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9wb3N0Z3Jlcy9pbnZlbnRvcnkvdHlwZS9jdXN0b20vcGdUaW1lVHlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdURBQWlEO0FBQ2pELDhDQUF3QztBQUV4QyxJQUFNLFVBQVUsR0FBRyxJQUFJLHFCQUFXLENBQUM7SUFDakMsSUFBSSxFQUFFLE1BQU07SUFDWixXQUFXLEVBQUUsMEZBQTBGO0lBQ3ZHLFFBQVEsRUFBRSxzQkFBWTtDQUN2QixDQUFDLENBQUE7O0FBRUYsa0JBQWUsVUFBVSxDQUFBIn0=