"use strict";
// TODO: rename
// TODO: seperate into own file?
var conditionHelpers;
(function (conditionHelpers) {
    /**
     * Does some logic and creates an `AndCondition`. Simplifies constants and
     * more.
     */
    function and(...conditions) {
        // If there are no conditions, throw an error.
        if (conditions.length === 0)
            throw new Error('Cannot have 0 conditions, must have at least 1.');
        const andConditions = [];
        // For each condition, do some stuff…
        for (const condition of conditions) {
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
        return { type: 'FIELD', name, condition: { type: 'EQUAL', value } };
    }
    conditionHelpers.fieldEquals = fieldEquals;
})(conditionHelpers = exports.conditionHelpers || (exports.conditionHelpers = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29uZGl0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2ludGVyZmFjZS9jb2xsZWN0aW9uL0NvbmRpdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBK0JBLGVBQWU7QUFDZixnQ0FBZ0M7QUFDaEMsSUFBaUIsZ0JBQWdCLENBcUNoQztBQXJDRCxXQUFpQixnQkFBZ0IsRUFBQyxDQUFDO0lBQ2pDOzs7T0FHRztJQUNILGFBQXFCLEdBQUcsVUFBNEI7UUFDbEQsOENBQThDO1FBQzlDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO1lBQzFCLE1BQU0sSUFBSSxLQUFLLENBQUMsaURBQWlELENBQUMsQ0FBQTtRQUVwRSxNQUFNLGFBQWEsR0FBcUIsRUFBRSxDQUFBO1FBRTFDLHFDQUFxQztRQUNyQyxHQUFHLENBQUMsQ0FBQyxNQUFNLFNBQVMsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ25DLHdEQUF3RDtZQUN4RCxFQUFFLENBQUMsQ0FBQyxTQUFTLEtBQUssS0FBSyxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUE7WUFHckMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsS0FBSyxJQUFJLENBQUM7Z0JBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUM1RCxDQUFDO1FBRUQseUVBQXlFO1FBQ3pFLHNFQUFzRTtRQUN0RSx3RUFBd0U7UUFDeEUsYUFBYTtRQUNiLE1BQU0sQ0FBQyxhQUFhLENBQUMsTUFBTSxLQUFLLENBQUMsR0FBRyxJQUFJLEdBQUcsYUFBYSxDQUFDLE1BQU0sS0FBSyxDQUFDLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsYUFBYSxFQUFFLENBQUE7SUFDdkksQ0FBQztJQXJCZSxvQkFBRyxNQXFCbEIsQ0FBQTtJQUVEOzs7O09BSUc7SUFDSCxhQUFhO0lBQ2IscUJBQTZCLElBQVksRUFBRSxLQUFZO1FBQ3JELE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQTtJQUNyRSxDQUFDO0lBRmUsNEJBQVcsY0FFMUIsQ0FBQTtBQUNILENBQUMsRUFyQ2dCLGdCQUFnQixHQUFoQix3QkFBZ0IsS0FBaEIsd0JBQWdCLFFBcUNoQyJ9