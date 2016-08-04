/**
 * The condition type defines a set of constraints that we may apply to any
 * value that may be represented in our system. A condition must be defined
 * declaratively so that any query language may interpret the condition.
 *
 * Note that a condition is loosely typed. There is no way to statically
 * determine if a condition is appropriate for any type in our system. At
 * runtime we should determine if a condition is appropriate for a given type.
 * *Condition’s that are not appropriate should be rejected by collection
 * implementations*.
 */
// TODO: Create helper functions for building conditions.
// TODO: Test arbitrary conditions with arbitrary types to ensure that the
// condition would pass for a given type.
// TODO: Consider a text search condition.
// TODO: Consider some geographic operators.
// TODO: Consider some array operators.
type Condition =
  ConstantCondition |
  NotCondition |
  AndCondition |
  OrCondition |
  FieldCondition |
  EqualCondition |
  LessThanCondition |
  GreaterThanCondition |
  RegexpCondition

export default Condition

/**
 * A constant condition will always pass or fail. As the constant condition is
 * just a boolean internally, for “true” the condition will always pass, and
 * for “false” the condition will always fail.
 *
 * As a bonus, this makes for a nice condition DSL experience.
 */
type ConstantCondition = boolean

/**
 * Inverts the result of a condition. If a condition would be true, it is now
 * false.
 */
type NotCondition = {
  type: 'NOT',
  condition: Condition,
}

/**
 * Ensures all child conditions must be true before this condition is true.
 */
type AndCondition = {
  type: 'AND',
  conditions: Condition[],
}

/**
 * If even one child condition is true, than this condition will be true.
 */
type OrCondition = {
  type: 'OR',
  conditions: Condition[],
}

/**
 * Checks that a named field of an object value passes a given condition.
 */
type FieldCondition = {
  type: 'FIELD',
  name: string,
  condition: Condition,
}

/**
 * Does an equality test. If the value we are comparing against is equal to the
 * provided value, this condition will be true.
 *
 * In order to use a an “in” or “one of” condition, use an `OrCondition`
 * with multiple `EqualCondition`s.
 *
 * To use an “is null” operator, set `value` to `null`, for “is not null” use a
 * `NotCondition` as well.
 */
type EqualCondition = {
  type: 'EQUAL',
  value: any,
}

/**
 * Asserts that a value is less than the provided value. The logic for
 * comparing the values is implementation specific.
 *
 * For a less than or equal to condition, use the `OrCondition` with an
 * `EqualCondition`.
 */
type LessThanCondition = {
  type: 'LESS_THAN',
  value: any,
}

/**
 * Similar to the less than condition except this condition asserts that the
 * actual value is greater than our provided value.
 *
 * Use an `OrCondition` with an `EqualCondition` to get a condition for
 * greater than or equal to.
 */
type GreaterThanCondition = {
  type: 'GREATER_THAN',
  value: any,
}

/**
 * Asserts that the actual value matches our provided regular expression.
 */
type RegexpCondition = {
  type: 'REGEXP',
  regexp: RegExp,
}
