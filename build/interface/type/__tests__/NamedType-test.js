"use strict";
const NamedType_1 = require('../NamedType');
test('name will return the name', () => {
    const name = Symbol('name');
    const namedType = new NamedType_1.default({ name });
    expect(namedType.name).toBe(name);
});
test('description will return the name', () => {
    const description = Symbol('description');
    const namedType = new NamedType_1.default({ description });
    expect(namedType.description).toBe(description);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTmFtZWRUeXBlLXRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvaW50ZXJmYWNlL3R5cGUvX190ZXN0c19fL05hbWVkVHlwZS10ZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw0QkFBc0IsY0FFdEIsQ0FBQyxDQUZtQztBQUVwQyxJQUFJLENBQUMsMkJBQTJCLEVBQUU7SUFDaEMsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQzNCLE1BQU0sU0FBUyxHQUFHLElBQUksbUJBQVMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7SUFDekMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDbkMsQ0FBQyxDQUFDLENBQUE7QUFFRixJQUFJLENBQUMsa0NBQWtDLEVBQUU7SUFDdkMsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFBO0lBQ3pDLE1BQU0sU0FBUyxHQUFHLElBQUksbUJBQVMsQ0FBQyxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUE7SUFDaEQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUE7QUFDakQsQ0FBQyxDQUFDLENBQUEifQ==