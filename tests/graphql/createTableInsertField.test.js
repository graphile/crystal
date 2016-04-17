import expect from 'expect'
import { GraphQLNonNull, GraphQLInputObjectType, GraphQLScalarType } from 'graphql'
import { TestTable, TestColumn } from '../helpers.js'
import createTableInsertField from '#/graphql/createTableInsertField.js'

describe('createTableInsertField', () => {
  it('returns field with single argument', () => {
    const field = createTableInsertField(new TestTable())
    expect(field.args.test.type).toBeA(GraphQLNonNull)
    expect(field.args.test.type.ofType).toBeA(GraphQLInputObjectType)
    expect(field.args.test.type.ofType.name).toEqual('TestInput')
    expect(field.args.test.type.ofType.getFields()).toIncludeKeys(['test'])
  })

  it('will make nullable columns with a default', () => {
    const field = createTableInsertField(new TestTable({
      columns: [
        new TestColumn({ name: 'id', primaryKey: true, isNullable: false, hasDefault: true }),
        new TestColumn({ name: 'given_name', isNullable: false }),
        new TestColumn({ name: 'family_name' }),
        new TestColumn({ name: 'points', hasDefault: true }),
        new TestColumn({ name: 'status', isNullable: false, hasDefault: true }),
      ],
    }))
    const inputFields = field.args.test.type.ofType.getFields()
    expect(inputFields.id.type).toBeA(GraphQLScalarType)
    expect(inputFields.givenName.type).toBeA(GraphQLNonNull)
    expect(inputFields.givenName.type.ofType).toBeA(GraphQLScalarType)
    expect(inputFields.familyName.type).toBeA(GraphQLScalarType)
    expect(inputFields.points.type).toBeA(GraphQLScalarType)
    expect(inputFields.status.type).toBeA(GraphQLScalarType)
  })
})
