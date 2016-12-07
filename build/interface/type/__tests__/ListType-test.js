"use strict";
const ListType_1 = require('../ListType');
test('itemType will return the item type', () => {
    const itemType = Symbol('itemType');
    const listType = new ListType_1.default(itemType);
    expect(listType.itemType).toBe(itemType);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGlzdFR5cGUtdGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9pbnRlcmZhY2UvdHlwZS9fX3Rlc3RzX18vTGlzdFR5cGUtdGVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMkJBQXFCLGFBRXJCLENBQUMsQ0FGaUM7QUFFbEMsSUFBSSxDQUFDLG9DQUFvQyxFQUFFO0lBQ3pDLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQTtJQUNuQyxNQUFNLFFBQVEsR0FBRyxJQUFJLGtCQUFRLENBQUMsUUFBUSxDQUFDLENBQUE7SUFDdkMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDMUMsQ0FBQyxDQUFDLENBQUEifQ==