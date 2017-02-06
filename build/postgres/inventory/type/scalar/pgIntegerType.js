"use strict";
var interface_1 = require("../../../../interface");
var utils_1 = require("../../../utils");
var pgIntegerType = {
    kind: 'ADAPTER',
    baseType: interface_1.integerType,
    isTypeOf: interface_1.integerType.isTypeOf,
    transformPgValueIntoValue: function (value) {
        // If the number is a string, we want to parse it.
        if (typeof value === 'string') {
            // If this number represents money, it has some extra trimmings that
            // need to be fixed.
            if (value.startsWith('$'))
                return parseInt(value.slice(1).replace(',', ''), 10);
            return parseInt(value, 10);
        }
        if (!interface_1.integerType.isTypeOf(value))
            throw new Error("Expected integer. Not '" + typeof value + "'.");
        return value;
    },
    transformValueIntoPgValue: function (value) {
        return (_a = ["(", " + 0)"], _a.raw = ["(", " + 0)"], utils_1.sql.query(_a, utils_1.sql.value(value)));
        var _a;
    },
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = pgIntegerType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGdJbnRlZ2VyVHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9wb3N0Z3Jlcy9pbnZlbnRvcnkvdHlwZS9zY2FsYXIvcGdJbnRlZ2VyVHlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsbURBQWdFO0FBQ2hFLHdDQUFvQztBQUdwQyxJQUFNLGFBQWEsR0FBeUM7SUFDMUQsSUFBSSxFQUFFLFNBQVM7SUFDZixRQUFRLEVBQUUsdUJBQVc7SUFDckIsUUFBUSxFQUFFLHVCQUFXLENBQUMsUUFBUTtJQUM5Qix5QkFBeUIsRUFBRSxVQUFBLEtBQUs7UUFDOUIsa0RBQWtEO1FBQ2xELEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDOUIsb0VBQW9FO1lBQ3BFLG9CQUFvQjtZQUNwQixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUN4QixNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtZQUV0RCxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUM1QixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyx1QkFBVyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMvQixNQUFNLElBQUksS0FBSyxDQUFDLDRCQUEwQixPQUFPLEtBQUssT0FBSSxDQUFDLENBQUE7UUFFN0QsTUFBTSxDQUFDLEtBQUssQ0FBQTtJQUNkLENBQUM7SUFDRCx5QkFBeUIsRUFBRSxVQUFBLEtBQUs7UUFDOUIsdUNBQVMsR0FBSSxFQUFnQixPQUFPLEdBQXBDLFdBQUcsQ0FBQyxLQUFLLEtBQUksV0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7O0lBQTdCLENBQW9DO0NBQ3ZDLENBQUE7O0FBRUQsa0JBQWUsYUFBYSxDQUFBIn0=