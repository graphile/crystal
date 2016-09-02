import {
  GraphQLObjectType,
  GraphQLOutputType,
  GraphQLInputType,
  GraphQLFieldConfig,
  GraphQLNonNull,
  GraphQLID,
  GraphQLArgumentConfig,
} from 'graphql'

import {
  Catalog,
  Collection,
  ObjectType,
  ObjectField,
  Relation,
} from '../../catalog'

import memoize from '../utils/memoize'
import buildObject from '../utils/buildObject'
import * as formatName from '../utils/formatName'
import * as id from '../utils/id'
import TypeForge from './TypeForge'
import NodeForge from './NodeForge'
import ConnectionForge from './ConnectionForge'

/**
 * The collection forge will create GraphQL types out of collections.
 */
class CollectionForge {
  constructor (
    private _options: { nodeIdFieldName: string },
    private _catalog: Catalog,
    private _typeForge: TypeForge,
    private _nodeForge: NodeForge,
    private _connectionForge: ConnectionForge,
  ) {}

  /**
   * Creates any number of query field entries for a collection. These fields
   * will be on the root query type.
   */
  public createRootFieldEntries <T>(collection: Collection<T>): Array<[string, GraphQLFieldConfig<any, any>]> {
    const type = collection.getType()
    const entries: Array<[string, GraphQLFieldConfig<any, any>]> = []
    const primaryKey = collection.getPrimaryKey()
    const paginator = collection.getPaginator()

    // If the collection has a paginator, let’s use it to create a connection
    // field for our collection.
    if (paginator) {
      entries.push([
        formatName.field(`all-${collection.getName()}`),
        this._connectionForge.createField(paginator),
      ])
    }

    // Add a field to select our collection by its primary key, if the
    // collection has a primary key. Note that we abstract away the shape of
    // the primary key in this instance. Instead using a GraphQL native format,
    // the id format.
    if (primaryKey) {
      entries.push([formatName.field(type.getName()), {
        // TODO: description
        type: this.getType(collection),
        args: {
          [this._options.nodeIdFieldName]: {
            // TODO: description,
            type: new GraphQLNonNull(GraphQLID),
          },
        },
        resolve: (source, args) => {
          const { name, key } = id.deserialize(args[this._options.nodeIdFieldName])

          if (name !== collection.getName())
            throw new Error(`The provided id is for collection '${name}', not the expected collection '${collection.getName()}'.`)

          return primaryKey.read(key)
        },
      }])
    }

    // Add a field to select any value in the collection by any key. So all
    // unique keys of an object will be usable to select a single value.
    for (const key of collection.getKeys()) {
      const keyName = key.getName()
      const keyType = key.getType()
      const fields = keyType instanceof ObjectType && keyType.getFields()

      entries.push([formatName.field(`${type.getName()}-by-${keyName}`), {
        // TODO: description
        type: this.getType(collection),

        args:
          keyType instanceof ObjectType
            // If the key’s type is an object type, let’s flatten the fields
            // into arguments.
            ? buildObject<GraphQLArgumentConfig<any>>(
              fields.map<[string, GraphQLArgumentConfig<any>]>(field =>
                [formatName.arg(field.getName()), {
                  description: field.getDescription(),
                  type: this._typeForge.getInputType(field.getType()),
                }]
              )
            )
            // If the key’s type was not an object type, let’s just use a single
            // argument.
            : {
              [formatName.arg(keyName)]: {
                // TODO: description
                type: this._typeForge.getInputType(keyType),
              },
            },

        resolve: (source, args) => {
          // Get the value of the key from our arguments. If the type was an
          // object type we have to build our object from the flattened fields.
          const keyValue =
            keyType instanceof ObjectType
              ? keyType.createFromFieldValues(fields.map(field => args[formatName.arg(field.getName())]))
              : args[formatName.arg(keyName)]

          return key.read(keyValue)
        },
      }])
    }

    return entries
  }

  /**
   * Creates the output object type for a collection. This type will include all
   * of the fields in the object, as well as an id field, computed columns, and
   * relations (head and tail).
   */
  @memoize
  public getType <TValue>(collection: Collection<TValue>): GraphQLObjectType<TValue> {
    const type = collection.getType()
    const primaryKey = collection.getPrimaryKey()

    return new GraphQLObjectType<TValue>({
      name: formatName.type(type.getName()),
      description: type.getDescription(),

      isTypeOf: value => type.isTypeOf(value),

      // If there is a primary key, this is a node.
      interfaces: primaryKey ? [this._nodeForge.getInterfaceType()] : [],

      // We make `fields` here a thunk because we don’t want to eagerly create
      // types for collections used in this type.
      fields: () => buildObject<GraphQLFieldConfig<TValue, any>>(
        // Our id field. It is powered by the collection’s primary key. If we
        // have no primary key, we have no id field.
        [
          primaryKey && [this._options.nodeIdFieldName, {
            // TODO: description
            type: new GraphQLNonNull(GraphQLID),
            resolve: value =>
              id.serialize({
                name: collection.getName(),
                key: primaryKey.getKeyForValue(value),
              }),
          }],
        ],

        // Add all of the basic fields to our type.
        type.getFields().map(<O, F>(field: ObjectField<O, F>): [string, GraphQLFieldConfig<O, F>] =>
          [formatName.field(field.getName()), {
            description: field.getDescription(),
            type: this._typeForge.getOutputType(field.getType()),
            resolve: value => field.getFieldValueFromObject(value),
          }]
        ),

        // TODO: Computed fields

        // Add all of our many-to-one relations (aka tail relations).
        this._catalog.getRelations()
          // We only want the relations for which this collection is the tail
          // collection.
          .filter(relation => relation.getTailCollection() === collection)
          // Transform the relation into a field entry.
          .map(<THeadValue, TKey>(relation: Relation<TValue, THeadValue, TKey>): [string, GraphQLFieldConfig<TValue, THeadValue>] => {
            const headCollectionKey = relation.getHeadCollectionKey()
            const headCollection = headCollectionKey.getCollection()

            return [formatName.field(`${headCollection.getType().getName()}-by-${relation.getName()}`), {
              // TODO: description
              type: this.getType(headCollection),
              resolve: source => {
                const key = relation.getHeadKeyFromTailValue(source)
                return headCollectionKey.read(key)
              },
            }]
          }),

        // Add all of our one-to-many relations (aka head relations).
        this._catalog.getRelations()
          // We only want the relations for which this collection is the head
          // collection.
          .filter(relation => relation.getHeadCollectionKey().getCollection() === collection)
          // Transform the relation into a field entry.
          .map(<TTailValue, TKey>(relation: Relation<TTailValue, TValue, TKey>): [string, GraphQLFieldConfig<TValue, any>] | undefined => {
            const tailCollection = relation.getTailCollection()
            const tailPaginator = relation.getTailPaginator()

            if (!tailPaginator) return undefined

            return [
              formatName.field(`${tailCollection.getName()}-by-${relation.getName()}`),
              this._connectionForge.createField(tailPaginator, {
                // We use the config when creating a connection field to inject
                // a condition that limits what we select from the paginator.
                getCondition: (headValue: TValue) => relation.getTailConditionFromHeadValue(headValue),
              }),
            ]
          })
      ),
    })
  }
}

export default CollectionForge
