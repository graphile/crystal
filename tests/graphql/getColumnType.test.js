import expect from 'expect'
import { assign, noop } from 'lodash'
import { GraphQLNonNull, GraphQLEnumType } from 'graphql'
import { TestColumn, TestEnum } from '../helpers.js'
import getColumnType from '../../src/graphql/getColumnType.js'

describe('graphql/getColumnType', () => {
  it('will get the correct GraphQL types', () => {
    ([
      [20, 'BigInt'],
      [23, 'Int'],
      [21, 'Int'],
      [16, 'Boolean'],
      [18, 'String'],
      [1043, 'String'],
      [718, 'Circle'],
      [1082, 'Date'],
      [701, 'Float'],
      [700, 'Float'],
      [1186, 'Interval'],
      [114, 'JSON'],
      [3802, 'JSON'],
      [600, 'Point'],
      [25, 'String'],
      [1083, 'String'],
      [1114, 'Date'],
      [2950, 'UUID'],
    ])
    .forEach(([type, name]) => {
      expect(getColumnType(new TestColumn({ type })).name).toEqual(name)
    })
  })

  it('correctly formats non null types', () => {
    const columnNotNull = new TestColumn({ type: 23, isNullable: false })
    const columnNull = new TestColumn({ type: 23, isNullable: true })
    const typeNotNull = getColumnType(columnNotNull)
    const typeNull = getColumnType(columnNull)
    expect(typeNotNull).toBeA(GraphQLNonNull)
    expect(typeNotNull.ofType.name).toEqual('Int')
    expect(typeNull.name).toEqual('Int')
  })

  it('will correctly detect arrays')

  describe('enums', () => {
    const getEnum = config => getColumnType(
      new TestColumn({
        name: 'test_column',
        ...config,
        enum_: new TestEnum({
          name: 'test_enum',
          variants: [
            'red',
            'green',
            'blue',
            'purple',
            'tomato',
            'hello_world',
          ],
        }),
      })
    )

    it('will make a custom enum type', () => {
      const enumType = getEnum()
      expect(enumType).toBeA(GraphQLEnumType)
    })

    it('will pascal case name', () => {
      const enumType = getEnum()
      expect(enumType.name).toEqual('TestEnum')
    })

    it('will correctly format variants', () => {
      const enumType = getEnum()
      expect(enumType.getValues()).toEqual([
        { name: 'RED', value: 'red' },
        { name: 'GREEN', value: 'green' },
        { name: 'BLUE', value: 'blue' },
        { name: 'PURPLE', value: 'purple' },
        { name: 'TOMATO', value: 'tomato' },
        { name: 'HELLO_WORLD', value: 'hello_world' },
      ].map(variant => assign(variant, { description: noop(), deprecationReason: noop() })))
    })

    it('will detect not null enums', () => {
      const enumType = getEnum({ isNullable: false })
      expect(enumType).toBeA(GraphQLNonNull)
      expect(enumType.ofType).toBeA(GraphQLEnumType)
      expect(enumType.ofType.name).toEqual('TestEnum')
    })
  })
})
