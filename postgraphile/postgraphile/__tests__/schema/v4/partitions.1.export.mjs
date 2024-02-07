import { PgDeleteSingleStep, PgExecutor, PgSelectStep, PgUnionAllStep, TYPES, assertPgClassSingleStep, makeRegistry, pgDeleteSingle, pgInsertSingle, pgSelectFromRecord, pgUpdateSingle, recordCodec } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ObjectStep, SafeError, __ValueStep, access, assertEdgeCapableStep, assertExecutableStep, assertPageInfoCapableStep, connection, constant, context, first, getEnumValueConfig, lambda, list, makeGrafastSchema, node, object, rootValue, specFromNodeId } from "grafast";
import { sql } from "pg-sql2";
import { inspect } from "util";
function Query_queryPlan() {
  return rootValue();
}
const handler = {
  typeName: "Query",
  codec: {
    name: "raw",
    encode(value) {
      return typeof value === "string" ? value : null;
    },
    decode(value) {
      return typeof value === "string" ? value : null;
    }
  },
  match(specifier) {
    return specifier === "query";
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
function base64JSONDecode(value) {
  return JSON.parse(Buffer.from(value, "base64").toString("utf8"));
}
function base64JSONEncode(value) {
  return Buffer.from(JSON.stringify(value), "utf8").toString("base64");
}
const nodeIdCodecs_base64JSON_base64JSON = {
  name: "base64JSON",
  encode: base64JSONEncode,
  decode: base64JSONDecode
};
function pipeStringDecode(value) {
  return typeof value === "string" ? value.split("|") : null;
}
function pipeStringEncode(value) {
  return Array.isArray(value) ? value.join("|") : null;
}
const nodeIdCodecs = Object.assign(Object.create(null), {
  raw: handler.codec,
  base64JSON: nodeIdCodecs_base64JSON_base64JSON,
  pipeString: {
    name: "pipeString",
    encode: pipeStringEncode,
    decode: pipeStringDecode
  }
});
const attributes_object_Object_ = Object.assign(Object.create(null), {
  id: {
    description: undefined,
    codec: TYPES.int,
    notNull: true,
    hasDefault: true,
    extensions: {
      tags: {}
    }
  },
  name: {
    description: undefined,
    codec: TYPES.text,
    notNull: true,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  }
});
const executor_mainPgExecutor = new PgExecutor({
  name: "main",
  context() {
    const ctx = context();
    return object({
      pgSettings: "pgSettings" != null ? ctx.get("pgSettings") : constant(null),
      withPgClient: ctx.get("withPgClient")
    });
  }
});
const spec_users = {
  name: "users",
  identifier: sql.identifier(...["partitions", "users"]),
  attributes: attributes_object_Object_,
  description: undefined,
  extensions: {
    oid: "1377338",
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "partitions",
      name: "users"
    },
    tags: Object.create(null)
  },
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_users_users = recordCodec(spec_users);
const attributes = Object.assign(Object.create(null), {
  timestamp: {
    description: undefined,
    codec: TYPES.timestamptz,
    notNull: true,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  },
  key: {
    description: undefined,
    codec: TYPES.text,
    notNull: true,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  },
  value: {
    description: undefined,
    codec: TYPES.float,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  },
  user_id: {
    description: undefined,
    codec: TYPES.int,
    notNull: true,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  }
});
const extensions2 = {
  oid: "1377346",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "partitions",
    name: "measurements"
  },
  tags: Object.create(null)
};
const parts2 = ["partitions", "measurements"];
const sqlIdent2 = sql.identifier(...parts2);
const spec_measurements = {
  name: "measurements",
  identifier: sqlIdent2,
  attributes,
  description: undefined,
  extensions: extensions2,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_measurements_measurements = recordCodec(spec_measurements);
const extensions3 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "partitions",
    name: "users"
  },
  tags: {}
};
const uniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_users_users = {
  executor: executor_mainPgExecutor,
  name: "users",
  identifier: "main.partitions.users",
  from: registryConfig_pgCodecs_users_users.sqlType,
  codec: registryConfig_pgCodecs_users_users,
  uniques,
  isVirtual: false,
  description: undefined,
  extensions: extensions3
};
const extensions4 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "partitions",
    name: "measurements"
  },
  tags: {}
};
const uniques2 = [{
  isPrimary: true,
  attributes: ["timestamp", "key"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_measurements_measurements = {
  executor: executor_mainPgExecutor,
  name: "measurements",
  identifier: "main.partitions.measurements",
  from: registryConfig_pgCodecs_measurements_measurements.sqlType,
  codec: registryConfig_pgCodecs_measurements_measurements,
  uniques: uniques2,
  isVirtual: false,
  description: undefined,
  extensions: extensions4
};
const registry = makeRegistry({
  pgCodecs: Object.assign(Object.create(null), {
    users: registryConfig_pgCodecs_users_users,
    int4: TYPES.int,
    text: TYPES.text,
    varchar: TYPES.varchar,
    bpchar: TYPES.bpchar,
    timestamptz: TYPES.timestamptz,
    float8: TYPES.float,
    measurements: registryConfig_pgCodecs_measurements_measurements
  }),
  pgResources: Object.assign(Object.create(null), {
    users: registryConfig_pgResources_users_users,
    measurements: registryConfig_pgResources_measurements_measurements
  }),
  pgRelations: Object.assign(Object.create(null), {
    measurements: Object.assign(Object.create(null), {
      usersByMyUserId: {
        localCodec: registryConfig_pgCodecs_measurements_measurements,
        remoteResourceOptions: registryConfig_pgResources_users_users,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["user_id"],
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
    }),
    users: Object.assign(Object.create(null), {
      measurementsByTheirUserId: {
        localCodec: registryConfig_pgCodecs_users_users,
        remoteResourceOptions: registryConfig_pgResources_measurements_measurements,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["user_id"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      }
    })
  })
});
const pgResource_usersPgResource = registry.pgResources["users"];
const pgResource_measurementsPgResource = registry.pgResources["measurements"];
const nodeIdHandlerByTypeName = Object.assign(Object.create(null), {
  Query: handler,
  User: {
    typeName: "User",
    codec: nodeIdCodecs_base64JSON_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("users", false), $record.get("id")]);
    },
    getSpec($list) {
      return {
        id: access($list, [1])
      };
    },
    get(spec) {
      return pgResource_usersPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "users";
    }
  },
  Measurement: {
    typeName: "Measurement",
    codec: nodeIdCodecs_base64JSON_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("measurements", false), $record.get("timestamp"), $record.get("key")]);
    },
    getSpec($list) {
      return {
        timestamp: access($list, [1]),
        key: access($list, [2])
      };
    },
    get(spec) {
      return pgResource_measurementsPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "measurements";
    }
  }
});
function specForHandler(handler) {
  function spec(nodeId) {
    // We only want to return the specifier if it matches
    // this handler; otherwise return null.
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
const fetcher = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName.User);
const fetcher2 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName.Measurement);
function Query_allUsers_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allUsers_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Query_allUsers_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allUsers_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Query_allUsers_after_applyPlan(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
const applyOrderToPlan = ($select, $value, TableOrderByType) => {
  const val = $value.eval();
  if (val == null) {
    return;
  }
  if (!Array.isArray(val)) {
    throw new Error("Invalid!");
  }
  val.forEach(order => {
    const config = getEnumValueConfig(TableOrderByType, order);
    const plan = config?.extensions?.grafast?.applyPlan;
    if (typeof plan !== "function") {
      console.error(`Internal server error: invalid orderBy configuration: expected function, but received ${inspect(plan)}`);
      throw new SafeError("Internal server error: invalid orderBy configuration");
    }
    plan($select);
  });
};
function Query_allMeasurements_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allMeasurements_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Query_allMeasurements_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allMeasurements_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Query_allMeasurements_after_applyPlan(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
function User_measurementsByUserId_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function User_measurementsByUserId_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function User_measurementsByUserId_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function User_measurementsByUserId_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function User_measurementsByUserId_after_applyPlan(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
function MeasurementsConnection_nodesPlan($connection) {
  return $connection.nodes();
}
function MeasurementsConnection_edgesPlan($connection) {
  return $connection.edges();
}
function MeasurementsConnection_pageInfoPlan($connection) {
  // TYPES: why is this a TypeScript issue without the 'any'?
  return $connection.pageInfo();
}
function PageInfo_hasNextPagePlan($pageInfo) {
  return $pageInfo.hasNextPage();
}
function PageInfo_hasPreviousPagePlan($pageInfo) {
  return $pageInfo.hasPreviousPage();
}
function UsersConnection_nodesPlan($connection) {
  return $connection.nodes();
}
function UsersConnection_edgesPlan($connection) {
  return $connection.edges();
}
function UsersConnection_pageInfoPlan($connection) {
  // TYPES: why is this a TypeScript issue without the 'any'?
  return $connection.pageInfo();
}
function Mutation_createUser_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_createMeasurement_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.User, $nodeId);
};
function Mutation_updateUser_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updateUserById_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs2 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Measurement, $nodeId);
};
function Mutation_updateMeasurement_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updateMeasurementByTimestampAndKey_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs3 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.User, $nodeId);
};
function Mutation_deleteUser_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deleteUserById_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs4 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Measurement, $nodeId);
};
function Mutation_deleteMeasurement_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deleteMeasurementByTimestampAndKey_input_applyPlan(_, $object) {
  return $object;
}
function CreateUserPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function CreateUserPayload_userPlan($object) {
  return $object.get("result");
}
function CreateUserPayload_queryPlan() {
  return rootValue();
}
function CreateUserInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function CreateUserInput_user_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function CreateMeasurementPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function CreateMeasurementPayload_measurementPlan($object) {
  return $object.get("result");
}
function CreateMeasurementPayload_queryPlan() {
  return rootValue();
}
function CreateMeasurementInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function CreateMeasurementInput_measurement_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateUserPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function UpdateUserPayload_userPlan($object) {
  return $object.get("result");
}
function UpdateUserPayload_queryPlan() {
  return rootValue();
}
function UpdateUserInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateUserInput_userPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateUserByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateUserByIdInput_userPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateMeasurementPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function UpdateMeasurementPayload_measurementPlan($object) {
  return $object.get("result");
}
function UpdateMeasurementPayload_queryPlan() {
  return rootValue();
}
function UpdateMeasurementInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateMeasurementInput_measurementPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateMeasurementByTimestampAndKeyInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateMeasurementByTimestampAndKeyInput_measurementPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function DeleteUserPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function DeleteUserPayload_userPlan($object) {
  return $object.get("result");
}
function DeleteUserPayload_queryPlan() {
  return rootValue();
}
function DeleteUserInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteUserByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteMeasurementPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function DeleteMeasurementPayload_measurementPlan($object) {
  return $object.get("result");
}
function DeleteMeasurementPayload_queryPlan() {
  return rootValue();
}
function DeleteMeasurementInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteMeasurementByTimestampAndKeyInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
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
  nodeId: ID!

  """Fetches an object given its globally unique \`ID\`."""
  node(
    """The globally unique \`ID\`."""
    nodeId: ID!
  ): Node

  """Get a single \`User\`."""
  userById(id: Int!): User

  """Get a single \`Measurement\`."""
  measurementByTimestampAndKey(timestamp: Datetime!, key: String!): Measurement

  """Reads a single \`User\` using its globally unique \`ID\`."""
  user(
    """The globally unique \`ID\` to be used in selecting a single \`User\`."""
    nodeId: ID!
  ): User

  """Reads a single \`Measurement\` using its globally unique \`ID\`."""
  measurement(
    """
    The globally unique \`ID\` to be used in selecting a single \`Measurement\`.
    """
    nodeId: ID!
  ): Measurement

  """Reads and enables pagination through a set of \`User\`."""
  allUsers(
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

    """The method to use when ordering \`User\`."""
    orderBy: [UsersOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: UserCondition
  ): UsersConnection

  """Reads and enables pagination through a set of \`Measurement\`."""
  allMeasurements(
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

    """The method to use when ordering \`Measurement\`."""
    orderBy: [MeasurementsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: MeasurementCondition
  ): MeasurementsConnection
}

"""An object with a globally unique \`ID\`."""
interface Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
}

