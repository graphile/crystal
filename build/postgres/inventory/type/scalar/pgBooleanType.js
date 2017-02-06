"use strict";
var interface_1 = require("../../../../interface");
var utils_1 = require("../../../utils");
var pgBooleanType = {
    kind: 'ADAPTER',
    baseType: interface_1.booleanType,
    isTypeOf: interface_1.booleanType.isTypeOf,
    transformPgValueIntoValue: function (value) {
        if (!interface_1.booleanType.isTypeOf(value))
            throw new Error("Expected boolean. Not '" + typeof value + "'.");
        return value;
    },
    transformValueIntoPgValue: function (value) {
        return (_a = ["", ""], _a.raw = ["", ""], utils_1.sql.query(_a, utils_1.sql.value(value)));
        var _a;
    },
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = pgBooleanType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGdCb29sZWFuVHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9wb3N0Z3Jlcy9pbnZlbnRvcnkvdHlwZS9zY2FsYXIvcGdCb29sZWFuVHlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsbURBQWdFO0FBQ2hFLHdDQUFvQztBQUdwQyxJQUFNLGFBQWEsR0FBMkM7SUFDNUQsSUFBSSxFQUFFLFNBQVM7SUFDZixRQUFRLEVBQUUsdUJBQVc7SUFDckIsUUFBUSxFQUFFLHVCQUFXLENBQUMsUUFBUTtJQUM5Qix5QkFBeUIsRUFBRSxVQUFBLEtBQUs7UUFDOUIsRUFBRSxDQUFDLENBQUMsQ0FBQyx1QkFBVyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMvQixNQUFNLElBQUksS0FBSyxDQUFDLDRCQUEwQixPQUFPLEtBQUssT0FBSSxDQUFDLENBQUE7UUFFN0QsTUFBTSxDQUFDLEtBQUssQ0FBQTtJQUNkLENBQUM7SUFDRCx5QkFBeUIsRUFBRSxVQUFBLEtBQUs7UUFDOUIsaUNBQVMsRUFBRyxFQUFnQixFQUFFLEdBQTlCLFdBQUcsQ0FBQyxLQUFLLEtBQUcsV0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7O0lBQTVCLENBQThCO0NBQ2pDLENBQUE7O0FBRUQsa0JBQWUsYUFBYSxDQUFBIn0=