"use strict";
/**
 * A singleton float type which represents a float value as is specified by
 * [IEEE 754][1].
 *
 * [1]: http://en.wikipedia.org/wiki/IEEE_floating_point
 */
var floatType = {
    kind: 'SCALAR',
    name: 'float',
    description: 'A signed number with a fractional component (unlike an integer) as specified ' +
        'by [IEEE 754](http://en.wikipedia.org/wiki/IEEE_floating_point).',
    isTypeOf: function (value) {
        return typeof value === 'number';
    },
    fromInput: function (value) {
        if (typeof value !== 'number')
            throw new Error("Type of input value must be 'number', not '" + typeof value + "'.");
        return value;
    },
    intoOutput: function (value) { return value; },
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = floatType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxvYXRUeXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2ludGVyZmFjZS90eXBlL3NjYWxhci9mbG9hdFR5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUVBOzs7OztHQUtHO0FBQ0gsSUFBTSxTQUFTLEdBQXVCO0lBQ3BDLElBQUksRUFBRSxRQUFRO0lBQ2QsSUFBSSxFQUFFLE9BQU87SUFDYixXQUFXLEVBQ1QsK0VBQStFO1FBQy9FLGtFQUFrRTtJQUVwRSxRQUFRLEVBQUUsVUFBQyxLQUFZO1FBQ3JCLE9BQUEsT0FBTyxLQUFLLEtBQUssUUFBUTtJQUF6QixDQUF5QjtJQUUzQixTQUFTLEVBQUUsVUFBQSxLQUFLO1FBQ2QsRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLEtBQUssUUFBUSxDQUFDO1lBQzVCLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0RBQThDLE9BQU8sS0FBSyxPQUFJLENBQUMsQ0FBQTtRQUVqRixNQUFNLENBQUMsS0FBSyxDQUFBO0lBQ2QsQ0FBQztJQUVELFVBQVUsRUFBRSxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUssRUFBTCxDQUFLO0NBQzNCLENBQUE7O0FBRUQsa0JBQWUsU0FBUyxDQUFBIn0=