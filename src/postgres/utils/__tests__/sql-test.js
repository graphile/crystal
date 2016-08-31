import test from 'ava'
import * as sql from '../sql'

test('raw will create a raw SQL item', t => {
  const text = Symbol('text')
  t.deepEqual(sql.raw(text), { type: 'RAW', text })
})

test('identifier will create an identifier SQL item', t => {
  const name = Symbol('name')
  t.deepEqual(sql.identifier(name), { type: 'IDENTIFIER', names: [name] })
})

test('identifier will create an identifier SQL item with multiple names', t => {
  const name1 = Symbol('name1')
  const name2 = Symbol('name2')
  const name3 = Symbol('name3')
  t.deepEqual(sql.identifier(name1, name2, name3), { type: 'IDENTIFIER', names: [name1, name2, name3] })
})

test('value will create an eager SQL value', t => {
  const value = Symbol('value')
  t.deepEqual(sql.value(value), { type: 'VALUE_EAGER', value })
})

test('placeholder will create a lazy SQL value', t => {
  const name = Symbol('name')
  t.deepEqual(sql.placeholder(name), { type: 'VALUE_LAZY', name })
})

test('join will flatten singly nested arrays', t => {
  const item1 = Symbol('item1')
  const item2 = Symbol('item2')
  const item3 = Symbol('item3')
  const item4 = Symbol('item4')
  const item5 = Symbol('item5')
  t.deepEqual(sql.join([item1, [item2, item3], item4, [item5]]), [item1, item2, item3, item4, item5])
})

test('join will add raw SQL seperators if supplied a string', t => {
  const seperator = Symbol('seperator')
  const item1 = Symbol('item1')
  const item2 = Symbol('item2')
  const item3 = Symbol('item3')
  t.deepEqual(
    sql.join([item1, item2, item3], seperator),
    [item1, sql.raw(seperator), item2, sql.raw(seperator), item3],
  )
})

test('query will output raw strings', t => {
  t.deepEqual(sql.query`hello world`, [sql.raw('hello world')])
})

test('query will add items to the SQL', t => {
  const item1 = Symbol('item1')
  const item2 = Symbol('item2')
  const item3 = Symbol('item3')
  t.deepEqual(
    sql.query`hello ${item1}${item2} world ${item3}`,
    [sql.raw('hello '), item1, sql.raw(''), item2, sql.raw(' world '), item3, sql.raw('')],
  )
})

test('query will flatten arrays of items', t => {
  const item1 = Symbol('item1')
  const item2 = Symbol('item2')
  const item3 = Symbol('item3')
  t.deepEqual(sql.query`${[item1, item2, item3]}`, [sql.raw(''), item1, item2, item3, sql.raw('')])
})

test('compile will return an empty config for no items', t => {
  t.deepEqual(sql.compile([])(), {
    name: undefined,
    text: '',
    values: [],
  })
})

test('compile will turn a raw text only query into a simple config', t => {
  t.deepEqual(sql.compile([sql.raw('hello world')])(), {
    name: undefined,
    text: 'hello world',
    values: [],
  })
})

test('compile will add raw queries together', t => {
  t.deepEqual(sql.compile([sql.raw('hello'), sql.raw(' '), sql.raw('world')])(), {
    name: undefined,
    text: 'hello world',
    values: [],
  })
})

test('compile will give the query a name if specified', t => {
  const name = 'name'
  t.deepEqual(sql.compile(name, [])(), {
    name,
    text: '',
    values: [],
  })
})

test('compile will throw if a name and no SQL was given', t => {
  t.throws(() => sql.compile('name'))
})

test('compile will add identifiers as text strings', t => {
  t.deepEqual(sql.compile([sql.identifier('hello')])(), {
    name: undefined,
    text: '"hello"',
    values: [],
  })
  t.deepEqual(sql.compile([sql.identifier('a', 'b', 'c')])(), {
    name: undefined,
    text: '"a"."b"."c"',
    values: [],
  })
})

test('compile will remove double quotes in identifiers', t => {
  t.deepEqual(sql.compile([sql.identifier('yo"yo')])(), {
    name: undefined,
    text: '"yoyo"',
    values: [],
  })
})

test('compile will throw an error when identifiers are an empty array', t => {
  t.throws(() => sql.compile([sql.identifier()]))
})

test('compile will add identifiers to raw queries', t => {
  t.deepEqual(sql.compile([sql.raw('hello '), sql.identifier('a', 'b', 'c'), sql.raw(' world')])(), {
    name: undefined,
    text: 'hello "a"."b"."c" world',
    values: [],
  })
})

