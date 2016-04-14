import expect from 'expect'
import { TestTable } from './helpers'
import { createTableFields } from '../src/graphql/table'

describe('createTableFields', () => {
  it('creates single field and list field', () => {
    const fields = createTableFields(new TestTable({ name: 'person' }))
    expect(fields).toIncludeKeys(['person', 'personList'])
    expect(fields.person.type.name).toEqual('Person')
    expect(fields.personList.type.name).toEqual('PersonConnection')
  })

  it('camel cases table names in table fields', async () => {
    const fields = createTableFields(new TestTable({ name: 'camel_case_me' }))
    expect(fields).toExcludeKey('camel_case_me')
    expect(fields).toIncludeKeys(['camelCaseMe', 'camelCaseMeList'])
  })
})
