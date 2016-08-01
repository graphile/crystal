import test from 'ava'
import * as sql from '../../utils/sql'
import conditionToSQL from '../conditionToSQL'

test('will correctly output true and false constants', t => {
  t.deepEqual(conditionToSQL(true), sql.query`true`)
  t.deepEqual(conditionToSQL(false), sql.query`false`)
})

test('will output the not condition', t => {
  t.deepEqual(conditionToSQL({ type: 'NOT', condition: true }), sql.query`not(${conditionToSQL(true)})`)
  t.deepEqual(
    conditionToSQL({ type: 'NOT', condition: { type: 'NOT', condition: false } }),
    sql.query`not(${sql.query`not(${conditionToSQL(false)})`})`
  )
})

test('will join multiple conditions with and', t => {
  t.deepEqual(
    conditionToSQL({ type: 'AND', conditions: [true, false, true] }),
    sql.query`(${conditionToSQL(true)} and ${conditionToSQL(false)} and ${conditionToSQL(true)})`,
  )
})

test('will join multiple conditions with or', t => {
  t.deepEqual(
    conditionToSQL({ type: 'OR', conditions: [false, true, false] }),
    sql.query`(${conditionToSQL(false)} or ${conditionToSQL(true)} or ${conditionToSQL(false)})`,
  )
})

test('will check equality', t => {
  const value = Symbol('value')
  t.deepEqual(
    conditionToSQL({ type: 'EQUAL', value }),
    sql.query`(${sql.identifier()} = ${sql.value(value)})`,
  )
  t.deepEqual(
    conditionToSQL({ type: 'EQUAL', value }, ['a', 'b', 'c']),
    sql.query`(${sql.identifier('a', 'b', 'c')} = ${sql.value(value)})`,
  )
})

test('will check less than', t => {
  const value = Symbol('value')
  t.deepEqual(
    conditionToSQL({ type: 'LESS_THAN', value }),
    sql.query`(${sql.identifier()} < ${sql.value(value)})`,
  )
  t.deepEqual(
    conditionToSQL({ type: 'LESS_THAN', value }, ['a', 'b', 'c']),
    sql.query`(${sql.identifier('a', 'b', 'c')} < ${sql.value(value)})`,
  )
})

test('will check greater than', t => {
  const value = Symbol('value')
  t.deepEqual(
    conditionToSQL({ type: 'GREATER_THAN', value }),
    sql.query`(${sql.identifier()} > ${sql.value(value)})`,
  )
  t.deepEqual(
    conditionToSQL({ type: 'GREATER_THAN', value }, ['a', 'b', 'c']),
    sql.query`(${sql.identifier('a', 'b', 'c')} > ${sql.value(value)})`,
  )
})

test('will test for regular expressions', t => {
  const regexp = /./g
  t.deepEqual(
    conditionToSQL({ type: 'REGEXP', regexp }),
    sql.query`regexp_matches(${sql.identifier()}, ${sql.value('.')}, ${sql.value('g')})`
  )
  t.deepEqual(
    conditionToSQL({ type: 'REGEXP', regexp }, ['a', 'b', 'c']),
    sql.query`regexp_matches(${sql.identifier('a', 'b', 'c')}, ${sql.value('.')}, ${sql.value('g')})`
  )
})

test('will set the path for child conditions with the field condition', t => {
  const value = Symbol('value')
  t.deepEqual(
    conditionToSQL({ type: 'FIELD', name: 'a', condition: { type: 'EQUAL', value } }),
    conditionToSQL({ type: 'EQUAL', value }, ['a'])
  )
  t.deepEqual(
    conditionToSQL({ type: 'FIELD', name: 'd', condition: { type: 'EQUAL', value } }, ['a', 'b', 'c']),
    conditionToSQL({ type: 'EQUAL', value }, ['a', 'b', 'c', 'd'])
  )
})

test('integration test', t => {
  const condition = {
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
  t.deepEqual(sql.compile(conditionToSQL(condition))(), {
    name: undefined,
    text: '(true and not(false) and ("a" = $1) and ("a"."b" < $2) and not((("c" > $3) or ("c" = $4))))',
    values: [42, 45, 5, 5],
  })
})
