"use strict";
var interface_1 = require("../../../../interface");
var utils_1 = require("../../../utils");
var pgStringType = {
    kind: 'ADAPTER',
    baseType: interface_1.stringType,
    isTypeOf: interface_1.stringType.isTypeOf,
    transformPgValueIntoValue: function (value) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGdTdHJpbmdUeXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3Bvc3RncmVzL2ludmVudG9yeS90eXBlL3NjYWxhci9wZ1N0cmluZ1R5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLG1EQUErRDtBQUMvRCx3Q0FBb0M7QUFHcEMsSUFBTSxZQUFZLEdBQXlDO0lBQ3pELElBQUksRUFBRSxTQUFTO0lBQ2YsUUFBUSxFQUFFLHNCQUFVO0lBQ3BCLFFBQVEsRUFBRSxzQkFBVSxDQUFDLFFBQVE7SUFDN0IseUJBQXlCLEVBQUUsVUFBQSxLQUFLO1FBQzlCLEVBQUUsQ0FBQyxDQUFDLENBQUMsc0JBQVUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDOUIsTUFBTSxJQUFJLEtBQUssQ0FBQywyQkFBeUIsT0FBTyxLQUFLLE9BQUksQ0FBQyxDQUFBO1FBRTVELE1BQU0sQ0FBQyxLQUFLLENBQUE7SUFDZCxDQUFDO0lBQ0QseUJBQXlCLEVBQUUsVUFBQSxLQUFLO1FBQzlCLGlDQUFTLEVBQUcsRUFBZ0IsRUFBRSxHQUE5QixXQUFHLENBQUMsS0FBSyxLQUFHLFdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDOztJQUE1QixDQUE4QjtDQUNqQyxDQUFBOztBQUVELGtCQUFlLFlBQVksQ0FBQSJ9