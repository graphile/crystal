type CleanupFn = () => void | Promise<void>

/**
 * `Context` is an object which holds information about any single logical data
 * access.
 */
// TODO: tests
class Context {
  /**
   * Dependencies which can be injected into functions. Often different drivers
   * will implement their own getters/setters to maintain type information.
   *
   * Uses symbols to prevent key collisions.
   *
   * @private
   */
  private _dependencies = new Map<Symbol, mixed>()

  /**
   * Adds a dependency using a symbol as the key. If a dependency with that
   * symbol already exists, an error will be thrown.
   *
   * @see `Context#getDependency`
   */
  public addDependency <T>(symbol: Symbol, dependency: T): this {
    if (this._dependencies.has(symbol))
      throw new Error('A dependency for this symbol already exists.')

    this._dependencies.set(symbol, dependency)

    return this
  }

  /**
   * Gets a dependency by its symbol and returns it. If no such dependency
   * for the symbol exists, the method returns `undefined`.
   *
   * @see `Context#addDependency`
   */
  public getDependency <T>(symbol: Symbol): T | undefined {
    return this._dependencies.get(symbol) as any
  }

  /**
   * An array of the cleanup functions that have been added to our context.
   *
   * @private
   */
  private _cleanupFns: Array<CleanupFn> = []

  /**
   * Adds a cleanup function which will be run when `Context#cleanup` is
   * called.
   *
   * @see `Context#cleanup`
   */
  public addCleanupFunction (cleanupFn: CleanupFn): this {
    this._cleanupFns.push(cleanupFn)
    return this
  }

  /**
   * A method which *must* be called whenever a context has finished its task.
   *
   * @see `Context#addCleanupFunction`
   */
  public async cleanup () {
    await Promise.all(this._cleanupFns.map(cleanupFn => cleanupFn()))
  }
}

export default Context
