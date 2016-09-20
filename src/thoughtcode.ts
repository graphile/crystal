interface Type<TValue> {
  isTypeOf (value: mixed): value is TValue
}

class NullableType<TValue extends TNonNullValue | null | undefined, TNonNullValue> implements Type<TValue> {
  constructor (public readonly nonNullType: Type<TNonNullValue>) {}

  /**
   * Checks if the value is null, or it is a type of the nullable types non
   * null composite type.
   */
  public isTypeOf (value: mixed): value is TValue {
    return value == null || this.nonNullType.isTypeOf(value)
  }
}

class ListType<TValue extends Array<TItemValue>, TItemValue> implements Type<TValue> {
  constructor (public readonly itemType: Type<TItemValue>) {}

  /**
   * Checks if the value is an array and if it is an array checks if every item
   * is one of the composite item type.
   */
  public isTypeOf (values: mixed): values is TValue {
    return Array.isArray(values) && values.every(value => this.itemType.isTypeOf(value))
  }
}

interface NamedType<TValue> extends Type<TValue> {
  readonly name: string
  readonly description?: string | undefined
}

class EnumType implements NamedType<string> {
  /**
   * Extract all of the public properties for this type from the config which
   * we require on initialization.
   */
  public readonly name: string
  public readonly description?: string | undefined
  public readonly variants: Set<string>

  constructor (config: {
    name: string,
    description?: string | undefined,
    variants: Set<string>,
  }) {
    this.name = config.name
    this.description = config.description
    this.variants = config.variants
  }

  /**
   * Checks if the value is a string and that string is one of this enum’s
   * variants.
   */
  public isTypeOf (value: mixed): value is string {
    return typeof value === 'string' && this.variants.has(value)
  }
}

// interface PrimitiveType<TValue> extends NamedType<TValue> {
//   readonly kind: 'PRIMITIVE'
// }

class ObjectType implements NamedType<Map<string, mixed>> {
  public readonly name: string
  public readonly description: string | undefined
  public readonly fields: Map<string, ObjectField<mixed>>

  constructor (config: {
    name: string,
    description?: string | undefined,
    fields: Map<string, ObjectField<mixed>>,
  }) {
    this.name = config.name
    this.description = config.description
    this.fields = config.fields
  }

  /**
   * Checks that a value is a map that is the same size and has the same type
   * for every entry.
   */
  public isTypeOf (value: mixed): value is Map<string, mixed> {
    return (
      value instanceof Map &&
      Array.from(this.fields.entries()).every(([name, { type }]) => type.isTypeOf(value.get(name)))
    )
  }
}

interface ObjectField<TFieldValue> {
  readonly description?: string | undefined
  readonly type: Type<TFieldValue>
}
