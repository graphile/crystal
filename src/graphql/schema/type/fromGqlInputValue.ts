import { NullableType, ListType, AliasType, EnumType } from '../../../interface'

const thro = (error: Error): never => { throw error }

export default function fromGqlInputValue <TValue>(_type: Type<TValue>, value: mixed): TValue {
  return switchType<TValue>(_type, {
    nullable: <TNullValue, TNotNullValue>(type: NullableType<TNullValue, TNotNullValue>): TNullValue | TNotNullValue =>
      value == null
        ? type.nullValue
        : fromGqlInputValue(type.nonNullType, value),

    list: <TItemValue>(type: ListType<TValue, TItemValue>): TValue =>
      Array.isArray(value)
        ? type.fromArray(value.map(item => fromGqlInputValue(type.itemType, item)))
        : thro(new Error(`Input value must be an array.`)),

    alias: (type: AliasType<TValue>): TValue =>
      fromGqlInputValue(type.baseType, value),

    enum: (type: EnumType<TValue>): TValue =>
      type.isTypeOf(value)
        ? value
        : thro(new Error(`Input value must be an enum variant.`)),

    object: type => null as any,
  })
}
