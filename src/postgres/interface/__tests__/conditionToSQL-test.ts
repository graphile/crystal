import { Condition } from '../../../interface'
import sql from '../../utils/sql'
import conditionToSQL from '../conditionToSQL'

test('will correctly output true and false constants', () => {
  expect(conditionToSQL(true)).toEqual(sql.query`true`)
  expect(conditionToSQL(false)).toEqual(sql.query`false`)
})

test('will output the not condition', () => {
  expect(conditionToSQL({ type: 'NOT', condition: true }))
    .toEqual(sql.query`not(${conditionToSQL(true)})`)
  expect(conditionToSQL({ type: 'NOT', condition: { type: 'NOT', condition: false } }))
    .toEqual(sql.query`not(${sql.query`not(${conditionToSQL(false)})`})`)
})

test('will join multiple conditions with and', () => {
  expect(conditionToSQL({ type: 'AND', conditions: [true, false, true] }))
    .toEqual(sql.query`(${conditionToSQL(true)} and ${conditionToSQL(false)} and ${conditionToSQL(true)})`)
})

test('will join multiple conditions with or', () => {
  expect(conditionToSQL({ type: 'OR', conditions: [false, true, false] }))
    .toEqual(sql.query`(${conditionToSQL(false)} or ${conditionToSQL(true)} or ${conditionToSQL(false)})`)
})

test('will check equality', () => {
  const value = Symbol('value')
  expect(conditionToSQL({ type: 'EQUAL', value }))
    .toEqual(sql.query`(${sql.identifier()} = ${sql.value(value)})`)
  expect(conditionToSQL({ type: 'EQUAL', value }, ['a', 'b', 'c']))
    .toEqual(sql.query`(${sql.identifier('a', 'b', 'c')} = ${sql.value(value)})`)
})

test('will check less than', () => {
  const value = Symbol('value')
  expect(conditionToSQL({ type: 'LESS_THAN', value }))
    .toEqual(sql.query`(${sql.identifier()} < ${sql.value(value)})`)
  expect(conditionToSQL({ type: 'LESS_THAN', value }, ['a', 'b', 'c']))
    .toEqual(sql.query`(${sql.identifier('a', 'b', 'c')} < ${sql.value(value)})`)
})

test('will check greater than', () => {
  const value = Symbol('value')
  expect(conditionToSQL({ type: 'GREATER_THAN', value }))
    .toEqual(sql.query`(${sql.identifier()} > ${sql.value(value)})`)
  expect(conditionToSQL({ type: 'GREATER_THAN', value }, ['a', 'b', 'c']))
    .toEqual(sql.query`(${sql.identifier('a', 'b', 'c')} > ${sql.value(value)})`)
})

test('will test for regular expressions', () => {
  const regexp = /./g
  expect(conditionToSQL({ type: 'REGEXP', regexp }))
    .toEqual(sql.query`regexp_matches(${sql.identifier()}, ${sql.value('.')}, ${sql.value('g')})`)
  expect(conditionToSQL({ type: 'REGEXP', regexp }, ['a', 'b', 'c']))
    .toEqual(sql.query`regexp_matches(${sql.identifier('a', 'b', 'c')}, ${sql.value('.')}, ${sql.value('g')})`)
})

test('will set the path for child conditions with the field condition', () => {
  const value = Symbol('value')
  expect(conditionToSQL({ type: 'FIELD', name: 'a', condition: { type: 'EQUAL', value } }))
    .toEqual(conditionToSQL({ type: 'EQUAL', value }, ['a']))
  expect(conditionToSQL({ type: 'FIELD', name: 'd', condition: { type: 'EQUAL', value } }, ['a', 'b', 'c']))
    .toEqual(conditionToSQL({ type: 'EQUAL', value }, ['a', 'b', 'c', 'd']))
})

test('integration test 1', () => {
  const condition: Condition = {
    type: 'AND',
    conditions: [
      true,
      { type: 'NOT', condition: false },
      { type: 'FIELD', name: 'a', condition: { type: 'EQUAL', value: 42 } },
      { type: 'FIELD', name: 'a', condition: { type: 'FIELD', name: 'b', condition: { type: 'LESS_THAN', value: 45 } } },
      {
        type: 'FIELD',
        name: 'c',
        condition: {
          type: 'NOT',
          condition: {
            type: 'OR',
            conditions: [
              { type: 'GREATER_THAN', value: 5 },
              { type: 'EQUAL', value: 5 },
            ],
          },
        },
      },
    ],
  }
  expect(sql.compile(conditionToSQL(condition))()).toEqual({
    name: undefined,
    text: '(true and not(false) and ("a" = $1) and ("a"."b" < $2) and not((("c" > $3) or ("c" = $4))))',
    values: [42, 45, 5, 5],
  })
})
