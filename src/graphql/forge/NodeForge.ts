import { GraphQLInterfaceType, GraphQLNonNull, GraphQLID, GraphQLFieldConfig } from 'graphql'
import { Catalog } from '../../catalog'

/**
 * The type of ids internal to our system. An id has two properties, a `name`
 * and a `key`. `name` is just the collection name that the value this id
 * identifies belongs to. The `key` property is the unique identifier of the
 * value in the collection. Because a collection may have multiple unique keys,
 * the key here will always be used with the collection’s primary key. If a
 * primary key does not exist on the collection named, the id is invalid.
 *
 * Also keep in mind that when the id is serialized, `key` will be turned into
 * JSON so it will lose any prototype information.
 *
 * @private
 */
type ID = {
  name: string,
  key: any,
}

class NodeForge {
  private _nodeInterface = (
    new GraphQLInterfaceType({
      name: 'Node',
      // TODO: description
      fields: {
        __id: {
          type: new GraphQLNonNull(GraphQLID),
          // TODO: description
        },
      },
    })
  )

  /**
   * Gets the GraphQL interface object that represents a `Node`. A `Node` is defined
   * in the Relay GraphQL specifications as any object in the GraphQL data
   * universe with a globally unique id.
   */
  public getInterface (): GraphQLInterfaceType<any> {
    return this._nodeInterface
  }

  /**
   * Creates the GraphQL `node` field entry as defined by the Relay
   * specification.
   */
  public createNodeFieldEntry (catalog: Catalog): [string, GraphQLFieldConfig<any, any>] {
    return ['node', {
      // TODO: description
      type: this.getInterface(),
      args: {
        __id: {
          // TODO: description,
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve (source, { __id }) {
        const { name, key } = this.deserializeId(__id)
        const collection = catalog.getCollection(name)

        if (!collection)
          throw new Error(`Invalid __id, no collection exists named '${name}'.`)

        const primaryKey = collection.getPrimaryKey()

        if (!primaryKey)
          throw new Error(`Invalid __id, no primary key on collection named '${name}'.`)

        return primaryKey.read(key)
      },
    }]
  }
}

export default NodeForge
