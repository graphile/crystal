import NamedType from '../NamedType'

/**
 * The singleton class used to instantiate `stringType`.
 *
 * @private
 */
class StringType extends NamedType<string> {
  public isTypeOf (value: any): value is string {
    return typeof value === 'string'
  }
}

/**
 * A singleton string type that represents a string value. Simply, a string can
 * be defined as an array of characters.
 */
const stringType =
  new StringType('string')
  .setDescription(
    'A sequence of characters. This type is often used to represent textual, ' +
    'human readable data.'
  )

export default stringType
