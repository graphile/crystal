"use strict";
/**
 * A basic object type is a shortcut for creating a simple `ObjectType`. A basic
 * object type’s value is an object whose key/value pairs match the fields for
 * this type.
 */
var BasicObjectType = (function () {
    function BasicObjectType(_a) {
        var name = _a.name, description = _a.description, fields = _a.fields;
        this.kind = 'OBJECT';
        this.name = name;
        this.description = description;
        this.fields = new Map(Array.from(fields).map(function (_a) {
            var fieldName = _a[0], field = _a[1];
            return [fieldName, {
                    description: field.description,
                    type: field.type,
                    getValue: function (value) { return value[fieldName]; },
                }];
        }));
    }
    BasicObjectType.prototype.fromFields = function (fields) {
        var object = {};
        Array.from(this.fields).forEach(function (_a) {
            var fieldName = _a[0], field = _a[1];
            var fieldValue = fields.get(fieldName);
            if (!field.type.isTypeOf(fieldValue))
                throw new Error("Field value for '" + fieldName + "' is not of the correct type.");
            object[fieldName] = fieldValue;
        });
        return object;
    };
    BasicObjectType.prototype.isTypeOf = function (value) {
        if (value === null || typeof value !== 'object')
            return false;
        for (var _i = 0, _a = Object.keys(value); _i < _a.length; _i++) {
            var fieldName = _a[_i];
            var field = this.fields.get(fieldName);
            if (!field)
                return false;
            if (!field.type.isTypeOf(value[fieldName]))
                return false;
        }
        return true;
    };
    return BasicObjectType;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BasicObjectType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmFzaWNPYmplY3RUeXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2ludGVyZmFjZS90eXBlL0Jhc2ljT2JqZWN0VHlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBR0E7Ozs7R0FJRztBQUNIO0lBTUUseUJBQWEsRUFRWjtZQVBDLGNBQUksRUFDSiw0QkFBVyxFQUNYLGtCQUFNO1FBUlEsU0FBSSxHQUFhLFFBQVEsQ0FBQTtRQWN2QyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtRQUNoQixJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQTtRQUU5QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUMxQyxVQUFDLEVBQWtCO2dCQUFqQixpQkFBUyxFQUFFLGFBQUs7WUFBTSxPQUFBLENBQUMsU0FBUyxFQUFFO29CQUNsQyxXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVc7b0JBQzlCLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtvQkFDaEIsUUFBUSxFQUFFLFVBQUEsS0FBSyxJQUFJLE9BQUEsS0FBSyxDQUFDLFNBQVMsQ0FBQyxFQUFoQixDQUFnQjtpQkFDcEMsQ0FBQztRQUpzQixDQUl0QixDQUNILENBQUMsQ0FBQTtJQUNKLENBQUM7SUFFTSxvQ0FBVSxHQUFqQixVQUFtQixNQUEwQjtRQUMzQyxJQUFNLE1BQU0sR0FBRyxFQUFFLENBQUE7UUFFakIsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsRUFBa0I7Z0JBQWpCLGlCQUFTLEVBQUUsYUFBSztZQUNoRCxJQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFBO1lBRXhDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQ25DLE1BQU0sSUFBSSxLQUFLLENBQUMsc0JBQW9CLFNBQVMsa0NBQStCLENBQUMsQ0FBQTtZQUUvRSxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsVUFBVSxDQUFBO1FBQ2hDLENBQUMsQ0FBQyxDQUFBO1FBRUYsTUFBTSxDQUFDLE1BQU0sQ0FBQTtJQUNmLENBQUM7SUFFTSxrQ0FBUSxHQUFmLFVBQWlCLEtBQVk7UUFDM0IsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLElBQUksSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLENBQUM7WUFDOUMsTUFBTSxDQUFDLEtBQUssQ0FBQTtRQUVkLEdBQUcsQ0FBQyxDQUFvQixVQUFrQixFQUFsQixLQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQWxCLGNBQWtCLEVBQWxCLElBQWtCO1lBQXJDLElBQU0sU0FBUyxTQUFBO1lBQ2xCLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFBO1lBQ3hDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO2dCQUNULE1BQU0sQ0FBQyxLQUFLLENBQUE7WUFDZCxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUN6QyxNQUFNLENBQUMsS0FBSyxDQUFBO1NBQ2Y7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFBO0lBQ2IsQ0FBQztJQUNILHNCQUFDO0FBQUQsQ0FBQyxBQXhERCxJQXdEQzs7QUFXRCxrQkFBZSxlQUFlLENBQUEifQ==