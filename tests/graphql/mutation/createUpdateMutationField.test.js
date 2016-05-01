import expect from 'expect'
import { keys } from 'lodash'
import { GraphQLNonNull, GraphQLInputObjectType, GraphQLScalarType, GraphQLString } from 'graphql'
import { TestTable, TestColumn } from '../../helpers.js'
import createUpdateMutationField from '#/graphql/mutation/createUpdateMutationField.js'

describe('createUpdateMutationField', () => {
  it('returns a field with a single argument', () => {
    const field = createUpdateMutationField(new TestTable())
    expect(field.args.input.type).toBeA(GraphQLNonNull)
    expect(field.args.input.type.ofType).toBeA(GraphQLInputObjectType)
    expect(field.args.input.type.ofType.name).toEqual('UpdateTestInput')
    expect(field.args.input.type.ofType.getFields()).toIncludeKeys(['test', 'newTest'])
  })

  it('will have a `clientMutationId` field in input', () => {
    const field = createUpdateMutationField(new TestTable())
    expect(field.args.input.type.ofType.getFields().clientMutationId.type).toBe(GraphQLString)
  })

  it('will require primary keys and maybe allow the rest', () => {
    const table = new TestTable();

    ([
      new TestColumn({ table, name: 'id_1', isPrimaryKey: true, isNullable: false }),
      new TestColumn({ table, name: 'id_2', isPrimaryKey: true }),
      new TestColumn({ table, name: 'given_name', isNullable: false }),
      new TestColumn({ table, name: 'family_name' }),
    ])
    .forEach(column => table.schema.catalog.addColumn(column))

    table.schema.catalog._columns.delete('test.test.test')

    const field = createUpdateMutationField(table)
    const inputFields = field.args.input.type.ofType.getFields()
    expect(keys(inputFields))
    .toEqual(['id1', 'id2', 'newId1', 'newId2', 'newGivenName', 'newFamilyName', 'clientMutationId'])
    expect(inputFields.id1.type).toBeA(GraphQLNonNull)
    expect(inputFields.id1.type.ofType).toBeA(GraphQLScalarType)
    expect(inputFields.id2.type).toBeA(GraphQLNonNull)
    expect(inputFields.id2.type.ofType).toBeA(GraphQLScalarType)
    expect(inputFields.newId1.type).toBeA(GraphQLScalarType)
    expect(inputFields.newId2.type).toBeA(GraphQLScalarType)
    expect(inputFields.newGivenName.type).toBeA(GraphQLScalarType)
    expect(inputFields.newFamilyName.type).toBeA(GraphQLScalarType)
  })
})
