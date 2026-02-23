import { PgDeleteSingleStep, PgExecutor, TYPES, assertPgClassSingleStep, domainOfCodec, enumCodec, listOfCodec, makeRegistry, pgDeleteSingle, pgInsertSingle, pgSelectFromRecord, pgSelectSingleFromRecord, pgUpdateSingle, recordCodec, sqlValueWithCodec } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ObjectStep, __ValueStep, access, assertStep, bakedInputRuntime, connection, constant, context, createObjectAndApplyChildren, first, get as get2, inhibitOnNull, inspect, lambda, list, makeDecodeNodeId, makeGrafastSchema, object, rootValue, specFromNodeId } from "grafast";
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
const alwaysAsIdentityIdentifier = sql.identifier("pg11", "always_as_identity");
const alwaysAsIdentityCodec = recordCodec({
  name: "alwaysAsIdentity",
  identifier: alwaysAsIdentityIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        isInsertable: false,
        isUpdatable: false
      }
    },
    t: {
      codec: TYPES.text
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "pg11",
      name: "always_as_identity"
    }
  },
  executor: executor
});
const byDefaultAsIdentityIdentifier = sql.identifier("pg11", "by_default_as_identity");
const byDefaultAsIdentityCodec = recordCodec({
  name: "byDefaultAsIdentity",
  identifier: byDefaultAsIdentityIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    t: {
      codec: TYPES.text
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "pg11",
      name: "by_default_as_identity"
    }
  },
  executor: executor
});
const networkIdentifier = sql.identifier("pg11", "network");
const networkCodec = recordCodec({
  name: "network",
  identifier: networkIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    inet: {
      codec: TYPES.inet
    },
    cidr: {
      codec: TYPES.cidr
    },
    macaddr: {
      codec: TYPES.macaddr
    },
    macaddr8: {
      codec: TYPES.macaddr8
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "pg11",
      name: "network"
    }
  },
  executor: executor
});
const bigintDomainCodec = domainOfCodec(TYPES.bigint, "bigintDomain", sql.identifier("c", "bigint_domain"), {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "bigint_domain"
    }
  }
});
const bigintDomainArrayCodec = listOfCodec(bigintDomainCodec, {
  name: "bigintDomainArray",
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "_bigint_domain"
    }
  }
});
const bigintDomainArrayDomainCodec = domainOfCodec(bigintDomainArrayCodec, "bigintDomainArrayDomain", sql.identifier("c", "bigint_domain_array_domain"), {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "bigint_domain_array_domain"
    }
  }
});
const colorCodec = enumCodec({
  name: "color",
  identifier: sql.identifier("b", "color"),
  values: ["red", "green", "blue"],
  description: "Represents the colours red, green and blue.",
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "color"
    }
  }
});
const enumCapsCodec = enumCodec({
  name: "enumCaps",
  identifier: sql.identifier("b", "enum_caps"),
  values: ["FOO_BAR", "BAR_FOO", "BAZ_QUX", "0_BAR"],
  description: undefined,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "enum_caps"
    }
  }
});
const enumWithEmptyStringCodec = enumCodec({
  name: "enumWithEmptyString",
  identifier: sql.identifier("b", "enum_with_empty_string"),
  values: ["", "one", "two"],
  description: undefined,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "enum_with_empty_string"
    }
  }
});
const compoundTypeCodec = recordCodec({
  name: "compoundType",
  identifier: sql.identifier("c", "compound_type"),
  attributes: {
    __proto__: null,
    a: {
      codec: TYPES.int
    },
    b: {
      codec: TYPES.text
    },
    c: {
      codec: colorCodec
    },
    d: {
      codec: TYPES.uuid
    },
    e: {
      codec: enumCapsCodec
    },
    f: {
      codec: enumWithEmptyStringCodec
    },
    g: {
      codec: TYPES.interval
    },
    foo_bar: {
      codec: TYPES.int
    }
  },
  extensions: {
    isTableLike: false,
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "compound_type"
    }
  },
  executor: executor,
  description: "Awesome feature!"
});
const domainConstrainedCompoundTypeCodec = domainOfCodec(compoundTypeCodec, "domainConstrainedCompoundType", sql.identifier("pg11", "domain_constrained_compound_type"), {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "pg11",
      name: "domain_constrained_compound_type"
    }
  }
});
const typesIdentifier = sql.identifier("pg11", "types");
const typesCodec = recordCodec({
  name: "types",
  identifier: typesIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    regrole: {
      codec: TYPES.regrole
    },
    regnamespace: {
      codec: TYPES.regnamespace
    },
    bigint_domain_array_domain: {
      codec: bigintDomainArrayDomainCodec
    },
    domain_constrained_compound_type: {
      codec: domainConstrainedCompoundTypeCodec
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "pg11",
      name: "types"
    }
  },
  executor: executor
});
const always_as_identityUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const by_default_as_identityUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const networkUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const typesUniques = [{
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
    alwaysAsIdentity: alwaysAsIdentityCodec,
    int4: TYPES.int,
    text: TYPES.text,
    byDefaultAsIdentity: byDefaultAsIdentityCodec,
    network: networkCodec,
    inet: TYPES.inet,
    cidr: TYPES.cidr,
    macaddr: TYPES.macaddr,
    macaddr8: TYPES.macaddr8,
    varchar: TYPES.varchar,
    bpchar: TYPES.bpchar,
    regrole: TYPES.regrole,
    regnamespace: TYPES.regnamespace,
    bigintDomainArrayDomain: bigintDomainArrayDomainCodec,
    bigintDomain: bigintDomainCodec,
    int8: TYPES.bigint,
    bigintDomainArray: bigintDomainArrayCodec,
    domainConstrainedCompoundType: domainConstrainedCompoundTypeCodec,
    compoundType: compoundTypeCodec,
    color: colorCodec,
    uuid: TYPES.uuid,
    enumCaps: enumCapsCodec,
    enumWithEmptyString: enumWithEmptyStringCodec,
    interval: TYPES.interval,
    types: typesCodec,
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
    always_as_identity: {
      executor: executor,
      name: "always_as_identity",
      identifier: "main.pg11.always_as_identity",
      from: alwaysAsIdentityIdentifier,
      codec: alwaysAsIdentityCodec,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "pg11",
          name: "always_as_identity"
        }
      },
      uniques: always_as_identityUniques
    },
    by_default_as_identity: {
      executor: executor,
      name: "by_default_as_identity",
      identifier: "main.pg11.by_default_as_identity",
      from: byDefaultAsIdentityIdentifier,
      codec: byDefaultAsIdentityCodec,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "pg11",
          name: "by_default_as_identity"
        }
      },
      uniques: by_default_as_identityUniques
    },
    network: {
      executor: executor,
      name: "network",
      identifier: "main.pg11.network",
      from: networkIdentifier,
      codec: networkCodec,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "pg11",
          name: "network"
        }
      },
      uniques: networkUniques
    },
    types: {
      executor: executor,
      name: "types",
      identifier: "main.pg11.types",
      from: typesIdentifier,
      codec: typesCodec,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "pg11",
          name: "types"
        }
      },
      uniques: typesUniques
    }
  },
  pgRelations: {
    __proto__: null
  }
});
const resource_always_as_identityPgResource = registry.pgResources["always_as_identity"];
const resource_by_default_as_identityPgResource = registry.pgResources["by_default_as_identity"];
const resource_networkPgResource = registry.pgResources["network"];
const resource_typesPgResource = registry.pgResources["types"];
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
const nodeIdHandler_AlwaysAsIdentity = makeTableNodeIdHandler({
  typeName: "AlwaysAsIdentity",
  identifier: "always_as_identities",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_always_as_identityPgResource,
  pk: always_as_identityUniques[0].attributes
});
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
const nodeFetcher_AlwaysAsIdentity = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_AlwaysAsIdentity));
  return nodeIdHandler_AlwaysAsIdentity.get(nodeIdHandler_AlwaysAsIdentity.getSpec($decoded));
};
const nodeIdHandler_ByDefaultAsIdentity = makeTableNodeIdHandler({
  typeName: "ByDefaultAsIdentity",
  identifier: "by_default_as_identities",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_by_default_as_identityPgResource,
  pk: by_default_as_identityUniques[0].attributes
});
const nodeFetcher_ByDefaultAsIdentity = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_ByDefaultAsIdentity));
  return nodeIdHandler_ByDefaultAsIdentity.get(nodeIdHandler_ByDefaultAsIdentity.getSpec($decoded));
};
const nodeIdHandler_Network = makeTableNodeIdHandler({
  typeName: "Network",
  identifier: "networks",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_networkPgResource,
  pk: networkUniques[0].attributes
});
const nodeFetcher_Network = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Network));
  return nodeIdHandler_Network.get(nodeIdHandler_Network.getSpec($decoded));
};
const nodeIdHandler_Type = makeTableNodeIdHandler({
  typeName: "Type",
  identifier: "types",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_typesPgResource,
  pk: typesUniques[0].attributes
});
const nodeFetcher_Type = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Type));
  return nodeIdHandler_Type.get(nodeIdHandler_Type.getSpec($decoded));
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
  AlwaysAsIdentity: nodeIdHandler_AlwaysAsIdentity,
  ByDefaultAsIdentity: nodeIdHandler_ByDefaultAsIdentity,
  Network: nodeIdHandler_Network,
  Type: nodeIdHandler_Type
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
const resource_frmcdc_domainConstrainedCompoundTypePgResource = registry.pgResources["frmcdc_domainConstrainedCompoundType"];
const coerce = string => {
  if (!/^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i.test(string)) {
    throw new GraphQLError("Invalid UUID, expected 32 hexadecimal characters, optionally with hyphens");
  }
  return string;
};
const totalCountConnectionPlan = $connection => $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
function applyAttributeCondition(attributeName, attributeCodec, $condition, val) {
  $condition.where({
    type: "attribute",
    attribute: attributeName,
    callback(expression) {
      return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, attributeCodec)}`;
    }
  });
}
const AlwaysAsIdentityCondition_idApply = ($condition, val) => applyAttributeCondition("id", TYPES.int, $condition, val);
const AlwaysAsIdentityCondition_tApply = ($condition, val) => applyAttributeCondition("t", TYPES.text, $condition, val);
const AlwaysAsIdentitiesOrderBy_ID_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "id",
    direction: "ASC"
  });
  queryBuilder.setOrderIsUnique();
};
const AlwaysAsIdentitiesOrderBy_ID_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "id",
    direction: "DESC"
  });
  queryBuilder.setOrderIsUnique();
};
const AlwaysAsIdentitiesOrderBy_T_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "t",
    direction: "ASC"
  });
};
const AlwaysAsIdentitiesOrderBy_T_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "t",
    direction: "DESC"
  });
};
function applyInputToInsert(_, $object) {
  return $object;
}
const specFromArgs_AlwaysAsIdentity = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_AlwaysAsIdentity, $nodeId);
};
function applyInputToUpdateOrDelete(_, $object) {
  return $object;
}
const specFromArgs_ByDefaultAsIdentity = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_ByDefaultAsIdentity, $nodeId);
};
const specFromArgs_Network = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Network, $nodeId);
};
const specFromArgs_Type = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Type, $nodeId);
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
const CreateAlwaysAsIdentityPayload_alwaysAsIdentityEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_always_as_identityPgResource, always_as_identityUniques[0].attributes, $mutation, fieldArgs);
function applyClientMutationIdForCreate(qb, val) {
  qb.setMeta("clientMutationId", val);
}
function applyCreateFields(qb, arg) {
  if (arg != null) {
    return qb.setBuilder();
  }
}
function AlwaysAsIdentityInput_tApply(obj, val, {
  field,
  schema
}) {
  obj.set("t", bakedInputRuntime(schema, field.type, val));
}
const CreateByDefaultAsIdentityPayload_byDefaultAsIdentityEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_by_default_as_identityPgResource, by_default_as_identityUniques[0].attributes, $mutation, fieldArgs);
function ByDefaultAsIdentityInput_idApply(obj, val, {
  field,
  schema
}) {
  obj.set("id", bakedInputRuntime(schema, field.type, val));
}
const CreateNetworkPayload_networkEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_networkPgResource, networkUniques[0].attributes, $mutation, fieldArgs);
function NetworkInput_inetApply(obj, val, {
  field,
  schema
}) {
  obj.set("inet", bakedInputRuntime(schema, field.type, val));
}
function NetworkInput_cidrApply(obj, val, {
  field,
  schema
}) {
  obj.set("cidr", bakedInputRuntime(schema, field.type, val));
}
function NetworkInput_macaddrApply(obj, val, {
  field,
  schema
}) {
  obj.set("macaddr", bakedInputRuntime(schema, field.type, val));
}
function NetworkInput_macaddr8Apply(obj, val, {
  field,
  schema
}) {
  obj.set("macaddr8", bakedInputRuntime(schema, field.type, val));
}
const CreateTypePayload_typeEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_typesPgResource, typesUniques[0].attributes, $mutation, fieldArgs);
function TypeInput_regroleApply(obj, val, {
  field,
  schema
}) {
  obj.set("regrole", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_regnamespaceApply(obj, val, {
  field,
  schema
}) {
  obj.set("regnamespace", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_bigintDomainArrayDomainApply(obj, val, {
  field,
  schema
}) {
  obj.set("bigint_domain_array_domain", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_domainConstrainedCompoundTypeApply(obj, val, {
  field,
  schema
}) {
  obj.set("domain_constrained_compound_type", bakedInputRuntime(schema, field.type, val));
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

  """Get a single \`AlwaysAsIdentity\`."""
  alwaysAsIdentityById(id: Int!): AlwaysAsIdentity

  """Get a single \`ByDefaultAsIdentity\`."""
  byDefaultAsIdentityById(id: Int!): ByDefaultAsIdentity

  """Get a single \`Network\`."""
  networkById(id: Int!): Network

  """Get a single \`Type\`."""
  typeById(id: Int!): Type

  """Reads a single \`AlwaysAsIdentity\` using its globally unique \`ID\`."""
  alwaysAsIdentity(
    """
    The globally unique \`ID\` to be used in selecting a single \`AlwaysAsIdentity\`.
    """
    nodeId: ID!
  ): AlwaysAsIdentity

  """Reads a single \`ByDefaultAsIdentity\` using its globally unique \`ID\`."""
  byDefaultAsIdentity(
    """
    The globally unique \`ID\` to be used in selecting a single \`ByDefaultAsIdentity\`.
    """
    nodeId: ID!
  ): ByDefaultAsIdentity

  """Reads a single \`Network\` using its globally unique \`ID\`."""
  network(
    """The globally unique \`ID\` to be used in selecting a single \`Network\`."""
    nodeId: ID!
  ): Network

  """Reads a single \`Type\` using its globally unique \`ID\`."""
  type(
    """The globally unique \`ID\` to be used in selecting a single \`Type\`."""
    nodeId: ID!
  ): Type

  """Reads and enables pagination through a set of \`AlwaysAsIdentity\`."""
  allAlwaysAsIdentities(
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
    condition: AlwaysAsIdentityCondition

    """The method to use when ordering \`AlwaysAsIdentity\`."""
    orderBy: [AlwaysAsIdentitiesOrderBy!] = [PRIMARY_KEY_ASC]
  ): AlwaysAsIdentitiesConnection

  """Reads and enables pagination through a set of \`ByDefaultAsIdentity\`."""
  allByDefaultAsIdentities(
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
    condition: ByDefaultAsIdentityCondition

    """The method to use when ordering \`ByDefaultAsIdentity\`."""
    orderBy: [ByDefaultAsIdentitiesOrderBy!] = [PRIMARY_KEY_ASC]
  ): ByDefaultAsIdentitiesConnection

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

  """Reads and enables pagination through a set of \`Type\`."""
  allTypes(
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
    condition: TypeCondition

    """The method to use when ordering \`Type\`."""
    orderBy: [TypesOrderBy!] = [PRIMARY_KEY_ASC]
  ): TypesConnection
}

"""An object with a globally unique \`ID\`."""
interface Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
}

type AlwaysAsIdentity implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  t: String
}

type ByDefaultAsIdentity implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  t: String
}

type Network implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  inet: InternetAddress
  cidr: CidrAddress
  macaddr: MacAddress
  macaddr8: MacAddress8
}

"""An IPv4 or IPv6 host address, and optionally its subnet."""
scalar InternetAddress

"""An IPv4 or IPv6 CIDR address."""
scalar CidrAddress

"""A 6-byte MAC address."""
scalar MacAddress

"""An 8-byte MAC address."""
scalar MacAddress8

type Type implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  regrole: RegRole
  regnamespace: RegNamespace
  bigintDomainArrayDomain: [BigintDomain]
  domainConstrainedCompoundType: DomainConstrainedCompoundType
}

"""A builtin object identifier type for a role name"""
scalar RegRole

"""A builtin object identifier type for a namespace name"""
scalar RegNamespace

scalar BigintDomain

type DomainConstrainedCompoundType {
  a: Int
  b: String
  c: Color
  d: UUID
  e: EnumCaps
  f: EnumWithEmptyString
  g: Interval
  fooBar: Int
}

"""Represents the colours red, green and blue."""
enum Color {
  RED
  GREEN
  BLUE
}

"""
A universally unique identifier as defined by [RFC 4122](https://tools.ietf.org/html/rfc4122).
"""
scalar UUID

enum EnumCaps {
  FOO_BAR
  BAR_FOO
  BAZ_QUX
  _0_BAR
}

enum EnumWithEmptyString {
  _EMPTY_
  ONE
  TWO
}

"""
An interval of time that has passed where the smallest distinct unit is a second.
"""
type Interval {
  """
  A quantity of seconds. This is the only non-integer field, as all the other
  fields will dump their overflow into a smaller unit of time. Intervals don’t
  have a smaller unit than seconds.
  """
  seconds: Float

  """A quantity of minutes."""
  minutes: Int

  """A quantity of hours."""
  hours: Int

  """A quantity of days."""
  days: Int

  """A quantity of months."""
  months: Int

  """A quantity of years."""
  years: Int
}

"""A connection to a list of \`AlwaysAsIdentity\` values."""
type AlwaysAsIdentitiesConnection {
  """A list of \`AlwaysAsIdentity\` objects."""
  nodes: [AlwaysAsIdentity]!

  """
  A list of edges which contains the \`AlwaysAsIdentity\` and cursor to aid in pagination.
  """
  edges: [AlwaysAsIdentitiesEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """
  The count of *all* \`AlwaysAsIdentity\` you could get from the connection.
  """
  totalCount: Int!
}

"""A \`AlwaysAsIdentity\` edge in the connection."""
type AlwaysAsIdentitiesEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`AlwaysAsIdentity\` at the end of the edge."""
  node: AlwaysAsIdentity
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
A condition to be used against \`AlwaysAsIdentity\` object types. All fields are
tested for equality and combined with a logical ‘and.’
"""
input AlwaysAsIdentityCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`t\` field."""
  t: String
}

"""Methods to use when ordering \`AlwaysAsIdentity\`."""
enum AlwaysAsIdentitiesOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  T_ASC
  T_DESC
}

"""A connection to a list of \`ByDefaultAsIdentity\` values."""
type ByDefaultAsIdentitiesConnection {
  """A list of \`ByDefaultAsIdentity\` objects."""
  nodes: [ByDefaultAsIdentity]!

  """
  A list of edges which contains the \`ByDefaultAsIdentity\` and cursor to aid in pagination.
  """
  edges: [ByDefaultAsIdentitiesEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """
  The count of *all* \`ByDefaultAsIdentity\` you could get from the connection.
  """
  totalCount: Int!
}

"""A \`ByDefaultAsIdentity\` edge in the connection."""
type ByDefaultAsIdentitiesEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`ByDefaultAsIdentity\` at the end of the edge."""
  node: ByDefaultAsIdentity
}

"""
A condition to be used against \`ByDefaultAsIdentity\` object types. All fields
are tested for equality and combined with a logical ‘and.’
"""
input ByDefaultAsIdentityCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`t\` field."""
  t: String
}

"""Methods to use when ordering \`ByDefaultAsIdentity\`."""
enum ByDefaultAsIdentitiesOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  T_ASC
  T_DESC
}

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

"""
A condition to be used against \`Network\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input NetworkCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`inet\` field."""
  inet: InternetAddress

  """Checks for equality with the object’s \`cidr\` field."""
  cidr: CidrAddress

  """Checks for equality with the object’s \`macaddr\` field."""
  macaddr: MacAddress

  """Checks for equality with the object’s \`macaddr8\` field."""
  macaddr8: MacAddress8
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
  MACADDR8_ASC
  MACADDR8_DESC
}

"""A connection to a list of \`Type\` values."""
type TypesConnection {
  """A list of \`Type\` objects."""
  nodes: [Type]!

  """
  A list of edges which contains the \`Type\` and cursor to aid in pagination.
  """
  edges: [TypesEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Type\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Type\` edge in the connection."""
type TypesEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Type\` at the end of the edge."""
  node: Type
}

"""
A condition to be used against \`Type\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input TypeCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`regrole\` field."""
  regrole: RegRole

  """Checks for equality with the object’s \`regnamespace\` field."""
  regnamespace: RegNamespace

  """Checks for equality with the object’s \`bigintDomainArrayDomain\` field."""
  bigintDomainArrayDomain: [BigintDomain]

  """
  Checks for equality with the object’s \`domainConstrainedCompoundType\` field.
  """
  domainConstrainedCompoundType: DomainConstrainedCompoundTypeInput
}

"""An input for mutations affecting \`DomainConstrainedCompoundType\`"""
input DomainConstrainedCompoundTypeInput {
  a: Int
  b: String
  c: Color
  d: UUID
  e: EnumCaps
  f: EnumWithEmptyString
  g: IntervalInput
  fooBar: Int
}

"""
An interval of time that has passed where the smallest distinct unit is a second.
"""
input IntervalInput {
  """
  A quantity of seconds. This is the only non-integer field, as all the other
  fields will dump their overflow into a smaller unit of time. Intervals don’t
  have a smaller unit than seconds.
  """
  seconds: Float

  """A quantity of minutes."""
  minutes: Int

  """A quantity of hours."""
  hours: Int

  """A quantity of days."""
  days: Int

  """A quantity of months."""
  months: Int

  """A quantity of years."""
  years: Int
}

"""Methods to use when ordering \`Type\`."""
enum TypesOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  REGROLE_ASC
  REGROLE_DESC
  REGNAMESPACE_ASC
  REGNAMESPACE_DESC
  DOMAIN_CONSTRAINED_COMPOUND_TYPE_ASC
  DOMAIN_CONSTRAINED_COMPOUND_TYPE_DESC
}

"""
The root mutation type which contains root level fields which mutate data.
"""
type Mutation {
  """Creates a single \`AlwaysAsIdentity\`."""
  createAlwaysAsIdentity(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateAlwaysAsIdentityInput!
  ): CreateAlwaysAsIdentityPayload

  """Creates a single \`ByDefaultAsIdentity\`."""
  createByDefaultAsIdentity(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateByDefaultAsIdentityInput!
  ): CreateByDefaultAsIdentityPayload

  """Creates a single \`Network\`."""
  createNetwork(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateNetworkInput!
  ): CreateNetworkPayload

  """Creates a single \`Type\`."""
  createType(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateTypeInput!
  ): CreateTypePayload

  """
  Updates a single \`AlwaysAsIdentity\` using its globally unique id and a patch.
  """
  updateAlwaysAsIdentity(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateAlwaysAsIdentityInput!
  ): UpdateAlwaysAsIdentityPayload

  """Updates a single \`AlwaysAsIdentity\` using a unique key and a patch."""
  updateAlwaysAsIdentityById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateAlwaysAsIdentityByIdInput!
  ): UpdateAlwaysAsIdentityPayload

  """
  Updates a single \`ByDefaultAsIdentity\` using its globally unique id and a patch.
  """
  updateByDefaultAsIdentity(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateByDefaultAsIdentityInput!
  ): UpdateByDefaultAsIdentityPayload

  """Updates a single \`ByDefaultAsIdentity\` using a unique key and a patch."""
  updateByDefaultAsIdentityById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateByDefaultAsIdentityByIdInput!
  ): UpdateByDefaultAsIdentityPayload

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

  """Updates a single \`Type\` using its globally unique id and a patch."""
  updateType(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateTypeInput!
  ): UpdateTypePayload

  """Updates a single \`Type\` using a unique key and a patch."""
  updateTypeById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateTypeByIdInput!
  ): UpdateTypePayload

  """Deletes a single \`AlwaysAsIdentity\` using its globally unique id."""
  deleteAlwaysAsIdentity(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteAlwaysAsIdentityInput!
  ): DeleteAlwaysAsIdentityPayload

  """Deletes a single \`AlwaysAsIdentity\` using a unique key."""
  deleteAlwaysAsIdentityById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteAlwaysAsIdentityByIdInput!
  ): DeleteAlwaysAsIdentityPayload

  """Deletes a single \`ByDefaultAsIdentity\` using its globally unique id."""
  deleteByDefaultAsIdentity(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteByDefaultAsIdentityInput!
  ): DeleteByDefaultAsIdentityPayload

  """Deletes a single \`ByDefaultAsIdentity\` using a unique key."""
  deleteByDefaultAsIdentityById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteByDefaultAsIdentityByIdInput!
  ): DeleteByDefaultAsIdentityPayload

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

  """Deletes a single \`Type\` using its globally unique id."""
  deleteType(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteTypeInput!
  ): DeleteTypePayload

  """Deletes a single \`Type\` using a unique key."""
  deleteTypeById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteTypeByIdInput!
  ): DeleteTypePayload
}

"""The output of our create \`AlwaysAsIdentity\` mutation."""
type CreateAlwaysAsIdentityPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`AlwaysAsIdentity\` that was created by this mutation."""
  alwaysAsIdentity: AlwaysAsIdentity

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`AlwaysAsIdentity\`. May be used by Relay 1."""
  alwaysAsIdentityEdge(
    """The method to use when ordering \`AlwaysAsIdentity\`."""
    orderBy: [AlwaysAsIdentitiesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): AlwaysAsIdentitiesEdge
}

"""All input for the create \`AlwaysAsIdentity\` mutation."""
input CreateAlwaysAsIdentityInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`AlwaysAsIdentity\` to be created by this mutation."""
  alwaysAsIdentity: AlwaysAsIdentityInput!
}

"""An input for mutations affecting \`AlwaysAsIdentity\`"""
input AlwaysAsIdentityInput {
  t: String
}

"""The output of our create \`ByDefaultAsIdentity\` mutation."""
type CreateByDefaultAsIdentityPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`ByDefaultAsIdentity\` that was created by this mutation."""
  byDefaultAsIdentity: ByDefaultAsIdentity

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`ByDefaultAsIdentity\`. May be used by Relay 1."""
  byDefaultAsIdentityEdge(
    """The method to use when ordering \`ByDefaultAsIdentity\`."""
    orderBy: [ByDefaultAsIdentitiesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ByDefaultAsIdentitiesEdge
}

"""All input for the create \`ByDefaultAsIdentity\` mutation."""
input CreateByDefaultAsIdentityInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`ByDefaultAsIdentity\` to be created by this mutation."""
  byDefaultAsIdentity: ByDefaultAsIdentityInput!
}

"""An input for mutations affecting \`ByDefaultAsIdentity\`"""
input ByDefaultAsIdentityInput {
  id: Int
  t: String
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
  cidr: CidrAddress
  macaddr: MacAddress
  macaddr8: MacAddress8
}

"""The output of our create \`Type\` mutation."""
type CreateTypePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Type\` that was created by this mutation."""
  type: Type

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Type\`. May be used by Relay 1."""
  typeEdge(
    """The method to use when ordering \`Type\`."""
    orderBy: [TypesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): TypesEdge
}

"""All input for the create \`Type\` mutation."""
input CreateTypeInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`Type\` to be created by this mutation."""
  type: TypeInput!
}

"""An input for mutations affecting \`Type\`"""
input TypeInput {
  id: Int
  regrole: RegRole
  regnamespace: RegNamespace
  bigintDomainArrayDomain: [BigintDomain]
  domainConstrainedCompoundType: DomainConstrainedCompoundTypeInput
}

"""The output of our update \`AlwaysAsIdentity\` mutation."""
type UpdateAlwaysAsIdentityPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`AlwaysAsIdentity\` that was updated by this mutation."""
  alwaysAsIdentity: AlwaysAsIdentity

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`AlwaysAsIdentity\`. May be used by Relay 1."""
  alwaysAsIdentityEdge(
    """The method to use when ordering \`AlwaysAsIdentity\`."""
    orderBy: [AlwaysAsIdentitiesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): AlwaysAsIdentitiesEdge
}

"""All input for the \`updateAlwaysAsIdentity\` mutation."""
input UpdateAlwaysAsIdentityInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`AlwaysAsIdentity\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`AlwaysAsIdentity\` being updated.
  """
  alwaysAsIdentityPatch: AlwaysAsIdentityPatch!
}

"""
Represents an update to a \`AlwaysAsIdentity\`. Fields that are set will be updated.
"""
input AlwaysAsIdentityPatch {
  t: String
}

"""All input for the \`updateAlwaysAsIdentityById\` mutation."""
input UpdateAlwaysAsIdentityByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`AlwaysAsIdentity\` being updated.
  """
  alwaysAsIdentityPatch: AlwaysAsIdentityPatch!
}

"""The output of our update \`ByDefaultAsIdentity\` mutation."""
type UpdateByDefaultAsIdentityPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`ByDefaultAsIdentity\` that was updated by this mutation."""
  byDefaultAsIdentity: ByDefaultAsIdentity

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`ByDefaultAsIdentity\`. May be used by Relay 1."""
  byDefaultAsIdentityEdge(
    """The method to use when ordering \`ByDefaultAsIdentity\`."""
    orderBy: [ByDefaultAsIdentitiesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ByDefaultAsIdentitiesEdge
}

"""All input for the \`updateByDefaultAsIdentity\` mutation."""
input UpdateByDefaultAsIdentityInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`ByDefaultAsIdentity\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`ByDefaultAsIdentity\` being updated.
  """
  byDefaultAsIdentityPatch: ByDefaultAsIdentityPatch!
}

"""
Represents an update to a \`ByDefaultAsIdentity\`. Fields that are set will be updated.
"""
input ByDefaultAsIdentityPatch {
  id: Int
  t: String
}

"""All input for the \`updateByDefaultAsIdentityById\` mutation."""
input UpdateByDefaultAsIdentityByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`ByDefaultAsIdentity\` being updated.
  """
  byDefaultAsIdentityPatch: ByDefaultAsIdentityPatch!
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
  cidr: CidrAddress
  macaddr: MacAddress
  macaddr8: MacAddress8
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

"""The output of our update \`Type\` mutation."""
type UpdateTypePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Type\` that was updated by this mutation."""
  type: Type

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Type\`. May be used by Relay 1."""
  typeEdge(
    """The method to use when ordering \`Type\`."""
    orderBy: [TypesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): TypesEdge
}

"""All input for the \`updateType\` mutation."""
input UpdateTypeInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Type\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`Type\` being updated.
  """
  typePatch: TypePatch!
}

"""Represents an update to a \`Type\`. Fields that are set will be updated."""
input TypePatch {
  id: Int
  regrole: RegRole
  regnamespace: RegNamespace
  bigintDomainArrayDomain: [BigintDomain]
  domainConstrainedCompoundType: DomainConstrainedCompoundTypeInput
}

"""All input for the \`updateTypeById\` mutation."""
input UpdateTypeByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`Type\` being updated.
  """
  typePatch: TypePatch!
}

"""The output of our delete \`AlwaysAsIdentity\` mutation."""
type DeleteAlwaysAsIdentityPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`AlwaysAsIdentity\` that was deleted by this mutation."""
  alwaysAsIdentity: AlwaysAsIdentity
  deletedAlwaysAsIdentityId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`AlwaysAsIdentity\`. May be used by Relay 1."""
  alwaysAsIdentityEdge(
    """The method to use when ordering \`AlwaysAsIdentity\`."""
    orderBy: [AlwaysAsIdentitiesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): AlwaysAsIdentitiesEdge
}

"""All input for the \`deleteAlwaysAsIdentity\` mutation."""
input DeleteAlwaysAsIdentityInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`AlwaysAsIdentity\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteAlwaysAsIdentityById\` mutation."""
input DeleteAlwaysAsIdentityByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!
}

"""The output of our delete \`ByDefaultAsIdentity\` mutation."""
type DeleteByDefaultAsIdentityPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`ByDefaultAsIdentity\` that was deleted by this mutation."""
  byDefaultAsIdentity: ByDefaultAsIdentity
  deletedByDefaultAsIdentityId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`ByDefaultAsIdentity\`. May be used by Relay 1."""
  byDefaultAsIdentityEdge(
    """The method to use when ordering \`ByDefaultAsIdentity\`."""
    orderBy: [ByDefaultAsIdentitiesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ByDefaultAsIdentitiesEdge
}

"""All input for the \`deleteByDefaultAsIdentity\` mutation."""
input DeleteByDefaultAsIdentityInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`ByDefaultAsIdentity\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteByDefaultAsIdentityById\` mutation."""
input DeleteByDefaultAsIdentityByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!
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
}

"""The output of our delete \`Type\` mutation."""
type DeleteTypePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Type\` that was deleted by this mutation."""
  type: Type
  deletedTypeId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Type\`. May be used by Relay 1."""
  typeEdge(
    """The method to use when ordering \`Type\`."""
    orderBy: [TypesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): TypesEdge
}

"""All input for the \`deleteType\` mutation."""
input DeleteTypeInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Type\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteTypeById\` mutation."""
input DeleteTypeByIdInput {
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
      allAlwaysAsIdentities: {
        plan() {
          return connection(resource_always_as_identityPgResource.find());
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
      allByDefaultAsIdentities: {
        plan() {
          return connection(resource_by_default_as_identityPgResource.find());
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
      allNetworks: {
        plan() {
          return connection(resource_networkPgResource.find());
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
      allTypes: {
        plan() {
          return connection(resource_typesPgResource.find());
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
      alwaysAsIdentity(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_AlwaysAsIdentity($nodeId);
      },
      alwaysAsIdentityById(_$root, {
        $id
      }) {
        return resource_always_as_identityPgResource.get({
          id: $id
        });
      },
      byDefaultAsIdentity(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_ByDefaultAsIdentity($nodeId);
      },
      byDefaultAsIdentityById(_$root, {
        $id
      }) {
        return resource_by_default_as_identityPgResource.get({
          id: $id
        });
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
      },
      type(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_Type($nodeId);
      },
      typeById(_$root, {
        $id
      }) {
        return resource_typesPgResource.get({
          id: $id
        });
      }
    }
  },
  Mutation: {
    assertStep: __ValueStep,
    plans: {
      createAlwaysAsIdentity: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_always_as_identityPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createByDefaultAsIdentity: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_by_default_as_identityPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createNetwork: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_networkPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createType: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_typesPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      deleteAlwaysAsIdentity: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_always_as_identityPgResource, specFromArgs_AlwaysAsIdentity(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteAlwaysAsIdentityById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_always_as_identityPgResource, {
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
      deleteByDefaultAsIdentity: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_by_default_as_identityPgResource, specFromArgs_ByDefaultAsIdentity(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteByDefaultAsIdentityById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_by_default_as_identityPgResource, {
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
      deleteNetwork: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_networkPgResource, specFromArgs_Network(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
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
          input: applyInputToUpdateOrDelete
        }
      },
      deleteType: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_typesPgResource, specFromArgs_Type(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteTypeById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_typesPgResource, {
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
      updateAlwaysAsIdentity: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_always_as_identityPgResource, specFromArgs_AlwaysAsIdentity(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateAlwaysAsIdentityById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_always_as_identityPgResource, {
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
      updateByDefaultAsIdentity: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_by_default_as_identityPgResource, specFromArgs_ByDefaultAsIdentity(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateByDefaultAsIdentityById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_by_default_as_identityPgResource, {
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
      updateNetwork: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_networkPgResource, specFromArgs_Network(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
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
          input: applyInputToUpdateOrDelete
        }
      },
      updateType: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_typesPgResource, specFromArgs_Type(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateTypeById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_typesPgResource, {
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
  AlwaysAsIdentitiesConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  AlwaysAsIdentity: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nodeId($parent) {
        const specifier = nodeIdHandler_AlwaysAsIdentity.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_AlwaysAsIdentity.codec.name].encode);
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of always_as_identityUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_always_as_identityPgResource.get(spec);
    }
  },
  ByDefaultAsIdentitiesConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  ByDefaultAsIdentity: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nodeId($parent) {
        const specifier = nodeIdHandler_ByDefaultAsIdentity.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_ByDefaultAsIdentity.codec.name].encode);
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of by_default_as_identityUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_by_default_as_identityPgResource.get(spec);
    }
  },
  CreateAlwaysAsIdentityPayload: {
    assertStep: assertStep,
    plans: {
      alwaysAsIdentity: planCreatePayloadResult,
      alwaysAsIdentityEdge: CreateAlwaysAsIdentityPayload_alwaysAsIdentityEdgePlan,
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan
    }
  },
  CreateByDefaultAsIdentityPayload: {
    assertStep: assertStep,
    plans: {
      byDefaultAsIdentity: planCreatePayloadResult,
      byDefaultAsIdentityEdge: CreateByDefaultAsIdentityPayload_byDefaultAsIdentityEdgePlan,
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan
    }
  },
  CreateNetworkPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      network: planCreatePayloadResult,
      networkEdge: CreateNetworkPayload_networkEdgePlan,
      query: queryPlan
    }
  },
  CreateTypePayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan,
      type: planCreatePayloadResult,
      typeEdge: CreateTypePayload_typeEdgePlan
    }
  },
  DeleteAlwaysAsIdentityPayload: {
    assertStep: ObjectStep,
    plans: {
      alwaysAsIdentity: planUpdateOrDeletePayloadResult,
      alwaysAsIdentityEdge: CreateAlwaysAsIdentityPayload_alwaysAsIdentityEdgePlan,
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedAlwaysAsIdentityId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_AlwaysAsIdentity.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      query: queryPlan
    }
  },
  DeleteByDefaultAsIdentityPayload: {
    assertStep: ObjectStep,
    plans: {
      byDefaultAsIdentity: planUpdateOrDeletePayloadResult,
      byDefaultAsIdentityEdge: CreateByDefaultAsIdentityPayload_byDefaultAsIdentityEdgePlan,
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedByDefaultAsIdentityId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_ByDefaultAsIdentity.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      query: queryPlan
    }
  },
  DeleteNetworkPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedNetworkId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Network.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      network: planUpdateOrDeletePayloadResult,
      networkEdge: CreateNetworkPayload_networkEdgePlan,
      query: queryPlan
    }
  },
  DeleteTypePayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedTypeId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Type.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      query: queryPlan,
      type: planUpdateOrDeletePayloadResult,
      typeEdge: CreateTypePayload_typeEdgePlan
    }
  },
  DomainConstrainedCompoundType: {
    assertStep: assertPgClassSingleStep,
    plans: {
      fooBar($record) {
        return $record.get("foo_bar");
      }
    }
  },
  Interval: {
    assertStep: assertStep
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
      totalCount: totalCountConnectionPlan
    }
  },
  Type: {
    assertStep: assertPgClassSingleStep,
    plans: {
      bigintDomainArrayDomain($record) {
        return $record.get("bigint_domain_array_domain");
      },
      domainConstrainedCompoundType($record) {
        const $plan = $record.get("domain_constrained_compound_type");
        const $select = pgSelectSingleFromRecord(resource_frmcdc_domainConstrainedCompoundTypePgResource, $plan);
        $select.getClassStep().setTrusted();
        return $select;
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_Type.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Type.codec.name].encode);
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of typesUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_typesPgResource.get(spec);
    }
  },
  TypesConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  UpdateAlwaysAsIdentityPayload: {
    assertStep: ObjectStep,
    plans: {
      alwaysAsIdentity: planCreatePayloadResult,
      alwaysAsIdentityEdge: CreateAlwaysAsIdentityPayload_alwaysAsIdentityEdgePlan,
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan
    }
  },
  UpdateByDefaultAsIdentityPayload: {
    assertStep: ObjectStep,
    plans: {
      byDefaultAsIdentity: planUpdateOrDeletePayloadResult,
      byDefaultAsIdentityEdge: CreateByDefaultAsIdentityPayload_byDefaultAsIdentityEdgePlan,
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan
    }
  },
  UpdateNetworkPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      network: planUpdateOrDeletePayloadResult,
      networkEdge: CreateNetworkPayload_networkEdgePlan,
      query: queryPlan
    }
  },
  UpdateTypePayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan,
      type: planUpdateOrDeletePayloadResult,
      typeEdge: CreateTypePayload_typeEdgePlan
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
  AlwaysAsIdentityCondition: {
    plans: {
      id: AlwaysAsIdentityCondition_idApply,
      t: AlwaysAsIdentityCondition_tApply
    }
  },
  AlwaysAsIdentityInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      t: AlwaysAsIdentityInput_tApply
    }
  },
  AlwaysAsIdentityPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      t: AlwaysAsIdentityInput_tApply
    }
  },
  ByDefaultAsIdentityCondition: {
    plans: {
      id: AlwaysAsIdentityCondition_idApply,
      t: AlwaysAsIdentityCondition_tApply
    }
  },
  ByDefaultAsIdentityInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      id: ByDefaultAsIdentityInput_idApply,
      t: AlwaysAsIdentityInput_tApply
    }
  },
  ByDefaultAsIdentityPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      id: ByDefaultAsIdentityInput_idApply,
      t: AlwaysAsIdentityInput_tApply
    }
  },
  CreateAlwaysAsIdentityInput: {
    plans: {
      alwaysAsIdentity: applyCreateFields,
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  CreateByDefaultAsIdentityInput: {
    plans: {
      byDefaultAsIdentity: applyCreateFields,
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  CreateNetworkInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      network: applyCreateFields
    }
  },
  CreateTypeInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      type: applyCreateFields
    }
  },
  DeleteAlwaysAsIdentityByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteAlwaysAsIdentityInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteByDefaultAsIdentityByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteByDefaultAsIdentityInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteNetworkByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteNetworkInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteTypeByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteTypeInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DomainConstrainedCompoundTypeInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      a(obj, val, {
        field,
        schema
      }) {
        obj.set("a", bakedInputRuntime(schema, field.type, val));
      },
      b(obj, val, {
        field,
        schema
      }) {
        obj.set("b", bakedInputRuntime(schema, field.type, val));
      },
      c(obj, val, {
        field,
        schema
      }) {
        obj.set("c", bakedInputRuntime(schema, field.type, val));
      },
      d(obj, val, {
        field,
        schema
      }) {
        obj.set("d", bakedInputRuntime(schema, field.type, val));
      },
      e(obj, val, {
        field,
        schema
      }) {
        obj.set("e", bakedInputRuntime(schema, field.type, val));
      },
      f(obj, val, {
        field,
        schema
      }) {
        obj.set("f", bakedInputRuntime(schema, field.type, val));
      },
      fooBar(obj, val, {
        field,
        schema
      }) {
        obj.set("foo_bar", bakedInputRuntime(schema, field.type, val));
      },
      g(obj, val, {
        field,
        schema
      }) {
        obj.set("g", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  NetworkCondition: {
    plans: {
      cidr($condition, val) {
        return applyAttributeCondition("cidr", TYPES.cidr, $condition, val);
      },
      id: AlwaysAsIdentityCondition_idApply,
      inet($condition, val) {
        return applyAttributeCondition("inet", TYPES.inet, $condition, val);
      },
      macaddr($condition, val) {
        return applyAttributeCondition("macaddr", TYPES.macaddr, $condition, val);
      },
      macaddr8($condition, val) {
        return applyAttributeCondition("macaddr8", TYPES.macaddr8, $condition, val);
      }
    }
  },
  NetworkInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      cidr: NetworkInput_cidrApply,
      id: ByDefaultAsIdentityInput_idApply,
      inet: NetworkInput_inetApply,
      macaddr: NetworkInput_macaddrApply,
      macaddr8: NetworkInput_macaddr8Apply
    }
  },
  NetworkPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      cidr: NetworkInput_cidrApply,
      id: ByDefaultAsIdentityInput_idApply,
      inet: NetworkInput_inetApply,
      macaddr: NetworkInput_macaddrApply,
      macaddr8: NetworkInput_macaddr8Apply
    }
  },
  TypeCondition: {
    plans: {
      bigintDomainArrayDomain($condition, val) {
        return applyAttributeCondition("bigint_domain_array_domain", bigintDomainArrayDomainCodec, $condition, val);
      },
      domainConstrainedCompoundType($condition, val) {
        return applyAttributeCondition("domain_constrained_compound_type", domainConstrainedCompoundTypeCodec, $condition, val);
      },
      id: AlwaysAsIdentityCondition_idApply,
      regnamespace($condition, val) {
        return applyAttributeCondition("regnamespace", TYPES.regnamespace, $condition, val);
      },
      regrole($condition, val) {
        return applyAttributeCondition("regrole", TYPES.regrole, $condition, val);
      }
    }
  },
  TypeInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      bigintDomainArrayDomain: TypeInput_bigintDomainArrayDomainApply,
      domainConstrainedCompoundType: TypeInput_domainConstrainedCompoundTypeApply,
      id: ByDefaultAsIdentityInput_idApply,
      regnamespace: TypeInput_regnamespaceApply,
      regrole: TypeInput_regroleApply
    }
  },
  TypePatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      bigintDomainArrayDomain: TypeInput_bigintDomainArrayDomainApply,
      domainConstrainedCompoundType: TypeInput_domainConstrainedCompoundTypeApply,
      id: ByDefaultAsIdentityInput_idApply,
      regnamespace: TypeInput_regnamespaceApply,
      regrole: TypeInput_regroleApply
    }
  },
  UpdateAlwaysAsIdentityByIdInput: {
    plans: {
      alwaysAsIdentityPatch: applyPatchFields,
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  UpdateAlwaysAsIdentityInput: {
    plans: {
      alwaysAsIdentityPatch: applyCreateFields,
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  UpdateByDefaultAsIdentityByIdInput: {
    plans: {
      byDefaultAsIdentityPatch: applyPatchFields,
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  UpdateByDefaultAsIdentityInput: {
    plans: {
      byDefaultAsIdentityPatch: applyPatchFields,
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  UpdateNetworkByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      networkPatch: applyPatchFields
    }
  },
  UpdateNetworkInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      networkPatch: applyPatchFields
    }
  },
  UpdateTypeByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      typePatch: applyPatchFields
    }
  },
  UpdateTypeInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      typePatch: applyPatchFields
    }
  }
};
export const scalars = {
  BigintDomain: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`BigInt can only parse string values (kind='${ast.kind}')`);
    }
  },
  CidrAddress: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`CidrAddress can only parse string values (kind='${ast.kind}')`);
    }
  },
  Cursor: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`Cursor can only parse string values (kind='${ast.kind}')`);
    }
  },
  InternetAddress: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`InternetAddress can only parse string values (kind='${ast.kind}')`);
    }
  },
  MacAddress: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`MacAddress can only parse string values (kind='${ast.kind}')`);
    }
  },
  MacAddress8: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`MacAddress8 can only parse string values (kind='${ast.kind}')`);
    }
  },
  RegNamespace: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`RegNamespace can only parse string values (kind='${ast.kind}')`);
    }
  },
  RegRole: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`RegRole can only parse string values (kind='${ast.kind}')`);
    }
  },
  UUID: {
    serialize: toString,
    parseValue(value) {
      return coerce("" + value);
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return coerce(ast.value);
      }
      throw new GraphQLError(`UUID can only parse string values (kind = '${ast.kind}')`);
    }
  }
};
export const enums = {
  AlwaysAsIdentitiesOrderBy: {
    values: {
      ID_ASC: AlwaysAsIdentitiesOrderBy_ID_ASCApply,
      ID_DESC: AlwaysAsIdentitiesOrderBy_ID_DESCApply,
      PRIMARY_KEY_ASC(queryBuilder) {
        always_as_identityUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        always_as_identityUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      T_ASC: AlwaysAsIdentitiesOrderBy_T_ASCApply,
      T_DESC: AlwaysAsIdentitiesOrderBy_T_DESCApply
    }
  },
  ByDefaultAsIdentitiesOrderBy: {
    values: {
      ID_ASC: AlwaysAsIdentitiesOrderBy_ID_ASCApply,
      ID_DESC: AlwaysAsIdentitiesOrderBy_ID_DESCApply,
      PRIMARY_KEY_ASC(queryBuilder) {
        by_default_as_identityUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        by_default_as_identityUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      T_ASC: AlwaysAsIdentitiesOrderBy_T_ASCApply,
      T_DESC: AlwaysAsIdentitiesOrderBy_T_DESCApply
    }
  },
  Color: {
    values: {
      BLUE: {
        value: "blue"
      },
      GREEN: {
        value: "green"
      },
      RED: {
        value: "red"
      }
    }
  },
  EnumCaps: {
    values: {
      _0_BAR: {
        value: "0_BAR"
      }
    }
  },
  EnumWithEmptyString: {
    values: {
      _EMPTY_: {
        value: ""
      },
      ONE: {
        value: "one"
      },
      TWO: {
        value: "two"
      }
    }
  },
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
      ID_ASC: AlwaysAsIdentitiesOrderBy_ID_ASCApply,
      ID_DESC: AlwaysAsIdentitiesOrderBy_ID_DESCApply,
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
      MACADDR8_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "macaddr8",
          direction: "ASC"
        });
      },
      MACADDR8_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "macaddr8",
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
  },
  TypesOrderBy: {
    values: {
      DOMAIN_CONSTRAINED_COMPOUND_TYPE_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "domain_constrained_compound_type",
          direction: "ASC"
        });
      },
      DOMAIN_CONSTRAINED_COMPOUND_TYPE_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "domain_constrained_compound_type",
          direction: "DESC"
        });
      },
      ID_ASC: AlwaysAsIdentitiesOrderBy_ID_ASCApply,
      ID_DESC: AlwaysAsIdentitiesOrderBy_ID_DESCApply,
      PRIMARY_KEY_ASC(queryBuilder) {
        typesUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        typesUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      REGNAMESPACE_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "regnamespace",
          direction: "ASC"
        });
      },
      REGNAMESPACE_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "regnamespace",
          direction: "DESC"
        });
      },
      REGROLE_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "regrole",
          direction: "ASC"
        });
      },
      REGROLE_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "regrole",
          direction: "DESC"
        });
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
