"use strict";
const NamedType_1 = require('./NamedType');
/**
 * An enum type represents a type for which the domain is a set of
 * predetermined string values called variants.
 */
class EnumType extends NamedType_1.default {
    constructor(config) {
        super(config);
        this.variants = config.variants;
    }
    /**
     * Checks if the value is a string and that string is one of this enum’s
     * variants.
     */
    isTypeOf(value) {
        return typeof value === 'string' && this.variants.has(value);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EnumType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW51bVR5cGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW50ZXJmYWNlL3R5cGUvRW51bVR5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDRCQUFzQixhQU10QixDQUFDLENBTmtDO0FBRW5DOzs7R0FHRztBQUNILHVCQUF1QixtQkFBUztJQU05QixZQUFhLE1BSVo7UUFDQyxNQUFNLE1BQU0sQ0FBQyxDQUFBO1FBQ2IsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFBO0lBQ2pDLENBQUM7SUFFRDs7O09BR0c7SUFDSSxRQUFRLENBQUUsS0FBWTtRQUMzQixNQUFNLENBQUMsT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQzlELENBQUM7QUFDSCxDQUFDO0FBRUQ7a0JBQWUsUUFBUSxDQUFBIn0=