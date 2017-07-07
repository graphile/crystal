// TODO: test
// TODO: Better module name?
"use strict";
var parsePgInterval = require("postgres-interval");
var utils_1 = require("../../../utils");
var pgFloatType_1 = require("../scalar/pgFloatType");
var pgIntegerType_1 = require("../scalar/pgIntegerType");
var PgNullableType_1 = require("../PgNullableType");
var intervalUnits = ['seconds', 'minutes', 'hours', 'days', 'months', 'years'];
/**
 * The interval type represents a Postgres time interval which will have one of
 * a few different fields.
 */
var pgIntervalType = {
    kind: 'OBJECT',
    name: 'interval',
    description: 'An interval of time that has passed where the smallest distinct unit is a second.',
    fields: new Map([
        // All values in an interval are integers, except the value for seconds
        // which can store a fractional. Basically fractions will ”overflow” from
        // the integers all the way down to `seconds`.
        ['seconds', {
                description: 'A quantity of seconds. This is the only non-integer field, as all the other fields will dump their overflow into a smaller unit of time. Intervals don’t have a smaller unit than seconds.',
                type: new PgNullableType_1.default(pgFloatType_1.default),
                getValue: function (interval) { return interval.seconds; },
            }],
        ['minutes', {
                description: 'A quantity of minutes.',
                type: new PgNullableType_1.default(pgIntegerType_1.default),
                getValue: function (interval) { return interval.minutes; },
            }],
        ['hours', {
                description: 'A quantity of hours.',
                type: new PgNullableType_1.default(pgIntegerType_1.default),
                getValue: function (interval) { return interval.hours; },
            }],
        ['days', {
                description: 'A quantity of days.',
                type: new PgNullableType_1.default(pgIntegerType_1.default),
                getValue: function (interval) { return interval.days; },
            }],
        ['months', {
                description: 'A quantity of months',
                type: new PgNullableType_1.default(pgIntegerType_1.default),
                getValue: function (interval) { return interval.months; },
            }],
        ['years', {
                description: 'A quantity of years',
                type: new PgNullableType_1.default(pgIntegerType_1.default),
                getValue: function (interval) { return interval.years; },
            }],
    ]),
    isTypeOf: function (_value) {
        throw new Error('Unimplemented');
    },
    fromFields: function (fields) {
        var interval = {};
        intervalUnits.forEach(function (unit) { interval[unit] = fields.get(unit); });
        return interval;
    },
    // The `pg` module will parse this into an object with the correct keys, we
    // just need to put it into a map to be good.
    transformPgValueIntoValue: function (rawInterval) {
        return parsePgInterval(rawInterval);
    },
    // Take our map and turn it into a string representation of a Postgres
    // interval. Does this by adding each key (which we know is a valid interval
    // identifier) to a string with it’s associated value.
    transformValueIntoPgValue: function (interval) {
        return (_a = ["", ""], _a.raw = ["",
            ""], utils_1.sql.query(_a, utils_1.sql.value(intervalUnits
            .map(function (unit) { return ({ unit: unit, value: interval[unit] }); })
            .filter(function (_a) {
            var value = _a.value;
            return typeof value === 'number';
        })
            .map(function (_a) {
            var unit = _a.unit, value = _a.value;
            return value + " " + unit;
        })
            .join(' '))));
        var _a;
    },
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = pgIntervalType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGdJbnRlcnZhbFR5cGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvcG9zdGdyZXMvaW52ZW50b3J5L3R5cGUvY3VzdG9tL3BnSW50ZXJ2YWxUeXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGFBQWE7QUFDYiw0QkFBNEI7O0FBRTVCLG1EQUFxRDtBQUVyRCx3Q0FBb0M7QUFDcEMscURBQStDO0FBQy9DLHlEQUFtRDtBQUVuRCxvREFBOEM7QUFXOUMsSUFBTSxhQUFhLEdBQUcsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFBO0FBRWhGOzs7R0FHRztBQUNILElBQU0sY0FBYyxHQUFnRDtJQUNsRSxJQUFJLEVBQUUsUUFBUTtJQUNkLElBQUksRUFBRSxVQUFVO0lBQ2hCLFdBQVcsRUFBRSxtRkFBbUY7SUFFaEcsTUFBTSxFQUFFLElBQUksR0FBRyxDQUFDO1FBQ2QsdUVBQXVFO1FBQ3ZFLHlFQUF5RTtRQUN6RSw4Q0FBOEM7UUFDOUMsQ0FBQyxTQUFTLEVBQUU7Z0JBQ1YsV0FBVyxFQUFFLDRMQUE0TDtnQkFDek0sSUFBSSxFQUFFLElBQUksd0JBQWMsQ0FBQyxxQkFBVyxDQUFDO2dCQUNyQyxRQUFRLEVBQUUsVUFBQyxRQUFvQixJQUFLLE9BQUEsUUFBUSxDQUFDLE9BQU8sRUFBaEIsQ0FBZ0I7YUFDckQsQ0FBQztRQUNGLENBQUMsU0FBUyxFQUFFO2dCQUNWLFdBQVcsRUFBRSx3QkFBd0I7Z0JBQ3JDLElBQUksRUFBRSxJQUFJLHdCQUFjLENBQUMsdUJBQWEsQ0FBQztnQkFDdkMsUUFBUSxFQUFFLFVBQUMsUUFBb0IsSUFBSyxPQUFBLFFBQVEsQ0FBQyxPQUFPLEVBQWhCLENBQWdCO2FBQ3JELENBQUM7UUFDRixDQUFDLE9BQU8sRUFBRTtnQkFDUixXQUFXLEVBQUUsc0JBQXNCO2dCQUNuQyxJQUFJLEVBQUUsSUFBSSx3QkFBYyxDQUFDLHVCQUFhLENBQUM7Z0JBQ3ZDLFFBQVEsRUFBRSxVQUFDLFFBQW9CLElBQUssT0FBQSxRQUFRLENBQUMsS0FBSyxFQUFkLENBQWM7YUFDbkQsQ0FBQztRQUNGLENBQUMsTUFBTSxFQUFFO2dCQUNQLFdBQVcsRUFBRSxxQkFBcUI7Z0JBQ2xDLElBQUksRUFBRSxJQUFJLHdCQUFjLENBQUMsdUJBQWEsQ0FBQztnQkFDdkMsUUFBUSxFQUFFLFVBQUMsUUFBb0IsSUFBSyxPQUFBLFFBQVEsQ0FBQyxJQUFJLEVBQWIsQ0FBYTthQUNsRCxDQUFDO1FBQ0YsQ0FBQyxRQUFRLEVBQUU7Z0JBQ1QsV0FBVyxFQUFFLHNCQUFzQjtnQkFDbkMsSUFBSSxFQUFFLElBQUksd0JBQWMsQ0FBQyx1QkFBYSxDQUFDO2dCQUN2QyxRQUFRLEVBQUUsVUFBQyxRQUFvQixJQUFLLE9BQUEsUUFBUSxDQUFDLE1BQU0sRUFBZixDQUFlO2FBQ3BELENBQUM7UUFDRixDQUFDLE9BQU8sRUFBRTtnQkFDUixXQUFXLEVBQUUscUJBQXFCO2dCQUNsQyxJQUFJLEVBQUUsSUFBSSx3QkFBYyxDQUFDLHVCQUFhLENBQUM7Z0JBQ3ZDLFFBQVEsRUFBRSxVQUFDLFFBQW9CLElBQUssT0FBQSxRQUFRLENBQUMsS0FBSyxFQUFkLENBQWM7YUFDbkQsQ0FBQztLQUNILENBQUM7SUFFRixRQUFRLEVBQUUsVUFBQyxNQUFhO1FBQ3RCLE1BQU0sSUFBSSxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUE7SUFDbEMsQ0FBQztJQUVELFVBQVUsRUFBRSxVQUFBLE1BQU07UUFDaEIsSUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFBO1FBQ25CLGFBQWEsQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJLElBQU0sUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNwRSxNQUFNLENBQUMsUUFBUSxDQUFBO0lBQ2pCLENBQUM7SUFFRCwyRUFBMkU7SUFDM0UsNkNBQTZDO0lBQzdDLHlCQUF5QixFQUFFLFVBQUMsV0FBbUI7UUFDN0MsT0FBQSxlQUFlLENBQUMsV0FBVyxDQUFDO0lBQTVCLENBQTRCO0lBRTlCLHNFQUFzRTtJQUN0RSw0RUFBNEU7SUFDNUUsc0RBQXNEO0lBQ3RELHlCQUF5QixFQUFFLFVBQUMsUUFBb0I7UUFDOUMsaUNBQVMsRUFBRztZQU1YLEVBQUUsR0FOSCxXQUFHLENBQUMsS0FBSyxLQUFHLFdBQUcsQ0FBQyxLQUFLLENBQ25CLGFBQWE7YUFDVixHQUFHLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxDQUFDLEVBQUUsSUFBSSxNQUFBLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQWpDLENBQWlDLENBQUM7YUFDOUMsTUFBTSxDQUFDLFVBQUMsRUFBUztnQkFBUCxnQkFBSztZQUFPLE9BQUEsT0FBTyxLQUFLLEtBQUssUUFBUTtRQUF6QixDQUF5QixDQUFDO2FBQ2hELEdBQUcsQ0FBQyxVQUFDLEVBQWU7Z0JBQWIsY0FBSSxFQUFFLGdCQUFLO1lBQU8sT0FBRyxLQUFLLFNBQUksSUFBTTtRQUFsQixDQUFrQixDQUFDO2FBQzVDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FDYjs7SUFORCxDQU1HO0NBQ04sQ0FBQTs7QUFFRCxrQkFBZSxjQUFjLENBQUEifQ==