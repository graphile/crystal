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
// TODO: Remove alias types?
interface AliasType<TValue> extends NamedType<TValue> {
  // The unique string tag for alias types.
  readonly kind: 'ALIAS'

  /**
   * The type this alias is based on.
   */
  readonly baseType: Type<TValue>
}

export default AliasType
