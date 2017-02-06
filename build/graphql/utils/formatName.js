"use strict";
var change_case_1 = require("change-case");
var formatInsideUnderscores = function (formatter) { return function (fullName) {
    var _a = /^(_*)(.*?)(_*)$/.exec(fullName), start = _a[1], name = _a[2], finish = _a[3];
    return "" + start + formatter(name) + finish;
}; };
var camelCaseInsideUnderscores = formatInsideUnderscores(function (name) { return change_case_1.camelCase(name, undefined, true); });
var pascalCaseInsideUnderscores = formatInsideUnderscores(function (name) { return change_case_1.pascalCase(name, undefined, true); });
var constantCaseInsideUnderscores = formatInsideUnderscores(change_case_1.constantCase);
var formatName;
(function (formatName) {
    /**
     * Formats a GraphQL type name using PascalCase.
     */
    formatName.type = pascalCaseInsideUnderscores;
    /**
     * Formats a GraphQL field name using camelCase.
     */
    formatName.field = camelCaseInsideUnderscores;
    /**
     * Formats a GraphQL argument name using camelCase.
     */
    formatName.arg = camelCaseInsideUnderscores;
    /**
     * Formats a GraphQL enum value name using CONSTANT_CASE.
     */
    formatName.enumValue = constantCaseInsideUnderscores;
})(formatName || (formatName = {}));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = formatName;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0TmFtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ncmFwaHFsL3V0aWxzL2Zvcm1hdE5hbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDJDQUFpRTtBQUVqRSxJQUFNLHVCQUF1QixHQUFHLFVBQUMsU0FBbUMsSUFBSyxPQUFBLFVBQUMsUUFBZ0I7SUFDbEYsSUFBQSxxQ0FBMkQsRUFBeEQsYUFBSyxFQUFFLFlBQUksRUFBRSxjQUFNLENBQXFDO0lBQ2pFLE1BQU0sQ0FBQyxLQUFHLEtBQUssR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBUSxDQUFBO0FBQzlDLENBQUMsRUFId0UsQ0FHeEUsQ0FBQTtBQUVELElBQU0sMEJBQTBCLEdBQUcsdUJBQXVCLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSx1QkFBUyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLEVBQWhDLENBQWdDLENBQUMsQ0FBQTtBQUNwRyxJQUFNLDJCQUEyQixHQUFHLHVCQUF1QixDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsd0JBQVUsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxFQUFqQyxDQUFpQyxDQUFDLENBQUE7QUFDdEcsSUFBTSw2QkFBNkIsR0FBRyx1QkFBdUIsQ0FBQywwQkFBWSxDQUFDLENBQUE7QUFFM0UsSUFBVSxVQUFVLENBb0JuQjtBQXBCRCxXQUFVLFVBQVU7SUFDbEI7O09BRUc7SUFDVSxlQUFJLEdBQUcsMkJBQTJCLENBQUE7SUFFL0M7O09BRUc7SUFDVSxnQkFBSyxHQUFHLDBCQUEwQixDQUFBO0lBRS9DOztPQUVHO0lBQ1UsY0FBRyxHQUFHLDBCQUEwQixDQUFBO0lBRTdDOztPQUVHO0lBQ1Usb0JBQVMsR0FBRyw2QkFBNkIsQ0FBQTtBQUN4RCxDQUFDLEVBcEJTLFVBQVUsS0FBVixVQUFVLFFBb0JuQjs7QUFFRCxrQkFBZSxVQUFVLENBQUEifQ==