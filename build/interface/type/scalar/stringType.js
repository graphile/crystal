"use strict";
/**
 * A singleton string type that represents a string value. Simply, a string can
 * be defined as an array of characters.
 */
var stringType = {
    kind: 'SCALAR',
    name: 'string',
    description: 'A sequence of characters. This type is often used to represent textual, ' +
        'human readable data.',
    isTypeOf: function (value) {
        return typeof value === 'string';
    },
    fromInput: function (value) {
        if (typeof value !== 'string')
            throw new Error("Type of input value must be 'string', not '" + typeof value + "'.");
        return value;
    },
    intoOutput: function (value) { return value; },
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = stringType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaW5nVHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9pbnRlcmZhY2UvdHlwZS9zY2FsYXIvc3RyaW5nVHlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBRUE7OztHQUdHO0FBQ0gsSUFBTSxVQUFVLEdBQXVCO0lBQ3JDLElBQUksRUFBRSxRQUFRO0lBQ2QsSUFBSSxFQUFFLFFBQVE7SUFDZCxXQUFXLEVBQ1QsMEVBQTBFO1FBQzFFLHNCQUFzQjtJQUV4QixRQUFRLEVBQUUsVUFBQyxLQUFZO1FBQ3JCLE9BQUEsT0FBTyxLQUFLLEtBQUssUUFBUTtJQUF6QixDQUF5QjtJQUUzQixTQUFTLEVBQUUsVUFBQSxLQUFLO1FBQ2QsRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLEtBQUssUUFBUSxDQUFDO1lBQzVCLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0RBQThDLE9BQU8sS0FBSyxPQUFJLENBQUMsQ0FBQTtRQUVqRixNQUFNLENBQUMsS0FBSyxDQUFBO0lBQ2QsQ0FBQztJQUVELFVBQVUsRUFBRSxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUssRUFBTCxDQUFLO0NBQzNCLENBQUE7O0FBRUQsa0JBQWUsVUFBVSxDQUFBIn0=