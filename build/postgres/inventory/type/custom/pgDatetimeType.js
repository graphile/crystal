"use strict";
var pgStringType_1 = require("../scalar/pgStringType");
var PgAliasType_1 = require("../PgAliasType");
// TOOD: Maybe this should be in the interface as a primitive?
var pgDatetimeType = new PgAliasType_1.default({
    name: 'datetime',
    description: 'A point in time as described by the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) standard. May or may not include a timezone.',
    baseType: pgStringType_1.default,
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = pgDatetimeType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGdEYXRldGltZVR5cGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvcG9zdGdyZXMvaW52ZW50b3J5L3R5cGUvY3VzdG9tL3BnRGF0ZXRpbWVUeXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx1REFBaUQ7QUFDakQsOENBQXdDO0FBRXhDLDhEQUE4RDtBQUM5RCxJQUFNLGNBQWMsR0FBRyxJQUFJLHFCQUFXLENBQUM7SUFDckMsSUFBSSxFQUFFLFVBQVU7SUFDaEIsV0FBVyxFQUFFLHFJQUFxSTtJQUNsSixRQUFRLEVBQUUsc0JBQVk7Q0FDdkIsQ0FBQyxDQUFBOztBQUVGLGtCQUFlLGNBQWMsQ0FBQSJ9