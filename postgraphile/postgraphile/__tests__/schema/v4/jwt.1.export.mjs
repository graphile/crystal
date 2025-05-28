import { PgDeleteSingleStep, PgExecutor, PgResource, PgSelectStep, TYPES, assertPgClassSingleStep, domainOfCodec, enumCodec, listOfCodec, makeRegistry, pgDeleteSingle, pgInsertSingle, pgSelectFromRecord, pgSelectFromRecords, pgSelectSingleFromRecord, pgUpdateSingle, rangeOfCodec, recordCodec, sqlFromArgDigests, sqlValueWithCodec } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ObjectStep, __ValueStep, access, assertEdgeCapableStep, assertExecutableStep, assertPageInfoCapableStep, bakedInput, bakedInputRuntime, connection, constant, context, createObjectAndApplyChildren, first, get as get2, inhibitOnNull, inspect, lambda, list, makeDecodeNodeId, makeGrafastSchema, object, rootValue, specFromNodeId } from "grafast";
import { GraphQLError, GraphQLInt, GraphQLString, Kind, valueFromASTUntyped } from "graphql";
import jsonwebtoken from "jsonwebtoken";
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
const guidCodec = domainOfCodec(TYPES.varchar, "guid", sql.identifier("b", "guid"), {
  description: undefined,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "guid"
    },
    tags: {
      __proto__: null
    }
  },
  notNull: false
});
const updatableViewIdentifier = sql.identifier("b", "updatable_view");
const updatableViewCodec = recordCodec({
  name: "updatableView",
  identifier: updatableViewIdentifier,
  attributes: {
    __proto__: null,
    x: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    name: {
      description: undefined,
      codec: TYPES.varchar,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    description: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    constant: {
      description: "This is constantly 2",
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    }
  },
  description: "YOYOYO!!",
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
  executor: executor
});
const jwtTokenIdentifier = sql.identifier("b", "jwt_token");
const jwtTokenCodec = recordCodec({
  name: "jwtToken",
  identifier: jwtTokenIdentifier,
  attributes: {
    __proto__: null,
    role: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    exp: {
      description: undefined,
      codec: TYPES.bigint,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
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
      codec: TYPES.numeric,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    c: {
      description: undefined,
      codec: TYPES.bigint,
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
      name: "jwt_token"
    },
    tags: {
      __proto__: null,
      behavior: ["-table", "jwt"]
    }
  },
  executor: executor
});
const uuidArrayCodec = listOfCodec(TYPES.uuid, {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "pg_catalog",
      name: "_uuid"
    },
    tags: {
      __proto__: null
    }
  },
  typeDelim: ",",
  description: undefined,
  name: "uuidArray"
});
const authPayloadIdentifier = sql.identifier("b", "auth_payload");
const authPayloadCodec = recordCodec({
  name: "authPayload",
  identifier: authPayloadIdentifier,
  attributes: {
    __proto__: null,
    jwt: {
      description: undefined,
      codec: jwtTokenCodec,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    id: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    admin: {
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
const listsIdentifier = sql.identifier("b", "lists");
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
const dateArrayCodec = listOfCodec(TYPES.date, {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "pg_catalog",
      name: "_date"
    },
    tags: {
      __proto__: null
    }
  },
  typeDelim: ",",
  description: undefined,
  name: "dateArray"
});
const timestamptzArrayCodec = listOfCodec(TYPES.timestamptz, {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "pg_catalog",
      name: "_timestamptz"
    },
    tags: {
      __proto__: null
    }
  },
  typeDelim: ",",
  description: undefined,
  name: "timestamptzArray"
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
const listsCodec = recordCodec({
  name: "lists",
  identifier: listsIdentifier,
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
    int_array: {
      description: undefined,
      codec: int4ArrayCodec,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    int_array_nn: {
      description: undefined,
      codec: int4ArrayCodec,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    enum_array: {
      description: undefined,
      codec: colorArrayCodec,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    enum_array_nn: {
      description: undefined,
      codec: colorArrayCodec,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    date_array: {
      description: undefined,
      codec: dateArrayCodec,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    date_array_nn: {
      description: undefined,
      codec: dateArrayCodec,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    timestamptz_array: {
      description: undefined,
      codec: timestamptzArrayCodec,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    timestamptz_array_nn: {
      description: undefined,
      codec: timestamptzArrayCodec,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    compound_type_array: {
      description: undefined,
      codec: compoundTypeArrayCodec,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    compound_type_array_nn: {
      description: undefined,
      codec: compoundTypeArrayCodec,
      notNull: true,
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
    bytea_array_nn: {
      description: undefined,
      codec: byteaArrayCodec,
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
      schemaName: "b",
      name: "lists"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const typesIdentifier = sql.identifier("b", "types");
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
const spec_types = {
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
};
const typesCodec = recordCodec(spec_types);
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
const mult_1FunctionIdentifer = sql.identifier("b", "mult_1");
const mult_2FunctionIdentifer = sql.identifier("b", "mult_2");
const mult_3FunctionIdentifer = sql.identifier("b", "mult_3");
const mult_4FunctionIdentifer = sql.identifier("b", "mult_4");
const guid_fnFunctionIdentifer = sql.identifier("b", "guid_fn");
const updatable_viewUniques = [{
  isPrimary: false,
  attributes: ["x"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null,
      behavior: "-single -update -delete"
    }
  }
}];
const authenticate_failFunctionIdentifer = sql.identifier("b", "authenticate_fail");
const resourceConfig_jwt_token = {
  executor: executor,
  name: "jwt_token",
  identifier: "main.b.jwt_token",
  from: jwtTokenIdentifier,
  codec: jwtTokenCodec,
  uniques: [],
  isVirtual: true,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "jwt_token"
    },
    isInsertable: false,
    isUpdatable: false,
    isDeletable: false,
    tags: {}
  }
};
const authenticateFunctionIdentifer = sql.identifier("b", "authenticate");
const list_bde_mutationFunctionIdentifer = sql.identifier("b", "list_bde_mutation");
const authenticate_manyFunctionIdentifer = sql.identifier("b", "authenticate_many");
const authenticate_payloadFunctionIdentifer = sql.identifier("b", "authenticate_payload");
const compound_type_mutationFunctionIdentifer = sql.identifier("b", "compound_type_mutation");
const compound_type_queryFunctionIdentifer = sql.identifier("b", "compound_type_query");
const compound_type_set_mutationFunctionIdentifer = sql.identifier("b", "compound_type_set_mutation");
const compound_type_array_mutationFunctionIdentifer = sql.identifier("b", "compound_type_array_mutation");
const compound_type_array_queryFunctionIdentifer = sql.identifier("b", "compound_type_array_query");
const listsUniques = [{
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
const registryConfig_pgResources_types_types = {
  executor: executor,
  name: "types",
  identifier: "main.b.types",
  from: typesIdentifier,
  codec: typesCodec,
  uniques: typesUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "types"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {
      foreignKey: spec_types.extensions.tags.foreignKey
    }
  }
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
    updatableView: updatableViewCodec,
    text: TYPES.text,
    jwtToken: jwtTokenCodec,
    int8: TYPES.bigint,
    numeric: TYPES.numeric,
    uuidArray: uuidArrayCodec,
    uuid: TYPES.uuid,
    authPayload: authPayloadCodec,
    bool: TYPES.boolean,
    compoundType: compoundTypeCodec,
    color: colorCodec,
    enumCaps: enumCapsCodec,
    enumWithEmptyString: enumWithEmptyStringCodec,
    interval: TYPES.interval,
    lists: listsCodec,
    int4Array: int4ArrayCodec,
    colorArray: colorArrayCodec,
    dateArray: dateArrayCodec,
    date: TYPES.date,
    timestamptzArray: timestamptzArrayCodec,
    timestamptz: TYPES.timestamptz,
    compoundTypeArray: compoundTypeArrayCodec,
    byteaArray: byteaArrayCodec,
    bytea: TYPES.bytea,
    types: typesCodec,
    int2: TYPES.int2,
    anInt: anIntCodec,
    anotherInt: anotherIntCodec,
    textArray: textArrayCodec,
    json: TYPES.json,
    jsonb: TYPES.jsonb,
    numrange: numrangeCodec,
    daterange: daterangeCodec,
    anIntRange: anIntRangeCodec,
    timestamp: TYPES.timestamp,
    time: TYPES.time,
    timetz: TYPES.timetz,
    intervalArray: intervalArrayCodec,
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
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "_jwt_token"
        },
        tags: {
          __proto__: null
        }
      },
      typeDelim: ",",
      description: undefined,
      name: "jwtTokenArray"
    }),
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
    notNullUrl: notNullUrlCodec,
    int8Array: int8ArrayCodec,
    wrappedUrl: recordCodec({
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
    })
  },
  pgResources: {
    __proto__: null,
    mult_1: {
      executor,
      name: "mult_1",
      identifier: "main.b.mult_1(int4,int4)",
      from(...args) {
        return sql`${mult_1FunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: null,
        required: true,
        notNull: false,
        codec: TYPES.int
      }, {
        name: null,
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
          schemaName: "b",
          name: "mult_1"
        },
        tags: {}
      },
      description: undefined
    },
    mult_2: {
      executor,
      name: "mult_2",
      identifier: "main.b.mult_2(int4,int4)",
      from(...args) {
        return sql`${mult_2FunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: null,
        required: true,
        notNull: false,
        codec: TYPES.int
      }, {
        name: null,
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
          schemaName: "b",
          name: "mult_2"
        },
        tags: {}
      },
      description: undefined
    },
    mult_3: {
      executor,
      name: "mult_3",
      identifier: "main.b.mult_3(int4,int4)",
      from(...args) {
        return sql`${mult_3FunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: null,
        required: true,
        notNull: true,
        codec: TYPES.int
      }, {
        name: null,
        required: true,
        notNull: true,
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
          schemaName: "b",
          name: "mult_3"
        },
        tags: {}
      },
      description: undefined
    },
    mult_4: {
      executor,
      name: "mult_4",
      identifier: "main.b.mult_4(int4,int4)",
      from(...args) {
        return sql`${mult_4FunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: null,
        required: true,
        notNull: true,
        codec: TYPES.int
      }, {
        name: null,
        required: true,
        notNull: true,
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
          schemaName: "b",
          name: "mult_4"
        },
        tags: {}
      },
      description: undefined
    },
    guid_fn: {
      executor,
      name: "guid_fn",
      identifier: "main.b.guid_fn(b.guid)",
      from(...args) {
        return sql`${guid_fnFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "g",
        required: true,
        notNull: false,
        codec: guidCodec
      }],
      isUnique: !false,
      codec: guidCodec,
      uniques: [],
      isMutation: true,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "guid_fn"
        },
        tags: {}
      },
      description: undefined
    },
    updatable_view: {
      executor: executor,
      name: "updatable_view",
      identifier: "main.b.updatable_view",
      from: updatableViewIdentifier,
      codec: updatableViewCodec,
      uniques: updatable_viewUniques,
      isVirtual: false,
      description: "YOYOYO!!",
      extensions: {
        description: "YOYOYO!!",
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "updatable_view"
        },
        isInsertable: true,
        isUpdatable: true,
        isDeletable: true,
        tags: {
          uniqueKey: "x",
          unique: "x|@behavior -single -update -delete"
        }
      }
    },
    authenticate_fail: PgResource.functionResourceOptions(resourceConfig_jwt_token, {
      name: "authenticate_fail",
      identifier: "main.b.authenticate_fail()",
      from(...args) {
        return sql`${authenticate_failFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsArray: false,
      returnsSetof: false,
      isMutation: true,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "authenticate_fail"
        },
        tags: {}
      },
      description: undefined
    }),
    authenticate: PgResource.functionResourceOptions(resourceConfig_jwt_token, {
      name: "authenticate",
      identifier: "main.b.authenticate(int4,numeric,int8)",
      from(...args) {
        return sql`${authenticateFunctionIdentifer}(${sqlFromArgDigests(args)})`;
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
        codec: TYPES.numeric
      }, {
        name: "c",
        required: true,
        notNull: false,
        codec: TYPES.bigint
      }],
      returnsArray: false,
      returnsSetof: false,
      isMutation: true,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "authenticate"
        },
        tags: {}
      },
      description: undefined
    }),
    list_bde_mutation: {
      executor,
      name: "list_bde_mutation",
      identifier: "main.b.list_bde_mutation(_text,text,text)",
      from(...args) {
        return sql`${list_bde_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "b",
        required: true,
        notNull: false,
        codec: textArrayCodec
      }, {
        name: "d",
        required: true,
        notNull: false,
        codec: TYPES.text
      }, {
        name: "e",
        required: true,
        notNull: false,
        codec: TYPES.text
      }],
      isUnique: !false,
      codec: uuidArrayCodec,
      uniques: [],
      isMutation: true,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "list_bde_mutation"
        },
        tags: {}
      },
      description: undefined
    },
    authenticate_many: PgResource.functionResourceOptions(resourceConfig_jwt_token, {
      name: "authenticate_many",
      identifier: "main.b.authenticate_many(int4,numeric,int8)",
      from(...args) {
        return sql`${authenticate_manyFunctionIdentifer}(${sqlFromArgDigests(args)})`;
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
        codec: TYPES.numeric
      }, {
        name: "c",
        required: true,
        notNull: false,
        codec: TYPES.bigint
      }],
      returnsArray: true,
      returnsSetof: false,
      isMutation: true,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "authenticate_many"
        },
        tags: {}
      },
      description: undefined
    }),
    authenticate_payload: PgResource.functionResourceOptions({
      executor: executor,
      name: "auth_payload",
      identifier: "main.b.auth_payload",
      from: authPayloadIdentifier,
      codec: authPayloadCodec,
      uniques: [],
      isVirtual: true,
      description: undefined,
      extensions: {
        description: undefined,
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
      }
    }, {
      name: "authenticate_payload",
      identifier: "main.b.authenticate_payload(int4,numeric,int8)",
      from(...args) {
        return sql`${authenticate_payloadFunctionIdentifer}(${sqlFromArgDigests(args)})`;
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
        codec: TYPES.numeric
      }, {
        name: "c",
        required: true,
        notNull: false,
        codec: TYPES.bigint
      }],
      returnsArray: false,
      returnsSetof: false,
      isMutation: true,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "authenticate_payload"
        },
        tags: {}
      },
      description: undefined
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
        required: true,
        notNull: false,
        codec: compoundTypeCodec
      }],
      returnsArray: false,
      returnsSetof: false,
      isMutation: true,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "compound_type_mutation"
        },
        tags: {}
      },
      description: undefined
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
        required: true,
        notNull: false,
        codec: compoundTypeCodec
      }],
      returnsArray: false,
      returnsSetof: false,
      isMutation: false,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "compound_type_query"
        },
        tags: {}
      },
      description: undefined
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
        required: true,
        notNull: false,
        codec: compoundTypeCodec
      }],
      returnsArray: false,
      returnsSetof: true,
      isMutation: true,
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "compound_type_set_mutation"
        },
        tags: {}
      },
      description: undefined
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
        required: true,
        notNull: false,
        codec: compoundTypeCodec
      }],
      returnsArray: true,
      returnsSetof: false,
      isMutation: true,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "compound_type_array_mutation"
        },
        tags: {}
      },
      description: undefined
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
        required: true,
        notNull: false,
        codec: compoundTypeCodec
      }],
      returnsArray: true,
      returnsSetof: false,
      isMutation: false,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "compound_type_array_query"
        },
        tags: {}
      },
      description: undefined
    }),
    lists: {
      executor: executor,
      name: "lists",
      identifier: "main.b.lists",
      from: listsIdentifier,
      codec: listsCodec,
      uniques: listsUniques,
      isVirtual: false,
      description: undefined,
      extensions: {
        description: undefined,
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "lists"
        },
        isInsertable: true,
        isUpdatable: true,
        isDeletable: true,
        tags: {}
      }
    },
    types: registryConfig_pgResources_types_types,
    type_function_connection: PgResource.functionResourceOptions(registryConfig_pgResources_types_types, {
      name: "type_function_connection",
      identifier: "main.b.type_function_connection()",
      from(...args) {
        return sql`${type_function_connectionFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsArray: false,
      returnsSetof: true,
      isMutation: false,
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "type_function_connection"
        },
        tags: {}
      },
      description: undefined
    }),
    type_function_connection_mutation: PgResource.functionResourceOptions(registryConfig_pgResources_types_types, {
      name: "type_function_connection_mutation",
      identifier: "main.b.type_function_connection_mutation()",
      from(...args) {
        return sql`${type_function_connection_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsArray: false,
      returnsSetof: true,
      isMutation: true,
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "type_function_connection_mutation"
        },
        tags: {}
      },
      description: undefined
    }),
    type_function: PgResource.functionResourceOptions(registryConfig_pgResources_types_types, {
      name: "type_function",
      identifier: "main.b.type_function(int4)",
      from(...args) {
        return sql`${type_functionFunctionIdentifer}(${sqlFromArgDigests(args)})`;
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
          schemaName: "b",
          name: "type_function"
        },
        tags: {}
      },
      description: undefined
    }),
    type_function_mutation: PgResource.functionResourceOptions(registryConfig_pgResources_types_types, {
      name: "type_function_mutation",
      identifier: "main.b.type_function_mutation(int4)",
      from(...args) {
        return sql`${type_function_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
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
          schemaName: "b",
          name: "type_function_mutation"
        },
        tags: {}
      },
      description: undefined
    }),
    type_function_list: PgResource.functionResourceOptions(registryConfig_pgResources_types_types, {
      name: "type_function_list",
      identifier: "main.b.type_function_list()",
      from(...args) {
        return sql`${type_function_listFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsArray: true,
      returnsSetof: false,
      isMutation: false,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "type_function_list"
        },
        tags: {}
      },
      description: undefined
    }),
    type_function_list_mutation: PgResource.functionResourceOptions(registryConfig_pgResources_types_types, {
      name: "type_function_list_mutation",
      identifier: "main.b.type_function_list_mutation()",
      from(...args) {
        return sql`${type_function_list_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsArray: true,
      returnsSetof: false,
      isMutation: true,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "type_function_list_mutation"
        },
        tags: {}
      },
      description: undefined
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
  postgresArgName: "object",
  pgCodec: compoundTypeCodec,
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
  const step = fetcher ? fetcher($raw).record() : bakedInput(args.typeAt(fullPath), $raw);
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
  postgresArgName: "object",
  pgCodec: compoundTypeCodec,
  required: true,
  fetcher: null
}];
const makeArgs_compound_type_array_query = (args, path = []) => argDetailsSimple_compound_type_array_query.map(details => makeArg(path, args, details));
const resource_compound_type_array_queryPgResource = registry.pgResources["compound_type_array_query"];
const EMPTY_ARRAY = [];
const makeArgs_type_function_connection = () => EMPTY_ARRAY;
const resource_type_function_connectionPgResource = registry.pgResources["type_function_connection"];
const getSelectPlanFromParentAndArgs = ($root, args, _info) => {
  const selectArgs = makeArgs_type_function_connection(args);
  return resource_type_function_connectionPgResource.execute(selectArgs);
};
const argDetailsSimple_type_function = [{
  graphqlArgName: "id",
  postgresArgName: "id",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs_type_function = (args, path = []) => argDetailsSimple_type_function.map(details => makeArg(path, args, details));
const resource_type_functionPgResource = registry.pgResources["type_function"];
const resource_type_function_listPgResource = registry.pgResources["type_function_list"];
const nodeIdHandler_List = {
  typeName: "List",
  codec: nodeIdCodecs_base64JSON_base64JSON,
  deprecationReason: undefined,
  plan($record) {
    return list([constant("lists", false), $record.get("id")]);
  },
  getSpec($list) {
    return {
      id: access($list, [1])
    };
  },
  getIdentifiers(value) {
    return value.slice(1);
  },
  get(spec) {
    return resource_listsPgResource.get(spec);
  },
  match(obj) {
    return obj[0] === "lists";
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
const nodeFetcher_List = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_List));
  return nodeIdHandler_List.get(nodeIdHandler_List.getSpec(inhibitOnNull($decoded)));
};
const nodeIdHandler_Type = {
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
  getIdentifiers(value) {
    return value.slice(1);
  },
  get(spec) {
    return resource_typesPgResource.get(spec);
  },
  match(obj) {
    return obj[0] === "types";
  }
};
const nodeFetcher_Type = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Type));
  return nodeIdHandler_Type.get(nodeIdHandler_Type.getSpec(inhibitOnNull($decoded)));
};
const resource_updatable_viewPgResource = registry.pgResources["updatable_view"];
function qbWhereBuilder(qb) {
  return qb.whereBuilder();
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
const resource_frmcdc_compoundTypePgResource = registry.pgResources["frmcdc_compoundType"];
function DateSerialize(value) {
  return "" + value;
}
const coerce = string => {
  if (!/^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i.test(string)) {
    throw new GraphQLError("Invalid UUID, expected 32 hexadecimal characters, optionally with hypens");
  }
  return string;
};
const resource_frmcdc_nestedCompoundTypePgResource = registry.pgResources["frmcdc_nestedCompoundType"];
function LTreeParseValue(value) {
  return value;
}
const argDetailsSimple_mult_1 = [{
  graphqlArgName: "arg0",
  postgresArgName: null,
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "arg1",
  postgresArgName: null,
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs_mult_1 = (args, path = []) => argDetailsSimple_mult_1.map(details => makeArg(path, args, details));
const resource_mult_1PgResource = registry.pgResources["mult_1"];
const argDetailsSimple_mult_2 = [{
  graphqlArgName: "arg0",
  postgresArgName: null,
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "arg1",
  postgresArgName: null,
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs_mult_2 = (args, path = []) => argDetailsSimple_mult_2.map(details => makeArg(path, args, details));
const resource_mult_2PgResource = registry.pgResources["mult_2"];
const argDetailsSimple_mult_3 = [{
  graphqlArgName: "arg0",
  postgresArgName: null,
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "arg1",
  postgresArgName: null,
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs_mult_3 = (args, path = []) => argDetailsSimple_mult_3.map(details => makeArg(path, args, details));
const resource_mult_3PgResource = registry.pgResources["mult_3"];
const argDetailsSimple_mult_4 = [{
  graphqlArgName: "arg0",
  postgresArgName: null,
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "arg1",
  postgresArgName: null,
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs_mult_4 = (args, path = []) => argDetailsSimple_mult_4.map(details => makeArg(path, args, details));
const resource_mult_4PgResource = registry.pgResources["mult_4"];
const argDetailsSimple_guid_fn = [{
  graphqlArgName: "g",
  postgresArgName: "g",
  pgCodec: guidCodec,
  required: true,
  fetcher: null
}];
const makeArgs_guid_fn = (args, path = []) => argDetailsSimple_guid_fn.map(details => makeArg(path, args, details));
const resource_guid_fnPgResource = registry.pgResources["guid_fn"];
const resource_authenticate_failPgResource = registry.pgResources["authenticate_fail"];
const argDetailsSimple_authenticate = [{
  graphqlArgName: "a",
  postgresArgName: "a",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "b",
  postgresArgName: "b",
  pgCodec: TYPES.numeric,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "c",
  postgresArgName: "c",
  pgCodec: TYPES.bigint,
  required: true,
  fetcher: null
}];
const makeArgs_authenticate = (args, path = []) => argDetailsSimple_authenticate.map(details => makeArg(path, args, details));
const resource_authenticatePgResource = registry.pgResources["authenticate"];
const argDetailsSimple_list_bde_mutation = [{
  graphqlArgName: "b",
  postgresArgName: "b",
  pgCodec: textArrayCodec,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "d",
  postgresArgName: "d",
  pgCodec: TYPES.text,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "e",
  postgresArgName: "e",
  pgCodec: TYPES.text,
  required: true,
  fetcher: null
}];
const makeArgs_list_bde_mutation = (args, path = []) => argDetailsSimple_list_bde_mutation.map(details => makeArg(path, args, details));
const resource_list_bde_mutationPgResource = registry.pgResources["list_bde_mutation"];
const argDetailsSimple_authenticate_many = [{
  graphqlArgName: "a",
  postgresArgName: "a",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "b",
  postgresArgName: "b",
  pgCodec: TYPES.numeric,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "c",
  postgresArgName: "c",
  pgCodec: TYPES.bigint,
  required: true,
  fetcher: null
}];
const makeArgs_authenticate_many = (args, path = []) => argDetailsSimple_authenticate_many.map(details => makeArg(path, args, details));
const resource_authenticate_manyPgResource = registry.pgResources["authenticate_many"];
const argDetailsSimple_authenticate_payload = [{
  graphqlArgName: "a",
  postgresArgName: "a",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "b",
  postgresArgName: "b",
  pgCodec: TYPES.numeric,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "c",
  postgresArgName: "c",
  pgCodec: TYPES.bigint,
  required: true,
  fetcher: null
}];
const makeArgs_authenticate_payload = (args, path = []) => argDetailsSimple_authenticate_payload.map(details => makeArg(path, args, details));
const resource_authenticate_payloadPgResource = registry.pgResources["authenticate_payload"];
const argDetailsSimple_compound_type_mutation = [{
  graphqlArgName: "object",
  postgresArgName: "object",
  pgCodec: compoundTypeCodec,
  required: true,
  fetcher: null
}];
const makeArgs_compound_type_mutation = (args, path = []) => argDetailsSimple_compound_type_mutation.map(details => makeArg(path, args, details));
const resource_compound_type_mutationPgResource = registry.pgResources["compound_type_mutation"];
const argDetailsSimple_compound_type_set_mutation = [{
  graphqlArgName: "object",
  postgresArgName: "object",
  pgCodec: compoundTypeCodec,
  required: true,
  fetcher: null
}];
const makeArgs_compound_type_set_mutation = (args, path = []) => argDetailsSimple_compound_type_set_mutation.map(details => makeArg(path, args, details));
const resource_compound_type_set_mutationPgResource = registry.pgResources["compound_type_set_mutation"];
const argDetailsSimple_compound_type_array_mutation = [{
  graphqlArgName: "object",
  postgresArgName: "object",
  pgCodec: compoundTypeCodec,
  required: true,
  fetcher: null
}];
const makeArgs_compound_type_array_mutation = (args, path = []) => argDetailsSimple_compound_type_array_mutation.map(details => makeArg(path, args, details));
const resource_compound_type_array_mutationPgResource = registry.pgResources["compound_type_array_mutation"];
const resource_type_function_connection_mutationPgResource = registry.pgResources["type_function_connection_mutation"];
const argDetailsSimple_type_function_mutation = [{
  graphqlArgName: "id",
  postgresArgName: "id",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs_type_function_mutation = (args, path = []) => argDetailsSimple_type_function_mutation.map(details => makeArg(path, args, details));
const resource_type_function_mutationPgResource = registry.pgResources["type_function_mutation"];
const resource_type_function_list_mutationPgResource = registry.pgResources["type_function_list_mutation"];
const specFromArgs_List = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_List, inhibitOnNull($nodeId));
};
const specFromArgs_Type = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Type, inhibitOnNull($nodeId));
};
const specFromArgs_List2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_List, inhibitOnNull($nodeId));
};
const specFromArgs_Type2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Type, inhibitOnNull($nodeId));
};
const attributeNames = ["role", "exp", "a", "b", "c"];
const resource_frmcdc_jwtTokenPgResource = registry.pgResources["frmcdc_jwtToken"];
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
  listBdeMutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: ListBdeMutationInput!
  ): ListBdeMutationPayload
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
    listById(_$root, {
      $id
    }) {
      return resource_listsPgResource.get({
        id: $id
      });
    },
    typeById(_$root, {
      $id
    }) {
      return resource_typesPgResource.get({
        id: $id
      });
    },
    compoundTypeQuery($root, args, _info) {
      const selectArgs = makeArgs_compound_type_query(args);
      return resource_compound_type_queryPgResource.execute(selectArgs);
    },
    compoundTypeArrayQuery($root, args, _info) {
      const selectArgs = makeArgs_compound_type_array_query(args);
      return resource_compound_type_array_queryPgResource.execute(selectArgs);
    },
    typeFunctionConnection: {
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
    typeFunction($root, args, _info) {
      const selectArgs = makeArgs_type_function(args);
      return resource_type_functionPgResource.execute(selectArgs);
    },
    typeFunctionList($root, args, _info) {
      const selectArgs = makeArgs_type_function_connection(args);
      return resource_type_function_listPgResource.execute(selectArgs);
    },
    list(_$parent, args) {
      const $nodeId = args.getRaw("nodeId");
      return nodeFetcher_List($nodeId);
    },
    type(_$parent, args) {
      const $nodeId = args.getRaw("nodeId");
      return nodeFetcher_Type($nodeId);
    },
    allUpdatableViews: {
      plan() {
        return connection(resource_updatable_viewPgResource.find());
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
    allLists: {
      plan() {
        return connection(resource_listsPgResource.find());
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
        return connection(resource_typesPgResource.find());
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
  List: {
    __assertStep: assertPgClassSingleStep,
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of listsUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_listsPgResource.get(spec);
    },
    nodeId($parent) {
      const specifier = nodeIdHandler_List.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandler_List.codec.name].encode);
    },
    intArray($record) {
      return $record.get("int_array");
    },
    intArrayNn($record) {
      return $record.get("int_array_nn");
    },
    enumArray($record) {
      return $record.get("enum_array");
    },
    enumArrayNn($record) {
      return $record.get("enum_array_nn");
    },
    dateArray($record) {
      return $record.get("date_array");
    },
    dateArrayNn($record) {
      return $record.get("date_array_nn");
    },
    timestamptzArray($record) {
      return $record.get("timestamptz_array");
    },
    timestamptzArrayNn($record) {
      return $record.get("timestamptz_array_nn");
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
    byteaArray($record) {
      return $record.get("bytea_array");
    },
    byteaArrayNn($record) {
      return $record.get("bytea_array_nn");
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
  Date: {
    serialize: DateSerialize,
    parseValue: DateSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"Date" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
    }
  },
  Datetime: {
    serialize: DateSerialize,
    parseValue: DateSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"Datetime" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
    }
  },
  CompoundType: {
    __assertStep: assertPgClassSingleStep,
    fooBar($record) {
      return $record.get("foo_bar");
    }
  },
  UUID: {
    serialize: DateSerialize,
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
  Type: {
    __assertStep: assertPgClassSingleStep,
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of typesUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_typesPgResource.get(spec);
    },
    nodeId($parent) {
      const specifier = nodeIdHandler_Type.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandler_Type.codec.name].encode);
    },
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
    serialize: DateSerialize,
    parseValue: DateSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"BigInt" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
    }
  },
  BigFloat: {
    serialize: DateSerialize,
    parseValue: DateSerialize,
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
  Time: {
    serialize: DateSerialize,
    parseValue: DateSerialize,
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
    serialize: DateSerialize,
    parseValue: DateSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"InternetAddress" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
    }
  },
  RegProc: {
    serialize: DateSerialize,
    parseValue: DateSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"RegProc" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
    }
  },
  RegProcedure: {
    serialize: DateSerialize,
    parseValue: DateSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"RegProcedure" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
    }
  },
  RegOper: {
    serialize: DateSerialize,
    parseValue: DateSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"RegOper" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
    }
  },
  RegOperator: {
    serialize: DateSerialize,
    parseValue: DateSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"RegOperator" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
    }
  },
  RegClass: {
    serialize: DateSerialize,
    parseValue: DateSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"RegClass" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
    }
  },
  RegType: {
    serialize: DateSerialize,
    parseValue: DateSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"RegType" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
    }
  },
  RegConfig: {
    serialize: DateSerialize,
    parseValue: DateSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"RegConfig" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
    }
  },
  RegDictionary: {
    serialize: DateSerialize,
    parseValue: DateSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"RegDictionary" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
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
  Cursor: {
    serialize: DateSerialize,
    parseValue: DateSerialize,
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
  UpdatableViewsConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  UpdatableView: {
    __assertStep: assertPgClassSingleStep,
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of updatable_viewUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_updatable_viewPgResource.get(spec);
    }
  },
  UpdatableViewsEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  UpdatableViewCondition: {
    x($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "x",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    },
    name($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "name",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.varchar)}`;
        }
      });
    },
    description($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "description",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
        }
      });
    },
    constant($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "constant",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    }
  },
  UpdatableViewsOrderBy: {
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
    }
  },
  ListsConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  ListsEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  ListCondition: {
    id($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "id",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    },
    intArray($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "int_array",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, int4ArrayCodec)}`;
        }
      });
    },
    intArrayNn($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "int_array_nn",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, int4ArrayCodec)}`;
        }
      });
    },
    enumArray($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "enum_array",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, colorArrayCodec)}`;
        }
      });
    },
    enumArrayNn($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "enum_array_nn",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, colorArrayCodec)}`;
        }
      });
    },
    dateArray($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "date_array",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, dateArrayCodec)}`;
        }
      });
    },
    dateArrayNn($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "date_array_nn",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, dateArrayCodec)}`;
        }
      });
    },
    timestamptzArray($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "timestamptz_array",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, timestamptzArrayCodec)}`;
        }
      });
    },
    timestamptzArrayNn($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "timestamptz_array_nn",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, timestamptzArrayCodec)}`;
        }
      });
    },
    compoundTypeArray($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "compound_type_array",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, compoundTypeArrayCodec)}`;
        }
      });
    },
    compoundTypeArrayNn($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "compound_type_array_nn",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, compoundTypeArrayCodec)}`;
        }
      });
    }
  },
  ListsOrderBy: {
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
    smallint($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "smallint",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int2)}`;
        }
      });
    },
    bigint($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "bigint",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.bigint)}`;
        }
      });
    },
    numeric($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "numeric",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.numeric)}`;
        }
      });
    },
    decimal($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "decimal",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.numeric)}`;
        }
      });
    },
    boolean($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "boolean",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.boolean)}`;
        }
      });
    },
    varchar($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "varchar",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.varchar)}`;
        }
      });
    },
    enum($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "enum",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, colorCodec)}`;
        }
      });
    },
    enumArray($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "enum_array",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, colorArrayCodec)}`;
        }
      });
    },
    domain($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "domain",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, anIntCodec)}`;
        }
      });
    },
    domain2($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "domain2",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, anotherIntCodec)}`;
        }
      });
    },
    textArray($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "text_array",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, textArrayCodec)}`;
        }
      });
    },
    json($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "json",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.json)}`;
        }
      });
    },
    jsonb($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "jsonb",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.jsonb)}`;
        }
      });
    },
    nullableRange($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "nullable_range",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, numrangeCodec)}`;
        }
      });
    },
    numrange($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "numrange",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, numrangeCodec)}`;
        }
      });
    },
    daterange($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "daterange",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, daterangeCodec)}`;
        }
      });
    },
    anIntRange($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "an_int_range",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, anIntRangeCodec)}`;
        }
      });
    },
    timestamp($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "timestamp",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.timestamp)}`;
        }
      });
    },
    timestamptz($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "timestamptz",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.timestamptz)}`;
        }
      });
    },
    date($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "date",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.date)}`;
        }
      });
    },
    time($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "time",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.time)}`;
        }
      });
    },
    timetz($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "timetz",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.timetz)}`;
        }
      });
    },
    interval($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "interval",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.interval)}`;
        }
      });
    },
    intervalArray($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "interval_array",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, intervalArrayCodec)}`;
        }
      });
    },
    money($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "money",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.money)}`;
        }
      });
    },
    compoundType($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "compound_type",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, compoundTypeCodec)}`;
        }
      });
    },
    nestedCompoundType($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "nested_compound_type",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, nestedCompoundTypeCodec)}`;
        }
      });
    },
    nullableCompoundType($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "nullable_compound_type",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, compoundTypeCodec)}`;
        }
      });
    },
    nullableNestedCompoundType($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "nullable_nested_compound_type",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, nestedCompoundTypeCodec)}`;
        }
      });
    },
    point($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "point",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.point)}`;
        }
      });
    },
    nullablePoint($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "nullablePoint",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.point)}`;
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
    regproc($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "regproc",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.regproc)}`;
        }
      });
    },
    regprocedure($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "regprocedure",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.regprocedure)}`;
        }
      });
    },
    regoper($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "regoper",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.regoper)}`;
        }
      });
    },
    regoperator($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "regoperator",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.regoperator)}`;
        }
      });
    },
    regclass($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "regclass",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.regclass)}`;
        }
      });
    },
    regtype($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "regtype",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.regtype)}`;
        }
      });
    },
    regconfig($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "regconfig",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.regconfig)}`;
        }
      });
    },
    regdictionary($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "regdictionary",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.regdictionary)}`;
        }
      });
    },
    textArrayDomain($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "text_array_domain",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, textArrayDomainCodec)}`;
        }
      });
    },
    int8ArrayDomain($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "int8_array_domain",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, int8ArrayDomainCodec)}`;
        }
      });
    },
    ltree($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "ltree",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, spec_types_attributes_ltree_codec_ltree)}`;
        }
      });
    },
    ltreeArray($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "ltree_array",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, spec_types_attributes_ltree_array_codec_ltree_)}`;
        }
      });
    }
  },
  NestedCompoundTypeInput: {
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
    bazBuz(obj, val, {
      field,
      schema
    }) {
      obj.set("baz_buz", bakedInputRuntime(schema, field.type, val));
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
    }
  },
  Mutation: {
    __assertStep: __ValueStep,
    mult1: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_mult_1(args, ["input"]);
        const $result = resource_mult_1PgResource.execute(selectArgs, "mutation");
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
    mult2: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_mult_2(args, ["input"]);
        const $result = resource_mult_2PgResource.execute(selectArgs, "mutation");
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
    mult3: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_mult_3(args, ["input"]);
        const $result = resource_mult_3PgResource.execute(selectArgs, "mutation");
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
    mult4: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_mult_4(args, ["input"]);
        const $result = resource_mult_4PgResource.execute(selectArgs, "mutation");
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
    guidFn: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_guid_fn(args, ["input"]);
        const $result = resource_guid_fnPgResource.execute(selectArgs, "mutation");
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
    authenticateFail: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_type_function_connection(args, ["input"]);
        const $result = resource_authenticate_failPgResource.execute(selectArgs, "mutation");
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
    authenticate: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_authenticate(args, ["input"]);
        const $result = resource_authenticatePgResource.execute(selectArgs, "mutation");
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
    listBdeMutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_list_bde_mutation(args, ["input"]);
        const $result = resource_list_bde_mutationPgResource.execute(selectArgs, "mutation");
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
    authenticateMany: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_authenticate_many(args, ["input"]);
        const $result = resource_authenticate_manyPgResource.execute(selectArgs, "mutation");
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
    authenticatePayload: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_authenticate_payload(args, ["input"]);
        const $result = resource_authenticate_payloadPgResource.execute(selectArgs, "mutation");
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
    compoundTypeMutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_compound_type_mutation(args, ["input"]);
        const $result = resource_compound_type_mutationPgResource.execute(selectArgs, "mutation");
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
    compoundTypeSetMutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_compound_type_set_mutation(args, ["input"]);
        const $result = resource_compound_type_set_mutationPgResource.execute(selectArgs, "mutation");
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
    compoundTypeArrayMutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_compound_type_array_mutation(args, ["input"]);
        const $result = resource_compound_type_array_mutationPgResource.execute(selectArgs, "mutation");
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
    typeFunctionConnectionMutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_type_function_connection(args, ["input"]);
        const $result = resource_type_function_connection_mutationPgResource.execute(selectArgs, "mutation");
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
    typeFunctionMutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_type_function_mutation(args, ["input"]);
        const $result = resource_type_function_mutationPgResource.execute(selectArgs, "mutation");
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
    typeFunctionListMutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_type_function_connection(args, ["input"]);
        const $result = resource_type_function_list_mutationPgResource.execute(selectArgs, "mutation");
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
    createUpdatableView: {
      plan(_, args) {
        const $insert = pgInsertSingle(resource_updatable_viewPgResource, Object.create(null));
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
    createList: {
      plan(_, args) {
        const $insert = pgInsertSingle(resource_listsPgResource, Object.create(null));
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
        const $insert = pgInsertSingle(resource_typesPgResource, Object.create(null));
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
    updateList: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(resource_listsPgResource, specFromArgs_List(args));
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
      }
    },
    deleteList: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(resource_listsPgResource, specFromArgs_List2(args));
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
        input(_, $object) {
          return $object;
        }
      }
    },
    deleteType: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(resource_typesPgResource, specFromArgs_Type2(args));
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
        const $delete = pgDeleteSingle(resource_typesPgResource, {
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
  Mult1Payload: {
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
  Mult1Input: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  Mult2Payload: {
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
  Mult2Input: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  Mult3Payload: {
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
  Mult3Input: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  Mult4Payload: {
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
  Mult4Input: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  GuidFnPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      const $result = $object.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    guid($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  Guid: {
    serialize: GraphQLString.serialize,
    parseValue: GraphQLString.parseValue,
    parseLiteral: GraphQLString.parseLiteral
  },
  GuidFnInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  AuthenticateFailPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      const $result = $object.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    jwtToken($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
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
      }, {});
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
    parseLiteral(node, variables) {
      return LTreeParseValue(valueFromASTUntyped(node, variables));
    },
    plan($in) {
      const $record = $in;
      return $record.record();
    }
  },
  AuthenticateFailInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  AuthenticatePayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      const $result = $object.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    jwtToken($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  AuthenticateInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  ListBdeMutationPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      const $result = $object.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    uuids($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  ListBdeMutationInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  AuthenticateManyPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      const $result = $object.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    jwtTokens($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  AuthenticateManyInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  AuthenticatePayloadPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      const $result = $object.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    authPayload($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  AuthPayload: {
    __assertStep: assertPgClassSingleStep,
    jwt($record) {
      const $plan = $record.get("jwt");
      const $select = pgSelectSingleFromRecord(resource_frmcdc_jwtTokenPgResource, $plan);
      $select.getClassStep().setTrusted();
      return $select;
    }
  },
  AuthenticatePayloadInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  CompoundTypeMutationPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      const $result = $object.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    compoundType($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  CompoundTypeMutationInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  CompoundTypeSetMutationPayload: {
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
  CompoundTypeSetMutationInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  CompoundTypeArrayMutationPayload: {
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
  CompoundTypeArrayMutationInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  TypeFunctionConnectionMutationPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      const $result = $object.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    types($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  TypeFunctionConnectionMutationInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  TypeFunctionMutationPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      const $result = $object.getStepForKey("result");
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
          return resource_typesPgResource.find(spec);
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
  TypeFunctionMutationInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  TypeFunctionListMutationPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      const $result = $object.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    types($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  TypeFunctionListMutationInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  CreateUpdatableViewPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    updatableView($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  CreateUpdatableViewInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    updatableView(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UpdatableViewInput: {
    __baked: createObjectAndApplyChildren,
    x(obj, val, {
      field,
      schema
    }) {
      obj.set("x", bakedInputRuntime(schema, field.type, val));
    },
    name(obj, val, {
      field,
      schema
    }) {
      obj.set("name", bakedInputRuntime(schema, field.type, val));
    },
    description(obj, val, {
      field,
      schema
    }) {
      obj.set("description", bakedInputRuntime(schema, field.type, val));
    },
    constant(obj, val, {
      field,
      schema
    }) {
      obj.set("constant", bakedInputRuntime(schema, field.type, val));
    }
  },
  CreateListPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    list($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    listEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = listsUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_listsPgResource.find(spec);
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
  CreateListInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    list(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  ListInput: {
    __baked: createObjectAndApplyChildren,
    id(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
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
          return resource_typesPgResource.find(spec);
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
    smallint(obj, val, {
      field,
      schema
    }) {
      obj.set("smallint", bakedInputRuntime(schema, field.type, val));
    },
    bigint(obj, val, {
      field,
      schema
    }) {
      obj.set("bigint", bakedInputRuntime(schema, field.type, val));
    },
    numeric(obj, val, {
      field,
      schema
    }) {
      obj.set("numeric", bakedInputRuntime(schema, field.type, val));
    },
    decimal(obj, val, {
      field,
      schema
    }) {
      obj.set("decimal", bakedInputRuntime(schema, field.type, val));
    },
    boolean(obj, val, {
      field,
      schema
    }) {
      obj.set("boolean", bakedInputRuntime(schema, field.type, val));
    },
    varchar(obj, val, {
      field,
      schema
    }) {
      obj.set("varchar", bakedInputRuntime(schema, field.type, val));
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
    textArray(obj, val, {
      field,
      schema
    }) {
      obj.set("text_array", bakedInputRuntime(schema, field.type, val));
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
    nullableRange(obj, val, {
      field,
      schema
    }) {
      obj.set("nullable_range", bakedInputRuntime(schema, field.type, val));
    },
    numrange(obj, val, {
      field,
      schema
    }) {
      obj.set("numrange", bakedInputRuntime(schema, field.type, val));
    },
    daterange(obj, val, {
      field,
      schema
    }) {
      obj.set("daterange", bakedInputRuntime(schema, field.type, val));
    },
    anIntRange(obj, val, {
      field,
      schema
    }) {
      obj.set("an_int_range", bakedInputRuntime(schema, field.type, val));
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
    date(obj, val, {
      field,
      schema
    }) {
      obj.set("date", bakedInputRuntime(schema, field.type, val));
    },
    time(obj, val, {
      field,
      schema
    }) {
      obj.set("time", bakedInputRuntime(schema, field.type, val));
    },
    timetz(obj, val, {
      field,
      schema
    }) {
      obj.set("timetz", bakedInputRuntime(schema, field.type, val));
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
    money(obj, val, {
      field,
      schema
    }) {
      obj.set("money", bakedInputRuntime(schema, field.type, val));
    },
    compoundType(obj, val, {
      field,
      schema
    }) {
      obj.set("compound_type", bakedInputRuntime(schema, field.type, val));
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
    point(obj, val, {
      field,
      schema
    }) {
      obj.set("point", bakedInputRuntime(schema, field.type, val));
    },
    nullablePoint(obj, val, {
      field,
      schema
    }) {
      obj.set("nullablePoint", bakedInputRuntime(schema, field.type, val));
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
    regclass(obj, val, {
      field,
      schema
    }) {
      obj.set("regclass", bakedInputRuntime(schema, field.type, val));
    },
    regtype(obj, val, {
      field,
      schema
    }) {
      obj.set("regtype", bakedInputRuntime(schema, field.type, val));
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
    textArrayDomain(obj, val, {
      field,
      schema
    }) {
      obj.set("text_array_domain", bakedInputRuntime(schema, field.type, val));
    },
    int8ArrayDomain(obj, val, {
      field,
      schema
    }) {
      obj.set("int8_array_domain", bakedInputRuntime(schema, field.type, val));
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
    }
  },
  UpdateListPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    list($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    listEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = listsUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_listsPgResource.find(spec);
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
  UpdateListInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    listPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  ListPatch: {
    __baked: createObjectAndApplyChildren,
    id(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
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
    }
  },
  UpdateListByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    listPatch(qb, arg) {
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
          return resource_typesPgResource.find(spec);
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
    smallint(obj, val, {
      field,
      schema
    }) {
      obj.set("smallint", bakedInputRuntime(schema, field.type, val));
    },
    bigint(obj, val, {
      field,
      schema
    }) {
      obj.set("bigint", bakedInputRuntime(schema, field.type, val));
    },
    numeric(obj, val, {
      field,
      schema
    }) {
      obj.set("numeric", bakedInputRuntime(schema, field.type, val));
    },
    decimal(obj, val, {
      field,
      schema
    }) {
      obj.set("decimal", bakedInputRuntime(schema, field.type, val));
    },
    boolean(obj, val, {
      field,
      schema
    }) {
      obj.set("boolean", bakedInputRuntime(schema, field.type, val));
    },
    varchar(obj, val, {
      field,
      schema
    }) {
      obj.set("varchar", bakedInputRuntime(schema, field.type, val));
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
    textArray(obj, val, {
      field,
      schema
    }) {
      obj.set("text_array", bakedInputRuntime(schema, field.type, val));
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
    nullableRange(obj, val, {
      field,
      schema
    }) {
      obj.set("nullable_range", bakedInputRuntime(schema, field.type, val));
    },
    numrange(obj, val, {
      field,
      schema
    }) {
      obj.set("numrange", bakedInputRuntime(schema, field.type, val));
    },
    daterange(obj, val, {
      field,
      schema
    }) {
      obj.set("daterange", bakedInputRuntime(schema, field.type, val));
    },
    anIntRange(obj, val, {
      field,
      schema
    }) {
      obj.set("an_int_range", bakedInputRuntime(schema, field.type, val));
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
    date(obj, val, {
      field,
      schema
    }) {
      obj.set("date", bakedInputRuntime(schema, field.type, val));
    },
    time(obj, val, {
      field,
      schema
    }) {
      obj.set("time", bakedInputRuntime(schema, field.type, val));
    },
    timetz(obj, val, {
      field,
      schema
    }) {
      obj.set("timetz", bakedInputRuntime(schema, field.type, val));
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
    money(obj, val, {
      field,
      schema
    }) {
      obj.set("money", bakedInputRuntime(schema, field.type, val));
    },
    compoundType(obj, val, {
      field,
      schema
    }) {
      obj.set("compound_type", bakedInputRuntime(schema, field.type, val));
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
    point(obj, val, {
      field,
      schema
    }) {
      obj.set("point", bakedInputRuntime(schema, field.type, val));
    },
    nullablePoint(obj, val, {
      field,
      schema
    }) {
      obj.set("nullablePoint", bakedInputRuntime(schema, field.type, val));
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
    regclass(obj, val, {
      field,
      schema
    }) {
      obj.set("regclass", bakedInputRuntime(schema, field.type, val));
    },
    regtype(obj, val, {
      field,
      schema
    }) {
      obj.set("regtype", bakedInputRuntime(schema, field.type, val));
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
    textArrayDomain(obj, val, {
      field,
      schema
    }) {
      obj.set("text_array_domain", bakedInputRuntime(schema, field.type, val));
    },
    int8ArrayDomain(obj, val, {
      field,
      schema
    }) {
      obj.set("int8_array_domain", bakedInputRuntime(schema, field.type, val));
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
  DeleteListPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    list($object) {
      return $object.get("result");
    },
    deletedListId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandler_List.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    listEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = listsUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_listsPgResource.find(spec);
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
  DeleteListInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteListByIdInput: {
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
      const specifier = nodeIdHandler_Type.plan($record);
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
          return resource_typesPgResource.find(spec);
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
