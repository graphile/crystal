import { LIST_TYPES, PgDeleteSingleStep, PgExecutor, PgResource, PgSelectStep, TYPES, assertPgClassSingleStep, domainOfCodec, enumCodec, listOfCodec, makeRegistry, pgDeleteSingle, pgInsertSingle, pgSelectFromRecord, pgSelectSingleFromRecord, pgUpdateSingle, rangeOfCodec, recordCodec, sqlFromArgDigests, sqlValueWithCodec } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ObjectStep, __ValueStep, access, assertStep, bakedInput, bakedInputRuntime, connection, constant, context, createObjectAndApplyChildren, first, get as get2, inhibitOnNull, inspect, lambda, list, makeDecodeNodeId, makeGrafastSchema, object, operationPlan, rootValue, specFromNodeId, trap } from "grafast";
import { GraphQLError, GraphQLString, Kind } from "graphql";
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
      codec: TYPES.int,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
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
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
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
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
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
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
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
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
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
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
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
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    null_value: {
      codec: TYPES.text,
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
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
const noPrimaryKeyIdentifier = sql.identifier("a", "no_primary_key");
const noPrimaryKeyCodec = recordCodec({
  name: "noPrimaryKey",
  identifier: noPrimaryKeyIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    str: {
      codec: TYPES.text,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
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
const uniqueForeignKeyIdentifier = sql.identifier("a", "unique_foreign_key");
const uniqueForeignKeyCodec = recordCodec({
  name: "uniqueForeignKey",
  identifier: uniqueForeignKeyIdentifier,
  attributes: {
    __proto__: null,
    compound_key_1: {
      codec: TYPES.int,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    compound_key_2: {
      codec: TYPES.int,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
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
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    json_data: {
      codec: TYPES.jsonb,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
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
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: false,
        canUpdate: false
      }
    },
    sekrit: {
      codec: TYPES.text,
      description: "A secret held by the associated Person",
      extensions: {
        tags: {
          name: "secret"
        },
        canSelect: true,
        canInsert: true,
        canUpdate: false
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
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    nonsense: {
      codec: TYPES.text,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
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
const foreignKeyIdentifier = sql.identifier("a", "foreign_key");
const foreignKeyCodec = recordCodec({
  name: "foreignKey",
  identifier: foreignKeyIdentifier,
  attributes: {
    __proto__: null,
    person_id: {
      codec: TYPES.int,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    compound_key_1: {
      codec: TYPES.int,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    compound_key_2: {
      codec: TYPES.int,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
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
const testviewIdentifier = sql.identifier("a", "testview");
const testviewCodec = recordCodec({
  name: "testview",
  identifier: testviewIdentifier,
  attributes: {
    __proto__: null,
    testviewid: {
      codec: TYPES.int,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    col1: {
      codec: TYPES.int,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    col2: {
      codec: TYPES.int,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
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
const viewTableIdentifier = sql.identifier("a", "view_table");
const viewTableCodec = recordCodec({
  name: "viewTable",
  identifier: viewTableIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    col1: {
      codec: TYPES.int,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    col2: {
      codec: TYPES.int,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
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
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    person_id_1: {
      codec: TYPES.int,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    extra: {
      codec: TYPES.boolean,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
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
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    col1: {
      codec: TYPES.int,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    col2: {
      codec: TYPES.int,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    col3: {
      codec: TYPES.int,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
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
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    col3: {
      codec: TYPES.int,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    col4: {
      codec: TYPES.int,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    col5: {
      codec: TYPES.int,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
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
      codec: TYPES.int,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    name: {
      codec: TYPES.varchar,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    description: {
      codec: TYPES.text,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    constant: {
      codec: TYPES.int,
      description: "This is constantly 2",
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
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
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    nullable_text: {
      codec: TYPES.text,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    nullable_int: {
      codec: TYPES.int,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    non_null_text: {
      codec: TYPES.text,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
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
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    wont_cast_easy: {
      codec: TYPES.int2,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    row_id: {
      codec: TYPES.int,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
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
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    ts: {
      codec: notNullTimestampCodec,
      notNull: true,
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
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
const leftArmIdentifier = sql.identifier("c", "left_arm");
const leftArmCodec = recordCodec({
  name: "leftArm",
  identifier: leftArmIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: false,
        canUpdate: false
      }
    },
    person_id: {
      codec: TYPES.int,
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: false,
        canUpdate: false
      }
    },
    length_in_metres: {
      codec: TYPES.float,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: false
      }
    },
    mood: {
      codec: TYPES.text,
      notNull: true,
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: false,
        canUpdate: true
      }
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
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: false,
        canUpdate: false
      }
    },
    headline: {
      codec: TYPES.text,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: false,
        canUpdate: false
      }
    },
    body: {
      codec: TYPES.text,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: false,
        canUpdate: false
      }
    },
    author_id: {
      codec: TYPES.int,
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: false,
        canUpdate: false
      }
    },
    enums: {
      codec: anEnumArrayCodec,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    comptypes: {
      codec: comptypeArrayCodec,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
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
      description: "The primary unique identifier for the person",
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: false,
        canUpdate: false
      }
    },
    person_full_name: {
      codec: TYPES.varchar,
      notNull: true,
      description: "The person\u2019s name",
      extensions: {
        tags: {
          name: "name"
        },
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    aliases: {
      codec: LIST_TYPES.text,
      notNull: true,
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    about: {
      codec: TYPES.text,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    email: {
      codec: emailCodec,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    site: {
      codec: wrappedUrlCodec,
      extensions: {
        tags: {
          deprecated: "Don\u2019t use me"
        },
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    config: {
      codec: TYPES.hstore,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: false,
        canUpdate: false
      }
    },
    last_login_from_ip: {
      codec: TYPES.inet,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: false,
        canUpdate: false
      }
    },
    last_login_from_subnet: {
      codec: TYPES.cidr,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: false,
        canUpdate: false
      }
    },
    user_mac: {
      codec: TYPES.macaddr,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: false,
        canUpdate: false
      }
    },
    created_at: {
      codec: TYPES.timestamp,
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: false,
        canUpdate: false
      }
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
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    int_array: {
      codec: LIST_TYPES.int,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    int_array_nn: {
      codec: LIST_TYPES.int,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    enum_array: {
      codec: colorArrayCodec,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    enum_array_nn: {
      codec: colorArrayCodec,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    date_array: {
      codec: LIST_TYPES.date,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    date_array_nn: {
      codec: LIST_TYPES.date,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    timestamptz_array: {
      codec: LIST_TYPES.timestamptz,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    timestamptz_array_nn: {
      codec: LIST_TYPES.timestamptz,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    compound_type_array: {
      codec: compoundTypeArrayCodec,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    compound_type_array_nn: {
      codec: compoundTypeArrayCodec,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    bytea_array: {
      codec: LIST_TYPES.bytea,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    bytea_array_nn: {
      codec: LIST_TYPES.bytea,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    tsvector_array: {
      codec: LIST_TYPES.tsvector,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    tsvector_array_nn: {
      codec: LIST_TYPES.tsvector,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    tsquery_array: {
      codec: LIST_TYPES.tsquery,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    tsquery_array_nn: {
      codec: LIST_TYPES.tsquery,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
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
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    smallint: {
      codec: TYPES.int2,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    bigint: {
      codec: TYPES.bigint,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    numeric: {
      codec: TYPES.numeric,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    decimal: {
      codec: TYPES.numeric,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    boolean: {
      codec: TYPES.boolean,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    varchar: {
      codec: TYPES.varchar,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    enum: {
      codec: colorCodec,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    enum_array: {
      codec: colorArrayCodec,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    domain: {
      codec: anIntCodec,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    domain2: {
      codec: anotherIntCodec,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    text_array: {
      codec: LIST_TYPES.text,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    json: {
      codec: TYPES.json,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    jsonb: {
      codec: TYPES.jsonb,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    jsonpath: {
      codec: TYPES.jsonpath,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    nullable_range: {
      codec: numrangeCodec,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    numrange: {
      codec: numrangeCodec,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    daterange: {
      codec: daterangeCodec,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    an_int_range: {
      codec: anIntRangeCodec,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    timestamp: {
      codec: TYPES.timestamp,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    timestamptz: {
      codec: TYPES.timestamptz,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    date: {
      codec: TYPES.date,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    time: {
      codec: TYPES.time,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    timetz: {
      codec: TYPES.timetz,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    interval: {
      codec: TYPES.interval,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    interval_array: {
      codec: LIST_TYPES.interval,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    money: {
      codec: TYPES.money,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    compound_type: {
      codec: compoundTypeCodec,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    nested_compound_type: {
      codec: nestedCompoundTypeCodec,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    nullable_compound_type: {
      codec: compoundTypeCodec,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    nullable_nested_compound_type: {
      codec: nestedCompoundTypeCodec,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    point: {
      codec: TYPES.point,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    nullablePoint: {
      codec: TYPES.point,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    inet: {
      codec: TYPES.inet,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    cidr: {
      codec: TYPES.cidr,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    macaddr: {
      codec: TYPES.macaddr,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    regproc: {
      codec: TYPES.regproc,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    regprocedure: {
      codec: TYPES.regprocedure,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    regoper: {
      codec: TYPES.regoper,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    regoperator: {
      codec: TYPES.regoperator,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    regclass: {
      codec: TYPES.regclass,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    regtype: {
      codec: TYPES.regtype,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    regconfig: {
      codec: TYPES.regconfig,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    regdictionary: {
      codec: TYPES.regdictionary,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    text_array_domain: {
      codec: textArrayDomainCodec,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    int8_array_domain: {
      codec: int8ArrayDomainCodec,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    bytea: {
      codec: TYPES.bytea,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    bytea_array: {
      codec: LIST_TYPES.bytea,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    ltree: {
      codec: spec_types_attributes_ltree_codec_ltree,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    ltree_array: {
      codec: spec_types_attributes_ltree_array_codec_ltree_,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    tsvector: {
      codec: TYPES.tsvector,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    tsvector_array: {
      codec: LIST_TYPES.tsvector,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    tsquery: {
      codec: TYPES.tsquery,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    tsquery_array: {
      codec: LIST_TYPES.tsquery,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
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
    },
    canSelect: false,
    canInsert: false,
    canUpdate: false,
    canDelete: false
  },
  uniques: [{
    attributes: ["compound_key_1", "compound_key_2"]
  }]
};
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
    },
    canSelect: true,
    canInsert: true,
    canUpdate: false,
    canDelete: true
  },
  uniques: person_secretUniques,
  description: "Tracks the person's secret"
};
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
    },
    canSelect: false,
    canInsert: false,
    canUpdate: false,
    canDelete: false
  }
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
    },
    canSelect: false,
    canInsert: false,
    canUpdate: false,
    canDelete: false
  },
  uniques: compound_keyUniques
};
const edge_case_computedFunctionIdentifer = sql.identifier("c", "edge_case_computed");
const return_table_without_grantsFunctionIdentifer = sql.identifier("c", "return_table_without_grants");
const types_mutationFunctionIdentifer = sql.identifier("c", "types_mutation");
const types_queryFunctionIdentifer = sql.identifier("c", "types_query");
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
    },
    canSelect: false,
    canInsert: false,
    canUpdate: false,
    canDelete: false
  },
  uniques: [{
    attributes: ["id"],
    isPrimary: true
  }]
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
    },
    canSelect: true,
    canInsert: true,
    canUpdate: true,
    canDelete: true
  },
  uniques: left_armUniques,
  description: "Tracks metadata about the left arms of various people"
};
const authenticate_manyFunctionIdentifer = sql.identifier("b", "authenticate_many");
const issue756_mutationFunctionIdentifer = sql.identifier("c", "issue756_mutation");
const issue756_set_mutationFunctionIdentifer = sql.identifier("c", "issue756_set_mutation");
const left_arm_identityFunctionIdentifer = sql.identifier("c", "left_arm_identity");
const authenticate_payloadFunctionIdentifer = sql.identifier("b", "authenticate_payload");
const post_computed_interval_arrayFunctionIdentifer = sql.identifier("a", "post_computed_interval_array");
const post_computed_interval_setFunctionIdentifer = sql.identifier("a", "post_computed_interval_set");
const post_computed_text_arrayFunctionIdentifer = sql.identifier("a", "post_computed_text_array");
const compound_type_computed_fieldFunctionIdentifer = sql.identifier("c", "compound_type_computed_field");
const post_computed_with_optional_argFunctionIdentifer = sql.identifier("a", "post_computed_with_optional_arg");
const post_computed_with_required_argFunctionIdentifer = sql.identifier("a", "post_computed_with_required_arg");
const post_headline_trimmedFunctionIdentifer = sql.identifier("a", "post_headline_trimmed");
const post_headline_trimmed_no_defaultsFunctionIdentifer = sql.identifier("a", "post_headline_trimmed_no_defaults");
const post_headline_trimmed_strictFunctionIdentifer = sql.identifier("a", "post_headline_trimmed_strict");
const func_out_out_compound_typeFunctionIdentifer = sql.identifier("c", "func_out_out_compound_type");
const mutation_out_out_compound_typeFunctionIdentifer = sql.identifier("c", "mutation_out_out_compound_type");
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
    },
    canSelect: true,
    canInsert: false,
    canUpdate: false,
    canDelete: false
  },
  uniques: postUniques
};
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
const list_of_compound_types_mutationFunctionIdentifer = sql.identifier("c", "list_of_compound_types_mutation");
const table_mutationFunctionIdentifer = sql.identifier("c", "table_mutation");
const table_queryFunctionIdentifer = sql.identifier("c", "table_query");
const post_with_suffixFunctionIdentifer = sql.identifier("a", "post_with_suffix");
const mutation_compound_type_arrayFunctionIdentifer = sql.identifier("a", "mutation_compound_type_array");
const query_compound_type_arrayFunctionIdentifer = sql.identifier("a", "query_compound_type_array");
const compound_type_array_mutationFunctionIdentifer = sql.identifier("b", "compound_type_array_mutation");
const compound_type_array_queryFunctionIdentifer = sql.identifier("b", "compound_type_array_query");
const post_computed_compound_type_arrayFunctionIdentifer = sql.identifier("a", "post_computed_compound_type_array");
const post_manyFunctionIdentifer = sql.identifier("a", "post_many");
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
    },
    canSelect: true,
    canInsert: true,
    canUpdate: true,
    canDelete: true
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
    },
    canSelect: false,
    canInsert: false,
    canUpdate: false,
    canDelete: false
  },
  uniques: [{
    attributes: ["id"],
    isPrimary: true
  }]
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
    noPrimaryKey: noPrimaryKeyCodec,
    uniqueForeignKey: uniqueForeignKeyCodec,
    myTable: myTableCodec,
    personSecret: personSecretCodec,
    unlogged: unloggedCodec,
    foreignKey: foreignKeyCodec,
    testview: testviewCodec,
    viewTable: viewTableCodec,
    compoundKey: compoundKeyCodec,
    bool: TYPES.boolean,
    similarTable1: similarTable1Codec,
    similarTable2: similarTable2Codec,
    updatableView: updatableViewCodec,
    nullTestRecord: nullTestRecordCodec,
    edgeCase: edgeCaseCodec,
    int2: TYPES.int2,
    issue756: issue756Codec,
    notNullTimestamp: notNullTimestampCodec,
    timestamptz: TYPES.timestamptz,
    jwtToken: jwtTokenCodec,
    numeric: TYPES.numeric,
    leftArm: leftArmCodec,
    float8: TYPES.float,
    authPayload: authPayloadCodec,
    FuncOutOutCompoundTypeRecord: registryConfig_pgCodecs_FuncOutOutCompoundTypeRecord_FuncOutOutCompoundTypeRecord,
    compoundType: compoundTypeCodec,
    color: colorCodec,
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
        },
        canExecute: true
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
        singleOutputParameterName: "o",
        canExecute: false
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
        singleOutputParameterName: "o",
        canExecute: false
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
        },
        canExecute: false
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
        singleOutputParameterName: "o",
        canExecute: false
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
        singleOutputParameterName: "o",
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        singleOutputParameterName: "o",
        canExecute: false
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
        singleOutputParameterName: "col1",
        canExecute: false
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
        singleOutputParameterName: "o",
        canExecute: false
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
        singleOutputParameterName: "col1",
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        singleOutputParameterName: "ino",
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        singleOutputParameterName: "ino",
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        isDeletable: false,
        canSelect: false,
        canInsert: false,
        canUpdate: false,
        canDelete: false
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
        },
        canSelect: false,
        canInsert: false,
        canUpdate: false,
        canDelete: false
      },
      uniques: [{
        attributes: ["id"],
        isPrimary: true
      }],
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
        },
        canSelect: false,
        canInsert: false,
        canUpdate: false,
        canDelete: false
      },
      uniques: [{
        attributes: ["id"],
        isPrimary: true
      }],
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
        },
        canSelect: false,
        canInsert: false,
        canUpdate: false,
        canDelete: false
      },
      uniques: [{
        attributes: ["id"],
        isPrimary: true
      }]
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
        },
        canSelect: false,
        canInsert: false,
        canUpdate: false,
        canDelete: false
      },
      uniques: [{
        attributes: ["id"],
        isPrimary: true
      }],
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
        },
        canSelect: false,
        canInsert: false,
        canUpdate: false,
        canDelete: false
      },
      uniques: [{
        attributes: ["id"],
        isPrimary: true
      }],
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
        },
        canSelect: false,
        canInsert: false,
        canUpdate: false,
        canDelete: false
      },
      uniques: [{
        attributes: ["id"],
        isPrimary: true
      }]
    },
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
        },
        canSelect: false,
        canInsert: false,
        canUpdate: false,
        canDelete: false
      },
      uniques: [{
        attributes: ["id"]
      }]
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
        },
        canSelect: false,
        canInsert: false,
        canUpdate: false,
        canDelete: false
      },
      uniques: [{
        attributes: ["id"],
        isPrimary: true
      }]
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
        },
        canSelect: false,
        canInsert: false,
        canUpdate: false,
        canDelete: false
      },
      uniques: [{
        attributes: ["id"],
        isPrimary: true
      }]
    },
    foreign_key: foreign_key_resourceOptionsConfig,
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
        },
        canSelect: false,
        canInsert: false,
        canUpdate: false,
        canDelete: false
      }
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
        },
        canSelect: false,
        canInsert: false,
        canUpdate: false,
        canDelete: false
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
        },
        canExecute: false
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
        },
        canSelect: false,
        canInsert: false,
        canUpdate: false,
        canDelete: false
      },
      uniques: [{
        attributes: ["id"],
        isPrimary: true
      }]
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
        },
        canSelect: false,
        canInsert: false,
        canUpdate: false,
        canDelete: false
      },
      uniques: [{
        attributes: ["id"],
        isPrimary: true
      }]
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
        },
        canSelect: false,
        canInsert: false,
        canUpdate: false,
        canDelete: false
      },
      uniques: [{
        attributes: ["x"],
        extensions: {
          tags: {
            __proto__: null,
            behavior: "-single -update -delete"
          }
        }
      }],
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
        },
        canSelect: false,
        canInsert: false,
        canUpdate: false,
        canDelete: false
      },
      uniques: [{
        attributes: ["id"],
        isPrimary: true
      }]
    },
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
        },
        canSelect: false,
        canInsert: false,
        canUpdate: false,
        canDelete: false
      }
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
        },
        canExecute: true
      }
    }),
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
        },
        canExecute: false
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
        },
        canExecute: false
      },
      isUnique: true
    },
    issue756: issue756_resourceOptionsConfig,
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
        },
        canExecute: false
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
        },
        canExecute: false
      },
      isMutation: true
    }),
    left_arm: left_arm_resourceOptionsConfig,
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
        },
        canExecute: false
      },
      isMutation: true,
      returnsArray: true
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
        },
        canExecute: false
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
        },
        canExecute: false
      },
      isMutation: true,
      hasImplicitOrder: true
    }),
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
        },
        canExecute: true
      },
      isMutation: true
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
      },
      isUnique: true
    },
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
      },
      isUnique: true
    },
    post: post_resourceOptionsConfig,
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
      },
      isMutation: true,
      hasImplicitOrder: true
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
        },
        canExecute: false
      },
      isMutation: true,
      hasImplicitOrder: true
    }),
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: true
      },
      isMutation: true
    }),
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        singleOutputParameterName: "o1",
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        singleOutputParameterName: "ino",
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
      },
      isUnique: true
    },
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        singleOutputParameterName: "person",
        canExecute: false
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
        },
        canExecute: false
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
        },
        canSelect: false,
        canInsert: false,
        canUpdate: false,
        canDelete: false
      },
      uniques: [{
        attributes: ["id"],
        isPrimary: true
      }]
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
        },
        canExecute: false
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
const resource_person_secretPgResource = registry.pgResources["person_secret"];
const resource_left_armPgResource = registry.pgResources["left_arm"];
const resource_postPgResource = registry.pgResources["post"];
const resource_personPgResource = registry.pgResources["person"];
const EMPTY_ARRAY = [];
const makeArgs_current_user_id = () => EMPTY_ARRAY;
const resource_current_user_idPgResource = registry.pgResources["current_user_id"];
const resource_return_table_without_grantsPgResource = registry.pgResources["return_table_without_grants"];
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
const nodeIdHandler_PersonSecret = makeTableNodeIdHandler({
  typeName: "PersonSecret",
  identifier: "person_secrets",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_person_secretPgResource,
  pk: person_secretUniques[0].attributes,
  deprecationReason: "This is deprecated (comment on table c.person_secret)."
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
const nodeFetcher_PersonSecret = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandler_PersonSecret);
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
  PersonSecret: nodeIdHandler_PersonSecret,
  LeftArm: nodeIdHandler_LeftArm,
  Post: nodeIdHandler_Post,
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
const resource_frmcdc_wrappedUrlPgResource = registry.pgResources["frmcdc_wrappedUrl"];
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
function toString(value) {
  return "" + value;
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
const pgFieldSource_post_computed_with_optional_argPgResource = registry.pgResources["post_computed_with_optional_arg"];
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
const resource_compound_keyPgResource = registry.pgResources["compound_key"];
const pgFieldSource_person_computed_outPgResource = registry.pgResources["person_computed_out"];
const pgFieldSource_person_first_namePgResource = registry.pgResources["person_first_name"];
const argDetailsSimple_left_arm_identity = [{
  graphqlArgName: "leftArm",
  pgCodec: leftArmCodec,
  postgresArgName: "left_arm",
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
const makeArgs_left_arm_identity = (args, path = []) => argDetailsSimple_left_arm_identity.map(details => makeArg(path, args, details));
const resource_left_arm_identityPgResource = registry.pgResources["left_arm_identity"];
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
function applyInputToInsert(_, $object) {
  return $object;
}
const specFromArgs_LeftArm = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_LeftArm, $nodeId);
};
function applyInputToUpdateOrDelete(_, $object) {
  return $object;
}
const specFromArgs_Person = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Person, $nodeId);
};
const specFromArgs_PersonSecret = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_PersonSecret, $nodeId);
};
const specFromArgs_LeftArm2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_LeftArm, $nodeId);
};
const specFromArgs_Person2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Person, $nodeId);
};
function queryPlan() {
  return rootValue();
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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: PersonSecretCondition

    """The method to use when ordering \`PersonSecret\`."""
    orderBy: [PersonSecretsOrderBy!] = [PRIMARY_KEY_ASC]
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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: LeftArmCondition

    """The method to use when ordering \`LeftArm\`."""
    orderBy: [LeftArmsOrderBy!] = [PRIMARY_KEY_ASC]
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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: PostCondition

    """The method to use when ordering \`Post\`."""
    orderBy: [PostsOrderBy!] = [PRIMARY_KEY_ASC]
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

  """Checks for equality with the object’s \`computedWithOptionalArg\` field."""
  computedWithOptionalArg: Int
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
export const objects = {
  Query: {
    assertStep() {
      return true;
    },
    plans: {
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
      currentUserId($root, args, _info) {
        const selectArgs = makeArgs_current_user_id(args);
        return resource_current_user_idPgResource.execute(selectArgs);
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
      node(_$root, fieldArgs) {
        return fieldArgs.getRaw("nodeId");
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_Query.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Query.codec.name].encode);
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
      returnTableWithoutGrants($root, args, _info) {
        const selectArgs = makeArgs_current_user_id(args);
        return resource_return_table_without_grantsPgResource.execute(selectArgs);
      }
    }
  },
  Mutation: {
    assertStep: __ValueStep,
    plans: {
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
      deleteLeftArm: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_left_armPgResource, specFromArgs_LeftArm2(args));
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
      deletePerson: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_personPgResource, specFromArgs_Person2(args));
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
      leftArmIdentity: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_left_arm_identity(args, ["input"]);
          const $result = resource_left_arm_identityPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input(_, $payload, arg) {
            const $pgSelect = pgSelectFromPayload($payload);
            arg.apply($pgSelect);
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
      }
    }
  },
  CompoundKey: {
    assertStep: assertPgClassSingleStep,
    plans: {
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
  CreateLeftArmPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      leftArm: planCreatePayloadResult,
      leftArmEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_left_armPgResource, left_armUniques[0].attributes, $mutation, fieldArgs);
      },
      personByPersonId($record) {
        return resource_personPgResource.get({
          id: $record.get("result").get("person_id")
        });
      },
      query: queryPlan
    }
  },
  CreatePersonPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      person: planCreatePayloadResult,
      personEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_personPgResource, personUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  CreatePersonSecretPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      personByPersonId($record) {
        return resource_personPgResource.get({
          id: $record.get("result").get("person_id")
        });
      },
      personSecret: planCreatePayloadResult,
      personSecretEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_person_secretPgResource, person_secretUniques[0].attributes, $mutation, fieldArgs);
      },
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
      leftArmEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_left_armPgResource, left_armUniques[0].attributes, $mutation, fieldArgs);
      },
      personByPersonId($record) {
        return resource_personPgResource.get({
          id: $record.get("result").get("person_id")
        });
      },
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
      personEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_personPgResource, personUniques[0].attributes, $mutation, fieldArgs);
      },
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
      personByPersonId($record) {
        return resource_personPgResource.get({
          id: $record.get("result").get("person_id")
        });
      },
      personSecret: planUpdateOrDeletePayloadResult,
      personSecretEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_person_secretPgResource, person_secretUniques[0].attributes, $mutation, fieldArgs);
      },
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
      personByPersonId($record) {
        return resource_personPgResource.get({
          id: $record.get("person_id")
        });
      },
      personId($record) {
        return $record.get("person_id");
      }
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
      clientMutationId($object) {
        const $result = $object.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      leftArm($object) {
        return $object.get("result");
      },
      leftArmEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_left_armPgResource, left_armUniques[0].attributes, $mutation, fieldArgs);
      },
      personByPersonId($record) {
        return resource_personPgResource.get({
          id: $record.get("result").get("person_id")
        });
      },
      query: queryPlan
    }
  },
  LeftArmsConnection: {
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
      createdAt($record) {
        return $record.get("created_at");
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
  PersonSecret: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nodeId($parent) {
        const specifier = nodeIdHandler_PersonSecret.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_PersonSecret.codec.name].encode);
      },
      personByPersonId($record) {
        return resource_personPgResource.get({
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
      nodeId($parent) {
        const specifier = nodeIdHandler_Post.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Post.codec.name].encode);
      },
      personByAuthorId($record) {
        return resource_personPgResource.get({
          id: $record.get("author_id")
        });
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
  PostsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  UpdateLeftArmPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      leftArm: planUpdateOrDeletePayloadResult,
      leftArmEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_left_armPgResource, left_armUniques[0].attributes, $mutation, fieldArgs);
      },
      personByPersonId($record) {
        return resource_personPgResource.get({
          id: $record.get("result").get("person_id")
        });
      },
      query: queryPlan
    }
  },
  UpdatePersonPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      person: planUpdateOrDeletePayloadResult,
      personEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_personPgResource, personUniques[0].attributes, $mutation, fieldArgs);
      },
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
  CreateLeftArmInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      leftArm: applyCreateFields
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
  LeftArmBaseInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      id(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
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
      },
      personId(obj, val, {
        field,
        schema
      }) {
        obj.set("person_id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  LeftArmCondition: {
    plans: {
      id($condition, val) {
        return applyAttributeCondition("id", TYPES.int, $condition, val);
      },
      lengthInMetres($condition, val) {
        return applyAttributeCondition("length_in_metres", TYPES.float, $condition, val);
      },
      mood($condition, val) {
        return applyAttributeCondition("mood", TYPES.text, $condition, val);
      },
      personId($condition, val) {
        return applyAttributeCondition("person_id", TYPES.int, $condition, val);
      }
    }
  },
  LeftArmIdentityInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  LeftArmInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      lengthInMetres(obj, val, {
        field,
        schema
      }) {
        obj.set("length_in_metres", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  LeftArmPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      mood(obj, val, {
        field,
        schema
      }) {
        obj.set("mood", bakedInputRuntime(schema, field.type, val));
      }
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
        if (typeof pgFieldSource_person_computed_outPgResource.from !== "function") {
          throw new Error("Invalid computed attribute 'from'");
        }
        const expression = sql`${pgFieldSource_person_computed_outPgResource.from({
          placeholder: $condition.alias
        })}`;
        $condition.where(val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, pgFieldSource_person_computed_outPgResource.codec)}`);
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
      id($condition, val) {
        return applyAttributeCondition("id", TYPES.int, $condition, val);
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
      email(obj, val, {
        field,
        schema
      }) {
        obj.set("email", bakedInputRuntime(schema, field.type, val));
      },
      name(obj, val, {
        field,
        schema
      }) {
        obj.set("person_full_name", bakedInputRuntime(schema, field.type, val));
      },
      site(obj, val, {
        field,
        schema
      }) {
        obj.set("site", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  PersonPatch: {
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
      email(obj, val, {
        field,
        schema
      }) {
        obj.set("email", bakedInputRuntime(schema, field.type, val));
      },
      name(obj, val, {
        field,
        schema
      }) {
        obj.set("person_full_name", bakedInputRuntime(schema, field.type, val));
      },
      site(obj, val, {
        field,
        schema
      }) {
        obj.set("site", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  PersonSecretCondition: {
    plans: {
      personId($condition, val) {
        return applyAttributeCondition("person_id", TYPES.int, $condition, val);
      },
      secret($condition, val) {
        return applyAttributeCondition("sekrit", TYPES.text, $condition, val);
      }
    }
  },
  PersonSecretInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      secret(obj, val, {
        field,
        schema
      }) {
        obj.set("sekrit", bakedInputRuntime(schema, field.type, val));
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
      computedWithOptionalArg($condition, val) {
        if (val === undefined) return;
        if (typeof pgFieldSource_post_computed_with_optional_argPgResource.from !== "function") {
          throw new Error("Invalid computed attribute 'from'");
        }
        const expression = sql`${pgFieldSource_post_computed_with_optional_argPgResource.from({
          placeholder: $condition.alias
        })}`;
        $condition.where(val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, pgFieldSource_post_computed_with_optional_argPgResource.codec)}`);
      },
      headline($condition, val) {
        return applyAttributeCondition("headline", TYPES.text, $condition, val);
      },
      id($condition, val) {
        return applyAttributeCondition("id", TYPES.int, $condition, val);
      }
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
  NotNullUrl: {
    serialize: GraphQLString.serialize,
    parseValue: GraphQLString.parseValue,
    parseLiteral: GraphQLString.parseLiteral
  }
};
export const enums = {
  LeftArmsOrderBy: {
    values: {
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
        applyOrderByCustomField(pgFieldSource_person_computed_outPgResource, "asc", undefined, queryBuilder);
      },
      COMPUTED_OUT_DESC(queryBuilder) {
        applyOrderByCustomField(pgFieldSource_person_computed_outPgResource, "desc", undefined, queryBuilder);
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
        applyOrderByCustomField(pgFieldSource_person_first_namePgResource, "asc", undefined, queryBuilder);
      },
      FIRST_NAME_DESC(queryBuilder) {
        applyOrderByCustomField(pgFieldSource_person_first_namePgResource, "desc", undefined, queryBuilder);
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
        applyOrderByCustomField(pgFieldSource_post_computed_with_optional_argPgResource, "asc", undefined, queryBuilder);
      },
      COMPUTED_WITH_OPTIONAL_ARG_DESC(queryBuilder) {
        applyOrderByCustomField(pgFieldSource_post_computed_with_optional_argPgResource, "desc", undefined, queryBuilder);
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
