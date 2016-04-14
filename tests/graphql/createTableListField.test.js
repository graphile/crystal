import assert from 'assert'
import expect from 'expect'
import { GraphQLObjectType, GraphQLNonNull, GraphQLList } from 'graphql'
import { getClient, TestTable } from '../helpers.js'
import getCatalog from '../../src/postgres/getCatalog.js'
import createTableType from '../../src/graphql/createTableType.js'
import createTableListField from '../../src/graphql/createTableListField.js'

describe('graphql/createTableListField', () => {
  const testCreateTableListField = async tableName => {
    const client = await getClient()
    const catalog = await getCatalog(client)
    const table = catalog.getTable('create_table_list_field', tableName)
    const field = createTableListField(client, table, createTableType(client, table))
    return field
  }

  it('has an object type', async () => {
    const { type } = createTableListField(new TestTable())
    expect(type).toBeA(GraphQLObjectType)
  })

  it('will append “connection” to type name', () => {
    const { type } = createTableListField(new TestTable({ name: 'person' }))
    expect(type.name).toEqual('PersonConnection')
  })

  it('will have Relay connection arguments', () => {
    const field = createTableListField(new TestTable())
    expect(field.args).toIncludeKeys(['first', 'last', 'before', 'after'])
  })

  it('will take cursors for `before` and `after` args', () => {
    const field = createTableListField(new TestTable())
    expect(field.args.before.type.name).toEqual('Cursor')
    expect(field.args.after.type.name).toEqual('Cursor')
  })

  it('will take standard SQL args', () => {
    const field = createTableListField(new TestTable())
    expect(field.args).toIncludeKeys(['orderBy', 'offset', 'descending'])
  })

  it('will have a connection type with Relay connection fields', () => {
    const { type } = createTableListField(new TestTable({ name: 'person' }))
    const fields = type.getFields()
    expect(fields.pageInfo.type).toBeA(GraphQLNonNull)
    expect(fields.pageInfo.type.ofType.name).toEqual('PageInfo')
    expect(fields.totalCount.type.name).toEqual('Int')
    expect(fields.edges.type).toBeA(GraphQLList)
    expect(fields.edges.type.ofType.name).toEqual('PersonEdge')
  })

  it('will have a connection type with a plain list field', () => {
    const { type } = createTableListField(new TestTable({ name: 'person' }))
    const fields = type.getFields()
    expect(fields.list.type).toBeA(GraphQLList)
    expect(fields.list.type.ofType.name).toEqual('Person')
  })

  it('will have edges with a node and a cursor', () => {
    const { type } = createTableListField(new TestTable({ name: 'person' }))
    const edgeType = type.getFields().edges.type
    expect(edgeType).toBeA(GraphQLList)
    expect(edgeType.ofType.name).toEqual('PersonEdge')
    expect(edgeType.ofType.getFields().cursor.type).toBeA(GraphQLNonNull)
    expect(edgeType.ofType.getFields().cursor.type.ofType.name).toEqual('Cursor')
    expect(edgeType.ofType.getFields().node.type.name).toEqual('Person')
  })

  it.skip('implements a connection interface')

  it.skip('does not allow `first` and `last` together', async () => {
    const personList = await testCreateTableListField('person')

    try {
      await personList.resolve({}, { first: 2, last: 5 })
      throw new Error('Error not thrown!')
    }
    catch (error) {
      if (!/cannot define both a/i.test(error.message))
        throw error
    }
  })

  it.skip('will get the correct `hasNextPage` and `hasPreviousPage`', async () => {
    const personList = await testCreateTableListField('person')

    const expectPageInfo = async (pageInfo, hasNextPage, hasPreviousPage) => {
      expect(await pageInfo.hasNextPage).toEqual(hasNextPage)
      expect(await pageInfo.hasPreviousPage).toEqual(hasPreviousPage)
    }

    await Promise.all([
      expectPageInfo(personList.resolve({}, { orderBy: 'id' }), false, false),
      expectPageInfo(personList.resolve({}, { orderBy: 'id', first: 2 }), true, false),
      expectPageInfo(personList.resolve({}, { orderBy: 'id', first: 3 }), true, false),
      expectPageInfo(personList.resolve({}, { orderBy: 'id', first: 4 }), false, false),
      expectPageInfo(personList.resolve({}, { orderBy: 'id', offset: 1 }), false, true),
      expectPageInfo(personList.resolve({}, { orderBy: 'id', offset: 2 }), false, true),
      expectPageInfo(personList.resolve({}, { orderBy: 'id', offset: 50 }), false, false),
      expectPageInfo(personList.resolve({}, { orderBy: 'id', first: 1, offset: 1 }), true, true),
      expectPageInfo(personList.resolve({}, { orderBy: 'id', first: 2, offset: 3 }), false, true),
      expectPageInfo(personList.resolve({}, { orderBy: 'id', first: 2, offset: 2 }), false, true),
      expectPageInfo(personList.resolve({}, { orderBy: 'id', first: 1, offset: 2 }), true, true),
      expectPageInfo(personList.resolve({}, { orderBy: 'id', after: '2' }), false, true),
      expectPageInfo(personList.resolve({}, { orderBy: 'id', after: '50' }), false, false),
      expectPageInfo(personList.resolve({}, { orderBy: 'id', after: '50', before: '60' }), false, false),
      expectPageInfo(personList.resolve({}, { orderBy: 'id', after: '1', before: '3' }), true, true),
      expectPageInfo(personList.resolve({}, { orderBy: 'id', after: '1', first: 2 }), true, true),
      expectPageInfo(personList.resolve({}, { orderBy: 'id', after: '1', first: 4 }), false, true),
      expectPageInfo(personList.resolve({}, { orderBy: 'id', before: '1' }), false, false),
      expectPageInfo(personList.resolve({}, { orderBy: 'id', before: '3' }), true, false),
      expectPageInfo(personList.resolve({}, { orderBy: 'id', before: '4' }), true, false),
      expectPageInfo(personList.resolve({}, { orderBy: 'id', before: '5' }), false, false),
      expectPageInfo(personList.resolve({}, { orderBy: 'id', before: '5', last: 2 }), false, true),
      expectPageInfo(personList.resolve({}, { orderBy: 'id', before: '4', last: 2 }), true, true),
      expectPageInfo(personList.resolve({}, { orderBy: 'id', before: '4', first: 2 }), true, false),
    ])
  })

  it.skip('will get the correct `totalLength`', async () => {
    const personList = await testCreateTableListField('person')
    expect(await personList.resolve({}, {}).totalCount).toEqual(4)
  })

  it.skip('will get the correct `list`', async () => {
    const personList = await testCreateTableListField('person')
    assert.deepEqual(await personList.resolve({}, { orderBy: 'id' }).list, [{ id: 1, name: 'Jane' }, { id: 2, name: 'Jim' }, { id: 3, name: 'Bob' }, { id: 4, name: 'Betsy' }])
    assert.deepEqual(await personList.resolve({}, { orderBy: 'id', first: 1 }).list, [{ id: 1, name: 'Jane' }])
    assert.deepEqual(await personList.resolve({}, { orderBy: 'id', first: 1, offset: 1 }).list, [{ id: 2, name: 'Jim' }])
  })

  it.skip('will correctly order with `orderBy` and `descending`', async () => {
    const personList = await testCreateTableListField('person')
    assert.deepEqual(await personList.resolve({}, { orderBy: 'name' }).list, [{ id: 4, name: 'Betsy' }, { id: 3, name: 'Bob' }, { id: 1, name: 'Jane' }, { id: 2, name: 'Jim' }])
    assert.deepEqual(await personList.resolve({}, { orderBy: 'name', descending: true }).list, [{ id: 4, name: 'Betsy' }, { id: 3, name: 'Bob' }, { id: 1, name: 'Jane' }, { id: 2, name: 'Jim' }].reverse())
    assert.deepEqual(await personList.resolve({}, { orderBy: 'name', descending: true, first: 2 }).list, [{ id: 2, name: 'Jim' }, { id: 1, name: 'Jane' }])
  })
})

// before(setupDatabase(`
// drop schema if exists create_table_list_field cascade;
//
// create schema create_table_list_field;
//
// set search_path = 'create_table_list_field';
//
// create table camel_case_me (noop int);
//
// create table person (
//   id serial primary key,
//   name varchar not null
// );
//
// insert into person (id, name) values
//   (1, 'Jane'),
//   (2, 'Jim'),
//   (3, 'Bob'),
//   (4, 'Betsy');
// `))
