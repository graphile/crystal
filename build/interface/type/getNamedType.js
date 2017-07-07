"use strict";
var switchType_1 = require("./switchType");
/**
 * Gets the named type for a given type. The named type will have a name in
 * description, getting this type can be useful when generating documentation.
 *
 * Basically this only recursively unfolds nullable and list types while just
 * returning everyone else.
 */
var getNamedType = switchType_1.default({
    nullable: function (type) { return getNamedType(type.nonNullType); },
    list: function (type) { return getNamedType(type.itemType); },
    alias: function (type) { return type; },
    enum: function (type) { return type; },
    object: function (type) { return type; },
    scalar: function (type) { return type; },
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getNamedType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0TmFtZWRUeXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2ludGVyZmFjZS90eXBlL2dldE5hbWVkVHlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBRUEsMkNBQXFDO0FBRXJDOzs7Ozs7R0FNRztBQUNILElBQU0sWUFBWSxHQUE0QyxvQkFBVSxDQUFtQjtJQUN6RixRQUFRLEVBQUUsVUFBQSxJQUFJLElBQUksT0FBQSxZQUFZLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUE5QixDQUE4QjtJQUNoRCxJQUFJLEVBQUUsVUFBQSxJQUFJLElBQUksT0FBQSxZQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUEzQixDQUEyQjtJQUN6QyxLQUFLLEVBQUUsVUFBQSxJQUFJLElBQUksT0FBQSxJQUFJLEVBQUosQ0FBSTtJQUNuQixJQUFJLEVBQUUsVUFBQSxJQUFJLElBQUksT0FBQSxJQUFJLEVBQUosQ0FBSTtJQUNsQixNQUFNLEVBQUUsVUFBQSxJQUFJLElBQUksT0FBQSxJQUFJLEVBQUosQ0FBSTtJQUNwQixNQUFNLEVBQUUsVUFBQSxJQUFJLElBQUksT0FBQSxJQUFJLEVBQUosQ0FBSTtDQUNyQixDQUFDLENBQUE7O0FBRUYsa0JBQWUsWUFBWSxDQUFBIn0=