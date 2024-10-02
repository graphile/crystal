import { PgDeleteSingleStep, PgExecutor, PgResource, PgSelectStep, PgUnionAllStep, TYPES, assertPgClassSingleStep, domainOfCodec, enumCodec, listOfCodec, makeRegistry, pgDeleteSingle, pgInsertSingle, pgSelectFromRecord, pgSelectSingleFromRecord, pgUpdateSingle, rangeOfCodec, recordCodec, sqlFromArgDigests } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ObjectStep, SafeError, __ValueStep, access, assertEdgeCapableStep, assertExecutableStep, assertPageInfoCapableStep, connection, constant, context, first, getEnumValueConfig, inhibitOnNull, lambda, list, makeGrafastSchema, node, object, rootValue, specFromNodeId } from "grafast";
import { GraphQLError, GraphQLString, Kind } from "graphql";
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
const guidCodec = domainOfCodec(TYPES.varchar, "guid", sql.identifier("b", "guid"), {
  description: undefined,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "guid"
    },
    tags: Object.create(null)
  },
  notNull: false
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
const nonUpdatableViewIdentifier = sql.identifier("a", "non_updatable_view");
const nonUpdatableViewCodec = recordCodec({
  name: "nonUpdatableView",
  identifier: nonUpdatableViewIdentifier,
  attributes: Object.assign(Object.create(null), {
    "?column?": {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "non_updatable_view"
    },
    tags: Object.create(null)
  },
  executor: executor
});
const inputsIdentifier = sql.identifier("a", "inputs");
const inputsCodec = recordCodec({
  name: "inputs",
  identifier: inputsIdentifier,
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    }
  }),
  description: "Should output as Input",
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "inputs"
    },
    tags: Object.create(null)
  },
  executor: executor
});
const patchsIdentifier = sql.identifier("a", "patchs");
const patchsCodec = recordCodec({
  name: "patchs",
  identifier: patchsIdentifier,
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    }
  }),
  description: "Should output as Patch",
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "patchs"
    },
    tags: Object.create(null)
  },
  executor: executor
});
const reservedIdentifier = sql.identifier("a", "reserved");
const reservedCodec = recordCodec({
  name: "reserved",
  identifier: reservedIdentifier,
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "reserved"
    },
    tags: Object.create(null)
  },
  executor: executor
});
const reservedPatchsIdentifier = sql.identifier("a", "reservedPatchs");
const reservedPatchsCodec = recordCodec({
  name: "reservedPatchs",
  identifier: reservedPatchsIdentifier,
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    }
  }),
  description: "`reservedPatchs` table should get renamed to ReservedPatchRecord to prevent clashes with ReservedPatch from `reserved` table",
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "reservedPatchs"
    },
    tags: Object.create(null)
  },
  executor: executor
});
const reservedInputIdentifier = sql.identifier("a", "reserved_input");
const reservedInputCodec = recordCodec({
  name: "reservedInput",
  identifier: reservedInputIdentifier,
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    }
  }),
  description: "`reserved_input` table should get renamed to ReservedInputRecord to prevent clashes with ReservedInput from `reserved` table",
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "reserved_input"
    },
    tags: Object.create(null)
  },
  executor: executor
});
const defaultValueIdentifier = sql.identifier("a", "default_value");
const defaultValueCodec = recordCodec({
  name: "defaultValue",
  identifier: defaultValueIdentifier,
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    null_value: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "default_value"
    },
    tags: Object.create(null)
  },
  executor: executor
});
const noPrimaryKeyIdentifier = sql.identifier("a", "no_primary_key");
const noPrimaryKeyCodec = recordCodec({
  name: "noPrimaryKey",
  identifier: noPrimaryKeyIdentifier,
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    str: {
      description: undefined,
      codec: TYPES.text,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "no_primary_key"
    },
    tags: Object.create(null)
  },
  executor: executor
});
const uniqueForeignKeyIdentifier = sql.identifier("a", "unique_foreign_key");
const spec_uniqueForeignKey = {
  name: "uniqueForeignKey",
  identifier: uniqueForeignKeyIdentifier,
  attributes: Object.assign(Object.create(null), {
    compound_key_1: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    compound_key_2: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    }
  }),
  description: undefined,
  extensions: {
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
  },
  executor: executor
};
const uniqueForeignKeyCodec = recordCodec(spec_uniqueForeignKey);
const myTableIdentifier = sql.identifier("c", "my_table");
const myTableCodec = recordCodec({
  name: "myTable",
  identifier: myTableIdentifier,
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    json_data: {
      description: undefined,
      codec: TYPES.jsonb,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
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
});
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
        tags: {},
        canSelect: true,
        canInsert: false,
        canUpdate: false
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
        },
        canSelect: true,
        canInsert: true,
        canUpdate: false
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
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    nonsense: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
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
const foreignKeyIdentifier = sql.identifier("a", "foreign_key");
const foreignKeyCodec = recordCodec({
  name: "foreignKey",
  identifier: foreignKeyIdentifier,
  attributes: Object.assign(Object.create(null), {
    person_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    compound_key_1: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    compound_key_2: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "foreign_key"
    },
    tags: Object.create(null)
  },
  executor: executor
});
const testviewIdentifier = sql.identifier("a", "testview");
const testviewCodec = recordCodec({
  name: "testview",
  identifier: testviewIdentifier,
  attributes: Object.assign(Object.create(null), {
    testviewid: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    col1: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    col2: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "testview"
    },
    tags: Object.create(null)
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
    tags: Object.create(null)
  },
  typeDelim: ",",
  description: undefined,
  name: "uuidArray"
});
const viewTableIdentifier = sql.identifier("a", "view_table");
const viewTableCodec = recordCodec({
  name: "viewTable",
  identifier: viewTableIdentifier,
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    col1: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    col2: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "view_table"
    },
    tags: Object.create(null)
  },
  executor: executor
});
const compoundKeyIdentifier = sql.identifier("c", "compound_key");
const compoundKeyCodec = recordCodec({
  name: "compoundKey",
  identifier: compoundKeyIdentifier,
  attributes: Object.assign(Object.create(null), {
    person_id_2: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    person_id_1: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    extra: {
      description: undefined,
      codec: TYPES.boolean,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
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
});
const similarTable1Identifier = sql.identifier("a", "similar_table_1");
const similarTable1Codec = recordCodec({
  name: "similarTable1",
  identifier: similarTable1Identifier,
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    col1: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    col2: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    col3: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "similar_table_1"
    },
    tags: Object.create(null)
  },
  executor: executor
});
const similarTable2Identifier = sql.identifier("a", "similar_table_2");
const similarTable2Codec = recordCodec({
  name: "similarTable2",
  identifier: similarTable2Identifier,
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    col3: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    col4: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    col5: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "similar_table_2"
    },
    tags: Object.create(null)
  },
  executor: executor
});
const updatableViewIdentifier = sql.identifier("b", "updatable_view");
const updatableViewCodec = recordCodec({
  name: "updatableView",
  identifier: updatableViewIdentifier,
  attributes: Object.assign(Object.create(null), {
    x: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    name: {
      description: undefined,
      codec: TYPES.varchar,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    description: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    constant: {
      description: "This is constantly 2",
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    }
  }),
  description: "YOYOYO!!",
  extensions: {
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
  },
  executor: executor
});
const nullTestRecordIdentifier = sql.identifier("c", "null_test_record");
const nullTestRecordCodec = recordCodec({
  name: "nullTestRecord",
  identifier: nullTestRecordIdentifier,
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    nullable_text: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    nullable_int: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    non_null_text: {
      description: undefined,
      codec: TYPES.text,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
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
});
const edgeCaseIdentifier = sql.identifier("c", "edge_case");
const edgeCaseCodec = recordCodec({
  name: "edgeCase",
  identifier: edgeCaseIdentifier,
  attributes: Object.assign(Object.create(null), {
    not_null_has_default: {
      description: undefined,
      codec: TYPES.boolean,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    wont_cast_easy: {
      description: undefined,
      codec: TYPES.int2,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    row_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
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
    tags: Object.create(null)
  },
  notNull: true
});
const issue756Codec = recordCodec({
  name: "issue756",
  identifier: issue756Identifier,
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    ts: {
      description: undefined,
      codec: notNullTimestampCodec,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
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
});
const jwtTokenIdentifier = sql.identifier("b", "jwt_token");
const jwtTokenCodec = recordCodec({
  name: "jwtToken",
  identifier: jwtTokenIdentifier,
  attributes: Object.assign(Object.create(null), {
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
  }),
  description: undefined,
  extensions: {
    isTableLike: false,
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "jwt_token"
    },
    tags: Object.create(null)
  },
  executor: executor
});
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
        tags: {},
        canSelect: true,
        canInsert: false,
        canUpdate: false
      }
    },
    person_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: false,
        canUpdate: false
      }
    },
    length_in_metres: {
      description: undefined,
      codec: TYPES.float,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: false
      }
    },
    mood: {
      description: undefined,
      codec: TYPES.text,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: false,
        canUpdate: true
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
const authPayloadIdentifier = sql.identifier("b", "auth_payload");
const authPayloadCodec = recordCodec({
  name: "authPayload",
  identifier: authPayloadIdentifier,
  attributes: Object.assign(Object.create(null), {
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
  }),
  description: undefined,
  extensions: {
    isTableLike: false,
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "auth_payload"
    },
    tags: Object.assign(Object.create(null), {
      foreignKey: "(id) references c.person"
    })
  },
  executor: executor
});
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
const spec_post = {
  name: "post",
  identifier: postIdentifier,
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: false,
        canUpdate: false
      }
    },
    headline: {
      description: undefined,
      codec: TYPES.text,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: false,
        canUpdate: false
      }
    },
    body: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: false,
        canUpdate: false
      }
    },
    author_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: false,
        canUpdate: false
      }
    },
    enums: {
      description: undefined,
      codec: anEnumArrayCodec,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    comptypes: {
      description: undefined,
      codec: comptypeArrayCodec,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
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
};
const postCodec = recordCodec(spec_post);
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
        tags: {},
        canSelect: true,
        canInsert: false,
        canUpdate: false
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
        },
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    aliases: {
      description: undefined,
      codec: textArrayCodec,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    about: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    email: {
      description: undefined,
      codec: emailCodec,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
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
        },
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    config: {
      description: undefined,
      codec: TYPES.hstore,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: false,
        canUpdate: false
      }
    },
    last_login_from_ip: {
      description: undefined,
      codec: TYPES.inet,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: false,
        canUpdate: false
      }
    },
    last_login_from_subnet: {
      description: undefined,
      codec: TYPES.cidr,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: false,
        canUpdate: false
      }
    },
    user_mac: {
      description: undefined,
      codec: TYPES.macaddr,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: false,
        canUpdate: false
      }
    },
    created_at: {
      description: undefined,
      codec: TYPES.timestamp,
      notNull: false,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: false,
        canUpdate: false
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
const typesIdentifier = sql.identifier("b", "types");
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
const spec_types = {
  name: "types",
  identifier: typesIdentifier,
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    smallint: {
      description: undefined,
      codec: TYPES.int2,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    bigint: {
      description: undefined,
      codec: TYPES.bigint,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    numeric: {
      description: undefined,
      codec: TYPES.numeric,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    decimal: {
      description: undefined,
      codec: TYPES.numeric,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    boolean: {
      description: undefined,
      codec: TYPES.boolean,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    varchar: {
      description: undefined,
      codec: TYPES.varchar,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    enum: {
      description: undefined,
      codec: colorCodec,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    enum_array: {
      description: undefined,
      codec: colorArrayCodec,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    domain: {
      description: undefined,
      codec: anIntCodec,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    domain2: {
      description: undefined,
      codec: anotherIntCodec,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    text_array: {
      description: undefined,
      codec: textArrayCodec,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    json: {
      description: undefined,
      codec: TYPES.json,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    jsonb: {
      description: undefined,
      codec: TYPES.jsonb,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    nullable_range: {
      description: undefined,
      codec: numrangeCodec,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    numrange: {
      description: undefined,
      codec: numrangeCodec,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    daterange: {
      description: undefined,
      codec: daterangeCodec,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    an_int_range: {
      description: undefined,
      codec: anIntRangeCodec,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    timestamp: {
      description: undefined,
      codec: TYPES.timestamp,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    timestamptz: {
      description: undefined,
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    date: {
      description: undefined,
      codec: TYPES.date,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    time: {
      description: undefined,
      codec: TYPES.time,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    timetz: {
      description: undefined,
      codec: TYPES.timetz,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    interval: {
      description: undefined,
      codec: TYPES.interval,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    interval_array: {
      description: undefined,
      codec: intervalArrayCodec,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    money: {
      description: undefined,
      codec: TYPES.money,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    compound_type: {
      description: undefined,
      codec: compoundTypeCodec,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    nested_compound_type: {
      description: undefined,
      codec: nestedCompoundTypeCodec,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    nullable_compound_type: {
      description: undefined,
      codec: compoundTypeCodec,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    nullable_nested_compound_type: {
      description: undefined,
      codec: nestedCompoundTypeCodec,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    point: {
      description: undefined,
      codec: TYPES.point,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    nullablePoint: {
      description: undefined,
      codec: TYPES.point,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    inet: {
      description: undefined,
      codec: TYPES.inet,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    cidr: {
      description: undefined,
      codec: TYPES.cidr,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    macaddr: {
      description: undefined,
      codec: TYPES.macaddr,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    regproc: {
      description: undefined,
      codec: TYPES.regproc,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    regprocedure: {
      description: undefined,
      codec: TYPES.regprocedure,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    regoper: {
      description: undefined,
      codec: TYPES.regoper,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    regoperator: {
      description: undefined,
      codec: TYPES.regoperator,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    regclass: {
      description: undefined,
      codec: TYPES.regclass,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    regtype: {
      description: undefined,
      codec: TYPES.regtype,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    regconfig: {
      description: undefined,
      codec: TYPES.regconfig,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    regdictionary: {
      description: undefined,
      codec: TYPES.regdictionary,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    text_array_domain: {
      description: undefined,
      codec: textArrayDomainCodec,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    int8_array_domain: {
      description: undefined,
      codec: int8ArrayDomainCodec,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    bytea: {
      description: undefined,
      codec: TYPES.bytea,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    bytea_array: {
      description: undefined,
      codec: byteaArrayCodec,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    ltree: {
      description: undefined,
      codec: spec_types_attributes_ltree_codec_ltree,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    ltree_array: {
      description: undefined,
      codec: spec_types_attributes_ltree_array_codec_ltree_,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false
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
};
const typesCodec = recordCodec(spec_types);
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
const postArrayCodec = listOfCodec(postCodec, {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "_post"
    },
    tags: Object.create(null)
  },
  typeDelim: ",",
  description: undefined,
  name: "postArray"
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
const mutation_interval_setFunctionIdentifer = sql.identifier("a", "mutation_interval_set");
const query_interval_setFunctionIdentifer = sql.identifier("a", "query_interval_set");
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
const func_returns_table_multi_colFunctionIdentifer = sql.identifier("c", "func_returns_table_multi_col");
const int_set_mutationFunctionIdentifer = sql.identifier("c", "int_set_mutation");
const int_set_queryFunctionIdentifer = sql.identifier("c", "int_set_query");
const mutation_out_unnamed_out_out_unnamedFunctionIdentifer = sql.identifier("c", "mutation_out_unnamed_out_out_unnamed");
const mutation_returns_table_multi_colFunctionIdentifer = sql.identifier("c", "mutation_returns_table_multi_col");
const guid_fnFunctionIdentifer = sql.identifier("b", "guid_fn");
const mutation_interval_arrayFunctionIdentifer = sql.identifier("a", "mutation_interval_array");
const query_interval_arrayFunctionIdentifer = sql.identifier("a", "query_interval_array");
const mutation_text_arrayFunctionIdentifer = sql.identifier("a", "mutation_text_array");
const query_text_arrayFunctionIdentifer = sql.identifier("a", "query_text_array");
const registryConfig_pgResources_unique_foreign_key_unique_foreign_key = {
  executor: executor,
  name: "unique_foreign_key",
  identifier: "main.a.unique_foreign_key",
  from: uniqueForeignKeyIdentifier,
  codec: uniqueForeignKeyCodec,
  uniques: [{
    isPrimary: false,
    attributes: ["compound_key_1", "compound_key_2"],
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
      schemaName: "a",
      name: "unique_foreign_key"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {
      omit: "create,update,delete,all,order,filter",
      behavior: spec_uniqueForeignKey.extensions.tags.behavior
    },
    canSelect: false,
    canInsert: false,
    canUpdate: false,
    canDelete: false
  }
};
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
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {
      deprecated: "This is deprecated (comment on table c.person_secret)."
    },
    canSelect: true,
    canInsert: true,
    canUpdate: false,
    canDelete: true
  }
};
const registryConfig_pgResources_foreign_key_foreign_key = {
  executor: executor,
  name: "foreign_key",
  identifier: "main.a.foreign_key",
  from: foreignKeyIdentifier,
  codec: foreignKeyCodec,
  uniques: [],
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "foreign_key"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {},
    canSelect: false,
    canInsert: false,
    canUpdate: false,
    canDelete: false
  }
};
const list_bde_mutationFunctionIdentifer = sql.identifier("b", "list_bde_mutation");
const registryConfig_pgResources_compound_key_compound_key = {
  executor: executor,
  name: "compound_key",
  identifier: "main.c.compound_key",
  from: compoundKeyIdentifier,
  codec: compoundKeyCodec,
  uniques: [{
    isPrimary: true,
    attributes: ["person_id_1", "person_id_2"],
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
      name: "compound_key"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {},
    canSelect: false,
    canInsert: false,
    canUpdate: false,
    canDelete: false
  }
};
const edge_case_computedFunctionIdentifer = sql.identifier("c", "edge_case_computed");
const return_table_without_grantsFunctionIdentifer = sql.identifier("c", "return_table_without_grants");
const registryConfig_pgResources_issue756_issue756 = {
  executor: executor,
  name: "issue756",
  identifier: "main.c.issue756",
  from: issue756Identifier,
  codec: issue756Codec,
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
      name: "issue756"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {},
    canSelect: false,
    canInsert: false,
    canUpdate: false,
    canDelete: false
  }
};
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
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {},
    canSelect: true,
    canInsert: true,
    canUpdate: true,
    canDelete: true
  }
};
const authenticate_manyFunctionIdentifer = sql.identifier("b", "authenticate_many");
const issue756_mutationFunctionIdentifer = sql.identifier("c", "issue756_mutation");
const issue756_set_mutationFunctionIdentifer = sql.identifier("c", "issue756_set_mutation");
const left_arm_identityFunctionIdentifer = sql.identifier("c", "left_arm_identity");
const types_mutationFunctionIdentifer = sql.identifier("c", "types_mutation");
const types_queryFunctionIdentifer = sql.identifier("c", "types_query");
const authenticate_payloadFunctionIdentifer = sql.identifier("b", "authenticate_payload");
const compound_type_computed_fieldFunctionIdentifer = sql.identifier("c", "compound_type_computed_field");
const func_out_out_compound_typeFunctionIdentifer = sql.identifier("c", "func_out_out_compound_type");
const mutation_out_out_compound_typeFunctionIdentifer = sql.identifier("c", "mutation_out_out_compound_type");
const post_computed_interval_setFunctionIdentifer = sql.identifier("a", "post_computed_interval_set");
const post_computed_interval_arrayFunctionIdentifer = sql.identifier("a", "post_computed_interval_array");
const post_computed_text_arrayFunctionIdentifer = sql.identifier("a", "post_computed_text_array");
const post_computed_with_optional_argFunctionIdentifer = sql.identifier("a", "post_computed_with_optional_arg");
const post_computed_with_required_argFunctionIdentifer = sql.identifier("a", "post_computed_with_required_arg");
const post_headline_trimmedFunctionIdentifer = sql.identifier("a", "post_headline_trimmed");
const post_headline_trimmed_no_defaultsFunctionIdentifer = sql.identifier("a", "post_headline_trimmed_no_defaults");
const post_headline_trimmed_strictFunctionIdentifer = sql.identifier("a", "post_headline_trimmed_strict");
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
const compound_type_mutationFunctionIdentifer = sql.identifier("b", "compound_type_mutation");
const compound_type_queryFunctionIdentifer = sql.identifier("b", "compound_type_query");
const compound_type_set_mutationFunctionIdentifer = sql.identifier("b", "compound_type_set_mutation");
const mutation_compound_type_arrayFunctionIdentifer = sql.identifier("a", "mutation_compound_type_array");
const query_compound_type_arrayFunctionIdentifer = sql.identifier("a", "query_compound_type_array");
const compound_type_array_mutationFunctionIdentifer = sql.identifier("b", "compound_type_array_mutation");
const compound_type_array_queryFunctionIdentifer = sql.identifier("b", "compound_type_array_query");
const postUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_post_post = {
  executor: executor,
  name: "post",
  identifier: "main.a.post",
  from: postIdentifier,
  codec: postCodec,
  uniques: postUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "post"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {},
    canSelect: true,
    canInsert: false,
    canUpdate: false,
    canDelete: false
  }
};
const post_computed_compound_type_arrayFunctionIdentifer = sql.identifier("a", "post_computed_compound_type_array");
const table_mutationFunctionIdentifer = sql.identifier("c", "table_mutation");
const table_queryFunctionIdentifer = sql.identifier("c", "table_query");
const post_with_suffixFunctionIdentifer = sql.identifier("a", "post_with_suffix");
const post_manyFunctionIdentifer = sql.identifier("a", "post_many");
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
const person_first_postFunctionIdentifer = sql.identifier("c", "person_first_post");
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
    tags: {},
    canSelect: true,
    canInsert: true,
    canUpdate: true,
    canDelete: true
  }
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
const registryConfig_pgResources_types_types = {
  executor: executor,
  name: "types",
  identifier: "main.b.types",
  from: typesIdentifier,
  codec: typesCodec,
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
      schemaName: "b",
      name: "types"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {
      foreignKey: spec_types.extensions.tags.foreignKey
    },
    canSelect: false,
    canInsert: false,
    canUpdate: false,
    canDelete: false
  }
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
  pgExecutors: Object.assign(Object.create(null), {
    main: executor
  }),
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
    guid: guidCodec,
    varchar: TYPES.varchar,
    intervalArray: intervalArrayCodec,
    textArray: textArrayCodec,
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
    uuidArray: uuidArrayCodec,
    uuid: TYPES.uuid,
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
    types: typesCodec,
    colorArray: colorArrayCodec,
    anInt: anIntCodec,
    anotherInt: anotherIntCodec,
    numrange: numrangeCodec,
    daterange: daterangeCodec,
    date: TYPES.date,
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
    bytea: TYPES.bytea,
    byteaArray: byteaArrayCodec,
    ltree: spec_types_attributes_ltree_codec_ltree,
    "ltree[]": spec_types_attributes_ltree_array_codec_ltree_,
    bpchar: TYPES.bpchar,
    compoundTypeArray: listOfCodec(compoundTypeCodec, {
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "_compound_type"
        },
        tags: Object.create(null)
      },
      typeDelim: ",",
      description: undefined,
      name: "compoundTypeArray"
    }),
    jwtTokenArray: listOfCodec(jwtTokenCodec, {
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "_jwt_token"
        },
        tags: Object.create(null)
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
        tags: Object.create(null)
      },
      typeDelim: ",",
      description: undefined,
      name: "typesArray"
    }),
    int4Array: int4ArrayCodec,
    floatrange: floatrangeCodec,
    postArray: postArrayCodec,
    int8Array: int8ArrayCodec,
    tablefuncCrosstab2: recordCodec({
      name: "tablefuncCrosstab2",
      identifier: sql.identifier("a", "tablefunc_crosstab_2"),
      attributes: Object.assign(Object.create(null), {
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
      }),
      description: undefined,
      extensions: {
        isTableLike: false,
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "tablefunc_crosstab_2"
        },
        tags: Object.create(null)
      },
      executor: executor
    }),
    tablefuncCrosstab3: recordCodec({
      name: "tablefuncCrosstab3",
      identifier: sql.identifier("a", "tablefunc_crosstab_3"),
      attributes: Object.assign(Object.create(null), {
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
      }),
      description: undefined,
      extensions: {
        isTableLike: false,
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "tablefunc_crosstab_3"
        },
        tags: Object.create(null)
      },
      executor: executor
    }),
    tablefuncCrosstab4: recordCodec({
      name: "tablefuncCrosstab4",
      identifier: sql.identifier("a", "tablefunc_crosstab_4"),
      attributes: Object.assign(Object.create(null), {
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
      }),
      description: undefined,
      extensions: {
        isTableLike: false,
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "tablefunc_crosstab_4"
        },
        tags: Object.create(null)
      },
      executor: executor
    })
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
        tags: {},
        canExecute: true
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
        tags: {},
        singleOutputParameterName: "o",
        canExecute: false
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
        tags: {},
        singleOutputParameterName: "o",
        canExecute: false
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
        tags: {},
        canExecute: false
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
        tags: {},
        singleOutputParameterName: "o",
        canExecute: false
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
        tags: {},
        singleOutputParameterName: "o",
        canExecute: false
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
        tags: {},
        canExecute: false
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
        tags: {},
        canExecute: false
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
        tags: {},
        canExecute: false
      },
      description: undefined
    },
    return_void_mutation: {
      executor,
      name: "return_void_mutation",
      identifier: "main.a.return_void_mutation()",
      from(...args) {
        return sql`${return_void_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      isUnique: !false,
      codec: TYPES.void,
      uniques: [],
      isMutation: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "return_void_mutation"
        },
        tags: {},
        canExecute: false
      },
      description: undefined
    },
    mutation_interval_set: {
      executor,
      name: "mutation_interval_set",
      identifier: "main.a.mutation_interval_set()",
      from(...args) {
        return sql`${mutation_interval_setFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      isUnique: !true,
      codec: TYPES.interval,
      uniques: [],
      isMutation: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "mutation_interval_set"
        },
        tags: {},
        canExecute: false
      },
      description: undefined
    },
    query_interval_set: {
      executor,
      name: "query_interval_set",
      identifier: "main.a.query_interval_set()",
      from(...args) {
        return sql`${query_interval_setFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      isUnique: !true,
      codec: TYPES.interval,
      uniques: [],
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "query_interval_set"
        },
        tags: {},
        canExecute: false
      },
      description: undefined
    },
    static_big_integer: {
      executor,
      name: "static_big_integer",
      identifier: "main.a.static_big_integer()",
      from(...args) {
        return sql`${static_big_integerFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      isUnique: !true,
      codec: TYPES.bigint,
      uniques: [],
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "static_big_integer"
        },
        tags: {},
        canExecute: false
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
        tags: {},
        singleOutputParameterName: "o",
        canExecute: false
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
        tags: {},
        singleOutputParameterName: "col1",
        canExecute: false
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
        tags: {},
        singleOutputParameterName: "o",
        canExecute: false
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
        tags: {},
        singleOutputParameterName: "col1",
        canExecute: false
      },
      description: undefined
    },
    assert_something: {
      executor,
      name: "assert_something",
      identifier: "main.a.assert_something(text)",
      from(...args) {
        return sql`${assert_somethingFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "in_arg",
        required: true,
        notNull: false,
        codec: TYPES.text
      }],
      isUnique: !false,
      codec: TYPES.void,
      uniques: [],
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "assert_something"
        },
        tags: {},
        canExecute: false
      },
      description: undefined
    },
    assert_something_nx: {
      executor,
      name: "assert_something_nx",
      identifier: "main.a.assert_something_nx(text)",
      from(...args) {
        return sql`${assert_something_nxFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "in_arg",
        required: true,
        notNull: false,
        codec: TYPES.text
      }],
      isUnique: !false,
      codec: TYPES.void,
      uniques: [],
      isMutation: false,
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
        tags: {},
        canExecute: false
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
        tags: {},
        canExecute: false
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
        tags: {},
        canExecute: false
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
        tags: {},
        canExecute: false
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
        tags: {},
        canExecute: false
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
        tags: {},
        canExecute: false
      },
      description: undefined
    },
    add_1_mutation: {
      executor,
      name: "add_1_mutation",
      identifier: "main.a.add_1_mutation(int4,int4)",
      from(...args) {
        return sql`${add_1_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
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
      description: "lol, add some stuff 1 mutation"
    },
    add_1_query: {
      executor,
      name: "add_1_query",
      identifier: "main.a.add_1_query(int4,int4)",
      from(...args) {
        return sql`${add_1_queryFunctionIdentifer}(${sqlFromArgDigests(args)})`;
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
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "add_1_query"
        },
        tags: {},
        canExecute: false
      },
      description: "lol, add some stuff 1 query"
    },
    add_2_mutation: {
      executor,
      name: "add_2_mutation",
      identifier: "main.a.add_2_mutation(int4,int4)",
      from(...args) {
        return sql`${add_2_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "a",
        required: true,
        notNull: true,
        codec: TYPES.int
      }, {
        name: "b",
        required: false,
        notNull: true,
        codec: TYPES.int
      }],
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "add_2_mutation"
        },
        tags: {},
        canExecute: false
      },
      description: "lol, add some stuff 2 mutation"
    },
    add_2_query: {
      executor,
      name: "add_2_query",
      identifier: "main.a.add_2_query(int4,int4)",
      from(...args) {
        return sql`${add_2_queryFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "a",
        required: true,
        notNull: true,
        codec: TYPES.int
      }, {
        name: "b",
        required: false,
        notNull: true,
        codec: TYPES.int
      }],
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "add_2_query"
        },
        tags: {},
        canExecute: false
      },
      description: "lol, add some stuff 2 query"
    },
    add_3_mutation: {
      executor,
      name: "add_3_mutation",
      identifier: "main.a.add_3_mutation(int4,int4)",
      from(...args) {
        return sql`${add_3_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "a",
        required: true,
        notNull: false,
        codec: TYPES.int
      }, {
        name: "",
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
          schemaName: "a",
          name: "add_3_mutation"
        },
        tags: {},
        canExecute: false
      },
      description: "lol, add some stuff 3 mutation"
    },
    add_3_query: {
      executor,
      name: "add_3_query",
      identifier: "main.a.add_3_query(int4,int4)",
      from(...args) {
        return sql`${add_3_queryFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "a",
        required: true,
        notNull: false,
        codec: TYPES.int
      }, {
        name: "",
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
          schemaName: "a",
          name: "add_3_query"
        },
        tags: {},
        canExecute: false
      },
      description: "lol, add some stuff 3 query"
    },
    add_4_mutation: {
      executor,
      name: "add_4_mutation",
      identifier: "main.a.add_4_mutation(int4,int4)",
      from(...args) {
        return sql`${add_4_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "",
        required: true,
        notNull: false,
        codec: TYPES.int
      }, {
        name: "b",
        required: false,
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
          schemaName: "a",
          name: "add_4_mutation"
        },
        tags: {},
        canExecute: false
      },
      description: "lol, add some stuff 4 mutation"
    },
    add_4_mutation_error: {
      executor,
      name: "add_4_mutation_error",
      identifier: "main.a.add_4_mutation_error(int4,int4)",
      from(...args) {
        return sql`${add_4_mutation_errorFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "",
        required: true,
        notNull: false,
        codec: TYPES.int
      }, {
        name: "b",
        required: false,
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
          schemaName: "a",
          name: "add_4_mutation_error"
        },
        tags: {},
        canExecute: false
      },
      description: undefined
    },
    add_4_query: {
      executor,
      name: "add_4_query",
      identifier: "main.a.add_4_query(int4,int4)",
      from(...args) {
        return sql`${add_4_queryFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "",
        required: true,
        notNull: false,
        codec: TYPES.int
      }, {
        name: "b",
        required: false,
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
          schemaName: "a",
          name: "add_4_query"
        },
        tags: {},
        canExecute: false
      },
      description: "lol, add some stuff 4 query"
    },
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
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "mult_1"
        },
        tags: {},
        canExecute: false
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
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "mult_2"
        },
        tags: {},
        canExecute: false
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
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "mult_3"
        },
        tags: {},
        canExecute: false
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
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "mult_4"
        },
        tags: {},
        canExecute: false
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
        tags: {},
        singleOutputParameterName: "ino",
        canExecute: false
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
        tags: {},
        canExecute: false
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
        tags: {},
        canExecute: false
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
        tags: {},
        canExecute: false
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
        tags: {},
        singleOutputParameterName: "ino",
        canExecute: false
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
        tags: {},
        canExecute: false
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
        tags: {},
        canExecute: false
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
        tags: {},
        canExecute: false
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
          behavior: ["+list -connection"]
        },
        canExecute: false
      },
      description: undefined
    },
    optional_missing_middle_1: {
      executor,
      name: "optional_missing_middle_1",
      identifier: "main.a.optional_missing_middle_1(int4,int4,int4)",
      from(...args) {
        return sql`${optional_missing_middle_1FunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
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
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "optional_missing_middle_1"
        },
        tags: {},
        canExecute: false
      },
      description: undefined
    },
    optional_missing_middle_2: {
      executor,
      name: "optional_missing_middle_2",
      identifier: "main.a.optional_missing_middle_2(int4,int4,int4)",
      from(...args) {
        return sql`${optional_missing_middle_2FunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
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
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "optional_missing_middle_2"
        },
        tags: {},
        canExecute: false
      },
      description: undefined
    },
    optional_missing_middle_3: {
      executor,
      name: "optional_missing_middle_3",
      identifier: "main.a.optional_missing_middle_3(int4,int4,int4)",
      from(...args) {
        return sql`${optional_missing_middle_3FunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
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
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "optional_missing_middle_3"
        },
        tags: {},
        canExecute: false
      },
      description: undefined
    },
    optional_missing_middle_4: {
      executor,
      name: "optional_missing_middle_4",
      identifier: "main.a.optional_missing_middle_4(int4,int4,int4)",
      from(...args) {
        return sql`${optional_missing_middle_4FunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
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
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "optional_missing_middle_4"
        },
        tags: {},
        canExecute: false
      },
      description: undefined
    },
    optional_missing_middle_5: {
      executor,
      name: "optional_missing_middle_5",
      identifier: "main.a.optional_missing_middle_5(int4,int4,int4)",
      from(...args) {
        return sql`${optional_missing_middle_5FunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
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
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "optional_missing_middle_5"
        },
        tags: {},
        canExecute: false
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
        tags: {},
        canExecute: false
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
        tags: {},
        canExecute: false
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
        tags: {},
        canExecute: false
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
        tags: {},
        canExecute: false
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
        tags: {},
        canExecute: false
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
        tags: {},
        canExecute: false
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
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "guid_fn"
        },
        tags: {},
        canExecute: false
      },
      description: undefined
    },
    mutation_interval_array: {
      executor,
      name: "mutation_interval_array",
      identifier: "main.a.mutation_interval_array()",
      from(...args) {
        return sql`${mutation_interval_arrayFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      isUnique: !false,
      codec: intervalArrayCodec,
      uniques: [],
      isMutation: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "mutation_interval_array"
        },
        tags: {},
        canExecute: false
      },
      description: undefined
    },
    query_interval_array: {
      executor,
      name: "query_interval_array",
      identifier: "main.a.query_interval_array()",
      from(...args) {
        return sql`${query_interval_arrayFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      isUnique: !false,
      codec: intervalArrayCodec,
      uniques: [],
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "query_interval_array"
        },
        tags: {},
        canExecute: false
      },
      description: undefined
    },
    mutation_text_array: {
      executor,
      name: "mutation_text_array",
      identifier: "main.a.mutation_text_array()",
      from(...args) {
        return sql`${mutation_text_arrayFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      isUnique: !false,
      codec: textArrayCodec,
      uniques: [],
      isMutation: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "mutation_text_array"
        },
        tags: {},
        canExecute: false
      },
      description: undefined
    },
    query_text_array: {
      executor,
      name: "query_text_array",
      identifier: "main.a.query_text_array()",
      from(...args) {
        return sql`${query_text_arrayFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      isUnique: !false,
      codec: textArrayCodec,
      uniques: [],
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "query_text_array"
        },
        tags: {},
        canExecute: false
      },
      description: undefined
    },
    non_updatable_view: {
      executor: executor,
      name: "non_updatable_view",
      identifier: "main.a.non_updatable_view",
      from: nonUpdatableViewIdentifier,
      codec: nonUpdatableViewCodec,
      uniques: [],
      isVirtual: false,
      description: undefined,
      extensions: {
        description: undefined,
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "non_updatable_view"
        },
        isInsertable: false,
        isUpdatable: false,
        isDeletable: false,
        tags: {},
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
      uniques: [{
        isPrimary: true,
        attributes: ["id"],
        description: undefined,
        extensions: {
          tags: Object.create(null)
        }
      }],
      isVirtual: false,
      description: "Should output as Input",
      extensions: {
        description: "Should output as Input",
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "inputs"
        },
        isInsertable: true,
        isUpdatable: true,
        isDeletable: true,
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false,
        canDelete: false
      }
    },
    patchs: {
      executor: executor,
      name: "patchs",
      identifier: "main.a.patchs",
      from: patchsIdentifier,
      codec: patchsCodec,
      uniques: [{
        isPrimary: true,
        attributes: ["id"],
        description: undefined,
        extensions: {
          tags: Object.create(null)
        }
      }],
      isVirtual: false,
      description: "Should output as Patch",
      extensions: {
        description: "Should output as Patch",
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "patchs"
        },
        isInsertable: true,
        isUpdatable: true,
        isDeletable: true,
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false,
        canDelete: false
      }
    },
    reserved: {
      executor: executor,
      name: "reserved",
      identifier: "main.a.reserved",
      from: reservedIdentifier,
      codec: reservedCodec,
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
          schemaName: "a",
          name: "reserved"
        },
        isInsertable: true,
        isUpdatable: true,
        isDeletable: true,
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false,
        canDelete: false
      }
    },
    reservedPatchs: {
      executor: executor,
      name: "reservedPatchs",
      identifier: "main.a.reservedPatchs",
      from: reservedPatchsIdentifier,
      codec: reservedPatchsCodec,
      uniques: [{
        isPrimary: true,
        attributes: ["id"],
        description: undefined,
        extensions: {
          tags: Object.create(null)
        }
      }],
      isVirtual: false,
      description: "`reservedPatchs` table should get renamed to ReservedPatchRecord to prevent clashes with ReservedPatch from `reserved` table",
      extensions: {
        description: "`reservedPatchs` table should get renamed to ReservedPatchRecord to prevent clashes with ReservedPatch from `reserved` table",
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "reservedPatchs"
        },
        isInsertable: true,
        isUpdatable: true,
        isDeletable: true,
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false,
        canDelete: false
      }
    },
    reserved_input: {
      executor: executor,
      name: "reserved_input",
      identifier: "main.a.reserved_input",
      from: reservedInputIdentifier,
      codec: reservedInputCodec,
      uniques: [{
        isPrimary: true,
        attributes: ["id"],
        description: undefined,
        extensions: {
          tags: Object.create(null)
        }
      }],
      isVirtual: false,
      description: "`reserved_input` table should get renamed to ReservedInputRecord to prevent clashes with ReservedInput from `reserved` table",
      extensions: {
        description: "`reserved_input` table should get renamed to ReservedInputRecord to prevent clashes with ReservedInput from `reserved` table",
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "reserved_input"
        },
        isInsertable: true,
        isUpdatable: true,
        isDeletable: true,
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false,
        canDelete: false
      }
    },
    default_value: {
      executor: executor,
      name: "default_value",
      identifier: "main.a.default_value",
      from: defaultValueIdentifier,
      codec: defaultValueCodec,
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
          schemaName: "a",
          name: "default_value"
        },
        isInsertable: true,
        isUpdatable: true,
        isDeletable: true,
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false,
        canDelete: false
      }
    },
    no_primary_key: {
      executor: executor,
      name: "no_primary_key",
      identifier: "main.a.no_primary_key",
      from: noPrimaryKeyIdentifier,
      codec: noPrimaryKeyCodec,
      uniques: [{
        isPrimary: false,
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
          schemaName: "a",
          name: "no_primary_key"
        },
        isInsertable: true,
        isUpdatable: true,
        isDeletable: true,
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false,
        canDelete: false
      }
    },
    unique_foreign_key: registryConfig_pgResources_unique_foreign_key_unique_foreign_key,
    my_table: {
      executor: executor,
      name: "my_table",
      identifier: "main.c.my_table",
      from: myTableIdentifier,
      codec: myTableCodec,
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
          name: "my_table"
        },
        isInsertable: true,
        isUpdatable: true,
        isDeletable: true,
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false,
        canDelete: false
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
        isInsertable: true,
        isUpdatable: true,
        isDeletable: true,
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false,
        canDelete: false
      }
    },
    foreign_key: registryConfig_pgResources_foreign_key_foreign_key,
    testview: {
      executor: executor,
      name: "testview",
      identifier: "main.a.testview",
      from: testviewIdentifier,
      codec: testviewCodec,
      uniques: [],
      isVirtual: false,
      description: undefined,
      extensions: {
        description: undefined,
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "testview"
        },
        isInsertable: true,
        isUpdatable: true,
        isDeletable: true,
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false,
        canDelete: false
      }
    },
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
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "list_bde_mutation"
        },
        tags: {},
        canExecute: false
      },
      description: undefined
    },
    view_table: {
      executor: executor,
      name: "view_table",
      identifier: "main.a.view_table",
      from: viewTableIdentifier,
      codec: viewTableCodec,
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
          schemaName: "a",
          name: "view_table"
        },
        isInsertable: true,
        isUpdatable: true,
        isDeletable: true,
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false,
        canDelete: false
      }
    },
    compound_key: registryConfig_pgResources_compound_key_compound_key,
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
        tags: {},
        canExecute: false
      },
      description: undefined
    },
    similar_table_1: {
      executor: executor,
      name: "similar_table_1",
      identifier: "main.a.similar_table_1",
      from: similarTable1Identifier,
      codec: similarTable1Codec,
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
          schemaName: "a",
          name: "similar_table_1"
        },
        isInsertable: true,
        isUpdatable: true,
        isDeletable: true,
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false,
        canDelete: false
      }
    },
    similar_table_2: {
      executor: executor,
      name: "similar_table_2",
      identifier: "main.a.similar_table_2",
      from: similarTable2Identifier,
      codec: similarTable2Codec,
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
          schemaName: "a",
          name: "similar_table_2"
        },
        isInsertable: true,
        isUpdatable: true,
        isDeletable: true,
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false,
        canDelete: false
      }
    },
    updatable_view: {
      executor: executor,
      name: "updatable_view",
      identifier: "main.b.updatable_view",
      from: updatableViewIdentifier,
      codec: updatableViewCodec,
      uniques: [{
        isPrimary: false,
        attributes: ["x"],
        description: undefined,
        extensions: {
          tags: Object.assign(Object.create(null), {
            behavior: "-single -update -delete"
          })
        }
      }],
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
        },
        canSelect: false,
        canInsert: false,
        canUpdate: false,
        canDelete: false
      }
    },
    null_test_record: {
      executor: executor,
      name: "null_test_record",
      identifier: "main.c.null_test_record",
      from: nullTestRecordIdentifier,
      codec: nullTestRecordCodec,
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
          name: "null_test_record"
        },
        isInsertable: true,
        isUpdatable: true,
        isDeletable: true,
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false,
        canDelete: false
      }
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
        tags: {},
        canExecute: true
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
        tags: {},
        canSelect: false,
        canInsert: false,
        canUpdate: false,
        canDelete: false
      }
    },
    issue756: registryConfig_pgResources_issue756_issue756,
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
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "authenticate_fail"
        },
        tags: {},
        canExecute: false
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
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "authenticate"
        },
        tags: {},
        canExecute: false
      },
      description: undefined
    }),
    left_arm: registryConfig_pgResources_left_arm_left_arm,
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
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "authenticate_many"
        },
        tags: {},
        canExecute: false
      },
      description: undefined
    }),
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
        tags: {},
        canExecute: false
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
        tags: {},
        canExecute: false
      },
      description: undefined
    }),
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
          resultFieldName: "leftArm"
        },
        canExecute: true
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
        tags: {},
        canExecute: false
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
        tags: {},
        canExecute: false
      },
      description: undefined
    },
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
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "authenticate_payload"
        },
        tags: {},
        canExecute: false
      },
      description: undefined
    }),
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
        tags: {},
        canExecute: false
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
        tags: {},
        canExecute: false
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
        tags: {},
        canExecute: false
      },
      description: undefined
    },
    post_computed_interval_set: {
      executor,
      name: "post_computed_interval_set",
      identifier: "main.a.post_computed_interval_set(a.post)",
      from(...args) {
        return sql`${post_computed_interval_setFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "post",
        required: true,
        notNull: false,
        codec: postCodec
      }],
      isUnique: !true,
      codec: TYPES.interval,
      uniques: [],
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "post_computed_interval_set"
        },
        tags: {},
        canExecute: false
      },
      description: undefined
    },
    post_computed_interval_array: {
      executor,
      name: "post_computed_interval_array",
      identifier: "main.a.post_computed_interval_array(a.post)",
      from(...args) {
        return sql`${post_computed_interval_arrayFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "post",
        required: true,
        notNull: false,
        codec: postCodec
      }],
      isUnique: !false,
      codec: intervalArrayCodec,
      uniques: [],
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "post_computed_interval_array"
        },
        tags: {},
        canExecute: false
      },
      description: undefined
    },
    post_computed_text_array: {
      executor,
      name: "post_computed_text_array",
      identifier: "main.a.post_computed_text_array(a.post)",
      from(...args) {
        return sql`${post_computed_text_arrayFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "post",
        required: true,
        notNull: false,
        codec: postCodec
      }],
      isUnique: !false,
      codec: textArrayCodec,
      uniques: [],
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "post_computed_text_array"
        },
        tags: {},
        canExecute: false
      },
      description: undefined
    },
    post_computed_with_optional_arg: {
      executor,
      name: "post_computed_with_optional_arg",
      identifier: "main.a.post_computed_with_optional_arg(a.post,int4)",
      from(...args) {
        return sql`${post_computed_with_optional_argFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "post",
        required: true,
        notNull: true,
        codec: postCodec
      }, {
        name: "i",
        required: false,
        notNull: true,
        codec: TYPES.int
      }],
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: false,
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
      description: undefined
    },
    post_computed_with_required_arg: {
      executor,
      name: "post_computed_with_required_arg",
      identifier: "main.a.post_computed_with_required_arg(a.post,int4)",
      from(...args) {
        return sql`${post_computed_with_required_argFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "post",
        required: true,
        notNull: true,
        codec: postCodec
      }, {
        name: "i",
        required: true,
        notNull: true,
        codec: TYPES.int
      }],
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: false,
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
      description: undefined
    },
    post_headline_trimmed: {
      executor,
      name: "post_headline_trimmed",
      identifier: "main.a.post_headline_trimmed(a.post,int4,text)",
      from(...args) {
        return sql`${post_headline_trimmedFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "post",
        required: true,
        notNull: false,
        codec: postCodec
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
      }],
      isUnique: !false,
      codec: TYPES.text,
      uniques: [],
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "post_headline_trimmed"
        },
        tags: {},
        canExecute: false
      },
      description: undefined
    },
    post_headline_trimmed_no_defaults: {
      executor,
      name: "post_headline_trimmed_no_defaults",
      identifier: "main.a.post_headline_trimmed_no_defaults(a.post,int4,text)",
      from(...args) {
        return sql`${post_headline_trimmed_no_defaultsFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "post",
        required: true,
        notNull: false,
        codec: postCodec
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
      }],
      isUnique: !false,
      codec: TYPES.text,
      uniques: [],
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "post_headline_trimmed_no_defaults"
        },
        tags: {},
        canExecute: false
      },
      description: undefined
    },
    post_headline_trimmed_strict: {
      executor,
      name: "post_headline_trimmed_strict",
      identifier: "main.a.post_headline_trimmed_strict(a.post,int4,text)",
      from(...args) {
        return sql`${post_headline_trimmed_strictFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "post",
        required: true,
        notNull: true,
        codec: postCodec
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
      }],
      isUnique: !false,
      codec: TYPES.text,
      uniques: [],
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "post_headline_trimmed_strict"
        },
        tags: {},
        canExecute: false
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
        tags: {},
        canExecute: false
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
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "compound_type_set_query"
        },
        tags: {},
        canExecute: false
      },
      description: undefined
    }),
    compound_type_mutation: PgResource.functionResourceOptions(resourceConfig_compound_type, {
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
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "compound_type_mutation"
        },
        tags: {},
        canExecute: false
      },
      description: undefined
    }),
    compound_type_query: PgResource.functionResourceOptions(resourceConfig_compound_type, {
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
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "compound_type_query"
        },
        tags: {},
        canExecute: false
      },
      description: undefined
    }),
    compound_type_set_mutation: PgResource.functionResourceOptions(resourceConfig_compound_type, {
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
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "compound_type_set_mutation"
        },
        tags: {},
        canExecute: false
      },
      description: undefined
    }),
    mutation_compound_type_array: PgResource.functionResourceOptions(resourceConfig_compound_type, {
      name: "mutation_compound_type_array",
      identifier: "main.a.mutation_compound_type_array(c.compound_type)",
      from(...args) {
        return sql`${mutation_compound_type_arrayFunctionIdentifer}(${sqlFromArgDigests(args)})`;
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
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "mutation_compound_type_array"
        },
        tags: {},
        canExecute: false
      },
      description: undefined
    }),
    query_compound_type_array: PgResource.functionResourceOptions(resourceConfig_compound_type, {
      name: "query_compound_type_array",
      identifier: "main.a.query_compound_type_array(c.compound_type)",
      from(...args) {
        return sql`${query_compound_type_arrayFunctionIdentifer}(${sqlFromArgDigests(args)})`;
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
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "query_compound_type_array"
        },
        tags: {},
        canExecute: false
      },
      description: undefined
    }),
    compound_type_array_mutation: PgResource.functionResourceOptions(resourceConfig_compound_type, {
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
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "compound_type_array_mutation"
        },
        tags: {},
        canExecute: false
      },
      description: undefined
    }),
    compound_type_array_query: PgResource.functionResourceOptions(resourceConfig_compound_type, {
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
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "compound_type_array_query"
        },
        tags: {},
        canExecute: false
      },
      description: undefined
    }),
    post: registryConfig_pgResources_post_post,
    post_computed_compound_type_array: PgResource.functionResourceOptions(resourceConfig_compound_type, {
      name: "post_computed_compound_type_array",
      identifier: "main.a.post_computed_compound_type_array(a.post,c.compound_type)",
      from(...args) {
        return sql`${post_computed_compound_type_arrayFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "post",
        required: true,
        notNull: false,
        codec: postCodec
      }, {
        name: "object",
        required: true,
        notNull: false,
        codec: compoundTypeCodec
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
        tags: {},
        canExecute: false
      },
      description: undefined
    }),
    table_mutation: PgResource.functionResourceOptions(registryConfig_pgResources_post_post, {
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
        tags: {},
        canExecute: false
      },
      description: undefined
    }),
    table_query: PgResource.functionResourceOptions(registryConfig_pgResources_post_post, {
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
        tags: {},
        canExecute: false
      },
      description: undefined
    }),
    post_with_suffix: PgResource.functionResourceOptions(registryConfig_pgResources_post_post, {
      name: "post_with_suffix",
      identifier: "main.a.post_with_suffix(a.post,text)",
      from(...args) {
        return sql`${post_with_suffixFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "post",
        required: true,
        notNull: false,
        codec: postCodec
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
          deprecated: "This is deprecated (comment on function a.post_with_suffix)."
        },
        canExecute: true
      },
      description: undefined
    }),
    post_many: PgResource.functionResourceOptions(registryConfig_pgResources_post_post, {
      name: "post_many",
      identifier: "main.a.post_many(a._post)",
      from(...args) {
        return sql`${post_manyFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "posts",
        required: true,
        notNull: false,
        codec: postArrayCodec
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
        tags: {},
        canExecute: false
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
          behavior: ["filter filterBy", "orderBy order resource:connection:backwards"]
        },
        singleOutputParameterName: "o1",
        canExecute: false
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
          behavior: ["orderBy order resource:connection:backwards"]
        },
        canExecute: false
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
        tags: {},
        canExecute: false
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
        tags: {},
        singleOutputParameterName: "ino",
        canExecute: false
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
        tags: {},
        canExecute: false
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
          deprecated: "This is deprecated (comment on function c.person_exists)."
        },
        canExecute: false
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
        tags: {},
        canExecute: false
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
        tags: {},
        canExecute: false
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
        tags: {},
        canExecute: false
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
        tags: {},
        canExecute: false
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
        tags: {},
        canExecute: false
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
        tags: {},
        canExecute: false
      },
      description: undefined
    },
    person_first_post: PgResource.functionResourceOptions(registryConfig_pgResources_post_post, {
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
        tags: {},
        canExecute: false
      },
      description: "The first post by the person."
    }),
    person: registryConfig_pgResources_person_person,
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
          deprecated: "This is deprecated (comment on function c.badly_behaved_function)."
        },
        canExecute: false
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
        tags: {},
        canExecute: false
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
        tags: {},
        canExecute: false
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
        tags: {},
        canExecute: false
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
        tags: {},
        canExecute: false
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
        tags: {},
        canExecute: false
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
          behavior: ["filter filterBy", "orderBy order resource:connection:backwards"]
        },
        canExecute: false
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
        tags: {},
        canExecute: false
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
        tags: {},
        singleOutputParameterName: "person",
        canExecute: false
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
          behavior: ["orderBy order resource:connection:backwards"]
        },
        canExecute: false
      },
      description: undefined
    }),
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
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "type_function_connection"
        },
        tags: {},
        canExecute: false
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
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "type_function_connection_mutation"
        },
        tags: {},
        canExecute: false
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
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "type_function"
        },
        tags: {},
        canExecute: false
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
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "type_function_mutation"
        },
        tags: {},
        canExecute: false
      },
      description: undefined
    }),
    person_type_function_connection: PgResource.functionResourceOptions(registryConfig_pgResources_types_types, {
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
        tags: {},
        canExecute: false
      },
      description: undefined
    }),
    person_type_function: PgResource.functionResourceOptions(registryConfig_pgResources_types_types, {
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
        tags: {},
        canExecute: false
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
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "type_function_list"
        },
        tags: {},
        canExecute: false
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
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "type_function_list_mutation"
        },
        tags: {},
        canExecute: false
      },
      description: undefined
    }),
    person_type_function_list: PgResource.functionResourceOptions(registryConfig_pgResources_types_types, {
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
        tags: {},
        canExecute: false
      },
      description: undefined
    })
  }),
  pgRelations: Object.assign(Object.create(null), {
    foreignKey: Object.assign(Object.create(null), {
      compoundKeyByMyCompoundKey1AndCompoundKey2: {
        localCodec: foreignKeyCodec,
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
        localCodec: foreignKeyCodec,
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
        localCodec: postCodec,
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
        localCodec: postCodec,
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
        localCodec: postCodec,
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
        localCodec: uniqueForeignKeyCodec,
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
        localCodec: authPayloadCodec,
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
        localCodec: typesCodec,
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
        localCodec: typesCodec,
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
      },
      foreignKeysByTheirCompoundKey1AndCompoundKey2: {
        localCodec: compoundKeyCodec,
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
        localCodec: compoundKeyCodec,
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
      postsByTheirAuthorId: {
        localCodec: personCodec,
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
        localCodec: personCodec,
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
    }),
    personSecret: Object.assign(Object.create(null), {
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
  Post: {
    typeName: "Post",
    codec: nodeIdCodecs_base64JSON_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("posts", false), $record.get("id")]);
    },
    getSpec($list) {
      return {
        id: inhibitOnNull(access($list, [1]))
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
function InternetAddressSerialize(value) {
  return "" + value;
}
const pgFieldSource_post_computed_with_optional_argPgResource = registry.pgResources["post_computed_with_optional_arg"];
const pgFieldSource_person_computed_outPgResource = registry.pgResources["person_computed_out"];
const pgFieldSource_person_first_namePgResource = registry.pgResources["person_first_name"];
const argDetailsSimple3 = [{
  graphqlArgName: "leftArm",
  postgresArgName: "left_arm",
  pgCodec: leftArmCodec,
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
const specFromArgs = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.LeftArm, $nodeId);
};
const specFromArgs2 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Person, $nodeId);
};
const specFromArgs3 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.PersonSecret, $nodeId);
};
const specFromArgs4 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.LeftArm, $nodeId);
};
const specFromArgs5 = args => {
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
    allPosts: {
      plan() {
        return connection(pgResource_postPgResource.find());
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
  Email: {
    serialize: GraphQLString.serialize,
    parseValue: GraphQLString.parseValue,
    parseLiteral: GraphQLString.parseLiteral
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
  InternetAddress: {
    serialize: InternetAddressSerialize,
    parseValue: InternetAddressSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"InternetAddress" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
    }
  },
  Datetime: {
    serialize: InternetAddressSerialize,
    parseValue: InternetAddressSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"Datetime" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
    }
  },
  PostsConnection: {
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
  Cursor: {
    serialize: InternetAddressSerialize,
    parseValue: InternetAddressSerialize,
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
  PostsOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    COMPUTED_WITH_OPTIONAL_ARG_ASC: {
      applyPlan(step) {
        if (typeof pgFieldSource_post_computed_with_optional_argPgResource.from !== "function") {
          throw new Error("Invalid computed attribute 'from'");
        }
        const expression = sql`${pgFieldSource_post_computed_with_optional_argPgResource.from({
          placeholder: step.alias
        })}`;
        step.orderBy({
          codec: pgFieldSource_post_computed_with_optional_argPgResource.codec,
          fragment: expression,
          direction: "asc".toUpperCase()
        });
      }
    },
    COMPUTED_WITH_OPTIONAL_ARG_DESC: {
      applyPlan(step) {
        if (typeof pgFieldSource_post_computed_with_optional_argPgResource.from !== "function") {
          throw new Error("Invalid computed attribute 'from'");
        }
        const expression = sql`${pgFieldSource_post_computed_with_optional_argPgResource.from({
          placeholder: step.alias
        })}`;
        step.orderBy({
          codec: pgFieldSource_post_computed_with_optional_argPgResource.codec,
          fragment: expression,
          direction: "desc".toUpperCase()
        });
      }
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        postUniques[0].attributes.forEach(attributeName => {
          const attribute = postCodec.attributes[attributeName];
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
        postUniques[0].attributes.forEach(attributeName => {
          const attribute = postCodec.attributes[attributeName];
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_post.attributes.id.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_post.attributes.headline.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_post.attributes.body.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_post.attributes.author_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    computedWithOptionalArg: {
      applyPlan($condition, val) {
        if (typeof pgFieldSource_post_computed_with_optional_argPgResource.from !== "function") {
          throw new Error("Invalid computed attribute 'from'");
        }
        const expression = sql`${pgFieldSource_post_computed_with_optional_argPgResource.from({
          placeholder: $condition.alias
        })}`;
        if (val.getRaw().evalIs(null)) {
          $condition.where(sql`${expression} is null`);
        } else {
          $condition.where(sql`${expression} = ${$condition.placeholder(val.get(), pgFieldSource_post_computed_with_optional_argPgResource.codec)}`);
        }
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
  PeopleOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    COMPUTED_OUT_ASC: {
      applyPlan(step) {
        if (typeof pgFieldSource_person_computed_outPgResource.from !== "function") {
          throw new Error("Invalid computed attribute 'from'");
        }
        const expression = sql`${pgFieldSource_person_computed_outPgResource.from({
          placeholder: step.alias
        })}`;
        step.orderBy({
          codec: pgFieldSource_person_computed_outPgResource.codec,
          fragment: expression,
          direction: "asc".toUpperCase()
        });
      }
    },
    COMPUTED_OUT_DESC: {
      applyPlan(step) {
        if (typeof pgFieldSource_person_computed_outPgResource.from !== "function") {
          throw new Error("Invalid computed attribute 'from'");
        }
        const expression = sql`${pgFieldSource_person_computed_outPgResource.from({
          placeholder: step.alias
        })}`;
        step.orderBy({
          codec: pgFieldSource_person_computed_outPgResource.codec,
          fragment: expression,
          direction: "desc".toUpperCase()
        });
      }
    },
    FIRST_NAME_ASC: {
      applyPlan(step) {
        if (typeof pgFieldSource_person_first_namePgResource.from !== "function") {
          throw new Error("Invalid computed attribute 'from'");
        }
        const expression = sql`${pgFieldSource_person_first_namePgResource.from({
          placeholder: step.alias
        })}`;
        step.orderBy({
          codec: pgFieldSource_person_first_namePgResource.codec,
          fragment: expression,
          direction: "asc".toUpperCase()
        });
      }
    },
    FIRST_NAME_DESC: {
      applyPlan(step) {
        if (typeof pgFieldSource_person_first_namePgResource.from !== "function") {
          throw new Error("Invalid computed attribute 'from'");
        }
        const expression = sql`${pgFieldSource_person_first_namePgResource.from({
          placeholder: step.alias
        })}`;
        step.orderBy({
          codec: pgFieldSource_person_first_namePgResource.codec,
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
        if (typeof pgFieldSource_person_computed_outPgResource.from !== "function") {
          throw new Error("Invalid computed attribute 'from'");
        }
        const expression = sql`${pgFieldSource_person_computed_outPgResource.from({
          placeholder: $condition.alias
        })}`;
        if (val.getRaw().evalIs(null)) {
          $condition.where(sql`${expression} is null`);
        } else {
          $condition.where(sql`${expression} = ${$condition.placeholder(val.get(), pgFieldSource_person_computed_outPgResource.codec)}`);
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
