import { PgDeleteSingleStep, PgExecutor, PgSelectStep, PgUnionAllStep, TYPES, assertPgClassSingleStep, domainOfCodec, enumCodec, listOfCodec, makeRegistry, pgDeleteSingle, pgInsertSingle, pgSelectFromRecord, pgSelectSingleFromRecord, pgUpdateSingle, recordCodec } from "@dataplan/pg";
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
const attributes = Object.assign(Object.create(null), {
  id: {
    description: undefined,
    codec: TYPES.int,
    notNull: true,
    hasDefault: true,
    extensions: {
      tags: {
        behavior: ["-attribute:insert -attribute:update"]
      }
    }
  },
  t: {
    description: undefined,
    codec: TYPES.text,
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
const spec_alwaysAsIdentity = {
  name: "alwaysAsIdentity",
  identifier: sql.identifier(...["pg11", "always_as_identity"]),
  attributes,
  description: undefined,
  extensions: {
    oid: "1469481",
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "pg11",
      name: "always_as_identity"
    },
    tags: Object.create(null)
  },
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_alwaysAsIdentity_alwaysAsIdentity = recordCodec(spec_alwaysAsIdentity);
const attributes2 = Object.assign(Object.create(null), {
  id: {
    description: undefined,
    codec: TYPES.int,
    notNull: true,
    hasDefault: true,
    extensions: {
      tags: {}
    }
  },
  t: {
    description: undefined,
    codec: TYPES.text,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  }
});
const extensions2 = {
  oid: "1469489",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "pg11",
    name: "by_default_as_identity"
  },
  tags: Object.create(null)
};
const parts2 = ["pg11", "by_default_as_identity"];
const sqlIdent2 = sql.identifier(...parts2);
const spec_byDefaultAsIdentity = {
  name: "byDefaultAsIdentity",
  identifier: sqlIdent2,
  attributes: attributes2,
  description: undefined,
  extensions: extensions2,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_byDefaultAsIdentity_byDefaultAsIdentity = recordCodec(spec_byDefaultAsIdentity);
const attributes3 = Object.assign(Object.create(null), {
  id: {
    description: undefined,
    codec: TYPES.int,
    notNull: true,
    hasDefault: true,
    extensions: {
      tags: {}
    }
  },
  inet: {
    description: undefined,
    codec: TYPES.inet,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  },
  cidr: {
    description: undefined,
    codec: TYPES.cidr,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  },
  macaddr: {
    description: undefined,
    codec: TYPES.macaddr,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  },
  macaddr8: {
    description: undefined,
    codec: TYPES.macaddr8,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  }
});
const extensions3 = {
  oid: "1469497",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "pg11",
    name: "network"
  },
  tags: Object.create(null)
};
const parts3 = ["pg11", "network"];
const sqlIdent3 = sql.identifier(...parts3);
const spec_network = {
  name: "network",
  identifier: sqlIdent3,
  attributes: attributes3,
  description: undefined,
  extensions: extensions3,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_network_network = recordCodec(spec_network);
const extensions4 = {
  oid: "1469506",
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "bigint_domain_array_domain"
  },
  tags: Object.create(null)
};
const extensions5 = {
  oid: "1469503",
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "_bigint_domain"
  },
  tags: Object.create(null)
};
const extensions6 = {
  oid: "1469504",
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "bigint_domain"
  },
  tags: Object.create(null)
};
const parts4 = ["c", "bigint_domain"];
const sqlIdent4 = sql.identifier(...parts4);
const innerCodec_bigintDomain = domainOfCodec(TYPES.bigint, "bigintDomain", sqlIdent4, {
  description: undefined,
  extensions: extensions6,
  notNull: false
});
const innerCodec_bigintDomainArray = listOfCodec(innerCodec_bigintDomain, {
  extensions: extensions5,
  typeDelim: ",",
  description: undefined,
  name: "bigintDomainArray"
});
const parts5 = ["c", "bigint_domain_array_domain"];
const sqlIdent5 = sql.identifier(...parts5);
const registryConfig_pgCodecs_bigintDomainArrayDomain_bigintDomainArrayDomain = domainOfCodec(innerCodec_bigintDomainArray, "bigintDomainArrayDomain", sqlIdent5, {
  description: undefined,
  extensions: extensions4,
  notNull: false
});
const extensions7 = {
  oid: "1469508",
  pg: {
    serviceName: "main",
    schemaName: "pg11",
    name: "domain_constrained_compound_type"
  },
  tags: Object.create(null)
};
const extensions8 = {
  oid: "1467980",
  pg: {
    serviceName: "main",
    schemaName: "b",
    name: "color"
  },
  tags: Object.create(null)
};
const parts6 = ["b", "color"];
const sqlIdent6 = sql.identifier(...parts6);
const attributes_c_codec_color = enumCodec({
  name: "color",
  identifier: sqlIdent6,
  values: ["red", "green", "blue"],
  description: undefined,
  extensions: extensions8
});
const enumLabels2 = ["FOO_BAR", "BAR_FOO", "BAZ_QUX", "0_BAR"];
const extensions9 = {
  oid: "1467988",
  pg: {
    serviceName: "main",
    schemaName: "b",
    name: "enum_caps"
  },
  tags: Object.create(null)
};
const parts7 = ["b", "enum_caps"];
const sqlIdent7 = sql.identifier(...parts7);
const attributes_e_codec_enumCaps = enumCodec({
  name: "enumCaps",
  identifier: sqlIdent7,
  values: enumLabels2,
  description: undefined,
  extensions: extensions9
});
const enumLabels3 = ["", "one", "two"];
const extensions10 = {
  oid: "1467998",
  pg: {
    serviceName: "main",
    schemaName: "b",
    name: "enum_with_empty_string"
  },
  tags: Object.create(null)
};
const parts8 = ["b", "enum_with_empty_string"];
const sqlIdent8 = sql.identifier(...parts8);
const attributes_f_codec_enumWithEmptyString = enumCodec({
  name: "enumWithEmptyString",
  identifier: sqlIdent8,
  values: enumLabels3,
  description: undefined,
  extensions: extensions10
});
const attributes4 = Object.assign(Object.create(null), {
  a: {
    description: undefined,
    codec: TYPES.int,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  },
  b: {
    description: undefined,
    codec: TYPES.text,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  },
  c: {
    description: undefined,
    codec: attributes_c_codec_color,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  },
  d: {
    description: undefined,
    codec: TYPES.uuid,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  },
  e: {
    description: undefined,
    codec: attributes_e_codec_enumCaps,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  },
  f: {
    description: undefined,
    codec: attributes_f_codec_enumWithEmptyString,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  },
  g: {
    description: undefined,
    codec: TYPES.interval,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  },
  foo_bar: {
    description: undefined,
    codec: TYPES.int,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  }
});
const extensions11 = {
  oid: "1468007",
  isTableLike: false,
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "compound_type"
  },
  tags: Object.create(null)
};
const parts9 = ["c", "compound_type"];
const sqlIdent9 = sql.identifier(...parts9);
const spec_compoundType = {
  name: "compoundType",
  identifier: sqlIdent9,
  attributes: attributes4,
  description: "Awesome feature!",
  extensions: extensions11,
  executor: executor_mainPgExecutor
};
const innerCodec_compoundType = recordCodec(spec_compoundType);
const parts10 = ["pg11", "domain_constrained_compound_type"];
const sqlIdent10 = sql.identifier(...parts10);
const registryConfig_pgCodecs_domainConstrainedCompoundType_domainConstrainedCompoundType = domainOfCodec(innerCodec_compoundType, "domainConstrainedCompoundType", sqlIdent10, {
  description: undefined,
  extensions: extensions7,
  notNull: false
});
const attributes5 = Object.assign(Object.create(null), {
  id: {
    description: undefined,
    codec: TYPES.int,
    notNull: true,
    hasDefault: true,
    extensions: {
      tags: {}
    }
  },
  regrole: {
    description: undefined,
    codec: TYPES.regrole,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  },
  regnamespace: {
    description: undefined,
    codec: TYPES.regnamespace,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  },
  bigint_domain_array_domain: {
    description: undefined,
    codec: registryConfig_pgCodecs_bigintDomainArrayDomain_bigintDomainArrayDomain,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  },
  domain_constrained_compound_type: {
    description: undefined,
    codec: registryConfig_pgCodecs_domainConstrainedCompoundType_domainConstrainedCompoundType,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  }
});
const extensions12 = {
  oid: "1469513",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "pg11",
    name: "types"
  },
  tags: Object.create(null)
};
const parts11 = ["pg11", "types"];
const sqlIdent11 = sql.identifier(...parts11);
const spec_types = {
  name: "types",
  identifier: sqlIdent11,
  attributes: attributes5,
  description: undefined,
  extensions: extensions12,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_types_types = recordCodec(spec_types);
const extensions13 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "pg11",
    name: "always_as_identity"
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
const extensions14 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "pg11",
    name: "by_default_as_identity"
  },
  tags: {}
};
const uniques2 = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const extensions15 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "pg11",
    name: "network"
  },
  tags: {}
};
const uniques3 = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const extensions16 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "pg11",
    name: "types"
  },
  tags: {}
};
const uniques4 = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registry = makeRegistry({
  pgCodecs: Object.assign(Object.create(null), {
    alwaysAsIdentity: registryConfig_pgCodecs_alwaysAsIdentity_alwaysAsIdentity,
    int4: TYPES.int,
    text: TYPES.text,
    byDefaultAsIdentity: registryConfig_pgCodecs_byDefaultAsIdentity_byDefaultAsIdentity,
    network: registryConfig_pgCodecs_network_network,
    inet: TYPES.inet,
    cidr: TYPES.cidr,
    macaddr: TYPES.macaddr,
    macaddr8: TYPES.macaddr8,
    varchar: TYPES.varchar,
    bpchar: TYPES.bpchar,
    regrole: TYPES.regrole,
    regnamespace: TYPES.regnamespace,
    bigintDomainArrayDomain: registryConfig_pgCodecs_bigintDomainArrayDomain_bigintDomainArrayDomain,
    bigintDomain: innerCodec_bigintDomain,
    int8: TYPES.bigint,
    bigintDomainArray: innerCodec_bigintDomainArray,
    domainConstrainedCompoundType: registryConfig_pgCodecs_domainConstrainedCompoundType_domainConstrainedCompoundType,
    compoundType: innerCodec_compoundType,
    color: attributes_c_codec_color,
    uuid: TYPES.uuid,
    enumCaps: attributes_e_codec_enumCaps,
    enumWithEmptyString: attributes_f_codec_enumWithEmptyString,
    interval: TYPES.interval,
    types: registryConfig_pgCodecs_types_types
  }),
  pgResources: Object.assign(Object.create(null), {
    always_as_identity: {
      executor: executor_mainPgExecutor,
      name: "always_as_identity",
      identifier: "main.pg11.always_as_identity",
      from: registryConfig_pgCodecs_alwaysAsIdentity_alwaysAsIdentity.sqlType,
      codec: registryConfig_pgCodecs_alwaysAsIdentity_alwaysAsIdentity,
      uniques,
      isVirtual: false,
      description: undefined,
      extensions: extensions13
    },
    by_default_as_identity: {
      executor: executor_mainPgExecutor,
      name: "by_default_as_identity",
      identifier: "main.pg11.by_default_as_identity",
      from: registryConfig_pgCodecs_byDefaultAsIdentity_byDefaultAsIdentity.sqlType,
      codec: registryConfig_pgCodecs_byDefaultAsIdentity_byDefaultAsIdentity,
      uniques: uniques2,
      isVirtual: false,
      description: undefined,
      extensions: extensions14
    },
    network: {
      executor: executor_mainPgExecutor,
      name: "network",
      identifier: "main.pg11.network",
      from: registryConfig_pgCodecs_network_network.sqlType,
      codec: registryConfig_pgCodecs_network_network,
      uniques: uniques3,
      isVirtual: false,
      description: undefined,
      extensions: extensions15
    },
    types: {
      executor: executor_mainPgExecutor,
      name: "types",
      identifier: "main.pg11.types",
      from: registryConfig_pgCodecs_types_types.sqlType,
      codec: registryConfig_pgCodecs_types_types,
      uniques: uniques4,
      isVirtual: false,
      description: undefined,
      extensions: extensions16
    }
  }),
  pgRelations: Object.create(null)
});
const pgResource_always_as_identityPgResource = registry.pgResources["always_as_identity"];
const pgResource_by_default_as_identityPgResource = registry.pgResources["by_default_as_identity"];
const pgResource_networkPgResource = registry.pgResources["network"];
const pgResource_typesPgResource = registry.pgResources["types"];
const nodeIdHandlerByTypeName = Object.assign(Object.create(null), {
  Query: handler,
  AlwaysAsIdentity: {
    typeName: "AlwaysAsIdentity",
    codec: nodeIdCodecs_base64JSON_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("always_as_identities", false), $record.get("id")]);
    },
    getSpec($list) {
      return {
        id: access($list, [1])
      };
    },
    get(spec) {
      return pgResource_always_as_identityPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "always_as_identities";
    }
  },
  ByDefaultAsIdentity: {
    typeName: "ByDefaultAsIdentity",
    codec: nodeIdCodecs_base64JSON_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("by_default_as_identities", false), $record.get("id")]);
    },
    getSpec($list) {
      return {
        id: access($list, [1])
      };
    },
    get(spec) {
      return pgResource_by_default_as_identityPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "by_default_as_identities";
    }
  },
  Network: {
    typeName: "Network",
    codec: nodeIdCodecs_base64JSON_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("networks", false), $record.get("id")]);
    },
    getSpec($list) {
      return {
        id: access($list, [1])
      };
    },
    get(spec) {
      return pgResource_networkPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "networks";
    }
  },
  Type: {
    typeName: "Type",
    codec: nodeIdCodecs_base64JSON_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("types", false), $record.get("id")]);
    },
    getSpec($list) {
      return {
        id: access($list, [1])
      };
    },
    get(spec) {
      return pgResource_typesPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "types";
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
})(nodeIdHandlerByTypeName.AlwaysAsIdentity);
const fetcher2 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName.ByDefaultAsIdentity);
const fetcher3 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName.Network);
const fetcher4 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName.Type);
function Query_allAlwaysAsIdentities_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allAlwaysAsIdentities_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Query_allAlwaysAsIdentities_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allAlwaysAsIdentities_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Query_allAlwaysAsIdentities_after_applyPlan(_, $connection, val) {
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
function Query_allByDefaultAsIdentities_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allByDefaultAsIdentities_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Query_allByDefaultAsIdentities_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allByDefaultAsIdentities_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Query_allByDefaultAsIdentities_after_applyPlan(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
function Query_allNetworks_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allNetworks_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Query_allNetworks_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allNetworks_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Query_allNetworks_after_applyPlan(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
function Query_allTypes_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allTypes_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Query_allTypes_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allTypes_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Query_allTypes_after_applyPlan(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
const resource_frmcdc_domainConstrainedCompoundTypePgResource = registry.pgResources["frmcdc_domainConstrainedCompoundType"];
function Interval_secondsPlan($r) {
  return access($r, ["seconds"]);
}
function Interval_minutesPlan($r) {
  return access($r, ["minutes"]);
}
function Interval_hoursPlan($r) {
  return access($r, ["hours"]);
}
function Interval_daysPlan($r) {
  return access($r, ["days"]);
}
function Interval_monthsPlan($r) {
  return access($r, ["months"]);
}
function Interval_yearsPlan($r) {
  return access($r, ["years"]);
}
function AlwaysAsIdentitiesConnection_nodesPlan($connection) {
  return $connection.nodes();
}
function AlwaysAsIdentitiesConnection_edgesPlan($connection) {
  return $connection.edges();
}
function AlwaysAsIdentitiesConnection_pageInfoPlan($connection) {
  // TYPES: why is this a TypeScript issue without the 'any'?
  return $connection.pageInfo();
}
function PageInfo_hasNextPagePlan($pageInfo) {
  return $pageInfo.hasNextPage();
}
function PageInfo_hasPreviousPagePlan($pageInfo) {
  return $pageInfo.hasPreviousPage();
}
function ByDefaultAsIdentitiesConnection_nodesPlan($connection) {
  return $connection.nodes();
}
function ByDefaultAsIdentitiesConnection_edgesPlan($connection) {
  return $connection.edges();
}
function ByDefaultAsIdentitiesConnection_pageInfoPlan($connection) {
  // TYPES: why is this a TypeScript issue without the 'any'?
  return $connection.pageInfo();
}
function NetworksConnection_nodesPlan($connection) {
  return $connection.nodes();
}
function NetworksConnection_edgesPlan($connection) {
  return $connection.edges();
}
function NetworksConnection_pageInfoPlan($connection) {
  // TYPES: why is this a TypeScript issue without the 'any'?
  return $connection.pageInfo();
}
function TypesConnection_nodesPlan($connection) {
  return $connection.nodes();
}
function TypesConnection_edgesPlan($connection) {
  return $connection.edges();
}
function TypesConnection_pageInfoPlan($connection) {
  // TYPES: why is this a TypeScript issue without the 'any'?
  return $connection.pageInfo();
}
function Mutation_createAlwaysAsIdentity_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_createByDefaultAsIdentity_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_createNetwork_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_createType_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.AlwaysAsIdentity, $nodeId);
};
function Mutation_updateAlwaysAsIdentity_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updateAlwaysAsIdentityById_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs2 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.ByDefaultAsIdentity, $nodeId);
};
function Mutation_updateByDefaultAsIdentity_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updateByDefaultAsIdentityById_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs3 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Network, $nodeId);
};
function Mutation_updateNetwork_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updateNetworkById_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs4 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Type, $nodeId);
};
function Mutation_updateType_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updateTypeById_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs5 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.AlwaysAsIdentity, $nodeId);
};
function Mutation_deleteAlwaysAsIdentity_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deleteAlwaysAsIdentityById_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs6 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.ByDefaultAsIdentity, $nodeId);
};
function Mutation_deleteByDefaultAsIdentity_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deleteByDefaultAsIdentityById_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs7 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Network, $nodeId);
};
function Mutation_deleteNetwork_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deleteNetworkById_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs8 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Type, $nodeId);
};
function Mutation_deleteType_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deleteTypeById_input_applyPlan(_, $object) {
  return $object;
}
function CreateAlwaysAsIdentityPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function CreateAlwaysAsIdentityPayload_alwaysAsIdentityPlan($object) {
  return $object.get("result");
}
function CreateAlwaysAsIdentityPayload_queryPlan() {
  return rootValue();
}
function CreateAlwaysAsIdentityInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function CreateAlwaysAsIdentityInput_alwaysAsIdentity_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function CreateByDefaultAsIdentityPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function CreateByDefaultAsIdentityPayload_byDefaultAsIdentityPlan($object) {
  return $object.get("result");
}
function CreateByDefaultAsIdentityPayload_queryPlan() {
  return rootValue();
}
function CreateByDefaultAsIdentityInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function CreateByDefaultAsIdentityInput_byDefaultAsIdentity_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function CreateNetworkPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function CreateNetworkPayload_networkPlan($object) {
  return $object.get("result");
}
function CreateNetworkPayload_queryPlan() {
  return rootValue();
}
function CreateNetworkInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function CreateNetworkInput_network_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function CreateTypePayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function CreateTypePayload_typePlan($object) {
  return $object.get("result");
}
function CreateTypePayload_queryPlan() {
  return rootValue();
}
function CreateTypeInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function CreateTypeInput_type_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateAlwaysAsIdentityPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function UpdateAlwaysAsIdentityPayload_alwaysAsIdentityPlan($object) {
  return $object.get("result");
}
function UpdateAlwaysAsIdentityPayload_queryPlan() {
  return rootValue();
}
function UpdateAlwaysAsIdentityInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateAlwaysAsIdentityInput_alwaysAsIdentityPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateAlwaysAsIdentityByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateAlwaysAsIdentityByIdInput_alwaysAsIdentityPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateByDefaultAsIdentityPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function UpdateByDefaultAsIdentityPayload_byDefaultAsIdentityPlan($object) {
  return $object.get("result");
}
function UpdateByDefaultAsIdentityPayload_queryPlan() {
  return rootValue();
}
function UpdateByDefaultAsIdentityInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateByDefaultAsIdentityInput_byDefaultAsIdentityPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateByDefaultAsIdentityByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateByDefaultAsIdentityByIdInput_byDefaultAsIdentityPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateNetworkPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function UpdateNetworkPayload_networkPlan($object) {
  return $object.get("result");
}
function UpdateNetworkPayload_queryPlan() {
  return rootValue();
}
function UpdateNetworkInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateNetworkInput_networkPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateNetworkByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateNetworkByIdInput_networkPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateTypePayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function UpdateTypePayload_typePlan($object) {
  return $object.get("result");
}
function UpdateTypePayload_queryPlan() {
  return rootValue();
}
function UpdateTypeInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateTypeInput_typePatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateTypeByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateTypeByIdInput_typePatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function DeleteAlwaysAsIdentityPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function DeleteAlwaysAsIdentityPayload_alwaysAsIdentityPlan($object) {
  return $object.get("result");
}
function DeleteAlwaysAsIdentityPayload_queryPlan() {
  return rootValue();
}
function DeleteAlwaysAsIdentityInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteAlwaysAsIdentityByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteByDefaultAsIdentityPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function DeleteByDefaultAsIdentityPayload_byDefaultAsIdentityPlan($object) {
  return $object.get("result");
}
function DeleteByDefaultAsIdentityPayload_queryPlan() {
  return rootValue();
}
function DeleteByDefaultAsIdentityInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteByDefaultAsIdentityByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteNetworkPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function DeleteNetworkPayload_networkPlan($object) {
  return $object.get("result");
}
function DeleteNetworkPayload_queryPlan() {
  return rootValue();
}
function DeleteNetworkInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteNetworkByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteTypePayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function DeleteTypePayload_typePlan($object) {
  return $object.get("result");
}
function DeleteTypePayload_queryPlan() {
  return rootValue();
}
function DeleteTypeInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteTypeByIdInput_clientMutationId_applyPlan($input, val) {
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

    """The method to use when ordering \`AlwaysAsIdentity\`."""
    orderBy: [AlwaysAsIdentitiesOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: AlwaysAsIdentityCondition
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

    """The method to use when ordering \`ByDefaultAsIdentity\`."""
    orderBy: [ByDefaultAsIdentitiesOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: ByDefaultAsIdentityCondition
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

    """The method to use when ordering \`Network\`."""
    orderBy: [NetworksOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: NetworkCondition
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

    """The method to use when ordering \`Type\`."""
    orderBy: [TypesOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: TypeCondition
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
  cidr: String
  macaddr: String
  macaddr8: String
}

"""An IPv4 or IPv6 host address, and optionally its subnet."""
scalar InternetAddress

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

"""
A condition to be used against \`Network\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input NetworkCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`inet\` field."""
  inet: InternetAddress

  """Checks for equality with the object’s \`cidr\` field."""
  cidr: String

  """Checks for equality with the object’s \`macaddr\` field."""
  macaddr: String

  """Checks for equality with the object’s \`macaddr8\` field."""
  macaddr8: String
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
  cidr: String
  macaddr: String
  macaddr8: String
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
  cidr: String
  macaddr: String
  macaddr8: String
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
    alwaysAsIdentityById: {
      plan(_$root, args) {
        return pgResource_always_as_identityPgResource.get({
          id: args.get("id")
        });
      },
      args: {
        id: undefined
      }
    },
    byDefaultAsIdentityById: {
      plan(_$root, args) {
        return pgResource_by_default_as_identityPgResource.get({
          id: args.get("id")
        });
      },
      args: {
        id: undefined
      }
    },
    networkById: {
      plan(_$root, args) {
        return pgResource_networkPgResource.get({
          id: args.get("id")
        });
      },
      args: {
        id: undefined
      }
    },
    typeById: {
      plan(_$root, args) {
        return pgResource_typesPgResource.get({
          id: args.get("id")
        });
      },
      args: {
        id: undefined
      }
    },
    alwaysAsIdentity: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    byDefaultAsIdentity: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher2($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    network: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher3($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    type: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher4($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    allAlwaysAsIdentities: {
      plan() {
        return connection(pgResource_always_as_identityPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allAlwaysAsIdentities_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allAlwaysAsIdentities_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allAlwaysAsIdentities_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allAlwaysAsIdentities_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allAlwaysAsIdentities_after_applyPlan
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("AlwaysAsIdentitiesOrderBy"));
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
    allByDefaultAsIdentities: {
      plan() {
        return connection(pgResource_by_default_as_identityPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allByDefaultAsIdentities_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allByDefaultAsIdentities_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allByDefaultAsIdentities_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allByDefaultAsIdentities_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allByDefaultAsIdentities_after_applyPlan
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("ByDefaultAsIdentitiesOrderBy"));
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
    allNetworks: {
      plan() {
        return connection(pgResource_networkPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allNetworks_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allNetworks_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allNetworks_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allNetworks_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allNetworks_after_applyPlan
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("NetworksOrderBy"));
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
    allTypes: {
      plan() {
        return connection(pgResource_typesPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allTypes_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allTypes_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allTypes_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allTypes_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allTypes_after_applyPlan
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("TypesOrderBy"));
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
  AlwaysAsIdentity: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.AlwaysAsIdentity.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.AlwaysAsIdentity.codec.name].encode);
    },
    id($record) {
      return $record.get("id");
    },
    t($record) {
      return $record.get("t");
    }
  },
  ByDefaultAsIdentity: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.ByDefaultAsIdentity.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.ByDefaultAsIdentity.codec.name].encode);
    },
    id($record) {
      return $record.get("id");
    },
    t($record) {
      return $record.get("t");
    }
  },
  Network: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.Network.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Network.codec.name].encode);
    },
    id($record) {
      return $record.get("id");
    },
    inet($record) {
      return $record.get("inet");
    },
    cidr($record) {
      return $record.get("cidr");
    },
    macaddr($record) {
      return $record.get("macaddr");
    },
    macaddr8($record) {
      return $record.get("macaddr8");
    }
  },
  Type: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.Type.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Type.codec.name].encode);
    },
    id($record) {
      return $record.get("id");
    },
    regrole($record) {
      return $record.get("regrole");
    },
    regnamespace($record) {
      return $record.get("regnamespace");
    },
    bigintDomainArrayDomain($record) {
      return $record.get("bigint_domain_array_domain");
    },
    domainConstrainedCompoundType($record) {
      const $plan = $record.get("domain_constrained_compound_type");
      const $select = pgSelectSingleFromRecord(resource_frmcdc_domainConstrainedCompoundTypePgResource, $plan);
      if (false) {
        $select.coalesceToEmptyObject();
      }
      $select.getClassStep().setTrusted();
      return $select;
    }
  },
  DomainConstrainedCompoundType: {
    __assertStep: assertPgClassSingleStep,
    a($record) {
      return $record.get("a");
    },
    b($record) {
      return $record.get("b");
    },
    c($record) {
      return $record.get("c");
    },
    d($record) {
      return $record.get("d");
    },
    e($record) {
      return $record.get("e");
    },
    f($record) {
      return $record.get("f");
    },
    g($record) {
      return $record.get("g");
    },
    fooBar($record) {
      return $record.get("foo_bar");
    }
  },
  Color: {
    RED: {
      value: "red"
    },
    GREEN: {
      value: "green"
    },
    BLUE: {
      value: "blue"
    }
  },
  EnumCaps: {
    _0_BAR: {
      value: "0_BAR"
    }
  },
  EnumWithEmptyString: {
    _EMPTY_: {
      value: ""
    },
    ONE: {
      value: "one"
    },
    TWO: {
      value: "two"
    }
  },
  Interval: {
    __assertStep: assertExecutableStep,
    seconds: Interval_secondsPlan,
    minutes: Interval_minutesPlan,
    hours: Interval_hoursPlan,
    days: Interval_daysPlan,
    months: Interval_monthsPlan,
    years: Interval_yearsPlan
  },
  AlwaysAsIdentitiesConnection: {
    __assertStep: ConnectionStep,
    nodes: AlwaysAsIdentitiesConnection_nodesPlan,
    edges: AlwaysAsIdentitiesConnection_edgesPlan,
    pageInfo: AlwaysAsIdentitiesConnection_pageInfoPlan,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  AlwaysAsIdentitiesEdge: {
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
  AlwaysAsIdentitiesOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        uniques[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_alwaysAsIdentity_alwaysAsIdentity.attributes[attributeName];
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
          const attribute = registryConfig_pgCodecs_alwaysAsIdentity_alwaysAsIdentity.attributes[attributeName];
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
    T_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "t",
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
    T_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "t",
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
  AlwaysAsIdentityCondition: {
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes.id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    t: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "t",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "t",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes.t.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  ByDefaultAsIdentitiesConnection: {
    __assertStep: ConnectionStep,
    nodes: ByDefaultAsIdentitiesConnection_nodesPlan,
    edges: ByDefaultAsIdentitiesConnection_edgesPlan,
    pageInfo: ByDefaultAsIdentitiesConnection_pageInfoPlan,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  ByDefaultAsIdentitiesEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  ByDefaultAsIdentitiesOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        uniques2[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_byDefaultAsIdentity_byDefaultAsIdentity.attributes[attributeName];
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
          const attribute = registryConfig_pgCodecs_byDefaultAsIdentity_byDefaultAsIdentity.attributes[attributeName];
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
    T_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "t",
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
    T_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "t",
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
  ByDefaultAsIdentityCondition: {
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes2.id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    t: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "t",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "t",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes2.t.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  NetworksConnection: {
    __assertStep: ConnectionStep,
    nodes: NetworksConnection_nodesPlan,
    edges: NetworksConnection_edgesPlan,
    pageInfo: NetworksConnection_pageInfoPlan,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  NetworksEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  NetworksOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        uniques3[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_network_network.attributes[attributeName];
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
        uniques3[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_network_network.attributes[attributeName];
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
    INET_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "inet",
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
    INET_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "inet",
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
    CIDR_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "cidr",
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
    CIDR_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "cidr",
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
    MACADDR_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "macaddr",
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
    MACADDR_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "macaddr",
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
    MACADDR8_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "macaddr8",
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
    MACADDR8_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "macaddr8",
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
  NetworkCondition: {
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes3.id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    inet: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "inet",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "inet",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes3.inet.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    cidr: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "cidr",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "cidr",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes3.cidr.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    macaddr: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "macaddr",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "macaddr",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes3.macaddr.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    macaddr8: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "macaddr8",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "macaddr8",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes3.macaddr8.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  TypesConnection: {
    __assertStep: ConnectionStep,
    nodes: TypesConnection_nodesPlan,
    edges: TypesConnection_edgesPlan,
    pageInfo: TypesConnection_pageInfoPlan,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  TypesEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  TypesOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        uniques4[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_types_types.attributes[attributeName];
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
        uniques4[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_types_types.attributes[attributeName];
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
    REGROLE_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "regrole",
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
    REGROLE_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "regrole",
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
    REGNAMESPACE_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "regnamespace",
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
    REGNAMESPACE_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "regnamespace",
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
    DOMAIN_CONSTRAINED_COMPOUND_TYPE_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "domain_constrained_compound_type",
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
    DOMAIN_CONSTRAINED_COMPOUND_TYPE_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "domain_constrained_compound_type",
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
  TypeCondition: {
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes5.id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    regrole: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "regrole",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "regrole",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes5.regrole.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    regnamespace: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "regnamespace",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "regnamespace",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes5.regnamespace.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    bigintDomainArrayDomain: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "bigint_domain_array_domain",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "bigint_domain_array_domain",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes5.bigint_domain_array_domain.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    domainConstrainedCompoundType: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "domain_constrained_compound_type",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "domain_constrained_compound_type",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes5.domain_constrained_compound_type.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  DomainConstrainedCompoundTypeInput: {
    a: {
      applyPlan($insert, val) {
        $insert.set("a", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    b: {
      applyPlan($insert, val) {
        $insert.set("b", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    c: {
      applyPlan($insert, val) {
        $insert.set("c", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    d: {
      applyPlan($insert, val) {
        $insert.set("d", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    e: {
      applyPlan($insert, val) {
        $insert.set("e", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    f: {
      applyPlan($insert, val) {
        $insert.set("f", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    g: {
      applyPlan($insert, val) {
        $insert.set("g", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    fooBar: {
      applyPlan($insert, val) {
        $insert.set("foo_bar", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  IntervalInput: {
    seconds: undefined,
    minutes: undefined,
    hours: undefined,
    days: undefined,
    months: undefined,
    years: undefined
  },
  Mutation: {
    __assertStep: __ValueStep,
    createAlwaysAsIdentity: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_always_as_identityPgResource, Object.create(null))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan: Mutation_createAlwaysAsIdentity_input_applyPlan
        }
      }
    },
    createByDefaultAsIdentity: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_by_default_as_identityPgResource, Object.create(null))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan: Mutation_createByDefaultAsIdentity_input_applyPlan
        }
      }
    },
    createNetwork: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_networkPgResource, Object.create(null))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan: Mutation_createNetwork_input_applyPlan
        }
      }
    },
    createType: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_typesPgResource, Object.create(null))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan: Mutation_createType_input_applyPlan
        }
      }
    },
    updateAlwaysAsIdentity: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_always_as_identityPgResource, specFromArgs(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_updateAlwaysAsIdentity_input_applyPlan
        }
      }
    },
    updateAlwaysAsIdentityById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_always_as_identityPgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_updateAlwaysAsIdentityById_input_applyPlan
        }
      }
    },
    updateByDefaultAsIdentity: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_by_default_as_identityPgResource, specFromArgs2(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_updateByDefaultAsIdentity_input_applyPlan
        }
      }
    },
    updateByDefaultAsIdentityById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_by_default_as_identityPgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_updateByDefaultAsIdentityById_input_applyPlan
        }
      }
    },
    updateNetwork: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_networkPgResource, specFromArgs3(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_updateNetwork_input_applyPlan
        }
      }
    },
    updateNetworkById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_networkPgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_updateNetworkById_input_applyPlan
        }
      }
    },
    updateType: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_typesPgResource, specFromArgs4(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_updateType_input_applyPlan
        }
      }
    },
    updateTypeById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_typesPgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_updateTypeById_input_applyPlan
        }
      }
    },
    deleteAlwaysAsIdentity: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_always_as_identityPgResource, specFromArgs5(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_deleteAlwaysAsIdentity_input_applyPlan
        }
      }
    },
    deleteAlwaysAsIdentityById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_always_as_identityPgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_deleteAlwaysAsIdentityById_input_applyPlan
        }
      }
    },
    deleteByDefaultAsIdentity: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_by_default_as_identityPgResource, specFromArgs6(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_deleteByDefaultAsIdentity_input_applyPlan
        }
      }
    },
    deleteByDefaultAsIdentityById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_by_default_as_identityPgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_deleteByDefaultAsIdentityById_input_applyPlan
        }
      }
    },
    deleteNetwork: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_networkPgResource, specFromArgs7(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_deleteNetwork_input_applyPlan
        }
      }
    },
    deleteNetworkById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_networkPgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_deleteNetworkById_input_applyPlan
        }
      }
    },
    deleteType: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_typesPgResource, specFromArgs8(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_deleteType_input_applyPlan
        }
      }
    },
    deleteTypeById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_typesPgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_deleteTypeById_input_applyPlan
        }
      }
    }
  },
  CreateAlwaysAsIdentityPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId: CreateAlwaysAsIdentityPayload_clientMutationIdPlan,
    alwaysAsIdentity: CreateAlwaysAsIdentityPayload_alwaysAsIdentityPlan,
    query: CreateAlwaysAsIdentityPayload_queryPlan,
    alwaysAsIdentityEdge: {
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
            return pgResource_always_as_identityPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("AlwaysAsIdentitiesOrderBy"));
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
  CreateAlwaysAsIdentityInput: {
    clientMutationId: {
      applyPlan: CreateAlwaysAsIdentityInput_clientMutationId_applyPlan,
      autoApplyAfterParentApplyPlan: true
    },
    alwaysAsIdentity: {
      applyPlan: CreateAlwaysAsIdentityInput_alwaysAsIdentity_applyPlan,
      autoApplyAfterParentApplyPlan: true
    }
  },
  AlwaysAsIdentityInput: {
    t: {
      applyPlan($insert, val) {
        $insert.set("t", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreateByDefaultAsIdentityPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId: CreateByDefaultAsIdentityPayload_clientMutationIdPlan,
    byDefaultAsIdentity: CreateByDefaultAsIdentityPayload_byDefaultAsIdentityPlan,
    query: CreateByDefaultAsIdentityPayload_queryPlan,
    byDefaultAsIdentityEdge: {
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
            return pgResource_by_default_as_identityPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("ByDefaultAsIdentitiesOrderBy"));
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
  CreateByDefaultAsIdentityInput: {
    clientMutationId: {
      applyPlan: CreateByDefaultAsIdentityInput_clientMutationId_applyPlan,
      autoApplyAfterParentApplyPlan: true
    },
    byDefaultAsIdentity: {
      applyPlan: CreateByDefaultAsIdentityInput_byDefaultAsIdentity_applyPlan,
      autoApplyAfterParentApplyPlan: true
    }
  },
  ByDefaultAsIdentityInput: {
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    t: {
      applyPlan($insert, val) {
        $insert.set("t", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreateNetworkPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId: CreateNetworkPayload_clientMutationIdPlan,
    network: CreateNetworkPayload_networkPlan,
    query: CreateNetworkPayload_queryPlan,
    networkEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = uniques3[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_networkPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("NetworksOrderBy"));
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
  CreateNetworkInput: {
    clientMutationId: {
      applyPlan: CreateNetworkInput_clientMutationId_applyPlan,
      autoApplyAfterParentApplyPlan: true
    },
    network: {
      applyPlan: CreateNetworkInput_network_applyPlan,
      autoApplyAfterParentApplyPlan: true
    }
  },
  NetworkInput: {
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    inet: {
      applyPlan($insert, val) {
        $insert.set("inet", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    cidr: {
      applyPlan($insert, val) {
        $insert.set("cidr", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    macaddr: {
      applyPlan($insert, val) {
        $insert.set("macaddr", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    macaddr8: {
      applyPlan($insert, val) {
        $insert.set("macaddr8", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreateTypePayload: {
    __assertStep: assertExecutableStep,
    clientMutationId: CreateTypePayload_clientMutationIdPlan,
    type: CreateTypePayload_typePlan,
    query: CreateTypePayload_queryPlan,
    typeEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = uniques4[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_typesPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("TypesOrderBy"));
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
  CreateTypeInput: {
    clientMutationId: {
      applyPlan: CreateTypeInput_clientMutationId_applyPlan,
      autoApplyAfterParentApplyPlan: true
    },
    type: {
      applyPlan: CreateTypeInput_type_applyPlan,
      autoApplyAfterParentApplyPlan: true
    }
  },
  TypeInput: {
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    regrole: {
      applyPlan($insert, val) {
        $insert.set("regrole", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    regnamespace: {
      applyPlan($insert, val) {
        $insert.set("regnamespace", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    bigintDomainArrayDomain: {
      applyPlan($insert, val) {
        $insert.set("bigint_domain_array_domain", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    domainConstrainedCompoundType: {
      applyPlan($insert, val) {
        $insert.set("domain_constrained_compound_type", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateAlwaysAsIdentityPayload: {
    __assertStep: ObjectStep,
    clientMutationId: UpdateAlwaysAsIdentityPayload_clientMutationIdPlan,
    alwaysAsIdentity: UpdateAlwaysAsIdentityPayload_alwaysAsIdentityPlan,
    query: UpdateAlwaysAsIdentityPayload_queryPlan,
    alwaysAsIdentityEdge: {
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
            return pgResource_always_as_identityPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("AlwaysAsIdentitiesOrderBy"));
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
  UpdateAlwaysAsIdentityInput: {
    clientMutationId: {
      applyPlan: UpdateAlwaysAsIdentityInput_clientMutationId_applyPlan
    },
    nodeId: undefined,
    alwaysAsIdentityPatch: {
      applyPlan: UpdateAlwaysAsIdentityInput_alwaysAsIdentityPatch_applyPlan
    }
  },
  AlwaysAsIdentityPatch: {
    t: {
      applyPlan($insert, val) {
        $insert.set("t", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateAlwaysAsIdentityByIdInput: {
    clientMutationId: {
      applyPlan: UpdateAlwaysAsIdentityByIdInput_clientMutationId_applyPlan
    },
    id: undefined,
    alwaysAsIdentityPatch: {
      applyPlan: UpdateAlwaysAsIdentityByIdInput_alwaysAsIdentityPatch_applyPlan
    }
  },
  UpdateByDefaultAsIdentityPayload: {
    __assertStep: ObjectStep,
    clientMutationId: UpdateByDefaultAsIdentityPayload_clientMutationIdPlan,
    byDefaultAsIdentity: UpdateByDefaultAsIdentityPayload_byDefaultAsIdentityPlan,
    query: UpdateByDefaultAsIdentityPayload_queryPlan,
    byDefaultAsIdentityEdge: {
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
            return pgResource_by_default_as_identityPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("ByDefaultAsIdentitiesOrderBy"));
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
  UpdateByDefaultAsIdentityInput: {
    clientMutationId: {
      applyPlan: UpdateByDefaultAsIdentityInput_clientMutationId_applyPlan
    },
    nodeId: undefined,
    byDefaultAsIdentityPatch: {
      applyPlan: UpdateByDefaultAsIdentityInput_byDefaultAsIdentityPatch_applyPlan
    }
  },
  ByDefaultAsIdentityPatch: {
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    t: {
      applyPlan($insert, val) {
        $insert.set("t", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateByDefaultAsIdentityByIdInput: {
    clientMutationId: {
      applyPlan: UpdateByDefaultAsIdentityByIdInput_clientMutationId_applyPlan
    },
    id: undefined,
    byDefaultAsIdentityPatch: {
      applyPlan: UpdateByDefaultAsIdentityByIdInput_byDefaultAsIdentityPatch_applyPlan
    }
  },
  UpdateNetworkPayload: {
    __assertStep: ObjectStep,
    clientMutationId: UpdateNetworkPayload_clientMutationIdPlan,
    network: UpdateNetworkPayload_networkPlan,
    query: UpdateNetworkPayload_queryPlan,
    networkEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = uniques3[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_networkPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("NetworksOrderBy"));
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
  UpdateNetworkInput: {
    clientMutationId: {
      applyPlan: UpdateNetworkInput_clientMutationId_applyPlan
    },
    nodeId: undefined,
    networkPatch: {
      applyPlan: UpdateNetworkInput_networkPatch_applyPlan
    }
  },
  NetworkPatch: {
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    inet: {
      applyPlan($insert, val) {
        $insert.set("inet", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    cidr: {
      applyPlan($insert, val) {
        $insert.set("cidr", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    macaddr: {
      applyPlan($insert, val) {
        $insert.set("macaddr", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    macaddr8: {
      applyPlan($insert, val) {
        $insert.set("macaddr8", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateNetworkByIdInput: {
    clientMutationId: {
      applyPlan: UpdateNetworkByIdInput_clientMutationId_applyPlan
    },
    id: undefined,
    networkPatch: {
      applyPlan: UpdateNetworkByIdInput_networkPatch_applyPlan
    }
  },
  UpdateTypePayload: {
    __assertStep: ObjectStep,
    clientMutationId: UpdateTypePayload_clientMutationIdPlan,
    type: UpdateTypePayload_typePlan,
    query: UpdateTypePayload_queryPlan,
    typeEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = uniques4[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_typesPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("TypesOrderBy"));
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
  UpdateTypeInput: {
    clientMutationId: {
      applyPlan: UpdateTypeInput_clientMutationId_applyPlan
    },
    nodeId: undefined,
    typePatch: {
      applyPlan: UpdateTypeInput_typePatch_applyPlan
    }
  },
  TypePatch: {
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    regrole: {
      applyPlan($insert, val) {
        $insert.set("regrole", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    regnamespace: {
      applyPlan($insert, val) {
        $insert.set("regnamespace", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    bigintDomainArrayDomain: {
      applyPlan($insert, val) {
        $insert.set("bigint_domain_array_domain", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    domainConstrainedCompoundType: {
      applyPlan($insert, val) {
        $insert.set("domain_constrained_compound_type", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateTypeByIdInput: {
    clientMutationId: {
      applyPlan: UpdateTypeByIdInput_clientMutationId_applyPlan
    },
    id: undefined,
    typePatch: {
      applyPlan: UpdateTypeByIdInput_typePatch_applyPlan
    }
  },
  DeleteAlwaysAsIdentityPayload: {
    __assertStep: ObjectStep,
    clientMutationId: DeleteAlwaysAsIdentityPayload_clientMutationIdPlan,
    alwaysAsIdentity: DeleteAlwaysAsIdentityPayload_alwaysAsIdentityPlan,
    deletedAlwaysAsIdentityId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.AlwaysAsIdentity.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query: DeleteAlwaysAsIdentityPayload_queryPlan,
    alwaysAsIdentityEdge: {
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
            return pgResource_always_as_identityPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("AlwaysAsIdentitiesOrderBy"));
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
  DeleteAlwaysAsIdentityInput: {
    clientMutationId: {
      applyPlan: DeleteAlwaysAsIdentityInput_clientMutationId_applyPlan
    },
    nodeId: undefined
  },
  DeleteAlwaysAsIdentityByIdInput: {
    clientMutationId: {
      applyPlan: DeleteAlwaysAsIdentityByIdInput_clientMutationId_applyPlan
    },
    id: undefined
  },
  DeleteByDefaultAsIdentityPayload: {
    __assertStep: ObjectStep,
    clientMutationId: DeleteByDefaultAsIdentityPayload_clientMutationIdPlan,
    byDefaultAsIdentity: DeleteByDefaultAsIdentityPayload_byDefaultAsIdentityPlan,
    deletedByDefaultAsIdentityId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.ByDefaultAsIdentity.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query: DeleteByDefaultAsIdentityPayload_queryPlan,
    byDefaultAsIdentityEdge: {
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
            return pgResource_by_default_as_identityPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("ByDefaultAsIdentitiesOrderBy"));
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
  DeleteByDefaultAsIdentityInput: {
    clientMutationId: {
      applyPlan: DeleteByDefaultAsIdentityInput_clientMutationId_applyPlan
    },
    nodeId: undefined
  },
  DeleteByDefaultAsIdentityByIdInput: {
    clientMutationId: {
      applyPlan: DeleteByDefaultAsIdentityByIdInput_clientMutationId_applyPlan
    },
    id: undefined
  },
  DeleteNetworkPayload: {
    __assertStep: ObjectStep,
    clientMutationId: DeleteNetworkPayload_clientMutationIdPlan,
    network: DeleteNetworkPayload_networkPlan,
    deletedNetworkId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.Network.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query: DeleteNetworkPayload_queryPlan,
    networkEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = uniques3[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_networkPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("NetworksOrderBy"));
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
  DeleteNetworkInput: {
    clientMutationId: {
      applyPlan: DeleteNetworkInput_clientMutationId_applyPlan
    },
    nodeId: undefined
  },
  DeleteNetworkByIdInput: {
    clientMutationId: {
      applyPlan: DeleteNetworkByIdInput_clientMutationId_applyPlan
    },
    id: undefined
  },
  DeleteTypePayload: {
    __assertStep: ObjectStep,
    clientMutationId: DeleteTypePayload_clientMutationIdPlan,
    type: DeleteTypePayload_typePlan,
    deletedTypeId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.Type.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query: DeleteTypePayload_queryPlan,
    typeEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = uniques4[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_typesPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("TypesOrderBy"));
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
  DeleteTypeInput: {
    clientMutationId: {
      applyPlan: DeleteTypeInput_clientMutationId_applyPlan
    },
    nodeId: undefined
  },
  DeleteTypeByIdInput: {
    clientMutationId: {
      applyPlan: DeleteTypeByIdInput_clientMutationId_applyPlan
    },
    id: undefined
  }
};
export const schema = makeGrafastSchema({
  typeDefs: typeDefs,
  plans: plans
});
