import NamedType from './NamedType'

/**
 * A scalar type represents the most basic type in our system. A basic
 * entry/exit point for our type system which exists at the leafs of all the
 * compound types. Scalar types may maintain whatever internal value they would
 * like and manage how values are input into the system and output.
 *
 * There are a number of predefined ‘blessed’ custom scalar types which may
 * have special handling in some consuming libraries.
 */
// TODO: Perhaps scalars should have categories? For instance, a number
// category or a string category. This would allow us to better type the
// external value instead of calling it ‘mixed’.
// TODO: Possibly return validation information instead of throwing in `fromExternal`.
// TODO: `intoExternal` should only return some JSON.
interface ScalarType<TValue> extends NamedType<TValue> {
  // The unique tag for our scalar type.
  readonly kind: 'SCALAR'

  /**
   * Takes any input objects/values and turns them into internal values. Will
   * throw an error if the input could not be turned into a proper value.
   */
  fromInput (value: mixed): TValue

  /**
   * Will take an internal value and turn it into JSON output.
   */
  intoOutput (value: TValue): mixed
}

export default ScalarType
