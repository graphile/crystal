import NamedType from '../../NamedType'
import floatType from '../floatType'

test('is a singleton NamedType', () => {
  expect(floatType instanceof NamedType).toBe(true)
})

test('getName returns float', () => {
  expect(floatType.getName()).toBe('float')
})

test('isTypeOf will be true for any number', () => {
  expect(floatType.isTypeOf(undefined)).toBe(false)
  expect(floatType.isTypeOf(null)).toBe(false)
  expect(floatType.isTypeOf(true)).toBe(false)
  expect(floatType.isTypeOf(false)).toBe(false)
  expect(floatType.isTypeOf(21)).toBe(true)
  expect(floatType.isTypeOf(3.1415)).toBe(true)
  expect(floatType.isTypeOf('hello')).toBe(false)
  expect(floatType.isTypeOf({})).toBe(false)
  expect(floatType.isTypeOf([])).toBe(false)
  expect(floatType.isTypeOf(() => {})).toBe(false)
})
