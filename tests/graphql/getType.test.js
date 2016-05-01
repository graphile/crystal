import expect from 'expect'
import { assign, noop } from 'lodash'
import { GraphQLEnumType } from 'graphql'
import { TestType, TestEnum } from '../helpers.js'
import getType from '#/graphql/getType.js'

describe('getType', () => {
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
    .forEach(([id, name]) => {
      expect(getType(new TestType(id)).name).toEqual(name)
    })
  })

  it('will correctly detect arrays')

  it('memoizes results', () => {
    const type1 = new TestType(20)
    const type2 = new TestType(23)
    const graphqlType1a = getType(type1)
    const graphqlType2a = getType(type2)
    const graphqlType2b = getType(type2)
    const graphqlType1b = getType(type1)
    expect(graphqlType1a).toBe(graphqlType1b)
    expect(graphqlType2a).toBe(graphqlType2b)
    expect(graphqlType1a).toNotBe(graphqlType2a)
  })

  // TODO: Move this to a `getType` test file.
  describe('enums', () => {
    const enum_ = new TestEnum({
      name: 'test_enum',
      variants: [
        'red',
        'green',
        'blue',
        'purple',
        'tomato',
        'hello_world',
      ],
    })

    const getEnum = () => getType(enum_)

    it('will make a custom enum type', () => {
      const enumType = getEnum()
      expect(enumType).toBeA(GraphQLEnumType)
    })

    it('will pascal case name', () => {
      const enumType = getEnum()
      expect(enumType.name).toEqual('TestEnum')
    })

    it('will return same reference for enum with same name', () => {
      const enumFirst = getEnum()
      const enumSecond = getEnum()
      expect(enumFirst).toBe(enumSecond)
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
  })
})
