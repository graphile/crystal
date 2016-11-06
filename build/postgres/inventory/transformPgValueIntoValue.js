"use strict";
const interface_1 = require('../../interface');
/**
 * If a type has this symbol, then it will be used to transform a value instead
 * of the default transformation.
 */
exports.$$transformPgValueIntoValue = Symbol();
/**
 * Transforms a Postgres value that we get back from the database into a value
 * we can use in our interface. If the type has an implementation for the
 * symbol `$$transformPgValue` then that implementation will be used.
 */
// TODO: Remove need for transformers.
function transformPgValueIntoValue(type, value) {
    // If the type has defined a custom implementation for this function, use it.
    if (type[exports.$$transformPgValueIntoValue])
        return type[exports.$$transformPgValueIntoValue](value);
    // If the type is a nullable type, make sure to run `transformPgValue` only
    // if the value is not null.
    if (type instanceof interface_1.NullableType)
        return value == null ? value : transformPgValueIntoValue(type.nonNullType, value);
    // If the type is a list, let us run `transformPgValue` on all of the list
    // items.
    if (type instanceof interface_1.ListType) {
        if (!Array.isArray(value))
            throw new Error('Posgres value of list type must be an array.');
        return value.map(item => transformPgValueIntoValue(type.itemType, item));
    }
    // If this is an alias type, just run the transform function with its base
    // type.
    if (type instanceof interface_1.AliasType)
        return transformPgValueIntoValue(type.baseType, value);
    // If the is an enum type, or one of a select few primitive types, trust
    // Postgres did the right thing and return the value.
    if (type instanceof interface_1.EnumType ||
        type === interface_1.booleanType ||
        type === interface_1.stringType)
        return value;
    // If this is a numeric type (integer or float), return the value. If we got
    // a string, parse the value into a number first.
    if (type === interface_1.integerType ||
        type === interface_1.floatType) {
        // If the number is a string, we want to parse it.
        if (typeof value === 'string') {
            // If this number represents money, it has some extra trimmings that
            // need to be fixed.
            if (value.startsWith('$'))
                return parseFloat(value.slice(1).replace(',', ''));
            return parseFloat(value);
        }
        return value;
    }
    // If this is JSON, we should stringify the value because the `pg` module
    // gives it to us as an object.
    if (type === interface_1.jsonType)
        return JSON.stringify(value);
    // If the type is an object type, convert the JavaScript object value into a
    // map. If the value is null or not an object, an error will be thrown.
    if (type instanceof interface_1.ObjectType) {
        if (value == null)
            throw new Error('Postgres value of object type may not be nullish.');
        if (typeof value !== 'object')
            throw new Error(`Postgres value of object type must be an object, not '${typeof value}'.`);
        return new Map(Array.from(type.fields).map(([fieldName, field]) => [fieldName, transformPgValueIntoValue(field.type, value[fieldName])]));
    }
    // Throw an error if the type still hasn’t been handled.
    throw new Error(`Type '${type.toString()}' is not a valid type for converting Postgres values into interface values.`);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transformPgValueIntoValue;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtUGdWYWx1ZUludG9WYWx1ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wb3N0Z3Jlcy9pbnZlbnRvcnkvdHJhbnNmb3JtUGdWYWx1ZUludG9WYWx1ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsNEJBWU8saUJBTVAsQ0FBQyxDQU51QjtBQUV4Qjs7O0dBR0c7QUFDVSxtQ0FBMkIsR0FBRyxNQUFNLEVBQUUsQ0FBQTtBQUVuRDs7OztHQUlHO0FBQ0gsc0NBQXNDO0FBQ3RDLG1DQUFtRCxJQUFpQixFQUFFLEtBQVk7SUFDaEYsNkVBQTZFO0lBQzdFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxtQ0FBMkIsQ0FBQyxDQUFDO1FBQ3BDLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUNBQTJCLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUVqRCwyRUFBMkU7SUFDM0UsNEJBQTRCO0lBQzVCLEVBQUUsQ0FBQyxDQUFDLElBQUksWUFBWSx3QkFBWSxDQUFDO1FBQy9CLE1BQU0sQ0FBQyxLQUFLLElBQUksSUFBSSxHQUFHLEtBQUssR0FBRyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFBO0lBRW5GLDBFQUEwRTtJQUMxRSxTQUFTO0lBQ1QsRUFBRSxDQUFDLENBQUMsSUFBSSxZQUFZLG9CQUFRLENBQUMsQ0FBQyxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN4QixNQUFNLElBQUksS0FBSyxDQUFDLDhDQUE4QyxDQUFDLENBQUE7UUFFakUsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLHlCQUF5QixDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQTtJQUMxRSxDQUFDO0lBRUQsMEVBQTBFO0lBQzFFLFFBQVE7SUFDUixFQUFFLENBQUMsQ0FBQyxJQUFJLFlBQVkscUJBQVMsQ0FBQztRQUM1QixNQUFNLENBQUMseUJBQXlCLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQTtJQUV4RCx3RUFBd0U7SUFDeEUscURBQXFEO0lBQ3JELEVBQUUsQ0FBQyxDQUNELElBQUksWUFBWSxvQkFBUTtRQUN4QixJQUFJLEtBQUssdUJBQVc7UUFDcEIsSUFBSSxLQUFLLHNCQUNYLENBQUM7UUFDQyxNQUFNLENBQUMsS0FBSyxDQUFBO0lBRWQsNEVBQTRFO0lBQzVFLGlEQUFpRDtJQUNqRCxFQUFFLENBQUMsQ0FDRCxJQUFJLEtBQUssdUJBQVc7UUFDcEIsSUFBSSxLQUFLLHFCQUNYLENBQUMsQ0FBQyxDQUFDO1FBQ0Qsa0RBQWtEO1FBQ2xELEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDOUIsb0VBQW9FO1lBQ3BFLG9CQUFvQjtZQUNwQixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUN4QixNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFBO1lBRXBELE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDMUIsQ0FBQztRQUVELE1BQU0sQ0FBQyxLQUFLLENBQUE7SUFDZCxDQUFDO0lBRUQseUVBQXlFO0lBQ3pFLCtCQUErQjtJQUMvQixFQUFFLENBQUMsQ0FBQyxJQUFJLEtBQUssb0JBQVEsQ0FBQztRQUNwQixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUU5Qiw0RUFBNEU7SUFDNUUsdUVBQXVFO0lBQ3ZFLEVBQUUsQ0FBQyxDQUFDLElBQUksWUFBWSxzQkFBVSxDQUFDLENBQUMsQ0FBQztRQUMvQixFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDO1lBQ2hCLE1BQU0sSUFBSSxLQUFLLENBQUMsbURBQW1ELENBQUMsQ0FBQTtRQUV0RSxFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssS0FBSyxRQUFRLENBQUM7WUFDNUIsTUFBTSxJQUFJLEtBQUssQ0FBQyx5REFBeUQsT0FBTyxLQUFLLElBQUksQ0FBQyxDQUFBO1FBRTVGLE1BQU0sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQWtCLENBQUMsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUseUJBQXlCLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUM1SixDQUFDO0lBRUQsd0RBQXdEO0lBQ3hELE1BQU0sSUFBSSxLQUFLLENBQUMsU0FBUyxJQUFJLENBQUMsUUFBUSxFQUFFLDZFQUE2RSxDQUFDLENBQUE7QUFDeEgsQ0FBQztBQXZFRDsyQ0F1RUMsQ0FBQSJ9