import { PgDeleteSingleStep, PgExecutor, PgSelectStep, PgUnionAllStep, TYPES, assertPgClassSingleStep, domainOfCodec, listOfCodec, makeRegistry, pgDeleteSingle, pgInsertSingle, pgSelectFromRecord, pgSelectFromRecords, pgUpdateSingle, recordCodec, sqlFromArgDigests } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ObjectStep, SafeError, __ValueStep, access, assertEdgeCapableStep, assertExecutableStep, assertPageInfoCapableStep, connection, constant, context, each, first, getEnumValueConfig, lambda, list, makeGrafastSchema, node, object, rootValue, specFromNodeId } from "grafast";
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
const extensions2 = {
  oid: "1377394",
  pg: {
    serviceName: "main",
    schemaName: "nested_arrays",
    name: "_workhours"
  },
  tags: Object.create(null)
};
const extensions3 = {
  oid: "1377395",
  pg: {
    serviceName: "main",
    schemaName: "nested_arrays",
    name: "workhours"
  },
  tags: Object.create(null)
};
const extensions4 = {
  oid: "1377390",
  pg: {
    serviceName: "main",
    schemaName: "nested_arrays",
    name: "_work_hour"
  },
  tags: Object.create(null)
};
const extensions5 = {
  oid: "1377391",
  pg: {
    serviceName: "main",
    schemaName: "nested_arrays",
    name: "work_hour"
  },
  tags: Object.create(null)
};
const attributes2 = Object.assign(Object.create(null), {
  from_hours: {
    description: undefined,
    codec: TYPES.int2,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  },
  from_minutes: {
    description: undefined,
    codec: TYPES.int2,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  },
  to_hours: {
    description: undefined,
    codec: TYPES.int2,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  },
  to_minutes: {
    description: undefined,
    codec: TYPES.int2,
    notNull: false,
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
const extensions6 = {
  oid: "1377389",
  isTableLike: false,
  pg: {
    serviceName: "main",
    schemaName: "nested_arrays",
    name: "work_hour_parts"
  },
  tags: Object.create(null)
};
const spec_workHourParts = {
  name: "workHourParts",
  identifier: sql.identifier(...["nested_arrays", "work_hour_parts"]),
  attributes: attributes2,
  description: undefined,
  extensions: extensions6,
  executor: executor_mainPgExecutor
};
const innerCodec_workHourParts = recordCodec(spec_workHourParts);
const parts2 = ["nested_arrays", "work_hour"];
const sqlIdent2 = sql.identifier(...parts2);
const innerCodec_workHour = domainOfCodec(innerCodec_workHourParts, "workHour", sqlIdent2, {
  description: undefined,
  extensions: extensions5,
  notNull: true
});
const innerCodec_workHourArray = listOfCodec(innerCodec_workHour, {
  extensions: extensions4,
  typeDelim: ",",
  description: undefined,
  name: "workHourArray"
});
const parts3 = ["nested_arrays", "workhours"];
const sqlIdent3 = sql.identifier(...parts3);
const innerCodec_workhours = domainOfCodec(innerCodec_workHourArray, "workhours", sqlIdent3, {
  description: undefined,
  extensions: extensions3,
  notNull: true
});
const innerCodec_workhoursArray = listOfCodec(innerCodec_workhours, {
  extensions: extensions2,
  typeDelim: ",",
  description: undefined,
  name: "workhoursArray"
});
const parts4 = ["nested_arrays", "working_hours"];
const sqlIdent4 = sql.identifier(...parts4);
const attributes_v_codec_workingHours = domainOfCodec(innerCodec_workhoursArray, "workingHours", sqlIdent4, {
  description: "Mo, Tu, We, Th, Fr, Sa, Su, Ho",
  extensions: {
    oid: "1377398",
    pg: {
      serviceName: "main",
      schemaName: "nested_arrays",
      name: "working_hours"
    },
    tags: Object.create(null)
  },
  notNull: false
});
const attributes = Object.assign(Object.create(null), {
  k: {
    description: undefined,
    codec: TYPES.int,
    notNull: true,
    hasDefault: true,
    extensions: {
      tags: {}
    }
  },
  v: {
    description: undefined,
    codec: attributes_v_codec_workingHours,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  }
});
const extensions7 = {
  oid: "1377403",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "nested_arrays",
    name: "t"
  },
  tags: Object.create(null)
};
const parts5 = ["nested_arrays", "t"];
const sqlIdent5 = sql.identifier(...parts5);
const spec_t = {
  name: "t",
  identifier: sqlIdent5,
  attributes,
  description: undefined,
  extensions: extensions7,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_t_t = recordCodec(spec_t);
const extensions8 = {
  pg: {
    serviceName: "main",
    schemaName: "nested_arrays",
    name: "check_work_hours"
  },
  tags: {
    behavior: ["queryField -mutationField -typeField", "-filter -order"]
  }
};
const parts6 = ["nested_arrays", "check_work_hours"];
const sqlIdent6 = sql.identifier(...parts6);
const extensions9 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "nested_arrays",
    name: "t"
  },
  tags: {}
};
const uniques = [{
  isPrimary: true,
  attributes: ["k"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registry = makeRegistry({
  pgCodecs: Object.assign(Object.create(null), {
    bool: TYPES.boolean,
    t: registryConfig_pgCodecs_t_t,
    int4: TYPES.int,
    workingHours: attributes_v_codec_workingHours,
    workhours: innerCodec_workhours,
    workHour: innerCodec_workHour,
    workHourParts: innerCodec_workHourParts,
    int2: TYPES.int2,
    text: TYPES.text,
    varchar: TYPES.varchar,
    bpchar: TYPES.bpchar,
    workHourArray: innerCodec_workHourArray,
    workhoursArray: innerCodec_workhoursArray
  }),
  pgResources: Object.assign(Object.create(null), {
    check_work_hours: {
      executor: executor_mainPgExecutor,
      name: "check_work_hours",
      identifier: "main.nested_arrays.check_work_hours(nested_arrays._work_hour)",
      from(...args) {
        return sql`${sqlIdent6}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "wh",
        required: true,
        notNull: true,
        codec: innerCodec_workHourArray
      }],
      isUnique: !false,
      codec: TYPES.boolean,
      uniques: [],
      isMutation: false,
      extensions: extensions8,
      description: undefined
    },
    t: {
      executor: executor_mainPgExecutor,
      name: "t",
      identifier: "main.nested_arrays.t",
      from: registryConfig_pgCodecs_t_t.sqlType,
      codec: registryConfig_pgCodecs_t_t,
      uniques,
      isVirtual: false,
      description: undefined,
      extensions: extensions9
    }
  }),
  pgRelations: Object.create(null)
});
const pgResource_tPgResource = registry.pgResources["t"];
const nodeIdHandlerByTypeName = Object.assign(Object.create(null), {
  Query: handler,
  T: {
    typeName: "T",
    codec: nodeIdCodecs_base64JSON_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("ts", false), $record.get("k")]);
    },
    getSpec($list) {
      return {
        k: access($list, [1])
      };
    },
    get(spec) {
      return pgResource_tPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "ts";
    }
  }
});
const argDetailsSimple = [{
  graphqlArgName: "wh",
  postgresArgName: "wh",
  pgCodec: innerCodec_workHourArray,
  required: true,
  fetcher: null
}];
const makeArgs = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 1; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple[i];
    const $raw = args.getRaw([...path, graphqlArgName]);
    let step;
    if ($raw.evalIs(undefined)) {
      if (!required && i >= 0 - 1) {
        skipped = true;
        continue;
      } else {
        step = constant(null);
      }
    } else if (fetcher) {
      step = fetcher(args.get([...path, graphqlArgName])).record();
    } else {
      step = args.get([...path, graphqlArgName]);
    }
    if (skipped) {
      const name = postgresArgName;
      if (!name) {
        throw new Error("GraphileInternalError<6f9e0fbc-6c73-4811-a7cf-c2bc2b3c0946>: This should not be possible since we asserted that allArgsAreNamed");
      }
      selectArgs.push({
        step,
        pgCodec,
        name
      });
    } else {
      selectArgs.push({
        step,
        pgCodec
      });
    }
  }
  return selectArgs;
};
const resource_check_work_hoursPgResource = registry.pgResources["check_work_hours"];
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
})(nodeIdHandlerByTypeName.T);
function Query_allTs_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allTs_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Query_allTs_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allTs_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Query_allTs_after_applyPlan(_, $connection, val) {
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
const resource_frmcdc_workHourPgResource = registry.pgResources["frmcdc_workHour"];
function TSConnection_nodesPlan($connection) {
  return $connection.nodes();
}
function TSConnection_edgesPlan($connection) {
  return $connection.edges();
}
function TSConnection_pageInfoPlan($connection) {
  // TYPES: why is this a TypeScript issue without the 'any'?
  return $connection.pageInfo();
}
function PageInfo_hasNextPagePlan($pageInfo) {
  return $pageInfo.hasNextPage();
}
function PageInfo_hasPreviousPagePlan($pageInfo) {
  return $pageInfo.hasPreviousPage();
}
function Mutation_createT_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.T, $nodeId);
};
function Mutation_updateT_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updateTByK_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs2 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.T, $nodeId);
};
function Mutation_deleteT_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deleteTByK_input_applyPlan(_, $object) {
  return $object;
}
function CreateTPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function CreateTPayload_tPlan($object) {
  return $object.get("result");
}
function CreateTPayload_queryPlan() {
  return rootValue();
}
function CreateTInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function CreateTInput_t_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateTPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function UpdateTPayload_tPlan($object) {
  return $object.get("result");
}
function UpdateTPayload_queryPlan() {
  return rootValue();
}
function UpdateTInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateTInput_tPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateTByKInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateTByKInput_tPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function DeleteTPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function DeleteTPayload_tPlan($object) {
  return $object.get("result");
}
function DeleteTPayload_queryPlan() {
  return rootValue();
}
function DeleteTInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteTByKInput_clientMutationId_applyPlan($input, val) {
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

  """Get a single \`T\`."""
  tByK(k: Int!): T
  checkWorkHours(wh: [WorkHourInput]!): Boolean

  """Reads a single \`T\` using its globally unique \`ID\`."""
  t(
    """The globally unique \`ID\` to be used in selecting a single \`T\`."""
    nodeId: ID!
  ): T

  """Reads and enables pagination through a set of \`T\`."""
  allTs(
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

    """The method to use when ordering \`T\`."""
    orderBy: [TsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: TCondition
  ): TSConnection
}

"""An object with a globally unique \`ID\`."""
interface Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
}

type T implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  k: Int!
  v: [[WorkHour!]!]
}

type WorkHour {
  fromHours: Int
  fromMinutes: Int
  toHours: Int
  toMinutes: Int
}

"""An input for mutations affecting \`WorkHour\`"""
input WorkHourInput {
  fromHours: Int
  fromMinutes: Int
  toHours: Int
  toMinutes: Int
}

"""A connection to a list of \`T\` values."""
type TSConnection {
  """A list of \`T\` objects."""
  nodes: [T]!

  """
  A list of edges which contains the \`T\` and cursor to aid in pagination.
  """
  edges: [TSEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`T\` you could get from the connection."""
  totalCount: Int!
}

"""A \`T\` edge in the connection."""
type TSEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`T\` at the end of the edge."""
  node: T
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

"""Methods to use when ordering \`T\`."""
enum TsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  K_ASC
  K_DESC
}

"""
A condition to be used against \`T\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input TCondition {
  """Checks for equality with the object’s \`k\` field."""
  k: Int

  """Checks for equality with the object’s \`v\` field."""
  v: [[WorkHourInput]]
}

"""
The root mutation type which contains root level fields which mutate data.
"""
type Mutation {
  """Creates a single \`T\`."""
  createT(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateTInput!
  ): CreateTPayload

  """Updates a single \`T\` using its globally unique id and a patch."""
  updateT(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateTInput!
  ): UpdateTPayload

  """Updates a single \`T\` using a unique key and a patch."""
  updateTByK(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateTByKInput!
  ): UpdateTPayload

  """Deletes a single \`T\` using its globally unique id."""
  deleteT(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteTInput!
  ): DeleteTPayload

  """Deletes a single \`T\` using a unique key."""
  deleteTByK(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteTByKInput!
  ): DeleteTPayload
}

"""The output of our create \`T\` mutation."""
type CreateTPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`T\` that was created by this mutation."""
  t: T

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`T\`. May be used by Relay 1."""
  tEdge(
    """The method to use when ordering \`T\`."""
    orderBy: [TsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): TSEdge
}

"""All input for the create \`T\` mutation."""
input CreateTInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`T\` to be created by this mutation."""
  t: TInput!
}

"""An input for mutations affecting \`T\`"""
input TInput {
  k: Int
  v: [[WorkHourInput]]
}

"""The output of our update \`T\` mutation."""
type UpdateTPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`T\` that was updated by this mutation."""
  t: T

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`T\`. May be used by Relay 1."""
  tEdge(
    """The method to use when ordering \`T\`."""
    orderBy: [TsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): TSEdge
}

"""All input for the \`updateT\` mutation."""
input UpdateTInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`T\` to be updated.
  """
  nodeId: ID!

  """An object where the defined keys will be set on the \`T\` being updated."""
  tPatch: TPatch!
}

"""Represents an update to a \`T\`. Fields that are set will be updated."""
input TPatch {
  k: Int
  v: [[WorkHourInput]]
}

"""All input for the \`updateTByK\` mutation."""
input UpdateTByKInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  k: Int!

  """An object where the defined keys will be set on the \`T\` being updated."""
  tPatch: TPatch!
}

"""The output of our delete \`T\` mutation."""
type DeleteTPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`T\` that was deleted by this mutation."""
  t: T
  deletedTId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`T\`. May be used by Relay 1."""
  tEdge(
    """The method to use when ordering \`T\`."""
    orderBy: [TsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): TSEdge
}

"""All input for the \`deleteT\` mutation."""
input DeleteTInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`T\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteTByK\` mutation."""
input DeleteTByKInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  k: Int!
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
    tByK: {
      plan(_$root, args) {
        return pgResource_tPgResource.get({
          k: args.get("k")
        });
      },
      args: {
        k: undefined
      }
    },
    checkWorkHours: {
      plan($root, args, _info) {
        const selectArgs = makeArgs(args);
        return resource_check_work_hoursPgResource.execute(selectArgs);
      },
      args: {
        wh: undefined
      }
    },
    t: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    allTs: {
      plan() {
        return connection(pgResource_tPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allTs_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allTs_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allTs_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allTs_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allTs_after_applyPlan
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("TsOrderBy"));
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
  T: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.T.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.T.codec.name].encode);
    },
    k($record) {
      return $record.get("k");
    },
    v($record) {
      const $val = $record.get("v");
      return each($val, $list => {
        const $select = pgSelectFromRecords(resource_frmcdc_workHourPgResource, $list);
        $select.setTrusted();
        return $select;
      });
    }
  },
  WorkHour: {
    __assertStep: assertPgClassSingleStep,
    fromHours($record) {
      return $record.get("from_hours");
    },
    fromMinutes($record) {
      return $record.get("from_minutes");
    },
    toHours($record) {
      return $record.get("to_hours");
    },
    toMinutes($record) {
      return $record.get("to_minutes");
    }
  },
  WorkHourInput: {
    fromHours: {
      applyPlan($insert, val) {
        $insert.set("from_hours", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    fromMinutes: {
      applyPlan($insert, val) {
        $insert.set("from_minutes", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    toHours: {
      applyPlan($insert, val) {
        $insert.set("to_hours", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    toMinutes: {
      applyPlan($insert, val) {
        $insert.set("to_minutes", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  TSConnection: {
    __assertStep: ConnectionStep,
    nodes: TSConnection_nodesPlan,
    edges: TSConnection_edgesPlan,
    pageInfo: TSConnection_pageInfoPlan,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  TSEdge: {
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
  TsOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        uniques[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_t_t.attributes[attributeName];
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
          const attribute = registryConfig_pgCodecs_t_t.attributes[attributeName];
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
    K_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "k",
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
    K_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "k",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (true) {
          plan.setOrderIsUnique();
        }
      }
    }
  },
  TCondition: {
    k: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "k",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "k",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes.k.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    v: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "v",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "v",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes.v.codec)}`;
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
    createT: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_tPgResource, Object.create(null))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan: Mutation_createT_input_applyPlan
        }
      }
    },
    updateT: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_tPgResource, specFromArgs(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_updateT_input_applyPlan
        }
      }
    },
    updateTByK: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_tPgResource, {
            k: args.get(['input', "k"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_updateTByK_input_applyPlan
        }
      }
    },
    deleteT: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_tPgResource, specFromArgs2(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_deleteT_input_applyPlan
        }
      }
    },
    deleteTByK: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_tPgResource, {
            k: args.get(['input', "k"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_deleteTByK_input_applyPlan
        }
      }
    }
  },
  CreateTPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId: CreateTPayload_clientMutationIdPlan,
    t: CreateTPayload_tPlan,
    query: CreateTPayload_queryPlan,
    tEdge: {
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
            return pgResource_tPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("TsOrderBy"));
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
  CreateTInput: {
    clientMutationId: {
      applyPlan: CreateTInput_clientMutationId_applyPlan,
      autoApplyAfterParentApplyPlan: true
    },
    t: {
      applyPlan: CreateTInput_t_applyPlan,
      autoApplyAfterParentApplyPlan: true
    }
  },
  TInput: {
    k: {
      applyPlan($insert, val) {
        $insert.set("k", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    v: {
      applyPlan($insert, val) {
        $insert.set("v", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateTPayload: {
    __assertStep: ObjectStep,
    clientMutationId: UpdateTPayload_clientMutationIdPlan,
    t: UpdateTPayload_tPlan,
    query: UpdateTPayload_queryPlan,
    tEdge: {
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
            return pgResource_tPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("TsOrderBy"));
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
  UpdateTInput: {
    clientMutationId: {
      applyPlan: UpdateTInput_clientMutationId_applyPlan
    },
    nodeId: undefined,
    tPatch: {
      applyPlan: UpdateTInput_tPatch_applyPlan
    }
  },
  TPatch: {
    k: {
      applyPlan($insert, val) {
        $insert.set("k", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    v: {
      applyPlan($insert, val) {
        $insert.set("v", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateTByKInput: {
    clientMutationId: {
      applyPlan: UpdateTByKInput_clientMutationId_applyPlan
    },
    k: undefined,
    tPatch: {
      applyPlan: UpdateTByKInput_tPatch_applyPlan
    }
  },
  DeleteTPayload: {
    __assertStep: ObjectStep,
    clientMutationId: DeleteTPayload_clientMutationIdPlan,
    t: DeleteTPayload_tPlan,
    deletedTId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.T.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query: DeleteTPayload_queryPlan,
    tEdge: {
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
            return pgResource_tPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("TsOrderBy"));
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
  DeleteTInput: {
    clientMutationId: {
      applyPlan: DeleteTInput_clientMutationId_applyPlan
    },
    nodeId: undefined
  },
  DeleteTByKInput: {
    clientMutationId: {
      applyPlan: DeleteTByKInput_clientMutationId_applyPlan
    },
    k: undefined
  }
};
export const schema = makeGrafastSchema({
  typeDefs: typeDefs,
  plans: plans
});
