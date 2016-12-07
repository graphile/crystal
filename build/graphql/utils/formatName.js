"use strict";
const change_case_1 = require('change-case');
const formatInsideUnderscores = (formatter) => (fullName) => {
    const [, start, name, finish] = /^(_*)(.*?)(_*)$/.exec(fullName);
    return `${start}${formatter(name)}${finish}`;
};
const camelCaseInsideUnderscores = formatInsideUnderscores(name => change_case_1.camelCase(name, undefined, true));
const pascalCaseInsideUnderscores = formatInsideUnderscores(name => change_case_1.pascalCase(name, undefined, true));
const constantCaseInsideUnderscores = formatInsideUnderscores(change_case_1.constantCase);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0TmFtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ncmFwaHFsL3V0aWxzL2Zvcm1hdE5hbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUFvRCxhQUVwRCxDQUFDLENBRmdFO0FBRWpFLE1BQU0sdUJBQXVCLEdBQUcsQ0FBQyxTQUFtQyxLQUFLLENBQUMsUUFBZ0I7SUFDeEYsTUFBTSxDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsR0FBRyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFFLENBQUE7SUFDakUsTUFBTSxDQUFDLEdBQUcsS0FBSyxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQTtBQUM5QyxDQUFDLENBQUE7QUFFRCxNQUFNLDBCQUEwQixHQUFHLHVCQUF1QixDQUFDLElBQUksSUFBSSx1QkFBUyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQTtBQUNwRyxNQUFNLDJCQUEyQixHQUFHLHVCQUF1QixDQUFDLElBQUksSUFBSSx3QkFBVSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQTtBQUN0RyxNQUFNLDZCQUE2QixHQUFHLHVCQUF1QixDQUFDLDBCQUFZLENBQUMsQ0FBQTtBQUUzRSxJQUFVLFVBQVUsQ0FvQm5CO0FBcEJELFdBQVUsVUFBVSxFQUFDLENBQUM7SUFDcEI7O09BRUc7SUFDVSxlQUFJLEdBQUcsMkJBQTJCLENBQUE7SUFFL0M7O09BRUc7SUFDVSxnQkFBSyxHQUFHLDBCQUEwQixDQUFBO0lBRS9DOztPQUVHO0lBQ1UsY0FBRyxHQUFHLDBCQUEwQixDQUFBO0lBRTdDOztPQUVHO0lBQ1Usb0JBQVMsR0FBRyw2QkFBNkIsQ0FBQTtBQUN4RCxDQUFDLEVBcEJTLFVBQVUsS0FBVixVQUFVLFFBb0JuQjtBQUVEO2tCQUFlLFVBQVUsQ0FBQSJ9