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
// import booleanType from './type/primitive/booleanType'
// import integerType from './type/primitive/integerType'
// import floatType from './type/primitive/floatType'
// import stringType from './type/primitive/stringType'
// import jsonType from './type/primitive/jsonType'

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
  // booleanType,
  // integerType,
  // floatType,
  // stringType,
  // jsonType,
}

// Interface types define *data access shape*, not the data itself.
// A scalar type in the database may be accessed as an object type.
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

// A scalar type represents a basic entry/exit point of our system. Stuff flows
// through here yo.
// TODO: Perhaps scalars should have categories? For instance, a number
// category or a string category. This would allow us to better type the
// external value instead of calling it ‘mixed’.
// TODO: Possibly return validation information to `fromExternal`.
// TODO: `intoExternal` should only return some JSON.
export interface ScalarType<TValue> extends NamedType<TValue> {
  readonly kind: 'SCALAR'
  fromInput (value: mixed): TValue
  intoOutput (value: TValue): mixed
}

/**
 * A singleton boolean type that represents a boolean value. A boolean value
 * can be either “true” or “false.”
 */
export const booleanType: ScalarType<boolean> = {
  kind: 'SCALAR',
  name: 'boolean',
  description:
    'A value with only two possible variants: true or false.',

  isTypeOf: (value: mixed): value is boolean =>
    typeof value === 'boolean',

  fromInput: value => {
    if (typeof value !== 'boolean')
      throw new Error(`Type of input value must be 'boolean', not '${typeof value}'.`)

    return value
  },

  intoOutput: value => value,
}

/**
 * A singleton integer type that represents a number which is in integer, or
 * has no decimal values.
 */
export const integerType: ScalarType<number> = {
  kind: 'SCALAR',
  name: 'integer',
  description:
    'A number that can be written without a fractional component. So 21, 4, or 0 ' +
    'would be an integer while 3.14 would not.',

  isTypeOf: (value: mixed): value is number =>
    typeof value === 'number' && Number.isInteger(value),

  fromInput: value => {
    if (typeof value !== 'number')
      throw new Error(`Type of input value must be 'number', not '${typeof value}'.`)

    if (Number.isInteger(value))
      throw new Error(`Input number value must be an integer, instead got number '${value}'. Perhaps you meant '${Math.round(value)}'?`)

    return value
  },

  intoOutput: value => value,
}

/**
 * A singleton float type which represents a float value as is specified by
 * [IEEE 754][1].
 *
 * [1]: http://en.wikipedia.org/wiki/IEEE_floating_point
 */
export const floatType: ScalarType<number> = {
  kind: 'SCALAR',
  name: 'float',
  description:
    'A signed number with a fractional component (unlike an integer) as specified ' +
    'by [IEEE 754](http://en.wikipedia.org/wiki/IEEE_floating_point).',

  isTypeOf: (value: mixed): value is number =>
    typeof value === 'number',

  fromInput: value => {
    if (typeof value !== 'number')
      throw new Error(`Type of input value must be 'number', not '${typeof value}'.`)

    return value
  },

  intoOutput: value => value,
}

/**
 * A singleton string type that represents a string value. Simply, a string can
 * be defined as an array of characters.
 */
export const stringType: ScalarType<string> = {
  kind: 'SCALAR',
  name: 'string',
  description:
    'A sequence of characters. This type is often used to represent textual, ' +
    'human readable data.',

  isTypeOf: (value: mixed): value is string =>
    typeof value === 'string',

  fromInput: value => {
    if (typeof value !== 'string')
      throw new Error(`Type of input value must be 'string', not '${typeof value}'.`)

    return value
  },

  intoOutput: value => value,
}

type SwitchTypeCases<T> = {
  nullable: (type: NullableType<mixed, mixed>) => T,
  list: (type: ListType<mixed, mixed>) => T,
  alias: (type: AliasType<mixed>) => T,
  enum: (type: EnumType<mixed>) => T,
  object: (type: ObjectType<mixed>) => T,
  scalar: (type: ScalarType<mixed>) => T,
}

function isType (value: mixed): value is Type<mixed> {
  return value != null && typeof value === 'object' && typeof value['kind'] === 'string'
}

export function switchType <T>(type: Type<mixed>, cases: SwitchTypeCases<T>): T
export function switchType <T>(cases: SwitchTypeCases<T>): (type: Type<mixed>) => T
export function switchType <T>(typeOrCases: Type<mixed> | SwitchTypeCases<T>, maybeCases?: SwitchTypeCases<T>): T | ((type: Type<mixed>) => T) {
  if (isType(typeOrCases))
    if (maybeCases)
      return switchType(maybeCases)(typeOrCases)
    else
      throw new Error('A type was provided as the first argument, cases must be defined as the second argument.')

  const cases = typeOrCases

  return (type: Type<mixed>): T => {
    switch (type.kind) {
      // tslint:disable no-any
      case 'NULLABLE': return cases.nullable(type as any)
      case 'LIST': return cases.list(type as any)
      case 'ALIAS': return cases.alias(type as any)
      case 'ENUM': return cases.enum(type as any)
      case 'OBJECT': return cases.object(type as any)
      case 'SCALAR': return cases.scalar(type as any)
      // tslint:enable no-any
      default: throw new Error(`Type of kind '${type.kind}' is unrecognized.`)
    }
  }
}

export const getNamedType: (type: Type<mixed>) => NamedType<mixed> = switchType<NamedType<mixed>>({
  nullable: type => getNamedType(type.nonNullType),
  list: type => getNamedType(type.itemType),
  alias: type => type,
  enum: type => type,
  object: type => type,
  scalar: type => type,
})
