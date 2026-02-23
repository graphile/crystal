import { PgDeleteSingleStep, PgExecutor, TYPES, assertPgClassSingleStep, domainOfCodec, enumCodec, listOfCodec, makeRegistry, pgDeleteSingle, pgInsertSingle, pgSelectFromRecord, pgSelectFromRecords, pgUpdateSingle, recordCodec, sqlFromArgDigests, sqlValueWithCodec } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ObjectStep, __ValueStep, access, assertStep, bakedInput, bakedInputRuntime, connection, constant, context, createObjectAndApplyChildren, each, first, get as get2, inhibitOnNull, inspect, lambda, list, makeDecodeNodeId, makeGrafastSchema, object, operationPlan, rootValue, specFromNodeId, trap } from "grafast";
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
const base64JSONNodeIdCodec = {
  name: "base64JSON",
  encode: Object.assign(function base64JSONEncode(value) {
    return Buffer.from(JSON.stringify(value), "utf8").toString("base64");
  }, {
    isSyncAndSafe: true
  }),
  decode: Object.assign(function base64JSONDecode(value) {
    return JSON.parse(Buffer.from(value, "base64").toString("utf8"));
  }, {
    isSyncAndSafe: true
  })
};
const nodeIdCodecs = {
  __proto__: null,
  raw: nodeIdHandler_Query.codec,
  base64JSON: base64JSONNodeIdCodec,
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
      pgSettings: ctx.get("pgSettings"),
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
      codec: TYPES.int2
    },
    from_minutes: {
      codec: TYPES.int2
    },
    to_hours: {
      codec: TYPES.int2
    },
    to_minutes: {
      codec: TYPES.int2
    }
  },
  extensions: {
    isTableLike: false,
    pg: {
      serviceName: "main",
      schemaName: "nested_arrays",
      name: "work_hour_parts"
    }
  },
  executor: executor
});
const workHourCodec = domainOfCodec(workHourPartsCodec, "workHour", sql.identifier("nested_arrays", "work_hour"), {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "nested_arrays",
      name: "work_hour"
    }
  },
  notNull: true
});
const workHourArrayCodec = listOfCodec(workHourCodec, {
  name: "workHourArray",
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "nested_arrays",
      name: "_work_hour"
    }
  }
});
const workhoursCodec = domainOfCodec(workHourArrayCodec, "workhours", sql.identifier("nested_arrays", "workhours"), {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "nested_arrays",
      name: "workhours"
    }
  },
  notNull: true
});
const workhoursArrayCodec = listOfCodec(workhoursCodec, {
  name: "workhoursArray",
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "nested_arrays",
      name: "_workhours"
    }
  }
});
const workingHoursCodec = domainOfCodec(workhoursArrayCodec, "workingHours", sql.identifier("nested_arrays", "working_hours"), {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "nested_arrays",
      name: "working_hours"
    }
  },
  description: "Mo, Tu, We, Th, Fr, Sa, Su, Ho"
});
const tCodec = recordCodec({
  name: "t",
  identifier: tIdentifier,
  attributes: {
    __proto__: null,
    k: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    v: {
      codec: workingHoursCodec
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "nested_arrays",
      name: "t"
    }
  },
  executor: executor
});
const check_work_hoursFunctionIdentifer = sql.identifier("nested_arrays", "check_work_hours");
const tUniques = [{
  attributes: ["k"],
  isPrimary: true
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
    workhoursArray: workhoursArrayCodec,
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
          constraintName: "FAKE_enum_tables_abcd_view_primaryKey_5"
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
    LotsOfEnumsEnum3Enum: enumCodec({
      name: "LotsOfEnumsEnum3Enum",
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
          name: "LotsOfEnumsEnum3"
        }
      }
    }),
    LotsOfEnumsEnum4Enum: enumCodec({
      name: "LotsOfEnumsEnum4Enum",
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
          name: "LotsOfEnumsEnum4"
        }
      }
    }),
    SimpleEnumEnum: enumCodec({
      name: "SimpleEnumEnum",
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
          name: "SimpleEnum"
        }
      }
    }),
    EntityKindsEnum: enumCodec({
      name: "EntityKindsEnum",
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
          name: "EntityKinds"
        }
      }
    }),
    EnumTableTransportationEnum: enumCodec({
      name: "EnumTableTransportationEnum",
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
          name: "EnumTableTransportation"
        }
      }
    }),
    LengthStatusEnum: enumCodec({
      name: "LengthStatusEnum",
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
          name: "LengthStatus"
        }
      }
    }),
    StageOptionsEnum: enumCodec({
      name: "StageOptionsEnum",
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
          name: "StageOptions"
        }
      }
    })
  },
  pgResources: {
    __proto__: null,
    check_work_hours: {
      executor: executor,
      name: "check_work_hours",
      identifier: "main.nested_arrays.check_work_hours(nested_arrays._work_hour)",
      from(...args) {
        return sql`${check_work_hoursFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "wh",
        codec: workHourArrayCodec,
        required: true,
        notNull: true
      }],
      codec: TYPES.boolean,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "nested_arrays",
          name: "check_work_hours"
        }
      },
      isUnique: true
    },
    t: {
      executor: executor,
      name: "t",
      identifier: "main.nested_arrays.t",
      from: tIdentifier,
      codec: tCodec,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "nested_arrays",
          name: "t"
        }
      },
      uniques: tUniques
    }
  },
  pgRelations: {
    __proto__: null
  }
});
const resource_tPgResource = registry.pgResources["t"];
const argDetailsSimple_check_work_hours = [{
  graphqlArgName: "wh",
  pgCodec: workHourArrayCodec,
  postgresArgName: "wh",
  required: true
}];
function makeArg(path, args, details) {
  const {
    graphqlArgName,
    postgresArgName,
    pgCodec,
    fetcher
  } = details;
  const fullPath = [...path, graphqlArgName];
  const $raw = args.getRaw(fullPath);
  // TODO: this should maybe be operationPlan().withLatestSideEffectLayerPlan()
  const step = operationPlan().withRootLayerPlan(() => fetcher ? trap(fetcher($raw).record(), 4) : bakedInput(args.typeAt(fullPath), $raw));
  return {
    step,
    pgCodec,
    name: postgresArgName ?? undefined
  };
}
const makeArgs_check_work_hours = (args, path = []) => argDetailsSimple_check_work_hours.map(details => makeArg(path, args, details));
const resource_check_work_hoursPgResource = registry.pgResources["check_work_hours"];
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
const nodeIdHandler_T = makeTableNodeIdHandler({
  typeName: "T",
  identifier: "ts",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_tPgResource,
  pk: tUniques[0].attributes
});
const specForHandlerCache = new Map();
function specForHandler() {
  const existing = specForHandlerCache.get(nodeIdHandler_T);
  if (existing) {
    return existing;
  }
  function spec(nodeId) {
    // We only want to return the specifier if it matches
    // this handler; otherwise return null.
    if (nodeId == null) return null;
    try {
      const specifier = nodeIdHandler_T.codec.decode(nodeId);
      if (nodeIdHandler_T.match(specifier)) {
        return specifier;
      }
    } catch {
      // Ignore errors
    }
    return null;
  }
  spec.displayName = `specifier_${nodeIdHandler_T.typeName}_${nodeIdHandler_T.codec.name}`;
  spec.isSyncAndSafe = true; // Optimization
  specForHandlerCache.set(nodeIdHandler_T, spec);
  return spec;
}
const nodeFetcher_T = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler());
  return nodeIdHandler_T.get(nodeIdHandler_T.getSpec($decoded));
};
function qbWhereBuilder(qb) {
  return qb.whereBuilder();
}
const nodeIdHandlerByTypeName = {
  __proto__: null,
  Query: nodeIdHandler_Query,
  T: nodeIdHandler_T
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
const resource_frmcdc_workHourPgResource = registry.pgResources["frmcdc_workHour"];
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
const specFromArgs_T = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_T, $nodeId);
};
function applyInputToUpdateOrDelete(_, $object) {
  return $object;
}
const specFromArgs_T2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_T, $nodeId);
};
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
    return resource_tPgResource.find(spec);
  }
};
const pgMutationPayloadEdge = (pkAttributes, $mutation, fieldArgs) => {
  const $select = getPgSelectSingleFromMutationResult(pkAttributes, $mutation);
  if (!$select) return constant(null);
  fieldArgs.apply($select, "orderBy");
  const $connection = connection($select);
  return new EdgeStep($connection, first($connection));
};
function getClientMutationIdForUpdateOrDeletePlan($mutation) {
  const $result = $mutation.getStepForKey("result");
  return $result.getMeta("clientMutationId");
}
function planUpdateOrDeletePayloadResult($object) {
  return $object.get("result");
}
function applyClientMutationIdForUpdateOrDelete(qb, val) {
  qb.setMeta("clientMutationId", val);
}
function applyPatchFields(qb, arg) {
  if (arg != null) {
    return qb.setBuilder();
  }
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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: TCondition

    """The method to use when ordering \`T\`."""
    orderBy: [TsOrderBy!] = [PRIMARY_KEY_ASC]
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

"""
A condition to be used against \`T\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input TCondition {
  """Checks for equality with the object’s \`k\` field."""
  k: Int

  """Checks for equality with the object’s \`v\` field."""
  v: [[WorkHourInput]]
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
export const objects = {
  Query: {
    assertStep() {
      return true;
    },
    plans: {
      allTs: {
        plan() {
          return connection(resource_tPgResource.find());
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
      checkWorkHours($root, args, _info) {
        const selectArgs = makeArgs_check_work_hours(args);
        return resource_check_work_hoursPgResource.execute(selectArgs);
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
      },
      t(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_T($nodeId);
      },
      tByK(_$root, {
        $k
      }) {
        return resource_tPgResource.get({
          k: $k
        });
      }
    }
  },
  Mutation: {
    assertStep: __ValueStep,
    plans: {
      createT: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_tPgResource);
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
      deleteT: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_tPgResource, specFromArgs_T2(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteTByK: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_tPgResource, {
            k: args.getRaw(['input', "k"])
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
      updateT: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_tPgResource, specFromArgs_T(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateTByK: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_tPgResource, {
            k: args.getRaw(['input', "k"])
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
  CreateTPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId($mutation) {
        const $insert = $mutation.getStepForKey("result");
        return $insert.getMeta("clientMutationId");
      },
      query: queryPlan,
      t($object) {
        return $object.get("result");
      },
      tEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(tUniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  DeleteTPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedTId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_T.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      query: queryPlan,
      t: planUpdateOrDeletePayloadResult,
      tEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(tUniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  T: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nodeId($parent) {
        const specifier = nodeIdHandler_T.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_T.codec.name].encode);
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
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of tUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_tPgResource.get(spec);
    }
  },
  TSConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
      }
    }
  },
  UpdateTPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan,
      t: planUpdateOrDeletePayloadResult,
      tEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(tUniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  WorkHour: {
    assertStep: assertPgClassSingleStep,
    plans: {
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
  CreateTInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      t(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  DeleteTByKInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteTInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  TCondition: {
    plans: {
      k($condition, val) {
        return applyAttributeCondition("k", TYPES.int, $condition, val);
      },
      v($condition, val) {
        return applyAttributeCondition("v", workingHoursCodec, $condition, val);
      }
    }
  },
  TInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      k(obj, val, {
        field,
        schema
      }) {
        obj.set("k", bakedInputRuntime(schema, field.type, val));
      },
      v(obj, val, {
        field,
        schema
      }) {
        obj.set("v", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  TPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      k(obj, val, {
        field,
        schema
      }) {
        obj.set("k", bakedInputRuntime(schema, field.type, val));
      },
      v(obj, val, {
        field,
        schema
      }) {
        obj.set("v", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  UpdateTByKInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      tPatch: applyPatchFields
    }
  },
  UpdateTInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      tPatch: applyPatchFields
    }
  },
  WorkHourInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      fromHours(obj, val, {
        field,
        schema
      }) {
        obj.set("from_hours", bakedInputRuntime(schema, field.type, val));
      },
      fromMinutes(obj, val, {
        field,
        schema
      }) {
        obj.set("from_minutes", bakedInputRuntime(schema, field.type, val));
      },
      toHours(obj, val, {
        field,
        schema
      }) {
        obj.set("to_hours", bakedInputRuntime(schema, field.type, val));
      },
      toMinutes(obj, val, {
        field,
        schema
      }) {
        obj.set("to_minutes", bakedInputRuntime(schema, field.type, val));
      }
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
  TsOrderBy: {
    values: {
      K_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "k",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      K_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "k",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_ASC(queryBuilder) {
        tUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        tUniques[0].attributes.forEach(attributeName => {
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
