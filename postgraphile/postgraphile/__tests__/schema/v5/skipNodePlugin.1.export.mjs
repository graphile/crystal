import { LIST_TYPES, PgDeleteSingleStep, PgExecutor, PgResource, PgSelectSingleStep, PgSelectStep, TYPES, assertPgClassSingleStep, domainOfCodec, enumCodec, listOfCodec, makeRegistry, pgClassExpression, pgDeleteSingle, pgFromExpression, pgInsertSingle, pgSelectFromRecord, pgSelectFromRecords, pgSelectSingleFromRecord, pgUpdateSingle, rangeOfCodec, recordCodec, sqlFromArgDigests, sqlValueWithCodec } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ObjectStep, __ValueStep, assertStep, bakedInput, bakedInputRuntime, connection, constant, context, createObjectAndApplyChildren, first, get as get2, makeGrafastSchema, object, operationPlan, rootValue, stepAMayDependOnStepB, trap } from "grafast";
import { GraphQLError, GraphQLInt, GraphQLString, Kind, valueFromASTUntyped } from "graphql";
import { sql } from "pg-sql2";
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
const registryConfig_pgCodecs_CFuncOutOutRecord_CFuncOutOutRecord = recordCodec({
  name: "CFuncOutOutRecord",
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
const registryConfig_pgCodecs_CFuncOutOutSetofRecord_CFuncOutOutSetofRecord = recordCodec({
  name: "CFuncOutOutSetofRecord",
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
const registryConfig_pgCodecs_CFuncOutOutUnnamedRecord_CFuncOutOutUnnamedRecord = recordCodec({
  name: "CFuncOutOutUnnamedRecord",
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
const registryConfig_pgCodecs_CMutationOutOutRecord_CMutationOutOutRecord = recordCodec({
  name: "CMutationOutOutRecord",
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
const registryConfig_pgCodecs_CMutationOutOutSetofRecord_CMutationOutOutSetofRecord = recordCodec({
  name: "CMutationOutOutSetofRecord",
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
const registryConfig_pgCodecs_CMutationOutOutUnnamedRecord_CMutationOutOutUnnamedRecord = recordCodec({
  name: "CMutationOutOutUnnamedRecord",
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
const registryConfig_pgCodecs_CSearchTestSummariesRecord_CSearchTestSummariesRecord = recordCodec({
  name: "CSearchTestSummariesRecord",
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
const registryConfig_pgCodecs_CFuncOutUnnamedOutOutUnnamedRecord_CFuncOutUnnamedOutOutUnnamedRecord = recordCodec({
  name: "CFuncOutUnnamedOutOutUnnamedRecord",
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
const registryConfig_pgCodecs_CMutationOutUnnamedOutOutUnnamedRecord_CMutationOutUnnamedOutOutUnnamedRecord = recordCodec({
  name: "CMutationOutUnnamedOutOutUnnamedRecord",
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
const registryConfig_pgCodecs_CMutationReturnsTableMultiColRecord_CMutationReturnsTableMultiColRecord = recordCodec({
  name: "CMutationReturnsTableMultiColRecord",
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
const registryConfig_pgCodecs_CFuncReturnsTableMultiColRecord_CFuncReturnsTableMultiColRecord = recordCodec({
  name: "CFuncReturnsTableMultiColRecord",
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
const bGuidCodec = domainOfCodec(TYPES.varchar, "bGuid", sql.identifier("b", "guid"), {
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
      omit: "create,update,delete,all,order,filter"
    }
  },
  executor: executor
});
const cMyTableIdentifier = sql.identifier("c", "my_table");
const cMyTableCodec = recordCodec({
  name: "cMyTable",
  identifier: cMyTableIdentifier,
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
const cPersonSecretIdentifier = sql.identifier("c", "person_secret");
const cPersonSecretCodec = recordCodec({
  name: "cPersonSecret",
  identifier: cPersonSecretIdentifier,
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
const cUnloggedIdentifier = sql.identifier("c", "unlogged");
const cUnloggedCodec = recordCodec({
  name: "cUnlogged",
  identifier: cUnloggedIdentifier,
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
const bUpdatableViewIdentifier = sql.identifier("b", "updatable_view");
const bUpdatableViewCodec = recordCodec({
  name: "bUpdatableView",
  identifier: bUpdatableViewIdentifier,
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
      uniqueKey: "x"
    }
  },
  executor: executor,
  description: "YOYOYO!!"
});
const cCompoundKeyIdentifier = sql.identifier("c", "compound_key");
const cCompoundKeyCodec = recordCodec({
  name: "cCompoundKey",
  identifier: cCompoundKeyIdentifier,
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
const cNullTestRecordIdentifier = sql.identifier("c", "null_test_record");
const cNullTestRecordCodec = recordCodec({
  name: "cNullTestRecord",
  identifier: cNullTestRecordIdentifier,
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
const cEdgeCaseIdentifier = sql.identifier("c", "edge_case");
const cEdgeCaseCodec = recordCodec({
  name: "cEdgeCase",
  identifier: cEdgeCaseIdentifier,
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
const cLeftArmIdentifier = sql.identifier("c", "left_arm");
const cLeftArmCodec = recordCodec({
  name: "cLeftArm",
  identifier: cLeftArmIdentifier,
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
const bJwtTokenIdentifier = sql.identifier("b", "jwt_token");
const bJwtTokenCodec = recordCodec({
  name: "bJwtToken",
  identifier: bJwtTokenIdentifier,
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
const cIssue756Identifier = sql.identifier("c", "issue756");
const cNotNullTimestampCodec = domainOfCodec(TYPES.timestamptz, "cNotNullTimestamp", sql.identifier("c", "not_null_timestamp"), {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "not_null_timestamp"
    }
  },
  notNull: true
});
const cIssue756Codec = recordCodec({
  name: "cIssue756",
  identifier: cIssue756Identifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    ts: {
      codec: cNotNullTimestampCodec,
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
const bAuthPayloadIdentifier = sql.identifier("b", "auth_payload");
const bAuthPayloadCodec = recordCodec({
  name: "bAuthPayload",
  identifier: bAuthPayloadIdentifier,
  attributes: {
    __proto__: null,
    jwt: {
      codec: bJwtTokenCodec
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
const registryConfig_pgCodecs_CQueryOutputTwoRowsRecord_CQueryOutputTwoRowsRecord = recordCodec({
  name: "CQueryOutputTwoRowsRecord",
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
      codec: cLeftArmCodec,
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
const cCompoundTypeIdentifier = sql.identifier("c", "compound_type");
const bColorCodec = enumCodec({
  name: "bColor",
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
const bEnumCapsCodec = enumCodec({
  name: "bEnumCaps",
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
const bEnumWithEmptyStringCodec = enumCodec({
  name: "bEnumWithEmptyString",
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
const cCompoundTypeCodec = recordCodec({
  name: "cCompoundType",
  identifier: cCompoundTypeIdentifier,
  attributes: {
    __proto__: null,
    a: {
      codec: TYPES.int
    },
    b: {
      codec: TYPES.text
    },
    c: {
      codec: bColorCodec
    },
    d: {
      codec: TYPES.uuid
    },
    e: {
      codec: bEnumCapsCodec
    },
    f: {
      codec: bEnumWithEmptyStringCodec
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
const registryConfig_pgCodecs_CFuncOutOutCompoundTypeRecord_CFuncOutOutCompoundTypeRecord = recordCodec({
  name: "CFuncOutOutCompoundTypeRecord",
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
      codec: cCompoundTypeCodec,
      extensions: {
        argIndex: 2,
        argName: "o2"
      }
    }
  },
  executor,
  isAnonymous: true
});
const registryConfig_pgCodecs_CMutationOutOutCompoundTypeRecord_CMutationOutOutCompoundTypeRecord = recordCodec({
  name: "CMutationOutOutCompoundTypeRecord",
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
      codec: cCompoundTypeCodec,
      extensions: {
        argIndex: 2,
        argName: "o2"
      }
    }
  },
  executor,
  isAnonymous: true
});
const registryConfig_pgCodecs_CPersonComputedOutOutRecord_CPersonComputedOutOutRecord = recordCodec({
  name: "CPersonComputedOutOutRecord",
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
const registryConfig_pgCodecs_CPersonComputedInoutOutRecord_CPersonComputedInoutOutRecord = recordCodec({
  name: "CPersonComputedInoutOutRecord",
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
const cPersonIdentifier = sql.identifier("c", "person");
const bEmailCodec = domainOfCodec(TYPES.text, "bEmail", sql.identifier("b", "email"), {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "email"
    }
  }
});
const bNotNullUrlCodec = domainOfCodec(TYPES.varchar, "bNotNullUrl", sql.identifier("b", "not_null_url"), {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "not_null_url"
    }
  },
  notNull: true
});
const bWrappedUrlCodec = recordCodec({
  name: "bWrappedUrl",
  identifier: sql.identifier("b", "wrapped_url"),
  attributes: {
    __proto__: null,
    url: {
      codec: bNotNullUrlCodec,
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
const cPersonCodec = recordCodec({
  name: "cPerson",
  identifier: cPersonIdentifier,
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
      codec: bEmailCodec,
      notNull: true
    },
    site: {
      codec: bWrappedUrlCodec,
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
const registryConfig_pgCodecs_CPersonComputedFirstArgInoutOutRecord_CPersonComputedFirstArgInoutOutRecord = recordCodec({
  name: "CPersonComputedFirstArgInoutOutRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: {
    __proto__: null,
    person: {
      codec: cPersonCodec,
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
const registryConfig_pgCodecs_CFuncOutComplexRecord_CFuncOutComplexRecord = recordCodec({
  name: "CFuncOutComplexRecord",
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
      codec: cCompoundTypeCodec,
      extensions: {
        argIndex: 3,
        argName: "y"
      }
    },
    z: {
      codec: cPersonCodec,
      extensions: {
        argIndex: 4,
        argName: "z"
      }
    }
  },
  executor,
  isAnonymous: true
});
const registryConfig_pgCodecs_CFuncOutComplexSetofRecord_CFuncOutComplexSetofRecord = recordCodec({
  name: "CFuncOutComplexSetofRecord",
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
      codec: cCompoundTypeCodec,
      extensions: {
        argIndex: 3,
        argName: "y"
      }
    },
    z: {
      codec: cPersonCodec,
      extensions: {
        argIndex: 4,
        argName: "z"
      }
    }
  },
  executor,
  isAnonymous: true
});
const registryConfig_pgCodecs_CMutationOutComplexRecord_CMutationOutComplexRecord = recordCodec({
  name: "CMutationOutComplexRecord",
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
      codec: cCompoundTypeCodec,
      extensions: {
        argIndex: 3,
        argName: "y"
      }
    },
    z: {
      codec: cPersonCodec,
      extensions: {
        argIndex: 4,
        argName: "z"
      }
    }
  },
  executor,
  isAnonymous: true
});
const registryConfig_pgCodecs_CMutationOutComplexSetofRecord_CMutationOutComplexSetofRecord = recordCodec({
  name: "CMutationOutComplexSetofRecord",
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
      codec: cCompoundTypeCodec,
      extensions: {
        argIndex: 3,
        argName: "y"
      }
    },
    z: {
      codec: cPersonCodec,
      extensions: {
        argIndex: 4,
        argName: "z"
      }
    }
  },
  executor,
  isAnonymous: true
});
const registryConfig_pgCodecs_CPersonComputedComplexRecord_CPersonComputedComplexRecord = recordCodec({
  name: "CPersonComputedComplexRecord",
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
      codec: cCompoundTypeCodec,
      extensions: {
        argIndex: 4,
        argName: "y"
      }
    },
    z: {
      codec: cPersonCodec,
      extensions: {
        argIndex: 5,
        argName: "z"
      }
    }
  },
  executor,
  isAnonymous: true
});
const bListsIdentifier = sql.identifier("b", "lists");
const bColorArrayCodec = listOfCodec(bColorCodec, {
  name: "bColorArray",
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "_color"
    }
  }
});
const cCompoundTypeArrayCodec = listOfCodec(cCompoundTypeCodec, {
  name: "cCompoundTypeArray",
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "_compound_type"
    }
  }
});
const bListsCodec = recordCodec({
  name: "bLists",
  identifier: bListsIdentifier,
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
      codec: bColorArrayCodec
    },
    enum_array_nn: {
      codec: bColorArrayCodec,
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
      codec: cCompoundTypeArrayCodec
    },
    compound_type_array_nn: {
      codec: cCompoundTypeArrayCodec,
      notNull: true
    },
    bytea_array: {
      codec: LIST_TYPES.bytea
    },
    bytea_array_nn: {
      codec: LIST_TYPES.bytea,
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
const bTypesIdentifier = sql.identifier("b", "types");
const anIntCodec = domainOfCodec(TYPES.int, "anInt", sql.identifier("a", "an_int"), {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "an_int"
    }
  }
});
const bAnotherIntCodec = domainOfCodec(anIntCodec, "bAnotherInt", sql.identifier("b", "another_int"), {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "another_int"
    }
  }
});
const pgCatalogNumrangeCodec = rangeOfCodec(TYPES.numeric, "pgCatalogNumrange", sql.identifier("pg_catalog", "numrange"), {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "pg_catalog",
      name: "numrange"
    }
  },
  description: "range of numerics"
});
const pgCatalogDaterangeCodec = rangeOfCodec(TYPES.date, "pgCatalogDaterange", sql.identifier("pg_catalog", "daterange"), {
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
const bNestedCompoundTypeCodec = recordCodec({
  name: "bNestedCompoundType",
  identifier: sql.identifier("b", "nested_compound_type"),
  attributes: {
    __proto__: null,
    a: {
      codec: cCompoundTypeCodec
    },
    b: {
      codec: cCompoundTypeCodec
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
const cTextArrayDomainCodec = domainOfCodec(LIST_TYPES.text, "cTextArrayDomain", sql.identifier("c", "text_array_domain"), {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "text_array_domain"
    }
  }
});
const cInt8ArrayDomainCodec = domainOfCodec(LIST_TYPES.bigint, "cInt8ArrayDomain", sql.identifier("c", "int8_array_domain"), {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "int8_array_domain"
    }
  }
});
const spec_bTypes_attributes_ltree_codec_ltree = {
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
const spec_bTypes_attributes_ltree_array_codec_ltree_ = listOfCodec(spec_bTypes_attributes_ltree_codec_ltree);
const bTypesCodec = recordCodec({
  name: "bTypes",
  identifier: bTypesIdentifier,
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
      codec: bColorCodec,
      notNull: true
    },
    enum_array: {
      codec: bColorArrayCodec,
      notNull: true
    },
    domain: {
      codec: anIntCodec,
      notNull: true
    },
    domain2: {
      codec: bAnotherIntCodec,
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
      codec: pgCatalogNumrangeCodec
    },
    numrange: {
      codec: pgCatalogNumrangeCodec,
      notNull: true
    },
    daterange: {
      codec: pgCatalogDaterangeCodec,
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
      codec: cCompoundTypeCodec,
      notNull: true
    },
    nested_compound_type: {
      codec: bNestedCompoundTypeCodec,
      notNull: true
    },
    nullable_compound_type: {
      codec: cCompoundTypeCodec
    },
    nullable_nested_compound_type: {
      codec: bNestedCompoundTypeCodec
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
      codec: cTextArrayDomainCodec
    },
    int8_array_domain: {
      codec: cInt8ArrayDomainCodec
    },
    bytea: {
      codec: TYPES.bytea
    },
    bytea_array: {
      codec: LIST_TYPES.bytea
    },
    ltree: {
      codec: spec_bTypes_attributes_ltree_codec_ltree
    },
    ltree_array: {
      codec: spec_bTypes_attributes_ltree_array_codec_ltree_
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
const cFloatrangeCodec = rangeOfCodec(TYPES.float, "cFloatrange", sql.identifier("c", "floatrange"), {
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
      omit: "create,update,delete,all,order,filter"
    }
  },
  uniques: unique_foreign_keyUniques
};
const c_my_tableUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const c_person_secretUniques = [{
  attributes: ["person_id"],
  isPrimary: true
}];
const c_person_secret_resourceOptionsConfig = {
  executor: executor,
  name: "c_person_secret",
  identifier: "main.c.person_secret",
  from: cPersonSecretIdentifier,
  codec: cPersonSecretCodec,
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
  uniques: c_person_secretUniques,
  description: "Tracks the person's secret"
};
const view_tableUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const edge_case_computedFunctionIdentifer = sql.identifier("c", "edge_case_computed");
const c_compound_keyUniques = [{
  attributes: ["person_id_1", "person_id_2"],
  isPrimary: true
}];
const c_compound_key_resourceOptionsConfig = {
  executor: executor,
  name: "c_compound_key",
  identifier: "main.c.compound_key",
  from: cCompoundKeyIdentifier,
  codec: cCompoundKeyCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "compound_key"
    }
  },
  uniques: c_compound_keyUniques
};
const similar_table_1Uniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const similar_table_2Uniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const c_null_test_recordUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const return_table_without_grantsFunctionIdentifer = sql.identifier("c", "return_table_without_grants");
const c_left_armUniques = [{
  attributes: ["id"],
  isPrimary: true
}, {
  attributes: ["person_id"]
}];
const c_left_arm_resourceOptionsConfig = {
  executor: executor,
  name: "c_left_arm",
  identifier: "main.c.left_arm",
  from: cLeftArmIdentifier,
  codec: cLeftArmCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "left_arm"
    }
  },
  uniques: c_left_armUniques,
  description: "Tracks metadata about the left arms of various people"
};
const authenticate_failFunctionIdentifer = sql.identifier("b", "authenticate_fail");
const b_jwt_token_resourceOptionsConfig = {
  executor: executor,
  name: "b_jwt_token",
  identifier: "main.b.jwt_token",
  from: bJwtTokenIdentifier,
  codec: bJwtTokenCodec,
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
const c_issue756Uniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const c_issue756_resourceOptionsConfig = {
  executor: executor,
  name: "c_issue756",
  identifier: "main.c.issue756",
  from: cIssue756Identifier,
  codec: cIssue756Codec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "issue756"
    }
  },
  uniques: c_issue756Uniques
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
const compound_type_computed_fieldFunctionIdentifer = sql.identifier("c", "compound_type_computed_field");
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
const func_out_out_compound_typeFunctionIdentifer = sql.identifier("c", "func_out_out_compound_type");
const mutation_out_out_compound_typeFunctionIdentifer = sql.identifier("c", "mutation_out_out_compound_type");
const table_mutationFunctionIdentifer = sql.identifier("c", "table_mutation");
const table_queryFunctionIdentifer = sql.identifier("c", "table_query");
const post_with_suffixFunctionIdentifer = sql.identifier("a", "post_with_suffix");
const person_computed_outFunctionIdentifer = sql.identifier("c", "person_computed_out");
const person_first_nameFunctionIdentifer = sql.identifier("c", "person_first_name");
const person_computed_out_outFunctionIdentifer = sql.identifier("c", "person_computed_out_out");
const compound_type_set_queryFunctionIdentifer = sql.identifier("c", "compound_type_set_query");
const c_compound_type_resourceOptionsConfig = {
  executor: executor,
  name: "c_compound_type",
  identifier: "main.c.compound_type",
  from: cCompoundTypeIdentifier,
  codec: cCompoundTypeCodec,
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
const person_computed_inoutFunctionIdentifer = sql.identifier("c", "person_computed_inout");
const person_computed_inout_outFunctionIdentifer = sql.identifier("c", "person_computed_inout_out");
const person_existsFunctionIdentifer = sql.identifier("c", "person_exists");
const list_of_compound_types_mutationFunctionIdentifer = sql.identifier("c", "list_of_compound_types_mutation");
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
const person_first_postFunctionIdentifer = sql.identifier("c", "person_first_post");
const post_manyFunctionIdentifer = sql.identifier("a", "post_many");
const c_personUniques = [{
  attributes: ["id"],
  isPrimary: true
}, {
  attributes: ["email"]
}];
const c_person_resourceOptionsConfig = {
  executor: executor,
  name: "c_person",
  identifier: "main.c.person",
  from: cPersonIdentifier,
  codec: cPersonCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "person"
    }
  },
  uniques: c_personUniques,
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
const b_listsUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const b_typesUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const b_types_resourceOptionsConfig = {
  executor: executor,
  name: "b_types",
  identifier: "main.b.types",
  from: bTypesIdentifier,
  codec: bTypesCodec,
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
  uniques: b_typesUniques
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
    CFuncOutOutRecord: registryConfig_pgCodecs_CFuncOutOutRecord_CFuncOutOutRecord,
    CFuncOutOutSetofRecord: registryConfig_pgCodecs_CFuncOutOutSetofRecord_CFuncOutOutSetofRecord,
    CFuncOutOutUnnamedRecord: registryConfig_pgCodecs_CFuncOutOutUnnamedRecord_CFuncOutOutUnnamedRecord,
    CMutationOutOutRecord: registryConfig_pgCodecs_CMutationOutOutRecord_CMutationOutOutRecord,
    CMutationOutOutSetofRecord: registryConfig_pgCodecs_CMutationOutOutSetofRecord_CMutationOutOutSetofRecord,
    CMutationOutOutUnnamedRecord: registryConfig_pgCodecs_CMutationOutOutUnnamedRecord_CMutationOutOutUnnamedRecord,
    CSearchTestSummariesRecord: registryConfig_pgCodecs_CSearchTestSummariesRecord_CSearchTestSummariesRecord,
    CFuncOutUnnamedOutOutUnnamedRecord: registryConfig_pgCodecs_CFuncOutUnnamedOutOutUnnamedRecord_CFuncOutUnnamedOutOutUnnamedRecord,
    CMutationOutUnnamedOutOutUnnamedRecord: registryConfig_pgCodecs_CMutationOutUnnamedOutOutUnnamedRecord_CMutationOutUnnamedOutOutUnnamedRecord,
    CMutationReturnsTableMultiColRecord: registryConfig_pgCodecs_CMutationReturnsTableMultiColRecord_CMutationReturnsTableMultiColRecord,
    uuidArray: LIST_TYPES.uuid,
    uuid: TYPES.uuid,
    CFuncReturnsTableMultiColRecord: registryConfig_pgCodecs_CFuncReturnsTableMultiColRecord_CFuncReturnsTableMultiColRecord,
    bGuid: bGuidCodec,
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
    cMyTable: cMyTableCodec,
    cPersonSecret: cPersonSecretCodec,
    cUnlogged: cUnloggedCodec,
    viewTable: viewTableCodec,
    bUpdatableView: bUpdatableViewCodec,
    cCompoundKey: cCompoundKeyCodec,
    bool: TYPES.boolean,
    similarTable1: similarTable1Codec,
    similarTable2: similarTable2Codec,
    cNullTestRecord: cNullTestRecordCodec,
    cEdgeCase: cEdgeCaseCodec,
    int2: TYPES.int2,
    cLeftArm: cLeftArmCodec,
    float8: TYPES.float,
    bJwtToken: bJwtTokenCodec,
    numeric: TYPES.numeric,
    cIssue756: cIssue756Codec,
    cNotNullTimestamp: cNotNullTimestampCodec,
    timestamptz: TYPES.timestamptz,
    bAuthPayload: bAuthPayloadCodec,
    CQueryOutputTwoRowsRecord: registryConfig_pgCodecs_CQueryOutputTwoRowsRecord_CQueryOutputTwoRowsRecord,
    post: postCodec,
    anEnumArray: anEnumArrayCodec,
    anEnum: anEnumCodec,
    comptypeArray: comptypeArrayCodec,
    comptype: comptypeCodec,
    CFuncOutOutCompoundTypeRecord: registryConfig_pgCodecs_CFuncOutOutCompoundTypeRecord_CFuncOutOutCompoundTypeRecord,
    cCompoundType: cCompoundTypeCodec,
    bColor: bColorCodec,
    bEnumCaps: bEnumCapsCodec,
    bEnumWithEmptyString: bEnumWithEmptyStringCodec,
    CMutationOutOutCompoundTypeRecord: registryConfig_pgCodecs_CMutationOutOutCompoundTypeRecord_CMutationOutOutCompoundTypeRecord,
    CPersonComputedOutOutRecord: registryConfig_pgCodecs_CPersonComputedOutOutRecord_CPersonComputedOutOutRecord,
    CPersonComputedInoutOutRecord: registryConfig_pgCodecs_CPersonComputedInoutOutRecord_CPersonComputedInoutOutRecord,
    CPersonComputedFirstArgInoutOutRecord: registryConfig_pgCodecs_CPersonComputedFirstArgInoutOutRecord_CPersonComputedFirstArgInoutOutRecord,
    cPerson: cPersonCodec,
    bEmail: bEmailCodec,
    bWrappedUrl: bWrappedUrlCodec,
    bNotNullUrl: bNotNullUrlCodec,
    hstore: TYPES.hstore,
    inet: TYPES.inet,
    cidr: TYPES.cidr,
    macaddr: TYPES.macaddr,
    timestamp: TYPES.timestamp,
    CFuncOutComplexRecord: registryConfig_pgCodecs_CFuncOutComplexRecord_CFuncOutComplexRecord,
    CFuncOutComplexSetofRecord: registryConfig_pgCodecs_CFuncOutComplexSetofRecord_CFuncOutComplexSetofRecord,
    CMutationOutComplexRecord: registryConfig_pgCodecs_CMutationOutComplexRecord_CMutationOutComplexRecord,
    CMutationOutComplexSetofRecord: registryConfig_pgCodecs_CMutationOutComplexSetofRecord_CMutationOutComplexSetofRecord,
    CPersonComputedComplexRecord: registryConfig_pgCodecs_CPersonComputedComplexRecord_CPersonComputedComplexRecord,
    bLists: bListsCodec,
    int4Array: LIST_TYPES.int,
    bColorArray: bColorArrayCodec,
    dateArray: LIST_TYPES.date,
    date: TYPES.date,
    timestamptzArray: LIST_TYPES.timestamptz,
    cCompoundTypeArray: cCompoundTypeArrayCodec,
    byteaArray: LIST_TYPES.bytea,
    bytea: TYPES.bytea,
    bTypes: bTypesCodec,
    anInt: anIntCodec,
    bAnotherInt: bAnotherIntCodec,
    jsonpath: TYPES.jsonpath,
    pgCatalogNumrange: pgCatalogNumrangeCodec,
    pgCatalogDaterange: pgCatalogDaterangeCodec,
    anIntRange: anIntRangeCodec,
    time: TYPES.time,
    timetz: TYPES.timetz,
    money: TYPES.money,
    bNestedCompoundType: bNestedCompoundTypeCodec,
    point: TYPES.point,
    regproc: TYPES.regproc,
    regprocedure: TYPES.regprocedure,
    regoper: TYPES.regoper,
    regoperator: TYPES.regoperator,
    regclass: TYPES.regclass,
    regtype: TYPES.regtype,
    regconfig: TYPES.regconfig,
    regdictionary: TYPES.regdictionary,
    cTextArrayDomain: cTextArrayDomainCodec,
    cInt8ArrayDomain: cInt8ArrayDomainCodec,
    ltree: spec_bTypes_attributes_ltree_codec_ltree,
    "ltree[]": spec_bTypes_attributes_ltree_array_codec_ltree_,
    bpchar: TYPES.bpchar,
    bJwtTokenArray: listOfCodec(bJwtTokenCodec, {
      name: "bJwtTokenArray",
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "_jwt_token"
        }
      }
    }),
    bTypesArray: listOfCodec(bTypesCodec, {
      name: "bTypesArray",
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "_types"
        }
      }
    }),
    cFloatrange: cFloatrangeCodec,
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
          constraintName: "FAKE_enum_tables_abcd_view_primaryKey_4"
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
    EnumTablesLotsOfEnumEnum3Enum: enumCodec({
      name: "EnumTablesLotsOfEnumEnum3Enum",
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
          name: "EnumTablesLotsOfEnumEnum3"
        }
      }
    }),
    EnumTablesLotsOfEnumEnum4Enum: enumCodec({
      name: "EnumTablesLotsOfEnumEnum4Enum",
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
          name: "EnumTablesLotsOfEnumEnum4"
        }
      }
    }),
    EnumTablesSimpleEnumEnum: enumCodec({
      name: "EnumTablesSimpleEnumEnum",
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
          name: "EnumTablesSimpleEnum"
        }
      }
    }),
    PartitionsEntityKindEnum: enumCodec({
      name: "PartitionsEntityKindEnum",
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
          name: "PartitionsEntityKind"
        }
      }
    }),
    FunctionReturningEnumEnumTableTransportationEnum: enumCodec({
      name: "FunctionReturningEnumEnumTableTransportationEnum",
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
          name: "FunctionReturningEnumEnumTableTransportation"
        }
      }
    }),
    FunctionReturningEnumLengthStatusEnum: enumCodec({
      name: "FunctionReturningEnumLengthStatusEnum",
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
          name: "FunctionReturningEnumLengthStatus"
        }
      }
    }),
    FunctionReturningEnumStageOptionEnum: enumCodec({
      name: "FunctionReturningEnumStageOptionEnum",
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
          name: "FunctionReturningEnumStageOption"
        }
      }
    })
  },
  pgResources: {
    __proto__: null,
    c_current_user_id: {
      executor: executor,
      name: "c_current_user_id",
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
    c_func_out: {
      executor: executor,
      name: "c_func_out",
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
    c_func_out_setof: {
      executor: executor,
      name: "c_func_out_setof",
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
    c_func_out_unnamed: {
      executor: executor,
      name: "c_func_out_unnamed",
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
    c_mutation_out: {
      executor: executor,
      name: "c_mutation_out",
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
    c_mutation_out_setof: {
      executor: executor,
      name: "c_mutation_out_setof",
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
    c_mutation_out_unnamed: {
      executor: executor,
      name: "c_mutation_out_unnamed",
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
    c_no_args_mutation: {
      executor: executor,
      name: "c_no_args_mutation",
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
    c_no_args_query: {
      executor: executor,
      name: "c_no_args_query",
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
    c_func_in_out: {
      executor: executor,
      name: "c_func_in_out",
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
    c_func_returns_table_one_col: {
      executor: executor,
      name: "c_func_returns_table_one_col",
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
    c_mutation_in_out: {
      executor: executor,
      name: "c_mutation_in_out",
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
    c_mutation_returns_table_one_col: {
      executor: executor,
      name: "c_mutation_returns_table_one_col",
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
          omit: "execute"
        }
      },
      isUnique: true
    },
    c_json_identity: {
      executor: executor,
      name: "c_json_identity",
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
    c_json_identity_mutation: {
      executor: executor,
      name: "c_json_identity_mutation",
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
    c_jsonb_identity: {
      executor: executor,
      name: "c_jsonb_identity",
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
    c_jsonb_identity_mutation: {
      executor: executor,
      name: "c_jsonb_identity_mutation",
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
    c_jsonb_identity_mutation_plpgsql: {
      executor: executor,
      name: "c_jsonb_identity_mutation_plpgsql",
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
    c_jsonb_identity_mutation_plpgsql_with_default: {
      executor: executor,
      name: "c_jsonb_identity_mutation_plpgsql_with_default",
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
    b_mult_1: {
      executor: executor,
      name: "b_mult_1",
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
    b_mult_2: {
      executor: executor,
      name: "b_mult_2",
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
    b_mult_3: {
      executor: executor,
      name: "b_mult_3",
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
    b_mult_4: {
      executor: executor,
      name: "b_mult_4",
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
    c_func_in_inout: {
      executor: executor,
      name: "c_func_in_inout",
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
    c_func_out_out: {
      executor: executor,
      name: "c_func_out_out",
      identifier: "main.c.func_out_out(int4,text)",
      from(...args) {
        return sql`${func_out_outFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      codec: registryConfig_pgCodecs_CFuncOutOutRecord_CFuncOutOutRecord,
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
    c_func_out_out_setof: {
      executor: executor,
      name: "c_func_out_out_setof",
      identifier: "main.c.func_out_out_setof(int4,text)",
      from(...args) {
        return sql`${func_out_out_setofFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      codec: registryConfig_pgCodecs_CFuncOutOutSetofRecord_CFuncOutOutSetofRecord,
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_out_out_setof"
        }
      }
    },
    c_func_out_out_unnamed: {
      executor: executor,
      name: "c_func_out_out_unnamed",
      identifier: "main.c.func_out_out_unnamed(int4,text)",
      from(...args) {
        return sql`${func_out_out_unnamedFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      codec: registryConfig_pgCodecs_CFuncOutOutUnnamedRecord_CFuncOutOutUnnamedRecord,
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
    c_mutation_in_inout: {
      executor: executor,
      name: "c_mutation_in_inout",
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
    c_mutation_out_out: {
      executor: executor,
      name: "c_mutation_out_out",
      identifier: "main.c.mutation_out_out(int4,text)",
      from(...args) {
        return sql`${mutation_out_outFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      codec: registryConfig_pgCodecs_CMutationOutOutRecord_CMutationOutOutRecord,
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
    c_mutation_out_out_setof: {
      executor: executor,
      name: "c_mutation_out_out_setof",
      identifier: "main.c.mutation_out_out_setof(int4,text)",
      from(...args) {
        return sql`${mutation_out_out_setofFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      codec: registryConfig_pgCodecs_CMutationOutOutSetofRecord_CMutationOutOutSetofRecord,
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
    c_mutation_out_out_unnamed: {
      executor: executor,
      name: "c_mutation_out_out_unnamed",
      identifier: "main.c.mutation_out_out_unnamed(int4,text)",
      from(...args) {
        return sql`${mutation_out_out_unnamedFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      codec: registryConfig_pgCodecs_CMutationOutOutUnnamedRecord_CMutationOutOutUnnamedRecord,
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
    c_search_test_summaries: {
      executor: executor,
      name: "c_search_test_summaries",
      identifier: "main.c.search_test_summaries(int4,interval)",
      from(...args) {
        return sql`${search_test_summariesFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      codec: registryConfig_pgCodecs_CSearchTestSummariesRecord_CSearchTestSummariesRecord,
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "search_test_summaries"
        },
        tags: {
          simpleCollections: "only"
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
    c_func_out_unnamed_out_out_unnamed: {
      executor: executor,
      name: "c_func_out_unnamed_out_out_unnamed",
      identifier: "main.c.func_out_unnamed_out_out_unnamed(int4,text,int4)",
      from(...args) {
        return sql`${func_out_unnamed_out_out_unnamedFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      codec: registryConfig_pgCodecs_CFuncOutUnnamedOutOutUnnamedRecord_CFuncOutUnnamedOutOutUnnamedRecord,
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
    c_int_set_mutation: {
      executor: executor,
      name: "c_int_set_mutation",
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
    c_int_set_query: {
      executor: executor,
      name: "c_int_set_query",
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
    c_mutation_out_unnamed_out_out_unnamed: {
      executor: executor,
      name: "c_mutation_out_unnamed_out_out_unnamed",
      identifier: "main.c.mutation_out_unnamed_out_out_unnamed(int4,text,int4)",
      from(...args) {
        return sql`${mutation_out_unnamed_out_out_unnamedFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      codec: registryConfig_pgCodecs_CMutationOutUnnamedOutOutUnnamedRecord_CMutationOutUnnamedOutOutUnnamedRecord,
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
    c_mutation_returns_table_multi_col: {
      executor: executor,
      name: "c_mutation_returns_table_multi_col",
      identifier: "main.c.mutation_returns_table_multi_col(int4,int4,text)",
      from(...args) {
        return sql`${mutation_returns_table_multi_colFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "i",
        codec: TYPES.int,
        required: true
      }],
      codec: registryConfig_pgCodecs_CMutationReturnsTableMultiColRecord_CMutationReturnsTableMultiColRecord,
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
    b_list_bde_mutation: {
      executor: executor,
      name: "b_list_bde_mutation",
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
    c_func_returns_table_multi_col: {
      executor: executor,
      name: "c_func_returns_table_multi_col",
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
      codec: registryConfig_pgCodecs_CFuncReturnsTableMultiColRecord_CFuncReturnsTableMultiColRecord,
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_returns_table_multi_col"
        }
      }
    },
    b_guid_fn: {
      executor: executor,
      name: "b_guid_fn",
      identifier: "main.b.guid_fn(b.guid)",
      from(...args) {
        return sql`${guid_fnFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "g",
        codec: bGuidCodec,
        required: true
      }],
      codec: bGuidCodec,
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
    c_my_table: {
      executor: executor,
      name: "c_my_table",
      identifier: "main.c.my_table",
      from: cMyTableIdentifier,
      codec: cMyTableCodec,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "my_table"
        }
      },
      uniques: c_my_tableUniques
    },
    c_person_secret: c_person_secret_resourceOptionsConfig,
    c_unlogged: {
      executor: executor,
      name: "c_unlogged",
      identifier: "main.c.unlogged",
      from: cUnloggedIdentifier,
      codec: cUnloggedCodec,
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
    c_edge_case_computed: {
      executor: executor,
      name: "c_edge_case_computed",
      identifier: "main.c.edge_case_computed(c.edge_case)",
      from(...args) {
        return sql`${edge_case_computedFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "edge_case",
        codec: cEdgeCaseCodec,
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
          sortable: true
        }
      },
      isUnique: true
    },
    b_updatable_view: {
      executor: executor,
      name: "b_updatable_view",
      identifier: "main.b.updatable_view",
      from: bUpdatableViewIdentifier,
      codec: bUpdatableViewCodec,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "updatable_view"
        },
        tags: {
          uniqueKey: "x"
        }
      },
      description: "YOYOYO!!"
    },
    c_compound_key: c_compound_key_resourceOptionsConfig,
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
    c_null_test_record: {
      executor: executor,
      name: "c_null_test_record",
      identifier: "main.c.null_test_record",
      from: cNullTestRecordIdentifier,
      codec: cNullTestRecordCodec,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "null_test_record"
        }
      },
      uniques: c_null_test_recordUniques
    },
    c_return_table_without_grants: PgResource.functionResourceOptions(c_compound_key_resourceOptionsConfig, {
      name: "c_return_table_without_grants",
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
    c_edge_case: {
      executor: executor,
      name: "c_edge_case",
      identifier: "main.c.edge_case",
      from: cEdgeCaseIdentifier,
      codec: cEdgeCaseCodec,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "edge_case"
        }
      }
    },
    c_left_arm: c_left_arm_resourceOptionsConfig,
    b_authenticate_fail: PgResource.functionResourceOptions(b_jwt_token_resourceOptionsConfig, {
      name: "b_authenticate_fail",
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
    b_authenticate: PgResource.functionResourceOptions(b_jwt_token_resourceOptionsConfig, {
      name: "b_authenticate",
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
    c_issue756: c_issue756_resourceOptionsConfig,
    c_types_mutation: {
      executor: executor,
      name: "c_types_mutation",
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
        codec: cFloatrangeCodec,
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
    c_types_query: {
      executor: executor,
      name: "c_types_query",
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
        codec: cFloatrangeCodec,
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
    c_left_arm_identity: PgResource.functionResourceOptions(c_left_arm_resourceOptionsConfig, {
      name: "c_left_arm_identity",
      identifier: "main.c.left_arm_identity(c.left_arm)",
      from(...args) {
        return sql`${left_arm_identityFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "left_arm",
        codec: cLeftArmCodec,
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
    c_issue756_mutation: PgResource.functionResourceOptions(c_issue756_resourceOptionsConfig, {
      name: "c_issue756_mutation",
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
    c_issue756_set_mutation: PgResource.functionResourceOptions(c_issue756_resourceOptionsConfig, {
      name: "c_issue756_set_mutation",
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
    b_authenticate_many: PgResource.functionResourceOptions(b_jwt_token_resourceOptionsConfig, {
      name: "b_authenticate_many",
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
    b_authenticate_payload: PgResource.functionResourceOptions({
      executor: executor,
      name: "b_auth_payload",
      identifier: "main.b.auth_payload",
      from: bAuthPayloadIdentifier,
      codec: bAuthPayloadCodec,
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
      name: "b_authenticate_payload",
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
          filterable: true
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
          filterable: true
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
    c_query_output_two_rows: {
      executor: executor,
      name: "c_query_output_two_rows",
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
      codec: registryConfig_pgCodecs_CQueryOutputTwoRowsRecord_CQueryOutputTwoRowsRecord,
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
    c_compound_type_computed_field: {
      executor: executor,
      name: "c_compound_type_computed_field",
      identifier: "main.c.compound_type_computed_field(c.compound_type)",
      from(...args) {
        return sql`${compound_type_computed_fieldFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "compound_type",
        codec: cCompoundTypeCodec,
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
    post: post_resourceOptionsConfig,
    c_func_out_out_compound_type: {
      executor: executor,
      name: "c_func_out_out_compound_type",
      identifier: "main.c.func_out_out_compound_type(int4,int4,c.compound_type)",
      from(...args) {
        return sql`${func_out_out_compound_typeFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "i1",
        codec: TYPES.int,
        required: true
      }],
      codec: registryConfig_pgCodecs_CFuncOutOutCompoundTypeRecord_CFuncOutOutCompoundTypeRecord,
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
    c_mutation_out_out_compound_type: {
      executor: executor,
      name: "c_mutation_out_out_compound_type",
      identifier: "main.c.mutation_out_out_compound_type(int4,int4,c.compound_type)",
      from(...args) {
        return sql`${mutation_out_out_compound_typeFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "i1",
        codec: TYPES.int,
        required: true
      }],
      codec: registryConfig_pgCodecs_CMutationOutOutCompoundTypeRecord_CMutationOutOutCompoundTypeRecord,
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
    c_table_mutation: PgResource.functionResourceOptions(post_resourceOptionsConfig, {
      name: "c_table_mutation",
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
    c_table_query: PgResource.functionResourceOptions(post_resourceOptionsConfig, {
      name: "c_table_query",
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
    c_person_computed_out: {
      executor: executor,
      name: "c_person_computed_out",
      identifier: "main.c.person_computed_out(c.person,text)",
      from(...args) {
        return sql`${person_computed_outFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "person",
        codec: cPersonCodec,
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
          filterable: true
        },
        singleOutputParameterName: "o1"
      },
      isUnique: true
    },
    c_person_first_name: {
      executor: executor,
      name: "c_person_first_name",
      identifier: "main.c.person_first_name(c.person)",
      from(...args) {
        return sql`${person_first_nameFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "person",
        codec: cPersonCodec,
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
          sortable: true
        }
      },
      isUnique: true,
      description: "The first name of the person."
    },
    c_person_computed_out_out: {
      executor: executor,
      name: "c_person_computed_out_out",
      identifier: "main.c.person_computed_out_out(c.person,text,text)",
      from(...args) {
        return sql`${person_computed_out_outFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "person",
        codec: cPersonCodec,
        required: true
      }],
      codec: registryConfig_pgCodecs_CPersonComputedOutOutRecord_CPersonComputedOutOutRecord,
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
    c_compound_type_set_query: PgResource.functionResourceOptions(c_compound_type_resourceOptionsConfig, {
      name: "c_compound_type_set_query",
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
    b_compound_type_mutation: PgResource.functionResourceOptions(c_compound_type_resourceOptionsConfig, {
      name: "b_compound_type_mutation",
      identifier: "main.b.compound_type_mutation(c.compound_type)",
      from(...args) {
        return sql`${compound_type_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "object",
        codec: cCompoundTypeCodec,
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
    b_compound_type_query: PgResource.functionResourceOptions(c_compound_type_resourceOptionsConfig, {
      name: "b_compound_type_query",
      identifier: "main.b.compound_type_query(c.compound_type)",
      from(...args) {
        return sql`${compound_type_queryFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "object",
        codec: cCompoundTypeCodec,
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
    b_compound_type_set_mutation: PgResource.functionResourceOptions(c_compound_type_resourceOptionsConfig, {
      name: "b_compound_type_set_mutation",
      identifier: "main.b.compound_type_set_mutation(c.compound_type)",
      from(...args) {
        return sql`${compound_type_set_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "object",
        codec: cCompoundTypeCodec,
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
    c_person_computed_inout: {
      executor: executor,
      name: "c_person_computed_inout",
      identifier: "main.c.person_computed_inout(c.person,text)",
      from(...args) {
        return sql`${person_computed_inoutFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "person",
        codec: cPersonCodec,
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
    c_person_computed_inout_out: {
      executor: executor,
      name: "c_person_computed_inout_out",
      identifier: "main.c.person_computed_inout_out(c.person,text,text)",
      from(...args) {
        return sql`${person_computed_inout_outFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "person",
        codec: cPersonCodec,
        required: true
      }, {
        name: "ino",
        codec: TYPES.text,
        required: true
      }],
      codec: registryConfig_pgCodecs_CPersonComputedInoutOutRecord_CPersonComputedInoutOutRecord,
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
    c_person_exists: {
      executor: executor,
      name: "c_person_exists",
      identifier: "main.c.person_exists(c.person,b.email)",
      from(...args) {
        return sql`${person_existsFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "person",
        codec: cPersonCodec,
        required: true
      }, {
        name: "email",
        codec: bEmailCodec,
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
    c_list_of_compound_types_mutation: PgResource.functionResourceOptions(c_compound_type_resourceOptionsConfig, {
      name: "c_list_of_compound_types_mutation",
      identifier: "main.c.list_of_compound_types_mutation(c._compound_type)",
      from(...args) {
        return sql`${list_of_compound_types_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "records",
        codec: cCompoundTypeArrayCodec,
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
    c_person_computed_first_arg_inout_out: {
      executor: executor,
      name: "c_person_computed_first_arg_inout_out",
      identifier: "main.c.person_computed_first_arg_inout_out(c.person,int4)",
      from(...args) {
        return sql`${person_computed_first_arg_inout_outFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "person",
        codec: cPersonCodec,
        required: true
      }],
      codec: registryConfig_pgCodecs_CPersonComputedFirstArgInoutOutRecord_CPersonComputedFirstArgInoutOutRecord,
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
    c_person_optional_missing_middle_1: {
      executor: executor,
      name: "c_person_optional_missing_middle_1",
      identifier: "main.c.person_optional_missing_middle_1(c.person,int4,int4,int4)",
      from(...args) {
        return sql`${person_optional_missing_middle_1FunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "p",
        codec: cPersonCodec,
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
    c_person_optional_missing_middle_2: {
      executor: executor,
      name: "c_person_optional_missing_middle_2",
      identifier: "main.c.person_optional_missing_middle_2(c.person,int4,int4,int4)",
      from(...args) {
        return sql`${person_optional_missing_middle_2FunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "p",
        codec: cPersonCodec,
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
    c_person_optional_missing_middle_3: {
      executor: executor,
      name: "c_person_optional_missing_middle_3",
      identifier: "main.c.person_optional_missing_middle_3(c.person,int4,int4,int4)",
      from(...args) {
        return sql`${person_optional_missing_middle_3FunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "p",
        codec: cPersonCodec,
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
    c_person_optional_missing_middle_4: {
      executor: executor,
      name: "c_person_optional_missing_middle_4",
      identifier: "main.c.person_optional_missing_middle_4(c.person,int4,int4,int4)",
      from(...args) {
        return sql`${person_optional_missing_middle_4FunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "p",
        codec: cPersonCodec,
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
    c_person_optional_missing_middle_5: {
      executor: executor,
      name: "c_person_optional_missing_middle_5",
      identifier: "main.c.person_optional_missing_middle_5(c.person,int4,int4,int4)",
      from(...args) {
        return sql`${person_optional_missing_middle_5FunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "p",
        codec: cPersonCodec,
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
    c_func_out_complex: {
      executor: executor,
      name: "c_func_out_complex",
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
      codec: registryConfig_pgCodecs_CFuncOutComplexRecord_CFuncOutComplexRecord,
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
    c_func_out_complex_setof: {
      executor: executor,
      name: "c_func_out_complex_setof",
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
      codec: registryConfig_pgCodecs_CFuncOutComplexSetofRecord_CFuncOutComplexSetofRecord,
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "func_out_complex_setof"
        }
      }
    },
    c_mutation_out_complex: {
      executor: executor,
      name: "c_mutation_out_complex",
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
      codec: registryConfig_pgCodecs_CMutationOutComplexRecord_CMutationOutComplexRecord,
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
    c_mutation_out_complex_setof: {
      executor: executor,
      name: "c_mutation_out_complex_setof",
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
      codec: registryConfig_pgCodecs_CMutationOutComplexSetofRecord_CMutationOutComplexSetofRecord,
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
    c_person_computed_complex: {
      executor: executor,
      name: "c_person_computed_complex",
      identifier: "main.c.person_computed_complex(c.person,int4,text,int4,c.compound_type,c.person)",
      from(...args) {
        return sql`${person_computed_complexFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "person",
        codec: cPersonCodec,
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
      codec: registryConfig_pgCodecs_CPersonComputedComplexRecord_CPersonComputedComplexRecord,
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
    mutation_compound_type_array: PgResource.functionResourceOptions(c_compound_type_resourceOptionsConfig, {
      name: "mutation_compound_type_array",
      identifier: "main.a.mutation_compound_type_array(c.compound_type)",
      from(...args) {
        return sql`${mutation_compound_type_arrayFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "object",
        codec: cCompoundTypeCodec,
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
    query_compound_type_array: PgResource.functionResourceOptions(c_compound_type_resourceOptionsConfig, {
      name: "query_compound_type_array",
      identifier: "main.a.query_compound_type_array(c.compound_type)",
      from(...args) {
        return sql`${query_compound_type_arrayFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "object",
        codec: cCompoundTypeCodec,
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
    b_compound_type_array_mutation: PgResource.functionResourceOptions(c_compound_type_resourceOptionsConfig, {
      name: "b_compound_type_array_mutation",
      identifier: "main.b.compound_type_array_mutation(c.compound_type)",
      from(...args) {
        return sql`${compound_type_array_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "object",
        codec: cCompoundTypeCodec,
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
    b_compound_type_array_query: PgResource.functionResourceOptions(c_compound_type_resourceOptionsConfig, {
      name: "b_compound_type_array_query",
      identifier: "main.b.compound_type_array_query(c.compound_type)",
      from(...args) {
        return sql`${compound_type_array_queryFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "object",
        codec: cCompoundTypeCodec,
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
    post_computed_compound_type_array: PgResource.functionResourceOptions(c_compound_type_resourceOptionsConfig, {
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
        codec: cCompoundTypeCodec,
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
    c_person_first_post: PgResource.functionResourceOptions(post_resourceOptionsConfig, {
      name: "c_person_first_post",
      identifier: "main.c.person_first_post(c.person)",
      from(...args) {
        return sql`${person_first_postFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "person",
        codec: cPersonCodec,
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
    c_person: c_person_resourceOptionsConfig,
    c_badly_behaved_function: PgResource.functionResourceOptions(c_person_resourceOptionsConfig, {
      name: "c_badly_behaved_function",
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
    c_func_out_table: PgResource.functionResourceOptions(c_person_resourceOptionsConfig, {
      name: "c_func_out_table",
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
    c_func_out_table_setof: PgResource.functionResourceOptions(c_person_resourceOptionsConfig, {
      name: "c_func_out_table_setof",
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
    c_mutation_out_table: PgResource.functionResourceOptions(c_person_resourceOptionsConfig, {
      name: "c_mutation_out_table",
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
    c_mutation_out_table_setof: PgResource.functionResourceOptions(c_person_resourceOptionsConfig, {
      name: "c_mutation_out_table_setof",
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
    c_table_set_mutation: PgResource.functionResourceOptions(c_person_resourceOptionsConfig, {
      name: "c_table_set_mutation",
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
    c_table_set_query: PgResource.functionResourceOptions(c_person_resourceOptionsConfig, {
      name: "c_table_set_query",
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
          filterable: true
        }
      },
      hasImplicitOrder: true
    }),
    c_table_set_query_plpgsql: PgResource.functionResourceOptions(c_person_resourceOptionsConfig, {
      name: "c_table_set_query_plpgsql",
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
    c_person_computed_first_arg_inout: PgResource.functionResourceOptions(c_person_resourceOptionsConfig, {
      name: "c_person_computed_first_arg_inout",
      identifier: "main.c.person_computed_first_arg_inout(c.person)",
      from(...args) {
        return sql`${person_computed_first_arg_inoutFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "person",
        codec: cPersonCodec,
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
    c_person_friends: PgResource.functionResourceOptions(c_person_resourceOptionsConfig, {
      name: "c_person_friends",
      identifier: "main.c.person_friends(c.person)",
      from(...args) {
        return sql`${person_friendsFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "person",
        codec: cPersonCodec,
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
          sortable: true
        }
      },
      hasImplicitOrder: true
    }),
    b_lists: {
      executor: executor,
      name: "b_lists",
      identifier: "main.b.lists",
      from: bListsIdentifier,
      codec: bListsCodec,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "lists"
        }
      },
      uniques: b_listsUniques
    },
    b_types: b_types_resourceOptionsConfig,
    b_type_function_connection: PgResource.functionResourceOptions(b_types_resourceOptionsConfig, {
      name: "b_type_function_connection",
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
    b_type_function_connection_mutation: PgResource.functionResourceOptions(b_types_resourceOptionsConfig, {
      name: "b_type_function_connection_mutation",
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
    b_type_function: PgResource.functionResourceOptions(b_types_resourceOptionsConfig, {
      name: "b_type_function",
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
    b_type_function_mutation: PgResource.functionResourceOptions(b_types_resourceOptionsConfig, {
      name: "b_type_function_mutation",
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
    c_person_type_function_connection: PgResource.functionResourceOptions(b_types_resourceOptionsConfig, {
      name: "c_person_type_function_connection",
      identifier: "main.c.person_type_function_connection(c.person)",
      from(...args) {
        return sql`${person_type_function_connectionFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "p",
        codec: cPersonCodec,
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
    c_person_type_function: PgResource.functionResourceOptions(b_types_resourceOptionsConfig, {
      name: "c_person_type_function",
      identifier: "main.c.person_type_function(c.person,int4)",
      from(...args) {
        return sql`${person_type_functionFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "p",
        codec: cPersonCodec,
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
    b_type_function_list: PgResource.functionResourceOptions(b_types_resourceOptionsConfig, {
      name: "b_type_function_list",
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
    b_type_function_list_mutation: PgResource.functionResourceOptions(b_types_resourceOptionsConfig, {
      name: "b_type_function_list_mutation",
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
    c_person_type_function_list: PgResource.functionResourceOptions(b_types_resourceOptionsConfig, {
      name: "c_person_type_function_list",
      identifier: "main.c.person_type_function_list(c.person)",
      from(...args) {
        return sql`${person_type_function_listFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "p",
        codec: cPersonCodec,
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
      cCompoundKeyByMyCompoundKey1AndCompoundKey2: {
        localCodec: foreignKeyCodec,
        remoteResourceOptions: c_compound_key_resourceOptionsConfig,
        localAttributes: ["compound_key_1", "compound_key_2"],
        remoteAttributes: ["person_id_1", "person_id_2"],
        isUnique: true
      },
      cPersonByMyPersonId: {
        localCodec: foreignKeyCodec,
        remoteResourceOptions: c_person_resourceOptionsConfig,
        localAttributes: ["person_id"],
        remoteAttributes: ["id"],
        isUnique: true
      }
    },
    post: {
      __proto__: null,
      cPersonByMyAuthorId: {
        localCodec: postCodec,
        remoteResourceOptions: c_person_resourceOptionsConfig,
        localAttributes: ["author_id"],
        remoteAttributes: ["id"],
        isUnique: true
      },
      bTypesByTheirSmallint: {
        localCodec: postCodec,
        remoteResourceOptions: b_types_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["smallint"],
        isReferencee: true
      },
      bTypesByTheirId: {
        localCodec: postCodec,
        remoteResourceOptions: b_types_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["id"],
        isUnique: true,
        isReferencee: true
      }
    },
    uniqueForeignKey: {
      __proto__: null,
      cCompoundKeyByMyCompoundKey1AndCompoundKey2: {
        localCodec: uniqueForeignKeyCodec,
        remoteResourceOptions: c_compound_key_resourceOptionsConfig,
        localAttributes: ["compound_key_1", "compound_key_2"],
        remoteAttributes: ["person_id_1", "person_id_2"],
        isUnique: true
      }
    },
    bAuthPayload: {
      __proto__: null,
      cPersonByMyId: {
        localCodec: bAuthPayloadCodec,
        remoteResourceOptions: c_person_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["id"],
        isUnique: true
      }
    },
    bTypes: {
      __proto__: null,
      postByMySmallint: {
        localCodec: bTypesCodec,
        remoteResourceOptions: post_resourceOptionsConfig,
        localAttributes: ["smallint"],
        remoteAttributes: ["id"],
        isUnique: true
      },
      postByMyId: {
        localCodec: bTypesCodec,
        remoteResourceOptions: post_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["id"],
        isUnique: true
      }
    },
    cCompoundKey: {
      __proto__: null,
      cPersonByMyPersonId1: {
        localCodec: cCompoundKeyCodec,
        remoteResourceOptions: c_person_resourceOptionsConfig,
        localAttributes: ["person_id_1"],
        remoteAttributes: ["id"],
        isUnique: true
      },
      cPersonByMyPersonId2: {
        localCodec: cCompoundKeyCodec,
        remoteResourceOptions: c_person_resourceOptionsConfig,
        localAttributes: ["person_id_2"],
        remoteAttributes: ["id"],
        isUnique: true
      },
      foreignKeysByTheirCompoundKey1AndCompoundKey2: {
        localCodec: cCompoundKeyCodec,
        remoteResourceOptions: foreign_key_resourceOptionsConfig,
        localAttributes: ["person_id_1", "person_id_2"],
        remoteAttributes: ["compound_key_1", "compound_key_2"],
        isReferencee: true
      },
      uniqueForeignKeyByTheirCompoundKey1AndCompoundKey2: {
        localCodec: cCompoundKeyCodec,
        remoteResourceOptions: unique_foreign_key_resourceOptionsConfig,
        localAttributes: ["person_id_1", "person_id_2"],
        remoteAttributes: ["compound_key_1", "compound_key_2"],
        isUnique: true,
        isReferencee: true
      }
    },
    cLeftArm: {
      __proto__: null,
      cPersonByMyPersonId: {
        localCodec: cLeftArmCodec,
        remoteResourceOptions: c_person_resourceOptionsConfig,
        localAttributes: ["person_id"],
        remoteAttributes: ["id"],
        isUnique: true
      }
    },
    cPerson: {
      __proto__: null,
      postsByTheirAuthorId: {
        localCodec: cPersonCodec,
        remoteResourceOptions: post_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["author_id"],
        isReferencee: true
      },
      foreignKeysByTheirPersonId: {
        localCodec: cPersonCodec,
        remoteResourceOptions: foreign_key_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["person_id"],
        isReferencee: true
      },
      cPersonSecretByTheirPersonId: {
        localCodec: cPersonCodec,
        remoteResourceOptions: c_person_secret_resourceOptionsConfig,
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
      cLeftArmByTheirPersonId: {
        localCodec: cPersonCodec,
        remoteResourceOptions: c_left_arm_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["person_id"],
        isUnique: true,
        isReferencee: true
      },
      cCompoundKeysByTheirPersonId1: {
        localCodec: cPersonCodec,
        remoteResourceOptions: c_compound_key_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["person_id_1"],
        isReferencee: true
      },
      cCompoundKeysByTheirPersonId2: {
        localCodec: cPersonCodec,
        remoteResourceOptions: c_compound_key_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["person_id_2"],
        isReferencee: true
      }
    },
    cPersonSecret: {
      __proto__: null,
      cPersonByMyPersonId: {
        localCodec: cPersonSecretCodec,
        remoteResourceOptions: c_person_resourceOptionsConfig,
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
const resource_c_my_tablePgResource = registry.pgResources["c_my_table"];
const resource_c_person_secretPgResource = registry.pgResources["c_person_secret"];
const resource_view_tablePgResource = registry.pgResources["view_table"];
const resource_c_compound_keyPgResource = registry.pgResources["c_compound_key"];
const resource_similar_table_1PgResource = registry.pgResources["similar_table_1"];
const resource_similar_table_2PgResource = registry.pgResources["similar_table_2"];
const resource_c_null_test_recordPgResource = registry.pgResources["c_null_test_record"];
const resource_c_left_armPgResource = registry.pgResources["c_left_arm"];
const resource_c_issue756PgResource = registry.pgResources["c_issue756"];
const resource_postPgResource = registry.pgResources["post"];
const resource_c_personPgResource = registry.pgResources["c_person"];
const resource_b_listsPgResource = registry.pgResources["b_lists"];
const resource_b_typesPgResource = registry.pgResources["b_types"];
const EMPTY_ARRAY = [];
const makeArgs_c_person_computed_out = () => EMPTY_ARRAY;
const resource_c_current_user_idPgResource = registry.pgResources["c_current_user_id"];
const resource_c_func_outPgResource = registry.pgResources["c_func_out"];
const resource_c_func_out_setofPgResource = registry.pgResources["c_func_out_setof"];
const c_func_out_setof_getSelectPlanFromParentAndArgs = ($root, args, _info) => {
  const selectArgs = makeArgs_c_person_computed_out(args);
  return resource_c_func_out_setofPgResource.execute(selectArgs);
};
function applyFirstArg(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function applyOffsetArg(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function applyAfterArg(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
const resource_c_func_out_unnamedPgResource = registry.pgResources["c_func_out_unnamed"];
const resource_c_no_args_queryPgResource = registry.pgResources["c_no_args_query"];
const resource_query_interval_arrayPgResource = registry.pgResources["query_interval_array"];
const resource_query_interval_setPgResource = registry.pgResources["query_interval_set"];
const query_interval_set_getSelectPlanFromParentAndArgs = ($root, args, _info) => {
  const selectArgs = makeArgs_c_person_computed_out(args);
  return resource_query_interval_setPgResource.execute(selectArgs);
};
const resource_query_text_arrayPgResource = registry.pgResources["query_text_array"];
const resource_static_big_integerPgResource = registry.pgResources["static_big_integer"];
const static_big_integer_getSelectPlanFromParentAndArgs = ($root, args, _info) => {
  const selectArgs = makeArgs_c_person_computed_out(args);
  return resource_static_big_integerPgResource.execute(selectArgs);
};
const argDetailsSimple_c_func_in_out = [{
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
const makeArgs_c_func_in_out = (args, path = []) => argDetailsSimple_c_func_in_out.map(details => makeArg(path, args, details));
const resource_c_func_in_outPgResource = registry.pgResources["c_func_in_out"];
const argDetailsSimple_c_func_returns_table_one_col = [{
  graphqlArgName: "i",
  pgCodec: TYPES.int,
  postgresArgName: "i",
  required: true
}];
const makeArgs_c_func_returns_table_one_col = (args, path = []) => argDetailsSimple_c_func_returns_table_one_col.map(details => makeArg(path, args, details));
const resource_c_func_returns_table_one_colPgResource = registry.pgResources["c_func_returns_table_one_col"];
const c_func_returns_table_one_col_getSelectPlanFromParentAndArgs = ($root, args, _info) => {
  const selectArgs = makeArgs_c_func_returns_table_one_col(args);
  return resource_c_func_returns_table_one_colPgResource.execute(selectArgs);
};
const argDetailsSimple_c_json_identity = [{
  graphqlArgName: "json",
  pgCodec: TYPES.json,
  postgresArgName: "json",
  required: true
}];
const makeArgs_c_json_identity = (args, path = []) => argDetailsSimple_c_json_identity.map(details => makeArg(path, args, details));
const resource_c_json_identityPgResource = registry.pgResources["c_json_identity"];
const argDetailsSimple_c_jsonb_identity = [{
  graphqlArgName: "json",
  pgCodec: TYPES.jsonb,
  postgresArgName: "json",
  required: true
}];
const makeArgs_c_jsonb_identity = (args, path = []) => argDetailsSimple_c_jsonb_identity.map(details => makeArg(path, args, details));
const resource_c_jsonb_identityPgResource = registry.pgResources["c_jsonb_identity"];
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
const argDetailsSimple_c_func_in_inout = [{
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
const makeArgs_c_func_in_inout = (args, path = []) => argDetailsSimple_c_func_in_inout.map(details => makeArg(path, args, details));
const resource_c_func_in_inoutPgResource = registry.pgResources["c_func_in_inout"];
const resource_c_func_out_outPgResource = registry.pgResources["c_func_out_out"];
const resource_c_func_out_out_setofPgResource = registry.pgResources["c_func_out_out_setof"];
const c_func_out_out_setof_getSelectPlanFromParentAndArgs = ($root, args, _info) => {
  const selectArgs = makeArgs_c_person_computed_out(args);
  return resource_c_func_out_out_setofPgResource.execute(selectArgs);
};
const resource_c_func_out_out_unnamedPgResource = registry.pgResources["c_func_out_out_unnamed"];
const resource_c_search_test_summariesPgResource = registry.pgResources["c_search_test_summaries"];
const c_search_test_summaries_getSelectPlanFromParentAndArgs = ($root, args, _info) => {
  const selectArgs = makeArgs_c_person_computed_out(args);
  return resource_c_search_test_summariesPgResource.execute(selectArgs);
};
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
const resource_c_func_out_unnamed_out_out_unnamedPgResource = registry.pgResources["c_func_out_unnamed_out_out_unnamed"];
const argDetailsSimple_c_int_set_query = [{
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
const makeArgs_c_int_set_query = (args, path = []) => argDetailsSimple_c_int_set_query.map(details => makeArg(path, args, details));
const resource_c_int_set_queryPgResource = registry.pgResources["c_int_set_query"];
const c_int_set_query_getSelectPlanFromParentAndArgs = ($root, args, _info) => {
  const selectArgs = makeArgs_c_int_set_query(args);
  return resource_c_int_set_queryPgResource.execute(selectArgs);
};
const argDetailsSimple_c_func_returns_table_multi_col = [{
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
const makeArgs_c_func_returns_table_multi_col = (args, path = []) => argDetailsSimple_c_func_returns_table_multi_col.map(details => makeArg(path, args, details));
const resource_c_func_returns_table_multi_colPgResource = registry.pgResources["c_func_returns_table_multi_col"];
const c_func_returns_table_multi_col_getSelectPlanFromParentAndArgs = ($root, args, _info) => {
  const selectArgs = makeArgs_c_func_returns_table_multi_col(args);
  return resource_c_func_returns_table_multi_colPgResource.execute(selectArgs);
};
const resource_c_return_table_without_grantsPgResource = registry.pgResources["c_return_table_without_grants"];
const argDetailsSimple_c_types_query = [{
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
  pgCodec: cFloatrangeCodec,
  postgresArgName: "f",
  required: true
}];
const makeArgs_c_types_query = (args, path = []) => argDetailsSimple_c_types_query.map(details => makeArg(path, args, details));
const resource_c_types_queryPgResource = registry.pgResources["c_types_query"];
const argDetailsSimple_c_query_output_two_rows = [{
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
const makeArgs_c_query_output_two_rows = (args, path = []) => argDetailsSimple_c_query_output_two_rows.map(details => makeArg(path, args, details));
const resource_c_query_output_two_rowsPgResource = registry.pgResources["c_query_output_two_rows"];
const argDetailsSimple_c_compound_type_computed_field = [{
  graphqlArgName: "compoundType",
  pgCodec: cCompoundTypeCodec,
  postgresArgName: "compound_type",
  required: true
}];
const makeArgs_c_compound_type_computed_field = (args, path = []) => argDetailsSimple_c_compound_type_computed_field.map(details => makeArg(path, args, details));
const resource_c_compound_type_computed_fieldPgResource = registry.pgResources["c_compound_type_computed_field"];
const argDetailsSimple_c_func_out_out_compound_type = [{
  graphqlArgName: "i1",
  pgCodec: TYPES.int,
  postgresArgName: "i1",
  required: true
}];
const makeArgs_c_func_out_out_compound_type = (args, path = []) => argDetailsSimple_c_func_out_out_compound_type.map(details => makeArg(path, args, details));
const resource_c_func_out_out_compound_typePgResource = registry.pgResources["c_func_out_out_compound_type"];
const argDetailsSimple_c_table_query = [{
  graphqlArgName: "id",
  pgCodec: TYPES.int,
  postgresArgName: "id",
  required: true
}];
const makeArgs_c_table_query = (args, path = []) => argDetailsSimple_c_table_query.map(details => makeArg(path, args, details));
const resource_c_table_queryPgResource = registry.pgResources["c_table_query"];
const resource_c_compound_type_set_queryPgResource = registry.pgResources["c_compound_type_set_query"];
const c_compound_type_set_query_getSelectPlanFromParentAndArgs = ($root, args, _info) => {
  const selectArgs = makeArgs_c_person_computed_out(args);
  return resource_c_compound_type_set_queryPgResource.execute(selectArgs);
};
const argDetailsSimple_b_compound_type_query = [{
  graphqlArgName: "object",
  pgCodec: cCompoundTypeCodec,
  postgresArgName: "object",
  required: true
}];
const makeArgs_b_compound_type_query = (args, path = []) => argDetailsSimple_b_compound_type_query.map(details => makeArg(path, args, details));
const resource_b_compound_type_queryPgResource = registry.pgResources["b_compound_type_query"];
const argDetailsSimple_c_func_out_complex = [{
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
const makeArgs_c_func_out_complex = (args, path = []) => argDetailsSimple_c_func_out_complex.map(details => makeArg(path, args, details));
const resource_c_func_out_complexPgResource = registry.pgResources["c_func_out_complex"];
const argDetailsSimple_c_func_out_complex_setof = [{
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
const makeArgs_c_func_out_complex_setof = (args, path = []) => argDetailsSimple_c_func_out_complex_setof.map(details => makeArg(path, args, details));
const resource_c_func_out_complex_setofPgResource = registry.pgResources["c_func_out_complex_setof"];
const c_func_out_complex_setof_getSelectPlanFromParentAndArgs = ($root, args, _info) => {
  const selectArgs = makeArgs_c_func_out_complex_setof(args);
  return resource_c_func_out_complex_setofPgResource.execute(selectArgs);
};
const argDetailsSimple_query_compound_type_array = [{
  graphqlArgName: "object",
  pgCodec: cCompoundTypeCodec,
  postgresArgName: "object",
  required: true
}];
const makeArgs_query_compound_type_array = (args, path = []) => argDetailsSimple_query_compound_type_array.map(details => makeArg(path, args, details));
const resource_query_compound_type_arrayPgResource = registry.pgResources["query_compound_type_array"];
const argDetailsSimple_b_compound_type_array_query = [{
  graphqlArgName: "object",
  pgCodec: cCompoundTypeCodec,
  postgresArgName: "object",
  required: true
}];
const makeArgs_b_compound_type_array_query = (args, path = []) => argDetailsSimple_b_compound_type_array_query.map(details => makeArg(path, args, details));
const resource_b_compound_type_array_queryPgResource = registry.pgResources["b_compound_type_array_query"];
const resource_c_badly_behaved_functionPgResource = registry.pgResources["c_badly_behaved_function"];
const c_badly_behaved_function_getSelectPlanFromParentAndArgs = ($root, args, _info) => {
  const selectArgs = makeArgs_c_person_computed_out(args);
  return resource_c_badly_behaved_functionPgResource.execute(selectArgs);
};
const resource_c_func_out_tablePgResource = registry.pgResources["c_func_out_table"];
const resource_c_func_out_table_setofPgResource = registry.pgResources["c_func_out_table_setof"];
const c_func_out_table_setof_getSelectPlanFromParentAndArgs = ($root, args, _info) => {
  const selectArgs = makeArgs_c_person_computed_out(args);
  return resource_c_func_out_table_setofPgResource.execute(selectArgs);
};
const resource_c_table_set_queryPgResource = registry.pgResources["c_table_set_query"];
const c_table_set_query_getSelectPlanFromParentAndArgs = ($root, args, _info) => {
  const selectArgs = makeArgs_c_person_computed_out(args);
  return resource_c_table_set_queryPgResource.execute(selectArgs);
};
const resource_c_table_set_query_plpgsqlPgResource = registry.pgResources["c_table_set_query_plpgsql"];
const c_table_set_query_plpgsql_getSelectPlanFromParentAndArgs = ($root, args, _info) => {
  const selectArgs = makeArgs_c_person_computed_out(args);
  return resource_c_table_set_query_plpgsqlPgResource.execute(selectArgs);
};
const resource_b_type_function_connectionPgResource = registry.pgResources["b_type_function_connection"];
const b_type_function_connection_getSelectPlanFromParentAndArgs = ($root, args, _info) => {
  const selectArgs = makeArgs_c_person_computed_out(args);
  return resource_b_type_function_connectionPgResource.execute(selectArgs);
};
const argDetailsSimple_b_type_function = [{
  graphqlArgName: "id",
  pgCodec: TYPES.int,
  postgresArgName: "id",
  required: true
}];
const makeArgs_b_type_function = (args, path = []) => argDetailsSimple_b_type_function.map(details => makeArg(path, args, details));
const resource_b_type_functionPgResource = registry.pgResources["b_type_function"];
const resource_b_type_function_listPgResource = registry.pgResources["b_type_function_list"];
const resource_non_updatable_viewPgResource = registry.pgResources["non_updatable_view"];
function applyLastArg(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function applyBeforeArg(_, $connection, val) {
  $connection.setBefore(val.getRaw());
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
const resource_foreign_keyPgResource = registry.pgResources["foreign_key"];
const resource_testviewPgResource = registry.pgResources["testview"];
const resource_b_updatable_viewPgResource = registry.pgResources["b_updatable_view"];
const resource_c_edge_casePgResource = registry.pgResources["c_edge_case"];
const resource_c_person_computed_outPgResource = registry.pgResources["c_person_computed_out"];
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
const resource_c_person_first_namePgResource = registry.pgResources["c_person_first_name"];
const resource_c_person_computed_out_outPgResource = registry.pgResources["c_person_computed_out_out"];
const argDetailsSimple_c_person_computed_inout = [{
  graphqlArgName: "ino",
  pgCodec: TYPES.text,
  postgresArgName: "ino",
  required: true
}];
const makeArgs_c_person_computed_inout = (args, path = []) => argDetailsSimple_c_person_computed_inout.map(details => makeArg(path, args, details));
const resource_c_person_computed_inoutPgResource = registry.pgResources["c_person_computed_inout"];
const argDetailsSimple_c_person_computed_inout_out = [{
  graphqlArgName: "ino",
  pgCodec: TYPES.text,
  postgresArgName: "ino",
  required: true
}];
const makeArgs_c_person_computed_inout_out = (args, path = []) => argDetailsSimple_c_person_computed_inout_out.map(details => makeArg(path, args, details));
const resource_c_person_computed_inout_outPgResource = registry.pgResources["c_person_computed_inout_out"];
const argDetailsSimple_c_person_exists = [{
  graphqlArgName: "email",
  pgCodec: bEmailCodec,
  postgresArgName: "email",
  required: true
}];
const makeArgs_c_person_exists = (args, path = []) => argDetailsSimple_c_person_exists.map(details => makeArg(path, args, details));
const resource_c_person_existsPgResource = registry.pgResources["c_person_exists"];
const resource_c_person_computed_first_arg_inout_outPgResource = registry.pgResources["c_person_computed_first_arg_inout_out"];
const argDetailsSimple_c_person_optional_missing_middle_1 = [{
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
const makeArgs_c_person_optional_missing_middle_1 = (args, path = []) => argDetailsSimple_c_person_optional_missing_middle_1.map(details => makeArg(path, args, details));
const resource_c_person_optional_missing_middle_1PgResource = registry.pgResources["c_person_optional_missing_middle_1"];
const argDetailsSimple_c_person_optional_missing_middle_2 = [{
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
const makeArgs_c_person_optional_missing_middle_2 = (args, path = []) => argDetailsSimple_c_person_optional_missing_middle_2.map(details => makeArg(path, args, details));
const resource_c_person_optional_missing_middle_2PgResource = registry.pgResources["c_person_optional_missing_middle_2"];
const argDetailsSimple_c_person_optional_missing_middle_3 = [{
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
const makeArgs_c_person_optional_missing_middle_3 = (args, path = []) => argDetailsSimple_c_person_optional_missing_middle_3.map(details => makeArg(path, args, details));
const resource_c_person_optional_missing_middle_3PgResource = registry.pgResources["c_person_optional_missing_middle_3"];
const argDetailsSimple_c_person_optional_missing_middle_4 = [{
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
const makeArgs_c_person_optional_missing_middle_4 = (args, path = []) => argDetailsSimple_c_person_optional_missing_middle_4.map(details => makeArg(path, args, details));
const resource_c_person_optional_missing_middle_4PgResource = registry.pgResources["c_person_optional_missing_middle_4"];
const argDetailsSimple_c_person_optional_missing_middle_5 = [{
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
const makeArgs_c_person_optional_missing_middle_5 = (args, path = []) => argDetailsSimple_c_person_optional_missing_middle_5.map(details => makeArg(path, args, details));
const resource_c_person_optional_missing_middle_5PgResource = registry.pgResources["c_person_optional_missing_middle_5"];
const argDetailsSimple_c_person_computed_complex = [{
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
const makeArgs_c_person_computed_complex = (args, path = []) => argDetailsSimple_c_person_computed_complex.map(details => makeArg(path, args, details));
const resource_c_person_computed_complexPgResource = registry.pgResources["c_person_computed_complex"];
const resource_c_person_first_postPgResource = registry.pgResources["c_person_first_post"];
const resource_c_person_computed_first_arg_inoutPgResource = registry.pgResources["c_person_computed_first_arg_inout"];
const resource_c_person_friendsPgResource = registry.pgResources["c_person_friends"];
const c_person_friends_getSelectPlanFromParentAndArgs = ($in, args, _info) => {
  const details = pgFunctionArgumentsFromArgs($in, makeArgs_c_person_computed_out(args));
  return resource_c_person_friendsPgResource.execute(details.selectArgs);
};
const resource_c_person_type_function_connectionPgResource = registry.pgResources["c_person_type_function_connection"];
const c_person_type_function_connection_getSelectPlanFromParentAndArgs = ($in, args, _info) => {
  const details = pgFunctionArgumentsFromArgs($in, makeArgs_c_person_computed_out(args));
  return resource_c_person_type_function_connectionPgResource.execute(details.selectArgs);
};
const argDetailsSimple_c_person_type_function = [{
  graphqlArgName: "id",
  pgCodec: TYPES.int,
  postgresArgName: "id",
  required: true
}];
const makeArgs_c_person_type_function = (args, path = []) => argDetailsSimple_c_person_type_function.map(details => makeArg(path, args, details));
const resource_c_person_type_functionPgResource = registry.pgResources["c_person_type_function"];
const resource_c_person_type_function_listPgResource = registry.pgResources["c_person_type_function_list"];
const resource_frmcdc_bWrappedUrlPgResource = registry.pgResources["frmcdc_bWrappedUrl"];
const resource_frmcdc_cCompoundTypePgResource = registry.pgResources["frmcdc_cCompoundType"];
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
  const details = pgFunctionArgumentsFromArgs($in, makeArgs_c_person_computed_out(args));
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
  pgCodec: cCompoundTypeCodec,
  postgresArgName: "object",
  required: true
}];
const makeArgs_post_computed_compound_type_array = (args, path = []) => argDetailsSimple_post_computed_compound_type_array.map(details => makeArg(path, args, details));
const resource_post_computed_compound_type_arrayPgResource = registry.pgResources["post_computed_compound_type_array"];
const resource_frmcdc_comptypePgResource = registry.pgResources["frmcdc_comptype"];
const totalCountConnectionPlan = $connection => $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
const resource_frmcdc_bNestedCompoundTypePgResource = registry.pgResources["frmcdc_bNestedCompoundType"];
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
const resource_c_edge_case_computedPgResource = registry.pgResources["c_edge_case_computed"];
const resource_c_mutation_outPgResource = registry.pgResources["c_mutation_out"];
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
const resource_c_mutation_out_setofPgResource = registry.pgResources["c_mutation_out_setof"];
const resource_c_mutation_out_unnamedPgResource = registry.pgResources["c_mutation_out_unnamed"];
const resource_c_no_args_mutationPgResource = registry.pgResources["c_no_args_mutation"];
const resource_return_void_mutationPgResource = registry.pgResources["return_void_mutation"];
const resource_mutation_interval_arrayPgResource = registry.pgResources["mutation_interval_array"];
const resource_mutation_interval_setPgResource = registry.pgResources["mutation_interval_set"];
const resource_mutation_text_arrayPgResource = registry.pgResources["mutation_text_array"];
const argDetailsSimple_c_mutation_in_out = [{
  graphqlArgName: "i",
  pgCodec: TYPES.int,
  postgresArgName: "i",
  required: true
}];
const makeArgs_c_mutation_in_out = (args, path = []) => argDetailsSimple_c_mutation_in_out.map(details => makeArg(path, args, details));
const resource_c_mutation_in_outPgResource = registry.pgResources["c_mutation_in_out"];
const argDetailsSimple_c_mutation_returns_table_one_col = [{
  graphqlArgName: "i",
  pgCodec: TYPES.int,
  postgresArgName: "i",
  required: true
}];
const makeArgs_c_mutation_returns_table_one_col = (args, path = []) => argDetailsSimple_c_mutation_returns_table_one_col.map(details => makeArg(path, args, details));
const resource_c_mutation_returns_table_one_colPgResource = registry.pgResources["c_mutation_returns_table_one_col"];
const argDetailsSimple_c_json_identity_mutation = [{
  graphqlArgName: "json",
  pgCodec: TYPES.json,
  postgresArgName: "json",
  required: true
}];
const makeArgs_c_json_identity_mutation = (args, path = []) => argDetailsSimple_c_json_identity_mutation.map(details => makeArg(path, args, details));
const resource_c_json_identity_mutationPgResource = registry.pgResources["c_json_identity_mutation"];
const argDetailsSimple_c_jsonb_identity_mutation = [{
  graphqlArgName: "json",
  pgCodec: TYPES.jsonb,
  postgresArgName: "json",
  required: true
}];
const makeArgs_c_jsonb_identity_mutation = (args, path = []) => argDetailsSimple_c_jsonb_identity_mutation.map(details => makeArg(path, args, details));
const resource_c_jsonb_identity_mutationPgResource = registry.pgResources["c_jsonb_identity_mutation"];
const argDetailsSimple_c_jsonb_identity_mutation_plpgsql = [{
  graphqlArgName: "_theJson",
  pgCodec: TYPES.jsonb,
  postgresArgName: "_the_json",
  required: true
}];
const makeArgs_c_jsonb_identity_mutation_plpgsql = (args, path = []) => argDetailsSimple_c_jsonb_identity_mutation_plpgsql.map(details => makeArg(path, args, details));
const resource_c_jsonb_identity_mutation_plpgsqlPgResource = registry.pgResources["c_jsonb_identity_mutation_plpgsql"];
const argDetailsSimple_c_jsonb_identity_mutation_plpgsql_with_default = [{
  graphqlArgName: "_theJson",
  pgCodec: TYPES.jsonb,
  postgresArgName: "_the_json"
}];
const makeArgs_c_jsonb_identity_mutation_plpgsql_with_default = (args, path = []) => argDetailsSimple_c_jsonb_identity_mutation_plpgsql_with_default.map(details => makeArg(path, args, details));
const resource_c_jsonb_identity_mutation_plpgsql_with_defaultPgResource = registry.pgResources["c_jsonb_identity_mutation_plpgsql_with_default"];
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
const argDetailsSimple_b_mult_1 = [{
  graphqlArgName: "arg0",
  pgCodec: TYPES.int,
  required: true
}, {
  graphqlArgName: "arg1",
  pgCodec: TYPES.int,
  required: true
}];
const makeArgs_b_mult_1 = (args, path = []) => argDetailsSimple_b_mult_1.map(details => makeArg(path, args, details));
const resource_b_mult_1PgResource = registry.pgResources["b_mult_1"];
const argDetailsSimple_b_mult_2 = [{
  graphqlArgName: "arg0",
  pgCodec: TYPES.int,
  required: true
}, {
  graphqlArgName: "arg1",
  pgCodec: TYPES.int,
  required: true
}];
const makeArgs_b_mult_2 = (args, path = []) => argDetailsSimple_b_mult_2.map(details => makeArg(path, args, details));
const resource_b_mult_2PgResource = registry.pgResources["b_mult_2"];
const argDetailsSimple_b_mult_3 = [{
  graphqlArgName: "arg0",
  pgCodec: TYPES.int,
  required: true
}, {
  graphqlArgName: "arg1",
  pgCodec: TYPES.int,
  required: true
}];
const makeArgs_b_mult_3 = (args, path = []) => argDetailsSimple_b_mult_3.map(details => makeArg(path, args, details));
const resource_b_mult_3PgResource = registry.pgResources["b_mult_3"];
const argDetailsSimple_b_mult_4 = [{
  graphqlArgName: "arg0",
  pgCodec: TYPES.int,
  required: true
}, {
  graphqlArgName: "arg1",
  pgCodec: TYPES.int,
  required: true
}];
const makeArgs_b_mult_4 = (args, path = []) => argDetailsSimple_b_mult_4.map(details => makeArg(path, args, details));
const resource_b_mult_4PgResource = registry.pgResources["b_mult_4"];
const argDetailsSimple_c_mutation_in_inout = [{
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
const makeArgs_c_mutation_in_inout = (args, path = []) => argDetailsSimple_c_mutation_in_inout.map(details => makeArg(path, args, details));
const resource_c_mutation_in_inoutPgResource = registry.pgResources["c_mutation_in_inout"];
const resource_c_mutation_out_outPgResource = registry.pgResources["c_mutation_out_out"];
const resource_c_mutation_out_out_setofPgResource = registry.pgResources["c_mutation_out_out_setof"];
const resource_c_mutation_out_out_unnamedPgResource = registry.pgResources["c_mutation_out_out_unnamed"];
const argDetailsSimple_c_int_set_mutation = [{
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
const makeArgs_c_int_set_mutation = (args, path = []) => argDetailsSimple_c_int_set_mutation.map(details => makeArg(path, args, details));
const resource_c_int_set_mutationPgResource = registry.pgResources["c_int_set_mutation"];
const resource_c_mutation_out_unnamed_out_out_unnamedPgResource = registry.pgResources["c_mutation_out_unnamed_out_out_unnamed"];
const argDetailsSimple_c_mutation_returns_table_multi_col = [{
  graphqlArgName: "i",
  pgCodec: TYPES.int,
  postgresArgName: "i",
  required: true
}];
const makeArgs_c_mutation_returns_table_multi_col = (args, path = []) => argDetailsSimple_c_mutation_returns_table_multi_col.map(details => makeArg(path, args, details));
const resource_c_mutation_returns_table_multi_colPgResource = registry.pgResources["c_mutation_returns_table_multi_col"];
const argDetailsSimple_b_list_bde_mutation = [{
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
const makeArgs_b_list_bde_mutation = (args, path = []) => argDetailsSimple_b_list_bde_mutation.map(details => makeArg(path, args, details));
const resource_b_list_bde_mutationPgResource = registry.pgResources["b_list_bde_mutation"];
const argDetailsSimple_b_guid_fn = [{
  graphqlArgName: "g",
  pgCodec: bGuidCodec,
  postgresArgName: "g",
  required: true
}];
const makeArgs_b_guid_fn = (args, path = []) => argDetailsSimple_b_guid_fn.map(details => makeArg(path, args, details));
const resource_b_guid_fnPgResource = registry.pgResources["b_guid_fn"];
const resource_b_authenticate_failPgResource = registry.pgResources["b_authenticate_fail"];
const argDetailsSimple_b_authenticate = [{
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
const makeArgs_b_authenticate = (args, path = []) => argDetailsSimple_b_authenticate.map(details => makeArg(path, args, details));
const resource_b_authenticatePgResource = registry.pgResources["b_authenticate"];
const argDetailsSimple_c_types_mutation = [{
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
  pgCodec: cFloatrangeCodec,
  postgresArgName: "f",
  required: true
}];
const makeArgs_c_types_mutation = (args, path = []) => argDetailsSimple_c_types_mutation.map(details => makeArg(path, args, details));
const resource_c_types_mutationPgResource = registry.pgResources["c_types_mutation"];
const argDetailsSimple_c_left_arm_identity = [{
  graphqlArgName: "leftArm",
  pgCodec: cLeftArmCodec,
  postgresArgName: "left_arm",
  required: true
}];
const makeArgs_c_left_arm_identity = (args, path = []) => argDetailsSimple_c_left_arm_identity.map(details => makeArg(path, args, details));
const resource_c_left_arm_identityPgResource = registry.pgResources["c_left_arm_identity"];
const resource_c_issue756_mutationPgResource = registry.pgResources["c_issue756_mutation"];
const resource_c_issue756_set_mutationPgResource = registry.pgResources["c_issue756_set_mutation"];
const argDetailsSimple_b_authenticate_many = [{
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
const makeArgs_b_authenticate_many = (args, path = []) => argDetailsSimple_b_authenticate_many.map(details => makeArg(path, args, details));
const resource_b_authenticate_manyPgResource = registry.pgResources["b_authenticate_many"];
const argDetailsSimple_b_authenticate_payload = [{
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
const makeArgs_b_authenticate_payload = (args, path = []) => argDetailsSimple_b_authenticate_payload.map(details => makeArg(path, args, details));
const resource_b_authenticate_payloadPgResource = registry.pgResources["b_authenticate_payload"];
const argDetailsSimple_c_mutation_out_out_compound_type = [{
  graphqlArgName: "i1",
  pgCodec: TYPES.int,
  postgresArgName: "i1",
  required: true
}];
const makeArgs_c_mutation_out_out_compound_type = (args, path = []) => argDetailsSimple_c_mutation_out_out_compound_type.map(details => makeArg(path, args, details));
const resource_c_mutation_out_out_compound_typePgResource = registry.pgResources["c_mutation_out_out_compound_type"];
const argDetailsSimple_c_table_mutation = [{
  graphqlArgName: "id",
  pgCodec: TYPES.int,
  postgresArgName: "id",
  required: true
}];
const makeArgs_c_table_mutation = (args, path = []) => argDetailsSimple_c_table_mutation.map(details => makeArg(path, args, details));
const resource_c_table_mutationPgResource = registry.pgResources["c_table_mutation"];
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
const argDetailsSimple_b_compound_type_mutation = [{
  graphqlArgName: "object",
  pgCodec: cCompoundTypeCodec,
  postgresArgName: "object",
  required: true
}];
const makeArgs_b_compound_type_mutation = (args, path = []) => argDetailsSimple_b_compound_type_mutation.map(details => makeArg(path, args, details));
const resource_b_compound_type_mutationPgResource = registry.pgResources["b_compound_type_mutation"];
const argDetailsSimple_b_compound_type_set_mutation = [{
  graphqlArgName: "object",
  pgCodec: cCompoundTypeCodec,
  postgresArgName: "object",
  required: true
}];
const makeArgs_b_compound_type_set_mutation = (args, path = []) => argDetailsSimple_b_compound_type_set_mutation.map(details => makeArg(path, args, details));
const resource_b_compound_type_set_mutationPgResource = registry.pgResources["b_compound_type_set_mutation"];
const argDetailsSimple_c_list_of_compound_types_mutation = [{
  graphqlArgName: "records",
  pgCodec: cCompoundTypeArrayCodec,
  postgresArgName: "records",
  required: true
}];
const makeArgs_c_list_of_compound_types_mutation = (args, path = []) => argDetailsSimple_c_list_of_compound_types_mutation.map(details => makeArg(path, args, details));
const resource_c_list_of_compound_types_mutationPgResource = registry.pgResources["c_list_of_compound_types_mutation"];
const argDetailsSimple_c_mutation_out_complex = [{
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
const makeArgs_c_mutation_out_complex = (args, path = []) => argDetailsSimple_c_mutation_out_complex.map(details => makeArg(path, args, details));
const resource_c_mutation_out_complexPgResource = registry.pgResources["c_mutation_out_complex"];
const argDetailsSimple_c_mutation_out_complex_setof = [{
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
const makeArgs_c_mutation_out_complex_setof = (args, path = []) => argDetailsSimple_c_mutation_out_complex_setof.map(details => makeArg(path, args, details));
const resource_c_mutation_out_complex_setofPgResource = registry.pgResources["c_mutation_out_complex_setof"];
const argDetailsSimple_mutation_compound_type_array = [{
  graphqlArgName: "object",
  pgCodec: cCompoundTypeCodec,
  postgresArgName: "object",
  required: true
}];
const makeArgs_mutation_compound_type_array = (args, path = []) => argDetailsSimple_mutation_compound_type_array.map(details => makeArg(path, args, details));
const resource_mutation_compound_type_arrayPgResource = registry.pgResources["mutation_compound_type_array"];
const argDetailsSimple_b_compound_type_array_mutation = [{
  graphqlArgName: "object",
  pgCodec: cCompoundTypeCodec,
  postgresArgName: "object",
  required: true
}];
const makeArgs_b_compound_type_array_mutation = (args, path = []) => argDetailsSimple_b_compound_type_array_mutation.map(details => makeArg(path, args, details));
const resource_b_compound_type_array_mutationPgResource = registry.pgResources["b_compound_type_array_mutation"];
const argDetailsSimple_post_many = [{
  graphqlArgName: "posts",
  pgCodec: postArrayCodec,
  postgresArgName: "posts",
  required: true
}];
const makeArgs_post_many = (args, path = []) => argDetailsSimple_post_many.map(details => makeArg(path, args, details));
const resource_post_manyPgResource = registry.pgResources["post_many"];
const resource_c_mutation_out_tablePgResource = registry.pgResources["c_mutation_out_table"];
const resource_c_mutation_out_table_setofPgResource = registry.pgResources["c_mutation_out_table_setof"];
const resource_c_table_set_mutationPgResource = registry.pgResources["c_table_set_mutation"];
const resource_b_type_function_connection_mutationPgResource = registry.pgResources["b_type_function_connection_mutation"];
const argDetailsSimple_b_type_function_mutation = [{
  graphqlArgName: "id",
  pgCodec: TYPES.int,
  postgresArgName: "id",
  required: true
}];
const makeArgs_b_type_function_mutation = (args, path = []) => argDetailsSimple_b_type_function_mutation.map(details => makeArg(path, args, details));
const resource_b_type_function_mutationPgResource = registry.pgResources["b_type_function_mutation"];
const resource_b_type_function_list_mutationPgResource = registry.pgResources["b_type_function_list_mutation"];
function applyInputToInsert(_, $object) {
  return $object;
}
function applyInputToUpdateOrDelete(_, $object) {
  return $object;
}
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
const resource_frmcdc_bJwtTokenPgResource = registry.pgResources["frmcdc_bJwtToken"];
function getClientMutationIdForCreatePlan($mutation) {
  const $insert = $mutation.getStepForKey("result");
  return $insert.getMeta("clientMutationId");
}
function planCreatePayloadResult($object) {
  return $object.get("result");
}
function applyClientMutationIdForCreate(qb, val) {
  qb.setMeta("clientMutationId", val);
}
function applyCreateFields(qb, arg) {
  if (arg != null) {
    return qb.setBuilder();
  }
}
function getClientMutationIdForUpdateOrDeletePlan($mutation) {
  const $result = $mutation.getStepForKey("result");
  return $result.getMeta("clientMutationId");
}
function planUpdateOrDeletePayloadResult($object) {
  return $object.get("result");
}
function applyClientMutationIdForUpdateOrDelete(qb, val) {
  qb.setMeta("clientMutationId", val);
}
function applyPatchFields(qb, arg) {
  if (arg != null) {
    return qb.setBuilder();
  }
}
export const typeDefs = /* GraphQL */`"""The root query type which gives access points into the data universe."""
type Query {
  """
  Exposes the root query type nested one level down. This is helpful for Relay 1
  which can only query top level fields if they are in a particular form.
  """
  query: Query!

  """Get a single \`Input\`."""
  inputByRowId(rowId: Int!): Input

  """Get a single \`Patch\`."""
  patchByRowId(rowId: Int!): Patch

  """Get a single \`Reserved\`."""
  reservedByRowId(rowId: Int!): Reserved

  """Get a single \`ReservedPatchRecord\`."""
  reservedPatchRecordByRowId(rowId: Int!): ReservedPatchRecord

  """Get a single \`ReservedInputRecord\`."""
  reservedInputRecordByRowId(rowId: Int!): ReservedInputRecord

  """Get a single \`DefaultValue\`."""
  defaultValueByRowId(rowId: Int!): DefaultValue

  """Get a single \`NoPrimaryKey\`."""
  noPrimaryKeyByRowId(rowId: Int!): NoPrimaryKey

  """Get a single \`UniqueForeignKey\`."""
  uniqueForeignKeyByCompoundKey1AndCompoundKey2(compoundKey1: Int!, compoundKey2: Int!): UniqueForeignKey

  """Get a single \`CMyTable\`."""
  cMyTableByRowId(rowId: Int!): CMyTable

  """Get a single \`CPersonSecret\`."""
  cPersonSecretByPersonId(personId: Int!): CPersonSecret @deprecated(reason: "This is deprecated (comment on table c.person_secret).")

  """Get a single \`ViewTable\`."""
  viewTableByRowId(rowId: Int!): ViewTable

  """Get a single \`CCompoundKey\`."""
  cCompoundKeyByPersonId1AndPersonId2(personId1: Int!, personId2: Int!): CCompoundKey

  """Get a single \`SimilarTable1\`."""
  similarTable1ByRowId(rowId: Int!): SimilarTable1

  """Get a single \`SimilarTable2\`."""
  similarTable2ByRowId(rowId: Int!): SimilarTable2

  """Get a single \`CNullTestRecord\`."""
  cNullTestRecordByRowId(rowId: Int!): CNullTestRecord

  """Get a single \`CLeftArm\`."""
  cLeftArmByRowId(rowId: Int!): CLeftArm

  """Get a single \`CLeftArm\`."""
  cLeftArmByPersonId(personId: Int!): CLeftArm

  """Get a single \`CIssue756\`."""
  cIssue756ByRowId(rowId: Int!): CIssue756

  """Get a single \`Post\`."""
  postByRowId(rowId: Int!): Post

  """Get a single \`CPerson\`."""
  cPersonByRowId(rowId: Int!): CPerson

  """Get a single \`CPerson\`."""
  cPersonByEmail(email: BEmail!): CPerson

  """Get a single \`BList\`."""
  bListByRowId(rowId: Int!): BList

  """Get a single \`BType\`."""
  bTypeByRowId(rowId: Int!): BType
  cCurrentUserId: Int
  cFuncOut: Int

  """Reads and enables pagination through a set of \`Int4\`."""
  cFuncOutSetof(
    """Only read the first \`n\` values of the set."""
    first: Int

    """
    Skip the first \`n\` values from our \`after\` cursor, an alternative to cursor
    based pagination. May not be used with \`last\`.
    """
    offset: Int

    """Read all values in the set after (below) this cursor."""
    after: Cursor
  ): CFuncOutSetofConnection
  cFuncOutUnnamed: Int
  cNoArgsQuery: Int
  queryIntervalArray: [Interval]

  """Reads and enables pagination through a set of \`Interval\`."""
  queryIntervalSet(
    """Only read the first \`n\` values of the set."""
    first: Int

    """
    Skip the first \`n\` values from our \`after\` cursor, an alternative to cursor
    based pagination. May not be used with \`last\`.
    """
    offset: Int

    """Read all values in the set after (below) this cursor."""
    after: Cursor
  ): QueryIntervalSetConnection
  queryTextArray: [String]

  """Reads and enables pagination through a set of \`Int8\`."""
  staticBigInteger(
    """Only read the first \`n\` values of the set."""
    first: Int

    """
    Skip the first \`n\` values from our \`after\` cursor, an alternative to cursor
    based pagination. May not be used with \`last\`.
    """
    offset: Int

    """Read all values in the set after (below) this cursor."""
    after: Cursor
  ): StaticBigIntegerConnection
  cFuncInOut(i: Int): Int

  """Reads and enables pagination through a set of \`Int4\`."""
  cFuncReturnsTableOneCol(
    i: Int

    """Only read the first \`n\` values of the set."""
    first: Int

    """
    Skip the first \`n\` values from our \`after\` cursor, an alternative to cursor
    based pagination. May not be used with \`last\`.
    """
    offset: Int

    """Read all values in the set after (below) this cursor."""
    after: Cursor
  ): CFuncReturnsTableOneColConnection
  cJsonIdentity(json: JSON): JSON
  cJsonbIdentity(json: JSON): JSON

  """lol, add some stuff 1 query"""
  add1Query(arg0: Int!, arg1: Int!): Int

  """lol, add some stuff 2 query"""
  add2Query(a: Int!, b: Int): Int

  """lol, add some stuff 3 query"""
  add3Query(a: Int, arg1: Int): Int

  """lol, add some stuff 4 query"""
  add4Query(arg0: Int, b: Int): Int
  cFuncInInout(i: Int, ino: Int): Int
  cFuncOutOut: CFuncOutOutRecord

  """
  Reads and enables pagination through a set of \`CFuncOutOutSetofRecord\`.
  """
  cFuncOutOutSetof(
    """Only read the first \`n\` values of the set."""
    first: Int

    """
    Skip the first \`n\` values from our \`after\` cursor, an alternative to cursor
    based pagination. May not be used with \`last\`.
    """
    offset: Int

    """Read all values in the set after (below) this cursor."""
    after: Cursor
  ): CFuncOutOutSetofConnection
  cFuncOutOutUnnamed: CFuncOutOutUnnamedRecord

  """
  Reads and enables pagination through a set of \`CSearchTestSummariesRecord\`.
  """
  cSearchTestSummaries(
    """Only read the first \`n\` values of the set."""
    first: Int

    """
    Skip the first \`n\` values from our \`after\` cursor, an alternative to cursor
    based pagination. May not be used with \`last\`.
    """
    offset: Int

    """Read all values in the set after (below) this cursor."""
    after: Cursor
  ): CSearchTestSummariesConnection
  optionalMissingMiddle1(arg0: Int!, b: Int, c: Int): Int
  optionalMissingMiddle2(a: Int!, b: Int, c: Int): Int
  optionalMissingMiddle3(a: Int!, arg1: Int, c: Int): Int
  optionalMissingMiddle4(arg0: Int!, b: Int, arg2: Int): Int
  optionalMissingMiddle5(a: Int!, arg1: Int, arg2: Int): Int
  cFuncOutUnnamedOutOutUnnamed: CFuncOutUnnamedOutOutUnnamedRecord

  """Reads and enables pagination through a set of \`Int4\`."""
  cIntSetQuery(
    x: Int
    y: Int
    z: Int

    """Only read the first \`n\` values of the set."""
    first: Int

    """
    Skip the first \`n\` values from our \`after\` cursor, an alternative to cursor
    based pagination. May not be used with \`last\`.
    """
    offset: Int

    """Read all values in the set after (below) this cursor."""
    after: Cursor
  ): CIntSetQueryConnection

  """
  Reads and enables pagination through a set of \`CFuncReturnsTableMultiColRecord\`.
  """
  cFuncReturnsTableMultiCol(
    i: Int
    a: Int
    b: Int

    """Only read the first \`n\` values of the set."""
    first: Int

    """
    Skip the first \`n\` values from our \`after\` cursor, an alternative to cursor
    based pagination. May not be used with \`last\`.
    """
    offset: Int

    """Read all values in the set after (below) this cursor."""
    after: Cursor
  ): CFuncReturnsTableMultiColConnection
  cReturnTableWithoutGrants: CCompoundKey
  cTypesQuery(a: BigInt!, b: Boolean!, c: String!, d: [Int]!, e: JSON!, f: FloatRangeInput!): Boolean
  cQueryOutputTwoRows(leftArmId: Int, postId: Int, txt: String): CQueryOutputTwoRowsRecord
  cCompoundTypeComputedField(compoundType: CCompoundTypeInput): Int
  cFuncOutOutCompoundType(i1: Int): CFuncOutOutCompoundTypeRecord
  cTableQuery(id: Int): Post

  """Reads and enables pagination through a set of \`CCompoundType\`."""
  cCompoundTypeSetQuery(
    """Only read the first \`n\` values of the set."""
    first: Int

    """
    Skip the first \`n\` values from our \`after\` cursor, an alternative to cursor
    based pagination. May not be used with \`last\`.
    """
    offset: Int

    """Read all values in the set after (below) this cursor."""
    after: Cursor
  ): CCompoundTypeConnection
  bCompoundTypeQuery(object: CCompoundTypeInput): CCompoundType
  cFuncOutComplex(a: Int, b: String): CFuncOutComplexRecord

  """
  Reads and enables pagination through a set of \`CFuncOutComplexSetofRecord\`.
  """
  cFuncOutComplexSetof(
    a: Int
    b: String

    """Only read the first \`n\` values of the set."""
    first: Int

    """
    Skip the first \`n\` values from our \`after\` cursor, an alternative to cursor
    based pagination. May not be used with \`last\`.
    """
    offset: Int

    """Read all values in the set after (below) this cursor."""
    after: Cursor
  ): CFuncOutComplexSetofConnection
  queryCompoundTypeArray(object: CCompoundTypeInput): [CCompoundType]
  bCompoundTypeArrayQuery(object: CCompoundTypeInput): [CCompoundType]

  """Reads and enables pagination through a set of \`CPerson\`."""
  cBadlyBehavedFunction(
    """Only read the first \`n\` values of the set."""
    first: Int

    """
    Skip the first \`n\` values from our \`after\` cursor, an alternative to cursor
    based pagination. May not be used with \`last\`.
    """
    offset: Int

    """Read all values in the set after (below) this cursor."""
    after: Cursor
  ): CPersonConnection @deprecated(reason: "This is deprecated (comment on function c.badly_behaved_function).")
  cFuncOutTable: CPerson

  """Reads and enables pagination through a set of \`CPerson\`."""
  cFuncOutTableSetof(
    """Only read the first \`n\` values of the set."""
    first: Int

    """
    Skip the first \`n\` values from our \`after\` cursor, an alternative to cursor
    based pagination. May not be used with \`last\`.
    """
    offset: Int

    """Read all values in the set after (below) this cursor."""
    after: Cursor
  ): CPersonConnection

  """Reads and enables pagination through a set of \`CPerson\`."""
  cTableSetQuery(
    """Only read the first \`n\` values of the set."""
    first: Int

    """
    Skip the first \`n\` values from our \`after\` cursor, an alternative to cursor
    based pagination. May not be used with \`last\`.
    """
    offset: Int

    """Read all values in the set after (below) this cursor."""
    after: Cursor
  ): CPersonConnection

  """Reads and enables pagination through a set of \`CPerson\`."""
  cTableSetQueryPlpgsql(
    """Only read the first \`n\` values of the set."""
    first: Int

    """
    Skip the first \`n\` values from our \`after\` cursor, an alternative to cursor
    based pagination. May not be used with \`last\`.
    """
    offset: Int

    """Read all values in the set after (below) this cursor."""
    after: Cursor
  ): CPersonConnection

  """Reads and enables pagination through a set of \`BType\`."""
  bTypeFunctionConnection(
    """Only read the first \`n\` values of the set."""
    first: Int

    """
    Skip the first \`n\` values from our \`after\` cursor, an alternative to cursor
    based pagination. May not be used with \`last\`.
    """
    offset: Int

    """Read all values in the set after (below) this cursor."""
    after: Cursor
  ): BTypeConnection
  bTypeFunction(id: Int): BType
  bTypeFunctionList: [BType]

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
    orderBy: [NonUpdatableViewOrderBy!] = [NATURAL]
  ): NonUpdatableViewConnection

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
    orderBy: [InputOrderBy!] = [PRIMARY_KEY_ASC]
  ): InputConnection

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
    orderBy: [PatchOrderBy!] = [PRIMARY_KEY_ASC]
  ): PatchConnection

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
    orderBy: [ReservedOrderBy!] = [PRIMARY_KEY_ASC]
  ): ReservedConnection

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
    orderBy: [ReservedPatchRecordOrderBy!] = [PRIMARY_KEY_ASC]
  ): ReservedPatchRecordConnection

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
    orderBy: [ReservedInputRecordOrderBy!] = [PRIMARY_KEY_ASC]
  ): ReservedInputRecordConnection

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
    orderBy: [DefaultValueOrderBy!] = [PRIMARY_KEY_ASC]
  ): DefaultValueConnection

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
    orderBy: [ForeignKeyOrderBy!] = [NATURAL]
  ): ForeignKeyConnection

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
    orderBy: [NoPrimaryKeyOrderBy!] = [NATURAL]
  ): NoPrimaryKeyConnection

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
    orderBy: [TestviewOrderBy!] = [NATURAL]
  ): TestviewConnection

  """Reads and enables pagination through a set of \`UniqueForeignKey\`."""
  allUniqueForeignKeys(
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
    condition: UniqueForeignKeyCondition

    """The method to use when ordering \`UniqueForeignKey\`."""
    orderBy: [UniqueForeignKeyOrderBy!] = [NATURAL]
  ): UniqueForeignKeyConnection

  """Reads and enables pagination through a set of \`CMyTable\`."""
  allCMyTables(
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
    condition: CMyTableCondition

    """The method to use when ordering \`CMyTable\`."""
    orderBy: [CMyTableOrderBy!] = [PRIMARY_KEY_ASC]
  ): CMyTableConnection

  """Reads and enables pagination through a set of \`CPersonSecret\`."""
  allCPersonSecrets(
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
    condition: CPersonSecretCondition

    """The method to use when ordering \`CPersonSecret\`."""
    orderBy: [CPersonSecretOrderBy!] = [PRIMARY_KEY_ASC]
  ): CPersonSecretConnection @deprecated(reason: "This is deprecated (comment on table c.person_secret).")

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
    orderBy: [ViewTableOrderBy!] = [PRIMARY_KEY_ASC]
  ): ViewTableConnection

  """Reads and enables pagination through a set of \`BUpdatableView\`."""
  allBUpdatableViews(
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
    condition: BUpdatableViewCondition

    """The method to use when ordering \`BUpdatableView\`."""
    orderBy: [BUpdatableViewOrderBy!] = [NATURAL]
  ): BUpdatableViewConnection

  """Reads and enables pagination through a set of \`CCompoundKey\`."""
  allCCompoundKeys(
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
    condition: CCompoundKeyCondition

    """The method to use when ordering \`CCompoundKey\`."""
    orderBy: [CCompoundKeyOrderBy!] = [PRIMARY_KEY_ASC]
  ): CCompoundKeyConnection

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
    orderBy: [SimilarTable1OrderBy!] = [PRIMARY_KEY_ASC]
  ): SimilarTable1Connection

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
    orderBy: [SimilarTable2OrderBy!] = [PRIMARY_KEY_ASC]
  ): SimilarTable2Connection

  """Reads and enables pagination through a set of \`CNullTestRecord\`."""
  allCNullTestRecords(
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
    condition: CNullTestRecordCondition

    """The method to use when ordering \`CNullTestRecord\`."""
    orderBy: [CNullTestRecordOrderBy!] = [PRIMARY_KEY_ASC]
  ): CNullTestRecordConnection

  """Reads and enables pagination through a set of \`CEdgeCase\`."""
  allCEdgeCases(
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
    condition: CEdgeCaseCondition

    """The method to use when ordering \`CEdgeCase\`."""
    orderBy: [CEdgeCaseOrderBy!] = [NATURAL]
  ): CEdgeCaseConnection

  """Reads and enables pagination through a set of \`CLeftArm\`."""
  allCLeftArms(
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
    condition: CLeftArmCondition

    """The method to use when ordering \`CLeftArm\`."""
    orderBy: [CLeftArmOrderBy!] = [PRIMARY_KEY_ASC]
  ): CLeftArmConnection

  """Reads and enables pagination through a set of \`CIssue756\`."""
  allCIssue756S(
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
    condition: CIssue756Condition

    """The method to use when ordering \`CIssue756\`."""
    orderBy: [CIssue756OrderBy!] = [PRIMARY_KEY_ASC]
  ): CIssue756Connection

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
    orderBy: [PostOrderBy!] = [PRIMARY_KEY_ASC]
  ): PostConnection

  """Reads and enables pagination through a set of \`CPerson\`."""
  allCPeople(
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
    condition: CPersonCondition

    """The method to use when ordering \`CPerson\`."""
    orderBy: [CPersonOrderBy!] = [PRIMARY_KEY_ASC]
  ): CPersonConnection

  """Reads and enables pagination through a set of \`BList\`."""
  allBLists(
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
    condition: BListCondition

    """The method to use when ordering \`BList\`."""
    orderBy: [BListOrderBy!] = [PRIMARY_KEY_ASC]
  ): BListConnection

  """Reads and enables pagination through a set of \`BType\`."""
  allBTypes(
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
    condition: BTypeCondition

    """The method to use when ordering \`BType\`."""
    orderBy: [BTypeOrderBy!] = [PRIMARY_KEY_ASC]
  ): BTypeConnection
}

"""Should output as Input"""
type Input {
  rowId: Int!
}

"""Should output as Patch"""
type Patch {
  rowId: Int!
}

type Reserved {
  rowId: Int!
}

"""
\`reservedPatchs\` table should get renamed to ReservedPatchRecord to prevent clashes with ReservedPatch from \`reserved\` table
"""
type ReservedPatchRecord {
  rowId: Int!
}

"""
\`reserved_input\` table should get renamed to ReservedInputRecord to prevent clashes with ReservedInput from \`reserved\` table
"""
type ReservedInputRecord {
  rowId: Int!
}

type DefaultValue {
  rowId: Int!
  nullValue: String
}

type NoPrimaryKey {
  rowId: Int!
  str: String!
}

type UniqueForeignKey {
  compoundKey1: Int
  compoundKey2: Int

  """
  Reads a single \`CCompoundKey\` that is related to this \`UniqueForeignKey\`.
  """
  cCompoundKeyByCompoundKey1AndCompoundKey2: CCompoundKey
}

type CCompoundKey {
  personId2: Int!
  personId1: Int!
  extra: Boolean

  """Reads a single \`CPerson\` that is related to this \`CCompoundKey\`."""
  cPersonByPersonId1: CPerson

  """Reads a single \`CPerson\` that is related to this \`CCompoundKey\`."""
  cPersonByPersonId2: CPerson

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
    orderBy: [ForeignKeyOrderBy!] = [NATURAL]
  ): ForeignKeyConnection!

  """
  Reads a single \`UniqueForeignKey\` that is related to this \`CCompoundKey\`.
  """
  uniqueForeignKeyByCompoundKey1AndCompoundKey2: UniqueForeignKey
}

"""Person test comment"""
type CPerson {
  computedOut: String!

  """The first name of the person."""
  firstName: String
  computedOutOut: CPersonComputedOutOutRecord
  computedInout(ino: String): String
  computedInoutOut(ino: String): CPersonComputedInoutOutRecord
  exists(email: BEmail): Boolean @deprecated(reason: "This is deprecated (comment on function c.person_exists).")
  computedFirstArgInoutOut: CPersonComputedFirstArgInoutOutRecord
  optionalMissingMiddle1(arg0: Int!, b: Int, c: Int): Int
  optionalMissingMiddle2(a: Int!, b: Int, c: Int): Int
  optionalMissingMiddle3(a: Int!, arg1: Int, c: Int): Int
  optionalMissingMiddle4(arg0: Int!, b: Int, arg2: Int): Int
  optionalMissingMiddle5(a: Int!, arg1: Int, arg2: Int): Int
  computedComplex(a: Int, b: String): CPersonComputedComplexRecord

  """The first post by the person."""
  firstPost: Post
  computedFirstArgInout: CPerson

  """Reads and enables pagination through a set of \`CPerson\`."""
  friends(
    """Only read the first \`n\` values of the set."""
    first: Int

    """
    Skip the first \`n\` values from our \`after\` cursor, an alternative to cursor
    based pagination. May not be used with \`last\`.
    """
    offset: Int

    """Read all values in the set after (below) this cursor."""
    after: Cursor
  ): CPersonConnection!

  """Reads and enables pagination through a set of \`BType\`."""
  typeFunctionConnection(
    """Only read the first \`n\` values of the set."""
    first: Int

    """
    Skip the first \`n\` values from our \`after\` cursor, an alternative to cursor
    based pagination. May not be used with \`last\`.
    """
    offset: Int

    """Read all values in the set after (below) this cursor."""
    after: Cursor
  ): BTypeConnection!
  typeFunction(id: Int): BType
  typeFunctionList: [BType]

  """The primary unique identifier for the person"""
  rowId: Int!

  """The person’s name"""
  name: String!
  aliases: [String]!
  about: String
  email: BEmail!
  site: BWrappedUrl @deprecated(reason: "Don’t use me")
  config: KeyValueHash
  lastLoginFromIp: InternetAddress
  lastLoginFromSubnet: CidrAddress
  userMac: MacAddress
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
    orderBy: [PostOrderBy!] = [PRIMARY_KEY_ASC]
  ): PostConnection!

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
    orderBy: [ForeignKeyOrderBy!] = [NATURAL]
  ): ForeignKeyConnection!

  """This \`Person\`'s \`PersonSecret\`."""
  cPersonSecretByPersonId: CPersonSecret @deprecated(reason: "This is deprecated (comment on table c.person_secret).")

  """Reads a single \`CLeftArm\` that is related to this \`CPerson\`."""
  cLeftArmByPersonId: CLeftArm

  """Reads and enables pagination through a set of \`CCompoundKey\`."""
  cCompoundKeysByPersonId1(
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
    condition: CCompoundKeyCondition

    """The method to use when ordering \`CCompoundKey\`."""
    orderBy: [CCompoundKeyOrderBy!] = [PRIMARY_KEY_ASC]
  ): CCompoundKeyConnection!

  """Reads and enables pagination through a set of \`CCompoundKey\`."""
  cCompoundKeysByPersonId2(
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
    condition: CCompoundKeyCondition

    """The method to use when ordering \`CCompoundKey\`."""
    orderBy: [CCompoundKeyOrderBy!] = [PRIMARY_KEY_ASC]
  ): CCompoundKeyConnection!
}

type CPersonComputedOutOutRecord {
  o1: String
  o2: String
}

type CPersonComputedInoutOutRecord {
  ino: String
  o: String
}

scalar BEmail

type CPersonComputedFirstArgInoutOutRecord {
  person: CPerson
  o: Int
}

type CPersonComputedComplexRecord {
  x: Int
  y: CCompoundType
  z: CPerson
}

"""Awesome feature!"""
type CCompoundType {
  computedField: Int
  query: CCompoundType
  queryCompoundTypeArray: [CCompoundType]
  arrayQuery: [CCompoundType]
  a: Int
  b: String
  c: BColor
  d: UUID
  e: BEnumCaps
  f: BEnumWithEmptyString
  g: Interval
  fooBar: Int
}

"""Represents the colours red, green and blue."""
enum BColor {
  red
  green
  blue
}

"""
A universally unique identifier as defined by [RFC 4122](https://tools.ietf.org/html/rfc4122).
"""
scalar UUID

enum BEnumCaps {
  FOO_BAR
  BAR_FOO
  BAZ_QUX
  _0_BAR
}

enum BEnumWithEmptyString {
  _EMPTY_
  one
  two
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
  computedIntervalArray: [Interval]

  """Reads and enables pagination through a set of \`Interval\`."""
  computedIntervalSet(
    """Only read the first \`n\` values of the set."""
    first: Int

    """
    Skip the first \`n\` values from our \`after\` cursor, an alternative to cursor
    based pagination. May not be used with \`last\`.
    """
    offset: Int

    """Read all values in the set after (below) this cursor."""
    after: Cursor
  ): PostComputedIntervalSetConnection!
  computedTextArray: [String]
  computedWithOptionalArg(i: Int): Int
  computedWithRequiredArg(i: Int!): Int
  headlineTrimmed(length: Int, omission: String): String
  headlineTrimmedNoDefaults(length: Int, omission: String): String
  headlineTrimmedStrict(length: Int, omission: String): String
  computedCompoundTypeArray(object: CCompoundTypeInput): [CCompoundType]
  rowId: Int!
  headline: String!
  body: String
  authorId: Int
  enums: [AnEnum]
  comptypes: [Comptype]

  """Reads a single \`CPerson\` that is related to this \`Post\`."""
  cPersonByAuthorId: CPerson

  """Reads and enables pagination through a set of \`BType\`."""
  bTypesBySmallint(
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
    condition: BTypeCondition

    """The method to use when ordering \`BType\`."""
    orderBy: [BTypeOrderBy!] = [PRIMARY_KEY_ASC]
  ): BTypeConnection!

  """Reads a single \`BType\` that is related to this \`Post\`."""
  bTypeByRowId: BType
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

"""An input for mutations affecting \`CCompoundType\`"""
input CCompoundTypeInput {
  a: Int
  b: String
  c: BColor
  d: UUID
  e: BEnumCaps
  f: BEnumWithEmptyString
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
  awaiting
  rejected
  published
  ASTERISK
  ASTERISK__ASTERISK
  ASTERISK__ASTERISK__ASTERISK
  foo_ASTERISK
  foo_ASTERISK_
  _foo_ASTERISK
  ASTERISK_bar
  ASTERISK_bar_
  _ASTERISK_bar_
  ASTERISK_baz_ASTERISK
  _ASTERISK_baz_ASTERISK_
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

"""A connection to a list of \`BType\` values."""
type BTypeConnection {
  """A list of \`BType\` objects."""
  nodes: [BType]!

  """
  A list of edges which contains the \`BType\` and cursor to aid in pagination.
  """
  edges: [BTypeEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`BType\` you could get from the connection."""
  totalCount: Int!
}

type BType {
  rowId: Int!
  smallint: Int!
  bigint: BigInt!
  numeric: BigFloat!
  decimal: BigFloat!
  boolean: Boolean!
  varchar: String!
  enum: BColor!
  enumArray: [BColor]!
  domain: AnInt!
  domain2: BAnotherInt!
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
  compoundType: CCompoundType!
  nestedCompoundType: BNestedCompoundType!
  nullableCompoundType: CCompoundType
  nullableNestedCompoundType: BNestedCompoundType
  point: Point!
  nullablePoint: Point
  inet: InternetAddress
  cidr: CidrAddress
  macaddr: MacAddress
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

  """Reads a single \`Post\` that is related to this \`BType\`."""
  postBySmallint: Post

  """Reads a single \`Post\` that is related to this \`BType\`."""
  postByRowId: Post
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

scalar BAnotherInt

"""
Represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).
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

type BNestedCompoundType {
  a: CCompoundType
  b: CCompoundType
  bazBuz: Int
}

"""A cartesian point."""
type Point {
  x: Float!
  y: Float!
}

"""An IPv4 or IPv6 host address, and optionally its subnet."""
scalar InternetAddress

"""An IPv4 or IPv6 CIDR address."""
scalar CidrAddress

"""A 6-byte MAC address."""
scalar MacAddress

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

"""A \`BType\` edge in the connection."""
type BTypeEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`BType\` at the end of the edge."""
  node: BType
}

"""
A condition to be used against \`BType\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input BTypeCondition {
  """Checks for equality with the object’s \`rowId\` field."""
  rowId: Int

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
  enum: BColor

  """Checks for equality with the object’s \`domain\` field."""
  domain: AnInt

  """Checks for equality with the object’s \`domain2\` field."""
  domain2: BAnotherInt

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

  """Checks for equality with the object’s \`money\` field."""
  money: Float

  """Checks for equality with the object’s \`point\` field."""
  point: PointInput

  """Checks for equality with the object’s \`nullablePoint\` field."""
  nullablePoint: PointInput

  """Checks for equality with the object’s \`inet\` field."""
  inet: InternetAddress

  """Checks for equality with the object’s \`cidr\` field."""
  cidr: CidrAddress

  """Checks for equality with the object’s \`macaddr\` field."""
  macaddr: MacAddress

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

  """Checks for equality with the object’s \`ltree\` field."""
  ltree: LTree
}

"""A cartesian point."""
input PointInput {
  x: Float!
  y: Float!
}

"""Methods to use when ordering \`BType\`."""
enum BTypeOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ROW_ID_ASC
  ROW_ID_DESC
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
  DOMAIN_ASC
  DOMAIN_DESC
  DOMAIN2_ASC
  DOMAIN2_DESC
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
  INET_ASC
  INET_DESC
  CIDR_ASC
  CIDR_DESC
  MACADDR_ASC
  MACADDR_DESC
  LTREE_ASC
  LTREE_DESC
}

"""A connection to a list of \`CPerson\` values."""
type CPersonConnection {
  """A list of \`CPerson\` objects."""
  nodes: [CPerson]!

  """
  A list of edges which contains the \`CPerson\` and cursor to aid in pagination.
  """
  edges: [CPersonEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`CPerson\` you could get from the connection."""
  totalCount: Int!
}

"""A \`CPerson\` edge in the connection."""
type CPersonEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`CPerson\` at the end of the edge."""
  node: CPerson
}

type BWrappedUrl {
  url: BNotNullUrl!
}

scalar BNotNullUrl

"""
A set of key/value pairs, keys are strings, values may be a string or null. Exposed as a JSON object.
"""
scalar KeyValueHash

"""A connection to a list of \`Post\` values."""
type PostConnection {
  """A list of \`Post\` objects."""
  nodes: [Post]!

  """
  A list of edges which contains the \`Post\` and cursor to aid in pagination.
  """
  edges: [PostEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Post\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Post\` edge in the connection."""
type PostEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Post\` at the end of the edge."""
  node: Post
}

"""
A condition to be used against \`Post\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input PostCondition {
  """Checks for equality with the object’s \`rowId\` field."""
  rowId: Int

  """Checks for equality with the object’s \`headline\` field."""
  headline: String

  """Checks for equality with the object’s \`body\` field."""
  body: String

  """Checks for equality with the object’s \`authorId\` field."""
  authorId: Int
}

"""Methods to use when ordering \`Post\`."""
enum PostOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ROW_ID_ASC
  ROW_ID_DESC
  HEADLINE_ASC
  HEADLINE_DESC
  BODY_ASC
  BODY_DESC
  AUTHOR_ID_ASC
  AUTHOR_ID_DESC
}

"""A connection to a list of \`ForeignKey\` values."""
type ForeignKeyConnection {
  """A list of \`ForeignKey\` objects."""
  nodes: [ForeignKey]!

  """
  A list of edges which contains the \`ForeignKey\` and cursor to aid in pagination.
  """
  edges: [ForeignKeyEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`ForeignKey\` you could get from the connection."""
  totalCount: Int!
}

type ForeignKey {
  personId: Int
  compoundKey1: Int
  compoundKey2: Int

  """Reads a single \`CCompoundKey\` that is related to this \`ForeignKey\`."""
  cCompoundKeyByCompoundKey1AndCompoundKey2: CCompoundKey

  """Reads a single \`CPerson\` that is related to this \`ForeignKey\`."""
  cPersonByPersonId: CPerson
}

"""A \`ForeignKey\` edge in the connection."""
type ForeignKeyEdge {
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
enum ForeignKeyOrderBy {
  NATURAL
  PERSON_ID_ASC
  PERSON_ID_DESC
  COMPOUND_KEY_1_ASC
  COMPOUND_KEY_1_DESC
  COMPOUND_KEY_2_ASC
  COMPOUND_KEY_2_DESC
}

"""Tracks the person's secret"""
type CPersonSecret {
  personId: Int!

  """A secret held by the associated Person"""
  secret: String

  """The \`Person\` this \`PersonSecret\` belongs to."""
  cPersonByPersonId: CPerson
}

"""Tracks metadata about the left arms of various people"""
type CLeftArm {
  rowId: Int!
  personId: Int
  lengthInMetres: Float
  mood: String!

  """Reads a single \`CPerson\` that is related to this \`CLeftArm\`."""
  cPersonByPersonId: CPerson
}

"""A connection to a list of \`CCompoundKey\` values."""
type CCompoundKeyConnection {
  """A list of \`CCompoundKey\` objects."""
  nodes: [CCompoundKey]!

  """
  A list of edges which contains the \`CCompoundKey\` and cursor to aid in pagination.
  """
  edges: [CCompoundKeyEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`CCompoundKey\` you could get from the connection."""
  totalCount: Int!
}

"""A \`CCompoundKey\` edge in the connection."""
type CCompoundKeyEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`CCompoundKey\` at the end of the edge."""
  node: CCompoundKey
}

"""
A condition to be used against \`CCompoundKey\` object types. All fields are
tested for equality and combined with a logical ‘and.’
"""
input CCompoundKeyCondition {
  """Checks for equality with the object’s \`personId2\` field."""
  personId2: Int

  """Checks for equality with the object’s \`personId1\` field."""
  personId1: Int

  """Checks for equality with the object’s \`extra\` field."""
  extra: Boolean
}

"""Methods to use when ordering \`CCompoundKey\`."""
enum CCompoundKeyOrderBy {
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

type CMyTable {
  rowId: Int!
  jsonData: JSON
}

type ViewTable {
  rowId: Int!
  col1: Int
  col2: Int
}

type SimilarTable1 {
  rowId: Int!
  col1: Int
  col2: Int
  col3: Int!
}

type SimilarTable2 {
  rowId: Int!
  col3: Int!
  col4: Int
  col5: Int
}

type CNullTestRecord {
  rowId: Int!
  nullableText: String
  nullableInt: Int
  nonNullText: String!
}

type CIssue756 {
  rowId: Int!
  ts: CNotNullTimestamp!
}

scalar CNotNullTimestamp

type BList {
  rowId: Int!
  intArray: [Int]
  intArrayNn: [Int]!
  enumArray: [BColor]
  enumArrayNn: [BColor]!
  dateArray: [Date]
  dateArrayNn: [Date]!
  timestamptzArray: [Datetime]
  timestamptzArrayNn: [Datetime]!
  compoundTypeArray: [CCompoundType]
  compoundTypeArrayNn: [CCompoundType]!
  byteaArray: [Base64EncodedBinary]
  byteaArrayNn: [Base64EncodedBinary]!
}

"""A connection to a list of \`Int\` values."""
type CFuncOutSetofConnection {
  """A list of \`Int\` objects."""
  nodes: [Int]!

  """
  A list of edges which contains the \`Int\` and cursor to aid in pagination.
  """
  edges: [CFuncOutSetofEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Int\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Int\` edge in the connection."""
type CFuncOutSetofEdge {
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
type CFuncReturnsTableOneColConnection {
  """A list of \`Int\` objects."""
  nodes: [Int]!

  """
  A list of edges which contains the \`Int\` and cursor to aid in pagination.
  """
  edges: [CFuncReturnsTableOneColEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Int\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Int\` edge in the connection."""
type CFuncReturnsTableOneColEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Int\` at the end of the edge."""
  node: Int
}

type CFuncOutOutRecord {
  firstOut: Int
  secondOut: String
}

"""A connection to a list of \`CFuncOutOutSetofRecord\` values."""
type CFuncOutOutSetofConnection {
  """A list of \`CFuncOutOutSetofRecord\` objects."""
  nodes: [CFuncOutOutSetofRecord]!

  """
  A list of edges which contains the \`CFuncOutOutSetofRecord\` and cursor to aid in pagination.
  """
  edges: [CFuncOutOutSetofEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """
  The count of *all* \`CFuncOutOutSetofRecord\` you could get from the connection.
  """
  totalCount: Int!
}

type CFuncOutOutSetofRecord {
  o1: Int
  o2: String
}

"""A \`CFuncOutOutSetofRecord\` edge in the connection."""
type CFuncOutOutSetofEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`CFuncOutOutSetofRecord\` at the end of the edge."""
  node: CFuncOutOutSetofRecord
}

type CFuncOutOutUnnamedRecord {
  column1: Int
  column2: String
}

"""A connection to a list of \`CSearchTestSummariesRecord\` values."""
type CSearchTestSummariesConnection {
  """A list of \`CSearchTestSummariesRecord\` objects."""
  nodes: [CSearchTestSummariesRecord]!

  """
  A list of edges which contains the \`CSearchTestSummariesRecord\` and cursor to aid in pagination.
  """
  edges: [CSearchTestSummariesEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """
  The count of *all* \`CSearchTestSummariesRecord\` you could get from the connection.
  """
  totalCount: Int!
}

type CSearchTestSummariesRecord {
  id: Int
  totalDuration: Interval
}

"""A \`CSearchTestSummariesRecord\` edge in the connection."""
type CSearchTestSummariesEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`CSearchTestSummariesRecord\` at the end of the edge."""
  node: CSearchTestSummariesRecord
}

type CFuncOutUnnamedOutOutUnnamedRecord {
  column1: Int
  o2: String
  column3: Int
}

"""A connection to a list of \`Int\` values."""
type CIntSetQueryConnection {
  """A list of \`Int\` objects."""
  nodes: [Int]!

  """
  A list of edges which contains the \`Int\` and cursor to aid in pagination.
  """
  edges: [CIntSetQueryEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Int\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Int\` edge in the connection."""
type CIntSetQueryEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Int\` at the end of the edge."""
  node: Int
}

"""A connection to a list of \`CFuncReturnsTableMultiColRecord\` values."""
type CFuncReturnsTableMultiColConnection {
  """A list of \`CFuncReturnsTableMultiColRecord\` objects."""
  nodes: [CFuncReturnsTableMultiColRecord]!

  """
  A list of edges which contains the \`CFuncReturnsTableMultiColRecord\` and cursor to aid in pagination.
  """
  edges: [CFuncReturnsTableMultiColEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """
  The count of *all* \`CFuncReturnsTableMultiColRecord\` you could get from the connection.
  """
  totalCount: Int!
}

type CFuncReturnsTableMultiColRecord {
  col1: Int
  col2: String
}

"""A \`CFuncReturnsTableMultiColRecord\` edge in the connection."""
type CFuncReturnsTableMultiColEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`CFuncReturnsTableMultiColRecord\` at the end of the edge."""
  node: CFuncReturnsTableMultiColRecord
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

type CQueryOutputTwoRowsRecord {
  txt: String
  leftArm: CLeftArm
  post: Post
}

type CFuncOutOutCompoundTypeRecord {
  o1: Int
  o2: CCompoundType
}

"""A connection to a list of \`CCompoundType\` values."""
type CCompoundTypeConnection {
  """A list of \`CCompoundType\` objects."""
  nodes: [CCompoundType]!

  """
  A list of edges which contains the \`CCompoundType\` and cursor to aid in pagination.
  """
  edges: [CCompoundTypeEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`CCompoundType\` you could get from the connection."""
  totalCount: Int!
}

"""A \`CCompoundType\` edge in the connection."""
type CCompoundTypeEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`CCompoundType\` at the end of the edge."""
  node: CCompoundType
}

type CFuncOutComplexRecord {
  x: Int
  y: CCompoundType
  z: CPerson
}

"""A connection to a list of \`CFuncOutComplexSetofRecord\` values."""
type CFuncOutComplexSetofConnection {
  """A list of \`CFuncOutComplexSetofRecord\` objects."""
  nodes: [CFuncOutComplexSetofRecord]!

  """
  A list of edges which contains the \`CFuncOutComplexSetofRecord\` and cursor to aid in pagination.
  """
  edges: [CFuncOutComplexSetofEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """
  The count of *all* \`CFuncOutComplexSetofRecord\` you could get from the connection.
  """
  totalCount: Int!
}

type CFuncOutComplexSetofRecord {
  x: Int
  y: CCompoundType
  z: CPerson
}

"""A \`CFuncOutComplexSetofRecord\` edge in the connection."""
type CFuncOutComplexSetofEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`CFuncOutComplexSetofRecord\` at the end of the edge."""
  node: CFuncOutComplexSetofRecord
}

"""A connection to a list of \`NonUpdatableView\` values."""
type NonUpdatableViewConnection {
  """A list of \`NonUpdatableView\` objects."""
  nodes: [NonUpdatableView]!

  """
  A list of edges which contains the \`NonUpdatableView\` and cursor to aid in pagination.
  """
  edges: [NonUpdatableViewEdge]!

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
type NonUpdatableViewEdge {
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
enum NonUpdatableViewOrderBy {
  NATURAL
  COLUMN_ASC
  COLUMN_DESC
}

"""A connection to a list of \`Input\` values."""
type InputConnection {
  """A list of \`Input\` objects."""
  nodes: [Input]!

  """
  A list of edges which contains the \`Input\` and cursor to aid in pagination.
  """
  edges: [InputEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Input\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Input\` edge in the connection."""
type InputEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Input\` at the end of the edge."""
  node: Input
}

"""
A condition to be used against \`Input\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input InputCondition {
  """Checks for equality with the object’s \`rowId\` field."""
  rowId: Int
}

"""Methods to use when ordering \`Input\`."""
enum InputOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ROW_ID_ASC
  ROW_ID_DESC
}

"""A connection to a list of \`Patch\` values."""
type PatchConnection {
  """A list of \`Patch\` objects."""
  nodes: [Patch]!

  """
  A list of edges which contains the \`Patch\` and cursor to aid in pagination.
  """
  edges: [PatchEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Patch\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Patch\` edge in the connection."""
type PatchEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Patch\` at the end of the edge."""
  node: Patch
}

"""
A condition to be used against \`Patch\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input PatchCondition {
  """Checks for equality with the object’s \`rowId\` field."""
  rowId: Int
}

"""Methods to use when ordering \`Patch\`."""
enum PatchOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ROW_ID_ASC
  ROW_ID_DESC
}

"""A connection to a list of \`Reserved\` values."""
type ReservedConnection {
  """A list of \`Reserved\` objects."""
  nodes: [Reserved]!

  """
  A list of edges which contains the \`Reserved\` and cursor to aid in pagination.
  """
  edges: [ReservedEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Reserved\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Reserved\` edge in the connection."""
type ReservedEdge {
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
  """Checks for equality with the object’s \`rowId\` field."""
  rowId: Int
}

"""Methods to use when ordering \`Reserved\`."""
enum ReservedOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ROW_ID_ASC
  ROW_ID_DESC
}

"""A connection to a list of \`ReservedPatchRecord\` values."""
type ReservedPatchRecordConnection {
  """A list of \`ReservedPatchRecord\` objects."""
  nodes: [ReservedPatchRecord]!

  """
  A list of edges which contains the \`ReservedPatchRecord\` and cursor to aid in pagination.
  """
  edges: [ReservedPatchRecordEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """
  The count of *all* \`ReservedPatchRecord\` you could get from the connection.
  """
  totalCount: Int!
}

"""A \`ReservedPatchRecord\` edge in the connection."""
type ReservedPatchRecordEdge {
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
  """Checks for equality with the object’s \`rowId\` field."""
  rowId: Int
}

"""Methods to use when ordering \`ReservedPatchRecord\`."""
enum ReservedPatchRecordOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ROW_ID_ASC
  ROW_ID_DESC
}

"""A connection to a list of \`ReservedInputRecord\` values."""
type ReservedInputRecordConnection {
  """A list of \`ReservedInputRecord\` objects."""
  nodes: [ReservedInputRecord]!

  """
  A list of edges which contains the \`ReservedInputRecord\` and cursor to aid in pagination.
  """
  edges: [ReservedInputRecordEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """
  The count of *all* \`ReservedInputRecord\` you could get from the connection.
  """
  totalCount: Int!
}

"""A \`ReservedInputRecord\` edge in the connection."""
type ReservedInputRecordEdge {
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
  """Checks for equality with the object’s \`rowId\` field."""
  rowId: Int
}

"""Methods to use when ordering \`ReservedInputRecord\`."""
enum ReservedInputRecordOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ROW_ID_ASC
  ROW_ID_DESC
}

"""A connection to a list of \`DefaultValue\` values."""
type DefaultValueConnection {
  """A list of \`DefaultValue\` objects."""
  nodes: [DefaultValue]!

  """
  A list of edges which contains the \`DefaultValue\` and cursor to aid in pagination.
  """
  edges: [DefaultValueEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`DefaultValue\` you could get from the connection."""
  totalCount: Int!
}

"""A \`DefaultValue\` edge in the connection."""
type DefaultValueEdge {
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
  """Checks for equality with the object’s \`rowId\` field."""
  rowId: Int

  """Checks for equality with the object’s \`nullValue\` field."""
  nullValue: String
}

"""Methods to use when ordering \`DefaultValue\`."""
enum DefaultValueOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ROW_ID_ASC
  ROW_ID_DESC
  NULL_VALUE_ASC
  NULL_VALUE_DESC
}

"""A connection to a list of \`NoPrimaryKey\` values."""
type NoPrimaryKeyConnection {
  """A list of \`NoPrimaryKey\` objects."""
  nodes: [NoPrimaryKey]!

  """
  A list of edges which contains the \`NoPrimaryKey\` and cursor to aid in pagination.
  """
  edges: [NoPrimaryKeyEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`NoPrimaryKey\` you could get from the connection."""
  totalCount: Int!
}

"""A \`NoPrimaryKey\` edge in the connection."""
type NoPrimaryKeyEdge {
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
  """Checks for equality with the object’s \`rowId\` field."""
  rowId: Int

  """Checks for equality with the object’s \`str\` field."""
  str: String
}

"""Methods to use when ordering \`NoPrimaryKey\`."""
enum NoPrimaryKeyOrderBy {
  NATURAL
  ROW_ID_ASC
  ROW_ID_DESC
  STR_ASC
  STR_DESC
}

"""A connection to a list of \`Testview\` values."""
type TestviewConnection {
  """A list of \`Testview\` objects."""
  nodes: [Testview]!

  """
  A list of edges which contains the \`Testview\` and cursor to aid in pagination.
  """
  edges: [TestviewEdge]!

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
type TestviewEdge {
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
enum TestviewOrderBy {
  NATURAL
  TESTVIEWID_ASC
  TESTVIEWID_DESC
  COL1_ASC
  COL1_DESC
  COL2_ASC
  COL2_DESC
}

"""A connection to a list of \`UniqueForeignKey\` values."""
type UniqueForeignKeyConnection {
  """A list of \`UniqueForeignKey\` objects."""
  nodes: [UniqueForeignKey]!

  """
  A list of edges which contains the \`UniqueForeignKey\` and cursor to aid in pagination.
  """
  edges: [UniqueForeignKeyEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """
  The count of *all* \`UniqueForeignKey\` you could get from the connection.
  """
  totalCount: Int!
}

"""A \`UniqueForeignKey\` edge in the connection."""
type UniqueForeignKeyEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`UniqueForeignKey\` at the end of the edge."""
  node: UniqueForeignKey
}

"""
A condition to be used against \`UniqueForeignKey\` object types. All fields are
tested for equality and combined with a logical ‘and.’
"""
input UniqueForeignKeyCondition {
  """Checks for equality with the object’s \`compoundKey1\` field."""
  compoundKey1: Int

  """Checks for equality with the object’s \`compoundKey2\` field."""
  compoundKey2: Int
}

"""Methods to use when ordering \`UniqueForeignKey\`."""
enum UniqueForeignKeyOrderBy {
  NATURAL
  COMPOUND_KEY_1_ASC
  COMPOUND_KEY_1_DESC
  COMPOUND_KEY_2_ASC
  COMPOUND_KEY_2_DESC
}

"""A connection to a list of \`CMyTable\` values."""
type CMyTableConnection {
  """A list of \`CMyTable\` objects."""
  nodes: [CMyTable]!

  """
  A list of edges which contains the \`CMyTable\` and cursor to aid in pagination.
  """
  edges: [CMyTableEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`CMyTable\` you could get from the connection."""
  totalCount: Int!
}

"""A \`CMyTable\` edge in the connection."""
type CMyTableEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`CMyTable\` at the end of the edge."""
  node: CMyTable
}

"""
A condition to be used against \`CMyTable\` object types. All fields are tested
for equality and combined with a logical ‘and.’
"""
input CMyTableCondition {
  """Checks for equality with the object’s \`rowId\` field."""
  rowId: Int
}

"""Methods to use when ordering \`CMyTable\`."""
enum CMyTableOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ROW_ID_ASC
  ROW_ID_DESC
}

"""A connection to a list of \`CPersonSecret\` values."""
type CPersonSecretConnection {
  """A list of \`CPersonSecret\` objects."""
  nodes: [CPersonSecret]!

  """
  A list of edges which contains the \`CPersonSecret\` and cursor to aid in pagination.
  """
  edges: [CPersonSecretEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`CPersonSecret\` you could get from the connection."""
  totalCount: Int!
}

"""A \`CPersonSecret\` edge in the connection."""
type CPersonSecretEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`CPersonSecret\` at the end of the edge."""
  node: CPersonSecret
}

"""
A condition to be used against \`CPersonSecret\` object types. All fields are
tested for equality and combined with a logical ‘and.’
"""
input CPersonSecretCondition {
  """Checks for equality with the object’s \`personId\` field."""
  personId: Int

  """Checks for equality with the object’s \`secret\` field."""
  secret: String
}

"""Methods to use when ordering \`CPersonSecret\`."""
enum CPersonSecretOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  PERSON_ID_ASC
  PERSON_ID_DESC
  SECRET_ASC
  SECRET_DESC
}

"""A connection to a list of \`ViewTable\` values."""
type ViewTableConnection {
  """A list of \`ViewTable\` objects."""
  nodes: [ViewTable]!

  """
  A list of edges which contains the \`ViewTable\` and cursor to aid in pagination.
  """
  edges: [ViewTableEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`ViewTable\` you could get from the connection."""
  totalCount: Int!
}

"""A \`ViewTable\` edge in the connection."""
type ViewTableEdge {
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
  """Checks for equality with the object’s \`rowId\` field."""
  rowId: Int

  """Checks for equality with the object’s \`col1\` field."""
  col1: Int

  """Checks for equality with the object’s \`col2\` field."""
  col2: Int
}

"""Methods to use when ordering \`ViewTable\`."""
enum ViewTableOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ROW_ID_ASC
  ROW_ID_DESC
  COL1_ASC
  COL1_DESC
  COL2_ASC
  COL2_DESC
}

"""A connection to a list of \`BUpdatableView\` values."""
type BUpdatableViewConnection {
  """A list of \`BUpdatableView\` objects."""
  nodes: [BUpdatableView]!

  """
  A list of edges which contains the \`BUpdatableView\` and cursor to aid in pagination.
  """
  edges: [BUpdatableViewEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`BUpdatableView\` you could get from the connection."""
  totalCount: Int!
}

"""YOYOYO!!"""
type BUpdatableView {
  x: Int
  name: String
  description: String

  """This is constantly 2"""
  constant: Int
}

"""A \`BUpdatableView\` edge in the connection."""
type BUpdatableViewEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`BUpdatableView\` at the end of the edge."""
  node: BUpdatableView
}

"""
A condition to be used against \`BUpdatableView\` object types. All fields are
tested for equality and combined with a logical ‘and.’
"""
input BUpdatableViewCondition {
  """Checks for equality with the object’s \`x\` field."""
  x: Int

  """Checks for equality with the object’s \`name\` field."""
  name: String

  """Checks for equality with the object’s \`description\` field."""
  description: String

  """Checks for equality with the object’s \`constant\` field."""
  constant: Int
}

"""Methods to use when ordering \`BUpdatableView\`."""
enum BUpdatableViewOrderBy {
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

"""A connection to a list of \`SimilarTable1\` values."""
type SimilarTable1Connection {
  """A list of \`SimilarTable1\` objects."""
  nodes: [SimilarTable1]!

  """
  A list of edges which contains the \`SimilarTable1\` and cursor to aid in pagination.
  """
  edges: [SimilarTable1Edge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`SimilarTable1\` you could get from the connection."""
  totalCount: Int!
}

"""A \`SimilarTable1\` edge in the connection."""
type SimilarTable1Edge {
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
  """Checks for equality with the object’s \`rowId\` field."""
  rowId: Int

  """Checks for equality with the object’s \`col1\` field."""
  col1: Int

  """Checks for equality with the object’s \`col2\` field."""
  col2: Int

  """Checks for equality with the object’s \`col3\` field."""
  col3: Int
}

"""Methods to use when ordering \`SimilarTable1\`."""
enum SimilarTable1OrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ROW_ID_ASC
  ROW_ID_DESC
  COL1_ASC
  COL1_DESC
  COL2_ASC
  COL2_DESC
  COL3_ASC
  COL3_DESC
}

"""A connection to a list of \`SimilarTable2\` values."""
type SimilarTable2Connection {
  """A list of \`SimilarTable2\` objects."""
  nodes: [SimilarTable2]!

  """
  A list of edges which contains the \`SimilarTable2\` and cursor to aid in pagination.
  """
  edges: [SimilarTable2Edge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`SimilarTable2\` you could get from the connection."""
  totalCount: Int!
}

"""A \`SimilarTable2\` edge in the connection."""
type SimilarTable2Edge {
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
  """Checks for equality with the object’s \`rowId\` field."""
  rowId: Int

  """Checks for equality with the object’s \`col3\` field."""
  col3: Int

  """Checks for equality with the object’s \`col4\` field."""
  col4: Int

  """Checks for equality with the object’s \`col5\` field."""
  col5: Int
}

"""Methods to use when ordering \`SimilarTable2\`."""
enum SimilarTable2OrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ROW_ID_ASC
  ROW_ID_DESC
  COL3_ASC
  COL3_DESC
  COL4_ASC
  COL4_DESC
  COL5_ASC
  COL5_DESC
}

"""A connection to a list of \`CNullTestRecord\` values."""
type CNullTestRecordConnection {
  """A list of \`CNullTestRecord\` objects."""
  nodes: [CNullTestRecord]!

  """
  A list of edges which contains the \`CNullTestRecord\` and cursor to aid in pagination.
  """
  edges: [CNullTestRecordEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """
  The count of *all* \`CNullTestRecord\` you could get from the connection.
  """
  totalCount: Int!
}

"""A \`CNullTestRecord\` edge in the connection."""
type CNullTestRecordEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`CNullTestRecord\` at the end of the edge."""
  node: CNullTestRecord
}

"""
A condition to be used against \`CNullTestRecord\` object types. All fields are
tested for equality and combined with a logical ‘and.’
"""
input CNullTestRecordCondition {
  """Checks for equality with the object’s \`rowId\` field."""
  rowId: Int

  """Checks for equality with the object’s \`nullableText\` field."""
  nullableText: String

  """Checks for equality with the object’s \`nullableInt\` field."""
  nullableInt: Int

  """Checks for equality with the object’s \`nonNullText\` field."""
  nonNullText: String
}

"""Methods to use when ordering \`CNullTestRecord\`."""
enum CNullTestRecordOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ROW_ID_ASC
  ROW_ID_DESC
  NULLABLE_TEXT_ASC
  NULLABLE_TEXT_DESC
  NULLABLE_INT_ASC
  NULLABLE_INT_DESC
  NON_NULL_TEXT_ASC
  NON_NULL_TEXT_DESC
}

"""A connection to a list of \`CEdgeCase\` values."""
type CEdgeCaseConnection {
  """A list of \`CEdgeCase\` objects."""
  nodes: [CEdgeCase]!

  """
  A list of edges which contains the \`CEdgeCase\` and cursor to aid in pagination.
  """
  edges: [CEdgeCaseEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`CEdgeCase\` you could get from the connection."""
  totalCount: Int!
}

type CEdgeCase {
  computed: String
  notNullHasDefault: Boolean!
  wontCastEasy: Int
  rowId: Int
}

"""A \`CEdgeCase\` edge in the connection."""
type CEdgeCaseEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`CEdgeCase\` at the end of the edge."""
  node: CEdgeCase
}

"""
A condition to be used against \`CEdgeCase\` object types. All fields are tested
for equality and combined with a logical ‘and.’
"""
input CEdgeCaseCondition {
  """Checks for equality with the object’s \`notNullHasDefault\` field."""
  notNullHasDefault: Boolean

  """Checks for equality with the object’s \`wontCastEasy\` field."""
  wontCastEasy: Int

  """Checks for equality with the object’s \`rowId\` field."""
  rowId: Int
}

"""Methods to use when ordering \`CEdgeCase\`."""
enum CEdgeCaseOrderBy {
  NATURAL
  NOT_NULL_HAS_DEFAULT_ASC
  NOT_NULL_HAS_DEFAULT_DESC
  WONT_CAST_EASY_ASC
  WONT_CAST_EASY_DESC
  ROW_ID_ASC
  ROW_ID_DESC
}

"""A connection to a list of \`CLeftArm\` values."""
type CLeftArmConnection {
  """A list of \`CLeftArm\` objects."""
  nodes: [CLeftArm]!

  """
  A list of edges which contains the \`CLeftArm\` and cursor to aid in pagination.
  """
  edges: [CLeftArmEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`CLeftArm\` you could get from the connection."""
  totalCount: Int!
}

"""A \`CLeftArm\` edge in the connection."""
type CLeftArmEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`CLeftArm\` at the end of the edge."""
  node: CLeftArm
}

"""
A condition to be used against \`CLeftArm\` object types. All fields are tested
for equality and combined with a logical ‘and.’
"""
input CLeftArmCondition {
  """Checks for equality with the object’s \`rowId\` field."""
  rowId: Int

  """Checks for equality with the object’s \`personId\` field."""
  personId: Int

  """Checks for equality with the object’s \`lengthInMetres\` field."""
  lengthInMetres: Float

  """Checks for equality with the object’s \`mood\` field."""
  mood: String
}

"""Methods to use when ordering \`CLeftArm\`."""
enum CLeftArmOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ROW_ID_ASC
  ROW_ID_DESC
  PERSON_ID_ASC
  PERSON_ID_DESC
  LENGTH_IN_METRES_ASC
  LENGTH_IN_METRES_DESC
  MOOD_ASC
  MOOD_DESC
}

"""A connection to a list of \`CIssue756\` values."""
type CIssue756Connection {
  """A list of \`CIssue756\` objects."""
  nodes: [CIssue756]!

  """
  A list of edges which contains the \`CIssue756\` and cursor to aid in pagination.
  """
  edges: [CIssue756Edge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`CIssue756\` you could get from the connection."""
  totalCount: Int!
}

"""A \`CIssue756\` edge in the connection."""
type CIssue756Edge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`CIssue756\` at the end of the edge."""
  node: CIssue756
}

"""
A condition to be used against \`CIssue756\` object types. All fields are tested
for equality and combined with a logical ‘and.’
"""
input CIssue756Condition {
  """Checks for equality with the object’s \`rowId\` field."""
  rowId: Int

  """Checks for equality with the object’s \`ts\` field."""
  ts: CNotNullTimestamp
}

"""Methods to use when ordering \`CIssue756\`."""
enum CIssue756OrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ROW_ID_ASC
  ROW_ID_DESC
  TS_ASC
  TS_DESC
}

"""
A condition to be used against \`CPerson\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input CPersonCondition {
  """Checks for equality with the object’s \`rowId\` field."""
  rowId: Int

  """Checks for equality with the object’s \`name\` field."""
  name: String

  """Checks for equality with the object’s \`about\` field."""
  about: String

  """Checks for equality with the object’s \`email\` field."""
  email: BEmail

  """Checks for equality with the object’s \`lastLoginFromIp\` field."""
  lastLoginFromIp: InternetAddress

  """Checks for equality with the object’s \`lastLoginFromSubnet\` field."""
  lastLoginFromSubnet: CidrAddress

  """Checks for equality with the object’s \`userMac\` field."""
  userMac: MacAddress

  """Checks for equality with the object’s \`createdAt\` field."""
  createdAt: Datetime
}

"""Methods to use when ordering \`CPerson\`."""
enum CPersonOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ROW_ID_ASC
  ROW_ID_DESC
  NAME_ASC
  NAME_DESC
  ABOUT_ASC
  ABOUT_DESC
  EMAIL_ASC
  EMAIL_DESC
  LAST_LOGIN_FROM_IP_ASC
  LAST_LOGIN_FROM_IP_DESC
  LAST_LOGIN_FROM_SUBNET_ASC
  LAST_LOGIN_FROM_SUBNET_DESC
  USER_MAC_ASC
  USER_MAC_DESC
  CREATED_AT_ASC
  CREATED_AT_DESC
}

"""A connection to a list of \`BList\` values."""
type BListConnection {
  """A list of \`BList\` objects."""
  nodes: [BList]!

  """
  A list of edges which contains the \`BList\` and cursor to aid in pagination.
  """
  edges: [BListEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`BList\` you could get from the connection."""
  totalCount: Int!
}

"""A \`BList\` edge in the connection."""
type BListEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`BList\` at the end of the edge."""
  node: BList
}

"""
A condition to be used against \`BList\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input BListCondition {
  """Checks for equality with the object’s \`rowId\` field."""
  rowId: Int
}

"""Methods to use when ordering \`BList\`."""
enum BListOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ROW_ID_ASC
  ROW_ID_DESC
}

"""
The root mutation type which contains root level fields which mutate data.
"""
type Mutation {
  cMutationOut(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CMutationOutInput!
  ): CMutationOutPayload
  cMutationOutSetof(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CMutationOutSetofInput!
  ): CMutationOutSetofPayload
  cMutationOutUnnamed(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CMutationOutUnnamedInput!
  ): CMutationOutUnnamedPayload
  cNoArgsMutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CNoArgsMutationInput!
  ): CNoArgsMutationPayload
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
  cMutationInOut(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CMutationInOutInput!
  ): CMutationInOutPayload
  cMutationReturnsTableOneCol(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CMutationReturnsTableOneColInput!
  ): CMutationReturnsTableOneColPayload
  cJsonIdentityMutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CJsonIdentityMutationInput!
  ): CJsonIdentityMutationPayload
  cJsonbIdentityMutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CJsonbIdentityMutationInput!
  ): CJsonbIdentityMutationPayload
  cJsonbIdentityMutationPlpgsql(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CJsonbIdentityMutationPlpgsqlInput!
  ): CJsonbIdentityMutationPlpgsqlPayload
  cJsonbIdentityMutationPlpgsqlWithDefault(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CJsonbIdentityMutationPlpgsqlWithDefaultInput!
  ): CJsonbIdentityMutationPlpgsqlWithDefaultPayload

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
  bMult1(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: BMult1Input!
  ): BMult1Payload
  bMult2(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: BMult2Input!
  ): BMult2Payload
  bMult3(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: BMult3Input!
  ): BMult3Payload
  bMult4(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: BMult4Input!
  ): BMult4Payload
  cMutationInInout(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CMutationInInoutInput!
  ): CMutationInInoutPayload
  cMutationOutOut(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CMutationOutOutInput!
  ): CMutationOutOutPayload
  cMutationOutOutSetof(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CMutationOutOutSetofInput!
  ): CMutationOutOutSetofPayload
  cMutationOutOutUnnamed(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CMutationOutOutUnnamedInput!
  ): CMutationOutOutUnnamedPayload
  cIntSetMutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CIntSetMutationInput!
  ): CIntSetMutationPayload
  cMutationOutUnnamedOutOutUnnamed(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CMutationOutUnnamedOutOutUnnamedInput!
  ): CMutationOutUnnamedOutOutUnnamedPayload
  cMutationReturnsTableMultiCol(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CMutationReturnsTableMultiColInput!
  ): CMutationReturnsTableMultiColPayload
  bListBdeMutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: BListBdeMutationInput!
  ): BListBdeMutationPayload
  bGuidFn(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: BGuidFnInput!
  ): BGuidFnPayload
  bAuthenticateFail(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: BAuthenticateFailInput!
  ): BAuthenticateFailPayload
  bAuthenticate(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: BAuthenticateInput!
  ): BAuthenticatePayload
  cTypesMutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CTypesMutationInput!
  ): CTypesMutationPayload
  cLeftArmIdentity(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CLeftArmIdentityInput!
  ): CLeftArmIdentityPayload
  cIssue756Mutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CIssue756MutationInput!
  ): CIssue756MutationPayload
  cIssue756SetMutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CIssue756SetMutationInput!
  ): CIssue756SetMutationPayload
  bAuthenticateMany(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: BAuthenticateManyInput!
  ): BAuthenticateManyPayload
  bAuthenticatePayload(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: BAuthenticatePayloadInput!
  ): BAuthenticatePayloadPayload
  cMutationOutOutCompoundType(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CMutationOutOutCompoundTypeInput!
  ): CMutationOutOutCompoundTypePayload
  cTableMutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CTableMutationInput!
  ): CTableMutationPayload
  postWithSuffix(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: PostWithSuffixInput!
  ): PostWithSuffixPayload @deprecated(reason: "This is deprecated (comment on function a.post_with_suffix).")
  bCompoundTypeMutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: BCompoundTypeMutationInput!
  ): BCompoundTypeMutationPayload
  bCompoundTypeSetMutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: BCompoundTypeSetMutationInput!
  ): BCompoundTypeSetMutationPayload
  cListOfCompoundTypesMutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CListOfCompoundTypesMutationInput!
  ): CListOfCompoundTypesMutationPayload
  cMutationOutComplex(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CMutationOutComplexInput!
  ): CMutationOutComplexPayload
  cMutationOutComplexSetof(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CMutationOutComplexSetofInput!
  ): CMutationOutComplexSetofPayload
  mutationCompoundTypeArray(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: MutationCompoundTypeArrayInput!
  ): MutationCompoundTypeArrayPayload
  bCompoundTypeArrayMutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: BCompoundTypeArrayMutationInput!
  ): BCompoundTypeArrayMutationPayload
  postMany(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: PostManyInput!
  ): PostManyPayload
  cMutationOutTable(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CMutationOutTableInput!
  ): CMutationOutTablePayload
  cMutationOutTableSetof(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CMutationOutTableSetofInput!
  ): CMutationOutTableSetofPayload
  cTableSetMutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CTableSetMutationInput!
  ): CTableSetMutationPayload
  bTypeFunctionConnectionMutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: BTypeFunctionConnectionMutationInput!
  ): BTypeFunctionConnectionMutationPayload
  bTypeFunctionMutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: BTypeFunctionMutationInput!
  ): BTypeFunctionMutationPayload
  bTypeFunctionListMutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: BTypeFunctionListMutationInput!
  ): BTypeFunctionListMutationPayload

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

  """Creates a single \`UniqueForeignKey\`."""
  createUniqueForeignKey(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateUniqueForeignKeyInput!
  ): CreateUniqueForeignKeyPayload

  """Creates a single \`CMyTable\`."""
  createCMyTable(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateCMyTableInput!
  ): CreateCMyTablePayload

  """Creates a single \`CPersonSecret\`."""
  createCPersonSecret(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateCPersonSecretInput!
  ): CreateCPersonSecretPayload @deprecated(reason: "This is deprecated (comment on table c.person_secret).")

  """Creates a single \`ViewTable\`."""
  createViewTable(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateViewTableInput!
  ): CreateViewTablePayload

  """Creates a single \`BUpdatableView\`."""
  createBUpdatableView(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateBUpdatableViewInput!
  ): CreateBUpdatableViewPayload

  """Creates a single \`CCompoundKey\`."""
  createCCompoundKey(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateCCompoundKeyInput!
  ): CreateCCompoundKeyPayload

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

  """Creates a single \`CNullTestRecord\`."""
  createCNullTestRecord(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateCNullTestRecordInput!
  ): CreateCNullTestRecordPayload

  """Creates a single \`CEdgeCase\`."""
  createCEdgeCase(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateCEdgeCaseInput!
  ): CreateCEdgeCasePayload

  """Creates a single \`CLeftArm\`."""
  createCLeftArm(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateCLeftArmInput!
  ): CreateCLeftArmPayload

  """Creates a single \`CIssue756\`."""
  createCIssue756(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateCIssue756Input!
  ): CreateCIssue756Payload

  """Creates a single \`Post\`."""
  createPost(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreatePostInput!
  ): CreatePostPayload

  """Creates a single \`CPerson\`."""
  createCPerson(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateCPersonInput!
  ): CreateCPersonPayload

  """Creates a single \`BList\`."""
  createBList(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateBListInput!
  ): CreateBListPayload

  """Creates a single \`BType\`."""
  createBType(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateBTypeInput!
  ): CreateBTypePayload

  """Updates a single \`Input\` using a unique key and a patch."""
  updateInputByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateInputByRowIdInput!
  ): UpdateInputPayload

  """Updates a single \`Patch\` using a unique key and a patch."""
  updatePatchByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdatePatchByRowIdInput!
  ): UpdatePatchPayload

  """Updates a single \`Reserved\` using a unique key and a patch."""
  updateReservedByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateReservedByRowIdInput!
  ): UpdateReservedPayload

  """Updates a single \`ReservedPatchRecord\` using a unique key and a patch."""
  updateReservedPatchRecordByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateReservedPatchRecordByRowIdInput!
  ): UpdateReservedPatchRecordPayload

  """Updates a single \`ReservedInputRecord\` using a unique key and a patch."""
  updateReservedInputRecordByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateReservedInputRecordByRowIdInput!
  ): UpdateReservedInputRecordPayload

  """Updates a single \`DefaultValue\` using a unique key and a patch."""
  updateDefaultValueByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateDefaultValueByRowIdInput!
  ): UpdateDefaultValuePayload

  """Updates a single \`NoPrimaryKey\` using a unique key and a patch."""
  updateNoPrimaryKeyByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateNoPrimaryKeyByRowIdInput!
  ): UpdateNoPrimaryKeyPayload

  """Updates a single \`UniqueForeignKey\` using a unique key and a patch."""
  updateUniqueForeignKeyByCompoundKey1AndCompoundKey2(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateUniqueForeignKeyByCompoundKey1AndCompoundKey2Input!
  ): UpdateUniqueForeignKeyPayload

  """Updates a single \`CMyTable\` using a unique key and a patch."""
  updateCMyTableByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateCMyTableByRowIdInput!
  ): UpdateCMyTablePayload

  """Updates a single \`CPersonSecret\` using a unique key and a patch."""
  updateCPersonSecretByPersonId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateCPersonSecretByPersonIdInput!
  ): UpdateCPersonSecretPayload @deprecated(reason: "This is deprecated (comment on table c.person_secret).")

  """Updates a single \`ViewTable\` using a unique key and a patch."""
  updateViewTableByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateViewTableByRowIdInput!
  ): UpdateViewTablePayload

  """Updates a single \`CCompoundKey\` using a unique key and a patch."""
  updateCCompoundKeyByPersonId1AndPersonId2(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateCCompoundKeyByPersonId1AndPersonId2Input!
  ): UpdateCCompoundKeyPayload

  """Updates a single \`SimilarTable1\` using a unique key and a patch."""
  updateSimilarTable1ByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateSimilarTable1ByRowIdInput!
  ): UpdateSimilarTable1Payload

  """Updates a single \`SimilarTable2\` using a unique key and a patch."""
  updateSimilarTable2ByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateSimilarTable2ByRowIdInput!
  ): UpdateSimilarTable2Payload

  """Updates a single \`CNullTestRecord\` using a unique key and a patch."""
  updateCNullTestRecordByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateCNullTestRecordByRowIdInput!
  ): UpdateCNullTestRecordPayload

  """Updates a single \`CLeftArm\` using a unique key and a patch."""
  updateCLeftArmByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateCLeftArmByRowIdInput!
  ): UpdateCLeftArmPayload

  """Updates a single \`CLeftArm\` using a unique key and a patch."""
  updateCLeftArmByPersonId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateCLeftArmByPersonIdInput!
  ): UpdateCLeftArmPayload

  """Updates a single \`CIssue756\` using a unique key and a patch."""
  updateCIssue756ByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateCIssue756ByRowIdInput!
  ): UpdateCIssue756Payload

  """Updates a single \`Post\` using a unique key and a patch."""
  updatePostByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdatePostByRowIdInput!
  ): UpdatePostPayload

  """Updates a single \`CPerson\` using a unique key and a patch."""
  updateCPersonByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateCPersonByRowIdInput!
  ): UpdateCPersonPayload

  """Updates a single \`CPerson\` using a unique key and a patch."""
  updateCPersonByEmail(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateCPersonByEmailInput!
  ): UpdateCPersonPayload

  """Updates a single \`BList\` using a unique key and a patch."""
  updateBListByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateBListByRowIdInput!
  ): UpdateBListPayload

  """Updates a single \`BType\` using a unique key and a patch."""
  updateBTypeByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateBTypeByRowIdInput!
  ): UpdateBTypePayload

  """Deletes a single \`Input\` using a unique key."""
  deleteInputByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteInputByRowIdInput!
  ): DeleteInputPayload

  """Deletes a single \`Patch\` using a unique key."""
  deletePatchByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeletePatchByRowIdInput!
  ): DeletePatchPayload

  """Deletes a single \`Reserved\` using a unique key."""
  deleteReservedByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteReservedByRowIdInput!
  ): DeleteReservedPayload

  """Deletes a single \`ReservedPatchRecord\` using a unique key."""
  deleteReservedPatchRecordByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteReservedPatchRecordByRowIdInput!
  ): DeleteReservedPatchRecordPayload

  """Deletes a single \`ReservedInputRecord\` using a unique key."""
  deleteReservedInputRecordByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteReservedInputRecordByRowIdInput!
  ): DeleteReservedInputRecordPayload

  """Deletes a single \`DefaultValue\` using a unique key."""
  deleteDefaultValueByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteDefaultValueByRowIdInput!
  ): DeleteDefaultValuePayload

  """Deletes a single \`NoPrimaryKey\` using a unique key."""
  deleteNoPrimaryKeyByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteNoPrimaryKeyByRowIdInput!
  ): DeleteNoPrimaryKeyPayload

  """Deletes a single \`UniqueForeignKey\` using a unique key."""
  deleteUniqueForeignKeyByCompoundKey1AndCompoundKey2(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteUniqueForeignKeyByCompoundKey1AndCompoundKey2Input!
  ): DeleteUniqueForeignKeyPayload

  """Deletes a single \`CMyTable\` using a unique key."""
  deleteCMyTableByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteCMyTableByRowIdInput!
  ): DeleteCMyTablePayload

  """Deletes a single \`CPersonSecret\` using a unique key."""
  deleteCPersonSecretByPersonId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteCPersonSecretByPersonIdInput!
  ): DeleteCPersonSecretPayload @deprecated(reason: "This is deprecated (comment on table c.person_secret).")

  """Deletes a single \`ViewTable\` using a unique key."""
  deleteViewTableByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteViewTableByRowIdInput!
  ): DeleteViewTablePayload

  """Deletes a single \`CCompoundKey\` using a unique key."""
  deleteCCompoundKeyByPersonId1AndPersonId2(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteCCompoundKeyByPersonId1AndPersonId2Input!
  ): DeleteCCompoundKeyPayload

  """Deletes a single \`SimilarTable1\` using a unique key."""
  deleteSimilarTable1ByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteSimilarTable1ByRowIdInput!
  ): DeleteSimilarTable1Payload

  """Deletes a single \`SimilarTable2\` using a unique key."""
  deleteSimilarTable2ByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteSimilarTable2ByRowIdInput!
  ): DeleteSimilarTable2Payload

  """Deletes a single \`CNullTestRecord\` using a unique key."""
  deleteCNullTestRecordByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteCNullTestRecordByRowIdInput!
  ): DeleteCNullTestRecordPayload

  """Deletes a single \`CLeftArm\` using a unique key."""
  deleteCLeftArmByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteCLeftArmByRowIdInput!
  ): DeleteCLeftArmPayload

  """Deletes a single \`CLeftArm\` using a unique key."""
  deleteCLeftArmByPersonId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteCLeftArmByPersonIdInput!
  ): DeleteCLeftArmPayload

  """Deletes a single \`CIssue756\` using a unique key."""
  deleteCIssue756ByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteCIssue756ByRowIdInput!
  ): DeleteCIssue756Payload

  """Deletes a single \`Post\` using a unique key."""
  deletePostByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeletePostByRowIdInput!
  ): DeletePostPayload

  """Deletes a single \`CPerson\` using a unique key."""
  deleteCPersonByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteCPersonByRowIdInput!
  ): DeleteCPersonPayload

  """Deletes a single \`CPerson\` using a unique key."""
  deleteCPersonByEmail(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteCPersonByEmailInput!
  ): DeleteCPersonPayload

  """Deletes a single \`BList\` using a unique key."""
  deleteBListByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteBListByRowIdInput!
  ): DeleteBListPayload

  """Deletes a single \`BType\` using a unique key."""
  deleteBTypeByRowId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteBTypeByRowIdInput!
  ): DeleteBTypePayload
}

"""The output of our \`cMutationOut\` mutation."""
type CMutationOutPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: Int

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`cMutationOut\` mutation."""
input CMutationOutInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
}

"""The output of our \`cMutationOutSetof\` mutation."""
type CMutationOutSetofPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: [Int]

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`cMutationOutSetof\` mutation."""
input CMutationOutSetofInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
}

"""The output of our \`cMutationOutUnnamed\` mutation."""
type CMutationOutUnnamedPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: Int

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`cMutationOutUnnamed\` mutation."""
input CMutationOutUnnamedInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
}

"""The output of our \`cNoArgsMutation\` mutation."""
type CNoArgsMutationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: Int

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`cNoArgsMutation\` mutation."""
input CNoArgsMutationInput {
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
  result: [Interval]

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
  result: [Interval]

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
  result: [String]

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

"""The output of our \`cMutationInOut\` mutation."""
type CMutationInOutPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: Int

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`cMutationInOut\` mutation."""
input CMutationInOutInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  i: Int
}

"""The output of our \`cMutationReturnsTableOneCol\` mutation."""
type CMutationReturnsTableOneColPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: [Int]

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`cMutationReturnsTableOneCol\` mutation."""
input CMutationReturnsTableOneColInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  i: Int
}

"""The output of our \`cJsonIdentityMutation\` mutation."""
type CJsonIdentityMutationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: JSON

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`cJsonIdentityMutation\` mutation."""
input CJsonIdentityMutationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  json: JSON
}

"""The output of our \`cJsonbIdentityMutation\` mutation."""
type CJsonbIdentityMutationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: JSON

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`cJsonbIdentityMutation\` mutation."""
input CJsonbIdentityMutationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  json: JSON
}

"""The output of our \`cJsonbIdentityMutationPlpgsql\` mutation."""
type CJsonbIdentityMutationPlpgsqlPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: JSON

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`cJsonbIdentityMutationPlpgsql\` mutation."""
input CJsonbIdentityMutationPlpgsqlInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  _theJson: JSON!
}

"""The output of our \`cJsonbIdentityMutationPlpgsqlWithDefault\` mutation."""
type CJsonbIdentityMutationPlpgsqlWithDefaultPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: JSON

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`cJsonbIdentityMutationPlpgsqlWithDefault\` mutation."""
input CJsonbIdentityMutationPlpgsqlWithDefaultInput {
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
  result: Int!

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
  result: Int

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
  result: Int

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
  result: Int

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
  result: Int

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

"""The output of our \`bMult1\` mutation."""
type BMult1Payload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: Int

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`bMult1\` mutation."""
input BMult1Input {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  arg0: Int
  arg1: Int
}

"""The output of our \`bMult2\` mutation."""
type BMult2Payload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: Int

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`bMult2\` mutation."""
input BMult2Input {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  arg0: Int
  arg1: Int
}

"""The output of our \`bMult3\` mutation."""
type BMult3Payload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: Int

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`bMult3\` mutation."""
input BMult3Input {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  arg0: Int!
  arg1: Int!
}

"""The output of our \`bMult4\` mutation."""
type BMult4Payload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: Int

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`bMult4\` mutation."""
input BMult4Input {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  arg0: Int!
  arg1: Int!
}

"""The output of our \`cMutationInInout\` mutation."""
type CMutationInInoutPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: Int

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`cMutationInInout\` mutation."""
input CMutationInInoutInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  i: Int
  ino: Int
}

"""The output of our \`cMutationOutOut\` mutation."""
type CMutationOutOutPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: CMutationOutOutRecord

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

type CMutationOutOutRecord {
  firstOut: Int
  secondOut: String
}

"""All input for the \`cMutationOutOut\` mutation."""
input CMutationOutOutInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
}

"""The output of our \`cMutationOutOutSetof\` mutation."""
type CMutationOutOutSetofPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: [CMutationOutOutSetofRecord]

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

type CMutationOutOutSetofRecord {
  o1: Int
  o2: String
}

"""All input for the \`cMutationOutOutSetof\` mutation."""
input CMutationOutOutSetofInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
}

"""The output of our \`cMutationOutOutUnnamed\` mutation."""
type CMutationOutOutUnnamedPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: CMutationOutOutUnnamedRecord

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

type CMutationOutOutUnnamedRecord {
  column1: Int
  column2: String
}

"""All input for the \`cMutationOutOutUnnamed\` mutation."""
input CMutationOutOutUnnamedInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
}

"""The output of our \`cIntSetMutation\` mutation."""
type CIntSetMutationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: [Int]

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`cIntSetMutation\` mutation."""
input CIntSetMutationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  x: Int
  y: Int
  z: Int
}

"""The output of our \`cMutationOutUnnamedOutOutUnnamed\` mutation."""
type CMutationOutUnnamedOutOutUnnamedPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: CMutationOutUnnamedOutOutUnnamedRecord

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

type CMutationOutUnnamedOutOutUnnamedRecord {
  column1: Int
  o2: String
  column3: Int
}

"""All input for the \`cMutationOutUnnamedOutOutUnnamed\` mutation."""
input CMutationOutUnnamedOutOutUnnamedInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
}

"""The output of our \`cMutationReturnsTableMultiCol\` mutation."""
type CMutationReturnsTableMultiColPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: [CMutationReturnsTableMultiColRecord]

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

type CMutationReturnsTableMultiColRecord {
  col1: Int
  col2: String
}

"""All input for the \`cMutationReturnsTableMultiCol\` mutation."""
input CMutationReturnsTableMultiColInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  i: Int
}

"""The output of our \`bListBdeMutation\` mutation."""
type BListBdeMutationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: [UUID]

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`bListBdeMutation\` mutation."""
input BListBdeMutationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  b: [String]
  d: String
  e: String
}

"""The output of our \`bGuidFn\` mutation."""
type BGuidFnPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: BGuid

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

scalar BGuid

"""All input for the \`bGuidFn\` mutation."""
input BGuidFnInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  g: BGuid
}

"""The output of our \`bAuthenticateFail\` mutation."""
type BAuthenticateFailPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: BJwtToken

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

type BJwtToken {
  role: String
  exp: BigInt
  a: Int
  b: BigFloat
  c: BigInt
}

"""All input for the \`bAuthenticateFail\` mutation."""
input BAuthenticateFailInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
}

"""The output of our \`bAuthenticate\` mutation."""
type BAuthenticatePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: BJwtToken

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`bAuthenticate\` mutation."""
input BAuthenticateInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  a: Int
  b: BigFloat
  c: BigInt
}

"""The output of our \`cTypesMutation\` mutation."""
type CTypesMutationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: Boolean

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`cTypesMutation\` mutation."""
input CTypesMutationInput {
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

"""The output of our \`cLeftArmIdentity\` mutation."""
type CLeftArmIdentityPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  leftArm: CLeftArm

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`CLeftArm\`. May be used by Relay 1."""
  cLeftArmEdge(
    """The method to use when ordering \`CLeftArm\`."""
    orderBy: [CLeftArmOrderBy!]! = [PRIMARY_KEY_ASC]
  ): CLeftArmEdge
}

"""All input for the \`cLeftArmIdentity\` mutation."""
input CLeftArmIdentityInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  leftArm: CLeftArmBaseInput
}

"""An input representation of \`CLeftArm\` with nullable fields."""
input CLeftArmBaseInput {
  rowId: Int
  personId: Int
  lengthInMetres: Float
  mood: String
}

"""The output of our \`cIssue756Mutation\` mutation."""
type CIssue756MutationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: CIssue756

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`CIssue756\`. May be used by Relay 1."""
  cIssue756Edge(
    """The method to use when ordering \`CIssue756\`."""
    orderBy: [CIssue756OrderBy!]! = [PRIMARY_KEY_ASC]
  ): CIssue756Edge
}

"""All input for the \`cIssue756Mutation\` mutation."""
input CIssue756MutationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
}

"""The output of our \`cIssue756SetMutation\` mutation."""
type CIssue756SetMutationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: [CIssue756]

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`cIssue756SetMutation\` mutation."""
input CIssue756SetMutationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
}

"""The output of our \`bAuthenticateMany\` mutation."""
type BAuthenticateManyPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: [BJwtToken]

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`bAuthenticateMany\` mutation."""
input BAuthenticateManyInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  a: Int
  b: BigFloat
  c: BigInt
}

"""The output of our \`bAuthenticatePayload\` mutation."""
type BAuthenticatePayloadPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: BAuthPayload

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

type BAuthPayload {
  jwt: BJwtToken
  rowId: Int
  admin: Boolean

  """Reads a single \`CPerson\` that is related to this \`BAuthPayload\`."""
  cPersonByRowId: CPerson
}

"""All input for the \`bAuthenticatePayload\` mutation."""
input BAuthenticatePayloadInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  a: Int
  b: BigFloat
  c: BigInt
}

"""The output of our \`cMutationOutOutCompoundType\` mutation."""
type CMutationOutOutCompoundTypePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: CMutationOutOutCompoundTypeRecord

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

type CMutationOutOutCompoundTypeRecord {
  o1: Int
  o2: CCompoundType
}

"""All input for the \`cMutationOutOutCompoundType\` mutation."""
input CMutationOutOutCompoundTypeInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  i1: Int
}

"""The output of our \`cTableMutation\` mutation."""
type CTableMutationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: Post

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Post\`. May be used by Relay 1."""
  postEdge(
    """The method to use when ordering \`Post\`."""
    orderBy: [PostOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PostEdge
}

"""All input for the \`cTableMutation\` mutation."""
input CTableMutationInput {
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
  result: Post

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Post\`. May be used by Relay 1."""
  postEdge(
    """The method to use when ordering \`Post\`."""
    orderBy: [PostOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PostEdge
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
  rowId: Int
  headline: String!
  body: String
  authorId: Int
  enums: [AnEnum]
  comptypes: [ComptypeInput]
}

"""An input for mutations affecting \`Comptype\`"""
input ComptypeInput {
  schedule: Datetime
  isOptimised: Boolean
}

"""The output of our \`bCompoundTypeMutation\` mutation."""
type BCompoundTypeMutationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: CCompoundType

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`bCompoundTypeMutation\` mutation."""
input BCompoundTypeMutationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  object: CCompoundTypeInput
}

"""The output of our \`bCompoundTypeSetMutation\` mutation."""
type BCompoundTypeSetMutationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: [CCompoundType]

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`bCompoundTypeSetMutation\` mutation."""
input BCompoundTypeSetMutationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  object: CCompoundTypeInput
}

"""The output of our \`cListOfCompoundTypesMutation\` mutation."""
type CListOfCompoundTypesMutationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: [CCompoundType]

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`cListOfCompoundTypesMutation\` mutation."""
input CListOfCompoundTypesMutationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  records: [CCompoundTypeInput]
}

"""The output of our \`cMutationOutComplex\` mutation."""
type CMutationOutComplexPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: CMutationOutComplexRecord

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

type CMutationOutComplexRecord {
  x: Int
  y: CCompoundType
  z: CPerson
}

"""All input for the \`cMutationOutComplex\` mutation."""
input CMutationOutComplexInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  a: Int
  b: String
}

"""The output of our \`cMutationOutComplexSetof\` mutation."""
type CMutationOutComplexSetofPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: [CMutationOutComplexSetofRecord]

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

type CMutationOutComplexSetofRecord {
  x: Int
  y: CCompoundType
  z: CPerson
}

"""All input for the \`cMutationOutComplexSetof\` mutation."""
input CMutationOutComplexSetofInput {
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
  result: [CCompoundType]

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
  object: CCompoundTypeInput
}

"""The output of our \`bCompoundTypeArrayMutation\` mutation."""
type BCompoundTypeArrayMutationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: [CCompoundType]

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`bCompoundTypeArrayMutation\` mutation."""
input BCompoundTypeArrayMutationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  object: CCompoundTypeInput
}

"""The output of our \`postMany\` mutation."""
type PostManyPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: [Post]

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

"""The output of our \`cMutationOutTable\` mutation."""
type CMutationOutTablePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: CPerson

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`CPerson\`. May be used by Relay 1."""
  cPersonEdge(
    """The method to use when ordering \`CPerson\`."""
    orderBy: [CPersonOrderBy!]! = [PRIMARY_KEY_ASC]
  ): CPersonEdge
}

"""All input for the \`cMutationOutTable\` mutation."""
input CMutationOutTableInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
}

"""The output of our \`cMutationOutTableSetof\` mutation."""
type CMutationOutTableSetofPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: [CPerson]

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`cMutationOutTableSetof\` mutation."""
input CMutationOutTableSetofInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
}

"""The output of our \`cTableSetMutation\` mutation."""
type CTableSetMutationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: [CPerson]

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`cTableSetMutation\` mutation."""
input CTableSetMutationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
}

"""The output of our \`bTypeFunctionConnectionMutation\` mutation."""
type BTypeFunctionConnectionMutationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: [BType]

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`bTypeFunctionConnectionMutation\` mutation."""
input BTypeFunctionConnectionMutationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
}

"""The output of our \`bTypeFunctionMutation\` mutation."""
type BTypeFunctionMutationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: BType

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`BType\`. May be used by Relay 1."""
  bTypeEdge(
    """The method to use when ordering \`BType\`."""
    orderBy: [BTypeOrderBy!]! = [PRIMARY_KEY_ASC]
  ): BTypeEdge
}

"""All input for the \`bTypeFunctionMutation\` mutation."""
input BTypeFunctionMutationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int
}

"""The output of our \`bTypeFunctionListMutation\` mutation."""
type BTypeFunctionListMutationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  result: [BType]

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`bTypeFunctionListMutation\` mutation."""
input BTypeFunctionListMutationInput {
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
    orderBy: [InputOrderBy!]! = [PRIMARY_KEY_ASC]
  ): InputEdge
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
  rowId: Int
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
    orderBy: [PatchOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PatchEdge
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
  rowId: Int
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
    orderBy: [ReservedOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ReservedEdge
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
  rowId: Int
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
    orderBy: [ReservedPatchRecordOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ReservedPatchRecordEdge
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
  rowId: Int
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
    orderBy: [ReservedInputRecordOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ReservedInputRecordEdge
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
  rowId: Int
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
    orderBy: [DefaultValueOrderBy!]! = [PRIMARY_KEY_ASC]
  ): DefaultValueEdge
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
  rowId: Int
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
  rowId: Int!
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

"""The output of our create \`UniqueForeignKey\` mutation."""
type CreateUniqueForeignKeyPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`UniqueForeignKey\` that was created by this mutation."""
  uniqueForeignKey: UniqueForeignKey

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the create \`UniqueForeignKey\` mutation."""
input CreateUniqueForeignKeyInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`UniqueForeignKey\` to be created by this mutation."""
  uniqueForeignKey: UniqueForeignKeyInput!
}

"""An input for mutations affecting \`UniqueForeignKey\`"""
input UniqueForeignKeyInput {
  compoundKey1: Int
  compoundKey2: Int
}

"""The output of our create \`CMyTable\` mutation."""
type CreateCMyTablePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`CMyTable\` that was created by this mutation."""
  cMyTable: CMyTable

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`CMyTable\`. May be used by Relay 1."""
  cMyTableEdge(
    """The method to use when ordering \`CMyTable\`."""
    orderBy: [CMyTableOrderBy!]! = [PRIMARY_KEY_ASC]
  ): CMyTableEdge
}

"""All input for the create \`CMyTable\` mutation."""
input CreateCMyTableInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`CMyTable\` to be created by this mutation."""
  cMyTable: CMyTableInput!
}

"""An input for mutations affecting \`CMyTable\`"""
input CMyTableInput {
  rowId: Int
  jsonData: JSON
}

"""The output of our create \`CPersonSecret\` mutation."""
type CreateCPersonSecretPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`CPersonSecret\` that was created by this mutation."""
  cPersonSecret: CPersonSecret @deprecated(reason: "This is deprecated (comment on table c.person_secret).")

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`CPersonSecret\`. May be used by Relay 1."""
  cPersonSecretEdge(
    """The method to use when ordering \`CPersonSecret\`."""
    orderBy: [CPersonSecretOrderBy!]! = [PRIMARY_KEY_ASC]
  ): CPersonSecretEdge @deprecated(reason: "This is deprecated (comment on table c.person_secret).")
}

"""All input for the create \`CPersonSecret\` mutation."""
input CreateCPersonSecretInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`CPersonSecret\` to be created by this mutation."""
  cPersonSecret: CPersonSecretInput!
}

"""An input for mutations affecting \`CPersonSecret\`"""
input CPersonSecretInput {
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
    orderBy: [ViewTableOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ViewTableEdge
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
  rowId: Int
  col1: Int
  col2: Int
}

"""The output of our create \`BUpdatableView\` mutation."""
type CreateBUpdatableViewPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`BUpdatableView\` that was created by this mutation."""
  bUpdatableView: BUpdatableView

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the create \`BUpdatableView\` mutation."""
input CreateBUpdatableViewInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`BUpdatableView\` to be created by this mutation."""
  bUpdatableView: BUpdatableViewInput!
}

"""An input for mutations affecting \`BUpdatableView\`"""
input BUpdatableViewInput {
  x: Int
  name: String
  description: String

  """This is constantly 2"""
  constant: Int
}

"""The output of our create \`CCompoundKey\` mutation."""
type CreateCCompoundKeyPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`CCompoundKey\` that was created by this mutation."""
  cCompoundKey: CCompoundKey

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`CCompoundKey\`. May be used by Relay 1."""
  cCompoundKeyEdge(
    """The method to use when ordering \`CCompoundKey\`."""
    orderBy: [CCompoundKeyOrderBy!]! = [PRIMARY_KEY_ASC]
  ): CCompoundKeyEdge
}

"""All input for the create \`CCompoundKey\` mutation."""
input CreateCCompoundKeyInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`CCompoundKey\` to be created by this mutation."""
  cCompoundKey: CCompoundKeyInput!
}

"""An input for mutations affecting \`CCompoundKey\`"""
input CCompoundKeyInput {
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
    orderBy: [SimilarTable1OrderBy!]! = [PRIMARY_KEY_ASC]
  ): SimilarTable1Edge
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
  rowId: Int
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
    orderBy: [SimilarTable2OrderBy!]! = [PRIMARY_KEY_ASC]
  ): SimilarTable2Edge
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
  rowId: Int
  col3: Int!
  col4: Int
  col5: Int
}

"""The output of our create \`CNullTestRecord\` mutation."""
type CreateCNullTestRecordPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`CNullTestRecord\` that was created by this mutation."""
  cNullTestRecord: CNullTestRecord

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`CNullTestRecord\`. May be used by Relay 1."""
  cNullTestRecordEdge(
    """The method to use when ordering \`CNullTestRecord\`."""
    orderBy: [CNullTestRecordOrderBy!]! = [PRIMARY_KEY_ASC]
  ): CNullTestRecordEdge
}

"""All input for the create \`CNullTestRecord\` mutation."""
input CreateCNullTestRecordInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`CNullTestRecord\` to be created by this mutation."""
  cNullTestRecord: CNullTestRecordInput!
}

"""An input for mutations affecting \`CNullTestRecord\`"""
input CNullTestRecordInput {
  rowId: Int
  nullableText: String
  nullableInt: Int
  nonNullText: String!
}

"""The output of our create \`CEdgeCase\` mutation."""
type CreateCEdgeCasePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`CEdgeCase\` that was created by this mutation."""
  cEdgeCase: CEdgeCase

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the create \`CEdgeCase\` mutation."""
input CreateCEdgeCaseInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`CEdgeCase\` to be created by this mutation."""
  cEdgeCase: CEdgeCaseInput!
}

"""An input for mutations affecting \`CEdgeCase\`"""
input CEdgeCaseInput {
  notNullHasDefault: Boolean
  wontCastEasy: Int
  rowId: Int
}

"""The output of our create \`CLeftArm\` mutation."""
type CreateCLeftArmPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`CLeftArm\` that was created by this mutation."""
  cLeftArm: CLeftArm

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`CLeftArm\`. May be used by Relay 1."""
  cLeftArmEdge(
    """The method to use when ordering \`CLeftArm\`."""
    orderBy: [CLeftArmOrderBy!]! = [PRIMARY_KEY_ASC]
  ): CLeftArmEdge
}

"""All input for the create \`CLeftArm\` mutation."""
input CreateCLeftArmInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`CLeftArm\` to be created by this mutation."""
  cLeftArm: CLeftArmInput!
}

"""An input for mutations affecting \`CLeftArm\`"""
input CLeftArmInput {
  rowId: Int
  personId: Int
  lengthInMetres: Float
  mood: String
}

"""The output of our create \`CIssue756\` mutation."""
type CreateCIssue756Payload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`CIssue756\` that was created by this mutation."""
  cIssue756: CIssue756

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`CIssue756\`. May be used by Relay 1."""
  cIssue756Edge(
    """The method to use when ordering \`CIssue756\`."""
    orderBy: [CIssue756OrderBy!]! = [PRIMARY_KEY_ASC]
  ): CIssue756Edge
}

"""All input for the create \`CIssue756\` mutation."""
input CreateCIssue756Input {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`CIssue756\` to be created by this mutation."""
  cIssue756: CIssue756Input!
}

"""An input for mutations affecting \`CIssue756\`"""
input CIssue756Input {
  rowId: Int
  ts: CNotNullTimestamp
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
    orderBy: [PostOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PostEdge
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

"""The output of our create \`CPerson\` mutation."""
type CreateCPersonPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`CPerson\` that was created by this mutation."""
  cPerson: CPerson

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`CPerson\`. May be used by Relay 1."""
  cPersonEdge(
    """The method to use when ordering \`CPerson\`."""
    orderBy: [CPersonOrderBy!]! = [PRIMARY_KEY_ASC]
  ): CPersonEdge
}

"""All input for the create \`CPerson\` mutation."""
input CreateCPersonInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`CPerson\` to be created by this mutation."""
  cPerson: CPersonInput!
}

"""An input for mutations affecting \`CPerson\`"""
input CPersonInput {
  """The primary unique identifier for the person"""
  rowId: Int

  """The person’s name"""
  name: String!
  aliases: [String]
  about: String
  email: BEmail!
  site: BWrappedUrlInput
  config: KeyValueHash
  lastLoginFromIp: InternetAddress
  lastLoginFromSubnet: CidrAddress
  userMac: MacAddress
  createdAt: Datetime
}

"""An input for mutations affecting \`BWrappedUrl\`"""
input BWrappedUrlInput {
  url: BNotNullUrl!
}

"""The output of our create \`BList\` mutation."""
type CreateBListPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`BList\` that was created by this mutation."""
  bList: BList

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`BList\`. May be used by Relay 1."""
  bListEdge(
    """The method to use when ordering \`BList\`."""
    orderBy: [BListOrderBy!]! = [PRIMARY_KEY_ASC]
  ): BListEdge
}

"""All input for the create \`BList\` mutation."""
input CreateBListInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`BList\` to be created by this mutation."""
  bList: BListInput!
}

"""An input for mutations affecting \`BList\`"""
input BListInput {
  rowId: Int
  intArray: [Int]
  intArrayNn: [Int]!
  enumArray: [BColor]
  enumArrayNn: [BColor]!
  dateArray: [Date]
  dateArrayNn: [Date]!
  timestamptzArray: [Datetime]
  timestamptzArrayNn: [Datetime]!
  compoundTypeArray: [CCompoundTypeInput]
  compoundTypeArrayNn: [CCompoundTypeInput]!
  byteaArray: [Base64EncodedBinary]
  byteaArrayNn: [Base64EncodedBinary]!
}

"""The output of our create \`BType\` mutation."""
type CreateBTypePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`BType\` that was created by this mutation."""
  bType: BType

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`BType\`. May be used by Relay 1."""
  bTypeEdge(
    """The method to use when ordering \`BType\`."""
    orderBy: [BTypeOrderBy!]! = [PRIMARY_KEY_ASC]
  ): BTypeEdge
}

"""All input for the create \`BType\` mutation."""
input CreateBTypeInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`BType\` to be created by this mutation."""
  bType: BTypeInput!
}

"""An input for mutations affecting \`BType\`"""
input BTypeInput {
  rowId: Int
  smallint: Int!
  bigint: BigInt!
  numeric: BigFloat!
  decimal: BigFloat!
  boolean: Boolean!
  varchar: String!
  enum: BColor!
  enumArray: [BColor]!
  domain: AnInt!
  domain2: BAnotherInt!
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
  compoundType: CCompoundTypeInput!
  nestedCompoundType: BNestedCompoundTypeInput!
  nullableCompoundType: CCompoundTypeInput
  nullableNestedCompoundType: BNestedCompoundTypeInput
  point: PointInput!
  nullablePoint: PointInput
  inet: InternetAddress
  cidr: CidrAddress
  macaddr: MacAddress
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

"""An input for mutations affecting \`BNestedCompoundType\`"""
input BNestedCompoundTypeInput {
  a: CCompoundTypeInput
  b: CCompoundTypeInput
  bazBuz: Int
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
    orderBy: [InputOrderBy!]! = [PRIMARY_KEY_ASC]
  ): InputEdge
}

"""All input for the \`updateInputByRowId\` mutation."""
input UpdateInputByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: Int!

  """
  An object where the defined keys will be set on the \`Input\` being updated.
  """
  inputPatch: InputPatch!
}

"""
Represents an update to a \`Input\`. Fields that are set will be updated.
"""
input InputPatch {
  rowId: Int
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
    orderBy: [PatchOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PatchEdge
}

"""All input for the \`updatePatchByRowId\` mutation."""
input UpdatePatchByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: Int!

  """
  An object where the defined keys will be set on the \`Patch\` being updated.
  """
  patchPatch: PatchPatch!
}

"""
Represents an update to a \`Patch\`. Fields that are set will be updated.
"""
input PatchPatch {
  rowId: Int
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
    orderBy: [ReservedOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ReservedEdge
}

"""All input for the \`updateReservedByRowId\` mutation."""
input UpdateReservedByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: Int!

  """
  An object where the defined keys will be set on the \`Reserved\` being updated.
  """
  reservedPatch: ReservedPatch!
}

"""
Represents an update to a \`Reserved\`. Fields that are set will be updated.
"""
input ReservedPatch {
  rowId: Int
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
    orderBy: [ReservedPatchRecordOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ReservedPatchRecordEdge
}

"""All input for the \`updateReservedPatchRecordByRowId\` mutation."""
input UpdateReservedPatchRecordByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: Int!

  """
  An object where the defined keys will be set on the \`ReservedPatchRecord\` being updated.
  """
  reservedPatchRecordPatch: ReservedPatchRecordPatch!
}

"""
Represents an update to a \`ReservedPatchRecord\`. Fields that are set will be updated.
"""
input ReservedPatchRecordPatch {
  rowId: Int
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
    orderBy: [ReservedInputRecordOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ReservedInputRecordEdge
}

"""All input for the \`updateReservedInputRecordByRowId\` mutation."""
input UpdateReservedInputRecordByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: Int!

  """
  An object where the defined keys will be set on the \`ReservedInputRecord\` being updated.
  """
  reservedInputRecordPatch: ReservedInputRecordPatch!
}

"""
Represents an update to a \`ReservedInputRecord\`. Fields that are set will be updated.
"""
input ReservedInputRecordPatch {
  rowId: Int
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
    orderBy: [DefaultValueOrderBy!]! = [PRIMARY_KEY_ASC]
  ): DefaultValueEdge
}

"""All input for the \`updateDefaultValueByRowId\` mutation."""
input UpdateDefaultValueByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: Int!

  """
  An object where the defined keys will be set on the \`DefaultValue\` being updated.
  """
  defaultValuePatch: DefaultValuePatch!
}

"""
Represents an update to a \`DefaultValue\`. Fields that are set will be updated.
"""
input DefaultValuePatch {
  rowId: Int
  nullValue: String
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

"""All input for the \`updateNoPrimaryKeyByRowId\` mutation."""
input UpdateNoPrimaryKeyByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: Int!

  """
  An object where the defined keys will be set on the \`NoPrimaryKey\` being updated.
  """
  noPrimaryKeyPatch: NoPrimaryKeyPatch!
}

"""
Represents an update to a \`NoPrimaryKey\`. Fields that are set will be updated.
"""
input NoPrimaryKeyPatch {
  rowId: Int
  str: String
}

"""The output of our update \`UniqueForeignKey\` mutation."""
type UpdateUniqueForeignKeyPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`UniqueForeignKey\` that was updated by this mutation."""
  uniqueForeignKey: UniqueForeignKey

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""
All input for the \`updateUniqueForeignKeyByCompoundKey1AndCompoundKey2\` mutation.
"""
input UpdateUniqueForeignKeyByCompoundKey1AndCompoundKey2Input {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  compoundKey1: Int!
  compoundKey2: Int!

  """
  An object where the defined keys will be set on the \`UniqueForeignKey\` being updated.
  """
  uniqueForeignKeyPatch: UniqueForeignKeyPatch!
}

"""
Represents an update to a \`UniqueForeignKey\`. Fields that are set will be updated.
"""
input UniqueForeignKeyPatch {
  compoundKey1: Int
  compoundKey2: Int
}

"""The output of our update \`CMyTable\` mutation."""
type UpdateCMyTablePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`CMyTable\` that was updated by this mutation."""
  cMyTable: CMyTable

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`CMyTable\`. May be used by Relay 1."""
  cMyTableEdge(
    """The method to use when ordering \`CMyTable\`."""
    orderBy: [CMyTableOrderBy!]! = [PRIMARY_KEY_ASC]
  ): CMyTableEdge
}

"""All input for the \`updateCMyTableByRowId\` mutation."""
input UpdateCMyTableByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: Int!

  """
  An object where the defined keys will be set on the \`CMyTable\` being updated.
  """
  cMyTablePatch: CMyTablePatch!
}

"""
Represents an update to a \`CMyTable\`. Fields that are set will be updated.
"""
input CMyTablePatch {
  rowId: Int
  jsonData: JSON
}

"""The output of our update \`CPersonSecret\` mutation."""
type UpdateCPersonSecretPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`CPersonSecret\` that was updated by this mutation."""
  cPersonSecret: CPersonSecret

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`CPersonSecret\`. May be used by Relay 1."""
  cPersonSecretEdge(
    """The method to use when ordering \`CPersonSecret\`."""
    orderBy: [CPersonSecretOrderBy!]! = [PRIMARY_KEY_ASC]
  ): CPersonSecretEdge @deprecated(reason: "This is deprecated (comment on table c.person_secret).")
}

"""All input for the \`updateCPersonSecretByPersonId\` mutation."""
input UpdateCPersonSecretByPersonIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  personId: Int!

  """
  An object where the defined keys will be set on the \`CPersonSecret\` being updated.
  """
  cPersonSecretPatch: CPersonSecretPatch!
}

"""
Represents an update to a \`CPersonSecret\`. Fields that are set will be updated.
"""
input CPersonSecretPatch {
  personId: Int

  """A secret held by the associated Person"""
  secret: String
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
    orderBy: [ViewTableOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ViewTableEdge
}

"""All input for the \`updateViewTableByRowId\` mutation."""
input UpdateViewTableByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: Int!

  """
  An object where the defined keys will be set on the \`ViewTable\` being updated.
  """
  viewTablePatch: ViewTablePatch!
}

"""
Represents an update to a \`ViewTable\`. Fields that are set will be updated.
"""
input ViewTablePatch {
  rowId: Int
  col1: Int
  col2: Int
}

"""The output of our update \`CCompoundKey\` mutation."""
type UpdateCCompoundKeyPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`CCompoundKey\` that was updated by this mutation."""
  cCompoundKey: CCompoundKey

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`CCompoundKey\`. May be used by Relay 1."""
  cCompoundKeyEdge(
    """The method to use when ordering \`CCompoundKey\`."""
    orderBy: [CCompoundKeyOrderBy!]! = [PRIMARY_KEY_ASC]
  ): CCompoundKeyEdge
}

"""
All input for the \`updateCCompoundKeyByPersonId1AndPersonId2\` mutation.
"""
input UpdateCCompoundKeyByPersonId1AndPersonId2Input {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  personId1: Int!
  personId2: Int!

  """
  An object where the defined keys will be set on the \`CCompoundKey\` being updated.
  """
  cCompoundKeyPatch: CCompoundKeyPatch!
}

"""
Represents an update to a \`CCompoundKey\`. Fields that are set will be updated.
"""
input CCompoundKeyPatch {
  personId2: Int
  personId1: Int
  extra: Boolean
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
    orderBy: [SimilarTable1OrderBy!]! = [PRIMARY_KEY_ASC]
  ): SimilarTable1Edge
}

"""All input for the \`updateSimilarTable1ByRowId\` mutation."""
input UpdateSimilarTable1ByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: Int!

  """
  An object where the defined keys will be set on the \`SimilarTable1\` being updated.
  """
  similarTable1Patch: SimilarTable1Patch!
}

"""
Represents an update to a \`SimilarTable1\`. Fields that are set will be updated.
"""
input SimilarTable1Patch {
  rowId: Int
  col1: Int
  col2: Int
  col3: Int
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
    orderBy: [SimilarTable2OrderBy!]! = [PRIMARY_KEY_ASC]
  ): SimilarTable2Edge
}

"""All input for the \`updateSimilarTable2ByRowId\` mutation."""
input UpdateSimilarTable2ByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: Int!

  """
  An object where the defined keys will be set on the \`SimilarTable2\` being updated.
  """
  similarTable2Patch: SimilarTable2Patch!
}

"""
Represents an update to a \`SimilarTable2\`. Fields that are set will be updated.
"""
input SimilarTable2Patch {
  rowId: Int
  col3: Int
  col4: Int
  col5: Int
}

"""The output of our update \`CNullTestRecord\` mutation."""
type UpdateCNullTestRecordPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`CNullTestRecord\` that was updated by this mutation."""
  cNullTestRecord: CNullTestRecord

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`CNullTestRecord\`. May be used by Relay 1."""
  cNullTestRecordEdge(
    """The method to use when ordering \`CNullTestRecord\`."""
    orderBy: [CNullTestRecordOrderBy!]! = [PRIMARY_KEY_ASC]
  ): CNullTestRecordEdge
}

"""All input for the \`updateCNullTestRecordByRowId\` mutation."""
input UpdateCNullTestRecordByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: Int!

  """
  An object where the defined keys will be set on the \`CNullTestRecord\` being updated.
  """
  cNullTestRecordPatch: CNullTestRecordPatch!
}

"""
Represents an update to a \`CNullTestRecord\`. Fields that are set will be updated.
"""
input CNullTestRecordPatch {
  rowId: Int
  nullableText: String
  nullableInt: Int
  nonNullText: String
}

"""The output of our update \`CLeftArm\` mutation."""
type UpdateCLeftArmPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`CLeftArm\` that was updated by this mutation."""
  cLeftArm: CLeftArm

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`CLeftArm\`. May be used by Relay 1."""
  cLeftArmEdge(
    """The method to use when ordering \`CLeftArm\`."""
    orderBy: [CLeftArmOrderBy!]! = [PRIMARY_KEY_ASC]
  ): CLeftArmEdge
}

"""All input for the \`updateCLeftArmByRowId\` mutation."""
input UpdateCLeftArmByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: Int!

  """
  An object where the defined keys will be set on the \`CLeftArm\` being updated.
  """
  cLeftArmPatch: CLeftArmPatch!
}

"""
Represents an update to a \`CLeftArm\`. Fields that are set will be updated.
"""
input CLeftArmPatch {
  rowId: Int
  personId: Int
  lengthInMetres: Float
  mood: String
}

"""All input for the \`updateCLeftArmByPersonId\` mutation."""
input UpdateCLeftArmByPersonIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  personId: Int!

  """
  An object where the defined keys will be set on the \`CLeftArm\` being updated.
  """
  cLeftArmPatch: CLeftArmPatch!
}

"""The output of our update \`CIssue756\` mutation."""
type UpdateCIssue756Payload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`CIssue756\` that was updated by this mutation."""
  cIssue756: CIssue756

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`CIssue756\`. May be used by Relay 1."""
  cIssue756Edge(
    """The method to use when ordering \`CIssue756\`."""
    orderBy: [CIssue756OrderBy!]! = [PRIMARY_KEY_ASC]
  ): CIssue756Edge
}

"""All input for the \`updateCIssue756ByRowId\` mutation."""
input UpdateCIssue756ByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: Int!

  """
  An object where the defined keys will be set on the \`CIssue756\` being updated.
  """
  cIssue756Patch: CIssue756Patch!
}

"""
Represents an update to a \`CIssue756\`. Fields that are set will be updated.
"""
input CIssue756Patch {
  rowId: Int
  ts: CNotNullTimestamp
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
    orderBy: [PostOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PostEdge
}

"""All input for the \`updatePostByRowId\` mutation."""
input UpdatePostByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: Int!

  """
  An object where the defined keys will be set on the \`Post\` being updated.
  """
  postPatch: PostPatch!
}

"""Represents an update to a \`Post\`. Fields that are set will be updated."""
input PostPatch {
  rowId: Int
  headline: String
  body: String
  authorId: Int
  enums: [AnEnum]
  comptypes: [ComptypeInput]
}

"""The output of our update \`CPerson\` mutation."""
type UpdateCPersonPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`CPerson\` that was updated by this mutation."""
  cPerson: CPerson

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`CPerson\`. May be used by Relay 1."""
  cPersonEdge(
    """The method to use when ordering \`CPerson\`."""
    orderBy: [CPersonOrderBy!]! = [PRIMARY_KEY_ASC]
  ): CPersonEdge
}

"""All input for the \`updateCPersonByRowId\` mutation."""
input UpdateCPersonByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The primary unique identifier for the person"""
  rowId: Int!

  """
  An object where the defined keys will be set on the \`CPerson\` being updated.
  """
  cPersonPatch: CPersonPatch!
}

"""
Represents an update to a \`CPerson\`. Fields that are set will be updated.
"""
input CPersonPatch {
  """The primary unique identifier for the person"""
  rowId: Int

  """The person’s name"""
  name: String
  aliases: [String]
  about: String
  email: BEmail
  site: BWrappedUrlInput
  config: KeyValueHash
  lastLoginFromIp: InternetAddress
  lastLoginFromSubnet: CidrAddress
  userMac: MacAddress
  createdAt: Datetime
}

"""All input for the \`updateCPersonByEmail\` mutation."""
input UpdateCPersonByEmailInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  email: BEmail!

  """
  An object where the defined keys will be set on the \`CPerson\` being updated.
  """
  cPersonPatch: CPersonPatch!
}

"""The output of our update \`BList\` mutation."""
type UpdateBListPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`BList\` that was updated by this mutation."""
  bList: BList

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`BList\`. May be used by Relay 1."""
  bListEdge(
    """The method to use when ordering \`BList\`."""
    orderBy: [BListOrderBy!]! = [PRIMARY_KEY_ASC]
  ): BListEdge
}

"""All input for the \`updateBListByRowId\` mutation."""
input UpdateBListByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: Int!

  """
  An object where the defined keys will be set on the \`BList\` being updated.
  """
  bListPatch: BListPatch!
}

"""
Represents an update to a \`BList\`. Fields that are set will be updated.
"""
input BListPatch {
  rowId: Int
  intArray: [Int]
  intArrayNn: [Int]
  enumArray: [BColor]
  enumArrayNn: [BColor]
  dateArray: [Date]
  dateArrayNn: [Date]
  timestamptzArray: [Datetime]
  timestamptzArrayNn: [Datetime]
  compoundTypeArray: [CCompoundTypeInput]
  compoundTypeArrayNn: [CCompoundTypeInput]
  byteaArray: [Base64EncodedBinary]
  byteaArrayNn: [Base64EncodedBinary]
}

"""The output of our update \`BType\` mutation."""
type UpdateBTypePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`BType\` that was updated by this mutation."""
  bType: BType

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`BType\`. May be used by Relay 1."""
  bTypeEdge(
    """The method to use when ordering \`BType\`."""
    orderBy: [BTypeOrderBy!]! = [PRIMARY_KEY_ASC]
  ): BTypeEdge
}

"""All input for the \`updateBTypeByRowId\` mutation."""
input UpdateBTypeByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: Int!

  """
  An object where the defined keys will be set on the \`BType\` being updated.
  """
  bTypePatch: BTypePatch!
}

"""
Represents an update to a \`BType\`. Fields that are set will be updated.
"""
input BTypePatch {
  rowId: Int
  smallint: Int
  bigint: BigInt
  numeric: BigFloat
  decimal: BigFloat
  boolean: Boolean
  varchar: String
  enum: BColor
  enumArray: [BColor]
  domain: AnInt
  domain2: BAnotherInt
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
  compoundType: CCompoundTypeInput
  nestedCompoundType: BNestedCompoundTypeInput
  nullableCompoundType: CCompoundTypeInput
  nullableNestedCompoundType: BNestedCompoundTypeInput
  point: PointInput
  nullablePoint: PointInput
  inet: InternetAddress
  cidr: CidrAddress
  macaddr: MacAddress
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

"""The output of our delete \`Input\` mutation."""
type DeleteInputPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Input\` that was deleted by this mutation."""
  input: Input

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Input\`. May be used by Relay 1."""
  inputEdge(
    """The method to use when ordering \`Input\`."""
    orderBy: [InputOrderBy!]! = [PRIMARY_KEY_ASC]
  ): InputEdge
}

"""All input for the \`deleteInputByRowId\` mutation."""
input DeleteInputByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: Int!
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

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Patch\`. May be used by Relay 1."""
  patchEdge(
    """The method to use when ordering \`Patch\`."""
    orderBy: [PatchOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PatchEdge
}

"""All input for the \`deletePatchByRowId\` mutation."""
input DeletePatchByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: Int!
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

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Reserved\`. May be used by Relay 1."""
  reservedEdge(
    """The method to use when ordering \`Reserved\`."""
    orderBy: [ReservedOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ReservedEdge
}

"""All input for the \`deleteReservedByRowId\` mutation."""
input DeleteReservedByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: Int!
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

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`ReservedPatchRecord\`. May be used by Relay 1."""
  reservedPatchRecordEdge(
    """The method to use when ordering \`ReservedPatchRecord\`."""
    orderBy: [ReservedPatchRecordOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ReservedPatchRecordEdge
}

"""All input for the \`deleteReservedPatchRecordByRowId\` mutation."""
input DeleteReservedPatchRecordByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: Int!
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

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`ReservedInputRecord\`. May be used by Relay 1."""
  reservedInputRecordEdge(
    """The method to use when ordering \`ReservedInputRecord\`."""
    orderBy: [ReservedInputRecordOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ReservedInputRecordEdge
}

"""All input for the \`deleteReservedInputRecordByRowId\` mutation."""
input DeleteReservedInputRecordByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: Int!
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

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`DefaultValue\`. May be used by Relay 1."""
  defaultValueEdge(
    """The method to use when ordering \`DefaultValue\`."""
    orderBy: [DefaultValueOrderBy!]! = [PRIMARY_KEY_ASC]
  ): DefaultValueEdge
}

"""All input for the \`deleteDefaultValueByRowId\` mutation."""
input DeleteDefaultValueByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: Int!
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

"""All input for the \`deleteNoPrimaryKeyByRowId\` mutation."""
input DeleteNoPrimaryKeyByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: Int!
}

"""The output of our delete \`UniqueForeignKey\` mutation."""
type DeleteUniqueForeignKeyPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`UniqueForeignKey\` that was deleted by this mutation."""
  uniqueForeignKey: UniqueForeignKey

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""
All input for the \`deleteUniqueForeignKeyByCompoundKey1AndCompoundKey2\` mutation.
"""
input DeleteUniqueForeignKeyByCompoundKey1AndCompoundKey2Input {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  compoundKey1: Int!
  compoundKey2: Int!
}

"""The output of our delete \`CMyTable\` mutation."""
type DeleteCMyTablePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`CMyTable\` that was deleted by this mutation."""
  cMyTable: CMyTable

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`CMyTable\`. May be used by Relay 1."""
  cMyTableEdge(
    """The method to use when ordering \`CMyTable\`."""
    orderBy: [CMyTableOrderBy!]! = [PRIMARY_KEY_ASC]
  ): CMyTableEdge
}

"""All input for the \`deleteCMyTableByRowId\` mutation."""
input DeleteCMyTableByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: Int!
}

"""The output of our delete \`CPersonSecret\` mutation."""
type DeleteCPersonSecretPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`CPersonSecret\` that was deleted by this mutation."""
  cPersonSecret: CPersonSecret

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`CPersonSecret\`. May be used by Relay 1."""
  cPersonSecretEdge(
    """The method to use when ordering \`CPersonSecret\`."""
    orderBy: [CPersonSecretOrderBy!]! = [PRIMARY_KEY_ASC]
  ): CPersonSecretEdge @deprecated(reason: "This is deprecated (comment on table c.person_secret).")
}

"""All input for the \`deleteCPersonSecretByPersonId\` mutation."""
input DeleteCPersonSecretByPersonIdInput {
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

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`ViewTable\`. May be used by Relay 1."""
  viewTableEdge(
    """The method to use when ordering \`ViewTable\`."""
    orderBy: [ViewTableOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ViewTableEdge
}

"""All input for the \`deleteViewTableByRowId\` mutation."""
input DeleteViewTableByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: Int!
}

"""The output of our delete \`CCompoundKey\` mutation."""
type DeleteCCompoundKeyPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`CCompoundKey\` that was deleted by this mutation."""
  cCompoundKey: CCompoundKey

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`CCompoundKey\`. May be used by Relay 1."""
  cCompoundKeyEdge(
    """The method to use when ordering \`CCompoundKey\`."""
    orderBy: [CCompoundKeyOrderBy!]! = [PRIMARY_KEY_ASC]
  ): CCompoundKeyEdge
}

"""
All input for the \`deleteCCompoundKeyByPersonId1AndPersonId2\` mutation.
"""
input DeleteCCompoundKeyByPersonId1AndPersonId2Input {
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

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`SimilarTable1\`. May be used by Relay 1."""
  similarTable1Edge(
    """The method to use when ordering \`SimilarTable1\`."""
    orderBy: [SimilarTable1OrderBy!]! = [PRIMARY_KEY_ASC]
  ): SimilarTable1Edge
}

"""All input for the \`deleteSimilarTable1ByRowId\` mutation."""
input DeleteSimilarTable1ByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: Int!
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

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`SimilarTable2\`. May be used by Relay 1."""
  similarTable2Edge(
    """The method to use when ordering \`SimilarTable2\`."""
    orderBy: [SimilarTable2OrderBy!]! = [PRIMARY_KEY_ASC]
  ): SimilarTable2Edge
}

"""All input for the \`deleteSimilarTable2ByRowId\` mutation."""
input DeleteSimilarTable2ByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: Int!
}

"""The output of our delete \`CNullTestRecord\` mutation."""
type DeleteCNullTestRecordPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`CNullTestRecord\` that was deleted by this mutation."""
  cNullTestRecord: CNullTestRecord

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`CNullTestRecord\`. May be used by Relay 1."""
  cNullTestRecordEdge(
    """The method to use when ordering \`CNullTestRecord\`."""
    orderBy: [CNullTestRecordOrderBy!]! = [PRIMARY_KEY_ASC]
  ): CNullTestRecordEdge
}

"""All input for the \`deleteCNullTestRecordByRowId\` mutation."""
input DeleteCNullTestRecordByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: Int!
}

"""The output of our delete \`CLeftArm\` mutation."""
type DeleteCLeftArmPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`CLeftArm\` that was deleted by this mutation."""
  cLeftArm: CLeftArm

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`CLeftArm\`. May be used by Relay 1."""
  cLeftArmEdge(
    """The method to use when ordering \`CLeftArm\`."""
    orderBy: [CLeftArmOrderBy!]! = [PRIMARY_KEY_ASC]
  ): CLeftArmEdge
}

"""All input for the \`deleteCLeftArmByRowId\` mutation."""
input DeleteCLeftArmByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: Int!
}

"""All input for the \`deleteCLeftArmByPersonId\` mutation."""
input DeleteCLeftArmByPersonIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  personId: Int!
}

"""The output of our delete \`CIssue756\` mutation."""
type DeleteCIssue756Payload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`CIssue756\` that was deleted by this mutation."""
  cIssue756: CIssue756

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`CIssue756\`. May be used by Relay 1."""
  cIssue756Edge(
    """The method to use when ordering \`CIssue756\`."""
    orderBy: [CIssue756OrderBy!]! = [PRIMARY_KEY_ASC]
  ): CIssue756Edge
}

"""All input for the \`deleteCIssue756ByRowId\` mutation."""
input DeleteCIssue756ByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: Int!
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

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Post\`. May be used by Relay 1."""
  postEdge(
    """The method to use when ordering \`Post\`."""
    orderBy: [PostOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PostEdge
}

"""All input for the \`deletePostByRowId\` mutation."""
input DeletePostByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: Int!
}

"""The output of our delete \`CPerson\` mutation."""
type DeleteCPersonPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`CPerson\` that was deleted by this mutation."""
  cPerson: CPerson

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`CPerson\`. May be used by Relay 1."""
  cPersonEdge(
    """The method to use when ordering \`CPerson\`."""
    orderBy: [CPersonOrderBy!]! = [PRIMARY_KEY_ASC]
  ): CPersonEdge
}

"""All input for the \`deleteCPersonByRowId\` mutation."""
input DeleteCPersonByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The primary unique identifier for the person"""
  rowId: Int!
}

"""All input for the \`deleteCPersonByEmail\` mutation."""
input DeleteCPersonByEmailInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  email: BEmail!
}

"""The output of our delete \`BList\` mutation."""
type DeleteBListPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`BList\` that was deleted by this mutation."""
  bList: BList

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`BList\`. May be used by Relay 1."""
  bListEdge(
    """The method to use when ordering \`BList\`."""
    orderBy: [BListOrderBy!]! = [PRIMARY_KEY_ASC]
  ): BListEdge
}

"""All input for the \`deleteBListByRowId\` mutation."""
input DeleteBListByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: Int!
}

"""The output of our delete \`BType\` mutation."""
type DeleteBTypePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`BType\` that was deleted by this mutation."""
  bType: BType

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`BType\`. May be used by Relay 1."""
  bTypeEdge(
    """The method to use when ordering \`BType\`."""
    orderBy: [BTypeOrderBy!]! = [PRIMARY_KEY_ASC]
  ): BTypeEdge
}

"""All input for the \`deleteBTypeByRowId\` mutation."""
input DeleteBTypeByRowIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: Int!
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
      allBLists: {
        plan() {
          return connection(resource_b_listsPgResource.find());
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
      allBTypes: {
        plan() {
          return connection(resource_b_typesPgResource.find());
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
      allBUpdatableViews: {
        plan() {
          return connection(resource_b_updatable_viewPgResource.find());
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
      allCCompoundKeys: {
        plan() {
          return connection(resource_c_compound_keyPgResource.find());
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
      allCEdgeCases: {
        plan() {
          return connection(resource_c_edge_casePgResource.find());
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
      allCIssue756S: {
        plan() {
          return connection(resource_c_issue756PgResource.find());
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
      allCLeftArms: {
        plan() {
          return connection(resource_c_left_armPgResource.find());
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
      allCMyTables: {
        plan() {
          return connection(resource_c_my_tablePgResource.find());
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
      allCNullTestRecords: {
        plan() {
          return connection(resource_c_null_test_recordPgResource.find());
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
      allCPeople: {
        plan() {
          return connection(resource_c_personPgResource.find());
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
      allCPersonSecrets: {
        plan() {
          return connection(resource_c_person_secretPgResource.find());
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
      allUniqueForeignKeys: {
        plan() {
          return connection(resource_unique_foreign_keyPgResource.find());
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
      bCompoundTypeArrayQuery($root, args, _info) {
        const selectArgs = makeArgs_b_compound_type_array_query(args);
        return resource_b_compound_type_array_queryPgResource.execute(selectArgs);
      },
      bCompoundTypeQuery($root, args, _info) {
        const selectArgs = makeArgs_b_compound_type_query(args);
        return resource_b_compound_type_queryPgResource.execute(selectArgs);
      },
      bListByRowId(_$root, {
        $rowId
      }) {
        return resource_b_listsPgResource.get({
          id: $rowId
        });
      },
      bTypeByRowId(_$root, {
        $rowId
      }) {
        return resource_b_typesPgResource.get({
          id: $rowId
        });
      },
      bTypeFunction($root, args, _info) {
        const selectArgs = makeArgs_b_type_function(args);
        return resource_b_type_functionPgResource.execute(selectArgs);
      },
      bTypeFunctionConnection: {
        plan($parent, args, info) {
          const $select = b_type_function_connection_getSelectPlanFromParentAndArgs($parent, args, info);
          return connection($select);
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg,
          after: applyAfterArg
        }
      },
      bTypeFunctionList($root, args, _info) {
        const selectArgs = makeArgs_c_person_computed_out(args);
        return resource_b_type_function_listPgResource.execute(selectArgs);
      },
      cBadlyBehavedFunction: {
        plan($parent, args, info) {
          const $select = c_badly_behaved_function_getSelectPlanFromParentAndArgs($parent, args, info);
          return connection($select);
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg,
          after: applyAfterArg
        }
      },
      cCompoundKeyByPersonId1AndPersonId2(_$root, {
        $personId1,
        $personId2
      }) {
        return resource_c_compound_keyPgResource.get({
          person_id_1: $personId1,
          person_id_2: $personId2
        });
      },
      cCompoundTypeComputedField($root, args, _info) {
        const selectArgs = makeArgs_c_compound_type_computed_field(args);
        return resource_c_compound_type_computed_fieldPgResource.execute(selectArgs);
      },
      cCompoundTypeSetQuery: {
        plan($parent, args, info) {
          const $select = c_compound_type_set_query_getSelectPlanFromParentAndArgs($parent, args, info);
          return connection($select);
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg,
          after: applyAfterArg
        }
      },
      cCurrentUserId($root, args, _info) {
        const selectArgs = makeArgs_c_person_computed_out(args);
        return resource_c_current_user_idPgResource.execute(selectArgs);
      },
      cFuncInInout($root, args, _info) {
        const selectArgs = makeArgs_c_func_in_inout(args);
        return resource_c_func_in_inoutPgResource.execute(selectArgs);
      },
      cFuncInOut($root, args, _info) {
        const selectArgs = makeArgs_c_func_in_out(args);
        return resource_c_func_in_outPgResource.execute(selectArgs);
      },
      cFuncOut($root, args, _info) {
        const selectArgs = makeArgs_c_person_computed_out(args);
        return resource_c_func_outPgResource.execute(selectArgs);
      },
      cFuncOutComplex($root, args, _info) {
        const selectArgs = makeArgs_c_func_out_complex(args);
        return resource_c_func_out_complexPgResource.execute(selectArgs);
      },
      cFuncOutComplexSetof: {
        plan($parent, args, info) {
          const $select = c_func_out_complex_setof_getSelectPlanFromParentAndArgs($parent, args, info);
          return connection($select);
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg,
          after: applyAfterArg
        }
      },
      cFuncOutOut($root, args, _info) {
        const selectArgs = makeArgs_c_person_computed_out(args);
        return resource_c_func_out_outPgResource.execute(selectArgs);
      },
      cFuncOutOutCompoundType($root, args, _info) {
        const selectArgs = makeArgs_c_func_out_out_compound_type(args);
        return resource_c_func_out_out_compound_typePgResource.execute(selectArgs);
      },
      cFuncOutOutSetof: {
        plan($parent, args, info) {
          const $select = c_func_out_out_setof_getSelectPlanFromParentAndArgs($parent, args, info);
          return connection($select);
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg,
          after: applyAfterArg
        }
      },
      cFuncOutOutUnnamed($root, args, _info) {
        const selectArgs = makeArgs_c_person_computed_out(args);
        return resource_c_func_out_out_unnamedPgResource.execute(selectArgs);
      },
      cFuncOutSetof: {
        plan($parent, args, info) {
          const $select = c_func_out_setof_getSelectPlanFromParentAndArgs($parent, args, info);
          return connection($select);
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg,
          after: applyAfterArg
        }
      },
      cFuncOutTable($root, args, _info) {
        const selectArgs = makeArgs_c_person_computed_out(args);
        return resource_c_func_out_tablePgResource.execute(selectArgs);
      },
      cFuncOutTableSetof: {
        plan($parent, args, info) {
          const $select = c_func_out_table_setof_getSelectPlanFromParentAndArgs($parent, args, info);
          return connection($select);
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg,
          after: applyAfterArg
        }
      },
      cFuncOutUnnamed($root, args, _info) {
        const selectArgs = makeArgs_c_person_computed_out(args);
        return resource_c_func_out_unnamedPgResource.execute(selectArgs);
      },
      cFuncOutUnnamedOutOutUnnamed($root, args, _info) {
        const selectArgs = makeArgs_c_person_computed_out(args);
        return resource_c_func_out_unnamed_out_out_unnamedPgResource.execute(selectArgs);
      },
      cFuncReturnsTableMultiCol: {
        plan($parent, args, info) {
          const $select = c_func_returns_table_multi_col_getSelectPlanFromParentAndArgs($parent, args, info);
          return connection($select);
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg,
          after: applyAfterArg
        }
      },
      cFuncReturnsTableOneCol: {
        plan($parent, args, info) {
          const $select = c_func_returns_table_one_col_getSelectPlanFromParentAndArgs($parent, args, info);
          return connection($select);
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg,
          after: applyAfterArg
        }
      },
      cIntSetQuery: {
        plan($parent, args, info) {
          const $select = c_int_set_query_getSelectPlanFromParentAndArgs($parent, args, info);
          return connection($select);
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg,
          after: applyAfterArg
        }
      },
      cIssue756ByRowId(_$root, {
        $rowId
      }) {
        return resource_c_issue756PgResource.get({
          id: $rowId
        });
      },
      cJsonbIdentity($root, args, _info) {
        const selectArgs = makeArgs_c_jsonb_identity(args);
        return resource_c_jsonb_identityPgResource.execute(selectArgs);
      },
      cJsonIdentity($root, args, _info) {
        const selectArgs = makeArgs_c_json_identity(args);
        return resource_c_json_identityPgResource.execute(selectArgs);
      },
      cLeftArmByPersonId(_$root, {
        $personId
      }) {
        return resource_c_left_armPgResource.get({
          person_id: $personId
        });
      },
      cLeftArmByRowId(_$root, {
        $rowId
      }) {
        return resource_c_left_armPgResource.get({
          id: $rowId
        });
      },
      cMyTableByRowId(_$root, {
        $rowId
      }) {
        return resource_c_my_tablePgResource.get({
          id: $rowId
        });
      },
      cNoArgsQuery($root, args, _info) {
        const selectArgs = makeArgs_c_person_computed_out(args);
        return resource_c_no_args_queryPgResource.execute(selectArgs);
      },
      cNullTestRecordByRowId(_$root, {
        $rowId
      }) {
        return resource_c_null_test_recordPgResource.get({
          id: $rowId
        });
      },
      cPersonByEmail(_$root, {
        $email
      }) {
        return resource_c_personPgResource.get({
          email: $email
        });
      },
      cPersonByRowId(_$root, {
        $rowId
      }) {
        return resource_c_personPgResource.get({
          id: $rowId
        });
      },
      cPersonSecretByPersonId(_$root, {
        $personId
      }) {
        return resource_c_person_secretPgResource.get({
          person_id: $personId
        });
      },
      cQueryOutputTwoRows($root, args, _info) {
        const selectArgs = makeArgs_c_query_output_two_rows(args);
        return resource_c_query_output_two_rowsPgResource.execute(selectArgs);
      },
      cReturnTableWithoutGrants($root, args, _info) {
        const selectArgs = makeArgs_c_person_computed_out(args);
        return resource_c_return_table_without_grantsPgResource.execute(selectArgs);
      },
      cSearchTestSummaries: {
        plan($parent, args, info) {
          const $select = c_search_test_summaries_getSelectPlanFromParentAndArgs($parent, args, info);
          return connection($select);
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg,
          after: applyAfterArg
        }
      },
      cTableQuery($root, args, _info) {
        const selectArgs = makeArgs_c_table_query(args);
        return resource_c_table_queryPgResource.execute(selectArgs);
      },
      cTableSetQuery: {
        plan($parent, args, info) {
          const $select = c_table_set_query_getSelectPlanFromParentAndArgs($parent, args, info);
          return connection($select);
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg,
          after: applyAfterArg
        }
      },
      cTableSetQueryPlpgsql: {
        plan($parent, args, info) {
          const $select = c_table_set_query_plpgsql_getSelectPlanFromParentAndArgs($parent, args, info);
          return connection($select);
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg,
          after: applyAfterArg
        }
      },
      cTypesQuery($root, args, _info) {
        const selectArgs = makeArgs_c_types_query(args);
        return resource_c_types_queryPgResource.execute(selectArgs);
      },
      defaultValueByRowId(_$root, {
        $rowId
      }) {
        return resource_default_valuePgResource.get({
          id: $rowId
        });
      },
      inputByRowId(_$root, {
        $rowId
      }) {
        return resource_inputsPgResource.get({
          id: $rowId
        });
      },
      noPrimaryKeyByRowId(_$root, {
        $rowId
      }) {
        return resource_no_primary_keyPgResource.get({
          id: $rowId
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
      patchByRowId(_$root, {
        $rowId
      }) {
        return resource_patchsPgResource.get({
          id: $rowId
        });
      },
      postByRowId(_$root, {
        $rowId
      }) {
        return resource_postPgResource.get({
          id: $rowId
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
        const selectArgs = makeArgs_c_person_computed_out(args);
        return resource_query_interval_arrayPgResource.execute(selectArgs);
      },
      queryIntervalSet: {
        plan($parent, args, info) {
          const $select = query_interval_set_getSelectPlanFromParentAndArgs($parent, args, info);
          return connection($select);
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg,
          after: applyAfterArg
        }
      },
      queryTextArray($root, args, _info) {
        const selectArgs = makeArgs_c_person_computed_out(args);
        return resource_query_text_arrayPgResource.execute(selectArgs);
      },
      reservedByRowId(_$root, {
        $rowId
      }) {
        return resource_reservedPgResource.get({
          id: $rowId
        });
      },
      reservedInputRecordByRowId(_$root, {
        $rowId
      }) {
        return resource_reserved_inputPgResource.get({
          id: $rowId
        });
      },
      reservedPatchRecordByRowId(_$root, {
        $rowId
      }) {
        return resource_reservedPatchsPgResource.get({
          id: $rowId
        });
      },
      similarTable1ByRowId(_$root, {
        $rowId
      }) {
        return resource_similar_table_1PgResource.get({
          id: $rowId
        });
      },
      similarTable2ByRowId(_$root, {
        $rowId
      }) {
        return resource_similar_table_2PgResource.get({
          id: $rowId
        });
      },
      staticBigInteger: {
        plan($parent, args, info) {
          const $select = static_big_integer_getSelectPlanFromParentAndArgs($parent, args, info);
          return connection($select);
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg,
          after: applyAfterArg
        }
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
      viewTableByRowId(_$root, {
        $rowId
      }) {
        return resource_view_tablePgResource.get({
          id: $rowId
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
      bAuthenticate: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_b_authenticate(args, ["input"]);
          const $result = resource_b_authenticatePgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      bAuthenticateFail: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_c_person_computed_out(args, ["input"]);
          const $result = resource_b_authenticate_failPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      bAuthenticateMany: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_b_authenticate_many(args, ["input"]);
          const $result = resource_b_authenticate_manyPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      bAuthenticatePayload: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_b_authenticate_payload(args, ["input"]);
          const $result = resource_b_authenticate_payloadPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      bCompoundTypeArrayMutation: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_b_compound_type_array_mutation(args, ["input"]);
          const $result = resource_b_compound_type_array_mutationPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      bCompoundTypeMutation: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_b_compound_type_mutation(args, ["input"]);
          const $result = resource_b_compound_type_mutationPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      bCompoundTypeSetMutation: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_b_compound_type_set_mutation(args, ["input"]);
          const $result = resource_b_compound_type_set_mutationPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      bGuidFn: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_b_guid_fn(args, ["input"]);
          const $result = resource_b_guid_fnPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      bListBdeMutation: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_b_list_bde_mutation(args, ["input"]);
          const $result = resource_b_list_bde_mutationPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      bMult1: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_b_mult_1(args, ["input"]);
          const $result = resource_b_mult_1PgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      bMult2: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_b_mult_2(args, ["input"]);
          const $result = resource_b_mult_2PgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      bMult3: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_b_mult_3(args, ["input"]);
          const $result = resource_b_mult_3PgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      bMult4: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_b_mult_4(args, ["input"]);
          const $result = resource_b_mult_4PgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      bTypeFunctionConnectionMutation: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_c_person_computed_out(args, ["input"]);
          const $result = resource_b_type_function_connection_mutationPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      bTypeFunctionListMutation: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_c_person_computed_out(args, ["input"]);
          const $result = resource_b_type_function_list_mutationPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      bTypeFunctionMutation: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_b_type_function_mutation(args, ["input"]);
          const $result = resource_b_type_function_mutationPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      cIntSetMutation: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_c_int_set_mutation(args, ["input"]);
          const $result = resource_c_int_set_mutationPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      cIssue756Mutation: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_c_person_computed_out(args, ["input"]);
          const $result = resource_c_issue756_mutationPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      cIssue756SetMutation: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_c_person_computed_out(args, ["input"]);
          const $result = resource_c_issue756_set_mutationPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      cJsonbIdentityMutation: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_c_jsonb_identity_mutation(args, ["input"]);
          const $result = resource_c_jsonb_identity_mutationPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      cJsonbIdentityMutationPlpgsql: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_c_jsonb_identity_mutation_plpgsql(args, ["input"]);
          const $result = resource_c_jsonb_identity_mutation_plpgsqlPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      cJsonbIdentityMutationPlpgsqlWithDefault: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_c_jsonb_identity_mutation_plpgsql_with_default(args, ["input"]);
          const $result = resource_c_jsonb_identity_mutation_plpgsql_with_defaultPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      cJsonIdentityMutation: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_c_json_identity_mutation(args, ["input"]);
          const $result = resource_c_json_identity_mutationPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      cLeftArmIdentity: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_c_left_arm_identity(args, ["input"]);
          const $result = resource_c_left_arm_identityPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      cListOfCompoundTypesMutation: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_c_list_of_compound_types_mutation(args, ["input"]);
          const $result = resource_c_list_of_compound_types_mutationPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      cMutationInInout: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_c_mutation_in_inout(args, ["input"]);
          const $result = resource_c_mutation_in_inoutPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      cMutationInOut: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_c_mutation_in_out(args, ["input"]);
          const $result = resource_c_mutation_in_outPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      cMutationOut: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_c_person_computed_out(args, ["input"]);
          const $result = resource_c_mutation_outPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      cMutationOutComplex: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_c_mutation_out_complex(args, ["input"]);
          const $result = resource_c_mutation_out_complexPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      cMutationOutComplexSetof: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_c_mutation_out_complex_setof(args, ["input"]);
          const $result = resource_c_mutation_out_complex_setofPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      cMutationOutOut: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_c_person_computed_out(args, ["input"]);
          const $result = resource_c_mutation_out_outPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      cMutationOutOutCompoundType: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_c_mutation_out_out_compound_type(args, ["input"]);
          const $result = resource_c_mutation_out_out_compound_typePgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      cMutationOutOutSetof: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_c_person_computed_out(args, ["input"]);
          const $result = resource_c_mutation_out_out_setofPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      cMutationOutOutUnnamed: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_c_person_computed_out(args, ["input"]);
          const $result = resource_c_mutation_out_out_unnamedPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      cMutationOutSetof: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_c_person_computed_out(args, ["input"]);
          const $result = resource_c_mutation_out_setofPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      cMutationOutTable: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_c_person_computed_out(args, ["input"]);
          const $result = resource_c_mutation_out_tablePgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      cMutationOutTableSetof: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_c_person_computed_out(args, ["input"]);
          const $result = resource_c_mutation_out_table_setofPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      cMutationOutUnnamed: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_c_person_computed_out(args, ["input"]);
          const $result = resource_c_mutation_out_unnamedPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      cMutationOutUnnamedOutOutUnnamed: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_c_person_computed_out(args, ["input"]);
          const $result = resource_c_mutation_out_unnamed_out_out_unnamedPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      cMutationReturnsTableMultiCol: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_c_mutation_returns_table_multi_col(args, ["input"]);
          const $result = resource_c_mutation_returns_table_multi_colPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      cMutationReturnsTableOneCol: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_c_mutation_returns_table_one_col(args, ["input"]);
          const $result = resource_c_mutation_returns_table_one_colPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      cNoArgsMutation: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_c_person_computed_out(args, ["input"]);
          const $result = resource_c_no_args_mutationPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      createBList: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_b_listsPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createBType: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_b_typesPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createBUpdatableView: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_b_updatable_viewPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createCCompoundKey: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_c_compound_keyPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createCEdgeCase: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_c_edge_casePgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createCIssue756: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_c_issue756PgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createCLeftArm: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_c_left_armPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createCMyTable: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_c_my_tablePgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createCNullTestRecord: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_c_null_test_recordPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createCPerson: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_c_personPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createCPersonSecret: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_c_person_secretPgResource);
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
      createUniqueForeignKey: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_unique_foreign_keyPgResource);
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
      cTableMutation: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_c_table_mutation(args, ["input"]);
          const $result = resource_c_table_mutationPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      cTableSetMutation: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_c_person_computed_out(args, ["input"]);
          const $result = resource_c_table_set_mutationPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      cTypesMutation: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_c_types_mutation(args, ["input"]);
          const $result = resource_c_types_mutationPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      deleteBListByRowId: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_b_listsPgResource, {
            id: args.getRaw(['input', "rowId"])
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
      deleteBTypeByRowId: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_b_typesPgResource, {
            id: args.getRaw(['input', "rowId"])
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
      deleteCCompoundKeyByPersonId1AndPersonId2: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_c_compound_keyPgResource, {
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
      deleteCIssue756ByRowId: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_c_issue756PgResource, {
            id: args.getRaw(['input', "rowId"])
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
      deleteCLeftArmByPersonId: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_c_left_armPgResource, {
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
      deleteCLeftArmByRowId: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_c_left_armPgResource, {
            id: args.getRaw(['input', "rowId"])
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
      deleteCMyTableByRowId: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_c_my_tablePgResource, {
            id: args.getRaw(['input', "rowId"])
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
      deleteCNullTestRecordByRowId: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_c_null_test_recordPgResource, {
            id: args.getRaw(['input', "rowId"])
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
      deleteCPersonByEmail: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_c_personPgResource, {
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
      deleteCPersonByRowId: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_c_personPgResource, {
            id: args.getRaw(['input', "rowId"])
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
      deleteCPersonSecretByPersonId: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_c_person_secretPgResource, {
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
      deleteDefaultValueByRowId: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_default_valuePgResource, {
            id: args.getRaw(['input', "rowId"])
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
      deleteInputByRowId: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_inputsPgResource, {
            id: args.getRaw(['input', "rowId"])
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
      deleteNoPrimaryKeyByRowId: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_no_primary_keyPgResource, {
            id: args.getRaw(['input', "rowId"])
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
      deletePatchByRowId: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_patchsPgResource, {
            id: args.getRaw(['input', "rowId"])
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
      deletePostByRowId: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_postPgResource, {
            id: args.getRaw(['input', "rowId"])
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
      deleteReservedByRowId: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_reservedPgResource, {
            id: args.getRaw(['input', "rowId"])
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
      deleteReservedInputRecordByRowId: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_reserved_inputPgResource, {
            id: args.getRaw(['input', "rowId"])
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
      deleteReservedPatchRecordByRowId: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_reservedPatchsPgResource, {
            id: args.getRaw(['input', "rowId"])
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
      deleteSimilarTable1ByRowId: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_similar_table_1PgResource, {
            id: args.getRaw(['input', "rowId"])
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
      deleteSimilarTable2ByRowId: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_similar_table_2PgResource, {
            id: args.getRaw(['input', "rowId"])
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
      deleteUniqueForeignKeyByCompoundKey1AndCompoundKey2: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_unique_foreign_keyPgResource, {
            compound_key_1: args.getRaw(['input', "compoundKey1"]),
            compound_key_2: args.getRaw(['input', "compoundKey2"])
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
      deleteViewTableByRowId: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_view_tablePgResource, {
            id: args.getRaw(['input', "rowId"])
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
      mutationIntervalArray: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_c_person_computed_out(args, ["input"]);
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
          const selectArgs = makeArgs_c_person_computed_out(args, ["input"]);
          const $result = resource_mutation_interval_setPgResource.execute(selectArgs, "mutation");
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
          const selectArgs = makeArgs_c_person_computed_out(args, ["input"]);
          const $result = resource_mutation_text_arrayPgResource.execute(selectArgs, "mutation");
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
          const selectArgs = makeArgs_c_person_computed_out(args, ["input"]);
          const $result = resource_return_void_mutationPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input: applyInputArgViaPgSelect
        }
      },
      updateBListByRowId: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_b_listsPgResource, {
            id: args.getRaw(['input', "rowId"])
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
      updateBTypeByRowId: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_b_typesPgResource, {
            id: args.getRaw(['input', "rowId"])
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
      updateCCompoundKeyByPersonId1AndPersonId2: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_c_compound_keyPgResource, {
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
      updateCIssue756ByRowId: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_c_issue756PgResource, {
            id: args.getRaw(['input', "rowId"])
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
      updateCLeftArmByPersonId: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_c_left_armPgResource, {
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
      updateCLeftArmByRowId: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_c_left_armPgResource, {
            id: args.getRaw(['input', "rowId"])
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
      updateCMyTableByRowId: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_c_my_tablePgResource, {
            id: args.getRaw(['input', "rowId"])
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
      updateCNullTestRecordByRowId: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_c_null_test_recordPgResource, {
            id: args.getRaw(['input', "rowId"])
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
      updateCPersonByEmail: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_c_personPgResource, {
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
      updateCPersonByRowId: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_c_personPgResource, {
            id: args.getRaw(['input', "rowId"])
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
      updateCPersonSecretByPersonId: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_c_person_secretPgResource, {
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
      updateDefaultValueByRowId: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_default_valuePgResource, {
            id: args.getRaw(['input', "rowId"])
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
      updateInputByRowId: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_inputsPgResource, {
            id: args.getRaw(['input', "rowId"])
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
      updateNoPrimaryKeyByRowId: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_no_primary_keyPgResource, {
            id: args.getRaw(['input', "rowId"])
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
      updatePatchByRowId: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_patchsPgResource, {
            id: args.getRaw(['input', "rowId"])
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
      updatePostByRowId: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_postPgResource, {
            id: args.getRaw(['input', "rowId"])
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
      updateReservedByRowId: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_reservedPgResource, {
            id: args.getRaw(['input', "rowId"])
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
      updateReservedInputRecordByRowId: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_reserved_inputPgResource, {
            id: args.getRaw(['input', "rowId"])
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
      updateReservedPatchRecordByRowId: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_reservedPatchsPgResource, {
            id: args.getRaw(['input', "rowId"])
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
      updateSimilarTable1ByRowId: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_similar_table_1PgResource, {
            id: args.getRaw(['input', "rowId"])
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
      updateSimilarTable2ByRowId: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_similar_table_2PgResource, {
            id: args.getRaw(['input', "rowId"])
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
      updateUniqueForeignKeyByCompoundKey1AndCompoundKey2: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_unique_foreign_keyPgResource, {
            compound_key_1: args.getRaw(['input', "compoundKey1"]),
            compound_key_2: args.getRaw(['input', "compoundKey2"])
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
      updateViewTableByRowId: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_view_tablePgResource, {
            id: args.getRaw(['input', "rowId"])
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
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  Add2MutationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  Add3MutationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  Add4MutationErrorPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  Add4MutationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  BAuthenticateFailPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  BAuthenticateManyPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  BAuthenticatePayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  BAuthenticatePayloadPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  BAuthPayload: {
    assertStep: assertPgClassSingleStep,
    plans: {
      cPersonByRowId($record) {
        return resource_c_personPgResource.get({
          id: $record.get("id")
        });
      },
      jwt($record) {
        const $plan = $record.get("jwt");
        const $select = pgSelectSingleFromRecord(resource_frmcdc_bJwtTokenPgResource, $plan);
        $select.getClassStep().setTrusted();
        return $select;
      },
      rowId($record) {
        return $record.get("id");
      }
    }
  },
  BCompoundTypeArrayMutationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  BCompoundTypeMutationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  BCompoundTypeSetMutationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  BGuidFnPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  BJwtToken: {
    assertStep: assertPgClassSingleStep
  },
  BList: {
    assertStep: assertPgClassSingleStep,
    plans: {
      byteaArray($record) {
        return $record.get("bytea_array");
      },
      byteaArrayNn($record) {
        return $record.get("bytea_array_nn");
      },
      compoundTypeArray($record) {
        const $val = $record.get("compound_type_array");
        const $select = pgSelectFromRecords(resource_frmcdc_cCompoundTypePgResource, $val);
        $select.setTrusted();
        return $select;
      },
      compoundTypeArrayNn($record) {
        const $val = $record.get("compound_type_array_nn");
        const $select = pgSelectFromRecords(resource_frmcdc_cCompoundTypePgResource, $val);
        $select.setTrusted();
        return $select;
      },
      dateArray($record) {
        return $record.get("date_array");
      },
      dateArrayNn($record) {
        return $record.get("date_array_nn");
      },
      enumArray($record) {
        return $record.get("enum_array");
      },
      enumArrayNn($record) {
        return $record.get("enum_array_nn");
      },
      intArray($record) {
        return $record.get("int_array");
      },
      intArrayNn($record) {
        return $record.get("int_array_nn");
      },
      rowId($record) {
        return $record.get("id");
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
      for (const pkCol of b_listsUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_b_listsPgResource.get(spec);
    }
  },
  BListBdeMutationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  BListConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  BMult1Payload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  BMult2Payload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  BMult3Payload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  BMult4Payload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  BNestedCompoundType: {
    assertStep: assertPgClassSingleStep,
    plans: {
      a($record) {
        const $plan = $record.get("a");
        const $select = pgSelectSingleFromRecord(resource_frmcdc_cCompoundTypePgResource, $plan);
        $select.getClassStep().setTrusted();
        return $select;
      },
      b($record) {
        const $plan = $record.get("b");
        const $select = pgSelectSingleFromRecord(resource_frmcdc_cCompoundTypePgResource, $plan);
        $select.getClassStep().setTrusted();
        return $select;
      },
      bazBuz($record) {
        return $record.get("baz_buz");
      }
    }
  },
  BType: {
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
        const $select = pgSelectSingleFromRecord(resource_frmcdc_cCompoundTypePgResource, $plan);
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
        const $select = pgSelectSingleFromRecord(resource_frmcdc_bNestedCompoundTypePgResource, $plan);
        $select.coalesceToEmptyObject();
        $select.getClassStep().setTrusted();
        return $select;
      },
      nullableCompoundType($record) {
        const $plan = $record.get("nullable_compound_type");
        const $select = pgSelectSingleFromRecord(resource_frmcdc_cCompoundTypePgResource, $plan);
        $select.getClassStep().setTrusted();
        return $select;
      },
      nullableNestedCompoundType($record) {
        const $plan = $record.get("nullable_nested_compound_type");
        const $select = pgSelectSingleFromRecord(resource_frmcdc_bNestedCompoundTypePgResource, $plan);
        $select.getClassStep().setTrusted();
        return $select;
      },
      nullableRange($record) {
        return $record.get("nullable_range");
      },
      postByRowId($record) {
        return resource_postPgResource.get({
          id: $record.get("id")
        });
      },
      postBySmallint($record) {
        return resource_postPgResource.get({
          id: $record.get("smallint")
        });
      },
      rowId($record) {
        return $record.get("id");
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
      for (const pkCol of b_typesUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_b_typesPgResource.get(spec);
    }
  },
  BTypeConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  BTypeFunctionConnectionMutationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  BTypeFunctionListMutationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  BTypeFunctionMutationPayload: {
    assertStep: ObjectStep,
    plans: {
      bTypeEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_b_typesPgResource, b_typesUniques[0].attributes, $mutation, fieldArgs);
      },
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  BUpdatableView: {
    assertStep: assertPgClassSingleStep
  },
  BUpdatableViewConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  BWrappedUrl: {
    assertStep: assertPgClassSingleStep
  },
  CCompoundKey: {
    assertStep: assertPgClassSingleStep,
    plans: {
      cPersonByPersonId1($record) {
        return resource_c_personPgResource.get({
          id: $record.get("person_id_1")
        });
      },
      cPersonByPersonId2($record) {
        return resource_c_personPgResource.get({
          id: $record.get("person_id_2")
        });
      },
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
      for (const pkCol of c_compound_keyUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_c_compound_keyPgResource.get(spec);
    }
  },
  CCompoundKeyConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  CCompoundType: {
    assertStep: assertPgClassSingleStep,
    plans: {
      arrayQuery($in, args, _info) {
        const details = pgFunctionArgumentsFromArgs($in, makeArgs_c_person_computed_out(args));
        return resource_b_compound_type_array_queryPgResource.execute(details.selectArgs);
      },
      computedField($in, args, _info) {
        return scalarComputed(resource_c_compound_type_computed_fieldPgResource, $in, makeArgs_c_person_computed_out(args));
      },
      fooBar($record) {
        return $record.get("foo_bar");
      },
      query($in, args, _info) {
        const details = pgFunctionArgumentsFromArgs($in, makeArgs_c_person_computed_out(args));
        return resource_b_compound_type_queryPgResource.execute(details.selectArgs);
      },
      queryCompoundTypeArray($in, args, _info) {
        const details = pgFunctionArgumentsFromArgs($in, makeArgs_c_person_computed_out(args));
        return resource_query_compound_type_arrayPgResource.execute(details.selectArgs);
      }
    }
  },
  CCompoundTypeConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  CEdgeCase: {
    assertStep: assertPgClassSingleStep,
    plans: {
      computed($in, args, _info) {
        return scalarComputed(resource_c_edge_case_computedPgResource, $in, makeArgs_c_person_computed_out(args));
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
  CEdgeCaseConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  CFuncOutComplexRecord: {
    assertStep: assertPgClassSingleStep,
    plans: {
      y($record) {
        const $plan = $record.get("y");
        const $select = pgSelectSingleFromRecord(resource_frmcdc_cCompoundTypePgResource, $plan);
        $select.getClassStep().setTrusted();
        return $select;
      },
      z($record) {
        const $plan = $record.get("z");
        const $select = pgSelectSingleFromRecord(resource_c_personPgResource, $plan);
        $select.getClassStep().setTrusted();
        return $select;
      }
    }
  },
  CFuncOutComplexSetofConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  CFuncOutComplexSetofRecord: {
    assertStep: assertPgClassSingleStep,
    plans: {
      y($record) {
        const $plan = $record.get("y");
        const $select = pgSelectSingleFromRecord(resource_frmcdc_cCompoundTypePgResource, $plan);
        $select.getClassStep().setTrusted();
        return $select;
      },
      z($record) {
        const $plan = $record.get("z");
        const $select = pgSelectSingleFromRecord(resource_c_personPgResource, $plan);
        $select.getClassStep().setTrusted();
        return $select;
      }
    }
  },
  CFuncOutOutCompoundTypeRecord: {
    assertStep: assertPgClassSingleStep,
    plans: {
      o2($record) {
        const $plan = $record.get("o2");
        const $select = pgSelectSingleFromRecord(resource_frmcdc_cCompoundTypePgResource, $plan);
        $select.getClassStep().setTrusted();
        return $select;
      }
    }
  },
  CFuncOutOutRecord: {
    assertStep: assertPgClassSingleStep,
    plans: {
      firstOut($record) {
        return $record.get("first_out");
      },
      secondOut($record) {
        return $record.get("second_out");
      }
    }
  },
  CFuncOutOutSetofConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  CFuncOutOutSetofRecord: {
    assertStep: assertPgClassSingleStep
  },
  CFuncOutOutUnnamedRecord: {
    assertStep: assertPgClassSingleStep
  },
  CFuncOutSetofConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  CFuncOutUnnamedOutOutUnnamedRecord: {
    assertStep: assertPgClassSingleStep
  },
  CFuncReturnsTableMultiColConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  CFuncReturnsTableMultiColRecord: {
    assertStep: assertPgClassSingleStep
  },
  CFuncReturnsTableOneColConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  CIntSetMutationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  CIntSetQueryConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  CIssue756: {
    assertStep: assertPgClassSingleStep,
    plans: {
      rowId($record) {
        return $record.get("id");
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of c_issue756Uniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_c_issue756PgResource.get(spec);
    }
  },
  CIssue756Connection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  CIssue756MutationPayload: {
    assertStep: ObjectStep,
    plans: {
      cIssue756Edge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_c_issue756PgResource, c_issue756Uniques[0].attributes, $mutation, fieldArgs);
      },
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  CIssue756SetMutationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  CJsonbIdentityMutationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  CJsonbIdentityMutationPlpgsqlPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  CJsonbIdentityMutationPlpgsqlWithDefaultPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  CJsonIdentityMutationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  CLeftArm: {
    assertStep: assertPgClassSingleStep,
    plans: {
      cPersonByPersonId($record) {
        return resource_c_personPgResource.get({
          id: $record.get("person_id")
        });
      },
      lengthInMetres($record) {
        return $record.get("length_in_metres");
      },
      personId($record) {
        return $record.get("person_id");
      },
      rowId($record) {
        return $record.get("id");
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of c_left_armUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_c_left_armPgResource.get(spec);
    }
  },
  CLeftArmConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  CLeftArmIdentityPayload: {
    assertStep: ObjectStep,
    plans: {
      cLeftArmEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_c_left_armPgResource, c_left_armUniques[0].attributes, $mutation, fieldArgs);
      },
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      leftArm: planCustomMutationPayloadResult,
      query: queryPlan
    }
  },
  CListOfCompoundTypesMutationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  CMutationInInoutPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  CMutationInOutPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  CMutationOutComplexPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  CMutationOutComplexRecord: {
    assertStep: assertPgClassSingleStep,
    plans: {
      y($record) {
        const $plan = $record.get("y");
        const $select = pgSelectSingleFromRecord(resource_frmcdc_cCompoundTypePgResource, $plan);
        $select.getClassStep().setTrusted();
        return $select;
      },
      z($record) {
        const $plan = $record.get("z");
        const $select = pgSelectSingleFromRecord(resource_c_personPgResource, $plan);
        $select.getClassStep().setTrusted();
        return $select;
      }
    }
  },
  CMutationOutComplexSetofPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  CMutationOutComplexSetofRecord: {
    assertStep: assertPgClassSingleStep,
    plans: {
      y($record) {
        const $plan = $record.get("y");
        const $select = pgSelectSingleFromRecord(resource_frmcdc_cCompoundTypePgResource, $plan);
        $select.getClassStep().setTrusted();
        return $select;
      },
      z($record) {
        const $plan = $record.get("z");
        const $select = pgSelectSingleFromRecord(resource_c_personPgResource, $plan);
        $select.getClassStep().setTrusted();
        return $select;
      }
    }
  },
  CMutationOutOutCompoundTypePayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  CMutationOutOutCompoundTypeRecord: {
    assertStep: assertPgClassSingleStep,
    plans: {
      o2($record) {
        const $plan = $record.get("o2");
        const $select = pgSelectSingleFromRecord(resource_frmcdc_cCompoundTypePgResource, $plan);
        $select.getClassStep().setTrusted();
        return $select;
      }
    }
  },
  CMutationOutOutPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  CMutationOutOutRecord: {
    assertStep: assertPgClassSingleStep,
    plans: {
      firstOut($record) {
        return $record.get("first_out");
      },
      secondOut($record) {
        return $record.get("second_out");
      }
    }
  },
  CMutationOutOutSetofPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  CMutationOutOutSetofRecord: {
    assertStep: assertPgClassSingleStep
  },
  CMutationOutOutUnnamedPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  CMutationOutOutUnnamedRecord: {
    assertStep: assertPgClassSingleStep
  },
  CMutationOutPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  CMutationOutSetofPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  CMutationOutTablePayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      cPersonEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_c_personPgResource, c_personUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  CMutationOutTableSetofPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  CMutationOutUnnamedOutOutUnnamedPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  CMutationOutUnnamedOutOutUnnamedRecord: {
    assertStep: assertPgClassSingleStep
  },
  CMutationOutUnnamedPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  CMutationReturnsTableMultiColPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  CMutationReturnsTableMultiColRecord: {
    assertStep: assertPgClassSingleStep
  },
  CMutationReturnsTableOneColPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  CMyTable: {
    assertStep: assertPgClassSingleStep,
    plans: {
      jsonData($record) {
        return $record.get("json_data");
      },
      rowId($record) {
        return $record.get("id");
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of c_my_tableUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_c_my_tablePgResource.get(spec);
    }
  },
  CMyTableConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  CNoArgsMutationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  CNullTestRecord: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nonNullText($record) {
        return $record.get("non_null_text");
      },
      nullableInt($record) {
        return $record.get("nullable_int");
      },
      nullableText($record) {
        return $record.get("nullable_text");
      },
      rowId($record) {
        return $record.get("id");
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of c_null_test_recordUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_c_null_test_recordPgResource.get(spec);
    }
  },
  CNullTestRecordConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
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
  CPerson: {
    assertStep: assertPgClassSingleStep,
    plans: {
      cCompoundKeysByPersonId1: {
        plan($record) {
          const $records = resource_c_compound_keyPgResource.find({
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
      cCompoundKeysByPersonId2: {
        plan($record) {
          const $records = resource_c_compound_keyPgResource.find({
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
      cLeftArmByPersonId($record) {
        return resource_c_left_armPgResource.get({
          person_id: $record.get("id")
        });
      },
      computedComplex($in, args, _info) {
        const details = pgFunctionArgumentsFromArgs($in, makeArgs_c_person_computed_complex(args));
        return resource_c_person_computed_complexPgResource.execute(details.selectArgs);
      },
      computedFirstArgInout($in, args, _info) {
        const details = pgFunctionArgumentsFromArgs($in, makeArgs_c_person_computed_out(args));
        return resource_c_person_computed_first_arg_inoutPgResource.execute(details.selectArgs);
      },
      computedFirstArgInoutOut($in, args, _info) {
        const details = pgFunctionArgumentsFromArgs($in, makeArgs_c_person_computed_out(args));
        return resource_c_person_computed_first_arg_inout_outPgResource.execute(details.selectArgs);
      },
      computedInout($in, args, _info) {
        return scalarComputed(resource_c_person_computed_inoutPgResource, $in, makeArgs_c_person_computed_inout(args));
      },
      computedInoutOut($in, args, _info) {
        const details = pgFunctionArgumentsFromArgs($in, makeArgs_c_person_computed_inout_out(args));
        return resource_c_person_computed_inout_outPgResource.execute(details.selectArgs);
      },
      computedOut($in, args, _info) {
        return scalarComputed(resource_c_person_computed_outPgResource, $in, makeArgs_c_person_computed_out(args));
      },
      computedOutOut($in, args, _info) {
        const details = pgFunctionArgumentsFromArgs($in, makeArgs_c_person_computed_out(args));
        return resource_c_person_computed_out_outPgResource.execute(details.selectArgs);
      },
      cPersonSecretByPersonId($record) {
        return resource_c_person_secretPgResource.get({
          person_id: $record.get("id")
        });
      },
      createdAt($record) {
        return $record.get("created_at");
      },
      exists($in, args, _info) {
        return scalarComputed(resource_c_person_existsPgResource, $in, makeArgs_c_person_exists(args));
      },
      firstName($in, args, _info) {
        return scalarComputed(resource_c_person_first_namePgResource, $in, makeArgs_c_person_computed_out(args));
      },
      firstPost($in, args, _info) {
        const details = pgFunctionArgumentsFromArgs($in, makeArgs_c_person_computed_out(args));
        return resource_c_person_first_postPgResource.execute(details.selectArgs);
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
          const $select = c_person_friends_getSelectPlanFromParentAndArgs($parent, args, info);
          return connection($select);
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg,
          after: applyAfterArg
        }
      },
      lastLoginFromIp($record) {
        return $record.get("last_login_from_ip");
      },
      lastLoginFromSubnet($record) {
        return $record.get("last_login_from_subnet");
      },
      name($record) {
        return $record.get("person_full_name");
      },
      optionalMissingMiddle1($in, args, _info) {
        return scalarComputed(resource_c_person_optional_missing_middle_1PgResource, $in, makeArgs_c_person_optional_missing_middle_1(args));
      },
      optionalMissingMiddle2($in, args, _info) {
        return scalarComputed(resource_c_person_optional_missing_middle_2PgResource, $in, makeArgs_c_person_optional_missing_middle_2(args));
      },
      optionalMissingMiddle3($in, args, _info) {
        return scalarComputed(resource_c_person_optional_missing_middle_3PgResource, $in, makeArgs_c_person_optional_missing_middle_3(args));
      },
      optionalMissingMiddle4($in, args, _info) {
        return scalarComputed(resource_c_person_optional_missing_middle_4PgResource, $in, makeArgs_c_person_optional_missing_middle_4(args));
      },
      optionalMissingMiddle5($in, args, _info) {
        return scalarComputed(resource_c_person_optional_missing_middle_5PgResource, $in, makeArgs_c_person_optional_missing_middle_5(args));
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
      rowId($record) {
        return $record.get("id");
      },
      site($record) {
        const $plan = $record.get("site");
        const $select = pgSelectSingleFromRecord(resource_frmcdc_bWrappedUrlPgResource, $plan);
        $select.getClassStep().setTrusted();
        return $select;
      },
      typeFunction($in, args, _info) {
        const details = pgFunctionArgumentsFromArgs($in, makeArgs_c_person_type_function(args));
        return resource_c_person_type_functionPgResource.execute(details.selectArgs);
      },
      typeFunctionConnection: {
        plan($parent, args, info) {
          const $select = c_person_type_function_connection_getSelectPlanFromParentAndArgs($parent, args, info);
          return connection($select);
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg,
          after: applyAfterArg
        }
      },
      typeFunctionList($in, args, _info) {
        const details = pgFunctionArgumentsFromArgs($in, makeArgs_c_person_computed_out(args));
        return resource_c_person_type_function_listPgResource.execute(details.selectArgs);
      },
      userMac($record) {
        return $record.get("user_mac");
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of c_personUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_c_personPgResource.get(spec);
    }
  },
  CPersonComputedComplexRecord: {
    assertStep: assertPgClassSingleStep,
    plans: {
      y($record) {
        const $plan = $record.get("y");
        const $select = pgSelectSingleFromRecord(resource_frmcdc_cCompoundTypePgResource, $plan);
        $select.getClassStep().setTrusted();
        return $select;
      },
      z($record) {
        const $plan = $record.get("z");
        const $select = pgSelectSingleFromRecord(resource_c_personPgResource, $plan);
        $select.getClassStep().setTrusted();
        return $select;
      }
    }
  },
  CPersonComputedFirstArgInoutOutRecord: {
    assertStep: assertPgClassSingleStep,
    plans: {
      person($record) {
        const $plan = $record.get("person");
        const $select = pgSelectSingleFromRecord(resource_c_personPgResource, $plan);
        $select.getClassStep().setTrusted();
        return $select;
      }
    }
  },
  CPersonComputedInoutOutRecord: {
    assertStep: assertPgClassSingleStep
  },
  CPersonComputedOutOutRecord: {
    assertStep: assertPgClassSingleStep
  },
  CPersonConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  CPersonSecret: {
    assertStep: assertPgClassSingleStep,
    plans: {
      cPersonByPersonId($record) {
        return resource_c_personPgResource.get({
          id: $record.get("person_id")
        });
      },
      personId($record) {
        return $record.get("person_id");
      },
      secret($record) {
        return $record.get("sekrit");
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of c_person_secretUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_c_person_secretPgResource.get(spec);
    }
  },
  CPersonSecretConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  CQueryOutputTwoRowsRecord: {
    assertStep: assertPgClassSingleStep,
    plans: {
      leftArm($record) {
        const $plan = $record.get("left_arm");
        const $select = pgSelectSingleFromRecord(resource_c_left_armPgResource, $plan);
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
  CreateBListPayload: {
    assertStep: assertStep,
    plans: {
      bList: planCreatePayloadResult,
      bListEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_b_listsPgResource, b_listsUniques[0].attributes, $mutation, fieldArgs);
      },
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan
    }
  },
  CreateBTypePayload: {
    assertStep: assertStep,
    plans: {
      bType: planCreatePayloadResult,
      bTypeEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_b_typesPgResource, b_typesUniques[0].attributes, $mutation, fieldArgs);
      },
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan
    }
  },
  CreateBUpdatableViewPayload: {
    assertStep: assertStep,
    plans: {
      bUpdatableView: planCreatePayloadResult,
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan
    }
  },
  CreateCCompoundKeyPayload: {
    assertStep: assertStep,
    plans: {
      cCompoundKey: planCreatePayloadResult,
      cCompoundKeyEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_c_compound_keyPgResource, c_compound_keyUniques[0].attributes, $mutation, fieldArgs);
      },
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan
    }
  },
  CreateCEdgeCasePayload: {
    assertStep: assertStep,
    plans: {
      cEdgeCase: planCreatePayloadResult,
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan
    }
  },
  CreateCIssue756Payload: {
    assertStep: assertStep,
    plans: {
      cIssue756: planCreatePayloadResult,
      cIssue756Edge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_c_issue756PgResource, c_issue756Uniques[0].attributes, $mutation, fieldArgs);
      },
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan
    }
  },
  CreateCLeftArmPayload: {
    assertStep: assertStep,
    plans: {
      cLeftArm: planCreatePayloadResult,
      cLeftArmEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_c_left_armPgResource, c_left_armUniques[0].attributes, $mutation, fieldArgs);
      },
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan
    }
  },
  CreateCMyTablePayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      cMyTable: planCreatePayloadResult,
      cMyTableEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_c_my_tablePgResource, c_my_tableUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  CreateCNullTestRecordPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      cNullTestRecord: planCreatePayloadResult,
      cNullTestRecordEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_c_null_test_recordPgResource, c_null_test_recordUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  CreateCPersonPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      cPerson: planCreatePayloadResult,
      cPersonEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_c_personPgResource, c_personUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  CreateCPersonSecretPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      cPersonSecret: planCreatePayloadResult,
      cPersonSecretEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_c_person_secretPgResource, c_person_secretUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  CreateDefaultValuePayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      defaultValue: planCreatePayloadResult,
      defaultValueEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_default_valuePgResource, default_valueUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  CreateForeignKeyPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      foreignKey: planCreatePayloadResult,
      query: queryPlan
    }
  },
  CreateInputPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      input: planCreatePayloadResult,
      inputEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_inputsPgResource, inputsUniques[0].attributes, $mutation, fieldArgs);
      },
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
  CreatePatchPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      patch: planCreatePayloadResult,
      patchEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_patchsPgResource, patchsUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  CreatePostPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      post: planCreatePayloadResult,
      postEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_postPgResource, postUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  CreateReservedInputRecordPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan,
      reservedInputRecord: planCreatePayloadResult,
      reservedInputRecordEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_reserved_inputPgResource, reserved_inputUniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  CreateReservedPatchRecordPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan,
      reservedPatchRecord: planCreatePayloadResult,
      reservedPatchRecordEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_reservedPatchsPgResource, reservedPatchsUniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  CreateReservedPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan,
      reserved: planCreatePayloadResult,
      reservedEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_reservedPgResource, reservedUniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  CreateSimilarTable1Payload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan,
      similarTable1: planCreatePayloadResult,
      similarTable1Edge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_similar_table_1PgResource, similar_table_1Uniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  CreateSimilarTable2Payload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan,
      similarTable2: planCreatePayloadResult,
      similarTable2Edge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_similar_table_2PgResource, similar_table_2Uniques[0].attributes, $mutation, fieldArgs);
      }
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
  CreateUniqueForeignKeyPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan,
      uniqueForeignKey: planCreatePayloadResult
    }
  },
  CreateViewTablePayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan,
      viewTable: planCreatePayloadResult,
      viewTableEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_view_tablePgResource, view_tableUniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  CSearchTestSummariesConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  CSearchTestSummariesRecord: {
    assertStep: assertPgClassSingleStep,
    plans: {
      totalDuration($record) {
        return $record.get("total_duration");
      }
    }
  },
  CTableMutationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      postEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_postPgResource, postUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  CTableSetMutationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  CTypesMutationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  DefaultValue: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nullValue($record) {
        return $record.get("null_value");
      },
      rowId($record) {
        return $record.get("id");
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
  DefaultValueConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  DeleteBListPayload: {
    assertStep: ObjectStep,
    plans: {
      bList: planUpdateOrDeletePayloadResult,
      bListEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_b_listsPgResource, b_listsUniques[0].attributes, $mutation, fieldArgs);
      },
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan
    }
  },
  DeleteBTypePayload: {
    assertStep: ObjectStep,
    plans: {
      bType: planUpdateOrDeletePayloadResult,
      bTypeEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_b_typesPgResource, b_typesUniques[0].attributes, $mutation, fieldArgs);
      },
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan
    }
  },
  DeleteCCompoundKeyPayload: {
    assertStep: ObjectStep,
    plans: {
      cCompoundKey: planUpdateOrDeletePayloadResult,
      cCompoundKeyEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_c_compound_keyPgResource, c_compound_keyUniques[0].attributes, $mutation, fieldArgs);
      },
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan
    }
  },
  DeleteCIssue756Payload: {
    assertStep: ObjectStep,
    plans: {
      cIssue756: planUpdateOrDeletePayloadResult,
      cIssue756Edge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_c_issue756PgResource, c_issue756Uniques[0].attributes, $mutation, fieldArgs);
      },
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan
    }
  },
  DeleteCLeftArmPayload: {
    assertStep: ObjectStep,
    plans: {
      cLeftArm: planUpdateOrDeletePayloadResult,
      cLeftArmEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_c_left_armPgResource, c_left_armUniques[0].attributes, $mutation, fieldArgs);
      },
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan
    }
  },
  DeleteCMyTablePayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      cMyTable: planUpdateOrDeletePayloadResult,
      cMyTableEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_c_my_tablePgResource, c_my_tableUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  DeleteCNullTestRecordPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      cNullTestRecord: planUpdateOrDeletePayloadResult,
      cNullTestRecordEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_c_null_test_recordPgResource, c_null_test_recordUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  DeleteCPersonPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      cPerson: planUpdateOrDeletePayloadResult,
      cPersonEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_c_personPgResource, c_personUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  DeleteCPersonSecretPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      cPersonSecret: planUpdateOrDeletePayloadResult,
      cPersonSecretEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_c_person_secretPgResource, c_person_secretUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  DeleteDefaultValuePayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      defaultValue: planUpdateOrDeletePayloadResult,
      defaultValueEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_default_valuePgResource, default_valueUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  DeleteInputPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      input: planUpdateOrDeletePayloadResult,
      inputEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_inputsPgResource, inputsUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  DeleteNoPrimaryKeyPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      noPrimaryKey: planUpdateOrDeletePayloadResult,
      query: queryPlan
    }
  },
  DeletePatchPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      patch: planUpdateOrDeletePayloadResult,
      patchEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_patchsPgResource, patchsUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  DeletePostPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      post: planUpdateOrDeletePayloadResult,
      postEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_postPgResource, postUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  DeleteReservedInputRecordPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan,
      reservedInputRecord: planUpdateOrDeletePayloadResult,
      reservedInputRecordEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_reserved_inputPgResource, reserved_inputUniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  DeleteReservedPatchRecordPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan,
      reservedPatchRecord: planUpdateOrDeletePayloadResult,
      reservedPatchRecordEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_reservedPatchsPgResource, reservedPatchsUniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  DeleteReservedPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan,
      reserved: planUpdateOrDeletePayloadResult,
      reservedEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_reservedPgResource, reservedUniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  DeleteSimilarTable1Payload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan,
      similarTable1: planUpdateOrDeletePayloadResult,
      similarTable1Edge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_similar_table_1PgResource, similar_table_1Uniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  DeleteSimilarTable2Payload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan,
      similarTable2: planUpdateOrDeletePayloadResult,
      similarTable2Edge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_similar_table_2PgResource, similar_table_2Uniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  DeleteUniqueForeignKeyPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan,
      uniqueForeignKey: planUpdateOrDeletePayloadResult
    }
  },
  DeleteViewTablePayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan,
      viewTable: planUpdateOrDeletePayloadResult,
      viewTableEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_view_tablePgResource, view_tableUniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  ForeignKey: {
    assertStep: assertPgClassSingleStep,
    plans: {
      cCompoundKeyByCompoundKey1AndCompoundKey2($record) {
        return resource_c_compound_keyPgResource.get({
          person_id_1: $record.get("compound_key_1"),
          person_id_2: $record.get("compound_key_2")
        });
      },
      compoundKey1($record) {
        return $record.get("compound_key_1");
      },
      compoundKey2($record) {
        return $record.get("compound_key_2");
      },
      cPersonByPersonId($record) {
        return resource_c_personPgResource.get({
          id: $record.get("person_id")
        });
      },
      personId($record) {
        return $record.get("person_id");
      }
    }
  },
  ForeignKeyConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  Input: {
    assertStep: assertPgClassSingleStep,
    plans: {
      rowId($record) {
        return $record.get("id");
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
  InputConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  Interval: {
    assertStep: assertStep
  },
  MutationCompoundTypeArrayPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  MutationIntervalArrayPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  MutationIntervalSetPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  MutationTextArrayPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
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
  NonUpdatableViewConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  NoPrimaryKey: {
    assertStep: assertPgClassSingleStep,
    plans: {
      rowId($record) {
        return $record.get("id");
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of no_primary_keyUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_no_primary_keyPgResource.get(spec);
    }
  },
  NoPrimaryKeyConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  Patch: {
    assertStep: assertPgClassSingleStep,
    plans: {
      rowId($record) {
        return $record.get("id");
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
  PatchConnection: {
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
      bTypeByRowId($record) {
        return resource_b_typesPgResource.get({
          id: $record.get("id")
        });
      },
      bTypesBySmallint: {
        plan($record) {
          const $records = resource_b_typesPgResource.find({
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
        return scalarComputed(resource_post_computed_interval_arrayPgResource, $in, makeArgs_c_person_computed_out(args));
      },
      computedIntervalSet: {
        plan($parent, args, info) {
          const $select = post_computed_interval_set_getSelectPlanFromParentAndArgs($parent, args, info);
          return connection($select);
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg,
          after: applyAfterArg
        }
      },
      computedTextArray($in, args, _info) {
        return scalarComputed(resource_post_computed_text_arrayPgResource, $in, makeArgs_c_person_computed_out(args));
      },
      computedWithOptionalArg($in, args, _info) {
        return scalarComputed(resource_post_computed_with_optional_argPgResource, $in, makeArgs_post_computed_with_optional_arg(args));
      },
      computedWithRequiredArg($in, args, _info) {
        return scalarComputed(resource_post_computed_with_required_argPgResource, $in, makeArgs_post_computed_with_required_arg(args));
      },
      cPersonByAuthorId($record) {
        return resource_c_personPgResource.get({
          id: $record.get("author_id")
        });
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
      rowId($record) {
        return $record.get("id");
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
  PostConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  PostManyPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  PostWithSuffixPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      postEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_postPgResource, postUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan,
      result: planCustomMutationPayloadResult
    }
  },
  QueryIntervalSetConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  Reserved: {
    assertStep: assertPgClassSingleStep,
    plans: {
      rowId($record) {
        return $record.get("id");
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
  ReservedConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  ReservedInputRecord: {
    assertStep: assertPgClassSingleStep,
    plans: {
      rowId($record) {
        return $record.get("id");
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
  ReservedInputRecordConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  ReservedPatchRecord: {
    assertStep: assertPgClassSingleStep,
    plans: {
      rowId($record) {
        return $record.get("id");
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
  ReservedPatchRecordConnection: {
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
  SimilarTable1: {
    assertStep: assertPgClassSingleStep,
    plans: {
      rowId($record) {
        return $record.get("id");
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
  SimilarTable1Connection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  SimilarTable2: {
    assertStep: assertPgClassSingleStep,
    plans: {
      rowId($record) {
        return $record.get("id");
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
  SimilarTable2Connection: {
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
  Testview: {
    assertStep: assertPgClassSingleStep
  },
  TestviewConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  UniqueForeignKey: {
    assertStep: assertPgClassSingleStep,
    plans: {
      cCompoundKeyByCompoundKey1AndCompoundKey2($record) {
        return resource_c_compound_keyPgResource.get({
          person_id_1: $record.get("compound_key_1"),
          person_id_2: $record.get("compound_key_2")
        });
      },
      compoundKey1($record) {
        return $record.get("compound_key_1");
      },
      compoundKey2($record) {
        return $record.get("compound_key_2");
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of unique_foreign_keyUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_unique_foreign_keyPgResource.get(spec);
    }
  },
  UniqueForeignKeyConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  UpdateBListPayload: {
    assertStep: ObjectStep,
    plans: {
      bList: planUpdateOrDeletePayloadResult,
      bListEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_b_listsPgResource, b_listsUniques[0].attributes, $mutation, fieldArgs);
      },
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan
    }
  },
  UpdateBTypePayload: {
    assertStep: ObjectStep,
    plans: {
      bType: planUpdateOrDeletePayloadResult,
      bTypeEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_b_typesPgResource, b_typesUniques[0].attributes, $mutation, fieldArgs);
      },
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan
    }
  },
  UpdateCCompoundKeyPayload: {
    assertStep: ObjectStep,
    plans: {
      cCompoundKey: planUpdateOrDeletePayloadResult,
      cCompoundKeyEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_c_compound_keyPgResource, c_compound_keyUniques[0].attributes, $mutation, fieldArgs);
      },
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan
    }
  },
  UpdateCIssue756Payload: {
    assertStep: ObjectStep,
    plans: {
      cIssue756: planUpdateOrDeletePayloadResult,
      cIssue756Edge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_c_issue756PgResource, c_issue756Uniques[0].attributes, $mutation, fieldArgs);
      },
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan
    }
  },
  UpdateCLeftArmPayload: {
    assertStep: ObjectStep,
    plans: {
      cLeftArm: planUpdateOrDeletePayloadResult,
      cLeftArmEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_c_left_armPgResource, c_left_armUniques[0].attributes, $mutation, fieldArgs);
      },
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan
    }
  },
  UpdateCMyTablePayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      cMyTable: planUpdateOrDeletePayloadResult,
      cMyTableEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_c_my_tablePgResource, c_my_tableUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  UpdateCNullTestRecordPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      cNullTestRecord: planUpdateOrDeletePayloadResult,
      cNullTestRecordEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_c_null_test_recordPgResource, c_null_test_recordUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  UpdateCPersonPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      cPerson: planUpdateOrDeletePayloadResult,
      cPersonEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_c_personPgResource, c_personUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  UpdateCPersonSecretPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      cPersonSecret: planUpdateOrDeletePayloadResult,
      cPersonSecretEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_c_person_secretPgResource, c_person_secretUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  UpdateDefaultValuePayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      defaultValue: planUpdateOrDeletePayloadResult,
      defaultValueEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_default_valuePgResource, default_valueUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  UpdateInputPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      input: planUpdateOrDeletePayloadResult,
      inputEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_inputsPgResource, inputsUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  UpdateNoPrimaryKeyPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      noPrimaryKey: planUpdateOrDeletePayloadResult,
      query: queryPlan
    }
  },
  UpdatePatchPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      patch: planUpdateOrDeletePayloadResult,
      patchEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_patchsPgResource, patchsUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  UpdatePostPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      post: planUpdateOrDeletePayloadResult,
      postEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_postPgResource, postUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  UpdateReservedInputRecordPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan,
      reservedInputRecord: planUpdateOrDeletePayloadResult,
      reservedInputRecordEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_reserved_inputPgResource, reserved_inputUniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  UpdateReservedPatchRecordPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan,
      reservedPatchRecord: planUpdateOrDeletePayloadResult,
      reservedPatchRecordEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_reservedPatchsPgResource, reservedPatchsUniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  UpdateReservedPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan,
      reserved: planUpdateOrDeletePayloadResult,
      reservedEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_reservedPgResource, reservedUniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  UpdateSimilarTable1Payload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan,
      similarTable1: planUpdateOrDeletePayloadResult,
      similarTable1Edge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_similar_table_1PgResource, similar_table_1Uniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  UpdateSimilarTable2Payload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan,
      similarTable2: planUpdateOrDeletePayloadResult,
      similarTable2Edge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_similar_table_2PgResource, similar_table_2Uniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  UpdateUniqueForeignKeyPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan,
      uniqueForeignKey: planUpdateOrDeletePayloadResult
    }
  },
  UpdateViewTablePayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan,
      viewTable: planUpdateOrDeletePayloadResult,
      viewTableEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_view_tablePgResource, view_tableUniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  ViewTable: {
    assertStep: assertPgClassSingleStep,
    plans: {
      rowId($record) {
        return $record.get("id");
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
  ViewTableConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
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
  BAuthenticateFailInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  BAuthenticateInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  BAuthenticateManyInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  BAuthenticatePayloadInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  BCompoundTypeArrayMutationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  BCompoundTypeMutationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  BCompoundTypeSetMutationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  BGuidFnInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  BListBdeMutationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  BListCondition: {
    plans: {
      rowId($condition, val) {
        return applyAttributeCondition("id", TYPES.int, $condition, val);
      }
    }
  },
  BListInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      byteaArray(obj, val, {
        field,
        schema
      }) {
        obj.set("bytea_array", bakedInputRuntime(schema, field.type, val));
      },
      byteaArrayNn(obj, val, {
        field,
        schema
      }) {
        obj.set("bytea_array_nn", bakedInputRuntime(schema, field.type, val));
      },
      compoundTypeArray(obj, val, {
        field,
        schema
      }) {
        obj.set("compound_type_array", bakedInputRuntime(schema, field.type, val));
      },
      compoundTypeArrayNn(obj, val, {
        field,
        schema
      }) {
        obj.set("compound_type_array_nn", bakedInputRuntime(schema, field.type, val));
      },
      dateArray(obj, val, {
        field,
        schema
      }) {
        obj.set("date_array", bakedInputRuntime(schema, field.type, val));
      },
      dateArrayNn(obj, val, {
        field,
        schema
      }) {
        obj.set("date_array_nn", bakedInputRuntime(schema, field.type, val));
      },
      enumArray(obj, val, {
        field,
        schema
      }) {
        obj.set("enum_array", bakedInputRuntime(schema, field.type, val));
      },
      enumArrayNn(obj, val, {
        field,
        schema
      }) {
        obj.set("enum_array_nn", bakedInputRuntime(schema, field.type, val));
      },
      intArray(obj, val, {
        field,
        schema
      }) {
        obj.set("int_array", bakedInputRuntime(schema, field.type, val));
      },
      intArrayNn(obj, val, {
        field,
        schema
      }) {
        obj.set("int_array_nn", bakedInputRuntime(schema, field.type, val));
      },
      rowId(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      },
      timestamptzArray(obj, val, {
        field,
        schema
      }) {
        obj.set("timestamptz_array", bakedInputRuntime(schema, field.type, val));
      },
      timestamptzArrayNn(obj, val, {
        field,
        schema
      }) {
        obj.set("timestamptz_array_nn", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  BListPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      byteaArray(obj, val, {
        field,
        schema
      }) {
        obj.set("bytea_array", bakedInputRuntime(schema, field.type, val));
      },
      byteaArrayNn(obj, val, {
        field,
        schema
      }) {
        obj.set("bytea_array_nn", bakedInputRuntime(schema, field.type, val));
      },
      compoundTypeArray(obj, val, {
        field,
        schema
      }) {
        obj.set("compound_type_array", bakedInputRuntime(schema, field.type, val));
      },
      compoundTypeArrayNn(obj, val, {
        field,
        schema
      }) {
        obj.set("compound_type_array_nn", bakedInputRuntime(schema, field.type, val));
      },
      dateArray(obj, val, {
        field,
        schema
      }) {
        obj.set("date_array", bakedInputRuntime(schema, field.type, val));
      },
      dateArrayNn(obj, val, {
        field,
        schema
      }) {
        obj.set("date_array_nn", bakedInputRuntime(schema, field.type, val));
      },
      enumArray(obj, val, {
        field,
        schema
      }) {
        obj.set("enum_array", bakedInputRuntime(schema, field.type, val));
      },
      enumArrayNn(obj, val, {
        field,
        schema
      }) {
        obj.set("enum_array_nn", bakedInputRuntime(schema, field.type, val));
      },
      intArray(obj, val, {
        field,
        schema
      }) {
        obj.set("int_array", bakedInputRuntime(schema, field.type, val));
      },
      intArrayNn(obj, val, {
        field,
        schema
      }) {
        obj.set("int_array_nn", bakedInputRuntime(schema, field.type, val));
      },
      rowId(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      },
      timestamptzArray(obj, val, {
        field,
        schema
      }) {
        obj.set("timestamptz_array", bakedInputRuntime(schema, field.type, val));
      },
      timestamptzArrayNn(obj, val, {
        field,
        schema
      }) {
        obj.set("timestamptz_array_nn", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  BMult1Input: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  BMult2Input: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  BMult3Input: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  BMult4Input: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  BNestedCompoundTypeInput: {
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
      bazBuz(obj, val, {
        field,
        schema
      }) {
        obj.set("baz_buz", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  BTypeCondition: {
    plans: {
      bigint($condition, val) {
        return applyAttributeCondition("bigint", TYPES.bigint, $condition, val);
      },
      boolean($condition, val) {
        return applyAttributeCondition("boolean", TYPES.boolean, $condition, val);
      },
      cidr($condition, val) {
        return applyAttributeCondition("cidr", TYPES.cidr, $condition, val);
      },
      date($condition, val) {
        return applyAttributeCondition("date", TYPES.date, $condition, val);
      },
      decimal($condition, val) {
        return applyAttributeCondition("decimal", TYPES.numeric, $condition, val);
      },
      domain($condition, val) {
        return applyAttributeCondition("domain", anIntCodec, $condition, val);
      },
      domain2($condition, val) {
        return applyAttributeCondition("domain2", bAnotherIntCodec, $condition, val);
      },
      enum($condition, val) {
        return applyAttributeCondition("enum", bColorCodec, $condition, val);
      },
      inet($condition, val) {
        return applyAttributeCondition("inet", TYPES.inet, $condition, val);
      },
      interval($condition, val) {
        return applyAttributeCondition("interval", TYPES.interval, $condition, val);
      },
      ltree($condition, val) {
        return applyAttributeCondition("ltree", spec_bTypes_attributes_ltree_codec_ltree, $condition, val);
      },
      macaddr($condition, val) {
        return applyAttributeCondition("macaddr", TYPES.macaddr, $condition, val);
      },
      money($condition, val) {
        return applyAttributeCondition("money", TYPES.money, $condition, val);
      },
      nullablePoint($condition, val) {
        return applyAttributeCondition("nullablePoint", TYPES.point, $condition, val);
      },
      numeric($condition, val) {
        return applyAttributeCondition("numeric", TYPES.numeric, $condition, val);
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
      rowId($condition, val) {
        return applyAttributeCondition("id", TYPES.int, $condition, val);
      },
      smallint($condition, val) {
        return applyAttributeCondition("smallint", TYPES.int2, $condition, val);
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
  BTypeFunctionConnectionMutationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  BTypeFunctionListMutationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  BTypeFunctionMutationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  BTypeInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      anIntRange(obj, val, {
        field,
        schema
      }) {
        obj.set("an_int_range", bakedInputRuntime(schema, field.type, val));
      },
      bigint(obj, val, {
        field,
        schema
      }) {
        obj.set("bigint", bakedInputRuntime(schema, field.type, val));
      },
      boolean(obj, val, {
        field,
        schema
      }) {
        obj.set("boolean", bakedInputRuntime(schema, field.type, val));
      },
      bytea(obj, val, {
        field,
        schema
      }) {
        obj.set("bytea", bakedInputRuntime(schema, field.type, val));
      },
      byteaArray(obj, val, {
        field,
        schema
      }) {
        obj.set("bytea_array", bakedInputRuntime(schema, field.type, val));
      },
      cidr(obj, val, {
        field,
        schema
      }) {
        obj.set("cidr", bakedInputRuntime(schema, field.type, val));
      },
      compoundType(obj, val, {
        field,
        schema
      }) {
        obj.set("compound_type", bakedInputRuntime(schema, field.type, val));
      },
      date(obj, val, {
        field,
        schema
      }) {
        obj.set("date", bakedInputRuntime(schema, field.type, val));
      },
      daterange(obj, val, {
        field,
        schema
      }) {
        obj.set("daterange", bakedInputRuntime(schema, field.type, val));
      },
      decimal(obj, val, {
        field,
        schema
      }) {
        obj.set("decimal", bakedInputRuntime(schema, field.type, val));
      },
      domain(obj, val, {
        field,
        schema
      }) {
        obj.set("domain", bakedInputRuntime(schema, field.type, val));
      },
      domain2(obj, val, {
        field,
        schema
      }) {
        obj.set("domain2", bakedInputRuntime(schema, field.type, val));
      },
      enum(obj, val, {
        field,
        schema
      }) {
        obj.set("enum", bakedInputRuntime(schema, field.type, val));
      },
      enumArray(obj, val, {
        field,
        schema
      }) {
        obj.set("enum_array", bakedInputRuntime(schema, field.type, val));
      },
      inet(obj, val, {
        field,
        schema
      }) {
        obj.set("inet", bakedInputRuntime(schema, field.type, val));
      },
      int8ArrayDomain(obj, val, {
        field,
        schema
      }) {
        obj.set("int8_array_domain", bakedInputRuntime(schema, field.type, val));
      },
      interval(obj, val, {
        field,
        schema
      }) {
        obj.set("interval", bakedInputRuntime(schema, field.type, val));
      },
      intervalArray(obj, val, {
        field,
        schema
      }) {
        obj.set("interval_array", bakedInputRuntime(schema, field.type, val));
      },
      json(obj, val, {
        field,
        schema
      }) {
        obj.set("json", bakedInputRuntime(schema, field.type, val));
      },
      jsonb(obj, val, {
        field,
        schema
      }) {
        obj.set("jsonb", bakedInputRuntime(schema, field.type, val));
      },
      jsonpath(obj, val, {
        field,
        schema
      }) {
        obj.set("jsonpath", bakedInputRuntime(schema, field.type, val));
      },
      ltree(obj, val, {
        field,
        schema
      }) {
        obj.set("ltree", bakedInputRuntime(schema, field.type, val));
      },
      ltreeArray(obj, val, {
        field,
        schema
      }) {
        obj.set("ltree_array", bakedInputRuntime(schema, field.type, val));
      },
      macaddr(obj, val, {
        field,
        schema
      }) {
        obj.set("macaddr", bakedInputRuntime(schema, field.type, val));
      },
      money(obj, val, {
        field,
        schema
      }) {
        obj.set("money", bakedInputRuntime(schema, field.type, val));
      },
      nestedCompoundType(obj, val, {
        field,
        schema
      }) {
        obj.set("nested_compound_type", bakedInputRuntime(schema, field.type, val));
      },
      nullableCompoundType(obj, val, {
        field,
        schema
      }) {
        obj.set("nullable_compound_type", bakedInputRuntime(schema, field.type, val));
      },
      nullableNestedCompoundType(obj, val, {
        field,
        schema
      }) {
        obj.set("nullable_nested_compound_type", bakedInputRuntime(schema, field.type, val));
      },
      nullablePoint(obj, val, {
        field,
        schema
      }) {
        obj.set("nullablePoint", bakedInputRuntime(schema, field.type, val));
      },
      nullableRange(obj, val, {
        field,
        schema
      }) {
        obj.set("nullable_range", bakedInputRuntime(schema, field.type, val));
      },
      numeric(obj, val, {
        field,
        schema
      }) {
        obj.set("numeric", bakedInputRuntime(schema, field.type, val));
      },
      numrange(obj, val, {
        field,
        schema
      }) {
        obj.set("numrange", bakedInputRuntime(schema, field.type, val));
      },
      point(obj, val, {
        field,
        schema
      }) {
        obj.set("point", bakedInputRuntime(schema, field.type, val));
      },
      regclass(obj, val, {
        field,
        schema
      }) {
        obj.set("regclass", bakedInputRuntime(schema, field.type, val));
      },
      regconfig(obj, val, {
        field,
        schema
      }) {
        obj.set("regconfig", bakedInputRuntime(schema, field.type, val));
      },
      regdictionary(obj, val, {
        field,
        schema
      }) {
        obj.set("regdictionary", bakedInputRuntime(schema, field.type, val));
      },
      regoper(obj, val, {
        field,
        schema
      }) {
        obj.set("regoper", bakedInputRuntime(schema, field.type, val));
      },
      regoperator(obj, val, {
        field,
        schema
      }) {
        obj.set("regoperator", bakedInputRuntime(schema, field.type, val));
      },
      regproc(obj, val, {
        field,
        schema
      }) {
        obj.set("regproc", bakedInputRuntime(schema, field.type, val));
      },
      regprocedure(obj, val, {
        field,
        schema
      }) {
        obj.set("regprocedure", bakedInputRuntime(schema, field.type, val));
      },
      regtype(obj, val, {
        field,
        schema
      }) {
        obj.set("regtype", bakedInputRuntime(schema, field.type, val));
      },
      rowId(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      },
      smallint(obj, val, {
        field,
        schema
      }) {
        obj.set("smallint", bakedInputRuntime(schema, field.type, val));
      },
      textArray(obj, val, {
        field,
        schema
      }) {
        obj.set("text_array", bakedInputRuntime(schema, field.type, val));
      },
      textArrayDomain(obj, val, {
        field,
        schema
      }) {
        obj.set("text_array_domain", bakedInputRuntime(schema, field.type, val));
      },
      time(obj, val, {
        field,
        schema
      }) {
        obj.set("time", bakedInputRuntime(schema, field.type, val));
      },
      timestamp(obj, val, {
        field,
        schema
      }) {
        obj.set("timestamp", bakedInputRuntime(schema, field.type, val));
      },
      timestamptz(obj, val, {
        field,
        schema
      }) {
        obj.set("timestamptz", bakedInputRuntime(schema, field.type, val));
      },
      timetz(obj, val, {
        field,
        schema
      }) {
        obj.set("timetz", bakedInputRuntime(schema, field.type, val));
      },
      varchar(obj, val, {
        field,
        schema
      }) {
        obj.set("varchar", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  BTypePatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      anIntRange(obj, val, {
        field,
        schema
      }) {
        obj.set("an_int_range", bakedInputRuntime(schema, field.type, val));
      },
      bigint(obj, val, {
        field,
        schema
      }) {
        obj.set("bigint", bakedInputRuntime(schema, field.type, val));
      },
      boolean(obj, val, {
        field,
        schema
      }) {
        obj.set("boolean", bakedInputRuntime(schema, field.type, val));
      },
      bytea(obj, val, {
        field,
        schema
      }) {
        obj.set("bytea", bakedInputRuntime(schema, field.type, val));
      },
      byteaArray(obj, val, {
        field,
        schema
      }) {
        obj.set("bytea_array", bakedInputRuntime(schema, field.type, val));
      },
      cidr(obj, val, {
        field,
        schema
      }) {
        obj.set("cidr", bakedInputRuntime(schema, field.type, val));
      },
      compoundType(obj, val, {
        field,
        schema
      }) {
        obj.set("compound_type", bakedInputRuntime(schema, field.type, val));
      },
      date(obj, val, {
        field,
        schema
      }) {
        obj.set("date", bakedInputRuntime(schema, field.type, val));
      },
      daterange(obj, val, {
        field,
        schema
      }) {
        obj.set("daterange", bakedInputRuntime(schema, field.type, val));
      },
      decimal(obj, val, {
        field,
        schema
      }) {
        obj.set("decimal", bakedInputRuntime(schema, field.type, val));
      },
      domain(obj, val, {
        field,
        schema
      }) {
        obj.set("domain", bakedInputRuntime(schema, field.type, val));
      },
      domain2(obj, val, {
        field,
        schema
      }) {
        obj.set("domain2", bakedInputRuntime(schema, field.type, val));
      },
      enum(obj, val, {
        field,
        schema
      }) {
        obj.set("enum", bakedInputRuntime(schema, field.type, val));
      },
      enumArray(obj, val, {
        field,
        schema
      }) {
        obj.set("enum_array", bakedInputRuntime(schema, field.type, val));
      },
      inet(obj, val, {
        field,
        schema
      }) {
        obj.set("inet", bakedInputRuntime(schema, field.type, val));
      },
      int8ArrayDomain(obj, val, {
        field,
        schema
      }) {
        obj.set("int8_array_domain", bakedInputRuntime(schema, field.type, val));
      },
      interval(obj, val, {
        field,
        schema
      }) {
        obj.set("interval", bakedInputRuntime(schema, field.type, val));
      },
      intervalArray(obj, val, {
        field,
        schema
      }) {
        obj.set("interval_array", bakedInputRuntime(schema, field.type, val));
      },
      json(obj, val, {
        field,
        schema
      }) {
        obj.set("json", bakedInputRuntime(schema, field.type, val));
      },
      jsonb(obj, val, {
        field,
        schema
      }) {
        obj.set("jsonb", bakedInputRuntime(schema, field.type, val));
      },
      jsonpath(obj, val, {
        field,
        schema
      }) {
        obj.set("jsonpath", bakedInputRuntime(schema, field.type, val));
      },
      ltree(obj, val, {
        field,
        schema
      }) {
        obj.set("ltree", bakedInputRuntime(schema, field.type, val));
      },
      ltreeArray(obj, val, {
        field,
        schema
      }) {
        obj.set("ltree_array", bakedInputRuntime(schema, field.type, val));
      },
      macaddr(obj, val, {
        field,
        schema
      }) {
        obj.set("macaddr", bakedInputRuntime(schema, field.type, val));
      },
      money(obj, val, {
        field,
        schema
      }) {
        obj.set("money", bakedInputRuntime(schema, field.type, val));
      },
      nestedCompoundType(obj, val, {
        field,
        schema
      }) {
        obj.set("nested_compound_type", bakedInputRuntime(schema, field.type, val));
      },
      nullableCompoundType(obj, val, {
        field,
        schema
      }) {
        obj.set("nullable_compound_type", bakedInputRuntime(schema, field.type, val));
      },
      nullableNestedCompoundType(obj, val, {
        field,
        schema
      }) {
        obj.set("nullable_nested_compound_type", bakedInputRuntime(schema, field.type, val));
      },
      nullablePoint(obj, val, {
        field,
        schema
      }) {
        obj.set("nullablePoint", bakedInputRuntime(schema, field.type, val));
      },
      nullableRange(obj, val, {
        field,
        schema
      }) {
        obj.set("nullable_range", bakedInputRuntime(schema, field.type, val));
      },
      numeric(obj, val, {
        field,
        schema
      }) {
        obj.set("numeric", bakedInputRuntime(schema, field.type, val));
      },
      numrange(obj, val, {
        field,
        schema
      }) {
        obj.set("numrange", bakedInputRuntime(schema, field.type, val));
      },
      point(obj, val, {
        field,
        schema
      }) {
        obj.set("point", bakedInputRuntime(schema, field.type, val));
      },
      regclass(obj, val, {
        field,
        schema
      }) {
        obj.set("regclass", bakedInputRuntime(schema, field.type, val));
      },
      regconfig(obj, val, {
        field,
        schema
      }) {
        obj.set("regconfig", bakedInputRuntime(schema, field.type, val));
      },
      regdictionary(obj, val, {
        field,
        schema
      }) {
        obj.set("regdictionary", bakedInputRuntime(schema, field.type, val));
      },
      regoper(obj, val, {
        field,
        schema
      }) {
        obj.set("regoper", bakedInputRuntime(schema, field.type, val));
      },
      regoperator(obj, val, {
        field,
        schema
      }) {
        obj.set("regoperator", bakedInputRuntime(schema, field.type, val));
      },
      regproc(obj, val, {
        field,
        schema
      }) {
        obj.set("regproc", bakedInputRuntime(schema, field.type, val));
      },
      regprocedure(obj, val, {
        field,
        schema
      }) {
        obj.set("regprocedure", bakedInputRuntime(schema, field.type, val));
      },
      regtype(obj, val, {
        field,
        schema
      }) {
        obj.set("regtype", bakedInputRuntime(schema, field.type, val));
      },
      rowId(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      },
      smallint(obj, val, {
        field,
        schema
      }) {
        obj.set("smallint", bakedInputRuntime(schema, field.type, val));
      },
      textArray(obj, val, {
        field,
        schema
      }) {
        obj.set("text_array", bakedInputRuntime(schema, field.type, val));
      },
      textArrayDomain(obj, val, {
        field,
        schema
      }) {
        obj.set("text_array_domain", bakedInputRuntime(schema, field.type, val));
      },
      time(obj, val, {
        field,
        schema
      }) {
        obj.set("time", bakedInputRuntime(schema, field.type, val));
      },
      timestamp(obj, val, {
        field,
        schema
      }) {
        obj.set("timestamp", bakedInputRuntime(schema, field.type, val));
      },
      timestamptz(obj, val, {
        field,
        schema
      }) {
        obj.set("timestamptz", bakedInputRuntime(schema, field.type, val));
      },
      timetz(obj, val, {
        field,
        schema
      }) {
        obj.set("timetz", bakedInputRuntime(schema, field.type, val));
      },
      varchar(obj, val, {
        field,
        schema
      }) {
        obj.set("varchar", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  BUpdatableViewCondition: {
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
  BUpdatableViewInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      constant(obj, val, {
        field,
        schema
      }) {
        obj.set("constant", bakedInputRuntime(schema, field.type, val));
      },
      description(obj, val, {
        field,
        schema
      }) {
        obj.set("description", bakedInputRuntime(schema, field.type, val));
      },
      name(obj, val, {
        field,
        schema
      }) {
        obj.set("name", bakedInputRuntime(schema, field.type, val));
      },
      x(obj, val, {
        field,
        schema
      }) {
        obj.set("x", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  BWrappedUrlInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      url(obj, val, {
        field,
        schema
      }) {
        obj.set("url", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  CCompoundKeyCondition: {
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
  CCompoundKeyInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      extra(obj, val, {
        field,
        schema
      }) {
        obj.set("extra", bakedInputRuntime(schema, field.type, val));
      },
      personId1(obj, val, {
        field,
        schema
      }) {
        obj.set("person_id_1", bakedInputRuntime(schema, field.type, val));
      },
      personId2(obj, val, {
        field,
        schema
      }) {
        obj.set("person_id_2", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  CCompoundKeyPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      extra(obj, val, {
        field,
        schema
      }) {
        obj.set("extra", bakedInputRuntime(schema, field.type, val));
      },
      personId1(obj, val, {
        field,
        schema
      }) {
        obj.set("person_id_1", bakedInputRuntime(schema, field.type, val));
      },
      personId2(obj, val, {
        field,
        schema
      }) {
        obj.set("person_id_2", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  CCompoundTypeInput: {
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
  CEdgeCaseCondition: {
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
  CEdgeCaseInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      notNullHasDefault(obj, val, {
        field,
        schema
      }) {
        obj.set("not_null_has_default", bakedInputRuntime(schema, field.type, val));
      },
      rowId(obj, val, {
        field,
        schema
      }) {
        obj.set("row_id", bakedInputRuntime(schema, field.type, val));
      },
      wontCastEasy(obj, val, {
        field,
        schema
      }) {
        obj.set("wont_cast_easy", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  CIntSetMutationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  CIssue756Condition: {
    plans: {
      rowId($condition, val) {
        return applyAttributeCondition("id", TYPES.int, $condition, val);
      },
      ts($condition, val) {
        return applyAttributeCondition("ts", cNotNullTimestampCodec, $condition, val);
      }
    }
  },
  CIssue756Input: {
    baked: createObjectAndApplyChildren,
    plans: {
      rowId(obj, val, {
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
    }
  },
  CIssue756MutationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  CIssue756Patch: {
    baked: createObjectAndApplyChildren,
    plans: {
      rowId(obj, val, {
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
    }
  },
  CIssue756SetMutationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  CJsonbIdentityMutationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  CJsonbIdentityMutationPlpgsqlInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  CJsonbIdentityMutationPlpgsqlWithDefaultInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  CJsonIdentityMutationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  CLeftArmBaseInput: {
    baked: createObjectAndApplyChildren,
    plans: {
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
      },
      personId(obj, val, {
        field,
        schema
      }) {
        obj.set("person_id", bakedInputRuntime(schema, field.type, val));
      },
      rowId(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  CLeftArmCondition: {
    plans: {
      lengthInMetres($condition, val) {
        return applyAttributeCondition("length_in_metres", TYPES.float, $condition, val);
      },
      mood($condition, val) {
        return applyAttributeCondition("mood", TYPES.text, $condition, val);
      },
      personId($condition, val) {
        return applyAttributeCondition("person_id", TYPES.int, $condition, val);
      },
      rowId($condition, val) {
        return applyAttributeCondition("id", TYPES.int, $condition, val);
      }
    }
  },
  CLeftArmIdentityInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  CLeftArmInput: {
    baked: createObjectAndApplyChildren,
    plans: {
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
      },
      personId(obj, val, {
        field,
        schema
      }) {
        obj.set("person_id", bakedInputRuntime(schema, field.type, val));
      },
      rowId(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  CLeftArmPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
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
      },
      personId(obj, val, {
        field,
        schema
      }) {
        obj.set("person_id", bakedInputRuntime(schema, field.type, val));
      },
      rowId(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  CListOfCompoundTypesMutationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  CMutationInInoutInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  CMutationInOutInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  CMutationOutComplexInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  CMutationOutComplexSetofInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  CMutationOutInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  CMutationOutOutCompoundTypeInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  CMutationOutOutInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  CMutationOutOutSetofInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  CMutationOutOutUnnamedInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  CMutationOutSetofInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  CMutationOutTableInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  CMutationOutTableSetofInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  CMutationOutUnnamedInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  CMutationOutUnnamedOutOutUnnamedInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  CMutationReturnsTableMultiColInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  CMutationReturnsTableOneColInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  CMyTableCondition: {
    plans: {
      rowId($condition, val) {
        return applyAttributeCondition("id", TYPES.int, $condition, val);
      }
    }
  },
  CMyTableInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      jsonData(obj, val, {
        field,
        schema
      }) {
        obj.set("json_data", bakedInputRuntime(schema, field.type, val));
      },
      rowId(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  CMyTablePatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      jsonData(obj, val, {
        field,
        schema
      }) {
        obj.set("json_data", bakedInputRuntime(schema, field.type, val));
      },
      rowId(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  CNoArgsMutationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  CNullTestRecordCondition: {
    plans: {
      nonNullText($condition, val) {
        return applyAttributeCondition("non_null_text", TYPES.text, $condition, val);
      },
      nullableInt($condition, val) {
        return applyAttributeCondition("nullable_int", TYPES.int, $condition, val);
      },
      nullableText($condition, val) {
        return applyAttributeCondition("nullable_text", TYPES.text, $condition, val);
      },
      rowId($condition, val) {
        return applyAttributeCondition("id", TYPES.int, $condition, val);
      }
    }
  },
  CNullTestRecordInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      nonNullText(obj, val, {
        field,
        schema
      }) {
        obj.set("non_null_text", bakedInputRuntime(schema, field.type, val));
      },
      nullableInt(obj, val, {
        field,
        schema
      }) {
        obj.set("nullable_int", bakedInputRuntime(schema, field.type, val));
      },
      nullableText(obj, val, {
        field,
        schema
      }) {
        obj.set("nullable_text", bakedInputRuntime(schema, field.type, val));
      },
      rowId(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  CNullTestRecordPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      nonNullText(obj, val, {
        field,
        schema
      }) {
        obj.set("non_null_text", bakedInputRuntime(schema, field.type, val));
      },
      nullableInt(obj, val, {
        field,
        schema
      }) {
        obj.set("nullable_int", bakedInputRuntime(schema, field.type, val));
      },
      nullableText(obj, val, {
        field,
        schema
      }) {
        obj.set("nullable_text", bakedInputRuntime(schema, field.type, val));
      },
      rowId(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  ComptypeInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      isOptimised(obj, val, {
        field,
        schema
      }) {
        obj.set("is_optimised", bakedInputRuntime(schema, field.type, val));
      },
      schedule(obj, val, {
        field,
        schema
      }) {
        obj.set("schedule", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  CPersonCondition: {
    plans: {
      about($condition, val) {
        return applyAttributeCondition("about", TYPES.text, $condition, val);
      },
      createdAt($condition, val) {
        return applyAttributeCondition("created_at", TYPES.timestamp, $condition, val);
      },
      email($condition, val) {
        return applyAttributeCondition("email", bEmailCodec, $condition, val);
      },
      lastLoginFromIp($condition, val) {
        return applyAttributeCondition("last_login_from_ip", TYPES.inet, $condition, val);
      },
      lastLoginFromSubnet($condition, val) {
        return applyAttributeCondition("last_login_from_subnet", TYPES.cidr, $condition, val);
      },
      name($condition, val) {
        return applyAttributeCondition("person_full_name", TYPES.varchar, $condition, val);
      },
      rowId($condition, val) {
        return applyAttributeCondition("id", TYPES.int, $condition, val);
      },
      userMac($condition, val) {
        return applyAttributeCondition("user_mac", TYPES.macaddr, $condition, val);
      }
    }
  },
  CPersonInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      about(obj, val, {
        field,
        schema
      }) {
        obj.set("about", bakedInputRuntime(schema, field.type, val));
      },
      aliases(obj, val, {
        field,
        schema
      }) {
        obj.set("aliases", bakedInputRuntime(schema, field.type, val));
      },
      config(obj, val, {
        field,
        schema
      }) {
        obj.set("config", bakedInputRuntime(schema, field.type, val));
      },
      createdAt(obj, val, {
        field,
        schema
      }) {
        obj.set("created_at", bakedInputRuntime(schema, field.type, val));
      },
      email(obj, val, {
        field,
        schema
      }) {
        obj.set("email", bakedInputRuntime(schema, field.type, val));
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
      name(obj, val, {
        field,
        schema
      }) {
        obj.set("person_full_name", bakedInputRuntime(schema, field.type, val));
      },
      rowId(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      },
      site(obj, val, {
        field,
        schema
      }) {
        obj.set("site", bakedInputRuntime(schema, field.type, val));
      },
      userMac(obj, val, {
        field,
        schema
      }) {
        obj.set("user_mac", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  CPersonPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      about(obj, val, {
        field,
        schema
      }) {
        obj.set("about", bakedInputRuntime(schema, field.type, val));
      },
      aliases(obj, val, {
        field,
        schema
      }) {
        obj.set("aliases", bakedInputRuntime(schema, field.type, val));
      },
      config(obj, val, {
        field,
        schema
      }) {
        obj.set("config", bakedInputRuntime(schema, field.type, val));
      },
      createdAt(obj, val, {
        field,
        schema
      }) {
        obj.set("created_at", bakedInputRuntime(schema, field.type, val));
      },
      email(obj, val, {
        field,
        schema
      }) {
        obj.set("email", bakedInputRuntime(schema, field.type, val));
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
      name(obj, val, {
        field,
        schema
      }) {
        obj.set("person_full_name", bakedInputRuntime(schema, field.type, val));
      },
      rowId(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      },
      site(obj, val, {
        field,
        schema
      }) {
        obj.set("site", bakedInputRuntime(schema, field.type, val));
      },
      userMac(obj, val, {
        field,
        schema
      }) {
        obj.set("user_mac", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  CPersonSecretCondition: {
    plans: {
      personId($condition, val) {
        return applyAttributeCondition("person_id", TYPES.int, $condition, val);
      },
      secret($condition, val) {
        return applyAttributeCondition("sekrit", TYPES.text, $condition, val);
      }
    }
  },
  CPersonSecretInput: {
    baked: createObjectAndApplyChildren,
    plans: {
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
    }
  },
  CPersonSecretPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
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
    }
  },
  CreateBListInput: {
    plans: {
      bList: applyCreateFields,
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  CreateBTypeInput: {
    plans: {
      bType: applyCreateFields,
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  CreateBUpdatableViewInput: {
    plans: {
      bUpdatableView: applyCreateFields,
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  CreateCCompoundKeyInput: {
    plans: {
      cCompoundKey: applyCreateFields,
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  CreateCEdgeCaseInput: {
    plans: {
      cEdgeCase: applyCreateFields,
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  CreateCIssue756Input: {
    plans: {
      cIssue756: applyCreateFields,
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  CreateCLeftArmInput: {
    plans: {
      cLeftArm: applyCreateFields,
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  CreateCMyTableInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      cMyTable: applyCreateFields
    }
  },
  CreateCNullTestRecordInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      cNullTestRecord: applyCreateFields
    }
  },
  CreateCPersonInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      cPerson: applyCreateFields
    }
  },
  CreateCPersonSecretInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      cPersonSecret: applyCreateFields
    }
  },
  CreateDefaultValueInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      defaultValue: applyCreateFields
    }
  },
  CreateForeignKeyInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      foreignKey: applyCreateFields
    }
  },
  CreateInputInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      input: applyCreateFields
    }
  },
  CreateNoPrimaryKeyInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      noPrimaryKey: applyCreateFields
    }
  },
  CreatePatchInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      patch: applyCreateFields
    }
  },
  CreatePostInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      post: applyCreateFields
    }
  },
  CreateReservedInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      reserved: applyCreateFields
    }
  },
  CreateReservedInputRecordInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      reservedInputRecord: applyCreateFields
    }
  },
  CreateReservedPatchRecordInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      reservedPatchRecord: applyCreateFields
    }
  },
  CreateSimilarTable1Input: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      similarTable1: applyCreateFields
    }
  },
  CreateSimilarTable2Input: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      similarTable2: applyCreateFields
    }
  },
  CreateTestviewInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      testview: applyCreateFields
    }
  },
  CreateUniqueForeignKeyInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      uniqueForeignKey: applyCreateFields
    }
  },
  CreateViewTableInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      viewTable: applyCreateFields
    }
  },
  CTableMutationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  CTableSetMutationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  CTypesMutationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DefaultValueCondition: {
    plans: {
      nullValue($condition, val) {
        return applyAttributeCondition("null_value", TYPES.text, $condition, val);
      },
      rowId($condition, val) {
        return applyAttributeCondition("id", TYPES.int, $condition, val);
      }
    }
  },
  DefaultValueInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      nullValue(obj, val, {
        field,
        schema
      }) {
        obj.set("null_value", bakedInputRuntime(schema, field.type, val));
      },
      rowId(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  DefaultValuePatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      nullValue(obj, val, {
        field,
        schema
      }) {
        obj.set("null_value", bakedInputRuntime(schema, field.type, val));
      },
      rowId(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  DeleteBListByRowIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteBTypeByRowIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteCCompoundKeyByPersonId1AndPersonId2Input: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteCIssue756ByRowIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteCLeftArmByPersonIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteCLeftArmByRowIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteCMyTableByRowIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteCNullTestRecordByRowIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteCPersonByEmailInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteCPersonByRowIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteCPersonSecretByPersonIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteDefaultValueByRowIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteInputByRowIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteNoPrimaryKeyByRowIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeletePatchByRowIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeletePostByRowIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteReservedByRowIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteReservedInputRecordByRowIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteReservedPatchRecordByRowIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteSimilarTable1ByRowIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteSimilarTable2ByRowIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteUniqueForeignKeyByCompoundKey1AndCompoundKey2Input: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteViewTableByRowIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
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
      personId($condition, val) {
        return applyAttributeCondition("person_id", TYPES.int, $condition, val);
      }
    }
  },
  ForeignKeyInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      compoundKey1(obj, val, {
        field,
        schema
      }) {
        obj.set("compound_key_1", bakedInputRuntime(schema, field.type, val));
      },
      compoundKey2(obj, val, {
        field,
        schema
      }) {
        obj.set("compound_key_2", bakedInputRuntime(schema, field.type, val));
      },
      personId(obj, val, {
        field,
        schema
      }) {
        obj.set("person_id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  InputCondition: {
    plans: {
      rowId($condition, val) {
        return applyAttributeCondition("id", TYPES.int, $condition, val);
      }
    }
  },
  InputInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      rowId(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  InputPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      rowId(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  MutationCompoundTypeArrayInput: {
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
  MutationTextArrayInput: {
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
      rowId($condition, val) {
        return applyAttributeCondition("id", TYPES.int, $condition, val);
      },
      str($condition, val) {
        return applyAttributeCondition("str", TYPES.text, $condition, val);
      }
    }
  },
  NoPrimaryKeyInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      rowId(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      },
      str(obj, val, {
        field,
        schema
      }) {
        obj.set("str", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  NoPrimaryKeyPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      rowId(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      },
      str(obj, val, {
        field,
        schema
      }) {
        obj.set("str", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  PatchCondition: {
    plans: {
      rowId($condition, val) {
        return applyAttributeCondition("id", TYPES.int, $condition, val);
      }
    }
  },
  PatchInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      rowId(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  PatchPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      rowId(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      }
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
      headline($condition, val) {
        return applyAttributeCondition("headline", TYPES.text, $condition, val);
      },
      rowId($condition, val) {
        return applyAttributeCondition("id", TYPES.int, $condition, val);
      }
    }
  },
  PostInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      authorId(obj, val, {
        field,
        schema
      }) {
        obj.set("author_id", bakedInputRuntime(schema, field.type, val));
      },
      body(obj, val, {
        field,
        schema
      }) {
        obj.set("body", bakedInputRuntime(schema, field.type, val));
      },
      comptypes(obj, val, {
        field,
        schema
      }) {
        obj.set("comptypes", bakedInputRuntime(schema, field.type, val));
      },
      enums(obj, val, {
        field,
        schema
      }) {
        obj.set("enums", bakedInputRuntime(schema, field.type, val));
      },
      headline(obj, val, {
        field,
        schema
      }) {
        obj.set("headline", bakedInputRuntime(schema, field.type, val));
      },
      rowId(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      }
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
      authorId(obj, val, {
        field,
        schema
      }) {
        obj.set("author_id", bakedInputRuntime(schema, field.type, val));
      },
      body(obj, val, {
        field,
        schema
      }) {
        obj.set("body", bakedInputRuntime(schema, field.type, val));
      },
      comptypes(obj, val, {
        field,
        schema
      }) {
        obj.set("comptypes", bakedInputRuntime(schema, field.type, val));
      },
      enums(obj, val, {
        field,
        schema
      }) {
        obj.set("enums", bakedInputRuntime(schema, field.type, val));
      },
      headline(obj, val, {
        field,
        schema
      }) {
        obj.set("headline", bakedInputRuntime(schema, field.type, val));
      },
      rowId(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  PostWithSuffixInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  ReservedCondition: {
    plans: {
      rowId($condition, val) {
        return applyAttributeCondition("id", TYPES.int, $condition, val);
      }
    }
  },
  ReservedInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      rowId(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  ReservedInputRecordCondition: {
    plans: {
      rowId($condition, val) {
        return applyAttributeCondition("id", TYPES.int, $condition, val);
      }
    }
  },
  ReservedInputRecordInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      rowId(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  ReservedInputRecordPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      rowId(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  ReservedPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      rowId(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  ReservedPatchRecordCondition: {
    plans: {
      rowId($condition, val) {
        return applyAttributeCondition("id", TYPES.int, $condition, val);
      }
    }
  },
  ReservedPatchRecordInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      rowId(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  ReservedPatchRecordPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      rowId(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  ReturnVoidMutationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  SimilarTable1Condition: {
    plans: {
      col1($condition, val) {
        return applyAttributeCondition("col1", TYPES.int, $condition, val);
      },
      col2($condition, val) {
        return applyAttributeCondition("col2", TYPES.int, $condition, val);
      },
      col3($condition, val) {
        return applyAttributeCondition("col3", TYPES.int, $condition, val);
      },
      rowId($condition, val) {
        return applyAttributeCondition("id", TYPES.int, $condition, val);
      }
    }
  },
  SimilarTable1Input: {
    baked: createObjectAndApplyChildren,
    plans: {
      col1(obj, val, {
        field,
        schema
      }) {
        obj.set("col1", bakedInputRuntime(schema, field.type, val));
      },
      col2(obj, val, {
        field,
        schema
      }) {
        obj.set("col2", bakedInputRuntime(schema, field.type, val));
      },
      col3(obj, val, {
        field,
        schema
      }) {
        obj.set("col3", bakedInputRuntime(schema, field.type, val));
      },
      rowId(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  SimilarTable1Patch: {
    baked: createObjectAndApplyChildren,
    plans: {
      col1(obj, val, {
        field,
        schema
      }) {
        obj.set("col1", bakedInputRuntime(schema, field.type, val));
      },
      col2(obj, val, {
        field,
        schema
      }) {
        obj.set("col2", bakedInputRuntime(schema, field.type, val));
      },
      col3(obj, val, {
        field,
        schema
      }) {
        obj.set("col3", bakedInputRuntime(schema, field.type, val));
      },
      rowId(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  SimilarTable2Condition: {
    plans: {
      col3($condition, val) {
        return applyAttributeCondition("col3", TYPES.int, $condition, val);
      },
      col4($condition, val) {
        return applyAttributeCondition("col4", TYPES.int, $condition, val);
      },
      col5($condition, val) {
        return applyAttributeCondition("col5", TYPES.int, $condition, val);
      },
      rowId($condition, val) {
        return applyAttributeCondition("id", TYPES.int, $condition, val);
      }
    }
  },
  SimilarTable2Input: {
    baked: createObjectAndApplyChildren,
    plans: {
      col3(obj, val, {
        field,
        schema
      }) {
        obj.set("col3", bakedInputRuntime(schema, field.type, val));
      },
      col4(obj, val, {
        field,
        schema
      }) {
        obj.set("col4", bakedInputRuntime(schema, field.type, val));
      },
      col5(obj, val, {
        field,
        schema
      }) {
        obj.set("col5", bakedInputRuntime(schema, field.type, val));
      },
      rowId(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  SimilarTable2Patch: {
    baked: createObjectAndApplyChildren,
    plans: {
      col3(obj, val, {
        field,
        schema
      }) {
        obj.set("col3", bakedInputRuntime(schema, field.type, val));
      },
      col4(obj, val, {
        field,
        schema
      }) {
        obj.set("col4", bakedInputRuntime(schema, field.type, val));
      },
      col5(obj, val, {
        field,
        schema
      }) {
        obj.set("col5", bakedInputRuntime(schema, field.type, val));
      },
      rowId(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  TestviewCondition: {
    plans: {
      col1($condition, val) {
        return applyAttributeCondition("col1", TYPES.int, $condition, val);
      },
      col2($condition, val) {
        return applyAttributeCondition("col2", TYPES.int, $condition, val);
      },
      testviewid($condition, val) {
        return applyAttributeCondition("testviewid", TYPES.int, $condition, val);
      }
    }
  },
  TestviewInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      col1(obj, val, {
        field,
        schema
      }) {
        obj.set("col1", bakedInputRuntime(schema, field.type, val));
      },
      col2(obj, val, {
        field,
        schema
      }) {
        obj.set("col2", bakedInputRuntime(schema, field.type, val));
      },
      testviewid(obj, val, {
        field,
        schema
      }) {
        obj.set("testviewid", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  UniqueForeignKeyCondition: {
    plans: {
      compoundKey1($condition, val) {
        return applyAttributeCondition("compound_key_1", TYPES.int, $condition, val);
      },
      compoundKey2($condition, val) {
        return applyAttributeCondition("compound_key_2", TYPES.int, $condition, val);
      }
    }
  },
  UniqueForeignKeyInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      compoundKey1(obj, val, {
        field,
        schema
      }) {
        obj.set("compound_key_1", bakedInputRuntime(schema, field.type, val));
      },
      compoundKey2(obj, val, {
        field,
        schema
      }) {
        obj.set("compound_key_2", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  UniqueForeignKeyPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      compoundKey1(obj, val, {
        field,
        schema
      }) {
        obj.set("compound_key_1", bakedInputRuntime(schema, field.type, val));
      },
      compoundKey2(obj, val, {
        field,
        schema
      }) {
        obj.set("compound_key_2", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  UpdateBListByRowIdInput: {
    plans: {
      bListPatch: applyPatchFields,
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  UpdateBTypeByRowIdInput: {
    plans: {
      bTypePatch: applyPatchFields,
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  UpdateCCompoundKeyByPersonId1AndPersonId2Input: {
    plans: {
      cCompoundKeyPatch: applyPatchFields,
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  UpdateCIssue756ByRowIdInput: {
    plans: {
      cIssue756Patch: applyPatchFields,
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  UpdateCLeftArmByPersonIdInput: {
    plans: {
      cLeftArmPatch: applyPatchFields,
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  UpdateCLeftArmByRowIdInput: {
    plans: {
      cLeftArmPatch: applyPatchFields,
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  UpdateCMyTableByRowIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      cMyTablePatch: applyPatchFields
    }
  },
  UpdateCNullTestRecordByRowIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      cNullTestRecordPatch: applyPatchFields
    }
  },
  UpdateCPersonByEmailInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      cPersonPatch: applyPatchFields
    }
  },
  UpdateCPersonByRowIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      cPersonPatch: applyPatchFields
    }
  },
  UpdateCPersonSecretByPersonIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      cPersonSecretPatch: applyPatchFields
    }
  },
  UpdateDefaultValueByRowIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      defaultValuePatch: applyPatchFields
    }
  },
  UpdateInputByRowIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      inputPatch: applyPatchFields
    }
  },
  UpdateNoPrimaryKeyByRowIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      noPrimaryKeyPatch: applyPatchFields
    }
  },
  UpdatePatchByRowIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      patchPatch: applyPatchFields
    }
  },
  UpdatePostByRowIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      postPatch: applyPatchFields
    }
  },
  UpdateReservedByRowIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      reservedPatch: applyPatchFields
    }
  },
  UpdateReservedInputRecordByRowIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      reservedInputRecordPatch: applyPatchFields
    }
  },
  UpdateReservedPatchRecordByRowIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      reservedPatchRecordPatch: applyPatchFields
    }
  },
  UpdateSimilarTable1ByRowIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      similarTable1Patch: applyPatchFields
    }
  },
  UpdateSimilarTable2ByRowIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      similarTable2Patch: applyPatchFields
    }
  },
  UpdateUniqueForeignKeyByCompoundKey1AndCompoundKey2Input: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      uniqueForeignKeyPatch: applyPatchFields
    }
  },
  UpdateViewTableByRowIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      viewTablePatch: applyPatchFields
    }
  },
  ViewTableCondition: {
    plans: {
      col1($condition, val) {
        return applyAttributeCondition("col1", TYPES.int, $condition, val);
      },
      col2($condition, val) {
        return applyAttributeCondition("col2", TYPES.int, $condition, val);
      },
      rowId($condition, val) {
        return applyAttributeCondition("id", TYPES.int, $condition, val);
      }
    }
  },
  ViewTableInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      col1(obj, val, {
        field,
        schema
      }) {
        obj.set("col1", bakedInputRuntime(schema, field.type, val));
      },
      col2(obj, val, {
        field,
        schema
      }) {
        obj.set("col2", bakedInputRuntime(schema, field.type, val));
      },
      rowId(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  ViewTablePatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      col1(obj, val, {
        field,
        schema
      }) {
        obj.set("col1", bakedInputRuntime(schema, field.type, val));
      },
      col2(obj, val, {
        field,
        schema
      }) {
        obj.set("col2", bakedInputRuntime(schema, field.type, val));
      },
      rowId(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
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
  BAnotherInt: {
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
  BEmail: {
    serialize: GraphQLString.serialize,
    parseValue: GraphQLString.parseValue,
    parseLiteral: GraphQLString.parseLiteral
  },
  BGuid: {
    serialize: GraphQLString.serialize,
    parseValue: GraphQLString.parseValue,
    parseLiteral: GraphQLString.parseLiteral
  },
  BigFloat: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`${"BigFloat" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
    }
  },
  BigInt: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`${"BigInt" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
    }
  },
  BNotNullUrl: {
    serialize: GraphQLString.serialize,
    parseValue: GraphQLString.parseValue,
    parseLiteral: GraphQLString.parseLiteral
  },
  CidrAddress: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`${"CidrAddress" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
    }
  },
  CNotNullTimestamp: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`${"Datetime" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
    }
  },
  Cursor: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`${"Cursor" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
    }
  },
  Date: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`${"Date" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
    }
  },
  Datetime: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`${"Datetime" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
    }
  },
  InternetAddress: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`${"InternetAddress" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
    }
  },
  JSON: {
    serialize(value) {
      return value;
    },
    parseValue(value) {
      return value;
    },
    parseLiteral: (() => {
      const parseLiteralToObject = (ast, variables) => {
        switch (ast.kind) {
          case Kind.STRING:
          case Kind.BOOLEAN:
            return ast.value;
          case Kind.INT:
          case Kind.FLOAT:
            return parseFloat(ast.value);
          case Kind.OBJECT:
            {
              const value = Object.create(null);
              ast.fields.forEach(field => {
                value[field.name.value] = parseLiteralToObject(field.value, variables);
              });
              return value;
            }
          case Kind.LIST:
            return ast.values.map(n => parseLiteralToObject(n, variables));
          case Kind.NULL:
            return null;
          case Kind.VARIABLE:
            {
              const name = ast.name.value;
              return variables ? variables[name] : undefined;
            }
          default:
            return undefined;
        }
      };
      return parseLiteralToObject;
    })()
  },
  JSONPath: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`${"JSONPath" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
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
  LTree: {
    serialize(x) {
      return x;
    },
    parseValue: LTreeParseValue,
    parseLiteral(node, variables) {
      return LTreeParseValue(valueFromASTUntyped(node, variables));
    }
  },
  MacAddress: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`${"MacAddress" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
    }
  },
  RegClass: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`${"RegClass" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
    }
  },
  RegConfig: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`${"RegConfig" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
    }
  },
  RegDictionary: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`${"RegDictionary" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
    }
  },
  RegOper: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`${"RegOper" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
    }
  },
  RegOperator: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`${"RegOperator" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
    }
  },
  RegProc: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`${"RegProc" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
    }
  },
  RegProcedure: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`${"RegProcedure" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
    }
  },
  RegType: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`${"RegType" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
    }
  },
  Time: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`${"Time" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
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
      throw new GraphQLError(`${"UUID" ?? "This scalar"} can only parse string values (kind = '${ast.kind}')`);
    }
  }
};
export const enums = {
  AnEnum: {
    values: {
      _ASTERISK_bar_: {
        value: "_*bar_"
      },
      _ASTERISK_baz_ASTERISK_: {
        value: "_*baz*_"
      },
      _foo_ASTERISK: {
        value: "_foo*"
      },
      ASTERISK: {
        value: "*"
      },
      ASTERISK__ASTERISK: {
        value: "**"
      },
      ASTERISK__ASTERISK__ASTERISK: {
        value: "***"
      },
      ASTERISK_bar: {
        value: "*bar"
      },
      ASTERISK_bar_: {
        value: "*bar_"
      },
      ASTERISK_baz_ASTERISK: {
        value: "*baz*"
      },
      DOLLAR: {
        value: "$"
      },
      foo_ASTERISK: {
        value: "foo*"
      },
      foo_ASTERISK_: {
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
      }
    }
  },
  BEnumCaps: {
    values: {
      _0_BAR: {
        value: "0_BAR"
      }
    }
  },
  BEnumWithEmptyString: {
    values: {
      _EMPTY_: {
        value: ""
      }
    }
  },
  BListOrderBy: {
    values: {
      PRIMARY_KEY_ASC(queryBuilder) {
        b_listsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        b_listsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      ROW_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      ROW_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
      }
    }
  },
  BTypeOrderBy: {
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
      PRIMARY_KEY_ASC(queryBuilder) {
        b_typesUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        b_typesUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      ROW_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      ROW_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
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
  BUpdatableViewOrderBy: {
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
      },
      X_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "x",
          direction: "DESC"
        });
      }
    }
  },
  CCompoundKeyOrderBy: {
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
        c_compound_keyUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        c_compound_keyUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      }
    }
  },
  CEdgeCaseOrderBy: {
    values: {
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
  CIssue756OrderBy: {
    values: {
      PRIMARY_KEY_ASC(queryBuilder) {
        c_issue756Uniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        c_issue756Uniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      ROW_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      ROW_ID_DESC(queryBuilder) {
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
    }
  },
  CLeftArmOrderBy: {
    values: {
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
      PRIMARY_KEY_ASC(queryBuilder) {
        c_left_armUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        c_left_armUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      ROW_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      ROW_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
      }
    }
  },
  CMyTableOrderBy: {
    values: {
      PRIMARY_KEY_ASC(queryBuilder) {
        c_my_tableUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        c_my_tableUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      ROW_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      ROW_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
      }
    }
  },
  CNullTestRecordOrderBy: {
    values: {
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
        c_null_test_recordUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        c_null_test_recordUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      ROW_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      ROW_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
      }
    }
  },
  CPersonOrderBy: {
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
        c_personUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        c_personUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      ROW_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      ROW_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
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
  CPersonSecretOrderBy: {
    values: {
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
      PRIMARY_KEY_ASC(queryBuilder) {
        c_person_secretUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        c_person_secretUniques[0].attributes.forEach(attributeName => {
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
  DefaultValueOrderBy: {
    values: {
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
      },
      ROW_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      ROW_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
      }
    }
  },
  ForeignKeyOrderBy: {
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
  InputOrderBy: {
    values: {
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
      },
      ROW_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      ROW_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
      }
    }
  },
  NonUpdatableViewOrderBy: {
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
  NoPrimaryKeyOrderBy: {
    values: {
      ROW_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      ROW_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
      },
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
  PatchOrderBy: {
    values: {
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
      },
      ROW_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      ROW_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
      }
    }
  },
  PostOrderBy: {
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
      },
      ROW_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      ROW_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
      }
    }
  },
  ReservedInputRecordOrderBy: {
    values: {
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
      },
      ROW_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      ROW_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
      }
    }
  },
  ReservedOrderBy: {
    values: {
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
      },
      ROW_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      ROW_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
      }
    }
  },
  ReservedPatchRecordOrderBy: {
    values: {
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
      },
      ROW_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      ROW_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
      }
    }
  },
  SimilarTable1OrderBy: {
    values: {
      COL1_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col1",
          direction: "ASC"
        });
      },
      COL1_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col1",
          direction: "DESC"
        });
      },
      COL2_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col2",
          direction: "ASC"
        });
      },
      COL2_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col2",
          direction: "DESC"
        });
      },
      COL3_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col3",
          direction: "ASC"
        });
      },
      COL3_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col3",
          direction: "DESC"
        });
      },
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
      },
      ROW_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      ROW_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
      }
    }
  },
  SimilarTable2OrderBy: {
    values: {
      COL3_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col3",
          direction: "ASC"
        });
      },
      COL3_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col3",
          direction: "DESC"
        });
      },
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
      },
      ROW_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      ROW_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
      }
    }
  },
  TestviewOrderBy: {
    values: {
      COL1_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col1",
          direction: "ASC"
        });
      },
      COL1_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col1",
          direction: "DESC"
        });
      },
      COL2_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col2",
          direction: "ASC"
        });
      },
      COL2_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col2",
          direction: "DESC"
        });
      },
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
  UniqueForeignKeyOrderBy: {
    values: {
      COMPOUND_KEY_1_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "compound_key_1",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      COMPOUND_KEY_1_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "compound_key_1",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
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
      }
    }
  },
  ViewTableOrderBy: {
    values: {
      COL1_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col1",
          direction: "ASC"
        });
      },
      COL1_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col1",
          direction: "DESC"
        });
      },
      COL2_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col2",
          direction: "ASC"
        });
      },
      COL2_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col2",
          direction: "DESC"
        });
      },
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
      },
      ROW_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      ROW_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
      }
    }
  }
};
export const schema = makeGrafastSchema({
  typeDefs: typeDefs,
  objects: objects,
  inputObjects: inputObjects,
  scalars: scalars,
  enums: enums
});
