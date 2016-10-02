jest.mock('../../getGQLType')
jest.mock('../../../../interface/Context')

import { Kind, GraphQLObjectType, GraphQLInterfaceType, GraphQLNonNull, GraphQLList, GraphQLString } from 'graphql'
import { Context, ObjectType, stringType } from '../../../../interface'
import getGQLType from '../../getGQLType'
import createConnectionGQLField, { _cursorType, _pageInfoType, _createEdgeType, _createOrderByEnumType, _createConnectionType } from '../createConnectionGQLField'

const expectPromiseToReject = (promise, matcher) => new Promise((resolve, reject) =>
  promise
    .then(() => reject(new Error('Expected promise to reject.')))
    .catch(error => {
      expect(() => { throw error }).toThrowError(matcher)
      resolve()
    })
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

test('_createEdgeType will create an object type', () => {
  const edgeType = _createEdgeType({}, {})
  expect(edgeType instanceof GraphQLObjectType).toBe(true)
})

test('_createEdgeType will have the correct name', () => {
  const edgeType = _createEdgeType({}, { name: 'foo' })
  expect(edgeType.name).toBe('FooEdge')
})

test('_createEdgeType will correctly return a namespaced cursor', () => {
  getGQLType.mockReturnValueOnce(GraphQLString)
  const paginator = { name: 'foo' }
  const edgeType = _createEdgeType({}, paginator)
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

test('_createEdgeType will just return the value for the node field', () => {
  getGQLType.mockReturnValueOnce(GraphQLString)
  const value = Symbol('value')
  const edgeType = _createEdgeType({}, {})
  expect(edgeType.getFields().node.resolve({ value })).toBe(value)
})

test('_createOrderByEnumType will create an enum type with all the paginator orderings', () => {
  const a = Symbol('a')
  const b = Symbol('b')
  const orderings = new Map([['a', { a }], ['b', { b }]])
  const paginator = { name: 'bar', orderings }
  const enumType = _createOrderByEnumType({}, paginator)

  expect(enumType.name).toBe('BarOrderBy')
  expect(enumType.getValues()).toEqual([{
    name: 'A',
    value: 'a',
    description: undefined,
    deprecationReason: undefined,
  }, {
    name: 'B',
    value: 'b',
    description: undefined,
    deprecationReason: undefined,
  }])
})

test('_createConnectionType will have the right name', () => {
  const connectionType = _createConnectionType({}, { name: 'bar' })
  expect(connectionType.name).toBe('BarConnection')
})

test('_createConnectionType will resolve the source verbatim for pageInfo', () => {
  const source = Symbol('source')
  getGQLType.mockReturnValueOnce(GraphQLString)
  const connectionType = _createConnectionType({}, {})
  expect(connectionType.getFields().pageInfo.resolve(source)).toBe(source)
})

test('_createConnectionType will use the paginators count method for totalCount', () => {
  const count = Symbol('count')
  const args = Symbol('args')
  const context = new Context()
  const input = Symbol('input')

  const paginator = { count: jest.fn(() => count) }

  getGQLType.mockReturnValueOnce(GraphQLString)
  const connectionType = _createConnectionType({}, paginator, {})

  expect(connectionType.getFields().totalCount.resolve({ paginator, input }, args, context)).toBe(count)
  expect(paginator.count.mock.calls).toEqual([[context, input]])
})

test('_createConnectionType will get the edges from the source page with some extra info', () => {
  const paginator = Symbol('paginator')
  const orderingName = Symbol('orderingName')
  const values = [{ value: 'a', cursor: 1 }, { value: 'b', cursor: 2 }]

  getGQLType.mockReturnValueOnce(GraphQLString)
  const connectionType = _createConnectionType({}, {})

  expect(connectionType.getFields().edges.resolve({ paginator, orderingName, page: { values } }, {}, new Context()))
    .toEqual([{ value: 'a', cursor: 1, paginator, orderingName }, { value: 'b', cursor: 2, paginator, orderingName }])
})

test('_createConnectionType will map the nodes field to page values', () => {
  const value1 = Symbol('value1')
  const value2 = Symbol('value2')
  getGQLType.mockReturnValueOnce(GraphQLString)
  const connectionType = _createConnectionType({}, {})
  expect(connectionType.getFields().nodes.resolve({ page: { values: [{ value: value1 }, { value: value2 }] } }, {}, new Context()))
    .toEqual([value1, value2])
})

test('createConnectionGQLField will throw when trying to resolve with cursors from different orderings', async () => {
  const paginator = { name: 'foo' }
  const field = createConnectionGQLField({}, paginator, {})
  await expectPromiseToReject(field.resolve(null, { orderBy: { name: 'buz' }, before: { paginatorName: 'foo', orderingName: null } }, new Context()), '`before` cursor can not be used for this `orderBy` value.')
  await expectPromiseToReject(field.resolve(null, { orderBy: { name: 'buz' }, after: { paginatorName: 'foo', orderingName: null } }, new Context()), '`after` cursor can not be used for this `orderBy` value.')
  await expectPromiseToReject(field.resolve(null, { orderBy: { name: 'buz' }, before: { paginatorName: 'foo', orderingName: 'bar' } }, new Context()), '`before` cursor can not be used for this `orderBy` value.')
  await expectPromiseToReject(field.resolve(null, { orderBy: { name: 'buz' }, after: { paginatorName: 'foo', orderingName: 'bar' } }, new Context()), '`after` cursor can not be used for this `orderBy` value.')
  await expectPromiseToReject(field.resolve(null, { orderBy: null, before: { paginatorName: 'foo', orderingName: 'buz' } }, new Context()), '`before` cursor can not be used for this `orderBy` value.')
  await expectPromiseToReject(field.resolve(null, { orderBy: null, after: { paginatorName: 'foo', orderingName: 'buz' } }, new Context()), '`after` cursor can not be used for this `orderBy` value.')
})

test('createConnectionGQLField resolver will call Paginator#readPage and return the resulting page with some other values', async () => {
  const context = new Context()
  const a = Symbol('a')
  const input = Symbol('input')
  const page = Symbol('page')
  const getPaginatorInput = jest.fn(() => input)

  const ordering = { readPage: jest.fn(() => page) }
  const paginator = { name: 'foo', orderings: new Map([['foo', ordering]]), defaultOrdering: ordering }

  const field = createConnectionGQLField({}, paginator, { getPaginatorInput })

  expect(await field.resolve(null, { orderBy: 'foo', a }, context)).toEqual({
    paginator,
    orderingName: 'foo',
    input,
    page,
  })

  expect(ordering.readPage.mock.calls).toEqual([[context, input, {}]])
  expect(getPaginatorInput.mock.calls).toEqual([[null, { orderBy: 'foo', a }]])
})

test('createConnectionGQLField will pass down valid cursors without orderings', async () => {
  const context = new Context()
  const cursor1 = Symbol('cursor1')
  const cursor2 = Symbol('cursor2')

  const beforeCursor = { paginatorName: 'bar', orderingName: 'foo', cursor: cursor1 }
  const afterCursor = { paginatorName: 'bar', orderingName: 'foo', cursor: cursor2 }

  const input = Symbol('input')
  const getPaginatorInput = jest.fn(() => input)
  const ordering = { readPage: jest.fn() }
  const paginator = { name: 'bar', orderings: new Map([['foo', ordering]]), defaultOrdering: ordering }

  await createConnectionGQLField({}, paginator, { getPaginatorInput }).resolve(null, { orderBy: 'foo', before: beforeCursor }, context)
  await createConnectionGQLField({}, paginator, { getPaginatorInput }).resolve(null, { orderBy: 'foo', after: afterCursor }, context)

  expect(ordering.readPage.mock.calls).toEqual([
    [context, input, { beforeCursor: cursor1 }],
    [context, input, { afterCursor: cursor2 }],
  ])
  expect(getPaginatorInput.mock.calls).toEqual([
    [null, { orderBy: 'foo', before: beforeCursor }],
    [null, { orderBy: 'foo', after: afterCursor }],
  ])
})

test('createConnectionGQLField will pass down first/last integers', async () => {
  const context = new Context()
  const first = Symbol('first')
  const last = Symbol('last')

  const input = Symbol('input')
  const getPaginatorInput = jest.fn(() => input)
  const ordering = { readPage: jest.fn() }
  const paginator = { name: 'bar', orderings: new Map([['foo', ordering]]), defaultOrdering: ordering }

  await createConnectionGQLField({}, paginator, { getPaginatorInput }).resolve(null, { orderBy: 'foo', first }, context)
  await createConnectionGQLField({}, paginator, { getPaginatorInput }).resolve(null, { orderBy: 'foo', last }, context)

  expect(ordering.readPage.mock.calls).toEqual([
    [context, input, { first }],
    [context, input, { last }],
  ])
  expect(getPaginatorInput.mock.calls).toEqual([
    [null, { orderBy: 'foo', first }],
    [null, { orderBy: 'foo', last }],
  ])
})

// TODO: Refactor for `inputArgEntries`

// test('createConnectionGQLField will throw an error when `withFieldsCondition` is true but the paginator type is not an object type', () => {
//   expect(() => createConnectionGQLField({}, {}, { withFieldsCondition: true }))
//     .toThrow('Can only create a connection which has field argument conditions if the paginator type is an object type.')
// })

// test('createConnectionGQLField will add extra arguments when `withFieldsCondition` is true', () => {
//   const objectType = new ObjectType({
//     name: 'item',
//     fields: new Map([
//       ['a', { type: stringType }],
//       ['b', { type: stringType }],
//       ['c', { type: stringType }],
//     ])
//   })

//   const paginator = { name: 'foo', type: objectType }
//   const field1 = createConnectionGQLField({}, paginator, { withFieldsCondition: false })
//   const field2 = createConnectionGQLField({}, paginator, { withFieldsCondition: true })

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

// test('createConnectionGQLField will use extra arguments from `withFieldsCondition` and pass down a condition with them', async () => {
//   getGQLType.mockReturnValue(GraphQLString)

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
//   const field1 = createConnectionGQLField({}, paginator, { withFieldsCondition: true })
//   const field2 = createConnectionGQLField({}, paginator, { withFieldsCondition: true, getCondition: () => extraCondition })

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
