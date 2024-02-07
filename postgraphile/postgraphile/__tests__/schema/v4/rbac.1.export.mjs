import { PgDeleteSingleStep, PgExecutor, PgResource, PgSelectStep, PgUnionAllStep, TYPES, assertPgClassSingleStep, domainOfCodec, enumCodec, listOfCodec, makeRegistry, pgDeleteSingle, pgInsertSingle, pgSelectFromRecord, pgSelectSingleFromRecord, pgUpdateSingle, rangeOfCodec, recordCodec, sqlFromArgDigests } from "@dataplan/pg";
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
  executor: executor_mainPgExecutor,
  isAnonymous: true
});
const attributes2 = Object.assign(Object.create(null), {
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
});
const registryConfig_pgCodecs_FuncOutOutSetofRecord_FuncOutOutSetofRecord = recordCodec({
  name: "FuncOutOutSetofRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: attributes2,
  description: undefined,
  extensions: {
    /* `The return type of our \`${name}\` ${
      pgProc.provolatile === "v" ? "mutation" : "query"
    }.`, */
  },
  executor: executor_mainPgExecutor,
  isAnonymous: true
});
const attributes3 = Object.assign(Object.create(null), {
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
});
const registryConfig_pgCodecs_FuncOutOutUnnamedRecord_FuncOutOutUnnamedRecord = recordCodec({
  name: "FuncOutOutUnnamedRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: attributes3,
  description: undefined,
  extensions: {
    /* `The return type of our \`${name}\` ${
      pgProc.provolatile === "v" ? "mutation" : "query"
    }.`, */
  },
  executor: executor_mainPgExecutor,
  isAnonymous: true
});
const attributes4 = Object.assign(Object.create(null), {
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
});
const registryConfig_pgCodecs_MutationOutOutRecord_MutationOutOutRecord = recordCodec({
  name: "MutationOutOutRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: attributes4,
  description: undefined,
  extensions: {
    /* `The return type of our \`${name}\` ${
      pgProc.provolatile === "v" ? "mutation" : "query"
    }.`, */
  },
  executor: executor_mainPgExecutor,
  isAnonymous: true
});
const attributes5 = Object.assign(Object.create(null), {
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
});
const registryConfig_pgCodecs_MutationOutOutSetofRecord_MutationOutOutSetofRecord = recordCodec({
  name: "MutationOutOutSetofRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: attributes5,
  description: undefined,
  extensions: {
    /* `The return type of our \`${name}\` ${
      pgProc.provolatile === "v" ? "mutation" : "query"
    }.`, */
  },
  executor: executor_mainPgExecutor,
  isAnonymous: true
});
const attributes6 = Object.assign(Object.create(null), {
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
});
const registryConfig_pgCodecs_MutationOutOutUnnamedRecord_MutationOutOutUnnamedRecord = recordCodec({
  name: "MutationOutOutUnnamedRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: attributes6,
  description: undefined,
  extensions: {
    /* `The return type of our \`${name}\` ${
      pgProc.provolatile === "v" ? "mutation" : "query"
    }.`, */
  },
  executor: executor_mainPgExecutor,
  isAnonymous: true
});
const attributes7 = Object.assign(Object.create(null), {
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
});
const registryConfig_pgCodecs_SearchTestSummariesRecord_SearchTestSummariesRecord = recordCodec({
  name: "SearchTestSummariesRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: attributes7,
  description: undefined,
  extensions: {
    /* `The return type of our \`${name}\` ${
      pgProc.provolatile === "v" ? "mutation" : "query"
    }.`, */
  },
  executor: executor_mainPgExecutor,
  isAnonymous: true
});
const attributes8 = Object.assign(Object.create(null), {
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
});
const registryConfig_pgCodecs_FuncOutUnnamedOutOutUnnamedRecord_FuncOutUnnamedOutOutUnnamedRecord = recordCodec({
  name: "FuncOutUnnamedOutOutUnnamedRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: attributes8,
  description: undefined,
  extensions: {
    /* `The return type of our \`${name}\` ${
      pgProc.provolatile === "v" ? "mutation" : "query"
    }.`, */
  },
  executor: executor_mainPgExecutor,
  isAnonymous: true
});
const attributes9 = Object.assign(Object.create(null), {
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
});
const registryConfig_pgCodecs_FuncReturnsTableMultiColRecord_FuncReturnsTableMultiColRecord = recordCodec({
  name: "FuncReturnsTableMultiColRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: attributes9,
  description: undefined,
  extensions: {
    /* `The return type of our \`${name}\` ${
      pgProc.provolatile === "v" ? "mutation" : "query"
    }.`, */
  },
  executor: executor_mainPgExecutor,
  isAnonymous: true
});
const attributes10 = Object.assign(Object.create(null), {
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
});
const registryConfig_pgCodecs_MutationOutUnnamedOutOutUnnamedRecord_MutationOutUnnamedOutOutUnnamedRecord = recordCodec({
  name: "MutationOutUnnamedOutOutUnnamedRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: attributes10,
  description: undefined,
  extensions: {
    /* `The return type of our \`${name}\` ${
      pgProc.provolatile === "v" ? "mutation" : "query"
    }.`, */
  },
  executor: executor_mainPgExecutor,
  isAnonymous: true
});
const attributes11 = Object.assign(Object.create(null), {
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
});
const registryConfig_pgCodecs_MutationReturnsTableMultiColRecord_MutationReturnsTableMultiColRecord = recordCodec({
  name: "MutationReturnsTableMultiColRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: attributes11,
  description: undefined,
  extensions: {
    /* `The return type of our \`${name}\` ${
      pgProc.provolatile === "v" ? "mutation" : "query"
    }.`, */
  },
  executor: executor_mainPgExecutor,
  isAnonymous: true
});
const sqlIdent = sql.identifier(...["b", "guid"]);
const registryConfig_pgCodecs_guid_guid = domainOfCodec(TYPES.varchar, "guid", sqlIdent, {
  description: undefined,
  extensions: {
    oid: "1375935",
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "guid"
    },
    tags: Object.create(null)
  },
  notNull: false
});
const extensions2 = {
  oid: "1187",
  pg: {
    serviceName: "main",
    schemaName: "pg_catalog",
    name: "_interval"
  },
  tags: Object.create(null)
};
const registryConfig_pgCodecs_intervalArray_intervalArray = listOfCodec(TYPES.interval, {
  extensions: extensions2,
  typeDelim: ",",
  description: undefined,
  name: "intervalArray"
});
const extensions3 = {
  oid: "1009",
  pg: {
    serviceName: "main",
    schemaName: "pg_catalog",
    name: "_text"
  },
  tags: Object.create(null)
};
const registryConfig_pgCodecs_textArray_textArray = listOfCodec(TYPES.text, {
  extensions: extensions3,
  typeDelim: ",",
  description: undefined,
  name: "textArray"
});
const attributes12 = Object.assign(Object.create(null), {
  "?column?": {
    description: undefined,
    codec: TYPES.int,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  }
});
const extensions4 = {
  oid: "1376013",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "non_updatable_view"
  },
  tags: Object.create(null)
};
const parts2 = ["a", "non_updatable_view"];
const sqlIdent2 = sql.identifier(...parts2);
const spec_nonUpdatableView = {
  name: "nonUpdatableView",
  identifier: sqlIdent2,
  attributes: attributes12,
  description: undefined,
  extensions: extensions4,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_nonUpdatableView_nonUpdatableView = recordCodec(spec_nonUpdatableView);
const attributes13 = Object.assign(Object.create(null), {
  id: {
    description: undefined,
    codec: TYPES.int,
    notNull: true,
    hasDefault: true,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  }
});
const extensions5 = {
  oid: "1376226",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "inputs"
  },
  tags: Object.create(null)
};
const parts3 = ["a", "inputs"];
const sqlIdent3 = sql.identifier(...parts3);
const spec_inputs = {
  name: "inputs",
  identifier: sqlIdent3,
  attributes: attributes13,
  description: "Should output as Input",
  extensions: extensions5,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_inputs_inputs = recordCodec(spec_inputs);
const attributes14 = Object.assign(Object.create(null), {
  id: {
    description: undefined,
    codec: TYPES.int,
    notNull: true,
    hasDefault: true,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  }
});
const extensions6 = {
  oid: "1376233",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "patchs"
  },
  tags: Object.create(null)
};
const parts4 = ["a", "patchs"];
const sqlIdent4 = sql.identifier(...parts4);
const spec_patchs = {
  name: "patchs",
  identifier: sqlIdent4,
  attributes: attributes14,
  description: "Should output as Patch",
  extensions: extensions6,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_patchs_patchs = recordCodec(spec_patchs);
const attributes15 = Object.assign(Object.create(null), {
  id: {
    description: undefined,
    codec: TYPES.int,
    notNull: true,
    hasDefault: true,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  }
});
const extensions7 = {
  oid: "1376240",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "reserved"
  },
  tags: Object.create(null)
};
const parts5 = ["a", "reserved"];
const sqlIdent5 = sql.identifier(...parts5);
const spec_reserved = {
  name: "reserved",
  identifier: sqlIdent5,
  attributes: attributes15,
  description: undefined,
  extensions: extensions7,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_reserved_reserved = recordCodec(spec_reserved);
const attributes16 = Object.assign(Object.create(null), {
  id: {
    description: undefined,
    codec: TYPES.int,
    notNull: true,
    hasDefault: true,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  }
});
const extensions8 = {
  oid: "1376254",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "reservedPatchs"
  },
  tags: Object.create(null)
};
const parts6 = ["a", "reservedPatchs"];
const sqlIdent6 = sql.identifier(...parts6);
const spec_reservedPatchs = {
  name: "reservedPatchs",
  identifier: sqlIdent6,
  attributes: attributes16,
  description: "`reservedPatchs` table should get renamed to ReservedPatchRecord to prevent clashes with ReservedPatch from `reserved` table",
  extensions: extensions8,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_reservedPatchs_reservedPatchs = recordCodec(spec_reservedPatchs);
const attributes17 = Object.assign(Object.create(null), {
  id: {
    description: undefined,
    codec: TYPES.int,
    notNull: true,
    hasDefault: true,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  }
});
const extensions9 = {
  oid: "1376247",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "reserved_input"
  },
  tags: Object.create(null)
};
const parts7 = ["a", "reserved_input"];
const sqlIdent7 = sql.identifier(...parts7);
const spec_reservedInput = {
  name: "reservedInput",
  identifier: sqlIdent7,
  attributes: attributes17,
  description: "`reserved_input` table should get renamed to ReservedInputRecord to prevent clashes with ReservedInput from `reserved` table",
  extensions: extensions9,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_reservedInput_reservedInput = recordCodec(spec_reservedInput);
const attributes18 = Object.assign(Object.create(null), {
  id: {
    description: undefined,
    codec: TYPES.int,
    notNull: true,
    hasDefault: true,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  null_value: {
    description: undefined,
    codec: TYPES.text,
    notNull: false,
    hasDefault: true,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  }
});
const extensions10 = {
  oid: "1376203",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "default_value"
  },
  tags: Object.create(null)
};
const parts8 = ["a", "default_value"];
const sqlIdent8 = sql.identifier(...parts8);
const spec_defaultValue = {
  name: "defaultValue",
  identifier: sqlIdent8,
  attributes: attributes18,
  description: undefined,
  extensions: extensions10,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_defaultValue_defaultValue = recordCodec(spec_defaultValue);
const attributes19 = Object.assign(Object.create(null), {
  id: {
    description: undefined,
    codec: TYPES.int,
    notNull: true,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  str: {
    description: undefined,
    codec: TYPES.text,
    notNull: true,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  }
});
const extensions11 = {
  oid: "1375843",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "no_primary_key"
  },
  tags: Object.create(null)
};
const parts9 = ["a", "no_primary_key"];
const sqlIdent9 = sql.identifier(...parts9);
const spec_noPrimaryKey = {
  name: "noPrimaryKey",
  identifier: sqlIdent9,
  attributes: attributes19,
  description: undefined,
  extensions: extensions11,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_noPrimaryKey_noPrimaryKey = recordCodec(spec_noPrimaryKey);
const attributes20 = Object.assign(Object.create(null), {
  compound_key_1: {
    description: undefined,
    codec: TYPES.int,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  compound_key_2: {
    description: undefined,
    codec: TYPES.int,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  }
});
const extensions12 = {
  oid: "1376050",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "unique_foreign_key"
  },
  tags: Object.assign(Object.create(null), {
    omit: "create,update,delete,all,order,filter",
    behavior: ["-insert -update -delete -query:resource:list -query:resource:connection -order -orderBy -filter -filterBy"]
  })
};
const parts10 = ["a", "unique_foreign_key"];
const sqlIdent10 = sql.identifier(...parts10);
const spec_uniqueForeignKey = {
  name: "uniqueForeignKey",
  identifier: sqlIdent10,
  attributes: attributes20,
  description: undefined,
  extensions: extensions12,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_uniqueForeignKey_uniqueForeignKey = recordCodec(spec_uniqueForeignKey);
const attributes21 = Object.assign(Object.create(null), {
  id: {
    description: undefined,
    codec: TYPES.int,
    notNull: true,
    hasDefault: true,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  json_data: {
    description: undefined,
    codec: TYPES.jsonb,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  }
});
const extensions13 = {
  oid: "1376262",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "my_table"
  },
  tags: Object.create(null)
};
const parts11 = ["c", "my_table"];
const sqlIdent11 = sql.identifier(...parts11);
const spec_myTable = {
  name: "myTable",
  identifier: sqlIdent11,
  attributes: attributes21,
  description: undefined,
  extensions: extensions13,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_myTable_myTable = recordCodec(spec_myTable);
const attributes22 = Object.assign(Object.create(null), {
  person_id: {
    description: undefined,
    codec: TYPES.int,
    notNull: true,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  sekrit: {
    description: "A secret held by the associated Person",
    codec: TYPES.text,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        name: "secret",
        behavior: ["-update"]
      }
    }
  }
});
const extensions14 = {
  oid: "1375864",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "person_secret"
  },
  tags: Object.assign(Object.create(null), {
    deprecated: "This is deprecated (comment on table c.person_secret)."
  })
};
const parts12 = ["c", "person_secret"];
const sqlIdent12 = sql.identifier(...parts12);
const spec_personSecret = {
  name: "personSecret",
  identifier: sqlIdent12,
  attributes: attributes22,
  description: "Tracks the person's secret",
  extensions: extensions14,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_personSecret_personSecret = recordCodec(spec_personSecret);
const attributes23 = Object.assign(Object.create(null), {
  person_id: {
    description: undefined,
    codec: TYPES.int,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  compound_key_1: {
    description: undefined,
    codec: TYPES.int,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  compound_key_2: {
    description: undefined,
    codec: TYPES.int,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  }
});
const extensions15 = {
  oid: "1376032",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "foreign_key"
  },
  tags: Object.create(null)
};
const parts13 = ["a", "foreign_key"];
const sqlIdent13 = sql.identifier(...parts13);
const spec_foreignKey = {
  name: "foreignKey",
  identifier: sqlIdent13,
  attributes: attributes23,
  description: undefined,
  extensions: extensions15,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_foreignKey_foreignKey = recordCodec(spec_foreignKey);
const attributes24 = Object.assign(Object.create(null), {
  testviewid: {
    description: undefined,
    codec: TYPES.int,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  col1: {
    description: undefined,
    codec: TYPES.int,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  col2: {
    description: undefined,
    codec: TYPES.int,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  }
});
const extensions16 = {
  oid: "1376219",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "testview"
  },
  tags: Object.create(null)
};
const parts14 = ["a", "testview"];
const sqlIdent14 = sql.identifier(...parts14);
const spec_testview = {
  name: "testview",
  identifier: sqlIdent14,
  attributes: attributes24,
  description: undefined,
  extensions: extensions16,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_testview_testview = recordCodec(spec_testview);
const extensions17 = {
  oid: "2951",
  pg: {
    serviceName: "main",
    schemaName: "pg_catalog",
    name: "_uuid"
  },
  tags: Object.create(null)
};
const registryConfig_pgCodecs_uuidArray_uuidArray = listOfCodec(TYPES.uuid, {
  extensions: extensions17,
  typeDelim: ",",
  description: undefined,
  name: "uuidArray"
});
const attributes25 = Object.assign(Object.create(null), {
  id: {
    description: undefined,
    codec: TYPES.int,
    notNull: true,
    hasDefault: true,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  col1: {
    description: undefined,
    codec: TYPES.int,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  col2: {
    description: undefined,
    codec: TYPES.int,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  }
});
const extensions18 = {
  oid: "1376213",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "view_table"
  },
  tags: Object.create(null)
};
const parts15 = ["a", "view_table"];
const sqlIdent15 = sql.identifier(...parts15);
const spec_viewTable = {
  name: "viewTable",
  identifier: sqlIdent15,
  attributes: attributes25,
  description: undefined,
  extensions: extensions18,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_viewTable_viewTable = recordCodec(spec_viewTable);
const attributes26 = Object.assign(Object.create(null), {
  person_id_2: {
    description: undefined,
    codec: TYPES.int,
    notNull: true,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  person_id_1: {
    description: undefined,
    codec: TYPES.int,
    notNull: true,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  extra: {
    description: undefined,
    codec: TYPES.boolean,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  }
});
const extensions19 = {
  oid: "1376017",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "compound_key"
  },
  tags: Object.create(null)
};
const parts16 = ["c", "compound_key"];
const sqlIdent16 = sql.identifier(...parts16);
const spec_compoundKey = {
  name: "compoundKey",
  identifier: sqlIdent16,
  attributes: attributes26,
  description: undefined,
  extensions: extensions19,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_compoundKey_compoundKey = recordCodec(spec_compoundKey);
const attributes27 = Object.assign(Object.create(null), {
  id: {
    description: undefined,
    codec: TYPES.int,
    notNull: true,
    hasDefault: true,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  col1: {
    description: undefined,
    codec: TYPES.int,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  col2: {
    description: undefined,
    codec: TYPES.int,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  col3: {
    description: undefined,
    codec: TYPES.int,
    notNull: true,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  }
});
const extensions20 = {
  oid: "1376189",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "similar_table_1"
  },
  tags: Object.create(null)
};
const parts17 = ["a", "similar_table_1"];
const sqlIdent17 = sql.identifier(...parts17);
const spec_similarTable1 = {
  name: "similarTable1",
  identifier: sqlIdent17,
  attributes: attributes27,
  description: undefined,
  extensions: extensions20,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_similarTable1_similarTable1 = recordCodec(spec_similarTable1);
const attributes28 = Object.assign(Object.create(null), {
  id: {
    description: undefined,
    codec: TYPES.int,
    notNull: true,
    hasDefault: true,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  col3: {
    description: undefined,
    codec: TYPES.int,
    notNull: true,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  col4: {
    description: undefined,
    codec: TYPES.int,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  col5: {
    description: undefined,
    codec: TYPES.int,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  }
});
const extensions21 = {
  oid: "1376196",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "similar_table_2"
  },
  tags: Object.create(null)
};
const parts18 = ["a", "similar_table_2"];
const sqlIdent18 = sql.identifier(...parts18);
const spec_similarTable2 = {
  name: "similarTable2",
  identifier: sqlIdent18,
  attributes: attributes28,
  description: undefined,
  extensions: extensions21,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_similarTable2_similarTable2 = recordCodec(spec_similarTable2);
const attributes_object_Object_ = Object.assign(Object.create(null), {
  x: {
    description: undefined,
    codec: TYPES.int,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  name: {
    description: undefined,
    codec: TYPES.varchar,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  description: {
    description: undefined,
    codec: TYPES.text,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  constant: {
    description: "This is constantly 2",
    codec: TYPES.int,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  }
});
const extensions22 = {
  oid: "1376009",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "b",
    name: "updatable_view"
  },
  tags: Object.assign(Object.create(null), {
    uniqueKey: "x",
    unique: "x|@behavior -single -update -delete"
  })
};
const parts19 = ["b", "updatable_view"];
const sqlIdent19 = sql.identifier(...parts19);
const spec_updatableView = {
  name: "updatableView",
  identifier: sqlIdent19,
  attributes: attributes_object_Object_,
  description: "YOYOYO!!",
  extensions: extensions22,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_updatableView_updatableView = recordCodec(spec_updatableView);
const attributes29 = Object.assign(Object.create(null), {
  id: {
    description: undefined,
    codec: TYPES.int,
    notNull: true,
    hasDefault: true,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  nullable_text: {
    description: undefined,
    codec: TYPES.text,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  nullable_int: {
    description: undefined,
    codec: TYPES.int,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  non_null_text: {
    description: undefined,
    codec: TYPES.text,
    notNull: true,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  }
});
const extensions23 = {
  oid: "1376280",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "null_test_record"
  },
  tags: Object.create(null)
};
const parts20 = ["c", "null_test_record"];
const sqlIdent20 = sql.identifier(...parts20);
const spec_nullTestRecord = {
  name: "nullTestRecord",
  identifier: sqlIdent20,
  attributes: attributes29,
  description: undefined,
  extensions: extensions23,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_nullTestRecord_nullTestRecord = recordCodec(spec_nullTestRecord);
const extensions24 = {
  oid: "1376269",
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "not_null_timestamp"
  },
  tags: Object.create(null)
};
const parts21 = ["c", "not_null_timestamp"];
const sqlIdent21 = sql.identifier(...parts21);
const attributes_ts_codec_notNullTimestamp = domainOfCodec(TYPES.timestamptz, "notNullTimestamp", sqlIdent21, {
  description: undefined,
  extensions: extensions24,
  notNull: true
});
const attributes30 = Object.assign(Object.create(null), {
  id: {
    description: undefined,
    codec: TYPES.int,
    notNull: true,
    hasDefault: true,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  ts: {
    description: undefined,
    codec: attributes_ts_codec_notNullTimestamp,
    notNull: true,
    hasDefault: true,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  }
});
const extensions25 = {
  oid: "1376273",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "issue756"
  },
  tags: Object.create(null)
};
const parts22 = ["c", "issue756"];
const sqlIdent22 = sql.identifier(...parts22);
const spec_issue756 = {
  name: "issue756",
  identifier: sqlIdent22,
  attributes: attributes30,
  description: undefined,
  extensions: extensions25,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_issue756_issue756 = recordCodec(spec_issue756);
const attributes31 = Object.assign(Object.create(null), {
  not_null_has_default: {
    description: undefined,
    codec: TYPES.boolean,
    notNull: true,
    hasDefault: true,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  wont_cast_easy: {
    description: undefined,
    codec: TYPES.int2,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  row_id: {
    description: undefined,
    codec: TYPES.int,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  }
});
const extensions26 = {
  oid: "1376065",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "edge_case"
  },
  tags: Object.create(null)
};
const parts23 = ["c", "edge_case"];
const sqlIdent23 = sql.identifier(...parts23);
const spec_edgeCase = {
  name: "edgeCase",
  identifier: sqlIdent23,
  attributes: attributes31,
  description: undefined,
  extensions: extensions26,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_edgeCase_edgeCase = recordCodec(spec_edgeCase);
const attributes32 = Object.assign(Object.create(null), {
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
});
const extensions27 = {
  oid: "1376178",
  isTableLike: false,
  pg: {
    serviceName: "main",
    schemaName: "b",
    name: "jwt_token"
  },
  tags: Object.create(null)
};
const parts24 = ["b", "jwt_token"];
const sqlIdent24 = sql.identifier(...parts24);
const spec_jwtToken = {
  name: "jwtToken",
  identifier: sqlIdent24,
  attributes: attributes32,
  description: undefined,
  extensions: extensions27,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_jwtToken_jwtToken = recordCodec(spec_jwtToken);
const attributes33 = Object.assign(Object.create(null), {
  id: {
    description: undefined,
    codec: TYPES.int,
    notNull: true,
    hasDefault: true,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  person_id: {
    description: undefined,
    codec: TYPES.int,
    notNull: true,
    hasDefault: true,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  length_in_metres: {
    description: undefined,
    codec: TYPES.float,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-update"]
      }
    }
  },
  mood: {
    description: undefined,
    codec: TYPES.text,
    notNull: true,
    hasDefault: true,
    extensions: {
      tags: {
        behavior: ["-insert"]
      }
    }
  }
});
const extensions28 = {
  oid: "1375877",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "left_arm"
  },
  tags: Object.create(null)
};
const parts25 = ["c", "left_arm"];
const sqlIdent25 = sql.identifier(...parts25);
const spec_leftArm = {
  name: "leftArm",
  identifier: sqlIdent25,
  attributes: attributes33,
  description: "Tracks metadata about the left arms of various people",
  extensions: extensions28,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_leftArm_leftArm = recordCodec(spec_leftArm);
const attributes34 = Object.assign(Object.create(null), {
  jwt: {
    description: undefined,
    codec: registryConfig_pgCodecs_jwtToken_jwtToken,
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
});
const extensions29 = {
  oid: "1376184",
  isTableLike: false,
  pg: {
    serviceName: "main",
    schemaName: "b",
    name: "auth_payload"
  },
  tags: Object.assign(Object.create(null), {
    foreignKey: "(id) references c.person"
  })
};
const parts26 = ["b", "auth_payload"];
const sqlIdent26 = sql.identifier(...parts26);
const spec_authPayload = {
  name: "authPayload",
  identifier: sqlIdent26,
  attributes: attributes34,
  description: undefined,
  extensions: extensions29,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_authPayload_authPayload = recordCodec(spec_authPayload);
const extensions30 = {
  oid: "1375966",
  pg: {
    serviceName: "main",
    schemaName: "b",
    name: "color"
  },
  tags: Object.create(null)
};
const parts27 = ["b", "color"];
const sqlIdent27 = sql.identifier(...parts27);
const attributes_c_codec_color = enumCodec({
  name: "color",
  identifier: sqlIdent27,
  values: ["red", "green", "blue"],
  description: undefined,
  extensions: extensions30
});
const enumLabels2 = ["FOO_BAR", "BAR_FOO", "BAZ_QUX", "0_BAR"];
const extensions31 = {
  oid: "1375974",
  pg: {
    serviceName: "main",
    schemaName: "b",
    name: "enum_caps"
  },
  tags: Object.create(null)
};
const parts28 = ["b", "enum_caps"];
const sqlIdent28 = sql.identifier(...parts28);
const attributes_e_codec_enumCaps = enumCodec({
  name: "enumCaps",
  identifier: sqlIdent28,
  values: enumLabels2,
  description: undefined,
  extensions: extensions31
});
const enumLabels3 = ["", "one", "two"];
const extensions32 = {
  oid: "1375984",
  pg: {
    serviceName: "main",
    schemaName: "b",
    name: "enum_with_empty_string"
  },
  tags: Object.create(null)
};
const parts29 = ["b", "enum_with_empty_string"];
const sqlIdent29 = sql.identifier(...parts29);
const attributes_f_codec_enumWithEmptyString = enumCodec({
  name: "enumWithEmptyString",
  identifier: sqlIdent29,
  values: enumLabels3,
  description: undefined,
  extensions: extensions32
});
const attributes36 = Object.assign(Object.create(null), {
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
const extensions33 = {
  oid: "1375993",
  isTableLike: false,
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "compound_type"
  },
  tags: Object.create(null)
};
const parts30 = ["c", "compound_type"];
const sqlIdent30 = sql.identifier(...parts30);
const spec_compoundType = {
  name: "compoundType",
  identifier: sqlIdent30,
  attributes: attributes36,
  description: "Awesome feature!",
  extensions: extensions33,
  executor: executor_mainPgExecutor
};
const attributes_o2_codec_compoundType = recordCodec(spec_compoundType);
const attributes35 = Object.assign(Object.create(null), {
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
    codec: attributes_o2_codec_compoundType,
    extensions: {
      argIndex: 2,
      argName: "o2"
    }
  }
});
const registryConfig_pgCodecs_FuncOutOutCompoundTypeRecord_FuncOutOutCompoundTypeRecord = recordCodec({
  name: "FuncOutOutCompoundTypeRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: attributes35,
  description: undefined,
  extensions: {
    /* `The return type of our \`${name}\` ${
      pgProc.provolatile === "v" ? "mutation" : "query"
    }.`, */
  },
  executor: executor_mainPgExecutor,
  isAnonymous: true
});
const attributes37 = Object.assign(Object.create(null), {
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
    codec: attributes_o2_codec_compoundType,
    extensions: {
      argIndex: 2,
      argName: "o2"
    }
  }
});
const registryConfig_pgCodecs_MutationOutOutCompoundTypeRecord_MutationOutOutCompoundTypeRecord = recordCodec({
  name: "MutationOutOutCompoundTypeRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: attributes37,
  description: undefined,
  extensions: {
    /* `The return type of our \`${name}\` ${
      pgProc.provolatile === "v" ? "mutation" : "query"
    }.`, */
  },
  executor: executor_mainPgExecutor,
  isAnonymous: true
});
const extensions34 = {
  oid: "1375894",
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "_an_enum"
  },
  tags: Object.create(null)
};
const enumLabels4 = ["awaiting", "rejected", "published", "*", "**", "***", "foo*", "foo*_", "_foo*", "*bar", "*bar_", "_*bar_", "*baz*", "_*baz*_", "%", ">=", "~~", "$"];
const extensions35 = {
  oid: "1375895",
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "an_enum"
  },
  tags: Object.create(null)
};
const parts31 = ["a", "an_enum"];
const sqlIdent31 = sql.identifier(...parts31);
const innerCodec_anEnum = enumCodec({
  name: "anEnum",
  identifier: sqlIdent31,
  values: enumLabels4,
  description: undefined,
  extensions: extensions35
});
const attributes_enums_codec_anEnumArray = listOfCodec(innerCodec_anEnum, {
  extensions: extensions34,
  typeDelim: ",",
  description: undefined,
  name: "anEnumArray"
});
const extensions36 = {
  oid: "1375932",
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "_comptype"
  },
  tags: Object.create(null)
};
const attributes40 = Object.assign(Object.create(null), {
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
});
const extensions37 = {
  oid: "1375933",
  isTableLike: false,
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "comptype"
  },
  tags: Object.create(null)
};
const parts32 = ["a", "comptype"];
const sqlIdent32 = sql.identifier(...parts32);
const spec_comptype = {
  name: "comptype",
  identifier: sqlIdent32,
  attributes: attributes40,
  description: undefined,
  extensions: extensions37,
  executor: executor_mainPgExecutor
};
const innerCodec_comptype = recordCodec(spec_comptype);
const attributes_comptypes_codec_comptypeArray = listOfCodec(innerCodec_comptype, {
  extensions: extensions36,
  typeDelim: ",",
  description: undefined,
  name: "comptypeArray"
});
const attributes39 = Object.assign(Object.create(null), {
  id: {
    description: undefined,
    codec: TYPES.int,
    notNull: true,
    hasDefault: true,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  headline: {
    description: undefined,
    codec: TYPES.text,
    notNull: true,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  body: {
    description: undefined,
    codec: TYPES.text,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  author_id: {
    description: undefined,
    codec: TYPES.int,
    notNull: false,
    hasDefault: true,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  enums: {
    description: undefined,
    codec: attributes_enums_codec_anEnumArray,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-select -filterBy -orderBy -insert -update"]
      }
    }
  },
  comptypes: {
    description: undefined,
    codec: attributes_comptypes_codec_comptypeArray,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-select -filterBy -orderBy -insert -update"]
      }
    }
  }
});
const extensions38 = {
  oid: "1375941",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "post"
  },
  tags: Object.create(null)
};
const parts33 = ["a", "post"];
const sqlIdent33 = sql.identifier(...parts33);
const spec_post = {
  name: "post",
  identifier: sqlIdent33,
  attributes: attributes39,
  description: undefined,
  extensions: extensions38,
  executor: executor_mainPgExecutor
};
const attributes_post_codec_post = recordCodec(spec_post);
const attributes38 = Object.assign(Object.create(null), {
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
    codec: registryConfig_pgCodecs_leftArm_leftArm,
    extensions: {
      argIndex: 3,
      argName: "left_arm"
    }
  },
  post: {
    notNull: false,
    codec: attributes_post_codec_post,
    extensions: {
      argIndex: 4,
      argName: "post"
    }
  }
});
const registryConfig_pgCodecs_QueryOutputTwoRowsRecord_QueryOutputTwoRowsRecord = recordCodec({
  name: "QueryOutputTwoRowsRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: attributes38,
  description: undefined,
  extensions: {
    /* `The return type of our \`${name}\` ${
      pgProc.provolatile === "v" ? "mutation" : "query"
    }.`, */
  },
  executor: executor_mainPgExecutor,
  isAnonymous: true
});
const attributes41 = Object.assign(Object.create(null), {
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
});
const registryConfig_pgCodecs_PersonComputedOutOutRecord_PersonComputedOutOutRecord = recordCodec({
  name: "PersonComputedOutOutRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: attributes41,
  description: undefined,
  extensions: {
    /* `The return type of our \`${name}\` ${
      pgProc.provolatile === "v" ? "mutation" : "query"
    }.`, */
  },
  executor: executor_mainPgExecutor,
  isAnonymous: true
});
const attributes42 = Object.assign(Object.create(null), {
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
});
const registryConfig_pgCodecs_PersonComputedInoutOutRecord_PersonComputedInoutOutRecord = recordCodec({
  name: "PersonComputedInoutOutRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: attributes42,
  description: undefined,
  extensions: {
    /* `The return type of our \`${name}\` ${
      pgProc.provolatile === "v" ? "mutation" : "query"
    }.`, */
  },
  executor: executor_mainPgExecutor,
  isAnonymous: true
});
const extensions39 = {
  oid: "1375839",
  pg: {
    serviceName: "main",
    schemaName: "b",
    name: "email"
  },
  tags: Object.create(null)
};
const parts34 = ["b", "email"];
const sqlIdent34 = sql.identifier(...parts34);
const attributes_email_codec_email = domainOfCodec(TYPES.text, "email", sqlIdent34, {
  description: undefined,
  extensions: extensions39,
  notNull: false
});
const extensions40 = {
  oid: "1375834",
  pg: {
    serviceName: "main",
    schemaName: "b",
    name: "not_null_url"
  },
  tags: Object.create(null)
};
const parts35 = ["b", "not_null_url"];
const sqlIdent35 = sql.identifier(...parts35);
const attributes_url_codec_notNullUrl = domainOfCodec(TYPES.varchar, "notNullUrl", sqlIdent35, {
  description: undefined,
  extensions: extensions40,
  notNull: true
});
const attributes45 = Object.assign(Object.create(null), {
  url: {
    description: undefined,
    codec: attributes_url_codec_notNullUrl,
    notNull: true,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  }
});
const extensions41 = {
  oid: "1375837",
  isTableLike: false,
  pg: {
    serviceName: "main",
    schemaName: "b",
    name: "wrapped_url"
  },
  tags: Object.create(null)
};
const parts36 = ["b", "wrapped_url"];
const sqlIdent36 = sql.identifier(...parts36);
const spec_wrappedUrl = {
  name: "wrappedUrl",
  identifier: sqlIdent36,
  attributes: attributes45,
  description: undefined,
  extensions: extensions41,
  executor: executor_mainPgExecutor
};
const attributes_site_codec_wrappedUrl = recordCodec(spec_wrappedUrl);
const attributes44 = Object.assign(Object.create(null), {
  id: {
    description: "The primary unique identifier for the person",
    codec: TYPES.int,
    notNull: true,
    hasDefault: true,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
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
    codec: registryConfig_pgCodecs_textArray_textArray,
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
    codec: attributes_email_codec_email,
    notNull: true,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  },
  site: {
    description: undefined,
    codec: attributes_site_codec_wrappedUrl,
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
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  last_login_from_ip: {
    description: undefined,
    codec: TYPES.inet,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  last_login_from_subnet: {
    description: undefined,
    codec: TYPES.cidr,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  user_mac: {
    description: undefined,
    codec: TYPES.macaddr,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  created_at: {
    description: undefined,
    codec: TYPES.timestamp,
    notNull: false,
    hasDefault: true,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  }
});
const extensions42 = {
  oid: "1375851",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "person"
  },
  tags: Object.create(null)
};
const parts37 = ["c", "person"];
const sqlIdent37 = sql.identifier(...parts37);
const spec_person = {
  name: "person",
  identifier: sqlIdent37,
  attributes: attributes44,
  description: "Person test comment",
  extensions: extensions42,
  executor: executor_mainPgExecutor
};
const attributes_person_codec_person = recordCodec(spec_person);
const attributes43 = Object.assign(Object.create(null), {
  person: {
    notNull: false,
    codec: attributes_person_codec_person,
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
});
const registryConfig_pgCodecs_PersonComputedFirstArgInoutOutRecord_PersonComputedFirstArgInoutOutRecord = recordCodec({
  name: "PersonComputedFirstArgInoutOutRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: attributes43,
  description: undefined,
  extensions: {
    /* `The return type of our \`${name}\` ${
      pgProc.provolatile === "v" ? "mutation" : "query"
    }.`, */
  },
  executor: executor_mainPgExecutor,
  isAnonymous: true
});
const attributes46 = Object.assign(Object.create(null), {
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
    codec: attributes_o2_codec_compoundType,
    extensions: {
      argIndex: 3,
      argName: "y"
    }
  },
  z: {
    notNull: false,
    codec: attributes_person_codec_person,
    extensions: {
      argIndex: 4,
      argName: "z"
    }
  }
});
const registryConfig_pgCodecs_FuncOutComplexRecord_FuncOutComplexRecord = recordCodec({
  name: "FuncOutComplexRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: attributes46,
  description: undefined,
  extensions: {
    /* `The return type of our \`${name}\` ${
      pgProc.provolatile === "v" ? "mutation" : "query"
    }.`, */
  },
  executor: executor_mainPgExecutor,
  isAnonymous: true
});
const attributes47 = Object.assign(Object.create(null), {
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
    codec: attributes_o2_codec_compoundType,
    extensions: {
      argIndex: 3,
      argName: "y"
    }
  },
  z: {
    notNull: false,
    codec: attributes_person_codec_person,
    extensions: {
      argIndex: 4,
      argName: "z"
    }
  }
});
const registryConfig_pgCodecs_FuncOutComplexSetofRecord_FuncOutComplexSetofRecord = recordCodec({
  name: "FuncOutComplexSetofRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: attributes47,
  description: undefined,
  extensions: {
    /* `The return type of our \`${name}\` ${
      pgProc.provolatile === "v" ? "mutation" : "query"
    }.`, */
  },
  executor: executor_mainPgExecutor,
  isAnonymous: true
});
const attributes48 = Object.assign(Object.create(null), {
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
    codec: attributes_o2_codec_compoundType,
    extensions: {
      argIndex: 3,
      argName: "y"
    }
  },
  z: {
    notNull: false,
    codec: attributes_person_codec_person,
    extensions: {
      argIndex: 4,
      argName: "z"
    }
  }
});
const registryConfig_pgCodecs_MutationOutComplexRecord_MutationOutComplexRecord = recordCodec({
  name: "MutationOutComplexRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: attributes48,
  description: undefined,
  extensions: {
    /* `The return type of our \`${name}\` ${
      pgProc.provolatile === "v" ? "mutation" : "query"
    }.`, */
  },
  executor: executor_mainPgExecutor,
  isAnonymous: true
});
const attributes49 = Object.assign(Object.create(null), {
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
    codec: attributes_o2_codec_compoundType,
    extensions: {
      argIndex: 3,
      argName: "y"
    }
  },
  z: {
    notNull: false,
    codec: attributes_person_codec_person,
    extensions: {
      argIndex: 4,
      argName: "z"
    }
  }
});
const registryConfig_pgCodecs_MutationOutComplexSetofRecord_MutationOutComplexSetofRecord = recordCodec({
  name: "MutationOutComplexSetofRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: attributes49,
  description: undefined,
  extensions: {
    /* `The return type of our \`${name}\` ${
      pgProc.provolatile === "v" ? "mutation" : "query"
    }.`, */
  },
  executor: executor_mainPgExecutor,
  isAnonymous: true
});
const attributes50 = Object.assign(Object.create(null), {
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
    codec: attributes_o2_codec_compoundType,
    extensions: {
      argIndex: 4,
      argName: "y"
    }
  },
  z: {
    notNull: false,
    codec: attributes_person_codec_person,
    extensions: {
      argIndex: 5,
      argName: "z"
    }
  }
});
const registryConfig_pgCodecs_PersonComputedComplexRecord_PersonComputedComplexRecord = recordCodec({
  name: "PersonComputedComplexRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: attributes50,
  description: undefined,
  extensions: {
    /* `The return type of our \`${name}\` ${
      pgProc.provolatile === "v" ? "mutation" : "query"
    }.`, */
  },
  executor: executor_mainPgExecutor,
  isAnonymous: true
});
const extensions43 = {
  oid: "1375965",
  pg: {
    serviceName: "main",
    schemaName: "b",
    name: "_color"
  },
  tags: Object.create(null)
};
const attributes_enum_array_codec_colorArray = listOfCodec(attributes_c_codec_color, {
  extensions: extensions43,
  typeDelim: ",",
  description: undefined,
  name: "colorArray"
});
const extensions44 = {
  oid: "1376071",
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "an_int"
  },
  tags: Object.create(null)
};
const parts38 = ["a", "an_int"];
const sqlIdent38 = sql.identifier(...parts38);
const attributes_domain_codec_anInt = domainOfCodec(TYPES.int, "anInt", sqlIdent38, {
  description: undefined,
  extensions: extensions44,
  notNull: false
});
const extensions45 = {
  oid: "1376073",
  pg: {
    serviceName: "main",
    schemaName: "b",
    name: "another_int"
  },
  tags: Object.create(null)
};
const parts39 = ["b", "another_int"];
const sqlIdent39 = sql.identifier(...parts39);
const attributes_domain2_codec_anotherInt = domainOfCodec(attributes_domain_codec_anInt, "anotherInt", sqlIdent39, {
  description: undefined,
  extensions: extensions45,
  notNull: false
});
const extensions46 = {
  oid: "3906",
  pg: {
    serviceName: "main",
    schemaName: "pg_catalog",
    name: "numrange"
  },
  tags: Object.create(null)
};
const parts40 = ["pg_catalog", "numrange"];
const sqlIdent40 = sql.identifier(...parts40);
const attributes_nullable_range_codec_numrange = rangeOfCodec(TYPES.numeric, "numrange", sqlIdent40, {
  description: "range of numerics",
  extensions: extensions46
});
const extensions47 = {
  oid: "3912",
  pg: {
    serviceName: "main",
    schemaName: "pg_catalog",
    name: "daterange"
  },
  tags: Object.create(null)
};
const parts41 = ["pg_catalog", "daterange"];
const sqlIdent41 = sql.identifier(...parts41);
const attributes_daterange_codec_daterange = rangeOfCodec(TYPES.date, "daterange", sqlIdent41, {
  description: "range of dates",
  extensions: extensions47
});
const extensions48 = {
  oid: "1376077",
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "an_int_range"
  },
  tags: Object.create(null)
};
const parts42 = ["a", "an_int_range"];
const sqlIdent42 = sql.identifier(...parts42);
const attributes_an_int_range_codec_anIntRange = rangeOfCodec(attributes_domain_codec_anInt, "anIntRange", sqlIdent42, {
  description: undefined,
  extensions: extensions48
});
const attributes52 = Object.assign(Object.create(null), {
  a: {
    description: undefined,
    codec: attributes_o2_codec_compoundType,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  },
  b: {
    description: undefined,
    codec: attributes_o2_codec_compoundType,
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
});
const extensions49 = {
  oid: "1375996",
  isTableLike: false,
  pg: {
    serviceName: "main",
    schemaName: "b",
    name: "nested_compound_type"
  },
  tags: Object.create(null)
};
const parts43 = ["b", "nested_compound_type"];
const sqlIdent43 = sql.identifier(...parts43);
const spec_nestedCompoundType = {
  name: "nestedCompoundType",
  identifier: sqlIdent43,
  attributes: attributes52,
  description: undefined,
  extensions: extensions49,
  executor: executor_mainPgExecutor
};
const attributes_nested_compound_type_codec_nestedCompoundType = recordCodec(spec_nestedCompoundType);
const extensions50 = {
  oid: "1376085",
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "text_array_domain"
  },
  tags: Object.create(null)
};
const parts44 = ["c", "text_array_domain"];
const sqlIdent44 = sql.identifier(...parts44);
const attributes_text_array_domain_codec_textArrayDomain = domainOfCodec(registryConfig_pgCodecs_textArray_textArray, "textArrayDomain", sqlIdent44, {
  description: undefined,
  extensions: extensions50,
  notNull: false
});
const extensions51 = {
  oid: "1376087",
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "int8_array_domain"
  },
  tags: Object.create(null)
};
const extensions52 = {
  oid: "1016",
  pg: {
    serviceName: "main",
    schemaName: "pg_catalog",
    name: "_int8"
  },
  tags: Object.create(null)
};
const innerCodec_int8Array = listOfCodec(TYPES.bigint, {
  extensions: extensions52,
  typeDelim: ",",
  description: undefined,
  name: "int8Array"
});
const parts45 = ["c", "int8_array_domain"];
const sqlIdent45 = sql.identifier(...parts45);
const attributes_int8_array_domain_codec_int8ArrayDomain = domainOfCodec(innerCodec_int8Array, "int8ArrayDomain", sqlIdent45, {
  description: undefined,
  extensions: extensions51,
  notNull: false
});
const extensions53 = {
  oid: "1001",
  pg: {
    serviceName: "main",
    schemaName: "pg_catalog",
    name: "_bytea"
  },
  tags: Object.create(null)
};
const attributes_bytea_array_codec_byteaArray = listOfCodec(TYPES.bytea, {
  extensions: extensions53,
  typeDelim: ",",
  description: undefined,
  name: "byteaArray"
});
const attributes51 = Object.assign(Object.create(null), {
  id: {
    description: undefined,
    codec: TYPES.int,
    notNull: true,
    hasDefault: true,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  smallint: {
    description: undefined,
    codec: TYPES.int2,
    notNull: true,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  bigint: {
    description: undefined,
    codec: TYPES.bigint,
    notNull: true,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  numeric: {
    description: undefined,
    codec: TYPES.numeric,
    notNull: true,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  decimal: {
    description: undefined,
    codec: TYPES.numeric,
    notNull: true,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  boolean: {
    description: undefined,
    codec: TYPES.boolean,
    notNull: true,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  varchar: {
    description: undefined,
    codec: TYPES.varchar,
    notNull: true,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  enum: {
    description: undefined,
    codec: attributes_c_codec_color,
    notNull: true,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  enum_array: {
    description: undefined,
    codec: attributes_enum_array_codec_colorArray,
    notNull: true,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  domain: {
    description: undefined,
    codec: attributes_domain_codec_anInt,
    notNull: true,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  domain2: {
    description: undefined,
    codec: attributes_domain2_codec_anotherInt,
    notNull: true,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  text_array: {
    description: undefined,
    codec: registryConfig_pgCodecs_textArray_textArray,
    notNull: true,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  json: {
    description: undefined,
    codec: TYPES.json,
    notNull: true,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  jsonb: {
    description: undefined,
    codec: TYPES.jsonb,
    notNull: true,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  nullable_range: {
    description: undefined,
    codec: attributes_nullable_range_codec_numrange,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  numrange: {
    description: undefined,
    codec: attributes_nullable_range_codec_numrange,
    notNull: true,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  daterange: {
    description: undefined,
    codec: attributes_daterange_codec_daterange,
    notNull: true,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  an_int_range: {
    description: undefined,
    codec: attributes_an_int_range_codec_anIntRange,
    notNull: true,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  timestamp: {
    description: undefined,
    codec: TYPES.timestamp,
    notNull: true,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  timestamptz: {
    description: undefined,
    codec: TYPES.timestamptz,
    notNull: true,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  date: {
    description: undefined,
    codec: TYPES.date,
    notNull: true,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  time: {
    description: undefined,
    codec: TYPES.time,
    notNull: true,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  timetz: {
    description: undefined,
    codec: TYPES.timetz,
    notNull: true,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  interval: {
    description: undefined,
    codec: TYPES.interval,
    notNull: true,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  interval_array: {
    description: undefined,
    codec: registryConfig_pgCodecs_intervalArray_intervalArray,
    notNull: true,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  money: {
    description: undefined,
    codec: TYPES.money,
    notNull: true,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  compound_type: {
    description: undefined,
    codec: attributes_o2_codec_compoundType,
    notNull: true,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  nested_compound_type: {
    description: undefined,
    codec: attributes_nested_compound_type_codec_nestedCompoundType,
    notNull: true,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  nullable_compound_type: {
    description: undefined,
    codec: attributes_o2_codec_compoundType,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  nullable_nested_compound_type: {
    description: undefined,
    codec: attributes_nested_compound_type_codec_nestedCompoundType,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  point: {
    description: undefined,
    codec: TYPES.point,
    notNull: true,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  nullablePoint: {
    description: undefined,
    codec: TYPES.point,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  inet: {
    description: undefined,
    codec: TYPES.inet,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  cidr: {
    description: undefined,
    codec: TYPES.cidr,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  macaddr: {
    description: undefined,
    codec: TYPES.macaddr,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  regproc: {
    description: undefined,
    codec: TYPES.regproc,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  regprocedure: {
    description: undefined,
    codec: TYPES.regprocedure,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  regoper: {
    description: undefined,
    codec: TYPES.regoper,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  regoperator: {
    description: undefined,
    codec: TYPES.regoperator,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  regclass: {
    description: undefined,
    codec: TYPES.regclass,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  regtype: {
    description: undefined,
    codec: TYPES.regtype,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  regconfig: {
    description: undefined,
    codec: TYPES.regconfig,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  regdictionary: {
    description: undefined,
    codec: TYPES.regdictionary,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  text_array_domain: {
    description: undefined,
    codec: attributes_text_array_domain_codec_textArrayDomain,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  int8_array_domain: {
    description: undefined,
    codec: attributes_int8_array_domain_codec_int8ArrayDomain,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  bytea: {
    description: undefined,
    codec: TYPES.bytea,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  },
  bytea_array: {
    description: undefined,
    codec: attributes_bytea_array_codec_byteaArray,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {
        behavior: ["-insert -update"]
      }
    }
  }
});
const extensions54 = {
  oid: "1376091",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "b",
    name: "types"
  },
  tags: Object.assign(Object.create(null), {
    foreignKey: ["(smallint) references a.post", "(id) references a.post"]
  })
};
const parts46 = ["b", "types"];
const sqlIdent46 = sql.identifier(...parts46);
const spec_types = {
  name: "types",
  identifier: sqlIdent46,
  attributes: attributes51,
  description: undefined,
  extensions: extensions54,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_types_types = recordCodec(spec_types);
const extensions55 = {
  oid: "1375992",
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "_compound_type"
  },
  tags: Object.create(null)
};
const extensions56 = {
  oid: "1376177",
  pg: {
    serviceName: "main",
    schemaName: "b",
    name: "_jwt_token"
  },
  tags: Object.create(null)
};
const extensions57 = {
  oid: "1376090",
  pg: {
    serviceName: "main",
    schemaName: "b",
    name: "_types"
  },
  tags: Object.create(null)
};
const extensions58 = {
  oid: "1007",
  pg: {
    serviceName: "main",
    schemaName: "pg_catalog",
    name: "_int4"
  },
  tags: Object.create(null)
};
const registryConfig_pgCodecs_int4Array_int4Array = listOfCodec(TYPES.int, {
  extensions: extensions58,
  typeDelim: ",",
  description: undefined,
  name: "int4Array"
});
const extensions59 = {
  oid: "1376000",
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "floatrange"
  },
  tags: Object.create(null)
};
const parts47 = ["c", "floatrange"];
const sqlIdent47 = sql.identifier(...parts47);
const registryConfig_pgCodecs_floatrange_floatrange = rangeOfCodec(TYPES.float, "floatrange", sqlIdent47, {
  description: undefined,
  extensions: extensions59
});
const extensions60 = {
  oid: "1375940",
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "_post"
  },
  tags: Object.create(null)
};
const registryConfig_pgCodecs_postArray_postArray = listOfCodec(attributes_post_codec_post, {
  extensions: extensions60,
  typeDelim: ",",
  description: undefined,
  name: "postArray"
});
const attributes53 = Object.assign(Object.create(null), {
  row_name: {
    description: undefined,
    codec: TYPES.text,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  },
  category_1: {
    description: undefined,
    codec: TYPES.text,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  },
  category_2: {
    description: undefined,
    codec: TYPES.text,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  }
});
const extensions61 = {
  oid: "1375567",
  isTableLike: false,
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "tablefunc_crosstab_2"
  },
  tags: Object.create(null)
};
const parts48 = ["a", "tablefunc_crosstab_2"];
const sqlIdent48 = sql.identifier(...parts48);
const spec_tablefuncCrosstab2 = {
  name: "tablefuncCrosstab2",
  identifier: sqlIdent48,
  attributes: attributes53,
  description: undefined,
  extensions: extensions61,
  executor: executor_mainPgExecutor
};
const attributes54 = Object.assign(Object.create(null), {
  row_name: {
    description: undefined,
    codec: TYPES.text,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  },
  category_1: {
    description: undefined,
    codec: TYPES.text,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  },
  category_2: {
    description: undefined,
    codec: TYPES.text,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  },
  category_3: {
    description: undefined,
    codec: TYPES.text,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  }
});
const extensions62 = {
  oid: "1375570",
  isTableLike: false,
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "tablefunc_crosstab_3"
  },
  tags: Object.create(null)
};
const parts49 = ["a", "tablefunc_crosstab_3"];
const sqlIdent49 = sql.identifier(...parts49);
const spec_tablefuncCrosstab3 = {
  name: "tablefuncCrosstab3",
  identifier: sqlIdent49,
  attributes: attributes54,
  description: undefined,
  extensions: extensions62,
  executor: executor_mainPgExecutor
};
const attributes55 = Object.assign(Object.create(null), {
  row_name: {
    description: undefined,
    codec: TYPES.text,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  },
  category_1: {
    description: undefined,
    codec: TYPES.text,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  },
  category_2: {
    description: undefined,
    codec: TYPES.text,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  },
  category_3: {
    description: undefined,
    codec: TYPES.text,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  },
  category_4: {
    description: undefined,
    codec: TYPES.text,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  }
});
const extensions63 = {
  oid: "1375573",
  isTableLike: false,
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "tablefunc_crosstab_4"
  },
  tags: Object.create(null)
};
const parts50 = ["a", "tablefunc_crosstab_4"];
const sqlIdent50 = sql.identifier(...parts50);
const spec_tablefuncCrosstab4 = {
  name: "tablefuncCrosstab4",
  identifier: sqlIdent50,
  attributes: attributes55,
  description: undefined,
  extensions: extensions63,
  executor: executor_mainPgExecutor
};
const extensions64 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "current_user_id"
  },
  tags: {
    behavior: ["queryField -mutationField -typeField", "-filter -order"]
  }
};
const parts51 = ["c", "current_user_id"];
const sqlIdent51 = sql.identifier(...parts51);
const extensions65 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "func_out"
  },
  tags: {
    behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  },
  singleOutputParameterName: "o"
};
const parts52 = ["c", "func_out"];
const sqlIdent52 = sql.identifier(...parts52);
const fromCallback2 = (...args) => sql`${sqlIdent52}(${sqlFromArgDigests(args)})`;
const parameters2 = [];
const extensions66 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "func_out_setof"
  },
  tags: {
    behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  },
  singleOutputParameterName: "o"
};
const parts53 = ["c", "func_out_setof"];
const sqlIdent53 = sql.identifier(...parts53);
const fromCallback3 = (...args) => sql`${sqlIdent53}(${sqlFromArgDigests(args)})`;
const parameters3 = [];
const extensions67 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "func_out_unnamed"
  },
  tags: {
    behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts54 = ["c", "func_out_unnamed"];
const sqlIdent54 = sql.identifier(...parts54);
const fromCallback4 = (...args) => sql`${sqlIdent54}(${sqlFromArgDigests(args)})`;
const parameters4 = [];
const extensions68 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "mutation_out"
  },
  tags: {
    behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  },
  singleOutputParameterName: "o"
};
const parts55 = ["c", "mutation_out"];
const sqlIdent55 = sql.identifier(...parts55);
const fromCallback5 = (...args) => sql`${sqlIdent55}(${sqlFromArgDigests(args)})`;
const parameters5 = [];
const extensions69 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "mutation_out_setof"
  },
  tags: {
    behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  },
  singleOutputParameterName: "o"
};
const parts56 = ["c", "mutation_out_setof"];
const sqlIdent56 = sql.identifier(...parts56);
const fromCallback6 = (...args) => sql`${sqlIdent56}(${sqlFromArgDigests(args)})`;
const parameters6 = [];
const extensions70 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "mutation_out_unnamed"
  },
  tags: {
    behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts57 = ["c", "mutation_out_unnamed"];
const sqlIdent57 = sql.identifier(...parts57);
const fromCallback7 = (...args) => sql`${sqlIdent57}(${sqlFromArgDigests(args)})`;
const parameters7 = [];
const extensions71 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "no_args_mutation"
  },
  tags: {
    behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts58 = ["c", "no_args_mutation"];
const sqlIdent58 = sql.identifier(...parts58);
const fromCallback8 = (...args) => sql`${sqlIdent58}(${sqlFromArgDigests(args)})`;
const parameters8 = [];
const extensions72 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "no_args_query"
  },
  tags: {
    behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts59 = ["c", "no_args_query"];
const sqlIdent59 = sql.identifier(...parts59);
const fromCallback9 = (...args) => sql`${sqlIdent59}(${sqlFromArgDigests(args)})`;
const parameters9 = [];
const extensions73 = {
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "return_void_mutation"
  },
  tags: {
    behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts60 = ["a", "return_void_mutation"];
const sqlIdent60 = sql.identifier(...parts60);
const fromCallback10 = (...args) => sql`${sqlIdent60}(${sqlFromArgDigests(args)})`;
const parameters10 = [];
const extensions74 = {
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "mutation_interval_set"
  },
  tags: {
    behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts61 = ["a", "mutation_interval_set"];
const sqlIdent61 = sql.identifier(...parts61);
const fromCallback11 = (...args) => sql`${sqlIdent61}(${sqlFromArgDigests(args)})`;
const parameters11 = [];
const extensions75 = {
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "query_interval_set"
  },
  tags: {
    behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts62 = ["a", "query_interval_set"];
const sqlIdent62 = sql.identifier(...parts62);
const fromCallback12 = (...args) => sql`${sqlIdent62}(${sqlFromArgDigests(args)})`;
const parameters12 = [];
const extensions76 = {
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "static_big_integer"
  },
  tags: {
    behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts63 = ["a", "static_big_integer"];
const sqlIdent63 = sql.identifier(...parts63);
const fromCallback13 = (...args) => sql`${sqlIdent63}(${sqlFromArgDigests(args)})`;
const parameters13 = [];
const extensions77 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "func_in_out"
  },
  tags: {
    behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  },
  singleOutputParameterName: "o"
};
const parts64 = ["c", "func_in_out"];
const sqlIdent64 = sql.identifier(...parts64);
const fromCallback14 = (...args) => sql`${sqlIdent64}(${sqlFromArgDigests(args)})`;
const parameters14 = [{
  name: "i",
  required: true,
  notNull: false,
  codec: TYPES.int
}];
const extensions78 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "func_returns_table_one_col"
  },
  tags: {
    behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  },
  singleOutputParameterName: "col1"
};
const parts65 = ["c", "func_returns_table_one_col"];
const sqlIdent65 = sql.identifier(...parts65);
const fromCallback15 = (...args) => sql`${sqlIdent65}(${sqlFromArgDigests(args)})`;
const parameters15 = [{
  name: "i",
  required: true,
  notNull: false,
  codec: TYPES.int
}];
const extensions79 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "mutation_in_out"
  },
  tags: {
    behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  },
  singleOutputParameterName: "o"
};
const parts66 = ["c", "mutation_in_out"];
const sqlIdent66 = sql.identifier(...parts66);
const fromCallback16 = (...args) => sql`${sqlIdent66}(${sqlFromArgDigests(args)})`;
const parameters16 = [{
  name: "i",
  required: true,
  notNull: false,
  codec: TYPES.int
}];
const extensions80 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "mutation_returns_table_one_col"
  },
  tags: {
    behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  },
  singleOutputParameterName: "col1"
};
const parts67 = ["c", "mutation_returns_table_one_col"];
const sqlIdent67 = sql.identifier(...parts67);
const fromCallback17 = (...args) => sql`${sqlIdent67}(${sqlFromArgDigests(args)})`;
const parameters17 = [{
  name: "i",
  required: true,
  notNull: false,
  codec: TYPES.int
}];
const extensions81 = {
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "assert_something"
  },
  tags: {
    behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts68 = ["a", "assert_something"];
const sqlIdent68 = sql.identifier(...parts68);
const fromCallback18 = (...args) => sql`${sqlIdent68}(${sqlFromArgDigests(args)})`;
const parameters18 = [{
  name: "in_arg",
  required: true,
  notNull: false,
  codec: TYPES.text
}];
const extensions82 = {
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "assert_something_nx"
  },
  tags: {
    omit: "execute",
    behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts69 = ["a", "assert_something_nx"];
const sqlIdent69 = sql.identifier(...parts69);
const fromCallback19 = (...args) => sql`${sqlIdent69}(${sqlFromArgDigests(args)})`;
const parameters19 = [{
  name: "in_arg",
  required: true,
  notNull: false,
  codec: TYPES.text
}];
const extensions83 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "json_identity"
  },
  tags: {
    behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts70 = ["c", "json_identity"];
const sqlIdent70 = sql.identifier(...parts70);
const fromCallback20 = (...args) => sql`${sqlIdent70}(${sqlFromArgDigests(args)})`;
const parameters20 = [{
  name: "json",
  required: true,
  notNull: false,
  codec: TYPES.json
}];
const extensions84 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "json_identity_mutation"
  },
  tags: {
    behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts71 = ["c", "json_identity_mutation"];
const sqlIdent71 = sql.identifier(...parts71);
const fromCallback21 = (...args) => sql`${sqlIdent71}(${sqlFromArgDigests(args)})`;
const parameters21 = [{
  name: "json",
  required: true,
  notNull: false,
  codec: TYPES.json
}];
const extensions85 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "jsonb_identity"
  },
  tags: {
    behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts72 = ["c", "jsonb_identity"];
const sqlIdent72 = sql.identifier(...parts72);
const fromCallback22 = (...args) => sql`${sqlIdent72}(${sqlFromArgDigests(args)})`;
const parameters22 = [{
  name: "json",
  required: true,
  notNull: false,
  codec: TYPES.jsonb
}];
const extensions86 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "jsonb_identity_mutation"
  },
  tags: {
    behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts73 = ["c", "jsonb_identity_mutation"];
const sqlIdent73 = sql.identifier(...parts73);
const fromCallback23 = (...args) => sql`${sqlIdent73}(${sqlFromArgDigests(args)})`;
const parameters23 = [{
  name: "json",
  required: true,
  notNull: false,
  codec: TYPES.jsonb
}];
const extensions87 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "jsonb_identity_mutation_plpgsql"
  },
  tags: {
    behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts74 = ["c", "jsonb_identity_mutation_plpgsql"];
const sqlIdent74 = sql.identifier(...parts74);
const fromCallback24 = (...args) => sql`${sqlIdent74}(${sqlFromArgDigests(args)})`;
const parameters24 = [{
  name: "_the_json",
  required: true,
  notNull: true,
  codec: TYPES.jsonb
}];
const extensions88 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "jsonb_identity_mutation_plpgsql_with_default"
  },
  tags: {
    behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts75 = ["c", "jsonb_identity_mutation_plpgsql_with_default"];
const sqlIdent75 = sql.identifier(...parts75);
const fromCallback25 = (...args) => sql`${sqlIdent75}(${sqlFromArgDigests(args)})`;
const parameters25 = [{
  name: "_the_json",
  required: false,
  notNull: true,
  codec: TYPES.jsonb
}];
const extensions89 = {
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "add_1_mutation"
  },
  tags: {
    behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts76 = ["a", "add_1_mutation"];
const sqlIdent76 = sql.identifier(...parts76);
const fromCallback26 = (...args) => sql`${sqlIdent76}(${sqlFromArgDigests(args)})`;
const parameters26 = [{
  name: null,
  required: true,
  notNull: true,
  codec: TYPES.int
}, {
  name: null,
  required: true,
  notNull: true,
  codec: TYPES.int
}];
const extensions90 = {
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "add_1_query"
  },
  tags: {
    behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts77 = ["a", "add_1_query"];
const sqlIdent77 = sql.identifier(...parts77);
const fromCallback27 = (...args) => sql`${sqlIdent77}(${sqlFromArgDigests(args)})`;
const parameters27 = [{
  name: null,
  required: true,
  notNull: true,
  codec: TYPES.int
}, {
  name: null,
  required: true,
  notNull: true,
  codec: TYPES.int
}];
const extensions91 = {
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "add_2_mutation"
  },
  tags: {
    behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts78 = ["a", "add_2_mutation"];
const sqlIdent78 = sql.identifier(...parts78);
const fromCallback28 = (...args) => sql`${sqlIdent78}(${sqlFromArgDigests(args)})`;
const parameters28 = [{
  name: "a",
  required: true,
  notNull: true,
  codec: TYPES.int
}, {
  name: "b",
  required: false,
  notNull: true,
  codec: TYPES.int
}];
const extensions92 = {
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "add_2_query"
  },
  tags: {
    behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts79 = ["a", "add_2_query"];
const sqlIdent79 = sql.identifier(...parts79);
const fromCallback29 = (...args) => sql`${sqlIdent79}(${sqlFromArgDigests(args)})`;
const parameters29 = [{
  name: "a",
  required: true,
  notNull: true,
  codec: TYPES.int
}, {
  name: "b",
  required: false,
  notNull: true,
  codec: TYPES.int
}];
const extensions93 = {
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "add_3_mutation"
  },
  tags: {
    behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts80 = ["a", "add_3_mutation"];
const sqlIdent80 = sql.identifier(...parts80);
const fromCallback30 = (...args) => sql`${sqlIdent80}(${sqlFromArgDigests(args)})`;
const parameters30 = [{
  name: "a",
  required: true,
  notNull: false,
  codec: TYPES.int
}, {
  name: "",
  required: true,
  notNull: false,
  codec: TYPES.int
}];
const extensions94 = {
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "add_3_query"
  },
  tags: {
    behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts81 = ["a", "add_3_query"];
const sqlIdent81 = sql.identifier(...parts81);
const fromCallback31 = (...args) => sql`${sqlIdent81}(${sqlFromArgDigests(args)})`;
const parameters31 = [{
  name: "a",
  required: true,
  notNull: false,
  codec: TYPES.int
}, {
  name: "",
  required: true,
  notNull: false,
  codec: TYPES.int
}];
const extensions95 = {
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "add_4_mutation"
  },
  tags: {
    behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts82 = ["a", "add_4_mutation"];
const sqlIdent82 = sql.identifier(...parts82);
const fromCallback32 = (...args) => sql`${sqlIdent82}(${sqlFromArgDigests(args)})`;
const parameters32 = [{
  name: "",
  required: true,
  notNull: false,
  codec: TYPES.int
}, {
  name: "b",
  required: false,
  notNull: false,
  codec: TYPES.int
}];
const extensions96 = {
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "add_4_mutation_error"
  },
  tags: {
    behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts83 = ["a", "add_4_mutation_error"];
const sqlIdent83 = sql.identifier(...parts83);
const fromCallback33 = (...args) => sql`${sqlIdent83}(${sqlFromArgDigests(args)})`;
const parameters33 = [{
  name: "",
  required: true,
  notNull: false,
  codec: TYPES.int
}, {
  name: "b",
  required: false,
  notNull: false,
  codec: TYPES.int
}];
const extensions97 = {
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "add_4_query"
  },
  tags: {
    behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts84 = ["a", "add_4_query"];
const sqlIdent84 = sql.identifier(...parts84);
const fromCallback34 = (...args) => sql`${sqlIdent84}(${sqlFromArgDigests(args)})`;
const parameters34 = [{
  name: "",
  required: true,
  notNull: false,
  codec: TYPES.int
}, {
  name: "b",
  required: false,
  notNull: false,
  codec: TYPES.int
}];
const extensions98 = {
  pg: {
    serviceName: "main",
    schemaName: "b",
    name: "mult_1"
  },
  tags: {
    behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts85 = ["b", "mult_1"];
const sqlIdent85 = sql.identifier(...parts85);
const fromCallback35 = (...args) => sql`${sqlIdent85}(${sqlFromArgDigests(args)})`;
const parameters35 = [{
  name: null,
  required: true,
  notNull: false,
  codec: TYPES.int
}, {
  name: null,
  required: true,
  notNull: false,
  codec: TYPES.int
}];
const extensions99 = {
  pg: {
    serviceName: "main",
    schemaName: "b",
    name: "mult_2"
  },
  tags: {
    behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts86 = ["b", "mult_2"];
const sqlIdent86 = sql.identifier(...parts86);
const fromCallback36 = (...args) => sql`${sqlIdent86}(${sqlFromArgDigests(args)})`;
const parameters36 = [{
  name: null,
  required: true,
  notNull: false,
  codec: TYPES.int
}, {
  name: null,
  required: true,
  notNull: false,
  codec: TYPES.int
}];
const extensions100 = {
  pg: {
    serviceName: "main",
    schemaName: "b",
    name: "mult_3"
  },
  tags: {
    behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts87 = ["b", "mult_3"];
const sqlIdent87 = sql.identifier(...parts87);
const fromCallback37 = (...args) => sql`${sqlIdent87}(${sqlFromArgDigests(args)})`;
const parameters37 = [{
  name: null,
  required: true,
  notNull: true,
  codec: TYPES.int
}, {
  name: null,
  required: true,
  notNull: true,
  codec: TYPES.int
}];
const extensions101 = {
  pg: {
    serviceName: "main",
    schemaName: "b",
    name: "mult_4"
  },
  tags: {
    behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts88 = ["b", "mult_4"];
const sqlIdent88 = sql.identifier(...parts88);
const fromCallback38 = (...args) => sql`${sqlIdent88}(${sqlFromArgDigests(args)})`;
const parameters38 = [{
  name: null,
  required: true,
  notNull: true,
  codec: TYPES.int
}, {
  name: null,
  required: true,
  notNull: true,
  codec: TYPES.int
}];
const extensions102 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "func_in_inout"
  },
  tags: {
    behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  },
  singleOutputParameterName: "ino"
};
const parts89 = ["c", "func_in_inout"];
const sqlIdent89 = sql.identifier(...parts89);
const fromCallback39 = (...args) => sql`${sqlIdent89}(${sqlFromArgDigests(args)})`;
const parameters39 = [{
  name: "i",
  required: true,
  notNull: false,
  codec: TYPES.int
}, {
  name: "ino",
  required: true,
  notNull: false,
  codec: TYPES.int
}];
const extensions103 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "func_out_out"
  },
  tags: {
    behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts90 = ["c", "func_out_out"];
const sqlIdent90 = sql.identifier(...parts90);
const fromCallback40 = (...args) => sql`${sqlIdent90}(${sqlFromArgDigests(args)})`;
const parameters40 = [];
const extensions104 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "func_out_out_setof"
  },
  tags: {
    behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts91 = ["c", "func_out_out_setof"];
const sqlIdent91 = sql.identifier(...parts91);
const fromCallback41 = (...args) => sql`${sqlIdent91}(${sqlFromArgDigests(args)})`;
const parameters41 = [];
const extensions105 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "func_out_out_unnamed"
  },
  tags: {
    behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts92 = ["c", "func_out_out_unnamed"];
const sqlIdent92 = sql.identifier(...parts92);
const fromCallback42 = (...args) => sql`${sqlIdent92}(${sqlFromArgDigests(args)})`;
const parameters42 = [];
const extensions106 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "mutation_in_inout"
  },
  tags: {
    behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  },
  singleOutputParameterName: "ino"
};
const parts93 = ["c", "mutation_in_inout"];
const sqlIdent93 = sql.identifier(...parts93);
const fromCallback43 = (...args) => sql`${sqlIdent93}(${sqlFromArgDigests(args)})`;
const parameters43 = [{
  name: "i",
  required: true,
  notNull: false,
  codec: TYPES.int
}, {
  name: "ino",
  required: true,
  notNull: false,
  codec: TYPES.int
}];
const extensions107 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "mutation_out_out"
  },
  tags: {
    behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts94 = ["c", "mutation_out_out"];
const sqlIdent94 = sql.identifier(...parts94);
const fromCallback44 = (...args) => sql`${sqlIdent94}(${sqlFromArgDigests(args)})`;
const parameters44 = [];
const extensions108 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "mutation_out_out_setof"
  },
  tags: {
    behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts95 = ["c", "mutation_out_out_setof"];
const sqlIdent95 = sql.identifier(...parts95);
const fromCallback45 = (...args) => sql`${sqlIdent95}(${sqlFromArgDigests(args)})`;
const parameters45 = [];
const extensions109 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "mutation_out_out_unnamed"
  },
  tags: {
    behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts96 = ["c", "mutation_out_out_unnamed"];
const sqlIdent96 = sql.identifier(...parts96);
const fromCallback46 = (...args) => sql`${sqlIdent96}(${sqlFromArgDigests(args)})`;
const parameters46 = [];
const extensions110 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "search_test_summaries"
  },
  tags: {
    simpleCollections: "only",
    behavior: ["queryField -mutationField -typeField", "-filter -order", "+list -connection", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts97 = ["c", "search_test_summaries"];
const sqlIdent97 = sql.identifier(...parts97);
const fromCallback47 = (...args) => sql`${sqlIdent97}(${sqlFromArgDigests(args)})`;
const parameters47 = [];
const extensions111 = {
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "optional_missing_middle_1"
  },
  tags: {
    behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts98 = ["a", "optional_missing_middle_1"];
const sqlIdent98 = sql.identifier(...parts98);
const fromCallback48 = (...args) => sql`${sqlIdent98}(${sqlFromArgDigests(args)})`;
const parameters48 = [{
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
}];
const extensions112 = {
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "optional_missing_middle_2"
  },
  tags: {
    behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts99 = ["a", "optional_missing_middle_2"];
const sqlIdent99 = sql.identifier(...parts99);
const fromCallback49 = (...args) => sql`${sqlIdent99}(${sqlFromArgDigests(args)})`;
const parameters49 = [{
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
}];
const extensions113 = {
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "optional_missing_middle_3"
  },
  tags: {
    behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts100 = ["a", "optional_missing_middle_3"];
const sqlIdent100 = sql.identifier(...parts100);
const fromCallback50 = (...args) => sql`${sqlIdent100}(${sqlFromArgDigests(args)})`;
const parameters50 = [{
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
}];
const extensions114 = {
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "optional_missing_middle_4"
  },
  tags: {
    behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts101 = ["a", "optional_missing_middle_4"];
const sqlIdent101 = sql.identifier(...parts101);
const fromCallback51 = (...args) => sql`${sqlIdent101}(${sqlFromArgDigests(args)})`;
const parameters51 = [{
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
}];
const extensions115 = {
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "optional_missing_middle_5"
  },
  tags: {
    behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts102 = ["a", "optional_missing_middle_5"];
const sqlIdent102 = sql.identifier(...parts102);
const fromCallback52 = (...args) => sql`${sqlIdent102}(${sqlFromArgDigests(args)})`;
const parameters52 = [{
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
}];
const extensions116 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "func_out_unnamed_out_out_unnamed"
  },
  tags: {
    behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts103 = ["c", "func_out_unnamed_out_out_unnamed"];
const sqlIdent103 = sql.identifier(...parts103);
const fromCallback53 = (...args) => sql`${sqlIdent103}(${sqlFromArgDigests(args)})`;
const parameters53 = [];
const extensions117 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "func_returns_table_multi_col"
  },
  tags: {
    behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts104 = ["c", "func_returns_table_multi_col"];
const sqlIdent104 = sql.identifier(...parts104);
const fromCallback54 = (...args) => sql`${sqlIdent104}(${sqlFromArgDigests(args)})`;
const parameters54 = [{
  name: "i",
  required: true,
  notNull: false,
  codec: TYPES.int
}];
const extensions118 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "int_set_mutation"
  },
  tags: {
    behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts105 = ["c", "int_set_mutation"];
const sqlIdent105 = sql.identifier(...parts105);
const fromCallback55 = (...args) => sql`${sqlIdent105}(${sqlFromArgDigests(args)})`;
const parameters55 = [{
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
}];
const extensions119 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "int_set_query"
  },
  tags: {
    behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts106 = ["c", "int_set_query"];
const sqlIdent106 = sql.identifier(...parts106);
const fromCallback56 = (...args) => sql`${sqlIdent106}(${sqlFromArgDigests(args)})`;
const parameters56 = [{
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
}];
const extensions120 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "mutation_out_unnamed_out_out_unnamed"
  },
  tags: {
    behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts107 = ["c", "mutation_out_unnamed_out_out_unnamed"];
const sqlIdent107 = sql.identifier(...parts107);
const fromCallback57 = (...args) => sql`${sqlIdent107}(${sqlFromArgDigests(args)})`;
const parameters57 = [];
const extensions121 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "mutation_returns_table_multi_col"
  },
  tags: {
    behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts108 = ["c", "mutation_returns_table_multi_col"];
const sqlIdent108 = sql.identifier(...parts108);
const fromCallback58 = (...args) => sql`${sqlIdent108}(${sqlFromArgDigests(args)})`;
const parameters58 = [{
  name: "i",
  required: true,
  notNull: false,
  codec: TYPES.int
}];
const extensions122 = {
  pg: {
    serviceName: "main",
    schemaName: "b",
    name: "guid_fn"
  },
  tags: {
    behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts109 = ["b", "guid_fn"];
const sqlIdent109 = sql.identifier(...parts109);
const fromCallback59 = (...args) => sql`${sqlIdent109}(${sqlFromArgDigests(args)})`;
const parameters59 = [{
  name: "g",
  required: true,
  notNull: false,
  codec: registryConfig_pgCodecs_guid_guid
}];
const extensions123 = {
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "mutation_interval_array"
  },
  tags: {
    behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts110 = ["a", "mutation_interval_array"];
const sqlIdent110 = sql.identifier(...parts110);
const fromCallback60 = (...args) => sql`${sqlIdent110}(${sqlFromArgDigests(args)})`;
const parameters60 = [];
const extensions124 = {
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "query_interval_array"
  },
  tags: {
    behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts111 = ["a", "query_interval_array"];
const sqlIdent111 = sql.identifier(...parts111);
const fromCallback61 = (...args) => sql`${sqlIdent111}(${sqlFromArgDigests(args)})`;
const parameters61 = [];
const extensions125 = {
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "mutation_text_array"
  },
  tags: {
    behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts112 = ["a", "mutation_text_array"];
const sqlIdent112 = sql.identifier(...parts112);
const fromCallback62 = (...args) => sql`${sqlIdent112}(${sqlFromArgDigests(args)})`;
const parameters62 = [];
const extensions126 = {
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "query_text_array"
  },
  tags: {
    behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts113 = ["a", "query_text_array"];
const sqlIdent113 = sql.identifier(...parts113);
const fromCallback63 = (...args) => sql`${sqlIdent113}(${sqlFromArgDigests(args)})`;
const parameters63 = [];
const extensions127 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "non_updatable_view"
  },
  tags: {
    behavior: ["-insert", "-update", "-delete", "-select -single -list -connection -insert -update -delete"]
  }
};
const extensions128 = {
  description: "Should output as Input",
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "inputs"
  },
  tags: {
    behavior: ["-select -single -list -connection -insert -update -delete"]
  }
};
const uniques2 = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const extensions129 = {
  description: "Should output as Patch",
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "patchs"
  },
  tags: {
    behavior: ["-select -single -list -connection -insert -update -delete"]
  }
};
const uniques3 = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const extensions130 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "reserved"
  },
  tags: {
    behavior: ["-select -single -list -connection -insert -update -delete"]
  }
};
const uniques4 = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const extensions131 = {
  description: "`reservedPatchs` table should get renamed to ReservedPatchRecord to prevent clashes with ReservedPatch from `reserved` table",
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "reservedPatchs"
  },
  tags: {
    behavior: ["-select -single -list -connection -insert -update -delete"]
  }
};
const uniques5 = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const extensions132 = {
  description: "`reserved_input` table should get renamed to ReservedInputRecord to prevent clashes with ReservedInput from `reserved` table",
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "reserved_input"
  },
  tags: {
    behavior: ["-select -single -list -connection -insert -update -delete"]
  }
};
const uniques6 = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const extensions133 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "default_value"
  },
  tags: {
    behavior: ["-select -single -list -connection -insert -update -delete"]
  }
};
const uniques7 = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const extensions134 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "no_primary_key"
  },
  tags: {
    behavior: ["-select -single -list -connection -insert -update -delete"]
  }
};
const uniques8 = [{
  isPrimary: false,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const extensions135 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "unique_foreign_key"
  },
  tags: {
    omit: "create,update,delete,all,order,filter",
    behavior: ["-insert -update -delete -query:resource:list -query:resource:connection -order -orderBy -filter -filterBy", "-select -single -list -connection -insert -update -delete"]
  }
};
const uniques9 = [{
  isPrimary: false,
  attributes: ["compound_key_1", "compound_key_2"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_unique_foreign_key_unique_foreign_key = {
  executor: executor_mainPgExecutor,
  name: "unique_foreign_key",
  identifier: "main.a.unique_foreign_key",
  from: registryConfig_pgCodecs_uniqueForeignKey_uniqueForeignKey.sqlType,
  codec: registryConfig_pgCodecs_uniqueForeignKey_uniqueForeignKey,
  uniques: uniques9,
  isVirtual: false,
  description: undefined,
  extensions: extensions135
};
const extensions136 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "my_table"
  },
  tags: {
    behavior: ["-select -single -list -connection -insert -update -delete"]
  }
};
const uniques10 = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const extensions137 = {
  description: "Tracks the person's secret",
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "person_secret"
  },
  tags: {
    deprecated: "This is deprecated (comment on table c.person_secret).",
    behavior: ["-update"]
  }
};
const uniques11 = [{
  isPrimary: true,
  attributes: ["person_id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_person_secret_person_secret = {
  executor: executor_mainPgExecutor,
  name: "person_secret",
  identifier: "main.c.person_secret",
  from: registryConfig_pgCodecs_personSecret_personSecret.sqlType,
  codec: registryConfig_pgCodecs_personSecret_personSecret,
  uniques: uniques11,
  isVirtual: false,
  description: "Tracks the person's secret",
  extensions: extensions137
};
const extensions138 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "foreign_key"
  },
  tags: {
    behavior: ["-select -single -list -connection -insert -update -delete"]
  }
};
const uniques12 = [];
const registryConfig_pgResources_foreign_key_foreign_key = {
  executor: executor_mainPgExecutor,
  name: "foreign_key",
  identifier: "main.a.foreign_key",
  from: registryConfig_pgCodecs_foreignKey_foreignKey.sqlType,
  codec: registryConfig_pgCodecs_foreignKey_foreignKey,
  uniques: uniques12,
  isVirtual: false,
  description: undefined,
  extensions: extensions138
};
const extensions139 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "testview"
  },
  tags: {
    behavior: ["-select -single -list -connection -insert -update -delete"]
  }
};
const uniques13 = [];
const extensions140 = {
  pg: {
    serviceName: "main",
    schemaName: "b",
    name: "list_bde_mutation"
  },
  tags: {
    behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts114 = ["b", "list_bde_mutation"];
const sqlIdent114 = sql.identifier(...parts114);
const fromCallback64 = (...args) => sql`${sqlIdent114}(${sqlFromArgDigests(args)})`;
const parameters64 = [{
  name: "b",
  required: true,
  notNull: false,
  codec: registryConfig_pgCodecs_textArray_textArray
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
}];
const extensions141 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "view_table"
  },
  tags: {
    behavior: ["-select -single -list -connection -insert -update -delete"]
  }
};
const uniques14 = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const extensions142 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "compound_key"
  },
  tags: {
    behavior: ["-select -single -list -connection -insert -update -delete"]
  }
};
const uniques15 = [{
  isPrimary: true,
  attributes: ["person_id_1", "person_id_2"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_compound_key_compound_key = {
  executor: executor_mainPgExecutor,
  name: "compound_key",
  identifier: "main.c.compound_key",
  from: registryConfig_pgCodecs_compoundKey_compoundKey.sqlType,
  codec: registryConfig_pgCodecs_compoundKey_compoundKey,
  uniques: uniques15,
  isVirtual: false,
  description: undefined,
  extensions: extensions142
};
const extensions143 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "similar_table_1"
  },
  tags: {
    behavior: ["-select -single -list -connection -insert -update -delete"]
  }
};
const uniques16 = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const extensions144 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "similar_table_2"
  },
  tags: {
    behavior: ["-select -single -list -connection -insert -update -delete"]
  }
};
const uniques17 = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const extensions145 = {
  description: "YOYOYO!!",
  pg: {
    serviceName: "main",
    schemaName: "b",
    name: "updatable_view"
  },
  tags: {
    uniqueKey: "x",
    unique: "x|@behavior -single -update -delete",
    behavior: ["-select -single -list -connection -insert -update -delete"]
  }
};
const uniques18 = [{
  isPrimary: false,
  attributes: ["x"],
  description: undefined,
  extensions: {
    tags: Object.assign(Object.create(null), {
      behavior: "-single -update -delete"
    })
  }
}];
const extensions146 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "null_test_record"
  },
  tags: {
    behavior: ["-select -single -list -connection -insert -update -delete"]
  }
};
const uniques19 = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const extensions147 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "edge_case_computed"
  },
  tags: {
    behavior: ["-queryField -mutationField typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts115 = ["c", "edge_case_computed"];
const sqlIdent115 = sql.identifier(...parts115);
const fromCallback65 = (...args) => sql`${sqlIdent115}(${sqlFromArgDigests(args)})`;
const parameters65 = [{
  name: "edge_case",
  required: true,
  notNull: false,
  codec: registryConfig_pgCodecs_edgeCase_edgeCase
}];
const parts116 = ["c", "return_table_without_grants"];
const sqlIdent116 = sql.identifier(...parts116);
const options_return_table_without_grants = {
  name: "return_table_without_grants",
  identifier: "main.c.return_table_without_grants()",
  from(...args) {
    return sql`${sqlIdent116}(${sqlFromArgDigests(args)})`;
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
};
const extensions148 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "issue756"
  },
  tags: {
    behavior: ["-select -single -list -connection -insert -update -delete"]
  }
};
const uniques20 = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_issue756_issue756 = {
  executor: executor_mainPgExecutor,
  name: "issue756",
  identifier: "main.c.issue756",
  from: registryConfig_pgCodecs_issue756_issue756.sqlType,
  codec: registryConfig_pgCodecs_issue756_issue756,
  uniques: uniques20,
  isVirtual: false,
  description: undefined,
  extensions: extensions148
};
const extensions149 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "edge_case"
  },
  tags: {
    behavior: ["-select -single -list -connection -insert -update -delete"]
  }
};
const uniques21 = [];
const parts117 = ["b", "authenticate_fail"];
const sqlIdent117 = sql.identifier(...parts117);
const options_authenticate_fail = {
  name: "authenticate_fail",
  identifier: "main.b.authenticate_fail()",
  from(...args) {
    return sql`${sqlIdent117}(${sqlFromArgDigests(args)})`;
  },
  parameters: [],
  returnsArray: false,
  returnsSetof: false,
  isMutation: true,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "authenticate_fail"
    },
    tags: {
      behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
    }
  },
  description: undefined
};
const extensions150 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "b",
    name: "jwt_token"
  },
  tags: {
    behavior: ["-insert", "-update", "-delete"]
  }
};
const uniques22 = [];
const resourceConfig_jwt_token = {
  executor: executor_mainPgExecutor,
  name: "jwt_token",
  identifier: "main.b.jwt_token",
  from: registryConfig_pgCodecs_jwtToken_jwtToken.sqlType,
  codec: registryConfig_pgCodecs_jwtToken_jwtToken,
  uniques: uniques22,
  isVirtual: true,
  description: undefined,
  extensions: extensions150
};
const parts118 = ["b", "authenticate"];
const sqlIdent118 = sql.identifier(...parts118);
const options_authenticate = {
  name: "authenticate",
  identifier: "main.b.authenticate(int4,numeric,int8)",
  from(...args) {
    return sql`${sqlIdent118}(${sqlFromArgDigests(args)})`;
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
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "authenticate"
    },
    tags: {
      behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
    }
  },
  description: undefined
};
const parts119 = ["c", "issue756_mutation"];
const sqlIdent119 = sql.identifier(...parts119);
const options_issue756_mutation = {
  name: "issue756_mutation",
  identifier: "main.c.issue756_mutation()",
  from(...args) {
    return sql`${sqlIdent119}(${sqlFromArgDigests(args)})`;
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
      behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
    }
  },
  description: undefined
};
const parts120 = ["c", "issue756_set_mutation"];
const sqlIdent120 = sql.identifier(...parts120);
const options_issue756_set_mutation = {
  name: "issue756_set_mutation",
  identifier: "main.c.issue756_set_mutation()",
  from(...args) {
    return sql`${sqlIdent120}(${sqlFromArgDigests(args)})`;
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
      behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
    }
  },
  description: undefined
};
const extensions151 = {
  description: "Tracks metadata about the left arms of various people",
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "left_arm"
  },
  tags: {}
};
const uniques23 = [{
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
  executor: executor_mainPgExecutor,
  name: "left_arm",
  identifier: "main.c.left_arm",
  from: registryConfig_pgCodecs_leftArm_leftArm.sqlType,
  codec: registryConfig_pgCodecs_leftArm_leftArm,
  uniques: uniques23,
  isVirtual: false,
  description: "Tracks metadata about the left arms of various people",
  extensions: extensions151
};
const parts121 = ["b", "authenticate_many"];
const sqlIdent121 = sql.identifier(...parts121);
const options_authenticate_many = {
  name: "authenticate_many",
  identifier: "main.b.authenticate_many(int4,numeric,int8)",
  from(...args) {
    return sql`${sqlIdent121}(${sqlFromArgDigests(args)})`;
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
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "authenticate_many"
    },
    tags: {
      behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
    }
  },
  description: undefined
};
const extensions152 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "types_mutation"
  },
  tags: {
    behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts122 = ["c", "types_mutation"];
const sqlIdent122 = sql.identifier(...parts122);
const fromCallback66 = (...args) => sql`${sqlIdent122}(${sqlFromArgDigests(args)})`;
const parameters66 = [{
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
  codec: registryConfig_pgCodecs_int4Array_int4Array
}, {
  name: "e",
  required: true,
  notNull: true,
  codec: TYPES.json
}, {
  name: "f",
  required: true,
  notNull: true,
  codec: registryConfig_pgCodecs_floatrange_floatrange
}];
const extensions153 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "types_query"
  },
  tags: {
    behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts123 = ["c", "types_query"];
const sqlIdent123 = sql.identifier(...parts123);
const fromCallback67 = (...args) => sql`${sqlIdent123}(${sqlFromArgDigests(args)})`;
const parameters67 = [{
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
  codec: registryConfig_pgCodecs_int4Array_int4Array
}, {
  name: "e",
  required: true,
  notNull: true,
  codec: TYPES.json
}, {
  name: "f",
  required: true,
  notNull: true,
  codec: registryConfig_pgCodecs_floatrange_floatrange
}];
const parts124 = ["c", "left_arm_identity"];
const sqlIdent124 = sql.identifier(...parts124);
const options_left_arm_identity = {
  name: "left_arm_identity",
  identifier: "main.c.left_arm_identity(c.left_arm)",
  from(...args) {
    return sql`${sqlIdent124}(${sqlFromArgDigests(args)})`;
  },
  parameters: [{
    name: "left_arm",
    required: true,
    notNull: false,
    codec: registryConfig_pgCodecs_leftArm_leftArm,
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
};
const parts125 = ["b", "authenticate_payload"];
const sqlIdent125 = sql.identifier(...parts125);
const options_authenticate_payload = {
  name: "authenticate_payload",
  identifier: "main.b.authenticate_payload(int4,numeric,int8)",
  from(...args) {
    return sql`${sqlIdent125}(${sqlFromArgDigests(args)})`;
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
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "authenticate_payload"
    },
    tags: {
      behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
    }
  },
  description: undefined
};
const extensions154 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "b",
    name: "auth_payload"
  },
  tags: {
    foreignKey: "(id) references c.person",
    behavior: ["-insert", "-update", "-delete"]
  }
};
const uniques24 = [];
const resourceConfig_auth_payload = {
  executor: executor_mainPgExecutor,
  name: "auth_payload",
  identifier: "main.b.auth_payload",
  from: registryConfig_pgCodecs_authPayload_authPayload.sqlType,
  codec: registryConfig_pgCodecs_authPayload_authPayload,
  uniques: uniques24,
  isVirtual: true,
  description: undefined,
  extensions: extensions154
};
const extensions155 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "compound_type_computed_field"
  },
  tags: {
    behavior: ["-queryField -mutationField typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts126 = ["c", "compound_type_computed_field"];
const sqlIdent126 = sql.identifier(...parts126);
const fromCallback68 = (...args) => sql`${sqlIdent126}(${sqlFromArgDigests(args)})`;
const parameters68 = [{
  name: "compound_type",
  required: true,
  notNull: false,
  codec: attributes_o2_codec_compoundType
}];
const extensions156 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "func_out_out_compound_type"
  },
  tags: {
    behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts127 = ["c", "func_out_out_compound_type"];
const sqlIdent127 = sql.identifier(...parts127);
const fromCallback69 = (...args) => sql`${sqlIdent127}(${sqlFromArgDigests(args)})`;
const parameters69 = [{
  name: "i1",
  required: true,
  notNull: false,
  codec: TYPES.int
}];
const extensions157 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "mutation_out_out_compound_type"
  },
  tags: {
    behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts128 = ["c", "mutation_out_out_compound_type"];
const sqlIdent128 = sql.identifier(...parts128);
const fromCallback70 = (...args) => sql`${sqlIdent128}(${sqlFromArgDigests(args)})`;
const parameters70 = [{
  name: "i1",
  required: true,
  notNull: false,
  codec: TYPES.int
}];
const parts129 = ["c", "compound_type_set_query"];
const sqlIdent129 = sql.identifier(...parts129);
const options_compound_type_set_query = {
  name: "compound_type_set_query",
  identifier: "main.c.compound_type_set_query()",
  from(...args) {
    return sql`${sqlIdent129}(${sqlFromArgDigests(args)})`;
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
      behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
    }
  },
  description: undefined
};
const extensions158 = {
  description: "Awesome feature!",
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "compound_type"
  },
  tags: {
    behavior: ["-insert", "-update", "-delete"]
  }
};
const uniques25 = [];
const resourceConfig_compound_type = {
  executor: executor_mainPgExecutor,
  name: "compound_type",
  identifier: "main.c.compound_type",
  from: attributes_o2_codec_compoundType.sqlType,
  codec: attributes_o2_codec_compoundType,
  uniques: uniques25,
  isVirtual: true,
  description: "Awesome feature!",
  extensions: extensions158
};
const parts130 = ["b", "compound_type_mutation"];
const sqlIdent130 = sql.identifier(...parts130);
const options_compound_type_mutation = {
  name: "compound_type_mutation",
  identifier: "main.b.compound_type_mutation(c.compound_type)",
  from(...args) {
    return sql`${sqlIdent130}(${sqlFromArgDigests(args)})`;
  },
  parameters: [{
    name: "object",
    required: true,
    notNull: false,
    codec: attributes_o2_codec_compoundType
  }],
  returnsArray: false,
  returnsSetof: false,
  isMutation: true,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "compound_type_mutation"
    },
    tags: {
      behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
    }
  },
  description: undefined
};
const parts131 = ["b", "compound_type_query"];
const sqlIdent131 = sql.identifier(...parts131);
const options_compound_type_query = {
  name: "compound_type_query",
  identifier: "main.b.compound_type_query(c.compound_type)",
  from(...args) {
    return sql`${sqlIdent131}(${sqlFromArgDigests(args)})`;
  },
  parameters: [{
    name: "object",
    required: true,
    notNull: false,
    codec: attributes_o2_codec_compoundType
  }],
  returnsArray: false,
  returnsSetof: false,
  isMutation: false,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "compound_type_query"
    },
    tags: {
      behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
    }
  },
  description: undefined
};
const parts132 = ["b", "compound_type_set_mutation"];
const sqlIdent132 = sql.identifier(...parts132);
const options_compound_type_set_mutation = {
  name: "compound_type_set_mutation",
  identifier: "main.b.compound_type_set_mutation(c.compound_type)",
  from(...args) {
    return sql`${sqlIdent132}(${sqlFromArgDigests(args)})`;
  },
  parameters: [{
    name: "object",
    required: true,
    notNull: false,
    codec: attributes_o2_codec_compoundType
  }],
  returnsArray: false,
  returnsSetof: true,
  isMutation: true,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "compound_type_set_mutation"
    },
    tags: {
      behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
    }
  },
  description: undefined
};
const parts133 = ["a", "mutation_compound_type_array"];
const sqlIdent133 = sql.identifier(...parts133);
const options_mutation_compound_type_array = {
  name: "mutation_compound_type_array",
  identifier: "main.a.mutation_compound_type_array(c.compound_type)",
  from(...args) {
    return sql`${sqlIdent133}(${sqlFromArgDigests(args)})`;
  },
  parameters: [{
    name: "object",
    required: true,
    notNull: false,
    codec: attributes_o2_codec_compoundType
  }],
  returnsArray: true,
  returnsSetof: false,
  isMutation: true,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "mutation_compound_type_array"
    },
    tags: {
      behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
    }
  },
  description: undefined
};
const parts134 = ["a", "query_compound_type_array"];
const sqlIdent134 = sql.identifier(...parts134);
const options_query_compound_type_array = {
  name: "query_compound_type_array",
  identifier: "main.a.query_compound_type_array(c.compound_type)",
  from(...args) {
    return sql`${sqlIdent134}(${sqlFromArgDigests(args)})`;
  },
  parameters: [{
    name: "object",
    required: true,
    notNull: false,
    codec: attributes_o2_codec_compoundType
  }],
  returnsArray: true,
  returnsSetof: false,
  isMutation: false,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "query_compound_type_array"
    },
    tags: {
      behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
    }
  },
  description: undefined
};
const parts135 = ["b", "compound_type_array_mutation"];
const sqlIdent135 = sql.identifier(...parts135);
const options_compound_type_array_mutation = {
  name: "compound_type_array_mutation",
  identifier: "main.b.compound_type_array_mutation(c.compound_type)",
  from(...args) {
    return sql`${sqlIdent135}(${sqlFromArgDigests(args)})`;
  },
  parameters: [{
    name: "object",
    required: true,
    notNull: false,
    codec: attributes_o2_codec_compoundType
  }],
  returnsArray: true,
  returnsSetof: false,
  isMutation: true,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "compound_type_array_mutation"
    },
    tags: {
      behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
    }
  },
  description: undefined
};
const parts136 = ["b", "compound_type_array_query"];
const sqlIdent136 = sql.identifier(...parts136);
const options_compound_type_array_query = {
  name: "compound_type_array_query",
  identifier: "main.b.compound_type_array_query(c.compound_type)",
  from(...args) {
    return sql`${sqlIdent136}(${sqlFromArgDigests(args)})`;
  },
  parameters: [{
    name: "object",
    required: true,
    notNull: false,
    codec: attributes_o2_codec_compoundType
  }],
  returnsArray: true,
  returnsSetof: false,
  isMutation: false,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "compound_type_array_query"
    },
    tags: {
      behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
    }
  },
  description: undefined
};
const extensions159 = {
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "post_computed_interval_set"
  },
  tags: {
    behavior: ["-queryField -mutationField typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts137 = ["a", "post_computed_interval_set"];
const sqlIdent137 = sql.identifier(...parts137);
const fromCallback71 = (...args) => sql`${sqlIdent137}(${sqlFromArgDigests(args)})`;
const parameters71 = [{
  name: "post",
  required: true,
  notNull: false,
  codec: attributes_post_codec_post
}];
const extensions160 = {
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "post_computed_interval_array"
  },
  tags: {
    behavior: ["-queryField -mutationField typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts138 = ["a", "post_computed_interval_array"];
const sqlIdent138 = sql.identifier(...parts138);
const fromCallback72 = (...args) => sql`${sqlIdent138}(${sqlFromArgDigests(args)})`;
const parameters72 = [{
  name: "post",
  required: true,
  notNull: false,
  codec: attributes_post_codec_post
}];
const extensions161 = {
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "post_computed_text_array"
  },
  tags: {
    behavior: ["-queryField -mutationField typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts139 = ["a", "post_computed_text_array"];
const sqlIdent139 = sql.identifier(...parts139);
const fromCallback73 = (...args) => sql`${sqlIdent139}(${sqlFromArgDigests(args)})`;
const parameters73 = [{
  name: "post",
  required: true,
  notNull: false,
  codec: attributes_post_codec_post
}];
const extensions162 = {
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "post_computed_with_optional_arg"
  },
  tags: {
    sortable: true,
    filterable: true,
    behavior: ["-queryField -mutationField typeField", "-filter -order", "filter filterBy", "orderBy order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts140 = ["a", "post_computed_with_optional_arg"];
const sqlIdent140 = sql.identifier(...parts140);
const fromCallback74 = (...args) => sql`${sqlIdent140}(${sqlFromArgDigests(args)})`;
const parameters74 = [{
  name: "post",
  required: true,
  notNull: true,
  codec: attributes_post_codec_post
}, {
  name: "i",
  required: false,
  notNull: true,
  codec: TYPES.int
}];
const extensions163 = {
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "post_computed_with_required_arg"
  },
  tags: {
    sortable: true,
    filterable: true,
    behavior: ["-queryField -mutationField typeField", "-filter -order", "filter filterBy", "orderBy order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts141 = ["a", "post_computed_with_required_arg"];
const sqlIdent141 = sql.identifier(...parts141);
const fromCallback75 = (...args) => sql`${sqlIdent141}(${sqlFromArgDigests(args)})`;
const parameters75 = [{
  name: "post",
  required: true,
  notNull: true,
  codec: attributes_post_codec_post
}, {
  name: "i",
  required: true,
  notNull: true,
  codec: TYPES.int
}];
const extensions164 = {
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "post_headline_trimmed"
  },
  tags: {
    behavior: ["-queryField -mutationField typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts142 = ["a", "post_headline_trimmed"];
const sqlIdent142 = sql.identifier(...parts142);
const fromCallback76 = (...args) => sql`${sqlIdent142}(${sqlFromArgDigests(args)})`;
const parameters76 = [{
  name: "post",
  required: true,
  notNull: false,
  codec: attributes_post_codec_post
}, {
  name: "length",
  required: false,
  notNull: false,
  codec: TYPES.int
}, {
  name: "omission",
  required: false,
  notNull: false,
  codec: TYPES.text
}];
const extensions165 = {
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "post_headline_trimmed_no_defaults"
  },
  tags: {
    behavior: ["-queryField -mutationField typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts143 = ["a", "post_headline_trimmed_no_defaults"];
const sqlIdent143 = sql.identifier(...parts143);
const fromCallback77 = (...args) => sql`${sqlIdent143}(${sqlFromArgDigests(args)})`;
const parameters77 = [{
  name: "post",
  required: true,
  notNull: false,
  codec: attributes_post_codec_post
}, {
  name: "length",
  required: true,
  notNull: false,
  codec: TYPES.int
}, {
  name: "omission",
  required: true,
  notNull: false,
  codec: TYPES.text
}];
const extensions166 = {
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "post_headline_trimmed_strict"
  },
  tags: {
    behavior: ["-queryField -mutationField typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts144 = ["a", "post_headline_trimmed_strict"];
const sqlIdent144 = sql.identifier(...parts144);
const fromCallback78 = (...args) => sql`${sqlIdent144}(${sqlFromArgDigests(args)})`;
const parameters78 = [{
  name: "post",
  required: true,
  notNull: true,
  codec: attributes_post_codec_post
}, {
  name: "length",
  required: false,
  notNull: true,
  codec: TYPES.int
}, {
  name: "omission",
  required: false,
  notNull: true,
  codec: TYPES.text
}];
const extensions167 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "query_output_two_rows"
  },
  tags: {
    behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts145 = ["c", "query_output_two_rows"];
const sqlIdent145 = sql.identifier(...parts145);
const fromCallback79 = (...args) => sql`${sqlIdent145}(${sqlFromArgDigests(args)})`;
const parameters79 = [{
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
}];
const extensions168 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "a",
    name: "post"
  },
  tags: {
    behavior: ["-insert -update -delete"]
  }
};
const uniques26 = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_post_post = {
  executor: executor_mainPgExecutor,
  name: "post",
  identifier: "main.a.post",
  from: attributes_post_codec_post.sqlType,
  codec: attributes_post_codec_post,
  uniques: uniques26,
  isVirtual: false,
  description: undefined,
  extensions: extensions168
};
const parts146 = ["a", "post_computed_compound_type_array"];
const sqlIdent146 = sql.identifier(...parts146);
const options_post_computed_compound_type_array = {
  name: "post_computed_compound_type_array",
  identifier: "main.a.post_computed_compound_type_array(a.post,c.compound_type)",
  from(...args) {
    return sql`${sqlIdent146}(${sqlFromArgDigests(args)})`;
  },
  parameters: [{
    name: "post",
    required: true,
    notNull: false,
    codec: attributes_post_codec_post
  }, {
    name: "object",
    required: true,
    notNull: false,
    codec: attributes_o2_codec_compoundType
  }],
  returnsArray: true,
  returnsSetof: false,
  isMutation: false,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "post_computed_compound_type_array"
    },
    tags: {
      behavior: ["-queryField -mutationField typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
    }
  },
  description: undefined
};
const parts147 = ["c", "table_mutation"];
const sqlIdent147 = sql.identifier(...parts147);
const options_table_mutation = {
  name: "table_mutation",
  identifier: "main.c.table_mutation(int4)",
  from(...args) {
    return sql`${sqlIdent147}(${sqlFromArgDigests(args)})`;
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
      behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
    }
  },
  description: undefined
};
const parts148 = ["c", "table_query"];
const sqlIdent148 = sql.identifier(...parts148);
const options_table_query = {
  name: "table_query",
  identifier: "main.c.table_query(int4)",
  from(...args) {
    return sql`${sqlIdent148}(${sqlFromArgDigests(args)})`;
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
      behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
    }
  },
  description: undefined
};
const parts149 = ["a", "post_with_suffix"];
const sqlIdent149 = sql.identifier(...parts149);
const options_post_with_suffix = {
  name: "post_with_suffix",
  identifier: "main.a.post_with_suffix(a.post,text)",
  from(...args) {
    return sql`${sqlIdent149}(${sqlFromArgDigests(args)})`;
  },
  parameters: [{
    name: "post",
    required: true,
    notNull: false,
    codec: attributes_post_codec_post
  }, {
    name: "suffix",
    required: true,
    notNull: false,
    codec: TYPES.text
  }],
  returnsArray: false,
  returnsSetof: false,
  isMutation: true,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "post_with_suffix"
    },
    tags: {
      deprecated: "This is deprecated (comment on function a.post_with_suffix).",
      behavior: ["-queryField mutationField -typeField", "-filter -order"]
    }
  },
  description: undefined
};
const parts150 = ["a", "post_many"];
const sqlIdent150 = sql.identifier(...parts150);
const options_post_many = {
  name: "post_many",
  identifier: "main.a.post_many(a._post)",
  from(...args) {
    return sql`${sqlIdent150}(${sqlFromArgDigests(args)})`;
  },
  parameters: [{
    name: "posts",
    required: true,
    notNull: false,
    codec: registryConfig_pgCodecs_postArray_postArray
  }],
  returnsArray: false,
  returnsSetof: true,
  isMutation: true,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "post_many"
    },
    tags: {
      behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
    }
  },
  description: undefined
};
const extensions169 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "person_computed_out"
  },
  tags: {
    notNull: true,
    sortable: true,
    filterable: true,
    behavior: ["-queryField -mutationField typeField", "-filter -order", "filter filterBy", "orderBy order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  },
  singleOutputParameterName: "o1"
};
const parts151 = ["c", "person_computed_out"];
const sqlIdent151 = sql.identifier(...parts151);
const fromCallback80 = (...args) => sql`${sqlIdent151}(${sqlFromArgDigests(args)})`;
const parameters80 = [{
  name: "person",
  required: true,
  notNull: false,
  codec: attributes_person_codec_person
}];
const extensions170 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "person_first_name"
  },
  tags: {
    sortable: true,
    behavior: ["-queryField -mutationField typeField", "-filter -order", "orderBy order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts152 = ["c", "person_first_name"];
const sqlIdent152 = sql.identifier(...parts152);
const fromCallback81 = (...args) => sql`${sqlIdent152}(${sqlFromArgDigests(args)})`;
const parameters81 = [{
  name: "person",
  required: true,
  notNull: false,
  codec: attributes_person_codec_person
}];
const extensions171 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "person_computed_out_out"
  },
  tags: {
    behavior: ["-queryField -mutationField typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts153 = ["c", "person_computed_out_out"];
const sqlIdent153 = sql.identifier(...parts153);
const fromCallback82 = (...args) => sql`${sqlIdent153}(${sqlFromArgDigests(args)})`;
const parameters82 = [{
  name: "person",
  required: true,
  notNull: false,
  codec: attributes_person_codec_person
}];
const extensions172 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "person_computed_inout"
  },
  tags: {
    behavior: ["-queryField -mutationField typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  },
  singleOutputParameterName: "ino"
};
const parts154 = ["c", "person_computed_inout"];
const sqlIdent154 = sql.identifier(...parts154);
const fromCallback83 = (...args) => sql`${sqlIdent154}(${sqlFromArgDigests(args)})`;
const parameters83 = [{
  name: "person",
  required: true,
  notNull: false,
  codec: attributes_person_codec_person
}, {
  name: "ino",
  required: true,
  notNull: false,
  codec: TYPES.text
}];
const extensions173 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "person_computed_inout_out"
  },
  tags: {
    behavior: ["-queryField -mutationField typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts155 = ["c", "person_computed_inout_out"];
const sqlIdent155 = sql.identifier(...parts155);
const fromCallback84 = (...args) => sql`${sqlIdent155}(${sqlFromArgDigests(args)})`;
const parameters84 = [{
  name: "person",
  required: true,
  notNull: false,
  codec: attributes_person_codec_person
}, {
  name: "ino",
  required: true,
  notNull: false,
  codec: TYPES.text
}];
const extensions174 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "person_exists"
  },
  tags: {
    deprecated: "This is deprecated (comment on function c.person_exists).",
    behavior: ["-queryField -mutationField typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts156 = ["c", "person_exists"];
const sqlIdent156 = sql.identifier(...parts156);
const fromCallback85 = (...args) => sql`${sqlIdent156}(${sqlFromArgDigests(args)})`;
const parameters85 = [{
  name: "person",
  required: true,
  notNull: false,
  codec: attributes_person_codec_person
}, {
  name: "email",
  required: true,
  notNull: false,
  codec: attributes_email_codec_email
}];
const extensions175 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "person_computed_first_arg_inout_out"
  },
  tags: {
    behavior: ["-queryField -mutationField typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts157 = ["c", "person_computed_first_arg_inout_out"];
const sqlIdent157 = sql.identifier(...parts157);
const fromCallback86 = (...args) => sql`${sqlIdent157}(${sqlFromArgDigests(args)})`;
const parameters86 = [{
  name: "person",
  required: true,
  notNull: false,
  codec: attributes_person_codec_person
}];
const extensions176 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "func_out_complex"
  },
  tags: {
    behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts158 = ["c", "func_out_complex"];
const sqlIdent158 = sql.identifier(...parts158);
const fromCallback87 = (...args) => sql`${sqlIdent158}(${sqlFromArgDigests(args)})`;
const parameters87 = [{
  name: "a",
  required: true,
  notNull: false,
  codec: TYPES.int
}, {
  name: "b",
  required: true,
  notNull: false,
  codec: TYPES.text
}];
const extensions177 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "func_out_complex_setof"
  },
  tags: {
    behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts159 = ["c", "func_out_complex_setof"];
const sqlIdent159 = sql.identifier(...parts159);
const fromCallback88 = (...args) => sql`${sqlIdent159}(${sqlFromArgDigests(args)})`;
const parameters88 = [{
  name: "a",
  required: true,
  notNull: false,
  codec: TYPES.int
}, {
  name: "b",
  required: true,
  notNull: false,
  codec: TYPES.text
}];
const extensions178 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "mutation_out_complex"
  },
  tags: {
    behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts160 = ["c", "mutation_out_complex"];
const sqlIdent160 = sql.identifier(...parts160);
const fromCallback89 = (...args) => sql`${sqlIdent160}(${sqlFromArgDigests(args)})`;
const parameters89 = [{
  name: "a",
  required: true,
  notNull: false,
  codec: TYPES.int
}, {
  name: "b",
  required: true,
  notNull: false,
  codec: TYPES.text
}];
const extensions179 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "mutation_out_complex_setof"
  },
  tags: {
    behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts161 = ["c", "mutation_out_complex_setof"];
const sqlIdent161 = sql.identifier(...parts161);
const fromCallback90 = (...args) => sql`${sqlIdent161}(${sqlFromArgDigests(args)})`;
const parameters90 = [{
  name: "a",
  required: true,
  notNull: false,
  codec: TYPES.int
}, {
  name: "b",
  required: true,
  notNull: false,
  codec: TYPES.text
}];
const extensions180 = {
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "person_computed_complex"
  },
  tags: {
    behavior: ["-queryField -mutationField typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
  }
};
const parts162 = ["c", "person_computed_complex"];
const sqlIdent162 = sql.identifier(...parts162);
const fromCallback91 = (...args) => sql`${sqlIdent162}(${sqlFromArgDigests(args)})`;
const parameters91 = [{
  name: "person",
  required: true,
  notNull: false,
  codec: attributes_person_codec_person
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
}];
const extensions181 = {
  description: "Person test comment",
  pg: {
    serviceName: "main",
    schemaName: "c",
    name: "person"
  },
  tags: {}
};
const uniques27 = [{
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
}];
const registryConfig_pgResources_person_person = {
  executor: executor_mainPgExecutor,
  name: "person",
  identifier: "main.c.person",
  from: attributes_person_codec_person.sqlType,
  codec: attributes_person_codec_person,
  uniques: uniques27,
  isVirtual: false,
  description: "Person test comment",
  extensions: extensions181
};
const parts163 = ["c", "person_first_post"];
const sqlIdent163 = sql.identifier(...parts163);
const options_person_first_post = {
  name: "person_first_post",
  identifier: "main.c.person_first_post(c.person)",
  from(...args) {
    return sql`${sqlIdent163}(${sqlFromArgDigests(args)})`;
  },
  parameters: [{
    name: "person",
    required: true,
    notNull: false,
    codec: attributes_person_codec_person
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
      behavior: ["-queryField -mutationField typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
    }
  },
  description: "The first post by the person."
};
const parts164 = ["c", "badly_behaved_function"];
const sqlIdent164 = sql.identifier(...parts164);
const options_badly_behaved_function = {
  name: "badly_behaved_function",
  identifier: "main.c.badly_behaved_function()",
  from(...args) {
    return sql`${sqlIdent164}(${sqlFromArgDigests(args)})`;
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
      behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
    }
  },
  description: undefined
};
const parts165 = ["c", "func_out_table"];
const sqlIdent165 = sql.identifier(...parts165);
const options_func_out_table = {
  name: "func_out_table",
  identifier: "main.c.func_out_table(c.person)",
  from(...args) {
    return sql`${sqlIdent165}(${sqlFromArgDigests(args)})`;
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
      behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
    }
  },
  description: undefined
};
const parts166 = ["c", "func_out_table_setof"];
const sqlIdent166 = sql.identifier(...parts166);
const options_func_out_table_setof = {
  name: "func_out_table_setof",
  identifier: "main.c.func_out_table_setof(c.person)",
  from(...args) {
    return sql`${sqlIdent166}(${sqlFromArgDigests(args)})`;
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
      behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
    }
  },
  description: undefined
};
const parts167 = ["c", "mutation_out_table"];
const sqlIdent167 = sql.identifier(...parts167);
const options_mutation_out_table = {
  name: "mutation_out_table",
  identifier: "main.c.mutation_out_table(c.person)",
  from(...args) {
    return sql`${sqlIdent167}(${sqlFromArgDigests(args)})`;
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
      behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
    }
  },
  description: undefined
};
const parts168 = ["c", "mutation_out_table_setof"];
const sqlIdent168 = sql.identifier(...parts168);
const options_mutation_out_table_setof = {
  name: "mutation_out_table_setof",
  identifier: "main.c.mutation_out_table_setof(c.person)",
  from(...args) {
    return sql`${sqlIdent168}(${sqlFromArgDigests(args)})`;
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
      behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
    }
  },
  description: undefined
};
const parts169 = ["c", "table_set_mutation"];
const sqlIdent169 = sql.identifier(...parts169);
const options_table_set_mutation = {
  name: "table_set_mutation",
  identifier: "main.c.table_set_mutation()",
  from(...args) {
    return sql`${sqlIdent169}(${sqlFromArgDigests(args)})`;
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
      behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
    }
  },
  description: undefined
};
const parts170 = ["c", "table_set_query"];
const sqlIdent170 = sql.identifier(...parts170);
const options_table_set_query = {
  name: "table_set_query",
  identifier: "main.c.table_set_query()",
  from(...args) {
    return sql`${sqlIdent170}(${sqlFromArgDigests(args)})`;
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
      behavior: ["queryField -mutationField -typeField", "-filter -order", "filter filterBy", "orderBy order", "-queryField -mutationField -typeField -orderBy -filterBy"]
    }
  },
  description: undefined
};
const parts171 = ["c", "table_set_query_plpgsql"];
const sqlIdent171 = sql.identifier(...parts171);
const options_table_set_query_plpgsql = {
  name: "table_set_query_plpgsql",
  identifier: "main.c.table_set_query_plpgsql()",
  from(...args) {
    return sql`${sqlIdent171}(${sqlFromArgDigests(args)})`;
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
      behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
    }
  },
  description: undefined
};
const parts172 = ["c", "person_computed_first_arg_inout"];
const sqlIdent172 = sql.identifier(...parts172);
const options_person_computed_first_arg_inout = {
  name: "person_computed_first_arg_inout",
  identifier: "main.c.person_computed_first_arg_inout(c.person)",
  from(...args) {
    return sql`${sqlIdent172}(${sqlFromArgDigests(args)})`;
  },
  parameters: [{
    name: "person",
    required: true,
    notNull: false,
    codec: attributes_person_codec_person
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
      behavior: ["-queryField -mutationField typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
    },
    singleOutputParameterName: "person"
  },
  description: undefined
};
const parts173 = ["c", "person_friends"];
const sqlIdent173 = sql.identifier(...parts173);
const options_person_friends = {
  name: "person_friends",
  identifier: "main.c.person_friends(c.person)",
  from(...args) {
    return sql`${sqlIdent173}(${sqlFromArgDigests(args)})`;
  },
  parameters: [{
    name: "person",
    required: true,
    notNull: false,
    codec: attributes_person_codec_person
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
      behavior: ["-queryField -mutationField typeField", "-filter -order", "orderBy order", "-queryField -mutationField -typeField -orderBy -filterBy"]
    }
  },
  description: undefined
};
const extensions182 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "b",
    name: "types"
  },
  tags: {
    foreignKey: extensions54.tags.foreignKey,
    behavior: ["-select -single -list -connection -insert -update -delete"]
  }
};
const uniques28 = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_types_types = {
  executor: executor_mainPgExecutor,
  name: "types",
  identifier: "main.b.types",
  from: registryConfig_pgCodecs_types_types.sqlType,
  codec: registryConfig_pgCodecs_types_types,
  uniques: uniques28,
  isVirtual: false,
  description: undefined,
  extensions: extensions182
};
const parts174 = ["b", "type_function_connection"];
const sqlIdent174 = sql.identifier(...parts174);
const options_type_function_connection = {
  name: "type_function_connection",
  identifier: "main.b.type_function_connection()",
  from(...args) {
    return sql`${sqlIdent174}(${sqlFromArgDigests(args)})`;
  },
  parameters: [],
  returnsArray: false,
  returnsSetof: true,
  isMutation: false,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "type_function_connection"
    },
    tags: {
      behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
    }
  },
  description: undefined
};
const parts175 = ["b", "type_function_connection_mutation"];
const sqlIdent175 = sql.identifier(...parts175);
const options_type_function_connection_mutation = {
  name: "type_function_connection_mutation",
  identifier: "main.b.type_function_connection_mutation()",
  from(...args) {
    return sql`${sqlIdent175}(${sqlFromArgDigests(args)})`;
  },
  parameters: [],
  returnsArray: false,
  returnsSetof: true,
  isMutation: true,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "type_function_connection_mutation"
    },
    tags: {
      behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
    }
  },
  description: undefined
};
const parts176 = ["b", "type_function"];
const sqlIdent176 = sql.identifier(...parts176);
const options_type_function = {
  name: "type_function",
  identifier: "main.b.type_function(int4)",
  from(...args) {
    return sql`${sqlIdent176}(${sqlFromArgDigests(args)})`;
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
      schemaName: "b",
      name: "type_function"
    },
    tags: {
      behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
    }
  },
  description: undefined
};
const parts177 = ["b", "type_function_mutation"];
const sqlIdent177 = sql.identifier(...parts177);
const options_type_function_mutation = {
  name: "type_function_mutation",
  identifier: "main.b.type_function_mutation(int4)",
  from(...args) {
    return sql`${sqlIdent177}(${sqlFromArgDigests(args)})`;
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
      schemaName: "b",
      name: "type_function_mutation"
    },
    tags: {
      behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
    }
  },
  description: undefined
};
const parts178 = ["c", "person_type_function_connection"];
const sqlIdent178 = sql.identifier(...parts178);
const options_person_type_function_connection = {
  name: "person_type_function_connection",
  identifier: "main.c.person_type_function_connection(c.person)",
  from(...args) {
    return sql`${sqlIdent178}(${sqlFromArgDigests(args)})`;
  },
  parameters: [{
    name: "p",
    required: true,
    notNull: false,
    codec: attributes_person_codec_person
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
      behavior: ["-queryField -mutationField typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
    }
  },
  description: undefined
};
const parts179 = ["c", "person_type_function"];
const sqlIdent179 = sql.identifier(...parts179);
const options_person_type_function = {
  name: "person_type_function",
  identifier: "main.c.person_type_function(c.person,int4)",
  from(...args) {
    return sql`${sqlIdent179}(${sqlFromArgDigests(args)})`;
  },
  parameters: [{
    name: "p",
    required: true,
    notNull: false,
    codec: attributes_person_codec_person
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
      behavior: ["-queryField -mutationField typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
    }
  },
  description: undefined
};
const parts180 = ["b", "type_function_list"];
const sqlIdent180 = sql.identifier(...parts180);
const options_type_function_list = {
  name: "type_function_list",
  identifier: "main.b.type_function_list()",
  from(...args) {
    return sql`${sqlIdent180}(${sqlFromArgDigests(args)})`;
  },
  parameters: [],
  returnsArray: true,
  returnsSetof: false,
  isMutation: false,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "type_function_list"
    },
    tags: {
      behavior: ["queryField -mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
    }
  },
  description: undefined
};
const parts181 = ["b", "type_function_list_mutation"];
const sqlIdent181 = sql.identifier(...parts181);
const options_type_function_list_mutation = {
  name: "type_function_list_mutation",
  identifier: "main.b.type_function_list_mutation()",
  from(...args) {
    return sql`${sqlIdent181}(${sqlFromArgDigests(args)})`;
  },
  parameters: [],
  returnsArray: true,
  returnsSetof: false,
  isMutation: true,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "type_function_list_mutation"
    },
    tags: {
      behavior: ["-queryField mutationField -typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
    }
  },
  description: undefined
};
const parts182 = ["c", "person_type_function_list"];
const sqlIdent182 = sql.identifier(...parts182);
const options_person_type_function_list = {
  name: "person_type_function_list",
  identifier: "main.c.person_type_function_list(c.person)",
  from(...args) {
    return sql`${sqlIdent182}(${sqlFromArgDigests(args)})`;
  },
  parameters: [{
    name: "p",
    required: true,
    notNull: false,
    codec: attributes_person_codec_person
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
      behavior: ["-queryField -mutationField typeField", "-filter -order", "-queryField -mutationField -typeField -orderBy -filterBy"]
    }
  },
  description: undefined
};
const registry = makeRegistry({
  pgCodecs: Object.assign(Object.create(null), {
    int4: TYPES.int,
    void: TYPES.void,
    interval: TYPES.interval,
    int8: TYPES.bigint,
    json: TYPES.json,
    jsonb: TYPES.jsonb,
    FuncOutOutRecord: registryConfig_pgCodecs_FuncOutOutRecord_FuncOutOutRecord,
    text: TYPES.text,
    FuncOutOutSetofRecord: registryConfig_pgCodecs_FuncOutOutSetofRecord_FuncOutOutSetofRecord,
    FuncOutOutUnnamedRecord: registryConfig_pgCodecs_FuncOutOutUnnamedRecord_FuncOutOutUnnamedRecord,
    MutationOutOutRecord: registryConfig_pgCodecs_MutationOutOutRecord_MutationOutOutRecord,
    MutationOutOutSetofRecord: registryConfig_pgCodecs_MutationOutOutSetofRecord_MutationOutOutSetofRecord,
    MutationOutOutUnnamedRecord: registryConfig_pgCodecs_MutationOutOutUnnamedRecord_MutationOutOutUnnamedRecord,
    SearchTestSummariesRecord: registryConfig_pgCodecs_SearchTestSummariesRecord_SearchTestSummariesRecord,
    FuncOutUnnamedOutOutUnnamedRecord: registryConfig_pgCodecs_FuncOutUnnamedOutOutUnnamedRecord_FuncOutUnnamedOutOutUnnamedRecord,
    FuncReturnsTableMultiColRecord: registryConfig_pgCodecs_FuncReturnsTableMultiColRecord_FuncReturnsTableMultiColRecord,
    MutationOutUnnamedOutOutUnnamedRecord: registryConfig_pgCodecs_MutationOutUnnamedOutOutUnnamedRecord_MutationOutUnnamedOutOutUnnamedRecord,
    MutationReturnsTableMultiColRecord: registryConfig_pgCodecs_MutationReturnsTableMultiColRecord_MutationReturnsTableMultiColRecord,
    guid: registryConfig_pgCodecs_guid_guid,
    varchar: TYPES.varchar,
    intervalArray: registryConfig_pgCodecs_intervalArray_intervalArray,
    textArray: registryConfig_pgCodecs_textArray_textArray,
    nonUpdatableView: registryConfig_pgCodecs_nonUpdatableView_nonUpdatableView,
    inputs: registryConfig_pgCodecs_inputs_inputs,
    patchs: registryConfig_pgCodecs_patchs_patchs,
    reserved: registryConfig_pgCodecs_reserved_reserved,
    reservedPatchs: registryConfig_pgCodecs_reservedPatchs_reservedPatchs,
    reservedInput: registryConfig_pgCodecs_reservedInput_reservedInput,
    defaultValue: registryConfig_pgCodecs_defaultValue_defaultValue,
    noPrimaryKey: registryConfig_pgCodecs_noPrimaryKey_noPrimaryKey,
    uniqueForeignKey: registryConfig_pgCodecs_uniqueForeignKey_uniqueForeignKey,
    myTable: registryConfig_pgCodecs_myTable_myTable,
    personSecret: registryConfig_pgCodecs_personSecret_personSecret,
    foreignKey: registryConfig_pgCodecs_foreignKey_foreignKey,
    testview: registryConfig_pgCodecs_testview_testview,
    uuidArray: registryConfig_pgCodecs_uuidArray_uuidArray,
    uuid: TYPES.uuid,
    viewTable: registryConfig_pgCodecs_viewTable_viewTable,
    compoundKey: registryConfig_pgCodecs_compoundKey_compoundKey,
    bool: TYPES.boolean,
    similarTable1: registryConfig_pgCodecs_similarTable1_similarTable1,
    similarTable2: registryConfig_pgCodecs_similarTable2_similarTable2,
    updatableView: registryConfig_pgCodecs_updatableView_updatableView,
    nullTestRecord: registryConfig_pgCodecs_nullTestRecord_nullTestRecord,
    issue756: registryConfig_pgCodecs_issue756_issue756,
    notNullTimestamp: attributes_ts_codec_notNullTimestamp,
    timestamptz: TYPES.timestamptz,
    edgeCase: registryConfig_pgCodecs_edgeCase_edgeCase,
    int2: TYPES.int2,
    jwtToken: registryConfig_pgCodecs_jwtToken_jwtToken,
    numeric: TYPES.numeric,
    leftArm: registryConfig_pgCodecs_leftArm_leftArm,
    float8: TYPES.float,
    authPayload: registryConfig_pgCodecs_authPayload_authPayload,
    FuncOutOutCompoundTypeRecord: registryConfig_pgCodecs_FuncOutOutCompoundTypeRecord_FuncOutOutCompoundTypeRecord,
    compoundType: attributes_o2_codec_compoundType,
    color: attributes_c_codec_color,
    enumCaps: attributes_e_codec_enumCaps,
    enumWithEmptyString: attributes_f_codec_enumWithEmptyString,
    MutationOutOutCompoundTypeRecord: registryConfig_pgCodecs_MutationOutOutCompoundTypeRecord_MutationOutOutCompoundTypeRecord,
    QueryOutputTwoRowsRecord: registryConfig_pgCodecs_QueryOutputTwoRowsRecord_QueryOutputTwoRowsRecord,
    post: attributes_post_codec_post,
    anEnumArray: attributes_enums_codec_anEnumArray,
    anEnum: innerCodec_anEnum,
    comptypeArray: attributes_comptypes_codec_comptypeArray,
    comptype: innerCodec_comptype,
    PersonComputedOutOutRecord: registryConfig_pgCodecs_PersonComputedOutOutRecord_PersonComputedOutOutRecord,
    PersonComputedInoutOutRecord: registryConfig_pgCodecs_PersonComputedInoutOutRecord_PersonComputedInoutOutRecord,
    PersonComputedFirstArgInoutOutRecord: registryConfig_pgCodecs_PersonComputedFirstArgInoutOutRecord_PersonComputedFirstArgInoutOutRecord,
    person: attributes_person_codec_person,
    email: attributes_email_codec_email,
    wrappedUrl: attributes_site_codec_wrappedUrl,
    notNullUrl: attributes_url_codec_notNullUrl,
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
    types: registryConfig_pgCodecs_types_types,
    colorArray: attributes_enum_array_codec_colorArray,
    anInt: attributes_domain_codec_anInt,
    anotherInt: attributes_domain2_codec_anotherInt,
    numrange: attributes_nullable_range_codec_numrange,
    daterange: attributes_daterange_codec_daterange,
    date: TYPES.date,
    anIntRange: attributes_an_int_range_codec_anIntRange,
    time: TYPES.time,
    timetz: TYPES.timetz,
    money: TYPES.money,
    nestedCompoundType: attributes_nested_compound_type_codec_nestedCompoundType,
    point: TYPES.point,
    regproc: TYPES.regproc,
    regprocedure: TYPES.regprocedure,
    regoper: TYPES.regoper,
    regoperator: TYPES.regoperator,
    regclass: TYPES.regclass,
    regtype: TYPES.regtype,
    regconfig: TYPES.regconfig,
    regdictionary: TYPES.regdictionary,
    textArrayDomain: attributes_text_array_domain_codec_textArrayDomain,
    int8ArrayDomain: attributes_int8_array_domain_codec_int8ArrayDomain,
    bytea: TYPES.bytea,
    byteaArray: attributes_bytea_array_codec_byteaArray,
    bpchar: TYPES.bpchar,
    compoundTypeArray: listOfCodec(attributes_o2_codec_compoundType, {
      extensions: extensions55,
      typeDelim: ",",
      description: undefined,
      name: "compoundTypeArray"
    }),
    jwtTokenArray: listOfCodec(registryConfig_pgCodecs_jwtToken_jwtToken, {
      extensions: extensions56,
      typeDelim: ",",
      description: undefined,
      name: "jwtTokenArray"
    }),
    typesArray: listOfCodec(registryConfig_pgCodecs_types_types, {
      extensions: extensions57,
      typeDelim: ",",
      description: undefined,
      name: "typesArray"
    }),
    int4Array: registryConfig_pgCodecs_int4Array_int4Array,
    floatrange: registryConfig_pgCodecs_floatrange_floatrange,
    postArray: registryConfig_pgCodecs_postArray_postArray,
    int8Array: innerCodec_int8Array,
    tablefuncCrosstab2: recordCodec(spec_tablefuncCrosstab2),
    tablefuncCrosstab3: recordCodec(spec_tablefuncCrosstab3),
    tablefuncCrosstab4: recordCodec(spec_tablefuncCrosstab4)
  }),
  pgResources: Object.assign(Object.create(null), {
    current_user_id: {
      executor: executor_mainPgExecutor,
      name: "current_user_id",
      identifier: "main.c.current_user_id()",
      from(...args) {
        return sql`${sqlIdent51}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: false,
      extensions: extensions64,
      description: undefined
    },
    func_out: {
      executor: executor_mainPgExecutor,
      name: "func_out",
      identifier: "main.c.func_out(int4)",
      from: fromCallback2,
      parameters: parameters2,
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: false,
      extensions: extensions65,
      description: undefined
    },
    func_out_setof: {
      executor: executor_mainPgExecutor,
      name: "func_out_setof",
      identifier: "main.c.func_out_setof(int4)",
      from: fromCallback3,
      parameters: parameters3,
      isUnique: !true,
      codec: TYPES.int,
      uniques: [],
      isMutation: false,
      extensions: extensions66,
      description: undefined
    },
    func_out_unnamed: {
      executor: executor_mainPgExecutor,
      name: "func_out_unnamed",
      identifier: "main.c.func_out_unnamed(int4)",
      from: fromCallback4,
      parameters: parameters4,
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: false,
      extensions: extensions67,
      description: undefined
    },
    mutation_out: {
      executor: executor_mainPgExecutor,
      name: "mutation_out",
      identifier: "main.c.mutation_out(int4)",
      from: fromCallback5,
      parameters: parameters5,
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: true,
      extensions: extensions68,
      description: undefined
    },
    mutation_out_setof: {
      executor: executor_mainPgExecutor,
      name: "mutation_out_setof",
      identifier: "main.c.mutation_out_setof(int4)",
      from: fromCallback6,
      parameters: parameters6,
      isUnique: !true,
      codec: TYPES.int,
      uniques: [],
      isMutation: true,
      extensions: extensions69,
      description: undefined
    },
    mutation_out_unnamed: {
      executor: executor_mainPgExecutor,
      name: "mutation_out_unnamed",
      identifier: "main.c.mutation_out_unnamed(int4)",
      from: fromCallback7,
      parameters: parameters7,
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: true,
      extensions: extensions70,
      description: undefined
    },
    no_args_mutation: {
      executor: executor_mainPgExecutor,
      name: "no_args_mutation",
      identifier: "main.c.no_args_mutation()",
      from: fromCallback8,
      parameters: parameters8,
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: true,
      extensions: extensions71,
      description: undefined
    },
    no_args_query: {
      executor: executor_mainPgExecutor,
      name: "no_args_query",
      identifier: "main.c.no_args_query()",
      from: fromCallback9,
      parameters: parameters9,
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: false,
      extensions: extensions72,
      description: undefined
    },
    return_void_mutation: {
      executor: executor_mainPgExecutor,
      name: "return_void_mutation",
      identifier: "main.a.return_void_mutation()",
      from: fromCallback10,
      parameters: parameters10,
      isUnique: !false,
      codec: TYPES.void,
      uniques: [],
      isMutation: true,
      extensions: extensions73,
      description: undefined
    },
    mutation_interval_set: {
      executor: executor_mainPgExecutor,
      name: "mutation_interval_set",
      identifier: "main.a.mutation_interval_set()",
      from: fromCallback11,
      parameters: parameters11,
      isUnique: !true,
      codec: TYPES.interval,
      uniques: [],
      isMutation: true,
      extensions: extensions74,
      description: undefined
    },
    query_interval_set: {
      executor: executor_mainPgExecutor,
      name: "query_interval_set",
      identifier: "main.a.query_interval_set()",
      from: fromCallback12,
      parameters: parameters12,
      isUnique: !true,
      codec: TYPES.interval,
      uniques: [],
      isMutation: false,
      extensions: extensions75,
      description: undefined
    },
    static_big_integer: {
      executor: executor_mainPgExecutor,
      name: "static_big_integer",
      identifier: "main.a.static_big_integer()",
      from: fromCallback13,
      parameters: parameters13,
      isUnique: !true,
      codec: TYPES.bigint,
      uniques: [],
      isMutation: false,
      extensions: extensions76,
      description: undefined
    },
    func_in_out: {
      executor: executor_mainPgExecutor,
      name: "func_in_out",
      identifier: "main.c.func_in_out(int4,int4)",
      from: fromCallback14,
      parameters: parameters14,
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: false,
      extensions: extensions77,
      description: undefined
    },
    func_returns_table_one_col: {
      executor: executor_mainPgExecutor,
      name: "func_returns_table_one_col",
      identifier: "main.c.func_returns_table_one_col(int4,int4)",
      from: fromCallback15,
      parameters: parameters15,
      isUnique: !true,
      codec: TYPES.int,
      uniques: [],
      isMutation: false,
      extensions: extensions78,
      description: undefined
    },
    mutation_in_out: {
      executor: executor_mainPgExecutor,
      name: "mutation_in_out",
      identifier: "main.c.mutation_in_out(int4,int4)",
      from: fromCallback16,
      parameters: parameters16,
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: true,
      extensions: extensions79,
      description: undefined
    },
    mutation_returns_table_one_col: {
      executor: executor_mainPgExecutor,
      name: "mutation_returns_table_one_col",
      identifier: "main.c.mutation_returns_table_one_col(int4,int4)",
      from: fromCallback17,
      parameters: parameters17,
      isUnique: !true,
      codec: TYPES.int,
      uniques: [],
      isMutation: true,
      extensions: extensions80,
      description: undefined
    },
    assert_something: {
      executor: executor_mainPgExecutor,
      name: "assert_something",
      identifier: "main.a.assert_something(text)",
      from: fromCallback18,
      parameters: parameters18,
      isUnique: !false,
      codec: TYPES.void,
      uniques: [],
      isMutation: false,
      extensions: extensions81,
      description: undefined
    },
    assert_something_nx: {
      executor: executor_mainPgExecutor,
      name: "assert_something_nx",
      identifier: "main.a.assert_something_nx(text)",
      from: fromCallback19,
      parameters: parameters19,
      isUnique: !false,
      codec: TYPES.void,
      uniques: [],
      isMutation: false,
      extensions: extensions82,
      description: undefined
    },
    json_identity: {
      executor: executor_mainPgExecutor,
      name: "json_identity",
      identifier: "main.c.json_identity(json)",
      from: fromCallback20,
      parameters: parameters20,
      isUnique: !false,
      codec: TYPES.json,
      uniques: [],
      isMutation: false,
      extensions: extensions83,
      description: undefined
    },
    json_identity_mutation: {
      executor: executor_mainPgExecutor,
      name: "json_identity_mutation",
      identifier: "main.c.json_identity_mutation(json)",
      from: fromCallback21,
      parameters: parameters21,
      isUnique: !false,
      codec: TYPES.json,
      uniques: [],
      isMutation: true,
      extensions: extensions84,
      description: undefined
    },
    jsonb_identity: {
      executor: executor_mainPgExecutor,
      name: "jsonb_identity",
      identifier: "main.c.jsonb_identity(jsonb)",
      from: fromCallback22,
      parameters: parameters22,
      isUnique: !false,
      codec: TYPES.jsonb,
      uniques: [],
      isMutation: false,
      extensions: extensions85,
      description: undefined
    },
    jsonb_identity_mutation: {
      executor: executor_mainPgExecutor,
      name: "jsonb_identity_mutation",
      identifier: "main.c.jsonb_identity_mutation(jsonb)",
      from: fromCallback23,
      parameters: parameters23,
      isUnique: !false,
      codec: TYPES.jsonb,
      uniques: [],
      isMutation: true,
      extensions: extensions86,
      description: undefined
    },
    jsonb_identity_mutation_plpgsql: {
      executor: executor_mainPgExecutor,
      name: "jsonb_identity_mutation_plpgsql",
      identifier: "main.c.jsonb_identity_mutation_plpgsql(jsonb)",
      from: fromCallback24,
      parameters: parameters24,
      isUnique: !false,
      codec: TYPES.jsonb,
      uniques: [],
      isMutation: true,
      extensions: extensions87,
      description: undefined
    },
    jsonb_identity_mutation_plpgsql_with_default: {
      executor: executor_mainPgExecutor,
      name: "jsonb_identity_mutation_plpgsql_with_default",
      identifier: "main.c.jsonb_identity_mutation_plpgsql_with_default(jsonb)",
      from: fromCallback25,
      parameters: parameters25,
      isUnique: !false,
      codec: TYPES.jsonb,
      uniques: [],
      isMutation: true,
      extensions: extensions88,
      description: undefined
    },
    add_1_mutation: {
      executor: executor_mainPgExecutor,
      name: "add_1_mutation",
      identifier: "main.a.add_1_mutation(int4,int4)",
      from: fromCallback26,
      parameters: parameters26,
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: true,
      extensions: extensions89,
      description: "lol, add some stuff 1 mutation"
    },
    add_1_query: {
      executor: executor_mainPgExecutor,
      name: "add_1_query",
      identifier: "main.a.add_1_query(int4,int4)",
      from: fromCallback27,
      parameters: parameters27,
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: false,
      extensions: extensions90,
      description: "lol, add some stuff 1 query"
    },
    add_2_mutation: {
      executor: executor_mainPgExecutor,
      name: "add_2_mutation",
      identifier: "main.a.add_2_mutation(int4,int4)",
      from: fromCallback28,
      parameters: parameters28,
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: true,
      extensions: extensions91,
      description: "lol, add some stuff 2 mutation"
    },
    add_2_query: {
      executor: executor_mainPgExecutor,
      name: "add_2_query",
      identifier: "main.a.add_2_query(int4,int4)",
      from: fromCallback29,
      parameters: parameters29,
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: false,
      extensions: extensions92,
      description: "lol, add some stuff 2 query"
    },
    add_3_mutation: {
      executor: executor_mainPgExecutor,
      name: "add_3_mutation",
      identifier: "main.a.add_3_mutation(int4,int4)",
      from: fromCallback30,
      parameters: parameters30,
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: true,
      extensions: extensions93,
      description: "lol, add some stuff 3 mutation"
    },
    add_3_query: {
      executor: executor_mainPgExecutor,
      name: "add_3_query",
      identifier: "main.a.add_3_query(int4,int4)",
      from: fromCallback31,
      parameters: parameters31,
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: false,
      extensions: extensions94,
      description: "lol, add some stuff 3 query"
    },
    add_4_mutation: {
      executor: executor_mainPgExecutor,
      name: "add_4_mutation",
      identifier: "main.a.add_4_mutation(int4,int4)",
      from: fromCallback32,
      parameters: parameters32,
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: true,
      extensions: extensions95,
      description: "lol, add some stuff 4 mutation"
    },
    add_4_mutation_error: {
      executor: executor_mainPgExecutor,
      name: "add_4_mutation_error",
      identifier: "main.a.add_4_mutation_error(int4,int4)",
      from: fromCallback33,
      parameters: parameters33,
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: true,
      extensions: extensions96,
      description: undefined
    },
    add_4_query: {
      executor: executor_mainPgExecutor,
      name: "add_4_query",
      identifier: "main.a.add_4_query(int4,int4)",
      from: fromCallback34,
      parameters: parameters34,
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: false,
      extensions: extensions97,
      description: "lol, add some stuff 4 query"
    },
    mult_1: {
      executor: executor_mainPgExecutor,
      name: "mult_1",
      identifier: "main.b.mult_1(int4,int4)",
      from: fromCallback35,
      parameters: parameters35,
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: true,
      extensions: extensions98,
      description: undefined
    },
    mult_2: {
      executor: executor_mainPgExecutor,
      name: "mult_2",
      identifier: "main.b.mult_2(int4,int4)",
      from: fromCallback36,
      parameters: parameters36,
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: true,
      extensions: extensions99,
      description: undefined
    },
    mult_3: {
      executor: executor_mainPgExecutor,
      name: "mult_3",
      identifier: "main.b.mult_3(int4,int4)",
      from: fromCallback37,
      parameters: parameters37,
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: true,
      extensions: extensions100,
      description: undefined
    },
    mult_4: {
      executor: executor_mainPgExecutor,
      name: "mult_4",
      identifier: "main.b.mult_4(int4,int4)",
      from: fromCallback38,
      parameters: parameters38,
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: true,
      extensions: extensions101,
      description: undefined
    },
    func_in_inout: {
      executor: executor_mainPgExecutor,
      name: "func_in_inout",
      identifier: "main.c.func_in_inout(int4,int4)",
      from: fromCallback39,
      parameters: parameters39,
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: false,
      extensions: extensions102,
      description: undefined
    },
    func_out_out: {
      executor: executor_mainPgExecutor,
      name: "func_out_out",
      identifier: "main.c.func_out_out(int4,text)",
      from: fromCallback40,
      parameters: parameters40,
      isUnique: !false,
      codec: registryConfig_pgCodecs_FuncOutOutRecord_FuncOutOutRecord,
      uniques: [],
      isMutation: false,
      extensions: extensions103,
      description: undefined
    },
    func_out_out_setof: {
      executor: executor_mainPgExecutor,
      name: "func_out_out_setof",
      identifier: "main.c.func_out_out_setof(int4,text)",
      from: fromCallback41,
      parameters: parameters41,
      isUnique: !true,
      codec: registryConfig_pgCodecs_FuncOutOutSetofRecord_FuncOutOutSetofRecord,
      uniques: [],
      isMutation: false,
      extensions: extensions104,
      description: undefined
    },
    func_out_out_unnamed: {
      executor: executor_mainPgExecutor,
      name: "func_out_out_unnamed",
      identifier: "main.c.func_out_out_unnamed(int4,text)",
      from: fromCallback42,
      parameters: parameters42,
      isUnique: !false,
      codec: registryConfig_pgCodecs_FuncOutOutUnnamedRecord_FuncOutOutUnnamedRecord,
      uniques: [],
      isMutation: false,
      extensions: extensions105,
      description: undefined
    },
    mutation_in_inout: {
      executor: executor_mainPgExecutor,
      name: "mutation_in_inout",
      identifier: "main.c.mutation_in_inout(int4,int4)",
      from: fromCallback43,
      parameters: parameters43,
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: true,
      extensions: extensions106,
      description: undefined
    },
    mutation_out_out: {
      executor: executor_mainPgExecutor,
      name: "mutation_out_out",
      identifier: "main.c.mutation_out_out(int4,text)",
      from: fromCallback44,
      parameters: parameters44,
      isUnique: !false,
      codec: registryConfig_pgCodecs_MutationOutOutRecord_MutationOutOutRecord,
      uniques: [],
      isMutation: true,
      extensions: extensions107,
      description: undefined
    },
    mutation_out_out_setof: {
      executor: executor_mainPgExecutor,
      name: "mutation_out_out_setof",
      identifier: "main.c.mutation_out_out_setof(int4,text)",
      from: fromCallback45,
      parameters: parameters45,
      isUnique: !true,
      codec: registryConfig_pgCodecs_MutationOutOutSetofRecord_MutationOutOutSetofRecord,
      uniques: [],
      isMutation: true,
      extensions: extensions108,
      description: undefined
    },
    mutation_out_out_unnamed: {
      executor: executor_mainPgExecutor,
      name: "mutation_out_out_unnamed",
      identifier: "main.c.mutation_out_out_unnamed(int4,text)",
      from: fromCallback46,
      parameters: parameters46,
      isUnique: !false,
      codec: registryConfig_pgCodecs_MutationOutOutUnnamedRecord_MutationOutOutUnnamedRecord,
      uniques: [],
      isMutation: true,
      extensions: extensions109,
      description: undefined
    },
    search_test_summaries: {
      executor: executor_mainPgExecutor,
      name: "search_test_summaries",
      identifier: "main.c.search_test_summaries(int4,interval)",
      from: fromCallback47,
      parameters: parameters47,
      isUnique: !true,
      codec: registryConfig_pgCodecs_SearchTestSummariesRecord_SearchTestSummariesRecord,
      uniques: [],
      isMutation: false,
      extensions: extensions110,
      description: undefined
    },
    optional_missing_middle_1: {
      executor: executor_mainPgExecutor,
      name: "optional_missing_middle_1",
      identifier: "main.a.optional_missing_middle_1(int4,int4,int4)",
      from: fromCallback48,
      parameters: parameters48,
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: false,
      extensions: extensions111,
      description: undefined
    },
    optional_missing_middle_2: {
      executor: executor_mainPgExecutor,
      name: "optional_missing_middle_2",
      identifier: "main.a.optional_missing_middle_2(int4,int4,int4)",
      from: fromCallback49,
      parameters: parameters49,
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: false,
      extensions: extensions112,
      description: undefined
    },
    optional_missing_middle_3: {
      executor: executor_mainPgExecutor,
      name: "optional_missing_middle_3",
      identifier: "main.a.optional_missing_middle_3(int4,int4,int4)",
      from: fromCallback50,
      parameters: parameters50,
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: false,
      extensions: extensions113,
      description: undefined
    },
    optional_missing_middle_4: {
      executor: executor_mainPgExecutor,
      name: "optional_missing_middle_4",
      identifier: "main.a.optional_missing_middle_4(int4,int4,int4)",
      from: fromCallback51,
      parameters: parameters51,
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: false,
      extensions: extensions114,
      description: undefined
    },
    optional_missing_middle_5: {
      executor: executor_mainPgExecutor,
      name: "optional_missing_middle_5",
      identifier: "main.a.optional_missing_middle_5(int4,int4,int4)",
      from: fromCallback52,
      parameters: parameters52,
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: false,
      extensions: extensions115,
      description: undefined
    },
    func_out_unnamed_out_out_unnamed: {
      executor: executor_mainPgExecutor,
      name: "func_out_unnamed_out_out_unnamed",
      identifier: "main.c.func_out_unnamed_out_out_unnamed(int4,text,int4)",
      from: fromCallback53,
      parameters: parameters53,
      isUnique: !false,
      codec: registryConfig_pgCodecs_FuncOutUnnamedOutOutUnnamedRecord_FuncOutUnnamedOutOutUnnamedRecord,
      uniques: [],
      isMutation: false,
      extensions: extensions116,
      description: undefined
    },
    func_returns_table_multi_col: {
      executor: executor_mainPgExecutor,
      name: "func_returns_table_multi_col",
      identifier: "main.c.func_returns_table_multi_col(int4,int4,text)",
      from: fromCallback54,
      parameters: parameters54,
      isUnique: !true,
      codec: registryConfig_pgCodecs_FuncReturnsTableMultiColRecord_FuncReturnsTableMultiColRecord,
      uniques: [],
      isMutation: false,
      extensions: extensions117,
      description: undefined
    },
    int_set_mutation: {
      executor: executor_mainPgExecutor,
      name: "int_set_mutation",
      identifier: "main.c.int_set_mutation(int4,int4,int4)",
      from: fromCallback55,
      parameters: parameters55,
      isUnique: !true,
      codec: TYPES.int,
      uniques: [],
      isMutation: true,
      extensions: extensions118,
      description: undefined
    },
    int_set_query: {
      executor: executor_mainPgExecutor,
      name: "int_set_query",
      identifier: "main.c.int_set_query(int4,int4,int4)",
      from: fromCallback56,
      parameters: parameters56,
      isUnique: !true,
      codec: TYPES.int,
      uniques: [],
      isMutation: false,
      extensions: extensions119,
      description: undefined
    },
    mutation_out_unnamed_out_out_unnamed: {
      executor: executor_mainPgExecutor,
      name: "mutation_out_unnamed_out_out_unnamed",
      identifier: "main.c.mutation_out_unnamed_out_out_unnamed(int4,text,int4)",
      from: fromCallback57,
      parameters: parameters57,
      isUnique: !false,
      codec: registryConfig_pgCodecs_MutationOutUnnamedOutOutUnnamedRecord_MutationOutUnnamedOutOutUnnamedRecord,
      uniques: [],
      isMutation: true,
      extensions: extensions120,
      description: undefined
    },
    mutation_returns_table_multi_col: {
      executor: executor_mainPgExecutor,
      name: "mutation_returns_table_multi_col",
      identifier: "main.c.mutation_returns_table_multi_col(int4,int4,text)",
      from: fromCallback58,
      parameters: parameters58,
      isUnique: !true,
      codec: registryConfig_pgCodecs_MutationReturnsTableMultiColRecord_MutationReturnsTableMultiColRecord,
      uniques: [],
      isMutation: true,
      extensions: extensions121,
      description: undefined
    },
    guid_fn: {
      executor: executor_mainPgExecutor,
      name: "guid_fn",
      identifier: "main.b.guid_fn(b.guid)",
      from: fromCallback59,
      parameters: parameters59,
      isUnique: !false,
      codec: registryConfig_pgCodecs_guid_guid,
      uniques: [],
      isMutation: true,
      extensions: extensions122,
      description: undefined
    },
    mutation_interval_array: {
      executor: executor_mainPgExecutor,
      name: "mutation_interval_array",
      identifier: "main.a.mutation_interval_array()",
      from: fromCallback60,
      parameters: parameters60,
      isUnique: !false,
      codec: registryConfig_pgCodecs_intervalArray_intervalArray,
      uniques: [],
      isMutation: true,
      extensions: extensions123,
      description: undefined
    },
    query_interval_array: {
      executor: executor_mainPgExecutor,
      name: "query_interval_array",
      identifier: "main.a.query_interval_array()",
      from: fromCallback61,
      parameters: parameters61,
      isUnique: !false,
      codec: registryConfig_pgCodecs_intervalArray_intervalArray,
      uniques: [],
      isMutation: false,
      extensions: extensions124,
      description: undefined
    },
    mutation_text_array: {
      executor: executor_mainPgExecutor,
      name: "mutation_text_array",
      identifier: "main.a.mutation_text_array()",
      from: fromCallback62,
      parameters: parameters62,
      isUnique: !false,
      codec: registryConfig_pgCodecs_textArray_textArray,
      uniques: [],
      isMutation: true,
      extensions: extensions125,
      description: undefined
    },
    query_text_array: {
      executor: executor_mainPgExecutor,
      name: "query_text_array",
      identifier: "main.a.query_text_array()",
      from: fromCallback63,
      parameters: parameters63,
      isUnique: !false,
      codec: registryConfig_pgCodecs_textArray_textArray,
      uniques: [],
      isMutation: false,
      extensions: extensions126,
      description: undefined
    },
    non_updatable_view: {
      executor: executor_mainPgExecutor,
      name: "non_updatable_view",
      identifier: "main.a.non_updatable_view",
      from: registryConfig_pgCodecs_nonUpdatableView_nonUpdatableView.sqlType,
      codec: registryConfig_pgCodecs_nonUpdatableView_nonUpdatableView,
      uniques: [],
      isVirtual: false,
      description: undefined,
      extensions: extensions127
    },
    inputs: {
      executor: executor_mainPgExecutor,
      name: "inputs",
      identifier: "main.a.inputs",
      from: registryConfig_pgCodecs_inputs_inputs.sqlType,
      codec: registryConfig_pgCodecs_inputs_inputs,
      uniques: uniques2,
      isVirtual: false,
      description: "Should output as Input",
      extensions: extensions128
    },
    patchs: {
      executor: executor_mainPgExecutor,
      name: "patchs",
      identifier: "main.a.patchs",
      from: registryConfig_pgCodecs_patchs_patchs.sqlType,
      codec: registryConfig_pgCodecs_patchs_patchs,
      uniques: uniques3,
      isVirtual: false,
      description: "Should output as Patch",
      extensions: extensions129
    },
    reserved: {
      executor: executor_mainPgExecutor,
      name: "reserved",
      identifier: "main.a.reserved",
      from: registryConfig_pgCodecs_reserved_reserved.sqlType,
      codec: registryConfig_pgCodecs_reserved_reserved,
      uniques: uniques4,
      isVirtual: false,
      description: undefined,
      extensions: extensions130
    },
    reservedPatchs: {
      executor: executor_mainPgExecutor,
      name: "reservedPatchs",
      identifier: "main.a.reservedPatchs",
      from: registryConfig_pgCodecs_reservedPatchs_reservedPatchs.sqlType,
      codec: registryConfig_pgCodecs_reservedPatchs_reservedPatchs,
      uniques: uniques5,
      isVirtual: false,
      description: "`reservedPatchs` table should get renamed to ReservedPatchRecord to prevent clashes with ReservedPatch from `reserved` table",
      extensions: extensions131
    },
    reserved_input: {
      executor: executor_mainPgExecutor,
      name: "reserved_input",
      identifier: "main.a.reserved_input",
      from: registryConfig_pgCodecs_reservedInput_reservedInput.sqlType,
      codec: registryConfig_pgCodecs_reservedInput_reservedInput,
      uniques: uniques6,
      isVirtual: false,
      description: "`reserved_input` table should get renamed to ReservedInputRecord to prevent clashes with ReservedInput from `reserved` table",
      extensions: extensions132
    },
    default_value: {
      executor: executor_mainPgExecutor,
      name: "default_value",
      identifier: "main.a.default_value",
      from: registryConfig_pgCodecs_defaultValue_defaultValue.sqlType,
      codec: registryConfig_pgCodecs_defaultValue_defaultValue,
      uniques: uniques7,
      isVirtual: false,
      description: undefined,
      extensions: extensions133
    },
    no_primary_key: {
      executor: executor_mainPgExecutor,
      name: "no_primary_key",
      identifier: "main.a.no_primary_key",
      from: registryConfig_pgCodecs_noPrimaryKey_noPrimaryKey.sqlType,
      codec: registryConfig_pgCodecs_noPrimaryKey_noPrimaryKey,
      uniques: uniques8,
      isVirtual: false,
      description: undefined,
      extensions: extensions134
    },
    unique_foreign_key: registryConfig_pgResources_unique_foreign_key_unique_foreign_key,
    my_table: {
      executor: executor_mainPgExecutor,
      name: "my_table",
      identifier: "main.c.my_table",
      from: registryConfig_pgCodecs_myTable_myTable.sqlType,
      codec: registryConfig_pgCodecs_myTable_myTable,
      uniques: uniques10,
      isVirtual: false,
      description: undefined,
      extensions: extensions136
    },
    person_secret: registryConfig_pgResources_person_secret_person_secret,
    foreign_key: registryConfig_pgResources_foreign_key_foreign_key,
    testview: {
      executor: executor_mainPgExecutor,
      name: "testview",
      identifier: "main.a.testview",
      from: registryConfig_pgCodecs_testview_testview.sqlType,
      codec: registryConfig_pgCodecs_testview_testview,
      uniques: uniques13,
      isVirtual: false,
      description: undefined,
      extensions: extensions139
    },
    list_bde_mutation: {
      executor: executor_mainPgExecutor,
      name: "list_bde_mutation",
      identifier: "main.b.list_bde_mutation(_text,text,text)",
      from: fromCallback64,
      parameters: parameters64,
      isUnique: !false,
      codec: registryConfig_pgCodecs_uuidArray_uuidArray,
      uniques: [],
      isMutation: true,
      extensions: extensions140,
      description: undefined
    },
    view_table: {
      executor: executor_mainPgExecutor,
      name: "view_table",
      identifier: "main.a.view_table",
      from: registryConfig_pgCodecs_viewTable_viewTable.sqlType,
      codec: registryConfig_pgCodecs_viewTable_viewTable,
      uniques: uniques14,
      isVirtual: false,
      description: undefined,
      extensions: extensions141
    },
    compound_key: registryConfig_pgResources_compound_key_compound_key,
    similar_table_1: {
      executor: executor_mainPgExecutor,
      name: "similar_table_1",
      identifier: "main.a.similar_table_1",
      from: registryConfig_pgCodecs_similarTable1_similarTable1.sqlType,
      codec: registryConfig_pgCodecs_similarTable1_similarTable1,
      uniques: uniques16,
      isVirtual: false,
      description: undefined,
      extensions: extensions143
    },
    similar_table_2: {
      executor: executor_mainPgExecutor,
      name: "similar_table_2",
      identifier: "main.a.similar_table_2",
      from: registryConfig_pgCodecs_similarTable2_similarTable2.sqlType,
      codec: registryConfig_pgCodecs_similarTable2_similarTable2,
      uniques: uniques17,
      isVirtual: false,
      description: undefined,
      extensions: extensions144
    },
    updatable_view: {
      executor: executor_mainPgExecutor,
      name: "updatable_view",
      identifier: "main.b.updatable_view",
      from: registryConfig_pgCodecs_updatableView_updatableView.sqlType,
      codec: registryConfig_pgCodecs_updatableView_updatableView,
      uniques: uniques18,
      isVirtual: false,
      description: "YOYOYO!!",
      extensions: extensions145
    },
    null_test_record: {
      executor: executor_mainPgExecutor,
      name: "null_test_record",
      identifier: "main.c.null_test_record",
      from: registryConfig_pgCodecs_nullTestRecord_nullTestRecord.sqlType,
      codec: registryConfig_pgCodecs_nullTestRecord_nullTestRecord,
      uniques: uniques19,
      isVirtual: false,
      description: undefined,
      extensions: extensions146
    },
    edge_case_computed: {
      executor: executor_mainPgExecutor,
      name: "edge_case_computed",
      identifier: "main.c.edge_case_computed(c.edge_case)",
      from: fromCallback65,
      parameters: parameters65,
      isUnique: !false,
      codec: TYPES.text,
      uniques: [],
      isMutation: false,
      extensions: extensions147,
      description: undefined
    },
    return_table_without_grants: PgResource.functionResourceOptions(registryConfig_pgResources_compound_key_compound_key, options_return_table_without_grants),
    issue756: registryConfig_pgResources_issue756_issue756,
    edge_case: {
      executor: executor_mainPgExecutor,
      name: "edge_case",
      identifier: "main.c.edge_case",
      from: registryConfig_pgCodecs_edgeCase_edgeCase.sqlType,
      codec: registryConfig_pgCodecs_edgeCase_edgeCase,
      uniques: uniques21,
      isVirtual: false,
      description: undefined,
      extensions: extensions149
    },
    authenticate_fail: PgResource.functionResourceOptions(resourceConfig_jwt_token, options_authenticate_fail),
    authenticate: PgResource.functionResourceOptions(resourceConfig_jwt_token, options_authenticate),
    issue756_mutation: PgResource.functionResourceOptions(registryConfig_pgResources_issue756_issue756, options_issue756_mutation),
    issue756_set_mutation: PgResource.functionResourceOptions(registryConfig_pgResources_issue756_issue756, options_issue756_set_mutation),
    left_arm: registryConfig_pgResources_left_arm_left_arm,
    authenticate_many: PgResource.functionResourceOptions(resourceConfig_jwt_token, options_authenticate_many),
    types_mutation: {
      executor: executor_mainPgExecutor,
      name: "types_mutation",
      identifier: "main.c.types_mutation(int8,bool,varchar,_int4,json,c.floatrange)",
      from: fromCallback66,
      parameters: parameters66,
      isUnique: !false,
      codec: TYPES.boolean,
      uniques: [],
      isMutation: true,
      extensions: extensions152,
      description: undefined
    },
    types_query: {
      executor: executor_mainPgExecutor,
      name: "types_query",
      identifier: "main.c.types_query(int8,bool,varchar,_int4,json,c.floatrange)",
      from: fromCallback67,
      parameters: parameters67,
      isUnique: !false,
      codec: TYPES.boolean,
      uniques: [],
      isMutation: false,
      extensions: extensions153,
      description: undefined
    },
    left_arm_identity: PgResource.functionResourceOptions(registryConfig_pgResources_left_arm_left_arm, options_left_arm_identity),
    authenticate_payload: PgResource.functionResourceOptions(resourceConfig_auth_payload, options_authenticate_payload),
    compound_type_computed_field: {
      executor: executor_mainPgExecutor,
      name: "compound_type_computed_field",
      identifier: "main.c.compound_type_computed_field(c.compound_type)",
      from: fromCallback68,
      parameters: parameters68,
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: false,
      extensions: extensions155,
      description: undefined
    },
    func_out_out_compound_type: {
      executor: executor_mainPgExecutor,
      name: "func_out_out_compound_type",
      identifier: "main.c.func_out_out_compound_type(int4,int4,c.compound_type)",
      from: fromCallback69,
      parameters: parameters69,
      isUnique: !false,
      codec: registryConfig_pgCodecs_FuncOutOutCompoundTypeRecord_FuncOutOutCompoundTypeRecord,
      uniques: [],
      isMutation: false,
      extensions: extensions156,
      description: undefined
    },
    mutation_out_out_compound_type: {
      executor: executor_mainPgExecutor,
      name: "mutation_out_out_compound_type",
      identifier: "main.c.mutation_out_out_compound_type(int4,int4,c.compound_type)",
      from: fromCallback70,
      parameters: parameters70,
      isUnique: !false,
      codec: registryConfig_pgCodecs_MutationOutOutCompoundTypeRecord_MutationOutOutCompoundTypeRecord,
      uniques: [],
      isMutation: true,
      extensions: extensions157,
      description: undefined
    },
    compound_type_set_query: PgResource.functionResourceOptions(resourceConfig_compound_type, options_compound_type_set_query),
    compound_type_mutation: PgResource.functionResourceOptions(resourceConfig_compound_type, options_compound_type_mutation),
    compound_type_query: PgResource.functionResourceOptions(resourceConfig_compound_type, options_compound_type_query),
    compound_type_set_mutation: PgResource.functionResourceOptions(resourceConfig_compound_type, options_compound_type_set_mutation),
    mutation_compound_type_array: PgResource.functionResourceOptions(resourceConfig_compound_type, options_mutation_compound_type_array),
    query_compound_type_array: PgResource.functionResourceOptions(resourceConfig_compound_type, options_query_compound_type_array),
    compound_type_array_mutation: PgResource.functionResourceOptions(resourceConfig_compound_type, options_compound_type_array_mutation),
    compound_type_array_query: PgResource.functionResourceOptions(resourceConfig_compound_type, options_compound_type_array_query),
    post_computed_interval_set: {
      executor: executor_mainPgExecutor,
      name: "post_computed_interval_set",
      identifier: "main.a.post_computed_interval_set(a.post)",
      from: fromCallback71,
      parameters: parameters71,
      isUnique: !true,
      codec: TYPES.interval,
      uniques: [],
      isMutation: false,
      extensions: extensions159,
      description: undefined
    },
    post_computed_interval_array: {
      executor: executor_mainPgExecutor,
      name: "post_computed_interval_array",
      identifier: "main.a.post_computed_interval_array(a.post)",
      from: fromCallback72,
      parameters: parameters72,
      isUnique: !false,
      codec: registryConfig_pgCodecs_intervalArray_intervalArray,
      uniques: [],
      isMutation: false,
      extensions: extensions160,
      description: undefined
    },
    post_computed_text_array: {
      executor: executor_mainPgExecutor,
      name: "post_computed_text_array",
      identifier: "main.a.post_computed_text_array(a.post)",
      from: fromCallback73,
      parameters: parameters73,
      isUnique: !false,
      codec: registryConfig_pgCodecs_textArray_textArray,
      uniques: [],
      isMutation: false,
      extensions: extensions161,
      description: undefined
    },
    post_computed_with_optional_arg: {
      executor: executor_mainPgExecutor,
      name: "post_computed_with_optional_arg",
      identifier: "main.a.post_computed_with_optional_arg(a.post,int4)",
      from: fromCallback74,
      parameters: parameters74,
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: false,
      extensions: extensions162,
      description: undefined
    },
    post_computed_with_required_arg: {
      executor: executor_mainPgExecutor,
      name: "post_computed_with_required_arg",
      identifier: "main.a.post_computed_with_required_arg(a.post,int4)",
      from: fromCallback75,
      parameters: parameters75,
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: false,
      extensions: extensions163,
      description: undefined
    },
    post_headline_trimmed: {
      executor: executor_mainPgExecutor,
      name: "post_headline_trimmed",
      identifier: "main.a.post_headline_trimmed(a.post,int4,text)",
      from: fromCallback76,
      parameters: parameters76,
      isUnique: !false,
      codec: TYPES.text,
      uniques: [],
      isMutation: false,
      extensions: extensions164,
      description: undefined
    },
    post_headline_trimmed_no_defaults: {
      executor: executor_mainPgExecutor,
      name: "post_headline_trimmed_no_defaults",
      identifier: "main.a.post_headline_trimmed_no_defaults(a.post,int4,text)",
      from: fromCallback77,
      parameters: parameters77,
      isUnique: !false,
      codec: TYPES.text,
      uniques: [],
      isMutation: false,
      extensions: extensions165,
      description: undefined
    },
    post_headline_trimmed_strict: {
      executor: executor_mainPgExecutor,
      name: "post_headline_trimmed_strict",
      identifier: "main.a.post_headline_trimmed_strict(a.post,int4,text)",
      from: fromCallback78,
      parameters: parameters78,
      isUnique: !false,
      codec: TYPES.text,
      uniques: [],
      isMutation: false,
      extensions: extensions166,
      description: undefined
    },
    query_output_two_rows: {
      executor: executor_mainPgExecutor,
      name: "query_output_two_rows",
      identifier: "main.c.query_output_two_rows(int4,int4,text,c.left_arm,a.post)",
      from: fromCallback79,
      parameters: parameters79,
      isUnique: !false,
      codec: registryConfig_pgCodecs_QueryOutputTwoRowsRecord_QueryOutputTwoRowsRecord,
      uniques: [],
      isMutation: false,
      extensions: extensions167,
      description: undefined
    },
    post: registryConfig_pgResources_post_post,
    post_computed_compound_type_array: PgResource.functionResourceOptions(resourceConfig_compound_type, options_post_computed_compound_type_array),
    table_mutation: PgResource.functionResourceOptions(registryConfig_pgResources_post_post, options_table_mutation),
    table_query: PgResource.functionResourceOptions(registryConfig_pgResources_post_post, options_table_query),
    post_with_suffix: PgResource.functionResourceOptions(registryConfig_pgResources_post_post, options_post_with_suffix),
    post_many: PgResource.functionResourceOptions(registryConfig_pgResources_post_post, options_post_many),
    person_computed_out: {
      executor: executor_mainPgExecutor,
      name: "person_computed_out",
      identifier: "main.c.person_computed_out(c.person,text)",
      from: fromCallback80,
      parameters: parameters80,
      isUnique: !false,
      codec: TYPES.text,
      uniques: [],
      isMutation: false,
      extensions: extensions169,
      description: undefined
    },
    person_first_name: {
      executor: executor_mainPgExecutor,
      name: "person_first_name",
      identifier: "main.c.person_first_name(c.person)",
      from: fromCallback81,
      parameters: parameters81,
      isUnique: !false,
      codec: TYPES.text,
      uniques: [],
      isMutation: false,
      extensions: extensions170,
      description: "The first name of the person."
    },
    person_computed_out_out: {
      executor: executor_mainPgExecutor,
      name: "person_computed_out_out",
      identifier: "main.c.person_computed_out_out(c.person,text,text)",
      from: fromCallback82,
      parameters: parameters82,
      isUnique: !false,
      codec: registryConfig_pgCodecs_PersonComputedOutOutRecord_PersonComputedOutOutRecord,
      uniques: [],
      isMutation: false,
      extensions: extensions171,
      description: undefined
    },
    person_computed_inout: {
      executor: executor_mainPgExecutor,
      name: "person_computed_inout",
      identifier: "main.c.person_computed_inout(c.person,text)",
      from: fromCallback83,
      parameters: parameters83,
      isUnique: !false,
      codec: TYPES.text,
      uniques: [],
      isMutation: false,
      extensions: extensions172,
      description: undefined
    },
    person_computed_inout_out: {
      executor: executor_mainPgExecutor,
      name: "person_computed_inout_out",
      identifier: "main.c.person_computed_inout_out(c.person,text,text)",
      from: fromCallback84,
      parameters: parameters84,
      isUnique: !false,
      codec: registryConfig_pgCodecs_PersonComputedInoutOutRecord_PersonComputedInoutOutRecord,
      uniques: [],
      isMutation: false,
      extensions: extensions173,
      description: undefined
    },
    person_exists: {
      executor: executor_mainPgExecutor,
      name: "person_exists",
      identifier: "main.c.person_exists(c.person,b.email)",
      from: fromCallback85,
      parameters: parameters85,
      isUnique: !false,
      codec: TYPES.boolean,
      uniques: [],
      isMutation: false,
      extensions: extensions174,
      description: undefined
    },
    person_computed_first_arg_inout_out: {
      executor: executor_mainPgExecutor,
      name: "person_computed_first_arg_inout_out",
      identifier: "main.c.person_computed_first_arg_inout_out(c.person,int4)",
      from: fromCallback86,
      parameters: parameters86,
      isUnique: !false,
      codec: registryConfig_pgCodecs_PersonComputedFirstArgInoutOutRecord_PersonComputedFirstArgInoutOutRecord,
      uniques: [],
      isMutation: false,
      extensions: extensions175,
      description: undefined
    },
    func_out_complex: {
      executor: executor_mainPgExecutor,
      name: "func_out_complex",
      identifier: "main.c.func_out_complex(int4,text,int4,c.compound_type,c.person)",
      from: fromCallback87,
      parameters: parameters87,
      isUnique: !false,
      codec: registryConfig_pgCodecs_FuncOutComplexRecord_FuncOutComplexRecord,
      uniques: [],
      isMutation: false,
      extensions: extensions176,
      description: undefined
    },
    func_out_complex_setof: {
      executor: executor_mainPgExecutor,
      name: "func_out_complex_setof",
      identifier: "main.c.func_out_complex_setof(int4,text,int4,c.compound_type,c.person)",
      from: fromCallback88,
      parameters: parameters88,
      isUnique: !true,
      codec: registryConfig_pgCodecs_FuncOutComplexSetofRecord_FuncOutComplexSetofRecord,
      uniques: [],
      isMutation: false,
      extensions: extensions177,
      description: undefined
    },
    mutation_out_complex: {
      executor: executor_mainPgExecutor,
      name: "mutation_out_complex",
      identifier: "main.c.mutation_out_complex(int4,text,int4,c.compound_type,c.person)",
      from: fromCallback89,
      parameters: parameters89,
      isUnique: !false,
      codec: registryConfig_pgCodecs_MutationOutComplexRecord_MutationOutComplexRecord,
      uniques: [],
      isMutation: true,
      extensions: extensions178,
      description: undefined
    },
    mutation_out_complex_setof: {
      executor: executor_mainPgExecutor,
      name: "mutation_out_complex_setof",
      identifier: "main.c.mutation_out_complex_setof(int4,text,int4,c.compound_type,c.person)",
      from: fromCallback90,
      parameters: parameters90,
      isUnique: !true,
      codec: registryConfig_pgCodecs_MutationOutComplexSetofRecord_MutationOutComplexSetofRecord,
      uniques: [],
      isMutation: true,
      extensions: extensions179,
      description: undefined
    },
    person_computed_complex: {
      executor: executor_mainPgExecutor,
      name: "person_computed_complex",
      identifier: "main.c.person_computed_complex(c.person,int4,text,int4,c.compound_type,c.person)",
      from: fromCallback91,
      parameters: parameters91,
      isUnique: !false,
      codec: registryConfig_pgCodecs_PersonComputedComplexRecord_PersonComputedComplexRecord,
      uniques: [],
      isMutation: false,
      extensions: extensions180,
      description: undefined
    },
    person: registryConfig_pgResources_person_person,
    person_first_post: PgResource.functionResourceOptions(registryConfig_pgResources_post_post, options_person_first_post),
    badly_behaved_function: PgResource.functionResourceOptions(registryConfig_pgResources_person_person, options_badly_behaved_function),
    func_out_table: PgResource.functionResourceOptions(registryConfig_pgResources_person_person, options_func_out_table),
    func_out_table_setof: PgResource.functionResourceOptions(registryConfig_pgResources_person_person, options_func_out_table_setof),
    mutation_out_table: PgResource.functionResourceOptions(registryConfig_pgResources_person_person, options_mutation_out_table),
    mutation_out_table_setof: PgResource.functionResourceOptions(registryConfig_pgResources_person_person, options_mutation_out_table_setof),
    table_set_mutation: PgResource.functionResourceOptions(registryConfig_pgResources_person_person, options_table_set_mutation),
    table_set_query: PgResource.functionResourceOptions(registryConfig_pgResources_person_person, options_table_set_query),
    table_set_query_plpgsql: PgResource.functionResourceOptions(registryConfig_pgResources_person_person, options_table_set_query_plpgsql),
    person_computed_first_arg_inout: PgResource.functionResourceOptions(registryConfig_pgResources_person_person, options_person_computed_first_arg_inout),
    person_friends: PgResource.functionResourceOptions(registryConfig_pgResources_person_person, options_person_friends),
    types: registryConfig_pgResources_types_types,
    type_function_connection: PgResource.functionResourceOptions(registryConfig_pgResources_types_types, options_type_function_connection),
    type_function_connection_mutation: PgResource.functionResourceOptions(registryConfig_pgResources_types_types, options_type_function_connection_mutation),
    type_function: PgResource.functionResourceOptions(registryConfig_pgResources_types_types, options_type_function),
    type_function_mutation: PgResource.functionResourceOptions(registryConfig_pgResources_types_types, options_type_function_mutation),
    person_type_function_connection: PgResource.functionResourceOptions(registryConfig_pgResources_types_types, options_person_type_function_connection),
    person_type_function: PgResource.functionResourceOptions(registryConfig_pgResources_types_types, options_person_type_function),
    type_function_list: PgResource.functionResourceOptions(registryConfig_pgResources_types_types, options_type_function_list),
    type_function_list_mutation: PgResource.functionResourceOptions(registryConfig_pgResources_types_types, options_type_function_list_mutation),
    person_type_function_list: PgResource.functionResourceOptions(registryConfig_pgResources_types_types, options_person_type_function_list)
  }),
  pgRelations: Object.assign(Object.create(null), {
    foreignKey: Object.assign(Object.create(null), {
      compoundKeyByMyCompoundKey1AndCompoundKey2: {
        localCodec: registryConfig_pgCodecs_foreignKey_foreignKey,
        remoteResourceOptions: registryConfig_pgResources_compound_key_compound_key,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["compound_key_1", "compound_key_2"],
        remoteAttributes: ["person_id_1", "person_id_2"],
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
        localCodec: registryConfig_pgCodecs_foreignKey_foreignKey,
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
    post: Object.assign(Object.create(null), {
      personByMyAuthorId: {
        localCodec: attributes_post_codec_post,
        remoteResourceOptions: registryConfig_pgResources_person_person,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["author_id"],
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
      typesByTheirSmallint: {
        localCodec: attributes_post_codec_post,
        remoteResourceOptions: registryConfig_pgResources_types_types,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["smallint"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      typesByTheirId: {
        localCodec: attributes_post_codec_post,
        remoteResourceOptions: registryConfig_pgResources_types_types,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["id"],
        isUnique: true,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      }
    }),
    uniqueForeignKey: Object.assign(Object.create(null), {
      compoundKeyByMyCompoundKey1AndCompoundKey2: {
        localCodec: registryConfig_pgCodecs_uniqueForeignKey_uniqueForeignKey,
        remoteResourceOptions: registryConfig_pgResources_compound_key_compound_key,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["compound_key_1", "compound_key_2"],
        remoteAttributes: ["person_id_1", "person_id_2"],
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
    authPayload: Object.assign(Object.create(null), {
      personByMyId: {
        localCodec: registryConfig_pgCodecs_authPayload_authPayload,
        remoteResourceOptions: registryConfig_pgResources_person_person,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
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
    types: Object.assign(Object.create(null), {
      postByMySmallint: {
        localCodec: registryConfig_pgCodecs_types_types,
        remoteResourceOptions: registryConfig_pgResources_post_post,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["smallint"],
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
      postByMyId: {
        localCodec: registryConfig_pgCodecs_types_types,
        remoteResourceOptions: registryConfig_pgResources_post_post,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
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
    compoundKey: Object.assign(Object.create(null), {
      personByMyPersonId1: {
        localCodec: registryConfig_pgCodecs_compoundKey_compoundKey,
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
        localCodec: registryConfig_pgCodecs_compoundKey_compoundKey,
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
      },
      foreignKeysByTheirCompoundKey1AndCompoundKey2: {
        localCodec: registryConfig_pgCodecs_compoundKey_compoundKey,
        remoteResourceOptions: registryConfig_pgResources_foreign_key_foreign_key,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["person_id_1", "person_id_2"],
        remoteAttributes: ["compound_key_1", "compound_key_2"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      uniqueForeignKeyByTheirCompoundKey1AndCompoundKey2: {
        localCodec: registryConfig_pgCodecs_compoundKey_compoundKey,
        remoteResourceOptions: registryConfig_pgResources_unique_foreign_key_unique_foreign_key,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["person_id_1", "person_id_2"],
        remoteAttributes: ["compound_key_1", "compound_key_2"],
        isUnique: true,
        isReferencee: true,
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
        localCodec: registryConfig_pgCodecs_leftArm_leftArm,
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
      postsByTheirAuthorId: {
        localCodec: attributes_person_codec_person,
        remoteResourceOptions: registryConfig_pgResources_post_post,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["author_id"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      foreignKeysByTheirPersonId: {
        localCodec: attributes_person_codec_person,
        remoteResourceOptions: registryConfig_pgResources_foreign_key_foreign_key,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["person_id"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      personSecretByTheirPersonId: {
        localCodec: attributes_person_codec_person,
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
        localCodec: attributes_person_codec_person,
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
        localCodec: attributes_person_codec_person,
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
        localCodec: attributes_person_codec_person,
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
    }),
    personSecret: Object.assign(Object.create(null), {
      personByMyPersonId: {
        localCodec: registryConfig_pgCodecs_personSecret_personSecret,
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
const pgResource_person_secretPgResource = registry.pgResources["person_secret"];
const pgResource_left_armPgResource = registry.pgResources["left_arm"];
const pgResource_postPgResource = registry.pgResources["post"];
const pgResource_personPgResource = registry.pgResources["person"];
const nodeIdHandlerByTypeName = Object.assign(Object.create(null), {
  Query: handler,
  PersonSecret: {
    typeName: "PersonSecret",
    codec: nodeIdCodecs_base64JSON_base64JSON,
    deprecationReason: "This is deprecated (comment on table c.person_secret).",
    plan($record) {
      return list([constant("person_secrets", false), $record.get("person_id")]);
    },
    getSpec($list) {
      return {
        person_id: access($list, [1])
      };
    },
    get(spec) {
      return pgResource_person_secretPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "person_secrets";
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
        id: access($list, [1])
      };
    },
    get(spec) {
      return pgResource_left_armPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "left_arms";
    }
  },
  Post: {
    typeName: "Post",
    codec: nodeIdCodecs_base64JSON_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("posts", false), $record.get("id")]);
    },
    getSpec($list) {
      return {
        id: access($list, [1])
      };
    },
    get(spec) {
      return pgResource_postPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "posts";
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
        id: access($list, [1])
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
const resource_return_table_without_grantsPgResource = registry.pgResources["return_table_without_grants"];
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
})(nodeIdHandlerByTypeName.PersonSecret);
const fetcher2 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName.LeftArm);
const fetcher3 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName.Post);
const fetcher4 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName.Person);
function Query_allPersonSecrets_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allPersonSecrets_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Query_allPersonSecrets_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allPersonSecrets_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Query_allPersonSecrets_after_applyPlan(_, $connection, val) {
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
function Query_allLeftArms_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allLeftArms_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Query_allLeftArms_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allLeftArms_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Query_allLeftArms_after_applyPlan(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
function Query_allPosts_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allPosts_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Query_allPosts_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allPosts_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Query_allPosts_after_applyPlan(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
function Query_allPeople_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allPeople_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Query_allPeople_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allPeople_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Query_allPeople_after_applyPlan(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
const resource_frmcdc_wrappedUrlPgResource = registry.pgResources["frmcdc_wrappedUrl"];
function Person_postsByAuthorId_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Person_postsByAuthorId_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Person_postsByAuthorId_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Person_postsByAuthorId_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Person_postsByAuthorId_after_applyPlan(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
function PostsConnection_nodesPlan($connection) {
  return $connection.nodes();
}
function PostsConnection_edgesPlan($connection) {
  return $connection.edges();
}
function PostsConnection_pageInfoPlan($connection) {
  // TYPES: why is this a TypeScript issue without the 'any'?
  return $connection.pageInfo();
}
function PageInfo_hasNextPagePlan($pageInfo) {
  return $pageInfo.hasNextPage();
}
function PageInfo_hasPreviousPagePlan($pageInfo) {
  return $pageInfo.hasPreviousPage();
}
function PersonSecretsConnection_nodesPlan($connection) {
  return $connection.nodes();
}
function PersonSecretsConnection_edgesPlan($connection) {
  return $connection.edges();
}
function PersonSecretsConnection_pageInfoPlan($connection) {
  // TYPES: why is this a TypeScript issue without the 'any'?
  return $connection.pageInfo();
}
function LeftArmsConnection_nodesPlan($connection) {
  return $connection.nodes();
}
function LeftArmsConnection_edgesPlan($connection) {
  return $connection.edges();
}
function LeftArmsConnection_pageInfoPlan($connection) {
  // TYPES: why is this a TypeScript issue without the 'any'?
  return $connection.pageInfo();
}
function PeopleConnection_nodesPlan($connection) {
  return $connection.nodes();
}
function PeopleConnection_edgesPlan($connection) {
  return $connection.edges();
}
function PeopleConnection_pageInfoPlan($connection) {
  // TYPES: why is this a TypeScript issue without the 'any'?
  return $connection.pageInfo();
}
const argDetailsSimple3 = [{
  graphqlArgName: "leftArm",
  postgresArgName: "left_arm",
  pgCodec: registryConfig_pgCodecs_leftArm_leftArm,
  required: true,
  fetcher: null
}];
const makeArgs3 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 1; i++) {
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
const resource_left_arm_identityPgResource = registry.pgResources["left_arm_identity"];
function Mutation_leftArmIdentity_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_createPersonSecret_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_createLeftArm_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_createPerson_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.LeftArm, $nodeId);
};
function Mutation_updateLeftArm_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updateLeftArmById_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updateLeftArmByPersonId_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs2 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Person, $nodeId);
};
function Mutation_updatePerson_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updatePersonById_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updatePersonByEmail_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs3 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.PersonSecret, $nodeId);
};
function Mutation_deletePersonSecret_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deletePersonSecretByPersonId_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs4 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.LeftArm, $nodeId);
};
function Mutation_deleteLeftArm_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deleteLeftArmById_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deleteLeftArmByPersonId_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs5 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Person, $nodeId);
};
function Mutation_deletePerson_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deletePersonById_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deletePersonByEmail_input_applyPlan(_, $object) {
  return $object;
}
function LeftArmIdentityPayload_clientMutationIdPlan($object) {
  return $object.getStepForKey("clientMutationId", true) ?? constant(undefined);
}
function LeftArmIdentityPayload_queryPlan() {
  return rootValue();
}
function LeftArmIdentityInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function CreatePersonSecretPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function CreatePersonSecretPayload_personSecretPlan($object) {
  return $object.get("result");
}
function CreatePersonSecretPayload_queryPlan() {
  return rootValue();
}
function CreatePersonSecretInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function CreatePersonSecretInput_personSecret_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function CreateLeftArmPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function CreateLeftArmPayload_leftArmPlan($object) {
  return $object.get("result");
}
function CreateLeftArmPayload_queryPlan() {
  return rootValue();
}
function CreateLeftArmInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function CreateLeftArmInput_leftArm_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function CreatePersonPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function CreatePersonPayload_personPlan($object) {
  return $object.get("result");
}
function CreatePersonPayload_queryPlan() {
  return rootValue();
}
function CreatePersonInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function CreatePersonInput_person_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateLeftArmPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function UpdateLeftArmPayload_leftArmPlan($object) {
  return $object.get("result");
}
function UpdateLeftArmPayload_queryPlan() {
  return rootValue();
}
function UpdateLeftArmInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateLeftArmInput_leftArmPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateLeftArmByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateLeftArmByIdInput_leftArmPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateLeftArmByPersonIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateLeftArmByPersonIdInput_leftArmPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdatePersonPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function UpdatePersonPayload_personPlan($object) {
  return $object.get("result");
}
function UpdatePersonPayload_queryPlan() {
  return rootValue();
}
function UpdatePersonInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdatePersonInput_personPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdatePersonByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdatePersonByIdInput_personPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdatePersonByEmailInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdatePersonByEmailInput_personPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function DeletePersonSecretPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function DeletePersonSecretPayload_personSecretPlan($object) {
  return $object.get("result");
}
function DeletePersonSecretPayload_queryPlan() {
  return rootValue();
}
function DeletePersonSecretInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeletePersonSecretByPersonIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteLeftArmPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function DeleteLeftArmPayload_leftArmPlan($object) {
  return $object.get("result");
}
function DeleteLeftArmPayload_queryPlan() {
  return rootValue();
}
function DeleteLeftArmInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteLeftArmByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteLeftArmByPersonIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeletePersonPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function DeletePersonPayload_personPlan($object) {
  return $object.get("result");
}
function DeletePersonPayload_queryPlan() {
  return rootValue();
}
function DeletePersonInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeletePersonByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeletePersonByEmailInput_clientMutationId_applyPlan($input, val) {
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

  """Get a single \`PersonSecret\`."""
  personSecretByPersonId(personId: Int!): PersonSecret @deprecated(reason: "This is deprecated (comment on table c.person_secret).")

  """Get a single \`LeftArm\`."""
  leftArmById(id: Int!): LeftArm

  """Get a single \`LeftArm\`."""
  leftArmByPersonId(personId: Int!): LeftArm

  """Get a single \`Post\`."""
  postById(id: Int!): Post

  """Get a single \`Person\`."""
  personById(id: Int!): Person

  """Get a single \`Person\`."""
  personByEmail(email: Email!): Person
  currentUserId: Int
  returnTableWithoutGrants: CompoundKey

  """Reads a single \`PersonSecret\` using its globally unique \`ID\`."""
  personSecret(
    """
    The globally unique \`ID\` to be used in selecting a single \`PersonSecret\`.
    """
    nodeId: ID!
  ): PersonSecret @deprecated(reason: "This is deprecated (comment on table c.person_secret).")

  """Reads a single \`LeftArm\` using its globally unique \`ID\`."""
  leftArm(
    """The globally unique \`ID\` to be used in selecting a single \`LeftArm\`."""
    nodeId: ID!
  ): LeftArm

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

    """The method to use when ordering \`Post\`."""
    orderBy: [PostsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: PostCondition
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

    """The method to use when ordering \`Post\`."""
    orderBy: [PostsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: PostCondition
  ): PostsConnection!

  """This \`Person\`'s \`PersonSecret\`."""
  personSecretByPersonId: PersonSecret @deprecated(reason: "This is deprecated (comment on table c.person_secret).")

  """Reads a single \`LeftArm\` that is related to this \`Person\`."""
  leftArmByPersonId: LeftArm
}

scalar Email

type WrappedUrl {
  url: NotNullUrl!
}

scalar NotNullUrl

"""
A set of key/value pairs, keys are strings, values may be a string or null. Exposed as a JSON object.
"""
scalar KeyValueHash

"""An IPv4 or IPv6 host address, and optionally its subnet."""
scalar InternetAddress

"""
A point in time as described by the [ISO
8601](https://en.wikipedia.org/wiki/ISO_8601) and, if it has a timezone, [RFC
3339](https://datatracker.ietf.org/doc/html/rfc3339) standards. Input values
that do not conform to both ISO 8601 and RFC 3339 may be coerced, which may lead
to unexpected results.
"""
scalar Datetime

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

type Post implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  headline: String!
  body: String
  authorId: Int

  """Reads a single \`Person\` that is related to this \`Post\`."""
  personByAuthorId: Person
}

"""A \`Post\` edge in the connection."""
type PostsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Post\` at the end of the edge."""
  node: Post
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

"""Methods to use when ordering \`Post\`."""
enum PostsOrderBy {
  NATURAL
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
}

"""Tracks metadata about the left arms of various people"""
type LeftArm implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  personId: Int!
  lengthInMetres: Float
  mood: String!

  """Reads a single \`Person\` that is related to this \`LeftArm\`."""
  personByPersonId: Person
}

type CompoundKey {
  personId2: Int!
  personId1: Int!
  extra: Boolean

  """Reads a single \`Person\` that is related to this \`CompoundKey\`."""
  personByPersonId1: Person

  """Reads a single \`Person\` that is related to this \`CompoundKey\`."""
  personByPersonId2: Person
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
}

"""An input for mutations affecting \`WrappedUrl\`"""
input WrappedUrlInput {
  url: NotNullUrl!
}

"""
The root mutation type which contains root level fields which mutate data.
"""
type Mutation {
  leftArmIdentity(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: LeftArmIdentityInput!
  ): LeftArmIdentityPayload

  """Creates a single \`PersonSecret\`."""
  createPersonSecret(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreatePersonSecretInput!
  ): CreatePersonSecretPayload @deprecated(reason: "This is deprecated (comment on table c.person_secret).")

  """Creates a single \`LeftArm\`."""
  createLeftArm(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateLeftArmInput!
  ): CreateLeftArmPayload

  """Creates a single \`Person\`."""
  createPerson(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreatePersonInput!
  ): CreatePersonPayload

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
  """A secret held by the associated Person"""
  secret: String
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
  lengthInMetres: Float
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
  """The person’s name"""
  name: String!
  aliases: [String]
  about: String
  email: Email!
  site: WrappedUrlInput
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
  """The person’s name"""
  name: String
  aliases: [String]
  about: String
  email: Email
  site: WrappedUrlInput
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
    postById: {
      plan(_$root, args) {
        return pgResource_postPgResource.get({
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
    returnTableWithoutGrants($root, args, _info) {
      const selectArgs = makeArgs2(args);
      return resource_return_table_without_grantsPgResource.execute(selectArgs);
    },
    personSecret: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    leftArm: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher2($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    post: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher3($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    person: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher4($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    allPersonSecrets: {
      plan() {
        return connection(pgResource_person_secretPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allPersonSecrets_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allPersonSecrets_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allPersonSecrets_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allPersonSecrets_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allPersonSecrets_after_applyPlan
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
    allLeftArms: {
      plan() {
        return connection(pgResource_left_armPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allLeftArms_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allLeftArms_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allLeftArms_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allLeftArms_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allLeftArms_after_applyPlan
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
    allPosts: {
      plan() {
        return connection(pgResource_postPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allPosts_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allPosts_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allPosts_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allPosts_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allPosts_after_applyPlan
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("PostsOrderBy"));
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
          applyPlan: Query_allPeople_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allPeople_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allPeople_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allPeople_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allPeople_after_applyPlan
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
    postsByAuthorId: {
      plan($record) {
        const $records = pgResource_postPgResource.find({
          author_id: $record.get("id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan: Person_postsByAuthorId_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Person_postsByAuthorId_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Person_postsByAuthorId_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Person_postsByAuthorId_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Person_postsByAuthorId_after_applyPlan
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("PostsOrderBy"));
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
    personSecretByPersonId($record) {
      return pgResource_person_secretPgResource.get({
        person_id: $record.get("id")
      });
    },
    leftArmByPersonId($record) {
      return pgResource_left_armPgResource.get({
        person_id: $record.get("id")
      });
    }
  },
  WrappedUrl: {
    __assertStep: assertPgClassSingleStep,
    url($record) {
      return $record.get("url");
    }
  },
  PostsConnection: {
    __assertStep: ConnectionStep,
    nodes: PostsConnection_nodesPlan,
    edges: PostsConnection_edgesPlan,
    pageInfo: PostsConnection_pageInfoPlan,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  Post: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.Post.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Post.codec.name].encode);
    },
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
    personByAuthorId($record) {
      return pgResource_personPgResource.get({
        id: $record.get("author_id")
      });
    }
  },
  PostsEdge: {
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
  PostsOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        uniques26[0].attributes.forEach(attributeName => {
          const attribute = attributes_post_codec_post.attributes[attributeName];
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
        uniques26[0].attributes.forEach(attributeName => {
          const attribute = attributes_post_codec_post.attributes[attributeName];
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
    HEADLINE_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "headline",
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
    HEADLINE_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "headline",
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
    BODY_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "body",
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
    BODY_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "body",
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
    AUTHOR_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "author_id",
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
    AUTHOR_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "author_id",
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
  PostCondition: {
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes39.id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    headline: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "headline",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "headline",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes39.headline.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    body: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "body",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "body",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes39.body.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    authorId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "author_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "author_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes39.author_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
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
  CompoundKey: {
    __assertStep: assertPgClassSingleStep,
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
  PersonSecretsConnection: {
    __assertStep: ConnectionStep,
    nodes: PersonSecretsConnection_nodesPlan,
    edges: PersonSecretsConnection_edgesPlan,
    pageInfo: PersonSecretsConnection_pageInfoPlan,
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
        uniques11[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_personSecret_personSecret.attributes[attributeName];
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
        uniques11[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_personSecret_personSecret.attributes[attributeName];
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes22.person_id.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes22.sekrit.codec)}`;
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
    nodes: LeftArmsConnection_nodesPlan,
    edges: LeftArmsConnection_edgesPlan,
    pageInfo: LeftArmsConnection_pageInfoPlan,
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
        uniques23[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_leftArm_leftArm.attributes[attributeName];
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
        uniques23[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_leftArm_leftArm.attributes[attributeName];
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes33.id.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes33.person_id.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes33.length_in_metres.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes33.mood.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  PeopleConnection: {
    __assertStep: ConnectionStep,
    nodes: PeopleConnection_nodesPlan,
    edges: PeopleConnection_edgesPlan,
    pageInfo: PeopleConnection_pageInfoPlan,
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
  PeopleOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        uniques27[0].attributes.forEach(attributeName => {
          const attribute = attributes_person_codec_person.attributes[attributeName];
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
        uniques27[0].attributes.forEach(attributeName => {
          const attribute = attributes_person_codec_person.attributes[attributeName];
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
        if (false) {
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
        if (false) {
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes44.id.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes44.person_full_name.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes44.aliases.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes44.about.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes44.email.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes44.site.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes44.config.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes44.last_login_from_ip.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes44.last_login_from_subnet.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes44.user_mac.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes44.created_at.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  WrappedUrlInput: {
    url: {
      applyPlan($insert, val) {
        $insert.set("url", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  Mutation: {
    __assertStep: __ValueStep,
    leftArmIdentity: {
      plan($root, args, _info) {
        const selectArgs = makeArgs3(args, ["input"]);
        const $result = resource_left_arm_identityPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan: Mutation_leftArmIdentity_input_applyPlan
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
          applyPlan: Mutation_createPersonSecret_input_applyPlan
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
          applyPlan: Mutation_createLeftArm_input_applyPlan
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
          applyPlan: Mutation_createPerson_input_applyPlan
        }
      }
    },
    updateLeftArm: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_left_armPgResource, specFromArgs(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_updateLeftArm_input_applyPlan
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
          applyPlan: Mutation_updateLeftArmById_input_applyPlan
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
          applyPlan: Mutation_updateLeftArmByPersonId_input_applyPlan
        }
      }
    },
    updatePerson: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_personPgResource, specFromArgs2(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_updatePerson_input_applyPlan
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
          applyPlan: Mutation_updatePersonById_input_applyPlan
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
          applyPlan: Mutation_updatePersonByEmail_input_applyPlan
        }
      }
    },
    deletePersonSecret: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_person_secretPgResource, specFromArgs3(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_deletePersonSecret_input_applyPlan
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
          applyPlan: Mutation_deletePersonSecretByPersonId_input_applyPlan
        }
      }
    },
    deleteLeftArm: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_left_armPgResource, specFromArgs4(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_deleteLeftArm_input_applyPlan
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
          applyPlan: Mutation_deleteLeftArmById_input_applyPlan
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
          applyPlan: Mutation_deleteLeftArmByPersonId_input_applyPlan
        }
      }
    },
    deletePerson: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_personPgResource, specFromArgs5(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_deletePerson_input_applyPlan
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
          applyPlan: Mutation_deletePersonById_input_applyPlan
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
          applyPlan: Mutation_deletePersonByEmail_input_applyPlan
        }
      }
    }
  },
  LeftArmIdentityPayload: {
    __assertStep: ObjectStep,
    clientMutationId: LeftArmIdentityPayload_clientMutationIdPlan,
    leftArm($object) {
      return $object.get("result");
    },
    query: LeftArmIdentityPayload_queryPlan,
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
            const spec = uniques23[0].attributes.reduce((memo, attributeName) => {
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
      applyPlan: LeftArmIdentityInput_clientMutationId_applyPlan,
      autoApplyAfterParentApplyPlan: true
    },
    leftArm: undefined
  },
  LeftArmBaseInput: {
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
  CreatePersonSecretPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId: CreatePersonSecretPayload_clientMutationIdPlan,
    personSecret: CreatePersonSecretPayload_personSecretPlan,
    query: CreatePersonSecretPayload_queryPlan,
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
            const spec = uniques11[0].attributes.reduce((memo, attributeName) => {
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
    personByPersonId($record) {
      return pgResource_personPgResource.get({
        id: $record.get("result").get("person_id")
      });
    }
  },
  CreatePersonSecretInput: {
    clientMutationId: {
      applyPlan: CreatePersonSecretInput_clientMutationId_applyPlan,
      autoApplyAfterParentApplyPlan: true
    },
    personSecret: {
      applyPlan: CreatePersonSecretInput_personSecret_applyPlan,
      autoApplyAfterParentApplyPlan: true
    }
  },
  PersonSecretInput: {
    secret: {
      applyPlan($insert, val) {
        $insert.set("sekrit", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreateLeftArmPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId: CreateLeftArmPayload_clientMutationIdPlan,
    leftArm: CreateLeftArmPayload_leftArmPlan,
    query: CreateLeftArmPayload_queryPlan,
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
            const spec = uniques23[0].attributes.reduce((memo, attributeName) => {
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
      applyPlan: CreateLeftArmInput_clientMutationId_applyPlan,
      autoApplyAfterParentApplyPlan: true
    },
    leftArm: {
      applyPlan: CreateLeftArmInput_leftArm_applyPlan,
      autoApplyAfterParentApplyPlan: true
    }
  },
  LeftArmInput: {
    lengthInMetres: {
      applyPlan($insert, val) {
        $insert.set("length_in_metres", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreatePersonPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId: CreatePersonPayload_clientMutationIdPlan,
    person: CreatePersonPayload_personPlan,
    query: CreatePersonPayload_queryPlan,
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
            const spec = uniques27[0].attributes.reduce((memo, attributeName) => {
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
      applyPlan: CreatePersonInput_clientMutationId_applyPlan,
      autoApplyAfterParentApplyPlan: true
    },
    person: {
      applyPlan: CreatePersonInput_person_applyPlan,
      autoApplyAfterParentApplyPlan: true
    }
  },
  PersonInput: {
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
    }
  },
  UpdateLeftArmPayload: {
    __assertStep: ObjectStep,
    clientMutationId: UpdateLeftArmPayload_clientMutationIdPlan,
    leftArm: UpdateLeftArmPayload_leftArmPlan,
    query: UpdateLeftArmPayload_queryPlan,
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
            const spec = uniques23[0].attributes.reduce((memo, attributeName) => {
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
      applyPlan: UpdateLeftArmInput_clientMutationId_applyPlan
    },
    nodeId: undefined,
    leftArmPatch: {
      applyPlan: UpdateLeftArmInput_leftArmPatch_applyPlan
    }
  },
  LeftArmPatch: {
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
      applyPlan: UpdateLeftArmByIdInput_clientMutationId_applyPlan
    },
    id: undefined,
    leftArmPatch: {
      applyPlan: UpdateLeftArmByIdInput_leftArmPatch_applyPlan
    }
  },
  UpdateLeftArmByPersonIdInput: {
    clientMutationId: {
      applyPlan: UpdateLeftArmByPersonIdInput_clientMutationId_applyPlan
    },
    personId: undefined,
    leftArmPatch: {
      applyPlan: UpdateLeftArmByPersonIdInput_leftArmPatch_applyPlan
    }
  },
  UpdatePersonPayload: {
    __assertStep: ObjectStep,
    clientMutationId: UpdatePersonPayload_clientMutationIdPlan,
    person: UpdatePersonPayload_personPlan,
    query: UpdatePersonPayload_queryPlan,
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
            const spec = uniques27[0].attributes.reduce((memo, attributeName) => {
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
      applyPlan: UpdatePersonInput_clientMutationId_applyPlan
    },
    nodeId: undefined,
    personPatch: {
      applyPlan: UpdatePersonInput_personPatch_applyPlan
    }
  },
  PersonPatch: {
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
    }
  },
  UpdatePersonByIdInput: {
    clientMutationId: {
      applyPlan: UpdatePersonByIdInput_clientMutationId_applyPlan
    },
    id: undefined,
    personPatch: {
      applyPlan: UpdatePersonByIdInput_personPatch_applyPlan
    }
  },
  UpdatePersonByEmailInput: {
    clientMutationId: {
      applyPlan: UpdatePersonByEmailInput_clientMutationId_applyPlan
    },
    email: undefined,
    personPatch: {
      applyPlan: UpdatePersonByEmailInput_personPatch_applyPlan
    }
  },
  DeletePersonSecretPayload: {
    __assertStep: ObjectStep,
    clientMutationId: DeletePersonSecretPayload_clientMutationIdPlan,
    personSecret: DeletePersonSecretPayload_personSecretPlan,
    deletedPersonSecretId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.PersonSecret.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query: DeletePersonSecretPayload_queryPlan,
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
            const spec = uniques11[0].attributes.reduce((memo, attributeName) => {
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
    personByPersonId($record) {
      return pgResource_personPgResource.get({
        id: $record.get("result").get("person_id")
      });
    }
  },
  DeletePersonSecretInput: {
    clientMutationId: {
      applyPlan: DeletePersonSecretInput_clientMutationId_applyPlan
    },
    nodeId: undefined
  },
  DeletePersonSecretByPersonIdInput: {
    clientMutationId: {
      applyPlan: DeletePersonSecretByPersonIdInput_clientMutationId_applyPlan
    },
    personId: undefined
  },
  DeleteLeftArmPayload: {
    __assertStep: ObjectStep,
    clientMutationId: DeleteLeftArmPayload_clientMutationIdPlan,
    leftArm: DeleteLeftArmPayload_leftArmPlan,
    deletedLeftArmId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.LeftArm.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query: DeleteLeftArmPayload_queryPlan,
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
            const spec = uniques23[0].attributes.reduce((memo, attributeName) => {
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
      applyPlan: DeleteLeftArmInput_clientMutationId_applyPlan
    },
    nodeId: undefined
  },
  DeleteLeftArmByIdInput: {
    clientMutationId: {
      applyPlan: DeleteLeftArmByIdInput_clientMutationId_applyPlan
    },
    id: undefined
  },
  DeleteLeftArmByPersonIdInput: {
    clientMutationId: {
      applyPlan: DeleteLeftArmByPersonIdInput_clientMutationId_applyPlan
    },
    personId: undefined
  },
  DeletePersonPayload: {
    __assertStep: ObjectStep,
    clientMutationId: DeletePersonPayload_clientMutationIdPlan,
    person: DeletePersonPayload_personPlan,
    deletedPersonId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.Person.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query: DeletePersonPayload_queryPlan,
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
            const spec = uniques27[0].attributes.reduce((memo, attributeName) => {
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
      applyPlan: DeletePersonInput_clientMutationId_applyPlan
    },
    nodeId: undefined
  },
  DeletePersonByIdInput: {
    clientMutationId: {
      applyPlan: DeletePersonByIdInput_clientMutationId_applyPlan
    },
    id: undefined
  },
  DeletePersonByEmailInput: {
    clientMutationId: {
      applyPlan: DeletePersonByEmailInput_clientMutationId_applyPlan
    },
    email: undefined
  }
};
export const schema = makeGrafastSchema({
  typeDefs: typeDefs,
  plans: plans
});
