import { PgDeleteSingleStep, PgExecutor, TYPES, assertPgClassSingleStep, makeRegistry, pgDeleteSingle, pgInsertSingle, pgSelectFromRecord, pgUpdateSingle, recordCodec, sqlValueWithCodec } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ObjectStep, __ValueStep, access, assertExecutableStep, bakedInputRuntime, connection, constant, context, createObjectAndApplyChildren, first, get as get2, inhibitOnNull, inspect, lambda, list, makeDecodeNodeId, makeDecodeNodeIdRuntime, makeGrafastSchema, object, rootValue, specFromNodeId } from "grafast";
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
const barIdentifier = sql.identifier("issue_2334", "bar");
const barCodec = recordCodec({
  name: "bar",
  identifier: barIdentifier,
  attributes: {
    __proto__: null,
    id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: false
      }
    },
    col: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    }
  },
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "issue_2334",
      name: "bar"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const fooIdentifier = sql.identifier("issue_2334", "foo");
const fooCodec = recordCodec({
  name: "foo",
  identifier: fooIdentifier,
  attributes: {
    __proto__: null,
    id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: false
      }
    },
    col: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    }
  },
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "issue_2334",
      name: "foo"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const barUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const registryConfig_pgResources_bar_bar = {
  executor: executor,
  name: "bar",
  identifier: "main.issue_2334.bar",
  from: barIdentifier,
  codec: barCodec,
  uniques: barUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "issue_2334",
      name: "bar"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {},
    canSelect: true,
    canInsert: true,
    canUpdate: true,
    canDelete: true
  }
};
const fooUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const registryConfig_pgResources_foo_foo = {
  executor: executor,
  name: "foo",
  identifier: "main.issue_2334.foo",
  from: fooIdentifier,
  codec: fooCodec,
  uniques: fooUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "issue_2334",
      name: "foo"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {},
    canSelect: true,
    canInsert: true,
    canUpdate: true,
    canDelete: true
  }
};
const registryConfig = {
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
    bar: barCodec,
    foo: fooCodec
  },
  pgResources: {
    __proto__: null,
    bar: registryConfig_pgResources_bar_bar,
    foo: registryConfig_pgResources_foo_foo
  },
  pgRelations: {
    __proto__: null,
    bar: {
      __proto__: null,
      fooByMyId: {
        localCodec: barCodec,
        remoteResourceOptions: registryConfig_pgResources_foo_foo,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["id"],
        isUnique: true,
        isReferencee: false,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      }
    },
    foo: {
      __proto__: null,
      barByTheirId: {
        localCodec: fooCodec,
        remoteResourceOptions: registryConfig_pgResources_bar_bar,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["id"],
        isUnique: true,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      }
    }
  }
};
const registry = makeRegistry(registryConfig);
const pgResource_barPgResource = registry.pgResources["bar"];
const nodeIdHandler_Bar = {
  typeName: "Bar",
  codec: nodeIdCodecs_base64JSON_base64JSON,
  deprecationReason: undefined,
  plan($record) {
    return list([constant("bars", false), $record.get("id")]);
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
    return pgResource_barPgResource.get(spec);
  },
  match(obj) {
    return obj[0] === "bars";
  }
};
const specForHandlerCache = new Map();
function specForHandler(handler) {
  const existing = specForHandlerCache.get(handler);
  if (existing) {
    return existing;
  }
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
  specForHandlerCache.set(handler, spec);
  return spec;
}
const nodeFetcher_Bar = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Bar));
  return nodeIdHandler_Bar.get(nodeIdHandler_Bar.getSpec($decoded));
};
const pgResource_fooPgResource = registry.pgResources["foo"];
const nodeIdHandler_Foo = {
  typeName: "Foo",
  codec: nodeIdCodecs_base64JSON_base64JSON,
  deprecationReason: undefined,
  plan($record) {
    return list([constant("foos", false), $record.get("id")]);
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
    return pgResource_fooPgResource.get(spec);
  },
  match(obj) {
    return obj[0] === "foos";
  }
};
const nodeFetcher_Foo = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Foo));
  return nodeIdHandler_Foo.get(nodeIdHandler_Foo.getSpec($decoded));
};
function qbWhereBuilder(qb) {
  return qb.whereBuilder();
}
const nodeIdHandlerByTypeName = {
  __proto__: null,
  Query: nodeIdHandler_Query,
  Bar: nodeIdHandler_Bar,
  Foo: nodeIdHandler_Foo
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
function CursorSerialize(value) {
  return "" + value;
}
const handlers = [nodeIdHandler_Foo];
const decodeNodeId2 = makeDecodeNodeIdRuntime(handlers);
const getIdentifiers = nodeId => {
  const specifier = decodeNodeId2(nodeId);
  if (specifier == null) return null;
  for (const handler of handlers) {
    const value = specifier?.[handler.codec.name];
    const match = value != null ? handler.match(value) : false;
    if (match) {
      return handler.getIdentifiers(value);
    }
  }
  return null;
};
const localAttributeCodecs = [TYPES.int];
const specFromArgs_Bar = args => {
  const $nodeId = args.getRaw(["input", "id"]);
  return specFromNodeId(nodeIdHandler_Bar, $nodeId);
};
const specFromArgs_Foo = args => {
  const $nodeId = args.getRaw(["input", "id"]);
  return specFromNodeId(nodeIdHandler_Foo, $nodeId);
};
const specFromArgs_Bar2 = args => {
  const $nodeId = args.getRaw(["input", "id"]);
  return specFromNodeId(nodeIdHandler_Bar, $nodeId);
};
const specFromArgs_Foo2 = args => {
  const $nodeId = args.getRaw(["input", "id"]);
  return specFromNodeId(nodeIdHandler_Foo, $nodeId);
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
const handlers2 = [nodeIdHandler_Foo];
const decodeNodeId3 = makeDecodeNodeIdRuntime(handlers2);
const getIdentifiers2 = nodeId => {
  const specifier = decodeNodeId3(nodeId);
  if (specifier == null) return null;
  for (const handler of handlers2) {
    const value = specifier?.[handler.codec.name];
    const match = value != null ? handler.match(value) : false;
    if (match) {
      return handler.getIdentifiers(value);
    }
  }
  return null;
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
  id: ID!

  """Fetches an object given its globally unique \`ID\`."""
  node(
    """The globally unique \`ID\`."""
    id: ID!
  ): Node

  """Reads a single \`Bar\` using its globally unique \`ID\`."""
  bar(
    """The globally unique \`ID\` to be used in selecting a single \`Bar\`."""
    id: ID!
  ): Bar

  """Reads a single \`Foo\` using its globally unique \`ID\`."""
  foo(
    """The globally unique \`ID\` to be used in selecting a single \`Foo\`."""
    id: ID!
  ): Foo

  """Reads and enables pagination through a set of \`Bar\`."""
  allBars(
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
    condition: BarCondition

    """The method to use when ordering \`Bar\`."""
    orderBy: [BarsOrderBy!] = [PRIMARY_KEY_ASC]
  ): BarsConnection

  """Reads and enables pagination through a set of \`Foo\`."""
  allFoos(
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
    condition: FooCondition

    """The method to use when ordering \`Foo\`."""
    orderBy: [FoosOrderBy!] = [PRIMARY_KEY_ASC]
  ): FoosConnection
}

"""An object with a globally unique \`ID\`."""
interface Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  id: ID!
}

type Bar implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  id: ID!
  col: String

  """Reads a single \`Foo\` that is related to this \`Bar\`."""
  fooByRowId: Foo
}

