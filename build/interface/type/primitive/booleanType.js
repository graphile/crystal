"use strict";
/**
 * A singleton boolean type that represents a boolean value. A boolean value
 * can be either “true” or “false.”
 */
const booleanType = {
    name: 'boolean',
    description: 'A value with only two possible variants: true or false.',
    getNamedType: () => booleanType,
    isTypeOf: (value) => typeof value === 'boolean',
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = booleanType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vbGVhblR5cGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvaW50ZXJmYWNlL3R5cGUvcHJpbWl0aXZlL2Jvb2xlYW5UeXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFQTs7O0dBR0c7QUFDSCxNQUFNLFdBQVcsR0FBdUI7SUFDdEMsSUFBSSxFQUFFLFNBQVM7SUFDZixXQUFXLEVBQ1QseURBQXlEO0lBRTNELFlBQVksRUFBRSxNQUNaLFdBQVc7SUFFYixRQUFRLEVBQUUsQ0FBQyxLQUFZLEtBQ3JCLE9BQU8sS0FBSyxLQUFLLFNBQVM7Q0FDN0IsQ0FBQTtBQUVEO2tCQUFlLFdBQVcsQ0FBQSJ9