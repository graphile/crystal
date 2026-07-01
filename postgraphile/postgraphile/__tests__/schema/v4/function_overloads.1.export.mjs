import { PgDeleteSingleStep, PgExecutor, PgSelectSingleStep, TYPES, assertPgClassSingleStep, enumCodec, makeRegistry, pgClassExpression, pgDeleteSingle, pgFromExpression, pgInsertSingle, pgSelectFromRecord, pgSelectSingleFromRecord, pgUpdateSingle, recordCodec, sqlFromArgDigests, sqlValueWithCodec } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ObjectStep, __ValueStep, access, assertStep, bakedInputRuntime, connection, constant, context, createObjectAndApplyChildren, first, get as get2, inhibitOnNull, inspect, lambda, list, makeDecodeNodeId, makeGrafastSchema, markSyncAndSafe, object, rootValue, specFromNodeId, stepAMayDependOnStepB } from "grafast";
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
const buildingsIdentifier = sql.identifier("function_overloads", "buildings");
const buildingsCodec = recordCodec({
  name: "buildings",
  identifier: buildingsIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    address: {
      codec: TYPES.text
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "function_overloads",
      name: "buildings"
    }
  },
  executor: executor
});
const petsIdentifier = sql.identifier("function_overloads", "pets");
const petsCodec = recordCodec({
  name: "pets",
  identifier: petsIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    name: {
      codec: TYPES.text
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "function_overloads",
      name: "pets"
    }
  },
  executor: executor
});
const codeFunctionIdentifer = sql.identifier("function_overloads", "code");
const key3 = (...args) => sql`${codeFunctionIdentifer}(${sqlFromArgDigests(args)})`;
const ageFunctionIdentifer = sql.identifier("function_overloads_other_schema", "age");
const key32 = (...args) => sql`${ageFunctionIdentifer}(${sqlFromArgDigests(args)})`;
const buildingsUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const petsUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const registry = makeRegistry({
  pgExecutors: {
    __proto__: null,
    main: executor
  },
  pgCodecs: {
    __proto__: null,
    text: TYPES.text,
    int4: TYPES.int,
    buildings: buildingsCodec,
    pets: petsCodec,
    varchar: TYPES.varchar,
    bpchar: TYPES.bpchar,
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
    buildings_code: {
      executor: executor,
      name: "buildings_code",
      identifier: "main.function_overloads.code(function_overloads.buildings)",
      from: key3,
      parameters: [{
        name: null,
        codec: buildingsCodec
      }],
      codec: TYPES.text,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "function_overloads",
          name: "code"
        },
        tags: {
          behavior: "+typeField -queryField"
        }
      },
      isUnique: true
    },
    buildings_age: {
      executor: executor,
      name: "buildings_age",
      identifier: "main.function_overloads_other_schema.age(function_overloads.buildings)",
      from: key32,
      parameters: [{
        name: null,
        codec: buildingsCodec
      }],
      codec: TYPES.int,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "function_overloads_other_schema",
          name: "age"
        },
        tags: {
          behavior: "+typeField -queryField"
        }
      },
      isUnique: true
    },
    pets_code: {
      executor: executor,
      name: "pets_code",
      identifier: "main.function_overloads.code(function_overloads.pets)",
      from: key3,
      parameters: [{
        name: null,
        codec: petsCodec
      }],
      codec: TYPES.text,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "function_overloads",
          name: "code"
        },
        tags: {
          behavior: "+typeField -queryField"
        }
      },
      isUnique: true
    },
    pets_age: {
      executor: executor,
      name: "pets_age",
      identifier: "main.function_overloads_other_schema.age(function_overloads.pets)",
      from: key32,
      parameters: [{
        name: null,
        codec: petsCodec
      }],
      codec: TYPES.int,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "function_overloads_other_schema",
          name: "age"
        },
        tags: {
          behavior: "+typeField -queryField"
        }
      },
      isUnique: true
    },
    buildings: {
      executor: executor,
      name: "buildings",
      identifier: "main.function_overloads.buildings",
      from: buildingsIdentifier,
      codec: buildingsCodec,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "function_overloads",
          name: "buildings"
        }
      },
      uniques: buildingsUniques
    },
    pets: {
      executor: executor,
      name: "pets",
      identifier: "main.function_overloads.pets",
      from: petsIdentifier,
      codec: petsCodec,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "function_overloads",
          name: "pets"
        }
      },
      uniques: petsUniques
    }
  },
  pgRelations: {
    __proto__: null
  }
});
const resource_buildingsPgResource = registry.pgResources["buildings"];
const resource_petsPgResource = registry.pgResources["pets"];
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
const nodeIdHandler_Building = makeTableNodeIdHandler({
  typeName: "Building",
  identifier: "buildings",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_buildingsPgResource,
  pk: buildingsUniques[0].attributes
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
const nodeFetcher_Building = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Building));
  return nodeIdHandler_Building.get(nodeIdHandler_Building.getSpec($decoded));
};
const nodeIdHandler_Pet = makeTableNodeIdHandler({
  typeName: "Pet",
  identifier: "pets",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_petsPgResource,
  pk: petsUniques[0].attributes
});
const nodeFetcher_Pet = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Pet));
  return nodeIdHandler_Pet.get(nodeIdHandler_Pet.getSpec($decoded));
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
  Building: nodeIdHandler_Building,
  Pet: nodeIdHandler_Pet
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
const EMPTY_ARRAY = Object.freeze([]);
const makeArgs_buildings_code = () => EMPTY_ARRAY;
const resource_buildings_codePgResource = registry.pgResources["buildings_code"];
function hasRecord($row) {
  return "record" in $row && typeof $row.record === "function";
}
const pgFunctionArgumentsFromArgs = (() => {
  function pgFunctionArgumentsFromArgs($in, extraSelectArgs, inlining = false) {
    if (!hasRecord($in)) {
      throw new Error(`Invalid plan, exepcted 'PgSelectSingleStep', 'PgInsertSingleStep', 'PgUpdateSingleStep' or 'PgDeleteSingleStep', but found ${$in}`);
    }
    /**
     * An optimisation - if all our dependencies are
     * compatible with the expression's class plan then we
     * can inline ourselves into that, otherwise we must
     * issue the query separately.
     */
    const canUseExpressionDirectly = $in instanceof PgSelectSingleStep && $in.getClassStep().mode !== "mutation" && extraSelectArgs.every(a => stepAMayDependOnStepB($in.getClassStep(), a.step));
    const $row = canUseExpressionDirectly ? $in : pgSelectSingleFromRecord($in.resource, $in.record());
    const selectArgs = [{
      step: $row.record()
    }, ...extraSelectArgs];
    if (inlining) {
      // This is a scalar computed attribute, let's inline the expression
      const newSelectArgs = selectArgs.map((arg, i) => {
        if (i === 0) {
          const {
            step,
            ...rest
          } = arg;
          return {
            ...rest,
            placeholder: $row.getClassStep().alias
          };
        } else {
          return arg;
        }
      });
      return {
        $row,
        selectArgs: newSelectArgs
      };
    } else {
      return {
        $row,
        selectArgs: selectArgs
      };
    }
  }
  return pgFunctionArgumentsFromArgs;
})();
const scalarComputed = (resource, $in, args) => {
  const {
    $row,
    selectArgs
  } = pgFunctionArgumentsFromArgs($in, args, true);
  const from = pgFromExpression($row, resource.from, resource.parameters, selectArgs);
  return pgClassExpression($row, resource.codec, undefined)`${from}`;
};
const resource_buildings_agePgResource = registry.pgResources["buildings_age"];
const resource_pets_codePgResource = registry.pgResources["pets_code"];
const resource_pets_agePgResource = registry.pgResources["pets_age"];
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
const BuildingCondition_idApply = ($condition, val) => applyAttributeCondition("id", TYPES.int, $condition, val);
const BuildingsOrderBy_ID_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "id",
    direction: "ASC"
  });
  queryBuilder.setOrderIsUnique();
};
const BuildingsOrderBy_ID_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "id",
    direction: "DESC"
  });
  queryBuilder.setOrderIsUnique();
};
function applyInputToInsert(_, $object) {
  return $object;
}
const specFromArgs_Building = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Building, $nodeId);
};
function applyInputToUpdateOrDelete(_, $object) {
  return $object;
}
const specFromArgs_Pet = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Pet, $nodeId);
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
const CreateBuildingPayload_buildingEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_buildingsPgResource, buildingsUniques[0].attributes, $mutation, fieldArgs);
function applyClientMutationIdForCreate(qb, val) {
  qb.setMeta("clientMutationId", val);
}
function applyCreateFields(qb, arg) {
  if (arg != null) {
    return qb.setBuilder();
  }
}
function BuildingInput_idApply(obj, val, info) {
  obj.set("id", bakedInputRuntime(info.schema, info.field.type, val));
}
function BuildingInput_addressApply(obj, val, info) {
  obj.set("address", bakedInputRuntime(info.schema, info.field.type, val));
}
const CreatePetPayload_petEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_petsPgResource, petsUniques[0].attributes, $mutation, fieldArgs);
function PetInput_nameApply(obj, val, info) {
  obj.set("name", bakedInputRuntime(info.schema, info.field.type, val));
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
  nodeId: ID!

  """Fetches an object given its globally unique \`ID\`."""
  node(
    """The globally unique \`ID\`."""
    nodeId: ID!
  ): Node

  """Get a single \`Building\`."""
  buildingById(id: Int!): Building

  """Get a single \`Pet\`."""
  petById(id: Int!): Pet

  """Reads a single \`Building\` using its globally unique \`ID\`."""
  building(
    """The globally unique \`ID\` to be used in selecting a single \`Building\`."""
    nodeId: ID!
  ): Building

  """Reads a single \`Pet\` using its globally unique \`ID\`."""
  pet(
    """The globally unique \`ID\` to be used in selecting a single \`Pet\`."""
    nodeId: ID!
  ): Pet

  """Reads and enables pagination through a set of \`Building\`."""
  allBuildings(
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
    condition: BuildingCondition

    """The method to use when ordering \`Building\`."""
    orderBy: [BuildingsOrderBy!] = [PRIMARY_KEY_ASC]
  ): BuildingsConnection

  """Reads and enables pagination through a set of \`Pet\`."""
  allPets(
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
    condition: PetCondition

    """The method to use when ordering \`Pet\`."""
    orderBy: [PetsOrderBy!] = [PRIMARY_KEY_ASC]
  ): PetsConnection
}

