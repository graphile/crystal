import Type from './Type'

/**
 * A named type is any type which has a name and an optional description. These
 * types make up the core of our system, so most types can be expected to be
 * named. More interesting are the unnamed types. The unnamed types are
 * abstractions *over* named types. Like the `NullableType` or `ListType`.
 */
abstract class NamedType<TValue> extends Type<TValue> {
  /**
   * The name of this type. For all intents and purposes, this name should
   * probably be unique.
   */
  public readonly name: string

  /**
   * An optional description of the type. Used for the automatic generation of
   * documentation. The description should be written in Markdown.
   */
  public readonly description?: string | undefined

  constructor (config: {
    name: string,
    description?: string | undefined
  }) {
    super()
    this.name = config.name
    this.description = config.description
  }

  /**
   * Returns itself, because this is a named type. We don’t need to keep
   * searching.
   */
  public getNamedType (): NamedType<mixed> {
    return this
  }
}

export default NamedType

/**
 * Detects if a given type is a named type or not.
 */
export const isNamedType = <TValue>(type: Type<TValue>): type is NamedType<TValue> =>
  typeof type['name'] === 'string'
