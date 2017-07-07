"use strict";
var interface_1 = require("../../../../interface");
var utils_1 = require("../../../utils");
var pgJsonType = {
    kind: 'ADAPTER',
    baseType: interface_1.jsonType,
    isTypeOf: interface_1.jsonType.isTypeOf,
    transformPgValueIntoValue: function (value) { return value; },
    transformValueIntoPgValue: function (value) {
        return (_a = ["", ""], _a.raw = ["", ""], utils_1.sql.query(_a, utils_1.sql.value(JSON.stringify(value))));
        var _a;
    },
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = pgJsonType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGdKc29uVHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9wb3N0Z3Jlcy9pbnZlbnRvcnkvdHlwZS9zY2FsYXIvcGdKc29uVHlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsbURBQTZEO0FBQzdELHdDQUFvQztBQUdwQyxJQUFNLFVBQVUsR0FBdUM7SUFDckQsSUFBSSxFQUFFLFNBQVM7SUFDZixRQUFRLEVBQUUsb0JBQVE7SUFDbEIsUUFBUSxFQUFFLG9CQUFRLENBQUMsUUFBUTtJQUMzQix5QkFBeUIsRUFBRSxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUssRUFBTCxDQUFLO0lBQ3pDLHlCQUF5QixFQUFFLFVBQUEsS0FBSztRQUFJLGlDQUFTLEVBQUcsRUFBZ0MsRUFBRSxHQUE5QyxXQUFHLENBQUMsS0FBSyxLQUFHLFdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7SUFBNUMsQ0FBOEM7Q0FDbkYsQ0FBQTs7QUFFRCxrQkFBZSxVQUFVLENBQUEifQ==