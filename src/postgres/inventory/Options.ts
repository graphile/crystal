import { PGCatalogAttribute } from '../introspection'

/**
 * An object which contains options which will be used to construct our
 * Postgres inventory.
 */
type Options = {
  /**
   * This option denotes what attributes should be renamed and what they should
   * be renamed to. If an attribute name appears here, no matter what table or
   * schema it is in, the attribute will be renamed in our inventory. In
   * queries we will still use the original attribtue name however.
   *
   * Sometimes it may be advantageous to rename certain Postgres attributes.
   * Such as attributes named `id` when we need the `id` name for Relay support
   * in GraphQL.
   */
  renameIdToRowId: boolean,
}

export default Options
