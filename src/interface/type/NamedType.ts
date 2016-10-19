import Type from './Type'

/**
 * A named type is any type which has a name and an optional description. These
 * types make up the core of our system, so most types can be expected to be
 * named. More interesting are the unnamed types. The unnamed types are
 * abstractions *over* named types. Like the `NullableType` or `ListType`.
 */
interface NamedType<TValue> extends Type<TValue> {
  /**
   * The name of this type. For all intents and purposes, this name should
   * probably be unique.
   */
  readonly name: string

  /**
   * An optional description of the type. Used for the automatic generation of
   * documentation. The description should be written in Markdown.
   */
  readonly description?: string | undefined
}

export default NamedType
