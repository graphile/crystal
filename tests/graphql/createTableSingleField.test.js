import expect from 'expect'
import { keys } from 'lodash'
import { GraphQLObjectType, GraphQLNonNull } from 'graphql'
import { TestTable, TestColumn } from '../helpers.js'
import createTableSingleField from '../../src/graphql/createTableSingleField.js'

describe('graphql/createTableSingleField', () => {
  it('is an object type', async () => {
    const person = createTableSingleField(new TestTable({ name: 'person' }))
    expect(person.type).toBeA(GraphQLObjectType)
    expect(person.type.name).toEqual('Person')
  })

  it('has args for every primary key column', () => {
    const person = createTableSingleField(
      new TestTable({
        name: 'person',
        columns: [
          new TestColumn({ name: 'id', isPrimaryKey: true }),
          new TestColumn({ name: 'given_name' }),
          new TestColumn({ name: 'family_name' }),
        ],
      })
    )

    const compoundKey = createTableSingleField(
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
    const person = createTableSingleField(
      new TestTable({
        name: 'person',
        columns: [
          new TestColumn({ name: 'id', description: 'The person’s id', isPrimaryKey: true }),
        ],
      })
    )
    expect(person.args.id.description).toEqual('The person’s id')
  })

  it.skip('will resolve to a single row', async () => {
    /* eslint-disable camelcase */
    const person = await createTableSingleField('person')
    const compoundKey = await createTableSingleField('compound_key')
    expect(await person.resolve({}, { id: 1 })).toInclude({ id: 1, name: 'Jim' })
    expect(await person.resolve({}, { id: 4 })).toInclude({ id: 4, name: 'Betsy' })
    expect(await compoundKey.resolve({}, { personId1: 1, personId2: 2, personId3: 3 }))
    .toInclude({ person_id_1: 1, person_id_2: 2, person_id_3: 3, extra: 'bar' })
    expect(await compoundKey.resolve({}, { personId1: 2, personId2: 1, personId3: 3 }))
    .toInclude({ person_id_1: 2, person_id_2: 1, person_id_3: 3, extra: 'foo' })
    /* eslint-enable camelcase */
  })
})
