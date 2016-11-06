"use strict";
const NullableType_1 = require('../NullableType');
test('nonNullType will return the base type', () => {
    const baseType = Symbol('baseType');
    const nullableType = new NullableType_1.default(baseType);
    expect(nullableType.nonNullType).toBe(baseType);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTnVsbGFibGVUeXBlLXRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvaW50ZXJmYWNlL3R5cGUvX190ZXN0c19fL051bGxhYmxlVHlwZS10ZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwrQkFBeUIsaUJBRXpCLENBQUMsQ0FGeUM7QUFFMUMsSUFBSSxDQUFDLHVDQUF1QyxFQUFFO0lBQzVDLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQTtJQUNuQyxNQUFNLFlBQVksR0FBRyxJQUFJLHNCQUFZLENBQUMsUUFBUSxDQUFDLENBQUE7SUFDL0MsTUFBTSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDakQsQ0FBQyxDQUFDLENBQUEifQ==