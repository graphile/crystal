import { PgDeleteSingleStep, PgExecutor, TYPES, assertPgClassSingleStep, makeRegistry, pgDeleteSingle, pgInsertSingle, pgSelectFromRecord, pgUpdateSingle, recordCodec, sqlValueWithCodec } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ObjectStep, __ValueStep, access, assertExecutableStep, bakedInputRuntime, connection, constant, context, createObjectAndApplyChildren, first, get as get2, inhibitOnNull, inspect, lambda, list, makeDecodeNodeId, makeGrafastSchema, object, rootValue, specFromNodeId } from "grafast";
import { GraphQLError, Kind } from "graphql";
import { sql } from "pg-sql2";
const nodeIdHandler_Query = {
  typeName: "Query",
  codec: {
    name: "raw",
    encode: Object.assign(function rawEncode(value) {
      return typeof value === "string" ? value : null;
    }, {
      isSyncAndSafe: true
    }),
    decode: Object.assign(function rawDecode(value) {
      return typeof value === "string" ? value : null;
    }, {
      isSyncAndSafe: true
    })
  },
  match(specifier) {
    return specifier === "query";
  },
  getIdentifiers(_value) {
    return [];
  },
  getSpec() {
    return "irrelevant";
  },
  get() {
    return rootValue();
  },
  plan() {
    return constant`query`;
  }
};
const nodeIdCodecs_base64JSON_base64JSON = {
  name: "base64JSON",
  encode: (() => {
    function base64JSONEncode(value) {
      return Buffer.from(JSON.stringify(value), "utf8").toString("base64");
    }
    base64JSONEncode.isSyncAndSafe = true; // Optimization
    return base64JSONEncode;
  })(),
  decode: (() => {
    function base64JSONDecode(value) {
      return JSON.parse(Buffer.from(value, "base64").toString("utf8"));
    }
    base64JSONDecode.isSyncAndSafe = true; // Optimization
    return base64JSONDecode;
  })()
};
const nodeIdCodecs = {
  __proto__: null,
  raw: nodeIdHandler_Query.codec,
  base64JSON: nodeIdCodecs_base64JSON_base64JSON,
  pipeString: {
    name: "pipeString",
    encode: Object.assign(function pipeStringEncode(value) {
      return Array.isArray(value) ? value.join("|") : null;
    }, {
      isSyncAndSafe: true
    }),
    decode: Object.assign(function pipeStringDecode(value) {
      return typeof value === "string" ? value.split("|") : null;
    }, {
      isSyncAndSafe: true
    })
  }
};
const executor = new PgExecutor({
  name: "main",
  context() {
    const ctx = context();
    return object({
      pgSettings: "pgSettings" != null ? ctx.get("pgSettings") : constant(null),
      withPgClient: ctx.get("withPgClient")
    });
  }
});
const networkIdentifier = sql.identifier("network_types", "network");
const networkCodec = recordCodec({
  name: "network",
  identifier: networkIdentifier,
  attributes: {
    __proto__: null,
    id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {}
      }
    },
    inet: {
      description: undefined,
      codec: TYPES.inet,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    cidr: {
      description: undefined,
      codec: TYPES.cidr,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    macaddr: {
      description: undefined,
      codec: TYPES.macaddr,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    }
  },
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "network_types",
      name: "network"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const networkUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const resource_networkPgResource = makeRegistry({
  pgExecutors: {
    __proto__: null,
    main: executor
  },
  pgCodecs: {
    __proto__: null,
    text: TYPES.text,
    varchar: TYPES.varchar,
    bpchar: TYPES.bpchar,
    int4: TYPES.int,
    inet: TYPES.inet,
    network: networkCodec,
    cidr: TYPES.cidr,
    macaddr: TYPES.macaddr
  },
  pgResources: {
    __proto__: null,
    network: {
      executor: executor,
      name: "network",
      identifier: "main.network_types.network",
      from: networkIdentifier,
      codec: networkCodec,
      uniques: networkUniques,
      isVirtual: false,
      description: undefined,
      extensions: {
        description: undefined,
        pg: {
          serviceName: "main",
          schemaName: "network_types",
          name: "network"
        },
        isInsertable: true,
        isUpdatable: true,
        isDeletable: true,
        tags: {}
      }
    }
  },
  pgRelations: {
    __proto__: null
  }
}).pgResources["network"];
const nodeIdHandler_Network = {
  typeName: "Network",
  codec: nodeIdCodecs_base64JSON_base64JSON,
  deprecationReason: undefined,
  plan($record) {
    return list([constant("networks", false), $record.get("id")]);
  },
  getSpec($list) {
    return {
      id: inhibitOnNull(access($list, [1]))
    };
  },
  getIdentifiers(value) {
    return value.slice(1);
  },
  get(spec) {
    return resource_networkPgResource.get(spec);
  },
  match(obj) {
    return obj[0] === "networks";
  }
};
function specForHandler(handler) {
  function spec(nodeId) {
    // We only want to return the specifier if it matches
    // this handler; otherwise return null.
    if (nodeId == null) return null;
    try {
      const specifier = handler.codec.decode(nodeId);
      if (handler.match(specifier)) {
        return specifier;
      }
    } catch {
      // Ignore errors
    }
    return null;
  }
  spec.displayName = `specifier_${handler.typeName}_${handler.codec.name}`;
  spec.isSyncAndSafe = true; // Optimization
  return spec;
}
const nodeFetcher_Network = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Network));
  return nodeIdHandler_Network.get(nodeIdHandler_Network.getSpec($decoded));
};
function qbWhereBuilder(qb) {
  return qb.whereBuilder();
}
const nodeIdHandlerByTypeName = {
  __proto__: null,
  Query: nodeIdHandler_Query,
  Network: nodeIdHandler_Network
};
const decodeNodeId = makeDecodeNodeId(Object.values(nodeIdHandlerByTypeName));
function findTypeNameMatch(specifier) {
  if (!specifier) return null;
  for (const [typeName, typeSpec] of Object.entries(nodeIdHandlerByTypeName)) {
    const value = specifier[typeSpec.codec.name];
    if (value != null && typeSpec.match(value)) {
      return typeName;
    }
  }
  return null;
}
function InternetAddressSerialize(value) {
  return "" + value;
}
const specFromArgs_Network = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Network, $nodeId);
};
const specFromArgs_Network2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Network, $nodeId);
};
const getPgSelectSingleFromMutationResult = (resource, pkAttributes, $mutation) => {
  const $result = $mutation.getStepForKey("result", true);
  if (!$result) return null;
  if ($result instanceof PgDeleteSingleStep) {
    return pgSelectFromRecord($result.resource, $result.record());
  } else {
    const spec = pkAttributes.reduce((memo, attributeName) => {
      memo[attributeName] = $result.get(attributeName);
      return memo;
    }, Object.create(null));
    return resource.find(spec);
  }
};
const pgMutationPayloadEdge = (resource, pkAttributes, $mutation, fieldArgs) => {
  const $select = getPgSelectSingleFromMutationResult(resource, pkAttributes, $mutation);
  if (!$select) return constant(null);
  fieldArgs.apply($select, "orderBy");
  const $connection = connection($select);
  return new EdgeStep($connection, first($connection));
};
export const typeDefs = /* GraphQL */`"""The root query type which gives access points into the data universe."""
type Query implements Node {
  """
  Exposes the root query type nested one level down. This is helpful for Relay 1
  which can only query top level fields if they are in a particular form.
  """
  query: Query!

  """
  The root query type must be a \`Node\` to work well with Relay 1 mutations. This just resolves to \`query\`.
  """
  nodeId: ID!

  """Fetches an object given its globally unique \`ID\`."""
  node(
    """The globally unique \`ID\`."""
    nodeId: ID!
  ): Node

  """Get a single \`Network\`."""
  networkById(id: Int!): Network

  """Reads a single \`Network\` using its globally unique \`ID\`."""
  network(
    """The globally unique \`ID\` to be used in selecting a single \`Network\`."""
    nodeId: ID!
  ): Network

  """Reads and enables pagination through a set of \`Network\`."""
  allNetworks(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Only read the last \`n\` values of the set."""
    last: Int

    """
    Skip the first \`n\` values from our \`after\` cursor, an alternative to cursor
    based pagination. May not be used with \`last\`.
    """
    offset: Int

    """Read all values in the set before (above) this cursor."""
    before: Cursor

    """Read all values in the set after (below) this cursor."""
    after: Cursor

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: NetworkCondition

    """The method to use when ordering \`Network\`."""
    orderBy: [NetworksOrderBy!] = [PRIMARY_KEY_ASC]
  ): NetworksConnection
}

"""An object with a globally unique \`ID\`."""
interface Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
}

type Network implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  inet: InternetAddress
  cidr: String
  macaddr: String
}

"""An IPv4 or IPv6 host address, and optionally its subnet."""
scalar InternetAddress

"""A connection to a list of \`Network\` values."""
type NetworksConnection {
  """A list of \`Network\` objects."""
  nodes: [Network]!

  """
  A list of edges which contains the \`Network\` and cursor to aid in pagination.
  """
  edges: [NetworksEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Network\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Network\` edge in the connection."""
type NetworksEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Network\` at the end of the edge."""
  node: Network
}

"""A location in a connection that can be used for resuming pagination."""
scalar Cursor

"""Information about pagination in a connection."""
type PageInfo {
  """When paginating forwards, are there more items?"""
  hasNextPage: Boolean!

  """When paginating backwards, are there more items?"""
  hasPreviousPage: Boolean!

  """When paginating backwards, the cursor to continue."""
  startCursor: Cursor

  """When paginating forwards, the cursor to continue."""
  endCursor: Cursor
}

"""
A condition to be used against \`Network\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input NetworkCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`inet\` field."""
  inet: InternetAddress

  """Checks for equality with the object’s \`cidr\` field."""
  cidr: String

  """Checks for equality with the object’s \`macaddr\` field."""
  macaddr: String
}

"""Methods to use when ordering \`Network\`."""
enum NetworksOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  INET_ASC
  INET_DESC
  CIDR_ASC
  CIDR_DESC
  MACADDR_ASC
  MACADDR_DESC
}

"""
The root mutation type which contains root level fields which mutate data.
"""
type Mutation {
  """Creates a single \`Network\`."""
  createNetwork(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateNetworkInput!
  ): CreateNetworkPayload

  """Updates a single \`Network\` using its globally unique id and a patch."""
  updateNetwork(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateNetworkInput!
  ): UpdateNetworkPayload

  """Updates a single \`Network\` using a unique key and a patch."""
  updateNetworkById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateNetworkByIdInput!
  ): UpdateNetworkPayload

  """Deletes a single \`Network\` using its globally unique id."""
  deleteNetwork(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteNetworkInput!
  ): DeleteNetworkPayload

  """Deletes a single \`Network\` using a unique key."""
  deleteNetworkById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteNetworkByIdInput!
  ): DeleteNetworkPayload
}

"""The output of our create \`Network\` mutation."""
type CreateNetworkPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Network\` that was created by this mutation."""
  network: Network

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Network\`. May be used by Relay 1."""
  networkEdge(
    """The method to use when ordering \`Network\`."""
    orderBy: [NetworksOrderBy!]! = [PRIMARY_KEY_ASC]
  ): NetworksEdge
}

"""All input for the create \`Network\` mutation."""
input CreateNetworkInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`Network\` to be created by this mutation."""
  network: NetworkInput!
}

"""An input for mutations affecting \`Network\`"""
input NetworkInput {
  id: Int
  inet: InternetAddress
  cidr: String
  macaddr: String
}

"""The output of our update \`Network\` mutation."""
type UpdateNetworkPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Network\` that was updated by this mutation."""
  network: Network

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Network\`. May be used by Relay 1."""
  networkEdge(
    """The method to use when ordering \`Network\`."""
    orderBy: [NetworksOrderBy!]! = [PRIMARY_KEY_ASC]
  ): NetworksEdge
}

"""All input for the \`updateNetwork\` mutation."""
input UpdateNetworkInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Network\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`Network\` being updated.
  """
  networkPatch: NetworkPatch!
}

"""
Represents an update to a \`Network\`. Fields that are set will be updated.
"""
input NetworkPatch {
  id: Int
  inet: InternetAddress
  cidr: String
  macaddr: String
}

"""All input for the \`updateNetworkById\` mutation."""
input UpdateNetworkByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`Network\` being updated.
  """
  networkPatch: NetworkPatch!
}

"""The output of our delete \`Network\` mutation."""
type DeleteNetworkPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Network\` that was deleted by this mutation."""
  network: Network
  deletedNetworkId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Network\`. May be used by Relay 1."""
  networkEdge(
    """The method to use when ordering \`Network\`."""
    orderBy: [NetworksOrderBy!]! = [PRIMARY_KEY_ASC]
  ): NetworksEdge
}

"""All input for the \`deleteNetwork\` mutation."""
input DeleteNetworkInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Network\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteNetworkById\` mutation."""
input DeleteNetworkByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!
}`;
export const objects = {
  Query: {
    assertStep() {
      return true;
    },
    plans: {
      allNetworks: {
        plan() {
          return connection(resource_networkPgResource.find());
        },
        args: {
          first(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          },
          last(_, $connection, val) {
            $connection.setLast(val.getRaw());
          },
          offset(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          },
          before(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          },
          after(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          },
          condition(_condition, $connection, arg) {
            const $select = $connection.getSubplan();
            arg.apply($select, qbWhereBuilder);
          },
          orderBy(parent, $connection, value) {
            const $select = $connection.getSubplan();
            value.apply($select);
          }
        }
      },
      network(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_Network($nodeId);
      },
      networkById(_$root, {
        $id
      }) {
        return resource_networkPgResource.get({
          id: $id
        });
      },
      node(_$root, fieldArgs) {
        return fieldArgs.getRaw("nodeId");
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_Query.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Query.codec.name].encode);
      },
      query() {
        return rootValue();
      }
    }
  },
  Mutation: {
    assertStep: __ValueStep,
    plans: {
      createNetwork: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_networkPgResource, Object.create(null));
          args.apply($insert);
          const plan = object({
            result: $insert
          });
          return plan;
        },
        args: {
          input(_, $object) {
            return $object;
          }
        }
      },
      deleteNetwork: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_networkPgResource, specFromArgs_Network2(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input(_, $object) {
            return $object;
          }
        }
      },
      deleteNetworkById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_networkPgResource, {
            id: args.getRaw(['input', "id"])
          });
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input(_, $object) {
            return $object;
          }
        }
      },
      updateNetwork: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_networkPgResource, specFromArgs_Network(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input(_, $object) {
            return $object;
          }
        }
      },
      updateNetworkById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_networkPgResource, {
            id: args.getRaw(['input', "id"])
          });
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input(_, $object) {
            return $object;
          }
        }
      }
    }
  },
  CreateNetworkPayload: {
    assertStep: assertExecutableStep,
    plans: {
      clientMutationId($mutation) {
        const $insert = $mutation.getStepForKey("result");
        return $insert.getMeta("clientMutationId");
      },
      network($object) {
        return $object.get("result");
      },
      networkEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_networkPgResource, networkUniques[0].attributes, $mutation, fieldArgs);
      },
      query() {
        return rootValue();
      }
    }
  },
  DeleteNetworkPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      deletedNetworkId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Network.plan($record);
        return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
      },
      network($object) {
        return $object.get("result");
      },
      networkEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_networkPgResource, networkUniques[0].attributes, $mutation, fieldArgs);
      },
      query() {
        return rootValue();
      }
    }
  },
  Network: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nodeId($parent) {
        const specifier = nodeIdHandler_Network.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Network.codec.name].encode);
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of networkUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_networkPgResource.get(spec);
    }
  },
  NetworksConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
      }
    }
  },
  UpdateNetworkPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      network($object) {
        return $object.get("result");
      },
      networkEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_networkPgResource, networkUniques[0].attributes, $mutation, fieldArgs);
      },
      query() {
        return rootValue();
      }
    }
  }
};
export const interfaces = {
  Node: {
    planType($nodeId) {
      const $specifier = decodeNodeId($nodeId);
      const $__typename = lambda($specifier, findTypeNameMatch, true);
      return {
        $__typename,
        planForType(type) {
          const spec = nodeIdHandlerByTypeName[type.name];
          if (spec) {
            return spec.get(spec.getSpec(access($specifier, [spec.codec.name])));
          } else {
            throw new Error(`Failed to find handler for ${type.name}`);
          }
        }
      };
    }
  }
};
export const inputObjects = {
  CreateNetworkInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      network(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  DeleteNetworkByIdInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeleteNetworkInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  NetworkCondition: {
    plans: {
      cidr($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "cidr",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.cidr)}`;
          }
        });
      },
      id($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
      },
      inet($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "inet",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.inet)}`;
          }
        });
      },
      macaddr($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "macaddr",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.macaddr)}`;
          }
        });
      }
    }
  },
  NetworkInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      cidr(obj, val, {
        field,
        schema
      }) {
        obj.set("cidr", bakedInputRuntime(schema, field.type, val));
      },
      id(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      },
      inet(obj, val, {
        field,
        schema
      }) {
        obj.set("inet", bakedInputRuntime(schema, field.type, val));
      },
      macaddr(obj, val, {
        field,
        schema
      }) {
        obj.set("macaddr", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  NetworkPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      cidr(obj, val, {
        field,
        schema
      }) {
        obj.set("cidr", bakedInputRuntime(schema, field.type, val));
      },
      id(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      },
      inet(obj, val, {
        field,
        schema
      }) {
        obj.set("inet", bakedInputRuntime(schema, field.type, val));
      },
      macaddr(obj, val, {
        field,
        schema
      }) {
        obj.set("macaddr", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  UpdateNetworkByIdInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      networkPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  UpdateNetworkInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      networkPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  }
};
export const scalars = {
  Cursor: {
    serialize: InternetAddressSerialize,
    parseValue: InternetAddressSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"Cursor" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
    }
  },
  InternetAddress: {
    serialize: InternetAddressSerialize,
    parseValue: InternetAddressSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"InternetAddress" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
    }
  }
};
export const enums = {
  NetworksOrderBy: {
    values: {
      CIDR_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "cidr",
          direction: "ASC"
        });
      },
      CIDR_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "cidr",
          direction: "DESC"
        });
      },
      ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
      },
      INET_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "inet",
          direction: "ASC"
        });
      },
      INET_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "inet",
          direction: "DESC"
        });
      },
      MACADDR_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "macaddr",
          direction: "ASC"
        });
      },
      MACADDR_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "macaddr",
          direction: "DESC"
        });
      },
      PRIMARY_KEY_ASC(queryBuilder) {
        networkUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        networkUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      }
    }
  }
};
export const schema = makeGrafastSchema({
  typeDefs: typeDefs,
  objects: objects,
  interfaces: interfaces,
  inputObjects: inputObjects,
  scalars: scalars,
  enums: enums
});
