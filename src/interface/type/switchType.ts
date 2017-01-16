import Type, { isType } from './Type'
import NullableType from './NullableType'
import ListType from './ListType'
import AliasType from './AliasType'
import ObjectType from './ObjectType'
import ScalarType from './ScalarType'

/**
 * All of the cases that a user must specify.
 *
 * @private
 */
type SwitchTypeCases<T> = {
  nullable: (type: NullableType<mixed, mixed>) => T,
  list: (type: ListType<mixed, mixed>) => T,
  alias: (type: AliasType<mixed>) => T,
  enum: (type: EnumType<mixed>) => T,
  object: (type: ObjectType<mixed>) => T,
  scalar: (type: ScalarType<mixed>) => T,
}

/**
 * A custom pattern-matching implementation for types. We want type safety when
 * working with different forms of types. A tagged union from TypeScript isn’t
 * enough as it is very difficult to define when it comes to generics. Also we
 * want full support for generics and don’t want them to implicitly become
 * `any`. We’d also like to get errors when a new case is added and our
 * switches become non-exhaustive. Therefore we have this custom
 * pattern-matching function.
 *
 * It will use the cases object you give it and switch on the provided
 * interface type to run the correct case.
 */
function switchType <T>(type: Type<mixed>, cases: SwitchTypeCases<T>): T
function switchType <T>(cases: SwitchTypeCases<T>): (type: Type<mixed>) => T
function switchType <T>(typeOrCases: Type<mixed> | SwitchTypeCases<T>, maybeCases?: SwitchTypeCases<T>): T | ((type: Type<mixed>) => T) {
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

export default switchType
