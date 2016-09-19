import Type from '../Type'
import ObjectField from './ObjectField'
import { BasicObjectValue } from './BasicObjectType'

/**
 * The basic object field will just pick the same property from the internal
 * object value as the field’s name.
 */
class BasicObjectField<TValue, TType extends Type<TValue>> extends ObjectField<BasicObjectValue, TValue, TType> {
  /**
   * In order to get the field value from our object value, we just get the
   * object property with the same name as this field name.
   */
  public getFieldValueFromObject (object: BasicObjectValue): TValue {
    return object[this.getName()] as any
  }
}

export default BasicObjectField
