import { LIST_TYPES, PgDeleteSingleStep, PgExecutor, PgResource, PgSelectStep, TYPES, assertPgClassSingleStep, domainOfCodec, enumCodec, listOfCodec, makeRegistry, pgDeleteSingle, pgInsertSingle, pgSelectFromRecord, pgSelectFromRecords, pgSelectSingleFromRecord, pgUpdateSingle, rangeOfCodec, recordCodec, sqlFromArgDigests, sqlValueWithCodec } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ObjectStep, __ValueStep, access, assertStep, bakedInput, bakedInputRuntime, connection, constant, context, createObjectAndApplyChildren, first, get as get2, inhibitOnNull, inspect, lambda, list, makeDecodeNodeId, makeGrafastSchema, markSyncAndSafe, object, operationPlan, rootValue, specFromNodeId, trap } from "grafast";
import { GraphQLError, GraphQLInt, GraphQLString, Kind, valueFromASTUntyped } from "graphql";
import jsonwebtoken from "jsonwebtoken";
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
const guidCodec = domainOfCodec(TYPES.varchar, "guid", sql.identifier("b", "guid"), {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "guid"
    }
  }
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
    },
    tags: {
      __proto__: null,
      behavior: ["-table", "jwt"]
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
const mult_1FunctionIdentifer = sql.identifier("b", "mult_1");
const mult_2FunctionIdentifer = sql.identifier("b", "mult_2");
const mult_3FunctionIdentifer = sql.identifier("b", "mult_3");
const mult_4FunctionIdentifer = sql.identifier("b", "mult_4");
const guid_fnFunctionIdentifer = sql.identifier("b", "guid_fn");
const list_bde_mutationFunctionIdentifer = sql.identifier("b", "list_bde_mutation");
const updatable_viewUniques = [{
  attributes: ["x"],
  extensions: {
    tags: {
      __proto__: null,
      behavior: "-single -update -delete"
    }
  }
}];
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
const authenticate_manyFunctionIdentifer = sql.identifier("b", "authenticate_many");
const authenticate_payloadFunctionIdentifer = sql.identifier("b", "authenticate_payload");
const compound_type_mutationFunctionIdentifer = sql.identifier("b", "compound_type_mutation");
const compound_type_queryFunctionIdentifer = sql.identifier("b", "compound_type_query");
const compound_type_set_mutationFunctionIdentifer = sql.identifier("b", "compound_type_set_mutation");
const compound_type_array_mutationFunctionIdentifer = sql.identifier("b", "compound_type_array_mutation");
const compound_type_array_queryFunctionIdentifer = sql.identifier("b", "compound_type_array_query");
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
const type_function_listFunctionIdentifer = sql.identifier("b", "type_function_list");
const type_function_list_mutationFunctionIdentifer = sql.identifier("b", "type_function_list_mutation");
const registry = makeRegistry({
  pgExecutors: {
    __proto__: null,
    main: executor
  },
  pgCodecs: {
    __proto__: null,
    int4: TYPES.int,
    guid: guidCodec,
    varchar: TYPES.varchar,
    uuidArray: LIST_TYPES.uuid,
    uuid: TYPES.uuid,
    updatableView: updatableViewCodec,
    text: TYPES.text,
    jwtToken: jwtTokenCodec,
    int8: TYPES.bigint,
    numeric: TYPES.numeric,
    authPayload: authPayloadCodec,
    bool: TYPES.boolean,
    compoundType: compoundTypeCodec,
    color: colorCodec,
    enumCaps: enumCapsCodec,
    enumWithEmptyString: enumWithEmptyStringCodec,
    interval: TYPES.interval,
    lists: listsCodec,
    int4Array: LIST_TYPES.int,
    colorArray: colorArrayCodec,
    dateArray: LIST_TYPES.date,
    date: TYPES.date,
    timestamptzArray: LIST_TYPES.timestamptz,
    timestamptz: TYPES.timestamptz,
    compoundTypeArray: compoundTypeArrayCodec,
    byteaArray: LIST_TYPES.bytea,
    bytea: TYPES.bytea,
    tsvectorArray: LIST_TYPES.tsvector,
    tsvector: TYPES.tsvector,
    tsqueryArray: LIST_TYPES.tsquery,
    tsquery: TYPES.tsquery,
    types: typesCodec,
    int2: TYPES.int2,
    anInt: anIntCodec,
    anotherInt: anotherIntCodec,
    textArray: LIST_TYPES.text,
    json: TYPES.json,
    jsonb: TYPES.jsonb,
    jsonpath: TYPES.jsonpath,
    numrange: numrangeCodec,
    daterange: daterangeCodec,
    anIntRange: anIntRangeCodec,
    timestamp: TYPES.timestamp,
    time: TYPES.time,
    timetz: TYPES.timetz,
    intervalArray: LIST_TYPES.interval,
    money: TYPES.money,
    nestedCompoundType: nestedCompoundTypeCodec,
    point: TYPES.point,
    inet: TYPES.inet,
    cidr: TYPES.cidr,
    macaddr: TYPES.macaddr,
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
    notNullUrl: notNullUrlCodec,
    int8Array: LIST_TYPES.bigint,
    wrappedUrl: recordCodec({
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
    compound_type_mutation: PgResource.functionResourceOptions({
      codec: compoundTypeCodec,
      executor: executor
    }, {
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
    compound_type_query: PgResource.functionResourceOptions({
      codec: compoundTypeCodec,
      executor: executor
    }, {
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
    compound_type_set_mutation: PgResource.functionResourceOptions({
      codec: compoundTypeCodec,
      executor: executor
    }, {
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
    compound_type_array_mutation: PgResource.functionResourceOptions({
      codec: compoundTypeCodec,
      executor: executor
    }, {
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
    compound_type_array_query: PgResource.functionResourceOptions({
      codec: compoundTypeCodec,
      executor: executor
    }, {
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
    })
  },
  pgRelations: {
    __proto__: null
  }
});
const resource_listsPgResource = registry.pgResources["lists"];
const resource_typesPgResource = registry.pgResources["types"];
const argDetailsSimple_compound_type_query = [{
  graphqlArgName: "object",
  pgCodec: compoundTypeCodec,
  postgresArgName: "object",
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
const makeArgs_compound_type_query = (args, path = []) => argDetailsSimple_compound_type_query.map(details => makeArg(path, args, details));
const resource_compound_type_queryPgResource = registry.pgResources["compound_type_query"];
const argDetailsSimple_compound_type_array_query = [{
  graphqlArgName: "object",
  pgCodec: compoundTypeCodec,
  postgresArgName: "object",
  required: true
}];
const makeArgs_compound_type_array_query = (args, path = []) => argDetailsSimple_compound_type_array_query.map(details => makeArg(path, args, details));
const resource_compound_type_array_queryPgResource = registry.pgResources["compound_type_array_query"];
const EMPTY_ARRAY = [];
const makeArgs_type_function_connection = () => EMPTY_ARRAY;
const resource_type_function_connectionPgResource = registry.pgResources["type_function_connection"];
const type_function_connection_getSelectPlanFromParentAndArgs = ($root, args, _info) => {
  const selectArgs = makeArgs_type_function_connection(args);
  return resource_type_function_connectionPgResource.execute(selectArgs);
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
const nodeIdHandler_List = makeTableNodeIdHandler({
  typeName: "List",
  identifier: "lists",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_listsPgResource,
  pk: listsUniques[0].attributes
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
const resource_updatable_viewPgResource = registry.pgResources["updatable_view"];
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
const List_enumArrayPlan = $record => {
  return $record.get("enum_array");
};
const resource_frmcdc_compoundTypePgResource = registry.pgResources["frmcdc_compoundType"];
const List_byteaArrayPlan = $record => {
  return $record.get("bytea_array");
};
function toString(value) {
  return "" + value;
}
const coerce = string => {
  if (!/^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i.test(string)) {
    throw new GraphQLError("Invalid UUID, expected 32 hexadecimal characters, optionally with hyphens");
  }
  return string;
};
const resource_frmcdc_nestedCompoundTypePgResource = registry.pgResources["frmcdc_nestedCompoundType"];
function LTreeParseValue(value) {
  return value;
}
const LTreeParseLiteral = (node, variables) => {
  return LTreeParseValue(valueFromASTUntyped(node, variables));
};
function CompoundTypeInput_aApply(obj, val, info) {
  obj.set("a", bakedInputRuntime(info.schema, info.field.type, val));
}
function CompoundTypeInput_bApply(obj, val, info) {
  obj.set("b", bakedInputRuntime(info.schema, info.field.type, val));
}
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
const ListCondition_idApply = ($condition, val) => applyAttributeCondition("id", TYPES.int, $condition, val);
const ListCondition_enumArrayApply = ($condition, val) => applyAttributeCondition("enum_array", colorArrayCodec, $condition, val);
const ListsOrderBy_ID_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "id",
    direction: "ASC"
  });
  queryBuilder.setOrderIsUnique();
};
const ListsOrderBy_ID_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "id",
    direction: "DESC"
  });
  queryBuilder.setOrderIsUnique();
};
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
const argDetailsSimple_guid_fn = [{
  graphqlArgName: "g",
  pgCodec: guidCodec,
  postgresArgName: "g",
  required: true
}];
const makeArgs_guid_fn = (args, path = []) => argDetailsSimple_guid_fn.map(details => makeArg(path, args, details));
const resource_guid_fnPgResource = registry.pgResources["guid_fn"];
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
const argDetailsSimple_compound_type_array_mutation = [{
  graphqlArgName: "object",
  pgCodec: compoundTypeCodec,
  postgresArgName: "object",
  required: true
}];
const makeArgs_compound_type_array_mutation = (args, path = []) => argDetailsSimple_compound_type_array_mutation.map(details => makeArg(path, args, details));
const resource_compound_type_array_mutationPgResource = registry.pgResources["compound_type_array_mutation"];
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
const specFromArgs_List = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_List, $nodeId);
};
function applyInputToUpdateOrDelete(_, $object) {
  return $object;
}
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
const attributeNames = ["role", "exp", "a", "b", "c"];
const resource_frmcdc_jwtTokenPgResource = registry.pgResources["frmcdc_jwtToken"];
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
const TypeFunctionMutationPayload_typeEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_typesPgResource, typesUniques[0].attributes, $mutation, fieldArgs);
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
const CreateListPayload_listEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_listsPgResource, listsUniques[0].attributes, $mutation, fieldArgs);
function ListInput_idApply(obj, val, info) {
  obj.set("id", bakedInputRuntime(info.schema, info.field.type, val));
}
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

  """Get a single \`List\`."""
  listById(id: Int!): List

  """Get a single \`Type\`."""
  typeById(id: Int!): Type
  compoundTypeQuery(object: CompoundTypeInput): CompoundType
  compoundTypeArrayQuery(object: CompoundTypeInput): [CompoundType]

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

"""Represents the colours red, green and blue."""
enum Color {
  RED
  GREEN
  BLUE
}

"""A calendar date in YYYY-MM-DD format."""
scalar Date

"""
A point in time as described by the [ISO
8601](https://en.wikipedia.org/wiki/ISO_8601) and, if it has a timezone, [RFC
3339](https://datatracker.ietf.org/doc/html/rfc3339) standards. Input values
that do not conform to both ISO 8601 and RFC 3339 may be coerced, which may lead
to unexpected results.
"""
scalar Datetime

"""Awesome feature!"""
type CompoundType {
  a: Int
  b: String
  c: Color
  d: UUID
  e: EnumCaps
  f: EnumWithEmptyString
  g: Interval
  fooBar: Int
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

"""Binary data encoded using Base64"""
scalar Base64EncodedBinary

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

"""
Represents an \`ltree\` hierarchical label tree as outlined in https://www.postgresql.org/docs/current/ltree.html
"""
scalar LTree

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

"""
The root mutation type which contains root level fields which mutate data.
"""
type Mutation {
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
  guidFn(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: GuidFnInput!
  ): GuidFnPayload
  listBdeMutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: ListBdeMutationInput!
  ): ListBdeMutationPayload
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
  compoundTypeArrayMutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CompoundTypeArrayMutationInput!
  ): CompoundTypeArrayMutationPayload
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

  """Creates a single \`UpdatableView\`."""
  createUpdatableView(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateUpdatableViewInput!
  ): CreateUpdatableViewPayload

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

"""
A JSON Web Token defined by [RFC 7519](https://tools.ietf.org/html/rfc7519)
which securely represents claims between two parties.
"""
scalar JwtToken

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
}

type AuthPayload {
  jwt: JwtToken
  id: Int
  admin: Boolean
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
      compoundTypeArrayQuery($root, args, _info) {
        const selectArgs = makeArgs_compound_type_array_query(args);
        return resource_compound_type_array_queryPgResource.execute(selectArgs);
      },
      compoundTypeQuery($root, args, _info) {
        const selectArgs = makeArgs_compound_type_query(args);
        return resource_compound_type_queryPgResource.execute(selectArgs);
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
        const selectArgs = makeArgs_type_function_connection(args);
        return resource_type_function_listPgResource.execute(selectArgs);
      }
    }
  },
  Mutation: {
    assertStep: __ValueStep,
    plans: {
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
          const selectArgs = makeArgs_type_function_connection(args, ["input"]);
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
      typeFunctionConnectionMutation: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_type_function_connection(args, ["input"]);
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
          const selectArgs = makeArgs_type_function_connection(args, ["input"]);
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
      }
    }
  },
  CompoundType: {
    assertStep: assertPgClassSingleStep,
    plans: {
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
  CompoundTypeSetMutationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForCustomMutationPlan,
      compoundTypes: planCustomMutationPayloadResult,
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
  CreateTypePayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
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
      type: planCreatePayloadResult,
      typeEdge: TypeFunctionMutationPayload_typeEdgePlan
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
  Interval: {
    assertStep: assertStep
  },
  List: {
    assertStep: assertPgClassSingleStep,
    plans: {
      byteaArray: List_byteaArrayPlan,
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
      enumArray: List_enumArrayPlan,
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
  Type: {
    assertStep: assertPgClassSingleStep,
    plans: {
      anIntRange($record) {
        return $record.get("an_int_range");
      },
      byteaArray: List_byteaArrayPlan,
      compoundType($record) {
        const $plan = $record.get("compound_type");
        const $select = pgSelectSingleFromRecord(resource_frmcdc_compoundTypePgResource, $plan);
        $select.coalesceToEmptyObject();
        $select.getClassStep().setTrusted();
        return $select;
      },
      enumArray: List_enumArrayPlan,
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
  UpdateListPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      list: planCreatePayloadResult,
      listEdge: CreateListPayload_listEdgePlan,
      query: queryPlan
    }
  },
  UpdateTypePayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan,
      type: planCreatePayloadResult,
      typeEdge: TypeFunctionMutationPayload_typeEdgePlan
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
  CreateListInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      list: applyCreateFields
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
  GuidFnInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
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
      enumArray: ListCondition_enumArrayApply,
      enumArrayNn($condition, val) {
        return applyAttributeCondition("enum_array_nn", colorArrayCodec, $condition, val);
      },
      id: ListCondition_idApply,
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
      id: ListInput_idApply,
      intArray: ListInput_intArrayApply,
      intArrayNn: ListInput_intArrayNnApply,
      timestamptzArray: ListInput_timestamptzArrayApply,
      timestamptzArrayNn: ListInput_timestamptzArrayNnApply
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
      id: ListInput_idApply,
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
      enumArray: ListCondition_enumArrayApply,
      id: ListCondition_idApply,
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
      id: ListInput_idApply,
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
      id: ListInput_idApply,
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
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`Datetime can only parse string values (kind='${ast.kind}')`);
    }
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
  JwtToken: {
    serialize(value) {
      const token = attributeNames.reduce((memo, attributeName) => {
        if (attributeName === "exp") {
          memo[attributeName] = value[attributeName] ? parseFloat(value[attributeName]) : undefined;
        } else {
          memo[attributeName] = value[attributeName];
        }
        return memo;
      }, Object.create(null));
      const options = Object.assign(Object.create(null), undefined, token.aud || undefined && undefined.audience ? null : {
        audience: "postgraphile"
      }, token.iss || undefined && undefined.issuer ? null : {
        issuer: "postgraphile"
      }, token.exp || undefined && undefined.expiresIn ? null : {
        expiresIn: "1 day"
      });
      return jsonwebtoken.sign(token, "secret", options);
    },
    parseValue: LTreeParseValue,
    parseLiteral: LTreeParseLiteral,
    plan($in) {
      const $record = $in;
      return $record.record();
    }
  },
  LTree: {
    serialize(x) {
      return x;
    },
    parseValue: LTreeParseValue,
    parseLiteral: LTreeParseLiteral
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
  ListsOrderBy: {
    values: {
      ID_ASC: ListsOrderBy_ID_ASCApply,
      ID_DESC: ListsOrderBy_ID_DESCApply,
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
      ID_ASC: ListsOrderBy_ID_ASCApply,
      ID_DESC: ListsOrderBy_ID_DESCApply,
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
