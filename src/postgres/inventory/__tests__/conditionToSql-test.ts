import { Condition } from '../../../interface'
import sql from '../../utils/sql'
import conditionToSql from '../conditionToSql'

test('will correctly output true and false constants', () => {
  expect(conditionToSql(true)).toEqual(sql.query`true`)
  expect(conditionToSql(false)).toEqual(sql.query`false`)
})

test('will output the not condition', () => {
  expect(conditionToSql({ type: 'NOT', condition: true }))
    .toEqual(sql.query`not(${conditionToSql(true)})`)
  expect(conditionToSql({ type: 'NOT', condition: { type: 'NOT', condition: false } }))
    .toEqual(sql.query`not(${sql.query`not(${conditionToSql(false)})`})`)
})

test('will join multiple conditions with and', () => {
  expect(conditionToSql({ type: 'AND', conditions: [true, false, true] }))
    .toEqual(sql.query`(${conditionToSql(true)} and ${conditionToSql(false)} and ${conditionToSql(true)})`)
})

test('will join multiple conditions with or', () => {
  expect(conditionToSql({ type: 'OR', conditions: [false, true, false] }))
    .toEqual(sql.query`(${conditionToSql(false)} or ${conditionToSql(true)} or ${conditionToSql(false)})`)
})

test('will check equality', () => {
  const value = Symbol('value')
  expect(conditionToSql({ type: 'EQUAL', value }))
    .toEqual(sql.query`(${sql.identifier()} = ${sql.value(value)})`)
  expect(conditionToSql({ type: 'EQUAL', value }, ['a', 'b', 'c']))
    .toEqual(sql.query`(${sql.identifier('a', 'b', 'c')} = ${sql.value(value)})`)
})

test('will check less than', () => {
  const value = Symbol('value')
  expect(conditionToSql({ type: 'LESS_THAN', value }))
    .toEqual(sql.query`(${sql.identifier()} < ${sql.value(value)})`)
  expect(conditionToSql({ type: 'LESS_THAN', value }, ['a', 'b', 'c']))
    .toEqual(sql.query`(${sql.identifier('a', 'b', 'c')} < ${sql.value(value)})`)
})

test('will check greater than', () => {
  const value = Symbol('value')
  expect(conditionToSql({ type: 'GREATER_THAN', value }))
    .toEqual(sql.query`(${sql.identifier()} > ${sql.value(value)})`)
  expect(conditionToSql({ type: 'GREATER_THAN', value }, ['a', 'b', 'c']))
    .toEqual(sql.query`(${sql.identifier('a', 'b', 'c')} > ${sql.value(value)})`)
})

test('will test for regular expressions', () => {
  const regexp = /./g
  expect(conditionToSql({ type: 'REGEXP', regexp }))
    .toEqual(sql.query`regexp_matches(${sql.identifier()}, ${sql.value('.')}, ${sql.value('g')})`)
  expect(conditionToSql({ type: 'REGEXP', regexp }, ['a', 'b', 'c']))
    .toEqual(sql.query`regexp_matches(${sql.identifier('a', 'b', 'c')}, ${sql.value('.')}, ${sql.value('g')})`)
})

test('will set the path for child conditions with the field condition', () => {
  const value = Symbol('value')
  expect(conditionToSql({ type: 'FIELD', name: 'a', condition: { type: 'EQUAL', value } }))
    .toEqual(conditionToSql({ type: 'EQUAL', value }, ['a']))
  expect(conditionToSql({ type: 'FIELD', name: 'd', condition: { type: 'EQUAL', value } }, ['a', 'b', 'c']))
    .toEqual(conditionToSql({ type: 'EQUAL', value }, ['a', 'b', 'c', 'd']))
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
  expect(sql.compile(conditionToSql(condition))).toEqual({
    name: undefined,
    text: '(true and not(false) and ("a" = $1) and ("a"."b" < $2) and not((("c" > $3) or ("c" = $4))))',
    values: [42, 45, 5, 5],
  })
})
