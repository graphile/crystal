import expect from 'expect'
import { GraphQLNonNull, GraphQLInputObjectType, GraphQLScalarType, GraphQLString } from 'graphql'
import { TestTable, TestColumn } from '../../helpers.js'
import createInsertMutationField from '#/graphql/mutation/createInsertMutationField.js'

describe('createInsertMutationField', () => {
  it('returns field with single argument', () => {
    const field = createInsertMutationField(new TestTable())
    expect(field.args.input.type).toBeA(GraphQLNonNull)
    expect(field.args.input.type.ofType).toBeA(GraphQLInputObjectType)
    expect(field.args.input.type.ofType.name).toEqual('InsertTestInput')
    expect(field.args.input.type.ofType.getFields()).toIncludeKeys(['test'])
  })

  it('will have a `clientMutationId` field in input', () => {
    const field = createInsertMutationField(new TestTable())
    expect(field.args.input.type.ofType.getFields().clientMutationId.type).toBe(GraphQLString)
  })

  it('will make nullable columns with a default', () => {
    const table = new TestTable();

    ([
      new TestColumn({ table, name: 'id_1', isPrimaryKey: true, isNullable: false, hasDefault: true }),
      new TestColumn({ table, name: 'given_name', isNullable: false }),
      new TestColumn({ table, name: 'family_name' }),
      new TestColumn({ table, name: 'points', hasDefault: true }),
      new TestColumn({ table, name: 'status', isNullable: false, hasDefault: true }),
    ])
    .forEach(column => table.schema.catalog.addColumn(column))

    table.schema.catalog._columns.delete('test.test.test')

    const field = createInsertMutationField(table)
    const inputFields = field.args.input.type.ofType.getFields()
    expect(inputFields).toIncludeKeys(['id1', 'givenName', 'familyName', 'points', 'status'])
    expect(inputFields.id1.type).toBeA(GraphQLScalarType)
    expect(inputFields.givenName.type).toBeA(GraphQLNonNull)
    expect(inputFields.givenName.type.ofType).toBeA(GraphQLScalarType)
    expect(inputFields.familyName.type).toBeA(GraphQLScalarType)
    expect(inputFields.points.type).toBeA(GraphQLScalarType)
    expect(inputFields.status.type).toBeA(GraphQLScalarType)
  })
})
