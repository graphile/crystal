"use strict";
/**
 * A singleton string type that represents a string value. Simply, a string can
 * be defined as an array of characters.
 */
const jsonType = {
    name: 'json',
    description: 'A JavaScript object encoded in the JSON format as specified by ' +
        '[ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).',
    getNamedType: () => jsonType,
    isTypeOf: (value) => typeof value === 'string',
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = jsonType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvblR5cGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvaW50ZXJmYWNlL3R5cGUvcHJpbWl0aXZlL2pzb25UeXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFQTs7O0dBR0c7QUFDSCxNQUFNLFFBQVEsR0FBc0I7SUFDbEMsSUFBSSxFQUFFLE1BQU07SUFDWixXQUFXLEVBQ1QsaUVBQWlFO1FBQ2pFLHdGQUF3RjtJQUUxRixZQUFZLEVBQUUsTUFDWixRQUFRO0lBRVYsUUFBUSxFQUFFLENBQUMsS0FBWSxLQUNyQixPQUFPLEtBQUssS0FBSyxRQUFRO0NBQzVCLENBQUE7QUFFRDtrQkFBZSxRQUFRLENBQUEifQ==