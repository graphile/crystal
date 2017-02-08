import ConnectionFilter from './ConnectionFilter'

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
// TODO: REFACTOR!!!! The fact that this isn’t type safe is a little scary…
type Condition =
  ConstantCondition |
  NotCondition |
  AndCondition |
  OrCondition |
  FieldCondition |
  EqualCondition |
  LessThanCondition |
  GreaterThanCondition |
  CustomCondition |
  RegexpCondition

export default Condition

// TODO: rename
// TODO: seperate into own file?
export namespace conditionHelpers {
  /**
   * Does some logic and creates an `AndCondition`. Simplifies constants and
   * more.
   */
  export function and (...conditions: Array<Condition>): Condition {
    // If there are no conditions, throw an error.
    if (conditions.length === 0)
      throw new Error('Cannot have 0 conditions, must have at least 1.')

    const andConditions: Array<Condition> = []

    // For each condition, do some stuff…
    for (const condition of conditions) {
      // If one condition is false, the entire thing is false.
      if (condition === false) return false
      // If a condition is not true, add it to our `andConditions` list. In
      // this way we filter out all of the `true`s.
      else if (condition !== true) andConditions.push(condition)
    }

    // If there are no conditions in `andConditions` (because we filtered out
    // all the trues), just return true. If there is just one condition in
    // `andConditions` return that one condition. Otherwise, return an “and”
    // condition.
    return andConditions.length === 0 ? true : andConditions.length === 1 ? andConditions[0] : { type: 'AND', conditions: andConditions }
  }

  /**
   * Creates a condition that tests for the equality of a field with any given
   * value. A shortcut for creating a `FieldCondition` condition with an
   * `EqualCondition`.
   */
  // TODO: test
  export function fieldEquals (name: string, value: mixed): Condition {
    return { type: 'FIELD', name, condition: { type: 'EQUAL', value } }
  }

  /**
   * Creates a custom matcher condition
   */
  // TODO: test
  export function custom (filter: ConnectionFilter, value: string): Condition {
    return { type: 'CUSTOM', filter, value }
  }
}

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
  conditions: Array<Condition>,
}

/**
 * If even one child condition is true, than this condition will be true.
 */
type OrCondition = {
  type: 'OR',
  conditions: Array<Condition>,
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
  value: mixed,
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
  value: mixed,
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
  value: mixed,
}

/**
 * A condition to be used with a custom connection filter function.
 */
type CustomCondition = {
  type: 'CUSTOM',
  filter: ConnectionFilter,
  value: string,
}

/**
 * Asserts that the actual value matches our provided regular expression.
 */
type RegexpCondition = {
  type: 'REGEXP',
  regexp: RegExp,
}
