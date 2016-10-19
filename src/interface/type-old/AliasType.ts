import Type from './Type'
import NamedType from './NamedType'

/**
 * An alias type is a very simple wrapper around a named type. The point of
 * an alias type is to just give a type another name. So for example if we want
 * a custom string type for emails we would create an alias type like:
 *
 * ```js
 * new AliasType('email', stringType)
 * ```
 *
 * The reason we only alias named types is that it is easier to work with in
 * services that don’t support type aliasing. Like in GraphQL which doesn’t
 * support aliasing unnamed types.
 */
class AliasType<TValue> extends NamedType<TValue> {
  /**
   * The type this alias is based on.
   */
  public readonly baseType: Type<TValue>

  constructor (config: {
    name: string,
    description?: string | undefined,
    baseType: Type<TValue>,
  }) {
    super(config)
    this.baseType = config.baseType
  }

  /**
   * Proxies the `isTypeOf` check to the base type of this alias.
   */
  public isTypeOf (value: mixed): value is TValue {
    return this.baseType.isTypeOf(value)
  }
}

export default AliasType
