"use strict";
var utils_1 = require("../utils");
/**
 * Converts a `Condition` object into a Sql query.
 */
function conditionToSql(condition, path, convertRowIdToId) {
    if (path === void 0) { path = []; }
    if (typeof condition === 'boolean')
        return condition ? (_a = ["true"], _a.raw = ["true"], utils_1.sql.query(_a)) : (_b = ["false"], _b.raw = ["false"], utils_1.sql.query(_b));
    switch (condition.type) {
        case 'NOT':
            return (_c = ["not(", ")"], _c.raw = ["not(", ")"], utils_1.sql.query(_c, conditionToSql(condition.condition, path, convertRowIdToId)));
        case 'AND':
            return (_d = ["(", ")"], _d.raw = ["(", ")"], utils_1.sql.query(_d, utils_1.sql.join(condition.conditions.map(function (c) { return conditionToSql(c, path, convertRowIdToId); }), ' and ')));
        case 'OR':
            return (_e = ["(", ")"], _e.raw = ["(", ")"], utils_1.sql.query(_e, utils_1.sql.join(condition.conditions.map(function (c) { return conditionToSql(c, path, convertRowIdToId); }), ' or ')));
        case 'FIELD':
            // TODO: This is a hack fix. Do a proper fix asap!
            return conditionToSql(condition.condition, path.concat([convertRowIdToId && condition.name === 'row_id' ? 'id' : condition.name]), false);
        case 'EQUAL':
            return (_f = ["(", " = ", ")"], _f.raw = ["(", " = ", ")"], utils_1.sql.query(_f, utils_1.sql.identifier.apply(utils_1.sql, path), utils_1.sql.value(condition.value)));
        case 'LESS_THAN':
            return (_g = ["(", " < ", ")"], _g.raw = ["(", " < ", ")"], utils_1.sql.query(_g, utils_1.sql.identifier.apply(utils_1.sql, path), utils_1.sql.value(condition.value)));
        case 'GREATER_THAN':
            return (_h = ["(", " > ", ")"], _h.raw = ["(", " > ", ")"], utils_1.sql.query(_h, utils_1.sql.identifier.apply(utils_1.sql, path), utils_1.sql.value(condition.value)));
        case 'REGEXP':
            // Parse out the regular expression. In Node.js v4 we can’t get the
            // `flags` property so we need to do it this way.
            var match = condition.regexp.toString().match(/^\/(.*)\/([gimuy]*)$/i);
            if (!match)
                throw new Error('Invalid regular expression.');
            var pattern = match[1], flags = match[2];
            return (_j = ["regexp_matches(", ", ", ", ", ")"], _j.raw = ["regexp_matches(", ", ", ", ", ")"], utils_1.sql.query(_j, utils_1.sql.identifier.apply(utils_1.sql, path), utils_1.sql.value(pattern), utils_1.sql.value(flags)));
        default:
            throw new Error("Condition of type '" + condition['type'] + "' is not recognized.");
    }
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = conditionToSql;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZGl0aW9uVG9TcWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcG9zdGdyZXMvaW52ZW50b3J5L2NvbmRpdGlvblRvU3FsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxrQ0FBOEI7QUFFOUI7O0dBRUc7QUFDSCx3QkFBd0MsU0FBb0IsRUFBRSxJQUF3QixFQUFFLGdCQUEwQjtJQUFwRCxxQkFBQSxFQUFBLFNBQXdCO0lBQ3BGLEVBQUUsQ0FBQyxDQUFDLE9BQU8sU0FBUyxLQUFLLFNBQVMsQ0FBQztRQUNqQyxNQUFNLENBQUMsU0FBUyw2QkFBWSxNQUFNLEdBQWYsV0FBRyxDQUFDLEtBQUssbUNBQWtCLE9BQU8sR0FBaEIsV0FBRyxDQUFDLEtBQUssS0FBTyxDQUFBO0lBRXZELE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLEtBQUssS0FBSztZQUNSLE1BQU0sZ0NBQVUsTUFBTyxFQUEyRCxHQUFHLEdBQTlFLFdBQUcsQ0FBQyxLQUFLLEtBQU8sY0FBYyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixDQUFDLEdBQUc7UUFDdkYsS0FBSyxLQUFLO1lBQ1IsTUFBTSw2QkFBVSxHQUFJLEVBQTJGLEdBQUcsR0FBM0csV0FBRyxDQUFDLEtBQUssS0FBSSxXQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsY0FBYyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLENBQUMsRUFBekMsQ0FBeUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxHQUFHO1FBQ3BILEtBQUssSUFBSTtZQUNQLE1BQU0sNkJBQVUsR0FBSSxFQUEwRixHQUFHLEdBQTFHLFdBQUcsQ0FBQyxLQUFLLEtBQUksV0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLGNBQWMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixDQUFDLEVBQXpDLENBQXlDLENBQUMsRUFBRSxNQUFNLENBQUMsR0FBRztRQUNuSCxLQUFLLE9BQU87WUFDVixrREFBa0Q7WUFDbEQsTUFBTSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxnQkFBZ0IsSUFBSSxTQUFTLENBQUMsSUFBSSxLQUFLLFFBQVEsR0FBRyxJQUFJLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUE7UUFDM0ksS0FBSyxPQUFPO1lBQ1YsTUFBTSxvQ0FBVSxHQUFJLEVBQXVCLEtBQU0sRUFBMEIsR0FBRyxHQUF2RSxXQUFHLENBQUMsS0FBSyxLQUFJLFdBQUcsQ0FBQyxVQUFVLE9BQWQsV0FBRyxFQUFlLElBQUksR0FBTyxXQUFHLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRztRQUNoRixLQUFLLFdBQVc7WUFDZCxNQUFNLG9DQUFVLEdBQUksRUFBdUIsS0FBTSxFQUEwQixHQUFHLEdBQXZFLFdBQUcsQ0FBQyxLQUFLLEtBQUksV0FBRyxDQUFDLFVBQVUsT0FBZCxXQUFHLEVBQWUsSUFBSSxHQUFPLFdBQUcsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHO1FBQ2hGLEtBQUssY0FBYztZQUNqQixNQUFNLG9DQUFVLEdBQUksRUFBdUIsS0FBTSxFQUEwQixHQUFHLEdBQXZFLFdBQUcsQ0FBQyxLQUFLLEtBQUksV0FBRyxDQUFDLFVBQVUsT0FBZCxXQUFHLEVBQWUsSUFBSSxHQUFPLFdBQUcsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHO1FBQ2hGLEtBQUssUUFBUTtZQUNYLG1FQUFtRTtZQUNuRSxpREFBaUQ7WUFDakQsSUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQTtZQUN4RSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztnQkFBQyxNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUE7WUFDakQsSUFBQSxrQkFBTyxFQUFFLGdCQUFLLENBQVM7WUFDaEMsTUFBTSx1REFBVSxpQkFBa0IsRUFBdUIsSUFBSyxFQUFrQixJQUFLLEVBQWdCLEdBQUcsR0FBakcsV0FBRyxDQUFDLEtBQUssS0FBa0IsV0FBRyxDQUFDLFVBQVUsT0FBZCxXQUFHLEVBQWUsSUFBSSxHQUFNLFdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUssV0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRztRQUMxRztZQUNFLE1BQU0sSUFBSSxLQUFLLENBQUMsd0JBQXNCLFNBQVMsQ0FBQyxNQUFNLENBQUMseUJBQXNCLENBQUMsQ0FBQTtJQUNsRixDQUFDOztBQUNILENBQUM7O0FBOUJELGlDQThCQyJ9