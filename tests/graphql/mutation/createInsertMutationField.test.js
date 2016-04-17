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
    const field = createInsertMutationField(new TestTable({
      columns: [
        new TestColumn({ name: 'id', isPrimaryKey: true, isNullable: false, hasDefault: true }),
        new TestColumn({ name: 'given_name', isNullable: false }),
        new TestColumn({ name: 'family_name' }),
        new TestColumn({ name: 'points', hasDefault: true }),
        new TestColumn({ name: 'status', isNullable: false, hasDefault: true }),
      ],
    }))
    const inputFields = field.args.input.type.ofType.getFields()
    expect(inputFields.id.type).toBeA(GraphQLScalarType)
    expect(inputFields.givenName.type).toBeA(GraphQLNonNull)
    expect(inputFields.givenName.type.ofType).toBeA(GraphQLScalarType)
    expect(inputFields.familyName.type).toBeA(GraphQLScalarType)
    expect(inputFields.points.type).toBeA(GraphQLScalarType)
    expect(inputFields.status.type).toBeA(GraphQLScalarType)
  })
})
