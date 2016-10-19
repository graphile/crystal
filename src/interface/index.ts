import Inventory from './Inventory'
import Paginator from './Paginator'
import Collection from './collection/Collection'
import CollectionKey from './collection/CollectionKey'
import Condition, { conditionHelpers } from './collection/Condition'
import Relation from './collection/Relation'
// import Type from './type/Type'
// import NullableType from './type/NullableType'
// import ListType from './type/ListType'
// import NamedType from './type/NamedType'
// import AliasType from './type/AliasType'
// import EnumType from './type/EnumType'
// import ObjectType from './type/ObjectType'
import booleanType from './type/primitive/booleanType'
import integerType from './type/primitive/integerType'
import floatType from './type/primitive/floatType'
import stringType from './type/primitive/stringType'
import jsonType from './type/primitive/jsonType'

export {
  Inventory,
  Paginator,
  Collection,
  CollectionKey,
  Condition,
  conditionHelpers,
  Relation,
  Type,
  NullableType,
  ListType,
  NamedType,
  AliasType,
  EnumType,
  ObjectType,
  booleanType,
  integerType,
  floatType,
  stringType,
  jsonType,
}

interface Type<TValue> {
  readonly kind: string
  isTypeOf (value: mixed): value is TValue
}

// TODO: Could this just be an either type?
interface NullableType<
  TNullValue,
  TNonNullValue,
> extends Type<TNullValue | TNonNullValue> {
  readonly kind: 'NULLABLE'
  readonly nonNullType: Type<TNonNullValue>
  readonly nullValue: TNullValue
  isNull (value: TNullValue | TNonNullValue): value is TNullValue
  isNotNull (value: TNullValue | TNonNullValue): value is TNonNullValue
}

interface ListType<
  TValue,
  TItemValue,
> extends Type<TValue> {
  readonly kind: 'LIST'
  readonly itemType: Type<TItemValue>
  getLength (value: TValue): number
  getItemAt (value: TValue, index: number): TItemValue | undefined
  intoArray? (value: TValue): Array<TItemValue>
  fromArray (array: Array<TItemValue>): TValue
}

interface NamedType<TValue> extends Type<TValue> {
  readonly name: string
  readonly description?: string | undefined
}

interface AliasType<TValue> extends NamedType<TValue> {
  readonly kind: 'ALIAS'
  readonly baseType: Type<TValue>
}

interface EnumType<TValue> extends NamedType<TValue> {
  readonly kind: 'ENUM'
  readonly variants: Map<string, TValue>
}

interface ObjectType<TValue> extends NamedType<TValue> {
  readonly kind: 'OBJECT'
  readonly fields: Map<string, ObjectType.Field<TValue, mixed>>
  fromFields (fieldValues: Map<string, mixed>): TValue
}

namespace ObjectType {
  export interface Field<TObjectValue, TValue> {
    readonly description?: string | undefined
    readonly type: Type<TValue>
    getValue (objectValue: TObjectValue): TValue
  }
}

type SwitchTypeCases<T> = {
  nullable: (type: NullableType<mixed, mixed>) => T,
  list: (type: ListType<mixed, mixed>) => T,
  alias: (type: AliasType<mixed>) => T,
  enum: (type: EnumType<mixed>) => T,
  object: (type: ObjectType<mixed>) => T,
}

// tslint:disable no-any
export function switchType <T>(type: Type<mixed>, cases: SwitchTypeCases<T>): T
export function switchType <T>(cases: SwitchTypeCases<T>): (type: Type<mixed>) => T
export function switchType <T>(typeOrCases: Type<mixed> | SwitchTypeCases<T>, maybeCases?: SwitchTypeCases<T>): T | ((type: Type<mixed>) => T) {
  if (typeof typeOrCases['kind'] === 'string' && maybeCases)
    return switchType(maybeCases)(typeOrCases as any)

  const cases = typeOrCases as SwitchTypeCases<T>

  return (type: Type<mixed>): T => {
    switch (type.kind) {
      case 'NULLABLE': return cases.nullable(type as any)
      case 'LIST': return cases.list(type as any)
      case 'ALIAS': return cases.alias(type as any)
      case 'ENUM': return cases.enum(type as any)
      case 'OBJECT': return cases.object(type as any)
      default: throw new Error(`Type of kind '${type.kind}' is unrecognized.`)
    }
  }
}
// tslint:enable no-any

export const getNamedType: (type: Type<mixed>) => NamedType<mixed> = switchType<NamedType<mixed>>({
  nullable: type => getNamedType(type.nonNullType),
  list: type => getNamedType(type.itemType),
  alias: type => type,
  enum: type => type,
  object: type => type,
})
