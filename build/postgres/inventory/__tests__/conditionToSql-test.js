"use strict";
var sql_1 = require("../../utils/sql");
var conditionToSql_1 = require("../conditionToSql");
test('will correctly output true and false constants', function () {
    expect(conditionToSql_1.default(true)).toEqual((_a = ["true"], _a.raw = ["true"], sql_1.default.query(_a)));
    expect(conditionToSql_1.default(false)).toEqual((_b = ["false"], _b.raw = ["false"], sql_1.default.query(_b)));
    var _a, _b;
});
test('will output the not condition', function () {
    expect(conditionToSql_1.default({ type: 'NOT', condition: true }))
        .toEqual((_a = ["not(", ")"], _a.raw = ["not(", ")"], sql_1.default.query(_a, conditionToSql_1.default(true))));
    expect(conditionToSql_1.default({ type: 'NOT', condition: { type: 'NOT', condition: false } }))
        .toEqual((_b = ["not(", ")"], _b.raw = ["not(", ")"], sql_1.default.query(_b, (_c = ["not(", ")"], _c.raw = ["not(", ")"], sql_1.default.query(_c, conditionToSql_1.default(false))))));
    var _a, _b, _c;
});
test('will join multiple conditions with and', function () {
    expect(conditionToSql_1.default({ type: 'AND', conditions: [true, false, true] }))
        .toEqual((_a = ["(", " and ", " and ", ")"], _a.raw = ["(", " and ", " and ", ")"], sql_1.default.query(_a, conditionToSql_1.default(true), conditionToSql_1.default(false), conditionToSql_1.default(true))));
    var _a;
});
test('will join multiple conditions with or', function () {
    expect(conditionToSql_1.default({ type: 'OR', conditions: [false, true, false] }))
        .toEqual((_a = ["(", " or ", " or ", ")"], _a.raw = ["(", " or ", " or ", ")"], sql_1.default.query(_a, conditionToSql_1.default(false), conditionToSql_1.default(true), conditionToSql_1.default(false))));
    var _a;
});
test('will check equality', function () {
    var value = Symbol('value');
    expect(conditionToSql_1.default({ type: 'EQUAL', value: value }))
        .toEqual((_a = ["(", " = ", ")"], _a.raw = ["(", " = ", ")"], sql_1.default.query(_a, sql_1.default.identifier(), sql_1.default.value(value))));
    expect(conditionToSql_1.default({ type: 'EQUAL', value: value }, ['a', 'b', 'c']))
        .toEqual((_b = ["(", " = ", ")"], _b.raw = ["(", " = ", ")"], sql_1.default.query(_b, sql_1.default.identifier('a', 'b', 'c'), sql_1.default.value(value))));
    var _a, _b;
});
test('will check less than', function () {
    var value = Symbol('value');
    expect(conditionToSql_1.default({ type: 'LESS_THAN', value: value }))
        .toEqual((_a = ["(", " < ", ")"], _a.raw = ["(", " < ", ")"], sql_1.default.query(_a, sql_1.default.identifier(), sql_1.default.value(value))));
    expect(conditionToSql_1.default({ type: 'LESS_THAN', value: value }, ['a', 'b', 'c']))
        .toEqual((_b = ["(", " < ", ")"], _b.raw = ["(", " < ", ")"], sql_1.default.query(_b, sql_1.default.identifier('a', 'b', 'c'), sql_1.default.value(value))));
    var _a, _b;
});
test('will check greater than', function () {
    var value = Symbol('value');
    expect(conditionToSql_1.default({ type: 'GREATER_THAN', value: value }))
        .toEqual((_a = ["(", " > ", ")"], _a.raw = ["(", " > ", ")"], sql_1.default.query(_a, sql_1.default.identifier(), sql_1.default.value(value))));
    expect(conditionToSql_1.default({ type: 'GREATER_THAN', value: value }, ['a', 'b', 'c']))
        .toEqual((_b = ["(", " > ", ")"], _b.raw = ["(", " > ", ")"], sql_1.default.query(_b, sql_1.default.identifier('a', 'b', 'c'), sql_1.default.value(value))));
    var _a, _b;
});
test('will test for regular expressions', function () {
    var regexp = /./g;
    expect(conditionToSql_1.default({ type: 'REGEXP', regexp: regexp }))
        .toEqual((_a = ["regexp_matches(", ", ", ", ", ")"], _a.raw = ["regexp_matches(", ", ", ", ", ")"], sql_1.default.query(_a, sql_1.default.identifier(), sql_1.default.value('.'), sql_1.default.value('g'))));
    expect(conditionToSql_1.default({ type: 'REGEXP', regexp: regexp }, ['a', 'b', 'c']))
        .toEqual((_b = ["regexp_matches(", ", ", ", ", ")"], _b.raw = ["regexp_matches(", ", ", ", ", ")"], sql_1.default.query(_b, sql_1.default.identifier('a', 'b', 'c'), sql_1.default.value('.'), sql_1.default.value('g'))));
    var _a, _b;
});
test('will set the path for child conditions with the field condition', function () {
    var value = Symbol('value');
    expect(conditionToSql_1.default({ type: 'FIELD', name: 'a', condition: { type: 'EQUAL', value: value } }))
        .toEqual(conditionToSql_1.default({ type: 'EQUAL', value: value }, ['a']));
    expect(conditionToSql_1.default({ type: 'FIELD', name: 'd', condition: { type: 'EQUAL', value: value } }, ['a', 'b', 'c']))
        .toEqual(conditionToSql_1.default({ type: 'EQUAL', value: value }, ['a', 'b', 'c', 'd']));
});
test('integration test 1', function () {
    var condition = {
        type: 'AND',
        conditions: [
            true,
            { type: 'NOT', condition: false },
            { type: 'FIELD', name: 'a', condition: { type: 'EQUAL', value: 42 } },
            { type: 'FIELD', name: 'a', condition: { type: 'FIELD', name: 'b', condition: { type: 'LESS_THAN', value: 45 } } },
            {
                type: 'FIELD',
                name: 'c',
                condition: {
                    type: 'NOT',
                    condition: {
                        type: 'OR',
                        conditions: [
                            { type: 'GREATER_THAN', value: 5 },
                            { type: 'EQUAL', value: 5 },
                        ],
                    },
                },
            },
        ],
    };
    expect(sql_1.default.compile(conditionToSql_1.default(condition))).toEqual({
        name: undefined,
        text: '(true and not(false) and ("a" = $1) and ("a"."b" < $2) and not((("c" > $3) or ("c" = $4))))',
        values: [42, 45, 5, 5],
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZGl0aW9uVG9TcWwtdGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9wb3N0Z3Jlcy9pbnZlbnRvcnkvX190ZXN0c19fL2NvbmRpdGlvblRvU3FsLXRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLHVDQUFpQztBQUNqQyxvREFBOEM7QUFFOUMsSUFBSSxDQUFDLGdEQUFnRCxFQUFFO0lBQ3JELE1BQU0sQ0FBQyx3QkFBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTywyQkFBVSxNQUFNLEdBQWYsYUFBRyxDQUFDLEtBQUssTUFBTyxDQUFBO0lBQ3JELE1BQU0sQ0FBQyx3QkFBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyw0QkFBVSxPQUFPLEdBQWhCLGFBQUcsQ0FBQyxLQUFLLE1BQVEsQ0FBQTs7QUFDekQsQ0FBQyxDQUFDLENBQUE7QUFFRixJQUFJLENBQUMsK0JBQStCLEVBQUU7SUFDcEMsTUFBTSxDQUFDLHdCQUFjLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1NBQ3JELE9BQU8sZ0NBQVUsTUFBTyxFQUFvQixHQUFHLEdBQXZDLGFBQUcsQ0FBQyxLQUFLLEtBQU8sd0JBQWMsQ0FBQyxJQUFJLENBQUMsR0FBSSxDQUFBO0lBQ25ELE1BQU0sQ0FBQyx3QkFBYyxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDbEYsT0FBTyxnQ0FBVSxNQUFPLEVBQXdDLEdBQUcsR0FBM0QsYUFBRyxDQUFDLEtBQUssb0NBQWdCLE1BQU8sRUFBcUIsR0FBRyxHQUF4QyxhQUFHLENBQUMsS0FBSyxLQUFPLHdCQUFjLENBQUMsS0FBSyxDQUFDLEtBQU8sQ0FBQTs7QUFDekUsQ0FBQyxDQUFD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