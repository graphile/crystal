import { PgDeleteSingleStep, PgExecutor, TYPES, assertPgClassSingleStep, domainOfCodec, enumCodec, listOfCodec, makeRegistry, pgDeleteSingle, pgInsertSingle, pgSelectFromRecord, pgSelectSingleFromRecord, pgUpdateSingle, recordCodec, sqlValueWithCodec } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ObjectStep, __ValueStep, access, assertEdgeCapableStep, assertExecutableStep, assertPageInfoCapableStep, bakedInputRuntime, connection, constant, context, createObjectAndApplyChildren, first, inhibitOnNull, lambda, list, makeGrafastSchema, node, object, rootValue, specFromNodeId } from "grafast";
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
const alwaysAsIdentityIdentifier = sql.identifier("pg11", "always_as_identity");
const alwaysAsIdentityCodec = recordCodec({
  name: "alwaysAsIdentity",
  identifier: alwaysAsIdentityIdentifier,
  attributes: {
    __proto__: null,
    id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {},
        isInsertable: false,
        isUpdatable: false
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
  },
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "pg11",
      name: "always_as_identity"
    },
    tags: {
      __proto__: null
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
  },
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "pg11",
      name: "by_default_as_identity"
    },
    tags: {
      __proto__: null
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
  },
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "pg11",
      name: "network"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const bigintDomainCodec = domainOfCodec(TYPES.bigint, "bigintDomain", sql.identifier("c", "bigint_domain"), {
  description: undefined,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "bigint_domain"
    },
    tags: {
      __proto__: null
    }
  },
  notNull: false
});
const bigintDomainArrayCodec = listOfCodec(bigintDomainCodec, {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "_bigint_domain"
    },
    tags: {
      __proto__: null
    }
  },
  typeDelim: ",",
  description: undefined,
  name: "bigintDomainArray"
});
const bigintDomainArrayDomainCodec = domainOfCodec(bigintDomainArrayCodec, "bigintDomainArrayDomain", sql.identifier("c", "bigint_domain_array_domain"), {
  description: undefined,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "bigint_domain_array_domain"
    },
    tags: {
      __proto__: null
    }
  },
  notNull: false
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
    },
    tags: {
      __proto__: null
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
    },
    tags: {
      __proto__: null
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
    },
    tags: {
      __proto__: null
    }
  }
});
const compoundTypeCodec = recordCodec({
  name: "compoundType",
  identifier: sql.identifier("c", "compound_type"),
  attributes: {
    __proto__: null,
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
      codec: colorCodec,
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
      codec: enumCapsCodec,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    f: {
      description: undefined,
      codec: enumWithEmptyStringCodec,
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
  },
  description: "Awesome feature!",
  extensions: {
    isTableLike: false,
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "compound_type"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const domainConstrainedCompoundTypeCodec = domainOfCodec(compoundTypeCodec, "domainConstrainedCompoundType", sql.identifier("pg11", "domain_constrained_compound_type"), {
  description: undefined,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "pg11",
      name: "domain_constrained_compound_type"
    },
    tags: {
      __proto__: null
    }
  },
  notNull: false
});
const typesIdentifier = sql.identifier("pg11", "types");
const typesCodec = recordCodec({
  name: "types",
  identifier: typesIdentifier,
  attributes: {
    __proto__: null,
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
      codec: bigintDomainArrayDomainCodec,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    domain_constrained_compound_type: {
      description: undefined,
      codec: domainConstrainedCompoundTypeCodec,
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
      schemaName: "pg11",
      name: "types"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const always_as_identityUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const by_default_as_identityUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const networkUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const typesUniques = [{
  isPrimary: true,
  attributes: ["id"],
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
    types: typesCodec
  },
  pgResources: {
    __proto__: null,
    always_as_identity: {
      executor: executor,
      name: "always_as_identity",
      identifier: "main.pg11.always_as_identity",
      from: alwaysAsIdentityIdentifier,
      codec: alwaysAsIdentityCodec,
      uniques: always_as_identityUniques,
      isVirtual: false,
      description: undefined,
      extensions: {
        description: undefined,
        pg: {
          serviceName: "main",
          schemaName: "pg11",
          name: "always_as_identity"
        },
        isInsertable: true,
        isUpdatable: true,
        isDeletable: true,
        tags: {}
      }
    },
    by_default_as_identity: {
      executor: executor,
      name: "by_default_as_identity",
      identifier: "main.pg11.by_default_as_identity",
      from: byDefaultAsIdentityIdentifier,
      codec: byDefaultAsIdentityCodec,
      uniques: by_default_as_identityUniques,
      isVirtual: false,
      description: undefined,
      extensions: {
        description: undefined,
        pg: {
          serviceName: "main",
          schemaName: "pg11",
          name: "by_default_as_identity"
        },
        isInsertable: true,
        isUpdatable: true,
        isDeletable: true,
        tags: {}
      }
    },
    network: {
      executor: executor,
      name: "network",
      identifier: "main.pg11.network",
      from: networkIdentifier,
      codec: networkCodec,
      uniques: networkUniques,
      isVirtual: false,
      description: undefined,
      extensions: {
        description: undefined,
        pg: {
          serviceName: "main",
          schemaName: "pg11",
          name: "network"
        },
        isInsertable: true,
        isUpdatable: true,
        isDeletable: true,
        tags: {}
      }
    },
    types: {
      executor: executor,
      name: "types",
      identifier: "main.pg11.types",
      from: typesIdentifier,
      codec: typesCodec,
      uniques: typesUniques,
      isVirtual: false,
      description: undefined,
      extensions: {
        description: undefined,
        pg: {
          serviceName: "main",
          schemaName: "pg11",
          name: "types"
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
const pgResource_always_as_identityPgResource = registry.pgResources["always_as_identity"];
const pgResource_by_default_as_identityPgResource = registry.pgResources["by_default_as_identity"];
const pgResource_networkPgResource = registry.pgResources["network"];
const pgResource_typesPgResource = registry.pgResources["types"];
const nodeIdHandlerByTypeName = {
  __proto__: null,
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
        id: inhibitOnNull(access($list, [1]))
      };
    },
    getIdentifiers(value) {
      return value.slice(1);
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
        id: inhibitOnNull(access($list, [1]))
      };
    },
    getIdentifiers(value) {
      return value.slice(1);
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
        id: inhibitOnNull(access($list, [1]))
      };
    },
    getIdentifiers(value) {
      return value.slice(1);
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
        id: inhibitOnNull(access($list, [1]))
      };
    },
    getIdentifiers(value) {
      return value.slice(1);
    },
    get(spec) {
      return pgResource_typesPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "types";
    }
  }
};
function specForHandler(handler) {
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
  return spec;
}
const nodeFetcher_AlwaysAsIdentity = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandlerByTypeName.AlwaysAsIdentity));
  return nodeIdHandlerByTypeName.AlwaysAsIdentity.get(nodeIdHandlerByTypeName.AlwaysAsIdentity.getSpec($decoded));
};
const nodeFetcher_ByDefaultAsIdentity = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandlerByTypeName.ByDefaultAsIdentity));
  return nodeIdHandlerByTypeName.ByDefaultAsIdentity.get(nodeIdHandlerByTypeName.ByDefaultAsIdentity.getSpec($decoded));
};
const nodeFetcher_Network = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandlerByTypeName.Network));
  return nodeIdHandlerByTypeName.Network.get(nodeIdHandlerByTypeName.Network.getSpec($decoded));
};
const nodeFetcher_Type = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandlerByTypeName.Type));
  return nodeIdHandlerByTypeName.Type.get(nodeIdHandlerByTypeName.Type.getSpec($decoded));
};
function qbWhereBuilder(qb) {
  return qb.whereBuilder();
}
function InternetAddressSerialize(value) {
  return "" + value;
}
const resource_frmcdc_domainConstrainedCompoundTypePgResource = registry.pgResources["frmcdc_domainConstrainedCompoundType"];
const coerce = string => {
  if (!/^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i.test(string)) {
    throw new GraphQLError("Invalid UUID, expected 32 hexadecimal characters, optionally with hypens");
  }
  return string;
};
const specFromArgs_AlwaysAsIdentity = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.AlwaysAsIdentity, $nodeId);
};
const specFromArgs_ByDefaultAsIdentity = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.ByDefaultAsIdentity, $nodeId);
};
const specFromArgs_Network = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Network, $nodeId);
};
const specFromArgs_Type = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Type, $nodeId);
};
const specFromArgs_AlwaysAsIdentity2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.AlwaysAsIdentity, $nodeId);
};
const specFromArgs_ByDefaultAsIdentity2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.ByDefaultAsIdentity, $nodeId);
};
const specFromArgs_Network2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Network, $nodeId);
};
const specFromArgs_Type2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Type, $nodeId);
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
      return node(nodeIdHandlerByTypeName, args.getRaw("nodeId"));
    },
    alwaysAsIdentityById(_$root, {
      $id
    }) {
      return pgResource_always_as_identityPgResource.get({
        id: $id
      });
    },
    byDefaultAsIdentityById(_$root, {
      $id
    }) {
      return pgResource_by_default_as_identityPgResource.get({
        id: $id
      });
    },
    networkById(_$root, {
      $id
    }) {
      return pgResource_networkPgResource.get({
        id: $id
      });
    },
    typeById(_$root, {
      $id
    }) {
      return pgResource_typesPgResource.get({
        id: $id
      });
    },
    alwaysAsIdentity(_$parent, args) {
      const $nodeId = args.getRaw("nodeId");
      return nodeFetcher_AlwaysAsIdentity($nodeId);
    },
    byDefaultAsIdentity(_$parent, args) {
      const $nodeId = args.getRaw("nodeId");
      return nodeFetcher_ByDefaultAsIdentity($nodeId);
    },
    network(_$parent, args) {
      const $nodeId = args.getRaw("nodeId");
      return nodeFetcher_Network($nodeId);
    },
    type(_$parent, args) {
      const $nodeId = args.getRaw("nodeId");
      return nodeFetcher_Type($nodeId);
    },
    allAlwaysAsIdentities: {
      plan() {
        return connection(pgResource_always_as_identityPgResource.find());
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
    allByDefaultAsIdentities: {
      plan() {
        return connection(pgResource_by_default_as_identityPgResource.find());
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
    allNetworks: {
      plan() {
        return connection(pgResource_networkPgResource.find());
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
    allTypes: {
      plan() {
        return connection(pgResource_typesPgResource.find());
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
    }
  },
  AlwaysAsIdentity: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.AlwaysAsIdentity.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.AlwaysAsIdentity.codec.name].encode);
    }
  },
  ByDefaultAsIdentity: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.ByDefaultAsIdentity.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.ByDefaultAsIdentity.codec.name].encode);
    }
  },
  Network: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.Network.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Network.codec.name].encode);
    }
  },
  InternetAddress: {
    serialize: InternetAddressSerialize,
    parseValue: InternetAddressSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"InternetAddress" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
    }
  },
  CidrAddress: {
    serialize: InternetAddressSerialize,
    parseValue: InternetAddressSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"CidrAddress" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
    }
  },
  MacAddress: {
    serialize: InternetAddressSerialize,
    parseValue: InternetAddressSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"MacAddress" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
    }
  },
  MacAddress8: {
    serialize: InternetAddressSerialize,
    parseValue: InternetAddressSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"MacAddress8" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
    }
  },
  Type: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.Type.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Type.codec.name].encode);
    },
    bigintDomainArrayDomain($record) {
      return $record.get("bigint_domain_array_domain");
    },
    domainConstrainedCompoundType($record) {
      const $plan = $record.get("domain_constrained_compound_type");
      const $select = pgSelectSingleFromRecord(resource_frmcdc_domainConstrainedCompoundTypePgResource, $plan);
      $select.getClassStep().setTrusted();
      return $select;
    }
  },
  RegRole: {
    serialize: InternetAddressSerialize,
    parseValue: InternetAddressSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"RegRole" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
    }
  },
  RegNamespace: {
    serialize: InternetAddressSerialize,
    parseValue: InternetAddressSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"RegNamespace" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
    }
  },
  BigintDomain: {
    serialize: InternetAddressSerialize,
    parseValue: InternetAddressSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"BigInt" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
    }
  },
  DomainConstrainedCompoundType: {
    __assertStep: assertPgClassSingleStep,
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
  UUID: {
    serialize: InternetAddressSerialize,
    parseValue(value) {
      return coerce("" + value);
    },
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        // ERRORS: add name to this error
        throw new GraphQLError(`${"UUID" ?? "This scalar"} can only parse string values (kind = '${ast.kind}')`);
      }
      return coerce(ast.value);
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
    __assertStep: assertExecutableStep
  },
  AlwaysAsIdentitiesConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
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
  Cursor: {
    serialize: InternetAddressSerialize,
    parseValue: InternetAddressSerialize,
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
  AlwaysAsIdentityCondition: {
    id($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "id",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    },
    t($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "t",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
        }
      });
    }
  },
  AlwaysAsIdentitiesOrderBy: {
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
    ID_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "id",
        direction: "ASC"
      });
      queryBuilder.setOrderIsUnique();
    },
    ID_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "id",
        direction: "DESC"
      });
      queryBuilder.setOrderIsUnique();
    },
    T_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "t",
        direction: "ASC"
      });
    },
    T_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "t",
        direction: "DESC"
      });
    }
  },
  ByDefaultAsIdentitiesConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
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
  ByDefaultAsIdentityCondition: {
    id($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "id",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    },
    t($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "t",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
        }
      });
    }
  },
  ByDefaultAsIdentitiesOrderBy: {
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
    ID_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "id",
        direction: "ASC"
      });
      queryBuilder.setOrderIsUnique();
    },
    ID_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "id",
        direction: "DESC"
      });
      queryBuilder.setOrderIsUnique();
    },
    T_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "t",
        direction: "ASC"
      });
    },
    T_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "t",
        direction: "DESC"
      });
    }
  },
  NetworksConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
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
  NetworkCondition: {
    id($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "id",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    },
    inet($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "inet",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.inet)}`;
        }
      });
    },
    cidr($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "cidr",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.cidr)}`;
        }
      });
    },
    macaddr($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "macaddr",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.macaddr)}`;
        }
      });
    },
    macaddr8($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "macaddr8",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.macaddr8)}`;
        }
      });
    }
  },
  NetworksOrderBy: {
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
    },
    ID_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "id",
        direction: "ASC"
      });
      queryBuilder.setOrderIsUnique();
    },
    ID_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "id",
        direction: "DESC"
      });
      queryBuilder.setOrderIsUnique();
    },
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
    }
  },
  TypesConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
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
  TypeCondition: {
    id($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "id",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    },
    regrole($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "regrole",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.regrole)}`;
        }
      });
    },
    regnamespace($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "regnamespace",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.regnamespace)}`;
        }
      });
    },
    bigintDomainArrayDomain($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "bigint_domain_array_domain",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, bigintDomainArrayDomainCodec)}`;
        }
      });
    },
    domainConstrainedCompoundType($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "domain_constrained_compound_type",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, domainConstrainedCompoundTypeCodec)}`;
        }
      });
    }
  },
  DomainConstrainedCompoundTypeInput: {
    __baked: createObjectAndApplyChildren,
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
    g(obj, val, {
      field,
      schema
    }) {
      obj.set("g", bakedInputRuntime(schema, field.type, val));
    },
    fooBar(obj, val, {
      field,
      schema
    }) {
      obj.set("foo_bar", bakedInputRuntime(schema, field.type, val));
    }
  },
  TypesOrderBy: {
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
    ID_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "id",
        direction: "ASC"
      });
      queryBuilder.setOrderIsUnique();
    },
    ID_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "id",
        direction: "DESC"
      });
      queryBuilder.setOrderIsUnique();
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
    }
  },
  Mutation: {
    __assertStep: __ValueStep,
    createAlwaysAsIdentity: {
      plan(_, args) {
        const $insert = pgInsertSingle(pgResource_always_as_identityPgResource, Object.create(null));
        args.apply($insert);
        const plan = object({
          result: $insert
        });
        return plan;
      },
      args: {
        input(_, $object) {
          return $object;
        }
      }
    },
    createByDefaultAsIdentity: {
      plan(_, args) {
        const $insert = pgInsertSingle(pgResource_by_default_as_identityPgResource, Object.create(null));
        args.apply($insert);
        const plan = object({
          result: $insert
        });
        return plan;
      },
      args: {
        input(_, $object) {
          return $object;
        }
      }
    },
    createNetwork: {
      plan(_, args) {
        const $insert = pgInsertSingle(pgResource_networkPgResource, Object.create(null));
        args.apply($insert);
        const plan = object({
          result: $insert
        });
        return plan;
      },
      args: {
        input(_, $object) {
          return $object;
        }
      }
    },
    createType: {
      plan(_, args) {
        const $insert = pgInsertSingle(pgResource_typesPgResource, Object.create(null));
        args.apply($insert);
        const plan = object({
          result: $insert
        });
        return plan;
      },
      args: {
        input(_, $object) {
          return $object;
        }
      }
    },
    updateAlwaysAsIdentity: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(pgResource_always_as_identityPgResource, specFromArgs_AlwaysAsIdentity(args));
        args.apply($update);
        return object({
          result: $update
        });
      },
      args: {
        input(_, $object) {
          return $object;
        }
      }
    },
    updateAlwaysAsIdentityById: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(pgResource_always_as_identityPgResource, {
          id: args.getRaw(['input', "id"])
        });
        args.apply($update);
        return object({
          result: $update
        });
      },
      args: {
        input(_, $object) {
          return $object;
        }
      }
    },
    updateByDefaultAsIdentity: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(pgResource_by_default_as_identityPgResource, specFromArgs_ByDefaultAsIdentity(args));
        args.apply($update);
        return object({
          result: $update
        });
      },
      args: {
        input(_, $object) {
          return $object;
        }
      }
    },
    updateByDefaultAsIdentityById: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(pgResource_by_default_as_identityPgResource, {
          id: args.getRaw(['input', "id"])
        });
        args.apply($update);
        return object({
          result: $update
        });
      },
      args: {
        input(_, $object) {
          return $object;
        }
      }
    },
    updateNetwork: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(pgResource_networkPgResource, specFromArgs_Network(args));
        args.apply($update);
        return object({
          result: $update
        });
      },
      args: {
        input(_, $object) {
          return $object;
        }
      }
    },
    updateNetworkById: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(pgResource_networkPgResource, {
          id: args.getRaw(['input', "id"])
        });
        args.apply($update);
        return object({
          result: $update
        });
      },
      args: {
        input(_, $object) {
          return $object;
        }
      }
    },
    updateType: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(pgResource_typesPgResource, specFromArgs_Type(args));
        args.apply($update);
        return object({
          result: $update
        });
      },
      args: {
        input(_, $object) {
          return $object;
        }
      }
    },
    updateTypeById: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(pgResource_typesPgResource, {
          id: args.getRaw(['input', "id"])
        });
        args.apply($update);
        return object({
          result: $update
        });
      },
      args: {
        input(_, $object) {
          return $object;
        }
      }
    },
    deleteAlwaysAsIdentity: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(pgResource_always_as_identityPgResource, specFromArgs_AlwaysAsIdentity2(args));
        args.apply($delete);
        return object({
          result: $delete
        });
      },
      args: {
        input(_, $object) {
          return $object;
        }
      }
    },
    deleteAlwaysAsIdentityById: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(pgResource_always_as_identityPgResource, {
          id: args.getRaw(['input', "id"])
        });
        args.apply($delete);
        return object({
          result: $delete
        });
      },
      args: {
        input(_, $object) {
          return $object;
        }
      }
    },
    deleteByDefaultAsIdentity: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(pgResource_by_default_as_identityPgResource, specFromArgs_ByDefaultAsIdentity2(args));
        args.apply($delete);
        return object({
          result: $delete
        });
      },
      args: {
        input(_, $object) {
          return $object;
        }
      }
    },
    deleteByDefaultAsIdentityById: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(pgResource_by_default_as_identityPgResource, {
          id: args.getRaw(['input', "id"])
        });
        args.apply($delete);
        return object({
          result: $delete
        });
      },
      args: {
        input(_, $object) {
          return $object;
        }
      }
    },
    deleteNetwork: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(pgResource_networkPgResource, specFromArgs_Network2(args));
        args.apply($delete);
        return object({
          result: $delete
        });
      },
      args: {
        input(_, $object) {
          return $object;
        }
      }
    },
    deleteNetworkById: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(pgResource_networkPgResource, {
          id: args.getRaw(['input', "id"])
        });
        args.apply($delete);
        return object({
          result: $delete
        });
      },
      args: {
        input(_, $object) {
          return $object;
        }
      }
    },
    deleteType: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(pgResource_typesPgResource, specFromArgs_Type2(args));
        args.apply($delete);
        return object({
          result: $delete
        });
      },
      args: {
        input(_, $object) {
          return $object;
        }
      }
    },
    deleteTypeById: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(pgResource_typesPgResource, {
          id: args.getRaw(['input', "id"])
        });
        args.apply($delete);
        return object({
          result: $delete
        });
      },
      args: {
        input(_, $object) {
          return $object;
        }
      }
    }
  },
  CreateAlwaysAsIdentityPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    alwaysAsIdentity($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    alwaysAsIdentityEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = always_as_identityUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return pgResource_always_as_identityPgResource.find(spec);
        }
      })();
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    }
  },
  CreateAlwaysAsIdentityInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    alwaysAsIdentity(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  AlwaysAsIdentityInput: {
    __baked: createObjectAndApplyChildren,
    t(obj, val, {
      field,
      schema
    }) {
      obj.set("t", bakedInputRuntime(schema, field.type, val));
    }
  },
  CreateByDefaultAsIdentityPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    byDefaultAsIdentity($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    byDefaultAsIdentityEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = by_default_as_identityUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return pgResource_by_default_as_identityPgResource.find(spec);
        }
      })();
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    }
  },
  CreateByDefaultAsIdentityInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    byDefaultAsIdentity(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  ByDefaultAsIdentityInput: {
    __baked: createObjectAndApplyChildren,
    id(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    t(obj, val, {
      field,
      schema
    }) {
      obj.set("t", bakedInputRuntime(schema, field.type, val));
    }
  },
  CreateNetworkPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    network($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    networkEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = networkUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return pgResource_networkPgResource.find(spec);
        }
      })();
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    }
  },
  CreateNetworkInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    network(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  NetworkInput: {
    __baked: createObjectAndApplyChildren,
    id(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    inet(obj, val, {
      field,
      schema
    }) {
      obj.set("inet", bakedInputRuntime(schema, field.type, val));
    },
    cidr(obj, val, {
      field,
      schema
    }) {
      obj.set("cidr", bakedInputRuntime(schema, field.type, val));
    },
    macaddr(obj, val, {
      field,
      schema
    }) {
      obj.set("macaddr", bakedInputRuntime(schema, field.type, val));
    },
    macaddr8(obj, val, {
      field,
      schema
    }) {
      obj.set("macaddr8", bakedInputRuntime(schema, field.type, val));
    }
  },
  CreateTypePayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    type($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    typeEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = typesUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return pgResource_typesPgResource.find(spec);
        }
      })();
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    }
  },
  CreateTypeInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    type(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  TypeInput: {
    __baked: createObjectAndApplyChildren,
    id(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    regrole(obj, val, {
      field,
      schema
    }) {
      obj.set("regrole", bakedInputRuntime(schema, field.type, val));
    },
    regnamespace(obj, val, {
      field,
      schema
    }) {
      obj.set("regnamespace", bakedInputRuntime(schema, field.type, val));
    },
    bigintDomainArrayDomain(obj, val, {
      field,
      schema
    }) {
      obj.set("bigint_domain_array_domain", bakedInputRuntime(schema, field.type, val));
    },
    domainConstrainedCompoundType(obj, val, {
      field,
      schema
    }) {
      obj.set("domain_constrained_compound_type", bakedInputRuntime(schema, field.type, val));
    }
  },
  UpdateAlwaysAsIdentityPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    alwaysAsIdentity($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    alwaysAsIdentityEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = always_as_identityUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return pgResource_always_as_identityPgResource.find(spec);
        }
      })();
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    }
  },
  UpdateAlwaysAsIdentityInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    alwaysAsIdentityPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  AlwaysAsIdentityPatch: {
    __baked: createObjectAndApplyChildren,
    t(obj, val, {
      field,
      schema
    }) {
      obj.set("t", bakedInputRuntime(schema, field.type, val));
    }
  },
  UpdateAlwaysAsIdentityByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    alwaysAsIdentityPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UpdateByDefaultAsIdentityPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    byDefaultAsIdentity($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    byDefaultAsIdentityEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = by_default_as_identityUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return pgResource_by_default_as_identityPgResource.find(spec);
        }
      })();
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    }
  },
  UpdateByDefaultAsIdentityInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    byDefaultAsIdentityPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  ByDefaultAsIdentityPatch: {
    __baked: createObjectAndApplyChildren,
    id(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    t(obj, val, {
      field,
      schema
    }) {
      obj.set("t", bakedInputRuntime(schema, field.type, val));
    }
  },
  UpdateByDefaultAsIdentityByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    byDefaultAsIdentityPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UpdateNetworkPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    network($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    networkEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = networkUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return pgResource_networkPgResource.find(spec);
        }
      })();
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    }
  },
  UpdateNetworkInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    networkPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  NetworkPatch: {
    __baked: createObjectAndApplyChildren,
    id(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    inet(obj, val, {
      field,
      schema
    }) {
      obj.set("inet", bakedInputRuntime(schema, field.type, val));
    },
    cidr(obj, val, {
      field,
      schema
    }) {
      obj.set("cidr", bakedInputRuntime(schema, field.type, val));
    },
    macaddr(obj, val, {
      field,
      schema
    }) {
      obj.set("macaddr", bakedInputRuntime(schema, field.type, val));
    },
    macaddr8(obj, val, {
      field,
      schema
    }) {
      obj.set("macaddr8", bakedInputRuntime(schema, field.type, val));
    }
  },
  UpdateNetworkByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    networkPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UpdateTypePayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    type($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    typeEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = typesUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return pgResource_typesPgResource.find(spec);
        }
      })();
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    }
  },
  UpdateTypeInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    typePatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  TypePatch: {
    __baked: createObjectAndApplyChildren,
    id(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    regrole(obj, val, {
      field,
      schema
    }) {
      obj.set("regrole", bakedInputRuntime(schema, field.type, val));
    },
    regnamespace(obj, val, {
      field,
      schema
    }) {
      obj.set("regnamespace", bakedInputRuntime(schema, field.type, val));
    },
    bigintDomainArrayDomain(obj, val, {
      field,
      schema
    }) {
      obj.set("bigint_domain_array_domain", bakedInputRuntime(schema, field.type, val));
    },
    domainConstrainedCompoundType(obj, val, {
      field,
      schema
    }) {
      obj.set("domain_constrained_compound_type", bakedInputRuntime(schema, field.type, val));
    }
  },
  UpdateTypeByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    typePatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  DeleteAlwaysAsIdentityPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    alwaysAsIdentity($object) {
      return $object.get("result");
    },
    deletedAlwaysAsIdentityId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.AlwaysAsIdentity.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    alwaysAsIdentityEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = always_as_identityUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return pgResource_always_as_identityPgResource.find(spec);
        }
      })();
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    }
  },
  DeleteAlwaysAsIdentityInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteAlwaysAsIdentityByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteByDefaultAsIdentityPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    byDefaultAsIdentity($object) {
      return $object.get("result");
    },
    deletedByDefaultAsIdentityId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.ByDefaultAsIdentity.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    byDefaultAsIdentityEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = by_default_as_identityUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return pgResource_by_default_as_identityPgResource.find(spec);
        }
      })();
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    }
  },
  DeleteByDefaultAsIdentityInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteByDefaultAsIdentityByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteNetworkPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    network($object) {
      return $object.get("result");
    },
    deletedNetworkId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.Network.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    networkEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = networkUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return pgResource_networkPgResource.find(spec);
        }
      })();
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    }
  },
  DeleteNetworkInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteNetworkByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteTypePayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    type($object) {
      return $object.get("result");
    },
    deletedTypeId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.Type.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    typeEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = typesUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return pgResource_typesPgResource.find(spec);
        }
      })();
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    }
  },
  DeleteTypeInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteTypeByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  }
};
export const schema = makeGrafastSchema({
  typeDefs: typeDefs,
  plans: plans
});
