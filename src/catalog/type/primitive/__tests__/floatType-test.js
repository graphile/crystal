import test from 'ava'
import NamedType from '../../NamedType'
import floatType from '../floatType'

test('is a singleton NamedType', t => {
  t.true(floatType instanceof NamedType)
})

test('getName returns float', t => {
  t.is(floatType.getName(), 'float')
})

test('isTypeOf will be true for any number', t => {
  t.false(floatType.isTypeOf(undefined))
  t.false(floatType.isTypeOf(null))
  t.false(floatType.isTypeOf(true))
  t.false(floatType.isTypeOf(false))
  t.true(floatType.isTypeOf(21))
  t.true(floatType.isTypeOf(3.1415))
  t.false(floatType.isTypeOf('hello'))
  t.false(floatType.isTypeOf({}))
  t.false(floatType.isTypeOf([]))
  t.false(floatType.isTypeOf(() => {}))
})
