import test from 'ava'
import ObjectField from '../ObjectField'
import BasicObjectField from '../BasicObjectField'

test('is an ObjectField', t => {
  t.true(new BasicObjectField() instanceof ObjectField)
})

test('getFieldValueFromObject will simply get the object field of the same name', t => {
  t.is(new BasicObjectField('a').getFieldValueFromObject({ a: 1, b: 2 }), 1)
  t.is(new BasicObjectField('b').getFieldValueFromObject({ a: 1, b: 2 }), 2)
})
