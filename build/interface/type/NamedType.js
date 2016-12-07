"use strict";
const Type_1 = require('./Type');
/**
 * A named type is any type which has a name and an optional description. These
 * types make up the core of our system, so most types can be expected to be
 * named. More interesting are the unnamed types. The unnamed types are
 * abstractions *over* named types. Like the `NullableType` or `ListType`.
 */
class NamedType extends Type_1.default {
    constructor(config) {
        super();
        this.name = config.name;
        this.description = config.description;
    }
    /**
     * Returns itself, because this is a named type. We don’t need to keep
     * searching.
     */
    getNamedType() {
        return this;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NamedType;
/**
 * Detects if a given type is a named type or not.
 */
exports.isNamedType = (type) => typeof type['name'] === 'string';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTmFtZWRUeXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2ludGVyZmFjZS90eXBlL05hbWVkVHlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUJBQWlCLFFBUWpCLENBQUMsQ0FSd0I7QUFFekI7Ozs7O0dBS0c7QUFDSCx3QkFBeUMsY0FBSTtJQWEzQyxZQUFhLE1BR1o7UUFDQyxPQUFPLENBQUE7UUFDUCxJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUE7UUFDdkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFBO0lBQ3ZDLENBQUM7SUFFRDs7O09BR0c7SUFDSSxZQUFZO1FBQ2pCLE1BQU0sQ0FBQyxJQUFJLENBQUE7SUFDYixDQUFDO0FBQ0gsQ0FBQztBQUVEO2tCQUFlLFNBQVMsQ0FBQTtBQUV4Qjs7R0FFRztBQUNVLG1CQUFXLEdBQUcsQ0FBUyxJQUFrQixLQUNwRCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxRQUFRLENBQUEifQ==