import Type from '../Type'
import NamedType from '../NamedType'
import ObjectField from './ObjectField'

/**
 * An object type is made up of many different fields, and a field is composed of a
 * name and a type. This makes an object type a composite type as it is
 * composed of many different types.
 */
// TODO: Make sure no two fields have the same name.
abstract class ObjectType<
  TValue,
  TField extends ObjectField<TValue, mixed, Type<mixed>>,
> extends NamedType<TValue> {
  /**
   * Gets all of the fields on our object type. Order matters.
   */
  public abstract getFields (): Map<string, TField>

  /**
   * Creates a value with all of the fields in key/value pair format. If not
   * all fields are available, an error should be thrown.
   */
  public abstract createFromFieldValues (fieldValues: Map<string, mixed>): TValue
}

export default ObjectType
