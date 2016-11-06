// TODO: test
// TODO: Better module name?
"use strict";
const parsePgInterval = require('postgres-interval');
const interface_1 = require('../../../../interface');
const utils_1 = require('../../../utils');
const transformPgValueIntoValue_1 = require('../../transformPgValueIntoValue');
const transformValueIntoPgValue_1 = require('../../transformValueIntoPgValue');
/**
 * The interval type represents a Postgres time interval which will have one of
 * a few different fields.
 */
const pgIntervalType = Object.assign(new interface_1.ObjectType({
    name: 'interval',
    description: 'An interval of time that has passed where the smallest distinct unit is a second.',
    fields: new Map([
        // All values in an interval are integers, except the value for seconds
        // which can store a fractional. Basically fractions will ”overflow” from
        // the integers all the way down to `seconds`.
        ['seconds', {
                description: 'A quantity of seconds. This is the only non-integer field, as all the other fields will dump their overflow into a smaller unit of time. Intervals don’t have a smaller unit than seconds.',
                type: new interface_1.NullableType(interface_1.floatType),
            }],
        ['minutes', {
                description: 'A quantity of minutes.',
                type: new interface_1.NullableType(interface_1.integerType),
            }],
        ['hours', {
                description: 'A quantity of hours.',
                type: new interface_1.NullableType(interface_1.integerType),
            }],
        ['days', {
                description: 'A quantity of days.',
                type: new interface_1.NullableType(interface_1.integerType),
            }],
        ['months', {
                description: 'A quantity of months',
                type: new interface_1.NullableType(interface_1.integerType),
            }],
        ['years', {
                description: 'A quantity of years',
                type: new interface_1.NullableType(interface_1.integerType),
            }],
    ]),
}), {
    // The `pg` module will parse this into an object with the correct keys, we
    // just need to put it into a map to be good.
    [transformPgValueIntoValue_1.$$transformPgValueIntoValue]: (rawInterval) => {
        const interval = parsePgInterval(rawInterval);
        return new Map([
            ['seconds', interval.seconds],
            ['minutes', interval.minutes],
            ['hours', interval.hours],
            ['days', interval.days],
            ['months', interval.months],
            ['years', interval.years],
        ]);
    },
    // Take our map and turn it into a string representation of a Postgres
    // interval. Does this by adding each key (which we know is a valid interval
    // identifier) to a string with it’s associated value.
    [transformValueIntoPgValue_1.$$transformValueIntoPgValue]: (value) => utils_1.sql.query `${utils_1.sql.value(Array.from(value).reduce((interval, [key, num]) => `${interval} ${num} ${key}`, ''))}`,
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = pgIntervalType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGdJbnRlcnZhbFR5cGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvcG9zdGdyZXMvaW52ZW50b3J5L3R5cGUvaW5kaXZpZHVhbC9wZ0ludGVydmFsVHlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxhQUFhO0FBQ2IsNEJBQTRCOztBQUU1QixNQUFPLGVBQWUsV0FBVyxtQkFBbUIsQ0FBQyxDQUFBO0FBQ3JELDRCQUFpRSx1QkFDakUsQ0FBQyxDQUR1RjtBQUN4Rix3QkFBb0IsZ0JBQ3BCLENBQUMsQ0FEbUM7QUFDcEMsNENBQTRDLGlDQUM1QyxDQUFDLENBRDRFO0FBQzdFLDRDQUE0QyxpQ0FNNUMsQ0FBQyxDQU40RTtBQUU3RTs7O0dBR0c7QUFDSCxNQUFNLGNBQWMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksc0JBQVUsQ0FBQztJQUNsRCxJQUFJLEVBQUUsVUFBVTtJQUNoQixXQUFXLEVBQUUsbUZBQW1GO0lBQ2hHLE1BQU0sRUFBRSxJQUFJLEdBQUcsQ0FBQztRQUNkLHVFQUF1RTtRQUN2RSx5RUFBeUU7UUFDekUsOENBQThDO1FBQzlDLENBQUMsU0FBUyxFQUFFO2dCQUNWLFdBQVcsRUFBRSw0TEFBNEw7Z0JBQ3pNLElBQUksRUFBRSxJQUFJLHdCQUFZLENBQUMscUJBQVMsQ0FBQzthQUNsQyxDQUFDO1FBQ0YsQ0FBQyxTQUFTLEVBQUU7Z0JBQ1YsV0FBVyxFQUFFLHdCQUF3QjtnQkFDckMsSUFBSSxFQUFFLElBQUksd0JBQVksQ0FBQyx1QkFBVyxDQUFDO2FBQ3BDLENBQUM7UUFDRixDQUFDLE9BQU8sRUFBRTtnQkFDUixXQUFXLEVBQUUsc0JBQXNCO2dCQUNuQyxJQUFJLEVBQUUsSUFBSSx3QkFBWSxDQUFDLHVCQUFXLENBQUM7YUFDcEMsQ0FBQztRQUNGLENBQUMsTUFBTSxFQUFFO2dCQUNQLFdBQVcsRUFBRSxxQkFBcUI7Z0JBQ2xDLElBQUksRUFBRSxJQUFJLHdCQUFZLENBQUMsdUJBQVcsQ0FBQzthQUNwQyxDQUFDO1FBQ0YsQ0FBQyxRQUFRLEVBQUU7Z0JBQ1QsV0FBVyxFQUFFLHNCQUFzQjtnQkFDbkMsSUFBSSxFQUFFLElBQUksd0JBQVksQ0FBQyx1QkFBVyxDQUFDO2FBQ3BDLENBQUM7UUFDRixDQUFDLE9BQU8sRUFBRTtnQkFDUixXQUFXLEVBQUUscUJBQXFCO2dCQUNsQyxJQUFJLEVBQUUsSUFBSSx3QkFBWSxDQUFDLHVCQUFXLENBQUM7YUFDcEMsQ0FBQztLQUNILENBQUM7Q0FDSCxDQUFDLEVBQUU7SUFDRiwyRUFBMkU7SUFDM0UsNkNBQTZDO0lBQzdDLENBQUMsdURBQTJCLENBQUMsRUFBRSxDQUFDLFdBQW1CO1FBQ2pELE1BQU0sUUFBUSxHQUFHLGVBQWUsQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUM3QyxNQUFNLENBQUMsSUFBSSxHQUFHLENBQTZCO1lBQ3pDLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUM7WUFDN0IsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQztZQUM3QixDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDO1lBQ3pCLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUM7WUFDdkIsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQztZQUMzQixDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDO1NBQzFCLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFFRCxzRUFBc0U7SUFDdEUsNEVBQTRFO0lBQzVFLHNEQUFzRDtJQUN0RCxDQUFDLHVEQUEyQixDQUFDLEVBQUUsQ0FBQyxLQUF1QixLQUNyRCxXQUFHLENBQUMsS0FBSyxDQUFBLEdBQUcsV0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLFFBQVEsSUFBSSxHQUFHLElBQUksR0FBRyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRTtDQUMvRyxDQUFDLENBQUE7QUFFRjtrQkFBZSxjQUFjLENBQUEifQ==