type User implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  name: String!

  """Reads and enables pagination through a set of \`Measurement\`."""
  measurementsByUserId(
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

    """The method to use when ordering \`Measurement\`."""
    orderBy: [MeasurementsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: MeasurementCondition
  ): MeasurementsConnection!
}

"""A connection to a list of \`Measurement\` values."""
type MeasurementsConnection {
  """A list of \`Measurement\` objects."""
  nodes: [Measurement]!

  """
  A list of edges which contains the \`Measurement\` and cursor to aid in pagination.
  """
  edges: [MeasurementsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Measurement\` you could get from the connection."""
  totalCount: Int!
}

type Measurement implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  timestamp: Datetime!
  key: String!
  value: Float
  userId: Int!

  """Reads a single \`User\` that is related to this \`Measurement\`."""
  userByUserId: User
}

"""
A point in time as described by the [ISO
8601](https://en.wikipedia.org/wiki/ISO_8601) and, if it has a timezone, [RFC
3339](https://datatracker.ietf.org/doc/html/rfc3339) standards. Input values
that do not conform to both ISO 8601 and RFC 3339 may be coerced, which may lead
to unexpected results.
"""
scalar Datetime

"""A \`Measurement\` edge in the connection."""
type MeasurementsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Measurement\` at the end of the edge."""
  node: Measurement
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

"""Methods to use when ordering \`Measurement\`."""
enum MeasurementsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  TIMESTAMP_ASC
  TIMESTAMP_DESC
  KEY_ASC
  KEY_DESC
  VALUE_ASC
  VALUE_DESC
  USER_ID_ASC
  USER_ID_DESC
}

"""
A condition to be used against \`Measurement\` object types. All fields are tested
for equality and combined with a logical ‘and.’
"""
input MeasurementCondition {
  """Checks for equality with the object’s \`timestamp\` field."""
  timestamp: Datetime

  """Checks for equality with the object’s \`key\` field."""
  key: String

  """Checks for equality with the object’s \`value\` field."""
  value: Float

  """Checks for equality with the object’s \`userId\` field."""
  userId: Int
}

"""A connection to a list of \`User\` values."""
type UsersConnection {
  """A list of \`User\` objects."""
  nodes: [User]!

  """
  A list of edges which contains the \`User\` and cursor to aid in pagination.
  """
  edges: [UsersEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`User\` you could get from the connection."""
  totalCount: Int!
}

"""A \`User\` edge in the connection."""
type UsersEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`User\` at the end of the edge."""
  node: User
}

"""Methods to use when ordering \`User\`."""
enum UsersOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  NAME_ASC
  NAME_DESC
}

"""
A condition to be used against \`User\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input UserCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`name\` field."""
  name: String
}

"""
The root mutation type which contains root level fields which mutate data.
"""
type Mutation {
  """Creates a single \`User\`."""
  createUser(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateUserInput!
  ): CreateUserPayload

  """Creates a single \`Measurement\`."""
  createMeasurement(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateMeasurementInput!
  ): CreateMeasurementPayload

  """Updates a single \`User\` using its globally unique id and a patch."""
  updateUser(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateUserInput!
  ): UpdateUserPayload

  """Updates a single \`User\` using a unique key and a patch."""
  updateUserById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateUserByIdInput!
  ): UpdateUserPayload

  """
  Updates a single \`Measurement\` using its globally unique id and a patch.
  """
  updateMeasurement(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateMeasurementInput!
  ): UpdateMeasurementPayload

  """Updates a single \`Measurement\` using a unique key and a patch."""
  updateMeasurementByTimestampAndKey(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateMeasurementByTimestampAndKeyInput!
  ): UpdateMeasurementPayload

  """Deletes a single \`User\` using its globally unique id."""
  deleteUser(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteUserInput!
  ): DeleteUserPayload

  """Deletes a single \`User\` using a unique key."""
  deleteUserById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteUserByIdInput!
  ): DeleteUserPayload

  """Deletes a single \`Measurement\` using its globally unique id."""
  deleteMeasurement(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteMeasurementInput!
  ): DeleteMeasurementPayload

  """Deletes a single \`Measurement\` using a unique key."""
  deleteMeasurementByTimestampAndKey(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteMeasurementByTimestampAndKeyInput!
  ): DeleteMeasurementPayload
}

"""The output of our create \`User\` mutation."""
type CreateUserPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`User\` that was created by this mutation."""
  user: User

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`User\`. May be used by Relay 1."""
  userEdge(
    """The method to use when ordering \`User\`."""
    orderBy: [UsersOrderBy!]! = [PRIMARY_KEY_ASC]
  ): UsersEdge
}

"""All input for the create \`User\` mutation."""
input CreateUserInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`User\` to be created by this mutation."""
  user: UserInput!
}

"""An input for mutations affecting \`User\`"""
input UserInput {
  id: Int
  name: String!
}

"""The output of our create \`Measurement\` mutation."""
type CreateMeasurementPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Measurement\` that was created by this mutation."""
  measurement: Measurement

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Measurement\`. May be used by Relay 1."""
  measurementEdge(
    """The method to use when ordering \`Measurement\`."""
    orderBy: [MeasurementsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): MeasurementsEdge

  """Reads a single \`User\` that is related to this \`Measurement\`."""
  userByUserId: User
}

"""All input for the create \`Measurement\` mutation."""
input CreateMeasurementInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`Measurement\` to be created by this mutation."""
  measurement: MeasurementInput!
}

"""An input for mutations affecting \`Measurement\`"""
input MeasurementInput {
  timestamp: Datetime!
  key: String!
  value: Float
  userId: Int!
}

"""The output of our update \`User\` mutation."""
type UpdateUserPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`User\` that was updated by this mutation."""
  user: User

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`User\`. May be used by Relay 1."""
  userEdge(
    """The method to use when ordering \`User\`."""
    orderBy: [UsersOrderBy!]! = [PRIMARY_KEY_ASC]
  ): UsersEdge
}

"""All input for the \`updateUser\` mutation."""
input UpdateUserInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`User\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`User\` being updated.
  """
  userPatch: UserPatch!
}

"""Represents an update to a \`User\`. Fields that are set will be updated."""
input UserPatch {
  id: Int
  name: String
}

"""All input for the \`updateUserById\` mutation."""
input UpdateUserByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`User\` being updated.
  """
  userPatch: UserPatch!
}

"""The output of our update \`Measurement\` mutation."""
type UpdateMeasurementPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Measurement\` that was updated by this mutation."""
  measurement: Measurement

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Measurement\`. May be used by Relay 1."""
  measurementEdge(
    """The method to use when ordering \`Measurement\`."""
    orderBy: [MeasurementsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): MeasurementsEdge

  """Reads a single \`User\` that is related to this \`Measurement\`."""
  userByUserId: User
}

"""All input for the \`updateMeasurement\` mutation."""
input UpdateMeasurementInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Measurement\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`Measurement\` being updated.
  """
  measurementPatch: MeasurementPatch!
}

"""
Represents an update to a \`Measurement\`. Fields that are set will be updated.
"""
input MeasurementPatch {
  timestamp: Datetime
  key: String
  value: Float
  userId: Int
}

"""All input for the \`updateMeasurementByTimestampAndKey\` mutation."""
input UpdateMeasurementByTimestampAndKeyInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  timestamp: Datetime!
  key: String!

  """
  An object where the defined keys will be set on the \`Measurement\` being updated.
  """
  measurementPatch: MeasurementPatch!
}

"""The output of our delete \`User\` mutation."""
type DeleteUserPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`User\` that was deleted by this mutation."""
  user: User
  deletedUserId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`User\`. May be used by Relay 1."""
  userEdge(
    """The method to use when ordering \`User\`."""
    orderBy: [UsersOrderBy!]! = [PRIMARY_KEY_ASC]
  ): UsersEdge
}

"""All input for the \`deleteUser\` mutation."""
input DeleteUserInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`User\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteUserById\` mutation."""
input DeleteUserByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!
}

"""The output of our delete \`Measurement\` mutation."""
type DeleteMeasurementPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Measurement\` that was deleted by this mutation."""
  measurement: Measurement
  deletedMeasurementId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Measurement\`. May be used by Relay 1."""
  measurementEdge(
    """The method to use when ordering \`Measurement\`."""
    orderBy: [MeasurementsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): MeasurementsEdge

  """Reads a single \`User\` that is related to this \`Measurement\`."""
  userByUserId: User
}

"""All input for the \`deleteMeasurement\` mutation."""
input DeleteMeasurementInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Measurement\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteMeasurementByTimestampAndKey\` mutation."""
input DeleteMeasurementByTimestampAndKeyInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  timestamp: Datetime!
  key: String!
}`;
export const plans = {
  Query: {
    __assertStep() {
      return true;
    },
    query: Query_queryPlan,
    nodeId($parent) {
      const specifier = handler.plan($parent);
      return lambda(specifier, nodeIdCodecs[handler.codec.name].encode);
    },
    node: {
      plan(_$root, args) {
        return node(nodeIdHandlerByTypeName, args.get("nodeId"));
      },
      args: {
        nodeId: undefined
      }
    },
    userById: {
      plan(_$root, args) {
        return pgResource_usersPgResource.get({
          id: args.get("id")
        });
      },
      args: {
        id: undefined
      }
    },
    measurementByTimestampAndKey: {
      plan(_$root, args) {
        return pgResource_measurementsPgResource.get({
          timestamp: args.get("timestamp"),
          key: args.get("key")
        });
      },
      args: {
        timestamp: undefined,
        key: undefined
      }
    },
    user: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    measurement: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher2($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    allUsers: {
      plan() {
        return connection(pgResource_usersPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allUsers_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allUsers_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allUsers_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allUsers_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allUsers_after_applyPlan
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("UsersOrderBy"));
            return null;
          }
        },
        condition: {
          autoApplyAfterParentPlan: true,
          applyPlan(_condition, $connection) {
            const $select = $connection.getSubplan();
            return $select.wherePlan();
          }
        }
      }
    },
    allMeasurements: {
      plan() {
        return connection(pgResource_measurementsPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allMeasurements_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allMeasurements_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allMeasurements_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allMeasurements_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allMeasurements_after_applyPlan
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("MeasurementsOrderBy"));
            return null;
          }
        },
        condition: {
          autoApplyAfterParentPlan: true,
          applyPlan(_condition, $connection) {
            const $select = $connection.getSubplan();
            return $select.wherePlan();
          }
        }
      }
    }
  },
  User: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.User.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.User.codec.name].encode);
    },
    id($record) {
      return $record.get("id");
    },
    name($record) {
      return $record.get("name");
    },
    measurementsByUserId: {
      plan($record) {
        const $records = pgResource_measurementsPgResource.find({
          user_id: $record.get("id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan: User_measurementsByUserId_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: User_measurementsByUserId_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: User_measurementsByUserId_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: User_measurementsByUserId_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: User_measurementsByUserId_after_applyPlan
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("MeasurementsOrderBy"));
            return null;
          }
        },
        condition: {
          autoApplyAfterParentPlan: true,
          applyPlan(_condition, $connection) {
            const $select = $connection.getSubplan();
            return $select.wherePlan();
          }
        }
      }
    }
  },
  MeasurementsConnection: {
    __assertStep: ConnectionStep,
    nodes: MeasurementsConnection_nodesPlan,
    edges: MeasurementsConnection_edgesPlan,
    pageInfo: MeasurementsConnection_pageInfoPlan,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  Measurement: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.Measurement.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Measurement.codec.name].encode);
    },
    timestamp($record) {
      return $record.get("timestamp");
    },
    key($record) {
      return $record.get("key");
    },
    value($record) {
      return $record.get("value");
    },
    userId($record) {
      return $record.get("user_id");
    },
    userByUserId($record) {
      return pgResource_usersPgResource.get({
        id: $record.get("user_id")
      });
    }
  },
  MeasurementsEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  PageInfo: {
    __assertStep: assertPageInfoCapableStep,
    hasNextPage: PageInfo_hasNextPagePlan,
    hasPreviousPage: PageInfo_hasPreviousPagePlan,
    startCursor($pageInfo) {
      return $pageInfo.startCursor();
    },
    endCursor($pageInfo) {
      return $pageInfo.endCursor();
    }
  },
  MeasurementsOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        uniques2[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_measurements_measurements.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step.alias}.${sql.identifier(attributeName)}`,
            direction: "ASC",
            ...(undefined != null ? {
              nulls: undefined ? "LAST" : "FIRST"
            } : null)
          });
        });
        step.setOrderIsUnique();
      }
    },
    PRIMARY_KEY_DESC: {
      applyPlan(step) {
        uniques2[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_measurements_measurements.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step.alias}.${sql.identifier(attributeName)}`,
            direction: "DESC",
            ...(undefined != null ? {
              nulls: undefined ? "LAST" : "FIRST"
            } : null)
          });
        });
        step.setOrderIsUnique();
      }
    },
    TIMESTAMP_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "timestamp",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (true) {
          plan.setOrderIsUnique();
        }
      }
    },
    TIMESTAMP_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "timestamp",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (true) {
          plan.setOrderIsUnique();
        }
      }
    },
    KEY_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "key",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) {
          plan.setOrderIsUnique();
        }
      }
    },
    KEY_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "key",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) {
          plan.setOrderIsUnique();
        }
      }
    },
    VALUE_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "value",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) {
          plan.setOrderIsUnique();
        }
      }
    },
    VALUE_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "value",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) {
          plan.setOrderIsUnique();
        }
      }
    },
    USER_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "user_id",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) {
          plan.setOrderIsUnique();
        }
      }
    },
    USER_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "user_id",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) {
          plan.setOrderIsUnique();
        }
      }
    }
  },
  MeasurementCondition: {
    timestamp: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "timestamp",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "timestamp",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes.timestamp.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    key: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "key",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "key",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes.key.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    value: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "value",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "value",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes.value.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    userId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "user_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "user_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes.user_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UsersConnection: {
    __assertStep: ConnectionStep,
    nodes: UsersConnection_nodesPlan,
    edges: UsersConnection_edgesPlan,
    pageInfo: UsersConnection_pageInfoPlan,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  UsersEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  UsersOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        uniques[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_users_users.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step.alias}.${sql.identifier(attributeName)}`,
            direction: "ASC",
            ...(undefined != null ? {
              nulls: undefined ? "LAST" : "FIRST"
            } : null)
          });
        });
        step.setOrderIsUnique();
      }
    },
    PRIMARY_KEY_DESC: {
      applyPlan(step) {
        uniques[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_users_users.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step.alias}.${sql.identifier(attributeName)}`,
            direction: "DESC",
            ...(undefined != null ? {
              nulls: undefined ? "LAST" : "FIRST"
            } : null)
          });
        });
        step.setOrderIsUnique();
      }
    },
    ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "id",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (true) {
          plan.setOrderIsUnique();
        }
      }
    },
    ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "id",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (true) {
          plan.setOrderIsUnique();
        }
      }
    },
    NAME_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "name",
          direction: "ASC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) {
          plan.setOrderIsUnique();
        }
      }
    },
    NAME_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "name",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (false) {
          plan.setOrderIsUnique();
        }
      }
    }
  },
  UserCondition: {
    id: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes_object_Object_.id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    name: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "name",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "name",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes_object_Object_.name.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  Mutation: {
    __assertStep: __ValueStep,
    createUser: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_usersPgResource, Object.create(null))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan: Mutation_createUser_input_applyPlan
        }
      }
    },
    createMeasurement: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_measurementsPgResource, Object.create(null))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan: Mutation_createMeasurement_input_applyPlan
        }
      }
    },
    updateUser: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_usersPgResource, specFromArgs(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_updateUser_input_applyPlan
        }
      }
    },
    updateUserById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_usersPgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_updateUserById_input_applyPlan
        }
      }
    },
    updateMeasurement: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_measurementsPgResource, specFromArgs2(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_updateMeasurement_input_applyPlan
        }
      }
    },
    updateMeasurementByTimestampAndKey: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_measurementsPgResource, {
            timestamp: args.get(['input', "timestamp"]),
            key: args.get(['input', "key"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_updateMeasurementByTimestampAndKey_input_applyPlan
        }
      }
    },
    deleteUser: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_usersPgResource, specFromArgs3(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_deleteUser_input_applyPlan
        }
      }
    },
    deleteUserById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_usersPgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_deleteUserById_input_applyPlan
        }
      }
    },
    deleteMeasurement: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_measurementsPgResource, specFromArgs4(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_deleteMeasurement_input_applyPlan
        }
      }
    },
    deleteMeasurementByTimestampAndKey: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_measurementsPgResource, {
            timestamp: args.get(['input', "timestamp"]),
            key: args.get(['input', "key"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_deleteMeasurementByTimestampAndKey_input_applyPlan
        }
      }
    }
  },
  CreateUserPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId: CreateUserPayload_clientMutationIdPlan,
    user: CreateUserPayload_userPlan,
    query: CreateUserPayload_queryPlan,
    userEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = uniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_usersPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("UsersOrderBy"));
        const $connection = connection($select);
        // NOTE: you must not use `$single = $select.single()`
        // here because doing so will mark the row as unique, and
        // then the ordering logic (and thus cursor) will differ.
        const $single = $select.row(first($select));
        return new EdgeStep($connection, $single);
      },
      args: {
        orderBy: undefined
      }
    }
  },
  CreateUserInput: {
    clientMutationId: {
      applyPlan: CreateUserInput_clientMutationId_applyPlan,
      autoApplyAfterParentApplyPlan: true
    },
    user: {
      applyPlan: CreateUserInput_user_applyPlan,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UserInput: {
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    name: {
      applyPlan($insert, val) {
        $insert.set("name", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreateMeasurementPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId: CreateMeasurementPayload_clientMutationIdPlan,
    measurement: CreateMeasurementPayload_measurementPlan,
    query: CreateMeasurementPayload_queryPlan,
    measurementEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = uniques2[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_measurementsPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("MeasurementsOrderBy"));
        const $connection = connection($select);
        // NOTE: you must not use `$single = $select.single()`
        // here because doing so will mark the row as unique, and
        // then the ordering logic (and thus cursor) will differ.
        const $single = $select.row(first($select));
        return new EdgeStep($connection, $single);
      },
      args: {
        orderBy: undefined
      }
    },
    userByUserId($record) {
      return pgResource_usersPgResource.get({
        id: $record.get("result").get("user_id")
      });
    }
  },
  CreateMeasurementInput: {
    clientMutationId: {
      applyPlan: CreateMeasurementInput_clientMutationId_applyPlan,
      autoApplyAfterParentApplyPlan: true
    },
    measurement: {
      applyPlan: CreateMeasurementInput_measurement_applyPlan,
      autoApplyAfterParentApplyPlan: true
    }
  },
  MeasurementInput: {
    timestamp: {
      applyPlan($insert, val) {
        $insert.set("timestamp", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    key: {
      applyPlan($insert, val) {
        $insert.set("key", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    value: {
      applyPlan($insert, val) {
        $insert.set("value", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    userId: {
      applyPlan($insert, val) {
        $insert.set("user_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateUserPayload: {
    __assertStep: ObjectStep,
    clientMutationId: UpdateUserPayload_clientMutationIdPlan,
    user: UpdateUserPayload_userPlan,
    query: UpdateUserPayload_queryPlan,
    userEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = uniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_usersPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("UsersOrderBy"));
        const $connection = connection($select);
        // NOTE: you must not use `$single = $select.single()`
        // here because doing so will mark the row as unique, and
        // then the ordering logic (and thus cursor) will differ.
        const $single = $select.row(first($select));
        return new EdgeStep($connection, $single);
      },
      args: {
        orderBy: undefined
      }
    }
  },
  UpdateUserInput: {
    clientMutationId: {
      applyPlan: UpdateUserInput_clientMutationId_applyPlan
    },
    nodeId: undefined,
    userPatch: {
      applyPlan: UpdateUserInput_userPatch_applyPlan
    }
  },
  UserPatch: {
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    name: {
      applyPlan($insert, val) {
        $insert.set("name", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateUserByIdInput: {
    clientMutationId: {
      applyPlan: UpdateUserByIdInput_clientMutationId_applyPlan
    },
    id: undefined,
    userPatch: {
      applyPlan: UpdateUserByIdInput_userPatch_applyPlan
    }
  },
  UpdateMeasurementPayload: {
    __assertStep: ObjectStep,
    clientMutationId: UpdateMeasurementPayload_clientMutationIdPlan,
    measurement: UpdateMeasurementPayload_measurementPlan,
    query: UpdateMeasurementPayload_queryPlan,
    measurementEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = uniques2[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_measurementsPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("MeasurementsOrderBy"));
        const $connection = connection($select);
        // NOTE: you must not use `$single = $select.single()`
        // here because doing so will mark the row as unique, and
        // then the ordering logic (and thus cursor) will differ.
        const $single = $select.row(first($select));
        return new EdgeStep($connection, $single);
      },
      args: {
        orderBy: undefined
      }
    },
    userByUserId($record) {
      return pgResource_usersPgResource.get({
        id: $record.get("result").get("user_id")
      });
    }
  },
  UpdateMeasurementInput: {
    clientMutationId: {
      applyPlan: UpdateMeasurementInput_clientMutationId_applyPlan
    },
    nodeId: undefined,
    measurementPatch: {
      applyPlan: UpdateMeasurementInput_measurementPatch_applyPlan
    }
  },
  MeasurementPatch: {
    timestamp: {
      applyPlan($insert, val) {
        $insert.set("timestamp", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    key: {
      applyPlan($insert, val) {
        $insert.set("key", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    value: {
      applyPlan($insert, val) {
        $insert.set("value", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    userId: {
      applyPlan($insert, val) {
        $insert.set("user_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateMeasurementByTimestampAndKeyInput: {
    clientMutationId: {
      applyPlan: UpdateMeasurementByTimestampAndKeyInput_clientMutationId_applyPlan
    },
    timestamp: undefined,
    key: undefined,
    measurementPatch: {
      applyPlan: UpdateMeasurementByTimestampAndKeyInput_measurementPatch_applyPlan
    }
  },
  DeleteUserPayload: {
    __assertStep: ObjectStep,
    clientMutationId: DeleteUserPayload_clientMutationIdPlan,
    user: DeleteUserPayload_userPlan,
    deletedUserId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.User.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query: DeleteUserPayload_queryPlan,
    userEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = uniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_usersPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("UsersOrderBy"));
        const $connection = connection($select);
        // NOTE: you must not use `$single = $select.single()`
        // here because doing so will mark the row as unique, and
        // then the ordering logic (and thus cursor) will differ.
        const $single = $select.row(first($select));
        return new EdgeStep($connection, $single);
      },
      args: {
        orderBy: undefined
      }
    }
  },
  DeleteUserInput: {
    clientMutationId: {
      applyPlan: DeleteUserInput_clientMutationId_applyPlan
    },
    nodeId: undefined
  },
  DeleteUserByIdInput: {
    clientMutationId: {
      applyPlan: DeleteUserByIdInput_clientMutationId_applyPlan
    },
    id: undefined
  },
  DeleteMeasurementPayload: {
    __assertStep: ObjectStep,
    clientMutationId: DeleteMeasurementPayload_clientMutationIdPlan,
    measurement: DeleteMeasurementPayload_measurementPlan,
    deletedMeasurementId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.Measurement.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query: DeleteMeasurementPayload_queryPlan,
    measurementEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = uniques2[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_measurementsPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("MeasurementsOrderBy"));
        const $connection = connection($select);
        // NOTE: you must not use `$single = $select.single()`
        // here because doing so will mark the row as unique, and
        // then the ordering logic (and thus cursor) will differ.
        const $single = $select.row(first($select));
        return new EdgeStep($connection, $single);
      },
      args: {
        orderBy: undefined
      }
    },
    userByUserId($record) {
      return pgResource_usersPgResource.get({
        id: $record.get("result").get("user_id")
      });
    }
  },
  DeleteMeasurementInput: {
    clientMutationId: {
      applyPlan: DeleteMeasurementInput_clientMutationId_applyPlan
    },
    nodeId: undefined
  },
  DeleteMeasurementByTimestampAndKeyInput: {
    clientMutationId: {
      applyPlan: DeleteMeasurementByTimestampAndKeyInput_clientMutationId_applyPlan
    },
    timestamp: undefined,
    key: undefined
  }
};
export const schema = makeGrafastSchema({
  typeDefs: typeDefs,
  plans: plans
});
