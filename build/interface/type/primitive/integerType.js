"use strict";
/**
 * A singleton integer type that represents a number which is in integer, or
 * has no decimal values.
 */
const integerType = {
    name: 'integer',
    description: 'A number that can be written without a fractional component. So 21, 4, or 0 ' +
        'would be an integer while 3.14 would not.',
    getNamedType: () => integerType,
    isTypeOf: (value) => typeof value === 'number' && Number.isInteger(value),
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = integerType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWdlclR5cGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvaW50ZXJmYWNlL3R5cGUvcHJpbWl0aXZlL2ludGVnZXJUeXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFQTs7O0dBR0c7QUFDSCxNQUFNLFdBQVcsR0FBc0I7SUFDckMsSUFBSSxFQUFFLFNBQVM7SUFDZixXQUFXLEVBQ1QsOEVBQThFO1FBQzlFLDJDQUEyQztJQUU3QyxZQUFZLEVBQUUsTUFDWixXQUFXO0lBRWIsUUFBUSxFQUFFLENBQUMsS0FBWSxLQUNyQixPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7Q0FDdkQsQ0FBQTtBQUVEO2tCQUFlLFdBQVcsQ0FBQSJ9