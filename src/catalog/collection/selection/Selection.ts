import Condition from './Condition'

/**
 * The object that is used to configure the subset of values we want when
 * reading from the collection.
 */
type Selection = {
  /**
   * The condition with which we will narrow down our result set. In order to
   * consider a value a part of this selection, it must pass the condition. To
   * use many conditions, look at `AndCondition` and `OrCondition`.
   */
  condition?: Condition,

  /**
   * The maximum number of values to be returned.
   */
  limit?: number,

  /**
   * How many values to skip over before we start returning the values.
   */
  skip?: number,
}

export default Selection
