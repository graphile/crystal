import { PgDeleteSingleStep, PgExecutor, PgResource, PgSelectSingleStep, PgSelectStep, TYPES, assertPgClassSingleStep, domainOfCodec, enumCodec, listOfCodec, makeRegistry, pgClassExpression, pgDeleteSingle, pgFromExpression, pgInsertSingle, pgSelectFromRecord, pgSelectFromRecords, pgSelectSingleFromRecord, pgUpdateSingle, rangeOfCodec, recordCodec, sqlFromArgDigests, sqlValueWithCodec } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ObjectStep, __ValueStep, access, assertEdgeCapableStep, assertExecutableStep, assertPageInfoCapableStep, bakedInput, bakedInputRuntime, connection, constant, context, createObjectAndApplyChildren, first, get as get2, inhibitOnNull, inspect, lambda, list, makeDecodeNodeId, makeGrafastSchema, object, operationPlan, rootValue, specFromNodeId, stepAMayDependOnStepB, trap } from "grafast";
import { GraphQLError, GraphQLInt, GraphQLString, Kind, valueFromASTUntyped } from "graphql";
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
  raw: nodeIdHandler_Query.codec,
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
const registryConfig_pgCodecs_FuncOutOutRecord_FuncOutOutRecord = recordCodec({
  name: "FuncOutOutRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: {
    __proto__: null,
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
  },
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
  attributes: {
    __proto__: null,
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
  },
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
  attributes: {
    __proto__: null,
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
  },
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
  attributes: {
    __proto__: null,
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
  },
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
  attributes: {
    __proto__: null,
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
  },
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
  attributes: {
    __proto__: null,
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
  },
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
  attributes: {
    __proto__: null,
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
  },
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
  attributes: {
    __proto__: null,
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
  },
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
  attributes: {
    __proto__: null,
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
  },
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
  attributes: {
    __proto__: null,
    col1: {
      notNull: false,
      codec: TYPES.int,
      extensions: {
        argIndex: 3,
        argName: "col1"
      }
    },
    col2: {
      notNull: false,
      codec: TYPES.text,
      extensions: {
        argIndex: 4,
        argName: "col2"
      }
    }
  },
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
  attributes: {
    __proto__: null,
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
  },
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
const myTableCodec = recordCodec({
  name: "myTable",
  identifier: myTableIdentifier,
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
    json_data: {
      description: undefined,
      codec: TYPES.jsonb,
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
      schemaName: "c",
      name: "my_table"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const personSecretIdentifier = sql.identifier("c", "person_secret");
const personSecretCodec = recordCodec({
  name: "personSecret",
  identifier: personSecretIdentifier,
  attributes: {
    __proto__: null,
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
  },
  description: "Tracks the person's secret",
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "person_secret"
    },
    tags: {
      __proto__: null,
      deprecated: "This is deprecated (comment on table c.person_secret)."
    }
  },
  executor: executor
});
const unloggedIdentifier = sql.identifier("c", "unlogged");
const unloggedCodec = recordCodec({
  name: "unlogged",
  identifier: unloggedIdentifier,
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
    nonsense: {
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
      schemaName: "c",
      name: "unlogged",
      persistence: "u"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const compoundKeyIdentifier = sql.identifier("c", "compound_key");
const compoundKeyCodec = recordCodec({
  name: "compoundKey",
  identifier: compoundKeyIdentifier,
  attributes: {
    __proto__: null,
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
  },
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "compound_key"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const nullTestRecordIdentifier = sql.identifier("c", "null_test_record");
const nullTestRecordCodec = recordCodec({
  name: "nullTestRecord",
  identifier: nullTestRecordIdentifier,
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
  },
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "null_test_record"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const edgeCaseIdentifier = sql.identifier("c", "edge_case");
const edgeCaseCodec = recordCodec({
  name: "edgeCase",
  identifier: edgeCaseIdentifier,
  attributes: {
    __proto__: null,
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
  },
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "edge_case"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const leftArmIdentifier = sql.identifier("c", "left_arm");
const leftArmCodec = recordCodec({
  name: "leftArm",
  identifier: leftArmIdentifier,
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
  },
  description: "Tracks metadata about the left arms of various people",
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "left_arm"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const issue756Identifier = sql.identifier("c", "issue756");
const notNullTimestampCodec = domainOfCodec(TYPES.timestamptz, "notNullTimestamp", sql.identifier("c", "not_null_timestamp"), {
  description: undefined,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "not_null_timestamp"
    },
    tags: {
      __proto__: null
    }
  },
  notNull: true
});
const issue756Codec = recordCodec({
  name: "issue756",
  identifier: issue756Identifier,
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
    ts: {
      description: undefined,
      codec: notNullTimestampCodec,
      notNull: true,
      hasDefault: true,
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
      schemaName: "c",
      name: "issue756"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const compoundTypeIdentifier = sql.identifier("c", "compound_type");
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
  identifier: compoundTypeIdentifier,
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
const registryConfig_pgCodecs_FuncOutOutCompoundTypeRecord_FuncOutOutCompoundTypeRecord = recordCodec({
  name: "FuncOutOutCompoundTypeRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: {
    __proto__: null,
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
  },
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
  attributes: {
    __proto__: null,
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
  },
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
    tags: {
      __proto__: null
    }
  }
});
const anEnumArrayCodec = listOfCodec(anEnumCodec, {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "_an_enum"
    },
    tags: {
      __proto__: null
    }
  },
  typeDelim: ",",
  description: undefined,
  name: "anEnumArray"
});
const comptypeCodec = recordCodec({
  name: "comptype",
  identifier: sql.identifier("a", "comptype"),
  attributes: {
    __proto__: null,
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
  },
  description: undefined,
  extensions: {
    isTableLike: false,
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "comptype"
    },
    tags: {
      __proto__: null
    }
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
    tags: {
      __proto__: null
    }
  },
  typeDelim: ",",
  description: undefined,
  name: "comptypeArray"
});
const postCodec = recordCodec({
  name: "post",
  identifier: sql.identifier("a", "post"),
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
  },
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "post"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const registryConfig_pgCodecs_QueryOutputTwoRowsRecord_QueryOutputTwoRowsRecord = recordCodec({
  name: "QueryOutputTwoRowsRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: {
    __proto__: null,
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
  },
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
  attributes: {
    __proto__: null,
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
  },
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
  attributes: {
    __proto__: null,
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
  },
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
    tags: {
      __proto__: null
    }
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
    tags: {
      __proto__: null
    }
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
    tags: {
      __proto__: null
    }
  },
  notNull: true
});
const wrappedUrlCodec = recordCodec({
  name: "wrappedUrl",
  identifier: sql.identifier("b", "wrapped_url"),
  attributes: {
    __proto__: null,
    url: {
      description: undefined,
      codec: notNullUrlCodec,
      notNull: true,
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
      schemaName: "b",
      name: "wrapped_url"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const personCodec = recordCodec({
  name: "person",
  identifier: personIdentifier,
  attributes: {
    __proto__: null,
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
  },
  description: "Person test comment",
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "person"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const registryConfig_pgCodecs_PersonComputedFirstArgInoutOutRecord_PersonComputedFirstArgInoutOutRecord = recordCodec({
  name: "PersonComputedFirstArgInoutOutRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: {
    __proto__: null,
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
  },
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
  attributes: {
    __proto__: null,
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
  },
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
  attributes: {
    __proto__: null,
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
  },
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
  attributes: {
    __proto__: null,
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
  },
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
  attributes: {
    __proto__: null,
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
  },
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
  attributes: {
    __proto__: null,
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
  },
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
    tags: {
      __proto__: null
    }
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
    tags: {
      __proto__: null
    }
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
    tags: {
      __proto__: null
    }
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
    tags: {
      __proto__: null
    }
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
    tags: {
      __proto__: null
    }
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
    tags: {
      __proto__: null
    }
  }
});
const intervalArrayCodec = listOfCodec(TYPES.interval, {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "pg_catalog",
      name: "_interval"
    },
    tags: {
      __proto__: null
    }
  },
  typeDelim: ",",
  description: undefined,
  name: "intervalArray"
});
const nestedCompoundTypeCodec = recordCodec({
  name: "nestedCompoundType",
  identifier: sql.identifier("b", "nested_compound_type"),
  attributes: {
    __proto__: null,
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
  },
  description: undefined,
  extensions: {
    isTableLike: false,
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "nested_compound_type"
    },
    tags: {
      __proto__: null
    }
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
    tags: {
      __proto__: null
    }
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
    tags: {
      __proto__: null
    }
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
    tags: {
      __proto__: null
    }
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
    tags: {
      __proto__: null
    }
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
  },
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "types"
    },
    tags: {
      __proto__: null,
      foreignKey: ["(smallint) references a.post", "(id) references a.post"]
    }
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
    tags: {
      __proto__: null
    }
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
    tags: {
      __proto__: null
    }
  }
});
const compoundTypeArrayCodec = listOfCodec(compoundTypeCodec, {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "_compound_type"
    },
    tags: {
      __proto__: null
    }
  },
  typeDelim: ",",
  description: undefined,
  name: "compoundTypeArray"
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
const int_set_mutationFunctionIdentifer = sql.identifier("c", "int_set_mutation");
const int_set_queryFunctionIdentifer = sql.identifier("c", "int_set_query");
const mutation_out_unnamed_out_out_unnamedFunctionIdentifer = sql.identifier("c", "mutation_out_unnamed_out_out_unnamed");
const mutation_returns_table_multi_colFunctionIdentifer = sql.identifier("c", "mutation_returns_table_multi_col");
const func_returns_table_multi_colFunctionIdentifer = sql.identifier("c", "func_returns_table_multi_col");
const search_test_summariesFunctionIdentifer = sql.identifier("c", "search_test_summaries");
const my_tableUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const person_secretUniques = [{
  isPrimary: true,
  attributes: ["person_id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
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
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {
      deprecated: "This is deprecated (comment on table c.person_secret)."
    }
  }
};
const compound_keyUniques = [{
  isPrimary: true,
  attributes: ["person_id_1", "person_id_2"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
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
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {}
  }
};
const null_test_recordUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const edge_case_computedFunctionIdentifer = sql.identifier("c", "edge_case_computed");
const return_table_without_grantsFunctionIdentifer = sql.identifier("c", "return_table_without_grants");
const left_armUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}, {
  isPrimary: false,
  attributes: ["person_id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
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
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {}
  }
};
const left_arm_identityFunctionIdentifer = sql.identifier("c", "left_arm_identity");
const issue756Uniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
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
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
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
const resourceConfig_compound_type = {
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
    isInsertable: false,
    isUpdatable: false,
    isDeletable: false,
    tags: {}
  }
};
const table_mutationFunctionIdentifer = sql.identifier("c", "table_mutation");
const table_queryFunctionIdentifer = sql.identifier("c", "table_query");
const list_of_compound_types_mutationFunctionIdentifer = sql.identifier("c", "list_of_compound_types_mutation");
const person_computed_outFunctionIdentifer = sql.identifier("c", "person_computed_out");
const person_first_nameFunctionIdentifer = sql.identifier("c", "person_first_name");
const person_computed_out_outFunctionIdentifer = sql.identifier("c", "person_computed_out_out");
const person_computed_inoutFunctionIdentifer = sql.identifier("c", "person_computed_inout");
const person_computed_inout_outFunctionIdentifer = sql.identifier("c", "person_computed_inout_out");
const person_existsFunctionIdentifer = sql.identifier("c", "person_exists");
const person_computed_first_arg_inout_outFunctionIdentifer = sql.identifier("c", "person_computed_first_arg_inout_out");
const person_optional_missing_middle_1FunctionIdentifer = sql.identifier("c", "person_optional_missing_middle_1");
const person_optional_missing_middle_2FunctionIdentifer = sql.identifier("c", "person_optional_missing_middle_2");
const person_optional_missing_middle_3FunctionIdentifer = sql.identifier("c", "person_optional_missing_middle_3");
const person_optional_missing_middle_4FunctionIdentifer = sql.identifier("c", "person_optional_missing_middle_4");
const person_optional_missing_middle_5FunctionIdentifer = sql.identifier("c", "person_optional_missing_middle_5");
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
    tags: {
      __proto__: null
    }
  }
}, {
  isPrimary: false,
  attributes: ["email"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
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
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
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
  pgExecutors: {
    __proto__: null,
    main: executor
  },
  pgCodecs: {
    __proto__: null,
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
    MutationOutUnnamedOutOutUnnamedRecord: registryConfig_pgCodecs_MutationOutUnnamedOutOutUnnamedRecord_MutationOutUnnamedOutOutUnnamedRecord,
    MutationReturnsTableMultiColRecord: registryConfig_pgCodecs_MutationReturnsTableMultiColRecord_MutationReturnsTableMultiColRecord,
    FuncReturnsTableMultiColRecord: registryConfig_pgCodecs_FuncReturnsTableMultiColRecord_FuncReturnsTableMultiColRecord,
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
        tags: {
          __proto__: null
        }
      },
      typeDelim: ",",
      description: undefined,
      name: "typesArray"
    }),
    int4Array: int4ArrayCodec,
    floatrange: floatrangeCodec,
    compoundTypeArray: compoundTypeArrayCodec,
    int8Array: int8ArrayCodec
  },
  pgResources: {
    __proto__: null,
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "current_user_id"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_out"
        },
        tags: {},
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
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_out_setof"
        },
        tags: {},
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_out_unnamed"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_out"
        },
        tags: {},
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
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_out_setof"
        },
        tags: {},
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_out_unnamed"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "no_args_mutation"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "no_args_query"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_in_out"
        },
        tags: {},
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
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_returns_table_one_col"
        },
        tags: {},
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_in_out"
        },
        tags: {},
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
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_returns_table_one_col"
        },
        tags: {},
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "json_identity"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "json_identity_mutation"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "jsonb_identity"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "jsonb_identity_mutation"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "jsonb_identity_mutation_plpgsql"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "jsonb_identity_mutation_plpgsql_with_default"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_in_inout"
        },
        tags: {},
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_out_out"
        },
        tags: {}
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
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_out_out_setof"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_out_out_unnamed"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_in_inout"
        },
        tags: {},
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_out_out"
        },
        tags: {}
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
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_out_out_setof"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_out_out_unnamed"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_out_unnamed_out_out_unnamed"
        },
        tags: {}
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
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "int_set_mutation"
        },
        tags: {}
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
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "int_set_query"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_out_unnamed_out_out_unnamed"
        },
        tags: {}
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
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_returns_table_multi_col"
        },
        tags: {}
      },
      description: undefined
    },
    func_returns_table_multi_col: {
      executor,
      name: "func_returns_table_multi_col",
      identifier: "main.c.func_returns_table_multi_col(int4,int4,int4,int4,text)",
      from(...args) {
        return sql`${func_returns_table_multi_colFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "i",
        required: true,
        notNull: false,
        codec: TYPES.int
      }, {
        name: "a",
        required: false,
        notNull: false,
        codec: TYPES.int
      }, {
        name: "b",
        required: false,
        notNull: false,
        codec: TYPES.int
      }],
      isUnique: !true,
      codec: registryConfig_pgCodecs_FuncReturnsTableMultiColRecord_FuncReturnsTableMultiColRecord,
      uniques: [],
      isMutation: false,
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_returns_table_multi_col"
        },
        tags: {}
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
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "search_test_summaries"
        },
        tags: {
          simpleCollections: "only",
          behavior: ["+list -connection"]
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
        isInsertable: true,
        isUpdatable: true,
        isDeletable: true,
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
          tags: {
            __proto__: null
          }
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
        isInsertable: true,
        isUpdatable: true,
        isDeletable: true,
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
        isInsertable: true,
        isUpdatable: true,
        isDeletable: true,
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "edge_case_computed"
        },
        tags: {
          sortable: true,
          behavior: ["orderBy order resource:connection:backwards"]
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "return_table_without_grants"
        },
        tags: {}
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
        isInsertable: true,
        isUpdatable: true,
        isDeletable: true,
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "left_arm_identity"
        },
        tags: {
          arg0variant: "base",
          resultFieldName: "leftArm"
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "issue756_mutation"
        },
        tags: {}
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
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "issue756_set_mutation"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "types_mutation"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "types_query"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "compound_type_computed_field"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_out_out_compound_type"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_out_out_compound_type"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "query_output_two_rows"
        },
        tags: {}
      },
      description: undefined
    },
    compound_type_set_query: PgResource.functionResourceOptions(resourceConfig_compound_type, {
      name: "compound_type_set_query",
      identifier: "main.c.compound_type_set_query()",
      from(...args) {
        return sql`${compound_type_set_queryFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsArray: false,
      returnsSetof: true,
      isMutation: false,
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "compound_type_set_query"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "table_mutation"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "table_query"
        },
        tags: {}
      },
      description: undefined
    }),
    list_of_compound_types_mutation: PgResource.functionResourceOptions(resourceConfig_compound_type, {
      name: "list_of_compound_types_mutation",
      identifier: "main.c.list_of_compound_types_mutation(c._compound_type)",
      from(...args) {
        return sql`${list_of_compound_types_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "records",
        required: true,
        notNull: false,
        codec: compoundTypeArrayCodec
      }],
      returnsArray: false,
      returnsSetof: true,
      isMutation: true,
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "list_of_compound_types_mutation"
        },
        tags: {}
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
      hasImplicitOrder: false,
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
          behavior: ["filter filterBy", "orderBy order resource:connection:backwards"]
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_first_name"
        },
        tags: {
          sortable: true,
          behavior: ["orderBy order resource:connection:backwards"]
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_computed_out_out"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_computed_inout"
        },
        tags: {},
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_computed_inout_out"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_exists"
        },
        tags: {
          deprecated: "This is deprecated (comment on function c.person_exists)."
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_computed_first_arg_inout_out"
        },
        tags: {}
      },
      description: undefined
    },
    person_optional_missing_middle_1: {
      executor,
      name: "person_optional_missing_middle_1",
      identifier: "main.c.person_optional_missing_middle_1(c.person,int4,int4,int4)",
      from(...args) {
        return sql`${person_optional_missing_middle_1FunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "p",
        required: true,
        notNull: true,
        codec: personCodec
      }, {
        name: "",
        required: true,
        notNull: true,
        codec: TYPES.int
      }, {
        name: "b",
        required: false,
        notNull: true,
        codec: TYPES.int
      }, {
        name: "c",
        required: false,
        notNull: true,
        codec: TYPES.int
      }],
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: false,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_optional_missing_middle_1"
        },
        tags: {}
      },
      description: undefined
    },
    person_optional_missing_middle_2: {
      executor,
      name: "person_optional_missing_middle_2",
      identifier: "main.c.person_optional_missing_middle_2(c.person,int4,int4,int4)",
      from(...args) {
        return sql`${person_optional_missing_middle_2FunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "p",
        required: true,
        notNull: true,
        codec: personCodec
      }, {
        name: "a",
        required: true,
        notNull: true,
        codec: TYPES.int
      }, {
        name: "b",
        required: false,
        notNull: true,
        codec: TYPES.int
      }, {
        name: "c",
        required: false,
        notNull: true,
        codec: TYPES.int
      }],
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: false,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_optional_missing_middle_2"
        },
        tags: {}
      },
      description: undefined
    },
    person_optional_missing_middle_3: {
      executor,
      name: "person_optional_missing_middle_3",
      identifier: "main.c.person_optional_missing_middle_3(c.person,int4,int4,int4)",
      from(...args) {
        return sql`${person_optional_missing_middle_3FunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "p",
        required: true,
        notNull: true,
        codec: personCodec
      }, {
        name: "a",
        required: true,
        notNull: true,
        codec: TYPES.int
      }, {
        name: "",
        required: false,
        notNull: true,
        codec: TYPES.int
      }, {
        name: "c",
        required: false,
        notNull: true,
        codec: TYPES.int
      }],
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: false,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_optional_missing_middle_3"
        },
        tags: {}
      },
      description: undefined
    },
    person_optional_missing_middle_4: {
      executor,
      name: "person_optional_missing_middle_4",
      identifier: "main.c.person_optional_missing_middle_4(c.person,int4,int4,int4)",
      from(...args) {
        return sql`${person_optional_missing_middle_4FunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "p",
        required: true,
        notNull: true,
        codec: personCodec
      }, {
        name: "",
        required: true,
        notNull: true,
        codec: TYPES.int
      }, {
        name: "b",
        required: false,
        notNull: true,
        codec: TYPES.int
      }, {
        name: "",
        required: false,
        notNull: true,
        codec: TYPES.int
      }],
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: false,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_optional_missing_middle_4"
        },
        tags: {}
      },
      description: undefined
    },
    person_optional_missing_middle_5: {
      executor,
      name: "person_optional_missing_middle_5",
      identifier: "main.c.person_optional_missing_middle_5(c.person,int4,int4,int4)",
      from(...args) {
        return sql`${person_optional_missing_middle_5FunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "p",
        required: true,
        notNull: true,
        codec: personCodec
      }, {
        name: "a",
        required: true,
        notNull: true,
        codec: TYPES.int
      }, {
        name: "",
        required: false,
        notNull: true,
        codec: TYPES.int
      }, {
        name: "",
        required: false,
        notNull: true,
        codec: TYPES.int
      }],
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: false,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_optional_missing_middle_5"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_out_complex"
        },
        tags: {}
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
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_out_complex_setof"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_out_complex"
        },
        tags: {}
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
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_out_complex_setof"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_computed_complex"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_first_post"
        },
        tags: {}
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
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "badly_behaved_function"
        },
        tags: {
          deprecated: "This is deprecated (comment on function c.badly_behaved_function)."
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_out_table"
        },
        tags: {}
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
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_out_table_setof"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_out_table"
        },
        tags: {}
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
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_out_table_setof"
        },
        tags: {}
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
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "table_set_mutation"
        },
        tags: {}
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
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "table_set_query"
        },
        tags: {
          sortable: true,
          filterable: true,
          behavior: ["filter filterBy", "orderBy order resource:connection:backwards"]
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
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "table_set_query_plpgsql"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_computed_first_arg_inout"
        },
        tags: {},
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
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_friends"
        },
        tags: {
          sortable: true,
          behavior: ["orderBy order resource:connection:backwards"]
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
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_type_function_connection"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_type_function"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_type_function_list"
        },
        tags: {}
      },
      description: undefined
    })
  },
  pgRelations: {
    __proto__: null,
    compoundKey: {
      __proto__: null,
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
    },
    leftArm: {
      __proto__: null,
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
    },
    person: {
      __proto__: null,
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
      }
    },
    personSecret: {
      __proto__: null,
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
    }
  }
});
const resource_my_tablePgResource = registry.pgResources["my_table"];
const resource_person_secretPgResource = registry.pgResources["person_secret"];
const resource_compound_keyPgResource = registry.pgResources["compound_key"];
const resource_null_test_recordPgResource = registry.pgResources["null_test_record"];
const resource_left_armPgResource = registry.pgResources["left_arm"];
const resource_issue756PgResource = registry.pgResources["issue756"];
const resource_personPgResource = registry.pgResources["person"];
const EMPTY_ARRAY = [];
const makeArgs_person_computed_out = () => EMPTY_ARRAY;
const resource_current_user_idPgResource = registry.pgResources["current_user_id"];
const resource_func_outPgResource = registry.pgResources["func_out"];
const resource_func_out_setofPgResource = registry.pgResources["func_out_setof"];
const getSelectPlanFromParentAndArgs = ($root, args, _info) => {
  const selectArgs = makeArgs_person_computed_out(args);
  return resource_func_out_setofPgResource.execute(selectArgs);
};
const resource_func_out_unnamedPgResource = registry.pgResources["func_out_unnamed"];
const resource_no_args_queryPgResource = registry.pgResources["no_args_query"];
const argDetailsSimple_func_in_out = [{
  graphqlArgName: "i",
  postgresArgName: "i",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
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
const makeArgs_func_in_out = (args, path = []) => argDetailsSimple_func_in_out.map(details => makeArg(path, args, details));
const resource_func_in_outPgResource = registry.pgResources["func_in_out"];
const argDetailsSimple_func_returns_table_one_col = [{
  graphqlArgName: "i",
  postgresArgName: "i",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs_func_returns_table_one_col = (args, path = []) => argDetailsSimple_func_returns_table_one_col.map(details => makeArg(path, args, details));
const resource_func_returns_table_one_colPgResource = registry.pgResources["func_returns_table_one_col"];
const getSelectPlanFromParentAndArgs2 = ($root, args, _info) => {
  const selectArgs = makeArgs_func_returns_table_one_col(args);
  return resource_func_returns_table_one_colPgResource.execute(selectArgs);
};
const argDetailsSimple_json_identity = [{
  graphqlArgName: "json",
  postgresArgName: "json",
  pgCodec: TYPES.json,
  required: true,
  fetcher: null
}];
const makeArgs_json_identity = (args, path = []) => argDetailsSimple_json_identity.map(details => makeArg(path, args, details));
const resource_json_identityPgResource = registry.pgResources["json_identity"];
const argDetailsSimple_jsonb_identity = [{
  graphqlArgName: "json",
  postgresArgName: "json",
  pgCodec: TYPES.jsonb,
  required: true,
  fetcher: null
}];
const makeArgs_jsonb_identity = (args, path = []) => argDetailsSimple_jsonb_identity.map(details => makeArg(path, args, details));
const resource_jsonb_identityPgResource = registry.pgResources["jsonb_identity"];
const argDetailsSimple_func_in_inout = [{
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
const makeArgs_func_in_inout = (args, path = []) => argDetailsSimple_func_in_inout.map(details => makeArg(path, args, details));
const resource_func_in_inoutPgResource = registry.pgResources["func_in_inout"];
const resource_func_out_outPgResource = registry.pgResources["func_out_out"];
const resource_func_out_out_setofPgResource = registry.pgResources["func_out_out_setof"];
const getSelectPlanFromParentAndArgs3 = ($root, args, _info) => {
  const selectArgs = makeArgs_person_computed_out(args);
  return resource_func_out_out_setofPgResource.execute(selectArgs);
};
const resource_func_out_out_unnamedPgResource = registry.pgResources["func_out_out_unnamed"];
const resource_func_out_unnamed_out_out_unnamedPgResource = registry.pgResources["func_out_unnamed_out_out_unnamed"];
const argDetailsSimple_int_set_query = [{
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
const makeArgs_int_set_query = (args, path = []) => argDetailsSimple_int_set_query.map(details => makeArg(path, args, details));
const resource_int_set_queryPgResource = registry.pgResources["int_set_query"];
const getSelectPlanFromParentAndArgs4 = ($root, args, _info) => {
  const selectArgs = makeArgs_int_set_query(args);
  return resource_int_set_queryPgResource.execute(selectArgs);
};
const argDetailsSimple_func_returns_table_multi_col = [{
  graphqlArgName: "i",
  postgresArgName: "i",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "a",
  postgresArgName: "a",
  pgCodec: TYPES.int,
  required: false,
  fetcher: null
}, {
  graphqlArgName: "b",
  postgresArgName: "b",
  pgCodec: TYPES.int,
  required: false,
  fetcher: null
}];
const makeArgs_func_returns_table_multi_col = (args, path = []) => argDetailsSimple_func_returns_table_multi_col.map(details => makeArg(path, args, details));
const resource_func_returns_table_multi_colPgResource = registry.pgResources["func_returns_table_multi_col"];
const getSelectPlanFromParentAndArgs5 = ($root, args, _info) => {
  const selectArgs = makeArgs_func_returns_table_multi_col(args);
  return resource_func_returns_table_multi_colPgResource.execute(selectArgs);
};
const resource_search_test_summariesPgResource = registry.pgResources["search_test_summaries"];
const resource_return_table_without_grantsPgResource = registry.pgResources["return_table_without_grants"];
const argDetailsSimple_types_query = [{
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
const makeArgs_types_query = (args, path = []) => argDetailsSimple_types_query.map(details => makeArg(path, args, details));
const resource_types_queryPgResource = registry.pgResources["types_query"];
const argDetailsSimple_func_out_out_compound_type = [{
  graphqlArgName: "i1",
  postgresArgName: "i1",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs_func_out_out_compound_type = (args, path = []) => argDetailsSimple_func_out_out_compound_type.map(details => makeArg(path, args, details));
const resource_func_out_out_compound_typePgResource = registry.pgResources["func_out_out_compound_type"];
const argDetailsSimple_query_output_two_rows = [{
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
const makeArgs_query_output_two_rows = (args, path = []) => argDetailsSimple_query_output_two_rows.map(details => makeArg(path, args, details));
const resource_query_output_two_rowsPgResource = registry.pgResources["query_output_two_rows"];
const resource_compound_type_set_queryPgResource = registry.pgResources["compound_type_set_query"];
const getSelectPlanFromParentAndArgs6 = ($root, args, _info) => {
  const selectArgs = makeArgs_person_computed_out(args);
  return resource_compound_type_set_queryPgResource.execute(selectArgs);
};
const argDetailsSimple_table_query = [{
  graphqlArgName: "id",
  postgresArgName: "id",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs_table_query = (args, path = []) => argDetailsSimple_table_query.map(details => makeArg(path, args, details));
const resource_table_queryPgResource = registry.pgResources["table_query"];
const argDetailsSimple_func_out_complex = [{
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
const makeArgs_func_out_complex = (args, path = []) => argDetailsSimple_func_out_complex.map(details => makeArg(path, args, details));
const resource_func_out_complexPgResource = registry.pgResources["func_out_complex"];
const argDetailsSimple_func_out_complex_setof = [{
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
const makeArgs_func_out_complex_setof = (args, path = []) => argDetailsSimple_func_out_complex_setof.map(details => makeArg(path, args, details));
const resource_func_out_complex_setofPgResource = registry.pgResources["func_out_complex_setof"];
const getSelectPlanFromParentAndArgs7 = ($root, args, _info) => {
  const selectArgs = makeArgs_func_out_complex_setof(args);
  return resource_func_out_complex_setofPgResource.execute(selectArgs);
};
const resource_badly_behaved_functionPgResource = registry.pgResources["badly_behaved_function"];
const getSelectPlanFromParentAndArgs8 = ($root, args, _info) => {
  const selectArgs = makeArgs_person_computed_out(args);
  return resource_badly_behaved_functionPgResource.execute(selectArgs);
};
const resource_func_out_tablePgResource = registry.pgResources["func_out_table"];
const resource_func_out_table_setofPgResource = registry.pgResources["func_out_table_setof"];
const getSelectPlanFromParentAndArgs9 = ($root, args, _info) => {
  const selectArgs = makeArgs_person_computed_out(args);
  return resource_func_out_table_setofPgResource.execute(selectArgs);
};
const resource_table_set_queryPgResource = registry.pgResources["table_set_query"];
const getSelectPlanFromParentAndArgs10 = ($root, args, _info) => {
  const selectArgs = makeArgs_person_computed_out(args);
  return resource_table_set_queryPgResource.execute(selectArgs);
};
function qbWhereBuilder(qb) {
  return qb.whereBuilder();
}
const resource_table_set_query_plpgsqlPgResource = registry.pgResources["table_set_query_plpgsql"];
const getSelectPlanFromParentAndArgs11 = ($root, args, _info) => {
  const selectArgs = makeArgs_person_computed_out(args);
  return resource_table_set_query_plpgsqlPgResource.execute(selectArgs);
};
const nodeIdHandler_MyTable = {
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
  getIdentifiers(value) {
    return value.slice(1);
  },
  get(spec) {
    return resource_my_tablePgResource.get(spec);
  },
  match(obj) {
    return obj[0] === "my_tables";
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
const nodeFetcher_MyTable = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_MyTable));
  return nodeIdHandler_MyTable.get(nodeIdHandler_MyTable.getSpec($decoded));
};
const nodeIdHandler_PersonSecret = {
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
  getIdentifiers(value) {
    return value.slice(1);
  },
  get(spec) {
    return resource_person_secretPgResource.get(spec);
  },
  match(obj) {
    return obj[0] === "person_secrets";
  }
};
const nodeFetcher_PersonSecret = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandler_PersonSecret);
const nodeIdHandler_CompoundKey = {
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
  getIdentifiers(value) {
    return value.slice(1);
  },
  get(spec) {
    return resource_compound_keyPgResource.get(spec);
  },
  match(obj) {
    return obj[0] === "compound_keys";
  }
};
const nodeFetcher_CompoundKey = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_CompoundKey));
  return nodeIdHandler_CompoundKey.get(nodeIdHandler_CompoundKey.getSpec($decoded));
};
const nodeIdHandler_NullTestRecord = {
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
  getIdentifiers(value) {
    return value.slice(1);
  },
  get(spec) {
    return resource_null_test_recordPgResource.get(spec);
  },
  match(obj) {
    return obj[0] === "null_test_records";
  }
};
const nodeFetcher_NullTestRecord = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_NullTestRecord));
  return nodeIdHandler_NullTestRecord.get(nodeIdHandler_NullTestRecord.getSpec($decoded));
};
const nodeIdHandler_LeftArm = {
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
  getIdentifiers(value) {
    return value.slice(1);
  },
  get(spec) {
    return resource_left_armPgResource.get(spec);
  },
  match(obj) {
    return obj[0] === "left_arms";
  }
};
const nodeFetcher_LeftArm = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_LeftArm));
  return nodeIdHandler_LeftArm.get(nodeIdHandler_LeftArm.getSpec($decoded));
};
const nodeIdHandler_Issue756 = {
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
  getIdentifiers(value) {
    return value.slice(1);
  },
  get(spec) {
    return resource_issue756PgResource.get(spec);
  },
  match(obj) {
    return obj[0] === "issue756S";
  }
};
const nodeFetcher_Issue756 = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Issue756));
  return nodeIdHandler_Issue756.get(nodeIdHandler_Issue756.getSpec($decoded));
};
const nodeIdHandler_Person = {
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
  getIdentifiers(value) {
    return value.slice(1);
  },
  get(spec) {
    return resource_personPgResource.get(spec);
  },
  match(obj) {
    return obj[0] === "people";
  }
};
const nodeFetcher_Person = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Person));
  return nodeIdHandler_Person.get(nodeIdHandler_Person.getSpec($decoded));
};
const resource_edge_casePgResource = registry.pgResources["edge_case"];
const nodeIdHandlerByTypeName = {
  __proto__: null,
  Query: nodeIdHandler_Query,
  MyTable: nodeIdHandler_MyTable,
  PersonSecret: nodeIdHandler_PersonSecret,
  CompoundKey: nodeIdHandler_CompoundKey,
  NullTestRecord: nodeIdHandler_NullTestRecord,
  LeftArm: nodeIdHandler_LeftArm,
  Issue756: nodeIdHandler_Issue756,
  Person: nodeIdHandler_Person
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
    const canUseExpressionDirectly = $in instanceof PgSelectSingleStep && extraSelectArgs.every(a => stepAMayDependOnStepB($in.getClassStep(), a.step));
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
const resource_person_computed_outPgResource = registry.pgResources["person_computed_out"];
const resource_person_first_namePgResource = registry.pgResources["person_first_name"];
const resource_person_computed_out_outPgResource = registry.pgResources["person_computed_out_out"];
const argDetailsSimple_person_computed_inout = [{
  graphqlArgName: "ino",
  postgresArgName: "ino",
  pgCodec: TYPES.text,
  required: true,
  fetcher: null
}];
const makeArgs_person_computed_inout = (args, path = []) => argDetailsSimple_person_computed_inout.map(details => makeArg(path, args, details));
const resource_person_computed_inoutPgResource = registry.pgResources["person_computed_inout"];
const argDetailsSimple_person_computed_inout_out = [{
  graphqlArgName: "ino",
  postgresArgName: "ino",
  pgCodec: TYPES.text,
  required: true,
  fetcher: null
}];
const makeArgs_person_computed_inout_out = (args, path = []) => argDetailsSimple_person_computed_inout_out.map(details => makeArg(path, args, details));
const resource_person_computed_inout_outPgResource = registry.pgResources["person_computed_inout_out"];
const argDetailsSimple_person_exists = [{
  graphqlArgName: "email",
  postgresArgName: "email",
  pgCodec: emailCodec,
  required: true,
  fetcher: null
}];
const makeArgs_person_exists = (args, path = []) => argDetailsSimple_person_exists.map(details => makeArg(path, args, details));
const resource_person_existsPgResource = registry.pgResources["person_exists"];
const resource_person_computed_first_arg_inout_outPgResource = registry.pgResources["person_computed_first_arg_inout_out"];
const argDetailsSimple_person_optional_missing_middle_1 = [{
  graphqlArgName: "arg0",
  postgresArgName: "",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "b",
  postgresArgName: "b",
  pgCodec: TYPES.int,
  required: false,
  fetcher: null
}, {
  graphqlArgName: "c",
  postgresArgName: "c",
  pgCodec: TYPES.int,
  required: false,
  fetcher: null
}];
const makeArgs_person_optional_missing_middle_1 = (args, path = []) => argDetailsSimple_person_optional_missing_middle_1.map(details => makeArg(path, args, details));
const resource_person_optional_missing_middle_1PgResource = registry.pgResources["person_optional_missing_middle_1"];
const argDetailsSimple_person_optional_missing_middle_2 = [{
  graphqlArgName: "a",
  postgresArgName: "a",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "b",
  postgresArgName: "b",
  pgCodec: TYPES.int,
  required: false,
  fetcher: null
}, {
  graphqlArgName: "c",
  postgresArgName: "c",
  pgCodec: TYPES.int,
  required: false,
  fetcher: null
}];
const makeArgs_person_optional_missing_middle_2 = (args, path = []) => argDetailsSimple_person_optional_missing_middle_2.map(details => makeArg(path, args, details));
const resource_person_optional_missing_middle_2PgResource = registry.pgResources["person_optional_missing_middle_2"];
const argDetailsSimple_person_optional_missing_middle_3 = [{
  graphqlArgName: "a",
  postgresArgName: "a",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "arg1",
  postgresArgName: "",
  pgCodec: TYPES.int,
  required: false,
  fetcher: null
}, {
  graphqlArgName: "c",
  postgresArgName: "c",
  pgCodec: TYPES.int,
  required: false,
  fetcher: null
}];
const makeArgs_person_optional_missing_middle_3 = (args, path = []) => argDetailsSimple_person_optional_missing_middle_3.map(details => makeArg(path, args, details));
const resource_person_optional_missing_middle_3PgResource = registry.pgResources["person_optional_missing_middle_3"];
const argDetailsSimple_person_optional_missing_middle_4 = [{
  graphqlArgName: "arg0",
  postgresArgName: "",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "b",
  postgresArgName: "b",
  pgCodec: TYPES.int,
  required: false,
  fetcher: null
}, {
  graphqlArgName: "arg2",
  postgresArgName: "",
  pgCodec: TYPES.int,
  required: false,
  fetcher: null
}];
const makeArgs_person_optional_missing_middle_4 = (args, path = []) => argDetailsSimple_person_optional_missing_middle_4.map(details => makeArg(path, args, details));
const resource_person_optional_missing_middle_4PgResource = registry.pgResources["person_optional_missing_middle_4"];
const argDetailsSimple_person_optional_missing_middle_5 = [{
  graphqlArgName: "a",
  postgresArgName: "a",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "arg1",
  postgresArgName: "",
  pgCodec: TYPES.int,
  required: false,
  fetcher: null
}, {
  graphqlArgName: "arg2",
  postgresArgName: "",
  pgCodec: TYPES.int,
  required: false,
  fetcher: null
}];
const makeArgs_person_optional_missing_middle_5 = (args, path = []) => argDetailsSimple_person_optional_missing_middle_5.map(details => makeArg(path, args, details));
const resource_person_optional_missing_middle_5PgResource = registry.pgResources["person_optional_missing_middle_5"];
const argDetailsSimple_person_computed_complex = [{
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
const makeArgs_person_computed_complex = (args, path = []) => argDetailsSimple_person_computed_complex.map(details => makeArg(path, args, details));
const resource_person_computed_complexPgResource = registry.pgResources["person_computed_complex"];
const resource_person_first_postPgResource = registry.pgResources["person_first_post"];
const resource_person_computed_first_arg_inoutPgResource = registry.pgResources["person_computed_first_arg_inout"];
const resource_person_friendsPgResource = registry.pgResources["person_friends"];
const getSelectPlanFromParentAndArgs12 = ($in, args, _info) => {
  const {
    selectArgs
  } = pgFunctionArgumentsFromArgs($in, makeArgs_person_computed_out(args));
  return resource_person_friendsPgResource.execute(selectArgs);
};
const resource_person_type_function_connectionPgResource = registry.pgResources["person_type_function_connection"];
const getSelectPlanFromParentAndArgs13 = ($in, args, _info) => {
  const {
    selectArgs
  } = pgFunctionArgumentsFromArgs($in, makeArgs_person_computed_out(args));
  return resource_person_type_function_connectionPgResource.execute(selectArgs);
};
const argDetailsSimple_person_type_function = [{
  graphqlArgName: "id",
  postgresArgName: "id",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs_person_type_function = (args, path = []) => argDetailsSimple_person_type_function.map(details => makeArg(path, args, details));
const resource_person_type_functionPgResource = registry.pgResources["person_type_function"];
const resource_person_type_function_listPgResource = registry.pgResources["person_type_function_list"];
const resource_frmcdc_wrappedUrlPgResource = registry.pgResources["frmcdc_wrappedUrl"];
const resource_frmcdc_compoundTypePgResource = registry.pgResources["frmcdc_compoundType"];
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
const resource_edge_case_computedPgResource = registry.pgResources["edge_case_computed"];
const resource_mutation_outPgResource = registry.pgResources["mutation_out"];
const resource_mutation_out_setofPgResource = registry.pgResources["mutation_out_setof"];
const resource_mutation_out_unnamedPgResource = registry.pgResources["mutation_out_unnamed"];
const resource_no_args_mutationPgResource = registry.pgResources["no_args_mutation"];
const argDetailsSimple_mutation_in_out = [{
  graphqlArgName: "i",
  postgresArgName: "i",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs_mutation_in_out = (args, path = []) => argDetailsSimple_mutation_in_out.map(details => makeArg(path, args, details));
const resource_mutation_in_outPgResource = registry.pgResources["mutation_in_out"];
const argDetailsSimple_mutation_returns_table_one_col = [{
  graphqlArgName: "i",
  postgresArgName: "i",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs_mutation_returns_table_one_col = (args, path = []) => argDetailsSimple_mutation_returns_table_one_col.map(details => makeArg(path, args, details));
const resource_mutation_returns_table_one_colPgResource = registry.pgResources["mutation_returns_table_one_col"];
const argDetailsSimple_json_identity_mutation = [{
  graphqlArgName: "json",
  postgresArgName: "json",
  pgCodec: TYPES.json,
  required: true,
  fetcher: null
}];
const makeArgs_json_identity_mutation = (args, path = []) => argDetailsSimple_json_identity_mutation.map(details => makeArg(path, args, details));
const resource_json_identity_mutationPgResource = registry.pgResources["json_identity_mutation"];
const argDetailsSimple_jsonb_identity_mutation = [{
  graphqlArgName: "json",
  postgresArgName: "json",
  pgCodec: TYPES.jsonb,
  required: true,
  fetcher: null
}];
const makeArgs_jsonb_identity_mutation = (args, path = []) => argDetailsSimple_jsonb_identity_mutation.map(details => makeArg(path, args, details));
const resource_jsonb_identity_mutationPgResource = registry.pgResources["jsonb_identity_mutation"];
const argDetailsSimple_jsonb_identity_mutation_plpgsql = [{
  graphqlArgName: "_theJson",
  postgresArgName: "_the_json",
  pgCodec: TYPES.jsonb,
  required: true,
  fetcher: null
}];
const makeArgs_jsonb_identity_mutation_plpgsql = (args, path = []) => argDetailsSimple_jsonb_identity_mutation_plpgsql.map(details => makeArg(path, args, details));
const resource_jsonb_identity_mutation_plpgsqlPgResource = registry.pgResources["jsonb_identity_mutation_plpgsql"];
const argDetailsSimple_jsonb_identity_mutation_plpgsql_with_default = [{
  graphqlArgName: "_theJson",
  postgresArgName: "_the_json",
  pgCodec: TYPES.jsonb,
  required: false,
  fetcher: null
}];
const makeArgs_jsonb_identity_mutation_plpgsql_with_default = (args, path = []) => argDetailsSimple_jsonb_identity_mutation_plpgsql_with_default.map(details => makeArg(path, args, details));
const resource_jsonb_identity_mutation_plpgsql_with_defaultPgResource = registry.pgResources["jsonb_identity_mutation_plpgsql_with_default"];
const argDetailsSimple_mutation_in_inout = [{
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
const makeArgs_mutation_in_inout = (args, path = []) => argDetailsSimple_mutation_in_inout.map(details => makeArg(path, args, details));
const resource_mutation_in_inoutPgResource = registry.pgResources["mutation_in_inout"];
const resource_mutation_out_outPgResource = registry.pgResources["mutation_out_out"];
const resource_mutation_out_out_setofPgResource = registry.pgResources["mutation_out_out_setof"];
const resource_mutation_out_out_unnamedPgResource = registry.pgResources["mutation_out_out_unnamed"];
const argDetailsSimple_int_set_mutation = [{
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
const makeArgs_int_set_mutation = (args, path = []) => argDetailsSimple_int_set_mutation.map(details => makeArg(path, args, details));
const resource_int_set_mutationPgResource = registry.pgResources["int_set_mutation"];
const resource_mutation_out_unnamed_out_out_unnamedPgResource = registry.pgResources["mutation_out_unnamed_out_out_unnamed"];
const argDetailsSimple_mutation_returns_table_multi_col = [{
  graphqlArgName: "i",
  postgresArgName: "i",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs_mutation_returns_table_multi_col = (args, path = []) => argDetailsSimple_mutation_returns_table_multi_col.map(details => makeArg(path, args, details));
const resource_mutation_returns_table_multi_colPgResource = registry.pgResources["mutation_returns_table_multi_col"];
const argDetailsSimple_left_arm_identity = [{
  graphqlArgName: "leftArm",
  postgresArgName: "left_arm",
  pgCodec: leftArmCodec,
  required: true,
  fetcher: null
}];
const makeArgs_left_arm_identity = (args, path = []) => argDetailsSimple_left_arm_identity.map(details => makeArg(path, args, details));
const resource_left_arm_identityPgResource = registry.pgResources["left_arm_identity"];
const resource_issue756_mutationPgResource = registry.pgResources["issue756_mutation"];
const resource_issue756_set_mutationPgResource = registry.pgResources["issue756_set_mutation"];
const argDetailsSimple_types_mutation = [{
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
const makeArgs_types_mutation = (args, path = []) => argDetailsSimple_types_mutation.map(details => makeArg(path, args, details));
const resource_types_mutationPgResource = registry.pgResources["types_mutation"];
const argDetailsSimple_mutation_out_out_compound_type = [{
  graphqlArgName: "i1",
  postgresArgName: "i1",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs_mutation_out_out_compound_type = (args, path = []) => argDetailsSimple_mutation_out_out_compound_type.map(details => makeArg(path, args, details));
const resource_mutation_out_out_compound_typePgResource = registry.pgResources["mutation_out_out_compound_type"];
const argDetailsSimple_table_mutation = [{
  graphqlArgName: "id",
  postgresArgName: "id",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs_table_mutation = (args, path = []) => argDetailsSimple_table_mutation.map(details => makeArg(path, args, details));
const resource_table_mutationPgResource = registry.pgResources["table_mutation"];
const argDetailsSimple_list_of_compound_types_mutation = [{
  graphqlArgName: "records",
  postgresArgName: "records",
  pgCodec: compoundTypeArrayCodec,
  required: true,
  fetcher: null
}];
const makeArgs_list_of_compound_types_mutation = (args, path = []) => argDetailsSimple_list_of_compound_types_mutation.map(details => makeArg(path, args, details));
const resource_list_of_compound_types_mutationPgResource = registry.pgResources["list_of_compound_types_mutation"];
const argDetailsSimple_mutation_out_complex = [{
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
const makeArgs_mutation_out_complex = (args, path = []) => argDetailsSimple_mutation_out_complex.map(details => makeArg(path, args, details));
const resource_mutation_out_complexPgResource = registry.pgResources["mutation_out_complex"];
const argDetailsSimple_mutation_out_complex_setof = [{
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
const makeArgs_mutation_out_complex_setof = (args, path = []) => argDetailsSimple_mutation_out_complex_setof.map(details => makeArg(path, args, details));
const resource_mutation_out_complex_setofPgResource = registry.pgResources["mutation_out_complex_setof"];
const resource_mutation_out_tablePgResource = registry.pgResources["mutation_out_table"];
const resource_mutation_out_table_setofPgResource = registry.pgResources["mutation_out_table_setof"];
const resource_table_set_mutationPgResource = registry.pgResources["table_set_mutation"];
const specFromArgs_MyTable = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_MyTable, $nodeId);
};
const specFromArgs_PersonSecret = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_PersonSecret, $nodeId);
};
const specFromArgs_CompoundKey = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_CompoundKey, $nodeId);
};
const specFromArgs_NullTestRecord = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_NullTestRecord, $nodeId);
};
const specFromArgs_LeftArm = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_LeftArm, $nodeId);
};
const specFromArgs_Issue756 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Issue756, $nodeId);
};
const specFromArgs_Person = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Person, $nodeId);
};
const specFromArgs_MyTable2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_MyTable, $nodeId);
};
const specFromArgs_PersonSecret2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_PersonSecret, $nodeId);
};
const specFromArgs_CompoundKey2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_CompoundKey, $nodeId);
};
const specFromArgs_NullTestRecord2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_NullTestRecord, $nodeId);
};
const specFromArgs_LeftArm2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_LeftArm, $nodeId);
};
const specFromArgs_Issue7562 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Issue756, $nodeId);
};
const specFromArgs_Person2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Person, $nodeId);
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
  funcOutSetofList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int
  ): [Int!]
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
  funcReturnsTableOneColList(
    i: Int

    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int
  ): [Int!]
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
  funcOutOutSetofList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int
  ): [FuncOutOutSetofRecord!]
  funcOutOutUnnamed: FuncOutOutUnnamedRecord
  funcOutUnnamedOutOutUnnamed: FuncOutUnnamedOutOutUnnamedRecord

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
  intSetQueryList(
    x: Int
    y: Int
    z: Int

    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int
  ): [Int!]

  """
  Reads and enables pagination through a set of \`FuncReturnsTableMultiColRecord\`.
  """
  funcReturnsTableMultiCol(
    i: Int
    a: Int
    b: Int

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
  funcReturnsTableMultiColList(
    i: Int
    a: Int
    b: Int

    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int
  ): [FuncReturnsTableMultiColRecord!]
  searchTestSummariesList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int
  ): [SearchTestSummariesRecord!]
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
  compoundTypeSetQueryList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int
  ): [CompoundType!]
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
  funcOutComplexSetofList(
    a: Int
    b: String

    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int
  ): [FuncOutComplexSetofRecord!]

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
  badlyBehavedFunctionList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int
  ): [Person!] @deprecated(reason: "This is deprecated (comment on function c.badly_behaved_function).")
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
  funcOutTableSetofList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int
  ): [Person!]

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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: PersonCondition

    """The method to use when ordering \`Person\`."""
    orderBy: [PeopleOrderBy!]
  ): PeopleConnection
  tableSetQueryList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: PersonCondition

    """The method to use when ordering \`Person\`."""
    orderBy: [PeopleOrderBy!]
  ): [Person!]

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
  tableSetQueryPlpgsqlList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int
  ): [Person!]

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

  """Reads a set of \`MyTable\`."""
  allMyTablesList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: MyTableCondition

    """The method to use when ordering \`MyTable\`."""
    orderBy: [MyTablesOrderBy!]
  ): [MyTable!]

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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: MyTableCondition

    """The method to use when ordering \`MyTable\`."""
    orderBy: [MyTablesOrderBy!] = [PRIMARY_KEY_ASC]
  ): MyTablesConnection

  """Reads a set of \`PersonSecret\`."""
  allPersonSecretsList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: PersonSecretCondition

    """The method to use when ordering \`PersonSecret\`."""
    orderBy: [PersonSecretsOrderBy!]
  ): [PersonSecret!] @deprecated(reason: "This is deprecated (comment on table c.person_secret).")

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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: PersonSecretCondition

    """The method to use when ordering \`PersonSecret\`."""
    orderBy: [PersonSecretsOrderBy!] = [PRIMARY_KEY_ASC]
  ): PersonSecretsConnection @deprecated(reason: "This is deprecated (comment on table c.person_secret).")

  """Reads a set of \`CompoundKey\`."""
  allCompoundKeysList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: CompoundKeyCondition

    """The method to use when ordering \`CompoundKey\`."""
    orderBy: [CompoundKeysOrderBy!]
  ): [CompoundKey!]

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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: CompoundKeyCondition

    """The method to use when ordering \`CompoundKey\`."""
    orderBy: [CompoundKeysOrderBy!] = [PRIMARY_KEY_ASC]
  ): CompoundKeysConnection

  """Reads a set of \`NullTestRecord\`."""
  allNullTestRecordsList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: NullTestRecordCondition

    """The method to use when ordering \`NullTestRecord\`."""
    orderBy: [NullTestRecordsOrderBy!]
  ): [NullTestRecord!]

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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: NullTestRecordCondition

    """The method to use when ordering \`NullTestRecord\`."""
    orderBy: [NullTestRecordsOrderBy!] = [PRIMARY_KEY_ASC]
  ): NullTestRecordsConnection

  """Reads a set of \`EdgeCase\`."""
  allEdgeCasesList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: EdgeCaseCondition

    """The method to use when ordering \`EdgeCase\`."""
    orderBy: [EdgeCasesOrderBy!]
  ): [EdgeCase!]

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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: EdgeCaseCondition

    """The method to use when ordering \`EdgeCase\`."""
    orderBy: [EdgeCasesOrderBy!] = [NATURAL]
  ): EdgeCasesConnection

  """Reads a set of \`LeftArm\`."""
  allLeftArmsList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: LeftArmCondition

    """The method to use when ordering \`LeftArm\`."""
    orderBy: [LeftArmsOrderBy!]
  ): [LeftArm!]

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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: LeftArmCondition

    """The method to use when ordering \`LeftArm\`."""
    orderBy: [LeftArmsOrderBy!] = [PRIMARY_KEY_ASC]
  ): LeftArmsConnection

  """Reads a set of \`Issue756\`."""
  allIssue756SList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: Issue756Condition

    """The method to use when ordering \`Issue756\`."""
    orderBy: [Issue756SOrderBy!]
  ): [Issue756!]

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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: Issue756Condition

    """The method to use when ordering \`Issue756\`."""
    orderBy: [Issue756SOrderBy!] = [PRIMARY_KEY_ASC]
  ): Issue756SConnection

  """Reads a set of \`Person\`."""
  allPeopleList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: PersonCondition

    """The method to use when ordering \`Person\`."""
    orderBy: [PeopleOrderBy!]
  ): [Person!]

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
  optionalMissingMiddle1(arg0: Int!, b: Int, c: Int): Int
  optionalMissingMiddle2(a: Int!, b: Int, c: Int): Int
  optionalMissingMiddle3(a: Int!, arg1: Int, c: Int): Int
  optionalMissingMiddle4(arg0: Int!, b: Int, arg2: Int): Int
  optionalMissingMiddle5(a: Int!, arg1: Int, arg2: Int): Int
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
  friendsList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int

    """The method to use when ordering \`Person\`."""
    orderBy: [PeopleOrderBy!]
  ): [Person!]

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
  typeFunctionConnectionList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int
  ): [Type!]
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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: CompoundKeyCondition

    """The method to use when ordering \`CompoundKey\`."""
    orderBy: [CompoundKeysOrderBy!] = [PRIMARY_KEY_ASC]
  ): CompoundKeysConnection!

  """Reads and enables pagination through a set of \`CompoundKey\`."""
  compoundKeysByPersonId1List(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: CompoundKeyCondition

    """The method to use when ordering \`CompoundKey\`."""
    orderBy: [CompoundKeysOrderBy!]
  ): [CompoundKey!]!

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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: CompoundKeyCondition

    """The method to use when ordering \`CompoundKey\`."""
    orderBy: [CompoundKeysOrderBy!] = [PRIMARY_KEY_ASC]
  ): CompoundKeysConnection!

  """Reads and enables pagination through a set of \`CompoundKey\`."""
  compoundKeysByPersonId2List(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: CompoundKeyCondition

    """The method to use when ordering \`CompoundKey\`."""
    orderBy: [CompoundKeysOrderBy!]
  ): [CompoundKey!]!
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
  nodes: [Type!]!

  """
  A list of edges which contains the \`Type\` and cursor to aid in pagination.
  """
  edges: [TypesEdge!]!

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
  node: Type!
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
  nodes: [CompoundKey!]!

  """
  A list of edges which contains the \`CompoundKey\` and cursor to aid in pagination.
  """
  edges: [CompoundKeysEdge!]!

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
  node: CompoundKey!
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
  nodes: [FuncOutOutSetofRecord!]!

  """
  A list of edges which contains the \`FuncOutOutSetofRecord\` and cursor to aid in pagination.
  """
  edges: [FuncOutOutSetofEdge!]!

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
  node: FuncOutOutSetofRecord!
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

