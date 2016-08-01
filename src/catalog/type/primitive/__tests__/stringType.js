import test from 'ava'
import NamedType from '../../NamedType'
import stringType from '../stringType'

test('is a singleton NamedType', t => {
  t.true(stringType instanceof NamedType)
})

test('getName returns string', t => {
  t.is(stringType.getName(), 'string')
})

test('isTypeOf will be true for any string', t => {
  t.false(stringType.isTypeOf(undefined))
  t.false(stringType.isTypeOf(null))
  t.false(stringType.isTypeOf(true))
  t.false(stringType.isTypeOf(false))
  t.false(stringType.isTypeOf(21))
  t.false(stringType.isTypeOf(3.1415))
  t.true(stringType.isTypeOf('hello'))
  t.false(stringType.isTypeOf({}))
  t.false(stringType.isTypeOf([]))
  t.false(stringType.isTypeOf(() => {}))
})
