import expect from 'expect'
import { GraphQLNonNull } from 'graphql'
import { TestColumn } from '../helpers.js'
import getColumnType from '#/graphql/getColumnType.js'

describe('getColumnType', () => {
  it('correctly formats non null types', () => {
    expect(getColumnType(new TestColumn({ isNullable: false }))).toBeA(GraphQLNonNull)
    expect(getColumnType(new TestColumn({ isNullable: true }))).toNotBeA(GraphQLNonNull)
  })
})
