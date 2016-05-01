import expect from 'expect'
import { keys } from 'lodash'
import { GraphQLNonNull, GraphQLInputObjectType, GraphQLScalarType, GraphQLString } from 'graphql'
import { TestTable, TestColumn } from '../../helpers.js'
import createDeleteMutationField from '#/graphql/mutation/createDeleteMutationField.js'

describe('createDeleteMutationField', () => {
  it('returns field with single argument', () => {
    const field = createDeleteMutationField(new TestTable())
    expect(field.args.input.type).toBeA(GraphQLNonNull)
    expect(field.args.input.type.ofType).toBeA(GraphQLInputObjectType)
    expect(field.args.input.type.ofType.name).toEqual('DeleteTestInput')
    expect(field.args.input.type.ofType.getFields()).toIncludeKeys(['test'])
  })

  it('will have a `clientMutationId` field in input', () => {
    const field = createDeleteMutationField(new TestTable())
    expect(field.args.input.type.ofType.getFields().clientMutationId.type).toBe(GraphQLString)
  })

  it('will require primary keys', () => {
    const table = new TestTable();

    ([
      new TestColumn({ table, name: 'id_1', isPrimaryKey: true, isNullable: false }),
      new TestColumn({ table, name: 'id_2', isPrimaryKey: true }),
      new TestColumn({ table, name: 'given_name', isNullable: false }),
      new TestColumn({ table, name: 'family_name' }),
    ])
    .forEach(column => table.schema.catalog.addColumn(column))

    table.schema.catalog._columns.delete('test.test.test')

    const field = createDeleteMutationField(table)
    const inputFields = field.args.input.type.ofType.getFields()
    expect(keys(inputFields)).toEqual(['id1', 'id2', 'clientMutationId'])
    expect(inputFields.id1.type).toBeA(GraphQLNonNull)
    expect(inputFields.id1.type.ofType).toBeA(GraphQLScalarType)
    expect(inputFields.id2.type).toBeA(GraphQLNonNull)
    expect(inputFields.id2.type.ofType).toBeA(GraphQLScalarType)
  })
})
