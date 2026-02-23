import { LIST_TYPES, PgDeleteSingleStep, PgExecutor, PgResource, PgSelectSingleStep, PgSelectStep, TYPES, assertPgClassSingleStep, domainOfCodec, enumCodec, listOfCodec, makeRegistry, pgClassExpression, pgDeleteSingle, pgFromExpression, pgInsertSingle, pgSelectFromRecord, pgSelectFromRecords, pgSelectSingleFromRecord, pgUpdateSingle, rangeOfCodec, recordCodec, sqlFromArgDigests, sqlValueWithCodec } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ObjectStep, __ValueStep, access, assertStep, bakedInput, bakedInputRuntime, connection, constant, context, createObjectAndApplyChildren, first, get as get2, inhibitOnNull, inspect, lambda, list, makeDecodeNodeId, makeGrafastSchema, object, operationPlan, rootValue, specFromNodeId, stepAMayDependOnStepB, trap } from "grafast";
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
const registryConfig_pgCodecs_FuncOutOutRecord_FuncOutOutRecord = recordCodec({
  name: "FuncOutOutRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: {
    first_out: {
      codec: TYPES.int
    },
    second_out: {
      codec: TYPES.text
    }
  },
  executor,
  isAnonymous: true
});
const registryConfig_pgCodecs_FuncOutOutSetofRecord_FuncOutOutSetofRecord = recordCodec({
  name: "FuncOutOutSetofRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: {
    o1: {
      codec: TYPES.int
    },
    o2: {
      codec: TYPES.text
    }
  },
  executor,
  isAnonymous: true
});
const registryConfig_pgCodecs_FuncOutOutUnnamedRecord_FuncOutOutUnnamedRecord = recordCodec({
  name: "FuncOutOutUnnamedRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: {
    column1: {
      codec: TYPES.int
    },
    column2: {
      codec: TYPES.text
    }
  },
  executor,
  isAnonymous: true
});
const registryConfig_pgCodecs_MutationOutOutRecord_MutationOutOutRecord = recordCodec({
  name: "MutationOutOutRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: {
    first_out: {
      codec: TYPES.int
    },
    second_out: {
      codec: TYPES.text
    }
  },
  executor,
  isAnonymous: true
});
const registryConfig_pgCodecs_MutationOutOutSetofRecord_MutationOutOutSetofRecord = recordCodec({
  name: "MutationOutOutSetofRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: {
    o1: {
      codec: TYPES.int
    },
    o2: {
      codec: TYPES.text
    }
  },
  executor,
  isAnonymous: true
});
const registryConfig_pgCodecs_MutationOutOutUnnamedRecord_MutationOutOutUnnamedRecord = recordCodec({
  name: "MutationOutOutUnnamedRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: {
    column1: {
      codec: TYPES.int
    },
    column2: {
      codec: TYPES.text
    }
  },
  executor,
  isAnonymous: true
});
const registryConfig_pgCodecs_SearchTestSummariesRecord_SearchTestSummariesRecord = recordCodec({
  name: "SearchTestSummariesRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: {
    id: {
      codec: TYPES.int
    },
    total_duration: {
      codec: TYPES.interval
    }
  },
  executor,
  isAnonymous: true
});
const registryConfig_pgCodecs_FuncOutUnnamedOutOutUnnamedRecord_FuncOutUnnamedOutOutUnnamedRecord = recordCodec({
  name: "FuncOutUnnamedOutOutUnnamedRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: {
    column1: {
      codec: TYPES.int
    },
    o2: {
      codec: TYPES.text
    },
    column3: {
      codec: TYPES.int
    }
  },
  executor,
  isAnonymous: true
});
const registryConfig_pgCodecs_MutationOutUnnamedOutOutUnnamedRecord_MutationOutUnnamedOutOutUnnamedRecord = recordCodec({
  name: "MutationOutUnnamedOutOutUnnamedRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: {
    column1: {
      codec: TYPES.int
    },
    o2: {
      codec: TYPES.text
    },
    column3: {
      codec: TYPES.int
    }
  },
  executor,
  isAnonymous: true
});
const registryConfig_pgCodecs_MutationReturnsTableMultiColRecord_MutationReturnsTableMultiColRecord = recordCodec({
  name: "MutationReturnsTableMultiColRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: {
    col1: {
      codec: TYPES.int
    },
    col2: {
      codec: TYPES.text
    }
  },
  executor,
  isAnonymous: true
});
const registryConfig_pgCodecs_FuncReturnsTableMultiColRecord_FuncReturnsTableMultiColRecord = recordCodec({
  name: "FuncReturnsTableMultiColRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: {
    col1: {
      codec: TYPES.int
    },
    col2: {
      codec: TYPES.text
    }
  },
  executor,
  isAnonymous: true
});
const guidCodec = domainOfCodec(TYPES.varchar, "guid", sql.identifier("b", "guid"), {
  extensions: {}
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
  extensions: {},
  executor: executor
});
const inputsIdentifier = sql.identifier("a", "inputs");
const inputsCodec = recordCodec({
  name: "inputs",
  identifier: inputsIdentifier,
  attributes: {
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    }
  },
  extensions: {},
  executor: executor,
  description: "Should output as Input"
});
const patchsIdentifier = sql.identifier("a", "patchs");
const patchsCodec = recordCodec({
  name: "patchs",
  identifier: patchsIdentifier,
  attributes: {
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    }
  },
  extensions: {},
  executor: executor,
  description: "Should output as Patch"
});
const reservedIdentifier = sql.identifier("a", "reserved");
const reservedCodec = recordCodec({
  name: "reserved",
  identifier: reservedIdentifier,
  attributes: {
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    }
  },
  extensions: {},
  executor: executor
});
const reservedPatchsIdentifier = sql.identifier("a", "reservedPatchs");
const reservedPatchsCodec = recordCodec({
  name: "reservedPatchs",
  identifier: reservedPatchsIdentifier,
  attributes: {
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    }
  },
  extensions: {},
  executor: executor,
  description: "`reservedPatchs` table should get renamed to ReservedPatchRecord to prevent clashes with ReservedPatch from `reserved` table"
});
const reservedInputIdentifier = sql.identifier("a", "reserved_input");
const reservedInputCodec = recordCodec({
  name: "reservedInput",
  identifier: reservedInputIdentifier,
  attributes: {
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    }
  },
  extensions: {},
  executor: executor,
  description: "`reserved_input` table should get renamed to ReservedInputRecord to prevent clashes with ReservedInput from `reserved` table"
});
const defaultValueIdentifier = sql.identifier("a", "default_value");
const defaultValueCodec = recordCodec({
  name: "defaultValue",
  identifier: defaultValueIdentifier,
  attributes: {
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
  extensions: {},
  executor: executor
});
const foreignKeyIdentifier = sql.identifier("a", "foreign_key");
const foreignKeyCodec = recordCodec({
  name: "foreignKey",
  identifier: foreignKeyIdentifier,
  attributes: {
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
  extensions: {},
  executor: executor
});
const noPrimaryKeyIdentifier = sql.identifier("a", "no_primary_key");
const noPrimaryKeyCodec = recordCodec({
  name: "noPrimaryKey",
  identifier: noPrimaryKeyIdentifier,
  attributes: {
    id: {
      codec: TYPES.int,
      notNull: true
    },
    str: {
      codec: TYPES.text,
      notNull: true
    }
  },
  extensions: {},
  executor: executor
});
const testviewIdentifier = sql.identifier("a", "testview");
const testviewCodec = recordCodec({
  name: "testview",
  identifier: testviewIdentifier,
  attributes: {
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
  extensions: {},
  executor: executor
});
const uniqueForeignKeyIdentifier = sql.identifier("a", "unique_foreign_key");
const uniqueForeignKeyCodec = recordCodec({
  name: "uniqueForeignKey",
  identifier: uniqueForeignKeyIdentifier,
  attributes: {
    compound_key_1: {
      codec: TYPES.int
    },
    compound_key_2: {
      codec: TYPES.int
    }
  },
  extensions: {},
  executor: executor
});
const myTableIdentifier = sql.identifier("c", "my_table");
const myTableCodec = recordCodec({
  name: "myTable",
  identifier: myTableIdentifier,
  attributes: {
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    json_data: {
      codec: TYPES.jsonb
    }
  },
  extensions: {},
  executor: executor
});
const personSecretIdentifier = sql.identifier("c", "person_secret");
const personSecretCodec = recordCodec({
  name: "personSecret",
  identifier: personSecretIdentifier,
  attributes: {
    person_id: {
      codec: TYPES.int,
      notNull: true
    },
    sekrit: {
      codec: TYPES.text,
      description: "A secret held by the associated Person"
    }
  },
  extensions: {},
  executor: executor,
  description: "Tracks the person's secret"
});
const unloggedIdentifier = sql.identifier("c", "unlogged");
const unloggedCodec = recordCodec({
  name: "unlogged",
  identifier: unloggedIdentifier,
  attributes: {
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    nonsense: {
      codec: TYPES.text
    }
  },
  extensions: {},
  executor: executor
});
const viewTableIdentifier = sql.identifier("a", "view_table");
const viewTableCodec = recordCodec({
  name: "viewTable",
  identifier: viewTableIdentifier,
  attributes: {
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
  extensions: {},
  executor: executor
});
const compoundKeyIdentifier = sql.identifier("c", "compound_key");
const compoundKeyCodec = recordCodec({
  name: "compoundKey",
  identifier: compoundKeyIdentifier,
  attributes: {
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
  extensions: {},
  executor: executor
});
const similarTable1Identifier = sql.identifier("a", "similar_table_1");
const similarTable1Codec = recordCodec({
  name: "similarTable1",
  identifier: similarTable1Identifier,
  attributes: {
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
  extensions: {},
  executor: executor
});
const similarTable2Identifier = sql.identifier("a", "similar_table_2");
const similarTable2Codec = recordCodec({
  name: "similarTable2",
  identifier: similarTable2Identifier,
  attributes: {
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
  extensions: {},
  executor: executor
});
const updatableViewIdentifier = sql.identifier("b", "updatable_view");
const updatableViewCodec = recordCodec({
  name: "updatableView",
  identifier: updatableViewIdentifier,
  attributes: {
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
  extensions: {},
  executor: executor,
  description: "YOYOYO!!"
});
const nullTestRecordIdentifier = sql.identifier("c", "null_test_record");
const nullTestRecordCodec = recordCodec({
  name: "nullTestRecord",
  identifier: nullTestRecordIdentifier,
  attributes: {
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
  extensions: {},
  executor: executor
});
const edgeCaseIdentifier = sql.identifier("c", "edge_case");
const edgeCaseCodec = recordCodec({
  name: "edgeCase",
  identifier: edgeCaseIdentifier,
  attributes: {
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
  extensions: {},
  executor: executor
});
const leftArmIdentifier = sql.identifier("c", "left_arm");
const leftArmCodec = recordCodec({
  name: "leftArm",
  identifier: leftArmIdentifier,
  attributes: {
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
  extensions: {},
  executor: executor,
  description: "Tracks metadata about the left arms of various people"
});
const jwtTokenIdentifier = sql.identifier("b", "jwt_token");
const jwtTokenCodec = recordCodec({
  name: "jwtToken",
  identifier: jwtTokenIdentifier,
  attributes: {
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
  extensions: {},
  executor: executor
});
const issue756Identifier = sql.identifier("c", "issue756");
const notNullTimestampCodec = domainOfCodec(TYPES.timestamptz, "notNullTimestamp", sql.identifier("c", "not_null_timestamp"), {
  extensions: {},
  notNull: true
});
const issue756Codec = recordCodec({
  name: "issue756",
  identifier: issue756Identifier,
  attributes: {
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
  extensions: {},
  executor: executor
});
const authPayloadIdentifier = sql.identifier("b", "auth_payload");
const authPayloadCodec = recordCodec({
  name: "authPayload",
  identifier: authPayloadIdentifier,
  attributes: {
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
  extensions: {},
  executor: executor
});
const postIdentifier = sql.identifier("a", "post");
const anEnumCodec = enumCodec({
  name: "anEnum",
  identifier: sql.identifier("a", "an_enum"),
  values: ["awaiting", "rejected", "published", "*", "**", "***", "foo*", "foo*_", "_foo*", "*bar", "*bar_", "_*bar_", "*baz*", "_*baz*_", "%", ">=", "~~", "$"],
  description: undefined,
  extensions: {}
});
const anEnumArrayCodec = listOfCodec(anEnumCodec, {
  name: "anEnumArray",
  extensions: {}
});
const comptypeCodec = recordCodec({
  name: "comptype",
  identifier: sql.identifier("a", "comptype"),
  attributes: {
    schedule: {
      codec: TYPES.timestamptz
    },
    is_optimised: {
      codec: TYPES.boolean
    }
  },
  extensions: {},
  executor: executor
});
const comptypeArrayCodec = listOfCodec(comptypeCodec, {
  name: "comptypeArray",
  extensions: {}
});
const postCodec = recordCodec({
  name: "post",
  identifier: postIdentifier,
  attributes: {
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
  extensions: {},
  executor: executor
});
const registryConfig_pgCodecs_QueryOutputTwoRowsRecord_QueryOutputTwoRowsRecord = recordCodec({
  name: "QueryOutputTwoRowsRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: {
    txt: {
      codec: TYPES.text
    },
    left_arm: {
      codec: leftArmCodec
    },
    post: {
      codec: postCodec
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
  extensions: {}
});
const enumCapsCodec = enumCodec({
  name: "enumCaps",
  identifier: sql.identifier("b", "enum_caps"),
  values: ["FOO_BAR", "BAR_FOO", "BAZ_QUX", "0_BAR"],
  description: undefined,
  extensions: {}
});
const enumWithEmptyStringCodec = enumCodec({
  name: "enumWithEmptyString",
  identifier: sql.identifier("b", "enum_with_empty_string"),
  values: ["", "one", "two"],
  description: undefined,
  extensions: {}
});
const compoundTypeCodec = recordCodec({
  name: "compoundType",
  identifier: compoundTypeIdentifier,
  attributes: {
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
  extensions: {},
  executor: executor,
  description: "Awesome feature!"
});
const registryConfig_pgCodecs_FuncOutOutCompoundTypeRecord_FuncOutOutCompoundTypeRecord = recordCodec({
  name: "FuncOutOutCompoundTypeRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: {
    o1: {
      codec: TYPES.int
    },
    o2: {
      codec: compoundTypeCodec
    }
  },
  executor,
  isAnonymous: true
});
const registryConfig_pgCodecs_MutationOutOutCompoundTypeRecord_MutationOutOutCompoundTypeRecord = recordCodec({
  name: "MutationOutOutCompoundTypeRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: {
    o1: {
      codec: TYPES.int
    },
    o2: {
      codec: compoundTypeCodec
    }
  },
  executor,
  isAnonymous: true
});
const registryConfig_pgCodecs_PersonComputedOutOutRecord_PersonComputedOutOutRecord = recordCodec({
  name: "PersonComputedOutOutRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: {
    o1: {
      codec: TYPES.text
    },
    o2: {
      codec: TYPES.text
    }
  },
  executor,
  isAnonymous: true
});
const registryConfig_pgCodecs_PersonComputedInoutOutRecord_PersonComputedInoutOutRecord = recordCodec({
  name: "PersonComputedInoutOutRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: {
    ino: {
      codec: TYPES.text
    },
    o: {
      codec: TYPES.text
    }
  },
  executor,
  isAnonymous: true
});
const personIdentifier = sql.identifier("c", "person");
const emailCodec = domainOfCodec(TYPES.text, "email", sql.identifier("b", "email"), {
  extensions: {}
});
const notNullUrlCodec = domainOfCodec(TYPES.varchar, "notNullUrl", sql.identifier("b", "not_null_url"), {
  extensions: {},
  notNull: true
});
const wrappedUrlCodec = recordCodec({
  name: "wrappedUrl",
  identifier: sql.identifier("b", "wrapped_url"),
  attributes: {
    url: {
      codec: notNullUrlCodec,
      notNull: true
    }
  },
  extensions: {},
  executor: executor
});
const personCodec = recordCodec({
  name: "person",
  identifier: personIdentifier,
  attributes: {
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      description: "The primary unique identifier for the person"
    },
    person_full_name: {
      codec: TYPES.varchar,
      notNull: true,
      description: "The person\u2019s name"
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
      codec: wrappedUrlCodec
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
  extensions: {},
  executor: executor,
  description: "Person test comment"
});
const registryConfig_pgCodecs_PersonComputedFirstArgInoutOutRecord_PersonComputedFirstArgInoutOutRecord = recordCodec({
  name: "PersonComputedFirstArgInoutOutRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: {
    person: {
      codec: personCodec
    },
    o: {
      codec: TYPES.int
    }
  },
  executor,
  isAnonymous: true
});
const registryConfig_pgCodecs_FuncOutComplexRecord_FuncOutComplexRecord = recordCodec({
  name: "FuncOutComplexRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: {
    x: {
      codec: TYPES.int
    },
    y: {
      codec: compoundTypeCodec
    },
    z: {
      codec: personCodec
    }
  },
  executor,
  isAnonymous: true
});
const registryConfig_pgCodecs_FuncOutComplexSetofRecord_FuncOutComplexSetofRecord = recordCodec({
  name: "FuncOutComplexSetofRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: {
    x: {
      codec: TYPES.int
    },
    y: {
      codec: compoundTypeCodec
    },
    z: {
      codec: personCodec
    }
  },
  executor,
  isAnonymous: true
});
const registryConfig_pgCodecs_MutationOutComplexRecord_MutationOutComplexRecord = recordCodec({
  name: "MutationOutComplexRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: {
    x: {
      codec: TYPES.int
    },
    y: {
      codec: compoundTypeCodec
    },
    z: {
      codec: personCodec
    }
  },
  executor,
  isAnonymous: true
});
const registryConfig_pgCodecs_MutationOutComplexSetofRecord_MutationOutComplexSetofRecord = recordCodec({
  name: "MutationOutComplexSetofRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: {
    x: {
      codec: TYPES.int
    },
    y: {
      codec: compoundTypeCodec
    },
    z: {
      codec: personCodec
    }
  },
  executor,
  isAnonymous: true
});
const registryConfig_pgCodecs_PersonComputedComplexRecord_PersonComputedComplexRecord = recordCodec({
  name: "PersonComputedComplexRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: {
    x: {
      codec: TYPES.int
    },
    y: {
      codec: compoundTypeCodec
    },
    z: {
      codec: personCodec
    }
  },
  executor,
  isAnonymous: true
});
const listsIdentifier = sql.identifier("b", "lists");
const colorArrayCodec = listOfCodec(colorCodec, {
  name: "colorArray",
  extensions: {}
});
const compoundTypeArrayCodec = listOfCodec(compoundTypeCodec, {
  name: "compoundTypeArray",
  extensions: {}
});
const listsCodec = recordCodec({
  name: "lists",
  identifier: listsIdentifier,
  attributes: {
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
  extensions: {},
  executor: executor
});
const typesIdentifier = sql.identifier("b", "types");
const anIntCodec = domainOfCodec(TYPES.int, "anInt", sql.identifier("a", "an_int"), {
  extensions: {}
});
const anotherIntCodec = domainOfCodec(anIntCodec, "anotherInt", sql.identifier("b", "another_int"), {
  extensions: {}
});
const numrangeCodec = rangeOfCodec(TYPES.numeric, "numrange", sql.identifier("pg_catalog", "numrange"), {
  extensions: {},
  description: "range of numerics"
});
const daterangeCodec = rangeOfCodec(TYPES.date, "daterange", sql.identifier("pg_catalog", "daterange"), {
  extensions: {},
  description: "range of dates"
});
const anIntRangeCodec = rangeOfCodec(anIntCodec, "anIntRange", sql.identifier("a", "an_int_range"), {
  extensions: {}
});
const nestedCompoundTypeCodec = recordCodec({
  name: "nestedCompoundType",
  identifier: sql.identifier("b", "nested_compound_type"),
  attributes: {
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
  extensions: {},
  executor: executor
});
const textArrayDomainCodec = domainOfCodec(LIST_TYPES.text, "textArrayDomain", sql.identifier("c", "text_array_domain"), {
  extensions: {}
});
const int8ArrayDomainCodec = domainOfCodec(LIST_TYPES.bigint, "int8ArrayDomain", sql.identifier("c", "int8_array_domain"), {
  extensions: {}
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
  extensions: {},
  executor: executor
});
const floatrangeCodec = rangeOfCodec(TYPES.float, "floatrange", sql.identifier("c", "floatrange"), {
  extensions: {}
});
const postArrayCodec = listOfCodec(postCodec, {
  name: "postArray",
  extensions: {}
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
  extensions: {}
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
  extensions: {},
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
  extensions: {},
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
  extensions: {},
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
  attributes: ["x"]
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
  extensions: {},
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
  extensions: {},
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
  extensions: {},
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
  extensions: {},
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
  extensions: {},
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
      extensions: {}
    }),
    typesArray: listOfCodec(typesCodec, {
      name: "typesArray",
      extensions: {}
    }),
    floatrange: floatrangeCodec,
    postArray: postArrayCodec,
    int8Array: LIST_TYPES.bigint,
    tablefuncCrosstab2: recordCodec({
      name: "tablefuncCrosstab2",
      identifier: sql.identifier("a", "tablefunc_crosstab_2"),
      attributes: {
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
      extensions: {},
      executor: executor
    }),
    tablefuncCrosstab3: recordCodec({
      name: "tablefuncCrosstab3",
      identifier: sql.identifier("a", "tablefunc_crosstab_3"),
      attributes: {
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
      extensions: {},
      executor: executor
    }),
    tablefuncCrosstab4: recordCodec({
      name: "tablefuncCrosstab4",
      identifier: sql.identifier("a", "tablefunc_crosstab_4"),
      attributes: {
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
      extensions: {},
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
      extensions: {}
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
      extensions: {}
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
      extensions: {}
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
      extensions: {}
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
      extensions: {}
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
      extensions: {}
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
      extensions: {}
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
      extensions: {}
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
      extensions: {}
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
      extensions: {}
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
      extensions: {}
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
      extensions: {},
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
      extensions: {},
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
      extensions: {}
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {}
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
      extensions: {},
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
      extensions: {},
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
      extensions: {}
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
      extensions: {},
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
      extensions: {}
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {}
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {}
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {}
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {}
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
      extensions: {},
      isUnique: true,
      isMutation: true
    },
    non_updatable_view: {
      executor: executor,
      name: "non_updatable_view",
      identifier: "main.a.non_updatable_view",
      from: nonUpdatableViewIdentifier,
      codec: nonUpdatableViewCodec,
      extensions: {}
    },
    inputs: {
      executor: executor,
      name: "inputs",
      identifier: "main.a.inputs",
      from: inputsIdentifier,
      codec: inputsCodec,
      extensions: {},
      uniques: inputsUniques,
      description: "Should output as Input"
    },
    patchs: {
      executor: executor,
      name: "patchs",
      identifier: "main.a.patchs",
      from: patchsIdentifier,
      codec: patchsCodec,
      extensions: {},
      uniques: patchsUniques,
      description: "Should output as Patch"
    },
    reserved: {
      executor: executor,
      name: "reserved",
      identifier: "main.a.reserved",
      from: reservedIdentifier,
      codec: reservedCodec,
      extensions: {},
      uniques: reservedUniques
    },
    reservedPatchs: {
      executor: executor,
      name: "reservedPatchs",
      identifier: "main.a.reservedPatchs",
      from: reservedPatchsIdentifier,
      codec: reservedPatchsCodec,
      extensions: {},
      uniques: reservedPatchsUniques,
      description: "`reservedPatchs` table should get renamed to ReservedPatchRecord to prevent clashes with ReservedPatch from `reserved` table"
    },
    reserved_input: {
      executor: executor,
      name: "reserved_input",
      identifier: "main.a.reserved_input",
      from: reservedInputIdentifier,
      codec: reservedInputCodec,
      extensions: {},
      uniques: reserved_inputUniques,
      description: "`reserved_input` table should get renamed to ReservedInputRecord to prevent clashes with ReservedInput from `reserved` table"
    },
    default_value: {
      executor: executor,
      name: "default_value",
      identifier: "main.a.default_value",
      from: defaultValueIdentifier,
      codec: defaultValueCodec,
      extensions: {},
      uniques: default_valueUniques
    },
    foreign_key: foreign_key_resourceOptionsConfig,
    no_primary_key: {
      executor: executor,
      name: "no_primary_key",
      identifier: "main.a.no_primary_key",
      from: noPrimaryKeyIdentifier,
      codec: noPrimaryKeyCodec,
      extensions: {},
      uniques: no_primary_keyUniques
    },
    testview: {
      executor: executor,
      name: "testview",
      identifier: "main.a.testview",
      from: testviewIdentifier,
      codec: testviewCodec,
      extensions: {}
    },
    unique_foreign_key: unique_foreign_key_resourceOptionsConfig,
    my_table: {
      executor: executor,
      name: "my_table",
      identifier: "main.c.my_table",
      from: myTableIdentifier,
      codec: myTableCodec,
      extensions: {},
      uniques: my_tableUniques
    },
    person_secret: person_secret_resourceOptionsConfig,
    unlogged: {
      executor: executor,
      name: "unlogged",
      identifier: "main.c.unlogged",
      from: unloggedIdentifier,
      codec: unloggedCodec,
      extensions: {},
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
      extensions: {},
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
      extensions: {},
      isUnique: true
    },
    similar_table_1: {
      executor: executor,
      name: "similar_table_1",
      identifier: "main.a.similar_table_1",
      from: similarTable1Identifier,
      codec: similarTable1Codec,
      extensions: {},
      uniques: similar_table_1Uniques
    },
    similar_table_2: {
      executor: executor,
      name: "similar_table_2",
      identifier: "main.a.similar_table_2",
      from: similarTable2Identifier,
      codec: similarTable2Codec,
      extensions: {},
      uniques: similar_table_2Uniques
    },
    updatable_view: {
      executor: executor,
      name: "updatable_view",
      identifier: "main.b.updatable_view",
      from: updatableViewIdentifier,
      codec: updatableViewCodec,
      extensions: {},
      uniques: updatable_viewUniques,
      description: "YOYOYO!!"
    },
    null_test_record: {
      executor: executor,
      name: "null_test_record",
      identifier: "main.c.null_test_record",
      from: nullTestRecordIdentifier,
      codec: nullTestRecordCodec,
      extensions: {},
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
      extensions: {}
    }),
    edge_case: {
      executor: executor,
      name: "edge_case",
      identifier: "main.c.edge_case",
      from: edgeCaseIdentifier,
      codec: edgeCaseCodec,
      extensions: {}
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
        extensions: {}
      }],
      returnsSetof: false,
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {}
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {}
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {}
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {}
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {}
    }),
    func_out_table_setof: PgResource.functionResourceOptions(person_resourceOptionsConfig, {
      name: "func_out_table_setof",
      identifier: "main.c.func_out_table_setof(c.person)",
      from(...args) {
        return sql`${func_out_table_setofFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsSetof: true,
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {}
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
      extensions: {},
      hasImplicitOrder: true
    }),
    lists: {
      executor: executor,
      name: "lists",
      identifier: "main.b.lists",
      from: listsIdentifier,
      codec: listsCodec,
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
      extensions: {}
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
      extensions: {},
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
      extensions: {},
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
      extensions: {}
    }),
    type_function_list: PgResource.functionResourceOptions(types_resourceOptionsConfig, {
      name: "type_function_list",
      identifier: "main.b.type_function_list()",
      from(...args) {
        return sql`${type_function_listFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsSetof: false,
      extensions: {},
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
      extensions: {},
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
      extensions: {},
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
        extensions: {}
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
        extensions: {}
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
const EMPTY_ARRAY = [];
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
const spec_resource_person_secretPgResource = registry.pgResources["person_secret"];
const nodeIdHandler_PersonSecret = makeTableNodeIdHandler({
  typeName: "PersonSecret",
  identifier: "person_secrets",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: spec_resource_person_secretPgResource,
  pk: person_secretUniques[0].attributes,
  deprecationReason: "This is deprecated (comment on table c.person_secret)."
});
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
function CompoundTypeInput_aApply(obj, val, {
  field,
  schema
}) {
  obj.set("a", bakedInputRuntime(schema, field.type, val));
}
function CompoundTypeInput_bApply(obj, val, {
  field,
  schema
}) {
  obj.set("b", bakedInputRuntime(schema, field.type, val));
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
function LeftArmBaseInput_idApply(obj, val, {
  field,
  schema
}) {
  obj.set("id", bakedInputRuntime(schema, field.type, val));
}
function LeftArmBaseInput_personIdApply(obj, val, {
  field,
  schema
}) {
  obj.set("person_id", bakedInputRuntime(schema, field.type, val));
}
function LeftArmBaseInput_lengthInMetresApply(obj, val, {
  field,
  schema
}) {
  obj.set("length_in_metres", bakedInputRuntime(schema, field.type, val));
}
function LeftArmBaseInput_moodApply(obj, val, {
  field,
  schema
}) {
  obj.set("mood", bakedInputRuntime(schema, field.type, val));
}
const Issue756MutationPayload_issue756EdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_issue756PgResource, issue756Uniques[0].attributes, $mutation, fieldArgs);
const resource_frmcdc_jwtTokenPgResource = registry.pgResources["frmcdc_jwtToken"];
const TableMutationPayload_postEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_postPgResource, postUniques[0].attributes, $mutation, fieldArgs);
const TableMutationPayload_personByAuthorIdPlan = $record => resource_personPgResource.get({
  id: $record.get("result").get("author_id")
});
function PostInput_headlineApply(obj, val, {
  field,
  schema
}) {
  obj.set("headline", bakedInputRuntime(schema, field.type, val));
}
function PostInput_bodyApply(obj, val, {
  field,
  schema
}) {
  obj.set("body", bakedInputRuntime(schema, field.type, val));
}
function PostInput_authorIdApply(obj, val, {
  field,
  schema
}) {
  obj.set("author_id", bakedInputRuntime(schema, field.type, val));
}
function PostInput_enumsApply(obj, val, {
  field,
  schema
}) {
  obj.set("enums", bakedInputRuntime(schema, field.type, val));
}
function PostInput_comptypesApply(obj, val, {
  field,
  schema
}) {
  obj.set("comptypes", bakedInputRuntime(schema, field.type, val));
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
function DefaultValueInput_nullValueApply(obj, val, {
  field,
  schema
}) {
  obj.set("null_value", bakedInputRuntime(schema, field.type, val));
}
function NoPrimaryKeyInput_strApply(obj, val, {
  field,
  schema
}) {
  obj.set("str", bakedInputRuntime(schema, field.type, val));
}
function TestviewInput_col1Apply(obj, val, {
  field,
  schema
}) {
  obj.set("col1", bakedInputRuntime(schema, field.type, val));
}
function TestviewInput_col2Apply(obj, val, {
  field,
  schema
}) {
  obj.set("col2", bakedInputRuntime(schema, field.type, val));
}
const CreateMyTablePayload_myTableEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_my_tablePgResource, my_tableUniques[0].attributes, $mutation, fieldArgs);
function MyTableInput_jsonDataApply(obj, val, {
  field,
  schema
}) {
  obj.set("json_data", bakedInputRuntime(schema, field.type, val));
}
function PersonSecretInput_secretApply(obj, val, {
  field,
  schema
}) {
  obj.set("sekrit", bakedInputRuntime(schema, field.type, val));
}
const CreateViewTablePayload_viewTableEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_view_tablePgResource, view_tableUniques[0].attributes, $mutation, fieldArgs);
const CreateCompoundKeyPayload_compoundKeyEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_compound_keyPgResource, compound_keyUniques[0].attributes, $mutation, fieldArgs);
const CreateCompoundKeyPayload_personByPersonId1Plan = $record => resource_personPgResource.get({
  id: $record.get("result").get("person_id_1")
});
const CreateCompoundKeyPayload_personByPersonId2Plan = $record => resource_personPgResource.get({
  id: $record.get("result").get("person_id_2")
});
function CompoundKeyInput_personId2Apply(obj, val, {
  field,
  schema
}) {
  obj.set("person_id_2", bakedInputRuntime(schema, field.type, val));
}
function CompoundKeyInput_personId1Apply(obj, val, {
  field,
  schema
}) {
  obj.set("person_id_1", bakedInputRuntime(schema, field.type, val));
}
function CompoundKeyInput_extraApply(obj, val, {
  field,
  schema
}) {
  obj.set("extra", bakedInputRuntime(schema, field.type, val));
}
const CreateSimilarTable1Payload_similarTable1EdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_similar_table_1PgResource, similar_table_1Uniques[0].attributes, $mutation, fieldArgs);
function SimilarTable1Input_col3Apply(obj, val, {
  field,
  schema
}) {
  obj.set("col3", bakedInputRuntime(schema, field.type, val));
}
const CreateSimilarTable2Payload_similarTable2EdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_similar_table_2PgResource, similar_table_2Uniques[0].attributes, $mutation, fieldArgs);
function SimilarTable2Input_col4Apply(obj, val, {
  field,
  schema
}) {
  obj.set("col4", bakedInputRuntime(schema, field.type, val));
}
function SimilarTable2Input_col5Apply(obj, val, {
  field,
  schema
}) {
  obj.set("col5", bakedInputRuntime(schema, field.type, val));
}
const CreateNullTestRecordPayload_nullTestRecordEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_null_test_recordPgResource, null_test_recordUniques[0].attributes, $mutation, fieldArgs);
function NullTestRecordInput_nullableTextApply(obj, val, {
  field,
  schema
}) {
  obj.set("nullable_text", bakedInputRuntime(schema, field.type, val));
}
function NullTestRecordInput_nullableIntApply(obj, val, {
  field,
  schema
}) {
  obj.set("nullable_int", bakedInputRuntime(schema, field.type, val));
}
function NullTestRecordInput_nonNullTextApply(obj, val, {
  field,
  schema
}) {
  obj.set("non_null_text", bakedInputRuntime(schema, field.type, val));
}
function Issue756Input_tsApply(obj, val, {
  field,
  schema
}) {
  obj.set("ts", bakedInputRuntime(schema, field.type, val));
}
function PersonInput_nameApply(obj, val, {
  field,
  schema
}) {
  obj.set("person_full_name", bakedInputRuntime(schema, field.type, val));
}
function PersonInput_aliasesApply(obj, val, {
  field,
  schema
}) {
  obj.set("aliases", bakedInputRuntime(schema, field.type, val));
}
function PersonInput_aboutApply(obj, val, {
  field,
  schema
}) {
  obj.set("about", bakedInputRuntime(schema, field.type, val));
}
function PersonInput_emailApply(obj, val, {
  field,
  schema
}) {
  obj.set("email", bakedInputRuntime(schema, field.type, val));
}
function PersonInput_siteApply(obj, val, {
  field,
  schema
}) {
  obj.set("site", bakedInputRuntime(schema, field.type, val));
}
function PersonInput_configApply(obj, val, {
  field,
  schema
}) {
  obj.set("config", bakedInputRuntime(schema, field.type, val));
}
function PersonInput_lastLoginFromIpApply(obj, val, {
  field,
  schema
}) {
  obj.set("last_login_from_ip", bakedInputRuntime(schema, field.type, val));
}
function PersonInput_lastLoginFromSubnetApply(obj, val, {
  field,
  schema
}) {
  obj.set("last_login_from_subnet", bakedInputRuntime(schema, field.type, val));
}
function PersonInput_userMacApply(obj, val, {
  field,
  schema
}) {
  obj.set("user_mac", bakedInputRuntime(schema, field.type, val));
}
function PersonInput_createdAtApply(obj, val, {
  field,
  schema
}) {
  obj.set("created_at", bakedInputRuntime(schema, field.type, val));
}
const CreateListPayload_listEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_listsPgResource, listsUniques[0].attributes, $mutation, fieldArgs);
function ListInput_intArrayApply(obj, val, {
  field,
  schema
}) {
  obj.set("int_array", bakedInputRuntime(schema, field.type, val));
}
function ListInput_intArrayNnApply(obj, val, {
  field,
  schema
}) {
  obj.set("int_array_nn", bakedInputRuntime(schema, field.type, val));
}
function ListInput_enumArrayApply(obj, val, {
  field,
  schema
}) {
  obj.set("enum_array", bakedInputRuntime(schema, field.type, val));
}
function ListInput_enumArrayNnApply(obj, val, {
  field,
  schema
}) {
  obj.set("enum_array_nn", bakedInputRuntime(schema, field.type, val));
}
function ListInput_dateArrayApply(obj, val, {
  field,
  schema
}) {
  obj.set("date_array", bakedInputRuntime(schema, field.type, val));
}
function ListInput_dateArrayNnApply(obj, val, {
  field,
  schema
}) {
  obj.set("date_array_nn", bakedInputRuntime(schema, field.type, val));
}
function ListInput_timestamptzArrayApply(obj, val, {
  field,
  schema
}) {
  obj.set("timestamptz_array", bakedInputRuntime(schema, field.type, val));
}
function ListInput_timestamptzArrayNnApply(obj, val, {
  field,
  schema
}) {
  obj.set("timestamptz_array_nn", bakedInputRuntime(schema, field.type, val));
}
function ListInput_compoundTypeArrayApply(obj, val, {
  field,
  schema
}) {
  obj.set("compound_type_array", bakedInputRuntime(schema, field.type, val));
}
function ListInput_compoundTypeArrayNnApply(obj, val, {
  field,
  schema
}) {
  obj.set("compound_type_array_nn", bakedInputRuntime(schema, field.type, val));
}
function ListInput_byteaArrayApply(obj, val, {
  field,
  schema
}) {
  obj.set("bytea_array", bakedInputRuntime(schema, field.type, val));
}
function ListInput_byteaArrayNnApply(obj, val, {
  field,
  schema
}) {
  obj.set("bytea_array_nn", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_smallintApply(obj, val, {
  field,
  schema
}) {
  obj.set("smallint", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_bigintApply(obj, val, {
  field,
  schema
}) {
  obj.set("bigint", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_numericApply(obj, val, {
  field,
  schema
}) {
  obj.set("numeric", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_decimalApply(obj, val, {
  field,
  schema
}) {
  obj.set("decimal", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_booleanApply(obj, val, {
  field,
  schema
}) {
  obj.set("boolean", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_varcharApply(obj, val, {
  field,
  schema
}) {
  obj.set("varchar", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_enumApply(obj, val, {
  field,
  schema
}) {
  obj.set("enum", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_domainApply(obj, val, {
  field,
  schema
}) {
  obj.set("domain", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_domain2Apply(obj, val, {
  field,
  schema
}) {
  obj.set("domain2", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_textArrayApply(obj, val, {
  field,
  schema
}) {
  obj.set("text_array", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_jsonApply(obj, val, {
  field,
  schema
}) {
  obj.set("json", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_jsonbApply(obj, val, {
  field,
  schema
}) {
  obj.set("jsonb", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_jsonpathApply(obj, val, {
  field,
  schema
}) {
  obj.set("jsonpath", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_nullableRangeApply(obj, val, {
  field,
  schema
}) {
  obj.set("nullable_range", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_numrangeApply(obj, val, {
  field,
  schema
}) {
  obj.set("numrange", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_daterangeApply(obj, val, {
  field,
  schema
}) {
  obj.set("daterange", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_anIntRangeApply(obj, val, {
  field,
  schema
}) {
  obj.set("an_int_range", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_timestampApply(obj, val, {
  field,
  schema
}) {
  obj.set("timestamp", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_timestamptzApply(obj, val, {
  field,
  schema
}) {
  obj.set("timestamptz", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_dateApply(obj, val, {
  field,
  schema
}) {
  obj.set("date", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_timeApply(obj, val, {
  field,
  schema
}) {
  obj.set("time", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_timetzApply(obj, val, {
  field,
  schema
}) {
  obj.set("timetz", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_intervalApply(obj, val, {
  field,
  schema
}) {
  obj.set("interval", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_intervalArrayApply(obj, val, {
  field,
  schema
}) {
  obj.set("interval_array", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_moneyApply(obj, val, {
  field,
  schema
}) {
  obj.set("money", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_compoundTypeApply(obj, val, {
  field,
  schema
}) {
  obj.set("compound_type", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_nestedCompoundTypeApply(obj, val, {
  field,
  schema
}) {
  obj.set("nested_compound_type", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_nullableCompoundTypeApply(obj, val, {
  field,
  schema
}) {
  obj.set("nullable_compound_type", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_nullableNestedCompoundTypeApply(obj, val, {
  field,
  schema
}) {
  obj.set("nullable_nested_compound_type", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_pointApply(obj, val, {
  field,
  schema
}) {
  obj.set("point", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_nullablePointApply(obj, val, {
  field,
  schema
}) {
  obj.set("nullablePoint", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_inetApply(obj, val, {
  field,
  schema
}) {
  obj.set("inet", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_cidrApply(obj, val, {
  field,
  schema
}) {
  obj.set("cidr", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_macaddrApply(obj, val, {
  field,
  schema
}) {
  obj.set("macaddr", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_regprocApply(obj, val, {
  field,
  schema
}) {
  obj.set("regproc", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_regprocedureApply(obj, val, {
  field,
  schema
}) {
  obj.set("regprocedure", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_regoperApply(obj, val, {
  field,
  schema
}) {
  obj.set("regoper", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_regoperatorApply(obj, val, {
  field,
  schema
}) {
  obj.set("regoperator", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_regclassApply(obj, val, {
  field,
  schema
}) {
  obj.set("regclass", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_regtypeApply(obj, val, {
  field,
  schema
}) {
  obj.set("regtype", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_regconfigApply(obj, val, {
  field,
  schema
}) {
  obj.set("regconfig", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_regdictionaryApply(obj, val, {
  field,
  schema
}) {
  obj.set("regdictionary", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_textArrayDomainApply(obj, val, {
  field,
  schema
}) {
  obj.set("text_array_domain", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_int8ArrayDomainApply(obj, val, {
  field,
  schema
}) {
  obj.set("int8_array_domain", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_byteaApply(obj, val, {
  field,
  schema
}) {
  obj.set("bytea", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_ltreeApply(obj, val, {
  field,
  schema
}) {
  obj.set("ltree", bakedInputRuntime(schema, field.type, val));
}
function TypeInput_ltreeArrayApply(obj, val, {
  field,
  schema
}) {
  obj.set("ltree_array", bakedInputRuntime(schema, field.type, val));
}
function getClientMutationIdForUpdateOrDeletePlan($mutation) {
  const $result = $mutation.getStepForKey("result");
  return $result.getMeta("clientMutationId");
}
export const typeDefs = /* GraphQL */`type Query implements Node {
  query: Query!
  nodeId: ID!
  node(nodeId: ID!): Node
  inputById(id: Int!): Input
  patchById(id: Int!): Patch
  reservedById(id: Int!): Reserved
  reservedPatchRecordById(id: Int!): ReservedPatchRecord
  reservedInputRecordById(id: Int!): ReservedInputRecord
  defaultValueById(id: Int!): DefaultValue
  noPrimaryKeyById(id: Int!): NoPrimaryKey
  uniqueForeignKeyByCompoundKey1AndCompoundKey2(compoundKey1: Int!, compoundKey2: Int!): UniqueForeignKey
  myTableById(id: Int!): MyTable
  viewTableById(id: Int!): ViewTable
  compoundKeyByPersonId1AndPersonId2(personId1: Int!, personId2: Int!): CompoundKey
  similarTable1ById(id: Int!): SimilarTable1
  similarTable2ById(id: Int!): SimilarTable2
  nullTestRecordById(id: Int!): NullTestRecord
  leftArmById(id: Int!): LeftArm
  leftArmByPersonId(personId: Int!): LeftArm
  issue756ById(id: Int!): Issue756
  postById(id: Int!): Post
  personById(id: Int!): Person
  personByEmail(email: Email!): Person
  listById(id: Int!): List
  typeById(id: Int!): Type
  currentUserId: Int
  funcOut: Int
  funcOutSetof(first: Int, last: Int, offset: Int, before: Cursor, after: Cursor): FuncOutSetofConnection
  funcOutUnnamed: Int
  noArgsQuery: Int
  queryIntervalArray: [Interval]
  queryIntervalSet(first: Int, last: Int, offset: Int, before: Cursor, after: Cursor): QueryIntervalSetConnection
  queryTextArray: [String]
  staticBigInteger(first: Int, last: Int, offset: Int, before: Cursor, after: Cursor): StaticBigIntegerConnection
  funcInOut(i: Int): Int
  funcReturnsTableOneCol(i: Int, first: Int, last: Int, offset: Int, before: Cursor, after: Cursor): FuncReturnsTableOneColConnection
  jsonIdentity(json: JSON): JSON
  jsonbIdentity(json: JSON): JSON
  add1Query(arg0: Int!, arg1: Int!): Int
  add2Query(a: Int!, b: Int): Int
  add3Query(a: Int, arg1: Int): Int
  add4Query(arg0: Int, b: Int): Int
  funcInInout(i: Int, ino: Int): Int
  funcOutOut: FuncOutOutRecord
  funcOutOutSetof(first: Int, last: Int, offset: Int, before: Cursor, after: Cursor): FuncOutOutSetofConnection
  funcOutOutUnnamed: FuncOutOutUnnamedRecord
  searchTestSummariesList(first: Int, offset: Int): [SearchTestSummariesRecord]
  optionalMissingMiddle1(arg0: Int!, b: Int, c: Int): Int
  optionalMissingMiddle2(a: Int!, b: Int, c: Int): Int
  optionalMissingMiddle3(a: Int!, arg1: Int, c: Int): Int
  optionalMissingMiddle4(arg0: Int!, b: Int, arg2: Int): Int
  optionalMissingMiddle5(a: Int!, arg1: Int, arg2: Int): Int
  funcOutUnnamedOutOutUnnamed: FuncOutUnnamedOutOutUnnamedRecord
  intSetQuery(x: Int, y: Int, z: Int, first: Int, last: Int, offset: Int, before: Cursor, after: Cursor): IntSetQueryConnection
  funcReturnsTableMultiCol(i: Int, a: Int, b: Int, first: Int, last: Int, offset: Int, before: Cursor, after: Cursor): FuncReturnsTableMultiColConnection
  returnTableWithoutGrants: CompoundKey
  typesQuery(a: BigInt!, b: Boolean!, c: String!, d: [Int]!, e: JSON!, f: FloatRangeInput!): Boolean
  queryOutputTwoRows(leftArmId: Int, postId: Int, txt: String): QueryOutputTwoRowsRecord
  funcOutOutCompoundType(i1: Int): FuncOutOutCompoundTypeRecord
  tableQuery(id: Int): Post
  compoundTypeSetQuery(first: Int, last: Int, offset: Int, before: Cursor, after: Cursor): CompoundTypesConnection
  compoundTypeQuery(object: CompoundTypeInput): CompoundType
  funcOutComplex(a: Int, b: String): FuncOutComplexRecord
  funcOutComplexSetof(a: Int, b: String, first: Int, last: Int, offset: Int, before: Cursor, after: Cursor): FuncOutComplexSetofConnection
  queryCompoundTypeArray(object: CompoundTypeInput): [CompoundType]
  compoundTypeArrayQuery(object: CompoundTypeInput): [CompoundType]
  funcOutTable: Person
  funcOutTableSetof(first: Int, last: Int, offset: Int, before: Cursor, after: Cursor): PeopleConnection
  tableSetQuery(first: Int, last: Int, offset: Int, before: Cursor, after: Cursor, condition: PersonCondition, orderBy: [PeopleOrderBy!]): PeopleConnection
  tableSetQueryPlpgsql(first: Int, last: Int, offset: Int, before: Cursor, after: Cursor): PeopleConnection
  typeFunctionConnection(first: Int, last: Int, offset: Int, before: Cursor, after: Cursor): TypesConnection
  typeFunction(id: Int): Type
  typeFunctionList: [Type]
  input(nodeId: ID!): Input
  patch(nodeId: ID!): Patch
  reserved(nodeId: ID!): Reserved
  reservedPatchRecord(nodeId: ID!): ReservedPatchRecord
  reservedInputRecord(nodeId: ID!): ReservedInputRecord
  defaultValue(nodeId: ID!): DefaultValue
  myTable(nodeId: ID!): MyTable
  viewTable(nodeId: ID!): ViewTable
  compoundKey(nodeId: ID!): CompoundKey
  similarTable1(nodeId: ID!): SimilarTable1
  similarTable2(nodeId: ID!): SimilarTable2
  nullTestRecord(nodeId: ID!): NullTestRecord
  leftArm(nodeId: ID!): LeftArm
  issue756(nodeId: ID!): Issue756
  post(nodeId: ID!): Post
  person(nodeId: ID!): Person
  list(nodeId: ID!): List
  type(nodeId: ID!): Type
  allNonUpdatableViews(first: Int, last: Int, offset: Int, before: Cursor, after: Cursor, condition: NonUpdatableViewCondition, orderBy: [NonUpdatableViewsOrderBy!] = [NATURAL]): NonUpdatableViewsConnection
  allInputs(first: Int, last: Int, offset: Int, before: Cursor, after: Cursor, condition: InputCondition, orderBy: [InputsOrderBy!] = [PRIMARY_KEY_ASC]): InputsConnection
  allPatches(first: Int, last: Int, offset: Int, before: Cursor, after: Cursor, condition: PatchCondition, orderBy: [PatchesOrderBy!] = [PRIMARY_KEY_ASC]): PatchesConnection
  allReserveds(first: Int, last: Int, offset: Int, before: Cursor, after: Cursor, condition: ReservedCondition, orderBy: [ReservedsOrderBy!] = [PRIMARY_KEY_ASC]): ReservedsConnection
  allReservedPatchRecords(first: Int, last: Int, offset: Int, before: Cursor, after: Cursor, condition: ReservedPatchRecordCondition, orderBy: [ReservedPatchRecordsOrderBy!] = [PRIMARY_KEY_ASC]): ReservedPatchRecordsConnection
  allReservedInputRecords(first: Int, last: Int, offset: Int, before: Cursor, after: Cursor, condition: ReservedInputRecordCondition, orderBy: [ReservedInputRecordsOrderBy!] = [PRIMARY_KEY_ASC]): ReservedInputRecordsConnection
  allDefaultValues(first: Int, last: Int, offset: Int, before: Cursor, after: Cursor, condition: DefaultValueCondition, orderBy: [DefaultValuesOrderBy!] = [PRIMARY_KEY_ASC]): DefaultValuesConnection
  allForeignKeys(first: Int, last: Int, offset: Int, before: Cursor, after: Cursor, condition: ForeignKeyCondition, orderBy: [ForeignKeysOrderBy!] = [NATURAL]): ForeignKeysConnection
  allNoPrimaryKeys(first: Int, last: Int, offset: Int, before: Cursor, after: Cursor, condition: NoPrimaryKeyCondition, orderBy: [NoPrimaryKeysOrderBy!] = [NATURAL]): NoPrimaryKeysConnection
  allTestviews(first: Int, last: Int, offset: Int, before: Cursor, after: Cursor, condition: TestviewCondition, orderBy: [TestviewsOrderBy!] = [NATURAL]): TestviewsConnection
  allMyTables(first: Int, last: Int, offset: Int, before: Cursor, after: Cursor, condition: MyTableCondition, orderBy: [MyTablesOrderBy!] = [PRIMARY_KEY_ASC]): MyTablesConnection
  allViewTables(first: Int, last: Int, offset: Int, before: Cursor, after: Cursor, condition: ViewTableCondition, orderBy: [ViewTablesOrderBy!] = [PRIMARY_KEY_ASC]): ViewTablesConnection
  allCompoundKeys(first: Int, last: Int, offset: Int, before: Cursor, after: Cursor, condition: CompoundKeyCondition, orderBy: [CompoundKeysOrderBy!] = [PRIMARY_KEY_ASC]): CompoundKeysConnection
  allSimilarTable1S(first: Int, last: Int, offset: Int, before: Cursor, after: Cursor, condition: SimilarTable1Condition, orderBy: [SimilarTable1SOrderBy!] = [PRIMARY_KEY_ASC]): SimilarTable1SConnection
  allSimilarTable2S(first: Int, last: Int, offset: Int, before: Cursor, after: Cursor, condition: SimilarTable2Condition, orderBy: [SimilarTable2SOrderBy!] = [PRIMARY_KEY_ASC]): SimilarTable2SConnection
  allUpdatableViews(first: Int, last: Int, offset: Int, before: Cursor, after: Cursor, condition: UpdatableViewCondition, orderBy: [UpdatableViewsOrderBy!] = [NATURAL]): UpdatableViewsConnection
  allNullTestRecords(first: Int, last: Int, offset: Int, before: Cursor, after: Cursor, condition: NullTestRecordCondition, orderBy: [NullTestRecordsOrderBy!] = [PRIMARY_KEY_ASC]): NullTestRecordsConnection
  allEdgeCases(first: Int, last: Int, offset: Int, before: Cursor, after: Cursor, condition: EdgeCaseCondition, orderBy: [EdgeCasesOrderBy!] = [NATURAL]): EdgeCasesConnection
  allLeftArms(first: Int, last: Int, offset: Int, before: Cursor, after: Cursor, condition: LeftArmCondition, orderBy: [LeftArmsOrderBy!] = [PRIMARY_KEY_ASC]): LeftArmsConnection
  allIssue756S(first: Int, last: Int, offset: Int, before: Cursor, after: Cursor, condition: Issue756Condition, orderBy: [Issue756SOrderBy!] = [PRIMARY_KEY_ASC]): Issue756SConnection
  allPosts(first: Int, last: Int, offset: Int, before: Cursor, after: Cursor, condition: PostCondition, orderBy: [PostsOrderBy!] = [PRIMARY_KEY_ASC]): PostsConnection
  allPeople(first: Int, last: Int, offset: Int, before: Cursor, after: Cursor, condition: PersonCondition, orderBy: [PeopleOrderBy!] = [PRIMARY_KEY_ASC]): PeopleConnection
  allLists(first: Int, last: Int, offset: Int, before: Cursor, after: Cursor, condition: ListCondition, orderBy: [ListsOrderBy!] = [PRIMARY_KEY_ASC]): ListsConnection
  allTypes(first: Int, last: Int, offset: Int, before: Cursor, after: Cursor, condition: TypeCondition, orderBy: [TypesOrderBy!] = [PRIMARY_KEY_ASC]): TypesConnection
}

interface Node {
  nodeId: ID!
}

type Input implements Node {
  nodeId: ID!
  id: Int!
}

type Patch implements Node {
  nodeId: ID!
  id: Int!
}

type Reserved implements Node {
  nodeId: ID!
  id: Int!
}

type ReservedPatchRecord implements Node {
  nodeId: ID!
  id: Int!
}

type ReservedInputRecord implements Node {
  nodeId: ID!
  id: Int!
}

type DefaultValue implements Node {
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
  compoundKeyByCompoundKey1AndCompoundKey2: CompoundKey
}

type CompoundKey implements Node {
  nodeId: ID!
  personId2: Int!
  personId1: Int!
  extra: Boolean
  personByPersonId1: Person
  personByPersonId2: Person
  foreignKeysByCompoundKey1AndCompoundKey2(first: Int, last: Int, offset: Int, before: Cursor, after: Cursor, condition: ForeignKeyCondition, orderBy: [ForeignKeysOrderBy!] = [NATURAL]): ForeignKeysConnection!
  uniqueForeignKeyByCompoundKey1AndCompoundKey2: UniqueForeignKey
}

type Person implements Node {
  nodeId: ID!
  computedOut: String!
  firstName: String
  computedOutOut: PersonComputedOutOutRecord
  computedInout(ino: String): String
  computedInoutOut(ino: String): PersonComputedInoutOutRecord
  computedFirstArgInoutOut: PersonComputedFirstArgInoutOutRecord
  optionalMissingMiddle1(arg0: Int!, b: Int, c: Int): Int
  optionalMissingMiddle2(a: Int!, b: Int, c: Int): Int
  optionalMissingMiddle3(a: Int!, arg1: Int, c: Int): Int
  optionalMissingMiddle4(arg0: Int!, b: Int, arg2: Int): Int
  optionalMissingMiddle5(a: Int!, arg1: Int, arg2: Int): Int
  computedComplex(a: Int, b: String): PersonComputedComplexRecord
  firstPost: Post
  computedFirstArgInout: Person
  friends(first: Int, last: Int, offset: Int, before: Cursor, after: Cursor, orderBy: [PeopleOrderBy!]): PeopleConnection!
  typeFunctionConnection(first: Int, last: Int, offset: Int, before: Cursor, after: Cursor): TypesConnection!
  typeFunction(id: Int): Type
  typeFunctionList: [Type]
  id: Int!
  name: String!
  aliases: [String]!
  about: String
  email: Email!
  config: KeyValueHash
  lastLoginFromIp: InternetAddress
  lastLoginFromSubnet: String
  userMac: String
  createdAt: Datetime
  postsByAuthorId(first: Int, last: Int, offset: Int, before: Cursor, after: Cursor, condition: PostCondition, orderBy: [PostsOrderBy!] = [PRIMARY_KEY_ASC]): PostsConnection!
  foreignKeysByPersonId(first: Int, last: Int, offset: Int, before: Cursor, after: Cursor, condition: ForeignKeyCondition, orderBy: [ForeignKeysOrderBy!] = [NATURAL]): ForeignKeysConnection!
  leftArmByPersonId: LeftArm
  compoundKeysByPersonId1(first: Int, last: Int, offset: Int, before: Cursor, after: Cursor, condition: CompoundKeyCondition, orderBy: [CompoundKeysOrderBy!] = [PRIMARY_KEY_ASC]): CompoundKeysConnection!
  compoundKeysByPersonId2(first: Int, last: Int, offset: Int, before: Cursor, after: Cursor, condition: CompoundKeyCondition, orderBy: [CompoundKeysOrderBy!] = [PRIMARY_KEY_ASC]): CompoundKeysConnection!
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

type Interval {
  seconds: Float
  minutes: Int
  hours: Int
  days: Int
  months: Int
  years: Int
}

type Post implements Node {
  nodeId: ID!
  computedIntervalArray: [Interval]
  computedIntervalSet(first: Int, last: Int, offset: Int, before: Cursor, after: Cursor): PostComputedIntervalSetConnection!
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
  personByAuthorId: Person
  typesBySmallint(first: Int, last: Int, offset: Int, before: Cursor, after: Cursor, condition: TypeCondition, orderBy: [TypesOrderBy!] = [PRIMARY_KEY_ASC]): TypesConnection!
  typeById: Type
}

type PostComputedIntervalSetConnection {
  nodes: [Interval]!
  edges: [PostComputedIntervalSetEdge]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type PostComputedIntervalSetEdge {
  cursor: Cursor
  node: Interval
}

scalar Cursor

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: Cursor
  endCursor: Cursor
}

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

input IntervalInput {
  seconds: Float
  minutes: Int
  hours: Int
  days: Int
  months: Int
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

scalar Datetime

type TypesConnection {
  nodes: [Type]!
  edges: [TypesEdge]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type Type implements Node {
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
  postBySmallint: Post
  postById: Post
}

scalar BigInt

scalar BigFloat

scalar AnInt

scalar AnotherInt

scalar JSON

scalar JSONPath

type BigFloatRange {
  start: BigFloatRangeBound
  end: BigFloatRangeBound
}

type BigFloatRangeBound {
  value: BigFloat!
  inclusive: Boolean!
}

type DateRange {
  start: DateRangeBound
  end: DateRangeBound
}

type DateRangeBound {
  value: Date!
  inclusive: Boolean!
}

scalar Date

type AnIntRange {
  start: AnIntRangeBound
  end: AnIntRangeBound
}

type AnIntRangeBound {
  value: AnInt!
  inclusive: Boolean!
}

scalar Time

type NestedCompoundType {
  a: CompoundType
  b: CompoundType
  bazBuz: Int
}

type Point {
  x: Float!
  y: Float!
}

scalar InternetAddress

scalar RegProc

scalar RegProcedure

scalar RegOper

scalar RegOperator

scalar RegClass

scalar RegType

scalar RegConfig

scalar RegDictionary

scalar Base64EncodedBinary

scalar LTree

type TypesEdge {
  cursor: Cursor
  node: Type
}

input TypeCondition {
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
  ltree: LTree
  ltreeArray: [LTree]
}

input BigFloatRangeInput {
  start: BigFloatRangeBoundInput
  end: BigFloatRangeBoundInput
}

input BigFloatRangeBoundInput {
  value: BigFloat!
  inclusive: Boolean!
}

input DateRangeInput {
  start: DateRangeBoundInput
  end: DateRangeBoundInput
}

input DateRangeBoundInput {
  value: Date!
  inclusive: Boolean!
}

input AnIntRangeInput {
  start: AnIntRangeBoundInput
  end: AnIntRangeBoundInput
}

input AnIntRangeBoundInput {
  value: AnInt!
  inclusive: Boolean!
}

input NestedCompoundTypeInput {
  a: CompoundTypeInput
  b: CompoundTypeInput
  bazBuz: Int
}

input PointInput {
  x: Float!
  y: Float!
}

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

type PeopleConnection {
  nodes: [Person]!
  edges: [PeopleEdge]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type PeopleEdge {
  cursor: Cursor
  node: Person
}

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

scalar KeyValueHash

type PostsConnection {
  nodes: [Post]!
  edges: [PostsEdge]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type PostsEdge {
  cursor: Cursor
  node: Post
}

input PostCondition {
  id: Int
  headline: String
  body: String
  authorId: Int
  enums: [AnEnum]
  comptypes: [ComptypeInput]
  computedWithOptionalArg: Int
}

input ComptypeInput {
  schedule: Datetime
  isOptimised: Boolean
}

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

type ForeignKeysConnection {
  nodes: [ForeignKey]!
  edges: [ForeignKeysEdge]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type ForeignKey {
  personId: Int
  compoundKey1: Int
  compoundKey2: Int
  compoundKeyByCompoundKey1AndCompoundKey2: CompoundKey
  personByPersonId: Person
}

type ForeignKeysEdge {
  cursor: Cursor
  node: ForeignKey
}

input ForeignKeyCondition {
  personId: Int
  compoundKey1: Int
  compoundKey2: Int
}

enum ForeignKeysOrderBy {
  NATURAL
  PERSON_ID_ASC
  PERSON_ID_DESC
  COMPOUND_KEY_1_ASC
  COMPOUND_KEY_1_DESC
  COMPOUND_KEY_2_ASC
  COMPOUND_KEY_2_DESC
}

type PersonSecret implements Node {
  nodeId: ID!
  personId: Int!
  secret: String
  personByPersonId: Person
}

type LeftArm implements Node {
  nodeId: ID!
  id: Int!
  personId: Int
  lengthInMetres: Float
  mood: String!
  personByPersonId: Person
}

type CompoundKeysConnection {
  nodes: [CompoundKey]!
  edges: [CompoundKeysEdge]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type CompoundKeysEdge {
  cursor: Cursor
  node: CompoundKey
}

input CompoundKeyCondition {
  personId2: Int
  personId1: Int
  extra: Boolean
}

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
  nodeId: ID!
  id: Int!
  jsonData: JSON
}

type ViewTable implements Node {
  nodeId: ID!
  id: Int!
  col1: Int
  col2: Int
}

type SimilarTable1 implements Node {
  nodeId: ID!
  id: Int!
  col1: Int
  col2: Int
  col3: Int!
}

type SimilarTable2 implements Node {
  nodeId: ID!
  id: Int!
  col3: Int!
  col4: Int
  col5: Int
}

type NullTestRecord implements Node {
  nodeId: ID!
  id: Int!
  nullableText: String
  nullableInt: Int
  nonNullText: String!
}

type Issue756 implements Node {
  nodeId: ID!
  id: Int!
  ts: NotNullTimestamp!
}

scalar NotNullTimestamp

type List implements Node {
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

type FuncOutSetofConnection {
  nodes: [Int]!
  edges: [FuncOutSetofEdge]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type FuncOutSetofEdge {
  cursor: Cursor
  node: Int
}

type QueryIntervalSetConnection {
  nodes: [Interval]!
  edges: [QueryIntervalSetEdge]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type QueryIntervalSetEdge {
  cursor: Cursor
  node: Interval
}

type StaticBigIntegerConnection {
  nodes: [BigInt]!
  edges: [StaticBigIntegerEdge]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type StaticBigIntegerEdge {
  cursor: Cursor
  node: BigInt
}

type FuncReturnsTableOneColConnection {
  nodes: [Int]!
  edges: [FuncReturnsTableOneColEdge]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type FuncReturnsTableOneColEdge {
  cursor: Cursor
  node: Int
}

type FuncOutOutRecord {
  firstOut: Int
  secondOut: String
}

type FuncOutOutSetofConnection {
  nodes: [FuncOutOutSetofRecord]!
  edges: [FuncOutOutSetofEdge]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type FuncOutOutSetofRecord {
  o1: Int
  o2: String
}

type FuncOutOutSetofEdge {
  cursor: Cursor
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

type IntSetQueryConnection {
  nodes: [Int]!
  edges: [IntSetQueryEdge]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type IntSetQueryEdge {
  cursor: Cursor
  node: Int
}

type FuncReturnsTableMultiColConnection {
  nodes: [FuncReturnsTableMultiColRecord]!
  edges: [FuncReturnsTableMultiColEdge]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type FuncReturnsTableMultiColRecord {
  col1: Int
  col2: String
}

type FuncReturnsTableMultiColEdge {
  cursor: Cursor
  node: FuncReturnsTableMultiColRecord
}

input FloatRangeInput {
  start: FloatRangeBoundInput
  end: FloatRangeBoundInput
}

input FloatRangeBoundInput {
  value: Float!
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

type CompoundTypesConnection {
  nodes: [CompoundType]!
  edges: [CompoundTypesEdge]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type CompoundTypesEdge {
  cursor: Cursor
  node: CompoundType
}

type FuncOutComplexRecord {
  x: Int
  y: CompoundType
  z: Person
}

type FuncOutComplexSetofConnection {
  nodes: [FuncOutComplexSetofRecord]!
  edges: [FuncOutComplexSetofEdge]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type FuncOutComplexSetofRecord {
  x: Int
  y: CompoundType
  z: Person
}

type FuncOutComplexSetofEdge {
  cursor: Cursor
  node: FuncOutComplexSetofRecord
}

input PersonCondition {
  id: Int
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
  computedOut: String
}

input WrappedUrlInput {
  url: NotNullUrl!
}

type NonUpdatableViewsConnection {
  nodes: [NonUpdatableView]!
  edges: [NonUpdatableViewsEdge]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type NonUpdatableView {
  column: Int
}

type NonUpdatableViewsEdge {
  cursor: Cursor
  node: NonUpdatableView
}

input NonUpdatableViewCondition {
  column: Int
}

enum NonUpdatableViewsOrderBy {
  NATURAL
  COLUMN_ASC
  COLUMN_DESC
}

type InputsConnection {
  nodes: [Input]!
  edges: [InputsEdge]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type InputsEdge {
  cursor: Cursor
  node: Input
}

input InputCondition {
  id: Int
}

enum InputsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
}

type PatchesConnection {
  nodes: [Patch]!
  edges: [PatchesEdge]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type PatchesEdge {
  cursor: Cursor
  node: Patch
}

input PatchCondition {
  id: Int
}

enum PatchesOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
}

type ReservedsConnection {
  nodes: [Reserved]!
  edges: [ReservedsEdge]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type ReservedsEdge {
  cursor: Cursor
  node: Reserved
}

input ReservedCondition {
  id: Int
}

enum ReservedsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
}

type ReservedPatchRecordsConnection {
  nodes: [ReservedPatchRecord]!
  edges: [ReservedPatchRecordsEdge]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type ReservedPatchRecordsEdge {
  cursor: Cursor
  node: ReservedPatchRecord
}

input ReservedPatchRecordCondition {
  id: Int
}

enum ReservedPatchRecordsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
}

type ReservedInputRecordsConnection {
  nodes: [ReservedInputRecord]!
  edges: [ReservedInputRecordsEdge]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type ReservedInputRecordsEdge {
  cursor: Cursor
  node: ReservedInputRecord
}

input ReservedInputRecordCondition {
  id: Int
}

enum ReservedInputRecordsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
}

type DefaultValuesConnection {
  nodes: [DefaultValue]!
  edges: [DefaultValuesEdge]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type DefaultValuesEdge {
  cursor: Cursor
  node: DefaultValue
}

input DefaultValueCondition {
  id: Int
  nullValue: String
}

enum DefaultValuesOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  NULL_VALUE_ASC
  NULL_VALUE_DESC
}

type NoPrimaryKeysConnection {
  nodes: [NoPrimaryKey]!
  edges: [NoPrimaryKeysEdge]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type NoPrimaryKeysEdge {
  cursor: Cursor
  node: NoPrimaryKey
}

input NoPrimaryKeyCondition {
  id: Int
  str: String
}

enum NoPrimaryKeysOrderBy {
  NATURAL
  ID_ASC
  ID_DESC
  STR_ASC
  STR_DESC
}

type TestviewsConnection {
  nodes: [Testview]!
  edges: [TestviewsEdge]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type Testview {
  testviewid: Int
  col1: Int
  col2: Int
}

type TestviewsEdge {
  cursor: Cursor
  node: Testview
}

input TestviewCondition {
  testviewid: Int
  col1: Int
  col2: Int
}

enum TestviewsOrderBy {
  NATURAL
  TESTVIEWID_ASC
  TESTVIEWID_DESC
  COL1_ASC
  COL1_DESC
  COL2_ASC
  COL2_DESC
}

type MyTablesConnection {
  nodes: [MyTable]!
  edges: [MyTablesEdge]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type MyTablesEdge {
  cursor: Cursor
  node: MyTable
}

input MyTableCondition {
  id: Int
  jsonData: JSON
}

enum MyTablesOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  JSON_DATA_ASC
  JSON_DATA_DESC
}

type PersonSecretsConnection {
  nodes: [PersonSecret]!
  edges: [PersonSecretsEdge]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type PersonSecretsEdge {
  cursor: Cursor
  node: PersonSecret
}

input PersonSecretCondition {
  personId: Int
  secret: String
}

enum PersonSecretsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  PERSON_ID_ASC
  PERSON_ID_DESC
  SECRET_ASC
  SECRET_DESC
}

type ViewTablesConnection {
  nodes: [ViewTable]!
  edges: [ViewTablesEdge]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type ViewTablesEdge {
  cursor: Cursor
  node: ViewTable
}

input ViewTableCondition {
  id: Int
  col1: Int
  col2: Int
}

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

type SimilarTable1SConnection {
  nodes: [SimilarTable1]!
  edges: [SimilarTable1SEdge]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type SimilarTable1SEdge {
  cursor: Cursor
  node: SimilarTable1
}

input SimilarTable1Condition {
  id: Int
  col1: Int
  col2: Int
  col3: Int
}

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

type SimilarTable2SConnection {
  nodes: [SimilarTable2]!
  edges: [SimilarTable2SEdge]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type SimilarTable2SEdge {
  cursor: Cursor
  node: SimilarTable2
}

input SimilarTable2Condition {
  id: Int
  col3: Int
  col4: Int
  col5: Int
}

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

type UpdatableViewsConnection {
  nodes: [UpdatableView]!
  edges: [UpdatableViewsEdge]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type UpdatableView {
  x: Int
  name: String
  description: String
  constant: Int
}

type UpdatableViewsEdge {
  cursor: Cursor
  node: UpdatableView
}

input UpdatableViewCondition {
  x: Int
  name: String
  description: String
  constant: Int
}

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

type NullTestRecordsConnection {
  nodes: [NullTestRecord]!
  edges: [NullTestRecordsEdge]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type NullTestRecordsEdge {
  cursor: Cursor
  node: NullTestRecord
}

input NullTestRecordCondition {
  id: Int
  nullableText: String
  nullableInt: Int
  nonNullText: String
}

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

type EdgeCasesConnection {
  nodes: [EdgeCase]!
  edges: [EdgeCasesEdge]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type EdgeCase {
  computed: String
  notNullHasDefault: Boolean!
  wontCastEasy: Int
  rowId: Int
}

type EdgeCasesEdge {
  cursor: Cursor
  node: EdgeCase
}

input EdgeCaseCondition {
  notNullHasDefault: Boolean
  wontCastEasy: Int
  rowId: Int
}

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

type LeftArmsConnection {
  nodes: [LeftArm]!
  edges: [LeftArmsEdge]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type LeftArmsEdge {
  cursor: Cursor
  node: LeftArm
}

input LeftArmCondition {
  id: Int
  personId: Int
  lengthInMetres: Float
  mood: String
}

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

type Issue756SConnection {
  nodes: [Issue756]!
  edges: [Issue756SEdge]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type Issue756SEdge {
  cursor: Cursor
  node: Issue756
}

input Issue756Condition {
  id: Int
  ts: NotNullTimestamp
}

enum Issue756SOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  TS_ASC
  TS_DESC
}

type ListsConnection {
  nodes: [List]!
  edges: [ListsEdge]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type ListsEdge {
  cursor: Cursor
  node: List
}

input ListCondition {
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
}

enum ListsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
}

type Mutation {
  mutationOut(input: MutationOutInput!): MutationOutPayload
  mutationOutSetof(input: MutationOutSetofInput!): MutationOutSetofPayload
  mutationOutUnnamed(input: MutationOutUnnamedInput!): MutationOutUnnamedPayload
  noArgsMutation(input: NoArgsMutationInput!): NoArgsMutationPayload
  returnVoidMutation(input: ReturnVoidMutationInput!): ReturnVoidMutationPayload
  mutationIntervalArray(input: MutationIntervalArrayInput!): MutationIntervalArrayPayload
  mutationIntervalSet(input: MutationIntervalSetInput!): MutationIntervalSetPayload
  mutationTextArray(input: MutationTextArrayInput!): MutationTextArrayPayload
  mutationInOut(input: MutationInOutInput!): MutationInOutPayload
  mutationReturnsTableOneCol(input: MutationReturnsTableOneColInput!): MutationReturnsTableOneColPayload
  jsonIdentityMutation(input: JsonIdentityMutationInput!): JsonIdentityMutationPayload
  jsonbIdentityMutation(input: JsonbIdentityMutationInput!): JsonbIdentityMutationPayload
  jsonbIdentityMutationPlpgsql(input: JsonbIdentityMutationPlpgsqlInput!): JsonbIdentityMutationPlpgsqlPayload
  jsonbIdentityMutationPlpgsqlWithDefault(input: JsonbIdentityMutationPlpgsqlWithDefaultInput!): JsonbIdentityMutationPlpgsqlWithDefaultPayload
  add1Mutation(input: Add1MutationInput!): Add1MutationPayload
  add2Mutation(input: Add2MutationInput!): Add2MutationPayload
  add3Mutation(input: Add3MutationInput!): Add3MutationPayload
  add4Mutation(input: Add4MutationInput!): Add4MutationPayload
  add4MutationError(input: Add4MutationErrorInput!): Add4MutationErrorPayload
  mult1(input: Mult1Input!): Mult1Payload
  mult2(input: Mult2Input!): Mult2Payload
  mult3(input: Mult3Input!): Mult3Payload
  mult4(input: Mult4Input!): Mult4Payload
  mutationInInout(input: MutationInInoutInput!): MutationInInoutPayload
  mutationOutOut(input: MutationOutOutInput!): MutationOutOutPayload
  mutationOutOutSetof(input: MutationOutOutSetofInput!): MutationOutOutSetofPayload
  mutationOutOutUnnamed(input: MutationOutOutUnnamedInput!): MutationOutOutUnnamedPayload
  intSetMutation(input: IntSetMutationInput!): IntSetMutationPayload
  mutationOutUnnamedOutOutUnnamed(input: MutationOutUnnamedOutOutUnnamedInput!): MutationOutUnnamedOutOutUnnamedPayload
  mutationReturnsTableMultiCol(input: MutationReturnsTableMultiColInput!): MutationReturnsTableMultiColPayload
  listBdeMutation(input: ListBdeMutationInput!): ListBdeMutationPayload
  guidFn(input: GuidFnInput!): GuidFnPayload
  authenticateFail(input: AuthenticateFailInput!): AuthenticateFailPayload
  authenticate(input: AuthenticateInput!): AuthenticatePayload
  typesMutation(input: TypesMutationInput!): TypesMutationPayload
  leftArmIdentity(input: LeftArmIdentityInput!): LeftArmIdentityPayload
  issue756Mutation(input: Issue756MutationInput!): Issue756MutationPayload
  issue756SetMutation(input: Issue756SetMutationInput!): Issue756SetMutationPayload
  authenticateMany(input: AuthenticateManyInput!): AuthenticateManyPayload
  authenticatePayload(input: AuthenticatePayloadInput!): AuthenticatePayloadPayload
  mutationOutOutCompoundType(input: MutationOutOutCompoundTypeInput!): MutationOutOutCompoundTypePayload
  tableMutation(input: TableMutationInput!): TableMutationPayload
  compoundTypeMutation(input: CompoundTypeMutationInput!): CompoundTypeMutationPayload
  compoundTypeSetMutation(input: CompoundTypeSetMutationInput!): CompoundTypeSetMutationPayload
  listOfCompoundTypesMutation(input: ListOfCompoundTypesMutationInput!): ListOfCompoundTypesMutationPayload
  mutationOutComplex(input: MutationOutComplexInput!): MutationOutComplexPayload
  mutationOutComplexSetof(input: MutationOutComplexSetofInput!): MutationOutComplexSetofPayload
  mutationCompoundTypeArray(input: MutationCompoundTypeArrayInput!): MutationCompoundTypeArrayPayload
  compoundTypeArrayMutation(input: CompoundTypeArrayMutationInput!): CompoundTypeArrayMutationPayload
  postMany(input: PostManyInput!): PostManyPayload
  mutationOutTable(input: MutationOutTableInput!): MutationOutTablePayload
  mutationOutTableSetof(input: MutationOutTableSetofInput!): MutationOutTableSetofPayload
  tableSetMutation(input: TableSetMutationInput!): TableSetMutationPayload
  typeFunctionConnectionMutation(input: TypeFunctionConnectionMutationInput!): TypeFunctionConnectionMutationPayload
  typeFunctionMutation(input: TypeFunctionMutationInput!): TypeFunctionMutationPayload
  typeFunctionListMutation(input: TypeFunctionListMutationInput!): TypeFunctionListMutationPayload
  createInput(input: CreateInputInput!): CreateInputPayload
  createPatch(input: CreatePatchInput!): CreatePatchPayload
  createReserved(input: CreateReservedInput!): CreateReservedPayload
  createReservedPatchRecord(input: CreateReservedPatchRecordInput!): CreateReservedPatchRecordPayload
  createReservedInputRecord(input: CreateReservedInputRecordInput!): CreateReservedInputRecordPayload
  createDefaultValue(input: CreateDefaultValueInput!): CreateDefaultValuePayload
  createForeignKey(input: CreateForeignKeyInput!): CreateForeignKeyPayload
  createNoPrimaryKey(input: CreateNoPrimaryKeyInput!): CreateNoPrimaryKeyPayload
  createTestview(input: CreateTestviewInput!): CreateTestviewPayload
  createMyTable(input: CreateMyTableInput!): CreateMyTablePayload
  createViewTable(input: CreateViewTableInput!): CreateViewTablePayload
  createCompoundKey(input: CreateCompoundKeyInput!): CreateCompoundKeyPayload
  createSimilarTable1(input: CreateSimilarTable1Input!): CreateSimilarTable1Payload
  createSimilarTable2(input: CreateSimilarTable2Input!): CreateSimilarTable2Payload
  createUpdatableView(input: CreateUpdatableViewInput!): CreateUpdatableViewPayload
  createNullTestRecord(input: CreateNullTestRecordInput!): CreateNullTestRecordPayload
  createEdgeCase(input: CreateEdgeCaseInput!): CreateEdgeCasePayload
  createLeftArm(input: CreateLeftArmInput!): CreateLeftArmPayload
  createIssue756(input: CreateIssue756Input!): CreateIssue756Payload
  createPost(input: CreatePostInput!): CreatePostPayload
  createPerson(input: CreatePersonInput!): CreatePersonPayload
  createList(input: CreateListInput!): CreateListPayload
  createType(input: CreateTypeInput!): CreateTypePayload
  updateInput(input: UpdateInputInput!): UpdateInputPayload
  updateInputById(input: UpdateInputByIdInput!): UpdateInputPayload
  updatePatch(input: UpdatePatchInput!): UpdatePatchPayload
  updatePatchById(input: UpdatePatchByIdInput!): UpdatePatchPayload
  updateReserved(input: UpdateReservedInput!): UpdateReservedPayload
  updateReservedById(input: UpdateReservedByIdInput!): UpdateReservedPayload
  updateReservedPatchRecord(input: UpdateReservedPatchRecordInput!): UpdateReservedPatchRecordPayload
  updateReservedPatchRecordById(input: UpdateReservedPatchRecordByIdInput!): UpdateReservedPatchRecordPayload
  updateReservedInputRecord(input: UpdateReservedInputRecordInput!): UpdateReservedInputRecordPayload
  updateReservedInputRecordById(input: UpdateReservedInputRecordByIdInput!): UpdateReservedInputRecordPayload
  updateDefaultValue(input: UpdateDefaultValueInput!): UpdateDefaultValuePayload
  updateDefaultValueById(input: UpdateDefaultValueByIdInput!): UpdateDefaultValuePayload
  updateNoPrimaryKeyById(input: UpdateNoPrimaryKeyByIdInput!): UpdateNoPrimaryKeyPayload
  updateMyTable(input: UpdateMyTableInput!): UpdateMyTablePayload
  updateMyTableById(input: UpdateMyTableByIdInput!): UpdateMyTablePayload
  updateViewTable(input: UpdateViewTableInput!): UpdateViewTablePayload
  updateViewTableById(input: UpdateViewTableByIdInput!): UpdateViewTablePayload
  updateCompoundKey(input: UpdateCompoundKeyInput!): UpdateCompoundKeyPayload
  updateCompoundKeyByPersonId1AndPersonId2(input: UpdateCompoundKeyByPersonId1AndPersonId2Input!): UpdateCompoundKeyPayload
  updateSimilarTable1(input: UpdateSimilarTable1Input!): UpdateSimilarTable1Payload
  updateSimilarTable1ById(input: UpdateSimilarTable1ByIdInput!): UpdateSimilarTable1Payload
  updateSimilarTable2(input: UpdateSimilarTable2Input!): UpdateSimilarTable2Payload
  updateSimilarTable2ById(input: UpdateSimilarTable2ByIdInput!): UpdateSimilarTable2Payload
  updateNullTestRecord(input: UpdateNullTestRecordInput!): UpdateNullTestRecordPayload
  updateNullTestRecordById(input: UpdateNullTestRecordByIdInput!): UpdateNullTestRecordPayload
  updateLeftArm(input: UpdateLeftArmInput!): UpdateLeftArmPayload
  updateLeftArmById(input: UpdateLeftArmByIdInput!): UpdateLeftArmPayload
  updateLeftArmByPersonId(input: UpdateLeftArmByPersonIdInput!): UpdateLeftArmPayload
  updateIssue756(input: UpdateIssue756Input!): UpdateIssue756Payload
  updateIssue756ById(input: UpdateIssue756ByIdInput!): UpdateIssue756Payload
  updatePost(input: UpdatePostInput!): UpdatePostPayload
  updatePostById(input: UpdatePostByIdInput!): UpdatePostPayload
  updatePerson(input: UpdatePersonInput!): UpdatePersonPayload
  updatePersonById(input: UpdatePersonByIdInput!): UpdatePersonPayload
  updatePersonByEmail(input: UpdatePersonByEmailInput!): UpdatePersonPayload
  updateList(input: UpdateListInput!): UpdateListPayload
  updateListById(input: UpdateListByIdInput!): UpdateListPayload
  updateType(input: UpdateTypeInput!): UpdateTypePayload
  updateTypeById(input: UpdateTypeByIdInput!): UpdateTypePayload
  deleteInput(input: DeleteInputInput!): DeleteInputPayload
  deleteInputById(input: DeleteInputByIdInput!): DeleteInputPayload
  deletePatch(input: DeletePatchInput!): DeletePatchPayload
  deletePatchById(input: DeletePatchByIdInput!): DeletePatchPayload
  deleteReserved(input: DeleteReservedInput!): DeleteReservedPayload
  deleteReservedById(input: DeleteReservedByIdInput!): DeleteReservedPayload
  deleteReservedPatchRecord(input: DeleteReservedPatchRecordInput!): DeleteReservedPatchRecordPayload
  deleteReservedPatchRecordById(input: DeleteReservedPatchRecordByIdInput!): DeleteReservedPatchRecordPayload
  deleteReservedInputRecord(input: DeleteReservedInputRecordInput!): DeleteReservedInputRecordPayload
  deleteReservedInputRecordById(input: DeleteReservedInputRecordByIdInput!): DeleteReservedInputRecordPayload
  deleteDefaultValue(input: DeleteDefaultValueInput!): DeleteDefaultValuePayload
  deleteDefaultValueById(input: DeleteDefaultValueByIdInput!): DeleteDefaultValuePayload
  deleteNoPrimaryKeyById(input: DeleteNoPrimaryKeyByIdInput!): DeleteNoPrimaryKeyPayload
  deleteMyTable(input: DeleteMyTableInput!): DeleteMyTablePayload
  deleteMyTableById(input: DeleteMyTableByIdInput!): DeleteMyTablePayload
  deleteViewTable(input: DeleteViewTableInput!): DeleteViewTablePayload
  deleteViewTableById(input: DeleteViewTableByIdInput!): DeleteViewTablePayload
  deleteCompoundKey(input: DeleteCompoundKeyInput!): DeleteCompoundKeyPayload
  deleteCompoundKeyByPersonId1AndPersonId2(input: DeleteCompoundKeyByPersonId1AndPersonId2Input!): DeleteCompoundKeyPayload
  deleteSimilarTable1(input: DeleteSimilarTable1Input!): DeleteSimilarTable1Payload
  deleteSimilarTable1ById(input: DeleteSimilarTable1ByIdInput!): DeleteSimilarTable1Payload
  deleteSimilarTable2(input: DeleteSimilarTable2Input!): DeleteSimilarTable2Payload
  deleteSimilarTable2ById(input: DeleteSimilarTable2ByIdInput!): DeleteSimilarTable2Payload
  deleteNullTestRecord(input: DeleteNullTestRecordInput!): DeleteNullTestRecordPayload
  deleteNullTestRecordById(input: DeleteNullTestRecordByIdInput!): DeleteNullTestRecordPayload
  deleteLeftArm(input: DeleteLeftArmInput!): DeleteLeftArmPayload
  deleteLeftArmById(input: DeleteLeftArmByIdInput!): DeleteLeftArmPayload
  deleteLeftArmByPersonId(input: DeleteLeftArmByPersonIdInput!): DeleteLeftArmPayload
  deleteIssue756(input: DeleteIssue756Input!): DeleteIssue756Payload
  deleteIssue756ById(input: DeleteIssue756ByIdInput!): DeleteIssue756Payload
  deletePost(input: DeletePostInput!): DeletePostPayload
  deletePostById(input: DeletePostByIdInput!): DeletePostPayload
  deletePerson(input: DeletePersonInput!): DeletePersonPayload
  deletePersonById(input: DeletePersonByIdInput!): DeletePersonPayload
  deletePersonByEmail(input: DeletePersonByEmailInput!): DeletePersonPayload
  deleteList(input: DeleteListInput!): DeleteListPayload
  deleteListById(input: DeleteListByIdInput!): DeleteListPayload
  deleteType(input: DeleteTypeInput!): DeleteTypePayload
  deleteTypeById(input: DeleteTypeByIdInput!): DeleteTypePayload
}

type MutationOutPayload {
  clientMutationId: String
  o: Int
  query: Query
}

input MutationOutInput {
  clientMutationId: String
}

type MutationOutSetofPayload {
  clientMutationId: String
  os: [Int]
  query: Query
}

input MutationOutSetofInput {
  clientMutationId: String
}

type MutationOutUnnamedPayload {
  clientMutationId: String
  integer: Int
  query: Query
}

input MutationOutUnnamedInput {
  clientMutationId: String
}

type NoArgsMutationPayload {
  clientMutationId: String
  integer: Int
  query: Query
}

input NoArgsMutationInput {
  clientMutationId: String
}

type ReturnVoidMutationPayload {
  clientMutationId: String
  query: Query
}

input ReturnVoidMutationInput {
  clientMutationId: String
}

type MutationIntervalArrayPayload {
  clientMutationId: String
  intervals: [Interval]
  query: Query
}

input MutationIntervalArrayInput {
  clientMutationId: String
}

type MutationIntervalSetPayload {
  clientMutationId: String
  intervals: [Interval]
  query: Query
}

input MutationIntervalSetInput {
  clientMutationId: String
}

type MutationTextArrayPayload {
  clientMutationId: String
  strings: [String]
  query: Query
}

input MutationTextArrayInput {
  clientMutationId: String
}

type MutationInOutPayload {
  clientMutationId: String
  o: Int
  query: Query
}

input MutationInOutInput {
  clientMutationId: String
  i: Int
}

type MutationReturnsTableOneColPayload {
  clientMutationId: String
  col1S: [Int]
  query: Query
}

input MutationReturnsTableOneColInput {
  clientMutationId: String
  i: Int
}

type JsonIdentityMutationPayload {
  clientMutationId: String
  json: JSON
  query: Query
}

input JsonIdentityMutationInput {
  clientMutationId: String
  json: JSON
}

type JsonbIdentityMutationPayload {
  clientMutationId: String
  json: JSON
  query: Query
}

input JsonbIdentityMutationInput {
  clientMutationId: String
  json: JSON
}

type JsonbIdentityMutationPlpgsqlPayload {
  clientMutationId: String
  json: JSON
  query: Query
}

input JsonbIdentityMutationPlpgsqlInput {
  clientMutationId: String
  _theJson: JSON!
}

type JsonbIdentityMutationPlpgsqlWithDefaultPayload {
  clientMutationId: String
  json: JSON
  query: Query
}

input JsonbIdentityMutationPlpgsqlWithDefaultInput {
  clientMutationId: String
  _theJson: JSON
}

type Add1MutationPayload {
  clientMutationId: String
  integer: Int!
  query: Query
}

input Add1MutationInput {
  clientMutationId: String
  arg0: Int!
  arg1: Int!
}

type Add2MutationPayload {
  clientMutationId: String
  integer: Int
  query: Query
}

input Add2MutationInput {
  clientMutationId: String
  a: Int!
  b: Int
}

type Add3MutationPayload {
  clientMutationId: String
  integer: Int
  query: Query
}

input Add3MutationInput {
  clientMutationId: String
  a: Int
  arg1: Int
}

type Add4MutationPayload {
  clientMutationId: String
  integer: Int
  query: Query
}

input Add4MutationInput {
  clientMutationId: String
  arg0: Int
  b: Int
}

type Add4MutationErrorPayload {
  clientMutationId: String
  integer: Int
  query: Query
}

input Add4MutationErrorInput {
  clientMutationId: String
  arg0: Int
  b: Int
}

type Mult1Payload {
  clientMutationId: String
  integer: Int
  query: Query
}

input Mult1Input {
  clientMutationId: String
  arg0: Int
  arg1: Int
}

type Mult2Payload {
  clientMutationId: String
  integer: Int
  query: Query
}

input Mult2Input {
  clientMutationId: String
  arg0: Int
  arg1: Int
}

type Mult3Payload {
  clientMutationId: String
  integer: Int
  query: Query
}

input Mult3Input {
  clientMutationId: String
  arg0: Int!
  arg1: Int!
}

type Mult4Payload {
  clientMutationId: String
  integer: Int
  query: Query
}

input Mult4Input {
  clientMutationId: String
  arg0: Int!
  arg1: Int!
}

type MutationInInoutPayload {
  clientMutationId: String
  ino: Int
  query: Query
}

input MutationInInoutInput {
  clientMutationId: String
  i: Int
  ino: Int
}

type MutationOutOutPayload {
  clientMutationId: String
  result: MutationOutOutRecord
  query: Query
}

type MutationOutOutRecord {
  firstOut: Int
  secondOut: String
}

input MutationOutOutInput {
  clientMutationId: String
}

type MutationOutOutSetofPayload {
  clientMutationId: String
  results: [MutationOutOutSetofRecord]
  query: Query
}

type MutationOutOutSetofRecord {
  o1: Int
  o2: String
}

input MutationOutOutSetofInput {
  clientMutationId: String
}

type MutationOutOutUnnamedPayload {
  clientMutationId: String
  result: MutationOutOutUnnamedRecord
  query: Query
}

type MutationOutOutUnnamedRecord {
  arg1: Int
  arg2: String
}

input MutationOutOutUnnamedInput {
  clientMutationId: String
}

type IntSetMutationPayload {
  clientMutationId: String
  integers: [Int]
  query: Query
}

input IntSetMutationInput {
  clientMutationId: String
  x: Int
  y: Int
  z: Int
}

type MutationOutUnnamedOutOutUnnamedPayload {
  clientMutationId: String
  result: MutationOutUnnamedOutOutUnnamedRecord
  query: Query
}

type MutationOutUnnamedOutOutUnnamedRecord {
  arg1: Int
  o2: String
  arg3: Int
}

input MutationOutUnnamedOutOutUnnamedInput {
  clientMutationId: String
}

type MutationReturnsTableMultiColPayload {
  clientMutationId: String
  results: [MutationReturnsTableMultiColRecord]
  query: Query
}

type MutationReturnsTableMultiColRecord {
  col1: Int
  col2: String
}

input MutationReturnsTableMultiColInput {
  clientMutationId: String
  i: Int
}

type ListBdeMutationPayload {
  clientMutationId: String
  uuids: [UUID]
  query: Query
}

input ListBdeMutationInput {
  clientMutationId: String
  b: [String]
  d: String
  e: String
}

type GuidFnPayload {
  clientMutationId: String
  guid: Guid
  query: Query
}

scalar Guid

input GuidFnInput {
  clientMutationId: String
  g: Guid
}

type AuthenticateFailPayload {
  clientMutationId: String
  jwtToken: JwtToken
  query: Query
}

type JwtToken {
  role: String
  exp: BigInt
  a: Int
  b: BigFloat
  c: BigInt
}

input AuthenticateFailInput {
  clientMutationId: String
}

type AuthenticatePayload {
  clientMutationId: String
  jwtToken: JwtToken
  query: Query
}

input AuthenticateInput {
  clientMutationId: String
  a: Int
  b: BigFloat
  c: BigInt
}

type TypesMutationPayload {
  clientMutationId: String
  boolean: Boolean
  query: Query
}

input TypesMutationInput {
  clientMutationId: String
  a: BigInt!
  b: Boolean!
  c: String!
  d: [Int]!
  e: JSON!
  f: FloatRangeInput!
}

type LeftArmIdentityPayload {
  clientMutationId: String
  leftArm: LeftArm
  query: Query
  leftArmEdge(orderBy: [LeftArmsOrderBy!]! = [PRIMARY_KEY_ASC]): LeftArmsEdge
  personByPersonId: Person
}

input LeftArmIdentityInput {
  clientMutationId: String
  leftArm: LeftArmBaseInput
}

input LeftArmBaseInput {
  id: Int
  personId: Int
  lengthInMetres: Float
  mood: String
}

type Issue756MutationPayload {
  clientMutationId: String
  issue756: Issue756
  query: Query
  issue756Edge(orderBy: [Issue756SOrderBy!]! = [PRIMARY_KEY_ASC]): Issue756SEdge
}

input Issue756MutationInput {
  clientMutationId: String
}

type Issue756SetMutationPayload {
  clientMutationId: String
  issue756S: [Issue756]
  query: Query
}

input Issue756SetMutationInput {
  clientMutationId: String
}

type AuthenticateManyPayload {
  clientMutationId: String
  jwtTokens: [JwtToken]
  query: Query
}

input AuthenticateManyInput {
  clientMutationId: String
  a: Int
  b: BigFloat
  c: BigInt
}

type AuthenticatePayloadPayload {
  clientMutationId: String
  authPayload: AuthPayload
  query: Query
  personById: Person
}

type AuthPayload {
  jwt: JwtToken
  id: Int
  admin: Boolean
  personById: Person
}

input AuthenticatePayloadInput {
  clientMutationId: String
  a: Int
  b: BigFloat
  c: BigInt
}

type MutationOutOutCompoundTypePayload {
  clientMutationId: String
  result: MutationOutOutCompoundTypeRecord
  query: Query
}

type MutationOutOutCompoundTypeRecord {
  o1: Int
  o2: CompoundType
}

input MutationOutOutCompoundTypeInput {
  clientMutationId: String
  i1: Int
}

type TableMutationPayload {
  clientMutationId: String
  post: Post
  query: Query
  postEdge(orderBy: [PostsOrderBy!]! = [PRIMARY_KEY_ASC]): PostsEdge
  personByAuthorId: Person
}

input TableMutationInput {
  clientMutationId: String
  id: Int
}

type PostWithSuffixPayload {
  clientMutationId: String
  post: Post
  query: Query
  postEdge(orderBy: [PostsOrderBy!]! = [PRIMARY_KEY_ASC]): PostsEdge
  personByAuthorId: Person
}

input PostWithSuffixInput {
  clientMutationId: String
  post: PostInput
  suffix: String
}

input PostInput {
  id: Int
  headline: String!
  body: String
  authorId: Int
  enums: [AnEnum]
  comptypes: [ComptypeInput]
}

type CompoundTypeMutationPayload {
  clientMutationId: String
  compoundType: CompoundType
  query: Query
}

input CompoundTypeMutationInput {
  clientMutationId: String
  object: CompoundTypeInput
}

type CompoundTypeSetMutationPayload {
  clientMutationId: String
  compoundTypes: [CompoundType]
  query: Query
}

input CompoundTypeSetMutationInput {
  clientMutationId: String
  object: CompoundTypeInput
}

type ListOfCompoundTypesMutationPayload {
  clientMutationId: String
  compoundTypes: [CompoundType]
  query: Query
}

input ListOfCompoundTypesMutationInput {
  clientMutationId: String
  records: [CompoundTypeInput]
}

type MutationOutComplexPayload {
  clientMutationId: String
  result: MutationOutComplexRecord
  query: Query
}

type MutationOutComplexRecord {
  x: Int
  y: CompoundType
  z: Person
}

input MutationOutComplexInput {
  clientMutationId: String
  a: Int
  b: String
}

type MutationOutComplexSetofPayload {
  clientMutationId: String
  results: [MutationOutComplexSetofRecord]
  query: Query
}

type MutationOutComplexSetofRecord {
  x: Int
  y: CompoundType
  z: Person
}

input MutationOutComplexSetofInput {
  clientMutationId: String
  a: Int
  b: String
}

type MutationCompoundTypeArrayPayload {
  clientMutationId: String
  compoundTypes: [CompoundType]
  query: Query
}

input MutationCompoundTypeArrayInput {
  clientMutationId: String
  object: CompoundTypeInput
}

type CompoundTypeArrayMutationPayload {
  clientMutationId: String
  compoundTypes: [CompoundType]
  query: Query
}

input CompoundTypeArrayMutationInput {
  clientMutationId: String
  object: CompoundTypeInput
}

type PostManyPayload {
  clientMutationId: String
  posts: [Post]
  query: Query
}

input PostManyInput {
  clientMutationId: String
  posts: [PostInput]
}

type MutationOutTablePayload {
  clientMutationId: String
  person: Person
  query: Query
  personEdge(orderBy: [PeopleOrderBy!]! = [PRIMARY_KEY_ASC]): PeopleEdge
}

input MutationOutTableInput {
  clientMutationId: String
}

type MutationOutTableSetofPayload {
  clientMutationId: String
  people: [Person]
  query: Query
}

input MutationOutTableSetofInput {
  clientMutationId: String
}

type TableSetMutationPayload {
  clientMutationId: String
  people: [Person]
  query: Query
}

input TableSetMutationInput {
  clientMutationId: String
}

type TypeFunctionConnectionMutationPayload {
  clientMutationId: String
  types: [Type]
  query: Query
}

input TypeFunctionConnectionMutationInput {
  clientMutationId: String
}

type TypeFunctionMutationPayload {
  clientMutationId: String
  type: Type
  query: Query
  typeEdge(orderBy: [TypesOrderBy!]! = [PRIMARY_KEY_ASC]): TypesEdge
  postBySmallint: Post
  postById: Post
}

input TypeFunctionMutationInput {
  clientMutationId: String
  id: Int
}

type TypeFunctionListMutationPayload {
  clientMutationId: String
  types: [Type]
  query: Query
}

input TypeFunctionListMutationInput {
  clientMutationId: String
}

type CreateInputPayload {
  clientMutationId: String
  input: Input
  query: Query
  inputEdge(orderBy: [InputsOrderBy!]! = [PRIMARY_KEY_ASC]): InputsEdge
}

input CreateInputInput {
  clientMutationId: String
  input: InputInput!
}

input InputInput {
  id: Int
}

type CreatePatchPayload {
  clientMutationId: String
  patch: Patch
  query: Query
  patchEdge(orderBy: [PatchesOrderBy!]! = [PRIMARY_KEY_ASC]): PatchesEdge
}

input CreatePatchInput {
  clientMutationId: String
  patch: PatchInput!
}

input PatchInput {
  id: Int
}

type CreateReservedPayload {
  clientMutationId: String
  reserved: Reserved
  query: Query
  reservedEdge(orderBy: [ReservedsOrderBy!]! = [PRIMARY_KEY_ASC]): ReservedsEdge
}

input CreateReservedInput {
  clientMutationId: String
  reserved: ReservedInput!
}

input ReservedInput {
  id: Int
}

type CreateReservedPatchRecordPayload {
  clientMutationId: String
  reservedPatchRecord: ReservedPatchRecord
  query: Query
  reservedPatchRecordEdge(orderBy: [ReservedPatchRecordsOrderBy!]! = [PRIMARY_KEY_ASC]): ReservedPatchRecordsEdge
}

input CreateReservedPatchRecordInput {
  clientMutationId: String
  reservedPatchRecord: ReservedPatchRecordInput!
}

input ReservedPatchRecordInput {
  id: Int
}

type CreateReservedInputRecordPayload {
  clientMutationId: String
  reservedInputRecord: ReservedInputRecord
  query: Query
  reservedInputRecordEdge(orderBy: [ReservedInputRecordsOrderBy!]! = [PRIMARY_KEY_ASC]): ReservedInputRecordsEdge
}

input CreateReservedInputRecordInput {
  clientMutationId: String
  reservedInputRecord: ReservedInputRecordInput!
}

input ReservedInputRecordInput {
  id: Int
}

type CreateDefaultValuePayload {
  clientMutationId: String
  defaultValue: DefaultValue
  query: Query
  defaultValueEdge(orderBy: [DefaultValuesOrderBy!]! = [PRIMARY_KEY_ASC]): DefaultValuesEdge
}

input CreateDefaultValueInput {
  clientMutationId: String
  defaultValue: DefaultValueInput!
}

input DefaultValueInput {
  id: Int
  nullValue: String
}

type CreateForeignKeyPayload {
  clientMutationId: String
  foreignKey: ForeignKey
  query: Query
  compoundKeyByCompoundKey1AndCompoundKey2: CompoundKey
  personByPersonId: Person
}

input CreateForeignKeyInput {
  clientMutationId: String
  foreignKey: ForeignKeyInput!
}

input ForeignKeyInput {
  personId: Int
  compoundKey1: Int
  compoundKey2: Int
}

type CreateNoPrimaryKeyPayload {
  clientMutationId: String
  noPrimaryKey: NoPrimaryKey
  query: Query
}

input CreateNoPrimaryKeyInput {
  clientMutationId: String
  noPrimaryKey: NoPrimaryKeyInput!
}

input NoPrimaryKeyInput {
  id: Int!
  str: String!
}

type CreateTestviewPayload {
  clientMutationId: String
  testview: Testview
  query: Query
}

input CreateTestviewInput {
  clientMutationId: String
  testview: TestviewInput!
}

input TestviewInput {
  testviewid: Int
  col1: Int
  col2: Int
}

type CreateMyTablePayload {
  clientMutationId: String
  myTable: MyTable
  query: Query
  myTableEdge(orderBy: [MyTablesOrderBy!]! = [PRIMARY_KEY_ASC]): MyTablesEdge
}

input CreateMyTableInput {
  clientMutationId: String
  myTable: MyTableInput!
}

input MyTableInput {
  id: Int
  jsonData: JSON
}

type CreatePersonSecretPayload {
  clientMutationId: String
  query: Query
  personByPersonId: Person
}

input CreatePersonSecretInput {
  clientMutationId: String
  personSecret: PersonSecretInput!
}

input PersonSecretInput {
  personId: Int!
  secret: String
}

type CreateViewTablePayload {
  clientMutationId: String
  viewTable: ViewTable
  query: Query
  viewTableEdge(orderBy: [ViewTablesOrderBy!]! = [PRIMARY_KEY_ASC]): ViewTablesEdge
}

input CreateViewTableInput {
  clientMutationId: String
  viewTable: ViewTableInput!
}

input ViewTableInput {
  id: Int
  col1: Int
  col2: Int
}

type CreateCompoundKeyPayload {
  clientMutationId: String
  compoundKey: CompoundKey
  query: Query
  compoundKeyEdge(orderBy: [CompoundKeysOrderBy!]! = [PRIMARY_KEY_ASC]): CompoundKeysEdge
  personByPersonId1: Person
  personByPersonId2: Person
}

input CreateCompoundKeyInput {
  clientMutationId: String
  compoundKey: CompoundKeyInput!
}

input CompoundKeyInput {
  personId2: Int!
  personId1: Int!
  extra: Boolean
}

type CreateSimilarTable1Payload {
  clientMutationId: String
  similarTable1: SimilarTable1
  query: Query
  similarTable1Edge(orderBy: [SimilarTable1SOrderBy!]! = [PRIMARY_KEY_ASC]): SimilarTable1SEdge
}

input CreateSimilarTable1Input {
  clientMutationId: String
  similarTable1: SimilarTable1Input!
}

input SimilarTable1Input {
  id: Int
  col1: Int
  col2: Int
  col3: Int!
}

type CreateSimilarTable2Payload {
  clientMutationId: String
  similarTable2: SimilarTable2
  query: Query
  similarTable2Edge(orderBy: [SimilarTable2SOrderBy!]! = [PRIMARY_KEY_ASC]): SimilarTable2SEdge
}

input CreateSimilarTable2Input {
  clientMutationId: String
  similarTable2: SimilarTable2Input!
}

input SimilarTable2Input {
  id: Int
  col3: Int!
  col4: Int
  col5: Int
}

type CreateUpdatableViewPayload {
  clientMutationId: String
  updatableView: UpdatableView
  query: Query
}

input CreateUpdatableViewInput {
  clientMutationId: String
  updatableView: UpdatableViewInput!
}

input UpdatableViewInput {
  x: Int
  name: String
  description: String
  constant: Int
}

type CreateNullTestRecordPayload {
  clientMutationId: String
  nullTestRecord: NullTestRecord
  query: Query
  nullTestRecordEdge(orderBy: [NullTestRecordsOrderBy!]! = [PRIMARY_KEY_ASC]): NullTestRecordsEdge
}

input CreateNullTestRecordInput {
  clientMutationId: String
  nullTestRecord: NullTestRecordInput!
}

input NullTestRecordInput {
  id: Int
  nullableText: String
  nullableInt: Int
  nonNullText: String!
}

type CreateEdgeCasePayload {
  clientMutationId: String
  edgeCase: EdgeCase
  query: Query
}

input CreateEdgeCaseInput {
  clientMutationId: String
  edgeCase: EdgeCaseInput!
}

input EdgeCaseInput {
  notNullHasDefault: Boolean
  wontCastEasy: Int
  rowId: Int
}

type CreateLeftArmPayload {
  clientMutationId: String
  leftArm: LeftArm
  query: Query
  leftArmEdge(orderBy: [LeftArmsOrderBy!]! = [PRIMARY_KEY_ASC]): LeftArmsEdge
  personByPersonId: Person
}

input CreateLeftArmInput {
  clientMutationId: String
  leftArm: LeftArmInput!
}

input LeftArmInput {
  id: Int
  personId: Int
  lengthInMetres: Float
  mood: String
}

type CreateIssue756Payload {
  clientMutationId: String
  issue756: Issue756
  query: Query
  issue756Edge(orderBy: [Issue756SOrderBy!]! = [PRIMARY_KEY_ASC]): Issue756SEdge
}

input CreateIssue756Input {
  clientMutationId: String
  issue756: Issue756Input!
}

input Issue756Input {
  id: Int
  ts: NotNullTimestamp
}

type CreatePostPayload {
  clientMutationId: String
  post: Post
  query: Query
  postEdge(orderBy: [PostsOrderBy!]! = [PRIMARY_KEY_ASC]): PostsEdge
  personByAuthorId: Person
}

input CreatePostInput {
  clientMutationId: String
  post: PostInput!
}

type CreatePersonPayload {
  clientMutationId: String
  person: Person
  query: Query
  personEdge(orderBy: [PeopleOrderBy!]! = [PRIMARY_KEY_ASC]): PeopleEdge
}

input CreatePersonInput {
  clientMutationId: String
  person: PersonInput!
}

input PersonInput {
  id: Int
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

type CreateListPayload {
  clientMutationId: String
  list: List
  query: Query
  listEdge(orderBy: [ListsOrderBy!]! = [PRIMARY_KEY_ASC]): ListsEdge
}

input CreateListInput {
  clientMutationId: String
  list: ListInput!
}

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

type CreateTypePayload {
  clientMutationId: String
  type: Type
  query: Query
  typeEdge(orderBy: [TypesOrderBy!]! = [PRIMARY_KEY_ASC]): TypesEdge
  postBySmallint: Post
  postById: Post
}

input CreateTypeInput {
  clientMutationId: String
  type: TypeInput!
}

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

type UpdateInputPayload {
  clientMutationId: String
  input: Input
  query: Query
  inputEdge(orderBy: [InputsOrderBy!]! = [PRIMARY_KEY_ASC]): InputsEdge
}

input UpdateInputInput {
  clientMutationId: String
  nodeId: ID!
  inputPatch: InputPatch!
}

input InputPatch {
  id: Int
}

input UpdateInputByIdInput {
  clientMutationId: String
  id: Int!
  inputPatch: InputPatch!
}

type UpdatePatchPayload {
  clientMutationId: String
  patch: Patch
  query: Query
  patchEdge(orderBy: [PatchesOrderBy!]! = [PRIMARY_KEY_ASC]): PatchesEdge
}

input UpdatePatchInput {
  clientMutationId: String
  nodeId: ID!
  patchPatch: PatchPatch!
}

input PatchPatch {
  id: Int
}

input UpdatePatchByIdInput {
  clientMutationId: String
  id: Int!
  patchPatch: PatchPatch!
}

type UpdateReservedPayload {
  clientMutationId: String
  reserved: Reserved
  query: Query
  reservedEdge(orderBy: [ReservedsOrderBy!]! = [PRIMARY_KEY_ASC]): ReservedsEdge
}

input UpdateReservedInput {
  clientMutationId: String
  nodeId: ID!
  reservedPatch: ReservedPatch!
}

input ReservedPatch {
  id: Int
}

input UpdateReservedByIdInput {
  clientMutationId: String
  id: Int!
  reservedPatch: ReservedPatch!
}

type UpdateReservedPatchRecordPayload {
  clientMutationId: String
  reservedPatchRecord: ReservedPatchRecord
  query: Query
  reservedPatchRecordEdge(orderBy: [ReservedPatchRecordsOrderBy!]! = [PRIMARY_KEY_ASC]): ReservedPatchRecordsEdge
}

input UpdateReservedPatchRecordInput {
  clientMutationId: String
  nodeId: ID!
  reservedPatchRecordPatch: ReservedPatchRecordPatch!
}

input ReservedPatchRecordPatch {
  id: Int
}

input UpdateReservedPatchRecordByIdInput {
  clientMutationId: String
  id: Int!
  reservedPatchRecordPatch: ReservedPatchRecordPatch!
}

type UpdateReservedInputRecordPayload {
  clientMutationId: String
  reservedInputRecord: ReservedInputRecord
  query: Query
  reservedInputRecordEdge(orderBy: [ReservedInputRecordsOrderBy!]! = [PRIMARY_KEY_ASC]): ReservedInputRecordsEdge
}

input UpdateReservedInputRecordInput {
  clientMutationId: String
  nodeId: ID!
  reservedInputRecordPatch: ReservedInputRecordPatch!
}

input ReservedInputRecordPatch {
  id: Int
}

input UpdateReservedInputRecordByIdInput {
  clientMutationId: String
  id: Int!
  reservedInputRecordPatch: ReservedInputRecordPatch!
}

type UpdateDefaultValuePayload {
  clientMutationId: String
  defaultValue: DefaultValue
  query: Query
  defaultValueEdge(orderBy: [DefaultValuesOrderBy!]! = [PRIMARY_KEY_ASC]): DefaultValuesEdge
}

input UpdateDefaultValueInput {
  clientMutationId: String
  nodeId: ID!
  defaultValuePatch: DefaultValuePatch!
}

input DefaultValuePatch {
  id: Int
  nullValue: String
}

input UpdateDefaultValueByIdInput {
  clientMutationId: String
  id: Int!
  defaultValuePatch: DefaultValuePatch!
}

type UpdateNoPrimaryKeyPayload {
  clientMutationId: String
  noPrimaryKey: NoPrimaryKey
  query: Query
}

input UpdateNoPrimaryKeyByIdInput {
  clientMutationId: String
  id: Int!
  noPrimaryKeyPatch: NoPrimaryKeyPatch!
}

input NoPrimaryKeyPatch {
  id: Int
  str: String
}

type UpdateMyTablePayload {
  clientMutationId: String
  myTable: MyTable
  query: Query
  myTableEdge(orderBy: [MyTablesOrderBy!]! = [PRIMARY_KEY_ASC]): MyTablesEdge
}

input UpdateMyTableInput {
  clientMutationId: String
  nodeId: ID!
  myTablePatch: MyTablePatch!
}

input MyTablePatch {
  id: Int
  jsonData: JSON
}

input UpdateMyTableByIdInput {
  clientMutationId: String
  id: Int!
  myTablePatch: MyTablePatch!
}

type UpdatePersonSecretPayload {
  clientMutationId: String
  personSecret: PersonSecret
  query: Query
  personByPersonId: Person
}

input UpdatePersonSecretInput {
  clientMutationId: String
  nodeId: ID!
  personSecretPatch: PersonSecretPatch!
}

input PersonSecretPatch {
  personId: Int
  secret: String
}

input UpdatePersonSecretByPersonIdInput {
  clientMutationId: String
  personId: Int!
  personSecretPatch: PersonSecretPatch!
}

type UpdateViewTablePayload {
  clientMutationId: String
  viewTable: ViewTable
  query: Query
  viewTableEdge(orderBy: [ViewTablesOrderBy!]! = [PRIMARY_KEY_ASC]): ViewTablesEdge
}

input UpdateViewTableInput {
  clientMutationId: String
  nodeId: ID!
  viewTablePatch: ViewTablePatch!
}

input ViewTablePatch {
  id: Int
  col1: Int
  col2: Int
}

input UpdateViewTableByIdInput {
  clientMutationId: String
  id: Int!
  viewTablePatch: ViewTablePatch!
}

type UpdateCompoundKeyPayload {
  clientMutationId: String
  compoundKey: CompoundKey
  query: Query
  compoundKeyEdge(orderBy: [CompoundKeysOrderBy!]! = [PRIMARY_KEY_ASC]): CompoundKeysEdge
  personByPersonId1: Person
  personByPersonId2: Person
}

input UpdateCompoundKeyInput {
  clientMutationId: String
  nodeId: ID!
  compoundKeyPatch: CompoundKeyPatch!
}

input CompoundKeyPatch {
  personId2: Int
  personId1: Int
  extra: Boolean
}

input UpdateCompoundKeyByPersonId1AndPersonId2Input {
  clientMutationId: String
  personId1: Int!
  personId2: Int!
  compoundKeyPatch: CompoundKeyPatch!
}

type UpdateSimilarTable1Payload {
  clientMutationId: String
  similarTable1: SimilarTable1
  query: Query
  similarTable1Edge(orderBy: [SimilarTable1SOrderBy!]! = [PRIMARY_KEY_ASC]): SimilarTable1SEdge
}

input UpdateSimilarTable1Input {
  clientMutationId: String
  nodeId: ID!
  similarTable1Patch: SimilarTable1Patch!
}

input SimilarTable1Patch {
  id: Int
  col1: Int
  col2: Int
  col3: Int
}

input UpdateSimilarTable1ByIdInput {
  clientMutationId: String
  id: Int!
  similarTable1Patch: SimilarTable1Patch!
}

type UpdateSimilarTable2Payload {
  clientMutationId: String
  similarTable2: SimilarTable2
  query: Query
  similarTable2Edge(orderBy: [SimilarTable2SOrderBy!]! = [PRIMARY_KEY_ASC]): SimilarTable2SEdge
}

input UpdateSimilarTable2Input {
  clientMutationId: String
  nodeId: ID!
  similarTable2Patch: SimilarTable2Patch!
}

input SimilarTable2Patch {
  id: Int
  col3: Int
  col4: Int
  col5: Int
}

input UpdateSimilarTable2ByIdInput {
  clientMutationId: String
  id: Int!
  similarTable2Patch: SimilarTable2Patch!
}

type UpdateNullTestRecordPayload {
  clientMutationId: String
  nullTestRecord: NullTestRecord
  query: Query
  nullTestRecordEdge(orderBy: [NullTestRecordsOrderBy!]! = [PRIMARY_KEY_ASC]): NullTestRecordsEdge
}

input UpdateNullTestRecordInput {
  clientMutationId: String
  nodeId: ID!
  nullTestRecordPatch: NullTestRecordPatch!
}

input NullTestRecordPatch {
  id: Int
  nullableText: String
  nullableInt: Int
  nonNullText: String
}

input UpdateNullTestRecordByIdInput {
  clientMutationId: String
  id: Int!
  nullTestRecordPatch: NullTestRecordPatch!
}

type UpdateLeftArmPayload {
  clientMutationId: String
  leftArm: LeftArm
  query: Query
  leftArmEdge(orderBy: [LeftArmsOrderBy!]! = [PRIMARY_KEY_ASC]): LeftArmsEdge
  personByPersonId: Person
}

input UpdateLeftArmInput {
  clientMutationId: String
  nodeId: ID!
  leftArmPatch: LeftArmPatch!
}

input LeftArmPatch {
  id: Int
  personId: Int
  lengthInMetres: Float
  mood: String
}

input UpdateLeftArmByIdInput {
  clientMutationId: String
  id: Int!
  leftArmPatch: LeftArmPatch!
}

input UpdateLeftArmByPersonIdInput {
  clientMutationId: String
  personId: Int!
  leftArmPatch: LeftArmPatch!
}

type UpdateIssue756Payload {
  clientMutationId: String
  issue756: Issue756
  query: Query
  issue756Edge(orderBy: [Issue756SOrderBy!]! = [PRIMARY_KEY_ASC]): Issue756SEdge
}

input UpdateIssue756Input {
  clientMutationId: String
  nodeId: ID!
  issue756Patch: Issue756Patch!
}

input Issue756Patch {
  id: Int
  ts: NotNullTimestamp
}

input UpdateIssue756ByIdInput {
  clientMutationId: String
  id: Int!
  issue756Patch: Issue756Patch!
}

type UpdatePostPayload {
  clientMutationId: String
  post: Post
  query: Query
  postEdge(orderBy: [PostsOrderBy!]! = [PRIMARY_KEY_ASC]): PostsEdge
  personByAuthorId: Person
}

input UpdatePostInput {
  clientMutationId: String
  nodeId: ID!
  postPatch: PostPatch!
}

input PostPatch {
  id: Int
  headline: String
  body: String
  authorId: Int
  enums: [AnEnum]
  comptypes: [ComptypeInput]
}

input UpdatePostByIdInput {
  clientMutationId: String
  id: Int!
  postPatch: PostPatch!
}

type UpdatePersonPayload {
  clientMutationId: String
  person: Person
  query: Query
  personEdge(orderBy: [PeopleOrderBy!]! = [PRIMARY_KEY_ASC]): PeopleEdge
}

input UpdatePersonInput {
  clientMutationId: String
  nodeId: ID!
  personPatch: PersonPatch!
}

input PersonPatch {
  id: Int
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

input UpdatePersonByIdInput {
  clientMutationId: String
  id: Int!
  personPatch: PersonPatch!
}

input UpdatePersonByEmailInput {
  clientMutationId: String
  email: Email!
  personPatch: PersonPatch!
}

type UpdateListPayload {
  clientMutationId: String
  list: List
  query: Query
  listEdge(orderBy: [ListsOrderBy!]! = [PRIMARY_KEY_ASC]): ListsEdge
}

input UpdateListInput {
  clientMutationId: String
  nodeId: ID!
  listPatch: ListPatch!
}

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

input UpdateListByIdInput {
  clientMutationId: String
  id: Int!
  listPatch: ListPatch!
}

type UpdateTypePayload {
  clientMutationId: String
  type: Type
  query: Query
  typeEdge(orderBy: [TypesOrderBy!]! = [PRIMARY_KEY_ASC]): TypesEdge
  postBySmallint: Post
  postById: Post
}

input UpdateTypeInput {
  clientMutationId: String
  nodeId: ID!
  typePatch: TypePatch!
}

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

input UpdateTypeByIdInput {
  clientMutationId: String
  id: Int!
  typePatch: TypePatch!
}

type DeleteInputPayload {
  clientMutationId: String
  input: Input
  deletedInputId: ID
  query: Query
  inputEdge(orderBy: [InputsOrderBy!]! = [PRIMARY_KEY_ASC]): InputsEdge
}

input DeleteInputInput {
  clientMutationId: String
  nodeId: ID!
}

input DeleteInputByIdInput {
  clientMutationId: String
  id: Int!
}

type DeletePatchPayload {
  clientMutationId: String
  patch: Patch
  deletedPatchId: ID
  query: Query
  patchEdge(orderBy: [PatchesOrderBy!]! = [PRIMARY_KEY_ASC]): PatchesEdge
}

input DeletePatchInput {
  clientMutationId: String
  nodeId: ID!
}

input DeletePatchByIdInput {
  clientMutationId: String
  id: Int!
}

type DeleteReservedPayload {
  clientMutationId: String
  reserved: Reserved
  deletedReservedId: ID
  query: Query
  reservedEdge(orderBy: [ReservedsOrderBy!]! = [PRIMARY_KEY_ASC]): ReservedsEdge
}

input DeleteReservedInput {
  clientMutationId: String
  nodeId: ID!
}

input DeleteReservedByIdInput {
  clientMutationId: String
  id: Int!
}

type DeleteReservedPatchRecordPayload {
  clientMutationId: String
  reservedPatchRecord: ReservedPatchRecord
  deletedReservedPatchId: ID
  query: Query
  reservedPatchRecordEdge(orderBy: [ReservedPatchRecordsOrderBy!]! = [PRIMARY_KEY_ASC]): ReservedPatchRecordsEdge
}

input DeleteReservedPatchRecordInput {
  clientMutationId: String
  nodeId: ID!
}

input DeleteReservedPatchRecordByIdInput {
  clientMutationId: String
  id: Int!
}

type DeleteReservedInputRecordPayload {
  clientMutationId: String
  reservedInputRecord: ReservedInputRecord
  deletedReservedInputId: ID
  query: Query
  reservedInputRecordEdge(orderBy: [ReservedInputRecordsOrderBy!]! = [PRIMARY_KEY_ASC]): ReservedInputRecordsEdge
}

input DeleteReservedInputRecordInput {
  clientMutationId: String
  nodeId: ID!
}

input DeleteReservedInputRecordByIdInput {
  clientMutationId: String
  id: Int!
}

type DeleteDefaultValuePayload {
  clientMutationId: String
  defaultValue: DefaultValue
  deletedDefaultValueId: ID
  query: Query
  defaultValueEdge(orderBy: [DefaultValuesOrderBy!]! = [PRIMARY_KEY_ASC]): DefaultValuesEdge
}

input DeleteDefaultValueInput {
  clientMutationId: String
  nodeId: ID!
}

input DeleteDefaultValueByIdInput {
  clientMutationId: String
  id: Int!
}

type DeleteNoPrimaryKeyPayload {
  clientMutationId: String
  noPrimaryKey: NoPrimaryKey
  query: Query
}

input DeleteNoPrimaryKeyByIdInput {
  clientMutationId: String
  id: Int!
}

type DeleteMyTablePayload {
  clientMutationId: String
  myTable: MyTable
  deletedMyTableId: ID
  query: Query
  myTableEdge(orderBy: [MyTablesOrderBy!]! = [PRIMARY_KEY_ASC]): MyTablesEdge
}

input DeleteMyTableInput {
  clientMutationId: String
  nodeId: ID!
}

input DeleteMyTableByIdInput {
  clientMutationId: String
  id: Int!
}

type DeletePersonSecretPayload {
  clientMutationId: String
  personSecret: PersonSecret
  deletedPersonSecretId: ID
  query: Query
  personByPersonId: Person
}

input DeletePersonSecretInput {
  clientMutationId: String
  nodeId: ID!
}

input DeletePersonSecretByPersonIdInput {
  clientMutationId: String
  personId: Int!
}

type DeleteViewTablePayload {
  clientMutationId: String
  viewTable: ViewTable
  deletedViewTableId: ID
  query: Query
  viewTableEdge(orderBy: [ViewTablesOrderBy!]! = [PRIMARY_KEY_ASC]): ViewTablesEdge
}

input DeleteViewTableInput {
  clientMutationId: String
  nodeId: ID!
}

input DeleteViewTableByIdInput {
  clientMutationId: String
  id: Int!
}

type DeleteCompoundKeyPayload {
  clientMutationId: String
  compoundKey: CompoundKey
  deletedCompoundKeyId: ID
  query: Query
  compoundKeyEdge(orderBy: [CompoundKeysOrderBy!]! = [PRIMARY_KEY_ASC]): CompoundKeysEdge
  personByPersonId1: Person
  personByPersonId2: Person
}

input DeleteCompoundKeyInput {
  clientMutationId: String
  nodeId: ID!
}

input DeleteCompoundKeyByPersonId1AndPersonId2Input {
  clientMutationId: String
  personId1: Int!
  personId2: Int!
}

type DeleteSimilarTable1Payload {
  clientMutationId: String
  similarTable1: SimilarTable1
  deletedSimilarTable1Id: ID
  query: Query
  similarTable1Edge(orderBy: [SimilarTable1SOrderBy!]! = [PRIMARY_KEY_ASC]): SimilarTable1SEdge
}

input DeleteSimilarTable1Input {
  clientMutationId: String
  nodeId: ID!
}

input DeleteSimilarTable1ByIdInput {
  clientMutationId: String
  id: Int!
}

type DeleteSimilarTable2Payload {
  clientMutationId: String
  similarTable2: SimilarTable2
  deletedSimilarTable2Id: ID
  query: Query
  similarTable2Edge(orderBy: [SimilarTable2SOrderBy!]! = [PRIMARY_KEY_ASC]): SimilarTable2SEdge
}

input DeleteSimilarTable2Input {
  clientMutationId: String
  nodeId: ID!
}

input DeleteSimilarTable2ByIdInput {
  clientMutationId: String
  id: Int!
}

type DeleteNullTestRecordPayload {
  clientMutationId: String
  nullTestRecord: NullTestRecord
  deletedNullTestRecordId: ID
  query: Query
  nullTestRecordEdge(orderBy: [NullTestRecordsOrderBy!]! = [PRIMARY_KEY_ASC]): NullTestRecordsEdge
}

input DeleteNullTestRecordInput {
  clientMutationId: String
  nodeId: ID!
}

input DeleteNullTestRecordByIdInput {
  clientMutationId: String
  id: Int!
}

type DeleteLeftArmPayload {
  clientMutationId: String
  leftArm: LeftArm
  deletedLeftArmId: ID
  query: Query
  leftArmEdge(orderBy: [LeftArmsOrderBy!]! = [PRIMARY_KEY_ASC]): LeftArmsEdge
  personByPersonId: Person
}

input DeleteLeftArmInput {
  clientMutationId: String
  nodeId: ID!
}

input DeleteLeftArmByIdInput {
  clientMutationId: String
  id: Int!
}

input DeleteLeftArmByPersonIdInput {
  clientMutationId: String
  personId: Int!
}

type DeleteIssue756Payload {
  clientMutationId: String
  issue756: Issue756
  deletedIssue756Id: ID
  query: Query
  issue756Edge(orderBy: [Issue756SOrderBy!]! = [PRIMARY_KEY_ASC]): Issue756SEdge
}

input DeleteIssue756Input {
  clientMutationId: String
  nodeId: ID!
}

input DeleteIssue756ByIdInput {
  clientMutationId: String
  id: Int!
}

type DeletePostPayload {
  clientMutationId: String
  post: Post
  deletedPostId: ID
  query: Query
  postEdge(orderBy: [PostsOrderBy!]! = [PRIMARY_KEY_ASC]): PostsEdge
  personByAuthorId: Person
}

input DeletePostInput {
  clientMutationId: String
  nodeId: ID!
}

input DeletePostByIdInput {
  clientMutationId: String
  id: Int!
}

type DeletePersonPayload {
  clientMutationId: String
  person: Person
  deletedPersonId: ID
  query: Query
  personEdge(orderBy: [PeopleOrderBy!]! = [PRIMARY_KEY_ASC]): PeopleEdge
}

input DeletePersonInput {
  clientMutationId: String
  nodeId: ID!
}

input DeletePersonByIdInput {
  clientMutationId: String
  id: Int!
}

input DeletePersonByEmailInput {
  clientMutationId: String
  email: Email!
}

type DeleteListPayload {
  clientMutationId: String
  list: List
  deletedListId: ID
  query: Query
  listEdge(orderBy: [ListsOrderBy!]! = [PRIMARY_KEY_ASC]): ListsEdge
}

input DeleteListInput {
  clientMutationId: String
  nodeId: ID!
}

input DeleteListByIdInput {
  clientMutationId: String
  id: Int!
}

type DeleteTypePayload {
  clientMutationId: String
  type: Type
  deletedTypeId: ID
  query: Query
  typeEdge(orderBy: [TypesOrderBy!]! = [PRIMARY_KEY_ASC]): TypesEdge
  postBySmallint: Post
  postById: Post
}

input DeleteTypeInput {
  clientMutationId: String
  nodeId: ID!
}

input DeleteTypeByIdInput {
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
      compoundKey: planUpdateOrDeletePayloadResult,
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
      defaultValue: planUpdateOrDeletePayloadResult,
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
      input: planUpdateOrDeletePayloadResult,
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
      issue756: planUpdateOrDeletePayloadResult,
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
      leftArm: planUpdateOrDeletePayloadResult,
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
      list: planUpdateOrDeletePayloadResult,
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
      myTable: planUpdateOrDeletePayloadResult,
      myTableEdge: CreateMyTablePayload_myTableEdgePlan,
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
  DeleteNullTestRecordPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedNullTestRecordId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_NullTestRecord.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      nullTestRecord: planUpdateOrDeletePayloadResult,
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
      patch: planUpdateOrDeletePayloadResult,
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
      person: planUpdateOrDeletePayloadResult,
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
      personSecret: planUpdateOrDeletePayloadResult,
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
      post: planUpdateOrDeletePayloadResult,
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
      reservedInputRecord: planUpdateOrDeletePayloadResult,
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
      reservedPatchRecord: planUpdateOrDeletePayloadResult,
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
      reserved: planUpdateOrDeletePayloadResult,
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
      similarTable1: planUpdateOrDeletePayloadResult,
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
      similarTable2: planUpdateOrDeletePayloadResult,
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
      type: planUpdateOrDeletePayloadResult,
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
      viewTable: planUpdateOrDeletePayloadResult,
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
      return spec_resource_person_secretPgResource.get(spec);
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
      compoundKey: planUpdateOrDeletePayloadResult,
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
      defaultValue: planUpdateOrDeletePayloadResult,
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
      issue756: planUpdateOrDeletePayloadResult,
      issue756Edge: Issue756MutationPayload_issue756EdgePlan,
      query: queryPlan
    }
  },
  UpdateLeftArmPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      leftArm: planUpdateOrDeletePayloadResult,
      leftArmEdge: LeftArmIdentityPayload_leftArmEdgePlan,
      personByPersonId: LeftArmIdentityPayload_personByPersonIdPlan,
      query: queryPlan
    }
  },
  UpdateListPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      list: planUpdateOrDeletePayloadResult,
      listEdge: CreateListPayload_listEdgePlan,
      query: queryPlan
    }
  },
  UpdateMyTablePayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      myTable: planUpdateOrDeletePayloadResult,
      myTableEdge: CreateMyTablePayload_myTableEdgePlan,
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
  UpdateNullTestRecordPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      nullTestRecord: planUpdateOrDeletePayloadResult,
      nullTestRecordEdge: CreateNullTestRecordPayload_nullTestRecordEdgePlan,
      query: queryPlan
    }
  },
  UpdatePatchPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      patch: planUpdateOrDeletePayloadResult,
      patchEdge: CreatePatchPayload_patchEdgePlan,
      query: queryPlan
    }
  },
  UpdatePersonPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      person: planUpdateOrDeletePayloadResult,
      personEdge: MutationOutTablePayload_personEdgePlan,
      query: queryPlan
    }
  },
  UpdatePersonSecretPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      personByPersonId: LeftArmIdentityPayload_personByPersonIdPlan,
      personSecret: planUpdateOrDeletePayloadResult,
      query: queryPlan
    }
  },
  UpdatePostPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      personByAuthorId: TableMutationPayload_personByAuthorIdPlan,
      post: planUpdateOrDeletePayloadResult,
      postEdge: TableMutationPayload_postEdgePlan,
      query: queryPlan
    }
  },
  UpdateReservedInputRecordPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan,
      reservedInputRecord: planUpdateOrDeletePayloadResult,
      reservedInputRecordEdge: CreateReservedInputRecordPayload_reservedInputRecordEdgePlan
    }
  },
  UpdateReservedPatchRecordPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan,
      reservedPatchRecord: planUpdateOrDeletePayloadResult,
      reservedPatchRecordEdge: CreateReservedPatchRecordPayload_reservedPatchRecordEdgePlan
    }
  },
  UpdateReservedPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan,
      reserved: planUpdateOrDeletePayloadResult,
      reservedEdge: CreateReservedPayload_reservedEdgePlan
    }
  },
  UpdateSimilarTable1Payload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan,
      similarTable1: planUpdateOrDeletePayloadResult,
      similarTable1Edge: CreateSimilarTable1Payload_similarTable1EdgePlan
    }
  },
  UpdateSimilarTable2Payload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan,
      similarTable2: planUpdateOrDeletePayloadResult,
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
      type: planUpdateOrDeletePayloadResult,
      typeEdge: TypeFunctionMutationPayload_typeEdgePlan
    }
  },
  UpdateViewTablePayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan,
      viewTable: planUpdateOrDeletePayloadResult,
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
  CreateCompoundKeyInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      compoundKey: applyCreateFields
    }
  },
  CreateDefaultValueInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      defaultValue: applyCreateFields
    }
  },
  CreateEdgeCaseInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      edgeCase: applyCreateFields
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
      clientMutationId: applyClientMutationIdForCustomMutation,
      input: applyCreateFields
    }
  },
  CreateIssue756Input: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      issue756: applyCreateFields
    }
  },
  CreateLeftArmInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      leftArm: applyCreateFields
    }
  },
  CreateListInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      list: applyCreateFields
    }
  },
  CreateMyTableInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      myTable: applyCreateFields
    }
  },
  CreateNoPrimaryKeyInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      noPrimaryKey: applyCreateFields
    }
  },
  CreateNullTestRecordInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      nullTestRecord: applyCreateFields
    }
  },
  CreatePatchInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      patch: applyCreateFields
    }
  },
  CreatePersonInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      person: applyCreateFields
    }
  },
  CreatePersonSecretInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      personSecret: applyCreateFields
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
  CreateTypeInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      type: applyCreateFields
    }
  },
  CreateUpdatableViewInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      updatableView: applyCreateFields
    }
  },
  CreateViewTableInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
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
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteCompoundKeyInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteDefaultValueByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteDefaultValueInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteInputByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteInputInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteIssue756ByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteIssue756Input: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteLeftArmByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteLeftArmByPersonIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteLeftArmInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteListByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteListInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteMyTableByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteMyTableInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteNoPrimaryKeyByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteNullTestRecordByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteNullTestRecordInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeletePatchByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeletePatchInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeletePersonByEmailInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeletePersonByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeletePersonInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeletePersonSecretByPersonIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeletePersonSecretInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeletePostByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeletePostInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteReservedByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteReservedInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteReservedInputRecordByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteReservedInputRecordInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteReservedPatchRecordByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteReservedPatchRecordInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteSimilarTable1ByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteSimilarTable1Input: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteSimilarTable2ByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteSimilarTable2Input: {
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
  DeleteViewTableByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteViewTableInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
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
      bazBuz(obj, val, {
        field,
        schema
      }) {
        obj.set("baz_buz", bakedInputRuntime(schema, field.type, val));
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
      testviewid(obj, val, {
        field,
        schema
      }) {
        obj.set("testviewid", bakedInputRuntime(schema, field.type, val));
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
  UpdateCompoundKeyByPersonId1AndPersonId2Input: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      compoundKeyPatch: applyPatchFields
    }
  },
  UpdateCompoundKeyInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      compoundKeyPatch: applyPatchFields
    }
  },
  UpdateDefaultValueByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      defaultValuePatch: applyPatchFields
    }
  },
  UpdateDefaultValueInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      defaultValuePatch: applyPatchFields
    }
  },
  UpdateInputByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      inputPatch: applyPatchFields
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
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      issue756Patch: applyPatchFields
    }
  },
  UpdateIssue756Input: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      issue756Patch: applyPatchFields
    }
  },
  UpdateLeftArmByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      leftArmPatch: applyPatchFields
    }
  },
  UpdateLeftArmByPersonIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      leftArmPatch: applyPatchFields
    }
  },
  UpdateLeftArmInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      leftArmPatch: applyPatchFields
    }
  },
  UpdateListByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      listPatch: applyPatchFields
    }
  },
  UpdateListInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      listPatch: applyPatchFields
    }
  },
  UpdateMyTableByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      myTablePatch: applyPatchFields
    }
  },
  UpdateMyTableInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      myTablePatch: applyPatchFields
    }
  },
  UpdateNoPrimaryKeyByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      noPrimaryKeyPatch: applyPatchFields
    }
  },
  UpdateNullTestRecordByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      nullTestRecordPatch: applyPatchFields
    }
  },
  UpdateNullTestRecordInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      nullTestRecordPatch: applyPatchFields
    }
  },
  UpdatePatchByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      patchPatch: applyPatchFields
    }
  },
  UpdatePatchInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      patchPatch: applyPatchFields
    }
  },
  UpdatePersonByEmailInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      personPatch: applyPatchFields
    }
  },
  UpdatePersonByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      personPatch: applyPatchFields
    }
  },
  UpdatePersonInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      personPatch: applyPatchFields
    }
  },
  UpdatePersonSecretByPersonIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      personSecretPatch: applyPatchFields
    }
  },
  UpdatePersonSecretInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      personSecretPatch: applyPatchFields
    }
  },
  UpdatePostByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      postPatch: applyPatchFields
    }
  },
  UpdatePostInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      postPatch: applyPatchFields
    }
  },
  UpdateReservedByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      reservedPatch: applyPatchFields
    }
  },
  UpdateReservedInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      reservedPatch: applyPatchFields
    }
  },
  UpdateReservedInputRecordByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      reservedInputRecordPatch: applyPatchFields
    }
  },
  UpdateReservedInputRecordInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      reservedInputRecordPatch: applyPatchFields
    }
  },
  UpdateReservedPatchRecordByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      reservedPatchRecordPatch: applyPatchFields
    }
  },
  UpdateReservedPatchRecordInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      reservedPatchRecordPatch: applyPatchFields
    }
  },
  UpdateSimilarTable1ByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      similarTable1Patch: applyPatchFields
    }
  },
  UpdateSimilarTable1Input: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      similarTable1Patch: applyPatchFields
    }
  },
  UpdateSimilarTable2ByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      similarTable2Patch: applyPatchFields
    }
  },
  UpdateSimilarTable2Input: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      similarTable2Patch: applyPatchFields
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
  },
  UpdateViewTableByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      viewTablePatch: applyPatchFields
    }
  },
  UpdateViewTableInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      viewTablePatch: applyPatchFields
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
      url(obj, val, {
        field,
        schema
      }) {
        obj.set("url", bakedInputRuntime(schema, field.type, val));
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
        applyOrderByCustomField(resource_post_computed_with_optional_argPgResource, "asc", undefined, queryBuilder);
      },
      COMPUTED_WITH_OPTIONAL_ARG_DESC(queryBuilder) {
        applyOrderByCustomField(resource_post_computed_with_optional_argPgResource, "desc", undefined, queryBuilder);
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
