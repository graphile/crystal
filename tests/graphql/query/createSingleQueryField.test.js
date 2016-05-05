import expect from 'expect'
import { keys } from 'lodash'
import { GraphQLObjectType, GraphQLNonNull, GraphQLID } from 'graphql'
import { TestTable, TestColumn } from '../../helpers.js'
import createSingleQueryField from '#/graphql/query/createSingleQueryField.js'

describe('createSingleQueryField', () => {
  it('is an object type', async () => {
    const person = createSingleQueryField(new TestTable({ name: 'person' }))
    expect(person.type).toBeA(GraphQLObjectType)
    expect(person.type.name).toEqual('Person')
  })

  it('has args for only the node `id`', () => {
    const person = createSingleQueryField(
      new TestTable({
        name: 'person',
        columns: [
          new TestColumn({ name: 'id_1', isPrimaryKey: true }),
          new TestColumn({ name: 'given_name' }),
          new TestColumn({ name: 'family_name' }),
        ],
      })
    )

    const compoundKey = createSingleQueryField(
      new TestTable({
        name: 'compound_key',
        columns: [
          new TestColumn({ name: 'id_2', isPrimaryKey: true }),
          new TestColumn({ name: 'id_1', isPrimaryKey: true }),
          new TestColumn({ name: 'id_3', isPrimaryKey: true }),
          new TestColumn({ name: 'other_1' }),
          new TestColumn({ name: 'other_2' }),
        ],
      })
    )

    expect(keys(person.args)).toEqual(['id'])
    expect(person.args.id.type).toBeA(GraphQLNonNull)
    expect(person.args.id.type.ofType).toBe(GraphQLID)
    expect(keys(compoundKey.args)).toEqual(['id'])
    expect(compoundKey.args.id.type).toBeA(GraphQLNonNull)
    expect(compoundKey.args.id.type.ofType).toBe(GraphQLID)
  })

  it('it will return null for tables without primary keys', () => {
    expect(createSingleQueryField(new TestTable({ columns: [new TestColumn()] }))).toNotExist()
  })
})
