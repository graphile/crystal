import expect from 'expect'
import { TestSchema, TestTable, TestProcedure, TestType } from '../../helpers.js'
import createMutationType from '#/graphql/mutation/createMutationType.js'

describe('createMutationType', () => {
  it('generates mutations for ordinary tables only', () => {
    const schema = new TestSchema()
    schema.catalog.addTable(new TestTable({ name: 'my_custom_type', kind: 'c', schema }))
    schema.catalog.addTable(new TestTable({ name: 'my_view', kind: 'v', schema }))
    const mutationType = createMutationType(schema)
    expect(mutationType._typeConfig.fields.insertTest).toExist()
    expect(mutationType._typeConfig.fields.insertMyCustomType).toNotExist()
    expect(mutationType._typeConfig.fields.insertMyView).toNotExist()
  })

  it('includes volatile procedures that have a table type as their first argument as a mutation', () => {
    const schema = new TestSchema()

    schema.catalog.addProcedure(new TestProcedure({
      name: 'volatile_table_type_proc',
      isMutation: true,
      schema,
      args: new Map([
        ['a', new TestType(123, new TestTable())],
      ]),
    }))

    schema.catalog.addProcedure(new TestProcedure({
      name: 'volatile_scalar_type_proc',
      isMutation: true,
      schema,
      args: new Map([
        ['a', new TestType()],
      ]),
    }))

    schema.catalog.addProcedure(new TestProcedure({
      name: 'strict_table_type_proc',
      isMutation: false,
      isStrict: true,
      schema,
      args: new Map([
        ['a', new TestType(123, new TestTable())],
      ]),
    }))

    const mutationType = createMutationType(schema)
    expect(mutationType._typeConfig.fields.volatileTableTypeProc).toExist()
    expect(mutationType._typeConfig.fields.volatileScalarTypeProc).toExist()
    expect(mutationType._typeConfig.fields.strictTableTypeProc).toNotExist()
  })
})
