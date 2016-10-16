import { conditionHelpers } from '../Condition'

test('and will throw when there are no conditions', () => {
  expect(() => conditionHelpers.and()).toThrow('Cannot have 0 conditions, must have at least 1.')
})

test('and will return false if there is one false', () => {
  expect(conditionHelpers.and(true, { type: 'EQUAL', value: 2 }, true, false, true)).toEqual(false)
})

test('and will return true if all are true', () => {
  expect(conditionHelpers.and(true, true, true, true, true)).toEqual(true)
})

test('and will create an `AndCondition`', () => {
  expect(conditionHelpers.and({ type: 'EQUAL', value: 2 }, { type: 'EQUAL', value: 3 }))
    .toEqual({ type: 'AND', conditions: [{ type: 'EQUAL', value: 2 }, { type: 'EQUAL', value: 3 }] })
})

test('and will filter out trues when creating an `AndCondition`', () => {
  expect(conditionHelpers.and(true, { type: 'EQUAL', value: 2 }, true, true, { type: 'EQUAL', value: 3 }))
    .toEqual({ type: 'AND', conditions: [{ type: 'EQUAL', value: 2 }, { type: 'EQUAL', value: 3 }] })
})

test('and will return a single condition if just one was provided', () => {
  expect(conditionHelpers.and({ type: 'EQUAL', value: 2 }))
    .toEqual({ type: 'EQUAL', value: 2 })
})

test('and will return a single condition if only that condition and true was provided', () => {
  expect(conditionHelpers.and(true, { type: 'EQUAL', value: 2 }, true, true))
    .toEqual({ type: 'EQUAL', value: 2 })
})
