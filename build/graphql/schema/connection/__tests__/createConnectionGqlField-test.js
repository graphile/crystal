"use strict";
jest.mock('../../type/getGqlOutputType');
var graphql_1 = require("graphql");
var getGqlOutputType_1 = require("../../type/getGqlOutputType");
var createConnectionGqlField_1 = require("../createConnectionGqlField");
getGqlOutputType_1.default.mockImplementation(function () { return ({}); });
var expectPromiseToReject = function (promise, matcher) { return new Promise(function (resolve, reject) {
    return promise
        .then(function () { return reject(new Error('Expected promise to reject.')); })
        .catch(function (error) {
        expect(function () { throw error; }).toThrowError(matcher);
        resolve();
    });
}); };
test('_cursorType will correctly serialize namespaced cursors', function () {
    expect(createConnectionGqlField_1._cursorType.serialize({
        orderingName: 'world',
        cursor: 'foobar',
    })).toBe('WyJ3b3JsZCIsImZvb2JhciJd');
});
test('_cursorType will correctly parse values', function () {
    expect(createConnectionGqlField_1._cursorType.parseValue('WyJ3b3JsZCIsImZvb2JhciJd')).toEqual({
        orderingName: 'world',
        cursor: 'foobar',
    });
});
test('_cursorType will correctly parse literals', function () {
    expect(createConnectionGqlField_1._cursorType.parseLiteral({
        kind: graphql_1.Kind.STRING,
        value: 'WyJ3b3JsZCIsImZvb2JhciJd',
    })).toEqual({
        orderingName: 'world',
        cursor: 'foobar',
    });
    expect(createConnectionGqlField_1._cursorType.parseLiteral({ kind: graphql_1.Kind.INT })).toBe(null);
    expect(createConnectionGqlField_1._cursorType.parseLiteral({ kind: graphql_1.Kind.FLOAT })).toBe(null);
    expect(createConnectionGqlField_1._cursorType.parseLiteral({ kind: graphql_1.Kind.ENUM })).toBe(null);
    expect(createConnectionGqlField_1._cursorType.parseLiteral({ kind: graphql_1.Kind.OBJECT })).toBe(null);
});
test('_pageInfoType will get hasNextPage correctly', function () {
    var hasNext = Symbol('hasNext');
    expect(createConnectionGqlField_1._pageInfoType.getFields().hasNextPage.resolve({ page: { hasNextPage: function () { return hasNext; } } })).toBe(hasNext);
});
test('_pageInfoType will get hasPreviousPage correctly', function () {
    var hasPrevious = Symbol('hasPrevious');
    expect(createConnectionGqlField_1._pageInfoType.getFields().hasPreviousPage.resolve({ page: { hasPreviousPage: function () { return hasPrevious; } } })).toBe(hasPrevious);
});
test('_pageInfoType will get the correct start cursor', function () {
    var paginatorName = Symbol('paginatorName');
    var orderingName = Symbol('orderingName');
    var startCursor = Symbol('startCursor');
    var endCursor = Symbol('endCursor');
    expect(createConnectionGqlField_1._pageInfoType.getFields().startCursor.resolve({
        paginator: { name: paginatorName },
        orderingName: orderingName,
        page: { values: [{ cursor: startCursor }, { cursor: endCursor }] },
    })).toEqual({
        orderingName: orderingName,
        cursor: startCursor,
    });
});
test('_pageInfoType will get the correct end cursor', function () {
    var paginatorName = Symbol('paginatorName');
    var orderingName = Symbol('orderingName');
    var startCursor = Symbol('startCursor');
    var endCursor = Symbol('endCursor');
    expect(createConnectionGqlField_1._pageInfoType.getFields().endCursor.resolve({
        paginator: { name: paginatorName },
        orderingName: orderingName,
        page: { values: [{ cursor: startCursor }, { cursor: endCursor }] },
    })).toEqual({
        orderingName: orderingName,
        cursor: endCursor,
    });
});
test('_createEdgeGqlType will create an object type', function () {
    var edgeType = createConnectionGqlField_1._createEdgeGqlType({}, {});
    expect(edgeType instanceof graphql_1.GraphQLObjectType).toBe(true);
});
test('_createEdgeGqlType will have the correct name', function () {
    var edgeType = createConnectionGqlField_1._createEdgeGqlType({}, { name: 'foo' });
    expect(edgeType.name).toBe('FooEdge');
});
test('_createEdgeGqlType will correctly return a namespaced cursor', function () {
    getGqlOutputType_1.default.mockReturnValueOnce({ gqlType: graphql_1.GraphQLString });
    var paginator = { name: 'foo' };
    var edgeType = createConnectionGqlField_1._createEdgeGqlType({}, paginator);
    expect(edgeType.getFields().cursor.resolve({ paginator: paginator, cursor: 'foobar' }))
        .toEqual({
        orderingName: undefined,
        cursor: 'foobar',
    });
    expect(edgeType.getFields().cursor.resolve({ paginator: paginator, cursor: 'xyz', orderingName: 'bar' }))
        .toEqual({
        orderingName: 'bar',
        cursor: 'xyz',
    });
});
test('_createEdgeGqlType will just return the value for the node field', function () {
    getGqlOutputType_1.default.mockReturnValueOnce({ gqlType: graphql_1.GraphQLString });
    var value = Symbol('value');
    var edgeType = createConnectionGqlField_1._createEdgeGqlType({}, {});
    expect(edgeType.getFields().node.resolve({ value: value })).toBe(value);
});
test('_createOrderByGqlEnumType will create an enum type with all the paginator orderings', function () {
    var a = Symbol('a');
    var b = Symbol('b');
    var orderings = new Map([['a', { a: a }], ['b', { b: b }]]);
    var paginator = { name: 'bar', orderings: orderings };
    var enumType = createConnectionGqlField_1._createOrderByGqlEnumType({}, paginator);
    expect(enumType.name).toBe('BarOrderBy');
    expect(enumType.getValues()).toEqual([{
            name: 'A',
            value: 'a',
            description: undefined,
            isDeprecated: false,
            deprecationReason: undefined,
        }, {
            name: 'B',
            value: 'b',
            description: undefined,
            isDeprecated: false,
            deprecationReason: undefined,
        }]);
});
test('_createConnectionGqlType will have the right name', function () {
    var connectionType = createConnectionGqlField_1._createConnectionGqlType({}, { name: 'bar' });
    expect(connectionType.name).toBe('BarConnection');
});
test('_createConnectionGqlType will resolve the source verbatim for pageInfo', function () {
    var source = Symbol('source');
    getGqlOutputType_1.default.mockReturnValueOnce({ gqlType: graphql_1.GraphQLString });
    var connectionType = createConnectionGqlField_1._createConnectionGqlType({}, {});
    expect(connectionType.getFields().pageInfo.resolve(source)).toBe(source);
});
// test('_createConnectionGqlType will use the paginators count method for totalCount', () => {
//   const count = Symbol('count')
//   const args = Symbol('args')
//   const context = new Context()
//   const input = Symbol('input')
//   const paginator = { count: jest.fn(() => count) }
//   getGqlType.mockReturnValueOnce(GraphQLString)
//   const connectionType = _createConnectionGqlType({}, paginator, {})
//   expect(connectionType.getFields().totalCount.resolve({ paginator, input }, args, context)).toBe(count)
//   expect(paginator.count.mock.calls).toEqual([[context, input]])
// })
// test('_createConnectionGqlType will get the edges from the source page with some extra info', () => {
//   const paginator = Symbol('paginator')
//   const orderingName = Symbol('orderingName')
//   const values = [{ value: 'a', cursor: 1 }, { value: 'b', cursor: 2 }]
//   getGqlType.mockReturnValueOnce(GraphQLString)
//   const connectionType = _createConnectionGqlType({}, {})
//   expect(connectionType.getFields().edges.resolve({ paginator, orderingName, page: { values } }, {}, new Context()))
//     .toEqual([{ value: 'a', cursor: 1, paginator, orderingName }, { value: 'b', cursor: 2, paginator, orderingName }])
// })
// test('_createConnectionGqlType will map the nodes field to page values', () => {
//   const value1 = Symbol('value1')
//   const value2 = Symbol('value2')
//   getGqlType.mockReturnValueOnce(GraphQLString)
//   const connectionType = _createConnectionGqlType({}, {})
//   expect(connectionType.getFields().nodes.resolve({ page: { values: [{ value: value1 }, { value: value2 }] } }, {}, new Context()))
//     .toEqual([value1, value2])
// })
// test('createConnectionGqlField will throw when trying to resolve with cursors from different orderings', async () => {
//   const paginator = { name: 'foo' }
//   const field = createConnectionGqlField({}, paginator, {})
//   await expectPromiseToReject(field.resolve(null, { orderBy: { name: 'buz' }, before: { paginatorName: 'foo', orderingName: null } }, new Context()), '`before` cursor can not be used for this `orderBy` value.')
//   await expectPromiseToReject(field.resolve(null, { orderBy: { name: 'buz' }, after: { paginatorName: 'foo', orderingName: null } }, new Context()), '`after` cursor can not be used for this `orderBy` value.')
//   await expectPromiseToReject(field.resolve(null, { orderBy: { name: 'buz' }, before: { paginatorName: 'foo', orderingName: 'bar' } }, new Context()), '`before` cursor can not be used for this `orderBy` value.')
//   await expectPromiseToReject(field.resolve(null, { orderBy: { name: 'buz' }, after: { paginatorName: 'foo', orderingName: 'bar' } }, new Context()), '`after` cursor can not be used for this `orderBy` value.')
//   await expectPromiseToReject(field.resolve(null, { orderBy: null, before: { paginatorName: 'foo', orderingName: 'buz' } }, new Context()), '`before` cursor can not be used for this `orderBy` value.')
//   await expectPromiseToReject(field.resolve(null, { orderBy: null, after: { paginatorName: 'foo', orderingName: 'buz' } }, new Context()), '`after` cursor can not be used for this `orderBy` value.')
// })
// test('createConnectionGqlField resolver will call Paginator#readPage and return the resulting page with some other values', async () => {
//   const context = new Context()
//   const a = Symbol('a')
//   const input = Symbol('input')
//   const page = Symbol('page')
//   const getPaginatorInput = jest.fn(() => input)
//   const ordering = { readPage: jest.fn(() => page) }
//   const paginator = { name: 'foo', orderings: new Map([['foo', ordering]]), defaultOrdering: ordering }
//   const field = createConnectionGqlField({}, paginator, { getPaginatorInput })
//   expect(await field.resolve(null, { orderBy: 'foo', a }, context)).toEqual({
//     paginator,
//     orderingName: 'foo',
//     input,
//     page,
//   })
//   expect(ordering.readPage.mock.calls).toEqual([[context, input, {}]])
//   expect(getPaginatorInput.mock.calls).toEqual([[null, { orderBy: 'foo', a }]])
// })
// test('createConnectionGqlField will pass down valid cursors without orderings', async () => {
//   const context = new Context()
//   const cursor1 = Symbol('cursor1')
//   const cursor2 = Symbol('cursor2')
//   const beforeCursor = { paginatorName: 'bar', orderingName: 'foo', cursor: cursor1 }
//   const afterCursor = { paginatorName: 'bar', orderingName: 'foo', cursor: cursor2 }
//   const input = Symbol('input')
//   const getPaginatorInput = jest.fn(() => input)
//   const ordering = { readPage: jest.fn() }
//   const paginator = { name: 'bar', orderings: new Map([['foo', ordering]]), defaultOrdering: ordering }
//   await createConnectionGqlField({}, paginator, { getPaginatorInput }).resolve(null, { orderBy: 'foo', before: beforeCursor }, context)
//   await createConnectionGqlField({}, paginator, { getPaginatorInput }).resolve(null, { orderBy: 'foo', after: afterCursor }, context)
//   expect(ordering.readPage.mock.calls).toEqual([
//     [context, input, { beforeCursor: cursor1 }],
//     [context, input, { afterCursor: cursor2 }],
//   ])
//   expect(getPaginatorInput.mock.calls).toEqual([
//     [null, { orderBy: 'foo', before: beforeCursor }],
//     [null, { orderBy: 'foo', after: afterCursor }],
//   ])
// })
// test('createConnectionGqlField will pass down first/last integers', async () => {
//   const context = new Context()
//   const first = Symbol('first')
//   const last = Symbol('last')
//   const input = Symbol('input')
//   const getPaginatorInput = jest.fn(() => input)
//   const ordering = { readPage: jest.fn() }
//   const paginator = { name: 'bar', orderings: new Map([['foo', ordering]]), defaultOrdering: ordering }
//   await createConnectionGqlField({}, paginator, { getPaginatorInput }).resolve(null, { orderBy: 'foo', first }, context)
//   await createConnectionGqlField({}, paginator, { getPaginatorInput }).resolve(null, { orderBy: 'foo', last }, context)
//   expect(ordering.readPage.mock.calls).toEqual([
//     [context, input, { first }],
//     [context, input, { last }],
//   ])
//   expect(getPaginatorInput.mock.calls).toEqual([
//     [null, { orderBy: 'foo', first }],
//     [null, { orderBy: 'foo', last }],
//   ])
// })
// TODO: Refactor for `inputArgEntries`
// test('createConnectionGqlField will throw an error when `withFieldsCondition` is true but the paginator type is not an object type', () => {
//   expect(() => createConnectionGqlField({}, {}, { withFieldsCondition: true }))
//     .toThrow('Can only create a connection which has field argument conditions if the paginator type is an object type.')
// })
// test('createConnectionGqlField will add extra arguments when `withFieldsCondition` is true', () => {
//   const objectType = new ObjectType({
//     name: 'item',
//     fields: new Map([
//       ['a', { type: stringType }],
//       ['b', { type: stringType }],
//       ['c', { type: stringType }],
//     ])
//   })
//   const paginator = { name: 'foo', type: objectType }
//   const field1 = createConnectionGqlField({}, paginator, { withFieldsCondition: false })
//   const field2 = createConnectionGqlField({}, paginator, { withFieldsCondition: true })
//   expect(field1.args.a).toBeFalsy()
//   expect(field1.args.b).toBeFalsy()
//   expect(field1.args.c).toBeFalsy()
//   expect(field2.args.a).toBeTruthy()
//   expect(field2.args.b).toBeTruthy()
//   expect(field2.args.c).toBeTruthy()
//   expect(field2.args.a.type instanceof GraphQLNonNull).toBe(false)
//   expect(field2.args.b.type instanceof GraphQLNonNull).toBe(false)
//   expect(field2.args.c.type instanceof GraphQLNonNull).toBe(false)
// })
// test('createConnectionGqlField will use extra arguments from `withFieldsCondition` and pass down a condition with them', async () => {
//   getGqlType.mockReturnValue(GraphQLString)
//   const objectType = new ObjectType({
//     name: 'item',
//     fields: new Map([
//       ['x_a', { type: stringType }],
//       ['x_b', { type: stringType }],
//       ['x_c', { type: stringType }],
//     ])
//   })
//   const extraCondition = Symbol('extraCondition')
//   const context = new Context()
//   const paginator = { name: 'foo', type: objectType, readPage: jest.fn() }
//   const field1 = createConnectionGqlField({}, paginator, { withFieldsCondition: true })
//   const field2 = createConnectionGqlField({}, paginator, { withFieldsCondition: true, getCondition: () => extraCondition })
//   const condition0 = { type: 'AND', conditions: [{ type: 'FIELD', name: 'x_a', condition: { type: 'EQUAL', value: 'x' } }, { type: 'FIELD', name: 'x_b', condition: { type: 'EQUAL', value: 'y' } }, { type: 'FIELD', name: 'x_c', condition: { type: 'EQUAL', value: 'z' } }] }
//   const condition1 = { type: 'FIELD', name: 'x_b', condition: { type: 'EQUAL', value: 'y' } }
//   const condition2 = { type: 'AND', conditions: [{ type: 'FIELD', name: 'x_a', condition: { type: 'EQUAL', value: 'x' } }, { type: 'FIELD', name: 'x_c', condition: { type: 'EQUAL', value: 'z' } }] }
//   const condition3 = { type: 'AND', conditions: [extraCondition, { type: 'FIELD', name: 'x_a', condition: { type: 'EQUAL', value: 'x' } }, { type: 'FIELD', name: 'x_c', condition: { type: 'EQUAL', value: 'z' } }] }
//   await field1.resolve(null, { xA: 'x', xB: 'y', xC: 'z' }, context)
//   await field1.resolve(null, { xB: 'y' }, context)
//   await field1.resolve(null, { xA: 'x', xC: 'z' }, context)
//   await field2.resolve(null, { xA: 'x', xC: 'z' }, context)
//   expect(paginator.readPage.mock.calls).toEqual([
//     [context, { condition: condition0 }],
//     [context, { condition: condition1 }],
//     [context, { condition: condition2 }],
//     [context, { condition: condition3 }],
//   ])
// })
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlQ29ubmVjdGlvbkdxbEZpZWxkLXRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvZ3JhcGhxbC9zY2hlbWEvY29ubmVjdGlvbi9fX3Rlc3RzX18vY3JlYXRlQ29ubmVjdGlvbkdxbEZpZWxkLXRlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsNkJBQTZCLENBQUMsQ0FBQTtBQUV4QyxtQ0FBbUg7QUFFbkgsZ0VBQTBEO0FBQzFELHdFQUEySztBQUUzSywwQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQyxjQUFNLE9BQUEsQ0FBQyxFQUFFLENBQUMsRUFBSixDQUFJLENBQUMsQ0FBQTtBQUUvQyxJQUFNLHFCQUFxQixHQUFHLFVBQUMsT0FBTyxFQUFFLE9BQU8sSUFBSyxPQUFBLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU07SUFDOUUsT0FBQSxPQUFPO1NBQ0osSUFBSSxDQUFDLGNBQU0sT0FBQSxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQyxFQUFoRCxDQUFnRCxDQUFDO1NBQzVELEtBQUssQ0FBQyxVQUFBLEtBQUs7UUFDVixNQUFNLENBQUMsY0FBUSxNQUFNLEtBQUssQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUNuRCxPQUFPLEVBQUUsQ0FBQTtJQUNYLENBQUMsQ0FBQztBQUxKLENBS0ksQ0FDTCxFQVBtRCxDQU9uRCxDQUFBO0FBRUQsSUFBSSxDQUFDLHlEQUF5RCxFQUFFO0lBQzlELE1BQU0sQ0FBQyxzQ0FBVyxDQUFDLFNBQVMsQ0FBQztRQUMzQixZQUFZLEVBQUUsT0FBTztRQUNyQixNQUFNLEVBQUUsUUFBUTtLQUNqQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsMEJBQTBCLENBQUMsQ0FBQTtBQUN0QyxDQUFDLENBQUMsQ0FBQTtBQUVGLElBQUks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