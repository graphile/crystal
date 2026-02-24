import { LIST_TYPES, PgExecutor, PgResource, PgSelectSingleStep, PgSelectStep, TYPES, assertPgClassSingleStep, domainOfCodec, enumCodec, listOfCodec, makeRegistry, pgClassExpression, pgDeleteSingle, pgFromExpression, pgInsertSingle, pgSelectFromRecords, pgSelectSingleFromRecord, pgUpdateSingle, rangeOfCodec, recordCodec, sqlFromArgDigests, sqlValueWithCodec } from "@dataplan/pg";
import { ObjectStep, __ValueStep, access, assertStep, bakedInput, bakedInputRuntime, constant, context, createObjectAndApplyChildren, get as get2, inhibitOnNull, inspect, lambda, list, makeDecodeNodeId, makeGrafastSchema, markSyncAndSafe, object, operationPlan, rootValue, specFromNodeId, stepAMayDependOnStepB, trap } from "grafast";
import { GraphQLError, GraphQLInt, GraphQLString, Kind, valueFromASTUntyped } from "graphql";
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
const registryConfig_pgCodecs_FuncOutOutRecord_FuncOutOutRecord = recordCodec({
  name: "FuncOutOutRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: {
    __proto__: null,
    first_out: {
      codec: TYPES.int,
      extensions: {
        argIndex: 0,
        argName: "first_out"
      }
    },
    second_out: {
      codec: TYPES.text,
      extensions: {
        argIndex: 1,
        argName: "second_out"
      }
    }
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
      codec: TYPES.int,
      extensions: {
        argIndex: 0,
        argName: "o1"
      }
    },
    o2: {
      codec: TYPES.text,
      extensions: {
        argIndex: 1,
        argName: "o2"
      }
    }
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
      codec: TYPES.int,
      extensions: {
        argIndex: 0,
        argName: undefined
      }
    },
    column2: {
      codec: TYPES.text,
      extensions: {
        argIndex: 1,
        argName: undefined
      }
    }
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
      codec: TYPES.int,
      extensions: {
        argIndex: 0,
        argName: "first_out"
      }
    },
    second_out: {
      codec: TYPES.text,
      extensions: {
        argIndex: 1,
        argName: "second_out"
      }
    }
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
      codec: TYPES.int,
      extensions: {
        argIndex: 0,
        argName: "o1"
      }
    },
    o2: {
      codec: TYPES.text,
      extensions: {
        argIndex: 1,
        argName: "o2"
      }
    }
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
      codec: TYPES.int,
      extensions: {
        argIndex: 0,
        argName: undefined
      }
    },
    column2: {
      codec: TYPES.text,
      extensions: {
        argIndex: 1,
        argName: undefined
      }
    }
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
      codec: TYPES.int,
      extensions: {
        argIndex: 0,
        argName: ""
      }
    },
    o2: {
      codec: TYPES.text,
      extensions: {
        argIndex: 1,
        argName: "o2"
      }
    },
    column3: {
      codec: TYPES.int,
      extensions: {
        argIndex: 2,
        argName: ""
      }
    }
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
      codec: TYPES.int,
      extensions: {
        argIndex: 0,
        argName: ""
      }
    },
    o2: {
      codec: TYPES.text,
      extensions: {
        argIndex: 1,
        argName: "o2"
      }
    },
    column3: {
      codec: TYPES.int,
      extensions: {
        argIndex: 2,
        argName: ""
      }
    }
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
      codec: TYPES.int,
      extensions: {
        argIndex: 1,
        argName: "col1"
      }
    },
    col2: {
      codec: TYPES.text,
      extensions: {
        argIndex: 2,
        argName: "col2"
      }
    }
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
      codec: TYPES.int,
      extensions: {
        argIndex: 3,
        argName: "col1"
      }
    },
    col2: {
      codec: TYPES.text,
      extensions: {
        argIndex: 4,
        argName: "col2"
      }
    }
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
      codec: TYPES.int,
      extensions: {
        argIndex: 0,
        argName: "id"
      }
    },
    total_duration: {
      codec: TYPES.interval,
      extensions: {
        argIndex: 1,
        argName: "total_duration"
      }
    }
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
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    json_data: {
      codec: TYPES.jsonb
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "my_table"
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
      codec: TYPES.int,
      notNull: true
    },
    sekrit: {
      codec: TYPES.text,
      description: "A secret held by the associated Person",
      extensions: {
        tags: {
          name: "secret"
        }
      }
    }
  },
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
  executor: executor,
  description: "Tracks the person's secret"
});
const unloggedIdentifier = sql.identifier("c", "unlogged");
const unloggedCodec = recordCodec({
  name: "unlogged",
  identifier: unloggedIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    nonsense: {
      codec: TYPES.text
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "unlogged",
      persistence: "u"
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
      codec: TYPES.int,
      notNull: true
    },
    person_id_1: {
      codec: TYPES.int,
      notNull: true
    },
    extra: {
      codec: TYPES.boolean
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "compound_key"
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
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    nullable_text: {
      codec: TYPES.text
    },
    nullable_int: {
      codec: TYPES.int
    },
    non_null_text: {
      codec: TYPES.text,
      notNull: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "null_test_record"
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
      codec: TYPES.boolean,
      notNull: true,
      hasDefault: true
    },
    wont_cast_easy: {
      codec: TYPES.int2
    },
    row_id: {
      codec: TYPES.int
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "edge_case"
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
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    person_id: {
      codec: TYPES.int,
      hasDefault: true
    },
    length_in_metres: {
      codec: TYPES.float
    },
    mood: {
      codec: TYPES.text,
      notNull: true,
      hasDefault: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "left_arm"
    }
  },
  executor: executor,
  description: "Tracks metadata about the left arms of various people"
});
const issue756Identifier = sql.identifier("c", "issue756");
const notNullTimestampCodec = domainOfCodec(TYPES.timestamptz, "notNullTimestamp", sql.identifier("c", "not_null_timestamp"), {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "not_null_timestamp"
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
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    ts: {
      codec: notNullTimestampCodec,
      notNull: true,
      hasDefault: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "issue756"
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
  identifier: compoundTypeIdentifier,
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
const registryConfig_pgCodecs_FuncOutOutCompoundTypeRecord_FuncOutOutCompoundTypeRecord = recordCodec({
  name: "FuncOutOutCompoundTypeRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: {
    __proto__: null,
    o1: {
      codec: TYPES.int,
      extensions: {
        argIndex: 1,
        argName: "o1"
      }
    },
    o2: {
      codec: compoundTypeCodec,
      extensions: {
        argIndex: 2,
        argName: "o2"
      }
    }
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
      codec: TYPES.int,
      extensions: {
        argIndex: 1,
        argName: "o1"
      }
    },
    o2: {
      codec: compoundTypeCodec,
      extensions: {
        argIndex: 2,
        argName: "o2"
      }
    }
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
    }
  }
});
const anEnumArrayCodec = listOfCodec(anEnumCodec, {
  name: "anEnumArray",
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "_an_enum"
    }
  }
});
const comptypeCodec = recordCodec({
  name: "comptype",
  identifier: sql.identifier("a", "comptype"),
  attributes: {
    __proto__: null,
    schedule: {
      codec: TYPES.timestamptz
    },
    is_optimised: {
      codec: TYPES.boolean
    }
  },
  extensions: {
    isTableLike: false,
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "comptype"
    }
  },
  executor: executor
});
const comptypeArrayCodec = listOfCodec(comptypeCodec, {
  name: "comptypeArray",
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "_comptype"
    }
  }
});
const postCodec = recordCodec({
  name: "post",
  identifier: sql.identifier("a", "post"),
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    headline: {
      codec: TYPES.text,
      notNull: true
    },
    body: {
      codec: TYPES.text
    },
    author_id: {
      codec: TYPES.int,
      hasDefault: true
    },
    enums: {
      codec: anEnumArrayCodec
    },
    comptypes: {
      codec: comptypeArrayCodec
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "post"
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
      codec: TYPES.text,
      extensions: {
        argIndex: 2,
        argName: "txt"
      }
    },
    left_arm: {
      codec: leftArmCodec,
      extensions: {
        argIndex: 3,
        argName: "left_arm"
      }
    },
    post: {
      codec: postCodec,
      extensions: {
        argIndex: 4,
        argName: "post"
      }
    }
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
      codec: TYPES.text,
      extensions: {
        argIndex: 1,
        argName: "o1"
      }
    },
    o2: {
      codec: TYPES.text,
      extensions: {
        argIndex: 2,
        argName: "o2"
      }
    }
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
      codec: TYPES.text,
      extensions: {
        argIndex: 1,
        argName: "ino"
      }
    },
    o: {
      codec: TYPES.text,
      extensions: {
        argIndex: 2,
        argName: "o"
      }
    }
  },
  executor,
  isAnonymous: true
});
const personIdentifier = sql.identifier("c", "person");
const emailCodec = domainOfCodec(TYPES.text, "email", sql.identifier("b", "email"), {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "email"
    }
  }
});
const notNullUrlCodec = domainOfCodec(TYPES.varchar, "notNullUrl", sql.identifier("b", "not_null_url"), {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "not_null_url"
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
      codec: notNullUrlCodec,
      notNull: true
    }
  },
  extensions: {
    isTableLike: false,
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "wrapped_url"
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
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      description: "The primary unique identifier for the person"
    },
    person_full_name: {
      codec: TYPES.varchar,
      notNull: true,
      description: "The person\u2019s name",
      extensions: {
        tags: {
          name: "name"
        }
      }
    },
    aliases: {
      codec: LIST_TYPES.text,
      notNull: true,
      hasDefault: true
    },
    about: {
      codec: TYPES.text
    },
    email: {
      codec: emailCodec,
      notNull: true
    },
    site: {
      codec: wrappedUrlCodec,
      extensions: {
        tags: {
          deprecated: "Don\u2019t use me"
        }
      }
    },
    config: {
      codec: TYPES.hstore
    },
    last_login_from_ip: {
      codec: TYPES.inet
    },
    last_login_from_subnet: {
      codec: TYPES.cidr
    },
    user_mac: {
      codec: TYPES.macaddr
    },
    created_at: {
      codec: TYPES.timestamp,
      hasDefault: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "person"
    }
  },
  executor: executor,
  description: "Person test comment"
});
const registryConfig_pgCodecs_PersonComputedFirstArgInoutOutRecord_PersonComputedFirstArgInoutOutRecord = recordCodec({
  name: "PersonComputedFirstArgInoutOutRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: {
    __proto__: null,
    person: {
      codec: personCodec,
      extensions: {
        argIndex: 0,
        argName: "person"
      }
    },
    o: {
      codec: TYPES.int,
      extensions: {
        argIndex: 1,
        argName: "o"
      }
    }
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
      codec: TYPES.int,
      extensions: {
        argIndex: 2,
        argName: "x"
      }
    },
    y: {
      codec: compoundTypeCodec,
      extensions: {
        argIndex: 3,
        argName: "y"
      }
    },
    z: {
      codec: personCodec,
      extensions: {
        argIndex: 4,
        argName: "z"
      }
    }
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
      codec: TYPES.int,
      extensions: {
        argIndex: 2,
        argName: "x"
      }
    },
    y: {
      codec: compoundTypeCodec,
      extensions: {
        argIndex: 3,
        argName: "y"
      }
    },
    z: {
      codec: personCodec,
      extensions: {
        argIndex: 4,
        argName: "z"
      }
    }
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
      codec: TYPES.int,
      extensions: {
        argIndex: 2,
        argName: "x"
      }
    },
    y: {
      codec: compoundTypeCodec,
      extensions: {
        argIndex: 3,
        argName: "y"
      }
    },
    z: {
      codec: personCodec,
      extensions: {
        argIndex: 4,
        argName: "z"
      }
    }
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
      codec: TYPES.int,
      extensions: {
        argIndex: 2,
        argName: "x"
      }
    },
    y: {
      codec: compoundTypeCodec,
      extensions: {
        argIndex: 3,
        argName: "y"
      }
    },
    z: {
      codec: personCodec,
      extensions: {
        argIndex: 4,
        argName: "z"
      }
    }
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
      codec: TYPES.int,
      extensions: {
        argIndex: 3,
        argName: "x"
      }
    },
    y: {
      codec: compoundTypeCodec,
      extensions: {
        argIndex: 4,
        argName: "y"
      }
    },
    z: {
      codec: personCodec,
      extensions: {
        argIndex: 5,
        argName: "z"
      }
    }
  },
  executor,
  isAnonymous: true
});
const colorArrayCodec = listOfCodec(colorCodec, {
  name: "colorArray",
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "_color"
    }
  }
});
const anIntCodec = domainOfCodec(TYPES.int, "anInt", sql.identifier("a", "an_int"), {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "an_int"
    }
  }
});
const anotherIntCodec = domainOfCodec(anIntCodec, "anotherInt", sql.identifier("b", "another_int"), {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "another_int"
    }
  }
});
const numrangeCodec = rangeOfCodec(TYPES.numeric, "numrange", sql.identifier("pg_catalog", "numrange"), {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "pg_catalog",
      name: "numrange"
    }
  },
  description: "range of numerics"
});
const daterangeCodec = rangeOfCodec(TYPES.date, "daterange", sql.identifier("pg_catalog", "daterange"), {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "pg_catalog",
      name: "daterange"
    }
  },
  description: "range of dates"
});
const anIntRangeCodec = rangeOfCodec(anIntCodec, "anIntRange", sql.identifier("a", "an_int_range"), {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "an_int_range"
    }
  }
});
const nestedCompoundTypeCodec = recordCodec({
  name: "nestedCompoundType",
  identifier: sql.identifier("b", "nested_compound_type"),
  attributes: {
    __proto__: null,
    a: {
      codec: compoundTypeCodec
    },
    b: {
      codec: compoundTypeCodec
    },
    baz_buz: {
      codec: TYPES.int
    }
  },
  extensions: {
    isTableLike: false,
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "nested_compound_type"
    }
  },
  executor: executor
});
const textArrayDomainCodec = domainOfCodec(LIST_TYPES.text, "textArrayDomain", sql.identifier("c", "text_array_domain"), {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "text_array_domain"
    }
  }
});
const int8ArrayDomainCodec = domainOfCodec(LIST_TYPES.bigint, "int8ArrayDomain", sql.identifier("c", "int8_array_domain"), {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "int8_array_domain"
    }
  }
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
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    smallint: {
      codec: TYPES.int2,
      notNull: true
    },
    bigint: {
      codec: TYPES.bigint,
      notNull: true
    },
    numeric: {
      codec: TYPES.numeric,
      notNull: true
    },
    decimal: {
      codec: TYPES.numeric,
      notNull: true
    },
    boolean: {
      codec: TYPES.boolean,
      notNull: true
    },
    varchar: {
      codec: TYPES.varchar,
      notNull: true
    },
    enum: {
      codec: colorCodec,
      notNull: true
    },
    enum_array: {
      codec: colorArrayCodec,
      notNull: true
    },
    domain: {
      codec: anIntCodec,
      notNull: true
    },
    domain2: {
      codec: anotherIntCodec,
      notNull: true
    },
    text_array: {
      codec: LIST_TYPES.text,
      notNull: true
    },
    json: {
      codec: TYPES.json,
      notNull: true
    },
    jsonb: {
      codec: TYPES.jsonb,
      notNull: true
    },
    jsonpath: {
      codec: TYPES.jsonpath
    },
    nullable_range: {
      codec: numrangeCodec
    },
    numrange: {
      codec: numrangeCodec,
      notNull: true
    },
    daterange: {
      codec: daterangeCodec,
      notNull: true
    },
    an_int_range: {
      codec: anIntRangeCodec,
      notNull: true
    },
    timestamp: {
      codec: TYPES.timestamp,
      notNull: true
    },
    timestamptz: {
      codec: TYPES.timestamptz,
      notNull: true
    },
    date: {
      codec: TYPES.date,
      notNull: true
    },
    time: {
      codec: TYPES.time,
      notNull: true
    },
    timetz: {
      codec: TYPES.timetz,
      notNull: true
    },
    interval: {
      codec: TYPES.interval,
      notNull: true
    },
    interval_array: {
      codec: LIST_TYPES.interval,
      notNull: true
    },
    money: {
      codec: TYPES.money,
      notNull: true
    },
    compound_type: {
      codec: compoundTypeCodec,
      notNull: true
    },
    nested_compound_type: {
      codec: nestedCompoundTypeCodec,
      notNull: true
    },
    nullable_compound_type: {
      codec: compoundTypeCodec
    },
    nullable_nested_compound_type: {
      codec: nestedCompoundTypeCodec
    },
    point: {
      codec: TYPES.point,
      notNull: true
    },
    nullablePoint: {
      codec: TYPES.point
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
    regproc: {
      codec: TYPES.regproc
    },
    regprocedure: {
      codec: TYPES.regprocedure
    },
    regoper: {
      codec: TYPES.regoper
    },
    regoperator: {
      codec: TYPES.regoperator
    },
    regclass: {
      codec: TYPES.regclass
    },
    regtype: {
      codec: TYPES.regtype
    },
    regconfig: {
      codec: TYPES.regconfig
    },
    regdictionary: {
      codec: TYPES.regdictionary
    },
    text_array_domain: {
      codec: textArrayDomainCodec
    },
    int8_array_domain: {
      codec: int8ArrayDomainCodec
    },
    bytea: {
      codec: TYPES.bytea
    },
    bytea_array: {
      codec: LIST_TYPES.bytea
    },
    ltree: {
      codec: spec_types_attributes_ltree_codec_ltree
    },
    ltree_array: {
      codec: spec_types_attributes_ltree_array_codec_ltree_
    },
    tsvector: {
      codec: TYPES.tsvector
    },
    tsvector_array: {
      codec: LIST_TYPES.tsvector
    },
    tsquery: {
      codec: TYPES.tsquery
    },
    tsquery_array: {
      codec: LIST_TYPES.tsquery
    }
  },
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
const floatrangeCodec = rangeOfCodec(TYPES.float, "floatrange", sql.identifier("c", "floatrange"), {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "floatrange"
    }
  }
});
const compoundTypeArrayCodec = listOfCodec(compoundTypeCodec, {
  name: "compoundTypeArray",
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "_compound_type"
    }
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
const int_set_mutationFunctionIdentifer = sql.identifier("c", "int_set_mutation");
const int_set_queryFunctionIdentifer = sql.identifier("c", "int_set_query");
const mutation_out_unnamed_out_out_unnamedFunctionIdentifer = sql.identifier("c", "mutation_out_unnamed_out_out_unnamed");
const mutation_returns_table_multi_colFunctionIdentifer = sql.identifier("c", "mutation_returns_table_multi_col");
const func_returns_table_multi_colFunctionIdentifer = sql.identifier("c", "func_returns_table_multi_col");
const search_test_summariesFunctionIdentifer = sql.identifier("c", "search_test_summaries");
const my_tableUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const person_secretUniques = [{
  attributes: ["person_id"],
  isPrimary: true
}];
const person_secret_resourceOptionsConfig = {
  executor: executor,
  name: "person_secret",
  identifier: "main.c.person_secret",
  from: personSecretIdentifier,
  codec: personSecretCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "person_secret"
    },
    tags: {
      deprecated: "This is deprecated (comment on table c.person_secret)."
    }
  },
  uniques: person_secretUniques,
  description: "Tracks the person's secret"
};
const compound_keyUniques = [{
  attributes: ["person_id_1", "person_id_2"],
  isPrimary: true
}];
const compound_key_resourceOptionsConfig = {
  executor: executor,
  name: "compound_key",
  identifier: "main.c.compound_key",
  from: compoundKeyIdentifier,
  codec: compoundKeyCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "compound_key"
    }
  },
  uniques: compound_keyUniques
};
const edge_case_computedFunctionIdentifer = sql.identifier("c", "edge_case_computed");
const null_test_recordUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const return_table_without_grantsFunctionIdentifer = sql.identifier("c", "return_table_without_grants");
const left_armUniques = [{
  attributes: ["id"],
  isPrimary: true
}, {
  attributes: ["person_id"]
}];
const left_arm_resourceOptionsConfig = {
  executor: executor,
  name: "left_arm",
  identifier: "main.c.left_arm",
  from: leftArmIdentifier,
  codec: leftArmCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "left_arm"
    }
  },
  uniques: left_armUniques,
  description: "Tracks metadata about the left arms of various people"
};
const left_arm_identityFunctionIdentifer = sql.identifier("c", "left_arm_identity");
const issue756Uniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const issue756_resourceOptionsConfig = {
  executor: executor,
  name: "issue756",
  identifier: "main.c.issue756",
  from: issue756Identifier,
  codec: issue756Codec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "issue756"
    }
  },
  uniques: issue756Uniques
};
const types_mutationFunctionIdentifer = sql.identifier("c", "types_mutation");
const types_queryFunctionIdentifer = sql.identifier("c", "types_query");
const issue756_mutationFunctionIdentifer = sql.identifier("c", "issue756_mutation");
const issue756_set_mutationFunctionIdentifer = sql.identifier("c", "issue756_set_mutation");
const compound_type_computed_fieldFunctionIdentifer = sql.identifier("c", "compound_type_computed_field");
const func_out_out_compound_typeFunctionIdentifer = sql.identifier("c", "func_out_out_compound_type");
const mutation_out_out_compound_typeFunctionIdentifer = sql.identifier("c", "mutation_out_out_compound_type");
const query_output_two_rowsFunctionIdentifer = sql.identifier("c", "query_output_two_rows");
const compound_type_set_queryFunctionIdentifer = sql.identifier("c", "compound_type_set_query");
const compound_type_resourceOptionsConfig = {
  executor: executor,
  name: "compound_type",
  identifier: "main.c.compound_type",
  from: compoundTypeIdentifier,
  codec: compoundTypeCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "compound_type"
    },
    isInsertable: false,
    isUpdatable: false,
    isDeletable: false
  },
  isVirtual: true,
  description: "Awesome feature!"
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
  attributes: ["id"],
  isPrimary: true
}, {
  attributes: ["email"]
}];
const person_resourceOptionsConfig = {
  executor: executor,
  name: "person",
  identifier: "main.c.person",
  from: personIdentifier,
  codec: personCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "person"
    }
  },
  uniques: personUniques,
  description: "Person test comment"
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
    textArray: LIST_TYPES.text,
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
    jsonpath: TYPES.jsonpath,
    numrange: numrangeCodec,
    daterange: daterangeCodec,
    date: TYPES.date,
    anIntRange: anIntRangeCodec,
    time: TYPES.time,
    timetz: TYPES.timetz,
    intervalArray: LIST_TYPES.interval,
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
    byteaArray: LIST_TYPES.bytea,
    ltree: spec_types_attributes_ltree_codec_ltree,
    "ltree[]": spec_types_attributes_ltree_array_codec_ltree_,
    tsvector: TYPES.tsvector,
    tsvectorArray: LIST_TYPES.tsvector,
    tsquery: TYPES.tsquery,
    tsqueryArray: LIST_TYPES.tsquery,
    bpchar: TYPES.bpchar,
    typesArray: listOfCodec(typesCodec, {
      name: "typesArray",
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "_types"
        }
      }
    }),
    int4Array: LIST_TYPES.int,
    floatrange: floatrangeCodec,
    compoundTypeArray: compoundTypeArrayCodec,
    int8Array: LIST_TYPES.bigint,
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
    current_user_id: {
      executor: executor,
      name: "current_user_id",
      identifier: "main.c.current_user_id()",
      from(...args) {
        return sql`${current_user_idFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      codec: TYPES.int,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "current_user_id"
        }
      },
      isUnique: true
    },
    func_out: {
      executor: executor,
      name: "func_out",
      identifier: "main.c.func_out(int4)",
      from(...args) {
        return sql`${func_outFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      codec: TYPES.int,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_out"
        },
        singleOutputParameterName: "o"
      },
      isUnique: true
    },
    func_out_setof: {
      executor: executor,
      name: "func_out_setof",
      identifier: "main.c.func_out_setof(int4)",
      from(...args) {
        return sql`${func_out_setofFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      codec: TYPES.int,
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_out_setof"
        },
        singleOutputParameterName: "o"
      }
    },
    func_out_unnamed: {
      executor: executor,
      name: "func_out_unnamed",
      identifier: "main.c.func_out_unnamed(int4)",
      from(...args) {
        return sql`${func_out_unnamedFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      codec: TYPES.int,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_out_unnamed"
        }
      },
      isUnique: true
    },
    mutation_out: {
      executor: executor,
      name: "mutation_out",
      identifier: "main.c.mutation_out(int4)",
      from(...args) {
        return sql`${mutation_outFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      codec: TYPES.int,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_out"
        },
        singleOutputParameterName: "o"
      },
      isUnique: true,
      isMutation: true
    },
    mutation_out_setof: {
      executor: executor,
      name: "mutation_out_setof",
      identifier: "main.c.mutation_out_setof(int4)",
      from(...args) {
        return sql`${mutation_out_setofFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      codec: TYPES.int,
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_out_setof"
        },
        singleOutputParameterName: "o"
      },
      isMutation: true
    },
    mutation_out_unnamed: {
      executor: executor,
      name: "mutation_out_unnamed",
      identifier: "main.c.mutation_out_unnamed(int4)",
      from(...args) {
        return sql`${mutation_out_unnamedFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      codec: TYPES.int,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_out_unnamed"
        }
      },
      isUnique: true,
      isMutation: true
    },
    no_args_mutation: {
      executor: executor,
      name: "no_args_mutation",
      identifier: "main.c.no_args_mutation()",
      from(...args) {
        return sql`${no_args_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      codec: TYPES.int,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "no_args_mutation"
        }
      },
      isUnique: true,
      isMutation: true
    },
    no_args_query: {
      executor: executor,
      name: "no_args_query",
      identifier: "main.c.no_args_query()",
      from(...args) {
        return sql`${no_args_queryFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      codec: TYPES.int,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "no_args_query"
        }
      },
      isUnique: true
    },
    func_in_out: {
      executor: executor,
      name: "func_in_out",
      identifier: "main.c.func_in_out(int4,int4)",
      from(...args) {
        return sql`${func_in_outFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "i",
        codec: TYPES.int,
        required: true
      }],
      codec: TYPES.int,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_in_out"
        },
        singleOutputParameterName: "o"
      },
      isUnique: true
    },
    func_returns_table_one_col: {
      executor: executor,
      name: "func_returns_table_one_col",
      identifier: "main.c.func_returns_table_one_col(int4,int4)",
      from(...args) {
        return sql`${func_returns_table_one_colFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "i",
        codec: TYPES.int,
        required: true
      }],
      codec: TYPES.int,
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_returns_table_one_col"
        },
        singleOutputParameterName: "col1"
      }
    },
    mutation_in_out: {
      executor: executor,
      name: "mutation_in_out",
      identifier: "main.c.mutation_in_out(int4,int4)",
      from(...args) {
        return sql`${mutation_in_outFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "i",
        codec: TYPES.int,
        required: true
      }],
      codec: TYPES.int,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_in_out"
        },
        singleOutputParameterName: "o"
      },
      isUnique: true,
      isMutation: true
    },
    mutation_returns_table_one_col: {
      executor: executor,
      name: "mutation_returns_table_one_col",
      identifier: "main.c.mutation_returns_table_one_col(int4,int4)",
      from(...args) {
        return sql`${mutation_returns_table_one_colFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "i",
        codec: TYPES.int,
        required: true
      }],
      codec: TYPES.int,
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_returns_table_one_col"
        },
        singleOutputParameterName: "col1"
      },
      isMutation: true
    },
    json_identity: {
      executor: executor,
      name: "json_identity",
      identifier: "main.c.json_identity(json)",
      from(...args) {
        return sql`${json_identityFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "json",
        codec: TYPES.json,
        required: true
      }],
      codec: TYPES.json,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "json_identity"
        }
      },
      isUnique: true
    },
    json_identity_mutation: {
      executor: executor,
      name: "json_identity_mutation",
      identifier: "main.c.json_identity_mutation(json)",
      from(...args) {
        return sql`${json_identity_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "json",
        codec: TYPES.json,
        required: true
      }],
      codec: TYPES.json,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "json_identity_mutation"
        }
      },
      isUnique: true,
      isMutation: true
    },
    jsonb_identity: {
      executor: executor,
      name: "jsonb_identity",
      identifier: "main.c.jsonb_identity(jsonb)",
      from(...args) {
        return sql`${jsonb_identityFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "json",
        codec: TYPES.jsonb,
        required: true
      }],
      codec: TYPES.jsonb,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "jsonb_identity"
        }
      },
      isUnique: true
    },
    jsonb_identity_mutation: {
      executor: executor,
      name: "jsonb_identity_mutation",
      identifier: "main.c.jsonb_identity_mutation(jsonb)",
      from(...args) {
        return sql`${jsonb_identity_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "json",
        codec: TYPES.jsonb,
        required: true
      }],
      codec: TYPES.jsonb,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "jsonb_identity_mutation"
        }
      },
      isUnique: true,
      isMutation: true
    },
    jsonb_identity_mutation_plpgsql: {
      executor: executor,
      name: "jsonb_identity_mutation_plpgsql",
      identifier: "main.c.jsonb_identity_mutation_plpgsql(jsonb)",
      from(...args) {
        return sql`${jsonb_identity_mutation_plpgsqlFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "_the_json",
        codec: TYPES.jsonb,
        required: true,
        notNull: true
      }],
      codec: TYPES.jsonb,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "jsonb_identity_mutation_plpgsql"
        }
      },
      isUnique: true,
      isMutation: true
    },
    jsonb_identity_mutation_plpgsql_with_default: {
      executor: executor,
      name: "jsonb_identity_mutation_plpgsql_with_default",
      identifier: "main.c.jsonb_identity_mutation_plpgsql_with_default(jsonb)",
      from(...args) {
        return sql`${jsonb_identity_mutation_plpgsql_with_defaultFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "_the_json",
        codec: TYPES.jsonb,
        notNull: true
      }],
      codec: TYPES.jsonb,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "jsonb_identity_mutation_plpgsql_with_default"
        }
      },
      isUnique: true,
      isMutation: true
    },
    func_in_inout: {
      executor: executor,
      name: "func_in_inout",
      identifier: "main.c.func_in_inout(int4,int4)",
      from(...args) {
        return sql`${func_in_inoutFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "i",
        codec: TYPES.int,
        required: true
      }, {
        name: "ino",
        codec: TYPES.int,
        required: true
      }],
      codec: TYPES.int,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_in_inout"
        },
        singleOutputParameterName: "ino"
      },
      isUnique: true
    },
    func_out_out: {
      executor: executor,
      name: "func_out_out",
      identifier: "main.c.func_out_out(int4,text)",
      from(...args) {
        return sql`${func_out_outFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      codec: registryConfig_pgCodecs_FuncOutOutRecord_FuncOutOutRecord,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_out_out"
        }
      },
      isUnique: true
    },
    func_out_out_setof: {
      executor: executor,
      name: "func_out_out_setof",
      identifier: "main.c.func_out_out_setof(int4,text)",
      from(...args) {
        return sql`${func_out_out_setofFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      codec: registryConfig_pgCodecs_FuncOutOutSetofRecord_FuncOutOutSetofRecord,
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_out_out_setof"
        }
      }
    },
    func_out_out_unnamed: {
      executor: executor,
      name: "func_out_out_unnamed",
      identifier: "main.c.func_out_out_unnamed(int4,text)",
      from(...args) {
        return sql`${func_out_out_unnamedFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      codec: registryConfig_pgCodecs_FuncOutOutUnnamedRecord_FuncOutOutUnnamedRecord,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_out_out_unnamed"
        }
      },
      isUnique: true
    },
    mutation_in_inout: {
      executor: executor,
      name: "mutation_in_inout",
      identifier: "main.c.mutation_in_inout(int4,int4)",
      from(...args) {
        return sql`${mutation_in_inoutFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "i",
        codec: TYPES.int,
        required: true
      }, {
        name: "ino",
        codec: TYPES.int,
        required: true
      }],
      codec: TYPES.int,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_in_inout"
        },
        singleOutputParameterName: "ino"
      },
      isUnique: true,
      isMutation: true
    },
    mutation_out_out: {
      executor: executor,
      name: "mutation_out_out",
      identifier: "main.c.mutation_out_out(int4,text)",
      from(...args) {
        return sql`${mutation_out_outFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      codec: registryConfig_pgCodecs_MutationOutOutRecord_MutationOutOutRecord,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_out_out"
        }
      },
      isUnique: true,
      isMutation: true
    },
    mutation_out_out_setof: {
      executor: executor,
      name: "mutation_out_out_setof",
      identifier: "main.c.mutation_out_out_setof(int4,text)",
      from(...args) {
        return sql`${mutation_out_out_setofFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      codec: registryConfig_pgCodecs_MutationOutOutSetofRecord_MutationOutOutSetofRecord,
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_out_out_setof"
        }
      },
      isMutation: true
    },
    mutation_out_out_unnamed: {
      executor: executor,
      name: "mutation_out_out_unnamed",
      identifier: "main.c.mutation_out_out_unnamed(int4,text)",
      from(...args) {
        return sql`${mutation_out_out_unnamedFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      codec: registryConfig_pgCodecs_MutationOutOutUnnamedRecord_MutationOutOutUnnamedRecord,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_out_out_unnamed"
        }
      },
      isUnique: true,
      isMutation: true
    },
    func_out_unnamed_out_out_unnamed: {
      executor: executor,
      name: "func_out_unnamed_out_out_unnamed",
      identifier: "main.c.func_out_unnamed_out_out_unnamed(int4,text,int4)",
      from(...args) {
        return sql`${func_out_unnamed_out_out_unnamedFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      codec: registryConfig_pgCodecs_FuncOutUnnamedOutOutUnnamedRecord_FuncOutUnnamedOutOutUnnamedRecord,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_out_unnamed_out_out_unnamed"
        }
      },
      isUnique: true
    },
    int_set_mutation: {
      executor: executor,
      name: "int_set_mutation",
      identifier: "main.c.int_set_mutation(int4,int4,int4)",
      from(...args) {
        return sql`${int_set_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "x",
        codec: TYPES.int,
        required: true
      }, {
        name: "y",
        codec: TYPES.int,
        required: true
      }, {
        name: "z",
        codec: TYPES.int,
        required: true
      }],
      codec: TYPES.int,
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "int_set_mutation"
        }
      },
      isMutation: true
    },
    int_set_query: {
      executor: executor,
      name: "int_set_query",
      identifier: "main.c.int_set_query(int4,int4,int4)",
      from(...args) {
        return sql`${int_set_queryFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "x",
        codec: TYPES.int,
        required: true
      }, {
        name: "y",
        codec: TYPES.int,
        required: true
      }, {
        name: "z",
        codec: TYPES.int,
        required: true
      }],
      codec: TYPES.int,
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "int_set_query"
        }
      }
    },
    mutation_out_unnamed_out_out_unnamed: {
      executor: executor,
      name: "mutation_out_unnamed_out_out_unnamed",
      identifier: "main.c.mutation_out_unnamed_out_out_unnamed(int4,text,int4)",
      from(...args) {
        return sql`${mutation_out_unnamed_out_out_unnamedFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      codec: registryConfig_pgCodecs_MutationOutUnnamedOutOutUnnamedRecord_MutationOutUnnamedOutOutUnnamedRecord,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_out_unnamed_out_out_unnamed"
        }
      },
      isUnique: true,
      isMutation: true
    },
    mutation_returns_table_multi_col: {
      executor: executor,
      name: "mutation_returns_table_multi_col",
      identifier: "main.c.mutation_returns_table_multi_col(int4,int4,text)",
      from(...args) {
        return sql`${mutation_returns_table_multi_colFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "i",
        codec: TYPES.int,
        required: true
      }],
      codec: registryConfig_pgCodecs_MutationReturnsTableMultiColRecord_MutationReturnsTableMultiColRecord,
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_returns_table_multi_col"
        }
      },
      isMutation: true
    },
    func_returns_table_multi_col: {
      executor: executor,
      name: "func_returns_table_multi_col",
      identifier: "main.c.func_returns_table_multi_col(int4,int4,int4,int4,text)",
      from(...args) {
        return sql`${func_returns_table_multi_colFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "i",
        codec: TYPES.int,
        required: true
      }, {
        name: "a",
        codec: TYPES.int
      }, {
        name: "b",
        codec: TYPES.int
      }],
      codec: registryConfig_pgCodecs_FuncReturnsTableMultiColRecord_FuncReturnsTableMultiColRecord,
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_returns_table_multi_col"
        }
      }
    },
    search_test_summaries: {
      executor: executor,
      name: "search_test_summaries",
      identifier: "main.c.search_test_summaries(int4,interval)",
      from(...args) {
        return sql`${search_test_summariesFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      codec: registryConfig_pgCodecs_SearchTestSummariesRecord_SearchTestSummariesRecord,
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
      }
    },
    my_table: {
      executor: executor,
      name: "my_table",
      identifier: "main.c.my_table",
      from: myTableIdentifier,
      codec: myTableCodec,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "my_table"
        }
      },
      uniques: my_tableUniques
    },
    person_secret: person_secret_resourceOptionsConfig,
    unlogged: {
      executor: executor,
      name: "unlogged",
      identifier: "main.c.unlogged",
      from: unloggedIdentifier,
      codec: unloggedCodec,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "unlogged",
          persistence: "u"
        }
      },
      uniques: [{
        attributes: ["id"],
        isPrimary: true
      }]
    },
    compound_key: compound_key_resourceOptionsConfig,
    edge_case_computed: {
      executor: executor,
      name: "edge_case_computed",
      identifier: "main.c.edge_case_computed(c.edge_case)",
      from(...args) {
        return sql`${edge_case_computedFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "edge_case",
        codec: edgeCaseCodec,
        required: true
      }],
      codec: TYPES.text,
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
      isUnique: true
    },
    null_test_record: {
      executor: executor,
      name: "null_test_record",
      identifier: "main.c.null_test_record",
      from: nullTestRecordIdentifier,
      codec: nullTestRecordCodec,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "null_test_record"
        }
      },
      uniques: null_test_recordUniques
    },
    return_table_without_grants: PgResource.functionResourceOptions(compound_key_resourceOptionsConfig, {
      name: "return_table_without_grants",
      identifier: "main.c.return_table_without_grants()",
      from(...args) {
        return sql`${return_table_without_grantsFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsSetof: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "return_table_without_grants"
        }
      }
    }),
    edge_case: {
      executor: executor,
      name: "edge_case",
      identifier: "main.c.edge_case",
      from: edgeCaseIdentifier,
      codec: edgeCaseCodec,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "edge_case"
        }
      }
    },
    left_arm: left_arm_resourceOptionsConfig,
    left_arm_identity: PgResource.functionResourceOptions(left_arm_resourceOptionsConfig, {
      name: "left_arm_identity",
      identifier: "main.c.left_arm_identity(c.left_arm)",
      from(...args) {
        return sql`${left_arm_identityFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "left_arm",
        codec: leftArmCodec,
        required: true,
        extensions: {
          variant: "base"
        }
      }],
      returnsSetof: false,
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
      isMutation: true
    }),
    issue756: issue756_resourceOptionsConfig,
    types_mutation: {
      executor: executor,
      name: "types_mutation",
      identifier: "main.c.types_mutation(int8,bool,varchar,_int4,json,c.floatrange)",
      from(...args) {
        return sql`${types_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "a",
        codec: TYPES.bigint,
        required: true,
        notNull: true
      }, {
        name: "b",
        codec: TYPES.boolean,
        required: true,
        notNull: true
      }, {
        name: "c",
        codec: TYPES.varchar,
        required: true,
        notNull: true
      }, {
        name: "d",
        codec: LIST_TYPES.int,
        required: true,
        notNull: true
      }, {
        name: "e",
        codec: TYPES.json,
        required: true,
        notNull: true
      }, {
        name: "f",
        codec: floatrangeCodec,
        required: true,
        notNull: true
      }],
      codec: TYPES.boolean,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "types_mutation"
        }
      },
      isUnique: true,
      isMutation: true
    },
    types_query: {
      executor: executor,
      name: "types_query",
      identifier: "main.c.types_query(int8,bool,varchar,_int4,json,c.floatrange)",
      from(...args) {
        return sql`${types_queryFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "a",
        codec: TYPES.bigint,
        required: true,
        notNull: true
      }, {
        name: "b",
        codec: TYPES.boolean,
        required: true,
        notNull: true
      }, {
        name: "c",
        codec: TYPES.varchar,
        required: true,
        notNull: true
      }, {
        name: "d",
        codec: LIST_TYPES.int,
        required: true,
        notNull: true
      }, {
        name: "e",
        codec: TYPES.json,
        required: true,
        notNull: true
      }, {
        name: "f",
        codec: floatrangeCodec,
        required: true,
        notNull: true
      }],
      codec: TYPES.boolean,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "types_query"
        }
      },
      isUnique: true
    },
    issue756_mutation: PgResource.functionResourceOptions(issue756_resourceOptionsConfig, {
      name: "issue756_mutation",
      identifier: "main.c.issue756_mutation()",
      from(...args) {
        return sql`${issue756_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsSetof: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "issue756_mutation"
        }
      },
      isMutation: true
    }),
    issue756_set_mutation: PgResource.functionResourceOptions(issue756_resourceOptionsConfig, {
      name: "issue756_set_mutation",
      identifier: "main.c.issue756_set_mutation()",
      from(...args) {
        return sql`${issue756_set_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsSetof: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "issue756_set_mutation"
        }
      },
      isMutation: true,
      hasImplicitOrder: true
    }),
    compound_type_computed_field: {
      executor: executor,
      name: "compound_type_computed_field",
      identifier: "main.c.compound_type_computed_field(c.compound_type)",
      from(...args) {
        return sql`${compound_type_computed_fieldFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "compound_type",
        codec: compoundTypeCodec,
        required: true
      }],
      codec: TYPES.int,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "compound_type_computed_field"
        }
      },
      isUnique: true
    },
    func_out_out_compound_type: {
      executor: executor,
      name: "func_out_out_compound_type",
      identifier: "main.c.func_out_out_compound_type(int4,int4,c.compound_type)",
      from(...args) {
        return sql`${func_out_out_compound_typeFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "i1",
        codec: TYPES.int,
        required: true
      }],
      codec: registryConfig_pgCodecs_FuncOutOutCompoundTypeRecord_FuncOutOutCompoundTypeRecord,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_out_out_compound_type"
        }
      },
      isUnique: true
    },
    mutation_out_out_compound_type: {
      executor: executor,
      name: "mutation_out_out_compound_type",
      identifier: "main.c.mutation_out_out_compound_type(int4,int4,c.compound_type)",
      from(...args) {
        return sql`${mutation_out_out_compound_typeFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "i1",
        codec: TYPES.int,
        required: true
      }],
      codec: registryConfig_pgCodecs_MutationOutOutCompoundTypeRecord_MutationOutOutCompoundTypeRecord,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_out_out_compound_type"
        }
      },
      isUnique: true,
      isMutation: true
    },
    query_output_two_rows: {
      executor: executor,
      name: "query_output_two_rows",
      identifier: "main.c.query_output_two_rows(int4,int4,text,c.left_arm,a.post)",
      from(...args) {
        return sql`${query_output_two_rowsFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "left_arm_id",
        codec: TYPES.int,
        required: true
      }, {
        name: "post_id",
        codec: TYPES.int,
        required: true
      }, {
        name: "txt",
        codec: TYPES.text,
        required: true
      }],
      codec: registryConfig_pgCodecs_QueryOutputTwoRowsRecord_QueryOutputTwoRowsRecord,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "query_output_two_rows"
        }
      },
      isUnique: true
    },
    compound_type_set_query: PgResource.functionResourceOptions(compound_type_resourceOptionsConfig, {
      name: "compound_type_set_query",
      identifier: "main.c.compound_type_set_query()",
      from(...args) {
        return sql`${compound_type_set_queryFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsSetof: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "compound_type_set_query"
        }
      },
      hasImplicitOrder: true
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
        codec: TYPES.int,
        required: true
      }],
      returnsSetof: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "table_mutation"
        }
      },
      isMutation: true
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
        codec: TYPES.int,
        required: true
      }],
      returnsSetof: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "table_query"
        }
      }
    }),
    list_of_compound_types_mutation: PgResource.functionResourceOptions(compound_type_resourceOptionsConfig, {
      name: "list_of_compound_types_mutation",
      identifier: "main.c.list_of_compound_types_mutation(c._compound_type)",
      from(...args) {
        return sql`${list_of_compound_types_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "records",
        codec: compoundTypeArrayCodec,
        required: true
      }],
      returnsSetof: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "list_of_compound_types_mutation"
        }
      },
      isMutation: true,
      hasImplicitOrder: true
    }),
    person_computed_out: {
      executor: executor,
      name: "person_computed_out",
      identifier: "main.c.person_computed_out(c.person,text)",
      from(...args) {
        return sql`${person_computed_outFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "person",
        codec: personCodec,
        required: true
      }],
      codec: TYPES.text,
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
      isUnique: true
    },
    person_first_name: {
      executor: executor,
      name: "person_first_name",
      identifier: "main.c.person_first_name(c.person)",
      from(...args) {
        return sql`${person_first_nameFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "person",
        codec: personCodec,
        required: true
      }],
      codec: TYPES.text,
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
      isUnique: true,
      description: "The first name of the person."
    },
    person_computed_out_out: {
      executor: executor,
      name: "person_computed_out_out",
      identifier: "main.c.person_computed_out_out(c.person,text,text)",
      from(...args) {
        return sql`${person_computed_out_outFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "person",
        codec: personCodec,
        required: true
      }],
      codec: registryConfig_pgCodecs_PersonComputedOutOutRecord_PersonComputedOutOutRecord,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_computed_out_out"
        }
      },
      isUnique: true
    },
    person_computed_inout: {
      executor: executor,
      name: "person_computed_inout",
      identifier: "main.c.person_computed_inout(c.person,text)",
      from(...args) {
        return sql`${person_computed_inoutFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "person",
        codec: personCodec,
        required: true
      }, {
        name: "ino",
        codec: TYPES.text,
        required: true
      }],
      codec: TYPES.text,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_computed_inout"
        },
        singleOutputParameterName: "ino"
      },
      isUnique: true
    },
    person_computed_inout_out: {
      executor: executor,
      name: "person_computed_inout_out",
      identifier: "main.c.person_computed_inout_out(c.person,text,text)",
      from(...args) {
        return sql`${person_computed_inout_outFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "person",
        codec: personCodec,
        required: true
      }, {
        name: "ino",
        codec: TYPES.text,
        required: true
      }],
      codec: registryConfig_pgCodecs_PersonComputedInoutOutRecord_PersonComputedInoutOutRecord,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_computed_inout_out"
        }
      },
      isUnique: true
    },
    person_exists: {
      executor: executor,
      name: "person_exists",
      identifier: "main.c.person_exists(c.person,b.email)",
      from(...args) {
        return sql`${person_existsFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "person",
        codec: personCodec,
        required: true
      }, {
        name: "email",
        codec: emailCodec,
        required: true
      }],
      codec: TYPES.boolean,
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
      isUnique: true
    },
    person_computed_first_arg_inout_out: {
      executor: executor,
      name: "person_computed_first_arg_inout_out",
      identifier: "main.c.person_computed_first_arg_inout_out(c.person,int4)",
      from(...args) {
        return sql`${person_computed_first_arg_inout_outFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "person",
        codec: personCodec,
        required: true
      }],
      codec: registryConfig_pgCodecs_PersonComputedFirstArgInoutOutRecord_PersonComputedFirstArgInoutOutRecord,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_computed_first_arg_inout_out"
        }
      },
      isUnique: true
    },
    person_optional_missing_middle_1: {
      executor: executor,
      name: "person_optional_missing_middle_1",
      identifier: "main.c.person_optional_missing_middle_1(c.person,int4,int4,int4)",
      from(...args) {
        return sql`${person_optional_missing_middle_1FunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "p",
        codec: personCodec,
        required: true,
        notNull: true
      }, {
        name: "",
        codec: TYPES.int,
        required: true,
        notNull: true
      }, {
        name: "b",
        codec: TYPES.int,
        notNull: true
      }, {
        name: "c",
        codec: TYPES.int,
        notNull: true
      }],
      codec: TYPES.int,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_optional_missing_middle_1"
        }
      },
      isUnique: true
    },
    person_optional_missing_middle_2: {
      executor: executor,
      name: "person_optional_missing_middle_2",
      identifier: "main.c.person_optional_missing_middle_2(c.person,int4,int4,int4)",
      from(...args) {
        return sql`${person_optional_missing_middle_2FunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "p",
        codec: personCodec,
        required: true,
        notNull: true
      }, {
        name: "a",
        codec: TYPES.int,
        required: true,
        notNull: true
      }, {
        name: "b",
        codec: TYPES.int,
        notNull: true
      }, {
        name: "c",
        codec: TYPES.int,
        notNull: true
      }],
      codec: TYPES.int,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_optional_missing_middle_2"
        }
      },
      isUnique: true
    },
    person_optional_missing_middle_3: {
      executor: executor,
      name: "person_optional_missing_middle_3",
      identifier: "main.c.person_optional_missing_middle_3(c.person,int4,int4,int4)",
      from(...args) {
        return sql`${person_optional_missing_middle_3FunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "p",
        codec: personCodec,
        required: true,
        notNull: true
      }, {
        name: "a",
        codec: TYPES.int,
        required: true,
        notNull: true
      }, {
        name: "",
        codec: TYPES.int,
        notNull: true
      }, {
        name: "c",
        codec: TYPES.int,
        notNull: true
      }],
      codec: TYPES.int,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_optional_missing_middle_3"
        }
      },
      isUnique: true
    },
    person_optional_missing_middle_4: {
      executor: executor,
      name: "person_optional_missing_middle_4",
      identifier: "main.c.person_optional_missing_middle_4(c.person,int4,int4,int4)",
      from(...args) {
        return sql`${person_optional_missing_middle_4FunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "p",
        codec: personCodec,
        required: true,
        notNull: true
      }, {
        name: "",
        codec: TYPES.int,
        required: true,
        notNull: true
      }, {
        name: "b",
        codec: TYPES.int,
        notNull: true
      }, {
        name: "",
        codec: TYPES.int,
        notNull: true
      }],
      codec: TYPES.int,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_optional_missing_middle_4"
        }
      },
      isUnique: true
    },
    person_optional_missing_middle_5: {
      executor: executor,
      name: "person_optional_missing_middle_5",
      identifier: "main.c.person_optional_missing_middle_5(c.person,int4,int4,int4)",
      from(...args) {
        return sql`${person_optional_missing_middle_5FunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "p",
        codec: personCodec,
        required: true,
        notNull: true
      }, {
        name: "a",
        codec: TYPES.int,
        required: true,
        notNull: true
      }, {
        name: "",
        codec: TYPES.int,
        notNull: true
      }, {
        name: "",
        codec: TYPES.int,
        notNull: true
      }],
      codec: TYPES.int,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_optional_missing_middle_5"
        }
      },
      isUnique: true
    },
    func_out_complex: {
      executor: executor,
      name: "func_out_complex",
      identifier: "main.c.func_out_complex(int4,text,int4,c.compound_type,c.person)",
      from(...args) {
        return sql`${func_out_complexFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "a",
        codec: TYPES.int,
        required: true
      }, {
        name: "b",
        codec: TYPES.text,
        required: true
      }],
      codec: registryConfig_pgCodecs_FuncOutComplexRecord_FuncOutComplexRecord,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_out_complex"
        }
      },
      isUnique: true
    },
    func_out_complex_setof: {
      executor: executor,
      name: "func_out_complex_setof",
      identifier: "main.c.func_out_complex_setof(int4,text,int4,c.compound_type,c.person)",
      from(...args) {
        return sql`${func_out_complex_setofFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "a",
        codec: TYPES.int,
        required: true
      }, {
        name: "b",
        codec: TYPES.text,
        required: true
      }],
      codec: registryConfig_pgCodecs_FuncOutComplexSetofRecord_FuncOutComplexSetofRecord,
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_out_complex_setof"
        }
      }
    },
    mutation_out_complex: {
      executor: executor,
      name: "mutation_out_complex",
      identifier: "main.c.mutation_out_complex(int4,text,int4,c.compound_type,c.person)",
      from(...args) {
        return sql`${mutation_out_complexFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "a",
        codec: TYPES.int,
        required: true
      }, {
        name: "b",
        codec: TYPES.text,
        required: true
      }],
      codec: registryConfig_pgCodecs_MutationOutComplexRecord_MutationOutComplexRecord,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_out_complex"
        }
      },
      isUnique: true,
      isMutation: true
    },
    mutation_out_complex_setof: {
      executor: executor,
      name: "mutation_out_complex_setof",
      identifier: "main.c.mutation_out_complex_setof(int4,text,int4,c.compound_type,c.person)",
      from(...args) {
        return sql`${mutation_out_complex_setofFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "a",
        codec: TYPES.int,
        required: true
      }, {
        name: "b",
        codec: TYPES.text,
        required: true
      }],
      codec: registryConfig_pgCodecs_MutationOutComplexSetofRecord_MutationOutComplexSetofRecord,
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_out_complex_setof"
        }
      },
      isMutation: true
    },
    person_computed_complex: {
      executor: executor,
      name: "person_computed_complex",
      identifier: "main.c.person_computed_complex(c.person,int4,text,int4,c.compound_type,c.person)",
      from(...args) {
        return sql`${person_computed_complexFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "person",
        codec: personCodec,
        required: true
      }, {
        name: "a",
        codec: TYPES.int,
        required: true
      }, {
        name: "b",
        codec: TYPES.text,
        required: true
      }],
      codec: registryConfig_pgCodecs_PersonComputedComplexRecord_PersonComputedComplexRecord,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_computed_complex"
        }
      },
      isUnique: true
    },
    person: person_resourceOptionsConfig,
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
        codec: personCodec,
        required: true
      }],
      returnsSetof: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_first_post"
        }
      },
      description: "The first post by the person."
    }),
    badly_behaved_function: PgResource.functionResourceOptions(person_resourceOptionsConfig, {
      name: "badly_behaved_function",
      identifier: "main.c.badly_behaved_function()",
      from(...args) {
        return sql`${badly_behaved_functionFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsSetof: true,
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
      hasImplicitOrder: true
    }),
    func_out_table: PgResource.functionResourceOptions(person_resourceOptionsConfig, {
      name: "func_out_table",
      identifier: "main.c.func_out_table(c.person)",
      from(...args) {
        return sql`${func_out_tableFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsSetof: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_out_table"
        }
      }
    }),
    func_out_table_setof: PgResource.functionResourceOptions(person_resourceOptionsConfig, {
      name: "func_out_table_setof",
      identifier: "main.c.func_out_table_setof(c.person)",
      from(...args) {
        return sql`${func_out_table_setofFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsSetof: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_out_table_setof"
        }
      },
      hasImplicitOrder: true
    }),
    mutation_out_table: PgResource.functionResourceOptions(person_resourceOptionsConfig, {
      name: "mutation_out_table",
      identifier: "main.c.mutation_out_table(c.person)",
      from(...args) {
        return sql`${mutation_out_tableFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsSetof: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_out_table"
        }
      },
      isMutation: true
    }),
    mutation_out_table_setof: PgResource.functionResourceOptions(person_resourceOptionsConfig, {
      name: "mutation_out_table_setof",
      identifier: "main.c.mutation_out_table_setof(c.person)",
      from(...args) {
        return sql`${mutation_out_table_setofFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsSetof: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "mutation_out_table_setof"
        }
      },
      isMutation: true,
      hasImplicitOrder: true
    }),
    table_set_mutation: PgResource.functionResourceOptions(person_resourceOptionsConfig, {
      name: "table_set_mutation",
      identifier: "main.c.table_set_mutation()",
      from(...args) {
        return sql`${table_set_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsSetof: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "table_set_mutation"
        }
      },
      isMutation: true,
      hasImplicitOrder: true
    }),
    table_set_query: PgResource.functionResourceOptions(person_resourceOptionsConfig, {
      name: "table_set_query",
      identifier: "main.c.table_set_query()",
      from(...args) {
        return sql`${table_set_queryFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsSetof: true,
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
      hasImplicitOrder: true
    }),
    table_set_query_plpgsql: PgResource.functionResourceOptions(person_resourceOptionsConfig, {
      name: "table_set_query_plpgsql",
      identifier: "main.c.table_set_query_plpgsql()",
      from(...args) {
        return sql`${table_set_query_plpgsqlFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsSetof: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "table_set_query_plpgsql"
        }
      },
      hasImplicitOrder: true
    }),
    person_computed_first_arg_inout: PgResource.functionResourceOptions(person_resourceOptionsConfig, {
      name: "person_computed_first_arg_inout",
      identifier: "main.c.person_computed_first_arg_inout(c.person)",
      from(...args) {
        return sql`${person_computed_first_arg_inoutFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "person",
        codec: personCodec,
        required: true
      }],
      returnsSetof: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_computed_first_arg_inout"
        },
        singleOutputParameterName: "person"
      }
    }),
    person_friends: PgResource.functionResourceOptions(person_resourceOptionsConfig, {
      name: "person_friends",
      identifier: "main.c.person_friends(c.person)",
      from(...args) {
        return sql`${person_friendsFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "person",
        codec: personCodec,
        required: true
      }],
      returnsSetof: true,
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
      hasImplicitOrder: true
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
        codec: personCodec,
        required: true
      }],
      returnsSetof: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_type_function_connection"
        }
      },
      hasImplicitOrder: true
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
        codec: personCodec,
        required: true
      }, {
        name: "id",
        codec: TYPES.int,
        required: true
      }],
      returnsSetof: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_type_function"
        }
      }
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
        codec: personCodec,
        required: true
      }],
      returnsSetof: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "person_type_function_list"
        }
      },
      returnsArray: true
    })
  },
  pgRelations: {
    __proto__: null,
    compoundKey: {
      __proto__: null,
      personByMyPersonId1: {
        localCodec: compoundKeyCodec,
        remoteResourceOptions: person_resourceOptionsConfig,
        localAttributes: ["person_id_1"],
        remoteAttributes: ["id"],
        isUnique: true
      },
      personByMyPersonId2: {
        localCodec: compoundKeyCodec,
        remoteResourceOptions: person_resourceOptionsConfig,
        localAttributes: ["person_id_2"],
        remoteAttributes: ["id"],
        isUnique: true
      }
    },
    leftArm: {
      __proto__: null,
      personByMyPersonId: {
        localCodec: leftArmCodec,
        remoteResourceOptions: person_resourceOptionsConfig,
        localAttributes: ["person_id"],
        remoteAttributes: ["id"],
        isUnique: true
      }
    },
    person: {
      __proto__: null,
      personSecretByTheirPersonId: {
        localCodec: personCodec,
        remoteResourceOptions: person_secret_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["person_id"],
        isUnique: true,
        isReferencee: true,
        description: "This `Person`'s `PersonSecret`.",
        extensions: {
          tags: {
            forwardDescription: "The `Person` this `PersonSecret` belongs to.",
            backwardDescription: "This `Person`'s `PersonSecret`."
          }
        }
      },
      leftArmByTheirPersonId: {
        localCodec: personCodec,
        remoteResourceOptions: left_arm_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["person_id"],
        isUnique: true,
        isReferencee: true
      },
      compoundKeysByTheirPersonId1: {
        localCodec: personCodec,
        remoteResourceOptions: compound_key_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["person_id_1"],
        isReferencee: true
      },
      compoundKeysByTheirPersonId2: {
        localCodec: personCodec,
        remoteResourceOptions: compound_key_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["person_id_2"],
        isReferencee: true
      }
    },
    personSecret: {
      __proto__: null,
      personByMyPersonId: {
        localCodec: personSecretCodec,
        remoteResourceOptions: person_resourceOptionsConfig,
        localAttributes: ["person_id"],
        remoteAttributes: ["id"],
        isUnique: true,
        description: "The `Person` this `PersonSecret` belongs to.",
        extensions: {
          tags: {
            forwardDescription: "The `Person` this `PersonSecret` belongs to.",
            backwardDescription: "This `Person`'s `PersonSecret`."
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
const EMPTY_ARRAY = Object.freeze([]);
const makeArgs_person_computed_out = () => EMPTY_ARRAY;
const resource_current_user_idPgResource = registry.pgResources["current_user_id"];
const resource_func_outPgResource = registry.pgResources["func_out"];
const resource_func_out_setofPgResource = registry.pgResources["func_out_setof"];
function applyFirstArg(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function applyOffsetArg(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
const resource_func_out_unnamedPgResource = registry.pgResources["func_out_unnamed"];
const resource_no_args_queryPgResource = registry.pgResources["no_args_query"];
const argDetailsSimple_func_in_out = [{
  graphqlArgName: "i",
  pgCodec: TYPES.int,
  postgresArgName: "i",
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
const makeArgs_func_in_out = (args, path = []) => argDetailsSimple_func_in_out.map(details => makeArg(path, args, details));
const resource_func_in_outPgResource = registry.pgResources["func_in_out"];
const argDetailsSimple_func_returns_table_one_col = [{
  graphqlArgName: "i",
  pgCodec: TYPES.int,
  postgresArgName: "i",
  required: true
}];
const makeArgs_func_returns_table_one_col = (args, path = []) => argDetailsSimple_func_returns_table_one_col.map(details => makeArg(path, args, details));
const resource_func_returns_table_one_colPgResource = registry.pgResources["func_returns_table_one_col"];
const argDetailsSimple_json_identity = [{
  graphqlArgName: "json",
  pgCodec: TYPES.json,
  postgresArgName: "json",
  required: true
}];
const makeArgs_json_identity = (args, path = []) => argDetailsSimple_json_identity.map(details => makeArg(path, args, details));
const resource_json_identityPgResource = registry.pgResources["json_identity"];
const argDetailsSimple_jsonb_identity = [{
  graphqlArgName: "json",
  pgCodec: TYPES.jsonb,
  postgresArgName: "json",
  required: true
}];
const makeArgs_jsonb_identity = (args, path = []) => argDetailsSimple_jsonb_identity.map(details => makeArg(path, args, details));
const resource_jsonb_identityPgResource = registry.pgResources["jsonb_identity"];
const argDetailsSimple_func_in_inout = [{
  graphqlArgName: "i",
  pgCodec: TYPES.int,
  postgresArgName: "i",
  required: true
}, {
  graphqlArgName: "ino",
  pgCodec: TYPES.int,
  postgresArgName: "ino",
  required: true
}];
const makeArgs_func_in_inout = (args, path = []) => argDetailsSimple_func_in_inout.map(details => makeArg(path, args, details));
const resource_func_in_inoutPgResource = registry.pgResources["func_in_inout"];
const resource_func_out_outPgResource = registry.pgResources["func_out_out"];
const resource_func_out_out_setofPgResource = registry.pgResources["func_out_out_setof"];
const resource_func_out_out_unnamedPgResource = registry.pgResources["func_out_out_unnamed"];
const resource_func_out_unnamed_out_out_unnamedPgResource = registry.pgResources["func_out_unnamed_out_out_unnamed"];
const argDetailsSimple_int_set_query = [{
  graphqlArgName: "x",
  pgCodec: TYPES.int,
  postgresArgName: "x",
  required: true
}, {
  graphqlArgName: "y",
  pgCodec: TYPES.int,
  postgresArgName: "y",
  required: true
}, {
  graphqlArgName: "z",
  pgCodec: TYPES.int,
  postgresArgName: "z",
  required: true
}];
const makeArgs_int_set_query = (args, path = []) => argDetailsSimple_int_set_query.map(details => makeArg(path, args, details));
const resource_int_set_queryPgResource = registry.pgResources["int_set_query"];
const argDetailsSimple_func_returns_table_multi_col = [{
  graphqlArgName: "i",
  pgCodec: TYPES.int,
  postgresArgName: "i",
  required: true
}, {
  graphqlArgName: "a",
  pgCodec: TYPES.int,
  postgresArgName: "a"
}, {
  graphqlArgName: "b",
  pgCodec: TYPES.int,
  postgresArgName: "b"
}];
const makeArgs_func_returns_table_multi_col = (args, path = []) => argDetailsSimple_func_returns_table_multi_col.map(details => makeArg(path, args, details));
const resource_func_returns_table_multi_colPgResource = registry.pgResources["func_returns_table_multi_col"];
const resource_search_test_summariesPgResource = registry.pgResources["search_test_summaries"];
const resource_return_table_without_grantsPgResource = registry.pgResources["return_table_without_grants"];
const argDetailsSimple_types_query = [{
  graphqlArgName: "a",
  pgCodec: TYPES.bigint,
  postgresArgName: "a",
  required: true
}, {
  graphqlArgName: "b",
  pgCodec: TYPES.boolean,
  postgresArgName: "b",
  required: true
}, {
  graphqlArgName: "c",
  pgCodec: TYPES.varchar,
  postgresArgName: "c",
  required: true
}, {
  graphqlArgName: "d",
  pgCodec: LIST_TYPES.int,
  postgresArgName: "d",
  required: true
}, {
  graphqlArgName: "e",
  pgCodec: TYPES.json,
  postgresArgName: "e",
  required: true
}, {
  graphqlArgName: "f",
  pgCodec: floatrangeCodec,
  postgresArgName: "f",
  required: true
}];
const makeArgs_types_query = (args, path = []) => argDetailsSimple_types_query.map(details => makeArg(path, args, details));
const resource_types_queryPgResource = registry.pgResources["types_query"];
const argDetailsSimple_func_out_out_compound_type = [{
  graphqlArgName: "i1",
  pgCodec: TYPES.int,
  postgresArgName: "i1",
  required: true
}];
const makeArgs_func_out_out_compound_type = (args, path = []) => argDetailsSimple_func_out_out_compound_type.map(details => makeArg(path, args, details));
const resource_func_out_out_compound_typePgResource = registry.pgResources["func_out_out_compound_type"];
const argDetailsSimple_query_output_two_rows = [{
  graphqlArgName: "leftArmId",
  pgCodec: TYPES.int,
  postgresArgName: "left_arm_id",
  required: true
}, {
  graphqlArgName: "postId",
  pgCodec: TYPES.int,
  postgresArgName: "post_id",
  required: true
}, {
  graphqlArgName: "txt",
  pgCodec: TYPES.text,
  postgresArgName: "txt",
  required: true
}];
const makeArgs_query_output_two_rows = (args, path = []) => argDetailsSimple_query_output_two_rows.map(details => makeArg(path, args, details));
const resource_query_output_two_rowsPgResource = registry.pgResources["query_output_two_rows"];
const resource_compound_type_set_queryPgResource = registry.pgResources["compound_type_set_query"];
const argDetailsSimple_table_query = [{
  graphqlArgName: "id",
  pgCodec: TYPES.int,
  postgresArgName: "id",
  required: true
}];
const makeArgs_table_query = (args, path = []) => argDetailsSimple_table_query.map(details => makeArg(path, args, details));
const resource_table_queryPgResource = registry.pgResources["table_query"];
const argDetailsSimple_func_out_complex = [{
  graphqlArgName: "a",
  pgCodec: TYPES.int,
  postgresArgName: "a",
  required: true
}, {
  graphqlArgName: "b",
  pgCodec: TYPES.text,
  postgresArgName: "b",
  required: true
}];
const makeArgs_func_out_complex = (args, path = []) => argDetailsSimple_func_out_complex.map(details => makeArg(path, args, details));
const resource_func_out_complexPgResource = registry.pgResources["func_out_complex"];
const argDetailsSimple_func_out_complex_setof = [{
  graphqlArgName: "a",
  pgCodec: TYPES.int,
  postgresArgName: "a",
  required: true
}, {
  graphqlArgName: "b",
  pgCodec: TYPES.text,
  postgresArgName: "b",
  required: true
}];
const makeArgs_func_out_complex_setof = (args, path = []) => argDetailsSimple_func_out_complex_setof.map(details => makeArg(path, args, details));
const resource_func_out_complex_setofPgResource = registry.pgResources["func_out_complex_setof"];
const resource_badly_behaved_functionPgResource = registry.pgResources["badly_behaved_function"];
const resource_func_out_tablePgResource = registry.pgResources["func_out_table"];
const resource_func_out_table_setofPgResource = registry.pgResources["func_out_table_setof"];
const resource_table_set_queryPgResource = registry.pgResources["table_set_query"];
function qbWhereBuilder(qb) {
  return qb.whereBuilder();
}
const applyConditionArg = (_condition, $select, arg) => {
  arg.apply($select, qbWhereBuilder);
};
function applyOrderByArg(parent, $select, value) {
  value.apply($select);
}
const resource_table_set_query_plpgsqlPgResource = registry.pgResources["table_set_query_plpgsql"];
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
const nodeIdHandler_MyTable = makeTableNodeIdHandler({
  typeName: "MyTable",
  identifier: "my_tables",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_my_tablePgResource,
  pk: my_tableUniques[0].attributes
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
const nodeFetcher_MyTable = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_MyTable));
  return nodeIdHandler_MyTable.get(nodeIdHandler_MyTable.getSpec($decoded));
};
const nodeIdHandler_PersonSecret = makeTableNodeIdHandler({
  typeName: "PersonSecret",
  identifier: "person_secrets",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_person_secretPgResource,
  pk: person_secretUniques[0].attributes,
  deprecationReason: "This is deprecated (comment on table c.person_secret)."
});
const nodeFetcher_PersonSecret = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandler_PersonSecret);
const nodeIdHandler_CompoundKey = makeTableNodeIdHandler({
  typeName: "CompoundKey",
  identifier: "compound_keys",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_compound_keyPgResource,
  pk: compound_keyUniques[0].attributes
});
const nodeFetcher_CompoundKey = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_CompoundKey));
  return nodeIdHandler_CompoundKey.get(nodeIdHandler_CompoundKey.getSpec($decoded));
};
const nodeIdHandler_NullTestRecord = makeTableNodeIdHandler({
  typeName: "NullTestRecord",
  identifier: "null_test_records",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_null_test_recordPgResource,
  pk: null_test_recordUniques[0].attributes
});
const nodeFetcher_NullTestRecord = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_NullTestRecord));
  return nodeIdHandler_NullTestRecord.get(nodeIdHandler_NullTestRecord.getSpec($decoded));
};
const nodeIdHandler_LeftArm = makeTableNodeIdHandler({
  typeName: "LeftArm",
  identifier: "left_arms",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_left_armPgResource,
  pk: left_armUniques[0].attributes
});
const nodeFetcher_LeftArm = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_LeftArm));
  return nodeIdHandler_LeftArm.get(nodeIdHandler_LeftArm.getSpec($decoded));
};
const nodeIdHandler_Issue756 = makeTableNodeIdHandler({
  typeName: "Issue756",
  identifier: "issue756S",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_issue756PgResource,
  pk: issue756Uniques[0].attributes
});
const nodeFetcher_Issue756 = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Issue756));
  return nodeIdHandler_Issue756.get(nodeIdHandler_Issue756.getSpec($decoded));
};
const nodeIdHandler_Person = makeTableNodeIdHandler({
  typeName: "Person",
  identifier: "people",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_personPgResource,
  pk: personUniques[0].attributes
});
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
const PersonSecret_personIdPlan = $record => {
  return $record.get("person_id");
};
const PersonSecret_personByPersonIdPlan = $record => resource_personPgResource.get({
  id: $record.get("person_id")
});
const resource_person_computed_outPgResource = registry.pgResources["person_computed_out"];
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
const resource_person_first_namePgResource = registry.pgResources["person_first_name"];
const resource_person_computed_out_outPgResource = registry.pgResources["person_computed_out_out"];
const argDetailsSimple_person_computed_inout = [{
  graphqlArgName: "ino",
  pgCodec: TYPES.text,
  postgresArgName: "ino",
  required: true
}];
const makeArgs_person_computed_inout = (args, path = []) => argDetailsSimple_person_computed_inout.map(details => makeArg(path, args, details));
const resource_person_computed_inoutPgResource = registry.pgResources["person_computed_inout"];
const argDetailsSimple_person_computed_inout_out = [{
  graphqlArgName: "ino",
  pgCodec: TYPES.text,
  postgresArgName: "ino",
  required: true
}];
const makeArgs_person_computed_inout_out = (args, path = []) => argDetailsSimple_person_computed_inout_out.map(details => makeArg(path, args, details));
const resource_person_computed_inout_outPgResource = registry.pgResources["person_computed_inout_out"];
const argDetailsSimple_person_exists = [{
  graphqlArgName: "email",
  pgCodec: emailCodec,
  postgresArgName: "email",
  required: true
}];
const makeArgs_person_exists = (args, path = []) => argDetailsSimple_person_exists.map(details => makeArg(path, args, details));
const resource_person_existsPgResource = registry.pgResources["person_exists"];
const resource_person_computed_first_arg_inout_outPgResource = registry.pgResources["person_computed_first_arg_inout_out"];
const argDetailsSimple_person_optional_missing_middle_1 = [{
  graphqlArgName: "arg0",
  pgCodec: TYPES.int,
  required: true
}, {
  graphqlArgName: "b",
  pgCodec: TYPES.int,
  postgresArgName: "b"
}, {
  graphqlArgName: "c",
  pgCodec: TYPES.int,
  postgresArgName: "c"
}];
const makeArgs_person_optional_missing_middle_1 = (args, path = []) => argDetailsSimple_person_optional_missing_middle_1.map(details => makeArg(path, args, details));
const resource_person_optional_missing_middle_1PgResource = registry.pgResources["person_optional_missing_middle_1"];
const argDetailsSimple_person_optional_missing_middle_2 = [{
  graphqlArgName: "a",
  pgCodec: TYPES.int,
  postgresArgName: "a",
  required: true
}, {
  graphqlArgName: "b",
  pgCodec: TYPES.int,
  postgresArgName: "b"
}, {
  graphqlArgName: "c",
  pgCodec: TYPES.int,
  postgresArgName: "c"
}];
const makeArgs_person_optional_missing_middle_2 = (args, path = []) => argDetailsSimple_person_optional_missing_middle_2.map(details => makeArg(path, args, details));
const resource_person_optional_missing_middle_2PgResource = registry.pgResources["person_optional_missing_middle_2"];
const argDetailsSimple_person_optional_missing_middle_3 = [{
  graphqlArgName: "a",
  pgCodec: TYPES.int,
  postgresArgName: "a",
  required: true
}, {
  graphqlArgName: "arg1",
  pgCodec: TYPES.int
}, {
  graphqlArgName: "c",
  pgCodec: TYPES.int,
  postgresArgName: "c"
}];
const makeArgs_person_optional_missing_middle_3 = (args, path = []) => argDetailsSimple_person_optional_missing_middle_3.map(details => makeArg(path, args, details));
const resource_person_optional_missing_middle_3PgResource = registry.pgResources["person_optional_missing_middle_3"];
const argDetailsSimple_person_optional_missing_middle_4 = [{
  graphqlArgName: "arg0",
  pgCodec: TYPES.int,
  required: true
}, {
  graphqlArgName: "b",
  pgCodec: TYPES.int,
  postgresArgName: "b"
}, {
  graphqlArgName: "arg2",
  pgCodec: TYPES.int
}];
const makeArgs_person_optional_missing_middle_4 = (args, path = []) => argDetailsSimple_person_optional_missing_middle_4.map(details => makeArg(path, args, details));
const resource_person_optional_missing_middle_4PgResource = registry.pgResources["person_optional_missing_middle_4"];
const argDetailsSimple_person_optional_missing_middle_5 = [{
  graphqlArgName: "a",
  pgCodec: TYPES.int,
  postgresArgName: "a",
  required: true
}, {
  graphqlArgName: "arg1",
  pgCodec: TYPES.int
}, {
  graphqlArgName: "arg2",
  pgCodec: TYPES.int
}];
const makeArgs_person_optional_missing_middle_5 = (args, path = []) => argDetailsSimple_person_optional_missing_middle_5.map(details => makeArg(path, args, details));
const resource_person_optional_missing_middle_5PgResource = registry.pgResources["person_optional_missing_middle_5"];
const argDetailsSimple_person_computed_complex = [{
  graphqlArgName: "a",
  pgCodec: TYPES.int,
  postgresArgName: "a",
  required: true
}, {
  graphqlArgName: "b",
  pgCodec: TYPES.text,
  postgresArgName: "b",
  required: true
}];
const makeArgs_person_computed_complex = (args, path = []) => argDetailsSimple_person_computed_complex.map(details => makeArg(path, args, details));
const resource_person_computed_complexPgResource = registry.pgResources["person_computed_complex"];
const resource_person_first_postPgResource = registry.pgResources["person_first_post"];
const resource_person_computed_first_arg_inoutPgResource = registry.pgResources["person_computed_first_arg_inout"];
const resource_person_friendsPgResource = registry.pgResources["person_friends"];
const resource_person_type_function_connectionPgResource = registry.pgResources["person_type_function_connection"];
const argDetailsSimple_person_type_function = [{
  graphqlArgName: "id",
  pgCodec: TYPES.int,
  postgresArgName: "id",
  required: true
}];
const makeArgs_person_type_function = (args, path = []) => argDetailsSimple_person_type_function.map(details => makeArg(path, args, details));
const resource_person_type_functionPgResource = registry.pgResources["person_type_function"];
const resource_person_type_function_listPgResource = registry.pgResources["person_type_function_list"];
const resource_frmcdc_wrappedUrlPgResource = registry.pgResources["frmcdc_wrappedUrl"];
const resource_frmcdc_compoundTypePgResource = registry.pgResources["frmcdc_compoundType"];
const PersonComputedComplexRecord_yPlan = $record => {
  const $plan = $record.get("y");
  const $select = pgSelectSingleFromRecord(resource_frmcdc_compoundTypePgResource, $plan);
  $select.getClassStep().setTrusted();
  return $select;
};
const PersonComputedComplexRecord_zPlan = $record => {
  const $plan = $record.get("z");
  const $select = pgSelectSingleFromRecord(resource_personPgResource, $plan);
  $select.getClassStep().setTrusted();
  return $select;
};
const resource_compound_type_computed_fieldPgResource = registry.pgResources["compound_type_computed_field"];
function toString(value) {
  return "" + value;
}
const coerce = string => {
  if (!/^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i.test(string)) {
    throw new GraphQLError("Invalid UUID, expected 32 hexadecimal characters, optionally with hyphens");
  }
  return string;
};
const resource_frmcdc_comptypePgResource = registry.pgResources["frmcdc_comptype"];
const DatetimeParseLiteral = ast => {
  if (ast.kind === Kind.STRING) {
    return ast.value;
  }
  throw new GraphQLError(`Datetime can only parse string values (kind='${ast.kind}')`);
};
const applyOrderByCustomField = (pgFieldSource, ascDesc, pgOrderByNullsLast, queryBuilder) => {
  if (typeof pgFieldSource.from !== "function") {
    throw new Error("Invalid computed attribute 'from'");
  }
  const expression = sql`${pgFieldSource.from({
    placeholder: queryBuilder.alias
  })}`;
  queryBuilder.orderBy({
    codec: pgFieldSource.codec,
    fragment: expression,
    direction: ascDesc.toUpperCase(),
    ...(pgOrderByNullsLast != null ? {
      nulls: pgOrderByNullsLast ? "LAST" : "FIRST"
    } : null)
  });
};
const PeopleOrderBy_ID_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "id",
    direction: "ASC"
  });
  queryBuilder.setOrderIsUnique();
};
const PeopleOrderBy_ID_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "id",
    direction: "DESC"
  });
  queryBuilder.setOrderIsUnique();
};
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
function applyAttributeCondition(attributeName, attributeCodec, $condition, val) {
  $condition.where({
    type: "attribute",
    attribute: attributeName,
    callback(expression) {
      return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, attributeCodec)}`;
    }
  });
}
const FuncOutOutRecord_firstOutPlan = $record => {
  return $record.get("first_out");
};
const FuncOutOutRecord_secondOutPlan = $record => {
  return $record.get("second_out");
};
const FuncOutOutUnnamedRecord_arg1Plan = $record => {
  return $record.get("column1");
};
const FuncOutOutUnnamedRecord_arg2Plan = $record => {
  return $record.get("column2");
};
const FuncOutUnnamedOutOutUnnamedRecord_arg3Plan = $record => {
  return $record.get("column3");
};
const FuncOutOutCompoundTypeRecord_o2Plan = $record => {
  const $plan = $record.get("o2");
  const $select = pgSelectSingleFromRecord(resource_frmcdc_compoundTypePgResource, $plan);
  $select.getClassStep().setTrusted();
  return $select;
};
const resource_frmcdc_postPgResource = registry.pgResources["frmcdc_post"];
const PersonCondition_idApply = ($condition, val) => applyAttributeCondition("id", TYPES.int, $condition, val);
const PersonSecretCondition_personIdApply = ($condition, val) => applyAttributeCondition("person_id", TYPES.int, $condition, val);
const PersonSecretsOrderBy_PERSON_ID_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "person_id",
    direction: "ASC"
  });
  queryBuilder.setOrderIsUnique();
};
const PersonSecretsOrderBy_PERSON_ID_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "person_id",
    direction: "DESC"
  });
  queryBuilder.setOrderIsUnique();
};
const resource_edge_case_computedPgResource = registry.pgResources["edge_case_computed"];
const resource_mutation_outPgResource = registry.pgResources["mutation_out"];
function pgSelectFromPayload($payload) {
  const $result = $payload.getStepForKey("result");
  const $parent = "getParentStep" in $result ? $result.getParentStep() : $result;
  const $pgSelect = "getClassStep" in $parent ? $parent.getClassStep() : $parent;
  if ($pgSelect instanceof PgSelectStep) {
    return $pgSelect;
  } else {
    throw new Error(`Could not determine PgSelectStep for ${$result}`);
  }
}
function applyInputArgViaPgSelect(_, $payload, arg) {
  const $pgSelect = pgSelectFromPayload($payload);
  arg.apply($pgSelect);
}
const resource_mutation_out_setofPgResource = registry.pgResources["mutation_out_setof"];
const resource_mutation_out_unnamedPgResource = registry.pgResources["mutation_out_unnamed"];
const resource_no_args_mutationPgResource = registry.pgResources["no_args_mutation"];
const argDetailsSimple_mutation_in_out = [{
  graphqlArgName: "i",
  pgCodec: TYPES.int,
  postgresArgName: "i",
  required: true
}];
const makeArgs_mutation_in_out = (args, path = []) => argDetailsSimple_mutation_in_out.map(details => makeArg(path, args, details));
const resource_mutation_in_outPgResource = registry.pgResources["mutation_in_out"];
const argDetailsSimple_mutation_returns_table_one_col = [{
  graphqlArgName: "i",
  pgCodec: TYPES.int,
  postgresArgName: "i",
  required: true
}];
const makeArgs_mutation_returns_table_one_col = (args, path = []) => argDetailsSimple_mutation_returns_table_one_col.map(details => makeArg(path, args, details));
const resource_mutation_returns_table_one_colPgResource = registry.pgResources["mutation_returns_table_one_col"];
const argDetailsSimple_json_identity_mutation = [{
  graphqlArgName: "json",
  pgCodec: TYPES.json,
  postgresArgName: "json",
  required: true
}];
const makeArgs_json_identity_mutation = (args, path = []) => argDetailsSimple_json_identity_mutation.map(details => makeArg(path, args, details));
const resource_json_identity_mutationPgResource = registry.pgResources["json_identity_mutation"];
const argDetailsSimple_jsonb_identity_mutation = [{
  graphqlArgName: "json",
  pgCodec: TYPES.jsonb,
  postgresArgName: "json",
  required: true
}];
const makeArgs_jsonb_identity_mutation = (args, path = []) => argDetailsSimple_jsonb_identity_mutation.map(details => makeArg(path, args, details));
const resource_jsonb_identity_mutationPgResource = registry.pgResources["jsonb_identity_mutation"];
const argDetailsSimple_jsonb_identity_mutation_plpgsql = [{
  graphqlArgName: "_theJson",
  pgCodec: TYPES.jsonb,
  postgresArgName: "_the_json",
  required: true
}];
const makeArgs_jsonb_identity_mutation_plpgsql = (args, path = []) => argDetailsSimple_jsonb_identity_mutation_plpgsql.map(details => makeArg(path, args, details));
const resource_jsonb_identity_mutation_plpgsqlPgResource = registry.pgResources["jsonb_identity_mutation_plpgsql"];
const argDetailsSimple_jsonb_identity_mutation_plpgsql_with_default = [{
  graphqlArgName: "_theJson",
  pgCodec: TYPES.jsonb,
  postgresArgName: "_the_json"
}];
const makeArgs_jsonb_identity_mutation_plpgsql_with_default = (args, path = []) => argDetailsSimple_jsonb_identity_mutation_plpgsql_with_default.map(details => makeArg(path, args, details));
const resource_jsonb_identity_mutation_plpgsql_with_defaultPgResource = registry.pgResources["jsonb_identity_mutation_plpgsql_with_default"];
const argDetailsSimple_mutation_in_inout = [{
  graphqlArgName: "i",
  pgCodec: TYPES.int,
  postgresArgName: "i",
  required: true
}, {
  graphqlArgName: "ino",
  pgCodec: TYPES.int,
  postgresArgName: "ino",
  required: true
}];
const makeArgs_mutation_in_inout = (args, path = []) => argDetailsSimple_mutation_in_inout.map(details => makeArg(path, args, details));
const resource_mutation_in_inoutPgResource = registry.pgResources["mutation_in_inout"];
const resource_mutation_out_outPgResource = registry.pgResources["mutation_out_out"];
const resource_mutation_out_out_setofPgResource = registry.pgResources["mutation_out_out_setof"];
const resource_mutation_out_out_unnamedPgResource = registry.pgResources["mutation_out_out_unnamed"];
const argDetailsSimple_int_set_mutation = [{
  graphqlArgName: "x",
  pgCodec: TYPES.int,
  postgresArgName: "x",
  required: true
}, {
  graphqlArgName: "y",
  pgCodec: TYPES.int,
  postgresArgName: "y",
  required: true
}, {
  graphqlArgName: "z",
  pgCodec: TYPES.int,
  postgresArgName: "z",
  required: true
}];
const makeArgs_int_set_mutation = (args, path = []) => argDetailsSimple_int_set_mutation.map(details => makeArg(path, args, details));
const resource_int_set_mutationPgResource = registry.pgResources["int_set_mutation"];
const resource_mutation_out_unnamed_out_out_unnamedPgResource = registry.pgResources["mutation_out_unnamed_out_out_unnamed"];
const argDetailsSimple_mutation_returns_table_multi_col = [{
  graphqlArgName: "i",
  pgCodec: TYPES.int,
  postgresArgName: "i",
  required: true
}];
const makeArgs_mutation_returns_table_multi_col = (args, path = []) => argDetailsSimple_mutation_returns_table_multi_col.map(details => makeArg(path, args, details));
const resource_mutation_returns_table_multi_colPgResource = registry.pgResources["mutation_returns_table_multi_col"];
const argDetailsSimple_left_arm_identity = [{
  graphqlArgName: "leftArm",
  pgCodec: leftArmCodec,
  postgresArgName: "left_arm",
  required: true
}];
const makeArgs_left_arm_identity = (args, path = []) => argDetailsSimple_left_arm_identity.map(details => makeArg(path, args, details));
const resource_left_arm_identityPgResource = registry.pgResources["left_arm_identity"];
const argDetailsSimple_types_mutation = [{
  graphqlArgName: "a",
  pgCodec: TYPES.bigint,
  postgresArgName: "a",
  required: true
}, {
  graphqlArgName: "b",
  pgCodec: TYPES.boolean,
  postgresArgName: "b",
  required: true
}, {
  graphqlArgName: "c",
  pgCodec: TYPES.varchar,
  postgresArgName: "c",
  required: true
}, {
  graphqlArgName: "d",
  pgCodec: LIST_TYPES.int,
  postgresArgName: "d",
  required: true
}, {
  graphqlArgName: "e",
  pgCodec: TYPES.json,
  postgresArgName: "e",
  required: true
}, {
  graphqlArgName: "f",
  pgCodec: floatrangeCodec,
  postgresArgName: "f",
  required: true
}];
const makeArgs_types_mutation = (args, path = []) => argDetailsSimple_types_mutation.map(details => makeArg(path, args, details));
const resource_types_mutationPgResource = registry.pgResources["types_mutation"];
const resource_issue756_mutationPgResource = registry.pgResources["issue756_mutation"];
const resource_issue756_set_mutationPgResource = registry.pgResources["issue756_set_mutation"];
const argDetailsSimple_mutation_out_out_compound_type = [{
  graphqlArgName: "i1",
  pgCodec: TYPES.int,
  postgresArgName: "i1",
  required: true
}];
const makeArgs_mutation_out_out_compound_type = (args, path = []) => argDetailsSimple_mutation_out_out_compound_type.map(details => makeArg(path, args, details));
const resource_mutation_out_out_compound_typePgResource = registry.pgResources["mutation_out_out_compound_type"];
const argDetailsSimple_table_mutation = [{
  graphqlArgName: "id",
  pgCodec: TYPES.int,
  postgresArgName: "id",
  required: true
}];
const makeArgs_table_mutation = (args, path = []) => argDetailsSimple_table_mutation.map(details => makeArg(path, args, details));
const resource_table_mutationPgResource = registry.pgResources["table_mutation"];
const argDetailsSimple_list_of_compound_types_mutation = [{
  graphqlArgName: "records",
  pgCodec: compoundTypeArrayCodec,
  postgresArgName: "records",
  required: true
}];
const makeArgs_list_of_compound_types_mutation = (args, path = []) => argDetailsSimple_list_of_compound_types_mutation.map(details => makeArg(path, args, details));
const resource_list_of_compound_types_mutationPgResource = registry.pgResources["list_of_compound_types_mutation"];
const argDetailsSimple_mutation_out_complex = [{
  graphqlArgName: "a",
  pgCodec: TYPES.int,
  postgresArgName: "a",
  required: true
}, {
  graphqlArgName: "b",
  pgCodec: TYPES.text,
  postgresArgName: "b",
  required: true
}];
const makeArgs_mutation_out_complex = (args, path = []) => argDetailsSimple_mutation_out_complex.map(details => makeArg(path, args, details));
const resource_mutation_out_complexPgResource = registry.pgResources["mutation_out_complex"];
const argDetailsSimple_mutation_out_complex_setof = [{
  graphqlArgName: "a",
  pgCodec: TYPES.int,
  postgresArgName: "a",
  required: true
}, {
  graphqlArgName: "b",
  pgCodec: TYPES.text,
  postgresArgName: "b",
  required: true
}];
const makeArgs_mutation_out_complex_setof = (args, path = []) => argDetailsSimple_mutation_out_complex_setof.map(details => makeArg(path, args, details));
const resource_mutation_out_complex_setofPgResource = registry.pgResources["mutation_out_complex_setof"];
const resource_mutation_out_tablePgResource = registry.pgResources["mutation_out_table"];
const resource_mutation_out_table_setofPgResource = registry.pgResources["mutation_out_table_setof"];
const resource_table_set_mutationPgResource = registry.pgResources["table_set_mutation"];
function applyInputToInsert(_, $object) {
  return $object;
}
const specFromArgs_MyTable = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_MyTable, $nodeId);
};
function applyInputToUpdateOrDelete(_, $object) {
  return $object;
}
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
function getClientMutationIdForCustomMutationPlan($object) {
  const $result = $object.getStepForKey("result");
  return $result.getMeta("clientMutationId");
}
const planCustomMutationPayloadResult = $object => {
  return $object.get("result");
};
function queryPlan() {
  return rootValue();
}
function applyClientMutationIdForCustomMutation(qb, val) {
  qb.setMeta("clientMutationId", val);
}
const LeftArmIdentityPayload_personByPersonIdPlan = $record => resource_personPgResource.get({
  id: $record.get("result").get("person_id")
});
function LeftArmBaseInput_idApply(obj, val, info) {
  obj.set("id", bakedInputRuntime(info.schema, info.field.type, val));
}
function LeftArmBaseInput_personIdApply(obj, val, info) {
  obj.set("person_id", bakedInputRuntime(info.schema, info.field.type, val));
}
function LeftArmBaseInput_lengthInMetresApply(obj, val, info) {
  obj.set("length_in_metres", bakedInputRuntime(info.schema, info.field.type, val));
}
function LeftArmBaseInput_moodApply(obj, val, info) {
  obj.set("mood", bakedInputRuntime(info.schema, info.field.type, val));
}
function getClientMutationIdForCreatePlan($mutation) {
  const $insert = $mutation.getStepForKey("result");
  return $insert.getMeta("clientMutationId");
}
function planCreatePayloadResult($object) {
  return $object.get("result");
}
function applyCreateFields(qb, arg) {
  if (arg != null) {
    return qb.setBuilder();
  }
}
function MyTableInput_jsonDataApply(obj, val, info) {
  obj.set("json_data", bakedInputRuntime(info.schema, info.field.type, val));
}
function PersonSecretInput_secretApply(obj, val, info) {
  obj.set("sekrit", bakedInputRuntime(info.schema, info.field.type, val));
}
const CreateCompoundKeyPayload_personByPersonId1Plan = $record => resource_personPgResource.get({
  id: $record.get("result").get("person_id_1")
});
const CreateCompoundKeyPayload_personByPersonId2Plan = $record => resource_personPgResource.get({
  id: $record.get("result").get("person_id_2")
});
function CompoundKeyInput_personId2Apply(obj, val, info) {
  obj.set("person_id_2", bakedInputRuntime(info.schema, info.field.type, val));
}
function CompoundKeyInput_personId1Apply(obj, val, info) {
  obj.set("person_id_1", bakedInputRuntime(info.schema, info.field.type, val));
}
function CompoundKeyInput_extraApply(obj, val, info) {
  obj.set("extra", bakedInputRuntime(info.schema, info.field.type, val));
}
function NullTestRecordInput_nullableTextApply(obj, val, info) {
  obj.set("nullable_text", bakedInputRuntime(info.schema, info.field.type, val));
}
function NullTestRecordInput_nullableIntApply(obj, val, info) {
  obj.set("nullable_int", bakedInputRuntime(info.schema, info.field.type, val));
}
function NullTestRecordInput_nonNullTextApply(obj, val, info) {
  obj.set("non_null_text", bakedInputRuntime(info.schema, info.field.type, val));
}
function Issue756Input_tsApply(obj, val, info) {
  obj.set("ts", bakedInputRuntime(info.schema, info.field.type, val));
}
function PersonInput_nameApply(obj, val, info) {
  obj.set("person_full_name", bakedInputRuntime(info.schema, info.field.type, val));
}
function PersonInput_aliasesApply(obj, val, info) {
  obj.set("aliases", bakedInputRuntime(info.schema, info.field.type, val));
}
function PersonInput_aboutApply(obj, val, info) {
  obj.set("about", bakedInputRuntime(info.schema, info.field.type, val));
}
function PersonInput_emailApply(obj, val, info) {
  obj.set("email", bakedInputRuntime(info.schema, info.field.type, val));
}
function PersonInput_siteApply(obj, val, info) {
  obj.set("site", bakedInputRuntime(info.schema, info.field.type, val));
}
function PersonInput_configApply(obj, val, info) {
  obj.set("config", bakedInputRuntime(info.schema, info.field.type, val));
}
function PersonInput_lastLoginFromIpApply(obj, val, info) {
  obj.set("last_login_from_ip", bakedInputRuntime(info.schema, info.field.type, val));
}
function PersonInput_lastLoginFromSubnetApply(obj, val, info) {
  obj.set("last_login_from_subnet", bakedInputRuntime(info.schema, info.field.type, val));
}
function PersonInput_userMacApply(obj, val, info) {
  obj.set("user_mac", bakedInputRuntime(info.schema, info.field.type, val));
}
function PersonInput_createdAtApply(obj, val, info) {
  obj.set("created_at", bakedInputRuntime(info.schema, info.field.type, val));
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
  funcOutSetofList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int
  ): [Int!]
  funcOutUnnamed: Int
  noArgsQuery: Int
  funcInOut(i: Int): Int
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
  funcOutOutSetofList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int
  ): [FuncOutOutSetofRecord!]
  funcOutOutUnnamed: FuncOutOutUnnamedRecord
  funcOutUnnamedOutOutUnnamed: FuncOutUnnamedOutOutUnnamedRecord
  intSetQueryList(
    x: Int
    y: Int
    z: Int

    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int
  ): [Int!]
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
  compoundTypeSetQueryList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int
  ): [CompoundType!]
  tableQuery(id: Int): Post
  funcOutComplex(a: Int, b: String): FuncOutComplexRecord
  funcOutComplexSetofList(
    a: Int
    b: String

    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int
  ): [FuncOutComplexSetofRecord!]
  badlyBehavedFunctionList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int
  ): [Person!] @deprecated(reason: "This is deprecated (comment on function c.badly_behaved_function).")
  funcOutTable: Person
  funcOutTableSetofList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int
  ): [Person!]
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
  friendsList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int

    """The method to use when ordering \`Person\`."""
    orderBy: [PeopleOrderBy!]
  ): [Person!]
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
  jsonpath: JSONPath
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

"""A string representing an SQL/JSONPath expression"""
scalar JSONPath

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

type FuncOutOutRecord {
  firstOut: Int
  secondOut: String
}

type FuncOutOutSetofRecord {
  o1: Int
  o2: String
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

type FuncReturnsTableMultiColRecord {
  col1: Int
  col2: String
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

type FuncOutComplexRecord {
  x: Int
  y: CompoundType
  z: Person
}

type FuncOutComplexSetofRecord {
  x: Int
  y: CompoundType
  z: Person
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
  typesMutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: TypesMutationInput!
  ): TypesMutationPayload
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
export const objects = {
  Query: {
    assertStep() {
      return true;
    },
    plans: {
      allCompoundKeysList: {
        plan() {
          return resource_compound_keyPgResource.find();
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg,
          condition: applyConditionArg,
          orderBy: applyOrderByArg
        }
      },
      allEdgeCasesList: {
        plan() {
          return resource_edge_casePgResource.find();
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg,
          condition: applyConditionArg,
          orderBy: applyOrderByArg
        }
      },
      allIssue756SList: {
        plan() {
          return resource_issue756PgResource.find();
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg,
          condition: applyConditionArg,
          orderBy: applyOrderByArg
        }
      },
      allLeftArmsList: {
        plan() {
          return resource_left_armPgResource.find();
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg,
          condition: applyConditionArg,
          orderBy: applyOrderByArg
        }
      },
      allMyTablesList: {
        plan() {
          return resource_my_tablePgResource.find();
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg,
          condition: applyConditionArg,
          orderBy: applyOrderByArg
        }
      },
      allNullTestRecordsList: {
        plan() {
          return resource_null_test_recordPgResource.find();
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg,
          condition: applyConditionArg,
          orderBy: applyOrderByArg
        }
      },
      allPeopleList: {
        plan() {
          return resource_personPgResource.find();
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg,
          condition: applyConditionArg,
          orderBy: applyOrderByArg
        }
      },
      allPersonSecretsList: {
        plan() {
          return resource_person_secretPgResource.find();
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg,
          condition: applyConditionArg,
          orderBy: applyOrderByArg
        }
      },
      badlyBehavedFunctionList: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_person_computed_out(args);
          return resource_badly_behaved_functionPgResource.execute(selectArgs);
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg
        }
      },
      compoundKey(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_CompoundKey($nodeId);
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
      compoundTypeSetQueryList: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_person_computed_out(args);
          return resource_compound_type_set_queryPgResource.execute(selectArgs);
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg
        }
      },
      currentUserId($root, args, _info) {
        const selectArgs = makeArgs_person_computed_out(args);
        return resource_current_user_idPgResource.execute(selectArgs);
      },
      funcInInout($root, args, _info) {
        const selectArgs = makeArgs_func_in_inout(args);
        return resource_func_in_inoutPgResource.execute(selectArgs);
      },
      funcInOut($root, args, _info) {
        const selectArgs = makeArgs_func_in_out(args);
        return resource_func_in_outPgResource.execute(selectArgs);
      },
      funcOut($root, args, _info) {
        const selectArgs = makeArgs_person_computed_out(args);
        return resource_func_outPgResource.execute(selectArgs);
      },
      funcOutComplex($root, args, _info) {
        const selectArgs = makeArgs_func_out_complex(args);
        return resource_func_out_complexPgResource.execute(selectArgs);
      },
      funcOutComplexSetofList: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_func_out_complex_setof(args);
          return resource_func_out_complex_setofPgResource.execute(selectArgs);
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg
        }
      },
      funcOutOut($root, args, _info) {
        const selectArgs = makeArgs_person_computed_out(args);
        return resource_func_out_outPgResource.execute(selectArgs);
      },
      funcOutOutCompoundType($root, args, _info) {
        const selectArgs = makeArgs_func_out_out_compound_type(args);
        return resource_func_out_out_compound_typePgResource.execute(selectArgs);
      },
      funcOutOutSetofList: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_person_computed_out(args);
          return resource_func_out_out_setofPgResource.execute(selectArgs);
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg
        }
      },
      funcOutOutUnnamed($root, args, _info) {
        const selectArgs = makeArgs_person_computed_out(args);
        return resource_func_out_out_unnamedPgResource.execute(selectArgs);
      },
      funcOutSetofList: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_person_computed_out(args);
          return resource_func_out_setofPgResource.execute(selectArgs);
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg
        }
      },
      funcOutTable($root, args, _info) {
        const selectArgs = makeArgs_person_computed_out(args);
        return resource_func_out_tablePgResource.execute(selectArgs);
      },
      funcOutTableSetofList: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_person_computed_out(args);
          return resource_func_out_table_setofPgResource.execute(selectArgs);
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg
        }
      },
      funcOutUnnamed($root, args, _info) {
        const selectArgs = makeArgs_person_computed_out(args);
        return resource_func_out_unnamedPgResource.execute(selectArgs);
      },
      funcOutUnnamedOutOutUnnamed($root, args, _info) {
        const selectArgs = makeArgs_person_computed_out(args);
        return resource_func_out_unnamed_out_out_unnamedPgResource.execute(selectArgs);
      },
      funcReturnsTableMultiColList: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_func_returns_table_multi_col(args);
          return resource_func_returns_table_multi_colPgResource.execute(selectArgs);
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg
        }
      },
      funcReturnsTableOneColList: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_func_returns_table_one_col(args);
          return resource_func_returns_table_one_colPgResource.execute(selectArgs);
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg
        }
      },
      intSetQueryList: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_int_set_query(args);
          return resource_int_set_queryPgResource.execute(selectArgs);
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg
        }
      },
      issue756(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_Issue756($nodeId);
      },
      issue756ById(_$root, {
        $id
      }) {
        return resource_issue756PgResource.get({
          id: $id
        });
      },
      jsonbIdentity($root, args, _info) {
        const selectArgs = makeArgs_jsonb_identity(args);
        return resource_jsonb_identityPgResource.execute(selectArgs);
      },
      jsonIdentity($root, args, _info) {
        const selectArgs = makeArgs_json_identity(args);
        return resource_json_identityPgResource.execute(selectArgs);
      },
      leftArm(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_LeftArm($nodeId);
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
      myTable(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_MyTable($nodeId);
      },
      myTableById(_$root, {
        $id
      }) {
        return resource_my_tablePgResource.get({
          id: $id
        });
      },
      noArgsQuery($root, args, _info) {
        const selectArgs = makeArgs_person_computed_out(args);
        return resource_no_args_queryPgResource.execute(selectArgs);
      },
      node(_$root, fieldArgs) {
        return fieldArgs.getRaw("nodeId");
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_Query.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Query.codec.name].encode);
      },
      nullTestRecord(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_NullTestRecord($nodeId);
      },
      nullTestRecordById(_$root, {
        $id
      }) {
        return resource_null_test_recordPgResource.get({
          id: $id
        });
      },
      person(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_Person($nodeId);
      },
      personByEmail(_$root, {
        $email
      }) {
        return resource_personPgResource.get({
          email: $email
        });
      },
      personById(_$root, {
        $id
      }) {
        return resource_personPgResource.get({
          id: $id
        });
      },
      personSecret(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_PersonSecret($nodeId);
      },
      personSecretByPersonId(_$root, {
        $personId
      }) {
        return resource_person_secretPgResource.get({
          person_id: $personId
        });
      },
      query() {
        return rootValue();
      },
      queryOutputTwoRows($root, args, _info) {
        const selectArgs = makeArgs_query_output_two_rows(args);
        return resource_query_output_two_rowsPgResource.execute(selectArgs);
      },
      returnTableWithoutGrants($root, args, _info) {
        const selectArgs = makeArgs_person_computed_out(args);
        return resource_return_table_without_grantsPgResource.execute(selectArgs);
      },
      searchTestSummariesList: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_person_computed_out(args);
          return resource_search_test_summariesPgResource.execute(selectArgs);
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg
        }
      },
      tableQuery($root, args, _info) {
        const selectArgs = makeArgs_table_query(args);
        return resource_table_queryPgResource.execute(selectArgs);
      },
      tableSetQueryList: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_person_computed_out(args);
          return resource_table_set_queryPgResource.execute(selectArgs);
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg,
          condition: applyConditionArg,
          orderBy: applyOrderByArg
        }
      },
      tableSetQueryPlpgsqlList: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_person_computed_out(args);
          return resource_table_set_query_plpgsqlPgResource.execute(selectArgs);
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg
        }
      },
      typesQuery($root, args, _info) {
        const selectArgs = makeArgs_types_query(args);
        return resource_types_queryPgResource.execute(selectArgs);
      }
    }
  },
  Mutation: {
    assertStep: __ValueStep,
    plans: {
      createCompoundKey: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_compound_keyPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createEdgeCase: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_edge_casePgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createIssue756: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_issue756PgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createLeftArm: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_left_armPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createMyTable: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_my_tablePgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createNullTestRecord: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_null_test_recordPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createPerson: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_personPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createPersonSecret: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_person_secretPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      deleteCompoundKey: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_compound_keyPgResource, specFromArgs_CompoundKey(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
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
          input: applyInputToUpdateOrDelete
        }
      },
      deleteIssue756: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_issue756PgResource, specFromArgs_Issue756(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
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
          input: applyInputToUpdateOrDelete
        }
      },
      deleteLeftArm: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_left_armPgResource, specFromArgs_LeftArm(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
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
          input: applyInputToUpdateOrDelete
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
          input: applyInputToUpdateOrDelete
        }
      },
      deleteMyTable: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_my_tablePgResource, specFromArgs_MyTable(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
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
          input: applyInputToUpdateOrDelete
        }
      },
      deleteNullTestRecord: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_null_test_recordPgResource, specFromArgs_NullTestRecord(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
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
          input: applyInputToUpdateOrDelete
        }
      },
      deletePerson: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_personPgResource, specFromArgs_Person(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
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
          input: applyInputToUpdateOrDelete
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
          input: applyInputToUpdateOrDelete
        }
      },
      deletePersonSecret: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_person_secretPgResource, specFromArgs_PersonSecret(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
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
          input: applyInputToUpdateOrDelete
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
          input: applyInputArgViaPgSelect
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
          input: applyInputArgViaPgSelect
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
          input: applyInputArgViaPgSelect
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
          input: applyInputArgViaPgSelect
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
          input: applyInputArgViaPgSelect
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
          input: applyInputArgViaPgSelect
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
          input: applyInputArgViaPgSelect
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
          input: applyInputArgViaPgSelect
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
          input: applyInputArgViaPgSelect
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
          input: applyInputArgViaPgSelect
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
          input: applyInputArgViaPgSelect
        }
      },
      mutationOut: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_person_computed_out(args, ["input"]);
          const $result = resource_mutation_outPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
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
          input: applyInputArgViaPgSelect
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
          input: applyInputArgViaPgSelect
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
          input: applyInputArgViaPgSelect
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
          input: applyInputArgViaPgSelect
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
          input: applyInputArgViaPgSelect
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
          input: applyInputArgViaPgSelect
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
          input: applyInputArgViaPgSelect
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
          input: applyInputArgViaPgSelect
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
          input: applyInputArgViaPgSelect
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
          input: applyInputArgViaPgSelect
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
          input: applyInputArgViaPgSelect
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
          input: applyInputArgViaPgSelect
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
          input: applyInputArgViaPgSelect
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
          input: applyInputArgViaPgSelect
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
          input: applyInputArgViaPgSelect
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
          input: applyInputArgViaPgSelect
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
          input: applyInputArgViaPgSelect
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
          input: applyInputToUpdateOrDelete
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
          input: applyInputToUpdateOrDelete
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
          input: applyInputToUpdateOrDelete
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
          input: applyInputToUpdateOrDelete
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
          input: applyInputToUpdateOrDelete
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
          input: applyInputToUpdateOrDelete
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
          input: applyInputToUpdateOrDelete
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
          input: applyInputToUpdateOrDelete
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
          input: applyInputToUpdateOrDelete
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
          input: applyInputToUpdateOrDelete
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
          input: applyInputToUpdateOrDelete
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
          input: applyInputToUpdateOrDelete
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
          input: applyInputToUpdateOrDelete
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
          input: applyInputToUpdateOrDelete
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
          input: applyInputToUpdateOrDelete
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
          input: applyInputToUpdateOrDelete
        }
      }
    }
  },
  CompoundKey: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nodeId($parent) {
        const specifier = nodeIdHandler_CompoundKey.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_CompoundKey.codec.name].encode);
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
      },
      personId1($record) {
        return $record.get("person_id_1");
      },
      personId2($record) {
        return $record.get("person_id_2");
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of compound_keyUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_compound_keyPgResource.get(spec);
    }
  },
  CompoundType: {
    assertStep: assertPgClassSingleStep,
    plans: {
      computedField($in, args, _info) {
        return scalarComputed(resource_compound_type_computed_fieldPgResource, $in, makeArgs_person_computed_out(args));
      },
      fooBar($record) {
        return $record.get("foo_bar");
      }
    }
  },
  Comptype: {
    assertStep: assertPgClassSingleStep,
    plans: {
      isOptimised($record) {
        return $record.get("is_optimised");
      }
    }
  },
  CreateCompoundKeyPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      compoundKey: planCreatePayloadResult,
      personByPersonId1: CreateCompoundKeyPayload_personByPersonId1Plan,
      personByPersonId2: CreateCompoundKeyPayload_personByPersonId2Plan,
      query: queryPlan
    }
  },
  CreateEdgeCasePayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      edgeCase: planCreatePayloadResult,
      query: queryPlan
    }
  },
  CreateIssue756Payload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      issue756: planCreatePayloadResult,
      query: queryPlan
    }
  },
  CreateLeftArmPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      leftArm: planCreatePayloadResult,
      personByPersonId: LeftArmIdentityPayload_personByPersonIdPlan,
      query: queryPlan
    }
  },
  CreateMyTablePayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      myTable: planCreatePayloadResult,
      query: queryPlan
    }
  },
  CreateNullTestRecordPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      nullTestRecord: planCreatePayloadResult,
      query: queryPlan
    }
  },
  CreatePersonPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      person: planCreatePayloadResult,
      query: queryPlan
    }
  },
  CreatePersonSecretPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      personByPersonId: LeftArmIdentityPayload_personByPersonIdPlan,
      personSecret: planCreatePayloadResult,
      query: queryPlan
    }
  },
  DeleteCompoundKeyPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      compoundKey: planCreatePayloadResult,
      deletedCompoundKeyId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_CompoundKey.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      personByPersonId1: CreateCompoundKeyPayload_personByPersonId1Plan,
      personByPersonId2: CreateCompoundKeyPayload_personByPersonId2Plan,
      query: queryPlan
    }
  },
  DeleteIssue756Payload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedIssue756Id($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Issue756.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      issue756: planCreatePayloadResult,
      query: queryPlan
    }
  },
  DeleteLeftArmPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedLeftArmId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_LeftArm.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      leftArm: planCreatePayloadResult,
      personByPersonId: LeftArmIdentityPayload_personByPersonIdPlan,
      query: queryPlan
    }
  },
  DeleteMyTablePayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedMyTableId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_MyTable.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      myTable: planCreatePayloadResult,
      query: queryPlan
    }
  },
  DeleteNullTestRecordPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedNullTestRecordId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_NullTestRecord.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      nullTestRecord: planCreatePayloadResult,
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
      query: queryPlan
    }
  },
  DeletePersonSecretPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedPersonSecretId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_PersonSecret.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      personByPersonId: LeftArmIdentityPayload_personByPersonIdPlan,
      personSecret: planCreatePayloadResult,
      query: queryPlan
    }
  },
  EdgeCase: {
    assertStep: assertPgClassSingleStep,
    plans: {
      computed($in, args, _info) {
        return scalarComputed(resource_edge_case_computedPgResource, $in, makeArgs_person_computed_out(args));
      },
      notNullHasDefault($record) {
        return $record.get("not_null_has_default");
      },
      rowId($record) {
        return $record.get("row_id");
      },
      wontCastEasy($record) {
        return $record.get("wont_cast_easy");
      }
    }
  },
  FuncOutComplexRecord: {
    assertStep: assertPgClassSingleStep,
    plans: {
      y: PersonComputedComplexRecord_yPlan,
      z: PersonComputedComplexRecord_zPlan
    }
  },
  FuncOutComplexSetofRecord: {
    assertStep: assertPgClassSingleStep,
    plans: {
      y: PersonComputedComplexRecord_yPlan,
      z: PersonComputedComplexRecord_zPlan
    }
  },
  FuncOutOutCompoundTypeRecord: {
    assertStep: assertPgClassSingleStep,
    plans: {
      o2: FuncOutOutCompoundTypeRecord_o2Plan
    }
  },
  FuncOutOutRecord: {
    assertStep: assertPgClassSingleStep,
    plans: {
      firstOut: FuncOutOutRecord_firstOutPlan,
      secondOut: FuncOutOutRecord_secondOutPlan
    }
  },
  FuncOutOutSetofRecord: {
    assertStep: assertPgClassSingleStep
  },
  FuncOutOutUnnamedRecord: {
    assertStep: assertPgClassSingleStep,
    plans: {
      arg1: FuncOutOutUnnamedRecord_arg1Plan,
      arg2: FuncOutOutUnnamedRecord_arg2Plan
    }
  },
  FuncOutUnnamedOutOutUnnamedRecord: {
    assertStep: assertPgClassSingleStep,
    plans: {
      arg1: FuncOutOutUnnamedRecord_arg1Plan,
      arg3: FuncOutUnnamedOutOutUnnamedRecord_arg3Plan
    }
  },
  FuncReturnsTableMultiColRecord: {
    assertStep: assertPgClassSingleStep
  },
  Interval: {
    assertStep: assertStep
  },
  IntSetMutationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      integers: planCustomMutationPayloadResult,
      query: queryPlan
    }
  },
  Issue756: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nodeId($parent) {
        const specifier = nodeIdHandler_Issue756.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Issue756.codec.name].encode);
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of issue756Uniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_issue756PgResource.get(spec);
    }
  },
  Issue756MutationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      issue756: planCustomMutationPayloadResult,
      query: queryPlan
    }
  },
  Issue756SetMutationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      issue756S: planCustomMutationPayloadResult,
      query: queryPlan
    }
  },
  JsonbIdentityMutationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      json: planCustomMutationPayloadResult,
      query: queryPlan
    }
  },
  JsonbIdentityMutationPlpgsqlPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      json: planCustomMutationPayloadResult,
      query: queryPlan
    }
  },
  JsonbIdentityMutationPlpgsqlWithDefaultPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      json: planCustomMutationPayloadResult,
      query: queryPlan
    }
  },
  JsonIdentityMutationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      json: planCustomMutationPayloadResult,
      query: queryPlan
    }
  },
  LeftArm: {
    assertStep: assertPgClassSingleStep,
    plans: {
      lengthInMetres($record) {
        return $record.get("length_in_metres");
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_LeftArm.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_LeftArm.codec.name].encode);
      },
      personByPersonId: PersonSecret_personByPersonIdPlan,
      personId: PersonSecret_personIdPlan
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of left_armUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_left_armPgResource.get(spec);
    }
  },
  LeftArmIdentityPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      leftArm: planCustomMutationPayloadResult,
      personByPersonId: LeftArmIdentityPayload_personByPersonIdPlan,
      query: queryPlan
    }
  },
  ListOfCompoundTypesMutationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      compoundTypes: planCustomMutationPayloadResult,
      query: queryPlan
    }
  },
  MutationInInoutPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      ino: planCustomMutationPayloadResult,
      query: queryPlan
    }
  },
  MutationInOutPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      o: planCustomMutationPayloadResult,
      query: queryPlan
    }
  },
  MutationOutComplexPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  MutationOutComplexRecord: {
    assertStep: assertPgClassSingleStep,
    plans: {
      y: PersonComputedComplexRecord_yPlan,
      z: PersonComputedComplexRecord_zPlan
    }
  },
  MutationOutComplexSetofPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      results: planCustomMutationPayloadResult
    }
  },
  MutationOutComplexSetofRecord: {
    assertStep: assertPgClassSingleStep,
    plans: {
      y: PersonComputedComplexRecord_yPlan,
      z: PersonComputedComplexRecord_zPlan
    }
  },
  MutationOutOutCompoundTypePayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  MutationOutOutCompoundTypeRecord: {
    assertStep: assertPgClassSingleStep,
    plans: {
      o2: FuncOutOutCompoundTypeRecord_o2Plan
    }
  },
  MutationOutOutPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  MutationOutOutRecord: {
    assertStep: assertPgClassSingleStep,
    plans: {
      firstOut: FuncOutOutRecord_firstOutPlan,
      secondOut: FuncOutOutRecord_secondOutPlan
    }
  },
  MutationOutOutSetofPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      results: planCustomMutationPayloadResult
    }
  },
  MutationOutOutSetofRecord: {
    assertStep: assertPgClassSingleStep
  },
  MutationOutOutUnnamedPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  MutationOutOutUnnamedRecord: {
    assertStep: assertPgClassSingleStep,
    plans: {
      arg1: FuncOutOutUnnamedRecord_arg1Plan,
      arg2: FuncOutOutUnnamedRecord_arg2Plan
    }
  },
  MutationOutPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      o: planCustomMutationPayloadResult,
      query: queryPlan
    }
  },
  MutationOutSetofPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      os: planCustomMutationPayloadResult,
      query: queryPlan
    }
  },
  MutationOutTablePayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      person: planCustomMutationPayloadResult,
      query: queryPlan
    }
  },
  MutationOutTableSetofPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      people: planCustomMutationPayloadResult,
      query: queryPlan
    }
  },
  MutationOutUnnamedOutOutUnnamedPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  MutationOutUnnamedOutOutUnnamedRecord: {
    assertStep: assertPgClassSingleStep,
    plans: {
      arg1: FuncOutOutUnnamedRecord_arg1Plan,
      arg3: FuncOutUnnamedOutOutUnnamedRecord_arg3Plan
    }
  },
  MutationOutUnnamedPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      integer: planCustomMutationPayloadResult,
      query: queryPlan
    }
  },
  MutationReturnsTableMultiColPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      results: planCustomMutationPayloadResult
    }
  },
  MutationReturnsTableMultiColRecord: {
    assertStep: assertPgClassSingleStep
  },
  MutationReturnsTableOneColPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      col1S: planCustomMutationPayloadResult,
      query: queryPlan
    }
  },
  MyTable: {
    assertStep: assertPgClassSingleStep,
    plans: {
      jsonData($record) {
        return $record.get("json_data");
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_MyTable.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_MyTable.codec.name].encode);
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of my_tableUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_my_tablePgResource.get(spec);
    }
  },
  NestedCompoundType: {
    assertStep: assertPgClassSingleStep,
    plans: {
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
    }
  },
  NoArgsMutationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      integer: planCustomMutationPayloadResult,
      query: queryPlan
    }
  },
  NullTestRecord: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nodeId($parent) {
        const specifier = nodeIdHandler_NullTestRecord.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_NullTestRecord.codec.name].encode);
      },
      nonNullText($record) {
        return $record.get("non_null_text");
      },
      nullableInt($record) {
        return $record.get("nullable_int");
      },
      nullableText($record) {
        return $record.get("nullable_text");
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of null_test_recordUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_null_test_recordPgResource.get(spec);
    }
  },
  Person: {
    assertStep: assertPgClassSingleStep,
    plans: {
      compoundKeysByPersonId1List: {
        plan($record) {
          return resource_compound_keyPgResource.find({
            person_id_1: $record.get("id")
          });
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg,
          condition: applyConditionArg,
          orderBy: applyOrderByArg
        }
      },
      compoundKeysByPersonId2List: {
        plan($record) {
          return resource_compound_keyPgResource.find({
            person_id_2: $record.get("id")
          });
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg,
          condition: applyConditionArg,
          orderBy: applyOrderByArg
        }
      },
      computedComplex($in, args, _info) {
        const details = pgFunctionArgumentsFromArgs($in, makeArgs_person_computed_complex(args));
        return resource_person_computed_complexPgResource.execute(details.selectArgs);
      },
      computedFirstArgInout($in, args, _info) {
        const details = pgFunctionArgumentsFromArgs($in, makeArgs_person_computed_out(args));
        return resource_person_computed_first_arg_inoutPgResource.execute(details.selectArgs);
      },
      computedFirstArgInoutOut($in, args, _info) {
        const details = pgFunctionArgumentsFromArgs($in, makeArgs_person_computed_out(args));
        return resource_person_computed_first_arg_inout_outPgResource.execute(details.selectArgs);
      },
      computedInout($in, args, _info) {
        return scalarComputed(resource_person_computed_inoutPgResource, $in, makeArgs_person_computed_inout(args));
      },
      computedInoutOut($in, args, _info) {
        const details = pgFunctionArgumentsFromArgs($in, makeArgs_person_computed_inout_out(args));
        return resource_person_computed_inout_outPgResource.execute(details.selectArgs);
      },
      computedOut($in, args, _info) {
        return scalarComputed(resource_person_computed_outPgResource, $in, makeArgs_person_computed_out(args));
      },
      computedOutOut($in, args, _info) {
        const details = pgFunctionArgumentsFromArgs($in, makeArgs_person_computed_out(args));
        return resource_person_computed_out_outPgResource.execute(details.selectArgs);
      },
      createdAt($record) {
        return $record.get("created_at");
      },
      exists($in, args, _info) {
        return scalarComputed(resource_person_existsPgResource, $in, makeArgs_person_exists(args));
      },
      firstName($in, args, _info) {
        return scalarComputed(resource_person_first_namePgResource, $in, makeArgs_person_computed_out(args));
      },
      firstPost($in, args, _info) {
        const details = pgFunctionArgumentsFromArgs($in, makeArgs_person_computed_out(args));
        return resource_person_first_postPgResource.execute(details.selectArgs);
      },
      friendsList: {
        plan($in, args, _info) {
          const details = pgFunctionArgumentsFromArgs($in, makeArgs_person_computed_out(args));
          return resource_person_friendsPgResource.execute(details.selectArgs);
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg,
          orderBy: applyOrderByArg
        }
      },
      lastLoginFromIp($record) {
        return $record.get("last_login_from_ip");
      },
      lastLoginFromSubnet($record) {
        return $record.get("last_login_from_subnet");
      },
      leftArmByPersonId($record) {
        return resource_left_armPgResource.get({
          person_id: $record.get("id")
        });
      },
      name($record) {
        return $record.get("person_full_name");
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_Person.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Person.codec.name].encode);
      },
      optionalMissingMiddle1($in, args, _info) {
        return scalarComputed(resource_person_optional_missing_middle_1PgResource, $in, makeArgs_person_optional_missing_middle_1(args));
      },
      optionalMissingMiddle2($in, args, _info) {
        return scalarComputed(resource_person_optional_missing_middle_2PgResource, $in, makeArgs_person_optional_missing_middle_2(args));
      },
      optionalMissingMiddle3($in, args, _info) {
        return scalarComputed(resource_person_optional_missing_middle_3PgResource, $in, makeArgs_person_optional_missing_middle_3(args));
      },
      optionalMissingMiddle4($in, args, _info) {
        return scalarComputed(resource_person_optional_missing_middle_4PgResource, $in, makeArgs_person_optional_missing_middle_4(args));
      },
      optionalMissingMiddle5($in, args, _info) {
        return scalarComputed(resource_person_optional_missing_middle_5PgResource, $in, makeArgs_person_optional_missing_middle_5(args));
      },
      personSecretByPersonId($record) {
        return resource_person_secretPgResource.get({
          person_id: $record.get("id")
        });
      },
      site($record) {
        const $plan = $record.get("site");
        const $select = pgSelectSingleFromRecord(resource_frmcdc_wrappedUrlPgResource, $plan);
        $select.getClassStep().setTrusted();
        return $select;
      },
      typeFunction($in, args, _info) {
        const details = pgFunctionArgumentsFromArgs($in, makeArgs_person_type_function(args));
        return resource_person_type_functionPgResource.execute(details.selectArgs);
      },
      typeFunctionConnectionList: {
        plan($in, args, _info) {
          const details = pgFunctionArgumentsFromArgs($in, makeArgs_person_computed_out(args));
          return resource_person_type_function_connectionPgResource.execute(details.selectArgs);
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg
        }
      },
      typeFunctionList($in, args, _info) {
        const details = pgFunctionArgumentsFromArgs($in, makeArgs_person_computed_out(args));
        return resource_person_type_function_listPgResource.execute(details.selectArgs);
      },
      userMac($record) {
        return $record.get("user_mac");
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of personUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_personPgResource.get(spec);
    }
  },
  PersonComputedComplexRecord: {
    assertStep: assertPgClassSingleStep,
    plans: {
      y: PersonComputedComplexRecord_yPlan,
      z: PersonComputedComplexRecord_zPlan
    }
  },
  PersonComputedFirstArgInoutOutRecord: {
    assertStep: assertPgClassSingleStep,
    plans: {
      person($record) {
        const $plan = $record.get("person");
        const $select = pgSelectSingleFromRecord(resource_personPgResource, $plan);
        $select.getClassStep().setTrusted();
        return $select;
      }
    }
  },
  PersonComputedInoutOutRecord: {
    assertStep: assertPgClassSingleStep
  },
  PersonComputedOutOutRecord: {
    assertStep: assertPgClassSingleStep
  },
  PersonSecret: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nodeId($parent) {
        const specifier = nodeIdHandler_PersonSecret.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_PersonSecret.codec.name].encode);
      },
      personByPersonId: PersonSecret_personByPersonIdPlan,
      personId: PersonSecret_personIdPlan,
      secret($record) {
        return $record.get("sekrit");
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of person_secretUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_person_secretPgResource.get(spec);
    }
  },
  Post: {
    assertStep: assertPgClassSingleStep,
    plans: {
      authorId($record) {
        return $record.get("author_id");
      },
      comptypes($record) {
        const $val = $record.get("comptypes");
        const $select = pgSelectFromRecords(resource_frmcdc_comptypePgResource, $val);
        $select.setTrusted();
        return $select;
      }
    }
  },
  QueryOutputTwoRowsRecord: {
    assertStep: assertPgClassSingleStep,
    plans: {
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
    }
  },
  SearchTestSummariesRecord: {
    assertStep: assertPgClassSingleStep,
    plans: {
      totalDuration($record) {
        return $record.get("total_duration");
      }
    }
  },
  TableMutationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      post: planCustomMutationPayloadResult,
      query: queryPlan
    }
  },
  TableSetMutationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      people: planCustomMutationPayloadResult,
      query: queryPlan
    }
  },
  Type: {
    assertStep: assertPgClassSingleStep,
    plans: {
      anIntRange($record) {
        return $record.get("an_int_range");
      },
      byteaArray($record) {
        return $record.get("bytea_array");
      },
      compoundType($record) {
        const $plan = $record.get("compound_type");
        const $select = pgSelectSingleFromRecord(resource_frmcdc_compoundTypePgResource, $plan);
        $select.coalesceToEmptyObject();
        $select.getClassStep().setTrusted();
        return $select;
      },
      enumArray($record) {
        return $record.get("enum_array");
      },
      int8ArrayDomain($record) {
        return $record.get("int8_array_domain");
      },
      intervalArray($record) {
        return $record.get("interval_array");
      },
      ltreeArray($record) {
        return $record.get("ltree_array");
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
      nullableRange($record) {
        return $record.get("nullable_range");
      },
      textArray($record) {
        return $record.get("text_array");
      },
      textArrayDomain($record) {
        return $record.get("text_array_domain");
      }
    }
  },
  TypesMutationPayload: {
    assertStep: ObjectStep,
    plans: {
      boolean: planCustomMutationPayloadResult,
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan
    }
  },
  UpdateCompoundKeyPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      compoundKey: planCreatePayloadResult,
      personByPersonId1: CreateCompoundKeyPayload_personByPersonId1Plan,
      personByPersonId2: CreateCompoundKeyPayload_personByPersonId2Plan,
      query: queryPlan
    }
  },
  UpdateIssue756Payload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      issue756: planCreatePayloadResult,
      query: queryPlan
    }
  },
  UpdateLeftArmPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      leftArm: planCreatePayloadResult,
      personByPersonId: LeftArmIdentityPayload_personByPersonIdPlan,
      query: queryPlan
    }
  },
  UpdateMyTablePayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      myTable: planCreatePayloadResult,
      query: queryPlan
    }
  },
  UpdateNullTestRecordPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      nullTestRecord: planCreatePayloadResult,
      query: queryPlan
    }
  },
  UpdatePersonPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      person: planCreatePayloadResult,
      query: queryPlan
    }
  },
  UpdatePersonSecretPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      personByPersonId: LeftArmIdentityPayload_personByPersonIdPlan,
      personSecret: planCreatePayloadResult,
      query: queryPlan
    }
  },
  WrappedUrl: {
    assertStep: assertPgClassSingleStep
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
  CompoundKeyCondition: {
    plans: {
      extra($condition, val) {
        return applyAttributeCondition("extra", TYPES.boolean, $condition, val);
      },
      personId1($condition, val) {
        return applyAttributeCondition("person_id_1", TYPES.int, $condition, val);
      },
      personId2($condition, val) {
        return applyAttributeCondition("person_id_2", TYPES.int, $condition, val);
      }
    }
  },
  CompoundKeyInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      extra: CompoundKeyInput_extraApply,
      personId1: CompoundKeyInput_personId1Apply,
      personId2: CompoundKeyInput_personId2Apply
    }
  },
  CompoundKeyPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      extra: CompoundKeyInput_extraApply,
      personId1: CompoundKeyInput_personId1Apply,
      personId2: CompoundKeyInput_personId2Apply
    }
  },
  CompoundTypeInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      a(obj, val, info) {
        obj.set("a", bakedInputRuntime(info.schema, info.field.type, val));
      },
      b(obj, val, info) {
        obj.set("b", bakedInputRuntime(info.schema, info.field.type, val));
      },
      c(obj, val, info) {
        obj.set("c", bakedInputRuntime(info.schema, info.field.type, val));
      },
      d(obj, val, info) {
        obj.set("d", bakedInputRuntime(info.schema, info.field.type, val));
      },
      e(obj, val, info) {
        obj.set("e", bakedInputRuntime(info.schema, info.field.type, val));
      },
      f(obj, val, info) {
        obj.set("f", bakedInputRuntime(info.schema, info.field.type, val));
      },
      fooBar(obj, val, info) {
        obj.set("foo_bar", bakedInputRuntime(info.schema, info.field.type, val));
      },
      g(obj, val, info) {
        obj.set("g", bakedInputRuntime(info.schema, info.field.type, val));
      }
    }
  },
  CreateCompoundKeyInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      compoundKey: applyCreateFields
    }
  },
  CreateEdgeCaseInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      edgeCase: applyCreateFields
    }
  },
  CreateIssue756Input: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      issue756: applyCreateFields
    }
  },
  CreateLeftArmInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      leftArm: applyCreateFields
    }
  },
  CreateMyTableInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      myTable: applyCreateFields
    }
  },
  CreateNullTestRecordInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      nullTestRecord: applyCreateFields
    }
  },
  CreatePersonInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      person: applyCreateFields
    }
  },
  CreatePersonSecretInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      personSecret: applyCreateFields
    }
  },
  DeleteCompoundKeyByPersonId1AndPersonId2Input: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeleteCompoundKeyInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeleteIssue756ByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeleteIssue756Input: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeleteLeftArmByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeleteLeftArmByPersonIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeleteLeftArmInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeleteMyTableByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeleteMyTableInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeleteNullTestRecordByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeleteNullTestRecordInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeletePersonByEmailInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeletePersonByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeletePersonInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeletePersonSecretByPersonIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeletePersonSecretInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  EdgeCaseCondition: {
    plans: {
      notNullHasDefault($condition, val) {
        return applyAttributeCondition("not_null_has_default", TYPES.boolean, $condition, val);
      },
      rowId($condition, val) {
        return applyAttributeCondition("row_id", TYPES.int, $condition, val);
      },
      wontCastEasy($condition, val) {
        return applyAttributeCondition("wont_cast_easy", TYPES.int2, $condition, val);
      }
    }
  },
  EdgeCaseInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      notNullHasDefault(obj, val, info) {
        obj.set("not_null_has_default", bakedInputRuntime(info.schema, info.field.type, val));
      },
      rowId(obj, val, info) {
        obj.set("row_id", bakedInputRuntime(info.schema, info.field.type, val));
      },
      wontCastEasy(obj, val, info) {
        obj.set("wont_cast_easy", bakedInputRuntime(info.schema, info.field.type, val));
      }
    }
  },
  IntSetMutationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  Issue756Condition: {
    plans: {
      id: PersonCondition_idApply,
      ts($condition, val) {
        return applyAttributeCondition("ts", notNullTimestampCodec, $condition, val);
      }
    }
  },
  Issue756Input: {
    baked: createObjectAndApplyChildren,
    plans: {
      id: LeftArmBaseInput_idApply,
      ts: Issue756Input_tsApply
    }
  },
  Issue756MutationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  Issue756Patch: {
    baked: createObjectAndApplyChildren,
    plans: {
      id: LeftArmBaseInput_idApply,
      ts: Issue756Input_tsApply
    }
  },
  Issue756SetMutationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  JsonbIdentityMutationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  JsonbIdentityMutationPlpgsqlInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  JsonbIdentityMutationPlpgsqlWithDefaultInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  JsonIdentityMutationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  LeftArmBaseInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      id: LeftArmBaseInput_idApply,
      lengthInMetres: LeftArmBaseInput_lengthInMetresApply,
      mood: LeftArmBaseInput_moodApply,
      personId: LeftArmBaseInput_personIdApply
    }
  },
  LeftArmCondition: {
    plans: {
      id: PersonCondition_idApply,
      lengthInMetres($condition, val) {
        return applyAttributeCondition("length_in_metres", TYPES.float, $condition, val);
      },
      mood($condition, val) {
        return applyAttributeCondition("mood", TYPES.text, $condition, val);
      },
      personId: PersonSecretCondition_personIdApply
    }
  },
  LeftArmIdentityInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  LeftArmInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      id: LeftArmBaseInput_idApply,
      lengthInMetres: LeftArmBaseInput_lengthInMetresApply,
      mood: LeftArmBaseInput_moodApply,
      personId: LeftArmBaseInput_personIdApply
    }
  },
  LeftArmPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      id: LeftArmBaseInput_idApply,
      lengthInMetres: LeftArmBaseInput_lengthInMetresApply,
      mood: LeftArmBaseInput_moodApply,
      personId: LeftArmBaseInput_personIdApply
    }
  },
  ListOfCompoundTypesMutationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  MutationInInoutInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  MutationInOutInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  MutationOutComplexInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  MutationOutComplexSetofInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  MutationOutInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  MutationOutOutCompoundTypeInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  MutationOutOutInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  MutationOutOutSetofInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  MutationOutOutUnnamedInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  MutationOutSetofInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  MutationOutTableInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  MutationOutTableSetofInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  MutationOutUnnamedInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  MutationOutUnnamedOutOutUnnamedInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  MutationReturnsTableMultiColInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  MutationReturnsTableOneColInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  MyTableCondition: {
    plans: {
      id: PersonCondition_idApply,
      jsonData($condition, val) {
        return applyAttributeCondition("json_data", TYPES.jsonb, $condition, val);
      }
    }
  },
  MyTableInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      id: LeftArmBaseInput_idApply,
      jsonData: MyTableInput_jsonDataApply
    }
  },
  MyTablePatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      id: LeftArmBaseInput_idApply,
      jsonData: MyTableInput_jsonDataApply
    }
  },
  NoArgsMutationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  NullTestRecordCondition: {
    plans: {
      id: PersonCondition_idApply,
      nonNullText($condition, val) {
        return applyAttributeCondition("non_null_text", TYPES.text, $condition, val);
      },
      nullableInt($condition, val) {
        return applyAttributeCondition("nullable_int", TYPES.int, $condition, val);
      },
      nullableText($condition, val) {
        return applyAttributeCondition("nullable_text", TYPES.text, $condition, val);
      }
    }
  },
  NullTestRecordInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      id: LeftArmBaseInput_idApply,
      nonNullText: NullTestRecordInput_nonNullTextApply,
      nullableInt: NullTestRecordInput_nullableIntApply,
      nullableText: NullTestRecordInput_nullableTextApply
    }
  },
  NullTestRecordPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      id: LeftArmBaseInput_idApply,
      nonNullText: NullTestRecordInput_nonNullTextApply,
      nullableInt: NullTestRecordInput_nullableIntApply,
      nullableText: NullTestRecordInput_nullableTextApply
    }
  },
  PersonCondition: {
    plans: {
      about($condition, val) {
        return applyAttributeCondition("about", TYPES.text, $condition, val);
      },
      aliases($condition, val) {
        return applyAttributeCondition("aliases", LIST_TYPES.text, $condition, val);
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
      },
      config($condition, val) {
        return applyAttributeCondition("config", TYPES.hstore, $condition, val);
      },
      createdAt($condition, val) {
        return applyAttributeCondition("created_at", TYPES.timestamp, $condition, val);
      },
      email($condition, val) {
        return applyAttributeCondition("email", emailCodec, $condition, val);
      },
      id: PersonCondition_idApply,
      lastLoginFromIp($condition, val) {
        return applyAttributeCondition("last_login_from_ip", TYPES.inet, $condition, val);
      },
      lastLoginFromSubnet($condition, val) {
        return applyAttributeCondition("last_login_from_subnet", TYPES.cidr, $condition, val);
      },
      name($condition, val) {
        return applyAttributeCondition("person_full_name", TYPES.varchar, $condition, val);
      },
      site($condition, val) {
        return applyAttributeCondition("site", wrappedUrlCodec, $condition, val);
      },
      userMac($condition, val) {
        return applyAttributeCondition("user_mac", TYPES.macaddr, $condition, val);
      }
    }
  },
  PersonInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      about: PersonInput_aboutApply,
      aliases: PersonInput_aliasesApply,
      config: PersonInput_configApply,
      createdAt: PersonInput_createdAtApply,
      email: PersonInput_emailApply,
      id: LeftArmBaseInput_idApply,
      lastLoginFromIp: PersonInput_lastLoginFromIpApply,
      lastLoginFromSubnet: PersonInput_lastLoginFromSubnetApply,
      name: PersonInput_nameApply,
      site: PersonInput_siteApply,
      userMac: PersonInput_userMacApply
    }
  },
  PersonPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      about: PersonInput_aboutApply,
      aliases: PersonInput_aliasesApply,
      config: PersonInput_configApply,
      createdAt: PersonInput_createdAtApply,
      email: PersonInput_emailApply,
      id: LeftArmBaseInput_idApply,
      lastLoginFromIp: PersonInput_lastLoginFromIpApply,
      lastLoginFromSubnet: PersonInput_lastLoginFromSubnetApply,
      name: PersonInput_nameApply,
      site: PersonInput_siteApply,
      userMac: PersonInput_userMacApply
    }
  },
  PersonSecretCondition: {
    plans: {
      personId: PersonSecretCondition_personIdApply,
      secret($condition, val) {
        return applyAttributeCondition("sekrit", TYPES.text, $condition, val);
      }
    }
  },
  PersonSecretInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      personId: LeftArmBaseInput_personIdApply,
      secret: PersonSecretInput_secretApply
    }
  },
  PersonSecretPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      personId: LeftArmBaseInput_personIdApply,
      secret: PersonSecretInput_secretApply
    }
  },
  TableMutationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  TableSetMutationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  TypesMutationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  UpdateCompoundKeyByPersonId1AndPersonId2Input: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      compoundKeyPatch: applyCreateFields
    }
  },
  UpdateCompoundKeyInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      compoundKeyPatch: applyCreateFields
    }
  },
  UpdateIssue756ByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      issue756Patch: applyCreateFields
    }
  },
  UpdateIssue756Input: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      issue756Patch: applyCreateFields
    }
  },
  UpdateLeftArmByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      leftArmPatch: applyCreateFields
    }
  },
  UpdateLeftArmByPersonIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      leftArmPatch: applyCreateFields
    }
  },
  UpdateLeftArmInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      leftArmPatch: applyCreateFields
    }
  },
  UpdateMyTableByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      myTablePatch: applyCreateFields
    }
  },
  UpdateMyTableInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      myTablePatch: applyCreateFields
    }
  },
  UpdateNullTestRecordByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      nullTestRecordPatch: applyCreateFields
    }
  },
  UpdateNullTestRecordInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      nullTestRecordPatch: applyCreateFields
    }
  },
  UpdatePersonByEmailInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      personPatch: applyCreateFields
    }
  },
  UpdatePersonByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      personPatch: applyCreateFields
    }
  },
  UpdatePersonInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      personPatch: applyCreateFields
    }
  },
  UpdatePersonSecretByPersonIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      personSecretPatch: applyCreateFields
    }
  },
  UpdatePersonSecretInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      personSecretPatch: applyCreateFields
    }
  },
  WrappedUrlInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      url(obj, val, info) {
        obj.set("url", bakedInputRuntime(info.schema, info.field.type, val));
      }
    }
  }
};
export const scalars = {
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
      }
      throw new GraphQLError("Base64EncodedBinary can only parse string values.");
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return Buffer.from(ast.value, "base64");
      }
      throw new GraphQLError("Base64EncodedBinary can only parse string values");
    }
  },
  BigFloat: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`BigFloat can only parse string values (kind='${ast.kind}')`);
    }
  },
  BigInt: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`BigInt can only parse string values (kind='${ast.kind}')`);
    }
  },
  Date: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`Date can only parse string values (kind='${ast.kind}')`);
    }
  },
  Datetime: {
    serialize: toString,
    parseValue: toString,
    parseLiteral: DatetimeParseLiteral
  },
  Email: {
    serialize: GraphQLString.serialize,
    parseValue: GraphQLString.parseValue,
    parseLiteral: GraphQLString.parseLiteral
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
  JSONPath: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`JSONPath can only parse string values (kind='${ast.kind}')`);
    }
  },
  KeyValueHash: {
    serialize(value) {
      return value;
    },
    parseValue(obj) {
      if (isValidHstoreObject(obj)) {
        return obj;
      }
      throw new GraphQLError(`This is not a valid KeyValueHash object, it must be a key/value hash where keys and values are both strings (or null).`);
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
  LTree: {
    serialize(x) {
      return x;
    },
    parseValue: LTreeParseValue,
    parseLiteral(node, variables) {
      return LTreeParseValue(valueFromASTUntyped(node, variables));
    }
  },
  NotNullTimestamp: {
    serialize: toString,
    parseValue: toString,
    parseLiteral: DatetimeParseLiteral
  },
  NotNullUrl: {
    serialize: GraphQLString.serialize,
    parseValue: GraphQLString.parseValue,
    parseLiteral: GraphQLString.parseLiteral
  },
  RegClass: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`RegClass can only parse string values (kind='${ast.kind}')`);
    }
  },
  RegConfig: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`RegConfig can only parse string values (kind='${ast.kind}')`);
    }
  },
  RegDictionary: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`RegDictionary can only parse string values (kind='${ast.kind}')`);
    }
  },
  RegOper: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`RegOper can only parse string values (kind='${ast.kind}')`);
    }
  },
  RegOperator: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`RegOperator can only parse string values (kind='${ast.kind}')`);
    }
  },
  RegProc: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`RegProc can only parse string values (kind='${ast.kind}')`);
    }
  },
  RegProcedure: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`RegProcedure can only parse string values (kind='${ast.kind}')`);
    }
  },
  RegType: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`RegType can only parse string values (kind='${ast.kind}')`);
    }
  },
  Time: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`Time can only parse string values (kind='${ast.kind}')`);
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
  AnEnum: {
    values: {
      _ASTERISK_BAR_: {
        value: "_*bar_"
      },
      _ASTERISK_BAZ_ASTERISK_: {
        value: "_*baz*_"
      },
      _FOO_ASTERISK: {
        value: "_foo*"
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
      ASTERISK_BAR: {
        value: "*bar"
      },
      ASTERISK_BAR_: {
        value: "*bar_"
      },
      ASTERISK_BAZ_ASTERISK: {
        value: "*baz*"
      },
      AWAITING: {
        value: "awaiting"
      },
      DOLLAR: {
        value: "$"
      },
      FOO_ASTERISK: {
        value: "foo*"
      },
      FOO_ASTERISK_: {
        value: "foo*_"
      },
      GREATER_THAN_OR_EQUAL: {
        value: ">="
      },
      LIKE: {
        value: "~~"
      },
      PERCENT: {
        value: "%"
      },
      PUBLISHED: {
        value: "published"
      },
      REJECTED: {
        value: "rejected"
      }
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
  CompoundKeysOrderBy: {
    values: {
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
      }
    }
  },
  EdgeCasesOrderBy: {
    values: {
      COMPUTED_ASC(queryBuilder) {
        applyOrderByCustomField(resource_edge_case_computedPgResource, "asc", undefined, queryBuilder);
      },
      COMPUTED_DESC(queryBuilder) {
        applyOrderByCustomField(resource_edge_case_computedPgResource, "desc", undefined, queryBuilder);
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
  Issue756SOrderBy: {
    values: {
      ID_ASC: PeopleOrderBy_ID_ASCApply,
      ID_DESC: PeopleOrderBy_ID_DESCApply,
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
    }
  },
  LeftArmsOrderBy: {
    values: {
      ID_ASC: PeopleOrderBy_ID_ASCApply,
      ID_DESC: PeopleOrderBy_ID_DESCApply,
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
      },
      PERSON_ID_ASC: PersonSecretsOrderBy_PERSON_ID_ASCApply,
      PERSON_ID_DESC: PersonSecretsOrderBy_PERSON_ID_DESCApply,
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
      }
    }
  },
  MyTablesOrderBy: {
    values: {
      ID_ASC: PeopleOrderBy_ID_ASCApply,
      ID_DESC: PeopleOrderBy_ID_DESCApply,
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
      },
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
      }
    }
  },
  NullTestRecordsOrderBy: {
    values: {
      ID_ASC: PeopleOrderBy_ID_ASCApply,
      ID_DESC: PeopleOrderBy_ID_DESCApply,
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
      }
    }
  },
  PeopleOrderBy: {
    values: {
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
      COMPUTED_OUT_ASC(queryBuilder) {
        applyOrderByCustomField(resource_person_computed_outPgResource, "asc", undefined, queryBuilder);
      },
      COMPUTED_OUT_DESC(queryBuilder) {
        applyOrderByCustomField(resource_person_computed_outPgResource, "desc", undefined, queryBuilder);
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
      FIRST_NAME_ASC(queryBuilder) {
        applyOrderByCustomField(resource_person_first_namePgResource, "asc", undefined, queryBuilder);
      },
      FIRST_NAME_DESC(queryBuilder) {
        applyOrderByCustomField(resource_person_first_namePgResource, "desc", undefined, queryBuilder);
      },
      ID_ASC: PeopleOrderBy_ID_ASCApply,
      ID_DESC: PeopleOrderBy_ID_DESCApply,
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
      }
    }
  },
  PersonSecretsOrderBy: {
    values: {
      PERSON_ID_ASC: PersonSecretsOrderBy_PERSON_ID_ASCApply,
      PERSON_ID_DESC: PersonSecretsOrderBy_PERSON_ID_DESCApply,
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
