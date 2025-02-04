import { PgDeleteSingleStep, PgExecutor, TYPES, assertPgClassSingleStep, domainOfCodec, extractEnumExtensionValue, listOfCodec, makeRegistry, pgDeleteSingle, pgInsertSingle, pgSelectFromRecord, pgSelectFromRecords, pgUpdateSingle, recordCodec, sqlFromArgDigests } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ObjectStep, __ValueStep, access, assertEdgeCapableStep, assertExecutableStep, assertPageInfoCapableStep, connection, constant, context, each, first, inhibitOnNull, lambda, list, makeGrafastSchema, node, object, rootValue, specFromNodeId } from "grafast";
import { GraphQLError, Kind } from "graphql";
import { sql } from "pg-sql2";
const handler = {
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
  raw: handler.codec,
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
const tIdentifier = sql.identifier("nested_arrays", "t");
const workHourPartsCodec = recordCodec({
  name: "workHourParts",
  identifier: sql.identifier("nested_arrays", "work_hour_parts"),
  attributes: {
    __proto__: null,
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
  },
  description: undefined,
  extensions: {
    isTableLike: false,
    pg: {
      serviceName: "main",
      schemaName: "nested_arrays",
      name: "work_hour_parts"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const workHourCodec = domainOfCodec(workHourPartsCodec, "workHour", sql.identifier("nested_arrays", "work_hour"), {
  description: undefined,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "nested_arrays",
      name: "work_hour"
    },
    tags: {
      __proto__: null
    }
  },
  notNull: true
});
const workHourArrayCodec = listOfCodec(workHourCodec, {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "nested_arrays",
      name: "_work_hour"
    },
    tags: {
      __proto__: null
    }
  },
  typeDelim: ",",
  description: undefined,
  name: "workHourArray"
});
const workhoursCodec = domainOfCodec(workHourArrayCodec, "workhours", sql.identifier("nested_arrays", "workhours"), {
  description: undefined,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "nested_arrays",
      name: "workhours"
    },
    tags: {
      __proto__: null
    }
  },
  notNull: true
});
const workhoursArrayCodec = listOfCodec(workhoursCodec, {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "nested_arrays",
      name: "_workhours"
    },
    tags: {
      __proto__: null
    }
  },
  typeDelim: ",",
  description: undefined,
  name: "workhoursArray"
});
const workingHoursCodec = domainOfCodec(workhoursArrayCodec, "workingHours", sql.identifier("nested_arrays", "working_hours"), {
  description: "Mo, Tu, We, Th, Fr, Sa, Su, Ho",
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "nested_arrays",
      name: "working_hours"
    },
    tags: {
      __proto__: null
    }
  },
  notNull: false
});
const spec_t = {
  name: "t",
  identifier: tIdentifier,
  attributes: {
    __proto__: null,
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
      codec: workingHoursCodec,
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
      schemaName: "nested_arrays",
      name: "t"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
};
const tCodec = recordCodec(spec_t);
const check_work_hoursFunctionIdentifer = sql.identifier("nested_arrays", "check_work_hours");
const tUniques = [{
  isPrimary: true,
  attributes: ["k"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const registry = makeRegistry({
  pgExecutors: {
    __proto__: null,
    main: executor
  },
  pgCodecs: {
    __proto__: null,
    bool: TYPES.boolean,
    t: tCodec,
    int4: TYPES.int,
    workingHours: workingHoursCodec,
    workhours: workhoursCodec,
    workHour: workHourCodec,
    workHourParts: workHourPartsCodec,
    int2: TYPES.int2,
    text: TYPES.text,
    varchar: TYPES.varchar,
    bpchar: TYPES.bpchar,
    workHourArray: workHourArrayCodec,
    workhoursArray: workhoursArrayCodec
  },
  pgResources: {
    __proto__: null,
    check_work_hours: {
      executor,
      name: "check_work_hours",
      identifier: "main.nested_arrays.check_work_hours(nested_arrays._work_hour)",
      from(...args) {
        return sql`${check_work_hoursFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "wh",
        required: true,
        notNull: true,
        codec: workHourArrayCodec
      }],
      isUnique: !false,
      codec: TYPES.boolean,
      uniques: [],
      isMutation: false,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "nested_arrays",
          name: "check_work_hours"
        },
        tags: {}
      },
      description: undefined
    },
    t: {
      executor: executor,
      name: "t",
      identifier: "main.nested_arrays.t",
      from: tIdentifier,
      codec: tCodec,
      uniques: tUniques,
      isVirtual: false,
      description: undefined,
      extensions: {
        description: undefined,
        pg: {
          serviceName: "main",
          schemaName: "nested_arrays",
          name: "t"
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
});
const pgResource_tPgResource = registry.pgResources["t"];
const nodeIdHandlerByTypeName = {
  __proto__: null,
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
        k: inhibitOnNull(access($list, [1]))
      };
    },
    get(spec) {
      return pgResource_tPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "ts";
    }
  }
};
const argDetailsSimple = [{
  graphqlArgName: "wh",
  postgresArgName: "wh",
  pgCodec: workHourArrayCodec,
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
function Query_allTs_plan() {
  return connection(pgResource_tPgResource.find());
}
const Query_allTs_postPlanResolvers = [($connection, $parent, fieldArgs, {
  field
}) => {
  const $orderBy = fieldArgs.getRaw("orderBy");
  const $select = $connection.getSubplan();
  const orderByArg = field.args.find(a => a.name === "orderBy");
  $select.apply(extractEnumExtensionValue(orderByArg.type, "pgSelectApply", $orderBy));
  return $connection;
}];
const resource_frmcdc_workHourPgResource = registry.pgResources["frmcdc_workHour"];
function CursorSerialize(value) {
  return "" + value;
}
const specFromArgs = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.T, $nodeId);
};
const specFromArgs2 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.T, $nodeId);
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
    query() {
      return rootValue();
    },
    nodeId($parent) {
      const specifier = handler.plan($parent);
      return lambda(specifier, nodeIdCodecs[handler.codec.name].encode);
    },
    node(_$root, args) {
      return node(nodeIdHandlerByTypeName, args.get("nodeId"));
    },
    tByK(_$root, args) {
      return pgResource_tPgResource.get({
        k: args.get("k")
      });
    },
    checkWorkHours($root, args, _info) {
      const selectArgs = makeArgs(args);
      return resource_check_work_hoursPgResource.execute(selectArgs);
    },
    t(_$parent, args) {
      const $nodeId = args.get("nodeId");
      return fetcher($nodeId);
    },
    allTs: {
      plan($parent, fieldArgs, info) {
        let $result = Query_allTs_plan($parent, fieldArgs, info);
        for (const ppr of Query_allTs_postPlanResolvers) {
          $result = ppr($result, $parent, fieldArgs, info);
        }
        return $result;
      },
      args: {
        first: {
          __proto__: null,
          grafast: {
            autoApplyAfterParentPlan: true,
            applyPlan(_, $connection, arg) {
              $connection.setFirst(arg.getRaw());
            }
          }
        },
        last: {
          __proto__: null,
          grafast: {
            autoApplyAfterParentPlan: true,
            applyPlan(_, $connection, val) {
              $connection.setLast(val.getRaw());
            }
          }
        },
        offset: {
          __proto__: null,
          grafast: {
            autoApplyAfterParentPlan: true,
            applyPlan(_, $connection, val) {
              $connection.setOffset(val.getRaw());
            }
          }
        },
        before: {
          __proto__: null,
          grafast: {
            autoApplyAfterParentPlan: true,
            applyPlan(_, $connection, val) {
              $connection.setBefore(val.getRaw());
            }
          }
        },
        after: {
          __proto__: null,
          grafast: {
            autoApplyAfterParentPlan: true,
            applyPlan(_, $connection, val) {
              $connection.setAfter(val.getRaw());
            }
          }
        },
        condition: {
          __proto__: null,
          grafast: {
            autoApplyAfterParentPlan: true,
            applyPlan(_condition, $connection) {
              const $select = $connection.getSubplan();
              return $select.wherePlan();
            }
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
    "__inputPlan": function WorkHourInput_inputPlan() {
      return object(Object.create(null));
    },
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
    nodes($connection) {
      return $connection.nodes();
    },
    edges($connection) {
      return $connection.edges();
    },
    pageInfo($connection) {
      // TYPES: why is this a TypeScript issue without the 'any'?
      return $connection.pageInfo();
    },
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
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
  Cursor: {
    serialize: CursorSerialize,
    parseValue: CursorSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"Cursor" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
    }
  },
  PageInfo: {
    __assertStep: assertPageInfoCapableStep,
    hasNextPage($pageInfo) {
      return $pageInfo.hasNextPage();
    },
    hasPreviousPage($pageInfo) {
      return $pageInfo.hasPreviousPage();
    },
    startCursor($pageInfo) {
      return $pageInfo.startCursor();
    },
    endCursor($pageInfo) {
      return $pageInfo.endCursor();
    }
  },
  TsOrderBy: {
    PRIMARY_KEY_ASC: {
      extensions: {
        __proto__: null,
        pgSelectApply(queryBuilder) {
          tUniques[0].attributes.forEach(attributeName => {
            const attribute = tCodec.attributes[attributeName];
            queryBuilder.orderBy({
              codec: attribute.codec,
              fragment: sql`${queryBuilder}.${sql.identifier(attributeName)}`,
              direction: "ASC",
              ...(undefined != null ? {
                nulls: undefined ? "LAST" : "FIRST"
              } : null)
            });
          });
          queryBuilder.setOrderIsUnique();
        }
      }
    },
    PRIMARY_KEY_DESC: {
      extensions: {
        __proto__: null,
        pgSelectApply(queryBuilder) {
          tUniques[0].attributes.forEach(attributeName => {
            const attribute = tCodec.attributes[attributeName];
            queryBuilder.orderBy({
              codec: attribute.codec,
              fragment: sql`${queryBuilder}.${sql.identifier(attributeName)}`,
              direction: "DESC",
              ...(undefined != null ? {
                nulls: undefined ? "LAST" : "FIRST"
              } : null)
            });
          });
          queryBuilder.setOrderIsUnique();
        }
      }
    },
    K_ASC: {
      extensions: {
        __proto__: null,
        pgSelectApply(queryBuilder) {
          queryBuilder.orderBy({
            attribute: "k",
            direction: "ASC",
            ...(undefined != null ? {
              nulls: undefined ? "LAST" : "FIRST"
            } : null)
          });
          if (true) {
            queryBuilder.setOrderIsUnique();
          }
        }
      }
    },
    K_DESC: {
      extensions: {
        __proto__: null,
        pgSelectApply(queryBuilder) {
          queryBuilder.orderBy({
            attribute: "k",
            direction: "DESC",
            ...(undefined != null ? {
              nulls: undefined ? "LAST" : "FIRST"
            } : null)
          });
          if (true) {
            queryBuilder.setOrderIsUnique();
          }
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_t.attributes.k.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_t.attributes.v.codec)}`;
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
          __proto__: null,
          grafast: {
            autoApplyAfterParentPlan: true,
            applyPlan(_, $object) {
              return $object;
            }
          }
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
          __proto__: null,
          grafast: {
            applyPlan(_, $object) {
              return $object;
            }
          }
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
          __proto__: null,
          grafast: {
            applyPlan(_, $object) {
              return $object;
            }
          }
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
          __proto__: null,
          grafast: {
            applyPlan(_, $object) {
              return $object;
            }
          }
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
          __proto__: null,
          grafast: {
            applyPlan(_, $object) {
              return $object;
            }
          }
        }
      }
    }
  },
  CreateTPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    t($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    tEdge($mutation, {
      $orderBy
    }, {
      field
    }) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = tUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return pgResource_tPgResource.find(spec);
        }
      })();
      // Perform ordering
      const orderByArg = field.args.find(a => a.name === "orderBy");
      $select.apply(extractEnumExtensionValue(orderByArg.type, "pgSelectApply", $orderBy));
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    }
  },
  CreateTInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    t: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  TInput: {
    "__inputPlan": function TInput_inputPlan() {
      return object(Object.create(null));
    },
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
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    t($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    tEdge($mutation, {
      $orderBy
    }, {
      field
    }) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = tUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return pgResource_tPgResource.find(spec);
        }
      })();
      // Perform ordering
      const orderByArg = field.args.find(a => a.name === "orderBy");
      $select.apply(extractEnumExtensionValue(orderByArg.type, "pgSelectApply", $orderBy));
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    }
  },
  UpdateTInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined,
    tPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  TPatch: {
    "__inputPlan": function TPatch_inputPlan() {
      return object(Object.create(null));
    },
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
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    k: undefined,
    tPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  DeleteTPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    t($object) {
      return $object.get("result");
    },
    deletedTId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.T.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    tEdge($mutation, {
      $orderBy
    }, {
      field
    }) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = tUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return pgResource_tPgResource.find(spec);
        }
      })();
      // Perform ordering
      const orderByArg = field.args.find(a => a.name === "orderBy");
      $select.apply(extractEnumExtensionValue(orderByArg.type, "pgSelectApply", $orderBy));
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    }
  },
  DeleteTInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined
  },
  DeleteTByKInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    k: undefined
  }
};
export const schema = makeGrafastSchema({
  typeDefs: typeDefs,
  plans: plans
});
