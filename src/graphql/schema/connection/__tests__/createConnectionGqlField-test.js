jest.mock('../../type/getGqlOutputType')

import { Kind, GraphQLObjectType, GraphQLInterfaceType, GraphQLNonNull, GraphQLList, GraphQLString } from 'graphql'
import { ObjectType, stringType } from '../../../../interface'
import getGqlOutputType from '../../type/getGqlOutputType'
import createConnectionGqlField, { _cursorType, _pageInfoType, _createEdgeGqlType, _createOrderByGqlEnumType, _createConnectionGqlType } from '../createConnectionGqlField'

getGqlOutputType.mockImplementation(() => ({}))

const expectPromiseToReject = (promise, matcher) => new Promise((resolve, reject) =>
  promise
    .then(() => reject(new Error('Expected promise to reject.')))
    .catch(error => {
      expect(() => { throw error }).toThrowError(matcher)
      resolve()
    }),
)

test('_cursorType will correctly serialize namespaced cursors', () => {
  expect(_cursorType.serialize({
    orderingName: 'world',
    cursor: 'foobar',
  })).toBe('WyJ3b3JsZCIsImZvb2JhciJd')
})

test('_cursorType will correctly parse values', () => {
  expect(_cursorType.parseValue('WyJ3b3JsZCIsImZvb2JhciJd')).toEqual({
    orderingName: 'world',
    cursor: 'foobar',
  })
})

test('_cursorType will correctly parse literals', () => {
  expect(_cursorType.parseLiteral({
    kind: Kind.STRING,
    value: 'WyJ3b3JsZCIsImZvb2JhciJd',
  })).toEqual({
    orderingName: 'world',
    cursor: 'foobar',
  })
  expect(_cursorType.parseLiteral({ kind: Kind.INT })).toBe(null)
  expect(_cursorType.parseLiteral({ kind: Kind.FLOAT })).toBe(null)
  expect(_cursorType.parseLiteral({ kind: Kind.ENUM })).toBe(null)
  expect(_cursorType.parseLiteral({ kind: Kind.OBJECT })).toBe(null)
})

test('_pageInfoType will get hasNextPage correctly', () => {
  const hasNext = Symbol('hasNext')
  expect(_pageInfoType.getFields().hasNextPage.resolve({ page: { hasNextPage: () => hasNext } })).toBe(hasNext)
})

test('_pageInfoType will get hasPreviousPage correctly', () => {
  const hasPrevious = Symbol('hasPrevious')
  expect(_pageInfoType.getFields().hasPreviousPage.resolve({ page: { hasPreviousPage: () => hasPrevious } })).toBe(hasPrevious)
})

test('_pageInfoType will get the correct start cursor', () => {
  const paginatorName = Symbol('paginatorName')
  const orderingName = Symbol('orderingName')
  const startCursor = Symbol('startCursor')
  const endCursor = Symbol('endCursor')

  expect(_pageInfoType.getFields().startCursor.resolve({
    paginator: { name: paginatorName },
    orderingName,
    page: { values: [{ cursor: startCursor }, { cursor: endCursor }] },
  })).toEqual({
    orderingName,
    cursor: startCursor,
  })
})

test('_pageInfoType will get the correct end cursor', () => {
  const paginatorName = Symbol('paginatorName')
  const orderingName = Symbol('orderingName')
  const startCursor = Symbol('startCursor')
  const endCursor = Symbol('endCursor')

  expect(_pageInfoType.getFields().endCursor.resolve({
    paginator: { name: paginatorName },
    orderingName,
    page: { values: [{ cursor: startCursor }, { cursor: endCursor }] },
  })).toEqual({
    orderingName,
    cursor: endCursor,
  })
})

test('_createEdgeGqlType will create an object type', () => {
  const edgeType = _createEdgeGqlType({}, {})
  expect(edgeType instanceof GraphQLObjectType).toBe(true)
})

test('_createEdgeGqlType will have the correct name', () => {
  const edgeType = _createEdgeGqlType({}, { name: 'foo' })
  expect(edgeType.name).toBe('FooEdge')
})

test('_createEdgeGqlType will correctly return a namespaced cursor', () => {
  getGqlOutputType.mockReturnValueOnce({ gqlType: GraphQLString })
  const paginator = { name: 'foo' }
  const edgeType = _createEdgeGqlType({}, paginator)
  expect(edgeType.getFields().cursor.resolve({ paginator, cursor: 'foobar' }))
    .toEqual({
      orderingName: undefined,
      cursor: 'foobar',
    })
  expect(edgeType.getFields().cursor.resolve({ paginator, cursor: 'xyz', orderingName: 'bar' }))
    .toEqual({
      orderingName: 'bar',
      cursor: 'xyz',
    })
})

test('_createEdgeGqlType will just return the value for the node field', () => {
  getGqlOutputType.mockReturnValueOnce({ gqlType: GraphQLString })
  const value = Symbol('value')
  const edgeType = _createEdgeGqlType({}, {})
  expect(edgeType.getFields().node.resolve({ value })).toBe(value)
})

test('_createOrderByGqlEnumType will create an enum type with all the paginator orderings', () => {
  const a = Symbol('a')
  const b = Symbol('b')
  const orderings = new Map([['a', { a }], ['b', { b }]])
  const paginator = { name: 'bar', orderings }
  const enumType = _createOrderByGqlEnumType({}, paginator)

  expect(enumType.name).toBe('BarOrderBy')
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
  }])
})

test('_createConnectionGqlType will have the right name', () => {
  const connectionType = _createConnectionGqlType({}, { name: 'bar' })
  expect(connectionType.name).toBe('BarConnection')
})

test('_createConnectionGqlType will resolve the source verbatim for pageInfo', () => {
  const source = Symbol('source')
  getGqlOutputType.mockReturnValueOnce({ gqlType: GraphQLString })
  const connectionType = _createConnectionGqlType({}, {})
  expect(connectionType.getFields().pageInfo.resolve(source)).toBe(source)
})

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
