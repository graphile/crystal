"use strict";
const interface_1 = require('../../interface');
const utils_1 = require('../utils');
const PgClassObjectType_1 = require('./type/PgClassObjectType');
exports.$$transformValueIntoPgValue = Symbol();
/**
 * Transforms a value into a Postgres value (Sql) using some extra type
 * information.
 */
// TODO: test
function transformValueIntoPgValue(type, value) {
    // If the type has defined a custom transformer, use it.
    if (type[exports.$$transformValueIntoPgValue])
        return type[exports.$$transformValueIntoPgValue](value);
    // If this is a nullable type, just return the null literal if our value is
    // null, if our value is non-null use the non-null type to transform.
    if (type instanceof interface_1.NullableType)
        return value == null ? utils_1.sql.query `null` : transformValueIntoPgValue(type.nonNullType, value);
    // If this is a list type, create an array giving all of the items the
    // appropriate transforms.
    if (type instanceof interface_1.ListType) {
        if (!Array.isArray(value))
            throw new Error('Value of a list type must be an array.');
        return utils_1.sql.query `array[${utils_1.sql.join(value.map(item => transformValueIntoPgValue(type.itemType, item)), ', ')}]`;
    }
    // If this is an alias type, just transform the base type.
    if (type instanceof interface_1.AliasType)
        return transformValueIntoPgValue(type.baseType, value);
    // For some simple values, just return the value directly as a placeholder
    // and let Postgres coercion do the rest.
    if (type instanceof interface_1.EnumType ||
        type === interface_1.booleanType ||
        type === interface_1.stringType ||
        type === interface_1.jsonType)
        return utils_1.sql.query `${utils_1.sql.value(value)}`;
    // If this is an integer or a float, return the value but also mark the type
    // as a number by adding `+ 0`. This way Postgres will not accidently
    // interpret the value as a string. This is very important for procedures
    // as if Postgres thinks you are trying to call a function with text and not
    // a number. Errors will happen.
    // TODO: This only happens in the one test case where we have an array of
    // numbers as a procedure argument. Maybe we can only use this trick in that
    // case?
    if (type === interface_1.integerType ||
        type === interface_1.floatType)
        return utils_1.sql.query `(${utils_1.sql.value(value)} + 0)`;
    // If this is a Postgres object type, let’s do some special tuple stuff.
    if (type instanceof PgClassObjectType_1.default) {
        // Check that we have a value of the correct type.
        if (!type.isTypeOf(value))
            throw new Error('Value is not of the correct type.');
        // We can depend on fields being in the correct tuple order for
        // `PgObjectType`, so we just build a tuple using our fields.
        return utils_1.sql.query `(${utils_1.sql.join(Array.from(type.fields).map(([fieldName, field]) => transformValueIntoPgValue(field.type, value.get(fieldName))), ', ')})::${utils_1.sql.identifier(type.pgType.namespaceName, type.pgType.name)}`;
    }
    // If this a normal object type, throw an error. Ain’t nobody got time for
    // dat!
    if (type instanceof interface_1.ObjectType)
        throw new Error('All Postgres object types going into the database should be `PgClassObjectType`.');
    // If we don’t recognize the type, throw an error.
    throw new Error(`Type '${type.toString()}' is not a recognized type for transforming values into Sql.`);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transformValueIntoPgValue;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtVmFsdWVJbnRvUGdWYWx1ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wb3N0Z3Jlcy9pbnZlbnRvcnkvdHJhbnNmb3JtVmFsdWVJbnRvUGdWYWx1ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsNEJBWU8saUJBQ1AsQ0FBQyxDQUR1QjtBQUN4Qix3QkFBb0IsVUFDcEIsQ0FBQyxDQUQ2QjtBQUM5QixvQ0FBOEIsMEJBRTlCLENBQUMsQ0FGdUQ7QUFFM0MsbUNBQTJCLEdBQUcsTUFBTSxFQUFFLENBQUE7QUFFbkQ7OztHQUdHO0FBQ0gsYUFBYTtBQUNiLG1DQUFtRCxJQUFpQixFQUFFLEtBQVk7SUFDaEYsd0RBQXdEO0lBQ3hELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxtQ0FBMkIsQ0FBQyxDQUFDO1FBQ3BDLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUNBQTJCLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUVqRCwyRUFBMkU7SUFDM0UscUVBQXFFO0lBQ3JFLEVBQUUsQ0FBQyxDQUFDLElBQUksWUFBWSx3QkFBWSxDQUFDO1FBQy9CLE1BQU0sQ0FBQyxLQUFLLElBQUksSUFBSSxHQUFHLFdBQUcsQ0FBQyxLQUFLLENBQUEsTUFBTSxHQUFHLHlCQUF5QixDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUE7SUFFN0Ysc0VBQXNFO0lBQ3RFLDBCQUEwQjtJQUMxQixFQUFFLENBQUMsQ0FBQyxJQUFJLFlBQVksb0JBQVEsQ0FBQyxDQUFDLENBQUM7UUFDN0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3hCLE1BQU0sSUFBSSxLQUFLLENBQUMsd0NBQXdDLENBQUMsQ0FBQTtRQUUzRCxNQUFNLENBQUMsV0FBRyxDQUFDLEtBQUssQ0FBQSxTQUFTLFdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUkseUJBQXlCLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUE7SUFDL0csQ0FBQztJQUVELDBEQUEwRDtJQUMxRCxFQUFFLENBQUMsQ0FBQyxJQUFJLFlBQVkscUJBQVMsQ0FBQztRQUM1QixNQUFNLENBQUMseUJBQXlCLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQTtJQUV4RCwwRUFBMEU7SUFDMUUseUNBQXlDO0lBQ3pDLEVBQUUsQ0FBQyxDQUNELElBQUksWUFBWSxvQkFBUTtRQUN4QixJQUFJLEtBQUssdUJBQVc7UUFDcEIsSUFBSSxLQUFLLHNCQUFVO1FBQ25CLElBQUksS0FBSyxvQkFDWCxDQUFDO1FBQ0MsTUFBTSxDQUFDLFdBQUcsQ0FBQyxLQUFLLENBQUEsR0FBRyxXQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUE7SUFFdkMsNEVBQTRFO0lBQzVFLHFFQUFxRTtJQUNyRSx5RUFBeUU7SUFDekUsNEVBQTRFO0lBQzVFLGdDQUFnQztJQUNoQyx5RUFBeUU7SUFDekUsNEVBQTRFO0lBQzVFLFFBQVE7SUFDUixFQUFFLENBQUMsQ0FDRCxJQUFJLEtBQUssdUJBQVc7UUFDcEIsSUFBSSxLQUFLLHFCQUNYLENBQUM7UUFDQyxNQUFNLENBQUMsV0FBRyxDQUFDLEtBQUssQ0FBQSxJQUFJLFdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQTtJQUU3Qyx3RUFBd0U7SUFDeEUsRUFBRSxDQUFDLENBQUMsSUFBSSxZQUFZLDJCQUFpQixDQUFDLENBQUMsQ0FBQztRQUN0QyxrREFBa0Q7UUFDbEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3hCLE1BQU0sSUFBSSxLQUFLLENBQUMsbUNBQW1DLENBQUMsQ0FBQTtRQUV0RCwrREFBK0Q7UUFDL0QsNkRBQTZEO1FBQzdELE1BQU0sQ0FBQyxXQUFHLENBQUMsS0FBSyxDQUFBLElBQUksV0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsS0FDMUUseUJBQXlCLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQzVELEVBQUUsSUFBSSxDQUFDLE1BQU0sV0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUE7SUFDN0UsQ0FBQztJQUVELDBFQUEwRTtJQUMxRSxPQUFPO0lBQ1AsRUFBRSxDQUFDLENBQUMsSUFBSSxZQUFZLHNCQUFVLENBQUM7UUFDN0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxrRkFBa0YsQ0FBQyxDQUFBO0lBRXJHLGtEQUFrRDtJQUNsRCxNQUFNLElBQUksS0FBSyxDQUFDLFNBQVMsSUFBSSxDQUFDLFFBQVEsRUFBRSw4REFBOEQsQ0FBQyxDQUFBO0FBQ3pHLENBQUM7QUFuRUQ7MkNBbUVDLENBQUEifQ==