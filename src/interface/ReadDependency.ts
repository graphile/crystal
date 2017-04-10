/**
 * A dependency represents some subset of data in `TValue` that can be fetched
 * independently of the rest of the data that makes up `TValue`. For example,
 * say `TValue` has three properties: `a`, `b`, and `c`. We could have a
 * dependency object for all three of these properties: `a`, `b`, and `c`. Or a
 * dependency for two of the three properties. For example, just `a` and `b`.
 *
 * By defining dependencies we can ensure that when we read data from our data
 * source we don’t accidently over fetch. We instead only fetch the exact subset
 * of the data which the consumer needs and nothing more.
 *
 * The implementation of read methods like those in `CollectionKey` or
 * `Paginator` may assemble these dependencies into an optimized query against
 * the respective backend.
 */
interface ReadDependency<TValue> {}

export default ReadDependency