"""An object with a globally unique \`ID\`."""
interface Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
}

type Building implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  code: String
  age: Int
  id: Int!
  address: String
}

type Pet implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  code: String
  age: Int
  id: Int!
  name: String
}

"""A connection to a list of \`Building\` values."""
type BuildingsConnection {
  """A list of \`Building\` objects."""
  nodes: [Building]!

  """
  A list of edges which contains the \`Building\` and cursor to aid in pagination.
  """
  edges: [BuildingsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Building\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Building\` edge in the connection."""
type BuildingsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Building\` at the end of the edge."""
  node: Building
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
A condition to be used against \`Building\` object types. All fields are tested
for equality and combined with a logical ‘and.’
"""
input BuildingCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`address\` field."""
  address: String
}

"""Methods to use when ordering \`Building\`."""
enum BuildingsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  ADDRESS_ASC
  ADDRESS_DESC
}

"""A connection to a list of \`Pet\` values."""
type PetsConnection {
  """A list of \`Pet\` objects."""
  nodes: [Pet]!

  """
  A list of edges which contains the \`Pet\` and cursor to aid in pagination.
  """
  edges: [PetsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Pet\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Pet\` edge in the connection."""
type PetsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Pet\` at the end of the edge."""
  node: Pet
}

"""
A condition to be used against \`Pet\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input PetCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`name\` field."""
  name: String
}

"""Methods to use when ordering \`Pet\`."""
enum PetsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  NAME_ASC
  NAME_DESC
}

"""
The root mutation type which contains root level fields which mutate data.
"""
type Mutation {
  """Creates a single \`Building\`."""
  createBuilding(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateBuildingInput!
  ): CreateBuildingPayload

  """Creates a single \`Pet\`."""
  createPet(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreatePetInput!
  ): CreatePetPayload

  """Updates a single \`Building\` using its globally unique id and a patch."""
  updateBuilding(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateBuildingInput!
  ): UpdateBuildingPayload

  """Updates a single \`Building\` using a unique key and a patch."""
  updateBuildingById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateBuildingByIdInput!
  ): UpdateBuildingPayload

  """Updates a single \`Pet\` using its globally unique id and a patch."""
  updatePet(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdatePetInput!
  ): UpdatePetPayload

  """Updates a single \`Pet\` using a unique key and a patch."""
  updatePetById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdatePetByIdInput!
  ): UpdatePetPayload

  """Deletes a single \`Building\` using its globally unique id."""
  deleteBuilding(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteBuildingInput!
  ): DeleteBuildingPayload

  """Deletes a single \`Building\` using a unique key."""
  deleteBuildingById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteBuildingByIdInput!
  ): DeleteBuildingPayload

  """Deletes a single \`Pet\` using its globally unique id."""
  deletePet(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeletePetInput!
  ): DeletePetPayload

  """Deletes a single \`Pet\` using a unique key."""
  deletePetById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeletePetByIdInput!
  ): DeletePetPayload
}

"""The output of our create \`Building\` mutation."""
type CreateBuildingPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Building\` that was created by this mutation."""
  building: Building

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Building\`. May be used by Relay 1."""
  buildingEdge(
    """The method to use when ordering \`Building\`."""
    orderBy: [BuildingsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): BuildingsEdge
}

"""All input for the create \`Building\` mutation."""
input CreateBuildingInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`Building\` to be created by this mutation."""
  building: BuildingInput!
}

"""An input for mutations affecting \`Building\`"""
input BuildingInput {
  id: Int
  address: String
}

"""The output of our create \`Pet\` mutation."""
type CreatePetPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Pet\` that was created by this mutation."""
  pet: Pet

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Pet\`. May be used by Relay 1."""
  petEdge(
    """The method to use when ordering \`Pet\`."""
    orderBy: [PetsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PetsEdge
}

"""All input for the create \`Pet\` mutation."""
input CreatePetInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`Pet\` to be created by this mutation."""
  pet: PetInput!
}

"""An input for mutations affecting \`Pet\`"""
input PetInput {
  id: Int
  name: String
}

"""The output of our update \`Building\` mutation."""
type UpdateBuildingPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Building\` that was updated by this mutation."""
  building: Building

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Building\`. May be used by Relay 1."""
  buildingEdge(
    """The method to use when ordering \`Building\`."""
    orderBy: [BuildingsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): BuildingsEdge
}

"""All input for the \`updateBuilding\` mutation."""
input UpdateBuildingInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Building\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`Building\` being updated.
  """
  buildingPatch: BuildingPatch!
}

"""
Represents an update to a \`Building\`. Fields that are set will be updated.
"""
input BuildingPatch {
  id: Int
  address: String
}

"""All input for the \`updateBuildingById\` mutation."""
input UpdateBuildingByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`Building\` being updated.
  """
  buildingPatch: BuildingPatch!
}

"""The output of our update \`Pet\` mutation."""
type UpdatePetPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Pet\` that was updated by this mutation."""
  pet: Pet

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Pet\`. May be used by Relay 1."""
  petEdge(
    """The method to use when ordering \`Pet\`."""
    orderBy: [PetsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PetsEdge
}

"""All input for the \`updatePet\` mutation."""
input UpdatePetInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Pet\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`Pet\` being updated.
  """
  petPatch: PetPatch!
}

"""Represents an update to a \`Pet\`. Fields that are set will be updated."""
input PetPatch {
  id: Int
  name: String
}

"""All input for the \`updatePetById\` mutation."""
input UpdatePetByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`Pet\` being updated.
  """
  petPatch: PetPatch!
}

"""The output of our delete \`Building\` mutation."""
type DeleteBuildingPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Building\` that was deleted by this mutation."""
  building: Building
  deletedBuildingId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Building\`. May be used by Relay 1."""
  buildingEdge(
    """The method to use when ordering \`Building\`."""
    orderBy: [BuildingsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): BuildingsEdge
}

"""All input for the \`deleteBuilding\` mutation."""
input DeleteBuildingInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Building\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteBuildingById\` mutation."""
input DeleteBuildingByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!
}

"""The output of our delete \`Pet\` mutation."""
type DeletePetPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Pet\` that was deleted by this mutation."""
  pet: Pet
  deletedPetId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Pet\`. May be used by Relay 1."""
  petEdge(
    """The method to use when ordering \`Pet\`."""
    orderBy: [PetsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PetsEdge
}

"""All input for the \`deletePet\` mutation."""
input DeletePetInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Pet\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deletePetById\` mutation."""
input DeletePetByIdInput {
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
      allBuildings: {
        plan() {
          return connection(resource_buildingsPgResource.find());
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
      allPets: {
        plan() {
          return connection(resource_petsPgResource.find());
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
      building(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_Building($nodeId);
      },
      buildingById(_$root, {
        $id
      }) {
        return resource_buildingsPgResource.get({
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
      pet(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_Pet($nodeId);
      },
      petById(_$root, {
        $id
      }) {
        return resource_petsPgResource.get({
          id: $id
        });
      },
      query() {
        return rootValue();
      }
    }
  },
  Mutation: {
    assertStep: __ValueStep,
    plans: {
      createBuilding: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_buildingsPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createPet: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_petsPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      deleteBuilding: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_buildingsPgResource, specFromArgs_Building(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteBuildingById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_buildingsPgResource, {
            id: args.getRaw(['input', "id"])
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
      deletePet: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_petsPgResource, specFromArgs_Pet(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deletePetById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_petsPgResource, {
            id: args.getRaw(['input', "id"])
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
      updateBuilding: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_buildingsPgResource, specFromArgs_Building(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateBuildingById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_buildingsPgResource, {
            id: args.getRaw(['input', "id"])
          });
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updatePet: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_petsPgResource, specFromArgs_Pet(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updatePetById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_petsPgResource, {
            id: args.getRaw(['input', "id"])
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
  Building: {
    assertStep: assertPgClassSingleStep,
    plans: {
      age($in, args, _info) {
        return scalarComputed(resource_buildings_agePgResource, $in, makeArgs_buildings_code(args));
      },
      code($in, args, _info) {
        return scalarComputed(resource_buildings_codePgResource, $in, makeArgs_buildings_code(args));
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_Building.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Building.codec.name].encode);
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of buildingsUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_buildingsPgResource.get(spec);
    }
  },
  BuildingsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  CreateBuildingPayload: {
    assertStep: assertStep,
    plans: {
      building: planCreatePayloadResult,
      buildingEdge: CreateBuildingPayload_buildingEdgePlan,
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan
    }
  },
  CreatePetPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      pet: planCreatePayloadResult,
      petEdge: CreatePetPayload_petEdgePlan,
      query: queryPlan
    }
  },
  DeleteBuildingPayload: {
    assertStep: ObjectStep,
    plans: {
      building: planCreatePayloadResult,
      buildingEdge: CreateBuildingPayload_buildingEdgePlan,
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedBuildingId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Building.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      query: queryPlan
    }
  },
  DeletePetPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedPetId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Pet.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      pet: planCreatePayloadResult,
      petEdge: CreatePetPayload_petEdgePlan,
      query: queryPlan
    }
  },
  Pet: {
    assertStep: assertPgClassSingleStep,
    plans: {
      age($in, args, _info) {
        return scalarComputed(resource_pets_agePgResource, $in, makeArgs_buildings_code(args));
      },
      code($in, args, _info) {
        return scalarComputed(resource_pets_codePgResource, $in, makeArgs_buildings_code(args));
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_Pet.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Pet.codec.name].encode);
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of petsUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_petsPgResource.get(spec);
    }
  },
  PetsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  UpdateBuildingPayload: {
    assertStep: ObjectStep,
    plans: {
      building: planCreatePayloadResult,
      buildingEdge: CreateBuildingPayload_buildingEdgePlan,
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan
    }
  },
  UpdatePetPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      pet: planCreatePayloadResult,
      petEdge: CreatePetPayload_petEdgePlan,
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
  BuildingCondition: {
    plans: {
      address($condition, val) {
        return applyAttributeCondition("address", TYPES.text, $condition, val);
      },
      id: BuildingCondition_idApply
    }
  },
  BuildingInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      address: BuildingInput_addressApply,
      id: BuildingInput_idApply
    }
  },
  BuildingPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      address: BuildingInput_addressApply,
      id: BuildingInput_idApply
    }
  },
  CreateBuildingInput: {
    plans: {
      building: applyCreateFields,
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  CreatePetInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      pet: applyCreateFields
    }
  },
  DeleteBuildingByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteBuildingInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeletePetByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeletePetInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  PetCondition: {
    plans: {
      id: BuildingCondition_idApply,
      name($condition, val) {
        return applyAttributeCondition("name", TYPES.text, $condition, val);
      }
    }
  },
  PetInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      id: BuildingInput_idApply,
      name: PetInput_nameApply
    }
  },
  PetPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      id: BuildingInput_idApply,
      name: PetInput_nameApply
    }
  },
  UpdateBuildingByIdInput: {
    plans: {
      buildingPatch: applyCreateFields,
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  UpdateBuildingInput: {
    plans: {
      buildingPatch: applyCreateFields,
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  UpdatePetByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      petPatch: applyCreateFields
    }
  },
  UpdatePetInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      petPatch: applyCreateFields
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
  BuildingsOrderBy: {
    values: {
      ADDRESS_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "address",
          direction: "ASC"
        });
      },
      ADDRESS_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "address",
          direction: "DESC"
        });
      },
      ID_ASC: BuildingsOrderBy_ID_ASCApply,
      ID_DESC: BuildingsOrderBy_ID_DESCApply,
      PRIMARY_KEY_ASC(queryBuilder) {
        buildingsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        buildingsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      }
    }
  },
  PetsOrderBy: {
    values: {
      ID_ASC: BuildingsOrderBy_ID_ASCApply,
      ID_DESC: BuildingsOrderBy_ID_DESCApply,
      NAME_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "name",
          direction: "ASC"
        });
      },
      NAME_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "name",
          direction: "DESC"
        });
      },
      PRIMARY_KEY_ASC(queryBuilder) {
        petsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        petsUniques[0].attributes.forEach(attributeName => {
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
