import { LIST_TYPES, PgDeleteSingleStep, PgExecutor, PgResource, PgSelectSingleStep, PgSelectStep, TYPES, assertPgClassSingleStep, domainOfCodec, enumCodec, listOfCodec, makeRegistry, pgClassExpression, pgDeleteSingle, pgFromExpression, pgInsertSingle, pgSelectFromRecord, pgSelectFromRecords, pgSelectSingleFromRecord, pgUpdateSingle, rangeOfCodec, recordCodec, sqlFromArgDigests, sqlValueWithCodec } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ObjectStep, __ValueStep, access, assertStep, bakedInput, bakedInputRuntime, connection, constant, context, createObjectAndApplyChildren, first, get as get2, inhibitOnNull, inspect, lambda, list, makeDecodeNodeId, makeGrafastSchema, markSyncAndSafe, object, operationPlan, rootValue, specFromNodeId, stepAMayDependOnStepB, trap } from "grafast";
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
const guidCodec = domainOfCodec(TYPES.varchar, "guid", sql.identifier("b", "guid"), {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "guid"
    }
  }
});
const nonUpdatableViewIdentifier = sql.identifier("a", "non_updatable_view");
const nonUpdatableViewCodec = recordCodec({
  name: "nonUpdatableView",
  identifier: nonUpdatableViewIdentifier,
  attributes: {
    __proto__: null,
    "?column?": {
      codec: TYPES.int
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "non_updatable_view"
    }
  },
  executor: executor
});
const inputsIdentifier = sql.identifier("a", "inputs");
const inputsCodec = recordCodec({
  name: "inputs",
  identifier: inputsIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "inputs"
    }
  },
  executor: executor,
  description: "Should output as Input"
});
const patchsIdentifier = sql.identifier("a", "patchs");
const patchsCodec = recordCodec({
  name: "patchs",
  identifier: patchsIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "patchs"
    }
  },
  executor: executor,
  description: "Should output as Patch"
});
const reservedIdentifier = sql.identifier("a", "reserved");
const reservedCodec = recordCodec({
  name: "reserved",
  identifier: reservedIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "reserved"
    }
  },
  executor: executor
});
const reservedPatchsIdentifier = sql.identifier("a", "reservedPatchs");
const reservedPatchsCodec = recordCodec({
  name: "reservedPatchs",
  identifier: reservedPatchsIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "reservedPatchs"
    }
  },
  executor: executor,
  description: "`reservedPatchs` table should get renamed to ReservedPatchRecord to prevent clashes with ReservedPatch from `reserved` table"
});
const reservedInputIdentifier = sql.identifier("a", "reserved_input");
const reservedInputCodec = recordCodec({
  name: "reservedInput",
  identifier: reservedInputIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "reserved_input"
    }
  },
  executor: executor,
  description: "`reserved_input` table should get renamed to ReservedInputRecord to prevent clashes with ReservedInput from `reserved` table"
});
const defaultValueIdentifier = sql.identifier("a", "default_value");
const defaultValueCodec = recordCodec({
  name: "defaultValue",
  identifier: defaultValueIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    null_value: {
      codec: TYPES.text,
      hasDefault: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "default_value"
    }
  },
  executor: executor
});
const foreignKeyIdentifier = sql.identifier("a", "foreign_key");
const foreignKeyCodec = recordCodec({
  name: "foreignKey",
  identifier: foreignKeyIdentifier,
  attributes: {
    __proto__: null,
    person_id: {
      codec: TYPES.int
    },
    compound_key_1: {
      codec: TYPES.int
    },
    compound_key_2: {
      codec: TYPES.int
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "foreign_key"
    }
  },
  executor: executor
});
const noPrimaryKeyIdentifier = sql.identifier("a", "no_primary_key");
const noPrimaryKeyCodec = recordCodec({
  name: "noPrimaryKey",
  identifier: noPrimaryKeyIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true
    },
    str: {
      codec: TYPES.text,
      notNull: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "no_primary_key"
    }
  },
  executor: executor
});
const testviewIdentifier = sql.identifier("a", "testview");
const testviewCodec = recordCodec({
  name: "testview",
  identifier: testviewIdentifier,
  attributes: {
    __proto__: null,
    testviewid: {
      codec: TYPES.int
    },
    col1: {
      codec: TYPES.int
    },
    col2: {
      codec: TYPES.int
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "testview"
    }
  },
  executor: executor
});
const uniqueForeignKeyIdentifier = sql.identifier("a", "unique_foreign_key");
const uniqueForeignKeyCodec = recordCodec({
  name: "uniqueForeignKey",
  identifier: uniqueForeignKeyIdentifier,
  attributes: {
    __proto__: null,
    compound_key_1: {
      codec: TYPES.int
    },
    compound_key_2: {
      codec: TYPES.int
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "unique_foreign_key"
    },
    tags: {
      __proto__: null,
      omit: "create,update,delete,all,order,filter",
      behavior: ["-insert -update -delete -query:resource:list -query:resource:connection -order -orderBy -filter -filterBy"]
    }
  },
  executor: executor
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
const viewTableIdentifier = sql.identifier("a", "view_table");
const viewTableCodec = recordCodec({
  name: "viewTable",
  identifier: viewTableIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    col1: {
      codec: TYPES.int
    },
    col2: {
      codec: TYPES.int
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "view_table"
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
const similarTable1Identifier = sql.identifier("a", "similar_table_1");
const similarTable1Codec = recordCodec({
  name: "similarTable1",
  identifier: similarTable1Identifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    col1: {
      codec: TYPES.int
    },
    col2: {
      codec: TYPES.int
    },
    col3: {
      codec: TYPES.int,
      notNull: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "similar_table_1"
    }
  },
  executor: executor
});
const similarTable2Identifier = sql.identifier("a", "similar_table_2");
const similarTable2Codec = recordCodec({
  name: "similarTable2",
  identifier: similarTable2Identifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    col3: {
      codec: TYPES.int,
      notNull: true
    },
    col4: {
      codec: TYPES.int
    },
    col5: {
      codec: TYPES.int
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "similar_table_2"
    }
  },
  executor: executor
});
const updatableViewIdentifier = sql.identifier("b", "updatable_view");
const updatableViewCodec = recordCodec({
  name: "updatableView",
  identifier: updatableViewIdentifier,
  attributes: {
    __proto__: null,
    x: {
      codec: TYPES.int
    },
    name: {
      codec: TYPES.varchar
    },
    description: {
      codec: TYPES.text
    },
    constant: {
      codec: TYPES.int,
      description: "This is constantly 2"
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "updatable_view"
    },
    tags: {
      __proto__: null,
      uniqueKey: "x",
      unique: "x|@behavior -single -update -delete"
    }
  },
  executor: executor,
  description: "YOYOYO!!"
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
const jwtTokenIdentifier = sql.identifier("b", "jwt_token");
const jwtTokenCodec = recordCodec({
  name: "jwtToken",
  identifier: jwtTokenIdentifier,
  attributes: {
    __proto__: null,
    role: {
      codec: TYPES.text
    },
    exp: {
      codec: TYPES.bigint
    },
    a: {
      codec: TYPES.int
    },
    b: {
      codec: TYPES.numeric
    },
    c: {
      codec: TYPES.bigint
    }
  },
  extensions: {
    isTableLike: false,
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "jwt_token"
    }
  },
  executor: executor
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
const authPayloadIdentifier = sql.identifier("b", "auth_payload");
const authPayloadCodec = recordCodec({
  name: "authPayload",
  identifier: authPayloadIdentifier,
  attributes: {
    __proto__: null,
    jwt: {
      codec: jwtTokenCodec
    },
    id: {
      codec: TYPES.int
    },
    admin: {
      codec: TYPES.boolean
    }
  },
  extensions: {
    isTableLike: false,
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "auth_payload"
    },
    tags: {
      __proto__: null,
      foreignKey: "(id) references c.person"
    }
  },
  executor: executor
});
const postIdentifier = sql.identifier("a", "post");
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
  identifier: postIdentifier,
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
const listsIdentifier = sql.identifier("b", "lists");
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
const listsCodec = recordCodec({
  name: "lists",
  identifier: listsIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    int_array: {
      codec: LIST_TYPES.int
    },
    int_array_nn: {
      codec: LIST_TYPES.int,
      notNull: true
    },
    enum_array: {
      codec: colorArrayCodec
    },
    enum_array_nn: {
      codec: colorArrayCodec,
      notNull: true
    },
    date_array: {
      codec: LIST_TYPES.date
    },
    date_array_nn: {
      codec: LIST_TYPES.date,
      notNull: true
    },
    timestamptz_array: {
      codec: LIST_TYPES.timestamptz
    },
    timestamptz_array_nn: {
      codec: LIST_TYPES.timestamptz,
      notNull: true
    },
    compound_type_array: {
      codec: compoundTypeArrayCodec
    },
    compound_type_array_nn: {
      codec: compoundTypeArrayCodec,
      notNull: true
    },
    bytea_array: {
      codec: LIST_TYPES.bytea
    },
    bytea_array_nn: {
      codec: LIST_TYPES.bytea,
      notNull: true
    },
    tsvector_array: {
      codec: LIST_TYPES.tsvector
    },
    tsvector_array_nn: {
      codec: LIST_TYPES.tsvector,
      notNull: true
    },
    tsquery_array: {
      codec: LIST_TYPES.tsquery
    },
    tsquery_array_nn: {
      codec: LIST_TYPES.tsquery,
      notNull: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "lists"
    }
  },
  executor: executor
});
const typesIdentifier = sql.identifier("b", "types");
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
  identifier: typesIdentifier,
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
const postArrayCodec = listOfCodec(postCodec, {
  name: "postArray",
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "_post"
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
const return_void_mutationFunctionIdentifer = sql.identifier("a", "return_void_mutation");
const mutation_interval_arrayFunctionIdentifer = sql.identifier("a", "mutation_interval_array");
const query_interval_arrayFunctionIdentifer = sql.identifier("a", "query_interval_array");
const mutation_interval_setFunctionIdentifer = sql.identifier("a", "mutation_interval_set");
const query_interval_setFunctionIdentifer = sql.identifier("a", "query_interval_set");
const mutation_text_arrayFunctionIdentifer = sql.identifier("a", "mutation_text_array");
const query_text_arrayFunctionIdentifer = sql.identifier("a", "query_text_array");
const static_big_integerFunctionIdentifer = sql.identifier("a", "static_big_integer");
const func_in_outFunctionIdentifer = sql.identifier("c", "func_in_out");
const func_returns_table_one_colFunctionIdentifer = sql.identifier("c", "func_returns_table_one_col");
const mutation_in_outFunctionIdentifer = sql.identifier("c", "mutation_in_out");
const mutation_returns_table_one_colFunctionIdentifer = sql.identifier("c", "mutation_returns_table_one_col");
const assert_somethingFunctionIdentifer = sql.identifier("a", "assert_something");
const assert_something_nxFunctionIdentifer = sql.identifier("a", "assert_something_nx");
const json_identityFunctionIdentifer = sql.identifier("c", "json_identity");
const json_identity_mutationFunctionIdentifer = sql.identifier("c", "json_identity_mutation");
const jsonb_identityFunctionIdentifer = sql.identifier("c", "jsonb_identity");
const jsonb_identity_mutationFunctionIdentifer = sql.identifier("c", "jsonb_identity_mutation");
const jsonb_identity_mutation_plpgsqlFunctionIdentifer = sql.identifier("c", "jsonb_identity_mutation_plpgsql");
const jsonb_identity_mutation_plpgsql_with_defaultFunctionIdentifer = sql.identifier("c", "jsonb_identity_mutation_plpgsql_with_default");
const add_1_mutationFunctionIdentifer = sql.identifier("a", "add_1_mutation");
const add_1_queryFunctionIdentifer = sql.identifier("a", "add_1_query");
const add_2_mutationFunctionIdentifer = sql.identifier("a", "add_2_mutation");
const add_2_queryFunctionIdentifer = sql.identifier("a", "add_2_query");
const add_3_mutationFunctionIdentifer = sql.identifier("a", "add_3_mutation");
const add_3_queryFunctionIdentifer = sql.identifier("a", "add_3_query");
const add_4_mutationFunctionIdentifer = sql.identifier("a", "add_4_mutation");
const add_4_mutation_errorFunctionIdentifer = sql.identifier("a", "add_4_mutation_error");
const add_4_queryFunctionIdentifer = sql.identifier("a", "add_4_query");
const mult_1FunctionIdentifer = sql.identifier("b", "mult_1");
const mult_2FunctionIdentifer = sql.identifier("b", "mult_2");
const mult_3FunctionIdentifer = sql.identifier("b", "mult_3");
const mult_4FunctionIdentifer = sql.identifier("b", "mult_4");
const func_in_inoutFunctionIdentifer = sql.identifier("c", "func_in_inout");
const func_out_outFunctionIdentifer = sql.identifier("c", "func_out_out");
const func_out_out_setofFunctionIdentifer = sql.identifier("c", "func_out_out_setof");
const func_out_out_unnamedFunctionIdentifer = sql.identifier("c", "func_out_out_unnamed");
const mutation_in_inoutFunctionIdentifer = sql.identifier("c", "mutation_in_inout");
const mutation_out_outFunctionIdentifer = sql.identifier("c", "mutation_out_out");
const mutation_out_out_setofFunctionIdentifer = sql.identifier("c", "mutation_out_out_setof");
const mutation_out_out_unnamedFunctionIdentifer = sql.identifier("c", "mutation_out_out_unnamed");
const search_test_summariesFunctionIdentifer = sql.identifier("c", "search_test_summaries");
const optional_missing_middle_1FunctionIdentifer = sql.identifier("a", "optional_missing_middle_1");
const optional_missing_middle_2FunctionIdentifer = sql.identifier("a", "optional_missing_middle_2");
const optional_missing_middle_3FunctionIdentifer = sql.identifier("a", "optional_missing_middle_3");
const optional_missing_middle_4FunctionIdentifer = sql.identifier("a", "optional_missing_middle_4");
const optional_missing_middle_5FunctionIdentifer = sql.identifier("a", "optional_missing_middle_5");
const func_out_unnamed_out_out_unnamedFunctionIdentifer = sql.identifier("c", "func_out_unnamed_out_out_unnamed");
const int_set_mutationFunctionIdentifer = sql.identifier("c", "int_set_mutation");
const int_set_queryFunctionIdentifer = sql.identifier("c", "int_set_query");
const mutation_out_unnamed_out_out_unnamedFunctionIdentifer = sql.identifier("c", "mutation_out_unnamed_out_out_unnamed");
const mutation_returns_table_multi_colFunctionIdentifer = sql.identifier("c", "mutation_returns_table_multi_col");
const list_bde_mutationFunctionIdentifer = sql.identifier("b", "list_bde_mutation");
const func_returns_table_multi_colFunctionIdentifer = sql.identifier("c", "func_returns_table_multi_col");
const guid_fnFunctionIdentifer = sql.identifier("b", "guid_fn");
const inputsUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const patchsUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const reservedUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const reservedPatchsUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const reserved_inputUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const default_valueUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const foreign_key_resourceOptionsConfig = {
  executor: executor,
  name: "foreign_key",
  identifier: "main.a.foreign_key",
  from: foreignKeyIdentifier,
  codec: foreignKeyCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "foreign_key"
    }
  }
};
const no_primary_keyUniques = [{
  attributes: ["id"]
}];
const unique_foreign_keyUniques = [{
  attributes: ["compound_key_1", "compound_key_2"]
}];
const unique_foreign_key_resourceOptionsConfig = {
  executor: executor,
  name: "unique_foreign_key",
  identifier: "main.a.unique_foreign_key",
  from: uniqueForeignKeyIdentifier,
  codec: uniqueForeignKeyCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "unique_foreign_key"
    },
    tags: {
      omit: "create,update,delete,all,order,filter",
      behavior: ["-insert -update -delete -query:resource:list -query:resource:connection -order -orderBy -filter -filterBy"]
    }
  },
  uniques: unique_foreign_keyUniques
};
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
const view_tableUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
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
const similar_table_1Uniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const similar_table_2Uniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const updatable_viewUniques = [{
  attributes: ["x"],
  extensions: {
    tags: {
      __proto__: null,
      behavior: "-single -update -delete"
    }
  }
}];
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
const authenticate_failFunctionIdentifer = sql.identifier("b", "authenticate_fail");
const jwt_token_resourceOptionsConfig = {
  executor: executor,
  name: "jwt_token",
  identifier: "main.b.jwt_token",
  from: jwtTokenIdentifier,
  codec: jwtTokenCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "jwt_token"
    },
    isInsertable: false,
    isUpdatable: false,
    isDeletable: false
  },
  isVirtual: true
};
const authenticateFunctionIdentifer = sql.identifier("b", "authenticate");
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
const left_arm_identityFunctionIdentifer = sql.identifier("c", "left_arm_identity");
const issue756_mutationFunctionIdentifer = sql.identifier("c", "issue756_mutation");
const issue756_set_mutationFunctionIdentifer = sql.identifier("c", "issue756_set_mutation");
const authenticate_manyFunctionIdentifer = sql.identifier("b", "authenticate_many");
const authenticate_payloadFunctionIdentifer = sql.identifier("b", "authenticate_payload");
const post_computed_interval_arrayFunctionIdentifer = sql.identifier("a", "post_computed_interval_array");
const post_computed_interval_setFunctionIdentifer = sql.identifier("a", "post_computed_interval_set");
const post_computed_text_arrayFunctionIdentifer = sql.identifier("a", "post_computed_text_array");
const post_computed_with_optional_argFunctionIdentifer = sql.identifier("a", "post_computed_with_optional_arg");
const post_computed_with_required_argFunctionIdentifer = sql.identifier("a", "post_computed_with_required_arg");
const post_headline_trimmedFunctionIdentifer = sql.identifier("a", "post_headline_trimmed");
const post_headline_trimmed_no_defaultsFunctionIdentifer = sql.identifier("a", "post_headline_trimmed_no_defaults");
const post_headline_trimmed_strictFunctionIdentifer = sql.identifier("a", "post_headline_trimmed_strict");
const query_output_two_rowsFunctionIdentifer = sql.identifier("c", "query_output_two_rows");
const postUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const post_resourceOptionsConfig = {
  executor: executor,
  name: "post",
  identifier: "main.a.post",
  from: postIdentifier,
  codec: postCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "post"
    }
  },
  uniques: postUniques
};
const compound_type_computed_fieldFunctionIdentifer = sql.identifier("c", "compound_type_computed_field");
const func_out_out_compound_typeFunctionIdentifer = sql.identifier("c", "func_out_out_compound_type");
const mutation_out_out_compound_typeFunctionIdentifer = sql.identifier("c", "mutation_out_out_compound_type");
const table_mutationFunctionIdentifer = sql.identifier("c", "table_mutation");
const table_queryFunctionIdentifer = sql.identifier("c", "table_query");
const post_with_suffixFunctionIdentifer = sql.identifier("a", "post_with_suffix");
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
const compound_type_mutationFunctionIdentifer = sql.identifier("b", "compound_type_mutation");
const compound_type_queryFunctionIdentifer = sql.identifier("b", "compound_type_query");
const compound_type_set_mutationFunctionIdentifer = sql.identifier("b", "compound_type_set_mutation");
const person_computed_outFunctionIdentifer = sql.identifier("c", "person_computed_out");
const person_first_nameFunctionIdentifer = sql.identifier("c", "person_first_name");
const person_computed_out_outFunctionIdentifer = sql.identifier("c", "person_computed_out_out");
const list_of_compound_types_mutationFunctionIdentifer = sql.identifier("c", "list_of_compound_types_mutation");
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
const mutation_compound_type_arrayFunctionIdentifer = sql.identifier("a", "mutation_compound_type_array");
const query_compound_type_arrayFunctionIdentifer = sql.identifier("a", "query_compound_type_array");
const compound_type_array_mutationFunctionIdentifer = sql.identifier("b", "compound_type_array_mutation");
const compound_type_array_queryFunctionIdentifer = sql.identifier("b", "compound_type_array_query");
const post_computed_compound_type_arrayFunctionIdentifer = sql.identifier("a", "post_computed_compound_type_array");
const post_manyFunctionIdentifer = sql.identifier("a", "post_many");
const person_first_postFunctionIdentifer = sql.identifier("c", "person_first_post");
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
const listsUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const typesUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const types_resourceOptionsConfig = {
  executor: executor,
  name: "types",
  identifier: "main.b.types",
  from: typesIdentifier,
  codec: typesCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "types"
    },
    tags: {
      foreignKey: ["(smallint) references a.post", "(id) references a.post"]
    }
  },
  uniques: typesUniques
};
const type_function_connectionFunctionIdentifer = sql.identifier("b", "type_function_connection");
const type_function_connection_mutationFunctionIdentifer = sql.identifier("b", "type_function_connection_mutation");
const type_functionFunctionIdentifer = sql.identifier("b", "type_function");
const type_function_mutationFunctionIdentifer = sql.identifier("b", "type_function_mutation");
const person_type_function_connectionFunctionIdentifer = sql.identifier("c", "person_type_function_connection");
const person_type_functionFunctionIdentifer = sql.identifier("c", "person_type_function");
const type_function_listFunctionIdentifer = sql.identifier("b", "type_function_list");
const type_function_list_mutationFunctionIdentifer = sql.identifier("b", "type_function_list_mutation");
const person_type_function_listFunctionIdentifer = sql.identifier("c", "person_type_function_list");
const registry = makeRegistry({
  pgExecutors: {
    __proto__: null,
    main: executor
  },
  pgCodecs: {
    __proto__: null,
    int4: TYPES.int,
    void: TYPES.void,
    intervalArray: LIST_TYPES.interval,
    interval: TYPES.interval,
    textArray: LIST_TYPES.text,
    text: TYPES.text,
    int8: TYPES.bigint,
    json: TYPES.json,
    jsonb: TYPES.jsonb,
    FuncOutOutRecord: registryConfig_pgCodecs_FuncOutOutRecord_FuncOutOutRecord,
    FuncOutOutSetofRecord: registryConfig_pgCodecs_FuncOutOutSetofRecord_FuncOutOutSetofRecord,
    FuncOutOutUnnamedRecord: registryConfig_pgCodecs_FuncOutOutUnnamedRecord_FuncOutOutUnnamedRecord,
    MutationOutOutRecord: registryConfig_pgCodecs_MutationOutOutRecord_MutationOutOutRecord,
    MutationOutOutSetofRecord: registryConfig_pgCodecs_MutationOutOutSetofRecord_MutationOutOutSetofRecord,
    MutationOutOutUnnamedRecord: registryConfig_pgCodecs_MutationOutOutUnnamedRecord_MutationOutOutUnnamedRecord,
    SearchTestSummariesRecord: registryConfig_pgCodecs_SearchTestSummariesRecord_SearchTestSummariesRecord,
    FuncOutUnnamedOutOutUnnamedRecord: registryConfig_pgCodecs_FuncOutUnnamedOutOutUnnamedRecord_FuncOutUnnamedOutOutUnnamedRecord,
    MutationOutUnnamedOutOutUnnamedRecord: registryConfig_pgCodecs_MutationOutUnnamedOutOutUnnamedRecord_MutationOutUnnamedOutOutUnnamedRecord,
    MutationReturnsTableMultiColRecord: registryConfig_pgCodecs_MutationReturnsTableMultiColRecord_MutationReturnsTableMultiColRecord,
    uuidArray: LIST_TYPES.uuid,
    uuid: TYPES.uuid,
    FuncReturnsTableMultiColRecord: registryConfig_pgCodecs_FuncReturnsTableMultiColRecord_FuncReturnsTableMultiColRecord,
    guid: guidCodec,
    varchar: TYPES.varchar,
    nonUpdatableView: nonUpdatableViewCodec,
    inputs: inputsCodec,
    patchs: patchsCodec,
    reserved: reservedCodec,
    reservedPatchs: reservedPatchsCodec,
    reservedInput: reservedInputCodec,
    defaultValue: defaultValueCodec,
    foreignKey: foreignKeyCodec,
    noPrimaryKey: noPrimaryKeyCodec,
    testview: testviewCodec,
    uniqueForeignKey: uniqueForeignKeyCodec,
    myTable: myTableCodec,
    personSecret: personSecretCodec,
    unlogged: unloggedCodec,
    viewTable: viewTableCodec,
    compoundKey: compoundKeyCodec,
    bool: TYPES.boolean,
    similarTable1: similarTable1Codec,
    similarTable2: similarTable2Codec,
    updatableView: updatableViewCodec,
    nullTestRecord: nullTestRecordCodec,
    edgeCase: edgeCaseCodec,
    int2: TYPES.int2,
    leftArm: leftArmCodec,
    float8: TYPES.float,
    jwtToken: jwtTokenCodec,
    numeric: TYPES.numeric,
    issue756: issue756Codec,
    notNullTimestamp: notNullTimestampCodec,
    timestamptz: TYPES.timestamptz,
    authPayload: authPayloadCodec,
    QueryOutputTwoRowsRecord: registryConfig_pgCodecs_QueryOutputTwoRowsRecord_QueryOutputTwoRowsRecord,
    post: postCodec,
    anEnumArray: anEnumArrayCodec,
    anEnum: anEnumCodec,
    comptypeArray: comptypeArrayCodec,
    comptype: comptypeCodec,
    FuncOutOutCompoundTypeRecord: registryConfig_pgCodecs_FuncOutOutCompoundTypeRecord_FuncOutOutCompoundTypeRecord,
    compoundType: compoundTypeCodec,
    color: colorCodec,
    enumCaps: enumCapsCodec,
    enumWithEmptyString: enumWithEmptyStringCodec,
    MutationOutOutCompoundTypeRecord: registryConfig_pgCodecs_MutationOutOutCompoundTypeRecord_MutationOutOutCompoundTypeRecord,
    PersonComputedOutOutRecord: registryConfig_pgCodecs_PersonComputedOutOutRecord_PersonComputedOutOutRecord,
    PersonComputedInoutOutRecord: registryConfig_pgCodecs_PersonComputedInoutOutRecord_PersonComputedInoutOutRecord,
    PersonComputedFirstArgInoutOutRecord: registryConfig_pgCodecs_PersonComputedFirstArgInoutOutRecord_PersonComputedFirstArgInoutOutRecord,
    person: personCodec,
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
    lists: listsCodec,
    int4Array: LIST_TYPES.int,
    colorArray: colorArrayCodec,
    dateArray: LIST_TYPES.date,
    date: TYPES.date,
    timestamptzArray: LIST_TYPES.timestamptz,
    compoundTypeArray: compoundTypeArrayCodec,
    byteaArray: LIST_TYPES.bytea,
    bytea: TYPES.bytea,
    tsvectorArray: LIST_TYPES.tsvector,
    tsvector: TYPES.tsvector,
    tsqueryArray: LIST_TYPES.tsquery,
    tsquery: TYPES.tsquery,
    types: typesCodec,
    anInt: anIntCodec,
    anotherInt: anotherIntCodec,
    jsonpath: TYPES.jsonpath,
    numrange: numrangeCodec,
    daterange: daterangeCodec,
    anIntRange: anIntRangeCodec,
    time: TYPES.time,
    timetz: TYPES.timetz,
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
    ltree: spec_types_attributes_ltree_codec_ltree,
    "ltree[]": spec_types_attributes_ltree_array_codec_ltree_,
    bpchar: TYPES.bpchar,
    jwtTokenArray: listOfCodec(jwtTokenCodec, {
      name: "jwtTokenArray",
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "_jwt_token"
        }
      }
    }),
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
    floatrange: floatrangeCodec,
    postArray: postArrayCodec,
    int8Array: LIST_TYPES.bigint,
    tablefuncCrosstab2: recordCodec({
      name: "tablefuncCrosstab2",
      identifier: sql.identifier("a", "tablefunc_crosstab_2"),
      attributes: {
        __proto__: null,
        row_name: {
          codec: TYPES.text
        },
        category_1: {
          codec: TYPES.text
        },
        category_2: {
          codec: TYPES.text
        }
      },
      extensions: {
        isTableLike: false,
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "tablefunc_crosstab_2"
        }
      },
      executor: executor
    }),
    tablefuncCrosstab3: recordCodec({
      name: "tablefuncCrosstab3",
      identifier: sql.identifier("a", "tablefunc_crosstab_3"),
      attributes: {
        __proto__: null,
        row_name: {
          codec: TYPES.text
        },
        category_1: {
          codec: TYPES.text
        },
        category_2: {
          codec: TYPES.text
        },
        category_3: {
          codec: TYPES.text
        }
      },
      extensions: {
        isTableLike: false,
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "tablefunc_crosstab_3"
        }
      },
      executor: executor
    }),
    tablefuncCrosstab4: recordCodec({
      name: "tablefuncCrosstab4",
      identifier: sql.identifier("a", "tablefunc_crosstab_4"),
      attributes: {
        __proto__: null,
        row_name: {
          codec: TYPES.text
        },
        category_1: {
          codec: TYPES.text
        },
        category_2: {
          codec: TYPES.text
        },
        category_3: {
          codec: TYPES.text
        },
        category_4: {
          codec: TYPES.text
        }
      },
      extensions: {
        isTableLike: false,
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "tablefunc_crosstab_4"
        }
      },
      executor: executor
    }),
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
    return_void_mutation: {
      executor: executor,
      name: "return_void_mutation",
      identifier: "main.a.return_void_mutation()",
      from(...args) {
        return sql`${return_void_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      codec: TYPES.void,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "return_void_mutation"
        }
      },
      isUnique: true,
      isMutation: true
    },
    mutation_interval_array: {
      executor: executor,
      name: "mutation_interval_array",
      identifier: "main.a.mutation_interval_array()",
      from(...args) {
        return sql`${mutation_interval_arrayFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      codec: LIST_TYPES.interval,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "mutation_interval_array"
        }
      },
      isUnique: true,
      isMutation: true
    },
    query_interval_array: {
      executor: executor,
      name: "query_interval_array",
      identifier: "main.a.query_interval_array()",
      from(...args) {
        return sql`${query_interval_arrayFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      codec: LIST_TYPES.interval,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "query_interval_array"
        }
      },
      isUnique: true
    },
    mutation_interval_set: {
      executor: executor,
      name: "mutation_interval_set",
      identifier: "main.a.mutation_interval_set()",
      from(...args) {
        return sql`${mutation_interval_setFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      codec: TYPES.interval,
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "mutation_interval_set"
        }
      },
      isMutation: true
    },
    query_interval_set: {
      executor: executor,
      name: "query_interval_set",
      identifier: "main.a.query_interval_set()",
      from(...args) {
        return sql`${query_interval_setFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      codec: TYPES.interval,
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "query_interval_set"
        }
      }
    },
    mutation_text_array: {
      executor: executor,
      name: "mutation_text_array",
      identifier: "main.a.mutation_text_array()",
      from(...args) {
        return sql`${mutation_text_arrayFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      codec: LIST_TYPES.text,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "mutation_text_array"
        }
      },
      isUnique: true,
      isMutation: true
    },
    query_text_array: {
      executor: executor,
      name: "query_text_array",
      identifier: "main.a.query_text_array()",
      from(...args) {
        return sql`${query_text_arrayFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      codec: LIST_TYPES.text,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "query_text_array"
        }
      },
      isUnique: true
    },
    static_big_integer: {
      executor: executor,
      name: "static_big_integer",
      identifier: "main.a.static_big_integer()",
      from(...args) {
        return sql`${static_big_integerFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      codec: TYPES.bigint,
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "static_big_integer"
        }
      }
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
    assert_something: {
      executor: executor,
      name: "assert_something",
      identifier: "main.a.assert_something(text)",
      from(...args) {
        return sql`${assert_somethingFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "in_arg",
        codec: TYPES.text,
        required: true
      }],
      codec: TYPES.void,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "assert_something"
        }
      },
      isUnique: true
    },
    assert_something_nx: {
      executor: executor,
      name: "assert_something_nx",
      identifier: "main.a.assert_something_nx(text)",
      from(...args) {
        return sql`${assert_something_nxFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "in_arg",
        codec: TYPES.text,
        required: true
      }],
      codec: TYPES.void,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "assert_something_nx"
        },
        tags: {
          omit: "execute",
          behavior: ["-queryField -mutationField -typeField"]
        }
      },
      isUnique: true
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
    add_1_mutation: {
      executor: executor,
      name: "add_1_mutation",
      identifier: "main.a.add_1_mutation(int4,int4)",
      from(...args) {
        return sql`${add_1_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: null,
        codec: TYPES.int,
        required: true,
        notNull: true
      }, {
        name: null,
        codec: TYPES.int,
        required: true,
        notNull: true
      }],
      codec: TYPES.int,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "add_1_mutation"
        },
        tags: {
          notNull: true
        }
      },
      isUnique: true,
      isMutation: true,
      description: "lol, add some stuff 1 mutation"
    },
    add_1_query: {
      executor: executor,
      name: "add_1_query",
      identifier: "main.a.add_1_query(int4,int4)",
      from(...args) {
        return sql`${add_1_queryFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: null,
        codec: TYPES.int,
        required: true,
        notNull: true
      }, {
        name: null,
        codec: TYPES.int,
        required: true,
        notNull: true
      }],
      codec: TYPES.int,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "add_1_query"
        }
      },
      isUnique: true,
      description: "lol, add some stuff 1 query"
    },
    add_2_mutation: {
      executor: executor,
      name: "add_2_mutation",
      identifier: "main.a.add_2_mutation(int4,int4)",
      from(...args) {
        return sql`${add_2_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "a",
        codec: TYPES.int,
        required: true,
        notNull: true
      }, {
        name: "b",
        codec: TYPES.int,
        notNull: true
      }],
      codec: TYPES.int,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "add_2_mutation"
        }
      },
      isUnique: true,
      isMutation: true,
      description: "lol, add some stuff 2 mutation"
    },
    add_2_query: {
      executor: executor,
      name: "add_2_query",
      identifier: "main.a.add_2_query(int4,int4)",
      from(...args) {
        return sql`${add_2_queryFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "a",
        codec: TYPES.int,
        required: true,
        notNull: true
      }, {
        name: "b",
        codec: TYPES.int,
        notNull: true
      }],
      codec: TYPES.int,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "add_2_query"
        }
      },
      isUnique: true,
      description: "lol, add some stuff 2 query"
    },
    add_3_mutation: {
      executor: executor,
      name: "add_3_mutation",
      identifier: "main.a.add_3_mutation(int4,int4)",
      from(...args) {
        return sql`${add_3_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "a",
        codec: TYPES.int,
        required: true
      }, {
        name: "",
        codec: TYPES.int,
        required: true
      }],
      codec: TYPES.int,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "add_3_mutation"
        }
      },
      isUnique: true,
      isMutation: true,
      description: "lol, add some stuff 3 mutation"
    },
    add_3_query: {
      executor: executor,
      name: "add_3_query",
      identifier: "main.a.add_3_query(int4,int4)",
      from(...args) {
        return sql`${add_3_queryFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "a",
        codec: TYPES.int,
        required: true
      }, {
        name: "",
        codec: TYPES.int,
        required: true
      }],
      codec: TYPES.int,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "add_3_query"
        }
      },
      isUnique: true,
      description: "lol, add some stuff 3 query"
    },
    add_4_mutation: {
      executor: executor,
      name: "add_4_mutation",
      identifier: "main.a.add_4_mutation(int4,int4)",
      from(...args) {
        return sql`${add_4_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "",
        codec: TYPES.int,
        required: true
      }, {
        name: "b",
        codec: TYPES.int
      }],
      codec: TYPES.int,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "add_4_mutation"
        }
      },
      isUnique: true,
      isMutation: true,
      description: "lol, add some stuff 4 mutation"
    },
    add_4_mutation_error: {
      executor: executor,
      name: "add_4_mutation_error",
      identifier: "main.a.add_4_mutation_error(int4,int4)",
      from(...args) {
        return sql`${add_4_mutation_errorFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "",
        codec: TYPES.int,
        required: true
      }, {
        name: "b",
        codec: TYPES.int
      }],
      codec: TYPES.int,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "add_4_mutation_error"
        }
      },
      isUnique: true,
      isMutation: true
    },
    add_4_query: {
      executor: executor,
      name: "add_4_query",
      identifier: "main.a.add_4_query(int4,int4)",
      from(...args) {
        return sql`${add_4_queryFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "",
        codec: TYPES.int,
        required: true
      }, {
        name: "b",
        codec: TYPES.int
      }],
      codec: TYPES.int,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "add_4_query"
        }
      },
      isUnique: true,
      description: "lol, add some stuff 4 query"
    },
    mult_1: {
      executor: executor,
      name: "mult_1",
      identifier: "main.b.mult_1(int4,int4)",
      from(...args) {
        return sql`${mult_1FunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: null,
        codec: TYPES.int,
        required: true
      }, {
        name: null,
        codec: TYPES.int,
        required: true
      }],
      codec: TYPES.int,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "mult_1"
        }
      },
      isUnique: true,
      isMutation: true
    },
    mult_2: {
      executor: executor,
      name: "mult_2",
      identifier: "main.b.mult_2(int4,int4)",
      from(...args) {
        return sql`${mult_2FunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: null,
        codec: TYPES.int,
        required: true
      }, {
        name: null,
        codec: TYPES.int,
        required: true
      }],
      codec: TYPES.int,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "mult_2"
        }
      },
      isUnique: true,
      isMutation: true
    },
    mult_3: {
      executor: executor,
      name: "mult_3",
      identifier: "main.b.mult_3(int4,int4)",
      from(...args) {
        return sql`${mult_3FunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: null,
        codec: TYPES.int,
        required: true,
        notNull: true
      }, {
        name: null,
        codec: TYPES.int,
        required: true,
        notNull: true
      }],
      codec: TYPES.int,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "mult_3"
        }
      },
      isUnique: true,
      isMutation: true
    },
    mult_4: {
      executor: executor,
      name: "mult_4",
      identifier: "main.b.mult_4(int4,int4)",
      from(...args) {
        return sql`${mult_4FunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: null,
        codec: TYPES.int,
        required: true,
        notNull: true
      }, {
        name: null,
        codec: TYPES.int,
        required: true,
        notNull: true
      }],
      codec: TYPES.int,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "mult_4"
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
    optional_missing_middle_1: {
      executor: executor,
      name: "optional_missing_middle_1",
      identifier: "main.a.optional_missing_middle_1(int4,int4,int4)",
      from(...args) {
        return sql`${optional_missing_middle_1FunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
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
          schemaName: "a",
          name: "optional_missing_middle_1"
        }
      },
      isUnique: true
    },
    optional_missing_middle_2: {
      executor: executor,
      name: "optional_missing_middle_2",
      identifier: "main.a.optional_missing_middle_2(int4,int4,int4)",
      from(...args) {
        return sql`${optional_missing_middle_2FunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
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
          schemaName: "a",
          name: "optional_missing_middle_2"
        }
      },
      isUnique: true
    },
    optional_missing_middle_3: {
      executor: executor,
      name: "optional_missing_middle_3",
      identifier: "main.a.optional_missing_middle_3(int4,int4,int4)",
      from(...args) {
        return sql`${optional_missing_middle_3FunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
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
          schemaName: "a",
          name: "optional_missing_middle_3"
        }
      },
      isUnique: true
    },
    optional_missing_middle_4: {
      executor: executor,
      name: "optional_missing_middle_4",
      identifier: "main.a.optional_missing_middle_4(int4,int4,int4)",
      from(...args) {
        return sql`${optional_missing_middle_4FunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
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
          schemaName: "a",
          name: "optional_missing_middle_4"
        }
      },
      isUnique: true
    },
    optional_missing_middle_5: {
      executor: executor,
      name: "optional_missing_middle_5",
      identifier: "main.a.optional_missing_middle_5(int4,int4,int4)",
      from(...args) {
        return sql`${optional_missing_middle_5FunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
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
          schemaName: "a",
          name: "optional_missing_middle_5"
        }
      },
      isUnique: true
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
    list_bde_mutation: {
      executor: executor,
      name: "list_bde_mutation",
      identifier: "main.b.list_bde_mutation(_text,text,text)",
      from(...args) {
        return sql`${list_bde_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "b",
        codec: LIST_TYPES.text,
        required: true
      }, {
        name: "d",
        codec: TYPES.text,
        required: true
      }, {
        name: "e",
        codec: TYPES.text,
        required: true
      }],
      codec: LIST_TYPES.uuid,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "list_bde_mutation"
        }
      },
      isUnique: true,
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
    guid_fn: {
      executor: executor,
      name: "guid_fn",
      identifier: "main.b.guid_fn(b.guid)",
      from(...args) {
        return sql`${guid_fnFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "g",
        codec: guidCodec,
        required: true
      }],
      codec: guidCodec,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "guid_fn"
        }
      },
      isUnique: true,
      isMutation: true
    },
    non_updatable_view: {
      executor: executor,
      name: "non_updatable_view",
      identifier: "main.a.non_updatable_view",
      from: nonUpdatableViewIdentifier,
      codec: nonUpdatableViewCodec,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "non_updatable_view"
        },
        isInsertable: false,
        isUpdatable: false,
        isDeletable: false
      }
    },
    inputs: {
      executor: executor,
      name: "inputs",
      identifier: "main.a.inputs",
      from: inputsIdentifier,
      codec: inputsCodec,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "inputs"
        }
      },
      uniques: inputsUniques,
      description: "Should output as Input"
    },
    patchs: {
      executor: executor,
      name: "patchs",
      identifier: "main.a.patchs",
      from: patchsIdentifier,
      codec: patchsCodec,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "patchs"
        }
      },
      uniques: patchsUniques,
      description: "Should output as Patch"
    },
    reserved: {
      executor: executor,
      name: "reserved",
      identifier: "main.a.reserved",
      from: reservedIdentifier,
      codec: reservedCodec,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "reserved"
        }
      },
      uniques: reservedUniques
    },
    reservedPatchs: {
      executor: executor,
      name: "reservedPatchs",
      identifier: "main.a.reservedPatchs",
      from: reservedPatchsIdentifier,
      codec: reservedPatchsCodec,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "reservedPatchs"
        }
      },
      uniques: reservedPatchsUniques,
      description: "`reservedPatchs` table should get renamed to ReservedPatchRecord to prevent clashes with ReservedPatch from `reserved` table"
    },
    reserved_input: {
      executor: executor,
      name: "reserved_input",
      identifier: "main.a.reserved_input",
      from: reservedInputIdentifier,
      codec: reservedInputCodec,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "reserved_input"
        }
      },
      uniques: reserved_inputUniques,
      description: "`reserved_input` table should get renamed to ReservedInputRecord to prevent clashes with ReservedInput from `reserved` table"
    },
    default_value: {
      executor: executor,
      name: "default_value",
      identifier: "main.a.default_value",
      from: defaultValueIdentifier,
      codec: defaultValueCodec,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "default_value"
        }
      },
      uniques: default_valueUniques
    },
    foreign_key: foreign_key_resourceOptionsConfig,
    no_primary_key: {
      executor: executor,
      name: "no_primary_key",
      identifier: "main.a.no_primary_key",
      from: noPrimaryKeyIdentifier,
      codec: noPrimaryKeyCodec,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "no_primary_key"
        }
      },
      uniques: no_primary_keyUniques
    },
    testview: {
      executor: executor,
      name: "testview",
      identifier: "main.a.testview",
      from: testviewIdentifier,
      codec: testviewCodec,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "testview"
        }
      }
    },
    unique_foreign_key: unique_foreign_key_resourceOptionsConfig,
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
    view_table: {
      executor: executor,
      name: "view_table",
      identifier: "main.a.view_table",
      from: viewTableIdentifier,
      codec: viewTableCodec,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "view_table"
        }
      },
      uniques: view_tableUniques
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
    similar_table_1: {
      executor: executor,
      name: "similar_table_1",
      identifier: "main.a.similar_table_1",
      from: similarTable1Identifier,
      codec: similarTable1Codec,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "similar_table_1"
        }
      },
      uniques: similar_table_1Uniques
    },
    similar_table_2: {
      executor: executor,
      name: "similar_table_2",
      identifier: "main.a.similar_table_2",
      from: similarTable2Identifier,
      codec: similarTable2Codec,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "similar_table_2"
        }
      },
      uniques: similar_table_2Uniques
    },
    updatable_view: {
      executor: executor,
      name: "updatable_view",
      identifier: "main.b.updatable_view",
      from: updatableViewIdentifier,
      codec: updatableViewCodec,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "updatable_view"
        },
        tags: {
          uniqueKey: "x",
          unique: "x|@behavior -single -update -delete"
        }
      },
      uniques: updatable_viewUniques,
      description: "YOYOYO!!"
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
    authenticate_fail: PgResource.functionResourceOptions(jwt_token_resourceOptionsConfig, {
      name: "authenticate_fail",
      identifier: "main.b.authenticate_fail()",
      from(...args) {
        return sql`${authenticate_failFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsSetof: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "authenticate_fail"
        }
      },
      isMutation: true
    }),
    authenticate: PgResource.functionResourceOptions(jwt_token_resourceOptionsConfig, {
      name: "authenticate",
      identifier: "main.b.authenticate(int4,numeric,int8)",
      from(...args) {
        return sql`${authenticateFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "a",
        codec: TYPES.int,
        required: true
      }, {
        name: "b",
        codec: TYPES.numeric,
        required: true
      }, {
        name: "c",
        codec: TYPES.bigint,
        required: true
      }],
      returnsSetof: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "authenticate"
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
    authenticate_many: PgResource.functionResourceOptions(jwt_token_resourceOptionsConfig, {
      name: "authenticate_many",
      identifier: "main.b.authenticate_many(int4,numeric,int8)",
      from(...args) {
        return sql`${authenticate_manyFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "a",
        codec: TYPES.int,
        required: true
      }, {
        name: "b",
        codec: TYPES.numeric,
        required: true
      }, {
        name: "c",
        codec: TYPES.bigint,
        required: true
      }],
      returnsSetof: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "authenticate_many"
        }
      },
      isMutation: true,
      returnsArray: true
    }),
    authenticate_payload: PgResource.functionResourceOptions({
      executor: executor,
      name: "auth_payload",
      identifier: "main.b.auth_payload",
      from: authPayloadIdentifier,
      codec: authPayloadCodec,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "auth_payload"
        },
        isInsertable: false,
        isUpdatable: false,
        isDeletable: false,
        tags: {
          foreignKey: "(id) references c.person"
        }
      },
      isVirtual: true
    }, {
      name: "authenticate_payload",
      identifier: "main.b.authenticate_payload(int4,numeric,int8)",
      from(...args) {
        return sql`${authenticate_payloadFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "a",
        codec: TYPES.int,
        required: true
      }, {
        name: "b",
        codec: TYPES.numeric,
        required: true
      }, {
        name: "c",
        codec: TYPES.bigint,
        required: true
      }],
      returnsSetof: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "authenticate_payload"
        }
      },
      isMutation: true
    }),
    post_computed_interval_array: {
      executor: executor,
      name: "post_computed_interval_array",
      identifier: "main.a.post_computed_interval_array(a.post)",
      from(...args) {
        return sql`${post_computed_interval_arrayFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "post",
        codec: postCodec,
        required: true
      }],
      codec: LIST_TYPES.interval,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "post_computed_interval_array"
        }
      },
      isUnique: true
    },
    post_computed_interval_set: {
      executor: executor,
      name: "post_computed_interval_set",
      identifier: "main.a.post_computed_interval_set(a.post)",
      from(...args) {
        return sql`${post_computed_interval_setFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "post",
        codec: postCodec,
        required: true
      }],
      codec: TYPES.interval,
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "post_computed_interval_set"
        }
      }
    },
    post_computed_text_array: {
      executor: executor,
      name: "post_computed_text_array",
      identifier: "main.a.post_computed_text_array(a.post)",
      from(...args) {
        return sql`${post_computed_text_arrayFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "post",
        codec: postCodec,
        required: true
      }],
      codec: LIST_TYPES.text,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "post_computed_text_array"
        }
      },
      isUnique: true
    },
    post_computed_with_optional_arg: {
      executor: executor,
      name: "post_computed_with_optional_arg",
      identifier: "main.a.post_computed_with_optional_arg(a.post,int4)",
      from(...args) {
        return sql`${post_computed_with_optional_argFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "post",
        codec: postCodec,
        required: true,
        notNull: true
      }, {
        name: "i",
        codec: TYPES.int,
        notNull: true
      }],
      codec: TYPES.int,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "post_computed_with_optional_arg"
        },
        tags: {
          sortable: true,
          filterable: true,
          behavior: ["filter filterBy", "orderBy order resource:connection:backwards"]
        }
      },
      isUnique: true
    },
    post_computed_with_required_arg: {
      executor: executor,
      name: "post_computed_with_required_arg",
      identifier: "main.a.post_computed_with_required_arg(a.post,int4)",
      from(...args) {
        return sql`${post_computed_with_required_argFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "post",
        codec: postCodec,
        required: true,
        notNull: true
      }, {
        name: "i",
        codec: TYPES.int,
        required: true,
        notNull: true
      }],
      codec: TYPES.int,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "post_computed_with_required_arg"
        },
        tags: {
          sortable: true,
          filterable: true,
          behavior: ["filter filterBy", "orderBy order resource:connection:backwards"]
        }
      },
      isUnique: true
    },
    post_headline_trimmed: {
      executor: executor,
      name: "post_headline_trimmed",
      identifier: "main.a.post_headline_trimmed(a.post,int4,text)",
      from(...args) {
        return sql`${post_headline_trimmedFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "post",
        codec: postCodec,
        required: true
      }, {
        name: "length",
        codec: TYPES.int
      }, {
        name: "omission",
        codec: TYPES.text
      }],
      codec: TYPES.text,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "post_headline_trimmed"
        }
      },
      isUnique: true
    },
    post_headline_trimmed_no_defaults: {
      executor: executor,
      name: "post_headline_trimmed_no_defaults",
      identifier: "main.a.post_headline_trimmed_no_defaults(a.post,int4,text)",
      from(...args) {
        return sql`${post_headline_trimmed_no_defaultsFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "post",
        codec: postCodec,
        required: true
      }, {
        name: "length",
        codec: TYPES.int,
        required: true
      }, {
        name: "omission",
        codec: TYPES.text,
        required: true
      }],
      codec: TYPES.text,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "post_headline_trimmed_no_defaults"
        }
      },
      isUnique: true
    },
    post_headline_trimmed_strict: {
      executor: executor,
      name: "post_headline_trimmed_strict",
      identifier: "main.a.post_headline_trimmed_strict(a.post,int4,text)",
      from(...args) {
        return sql`${post_headline_trimmed_strictFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "post",
        codec: postCodec,
        required: true,
        notNull: true
      }, {
        name: "length",
        codec: TYPES.int,
        notNull: true
      }, {
        name: "omission",
        codec: TYPES.text,
        notNull: true
      }],
      codec: TYPES.text,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "post_headline_trimmed_strict"
        }
      },
      isUnique: true
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
    post: post_resourceOptionsConfig,
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
    table_mutation: PgResource.functionResourceOptions(post_resourceOptionsConfig, {
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
    table_query: PgResource.functionResourceOptions(post_resourceOptionsConfig, {
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
    post_with_suffix: PgResource.functionResourceOptions(post_resourceOptionsConfig, {
      name: "post_with_suffix",
      identifier: "main.a.post_with_suffix(a.post,text)",
      from(...args) {
        return sql`${post_with_suffixFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "post",
        codec: postCodec,
        required: true
      }, {
        name: "suffix",
        codec: TYPES.text,
        required: true
      }],
      returnsSetof: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "post_with_suffix"
        },
        tags: {
          deprecated: "This is deprecated (comment on function a.post_with_suffix)."
        }
      },
      isMutation: true
    }),
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
    compound_type_mutation: PgResource.functionResourceOptions(compound_type_resourceOptionsConfig, {
      name: "compound_type_mutation",
      identifier: "main.b.compound_type_mutation(c.compound_type)",
      from(...args) {
        return sql`${compound_type_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "object",
        codec: compoundTypeCodec,
        required: true
      }],
      returnsSetof: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "compound_type_mutation"
        }
      },
      isMutation: true
    }),
    compound_type_query: PgResource.functionResourceOptions(compound_type_resourceOptionsConfig, {
      name: "compound_type_query",
      identifier: "main.b.compound_type_query(c.compound_type)",
      from(...args) {
        return sql`${compound_type_queryFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "object",
        codec: compoundTypeCodec,
        required: true
      }],
      returnsSetof: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "compound_type_query"
        }
      }
    }),
    compound_type_set_mutation: PgResource.functionResourceOptions(compound_type_resourceOptionsConfig, {
      name: "compound_type_set_mutation",
      identifier: "main.b.compound_type_set_mutation(c.compound_type)",
      from(...args) {
        return sql`${compound_type_set_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "object",
        codec: compoundTypeCodec,
        required: true
      }],
      returnsSetof: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "compound_type_set_mutation"
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
    mutation_compound_type_array: PgResource.functionResourceOptions(compound_type_resourceOptionsConfig, {
      name: "mutation_compound_type_array",
      identifier: "main.a.mutation_compound_type_array(c.compound_type)",
      from(...args) {
        return sql`${mutation_compound_type_arrayFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "object",
        codec: compoundTypeCodec,
        required: true
      }],
      returnsSetof: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "mutation_compound_type_array"
        }
      },
      isMutation: true,
      returnsArray: true
    }),
    query_compound_type_array: PgResource.functionResourceOptions(compound_type_resourceOptionsConfig, {
      name: "query_compound_type_array",
      identifier: "main.a.query_compound_type_array(c.compound_type)",
      from(...args) {
        return sql`${query_compound_type_arrayFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "object",
        codec: compoundTypeCodec,
        required: true
      }],
      returnsSetof: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "query_compound_type_array"
        }
      },
      returnsArray: true
    }),
    compound_type_array_mutation: PgResource.functionResourceOptions(compound_type_resourceOptionsConfig, {
      name: "compound_type_array_mutation",
      identifier: "main.b.compound_type_array_mutation(c.compound_type)",
      from(...args) {
        return sql`${compound_type_array_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "object",
        codec: compoundTypeCodec,
        required: true
      }],
      returnsSetof: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "compound_type_array_mutation"
        }
      },
      isMutation: true,
      returnsArray: true
    }),
    compound_type_array_query: PgResource.functionResourceOptions(compound_type_resourceOptionsConfig, {
      name: "compound_type_array_query",
      identifier: "main.b.compound_type_array_query(c.compound_type)",
      from(...args) {
        return sql`${compound_type_array_queryFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "object",
        codec: compoundTypeCodec,
        required: true
      }],
      returnsSetof: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "compound_type_array_query"
        }
      },
      returnsArray: true
    }),
    post_computed_compound_type_array: PgResource.functionResourceOptions(compound_type_resourceOptionsConfig, {
      name: "post_computed_compound_type_array",
      identifier: "main.a.post_computed_compound_type_array(a.post,c.compound_type)",
      from(...args) {
        return sql`${post_computed_compound_type_arrayFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "post",
        codec: postCodec,
        required: true
      }, {
        name: "object",
        codec: compoundTypeCodec,
        required: true
      }],
      returnsSetof: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "post_computed_compound_type_array"
        }
      },
      returnsArray: true
    }),
    post_many: PgResource.functionResourceOptions(post_resourceOptionsConfig, {
      name: "post_many",
      identifier: "main.a.post_many(a._post)",
      from(...args) {
        return sql`${post_manyFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "posts",
        codec: postArrayCodec,
        required: true
      }],
      returnsSetof: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "post_many"
        }
      },
      isMutation: true,
      hasImplicitOrder: true
    }),
    person_first_post: PgResource.functionResourceOptions(post_resourceOptionsConfig, {
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
    person: person_resourceOptionsConfig,
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
    lists: {
      executor: executor,
      name: "lists",
      identifier: "main.b.lists",
      from: listsIdentifier,
      codec: listsCodec,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "lists"
        }
      },
      uniques: listsUniques
    },
    types: types_resourceOptionsConfig,
    type_function_connection: PgResource.functionResourceOptions(types_resourceOptionsConfig, {
      name: "type_function_connection",
      identifier: "main.b.type_function_connection()",
      from(...args) {
        return sql`${type_function_connectionFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsSetof: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "type_function_connection"
        }
      },
      hasImplicitOrder: true
    }),
    type_function_connection_mutation: PgResource.functionResourceOptions(types_resourceOptionsConfig, {
      name: "type_function_connection_mutation",
      identifier: "main.b.type_function_connection_mutation()",
      from(...args) {
        return sql`${type_function_connection_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsSetof: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "type_function_connection_mutation"
        }
      },
      isMutation: true,
      hasImplicitOrder: true
    }),
    type_function: PgResource.functionResourceOptions(types_resourceOptionsConfig, {
      name: "type_function",
      identifier: "main.b.type_function(int4)",
      from(...args) {
        return sql`${type_functionFunctionIdentifer}(${sqlFromArgDigests(args)})`;
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
          schemaName: "b",
          name: "type_function"
        }
      }
    }),
    type_function_mutation: PgResource.functionResourceOptions(types_resourceOptionsConfig, {
      name: "type_function_mutation",
      identifier: "main.b.type_function_mutation(int4)",
      from(...args) {
        return sql`${type_function_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
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
          schemaName: "b",
          name: "type_function_mutation"
        }
      },
      isMutation: true
    }),
    person_type_function_connection: PgResource.functionResourceOptions(types_resourceOptionsConfig, {
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
    person_type_function: PgResource.functionResourceOptions(types_resourceOptionsConfig, {
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
    type_function_list: PgResource.functionResourceOptions(types_resourceOptionsConfig, {
      name: "type_function_list",
      identifier: "main.b.type_function_list()",
      from(...args) {
        return sql`${type_function_listFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsSetof: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "type_function_list"
        }
      },
      returnsArray: true
    }),
    type_function_list_mutation: PgResource.functionResourceOptions(types_resourceOptionsConfig, {
      name: "type_function_list_mutation",
      identifier: "main.b.type_function_list_mutation()",
      from(...args) {
        return sql`${type_function_list_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsSetof: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "type_function_list_mutation"
        }
      },
      isMutation: true,
      returnsArray: true
    }),
    person_type_function_list: PgResource.functionResourceOptions(types_resourceOptionsConfig, {
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
    foreignKey: {
      __proto__: null,
      compoundKeyByMyCompoundKey1AndCompoundKey2: {
        localCodec: foreignKeyCodec,
        remoteResourceOptions: compound_key_resourceOptionsConfig,
        localAttributes: ["compound_key_1", "compound_key_2"],
        remoteAttributes: ["person_id_1", "person_id_2"],
        isUnique: true
      },
      personByMyPersonId: {
        localCodec: foreignKeyCodec,
        remoteResourceOptions: person_resourceOptionsConfig,
        localAttributes: ["person_id"],
        remoteAttributes: ["id"],
        isUnique: true
      }
    },
    post: {
      __proto__: null,
      personByMyAuthorId: {
        localCodec: postCodec,
        remoteResourceOptions: person_resourceOptionsConfig,
        localAttributes: ["author_id"],
        remoteAttributes: ["id"],
        isUnique: true
      },
      typesByTheirSmallint: {
        localCodec: postCodec,
        remoteResourceOptions: types_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["smallint"],
        isReferencee: true
      },
      typesByTheirId: {
        localCodec: postCodec,
        remoteResourceOptions: types_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["id"],
        isUnique: true,
        isReferencee: true
      }
    },
    uniqueForeignKey: {
      __proto__: null,
      compoundKeyByMyCompoundKey1AndCompoundKey2: {
        localCodec: uniqueForeignKeyCodec,
        remoteResourceOptions: compound_key_resourceOptionsConfig,
        localAttributes: ["compound_key_1", "compound_key_2"],
        remoteAttributes: ["person_id_1", "person_id_2"],
        isUnique: true
      }
    },
    authPayload: {
      __proto__: null,
      personByMyId: {
        localCodec: authPayloadCodec,
        remoteResourceOptions: person_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["id"],
        isUnique: true
      }
    },
    types: {
      __proto__: null,
      postByMySmallint: {
        localCodec: typesCodec,
        remoteResourceOptions: post_resourceOptionsConfig,
        localAttributes: ["smallint"],
        remoteAttributes: ["id"],
        isUnique: true
      },
      postByMyId: {
        localCodec: typesCodec,
        remoteResourceOptions: post_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["id"],
        isUnique: true
      }
    },
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
      },
      foreignKeysByTheirCompoundKey1AndCompoundKey2: {
        localCodec: compoundKeyCodec,
        remoteResourceOptions: foreign_key_resourceOptionsConfig,
        localAttributes: ["person_id_1", "person_id_2"],
        remoteAttributes: ["compound_key_1", "compound_key_2"],
        isReferencee: true
      },
      uniqueForeignKeyByTheirCompoundKey1AndCompoundKey2: {
        localCodec: compoundKeyCodec,
        remoteResourceOptions: unique_foreign_key_resourceOptionsConfig,
        localAttributes: ["person_id_1", "person_id_2"],
        remoteAttributes: ["compound_key_1", "compound_key_2"],
        isUnique: true,
        isReferencee: true
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
      postsByTheirAuthorId: {
        localCodec: personCodec,
        remoteResourceOptions: post_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["author_id"],
        isReferencee: true
      },
      foreignKeysByTheirPersonId: {
        localCodec: personCodec,
        remoteResourceOptions: foreign_key_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["person_id"],
        isReferencee: true
      },
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
const resource_inputsPgResource = registry.pgResources["inputs"];
const resource_patchsPgResource = registry.pgResources["patchs"];
const resource_reservedPgResource = registry.pgResources["reserved"];
const resource_reservedPatchsPgResource = registry.pgResources["reservedPatchs"];
const resource_reserved_inputPgResource = registry.pgResources["reserved_input"];
const resource_default_valuePgResource = registry.pgResources["default_value"];
const resource_no_primary_keyPgResource = registry.pgResources["no_primary_key"];
const resource_unique_foreign_keyPgResource = registry.pgResources["unique_foreign_key"];
const resource_my_tablePgResource = registry.pgResources["my_table"];
const resource_person_secretPgResource = registry.pgResources["person_secret"];
const resource_view_tablePgResource = registry.pgResources["view_table"];
const resource_compound_keyPgResource = registry.pgResources["compound_key"];
const resource_similar_table_1PgResource = registry.pgResources["similar_table_1"];
const resource_similar_table_2PgResource = registry.pgResources["similar_table_2"];
const resource_null_test_recordPgResource = registry.pgResources["null_test_record"];
const resource_left_armPgResource = registry.pgResources["left_arm"];
const resource_issue756PgResource = registry.pgResources["issue756"];
const resource_postPgResource = registry.pgResources["post"];
const resource_personPgResource = registry.pgResources["person"];
const resource_listsPgResource = registry.pgResources["lists"];
const resource_typesPgResource = registry.pgResources["types"];
const EMPTY_ARRAY = Object.freeze([]);
const makeArgs_person_computed_out = () => EMPTY_ARRAY;
const resource_current_user_idPgResource = registry.pgResources["current_user_id"];
const resource_func_outPgResource = registry.pgResources["func_out"];
const resource_func_out_setofPgResource = registry.pgResources["func_out_setof"];
const func_out_setof_getSelectPlanFromParentAndArgs = ($root, args, _info) => {
  const selectArgs = makeArgs_person_computed_out(args);
  return resource_func_out_setofPgResource.execute(selectArgs);
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
const resource_func_out_unnamedPgResource = registry.pgResources["func_out_unnamed"];
const resource_no_args_queryPgResource = registry.pgResources["no_args_query"];
const resource_query_interval_arrayPgResource = registry.pgResources["query_interval_array"];
const resource_query_interval_setPgResource = registry.pgResources["query_interval_set"];
const query_interval_set_getSelectPlanFromParentAndArgs = ($root, args, _info) => {
  const selectArgs = makeArgs_person_computed_out(args);
  return resource_query_interval_setPgResource.execute(selectArgs);
};
const resource_query_text_arrayPgResource = registry.pgResources["query_text_array"];
const resource_static_big_integerPgResource = registry.pgResources["static_big_integer"];
const static_big_integer_getSelectPlanFromParentAndArgs = ($root, args, _info) => {
  const selectArgs = makeArgs_person_computed_out(args);
  return resource_static_big_integerPgResource.execute(selectArgs);
};
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
const func_returns_table_one_col_getSelectPlanFromParentAndArgs = ($root, args, _info) => {
  const selectArgs = makeArgs_func_returns_table_one_col(args);
  return resource_func_returns_table_one_colPgResource.execute(selectArgs);
};
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
const argDetailsSimple_add_1_query = [{
  graphqlArgName: "arg0",
  pgCodec: TYPES.int,
  required: true
}, {
  graphqlArgName: "arg1",
  pgCodec: TYPES.int,
  required: true
}];
const makeArgs_add_1_query = (args, path = []) => argDetailsSimple_add_1_query.map(details => makeArg(path, args, details));
const resource_add_1_queryPgResource = registry.pgResources["add_1_query"];
const argDetailsSimple_add_2_query = [{
  graphqlArgName: "a",
  pgCodec: TYPES.int,
  postgresArgName: "a",
  required: true
}, {
  graphqlArgName: "b",
  pgCodec: TYPES.int,
  postgresArgName: "b"
}];
const makeArgs_add_2_query = (args, path = []) => argDetailsSimple_add_2_query.map(details => makeArg(path, args, details));
const resource_add_2_queryPgResource = registry.pgResources["add_2_query"];
const argDetailsSimple_add_3_query = [{
  graphqlArgName: "a",
  pgCodec: TYPES.int,
  postgresArgName: "a",
  required: true
}, {
  graphqlArgName: "arg1",
  pgCodec: TYPES.int,
  required: true
}];
const makeArgs_add_3_query = (args, path = []) => argDetailsSimple_add_3_query.map(details => makeArg(path, args, details));
const resource_add_3_queryPgResource = registry.pgResources["add_3_query"];
const argDetailsSimple_add_4_query = [{
  graphqlArgName: "arg0",
  pgCodec: TYPES.int,
  required: true
}, {
  graphqlArgName: "b",
  pgCodec: TYPES.int,
  postgresArgName: "b"
}];
const makeArgs_add_4_query = (args, path = []) => argDetailsSimple_add_4_query.map(details => makeArg(path, args, details));
const resource_add_4_queryPgResource = registry.pgResources["add_4_query"];
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
const func_out_out_setof_getSelectPlanFromParentAndArgs = ($root, args, _info) => {
  const selectArgs = makeArgs_person_computed_out(args);
  return resource_func_out_out_setofPgResource.execute(selectArgs);
};
const resource_func_out_out_unnamedPgResource = registry.pgResources["func_out_out_unnamed"];
const resource_search_test_summariesPgResource = registry.pgResources["search_test_summaries"];
const argDetailsSimple_optional_missing_middle_1 = [{
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
const makeArgs_optional_missing_middle_1 = (args, path = []) => argDetailsSimple_optional_missing_middle_1.map(details => makeArg(path, args, details));
const resource_optional_missing_middle_1PgResource = registry.pgResources["optional_missing_middle_1"];
const argDetailsSimple_optional_missing_middle_2 = [{
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
const makeArgs_optional_missing_middle_2 = (args, path = []) => argDetailsSimple_optional_missing_middle_2.map(details => makeArg(path, args, details));
const resource_optional_missing_middle_2PgResource = registry.pgResources["optional_missing_middle_2"];
const argDetailsSimple_optional_missing_middle_3 = [{
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
const makeArgs_optional_missing_middle_3 = (args, path = []) => argDetailsSimple_optional_missing_middle_3.map(details => makeArg(path, args, details));
const resource_optional_missing_middle_3PgResource = registry.pgResources["optional_missing_middle_3"];
const argDetailsSimple_optional_missing_middle_4 = [{
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
const makeArgs_optional_missing_middle_4 = (args, path = []) => argDetailsSimple_optional_missing_middle_4.map(details => makeArg(path, args, details));
const resource_optional_missing_middle_4PgResource = registry.pgResources["optional_missing_middle_4"];
const argDetailsSimple_optional_missing_middle_5 = [{
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
const makeArgs_optional_missing_middle_5 = (args, path = []) => argDetailsSimple_optional_missing_middle_5.map(details => makeArg(path, args, details));
const resource_optional_missing_middle_5PgResource = registry.pgResources["optional_missing_middle_5"];
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
const int_set_query_getSelectPlanFromParentAndArgs = ($root, args, _info) => {
  const selectArgs = makeArgs_int_set_query(args);
  return resource_int_set_queryPgResource.execute(selectArgs);
};
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
const func_returns_table_multi_col_getSelectPlanFromParentAndArgs = ($root, args, _info) => {
  const selectArgs = makeArgs_func_returns_table_multi_col(args);
  return resource_func_returns_table_multi_colPgResource.execute(selectArgs);
};
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
const argDetailsSimple_func_out_out_compound_type = [{
  graphqlArgName: "i1",
  pgCodec: TYPES.int,
  postgresArgName: "i1",
  required: true
}];
const makeArgs_func_out_out_compound_type = (args, path = []) => argDetailsSimple_func_out_out_compound_type.map(details => makeArg(path, args, details));
const resource_func_out_out_compound_typePgResource = registry.pgResources["func_out_out_compound_type"];
const argDetailsSimple_table_query = [{
  graphqlArgName: "id",
  pgCodec: TYPES.int,
  postgresArgName: "id",
  required: true
}];
const makeArgs_table_query = (args, path = []) => argDetailsSimple_table_query.map(details => makeArg(path, args, details));
const resource_table_queryPgResource = registry.pgResources["table_query"];
const resource_compound_type_set_queryPgResource = registry.pgResources["compound_type_set_query"];
const compound_type_set_query_getSelectPlanFromParentAndArgs = ($root, args, _info) => {
  const selectArgs = makeArgs_person_computed_out(args);
  return resource_compound_type_set_queryPgResource.execute(selectArgs);
};
const argDetailsSimple_compound_type_query = [{
  graphqlArgName: "object",
  pgCodec: compoundTypeCodec,
  postgresArgName: "object",
  required: true
}];
const makeArgs_compound_type_query = (args, path = []) => argDetailsSimple_compound_type_query.map(details => makeArg(path, args, details));
const resource_compound_type_queryPgResource = registry.pgResources["compound_type_query"];
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
const func_out_complex_setof_getSelectPlanFromParentAndArgs = ($root, args, _info) => {
  const selectArgs = makeArgs_func_out_complex_setof(args);
  return resource_func_out_complex_setofPgResource.execute(selectArgs);
};
const argDetailsSimple_query_compound_type_array = [{
  graphqlArgName: "object",
  pgCodec: compoundTypeCodec,
  postgresArgName: "object",
  required: true
}];
const makeArgs_query_compound_type_array = (args, path = []) => argDetailsSimple_query_compound_type_array.map(details => makeArg(path, args, details));
const resource_query_compound_type_arrayPgResource = registry.pgResources["query_compound_type_array"];
const argDetailsSimple_compound_type_array_query = [{
  graphqlArgName: "object",
  pgCodec: compoundTypeCodec,
  postgresArgName: "object",
  required: true
}];
const makeArgs_compound_type_array_query = (args, path = []) => argDetailsSimple_compound_type_array_query.map(details => makeArg(path, args, details));
const resource_compound_type_array_queryPgResource = registry.pgResources["compound_type_array_query"];
const resource_badly_behaved_functionPgResource = registry.pgResources["badly_behaved_function"];
const badly_behaved_function_getSelectPlanFromParentAndArgs = ($root, args, _info) => {
  const selectArgs = makeArgs_person_computed_out(args);
  return resource_badly_behaved_functionPgResource.execute(selectArgs);
};
const resource_func_out_tablePgResource = registry.pgResources["func_out_table"];
const resource_func_out_table_setofPgResource = registry.pgResources["func_out_table_setof"];
const func_out_table_setof_getSelectPlanFromParentAndArgs = ($root, args, _info) => {
  const selectArgs = makeArgs_person_computed_out(args);
  return resource_func_out_table_setofPgResource.execute(selectArgs);
};
const resource_table_set_queryPgResource = registry.pgResources["table_set_query"];
const table_set_query_getSelectPlanFromParentAndArgs = ($root, args, _info) => {
  const selectArgs = makeArgs_person_computed_out(args);
  return resource_table_set_queryPgResource.execute(selectArgs);
};
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
const resource_table_set_query_plpgsqlPgResource = registry.pgResources["table_set_query_plpgsql"];
const table_set_query_plpgsql_getSelectPlanFromParentAndArgs = ($root, args, _info) => {
  const selectArgs = makeArgs_person_computed_out(args);
  return resource_table_set_query_plpgsqlPgResource.execute(selectArgs);
};
const resource_type_function_connectionPgResource = registry.pgResources["type_function_connection"];
const type_function_connection_getSelectPlanFromParentAndArgs = ($root, args, _info) => {
  const selectArgs = makeArgs_person_computed_out(args);
  return resource_type_function_connectionPgResource.execute(selectArgs);
};
const argDetailsSimple_type_function = [{
  graphqlArgName: "id",
  pgCodec: TYPES.int,
  postgresArgName: "id",
  required: true
}];
const makeArgs_type_function = (args, path = []) => argDetailsSimple_type_function.map(details => makeArg(path, args, details));
const resource_type_functionPgResource = registry.pgResources["type_function"];
const resource_type_function_listPgResource = registry.pgResources["type_function_list"];
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
const nodeIdHandler_Input = makeTableNodeIdHandler({
  typeName: "Input",
  identifier: "inputs",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_inputsPgResource,
  pk: inputsUniques[0].attributes
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
const nodeFetcher_Input = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Input));
  return nodeIdHandler_Input.get(nodeIdHandler_Input.getSpec($decoded));
};
const nodeIdHandler_Patch = makeTableNodeIdHandler({
  typeName: "Patch",
  identifier: "patchs",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_patchsPgResource,
  pk: patchsUniques[0].attributes
});
const nodeFetcher_Patch = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Patch));
  return nodeIdHandler_Patch.get(nodeIdHandler_Patch.getSpec($decoded));
};
const nodeIdHandler_Reserved = makeTableNodeIdHandler({
  typeName: "Reserved",
  identifier: "reserveds",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_reservedPgResource,
  pk: reservedUniques[0].attributes
});
const nodeFetcher_Reserved = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Reserved));
  return nodeIdHandler_Reserved.get(nodeIdHandler_Reserved.getSpec($decoded));
};
const nodeIdHandler_ReservedPatchRecord = makeTableNodeIdHandler({
  typeName: "ReservedPatchRecord",
  identifier: "reservedPatchs",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_reservedPatchsPgResource,
  pk: reservedPatchsUniques[0].attributes
});
const nodeFetcher_ReservedPatchRecord = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_ReservedPatchRecord));
  return nodeIdHandler_ReservedPatchRecord.get(nodeIdHandler_ReservedPatchRecord.getSpec($decoded));
};
const nodeIdHandler_ReservedInputRecord = makeTableNodeIdHandler({
  typeName: "ReservedInputRecord",
  identifier: "reserved_inputs",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_reserved_inputPgResource,
  pk: reserved_inputUniques[0].attributes
});
const nodeFetcher_ReservedInputRecord = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_ReservedInputRecord));
  return nodeIdHandler_ReservedInputRecord.get(nodeIdHandler_ReservedInputRecord.getSpec($decoded));
};
const nodeIdHandler_DefaultValue = makeTableNodeIdHandler({
  typeName: "DefaultValue",
  identifier: "default_values",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_default_valuePgResource,
  pk: default_valueUniques[0].attributes
});
const nodeFetcher_DefaultValue = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_DefaultValue));
  return nodeIdHandler_DefaultValue.get(nodeIdHandler_DefaultValue.getSpec($decoded));
};
const nodeIdHandler_MyTable = makeTableNodeIdHandler({
  typeName: "MyTable",
  identifier: "my_tables",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_my_tablePgResource,
  pk: my_tableUniques[0].attributes
});
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
const nodeIdHandler_ViewTable = makeTableNodeIdHandler({
  typeName: "ViewTable",
  identifier: "view_tables",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_view_tablePgResource,
  pk: view_tableUniques[0].attributes
});
const nodeFetcher_ViewTable = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_ViewTable));
  return nodeIdHandler_ViewTable.get(nodeIdHandler_ViewTable.getSpec($decoded));
};
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
const nodeIdHandler_SimilarTable1 = makeTableNodeIdHandler({
  typeName: "SimilarTable1",
  identifier: "similar_table_1S",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_similar_table_1PgResource,
  pk: similar_table_1Uniques[0].attributes
});
const nodeFetcher_SimilarTable1 = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_SimilarTable1));
  return nodeIdHandler_SimilarTable1.get(nodeIdHandler_SimilarTable1.getSpec($decoded));
};
const nodeIdHandler_SimilarTable2 = makeTableNodeIdHandler({
  typeName: "SimilarTable2",
  identifier: "similar_table_2S",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_similar_table_2PgResource,
  pk: similar_table_2Uniques[0].attributes
});
const nodeFetcher_SimilarTable2 = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_SimilarTable2));
  return nodeIdHandler_SimilarTable2.get(nodeIdHandler_SimilarTable2.getSpec($decoded));
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
const nodeIdHandler_Post = makeTableNodeIdHandler({
  typeName: "Post",
  identifier: "posts",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_postPgResource,
  pk: postUniques[0].attributes
});
const nodeFetcher_Post = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Post));
  return nodeIdHandler_Post.get(nodeIdHandler_Post.getSpec($decoded));
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
const nodeIdHandler_List = makeTableNodeIdHandler({
  typeName: "List",
  identifier: "lists",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_listsPgResource,
  pk: listsUniques[0].attributes
});
const nodeFetcher_List = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_List));
  return nodeIdHandler_List.get(nodeIdHandler_List.getSpec($decoded));
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
const resource_non_updatable_viewPgResource = registry.pgResources["non_updatable_view"];
const resource_foreign_keyPgResource = registry.pgResources["foreign_key"];
const resource_testviewPgResource = registry.pgResources["testview"];
const resource_updatable_viewPgResource = registry.pgResources["updatable_view"];
const resource_edge_casePgResource = registry.pgResources["edge_case"];
const nodeIdHandlerByTypeName = {
  __proto__: null,
  Query: nodeIdHandler_Query,
  Input: nodeIdHandler_Input,
  Patch: nodeIdHandler_Patch,
  Reserved: nodeIdHandler_Reserved,
  ReservedPatchRecord: nodeIdHandler_ReservedPatchRecord,
  ReservedInputRecord: nodeIdHandler_ReservedInputRecord,
  DefaultValue: nodeIdHandler_DefaultValue,
  MyTable: nodeIdHandler_MyTable,
  PersonSecret: nodeIdHandler_PersonSecret,
  ViewTable: nodeIdHandler_ViewTable,
  CompoundKey: nodeIdHandler_CompoundKey,
  SimilarTable1: nodeIdHandler_SimilarTable1,
  SimilarTable2: nodeIdHandler_SimilarTable2,
  NullTestRecord: nodeIdHandler_NullTestRecord,
  LeftArm: nodeIdHandler_LeftArm,
  Issue756: nodeIdHandler_Issue756,
  Post: nodeIdHandler_Post,
  Person: nodeIdHandler_Person,
  List: nodeIdHandler_List,
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
const UniqueForeignKey_compoundKey1Plan = $record => {
  return $record.get("compound_key_1");
};
const UniqueForeignKey_compoundKey2Plan = $record => {
  return $record.get("compound_key_2");
};
const UniqueForeignKey_compoundKeyByCompoundKey1AndCompoundKey2Plan = $record => resource_compound_keyPgResource.get({
  person_id_1: $record.get("compound_key_1"),
  person_id_2: $record.get("compound_key_2")
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
const person_friends_getSelectPlanFromParentAndArgs = ($in, args, _info) => {
  const details = pgFunctionArgumentsFromArgs($in, makeArgs_person_computed_out(args));
  return resource_person_friendsPgResource.execute(details.selectArgs);
};
const resource_person_type_function_connectionPgResource = registry.pgResources["person_type_function_connection"];
const person_type_function_connection_getSelectPlanFromParentAndArgs = ($in, args, _info) => {
  const details = pgFunctionArgumentsFromArgs($in, makeArgs_person_computed_out(args));
  return resource_person_type_function_connectionPgResource.execute(details.selectArgs);
};
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
const resource_post_computed_interval_arrayPgResource = registry.pgResources["post_computed_interval_array"];
const resource_post_computed_interval_setPgResource = registry.pgResources["post_computed_interval_set"];
const post_computed_interval_set_getSelectPlanFromParentAndArgs = ($in, args, _info) => {
  const details = pgFunctionArgumentsFromArgs($in, makeArgs_person_computed_out(args));
  return resource_post_computed_interval_setPgResource.execute(details.selectArgs);
};
const resource_post_computed_text_arrayPgResource = registry.pgResources["post_computed_text_array"];
const argDetailsSimple_post_computed_with_optional_arg = [{
  graphqlArgName: "i",
  pgCodec: TYPES.int,
  postgresArgName: "i"
}];
const makeArgs_post_computed_with_optional_arg = (args, path = []) => argDetailsSimple_post_computed_with_optional_arg.map(details => makeArg(path, args, details));
const resource_post_computed_with_optional_argPgResource = registry.pgResources["post_computed_with_optional_arg"];
const argDetailsSimple_post_computed_with_required_arg = [{
  graphqlArgName: "i",
  pgCodec: TYPES.int,
  postgresArgName: "i",
  required: true
}];
const makeArgs_post_computed_with_required_arg = (args, path = []) => argDetailsSimple_post_computed_with_required_arg.map(details => makeArg(path, args, details));
const resource_post_computed_with_required_argPgResource = registry.pgResources["post_computed_with_required_arg"];
const argDetailsSimple_post_headline_trimmed = [{
  graphqlArgName: "length",
  pgCodec: TYPES.int,
  postgresArgName: "length"
}, {
  graphqlArgName: "omission",
  pgCodec: TYPES.text,
  postgresArgName: "omission"
}];
const makeArgs_post_headline_trimmed = (args, path = []) => argDetailsSimple_post_headline_trimmed.map(details => makeArg(path, args, details));
const resource_post_headline_trimmedPgResource = registry.pgResources["post_headline_trimmed"];
const argDetailsSimple_post_headline_trimmed_no_defaults = [{
  graphqlArgName: "length",
  pgCodec: TYPES.int,
  postgresArgName: "length",
  required: true
}, {
  graphqlArgName: "omission",
  pgCodec: TYPES.text,
  postgresArgName: "omission",
  required: true
}];
const makeArgs_post_headline_trimmed_no_defaults = (args, path = []) => argDetailsSimple_post_headline_trimmed_no_defaults.map(details => makeArg(path, args, details));
const resource_post_headline_trimmed_no_defaultsPgResource = registry.pgResources["post_headline_trimmed_no_defaults"];
const argDetailsSimple_post_headline_trimmed_strict = [{
  graphqlArgName: "length",
  pgCodec: TYPES.int,
  postgresArgName: "length"
}, {
  graphqlArgName: "omission",
  pgCodec: TYPES.text,
  postgresArgName: "omission"
}];
const makeArgs_post_headline_trimmed_strict = (args, path = []) => argDetailsSimple_post_headline_trimmed_strict.map(details => makeArg(path, args, details));
const resource_post_headline_trimmed_strictPgResource = registry.pgResources["post_headline_trimmed_strict"];
const argDetailsSimple_post_computed_compound_type_array = [{
  graphqlArgName: "object",
  pgCodec: compoundTypeCodec,
  postgresArgName: "object",
  required: true
}];
const makeArgs_post_computed_compound_type_array = (args, path = []) => argDetailsSimple_post_computed_compound_type_array.map(details => makeArg(path, args, details));
const resource_post_computed_compound_type_arrayPgResource = registry.pgResources["post_computed_compound_type_array"];
const resource_frmcdc_comptypePgResource = registry.pgResources["frmcdc_comptype"];
const totalCountConnectionPlan = $connection => $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
function CompoundTypeInput_aApply(obj, val, info) {
  obj.set("a", bakedInputRuntime(info.schema, info.field.type, val));
}
function CompoundTypeInput_bApply(obj, val, info) {
  obj.set("b", bakedInputRuntime(info.schema, info.field.type, val));
}
const DatetimeParseLiteral = ast => {
  if (ast.kind === Kind.STRING) {
    return ast.value;
  }
  throw new GraphQLError(`Datetime can only parse string values (kind='${ast.kind}')`);
};
const Type_enumArrayPlan = $record => {
  return $record.get("enum_array");
};
const resource_frmcdc_nestedCompoundTypePgResource = registry.pgResources["frmcdc_nestedCompoundType"];
const Type_byteaArrayPlan = $record => {
  return $record.get("bytea_array");
};
function LTreeParseValue(value) {
  return value;
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
const TypeCondition_idApply = ($condition, val) => applyAttributeCondition("id", TYPES.int, $condition, val);
const TypeCondition_enumArrayApply = ($condition, val) => applyAttributeCondition("enum_array", colorArrayCodec, $condition, val);
const TypesOrderBy_ID_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "id",
    direction: "ASC"
  });
  queryBuilder.setOrderIsUnique();
};
const TypesOrderBy_ID_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "id",
    direction: "DESC"
  });
  queryBuilder.setOrderIsUnique();
};
const applyOrderByCustomField = (pgFieldSource, ascDesc, queryBuilder) => {
  if (typeof pgFieldSource.from !== "function") {
    throw new Error("Invalid computed attribute 'from'");
  }
  const expression = sql`${pgFieldSource.from({
    placeholder: queryBuilder.alias
  })}`;
  queryBuilder.orderBy({
    codec: pgFieldSource.codec,
    fragment: expression,
    direction: ascDesc.toUpperCase()
  });
};
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
const ForeignKey_personIdPlan = $record => {
  return $record.get("person_id");
};
const ForeignKey_personByPersonIdPlan = $record => resource_personPgResource.get({
  id: $record.get("person_id")
});
const ForeignKeyCondition_personIdApply = ($condition, val) => applyAttributeCondition("person_id", TYPES.int, $condition, val);
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
const TestviewCondition_col1Apply = ($condition, val) => applyAttributeCondition("col1", TYPES.int, $condition, val);
const TestviewCondition_col2Apply = ($condition, val) => applyAttributeCondition("col2", TYPES.int, $condition, val);
const TestviewsOrderBy_COL1_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "col1",
    direction: "ASC"
  });
};
const TestviewsOrderBy_COL1_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "col1",
    direction: "DESC"
  });
};
const TestviewsOrderBy_COL2_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "col2",
    direction: "ASC"
  });
};
const TestviewsOrderBy_COL2_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "col2",
    direction: "DESC"
  });
};
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
const SimilarTable1Condition_col3Apply = ($condition, val) => applyAttributeCondition("col3", TYPES.int, $condition, val);
const SimilarTable1SOrderBy_COL3_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "col3",
    direction: "ASC"
  });
};
const SimilarTable1SOrderBy_COL3_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "col3",
    direction: "DESC"
  });
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
const resource_return_void_mutationPgResource = registry.pgResources["return_void_mutation"];
const resource_mutation_interval_arrayPgResource = registry.pgResources["mutation_interval_array"];
const resource_mutation_interval_setPgResource = registry.pgResources["mutation_interval_set"];
const resource_mutation_text_arrayPgResource = registry.pgResources["mutation_text_array"];
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
const argDetailsSimple_add_1_mutation = [{
  graphqlArgName: "arg0",
  pgCodec: TYPES.int,
  required: true
}, {
  graphqlArgName: "arg1",
  pgCodec: TYPES.int,
  required: true
}];
const makeArgs_add_1_mutation = (args, path = []) => argDetailsSimple_add_1_mutation.map(details => makeArg(path, args, details));
const resource_add_1_mutationPgResource = registry.pgResources["add_1_mutation"];
const argDetailsSimple_add_2_mutation = [{
  graphqlArgName: "a",
  pgCodec: TYPES.int,
  postgresArgName: "a",
  required: true
}, {
  graphqlArgName: "b",
  pgCodec: TYPES.int,
  postgresArgName: "b"
}];
const makeArgs_add_2_mutation = (args, path = []) => argDetailsSimple_add_2_mutation.map(details => makeArg(path, args, details));
const resource_add_2_mutationPgResource = registry.pgResources["add_2_mutation"];
const argDetailsSimple_add_3_mutation = [{
  graphqlArgName: "a",
  pgCodec: TYPES.int,
  postgresArgName: "a",
  required: true
}, {
  graphqlArgName: "arg1",
  pgCodec: TYPES.int,
  required: true
}];
const makeArgs_add_3_mutation = (args, path = []) => argDetailsSimple_add_3_mutation.map(details => makeArg(path, args, details));
const resource_add_3_mutationPgResource = registry.pgResources["add_3_mutation"];
const argDetailsSimple_add_4_mutation = [{
  graphqlArgName: "arg0",
  pgCodec: TYPES.int,
  required: true
}, {
  graphqlArgName: "b",
  pgCodec: TYPES.int,
  postgresArgName: "b"
}];
const makeArgs_add_4_mutation = (args, path = []) => argDetailsSimple_add_4_mutation.map(details => makeArg(path, args, details));
const resource_add_4_mutationPgResource = registry.pgResources["add_4_mutation"];
const argDetailsSimple_add_4_mutation_error = [{
  graphqlArgName: "arg0",
  pgCodec: TYPES.int,
  required: true
}, {
  graphqlArgName: "b",
  pgCodec: TYPES.int,
  postgresArgName: "b"
}];
const makeArgs_add_4_mutation_error = (args, path = []) => argDetailsSimple_add_4_mutation_error.map(details => makeArg(path, args, details));
const resource_add_4_mutation_errorPgResource = registry.pgResources["add_4_mutation_error"];
const argDetailsSimple_mult_1 = [{
  graphqlArgName: "arg0",
  pgCodec: TYPES.int,
  required: true
}, {
  graphqlArgName: "arg1",
  pgCodec: TYPES.int,
  required: true
}];
const makeArgs_mult_1 = (args, path = []) => argDetailsSimple_mult_1.map(details => makeArg(path, args, details));
const resource_mult_1PgResource = registry.pgResources["mult_1"];
const argDetailsSimple_mult_2 = [{
  graphqlArgName: "arg0",
  pgCodec: TYPES.int,
  required: true
}, {
  graphqlArgName: "arg1",
  pgCodec: TYPES.int,
  required: true
}];
const makeArgs_mult_2 = (args, path = []) => argDetailsSimple_mult_2.map(details => makeArg(path, args, details));
const resource_mult_2PgResource = registry.pgResources["mult_2"];
const argDetailsSimple_mult_3 = [{
  graphqlArgName: "arg0",
  pgCodec: TYPES.int,
  required: true
}, {
  graphqlArgName: "arg1",
  pgCodec: TYPES.int,
  required: true
}];
const makeArgs_mult_3 = (args, path = []) => argDetailsSimple_mult_3.map(details => makeArg(path, args, details));
const resource_mult_3PgResource = registry.pgResources["mult_3"];
const argDetailsSimple_mult_4 = [{
  graphqlArgName: "arg0",
  pgCodec: TYPES.int,
  required: true
}, {
  graphqlArgName: "arg1",
  pgCodec: TYPES.int,
  required: true
}];
const makeArgs_mult_4 = (args, path = []) => argDetailsSimple_mult_4.map(details => makeArg(path, args, details));
const resource_mult_4PgResource = registry.pgResources["mult_4"];
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
const argDetailsSimple_list_bde_mutation = [{
  graphqlArgName: "b",
  pgCodec: LIST_TYPES.text,
  postgresArgName: "b",
  required: true
}, {
  graphqlArgName: "d",
  pgCodec: TYPES.text,
  postgresArgName: "d",
  required: true
}, {
  graphqlArgName: "e",
  pgCodec: TYPES.text,
  postgresArgName: "e",
  required: true
}];
const makeArgs_list_bde_mutation = (args, path = []) => argDetailsSimple_list_bde_mutation.map(details => makeArg(path, args, details));
const resource_list_bde_mutationPgResource = registry.pgResources["list_bde_mutation"];
const argDetailsSimple_guid_fn = [{
  graphqlArgName: "g",
  pgCodec: guidCodec,
  postgresArgName: "g",
  required: true
}];
const makeArgs_guid_fn = (args, path = []) => argDetailsSimple_guid_fn.map(details => makeArg(path, args, details));
const resource_guid_fnPgResource = registry.pgResources["guid_fn"];
const resource_authenticate_failPgResource = registry.pgResources["authenticate_fail"];
const argDetailsSimple_authenticate = [{
  graphqlArgName: "a",
  pgCodec: TYPES.int,
  postgresArgName: "a",
  required: true
}, {
  graphqlArgName: "b",
  pgCodec: TYPES.numeric,
  postgresArgName: "b",
  required: true
}, {
  graphqlArgName: "c",
  pgCodec: TYPES.bigint,
  postgresArgName: "c",
  required: true
}];
const makeArgs_authenticate = (args, path = []) => argDetailsSimple_authenticate.map(details => makeArg(path, args, details));
const resource_authenticatePgResource = registry.pgResources["authenticate"];
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
const argDetailsSimple_left_arm_identity = [{
  graphqlArgName: "leftArm",
  pgCodec: leftArmCodec,
  postgresArgName: "left_arm",
  required: true
}];
const makeArgs_left_arm_identity = (args, path = []) => argDetailsSimple_left_arm_identity.map(details => makeArg(path, args, details));
const resource_left_arm_identityPgResource = registry.pgResources["left_arm_identity"];
const resource_issue756_mutationPgResource = registry.pgResources["issue756_mutation"];
const resource_issue756_set_mutationPgResource = registry.pgResources["issue756_set_mutation"];
const argDetailsSimple_authenticate_many = [{
  graphqlArgName: "a",
  pgCodec: TYPES.int,
  postgresArgName: "a",
  required: true
}, {
  graphqlArgName: "b",
  pgCodec: TYPES.numeric,
  postgresArgName: "b",
  required: true
}, {
  graphqlArgName: "c",
  pgCodec: TYPES.bigint,
  postgresArgName: "c",
  required: true
}];
const makeArgs_authenticate_many = (args, path = []) => argDetailsSimple_authenticate_many.map(details => makeArg(path, args, details));
const resource_authenticate_manyPgResource = registry.pgResources["authenticate_many"];
const argDetailsSimple_authenticate_payload = [{
  graphqlArgName: "a",
  pgCodec: TYPES.int,
  postgresArgName: "a",
  required: true
}, {
  graphqlArgName: "b",
  pgCodec: TYPES.numeric,
  postgresArgName: "b",
  required: true
}, {
  graphqlArgName: "c",
  pgCodec: TYPES.bigint,
  postgresArgName: "c",
  required: true
}];
const makeArgs_authenticate_payload = (args, path = []) => argDetailsSimple_authenticate_payload.map(details => makeArg(path, args, details));
const resource_authenticate_payloadPgResource = registry.pgResources["authenticate_payload"];
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
const argDetailsSimple_post_with_suffix = [{
  graphqlArgName: "post",
  pgCodec: postCodec,
  postgresArgName: "post",
  required: true
}, {
  graphqlArgName: "suffix",
  pgCodec: TYPES.text,
  postgresArgName: "suffix",
  required: true
}];
const makeArgs_post_with_suffix = (args, path = []) => argDetailsSimple_post_with_suffix.map(details => makeArg(path, args, details));
const resource_post_with_suffixPgResource = registry.pgResources["post_with_suffix"];
const argDetailsSimple_compound_type_mutation = [{
  graphqlArgName: "object",
  pgCodec: compoundTypeCodec,
  postgresArgName: "object",
  required: true
}];
const makeArgs_compound_type_mutation = (args, path = []) => argDetailsSimple_compound_type_mutation.map(details => makeArg(path, args, details));
const resource_compound_type_mutationPgResource = registry.pgResources["compound_type_mutation"];
const argDetailsSimple_compound_type_set_mutation = [{
  graphqlArgName: "object",
  pgCodec: compoundTypeCodec,
  postgresArgName: "object",
  required: true
}];
const makeArgs_compound_type_set_mutation = (args, path = []) => argDetailsSimple_compound_type_set_mutation.map(details => makeArg(path, args, details));
const resource_compound_type_set_mutationPgResource = registry.pgResources["compound_type_set_mutation"];
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
const argDetailsSimple_mutation_compound_type_array = [{
  graphqlArgName: "object",
  pgCodec: compoundTypeCodec,
  postgresArgName: "object",
  required: true
}];
const makeArgs_mutation_compound_type_array = (args, path = []) => argDetailsSimple_mutation_compound_type_array.map(details => makeArg(path, args, details));
const resource_mutation_compound_type_arrayPgResource = registry.pgResources["mutation_compound_type_array"];
const argDetailsSimple_compound_type_array_mutation = [{
  graphqlArgName: "object",
  pgCodec: compoundTypeCodec,
  postgresArgName: "object",
  required: true
}];
const makeArgs_compound_type_array_mutation = (args, path = []) => argDetailsSimple_compound_type_array_mutation.map(details => makeArg(path, args, details));
const resource_compound_type_array_mutationPgResource = registry.pgResources["compound_type_array_mutation"];
const argDetailsSimple_post_many = [{
  graphqlArgName: "posts",
  pgCodec: postArrayCodec,
  postgresArgName: "posts",
  required: true
}];
const makeArgs_post_many = (args, path = []) => argDetailsSimple_post_many.map(details => makeArg(path, args, details));
const resource_post_manyPgResource = registry.pgResources["post_many"];
const resource_mutation_out_tablePgResource = registry.pgResources["mutation_out_table"];
const resource_mutation_out_table_setofPgResource = registry.pgResources["mutation_out_table_setof"];
const resource_table_set_mutationPgResource = registry.pgResources["table_set_mutation"];
const resource_type_function_connection_mutationPgResource = registry.pgResources["type_function_connection_mutation"];
const argDetailsSimple_type_function_mutation = [{
  graphqlArgName: "id",
  pgCodec: TYPES.int,
  postgresArgName: "id",
  required: true
}];
const makeArgs_type_function_mutation = (args, path = []) => argDetailsSimple_type_function_mutation.map(details => makeArg(path, args, details));
const resource_type_function_mutationPgResource = registry.pgResources["type_function_mutation"];
const resource_type_function_list_mutationPgResource = registry.pgResources["type_function_list_mutation"];
function applyInputToInsert(_, $object) {
  return $object;
}
const specFromArgs_Input = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Input, $nodeId);
};
function applyInputToUpdateOrDelete(_, $object) {
  return $object;
}
const specFromArgs_Patch = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Patch, $nodeId);
};
const specFromArgs_Reserved = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Reserved, $nodeId);
};
const specFromArgs_ReservedPatchRecord = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_ReservedPatchRecord, $nodeId);
};
const specFromArgs_ReservedInputRecord = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_ReservedInputRecord, $nodeId);
};
const specFromArgs_DefaultValue = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_DefaultValue, $nodeId);
};
const specFromArgs_MyTable = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_MyTable, $nodeId);
};
const specFromArgs_PersonSecret = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_PersonSecret, $nodeId);
};
const specFromArgs_ViewTable = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_ViewTable, $nodeId);
};
const specFromArgs_CompoundKey = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_CompoundKey, $nodeId);
};
const specFromArgs_SimilarTable1 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_SimilarTable1, $nodeId);
};
const specFromArgs_SimilarTable2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_SimilarTable2, $nodeId);
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
const specFromArgs_Post = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Post, $nodeId);
};
const specFromArgs_Person = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Person, $nodeId);
};
const specFromArgs_List = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_List, $nodeId);
};
const specFromArgs_Type = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Type, $nodeId);
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
const LeftArmIdentityPayload_leftArmEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_left_armPgResource, left_armUniques[0].attributes, $mutation, fieldArgs);
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
const Issue756MutationPayload_issue756EdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_issue756PgResource, issue756Uniques[0].attributes, $mutation, fieldArgs);
const resource_frmcdc_jwtTokenPgResource = registry.pgResources["frmcdc_jwtToken"];
const TableMutationPayload_postEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_postPgResource, postUniques[0].attributes, $mutation, fieldArgs);
const TableMutationPayload_personByAuthorIdPlan = $record => resource_personPgResource.get({
  id: $record.get("result").get("author_id")
});
function PostInput_headlineApply(obj, val, info) {
  obj.set("headline", bakedInputRuntime(info.schema, info.field.type, val));
}
function PostInput_bodyApply(obj, val, info) {
  obj.set("body", bakedInputRuntime(info.schema, info.field.type, val));
}
function PostInput_authorIdApply(obj, val, info) {
  obj.set("author_id", bakedInputRuntime(info.schema, info.field.type, val));
}
function PostInput_enumsApply(obj, val, info) {
  obj.set("enums", bakedInputRuntime(info.schema, info.field.type, val));
}
function PostInput_comptypesApply(obj, val, info) {
  obj.set("comptypes", bakedInputRuntime(info.schema, info.field.type, val));
}
const MutationOutTablePayload_personEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_personPgResource, personUniques[0].attributes, $mutation, fieldArgs);
const TypeFunctionMutationPayload_typeEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_typesPgResource, typesUniques[0].attributes, $mutation, fieldArgs);
const TypeFunctionMutationPayload_postBySmallintPlan = $record => resource_postPgResource.get({
  id: $record.get("result").get("smallint")
});
const TypeFunctionMutationPayload_postByIdPlan = $record => resource_postPgResource.get({
  id: $record.get("result").get("id")
});
function getClientMutationIdForCreatePlan($mutation) {
  const $insert = $mutation.getStepForKey("result");
  return $insert.getMeta("clientMutationId");
}
function planCreatePayloadResult($object) {
  return $object.get("result");
}
const CreateInputPayload_inputEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_inputsPgResource, inputsUniques[0].attributes, $mutation, fieldArgs);
function applyCreateFields(qb, arg) {
  if (arg != null) {
    return qb.setBuilder();
  }
}
const CreatePatchPayload_patchEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_patchsPgResource, patchsUniques[0].attributes, $mutation, fieldArgs);
const CreateReservedPayload_reservedEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_reservedPgResource, reservedUniques[0].attributes, $mutation, fieldArgs);
const CreateReservedPatchRecordPayload_reservedPatchRecordEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_reservedPatchsPgResource, reservedPatchsUniques[0].attributes, $mutation, fieldArgs);
const CreateReservedInputRecordPayload_reservedInputRecordEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_reserved_inputPgResource, reserved_inputUniques[0].attributes, $mutation, fieldArgs);
const CreateDefaultValuePayload_defaultValueEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_default_valuePgResource, default_valueUniques[0].attributes, $mutation, fieldArgs);
function DefaultValueInput_nullValueApply(obj, val, info) {
  obj.set("null_value", bakedInputRuntime(info.schema, info.field.type, val));
}
function NoPrimaryKeyInput_strApply(obj, val, info) {
  obj.set("str", bakedInputRuntime(info.schema, info.field.type, val));
}
function TestviewInput_col1Apply(obj, val, info) {
  obj.set("col1", bakedInputRuntime(info.schema, info.field.type, val));
}
function TestviewInput_col2Apply(obj, val, info) {
  obj.set("col2", bakedInputRuntime(info.schema, info.field.type, val));
}
const CreateMyTablePayload_myTableEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_my_tablePgResource, my_tableUniques[0].attributes, $mutation, fieldArgs);
function MyTableInput_jsonDataApply(obj, val, info) {
  obj.set("json_data", bakedInputRuntime(info.schema, info.field.type, val));
}
const CreatePersonSecretPayload_personSecretEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_person_secretPgResource, person_secretUniques[0].attributes, $mutation, fieldArgs);
function PersonSecretInput_secretApply(obj, val, info) {
  obj.set("sekrit", bakedInputRuntime(info.schema, info.field.type, val));
}
const CreateViewTablePayload_viewTableEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_view_tablePgResource, view_tableUniques[0].attributes, $mutation, fieldArgs);
const CreateCompoundKeyPayload_compoundKeyEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_compound_keyPgResource, compound_keyUniques[0].attributes, $mutation, fieldArgs);
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
const CreateSimilarTable1Payload_similarTable1EdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_similar_table_1PgResource, similar_table_1Uniques[0].attributes, $mutation, fieldArgs);
function SimilarTable1Input_col3Apply(obj, val, info) {
  obj.set("col3", bakedInputRuntime(info.schema, info.field.type, val));
}
const CreateSimilarTable2Payload_similarTable2EdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_similar_table_2PgResource, similar_table_2Uniques[0].attributes, $mutation, fieldArgs);
function SimilarTable2Input_col4Apply(obj, val, info) {
  obj.set("col4", bakedInputRuntime(info.schema, info.field.type, val));
}
function SimilarTable2Input_col5Apply(obj, val, info) {
  obj.set("col5", bakedInputRuntime(info.schema, info.field.type, val));
}
const CreateNullTestRecordPayload_nullTestRecordEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_null_test_recordPgResource, null_test_recordUniques[0].attributes, $mutation, fieldArgs);
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
const CreateListPayload_listEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_listsPgResource, listsUniques[0].attributes, $mutation, fieldArgs);
function ListInput_intArrayApply(obj, val, info) {
  obj.set("int_array", bakedInputRuntime(info.schema, info.field.type, val));
}
function ListInput_intArrayNnApply(obj, val, info) {
  obj.set("int_array_nn", bakedInputRuntime(info.schema, info.field.type, val));
}
function ListInput_enumArrayApply(obj, val, info) {
  obj.set("enum_array", bakedInputRuntime(info.schema, info.field.type, val));
}
function ListInput_enumArrayNnApply(obj, val, info) {
  obj.set("enum_array_nn", bakedInputRuntime(info.schema, info.field.type, val));
}
function ListInput_dateArrayApply(obj, val, info) {
  obj.set("date_array", bakedInputRuntime(info.schema, info.field.type, val));
}
function ListInput_dateArrayNnApply(obj, val, info) {
  obj.set("date_array_nn", bakedInputRuntime(info.schema, info.field.type, val));
}
function ListInput_timestamptzArrayApply(obj, val, info) {
  obj.set("timestamptz_array", bakedInputRuntime(info.schema, info.field.type, val));
}
function ListInput_timestamptzArrayNnApply(obj, val, info) {
  obj.set("timestamptz_array_nn", bakedInputRuntime(info.schema, info.field.type, val));
}
function ListInput_compoundTypeArrayApply(obj, val, info) {
  obj.set("compound_type_array", bakedInputRuntime(info.schema, info.field.type, val));
}
function ListInput_compoundTypeArrayNnApply(obj, val, info) {
  obj.set("compound_type_array_nn", bakedInputRuntime(info.schema, info.field.type, val));
}
function ListInput_byteaArrayApply(obj, val, info) {
  obj.set("bytea_array", bakedInputRuntime(info.schema, info.field.type, val));
}
function ListInput_byteaArrayNnApply(obj, val, info) {
  obj.set("bytea_array_nn", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_smallintApply(obj, val, info) {
  obj.set("smallint", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_bigintApply(obj, val, info) {
  obj.set("bigint", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_numericApply(obj, val, info) {
  obj.set("numeric", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_decimalApply(obj, val, info) {
  obj.set("decimal", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_booleanApply(obj, val, info) {
  obj.set("boolean", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_varcharApply(obj, val, info) {
  obj.set("varchar", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_enumApply(obj, val, info) {
  obj.set("enum", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_domainApply(obj, val, info) {
  obj.set("domain", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_domain2Apply(obj, val, info) {
  obj.set("domain2", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_textArrayApply(obj, val, info) {
  obj.set("text_array", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_jsonApply(obj, val, info) {
  obj.set("json", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_jsonbApply(obj, val, info) {
  obj.set("jsonb", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_jsonpathApply(obj, val, info) {
  obj.set("jsonpath", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_nullableRangeApply(obj, val, info) {
  obj.set("nullable_range", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_numrangeApply(obj, val, info) {
  obj.set("numrange", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_daterangeApply(obj, val, info) {
  obj.set("daterange", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_anIntRangeApply(obj, val, info) {
  obj.set("an_int_range", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_timestampApply(obj, val, info) {
  obj.set("timestamp", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_timestamptzApply(obj, val, info) {
  obj.set("timestamptz", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_dateApply(obj, val, info) {
  obj.set("date", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_timeApply(obj, val, info) {
  obj.set("time", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_timetzApply(obj, val, info) {
  obj.set("timetz", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_intervalApply(obj, val, info) {
  obj.set("interval", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_intervalArrayApply(obj, val, info) {
  obj.set("interval_array", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_moneyApply(obj, val, info) {
  obj.set("money", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_compoundTypeApply(obj, val, info) {
  obj.set("compound_type", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_nestedCompoundTypeApply(obj, val, info) {
  obj.set("nested_compound_type", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_nullableCompoundTypeApply(obj, val, info) {
  obj.set("nullable_compound_type", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_nullableNestedCompoundTypeApply(obj, val, info) {
  obj.set("nullable_nested_compound_type", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_pointApply(obj, val, info) {
  obj.set("point", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_nullablePointApply(obj, val, info) {
  obj.set("nullablePoint", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_inetApply(obj, val, info) {
  obj.set("inet", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_cidrApply(obj, val, info) {
  obj.set("cidr", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_macaddrApply(obj, val, info) {
  obj.set("macaddr", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_regprocApply(obj, val, info) {
  obj.set("regproc", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_regprocedureApply(obj, val, info) {
  obj.set("regprocedure", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_regoperApply(obj, val, info) {
  obj.set("regoper", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_regoperatorApply(obj, val, info) {
  obj.set("regoperator", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_regclassApply(obj, val, info) {
  obj.set("regclass", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_regtypeApply(obj, val, info) {
  obj.set("regtype", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_regconfigApply(obj, val, info) {
  obj.set("regconfig", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_regdictionaryApply(obj, val, info) {
  obj.set("regdictionary", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_textArrayDomainApply(obj, val, info) {
  obj.set("text_array_domain", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_int8ArrayDomainApply(obj, val, info) {
  obj.set("int8_array_domain", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_byteaApply(obj, val, info) {
  obj.set("bytea", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_ltreeApply(obj, val, info) {
  obj.set("ltree", bakedInputRuntime(info.schema, info.field.type, val));
}
function TypeInput_ltreeArrayApply(obj, val, info) {
  obj.set("ltree_array", bakedInputRuntime(info.schema, info.field.type, val));
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

  """Get a single \`Input\`."""
  inputById(id: Int!): Input

  """Get a single \`Patch\`."""
  patchById(id: Int!): Patch

  """Get a single \`Reserved\`."""
  reservedById(id: Int!): Reserved

  """Get a single \`ReservedPatchRecord\`."""
  reservedPatchRecordById(id: Int!): ReservedPatchRecord

  """Get a single \`ReservedInputRecord\`."""
  reservedInputRecordById(id: Int!): ReservedInputRecord

  """Get a single \`DefaultValue\`."""
  defaultValueById(id: Int!): DefaultValue

  """Get a single \`NoPrimaryKey\`."""
  noPrimaryKeyById(id: Int!): NoPrimaryKey

  """Get a single \`UniqueForeignKey\`."""
  uniqueForeignKeyByCompoundKey1AndCompoundKey2(compoundKey1: Int!, compoundKey2: Int!): UniqueForeignKey

  """Get a single \`MyTable\`."""
  myTableById(id: Int!): MyTable

  """Get a single \`PersonSecret\`."""
  personSecretByPersonId(personId: Int!): PersonSecret @deprecated(reason: "This is deprecated (comment on table c.person_secret).")

  """Get a single \`ViewTable\`."""
  viewTableById(id: Int!): ViewTable

  """Get a single \`CompoundKey\`."""
  compoundKeyByPersonId1AndPersonId2(personId1: Int!, personId2: Int!): CompoundKey

  """Get a single \`SimilarTable1\`."""
  similarTable1ById(id: Int!): SimilarTable1

  """Get a single \`SimilarTable2\`."""
  similarTable2ById(id: Int!): SimilarTable2

  """Get a single \`NullTestRecord\`."""
  nullTestRecordById(id: Int!): NullTestRecord

  """Get a single \`LeftArm\`."""
  leftArmById(id: Int!): LeftArm

  """Get a single \`LeftArm\`."""
  leftArmByPersonId(personId: Int!): LeftArm

  """Get a single \`Issue756\`."""
  issue756ById(id: Int!): Issue756

  """Get a single \`Post\`."""
  postById(id: Int!): Post

  """Get a single \`Person\`."""
  personById(id: Int!): Person

  """Get a single \`Person\`."""
  personByEmail(email: Email!): Person

  """Get a single \`List\`."""
  listById(id: Int!): List

  """Get a single \`Type\`."""
  typeById(id: Int!): Type
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
  queryIntervalArray: [Interval]

  """Reads and enables pagination through a set of \`Interval\`."""
  queryIntervalSet(
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
  ): QueryIntervalSetConnection
  queryTextArray: [String]

  """Reads and enables pagination through a set of \`Int8\`."""
  staticBigInteger(
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
  ): StaticBigIntegerConnection
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

  """lol, add some stuff 1 query"""
  add1Query(arg0: Int!, arg1: Int!): Int

  """lol, add some stuff 2 query"""
  add2Query(a: Int!, b: Int): Int

  """lol, add some stuff 3 query"""
  add3Query(a: Int, arg1: Int): Int

  """lol, add some stuff 4 query"""
  add4Query(arg0: Int, b: Int): Int
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
  searchTestSummariesList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int
  ): [SearchTestSummariesRecord]
  optionalMissingMiddle1(arg0: Int!, b: Int, c: Int): Int
  optionalMissingMiddle2(a: Int!, b: Int, c: Int): Int
  optionalMissingMiddle3(a: Int!, arg1: Int, c: Int): Int
  optionalMissingMiddle4(arg0: Int!, b: Int, arg2: Int): Int
  optionalMissingMiddle5(a: Int!, arg1: Int, arg2: Int): Int
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
  returnTableWithoutGrants: CompoundKey
  typesQuery(a: BigInt!, b: Boolean!, c: String!, d: [Int]!, e: JSON!, f: FloatRangeInput!): Boolean
  queryOutputTwoRows(leftArmId: Int, postId: Int, txt: String): QueryOutputTwoRowsRecord
  funcOutOutCompoundType(i1: Int): FuncOutOutCompoundTypeRecord
  tableQuery(id: Int): Post

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
  compoundTypeQuery(object: CompoundTypeInput): CompoundType
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
  queryCompoundTypeArray(object: CompoundTypeInput): [CompoundType]
  compoundTypeArrayQuery(object: CompoundTypeInput): [CompoundType]

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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: PersonCondition

    """The method to use when ordering \`Person\`."""
    orderBy: [PeopleOrderBy!]
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
  ): TypesConnection
  typeFunction(id: Int): Type
  typeFunctionList: [Type]

  """Reads a single \`Input\` using its globally unique \`ID\`."""
  input(
    """The globally unique \`ID\` to be used in selecting a single \`Input\`."""
    nodeId: ID!
  ): Input

  """Reads a single \`Patch\` using its globally unique \`ID\`."""
  patch(
    """The globally unique \`ID\` to be used in selecting a single \`Patch\`."""
    nodeId: ID!
  ): Patch

  """Reads a single \`Reserved\` using its globally unique \`ID\`."""
  reserved(
    """The globally unique \`ID\` to be used in selecting a single \`Reserved\`."""
    nodeId: ID!
  ): Reserved

  """Reads a single \`ReservedPatchRecord\` using its globally unique \`ID\`."""
  reservedPatchRecord(
    """
    The globally unique \`ID\` to be used in selecting a single \`ReservedPatchRecord\`.
    """
    nodeId: ID!
  ): ReservedPatchRecord

  """Reads a single \`ReservedInputRecord\` using its globally unique \`ID\`."""
  reservedInputRecord(
    """
    The globally unique \`ID\` to be used in selecting a single \`ReservedInputRecord\`.
    """
    nodeId: ID!
  ): ReservedInputRecord

  """Reads a single \`DefaultValue\` using its globally unique \`ID\`."""
  defaultValue(
    """
    The globally unique \`ID\` to be used in selecting a single \`DefaultValue\`.
    """
    nodeId: ID!
  ): DefaultValue

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

  """Reads a single \`ViewTable\` using its globally unique \`ID\`."""
  viewTable(
    """The globally unique \`ID\` to be used in selecting a single \`ViewTable\`."""
    nodeId: ID!
  ): ViewTable

  """Reads a single \`CompoundKey\` using its globally unique \`ID\`."""
  compoundKey(
    """
    The globally unique \`ID\` to be used in selecting a single \`CompoundKey\`.
    """
    nodeId: ID!
  ): CompoundKey

  """Reads a single \`SimilarTable1\` using its globally unique \`ID\`."""
  similarTable1(
    """
    The globally unique \`ID\` to be used in selecting a single \`SimilarTable1\`.
    """
    nodeId: ID!
  ): SimilarTable1

  """Reads a single \`SimilarTable2\` using its globally unique \`ID\`."""
  similarTable2(
    """
    The globally unique \`ID\` to be used in selecting a single \`SimilarTable2\`.
    """
    nodeId: ID!
  ): SimilarTable2

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

  """Reads a single \`Post\` using its globally unique \`ID\`."""
  post(
    """The globally unique \`ID\` to be used in selecting a single \`Post\`."""
    nodeId: ID!
  ): Post

  """Reads a single \`Person\` using its globally unique \`ID\`."""
  person(
    """The globally unique \`ID\` to be used in selecting a single \`Person\`."""
    nodeId: ID!
  ): Person

  """Reads a single \`List\` using its globally unique \`ID\`."""
  list(
    """The globally unique \`ID\` to be used in selecting a single \`List\`."""
    nodeId: ID!
  ): List

  """Reads a single \`Type\` using its globally unique \`ID\`."""
  type(
    """The globally unique \`ID\` to be used in selecting a single \`Type\`."""
    nodeId: ID!
  ): Type

  """Reads and enables pagination through a set of \`NonUpdatableView\`."""
  allNonUpdatableViews(
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
    condition: NonUpdatableViewCondition

    """The method to use when ordering \`NonUpdatableView\`."""
    orderBy: [NonUpdatableViewsOrderBy!] = [NATURAL]
  ): NonUpdatableViewsConnection

  """Reads and enables pagination through a set of \`Input\`."""
  allInputs(
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
    condition: InputCondition

    """The method to use when ordering \`Input\`."""
    orderBy: [InputsOrderBy!] = [PRIMARY_KEY_ASC]
  ): InputsConnection

  """Reads and enables pagination through a set of \`Patch\`."""
  allPatches(
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
    condition: PatchCondition

    """The method to use when ordering \`Patch\`."""
    orderBy: [PatchesOrderBy!] = [PRIMARY_KEY_ASC]
  ): PatchesConnection

  """Reads and enables pagination through a set of \`Reserved\`."""
  allReserveds(
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
    condition: ReservedCondition

    """The method to use when ordering \`Reserved\`."""
    orderBy: [ReservedsOrderBy!] = [PRIMARY_KEY_ASC]
  ): ReservedsConnection

  """Reads and enables pagination through a set of \`ReservedPatchRecord\`."""
  allReservedPatchRecords(
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
    condition: ReservedPatchRecordCondition

    """The method to use when ordering \`ReservedPatchRecord\`."""
    orderBy: [ReservedPatchRecordsOrderBy!] = [PRIMARY_KEY_ASC]
  ): ReservedPatchRecordsConnection

  """Reads and enables pagination through a set of \`ReservedInputRecord\`."""
  allReservedInputRecords(
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
    condition: ReservedInputRecordCondition

    """The method to use when ordering \`ReservedInputRecord\`."""
    orderBy: [ReservedInputRecordsOrderBy!] = [PRIMARY_KEY_ASC]
  ): ReservedInputRecordsConnection

  """Reads and enables pagination through a set of \`DefaultValue\`."""
  allDefaultValues(
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
    condition: DefaultValueCondition

    """The method to use when ordering \`DefaultValue\`."""
    orderBy: [DefaultValuesOrderBy!] = [PRIMARY_KEY_ASC]
  ): DefaultValuesConnection

  """Reads and enables pagination through a set of \`ForeignKey\`."""
  allForeignKeys(
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
    condition: ForeignKeyCondition

    """The method to use when ordering \`ForeignKey\`."""
    orderBy: [ForeignKeysOrderBy!] = [NATURAL]
  ): ForeignKeysConnection

  """Reads and enables pagination through a set of \`NoPrimaryKey\`."""
  allNoPrimaryKeys(
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
    condition: NoPrimaryKeyCondition

    """The method to use when ordering \`NoPrimaryKey\`."""
    orderBy: [NoPrimaryKeysOrderBy!] = [NATURAL]
  ): NoPrimaryKeysConnection

  """Reads and enables pagination through a set of \`Testview\`."""
  allTestviews(
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
    condition: TestviewCondition

    """The method to use when ordering \`Testview\`."""
    orderBy: [TestviewsOrderBy!] = [NATURAL]
  ): TestviewsConnection

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

  """Reads and enables pagination through a set of \`ViewTable\`."""
  allViewTables(
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
    condition: ViewTableCondition

    """The method to use when ordering \`ViewTable\`."""
    orderBy: [ViewTablesOrderBy!] = [PRIMARY_KEY_ASC]
  ): ViewTablesConnection

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

  """Reads and enables pagination through a set of \`SimilarTable1\`."""
  allSimilarTable1S(
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
    condition: SimilarTable1Condition

    """The method to use when ordering \`SimilarTable1\`."""
    orderBy: [SimilarTable1SOrderBy!] = [PRIMARY_KEY_ASC]
  ): SimilarTable1SConnection

  """Reads and enables pagination through a set of \`SimilarTable2\`."""
  allSimilarTable2S(
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
    condition: SimilarTable2Condition

    """The method to use when ordering \`SimilarTable2\`."""
    orderBy: [SimilarTable2SOrderBy!] = [PRIMARY_KEY_ASC]
  ): SimilarTable2SConnection

  """Reads and enables pagination through a set of \`UpdatableView\`."""
  allUpdatableViews(
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
    condition: UpdatableViewCondition

    """The method to use when ordering \`UpdatableView\`."""
    orderBy: [UpdatableViewsOrderBy!] = [NATURAL]
  ): UpdatableViewsConnection

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

  """Reads and enables pagination through a set of \`Post\`."""
  allPosts(
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
    condition: PostCondition

    """The method to use when ordering \`Post\`."""
    orderBy: [PostsOrderBy!] = [PRIMARY_KEY_ASC]
  ): PostsConnection

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

  """Reads and enables pagination through a set of \`List\`."""
  allLists(
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
    condition: ListCondition

    """The method to use when ordering \`List\`."""
    orderBy: [ListsOrderBy!] = [PRIMARY_KEY_ASC]
  ): ListsConnection

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

"""Should output as Input"""
type Input implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
}

"""Should output as Patch"""
type Patch implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
}

type Reserved implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
}

"""
\`reservedPatchs\` table should get renamed to ReservedPatchRecord to prevent clashes with ReservedPatch from \`reserved\` table
"""
type ReservedPatchRecord implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
}

"""
\`reserved_input\` table should get renamed to ReservedInputRecord to prevent clashes with ReservedInput from \`reserved\` table
"""
type ReservedInputRecord implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
}

type DefaultValue implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  nullValue: String
}

type NoPrimaryKey {
  id: Int!
  str: String!
}

type UniqueForeignKey {
  compoundKey1: Int
  compoundKey2: Int

  """
  Reads a single \`CompoundKey\` that is related to this \`UniqueForeignKey\`.
  """
  compoundKeyByCompoundKey1AndCompoundKey2: CompoundKey
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

  """Reads and enables pagination through a set of \`ForeignKey\`."""
  foreignKeysByCompoundKey1AndCompoundKey2(
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
    condition: ForeignKeyCondition

    """The method to use when ordering \`ForeignKey\`."""
    orderBy: [ForeignKeysOrderBy!] = [NATURAL]
  ): ForeignKeysConnection!

  """
  Reads a single \`UniqueForeignKey\` that is related to this \`CompoundKey\`.
  """
  uniqueForeignKeyByCompoundKey1AndCompoundKey2: UniqueForeignKey
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

  """Reads and enables pagination through a set of \`Post\`."""
  postsByAuthorId(
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
    condition: PostCondition

    """The method to use when ordering \`Post\`."""
    orderBy: [PostsOrderBy!] = [PRIMARY_KEY_ASC]
  ): PostsConnection!

  """Reads and enables pagination through a set of \`ForeignKey\`."""
  foreignKeysByPersonId(
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
    condition: ForeignKeyCondition

    """The method to use when ordering \`ForeignKey\`."""
    orderBy: [ForeignKeysOrderBy!] = [NATURAL]
  ): ForeignKeysConnection!

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

type Post implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  computedIntervalArray: [Interval]

  """Reads and enables pagination through a set of \`Interval\`."""
  computedIntervalSet(
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
  ): PostComputedIntervalSetConnection!
  computedTextArray: [String]
  computedWithOptionalArg(i: Int): Int
  computedWithRequiredArg(i: Int!): Int
  headlineTrimmed(length: Int, omission: String): String
  headlineTrimmedNoDefaults(length: Int, omission: String): String
  headlineTrimmedStrict(length: Int, omission: String): String
  computedCompoundTypeArray(object: CompoundTypeInput): [CompoundType]
  id: Int!
  headline: String!
  body: String
  authorId: Int
  enums: [AnEnum]
  comptypes: [Comptype]

  """Reads a single \`Person\` that is related to this \`Post\`."""
  personByAuthorId: Person

  """Reads and enables pagination through a set of \`Type\`."""
  typesBySmallint(
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
  ): TypesConnection!

  """Reads a single \`Type\` that is related to this \`Post\`."""
  typeById: Type
}

"""A connection to a list of \`Interval\` values."""
type PostComputedIntervalSetConnection {
  """A list of \`Interval\` objects."""
  nodes: [Interval]!

  """
  A list of edges which contains the \`Interval\` and cursor to aid in pagination.
  """
  edges: [PostComputedIntervalSetEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Interval\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Interval\` edge in the connection."""
type PostComputedIntervalSetEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Interval\` at the end of the edge."""
  node: Interval
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

type Type implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
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

  """Reads a single \`Post\` that is related to this \`Type\`."""
  postBySmallint: Post

  """Reads a single \`Post\` that is related to this \`Type\`."""
  postById: Post
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

"""
A JavaScript object encoded in the JSON format as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).
"""
scalar JSON

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

  """Checks for equality with the object’s \`smallint\` field."""
  smallint: Int

  """Checks for equality with the object’s \`bigint\` field."""
  bigint: BigInt

  """Checks for equality with the object’s \`numeric\` field."""
  numeric: BigFloat

  """Checks for equality with the object’s \`decimal\` field."""
  decimal: BigFloat

  """Checks for equality with the object’s \`boolean\` field."""
  boolean: Boolean

  """Checks for equality with the object’s \`varchar\` field."""
  varchar: String

  """Checks for equality with the object’s \`enum\` field."""
  enum: Color

  """Checks for equality with the object’s \`enumArray\` field."""
  enumArray: [Color]

  """Checks for equality with the object’s \`domain\` field."""
  domain: AnInt

  """Checks for equality with the object’s \`domain2\` field."""
  domain2: AnotherInt

  """Checks for equality with the object’s \`textArray\` field."""
  textArray: [String]

  """Checks for equality with the object’s \`json\` field."""
  json: JSON

  """Checks for equality with the object’s \`jsonb\` field."""
  jsonb: JSON

  """Checks for equality with the object’s \`jsonpath\` field."""
  jsonpath: JSONPath

  """Checks for equality with the object’s \`nullableRange\` field."""
  nullableRange: BigFloatRangeInput

  """Checks for equality with the object’s \`numrange\` field."""
  numrange: BigFloatRangeInput

  """Checks for equality with the object’s \`daterange\` field."""
  daterange: DateRangeInput

  """Checks for equality with the object’s \`anIntRange\` field."""
  anIntRange: AnIntRangeInput

  """Checks for equality with the object’s \`timestamp\` field."""
  timestamp: Datetime

  """Checks for equality with the object’s \`timestamptz\` field."""
  timestamptz: Datetime

  """Checks for equality with the object’s \`date\` field."""
  date: Date

  """Checks for equality with the object’s \`time\` field."""
  time: Time

  """Checks for equality with the object’s \`timetz\` field."""
  timetz: Time

  """Checks for equality with the object’s \`interval\` field."""
  interval: IntervalInput

  """Checks for equality with the object’s \`intervalArray\` field."""
  intervalArray: [IntervalInput]

  """Checks for equality with the object’s \`money\` field."""
  money: Float

  """Checks for equality with the object’s \`compoundType\` field."""
  compoundType: CompoundTypeInput

  """Checks for equality with the object’s \`nestedCompoundType\` field."""
  nestedCompoundType: NestedCompoundTypeInput

  """Checks for equality with the object’s \`nullableCompoundType\` field."""
  nullableCompoundType: CompoundTypeInput

  """
  Checks for equality with the object’s \`nullableNestedCompoundType\` field.
  """
  nullableNestedCompoundType: NestedCompoundTypeInput

  """Checks for equality with the object’s \`point\` field."""
  point: PointInput

  """Checks for equality with the object’s \`nullablePoint\` field."""
  nullablePoint: PointInput

  """Checks for equality with the object’s \`inet\` field."""
  inet: InternetAddress

  """Checks for equality with the object’s \`cidr\` field."""
  cidr: String

  """Checks for equality with the object’s \`macaddr\` field."""
  macaddr: String

  """Checks for equality with the object’s \`regproc\` field."""
  regproc: RegProc

  """Checks for equality with the object’s \`regprocedure\` field."""
  regprocedure: RegProcedure

  """Checks for equality with the object’s \`regoper\` field."""
  regoper: RegOper

  """Checks for equality with the object’s \`regoperator\` field."""
  regoperator: RegOperator

  """Checks for equality with the object’s \`regclass\` field."""
  regclass: RegClass

  """Checks for equality with the object’s \`regtype\` field."""
  regtype: RegType

  """Checks for equality with the object’s \`regconfig\` field."""
  regconfig: RegConfig

  """Checks for equality with the object’s \`regdictionary\` field."""
  regdictionary: RegDictionary

  """Checks for equality with the object’s \`textArrayDomain\` field."""
  textArrayDomain: [String]

  """Checks for equality with the object’s \`int8ArrayDomain\` field."""
  int8ArrayDomain: [BigInt]

  """Checks for equality with the object’s \`ltree\` field."""
  ltree: LTree

  """Checks for equality with the object’s \`ltreeArray\` field."""
  ltreeArray: [LTree]
}

"""A range of \`BigFloat\`."""
input BigFloatRangeInput {
  """The starting bound of our range."""
  start: BigFloatRangeBoundInput

  """The ending bound of our range."""
  end: BigFloatRangeBoundInput
}

"""
The value at one end of a range. A range can either include this value, or not.
"""
input BigFloatRangeBoundInput {
  """The value at one end of our range."""
  value: BigFloat!

  """Whether or not the value of this bound is included in the range."""
  inclusive: Boolean!
}

"""A range of \`Date\`."""
input DateRangeInput {
  """The starting bound of our range."""
  start: DateRangeBoundInput

  """The ending bound of our range."""
  end: DateRangeBoundInput
}

"""
The value at one end of a range. A range can either include this value, or not.
"""
input DateRangeBoundInput {
  """The value at one end of our range."""
  value: Date!

  """Whether or not the value of this bound is included in the range."""
  inclusive: Boolean!
}

"""A range of \`AnInt\`."""
input AnIntRangeInput {
  """The starting bound of our range."""
  start: AnIntRangeBoundInput

  """The ending bound of our range."""
  end: AnIntRangeBoundInput
}

"""
The value at one end of a range. A range can either include this value, or not.
"""
input AnIntRangeBoundInput {
  """The value at one end of our range."""
  value: AnInt!

  """Whether or not the value of this bound is included in the range."""
  inclusive: Boolean!
}

"""An input for mutations affecting \`NestedCompoundType\`"""
input NestedCompoundTypeInput {
  a: CompoundTypeInput
  b: CompoundTypeInput
  bazBuz: Int
}

"""A cartesian point."""
input PointInput {
  x: Float!
  y: Float!
}

"""Methods to use when ordering \`Type\`."""
enum TypesOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  SMALLINT_ASC
  SMALLINT_DESC
  BIGINT_ASC
  BIGINT_DESC
  NUMERIC_ASC
  NUMERIC_DESC
  DECIMAL_ASC
  DECIMAL_DESC
  BOOLEAN_ASC
  BOOLEAN_DESC
  VARCHAR_ASC
  VARCHAR_DESC
  ENUM_ASC
  ENUM_DESC
  DOMAIN_ASC
  DOMAIN_DESC
  DOMAIN2_ASC
  DOMAIN2_DESC
  JSON_ASC
  JSON_DESC
  JSONB_ASC
  JSONB_DESC
  JSONPATH_ASC
  JSONPATH_DESC
  TIMESTAMP_ASC
  TIMESTAMP_DESC
  TIMESTAMPTZ_ASC
  TIMESTAMPTZ_DESC
  DATE_ASC
  DATE_DESC
  TIME_ASC
  TIME_DESC
  TIMETZ_ASC
  TIMETZ_DESC
  INTERVAL_ASC
  INTERVAL_DESC
  MONEY_ASC
  MONEY_DESC
  COMPOUND_TYPE_ASC
  COMPOUND_TYPE_DESC
  NESTED_COMPOUND_TYPE_ASC
  NESTED_COMPOUND_TYPE_DESC
  NULLABLE_COMPOUND_TYPE_ASC
  NULLABLE_COMPOUND_TYPE_DESC
  NULLABLE_NESTED_COMPOUND_TYPE_ASC
  NULLABLE_NESTED_COMPOUND_TYPE_DESC
  POINT_ASC
  POINT_DESC
  NULLABLE_POINT_ASC
  NULLABLE_POINT_DESC
  INET_ASC
  INET_DESC
  CIDR_ASC
  CIDR_DESC
  MACADDR_ASC
  MACADDR_DESC
  REGPROC_ASC
  REGPROC_DESC
  REGPROCEDURE_ASC
  REGPROCEDURE_DESC
  REGOPER_ASC
  REGOPER_DESC
  REGOPERATOR_ASC
  REGOPERATOR_DESC
  REGCLASS_ASC
  REGCLASS_DESC
  REGTYPE_ASC
  REGTYPE_DESC
  REGCONFIG_ASC
  REGCONFIG_DESC
  REGDICTIONARY_ASC
  REGDICTIONARY_DESC
  LTREE_ASC
  LTREE_DESC
}

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

type WrappedUrl {
  url: NotNullUrl!
}

scalar NotNullUrl

"""
A set of key/value pairs, keys are strings, values may be a string or null. Exposed as a JSON object.
"""
scalar KeyValueHash

"""A connection to a list of \`Post\` values."""
type PostsConnection {
  """A list of \`Post\` objects."""
  nodes: [Post]!

  """
  A list of edges which contains the \`Post\` and cursor to aid in pagination.
  """
  edges: [PostsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Post\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Post\` edge in the connection."""
type PostsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Post\` at the end of the edge."""
  node: Post
}

"""
A condition to be used against \`Post\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input PostCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`headline\` field."""
  headline: String

  """Checks for equality with the object’s \`body\` field."""
  body: String

  """Checks for equality with the object’s \`authorId\` field."""
  authorId: Int

  """Checks for equality with the object’s \`enums\` field."""
  enums: [AnEnum]

  """Checks for equality with the object’s \`comptypes\` field."""
  comptypes: [ComptypeInput]

  """Checks for equality with the object’s \`computedWithOptionalArg\` field."""
  computedWithOptionalArg: Int
}

"""An input for mutations affecting \`Comptype\`"""
input ComptypeInput {
  schedule: Datetime
  isOptimised: Boolean
}

"""Methods to use when ordering \`Post\`."""
enum PostsOrderBy {
  NATURAL
  COMPUTED_WITH_OPTIONAL_ARG_ASC
  COMPUTED_WITH_OPTIONAL_ARG_DESC
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  HEADLINE_ASC
  HEADLINE_DESC
  BODY_ASC
  BODY_DESC
  AUTHOR_ID_ASC
  AUTHOR_ID_DESC
}

"""A connection to a list of \`ForeignKey\` values."""
type ForeignKeysConnection {
  """A list of \`ForeignKey\` objects."""
  nodes: [ForeignKey]!

  """
  A list of edges which contains the \`ForeignKey\` and cursor to aid in pagination.
  """
  edges: [ForeignKeysEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`ForeignKey\` you could get from the connection."""
  totalCount: Int!
}

type ForeignKey {
  personId: Int
  compoundKey1: Int
  compoundKey2: Int

  """Reads a single \`CompoundKey\` that is related to this \`ForeignKey\`."""
  compoundKeyByCompoundKey1AndCompoundKey2: CompoundKey

  """Reads a single \`Person\` that is related to this \`ForeignKey\`."""
  personByPersonId: Person
}

"""A \`ForeignKey\` edge in the connection."""
type ForeignKeysEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`ForeignKey\` at the end of the edge."""
  node: ForeignKey
}

"""
A condition to be used against \`ForeignKey\` object types. All fields are tested
for equality and combined with a logical ‘and.’
"""
input ForeignKeyCondition {
  """Checks for equality with the object’s \`personId\` field."""
  personId: Int

  """Checks for equality with the object’s \`compoundKey1\` field."""
  compoundKey1: Int

  """Checks for equality with the object’s \`compoundKey2\` field."""
  compoundKey2: Int
}

"""Methods to use when ordering \`ForeignKey\`."""
enum ForeignKeysOrderBy {
  NATURAL
  PERSON_ID_ASC
  PERSON_ID_DESC
  COMPOUND_KEY_1_ASC
  COMPOUND_KEY_1_DESC
  COMPOUND_KEY_2_ASC
  COMPOUND_KEY_2_DESC
}

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

"""A \`CompoundKey\` edge in the connection."""
type CompoundKeysEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`CompoundKey\` at the end of the edge."""
  node: CompoundKey
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

type MyTable implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  jsonData: JSON
}

type ViewTable implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  col1: Int
  col2: Int
}

type SimilarTable1 implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  col1: Int
  col2: Int
  col3: Int!
}

type SimilarTable2 implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  col3: Int!
  col4: Int
  col5: Int
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

type List implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  intArray: [Int]
  intArrayNn: [Int]!
  enumArray: [Color]
  enumArrayNn: [Color]!
  dateArray: [Date]
  dateArrayNn: [Date]!
  timestamptzArray: [Datetime]
  timestamptzArrayNn: [Datetime]!
  compoundTypeArray: [CompoundType]
  compoundTypeArrayNn: [CompoundType]!
  byteaArray: [Base64EncodedBinary]
  byteaArrayNn: [Base64EncodedBinary]!
}

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

"""A connection to a list of \`Interval\` values."""
type QueryIntervalSetConnection {
  """A list of \`Interval\` objects."""
  nodes: [Interval]!

  """
  A list of edges which contains the \`Interval\` and cursor to aid in pagination.
  """
  edges: [QueryIntervalSetEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Interval\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Interval\` edge in the connection."""
type QueryIntervalSetEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Interval\` at the end of the edge."""
  node: Interval
}

"""A connection to a list of \`BigInt\` values."""
type StaticBigIntegerConnection {
  """A list of \`BigInt\` objects."""
  nodes: [BigInt]!

  """
  A list of edges which contains the \`BigInt\` and cursor to aid in pagination.
  """
  edges: [StaticBigIntegerEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`BigInt\` you could get from the connection."""
  totalCount: Int!
}

"""A \`BigInt\` edge in the connection."""
type StaticBigIntegerEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`BigInt\` at the end of the edge."""
  node: BigInt
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

type SearchTestSummariesRecord {
  id: Int
  totalDuration: Interval
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

type QueryOutputTwoRowsRecord {
  txt: String
  leftArm: LeftArm
  post: Post
}

type FuncOutOutCompoundTypeRecord {
  o1: Int
  o2: CompoundType
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

"""A connection to a list of \`NonUpdatableView\` values."""
type NonUpdatableViewsConnection {
  """A list of \`NonUpdatableView\` objects."""
  nodes: [NonUpdatableView]!

  """
  A list of edges which contains the \`NonUpdatableView\` and cursor to aid in pagination.
  """
  edges: [NonUpdatableViewsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """
  The count of *all* \`NonUpdatableView\` you could get from the connection.
  """
  totalCount: Int!
}

type NonUpdatableView {
  column: Int
}

"""A \`NonUpdatableView\` edge in the connection."""
type NonUpdatableViewsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`NonUpdatableView\` at the end of the edge."""
  node: NonUpdatableView
}

"""
A condition to be used against \`NonUpdatableView\` object types. All fields are
tested for equality and combined with a logical ‘and.’
"""
input NonUpdatableViewCondition {
  """Checks for equality with the object’s \`column\` field."""
  column: Int
}

"""Methods to use when ordering \`NonUpdatableView\`."""
enum NonUpdatableViewsOrderBy {
  NATURAL
  COLUMN_ASC
  COLUMN_DESC
}

"""A connection to a list of \`Input\` values."""
type InputsConnection {
  """A list of \`Input\` objects."""
  nodes: [Input]!

  """
  A list of edges which contains the \`Input\` and cursor to aid in pagination.
  """
  edges: [InputsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Input\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Input\` edge in the connection."""
type InputsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Input\` at the end of the edge."""
  node: Input
}

"""
A condition to be used against \`Input\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input InputCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int
}

"""Methods to use when ordering \`Input\`."""
enum InputsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
}

"""A connection to a list of \`Patch\` values."""
type PatchesConnection {
  """A list of \`Patch\` objects."""
  nodes: [Patch]!

  """
  A list of edges which contains the \`Patch\` and cursor to aid in pagination.
  """
  edges: [PatchesEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Patch\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Patch\` edge in the connection."""
type PatchesEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Patch\` at the end of the edge."""
  node: Patch
}

"""
A condition to be used against \`Patch\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input PatchCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int
}

"""Methods to use when ordering \`Patch\`."""
enum PatchesOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
}

"""A connection to a list of \`Reserved\` values."""
type ReservedsConnection {
  """A list of \`Reserved\` objects."""
  nodes: [Reserved]!

  """
  A list of edges which contains the \`Reserved\` and cursor to aid in pagination.
  """
  edges: [ReservedsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Reserved\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Reserved\` edge in the connection."""
type ReservedsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Reserved\` at the end of the edge."""
  node: Reserved
}

"""
A condition to be used against \`Reserved\` object types. All fields are tested
for equality and combined with a logical ‘and.’
"""
input ReservedCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int
}

"""Methods to use when ordering \`Reserved\`."""
enum ReservedsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
}

"""A connection to a list of \`ReservedPatchRecord\` values."""
type ReservedPatchRecordsConnection {
  """A list of \`ReservedPatchRecord\` objects."""
  nodes: [ReservedPatchRecord]!

  """
  A list of edges which contains the \`ReservedPatchRecord\` and cursor to aid in pagination.
  """
  edges: [ReservedPatchRecordsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """
  The count of *all* \`ReservedPatchRecord\` you could get from the connection.
  """
  totalCount: Int!
}

"""A \`ReservedPatchRecord\` edge in the connection."""
type ReservedPatchRecordsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`ReservedPatchRecord\` at the end of the edge."""
  node: ReservedPatchRecord
}

"""
A condition to be used against \`ReservedPatchRecord\` object types. All fields
are tested for equality and combined with a logical ‘and.’
"""
input ReservedPatchRecordCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int
}

"""Methods to use when ordering \`ReservedPatchRecord\`."""
enum ReservedPatchRecordsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
}

"""A connection to a list of \`ReservedInputRecord\` values."""
type ReservedInputRecordsConnection {
  """A list of \`ReservedInputRecord\` objects."""
  nodes: [ReservedInputRecord]!

  """
  A list of edges which contains the \`ReservedInputRecord\` and cursor to aid in pagination.
  """
  edges: [ReservedInputRecordsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """
  The count of *all* \`ReservedInputRecord\` you could get from the connection.
  """
  totalCount: Int!
}

"""A \`ReservedInputRecord\` edge in the connection."""
type ReservedInputRecordsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`ReservedInputRecord\` at the end of the edge."""
  node: ReservedInputRecord
}

"""
A condition to be used against \`ReservedInputRecord\` object types. All fields
are tested for equality and combined with a logical ‘and.’
"""
input ReservedInputRecordCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int
}

"""Methods to use when ordering \`ReservedInputRecord\`."""
enum ReservedInputRecordsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
}

"""A connection to a list of \`DefaultValue\` values."""
type DefaultValuesConnection {
  """A list of \`DefaultValue\` objects."""
  nodes: [DefaultValue]!

  """
  A list of edges which contains the \`DefaultValue\` and cursor to aid in pagination.
  """
  edges: [DefaultValuesEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`DefaultValue\` you could get from the connection."""
  totalCount: Int!
}

"""A \`DefaultValue\` edge in the connection."""
type DefaultValuesEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`DefaultValue\` at the end of the edge."""
  node: DefaultValue
}

"""
A condition to be used against \`DefaultValue\` object types. All fields are
tested for equality and combined with a logical ‘and.’
"""
input DefaultValueCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`nullValue\` field."""
  nullValue: String
}

"""Methods to use when ordering \`DefaultValue\`."""
enum DefaultValuesOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  NULL_VALUE_ASC
  NULL_VALUE_DESC
}

"""A connection to a list of \`NoPrimaryKey\` values."""
type NoPrimaryKeysConnection {
  """A list of \`NoPrimaryKey\` objects."""
  nodes: [NoPrimaryKey]!

  """
  A list of edges which contains the \`NoPrimaryKey\` and cursor to aid in pagination.
  """
  edges: [NoPrimaryKeysEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`NoPrimaryKey\` you could get from the connection."""
  totalCount: Int!
}

"""A \`NoPrimaryKey\` edge in the connection."""
type NoPrimaryKeysEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`NoPrimaryKey\` at the end of the edge."""
  node: NoPrimaryKey
}

"""
A condition to be used against \`NoPrimaryKey\` object types. All fields are
tested for equality and combined with a logical ‘and.’
"""
input NoPrimaryKeyCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`str\` field."""
  str: String
}

"""Methods to use when ordering \`NoPrimaryKey\`."""
enum NoPrimaryKeysOrderBy {
  NATURAL
  ID_ASC
  ID_DESC
  STR_ASC
  STR_DESC
}

"""A connection to a list of \`Testview\` values."""
type TestviewsConnection {
  """A list of \`Testview\` objects."""
  nodes: [Testview]!

  """
  A list of edges which contains the \`Testview\` and cursor to aid in pagination.
  """
  edges: [TestviewsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Testview\` you could get from the connection."""
  totalCount: Int!
}

type Testview {
  testviewid: Int
  col1: Int
  col2: Int
}

"""A \`Testview\` edge in the connection."""
type TestviewsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Testview\` at the end of the edge."""
  node: Testview
}

"""
A condition to be used against \`Testview\` object types. All fields are tested
for equality and combined with a logical ‘and.’
"""
input TestviewCondition {
  """Checks for equality with the object’s \`testviewid\` field."""
  testviewid: Int

  """Checks for equality with the object’s \`col1\` field."""
  col1: Int

  """Checks for equality with the object’s \`col2\` field."""
  col2: Int
}

"""Methods to use when ordering \`Testview\`."""
enum TestviewsOrderBy {
  NATURAL
  TESTVIEWID_ASC
  TESTVIEWID_DESC
  COL1_ASC
  COL1_DESC
  COL2_ASC
  COL2_DESC
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

"""A connection to a list of \`ViewTable\` values."""
type ViewTablesConnection {
  """A list of \`ViewTable\` objects."""
  nodes: [ViewTable]!

  """
  A list of edges which contains the \`ViewTable\` and cursor to aid in pagination.
  """
  edges: [ViewTablesEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`ViewTable\` you could get from the connection."""
  totalCount: Int!
}

"""A \`ViewTable\` edge in the connection."""
type ViewTablesEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`ViewTable\` at the end of the edge."""
  node: ViewTable
}

"""
A condition to be used against \`ViewTable\` object types. All fields are tested
for equality and combined with a logical ‘and.’
"""
input ViewTableCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`col1\` field."""
  col1: Int

  """Checks for equality with the object’s \`col2\` field."""
  col2: Int
}

"""Methods to use when ordering \`ViewTable\`."""
enum ViewTablesOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  COL1_ASC
  COL1_DESC
  COL2_ASC
  COL2_DESC
}

"""A connection to a list of \`SimilarTable1\` values."""
type SimilarTable1SConnection {
  """A list of \`SimilarTable1\` objects."""
  nodes: [SimilarTable1]!

  """
  A list of edges which contains the \`SimilarTable1\` and cursor to aid in pagination.
  """
  edges: [SimilarTable1SEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`SimilarTable1\` you could get from the connection."""
  totalCount: Int!
}

"""A \`SimilarTable1\` edge in the connection."""
type SimilarTable1SEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`SimilarTable1\` at the end of the edge."""
  node: SimilarTable1
}

"""
A condition to be used against \`SimilarTable1\` object types. All fields are
tested for equality and combined with a logical ‘and.’
"""
input SimilarTable1Condition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`col1\` field."""
  col1: Int

  """Checks for equality with the object’s \`col2\` field."""
  col2: Int

  """Checks for equality with the object’s \`col3\` field."""
  col3: Int
}

"""Methods to use when ordering \`SimilarTable1\`."""
enum SimilarTable1SOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  COL1_ASC
  COL1_DESC
  COL2_ASC
  COL2_DESC
  COL3_ASC
  COL3_DESC
}

"""A connection to a list of \`SimilarTable2\` values."""
type SimilarTable2SConnection {
  """A list of \`SimilarTable2\` objects."""
  nodes: [SimilarTable2]!

  """
  A list of edges which contains the \`SimilarTable2\` and cursor to aid in pagination.
  """
  edges: [SimilarTable2SEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`SimilarTable2\` you could get from the connection."""
  totalCount: Int!
}

"""A \`SimilarTable2\` edge in the connection."""
type SimilarTable2SEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`SimilarTable2\` at the end of the edge."""
  node: SimilarTable2
}

"""
A condition to be used against \`SimilarTable2\` object types. All fields are
tested for equality and combined with a logical ‘and.’
"""
input SimilarTable2Condition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`col3\` field."""
  col3: Int

  """Checks for equality with the object’s \`col4\` field."""
  col4: Int

  """Checks for equality with the object’s \`col5\` field."""
  col5: Int
}

"""Methods to use when ordering \`SimilarTable2\`."""
enum SimilarTable2SOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  COL3_ASC
  COL3_DESC
  COL4_ASC
  COL4_DESC
  COL5_ASC
  COL5_DESC
}

"""A connection to a list of \`UpdatableView\` values."""
type UpdatableViewsConnection {
  """A list of \`UpdatableView\` objects."""
  nodes: [UpdatableView]!

  """
  A list of edges which contains the \`UpdatableView\` and cursor to aid in pagination.
  """
  edges: [UpdatableViewsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`UpdatableView\` you could get from the connection."""
  totalCount: Int!
}

"""YOYOYO!!"""
type UpdatableView {
  x: Int
  name: String
  description: String

  """This is constantly 2"""
  constant: Int
}

"""A \`UpdatableView\` edge in the connection."""
type UpdatableViewsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`UpdatableView\` at the end of the edge."""
  node: UpdatableView
}

"""
A condition to be used against \`UpdatableView\` object types. All fields are
tested for equality and combined with a logical ‘and.’
"""
input UpdatableViewCondition {
  """Checks for equality with the object’s \`x\` field."""
  x: Int

  """Checks for equality with the object’s \`name\` field."""
  name: String

  """Checks for equality with the object’s \`description\` field."""
  description: String

  """Checks for equality with the object’s \`constant\` field."""
  constant: Int
}

"""Methods to use when ordering \`UpdatableView\`."""
enum UpdatableViewsOrderBy {
  NATURAL
  X_ASC
  X_DESC
  NAME_ASC
  NAME_DESC
  DESCRIPTION_ASC
  DESCRIPTION_DESC
  CONSTANT_ASC
  CONSTANT_DESC
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

"""A connection to a list of \`List\` values."""
type ListsConnection {
  """A list of \`List\` objects."""
  nodes: [List]!

  """
  A list of edges which contains the \`List\` and cursor to aid in pagination.
  """
  edges: [ListsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`List\` you could get from the connection."""
  totalCount: Int!
}

"""A \`List\` edge in the connection."""
type ListsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`List\` at the end of the edge."""
  node: List
}

"""
A condition to be used against \`List\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input ListCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`intArray\` field."""
  intArray: [Int]

  """Checks for equality with the object’s \`intArrayNn\` field."""
  intArrayNn: [Int]

  """Checks for equality with the object’s \`enumArray\` field."""
  enumArray: [Color]

  """Checks for equality with the object’s \`enumArrayNn\` field."""
  enumArrayNn: [Color]

  """Checks for equality with the object’s \`dateArray\` field."""
  dateArray: [Date]

  """Checks for equality with the object’s \`dateArrayNn\` field."""
  dateArrayNn: [Date]

  """Checks for equality with the object’s \`timestamptzArray\` field."""
  timestamptzArray: [Datetime]

  """Checks for equality with the object’s \`timestamptzArrayNn\` field."""
  timestamptzArrayNn: [Datetime]

  """Checks for equality with the object’s \`compoundTypeArray\` field."""
  compoundTypeArray: [CompoundTypeInput]

  """Checks for equality with the object’s \`compoundTypeArrayNn\` field."""
  compoundTypeArrayNn: [CompoundTypeInput]
}

"""Methods to use when ordering \`List\`."""
enum ListsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
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
  returnVoidMutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: ReturnVoidMutationInput!
  ): ReturnVoidMutationPayload
  mutationIntervalArray(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: MutationIntervalArrayInput!
  ): MutationIntervalArrayPayload
  mutationIntervalSet(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: MutationIntervalSetInput!
  ): MutationIntervalSetPayload
  mutationTextArray(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: MutationTextArrayInput!
  ): MutationTextArrayPayload
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

  """lol, add some stuff 1 mutation"""
  add1Mutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: Add1MutationInput!
  ): Add1MutationPayload

  """lol, add some stuff 2 mutation"""
  add2Mutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: Add2MutationInput!
  ): Add2MutationPayload

  """lol, add some stuff 3 mutation"""
  add3Mutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: Add3MutationInput!
  ): Add3MutationPayload

  """lol, add some stuff 4 mutation"""
  add4Mutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: Add4MutationInput!
  ): Add4MutationPayload
  add4MutationError(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: Add4MutationErrorInput!
  ): Add4MutationErrorPayload
  mult1(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: Mult1Input!
  ): Mult1Payload
  mult2(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: Mult2Input!
  ): Mult2Payload
  mult3(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: Mult3Input!
  ): Mult3Payload
  mult4(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: Mult4Input!
  ): Mult4Payload
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
  listBdeMutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: ListBdeMutationInput!
  ): ListBdeMutationPayload
  guidFn(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: GuidFnInput!
  ): GuidFnPayload
  authenticateFail(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: AuthenticateFailInput!
  ): AuthenticateFailPayload
  authenticate(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: AuthenticateInput!
  ): AuthenticatePayload
  typesMutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: TypesMutationInput!
  ): TypesMutationPayload
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
  authenticateMany(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: AuthenticateManyInput!
  ): AuthenticateManyPayload
  authenticatePayload(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: AuthenticatePayloadInput!
  ): AuthenticatePayloadPayload
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
  postWithSuffix(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: PostWithSuffixInput!
  ): PostWithSuffixPayload @deprecated(reason: "This is deprecated (comment on function a.post_with_suffix).")
  compoundTypeMutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CompoundTypeMutationInput!
  ): CompoundTypeMutationPayload
  compoundTypeSetMutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CompoundTypeSetMutationInput!
  ): CompoundTypeSetMutationPayload
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
  mutationCompoundTypeArray(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: MutationCompoundTypeArrayInput!
  ): MutationCompoundTypeArrayPayload
  compoundTypeArrayMutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CompoundTypeArrayMutationInput!
  ): CompoundTypeArrayMutationPayload
  postMany(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: PostManyInput!
  ): PostManyPayload
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
  typeFunctionConnectionMutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: TypeFunctionConnectionMutationInput!
  ): TypeFunctionConnectionMutationPayload
  typeFunctionMutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: TypeFunctionMutationInput!
  ): TypeFunctionMutationPayload
  typeFunctionListMutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: TypeFunctionListMutationInput!
  ): TypeFunctionListMutationPayload

  """Creates a single \`Input\`."""
  createInput(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateInputInput!
  ): CreateInputPayload

  """Creates a single \`Patch\`."""
  createPatch(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreatePatchInput!
  ): CreatePatchPayload

  """Creates a single \`Reserved\`."""
  createReserved(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateReservedInput!
  ): CreateReservedPayload

  """Creates a single \`ReservedPatchRecord\`."""
  createReservedPatchRecord(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateReservedPatchRecordInput!
  ): CreateReservedPatchRecordPayload

  """Creates a single \`ReservedInputRecord\`."""
  createReservedInputRecord(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateReservedInputRecordInput!
  ): CreateReservedInputRecordPayload

  """Creates a single \`DefaultValue\`."""
  createDefaultValue(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateDefaultValueInput!
  ): CreateDefaultValuePayload

  """Creates a single \`ForeignKey\`."""
  createForeignKey(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateForeignKeyInput!
  ): CreateForeignKeyPayload

  """Creates a single \`NoPrimaryKey\`."""
  createNoPrimaryKey(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateNoPrimaryKeyInput!
  ): CreateNoPrimaryKeyPayload

  """Creates a single \`Testview\`."""
  createTestview(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateTestviewInput!
  ): CreateTestviewPayload

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

  """Creates a single \`ViewTable\`."""
  createViewTable(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateViewTableInput!
  ): CreateViewTablePayload

  """Creates a single \`CompoundKey\`."""
  createCompoundKey(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateCompoundKeyInput!
  ): CreateCompoundKeyPayload

  """Creates a single \`SimilarTable1\`."""
  createSimilarTable1(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateSimilarTable1Input!
  ): CreateSimilarTable1Payload

  """Creates a single \`SimilarTable2\`."""
  createSimilarTable2(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateSimilarTable2Input!
  ): CreateSimilarTable2Payload

  """Creates a single \`UpdatableView\`."""
  createUpdatableView(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateUpdatableViewInput!
  ): CreateUpdatableViewPayload

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

  """Creates a single \`Post\`."""
  createPost(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreatePostInput!
  ): CreatePostPayload

  """Creates a single \`Person\`."""
  createPerson(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreatePersonInput!
  ): CreatePersonPayload

  """Creates a single \`List\`."""
  createList(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateListInput!
  ): CreateListPayload

  """Creates a single \`Type\`."""
  createType(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateTypeInput!
  ): CreateTypePayload

  """Updates a single \`Input\` using its globally unique id and a patch."""
  updateInput(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateInputInput!
  ): UpdateInputPayload

  """Updates a single \`Input\` using a unique key and a patch."""
  updateInputById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateInputByIdInput!
  ): UpdateInputPayload

  """Updates a single \`Patch\` using its globally unique id and a patch."""
  updatePatch(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdatePatchInput!
  ): UpdatePatchPayload

  """Updates a single \`Patch\` using a unique key and a patch."""
  updatePatchById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdatePatchByIdInput!
  ): UpdatePatchPayload

  """Updates a single \`Reserved\` using its globally unique id and a patch."""
  updateReserved(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateReservedInput!
  ): UpdateReservedPayload

  """Updates a single \`Reserved\` using a unique key and a patch."""
  updateReservedById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateReservedByIdInput!
  ): UpdateReservedPayload

  """
  Updates a single \`ReservedPatchRecord\` using its globally unique id and a patch.
  """
  updateReservedPatchRecord(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateReservedPatchRecordInput!
  ): UpdateReservedPatchRecordPayload

  """Updates a single \`ReservedPatchRecord\` using a unique key and a patch."""
  updateReservedPatchRecordById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateReservedPatchRecordByIdInput!
  ): UpdateReservedPatchRecordPayload

  """
  Updates a single \`ReservedInputRecord\` using its globally unique id and a patch.
  """
  updateReservedInputRecord(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateReservedInputRecordInput!
  ): UpdateReservedInputRecordPayload

  """Updates a single \`ReservedInputRecord\` using a unique key and a patch."""
  updateReservedInputRecordById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateReservedInputRecordByIdInput!
  ): UpdateReservedInputRecordPayload

  """
  Updates a single \`DefaultValue\` using its globally unique id and a patch.
  """
  updateDefaultValue(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateDefaultValueInput!
  ): UpdateDefaultValuePayload

  """Updates a single \`DefaultValue\` using a unique key and a patch."""
  updateDefaultValueById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateDefaultValueByIdInput!
  ): UpdateDefaultValuePayload

  """Updates a single \`NoPrimaryKey\` using a unique key and a patch."""
  updateNoPrimaryKeyById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateNoPrimaryKeyByIdInput!
  ): UpdateNoPrimaryKeyPayload

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

  """Updates a single \`ViewTable\` using its globally unique id and a patch."""
  updateViewTable(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateViewTableInput!
  ): UpdateViewTablePayload

  """Updates a single \`ViewTable\` using a unique key and a patch."""
  updateViewTableById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateViewTableByIdInput!
  ): UpdateViewTablePayload

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
  Updates a single \`SimilarTable1\` using its globally unique id and a patch.
  """
  updateSimilarTable1(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateSimilarTable1Input!
  ): UpdateSimilarTable1Payload

  """Updates a single \`SimilarTable1\` using a unique key and a patch."""
  updateSimilarTable1ById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateSimilarTable1ByIdInput!
  ): UpdateSimilarTable1Payload

  """
  Updates a single \`SimilarTable2\` using its globally unique id and a patch.
  """
  updateSimilarTable2(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateSimilarTable2Input!
  ): UpdateSimilarTable2Payload

  """Updates a single \`SimilarTable2\` using a unique key and a patch."""
  updateSimilarTable2ById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateSimilarTable2ByIdInput!
  ): UpdateSimilarTable2Payload

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

  """Updates a single \`Post\` using its globally unique id and a patch."""
  updatePost(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdatePostInput!
  ): UpdatePostPayload

  """Updates a single \`Post\` using a unique key and a patch."""
  updatePostById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdatePostByIdInput!
  ): UpdatePostPayload

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

  """Updates a single \`List\` using its globally unique id and a patch."""
  updateList(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateListInput!
  ): UpdateListPayload

  """Updates a single \`List\` using a unique key and a patch."""
  updateListById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateListByIdInput!
  ): UpdateListPayload

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

  """Deletes a single \`Input\` using its globally unique id."""
  deleteInput(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteInputInput!
  ): DeleteInputPayload

  """Deletes a single \`Input\` using a unique key."""
  deleteInputById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteInputByIdInput!
  ): DeleteInputPayload

  """Deletes a single \`Patch\` using its globally unique id."""
  deletePatch(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeletePatchInput!
  ): DeletePatchPayload

  """Deletes a single \`Patch\` using a unique key."""
  deletePatchById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeletePatchByIdInput!
  ): DeletePatchPayload

  """Deletes a single \`Reserved\` using its globally unique id."""
  deleteReserved(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteReservedInput!
  ): DeleteReservedPayload

  """Deletes a single \`Reserved\` using a unique key."""
  deleteReservedById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteReservedByIdInput!
  ): DeleteReservedPayload

  """Deletes a single \`ReservedPatchRecord\` using its globally unique id."""
  deleteReservedPatchRecord(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteReservedPatchRecordInput!
  ): DeleteReservedPatchRecordPayload

  """Deletes a single \`ReservedPatchRecord\` using a unique key."""
  deleteReservedPatchRecordById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteReservedPatchRecordByIdInput!
  ): DeleteReservedPatchRecordPayload

  """Deletes a single \`ReservedInputRecord\` using its globally unique id."""
  deleteReservedInputRecord(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteReservedInputRecordInput!
  ): DeleteReservedInputRecordPayload

  """Deletes a single \`ReservedInputRecord\` using a unique key."""
  deleteReservedInputRecordById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteReservedInputRecordByIdInput!
  ): DeleteReservedInputRecordPayload

  """Deletes a single \`DefaultValue\` using its globally unique id."""
  deleteDefaultValue(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteDefaultValueInput!
  ): DeleteDefaultValuePayload

  """Deletes a single \`DefaultValue\` using a unique key."""
  deleteDefaultValueById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteDefaultValueByIdInput!
  ): DeleteDefaultValuePayload

  """Deletes a single \`NoPrimaryKey\` using a unique key."""
  deleteNoPrimaryKeyById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteNoPrimaryKeyByIdInput!
  ): DeleteNoPrimaryKeyPayload

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

  """Deletes a single \`ViewTable\` using its globally unique id."""
  deleteViewTable(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteViewTableInput!
  ): DeleteViewTablePayload

  """Deletes a single \`ViewTable\` using a unique key."""
  deleteViewTableById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteViewTableByIdInput!
  ): DeleteViewTablePayload

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

  """Deletes a single \`SimilarTable1\` using its globally unique id."""
  deleteSimilarTable1(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteSimilarTable1Input!
  ): DeleteSimilarTable1Payload

  """Deletes a single \`SimilarTable1\` using a unique key."""
  deleteSimilarTable1ById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteSimilarTable1ByIdInput!
  ): DeleteSimilarTable1Payload

  """Deletes a single \`SimilarTable2\` using its globally unique id."""
  deleteSimilarTable2(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteSimilarTable2Input!
  ): DeleteSimilarTable2Payload

  """Deletes a single \`SimilarTable2\` using a unique key."""
  deleteSimilarTable2ById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteSimilarTable2ByIdInput!
  ): DeleteSimilarTable2Payload

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

  """Deletes a single \`Post\` using its globally unique id."""
  deletePost(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeletePostInput!
  ): DeletePostPayload

  """Deletes a single \`Post\` using a unique key."""
  deletePostById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeletePostByIdInput!
  ): DeletePostPayload

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

  """Deletes a single \`List\` using its globally unique id."""
  deleteList(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteListInput!
  ): DeleteListPayload

  """Deletes a single \`List\` using a unique key."""
  deleteListById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteListByIdInput!
  ): DeleteListPayload

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

"""The output of our \`returnVoidMutation\` mutation."""
type ReturnVoidMutationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`returnVoidMutation\` mutation."""
input ReturnVoidMutationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
}

"""The output of our \`mutationIntervalArray\` mutation."""
type MutationIntervalArrayPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  intervals: [Interval]

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`mutationIntervalArray\` mutation."""
input MutationIntervalArrayInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
}

"""The output of our \`mutationIntervalSet\` mutation."""
type MutationIntervalSetPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  intervals: [Interval]

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`mutationIntervalSet\` mutation."""
input MutationIntervalSetInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
}

"""The output of our \`mutationTextArray\` mutation."""
type MutationTextArrayPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  strings: [String]

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`mutationTextArray\` mutation."""
input MutationTextArrayInput {
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

"""The output of our \`add1Mutation\` mutation."""
type Add1MutationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  integer: Int!

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`add1Mutation\` mutation."""
input Add1MutationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  arg0: Int!
  arg1: Int!
}

"""The output of our \`add2Mutation\` mutation."""
type Add2MutationPayload {
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

"""All input for the \`add2Mutation\` mutation."""
input Add2MutationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  a: Int!
  b: Int
}

"""The output of our \`add3Mutation\` mutation."""
type Add3MutationPayload {
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

"""All input for the \`add3Mutation\` mutation."""
input Add3MutationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  a: Int
  arg1: Int
}

"""The output of our \`add4Mutation\` mutation."""
type Add4MutationPayload {
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

"""All input for the \`add4Mutation\` mutation."""
input Add4MutationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  arg0: Int
  b: Int
}

"""The output of our \`add4MutationError\` mutation."""
type Add4MutationErrorPayload {
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

"""All input for the \`add4MutationError\` mutation."""
input Add4MutationErrorInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  arg0: Int
  b: Int
}

"""The output of our \`mult1\` mutation."""
type Mult1Payload {
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

"""All input for the \`mult1\` mutation."""
input Mult1Input {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  arg0: Int
  arg1: Int
}

"""The output of our \`mult2\` mutation."""
type Mult2Payload {
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

"""All input for the \`mult2\` mutation."""
input Mult2Input {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  arg0: Int
  arg1: Int
}

"""The output of our \`mult3\` mutation."""
type Mult3Payload {
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

"""All input for the \`mult3\` mutation."""
input Mult3Input {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  arg0: Int!
  arg1: Int!
}

"""The output of our \`mult4\` mutation."""
type Mult4Payload {
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

"""All input for the \`mult4\` mutation."""
input Mult4Input {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  arg0: Int!
  arg1: Int!
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

"""The output of our \`listBdeMutation\` mutation."""
type ListBdeMutationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  uuids: [UUID]

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`listBdeMutation\` mutation."""
input ListBdeMutationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  b: [String]
  d: String
  e: String
}

"""The output of our \`guidFn\` mutation."""
type GuidFnPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  guid: Guid

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

scalar Guid

"""All input for the \`guidFn\` mutation."""
input GuidFnInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  g: Guid
}

"""The output of our \`authenticateFail\` mutation."""
type AuthenticateFailPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  jwtToken: JwtToken

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

type JwtToken {
  role: String
  exp: BigInt
  a: Int
  b: BigFloat
  c: BigInt
}

"""All input for the \`authenticateFail\` mutation."""
input AuthenticateFailInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
}

"""The output of our \`authenticate\` mutation."""
type AuthenticatePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  jwtToken: JwtToken

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`authenticate\` mutation."""
input AuthenticateInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  a: Int
  b: BigFloat
  c: BigInt
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

"""The output of our \`authenticateMany\` mutation."""
type AuthenticateManyPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  jwtTokens: [JwtToken]

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`authenticateMany\` mutation."""
input AuthenticateManyInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  a: Int
  b: BigFloat
  c: BigInt
}

"""The output of our \`authenticatePayload\` mutation."""
type AuthenticatePayloadPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  authPayload: AuthPayload

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """Reads a single \`Person\` that is related to this \`AuthPayload\`."""
  personById: Person
}

type AuthPayload {
  jwt: JwtToken
  id: Int
  admin: Boolean

  """Reads a single \`Person\` that is related to this \`AuthPayload\`."""
  personById: Person
}

"""All input for the \`authenticatePayload\` mutation."""
input AuthenticatePayloadInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  a: Int
  b: BigFloat
  c: BigInt
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

  """An edge for our \`Post\`. May be used by Relay 1."""
  postEdge(
    """The method to use when ordering \`Post\`."""
    orderBy: [PostsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PostsEdge

  """Reads a single \`Person\` that is related to this \`Post\`."""
  personByAuthorId: Person
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

"""The output of our \`postWithSuffix\` mutation."""
type PostWithSuffixPayload {
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

  """An edge for our \`Post\`. May be used by Relay 1."""
  postEdge(
    """The method to use when ordering \`Post\`."""
    orderBy: [PostsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PostsEdge

  """Reads a single \`Person\` that is related to this \`Post\`."""
  personByAuthorId: Person
}

"""All input for the \`postWithSuffix\` mutation."""
input PostWithSuffixInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  post: PostInput
  suffix: String
}

"""An input for mutations affecting \`Post\`"""
input PostInput {
  id: Int
  headline: String!
  body: String
  authorId: Int
  enums: [AnEnum]
  comptypes: [ComptypeInput]
}

"""The output of our \`compoundTypeMutation\` mutation."""
type CompoundTypeMutationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  compoundType: CompoundType

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`compoundTypeMutation\` mutation."""
input CompoundTypeMutationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  object: CompoundTypeInput
}

"""The output of our \`compoundTypeSetMutation\` mutation."""
type CompoundTypeSetMutationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  compoundTypes: [CompoundType]

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`compoundTypeSetMutation\` mutation."""
input CompoundTypeSetMutationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  object: CompoundTypeInput
}

"""The output of our \`listOfCompoundTypesMutation\` mutation."""
type ListOfCompoundTypesMutationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  compoundTypes: [CompoundType]

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

"""The output of our \`mutationCompoundTypeArray\` mutation."""
type MutationCompoundTypeArrayPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  compoundTypes: [CompoundType]

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`mutationCompoundTypeArray\` mutation."""
input MutationCompoundTypeArrayInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  object: CompoundTypeInput
}

"""The output of our \`compoundTypeArrayMutation\` mutation."""
type CompoundTypeArrayMutationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  compoundTypes: [CompoundType]

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`compoundTypeArrayMutation\` mutation."""
input CompoundTypeArrayMutationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  object: CompoundTypeInput
}

"""The output of our \`postMany\` mutation."""
type PostManyPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  posts: [Post]

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`postMany\` mutation."""
input PostManyInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  posts: [PostInput]
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

"""The output of our \`typeFunctionConnectionMutation\` mutation."""
type TypeFunctionConnectionMutationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  types: [Type]

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`typeFunctionConnectionMutation\` mutation."""
input TypeFunctionConnectionMutationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
}

"""The output of our \`typeFunctionMutation\` mutation."""
type TypeFunctionMutationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
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

  """Reads a single \`Post\` that is related to this \`Type\`."""
  postBySmallint: Post

  """Reads a single \`Post\` that is related to this \`Type\`."""
  postById: Post
}

"""All input for the \`typeFunctionMutation\` mutation."""
input TypeFunctionMutationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int
}

"""The output of our \`typeFunctionListMutation\` mutation."""
type TypeFunctionListMutationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  types: [Type]

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`typeFunctionListMutation\` mutation."""
input TypeFunctionListMutationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
}

"""The output of our create \`Input\` mutation."""
type CreateInputPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Input\` that was created by this mutation."""
  input: Input

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Input\`. May be used by Relay 1."""
  inputEdge(
    """The method to use when ordering \`Input\`."""
    orderBy: [InputsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): InputsEdge
}

"""All input for the create \`Input\` mutation."""
input CreateInputInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`Input\` to be created by this mutation."""
  input: InputInput!
}

"""An input for mutations affecting \`Input\`"""
input InputInput {
  id: Int
}

"""The output of our create \`Patch\` mutation."""
type CreatePatchPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Patch\` that was created by this mutation."""
  patch: Patch

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Patch\`. May be used by Relay 1."""
  patchEdge(
    """The method to use when ordering \`Patch\`."""
    orderBy: [PatchesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PatchesEdge
}

"""All input for the create \`Patch\` mutation."""
input CreatePatchInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`Patch\` to be created by this mutation."""
  patch: PatchInput!
}

"""An input for mutations affecting \`Patch\`"""
input PatchInput {
  id: Int
}

"""The output of our create \`Reserved\` mutation."""
type CreateReservedPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Reserved\` that was created by this mutation."""
  reserved: Reserved

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Reserved\`. May be used by Relay 1."""
  reservedEdge(
    """The method to use when ordering \`Reserved\`."""
    orderBy: [ReservedsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ReservedsEdge
}

"""All input for the create \`Reserved\` mutation."""
input CreateReservedInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`Reserved\` to be created by this mutation."""
  reserved: ReservedInput!
}

"""An input for mutations affecting \`Reserved\`"""
input ReservedInput {
  id: Int
}

"""The output of our create \`ReservedPatchRecord\` mutation."""
type CreateReservedPatchRecordPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`ReservedPatchRecord\` that was created by this mutation."""
  reservedPatchRecord: ReservedPatchRecord

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`ReservedPatchRecord\`. May be used by Relay 1."""
  reservedPatchRecordEdge(
    """The method to use when ordering \`ReservedPatchRecord\`."""
    orderBy: [ReservedPatchRecordsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ReservedPatchRecordsEdge
}

"""All input for the create \`ReservedPatchRecord\` mutation."""
input CreateReservedPatchRecordInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`ReservedPatchRecord\` to be created by this mutation."""
  reservedPatchRecord: ReservedPatchRecordInput!
}

"""An input for mutations affecting \`ReservedPatchRecord\`"""
input ReservedPatchRecordInput {
  id: Int
}

"""The output of our create \`ReservedInputRecord\` mutation."""
type CreateReservedInputRecordPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`ReservedInputRecord\` that was created by this mutation."""
  reservedInputRecord: ReservedInputRecord

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`ReservedInputRecord\`. May be used by Relay 1."""
  reservedInputRecordEdge(
    """The method to use when ordering \`ReservedInputRecord\`."""
    orderBy: [ReservedInputRecordsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ReservedInputRecordsEdge
}

"""All input for the create \`ReservedInputRecord\` mutation."""
input CreateReservedInputRecordInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`ReservedInputRecord\` to be created by this mutation."""
  reservedInputRecord: ReservedInputRecordInput!
}

"""An input for mutations affecting \`ReservedInputRecord\`"""
input ReservedInputRecordInput {
  id: Int
}

"""The output of our create \`DefaultValue\` mutation."""
type CreateDefaultValuePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`DefaultValue\` that was created by this mutation."""
  defaultValue: DefaultValue

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`DefaultValue\`. May be used by Relay 1."""
  defaultValueEdge(
    """The method to use when ordering \`DefaultValue\`."""
    orderBy: [DefaultValuesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): DefaultValuesEdge
}

"""All input for the create \`DefaultValue\` mutation."""
input CreateDefaultValueInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`DefaultValue\` to be created by this mutation."""
  defaultValue: DefaultValueInput!
}

"""An input for mutations affecting \`DefaultValue\`"""
input DefaultValueInput {
  id: Int
  nullValue: String
}

"""The output of our create \`ForeignKey\` mutation."""
type CreateForeignKeyPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`ForeignKey\` that was created by this mutation."""
  foreignKey: ForeignKey

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """Reads a single \`CompoundKey\` that is related to this \`ForeignKey\`."""
  compoundKeyByCompoundKey1AndCompoundKey2: CompoundKey

  """Reads a single \`Person\` that is related to this \`ForeignKey\`."""
  personByPersonId: Person
}

"""All input for the create \`ForeignKey\` mutation."""
input CreateForeignKeyInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`ForeignKey\` to be created by this mutation."""
  foreignKey: ForeignKeyInput!
}

"""An input for mutations affecting \`ForeignKey\`"""
input ForeignKeyInput {
  personId: Int
  compoundKey1: Int
  compoundKey2: Int
}

"""The output of our create \`NoPrimaryKey\` mutation."""
type CreateNoPrimaryKeyPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`NoPrimaryKey\` that was created by this mutation."""
  noPrimaryKey: NoPrimaryKey

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the create \`NoPrimaryKey\` mutation."""
input CreateNoPrimaryKeyInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`NoPrimaryKey\` to be created by this mutation."""
  noPrimaryKey: NoPrimaryKeyInput!
}

"""An input for mutations affecting \`NoPrimaryKey\`"""
input NoPrimaryKeyInput {
  id: Int!
  str: String!
}

"""The output of our create \`Testview\` mutation."""
type CreateTestviewPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Testview\` that was created by this mutation."""
  testview: Testview

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the create \`Testview\` mutation."""
input CreateTestviewInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`Testview\` to be created by this mutation."""
  testview: TestviewInput!
}

"""An input for mutations affecting \`Testview\`"""
input TestviewInput {
  testviewid: Int
  col1: Int
  col2: Int
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

"""The output of our create \`ViewTable\` mutation."""
type CreateViewTablePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`ViewTable\` that was created by this mutation."""
  viewTable: ViewTable

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`ViewTable\`. May be used by Relay 1."""
  viewTableEdge(
    """The method to use when ordering \`ViewTable\`."""
    orderBy: [ViewTablesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ViewTablesEdge
}

"""All input for the create \`ViewTable\` mutation."""
input CreateViewTableInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`ViewTable\` to be created by this mutation."""
  viewTable: ViewTableInput!
}

"""An input for mutations affecting \`ViewTable\`"""
input ViewTableInput {
  id: Int
  col1: Int
  col2: Int
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

"""The output of our create \`SimilarTable1\` mutation."""
type CreateSimilarTable1Payload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`SimilarTable1\` that was created by this mutation."""
  similarTable1: SimilarTable1

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`SimilarTable1\`. May be used by Relay 1."""
  similarTable1Edge(
    """The method to use when ordering \`SimilarTable1\`."""
    orderBy: [SimilarTable1SOrderBy!]! = [PRIMARY_KEY_ASC]
  ): SimilarTable1SEdge
}

"""All input for the create \`SimilarTable1\` mutation."""
input CreateSimilarTable1Input {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`SimilarTable1\` to be created by this mutation."""
  similarTable1: SimilarTable1Input!
}

"""An input for mutations affecting \`SimilarTable1\`"""
input SimilarTable1Input {
  id: Int
  col1: Int
  col2: Int
  col3: Int!
}

"""The output of our create \`SimilarTable2\` mutation."""
type CreateSimilarTable2Payload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`SimilarTable2\` that was created by this mutation."""
  similarTable2: SimilarTable2

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`SimilarTable2\`. May be used by Relay 1."""
  similarTable2Edge(
    """The method to use when ordering \`SimilarTable2\`."""
    orderBy: [SimilarTable2SOrderBy!]! = [PRIMARY_KEY_ASC]
  ): SimilarTable2SEdge
}

"""All input for the create \`SimilarTable2\` mutation."""
input CreateSimilarTable2Input {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`SimilarTable2\` to be created by this mutation."""
  similarTable2: SimilarTable2Input!
}

"""An input for mutations affecting \`SimilarTable2\`"""
input SimilarTable2Input {
  id: Int
  col3: Int!
  col4: Int
  col5: Int
}

"""The output of our create \`UpdatableView\` mutation."""
type CreateUpdatableViewPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`UpdatableView\` that was created by this mutation."""
  updatableView: UpdatableView

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the create \`UpdatableView\` mutation."""
input CreateUpdatableViewInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`UpdatableView\` to be created by this mutation."""
  updatableView: UpdatableViewInput!
}

"""An input for mutations affecting \`UpdatableView\`"""
input UpdatableViewInput {
  x: Int
  name: String
  description: String

  """This is constantly 2"""
  constant: Int
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

"""The output of our create \`Post\` mutation."""
type CreatePostPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Post\` that was created by this mutation."""
  post: Post

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Post\`. May be used by Relay 1."""
  postEdge(
    """The method to use when ordering \`Post\`."""
    orderBy: [PostsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PostsEdge

  """Reads a single \`Person\` that is related to this \`Post\`."""
  personByAuthorId: Person
}

"""All input for the create \`Post\` mutation."""
input CreatePostInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`Post\` to be created by this mutation."""
  post: PostInput!
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

"""The output of our create \`List\` mutation."""
type CreateListPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`List\` that was created by this mutation."""
  list: List

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`List\`. May be used by Relay 1."""
  listEdge(
    """The method to use when ordering \`List\`."""
    orderBy: [ListsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ListsEdge
}

"""All input for the create \`List\` mutation."""
input CreateListInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`List\` to be created by this mutation."""
  list: ListInput!
}

"""An input for mutations affecting \`List\`"""
input ListInput {
  id: Int
  intArray: [Int]
  intArrayNn: [Int]!
  enumArray: [Color]
  enumArrayNn: [Color]!
  dateArray: [Date]
  dateArrayNn: [Date]!
  timestamptzArray: [Datetime]
  timestamptzArrayNn: [Datetime]!
  compoundTypeArray: [CompoundTypeInput]
  compoundTypeArrayNn: [CompoundTypeInput]!
  byteaArray: [Base64EncodedBinary]
  byteaArrayNn: [Base64EncodedBinary]!
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

  """Reads a single \`Post\` that is related to this \`Type\`."""
  postBySmallint: Post

  """Reads a single \`Post\` that is related to this \`Type\`."""
  postById: Post
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
  nullableRange: BigFloatRangeInput
  numrange: BigFloatRangeInput!
  daterange: DateRangeInput!
  anIntRange: AnIntRangeInput!
  timestamp: Datetime!
  timestamptz: Datetime!
  date: Date!
  time: Time!
  timetz: Time!
  interval: IntervalInput!
  intervalArray: [IntervalInput]!
  money: Float!
  compoundType: CompoundTypeInput!
  nestedCompoundType: NestedCompoundTypeInput!
  nullableCompoundType: CompoundTypeInput
  nullableNestedCompoundType: NestedCompoundTypeInput
  point: PointInput!
  nullablePoint: PointInput
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

"""The output of our update \`Input\` mutation."""
type UpdateInputPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Input\` that was updated by this mutation."""
  input: Input

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Input\`. May be used by Relay 1."""
  inputEdge(
    """The method to use when ordering \`Input\`."""
    orderBy: [InputsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): InputsEdge
}

"""All input for the \`updateInput\` mutation."""
input UpdateInputInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Input\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`Input\` being updated.
  """
  inputPatch: InputPatch!
}

"""
Represents an update to a \`Input\`. Fields that are set will be updated.
"""
input InputPatch {
  id: Int
}

"""All input for the \`updateInputById\` mutation."""
input UpdateInputByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`Input\` being updated.
  """
  inputPatch: InputPatch!
}

"""The output of our update \`Patch\` mutation."""
type UpdatePatchPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Patch\` that was updated by this mutation."""
  patch: Patch

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Patch\`. May be used by Relay 1."""
  patchEdge(
    """The method to use when ordering \`Patch\`."""
    orderBy: [PatchesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PatchesEdge
}

"""All input for the \`updatePatch\` mutation."""
input UpdatePatchInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Patch\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`Patch\` being updated.
  """
  patchPatch: PatchPatch!
}

"""
Represents an update to a \`Patch\`. Fields that are set will be updated.
"""
input PatchPatch {
  id: Int
}

"""All input for the \`updatePatchById\` mutation."""
input UpdatePatchByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`Patch\` being updated.
  """
  patchPatch: PatchPatch!
}

"""The output of our update \`Reserved\` mutation."""
type UpdateReservedPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Reserved\` that was updated by this mutation."""
  reserved: Reserved

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Reserved\`. May be used by Relay 1."""
  reservedEdge(
    """The method to use when ordering \`Reserved\`."""
    orderBy: [ReservedsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ReservedsEdge
}

"""All input for the \`updateReserved\` mutation."""
input UpdateReservedInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Reserved\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`Reserved\` being updated.
  """
  reservedPatch: ReservedPatch!
}

"""
Represents an update to a \`Reserved\`. Fields that are set will be updated.
"""
input ReservedPatch {
  id: Int
}

"""All input for the \`updateReservedById\` mutation."""
input UpdateReservedByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`Reserved\` being updated.
  """
  reservedPatch: ReservedPatch!
}

"""The output of our update \`ReservedPatchRecord\` mutation."""
type UpdateReservedPatchRecordPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`ReservedPatchRecord\` that was updated by this mutation."""
  reservedPatchRecord: ReservedPatchRecord

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`ReservedPatchRecord\`. May be used by Relay 1."""
  reservedPatchRecordEdge(
    """The method to use when ordering \`ReservedPatchRecord\`."""
    orderBy: [ReservedPatchRecordsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ReservedPatchRecordsEdge
}

"""All input for the \`updateReservedPatchRecord\` mutation."""
input UpdateReservedPatchRecordInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`ReservedPatchRecord\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`ReservedPatchRecord\` being updated.
  """
  reservedPatchRecordPatch: ReservedPatchRecordPatch!
}

"""
Represents an update to a \`ReservedPatchRecord\`. Fields that are set will be updated.
"""
input ReservedPatchRecordPatch {
  id: Int
}

"""All input for the \`updateReservedPatchRecordById\` mutation."""
input UpdateReservedPatchRecordByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`ReservedPatchRecord\` being updated.
  """
  reservedPatchRecordPatch: ReservedPatchRecordPatch!
}

"""The output of our update \`ReservedInputRecord\` mutation."""
type UpdateReservedInputRecordPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`ReservedInputRecord\` that was updated by this mutation."""
  reservedInputRecord: ReservedInputRecord

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`ReservedInputRecord\`. May be used by Relay 1."""
  reservedInputRecordEdge(
    """The method to use when ordering \`ReservedInputRecord\`."""
    orderBy: [ReservedInputRecordsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ReservedInputRecordsEdge
}

"""All input for the \`updateReservedInputRecord\` mutation."""
input UpdateReservedInputRecordInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`ReservedInputRecord\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`ReservedInputRecord\` being updated.
  """
  reservedInputRecordPatch: ReservedInputRecordPatch!
}

"""
Represents an update to a \`ReservedInputRecord\`. Fields that are set will be updated.
"""
input ReservedInputRecordPatch {
  id: Int
}

"""All input for the \`updateReservedInputRecordById\` mutation."""
input UpdateReservedInputRecordByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`ReservedInputRecord\` being updated.
  """
  reservedInputRecordPatch: ReservedInputRecordPatch!
}

"""The output of our update \`DefaultValue\` mutation."""
type UpdateDefaultValuePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`DefaultValue\` that was updated by this mutation."""
  defaultValue: DefaultValue

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`DefaultValue\`. May be used by Relay 1."""
  defaultValueEdge(
    """The method to use when ordering \`DefaultValue\`."""
    orderBy: [DefaultValuesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): DefaultValuesEdge
}

"""All input for the \`updateDefaultValue\` mutation."""
input UpdateDefaultValueInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`DefaultValue\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`DefaultValue\` being updated.
  """
  defaultValuePatch: DefaultValuePatch!
}

"""
Represents an update to a \`DefaultValue\`. Fields that are set will be updated.
"""
input DefaultValuePatch {
  id: Int
  nullValue: String
}

"""All input for the \`updateDefaultValueById\` mutation."""
input UpdateDefaultValueByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`DefaultValue\` being updated.
  """
  defaultValuePatch: DefaultValuePatch!
}

"""The output of our update \`NoPrimaryKey\` mutation."""
type UpdateNoPrimaryKeyPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`NoPrimaryKey\` that was updated by this mutation."""
  noPrimaryKey: NoPrimaryKey

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`updateNoPrimaryKeyById\` mutation."""
input UpdateNoPrimaryKeyByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`NoPrimaryKey\` being updated.
  """
  noPrimaryKeyPatch: NoPrimaryKeyPatch!
}

"""
Represents an update to a \`NoPrimaryKey\`. Fields that are set will be updated.
"""
input NoPrimaryKeyPatch {
  id: Int
  str: String
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

"""The output of our update \`ViewTable\` mutation."""
type UpdateViewTablePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`ViewTable\` that was updated by this mutation."""
  viewTable: ViewTable

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`ViewTable\`. May be used by Relay 1."""
  viewTableEdge(
    """The method to use when ordering \`ViewTable\`."""
    orderBy: [ViewTablesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ViewTablesEdge
}

"""All input for the \`updateViewTable\` mutation."""
input UpdateViewTableInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`ViewTable\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`ViewTable\` being updated.
  """
  viewTablePatch: ViewTablePatch!
}

"""
Represents an update to a \`ViewTable\`. Fields that are set will be updated.
"""
input ViewTablePatch {
  id: Int
  col1: Int
  col2: Int
}

"""All input for the \`updateViewTableById\` mutation."""
input UpdateViewTableByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`ViewTable\` being updated.
  """
  viewTablePatch: ViewTablePatch!
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

"""The output of our update \`SimilarTable1\` mutation."""
type UpdateSimilarTable1Payload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`SimilarTable1\` that was updated by this mutation."""
  similarTable1: SimilarTable1

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`SimilarTable1\`. May be used by Relay 1."""
  similarTable1Edge(
    """The method to use when ordering \`SimilarTable1\`."""
    orderBy: [SimilarTable1SOrderBy!]! = [PRIMARY_KEY_ASC]
  ): SimilarTable1SEdge
}

"""All input for the \`updateSimilarTable1\` mutation."""
input UpdateSimilarTable1Input {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`SimilarTable1\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`SimilarTable1\` being updated.
  """
  similarTable1Patch: SimilarTable1Patch!
}

"""
Represents an update to a \`SimilarTable1\`. Fields that are set will be updated.
"""
input SimilarTable1Patch {
  id: Int
  col1: Int
  col2: Int
  col3: Int
}

"""All input for the \`updateSimilarTable1ById\` mutation."""
input UpdateSimilarTable1ByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`SimilarTable1\` being updated.
  """
  similarTable1Patch: SimilarTable1Patch!
}

"""The output of our update \`SimilarTable2\` mutation."""
type UpdateSimilarTable2Payload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`SimilarTable2\` that was updated by this mutation."""
  similarTable2: SimilarTable2

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`SimilarTable2\`. May be used by Relay 1."""
  similarTable2Edge(
    """The method to use when ordering \`SimilarTable2\`."""
    orderBy: [SimilarTable2SOrderBy!]! = [PRIMARY_KEY_ASC]
  ): SimilarTable2SEdge
}

"""All input for the \`updateSimilarTable2\` mutation."""
input UpdateSimilarTable2Input {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`SimilarTable2\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`SimilarTable2\` being updated.
  """
  similarTable2Patch: SimilarTable2Patch!
}

"""
Represents an update to a \`SimilarTable2\`. Fields that are set will be updated.
"""
input SimilarTable2Patch {
  id: Int
  col3: Int
  col4: Int
  col5: Int
}

"""All input for the \`updateSimilarTable2ById\` mutation."""
input UpdateSimilarTable2ByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`SimilarTable2\` being updated.
  """
  similarTable2Patch: SimilarTable2Patch!
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

"""The output of our update \`Post\` mutation."""
type UpdatePostPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Post\` that was updated by this mutation."""
  post: Post

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Post\`. May be used by Relay 1."""
  postEdge(
    """The method to use when ordering \`Post\`."""
    orderBy: [PostsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PostsEdge

  """Reads a single \`Person\` that is related to this \`Post\`."""
  personByAuthorId: Person
}

"""All input for the \`updatePost\` mutation."""
input UpdatePostInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Post\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`Post\` being updated.
  """
  postPatch: PostPatch!
}

"""Represents an update to a \`Post\`. Fields that are set will be updated."""
input PostPatch {
  id: Int
  headline: String
  body: String
  authorId: Int
  enums: [AnEnum]
  comptypes: [ComptypeInput]
}

"""All input for the \`updatePostById\` mutation."""
input UpdatePostByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`Post\` being updated.
  """
  postPatch: PostPatch!
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

"""The output of our update \`List\` mutation."""
type UpdateListPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`List\` that was updated by this mutation."""
  list: List

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`List\`. May be used by Relay 1."""
  listEdge(
    """The method to use when ordering \`List\`."""
    orderBy: [ListsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ListsEdge
}

"""All input for the \`updateList\` mutation."""
input UpdateListInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`List\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`List\` being updated.
  """
  listPatch: ListPatch!
}

"""Represents an update to a \`List\`. Fields that are set will be updated."""
input ListPatch {
  id: Int
  intArray: [Int]
  intArrayNn: [Int]
  enumArray: [Color]
  enumArrayNn: [Color]
  dateArray: [Date]
  dateArrayNn: [Date]
  timestamptzArray: [Datetime]
  timestamptzArrayNn: [Datetime]
  compoundTypeArray: [CompoundTypeInput]
  compoundTypeArrayNn: [CompoundTypeInput]
  byteaArray: [Base64EncodedBinary]
  byteaArrayNn: [Base64EncodedBinary]
}

"""All input for the \`updateListById\` mutation."""
input UpdateListByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`List\` being updated.
  """
  listPatch: ListPatch!
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

  """Reads a single \`Post\` that is related to this \`Type\`."""
  postBySmallint: Post

  """Reads a single \`Post\` that is related to this \`Type\`."""
  postById: Post
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
  smallint: Int
  bigint: BigInt
  numeric: BigFloat
  decimal: BigFloat
  boolean: Boolean
  varchar: String
  enum: Color
  enumArray: [Color]
  domain: AnInt
  domain2: AnotherInt
  textArray: [String]
  json: JSON
  jsonb: JSON
  jsonpath: JSONPath
  nullableRange: BigFloatRangeInput
  numrange: BigFloatRangeInput
  daterange: DateRangeInput
  anIntRange: AnIntRangeInput
  timestamp: Datetime
  timestamptz: Datetime
  date: Date
  time: Time
  timetz: Time
  interval: IntervalInput
  intervalArray: [IntervalInput]
  money: Float
  compoundType: CompoundTypeInput
  nestedCompoundType: NestedCompoundTypeInput
  nullableCompoundType: CompoundTypeInput
  nullableNestedCompoundType: NestedCompoundTypeInput
  point: PointInput
  nullablePoint: PointInput
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

"""The output of our delete \`Input\` mutation."""
type DeleteInputPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Input\` that was deleted by this mutation."""
  input: Input
  deletedInputId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Input\`. May be used by Relay 1."""
  inputEdge(
    """The method to use when ordering \`Input\`."""
    orderBy: [InputsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): InputsEdge
}

"""All input for the \`deleteInput\` mutation."""
input DeleteInputInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Input\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteInputById\` mutation."""
input DeleteInputByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!
}

"""The output of our delete \`Patch\` mutation."""
type DeletePatchPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Patch\` that was deleted by this mutation."""
  patch: Patch
  deletedPatchId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Patch\`. May be used by Relay 1."""
  patchEdge(
    """The method to use when ordering \`Patch\`."""
    orderBy: [PatchesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PatchesEdge
}

"""All input for the \`deletePatch\` mutation."""
input DeletePatchInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Patch\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deletePatchById\` mutation."""
input DeletePatchByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!
}

"""The output of our delete \`Reserved\` mutation."""
type DeleteReservedPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Reserved\` that was deleted by this mutation."""
  reserved: Reserved
  deletedReservedId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Reserved\`. May be used by Relay 1."""
  reservedEdge(
    """The method to use when ordering \`Reserved\`."""
    orderBy: [ReservedsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ReservedsEdge
}

"""All input for the \`deleteReserved\` mutation."""
input DeleteReservedInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Reserved\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteReservedById\` mutation."""
input DeleteReservedByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!
}

"""The output of our delete \`ReservedPatchRecord\` mutation."""
type DeleteReservedPatchRecordPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`ReservedPatchRecord\` that was deleted by this mutation."""
  reservedPatchRecord: ReservedPatchRecord
  deletedReservedPatchId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`ReservedPatchRecord\`. May be used by Relay 1."""
  reservedPatchRecordEdge(
    """The method to use when ordering \`ReservedPatchRecord\`."""
    orderBy: [ReservedPatchRecordsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ReservedPatchRecordsEdge
}

"""All input for the \`deleteReservedPatchRecord\` mutation."""
input DeleteReservedPatchRecordInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`ReservedPatchRecord\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteReservedPatchRecordById\` mutation."""
input DeleteReservedPatchRecordByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!
}

"""The output of our delete \`ReservedInputRecord\` mutation."""
type DeleteReservedInputRecordPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`ReservedInputRecord\` that was deleted by this mutation."""
  reservedInputRecord: ReservedInputRecord
  deletedReservedInputId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`ReservedInputRecord\`. May be used by Relay 1."""
  reservedInputRecordEdge(
    """The method to use when ordering \`ReservedInputRecord\`."""
    orderBy: [ReservedInputRecordsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ReservedInputRecordsEdge
}

"""All input for the \`deleteReservedInputRecord\` mutation."""
input DeleteReservedInputRecordInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`ReservedInputRecord\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteReservedInputRecordById\` mutation."""
input DeleteReservedInputRecordByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!
}

"""The output of our delete \`DefaultValue\` mutation."""
type DeleteDefaultValuePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`DefaultValue\` that was deleted by this mutation."""
  defaultValue: DefaultValue
  deletedDefaultValueId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`DefaultValue\`. May be used by Relay 1."""
  defaultValueEdge(
    """The method to use when ordering \`DefaultValue\`."""
    orderBy: [DefaultValuesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): DefaultValuesEdge
}

"""All input for the \`deleteDefaultValue\` mutation."""
input DeleteDefaultValueInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`DefaultValue\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteDefaultValueById\` mutation."""
input DeleteDefaultValueByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!
}

"""The output of our delete \`NoPrimaryKey\` mutation."""
type DeleteNoPrimaryKeyPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`NoPrimaryKey\` that was deleted by this mutation."""
  noPrimaryKey: NoPrimaryKey

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`deleteNoPrimaryKeyById\` mutation."""
input DeleteNoPrimaryKeyByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!
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

"""The output of our delete \`ViewTable\` mutation."""
type DeleteViewTablePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`ViewTable\` that was deleted by this mutation."""
  viewTable: ViewTable
  deletedViewTableId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`ViewTable\`. May be used by Relay 1."""
  viewTableEdge(
    """The method to use when ordering \`ViewTable\`."""
    orderBy: [ViewTablesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ViewTablesEdge
}

"""All input for the \`deleteViewTable\` mutation."""
input DeleteViewTableInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`ViewTable\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteViewTableById\` mutation."""
input DeleteViewTableByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!
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

"""The output of our delete \`SimilarTable1\` mutation."""
type DeleteSimilarTable1Payload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`SimilarTable1\` that was deleted by this mutation."""
  similarTable1: SimilarTable1
  deletedSimilarTable1Id: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`SimilarTable1\`. May be used by Relay 1."""
  similarTable1Edge(
    """The method to use when ordering \`SimilarTable1\`."""
    orderBy: [SimilarTable1SOrderBy!]! = [PRIMARY_KEY_ASC]
  ): SimilarTable1SEdge
}

"""All input for the \`deleteSimilarTable1\` mutation."""
input DeleteSimilarTable1Input {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`SimilarTable1\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteSimilarTable1ById\` mutation."""
input DeleteSimilarTable1ByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!
}

"""The output of our delete \`SimilarTable2\` mutation."""
type DeleteSimilarTable2Payload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`SimilarTable2\` that was deleted by this mutation."""
  similarTable2: SimilarTable2
  deletedSimilarTable2Id: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`SimilarTable2\`. May be used by Relay 1."""
  similarTable2Edge(
    """The method to use when ordering \`SimilarTable2\`."""
    orderBy: [SimilarTable2SOrderBy!]! = [PRIMARY_KEY_ASC]
  ): SimilarTable2SEdge
}

"""All input for the \`deleteSimilarTable2\` mutation."""
input DeleteSimilarTable2Input {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`SimilarTable2\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteSimilarTable2ById\` mutation."""
input DeleteSimilarTable2ByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!
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

"""The output of our delete \`Post\` mutation."""
type DeletePostPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Post\` that was deleted by this mutation."""
  post: Post
  deletedPostId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Post\`. May be used by Relay 1."""
  postEdge(
    """The method to use when ordering \`Post\`."""
    orderBy: [PostsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PostsEdge

  """Reads a single \`Person\` that is related to this \`Post\`."""
  personByAuthorId: Person
}

"""All input for the \`deletePost\` mutation."""
input DeletePostInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Post\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deletePostById\` mutation."""
input DeletePostByIdInput {
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
}

"""The output of our delete \`List\` mutation."""
type DeleteListPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`List\` that was deleted by this mutation."""
  list: List
  deletedListId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`List\`. May be used by Relay 1."""
  listEdge(
    """The method to use when ordering \`List\`."""
    orderBy: [ListsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ListsEdge
}

"""All input for the \`deleteList\` mutation."""
input DeleteListInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`List\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteListById\` mutation."""
input DeleteListByIdInput {
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

  """Reads a single \`Post\` that is related to this \`Type\`."""
  postBySmallint: Post

  """Reads a single \`Post\` that is related to this \`Type\`."""
  postById: Post
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
      add1Query($root, args, _info) {
        const selectArgs = makeArgs_add_1_query(args);
        return resource_add_1_queryPgResource.execute(selectArgs);
      },
      add2Query($root, args, _info) {
        const selectArgs = makeArgs_add_2_query(args);
        return resource_add_2_queryPgResource.execute(selectArgs);
      },
      add3Query($root, args, _info) {
        const selectArgs = makeArgs_add_3_query(args);
        return resource_add_3_queryPgResource.execute(selectArgs);
      },
      add4Query($root, args, _info) {
        const selectArgs = makeArgs_add_4_query(args);
        return resource_add_4_queryPgResource.execute(selectArgs);
      },
      allCompoundKeys: {
        plan() {
          return connection(resource_compound_keyPgResource.find());
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
      allDefaultValues: {
        plan() {
          return connection(resource_default_valuePgResource.find());
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
      allEdgeCases: {
        plan() {
          return connection(resource_edge_casePgResource.find());
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
      allForeignKeys: {
        plan() {
          return connection(resource_foreign_keyPgResource.find());
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
      allInputs: {
        plan() {
          return connection(resource_inputsPgResource.find());
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
      allIssue756S: {
        plan() {
          return connection(resource_issue756PgResource.find());
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
      allLeftArms: {
        plan() {
          return connection(resource_left_armPgResource.find());
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
      allLists: {
        plan() {
          return connection(resource_listsPgResource.find());
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
      allMyTables: {
        plan() {
          return connection(resource_my_tablePgResource.find());
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
      allNonUpdatableViews: {
        plan() {
          return connection(resource_non_updatable_viewPgResource.find());
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
      allNoPrimaryKeys: {
        plan() {
          return connection(resource_no_primary_keyPgResource.find());
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
      allNullTestRecords: {
        plan() {
          return connection(resource_null_test_recordPgResource.find());
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
      allPatches: {
        plan() {
          return connection(resource_patchsPgResource.find());
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
      allPeople: {
        plan() {
          return connection(resource_personPgResource.find());
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
      allPersonSecrets: {
        plan() {
          return connection(resource_person_secretPgResource.find());
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
      allPosts: {
        plan() {
          return connection(resource_postPgResource.find());
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
      allReservedInputRecords: {
        plan() {
          return connection(resource_reserved_inputPgResource.find());
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
      allReservedPatchRecords: {
        plan() {
          return connection(resource_reservedPatchsPgResource.find());
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
      allReserveds: {
        plan() {
          return connection(resource_reservedPgResource.find());
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
      allSimilarTable1S: {
        plan() {
          return connection(resource_similar_table_1PgResource.find());
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
      allSimilarTable2S: {
        plan() {
          return connection(resource_similar_table_2PgResource.find());
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
      allTestviews: {
        plan() {
          return connection(resource_testviewPgResource.find());
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
      allUpdatableViews: {
        plan() {
          return connection(resource_updatable_viewPgResource.find());
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
      allViewTables: {
        plan() {
          return connection(resource_view_tablePgResource.find());
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
      badlyBehavedFunction: {
        plan($parent, args, info) {
          const $select = badly_behaved_function_getSelectPlanFromParentAndArgs($parent, args, info);
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
      compoundTypeArrayQuery($root, args, _info) {
        const selectArgs = makeArgs_compound_type_array_query(args);
        return resource_compound_type_array_queryPgResource.execute(selectArgs);
      },
      compoundTypeQuery($root, args, _info) {
        const selectArgs = makeArgs_compound_type_query(args);
        return resource_compound_type_queryPgResource.execute(selectArgs);
      },
      compoundTypeSetQuery: {
        plan($parent, args, info) {
          const $select = compound_type_set_query_getSelectPlanFromParentAndArgs($parent, args, info);
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
      currentUserId($root, args, _info) {
        const selectArgs = makeArgs_person_computed_out(args);
        return resource_current_user_idPgResource.execute(selectArgs);
      },
      defaultValue(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_DefaultValue($nodeId);
      },
      defaultValueById(_$root, {
        $id
      }) {
        return resource_default_valuePgResource.get({
          id: $id
        });
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
      funcOutComplexSetof: {
        plan($parent, args, info) {
          const $select = func_out_complex_setof_getSelectPlanFromParentAndArgs($parent, args, info);
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
      funcOutOut($root, args, _info) {
        const selectArgs = makeArgs_person_computed_out(args);
        return resource_func_out_outPgResource.execute(selectArgs);
      },
      funcOutOutCompoundType($root, args, _info) {
        const selectArgs = makeArgs_func_out_out_compound_type(args);
        return resource_func_out_out_compound_typePgResource.execute(selectArgs);
      },
      funcOutOutSetof: {
        plan($parent, args, info) {
          const $select = func_out_out_setof_getSelectPlanFromParentAndArgs($parent, args, info);
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
      funcOutOutUnnamed($root, args, _info) {
        const selectArgs = makeArgs_person_computed_out(args);
        return resource_func_out_out_unnamedPgResource.execute(selectArgs);
      },
      funcOutSetof: {
        plan($parent, args, info) {
          const $select = func_out_setof_getSelectPlanFromParentAndArgs($parent, args, info);
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
      funcOutTable($root, args, _info) {
        const selectArgs = makeArgs_person_computed_out(args);
        return resource_func_out_tablePgResource.execute(selectArgs);
      },
      funcOutTableSetof: {
        plan($parent, args, info) {
          const $select = func_out_table_setof_getSelectPlanFromParentAndArgs($parent, args, info);
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
      funcOutUnnamed($root, args, _info) {
        const selectArgs = makeArgs_person_computed_out(args);
        return resource_func_out_unnamedPgResource.execute(selectArgs);
      },
      funcOutUnnamedOutOutUnnamed($root, args, _info) {
        const selectArgs = makeArgs_person_computed_out(args);
        return resource_func_out_unnamed_out_out_unnamedPgResource.execute(selectArgs);
      },
      funcReturnsTableMultiCol: {
        plan($parent, args, info) {
          const $select = func_returns_table_multi_col_getSelectPlanFromParentAndArgs($parent, args, info);
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
      funcReturnsTableOneCol: {
        plan($parent, args, info) {
          const $select = func_returns_table_one_col_getSelectPlanFromParentAndArgs($parent, args, info);
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
      input(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_Input($nodeId);
      },
      inputById(_$root, {
        $id
      }) {
        return resource_inputsPgResource.get({
          id: $id
        });
      },
      intSetQuery: {
        plan($parent, args, info) {
          const $select = int_set_query_getSelectPlanFromParentAndArgs($parent, args, info);
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
      list(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_List($nodeId);
      },
      listById(_$root, {
        $id
      }) {
        return resource_listsPgResource.get({
          id: $id
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
      noPrimaryKeyById(_$root, {
        $id
      }) {
        return resource_no_primary_keyPgResource.get({
          id: $id
        });
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
      optionalMissingMiddle1($root, args, _info) {
        const selectArgs = makeArgs_optional_missing_middle_1(args);
        return resource_optional_missing_middle_1PgResource.execute(selectArgs);
      },
      optionalMissingMiddle2($root, args, _info) {
        const selectArgs = makeArgs_optional_missing_middle_2(args);
        return resource_optional_missing_middle_2PgResource.execute(selectArgs);
      },
      optionalMissingMiddle3($root, args, _info) {
        const selectArgs = makeArgs_optional_missing_middle_3(args);
        return resource_optional_missing_middle_3PgResource.execute(selectArgs);
      },
      optionalMissingMiddle4($root, args, _info) {
        const selectArgs = makeArgs_optional_missing_middle_4(args);
        return resource_optional_missing_middle_4PgResource.execute(selectArgs);
      },
      optionalMissingMiddle5($root, args, _info) {
        const selectArgs = makeArgs_optional_missing_middle_5(args);
        return resource_optional_missing_middle_5PgResource.execute(selectArgs);
      },
      patch(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_Patch($nodeId);
      },
      patchById(_$root, {
        $id
      }) {
        return resource_patchsPgResource.get({
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
      post(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_Post($nodeId);
      },
      postById(_$root, {
        $id
      }) {
        return resource_postPgResource.get({
          id: $id
        });
      },
      query() {
        return rootValue();
      },
      queryCompoundTypeArray($root, args, _info) {
        const selectArgs = makeArgs_query_compound_type_array(args);
        return resource_query_compound_type_arrayPgResource.execute(selectArgs);
      },
      queryIntervalArray($root, args, _info) {
        const selectArgs = makeArgs_person_computed_out(args);
        return resource_query_interval_arrayPgResource.execute(selectArgs);
      },
      queryIntervalSet: {
        plan($parent, args, info) {
          const $select = query_interval_set_getSelectPlanFromParentAndArgs($parent, args, info);
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
      queryOutputTwoRows($root, args, _info) {
        const selectArgs = makeArgs_query_output_two_rows(args);
        return resource_query_output_two_rowsPgResource.execute(selectArgs);
      },
      queryTextArray($root, args, _info) {
        const selectArgs = makeArgs_person_computed_out(args);
        return resource_query_text_arrayPgResource.execute(selectArgs);
      },
      reserved(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_Reserved($nodeId);
      },
      reservedById(_$root, {
        $id
      }) {
        return resource_reservedPgResource.get({
          id: $id
        });
      },
      reservedInputRecord(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_ReservedInputRecord($nodeId);
      },
      reservedInputRecordById(_$root, {
        $id
      }) {
        return resource_reserved_inputPgResource.get({
          id: $id
        });
      },
      reservedPatchRecord(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_ReservedPatchRecord($nodeId);
      },
      reservedPatchRecordById(_$root, {
        $id
      }) {
        return resource_reservedPatchsPgResource.get({
          id: $id
        });
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
      similarTable1(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_SimilarTable1($nodeId);
      },
      similarTable1ById(_$root, {
        $id
      }) {
        return resource_similar_table_1PgResource.get({
          id: $id
        });
      },
      similarTable2(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_SimilarTable2($nodeId);
      },
      similarTable2ById(_$root, {
        $id
      }) {
        return resource_similar_table_2PgResource.get({
          id: $id
        });
      },
      staticBigInteger: {
        plan($parent, args, info) {
          const $select = static_big_integer_getSelectPlanFromParentAndArgs($parent, args, info);
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
      tableQuery($root, args, _info) {
        const selectArgs = makeArgs_table_query(args);
        return resource_table_queryPgResource.execute(selectArgs);
      },
      tableSetQuery: {
        plan($parent, args, info) {
          const $select = table_set_query_getSelectPlanFromParentAndArgs($parent, args, info);
          return connection($select);
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
      tableSetQueryPlpgsql: {
        plan($parent, args, info) {
          const $select = table_set_query_plpgsql_getSelectPlanFromParentAndArgs($parent, args, info);
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
      },
      typeFunction($root, args, _info) {
        const selectArgs = makeArgs_type_function(args);
        return resource_type_functionPgResource.execute(selectArgs);
      },
      typeFunctionConnection: {
        plan($parent, args, info) {
          const $select = type_function_connection_getSelectPlanFromParentAndArgs($parent, args, info);
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
      typeFunctionList($root, args, _info) {
        const selectArgs = makeArgs_person_computed_out(args);
        return resource_type_function_listPgResource.execute(selectArgs);
      },
      typesQuery($root, args, _info) {
        const selectArgs = makeArgs_types_query(args);
        return resource_types_queryPgResource.execute(selectArgs);
      },
      uniqueForeignKeyByCompoundKey1AndCompoundKey2(_$root, {
        $compoundKey1,
        $compoundKey2
      }) {
        return resource_unique_foreign_keyPgResource.get({
          compound_key_1: $compoundKey1,
          compound_key_2: $compoundKey2
        });
      },
      viewTable(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_ViewTable($nodeId);
      },
      viewTableById(_$root, {
        $id
      }) {
        return resource_view_tablePgResource.get({
          id: $id
        });
      }
    }
  },
  Mutation: {
    assertStep: __ValueStep,
    plans: {
      add1Mutation: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_add_1_mutation(args, ["input"]);
          const $result = resource_add_1_mutationPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      add2Mutation: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_add_2_mutation(args, ["input"]);
          const $result = resource_add_2_mutationPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      add3Mutation: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_add_3_mutation(args, ["input"]);
          const $result = resource_add_3_mutationPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      add4Mutation: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_add_4_mutation(args, ["input"]);
          const $result = resource_add_4_mutationPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      add4MutationError: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_add_4_mutation_error(args, ["input"]);
          const $result = resource_add_4_mutation_errorPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      authenticate: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_authenticate(args, ["input"]);
          const $result = resource_authenticatePgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      authenticateFail: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_person_computed_out(args, ["input"]);
          const $result = resource_authenticate_failPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      authenticateMany: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_authenticate_many(args, ["input"]);
          const $result = resource_authenticate_manyPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      authenticatePayload: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_authenticate_payload(args, ["input"]);
          const $result = resource_authenticate_payloadPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      compoundTypeArrayMutation: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_compound_type_array_mutation(args, ["input"]);
          const $result = resource_compound_type_array_mutationPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      compoundTypeMutation: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_compound_type_mutation(args, ["input"]);
          const $result = resource_compound_type_mutationPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      compoundTypeSetMutation: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_compound_type_set_mutation(args, ["input"]);
          const $result = resource_compound_type_set_mutationPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
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
      createDefaultValue: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_default_valuePgResource);
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
      createForeignKey: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_foreign_keyPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createInput: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_inputsPgResource);
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
      createList: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_listsPgResource);
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
      createNoPrimaryKey: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_no_primary_keyPgResource);
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
      createPatch: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_patchsPgResource);
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
      createPost: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_postPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createReserved: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_reservedPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createReservedInputRecord: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_reserved_inputPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createReservedPatchRecord: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_reservedPatchsPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createSimilarTable1: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_similar_table_1PgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createSimilarTable2: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_similar_table_2PgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createTestview: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_testviewPgResource);
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
      createUpdatableView: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_updatable_viewPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createViewTable: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_view_tablePgResource);
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
      deleteDefaultValue: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_default_valuePgResource, specFromArgs_DefaultValue(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteDefaultValueById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_default_valuePgResource, {
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
      deleteInput: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_inputsPgResource, specFromArgs_Input(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteInputById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_inputsPgResource, {
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
      deleteList: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_listsPgResource, specFromArgs_List(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteListById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_listsPgResource, {
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
      deleteNoPrimaryKeyById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_no_primary_keyPgResource, {
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
      deletePatch: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_patchsPgResource, specFromArgs_Patch(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deletePatchById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_patchsPgResource, {
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
      deletePost: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_postPgResource, specFromArgs_Post(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deletePostById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_postPgResource, {
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
      deleteReserved: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_reservedPgResource, specFromArgs_Reserved(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteReservedById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_reservedPgResource, {
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
      deleteReservedInputRecord: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_reserved_inputPgResource, specFromArgs_ReservedInputRecord(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteReservedInputRecordById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_reserved_inputPgResource, {
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
      deleteReservedPatchRecord: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_reservedPatchsPgResource, specFromArgs_ReservedPatchRecord(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteReservedPatchRecordById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_reservedPatchsPgResource, {
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
      deleteSimilarTable1: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_similar_table_1PgResource, specFromArgs_SimilarTable1(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteSimilarTable1ById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_similar_table_1PgResource, {
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
      deleteSimilarTable2: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_similar_table_2PgResource, specFromArgs_SimilarTable2(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteSimilarTable2ById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_similar_table_2PgResource, {
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
      deleteViewTable: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_view_tablePgResource, specFromArgs_ViewTable(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteViewTableById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_view_tablePgResource, {
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
      guidFn: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_guid_fn(args, ["input"]);
          const $result = resource_guid_fnPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
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
      listBdeMutation: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_list_bde_mutation(args, ["input"]);
          const $result = resource_list_bde_mutationPgResource.execute(selectArgs, "mutation");
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
      mult1: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_mult_1(args, ["input"]);
          const $result = resource_mult_1PgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      mult2: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_mult_2(args, ["input"]);
          const $result = resource_mult_2PgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      mult3: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_mult_3(args, ["input"]);
          const $result = resource_mult_3PgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      mult4: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_mult_4(args, ["input"]);
          const $result = resource_mult_4PgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      mutationCompoundTypeArray: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_mutation_compound_type_array(args, ["input"]);
          const $result = resource_mutation_compound_type_arrayPgResource.execute(selectArgs, "mutation");
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
      mutationIntervalArray: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_person_computed_out(args, ["input"]);
          const $result = resource_mutation_interval_arrayPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      mutationIntervalSet: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_person_computed_out(args, ["input"]);
          const $result = resource_mutation_interval_setPgResource.execute(selectArgs, "mutation");
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
      mutationTextArray: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_person_computed_out(args, ["input"]);
          const $result = resource_mutation_text_arrayPgResource.execute(selectArgs, "mutation");
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
      postMany: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_post_many(args, ["input"]);
          const $result = resource_post_manyPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      postWithSuffix: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_post_with_suffix(args, ["input"]);
          const $result = resource_post_with_suffixPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      returnVoidMutation: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_person_computed_out(args, ["input"]);
          const $result = resource_return_void_mutationPgResource.execute(selectArgs, "mutation");
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
      typeFunctionConnectionMutation: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_person_computed_out(args, ["input"]);
          const $result = resource_type_function_connection_mutationPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      typeFunctionListMutation: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_person_computed_out(args, ["input"]);
          const $result = resource_type_function_list_mutationPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      typeFunctionMutation: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_type_function_mutation(args, ["input"]);
          const $result = resource_type_function_mutationPgResource.execute(selectArgs, "mutation");
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
      updateDefaultValue: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_default_valuePgResource, specFromArgs_DefaultValue(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateDefaultValueById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_default_valuePgResource, {
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
      updateInput: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_inputsPgResource, specFromArgs_Input(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateInputById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_inputsPgResource, {
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
      updateList: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_listsPgResource, specFromArgs_List(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateListById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_listsPgResource, {
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
      updateNoPrimaryKeyById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_no_primary_keyPgResource, {
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
      updatePatch: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_patchsPgResource, specFromArgs_Patch(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updatePatchById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_patchsPgResource, {
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
      },
      updatePost: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_postPgResource, specFromArgs_Post(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updatePostById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_postPgResource, {
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
      updateReserved: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_reservedPgResource, specFromArgs_Reserved(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateReservedById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_reservedPgResource, {
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
      updateReservedInputRecord: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_reserved_inputPgResource, specFromArgs_ReservedInputRecord(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateReservedInputRecordById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_reserved_inputPgResource, {
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
      updateReservedPatchRecord: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_reservedPatchsPgResource, specFromArgs_ReservedPatchRecord(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateReservedPatchRecordById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_reservedPatchsPgResource, {
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
      updateSimilarTable1: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_similar_table_1PgResource, specFromArgs_SimilarTable1(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateSimilarTable1ById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_similar_table_1PgResource, {
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
      updateSimilarTable2: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_similar_table_2PgResource, specFromArgs_SimilarTable2(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateSimilarTable2ById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_similar_table_2PgResource, {
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
      },
      updateViewTable: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_view_tablePgResource, specFromArgs_ViewTable(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateViewTableById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_view_tablePgResource, {
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
  Add1MutationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      integer: planCustomMutationPayloadResult,
      query: queryPlan
    }
  },
  Add2MutationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      integer: planCustomMutationPayloadResult,
      query: queryPlan
    }
  },
  Add3MutationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      integer: planCustomMutationPayloadResult,
      query: queryPlan
    }
  },
  Add4MutationErrorPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      integer: planCustomMutationPayloadResult,
      query: queryPlan
    }
  },
  Add4MutationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      integer: planCustomMutationPayloadResult,
      query: queryPlan
    }
  },
  AuthenticateFailPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      jwtToken: planCustomMutationPayloadResult,
      query: queryPlan
    }
  },
  AuthenticateManyPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      jwtTokens: planCustomMutationPayloadResult,
      query: queryPlan
    }
  },
  AuthenticatePayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      jwtToken: planCustomMutationPayloadResult,
      query: queryPlan
    }
  },
  AuthenticatePayloadPayload: {
    assertStep: ObjectStep,
    plans: {
      authPayload: planCustomMutationPayloadResult,
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      personById($record) {
        return resource_personPgResource.get({
          id: $record.get("result").get("id")
        });
      },
      query: queryPlan
    }
  },
  AuthPayload: {
    assertStep: assertPgClassSingleStep,
    plans: {
      jwt($record) {
        const $plan = $record.get("jwt");
        const $select = pgSelectSingleFromRecord(resource_frmcdc_jwtTokenPgResource, $plan);
        $select.getClassStep().setTrusted();
        return $select;
      },
      personById($record) {
        return resource_personPgResource.get({
          id: $record.get("id")
        });
      }
    }
  },
  CompoundKey: {
    assertStep: assertPgClassSingleStep,
    plans: {
      foreignKeysByCompoundKey1AndCompoundKey2: {
        plan($record) {
          const $records = resource_foreign_keyPgResource.find({
            compound_key_1: $record.get("person_id_1"),
            compound_key_2: $record.get("person_id_2")
          });
          return connection($records);
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
      },
      uniqueForeignKeyByCompoundKey1AndCompoundKey2($record) {
        return resource_unique_foreign_keyPgResource.get({
          compound_key_1: $record.get("person_id_1"),
          compound_key_2: $record.get("person_id_2")
        });
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
  CompoundKeysConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
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
  CompoundTypeArrayMutationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      compoundTypes: planCustomMutationPayloadResult,
      query: queryPlan
    }
  },
  CompoundTypeMutationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      compoundType: planCustomMutationPayloadResult,
      query: queryPlan
    }
  },
  CompoundTypesConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  CompoundTypeSetMutationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      compoundTypes: planCustomMutationPayloadResult,
      query: queryPlan
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
      compoundKeyEdge: CreateCompoundKeyPayload_compoundKeyEdgePlan,
      personByPersonId1: CreateCompoundKeyPayload_personByPersonId1Plan,
      personByPersonId2: CreateCompoundKeyPayload_personByPersonId2Plan,
      query: queryPlan
    }
  },
  CreateDefaultValuePayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      defaultValue: planCreatePayloadResult,
      defaultValueEdge: CreateDefaultValuePayload_defaultValueEdgePlan,
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
  CreateForeignKeyPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      compoundKeyByCompoundKey1AndCompoundKey2($record) {
        return resource_compound_keyPgResource.get({
          person_id_1: $record.get("result").get("compound_key_1"),
          person_id_2: $record.get("result").get("compound_key_2")
        });
      },
      foreignKey: planCreatePayloadResult,
      personByPersonId: LeftArmIdentityPayload_personByPersonIdPlan,
      query: queryPlan
    }
  },
  CreateInputPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      input: planCreatePayloadResult,
      inputEdge: CreateInputPayload_inputEdgePlan,
      query: queryPlan
    }
  },
  CreateIssue756Payload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      issue756: planCreatePayloadResult,
      issue756Edge: Issue756MutationPayload_issue756EdgePlan,
      query: queryPlan
    }
  },
  CreateLeftArmPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      leftArm: planCreatePayloadResult,
      leftArmEdge: LeftArmIdentityPayload_leftArmEdgePlan,
      personByPersonId: LeftArmIdentityPayload_personByPersonIdPlan,
      query: queryPlan
    }
  },
  CreateListPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      list: planCreatePayloadResult,
      listEdge: CreateListPayload_listEdgePlan,
      query: queryPlan
    }
  },
  CreateMyTablePayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      myTable: planCreatePayloadResult,
      myTableEdge: CreateMyTablePayload_myTableEdgePlan,
      query: queryPlan
    }
  },
  CreateNoPrimaryKeyPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      noPrimaryKey: planCreatePayloadResult,
      query: queryPlan
    }
  },
  CreateNullTestRecordPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      nullTestRecord: planCreatePayloadResult,
      nullTestRecordEdge: CreateNullTestRecordPayload_nullTestRecordEdgePlan,
      query: queryPlan
    }
  },
  CreatePatchPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      patch: planCreatePayloadResult,
      patchEdge: CreatePatchPayload_patchEdgePlan,
      query: queryPlan
    }
  },
  CreatePersonPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      person: planCreatePayloadResult,
      personEdge: MutationOutTablePayload_personEdgePlan,
      query: queryPlan
    }
  },
  CreatePersonSecretPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      personByPersonId: LeftArmIdentityPayload_personByPersonIdPlan,
      personSecret: planCreatePayloadResult,
      personSecretEdge: CreatePersonSecretPayload_personSecretEdgePlan,
      query: queryPlan
    }
  },
  CreatePostPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      personByAuthorId: TableMutationPayload_personByAuthorIdPlan,
      post: planCreatePayloadResult,
      postEdge: TableMutationPayload_postEdgePlan,
      query: queryPlan
    }
  },
  CreateReservedInputRecordPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan,
      reservedInputRecord: planCreatePayloadResult,
      reservedInputRecordEdge: CreateReservedInputRecordPayload_reservedInputRecordEdgePlan
    }
  },
  CreateReservedPatchRecordPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan,
      reservedPatchRecord: planCreatePayloadResult,
      reservedPatchRecordEdge: CreateReservedPatchRecordPayload_reservedPatchRecordEdgePlan
    }
  },
  CreateReservedPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan,
      reserved: planCreatePayloadResult,
      reservedEdge: CreateReservedPayload_reservedEdgePlan
    }
  },
  CreateSimilarTable1Payload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan,
      similarTable1: planCreatePayloadResult,
      similarTable1Edge: CreateSimilarTable1Payload_similarTable1EdgePlan
    }
  },
  CreateSimilarTable2Payload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan,
      similarTable2: planCreatePayloadResult,
      similarTable2Edge: CreateSimilarTable2Payload_similarTable2EdgePlan
    }
  },
  CreateTestviewPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan,
      testview: planCreatePayloadResult
    }
  },
  CreateTypePayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      postById: TypeFunctionMutationPayload_postByIdPlan,
      postBySmallint: TypeFunctionMutationPayload_postBySmallintPlan,
      query: queryPlan,
      type: planCreatePayloadResult,
      typeEdge: TypeFunctionMutationPayload_typeEdgePlan
    }
  },
  CreateUpdatableViewPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan,
      updatableView: planCreatePayloadResult
    }
  },
  CreateViewTablePayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan,
      viewTable: planCreatePayloadResult,
      viewTableEdge: CreateViewTablePayload_viewTableEdgePlan
    }
  },
  DefaultValue: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nodeId($parent) {
        const specifier = nodeIdHandler_DefaultValue.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_DefaultValue.codec.name].encode);
      },
      nullValue($record) {
        return $record.get("null_value");
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of default_valueUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_default_valuePgResource.get(spec);
    }
  },
  DefaultValuesConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  DeleteCompoundKeyPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      compoundKey: planCreatePayloadResult,
      compoundKeyEdge: CreateCompoundKeyPayload_compoundKeyEdgePlan,
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
  DeleteDefaultValuePayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      defaultValue: planCreatePayloadResult,
      defaultValueEdge: CreateDefaultValuePayload_defaultValueEdgePlan,
      deletedDefaultValueId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_DefaultValue.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      query: queryPlan
    }
  },
  DeleteInputPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedInputId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Input.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      input: planCreatePayloadResult,
      inputEdge: CreateInputPayload_inputEdgePlan,
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
      issue756Edge: Issue756MutationPayload_issue756EdgePlan,
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
      leftArmEdge: LeftArmIdentityPayload_leftArmEdgePlan,
      personByPersonId: LeftArmIdentityPayload_personByPersonIdPlan,
      query: queryPlan
    }
  },
  DeleteListPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedListId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_List.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      list: planCreatePayloadResult,
      listEdge: CreateListPayload_listEdgePlan,
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
      myTableEdge: CreateMyTablePayload_myTableEdgePlan,
      query: queryPlan
    }
  },
  DeleteNoPrimaryKeyPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      noPrimaryKey: planCreatePayloadResult,
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
      nullTestRecordEdge: CreateNullTestRecordPayload_nullTestRecordEdgePlan,
      query: queryPlan
    }
  },
  DeletePatchPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedPatchId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Patch.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      patch: planCreatePayloadResult,
      patchEdge: CreatePatchPayload_patchEdgePlan,
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
      personEdge: MutationOutTablePayload_personEdgePlan,
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
      personSecretEdge: CreatePersonSecretPayload_personSecretEdgePlan,
      query: queryPlan
    }
  },
  DeletePostPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedPostId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Post.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      personByAuthorId: TableMutationPayload_personByAuthorIdPlan,
      post: planCreatePayloadResult,
      postEdge: TableMutationPayload_postEdgePlan,
      query: queryPlan
    }
  },
  DeleteReservedInputRecordPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedReservedInputId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_ReservedInputRecord.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      query: queryPlan,
      reservedInputRecord: planCreatePayloadResult,
      reservedInputRecordEdge: CreateReservedInputRecordPayload_reservedInputRecordEdgePlan
    }
  },
  DeleteReservedPatchRecordPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedReservedPatchId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_ReservedPatchRecord.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      query: queryPlan,
      reservedPatchRecord: planCreatePayloadResult,
      reservedPatchRecordEdge: CreateReservedPatchRecordPayload_reservedPatchRecordEdgePlan
    }
  },
  DeleteReservedPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedReservedId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Reserved.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      query: queryPlan,
      reserved: planCreatePayloadResult,
      reservedEdge: CreateReservedPayload_reservedEdgePlan
    }
  },
  DeleteSimilarTable1Payload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedSimilarTable1Id($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_SimilarTable1.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      query: queryPlan,
      similarTable1: planCreatePayloadResult,
      similarTable1Edge: CreateSimilarTable1Payload_similarTable1EdgePlan
    }
  },
  DeleteSimilarTable2Payload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedSimilarTable2Id($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_SimilarTable2.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      query: queryPlan,
      similarTable2: planCreatePayloadResult,
      similarTable2Edge: CreateSimilarTable2Payload_similarTable2EdgePlan
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
      postById: TypeFunctionMutationPayload_postByIdPlan,
      postBySmallint: TypeFunctionMutationPayload_postBySmallintPlan,
      query: queryPlan,
      type: planCreatePayloadResult,
      typeEdge: TypeFunctionMutationPayload_typeEdgePlan
    }
  },
  DeleteViewTablePayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedViewTableId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_ViewTable.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      query: queryPlan,
      viewTable: planCreatePayloadResult,
      viewTableEdge: CreateViewTablePayload_viewTableEdgePlan
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
  EdgeCasesConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  ForeignKey: {
    assertStep: assertPgClassSingleStep,
    plans: {
      compoundKey1: UniqueForeignKey_compoundKey1Plan,
      compoundKey2: UniqueForeignKey_compoundKey2Plan,
      compoundKeyByCompoundKey1AndCompoundKey2: UniqueForeignKey_compoundKeyByCompoundKey1AndCompoundKey2Plan,
      personByPersonId: ForeignKey_personByPersonIdPlan,
      personId: ForeignKey_personIdPlan
    }
  },
  ForeignKeysConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  FuncOutComplexRecord: {
    assertStep: assertPgClassSingleStep,
    plans: {
      y: PersonComputedComplexRecord_yPlan,
      z: PersonComputedComplexRecord_zPlan
    }
  },
  FuncOutComplexSetofConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
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
  FuncOutOutSetofConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
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
  FuncOutSetofConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  FuncOutUnnamedOutOutUnnamedRecord: {
    assertStep: assertPgClassSingleStep,
    plans: {
      arg1: FuncOutOutUnnamedRecord_arg1Plan,
      arg3: FuncOutUnnamedOutOutUnnamedRecord_arg3Plan
    }
  },
  FuncReturnsTableMultiColConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  FuncReturnsTableMultiColRecord: {
    assertStep: assertPgClassSingleStep
  },
  FuncReturnsTableOneColConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  GuidFnPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      guid: planCustomMutationPayloadResult,
      query: queryPlan
    }
  },
  Input: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nodeId($parent) {
        const specifier = nodeIdHandler_Input.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Input.codec.name].encode);
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of inputsUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_inputsPgResource.get(spec);
    }
  },
  InputsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
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
  IntSetQueryConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
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
      issue756Edge: Issue756MutationPayload_issue756EdgePlan,
      query: queryPlan
    }
  },
  Issue756SConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
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
  JwtToken: {
    assertStep: assertPgClassSingleStep
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
      personByPersonId: ForeignKey_personByPersonIdPlan,
      personId: ForeignKey_personIdPlan
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
      leftArmEdge: LeftArmIdentityPayload_leftArmEdgePlan,
      personByPersonId: LeftArmIdentityPayload_personByPersonIdPlan,
      query: queryPlan
    }
  },
  LeftArmsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  List: {
    assertStep: assertPgClassSingleStep,
    plans: {
      byteaArray: Type_byteaArrayPlan,
      byteaArrayNn($record) {
        return $record.get("bytea_array_nn");
      },
      compoundTypeArray($record) {
        const $val = $record.get("compound_type_array");
        const $select = pgSelectFromRecords(resource_frmcdc_compoundTypePgResource, $val);
        $select.setTrusted();
        return $select;
      },
      compoundTypeArrayNn($record) {
        const $val = $record.get("compound_type_array_nn");
        const $select = pgSelectFromRecords(resource_frmcdc_compoundTypePgResource, $val);
        $select.setTrusted();
        return $select;
      },
      dateArray($record) {
        return $record.get("date_array");
      },
      dateArrayNn($record) {
        return $record.get("date_array_nn");
      },
      enumArray: Type_enumArrayPlan,
      enumArrayNn($record) {
        return $record.get("enum_array_nn");
      },
      intArray($record) {
        return $record.get("int_array");
      },
      intArrayNn($record) {
        return $record.get("int_array_nn");
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_List.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_List.codec.name].encode);
      },
      timestamptzArray($record) {
        return $record.get("timestamptz_array");
      },
      timestamptzArrayNn($record) {
        return $record.get("timestamptz_array_nn");
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of listsUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_listsPgResource.get(spec);
    }
  },
  ListBdeMutationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      uuids: planCustomMutationPayloadResult
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
  ListsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  Mult1Payload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      integer: planCustomMutationPayloadResult,
      query: queryPlan
    }
  },
  Mult2Payload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      integer: planCustomMutationPayloadResult,
      query: queryPlan
    }
  },
  Mult3Payload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      integer: planCustomMutationPayloadResult,
      query: queryPlan
    }
  },
  Mult4Payload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      integer: planCustomMutationPayloadResult,
      query: queryPlan
    }
  },
  MutationCompoundTypeArrayPayload: {
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
  MutationIntervalArrayPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      intervals: planCustomMutationPayloadResult,
      query: queryPlan
    }
  },
  MutationIntervalSetPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      intervals: planCustomMutationPayloadResult,
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
      personEdge: MutationOutTablePayload_personEdgePlan,
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
  MutationTextArrayPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      strings: planCustomMutationPayloadResult
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
  MyTablesConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
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
  NonUpdatableView: {
    assertStep: assertPgClassSingleStep,
    plans: {
      column($record) {
        return $record.get("?column?");
      }
    }
  },
  NonUpdatableViewsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  NoPrimaryKey: {
    assertStep: assertPgClassSingleStep,
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of no_primary_keyUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_no_primary_keyPgResource.get(spec);
    }
  },
  NoPrimaryKeysConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
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
  NullTestRecordsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  Patch: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nodeId($parent) {
        const specifier = nodeIdHandler_Patch.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Patch.codec.name].encode);
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of patchsUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_patchsPgResource.get(spec);
    }
  },
  PatchesConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
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
      compoundKeysByPersonId1: {
        plan($record) {
          const $records = resource_compound_keyPgResource.find({
            person_id_1: $record.get("id")
          });
          return connection($records);
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
      compoundKeysByPersonId2: {
        plan($record) {
          const $records = resource_compound_keyPgResource.find({
            person_id_2: $record.get("id")
          });
          return connection($records);
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
      foreignKeysByPersonId: {
        plan($record) {
          const $records = resource_foreign_keyPgResource.find({
            person_id: $record.get("id")
          });
          return connection($records);
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
      friends: {
        plan($parent, args, info) {
          const $select = person_friends_getSelectPlanFromParentAndArgs($parent, args, info);
          return connection($select);
        },
        args: {
          first: applyFirstArg,
          last: applyLastArg,
          offset: applyOffsetArg,
          before: applyBeforeArg,
          after: applyAfterArg,
          orderBy: applyOrderByArgToConnection
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
      postsByAuthorId: {
        plan($record) {
          const $records = resource_postPgResource.find({
            author_id: $record.get("id")
          });
          return connection($records);
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
      typeFunctionConnection: {
        plan($parent, args, info) {
          const $select = person_type_function_connection_getSelectPlanFromParentAndArgs($parent, args, info);
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
      personByPersonId: ForeignKey_personByPersonIdPlan,
      personId: ForeignKey_personIdPlan,
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
  PersonSecretsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
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
      },
      computedCompoundTypeArray($in, args, _info) {
        const details = pgFunctionArgumentsFromArgs($in, makeArgs_post_computed_compound_type_array(args));
        return resource_post_computed_compound_type_arrayPgResource.execute(details.selectArgs);
      },
      computedIntervalArray($in, args, _info) {
        return scalarComputed(resource_post_computed_interval_arrayPgResource, $in, makeArgs_person_computed_out(args));
      },
      computedIntervalSet: {
        plan($parent, args, info) {
          const $select = post_computed_interval_set_getSelectPlanFromParentAndArgs($parent, args, info);
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
      computedTextArray($in, args, _info) {
        return scalarComputed(resource_post_computed_text_arrayPgResource, $in, makeArgs_person_computed_out(args));
      },
      computedWithOptionalArg($in, args, _info) {
        return scalarComputed(resource_post_computed_with_optional_argPgResource, $in, makeArgs_post_computed_with_optional_arg(args));
      },
      computedWithRequiredArg($in, args, _info) {
        return scalarComputed(resource_post_computed_with_required_argPgResource, $in, makeArgs_post_computed_with_required_arg(args));
      },
      headlineTrimmed($in, args, _info) {
        return scalarComputed(resource_post_headline_trimmedPgResource, $in, makeArgs_post_headline_trimmed(args));
      },
      headlineTrimmedNoDefaults($in, args, _info) {
        return scalarComputed(resource_post_headline_trimmed_no_defaultsPgResource, $in, makeArgs_post_headline_trimmed_no_defaults(args));
      },
      headlineTrimmedStrict($in, args, _info) {
        return scalarComputed(resource_post_headline_trimmed_strictPgResource, $in, makeArgs_post_headline_trimmed_strict(args));
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_Post.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Post.codec.name].encode);
      },
      personByAuthorId($record) {
        return resource_personPgResource.get({
          id: $record.get("author_id")
        });
      },
      typeById($record) {
        return resource_typesPgResource.get({
          id: $record.get("id")
        });
      },
      typesBySmallint: {
        plan($record) {
          const $records = resource_typesPgResource.find({
            smallint: $record.get("id")
          });
          return connection($records);
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
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of postUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_postPgResource.get(spec);
    }
  },
  PostComputedIntervalSetConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  PostManyPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      posts: planCustomMutationPayloadResult,
      query: queryPlan
    }
  },
  PostsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  PostWithSuffixPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      personByAuthorId: TableMutationPayload_personByAuthorIdPlan,
      post: planCustomMutationPayloadResult,
      postEdge: TableMutationPayload_postEdgePlan,
      query: queryPlan
    }
  },
  QueryIntervalSetConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
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
        const $select = pgSelectSingleFromRecord(resource_postPgResource, $plan);
        $select.getClassStep().setTrusted();
        return $select;
      }
    }
  },
  Reserved: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nodeId($parent) {
        const specifier = nodeIdHandler_Reserved.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Reserved.codec.name].encode);
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of reservedUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_reservedPgResource.get(spec);
    }
  },
  ReservedInputRecord: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nodeId($parent) {
        const specifier = nodeIdHandler_ReservedInputRecord.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_ReservedInputRecord.codec.name].encode);
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of reserved_inputUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_reserved_inputPgResource.get(spec);
    }
  },
  ReservedInputRecordsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  ReservedPatchRecord: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nodeId($parent) {
        const specifier = nodeIdHandler_ReservedPatchRecord.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_ReservedPatchRecord.codec.name].encode);
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of reservedPatchsUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_reservedPatchsPgResource.get(spec);
    }
  },
  ReservedPatchRecordsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  ReservedsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  ReturnVoidMutationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan
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
  SimilarTable1: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nodeId($parent) {
        const specifier = nodeIdHandler_SimilarTable1.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_SimilarTable1.codec.name].encode);
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of similar_table_1Uniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_similar_table_1PgResource.get(spec);
    }
  },
  SimilarTable1SConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  SimilarTable2: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nodeId($parent) {
        const specifier = nodeIdHandler_SimilarTable2.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_SimilarTable2.codec.name].encode);
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of similar_table_2Uniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_similar_table_2PgResource.get(spec);
    }
  },
  SimilarTable2SConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  StaticBigIntegerConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  TableMutationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      personByAuthorId: TableMutationPayload_personByAuthorIdPlan,
      post: planCustomMutationPayloadResult,
      postEdge: TableMutationPayload_postEdgePlan,
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
  Testview: {
    assertStep: assertPgClassSingleStep
  },
  TestviewsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  Type: {
    assertStep: assertPgClassSingleStep,
    plans: {
      anIntRange($record) {
        return $record.get("an_int_range");
      },
      byteaArray: Type_byteaArrayPlan,
      compoundType($record) {
        const $plan = $record.get("compound_type");
        const $select = pgSelectSingleFromRecord(resource_frmcdc_compoundTypePgResource, $plan);
        $select.coalesceToEmptyObject();
        $select.getClassStep().setTrusted();
        return $select;
      },
      enumArray: Type_enumArrayPlan,
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
      nodeId($parent) {
        const specifier = nodeIdHandler_Type.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Type.codec.name].encode);
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
      postById($record) {
        return resource_postPgResource.get({
          id: $record.get("id")
        });
      },
      postBySmallint($record) {
        return resource_postPgResource.get({
          id: $record.get("smallint")
        });
      },
      textArray($record) {
        return $record.get("text_array");
      },
      textArrayDomain($record) {
        return $record.get("text_array_domain");
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
  TypeFunctionConnectionMutationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      types: planCustomMutationPayloadResult
    }
  },
  TypeFunctionListMutationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      types: planCustomMutationPayloadResult
    }
  },
  TypeFunctionMutationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      postById: TypeFunctionMutationPayload_postByIdPlan,
      postBySmallint: TypeFunctionMutationPayload_postBySmallintPlan,
      query: queryPlan,
      type: planCustomMutationPayloadResult,
      typeEdge: TypeFunctionMutationPayload_typeEdgePlan
    }
  },
  TypesConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
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
  UniqueForeignKey: {
    assertStep: assertPgClassSingleStep,
    plans: {
      compoundKey1: UniqueForeignKey_compoundKey1Plan,
      compoundKey2: UniqueForeignKey_compoundKey2Plan,
      compoundKeyByCompoundKey1AndCompoundKey2: UniqueForeignKey_compoundKeyByCompoundKey1AndCompoundKey2Plan
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of unique_foreign_keyUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_unique_foreign_keyPgResource.get(spec);
    }
  },
  UpdatableView: {
    assertStep: assertPgClassSingleStep,
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of updatable_viewUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_updatable_viewPgResource.get(spec);
    }
  },
  UpdatableViewsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  UpdateCompoundKeyPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      compoundKey: planCreatePayloadResult,
      compoundKeyEdge: CreateCompoundKeyPayload_compoundKeyEdgePlan,
      personByPersonId1: CreateCompoundKeyPayload_personByPersonId1Plan,
      personByPersonId2: CreateCompoundKeyPayload_personByPersonId2Plan,
      query: queryPlan
    }
  },
  UpdateDefaultValuePayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      defaultValue: planCreatePayloadResult,
      defaultValueEdge: CreateDefaultValuePayload_defaultValueEdgePlan,
      query: queryPlan
    }
  },
  UpdateInputPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      input: planCreatePayloadResult,
      inputEdge: CreateInputPayload_inputEdgePlan,
      query: queryPlan
    }
  },
  UpdateIssue756Payload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      issue756: planCreatePayloadResult,
      issue756Edge: Issue756MutationPayload_issue756EdgePlan,
      query: queryPlan
    }
  },
  UpdateLeftArmPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      leftArm: planCreatePayloadResult,
      leftArmEdge: LeftArmIdentityPayload_leftArmEdgePlan,
      personByPersonId: LeftArmIdentityPayload_personByPersonIdPlan,
      query: queryPlan
    }
  },
  UpdateListPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      list: planCreatePayloadResult,
      listEdge: CreateListPayload_listEdgePlan,
      query: queryPlan
    }
  },
  UpdateMyTablePayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      myTable: planCreatePayloadResult,
      myTableEdge: CreateMyTablePayload_myTableEdgePlan,
      query: queryPlan
    }
  },
  UpdateNoPrimaryKeyPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      noPrimaryKey: planCreatePayloadResult,
      query: queryPlan
    }
  },
  UpdateNullTestRecordPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      nullTestRecord: planCreatePayloadResult,
      nullTestRecordEdge: CreateNullTestRecordPayload_nullTestRecordEdgePlan,
      query: queryPlan
    }
  },
  UpdatePatchPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      patch: planCreatePayloadResult,
      patchEdge: CreatePatchPayload_patchEdgePlan,
      query: queryPlan
    }
  },
  UpdatePersonPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      person: planCreatePayloadResult,
      personEdge: MutationOutTablePayload_personEdgePlan,
      query: queryPlan
    }
  },
  UpdatePersonSecretPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      personByPersonId: LeftArmIdentityPayload_personByPersonIdPlan,
      personSecret: planCreatePayloadResult,
      personSecretEdge: CreatePersonSecretPayload_personSecretEdgePlan,
      query: queryPlan
    }
  },
  UpdatePostPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      personByAuthorId: TableMutationPayload_personByAuthorIdPlan,
      post: planCreatePayloadResult,
      postEdge: TableMutationPayload_postEdgePlan,
      query: queryPlan
    }
  },
  UpdateReservedInputRecordPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan,
      reservedInputRecord: planCreatePayloadResult,
      reservedInputRecordEdge: CreateReservedInputRecordPayload_reservedInputRecordEdgePlan
    }
  },
  UpdateReservedPatchRecordPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan,
      reservedPatchRecord: planCreatePayloadResult,
      reservedPatchRecordEdge: CreateReservedPatchRecordPayload_reservedPatchRecordEdgePlan
    }
  },
  UpdateReservedPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan,
      reserved: planCreatePayloadResult,
      reservedEdge: CreateReservedPayload_reservedEdgePlan
    }
  },
  UpdateSimilarTable1Payload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan,
      similarTable1: planCreatePayloadResult,
      similarTable1Edge: CreateSimilarTable1Payload_similarTable1EdgePlan
    }
  },
  UpdateSimilarTable2Payload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan,
      similarTable2: planCreatePayloadResult,
      similarTable2Edge: CreateSimilarTable2Payload_similarTable2EdgePlan
    }
  },
  UpdateTypePayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      postById: TypeFunctionMutationPayload_postByIdPlan,
      postBySmallint: TypeFunctionMutationPayload_postBySmallintPlan,
      query: queryPlan,
      type: planCreatePayloadResult,
      typeEdge: TypeFunctionMutationPayload_typeEdgePlan
    }
  },
  UpdateViewTablePayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan,
      viewTable: planCreatePayloadResult,
      viewTableEdge: CreateViewTablePayload_viewTableEdgePlan
    }
  },
  ViewTable: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nodeId($parent) {
        const specifier = nodeIdHandler_ViewTable.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_ViewTable.codec.name].encode);
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of view_tableUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_view_tablePgResource.get(spec);
    }
  },
  ViewTablesConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
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
  Add1MutationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  Add2MutationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  Add3MutationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  Add4MutationErrorInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  Add4MutationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  AuthenticateFailInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  AuthenticateInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  AuthenticateManyInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  AuthenticatePayloadInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
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
  CompoundTypeArrayMutationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  CompoundTypeInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      a: CompoundTypeInput_aApply,
      b: CompoundTypeInput_bApply,
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
  CompoundTypeMutationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  CompoundTypeSetMutationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  ComptypeInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      isOptimised(obj, val, info) {
        obj.set("is_optimised", bakedInputRuntime(info.schema, info.field.type, val));
      },
      schedule(obj, val, info) {
        obj.set("schedule", bakedInputRuntime(info.schema, info.field.type, val));
      }
    }
  },
  CreateCompoundKeyInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      compoundKey: applyCreateFields
    }
  },
  CreateDefaultValueInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      defaultValue: applyCreateFields
    }
  },
  CreateEdgeCaseInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      edgeCase: applyCreateFields
    }
  },
  CreateForeignKeyInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      foreignKey: applyCreateFields
    }
  },
  CreateInputInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      input: applyCreateFields
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
  CreateListInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      list: applyCreateFields
    }
  },
  CreateMyTableInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      myTable: applyCreateFields
    }
  },
  CreateNoPrimaryKeyInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      noPrimaryKey: applyCreateFields
    }
  },
  CreateNullTestRecordInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      nullTestRecord: applyCreateFields
    }
  },
  CreatePatchInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      patch: applyCreateFields
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
  CreatePostInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      post: applyCreateFields
    }
  },
  CreateReservedInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      reserved: applyCreateFields
    }
  },
  CreateReservedInputRecordInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      reservedInputRecord: applyCreateFields
    }
  },
  CreateReservedPatchRecordInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      reservedPatchRecord: applyCreateFields
    }
  },
  CreateSimilarTable1Input: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      similarTable1: applyCreateFields
    }
  },
  CreateSimilarTable2Input: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      similarTable2: applyCreateFields
    }
  },
  CreateTestviewInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      testview: applyCreateFields
    }
  },
  CreateTypeInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      type: applyCreateFields
    }
  },
  CreateUpdatableViewInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      updatableView: applyCreateFields
    }
  },
  CreateViewTableInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      viewTable: applyCreateFields
    }
  },
  DefaultValueCondition: {
    plans: {
      id: TypeCondition_idApply,
      nullValue($condition, val) {
        return applyAttributeCondition("null_value", TYPES.text, $condition, val);
      }
    }
  },
  DefaultValueInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      id: LeftArmBaseInput_idApply,
      nullValue: DefaultValueInput_nullValueApply
    }
  },
  DefaultValuePatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      id: LeftArmBaseInput_idApply,
      nullValue: DefaultValueInput_nullValueApply
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
  DeleteDefaultValueByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeleteDefaultValueInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeleteInputByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeleteInputInput: {
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
  DeleteListByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeleteListInput: {
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
  DeleteNoPrimaryKeyByIdInput: {
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
  DeletePatchByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeletePatchInput: {
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
  DeletePostByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeletePostInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeleteReservedByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeleteReservedInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeleteReservedInputRecordByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeleteReservedInputRecordInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeleteReservedPatchRecordByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeleteReservedPatchRecordInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeleteSimilarTable1ByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeleteSimilarTable1Input: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeleteSimilarTable2ByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeleteSimilarTable2Input: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeleteTypeByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeleteTypeInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeleteViewTableByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeleteViewTableInput: {
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
  ForeignKeyCondition: {
    plans: {
      compoundKey1($condition, val) {
        return applyAttributeCondition("compound_key_1", TYPES.int, $condition, val);
      },
      compoundKey2($condition, val) {
        return applyAttributeCondition("compound_key_2", TYPES.int, $condition, val);
      },
      personId: ForeignKeyCondition_personIdApply
    }
  },
  ForeignKeyInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      compoundKey1(obj, val, info) {
        obj.set("compound_key_1", bakedInputRuntime(info.schema, info.field.type, val));
      },
      compoundKey2(obj, val, info) {
        obj.set("compound_key_2", bakedInputRuntime(info.schema, info.field.type, val));
      },
      personId: LeftArmBaseInput_personIdApply
    }
  },
  GuidFnInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  InputCondition: {
    plans: {
      id: TypeCondition_idApply
    }
  },
  InputInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      id: LeftArmBaseInput_idApply
    }
  },
  InputPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      id: LeftArmBaseInput_idApply
    }
  },
  IntSetMutationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  Issue756Condition: {
    plans: {
      id: TypeCondition_idApply,
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
      id: TypeCondition_idApply,
      lengthInMetres($condition, val) {
        return applyAttributeCondition("length_in_metres", TYPES.float, $condition, val);
      },
      mood($condition, val) {
        return applyAttributeCondition("mood", TYPES.text, $condition, val);
      },
      personId: ForeignKeyCondition_personIdApply
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
  ListBdeMutationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  ListCondition: {
    plans: {
      compoundTypeArray($condition, val) {
        return applyAttributeCondition("compound_type_array", compoundTypeArrayCodec, $condition, val);
      },
      compoundTypeArrayNn($condition, val) {
        return applyAttributeCondition("compound_type_array_nn", compoundTypeArrayCodec, $condition, val);
      },
      dateArray($condition, val) {
        return applyAttributeCondition("date_array", LIST_TYPES.date, $condition, val);
      },
      dateArrayNn($condition, val) {
        return applyAttributeCondition("date_array_nn", LIST_TYPES.date, $condition, val);
      },
      enumArray: TypeCondition_enumArrayApply,
      enumArrayNn($condition, val) {
        return applyAttributeCondition("enum_array_nn", colorArrayCodec, $condition, val);
      },
      id: TypeCondition_idApply,
      intArray($condition, val) {
        return applyAttributeCondition("int_array", LIST_TYPES.int, $condition, val);
      },
      intArrayNn($condition, val) {
        return applyAttributeCondition("int_array_nn", LIST_TYPES.int, $condition, val);
      },
      timestamptzArray($condition, val) {
        return applyAttributeCondition("timestamptz_array", LIST_TYPES.timestamptz, $condition, val);
      },
      timestamptzArrayNn($condition, val) {
        return applyAttributeCondition("timestamptz_array_nn", LIST_TYPES.timestamptz, $condition, val);
      }
    }
  },
  ListInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      byteaArray: ListInput_byteaArrayApply,
      byteaArrayNn: ListInput_byteaArrayNnApply,
      compoundTypeArray: ListInput_compoundTypeArrayApply,
      compoundTypeArrayNn: ListInput_compoundTypeArrayNnApply,
      dateArray: ListInput_dateArrayApply,
      dateArrayNn: ListInput_dateArrayNnApply,
      enumArray: ListInput_enumArrayApply,
      enumArrayNn: ListInput_enumArrayNnApply,
      id: LeftArmBaseInput_idApply,
      intArray: ListInput_intArrayApply,
      intArrayNn: ListInput_intArrayNnApply,
      timestamptzArray: ListInput_timestamptzArrayApply,
      timestamptzArrayNn: ListInput_timestamptzArrayNnApply
    }
  },
  ListOfCompoundTypesMutationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  ListPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      byteaArray: ListInput_byteaArrayApply,
      byteaArrayNn: ListInput_byteaArrayNnApply,
      compoundTypeArray: ListInput_compoundTypeArrayApply,
      compoundTypeArrayNn: ListInput_compoundTypeArrayNnApply,
      dateArray: ListInput_dateArrayApply,
      dateArrayNn: ListInput_dateArrayNnApply,
      enumArray: ListInput_enumArrayApply,
      enumArrayNn: ListInput_enumArrayNnApply,
      id: LeftArmBaseInput_idApply,
      intArray: ListInput_intArrayApply,
      intArrayNn: ListInput_intArrayNnApply,
      timestamptzArray: ListInput_timestamptzArrayApply,
      timestamptzArrayNn: ListInput_timestamptzArrayNnApply
    }
  },
  Mult1Input: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  Mult2Input: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  Mult3Input: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  Mult4Input: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  MutationCompoundTypeArrayInput: {
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
  MutationIntervalArrayInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  MutationIntervalSetInput: {
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
  MutationTextArrayInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  MyTableCondition: {
    plans: {
      id: TypeCondition_idApply,
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
  NestedCompoundTypeInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      a: CompoundTypeInput_aApply,
      b: CompoundTypeInput_bApply,
      bazBuz(obj, val, info) {
        obj.set("baz_buz", bakedInputRuntime(info.schema, info.field.type, val));
      }
    }
  },
  NoArgsMutationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  NonUpdatableViewCondition: {
    plans: {
      column($condition, val) {
        return applyAttributeCondition("?column?", TYPES.int, $condition, val);
      }
    }
  },
  NoPrimaryKeyCondition: {
    plans: {
      id: TypeCondition_idApply,
      str($condition, val) {
        return applyAttributeCondition("str", TYPES.text, $condition, val);
      }
    }
  },
  NoPrimaryKeyInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      id: LeftArmBaseInput_idApply,
      str: NoPrimaryKeyInput_strApply
    }
  },
  NoPrimaryKeyPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      id: LeftArmBaseInput_idApply,
      str: NoPrimaryKeyInput_strApply
    }
  },
  NullTestRecordCondition: {
    plans: {
      id: TypeCondition_idApply,
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
  PatchCondition: {
    plans: {
      id: TypeCondition_idApply
    }
  },
  PatchInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      id: LeftArmBaseInput_idApply
    }
  },
  PatchPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      id: LeftArmBaseInput_idApply
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
      id: TypeCondition_idApply,
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
      personId: ForeignKeyCondition_personIdApply,
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
  PostCondition: {
    plans: {
      authorId($condition, val) {
        return applyAttributeCondition("author_id", TYPES.int, $condition, val);
      },
      body($condition, val) {
        return applyAttributeCondition("body", TYPES.text, $condition, val);
      },
      comptypes($condition, val) {
        return applyAttributeCondition("comptypes", comptypeArrayCodec, $condition, val);
      },
      computedWithOptionalArg($condition, val) {
        if (val === undefined) return;
        if (typeof resource_post_computed_with_optional_argPgResource.from !== "function") {
          throw new Error("Invalid computed attribute 'from'");
        }
        const expression = sql`${resource_post_computed_with_optional_argPgResource.from({
          placeholder: $condition.alias
        })}`;
        $condition.where(val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, resource_post_computed_with_optional_argPgResource.codec)}`);
      },
      enums($condition, val) {
        return applyAttributeCondition("enums", anEnumArrayCodec, $condition, val);
      },
      headline($condition, val) {
        return applyAttributeCondition("headline", TYPES.text, $condition, val);
      },
      id: TypeCondition_idApply
    }
  },
  PostInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      authorId: PostInput_authorIdApply,
      body: PostInput_bodyApply,
      comptypes: PostInput_comptypesApply,
      enums: PostInput_enumsApply,
      headline: PostInput_headlineApply,
      id: LeftArmBaseInput_idApply
    }
  },
  PostManyInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  PostPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      authorId: PostInput_authorIdApply,
      body: PostInput_bodyApply,
      comptypes: PostInput_comptypesApply,
      enums: PostInput_enumsApply,
      headline: PostInput_headlineApply,
      id: LeftArmBaseInput_idApply
    }
  },
  PostWithSuffixInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  ReservedCondition: {
    plans: {
      id: TypeCondition_idApply
    }
  },
  ReservedInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      id: LeftArmBaseInput_idApply
    }
  },
  ReservedInputRecordCondition: {
    plans: {
      id: TypeCondition_idApply
    }
  },
  ReservedInputRecordInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      id: LeftArmBaseInput_idApply
    }
  },
  ReservedInputRecordPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      id: LeftArmBaseInput_idApply
    }
  },
  ReservedPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      id: LeftArmBaseInput_idApply
    }
  },
  ReservedPatchRecordCondition: {
    plans: {
      id: TypeCondition_idApply
    }
  },
  ReservedPatchRecordInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      id: LeftArmBaseInput_idApply
    }
  },
  ReservedPatchRecordPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      id: LeftArmBaseInput_idApply
    }
  },
  ReturnVoidMutationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  SimilarTable1Condition: {
    plans: {
      col1: TestviewCondition_col1Apply,
      col2: TestviewCondition_col2Apply,
      col3: SimilarTable1Condition_col3Apply,
      id: TypeCondition_idApply
    }
  },
  SimilarTable1Input: {
    baked: createObjectAndApplyChildren,
    plans: {
      col1: TestviewInput_col1Apply,
      col2: TestviewInput_col2Apply,
      col3: SimilarTable1Input_col3Apply,
      id: LeftArmBaseInput_idApply
    }
  },
  SimilarTable1Patch: {
    baked: createObjectAndApplyChildren,
    plans: {
      col1: TestviewInput_col1Apply,
      col2: TestviewInput_col2Apply,
      col3: SimilarTable1Input_col3Apply,
      id: LeftArmBaseInput_idApply
    }
  },
  SimilarTable2Condition: {
    plans: {
      col3: SimilarTable1Condition_col3Apply,
      col4($condition, val) {
        return applyAttributeCondition("col4", TYPES.int, $condition, val);
      },
      col5($condition, val) {
        return applyAttributeCondition("col5", TYPES.int, $condition, val);
      },
      id: TypeCondition_idApply
    }
  },
  SimilarTable2Input: {
    baked: createObjectAndApplyChildren,
    plans: {
      col3: SimilarTable1Input_col3Apply,
      col4: SimilarTable2Input_col4Apply,
      col5: SimilarTable2Input_col5Apply,
      id: LeftArmBaseInput_idApply
    }
  },
  SimilarTable2Patch: {
    baked: createObjectAndApplyChildren,
    plans: {
      col3: SimilarTable1Input_col3Apply,
      col4: SimilarTable2Input_col4Apply,
      col5: SimilarTable2Input_col5Apply,
      id: LeftArmBaseInput_idApply
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
  TestviewCondition: {
    plans: {
      col1: TestviewCondition_col1Apply,
      col2: TestviewCondition_col2Apply,
      testviewid($condition, val) {
        return applyAttributeCondition("testviewid", TYPES.int, $condition, val);
      }
    }
  },
  TestviewInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      col1: TestviewInput_col1Apply,
      col2: TestviewInput_col2Apply,
      testviewid(obj, val, info) {
        obj.set("testviewid", bakedInputRuntime(info.schema, info.field.type, val));
      }
    }
  },
  TypeCondition: {
    plans: {
      anIntRange($condition, val) {
        return applyAttributeCondition("an_int_range", anIntRangeCodec, $condition, val);
      },
      bigint($condition, val) {
        return applyAttributeCondition("bigint", TYPES.bigint, $condition, val);
      },
      boolean($condition, val) {
        return applyAttributeCondition("boolean", TYPES.boolean, $condition, val);
      },
      cidr($condition, val) {
        return applyAttributeCondition("cidr", TYPES.cidr, $condition, val);
      },
      compoundType($condition, val) {
        return applyAttributeCondition("compound_type", compoundTypeCodec, $condition, val);
      },
      date($condition, val) {
        return applyAttributeCondition("date", TYPES.date, $condition, val);
      },
      daterange($condition, val) {
        return applyAttributeCondition("daterange", daterangeCodec, $condition, val);
      },
      decimal($condition, val) {
        return applyAttributeCondition("decimal", TYPES.numeric, $condition, val);
      },
      domain($condition, val) {
        return applyAttributeCondition("domain", anIntCodec, $condition, val);
      },
      domain2($condition, val) {
        return applyAttributeCondition("domain2", anotherIntCodec, $condition, val);
      },
      enum($condition, val) {
        return applyAttributeCondition("enum", colorCodec, $condition, val);
      },
      enumArray: TypeCondition_enumArrayApply,
      id: TypeCondition_idApply,
      inet($condition, val) {
        return applyAttributeCondition("inet", TYPES.inet, $condition, val);
      },
      int8ArrayDomain($condition, val) {
        return applyAttributeCondition("int8_array_domain", int8ArrayDomainCodec, $condition, val);
      },
      interval($condition, val) {
        return applyAttributeCondition("interval", TYPES.interval, $condition, val);
      },
      intervalArray($condition, val) {
        return applyAttributeCondition("interval_array", LIST_TYPES.interval, $condition, val);
      },
      json($condition, val) {
        return applyAttributeCondition("json", TYPES.json, $condition, val);
      },
      jsonb($condition, val) {
        return applyAttributeCondition("jsonb", TYPES.jsonb, $condition, val);
      },
      jsonpath($condition, val) {
        return applyAttributeCondition("jsonpath", TYPES.jsonpath, $condition, val);
      },
      ltree($condition, val) {
        return applyAttributeCondition("ltree", spec_types_attributes_ltree_codec_ltree, $condition, val);
      },
      ltreeArray($condition, val) {
        return applyAttributeCondition("ltree_array", spec_types_attributes_ltree_array_codec_ltree_, $condition, val);
      },
      macaddr($condition, val) {
        return applyAttributeCondition("macaddr", TYPES.macaddr, $condition, val);
      },
      money($condition, val) {
        return applyAttributeCondition("money", TYPES.money, $condition, val);
      },
      nestedCompoundType($condition, val) {
        return applyAttributeCondition("nested_compound_type", nestedCompoundTypeCodec, $condition, val);
      },
      nullableCompoundType($condition, val) {
        return applyAttributeCondition("nullable_compound_type", compoundTypeCodec, $condition, val);
      },
      nullableNestedCompoundType($condition, val) {
        return applyAttributeCondition("nullable_nested_compound_type", nestedCompoundTypeCodec, $condition, val);
      },
      nullablePoint($condition, val) {
        return applyAttributeCondition("nullablePoint", TYPES.point, $condition, val);
      },
      nullableRange($condition, val) {
        return applyAttributeCondition("nullable_range", numrangeCodec, $condition, val);
      },
      numeric($condition, val) {
        return applyAttributeCondition("numeric", TYPES.numeric, $condition, val);
      },
      numrange($condition, val) {
        return applyAttributeCondition("numrange", numrangeCodec, $condition, val);
      },
      point($condition, val) {
        return applyAttributeCondition("point", TYPES.point, $condition, val);
      },
      regclass($condition, val) {
        return applyAttributeCondition("regclass", TYPES.regclass, $condition, val);
      },
      regconfig($condition, val) {
        return applyAttributeCondition("regconfig", TYPES.regconfig, $condition, val);
      },
      regdictionary($condition, val) {
        return applyAttributeCondition("regdictionary", TYPES.regdictionary, $condition, val);
      },
      regoper($condition, val) {
        return applyAttributeCondition("regoper", TYPES.regoper, $condition, val);
      },
      regoperator($condition, val) {
        return applyAttributeCondition("regoperator", TYPES.regoperator, $condition, val);
      },
      regproc($condition, val) {
        return applyAttributeCondition("regproc", TYPES.regproc, $condition, val);
      },
      regprocedure($condition, val) {
        return applyAttributeCondition("regprocedure", TYPES.regprocedure, $condition, val);
      },
      regtype($condition, val) {
        return applyAttributeCondition("regtype", TYPES.regtype, $condition, val);
      },
      smallint($condition, val) {
        return applyAttributeCondition("smallint", TYPES.int2, $condition, val);
      },
      textArray($condition, val) {
        return applyAttributeCondition("text_array", LIST_TYPES.text, $condition, val);
      },
      textArrayDomain($condition, val) {
        return applyAttributeCondition("text_array_domain", textArrayDomainCodec, $condition, val);
      },
      time($condition, val) {
        return applyAttributeCondition("time", TYPES.time, $condition, val);
      },
      timestamp($condition, val) {
        return applyAttributeCondition("timestamp", TYPES.timestamp, $condition, val);
      },
      timestamptz($condition, val) {
        return applyAttributeCondition("timestamptz", TYPES.timestamptz, $condition, val);
      },
      timetz($condition, val) {
        return applyAttributeCondition("timetz", TYPES.timetz, $condition, val);
      },
      varchar($condition, val) {
        return applyAttributeCondition("varchar", TYPES.varchar, $condition, val);
      }
    }
  },
  TypeFunctionConnectionMutationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  TypeFunctionListMutationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  TypeFunctionMutationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  TypeInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      anIntRange: TypeInput_anIntRangeApply,
      bigint: TypeInput_bigintApply,
      boolean: TypeInput_booleanApply,
      bytea: TypeInput_byteaApply,
      byteaArray: ListInput_byteaArrayApply,
      cidr: TypeInput_cidrApply,
      compoundType: TypeInput_compoundTypeApply,
      date: TypeInput_dateApply,
      daterange: TypeInput_daterangeApply,
      decimal: TypeInput_decimalApply,
      domain: TypeInput_domainApply,
      domain2: TypeInput_domain2Apply,
      enum: TypeInput_enumApply,
      enumArray: ListInput_enumArrayApply,
      id: LeftArmBaseInput_idApply,
      inet: TypeInput_inetApply,
      int8ArrayDomain: TypeInput_int8ArrayDomainApply,
      interval: TypeInput_intervalApply,
      intervalArray: TypeInput_intervalArrayApply,
      json: TypeInput_jsonApply,
      jsonb: TypeInput_jsonbApply,
      jsonpath: TypeInput_jsonpathApply,
      ltree: TypeInput_ltreeApply,
      ltreeArray: TypeInput_ltreeArrayApply,
      macaddr: TypeInput_macaddrApply,
      money: TypeInput_moneyApply,
      nestedCompoundType: TypeInput_nestedCompoundTypeApply,
      nullableCompoundType: TypeInput_nullableCompoundTypeApply,
      nullableNestedCompoundType: TypeInput_nullableNestedCompoundTypeApply,
      nullablePoint: TypeInput_nullablePointApply,
      nullableRange: TypeInput_nullableRangeApply,
      numeric: TypeInput_numericApply,
      numrange: TypeInput_numrangeApply,
      point: TypeInput_pointApply,
      regclass: TypeInput_regclassApply,
      regconfig: TypeInput_regconfigApply,
      regdictionary: TypeInput_regdictionaryApply,
      regoper: TypeInput_regoperApply,
      regoperator: TypeInput_regoperatorApply,
      regproc: TypeInput_regprocApply,
      regprocedure: TypeInput_regprocedureApply,
      regtype: TypeInput_regtypeApply,
      smallint: TypeInput_smallintApply,
      textArray: TypeInput_textArrayApply,
      textArrayDomain: TypeInput_textArrayDomainApply,
      time: TypeInput_timeApply,
      timestamp: TypeInput_timestampApply,
      timestamptz: TypeInput_timestamptzApply,
      timetz: TypeInput_timetzApply,
      varchar: TypeInput_varcharApply
    }
  },
  TypePatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      anIntRange: TypeInput_anIntRangeApply,
      bigint: TypeInput_bigintApply,
      boolean: TypeInput_booleanApply,
      bytea: TypeInput_byteaApply,
      byteaArray: ListInput_byteaArrayApply,
      cidr: TypeInput_cidrApply,
      compoundType: TypeInput_compoundTypeApply,
      date: TypeInput_dateApply,
      daterange: TypeInput_daterangeApply,
      decimal: TypeInput_decimalApply,
      domain: TypeInput_domainApply,
      domain2: TypeInput_domain2Apply,
      enum: TypeInput_enumApply,
      enumArray: ListInput_enumArrayApply,
      id: LeftArmBaseInput_idApply,
      inet: TypeInput_inetApply,
      int8ArrayDomain: TypeInput_int8ArrayDomainApply,
      interval: TypeInput_intervalApply,
      intervalArray: TypeInput_intervalArrayApply,
      json: TypeInput_jsonApply,
      jsonb: TypeInput_jsonbApply,
      jsonpath: TypeInput_jsonpathApply,
      ltree: TypeInput_ltreeApply,
      ltreeArray: TypeInput_ltreeArrayApply,
      macaddr: TypeInput_macaddrApply,
      money: TypeInput_moneyApply,
      nestedCompoundType: TypeInput_nestedCompoundTypeApply,
      nullableCompoundType: TypeInput_nullableCompoundTypeApply,
      nullableNestedCompoundType: TypeInput_nullableNestedCompoundTypeApply,
      nullablePoint: TypeInput_nullablePointApply,
      nullableRange: TypeInput_nullableRangeApply,
      numeric: TypeInput_numericApply,
      numrange: TypeInput_numrangeApply,
      point: TypeInput_pointApply,
      regclass: TypeInput_regclassApply,
      regconfig: TypeInput_regconfigApply,
      regdictionary: TypeInput_regdictionaryApply,
      regoper: TypeInput_regoperApply,
      regoperator: TypeInput_regoperatorApply,
      regproc: TypeInput_regprocApply,
      regprocedure: TypeInput_regprocedureApply,
      regtype: TypeInput_regtypeApply,
      smallint: TypeInput_smallintApply,
      textArray: TypeInput_textArrayApply,
      textArrayDomain: TypeInput_textArrayDomainApply,
      time: TypeInput_timeApply,
      timestamp: TypeInput_timestampApply,
      timestamptz: TypeInput_timestamptzApply,
      timetz: TypeInput_timetzApply,
      varchar: TypeInput_varcharApply
    }
  },
  TypesMutationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  UpdatableViewCondition: {
    plans: {
      constant($condition, val) {
        return applyAttributeCondition("constant", TYPES.int, $condition, val);
      },
      description($condition, val) {
        return applyAttributeCondition("description", TYPES.text, $condition, val);
      },
      name($condition, val) {
        return applyAttributeCondition("name", TYPES.varchar, $condition, val);
      },
      x($condition, val) {
        return applyAttributeCondition("x", TYPES.int, $condition, val);
      }
    }
  },
  UpdatableViewInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      constant(obj, val, info) {
        obj.set("constant", bakedInputRuntime(info.schema, info.field.type, val));
      },
      description(obj, val, info) {
        obj.set("description", bakedInputRuntime(info.schema, info.field.type, val));
      },
      name(obj, val, info) {
        obj.set("name", bakedInputRuntime(info.schema, info.field.type, val));
      },
      x(obj, val, info) {
        obj.set("x", bakedInputRuntime(info.schema, info.field.type, val));
      }
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
  UpdateDefaultValueByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      defaultValuePatch: applyCreateFields
    }
  },
  UpdateDefaultValueInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      defaultValuePatch: applyCreateFields
    }
  },
  UpdateInputByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      inputPatch: applyCreateFields
    }
  },
  UpdateInputInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      inputPatch: applyCreateFields
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
  UpdateListByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      listPatch: applyCreateFields
    }
  },
  UpdateListInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      listPatch: applyCreateFields
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
  UpdateNoPrimaryKeyByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      noPrimaryKeyPatch: applyCreateFields
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
  UpdatePatchByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      patchPatch: applyCreateFields
    }
  },
  UpdatePatchInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      patchPatch: applyCreateFields
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
  UpdatePostByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      postPatch: applyCreateFields
    }
  },
  UpdatePostInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      postPatch: applyCreateFields
    }
  },
  UpdateReservedByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      reservedPatch: applyCreateFields
    }
  },
  UpdateReservedInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      reservedPatch: applyCreateFields
    }
  },
  UpdateReservedInputRecordByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      reservedInputRecordPatch: applyCreateFields
    }
  },
  UpdateReservedInputRecordInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      reservedInputRecordPatch: applyCreateFields
    }
  },
  UpdateReservedPatchRecordByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      reservedPatchRecordPatch: applyCreateFields
    }
  },
  UpdateReservedPatchRecordInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      reservedPatchRecordPatch: applyCreateFields
    }
  },
  UpdateSimilarTable1ByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      similarTable1Patch: applyCreateFields
    }
  },
  UpdateSimilarTable1Input: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      similarTable1Patch: applyCreateFields
    }
  },
  UpdateSimilarTable2ByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      similarTable2Patch: applyCreateFields
    }
  },
  UpdateSimilarTable2Input: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      similarTable2Patch: applyCreateFields
    }
  },
  UpdateTypeByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      typePatch: applyCreateFields
    }
  },
  UpdateTypeInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      typePatch: applyCreateFields
    }
  },
  UpdateViewTableByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      viewTablePatch: applyCreateFields
    }
  },
  UpdateViewTableInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      viewTablePatch: applyCreateFields
    }
  },
  ViewTableCondition: {
    plans: {
      col1: TestviewCondition_col1Apply,
      col2: TestviewCondition_col2Apply,
      id: TypeCondition_idApply
    }
  },
  ViewTableInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      col1: TestviewInput_col1Apply,
      col2: TestviewInput_col2Apply,
      id: LeftArmBaseInput_idApply
    }
  },
  ViewTablePatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      col1: TestviewInput_col1Apply,
      col2: TestviewInput_col2Apply,
      id: LeftArmBaseInput_idApply
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
  Guid: {
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
  DefaultValuesOrderBy: {
    values: {
      ID_ASC: TypesOrderBy_ID_ASCApply,
      ID_DESC: TypesOrderBy_ID_DESCApply,
      NULL_VALUE_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "null_value",
          direction: "ASC"
        });
      },
      NULL_VALUE_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "null_value",
          direction: "DESC"
        });
      },
      PRIMARY_KEY_ASC(queryBuilder) {
        default_valueUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        default_valueUniques[0].attributes.forEach(attributeName => {
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
        applyOrderByCustomField(resource_edge_case_computedPgResource, "asc", queryBuilder);
      },
      COMPUTED_DESC(queryBuilder) {
        applyOrderByCustomField(resource_edge_case_computedPgResource, "desc", queryBuilder);
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
  ForeignKeysOrderBy: {
    values: {
      COMPOUND_KEY_1_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "compound_key_1",
          direction: "ASC"
        });
      },
      COMPOUND_KEY_1_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "compound_key_1",
          direction: "DESC"
        });
      },
      COMPOUND_KEY_2_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "compound_key_2",
          direction: "ASC"
        });
      },
      COMPOUND_KEY_2_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "compound_key_2",
          direction: "DESC"
        });
      },
      PERSON_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "person_id",
          direction: "ASC"
        });
      },
      PERSON_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "person_id",
          direction: "DESC"
        });
      }
    }
  },
  InputsOrderBy: {
    values: {
      ID_ASC: TypesOrderBy_ID_ASCApply,
      ID_DESC: TypesOrderBy_ID_DESCApply,
      PRIMARY_KEY_ASC(queryBuilder) {
        inputsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        inputsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      }
    }
  },
  Issue756SOrderBy: {
    values: {
      ID_ASC: TypesOrderBy_ID_ASCApply,
      ID_DESC: TypesOrderBy_ID_DESCApply,
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
      ID_ASC: TypesOrderBy_ID_ASCApply,
      ID_DESC: TypesOrderBy_ID_DESCApply,
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
  ListsOrderBy: {
    values: {
      ID_ASC: TypesOrderBy_ID_ASCApply,
      ID_DESC: TypesOrderBy_ID_DESCApply,
      PRIMARY_KEY_ASC(queryBuilder) {
        listsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        listsUniques[0].attributes.forEach(attributeName => {
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
      ID_ASC: TypesOrderBy_ID_ASCApply,
      ID_DESC: TypesOrderBy_ID_DESCApply,
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
  NonUpdatableViewsOrderBy: {
    values: {
      COLUMN_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "?column?",
          direction: "ASC"
        });
      },
      COLUMN_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "?column?",
          direction: "DESC"
        });
      }
    }
  },
  NoPrimaryKeysOrderBy: {
    values: {
      ID_ASC: TypesOrderBy_ID_ASCApply,
      ID_DESC: TypesOrderBy_ID_DESCApply,
      STR_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "str",
          direction: "ASC"
        });
      },
      STR_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "str",
          direction: "DESC"
        });
      }
    }
  },
  NullTestRecordsOrderBy: {
    values: {
      ID_ASC: TypesOrderBy_ID_ASCApply,
      ID_DESC: TypesOrderBy_ID_DESCApply,
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
  PatchesOrderBy: {
    values: {
      ID_ASC: TypesOrderBy_ID_ASCApply,
      ID_DESC: TypesOrderBy_ID_DESCApply,
      PRIMARY_KEY_ASC(queryBuilder) {
        patchsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        patchsUniques[0].attributes.forEach(attributeName => {
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
        applyOrderByCustomField(resource_person_computed_outPgResource, "asc", queryBuilder);
      },
      COMPUTED_OUT_DESC(queryBuilder) {
        applyOrderByCustomField(resource_person_computed_outPgResource, "desc", queryBuilder);
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
        applyOrderByCustomField(resource_person_first_namePgResource, "asc", queryBuilder);
      },
      FIRST_NAME_DESC(queryBuilder) {
        applyOrderByCustomField(resource_person_first_namePgResource, "desc", queryBuilder);
      },
      ID_ASC: TypesOrderBy_ID_ASCApply,
      ID_DESC: TypesOrderBy_ID_DESCApply,
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
  },
  PostsOrderBy: {
    values: {
      AUTHOR_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "author_id",
          direction: "ASC"
        });
      },
      AUTHOR_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "author_id",
          direction: "DESC"
        });
      },
      BODY_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "body",
          direction: "ASC"
        });
      },
      BODY_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "body",
          direction: "DESC"
        });
      },
      COMPUTED_WITH_OPTIONAL_ARG_ASC(queryBuilder) {
        applyOrderByCustomField(resource_post_computed_with_optional_argPgResource, "asc", queryBuilder);
      },
      COMPUTED_WITH_OPTIONAL_ARG_DESC(queryBuilder) {
        applyOrderByCustomField(resource_post_computed_with_optional_argPgResource, "desc", queryBuilder);
      },
      HEADLINE_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "headline",
          direction: "ASC"
        });
      },
      HEADLINE_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "headline",
          direction: "DESC"
        });
      },
      ID_ASC: TypesOrderBy_ID_ASCApply,
      ID_DESC: TypesOrderBy_ID_DESCApply,
      PRIMARY_KEY_ASC(queryBuilder) {
        postUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        postUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      }
    }
  },
  ReservedInputRecordsOrderBy: {
    values: {
      ID_ASC: TypesOrderBy_ID_ASCApply,
      ID_DESC: TypesOrderBy_ID_DESCApply,
      PRIMARY_KEY_ASC(queryBuilder) {
        reserved_inputUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        reserved_inputUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      }
    }
  },
  ReservedPatchRecordsOrderBy: {
    values: {
      ID_ASC: TypesOrderBy_ID_ASCApply,
      ID_DESC: TypesOrderBy_ID_DESCApply,
      PRIMARY_KEY_ASC(queryBuilder) {
        reservedPatchsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        reservedPatchsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      }
    }
  },
  ReservedsOrderBy: {
    values: {
      ID_ASC: TypesOrderBy_ID_ASCApply,
      ID_DESC: TypesOrderBy_ID_DESCApply,
      PRIMARY_KEY_ASC(queryBuilder) {
        reservedUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        reservedUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      }
    }
  },
  SimilarTable1SOrderBy: {
    values: {
      COL1_ASC: TestviewsOrderBy_COL1_ASCApply,
      COL1_DESC: TestviewsOrderBy_COL1_DESCApply,
      COL2_ASC: TestviewsOrderBy_COL2_ASCApply,
      COL2_DESC: TestviewsOrderBy_COL2_DESCApply,
      COL3_ASC: SimilarTable1SOrderBy_COL3_ASCApply,
      COL3_DESC: SimilarTable1SOrderBy_COL3_DESCApply,
      ID_ASC: TypesOrderBy_ID_ASCApply,
      ID_DESC: TypesOrderBy_ID_DESCApply,
      PRIMARY_KEY_ASC(queryBuilder) {
        similar_table_1Uniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        similar_table_1Uniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      }
    }
  },
  SimilarTable2SOrderBy: {
    values: {
      COL3_ASC: SimilarTable1SOrderBy_COL3_ASCApply,
      COL3_DESC: SimilarTable1SOrderBy_COL3_DESCApply,
      COL4_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col4",
          direction: "ASC"
        });
      },
      COL4_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col4",
          direction: "DESC"
        });
      },
      COL5_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col5",
          direction: "ASC"
        });
      },
      COL5_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col5",
          direction: "DESC"
        });
      },
      ID_ASC: TypesOrderBy_ID_ASCApply,
      ID_DESC: TypesOrderBy_ID_DESCApply,
      PRIMARY_KEY_ASC(queryBuilder) {
        similar_table_2Uniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        similar_table_2Uniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      }
    }
  },
  TestviewsOrderBy: {
    values: {
      COL1_ASC: TestviewsOrderBy_COL1_ASCApply,
      COL1_DESC: TestviewsOrderBy_COL1_DESCApply,
      COL2_ASC: TestviewsOrderBy_COL2_ASCApply,
      COL2_DESC: TestviewsOrderBy_COL2_DESCApply,
      TESTVIEWID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "testviewid",
          direction: "ASC"
        });
      },
      TESTVIEWID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "testviewid",
          direction: "DESC"
        });
      }
    }
  },
  TypesOrderBy: {
    values: {
      BIGINT_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "bigint",
          direction: "ASC"
        });
      },
      BIGINT_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "bigint",
          direction: "DESC"
        });
      },
      BOOLEAN_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "boolean",
          direction: "ASC"
        });
      },
      BOOLEAN_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "boolean",
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
      COMPOUND_TYPE_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "compound_type",
          direction: "ASC"
        });
      },
      COMPOUND_TYPE_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "compound_type",
          direction: "DESC"
        });
      },
      DATE_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "date",
          direction: "ASC"
        });
      },
      DATE_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "date",
          direction: "DESC"
        });
      },
      DECIMAL_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "decimal",
          direction: "ASC"
        });
      },
      DECIMAL_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "decimal",
          direction: "DESC"
        });
      },
      DOMAIN_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "domain",
          direction: "ASC"
        });
      },
      DOMAIN_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "domain",
          direction: "DESC"
        });
      },
      DOMAIN2_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "domain2",
          direction: "ASC"
        });
      },
      DOMAIN2_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "domain2",
          direction: "DESC"
        });
      },
      ENUM_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "enum",
          direction: "ASC"
        });
      },
      ENUM_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "enum",
          direction: "DESC"
        });
      },
      ID_ASC: TypesOrderBy_ID_ASCApply,
      ID_DESC: TypesOrderBy_ID_DESCApply,
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
      INTERVAL_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "interval",
          direction: "ASC"
        });
      },
      INTERVAL_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "interval",
          direction: "DESC"
        });
      },
      JSON_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "json",
          direction: "ASC"
        });
      },
      JSON_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "json",
          direction: "DESC"
        });
      },
      JSONB_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "jsonb",
          direction: "ASC"
        });
      },
      JSONB_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "jsonb",
          direction: "DESC"
        });
      },
      JSONPATH_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "jsonpath",
          direction: "ASC"
        });
      },
      JSONPATH_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "jsonpath",
          direction: "DESC"
        });
      },
      LTREE_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "ltree",
          direction: "ASC"
        });
      },
      LTREE_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "ltree",
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
      MONEY_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "money",
          direction: "ASC"
        });
      },
      MONEY_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "money",
          direction: "DESC"
        });
      },
      NESTED_COMPOUND_TYPE_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "nested_compound_type",
          direction: "ASC"
        });
      },
      NESTED_COMPOUND_TYPE_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "nested_compound_type",
          direction: "DESC"
        });
      },
      NULLABLE_COMPOUND_TYPE_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "nullable_compound_type",
          direction: "ASC"
        });
      },
      NULLABLE_COMPOUND_TYPE_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "nullable_compound_type",
          direction: "DESC"
        });
      },
      NULLABLE_NESTED_COMPOUND_TYPE_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "nullable_nested_compound_type",
          direction: "ASC"
        });
      },
      NULLABLE_NESTED_COMPOUND_TYPE_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "nullable_nested_compound_type",
          direction: "DESC"
        });
      },
      NULLABLE_POINT_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "nullablePoint",
          direction: "ASC"
        });
      },
      NULLABLE_POINT_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "nullablePoint",
          direction: "DESC"
        });
      },
      NUMERIC_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "numeric",
          direction: "ASC"
        });
      },
      NUMERIC_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "numeric",
          direction: "DESC"
        });
      },
      POINT_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "point",
          direction: "ASC"
        });
      },
      POINT_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "point",
          direction: "DESC"
        });
      },
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
      REGCLASS_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "regclass",
          direction: "ASC"
        });
      },
      REGCLASS_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "regclass",
          direction: "DESC"
        });
      },
      REGCONFIG_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "regconfig",
          direction: "ASC"
        });
      },
      REGCONFIG_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "regconfig",
          direction: "DESC"
        });
      },
      REGDICTIONARY_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "regdictionary",
          direction: "ASC"
        });
      },
      REGDICTIONARY_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "regdictionary",
          direction: "DESC"
        });
      },
      REGOPER_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "regoper",
          direction: "ASC"
        });
      },
      REGOPER_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "regoper",
          direction: "DESC"
        });
      },
      REGOPERATOR_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "regoperator",
          direction: "ASC"
        });
      },
      REGOPERATOR_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "regoperator",
          direction: "DESC"
        });
      },
      REGPROC_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "regproc",
          direction: "ASC"
        });
      },
      REGPROC_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "regproc",
          direction: "DESC"
        });
      },
      REGPROCEDURE_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "regprocedure",
          direction: "ASC"
        });
      },
      REGPROCEDURE_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "regprocedure",
          direction: "DESC"
        });
      },
      REGTYPE_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "regtype",
          direction: "ASC"
        });
      },
      REGTYPE_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "regtype",
          direction: "DESC"
        });
      },
      SMALLINT_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "smallint",
          direction: "ASC"
        });
      },
      SMALLINT_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "smallint",
          direction: "DESC"
        });
      },
      TIME_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "time",
          direction: "ASC"
        });
      },
      TIME_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "time",
          direction: "DESC"
        });
      },
      TIMESTAMP_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "timestamp",
          direction: "ASC"
        });
      },
      TIMESTAMP_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "timestamp",
          direction: "DESC"
        });
      },
      TIMESTAMPTZ_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "timestamptz",
          direction: "ASC"
        });
      },
      TIMESTAMPTZ_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "timestamptz",
          direction: "DESC"
        });
      },
      TIMETZ_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "timetz",
          direction: "ASC"
        });
      },
      TIMETZ_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "timetz",
          direction: "DESC"
        });
      },
      VARCHAR_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "varchar",
          direction: "ASC"
        });
      },
      VARCHAR_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "varchar",
          direction: "DESC"
        });
      }
    }
  },
  UpdatableViewsOrderBy: {
    values: {
      CONSTANT_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "constant",
          direction: "ASC"
        });
      },
      CONSTANT_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "constant",
          direction: "DESC"
        });
      },
      DESCRIPTION_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "description",
          direction: "ASC"
        });
      },
      DESCRIPTION_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "description",
          direction: "DESC"
        });
      },
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
      X_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "x",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      X_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "x",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
      }
    }
  },
  ViewTablesOrderBy: {
    values: {
      COL1_ASC: TestviewsOrderBy_COL1_ASCApply,
      COL1_DESC: TestviewsOrderBy_COL1_DESCApply,
      COL2_ASC: TestviewsOrderBy_COL2_ASCApply,
      COL2_DESC: TestviewsOrderBy_COL2_DESCApply,
      ID_ASC: TypesOrderBy_ID_ASCApply,
      ID_DESC: TypesOrderBy_ID_DESCApply,
      PRIMARY_KEY_ASC(queryBuilder) {
        view_tableUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        view_tableUniques[0].attributes.forEach(attributeName => {
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
