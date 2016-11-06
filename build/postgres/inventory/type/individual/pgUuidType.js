"use strict";
const interface_1 = require('../../../../interface');
/**
 * The type for a universal identifier as defined by [RFC 4122][1].
 *
 * [1]: https://tools.ietf.org/html/rfc4122
 */
const pgUuidType = new interface_1.AliasType({
    name: 'uuid',
    description: 'A universally unique identifier as defined by [RFC 4122](https://tools.ietf.org/html/rfc4122).',
    baseType: interface_1.stringType,
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = pgUuidType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGdVdWlkVHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9wb3N0Z3Jlcy9pbnZlbnRvcnkvdHlwZS9pbmRpdmlkdWFsL3BnVXVpZFR5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDRCQUFzQyx1QkFPdEMsQ0FBQyxDQVA0RDtBQUU3RDs7OztHQUlHO0FBQ0gsTUFBTSxVQUFVLEdBQUcsSUFBSSxxQkFBUyxDQUFDO0lBQy9CLElBQUksRUFBRSxNQUFNO0lBQ1osV0FBVyxFQUFFLGdHQUFnRztJQUM3RyxRQUFRLEVBQUUsc0JBQVU7Q0FDckIsQ0FBQyxDQUFBO0FBRUY7a0JBQWUsVUFBVSxDQUFBIn0=