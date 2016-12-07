"use strict";
/**
 * A singleton string type that represents a string value. Simply, a string can
 * be defined as an array of characters.
 */
const stringType = {
    name: 'string',
    description: 'A sequence of characters. This type is often used to represent textual, ' +
        'human readable data.',
    getNamedType: () => stringType,
    isTypeOf: (value) => typeof value === 'string',
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = stringType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaW5nVHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9pbnRlcmZhY2UvdHlwZS9wcmltaXRpdmUvc3RyaW5nVHlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBRUE7OztHQUdHO0FBQ0gsTUFBTSxVQUFVLEdBQXNCO0lBQ3BDLElBQUksRUFBRSxRQUFRO0lBQ2QsV0FBVyxFQUNULDBFQUEwRTtRQUMxRSxzQkFBc0I7SUFFeEIsWUFBWSxFQUFFLE1BQ1osVUFBVTtJQUVaLFFBQVEsRUFBRSxDQUFDLEtBQVksS0FDckIsT0FBTyxLQUFLLEtBQUssUUFBUTtDQUM1QixDQUFBO0FBRUQ7a0JBQWUsVUFBVSxDQUFBIn0=