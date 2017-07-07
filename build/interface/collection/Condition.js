"use strict";
// TODO: rename
// TODO: seperate into own file?
var conditionHelpers;
(function (conditionHelpers) {
    /**
     * Does some logic and creates an `AndCondition`. Simplifies constants and
     * more.
     */
    function and() {
        var conditions = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            conditions[_i] = arguments[_i];
        }
        // If there are no conditions, throw an error.
        if (conditions.length === 0)
            throw new Error('Cannot have 0 conditions, must have at least 1.');
        var andConditions = [];
        // For each condition, do some stuff…
        for (var _a = 0, conditions_1 = conditions; _a < conditions_1.length; _a++) {
            var condition = conditions_1[_a];
            // If one condition is false, the entire thing is false.
            if (condition === false)
                return false;
            else if (condition !== true)
                andConditions.push(condition);
        }
        // If there are no conditions in `andConditions` (because we filtered out
        // all the trues), just return true. If there is just one condition in
        // `andConditions` return that one condition. Otherwise, return an “and”
        // condition.
        return andConditions.length === 0 ? true : andConditions.length === 1 ? andConditions[0] : { type: 'AND', conditions: andConditions };
    }
    conditionHelpers.and = and;
    /**
     * Creates a condition that tests for the equality of a field with any given
     * value. A shortcut for creating a `FieldCondition` condition with an
     * `EqualCondition`.
     */
    // TODO: test
    function fieldEquals(name, value) {
        return { type: 'FIELD', name: name, condition: { type: 'EQUAL', value: value } };
    }
    conditionHelpers.fieldEquals = fieldEquals;
})(conditionHelpers = exports.conditionHelpers || (exports.conditionHelpers = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29uZGl0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2ludGVyZmFjZS9jb2xsZWN0aW9uL0NvbmRpdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBK0JBLGVBQWU7QUFDZixnQ0FBZ0M7QUFDaEMsSUFBaUIsZ0JBQWdCLENBcUNoQztBQXJDRCxXQUFpQixnQkFBZ0I7SUFDL0I7OztPQUdHO0lBQ0g7UUFBcUIsb0JBQStCO2FBQS9CLFVBQStCLEVBQS9CLHFCQUErQixFQUEvQixJQUErQjtZQUEvQiwrQkFBK0I7O1FBQ2xELDhDQUE4QztRQUM5QyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztZQUMxQixNQUFNLElBQUksS0FBSyxDQUFDLGlEQUFpRCxDQUFDLENBQUE7UUFFcEUsSUFBTSxhQUFhLEdBQXFCLEVBQUUsQ0FBQTtRQUUxQyxxQ0FBcUM7UUFDckMsR0FBRyxDQUFDLENBQW9CLFVBQVUsRUFBVix5QkFBVSxFQUFWLHdCQUFVLEVBQVYsSUFBVTtZQUE3QixJQUFNLFNBQVMsbUJBQUE7WUFDbEIsd0RBQXdEO1lBQ3hELEVBQUUsQ0FBQyxDQUFDLFNBQVMsS0FBSyxLQUFLLENBQUM7Z0JBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQTtZQUdyQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBUyxLQUFLLElBQUksQ0FBQztnQkFBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1NBQzNEO1FBRUQseUVBQXlFO1FBQ3pFLHNFQUFzRTtRQUN0RSx3RUFBd0U7UUFDeEUsYUFBYTtRQUNiLE1BQU0sQ0FBQyxhQUFhLENBQUMsTUFBTSxLQUFLLENBQUMsR0FBRyxJQUFJLEdBQUcsYUFBYSxDQUFDLE1BQU0sS0FBSyxDQUFDLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsYUFBYSxFQUFFLENBQUE7SUFDdkksQ0FBQztJQXJCZSxvQkFBRyxNQXFCbEIsQ0FBQTtJQUVEOzs7O09BSUc7SUFDSCxhQUFhO0lBQ2IscUJBQTZCLElBQVksRUFBRSxLQUFZO1FBQ3JELE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxNQUFBLEVBQUUsU0FBUyxFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLE9BQUEsRUFBRSxFQUFFLENBQUE7SUFDckUsQ0FBQztJQUZlLDRCQUFXLGNBRTFCLENBQUE7QUFDSCxDQUFDLEVBckNnQixnQkFBZ0IsR0FBaEIsd0JBQWdCLEtBQWhCLHdCQUFnQixRQXFDaEMifQ==