"use strict";
const NamedType_1 = require('../NamedType');
const AliasType_1 = require('../AliasType');
test('is a named type', () => {
    expect(new AliasType_1.default({}) instanceof NamedType_1.default).toBe(true);
});
test('baseType will return the base type', () => {
    const name = Symbol('name');
    const baseType = Symbol('baseType');
    const aliasType = new AliasType_1.default({ name, baseType });
    expect(aliasType.baseType).toBe(baseType);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWxpYXNUeXBlLXRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvaW50ZXJmYWNlL3R5cGUvX190ZXN0c19fL0FsaWFzVHlwZS10ZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw0QkFBc0IsY0FDdEIsQ0FBQyxDQURtQztBQUNwQyw0QkFBc0IsY0FFdEIsQ0FBQyxDQUZtQztBQUVwQyxJQUFJLENBQUMsaUJBQWlCLEVBQUU7SUFDdEIsTUFBTSxDQUFDLElBQUksbUJBQVMsQ0FBQyxFQUFFLENBQUMsWUFBWSxtQkFBUyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQzNELENBQUMsQ0FBQyxDQUFBO0FBRUYsSUFBSSxDQUFDLG9DQUFvQyxFQUFFO0lBQ3pDLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUMzQixNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUE7SUFDbkMsTUFBTSxTQUFTLEdBQUcsSUFBSSxtQkFBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUE7SUFDbkQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDM0MsQ0FBQyxDQUFDLENBQUEifQ==