type Foo implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  id: ID!
  col: String

  """Reads a single \`Bar\` that is related to this \`Foo\`."""
  barByRowId: Bar
}

"""A connection to a list of \`Bar\` values."""
type BarsConnection {
  """A list of \`Bar\` objects."""
  nodes: [Bar]!

  """
  A list of edges which contains the \`Bar\` and cursor to aid in pagination.
  """
  edges: [BarsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Bar\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Bar\` edge in the connection."""
type BarsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Bar\` at the end of the edge."""
  node: Bar
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
A condition to be used against \`Bar\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input BarCondition {
  """Checks for equality with the object’s \`col\` field."""
  col: String
  fooByRowId: ID
}

"""Methods to use when ordering \`Bar\`."""
enum BarsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  COL_ASC
  COL_DESC
}

"""A connection to a list of \`Foo\` values."""
type FoosConnection {
  """A list of \`Foo\` objects."""
  nodes: [Foo]!

  """
  A list of edges which contains the \`Foo\` and cursor to aid in pagination.
  """
  edges: [FoosEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Foo\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Foo\` edge in the connection."""
type FoosEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Foo\` at the end of the edge."""
  node: Foo
}

"""
A condition to be used against \`Foo\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input FooCondition {
  """Checks for equality with the object’s \`col\` field."""
  col: String
}

"""Methods to use when ordering \`Foo\`."""
enum FoosOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  COL_ASC
  COL_DESC
}

"""
The root mutation type which contains root level fields which mutate data.
"""
type Mutation {
  """Creates a single \`Bar\`."""
  createBar(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateBarInput!
  ): CreateBarPayload

  """Creates a single \`Foo\`."""
  createFoo(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateFooInput!
  ): CreateFooPayload

  """Updates a single \`Bar\` using its globally unique id and a patch."""
  updateBar(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateBarInput!
  ): UpdateBarPayload

  """Updates a single \`Foo\` using its globally unique id and a patch."""
  updateFoo(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateFooInput!
  ): UpdateFooPayload

  """Deletes a single \`Bar\` using its globally unique id."""
  deleteBar(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteBarInput!
  ): DeleteBarPayload

  """Deletes a single \`Foo\` using its globally unique id."""
  deleteFoo(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteFooInput!
  ): DeleteFooPayload
}

"""The output of our create \`Bar\` mutation."""
type CreateBarPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Bar\` that was created by this mutation."""
  bar: Bar

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Bar\`. May be used by Relay 1."""
  barEdge(
    """The method to use when ordering \`Bar\`."""
    orderBy: [BarsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): BarsEdge
}

"""All input for the create \`Bar\` mutation."""
input CreateBarInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`Bar\` to be created by this mutation."""
  bar: BarInput!
}

"""An input for mutations affecting \`Bar\`"""
input BarInput {
  col: String
  fooByRowId: ID!
}

"""The output of our create \`Foo\` mutation."""
type CreateFooPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Foo\` that was created by this mutation."""
  foo: Foo

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Foo\`. May be used by Relay 1."""
  fooEdge(
    """The method to use when ordering \`Foo\`."""
    orderBy: [FoosOrderBy!]! = [PRIMARY_KEY_ASC]
  ): FoosEdge
}

"""All input for the create \`Foo\` mutation."""
input CreateFooInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`Foo\` to be created by this mutation."""
  foo: FooInput!
}

"""An input for mutations affecting \`Foo\`"""
input FooInput {
  rowId: Int!
  col: String
}

"""The output of our update \`Bar\` mutation."""
type UpdateBarPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Bar\` that was updated by this mutation."""
  bar: Bar

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Bar\`. May be used by Relay 1."""
  barEdge(
    """The method to use when ordering \`Bar\`."""
    orderBy: [BarsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): BarsEdge
}

"""All input for the \`updateBar\` mutation."""
input UpdateBarInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Bar\` to be updated.
  """
  id: ID!

  """
  An object where the defined keys will be set on the \`Bar\` being updated.
  """
  barPatch: BarPatch!
}

"""Represents an update to a \`Bar\`. Fields that are set will be updated."""
input BarPatch {
  col: String
}

"""The output of our update \`Foo\` mutation."""
type UpdateFooPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Foo\` that was updated by this mutation."""
  foo: Foo

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Foo\`. May be used by Relay 1."""
  fooEdge(
    """The method to use when ordering \`Foo\`."""
    orderBy: [FoosOrderBy!]! = [PRIMARY_KEY_ASC]
  ): FoosEdge
}

"""All input for the \`updateFoo\` mutation."""
input UpdateFooInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Foo\` to be updated.
  """
  id: ID!

  """
  An object where the defined keys will be set on the \`Foo\` being updated.
  """
  fooPatch: FooPatch!
}

"""Represents an update to a \`Foo\`. Fields that are set will be updated."""
input FooPatch {
  col: String
}

"""The output of our delete \`Bar\` mutation."""
type DeleteBarPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Bar\` that was deleted by this mutation."""
  bar: Bar
  deletedBarId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Bar\`. May be used by Relay 1."""
  barEdge(
    """The method to use when ordering \`Bar\`."""
    orderBy: [BarsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): BarsEdge
}

"""All input for the \`deleteBar\` mutation."""
input DeleteBarInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Bar\` to be deleted.
  """
  id: ID!
}

"""The output of our delete \`Foo\` mutation."""
type DeleteFooPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Foo\` that was deleted by this mutation."""
  foo: Foo
  deletedFooId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Foo\`. May be used by Relay 1."""
  fooEdge(
    """The method to use when ordering \`Foo\`."""
    orderBy: [FoosOrderBy!]! = [PRIMARY_KEY_ASC]
  ): FoosEdge
}

"""All input for the \`deleteFoo\` mutation."""
input DeleteFooInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Foo\` to be deleted.
  """
  id: ID!
}`;
export const objects = {
  Query: {
    assertStep() {
      return true;
    },
    plans: {
      allBars: {
        plan() {
          return connection(pgResource_barPgResource.find());
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
      allFoos: {
        plan() {
          return connection(pgResource_fooPgResource.find());
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
      bar(_$parent, args) {
        const $nodeId = args.getRaw("id");
        return nodeFetcher_Bar($nodeId);
      },
      foo(_$parent, args) {
        const $nodeId = args.getRaw("id");
        return nodeFetcher_Foo($nodeId);
      },
      id($parent) {
        const specifier = nodeIdHandler_Query.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Query.codec.name].encode);
      },
      node(_$root, fieldArgs) {
        return fieldArgs.getRaw("id");
      },
      query() {
        return rootValue();
      }
    }
  },
  Mutation: {
    assertStep: __ValueStep,
    plans: {
      createBar: {
        plan(_, args) {
          const $insert = pgInsertSingle(pgResource_barPgResource, Object.create(null));
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
      createFoo: {
        plan(_, args) {
          const $insert = pgInsertSingle(pgResource_fooPgResource, Object.create(null));
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
      deleteBar: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(pgResource_barPgResource, specFromArgs_Bar2(args));
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
      deleteFoo: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(pgResource_fooPgResource, specFromArgs_Foo2(args));
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
      updateBar: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(pgResource_barPgResource, specFromArgs_Bar(args));
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
      updateFoo: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(pgResource_fooPgResource, specFromArgs_Foo(args));
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
  Bar: {
    assertStep: assertPgClassSingleStep,
    plans: {
      fooByRowId($record) {
        return pgResource_fooPgResource.get({
          id: $record.get("id")
        });
      },
      id($parent) {
        const specifier = nodeIdHandler_Bar.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Bar.codec.name].encode);
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of barUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return pgResource_barPgResource.get(spec);
    }
  },
  BarsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
      }
    }
  },
  CreateBarPayload: {
    assertStep: assertExecutableStep,
    plans: {
      bar($object) {
        return $object.get("result");
      },
      barEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(pgResource_barPgResource, barUniques[0].attributes, $mutation, fieldArgs);
      },
      clientMutationId($mutation) {
        const $insert = $mutation.getStepForKey("result");
        return $insert.getMeta("clientMutationId");
      },
      query() {
        return rootValue();
      }
    }
  },
  CreateFooPayload: {
    assertStep: assertExecutableStep,
    plans: {
      clientMutationId($mutation) {
        const $insert = $mutation.getStepForKey("result");
        return $insert.getMeta("clientMutationId");
      },
      foo($object) {
        return $object.get("result");
      },
      fooEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(pgResource_fooPgResource, fooUniques[0].attributes, $mutation, fieldArgs);
      },
      query() {
        return rootValue();
      }
    }
  },
  DeleteBarPayload: {
    assertStep: ObjectStep,
    plans: {
      bar($object) {
        return $object.get("result");
      },
      barEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(pgResource_barPgResource, barUniques[0].attributes, $mutation, fieldArgs);
      },
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      deletedBarId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Bar.plan($record);
        return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
      },
      query() {
        return rootValue();
      }
    }
  },
  DeleteFooPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      deletedFooId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Foo.plan($record);
        return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
      },
      foo($object) {
        return $object.get("result");
      },
      fooEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(pgResource_fooPgResource, fooUniques[0].attributes, $mutation, fieldArgs);
      },
      query() {
        return rootValue();
      }
    }
  },
  Foo: {
    assertStep: assertPgClassSingleStep,
    plans: {
      barByRowId($record) {
        return pgResource_barPgResource.get({
          id: $record.get("id")
        });
      },
      id($parent) {
        const specifier = nodeIdHandler_Foo.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Foo.codec.name].encode);
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of fooUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return pgResource_fooPgResource.get(spec);
    }
  },
  FoosConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
      }
    }
  },
  UpdateBarPayload: {
    assertStep: ObjectStep,
    plans: {
      bar($object) {
        return $object.get("result");
      },
      barEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(pgResource_barPgResource, barUniques[0].attributes, $mutation, fieldArgs);
      },
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      query() {
        return rootValue();
      }
    }
  },
  UpdateFooPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      foo($object) {
        return $object.get("result");
      },
      fooEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(pgResource_fooPgResource, fooUniques[0].attributes, $mutation, fieldArgs);
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
  BarCondition: {
    plans: {
      col($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "col",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
          }
        });
      },
      fooByRowId(condition, nodeId) {
        if (nodeId === undefined) {
          return;
        } else if (nodeId === null) {
          for (const localName of registryConfig.pgRelations.bar.fooByMyId.localAttributes) {
            condition.where({
              type: "attribute",
              attribute: localName,
              callback(expression) {
                return sql`${expression} is null`;
              }
            });
          }
          return;
        } else if (typeof nodeId !== "string") {
          throw new Error(`Invalid node identifier for '${"Foo"}'; expected string`);
        } else {
          const identifiers = getIdentifiers(nodeId);
          if (identifiers == null) {
            throw new Error(`Invalid node identifier for '${"Foo"}'`);
          }
          for (let i = 0; i < 1; i++) {
            const localName = registryConfig.pgRelations.bar.fooByMyId.localAttributes[i];
            const value = identifiers[i];
            if (value == null) {
              condition.where({
                type: "attribute",
                attribute: localName,
                callback(expression) {
                  return sql`${expression} is null`;
                }
              });
            } else {
              const codec = localAttributeCodecs[i];
              const sqlRemoteValue = sqlValueWithCodec(value, codec);
              condition.where({
                type: "attribute",
                attribute: localName,
                callback(expression) {
                  return sql`${expression} = ${sqlRemoteValue}`;
                }
              });
            }
          }
        }
      }
    }
  },
  BarInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      col(obj, val, {
        field,
        schema
      }) {
        obj.set("col", bakedInputRuntime(schema, field.type, val));
      },
      fooByRowId(record, nodeId) {
        if (nodeId === undefined) {
          return;
        } else if (nodeId === null) {
          for (const localName of registryConfig.pgRelations.bar.fooByMyId.localAttributes) {
            record.set(localName, null);
          }
          return;
        } else if (typeof nodeId !== "string") {
          throw new Error(`Invalid node identifier for '${"Foo"}'; expected string`);
        } else {
          const identifiers = getIdentifiers2(nodeId);
          if (identifiers == null) {
            throw new Error(`Invalid node identifier for '${"Foo"}': ${JSON.stringify(nodeId)}`);
          }
          for (let i = 0; i < 1; i++) {
            const localName = registryConfig.pgRelations.bar.fooByMyId.localAttributes[i];
            record.set(localName, identifiers[i]);
          }
        }
      }
    }
  },
  BarPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      col(obj, val, {
        field,
        schema
      }) {
        obj.set("col", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  CreateBarInput: {
    plans: {
      bar(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      },
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  CreateFooInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      foo(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  DeleteBarInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeleteFooInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  FooCondition: {
    plans: {
      col($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "col",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
          }
        });
      }
    }
  },
  FooInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      col(obj, val, {
        field,
        schema
      }) {
        obj.set("col", bakedInputRuntime(schema, field.type, val));
      },
      rowId(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  FooPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      col(obj, val, {
        field,
        schema
      }) {
        obj.set("col", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  UpdateBarInput: {
    plans: {
      barPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      },
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  UpdateFooInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      fooPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  }
};
export const scalars = {
  Cursor: {
    serialize: CursorSerialize,
    parseValue: CursorSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"Cursor" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
    }
  }
};
export const enums = {
  BarsOrderBy: {
    values: {
      COL_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col",
          direction: "ASC"
        });
      },
      COL_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col",
          direction: "DESC"
        });
      },
      PRIMARY_KEY_ASC(queryBuilder) {
        barUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        barUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      }
    }
  },
  FoosOrderBy: {
    values: {
      COL_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col",
          direction: "ASC"
        });
      },
      COL_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col",
          direction: "DESC"
        });
      },
      PRIMARY_KEY_ASC(queryBuilder) {
        fooUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        fooUniques[0].attributes.forEach(attributeName => {
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
