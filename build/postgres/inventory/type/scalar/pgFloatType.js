"use strict";
var interface_1 = require("../../../../interface");
var utils_1 = require("../../../utils");
// In the absence of /\p{Sc}/ to match all currency symbols, we get the
// following regexp from http://stackoverflow.com/a/27175364/141284
var CURRENY_SYMBOL_REGEXP = /^[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F\u17DB\u20A0-\u20BD\uA838\uFDFC\uFE69\uFF04\uFFE0\uFFE1\uFFE5\uFFE6]/;
var pgFloatType = {
    kind: 'ADAPTER',
    baseType: interface_1.floatType,
    isTypeOf: interface_1.floatType.isTypeOf,
    transformPgValueIntoValue: function (value) {
        // If the number is a string, we want to parse it.
        if (typeof value === 'string') {
            // If this number represents money, it has some extra trimmings that
            // need to be fixed.
            if (CURRENY_SYMBOL_REGEXP.test(value))
                return parseFloat(value.slice(1).replace(',', ''));
            return parseFloat(value);
        }
        if (!interface_1.floatType.isTypeOf(value))
            throw new Error("Expected float. Not '" + typeof value + "'.");
        return value;
    },
    transformValueIntoPgValue: function (value) {
        return (_a = ["(", " + 0.0)"], _a.raw = ["(", " + 0.0)"], utils_1.sql.query(_a, utils_1.sql.value(value)));
        var _a;
    },
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = pgFloatType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGdGbG9hdFR5cGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvcG9zdGdyZXMvaW52ZW50b3J5L3R5cGUvc2NhbGFyL3BnRmxvYXRUeXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxtREFBOEQ7QUFDOUQsd0NBQW9DO0FBR3BDLHVFQUF1RTtBQUN2RSxtRUFBbUU7QUFDbkUsSUFBTSxxQkFBcUIsR0FDekIsbUlBQW1JLENBQUE7QUFFckksSUFBTSxXQUFXLEdBQXlDO0lBQ3hELElBQUksRUFBRSxTQUFTO0lBQ2YsUUFBUSxFQUFFLHFCQUFTO0lBQ25CLFFBQVEsRUFBRSxxQkFBUyxDQUFDLFFBQVE7SUFDNUIseUJBQXlCLEVBQUUsVUFBQSxLQUFLO1FBQzlCLGtEQUFrRDtRQUNsRCxFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQzlCLG9FQUFvRTtZQUNwRSxvQkFBb0I7WUFDcEIsRUFBRSxDQUFDLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNwQyxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFBO1lBRXBELE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDMUIsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMscUJBQVMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDN0IsTUFBTSxJQUFJLEtBQUssQ0FBQywwQkFBd0IsT0FBTyxLQUFLLE9BQUksQ0FBQyxDQUFBO1FBRTNELE1BQU0sQ0FBQyxLQUFLLENBQUE7SUFDZCxDQUFDO0lBQ0QseUJBQXlCLEVBQUUsVUFBQSxLQUFLO1FBQzlCLHlDQUFTLEdBQUksRUFBZ0IsU0FBUyxHQUF0QyxXQUFHLENBQUMsS0FBSyxLQUFJLFdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDOztJQUE3QixDQUFzQztDQUN6QyxDQUFBOztBQUVELGtCQUFlLFdBQVcsQ0FBQSJ9