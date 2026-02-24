import { PgDeleteSingleStep, PgExecutor, TYPES, assertPgClassSingleStep, enumCodec, makeRegistry, pgDeleteSingle, pgInsertSingle, pgSelectFromRecord, pgUpdateSingle, recordCodec, sqlValueWithCodec } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ObjectStep, __ValueStep, access, assertStep, bakedInputRuntime, connection, constant, context, createObjectAndApplyChildren, first, get as get2, inhibitOnNull, inspect, lambda, list, makeDecodeNodeId, makeDecodeNodeIdRuntime, makeGrafastSchema, markSyncAndSafe, object, rootValue, specFromNodeId } from "grafast";
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
const barIdentifier = sql.identifier("issue_2334", "bar");
const barCodec = recordCodec({
  name: "bar",
  identifier: barIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: false
      }
    },
    col: {
      codec: TYPES.text,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "issue_2334",
      name: "bar"
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
      codec: TYPES.int,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: false
      }
    },
    col: {
      codec: TYPES.text,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "issue_2334",
      name: "foo"
    }
  },
  executor: executor
});
const barUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const bar_resourceOptionsConfig = {
  executor: executor,
  name: "bar",
  identifier: "main.issue_2334.bar",
  from: barIdentifier,
  codec: barCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "issue_2334",
      name: "bar"
    },
    canSelect: true,
    canInsert: true,
    canUpdate: true,
    canDelete: true
  },
  uniques: barUniques
};
const fooUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const foo_resourceOptionsConfig = {
  executor: executor,
  name: "foo",
  identifier: "main.issue_2334.foo",
  from: fooIdentifier,
  codec: fooCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "issue_2334",
      name: "foo"
    },
    canSelect: true,
    canInsert: true,
    canUpdate: true,
    canDelete: true
  },
  uniques: fooUniques
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
    foo: fooCodec,
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
    bar: bar_resourceOptionsConfig,
    foo: foo_resourceOptionsConfig
  },
  pgRelations: {
    __proto__: null,
    bar: {
      __proto__: null,
      fooByMyId: {
        localCodec: barCodec,
        remoteResourceOptions: foo_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["id"],
        isUnique: true
      }
    },
    foo: {
      __proto__: null,
      barByTheirId: {
        localCodec: fooCodec,
        remoteResourceOptions: bar_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["id"],
        isUnique: true,
        isReferencee: true
      }
    }
  }
};
const registry = makeRegistry(registryConfig);
const spec_resource_barPgResource = registry.pgResources["bar"];
const nodeIdHandler_Bar = makeTableNodeIdHandler({
  typeName: "Bar",
  identifier: "bars",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: spec_resource_barPgResource,
  pk: barUniques[0].attributes
});
const specForHandlerCache = new Map();
function specForHandler(handler) {
  const existing = specForHandlerCache.get(handler);
  if (existing) {
    return existing;
  }
  const spec = markSyncAndSafe(function spec(nodeId) {
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
  }, `specifier_${handler.typeName}_${handler.codec.name}`);
  specForHandlerCache.set(handler, spec);
  return spec;
}
const nodeFetcher_Bar = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Bar));
  return nodeIdHandler_Bar.get(nodeIdHandler_Bar.getSpec($decoded));
};
const spec_resource_fooPgResource = registry.pgResources["foo"];
const nodeIdHandler_Foo = makeTableNodeIdHandler({
  typeName: "Foo",
  identifier: "foos",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: spec_resource_fooPgResource,
  pk: fooUniques[0].attributes
});
const nodeFetcher_Foo = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Foo));
  return nodeIdHandler_Foo.get(nodeIdHandler_Foo.getSpec($decoded));
};
function applyFirstArg(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function applyLastArg(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function applyOffsetArg(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function applyBeforeArg(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function applyAfterArg(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
function qbWhereBuilder(qb) {
  return qb.whereBuilder();
}
const applyConditionArgToConnection = (_condition, $connection, arg) => {
  const $select = $connection.getSubplan();
  arg.apply($select, qbWhereBuilder);
};
function applyOrderByArgToConnection(parent, $connection, value) {
  const $select = $connection.getSubplan();
  value.apply($select);
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
const totalCountConnectionPlan = $connection => $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
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
const BarCondition_colApply = ($condition, val) => applyAttributeCondition("col", TYPES.text, $condition, val);
const decodeNodeId_foo = makeDecodeNodeIdRuntime([nodeIdHandler_Foo]);
const getIdentifiersFromSpecifier1 = specifier => {
  if (specifier == null) return null;
  const value = specifier?.[nodeIdHandler_Foo.codec.name];
  const match = value != null ? nodeIdHandler_Foo.match(value) : false;
  if (match) {
    return nodeIdHandler_Foo.getIdentifiers(value);
  }
  return null;
};
const getIdentifiers_foo = nodeId => getIdentifiersFromSpecifier1(decodeNodeId_foo(nodeId));
const localAttributeCodecs_bar_fooByMyId = [TYPES.int];
const pgConditionApplyNodeId = (attributeCount, localAttributes, typeName, condition, nodeId) => {
  if (nodeId === undefined) {
    return;
  } else if (nodeId === null) {
    for (const localName of localAttributes) {
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
    throw new Error(`Invalid node identifier for '${typeName}'; expected string`);
  } else {
    const identifiers = getIdentifiers_foo(nodeId);
    if (identifiers == null) {
      throw new Error(`Invalid node identifier for '${typeName}'`);
    }
    for (let i = 0; i < attributeCount; i++) {
      const localName = localAttributes[i];
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
        const codec = localAttributeCodecs_bar_fooByMyId[i];
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
};
const BarsOrderBy_COL_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "col",
    direction: "ASC"
  });
};
const BarsOrderBy_COL_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "col",
    direction: "DESC"
  });
};
function applyInputToInsert(_, $object) {
  return $object;
}
const specFromArgs_Bar = args => {
  const $nodeId = args.getRaw(["input", "id"]);
  return specFromNodeId(nodeIdHandler_Bar, $nodeId);
};
function applyInputToUpdateOrDelete(_, $object) {
  return $object;
}
const specFromArgs_Foo = args => {
  const $nodeId = args.getRaw(["input", "id"]);
  return specFromNodeId(nodeIdHandler_Foo, $nodeId);
};
function getClientMutationIdForCreatePlan($mutation) {
  const $insert = $mutation.getStepForKey("result");
  return $insert.getMeta("clientMutationId");
}
function planCreatePayloadResult($object) {
  return $object.get("result");
}
function queryPlan() {
  return rootValue();
}
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
const CreateBarPayload_barEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(spec_resource_barPgResource, barUniques[0].attributes, $mutation, fieldArgs);
function applyClientMutationIdForCreate(qb, val) {
  qb.setMeta("clientMutationId", val);
}
function applyCreateFields(qb, arg) {
  if (arg != null) {
    return qb.setBuilder();
  }
}
function BarInput_colApply(obj, val, info) {
  obj.set("col", bakedInputRuntime(info.schema, info.field.type, val));
}
const pgRowTypeApplyNodeId = (attributeCount, localAttributes, typeName, record, nodeId) => {
  if (nodeId === undefined) {
    return;
  } else if (nodeId === null) {
    for (const localName of localAttributes) {
      record.set(localName, null);
    }
    return;
  } else if (typeof nodeId !== "string") {
    throw new Error(`Invalid node identifier for '${typeName}'; expected string`);
  } else {
    const identifiers = getIdentifiers_foo(nodeId);
    if (identifiers == null) {
      throw new Error(`Invalid node identifier for '${typeName}': ${JSON.stringify(nodeId)}`);
    }
    for (let i = 0; i < attributeCount; i++) {
      const localName = localAttributes[i];
      record.set(localName, identifiers[i]);
    }
  }
};
const CreateFooPayload_fooEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(spec_resource_fooPgResource, fooUniques[0].attributes, $mutation, fieldArgs);
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
          return connection(spec_resource_barPgResource.find());
        },
        args: {
          first: applyFirstArg,
          last: applyLastArg,
          offset: applyOffsetArg,
          before: applyBeforeArg,
          after: applyAfterArg,
          condition: applyConditionArgToConnection,
          orderBy: applyOrderByArgToConnection
        }
      },
      allFoos: {
        plan() {
          return connection(spec_resource_fooPgResource.find());
        },
        args: {
          first: applyFirstArg,
          last: applyLastArg,
          offset: applyOffsetArg,
          before: applyBeforeArg,
          after: applyAfterArg,
          condition: applyConditionArgToConnection,
          orderBy: applyOrderByArgToConnection
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
          const $insert = pgInsertSingle(spec_resource_barPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createFoo: {
        plan(_, args) {
          const $insert = pgInsertSingle(spec_resource_fooPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      deleteBar: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_barPgResource, specFromArgs_Bar(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteFoo: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_fooPgResource, specFromArgs_Foo(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateBar: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_barPgResource, specFromArgs_Bar(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateFoo: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_fooPgResource, specFromArgs_Foo(args));
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
  Bar: {
    assertStep: assertPgClassSingleStep,
    plans: {
      fooByRowId($record) {
        return spec_resource_fooPgResource.get({
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
      return spec_resource_barPgResource.get(spec);
    }
  },
  BarsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  CreateBarPayload: {
    assertStep: assertStep,
    plans: {
      bar: planCreatePayloadResult,
      barEdge: CreateBarPayload_barEdgePlan,
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan
    }
  },
  CreateFooPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      foo: planCreatePayloadResult,
      fooEdge: CreateFooPayload_fooEdgePlan,
      query: queryPlan
    }
  },
  DeleteBarPayload: {
    assertStep: ObjectStep,
    plans: {
      bar: planCreatePayloadResult,
      barEdge: CreateBarPayload_barEdgePlan,
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedBarId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Bar.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      query: queryPlan
    }
  },
  DeleteFooPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedFooId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Foo.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      foo: planCreatePayloadResult,
      fooEdge: CreateFooPayload_fooEdgePlan,
      query: queryPlan
    }
  },
  Foo: {
    assertStep: assertPgClassSingleStep,
    plans: {
      barByRowId($record) {
        return spec_resource_barPgResource.get({
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
      return spec_resource_fooPgResource.get(spec);
    }
  },
  FoosConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  UpdateBarPayload: {
    assertStep: ObjectStep,
    plans: {
      bar: planCreatePayloadResult,
      barEdge: CreateBarPayload_barEdgePlan,
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan
    }
  },
  UpdateFooPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      foo: planCreatePayloadResult,
      fooEdge: CreateFooPayload_fooEdgePlan,
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
  BarCondition: {
    plans: {
      col: BarCondition_colApply,
      fooByRowId(condition, nodeId) {
        return pgConditionApplyNodeId(1, registryConfig.pgRelations.bar.fooByMyId.localAttributes, "Foo", condition, nodeId);
      }
    }
  },
  BarInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      col: BarInput_colApply,
      fooByRowId(record, nodeId) {
        return pgRowTypeApplyNodeId(1, registryConfig.pgRelations.bar.fooByMyId.localAttributes, "Foo", record, nodeId);
      }
    }
  },
  BarPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      col: BarInput_colApply
    }
  },
  CreateBarInput: {
    plans: {
      bar: applyCreateFields,
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  CreateFooInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      foo: applyCreateFields
    }
  },
  DeleteBarInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteFooInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  FooCondition: {
    plans: {
      col: BarCondition_colApply
    }
  },
  FooInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      col: BarInput_colApply,
      rowId(obj, val, info) {
        obj.set("id", bakedInputRuntime(info.schema, info.field.type, val));
      }
    }
  },
  FooPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      col: BarInput_colApply
    }
  },
  UpdateBarInput: {
    plans: {
      barPatch: applyCreateFields,
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  UpdateFooInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      fooPatch: applyCreateFields
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
  BarsOrderBy: {
    values: {
      COL_ASC: BarsOrderBy_COL_ASCApply,
      COL_DESC: BarsOrderBy_COL_DESCApply,
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
      COL_ASC: BarsOrderBy_COL_ASCApply,
      COL_DESC: BarsOrderBy_COL_DESCApply,
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
