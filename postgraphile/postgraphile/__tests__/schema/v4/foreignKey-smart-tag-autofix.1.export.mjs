import { PgDeleteSingleStep, PgExecutor, PgResource, PgSelectSingleStep, PgSelectStep, PgUnionAllStep, TYPES, assertPgClassSingleStep, domainOfCodec, enumCodec, listOfCodec, makeRegistry, pgClassExpression, pgDeleteSingle, pgInsertSingle, pgSelectFromRecord, pgSelectFromRecords, pgSelectSingleFromRecord, pgUpdateSingle, rangeOfCodec, recordCodec, sqlFromArgDigests } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ObjectStep, SafeError, __ValueStep, access, assertEdgeCapableStep, assertExecutableStep, assertPageInfoCapableStep, connection, constant, context, first, getEnumValueConfig, inhibitOnNull, lambda, list, makeGrafastSchema, node, object, rootValue, specFromNodeId, stepAMayDependOnStepB } from "grafast";
import { GraphQLError, GraphQLInt, GraphQLString, Kind, valueFromASTUntyped } from "graphql";
import { sql } from "pg-sql2";
import { inspect } from "util";
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
const nodeIdCodecs = Object.assign(Object.create(null), {
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
});
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
const registryConfig_pgCodecs_FuncOutOutRecord_FuncOutOutRecord = recordCodec({
  name: "FuncOutOutRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: Object.assign(Object.create(null), {
    first_out: {
      notNull: false,
      codec: TYPES.int,
      extensions: {
        argIndex: 0,
        argName: "first_out"
      }
    },
    second_out: {
      notNull: false,
      codec: TYPES.text,
      extensions: {
        argIndex: 1,
        argName: "second_out"
      }
    }
  }),
  description: undefined,
  extensions: {
    /* `The return type of our \`${name}\` ${
      pgProc.provolatile === "v" ? "mutation" : "query"
    }.`, */
  },
  executor,
  isAnonymous: true
});
const registryConfig_pgCodecs_FuncOutOutSetofRecord_FuncOutOutSetofRecord = recordCodec({
  name: "FuncOutOutSetofRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: Object.assign(Object.create(null), {
    o1: {
      notNull: false,
      codec: TYPES.int,
      extensions: {
        argIndex: 0,
        argName: "o1"
      }
    },
    o2: {
      notNull: false,
      codec: TYPES.text,
      extensions: {
        argIndex: 1,
        argName: "o2"
      }
    }
  }),
  description: undefined,
  extensions: {
    /* `The return type of our \`${name}\` ${
      pgProc.provolatile === "v" ? "mutation" : "query"
    }.`, */
  },
  executor,
  isAnonymous: true
});
const registryConfig_pgCodecs_FuncOutOutUnnamedRecord_FuncOutOutUnnamedRecord = recordCodec({
  name: "FuncOutOutUnnamedRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: Object.assign(Object.create(null), {
    column1: {
      notNull: false,
      codec: TYPES.int,
      extensions: {
        argIndex: 0,
        argName: undefined
      }
    },
    column2: {
      notNull: false,
      codec: TYPES.text,
      extensions: {
        argIndex: 1,
        argName: undefined
      }
    }
  }),
  description: undefined,
  extensions: {
    /* `The return type of our \`${name}\` ${
      pgProc.provolatile === "v" ? "mutation" : "query"
    }.`, */
  },
  executor,
  isAnonymous: true
});
const registryConfig_pgCodecs_MutationOutOutRecord_MutationOutOutRecord = recordCodec({
  name: "MutationOutOutRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: Object.assign(Object.create(null), {
    first_out: {
      notNull: false,
      codec: TYPES.int,
      extensions: {
        argIndex: 0,
        argName: "first_out"
      }
    },
    second_out: {
      notNull: false,
      codec: TYPES.text,
      extensions: {
        argIndex: 1,
        argName: "second_out"
      }
    }
  }),
  description: undefined,
  extensions: {
    /* `The return type of our \`${name}\` ${
      pgProc.provolatile === "v" ? "mutation" : "query"
    }.`, */
  },
  executor,
  isAnonymous: true
});
const registryConfig_pgCodecs_MutationOutOutSetofRecord_MutationOutOutSetofRecord = recordCodec({
  name: "MutationOutOutSetofRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: Object.assign(Object.create(null), {
    o1: {
      notNull: false,
      codec: TYPES.int,
      extensions: {
        argIndex: 0,
        argName: "o1"
      }
    },
    o2: {
      notNull: false,
      codec: TYPES.text,
      extensions: {
        argIndex: 1,
        argName: "o2"
      }
    }
  }),
  description: undefined,
  extensions: {
    /* `The return type of our \`${name}\` ${
      pgProc.provolatile === "v" ? "mutation" : "query"
    }.`, */
  },
  executor,
  isAnonymous: true
});
const registryConfig_pgCodecs_MutationOutOutUnnamedRecord_MutationOutOutUnnamedRecord = recordCodec({
  name: "MutationOutOutUnnamedRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: Object.assign(Object.create(null), {
    column1: {
      notNull: false,
      codec: TYPES.int,
      extensions: {
        argIndex: 0,
        argName: undefined
      }
    },
    column2: {
      notNull: false,
      codec: TYPES.text,
      extensions: {
        argIndex: 1,
        argName: undefined
      }
    }
  }),
  description: undefined,
  extensions: {
    /* `The return type of our \`${name}\` ${
      pgProc.provolatile === "v" ? "mutation" : "query"
    }.`, */
  },
  executor,
  isAnonymous: true
});
const registryConfig_pgCodecs_FuncOutUnnamedOutOutUnnamedRecord_FuncOutUnnamedOutOutUnnamedRecord = recordCodec({
  name: "FuncOutUnnamedOutOutUnnamedRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: Object.assign(Object.create(null), {
    column1: {
      notNull: false,
      codec: TYPES.int,
      extensions: {
        argIndex: 0,
        argName: ""
      }
    },
    o2: {
      notNull: false,
      codec: TYPES.text,
      extensions: {
        argIndex: 1,
        argName: "o2"
      }
    },
    column3: {
      notNull: false,
      codec: TYPES.int,
      extensions: {
        argIndex: 2,
        argName: ""
      }
    }
  }),
  description: undefined,
  extensions: {
    /* `The return type of our \`${name}\` ${
      pgProc.provolatile === "v" ? "mutation" : "query"
    }.`, */
  },
  executor,
  isAnonymous: true
});
const registryConfig_pgCodecs_FuncReturnsTableMultiColRecord_FuncReturnsTableMultiColRecord = recordCodec({
  name: "FuncReturnsTableMultiColRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: Object.assign(Object.create(null), {
    col1: {
      notNull: false,
      codec: TYPES.int,
      extensions: {
        argIndex: 1,
        argName: "col1"
      }
    },
    col2: {
      notNull: false,
      codec: TYPES.text,
      extensions: {
        argIndex: 2,
        argName: "col2"
      }
    }
  }),
  description: undefined,
  extensions: {
    /* `The return type of our \`${name}\` ${
      pgProc.provolatile === "v" ? "mutation" : "query"
    }.`, */
  },
  executor,
  isAnonymous: true
});
const registryConfig_pgCodecs_MutationOutUnnamedOutOutUnnamedRecord_MutationOutUnnamedOutOutUnnamedRecord = recordCodec({
  name: "MutationOutUnnamedOutOutUnnamedRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: Object.assign(Object.create(null), {
    column1: {
      notNull: false,
      codec: TYPES.int,
      extensions: {
        argIndex: 0,
        argName: ""
      }
    },
    o2: {
      notNull: false,
      codec: TYPES.text,
      extensions: {
        argIndex: 1,
        argName: "o2"
      }
    },
    column3: {
      notNull: false,
      codec: TYPES.int,
      extensions: {
        argIndex: 2,
        argName: ""
      }
    }
  }),
  description: undefined,
  extensions: {
    /* `The return type of our \`${name}\` ${
      pgProc.provolatile === "v" ? "mutation" : "query"
    }.`, */
  },
  executor,
  isAnonymous: true
});
const registryConfig_pgCodecs_MutationReturnsTableMultiColRecord_MutationReturnsTableMultiColRecord = recordCodec({
  name: "MutationReturnsTableMultiColRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: Object.assign(Object.create(null), {
    col1: {
      notNull: false,
      codec: TYPES.int,
      extensions: {
        argIndex: 1,
        argName: "col1"
      }
    },
    col2: {
      notNull: false,
      codec: TYPES.text,
      extensions: {
        argIndex: 2,
        argName: "col2"
      }
    }
  }),
  description: undefined,
  extensions: {
    /* `The return type of our \`${name}\` ${
      pgProc.provolatile === "v" ? "mutation" : "query"
    }.`, */
  },
  executor,
  isAnonymous: true
});
const registryConfig_pgCodecs_SearchTestSummariesRecord_SearchTestSummariesRecord = recordCodec({
  name: "SearchTestSummariesRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: Object.assign(Object.create(null), {
    id: {
      notNull: false,
      codec: TYPES.int,
      extensions: {
        argIndex: 0,
        argName: "id"
      }
    },
    total_duration: {
      notNull: false,
      codec: TYPES.interval,
      extensions: {
        argIndex: 1,
        argName: "total_duration"
      }
    }
  }),
  description: undefined,
  extensions: {
    /* `The return type of our \`${name}\` ${
      pgProc.provolatile === "v" ? "mutation" : "query"
    }.`, */
  },
  executor,
  isAnonymous: true
});
const myTableIdentifier = sql.identifier("c", "my_table");
const spec_myTable = {
  name: "myTable",
  identifier: myTableIdentifier,
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {}
      }
    },
    json_data: {
      description: undefined,
      codec: TYPES.jsonb,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "my_table"
    },
    tags: Object.create(null)
  },
  executor: executor
};
const myTableCodec = recordCodec(spec_myTable);
const personSecretIdentifier = sql.identifier("c", "person_secret");
const spec_personSecret = {
  name: "personSecret",
  identifier: personSecretIdentifier,
  attributes: Object.assign(Object.create(null), {
    person_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    sekrit: {
      description: "A secret held by the associated Person",
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {
          name: "secret"
        }
      }
    }
  }),
  description: "Tracks the person's secret",
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "person_secret"
    },
    tags: Object.assign(Object.create(null), {
      foreignKey: "(sekrit) references c.person (about)",
      deprecated: "This is deprecated (comment on table c.person_secret)."
    })
  },
  executor: executor
};
const personSecretCodec = recordCodec(spec_personSecret);
const unloggedIdentifier = sql.identifier("c", "unlogged");
const unloggedCodec = recordCodec({
  name: "unlogged",
  identifier: unloggedIdentifier,
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {}
      }
    },
    nonsense: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "unlogged",
      persistence: "u"
    },
    tags: Object.create(null)
  },
  executor: executor
});
const compoundKeyIdentifier = sql.identifier("c", "compound_key");
const spec_compoundKey = {
  name: "compoundKey",
  identifier: compoundKeyIdentifier,
  attributes: Object.assign(Object.create(null), {
    person_id_2: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    person_id_1: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    extra: {
      description: undefined,
      codec: TYPES.boolean,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "compound_key"
    },
    tags: Object.create(null)
  },
  executor: executor
};
const compoundKeyCodec = recordCodec(spec_compoundKey);
const nullTestRecordIdentifier = sql.identifier("c", "null_test_record");
const spec_nullTestRecord = {
  name: "nullTestRecord",
  identifier: nullTestRecordIdentifier,
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {}
      }
    },
    nullable_text: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    nullable_int: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    non_null_text: {
      description: undefined,
      codec: TYPES.text,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "null_test_record"
    },
    tags: Object.create(null)
  },
  executor: executor
};
const nullTestRecordCodec = recordCodec(spec_nullTestRecord);
const edgeCaseIdentifier = sql.identifier("c", "edge_case");
const spec_edgeCase = {
  name: "edgeCase",
  identifier: edgeCaseIdentifier,
  attributes: Object.assign(Object.create(null), {
    not_null_has_default: {
      description: undefined,
      codec: TYPES.boolean,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {}
      }
    },
    wont_cast_easy: {
      description: undefined,
      codec: TYPES.int2,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    row_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "edge_case"
    },
    tags: Object.create(null)
  },
  executor: executor
};
const edgeCaseCodec = recordCodec(spec_edgeCase);
const leftArmIdentifier = sql.identifier("c", "left_arm");
const spec_leftArm = {
  name: "leftArm",
  identifier: leftArmIdentifier,
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {}
      }
    },
    person_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: true,
      extensions: {
        tags: {}
      }
    },
    length_in_metres: {
      description: undefined,
      codec: TYPES.float,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    mood: {
      description: undefined,
      codec: TYPES.text,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {}
      }
    }
  }),
  description: "Tracks metadata about the left arms of various people",
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "left_arm"
    },
    tags: Object.create(null)
  },
  executor: executor
};
const leftArmCodec = recordCodec(spec_leftArm);
const issue756Identifier = sql.identifier("c", "issue756");
const notNullTimestampCodec = domainOfCodec(TYPES.timestamptz, "notNullTimestamp", sql.identifier("c", "not_null_timestamp"), {
  description: undefined,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "not_null_timestamp"
    },
    tags: Object.create(null)
  },
  notNull: true
});
const spec_issue756 = {
  name: "issue756",
  identifier: issue756Identifier,
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {}
      }
    },
    ts: {
      description: undefined,
      codec: notNullTimestampCodec,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {}
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "issue756"
    },
    tags: Object.create(null)
  },
  executor: executor
};
const issue756Codec = recordCodec(spec_issue756);
const compoundTypeIdentifier = sql.identifier("c", "compound_type");
const colorCodec = enumCodec({
  name: "color",
  identifier: sql.identifier("b", "color"),
  values: ["red", "green", "blue"],
  description: undefined,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "color"
    },
    tags: Object.create(null)
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
    tags: Object.create(null)
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
    tags: Object.create(null)
  }
});
const compoundTypeCodec = recordCodec({
  name: "compoundType",
  identifier: compoundTypeIdentifier,
  attributes: Object.assign(Object.create(null), {
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
  }),
  description: "Awesome feature!",
  extensions: {
    isTableLike: false,
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "compound_type"
    },
    tags: Object.create(null)
  },
  executor: executor
});
const registryConfig_pgCodecs_FuncOutOutCompoundTypeRecord_FuncOutOutCompoundTypeRecord = recordCodec({
  name: "FuncOutOutCompoundTypeRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: Object.assign(Object.create(null), {
    o1: {
      notNull: false,
      codec: TYPES.int,
      extensions: {
        argIndex: 1,
        argName: "o1"
      }
    },
    o2: {
      notNull: false,
      codec: compoundTypeCodec,
      extensions: {
        argIndex: 2,
        argName: "o2"
      }
    }
  }),
  description: undefined,
  extensions: {
    /* `The return type of our \`${name}\` ${
      pgProc.provolatile === "v" ? "mutation" : "query"
    }.`, */
  },
  executor,
  isAnonymous: true
});
const registryConfig_pgCodecs_MutationOutOutCompoundTypeRecord_MutationOutOutCompoundTypeRecord = recordCodec({
  name: "MutationOutOutCompoundTypeRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: Object.assign(Object.create(null), {
    o1: {
      notNull: false,
      codec: TYPES.int,
      extensions: {
        argIndex: 1,
        argName: "o1"
      }
    },
    o2: {
      notNull: false,
      codec: compoundTypeCodec,
      extensions: {
        argIndex: 2,
        argName: "o2"
      }
    }
  }),
  description: undefined,
  extensions: {
    /* `The return type of our \`${name}\` ${
      pgProc.provolatile === "v" ? "mutation" : "query"
    }.`, */
  },
  executor,
  isAnonymous: true
});
const anEnumCodec = enumCodec({
  name: "anEnum",
  identifier: sql.identifier("a", "an_enum"),
  values: ["awaiting", "rejected", "published", "*", "**", "***", "foo*", "foo*_", "_foo*", "*bar", "*bar_", "_*bar_", "*baz*", "_*baz*_", "%", ">=", "~~", "$"],
  description: undefined,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "an_enum"
    },
    tags: Object.create(null)
  }
});
const anEnumArrayCodec = listOfCodec(anEnumCodec, {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "_an_enum"
    },
    tags: Object.create(null)
  },
  typeDelim: ",",
  description: undefined,
  name: "anEnumArray"
});
const comptypeCodec = recordCodec({
  name: "comptype",
  identifier: sql.identifier("a", "comptype"),
  attributes: Object.assign(Object.create(null), {
    schedule: {
      description: undefined,
      codec: TYPES.timestamptz,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    is_optimised: {
      description: undefined,
      codec: TYPES.boolean,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: false,
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "comptype"
    },
    tags: Object.create(null)
  },
  executor: executor
});
const comptypeArrayCodec = listOfCodec(comptypeCodec, {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "_comptype"
    },
    tags: Object.create(null)
  },
  typeDelim: ",",
  description: undefined,
  name: "comptypeArray"
});
const postCodec = recordCodec({
  name: "post",
  identifier: sql.identifier("a", "post"),
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {}
      }
    },
    headline: {
      description: undefined,
      codec: TYPES.text,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    body: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    author_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: true,
      extensions: {
        tags: {}
      }
    },
    enums: {
      description: undefined,
      codec: anEnumArrayCodec,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    comptypes: {
      description: undefined,
      codec: comptypeArrayCodec,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "post"
    },
    tags: Object.create(null)
  },
  executor: executor
});
const registryConfig_pgCodecs_QueryOutputTwoRowsRecord_QueryOutputTwoRowsRecord = recordCodec({
  name: "QueryOutputTwoRowsRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: Object.assign(Object.create(null), {
    txt: {
      notNull: false,
      codec: TYPES.text,
      extensions: {
        argIndex: 2,
        argName: "txt"
      }
    },
    left_arm: {
      notNull: false,
      codec: leftArmCodec,
      extensions: {
        argIndex: 3,
        argName: "left_arm"
      }
    },
    post: {
      notNull: false,
      codec: postCodec,
      extensions: {
        argIndex: 4,
        argName: "post"
      }
    }
  }),
  description: undefined,
  extensions: {
    /* `The return type of our \`${name}\` ${
      pgProc.provolatile === "v" ? "mutation" : "query"
    }.`, */
  },
  executor,
  isAnonymous: true
});
const registryConfig_pgCodecs_PersonComputedOutOutRecord_PersonComputedOutOutRecord = recordCodec({
  name: "PersonComputedOutOutRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: Object.assign(Object.create(null), {
    o1: {
      notNull: false,
      codec: TYPES.text,
      extensions: {
        argIndex: 1,
        argName: "o1"
      }
    },
    o2: {
      notNull: false,
      codec: TYPES.text,
      extensions: {
        argIndex: 2,
        argName: "o2"
      }
    }
  }),
  description: undefined,
  extensions: {
    /* `The return type of our \`${name}\` ${
      pgProc.provolatile === "v" ? "mutation" : "query"
    }.`, */
  },
  executor,
  isAnonymous: true
});
const registryConfig_pgCodecs_PersonComputedInoutOutRecord_PersonComputedInoutOutRecord = recordCodec({
  name: "PersonComputedInoutOutRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: Object.assign(Object.create(null), {
    ino: {
      notNull: false,
      codec: TYPES.text,
      extensions: {
        argIndex: 1,
        argName: "ino"
      }
    },
    o: {
      notNull: false,
      codec: TYPES.text,
      extensions: {
        argIndex: 2,
        argName: "o"
      }
    }
  }),
  description: undefined,
  extensions: {
    /* `The return type of our \`${name}\` ${
      pgProc.provolatile === "v" ? "mutation" : "query"
    }.`, */
  },
  executor,
  isAnonymous: true
});
const personIdentifier = sql.identifier("c", "person");
const textArrayCodec = listOfCodec(TYPES.text, {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "pg_catalog",
      name: "_text"
    },
    tags: Object.create(null)
  },
  typeDelim: ",",
  description: undefined,
  name: "textArray"
});
const emailCodec = domainOfCodec(TYPES.text, "email", sql.identifier("b", "email"), {
  description: undefined,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "email"
    },
    tags: Object.create(null)
  },
  notNull: false
});
const notNullUrlCodec = domainOfCodec(TYPES.varchar, "notNullUrl", sql.identifier("b", "not_null_url"), {
  description: undefined,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "not_null_url"
    },
    tags: Object.create(null)
  },
  notNull: true
});
const wrappedUrlCodec = recordCodec({
  name: "wrappedUrl",
  identifier: sql.identifier("b", "wrapped_url"),
  attributes: Object.assign(Object.create(null), {
    url: {
      description: undefined,
      codec: notNullUrlCodec,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: false,
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "wrapped_url"
    },
    tags: Object.create(null)
  },
  executor: executor
});
const spec_person = {
  name: "person",
  identifier: personIdentifier,
  attributes: Object.assign(Object.create(null), {
    id: {
      description: "The primary unique identifier for the person",
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {}
      }
    },
    person_full_name: {
      description: "The person\u2019s name",
      codec: TYPES.varchar,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {
          name: "name"
        }
      }
    },
    aliases: {
      description: undefined,
      codec: textArrayCodec,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {}
      }
    },
    about: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    email: {
      description: undefined,
      codec: emailCodec,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    site: {
      description: undefined,
      codec: wrappedUrlCodec,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {
          deprecated: "Don\u2019t use me"
        }
      }
    },
    config: {
      description: undefined,
      codec: TYPES.hstore,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    last_login_from_ip: {
      description: undefined,
      codec: TYPES.inet,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    last_login_from_subnet: {
      description: undefined,
      codec: TYPES.cidr,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    user_mac: {
      description: undefined,
      codec: TYPES.macaddr,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    created_at: {
      description: undefined,
      codec: TYPES.timestamp,
      notNull: false,
      hasDefault: true,
      extensions: {
        tags: {}
      }
    }
  }),
  description: "Person test comment",
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "person"
    },
    tags: Object.create(null)
  },
  executor: executor
};
const personCodec = recordCodec(spec_person);
const registryConfig_pgCodecs_PersonComputedFirstArgInoutOutRecord_PersonComputedFirstArgInoutOutRecord = recordCodec({
  name: "PersonComputedFirstArgInoutOutRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: Object.assign(Object.create(null), {
    person: {
      notNull: false,
      codec: personCodec,
      extensions: {
        argIndex: 0,
        argName: "person"
      }
    },
    o: {
      notNull: false,
      codec: TYPES.int,
      extensions: {
        argIndex: 1,
        argName: "o"
      }
    }
  }),
  description: undefined,
  extensions: {
    /* `The return type of our \`${name}\` ${
      pgProc.provolatile === "v" ? "mutation" : "query"
    }.`, */
  },
  executor,
  isAnonymous: true
});
const registryConfig_pgCodecs_FuncOutComplexRecord_FuncOutComplexRecord = recordCodec({
  name: "FuncOutComplexRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: Object.assign(Object.create(null), {
    x: {
      notNull: false,
      codec: TYPES.int,
      extensions: {
        argIndex: 2,
        argName: "x"
      }
    },
    y: {
      notNull: false,
      codec: compoundTypeCodec,
      extensions: {
        argIndex: 3,
        argName: "y"
      }
    },
    z: {
      notNull: false,
      codec: personCodec,
      extensions: {
        argIndex: 4,
        argName: "z"
      }
    }
  }),
  description: undefined,
  extensions: {
    /* `The return type of our \`${name}\` ${
      pgProc.provolatile === "v" ? "mutation" : "query"
    }.`, */
  },
  executor,
  isAnonymous: true
});
const registryConfig_pgCodecs_FuncOutComplexSetofRecord_FuncOutComplexSetofRecord = recordCodec({
  name: "FuncOutComplexSetofRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: Object.assign(Object.create(null), {
    x: {
      notNull: false,
      codec: TYPES.int,
      extensions: {
        argIndex: 2,
        argName: "x"
      }
    },
    y: {
      notNull: false,
      codec: compoundTypeCodec,
      extensions: {
        argIndex: 3,
        argName: "y"
      }
    },
    z: {
      notNull: false,
      codec: personCodec,
      extensions: {
        argIndex: 4,
        argName: "z"
      }
    }
  }),
  description: undefined,
  extensions: {
    /* `The return type of our \`${name}\` ${
      pgProc.provolatile === "v" ? "mutation" : "query"
    }.`, */
  },
  executor,
  isAnonymous: true
});
const registryConfig_pgCodecs_MutationOutComplexRecord_MutationOutComplexRecord = recordCodec({
  name: "MutationOutComplexRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: Object.assign(Object.create(null), {
    x: {
      notNull: false,
      codec: TYPES.int,
      extensions: {
        argIndex: 2,
        argName: "x"
      }
    },
    y: {
      notNull: false,
      codec: compoundTypeCodec,
      extensions: {
        argIndex: 3,
        argName: "y"
      }
    },
    z: {
      notNull: false,
      codec: personCodec,
      extensions: {
        argIndex: 4,
        argName: "z"
      }
    }
  }),
  description: undefined,
  extensions: {
    /* `The return type of our \`${name}\` ${
      pgProc.provolatile === "v" ? "mutation" : "query"
    }.`, */
  },
  executor,
  isAnonymous: true
});
const registryConfig_pgCodecs_MutationOutComplexSetofRecord_MutationOutComplexSetofRecord = recordCodec({
  name: "MutationOutComplexSetofRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: Object.assign(Object.create(null), {
    x: {
      notNull: false,
      codec: TYPES.int,
      extensions: {
        argIndex: 2,
        argName: "x"
      }
    },
    y: {
      notNull: false,
      codec: compoundTypeCodec,
      extensions: {
        argIndex: 3,
        argName: "y"
      }
    },
    z: {
      notNull: false,
      codec: personCodec,
      extensions: {
        argIndex: 4,
        argName: "z"
      }
    }
  }),
  description: undefined,
  extensions: {
    /* `The return type of our \`${name}\` ${
      pgProc.provolatile === "v" ? "mutation" : "query"
    }.`, */
  },
  executor,
  isAnonymous: true
});
const registryConfig_pgCodecs_PersonComputedComplexRecord_PersonComputedComplexRecord = recordCodec({
  name: "PersonComputedComplexRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: Object.assign(Object.create(null), {
    x: {
      notNull: false,
      codec: TYPES.int,
      extensions: {
        argIndex: 3,
        argName: "x"
      }
    },
    y: {
      notNull: false,
      codec: compoundTypeCodec,
      extensions: {
        argIndex: 4,
        argName: "y"
      }
    },
    z: {
      notNull: false,
      codec: personCodec,
      extensions: {
        argIndex: 5,
        argName: "z"
      }
    }
  }),
  description: undefined,
  extensions: {
    /* `The return type of our \`${name}\` ${
      pgProc.provolatile === "v" ? "mutation" : "query"
    }.`, */
  },
  executor,
  isAnonymous: true
});
const colorArrayCodec = listOfCodec(colorCodec, {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "_color"
    },
    tags: Object.create(null)
  },
  typeDelim: ",",
  description: undefined,
  name: "colorArray"
});
const anIntCodec = domainOfCodec(TYPES.int, "anInt", sql.identifier("a", "an_int"), {
  description: undefined,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "an_int"
    },
    tags: Object.create(null)
  },
  notNull: false
});
const anotherIntCodec = domainOfCodec(anIntCodec, "anotherInt", sql.identifier("b", "another_int"), {
  description: undefined,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "another_int"
    },
    tags: Object.create(null)
  },
  notNull: false
});
const numrangeCodec = rangeOfCodec(TYPES.numeric, "numrange", sql.identifier("pg_catalog", "numrange"), {
  description: "range of numerics",
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "pg_catalog",
      name: "numrange"
    },
    tags: Object.create(null)
  }
});
const daterangeCodec = rangeOfCodec(TYPES.date, "daterange", sql.identifier("pg_catalog", "daterange"), {
  description: "range of dates",
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "pg_catalog",
      name: "daterange"
    },
    tags: Object.create(null)
  }
});
const anIntRangeCodec = rangeOfCodec(anIntCodec, "anIntRange", sql.identifier("a", "an_int_range"), {
  description: undefined,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "an_int_range"
    },
    tags: Object.create(null)
  }
});
const intervalArrayCodec = listOfCodec(TYPES.interval, {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "pg_catalog",
      name: "_interval"
    },
    tags: Object.create(null)
  },
  typeDelim: ",",
  description: undefined,
  name: "intervalArray"
});
const nestedCompoundTypeCodec = recordCodec({
  name: "nestedCompoundType",
  identifier: sql.identifier("b", "nested_compound_type"),
  attributes: Object.assign(Object.create(null), {
    a: {
      description: undefined,
      codec: compoundTypeCodec,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    b: {
      description: undefined,
      codec: compoundTypeCodec,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    baz_buz: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: false,
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "nested_compound_type"
    },
    tags: Object.create(null)
  },
  executor: executor
});
const textArrayDomainCodec = domainOfCodec(textArrayCodec, "textArrayDomain", sql.identifier("c", "text_array_domain"), {
  description: undefined,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "text_array_domain"
    },
    tags: Object.create(null)
  },
  notNull: false
});
const int8ArrayCodec = listOfCodec(TYPES.bigint, {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "pg_catalog",
      name: "_int8"
    },
    tags: Object.create(null)
  },
  typeDelim: ",",
  description: undefined,
  name: "int8Array"
});
const int8ArrayDomainCodec = domainOfCodec(int8ArrayCodec, "int8ArrayDomain", sql.identifier("c", "int8_array_domain"), {
  description: undefined,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "int8_array_domain"
    },
    tags: Object.create(null)
  },
  notNull: false
});
const byteaArrayCodec = listOfCodec(TYPES.bytea, {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "pg_catalog",
      name: "_bytea"
    },
    tags: Object.create(null)
  },
  typeDelim: ",",
  description: undefined,
  name: "byteaArray"
});
const spec_types_attributes_ltree_codec_ltree = {
  name: "ltree",
  sqlType: sql`ltree`,
  toPg(str) {
    return str;
  },
  fromPg(str) {
    return str;
  },
  executor: null,
  attributes: undefined
};
const spec_types_attributes_ltree_array_codec_ltree_ = listOfCodec(spec_types_attributes_ltree_codec_ltree);
const typesCodec = recordCodec({
  name: "types",
  identifier: sql.identifier("b", "types"),
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {}
      }
    },
    smallint: {
      description: undefined,
      codec: TYPES.int2,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    bigint: {
      description: undefined,
      codec: TYPES.bigint,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    numeric: {
      description: undefined,
      codec: TYPES.numeric,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    decimal: {
      description: undefined,
      codec: TYPES.numeric,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    boolean: {
      description: undefined,
      codec: TYPES.boolean,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    varchar: {
      description: undefined,
      codec: TYPES.varchar,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    enum: {
      description: undefined,
      codec: colorCodec,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    enum_array: {
      description: undefined,
      codec: colorArrayCodec,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    domain: {
      description: undefined,
      codec: anIntCodec,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    domain2: {
      description: undefined,
      codec: anotherIntCodec,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    text_array: {
      description: undefined,
      codec: textArrayCodec,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    json: {
      description: undefined,
      codec: TYPES.json,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    jsonb: {
      description: undefined,
      codec: TYPES.jsonb,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    nullable_range: {
      description: undefined,
      codec: numrangeCodec,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    numrange: {
      description: undefined,
      codec: numrangeCodec,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    daterange: {
      description: undefined,
      codec: daterangeCodec,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    an_int_range: {
      description: undefined,
      codec: anIntRangeCodec,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    timestamp: {
      description: undefined,
      codec: TYPES.timestamp,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    timestamptz: {
      description: undefined,
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    date: {
      description: undefined,
      codec: TYPES.date,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    time: {
      description: undefined,
      codec: TYPES.time,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    timetz: {
      description: undefined,
      codec: TYPES.timetz,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    interval: {
      description: undefined,
      codec: TYPES.interval,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    interval_array: {
      description: undefined,
      codec: intervalArrayCodec,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    money: {
      description: undefined,
      codec: TYPES.money,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    compound_type: {
      description: undefined,
      codec: compoundTypeCodec,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    nested_compound_type: {
      description: undefined,
      codec: nestedCompoundTypeCodec,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    nullable_compound_type: {
      description: undefined,
      codec: compoundTypeCodec,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    nullable_nested_compound_type: {
      description: undefined,
      codec: nestedCompoundTypeCodec,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    point: {
      description: undefined,
      codec: TYPES.point,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    nullablePoint: {
      description: undefined,
      codec: TYPES.point,
      notNull: false,
      hasDefault: false,
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
    regproc: {
      description: undefined,
      codec: TYPES.regproc,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    regprocedure: {
      description: undefined,
      codec: TYPES.regprocedure,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    regoper: {
      description: undefined,
      codec: TYPES.regoper,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    regoperator: {
      description: undefined,
      codec: TYPES.regoperator,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    regclass: {
      description: undefined,
      codec: TYPES.regclass,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    regtype: {
      description: undefined,
      codec: TYPES.regtype,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    regconfig: {
      description: undefined,
      codec: TYPES.regconfig,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    regdictionary: {
      description: undefined,
      codec: TYPES.regdictionary,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    text_array_domain: {
      description: undefined,
      codec: textArrayDomainCodec,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    int8_array_domain: {
      description: undefined,
      codec: int8ArrayDomainCodec,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    bytea: {
      description: undefined,
      codec: TYPES.bytea,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    bytea_array: {
      description: undefined,
      codec: byteaArrayCodec,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    ltree: {
      description: undefined,
      codec: spec_types_attributes_ltree_codec_ltree,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    ltree_array: {
      description: undefined,
      codec: spec_types_attributes_ltree_array_codec_ltree_,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "types"
    },
    tags: Object.assign(Object.create(null), {
      foreignKey: ["(smallint) references a.post", "(id) references a.post"]
    })
  },
  executor: executor
});
const int4ArrayCodec = listOfCodec(TYPES.int, {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "pg_catalog",
      name: "_int4"
    },
    tags: Object.create(null)
  },
  typeDelim: ",",
  description: undefined,
  name: "int4Array"
});
const floatrangeCodec = rangeOfCodec(TYPES.float, "floatrange", sql.identifier("c", "floatrange"), {
  description: undefined,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "floatrange"
    },
    tags: Object.create(null)
  }
});
const current_user_idFunctionIdentifer = sql.identifier("c", "current_user_id");
const func_outFunctionIdentifer = sql.identifier("c", "func_out");
const func_out_setofFunctionIdentifer = sql.identifier("c", "func_out_setof");
const func_out_unnamedFunctionIdentifer = sql.identifier("c", "func_out_unnamed");
const mutation_outFunctionIdentifer = sql.identifier("c", "mutation_out");
const mutation_out_setofFunctionIdentifer = sql.identifier("c", "mutation_out_setof");
const mutation_out_unnamedFunctionIdentifer = sql.identifier("c", "mutation_out_unnamed");
const no_args_mutationFunctionIdentifer = sql.identifier("c", "no_args_mutation");
const no_args_queryFunctionIdentifer = sql.identifier("c", "no_args_query");
const func_in_outFunctionIdentifer = sql.identifier("c", "func_in_out");
const func_returns_table_one_colFunctionIdentifer = sql.identifier("c", "func_returns_table_one_col");
const mutation_in_outFunctionIdentifer = sql.identifier("c", "mutation_in_out");
const mutation_returns_table_one_colFunctionIdentifer = sql.identifier("c", "mutation_returns_table_one_col");
const json_identityFunctionIdentifer = sql.identifier("c", "json_identity");
const json_identity_mutationFunctionIdentifer = sql.identifier("c", "json_identity_mutation");
const jsonb_identityFunctionIdentifer = sql.identifier("c", "jsonb_identity");
const jsonb_identity_mutationFunctionIdentifer = sql.identifier("c", "jsonb_identity_mutation");
const jsonb_identity_mutation_plpgsqlFunctionIdentifer = sql.identifier("c", "jsonb_identity_mutation_plpgsql");
const jsonb_identity_mutation_plpgsql_with_defaultFunctionIdentifer = sql.identifier("c", "jsonb_identity_mutation_plpgsql_with_default");
const func_in_inoutFunctionIdentifer = sql.identifier("c", "func_in_inout");
const func_out_outFunctionIdentifer = sql.identifier("c", "func_out_out");
const func_out_out_setofFunctionIdentifer = sql.identifier("c", "func_out_out_setof");
const func_out_out_unnamedFunctionIdentifer = sql.identifier("c", "func_out_out_unnamed");
const mutation_in_inoutFunctionIdentifer = sql.identifier("c", "mutation_in_inout");
const mutation_out_outFunctionIdentifer = sql.identifier("c", "mutation_out_out");
const mutation_out_out_setofFunctionIdentifer = sql.identifier("c", "mutation_out_out_setof");
const mutation_out_out_unnamedFunctionIdentifer = sql.identifier("c", "mutation_out_out_unnamed");
const func_out_unnamed_out_out_unnamedFunctionIdentifer = sql.identifier("c", "func_out_unnamed_out_out_unnamed");
const func_returns_table_multi_colFunctionIdentifer = sql.identifier("c", "func_returns_table_multi_col");
const int_set_mutationFunctionIdentifer = sql.identifier("c", "int_set_mutation");
const int_set_queryFunctionIdentifer = sql.identifier("c", "int_set_query");
const mutation_out_unnamed_out_out_unnamedFunctionIdentifer = sql.identifier("c", "mutation_out_unnamed_out_out_unnamed");
const mutation_returns_table_multi_colFunctionIdentifer = sql.identifier("c", "mutation_returns_table_multi_col");
const search_test_summariesFunctionIdentifer = sql.identifier("c", "search_test_summaries");
const my_tableUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const person_secretUniques = [{
  isPrimary: true,
  attributes: ["person_id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_person_secret_person_secret = {
  executor: executor,
  name: "person_secret",
  identifier: "main.c.person_secret",
  from: personSecretIdentifier,
  codec: personSecretCodec,
  uniques: person_secretUniques,
  isVirtual: false,
  description: "Tracks the person's secret",
  extensions: {
    description: "Tracks the person's secret",
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "person_secret"
    },
    tags: {
      foreignKey: "(sekrit) references c.person (about)",
      deprecated: "This is deprecated (comment on table c.person_secret)."
    }
  }
};
const compound_keyUniques = [{
  isPrimary: true,
  attributes: ["person_id_1", "person_id_2"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_compound_key_compound_key = {
  executor: executor,
  name: "compound_key",
  identifier: "main.c.compound_key",
  from: compoundKeyIdentifier,
  codec: compoundKeyCodec,
  uniques: compound_keyUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "compound_key"
    },
    tags: {}
  }
};
const null_test_recordUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const edge_case_computedFunctionIdentifer = sql.identifier("c", "edge_case_computed");
const return_table_without_grantsFunctionIdentifer = sql.identifier("c", "return_table_without_grants");
const left_armUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}, {
  isPrimary: false,
  attributes: ["person_id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_left_arm_left_arm = {
  executor: executor,
  name: "left_arm",
  identifier: "main.c.left_arm",
  from: leftArmIdentifier,
  codec: leftArmCodec,
  uniques: left_armUniques,
  isVirtual: false,
  description: "Tracks metadata about the left arms of various people",
  extensions: {
    description: "Tracks metadata about the left arms of various people",
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "left_arm"
    },
    tags: {}
  }
};
const left_arm_identityFunctionIdentifer = sql.identifier("c", "left_arm_identity");
const issue756Uniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_issue756_issue756 = {
  executor: executor,
  name: "issue756",
  identifier: "main.c.issue756",
  from: issue756Identifier,
  codec: issue756Codec,
  uniques: issue756Uniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "issue756"
    },
    tags: {}
  }
};
const issue756_mutationFunctionIdentifer = sql.identifier("c", "issue756_mutation");
const issue756_set_mutationFunctionIdentifer = sql.identifier("c", "issue756_set_mutation");
const types_mutationFunctionIdentifer = sql.identifier("c", "types_mutation");
const types_queryFunctionIdentifer = sql.identifier("c", "types_query");
const compound_type_computed_fieldFunctionIdentifer = sql.identifier("c", "compound_type_computed_field");
const func_out_out_compound_typeFunctionIdentifer = sql.identifier("c", "func_out_out_compound_type");
const mutation_out_out_compound_typeFunctionIdentifer = sql.identifier("c", "mutation_out_out_compound_type");
const query_output_two_rowsFunctionIdentifer = sql.identifier("c", "query_output_two_rows");
const compound_type_set_queryFunctionIdentifer = sql.identifier("c", "compound_type_set_query");
const table_mutationFunctionIdentifer = sql.identifier("c", "table_mutation");
const table_queryFunctionIdentifer = sql.identifier("c", "table_query");
const person_computed_outFunctionIdentifer = sql.identifier("c", "person_computed_out");
const person_first_nameFunctionIdentifer = sql.identifier("c", "person_first_name");
const person_computed_out_outFunctionIdentifer = sql.identifier("c", "person_computed_out_out");
const person_computed_inoutFunctionIdentifer = sql.identifier("c", "person_computed_inout");
const person_computed_inout_outFunctionIdentifer = sql.identifier("c", "person_computed_inout_out");
const person_existsFunctionIdentifer = sql.identifier("c", "person_exists");
const person_computed_first_arg_inout_outFunctionIdentifer = sql.identifier("c", "person_computed_first_arg_inout_out");
const func_out_complexFunctionIdentifer = sql.identifier("c", "func_out_complex");
const func_out_complex_setofFunctionIdentifer = sql.identifier("c", "func_out_complex_setof");
const mutation_out_complexFunctionIdentifer = sql.identifier("c", "mutation_out_complex");
const mutation_out_complex_setofFunctionIdentifer = sql.identifier("c", "mutation_out_complex_setof");
const person_computed_complexFunctionIdentifer = sql.identifier("c", "person_computed_complex");
const personUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}, {
  isPrimary: false,
  attributes: ["email"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}, {
  isPrimary: false,
  attributes: ["about"],
  description: undefined,
  extensions: {
    tags: Object.assign(Object.create(null), {
      behavior: "-single -update -delete"
    })
  }
}];
const registryConfig_pgResources_person_person = {
  executor: executor,
  name: "person",
  identifier: "main.c.person",
  from: personIdentifier,
  codec: personCodec,
  uniques: personUniques,
  isVirtual: false,
  description: "Person test comment",
  extensions: {
    description: "Person test comment",
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "person"
    },
    tags: {}
  }
};
const person_first_postFunctionIdentifer = sql.identifier("c", "person_first_post");
const badly_behaved_functionFunctionIdentifer = sql.identifier("c", "badly_behaved_function");
const func_out_tableFunctionIdentifer = sql.identifier("c", "func_out_table");
const func_out_table_setofFunctionIdentifer = sql.identifier("c", "func_out_table_setof");
const mutation_out_tableFunctionIdentifer = sql.identifier("c", "mutation_out_table");
const mutation_out_table_setofFunctionIdentifer = sql.identifier("c", "mutation_out_table_setof");
const table_set_mutationFunctionIdentifer = sql.identifier("c", "table_set_mutation");
const table_set_queryFunctionIdentifer = sql.identifier("c", "table_set_query");
const table_set_query_plpgsqlFunctionIdentifer = sql.identifier("c", "table_set_query_plpgsql");
const person_computed_first_arg_inoutFunctionIdentifer = sql.identifier("c", "person_computed_first_arg_inout");
const person_friendsFunctionIdentifer = sql.identifier("c", "person_friends");
const person_type_function_connectionFunctionIdentifer = sql.identifier("c", "person_type_function_connection");
const person_type_functionFunctionIdentifer = sql.identifier("c", "person_type_function");
const person_type_function_listFunctionIdentifer = sql.identifier("c", "person_type_function_list");
const registry = makeRegistry({
  pgExecutors: Object.assign(Object.create(null), {
    main: executor
  }),
  pgCodecs: Object.assign(Object.create(null), {
    int4: TYPES.int,
    json: TYPES.json,
    jsonb: TYPES.jsonb,
    FuncOutOutRecord: registryConfig_pgCodecs_FuncOutOutRecord_FuncOutOutRecord,
    text: TYPES.text,
    FuncOutOutSetofRecord: registryConfig_pgCodecs_FuncOutOutSetofRecord_FuncOutOutSetofRecord,
    FuncOutOutUnnamedRecord: registryConfig_pgCodecs_FuncOutOutUnnamedRecord_FuncOutOutUnnamedRecord,
    MutationOutOutRecord: registryConfig_pgCodecs_MutationOutOutRecord_MutationOutOutRecord,
    MutationOutOutSetofRecord: registryConfig_pgCodecs_MutationOutOutSetofRecord_MutationOutOutSetofRecord,
    MutationOutOutUnnamedRecord: registryConfig_pgCodecs_MutationOutOutUnnamedRecord_MutationOutOutUnnamedRecord,
    FuncOutUnnamedOutOutUnnamedRecord: registryConfig_pgCodecs_FuncOutUnnamedOutOutUnnamedRecord_FuncOutUnnamedOutOutUnnamedRecord,
    FuncReturnsTableMultiColRecord: registryConfig_pgCodecs_FuncReturnsTableMultiColRecord_FuncReturnsTableMultiColRecord,
    MutationOutUnnamedOutOutUnnamedRecord: registryConfig_pgCodecs_MutationOutUnnamedOutOutUnnamedRecord_MutationOutUnnamedOutOutUnnamedRecord,
    MutationReturnsTableMultiColRecord: registryConfig_pgCodecs_MutationReturnsTableMultiColRecord_MutationReturnsTableMultiColRecord,
    SearchTestSummariesRecord: registryConfig_pgCodecs_SearchTestSummariesRecord_SearchTestSummariesRecord,
    interval: TYPES.interval,
    myTable: myTableCodec,
    personSecret: personSecretCodec,
    unlogged: unloggedCodec,
    compoundKey: compoundKeyCodec,
    bool: TYPES.boolean,
    nullTestRecord: nullTestRecordCodec,
    edgeCase: edgeCaseCodec,
    int2: TYPES.int2,
    leftArm: leftArmCodec,
    float8: TYPES.float,
    issue756: issue756Codec,
    notNullTimestamp: notNullTimestampCodec,
    timestamptz: TYPES.timestamptz,
    FuncOutOutCompoundTypeRecord: registryConfig_pgCodecs_FuncOutOutCompoundTypeRecord_FuncOutOutCompoundTypeRecord,
    compoundType: compoundTypeCodec,
    color: colorCodec,
    uuid: TYPES.uuid,
    enumCaps: enumCapsCodec,
    enumWithEmptyString: enumWithEmptyStringCodec,
    MutationOutOutCompoundTypeRecord: registryConfig_pgCodecs_MutationOutOutCompoundTypeRecord_MutationOutOutCompoundTypeRecord,
    QueryOutputTwoRowsRecord: registryConfig_pgCodecs_QueryOutputTwoRowsRecord_QueryOutputTwoRowsRecord,
    post: postCodec,
    anEnumArray: anEnumArrayCodec,
    anEnum: anEnumCodec,
    comptypeArray: comptypeArrayCodec,
    comptype: comptypeCodec,
    PersonComputedOutOutRecord: registryConfig_pgCodecs_PersonComputedOutOutRecord_PersonComputedOutOutRecord,
    PersonComputedInoutOutRecord: registryConfig_pgCodecs_PersonComputedInoutOutRecord_PersonComputedInoutOutRecord,
    PersonComputedFirstArgInoutOutRecord: registryConfig_pgCodecs_PersonComputedFirstArgInoutOutRecord_PersonComputedFirstArgInoutOutRecord,
    person: personCodec,
    varchar: TYPES.varchar,
    textArray: textArrayCodec,
    email: emailCodec,
    wrappedUrl: wrappedUrlCodec,
    notNullUrl: notNullUrlCodec,
    hstore: TYPES.hstore,
    inet: TYPES.inet,
    cidr: TYPES.cidr,
    macaddr: TYPES.macaddr,
    timestamp: TYPES.timestamp,
    FuncOutComplexRecord: registryConfig_pgCodecs_FuncOutComplexRecord_FuncOutComplexRecord,
    FuncOutComplexSetofRecord: registryConfig_pgCodecs_FuncOutComplexSetofRecord_FuncOutComplexSetofRecord,
    MutationOutComplexRecord: registryConfig_pgCodecs_MutationOutComplexRecord_MutationOutComplexRecord,
    MutationOutComplexSetofRecord: registryConfig_pgCodecs_MutationOutComplexSetofRecord_MutationOutComplexSetofRecord,
    PersonComputedComplexRecord: registryConfig_pgCodecs_PersonComputedComplexRecord_PersonComputedComplexRecord,
    types: typesCodec,
    int8: TYPES.bigint,
    numeric: TYPES.numeric,
    colorArray: colorArrayCodec,
    anInt: anIntCodec,
    anotherInt: anotherIntCodec,
    numrange: numrangeCodec,
    daterange: daterangeCodec,
    date: TYPES.date,
    anIntRange: anIntRangeCodec,
    time: TYPES.time,
    timetz: TYPES.timetz,
    intervalArray: intervalArrayCodec,
    money: TYPES.money,
    nestedCompoundType: nestedCompoundTypeCodec,
    point: TYPES.point,
    regproc: TYPES.regproc,
    regprocedure: TYPES.regprocedure,
    regoper: TYPES.regoper,
    regoperator: TYPES.regoperator,
    regclass: TYPES.regclass,
    regtype: TYPES.regtype,
    regconfig: TYPES.regconfig,
    regdictionary: TYPES.regdictionary,
    textArrayDomain: textArrayDomainCodec,
    int8ArrayDomain: int8ArrayDomainCodec,
    bytea: TYPES.bytea,
    byteaArray: byteaArrayCodec,
    ltree: spec_types_attributes_ltree_codec_ltree,
    "ltree[]": spec_types_attributes_ltree_array_codec_ltree_,
    bpchar: TYPES.bpchar,
    typesArray: listOfCodec(typesCodec, {
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "_types"
        },
        tags: Object.create(null)
      },
      typeDelim: ",",
      description: undefined,
      name: "typesArray"
    }),
    int4Array: int4ArrayCodec,
    floatrange: floatrangeCodec,
    int8Array: int8ArrayCodec
  }),
  pgResources: Object.assign(Object.create(null), {
    current_user_id: {
      executor,
      name: "current_user_id",
      identifier: "main.c.current_user_id()",
      from(...args) {
        return sql`${current_user_idFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "current_user_id"
        },
        tags: {
          behavior: ["queryField -mutationField -typeField", "-filter -order"]
        }
      },
      description: undefined
    },
    func_out: {
      executor,
      name: "func_out",
      identifier: "main.c.func_out(int4)",
      from(...args) {
        return sql`${func_outFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_out"
        },
        tags: {
          behavior: ["queryField -mutationField -typeField", "-filter -order"]
        },
        singleOutputParameterName: "o"
      },
      description: undefined
    },
    func_out_setof: {
      executor,
      name: "func_out_setof",
      identifier: "main.c.func_out_setof(int4)",
      from(...args) {
        return sql`${func_out_setofFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      isUnique: !true,
      codec: TYPES.int,
      uniques: [],
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_out_setof"
        },
        tags: {
          behavior: ["queryField -mutationField -typeField", "-filter -order"]
        },
        singleOutputParameterName: "o"
      },
      description: undefined
    },
    func_out_unnamed: {
      executor,
      name: "func_out_unnamed",
      identifier: "main.c.func_out_unnamed(int4)",
      from(...args) {
        return sql`${func_out_unnamedFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_out_unnamed"
        },
        tags: {
          behavior: ["queryField -mutationField -typeField", "-filter -order"]
        }
      },
      description: undefined
    },
    mutation_out: {
      executor,
      name: "mutation_out",
      identifier: "main.c.mutation_out(int4)",
      from(...args) {
        return sql`${mutation_outFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_out"
        },
        tags: {
          behavior: ["-queryField mutationField -typeField", "-filter -order"]
        },
        singleOutputParameterName: "o"
      },
      description: undefined
    },
    mutation_out_setof: {
      executor,
      name: "mutation_out_setof",
      identifier: "main.c.mutation_out_setof(int4)",
      from(...args) {
        return sql`${mutation_out_setofFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      isUnique: !true,
      codec: TYPES.int,
      uniques: [],
      isMutation: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_out_setof"
        },
        tags: {
          behavior: ["-queryField mutationField -typeField", "-filter -order"]
        },
        singleOutputParameterName: "o"
      },
      description: undefined
    },
    mutation_out_unnamed: {
      executor,
      name: "mutation_out_unnamed",
      identifier: "main.c.mutation_out_unnamed(int4)",
      from(...args) {
        return sql`${mutation_out_unnamedFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_out_unnamed"
        },
        tags: {
          behavior: ["-queryField mutationField -typeField", "-filter -order"]
        }
      },
      description: undefined
    },
    no_args_mutation: {
      executor,
      name: "no_args_mutation",
      identifier: "main.c.no_args_mutation()",
      from(...args) {
        return sql`${no_args_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "no_args_mutation"
        },
        tags: {
          behavior: ["-queryField mutationField -typeField", "-filter -order"]
        }
      },
      description: undefined
    },
    no_args_query: {
      executor,
      name: "no_args_query",
      identifier: "main.c.no_args_query()",
      from(...args) {
        return sql`${no_args_queryFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "no_args_query"
        },
        tags: {
          behavior: ["queryField -mutationField -typeField", "-filter -order"]
        }
      },
      description: undefined
    },
    func_in_out: {
      executor,
      name: "func_in_out",
      identifier: "main.c.func_in_out(int4,int4)",
      from(...args) {
        return sql`${func_in_outFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "i",
        required: true,
        notNull: false,
        codec: TYPES.int
      }],
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_in_out"
        },
        tags: {
          behavior: ["queryField -mutationField -typeField", "-filter -order"]
        },
        singleOutputParameterName: "o"
      },
      description: undefined
    },
    func_returns_table_one_col: {
      executor,
      name: "func_returns_table_one_col",
      identifier: "main.c.func_returns_table_one_col(int4,int4)",
      from(...args) {
        return sql`${func_returns_table_one_colFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "i",
        required: true,
        notNull: false,
        codec: TYPES.int
      }],
      isUnique: !true,
      codec: TYPES.int,
      uniques: [],
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_returns_table_one_col"
        },
        tags: {
          behavior: ["queryField -mutationField -typeField", "-filter -order"]
        },
        singleOutputParameterName: "col1"
      },
      description: undefined
    },
    mutation_in_out: {
      executor,
      name: "mutation_in_out",
      identifier: "main.c.mutation_in_out(int4,int4)",
      from(...args) {
        return sql`${mutation_in_outFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "i",
        required: true,
        notNull: false,
        codec: TYPES.int
      }],
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_in_out"
        },
        tags: {
          behavior: ["-queryField mutationField -typeField", "-filter -order"]
        },
        singleOutputParameterName: "o"
      },
      description: undefined
    },
    mutation_returns_table_one_col: {
      executor,
      name: "mutation_returns_table_one_col",
      identifier: "main.c.mutation_returns_table_one_col(int4,int4)",
      from(...args) {
        return sql`${mutation_returns_table_one_colFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "i",
        required: true,
        notNull: false,
        codec: TYPES.int
      }],
      isUnique: !true,
      codec: TYPES.int,
      uniques: [],
      isMutation: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_returns_table_one_col"
        },
        tags: {
          behavior: ["-queryField mutationField -typeField", "-filter -order"]
        },
        singleOutputParameterName: "col1"
      },
      description: undefined
    },
    json_identity: {
      executor,
      name: "json_identity",
      identifier: "main.c.json_identity(json)",
      from(...args) {
        return sql`${json_identityFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "json",
        required: true,
        notNull: false,
        codec: TYPES.json
      }],
      isUnique: !false,
      codec: TYPES.json,
      uniques: [],
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "json_identity"
        },
        tags: {
          behavior: ["queryField -mutationField -typeField", "-filter -order"]
        }
      },
      description: undefined
    },
    json_identity_mutation: {
      executor,
      name: "json_identity_mutation",
      identifier: "main.c.json_identity_mutation(json)",
      from(...args) {
        return sql`${json_identity_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "json",
        required: true,
        notNull: false,
        codec: TYPES.json
      }],
      isUnique: !false,
      codec: TYPES.json,
      uniques: [],
      isMutation: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "json_identity_mutation"
        },
        tags: {
          behavior: ["-queryField mutationField -typeField", "-filter -order"]
        }
      },
      description: undefined
    },
    jsonb_identity: {
      executor,
      name: "jsonb_identity",
      identifier: "main.c.jsonb_identity(jsonb)",
      from(...args) {
        return sql`${jsonb_identityFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "json",
        required: true,
        notNull: false,
        codec: TYPES.jsonb
      }],
      isUnique: !false,
      codec: TYPES.jsonb,
      uniques: [],
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "jsonb_identity"
        },
        tags: {
          behavior: ["queryField -mutationField -typeField", "-filter -order"]
        }
      },
      description: undefined
    },
    jsonb_identity_mutation: {
      executor,
      name: "jsonb_identity_mutation",
      identifier: "main.c.jsonb_identity_mutation(jsonb)",
      from(...args) {
        return sql`${jsonb_identity_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "json",
        required: true,
        notNull: false,
        codec: TYPES.jsonb
      }],
      isUnique: !false,
      codec: TYPES.jsonb,
      uniques: [],
      isMutation: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "jsonb_identity_mutation"
        },
        tags: {
          behavior: ["-queryField mutationField -typeField", "-filter -order"]
        }
      },
      description: undefined
    },
    jsonb_identity_mutation_plpgsql: {
      executor,
      name: "jsonb_identity_mutation_plpgsql",
      identifier: "main.c.jsonb_identity_mutation_plpgsql(jsonb)",
      from(...args) {
        return sql`${jsonb_identity_mutation_plpgsqlFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "_the_json",
        required: true,
        notNull: true,
        codec: TYPES.jsonb
      }],
      isUnique: !false,
      codec: TYPES.jsonb,
      uniques: [],
      isMutation: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "jsonb_identity_mutation_plpgsql"
        },
        tags: {
          behavior: ["-queryField mutationField -typeField", "-filter -order"]
        }
      },
      description: undefined
    },
    jsonb_identity_mutation_plpgsql_with_default: {
      executor,
      name: "jsonb_identity_mutation_plpgsql_with_default",
      identifier: "main.c.jsonb_identity_mutation_plpgsql_with_default(jsonb)",
      from(...args) {
        return sql`${jsonb_identity_mutation_plpgsql_with_defaultFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "_the_json",
        required: false,
        notNull: true,
        codec: TYPES.jsonb
      }],
      isUnique: !false,
      codec: TYPES.jsonb,
      uniques: [],
      isMutation: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "jsonb_identity_mutation_plpgsql_with_default"
        },
        tags: {
          behavior: ["-queryField mutationField -typeField", "-filter -order"]
        }
      },
      description: undefined
    },
    func_in_inout: {
      executor,
      name: "func_in_inout",
      identifier: "main.c.func_in_inout(int4,int4)",
      from(...args) {
        return sql`${func_in_inoutFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "i",
        required: true,
        notNull: false,
        codec: TYPES.int
      }, {
        name: "ino",
        required: true,
        notNull: false,
        codec: TYPES.int
      }],
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_in_inout"
        },
        tags: {
          behavior: ["queryField -mutationField -typeField", "-filter -order"]
        },
        singleOutputParameterName: "ino"
      },
      description: undefined
    },
    func_out_out: {
      executor,
      name: "func_out_out",
      identifier: "main.c.func_out_out(int4,text)",
      from(...args) {
        return sql`${func_out_outFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      isUnique: !false,
      codec: registryConfig_pgCodecs_FuncOutOutRecord_FuncOutOutRecord,
      uniques: [],
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_out_out"
        },
        tags: {
          behavior: ["queryField -mutationField -typeField", "-filter -order"]
        }
      },
      description: undefined
    },
    func_out_out_setof: {
      executor,
      name: "func_out_out_setof",
      identifier: "main.c.func_out_out_setof(int4,text)",
      from(...args) {
        return sql`${func_out_out_setofFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      isUnique: !true,
      codec: registryConfig_pgCodecs_FuncOutOutSetofRecord_FuncOutOutSetofRecord,
      uniques: [],
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_out_out_setof"
        },
        tags: {
          behavior: ["queryField -mutationField -typeField", "-filter -order"]
        }
      },
      description: undefined
    },
    func_out_out_unnamed: {
      executor,
      name: "func_out_out_unnamed",
      identifier: "main.c.func_out_out_unnamed(int4,text)",
      from(...args) {
        return sql`${func_out_out_unnamedFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      isUnique: !false,
      codec: registryConfig_pgCodecs_FuncOutOutUnnamedRecord_FuncOutOutUnnamedRecord,
      uniques: [],
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_out_out_unnamed"
        },
        tags: {
          behavior: ["queryField -mutationField -typeField", "-filter -order"]
        }
      },
      description: undefined
    },
    mutation_in_inout: {
      executor,
      name: "mutation_in_inout",
      identifier: "main.c.mutation_in_inout(int4,int4)",
      from(...args) {
        return sql`${mutation_in_inoutFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "i",
        required: true,
        notNull: false,
        codec: TYPES.int
      }, {
        name: "ino",
        required: true,
        notNull: false,
        codec: TYPES.int
      }],
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_in_inout"
        },
        tags: {
          behavior: ["-queryField mutationField -typeField", "-filter -order"]
        },
        singleOutputParameterName: "ino"
      },
      description: undefined
    },
    mutation_out_out: {
      executor,
      name: "mutation_out_out",
      identifier: "main.c.mutation_out_out(int4,text)",
      from(...args) {
        return sql`${mutation_out_outFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      isUnique: !false,
      codec: registryConfig_pgCodecs_MutationOutOutRecord_MutationOutOutRecord,
      uniques: [],
      isMutation: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_out_out"
        },
        tags: {
          behavior: ["-queryField mutationField -typeField", "-filter -order"]
        }
      },
      description: undefined
    },
    mutation_out_out_setof: {
      executor,
      name: "mutation_out_out_setof",
      identifier: "main.c.mutation_out_out_setof(int4,text)",
      from(...args) {
        return sql`${mutation_out_out_setofFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      isUnique: !true,
      codec: registryConfig_pgCodecs_MutationOutOutSetofRecord_MutationOutOutSetofRecord,
      uniques: [],
      isMutation: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_out_out_setof"
        },
        tags: {
          behavior: ["-queryField mutationField -typeField", "-filter -order"]
        }
      },
      description: undefined
    },
    mutation_out_out_unnamed: {
      executor,
      name: "mutation_out_out_unnamed",
      identifier: "main.c.mutation_out_out_unnamed(int4,text)",
      from(...args) {
        return sql`${mutation_out_out_unnamedFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      isUnique: !false,
      codec: registryConfig_pgCodecs_MutationOutOutUnnamedRecord_MutationOutOutUnnamedRecord,
      uniques: [],
      isMutation: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_out_out_unnamed"
        },
        tags: {
          behavior: ["-queryField mutationField -typeField", "-filter -order"]
        }
      },
      description: undefined
    },
    func_out_unnamed_out_out_unnamed: {
      executor,
      name: "func_out_unnamed_out_out_unnamed",
      identifier: "main.c.func_out_unnamed_out_out_unnamed(int4,text,int4)",
      from(...args) {
        return sql`${func_out_unnamed_out_out_unnamedFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      isUnique: !false,
      codec: registryConfig_pgCodecs_FuncOutUnnamedOutOutUnnamedRecord_FuncOutUnnamedOutOutUnnamedRecord,
      uniques: [],
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_out_unnamed_out_out_unnamed"
        },
        tags: {
          behavior: ["queryField -mutationField -typeField", "-filter -order"]
        }
      },
      description: undefined
    },
    func_returns_table_multi_col: {
      executor,
      name: "func_returns_table_multi_col",
      identifier: "main.c.func_returns_table_multi_col(int4,int4,text)",
      from(...args) {
        return sql`${func_returns_table_multi_colFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "i",
        required: true,
        notNull: false,
        codec: TYPES.int
      }],
      isUnique: !true,
      codec: registryConfig_pgCodecs_FuncReturnsTableMultiColRecord_FuncReturnsTableMultiColRecord,
      uniques: [],
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_returns_table_multi_col"
        },
        tags: {
          behavior: ["queryField -mutationField -typeField", "-filter -order"]
        }
      },
      description: undefined
    },
    int_set_mutation: {
      executor,
      name: "int_set_mutation",
      identifier: "main.c.int_set_mutation(int4,int4,int4)",
      from(...args) {
        return sql`${int_set_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "x",
        required: true,
        notNull: false,
        codec: TYPES.int
      }, {
        name: "y",
        required: true,
        notNull: false,
        codec: TYPES.int
      }, {
        name: "z",
        required: true,
        notNull: false,
        codec: TYPES.int
      }],
      isUnique: !true,
      codec: TYPES.int,
      uniques: [],
      isMutation: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "int_set_mutation"
        },
        tags: {
          behavior: ["-queryField mutationField -typeField", "-filter -order"]
        }
      },
      description: undefined
    },
    int_set_query: {
      executor,
      name: "int_set_query",
      identifier: "main.c.int_set_query(int4,int4,int4)",
      from(...args) {
        return sql`${int_set_queryFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "x",
        required: true,
        notNull: false,
        codec: TYPES.int
      }, {
        name: "y",
        required: true,
        notNull: false,
        codec: TYPES.int
      }, {
        name: "z",
        required: true,
        notNull: false,
        codec: TYPES.int
      }],
      isUnique: !true,
      codec: TYPES.int,
      uniques: [],
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "int_set_query"
        },
        tags: {
          behavior: ["queryField -mutationField -typeField", "-filter -order"]
        }
      },
      description: undefined
    },
    mutation_out_unnamed_out_out_unnamed: {
      executor,
      name: "mutation_out_unnamed_out_out_unnamed",
      identifier: "main.c.mutation_out_unnamed_out_out_unnamed(int4,text,int4)",
      from(...args) {
        return sql`${mutation_out_unnamed_out_out_unnamedFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      isUnique: !false,
      codec: registryConfig_pgCodecs_MutationOutUnnamedOutOutUnnamedRecord_MutationOutUnnamedOutOutUnnamedRecord,
      uniques: [],
      isMutation: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_out_unnamed_out_out_unnamed"
        },
        tags: {
          behavior: ["-queryField mutationField -typeField", "-filter -order"]
        }
      },
      description: undefined
    },
    mutation_returns_table_multi_col: {
      executor,
      name: "mutation_returns_table_multi_col",
      identifier: "main.c.mutation_returns_table_multi_col(int4,int4,text)",
      from(...args) {
        return sql`${mutation_returns_table_multi_colFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "i",
        required: true,
        notNull: false,
        codec: TYPES.int
      }],
      isUnique: !true,
      codec: registryConfig_pgCodecs_MutationReturnsTableMultiColRecord_MutationReturnsTableMultiColRecord,
      uniques: [],
      isMutation: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_returns_table_multi_col"
        },
        tags: {
          behavior: ["-queryField mutationField -typeField", "-filter -order"]
        }
      },
      description: undefined
    },
    search_test_summaries: {
      executor,
      name: "search_test_summaries",
      identifier: "main.c.search_test_summaries(int4,interval)",
      from(...args) {
        return sql`${search_test_summariesFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      isUnique: !true,
      codec: registryConfig_pgCodecs_SearchTestSummariesRecord_SearchTestSummariesRecord,
      uniques: [],
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "search_test_summaries"
        },
        tags: {
          simpleCollections: "only",
          behavior: ["queryField -mutationField -typeField", "-filter -order", "+list -connection"]
        }
      },
      description: undefined
    },
    my_table: {
      executor: executor,
      name: "my_table",
      identifier: "main.c.my_table",
      from: myTableIdentifier,
      codec: myTableCodec,
      uniques: my_tableUniques,
      isVirtual: false,
      description: undefined,
      extensions: {
        description: undefined,
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "my_table"
        },
        tags: {}
      }
    },
    person_secret: registryConfig_pgResources_person_secret_person_secret,
    unlogged: {
      executor: executor,
      name: "unlogged",
      identifier: "main.c.unlogged",
      from: unloggedIdentifier,
      codec: unloggedCodec,
      uniques: [{
        isPrimary: true,
        attributes: ["id"],
        description: undefined,
        extensions: {
          tags: Object.create(null)
        }
      }],
      isVirtual: false,
      description: undefined,
      extensions: {
        description: undefined,
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "unlogged",
          persistence: "u"
        },
        tags: {}
      }
    },
    compound_key: registryConfig_pgResources_compound_key_compound_key,
    null_test_record: {
      executor: executor,
      name: "null_test_record",
      identifier: "main.c.null_test_record",
      from: nullTestRecordIdentifier,
      codec: nullTestRecordCodec,
      uniques: null_test_recordUniques,
      isVirtual: false,
      description: undefined,
      extensions: {
        description: undefined,
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "null_test_record"
        },
        tags: {}
      }
    },
    edge_case_computed: {
      executor,
      name: "edge_case_computed",
      identifier: "main.c.edge_case_computed(c.edge_case)",
      from(...args) {
        return sql`${edge_case_computedFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "edge_case",
        required: true,
        notNull: false,
        codec: edgeCaseCodec
      }],
      isUnique: !false,
      codec: TYPES.text,
      uniques: [],
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "edge_case_computed"
        },
        tags: {
          behavior: ["-queryField -mutationField typeField", "-filter -order"]
        }
      },
      description: undefined
    },
    return_table_without_grants: PgResource.functionResourceOptions(registryConfig_pgResources_compound_key_compound_key, {
      name: "return_table_without_grants",
      identifier: "main.c.return_table_without_grants()",
      from(...args) {
        return sql`${return_table_without_grantsFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsArray: false,
      returnsSetof: false,
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "return_table_without_grants"
        },
        tags: {
          behavior: ["queryField -mutationField -typeField", "-filter -order"]
        }
      },
      description: undefined
    }),
    edge_case: {
      executor: executor,
      name: "edge_case",
      identifier: "main.c.edge_case",
      from: edgeCaseIdentifier,
      codec: edgeCaseCodec,
      uniques: [],
      isVirtual: false,
      description: undefined,
      extensions: {
        description: undefined,
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "edge_case"
        },
        tags: {}
      }
    },
    left_arm: registryConfig_pgResources_left_arm_left_arm,
    left_arm_identity: PgResource.functionResourceOptions(registryConfig_pgResources_left_arm_left_arm, {
      name: "left_arm_identity",
      identifier: "main.c.left_arm_identity(c.left_arm)",
      from(...args) {
        return sql`${left_arm_identityFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "left_arm",
        required: true,
        notNull: false,
        codec: leftArmCodec,
        extensions: {
          variant: "base"
        }
      }],
      returnsArray: false,
      returnsSetof: false,
      isMutation: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "left_arm_identity"
        },
        tags: {
          arg0variant: "base",
          resultFieldName: "leftArm",
          behavior: ["-queryField mutationField -typeField", "-filter -order"]
        }
      },
      description: undefined
    }),
    issue756: registryConfig_pgResources_issue756_issue756,
    issue756_mutation: PgResource.functionResourceOptions(registryConfig_pgResources_issue756_issue756, {
      name: "issue756_mutation",
      identifier: "main.c.issue756_mutation()",
      from(...args) {
        return sql`${issue756_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsArray: false,
      returnsSetof: false,
      isMutation: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "issue756_mutation"
        },
        tags: {
          behavior: ["-queryField mutationField -typeField", "-filter -order"]
        }
      },
      description: undefined
    }),
    issue756_set_mutation: PgResource.functionResourceOptions(registryConfig_pgResources_issue756_issue756, {
      name: "issue756_set_mutation",
      identifier: "main.c.issue756_set_mutation()",
      from(...args) {
        return sql`${issue756_set_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsArray: false,
      returnsSetof: true,
      isMutation: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "issue756_set_mutation"
        },
        tags: {
          behavior: ["-queryField mutationField -typeField", "-filter -order"]
        }
      },
      description: undefined
    }),
    types_mutation: {
      executor,
      name: "types_mutation",
      identifier: "main.c.types_mutation(int8,bool,varchar,_int4,json,c.floatrange)",
      from(...args) {
        return sql`${types_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "a",
        required: true,
        notNull: true,
        codec: TYPES.bigint
      }, {
        name: "b",
        required: true,
        notNull: true,
        codec: TYPES.boolean
      }, {
        name: "c",
        required: true,
        notNull: true,
        codec: TYPES.varchar
      }, {
        name: "d",
        required: true,
        notNull: true,
        codec: int4ArrayCodec
      }, {
        name: "e",
        required: true,
        notNull: true,
        codec: TYPES.json
      }, {
        name: "f",
        required: true,
        notNull: true,
        codec: floatrangeCodec
      }],
      isUnique: !false,
      codec: TYPES.boolean,
      uniques: [],
      isMutation: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "types_mutation"
        },
        tags: {
          behavior: ["-queryField mutationField -typeField", "-filter -order"]
        }
      },
      description: undefined
    },
    types_query: {
      executor,
      name: "types_query",
      identifier: "main.c.types_query(int8,bool,varchar,_int4,json,c.floatrange)",
      from(...args) {
        return sql`${types_queryFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "a",
        required: true,
        notNull: true,
        codec: TYPES.bigint
      }, {
        name: "b",
        required: true,
        notNull: true,
        codec: TYPES.boolean
      }, {
        name: "c",
        required: true,
        notNull: true,
        codec: TYPES.varchar
      }, {
        name: "d",
        required: true,
        notNull: true,
        codec: int4ArrayCodec
      }, {
        name: "e",
        required: true,
        notNull: true,
        codec: TYPES.json
      }, {
        name: "f",
        required: true,
        notNull: true,
        codec: floatrangeCodec
      }],
      isUnique: !false,
      codec: TYPES.boolean,
      uniques: [],
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "types_query"
        },
        tags: {
          behavior: ["queryField -mutationField -typeField", "-filter -order"]
        }
      },
      description: undefined
    },
    compound_type_computed_field: {
      executor,
      name: "compound_type_computed_field",
      identifier: "main.c.compound_type_computed_field(c.compound_type)",
      from(...args) {
        return sql`${compound_type_computed_fieldFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "compound_type",
        required: true,
        notNull: false,
        codec: compoundTypeCodec
      }],
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "compound_type_computed_field"
        },
        tags: {
          behavior: ["-queryField -mutationField typeField", "-filter -order"]
        }
      },
      description: undefined
    },
    func_out_out_compound_type: {
      executor,
      name: "func_out_out_compound_type",
      identifier: "main.c.func_out_out_compound_type(int4,int4,c.compound_type)",
      from(...args) {
        return sql`${func_out_out_compound_typeFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "i1",
        required: true,
        notNull: false,
        codec: TYPES.int
      }],
      isUnique: !false,
      codec: registryConfig_pgCodecs_FuncOutOutCompoundTypeRecord_FuncOutOutCompoundTypeRecord,
      uniques: [],
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_out_out_compound_type"
        },
        tags: {
          behavior: ["queryField -mutationField -typeField", "-filter -order"]
        }
      },
      description: undefined
    },
    mutation_out_out_compound_type: {
      executor,
      name: "mutation_out_out_compound_type",
      identifier: "main.c.mutation_out_out_compound_type(int4,int4,c.compound_type)",
      from(...args) {
        return sql`${mutation_out_out_compound_typeFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "i1",
        required: true,
        notNull: false,
        codec: TYPES.int
      }],
      isUnique: !false,
      codec: registryConfig_pgCodecs_MutationOutOutCompoundTypeRecord_MutationOutOutCompoundTypeRecord,
      uniques: [],
      isMutation: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_out_out_compound_type"
        },
        tags: {
          behavior: ["-queryField mutationField -typeField", "-filter -order"]
        }
      },
      description: undefined
    },
    query_output_two_rows: {
      executor,
      name: "query_output_two_rows",
      identifier: "main.c.query_output_two_rows(int4,int4,text,c.left_arm,a.post)",
      from(...args) {
        return sql`${query_output_two_rowsFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "left_arm_id",
        required: true,
        notNull: false,
        codec: TYPES.int
      }, {
        name: "post_id",
        required: true,
        notNull: false,
        codec: TYPES.int
      }, {
        name: "txt",
        required: true,
        notNull: false,
        codec: TYPES.text
      }],
      isUnique: !false,
      codec: registryConfig_pgCodecs_QueryOutputTwoRowsRecord_QueryOutputTwoRowsRecord,
      uniques: [],
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "query_output_two_rows"
        },
        tags: {
          behavior: ["queryField -mutationField -typeField", "-filter -order"]
        }
      },
      description: undefined
    },
    compound_type_set_query: PgResource.functionResourceOptions({
      executor: executor,
      name: "compound_type",
      identifier: "main.c.compound_type",
      from: compoundTypeIdentifier,
      codec: compoundTypeCodec,
      uniques: [],
      isVirtual: true,
      description: "Awesome feature!",
      extensions: {
        description: "Awesome feature!",
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "compound_type"
        },
        tags: {
          behavior: ["-insert", "-update", "-delete"]
        }
      }
    }, {
      name: "compound_type_set_query",
      identifier: "main.c.compound_type_set_query()",
      from(...args) {
        return sql`${compound_type_set_queryFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsArray: false,
      returnsSetof: true,
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "compound_type_set_query"
        },
        tags: {
          behavior: ["queryField -mutationField -typeField", "-filter -order"]
        }
      },
      description: undefined
    }),
    table_mutation: PgResource.functionResourceOptions({
      codec: postCodec,
      executor: executor
    }, {
      name: "table_mutation",
      identifier: "main.c.table_mutation(int4)",
      from(...args) {
        return sql`${table_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "id",
        required: true,
        notNull: false,
        codec: TYPES.int
      }],
      returnsArray: false,
      returnsSetof: false,
      isMutation: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "table_mutation"
        },
        tags: {
          behavior: ["-queryField mutationField -typeField", "-filter -order"]
        }
      },
      description: undefined
    }),
    table_query: PgResource.functionResourceOptions({
      codec: postCodec,
      executor: executor
    }, {
      name: "table_query",
      identifier: "main.c.table_query(int4)",
      from(...args) {
        return sql`${table_queryFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "id",
        required: true,
        notNull: false,
        codec: TYPES.int
      }],
      returnsArray: false,
      returnsSetof: false,
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "table_query"
        },
        tags: {
          behavior: ["queryField -mutationField -typeField", "-filter -order"]
        }
      },
      description: undefined
    }),
    person_computed_out: {
      executor,
      name: "person_computed_out",
      identifier: "main.c.person_computed_out(c.person,text)",
      from(...args) {
        return sql`${person_computed_outFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "person",
        required: true,
        notNull: false,
        codec: personCodec
      }],
      isUnique: !false,
      codec: TYPES.text,
      uniques: [],
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_computed_out"
        },
        tags: {
          notNull: true,
          sortable: true,
          filterable: true,
          behavior: ["-queryField -mutationField typeField", "-filter -order", "filter filterBy", "orderBy order resource:connection:backwards"]
        },
        singleOutputParameterName: "o1"
      },
      description: undefined
    },
    person_first_name: {
      executor,
      name: "person_first_name",
      identifier: "main.c.person_first_name(c.person)",
      from(...args) {
        return sql`${person_first_nameFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "person",
        required: true,
        notNull: false,
        codec: personCodec
      }],
      isUnique: !false,
      codec: TYPES.text,
      uniques: [],
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_first_name"
        },
        tags: {
          sortable: true,
          behavior: ["-queryField -mutationField typeField", "-filter -order", "orderBy order resource:connection:backwards"]
        }
      },
      description: "The first name of the person."
    },
    person_computed_out_out: {
      executor,
      name: "person_computed_out_out",
      identifier: "main.c.person_computed_out_out(c.person,text,text)",
      from(...args) {
        return sql`${person_computed_out_outFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "person",
        required: true,
        notNull: false,
        codec: personCodec
      }],
      isUnique: !false,
      codec: registryConfig_pgCodecs_PersonComputedOutOutRecord_PersonComputedOutOutRecord,
      uniques: [],
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_computed_out_out"
        },
        tags: {
          behavior: ["-queryField -mutationField typeField", "-filter -order"]
        }
      },
      description: undefined
    },
    person_computed_inout: {
      executor,
      name: "person_computed_inout",
      identifier: "main.c.person_computed_inout(c.person,text)",
      from(...args) {
        return sql`${person_computed_inoutFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "person",
        required: true,
        notNull: false,
        codec: personCodec
      }, {
        name: "ino",
        required: true,
        notNull: false,
        codec: TYPES.text
      }],
      isUnique: !false,
      codec: TYPES.text,
      uniques: [],
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_computed_inout"
        },
        tags: {
          behavior: ["-queryField -mutationField typeField", "-filter -order"]
        },
        singleOutputParameterName: "ino"
      },
      description: undefined
    },
    person_computed_inout_out: {
      executor,
      name: "person_computed_inout_out",
      identifier: "main.c.person_computed_inout_out(c.person,text,text)",
      from(...args) {
        return sql`${person_computed_inout_outFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "person",
        required: true,
        notNull: false,
        codec: personCodec
      }, {
        name: "ino",
        required: true,
        notNull: false,
        codec: TYPES.text
      }],
      isUnique: !false,
      codec: registryConfig_pgCodecs_PersonComputedInoutOutRecord_PersonComputedInoutOutRecord,
      uniques: [],
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_computed_inout_out"
        },
        tags: {
          behavior: ["-queryField -mutationField typeField", "-filter -order"]
        }
      },
      description: undefined
    },
    person_exists: {
      executor,
      name: "person_exists",
      identifier: "main.c.person_exists(c.person,b.email)",
      from(...args) {
        return sql`${person_existsFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "person",
        required: true,
        notNull: false,
        codec: personCodec
      }, {
        name: "email",
        required: true,
        notNull: false,
        codec: emailCodec
      }],
      isUnique: !false,
      codec: TYPES.boolean,
      uniques: [],
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_exists"
        },
        tags: {
          deprecated: "This is deprecated (comment on function c.person_exists).",
          behavior: ["-queryField -mutationField typeField", "-filter -order"]
        }
      },
      description: undefined
    },
    person_computed_first_arg_inout_out: {
      executor,
      name: "person_computed_first_arg_inout_out",
      identifier: "main.c.person_computed_first_arg_inout_out(c.person,int4)",
      from(...args) {
        return sql`${person_computed_first_arg_inout_outFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "person",
        required: true,
        notNull: false,
        codec: personCodec
      }],
      isUnique: !false,
      codec: registryConfig_pgCodecs_PersonComputedFirstArgInoutOutRecord_PersonComputedFirstArgInoutOutRecord,
      uniques: [],
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_computed_first_arg_inout_out"
        },
        tags: {
          behavior: ["-queryField -mutationField typeField", "-filter -order"]
        }
      },
      description: undefined
    },
    func_out_complex: {
      executor,
      name: "func_out_complex",
      identifier: "main.c.func_out_complex(int4,text,int4,c.compound_type,c.person)",
      from(...args) {
        return sql`${func_out_complexFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "a",
        required: true,
        notNull: false,
        codec: TYPES.int
      }, {
        name: "b",
        required: true,
        notNull: false,
        codec: TYPES.text
      }],
      isUnique: !false,
      codec: registryConfig_pgCodecs_FuncOutComplexRecord_FuncOutComplexRecord,
      uniques: [],
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_out_complex"
        },
        tags: {
          behavior: ["queryField -mutationField -typeField", "-filter -order"]
        }
      },
      description: undefined
    },
    func_out_complex_setof: {
      executor,
      name: "func_out_complex_setof",
      identifier: "main.c.func_out_complex_setof(int4,text,int4,c.compound_type,c.person)",
      from(...args) {
        return sql`${func_out_complex_setofFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "a",
        required: true,
        notNull: false,
        codec: TYPES.int
      }, {
        name: "b",
        required: true,
        notNull: false,
        codec: TYPES.text
      }],
      isUnique: !true,
      codec: registryConfig_pgCodecs_FuncOutComplexSetofRecord_FuncOutComplexSetofRecord,
      uniques: [],
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_out_complex_setof"
        },
        tags: {
          behavior: ["queryField -mutationField -typeField", "-filter -order"]
        }
      },
      description: undefined
    },
    mutation_out_complex: {
      executor,
      name: "mutation_out_complex",
      identifier: "main.c.mutation_out_complex(int4,text,int4,c.compound_type,c.person)",
      from(...args) {
        return sql`${mutation_out_complexFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "a",
        required: true,
        notNull: false,
        codec: TYPES.int
      }, {
        name: "b",
        required: true,
        notNull: false,
        codec: TYPES.text
      }],
      isUnique: !false,
      codec: registryConfig_pgCodecs_MutationOutComplexRecord_MutationOutComplexRecord,
      uniques: [],
      isMutation: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_out_complex"
        },
        tags: {
          behavior: ["-queryField mutationField -typeField", "-filter -order"]
        }
      },
      description: undefined
    },
    mutation_out_complex_setof: {
      executor,
      name: "mutation_out_complex_setof",
      identifier: "main.c.mutation_out_complex_setof(int4,text,int4,c.compound_type,c.person)",
      from(...args) {
        return sql`${mutation_out_complex_setofFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "a",
        required: true,
        notNull: false,
        codec: TYPES.int
      }, {
        name: "b",
        required: true,
        notNull: false,
        codec: TYPES.text
      }],
      isUnique: !true,
      codec: registryConfig_pgCodecs_MutationOutComplexSetofRecord_MutationOutComplexSetofRecord,
      uniques: [],
      isMutation: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_out_complex_setof"
        },
        tags: {
          behavior: ["-queryField mutationField -typeField", "-filter -order"]
        }
      },
      description: undefined
    },
    person_computed_complex: {
      executor,
      name: "person_computed_complex",
      identifier: "main.c.person_computed_complex(c.person,int4,text,int4,c.compound_type,c.person)",
      from(...args) {
        return sql`${person_computed_complexFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "person",
        required: true,
        notNull: false,
        codec: personCodec
      }, {
        name: "a",
        required: true,
        notNull: false,
        codec: TYPES.int
      }, {
        name: "b",
        required: true,
        notNull: false,
        codec: TYPES.text
      }],
      isUnique: !false,
      codec: registryConfig_pgCodecs_PersonComputedComplexRecord_PersonComputedComplexRecord,
      uniques: [],
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_computed_complex"
        },
        tags: {
          behavior: ["-queryField -mutationField typeField", "-filter -order"]
        }
      },
      description: undefined
    },
    person: registryConfig_pgResources_person_person,
    person_first_post: PgResource.functionResourceOptions({
      codec: postCodec,
      executor: executor
    }, {
      name: "person_first_post",
      identifier: "main.c.person_first_post(c.person)",
      from(...args) {
        return sql`${person_first_postFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "person",
        required: true,
        notNull: false,
        codec: personCodec
      }],
      returnsArray: false,
      returnsSetof: false,
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_first_post"
        },
        tags: {
          behavior: ["-queryField -mutationField typeField", "-filter -order"]
        }
      },
      description: "The first post by the person."
    }),
    badly_behaved_function: PgResource.functionResourceOptions(registryConfig_pgResources_person_person, {
      name: "badly_behaved_function",
      identifier: "main.c.badly_behaved_function()",
      from(...args) {
        return sql`${badly_behaved_functionFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsArray: false,
      returnsSetof: true,
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "badly_behaved_function"
        },
        tags: {
          deprecated: "This is deprecated (comment on function c.badly_behaved_function).",
          behavior: ["queryField -mutationField -typeField", "-filter -order"]
        }
      },
      description: undefined
    }),
    func_out_table: PgResource.functionResourceOptions(registryConfig_pgResources_person_person, {
      name: "func_out_table",
      identifier: "main.c.func_out_table(c.person)",
      from(...args) {
        return sql`${func_out_tableFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsArray: false,
      returnsSetof: false,
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_out_table"
        },
        tags: {
          behavior: ["queryField -mutationField -typeField", "-filter -order"]
        }
      },
      description: undefined
    }),
    func_out_table_setof: PgResource.functionResourceOptions(registryConfig_pgResources_person_person, {
      name: "func_out_table_setof",
      identifier: "main.c.func_out_table_setof(c.person)",
      from(...args) {
        return sql`${func_out_table_setofFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsArray: false,
      returnsSetof: true,
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_out_table_setof"
        },
        tags: {
          behavior: ["queryField -mutationField -typeField", "-filter -order"]
        }
      },
      description: undefined
    }),
    mutation_out_table: PgResource.functionResourceOptions(registryConfig_pgResources_person_person, {
      name: "mutation_out_table",
      identifier: "main.c.mutation_out_table(c.person)",
      from(...args) {
        return sql`${mutation_out_tableFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsArray: false,
      returnsSetof: false,
      isMutation: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_out_table"
        },
        tags: {
          behavior: ["-queryField mutationField -typeField", "-filter -order"]
        }
      },
      description: undefined
    }),
    mutation_out_table_setof: PgResource.functionResourceOptions(registryConfig_pgResources_person_person, {
      name: "mutation_out_table_setof",
      identifier: "main.c.mutation_out_table_setof(c.person)",
      from(...args) {
        return sql`${mutation_out_table_setofFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsArray: false,
      returnsSetof: true,
      isMutation: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_out_table_setof"
        },
        tags: {
          behavior: ["-queryField mutationField -typeField", "-filter -order"]
        }
      },
      description: undefined
    }),
    table_set_mutation: PgResource.functionResourceOptions(registryConfig_pgResources_person_person, {
      name: "table_set_mutation",
      identifier: "main.c.table_set_mutation()",
      from(...args) {
        return sql`${table_set_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsArray: false,
      returnsSetof: true,
      isMutation: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "table_set_mutation"
        },
        tags: {
          behavior: ["-queryField mutationField -typeField", "-filter -order"]
        }
      },
      description: undefined
    }),
    table_set_query: PgResource.functionResourceOptions(registryConfig_pgResources_person_person, {
      name: "table_set_query",
      identifier: "main.c.table_set_query()",
      from(...args) {
        return sql`${table_set_queryFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsArray: false,
      returnsSetof: true,
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "table_set_query"
        },
        tags: {
          sortable: true,
          filterable: true,
          behavior: ["queryField -mutationField -typeField", "-filter -order", "filter filterBy", "orderBy order resource:connection:backwards"]
        }
      },
      description: undefined
    }),
    table_set_query_plpgsql: PgResource.functionResourceOptions(registryConfig_pgResources_person_person, {
      name: "table_set_query_plpgsql",
      identifier: "main.c.table_set_query_plpgsql()",
      from(...args) {
        return sql`${table_set_query_plpgsqlFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsArray: false,
      returnsSetof: true,
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "table_set_query_plpgsql"
        },
        tags: {
          behavior: ["queryField -mutationField -typeField", "-filter -order"]
        }
      },
      description: undefined
    }),
    person_computed_first_arg_inout: PgResource.functionResourceOptions(registryConfig_pgResources_person_person, {
      name: "person_computed_first_arg_inout",
      identifier: "main.c.person_computed_first_arg_inout(c.person)",
      from(...args) {
        return sql`${person_computed_first_arg_inoutFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "person",
        required: true,
        notNull: false,
        codec: personCodec
      }],
      returnsArray: false,
      returnsSetof: false,
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_computed_first_arg_inout"
        },
        tags: {
          behavior: ["-queryField -mutationField typeField", "-filter -order"]
        },
        singleOutputParameterName: "person"
      },
      description: undefined
    }),
    person_friends: PgResource.functionResourceOptions(registryConfig_pgResources_person_person, {
      name: "person_friends",
      identifier: "main.c.person_friends(c.person)",
      from(...args) {
        return sql`${person_friendsFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "person",
        required: true,
        notNull: false,
        codec: personCodec
      }],
      returnsArray: false,
      returnsSetof: true,
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_friends"
        },
        tags: {
          sortable: true,
          behavior: ["-queryField -mutationField typeField", "-filter -order", "orderBy order resource:connection:backwards"]
        }
      },
      description: undefined
    }),
    person_type_function_connection: PgResource.functionResourceOptions({
      codec: typesCodec,
      executor: executor
    }, {
      name: "person_type_function_connection",
      identifier: "main.c.person_type_function_connection(c.person)",
      from(...args) {
        return sql`${person_type_function_connectionFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "p",
        required: true,
        notNull: false,
        codec: personCodec
      }],
      returnsArray: false,
      returnsSetof: true,
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_type_function_connection"
        },
        tags: {
          behavior: ["-queryField -mutationField typeField", "-filter -order"]
        }
      },
      description: undefined
    }),
    person_type_function: PgResource.functionResourceOptions({
      codec: typesCodec,
      executor: executor
    }, {
      name: "person_type_function",
      identifier: "main.c.person_type_function(c.person,int4)",
      from(...args) {
        return sql`${person_type_functionFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "p",
        required: true,
        notNull: false,
        codec: personCodec
      }, {
        name: "id",
        required: true,
        notNull: false,
        codec: TYPES.int
      }],
      returnsArray: false,
      returnsSetof: false,
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_type_function"
        },
        tags: {
          behavior: ["-queryField -mutationField typeField", "-filter -order"]
        }
      },
      description: undefined
    }),
    person_type_function_list: PgResource.functionResourceOptions({
      codec: typesCodec,
      executor: executor
    }, {
      name: "person_type_function_list",
      identifier: "main.c.person_type_function_list(c.person)",
      from(...args) {
        return sql`${person_type_function_listFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "p",
        required: true,
        notNull: false,
        codec: personCodec
      }],
      returnsArray: true,
      returnsSetof: false,
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_type_function_list"
        },
        tags: {
          behavior: ["-queryField -mutationField typeField", "-filter -order"]
        }
      },
      description: undefined
    })
  }),
  pgRelations: Object.assign(Object.create(null), {
    compoundKey: Object.assign(Object.create(null), {
      personByMyPersonId1: {
        localCodec: compoundKeyCodec,
        remoteResourceOptions: registryConfig_pgResources_person_person,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["person_id_1"],
        remoteAttributes: ["id"],
        isUnique: true,
        isReferencee: false,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      personByMyPersonId2: {
        localCodec: compoundKeyCodec,
        remoteResourceOptions: registryConfig_pgResources_person_person,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["person_id_2"],
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
    leftArm: Object.assign(Object.create(null), {
      personByMyPersonId: {
        localCodec: leftArmCodec,
        remoteResourceOptions: registryConfig_pgResources_person_person,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["person_id"],
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
    person: Object.assign(Object.create(null), {
      personSecretByTheirPersonId: {
        localCodec: personCodec,
        remoteResourceOptions: registryConfig_pgResources_person_secret_person_secret,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["person_id"],
        isUnique: true,
        isReferencee: true,
        description: "This `Person`'s `PersonSecret`.",
        extensions: {
          tags: {
            forwardDescription: "The `Person` this `PersonSecret` belongs to.",
            backwardDescription: "This `Person`'s `PersonSecret`.",
            behavior: []
          }
        }
      },
      leftArmByTheirPersonId: {
        localCodec: personCodec,
        remoteResourceOptions: registryConfig_pgResources_left_arm_left_arm,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["person_id"],
        isUnique: true,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      compoundKeysByTheirPersonId1: {
        localCodec: personCodec,
        remoteResourceOptions: registryConfig_pgResources_compound_key_compound_key,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["person_id_1"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      compoundKeysByTheirPersonId2: {
        localCodec: personCodec,
        remoteResourceOptions: registryConfig_pgResources_compound_key_compound_key,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["person_id_2"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      personSecretsByTheirSekrit: {
        localCodec: personCodec,
        remoteResourceOptions: registryConfig_pgResources_person_secret_person_secret,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["about"],
        remoteAttributes: ["sekrit"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      }
    }),
    personSecret: Object.assign(Object.create(null), {
      personByMySekrit: {
        localCodec: personSecretCodec,
        remoteResourceOptions: registryConfig_pgResources_person_person,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["sekrit"],
        remoteAttributes: ["about"],
        isUnique: true,
        isReferencee: false,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      personByMyPersonId: {
        localCodec: personSecretCodec,
        remoteResourceOptions: registryConfig_pgResources_person_person,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["person_id"],
        remoteAttributes: ["id"],
        isUnique: true,
        isReferencee: false,
        description: "The `Person` this `PersonSecret` belongs to.",
        extensions: {
          tags: {
            forwardDescription: "The `Person` this `PersonSecret` belongs to.",
            backwardDescription: "This `Person`'s `PersonSecret`.",
            behavior: []
          }
        }
      }
    })
  })
});
const pgResource_my_tablePgResource = registry.pgResources["my_table"];
const pgResource_person_secretPgResource = registry.pgResources["person_secret"];
const pgResource_compound_keyPgResource = registry.pgResources["compound_key"];
const pgResource_null_test_recordPgResource = registry.pgResources["null_test_record"];
const pgResource_left_armPgResource = registry.pgResources["left_arm"];
const pgResource_issue756PgResource = registry.pgResources["issue756"];
const pgResource_personPgResource = registry.pgResources["person"];
const nodeIdHandlerByTypeName = Object.assign(Object.create(null), {
  Query: handler,
  MyTable: {
    typeName: "MyTable",
    codec: nodeIdCodecs_base64JSON_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("my_tables", false), $record.get("id")]);
    },
    getSpec($list) {
      return {
        id: inhibitOnNull(access($list, [1]))
      };
    },
    get(spec) {
      return pgResource_my_tablePgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "my_tables";
    }
  },
  PersonSecret: {
    typeName: "PersonSecret",
    codec: nodeIdCodecs_base64JSON_base64JSON,
    deprecationReason: "This is deprecated (comment on table c.person_secret).",
    plan($record) {
      return list([constant("person_secrets", false), $record.get("person_id")]);
    },
    getSpec($list) {
      return {
        person_id: inhibitOnNull(access($list, [1]))
      };
    },
    get(spec) {
      return pgResource_person_secretPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "person_secrets";
    }
  },
  CompoundKey: {
    typeName: "CompoundKey",
    codec: nodeIdCodecs_base64JSON_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("compound_keys", false), $record.get("person_id_1"), $record.get("person_id_2")]);
    },
    getSpec($list) {
      return {
        person_id_1: inhibitOnNull(access($list, [1])),
        person_id_2: inhibitOnNull(access($list, [2]))
      };
    },
    get(spec) {
      return pgResource_compound_keyPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "compound_keys";
    }
  },
  NullTestRecord: {
    typeName: "NullTestRecord",
    codec: nodeIdCodecs_base64JSON_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("null_test_records", false), $record.get("id")]);
    },
    getSpec($list) {
      return {
        id: inhibitOnNull(access($list, [1]))
      };
    },
    get(spec) {
      return pgResource_null_test_recordPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "null_test_records";
    }
  },
  LeftArm: {
    typeName: "LeftArm",
    codec: nodeIdCodecs_base64JSON_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("left_arms", false), $record.get("id")]);
    },
    getSpec($list) {
      return {
        id: inhibitOnNull(access($list, [1]))
      };
    },
    get(spec) {
      return pgResource_left_armPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "left_arms";
    }
  },
  Issue756: {
    typeName: "Issue756",
    codec: nodeIdCodecs_base64JSON_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("issue756S", false), $record.get("id")]);
    },
    getSpec($list) {
      return {
        id: inhibitOnNull(access($list, [1]))
      };
    },
    get(spec) {
      return pgResource_issue756PgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "issue756S";
    }
  },
  Person: {
    typeName: "Person",
    codec: nodeIdCodecs_base64JSON_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("people", false), $record.get("id")]);
    },
    getSpec($list) {
      return {
        id: inhibitOnNull(access($list, [1]))
      };
    },
    get(spec) {
      return pgResource_personPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "people";
    }
  }
});
const argDetailsSimple = [];
const makeArgs = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 0; i++) {
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
const resource_current_user_idPgResource = registry.pgResources["current_user_id"];
const argDetailsSimple2 = [];
const makeArgs2 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 0; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple2[i];
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
const resource_func_outPgResource = registry.pgResources["func_out"];
const argDetailsSimple3 = [];
const makeArgs3 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 0; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple3[i];
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
const resource_func_out_setofPgResource = registry.pgResources["func_out_setof"];
const getSelectPlanFromParentAndArgs = ($root, args, _info) => {
  const selectArgs = makeArgs3(args);
  return resource_func_out_setofPgResource.execute(selectArgs);
};
const argDetailsSimple4 = [];
const makeArgs4 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 0; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple4[i];
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
const resource_func_out_unnamedPgResource = registry.pgResources["func_out_unnamed"];
const argDetailsSimple5 = [];
const makeArgs5 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 0; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple5[i];
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
const resource_no_args_queryPgResource = registry.pgResources["no_args_query"];
const argDetailsSimple6 = [{
  graphqlArgName: "i",
  postgresArgName: "i",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs6 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 1; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple6[i];
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
const resource_func_in_outPgResource = registry.pgResources["func_in_out"];
const argDetailsSimple7 = [{
  graphqlArgName: "i",
  postgresArgName: "i",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs7 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 1; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple7[i];
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
const resource_func_returns_table_one_colPgResource = registry.pgResources["func_returns_table_one_col"];
const getSelectPlanFromParentAndArgs2 = ($root, args, _info) => {
  const selectArgs = makeArgs7(args);
  return resource_func_returns_table_one_colPgResource.execute(selectArgs);
};
const argDetailsSimple8 = [{
  graphqlArgName: "json",
  postgresArgName: "json",
  pgCodec: TYPES.json,
  required: true,
  fetcher: null
}];
const makeArgs8 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 1; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple8[i];
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
const resource_json_identityPgResource = registry.pgResources["json_identity"];
const argDetailsSimple9 = [{
  graphqlArgName: "json",
  postgresArgName: "json",
  pgCodec: TYPES.jsonb,
  required: true,
  fetcher: null
}];
const makeArgs9 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 1; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple9[i];
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
const resource_jsonb_identityPgResource = registry.pgResources["jsonb_identity"];
const argDetailsSimple10 = [{
  graphqlArgName: "i",
  postgresArgName: "i",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "ino",
  postgresArgName: "ino",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs10 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 2; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple10[i];
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
const resource_func_in_inoutPgResource = registry.pgResources["func_in_inout"];
const argDetailsSimple11 = [];
const makeArgs11 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 0; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple11[i];
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
const resource_func_out_outPgResource = registry.pgResources["func_out_out"];
const argDetailsSimple12 = [];
const makeArgs12 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 0; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple12[i];
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
const resource_func_out_out_setofPgResource = registry.pgResources["func_out_out_setof"];
const getSelectPlanFromParentAndArgs3 = ($root, args, _info) => {
  const selectArgs = makeArgs12(args);
  return resource_func_out_out_setofPgResource.execute(selectArgs);
};
const argDetailsSimple13 = [];
const makeArgs13 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 0; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple13[i];
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
const resource_func_out_out_unnamedPgResource = registry.pgResources["func_out_out_unnamed"];
const argDetailsSimple14 = [];
const makeArgs14 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 0; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple14[i];
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
const resource_func_out_unnamed_out_out_unnamedPgResource = registry.pgResources["func_out_unnamed_out_out_unnamed"];
const argDetailsSimple15 = [{
  graphqlArgName: "i",
  postgresArgName: "i",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs15 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 1; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple15[i];
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
const resource_func_returns_table_multi_colPgResource = registry.pgResources["func_returns_table_multi_col"];
const getSelectPlanFromParentAndArgs4 = ($root, args, _info) => {
  const selectArgs = makeArgs15(args);
  return resource_func_returns_table_multi_colPgResource.execute(selectArgs);
};
const argDetailsSimple16 = [{
  graphqlArgName: "x",
  postgresArgName: "x",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "y",
  postgresArgName: "y",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "z",
  postgresArgName: "z",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs16 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 3; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple16[i];
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
const resource_int_set_queryPgResource = registry.pgResources["int_set_query"];
const getSelectPlanFromParentAndArgs5 = ($root, args, _info) => {
  const selectArgs = makeArgs16(args);
  return resource_int_set_queryPgResource.execute(selectArgs);
};
const argDetailsSimple17 = [];
const makeArgs17 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 0; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple17[i];
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
const resource_search_test_summariesPgResource = registry.pgResources["search_test_summaries"];
const argDetailsSimple18 = [];
const makeArgs18 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 0; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple18[i];
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
const resource_return_table_without_grantsPgResource = registry.pgResources["return_table_without_grants"];
const argDetailsSimple19 = [{
  graphqlArgName: "a",
  postgresArgName: "a",
  pgCodec: TYPES.bigint,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "b",
  postgresArgName: "b",
  pgCodec: TYPES.boolean,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "c",
  postgresArgName: "c",
  pgCodec: TYPES.varchar,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "d",
  postgresArgName: "d",
  pgCodec: int4ArrayCodec,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "e",
  postgresArgName: "e",
  pgCodec: TYPES.json,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "f",
  postgresArgName: "f",
  pgCodec: floatrangeCodec,
  required: true,
  fetcher: null
}];
const makeArgs19 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 6; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple19[i];
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
const resource_types_queryPgResource = registry.pgResources["types_query"];
const argDetailsSimple20 = [{
  graphqlArgName: "i1",
  postgresArgName: "i1",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs20 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 1; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple20[i];
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
const resource_func_out_out_compound_typePgResource = registry.pgResources["func_out_out_compound_type"];
const argDetailsSimple21 = [{
  graphqlArgName: "leftArmId",
  postgresArgName: "left_arm_id",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "postId",
  postgresArgName: "post_id",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "txt",
  postgresArgName: "txt",
  pgCodec: TYPES.text,
  required: true,
  fetcher: null
}];
const makeArgs21 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 3; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple21[i];
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
const resource_query_output_two_rowsPgResource = registry.pgResources["query_output_two_rows"];
const argDetailsSimple22 = [];
const makeArgs22 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 0; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple22[i];
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
const resource_compound_type_set_queryPgResource = registry.pgResources["compound_type_set_query"];
const getSelectPlanFromParentAndArgs6 = ($root, args, _info) => {
  const selectArgs = makeArgs22(args);
  return resource_compound_type_set_queryPgResource.execute(selectArgs);
};
const argDetailsSimple23 = [{
  graphqlArgName: "id",
  postgresArgName: "id",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs23 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 1; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple23[i];
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
const resource_table_queryPgResource = registry.pgResources["table_query"];
const argDetailsSimple24 = [{
  graphqlArgName: "a",
  postgresArgName: "a",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "b",
  postgresArgName: "b",
  pgCodec: TYPES.text,
  required: true,
  fetcher: null
}];
const makeArgs24 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 2; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple24[i];
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
const resource_func_out_complexPgResource = registry.pgResources["func_out_complex"];
const argDetailsSimple25 = [{
  graphqlArgName: "a",
  postgresArgName: "a",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "b",
  postgresArgName: "b",
  pgCodec: TYPES.text,
  required: true,
  fetcher: null
}];
const makeArgs25 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 2; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple25[i];
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
const resource_func_out_complex_setofPgResource = registry.pgResources["func_out_complex_setof"];
const getSelectPlanFromParentAndArgs7 = ($root, args, _info) => {
  const selectArgs = makeArgs25(args);
  return resource_func_out_complex_setofPgResource.execute(selectArgs);
};
const argDetailsSimple26 = [];
const makeArgs26 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 0; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple26[i];
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
const resource_badly_behaved_functionPgResource = registry.pgResources["badly_behaved_function"];
const getSelectPlanFromParentAndArgs8 = ($root, args, _info) => {
  const selectArgs = makeArgs26(args);
  return resource_badly_behaved_functionPgResource.execute(selectArgs);
};
const argDetailsSimple27 = [];
const makeArgs27 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 0; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple27[i];
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
const resource_func_out_tablePgResource = registry.pgResources["func_out_table"];
const argDetailsSimple28 = [];
const makeArgs28 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 0; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple28[i];
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
const resource_func_out_table_setofPgResource = registry.pgResources["func_out_table_setof"];
const getSelectPlanFromParentAndArgs9 = ($root, args, _info) => {
  const selectArgs = makeArgs28(args);
  return resource_func_out_table_setofPgResource.execute(selectArgs);
};
const argDetailsSimple29 = [];
const makeArgs29 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 0; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple29[i];
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
const resource_table_set_queryPgResource = registry.pgResources["table_set_query"];
const getSelectPlanFromParentAndArgs10 = ($root, args, _info) => {
  const selectArgs = makeArgs29(args);
  return resource_table_set_queryPgResource.execute(selectArgs);
};
const applyOrderToPlan = ($select, $value, TableOrderByType) => {
  if (!("evalLength" in $value)) {
    return;
  }
  const length = $value.evalLength();
  if (length == null) {
    return;
  }
  for (let i = 0; i < length; i++) {
    const order = $value.at(i).eval();
    if (order == null) continue;
    const config = getEnumValueConfig(TableOrderByType, order);
    const plan = config?.extensions?.grafast?.applyPlan;
    if (typeof plan !== "function") {
      console.error(`Internal server error: invalid orderBy configuration: expected function, but received ${inspect(plan)}`);
      throw new SafeError("Internal server error: invalid orderBy configuration");
    }
    plan($select);
  }
};
const argDetailsSimple30 = [];
const makeArgs30 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 0; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple30[i];
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
const resource_table_set_query_plpgsqlPgResource = registry.pgResources["table_set_query_plpgsql"];
const getSelectPlanFromParentAndArgs11 = ($root, args, _info) => {
  const selectArgs = makeArgs30(args);
  return resource_table_set_query_plpgsqlPgResource.execute(selectArgs);
};
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
})(nodeIdHandlerByTypeName.MyTable);
const fetcher2 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName.PersonSecret);
const fetcher3 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName.CompoundKey);
const fetcher4 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName.NullTestRecord);
const fetcher5 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName.LeftArm);
const fetcher6 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName.Issue756);
const fetcher7 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName.Person);
const resource_edge_casePgResource = registry.pgResources["edge_case"];
function hasRecord($row) {
  return "record" in $row && typeof $row.record === "function";
}
const argDetailsSimple31 = [];
const makeArgs31 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 0; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple31[i];
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
const resource_person_computed_outPgResource = registry.pgResources["person_computed_out"];
const argDetailsSimple32 = [];
const makeArgs32 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 0; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple32[i];
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
const resource_person_first_namePgResource = registry.pgResources["person_first_name"];
const argDetailsSimple33 = [];
const makeArgs33 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 0; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple33[i];
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
const resource_person_computed_out_outPgResource = registry.pgResources["person_computed_out_out"];
const argDetailsSimple34 = [{
  graphqlArgName: "ino",
  postgresArgName: "ino",
  pgCodec: TYPES.text,
  required: true,
  fetcher: null
}];
const makeArgs34 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 1; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple34[i];
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
const resource_person_computed_inoutPgResource = registry.pgResources["person_computed_inout"];
const argDetailsSimple35 = [{
  graphqlArgName: "ino",
  postgresArgName: "ino",
  pgCodec: TYPES.text,
  required: true,
  fetcher: null
}];
const makeArgs35 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 1; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple35[i];
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
const resource_person_computed_inout_outPgResource = registry.pgResources["person_computed_inout_out"];
const argDetailsSimple36 = [{
  graphqlArgName: "email",
  postgresArgName: "email",
  pgCodec: emailCodec,
  required: true,
  fetcher: null
}];
const makeArgs36 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 1; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple36[i];
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
const resource_person_existsPgResource = registry.pgResources["person_exists"];
const argDetailsSimple37 = [];
const makeArgs37 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 0; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple37[i];
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
const resource_person_computed_first_arg_inout_outPgResource = registry.pgResources["person_computed_first_arg_inout_out"];
const argDetailsSimple38 = [{
  graphqlArgName: "a",
  postgresArgName: "a",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "b",
  postgresArgName: "b",
  pgCodec: TYPES.text,
  required: true,
  fetcher: null
}];
const makeArgs38 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 2; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple38[i];
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
const resource_person_computed_complexPgResource = registry.pgResources["person_computed_complex"];
const argDetailsSimple39 = [];
const makeArgs39 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 0; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple39[i];
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
const resource_person_first_postPgResource = registry.pgResources["person_first_post"];
const argDetailsSimple40 = [];
const makeArgs40 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 0; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple40[i];
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
const resource_person_computed_first_arg_inoutPgResource = registry.pgResources["person_computed_first_arg_inout"];
const argDetailsSimple41 = [];
const makeArgs41 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 0; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple41[i];
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
const resource_person_friendsPgResource = registry.pgResources["person_friends"];
const getSelectPlanFromParentAndArgs12 = ($in, args, _info) => {
  if (!hasRecord($in)) {
    throw new Error(`Invalid plan, exepcted 'PgSelectSingleStep', 'PgInsertSingleStep', 'PgUpdateSingleStep' or 'PgDeleteSingleStep', but found ${$in}`);
  }
  const extraSelectArgs = makeArgs41(args);
  /**
   * An optimisation - if all our dependencies are
   * compatible with the expression's class plan then we
   * can inline ourselves into that, otherwise we must
   * issue the query separately.
   */
  const canUseExpressionDirectly = $in instanceof PgSelectSingleStep && extraSelectArgs.every(a => stepAMayDependOnStepB($in.getClassStep(), a.step));
  const $row = canUseExpressionDirectly ? $in : pgSelectSingleFromRecord($in.resource, $in.record());
  const selectArgs = [{
    step: $row.record()
  }, ...extraSelectArgs];
  if (resource_person_friendsPgResource.isUnique && !resource_person_friendsPgResource.codec.attributes && typeof resource_person_friendsPgResource.from === "function") {
    // This is a scalar computed attribute, let's inline the expression
    const placeholders = selectArgs.map((arg, i) => {
      if (i === 0) {
        return $row.getClassStep().alias;
      } else if ("pgCodec" in arg && arg.pgCodec) {
        return $row.placeholder(arg.step, arg.pgCodec);
      } else {
        return $row.placeholder(arg.step);
      }
    });
    return pgClassExpression($row, resource_person_friendsPgResource.codec)`${resource_person_friendsPgResource.from(...placeholders.map(placeholder => ({
      placeholder
    })))}`;
  }
  // PERF: or here, if scalar add select to `$row`?
  return resource_person_friendsPgResource.execute(selectArgs);
};
const argDetailsSimple42 = [];
const makeArgs42 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 0; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple42[i];
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
const resource_person_type_function_connectionPgResource = registry.pgResources["person_type_function_connection"];
const getSelectPlanFromParentAndArgs13 = ($in, args, _info) => {
  if (!hasRecord($in)) {
    throw new Error(`Invalid plan, exepcted 'PgSelectSingleStep', 'PgInsertSingleStep', 'PgUpdateSingleStep' or 'PgDeleteSingleStep', but found ${$in}`);
  }
  const extraSelectArgs = makeArgs42(args);
  /**
   * An optimisation - if all our dependencies are
   * compatible with the expression's class plan then we
   * can inline ourselves into that, otherwise we must
   * issue the query separately.
   */
  const canUseExpressionDirectly = $in instanceof PgSelectSingleStep && extraSelectArgs.every(a => stepAMayDependOnStepB($in.getClassStep(), a.step));
  const $row = canUseExpressionDirectly ? $in : pgSelectSingleFromRecord($in.resource, $in.record());
  const selectArgs = [{
    step: $row.record()
  }, ...extraSelectArgs];
  if (resource_person_type_function_connectionPgResource.isUnique && !resource_person_type_function_connectionPgResource.codec.attributes && typeof resource_person_type_function_connectionPgResource.from === "function") {
    // This is a scalar computed attribute, let's inline the expression
    const placeholders = selectArgs.map((arg, i) => {
      if (i === 0) {
        return $row.getClassStep().alias;
      } else if ("pgCodec" in arg && arg.pgCodec) {
        return $row.placeholder(arg.step, arg.pgCodec);
      } else {
        return $row.placeholder(arg.step);
      }
    });
    return pgClassExpression($row, resource_person_type_function_connectionPgResource.codec)`${resource_person_type_function_connectionPgResource.from(...placeholders.map(placeholder => ({
      placeholder
    })))}`;
  }
  // PERF: or here, if scalar add select to `$row`?
  return resource_person_type_function_connectionPgResource.execute(selectArgs);
};
const argDetailsSimple43 = [{
  graphqlArgName: "id",
  postgresArgName: "id",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs43 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 1; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple43[i];
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
const resource_person_type_functionPgResource = registry.pgResources["person_type_function"];
const argDetailsSimple44 = [];
const makeArgs44 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 0; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple44[i];
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
const resource_person_type_function_listPgResource = registry.pgResources["person_type_function_list"];
const resource_frmcdc_wrappedUrlPgResource = registry.pgResources["frmcdc_wrappedUrl"];
const resource_frmcdc_compoundTypePgResource = registry.pgResources["frmcdc_compoundType"];
const argDetailsSimple45 = [];
const makeArgs45 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 0; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple45[i];
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
const resource_compound_type_computed_fieldPgResource = registry.pgResources["compound_type_computed_field"];
function UUIDSerialize(value) {
  return "" + value;
}
const coerce = string => {
  if (!/^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i.test(string)) {
    throw new GraphQLError("Invalid UUID, expected 32 hexadecimal characters, optionally with hypens");
  }
  return string;
};
const resource_frmcdc_comptypePgResource = registry.pgResources["frmcdc_comptype"];
const resource_frmcdc_nestedCompoundTypePgResource = registry.pgResources["frmcdc_nestedCompoundType"];
function LTreeParseValue(value) {
  return value;
}
const isValidHstoreObject = obj => {
  if (obj === null) {
    // Null is okay
    return true;
  } else if (typeof obj === "object") {
    // A hash with string/null values is also okay
    const keys = Object.keys(obj);
    for (const key of keys) {
      const val = obj[key];
      if (val === null) {
        // Null is okay
      } else if (typeof val === "string") {
        // String is okay
      } else {
        // Everything else is invalid.
        return false;
      }
    }
    return true;
  } else {
    // Everything else is invalid.
    return false;
  }
};
const parseValueLiteral = (ast, variables) => {
  switch (ast.kind) {
    case Kind.INT:
    case Kind.FLOAT:
      // Number isn't really okay, but we'll coerce it to a string anyway.
      return String(parseFloat(ast.value));
    case Kind.STRING:
      // String is okay.
      return String(ast.value);
    case Kind.NULL:
      // Null is okay.
      return null;
    case Kind.VARIABLE:
      {
        // Variable is okay if that variable is either a string or null.
        const name = ast.name.value;
        const value = variables ? variables[name] : undefined;
        if (value === null || typeof value === "string") {
          return value;
        }
        return undefined;
      }
    default:
      // Everything else is invalid.
      return undefined;
  }
};
const resource_frmcdc_postPgResource = registry.pgResources["frmcdc_post"];
const argDetailsSimple46 = [];
const makeArgs46 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 0; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple46[i];
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
const resource_edge_case_computedPgResource = registry.pgResources["edge_case_computed"];
const argDetailsSimple47 = [];
const makeArgs47 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 0; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple47[i];
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
const resource_mutation_outPgResource = registry.pgResources["mutation_out"];
const argDetailsSimple48 = [];
const makeArgs48 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 0; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple48[i];
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
const resource_mutation_out_setofPgResource = registry.pgResources["mutation_out_setof"];
const argDetailsSimple49 = [];
const makeArgs49 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 0; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple49[i];
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
const resource_mutation_out_unnamedPgResource = registry.pgResources["mutation_out_unnamed"];
const argDetailsSimple50 = [];
const makeArgs50 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 0; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple50[i];
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
const resource_no_args_mutationPgResource = registry.pgResources["no_args_mutation"];
const argDetailsSimple51 = [{
  graphqlArgName: "i",
  postgresArgName: "i",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs51 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 1; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple51[i];
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
const resource_mutation_in_outPgResource = registry.pgResources["mutation_in_out"];
const argDetailsSimple52 = [{
  graphqlArgName: "i",
  postgresArgName: "i",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs52 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 1; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple52[i];
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
const resource_mutation_returns_table_one_colPgResource = registry.pgResources["mutation_returns_table_one_col"];
const argDetailsSimple53 = [{
  graphqlArgName: "json",
  postgresArgName: "json",
  pgCodec: TYPES.json,
  required: true,
  fetcher: null
}];
const makeArgs53 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 1; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple53[i];
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
const resource_json_identity_mutationPgResource = registry.pgResources["json_identity_mutation"];
const argDetailsSimple54 = [{
  graphqlArgName: "json",
  postgresArgName: "json",
  pgCodec: TYPES.jsonb,
  required: true,
  fetcher: null
}];
const makeArgs54 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 1; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple54[i];
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
const resource_jsonb_identity_mutationPgResource = registry.pgResources["jsonb_identity_mutation"];
const argDetailsSimple55 = [{
  graphqlArgName: "_theJson",
  postgresArgName: "_the_json",
  pgCodec: TYPES.jsonb,
  required: true,
  fetcher: null
}];
const makeArgs55 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 1; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple55[i];
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
const resource_jsonb_identity_mutation_plpgsqlPgResource = registry.pgResources["jsonb_identity_mutation_plpgsql"];
const argDetailsSimple56 = [{
  graphqlArgName: "_theJson",
  postgresArgName: "_the_json",
  pgCodec: TYPES.jsonb,
  required: false,
  fetcher: null
}];
const makeArgs56 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 1; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple56[i];
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
const resource_jsonb_identity_mutation_plpgsql_with_defaultPgResource = registry.pgResources["jsonb_identity_mutation_plpgsql_with_default"];
const argDetailsSimple57 = [{
  graphqlArgName: "i",
  postgresArgName: "i",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "ino",
  postgresArgName: "ino",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs57 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 2; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple57[i];
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
const resource_mutation_in_inoutPgResource = registry.pgResources["mutation_in_inout"];
const argDetailsSimple58 = [];
const makeArgs58 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 0; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple58[i];
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
const resource_mutation_out_outPgResource = registry.pgResources["mutation_out_out"];
const argDetailsSimple59 = [];
const makeArgs59 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 0; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple59[i];
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
const resource_mutation_out_out_setofPgResource = registry.pgResources["mutation_out_out_setof"];
const argDetailsSimple60 = [];
const makeArgs60 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 0; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple60[i];
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
const resource_mutation_out_out_unnamedPgResource = registry.pgResources["mutation_out_out_unnamed"];
const argDetailsSimple61 = [{
  graphqlArgName: "x",
  postgresArgName: "x",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "y",
  postgresArgName: "y",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "z",
  postgresArgName: "z",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs61 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 3; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple61[i];
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
const resource_int_set_mutationPgResource = registry.pgResources["int_set_mutation"];
const argDetailsSimple62 = [];
const makeArgs62 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 0; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple62[i];
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
const resource_mutation_out_unnamed_out_out_unnamedPgResource = registry.pgResources["mutation_out_unnamed_out_out_unnamed"];
const argDetailsSimple63 = [{
  graphqlArgName: "i",
  postgresArgName: "i",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs63 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 1; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple63[i];
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
const resource_mutation_returns_table_multi_colPgResource = registry.pgResources["mutation_returns_table_multi_col"];
const argDetailsSimple64 = [{
  graphqlArgName: "leftArm",
  postgresArgName: "left_arm",
  pgCodec: leftArmCodec,
  required: true,
  fetcher: null
}];
const makeArgs64 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 1; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple64[i];
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
const resource_left_arm_identityPgResource = registry.pgResources["left_arm_identity"];
const argDetailsSimple65 = [];
const makeArgs65 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 0; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple65[i];
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
const resource_issue756_mutationPgResource = registry.pgResources["issue756_mutation"];
const argDetailsSimple66 = [];
const makeArgs66 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 0; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple66[i];
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
const resource_issue756_set_mutationPgResource = registry.pgResources["issue756_set_mutation"];
const argDetailsSimple67 = [{
  graphqlArgName: "a",
  postgresArgName: "a",
  pgCodec: TYPES.bigint,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "b",
  postgresArgName: "b",
  pgCodec: TYPES.boolean,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "c",
  postgresArgName: "c",
  pgCodec: TYPES.varchar,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "d",
  postgresArgName: "d",
  pgCodec: int4ArrayCodec,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "e",
  postgresArgName: "e",
  pgCodec: TYPES.json,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "f",
  postgresArgName: "f",
  pgCodec: floatrangeCodec,
  required: true,
  fetcher: null
}];
const makeArgs67 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 6; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple67[i];
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
const resource_types_mutationPgResource = registry.pgResources["types_mutation"];
const argDetailsSimple68 = [{
  graphqlArgName: "i1",
  postgresArgName: "i1",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs68 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 1; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple68[i];
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
const resource_mutation_out_out_compound_typePgResource = registry.pgResources["mutation_out_out_compound_type"];
const argDetailsSimple69 = [{
  graphqlArgName: "id",
  postgresArgName: "id",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs69 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 1; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple69[i];
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
const resource_table_mutationPgResource = registry.pgResources["table_mutation"];
const argDetailsSimple70 = [{
  graphqlArgName: "a",
  postgresArgName: "a",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "b",
  postgresArgName: "b",
  pgCodec: TYPES.text,
  required: true,
  fetcher: null
}];
const makeArgs70 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 2; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple70[i];
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
const resource_mutation_out_complexPgResource = registry.pgResources["mutation_out_complex"];
const argDetailsSimple71 = [{
  graphqlArgName: "a",
  postgresArgName: "a",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "b",
  postgresArgName: "b",
  pgCodec: TYPES.text,
  required: true,
  fetcher: null
}];
const makeArgs71 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 2; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple71[i];
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
const resource_mutation_out_complex_setofPgResource = registry.pgResources["mutation_out_complex_setof"];
const argDetailsSimple72 = [];
const makeArgs72 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 0; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple72[i];
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
const resource_mutation_out_tablePgResource = registry.pgResources["mutation_out_table"];
const argDetailsSimple73 = [];
const makeArgs73 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 0; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple73[i];
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
const resource_mutation_out_table_setofPgResource = registry.pgResources["mutation_out_table_setof"];
const argDetailsSimple74 = [];
const makeArgs74 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 0; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple74[i];
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
const resource_table_set_mutationPgResource = registry.pgResources["table_set_mutation"];
const specFromArgs = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.MyTable, $nodeId);
};
const specFromArgs2 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.PersonSecret, $nodeId);
};
const specFromArgs3 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.CompoundKey, $nodeId);
};
const specFromArgs4 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.NullTestRecord, $nodeId);
};
const specFromArgs5 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.LeftArm, $nodeId);
};
const specFromArgs6 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Issue756, $nodeId);
};
const specFromArgs7 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Person, $nodeId);
};
const specFromArgs8 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.MyTable, $nodeId);
};
const specFromArgs9 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.PersonSecret, $nodeId);
};
const specFromArgs10 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.CompoundKey, $nodeId);
};
const specFromArgs11 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.NullTestRecord, $nodeId);
};
const specFromArgs12 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.LeftArm, $nodeId);
};
const specFromArgs13 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Issue756, $nodeId);
};
const specFromArgs14 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Person, $nodeId);
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

  """Get a single \`MyTable\`."""
  myTableById(id: Int!): MyTable

  """Get a single \`PersonSecret\`."""
  personSecretByPersonId(personId: Int!): PersonSecret @deprecated(reason: "This is deprecated (comment on table c.person_secret).")

  """Get a single \`CompoundKey\`."""
  compoundKeyByPersonId1AndPersonId2(personId1: Int!, personId2: Int!): CompoundKey

  """Get a single \`NullTestRecord\`."""
  nullTestRecordById(id: Int!): NullTestRecord

  """Get a single \`LeftArm\`."""
  leftArmById(id: Int!): LeftArm

  """Get a single \`LeftArm\`."""
  leftArmByPersonId(personId: Int!): LeftArm

  """Get a single \`Issue756\`."""
  issue756ById(id: Int!): Issue756

  """Get a single \`Person\`."""
  personById(id: Int!): Person

  """Get a single \`Person\`."""
  personByEmail(email: Email!): Person
  currentUserId: Int
  funcOut: Int

  """Reads and enables pagination through a set of \`Int4\`."""
  funcOutSetof(
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
  ): FuncOutSetofConnection
  funcOutUnnamed: Int
  noArgsQuery: Int
  funcInOut(i: Int): Int

  """Reads and enables pagination through a set of \`Int4\`."""
  funcReturnsTableOneCol(
    i: Int

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
  ): FuncReturnsTableOneColConnection
  jsonIdentity(json: JSON): JSON
  jsonbIdentity(json: JSON): JSON
  funcInInout(i: Int, ino: Int): Int
  funcOutOut: FuncOutOutRecord

  """Reads and enables pagination through a set of \`FuncOutOutSetofRecord\`."""
  funcOutOutSetof(
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
  ): FuncOutOutSetofConnection
  funcOutOutUnnamed: FuncOutOutUnnamedRecord
  funcOutUnnamedOutOutUnnamed: FuncOutUnnamedOutOutUnnamedRecord

  """
  Reads and enables pagination through a set of \`FuncReturnsTableMultiColRecord\`.
  """
  funcReturnsTableMultiCol(
    i: Int

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
  ): FuncReturnsTableMultiColConnection

  """Reads and enables pagination through a set of \`Int4\`."""
  intSetQuery(
    x: Int
    y: Int
    z: Int

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
  ): IntSetQueryConnection
  searchTestSummariesList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int
  ): [SearchTestSummariesRecord]
  returnTableWithoutGrants: CompoundKey
  typesQuery(a: BigInt!, b: Boolean!, c: String!, d: [Int]!, e: JSON!, f: FloatRangeInput!): Boolean
  funcOutOutCompoundType(i1: Int): FuncOutOutCompoundTypeRecord
  queryOutputTwoRows(leftArmId: Int, postId: Int, txt: String): QueryOutputTwoRowsRecord

  """Reads and enables pagination through a set of \`CompoundType\`."""
  compoundTypeSetQuery(
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
  ): CompoundTypesConnection
  tableQuery(id: Int): Post
  funcOutComplex(a: Int, b: String): FuncOutComplexRecord

  """
  Reads and enables pagination through a set of \`FuncOutComplexSetofRecord\`.
  """
  funcOutComplexSetof(
    a: Int
    b: String

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
  ): FuncOutComplexSetofConnection

  """Reads and enables pagination through a set of \`Person\`."""
  badlyBehavedFunction(
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
  ): PeopleConnection @deprecated(reason: "This is deprecated (comment on function c.badly_behaved_function).")
  funcOutTable: Person

  """Reads and enables pagination through a set of \`Person\`."""
  funcOutTableSetof(
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
  ): PeopleConnection

  """Reads and enables pagination through a set of \`Person\`."""
  tableSetQuery(
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

    """The method to use when ordering \`Person\`."""
    orderBy: [PeopleOrderBy!]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: PersonCondition
  ): PeopleConnection

  """Reads and enables pagination through a set of \`Person\`."""
  tableSetQueryPlpgsql(
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
  ): PeopleConnection

  """Reads a single \`MyTable\` using its globally unique \`ID\`."""
  myTable(
    """The globally unique \`ID\` to be used in selecting a single \`MyTable\`."""
    nodeId: ID!
  ): MyTable

  """Reads a single \`PersonSecret\` using its globally unique \`ID\`."""
  personSecret(
    """
    The globally unique \`ID\` to be used in selecting a single \`PersonSecret\`.
    """
    nodeId: ID!
  ): PersonSecret @deprecated(reason: "This is deprecated (comment on table c.person_secret).")

  """Reads a single \`CompoundKey\` using its globally unique \`ID\`."""
  compoundKey(
    """
    The globally unique \`ID\` to be used in selecting a single \`CompoundKey\`.
    """
    nodeId: ID!
  ): CompoundKey

  """Reads a single \`NullTestRecord\` using its globally unique \`ID\`."""
  nullTestRecord(
    """
    The globally unique \`ID\` to be used in selecting a single \`NullTestRecord\`.
    """
    nodeId: ID!
  ): NullTestRecord

  """Reads a single \`LeftArm\` using its globally unique \`ID\`."""
  leftArm(
    """The globally unique \`ID\` to be used in selecting a single \`LeftArm\`."""
    nodeId: ID!
  ): LeftArm

  """Reads a single \`Issue756\` using its globally unique \`ID\`."""
  issue756(
    """The globally unique \`ID\` to be used in selecting a single \`Issue756\`."""
    nodeId: ID!
  ): Issue756

  """Reads a single \`Person\` using its globally unique \`ID\`."""
  person(
    """The globally unique \`ID\` to be used in selecting a single \`Person\`."""
    nodeId: ID!
  ): Person

  """Reads and enables pagination through a set of \`MyTable\`."""
  allMyTables(
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

    """The method to use when ordering \`MyTable\`."""
    orderBy: [MyTablesOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: MyTableCondition
  ): MyTablesConnection

  """Reads and enables pagination through a set of \`PersonSecret\`."""
  allPersonSecrets(
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

    """The method to use when ordering \`PersonSecret\`."""
    orderBy: [PersonSecretsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: PersonSecretCondition
  ): PersonSecretsConnection @deprecated(reason: "This is deprecated (comment on table c.person_secret).")

  """Reads and enables pagination through a set of \`CompoundKey\`."""
  allCompoundKeys(
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

    """The method to use when ordering \`CompoundKey\`."""
    orderBy: [CompoundKeysOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: CompoundKeyCondition
  ): CompoundKeysConnection

  """Reads and enables pagination through a set of \`NullTestRecord\`."""
  allNullTestRecords(
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

    """The method to use when ordering \`NullTestRecord\`."""
    orderBy: [NullTestRecordsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: NullTestRecordCondition
  ): NullTestRecordsConnection

  """Reads and enables pagination through a set of \`EdgeCase\`."""
  allEdgeCases(
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

    """The method to use when ordering \`EdgeCase\`."""
    orderBy: [EdgeCasesOrderBy!] = [NATURAL]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: EdgeCaseCondition
  ): EdgeCasesConnection

  """Reads and enables pagination through a set of \`LeftArm\`."""
  allLeftArms(
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

    """The method to use when ordering \`LeftArm\`."""
    orderBy: [LeftArmsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: LeftArmCondition
  ): LeftArmsConnection

  """Reads and enables pagination through a set of \`Issue756\`."""
  allIssue756S(
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

    """The method to use when ordering \`Issue756\`."""
    orderBy: [Issue756SOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: Issue756Condition
  ): Issue756SConnection

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

    """The method to use when ordering \`Person\`."""
    orderBy: [PeopleOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: PersonCondition
  ): PeopleConnection
}

"""An object with a globally unique \`ID\`."""
interface Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
}

type MyTable implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  jsonData: JSON
}

"""
A JavaScript object encoded in the JSON format as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).
"""
scalar JSON

"""Tracks the person's secret"""
type PersonSecret implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  personId: Int!

  """A secret held by the associated Person"""
  secret: String

  """Reads a single \`Person\` that is related to this \`PersonSecret\`."""
  personBySecret: Person

  """The \`Person\` this \`PersonSecret\` belongs to."""
  personByPersonId: Person
}

"""Person test comment"""
type Person implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  computedOut: String!

  """The first name of the person."""
  firstName: String
  computedOutOut: PersonComputedOutOutRecord
  computedInout(ino: String): String
  computedInoutOut(ino: String): PersonComputedInoutOutRecord
  exists(email: Email): Boolean @deprecated(reason: "This is deprecated (comment on function c.person_exists).")
  computedFirstArgInoutOut: PersonComputedFirstArgInoutOutRecord
  computedComplex(a: Int, b: String): PersonComputedComplexRecord

  """The first post by the person."""
  firstPost: Post
  computedFirstArgInout: Person

  """Reads and enables pagination through a set of \`Person\`."""
  friends(
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

    """The method to use when ordering \`Person\`."""
    orderBy: [PeopleOrderBy!]
  ): PeopleConnection!

  """Reads and enables pagination through a set of \`Type\`."""
  typeFunctionConnection(
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
  ): TypesConnection!
  typeFunction(id: Int): Type
  typeFunctionList: [Type]

  """The primary unique identifier for the person"""
  id: Int!

  """The person’s name"""
  name: String!
  aliases: [String]!
  about: String
  email: Email!
  site: WrappedUrl @deprecated(reason: "Don’t use me")
  config: KeyValueHash
  lastLoginFromIp: InternetAddress
  lastLoginFromSubnet: String
  userMac: String
  createdAt: Datetime

  """This \`Person\`'s \`PersonSecret\`."""
  personSecretByPersonId: PersonSecret @deprecated(reason: "This is deprecated (comment on table c.person_secret).")

  """Reads a single \`LeftArm\` that is related to this \`Person\`."""
  leftArmByPersonId: LeftArm

  """Reads and enables pagination through a set of \`CompoundKey\`."""
  compoundKeysByPersonId1(
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

    """The method to use when ordering \`CompoundKey\`."""
    orderBy: [CompoundKeysOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: CompoundKeyCondition
  ): CompoundKeysConnection!

  """Reads and enables pagination through a set of \`CompoundKey\`."""
  compoundKeysByPersonId2(
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

    """The method to use when ordering \`CompoundKey\`."""
    orderBy: [CompoundKeysOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: CompoundKeyCondition
  ): CompoundKeysConnection!

  """Reads and enables pagination through a set of \`PersonSecret\`."""
  personSecretsBySecret(
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

    """The method to use when ordering \`PersonSecret\`."""
    orderBy: [PersonSecretsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: PersonSecretCondition
  ): PersonSecretsConnection! @deprecated(reason: "This is deprecated (comment on table c.person_secret).")
}

type PersonComputedOutOutRecord {
  o1: String
  o2: String
}

type PersonComputedInoutOutRecord {
  ino: String
  o: String
}

scalar Email

type PersonComputedFirstArgInoutOutRecord {
  person: Person
  o: Int
}

type PersonComputedComplexRecord {
  x: Int
  y: CompoundType
  z: Person
}

"""Awesome feature!"""
type CompoundType {
  computedField: Int
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

type Post {
  id: Int!
  headline: String!
  body: String
  authorId: Int
  enums: [AnEnum]
  comptypes: [Comptype]
}

enum AnEnum {
  AWAITING
  REJECTED
  PUBLISHED
  ASTERISK
  ASTERISK_ASTERISK
  ASTERISK_ASTERISK_ASTERISK
  FOO_ASTERISK
  FOO_ASTERISK_
  _FOO_ASTERISK
  ASTERISK_BAR
  ASTERISK_BAR_
  _ASTERISK_BAR_
  ASTERISK_BAZ_ASTERISK
  _ASTERISK_BAZ_ASTERISK_
  PERCENT
  GREATER_THAN_OR_EQUAL
  LIKE
  DOLLAR
}

type Comptype {
  schedule: Datetime
  isOptimised: Boolean
}

"""
A point in time as described by the [ISO
8601](https://en.wikipedia.org/wiki/ISO_8601) and, if it has a timezone, [RFC
3339](https://datatracker.ietf.org/doc/html/rfc3339) standards. Input values
that do not conform to both ISO 8601 and RFC 3339 may be coerced, which may lead
to unexpected results.
"""
scalar Datetime

"""A connection to a list of \`Person\` values."""
type PeopleConnection {
  """A list of \`Person\` objects."""
  nodes: [Person]!

  """
  A list of edges which contains the \`Person\` and cursor to aid in pagination.
  """
  edges: [PeopleEdge]!

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
  node: Person
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

"""Methods to use when ordering \`Person\`."""
enum PeopleOrderBy {
  NATURAL
  COMPUTED_OUT_ASC
  COMPUTED_OUT_DESC
  FIRST_NAME_ASC
  FIRST_NAME_DESC
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  NAME_ASC
  NAME_DESC
  ABOUT_ASC
  ABOUT_DESC
  EMAIL_ASC
  EMAIL_DESC
  SITE_ASC
  SITE_DESC
  CONFIG_ASC
  CONFIG_DESC
  LAST_LOGIN_FROM_IP_ASC
  LAST_LOGIN_FROM_IP_DESC
  LAST_LOGIN_FROM_SUBNET_ASC
  LAST_LOGIN_FROM_SUBNET_DESC
  USER_MAC_ASC
  USER_MAC_DESC
  CREATED_AT_ASC
  CREATED_AT_DESC
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

type Type {
  id: Int!
  smallint: Int!
  bigint: BigInt!
  numeric: BigFloat!
  decimal: BigFloat!
  boolean: Boolean!
  varchar: String!
  enum: Color!
  enumArray: [Color]!
  domain: AnInt!
  domain2: AnotherInt!
  textArray: [String]!
  json: JSON!
  jsonb: JSON!
  nullableRange: BigFloatRange
  numrange: BigFloatRange!
  daterange: DateRange!
  anIntRange: AnIntRange!
  timestamp: Datetime!
  timestamptz: Datetime!
  date: Date!
  time: Time!
  timetz: Time!
  interval: Interval!
  intervalArray: [Interval]!
  money: Float!
  compoundType: CompoundType!
  nestedCompoundType: NestedCompoundType!
  nullableCompoundType: CompoundType
  nullableNestedCompoundType: NestedCompoundType
  point: Point!
  nullablePoint: Point
  inet: InternetAddress
  cidr: String
  macaddr: String
  regproc: RegProc
  regprocedure: RegProcedure
  regoper: RegOper
  regoperator: RegOperator
  regclass: RegClass
  regtype: RegType
  regconfig: RegConfig
  regdictionary: RegDictionary
  textArrayDomain: [String]
  int8ArrayDomain: [BigInt]
  bytea: Base64EncodedBinary
  byteaArray: [Base64EncodedBinary]
  ltree: LTree
  ltreeArray: [LTree]
}

"""
A signed eight-byte integer. The upper big integer values are greater than the
max value for a JavaScript number. Therefore all big integers will be output as
strings and not numbers.
"""
scalar BigInt

"""
A floating point number that requires more precision than IEEE 754 binary 64
"""
scalar BigFloat

scalar AnInt

scalar AnotherInt

"""A range of \`BigFloat\`."""
type BigFloatRange {
  """The starting bound of our range."""
  start: BigFloatRangeBound

  """The ending bound of our range."""
  end: BigFloatRangeBound
}

"""
The value at one end of a range. A range can either include this value, or not.
"""
type BigFloatRangeBound {
  """The value at one end of our range."""
  value: BigFloat!

  """Whether or not the value of this bound is included in the range."""
  inclusive: Boolean!
}

"""A range of \`Date\`."""
type DateRange {
  """The starting bound of our range."""
  start: DateRangeBound

  """The ending bound of our range."""
  end: DateRangeBound
}

"""
The value at one end of a range. A range can either include this value, or not.
"""
type DateRangeBound {
  """The value at one end of our range."""
  value: Date!

  """Whether or not the value of this bound is included in the range."""
  inclusive: Boolean!
}

"""A calendar date in YYYY-MM-DD format."""
scalar Date

"""A range of \`AnInt\`."""
type AnIntRange {
  """The starting bound of our range."""
  start: AnIntRangeBound

  """The ending bound of our range."""
  end: AnIntRangeBound
}

"""
The value at one end of a range. A range can either include this value, or not.
"""
type AnIntRangeBound {
  """The value at one end of our range."""
  value: AnInt!

  """Whether or not the value of this bound is included in the range."""
  inclusive: Boolean!
}

"""
The exact time of day, does not include the date. May or may not have a timezone offset.
"""
scalar Time

type NestedCompoundType {
  a: CompoundType
  b: CompoundType
  bazBuz: Int
}

"""A cartesian point."""
type Point {
  x: Float!
  y: Float!
}

"""An IPv4 or IPv6 host address, and optionally its subnet."""
scalar InternetAddress

"""A builtin object identifier type for a function name"""
scalar RegProc

"""A builtin object identifier type for a function with argument types"""
scalar RegProcedure

"""A builtin object identifier type for an operator"""
scalar RegOper

"""A builtin object identifier type for an operator with argument types"""
scalar RegOperator

"""A builtin object identifier type for a relation name"""
scalar RegClass

"""A builtin object identifier type for a data type name"""
scalar RegType

"""A builtin object identifier type for a text search configuration"""
scalar RegConfig

"""A builtin object identifier type for a text search dictionary"""
scalar RegDictionary

"""Binary data encoded using Base64"""
scalar Base64EncodedBinary

"""
Represents an \`ltree\` hierarchical label tree as outlined in https://www.postgresql.org/docs/current/ltree.html
"""
scalar LTree

"""A \`Type\` edge in the connection."""
type TypesEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Type\` at the end of the edge."""
  node: Type
}

type WrappedUrl {
  url: NotNullUrl!
}

scalar NotNullUrl

"""
A set of key/value pairs, keys are strings, values may be a string or null. Exposed as a JSON object.
"""
scalar KeyValueHash

"""Tracks metadata about the left arms of various people"""
type LeftArm implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  personId: Int
  lengthInMetres: Float
  mood: String!

  """Reads a single \`Person\` that is related to this \`LeftArm\`."""
  personByPersonId: Person
}

"""A connection to a list of \`CompoundKey\` values."""
type CompoundKeysConnection {
  """A list of \`CompoundKey\` objects."""
  nodes: [CompoundKey]!

  """
  A list of edges which contains the \`CompoundKey\` and cursor to aid in pagination.
  """
  edges: [CompoundKeysEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`CompoundKey\` you could get from the connection."""
  totalCount: Int!
}

type CompoundKey implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  personId2: Int!
  personId1: Int!
  extra: Boolean

  """Reads a single \`Person\` that is related to this \`CompoundKey\`."""
  personByPersonId1: Person

  """Reads a single \`Person\` that is related to this \`CompoundKey\`."""
  personByPersonId2: Person
}

"""A \`CompoundKey\` edge in the connection."""
type CompoundKeysEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`CompoundKey\` at the end of the edge."""
  node: CompoundKey
}

"""Methods to use when ordering \`CompoundKey\`."""
enum CompoundKeysOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  PERSON_ID_2_ASC
  PERSON_ID_2_DESC
  PERSON_ID_1_ASC
  PERSON_ID_1_DESC
  EXTRA_ASC
  EXTRA_DESC
}

"""
A condition to be used against \`CompoundKey\` object types. All fields are tested
for equality and combined with a logical ‘and.’
"""
input CompoundKeyCondition {
  """Checks for equality with the object’s \`personId2\` field."""
  personId2: Int

  """Checks for equality with the object’s \`personId1\` field."""
  personId1: Int

  """Checks for equality with the object’s \`extra\` field."""
  extra: Boolean
}

"""A connection to a list of \`PersonSecret\` values."""
type PersonSecretsConnection {
  """A list of \`PersonSecret\` objects."""
  nodes: [PersonSecret]!

  """
  A list of edges which contains the \`PersonSecret\` and cursor to aid in pagination.
  """
  edges: [PersonSecretsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`PersonSecret\` you could get from the connection."""
  totalCount: Int!
}

"""A \`PersonSecret\` edge in the connection."""
type PersonSecretsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`PersonSecret\` at the end of the edge."""
  node: PersonSecret
}

"""Methods to use when ordering \`PersonSecret\`."""
enum PersonSecretsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  PERSON_ID_ASC
  PERSON_ID_DESC
  SECRET_ASC
  SECRET_DESC
}

"""
A condition to be used against \`PersonSecret\` object types. All fields are
tested for equality and combined with a logical ‘and.’
"""
input PersonSecretCondition {
  """Checks for equality with the object’s \`personId\` field."""
  personId: Int

  """Checks for equality with the object’s \`secret\` field."""
  secret: String
}

type NullTestRecord implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  nullableText: String
  nullableInt: Int
  nonNullText: String!
}

type Issue756 implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  ts: NotNullTimestamp!
}

scalar NotNullTimestamp

"""A connection to a list of \`Int\` values."""
type FuncOutSetofConnection {
  """A list of \`Int\` objects."""
  nodes: [Int]!

  """
  A list of edges which contains the \`Int\` and cursor to aid in pagination.
  """
  edges: [FuncOutSetofEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Int\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Int\` edge in the connection."""
type FuncOutSetofEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Int\` at the end of the edge."""
  node: Int
}

"""A connection to a list of \`Int\` values."""
type FuncReturnsTableOneColConnection {
  """A list of \`Int\` objects."""
  nodes: [Int]!

  """
  A list of edges which contains the \`Int\` and cursor to aid in pagination.
  """
  edges: [FuncReturnsTableOneColEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Int\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Int\` edge in the connection."""
type FuncReturnsTableOneColEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Int\` at the end of the edge."""
  node: Int
}

type FuncOutOutRecord {
  firstOut: Int
  secondOut: String
}

"""A connection to a list of \`FuncOutOutSetofRecord\` values."""
type FuncOutOutSetofConnection {
  """A list of \`FuncOutOutSetofRecord\` objects."""
  nodes: [FuncOutOutSetofRecord]!

  """
  A list of edges which contains the \`FuncOutOutSetofRecord\` and cursor to aid in pagination.
  """
  edges: [FuncOutOutSetofEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """
  The count of *all* \`FuncOutOutSetofRecord\` you could get from the connection.
  """
  totalCount: Int!
}

type FuncOutOutSetofRecord {
  o1: Int
  o2: String
}

"""A \`FuncOutOutSetofRecord\` edge in the connection."""
type FuncOutOutSetofEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`FuncOutOutSetofRecord\` at the end of the edge."""
  node: FuncOutOutSetofRecord
}

type FuncOutOutUnnamedRecord {
  arg1: Int
  arg2: String
}

type FuncOutUnnamedOutOutUnnamedRecord {
  arg1: Int
  o2: String
  arg3: Int
}

"""A connection to a list of \`FuncReturnsTableMultiColRecord\` values."""
type FuncReturnsTableMultiColConnection {
  """A list of \`FuncReturnsTableMultiColRecord\` objects."""
  nodes: [FuncReturnsTableMultiColRecord]!

  """
  A list of edges which contains the \`FuncReturnsTableMultiColRecord\` and cursor to aid in pagination.
  """
  edges: [FuncReturnsTableMultiColEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """
  The count of *all* \`FuncReturnsTableMultiColRecord\` you could get from the connection.
  """
  totalCount: Int!
}

type FuncReturnsTableMultiColRecord {
  col1: Int
  col2: String
}

"""A \`FuncReturnsTableMultiColRecord\` edge in the connection."""
type FuncReturnsTableMultiColEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`FuncReturnsTableMultiColRecord\` at the end of the edge."""
  node: FuncReturnsTableMultiColRecord
}

"""A connection to a list of \`Int\` values."""
type IntSetQueryConnection {
  """A list of \`Int\` objects."""
  nodes: [Int]!

  """
  A list of edges which contains the \`Int\` and cursor to aid in pagination.
  """
  edges: [IntSetQueryEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Int\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Int\` edge in the connection."""
type IntSetQueryEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Int\` at the end of the edge."""
  node: Int
}

type SearchTestSummariesRecord {
  id: Int
  totalDuration: Interval
}

"""A range of \`Float\`."""
input FloatRangeInput {
  """The starting bound of our range."""
  start: FloatRangeBoundInput

  """The ending bound of our range."""
  end: FloatRangeBoundInput
}

"""
The value at one end of a range. A range can either include this value, or not.
"""
input FloatRangeBoundInput {
  """The value at one end of our range."""
  value: Float!

  """Whether or not the value of this bound is included in the range."""
  inclusive: Boolean!
}

type FuncOutOutCompoundTypeRecord {
  o1: Int
  o2: CompoundType
}

type QueryOutputTwoRowsRecord {
  txt: String
  leftArm: LeftArm
  post: Post
}

"""A connection to a list of \`CompoundType\` values."""
type CompoundTypesConnection {
  """A list of \`CompoundType\` objects."""
  nodes: [CompoundType]!

  """
  A list of edges which contains the \`CompoundType\` and cursor to aid in pagination.
  """
  edges: [CompoundTypesEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`CompoundType\` you could get from the connection."""
  totalCount: Int!
}

"""A \`CompoundType\` edge in the connection."""
type CompoundTypesEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`CompoundType\` at the end of the edge."""
  node: CompoundType
}

type FuncOutComplexRecord {
  x: Int
  y: CompoundType
  z: Person
}

"""A connection to a list of \`FuncOutComplexSetofRecord\` values."""
type FuncOutComplexSetofConnection {
  """A list of \`FuncOutComplexSetofRecord\` objects."""
  nodes: [FuncOutComplexSetofRecord]!

  """
  A list of edges which contains the \`FuncOutComplexSetofRecord\` and cursor to aid in pagination.
  """
  edges: [FuncOutComplexSetofEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """
  The count of *all* \`FuncOutComplexSetofRecord\` you could get from the connection.
  """
  totalCount: Int!
}

type FuncOutComplexSetofRecord {
  x: Int
  y: CompoundType
  z: Person
}

"""A \`FuncOutComplexSetofRecord\` edge in the connection."""
type FuncOutComplexSetofEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`FuncOutComplexSetofRecord\` at the end of the edge."""
  node: FuncOutComplexSetofRecord
}

"""
A condition to be used against \`Person\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input PersonCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`name\` field."""
  name: String

  """Checks for equality with the object’s \`aliases\` field."""
  aliases: [String]

  """Checks for equality with the object’s \`about\` field."""
  about: String

  """Checks for equality with the object’s \`email\` field."""
  email: Email

  """Checks for equality with the object’s \`site\` field."""
  site: WrappedUrlInput

  """Checks for equality with the object’s \`config\` field."""
  config: KeyValueHash

  """Checks for equality with the object’s \`lastLoginFromIp\` field."""
  lastLoginFromIp: InternetAddress

  """Checks for equality with the object’s \`lastLoginFromSubnet\` field."""
  lastLoginFromSubnet: String

  """Checks for equality with the object’s \`userMac\` field."""
  userMac: String

  """Checks for equality with the object’s \`createdAt\` field."""
  createdAt: Datetime

  """Checks for equality with the object’s \`computedOut\` field."""
  computedOut: String
}

"""An input for mutations affecting \`WrappedUrl\`"""
input WrappedUrlInput {
  url: NotNullUrl!
}

"""A connection to a list of \`MyTable\` values."""
type MyTablesConnection {
  """A list of \`MyTable\` objects."""
  nodes: [MyTable]!

  """
  A list of edges which contains the \`MyTable\` and cursor to aid in pagination.
  """
  edges: [MyTablesEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`MyTable\` you could get from the connection."""
  totalCount: Int!
}

"""A \`MyTable\` edge in the connection."""
type MyTablesEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`MyTable\` at the end of the edge."""
  node: MyTable
}

"""Methods to use when ordering \`MyTable\`."""
enum MyTablesOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  JSON_DATA_ASC
  JSON_DATA_DESC
}

"""
A condition to be used against \`MyTable\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input MyTableCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`jsonData\` field."""
  jsonData: JSON
}

"""A connection to a list of \`NullTestRecord\` values."""
type NullTestRecordsConnection {
  """A list of \`NullTestRecord\` objects."""
  nodes: [NullTestRecord]!

  """
  A list of edges which contains the \`NullTestRecord\` and cursor to aid in pagination.
  """
  edges: [NullTestRecordsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`NullTestRecord\` you could get from the connection."""
  totalCount: Int!
}

"""A \`NullTestRecord\` edge in the connection."""
type NullTestRecordsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`NullTestRecord\` at the end of the edge."""
  node: NullTestRecord
}

"""Methods to use when ordering \`NullTestRecord\`."""
enum NullTestRecordsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  NULLABLE_TEXT_ASC
  NULLABLE_TEXT_DESC
  NULLABLE_INT_ASC
  NULLABLE_INT_DESC
  NON_NULL_TEXT_ASC
  NON_NULL_TEXT_DESC
}

"""
A condition to be used against \`NullTestRecord\` object types. All fields are
tested for equality and combined with a logical ‘and.’
"""
input NullTestRecordCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`nullableText\` field."""
  nullableText: String

  """Checks for equality with the object’s \`nullableInt\` field."""
  nullableInt: Int

  """Checks for equality with the object’s \`nonNullText\` field."""
  nonNullText: String
}

"""A connection to a list of \`EdgeCase\` values."""
type EdgeCasesConnection {
  """A list of \`EdgeCase\` objects."""
  nodes: [EdgeCase]!

  """
  A list of edges which contains the \`EdgeCase\` and cursor to aid in pagination.
  """
  edges: [EdgeCasesEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`EdgeCase\` you could get from the connection."""
  totalCount: Int!
}

type EdgeCase {
  computed: String
  notNullHasDefault: Boolean!
  wontCastEasy: Int
  rowId: Int
}

"""A \`EdgeCase\` edge in the connection."""
type EdgeCasesEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`EdgeCase\` at the end of the edge."""
  node: EdgeCase
}

"""Methods to use when ordering \`EdgeCase\`."""
enum EdgeCasesOrderBy {
  NATURAL
  NOT_NULL_HAS_DEFAULT_ASC
  NOT_NULL_HAS_DEFAULT_DESC
  WONT_CAST_EASY_ASC
  WONT_CAST_EASY_DESC
  ROW_ID_ASC
  ROW_ID_DESC
}

"""
A condition to be used against \`EdgeCase\` object types. All fields are tested
for equality and combined with a logical ‘and.’
"""
input EdgeCaseCondition {
  """Checks for equality with the object’s \`notNullHasDefault\` field."""
  notNullHasDefault: Boolean

  """Checks for equality with the object’s \`wontCastEasy\` field."""
  wontCastEasy: Int

  """Checks for equality with the object’s \`rowId\` field."""
  rowId: Int
}

"""A connection to a list of \`LeftArm\` values."""
type LeftArmsConnection {
  """A list of \`LeftArm\` objects."""
  nodes: [LeftArm]!

  """
  A list of edges which contains the \`LeftArm\` and cursor to aid in pagination.
  """
  edges: [LeftArmsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`LeftArm\` you could get from the connection."""
  totalCount: Int!
}

"""A \`LeftArm\` edge in the connection."""
type LeftArmsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`LeftArm\` at the end of the edge."""
  node: LeftArm
}

"""Methods to use when ordering \`LeftArm\`."""
enum LeftArmsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  PERSON_ID_ASC
  PERSON_ID_DESC
  LENGTH_IN_METRES_ASC
  LENGTH_IN_METRES_DESC
  MOOD_ASC
  MOOD_DESC
}

"""
A condition to be used against \`LeftArm\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input LeftArmCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`personId\` field."""
  personId: Int

  """Checks for equality with the object’s \`lengthInMetres\` field."""
  lengthInMetres: Float

  """Checks for equality with the object’s \`mood\` field."""
  mood: String
}

"""A connection to a list of \`Issue756\` values."""
type Issue756SConnection {
  """A list of \`Issue756\` objects."""
  nodes: [Issue756]!

  """
  A list of edges which contains the \`Issue756\` and cursor to aid in pagination.
  """
  edges: [Issue756SEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Issue756\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Issue756\` edge in the connection."""
type Issue756SEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Issue756\` at the end of the edge."""
  node: Issue756
}

"""Methods to use when ordering \`Issue756\`."""
enum Issue756SOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  TS_ASC
  TS_DESC
}

"""
A condition to be used against \`Issue756\` object types. All fields are tested
for equality and combined with a logical ‘and.’
"""
input Issue756Condition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`ts\` field."""
  ts: NotNullTimestamp
}

"""
The root mutation type which contains root level fields which mutate data.
"""
type Mutation {
  mutationOut(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: MutationOutInput!
  ): MutationOutPayload
  mutationOutSetof(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: MutationOutSetofInput!
  ): MutationOutSetofPayload
  mutationOutUnnamed(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: MutationOutUnnamedInput!
  ): MutationOutUnnamedPayload
  noArgsMutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: NoArgsMutationInput!
  ): NoArgsMutationPayload
  mutationInOut(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: MutationInOutInput!
  ): MutationInOutPayload
  mutationReturnsTableOneCol(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: MutationReturnsTableOneColInput!
  ): MutationReturnsTableOneColPayload
  jsonIdentityMutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: JsonIdentityMutationInput!
  ): JsonIdentityMutationPayload
  jsonbIdentityMutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: JsonbIdentityMutationInput!
  ): JsonbIdentityMutationPayload
  jsonbIdentityMutationPlpgsql(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: JsonbIdentityMutationPlpgsqlInput!
  ): JsonbIdentityMutationPlpgsqlPayload
  jsonbIdentityMutationPlpgsqlWithDefault(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: JsonbIdentityMutationPlpgsqlWithDefaultInput!
  ): JsonbIdentityMutationPlpgsqlWithDefaultPayload
  mutationInInout(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: MutationInInoutInput!
  ): MutationInInoutPayload
  mutationOutOut(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: MutationOutOutInput!
  ): MutationOutOutPayload
  mutationOutOutSetof(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: MutationOutOutSetofInput!
  ): MutationOutOutSetofPayload
  mutationOutOutUnnamed(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: MutationOutOutUnnamedInput!
  ): MutationOutOutUnnamedPayload
  intSetMutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: IntSetMutationInput!
  ): IntSetMutationPayload
  mutationOutUnnamedOutOutUnnamed(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: MutationOutUnnamedOutOutUnnamedInput!
  ): MutationOutUnnamedOutOutUnnamedPayload
  mutationReturnsTableMultiCol(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: MutationReturnsTableMultiColInput!
  ): MutationReturnsTableMultiColPayload
  leftArmIdentity(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: LeftArmIdentityInput!
  ): LeftArmIdentityPayload
  issue756Mutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: Issue756MutationInput!
  ): Issue756MutationPayload
  issue756SetMutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: Issue756SetMutationInput!
  ): Issue756SetMutationPayload
  typesMutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: TypesMutationInput!
  ): TypesMutationPayload
  mutationOutOutCompoundType(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: MutationOutOutCompoundTypeInput!
  ): MutationOutOutCompoundTypePayload
  tableMutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: TableMutationInput!
  ): TableMutationPayload
  mutationOutComplex(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: MutationOutComplexInput!
  ): MutationOutComplexPayload
  mutationOutComplexSetof(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: MutationOutComplexSetofInput!
  ): MutationOutComplexSetofPayload
  mutationOutTable(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: MutationOutTableInput!
  ): MutationOutTablePayload
  mutationOutTableSetof(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: MutationOutTableSetofInput!
  ): MutationOutTableSetofPayload
  tableSetMutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: TableSetMutationInput!
  ): TableSetMutationPayload

  """Creates a single \`MyTable\`."""
  createMyTable(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateMyTableInput!
  ): CreateMyTablePayload

  """Creates a single \`PersonSecret\`."""
  createPersonSecret(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreatePersonSecretInput!
  ): CreatePersonSecretPayload @deprecated(reason: "This is deprecated (comment on table c.person_secret).")

  """Creates a single \`CompoundKey\`."""
  createCompoundKey(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateCompoundKeyInput!
  ): CreateCompoundKeyPayload

  """Creates a single \`NullTestRecord\`."""
  createNullTestRecord(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateNullTestRecordInput!
  ): CreateNullTestRecordPayload

  """Creates a single \`EdgeCase\`."""
  createEdgeCase(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateEdgeCaseInput!
  ): CreateEdgeCasePayload

  """Creates a single \`LeftArm\`."""
  createLeftArm(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateLeftArmInput!
  ): CreateLeftArmPayload

  """Creates a single \`Issue756\`."""
  createIssue756(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateIssue756Input!
  ): CreateIssue756Payload

  """Creates a single \`Person\`."""
  createPerson(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreatePersonInput!
  ): CreatePersonPayload

  """Updates a single \`MyTable\` using its globally unique id and a patch."""
  updateMyTable(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateMyTableInput!
  ): UpdateMyTablePayload

  """Updates a single \`MyTable\` using a unique key and a patch."""
  updateMyTableById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateMyTableByIdInput!
  ): UpdateMyTablePayload

  """
  Updates a single \`PersonSecret\` using its globally unique id and a patch.
  """
  updatePersonSecret(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdatePersonSecretInput!
  ): UpdatePersonSecretPayload @deprecated(reason: "This is deprecated (comment on table c.person_secret).")

  """Updates a single \`PersonSecret\` using a unique key and a patch."""
  updatePersonSecretByPersonId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdatePersonSecretByPersonIdInput!
  ): UpdatePersonSecretPayload @deprecated(reason: "This is deprecated (comment on table c.person_secret).")

  """
  Updates a single \`CompoundKey\` using its globally unique id and a patch.
  """
  updateCompoundKey(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateCompoundKeyInput!
  ): UpdateCompoundKeyPayload

  """Updates a single \`CompoundKey\` using a unique key and a patch."""
  updateCompoundKeyByPersonId1AndPersonId2(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateCompoundKeyByPersonId1AndPersonId2Input!
  ): UpdateCompoundKeyPayload

  """
  Updates a single \`NullTestRecord\` using its globally unique id and a patch.
  """
  updateNullTestRecord(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateNullTestRecordInput!
  ): UpdateNullTestRecordPayload

  """Updates a single \`NullTestRecord\` using a unique key and a patch."""
  updateNullTestRecordById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateNullTestRecordByIdInput!
  ): UpdateNullTestRecordPayload

  """Updates a single \`LeftArm\` using its globally unique id and a patch."""
  updateLeftArm(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateLeftArmInput!
  ): UpdateLeftArmPayload

  """Updates a single \`LeftArm\` using a unique key and a patch."""
  updateLeftArmById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateLeftArmByIdInput!
  ): UpdateLeftArmPayload

  """Updates a single \`LeftArm\` using a unique key and a patch."""
  updateLeftArmByPersonId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateLeftArmByPersonIdInput!
  ): UpdateLeftArmPayload

  """Updates a single \`Issue756\` using its globally unique id and a patch."""
  updateIssue756(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateIssue756Input!
  ): UpdateIssue756Payload

  """Updates a single \`Issue756\` using a unique key and a patch."""
  updateIssue756ById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateIssue756ByIdInput!
  ): UpdateIssue756Payload

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

  """Updates a single \`Person\` using a unique key and a patch."""
  updatePersonByEmail(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdatePersonByEmailInput!
  ): UpdatePersonPayload

  """Deletes a single \`MyTable\` using its globally unique id."""
  deleteMyTable(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteMyTableInput!
  ): DeleteMyTablePayload

  """Deletes a single \`MyTable\` using a unique key."""
  deleteMyTableById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteMyTableByIdInput!
  ): DeleteMyTablePayload

  """Deletes a single \`PersonSecret\` using its globally unique id."""
  deletePersonSecret(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeletePersonSecretInput!
  ): DeletePersonSecretPayload @deprecated(reason: "This is deprecated (comment on table c.person_secret).")

  """Deletes a single \`PersonSecret\` using a unique key."""
  deletePersonSecretByPersonId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeletePersonSecretByPersonIdInput!
  ): DeletePersonSecretPayload @deprecated(reason: "This is deprecated (comment on table c.person_secret).")

  """Deletes a single \`CompoundKey\` using its globally unique id."""
  deleteCompoundKey(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteCompoundKeyInput!
  ): DeleteCompoundKeyPayload

  """Deletes a single \`CompoundKey\` using a unique key."""
  deleteCompoundKeyByPersonId1AndPersonId2(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteCompoundKeyByPersonId1AndPersonId2Input!
  ): DeleteCompoundKeyPayload

  """Deletes a single \`NullTestRecord\` using its globally unique id."""
  deleteNullTestRecord(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteNullTestRecordInput!
  ): DeleteNullTestRecordPayload

  """Deletes a single \`NullTestRecord\` using a unique key."""
  deleteNullTestRecordById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteNullTestRecordByIdInput!
  ): DeleteNullTestRecordPayload

  """Deletes a single \`LeftArm\` using its globally unique id."""
  deleteLeftArm(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteLeftArmInput!
  ): DeleteLeftArmPayload

  """Deletes a single \`LeftArm\` using a unique key."""
  deleteLeftArmById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteLeftArmByIdInput!
  ): DeleteLeftArmPayload

  """Deletes a single \`LeftArm\` using a unique key."""
  deleteLeftArmByPersonId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteLeftArmByPersonIdInput!
  ): DeleteLeftArmPayload

  """Deletes a single \`Issue756\` using its globally unique id."""
  deleteIssue756(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteIssue756Input!
  ): DeleteIssue756Payload

  """Deletes a single \`Issue756\` using a unique key."""
  deleteIssue756ById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteIssue756ByIdInput!
  ): DeleteIssue756Payload

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

  """Deletes a single \`Person\` using a unique key."""
  deletePersonByEmail(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeletePersonByEmailInput!
  ): DeletePersonPayload
}

"""The output of our \`mutationOut\` mutation."""
type MutationOutPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  o: Int

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`mutationOut\` mutation."""
input MutationOutInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
}

"""The output of our \`mutationOutSetof\` mutation."""
type MutationOutSetofPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  os: [Int]

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`mutationOutSetof\` mutation."""
input MutationOutSetofInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
}

"""The output of our \`mutationOutUnnamed\` mutation."""
type MutationOutUnnamedPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  integer: Int

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`mutationOutUnnamed\` mutation."""
input MutationOutUnnamedInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
}

"""The output of our \`noArgsMutation\` mutation."""
type NoArgsMutationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  integer: Int

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`noArgsMutation\` mutation."""
input NoArgsMutationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
}

"""The output of our \`mutationInOut\` mutation."""
type MutationInOutPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  o: Int

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`mutationInOut\` mutation."""
input MutationInOutInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  i: Int
}

"""The output of our \`mutationReturnsTableOneCol\` mutation."""
type MutationReturnsTableOneColPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  col1S: [Int]

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`mutationReturnsTableOneCol\` mutation."""
input MutationReturnsTableOneColInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  i: Int
}

"""The output of our \`jsonIdentityMutation\` mutation."""
type JsonIdentityMutationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  json: JSON

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`jsonIdentityMutation\` mutation."""
input JsonIdentityMutationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  json: JSON
}

"""The output of our \`jsonbIdentityMutation\` mutation."""
type JsonbIdentityMutationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  json: JSON

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`jsonbIdentityMutation\` mutation."""
input JsonbIdentityMutationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  json: JSON
}

"""The output of our \`jsonbIdentityMutationPlpgsql\` mutation."""
type JsonbIdentityMutationPlpgsqlPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  json: JSON

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`jsonbIdentityMutationPlpgsql\` mutation."""
input JsonbIdentityMutationPlpgsqlInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  _theJson: JSON!
}

"""The output of our \`jsonbIdentityMutationPlpgsqlWithDefault\` mutation."""
type JsonbIdentityMutationPlpgsqlWithDefaultPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  json: JSON

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`jsonbIdentityMutationPlpgsqlWithDefault\` mutation."""
input JsonbIdentityMutationPlpgsqlWithDefaultInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  _theJson: JSON
}

"""The output of our \`mutationInInout\` mutation."""
type MutationInInoutPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  ino: Int

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`mutationInInout\` mutation."""
input MutationInInoutInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  i: Int
  ino: Int
}

"""The output of our \`mutationOutOut\` mutation."""
type MutationOutOutPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: MutationOutOutRecord

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

type MutationOutOutRecord {
  firstOut: Int
  secondOut: String
}

"""All input for the \`mutationOutOut\` mutation."""
input MutationOutOutInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
}

"""The output of our \`mutationOutOutSetof\` mutation."""
type MutationOutOutSetofPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  results: [MutationOutOutSetofRecord]

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

type MutationOutOutSetofRecord {
  o1: Int
  o2: String
}

"""All input for the \`mutationOutOutSetof\` mutation."""
input MutationOutOutSetofInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
}

"""The output of our \`mutationOutOutUnnamed\` mutation."""
type MutationOutOutUnnamedPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: MutationOutOutUnnamedRecord

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

type MutationOutOutUnnamedRecord {
  arg1: Int
  arg2: String
}

"""All input for the \`mutationOutOutUnnamed\` mutation."""
input MutationOutOutUnnamedInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
}

"""The output of our \`intSetMutation\` mutation."""
type IntSetMutationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  integers: [Int]

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`intSetMutation\` mutation."""
input IntSetMutationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  x: Int
  y: Int
  z: Int
}

"""The output of our \`mutationOutUnnamedOutOutUnnamed\` mutation."""
type MutationOutUnnamedOutOutUnnamedPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: MutationOutUnnamedOutOutUnnamedRecord

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

type MutationOutUnnamedOutOutUnnamedRecord {
  arg1: Int
  o2: String
  arg3: Int
}

"""All input for the \`mutationOutUnnamedOutOutUnnamed\` mutation."""
input MutationOutUnnamedOutOutUnnamedInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
}

"""The output of our \`mutationReturnsTableMultiCol\` mutation."""
type MutationReturnsTableMultiColPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  results: [MutationReturnsTableMultiColRecord]

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

type MutationReturnsTableMultiColRecord {
  col1: Int
  col2: String
}

"""All input for the \`mutationReturnsTableMultiCol\` mutation."""
input MutationReturnsTableMultiColInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  i: Int
}

"""The output of our \`leftArmIdentity\` mutation."""
type LeftArmIdentityPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  leftArm: LeftArm

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`LeftArm\`. May be used by Relay 1."""
  leftArmEdge(
    """The method to use when ordering \`LeftArm\`."""
    orderBy: [LeftArmsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): LeftArmsEdge

  """Reads a single \`Person\` that is related to this \`LeftArm\`."""
  personByPersonId: Person
}

"""All input for the \`leftArmIdentity\` mutation."""
input LeftArmIdentityInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  leftArm: LeftArmBaseInput
}

"""An input representation of \`LeftArm\` with nullable fields."""
input LeftArmBaseInput {
  id: Int
  personId: Int
  lengthInMetres: Float
  mood: String
}

"""The output of our \`issue756Mutation\` mutation."""
type Issue756MutationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  issue756: Issue756

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Issue756\`. May be used by Relay 1."""
  issue756Edge(
    """The method to use when ordering \`Issue756\`."""
    orderBy: [Issue756SOrderBy!]! = [PRIMARY_KEY_ASC]
  ): Issue756SEdge
}

"""All input for the \`issue756Mutation\` mutation."""
input Issue756MutationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
}

"""The output of our \`issue756SetMutation\` mutation."""
type Issue756SetMutationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  issue756S: [Issue756]

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`issue756SetMutation\` mutation."""
input Issue756SetMutationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
}

"""The output of our \`typesMutation\` mutation."""
type TypesMutationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  boolean: Boolean

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`typesMutation\` mutation."""
input TypesMutationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  a: BigInt!
  b: Boolean!
  c: String!
  d: [Int]!
  e: JSON!
  f: FloatRangeInput!
}

"""The output of our \`mutationOutOutCompoundType\` mutation."""
type MutationOutOutCompoundTypePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: MutationOutOutCompoundTypeRecord

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

type MutationOutOutCompoundTypeRecord {
  o1: Int
  o2: CompoundType
}

"""All input for the \`mutationOutOutCompoundType\` mutation."""
input MutationOutOutCompoundTypeInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  i1: Int
}

"""The output of our \`tableMutation\` mutation."""
type TableMutationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  post: Post

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`tableMutation\` mutation."""
input TableMutationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int
}

"""The output of our \`mutationOutComplex\` mutation."""
type MutationOutComplexPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: MutationOutComplexRecord

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

type MutationOutComplexRecord {
  x: Int
  y: CompoundType
  z: Person
}

"""All input for the \`mutationOutComplex\` mutation."""
input MutationOutComplexInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  a: Int
  b: String
}

"""The output of our \`mutationOutComplexSetof\` mutation."""
type MutationOutComplexSetofPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  results: [MutationOutComplexSetofRecord]

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

type MutationOutComplexSetofRecord {
  x: Int
  y: CompoundType
  z: Person
}

"""All input for the \`mutationOutComplexSetof\` mutation."""
input MutationOutComplexSetofInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  a: Int
  b: String
}

"""The output of our \`mutationOutTable\` mutation."""
type MutationOutTablePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
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

"""All input for the \`mutationOutTable\` mutation."""
input MutationOutTableInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
}

"""The output of our \`mutationOutTableSetof\` mutation."""
type MutationOutTableSetofPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  people: [Person]

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`mutationOutTableSetof\` mutation."""
input MutationOutTableSetofInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
}

"""The output of our \`tableSetMutation\` mutation."""
type TableSetMutationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  people: [Person]

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`tableSetMutation\` mutation."""
input TableSetMutationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
}

"""The output of our create \`MyTable\` mutation."""
type CreateMyTablePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`MyTable\` that was created by this mutation."""
  myTable: MyTable

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`MyTable\`. May be used by Relay 1."""
  myTableEdge(
    """The method to use when ordering \`MyTable\`."""
    orderBy: [MyTablesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): MyTablesEdge
}

"""All input for the create \`MyTable\` mutation."""
input CreateMyTableInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`MyTable\` to be created by this mutation."""
  myTable: MyTableInput!
}

"""An input for mutations affecting \`MyTable\`"""
input MyTableInput {
  id: Int
  jsonData: JSON
}

"""The output of our create \`PersonSecret\` mutation."""
type CreatePersonSecretPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`PersonSecret\` that was created by this mutation."""
  personSecret: PersonSecret @deprecated(reason: "This is deprecated (comment on table c.person_secret).")

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`PersonSecret\`. May be used by Relay 1."""
  personSecretEdge(
    """The method to use when ordering \`PersonSecret\`."""
    orderBy: [PersonSecretsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PersonSecretsEdge @deprecated(reason: "This is deprecated (comment on table c.person_secret).")

  """Reads a single \`Person\` that is related to this \`PersonSecret\`."""
  personBySecret: Person

  """The \`Person\` this \`PersonSecret\` belongs to."""
  personByPersonId: Person
}

"""All input for the create \`PersonSecret\` mutation."""
input CreatePersonSecretInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`PersonSecret\` to be created by this mutation."""
  personSecret: PersonSecretInput!
}

"""An input for mutations affecting \`PersonSecret\`"""
input PersonSecretInput {
  personId: Int!

  """A secret held by the associated Person"""
  secret: String
}

"""The output of our create \`CompoundKey\` mutation."""
type CreateCompoundKeyPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`CompoundKey\` that was created by this mutation."""
  compoundKey: CompoundKey

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`CompoundKey\`. May be used by Relay 1."""
  compoundKeyEdge(
    """The method to use when ordering \`CompoundKey\`."""
    orderBy: [CompoundKeysOrderBy!]! = [PRIMARY_KEY_ASC]
  ): CompoundKeysEdge

  """Reads a single \`Person\` that is related to this \`CompoundKey\`."""
  personByPersonId1: Person

  """Reads a single \`Person\` that is related to this \`CompoundKey\`."""
  personByPersonId2: Person
}

"""All input for the create \`CompoundKey\` mutation."""
input CreateCompoundKeyInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`CompoundKey\` to be created by this mutation."""
  compoundKey: CompoundKeyInput!
}

"""An input for mutations affecting \`CompoundKey\`"""
input CompoundKeyInput {
  personId2: Int!
  personId1: Int!
  extra: Boolean
}

"""The output of our create \`NullTestRecord\` mutation."""
type CreateNullTestRecordPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`NullTestRecord\` that was created by this mutation."""
  nullTestRecord: NullTestRecord

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`NullTestRecord\`. May be used by Relay 1."""
  nullTestRecordEdge(
    """The method to use when ordering \`NullTestRecord\`."""
    orderBy: [NullTestRecordsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): NullTestRecordsEdge
}

"""All input for the create \`NullTestRecord\` mutation."""
input CreateNullTestRecordInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`NullTestRecord\` to be created by this mutation."""
  nullTestRecord: NullTestRecordInput!
}

"""An input for mutations affecting \`NullTestRecord\`"""
input NullTestRecordInput {
  id: Int
  nullableText: String
  nullableInt: Int
  nonNullText: String!
}

"""The output of our create \`EdgeCase\` mutation."""
type CreateEdgeCasePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`EdgeCase\` that was created by this mutation."""
  edgeCase: EdgeCase

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the create \`EdgeCase\` mutation."""
input CreateEdgeCaseInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`EdgeCase\` to be created by this mutation."""
  edgeCase: EdgeCaseInput!
}

"""An input for mutations affecting \`EdgeCase\`"""
input EdgeCaseInput {
  notNullHasDefault: Boolean
  wontCastEasy: Int
  rowId: Int
}

"""The output of our create \`LeftArm\` mutation."""
type CreateLeftArmPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`LeftArm\` that was created by this mutation."""
  leftArm: LeftArm

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`LeftArm\`. May be used by Relay 1."""
  leftArmEdge(
    """The method to use when ordering \`LeftArm\`."""
    orderBy: [LeftArmsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): LeftArmsEdge

  """Reads a single \`Person\` that is related to this \`LeftArm\`."""
  personByPersonId: Person
}

"""All input for the create \`LeftArm\` mutation."""
input CreateLeftArmInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`LeftArm\` to be created by this mutation."""
  leftArm: LeftArmInput!
}

"""An input for mutations affecting \`LeftArm\`"""
input LeftArmInput {
  id: Int
  personId: Int
  lengthInMetres: Float
  mood: String
}

"""The output of our create \`Issue756\` mutation."""
type CreateIssue756Payload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Issue756\` that was created by this mutation."""
  issue756: Issue756

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Issue756\`. May be used by Relay 1."""
  issue756Edge(
    """The method to use when ordering \`Issue756\`."""
    orderBy: [Issue756SOrderBy!]! = [PRIMARY_KEY_ASC]
  ): Issue756SEdge
}

"""All input for the create \`Issue756\` mutation."""
input CreateIssue756Input {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`Issue756\` to be created by this mutation."""
  issue756: Issue756Input!
}

"""An input for mutations affecting \`Issue756\`"""
input Issue756Input {
  id: Int
  ts: NotNullTimestamp
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
  """The primary unique identifier for the person"""
  id: Int

  """The person’s name"""
  name: String!
  aliases: [String]
  about: String
  email: Email!
  site: WrappedUrlInput
  config: KeyValueHash
  lastLoginFromIp: InternetAddress
  lastLoginFromSubnet: String
  userMac: String
  createdAt: Datetime
}

"""The output of our update \`MyTable\` mutation."""
type UpdateMyTablePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`MyTable\` that was updated by this mutation."""
  myTable: MyTable

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`MyTable\`. May be used by Relay 1."""
  myTableEdge(
    """The method to use when ordering \`MyTable\`."""
    orderBy: [MyTablesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): MyTablesEdge
}

"""All input for the \`updateMyTable\` mutation."""
input UpdateMyTableInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`MyTable\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`MyTable\` being updated.
  """
  myTablePatch: MyTablePatch!
}

"""
Represents an update to a \`MyTable\`. Fields that are set will be updated.
"""
input MyTablePatch {
  id: Int
  jsonData: JSON
}

"""All input for the \`updateMyTableById\` mutation."""
input UpdateMyTableByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`MyTable\` being updated.
  """
  myTablePatch: MyTablePatch!
}

"""The output of our update \`PersonSecret\` mutation."""
type UpdatePersonSecretPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`PersonSecret\` that was updated by this mutation."""
  personSecret: PersonSecret

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`PersonSecret\`. May be used by Relay 1."""
  personSecretEdge(
    """The method to use when ordering \`PersonSecret\`."""
    orderBy: [PersonSecretsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PersonSecretsEdge @deprecated(reason: "This is deprecated (comment on table c.person_secret).")

  """Reads a single \`Person\` that is related to this \`PersonSecret\`."""
  personBySecret: Person

  """The \`Person\` this \`PersonSecret\` belongs to."""
  personByPersonId: Person
}

"""All input for the \`updatePersonSecret\` mutation."""
input UpdatePersonSecretInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`PersonSecret\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`PersonSecret\` being updated.
  """
  personSecretPatch: PersonSecretPatch!
}

"""
Represents an update to a \`PersonSecret\`. Fields that are set will be updated.
"""
input PersonSecretPatch {
  personId: Int

  """A secret held by the associated Person"""
  secret: String
}

"""All input for the \`updatePersonSecretByPersonId\` mutation."""
input UpdatePersonSecretByPersonIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  personId: Int!

  """
  An object where the defined keys will be set on the \`PersonSecret\` being updated.
  """
  personSecretPatch: PersonSecretPatch!
}

"""The output of our update \`CompoundKey\` mutation."""
type UpdateCompoundKeyPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`CompoundKey\` that was updated by this mutation."""
  compoundKey: CompoundKey

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`CompoundKey\`. May be used by Relay 1."""
  compoundKeyEdge(
    """The method to use when ordering \`CompoundKey\`."""
    orderBy: [CompoundKeysOrderBy!]! = [PRIMARY_KEY_ASC]
  ): CompoundKeysEdge

  """Reads a single \`Person\` that is related to this \`CompoundKey\`."""
  personByPersonId1: Person

  """Reads a single \`Person\` that is related to this \`CompoundKey\`."""
  personByPersonId2: Person
}

"""All input for the \`updateCompoundKey\` mutation."""
input UpdateCompoundKeyInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`CompoundKey\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`CompoundKey\` being updated.
  """
  compoundKeyPatch: CompoundKeyPatch!
}

"""
Represents an update to a \`CompoundKey\`. Fields that are set will be updated.
"""
input CompoundKeyPatch {
  personId2: Int
  personId1: Int
  extra: Boolean
}

"""All input for the \`updateCompoundKeyByPersonId1AndPersonId2\` mutation."""
input UpdateCompoundKeyByPersonId1AndPersonId2Input {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  personId1: Int!
  personId2: Int!

  """
  An object where the defined keys will be set on the \`CompoundKey\` being updated.
  """
  compoundKeyPatch: CompoundKeyPatch!
}

"""The output of our update \`NullTestRecord\` mutation."""
type UpdateNullTestRecordPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`NullTestRecord\` that was updated by this mutation."""
  nullTestRecord: NullTestRecord

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`NullTestRecord\`. May be used by Relay 1."""
  nullTestRecordEdge(
    """The method to use when ordering \`NullTestRecord\`."""
    orderBy: [NullTestRecordsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): NullTestRecordsEdge
}

"""All input for the \`updateNullTestRecord\` mutation."""
input UpdateNullTestRecordInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`NullTestRecord\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`NullTestRecord\` being updated.
  """
  nullTestRecordPatch: NullTestRecordPatch!
}

"""
Represents an update to a \`NullTestRecord\`. Fields that are set will be updated.
"""
input NullTestRecordPatch {
  id: Int
  nullableText: String
  nullableInt: Int
  nonNullText: String
}

"""All input for the \`updateNullTestRecordById\` mutation."""
input UpdateNullTestRecordByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`NullTestRecord\` being updated.
  """
  nullTestRecordPatch: NullTestRecordPatch!
}

"""The output of our update \`LeftArm\` mutation."""
type UpdateLeftArmPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`LeftArm\` that was updated by this mutation."""
  leftArm: LeftArm

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`LeftArm\`. May be used by Relay 1."""
  leftArmEdge(
    """The method to use when ordering \`LeftArm\`."""
    orderBy: [LeftArmsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): LeftArmsEdge

  """Reads a single \`Person\` that is related to this \`LeftArm\`."""
  personByPersonId: Person
}

"""All input for the \`updateLeftArm\` mutation."""
input UpdateLeftArmInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`LeftArm\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`LeftArm\` being updated.
  """
  leftArmPatch: LeftArmPatch!
}

"""
Represents an update to a \`LeftArm\`. Fields that are set will be updated.
"""
input LeftArmPatch {
  id: Int
  personId: Int
  lengthInMetres: Float
  mood: String
}

"""All input for the \`updateLeftArmById\` mutation."""
input UpdateLeftArmByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`LeftArm\` being updated.
  """
  leftArmPatch: LeftArmPatch!
}

"""All input for the \`updateLeftArmByPersonId\` mutation."""
input UpdateLeftArmByPersonIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  personId: Int!

  """
  An object where the defined keys will be set on the \`LeftArm\` being updated.
  """
  leftArmPatch: LeftArmPatch!
}

"""The output of our update \`Issue756\` mutation."""
type UpdateIssue756Payload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Issue756\` that was updated by this mutation."""
  issue756: Issue756

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Issue756\`. May be used by Relay 1."""
  issue756Edge(
    """The method to use when ordering \`Issue756\`."""
    orderBy: [Issue756SOrderBy!]! = [PRIMARY_KEY_ASC]
  ): Issue756SEdge
}

"""All input for the \`updateIssue756\` mutation."""
input UpdateIssue756Input {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Issue756\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`Issue756\` being updated.
  """
  issue756Patch: Issue756Patch!
}

"""
Represents an update to a \`Issue756\`. Fields that are set will be updated.
"""
input Issue756Patch {
  id: Int
  ts: NotNullTimestamp
}

"""All input for the \`updateIssue756ById\` mutation."""
input UpdateIssue756ByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`Issue756\` being updated.
  """
  issue756Patch: Issue756Patch!
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
  """The primary unique identifier for the person"""
  id: Int

  """The person’s name"""
  name: String
  aliases: [String]
  about: String
  email: Email
  site: WrappedUrlInput
  config: KeyValueHash
  lastLoginFromIp: InternetAddress
  lastLoginFromSubnet: String
  userMac: String
  createdAt: Datetime
}

"""All input for the \`updatePersonById\` mutation."""
input UpdatePersonByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The primary unique identifier for the person"""
  id: Int!

  """
  An object where the defined keys will be set on the \`Person\` being updated.
  """
  personPatch: PersonPatch!
}

"""All input for the \`updatePersonByEmail\` mutation."""
input UpdatePersonByEmailInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  email: Email!

  """
  An object where the defined keys will be set on the \`Person\` being updated.
  """
  personPatch: PersonPatch!
}

"""The output of our delete \`MyTable\` mutation."""
type DeleteMyTablePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`MyTable\` that was deleted by this mutation."""
  myTable: MyTable
  deletedMyTableId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`MyTable\`. May be used by Relay 1."""
  myTableEdge(
    """The method to use when ordering \`MyTable\`."""
    orderBy: [MyTablesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): MyTablesEdge
}

"""All input for the \`deleteMyTable\` mutation."""
input DeleteMyTableInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`MyTable\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteMyTableById\` mutation."""
input DeleteMyTableByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!
}

"""The output of our delete \`PersonSecret\` mutation."""
type DeletePersonSecretPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`PersonSecret\` that was deleted by this mutation."""
  personSecret: PersonSecret
  deletedPersonSecretId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`PersonSecret\`. May be used by Relay 1."""
  personSecretEdge(
    """The method to use when ordering \`PersonSecret\`."""
    orderBy: [PersonSecretsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PersonSecretsEdge @deprecated(reason: "This is deprecated (comment on table c.person_secret).")

  """Reads a single \`Person\` that is related to this \`PersonSecret\`."""
  personBySecret: Person

  """The \`Person\` this \`PersonSecret\` belongs to."""
  personByPersonId: Person
}

"""All input for the \`deletePersonSecret\` mutation."""
input DeletePersonSecretInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`PersonSecret\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deletePersonSecretByPersonId\` mutation."""
input DeletePersonSecretByPersonIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  personId: Int!
}

"""The output of our delete \`CompoundKey\` mutation."""
type DeleteCompoundKeyPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`CompoundKey\` that was deleted by this mutation."""
  compoundKey: CompoundKey
  deletedCompoundKeyId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`CompoundKey\`. May be used by Relay 1."""
  compoundKeyEdge(
    """The method to use when ordering \`CompoundKey\`."""
    orderBy: [CompoundKeysOrderBy!]! = [PRIMARY_KEY_ASC]
  ): CompoundKeysEdge

  """Reads a single \`Person\` that is related to this \`CompoundKey\`."""
  personByPersonId1: Person

  """Reads a single \`Person\` that is related to this \`CompoundKey\`."""
  personByPersonId2: Person
}

"""All input for the \`deleteCompoundKey\` mutation."""
input DeleteCompoundKeyInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`CompoundKey\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteCompoundKeyByPersonId1AndPersonId2\` mutation."""
input DeleteCompoundKeyByPersonId1AndPersonId2Input {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  personId1: Int!
  personId2: Int!
}

"""The output of our delete \`NullTestRecord\` mutation."""
type DeleteNullTestRecordPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`NullTestRecord\` that was deleted by this mutation."""
  nullTestRecord: NullTestRecord
  deletedNullTestRecordId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`NullTestRecord\`. May be used by Relay 1."""
  nullTestRecordEdge(
    """The method to use when ordering \`NullTestRecord\`."""
    orderBy: [NullTestRecordsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): NullTestRecordsEdge
}

"""All input for the \`deleteNullTestRecord\` mutation."""
input DeleteNullTestRecordInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`NullTestRecord\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteNullTestRecordById\` mutation."""
input DeleteNullTestRecordByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!
}

"""The output of our delete \`LeftArm\` mutation."""
type DeleteLeftArmPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`LeftArm\` that was deleted by this mutation."""
  leftArm: LeftArm
  deletedLeftArmId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`LeftArm\`. May be used by Relay 1."""
  leftArmEdge(
    """The method to use when ordering \`LeftArm\`."""
    orderBy: [LeftArmsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): LeftArmsEdge

  """Reads a single \`Person\` that is related to this \`LeftArm\`."""
  personByPersonId: Person
}

"""All input for the \`deleteLeftArm\` mutation."""
input DeleteLeftArmInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`LeftArm\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteLeftArmById\` mutation."""
input DeleteLeftArmByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!
}

"""All input for the \`deleteLeftArmByPersonId\` mutation."""
input DeleteLeftArmByPersonIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  personId: Int!
}

"""The output of our delete \`Issue756\` mutation."""
type DeleteIssue756Payload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Issue756\` that was deleted by this mutation."""
  issue756: Issue756
  deletedIssue756Id: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Issue756\`. May be used by Relay 1."""
  issue756Edge(
    """The method to use when ordering \`Issue756\`."""
    orderBy: [Issue756SOrderBy!]! = [PRIMARY_KEY_ASC]
  ): Issue756SEdge
}

"""All input for the \`deleteIssue756\` mutation."""
input DeleteIssue756Input {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Issue756\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteIssue756ById\` mutation."""
input DeleteIssue756ByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!
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

  """The primary unique identifier for the person"""
  id: Int!
}

"""All input for the \`deletePersonByEmail\` mutation."""
input DeletePersonByEmailInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  email: Email!
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
    node: {
      plan(_$root, args) {
        return node(nodeIdHandlerByTypeName, args.get("nodeId"));
      },
      args: {
        nodeId: undefined
      }
    },
    myTableById: {
      plan(_$root, args) {
        return pgResource_my_tablePgResource.get({
          id: args.get("id")
        });
      },
      args: {
        id: undefined
      }
    },
    personSecretByPersonId: {
      plan(_$root, args) {
        return pgResource_person_secretPgResource.get({
          person_id: args.get("personId")
        });
      },
      args: {
        personId: undefined
      }
    },
    compoundKeyByPersonId1AndPersonId2: {
      plan(_$root, args) {
        return pgResource_compound_keyPgResource.get({
          person_id_1: args.get("personId1"),
          person_id_2: args.get("personId2")
        });
      },
      args: {
        personId1: undefined,
        personId2: undefined
      }
    },
    nullTestRecordById: {
      plan(_$root, args) {
        return pgResource_null_test_recordPgResource.get({
          id: args.get("id")
        });
      },
      args: {
        id: undefined
      }
    },
    leftArmById: {
      plan(_$root, args) {
        return pgResource_left_armPgResource.get({
          id: args.get("id")
        });
      },
      args: {
        id: undefined
      }
    },
    leftArmByPersonId: {
      plan(_$root, args) {
        return pgResource_left_armPgResource.get({
          person_id: args.get("personId")
        });
      },
      args: {
        personId: undefined
      }
    },
    issue756ById: {
      plan(_$root, args) {
        return pgResource_issue756PgResource.get({
          id: args.get("id")
        });
      },
      args: {
        id: undefined
      }
    },
    personById: {
      plan(_$root, args) {
        return pgResource_personPgResource.get({
          id: args.get("id")
        });
      },
      args: {
        id: undefined
      }
    },
    personByEmail: {
      plan(_$root, args) {
        return pgResource_personPgResource.get({
          email: args.get("email")
        });
      },
      args: {
        email: undefined
      }
    },
    currentUserId($root, args, _info) {
      const selectArgs = makeArgs(args);
      return resource_current_user_idPgResource.execute(selectArgs);
    },
    funcOut($root, args, _info) {
      const selectArgs = makeArgs2(args);
      return resource_func_outPgResource.execute(selectArgs);
    },
    funcOutSetof: {
      plan($parent, args, info) {
        const $select = getSelectPlanFromParentAndArgs($parent, args, info);
        return connection($select, {
          // nodePlan: ($item) => $item,
          cursorPlan($item) {
            return $item.getParentStep ? $item.getParentStep().cursor() : $item.cursor();
          }
        });
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        }
      }
    },
    funcOutUnnamed($root, args, _info) {
      const selectArgs = makeArgs4(args);
      return resource_func_out_unnamedPgResource.execute(selectArgs);
    },
    noArgsQuery($root, args, _info) {
      const selectArgs = makeArgs5(args);
      return resource_no_args_queryPgResource.execute(selectArgs);
    },
    funcInOut: {
      plan($root, args, _info) {
        const selectArgs = makeArgs6(args);
        return resource_func_in_outPgResource.execute(selectArgs);
      },
      args: {
        i: undefined
      }
    },
    funcReturnsTableOneCol: {
      plan($parent, args, info) {
        const $select = getSelectPlanFromParentAndArgs2($parent, args, info);
        return connection($select, {
          // nodePlan: ($item) => $item,
          cursorPlan($item) {
            return $item.getParentStep ? $item.getParentStep().cursor() : $item.cursor();
          }
        });
      },
      args: {
        i: undefined,
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        }
      }
    },
    jsonIdentity: {
      plan($root, args, _info) {
        const selectArgs = makeArgs8(args);
        return resource_json_identityPgResource.execute(selectArgs);
      },
      args: {
        json: undefined
      }
    },
    jsonbIdentity: {
      plan($root, args, _info) {
        const selectArgs = makeArgs9(args);
        return resource_jsonb_identityPgResource.execute(selectArgs);
      },
      args: {
        json: undefined
      }
    },
    funcInInout: {
      plan($root, args, _info) {
        const selectArgs = makeArgs10(args);
        return resource_func_in_inoutPgResource.execute(selectArgs);
      },
      args: {
        i: undefined,
        ino: undefined
      }
    },
    funcOutOut($root, args, _info) {
      const selectArgs = makeArgs11(args);
      return resource_func_out_outPgResource.execute(selectArgs);
    },
    funcOutOutSetof: {
      plan($parent, args, info) {
        const $select = getSelectPlanFromParentAndArgs3($parent, args, info);
        return connection($select, {
          // nodePlan: ($item) => $item,
          cursorPlan($item) {
            return $item.getParentStep ? $item.getParentStep().cursor() : $item.cursor();
          }
        });
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        }
      }
    },
    funcOutOutUnnamed($root, args, _info) {
      const selectArgs = makeArgs13(args);
      return resource_func_out_out_unnamedPgResource.execute(selectArgs);
    },
    funcOutUnnamedOutOutUnnamed($root, args, _info) {
      const selectArgs = makeArgs14(args);
      return resource_func_out_unnamed_out_out_unnamedPgResource.execute(selectArgs);
    },
    funcReturnsTableMultiCol: {
      plan($parent, args, info) {
        const $select = getSelectPlanFromParentAndArgs4($parent, args, info);
        return connection($select, {
          // nodePlan: ($item) => $item,
          cursorPlan($item) {
            return $item.getParentStep ? $item.getParentStep().cursor() : $item.cursor();
          }
        });
      },
      args: {
        i: undefined,
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        }
      }
    },
    intSetQuery: {
      plan($parent, args, info) {
        const $select = getSelectPlanFromParentAndArgs5($parent, args, info);
        return connection($select, {
          // nodePlan: ($item) => $item,
          cursorPlan($item) {
            return $item.getParentStep ? $item.getParentStep().cursor() : $item.cursor();
          }
        });
      },
      args: {
        x: undefined,
        y: undefined,
        z: undefined,
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        }
      }
    },
    searchTestSummariesList: {
      plan($root, args, _info) {
        const selectArgs = makeArgs17(args);
        return resource_search_test_summariesPgResource.execute(selectArgs);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        }
      }
    },
    returnTableWithoutGrants($root, args, _info) {
      const selectArgs = makeArgs18(args);
      return resource_return_table_without_grantsPgResource.execute(selectArgs);
    },
    typesQuery: {
      plan($root, args, _info) {
        const selectArgs = makeArgs19(args);
        return resource_types_queryPgResource.execute(selectArgs);
      },
      args: {
        a: undefined,
        b: undefined,
        c: undefined,
        d: undefined,
        e: undefined,
        f: undefined
      }
    },
    funcOutOutCompoundType: {
      plan($root, args, _info) {
        const selectArgs = makeArgs20(args);
        return resource_func_out_out_compound_typePgResource.execute(selectArgs);
      },
      args: {
        i1: undefined
      }
    },
    queryOutputTwoRows: {
      plan($root, args, _info) {
        const selectArgs = makeArgs21(args);
        return resource_query_output_two_rowsPgResource.execute(selectArgs);
      },
      args: {
        leftArmId: undefined,
        postId: undefined,
        txt: undefined
      }
    },
    compoundTypeSetQuery: {
      plan($parent, args, info) {
        const $select = getSelectPlanFromParentAndArgs6($parent, args, info);
        return connection($select, {
          // nodePlan: ($item) => $item,
          cursorPlan($item) {
            return $item.getParentStep ? $item.getParentStep().cursor() : $item.cursor();
          }
        });
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        }
      }
    },
    tableQuery: {
      plan($root, args, _info) {
        const selectArgs = makeArgs23(args);
        return resource_table_queryPgResource.execute(selectArgs);
      },
      args: {
        id: undefined
      }
    },
    funcOutComplex: {
      plan($root, args, _info) {
        const selectArgs = makeArgs24(args);
        return resource_func_out_complexPgResource.execute(selectArgs);
      },
      args: {
        a: undefined,
        b: undefined
      }
    },
    funcOutComplexSetof: {
      plan($parent, args, info) {
        const $select = getSelectPlanFromParentAndArgs7($parent, args, info);
        return connection($select, {
          // nodePlan: ($item) => $item,
          cursorPlan($item) {
            return $item.getParentStep ? $item.getParentStep().cursor() : $item.cursor();
          }
        });
      },
      args: {
        a: undefined,
        b: undefined,
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        }
      }
    },
    badlyBehavedFunction: {
      plan($parent, args, info) {
        const $select = getSelectPlanFromParentAndArgs8($parent, args, info);
        return connection($select, {
          // nodePlan: ($item) => $item,
          cursorPlan($item) {
            return $item.getParentStep ? $item.getParentStep().cursor() : $item.cursor();
          }
        });
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        }
      }
    },
    funcOutTable($root, args, _info) {
      const selectArgs = makeArgs27(args);
      return resource_func_out_tablePgResource.execute(selectArgs);
    },
    funcOutTableSetof: {
      plan($parent, args, info) {
        const $select = getSelectPlanFromParentAndArgs9($parent, args, info);
        return connection($select, {
          // nodePlan: ($item) => $item,
          cursorPlan($item) {
            return $item.getParentStep ? $item.getParentStep().cursor() : $item.cursor();
          }
        });
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        }
      }
    },
    tableSetQuery: {
      plan($parent, args, info) {
        const $select = getSelectPlanFromParentAndArgs10($parent, args, info);
        return connection($select, {
          // nodePlan: ($item) => $item,
          cursorPlan($item) {
            return $item.getParentStep ? $item.getParentStep().cursor() : $item.cursor();
          }
        });
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("PeopleOrderBy"));
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
    tableSetQueryPlpgsql: {
      plan($parent, args, info) {
        const $select = getSelectPlanFromParentAndArgs11($parent, args, info);
        return connection($select, {
          // nodePlan: ($item) => $item,
          cursorPlan($item) {
            return $item.getParentStep ? $item.getParentStep().cursor() : $item.cursor();
          }
        });
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        }
      }
    },
    myTable: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    personSecret: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher2($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    compoundKey: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher3($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    nullTestRecord: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher4($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    leftArm: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher5($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    issue756: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher6($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    person: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher7($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    allMyTables: {
      plan() {
        return connection(pgResource_my_tablePgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("MyTablesOrderBy"));
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
    allPersonSecrets: {
      plan() {
        return connection(pgResource_person_secretPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("PersonSecretsOrderBy"));
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
    allCompoundKeys: {
      plan() {
        return connection(pgResource_compound_keyPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("CompoundKeysOrderBy"));
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
    allNullTestRecords: {
      plan() {
        return connection(pgResource_null_test_recordPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("NullTestRecordsOrderBy"));
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
    allEdgeCases: {
      plan() {
        return connection(resource_edge_casePgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("EdgeCasesOrderBy"));
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
    allLeftArms: {
      plan() {
        return connection(pgResource_left_armPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("LeftArmsOrderBy"));
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
    allIssue756S: {
      plan() {
        return connection(pgResource_issue756PgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("Issue756SOrderBy"));
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
    allPeople: {
      plan() {
        return connection(pgResource_personPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("PeopleOrderBy"));
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
  MyTable: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.MyTable.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.MyTable.codec.name].encode);
    },
    id($record) {
      return $record.get("id");
    },
    jsonData($record) {
      return $record.get("json_data");
    }
  },
  JSON: {
    serialize(value) {
      return JSON.stringify(value);
    },
    parseValue(value) {
      return JSON.parse(value);
    },
    parseLiteral(ast, _variables) {
      if (ast.kind === Kind.STRING) {
        return JSON.parse(ast.value);
      } else {
        return undefined;
      }
    }
  },
  PersonSecret: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.PersonSecret.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.PersonSecret.codec.name].encode);
    },
    personId($record) {
      return $record.get("person_id");
    },
    secret($record) {
      return $record.get("sekrit");
    },
    personBySecret($record) {
      return pgResource_personPgResource.get({
        about: $record.get("sekrit")
      });
    },
    personByPersonId($record) {
      return pgResource_personPgResource.get({
        id: $record.get("person_id")
      });
    }
  },
  Person: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.Person.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Person.codec.name].encode);
    },
    computedOut($in, args, _info) {
      if (!hasRecord($in)) {
        throw new Error(`Invalid plan, exepcted 'PgSelectSingleStep', 'PgInsertSingleStep', 'PgUpdateSingleStep' or 'PgDeleteSingleStep', but found ${$in}`);
      }
      const extraSelectArgs = makeArgs31(args);
      /**
       * An optimisation - if all our dependencies are
       * compatible with the expression's class plan then we
       * can inline ourselves into that, otherwise we must
       * issue the query separately.
       */
      const canUseExpressionDirectly = $in instanceof PgSelectSingleStep && extraSelectArgs.every(a => stepAMayDependOnStepB($in.getClassStep(), a.step));
      const $row = canUseExpressionDirectly ? $in : pgSelectSingleFromRecord($in.resource, $in.record());
      const selectArgs = [{
        step: $row.record()
      }, ...extraSelectArgs];
      if (resource_person_computed_outPgResource.isUnique && !resource_person_computed_outPgResource.codec.attributes && typeof resource_person_computed_outPgResource.from === "function") {
        // This is a scalar computed attribute, let's inline the expression
        const placeholders = selectArgs.map((arg, i) => {
          if (i === 0) {
            return $row.getClassStep().alias;
          } else if ("pgCodec" in arg && arg.pgCodec) {
            return $row.placeholder(arg.step, arg.pgCodec);
          } else {
            return $row.placeholder(arg.step);
          }
        });
        return pgClassExpression($row, resource_person_computed_outPgResource.codec)`${resource_person_computed_outPgResource.from(...placeholders.map(placeholder => ({
          placeholder
        })))}`;
      }
      // PERF: or here, if scalar add select to `$row`?
      return resource_person_computed_outPgResource.execute(selectArgs);
    },
    firstName($in, args, _info) {
      if (!hasRecord($in)) {
        throw new Error(`Invalid plan, exepcted 'PgSelectSingleStep', 'PgInsertSingleStep', 'PgUpdateSingleStep' or 'PgDeleteSingleStep', but found ${$in}`);
      }
      const extraSelectArgs = makeArgs32(args);
      /**
       * An optimisation - if all our dependencies are
       * compatible with the expression's class plan then we
       * can inline ourselves into that, otherwise we must
       * issue the query separately.
       */
      const canUseExpressionDirectly = $in instanceof PgSelectSingleStep && extraSelectArgs.every(a => stepAMayDependOnStepB($in.getClassStep(), a.step));
      const $row = canUseExpressionDirectly ? $in : pgSelectSingleFromRecord($in.resource, $in.record());
      const selectArgs = [{
        step: $row.record()
      }, ...extraSelectArgs];
      if (resource_person_first_namePgResource.isUnique && !resource_person_first_namePgResource.codec.attributes && typeof resource_person_first_namePgResource.from === "function") {
        // This is a scalar computed attribute, let's inline the expression
        const placeholders = selectArgs.map((arg, i) => {
          if (i === 0) {
            return $row.getClassStep().alias;
          } else if ("pgCodec" in arg && arg.pgCodec) {
            return $row.placeholder(arg.step, arg.pgCodec);
          } else {
            return $row.placeholder(arg.step);
          }
        });
        return pgClassExpression($row, resource_person_first_namePgResource.codec)`${resource_person_first_namePgResource.from(...placeholders.map(placeholder => ({
          placeholder
        })))}`;
      }
      // PERF: or here, if scalar add select to `$row`?
      return resource_person_first_namePgResource.execute(selectArgs);
    },
    computedOutOut($in, args, _info) {
      if (!hasRecord($in)) {
        throw new Error(`Invalid plan, exepcted 'PgSelectSingleStep', 'PgInsertSingleStep', 'PgUpdateSingleStep' or 'PgDeleteSingleStep', but found ${$in}`);
      }
      const extraSelectArgs = makeArgs33(args);
      /**
       * An optimisation - if all our dependencies are
       * compatible with the expression's class plan then we
       * can inline ourselves into that, otherwise we must
       * issue the query separately.
       */
      const canUseExpressionDirectly = $in instanceof PgSelectSingleStep && extraSelectArgs.every(a => stepAMayDependOnStepB($in.getClassStep(), a.step));
      const $row = canUseExpressionDirectly ? $in : pgSelectSingleFromRecord($in.resource, $in.record());
      const selectArgs = [{
        step: $row.record()
      }, ...extraSelectArgs];
      if (resource_person_computed_out_outPgResource.isUnique && !resource_person_computed_out_outPgResource.codec.attributes && typeof resource_person_computed_out_outPgResource.from === "function") {
        // This is a scalar computed attribute, let's inline the expression
        const placeholders = selectArgs.map((arg, i) => {
          if (i === 0) {
            return $row.getClassStep().alias;
          } else if ("pgCodec" in arg && arg.pgCodec) {
            return $row.placeholder(arg.step, arg.pgCodec);
          } else {
            return $row.placeholder(arg.step);
          }
        });
        return pgClassExpression($row, resource_person_computed_out_outPgResource.codec)`${resource_person_computed_out_outPgResource.from(...placeholders.map(placeholder => ({
          placeholder
        })))}`;
      }
      // PERF: or here, if scalar add select to `$row`?
      return resource_person_computed_out_outPgResource.execute(selectArgs);
    },
    computedInout: {
      plan($in, args, _info) {
        if (!hasRecord($in)) {
          throw new Error(`Invalid plan, exepcted 'PgSelectSingleStep', 'PgInsertSingleStep', 'PgUpdateSingleStep' or 'PgDeleteSingleStep', but found ${$in}`);
        }
        const extraSelectArgs = makeArgs34(args);
        /**
         * An optimisation - if all our dependencies are
         * compatible with the expression's class plan then we
         * can inline ourselves into that, otherwise we must
         * issue the query separately.
         */
        const canUseExpressionDirectly = $in instanceof PgSelectSingleStep && extraSelectArgs.every(a => stepAMayDependOnStepB($in.getClassStep(), a.step));
        const $row = canUseExpressionDirectly ? $in : pgSelectSingleFromRecord($in.resource, $in.record());
        const selectArgs = [{
          step: $row.record()
        }, ...extraSelectArgs];
        if (resource_person_computed_inoutPgResource.isUnique && !resource_person_computed_inoutPgResource.codec.attributes && typeof resource_person_computed_inoutPgResource.from === "function") {
          // This is a scalar computed attribute, let's inline the expression
          const placeholders = selectArgs.map((arg, i) => {
            if (i === 0) {
              return $row.getClassStep().alias;
            } else if ("pgCodec" in arg && arg.pgCodec) {
              return $row.placeholder(arg.step, arg.pgCodec);
            } else {
              return $row.placeholder(arg.step);
            }
          });
          return pgClassExpression($row, resource_person_computed_inoutPgResource.codec)`${resource_person_computed_inoutPgResource.from(...placeholders.map(placeholder => ({
            placeholder
          })))}`;
        }
        // PERF: or here, if scalar add select to `$row`?
        return resource_person_computed_inoutPgResource.execute(selectArgs);
      },
      args: {
        ino: undefined
      }
    },
    computedInoutOut: {
      plan($in, args, _info) {
        if (!hasRecord($in)) {
          throw new Error(`Invalid plan, exepcted 'PgSelectSingleStep', 'PgInsertSingleStep', 'PgUpdateSingleStep' or 'PgDeleteSingleStep', but found ${$in}`);
        }
        const extraSelectArgs = makeArgs35(args);
        /**
         * An optimisation - if all our dependencies are
         * compatible with the expression's class plan then we
         * can inline ourselves into that, otherwise we must
         * issue the query separately.
         */
        const canUseExpressionDirectly = $in instanceof PgSelectSingleStep && extraSelectArgs.every(a => stepAMayDependOnStepB($in.getClassStep(), a.step));
        const $row = canUseExpressionDirectly ? $in : pgSelectSingleFromRecord($in.resource, $in.record());
        const selectArgs = [{
          step: $row.record()
        }, ...extraSelectArgs];
        if (resource_person_computed_inout_outPgResource.isUnique && !resource_person_computed_inout_outPgResource.codec.attributes && typeof resource_person_computed_inout_outPgResource.from === "function") {
          // This is a scalar computed attribute, let's inline the expression
          const placeholders = selectArgs.map((arg, i) => {
            if (i === 0) {
              return $row.getClassStep().alias;
            } else if ("pgCodec" in arg && arg.pgCodec) {
              return $row.placeholder(arg.step, arg.pgCodec);
            } else {
              return $row.placeholder(arg.step);
            }
          });
          return pgClassExpression($row, resource_person_computed_inout_outPgResource.codec)`${resource_person_computed_inout_outPgResource.from(...placeholders.map(placeholder => ({
            placeholder
          })))}`;
        }
        // PERF: or here, if scalar add select to `$row`?
        return resource_person_computed_inout_outPgResource.execute(selectArgs);
      },
      args: {
        ino: undefined
      }
    },
    exists: {
      plan($in, args, _info) {
        if (!hasRecord($in)) {
          throw new Error(`Invalid plan, exepcted 'PgSelectSingleStep', 'PgInsertSingleStep', 'PgUpdateSingleStep' or 'PgDeleteSingleStep', but found ${$in}`);
        }
        const extraSelectArgs = makeArgs36(args);
        /**
         * An optimisation - if all our dependencies are
         * compatible with the expression's class plan then we
         * can inline ourselves into that, otherwise we must
         * issue the query separately.
         */
        const canUseExpressionDirectly = $in instanceof PgSelectSingleStep && extraSelectArgs.every(a => stepAMayDependOnStepB($in.getClassStep(), a.step));
        const $row = canUseExpressionDirectly ? $in : pgSelectSingleFromRecord($in.resource, $in.record());
        const selectArgs = [{
          step: $row.record()
        }, ...extraSelectArgs];
        if (resource_person_existsPgResource.isUnique && !resource_person_existsPgResource.codec.attributes && typeof resource_person_existsPgResource.from === "function") {
          // This is a scalar computed attribute, let's inline the expression
          const placeholders = selectArgs.map((arg, i) => {
            if (i === 0) {
              return $row.getClassStep().alias;
            } else if ("pgCodec" in arg && arg.pgCodec) {
              return $row.placeholder(arg.step, arg.pgCodec);
            } else {
              return $row.placeholder(arg.step);
            }
          });
          return pgClassExpression($row, resource_person_existsPgResource.codec)`${resource_person_existsPgResource.from(...placeholders.map(placeholder => ({
            placeholder
          })))}`;
        }
        // PERF: or here, if scalar add select to `$row`?
        return resource_person_existsPgResource.execute(selectArgs);
      },
      args: {
        email: undefined
      }
    },
    computedFirstArgInoutOut($in, args, _info) {
      if (!hasRecord($in)) {
        throw new Error(`Invalid plan, exepcted 'PgSelectSingleStep', 'PgInsertSingleStep', 'PgUpdateSingleStep' or 'PgDeleteSingleStep', but found ${$in}`);
      }
      const extraSelectArgs = makeArgs37(args);
      /**
       * An optimisation - if all our dependencies are
       * compatible with the expression's class plan then we
       * can inline ourselves into that, otherwise we must
       * issue the query separately.
       */
      const canUseExpressionDirectly = $in instanceof PgSelectSingleStep && extraSelectArgs.every(a => stepAMayDependOnStepB($in.getClassStep(), a.step));
      const $row = canUseExpressionDirectly ? $in : pgSelectSingleFromRecord($in.resource, $in.record());
      const selectArgs = [{
        step: $row.record()
      }, ...extraSelectArgs];
      if (resource_person_computed_first_arg_inout_outPgResource.isUnique && !resource_person_computed_first_arg_inout_outPgResource.codec.attributes && typeof resource_person_computed_first_arg_inout_outPgResource.from === "function") {
        // This is a scalar computed attribute, let's inline the expression
        const placeholders = selectArgs.map((arg, i) => {
          if (i === 0) {
            return $row.getClassStep().alias;
          } else if ("pgCodec" in arg && arg.pgCodec) {
            return $row.placeholder(arg.step, arg.pgCodec);
          } else {
            return $row.placeholder(arg.step);
          }
        });
        return pgClassExpression($row, resource_person_computed_first_arg_inout_outPgResource.codec)`${resource_person_computed_first_arg_inout_outPgResource.from(...placeholders.map(placeholder => ({
          placeholder
        })))}`;
      }
      // PERF: or here, if scalar add select to `$row`?
      return resource_person_computed_first_arg_inout_outPgResource.execute(selectArgs);
    },
    computedComplex: {
      plan($in, args, _info) {
        if (!hasRecord($in)) {
          throw new Error(`Invalid plan, exepcted 'PgSelectSingleStep', 'PgInsertSingleStep', 'PgUpdateSingleStep' or 'PgDeleteSingleStep', but found ${$in}`);
        }
        const extraSelectArgs = makeArgs38(args);
        /**
         * An optimisation - if all our dependencies are
         * compatible with the expression's class plan then we
         * can inline ourselves into that, otherwise we must
         * issue the query separately.
         */
        const canUseExpressionDirectly = $in instanceof PgSelectSingleStep && extraSelectArgs.every(a => stepAMayDependOnStepB($in.getClassStep(), a.step));
        const $row = canUseExpressionDirectly ? $in : pgSelectSingleFromRecord($in.resource, $in.record());
        const selectArgs = [{
          step: $row.record()
        }, ...extraSelectArgs];
        if (resource_person_computed_complexPgResource.isUnique && !resource_person_computed_complexPgResource.codec.attributes && typeof resource_person_computed_complexPgResource.from === "function") {
          // This is a scalar computed attribute, let's inline the expression
          const placeholders = selectArgs.map((arg, i) => {
            if (i === 0) {
              return $row.getClassStep().alias;
            } else if ("pgCodec" in arg && arg.pgCodec) {
              return $row.placeholder(arg.step, arg.pgCodec);
            } else {
              return $row.placeholder(arg.step);
            }
          });
          return pgClassExpression($row, resource_person_computed_complexPgResource.codec)`${resource_person_computed_complexPgResource.from(...placeholders.map(placeholder => ({
            placeholder
          })))}`;
        }
        // PERF: or here, if scalar add select to `$row`?
        return resource_person_computed_complexPgResource.execute(selectArgs);
      },
      args: {
        a: undefined,
        b: undefined
      }
    },
    firstPost($in, args, _info) {
      if (!hasRecord($in)) {
        throw new Error(`Invalid plan, exepcted 'PgSelectSingleStep', 'PgInsertSingleStep', 'PgUpdateSingleStep' or 'PgDeleteSingleStep', but found ${$in}`);
      }
      const extraSelectArgs = makeArgs39(args);
      /**
       * An optimisation - if all our dependencies are
       * compatible with the expression's class plan then we
       * can inline ourselves into that, otherwise we must
       * issue the query separately.
       */
      const canUseExpressionDirectly = $in instanceof PgSelectSingleStep && extraSelectArgs.every(a => stepAMayDependOnStepB($in.getClassStep(), a.step));
      const $row = canUseExpressionDirectly ? $in : pgSelectSingleFromRecord($in.resource, $in.record());
      const selectArgs = [{
        step: $row.record()
      }, ...extraSelectArgs];
      if (resource_person_first_postPgResource.isUnique && !resource_person_first_postPgResource.codec.attributes && typeof resource_person_first_postPgResource.from === "function") {
        // This is a scalar computed attribute, let's inline the expression
        const placeholders = selectArgs.map((arg, i) => {
          if (i === 0) {
            return $row.getClassStep().alias;
          } else if ("pgCodec" in arg && arg.pgCodec) {
            return $row.placeholder(arg.step, arg.pgCodec);
          } else {
            return $row.placeholder(arg.step);
          }
        });
        return pgClassExpression($row, resource_person_first_postPgResource.codec)`${resource_person_first_postPgResource.from(...placeholders.map(placeholder => ({
          placeholder
        })))}`;
      }
      // PERF: or here, if scalar add select to `$row`?
      return resource_person_first_postPgResource.execute(selectArgs);
    },
    computedFirstArgInout($in, args, _info) {
      if (!hasRecord($in)) {
        throw new Error(`Invalid plan, exepcted 'PgSelectSingleStep', 'PgInsertSingleStep', 'PgUpdateSingleStep' or 'PgDeleteSingleStep', but found ${$in}`);
      }
      const extraSelectArgs = makeArgs40(args);
      /**
       * An optimisation - if all our dependencies are
       * compatible with the expression's class plan then we
       * can inline ourselves into that, otherwise we must
       * issue the query separately.
       */
      const canUseExpressionDirectly = $in instanceof PgSelectSingleStep && extraSelectArgs.every(a => stepAMayDependOnStepB($in.getClassStep(), a.step));
      const $row = canUseExpressionDirectly ? $in : pgSelectSingleFromRecord($in.resource, $in.record());
      const selectArgs = [{
        step: $row.record()
      }, ...extraSelectArgs];
      if (resource_person_computed_first_arg_inoutPgResource.isUnique && !resource_person_computed_first_arg_inoutPgResource.codec.attributes && typeof resource_person_computed_first_arg_inoutPgResource.from === "function") {
        // This is a scalar computed attribute, let's inline the expression
        const placeholders = selectArgs.map((arg, i) => {
          if (i === 0) {
            return $row.getClassStep().alias;
          } else if ("pgCodec" in arg && arg.pgCodec) {
            return $row.placeholder(arg.step, arg.pgCodec);
          } else {
            return $row.placeholder(arg.step);
          }
        });
        return pgClassExpression($row, resource_person_computed_first_arg_inoutPgResource.codec)`${resource_person_computed_first_arg_inoutPgResource.from(...placeholders.map(placeholder => ({
          placeholder
        })))}`;
      }
      // PERF: or here, if scalar add select to `$row`?
      return resource_person_computed_first_arg_inoutPgResource.execute(selectArgs);
    },
    friends: {
      plan($parent, args, info) {
        const $select = getSelectPlanFromParentAndArgs12($parent, args, info);
        return connection($select, {
          // nodePlan: ($item) => $item,
          cursorPlan($item) {
            return $item.getParentStep ? $item.getParentStep().cursor() : $item.cursor();
          }
        });
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("PeopleOrderBy"));
            return null;
          }
        }
      }
    },
    typeFunctionConnection: {
      plan($parent, args, info) {
        const $select = getSelectPlanFromParentAndArgs13($parent, args, info);
        return connection($select, {
          // nodePlan: ($item) => $item,
          cursorPlan($item) {
            return $item.getParentStep ? $item.getParentStep().cursor() : $item.cursor();
          }
        });
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        }
      }
    },
    typeFunction: {
      plan($in, args, _info) {
        if (!hasRecord($in)) {
          throw new Error(`Invalid plan, exepcted 'PgSelectSingleStep', 'PgInsertSingleStep', 'PgUpdateSingleStep' or 'PgDeleteSingleStep', but found ${$in}`);
        }
        const extraSelectArgs = makeArgs43(args);
        /**
         * An optimisation - if all our dependencies are
         * compatible with the expression's class plan then we
         * can inline ourselves into that, otherwise we must
         * issue the query separately.
         */
        const canUseExpressionDirectly = $in instanceof PgSelectSingleStep && extraSelectArgs.every(a => stepAMayDependOnStepB($in.getClassStep(), a.step));
        const $row = canUseExpressionDirectly ? $in : pgSelectSingleFromRecord($in.resource, $in.record());
        const selectArgs = [{
          step: $row.record()
        }, ...extraSelectArgs];
        if (resource_person_type_functionPgResource.isUnique && !resource_person_type_functionPgResource.codec.attributes && typeof resource_person_type_functionPgResource.from === "function") {
          // This is a scalar computed attribute, let's inline the expression
          const placeholders = selectArgs.map((arg, i) => {
            if (i === 0) {
              return $row.getClassStep().alias;
            } else if ("pgCodec" in arg && arg.pgCodec) {
              return $row.placeholder(arg.step, arg.pgCodec);
            } else {
              return $row.placeholder(arg.step);
            }
          });
          return pgClassExpression($row, resource_person_type_functionPgResource.codec)`${resource_person_type_functionPgResource.from(...placeholders.map(placeholder => ({
            placeholder
          })))}`;
        }
        // PERF: or here, if scalar add select to `$row`?
        return resource_person_type_functionPgResource.execute(selectArgs);
      },
      args: {
        id: undefined
      }
    },
    typeFunctionList($in, args, _info) {
      if (!hasRecord($in)) {
        throw new Error(`Invalid plan, exepcted 'PgSelectSingleStep', 'PgInsertSingleStep', 'PgUpdateSingleStep' or 'PgDeleteSingleStep', but found ${$in}`);
      }
      const extraSelectArgs = makeArgs44(args);
      /**
       * An optimisation - if all our dependencies are
       * compatible with the expression's class plan then we
       * can inline ourselves into that, otherwise we must
       * issue the query separately.
       */
      const canUseExpressionDirectly = $in instanceof PgSelectSingleStep && extraSelectArgs.every(a => stepAMayDependOnStepB($in.getClassStep(), a.step));
      const $row = canUseExpressionDirectly ? $in : pgSelectSingleFromRecord($in.resource, $in.record());
      const selectArgs = [{
        step: $row.record()
      }, ...extraSelectArgs];
      if (resource_person_type_function_listPgResource.isUnique && !resource_person_type_function_listPgResource.codec.attributes && typeof resource_person_type_function_listPgResource.from === "function") {
        // This is a scalar computed attribute, let's inline the expression
        const placeholders = selectArgs.map((arg, i) => {
          if (i === 0) {
            return $row.getClassStep().alias;
          } else if ("pgCodec" in arg && arg.pgCodec) {
            return $row.placeholder(arg.step, arg.pgCodec);
          } else {
            return $row.placeholder(arg.step);
          }
        });
        return pgClassExpression($row, resource_person_type_function_listPgResource.codec)`${resource_person_type_function_listPgResource.from(...placeholders.map(placeholder => ({
          placeholder
        })))}`;
      }
      // PERF: or here, if scalar add select to `$row`?
      return resource_person_type_function_listPgResource.execute(selectArgs);
    },
    id($record) {
      return $record.get("id");
    },
    name($record) {
      return $record.get("person_full_name");
    },
    aliases($record) {
      return $record.get("aliases");
    },
    about($record) {
      return $record.get("about");
    },
    email($record) {
      return $record.get("email");
    },
    site($record) {
      const $plan = $record.get("site");
      const $select = pgSelectSingleFromRecord(resource_frmcdc_wrappedUrlPgResource, $plan);
      if (undefined) {
        $select.coalesceToEmptyObject();
      }
      $select.getClassStep().setTrusted();
      return $select;
    },
    config($record) {
      return $record.get("config");
    },
    lastLoginFromIp($record) {
      return $record.get("last_login_from_ip");
    },
    lastLoginFromSubnet($record) {
      return $record.get("last_login_from_subnet");
    },
    userMac($record) {
      return $record.get("user_mac");
    },
    createdAt($record) {
      return $record.get("created_at");
    },
    personSecretByPersonId($record) {
      return pgResource_person_secretPgResource.get({
        person_id: $record.get("id")
      });
    },
    leftArmByPersonId($record) {
      return pgResource_left_armPgResource.get({
        person_id: $record.get("id")
      });
    },
    compoundKeysByPersonId1: {
      plan($record) {
        const $records = pgResource_compound_keyPgResource.find({
          person_id_1: $record.get("id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("CompoundKeysOrderBy"));
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
    compoundKeysByPersonId2: {
      plan($record) {
        const $records = pgResource_compound_keyPgResource.find({
          person_id_2: $record.get("id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("CompoundKeysOrderBy"));
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
    personSecretsBySecret: {
      plan($record) {
        const $records = pgResource_person_secretPgResource.find({
          sekrit: $record.get("about")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("PersonSecretsOrderBy"));
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
  PersonComputedOutOutRecord: {
    __assertStep: assertPgClassSingleStep,
    o1($record) {
      return $record.get("o1");
    },
    o2($record) {
      return $record.get("o2");
    }
  },
  PersonComputedInoutOutRecord: {
    __assertStep: assertPgClassSingleStep,
    ino($record) {
      return $record.get("ino");
    },
    o($record) {
      return $record.get("o");
    }
  },
  Email: {
    serialize: GraphQLString.serialize,
    parseValue: GraphQLString.parseValue,
    parseLiteral: GraphQLString.parseLiteral
  },
  PersonComputedFirstArgInoutOutRecord: {
    __assertStep: assertPgClassSingleStep,
    person($record) {
      const $plan = $record.get("person");
      const $select = pgSelectSingleFromRecord(pgResource_personPgResource, $plan);
      if (undefined) {
        $select.coalesceToEmptyObject();
      }
      $select.getClassStep().setTrusted();
      return $select;
    },
    o($record) {
      return $record.get("o");
    }
  },
  PersonComputedComplexRecord: {
    __assertStep: assertPgClassSingleStep,
    x($record) {
      return $record.get("x");
    },
    y($record) {
      const $plan = $record.get("y");
      const $select = pgSelectSingleFromRecord(resource_frmcdc_compoundTypePgResource, $plan);
      if (undefined) {
        $select.coalesceToEmptyObject();
      }
      $select.getClassStep().setTrusted();
      return $select;
    },
    z($record) {
      const $plan = $record.get("z");
      const $select = pgSelectSingleFromRecord(pgResource_personPgResource, $plan);
      if (undefined) {
        $select.coalesceToEmptyObject();
      }
      $select.getClassStep().setTrusted();
      return $select;
    }
  },
  CompoundType: {
    __assertStep: assertPgClassSingleStep,
    computedField($in, args, _info) {
      if (!hasRecord($in)) {
        throw new Error(`Invalid plan, exepcted 'PgSelectSingleStep', 'PgInsertSingleStep', 'PgUpdateSingleStep' or 'PgDeleteSingleStep', but found ${$in}`);
      }
      const extraSelectArgs = makeArgs45(args);
      /**
       * An optimisation - if all our dependencies are
       * compatible with the expression's class plan then we
       * can inline ourselves into that, otherwise we must
       * issue the query separately.
       */
      const canUseExpressionDirectly = $in instanceof PgSelectSingleStep && extraSelectArgs.every(a => stepAMayDependOnStepB($in.getClassStep(), a.step));
      const $row = canUseExpressionDirectly ? $in : pgSelectSingleFromRecord($in.resource, $in.record());
      const selectArgs = [{
        step: $row.record()
      }, ...extraSelectArgs];
      if (resource_compound_type_computed_fieldPgResource.isUnique && !resource_compound_type_computed_fieldPgResource.codec.attributes && typeof resource_compound_type_computed_fieldPgResource.from === "function") {
        // This is a scalar computed attribute, let's inline the expression
        const placeholders = selectArgs.map((arg, i) => {
          if (i === 0) {
            return $row.getClassStep().alias;
          } else if ("pgCodec" in arg && arg.pgCodec) {
            return $row.placeholder(arg.step, arg.pgCodec);
          } else {
            return $row.placeholder(arg.step);
          }
        });
        return pgClassExpression($row, resource_compound_type_computed_fieldPgResource.codec)`${resource_compound_type_computed_fieldPgResource.from(...placeholders.map(placeholder => ({
          placeholder
        })))}`;
      }
      // PERF: or here, if scalar add select to `$row`?
      return resource_compound_type_computed_fieldPgResource.execute(selectArgs);
    },
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
  UUID: {
    serialize: UUIDSerialize,
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
    __assertStep: assertExecutableStep,
    seconds($r) {
      return access($r, ["seconds"]);
    },
    minutes($r) {
      return access($r, ["minutes"]);
    },
    hours($r) {
      return access($r, ["hours"]);
    },
    days($r) {
      return access($r, ["days"]);
    },
    months($r) {
      return access($r, ["months"]);
    },
    years($r) {
      return access($r, ["years"]);
    }
  },
  Post: {
    __assertStep: assertPgClassSingleStep,
    id($record) {
      return $record.get("id");
    },
    headline($record) {
      return $record.get("headline");
    },
    body($record) {
      return $record.get("body");
    },
    authorId($record) {
      return $record.get("author_id");
    },
    enums($record) {
      return $record.get("enums");
    },
    comptypes($record) {
      const $val = $record.get("comptypes");
      const $select = pgSelectFromRecords(resource_frmcdc_comptypePgResource, $val);
      $select.setTrusted();
      return $select;
    }
  },
  AnEnum: {
    AWAITING: {
      value: "awaiting"
    },
    REJECTED: {
      value: "rejected"
    },
    PUBLISHED: {
      value: "published"
    },
    ASTERISK: {
      value: "*"
    },
    ASTERISK_ASTERISK: {
      value: "**"
    },
    ASTERISK_ASTERISK_ASTERISK: {
      value: "***"
    },
    FOO_ASTERISK: {
      value: "foo*"
    },
    FOO_ASTERISK_: {
      value: "foo*_"
    },
    _FOO_ASTERISK: {
      value: "_foo*"
    },
    ASTERISK_BAR: {
      value: "*bar"
    },
    ASTERISK_BAR_: {
      value: "*bar_"
    },
    _ASTERISK_BAR_: {
      value: "_*bar_"
    },
    ASTERISK_BAZ_ASTERISK: {
      value: "*baz*"
    },
    _ASTERISK_BAZ_ASTERISK_: {
      value: "_*baz*_"
    },
    PERCENT: {
      value: "%"
    },
    GREATER_THAN_OR_EQUAL: {
      value: ">="
    },
    LIKE: {
      value: "~~"
    },
    DOLLAR: {
      value: "$"
    }
  },
  Comptype: {
    __assertStep: assertPgClassSingleStep,
    schedule($record) {
      return $record.get("schedule");
    },
    isOptimised($record) {
      return $record.get("is_optimised");
    }
  },
  Datetime: {
    serialize: UUIDSerialize,
    parseValue: UUIDSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"Datetime" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
    }
  },
  PeopleConnection: {
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
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  PeopleEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  Cursor: {
    serialize: UUIDSerialize,
    parseValue: UUIDSerialize,
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
  PeopleOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    COMPUTED_OUT_ASC: {
      applyPlan(step) {
        if (typeof resource_person_computed_outPgResource.from !== "function") {
          throw new Error("Invalid computed attribute 'from'");
        }
        const expression = sql`${resource_person_computed_outPgResource.from({
          placeholder: step.alias
        })}`;
        step.orderBy({
          codec: resource_person_computed_outPgResource.codec,
          fragment: expression,
          direction: "asc".toUpperCase()
        });
      }
    },
    COMPUTED_OUT_DESC: {
      applyPlan(step) {
        if (typeof resource_person_computed_outPgResource.from !== "function") {
          throw new Error("Invalid computed attribute 'from'");
        }
        const expression = sql`${resource_person_computed_outPgResource.from({
          placeholder: step.alias
        })}`;
        step.orderBy({
          codec: resource_person_computed_outPgResource.codec,
          fragment: expression,
          direction: "desc".toUpperCase()
        });
      }
    },
    FIRST_NAME_ASC: {
      applyPlan(step) {
        if (typeof resource_person_first_namePgResource.from !== "function") {
          throw new Error("Invalid computed attribute 'from'");
        }
        const expression = sql`${resource_person_first_namePgResource.from({
          placeholder: step.alias
        })}`;
        step.orderBy({
          codec: resource_person_first_namePgResource.codec,
          fragment: expression,
          direction: "asc".toUpperCase()
        });
      }
    },
    FIRST_NAME_DESC: {
      applyPlan(step) {
        if (typeof resource_person_first_namePgResource.from !== "function") {
          throw new Error("Invalid computed attribute 'from'");
        }
        const expression = sql`${resource_person_first_namePgResource.from({
          placeholder: step.alias
        })}`;
        step.orderBy({
          codec: resource_person_first_namePgResource.codec,
          fragment: expression,
          direction: "desc".toUpperCase()
        });
      }
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        personUniques[0].attributes.forEach(attributeName => {
          const attribute = personCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
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
        personUniques[0].attributes.forEach(attributeName => {
          const attribute = personCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
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
          attribute: "person_full_name",
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
          attribute: "person_full_name",
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
    ABOUT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "about",
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
    ABOUT_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "about",
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
    EMAIL_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "email",
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
    EMAIL_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "email",
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
    SITE_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "site",
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
    SITE_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "site",
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
    CONFIG_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "config",
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
    CONFIG_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "config",
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
    LAST_LOGIN_FROM_IP_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "last_login_from_ip",
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
    LAST_LOGIN_FROM_IP_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "last_login_from_ip",
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
    LAST_LOGIN_FROM_SUBNET_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "last_login_from_subnet",
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
    LAST_LOGIN_FROM_SUBNET_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "last_login_from_subnet",
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
    USER_MAC_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "user_mac",
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
    USER_MAC_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "user_mac",
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
    CREATED_AT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "created_at",
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
    CREATED_AT_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "created_at",
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
  TypesConnection: {
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
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  Type: {
    __assertStep: assertPgClassSingleStep,
    id($record) {
      return $record.get("id");
    },
    smallint($record) {
      return $record.get("smallint");
    },
    bigint($record) {
      return $record.get("bigint");
    },
    numeric($record) {
      return $record.get("numeric");
    },
    decimal($record) {
      return $record.get("decimal");
    },
    boolean($record) {
      return $record.get("boolean");
    },
    varchar($record) {
      return $record.get("varchar");
    },
    enum($record) {
      return $record.get("enum");
    },
    enumArray($record) {
      return $record.get("enum_array");
    },
    domain($record) {
      return $record.get("domain");
    },
    domain2($record) {
      return $record.get("domain2");
    },
    textArray($record) {
      return $record.get("text_array");
    },
    json($record) {
      return $record.get("json");
    },
    jsonb($record) {
      return $record.get("jsonb");
    },
    nullableRange($record) {
      return $record.get("nullable_range");
    },
    numrange($record) {
      return $record.get("numrange");
    },
    daterange($record) {
      return $record.get("daterange");
    },
    anIntRange($record) {
      return $record.get("an_int_range");
    },
    timestamp($record) {
      return $record.get("timestamp");
    },
    timestamptz($record) {
      return $record.get("timestamptz");
    },
    date($record) {
      return $record.get("date");
    },
    time($record) {
      return $record.get("time");
    },
    timetz($record) {
      return $record.get("timetz");
    },
    interval($record) {
      return $record.get("interval");
    },
    intervalArray($record) {
      return $record.get("interval_array");
    },
    money($record) {
      return $record.get("money");
    },
    compoundType($record) {
      const $plan = $record.get("compound_type");
      const $select = pgSelectSingleFromRecord(resource_frmcdc_compoundTypePgResource, $plan);
      if (true) {
        $select.coalesceToEmptyObject();
      }
      $select.getClassStep().setTrusted();
      return $select;
    },
    nestedCompoundType($record) {
      const $plan = $record.get("nested_compound_type");
      const $select = pgSelectSingleFromRecord(resource_frmcdc_nestedCompoundTypePgResource, $plan);
      if (true) {
        $select.coalesceToEmptyObject();
      }
      $select.getClassStep().setTrusted();
      return $select;
    },
    nullableCompoundType($record) {
      const $plan = $record.get("nullable_compound_type");
      const $select = pgSelectSingleFromRecord(resource_frmcdc_compoundTypePgResource, $plan);
      if (undefined) {
        $select.coalesceToEmptyObject();
      }
      $select.getClassStep().setTrusted();
      return $select;
    },
    nullableNestedCompoundType($record) {
      const $plan = $record.get("nullable_nested_compound_type");
      const $select = pgSelectSingleFromRecord(resource_frmcdc_nestedCompoundTypePgResource, $plan);
      if (undefined) {
        $select.coalesceToEmptyObject();
      }
      $select.getClassStep().setTrusted();
      return $select;
    },
    point($record) {
      return $record.get("point");
    },
    nullablePoint($record) {
      return $record.get("nullablePoint");
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
    regproc($record) {
      return $record.get("regproc");
    },
    regprocedure($record) {
      return $record.get("regprocedure");
    },
    regoper($record) {
      return $record.get("regoper");
    },
    regoperator($record) {
      return $record.get("regoperator");
    },
    regclass($record) {
      return $record.get("regclass");
    },
    regtype($record) {
      return $record.get("regtype");
    },
    regconfig($record) {
      return $record.get("regconfig");
    },
    regdictionary($record) {
      return $record.get("regdictionary");
    },
    textArrayDomain($record) {
      return $record.get("text_array_domain");
    },
    int8ArrayDomain($record) {
      return $record.get("int8_array_domain");
    },
    bytea($record) {
      return $record.get("bytea");
    },
    byteaArray($record) {
      return $record.get("bytea_array");
    },
    ltree($record) {
      return $record.get("ltree");
    },
    ltreeArray($record) {
      return $record.get("ltree_array");
    }
  },
  BigInt: {
    serialize: UUIDSerialize,
    parseValue: UUIDSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"BigInt" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
    }
  },
  BigFloat: {
    serialize: UUIDSerialize,
    parseValue: UUIDSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"BigFloat" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
    }
  },
  AnInt: {
    serialize: GraphQLInt.serialize,
    parseValue: GraphQLInt.parseValue,
    parseLiteral: GraphQLInt.parseLiteral
  },
  AnotherInt: {
    serialize: GraphQLInt.serialize,
    parseValue: GraphQLInt.parseValue,
    parseLiteral: GraphQLInt.parseLiteral
  },
  BigFloatRange: {},
  BigFloatRangeBound: {},
  DateRange: {},
  DateRangeBound: {},
  Date: {
    serialize: UUIDSerialize,
    parseValue: UUIDSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"Date" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
    }
  },
  AnIntRange: {},
  AnIntRangeBound: {},
  Time: {
    serialize: UUIDSerialize,
    parseValue: UUIDSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"Time" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
    }
  },
  NestedCompoundType: {
    __assertStep: assertPgClassSingleStep,
    a($record) {
      const $plan = $record.get("a");
      const $select = pgSelectSingleFromRecord(resource_frmcdc_compoundTypePgResource, $plan);
      if (undefined) {
        $select.coalesceToEmptyObject();
      }
      $select.getClassStep().setTrusted();
      return $select;
    },
    b($record) {
      const $plan = $record.get("b");
      const $select = pgSelectSingleFromRecord(resource_frmcdc_compoundTypePgResource, $plan);
      if (undefined) {
        $select.coalesceToEmptyObject();
      }
      $select.getClassStep().setTrusted();
      return $select;
    },
    bazBuz($record) {
      return $record.get("baz_buz");
    }
  },
  Point: {},
  InternetAddress: {
    serialize: UUIDSerialize,
    parseValue: UUIDSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"InternetAddress" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
    }
  },
  RegProc: {
    serialize: UUIDSerialize,
    parseValue: UUIDSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"RegProc" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
    }
  },
  RegProcedure: {
    serialize: UUIDSerialize,
    parseValue: UUIDSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"RegProcedure" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
    }
  },
  RegOper: {
    serialize: UUIDSerialize,
    parseValue: UUIDSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"RegOper" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
    }
  },
  RegOperator: {
    serialize: UUIDSerialize,
    parseValue: UUIDSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"RegOperator" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
    }
  },
  RegClass: {
    serialize: UUIDSerialize,
    parseValue: UUIDSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"RegClass" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
    }
  },
  RegType: {
    serialize: UUIDSerialize,
    parseValue: UUIDSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"RegType" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
    }
  },
  RegConfig: {
    serialize: UUIDSerialize,
    parseValue: UUIDSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"RegConfig" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
    }
  },
  RegDictionary: {
    serialize: UUIDSerialize,
    parseValue: UUIDSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"RegDictionary" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
    }
  },
  Base64EncodedBinary: {
    serialize(data) {
      if (Buffer.isBuffer(data)) {
        return data.toString("base64");
      } else {
        throw new Error(`Base64EncodeBinary can only be used with Node.js buffers.`);
      }
    },
    parseValue(data) {
      if (typeof data === "string") {
        return Buffer.from(data, "base64");
      } else {
        throw new GraphQLError("Base64EncodedBinary can only parse string values.");
      }
    },
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        // TODO: add name to this error
        throw new GraphQLError("Base64EncodedBinary can only parse string values");
      }
      return Buffer.from(ast.value, "base64");
    }
  },
  LTree: {
    serialize(x) {
      return x;
    },
    parseValue: LTreeParseValue,
    parseLiteral(node, variables) {
      return LTreeParseValue(valueFromASTUntyped(node, variables));
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
  WrappedUrl: {
    __assertStep: assertPgClassSingleStep,
    url($record) {
      return $record.get("url");
    }
  },
  NotNullUrl: {
    serialize: GraphQLString.serialize,
    parseValue: GraphQLString.parseValue,
    parseLiteral: GraphQLString.parseLiteral
  },
  KeyValueHash: {
    serialize(value) {
      return value;
    },
    parseValue(obj) {
      if (isValidHstoreObject(obj)) {
        return obj;
      }
      throw new GraphQLError(`This is not a valid ${"KeyValueHash"} object, it must be a key/value hash where keys and values are both strings (or null).`);
    },
    parseLiteral(ast, variables) {
      switch (ast.kind) {
        case Kind.OBJECT:
          {
            const value = ast.fields.reduce((memo, field) => {
              memo[field.name.value] = parseValueLiteral(field.value, variables);
              return memo;
            }, Object.create(null));
            if (!isValidHstoreObject(value)) {
              return undefined;
            }
            return value;
          }
        case Kind.NULL:
          return null;
        case Kind.VARIABLE:
          {
            const name = ast.name.value;
            const value = variables ? variables[name] : undefined;
            if (!isValidHstoreObject(value)) {
              return undefined;
            }
            return value;
          }
        default:
          return undefined;
      }
    }
  },
  LeftArm: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.LeftArm.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.LeftArm.codec.name].encode);
    },
    id($record) {
      return $record.get("id");
    },
    personId($record) {
      return $record.get("person_id");
    },
    lengthInMetres($record) {
      return $record.get("length_in_metres");
    },
    mood($record) {
      return $record.get("mood");
    },
    personByPersonId($record) {
      return pgResource_personPgResource.get({
        id: $record.get("person_id")
      });
    }
  },
  CompoundKeysConnection: {
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
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  CompoundKey: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.CompoundKey.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.CompoundKey.codec.name].encode);
    },
    personId2($record) {
      return $record.get("person_id_2");
    },
    personId1($record) {
      return $record.get("person_id_1");
    },
    extra($record) {
      return $record.get("extra");
    },
    personByPersonId1($record) {
      return pgResource_personPgResource.get({
        id: $record.get("person_id_1")
      });
    },
    personByPersonId2($record) {
      return pgResource_personPgResource.get({
        id: $record.get("person_id_2")
      });
    }
  },
  CompoundKeysEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  CompoundKeysOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        compound_keyUniques[0].attributes.forEach(attributeName => {
          const attribute = compoundKeyCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
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
        compound_keyUniques[0].attributes.forEach(attributeName => {
          const attribute = compoundKeyCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
            direction: "DESC",
            ...(undefined != null ? {
              nulls: undefined ? "LAST" : "FIRST"
            } : null)
          });
        });
        step.setOrderIsUnique();
      }
    },
    PERSON_ID_2_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "person_id_2",
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
    PERSON_ID_2_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "person_id_2",
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
    PERSON_ID_1_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "person_id_1",
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
    PERSON_ID_1_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "person_id_1",
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
    EXTRA_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "extra",
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
    EXTRA_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "extra",
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
  CompoundKeyCondition: {
    personId2: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "person_id_2",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "person_id_2",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_compoundKey.attributes.person_id_2.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    personId1: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "person_id_1",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "person_id_1",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_compoundKey.attributes.person_id_1.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    extra: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "extra",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "extra",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_compoundKey.attributes.extra.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  PersonSecretsConnection: {
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
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  PersonSecretsEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  PersonSecretsOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        person_secretUniques[0].attributes.forEach(attributeName => {
          const attribute = personSecretCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
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
        person_secretUniques[0].attributes.forEach(attributeName => {
          const attribute = personSecretCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
            direction: "DESC",
            ...(undefined != null ? {
              nulls: undefined ? "LAST" : "FIRST"
            } : null)
          });
        });
        step.setOrderIsUnique();
      }
    },
    PERSON_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "person_id",
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
    PERSON_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "person_id",
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
    SECRET_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "sekrit",
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
    SECRET_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "sekrit",
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
  PersonSecretCondition: {
    personId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "person_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "person_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_personSecret.attributes.person_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    secret: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "sekrit",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "sekrit",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_personSecret.attributes.sekrit.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  NullTestRecord: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.NullTestRecord.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.NullTestRecord.codec.name].encode);
    },
    id($record) {
      return $record.get("id");
    },
    nullableText($record) {
      return $record.get("nullable_text");
    },
    nullableInt($record) {
      return $record.get("nullable_int");
    },
    nonNullText($record) {
      return $record.get("non_null_text");
    }
  },
  Issue756: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.Issue756.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Issue756.codec.name].encode);
    },
    id($record) {
      return $record.get("id");
    },
    ts($record) {
      return $record.get("ts");
    }
  },
  NotNullTimestamp: {
    serialize: UUIDSerialize,
    parseValue: UUIDSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"Datetime" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
    }
  },
  FuncOutSetofConnection: {
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
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  FuncOutSetofEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  FuncReturnsTableOneColConnection: {
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
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  FuncReturnsTableOneColEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  FuncOutOutRecord: {
    __assertStep: assertPgClassSingleStep,
    firstOut($record) {
      return $record.get("first_out");
    },
    secondOut($record) {
      return $record.get("second_out");
    }
  },
  FuncOutOutSetofConnection: {
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
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  FuncOutOutSetofRecord: {
    __assertStep: assertPgClassSingleStep,
    o1($record) {
      return $record.get("o1");
    },
    o2($record) {
      return $record.get("o2");
    }
  },
  FuncOutOutSetofEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  FuncOutOutUnnamedRecord: {
    __assertStep: assertPgClassSingleStep,
    arg1($record) {
      return $record.get("column1");
    },
    arg2($record) {
      return $record.get("column2");
    }
  },
  FuncOutUnnamedOutOutUnnamedRecord: {
    __assertStep: assertPgClassSingleStep,
    arg1($record) {
      return $record.get("column1");
    },
    o2($record) {
      return $record.get("o2");
    },
    arg3($record) {
      return $record.get("column3");
    }
  },
  FuncReturnsTableMultiColConnection: {
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
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  FuncReturnsTableMultiColRecord: {
    __assertStep: assertPgClassSingleStep,
    col1($record) {
      return $record.get("col1");
    },
    col2($record) {
      return $record.get("col2");
    }
  },
  FuncReturnsTableMultiColEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  IntSetQueryConnection: {
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
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  IntSetQueryEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  SearchTestSummariesRecord: {
    __assertStep: assertPgClassSingleStep,
    id($record) {
      return $record.get("id");
    },
    totalDuration($record) {
      return $record.get("total_duration");
    }
  },
  FloatRangeInput: {
    start: undefined,
    end: undefined
  },
  FloatRangeBoundInput: {
    value: undefined,
    inclusive: undefined
  },
  FuncOutOutCompoundTypeRecord: {
    __assertStep: assertPgClassSingleStep,
    o1($record) {
      return $record.get("o1");
    },
    o2($record) {
      const $plan = $record.get("o2");
      const $select = pgSelectSingleFromRecord(resource_frmcdc_compoundTypePgResource, $plan);
      if (undefined) {
        $select.coalesceToEmptyObject();
      }
      $select.getClassStep().setTrusted();
      return $select;
    }
  },
  QueryOutputTwoRowsRecord: {
    __assertStep: assertPgClassSingleStep,
    txt($record) {
      return $record.get("txt");
    },
    leftArm($record) {
      const $plan = $record.get("left_arm");
      const $select = pgSelectSingleFromRecord(pgResource_left_armPgResource, $plan);
      if (undefined) {
        $select.coalesceToEmptyObject();
      }
      $select.getClassStep().setTrusted();
      return $select;
    },
    post($record) {
      const $plan = $record.get("post");
      const $select = pgSelectSingleFromRecord(resource_frmcdc_postPgResource, $plan);
      if (undefined) {
        $select.coalesceToEmptyObject();
      }
      $select.getClassStep().setTrusted();
      return $select;
    }
  },
  CompoundTypesConnection: {
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
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  CompoundTypesEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  FuncOutComplexRecord: {
    __assertStep: assertPgClassSingleStep,
    x($record) {
      return $record.get("x");
    },
    y($record) {
      const $plan = $record.get("y");
      const $select = pgSelectSingleFromRecord(resource_frmcdc_compoundTypePgResource, $plan);
      if (undefined) {
        $select.coalesceToEmptyObject();
      }
      $select.getClassStep().setTrusted();
      return $select;
    },
    z($record) {
      const $plan = $record.get("z");
      const $select = pgSelectSingleFromRecord(pgResource_personPgResource, $plan);
      if (undefined) {
        $select.coalesceToEmptyObject();
      }
      $select.getClassStep().setTrusted();
      return $select;
    }
  },
  FuncOutComplexSetofConnection: {
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
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  FuncOutComplexSetofRecord: {
    __assertStep: assertPgClassSingleStep,
    x($record) {
      return $record.get("x");
    },
    y($record) {
      const $plan = $record.get("y");
      const $select = pgSelectSingleFromRecord(resource_frmcdc_compoundTypePgResource, $plan);
      if (undefined) {
        $select.coalesceToEmptyObject();
      }
      $select.getClassStep().setTrusted();
      return $select;
    },
    z($record) {
      const $plan = $record.get("z");
      const $select = pgSelectSingleFromRecord(pgResource_personPgResource, $plan);
      if (undefined) {
        $select.coalesceToEmptyObject();
      }
      $select.getClassStep().setTrusted();
      return $select;
    }
  },
  FuncOutComplexSetofEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  PersonCondition: {
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_person.attributes.id.codec)}`;
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
            attribute: "person_full_name",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "person_full_name",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_person.attributes.person_full_name.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    aliases: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "aliases",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "aliases",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_person.attributes.aliases.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    about: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "about",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "about",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_person.attributes.about.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    email: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "email",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "email",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_person.attributes.email.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    site: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "site",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "site",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_person.attributes.site.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    config: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "config",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "config",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_person.attributes.config.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    lastLoginFromIp: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "last_login_from_ip",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "last_login_from_ip",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_person.attributes.last_login_from_ip.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    lastLoginFromSubnet: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "last_login_from_subnet",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "last_login_from_subnet",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_person.attributes.last_login_from_subnet.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    userMac: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "user_mac",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "user_mac",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_person.attributes.user_mac.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    createdAt: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "created_at",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "created_at",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_person.attributes.created_at.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    computedOut: {
      applyPlan($condition, val) {
        if (typeof resource_person_computed_outPgResource.from !== "function") {
          throw new Error("Invalid computed attribute 'from'");
        }
        const expression = sql`${resource_person_computed_outPgResource.from({
          placeholder: $condition.alias
        })}`;
        if (val.getRaw().evalIs(null)) {
          $condition.where(sql`${expression} is null`);
        } else {
          $condition.where(sql`${expression} = ${$condition.placeholder(val.get(), resource_person_computed_outPgResource.codec)}`);
        }
      }
    }
  },
  WrappedUrlInput: {
    "__inputPlan": function WrappedUrlInput_inputPlan() {
      return object(Object.create(null));
    },
    url: {
      applyPlan($insert, val) {
        $insert.set("url", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  MyTablesConnection: {
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
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  MyTablesEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  MyTablesOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        my_tableUniques[0].attributes.forEach(attributeName => {
          const attribute = myTableCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
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
        my_tableUniques[0].attributes.forEach(attributeName => {
          const attribute = myTableCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
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
    JSON_DATA_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "json_data",
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
    JSON_DATA_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "json_data",
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
  MyTableCondition: {
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_myTable.attributes.id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    jsonData: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "json_data",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "json_data",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_myTable.attributes.json_data.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  NullTestRecordsConnection: {
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
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  NullTestRecordsEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  NullTestRecordsOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        null_test_recordUniques[0].attributes.forEach(attributeName => {
          const attribute = nullTestRecordCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
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
        null_test_recordUniques[0].attributes.forEach(attributeName => {
          const attribute = nullTestRecordCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
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
    NULLABLE_TEXT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "nullable_text",
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
    NULLABLE_TEXT_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "nullable_text",
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
    NULLABLE_INT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "nullable_int",
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
    NULLABLE_INT_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "nullable_int",
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
    NON_NULL_TEXT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "non_null_text",
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
    NON_NULL_TEXT_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "non_null_text",
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
  NullTestRecordCondition: {
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_nullTestRecord.attributes.id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    nullableText: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "nullable_text",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "nullable_text",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_nullTestRecord.attributes.nullable_text.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    nullableInt: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "nullable_int",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "nullable_int",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_nullTestRecord.attributes.nullable_int.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    nonNullText: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "non_null_text",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "non_null_text",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_nullTestRecord.attributes.non_null_text.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  EdgeCasesConnection: {
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
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  EdgeCase: {
    __assertStep: assertPgClassSingleStep,
    computed($in, args, _info) {
      if (!hasRecord($in)) {
        throw new Error(`Invalid plan, exepcted 'PgSelectSingleStep', 'PgInsertSingleStep', 'PgUpdateSingleStep' or 'PgDeleteSingleStep', but found ${$in}`);
      }
      const extraSelectArgs = makeArgs46(args);
      /**
       * An optimisation - if all our dependencies are
       * compatible with the expression's class plan then we
       * can inline ourselves into that, otherwise we must
       * issue the query separately.
       */
      const canUseExpressionDirectly = $in instanceof PgSelectSingleStep && extraSelectArgs.every(a => stepAMayDependOnStepB($in.getClassStep(), a.step));
      const $row = canUseExpressionDirectly ? $in : pgSelectSingleFromRecord($in.resource, $in.record());
      const selectArgs = [{
        step: $row.record()
      }, ...extraSelectArgs];
      if (resource_edge_case_computedPgResource.isUnique && !resource_edge_case_computedPgResource.codec.attributes && typeof resource_edge_case_computedPgResource.from === "function") {
        // This is a scalar computed attribute, let's inline the expression
        const placeholders = selectArgs.map((arg, i) => {
          if (i === 0) {
            return $row.getClassStep().alias;
          } else if ("pgCodec" in arg && arg.pgCodec) {
            return $row.placeholder(arg.step, arg.pgCodec);
          } else {
            return $row.placeholder(arg.step);
          }
        });
        return pgClassExpression($row, resource_edge_case_computedPgResource.codec)`${resource_edge_case_computedPgResource.from(...placeholders.map(placeholder => ({
          placeholder
        })))}`;
      }
      // PERF: or here, if scalar add select to `$row`?
      return resource_edge_case_computedPgResource.execute(selectArgs);
    },
    notNullHasDefault($record) {
      return $record.get("not_null_has_default");
    },
    wontCastEasy($record) {
      return $record.get("wont_cast_easy");
    },
    rowId($record) {
      return $record.get("row_id");
    }
  },
  EdgeCasesEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  EdgeCasesOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    NOT_NULL_HAS_DEFAULT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "not_null_has_default",
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
    NOT_NULL_HAS_DEFAULT_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "not_null_has_default",
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
    WONT_CAST_EASY_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "wont_cast_easy",
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
    WONT_CAST_EASY_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "wont_cast_easy",
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
    ROW_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "row_id",
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
    ROW_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "row_id",
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
  EdgeCaseCondition: {
    notNullHasDefault: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "not_null_has_default",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "not_null_has_default",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_edgeCase.attributes.not_null_has_default.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    wontCastEasy: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "wont_cast_easy",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "wont_cast_easy",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_edgeCase.attributes.wont_cast_easy.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    rowId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "row_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "row_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_edgeCase.attributes.row_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  LeftArmsConnection: {
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
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  LeftArmsEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  LeftArmsOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        left_armUniques[0].attributes.forEach(attributeName => {
          const attribute = leftArmCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
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
        left_armUniques[0].attributes.forEach(attributeName => {
          const attribute = leftArmCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
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
    PERSON_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "person_id",
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
    PERSON_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "person_id",
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
    LENGTH_IN_METRES_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "length_in_metres",
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
    LENGTH_IN_METRES_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "length_in_metres",
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
    MOOD_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "mood",
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
    MOOD_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "mood",
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
  LeftArmCondition: {
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_leftArm.attributes.id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    personId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "person_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "person_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_leftArm.attributes.person_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    lengthInMetres: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "length_in_metres",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "length_in_metres",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_leftArm.attributes.length_in_metres.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    mood: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "mood",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "mood",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_leftArm.attributes.mood.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  Issue756SConnection: {
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
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  Issue756SEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  Issue756SOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        issue756Uniques[0].attributes.forEach(attributeName => {
          const attribute = issue756Codec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
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
        issue756Uniques[0].attributes.forEach(attributeName => {
          const attribute = issue756Codec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
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
    TS_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "ts",
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
    TS_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "ts",
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
  Issue756Condition: {
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_issue756.attributes.id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    ts: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "ts",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "ts",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_issue756.attributes.ts.codec)}`;
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
    mutationOut: {
      plan($root, args, _info) {
        const selectArgs = makeArgs47(args, ["input"]);
        const $result = resource_mutation_outPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    mutationOutSetof: {
      plan($root, args, _info) {
        const selectArgs = makeArgs48(args, ["input"]);
        const $result = resource_mutation_out_setofPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    mutationOutUnnamed: {
      plan($root, args, _info) {
        const selectArgs = makeArgs49(args, ["input"]);
        const $result = resource_mutation_out_unnamedPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    noArgsMutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs50(args, ["input"]);
        const $result = resource_no_args_mutationPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    mutationInOut: {
      plan($root, args, _info) {
        const selectArgs = makeArgs51(args, ["input"]);
        const $result = resource_mutation_in_outPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    mutationReturnsTableOneCol: {
      plan($root, args, _info) {
        const selectArgs = makeArgs52(args, ["input"]);
        const $result = resource_mutation_returns_table_one_colPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    jsonIdentityMutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs53(args, ["input"]);
        const $result = resource_json_identity_mutationPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    jsonbIdentityMutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs54(args, ["input"]);
        const $result = resource_jsonb_identity_mutationPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    jsonbIdentityMutationPlpgsql: {
      plan($root, args, _info) {
        const selectArgs = makeArgs55(args, ["input"]);
        const $result = resource_jsonb_identity_mutation_plpgsqlPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    jsonbIdentityMutationPlpgsqlWithDefault: {
      plan($root, args, _info) {
        const selectArgs = makeArgs56(args, ["input"]);
        const $result = resource_jsonb_identity_mutation_plpgsql_with_defaultPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    mutationInInout: {
      plan($root, args, _info) {
        const selectArgs = makeArgs57(args, ["input"]);
        const $result = resource_mutation_in_inoutPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    mutationOutOut: {
      plan($root, args, _info) {
        const selectArgs = makeArgs58(args, ["input"]);
        const $result = resource_mutation_out_outPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    mutationOutOutSetof: {
      plan($root, args, _info) {
        const selectArgs = makeArgs59(args, ["input"]);
        const $result = resource_mutation_out_out_setofPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    mutationOutOutUnnamed: {
      plan($root, args, _info) {
        const selectArgs = makeArgs60(args, ["input"]);
        const $result = resource_mutation_out_out_unnamedPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    intSetMutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs61(args, ["input"]);
        const $result = resource_int_set_mutationPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    mutationOutUnnamedOutOutUnnamed: {
      plan($root, args, _info) {
        const selectArgs = makeArgs62(args, ["input"]);
        const $result = resource_mutation_out_unnamed_out_out_unnamedPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    mutationReturnsTableMultiCol: {
      plan($root, args, _info) {
        const selectArgs = makeArgs63(args, ["input"]);
        const $result = resource_mutation_returns_table_multi_colPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    leftArmIdentity: {
      plan($root, args, _info) {
        const selectArgs = makeArgs64(args, ["input"]);
        const $result = resource_left_arm_identityPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    issue756Mutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs65(args, ["input"]);
        const $result = resource_issue756_mutationPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    issue756SetMutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs66(args, ["input"]);
        const $result = resource_issue756_set_mutationPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    typesMutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs67(args, ["input"]);
        const $result = resource_types_mutationPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    mutationOutOutCompoundType: {
      plan($root, args, _info) {
        const selectArgs = makeArgs68(args, ["input"]);
        const $result = resource_mutation_out_out_compound_typePgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    tableMutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs69(args, ["input"]);
        const $result = resource_table_mutationPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    mutationOutComplex: {
      plan($root, args, _info) {
        const selectArgs = makeArgs70(args, ["input"]);
        const $result = resource_mutation_out_complexPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    mutationOutComplexSetof: {
      plan($root, args, _info) {
        const selectArgs = makeArgs71(args, ["input"]);
        const $result = resource_mutation_out_complex_setofPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    mutationOutTable: {
      plan($root, args, _info) {
        const selectArgs = makeArgs72(args, ["input"]);
        const $result = resource_mutation_out_tablePgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    mutationOutTableSetof: {
      plan($root, args, _info) {
        const selectArgs = makeArgs73(args, ["input"]);
        const $result = resource_mutation_out_table_setofPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    tableSetMutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs74(args, ["input"]);
        const $result = resource_table_set_mutationPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    createMyTable: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_my_tablePgResource, Object.create(null))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    createPersonSecret: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_person_secretPgResource, Object.create(null))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    createCompoundKey: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_compound_keyPgResource, Object.create(null))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    createNullTestRecord: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_null_test_recordPgResource, Object.create(null))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    createEdgeCase: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(resource_edge_casePgResource, Object.create(null))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    createLeftArm: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_left_armPgResource, Object.create(null))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    createIssue756: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_issue756PgResource, Object.create(null))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    createPerson: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_personPgResource, Object.create(null))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    updateMyTable: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_my_tablePgResource, specFromArgs(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    updateMyTableById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_my_tablePgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    updatePersonSecret: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_person_secretPgResource, specFromArgs2(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    updatePersonSecretByPersonId: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_person_secretPgResource, {
            person_id: args.get(['input', "personId"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    updateCompoundKey: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_compound_keyPgResource, specFromArgs3(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    updateCompoundKeyByPersonId1AndPersonId2: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_compound_keyPgResource, {
            person_id_1: args.get(['input', "personId1"]),
            person_id_2: args.get(['input', "personId2"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    updateNullTestRecord: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_null_test_recordPgResource, specFromArgs4(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    updateNullTestRecordById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_null_test_recordPgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    updateLeftArm: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_left_armPgResource, specFromArgs5(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    updateLeftArmById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_left_armPgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    updateLeftArmByPersonId: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_left_armPgResource, {
            person_id: args.get(['input', "personId"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    updateIssue756: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_issue756PgResource, specFromArgs6(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    updateIssue756ById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_issue756PgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    updatePerson: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_personPgResource, specFromArgs7(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    updatePersonById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_personPgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    updatePersonByEmail: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_personPgResource, {
            email: args.get(['input', "email"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    deleteMyTable: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_my_tablePgResource, specFromArgs8(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    deleteMyTableById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_my_tablePgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    deletePersonSecret: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_person_secretPgResource, specFromArgs9(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    deletePersonSecretByPersonId: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_person_secretPgResource, {
            person_id: args.get(['input', "personId"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    deleteCompoundKey: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_compound_keyPgResource, specFromArgs10(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    deleteCompoundKeyByPersonId1AndPersonId2: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_compound_keyPgResource, {
            person_id_1: args.get(['input', "personId1"]),
            person_id_2: args.get(['input', "personId2"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    deleteNullTestRecord: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_null_test_recordPgResource, specFromArgs11(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    deleteNullTestRecordById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_null_test_recordPgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    deleteLeftArm: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_left_armPgResource, specFromArgs12(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    deleteLeftArmById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_left_armPgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    deleteLeftArmByPersonId: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_left_armPgResource, {
            person_id: args.get(['input', "personId"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    deleteIssue756: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_issue756PgResource, specFromArgs13(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    deleteIssue756ById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_issue756PgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    deletePerson: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_personPgResource, specFromArgs14(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    deletePersonById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_personPgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    deletePersonByEmail: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_personPgResource, {
            email: args.get(['input', "email"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    }
  },
  MutationOutPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      return $object.getStepForKey("clientMutationId", true) ?? constant(undefined);
    },
    o($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  MutationOutInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  MutationOutSetofPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      return $object.getStepForKey("clientMutationId", true) ?? constant(undefined);
    },
    os($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  MutationOutSetofInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  MutationOutUnnamedPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      return $object.getStepForKey("clientMutationId", true) ?? constant(undefined);
    },
    integer($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  MutationOutUnnamedInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  NoArgsMutationPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      return $object.getStepForKey("clientMutationId", true) ?? constant(undefined);
    },
    integer($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  NoArgsMutationInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  MutationInOutPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      return $object.getStepForKey("clientMutationId", true) ?? constant(undefined);
    },
    o($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  MutationInOutInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    i: undefined
  },
  MutationReturnsTableOneColPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      return $object.getStepForKey("clientMutationId", true) ?? constant(undefined);
    },
    col1S($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  MutationReturnsTableOneColInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    i: undefined
  },
  JsonIdentityMutationPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      return $object.getStepForKey("clientMutationId", true) ?? constant(undefined);
    },
    json($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  JsonIdentityMutationInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    json: undefined
  },
  JsonbIdentityMutationPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      return $object.getStepForKey("clientMutationId", true) ?? constant(undefined);
    },
    json($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  JsonbIdentityMutationInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    json: undefined
  },
  JsonbIdentityMutationPlpgsqlPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      return $object.getStepForKey("clientMutationId", true) ?? constant(undefined);
    },
    json($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  JsonbIdentityMutationPlpgsqlInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    _theJson: undefined
  },
  JsonbIdentityMutationPlpgsqlWithDefaultPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      return $object.getStepForKey("clientMutationId", true) ?? constant(undefined);
    },
    json($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  JsonbIdentityMutationPlpgsqlWithDefaultInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    _theJson: undefined
  },
  MutationInInoutPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      return $object.getStepForKey("clientMutationId", true) ?? constant(undefined);
    },
    ino($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  MutationInInoutInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    i: undefined,
    ino: undefined
  },
  MutationOutOutPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      return $object.getStepForKey("clientMutationId", true) ?? constant(undefined);
    },
    result($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  MutationOutOutRecord: {
    __assertStep: assertPgClassSingleStep,
    firstOut($record) {
      return $record.get("first_out");
    },
    secondOut($record) {
      return $record.get("second_out");
    }
  },
  MutationOutOutInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  MutationOutOutSetofPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      return $object.getStepForKey("clientMutationId", true) ?? constant(undefined);
    },
    results($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  MutationOutOutSetofRecord: {
    __assertStep: assertPgClassSingleStep,
    o1($record) {
      return $record.get("o1");
    },
    o2($record) {
      return $record.get("o2");
    }
  },
  MutationOutOutSetofInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  MutationOutOutUnnamedPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      return $object.getStepForKey("clientMutationId", true) ?? constant(undefined);
    },
    result($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  MutationOutOutUnnamedRecord: {
    __assertStep: assertPgClassSingleStep,
    arg1($record) {
      return $record.get("column1");
    },
    arg2($record) {
      return $record.get("column2");
    }
  },
  MutationOutOutUnnamedInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  IntSetMutationPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      return $object.getStepForKey("clientMutationId", true) ?? constant(undefined);
    },
    integers($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  IntSetMutationInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    x: undefined,
    y: undefined,
    z: undefined
  },
  MutationOutUnnamedOutOutUnnamedPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      return $object.getStepForKey("clientMutationId", true) ?? constant(undefined);
    },
    result($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  MutationOutUnnamedOutOutUnnamedRecord: {
    __assertStep: assertPgClassSingleStep,
    arg1($record) {
      return $record.get("column1");
    },
    o2($record) {
      return $record.get("o2");
    },
    arg3($record) {
      return $record.get("column3");
    }
  },
  MutationOutUnnamedOutOutUnnamedInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  MutationReturnsTableMultiColPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      return $object.getStepForKey("clientMutationId", true) ?? constant(undefined);
    },
    results($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  MutationReturnsTableMultiColRecord: {
    __assertStep: assertPgClassSingleStep,
    col1($record) {
      return $record.get("col1");
    },
    col2($record) {
      return $record.get("col2");
    }
  },
  MutationReturnsTableMultiColInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    i: undefined
  },
  LeftArmIdentityPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      return $object.getStepForKey("clientMutationId", true) ?? constant(undefined);
    },
    leftArm($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    leftArmEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = left_armUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_left_armPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("LeftArmsOrderBy"));
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
    personByPersonId($record) {
      return pgResource_personPgResource.get({
        id: $record.get("result").get("person_id")
      });
    }
  },
  LeftArmIdentityInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    leftArm: undefined
  },
  LeftArmBaseInput: {
    "__inputPlan": function LeftArmBaseInput_inputPlan() {
      return object(Object.create(null));
    },
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    personId: {
      applyPlan($insert, val) {
        $insert.set("person_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    lengthInMetres: {
      applyPlan($insert, val) {
        $insert.set("length_in_metres", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    mood: {
      applyPlan($insert, val) {
        $insert.set("mood", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  Issue756MutationPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      return $object.getStepForKey("clientMutationId", true) ?? constant(undefined);
    },
    issue756($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    issue756Edge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = issue756Uniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_issue756PgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("Issue756SOrderBy"));
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
  Issue756MutationInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  Issue756SetMutationPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      return $object.getStepForKey("clientMutationId", true) ?? constant(undefined);
    },
    issue756S($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  Issue756SetMutationInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  TypesMutationPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      return $object.getStepForKey("clientMutationId", true) ?? constant(undefined);
    },
    boolean($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  TypesMutationInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    a: undefined,
    b: undefined,
    c: undefined,
    d: undefined,
    e: undefined,
    f: undefined
  },
  MutationOutOutCompoundTypePayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      return $object.getStepForKey("clientMutationId", true) ?? constant(undefined);
    },
    result($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  MutationOutOutCompoundTypeRecord: {
    __assertStep: assertPgClassSingleStep,
    o1($record) {
      return $record.get("o1");
    },
    o2($record) {
      const $plan = $record.get("o2");
      const $select = pgSelectSingleFromRecord(resource_frmcdc_compoundTypePgResource, $plan);
      if (undefined) {
        $select.coalesceToEmptyObject();
      }
      $select.getClassStep().setTrusted();
      return $select;
    }
  },
  MutationOutOutCompoundTypeInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    i1: undefined
  },
  TableMutationPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      return $object.getStepForKey("clientMutationId", true) ?? constant(undefined);
    },
    post($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  TableMutationInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    id: undefined
  },
  MutationOutComplexPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      return $object.getStepForKey("clientMutationId", true) ?? constant(undefined);
    },
    result($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  MutationOutComplexRecord: {
    __assertStep: assertPgClassSingleStep,
    x($record) {
      return $record.get("x");
    },
    y($record) {
      const $plan = $record.get("y");
      const $select = pgSelectSingleFromRecord(resource_frmcdc_compoundTypePgResource, $plan);
      if (undefined) {
        $select.coalesceToEmptyObject();
      }
      $select.getClassStep().setTrusted();
      return $select;
    },
    z($record) {
      const $plan = $record.get("z");
      const $select = pgSelectSingleFromRecord(pgResource_personPgResource, $plan);
      if (undefined) {
        $select.coalesceToEmptyObject();
      }
      $select.getClassStep().setTrusted();
      return $select;
    }
  },
  MutationOutComplexInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    a: undefined,
    b: undefined
  },
  MutationOutComplexSetofPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      return $object.getStepForKey("clientMutationId", true) ?? constant(undefined);
    },
    results($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  MutationOutComplexSetofRecord: {
    __assertStep: assertPgClassSingleStep,
    x($record) {
      return $record.get("x");
    },
    y($record) {
      const $plan = $record.get("y");
      const $select = pgSelectSingleFromRecord(resource_frmcdc_compoundTypePgResource, $plan);
      if (undefined) {
        $select.coalesceToEmptyObject();
      }
      $select.getClassStep().setTrusted();
      return $select;
    },
    z($record) {
      const $plan = $record.get("z");
      const $select = pgSelectSingleFromRecord(pgResource_personPgResource, $plan);
      if (undefined) {
        $select.coalesceToEmptyObject();
      }
      $select.getClassStep().setTrusted();
      return $select;
    }
  },
  MutationOutComplexSetofInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    a: undefined,
    b: undefined
  },
  MutationOutTablePayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      return $object.getStepForKey("clientMutationId", true) ?? constant(undefined);
    },
    person($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    personEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = personUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_personPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("PeopleOrderBy"));
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
  MutationOutTableInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  MutationOutTableSetofPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      return $object.getStepForKey("clientMutationId", true) ?? constant(undefined);
    },
    people($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  MutationOutTableSetofInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  TableSetMutationPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      return $object.getStepForKey("clientMutationId", true) ?? constant(undefined);
    },
    people($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  TableSetMutationInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreateMyTablePayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    myTable($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    myTableEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = my_tableUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_my_tablePgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("MyTablesOrderBy"));
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
  CreateMyTableInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    myTable: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  MyTableInput: {
    "__inputPlan": function MyTableInput_inputPlan() {
      return object(Object.create(null));
    },
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    jsonData: {
      applyPlan($insert, val) {
        $insert.set("json_data", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreatePersonSecretPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    personSecret($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    personSecretEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = person_secretUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_person_secretPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("PersonSecretsOrderBy"));
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
    personBySecret($record) {
      return pgResource_personPgResource.get({
        about: $record.get("result").get("sekrit")
      });
    },
    personByPersonId($record) {
      return pgResource_personPgResource.get({
        id: $record.get("result").get("person_id")
      });
    }
  },
  CreatePersonSecretInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    personSecret: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  PersonSecretInput: {
    "__inputPlan": function PersonSecretInput_inputPlan() {
      return object(Object.create(null));
    },
    personId: {
      applyPlan($insert, val) {
        $insert.set("person_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    secret: {
      applyPlan($insert, val) {
        $insert.set("sekrit", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreateCompoundKeyPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    compoundKey($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    compoundKeyEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = compound_keyUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_compound_keyPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("CompoundKeysOrderBy"));
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
    personByPersonId1($record) {
      return pgResource_personPgResource.get({
        id: $record.get("result").get("person_id_1")
      });
    },
    personByPersonId2($record) {
      return pgResource_personPgResource.get({
        id: $record.get("result").get("person_id_2")
      });
    }
  },
  CreateCompoundKeyInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    compoundKey: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  CompoundKeyInput: {
    "__inputPlan": function CompoundKeyInput_inputPlan() {
      return object(Object.create(null));
    },
    personId2: {
      applyPlan($insert, val) {
        $insert.set("person_id_2", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    personId1: {
      applyPlan($insert, val) {
        $insert.set("person_id_1", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    extra: {
      applyPlan($insert, val) {
        $insert.set("extra", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreateNullTestRecordPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    nullTestRecord($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    nullTestRecordEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = null_test_recordUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_null_test_recordPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("NullTestRecordsOrderBy"));
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
  CreateNullTestRecordInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    nullTestRecord: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  NullTestRecordInput: {
    "__inputPlan": function NullTestRecordInput_inputPlan() {
      return object(Object.create(null));
    },
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    nullableText: {
      applyPlan($insert, val) {
        $insert.set("nullable_text", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    nullableInt: {
      applyPlan($insert, val) {
        $insert.set("nullable_int", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    nonNullText: {
      applyPlan($insert, val) {
        $insert.set("non_null_text", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreateEdgeCasePayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    edgeCase($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  CreateEdgeCaseInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    edgeCase: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  EdgeCaseInput: {
    "__inputPlan": function EdgeCaseInput_inputPlan() {
      return object(Object.create(null));
    },
    notNullHasDefault: {
      applyPlan($insert, val) {
        $insert.set("not_null_has_default", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    wontCastEasy: {
      applyPlan($insert, val) {
        $insert.set("wont_cast_easy", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    rowId: {
      applyPlan($insert, val) {
        $insert.set("row_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreateLeftArmPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    leftArm($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    leftArmEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = left_armUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_left_armPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("LeftArmsOrderBy"));
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
    personByPersonId($record) {
      return pgResource_personPgResource.get({
        id: $record.get("result").get("person_id")
      });
    }
  },
  CreateLeftArmInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    leftArm: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  LeftArmInput: {
    "__inputPlan": function LeftArmInput_inputPlan() {
      return object(Object.create(null));
    },
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    personId: {
      applyPlan($insert, val) {
        $insert.set("person_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    lengthInMetres: {
      applyPlan($insert, val) {
        $insert.set("length_in_metres", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    mood: {
      applyPlan($insert, val) {
        $insert.set("mood", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreateIssue756Payload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    issue756($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    issue756Edge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = issue756Uniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_issue756PgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("Issue756SOrderBy"));
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
  CreateIssue756Input: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    issue756: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  Issue756Input: {
    "__inputPlan": function Issue756Input_inputPlan() {
      return object(Object.create(null));
    },
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    ts: {
      applyPlan($insert, val) {
        $insert.set("ts", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreatePersonPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    person($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    personEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = personUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_personPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("PeopleOrderBy"));
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
  CreatePersonInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    person: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  PersonInput: {
    "__inputPlan": function PersonInput_inputPlan() {
      return object(Object.create(null));
    },
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    name: {
      applyPlan($insert, val) {
        $insert.set("person_full_name", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    aliases: {
      applyPlan($insert, val) {
        $insert.set("aliases", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    about: {
      applyPlan($insert, val) {
        $insert.set("about", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    email: {
      applyPlan($insert, val) {
        $insert.set("email", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    site: {
      applyPlan($insert, val) {
        $insert.set("site", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    config: {
      applyPlan($insert, val) {
        $insert.set("config", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    lastLoginFromIp: {
      applyPlan($insert, val) {
        $insert.set("last_login_from_ip", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    lastLoginFromSubnet: {
      applyPlan($insert, val) {
        $insert.set("last_login_from_subnet", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    userMac: {
      applyPlan($insert, val) {
        $insert.set("user_mac", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    createdAt: {
      applyPlan($insert, val) {
        $insert.set("created_at", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateMyTablePayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    myTable($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    myTableEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = my_tableUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_my_tablePgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("MyTablesOrderBy"));
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
  UpdateMyTableInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined,
    myTablePatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  MyTablePatch: {
    "__inputPlan": function MyTablePatch_inputPlan() {
      return object(Object.create(null));
    },
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    jsonData: {
      applyPlan($insert, val) {
        $insert.set("json_data", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateMyTableByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined,
    myTablePatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  UpdatePersonSecretPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    personSecret($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    personSecretEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = person_secretUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_person_secretPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("PersonSecretsOrderBy"));
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
    personBySecret($record) {
      return pgResource_personPgResource.get({
        about: $record.get("result").get("sekrit")
      });
    },
    personByPersonId($record) {
      return pgResource_personPgResource.get({
        id: $record.get("result").get("person_id")
      });
    }
  },
  UpdatePersonSecretInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined,
    personSecretPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  PersonSecretPatch: {
    "__inputPlan": function PersonSecretPatch_inputPlan() {
      return object(Object.create(null));
    },
    personId: {
      applyPlan($insert, val) {
        $insert.set("person_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    secret: {
      applyPlan($insert, val) {
        $insert.set("sekrit", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdatePersonSecretByPersonIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    personId: undefined,
    personSecretPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  UpdateCompoundKeyPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    compoundKey($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    compoundKeyEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = compound_keyUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_compound_keyPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("CompoundKeysOrderBy"));
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
    personByPersonId1($record) {
      return pgResource_personPgResource.get({
        id: $record.get("result").get("person_id_1")
      });
    },
    personByPersonId2($record) {
      return pgResource_personPgResource.get({
        id: $record.get("result").get("person_id_2")
      });
    }
  },
  UpdateCompoundKeyInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined,
    compoundKeyPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  CompoundKeyPatch: {
    "__inputPlan": function CompoundKeyPatch_inputPlan() {
      return object(Object.create(null));
    },
    personId2: {
      applyPlan($insert, val) {
        $insert.set("person_id_2", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    personId1: {
      applyPlan($insert, val) {
        $insert.set("person_id_1", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    extra: {
      applyPlan($insert, val) {
        $insert.set("extra", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateCompoundKeyByPersonId1AndPersonId2Input: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    personId1: undefined,
    personId2: undefined,
    compoundKeyPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  UpdateNullTestRecordPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    nullTestRecord($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    nullTestRecordEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = null_test_recordUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_null_test_recordPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("NullTestRecordsOrderBy"));
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
  UpdateNullTestRecordInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined,
    nullTestRecordPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  NullTestRecordPatch: {
    "__inputPlan": function NullTestRecordPatch_inputPlan() {
      return object(Object.create(null));
    },
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    nullableText: {
      applyPlan($insert, val) {
        $insert.set("nullable_text", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    nullableInt: {
      applyPlan($insert, val) {
        $insert.set("nullable_int", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    nonNullText: {
      applyPlan($insert, val) {
        $insert.set("non_null_text", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateNullTestRecordByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined,
    nullTestRecordPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  UpdateLeftArmPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    leftArm($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    leftArmEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = left_armUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_left_armPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("LeftArmsOrderBy"));
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
    personByPersonId($record) {
      return pgResource_personPgResource.get({
        id: $record.get("result").get("person_id")
      });
    }
  },
  UpdateLeftArmInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined,
    leftArmPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  LeftArmPatch: {
    "__inputPlan": function LeftArmPatch_inputPlan() {
      return object(Object.create(null));
    },
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    personId: {
      applyPlan($insert, val) {
        $insert.set("person_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    lengthInMetres: {
      applyPlan($insert, val) {
        $insert.set("length_in_metres", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    mood: {
      applyPlan($insert, val) {
        $insert.set("mood", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateLeftArmByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined,
    leftArmPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  UpdateLeftArmByPersonIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    personId: undefined,
    leftArmPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  UpdateIssue756Payload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    issue756($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    issue756Edge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = issue756Uniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_issue756PgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("Issue756SOrderBy"));
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
  UpdateIssue756Input: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined,
    issue756Patch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  Issue756Patch: {
    "__inputPlan": function Issue756Patch_inputPlan() {
      return object(Object.create(null));
    },
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    ts: {
      applyPlan($insert, val) {
        $insert.set("ts", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateIssue756ByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined,
    issue756Patch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  UpdatePersonPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    person($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    personEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = personUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_personPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("PeopleOrderBy"));
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
  UpdatePersonInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined,
    personPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  PersonPatch: {
    "__inputPlan": function PersonPatch_inputPlan() {
      return object(Object.create(null));
    },
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    name: {
      applyPlan($insert, val) {
        $insert.set("person_full_name", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    aliases: {
      applyPlan($insert, val) {
        $insert.set("aliases", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    about: {
      applyPlan($insert, val) {
        $insert.set("about", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    email: {
      applyPlan($insert, val) {
        $insert.set("email", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    site: {
      applyPlan($insert, val) {
        $insert.set("site", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    config: {
      applyPlan($insert, val) {
        $insert.set("config", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    lastLoginFromIp: {
      applyPlan($insert, val) {
        $insert.set("last_login_from_ip", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    lastLoginFromSubnet: {
      applyPlan($insert, val) {
        $insert.set("last_login_from_subnet", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    userMac: {
      applyPlan($insert, val) {
        $insert.set("user_mac", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    createdAt: {
      applyPlan($insert, val) {
        $insert.set("created_at", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdatePersonByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined,
    personPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  UpdatePersonByEmailInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    email: undefined,
    personPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  DeleteMyTablePayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    myTable($object) {
      return $object.get("result");
    },
    deletedMyTableId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.MyTable.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    myTableEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = my_tableUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_my_tablePgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("MyTablesOrderBy"));
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
  DeleteMyTableInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined
  },
  DeleteMyTableByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined
  },
  DeletePersonSecretPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    personSecret($object) {
      return $object.get("result");
    },
    deletedPersonSecretId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.PersonSecret.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    personSecretEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = person_secretUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_person_secretPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("PersonSecretsOrderBy"));
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
    personBySecret($record) {
      return pgResource_personPgResource.get({
        about: $record.get("result").get("sekrit")
      });
    },
    personByPersonId($record) {
      return pgResource_personPgResource.get({
        id: $record.get("result").get("person_id")
      });
    }
  },
  DeletePersonSecretInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined
  },
  DeletePersonSecretByPersonIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    personId: undefined
  },
  DeleteCompoundKeyPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    compoundKey($object) {
      return $object.get("result");
    },
    deletedCompoundKeyId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.CompoundKey.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    compoundKeyEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = compound_keyUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_compound_keyPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("CompoundKeysOrderBy"));
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
    personByPersonId1($record) {
      return pgResource_personPgResource.get({
        id: $record.get("result").get("person_id_1")
      });
    },
    personByPersonId2($record) {
      return pgResource_personPgResource.get({
        id: $record.get("result").get("person_id_2")
      });
    }
  },
  DeleteCompoundKeyInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined
  },
  DeleteCompoundKeyByPersonId1AndPersonId2Input: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    personId1: undefined,
    personId2: undefined
  },
  DeleteNullTestRecordPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    nullTestRecord($object) {
      return $object.get("result");
    },
    deletedNullTestRecordId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.NullTestRecord.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    nullTestRecordEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = null_test_recordUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_null_test_recordPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("NullTestRecordsOrderBy"));
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
  DeleteNullTestRecordInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined
  },
  DeleteNullTestRecordByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined
  },
  DeleteLeftArmPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    leftArm($object) {
      return $object.get("result");
    },
    deletedLeftArmId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.LeftArm.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    leftArmEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = left_armUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_left_armPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("LeftArmsOrderBy"));
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
    personByPersonId($record) {
      return pgResource_personPgResource.get({
        id: $record.get("result").get("person_id")
      });
    }
  },
  DeleteLeftArmInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined
  },
  DeleteLeftArmByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined
  },
  DeleteLeftArmByPersonIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    personId: undefined
  },
  DeleteIssue756Payload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    issue756($object) {
      return $object.get("result");
    },
    deletedIssue756Id($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.Issue756.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    issue756Edge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = issue756Uniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_issue756PgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("Issue756SOrderBy"));
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
  DeleteIssue756Input: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined
  },
  DeleteIssue756ByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined
  },
  DeletePersonPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    person($object) {
      return $object.get("result");
    },
    deletedPersonId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.Person.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    personEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = personUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_personPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("PeopleOrderBy"));
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
  DeletePersonInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined
  },
  DeletePersonByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined
  },
  DeletePersonByEmailInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    email: undefined
  }
};
export const schema = makeGrafastSchema({
  typeDefs: typeDefs,
  plans: plans
});
