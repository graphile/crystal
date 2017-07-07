"use strict";
var interface_1 = require("../../../../interface");
var utils_1 = require("../../../utils");
var pgStringType = {
    kind: 'ADAPTER',
    baseType: interface_1.stringType,
    isTypeOf: interface_1.stringType.isTypeOf,
    transformPgValueIntoValue: function (value) {
        if (typeof value === 'number')
            return value.toString(10);
        if (!interface_1.stringType.isTypeOf(value))
            throw new Error("Expected string. Not '" + typeof value + "'.");
        return value;
    },
    transformValueIntoPgValue: function (value) {
        return (_a = ["", ""], _a.raw = ["", ""], utils_1.sql.query(_a, utils_1.sql.value(value)));
        var _a;
    },
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = pgStringType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGdTdHJpbmdUeXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3Bvc3RncmVzL2ludmVudG9yeS90eXBlL3NjYWxhci9wZ1N0cmluZ1R5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLG1EQUErRDtBQUMvRCx3Q0FBb0M7QUFHcEMsSUFBTSxZQUFZLEdBQXlDO0lBQ3pELElBQUksRUFBRSxTQUFTO0lBQ2YsUUFBUSxFQUFFLHNCQUFVO0lBQ3BCLFFBQVEsRUFBRSxzQkFBVSxDQUFDLFFBQVE7SUFDN0IseUJBQXlCLEVBQUUsVUFBQSxLQUFLO1FBQzlCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQztZQUM1QixNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUUzQixFQUFFLENBQUMsQ0FBQyxDQUFDLHNCQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzlCLE1BQU0sSUFBSSxLQUFLLENBQUMsMkJBQXlCLE9BQU8sS0FBSyxPQUFJLENBQUMsQ0FBQTtRQUU1RCxNQUFNLENBQUMsS0FBSyxDQUFBO0lBQ2QsQ0FBQztJQUNELHlCQUF5QixFQUFFLFVBQUEsS0FBSztRQUM5QixpQ0FBUyxFQUFHLEVBQWdCLEVBQUUsR0FBOUIsV0FBRyxDQUFDLEtBQUssS0FBRyxXQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQzs7SUFBNUIsQ0FBOEI7Q0FDakMsQ0FBQTs7QUFFRCxrQkFBZSxZQUFZLENBQUEifQ==