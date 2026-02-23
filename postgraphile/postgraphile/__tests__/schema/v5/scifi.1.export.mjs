import { PgDeleteSingleStep, PgExecutor, TYPES, assertPgClassSingleStep, enumCodec, makeRegistry, pgDeleteSingle, pgInsertSingle, pgSelectFromRecord, pgUpdateSingle, recordCodec, sqlValueWithCodec } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ObjectStep, __ValueStep, access, assertStep, bakedInputRuntime, connection, constant, context, createObjectAndApplyChildren, first, get as get2, inhibitOnNull, inspect, lambda, list, makeDecodeNodeId, makeGrafastSchema, markSyncAndSafe, object, rootValue, specFromNodeId } from "grafast";
import { GraphQLError, Kind } from "graphql";
import { sql } from "pg-sql2";
const rawNodeIdCodec = {
  name: "raw",
  encode: markSyncAndSafe(function rawEncode(value) {
    return typeof value === "string" ? value : null;
  }),
  decode: markSyncAndSafe(function rawDecode(value) {
    return typeof value === "string" ? value : null;
  })
};
const nodeIdHandler_Query = {
  typeName: "Query",
  codec: rawNodeIdCodec,
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
const base64JSONNodeIdCodec = {
  name: "base64JSON",
  encode: markSyncAndSafe(function base64JSONEncode(value) {
    return Buffer.from(JSON.stringify(value), "utf8").toString("base64");
  }),
  decode: markSyncAndSafe(function base64JSONDecode(value) {
    return JSON.parse(Buffer.from(value, "base64").toString("utf8"));
  })
};
const nodeIdCodecs = {
  __proto__: null,
  raw: rawNodeIdCodec,
  base64JSON: base64JSONNodeIdCodec,
  pipeString: {
    name: "pipeString",
    encode: markSyncAndSafe(function pipeStringEncode(value) {
      return Array.isArray(value) ? value.join("|") : null;
    }),
    decode: markSyncAndSafe(function pipeStringDecode(value) {
      return typeof value === "string" ? value.split("|") : null;
    })
  }
};
const executor = new PgExecutor({
  name: "main",
  context() {
    const ctx = context();
    return object({
      pgSettings: ctx.get("pgSettings"),
      withPgClient: ctx.get("withPgClient")
    });
  }
});
const accessoryIdentifier = sql.identifier("scifi", "Accessory");
const accessoryCodec = recordCodec({
  name: "accessory",
  identifier: accessoryIdentifier,
  attributes: {
    __proto__: null,
    Name: {
      codec: TYPES.varchar,
      notNull: true
    },
    Id: {
      codec: TYPES.int,
      notNull: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "scifi",
      name: "Accessory"
    }
  },
  executor: executor
});
const AccessoryUniques = [{
  attributes: ["Id"],
  isPrimary: true
}];
const resource_AccessoryPgResource = makeRegistry({
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
    accessory: accessoryCodec,
    LetterAToDEnum: enumCodec({
      name: "LetterAToDEnum",
      identifier: TYPES.text.sqlType,
      values: [{
        value: "A",
        description: "The letter A"
      }, {
        value: "B",
        description: "The letter B"
      }, {
        value: "C",
        description: "The letter C"
      }, {
        value: "D",
        description: "The letter D"
      }],
      extensions: {
        isEnumTableEnum: true,
        enumTableEnumDetails: {
          serviceName: "main",
          schemaName: "enum_tables",
          tableName: "abcd",
          constraintType: "p",
          constraintName: "abcd_pkey"
        },
        tags: {
          name: "LetterAToD"
        }
      }
    }),
    LetterAToDViaViewEnum: enumCodec({
      name: "LetterAToDViaViewEnum",
      identifier: TYPES.text.sqlType,
      values: [{
        value: "A",
        description: "The letter A"
      }, {
        value: "B",
        description: "The letter B"
      }, {
        value: "C",
        description: "The letter C"
      }, {
        value: "D",
        description: "The letter D"
      }],
      extensions: {
        isEnumTableEnum: true,
        enumTableEnumDetails: {
          serviceName: "main",
          schemaName: "enum_tables",
          tableName: "abcd_view",
          constraintType: "p",
          constraintName: "FAKE_enum_tables_abcd_view_primaryKey_4"
        },
        tags: {
          name: "LetterAToDViaView"
        }
      }
    }),
    EnumTheFirstEnum: enumCodec({
      name: "EnumTheFirstEnum",
      identifier: TYPES.text.sqlType,
      values: [{
        value: "a1",
        description: "Desc A1"
      }, {
        value: "a2",
        description: "Desc A2"
      }, {
        value: "a3",
        description: "Desc A3"
      }, {
        value: "a4",
        description: "Desc A4"
      }],
      extensions: {
        isEnumTableEnum: true,
        enumTableEnumDetails: {
          serviceName: "main",
          schemaName: "enum_tables",
          tableName: "lots_of_enums",
          constraintType: "u",
          constraintName: "enum_1"
        },
        tags: {
          name: "EnumTheFirst"
        }
      }
    }),
    EnumTheSecondEnum: enumCodec({
      name: "EnumTheSecondEnum",
      identifier: TYPES.varchar.sqlType,
      values: [{
        value: "b1",
        description: "Desc B1"
      }, {
        value: "b2",
        description: "Desc B2"
      }, {
        value: "b3",
        description: "Desc B3"
      }, {
        value: "b4",
        description: "Desc B4"
      }],
      extensions: {
        isEnumTableEnum: true,
        enumTableEnumDetails: {
          serviceName: "main",
          schemaName: "enum_tables",
          tableName: "lots_of_enums",
          constraintType: "u",
          constraintName: "enum_2"
        },
        tags: {
          name: "EnumTheSecond"
        }
      }
    }),
    EnumTablesLotsOfEnumEnum3Enum: enumCodec({
      name: "EnumTablesLotsOfEnumEnum3Enum",
      identifier: TYPES.bpchar.sqlType,
      values: [{
        value: "c1",
        description: "Desc C1"
      }, {
        value: "c2",
        description: "Desc C2"
      }, {
        value: "c3",
        description: "Desc C3"
      }, {
        value: "c4",
        description: "Desc C4"
      }],
      extensions: {
        isEnumTableEnum: true,
        enumTableEnumDetails: {
          serviceName: "main",
          schemaName: "enum_tables",
          tableName: "lots_of_enums",
          constraintType: "u",
          constraintName: "enum_3"
        },
        tags: {
          name: "EnumTablesLotsOfEnumEnum3"
        }
      }
    }),
    EnumTablesLotsOfEnumEnum4Enum: enumCodec({
      name: "EnumTablesLotsOfEnumEnum4Enum",
      identifier: TYPES.text.sqlType,
      values: [{
        value: "d1",
        description: "Desc D1"
      }, {
        value: "d2",
        description: "Desc D2"
      }, {
        value: "d3",
        description: "Desc D3"
      }, {
        value: "d4",
        description: "Desc D4"
      }],
      extensions: {
        isEnumTableEnum: true,
        enumTableEnumDetails: {
          serviceName: "main",
          schemaName: "enum_tables",
          tableName: "lots_of_enums",
          constraintType: "u",
          constraintName: "enum_4"
        },
        tags: {
          name: "EnumTablesLotsOfEnumEnum4"
        }
      }
    }),
    EnumTablesSimpleEnumEnum: enumCodec({
      name: "EnumTablesSimpleEnumEnum",
      identifier: TYPES.text.sqlType,
      values: [{
        value: "Foo",
        description: "The first metasyntactic variable"
      }, {
        value: "Bar",
        description: null
      }, {
        value: "Baz",
        description: "The third metasyntactic variable, very similar to its predecessor"
      }, {
        value: "Qux",
        description: null
      }],
      extensions: {
        isEnumTableEnum: true,
        enumTableEnumDetails: {
          serviceName: "main",
          schemaName: "enum_tables",
          tableName: "simple_enum",
          constraintType: "p",
          constraintName: "simple_enum_pkey"
        },
        tags: {
          name: "EnumTablesSimpleEnum"
        }
      }
    }),
    PartitionsEntityKindEnum: enumCodec({
      name: "PartitionsEntityKindEnum",
      identifier: TYPES.text.sqlType,
      values: [{
        value: "photos",
        description: undefined
      }, {
        value: "locations",
        description: undefined
      }, {
        value: "profiles",
        description: undefined
      }],
      extensions: {
        isEnumTableEnum: true,
        enumTableEnumDetails: {
          serviceName: "main",
          schemaName: "partitions",
          tableName: "entity_kinds",
          constraintType: "p",
          constraintName: "entity_kinds_pkey"
        },
        tags: {
          name: "PartitionsEntityKind"
        }
      }
    }),
    FunctionReturningEnumEnumTableTransportationEnum: enumCodec({
      name: "FunctionReturningEnumEnumTableTransportationEnum",
      identifier: TYPES.text.sqlType,
      values: [{
        value: "CAR",
        description: undefined
      }, {
        value: "BIKE",
        description: undefined
      }, {
        value: "SUBWAY",
        description: undefined
      }],
      extensions: {
        isEnumTableEnum: true,
        enumTableEnumDetails: {
          serviceName: "main",
          schemaName: "function_returning_enum",
          tableName: "enum_table",
          constraintType: "u",
          constraintName: "transportation_enum"
        },
        tags: {
          name: "FunctionReturningEnumEnumTableTransportation"
        }
      }
    }),
    FunctionReturningEnumLengthStatusEnum: enumCodec({
      name: "FunctionReturningEnumLengthStatusEnum",
      identifier: TYPES.text.sqlType,
      values: [{
        value: "ok",
        description: undefined
      }, {
        value: "too_short",
        description: undefined
      }],
      extensions: {
        isEnumTableEnum: true,
        enumTableEnumDetails: {
          serviceName: "main",
          schemaName: "function_returning_enum",
          tableName: "length_status",
          constraintType: "p",
          constraintName: "length_status_pkey"
        },
        tags: {
          name: "FunctionReturningEnumLengthStatus"
        }
      }
    }),
    FunctionReturningEnumStageOptionEnum: enumCodec({
      name: "FunctionReturningEnumStageOptionEnum",
      identifier: TYPES.text.sqlType,
      values: [{
        value: "pending",
        description: undefined
      }, {
        value: "round 1",
        description: undefined
      }, {
        value: "round 2",
        description: undefined
      }, {
        value: "rejected",
        description: undefined
      }, {
        value: "hired",
        description: undefined
      }],
      extensions: {
        isEnumTableEnum: true,
        enumTableEnumDetails: {
          serviceName: "main",
          schemaName: "function_returning_enum",
          tableName: "stage_options",
          constraintType: "p",
          constraintName: "stage_options_pkey"
        },
        tags: {
          name: "FunctionReturningEnumStageOption"
        }
      }
    })
  },
  pgResources: {
    __proto__: null,
    Accessory: {
      executor: executor,
      name: "Accessory",
      identifier: "main.scifi.Accessory",
      from: accessoryIdentifier,
      codec: accessoryCodec,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "scifi",
          name: "Accessory"
        }
      },
      uniques: AccessoryUniques
    }
  },
  pgRelations: {
    __proto__: null
  }
}).pgResources["Accessory"];
const makeTableNodeIdHandler = ({
  typeName,
  nodeIdCodec,
  resource,
  identifier,
  pk,
  deprecationReason
}) => {
  return {
    typeName,
    codec: nodeIdCodec,
    plan($record) {
      return list([constant(identifier, false), ...pk.map(attribute => $record.get(attribute))]);
    },
    getSpec($list) {
      return Object.fromEntries(pk.map((attribute, index) => [attribute, inhibitOnNull(access($list, [index + 1]))]));
    },
    getIdentifiers(value) {
      return value.slice(1);
    },
    get(spec) {
      return resource.get(spec);
    },
    match(obj) {
      return obj[0] === identifier;
    },
    deprecationReason
  };
};
const nodeIdHandler_Accessory = makeTableNodeIdHandler({
  typeName: "Accessory",
  identifier: "Accessory",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_AccessoryPgResource,
  pk: AccessoryUniques[0].attributes
});
const specForHandlerCache = new Map();
function specForHandler() {
  const existing = specForHandlerCache.get(nodeIdHandler_Accessory);
  if (existing) {
    return existing;
  }
  const spec = markSyncAndSafe(function spec(nodeId) {
    // We only want to return the specifier if it matches
    // this handler; otherwise return null.
    if (nodeId == null) return null;
    try {
      const specifier = nodeIdHandler_Accessory.codec.decode(nodeId);
      if (nodeIdHandler_Accessory.match(specifier)) {
        return specifier;
      }
    } catch {
      // Ignore errors
    }
    return null;
  }, `specifier_${nodeIdHandler_Accessory.typeName}_${nodeIdHandler_Accessory.codec.name}`);
  specForHandlerCache.set(nodeIdHandler_Accessory, spec);
  return spec;
}
const nodeFetcher_Accessory = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler());
  return nodeIdHandler_Accessory.get(nodeIdHandler_Accessory.getSpec($decoded));
};
function qbWhereBuilder(qb) {
  return qb.whereBuilder();
}
const nodeIdHandlerByTypeName = {
  __proto__: null,
  Query: nodeIdHandler_Query,
  Accessory: nodeIdHandler_Accessory
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
function toString(value) {
  return "" + value;
}
function applyAttributeCondition(attributeName, attributeCodec, $condition, val) {
  $condition.where({
    type: "attribute",
    attribute: attributeName,
    callback(expression) {
      return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, attributeCodec)}`;
    }
  });
}
const specFromArgs_Accessory = args => {
  const $nodeId = args.getRaw(["input", "id"]);
  return specFromNodeId(nodeIdHandler_Accessory, $nodeId);
};
function applyInputToUpdateOrDelete(_, $object) {
  return $object;
}
function planCreatePayloadResult($object) {
  return $object.get("result");
}
function queryPlan() {
  return rootValue();
}
const getPgSelectSingleFromMutationResult = (pkAttributes, $mutation) => {
  const $result = $mutation.getStepForKey("result", true);
  if (!$result) return null;
  if ($result instanceof PgDeleteSingleStep) {
    return pgSelectFromRecord($result.resource, $result.record());
  } else {
    const spec = pkAttributes.reduce((memo, attributeName) => {
      memo[attributeName] = $result.get(attributeName);
      return memo;
    }, Object.create(null));
    return resource_AccessoryPgResource.find(spec);
  }
};
const pgMutationPayloadEdge = (pkAttributes, $mutation, fieldArgs) => {
  const $select = getPgSelectSingleFromMutationResult(pkAttributes, $mutation);
  if (!$select) return constant(null);
  fieldArgs.apply($select, "orderBy");
  const $connection = connection($select);
  return new EdgeStep($connection, first($connection));
};
const CreateAccessoryPayload_accessoryEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(AccessoryUniques[0].attributes, $mutation, fieldArgs);
function applyClientMutationIdForCreate(qb, val) {
  qb.setMeta("clientMutationId", val);
}
function applyCreateFields(qb, arg) {
  if (arg != null) {
    return qb.setBuilder();
  }
}
function AccessoryInput_nameApply(obj, val, {
  field,
  schema
}) {
  obj.set("Name", bakedInputRuntime(schema, field.type, val));
}
function AccessoryInput_rowIdApply(obj, val, {
  field,
  schema
}) {
  obj.set("Id", bakedInputRuntime(schema, field.type, val));
}
function getClientMutationIdForUpdateOrDeletePlan($mutation) {
  const $result = $mutation.getStepForKey("result");
  return $result.getMeta("clientMutationId");
}
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

  """Get a single \`Accessory\`."""
  accessoryByRowId(rowId: Int!): Accessory

  """Reads a single \`Accessory\` using its globally unique \`ID\`."""
  accessory(
    """The globally unique \`ID\` to be used in selecting a single \`Accessory\`."""
    id: ID!
  ): Accessory

  """Reads and enables pagination through a set of \`Accessory\`."""
  allAccessories(
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
    condition: AccessoryCondition

    """The method to use when ordering \`Accessory\`."""
    orderBy: [AccessoryOrderBy!] = [PRIMARY_KEY_ASC]
  ): AccessoryConnection
}

"""An object with a globally unique \`ID\`."""
interface Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  id: ID!
}

type Accessory implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  id: ID!
  name: String!
  rowId: Int!
}

"""A connection to a list of \`Accessory\` values."""
type AccessoryConnection {
  """A list of \`Accessory\` objects."""
  nodes: [Accessory]!

  """
  A list of edges which contains the \`Accessory\` and cursor to aid in pagination.
  """
  edges: [AccessoryEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Accessory\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Accessory\` edge in the connection."""
type AccessoryEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Accessory\` at the end of the edge."""
  node: Accessory
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
A condition to be used against \`Accessory\` object types. All fields are tested
for equality and combined with a logical ‘and.’
"""
input AccessoryCondition {
  """Checks for equality with the object’s \`name\` field."""
  name: String

  """Checks for equality with the object’s \`rowId\` field."""
  rowId: Int
}

"""Methods to use when ordering \`Accessory\`."""
enum AccessoryOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  NAME_ASC
  NAME_DESC
  ROW_ID_ASC
  ROW_ID_DESC
}

"""
The root mutation type which contains root level fields which mutate data.
"""
type Mutation {
  """Creates a single \`Accessory\`."""
  createAccessory(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateAccessoryInput!
  ): CreateAccessoryPayload

  """Updates a single \`Accessory\` using its globally unique id and a patch."""
  updateAccessory(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateAccessoryInput!
  ): UpdateAccessoryPayload

  """Updates a single \`Accessory\` using a unique key and a patch."""
  updateAccessoryByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateAccessoryByRowIdInput!
  ): UpdateAccessoryPayload

  """Deletes a single \`Accessory\` using its globally unique id."""
  deleteAccessory(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteAccessoryInput!
  ): DeleteAccessoryPayload

  """Deletes a single \`Accessory\` using a unique key."""
  deleteAccessoryByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteAccessoryByRowIdInput!
  ): DeleteAccessoryPayload
}

"""The output of our create \`Accessory\` mutation."""
type CreateAccessoryPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Accessory\` that was created by this mutation."""
  accessory: Accessory

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Accessory\`. May be used by Relay 1."""
  accessoryEdge(
    """The method to use when ordering \`Accessory\`."""
    orderBy: [AccessoryOrderBy!]! = [PRIMARY_KEY_ASC]
  ): AccessoryEdge
}

"""All input for the create \`Accessory\` mutation."""
input CreateAccessoryInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`Accessory\` to be created by this mutation."""
  accessory: AccessoryInput!
}

"""An input for mutations affecting \`Accessory\`"""
input AccessoryInput {
  name: String!
  rowId: Int!
}

"""The output of our update \`Accessory\` mutation."""
type UpdateAccessoryPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Accessory\` that was updated by this mutation."""
  accessory: Accessory

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Accessory\`. May be used by Relay 1."""
  accessoryEdge(
    """The method to use when ordering \`Accessory\`."""
    orderBy: [AccessoryOrderBy!]! = [PRIMARY_KEY_ASC]
  ): AccessoryEdge
}

"""All input for the \`updateAccessory\` mutation."""
input UpdateAccessoryInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Accessory\` to be updated.
  """
  id: ID!

  """
  An object where the defined keys will be set on the \`Accessory\` being updated.
  """
  accessoryPatch: AccessoryPatch!
}

"""
Represents an update to a \`Accessory\`. Fields that are set will be updated.
"""
input AccessoryPatch {
  name: String
  rowId: Int
}

"""All input for the \`updateAccessoryByRowId\` mutation."""
input UpdateAccessoryByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: Int!

  """
  An object where the defined keys will be set on the \`Accessory\` being updated.
  """
  accessoryPatch: AccessoryPatch!
}

"""The output of our delete \`Accessory\` mutation."""
type DeleteAccessoryPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Accessory\` that was deleted by this mutation."""
  accessory: Accessory
  deletedAccessoryId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Accessory\`. May be used by Relay 1."""
  accessoryEdge(
    """The method to use when ordering \`Accessory\`."""
    orderBy: [AccessoryOrderBy!]! = [PRIMARY_KEY_ASC]
  ): AccessoryEdge
}

"""All input for the \`deleteAccessory\` mutation."""
input DeleteAccessoryInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Accessory\` to be deleted.
  """
  id: ID!
}

"""All input for the \`deleteAccessoryByRowId\` mutation."""
input DeleteAccessoryByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: Int!
}`;
export const objects = {
  Query: {
    assertStep() {
      return true;
    },
    plans: {
      accessory(_$parent, args) {
        const $nodeId = args.getRaw("id");
        return nodeFetcher_Accessory($nodeId);
      },
      accessoryByRowId(_$root, {
        $rowId
      }) {
        return resource_AccessoryPgResource.get({
          Id: $rowId
        });
      },
      allAccessories: {
        plan() {
          return connection(resource_AccessoryPgResource.find());
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
      createAccessory: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_AccessoryPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input(_, $object) {
            return $object;
          }
        }
      },
      deleteAccessory: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_AccessoryPgResource, specFromArgs_Accessory(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteAccessoryByRowId: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_AccessoryPgResource, {
            Id: args.getRaw(['input', "rowId"])
          });
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateAccessory: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_AccessoryPgResource, specFromArgs_Accessory(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateAccessoryByRowId: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_AccessoryPgResource, {
            Id: args.getRaw(['input', "rowId"])
          });
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      }
    }
  },
  Accessory: {
    assertStep: assertPgClassSingleStep,
    plans: {
      id($parent) {
        const specifier = nodeIdHandler_Accessory.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Accessory.codec.name].encode);
      },
      name($record) {
        return $record.get("Name");
      },
      rowId($record) {
        return $record.get("Id");
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of AccessoryUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_AccessoryPgResource.get(spec);
    }
  },
  AccessoryConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
      }
    }
  },
  CreateAccessoryPayload: {
    assertStep: assertStep,
    plans: {
      accessory: planCreatePayloadResult,
      accessoryEdge: CreateAccessoryPayload_accessoryEdgePlan,
      clientMutationId($mutation) {
        const $insert = $mutation.getStepForKey("result");
        return $insert.getMeta("clientMutationId");
      },
      query: queryPlan
    }
  },
  DeleteAccessoryPayload: {
    assertStep: ObjectStep,
    plans: {
      accessory: planCreatePayloadResult,
      accessoryEdge: CreateAccessoryPayload_accessoryEdgePlan,
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedAccessoryId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Accessory.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      query: queryPlan
    }
  },
  UpdateAccessoryPayload: {
    assertStep: ObjectStep,
    plans: {
      accessory: planCreatePayloadResult,
      accessoryEdge: CreateAccessoryPayload_accessoryEdgePlan,
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan
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
  AccessoryCondition: {
    plans: {
      name($condition, val) {
        return applyAttributeCondition("Name", TYPES.varchar, $condition, val);
      },
      rowId($condition, val) {
        return applyAttributeCondition("Id", TYPES.int, $condition, val);
      }
    }
  },
  AccessoryInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      name: AccessoryInput_nameApply,
      rowId: AccessoryInput_rowIdApply
    }
  },
  AccessoryPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      name: AccessoryInput_nameApply,
      rowId: AccessoryInput_rowIdApply
    }
  },
  CreateAccessoryInput: {
    plans: {
      accessory: applyCreateFields,
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteAccessoryByRowIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteAccessoryInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  UpdateAccessoryByRowIdInput: {
    plans: {
      accessoryPatch: applyCreateFields,
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  UpdateAccessoryInput: {
    plans: {
      accessoryPatch: applyCreateFields,
      clientMutationId: applyClientMutationIdForCreate
    }
  }
};
export const scalars = {
  Cursor: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`Cursor can only parse string values (kind='${ast.kind}')`);
    }
  }
};
export const enums = {
  AccessoryOrderBy: {
    values: {
      NAME_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "Name",
          direction: "ASC"
        });
      },
      NAME_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "Name",
          direction: "DESC"
        });
      },
      PRIMARY_KEY_ASC(queryBuilder) {
        AccessoryUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        AccessoryUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      ROW_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "Id",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      ROW_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "Id",
          direction: "DESC"
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
