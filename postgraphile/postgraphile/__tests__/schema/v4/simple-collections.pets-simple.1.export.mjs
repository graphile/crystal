import { PgDeleteSingleStep, PgExecutor, PgResource, PgSelectSingleStep, TYPES, assertPgClassSingleStep, enumCodec, makeRegistry, pgDeleteSingle, pgInsertSingle, pgSelectFromRecord, pgSelectSingleFromRecord, pgUpdateSingle, recordCodec, sqlFromArgDigests, sqlValueWithCodec } from "@dataplan/pg";
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
const peopleIdentifier = sql.identifier("simple_collections", "people");
const peopleCodec = recordCodec({
  name: "people",
  identifier: peopleIdentifier,
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
      schemaName: "simple_collections",
      name: "people"
    }
  },
  executor: executor
});
const petsIdentifier = sql.identifier("simple_collections", "pets");
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
    owner_id: {
      codec: TYPES.int,
      notNull: true
    },
    name: {
      codec: TYPES.text
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "simple_collections",
      name: "pets"
    }
  },
  executor: executor
});
const peopleUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const people_resourceOptionsConfig = {
  executor: executor,
  name: "people",
  identifier: "main.simple_collections.people",
  from: peopleIdentifier,
  codec: peopleCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "simple_collections",
      name: "people"
    }
  },
  uniques: peopleUniques
};
const petsUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const pets_resourceOptionsConfig = {
  executor: executor,
  name: "pets",
  identifier: "main.simple_collections.pets",
  from: petsIdentifier,
  codec: petsCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "simple_collections",
      name: "pets"
    }
  },
  uniques: petsUniques
};
const people_odd_petsFunctionIdentifer = sql.identifier("simple_collections", "people_odd_pets");
const registry = makeRegistry({
  pgExecutors: {
    __proto__: null,
    main: executor
  },
  pgCodecs: {
    __proto__: null,
    people: peopleCodec,
    int4: TYPES.int,
    text: TYPES.text,
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
    people: people_resourceOptionsConfig,
    pets: pets_resourceOptionsConfig,
    people_odd_pets: PgResource.functionResourceOptions(pets_resourceOptionsConfig, {
      name: "people_odd_pets",
      identifier: "main.simple_collections.people_odd_pets(simple_collections.people)",
      from(...args) {
        return sql`${people_odd_petsFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "p",
        codec: peopleCodec,
        required: true
      }],
      returnsSetof: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "simple_collections",
          name: "people_odd_pets"
        }
      },
      hasImplicitOrder: true
    })
  },
  pgRelations: {
    __proto__: null,
    people: {
      __proto__: null,
      petsByTheirOwnerId: {
        localCodec: peopleCodec,
        remoteResourceOptions: pets_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["owner_id"],
        isReferencee: true,
        extensions: {
          tags: {
            simpleCollections: "only",
            behavior: ["+list -connection"]
          }
        }
      }
    },
    pets: {
      __proto__: null,
      peopleByMyOwnerId: {
        localCodec: petsCodec,
        remoteResourceOptions: people_resourceOptionsConfig,
        localAttributes: ["owner_id"],
        remoteAttributes: ["id"],
        isUnique: true,
        extensions: {
          tags: {
            simpleCollections: "only",
            behavior: ["+list -connection"]
          }
        }
      }
    }
  }
});
const resource_peoplePgResource = registry.pgResources["people"];
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
const nodeIdHandler_Person = makeTableNodeIdHandler({
  typeName: "Person",
  identifier: "people",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_peoplePgResource,
  pk: peopleUniques[0].attributes
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
const nodeFetcher_Person = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Person));
  return nodeIdHandler_Person.get(nodeIdHandler_Person.getSpec($decoded));
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
  Person: nodeIdHandler_Person,
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
const EMPTY_ARRAY = [];
const makeArgs_people_odd_pets = () => EMPTY_ARRAY;
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
const resource_people_odd_petsPgResource = registry.pgResources["people_odd_pets"];
const people_odd_pets_getSelectPlanFromParentAndArgs = ($in, args, _info) => {
  const details = pgFunctionArgumentsFromArgs($in, makeArgs_people_odd_pets(args));
  return resource_people_odd_petsPgResource.execute(details.selectArgs);
};
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
const PetCondition_idApply = ($condition, val) => applyAttributeCondition("id", TYPES.int, $condition, val);
const PetCondition_nameApply = ($condition, val) => applyAttributeCondition("name", TYPES.text, $condition, val);
const PetsOrderBy_ID_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "id",
    direction: "ASC"
  });
  queryBuilder.setOrderIsUnique();
};
const PetsOrderBy_ID_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "id",
    direction: "DESC"
  });
  queryBuilder.setOrderIsUnique();
};
const PetsOrderBy_NAME_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "name",
    direction: "ASC"
  });
};
const PetsOrderBy_NAME_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "name",
    direction: "DESC"
  });
};
function applyInputToInsert(_, $object) {
  return $object;
}
const specFromArgs_Person = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Person, $nodeId);
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
const CreatePersonPayload_personEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_peoplePgResource, peopleUniques[0].attributes, $mutation, fieldArgs);
function applyClientMutationIdForCreate(qb, val) {
  qb.setMeta("clientMutationId", val);
}
function applyCreateFields(qb, arg) {
  if (arg != null) {
    return qb.setBuilder();
  }
}
function PersonInput_idApply(obj, val, info) {
  obj.set("id", bakedInputRuntime(info.schema, info.field.type, val));
}
function PersonInput_nameApply(obj, val, info) {
  obj.set("name", bakedInputRuntime(info.schema, info.field.type, val));
}
const CreatePetPayload_petEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_petsPgResource, petsUniques[0].attributes, $mutation, fieldArgs);
const CreatePetPayload_personByOwnerIdPlan = $record => resource_peoplePgResource.get({
  id: $record.get("result").get("owner_id")
});
function PetInput_ownerIdApply(obj, val, info) {
  obj.set("owner_id", bakedInputRuntime(info.schema, info.field.type, val));
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

  """Get a single \`Person\`."""
  personById(id: Int!): Person

  """Get a single \`Pet\`."""
  petById(id: Int!): Pet

  """Reads a single \`Person\` using its globally unique \`ID\`."""
  person(
    """The globally unique \`ID\` to be used in selecting a single \`Person\`."""
    nodeId: ID!
  ): Person

  """Reads a single \`Pet\` using its globally unique \`ID\`."""
  pet(
    """The globally unique \`ID\` to be used in selecting a single \`Pet\`."""
    nodeId: ID!
  ): Pet

  """Reads and enables pagination through a set of \`Person\`."""
  allPeople(
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
    condition: PersonCondition

    """The method to use when ordering \`Person\`."""
    orderBy: [PeopleOrderBy!] = [PRIMARY_KEY_ASC]
  ): PeopleConnection

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

type Person implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!

  """Reads and enables pagination through a set of \`Pet\`."""
  oddPets(
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
  ): PetsConnection!
  id: Int!
  name: String

  """Reads and enables pagination through a set of \`Pet\`."""
  petsByOwnerIdList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: PetCondition

    """The method to use when ordering \`Pet\`."""
    orderBy: [PetsOrderBy!]
  ): [Pet!]!
}

"""A connection to a list of \`Pet\` values."""
type PetsConnection {
  """A list of \`Pet\` objects."""
  nodes: [Pet!]!

  """
  A list of edges which contains the \`Pet\` and cursor to aid in pagination.
  """
  edges: [PetsEdge!]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Pet\` you could get from the connection."""
  totalCount: Int!
}

type Pet implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  ownerId: Int!
  name: String

  """Reads a single \`Person\` that is related to this \`Pet\`."""
  personByOwnerId: Person
}

"""A \`Pet\` edge in the connection."""
type PetsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Pet\` at the end of the edge."""
  node: Pet!
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
A condition to be used against \`Pet\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input PetCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`ownerId\` field."""
  ownerId: Int

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
  OWNER_ID_ASC
  OWNER_ID_DESC
  NAME_ASC
  NAME_DESC
}

"""A connection to a list of \`Person\` values."""
type PeopleConnection {
  """A list of \`Person\` objects."""
  nodes: [Person!]!

  """
  A list of edges which contains the \`Person\` and cursor to aid in pagination.
  """
  edges: [PeopleEdge!]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Person\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Person\` edge in the connection."""
type PeopleEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Person\` at the end of the edge."""
  node: Person!
}

"""
A condition to be used against \`Person\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input PersonCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`name\` field."""
  name: String
}

"""Methods to use when ordering \`Person\`."""
enum PeopleOrderBy {
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
  """Creates a single \`Person\`."""
  createPerson(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreatePersonInput!
  ): CreatePersonPayload

  """Creates a single \`Pet\`."""
  createPet(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreatePetInput!
  ): CreatePetPayload

  """Updates a single \`Person\` using its globally unique id and a patch."""
  updatePerson(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdatePersonInput!
  ): UpdatePersonPayload

  """Updates a single \`Person\` using a unique key and a patch."""
  updatePersonById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdatePersonByIdInput!
  ): UpdatePersonPayload

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

  """Deletes a single \`Person\` using its globally unique id."""
  deletePerson(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeletePersonInput!
  ): DeletePersonPayload

  """Deletes a single \`Person\` using a unique key."""
  deletePersonById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeletePersonByIdInput!
  ): DeletePersonPayload

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

"""The output of our create \`Person\` mutation."""
type CreatePersonPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Person\` that was created by this mutation."""
  person: Person

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Person\`. May be used by Relay 1."""
  personEdge(
    """The method to use when ordering \`Person\`."""
    orderBy: [PeopleOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PeopleEdge
}

"""All input for the create \`Person\` mutation."""
input CreatePersonInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`Person\` to be created by this mutation."""
  person: PersonInput!
}

"""An input for mutations affecting \`Person\`"""
input PersonInput {
  id: Int
  name: String
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

  """Reads a single \`Person\` that is related to this \`Pet\`."""
  personByOwnerId: Person
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
  ownerId: Int!
  name: String
}

"""The output of our update \`Person\` mutation."""
type UpdatePersonPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Person\` that was updated by this mutation."""
  person: Person

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Person\`. May be used by Relay 1."""
  personEdge(
    """The method to use when ordering \`Person\`."""
    orderBy: [PeopleOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PeopleEdge
}

"""All input for the \`updatePerson\` mutation."""
input UpdatePersonInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Person\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`Person\` being updated.
  """
  personPatch: PersonPatch!
}

"""
Represents an update to a \`Person\`. Fields that are set will be updated.
"""
input PersonPatch {
  id: Int
  name: String
}

"""All input for the \`updatePersonById\` mutation."""
input UpdatePersonByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`Person\` being updated.
  """
  personPatch: PersonPatch!
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

  """Reads a single \`Person\` that is related to this \`Pet\`."""
  personByOwnerId: Person
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
  ownerId: Int
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

"""The output of our delete \`Person\` mutation."""
type DeletePersonPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Person\` that was deleted by this mutation."""
  person: Person
  deletedPersonId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Person\`. May be used by Relay 1."""
  personEdge(
    """The method to use when ordering \`Person\`."""
    orderBy: [PeopleOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PeopleEdge
}

"""All input for the \`deletePerson\` mutation."""
input DeletePersonInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Person\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deletePersonById\` mutation."""
input DeletePersonByIdInput {
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

  """Reads a single \`Person\` that is related to this \`Pet\`."""
  personByOwnerId: Person
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
      allPeople: {
        plan() {
          return connection(resource_peoplePgResource.find());
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
      node(_$root, fieldArgs) {
        return fieldArgs.getRaw("nodeId");
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_Query.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Query.codec.name].encode);
      },
      person(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_Person($nodeId);
      },
      personById(_$root, {
        $id
      }) {
        return resource_peoplePgResource.get({
          id: $id
        });
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
      createPerson: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_peoplePgResource);
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
      deletePerson: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_peoplePgResource, specFromArgs_Person(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deletePersonById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_peoplePgResource, {
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
      updatePerson: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_peoplePgResource, specFromArgs_Person(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updatePersonById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_peoplePgResource, {
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
  CreatePersonPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      person: planCreatePayloadResult,
      personEdge: CreatePersonPayload_personEdgePlan,
      query: queryPlan
    }
  },
  CreatePetPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      personByOwnerId: CreatePetPayload_personByOwnerIdPlan,
      pet: planCreatePayloadResult,
      petEdge: CreatePetPayload_petEdgePlan,
      query: queryPlan
    }
  },
  DeletePersonPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedPersonId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Person.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      person: planCreatePayloadResult,
      personEdge: CreatePersonPayload_personEdgePlan,
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
      personByOwnerId: CreatePetPayload_personByOwnerIdPlan,
      pet: planCreatePayloadResult,
      petEdge: CreatePetPayload_petEdgePlan,
      query: queryPlan
    }
  },
  PeopleConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  Person: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nodeId($parent) {
        const specifier = nodeIdHandler_Person.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Person.codec.name].encode);
      },
      oddPets: {
        plan($parent, args, info) {
          const $select = people_odd_pets_getSelectPlanFromParentAndArgs($parent, args, info);
          return connection($select);
        },
        args: {
          first: applyFirstArg,
          last: applyLastArg,
          offset: applyOffsetArg,
          before: applyBeforeArg,
          after: applyAfterArg
        }
      },
      petsByOwnerIdList: {
        plan($record) {
          return resource_petsPgResource.find({
            owner_id: $record.get("id")
          });
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg,
          condition(_condition, $select, arg) {
            arg.apply($select, qbWhereBuilder);
          },
          orderBy(parent, $select, value) {
            value.apply($select);
          }
        }
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of peopleUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_peoplePgResource.get(spec);
    }
  },
  Pet: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nodeId($parent) {
        const specifier = nodeIdHandler_Pet.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Pet.codec.name].encode);
      },
      ownerId($record) {
        return $record.get("owner_id");
      },
      personByOwnerId($record) {
        return resource_peoplePgResource.get({
          id: $record.get("owner_id")
        });
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
  UpdatePersonPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      person: planCreatePayloadResult,
      personEdge: CreatePersonPayload_personEdgePlan,
      query: queryPlan
    }
  },
  UpdatePetPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      personByOwnerId: CreatePetPayload_personByOwnerIdPlan,
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
  CreatePersonInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      person: applyCreateFields
    }
  },
  CreatePetInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      pet: applyCreateFields
    }
  },
  DeletePersonByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeletePersonInput: {
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
  PersonCondition: {
    plans: {
      id: PetCondition_idApply,
      name: PetCondition_nameApply
    }
  },
  PersonInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      id: PersonInput_idApply,
      name: PersonInput_nameApply
    }
  },
  PersonPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      id: PersonInput_idApply,
      name: PersonInput_nameApply
    }
  },
  PetCondition: {
    plans: {
      id: PetCondition_idApply,
      name: PetCondition_nameApply,
      ownerId($condition, val) {
        return applyAttributeCondition("owner_id", TYPES.int, $condition, val);
      }
    }
  },
  PetInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      id: PersonInput_idApply,
      name: PersonInput_nameApply,
      ownerId: PetInput_ownerIdApply
    }
  },
  PetPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      id: PersonInput_idApply,
      name: PersonInput_nameApply,
      ownerId: PetInput_ownerIdApply
    }
  },
  UpdatePersonByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      personPatch: applyCreateFields
    }
  },
  UpdatePersonInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      personPatch: applyCreateFields
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
  PeopleOrderBy: {
    values: {
      ID_ASC: PetsOrderBy_ID_ASCApply,
      ID_DESC: PetsOrderBy_ID_DESCApply,
      NAME_ASC: PetsOrderBy_NAME_ASCApply,
      NAME_DESC: PetsOrderBy_NAME_DESCApply,
      PRIMARY_KEY_ASC(queryBuilder) {
        peopleUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        peopleUniques[0].attributes.forEach(attributeName => {
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
      ID_ASC: PetsOrderBy_ID_ASCApply,
      ID_DESC: PetsOrderBy_ID_DESCApply,
      NAME_ASC: PetsOrderBy_NAME_ASCApply,
      NAME_DESC: PetsOrderBy_NAME_DESCApply,
      OWNER_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "owner_id",
          direction: "ASC"
        });
      },
      OWNER_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "owner_id",
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
