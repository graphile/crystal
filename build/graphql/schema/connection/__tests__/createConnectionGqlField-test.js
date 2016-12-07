"use strict";
jest.mock('../../getGqlType');
const graphql_1 = require('graphql');
const getGqlType_1 = require('../../getGqlType');
const createConnectionGqlField_1 = require('../createConnectionGqlField');
const expectPromiseToReject = (promise, matcher) => new Promise((resolve, reject) => promise
    .then(() => reject(new Error('Expected promise to reject.')))
    .catch(error => {
    expect(() => { throw error; }).toThrowError(matcher);
    resolve();
}));
test('_cursorType will correctly serialize namespaced cursors', () => {
    expect(createConnectionGqlField_1._cursorType.serialize({
        orderingName: 'world',
        cursor: 'foobar',
    })).toBe('WyJ3b3JsZCIsImZvb2JhciJd');
});
test('_cursorType will correctly parse values', () => {
    expect(createConnectionGqlField_1._cursorType.parseValue('WyJ3b3JsZCIsImZvb2JhciJd')).toEqual({
        orderingName: 'world',
        cursor: 'foobar',
    });
});
test('_cursorType will correctly parse literals', () => {
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
test('_pageInfoType will get hasNextPage correctly', () => {
    const hasNext = Symbol('hasNext');
    expect(createConnectionGqlField_1._pageInfoType.getFields().hasNextPage.resolve({ page: { hasNextPage: () => hasNext } })).toBe(hasNext);
});
test('_pageInfoType will get hasPreviousPage correctly', () => {
    const hasPrevious = Symbol('hasPrevious');
    expect(createConnectionGqlField_1._pageInfoType.getFields().hasPreviousPage.resolve({ page: { hasPreviousPage: () => hasPrevious } })).toBe(hasPrevious);
});
test('_pageInfoType will get the correct start cursor', () => {
    const paginatorName = Symbol('paginatorName');
    const orderingName = Symbol('orderingName');
    const startCursor = Symbol('startCursor');
    const endCursor = Symbol('endCursor');
    expect(createConnectionGqlField_1._pageInfoType.getFields().startCursor.resolve({
        paginator: { name: paginatorName },
        orderingName,
        page: { values: [{ cursor: startCursor }, { cursor: endCursor }] },
    })).toEqual({
        orderingName,
        cursor: startCursor,
    });
});
test('_pageInfoType will get the correct end cursor', () => {
    const paginatorName = Symbol('paginatorName');
    const orderingName = Symbol('orderingName');
    const startCursor = Symbol('startCursor');
    const endCursor = Symbol('endCursor');
    expect(createConnectionGqlField_1._pageInfoType.getFields().endCursor.resolve({
        paginator: { name: paginatorName },
        orderingName,
        page: { values: [{ cursor: startCursor }, { cursor: endCursor }] },
    })).toEqual({
        orderingName,
        cursor: endCursor,
    });
});
test('_createEdgeGqlType will create an object type', () => {
    const edgeType = createConnectionGqlField_1._createEdgeGqlType({}, {});
    expect(edgeType instanceof graphql_1.GraphQLObjectType).toBe(true);
});
test('_createEdgeGqlType will have the correct name', () => {
    const edgeType = createConnectionGqlField_1._createEdgeGqlType({}, { name: 'foo' });
    expect(edgeType.name).toBe('FooEdge');
});
test('_createEdgeGqlType will correctly return a namespaced cursor', () => {
    getGqlType_1.default.mockReturnValueOnce(graphql_1.GraphQLString);
    const paginator = { name: 'foo' };
    const edgeType = createConnectionGqlField_1._createEdgeGqlType({}, paginator);
    expect(edgeType.getFields().cursor.resolve({ paginator, cursor: 'foobar' }))
        .toEqual({
        orderingName: undefined,
        cursor: 'foobar',
    });
    expect(edgeType.getFields().cursor.resolve({ paginator, cursor: 'xyz', orderingName: 'bar' }))
        .toEqual({
        orderingName: 'bar',
        cursor: 'xyz',
    });
});
test('_createEdgeGqlType will just return the value for the node field', () => {
    getGqlType_1.default.mockReturnValueOnce(graphql_1.GraphQLString);
    const value = Symbol('value');
    const edgeType = createConnectionGqlField_1._createEdgeGqlType({}, {});
    expect(edgeType.getFields().node.resolve({ value })).toBe(value);
});
test('_createOrderByGqlEnumType will create an enum type with all the paginator orderings', () => {
    const a = Symbol('a');
    const b = Symbol('b');
    const orderings = new Map([['a', { a }], ['b', { b }]]);
    const paginator = { name: 'bar', orderings };
    const enumType = createConnectionGqlField_1._createOrderByGqlEnumType({}, paginator);
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
test('_createConnectionGqlType will have the right name', () => {
    const connectionType = createConnectionGqlField_1._createConnectionGqlType({}, { name: 'bar' });
    expect(connectionType.name).toBe('BarConnection');
});
test('_createConnectionGqlType will resolve the source verbatim for pageInfo', () => {
    const source = Symbol('source');
    getGqlType_1.default.mockReturnValueOnce(graphql_1.GraphQLString);
    const connectionType = createConnectionGqlField_1._createConnectionGqlType({}, {});
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlQ29ubmVjdGlvbkdxbEZpZWxkLXRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvZ3JhcGhxbC9zY2hlbWEvY29ubmVjdGlvbi9fX3Rlc3RzX18vY3JlYXRlQ29ubmVjdGlvbkdxbEZpZWxkLXRlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQTtBQUU3QiwwQkFBMEcsU0FDMUcsQ0FBQyxDQURrSDtBQUVuSCw2QkFBdUIsa0JBQ3ZCLENBQUMsQ0FEd0M7QUFDekMsMkNBQThJLDZCQUU5SSxDQUFDLENBRjBLO0FBRTNLLE1BQU0scUJBQXFCLEdBQUcsQ0FBQyxPQUFPLEVBQUUsT0FBTyxLQUFLLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sS0FDOUUsT0FBTztLQUNKLElBQUksQ0FBQyxNQUFNLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDLENBQUM7S0FDNUQsS0FBSyxDQUFDLEtBQUs7SUFDVixNQUFNLENBQUMsUUFBUSxNQUFNLEtBQUssQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUNuRCxPQUFPLEVBQUUsQ0FBQTtBQUNYLENBQUMsQ0FBQyxDQUNMLENBQUE7QUFFRCxJQUFJLENBQUMseURBQXlELEVBQUU7SUFDOUQsTUFBTSxDQUFDLHNDQUFXLENBQUMsU0FBUyxDQUFDO1FBQzNCLFlBQVksRUFBRSxPQUFPO1FBQ3JCLE1BQU0sRUFBRSxRQUFRO0tBQ2pCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxDQUFBO0FBQ3RDLENBQUMsQ0FBQyxDQUFBO0FBRUYsSUFBSSxDQUFDLHlDQUF5QyxFQUFFO0lBQzlDLE1BQU0sQ0FBQyxzQ0FBVyxDQUFDLFVBQVUsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLENBQUMs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