import expect from 'expect'
import { TestTable, TestColumn } from '../../helpers.js'
import createTableQueryFields from '#/graphql/query/createTableQueryFields.js'

describe('createTableQueryFields', () => {
  it('will have a single and a nodes field for nodes', () => {
    expect(createTableQueryFields(new TestTable())).toIncludeKeys(['test', 'testNodes'])
  })

  it('will not have a single field for non-nodes', () => {
    expect(createTableQueryFields(new TestTable({ columns: [new TestColumn()] }))).toIncludeKeys(['testNodes'])
  })
})
