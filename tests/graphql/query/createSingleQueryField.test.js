import expect from 'expect'
import { keys } from 'lodash'
import { GraphQLObjectType, GraphQLNonNull } from 'graphql'
import { TestTable, TestColumn } from '../../helpers.js'
import createSingleQueryField from '#/graphql/query/createSingleQueryField.js'

describe('createSingleQueryField', () => {
  it('is an object type', async () => {
    const person = createSingleQueryField(new TestTable({ name: 'person' }))
    expect(person.type).toBeA(GraphQLObjectType)
    expect(person.type.name).toEqual('Person')
  })

  it('has args for every primary key column', () => {
    const person = createSingleQueryField(
      new TestTable({
        name: 'person',
        columns: [
          new TestColumn({ name: 'id', isPrimaryKey: true }),
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
    expect(keys(compoundKey.args)).toEqual(['id2', 'id1', 'id3'])
    expect(compoundKey.args.id2.type).toBeA(GraphQLNonNull)
    expect(compoundKey.args.id1.type).toBeA(GraphQLNonNull)
    expect(compoundKey.args.id3.type).toBeA(GraphQLNonNull)
  })

  it('will use the column comment for arg description', () => {
    const person = createSingleQueryField(
      new TestTable({
        name: 'person',
        columns: [
          new TestColumn({ name: 'id', description: 'The person’s id', isPrimaryKey: true }),
        ],
      })
    )
    expect(person.args.id.description).toEqual('The person’s id')
  })
})