"""A connection to a list of \`FuncReturnsTableMultiColRecord\` values."""
type FuncReturnsTableMultiColConnection {
  """A list of \`FuncReturnsTableMultiColRecord\` objects."""
  nodes: [FuncReturnsTableMultiColRecord!]!

  """
  A list of edges which contains the \`FuncReturnsTableMultiColRecord\` and cursor to aid in pagination.
  """
  edges: [FuncReturnsTableMultiColEdge!]!

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
  node: FuncReturnsTableMultiColRecord!
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
  nodes: [CompoundType!]!

  """
  A list of edges which contains the \`CompoundType\` and cursor to aid in pagination.
  """
  edges: [CompoundTypesEdge!]!

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
  node: CompoundType!
}

type FuncOutComplexRecord {
  x: Int
  y: CompoundType
  z: Person
}

"""A connection to a list of \`FuncOutComplexSetofRecord\` values."""
type FuncOutComplexSetofConnection {
  """A list of \`FuncOutComplexSetofRecord\` objects."""
  nodes: [FuncOutComplexSetofRecord!]!

  """
  A list of edges which contains the \`FuncOutComplexSetofRecord\` and cursor to aid in pagination.
  """
  edges: [FuncOutComplexSetofEdge!]!

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
  node: FuncOutComplexSetofRecord!
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

"""
A condition to be used against \`MyTable\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input MyTableCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`jsonData\` field."""
  jsonData: JSON
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

"""A connection to a list of \`MyTable\` values."""
type MyTablesConnection {
  """A list of \`MyTable\` objects."""
  nodes: [MyTable!]!

  """
  A list of edges which contains the \`MyTable\` and cursor to aid in pagination.
  """
  edges: [MyTablesEdge!]!

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
  node: MyTable!
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

"""A connection to a list of \`PersonSecret\` values."""
type PersonSecretsConnection {
  """A list of \`PersonSecret\` objects."""
  nodes: [PersonSecret!]!

  """
  A list of edges which contains the \`PersonSecret\` and cursor to aid in pagination.
  """
  edges: [PersonSecretsEdge!]!

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
  node: PersonSecret!
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

"""A connection to a list of \`NullTestRecord\` values."""
type NullTestRecordsConnection {
  """A list of \`NullTestRecord\` objects."""
  nodes: [NullTestRecord!]!

  """
  A list of edges which contains the \`NullTestRecord\` and cursor to aid in pagination.
  """
  edges: [NullTestRecordsEdge!]!

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
  node: NullTestRecord!
}

type EdgeCase {
  computed: String
  notNullHasDefault: Boolean!
  wontCastEasy: Int
  rowId: Int
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

"""Methods to use when ordering \`EdgeCase\`."""
enum EdgeCasesOrderBy {
  NATURAL
  COMPUTED_ASC
  COMPUTED_DESC
  NOT_NULL_HAS_DEFAULT_ASC
  NOT_NULL_HAS_DEFAULT_DESC
  WONT_CAST_EASY_ASC
  WONT_CAST_EASY_DESC
  ROW_ID_ASC
  ROW_ID_DESC
}

"""A connection to a list of \`EdgeCase\` values."""
type EdgeCasesConnection {
  """A list of \`EdgeCase\` objects."""
  nodes: [EdgeCase!]!

  """
  A list of edges which contains the \`EdgeCase\` and cursor to aid in pagination.
  """
  edges: [EdgeCasesEdge!]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`EdgeCase\` you could get from the connection."""
  totalCount: Int!
}

"""A \`EdgeCase\` edge in the connection."""
type EdgeCasesEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`EdgeCase\` at the end of the edge."""
  node: EdgeCase!
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

"""A connection to a list of \`LeftArm\` values."""
type LeftArmsConnection {
  """A list of \`LeftArm\` objects."""
  nodes: [LeftArm!]!

  """
  A list of edges which contains the \`LeftArm\` and cursor to aid in pagination.
  """
  edges: [LeftArmsEdge!]!

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
  node: LeftArm!
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

"""A connection to a list of \`Issue756\` values."""
type Issue756SConnection {
  """A list of \`Issue756\` objects."""
  nodes: [Issue756!]!

  """
  A list of edges which contains the \`Issue756\` and cursor to aid in pagination.
  """
  edges: [Issue756SEdge!]!

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
  node: Issue756!
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
  listOfCompoundTypesMutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: ListOfCompoundTypesMutationInput!
  ): ListOfCompoundTypesMutationPayload
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
  results: [MutationOutOutSetofRecord!]

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
  results: [MutationReturnsTableMultiColRecord!]

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
  issue756S: [Issue756!]

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

"""The output of our \`listOfCompoundTypesMutation\` mutation."""
type ListOfCompoundTypesMutationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  compoundTypes: [CompoundType!]

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`listOfCompoundTypesMutation\` mutation."""
input ListOfCompoundTypesMutationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  records: [CompoundTypeInput]
}

"""An input for mutations affecting \`CompoundType\`"""
input CompoundTypeInput {
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
  results: [MutationOutComplexSetofRecord!]

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
  people: [Person!]

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
  people: [Person!]

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
      const specifier = nodeIdHandler_Query.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandler_Query.codec.name].encode);
    },
    node(_$root, fieldArgs) {
      return fieldArgs.getRaw("nodeId");
    },
    myTableById(_$root, {
      $id
    }) {
      return resource_my_tablePgResource.get({
        id: $id
      });
    },
    personSecretByPersonId(_$root, {
      $personId
    }) {
      return resource_person_secretPgResource.get({
        person_id: $personId
      });
    },
    compoundKeyByPersonId1AndPersonId2(_$root, {
      $personId1,
      $personId2
    }) {
      return resource_compound_keyPgResource.get({
        person_id_1: $personId1,
        person_id_2: $personId2
      });
    },
    nullTestRecordById(_$root, {
      $id
    }) {
      return resource_null_test_recordPgResource.get({
        id: $id
      });
    },
    leftArmById(_$root, {
      $id
    }) {
      return resource_left_armPgResource.get({
        id: $id
      });
    },
    leftArmByPersonId(_$root, {
      $personId
    }) {
      return resource_left_armPgResource.get({
        person_id: $personId
      });
    },
    issue756ById(_$root, {
      $id
    }) {
      return resource_issue756PgResource.get({
        id: $id
      });
    },
    personById(_$root, {
      $id
    }) {
      return resource_personPgResource.get({
        id: $id
      });
    },
    personByEmail(_$root, {
      $email
    }) {
      return resource_personPgResource.get({
        email: $email
      });
    },
    currentUserId($root, args, _info) {
      const selectArgs = makeArgs_person_computed_out(args);
      return resource_current_user_idPgResource.execute(selectArgs);
    },
    funcOut($root, args, _info) {
      const selectArgs = makeArgs_person_computed_out(args);
      return resource_func_outPgResource.execute(selectArgs);
    },
    funcOutSetof: {
      plan($parent, args, info) {
        const $select = getSelectPlanFromParentAndArgs($parent, args, info);
        return connection($select, {
          cursorPlan($item) {
            return $item.getParentStep ? $item.getParentStep().cursor() : $item.cursor();
          }
        });
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
        }
      }
    },
    funcOutSetofList: {
      plan: getSelectPlanFromParentAndArgs,
      args: {
        first(_, $connection, arg) {
          $connection.setFirst(arg.getRaw());
        },
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        }
      }
    },
    funcOutUnnamed($root, args, _info) {
      const selectArgs = makeArgs_person_computed_out(args);
      return resource_func_out_unnamedPgResource.execute(selectArgs);
    },
    noArgsQuery($root, args, _info) {
      const selectArgs = makeArgs_person_computed_out(args);
      return resource_no_args_queryPgResource.execute(selectArgs);
    },
    funcInOut($root, args, _info) {
      const selectArgs = makeArgs_func_in_out(args);
      return resource_func_in_outPgResource.execute(selectArgs);
    },
    funcReturnsTableOneCol: {
      plan($parent, args, info) {
        const $select = getSelectPlanFromParentAndArgs2($parent, args, info);
        return connection($select, {
          cursorPlan($item) {
            return $item.getParentStep ? $item.getParentStep().cursor() : $item.cursor();
          }
        });
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
        }
      }
    },
    funcReturnsTableOneColList: {
      plan: getSelectPlanFromParentAndArgs2,
      args: {
        first(_, $connection, arg) {
          $connection.setFirst(arg.getRaw());
        },
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        }
      }
    },
    jsonIdentity($root, args, _info) {
      const selectArgs = makeArgs_json_identity(args);
      return resource_json_identityPgResource.execute(selectArgs);
    },
    jsonbIdentity($root, args, _info) {
      const selectArgs = makeArgs_jsonb_identity(args);
      return resource_jsonb_identityPgResource.execute(selectArgs);
    },
    funcInInout($root, args, _info) {
      const selectArgs = makeArgs_func_in_inout(args);
      return resource_func_in_inoutPgResource.execute(selectArgs);
    },
    funcOutOut($root, args, _info) {
      const selectArgs = makeArgs_person_computed_out(args);
      return resource_func_out_outPgResource.execute(selectArgs);
    },
    funcOutOutSetof: {
      plan($parent, args, info) {
        const $select = getSelectPlanFromParentAndArgs3($parent, args, info);
        return connection($select, {
          cursorPlan($item) {
            return $item.getParentStep ? $item.getParentStep().cursor() : $item.cursor();
          }
        });
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
        }
      }
    },
    funcOutOutSetofList: {
      plan: getSelectPlanFromParentAndArgs3,
      args: {
        first(_, $connection, arg) {
          $connection.setFirst(arg.getRaw());
        },
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        }
      }
    },
    funcOutOutUnnamed($root, args, _info) {
      const selectArgs = makeArgs_person_computed_out(args);
      return resource_func_out_out_unnamedPgResource.execute(selectArgs);
    },
    funcOutUnnamedOutOutUnnamed($root, args, _info) {
      const selectArgs = makeArgs_person_computed_out(args);
      return resource_func_out_unnamed_out_out_unnamedPgResource.execute(selectArgs);
    },
    intSetQuery: {
      plan($parent, args, info) {
        const $select = getSelectPlanFromParentAndArgs4($parent, args, info);
        return connection($select, {
          cursorPlan($item) {
            return $item.getParentStep ? $item.getParentStep().cursor() : $item.cursor();
          }
        });
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
        }
      }
    },
    intSetQueryList: {
      plan: getSelectPlanFromParentAndArgs4,
      args: {
        first(_, $connection, arg) {
          $connection.setFirst(arg.getRaw());
        },
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        }
      }
    },
    funcReturnsTableMultiCol: {
      plan($parent, args, info) {
        const $select = getSelectPlanFromParentAndArgs5($parent, args, info);
        return connection($select, {
          cursorPlan($item) {
            return $item.getParentStep ? $item.getParentStep().cursor() : $item.cursor();
          }
        });
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
        }
      }
    },
    funcReturnsTableMultiColList: {
      plan: getSelectPlanFromParentAndArgs5,
      args: {
        first(_, $connection, arg) {
          $connection.setFirst(arg.getRaw());
        },
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        }
      }
    },
    searchTestSummariesList: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_person_computed_out(args);
        return resource_search_test_summariesPgResource.execute(selectArgs);
      },
      args: {
        first(_, $connection, arg) {
          $connection.setFirst(arg.getRaw());
        },
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        }
      }
    },
    returnTableWithoutGrants($root, args, _info) {
      const selectArgs = makeArgs_person_computed_out(args);
      return resource_return_table_without_grantsPgResource.execute(selectArgs);
    },
    typesQuery($root, args, _info) {
      const selectArgs = makeArgs_types_query(args);
      return resource_types_queryPgResource.execute(selectArgs);
    },
    funcOutOutCompoundType($root, args, _info) {
      const selectArgs = makeArgs_func_out_out_compound_type(args);
      return resource_func_out_out_compound_typePgResource.execute(selectArgs);
    },
    queryOutputTwoRows($root, args, _info) {
      const selectArgs = makeArgs_query_output_two_rows(args);
      return resource_query_output_two_rowsPgResource.execute(selectArgs);
    },
    compoundTypeSetQuery: {
      plan($parent, args, info) {
        const $select = getSelectPlanFromParentAndArgs6($parent, args, info);
        return connection($select, {
          cursorPlan($item) {
            return $item.getParentStep ? $item.getParentStep().cursor() : $item.cursor();
          }
        });
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
        }
      }
    },
    compoundTypeSetQueryList: {
      plan: getSelectPlanFromParentAndArgs6,
      args: {
        first(_, $connection, arg) {
          $connection.setFirst(arg.getRaw());
        },
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        }
      }
    },
    tableQuery($root, args, _info) {
      const selectArgs = makeArgs_table_query(args);
      return resource_table_queryPgResource.execute(selectArgs);
    },
    funcOutComplex($root, args, _info) {
      const selectArgs = makeArgs_func_out_complex(args);
      return resource_func_out_complexPgResource.execute(selectArgs);
    },
    funcOutComplexSetof: {
      plan($parent, args, info) {
        const $select = getSelectPlanFromParentAndArgs7($parent, args, info);
        return connection($select, {
          cursorPlan($item) {
            return $item.getParentStep ? $item.getParentStep().cursor() : $item.cursor();
          }
        });
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
        }
      }
    },
    funcOutComplexSetofList: {
      plan: getSelectPlanFromParentAndArgs7,
      args: {
        first(_, $connection, arg) {
          $connection.setFirst(arg.getRaw());
        },
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        }
      }
    },
    badlyBehavedFunction: {
      plan($parent, args, info) {
        const $select = getSelectPlanFromParentAndArgs8($parent, args, info);
        return connection($select, {
          cursorPlan($item) {
            return $item.getParentStep ? $item.getParentStep().cursor() : $item.cursor();
          }
        });
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
        }
      }
    },
    badlyBehavedFunctionList: {
      plan: getSelectPlanFromParentAndArgs8,
      args: {
        first(_, $connection, arg) {
          $connection.setFirst(arg.getRaw());
        },
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        }
      }
    },
    funcOutTable($root, args, _info) {
      const selectArgs = makeArgs_person_computed_out(args);
      return resource_func_out_tablePgResource.execute(selectArgs);
    },
    funcOutTableSetof: {
      plan($parent, args, info) {
        const $select = getSelectPlanFromParentAndArgs9($parent, args, info);
        return connection($select, {
          cursorPlan($item) {
            return $item.getParentStep ? $item.getParentStep().cursor() : $item.cursor();
          }
        });
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
        }
      }
    },
    funcOutTableSetofList: {
      plan: getSelectPlanFromParentAndArgs9,
      args: {
        first(_, $connection, arg) {
          $connection.setFirst(arg.getRaw());
        },
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        }
      }
    },
    tableSetQuery: {
      plan($parent, args, info) {
        const $select = getSelectPlanFromParentAndArgs10($parent, args, info);
        return connection($select, {
          cursorPlan($item) {
            return $item.getParentStep ? $item.getParentStep().cursor() : $item.cursor();
          }
        });
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
    tableSetQueryList: {
      plan: getSelectPlanFromParentAndArgs10,
      args: {
        first(_, $connection, arg) {
          $connection.setFirst(arg.getRaw());
        },
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        condition(_condition, $select, arg) {
          arg.apply($select, qbWhereBuilder);
        },
        orderBy(parent, $select, value) {
          value.apply($select);
        }
      }
    },
    tableSetQueryPlpgsql: {
      plan($parent, args, info) {
        const $select = getSelectPlanFromParentAndArgs11($parent, args, info);
        return connection($select, {
          cursorPlan($item) {
            return $item.getParentStep ? $item.getParentStep().cursor() : $item.cursor();
          }
        });
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
        }
      }
    },
    tableSetQueryPlpgsqlList: {
      plan: getSelectPlanFromParentAndArgs11,
      args: {
        first(_, $connection, arg) {
          $connection.setFirst(arg.getRaw());
        },
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        }
      }
    },
    myTable(_$parent, args) {
      const $nodeId = args.getRaw("nodeId");
      return nodeFetcher_MyTable($nodeId);
    },
    personSecret(_$parent, args) {
      const $nodeId = args.getRaw("nodeId");
      return nodeFetcher_PersonSecret($nodeId);
    },
    compoundKey(_$parent, args) {
      const $nodeId = args.getRaw("nodeId");
      return nodeFetcher_CompoundKey($nodeId);
    },
    nullTestRecord(_$parent, args) {
      const $nodeId = args.getRaw("nodeId");
      return nodeFetcher_NullTestRecord($nodeId);
    },
    leftArm(_$parent, args) {
      const $nodeId = args.getRaw("nodeId");
      return nodeFetcher_LeftArm($nodeId);
    },
    issue756(_$parent, args) {
      const $nodeId = args.getRaw("nodeId");
      return nodeFetcher_Issue756($nodeId);
    },
    person(_$parent, args) {
      const $nodeId = args.getRaw("nodeId");
      return nodeFetcher_Person($nodeId);
    },
    allMyTablesList: {
      plan() {
        return resource_my_tablePgResource.find();
      },
      args: {
        first(_, $connection, arg) {
          $connection.setFirst(arg.getRaw());
        },
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        condition(_condition, $select, arg) {
          arg.apply($select, qbWhereBuilder);
        },
        orderBy(parent, $select, value) {
          value.apply($select);
        }
      }
    },
    allMyTables: {
      plan() {
        return connection(resource_my_tablePgResource.find());
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
    allPersonSecretsList: {
      plan() {
        return resource_person_secretPgResource.find();
      },
      args: {
        first(_, $connection, arg) {
          $connection.setFirst(arg.getRaw());
        },
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        condition(_condition, $select, arg) {
          arg.apply($select, qbWhereBuilder);
        },
        orderBy(parent, $select, value) {
          value.apply($select);
        }
      }
    },
    allPersonSecrets: {
      plan() {
        return connection(resource_person_secretPgResource.find());
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
    allCompoundKeysList: {
      plan() {
        return resource_compound_keyPgResource.find();
      },
      args: {
        first(_, $connection, arg) {
          $connection.setFirst(arg.getRaw());
        },
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        condition(_condition, $select, arg) {
          arg.apply($select, qbWhereBuilder);
        },
        orderBy(parent, $select, value) {
          value.apply($select);
        }
      }
    },
    allCompoundKeys: {
      plan() {
        return connection(resource_compound_keyPgResource.find());
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
    allNullTestRecordsList: {
      plan() {
        return resource_null_test_recordPgResource.find();
      },
      args: {
        first(_, $connection, arg) {
          $connection.setFirst(arg.getRaw());
        },
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        condition(_condition, $select, arg) {
          arg.apply($select, qbWhereBuilder);
        },
        orderBy(parent, $select, value) {
          value.apply($select);
        }
      }
    },
    allNullTestRecords: {
      plan() {
        return connection(resource_null_test_recordPgResource.find());
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
    allEdgeCasesList: {
      plan() {
        return resource_edge_casePgResource.find();
      },
      args: {
        first(_, $connection, arg) {
          $connection.setFirst(arg.getRaw());
        },
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        condition(_condition, $select, arg) {
          arg.apply($select, qbWhereBuilder);
        },
        orderBy(parent, $select, value) {
          value.apply($select);
        }
      }
    },
    allEdgeCases: {
      plan() {
        return connection(resource_edge_casePgResource.find());
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
    allLeftArmsList: {
      plan() {
        return resource_left_armPgResource.find();
      },
      args: {
        first(_, $connection, arg) {
          $connection.setFirst(arg.getRaw());
        },
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        condition(_condition, $select, arg) {
          arg.apply($select, qbWhereBuilder);
        },
        orderBy(parent, $select, value) {
          value.apply($select);
        }
      }
    },
    allLeftArms: {
      plan() {
        return connection(resource_left_armPgResource.find());
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
    allIssue756SList: {
      plan() {
        return resource_issue756PgResource.find();
      },
      args: {
        first(_, $connection, arg) {
          $connection.setFirst(arg.getRaw());
        },
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        condition(_condition, $select, arg) {
          arg.apply($select, qbWhereBuilder);
        },
        orderBy(parent, $select, value) {
          value.apply($select);
        }
      }
    },
    allIssue756S: {
      plan() {
        return connection(resource_issue756PgResource.find());
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
    allPeopleList: {
      plan() {
        return resource_personPgResource.find();
      },
      args: {
        first(_, $connection, arg) {
          $connection.setFirst(arg.getRaw());
        },
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        condition(_condition, $select, arg) {
          arg.apply($select, qbWhereBuilder);
        },
        orderBy(parent, $select, value) {
          value.apply($select);
        }
      }
    },
    allPeople: {
      plan() {
        return connection(resource_personPgResource.find());
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
  Node: {
    __planType($nodeId) {
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
  },
  MyTable: {
    __assertStep: assertPgClassSingleStep,
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of my_tableUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_my_tablePgResource.get(spec);
    },
    nodeId($parent) {
      const specifier = nodeIdHandler_MyTable.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandler_MyTable.codec.name].encode);
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
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of person_secretUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_person_secretPgResource.get(spec);
    },
    nodeId($parent) {
      const specifier = nodeIdHandler_PersonSecret.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandler_PersonSecret.codec.name].encode);
    },
    personId($record) {
      return $record.get("person_id");
    },
    secret($record) {
      return $record.get("sekrit");
    },
    personByPersonId($record) {
      return resource_personPgResource.get({
        id: $record.get("person_id")
      });
    }
  },
  Person: {
    __assertStep: assertPgClassSingleStep,
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of personUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_personPgResource.get(spec);
    },
    nodeId($parent) {
      const specifier = nodeIdHandler_Person.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandler_Person.codec.name].encode);
    },
    computedOut($in, args, _info) {
      const {
        $row,
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_person_computed_out(args), true);
      const from = pgFromExpression($row, resource_person_computed_outPgResource.from, resource_person_computed_outPgResource.parameters, selectArgs);
      return pgClassExpression($row, resource_person_computed_outPgResource.codec, undefined)`${from}`;
    },
    firstName($in, args, _info) {
      const {
        $row,
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_person_computed_out(args), true);
      const from = pgFromExpression($row, resource_person_first_namePgResource.from, resource_person_first_namePgResource.parameters, selectArgs);
      return pgClassExpression($row, resource_person_first_namePgResource.codec, undefined)`${from}`;
    },
    computedOutOut($in, args, _info) {
      const {
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_person_computed_out(args));
      return resource_person_computed_out_outPgResource.execute(selectArgs);
    },
    computedInout($in, args, _info) {
      const {
        $row,
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_person_computed_inout(args), true);
      const from = pgFromExpression($row, resource_person_computed_inoutPgResource.from, resource_person_computed_inoutPgResource.parameters, selectArgs);
      return pgClassExpression($row, resource_person_computed_inoutPgResource.codec, undefined)`${from}`;
    },
    computedInoutOut($in, args, _info) {
      const {
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_person_computed_inout_out(args));
      return resource_person_computed_inout_outPgResource.execute(selectArgs);
    },
    exists($in, args, _info) {
      const {
        $row,
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_person_exists(args), true);
      const from = pgFromExpression($row, resource_person_existsPgResource.from, resource_person_existsPgResource.parameters, selectArgs);
      return pgClassExpression($row, resource_person_existsPgResource.codec, undefined)`${from}`;
    },
    computedFirstArgInoutOut($in, args, _info) {
      const {
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_person_computed_out(args));
      return resource_person_computed_first_arg_inout_outPgResource.execute(selectArgs);
    },
    optionalMissingMiddle1($in, args, _info) {
      const {
        $row,
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_person_optional_missing_middle_1(args), true);
      const from = pgFromExpression($row, resource_person_optional_missing_middle_1PgResource.from, resource_person_optional_missing_middle_1PgResource.parameters, selectArgs);
      return pgClassExpression($row, resource_person_optional_missing_middle_1PgResource.codec, undefined)`${from}`;
    },
    optionalMissingMiddle2($in, args, _info) {
      const {
        $row,
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_person_optional_missing_middle_2(args), true);
      const from = pgFromExpression($row, resource_person_optional_missing_middle_2PgResource.from, resource_person_optional_missing_middle_2PgResource.parameters, selectArgs);
      return pgClassExpression($row, resource_person_optional_missing_middle_2PgResource.codec, undefined)`${from}`;
    },
    optionalMissingMiddle3($in, args, _info) {
      const {
        $row,
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_person_optional_missing_middle_3(args), true);
      const from = pgFromExpression($row, resource_person_optional_missing_middle_3PgResource.from, resource_person_optional_missing_middle_3PgResource.parameters, selectArgs);
      return pgClassExpression($row, resource_person_optional_missing_middle_3PgResource.codec, undefined)`${from}`;
    },
    optionalMissingMiddle4($in, args, _info) {
      const {
        $row,
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_person_optional_missing_middle_4(args), true);
      const from = pgFromExpression($row, resource_person_optional_missing_middle_4PgResource.from, resource_person_optional_missing_middle_4PgResource.parameters, selectArgs);
      return pgClassExpression($row, resource_person_optional_missing_middle_4PgResource.codec, undefined)`${from}`;
    },
    optionalMissingMiddle5($in, args, _info) {
      const {
        $row,
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_person_optional_missing_middle_5(args), true);
      const from = pgFromExpression($row, resource_person_optional_missing_middle_5PgResource.from, resource_person_optional_missing_middle_5PgResource.parameters, selectArgs);
      return pgClassExpression($row, resource_person_optional_missing_middle_5PgResource.codec, undefined)`${from}`;
    },
    computedComplex($in, args, _info) {
      const {
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_person_computed_complex(args));
      return resource_person_computed_complexPgResource.execute(selectArgs);
    },
    firstPost($in, args, _info) {
      const {
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_person_computed_out(args));
      return resource_person_first_postPgResource.execute(selectArgs);
    },
    computedFirstArgInout($in, args, _info) {
      const {
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_person_computed_out(args));
      return resource_person_computed_first_arg_inoutPgResource.execute(selectArgs);
    },
    friends: {
      plan($parent, args, info) {
        const $select = getSelectPlanFromParentAndArgs12($parent, args, info);
        return connection($select, {
          cursorPlan($item) {
            return $item.getParentStep ? $item.getParentStep().cursor() : $item.cursor();
          }
        });
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
        orderBy(parent, $connection, value) {
          const $select = $connection.getSubplan();
          value.apply($select);
        }
      }
    },
    friendsList: {
      plan: getSelectPlanFromParentAndArgs12,
      args: {
        first(_, $connection, arg) {
          $connection.setFirst(arg.getRaw());
        },
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        orderBy(parent, $select, value) {
          value.apply($select);
        }
      }
    },
    typeFunctionConnection: {
      plan($parent, args, info) {
        const $select = getSelectPlanFromParentAndArgs13($parent, args, info);
        return connection($select, {
          cursorPlan($item) {
            return $item.getParentStep ? $item.getParentStep().cursor() : $item.cursor();
          }
        });
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
        }
      }
    },
    typeFunctionConnectionList: {
      plan: getSelectPlanFromParentAndArgs13,
      args: {
        first(_, $connection, arg) {
          $connection.setFirst(arg.getRaw());
        },
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        }
      }
    },
    typeFunction($in, args, _info) {
      const {
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_person_type_function(args));
      return resource_person_type_functionPgResource.execute(selectArgs);
    },
    typeFunctionList($in, args, _info) {
      const {
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_person_computed_out(args));
      return resource_person_type_function_listPgResource.execute(selectArgs);
    },
    name($record) {
      return $record.get("person_full_name");
    },
    site($record) {
      const $plan = $record.get("site");
      const $select = pgSelectSingleFromRecord(resource_frmcdc_wrappedUrlPgResource, $plan);
      $select.getClassStep().setTrusted();
      return $select;
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
      return resource_person_secretPgResource.get({
        person_id: $record.get("id")
      });
    },
    leftArmByPersonId($record) {
      return resource_left_armPgResource.get({
        person_id: $record.get("id")
      });
    },
    compoundKeysByPersonId1: {
      plan($record) {
        const $records = resource_compound_keyPgResource.find({
          person_id_1: $record.get("id")
        });
        return connection($records);
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
    compoundKeysByPersonId1List: {
      plan($record) {
        return resource_compound_keyPgResource.find({
          person_id_1: $record.get("id")
        });
      },
      args: {
        first(_, $connection, arg) {
          $connection.setFirst(arg.getRaw());
        },
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        condition(_condition, $select, arg) {
          arg.apply($select, qbWhereBuilder);
        },
        orderBy(parent, $select, value) {
          value.apply($select);
        }
      }
    },
    compoundKeysByPersonId2: {
      plan($record) {
        const $records = resource_compound_keyPgResource.find({
          person_id_2: $record.get("id")
        });
        return connection($records);
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
    compoundKeysByPersonId2List: {
      plan($record) {
        return resource_compound_keyPgResource.find({
          person_id_2: $record.get("id")
        });
      },
      args: {
        first(_, $connection, arg) {
          $connection.setFirst(arg.getRaw());
        },
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        condition(_condition, $select, arg) {
          arg.apply($select, qbWhereBuilder);
        },
        orderBy(parent, $select, value) {
          value.apply($select);
        }
      }
    }
  },
  PersonComputedOutOutRecord: {
    __assertStep: assertPgClassSingleStep
  },
  PersonComputedInoutOutRecord: {
    __assertStep: assertPgClassSingleStep
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
      const $select = pgSelectSingleFromRecord(resource_personPgResource, $plan);
      $select.getClassStep().setTrusted();
      return $select;
    }
  },
  PersonComputedComplexRecord: {
    __assertStep: assertPgClassSingleStep,
    y($record) {
      const $plan = $record.get("y");
      const $select = pgSelectSingleFromRecord(resource_frmcdc_compoundTypePgResource, $plan);
      $select.getClassStep().setTrusted();
      return $select;
    },
    z($record) {
      const $plan = $record.get("z");
      const $select = pgSelectSingleFromRecord(resource_personPgResource, $plan);
      $select.getClassStep().setTrusted();
      return $select;
    }
  },
  CompoundType: {
    __assertStep: assertPgClassSingleStep,
    computedField($in, args, _info) {
      const {
        $row,
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_person_computed_out(args), true);
      const from = pgFromExpression($row, resource_compound_type_computed_fieldPgResource.from, resource_compound_type_computed_fieldPgResource.parameters, selectArgs);
      return pgClassExpression($row, resource_compound_type_computed_fieldPgResource.codec, undefined)`${from}`;
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
    __assertStep: assertExecutableStep
  },
  Post: {
    __assertStep: assertPgClassSingleStep,
    authorId($record) {
      return $record.get("author_id");
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
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
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
    COMPUTED_OUT_ASC(queryBuilder) {
      if (typeof resource_person_computed_outPgResource.from !== "function") {
        throw new Error("Invalid computed attribute 'from'");
      }
      const expression = sql`${resource_person_computed_outPgResource.from({
        placeholder: queryBuilder.alias
      })}`;
      queryBuilder.orderBy({
        codec: resource_person_computed_outPgResource.codec,
        fragment: expression,
        direction: "asc".toUpperCase()
      });
    },
    COMPUTED_OUT_DESC(queryBuilder) {
      if (typeof resource_person_computed_outPgResource.from !== "function") {
        throw new Error("Invalid computed attribute 'from'");
      }
      const expression = sql`${resource_person_computed_outPgResource.from({
        placeholder: queryBuilder.alias
      })}`;
      queryBuilder.orderBy({
        codec: resource_person_computed_outPgResource.codec,
        fragment: expression,
        direction: "desc".toUpperCase()
      });
    },
    FIRST_NAME_ASC(queryBuilder) {
      if (typeof resource_person_first_namePgResource.from !== "function") {
        throw new Error("Invalid computed attribute 'from'");
      }
      const expression = sql`${resource_person_first_namePgResource.from({
        placeholder: queryBuilder.alias
      })}`;
      queryBuilder.orderBy({
        codec: resource_person_first_namePgResource.codec,
        fragment: expression,
        direction: "asc".toUpperCase()
      });
    },
    FIRST_NAME_DESC(queryBuilder) {
      if (typeof resource_person_first_namePgResource.from !== "function") {
        throw new Error("Invalid computed attribute 'from'");
      }
      const expression = sql`${resource_person_first_namePgResource.from({
        placeholder: queryBuilder.alias
      })}`;
      queryBuilder.orderBy({
        codec: resource_person_first_namePgResource.codec,
        fragment: expression,
        direction: "desc".toUpperCase()
      });
    },
    PRIMARY_KEY_ASC(queryBuilder) {
      personUniques[0].attributes.forEach(attributeName => {
        queryBuilder.orderBy({
          attribute: attributeName,
          direction: "ASC"
        });
      });
      queryBuilder.setOrderIsUnique();
    },
    PRIMARY_KEY_DESC(queryBuilder) {
      personUniques[0].attributes.forEach(attributeName => {
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
    NAME_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "person_full_name",
        direction: "ASC"
      });
    },
    NAME_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "person_full_name",
        direction: "DESC"
      });
    },
    ABOUT_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "about",
        direction: "ASC"
      });
    },
    ABOUT_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "about",
        direction: "DESC"
      });
    },
    EMAIL_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "email",
        direction: "ASC"
      });
      queryBuilder.setOrderIsUnique();
    },
    EMAIL_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "email",
        direction: "DESC"
      });
      queryBuilder.setOrderIsUnique();
    },
    SITE_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "site",
        direction: "ASC"
      });
    },
    SITE_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "site",
        direction: "DESC"
      });
    },
    CONFIG_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "config",
        direction: "ASC"
      });
    },
    CONFIG_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "config",
        direction: "DESC"
      });
    },
    LAST_LOGIN_FROM_IP_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "last_login_from_ip",
        direction: "ASC"
      });
    },
    LAST_LOGIN_FROM_IP_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "last_login_from_ip",
        direction: "DESC"
      });
    },
    LAST_LOGIN_FROM_SUBNET_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "last_login_from_subnet",
        direction: "ASC"
      });
    },
    LAST_LOGIN_FROM_SUBNET_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "last_login_from_subnet",
        direction: "DESC"
      });
    },
    USER_MAC_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "user_mac",
        direction: "ASC"
      });
    },
    USER_MAC_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "user_mac",
        direction: "DESC"
      });
    },
    CREATED_AT_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "created_at",
        direction: "ASC"
      });
    },
    CREATED_AT_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "created_at",
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
  Type: {
    __assertStep: assertPgClassSingleStep,
    enumArray($record) {
      return $record.get("enum_array");
    },
    textArray($record) {
      return $record.get("text_array");
    },
    nullableRange($record) {
      return $record.get("nullable_range");
    },
    anIntRange($record) {
      return $record.get("an_int_range");
    },
    intervalArray($record) {
      return $record.get("interval_array");
    },
    compoundType($record) {
      const $plan = $record.get("compound_type");
      const $select = pgSelectSingleFromRecord(resource_frmcdc_compoundTypePgResource, $plan);
      $select.coalesceToEmptyObject();
      $select.getClassStep().setTrusted();
      return $select;
    },
    nestedCompoundType($record) {
      const $plan = $record.get("nested_compound_type");
      const $select = pgSelectSingleFromRecord(resource_frmcdc_nestedCompoundTypePgResource, $plan);
      $select.coalesceToEmptyObject();
      $select.getClassStep().setTrusted();
      return $select;
    },
    nullableCompoundType($record) {
      const $plan = $record.get("nullable_compound_type");
      const $select = pgSelectSingleFromRecord(resource_frmcdc_compoundTypePgResource, $plan);
      $select.getClassStep().setTrusted();
      return $select;
    },
    nullableNestedCompoundType($record) {
      const $plan = $record.get("nullable_nested_compound_type");
      const $select = pgSelectSingleFromRecord(resource_frmcdc_nestedCompoundTypePgResource, $plan);
      $select.getClassStep().setTrusted();
      return $select;
    },
    textArrayDomain($record) {
      return $record.get("text_array_domain");
    },
    int8ArrayDomain($record) {
      return $record.get("int8_array_domain");
    },
    byteaArray($record) {
      return $record.get("bytea_array");
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
      $select.getClassStep().setTrusted();
      return $select;
    },
    b($record) {
      const $plan = $record.get("b");
      const $select = pgSelectSingleFromRecord(resource_frmcdc_compoundTypePgResource, $plan);
      $select.getClassStep().setTrusted();
      return $select;
    },
    bazBuz($record) {
      return $record.get("baz_buz");
    }
  },
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
    __assertStep: assertPgClassSingleStep
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
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of left_armUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_left_armPgResource.get(spec);
    },
    nodeId($parent) {
      const specifier = nodeIdHandler_LeftArm.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandler_LeftArm.codec.name].encode);
    },
    personId($record) {
      return $record.get("person_id");
    },
    lengthInMetres($record) {
      return $record.get("length_in_metres");
    },
    personByPersonId($record) {
      return resource_personPgResource.get({
        id: $record.get("person_id")
      });
    }
  },
  CompoundKeysConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  CompoundKey: {
    __assertStep: assertPgClassSingleStep,
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of compound_keyUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_compound_keyPgResource.get(spec);
    },
    nodeId($parent) {
      const specifier = nodeIdHandler_CompoundKey.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandler_CompoundKey.codec.name].encode);
    },
    personId2($record) {
      return $record.get("person_id_2");
    },
    personId1($record) {
      return $record.get("person_id_1");
    },
    personByPersonId1($record) {
      return resource_personPgResource.get({
        id: $record.get("person_id_1")
      });
    },
    personByPersonId2($record) {
      return resource_personPgResource.get({
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
  CompoundKeyCondition: {
    personId2($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "person_id_2",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    },
    personId1($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "person_id_1",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    },
    extra($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "extra",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.boolean)}`;
        }
      });
    }
  },
  CompoundKeysOrderBy: {
    PRIMARY_KEY_ASC(queryBuilder) {
      compound_keyUniques[0].attributes.forEach(attributeName => {
        queryBuilder.orderBy({
          attribute: attributeName,
          direction: "ASC"
        });
      });
      queryBuilder.setOrderIsUnique();
    },
    PRIMARY_KEY_DESC(queryBuilder) {
      compound_keyUniques[0].attributes.forEach(attributeName => {
        queryBuilder.orderBy({
          attribute: attributeName,
          direction: "DESC"
        });
      });
      queryBuilder.setOrderIsUnique();
    },
    PERSON_ID_2_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "person_id_2",
        direction: "ASC"
      });
    },
    PERSON_ID_2_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "person_id_2",
        direction: "DESC"
      });
    },
    PERSON_ID_1_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "person_id_1",
        direction: "ASC"
      });
      queryBuilder.setOrderIsUnique();
    },
    PERSON_ID_1_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "person_id_1",
        direction: "DESC"
      });
      queryBuilder.setOrderIsUnique();
    },
    EXTRA_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "extra",
        direction: "ASC"
      });
    },
    EXTRA_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "extra",
        direction: "DESC"
      });
    }
  },
  NullTestRecord: {
    __assertStep: assertPgClassSingleStep,
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of null_test_recordUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_null_test_recordPgResource.get(spec);
    },
    nodeId($parent) {
      const specifier = nodeIdHandler_NullTestRecord.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandler_NullTestRecord.codec.name].encode);
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
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of issue756Uniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_issue756PgResource.get(spec);
    },
    nodeId($parent) {
      const specifier = nodeIdHandler_Issue756.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandler_Issue756.codec.name].encode);
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
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
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
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
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
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  FuncOutOutSetofRecord: {
    __assertStep: assertPgClassSingleStep
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
    arg3($record) {
      return $record.get("column3");
    }
  },
  IntSetQueryConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
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
  FuncReturnsTableMultiColConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  FuncReturnsTableMultiColRecord: {
    __assertStep: assertPgClassSingleStep
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
  SearchTestSummariesRecord: {
    __assertStep: assertPgClassSingleStep,
    totalDuration($record) {
      return $record.get("total_duration");
    }
  },
  FuncOutOutCompoundTypeRecord: {
    __assertStep: assertPgClassSingleStep,
    o2($record) {
      const $plan = $record.get("o2");
      const $select = pgSelectSingleFromRecord(resource_frmcdc_compoundTypePgResource, $plan);
      $select.getClassStep().setTrusted();
      return $select;
    }
  },
  QueryOutputTwoRowsRecord: {
    __assertStep: assertPgClassSingleStep,
    leftArm($record) {
      const $plan = $record.get("left_arm");
      const $select = pgSelectSingleFromRecord(resource_left_armPgResource, $plan);
      $select.getClassStep().setTrusted();
      return $select;
    },
    post($record) {
      const $plan = $record.get("post");
      const $select = pgSelectSingleFromRecord(resource_frmcdc_postPgResource, $plan);
      $select.getClassStep().setTrusted();
      return $select;
    }
  },
  CompoundTypesConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
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
    y($record) {
      const $plan = $record.get("y");
      const $select = pgSelectSingleFromRecord(resource_frmcdc_compoundTypePgResource, $plan);
      $select.getClassStep().setTrusted();
      return $select;
    },
    z($record) {
      const $plan = $record.get("z");
      const $select = pgSelectSingleFromRecord(resource_personPgResource, $plan);
      $select.getClassStep().setTrusted();
      return $select;
    }
  },
  FuncOutComplexSetofConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  FuncOutComplexSetofRecord: {
    __assertStep: assertPgClassSingleStep,
    y($record) {
      const $plan = $record.get("y");
      const $select = pgSelectSingleFromRecord(resource_frmcdc_compoundTypePgResource, $plan);
      $select.getClassStep().setTrusted();
      return $select;
    },
    z($record) {
      const $plan = $record.get("z");
      const $select = pgSelectSingleFromRecord(resource_personPgResource, $plan);
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
    id($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "id",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    },
    name($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "person_full_name",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.varchar)}`;
        }
      });
    },
    aliases($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "aliases",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, textArrayCodec)}`;
        }
      });
    },
    about($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "about",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
        }
      });
    },
    email($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "email",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, emailCodec)}`;
        }
      });
    },
    site($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "site",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, wrappedUrlCodec)}`;
        }
      });
    },
    config($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "config",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.hstore)}`;
        }
      });
    },
    lastLoginFromIp($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "last_login_from_ip",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.inet)}`;
        }
      });
    },
    lastLoginFromSubnet($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "last_login_from_subnet",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.cidr)}`;
        }
      });
    },
    userMac($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "user_mac",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.macaddr)}`;
        }
      });
    },
    createdAt($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "created_at",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.timestamp)}`;
        }
      });
    },
    computedOut($condition, val) {
      if (val === undefined) return;
      if (typeof resource_person_computed_outPgResource.from !== "function") {
        throw new Error("Invalid computed attribute 'from'");
      }
      const expression = sql`${resource_person_computed_outPgResource.from({
        placeholder: $condition.alias
      })}`;
      $condition.where(val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, resource_person_computed_outPgResource.codec)}`);
    }
  },
  WrappedUrlInput: {
    __baked: createObjectAndApplyChildren,
    url(obj, val, {
      field,
      schema
    }) {
      obj.set("url", bakedInputRuntime(schema, field.type, val));
    }
  },
  MyTableCondition: {
    id($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "id",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    },
    jsonData($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "json_data",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.jsonb)}`;
        }
      });
    }
  },
  MyTablesOrderBy: {
    PRIMARY_KEY_ASC(queryBuilder) {
      my_tableUniques[0].attributes.forEach(attributeName => {
        queryBuilder.orderBy({
          attribute: attributeName,
          direction: "ASC"
        });
      });
      queryBuilder.setOrderIsUnique();
    },
    PRIMARY_KEY_DESC(queryBuilder) {
      my_tableUniques[0].attributes.forEach(attributeName => {
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
    JSON_DATA_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "json_data",
        direction: "ASC"
      });
    },
    JSON_DATA_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "json_data",
        direction: "DESC"
      });
    }
  },
  MyTablesConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
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
  PersonSecretCondition: {
    personId($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "person_id",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    },
    secret($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "sekrit",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
        }
      });
    }
  },
  PersonSecretsOrderBy: {
    PRIMARY_KEY_ASC(queryBuilder) {
      person_secretUniques[0].attributes.forEach(attributeName => {
        queryBuilder.orderBy({
          attribute: attributeName,
          direction: "ASC"
        });
      });
      queryBuilder.setOrderIsUnique();
    },
    PRIMARY_KEY_DESC(queryBuilder) {
      person_secretUniques[0].attributes.forEach(attributeName => {
        queryBuilder.orderBy({
          attribute: attributeName,
          direction: "DESC"
        });
      });
      queryBuilder.setOrderIsUnique();
    },
    PERSON_ID_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "person_id",
        direction: "ASC"
      });
      queryBuilder.setOrderIsUnique();
    },
    PERSON_ID_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "person_id",
        direction: "DESC"
      });
      queryBuilder.setOrderIsUnique();
    },
    SECRET_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "sekrit",
        direction: "ASC"
      });
    },
    SECRET_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "sekrit",
        direction: "DESC"
      });
    }
  },
  PersonSecretsConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
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
  NullTestRecordCondition: {
    id($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "id",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    },
    nullableText($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "nullable_text",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
        }
      });
    },
    nullableInt($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "nullable_int",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    },
    nonNullText($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "non_null_text",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
        }
      });
    }
  },
  NullTestRecordsOrderBy: {
    PRIMARY_KEY_ASC(queryBuilder) {
      null_test_recordUniques[0].attributes.forEach(attributeName => {
        queryBuilder.orderBy({
          attribute: attributeName,
          direction: "ASC"
        });
      });
      queryBuilder.setOrderIsUnique();
    },
    PRIMARY_KEY_DESC(queryBuilder) {
      null_test_recordUniques[0].attributes.forEach(attributeName => {
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
    NULLABLE_TEXT_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "nullable_text",
        direction: "ASC"
      });
    },
    NULLABLE_TEXT_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "nullable_text",
        direction: "DESC"
      });
    },
    NULLABLE_INT_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "nullable_int",
        direction: "ASC"
      });
    },
    NULLABLE_INT_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "nullable_int",
        direction: "DESC"
      });
    },
    NON_NULL_TEXT_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "non_null_text",
        direction: "ASC"
      });
    },
    NON_NULL_TEXT_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "non_null_text",
        direction: "DESC"
      });
    }
  },
  NullTestRecordsConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
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
  EdgeCase: {
    __assertStep: assertPgClassSingleStep,
    computed($in, args, _info) {
      const {
        $row,
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_person_computed_out(args), true);
      const from = pgFromExpression($row, resource_edge_case_computedPgResource.from, resource_edge_case_computedPgResource.parameters, selectArgs);
      return pgClassExpression($row, resource_edge_case_computedPgResource.codec, undefined)`${from}`;
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
  EdgeCaseCondition: {
    notNullHasDefault($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "not_null_has_default",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.boolean)}`;
        }
      });
    },
    wontCastEasy($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "wont_cast_easy",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int2)}`;
        }
      });
    },
    rowId($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "row_id",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    }
  },
  EdgeCasesOrderBy: {
    COMPUTED_ASC(queryBuilder) {
      if (typeof resource_edge_case_computedPgResource.from !== "function") {
        throw new Error("Invalid computed attribute 'from'");
      }
      const expression = sql`${resource_edge_case_computedPgResource.from({
        placeholder: queryBuilder.alias
      })}`;
      queryBuilder.orderBy({
        codec: resource_edge_case_computedPgResource.codec,
        fragment: expression,
        direction: "asc".toUpperCase()
      });
    },
    COMPUTED_DESC(queryBuilder) {
      if (typeof resource_edge_case_computedPgResource.from !== "function") {
        throw new Error("Invalid computed attribute 'from'");
      }
      const expression = sql`${resource_edge_case_computedPgResource.from({
        placeholder: queryBuilder.alias
      })}`;
      queryBuilder.orderBy({
        codec: resource_edge_case_computedPgResource.codec,
        fragment: expression,
        direction: "desc".toUpperCase()
      });
    },
    NOT_NULL_HAS_DEFAULT_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "not_null_has_default",
        direction: "ASC"
      });
    },
    NOT_NULL_HAS_DEFAULT_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "not_null_has_default",
        direction: "DESC"
      });
    },
    WONT_CAST_EASY_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "wont_cast_easy",
        direction: "ASC"
      });
    },
    WONT_CAST_EASY_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "wont_cast_easy",
        direction: "DESC"
      });
    },
    ROW_ID_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "row_id",
        direction: "ASC"
      });
    },
    ROW_ID_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "row_id",
        direction: "DESC"
      });
    }
  },
  EdgeCasesConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
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
  LeftArmCondition: {
    id($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "id",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    },
    personId($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "person_id",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    },
    lengthInMetres($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "length_in_metres",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.float)}`;
        }
      });
    },
    mood($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "mood",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
        }
      });
    }
  },
  LeftArmsOrderBy: {
    PRIMARY_KEY_ASC(queryBuilder) {
      left_armUniques[0].attributes.forEach(attributeName => {
        queryBuilder.orderBy({
          attribute: attributeName,
          direction: "ASC"
        });
      });
      queryBuilder.setOrderIsUnique();
    },
    PRIMARY_KEY_DESC(queryBuilder) {
      left_armUniques[0].attributes.forEach(attributeName => {
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
    PERSON_ID_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "person_id",
        direction: "ASC"
      });
      queryBuilder.setOrderIsUnique();
    },
    PERSON_ID_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "person_id",
        direction: "DESC"
      });
      queryBuilder.setOrderIsUnique();
    },
    LENGTH_IN_METRES_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "length_in_metres",
        direction: "ASC"
      });
    },
    LENGTH_IN_METRES_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "length_in_metres",
        direction: "DESC"
      });
    },
    MOOD_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "mood",
        direction: "ASC"
      });
    },
    MOOD_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "mood",
        direction: "DESC"
      });
    }
  },
  LeftArmsConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
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
  Issue756Condition: {
    id($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "id",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    },
    ts($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "ts",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, notNullTimestampCodec)}`;
        }
      });
    }
  },
  Issue756SOrderBy: {
    PRIMARY_KEY_ASC(queryBuilder) {
      issue756Uniques[0].attributes.forEach(attributeName => {
        queryBuilder.orderBy({
          attribute: attributeName,
          direction: "ASC"
        });
      });
      queryBuilder.setOrderIsUnique();
    },
    PRIMARY_KEY_DESC(queryBuilder) {
      issue756Uniques[0].attributes.forEach(attributeName => {
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
    TS_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "ts",
        direction: "ASC"
      });
    },
    TS_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "ts",
        direction: "DESC"
      });
    }
  },
  Issue756SConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
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
  Mutation: {
    __assertStep: __ValueStep,
    mutationOut: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_person_computed_out(args, ["input"]);
        const $result = resource_mutation_outPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input(_, $object, arg) {
          // We might have any number of step types here; we need
          // to get back to the underlying pgSelect.
          const $result = $object.getStepForKey("result");
          const $parent = "getParentStep" in $result ? $result.getParentStep() : $result;
          const $pgSelect = "getClassStep" in $parent ? $parent.getClassStep() : $parent;
          if ($pgSelect instanceof PgSelectStep) {
            // Mostly so `clientMutationId` works!
            arg.apply($pgSelect);
          } else {
            throw new Error(`Could not determine PgSelectStep for ${$result}`);
          }
        }
      }
    },
    mutationOutSetof: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_person_computed_out(args, ["input"]);
        const $result = resource_mutation_out_setofPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input(_, $object, arg) {
          // We might have any number of step types here; we need
          // to get back to the underlying pgSelect.
          const $result = $object.getStepForKey("result");
          const $parent = "getParentStep" in $result ? $result.getParentStep() : $result;
          const $pgSelect = "getClassStep" in $parent ? $parent.getClassStep() : $parent;
          if ($pgSelect instanceof PgSelectStep) {
            // Mostly so `clientMutationId` works!
            arg.apply($pgSelect);
          } else {
            throw new Error(`Could not determine PgSelectStep for ${$result}`);
          }
        }
      }
    },
    mutationOutUnnamed: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_person_computed_out(args, ["input"]);
        const $result = resource_mutation_out_unnamedPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input(_, $object, arg) {
          // We might have any number of step types here; we need
          // to get back to the underlying pgSelect.
          const $result = $object.getStepForKey("result");
          const $parent = "getParentStep" in $result ? $result.getParentStep() : $result;
          const $pgSelect = "getClassStep" in $parent ? $parent.getClassStep() : $parent;
          if ($pgSelect instanceof PgSelectStep) {
            // Mostly so `clientMutationId` works!
            arg.apply($pgSelect);
          } else {
            throw new Error(`Could not determine PgSelectStep for ${$result}`);
          }
        }
      }
    },
    noArgsMutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_person_computed_out(args, ["input"]);
        const $result = resource_no_args_mutationPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input(_, $object, arg) {
          // We might have any number of step types here; we need
          // to get back to the underlying pgSelect.
          const $result = $object.getStepForKey("result");
          const $parent = "getParentStep" in $result ? $result.getParentStep() : $result;
          const $pgSelect = "getClassStep" in $parent ? $parent.getClassStep() : $parent;
          if ($pgSelect instanceof PgSelectStep) {
            // Mostly so `clientMutationId` works!
            arg.apply($pgSelect);
          } else {
            throw new Error(`Could not determine PgSelectStep for ${$result}`);
          }
        }
      }
    },
    mutationInOut: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_mutation_in_out(args, ["input"]);
        const $result = resource_mutation_in_outPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input(_, $object, arg) {
          // We might have any number of step types here; we need
          // to get back to the underlying pgSelect.
          const $result = $object.getStepForKey("result");
          const $parent = "getParentStep" in $result ? $result.getParentStep() : $result;
          const $pgSelect = "getClassStep" in $parent ? $parent.getClassStep() : $parent;
          if ($pgSelect instanceof PgSelectStep) {
            // Mostly so `clientMutationId` works!
            arg.apply($pgSelect);
          } else {
            throw new Error(`Could not determine PgSelectStep for ${$result}`);
          }
        }
      }
    },
    mutationReturnsTableOneCol: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_mutation_returns_table_one_col(args, ["input"]);
        const $result = resource_mutation_returns_table_one_colPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input(_, $object, arg) {
          // We might have any number of step types here; we need
          // to get back to the underlying pgSelect.
          const $result = $object.getStepForKey("result");
          const $parent = "getParentStep" in $result ? $result.getParentStep() : $result;
          const $pgSelect = "getClassStep" in $parent ? $parent.getClassStep() : $parent;
          if ($pgSelect instanceof PgSelectStep) {
            // Mostly so `clientMutationId` works!
            arg.apply($pgSelect);
          } else {
            throw new Error(`Could not determine PgSelectStep for ${$result}`);
          }
        }
      }
    },
    jsonIdentityMutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_json_identity_mutation(args, ["input"]);
        const $result = resource_json_identity_mutationPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input(_, $object, arg) {
          // We might have any number of step types here; we need
          // to get back to the underlying pgSelect.
          const $result = $object.getStepForKey("result");
          const $parent = "getParentStep" in $result ? $result.getParentStep() : $result;
          const $pgSelect = "getClassStep" in $parent ? $parent.getClassStep() : $parent;
          if ($pgSelect instanceof PgSelectStep) {
            // Mostly so `clientMutationId` works!
            arg.apply($pgSelect);
          } else {
            throw new Error(`Could not determine PgSelectStep for ${$result}`);
          }
        }
      }
    },
    jsonbIdentityMutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_jsonb_identity_mutation(args, ["input"]);
        const $result = resource_jsonb_identity_mutationPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input(_, $object, arg) {
          // We might have any number of step types here; we need
          // to get back to the underlying pgSelect.
          const $result = $object.getStepForKey("result");
          const $parent = "getParentStep" in $result ? $result.getParentStep() : $result;
          const $pgSelect = "getClassStep" in $parent ? $parent.getClassStep() : $parent;
          if ($pgSelect instanceof PgSelectStep) {
            // Mostly so `clientMutationId` works!
            arg.apply($pgSelect);
          } else {
            throw new Error(`Could not determine PgSelectStep for ${$result}`);
          }
        }
      }
    },
    jsonbIdentityMutationPlpgsql: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_jsonb_identity_mutation_plpgsql(args, ["input"]);
        const $result = resource_jsonb_identity_mutation_plpgsqlPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input(_, $object, arg) {
          // We might have any number of step types here; we need
          // to get back to the underlying pgSelect.
          const $result = $object.getStepForKey("result");
          const $parent = "getParentStep" in $result ? $result.getParentStep() : $result;
          const $pgSelect = "getClassStep" in $parent ? $parent.getClassStep() : $parent;
          if ($pgSelect instanceof PgSelectStep) {
            // Mostly so `clientMutationId` works!
            arg.apply($pgSelect);
          } else {
            throw new Error(`Could not determine PgSelectStep for ${$result}`);
          }
        }
      }
    },
    jsonbIdentityMutationPlpgsqlWithDefault: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_jsonb_identity_mutation_plpgsql_with_default(args, ["input"]);
        const $result = resource_jsonb_identity_mutation_plpgsql_with_defaultPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input(_, $object, arg) {
          // We might have any number of step types here; we need
          // to get back to the underlying pgSelect.
          const $result = $object.getStepForKey("result");
          const $parent = "getParentStep" in $result ? $result.getParentStep() : $result;
          const $pgSelect = "getClassStep" in $parent ? $parent.getClassStep() : $parent;
          if ($pgSelect instanceof PgSelectStep) {
            // Mostly so `clientMutationId` works!
            arg.apply($pgSelect);
          } else {
            throw new Error(`Could not determine PgSelectStep for ${$result}`);
          }
        }
      }
    },
    mutationInInout: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_mutation_in_inout(args, ["input"]);
        const $result = resource_mutation_in_inoutPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input(_, $object, arg) {
          // We might have any number of step types here; we need
          // to get back to the underlying pgSelect.
          const $result = $object.getStepForKey("result");
          const $parent = "getParentStep" in $result ? $result.getParentStep() : $result;
          const $pgSelect = "getClassStep" in $parent ? $parent.getClassStep() : $parent;
          if ($pgSelect instanceof PgSelectStep) {
            // Mostly so `clientMutationId` works!
            arg.apply($pgSelect);
          } else {
            throw new Error(`Could not determine PgSelectStep for ${$result}`);
          }
        }
      }
    },
    mutationOutOut: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_person_computed_out(args, ["input"]);
        const $result = resource_mutation_out_outPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input(_, $object, arg) {
          // We might have any number of step types here; we need
          // to get back to the underlying pgSelect.
          const $result = $object.getStepForKey("result");
          const $parent = "getParentStep" in $result ? $result.getParentStep() : $result;
          const $pgSelect = "getClassStep" in $parent ? $parent.getClassStep() : $parent;
          if ($pgSelect instanceof PgSelectStep) {
            // Mostly so `clientMutationId` works!
            arg.apply($pgSelect);
          } else {
            throw new Error(`Could not determine PgSelectStep for ${$result}`);
          }
        }
      }
    },
    mutationOutOutSetof: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_person_computed_out(args, ["input"]);
        const $result = resource_mutation_out_out_setofPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input(_, $object, arg) {
          // We might have any number of step types here; we need
          // to get back to the underlying pgSelect.
          const $result = $object.getStepForKey("result");
          const $parent = "getParentStep" in $result ? $result.getParentStep() : $result;
          const $pgSelect = "getClassStep" in $parent ? $parent.getClassStep() : $parent;
          if ($pgSelect instanceof PgSelectStep) {
            // Mostly so `clientMutationId` works!
            arg.apply($pgSelect);
          } else {
            throw new Error(`Could not determine PgSelectStep for ${$result}`);
          }
        }
      }
    },
    mutationOutOutUnnamed: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_person_computed_out(args, ["input"]);
        const $result = resource_mutation_out_out_unnamedPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input(_, $object, arg) {
          // We might have any number of step types here; we need
          // to get back to the underlying pgSelect.
          const $result = $object.getStepForKey("result");
          const $parent = "getParentStep" in $result ? $result.getParentStep() : $result;
          const $pgSelect = "getClassStep" in $parent ? $parent.getClassStep() : $parent;
          if ($pgSelect instanceof PgSelectStep) {
            // Mostly so `clientMutationId` works!
            arg.apply($pgSelect);
          } else {
            throw new Error(`Could not determine PgSelectStep for ${$result}`);
          }
        }
      }
    },
    intSetMutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_int_set_mutation(args, ["input"]);
        const $result = resource_int_set_mutationPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input(_, $object, arg) {
          // We might have any number of step types here; we need
          // to get back to the underlying pgSelect.
          const $result = $object.getStepForKey("result");
          const $parent = "getParentStep" in $result ? $result.getParentStep() : $result;
          const $pgSelect = "getClassStep" in $parent ? $parent.getClassStep() : $parent;
          if ($pgSelect instanceof PgSelectStep) {
            // Mostly so `clientMutationId` works!
            arg.apply($pgSelect);
          } else {
            throw new Error(`Could not determine PgSelectStep for ${$result}`);
          }
        }
      }
    },
    mutationOutUnnamedOutOutUnnamed: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_person_computed_out(args, ["input"]);
        const $result = resource_mutation_out_unnamed_out_out_unnamedPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input(_, $object, arg) {
          // We might have any number of step types here; we need
          // to get back to the underlying pgSelect.
          const $result = $object.getStepForKey("result");
          const $parent = "getParentStep" in $result ? $result.getParentStep() : $result;
          const $pgSelect = "getClassStep" in $parent ? $parent.getClassStep() : $parent;
          if ($pgSelect instanceof PgSelectStep) {
            // Mostly so `clientMutationId` works!
            arg.apply($pgSelect);
          } else {
            throw new Error(`Could not determine PgSelectStep for ${$result}`);
          }
        }
      }
    },
    mutationReturnsTableMultiCol: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_mutation_returns_table_multi_col(args, ["input"]);
        const $result = resource_mutation_returns_table_multi_colPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input(_, $object, arg) {
          // We might have any number of step types here; we need
          // to get back to the underlying pgSelect.
          const $result = $object.getStepForKey("result");
          const $parent = "getParentStep" in $result ? $result.getParentStep() : $result;
          const $pgSelect = "getClassStep" in $parent ? $parent.getClassStep() : $parent;
          if ($pgSelect instanceof PgSelectStep) {
            // Mostly so `clientMutationId` works!
            arg.apply($pgSelect);
          } else {
            throw new Error(`Could not determine PgSelectStep for ${$result}`);
          }
        }
      }
    },
    leftArmIdentity: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_left_arm_identity(args, ["input"]);
        const $result = resource_left_arm_identityPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input(_, $object, arg) {
          // We might have any number of step types here; we need
          // to get back to the underlying pgSelect.
          const $result = $object.getStepForKey("result");
          const $parent = "getParentStep" in $result ? $result.getParentStep() : $result;
          const $pgSelect = "getClassStep" in $parent ? $parent.getClassStep() : $parent;
          if ($pgSelect instanceof PgSelectStep) {
            // Mostly so `clientMutationId` works!
            arg.apply($pgSelect);
          } else {
            throw new Error(`Could not determine PgSelectStep for ${$result}`);
          }
        }
      }
    },
    issue756Mutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_person_computed_out(args, ["input"]);
        const $result = resource_issue756_mutationPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input(_, $object, arg) {
          // We might have any number of step types here; we need
          // to get back to the underlying pgSelect.
          const $result = $object.getStepForKey("result");
          const $parent = "getParentStep" in $result ? $result.getParentStep() : $result;
          const $pgSelect = "getClassStep" in $parent ? $parent.getClassStep() : $parent;
          if ($pgSelect instanceof PgSelectStep) {
            // Mostly so `clientMutationId` works!
            arg.apply($pgSelect);
          } else {
            throw new Error(`Could not determine PgSelectStep for ${$result}`);
          }
        }
      }
    },
    issue756SetMutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_person_computed_out(args, ["input"]);
        const $result = resource_issue756_set_mutationPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input(_, $object, arg) {
          // We might have any number of step types here; we need
          // to get back to the underlying pgSelect.
          const $result = $object.getStepForKey("result");
          const $parent = "getParentStep" in $result ? $result.getParentStep() : $result;
          const $pgSelect = "getClassStep" in $parent ? $parent.getClassStep() : $parent;
          if ($pgSelect instanceof PgSelectStep) {
            // Mostly so `clientMutationId` works!
            arg.apply($pgSelect);
          } else {
            throw new Error(`Could not determine PgSelectStep for ${$result}`);
          }
        }
      }
    },
    typesMutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_types_mutation(args, ["input"]);
        const $result = resource_types_mutationPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input(_, $object, arg) {
          // We might have any number of step types here; we need
          // to get back to the underlying pgSelect.
          const $result = $object.getStepForKey("result");
          const $parent = "getParentStep" in $result ? $result.getParentStep() : $result;
          const $pgSelect = "getClassStep" in $parent ? $parent.getClassStep() : $parent;
          if ($pgSelect instanceof PgSelectStep) {
            // Mostly so `clientMutationId` works!
            arg.apply($pgSelect);
          } else {
            throw new Error(`Could not determine PgSelectStep for ${$result}`);
          }
        }
      }
    },
    mutationOutOutCompoundType: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_mutation_out_out_compound_type(args, ["input"]);
        const $result = resource_mutation_out_out_compound_typePgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input(_, $object, arg) {
          // We might have any number of step types here; we need
          // to get back to the underlying pgSelect.
          const $result = $object.getStepForKey("result");
          const $parent = "getParentStep" in $result ? $result.getParentStep() : $result;
          const $pgSelect = "getClassStep" in $parent ? $parent.getClassStep() : $parent;
          if ($pgSelect instanceof PgSelectStep) {
            // Mostly so `clientMutationId` works!
            arg.apply($pgSelect);
          } else {
            throw new Error(`Could not determine PgSelectStep for ${$result}`);
          }
        }
      }
    },
    tableMutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_table_mutation(args, ["input"]);
        const $result = resource_table_mutationPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input(_, $object, arg) {
          // We might have any number of step types here; we need
          // to get back to the underlying pgSelect.
          const $result = $object.getStepForKey("result");
          const $parent = "getParentStep" in $result ? $result.getParentStep() : $result;
          const $pgSelect = "getClassStep" in $parent ? $parent.getClassStep() : $parent;
          if ($pgSelect instanceof PgSelectStep) {
            // Mostly so `clientMutationId` works!
            arg.apply($pgSelect);
          } else {
            throw new Error(`Could not determine PgSelectStep for ${$result}`);
          }
        }
      }
    },
    listOfCompoundTypesMutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_list_of_compound_types_mutation(args, ["input"]);
        const $result = resource_list_of_compound_types_mutationPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input(_, $object, arg) {
          // We might have any number of step types here; we need
          // to get back to the underlying pgSelect.
          const $result = $object.getStepForKey("result");
          const $parent = "getParentStep" in $result ? $result.getParentStep() : $result;
          const $pgSelect = "getClassStep" in $parent ? $parent.getClassStep() : $parent;
          if ($pgSelect instanceof PgSelectStep) {
            // Mostly so `clientMutationId` works!
            arg.apply($pgSelect);
          } else {
            throw new Error(`Could not determine PgSelectStep for ${$result}`);
          }
        }
      }
    },
    mutationOutComplex: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_mutation_out_complex(args, ["input"]);
        const $result = resource_mutation_out_complexPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input(_, $object, arg) {
          // We might have any number of step types here; we need
          // to get back to the underlying pgSelect.
          const $result = $object.getStepForKey("result");
          const $parent = "getParentStep" in $result ? $result.getParentStep() : $result;
          const $pgSelect = "getClassStep" in $parent ? $parent.getClassStep() : $parent;
          if ($pgSelect instanceof PgSelectStep) {
            // Mostly so `clientMutationId` works!
            arg.apply($pgSelect);
          } else {
            throw new Error(`Could not determine PgSelectStep for ${$result}`);
          }
        }
      }
    },
    mutationOutComplexSetof: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_mutation_out_complex_setof(args, ["input"]);
        const $result = resource_mutation_out_complex_setofPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input(_, $object, arg) {
          // We might have any number of step types here; we need
          // to get back to the underlying pgSelect.
          const $result = $object.getStepForKey("result");
          const $parent = "getParentStep" in $result ? $result.getParentStep() : $result;
          const $pgSelect = "getClassStep" in $parent ? $parent.getClassStep() : $parent;
          if ($pgSelect instanceof PgSelectStep) {
            // Mostly so `clientMutationId` works!
            arg.apply($pgSelect);
          } else {
            throw new Error(`Could not determine PgSelectStep for ${$result}`);
          }
        }
      }
    },
    mutationOutTable: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_person_computed_out(args, ["input"]);
        const $result = resource_mutation_out_tablePgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input(_, $object, arg) {
          // We might have any number of step types here; we need
          // to get back to the underlying pgSelect.
          const $result = $object.getStepForKey("result");
          const $parent = "getParentStep" in $result ? $result.getParentStep() : $result;
          const $pgSelect = "getClassStep" in $parent ? $parent.getClassStep() : $parent;
          if ($pgSelect instanceof PgSelectStep) {
            // Mostly so `clientMutationId` works!
            arg.apply($pgSelect);
          } else {
            throw new Error(`Could not determine PgSelectStep for ${$result}`);
          }
        }
      }
    },
    mutationOutTableSetof: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_person_computed_out(args, ["input"]);
        const $result = resource_mutation_out_table_setofPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input(_, $object, arg) {
          // We might have any number of step types here; we need
          // to get back to the underlying pgSelect.
          const $result = $object.getStepForKey("result");
          const $parent = "getParentStep" in $result ? $result.getParentStep() : $result;
          const $pgSelect = "getClassStep" in $parent ? $parent.getClassStep() : $parent;
          if ($pgSelect instanceof PgSelectStep) {
            // Mostly so `clientMutationId` works!
            arg.apply($pgSelect);
          } else {
            throw new Error(`Could not determine PgSelectStep for ${$result}`);
          }
        }
      }
    },
    tableSetMutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_person_computed_out(args, ["input"]);
        const $result = resource_table_set_mutationPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input(_, $object, arg) {
          // We might have any number of step types here; we need
          // to get back to the underlying pgSelect.
          const $result = $object.getStepForKey("result");
          const $parent = "getParentStep" in $result ? $result.getParentStep() : $result;
          const $pgSelect = "getClassStep" in $parent ? $parent.getClassStep() : $parent;
          if ($pgSelect instanceof PgSelectStep) {
            // Mostly so `clientMutationId` works!
            arg.apply($pgSelect);
          } else {
            throw new Error(`Could not determine PgSelectStep for ${$result}`);
          }
        }
      }
    },
    createMyTable: {
      plan(_, args) {
        const $insert = pgInsertSingle(resource_my_tablePgResource, Object.create(null));
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
    createPersonSecret: {
      plan(_, args) {
        const $insert = pgInsertSingle(resource_person_secretPgResource, Object.create(null));
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
    createCompoundKey: {
      plan(_, args) {
        const $insert = pgInsertSingle(resource_compound_keyPgResource, Object.create(null));
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
    createNullTestRecord: {
      plan(_, args) {
        const $insert = pgInsertSingle(resource_null_test_recordPgResource, Object.create(null));
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
    createEdgeCase: {
      plan(_, args) {
        const $insert = pgInsertSingle(resource_edge_casePgResource, Object.create(null));
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
    createLeftArm: {
      plan(_, args) {
        const $insert = pgInsertSingle(resource_left_armPgResource, Object.create(null));
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
    createIssue756: {
      plan(_, args) {
        const $insert = pgInsertSingle(resource_issue756PgResource, Object.create(null));
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
    createPerson: {
      plan(_, args) {
        const $insert = pgInsertSingle(resource_personPgResource, Object.create(null));
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
    updateMyTable: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(resource_my_tablePgResource, specFromArgs_MyTable(args));
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
    updateMyTableById: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(resource_my_tablePgResource, {
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
    updatePersonSecret: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(resource_person_secretPgResource, specFromArgs_PersonSecret(args));
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
    updatePersonSecretByPersonId: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(resource_person_secretPgResource, {
          person_id: args.getRaw(['input', "personId"])
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
    updateCompoundKey: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(resource_compound_keyPgResource, specFromArgs_CompoundKey(args));
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
    updateCompoundKeyByPersonId1AndPersonId2: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(resource_compound_keyPgResource, {
          person_id_1: args.getRaw(['input', "personId1"]),
          person_id_2: args.getRaw(['input', "personId2"])
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
    updateNullTestRecord: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(resource_null_test_recordPgResource, specFromArgs_NullTestRecord(args));
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
    updateNullTestRecordById: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(resource_null_test_recordPgResource, {
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
    updateLeftArm: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(resource_left_armPgResource, specFromArgs_LeftArm(args));
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
    updateLeftArmById: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(resource_left_armPgResource, {
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
    updateLeftArmByPersonId: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(resource_left_armPgResource, {
          person_id: args.getRaw(['input', "personId"])
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
    updateIssue756: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(resource_issue756PgResource, specFromArgs_Issue756(args));
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
    updateIssue756ById: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(resource_issue756PgResource, {
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
    updatePerson: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(resource_personPgResource, specFromArgs_Person(args));
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
    updatePersonById: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(resource_personPgResource, {
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
    updatePersonByEmail: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(resource_personPgResource, {
          email: args.getRaw(['input', "email"])
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
    deleteMyTable: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(resource_my_tablePgResource, specFromArgs_MyTable2(args));
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
    deleteMyTableById: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(resource_my_tablePgResource, {
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
    deletePersonSecret: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(resource_person_secretPgResource, specFromArgs_PersonSecret2(args));
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
    deletePersonSecretByPersonId: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(resource_person_secretPgResource, {
          person_id: args.getRaw(['input', "personId"])
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
    deleteCompoundKey: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(resource_compound_keyPgResource, specFromArgs_CompoundKey2(args));
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
    deleteCompoundKeyByPersonId1AndPersonId2: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(resource_compound_keyPgResource, {
          person_id_1: args.getRaw(['input', "personId1"]),
          person_id_2: args.getRaw(['input', "personId2"])
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
    deleteNullTestRecord: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(resource_null_test_recordPgResource, specFromArgs_NullTestRecord2(args));
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
    deleteNullTestRecordById: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(resource_null_test_recordPgResource, {
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
    deleteLeftArm: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(resource_left_armPgResource, specFromArgs_LeftArm2(args));
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
    deleteLeftArmById: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(resource_left_armPgResource, {
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
    deleteLeftArmByPersonId: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(resource_left_armPgResource, {
          person_id: args.getRaw(['input', "personId"])
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
    deleteIssue756: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(resource_issue756PgResource, specFromArgs_Issue7562(args));
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
    deleteIssue756ById: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(resource_issue756PgResource, {
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
    deletePerson: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(resource_personPgResource, specFromArgs_Person2(args));
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
    deletePersonById: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(resource_personPgResource, {
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
    deletePersonByEmail: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(resource_personPgResource, {
          email: args.getRaw(['input', "email"])
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
  MutationOutPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      const $result = $object.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    o($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  MutationOutInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  MutationOutSetofPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      const $result = $object.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    os($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  MutationOutSetofInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  MutationOutUnnamedPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      const $result = $object.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    integer($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  MutationOutUnnamedInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  NoArgsMutationPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      const $result = $object.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    integer($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  NoArgsMutationInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  MutationInOutPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      const $result = $object.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    o($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  MutationInOutInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  MutationReturnsTableOneColPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      const $result = $object.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    col1S($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  MutationReturnsTableOneColInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  JsonIdentityMutationPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      const $result = $object.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    json($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  JsonIdentityMutationInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  JsonbIdentityMutationPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      const $result = $object.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    json($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  JsonbIdentityMutationInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  JsonbIdentityMutationPlpgsqlPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      const $result = $object.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    json($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  JsonbIdentityMutationPlpgsqlInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  JsonbIdentityMutationPlpgsqlWithDefaultPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      const $result = $object.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    json($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  JsonbIdentityMutationPlpgsqlWithDefaultInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  MutationInInoutPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      const $result = $object.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    ino($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  MutationInInoutInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  MutationOutOutPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      const $result = $object.getStepForKey("result");
      return $result.getMeta("clientMutationId");
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
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  MutationOutOutSetofPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      const $result = $object.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    results($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  MutationOutOutSetofRecord: {
    __assertStep: assertPgClassSingleStep
  },
  MutationOutOutSetofInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  MutationOutOutUnnamedPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      const $result = $object.getStepForKey("result");
      return $result.getMeta("clientMutationId");
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
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  IntSetMutationPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      const $result = $object.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    integers($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  IntSetMutationInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  MutationOutUnnamedOutOutUnnamedPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      const $result = $object.getStepForKey("result");
      return $result.getMeta("clientMutationId");
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
    arg3($record) {
      return $record.get("column3");
    }
  },
  MutationOutUnnamedOutOutUnnamedInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  MutationReturnsTableMultiColPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      const $result = $object.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    results($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  MutationReturnsTableMultiColRecord: {
    __assertStep: assertPgClassSingleStep
  },
  MutationReturnsTableMultiColInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  LeftArmIdentityPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      const $result = $object.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    leftArm($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    leftArmEdge($mutation, fieldArgs) {
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
          return resource_left_armPgResource.find(spec);
        }
      })();
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    },
    personByPersonId($record) {
      return resource_personPgResource.get({
        id: $record.get("result").get("person_id")
      });
    }
  },
  LeftArmIdentityInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  LeftArmBaseInput: {
    __baked: createObjectAndApplyChildren,
    id(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    personId(obj, val, {
      field,
      schema
    }) {
      obj.set("person_id", bakedInputRuntime(schema, field.type, val));
    },
    lengthInMetres(obj, val, {
      field,
      schema
    }) {
      obj.set("length_in_metres", bakedInputRuntime(schema, field.type, val));
    },
    mood(obj, val, {
      field,
      schema
    }) {
      obj.set("mood", bakedInputRuntime(schema, field.type, val));
    }
  },
  Issue756MutationPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      const $result = $object.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    issue756($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    issue756Edge($mutation, fieldArgs) {
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
          return resource_issue756PgResource.find(spec);
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
  Issue756MutationInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  Issue756SetMutationPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      const $result = $object.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    issue756S($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  Issue756SetMutationInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  TypesMutationPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      const $result = $object.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    boolean($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  TypesMutationInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  MutationOutOutCompoundTypePayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      const $result = $object.getStepForKey("result");
      return $result.getMeta("clientMutationId");
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
    o2($record) {
      const $plan = $record.get("o2");
      const $select = pgSelectSingleFromRecord(resource_frmcdc_compoundTypePgResource, $plan);
      $select.getClassStep().setTrusted();
      return $select;
    }
  },
  MutationOutOutCompoundTypeInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  TableMutationPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      const $result = $object.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    post($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  TableMutationInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  ListOfCompoundTypesMutationPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      const $result = $object.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    compoundTypes($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  ListOfCompoundTypesMutationInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  CompoundTypeInput: {
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
  MutationOutComplexPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      const $result = $object.getStepForKey("result");
      return $result.getMeta("clientMutationId");
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
    y($record) {
      const $plan = $record.get("y");
      const $select = pgSelectSingleFromRecord(resource_frmcdc_compoundTypePgResource, $plan);
      $select.getClassStep().setTrusted();
      return $select;
    },
    z($record) {
      const $plan = $record.get("z");
      const $select = pgSelectSingleFromRecord(resource_personPgResource, $plan);
      $select.getClassStep().setTrusted();
      return $select;
    }
  },
  MutationOutComplexInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  MutationOutComplexSetofPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      const $result = $object.getStepForKey("result");
      return $result.getMeta("clientMutationId");
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
    y($record) {
      const $plan = $record.get("y");
      const $select = pgSelectSingleFromRecord(resource_frmcdc_compoundTypePgResource, $plan);
      $select.getClassStep().setTrusted();
      return $select;
    },
    z($record) {
      const $plan = $record.get("z");
      const $select = pgSelectSingleFromRecord(resource_personPgResource, $plan);
      $select.getClassStep().setTrusted();
      return $select;
    }
  },
  MutationOutComplexSetofInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  MutationOutTablePayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      const $result = $object.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    person($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    personEdge($mutation, fieldArgs) {
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
          return resource_personPgResource.find(spec);
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
  MutationOutTableInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  MutationOutTableSetofPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      const $result = $object.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    people($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  MutationOutTableSetofInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  TableSetMutationPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      const $result = $object.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    people($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  TableSetMutationInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  CreateMyTablePayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    myTable($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    myTableEdge($mutation, fieldArgs) {
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
          return resource_my_tablePgResource.find(spec);
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
  CreateMyTableInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    myTable(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  MyTableInput: {
    __baked: createObjectAndApplyChildren,
    id(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    jsonData(obj, val, {
      field,
      schema
    }) {
      obj.set("json_data", bakedInputRuntime(schema, field.type, val));
    }
  },
  CreatePersonSecretPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    personSecret($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    personSecretEdge($mutation, fieldArgs) {
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
          return resource_person_secretPgResource.find(spec);
        }
      })();
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    },
    personByPersonId($record) {
      return resource_personPgResource.get({
        id: $record.get("result").get("person_id")
      });
    }
  },
  CreatePersonSecretInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    personSecret(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  PersonSecretInput: {
    __baked: createObjectAndApplyChildren,
    personId(obj, val, {
      field,
      schema
    }) {
      obj.set("person_id", bakedInputRuntime(schema, field.type, val));
    },
    secret(obj, val, {
      field,
      schema
    }) {
      obj.set("sekrit", bakedInputRuntime(schema, field.type, val));
    }
  },
  CreateCompoundKeyPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    compoundKey($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    compoundKeyEdge($mutation, fieldArgs) {
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
          return resource_compound_keyPgResource.find(spec);
        }
      })();
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    },
    personByPersonId1($record) {
      return resource_personPgResource.get({
        id: $record.get("result").get("person_id_1")
      });
    },
    personByPersonId2($record) {
      return resource_personPgResource.get({
        id: $record.get("result").get("person_id_2")
      });
    }
  },
  CreateCompoundKeyInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    compoundKey(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  CompoundKeyInput: {
    __baked: createObjectAndApplyChildren,
    personId2(obj, val, {
      field,
      schema
    }) {
      obj.set("person_id_2", bakedInputRuntime(schema, field.type, val));
    },
    personId1(obj, val, {
      field,
      schema
    }) {
      obj.set("person_id_1", bakedInputRuntime(schema, field.type, val));
    },
    extra(obj, val, {
      field,
      schema
    }) {
      obj.set("extra", bakedInputRuntime(schema, field.type, val));
    }
  },
  CreateNullTestRecordPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    nullTestRecord($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    nullTestRecordEdge($mutation, fieldArgs) {
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
          return resource_null_test_recordPgResource.find(spec);
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
  CreateNullTestRecordInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    nullTestRecord(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  NullTestRecordInput: {
    __baked: createObjectAndApplyChildren,
    id(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    nullableText(obj, val, {
      field,
      schema
    }) {
      obj.set("nullable_text", bakedInputRuntime(schema, field.type, val));
    },
    nullableInt(obj, val, {
      field,
      schema
    }) {
      obj.set("nullable_int", bakedInputRuntime(schema, field.type, val));
    },
    nonNullText(obj, val, {
      field,
      schema
    }) {
      obj.set("non_null_text", bakedInputRuntime(schema, field.type, val));
    }
  },
  CreateEdgeCasePayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    edgeCase($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  CreateEdgeCaseInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    edgeCase(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  EdgeCaseInput: {
    __baked: createObjectAndApplyChildren,
    notNullHasDefault(obj, val, {
      field,
      schema
    }) {
      obj.set("not_null_has_default", bakedInputRuntime(schema, field.type, val));
    },
    wontCastEasy(obj, val, {
      field,
      schema
    }) {
      obj.set("wont_cast_easy", bakedInputRuntime(schema, field.type, val));
    },
    rowId(obj, val, {
      field,
      schema
    }) {
      obj.set("row_id", bakedInputRuntime(schema, field.type, val));
    }
  },
  CreateLeftArmPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    leftArm($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    leftArmEdge($mutation, fieldArgs) {
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
          return resource_left_armPgResource.find(spec);
        }
      })();
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    },
    personByPersonId($record) {
      return resource_personPgResource.get({
        id: $record.get("result").get("person_id")
      });
    }
  },
  CreateLeftArmInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    leftArm(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  LeftArmInput: {
    __baked: createObjectAndApplyChildren,
    id(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    personId(obj, val, {
      field,
      schema
    }) {
      obj.set("person_id", bakedInputRuntime(schema, field.type, val));
    },
    lengthInMetres(obj, val, {
      field,
      schema
    }) {
      obj.set("length_in_metres", bakedInputRuntime(schema, field.type, val));
    },
    mood(obj, val, {
      field,
      schema
    }) {
      obj.set("mood", bakedInputRuntime(schema, field.type, val));
    }
  },
  CreateIssue756Payload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    issue756($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    issue756Edge($mutation, fieldArgs) {
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
          return resource_issue756PgResource.find(spec);
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
  CreateIssue756Input: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    issue756(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  Issue756Input: {
    __baked: createObjectAndApplyChildren,
    id(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    ts(obj, val, {
      field,
      schema
    }) {
      obj.set("ts", bakedInputRuntime(schema, field.type, val));
    }
  },
  CreatePersonPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    person($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    personEdge($mutation, fieldArgs) {
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
          return resource_personPgResource.find(spec);
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
  CreatePersonInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    person(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  PersonInput: {
    __baked: createObjectAndApplyChildren,
    id(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    name(obj, val, {
      field,
      schema
    }) {
      obj.set("person_full_name", bakedInputRuntime(schema, field.type, val));
    },
    aliases(obj, val, {
      field,
      schema
    }) {
      obj.set("aliases", bakedInputRuntime(schema, field.type, val));
    },
    about(obj, val, {
      field,
      schema
    }) {
      obj.set("about", bakedInputRuntime(schema, field.type, val));
    },
    email(obj, val, {
      field,
      schema
    }) {
      obj.set("email", bakedInputRuntime(schema, field.type, val));
    },
    site(obj, val, {
      field,
      schema
    }) {
      obj.set("site", bakedInputRuntime(schema, field.type, val));
    },
    config(obj, val, {
      field,
      schema
    }) {
      obj.set("config", bakedInputRuntime(schema, field.type, val));
    },
    lastLoginFromIp(obj, val, {
      field,
      schema
    }) {
      obj.set("last_login_from_ip", bakedInputRuntime(schema, field.type, val));
    },
    lastLoginFromSubnet(obj, val, {
      field,
      schema
    }) {
      obj.set("last_login_from_subnet", bakedInputRuntime(schema, field.type, val));
    },
    userMac(obj, val, {
      field,
      schema
    }) {
      obj.set("user_mac", bakedInputRuntime(schema, field.type, val));
    },
    createdAt(obj, val, {
      field,
      schema
    }) {
      obj.set("created_at", bakedInputRuntime(schema, field.type, val));
    }
  },
  UpdateMyTablePayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    myTable($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    myTableEdge($mutation, fieldArgs) {
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
          return resource_my_tablePgResource.find(spec);
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
  UpdateMyTableInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    myTablePatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  MyTablePatch: {
    __baked: createObjectAndApplyChildren,
    id(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    jsonData(obj, val, {
      field,
      schema
    }) {
      obj.set("json_data", bakedInputRuntime(schema, field.type, val));
    }
  },
  UpdateMyTableByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    myTablePatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UpdatePersonSecretPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    personSecret($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    personSecretEdge($mutation, fieldArgs) {
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
          return resource_person_secretPgResource.find(spec);
        }
      })();
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    },
    personByPersonId($record) {
      return resource_personPgResource.get({
        id: $record.get("result").get("person_id")
      });
    }
  },
  UpdatePersonSecretInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    personSecretPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  PersonSecretPatch: {
    __baked: createObjectAndApplyChildren,
    personId(obj, val, {
      field,
      schema
    }) {
      obj.set("person_id", bakedInputRuntime(schema, field.type, val));
    },
    secret(obj, val, {
      field,
      schema
    }) {
      obj.set("sekrit", bakedInputRuntime(schema, field.type, val));
    }
  },
  UpdatePersonSecretByPersonIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    personSecretPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UpdateCompoundKeyPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    compoundKey($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    compoundKeyEdge($mutation, fieldArgs) {
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
          return resource_compound_keyPgResource.find(spec);
        }
      })();
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    },
    personByPersonId1($record) {
      return resource_personPgResource.get({
        id: $record.get("result").get("person_id_1")
      });
    },
    personByPersonId2($record) {
      return resource_personPgResource.get({
        id: $record.get("result").get("person_id_2")
      });
    }
  },
  UpdateCompoundKeyInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    compoundKeyPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  CompoundKeyPatch: {
    __baked: createObjectAndApplyChildren,
    personId2(obj, val, {
      field,
      schema
    }) {
      obj.set("person_id_2", bakedInputRuntime(schema, field.type, val));
    },
    personId1(obj, val, {
      field,
      schema
    }) {
      obj.set("person_id_1", bakedInputRuntime(schema, field.type, val));
    },
    extra(obj, val, {
      field,
      schema
    }) {
      obj.set("extra", bakedInputRuntime(schema, field.type, val));
    }
  },
  UpdateCompoundKeyByPersonId1AndPersonId2Input: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    compoundKeyPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UpdateNullTestRecordPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    nullTestRecord($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    nullTestRecordEdge($mutation, fieldArgs) {
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
          return resource_null_test_recordPgResource.find(spec);
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
  UpdateNullTestRecordInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    nullTestRecordPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  NullTestRecordPatch: {
    __baked: createObjectAndApplyChildren,
    id(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    nullableText(obj, val, {
      field,
      schema
    }) {
      obj.set("nullable_text", bakedInputRuntime(schema, field.type, val));
    },
    nullableInt(obj, val, {
      field,
      schema
    }) {
      obj.set("nullable_int", bakedInputRuntime(schema, field.type, val));
    },
    nonNullText(obj, val, {
      field,
      schema
    }) {
      obj.set("non_null_text", bakedInputRuntime(schema, field.type, val));
    }
  },
  UpdateNullTestRecordByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    nullTestRecordPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UpdateLeftArmPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    leftArm($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    leftArmEdge($mutation, fieldArgs) {
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
          return resource_left_armPgResource.find(spec);
        }
      })();
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    },
    personByPersonId($record) {
      return resource_personPgResource.get({
        id: $record.get("result").get("person_id")
      });
    }
  },
  UpdateLeftArmInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    leftArmPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  LeftArmPatch: {
    __baked: createObjectAndApplyChildren,
    id(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    personId(obj, val, {
      field,
      schema
    }) {
      obj.set("person_id", bakedInputRuntime(schema, field.type, val));
    },
    lengthInMetres(obj, val, {
      field,
      schema
    }) {
      obj.set("length_in_metres", bakedInputRuntime(schema, field.type, val));
    },
    mood(obj, val, {
      field,
      schema
    }) {
      obj.set("mood", bakedInputRuntime(schema, field.type, val));
    }
  },
  UpdateLeftArmByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    leftArmPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UpdateLeftArmByPersonIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    leftArmPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UpdateIssue756Payload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    issue756($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    issue756Edge($mutation, fieldArgs) {
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
          return resource_issue756PgResource.find(spec);
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
  UpdateIssue756Input: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    issue756Patch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  Issue756Patch: {
    __baked: createObjectAndApplyChildren,
    id(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    ts(obj, val, {
      field,
      schema
    }) {
      obj.set("ts", bakedInputRuntime(schema, field.type, val));
    }
  },
  UpdateIssue756ByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    issue756Patch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UpdatePersonPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    person($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    personEdge($mutation, fieldArgs) {
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
          return resource_personPgResource.find(spec);
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
  UpdatePersonInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    personPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  PersonPatch: {
    __baked: createObjectAndApplyChildren,
    id(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    name(obj, val, {
      field,
      schema
    }) {
      obj.set("person_full_name", bakedInputRuntime(schema, field.type, val));
    },
    aliases(obj, val, {
      field,
      schema
    }) {
      obj.set("aliases", bakedInputRuntime(schema, field.type, val));
    },
    about(obj, val, {
      field,
      schema
    }) {
      obj.set("about", bakedInputRuntime(schema, field.type, val));
    },
    email(obj, val, {
      field,
      schema
    }) {
      obj.set("email", bakedInputRuntime(schema, field.type, val));
    },
    site(obj, val, {
      field,
      schema
    }) {
      obj.set("site", bakedInputRuntime(schema, field.type, val));
    },
    config(obj, val, {
      field,
      schema
    }) {
      obj.set("config", bakedInputRuntime(schema, field.type, val));
    },
    lastLoginFromIp(obj, val, {
      field,
      schema
    }) {
      obj.set("last_login_from_ip", bakedInputRuntime(schema, field.type, val));
    },
    lastLoginFromSubnet(obj, val, {
      field,
      schema
    }) {
      obj.set("last_login_from_subnet", bakedInputRuntime(schema, field.type, val));
    },
    userMac(obj, val, {
      field,
      schema
    }) {
      obj.set("user_mac", bakedInputRuntime(schema, field.type, val));
    },
    createdAt(obj, val, {
      field,
      schema
    }) {
      obj.set("created_at", bakedInputRuntime(schema, field.type, val));
    }
  },
  UpdatePersonByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    personPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UpdatePersonByEmailInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    personPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  DeleteMyTablePayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    myTable($object) {
      return $object.get("result");
    },
    deletedMyTableId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandler_MyTable.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    myTableEdge($mutation, fieldArgs) {
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
          return resource_my_tablePgResource.find(spec);
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
  DeleteMyTableInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteMyTableByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeletePersonSecretPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    personSecret($object) {
      return $object.get("result");
    },
    deletedPersonSecretId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandler_PersonSecret.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    personSecretEdge($mutation, fieldArgs) {
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
          return resource_person_secretPgResource.find(spec);
        }
      })();
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    },
    personByPersonId($record) {
      return resource_personPgResource.get({
        id: $record.get("result").get("person_id")
      });
    }
  },
  DeletePersonSecretInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeletePersonSecretByPersonIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteCompoundKeyPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    compoundKey($object) {
      return $object.get("result");
    },
    deletedCompoundKeyId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandler_CompoundKey.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    compoundKeyEdge($mutation, fieldArgs) {
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
          return resource_compound_keyPgResource.find(spec);
        }
      })();
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    },
    personByPersonId1($record) {
      return resource_personPgResource.get({
        id: $record.get("result").get("person_id_1")
      });
    },
    personByPersonId2($record) {
      return resource_personPgResource.get({
        id: $record.get("result").get("person_id_2")
      });
    }
  },
  DeleteCompoundKeyInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteCompoundKeyByPersonId1AndPersonId2Input: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteNullTestRecordPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    nullTestRecord($object) {
      return $object.get("result");
    },
    deletedNullTestRecordId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandler_NullTestRecord.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    nullTestRecordEdge($mutation, fieldArgs) {
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
          return resource_null_test_recordPgResource.find(spec);
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
  DeleteNullTestRecordInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteNullTestRecordByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteLeftArmPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    leftArm($object) {
      return $object.get("result");
    },
    deletedLeftArmId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandler_LeftArm.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    leftArmEdge($mutation, fieldArgs) {
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
          return resource_left_armPgResource.find(spec);
        }
      })();
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    },
    personByPersonId($record) {
      return resource_personPgResource.get({
        id: $record.get("result").get("person_id")
      });
    }
  },
  DeleteLeftArmInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteLeftArmByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteLeftArmByPersonIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteIssue756Payload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    issue756($object) {
      return $object.get("result");
    },
    deletedIssue756Id($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandler_Issue756.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    issue756Edge($mutation, fieldArgs) {
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
          return resource_issue756PgResource.find(spec);
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
  DeleteIssue756Input: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteIssue756ByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeletePersonPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    person($object) {
      return $object.get("result");
    },
    deletedPersonId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandler_Person.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    personEdge($mutation, fieldArgs) {
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
          return resource_personPgResource.find(spec);
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
  DeletePersonInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeletePersonByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeletePersonByEmailInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  }
};
export const schema = makeGrafastSchema({
  typeDefs: typeDefs,
  plans: plans
});
