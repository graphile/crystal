import { GraphQLSchema, GraphQLObjectType, GraphQLFieldConfig, GraphQLNonNull, GraphQLID } from 'graphql'
import { Catalog } from '../../catalog'
import buildObject from '../utils/buildObject'
import * as id from '../utils/id'
import TypeForge from './TypeForge'
import NodeForge from './NodeForge'
import ConnectionForge from './ConnectionForge'
import CollectionForge from './CollectionForge'

/**
 * The catalog forge is used to create GraphQL types from our abstract catalog.
 *
 * So why the name “Forge”? The Forge pattern is similar to the GoF [Abstract
 * factory pattern][1] except in reverse. For the Factory pattern, you have
 * concrete values being used to create abstract values. So for example a
 * function named `createButton` returns an abstract `Button` interface which
 * can be either a concrete `WindowsButton` or `MacOSButton` value. So to
 * recap, a Factory takes concrete values and creates abstract values.
 *
 * A Forge is the opposite. A Forge takes abstract values and creates concrete
 * values. In the context of this program, say we had an abstract `ObjectType`
 * value that we don’t know the concrete implementation of. We want to turn
 * that abstract `ObjectType` into a concrete `GraphQLInputObjectType`
 * instance. A Forge may provide a method to do this operation.
 *
 * So why did we choose to use an OOP pattern and not a functional programming
 * pattern like in the first PostGraphQL implementation? Two reasons:
 *
 * 1. To control the memoization context. In GraphQL we can’t have two types of
 *    the same name, but we may call a types forge method with the same value
 *    more than once. Instead of creating a new instance of the GraphQL type,
 *    we would rather the GraphQL type that has already been created. If we had
 *    plain functions it is likely that our memoization cache would be global.
 *    While this isn’t too big a deal, it does lead to some avoidable edge
 *    cases.
 * 2. Configuration. If we used plain functions, it would be very difficult to
 *    memoize *and* provide configuration options when creating GraphQL types.
 *    While we don’t use configuration options now, it may be useful to allow
 *    configuration options in the future. So in order to avoid putting the
 *    configuration in a global state, we use classes.
 *
 * [1]: https://en.wikipedia.org/wiki/Abstract_factory_pattern
 */
class SchemaForge {
  private _typeForge = new TypeForge()
  private _nodeForge = new NodeForge()
  private _connectionForge = new ConnectionForge(this._typeForge)
  private _collectionForge = new CollectionForge(this._typeForge, this._nodeForge, this._connectionForge)

  constructor (private _options: {
    nodeIdName?: string,
  } = {}) {}

  /**
   * Creates a GraphQL schema from our abstract catalog data structure.
   */
  public createSchema (catalog: Catalog): GraphQLSchema {
    // Override all of the output types for collections.
    for (const collection of catalog.getCollections()) {
      const gqlCollectionType = this._collectionForge.getType(collection);
      this._typeForge.overrideOutputType(collection.getType(), gqlCollectionType);
    }

    return new GraphQLSchema({
      query: this._createQueryType(catalog),
    })
  }

  /**
   * Creates the root query type object.
   */
  private _createQueryType (catalog: Catalog): GraphQLObjectType<any> {
    return new GraphQLObjectType({
      name: 'Query',
      // TODO: description
      fields: buildObject<GraphQLFieldConfig<any, any>>(
        [this._nodeForge.createNodeFieldEntry(catalog)],
        catalog
          .getCollections()
          .map(collection => this._collectionForge.createRootFieldEntries(collection))
          .reduce((a, b) => a.concat(b), []),
      ),
    })
  }
}

export default SchemaForge
