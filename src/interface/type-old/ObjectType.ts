import Type from './Type'
import NamedType from './NamedType'

/**
 * An object type is made up of many different fields, and a field is composed of a
 * name and a type. This makes an object type a composite type as it is
 * composed of many different types.
 *
 * Any object value will *always* be a `Map`. This is to make object values
 * easy to construct and deconstruct. Originally the author had more choice on
 * how to construct the internal object value. This just led to pain and
 * confusion. Its much easier to agree on a protocol instead of passing around
 * arbitrary values.
 *
 * A relevant question is why use an ES6 `Map` though? Why not a plain
 * JavaScript object? The reason is that plain JavaScript objects really make
 * for inneficient maps. The argument is kind of comparable to structs vs.
 * key-value collections. We want a collection, not a struct. As we don’t know
 * the field names, *or* the field values at compile time, objects just become
 * a pain to work with. There are also a number of deoptimizations engines
 * apparently make when objects are interacted with as maps. If the [v8 “Strong
 * Mode” project][1] becomes a real thing, the use of objects as maps will
 * generate runtime errors. Another good resource are the [answers to the Stack
 * Overflow question “Maps vs Objects in ES6, When to use?”][2].
 *
 * [1]: https://github.com/v8/v8/wiki/Experiments%20with%20Strengthening%20JavaScript#strong-mode
 * [2]: http://stackoverflow.com/questions/32600157/maps-vs-objects-in-es6-when-to-use
 */
class ObjectType extends NamedType<ObjectType.Value> {
  /**
   * A map of names to fields, which contain the field’s type. Note that our
   * map values will have the exact same keys where values will correspond to
   * the field’s type.
   */
  public readonly fields: Map<string, ObjectType.Field<mixed>>

  constructor (config: {
    name: string,
    description?: string | undefined,
    fields: Map<string, ObjectType.Field<mixed>>,
  }) {
    super(config)
    this.fields = config.fields
  }

  /**
   * Checks that a value is a map that is the same size and has the same type
   * for every entry.
   */
  public isTypeOf (value: mixed): value is ObjectType.Value {
    return (
      value instanceof Map &&
      Array.from(this.fields.entries()).every(([name, { type }]) => type.isTypeOf(value.get(name)))
    )
  }
}

// Export some handy types with the implicit `ObjectType` namespace.
namespace ObjectType {
  /**
   * The type alias for the value of an `ObjectType` which is a `Map`. See the
   * documentation for `ObjectType` for the reasoning behind why it is a map.
   */
  // This is accessed as `ObjectType.Value`.
  export type Value = Map<string, mixed>

  /**
   * An object field represents a single typed field on an object type. The
   * field will contain a name which is unique to the object containing the field
   * and a value of any type.
   */
  // This is accessed as `ObjectType.Field`.
  export interface Field<TValue> {
    /**
     * The optional description of a field. It may be used to generate
     * documentation.
     */
    readonly description?: string | undefined

    /**
     * The type of the field.
     */
    readonly type: Type<TValue>

    /**
     * Some meta information which indicates whether or not the field has a
     * default value that can be fallen back on.
     *
     * We use this in inputs to mark non-null fields as nullable to let the
     * implementation use its own default instead of requiring the user to
     * provide a value.
     */
    // TODO: Is this exposing to much information? This comes out of supporting
    // Postgres, we want serial primary key ids to be nullable in their inputs
    // even if they are nullable in the database.
    readonly hasDefault?: boolean
  }
}

export default ObjectType
