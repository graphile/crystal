"use strict";
/**
 * A singleton float type which represents a float value as is specified by
 * [IEEE 754][1].
 *
 * [1]: http://en.wikipedia.org/wiki/IEEE_floating_point
 */
const floatType = {
    name: 'float',
    description: 'A signed number with a fractional component (unlike an integer) as specified ' +
        'by [IEEE 754](http://en.wikipedia.org/wiki/IEEE_floating_point).',
    getNamedType: () => floatType,
    isTypeOf: (value) => typeof value === 'number',
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = floatType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxvYXRUeXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2ludGVyZmFjZS90eXBlL3ByaW1pdGl2ZS9mbG9hdFR5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUVBOzs7OztHQUtHO0FBQ0gsTUFBTSxTQUFTLEdBQXNCO0lBQ25DLElBQUksRUFBRSxPQUFPO0lBQ2IsV0FBVyxFQUNULCtFQUErRTtRQUMvRSxrRUFBa0U7SUFFcEUsWUFBWSxFQUFFLE1BQ1osU0FBUztJQUVYLFFBQVEsRUFBRSxDQUFDLEtBQVksS0FDckIsT0FBTyxLQUFLLEtBQUssUUFBUTtDQUM1QixDQUFBO0FBRUQ7a0JBQWUsU0FBUyxDQUFBIn0=