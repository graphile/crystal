"use strict";
const interface_1 = require('../../../../interface');
// TOOD: Maybe this should be in the interface as a primitive?
const pgDatetimeType = new interface_1.AliasType({
    name: 'datetime',
    description: 'A point in time as described by the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) standard. May or may not include a timezone.',
    baseType: interface_1.stringType,
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = pgDatetimeType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGdEYXRldGltZVR5cGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvcG9zdGdyZXMvaW52ZW50b3J5L3R5cGUvaW5kaXZpZHVhbC9wZ0RhdGV0aW1lVHlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsNEJBQXNDLHVCQUd0QyxDQUFDLENBSDREO0FBRTdELDhEQUE4RDtBQUM5RCxNQUFNLGNBQWMsR0FBRyxJQUFJLHFCQUFTLENBQUM7SUFDbkMsSUFBSSxFQUFFLFVBQVU7SUFDaEIsV0FBVyxFQUFFLHFJQUFxSTtJQUNsSixRQUFRLEVBQUUsc0JBQVU7Q0FDckIsQ0FBQyxDQUFBO0FBRUY7a0JBQWUsY0FBYyxDQUFBIn0=