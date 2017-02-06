"use strict";
/**
 * A singleton boolean type that represents a boolean value. A boolean value
 * can be either “true” or “false.”
 */
var booleanType = {
    kind: 'SCALAR',
    name: 'boolean',
    description: 'A value with only two possible variants: true or false.',
    isTypeOf: function (value) {
        return typeof value === 'boolean';
    },
    fromInput: function (value) {
        if (typeof value !== 'boolean')
            throw new Error("Type of input value must be 'boolean', not '" + typeof value + "'.");
        return value;
    },
    intoOutput: function (value) { return value; },
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = booleanType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vbGVhblR5cGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvaW50ZXJmYWNlL3R5cGUvc2NhbGFyL2Jvb2xlYW5UeXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFQTs7O0dBR0c7QUFDSCxJQUFNLFdBQVcsR0FBd0I7SUFDdkMsSUFBSSxFQUFFLFFBQVE7SUFDZCxJQUFJLEVBQUUsU0FBUztJQUNmLFdBQVcsRUFDVCx5REFBeUQ7SUFFM0QsUUFBUSxFQUFFLFVBQUMsS0FBWTtRQUNyQixPQUFBLE9BQU8sS0FBSyxLQUFLLFNBQVM7SUFBMUIsQ0FBMEI7SUFFNUIsU0FBUyxFQUFFLFVBQUEsS0FBSztRQUNkLEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxLQUFLLFNBQVMsQ0FBQztZQUM3QixNQUFNLElBQUksS0FBSyxDQUFDLGlEQUErQyxPQUFPLEtBQUssT0FBSSxDQUFDLENBQUE7UUFFbEYsTUFBTSxDQUFDLEtBQUssQ0FBQTtJQUNkLENBQUM7SUFFRCxVQUFVLEVBQUUsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFLLEVBQUwsQ0FBSztDQUMzQixDQUFBOztBQUVELGtCQUFlLFdBQVcsQ0FBQSJ9