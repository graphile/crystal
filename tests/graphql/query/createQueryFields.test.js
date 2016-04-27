import expect from 'expect'
import { TestTable, TestColumn } from '../../helpers.js'
import createQueryFields from '#/graphql/query/createQueryFields.js'

describe('createQueryFields', () => {
  it('will have a single and a nodes field for nodes', () => {
    expect(createQueryFields(new TestTable())).toIncludeKeys(['test', 'testNodes'])
  })

  it('will not have a single field for non-nodes', () => {
    expect(createQueryFields(new TestTable({ columns: [new TestColumn()] }))).toIncludeKeys(['testNodes'])
  })
})
