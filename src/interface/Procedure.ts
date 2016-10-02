import Paginator from './Paginator'
import Type from './type/Type'
import ObjectType from './type/ObjectType'

/**
 * A procedure is any remote function which our interface knows about.
 * Procedures allow users to execute arbitrary code from their APIs.
 */
// TODO: Rethink the procedure interface from a non-Postgres perspective.
// Having paginator output for mutations can be wierd. Maybe paginators
// should be instance based?
// TODO: Consider splitting up a `Procedure` into multiple types. One for
// mutations, one for queries/views.
interface Procedure {
  /**
   * The required name of our procedure.
   */
  readonly name: string

  /**
   * The optional description of our procedure.
   */
  readonly description?: string | undefined

  /**
   * Indicates whether or not the procedure mutates data.
   *
   * The reason this is called `isStable` vs. `isMutation` is becuase we want
   * to assume the procedure is a mutation if the property is not defined.
   */
  readonly isStable?: boolean

  /**
   * The input type we will use for our procedure. We use an object type
   * because that forces the procedure to have multiple arguments, *and* named
   * arguments. When building APIs, named arguments are much better than
   * ordered.
   */
  readonly inputType: ObjectType

  /**
   * The output `Procedure` strategy. A procedure could output one of two
   * things. A single value, or a set of values. Expressed by a paginator.
   */
  // TODO: Does an unstable procedure with a paginator output make sense?
  // Perhaps only stable procedures should have paginators.
  readonly output: Procedure.SingleOutput<mixed> | Procedure.PaginatorOutput<mixed>
}

namespace Procedure {
  /**
   * The output object for a procedure that returns a single value.
   */
  export interface SingleOutput<TOutputValue> {
    /**
     * A constant tag to identify this output type from other output types.
     */
    readonly kind: 'SINGLE'

    /**
     * The type of the value the paginator will output.
     */
    readonly outputType: Type<TOutputValue>

    /**
     * Actually execute our procedure.
     */
    execute (context: mixed, input: ObjectType.Value): Promise<TOutputValue>
  }

  /**
   * The output object for a procedure that returns a set of values.
   */
  export interface PaginatorOutput<TOutputItemValue> {
    /**
     * The tag necessary for distinguishing this output type from other output
     * types.
     */
    readonly kind: 'PAGINATOR'

    /**
     * The paginator to be used in executing our procedure. Takes the value
     * specified by `Procedure#inputType` as the input.
     */
    readonly paginator: Paginator<ObjectType.Value, TOutputItemValue>
  }
}

export default Procedure
