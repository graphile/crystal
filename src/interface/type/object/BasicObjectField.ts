import Type from '../Type'
import ObjectField from './ObjectField'
import BasicObjectType from './BasicObjectType'

/**
 * The basic object field will just pick the same property from the internal
 * object value as the field’s name.
 */
class BasicObjectField<TFieldValue, TFieldType extends Type<TFieldValue>>
extends ObjectField<BasicObjectType.Value, TFieldValue, TFieldType> {
  constructor (
    public name: string,
    type: TFieldType,
  ) {
    super(type)
  }

  /**
   * In order to get the field value from our object value, we just get the
   * object property with the same name as this field name.
   */
  public getFieldValueFromObject (object: BasicObjectType.Value): TFieldValue {
    return object[this.name] as any
  }
}

export default BasicObjectField
