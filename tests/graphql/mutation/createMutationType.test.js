import expect from 'expect'
import { TestSchema, TestTable } from '../../helpers.js'
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
})
