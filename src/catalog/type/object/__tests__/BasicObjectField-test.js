import ObjectField from '../ObjectField'
import BasicObjectField from '../BasicObjectField'

test('is an ObjectField', () => {
  expect(new BasicObjectField() instanceof ObjectField).toBe(true)
})

test('getFieldValueFromObject will simply get the object field of the same name', () => {
  const a = Symbol('a')
  const b = Symbol('b')
  const object = { a, b }
  expect(new BasicObjectField('a').getFieldValueFromObject(object)).toBe(a)
  expect(new BasicObjectField('b').getFieldValueFromObject(object)).toBe(b)
})
