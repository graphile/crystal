import NamedType from '../NamedType'

/**
 * The singleton class used to instantiate `booleanType`.
 *
 * @private
 */
class BooleanType extends NamedType<boolean> {}

/**
 * A singleton boolean type that represents a boolean value. A boolean value
 * can be either “true” or “false.”
 */
const booleanType =
  new BooleanType('boolean')
  .setDescription('A value with only two possible variants: true or false.')

export default booleanType