test('compile will add value parameters for eager values', t => {
  const value = Symbol('value')
  t.deepEqual(sql.compile([sql.value(value)])(), {
    name: undefined,
    text: '$1',
    values: [value],
  })
})

test('compile will add multiple value parameters for eager values', t => {
  const value1 = Symbol('value1')
  const value2 = Symbol('value2')
  const value3 = Symbol('value3')
  const value4 = Symbol('value4')
  t.deepEqual(sql.compile([sql.value(value1), sql.value(value2), sql.raw(' '), sql.value(value3), sql.raw(' '), sql.value(value4)])(), {
    name: undefined,
    text: '$1$2 $3 $4',
    values: [value1, value2, value3, value4],
  })
})

test('compile will add null for lazy values', t => {
  t.deepEqual(sql.compile([sql.placeholder('a')])(), {
    name: undefined,
    text: '$1',
    values: [null],
  })
  t.deepEqual(sql.compile([sql.placeholder('a')])({}), {
    name: undefined,
    text: '$1',
    values: [null],
  })
})

test('compile will replace null with value if supplied lazily', t => {
  const a = Symbol('a')
  t.deepEqual(sql.compile([sql.placeholder('a')])({ a }), {
    name: undefined,
    text: '$1',
    values: [a],
  })
})

test('compile with lazy values will work for many values', t => {
  const a = Symbol('a')
  const b = Symbol('b')
  const c = Symbol('c')
  const d = Symbol('d')
  t.deepEqual(sql.compile([sql.placeholder('a'), sql.placeholder('b'), sql.raw(' '), sql.placeholder('c'), sql.raw(' '), sql.placeholder('d')])(), {
    name: undefined,
    text: '$1$2 $3 $4',
    values: [null, null, null, null],
  })
  t.deepEqual(sql.compile([sql.placeholder('a'), sql.placeholder('b'), sql.raw(' '), sql.placeholder('c'), sql.raw(' '), sql.placeholder('d')])({ a, b, c, d }), {
    name: undefined,
    text: '$1$2 $3 $4',
    values: [a, b, c, d],
  })
})

test('compile with lazy values will work with some missing values', t => {
  const b = Symbol('b')
  const d = Symbol('d')
  t.deepEqual(sql.compile([sql.placeholder('a'), sql.placeholder('b'), sql.raw(' '), sql.placeholder('c'), sql.raw(' '), sql.placeholder('d')])({ b, d }), {
    name: undefined,
    text: '$1$2 $3 $4',
    values: [null, b, null, d],
  })
})

test('compile with lazy values will work with extraneous values', t => {
  const a = Symbol('a')
  const b = Symbol('b')
  const c = Symbol('c')
  const d = Symbol('d')
  const e = Symbol('e')
  t.deepEqual(sql.compile([sql.placeholder('a'), sql.placeholder('b'), sql.raw(' '), sql.placeholder('c'), sql.raw(' '), sql.placeholder('d')])({ a, b, c, d, e }), {
    name: undefined,
    text: '$1$2 $3 $4',
    values: [a, b, c, d],
  })
})

test('compile with lazy values will work with both extraneous and missing values', t => {
  const a = Symbol('a')
  const c = Symbol('c')
  const e = Symbol('e')
  t.deepEqual(sql.compile([sql.placeholder('a'), sql.placeholder('b'), sql.raw(' '), sql.placeholder('c'), sql.raw(' '), sql.placeholder('d')])({ a, c, e }), {
    name: undefined,
    text: '$1$2 $3 $4',
    values: [a, null, c, null],
  })
})

test('compile with lazy values and compile with eager values will work together', t => {
  const a = Symbol('a')
  const b = Symbol('b')
  const c = Symbol('c')
  t.deepEqual(sql.compile([sql.placeholder('a'), sql.value(b), sql.value(c)])({ a }), {
    name: undefined,
    text: '$1$2$3',
    values: [a, b, c],
  })
})

test('integration test', t => {
  t.deepEqual(sql.compile(sql.query`hello ${sql.value(42)} world, ${sql.placeholder('a')} and ${[sql.raw('wow'), sql.raw(' '), sql.identifier('yo')]}`)({ a: 'cowabunga' }), {
    name: undefined,
    text: 'hello $1 world, $2 and wow "yo"',
    values: [42, 'cowabunga'],
  })
})
