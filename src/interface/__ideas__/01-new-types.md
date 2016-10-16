```ts
/* tslint:disable */

interface Type<TValue> {
  readonly kind: string
  isTypeOf (value: mixed): value is TValue
}

interface NullableType<
  TNullValue,
  TNonNullValue,
  TNonNullType extends Type<TNonNullValue>,
> extends Type<TNullValue | TNonNullValue> {
  readonly kind: 'NULLABLE'
  readonly nonNullType: TNonNullType
  isNull (value: TNullValue | TNonNullValue): value is TNullValue
  isNonNull (value: TNullValue | TNonNullValue): value is TNonNullValue
}

interface ListType<
  TValue,
  TItemValue,
  TItemType extends Type<TItemValue>,
> extends Type<TValue> {
  readonly kind: 'LIST'
  readonly itemType: TItemType
  getLength (value: TValue): number
  getItem (value: TValue, index: number): TItemValue | undefined
  asArray? (value: TValue): Array<TItemValue>
}

interface NamedType<TValue> extends Type<TValue> {
  readonly name: string
  readonly description?: string | undefined
}

type SwitchTypeCases<T> = {
  nullable: <TNullValue, TNonNullValue, TNonNullType extends Type<TNonNullValue>>(type: NullableType<TNullValue, TNonNullValue, TNonNullType>) => T,
  list: <TValue, TItemValue, TItemType extends Type<TItemValue>>(type: ListType<TValue, TItemValue, TItemType>) => T,
}

// function switchType <T>(type: Type<mixed>, cases: SwitchTypeCases<T>): T
function switchType <T>(cases: SwitchTypeCases<T>): (type: Type<mixed>) => T {
// function switchType <T>(typeOrCases: Type<mixed> | SwitchTypeCases<T>, maybeCases?: SwitchTypeCases<T>): T | ((type: Type<mixed>) => T) {
//   if (typeof typeOrCases['kind'] === 'string' && maybeCases)
//     return switchType(maybeCases)(typeOrCases as any)

//   const cases = typeOrCases as SwitchTypeCases<T>

  return (type: Type<mixed>): T => {
    switch (type.kind) {
      case 'NULLABLE': return cases.nullable(type as any)
      case 'LIST': return cases.list(type as any)
      default: throw new Error(`Type of kind '${type.kind}' is unrecognized.`)
    }
  }
}

const getNamedType = switchType<NamedType<mixed>>({
  nullable: type => getNamedType(type.nonNullType),
  list: type => getNamedType(type.itemType),
})

```
