"use strict";
var Type_1 = require("./Type");
function switchType(typeOrCases, maybeCases) {
    if (Type_1.isType(typeOrCases))
        if (maybeCases)
            return switchType(maybeCases)(typeOrCases);
        else
            throw new Error('A type was provided as the first argument, cases must be defined as the second argument.');
    var cases = typeOrCases;
    if (!cases.nullable || !cases.list || !cases.alias || !cases.enum || !cases.object || !cases.scalar)
        throw new Error('Invalid cases object. Make sure you provided a valid type.');
    function callSwitchTypeCase(type) {
        switch (type.kind) {
            // tslint:disable no-any
            case 'ADAPTER': return cases.adapter ? cases.adapter(type) : callSwitchTypeCase(type.baseType);
            case 'NULLABLE': return cases.nullable(type);
            case 'LIST': return cases.list(type);
            case 'ALIAS': return cases.alias(type);
            case 'ENUM': return cases.enum(type);
            case 'OBJECT': return cases.object(type);
            case 'SCALAR': return cases.scalar(type);
            // tslint:enable no-any
            default: throw new Error("Type of kind '" + type.kind + "' is unrecognized.");
        }
    }
    return callSwitchTypeCase;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = switchType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3dpdGNoVHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9pbnRlcmZhY2UvdHlwZS9zd2l0Y2hUeXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwrQkFBcUM7QUFzQ3JDLG9CQUF3QixXQUE2QyxFQUFFLFVBQStCO0lBQ3BHLEVBQUUsQ0FBQyxDQUFDLGFBQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN0QixFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUM7WUFDYixNQUFNLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQzVDLElBQUk7WUFDRixNQUFNLElBQUksS0FBSyxDQUFDLDBGQUEwRixDQUFDLENBQUE7SUFFL0csSUFBTSxLQUFLLEdBQUcsV0FBVyxDQUFBO0lBRXpCLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBQ2xHLE1BQU0sSUFBSSxLQUFLLENBQUMsNERBQTRELENBQUMsQ0FBQTtJQUUvRSw0QkFBNkIsSUFBaUI7UUFDNUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDbEIsd0JBQXdCO1lBQ3hCLEtBQUssU0FBUyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBVyxDQUFDLEdBQUcsa0JBQWtCLENBQUUsSUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1lBQzlHLEtBQUssVUFBVSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQVcsQ0FBQyxDQUFBO1lBQ25ELEtBQUssTUFBTSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQVcsQ0FBQyxDQUFBO1lBQzNDLEtBQUssT0FBTyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQVcsQ0FBQyxDQUFBO1lBQzdDLEtBQUssTUFBTSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQVcsQ0FBQyxDQUFBO1lBQzNDLEtBQUssUUFBUSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQVcsQ0FBQyxDQUFBO1lBQy9DLEtBQUssUUFBUSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQVcsQ0FBQyxDQUFBO1lBQy9DLHVCQUF1QjtZQUN2QixTQUFTLE1BQU0sSUFBSSxLQUFLLENBQUMsbUJBQWlCLElBQUksQ0FBQyxJQUFJLHVCQUFvQixDQUFDLENBQUE7UUFDMUUsQ0FBQztJQUNILENBQUM7SUFFRCxNQUFNLENBQUMsa0JBQWtCLENBQUE7QUFDM0IsQ0FBQzs7QUFFRCxrQkFBZSxVQUFVLENBQUEifQ==