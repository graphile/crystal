"use strict";
const utils_1 = require('../utils');
/**
 * Converts a `Condition` object into a Sql query.
 */
function conditionToSql(condition, path = [], convertRowIdToId) {
    if (typeof condition === 'boolean')
        return condition ? utils_1.sql.query `true` : utils_1.sql.query `false`;
    switch (condition.type) {
        case 'NOT':
            return utils_1.sql.query `not(${conditionToSql(condition.condition, path, convertRowIdToId)})`;
        case 'AND':
            return utils_1.sql.query `(${utils_1.sql.join(condition.conditions.map(c => conditionToSql(c, path, convertRowIdToId)), ' and ')})`;
        case 'OR':
            return utils_1.sql.query `(${utils_1.sql.join(condition.conditions.map(c => conditionToSql(c, path, convertRowIdToId)), ' or ')})`;
        case 'FIELD':
            // TODO: This is a hack fix. Do a proper fix asap!
            return conditionToSql(condition.condition, path.concat([convertRowIdToId && condition.name === 'row_id' ? 'id' : condition.name]), false);
        case 'EQUAL':
            return utils_1.sql.query `(${utils_1.sql.identifier(...path)} = ${utils_1.sql.value(condition.value)})`;
        case 'LESS_THAN':
            return utils_1.sql.query `(${utils_1.sql.identifier(...path)} < ${utils_1.sql.value(condition.value)})`;
        case 'GREATER_THAN':
            return utils_1.sql.query `(${utils_1.sql.identifier(...path)} > ${utils_1.sql.value(condition.value)})`;
        case 'REGEXP':
            return utils_1.sql.query `regexp_matches(${utils_1.sql.identifier(...path)}, ${utils_1.sql.value(condition.regexp.source)}, ${utils_1.sql.value(condition.regexp.flags)})`;
        default:
            throw new Error(`Condition of type '${condition['type']}' is not recognized.`);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = conditionToSql;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZGl0aW9uVG9TcWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcG9zdGdyZXMvaW52ZW50b3J5L2NvbmRpdGlvblRvU3FsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSx3QkFBb0IsVUFLcEIsQ0FBQyxDQUw2QjtBQUU5Qjs7R0FFRztBQUNILHdCQUF3QyxTQUFvQixFQUFFLElBQUksR0FBa0IsRUFBRSxFQUFFLGdCQUEwQjtJQUNoSCxFQUFFLENBQUMsQ0FBQyxPQUFPLFNBQVMsS0FBSyxTQUFTLENBQUM7UUFDakMsTUFBTSxDQUFDLFNBQVMsR0FBRyxXQUFHLENBQUMsS0FBSyxDQUFBLE1BQU0sR0FBRyxXQUFHLENBQUMsS0FBSyxDQUFBLE9BQU8sQ0FBQTtJQUV2RCxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUN2QixLQUFLLEtBQUs7WUFDUixNQUFNLENBQUMsV0FBRyxDQUFDLEtBQUssQ0FBQSxPQUFPLGNBQWMsQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxnQkFBZ0IsQ0FBQyxHQUFHLENBQUE7UUFDdkYsS0FBSyxLQUFLO1lBQ1IsTUFBTSxDQUFDLFdBQUcsQ0FBQyxLQUFLLENBQUEsSUFBSSxXQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxjQUFjLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQTtRQUNwSCxLQUFLLElBQUk7WUFDUCxNQUFNLENBQUMsV0FBRyxDQUFDLEtBQUssQ0FBQSxJQUFJLFdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLGNBQWMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFBO1FBQ25ILEtBQUssT0FBTztZQUNWLGtEQUFrRDtZQUNsRCxNQUFNLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLGdCQUFnQixJQUFJLFNBQVMsQ0FBQyxJQUFJLEtBQUssUUFBUSxHQUFHLElBQUksR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUMzSSxLQUFLLE9BQU87WUFDVixNQUFNLENBQUMsV0FBRyxDQUFDLEtBQUssQ0FBQSxJQUFJLFdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxXQUFHLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFBO1FBQ2hGLEtBQUssV0FBVztZQUNkLE1BQU0sQ0FBQyxXQUFHLENBQUMsS0FBSyxDQUFBLElBQUksV0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLFdBQUcsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUE7UUFDaEYsS0FBSyxjQUFjO1lBQ2pCLE1BQU0sQ0FBQyxXQUFHLENBQUMsS0FBSyxDQUFBLElBQUksV0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLFdBQUcsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUE7UUFDaEYsS0FBSyxRQUFRO1lBQ1gsTUFBTSxDQUFDLFdBQUcsQ0FBQyxLQUFLLENBQUEsa0JBQWtCLFdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxXQUFHLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssV0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUE7UUFDM0k7WUFDRSxNQUFNLElBQUksS0FBSyxDQUFDLHNCQUFzQixTQUFTLENBQUMsTUFBTSxDQUFDLHNCQUFzQixDQUFDLENBQUE7SUFDbEYsQ0FBQztBQUNILENBQUM7QUF6QkQ7Z0NBeUJDLENBQUEifQ==