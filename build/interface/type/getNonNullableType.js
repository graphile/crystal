"use strict";
var switchType_1 = require("./switchType");
var getNonNullableType = switchType_1.default({
    nullable: function (type) { return type.nonNullType; },
    list: function (type) { return type; },
    alias: function (type) { return type; },
    enum: function (type) { return type; },
    object: function (type) { return type; },
    scalar: function (type) { return type; },
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getNonNullableType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0Tm9uTnVsbGFibGVUeXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2ludGVyZmFjZS90eXBlL2dldE5vbk51bGxhYmxlVHlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsMkNBQXFDO0FBRXJDLElBQU0sa0JBQWtCLEdBQUcsb0JBQVUsQ0FBYztJQUNqRCxRQUFRLEVBQUUsVUFBQSxJQUFJLElBQUksT0FBQSxJQUFJLENBQUMsV0FBVyxFQUFoQixDQUFnQjtJQUNsQyxJQUFJLEVBQUUsVUFBQSxJQUFJLElBQUksT0FBQSxJQUFJLEVBQUosQ0FBSTtJQUNsQixLQUFLLEVBQUUsVUFBQSxJQUFJLElBQUksT0FBQSxJQUFJLEVBQUosQ0FBSTtJQUNuQixJQUFJLEVBQUUsVUFBQSxJQUFJLElBQUksT0FBQSxJQUFJLEVBQUosQ0FBSTtJQUNsQixNQUFNLEVBQUUsVUFBQSxJQUFJLElBQUksT0FBQSxJQUFJLEVBQUosQ0FBSTtJQUNwQixNQUFNLEVBQUUsVUFBQSxJQUFJLElBQUksT0FBQSxJQUFJLEVBQUosQ0FBSTtDQUNyQixDQUFDLENBQUE7O0FBRUYsa0JBQWUsa0JBQWtCLENBQUEifQ==