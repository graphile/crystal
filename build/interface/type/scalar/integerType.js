"use strict";
/**
 * A singleton integer type that represents a number which is in integer, or
 * has no decimal values.
 */
var integerType = {
    kind: 'SCALAR',
    name: 'integer',
    description: 'A number that can be written without a fractional component. So 21, 4, or 0 ' +
        'would be an integer while 3.14 would not.',
    isTypeOf: function (value) {
        return typeof value === 'number' && Number.isInteger(value);
    },
    fromInput: function (value) {
        if (typeof value !== 'number')
            throw new Error("Type of input value must be 'number', not '" + typeof value + "'.");
        if (Number.isInteger(value))
            throw new Error("Input number value must be an integer, instead got number '" + value + "'. Perhaps you meant '" + Math.round(value) + "'?");
        return value;
    },
    intoOutput: function (value) { return value; },
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = integerType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWdlclR5cGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvaW50ZXJmYWNlL3R5cGUvc2NhbGFyL2ludGVnZXJUeXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFQTs7O0dBR0c7QUFDSCxJQUFNLFdBQVcsR0FBdUI7SUFDdEMsSUFBSSxFQUFFLFFBQVE7SUFDZCxJQUFJLEVBQUUsU0FBUztJQUNmLFdBQVcsRUFDVCw4RUFBOEU7UUFDOUUsMkNBQTJDO0lBRTdDLFFBQVEsRUFBRSxVQUFDLEtBQVk7UUFDckIsT0FBQSxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7SUFBcEQsQ0FBb0Q7SUFFdEQsU0FBUyxFQUFFLFVBQUEsS0FBSztRQUNkLEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQztZQUM1QixNQUFNLElBQUksS0FBSyxDQUFDLGdEQUE4QyxPQUFPLEtBQUssT0FBSSxDQUFDLENBQUE7UUFFakYsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxQixNQUFNLElBQUksS0FBSyxDQUFDLGdFQUE4RCxLQUFLLDhCQUF5QixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFJLENBQUMsQ0FBQTtRQUVwSSxNQUFNLENBQUMsS0FBSyxDQUFBO0lBQ2QsQ0FBQztJQUVELFVBQVUsRUFBRSxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUssRUFBTCxDQUFLO0NBQzNCLENBQUE7O0FBRUQsa0JBQWUsV0FBVyxDQUFBIn0=