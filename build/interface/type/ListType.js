"use strict";
const Type_1 = require('./Type');
/**
 * A list type represents the type of a value of which there may be more than
 * one. In a list there may be no items of a given type, there may be one item
 * of a given type, there may be many items of a given type. A list may contain
 * any number of values and this type represents that construct.
 */
class ListType extends Type_1.default {
    constructor(itemType) {
        super();
        this.itemType = itemType;
    }
    /**
     * Checks if the value is an array and if it is an array checks if every item
     * is one of the composite item type.
     */
    isTypeOf(values) {
        return Array.isArray(values) && values.every(value => this.itemType.isTypeOf(value));
    }
    /**
     * Returns the named type inside this list type’s item type.
     */
    getNamedType() {
        return this.itemType.getNamedType();
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ListType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGlzdFR5cGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW50ZXJmYWNlL3R5cGUvTGlzdFR5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHVCQUFpQixRQUNqQixDQUFDLENBRHdCO0FBR3pCOzs7OztHQUtHO0FBQ0gsdUJBQXFFLGNBQUk7SUFDdkUsWUFBYSxRQUEwQjtRQUNyQyxPQUFPLENBQUE7UUFDUCxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQTtJQUMxQixDQUFDO0lBUUQ7OztPQUdHO0lBQ0ksUUFBUSxDQUFFLE1BQWE7UUFDNUIsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQTtJQUN0RixDQUFDO0lBRUQ7O09BRUc7SUFDSSxZQUFZO1FBQ2pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFBO0lBQ3JDLENBQUM7QUFDSCxDQUFDO0FBRUQ7a0JBQWUsUUFBUSxDQUFBIn0=