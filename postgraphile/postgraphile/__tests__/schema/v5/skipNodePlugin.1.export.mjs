import { PgDeleteSingleStep, PgExecutor, PgResource, PgSelectSingleStep, PgSelectStep, TYPES, assertPgClassSingleStep, domainOfCodec, enumCodec, listOfCodec, makeRegistry, pgClassExpression, pgDeleteSingle, pgFromExpression, pgInsertSingle, pgSelectFromRecord, pgSelectFromRecords, pgSelectSingleFromRecord, pgUpdateSingle, rangeOfCodec, recordCodec, sqlFromArgDigests, sqlValueWithCodec } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ObjectStep, __ValueStep, assertEdgeCapableStep, assertExecutableStep, assertPageInfoCapableStep, bakedInput, bakedInputRuntime, connection, constant, context, createObjectAndApplyChildren, first, get as get2, makeGrafastSchema, object, operationPlan, rootValue, stepAMayDependOnStepB, trap } from "grafast";
import { GraphQLError, GraphQLInt, GraphQLString, Kind, valueFromASTUntyped } from "graphql";
import { sql } from "pg-sql2";
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
const registryConfig_pgCodecs_CFuncOutOutRecord_CFuncOutOutRecord = recordCodec({
  name: "CFuncOutOutRecord",
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
const registryConfig_pgCodecs_CFuncOutOutSetofRecord_CFuncOutOutSetofRecord = recordCodec({
  name: "CFuncOutOutSetofRecord",
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
const registryConfig_pgCodecs_CFuncOutOutUnnamedRecord_CFuncOutOutUnnamedRecord = recordCodec({
  name: "CFuncOutOutUnnamedRecord",
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
const registryConfig_pgCodecs_CMutationOutOutRecord_CMutationOutOutRecord = recordCodec({
  name: "CMutationOutOutRecord",
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
const registryConfig_pgCodecs_CMutationOutOutSetofRecord_CMutationOutOutSetofRecord = recordCodec({
  name: "CMutationOutOutSetofRecord",
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
const registryConfig_pgCodecs_CMutationOutOutUnnamedRecord_CMutationOutOutUnnamedRecord = recordCodec({
  name: "CMutationOutOutUnnamedRecord",
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
const registryConfig_pgCodecs_CSearchTestSummariesRecord_CSearchTestSummariesRecord = recordCodec({
  name: "CSearchTestSummariesRecord",
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
const registryConfig_pgCodecs_CFuncOutUnnamedOutOutUnnamedRecord_CFuncOutUnnamedOutOutUnnamedRecord = recordCodec({
  name: "CFuncOutUnnamedOutOutUnnamedRecord",
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
const registryConfig_pgCodecs_CMutationOutUnnamedOutOutUnnamedRecord_CMutationOutUnnamedOutOutUnnamedRecord = recordCodec({
  name: "CMutationOutUnnamedOutOutUnnamedRecord",
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
const registryConfig_pgCodecs_CMutationReturnsTableMultiColRecord_CMutationReturnsTableMultiColRecord = recordCodec({
  name: "CMutationReturnsTableMultiColRecord",
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
const registryConfig_pgCodecs_CFuncReturnsTableMultiColRecord_CFuncReturnsTableMultiColRecord = recordCodec({
  name: "CFuncReturnsTableMultiColRecord",
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
const bGuidCodec = domainOfCodec(TYPES.varchar, "bGuid", sql.identifier("b", "guid"), {
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
const pgCatalogIntervalArrayCodec = listOfCodec(TYPES.interval, {
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
  name: "pgCatalogIntervalArray"
});
const pgCatalogTextArrayCodec = listOfCodec(TYPES.text, {
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
  name: "pgCatalogTextArray"
});
const nonUpdatableViewIdentifier = sql.identifier("a", "non_updatable_view");
const nonUpdatableViewCodec = recordCodec({
  name: "nonUpdatableView",
  identifier: nonUpdatableViewIdentifier,
  attributes: {
    __proto__: null,
    "?column?": {
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
      schemaName: "a",
      name: "non_updatable_view"
    },
    tags: {
      __proto__: null
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
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {}
      }
    }
  },
  description: "Should output as Input",
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "inputs"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const patchsIdentifier = sql.identifier("a", "patchs");
const patchsCodec = recordCodec({
  name: "patchs",
  identifier: patchsIdentifier,
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
    }
  },
  description: "Should output as Patch",
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "patchs"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const reservedIdentifier = sql.identifier("a", "reserved");
const reservedCodec = recordCodec({
  name: "reserved",
  identifier: reservedIdentifier,
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
    }
  },
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "reserved"
    },
    tags: {
      __proto__: null
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
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {}
      }
    }
  },
  description: "`reservedPatchs` table should get renamed to ReservedPatchRecord to prevent clashes with ReservedPatch from `reserved` table",
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "reservedPatchs"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const reservedInputIdentifier = sql.identifier("a", "reserved_input");
const reservedInputCodec = recordCodec({
  name: "reservedInput",
  identifier: reservedInputIdentifier,
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
    }
  },
  description: "`reserved_input` table should get renamed to ReservedInputRecord to prevent clashes with ReservedInput from `reserved` table",
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "reserved_input"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const defaultValueIdentifier = sql.identifier("a", "default_value");
const defaultValueCodec = recordCodec({
  name: "defaultValue",
  identifier: defaultValueIdentifier,
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
    null_value: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
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
      schemaName: "a",
      name: "default_value"
    },
    tags: {
      __proto__: null
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
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    compound_key_1: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    compound_key_2: {
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
      schemaName: "a",
      name: "foreign_key"
    },
    tags: {
      __proto__: null
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
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    str: {
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
      schemaName: "a",
      name: "no_primary_key"
    },
    tags: {
      __proto__: null
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
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    col1: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    col2: {
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
      schemaName: "a",
      name: "testview"
    },
    tags: {
      __proto__: null
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
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    compound_key_2: {
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
const cPersonSecretIdentifier = sql.identifier("c", "person_secret");
const cPersonSecretCodec = recordCodec({
  name: "cPersonSecret",
  identifier: cPersonSecretIdentifier,
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
const cUnloggedIdentifier = sql.identifier("c", "unlogged");
const cUnloggedCodec = recordCodec({
  name: "cUnlogged",
  identifier: cUnloggedIdentifier,
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
const viewTableIdentifier = sql.identifier("a", "view_table");
const viewTableCodec = recordCodec({
  name: "viewTable",
  identifier: viewTableIdentifier,
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
    col1: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    col2: {
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
      schemaName: "a",
      name: "view_table"
    },
    tags: {
      __proto__: null
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
      uniqueKey: "x"
    }
  },
  executor: executor
});
const cCompoundKeyIdentifier = sql.identifier("c", "compound_key");
const cCompoundKeyCodec = recordCodec({
  name: "cCompoundKey",
  identifier: cCompoundKeyIdentifier,
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
const similarTable1Identifier = sql.identifier("a", "similar_table_1");
const similarTable1Codec = recordCodec({
  name: "similarTable1",
  identifier: similarTable1Identifier,
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
    col1: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    col2: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    col3: {
      description: undefined,
      codec: TYPES.int,
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
      schemaName: "a",
      name: "similar_table_1"
    },
    tags: {
      __proto__: null
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
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {}
      }
    },
    col3: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    col4: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    col5: {
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
      schemaName: "a",
      name: "similar_table_2"
    },
    tags: {
      __proto__: null
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
const pgCatalogUuidArrayCodec = listOfCodec(TYPES.uuid, {
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
  name: "pgCatalogUuidArray"
});
const cEdgeCaseIdentifier = sql.identifier("c", "edge_case");
const cEdgeCaseCodec = recordCodec({
  name: "cEdgeCase",
  identifier: cEdgeCaseIdentifier,
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
const cLeftArmIdentifier = sql.identifier("c", "left_arm");
const cLeftArmCodec = recordCodec({
  name: "cLeftArm",
  identifier: cLeftArmIdentifier,
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
const bJwtTokenIdentifier = sql.identifier("b", "jwt_token");
const bJwtTokenCodec = recordCodec({
  name: "bJwtToken",
  identifier: bJwtTokenIdentifier,
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
      __proto__: null
    }
  },
  executor: executor
});
const cIssue756Identifier = sql.identifier("c", "issue756");
const cNotNullTimestampCodec = domainOfCodec(TYPES.timestamptz, "cNotNullTimestamp", sql.identifier("c", "not_null_timestamp"), {
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
const cIssue756Codec = recordCodec({
  name: "cIssue756",
  identifier: cIssue756Identifier,
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
      codec: cNotNullTimestampCodec,
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
const bAuthPayloadIdentifier = sql.identifier("b", "auth_payload");
const bAuthPayloadCodec = recordCodec({
  name: "bAuthPayload",
  identifier: bAuthPayloadIdentifier,
  attributes: {
    __proto__: null,
    jwt: {
      description: undefined,
      codec: bJwtTokenCodec,
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
    },
    tags: {
      __proto__: null
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
    },
    tags: {
      __proto__: null
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
    },
    tags: {
      __proto__: null
    }
  }
});
const cCompoundTypeCodec = recordCodec({
  name: "cCompoundType",
  identifier: cCompoundTypeIdentifier,
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
      codec: bColorCodec,
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
      codec: bEnumCapsCodec,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    f: {
      description: undefined,
      codec: bEnumWithEmptyStringCodec,
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
const registryConfig_pgCodecs_CFuncOutOutCompoundTypeRecord_CFuncOutOutCompoundTypeRecord = recordCodec({
  name: "CFuncOutOutCompoundTypeRecord",
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
      codec: cCompoundTypeCodec,
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
const registryConfig_pgCodecs_CMutationOutOutCompoundTypeRecord_CMutationOutOutCompoundTypeRecord = recordCodec({
  name: "CMutationOutOutCompoundTypeRecord",
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
      codec: cCompoundTypeCodec,
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
  identifier: postIdentifier,
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
const registryConfig_pgCodecs_CQueryOutputTwoRowsRecord_CQueryOutputTwoRowsRecord = recordCodec({
  name: "CQueryOutputTwoRowsRecord",
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
      codec: cLeftArmCodec,
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
const registryConfig_pgCodecs_CPersonComputedOutOutRecord_CPersonComputedOutOutRecord = recordCodec({
  name: "CPersonComputedOutOutRecord",
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
const registryConfig_pgCodecs_CPersonComputedInoutOutRecord_CPersonComputedInoutOutRecord = recordCodec({
  name: "CPersonComputedInoutOutRecord",
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
const cPersonIdentifier = sql.identifier("c", "person");
const bEmailCodec = domainOfCodec(TYPES.text, "bEmail", sql.identifier("b", "email"), {
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
const bNotNullUrlCodec = domainOfCodec(TYPES.varchar, "bNotNullUrl", sql.identifier("b", "not_null_url"), {
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
const bWrappedUrlCodec = recordCodec({
  name: "bWrappedUrl",
  identifier: sql.identifier("b", "wrapped_url"),
  attributes: {
    __proto__: null,
    url: {
      description: undefined,
      codec: bNotNullUrlCodec,
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
const cPersonCodec = recordCodec({
  name: "cPerson",
  identifier: cPersonIdentifier,
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
      codec: pgCatalogTextArrayCodec,
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
      codec: bEmailCodec,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    site: {
      description: undefined,
      codec: bWrappedUrlCodec,
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
const registryConfig_pgCodecs_CPersonComputedFirstArgInoutOutRecord_CPersonComputedFirstArgInoutOutRecord = recordCodec({
  name: "CPersonComputedFirstArgInoutOutRecord",
  identifier: sql`ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
  attributes: {
    __proto__: null,
    person: {
      notNull: false,
      codec: cPersonCodec,
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
const registryConfig_pgCodecs_CFuncOutComplexRecord_CFuncOutComplexRecord = recordCodec({
  name: "CFuncOutComplexRecord",
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
      codec: cCompoundTypeCodec,
      extensions: {
        argIndex: 3,
        argName: "y"
      }
    },
    z: {
      notNull: false,
      codec: cPersonCodec,
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
const registryConfig_pgCodecs_CFuncOutComplexSetofRecord_CFuncOutComplexSetofRecord = recordCodec({
  name: "CFuncOutComplexSetofRecord",
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
      codec: cCompoundTypeCodec,
      extensions: {
        argIndex: 3,
        argName: "y"
      }
    },
    z: {
      notNull: false,
      codec: cPersonCodec,
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
const registryConfig_pgCodecs_CMutationOutComplexRecord_CMutationOutComplexRecord = recordCodec({
  name: "CMutationOutComplexRecord",
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
      codec: cCompoundTypeCodec,
      extensions: {
        argIndex: 3,
        argName: "y"
      }
    },
    z: {
      notNull: false,
      codec: cPersonCodec,
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
const registryConfig_pgCodecs_CMutationOutComplexSetofRecord_CMutationOutComplexSetofRecord = recordCodec({
  name: "CMutationOutComplexSetofRecord",
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
      codec: cCompoundTypeCodec,
      extensions: {
        argIndex: 3,
        argName: "y"
      }
    },
    z: {
      notNull: false,
      codec: cPersonCodec,
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
const registryConfig_pgCodecs_CPersonComputedComplexRecord_CPersonComputedComplexRecord = recordCodec({
  name: "CPersonComputedComplexRecord",
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
      codec: cCompoundTypeCodec,
      extensions: {
        argIndex: 4,
        argName: "y"
      }
    },
    z: {
      notNull: false,
      codec: cPersonCodec,
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
const bListsIdentifier = sql.identifier("b", "lists");
const pgCatalogInt4ArrayCodec = listOfCodec(TYPES.int, {
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
  name: "pgCatalogInt4Array"
});
const bColorArrayCodec = listOfCodec(bColorCodec, {
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
  name: "bColorArray"
});
const pgCatalogDateArrayCodec = listOfCodec(TYPES.date, {
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
  name: "pgCatalogDateArray"
});
const pgCatalogTimestamptzArrayCodec = listOfCodec(TYPES.timestamptz, {
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
  name: "pgCatalogTimestamptzArray"
});
const cCompoundTypeArrayCodec = listOfCodec(cCompoundTypeCodec, {
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
  name: "cCompoundTypeArray"
});
const pgCatalogByteaArrayCodec = listOfCodec(TYPES.bytea, {
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
  name: "pgCatalogByteaArray"
});
const bListsCodec = recordCodec({
  name: "bLists",
  identifier: bListsIdentifier,
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
      codec: pgCatalogInt4ArrayCodec,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    int_array_nn: {
      description: undefined,
      codec: pgCatalogInt4ArrayCodec,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    enum_array: {
      description: undefined,
      codec: bColorArrayCodec,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    enum_array_nn: {
      description: undefined,
      codec: bColorArrayCodec,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    date_array: {
      description: undefined,
      codec: pgCatalogDateArrayCodec,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    date_array_nn: {
      description: undefined,
      codec: pgCatalogDateArrayCodec,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    timestamptz_array: {
      description: undefined,
      codec: pgCatalogTimestamptzArrayCodec,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    timestamptz_array_nn: {
      description: undefined,
      codec: pgCatalogTimestamptzArrayCodec,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    compound_type_array: {
      description: undefined,
      codec: cCompoundTypeArrayCodec,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    compound_type_array_nn: {
      description: undefined,
      codec: cCompoundTypeArrayCodec,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    bytea_array: {
      description: undefined,
      codec: pgCatalogByteaArrayCodec,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    bytea_array_nn: {
      description: undefined,
      codec: pgCatalogByteaArrayCodec,
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
const bTypesIdentifier = sql.identifier("b", "types");
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
const bAnotherIntCodec = domainOfCodec(anIntCodec, "bAnotherInt", sql.identifier("b", "another_int"), {
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
const pgCatalogNumrangeCodec = rangeOfCodec(TYPES.numeric, "pgCatalogNumrange", sql.identifier("pg_catalog", "numrange"), {
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
const pgCatalogDaterangeCodec = rangeOfCodec(TYPES.date, "pgCatalogDaterange", sql.identifier("pg_catalog", "daterange"), {
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
const bNestedCompoundTypeCodec = recordCodec({
  name: "bNestedCompoundType",
  identifier: sql.identifier("b", "nested_compound_type"),
  attributes: {
    __proto__: null,
    a: {
      description: undefined,
      codec: cCompoundTypeCodec,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    b: {
      description: undefined,
      codec: cCompoundTypeCodec,
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
const cTextArrayDomainCodec = domainOfCodec(pgCatalogTextArrayCodec, "cTextArrayDomain", sql.identifier("c", "text_array_domain"), {
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
const pgCatalogInt8ArrayCodec = listOfCodec(TYPES.bigint, {
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
  name: "pgCatalogInt8Array"
});
const cInt8ArrayDomainCodec = domainOfCodec(pgCatalogInt8ArrayCodec, "cInt8ArrayDomain", sql.identifier("c", "int8_array_domain"), {
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
const spec_bTypes = {
  name: "bTypes",
  identifier: bTypesIdentifier,
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
      codec: bColorCodec,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    enum_array: {
      description: undefined,
      codec: bColorArrayCodec,
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
      codec: bAnotherIntCodec,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    text_array: {
      description: undefined,
      codec: pgCatalogTextArrayCodec,
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
      codec: pgCatalogNumrangeCodec,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    numrange: {
      description: undefined,
      codec: pgCatalogNumrangeCodec,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    daterange: {
      description: undefined,
      codec: pgCatalogDaterangeCodec,
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
      codec: pgCatalogIntervalArrayCodec,
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
      codec: cCompoundTypeCodec,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    nested_compound_type: {
      description: undefined,
      codec: bNestedCompoundTypeCodec,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    nullable_compound_type: {
      description: undefined,
      codec: cCompoundTypeCodec,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    nullable_nested_compound_type: {
      description: undefined,
      codec: bNestedCompoundTypeCodec,
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
      codec: cTextArrayDomainCodec,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    int8_array_domain: {
      description: undefined,
      codec: cInt8ArrayDomainCodec,
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
      codec: pgCatalogByteaArrayCodec,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    ltree: {
      description: undefined,
      codec: spec_bTypes_attributes_ltree_codec_ltree,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    ltree_array: {
      description: undefined,
      codec: spec_bTypes_attributes_ltree_array_codec_ltree_,
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
const bTypesCodec = recordCodec(spec_bTypes);
const cFloatrangeCodec = rangeOfCodec(TYPES.float, "cFloatrange", sql.identifier("c", "floatrange"), {
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
const postArrayCodec = listOfCodec(postCodec, {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "_post"
    },
    tags: {
      __proto__: null
    }
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
const int_set_mutationFunctionIdentifer = sql.identifier("c", "int_set_mutation");
const int_set_queryFunctionIdentifer = sql.identifier("c", "int_set_query");
const mutation_out_unnamed_out_out_unnamedFunctionIdentifer = sql.identifier("c", "mutation_out_unnamed_out_out_unnamed");
const mutation_returns_table_multi_colFunctionIdentifer = sql.identifier("c", "mutation_returns_table_multi_col");
const func_returns_table_multi_colFunctionIdentifer = sql.identifier("c", "func_returns_table_multi_col");
const guid_fnFunctionIdentifer = sql.identifier("b", "guid_fn");
const mutation_interval_arrayFunctionIdentifer = sql.identifier("a", "mutation_interval_array");
const query_interval_arrayFunctionIdentifer = sql.identifier("a", "query_interval_array");
const mutation_text_arrayFunctionIdentifer = sql.identifier("a", "mutation_text_array");
const query_text_arrayFunctionIdentifer = sql.identifier("a", "query_text_array");
const inputsUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const patchsUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const reservedUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const reservedPatchsUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const reserved_inputUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const default_valueUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
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
    tags: {}
  }
};
const no_primary_keyUniques = [{
  isPrimary: false,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const unique_foreign_keyUniques = [{
  isPrimary: false,
  attributes: ["compound_key_1", "compound_key_2"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const registryConfig_pgResources_unique_foreign_key_unique_foreign_key = {
  executor: executor,
  name: "unique_foreign_key",
  identifier: "main.a.unique_foreign_key",
  from: uniqueForeignKeyIdentifier,
  codec: uniqueForeignKeyCodec,
  uniques: unique_foreign_keyUniques,
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
      omit: "create,update,delete,all,order,filter"
    }
  }
};
const c_my_tableUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const c_person_secretUniques = [{
  isPrimary: true,
  attributes: ["person_id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const registryConfig_pgResources_c_person_secret_c_person_secret = {
  executor: executor,
  name: "c_person_secret",
  identifier: "main.c.person_secret",
  from: cPersonSecretIdentifier,
  codec: cPersonSecretCodec,
  uniques: c_person_secretUniques,
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
const view_tableUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const c_compound_keyUniques = [{
  isPrimary: true,
  attributes: ["person_id_1", "person_id_2"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const registryConfig_pgResources_c_compound_key_c_compound_key = {
  executor: executor,
  name: "c_compound_key",
  identifier: "main.c.compound_key",
  from: cCompoundKeyIdentifier,
  codec: cCompoundKeyCodec,
  uniques: c_compound_keyUniques,
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
const similar_table_1Uniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const similar_table_2Uniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const c_null_test_recordUniques = [{
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
const list_bde_mutationFunctionIdentifer = sql.identifier("b", "list_bde_mutation");
const c_left_armUniques = [{
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
const registryConfig_pgResources_c_left_arm_c_left_arm = {
  executor: executor,
  name: "c_left_arm",
  identifier: "main.c.left_arm",
  from: cLeftArmIdentifier,
  codec: cLeftArmCodec,
  uniques: c_left_armUniques,
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
const authenticate_failFunctionIdentifer = sql.identifier("b", "authenticate_fail");
const resourceConfig_b_jwt_token = {
  executor: executor,
  name: "b_jwt_token",
  identifier: "main.b.jwt_token",
  from: bJwtTokenIdentifier,
  codec: bJwtTokenCodec,
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
const c_issue756Uniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const registryConfig_pgResources_c_issue756_c_issue756 = {
  executor: executor,
  name: "c_issue756",
  identifier: "main.c.issue756",
  from: cIssue756Identifier,
  codec: cIssue756Codec,
  uniques: c_issue756Uniques,
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
const left_arm_identityFunctionIdentifer = sql.identifier("c", "left_arm_identity");
const issue756_mutationFunctionIdentifer = sql.identifier("c", "issue756_mutation");
const issue756_set_mutationFunctionIdentifer = sql.identifier("c", "issue756_set_mutation");
const authenticate_manyFunctionIdentifer = sql.identifier("b", "authenticate_many");
const authenticate_payloadFunctionIdentifer = sql.identifier("b", "authenticate_payload");
const types_mutationFunctionIdentifer = sql.identifier("c", "types_mutation");
const types_queryFunctionIdentifer = sql.identifier("c", "types_query");
const compound_type_computed_fieldFunctionIdentifer = sql.identifier("c", "compound_type_computed_field");
const post_computed_interval_setFunctionIdentifer = sql.identifier("a", "post_computed_interval_set");
const post_computed_interval_arrayFunctionIdentifer = sql.identifier("a", "post_computed_interval_array");
const post_computed_text_arrayFunctionIdentifer = sql.identifier("a", "post_computed_text_array");
const post_computed_with_optional_argFunctionIdentifer = sql.identifier("a", "post_computed_with_optional_arg");
const post_computed_with_required_argFunctionIdentifer = sql.identifier("a", "post_computed_with_required_arg");
const func_out_out_compound_typeFunctionIdentifer = sql.identifier("c", "func_out_out_compound_type");
const mutation_out_out_compound_typeFunctionIdentifer = sql.identifier("c", "mutation_out_out_compound_type");
const post_headline_trimmedFunctionIdentifer = sql.identifier("a", "post_headline_trimmed");
const post_headline_trimmed_no_defaultsFunctionIdentifer = sql.identifier("a", "post_headline_trimmed_no_defaults");
const post_headline_trimmed_strictFunctionIdentifer = sql.identifier("a", "post_headline_trimmed_strict");
const query_output_two_rowsFunctionIdentifer = sql.identifier("c", "query_output_two_rows");
const postUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
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
    tags: {}
  }
};
const compound_type_set_queryFunctionIdentifer = sql.identifier("c", "compound_type_set_query");
const resourceConfig_c_compound_type = {
  executor: executor,
  name: "c_compound_type",
  identifier: "main.c.compound_type",
  from: cCompoundTypeIdentifier,
  codec: cCompoundTypeCodec,
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
const c_personUniques = [{
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
const registryConfig_pgResources_c_person_c_person = {
  executor: executor,
  name: "c_person",
  identifier: "main.c.person",
  from: cPersonIdentifier,
  codec: cPersonCodec,
  uniques: c_personUniques,
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
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const b_typesUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const registryConfig_pgResources_b_types_b_types = {
  executor: executor,
  name: "b_types",
  identifier: "main.b.types",
  from: bTypesIdentifier,
  codec: bTypesCodec,
  uniques: b_typesUniques,
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
      foreignKey: spec_bTypes.extensions.tags.foreignKey
    }
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
  pgExecutors: {
    __proto__: null,
    main: executor
  },
  pgCodecs: {
    __proto__: null,
    int4: TYPES.int,
    void: TYPES.void,
    interval: TYPES.interval,
    int8: TYPES.bigint,
    json: TYPES.json,
    jsonb: TYPES.jsonb,
    CFuncOutOutRecord: registryConfig_pgCodecs_CFuncOutOutRecord_CFuncOutOutRecord,
    text: TYPES.text,
    CFuncOutOutSetofRecord: registryConfig_pgCodecs_CFuncOutOutSetofRecord_CFuncOutOutSetofRecord,
    CFuncOutOutUnnamedRecord: registryConfig_pgCodecs_CFuncOutOutUnnamedRecord_CFuncOutOutUnnamedRecord,
    CMutationOutOutRecord: registryConfig_pgCodecs_CMutationOutOutRecord_CMutationOutOutRecord,
    CMutationOutOutSetofRecord: registryConfig_pgCodecs_CMutationOutOutSetofRecord_CMutationOutOutSetofRecord,
    CMutationOutOutUnnamedRecord: registryConfig_pgCodecs_CMutationOutOutUnnamedRecord_CMutationOutOutUnnamedRecord,
    CSearchTestSummariesRecord: registryConfig_pgCodecs_CSearchTestSummariesRecord_CSearchTestSummariesRecord,
    CFuncOutUnnamedOutOutUnnamedRecord: registryConfig_pgCodecs_CFuncOutUnnamedOutOutUnnamedRecord_CFuncOutUnnamedOutOutUnnamedRecord,
    CMutationOutUnnamedOutOutUnnamedRecord: registryConfig_pgCodecs_CMutationOutUnnamedOutOutUnnamedRecord_CMutationOutUnnamedOutOutUnnamedRecord,
    CMutationReturnsTableMultiColRecord: registryConfig_pgCodecs_CMutationReturnsTableMultiColRecord_CMutationReturnsTableMultiColRecord,
    CFuncReturnsTableMultiColRecord: registryConfig_pgCodecs_CFuncReturnsTableMultiColRecord_CFuncReturnsTableMultiColRecord,
    bGuid: bGuidCodec,
    varchar: TYPES.varchar,
    pgCatalogIntervalArray: pgCatalogIntervalArrayCodec,
    pgCatalogTextArray: pgCatalogTextArrayCodec,
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
    pgCatalogUuidArray: pgCatalogUuidArrayCodec,
    uuid: TYPES.uuid,
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
    CFuncOutOutCompoundTypeRecord: registryConfig_pgCodecs_CFuncOutOutCompoundTypeRecord_CFuncOutOutCompoundTypeRecord,
    cCompoundType: cCompoundTypeCodec,
    bColor: bColorCodec,
    bEnumCaps: bEnumCapsCodec,
    bEnumWithEmptyString: bEnumWithEmptyStringCodec,
    CMutationOutOutCompoundTypeRecord: registryConfig_pgCodecs_CMutationOutOutCompoundTypeRecord_CMutationOutOutCompoundTypeRecord,
    CQueryOutputTwoRowsRecord: registryConfig_pgCodecs_CQueryOutputTwoRowsRecord_CQueryOutputTwoRowsRecord,
    post: postCodec,
    anEnumArray: anEnumArrayCodec,
    anEnum: anEnumCodec,
    comptypeArray: comptypeArrayCodec,
    comptype: comptypeCodec,
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
    pgCatalogInt4Array: pgCatalogInt4ArrayCodec,
    bColorArray: bColorArrayCodec,
    pgCatalogDateArray: pgCatalogDateArrayCodec,
    date: TYPES.date,
    pgCatalogTimestamptzArray: pgCatalogTimestamptzArrayCodec,
    cCompoundTypeArray: cCompoundTypeArrayCodec,
    pgCatalogByteaArray: pgCatalogByteaArrayCodec,
    bytea: TYPES.bytea,
    bTypes: bTypesCodec,
    anInt: anIntCodec,
    bAnotherInt: bAnotherIntCodec,
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
      name: "bJwtTokenArray"
    }),
    bTypesArray: listOfCodec(bTypesCodec, {
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
      name: "bTypesArray"
    }),
    cFloatrange: cFloatrangeCodec,
    postArray: postArrayCodec,
    pgCatalogInt8Array: pgCatalogInt8ArrayCodec,
    tablefuncCrosstab2: recordCodec({
      name: "tablefuncCrosstab2",
      identifier: sql.identifier("a", "tablefunc_crosstab_2"),
      attributes: {
        __proto__: null,
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
      },
      description: undefined,
      extensions: {
        isTableLike: false,
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "tablefunc_crosstab_2"
        },
        tags: {
          __proto__: null
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
      },
      description: undefined,
      extensions: {
        isTableLike: false,
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "tablefunc_crosstab_3"
        },
        tags: {
          __proto__: null
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
      },
      description: undefined,
      extensions: {
        isTableLike: false,
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "tablefunc_crosstab_4"
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
    c_current_user_id: {
      executor,
      name: "c_current_user_id",
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
    c_func_out: {
      executor,
      name: "c_func_out",
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
    c_func_out_setof: {
      executor,
      name: "c_func_out_setof",
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
    c_func_out_unnamed: {
      executor,
      name: "c_func_out_unnamed",
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
    c_mutation_out: {
      executor,
      name: "c_mutation_out",
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
    c_mutation_out_setof: {
      executor,
      name: "c_mutation_out_setof",
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
    c_mutation_out_unnamed: {
      executor,
      name: "c_mutation_out_unnamed",
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
    c_no_args_mutation: {
      executor,
      name: "c_no_args_mutation",
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
    c_no_args_query: {
      executor,
      name: "c_no_args_query",
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "return_void_mutation"
        },
        tags: {}
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
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "mutation_interval_set"
        },
        tags: {}
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
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "query_interval_set"
        },
        tags: {}
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
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "static_big_integer"
        },
        tags: {}
      },
      description: undefined
    },
    c_func_in_out: {
      executor,
      name: "c_func_in_out",
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
    c_func_returns_table_one_col: {
      executor,
      name: "c_func_returns_table_one_col",
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
    c_mutation_in_out: {
      executor,
      name: "c_mutation_in_out",
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
    c_mutation_returns_table_one_col: {
      executor,
      name: "c_mutation_returns_table_one_col",
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "assert_something"
        },
        tags: {}
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
      description: undefined
    },
    c_json_identity: {
      executor,
      name: "c_json_identity",
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
    c_json_identity_mutation: {
      executor,
      name: "c_json_identity_mutation",
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
    c_jsonb_identity: {
      executor,
      name: "c_jsonb_identity",
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
    c_jsonb_identity_mutation: {
      executor,
      name: "c_jsonb_identity_mutation",
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
    c_jsonb_identity_mutation_plpgsql: {
      executor,
      name: "c_jsonb_identity_mutation_plpgsql",
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
    c_jsonb_identity_mutation_plpgsql_with_default: {
      executor,
      name: "c_jsonb_identity_mutation_plpgsql_with_default",
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "add_1_query"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "add_2_mutation"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "add_2_query"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "add_3_mutation"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "add_3_query"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "add_4_mutation"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "add_4_mutation_error"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "add_4_query"
        },
        tags: {}
      },
      description: "lol, add some stuff 4 query"
    },
    b_mult_1: {
      executor,
      name: "b_mult_1",
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
    b_mult_2: {
      executor,
      name: "b_mult_2",
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
    b_mult_3: {
      executor,
      name: "b_mult_3",
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
    b_mult_4: {
      executor,
      name: "b_mult_4",
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
    c_func_in_inout: {
      executor,
      name: "c_func_in_inout",
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
    c_func_out_out: {
      executor,
      name: "c_func_out_out",
      identifier: "main.c.func_out_out(int4,text)",
      from(...args) {
        return sql`${func_out_outFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      isUnique: !false,
      codec: registryConfig_pgCodecs_CFuncOutOutRecord_CFuncOutOutRecord,
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
    c_func_out_out_setof: {
      executor,
      name: "c_func_out_out_setof",
      identifier: "main.c.func_out_out_setof(int4,text)",
      from(...args) {
        return sql`${func_out_out_setofFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      isUnique: !true,
      codec: registryConfig_pgCodecs_CFuncOutOutSetofRecord_CFuncOutOutSetofRecord,
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
    c_func_out_out_unnamed: {
      executor,
      name: "c_func_out_out_unnamed",
      identifier: "main.c.func_out_out_unnamed(int4,text)",
      from(...args) {
        return sql`${func_out_out_unnamedFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      isUnique: !false,
      codec: registryConfig_pgCodecs_CFuncOutOutUnnamedRecord_CFuncOutOutUnnamedRecord,
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
    c_mutation_in_inout: {
      executor,
      name: "c_mutation_in_inout",
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
    c_mutation_out_out: {
      executor,
      name: "c_mutation_out_out",
      identifier: "main.c.mutation_out_out(int4,text)",
      from(...args) {
        return sql`${mutation_out_outFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      isUnique: !false,
      codec: registryConfig_pgCodecs_CMutationOutOutRecord_CMutationOutOutRecord,
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
    c_mutation_out_out_setof: {
      executor,
      name: "c_mutation_out_out_setof",
      identifier: "main.c.mutation_out_out_setof(int4,text)",
      from(...args) {
        return sql`${mutation_out_out_setofFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      isUnique: !true,
      codec: registryConfig_pgCodecs_CMutationOutOutSetofRecord_CMutationOutOutSetofRecord,
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
    c_mutation_out_out_unnamed: {
      executor,
      name: "c_mutation_out_out_unnamed",
      identifier: "main.c.mutation_out_out_unnamed(int4,text)",
      from(...args) {
        return sql`${mutation_out_out_unnamedFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      isUnique: !false,
      codec: registryConfig_pgCodecs_CMutationOutOutUnnamedRecord_CMutationOutOutUnnamedRecord,
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
    c_search_test_summaries: {
      executor,
      name: "c_search_test_summaries",
      identifier: "main.c.search_test_summaries(int4,interval)",
      from(...args) {
        return sql`${search_test_summariesFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      isUnique: !true,
      codec: registryConfig_pgCodecs_CSearchTestSummariesRecord_CSearchTestSummariesRecord,
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
          simpleCollections: "only"
        }
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "optional_missing_middle_1"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "optional_missing_middle_2"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "optional_missing_middle_3"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "optional_missing_middle_4"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "optional_missing_middle_5"
        },
        tags: {}
      },
      description: undefined
    },
    c_func_out_unnamed_out_out_unnamed: {
      executor,
      name: "c_func_out_unnamed_out_out_unnamed",
      identifier: "main.c.func_out_unnamed_out_out_unnamed(int4,text,int4)",
      from(...args) {
        return sql`${func_out_unnamed_out_out_unnamedFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      isUnique: !false,
      codec: registryConfig_pgCodecs_CFuncOutUnnamedOutOutUnnamedRecord_CFuncOutUnnamedOutOutUnnamedRecord,
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
    c_int_set_mutation: {
      executor,
      name: "c_int_set_mutation",
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
    c_int_set_query: {
      executor,
      name: "c_int_set_query",
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
    c_mutation_out_unnamed_out_out_unnamed: {
      executor,
      name: "c_mutation_out_unnamed_out_out_unnamed",
      identifier: "main.c.mutation_out_unnamed_out_out_unnamed(int4,text,int4)",
      from(...args) {
        return sql`${mutation_out_unnamed_out_out_unnamedFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      isUnique: !false,
      codec: registryConfig_pgCodecs_CMutationOutUnnamedOutOutUnnamedRecord_CMutationOutUnnamedOutOutUnnamedRecord,
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
    c_mutation_returns_table_multi_col: {
      executor,
      name: "c_mutation_returns_table_multi_col",
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
      codec: registryConfig_pgCodecs_CMutationReturnsTableMultiColRecord_CMutationReturnsTableMultiColRecord,
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
    c_func_returns_table_multi_col: {
      executor,
      name: "c_func_returns_table_multi_col",
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
      codec: registryConfig_pgCodecs_CFuncReturnsTableMultiColRecord_CFuncReturnsTableMultiColRecord,
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
    b_guid_fn: {
      executor,
      name: "b_guid_fn",
      identifier: "main.b.guid_fn(b.guid)",
      from(...args) {
        return sql`${guid_fnFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "g",
        required: true,
        notNull: false,
        codec: bGuidCodec
      }],
      isUnique: !false,
      codec: bGuidCodec,
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
    mutation_interval_array: {
      executor,
      name: "mutation_interval_array",
      identifier: "main.a.mutation_interval_array()",
      from(...args) {
        return sql`${mutation_interval_arrayFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      isUnique: !false,
      codec: pgCatalogIntervalArrayCodec,
      uniques: [],
      isMutation: true,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "mutation_interval_array"
        },
        tags: {}
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
      codec: pgCatalogIntervalArrayCodec,
      uniques: [],
      isMutation: false,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "query_interval_array"
        },
        tags: {}
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
      codec: pgCatalogTextArrayCodec,
      uniques: [],
      isMutation: true,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "mutation_text_array"
        },
        tags: {}
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
      codec: pgCatalogTextArrayCodec,
      uniques: [],
      isMutation: false,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "query_text_array"
        },
        tags: {}
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
        tags: {}
      }
    },
    inputs: {
      executor: executor,
      name: "inputs",
      identifier: "main.a.inputs",
      from: inputsIdentifier,
      codec: inputsCodec,
      uniques: inputsUniques,
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
        tags: {}
      }
    },
    patchs: {
      executor: executor,
      name: "patchs",
      identifier: "main.a.patchs",
      from: patchsIdentifier,
      codec: patchsCodec,
      uniques: patchsUniques,
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
        tags: {}
      }
    },
    reserved: {
      executor: executor,
      name: "reserved",
      identifier: "main.a.reserved",
      from: reservedIdentifier,
      codec: reservedCodec,
      uniques: reservedUniques,
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
        tags: {}
      }
    },
    reservedPatchs: {
      executor: executor,
      name: "reservedPatchs",
      identifier: "main.a.reservedPatchs",
      from: reservedPatchsIdentifier,
      codec: reservedPatchsCodec,
      uniques: reservedPatchsUniques,
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
        tags: {}
      }
    },
    reserved_input: {
      executor: executor,
      name: "reserved_input",
      identifier: "main.a.reserved_input",
      from: reservedInputIdentifier,
      codec: reservedInputCodec,
      uniques: reserved_inputUniques,
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
        tags: {}
      }
    },
    default_value: {
      executor: executor,
      name: "default_value",
      identifier: "main.a.default_value",
      from: defaultValueIdentifier,
      codec: defaultValueCodec,
      uniques: default_valueUniques,
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
        tags: {}
      }
    },
    foreign_key: registryConfig_pgResources_foreign_key_foreign_key,
    no_primary_key: {
      executor: executor,
      name: "no_primary_key",
      identifier: "main.a.no_primary_key",
      from: noPrimaryKeyIdentifier,
      codec: noPrimaryKeyCodec,
      uniques: no_primary_keyUniques,
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
        tags: {}
      }
    },
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
        tags: {}
      }
    },
    unique_foreign_key: registryConfig_pgResources_unique_foreign_key_unique_foreign_key,
    c_my_table: {
      executor: executor,
      name: "c_my_table",
      identifier: "main.c.my_table",
      from: cMyTableIdentifier,
      codec: cMyTableCodec,
      uniques: c_my_tableUniques,
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
    c_person_secret: registryConfig_pgResources_c_person_secret_c_person_secret,
    c_unlogged: {
      executor: executor,
      name: "c_unlogged",
      identifier: "main.c.unlogged",
      from: cUnloggedIdentifier,
      codec: cUnloggedCodec,
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
    view_table: {
      executor: executor,
      name: "view_table",
      identifier: "main.a.view_table",
      from: viewTableIdentifier,
      codec: viewTableCodec,
      uniques: view_tableUniques,
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
        tags: {}
      }
    },
    b_updatable_view: {
      executor: executor,
      name: "b_updatable_view",
      identifier: "main.b.updatable_view",
      from: bUpdatableViewIdentifier,
      codec: bUpdatableViewCodec,
      uniques: [],
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
          uniqueKey: "x"
        }
      }
    },
    c_compound_key: registryConfig_pgResources_c_compound_key_c_compound_key,
    similar_table_1: {
      executor: executor,
      name: "similar_table_1",
      identifier: "main.a.similar_table_1",
      from: similarTable1Identifier,
      codec: similarTable1Codec,
      uniques: similar_table_1Uniques,
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
        tags: {}
      }
    },
    similar_table_2: {
      executor: executor,
      name: "similar_table_2",
      identifier: "main.a.similar_table_2",
      from: similarTable2Identifier,
      codec: similarTable2Codec,
      uniques: similar_table_2Uniques,
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
        tags: {}
      }
    },
    c_null_test_record: {
      executor: executor,
      name: "c_null_test_record",
      identifier: "main.c.null_test_record",
      from: cNullTestRecordIdentifier,
      codec: cNullTestRecordCodec,
      uniques: c_null_test_recordUniques,
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
    c_edge_case_computed: {
      executor,
      name: "c_edge_case_computed",
      identifier: "main.c.edge_case_computed(c.edge_case)",
      from(...args) {
        return sql`${edge_case_computedFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "edge_case",
        required: true,
        notNull: false,
        codec: cEdgeCaseCodec
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
          sortable: true
        }
      },
      description: undefined
    },
    c_return_table_without_grants: PgResource.functionResourceOptions(registryConfig_pgResources_c_compound_key_c_compound_key, {
      name: "c_return_table_without_grants",
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
    b_list_bde_mutation: {
      executor,
      name: "b_list_bde_mutation",
      identifier: "main.b.list_bde_mutation(_text,text,text)",
      from(...args) {
        return sql`${list_bde_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "b",
        required: true,
        notNull: false,
        codec: pgCatalogTextArrayCodec
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
      codec: pgCatalogUuidArrayCodec,
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
    c_edge_case: {
      executor: executor,
      name: "c_edge_case",
      identifier: "main.c.edge_case",
      from: cEdgeCaseIdentifier,
      codec: cEdgeCaseCodec,
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
    c_left_arm: registryConfig_pgResources_c_left_arm_c_left_arm,
    b_authenticate_fail: PgResource.functionResourceOptions(resourceConfig_b_jwt_token, {
      name: "b_authenticate_fail",
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
    b_authenticate: PgResource.functionResourceOptions(resourceConfig_b_jwt_token, {
      name: "b_authenticate",
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
    c_issue756: registryConfig_pgResources_c_issue756_c_issue756,
    c_left_arm_identity: PgResource.functionResourceOptions(registryConfig_pgResources_c_left_arm_c_left_arm, {
      name: "c_left_arm_identity",
      identifier: "main.c.left_arm_identity(c.left_arm)",
      from(...args) {
        return sql`${left_arm_identityFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "left_arm",
        required: true,
        notNull: false,
        codec: cLeftArmCodec,
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
    c_issue756_mutation: PgResource.functionResourceOptions(registryConfig_pgResources_c_issue756_c_issue756, {
      name: "c_issue756_mutation",
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
    c_issue756_set_mutation: PgResource.functionResourceOptions(registryConfig_pgResources_c_issue756_c_issue756, {
      name: "c_issue756_set_mutation",
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
    b_authenticate_many: PgResource.functionResourceOptions(resourceConfig_b_jwt_token, {
      name: "b_authenticate_many",
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
    b_authenticate_payload: PgResource.functionResourceOptions({
      executor: executor,
      name: "b_auth_payload",
      identifier: "main.b.auth_payload",
      from: bAuthPayloadIdentifier,
      codec: bAuthPayloadCodec,
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
      name: "b_authenticate_payload",
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
    c_types_mutation: {
      executor,
      name: "c_types_mutation",
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
        codec: pgCatalogInt4ArrayCodec
      }, {
        name: "e",
        required: true,
        notNull: true,
        codec: TYPES.json
      }, {
        name: "f",
        required: true,
        notNull: true,
        codec: cFloatrangeCodec
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
    c_types_query: {
      executor,
      name: "c_types_query",
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
        codec: pgCatalogInt4ArrayCodec
      }, {
        name: "e",
        required: true,
        notNull: true,
        codec: TYPES.json
      }, {
        name: "f",
        required: true,
        notNull: true,
        codec: cFloatrangeCodec
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
    c_compound_type_computed_field: {
      executor,
      name: "c_compound_type_computed_field",
      identifier: "main.c.compound_type_computed_field(c.compound_type)",
      from(...args) {
        return sql`${compound_type_computed_fieldFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "compound_type",
        required: true,
        notNull: false,
        codec: cCompoundTypeCodec
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
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "post_computed_interval_set"
        },
        tags: {}
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
      codec: pgCatalogIntervalArrayCodec,
      uniques: [],
      isMutation: false,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "post_computed_interval_array"
        },
        tags: {}
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
      codec: pgCatalogTextArrayCodec,
      uniques: [],
      isMutation: false,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "post_computed_text_array"
        },
        tags: {}
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
      description: undefined
    },
    c_func_out_out_compound_type: {
      executor,
      name: "c_func_out_out_compound_type",
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
      codec: registryConfig_pgCodecs_CFuncOutOutCompoundTypeRecord_CFuncOutOutCompoundTypeRecord,
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
    c_mutation_out_out_compound_type: {
      executor,
      name: "c_mutation_out_out_compound_type",
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
      codec: registryConfig_pgCodecs_CMutationOutOutCompoundTypeRecord_CMutationOutOutCompoundTypeRecord,
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "post_headline_trimmed"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "post_headline_trimmed_no_defaults"
        },
        tags: {}
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "post_headline_trimmed_strict"
        },
        tags: {}
      },
      description: undefined
    },
    c_query_output_two_rows: {
      executor,
      name: "c_query_output_two_rows",
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
      codec: registryConfig_pgCodecs_CQueryOutputTwoRowsRecord_CQueryOutputTwoRowsRecord,
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
    post: registryConfig_pgResources_post_post,
    c_compound_type_set_query: PgResource.functionResourceOptions(resourceConfig_c_compound_type, {
      name: "c_compound_type_set_query",
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
    b_compound_type_mutation: PgResource.functionResourceOptions(resourceConfig_c_compound_type, {
      name: "b_compound_type_mutation",
      identifier: "main.b.compound_type_mutation(c.compound_type)",
      from(...args) {
        return sql`${compound_type_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "object",
        required: true,
        notNull: false,
        codec: cCompoundTypeCodec
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
    b_compound_type_query: PgResource.functionResourceOptions(resourceConfig_c_compound_type, {
      name: "b_compound_type_query",
      identifier: "main.b.compound_type_query(c.compound_type)",
      from(...args) {
        return sql`${compound_type_queryFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "object",
        required: true,
        notNull: false,
        codec: cCompoundTypeCodec
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
    b_compound_type_set_mutation: PgResource.functionResourceOptions(resourceConfig_c_compound_type, {
      name: "b_compound_type_set_mutation",
      identifier: "main.b.compound_type_set_mutation(c.compound_type)",
      from(...args) {
        return sql`${compound_type_set_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "object",
        required: true,
        notNull: false,
        codec: cCompoundTypeCodec
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
    c_list_of_compound_types_mutation: PgResource.functionResourceOptions(resourceConfig_c_compound_type, {
      name: "c_list_of_compound_types_mutation",
      identifier: "main.c.list_of_compound_types_mutation(c._compound_type)",
      from(...args) {
        return sql`${list_of_compound_types_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "records",
        required: true,
        notNull: false,
        codec: cCompoundTypeArrayCodec
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
    c_table_mutation: PgResource.functionResourceOptions(registryConfig_pgResources_post_post, {
      name: "c_table_mutation",
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
    c_table_query: PgResource.functionResourceOptions(registryConfig_pgResources_post_post, {
      name: "c_table_query",
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
      hasImplicitOrder: false,
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
      description: undefined
    }),
    mutation_compound_type_array: PgResource.functionResourceOptions(resourceConfig_c_compound_type, {
      name: "mutation_compound_type_array",
      identifier: "main.a.mutation_compound_type_array(c.compound_type)",
      from(...args) {
        return sql`${mutation_compound_type_arrayFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "object",
        required: true,
        notNull: false,
        codec: cCompoundTypeCodec
      }],
      returnsArray: true,
      returnsSetof: false,
      isMutation: true,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "mutation_compound_type_array"
        },
        tags: {}
      },
      description: undefined
    }),
    query_compound_type_array: PgResource.functionResourceOptions(resourceConfig_c_compound_type, {
      name: "query_compound_type_array",
      identifier: "main.a.query_compound_type_array(c.compound_type)",
      from(...args) {
        return sql`${query_compound_type_arrayFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "object",
        required: true,
        notNull: false,
        codec: cCompoundTypeCodec
      }],
      returnsArray: true,
      returnsSetof: false,
      isMutation: false,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "query_compound_type_array"
        },
        tags: {}
      },
      description: undefined
    }),
    b_compound_type_array_mutation: PgResource.functionResourceOptions(resourceConfig_c_compound_type, {
      name: "b_compound_type_array_mutation",
      identifier: "main.b.compound_type_array_mutation(c.compound_type)",
      from(...args) {
        return sql`${compound_type_array_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "object",
        required: true,
        notNull: false,
        codec: cCompoundTypeCodec
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
    b_compound_type_array_query: PgResource.functionResourceOptions(resourceConfig_c_compound_type, {
      name: "b_compound_type_array_query",
      identifier: "main.b.compound_type_array_query(c.compound_type)",
      from(...args) {
        return sql`${compound_type_array_queryFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "object",
        required: true,
        notNull: false,
        codec: cCompoundTypeCodec
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
    post_computed_compound_type_array: PgResource.functionResourceOptions(resourceConfig_c_compound_type, {
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
        codec: cCompoundTypeCodec
      }],
      returnsArray: true,
      returnsSetof: false,
      isMutation: false,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "post_computed_compound_type_array"
        },
        tags: {}
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
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "post_many"
        },
        tags: {}
      },
      description: undefined
    }),
    c_person_computed_out: {
      executor,
      name: "c_person_computed_out",
      identifier: "main.c.person_computed_out(c.person,text)",
      from(...args) {
        return sql`${person_computed_outFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "person",
        required: true,
        notNull: false,
        codec: cPersonCodec
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
          filterable: true
        },
        singleOutputParameterName: "o1"
      },
      description: undefined
    },
    c_person_first_name: {
      executor,
      name: "c_person_first_name",
      identifier: "main.c.person_first_name(c.person)",
      from(...args) {
        return sql`${person_first_nameFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "person",
        required: true,
        notNull: false,
        codec: cPersonCodec
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
          sortable: true
        }
      },
      description: "The first name of the person."
    },
    c_person_computed_out_out: {
      executor,
      name: "c_person_computed_out_out",
      identifier: "main.c.person_computed_out_out(c.person,text,text)",
      from(...args) {
        return sql`${person_computed_out_outFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "person",
        required: true,
        notNull: false,
        codec: cPersonCodec
      }],
      isUnique: !false,
      codec: registryConfig_pgCodecs_CPersonComputedOutOutRecord_CPersonComputedOutOutRecord,
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
    c_person_computed_inout: {
      executor,
      name: "c_person_computed_inout",
      identifier: "main.c.person_computed_inout(c.person,text)",
      from(...args) {
        return sql`${person_computed_inoutFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "person",
        required: true,
        notNull: false,
        codec: cPersonCodec
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
    c_person_computed_inout_out: {
      executor,
      name: "c_person_computed_inout_out",
      identifier: "main.c.person_computed_inout_out(c.person,text,text)",
      from(...args) {
        return sql`${person_computed_inout_outFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "person",
        required: true,
        notNull: false,
        codec: cPersonCodec
      }, {
        name: "ino",
        required: true,
        notNull: false,
        codec: TYPES.text
      }],
      isUnique: !false,
      codec: registryConfig_pgCodecs_CPersonComputedInoutOutRecord_CPersonComputedInoutOutRecord,
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
    c_person_exists: {
      executor,
      name: "c_person_exists",
      identifier: "main.c.person_exists(c.person,b.email)",
      from(...args) {
        return sql`${person_existsFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "person",
        required: true,
        notNull: false,
        codec: cPersonCodec
      }, {
        name: "email",
        required: true,
        notNull: false,
        codec: bEmailCodec
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
    c_person_computed_first_arg_inout_out: {
      executor,
      name: "c_person_computed_first_arg_inout_out",
      identifier: "main.c.person_computed_first_arg_inout_out(c.person,int4)",
      from(...args) {
        return sql`${person_computed_first_arg_inout_outFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "person",
        required: true,
        notNull: false,
        codec: cPersonCodec
      }],
      isUnique: !false,
      codec: registryConfig_pgCodecs_CPersonComputedFirstArgInoutOutRecord_CPersonComputedFirstArgInoutOutRecord,
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
    c_person_optional_missing_middle_1: {
      executor,
      name: "c_person_optional_missing_middle_1",
      identifier: "main.c.person_optional_missing_middle_1(c.person,int4,int4,int4)",
      from(...args) {
        return sql`${person_optional_missing_middle_1FunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "p",
        required: true,
        notNull: true,
        codec: cPersonCodec
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
    c_person_optional_missing_middle_2: {
      executor,
      name: "c_person_optional_missing_middle_2",
      identifier: "main.c.person_optional_missing_middle_2(c.person,int4,int4,int4)",
      from(...args) {
        return sql`${person_optional_missing_middle_2FunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "p",
        required: true,
        notNull: true,
        codec: cPersonCodec
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
    c_person_optional_missing_middle_3: {
      executor,
      name: "c_person_optional_missing_middle_3",
      identifier: "main.c.person_optional_missing_middle_3(c.person,int4,int4,int4)",
      from(...args) {
        return sql`${person_optional_missing_middle_3FunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "p",
        required: true,
        notNull: true,
        codec: cPersonCodec
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
    c_person_optional_missing_middle_4: {
      executor,
      name: "c_person_optional_missing_middle_4",
      identifier: "main.c.person_optional_missing_middle_4(c.person,int4,int4,int4)",
      from(...args) {
        return sql`${person_optional_missing_middle_4FunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "p",
        required: true,
        notNull: true,
        codec: cPersonCodec
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
    c_person_optional_missing_middle_5: {
      executor,
      name: "c_person_optional_missing_middle_5",
      identifier: "main.c.person_optional_missing_middle_5(c.person,int4,int4,int4)",
      from(...args) {
        return sql`${person_optional_missing_middle_5FunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "p",
        required: true,
        notNull: true,
        codec: cPersonCodec
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
    c_func_out_complex: {
      executor,
      name: "c_func_out_complex",
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
      codec: registryConfig_pgCodecs_CFuncOutComplexRecord_CFuncOutComplexRecord,
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
    c_func_out_complex_setof: {
      executor,
      name: "c_func_out_complex_setof",
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
      codec: registryConfig_pgCodecs_CFuncOutComplexSetofRecord_CFuncOutComplexSetofRecord,
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
    c_mutation_out_complex: {
      executor,
      name: "c_mutation_out_complex",
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
      codec: registryConfig_pgCodecs_CMutationOutComplexRecord_CMutationOutComplexRecord,
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
    c_mutation_out_complex_setof: {
      executor,
      name: "c_mutation_out_complex_setof",
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
      codec: registryConfig_pgCodecs_CMutationOutComplexSetofRecord_CMutationOutComplexSetofRecord,
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
    c_person_computed_complex: {
      executor,
      name: "c_person_computed_complex",
      identifier: "main.c.person_computed_complex(c.person,int4,text,int4,c.compound_type,c.person)",
      from(...args) {
        return sql`${person_computed_complexFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "person",
        required: true,
        notNull: false,
        codec: cPersonCodec
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
      codec: registryConfig_pgCodecs_CPersonComputedComplexRecord_CPersonComputedComplexRecord,
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
    c_person_first_post: PgResource.functionResourceOptions(registryConfig_pgResources_post_post, {
      name: "c_person_first_post",
      identifier: "main.c.person_first_post(c.person)",
      from(...args) {
        return sql`${person_first_postFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "person",
        required: true,
        notNull: false,
        codec: cPersonCodec
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
    c_person: registryConfig_pgResources_c_person_c_person,
    c_badly_behaved_function: PgResource.functionResourceOptions(registryConfig_pgResources_c_person_c_person, {
      name: "c_badly_behaved_function",
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
    c_func_out_table: PgResource.functionResourceOptions(registryConfig_pgResources_c_person_c_person, {
      name: "c_func_out_table",
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
    c_func_out_table_setof: PgResource.functionResourceOptions(registryConfig_pgResources_c_person_c_person, {
      name: "c_func_out_table_setof",
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
    c_mutation_out_table: PgResource.functionResourceOptions(registryConfig_pgResources_c_person_c_person, {
      name: "c_mutation_out_table",
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
    c_mutation_out_table_setof: PgResource.functionResourceOptions(registryConfig_pgResources_c_person_c_person, {
      name: "c_mutation_out_table_setof",
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
    c_table_set_mutation: PgResource.functionResourceOptions(registryConfig_pgResources_c_person_c_person, {
      name: "c_table_set_mutation",
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
    c_table_set_query: PgResource.functionResourceOptions(registryConfig_pgResources_c_person_c_person, {
      name: "c_table_set_query",
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
          filterable: true
        }
      },
      description: undefined
    }),
    c_table_set_query_plpgsql: PgResource.functionResourceOptions(registryConfig_pgResources_c_person_c_person, {
      name: "c_table_set_query_plpgsql",
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
    c_person_computed_first_arg_inout: PgResource.functionResourceOptions(registryConfig_pgResources_c_person_c_person, {
      name: "c_person_computed_first_arg_inout",
      identifier: "main.c.person_computed_first_arg_inout(c.person)",
      from(...args) {
        return sql`${person_computed_first_arg_inoutFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "person",
        required: true,
        notNull: false,
        codec: cPersonCodec
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
    c_person_friends: PgResource.functionResourceOptions(registryConfig_pgResources_c_person_c_person, {
      name: "c_person_friends",
      identifier: "main.c.person_friends(c.person)",
      from(...args) {
        return sql`${person_friendsFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "person",
        required: true,
        notNull: false,
        codec: cPersonCodec
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
          sortable: true
        }
      },
      description: undefined
    }),
    b_lists: {
      executor: executor,
      name: "b_lists",
      identifier: "main.b.lists",
      from: bListsIdentifier,
      codec: bListsCodec,
      uniques: b_listsUniques,
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
    b_types: registryConfig_pgResources_b_types_b_types,
    b_type_function_connection: PgResource.functionResourceOptions(registryConfig_pgResources_b_types_b_types, {
      name: "b_type_function_connection",
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
    b_type_function_connection_mutation: PgResource.functionResourceOptions(registryConfig_pgResources_b_types_b_types, {
      name: "b_type_function_connection_mutation",
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
    b_type_function: PgResource.functionResourceOptions(registryConfig_pgResources_b_types_b_types, {
      name: "b_type_function",
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
    b_type_function_mutation: PgResource.functionResourceOptions(registryConfig_pgResources_b_types_b_types, {
      name: "b_type_function_mutation",
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
    c_person_type_function_connection: PgResource.functionResourceOptions(registryConfig_pgResources_b_types_b_types, {
      name: "c_person_type_function_connection",
      identifier: "main.c.person_type_function_connection(c.person)",
      from(...args) {
        return sql`${person_type_function_connectionFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "p",
        required: true,
        notNull: false,
        codec: cPersonCodec
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
    c_person_type_function: PgResource.functionResourceOptions(registryConfig_pgResources_b_types_b_types, {
      name: "c_person_type_function",
      identifier: "main.c.person_type_function(c.person,int4)",
      from(...args) {
        return sql`${person_type_functionFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "p",
        required: true,
        notNull: false,
        codec: cPersonCodec
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
    b_type_function_list: PgResource.functionResourceOptions(registryConfig_pgResources_b_types_b_types, {
      name: "b_type_function_list",
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
    b_type_function_list_mutation: PgResource.functionResourceOptions(registryConfig_pgResources_b_types_b_types, {
      name: "b_type_function_list_mutation",
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
    }),
    c_person_type_function_list: PgResource.functionResourceOptions(registryConfig_pgResources_b_types_b_types, {
      name: "c_person_type_function_list",
      identifier: "main.c.person_type_function_list(c.person)",
      from(...args) {
        return sql`${person_type_function_listFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "p",
        required: true,
        notNull: false,
        codec: cPersonCodec
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
    foreignKey: {
      __proto__: null,
      cCompoundKeyByMyCompoundKey1AndCompoundKey2: {
        localCodec: foreignKeyCodec,
        remoteResourceOptions: registryConfig_pgResources_c_compound_key_c_compound_key,
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
      cPersonByMyPersonId: {
        localCodec: foreignKeyCodec,
        remoteResourceOptions: registryConfig_pgResources_c_person_c_person,
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
    post: {
      __proto__: null,
      cPersonByMyAuthorId: {
        localCodec: postCodec,
        remoteResourceOptions: registryConfig_pgResources_c_person_c_person,
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
      bTypesByTheirSmallint: {
        localCodec: postCodec,
        remoteResourceOptions: registryConfig_pgResources_b_types_b_types,
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
      bTypesByTheirId: {
        localCodec: postCodec,
        remoteResourceOptions: registryConfig_pgResources_b_types_b_types,
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
    },
    uniqueForeignKey: {
      __proto__: null,
      cCompoundKeyByMyCompoundKey1AndCompoundKey2: {
        localCodec: uniqueForeignKeyCodec,
        remoteResourceOptions: registryConfig_pgResources_c_compound_key_c_compound_key,
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
    },
    bAuthPayload: {
      __proto__: null,
      cPersonByMyId: {
        localCodec: bAuthPayloadCodec,
        remoteResourceOptions: registryConfig_pgResources_c_person_c_person,
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
    },
    bTypes: {
      __proto__: null,
      postByMySmallint: {
        localCodec: bTypesCodec,
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
        localCodec: bTypesCodec,
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
    },
    cCompoundKey: {
      __proto__: null,
      cPersonByMyPersonId1: {
        localCodec: cCompoundKeyCodec,
        remoteResourceOptions: registryConfig_pgResources_c_person_c_person,
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
      cPersonByMyPersonId2: {
        localCodec: cCompoundKeyCodec,
        remoteResourceOptions: registryConfig_pgResources_c_person_c_person,
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
        localCodec: cCompoundKeyCodec,
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
        localCodec: cCompoundKeyCodec,
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
    },
    cLeftArm: {
      __proto__: null,
      cPersonByMyPersonId: {
        localCodec: cLeftArmCodec,
        remoteResourceOptions: registryConfig_pgResources_c_person_c_person,
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
    cPerson: {
      __proto__: null,
      postsByTheirAuthorId: {
        localCodec: cPersonCodec,
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
        localCodec: cPersonCodec,
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
      cPersonSecretByTheirPersonId: {
        localCodec: cPersonCodec,
        remoteResourceOptions: registryConfig_pgResources_c_person_secret_c_person_secret,
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
      cLeftArmByTheirPersonId: {
        localCodec: cPersonCodec,
        remoteResourceOptions: registryConfig_pgResources_c_left_arm_c_left_arm,
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
      cCompoundKeysByTheirPersonId1: {
        localCodec: cPersonCodec,
        remoteResourceOptions: registryConfig_pgResources_c_compound_key_c_compound_key,
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
      cCompoundKeysByTheirPersonId2: {
        localCodec: cPersonCodec,
        remoteResourceOptions: registryConfig_pgResources_c_compound_key_c_compound_key,
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
    cPersonSecret: {
      __proto__: null,
      cPersonByMyPersonId: {
        localCodec: cPersonSecretCodec,
        remoteResourceOptions: registryConfig_pgResources_c_person_c_person,
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
const getSelectPlanFromParentAndArgs = ($root, args, _info) => {
  const selectArgs = makeArgs_c_person_computed_out(args);
  return resource_c_func_out_setofPgResource.execute(selectArgs);
};
const resource_c_func_out_unnamedPgResource = registry.pgResources["c_func_out_unnamed"];
const resource_c_no_args_queryPgResource = registry.pgResources["c_no_args_query"];
const resource_query_interval_setPgResource = registry.pgResources["query_interval_set"];
const getSelectPlanFromParentAndArgs2 = ($root, args, _info) => {
  const selectArgs = makeArgs_c_person_computed_out(args);
  return resource_query_interval_setPgResource.execute(selectArgs);
};
const resource_static_big_integerPgResource = registry.pgResources["static_big_integer"];
const getSelectPlanFromParentAndArgs3 = ($root, args, _info) => {
  const selectArgs = makeArgs_c_person_computed_out(args);
  return resource_static_big_integerPgResource.execute(selectArgs);
};
const argDetailsSimple_c_func_in_out = [{
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
const makeArgs_c_func_in_out = (args, path = []) => argDetailsSimple_c_func_in_out.map(details => makeArg(path, args, details));
const resource_c_func_in_outPgResource = registry.pgResources["c_func_in_out"];
const argDetailsSimple_c_func_returns_table_one_col = [{
  graphqlArgName: "i",
  postgresArgName: "i",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs_c_func_returns_table_one_col = (args, path = []) => argDetailsSimple_c_func_returns_table_one_col.map(details => makeArg(path, args, details));
const resource_c_func_returns_table_one_colPgResource = registry.pgResources["c_func_returns_table_one_col"];
const getSelectPlanFromParentAndArgs4 = ($root, args, _info) => {
  const selectArgs = makeArgs_c_func_returns_table_one_col(args);
  return resource_c_func_returns_table_one_colPgResource.execute(selectArgs);
};
const argDetailsSimple_c_json_identity = [{
  graphqlArgName: "json",
  postgresArgName: "json",
  pgCodec: TYPES.json,
  required: true,
  fetcher: null
}];
const makeArgs_c_json_identity = (args, path = []) => argDetailsSimple_c_json_identity.map(details => makeArg(path, args, details));
const resource_c_json_identityPgResource = registry.pgResources["c_json_identity"];
const argDetailsSimple_c_jsonb_identity = [{
  graphqlArgName: "json",
  postgresArgName: "json",
  pgCodec: TYPES.jsonb,
  required: true,
  fetcher: null
}];
const makeArgs_c_jsonb_identity = (args, path = []) => argDetailsSimple_c_jsonb_identity.map(details => makeArg(path, args, details));
const resource_c_jsonb_identityPgResource = registry.pgResources["c_jsonb_identity"];
const argDetailsSimple_add_1_query = [{
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
const makeArgs_add_1_query = (args, path = []) => argDetailsSimple_add_1_query.map(details => makeArg(path, args, details));
const resource_add_1_queryPgResource = registry.pgResources["add_1_query"];
const argDetailsSimple_add_2_query = [{
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
}];
const makeArgs_add_2_query = (args, path = []) => argDetailsSimple_add_2_query.map(details => makeArg(path, args, details));
const resource_add_2_queryPgResource = registry.pgResources["add_2_query"];
const argDetailsSimple_add_3_query = [{
  graphqlArgName: "a",
  postgresArgName: "a",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "arg1",
  postgresArgName: "",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs_add_3_query = (args, path = []) => argDetailsSimple_add_3_query.map(details => makeArg(path, args, details));
const resource_add_3_queryPgResource = registry.pgResources["add_3_query"];
const argDetailsSimple_add_4_query = [{
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
}];
const makeArgs_add_4_query = (args, path = []) => argDetailsSimple_add_4_query.map(details => makeArg(path, args, details));
const resource_add_4_queryPgResource = registry.pgResources["add_4_query"];
const argDetailsSimple_c_func_in_inout = [{
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
const makeArgs_c_func_in_inout = (args, path = []) => argDetailsSimple_c_func_in_inout.map(details => makeArg(path, args, details));
const resource_c_func_in_inoutPgResource = registry.pgResources["c_func_in_inout"];
const resource_c_func_out_outPgResource = registry.pgResources["c_func_out_out"];
const resource_c_func_out_out_setofPgResource = registry.pgResources["c_func_out_out_setof"];
const getSelectPlanFromParentAndArgs5 = ($root, args, _info) => {
  const selectArgs = makeArgs_c_person_computed_out(args);
  return resource_c_func_out_out_setofPgResource.execute(selectArgs);
};
const resource_c_func_out_out_unnamedPgResource = registry.pgResources["c_func_out_out_unnamed"];
const resource_c_search_test_summariesPgResource = registry.pgResources["c_search_test_summaries"];
const getSelectPlanFromParentAndArgs6 = ($root, args, _info) => {
  const selectArgs = makeArgs_c_person_computed_out(args);
  return resource_c_search_test_summariesPgResource.execute(selectArgs);
};
const argDetailsSimple_optional_missing_middle_1 = [{
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
const makeArgs_optional_missing_middle_1 = (args, path = []) => argDetailsSimple_optional_missing_middle_1.map(details => makeArg(path, args, details));
const resource_optional_missing_middle_1PgResource = registry.pgResources["optional_missing_middle_1"];
const argDetailsSimple_optional_missing_middle_2 = [{
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
const makeArgs_optional_missing_middle_2 = (args, path = []) => argDetailsSimple_optional_missing_middle_2.map(details => makeArg(path, args, details));
const resource_optional_missing_middle_2PgResource = registry.pgResources["optional_missing_middle_2"];
const argDetailsSimple_optional_missing_middle_3 = [{
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
const makeArgs_optional_missing_middle_3 = (args, path = []) => argDetailsSimple_optional_missing_middle_3.map(details => makeArg(path, args, details));
const resource_optional_missing_middle_3PgResource = registry.pgResources["optional_missing_middle_3"];
const argDetailsSimple_optional_missing_middle_4 = [{
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
const makeArgs_optional_missing_middle_4 = (args, path = []) => argDetailsSimple_optional_missing_middle_4.map(details => makeArg(path, args, details));
const resource_optional_missing_middle_4PgResource = registry.pgResources["optional_missing_middle_4"];
const argDetailsSimple_optional_missing_middle_5 = [{
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
const makeArgs_optional_missing_middle_5 = (args, path = []) => argDetailsSimple_optional_missing_middle_5.map(details => makeArg(path, args, details));
const resource_optional_missing_middle_5PgResource = registry.pgResources["optional_missing_middle_5"];
const resource_c_func_out_unnamed_out_out_unnamedPgResource = registry.pgResources["c_func_out_unnamed_out_out_unnamed"];
const argDetailsSimple_c_int_set_query = [{
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
const makeArgs_c_int_set_query = (args, path = []) => argDetailsSimple_c_int_set_query.map(details => makeArg(path, args, details));
const resource_c_int_set_queryPgResource = registry.pgResources["c_int_set_query"];
const getSelectPlanFromParentAndArgs7 = ($root, args, _info) => {
  const selectArgs = makeArgs_c_int_set_query(args);
  return resource_c_int_set_queryPgResource.execute(selectArgs);
};
const argDetailsSimple_c_func_returns_table_multi_col = [{
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
const makeArgs_c_func_returns_table_multi_col = (args, path = []) => argDetailsSimple_c_func_returns_table_multi_col.map(details => makeArg(path, args, details));
const resource_c_func_returns_table_multi_colPgResource = registry.pgResources["c_func_returns_table_multi_col"];
const getSelectPlanFromParentAndArgs8 = ($root, args, _info) => {
  const selectArgs = makeArgs_c_func_returns_table_multi_col(args);
  return resource_c_func_returns_table_multi_colPgResource.execute(selectArgs);
};
const resource_query_interval_arrayPgResource = registry.pgResources["query_interval_array"];
const resource_query_text_arrayPgResource = registry.pgResources["query_text_array"];
const resource_c_return_table_without_grantsPgResource = registry.pgResources["c_return_table_without_grants"];
const argDetailsSimple_c_types_query = [{
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
  pgCodec: pgCatalogInt4ArrayCodec,
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
  pgCodec: cFloatrangeCodec,
  required: true,
  fetcher: null
}];
const makeArgs_c_types_query = (args, path = []) => argDetailsSimple_c_types_query.map(details => makeArg(path, args, details));
const resource_c_types_queryPgResource = registry.pgResources["c_types_query"];
const argDetailsSimple_c_compound_type_computed_field = [{
  graphqlArgName: "compoundType",
  postgresArgName: "compound_type",
  pgCodec: cCompoundTypeCodec,
  required: true,
  fetcher: null
}];
const makeArgs_c_compound_type_computed_field = (args, path = []) => argDetailsSimple_c_compound_type_computed_field.map(details => makeArg(path, args, details));
const resource_c_compound_type_computed_fieldPgResource = registry.pgResources["c_compound_type_computed_field"];
const argDetailsSimple_c_func_out_out_compound_type = [{
  graphqlArgName: "i1",
  postgresArgName: "i1",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs_c_func_out_out_compound_type = (args, path = []) => argDetailsSimple_c_func_out_out_compound_type.map(details => makeArg(path, args, details));
const resource_c_func_out_out_compound_typePgResource = registry.pgResources["c_func_out_out_compound_type"];
const argDetailsSimple_c_query_output_two_rows = [{
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
const makeArgs_c_query_output_two_rows = (args, path = []) => argDetailsSimple_c_query_output_two_rows.map(details => makeArg(path, args, details));
const resource_c_query_output_two_rowsPgResource = registry.pgResources["c_query_output_two_rows"];
const resource_c_compound_type_set_queryPgResource = registry.pgResources["c_compound_type_set_query"];
const getSelectPlanFromParentAndArgs9 = ($root, args, _info) => {
  const selectArgs = makeArgs_c_person_computed_out(args);
  return resource_c_compound_type_set_queryPgResource.execute(selectArgs);
};
const argDetailsSimple_b_compound_type_query = [{
  graphqlArgName: "object",
  postgresArgName: "object",
  pgCodec: cCompoundTypeCodec,
  required: true,
  fetcher: null
}];
const makeArgs_b_compound_type_query = (args, path = []) => argDetailsSimple_b_compound_type_query.map(details => makeArg(path, args, details));
const resource_b_compound_type_queryPgResource = registry.pgResources["b_compound_type_query"];
const argDetailsSimple_c_table_query = [{
  graphqlArgName: "id",
  postgresArgName: "id",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs_c_table_query = (args, path = []) => argDetailsSimple_c_table_query.map(details => makeArg(path, args, details));
const resource_c_table_queryPgResource = registry.pgResources["c_table_query"];
const argDetailsSimple_query_compound_type_array = [{
  graphqlArgName: "object",
  postgresArgName: "object",
  pgCodec: cCompoundTypeCodec,
  required: true,
  fetcher: null
}];
const makeArgs_query_compound_type_array = (args, path = []) => argDetailsSimple_query_compound_type_array.map(details => makeArg(path, args, details));
const resource_query_compound_type_arrayPgResource = registry.pgResources["query_compound_type_array"];
const argDetailsSimple_b_compound_type_array_query = [{
  graphqlArgName: "object",
  postgresArgName: "object",
  pgCodec: cCompoundTypeCodec,
  required: true,
  fetcher: null
}];
const makeArgs_b_compound_type_array_query = (args, path = []) => argDetailsSimple_b_compound_type_array_query.map(details => makeArg(path, args, details));
const resource_b_compound_type_array_queryPgResource = registry.pgResources["b_compound_type_array_query"];
const argDetailsSimple_c_func_out_complex = [{
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
const makeArgs_c_func_out_complex = (args, path = []) => argDetailsSimple_c_func_out_complex.map(details => makeArg(path, args, details));
const resource_c_func_out_complexPgResource = registry.pgResources["c_func_out_complex"];
const argDetailsSimple_c_func_out_complex_setof = [{
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
const makeArgs_c_func_out_complex_setof = (args, path = []) => argDetailsSimple_c_func_out_complex_setof.map(details => makeArg(path, args, details));
const resource_c_func_out_complex_setofPgResource = registry.pgResources["c_func_out_complex_setof"];
const getSelectPlanFromParentAndArgs10 = ($root, args, _info) => {
  const selectArgs = makeArgs_c_func_out_complex_setof(args);
  return resource_c_func_out_complex_setofPgResource.execute(selectArgs);
};
const resource_c_badly_behaved_functionPgResource = registry.pgResources["c_badly_behaved_function"];
const getSelectPlanFromParentAndArgs11 = ($root, args, _info) => {
  const selectArgs = makeArgs_c_person_computed_out(args);
  return resource_c_badly_behaved_functionPgResource.execute(selectArgs);
};
const resource_c_func_out_tablePgResource = registry.pgResources["c_func_out_table"];
const resource_c_func_out_table_setofPgResource = registry.pgResources["c_func_out_table_setof"];
const getSelectPlanFromParentAndArgs12 = ($root, args, _info) => {
  const selectArgs = makeArgs_c_person_computed_out(args);
  return resource_c_func_out_table_setofPgResource.execute(selectArgs);
};
const resource_c_table_set_queryPgResource = registry.pgResources["c_table_set_query"];
const getSelectPlanFromParentAndArgs13 = ($root, args, _info) => {
  const selectArgs = makeArgs_c_person_computed_out(args);
  return resource_c_table_set_queryPgResource.execute(selectArgs);
};
const resource_c_table_set_query_plpgsqlPgResource = registry.pgResources["c_table_set_query_plpgsql"];
const getSelectPlanFromParentAndArgs14 = ($root, args, _info) => {
  const selectArgs = makeArgs_c_person_computed_out(args);
  return resource_c_table_set_query_plpgsqlPgResource.execute(selectArgs);
};
const resource_b_type_function_connectionPgResource = registry.pgResources["b_type_function_connection"];
const getSelectPlanFromParentAndArgs15 = ($root, args, _info) => {
  const selectArgs = makeArgs_c_person_computed_out(args);
  return resource_b_type_function_connectionPgResource.execute(selectArgs);
};
const argDetailsSimple_b_type_function = [{
  graphqlArgName: "id",
  postgresArgName: "id",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs_b_type_function = (args, path = []) => argDetailsSimple_b_type_function.map(details => makeArg(path, args, details));
const resource_b_type_functionPgResource = registry.pgResources["b_type_function"];
const resource_b_type_function_listPgResource = registry.pgResources["b_type_function_list"];
const resource_non_updatable_viewPgResource = registry.pgResources["non_updatable_view"];
function qbWhereBuilder(qb) {
  return qb.whereBuilder();
}
const resource_foreign_keyPgResource = registry.pgResources["foreign_key"];
const resource_testviewPgResource = registry.pgResources["testview"];
const resource_b_updatable_viewPgResource = registry.pgResources["b_updatable_view"];
const resource_c_edge_casePgResource = registry.pgResources["c_edge_case"];
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
const resource_c_person_computed_outPgResource = registry.pgResources["c_person_computed_out"];
const resource_c_person_first_namePgResource = registry.pgResources["c_person_first_name"];
const resource_c_person_computed_out_outPgResource = registry.pgResources["c_person_computed_out_out"];
const argDetailsSimple_c_person_computed_inout = [{
  graphqlArgName: "ino",
  postgresArgName: "ino",
  pgCodec: TYPES.text,
  required: true,
  fetcher: null
}];
const makeArgs_c_person_computed_inout = (args, path = []) => argDetailsSimple_c_person_computed_inout.map(details => makeArg(path, args, details));
const resource_c_person_computed_inoutPgResource = registry.pgResources["c_person_computed_inout"];
const argDetailsSimple_c_person_computed_inout_out = [{
  graphqlArgName: "ino",
  postgresArgName: "ino",
  pgCodec: TYPES.text,
  required: true,
  fetcher: null
}];
const makeArgs_c_person_computed_inout_out = (args, path = []) => argDetailsSimple_c_person_computed_inout_out.map(details => makeArg(path, args, details));
const resource_c_person_computed_inout_outPgResource = registry.pgResources["c_person_computed_inout_out"];
const argDetailsSimple_c_person_exists = [{
  graphqlArgName: "email",
  postgresArgName: "email",
  pgCodec: bEmailCodec,
  required: true,
  fetcher: null
}];
const makeArgs_c_person_exists = (args, path = []) => argDetailsSimple_c_person_exists.map(details => makeArg(path, args, details));
const resource_c_person_existsPgResource = registry.pgResources["c_person_exists"];
const resource_c_person_computed_first_arg_inout_outPgResource = registry.pgResources["c_person_computed_first_arg_inout_out"];
const argDetailsSimple_c_person_optional_missing_middle_1 = [{
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
const makeArgs_c_person_optional_missing_middle_1 = (args, path = []) => argDetailsSimple_c_person_optional_missing_middle_1.map(details => makeArg(path, args, details));
const resource_c_person_optional_missing_middle_1PgResource = registry.pgResources["c_person_optional_missing_middle_1"];
const argDetailsSimple_c_person_optional_missing_middle_2 = [{
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
const makeArgs_c_person_optional_missing_middle_2 = (args, path = []) => argDetailsSimple_c_person_optional_missing_middle_2.map(details => makeArg(path, args, details));
const resource_c_person_optional_missing_middle_2PgResource = registry.pgResources["c_person_optional_missing_middle_2"];
const argDetailsSimple_c_person_optional_missing_middle_3 = [{
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
const makeArgs_c_person_optional_missing_middle_3 = (args, path = []) => argDetailsSimple_c_person_optional_missing_middle_3.map(details => makeArg(path, args, details));
const resource_c_person_optional_missing_middle_3PgResource = registry.pgResources["c_person_optional_missing_middle_3"];
const argDetailsSimple_c_person_optional_missing_middle_4 = [{
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
const makeArgs_c_person_optional_missing_middle_4 = (args, path = []) => argDetailsSimple_c_person_optional_missing_middle_4.map(details => makeArg(path, args, details));
const resource_c_person_optional_missing_middle_4PgResource = registry.pgResources["c_person_optional_missing_middle_4"];
const argDetailsSimple_c_person_optional_missing_middle_5 = [{
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
const makeArgs_c_person_optional_missing_middle_5 = (args, path = []) => argDetailsSimple_c_person_optional_missing_middle_5.map(details => makeArg(path, args, details));
const resource_c_person_optional_missing_middle_5PgResource = registry.pgResources["c_person_optional_missing_middle_5"];
const argDetailsSimple_c_person_computed_complex = [{
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
const makeArgs_c_person_computed_complex = (args, path = []) => argDetailsSimple_c_person_computed_complex.map(details => makeArg(path, args, details));
const resource_c_person_computed_complexPgResource = registry.pgResources["c_person_computed_complex"];
const resource_c_person_first_postPgResource = registry.pgResources["c_person_first_post"];
const resource_c_person_computed_first_arg_inoutPgResource = registry.pgResources["c_person_computed_first_arg_inout"];
const resource_c_person_friendsPgResource = registry.pgResources["c_person_friends"];
const getSelectPlanFromParentAndArgs16 = ($in, args, _info) => {
  const {
    selectArgs
  } = pgFunctionArgumentsFromArgs($in, makeArgs_c_person_computed_out(args));
  return resource_c_person_friendsPgResource.execute(selectArgs);
};
const resource_c_person_type_function_connectionPgResource = registry.pgResources["c_person_type_function_connection"];
const getSelectPlanFromParentAndArgs17 = ($in, args, _info) => {
  const {
    selectArgs
  } = pgFunctionArgumentsFromArgs($in, makeArgs_c_person_computed_out(args));
  return resource_c_person_type_function_connectionPgResource.execute(selectArgs);
};
const argDetailsSimple_c_person_type_function = [{
  graphqlArgName: "id",
  postgresArgName: "id",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs_c_person_type_function = (args, path = []) => argDetailsSimple_c_person_type_function.map(details => makeArg(path, args, details));
const resource_c_person_type_functionPgResource = registry.pgResources["c_person_type_function"];
const resource_c_person_type_function_listPgResource = registry.pgResources["c_person_type_function_list"];
const resource_frmcdc_bWrappedUrlPgResource = registry.pgResources["frmcdc_bWrappedUrl"];
const resource_frmcdc_cCompoundTypePgResource = registry.pgResources["frmcdc_cCompoundType"];
function UUIDSerialize(value) {
  return "" + value;
}
const coerce = string => {
  if (!/^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i.test(string)) {
    throw new GraphQLError("Invalid UUID, expected 32 hexadecimal characters, optionally with hypens");
  }
  return string;
};
const resource_post_computed_interval_setPgResource = registry.pgResources["post_computed_interval_set"];
const getSelectPlanFromParentAndArgs18 = ($in, args, _info) => {
  const {
    selectArgs
  } = pgFunctionArgumentsFromArgs($in, makeArgs_c_person_computed_out(args));
  return resource_post_computed_interval_setPgResource.execute(selectArgs);
};
const resource_post_computed_interval_arrayPgResource = registry.pgResources["post_computed_interval_array"];
const resource_post_computed_text_arrayPgResource = registry.pgResources["post_computed_text_array"];
const argDetailsSimple_post_computed_with_optional_arg = [{
  graphqlArgName: "i",
  postgresArgName: "i",
  pgCodec: TYPES.int,
  required: false,
  fetcher: null
}];
const makeArgs_post_computed_with_optional_arg = (args, path = []) => argDetailsSimple_post_computed_with_optional_arg.map(details => makeArg(path, args, details));
const resource_post_computed_with_optional_argPgResource = registry.pgResources["post_computed_with_optional_arg"];
const argDetailsSimple_post_computed_with_required_arg = [{
  graphqlArgName: "i",
  postgresArgName: "i",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs_post_computed_with_required_arg = (args, path = []) => argDetailsSimple_post_computed_with_required_arg.map(details => makeArg(path, args, details));
const resource_post_computed_with_required_argPgResource = registry.pgResources["post_computed_with_required_arg"];
const argDetailsSimple_post_headline_trimmed = [{
  graphqlArgName: "length",
  postgresArgName: "length",
  pgCodec: TYPES.int,
  required: false,
  fetcher: null
}, {
  graphqlArgName: "omission",
  postgresArgName: "omission",
  pgCodec: TYPES.text,
  required: false,
  fetcher: null
}];
const makeArgs_post_headline_trimmed = (args, path = []) => argDetailsSimple_post_headline_trimmed.map(details => makeArg(path, args, details));
const resource_post_headline_trimmedPgResource = registry.pgResources["post_headline_trimmed"];
const argDetailsSimple_post_headline_trimmed_no_defaults = [{
  graphqlArgName: "length",
  postgresArgName: "length",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "omission",
  postgresArgName: "omission",
  pgCodec: TYPES.text,
  required: true,
  fetcher: null
}];
const makeArgs_post_headline_trimmed_no_defaults = (args, path = []) => argDetailsSimple_post_headline_trimmed_no_defaults.map(details => makeArg(path, args, details));
const resource_post_headline_trimmed_no_defaultsPgResource = registry.pgResources["post_headline_trimmed_no_defaults"];
const argDetailsSimple_post_headline_trimmed_strict = [{
  graphqlArgName: "length",
  postgresArgName: "length",
  pgCodec: TYPES.int,
  required: false,
  fetcher: null
}, {
  graphqlArgName: "omission",
  postgresArgName: "omission",
  pgCodec: TYPES.text,
  required: false,
  fetcher: null
}];
const makeArgs_post_headline_trimmed_strict = (args, path = []) => argDetailsSimple_post_headline_trimmed_strict.map(details => makeArg(path, args, details));
const resource_post_headline_trimmed_strictPgResource = registry.pgResources["post_headline_trimmed_strict"];
const argDetailsSimple_post_computed_compound_type_array = [{
  graphqlArgName: "object",
  postgresArgName: "object",
  pgCodec: cCompoundTypeCodec,
  required: true,
  fetcher: null
}];
const makeArgs_post_computed_compound_type_array = (args, path = []) => argDetailsSimple_post_computed_compound_type_array.map(details => makeArg(path, args, details));
const resource_post_computed_compound_type_arrayPgResource = registry.pgResources["post_computed_compound_type_array"];
const resource_frmcdc_comptypePgResource = registry.pgResources["frmcdc_comptype"];
const resource_frmcdc_bNestedCompoundTypePgResource = registry.pgResources["frmcdc_bNestedCompoundType"];
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
const resource_c_edge_case_computedPgResource = registry.pgResources["c_edge_case_computed"];
const resource_c_mutation_outPgResource = registry.pgResources["c_mutation_out"];
const resource_c_mutation_out_setofPgResource = registry.pgResources["c_mutation_out_setof"];
const resource_c_mutation_out_unnamedPgResource = registry.pgResources["c_mutation_out_unnamed"];
const resource_c_no_args_mutationPgResource = registry.pgResources["c_no_args_mutation"];
const resource_return_void_mutationPgResource = registry.pgResources["return_void_mutation"];
const resource_mutation_interval_setPgResource = registry.pgResources["mutation_interval_set"];
const argDetailsSimple_c_mutation_in_out = [{
  graphqlArgName: "i",
  postgresArgName: "i",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs_c_mutation_in_out = (args, path = []) => argDetailsSimple_c_mutation_in_out.map(details => makeArg(path, args, details));
const resource_c_mutation_in_outPgResource = registry.pgResources["c_mutation_in_out"];
const argDetailsSimple_c_mutation_returns_table_one_col = [{
  graphqlArgName: "i",
  postgresArgName: "i",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs_c_mutation_returns_table_one_col = (args, path = []) => argDetailsSimple_c_mutation_returns_table_one_col.map(details => makeArg(path, args, details));
const resource_c_mutation_returns_table_one_colPgResource = registry.pgResources["c_mutation_returns_table_one_col"];
const argDetailsSimple_c_json_identity_mutation = [{
  graphqlArgName: "json",
  postgresArgName: "json",
  pgCodec: TYPES.json,
  required: true,
  fetcher: null
}];
const makeArgs_c_json_identity_mutation = (args, path = []) => argDetailsSimple_c_json_identity_mutation.map(details => makeArg(path, args, details));
const resource_c_json_identity_mutationPgResource = registry.pgResources["c_json_identity_mutation"];
const argDetailsSimple_c_jsonb_identity_mutation = [{
  graphqlArgName: "json",
  postgresArgName: "json",
  pgCodec: TYPES.jsonb,
  required: true,
  fetcher: null
}];
const makeArgs_c_jsonb_identity_mutation = (args, path = []) => argDetailsSimple_c_jsonb_identity_mutation.map(details => makeArg(path, args, details));
const resource_c_jsonb_identity_mutationPgResource = registry.pgResources["c_jsonb_identity_mutation"];
const argDetailsSimple_c_jsonb_identity_mutation_plpgsql = [{
  graphqlArgName: "_theJson",
  postgresArgName: "_the_json",
  pgCodec: TYPES.jsonb,
  required: true,
  fetcher: null
}];
const makeArgs_c_jsonb_identity_mutation_plpgsql = (args, path = []) => argDetailsSimple_c_jsonb_identity_mutation_plpgsql.map(details => makeArg(path, args, details));
const resource_c_jsonb_identity_mutation_plpgsqlPgResource = registry.pgResources["c_jsonb_identity_mutation_plpgsql"];
const argDetailsSimple_c_jsonb_identity_mutation_plpgsql_with_default = [{
  graphqlArgName: "_theJson",
  postgresArgName: "_the_json",
  pgCodec: TYPES.jsonb,
  required: false,
  fetcher: null
}];
const makeArgs_c_jsonb_identity_mutation_plpgsql_with_default = (args, path = []) => argDetailsSimple_c_jsonb_identity_mutation_plpgsql_with_default.map(details => makeArg(path, args, details));
const resource_c_jsonb_identity_mutation_plpgsql_with_defaultPgResource = registry.pgResources["c_jsonb_identity_mutation_plpgsql_with_default"];
const argDetailsSimple_add_1_mutation = [{
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
const makeArgs_add_1_mutation = (args, path = []) => argDetailsSimple_add_1_mutation.map(details => makeArg(path, args, details));
const resource_add_1_mutationPgResource = registry.pgResources["add_1_mutation"];
const argDetailsSimple_add_2_mutation = [{
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
}];
const makeArgs_add_2_mutation = (args, path = []) => argDetailsSimple_add_2_mutation.map(details => makeArg(path, args, details));
const resource_add_2_mutationPgResource = registry.pgResources["add_2_mutation"];
const argDetailsSimple_add_3_mutation = [{
  graphqlArgName: "a",
  postgresArgName: "a",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "arg1",
  postgresArgName: "",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs_add_3_mutation = (args, path = []) => argDetailsSimple_add_3_mutation.map(details => makeArg(path, args, details));
const resource_add_3_mutationPgResource = registry.pgResources["add_3_mutation"];
const argDetailsSimple_add_4_mutation = [{
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
}];
const makeArgs_add_4_mutation = (args, path = []) => argDetailsSimple_add_4_mutation.map(details => makeArg(path, args, details));
const resource_add_4_mutationPgResource = registry.pgResources["add_4_mutation"];
const argDetailsSimple_add_4_mutation_error = [{
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
}];
const makeArgs_add_4_mutation_error = (args, path = []) => argDetailsSimple_add_4_mutation_error.map(details => makeArg(path, args, details));
const resource_add_4_mutation_errorPgResource = registry.pgResources["add_4_mutation_error"];
const argDetailsSimple_b_mult_1 = [{
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
const makeArgs_b_mult_1 = (args, path = []) => argDetailsSimple_b_mult_1.map(details => makeArg(path, args, details));
const resource_b_mult_1PgResource = registry.pgResources["b_mult_1"];
const argDetailsSimple_b_mult_2 = [{
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
const makeArgs_b_mult_2 = (args, path = []) => argDetailsSimple_b_mult_2.map(details => makeArg(path, args, details));
const resource_b_mult_2PgResource = registry.pgResources["b_mult_2"];
const argDetailsSimple_b_mult_3 = [{
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
const makeArgs_b_mult_3 = (args, path = []) => argDetailsSimple_b_mult_3.map(details => makeArg(path, args, details));
const resource_b_mult_3PgResource = registry.pgResources["b_mult_3"];
const argDetailsSimple_b_mult_4 = [{
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
const makeArgs_b_mult_4 = (args, path = []) => argDetailsSimple_b_mult_4.map(details => makeArg(path, args, details));
const resource_b_mult_4PgResource = registry.pgResources["b_mult_4"];
const argDetailsSimple_c_mutation_in_inout = [{
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
const makeArgs_c_mutation_in_inout = (args, path = []) => argDetailsSimple_c_mutation_in_inout.map(details => makeArg(path, args, details));
const resource_c_mutation_in_inoutPgResource = registry.pgResources["c_mutation_in_inout"];
const resource_c_mutation_out_outPgResource = registry.pgResources["c_mutation_out_out"];
const resource_c_mutation_out_out_setofPgResource = registry.pgResources["c_mutation_out_out_setof"];
const resource_c_mutation_out_out_unnamedPgResource = registry.pgResources["c_mutation_out_out_unnamed"];
const argDetailsSimple_c_int_set_mutation = [{
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
const makeArgs_c_int_set_mutation = (args, path = []) => argDetailsSimple_c_int_set_mutation.map(details => makeArg(path, args, details));
const resource_c_int_set_mutationPgResource = registry.pgResources["c_int_set_mutation"];
const resource_c_mutation_out_unnamed_out_out_unnamedPgResource = registry.pgResources["c_mutation_out_unnamed_out_out_unnamed"];
const argDetailsSimple_c_mutation_returns_table_multi_col = [{
  graphqlArgName: "i",
  postgresArgName: "i",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs_c_mutation_returns_table_multi_col = (args, path = []) => argDetailsSimple_c_mutation_returns_table_multi_col.map(details => makeArg(path, args, details));
const resource_c_mutation_returns_table_multi_colPgResource = registry.pgResources["c_mutation_returns_table_multi_col"];
const argDetailsSimple_b_guid_fn = [{
  graphqlArgName: "g",
  postgresArgName: "g",
  pgCodec: bGuidCodec,
  required: true,
  fetcher: null
}];
const makeArgs_b_guid_fn = (args, path = []) => argDetailsSimple_b_guid_fn.map(details => makeArg(path, args, details));
const resource_b_guid_fnPgResource = registry.pgResources["b_guid_fn"];
const resource_mutation_interval_arrayPgResource = registry.pgResources["mutation_interval_array"];
const resource_mutation_text_arrayPgResource = registry.pgResources["mutation_text_array"];
const argDetailsSimple_b_list_bde_mutation = [{
  graphqlArgName: "b",
  postgresArgName: "b",
  pgCodec: pgCatalogTextArrayCodec,
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
const makeArgs_b_list_bde_mutation = (args, path = []) => argDetailsSimple_b_list_bde_mutation.map(details => makeArg(path, args, details));
const resource_b_list_bde_mutationPgResource = registry.pgResources["b_list_bde_mutation"];
const resource_b_authenticate_failPgResource = registry.pgResources["b_authenticate_fail"];
const argDetailsSimple_b_authenticate = [{
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
const makeArgs_b_authenticate = (args, path = []) => argDetailsSimple_b_authenticate.map(details => makeArg(path, args, details));
const resource_b_authenticatePgResource = registry.pgResources["b_authenticate"];
const argDetailsSimple_c_left_arm_identity = [{
  graphqlArgName: "leftArm",
  postgresArgName: "left_arm",
  pgCodec: cLeftArmCodec,
  required: true,
  fetcher: null
}];
const makeArgs_c_left_arm_identity = (args, path = []) => argDetailsSimple_c_left_arm_identity.map(details => makeArg(path, args, details));
const resource_c_left_arm_identityPgResource = registry.pgResources["c_left_arm_identity"];
const resource_c_issue756_mutationPgResource = registry.pgResources["c_issue756_mutation"];
const resource_c_issue756_set_mutationPgResource = registry.pgResources["c_issue756_set_mutation"];
const argDetailsSimple_b_authenticate_many = [{
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
const makeArgs_b_authenticate_many = (args, path = []) => argDetailsSimple_b_authenticate_many.map(details => makeArg(path, args, details));
const resource_b_authenticate_manyPgResource = registry.pgResources["b_authenticate_many"];
const argDetailsSimple_b_authenticate_payload = [{
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
const makeArgs_b_authenticate_payload = (args, path = []) => argDetailsSimple_b_authenticate_payload.map(details => makeArg(path, args, details));
const resource_b_authenticate_payloadPgResource = registry.pgResources["b_authenticate_payload"];
const argDetailsSimple_c_types_mutation = [{
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
  pgCodec: pgCatalogInt4ArrayCodec,
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
  pgCodec: cFloatrangeCodec,
  required: true,
  fetcher: null
}];
const makeArgs_c_types_mutation = (args, path = []) => argDetailsSimple_c_types_mutation.map(details => makeArg(path, args, details));
const resource_c_types_mutationPgResource = registry.pgResources["c_types_mutation"];
const argDetailsSimple_c_mutation_out_out_compound_type = [{
  graphqlArgName: "i1",
  postgresArgName: "i1",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs_c_mutation_out_out_compound_type = (args, path = []) => argDetailsSimple_c_mutation_out_out_compound_type.map(details => makeArg(path, args, details));
const resource_c_mutation_out_out_compound_typePgResource = registry.pgResources["c_mutation_out_out_compound_type"];
const argDetailsSimple_b_compound_type_mutation = [{
  graphqlArgName: "object",
  postgresArgName: "object",
  pgCodec: cCompoundTypeCodec,
  required: true,
  fetcher: null
}];
const makeArgs_b_compound_type_mutation = (args, path = []) => argDetailsSimple_b_compound_type_mutation.map(details => makeArg(path, args, details));
const resource_b_compound_type_mutationPgResource = registry.pgResources["b_compound_type_mutation"];
const argDetailsSimple_b_compound_type_set_mutation = [{
  graphqlArgName: "object",
  postgresArgName: "object",
  pgCodec: cCompoundTypeCodec,
  required: true,
  fetcher: null
}];
const makeArgs_b_compound_type_set_mutation = (args, path = []) => argDetailsSimple_b_compound_type_set_mutation.map(details => makeArg(path, args, details));
const resource_b_compound_type_set_mutationPgResource = registry.pgResources["b_compound_type_set_mutation"];
const argDetailsSimple_c_list_of_compound_types_mutation = [{
  graphqlArgName: "records",
  postgresArgName: "records",
  pgCodec: cCompoundTypeArrayCodec,
  required: true,
  fetcher: null
}];
const makeArgs_c_list_of_compound_types_mutation = (args, path = []) => argDetailsSimple_c_list_of_compound_types_mutation.map(details => makeArg(path, args, details));
const resource_c_list_of_compound_types_mutationPgResource = registry.pgResources["c_list_of_compound_types_mutation"];
const argDetailsSimple_c_table_mutation = [{
  graphqlArgName: "id",
  postgresArgName: "id",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs_c_table_mutation = (args, path = []) => argDetailsSimple_c_table_mutation.map(details => makeArg(path, args, details));
const resource_c_table_mutationPgResource = registry.pgResources["c_table_mutation"];
const argDetailsSimple_post_with_suffix = [{
  graphqlArgName: "post",
  postgresArgName: "post",
  pgCodec: postCodec,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "suffix",
  postgresArgName: "suffix",
  pgCodec: TYPES.text,
  required: true,
  fetcher: null
}];
const makeArgs_post_with_suffix = (args, path = []) => argDetailsSimple_post_with_suffix.map(details => makeArg(path, args, details));
const resource_post_with_suffixPgResource = registry.pgResources["post_with_suffix"];
const argDetailsSimple_mutation_compound_type_array = [{
  graphqlArgName: "object",
  postgresArgName: "object",
  pgCodec: cCompoundTypeCodec,
  required: true,
  fetcher: null
}];
const makeArgs_mutation_compound_type_array = (args, path = []) => argDetailsSimple_mutation_compound_type_array.map(details => makeArg(path, args, details));
const resource_mutation_compound_type_arrayPgResource = registry.pgResources["mutation_compound_type_array"];
const argDetailsSimple_b_compound_type_array_mutation = [{
  graphqlArgName: "object",
  postgresArgName: "object",
  pgCodec: cCompoundTypeCodec,
  required: true,
  fetcher: null
}];
const makeArgs_b_compound_type_array_mutation = (args, path = []) => argDetailsSimple_b_compound_type_array_mutation.map(details => makeArg(path, args, details));
const resource_b_compound_type_array_mutationPgResource = registry.pgResources["b_compound_type_array_mutation"];
const argDetailsSimple_post_many = [{
  graphqlArgName: "posts",
  postgresArgName: "posts",
  pgCodec: postArrayCodec,
  required: true,
  fetcher: null
}];
const makeArgs_post_many = (args, path = []) => argDetailsSimple_post_many.map(details => makeArg(path, args, details));
const resource_post_manyPgResource = registry.pgResources["post_many"];
const argDetailsSimple_c_mutation_out_complex = [{
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
const makeArgs_c_mutation_out_complex = (args, path = []) => argDetailsSimple_c_mutation_out_complex.map(details => makeArg(path, args, details));
const resource_c_mutation_out_complexPgResource = registry.pgResources["c_mutation_out_complex"];
const argDetailsSimple_c_mutation_out_complex_setof = [{
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
const makeArgs_c_mutation_out_complex_setof = (args, path = []) => argDetailsSimple_c_mutation_out_complex_setof.map(details => makeArg(path, args, details));
const resource_c_mutation_out_complex_setofPgResource = registry.pgResources["c_mutation_out_complex_setof"];
const resource_c_mutation_out_tablePgResource = registry.pgResources["c_mutation_out_table"];
const resource_c_mutation_out_table_setofPgResource = registry.pgResources["c_mutation_out_table_setof"];
const resource_c_table_set_mutationPgResource = registry.pgResources["c_table_set_mutation"];
const resource_b_type_function_connection_mutationPgResource = registry.pgResources["b_type_function_connection_mutation"];
const argDetailsSimple_b_type_function_mutation = [{
  graphqlArgName: "id",
  postgresArgName: "id",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs_b_type_function_mutation = (args, path = []) => argDetailsSimple_b_type_function_mutation.map(details => makeArg(path, args, details));
const resource_b_type_function_mutationPgResource = registry.pgResources["b_type_function_mutation"];
const resource_b_type_function_list_mutationPgResource = registry.pgResources["b_type_function_list_mutation"];
const resource_frmcdc_bJwtTokenPgResource = registry.pgResources["frmcdc_bJwtToken"];
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
  queryIntervalArray: [Interval]
  queryTextArray: [String]
  cReturnTableWithoutGrants: CCompoundKey
  cTypesQuery(a: BigInt!, b: Boolean!, c: String!, d: [Int]!, e: JSON!, f: FloatRangeInput!): Boolean
  cCompoundTypeComputedField(compoundType: CCompoundTypeInput): Int
  cFuncOutOutCompoundType(i1: Int): CFuncOutOutCompoundTypeRecord
  cQueryOutputTwoRows(leftArmId: Int, postId: Int, txt: String): CQueryOutputTwoRowsRecord

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
  cTableQuery(id: Int): Post
  queryCompoundTypeArray(object: CCompoundTypeInput): [CCompoundType]
  bCompoundTypeArrayQuery(object: CCompoundTypeInput): [CCompoundType]
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
  computedIntervalArray: [Interval]
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

  """Checks for equality with the object’s \`json\` field."""
  json: JSON

  """Checks for equality with the object’s \`jsonb\` field."""
  jsonb: JSON

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

type CFuncOutOutCompoundTypeRecord {
  o1: Int
  o2: CCompoundType
}

type CQueryOutputTwoRowsRecord {
  txt: String
  leftArm: CLeftArm
  post: Post
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

  """Checks for equality with the object’s \`jsonData\` field."""
  jsonData: JSON
}

"""Methods to use when ordering \`CMyTable\`."""
enum CMyTableOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ROW_ID_ASC
  ROW_ID_DESC
  JSON_DATA_ASC
  JSON_DATA_DESC
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

  """Checks for equality with the object’s \`config\` field."""
  config: KeyValueHash

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
  mutationIntervalSet(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: MutationIntervalSetInput!
  ): MutationIntervalSetPayload
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
  bGuidFn(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: BGuidFnInput!
  ): BGuidFnPayload
  mutationIntervalArray(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: MutationIntervalArrayInput!
  ): MutationIntervalArrayPayload
  mutationTextArray(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: MutationTextArrayInput!
  ): MutationTextArrayPayload
  bListBdeMutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: BListBdeMutationInput!
  ): BListBdeMutationPayload
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
  cTypesMutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CTypesMutationInput!
  ): CTypesMutationPayload
  cMutationOutOutCompoundType(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CMutationOutOutCompoundTypeInput!
  ): CMutationOutOutCompoundTypePayload
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
export const plans = {
  Query: {
    __assertStep() {
      return true;
    },
    query() {
      return rootValue();
    },
    inputByRowId(_$root, {
      $rowId
    }) {
      return resource_inputsPgResource.get({
        id: $rowId
      });
    },
    patchByRowId(_$root, {
      $rowId
    }) {
      return resource_patchsPgResource.get({
        id: $rowId
      });
    },
    reservedByRowId(_$root, {
      $rowId
    }) {
      return resource_reservedPgResource.get({
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
    reservedInputRecordByRowId(_$root, {
      $rowId
    }) {
      return resource_reserved_inputPgResource.get({
        id: $rowId
      });
    },
    defaultValueByRowId(_$root, {
      $rowId
    }) {
      return resource_default_valuePgResource.get({
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
    uniqueForeignKeyByCompoundKey1AndCompoundKey2(_$root, {
      $compoundKey1,
      $compoundKey2
    }) {
      return resource_unique_foreign_keyPgResource.get({
        compound_key_1: $compoundKey1,
        compound_key_2: $compoundKey2
      });
    },
    cMyTableByRowId(_$root, {
      $rowId
    }) {
      return resource_c_my_tablePgResource.get({
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
    viewTableByRowId(_$root, {
      $rowId
    }) {
      return resource_view_tablePgResource.get({
        id: $rowId
      });
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
    cNullTestRecordByRowId(_$root, {
      $rowId
    }) {
      return resource_c_null_test_recordPgResource.get({
        id: $rowId
      });
    },
    cLeftArmByRowId(_$root, {
      $rowId
    }) {
      return resource_c_left_armPgResource.get({
        id: $rowId
      });
    },
    cLeftArmByPersonId(_$root, {
      $personId
    }) {
      return resource_c_left_armPgResource.get({
        person_id: $personId
      });
    },
    cIssue756ByRowId(_$root, {
      $rowId
    }) {
      return resource_c_issue756PgResource.get({
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
    cPersonByRowId(_$root, {
      $rowId
    }) {
      return resource_c_personPgResource.get({
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
    cCurrentUserId($root, args, _info) {
      const selectArgs = makeArgs_c_person_computed_out(args);
      return resource_c_current_user_idPgResource.execute(selectArgs);
    },
    cFuncOut($root, args, _info) {
      const selectArgs = makeArgs_c_person_computed_out(args);
      return resource_c_func_outPgResource.execute(selectArgs);
    },
    cFuncOutSetof: {
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
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        after(_, $connection, val) {
          $connection.setAfter(val.getRaw());
        }
      }
    },
    cFuncOutUnnamed($root, args, _info) {
      const selectArgs = makeArgs_c_person_computed_out(args);
      return resource_c_func_out_unnamedPgResource.execute(selectArgs);
    },
    cNoArgsQuery($root, args, _info) {
      const selectArgs = makeArgs_c_person_computed_out(args);
      return resource_c_no_args_queryPgResource.execute(selectArgs);
    },
    queryIntervalSet: {
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
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        after(_, $connection, val) {
          $connection.setAfter(val.getRaw());
        }
      }
    },
    staticBigInteger: {
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
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        after(_, $connection, val) {
          $connection.setAfter(val.getRaw());
        }
      }
    },
    cFuncInOut($root, args, _info) {
      const selectArgs = makeArgs_c_func_in_out(args);
      return resource_c_func_in_outPgResource.execute(selectArgs);
    },
    cFuncReturnsTableOneCol: {
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
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        after(_, $connection, val) {
          $connection.setAfter(val.getRaw());
        }
      }
    },
    cJsonIdentity($root, args, _info) {
      const selectArgs = makeArgs_c_json_identity(args);
      return resource_c_json_identityPgResource.execute(selectArgs);
    },
    cJsonbIdentity($root, args, _info) {
      const selectArgs = makeArgs_c_jsonb_identity(args);
      return resource_c_jsonb_identityPgResource.execute(selectArgs);
    },
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
    cFuncInInout($root, args, _info) {
      const selectArgs = makeArgs_c_func_in_inout(args);
      return resource_c_func_in_inoutPgResource.execute(selectArgs);
    },
    cFuncOutOut($root, args, _info) {
      const selectArgs = makeArgs_c_person_computed_out(args);
      return resource_c_func_out_outPgResource.execute(selectArgs);
    },
    cFuncOutOutSetof: {
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
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        after(_, $connection, val) {
          $connection.setAfter(val.getRaw());
        }
      }
    },
    cFuncOutOutUnnamed($root, args, _info) {
      const selectArgs = makeArgs_c_person_computed_out(args);
      return resource_c_func_out_out_unnamedPgResource.execute(selectArgs);
    },
    cSearchTestSummaries: {
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
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        after(_, $connection, val) {
          $connection.setAfter(val.getRaw());
        }
      }
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
    cFuncOutUnnamedOutOutUnnamed($root, args, _info) {
      const selectArgs = makeArgs_c_person_computed_out(args);
      return resource_c_func_out_unnamed_out_out_unnamedPgResource.execute(selectArgs);
    },
    cIntSetQuery: {
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
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        after(_, $connection, val) {
          $connection.setAfter(val.getRaw());
        }
      }
    },
    cFuncReturnsTableMultiCol: {
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
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        after(_, $connection, val) {
          $connection.setAfter(val.getRaw());
        }
      }
    },
    queryIntervalArray($root, args, _info) {
      const selectArgs = makeArgs_c_person_computed_out(args);
      return resource_query_interval_arrayPgResource.execute(selectArgs);
    },
    queryTextArray($root, args, _info) {
      const selectArgs = makeArgs_c_person_computed_out(args);
      return resource_query_text_arrayPgResource.execute(selectArgs);
    },
    cReturnTableWithoutGrants($root, args, _info) {
      const selectArgs = makeArgs_c_person_computed_out(args);
      return resource_c_return_table_without_grantsPgResource.execute(selectArgs);
    },
    cTypesQuery($root, args, _info) {
      const selectArgs = makeArgs_c_types_query(args);
      return resource_c_types_queryPgResource.execute(selectArgs);
    },
    cCompoundTypeComputedField($root, args, _info) {
      const selectArgs = makeArgs_c_compound_type_computed_field(args);
      return resource_c_compound_type_computed_fieldPgResource.execute(selectArgs);
    },
    cFuncOutOutCompoundType($root, args, _info) {
      const selectArgs = makeArgs_c_func_out_out_compound_type(args);
      return resource_c_func_out_out_compound_typePgResource.execute(selectArgs);
    },
    cQueryOutputTwoRows($root, args, _info) {
      const selectArgs = makeArgs_c_query_output_two_rows(args);
      return resource_c_query_output_two_rowsPgResource.execute(selectArgs);
    },
    cCompoundTypeSetQuery: {
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
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        after(_, $connection, val) {
          $connection.setAfter(val.getRaw());
        }
      }
    },
    bCompoundTypeQuery($root, args, _info) {
      const selectArgs = makeArgs_b_compound_type_query(args);
      return resource_b_compound_type_queryPgResource.execute(selectArgs);
    },
    cTableQuery($root, args, _info) {
      const selectArgs = makeArgs_c_table_query(args);
      return resource_c_table_queryPgResource.execute(selectArgs);
    },
    queryCompoundTypeArray($root, args, _info) {
      const selectArgs = makeArgs_query_compound_type_array(args);
      return resource_query_compound_type_arrayPgResource.execute(selectArgs);
    },
    bCompoundTypeArrayQuery($root, args, _info) {
      const selectArgs = makeArgs_b_compound_type_array_query(args);
      return resource_b_compound_type_array_queryPgResource.execute(selectArgs);
    },
    cFuncOutComplex($root, args, _info) {
      const selectArgs = makeArgs_c_func_out_complex(args);
      return resource_c_func_out_complexPgResource.execute(selectArgs);
    },
    cFuncOutComplexSetof: {
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
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        after(_, $connection, val) {
          $connection.setAfter(val.getRaw());
        }
      }
    },
    cBadlyBehavedFunction: {
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
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        after(_, $connection, val) {
          $connection.setAfter(val.getRaw());
        }
      }
    },
    cFuncOutTable($root, args, _info) {
      const selectArgs = makeArgs_c_person_computed_out(args);
      return resource_c_func_out_tablePgResource.execute(selectArgs);
    },
    cFuncOutTableSetof: {
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
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        after(_, $connection, val) {
          $connection.setAfter(val.getRaw());
        }
      }
    },
    cTableSetQuery: {
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
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        after(_, $connection, val) {
          $connection.setAfter(val.getRaw());
        }
      }
    },
    cTableSetQueryPlpgsql: {
      plan($parent, args, info) {
        const $select = getSelectPlanFromParentAndArgs14($parent, args, info);
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
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        after(_, $connection, val) {
          $connection.setAfter(val.getRaw());
        }
      }
    },
    bTypeFunctionConnection: {
      plan($parent, args, info) {
        const $select = getSelectPlanFromParentAndArgs15($parent, args, info);
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
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        after(_, $connection, val) {
          $connection.setAfter(val.getRaw());
        }
      }
    },
    bTypeFunction($root, args, _info) {
      const selectArgs = makeArgs_b_type_function(args);
      return resource_b_type_functionPgResource.execute(selectArgs);
    },
    bTypeFunctionList($root, args, _info) {
      const selectArgs = makeArgs_c_person_computed_out(args);
      return resource_b_type_function_listPgResource.execute(selectArgs);
    },
    allNonUpdatableViews: {
      plan() {
        return connection(resource_non_updatable_viewPgResource.find());
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
    allInputs: {
      plan() {
        return connection(resource_inputsPgResource.find());
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
    allPatches: {
      plan() {
        return connection(resource_patchsPgResource.find());
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
    allReserveds: {
      plan() {
        return connection(resource_reservedPgResource.find());
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
    allReservedPatchRecords: {
      plan() {
        return connection(resource_reservedPatchsPgResource.find());
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
    allReservedInputRecords: {
      plan() {
        return connection(resource_reserved_inputPgResource.find());
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
    allDefaultValues: {
      plan() {
        return connection(resource_default_valuePgResource.find());
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
    allForeignKeys: {
      plan() {
        return connection(resource_foreign_keyPgResource.find());
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
    allNoPrimaryKeys: {
      plan() {
        return connection(resource_no_primary_keyPgResource.find());
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
    allTestviews: {
      plan() {
        return connection(resource_testviewPgResource.find());
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
    allUniqueForeignKeys: {
      plan() {
        return connection(resource_unique_foreign_keyPgResource.find());
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
    allCMyTables: {
      plan() {
        return connection(resource_c_my_tablePgResource.find());
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
    allCPersonSecrets: {
      plan() {
        return connection(resource_c_person_secretPgResource.find());
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
    allViewTables: {
      plan() {
        return connection(resource_view_tablePgResource.find());
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
    allBUpdatableViews: {
      plan() {
        return connection(resource_b_updatable_viewPgResource.find());
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
    allCCompoundKeys: {
      plan() {
        return connection(resource_c_compound_keyPgResource.find());
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
    allSimilarTable1S: {
      plan() {
        return connection(resource_similar_table_1PgResource.find());
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
    allSimilarTable2S: {
      plan() {
        return connection(resource_similar_table_2PgResource.find());
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
    allCNullTestRecords: {
      plan() {
        return connection(resource_c_null_test_recordPgResource.find());
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
    allCEdgeCases: {
      plan() {
        return connection(resource_c_edge_casePgResource.find());
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
    allCLeftArms: {
      plan() {
        return connection(resource_c_left_armPgResource.find());
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
    allCIssue756S: {
      plan() {
        return connection(resource_c_issue756PgResource.find());
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
    allPosts: {
      plan() {
        return connection(resource_postPgResource.find());
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
    allCPeople: {
      plan() {
        return connection(resource_c_personPgResource.find());
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
    allBLists: {
      plan() {
        return connection(resource_b_listsPgResource.find());
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
    allBTypes: {
      plan() {
        return connection(resource_b_typesPgResource.find());
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
  Input: {
    __assertStep: assertPgClassSingleStep,
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of inputsUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_inputsPgResource.get(spec);
    },
    rowId($record) {
      return $record.get("id");
    }
  },
  Patch: {
    __assertStep: assertPgClassSingleStep,
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of patchsUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_patchsPgResource.get(spec);
    },
    rowId($record) {
      return $record.get("id");
    }
  },
  Reserved: {
    __assertStep: assertPgClassSingleStep,
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of reservedUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_reservedPgResource.get(spec);
    },
    rowId($record) {
      return $record.get("id");
    }
  },
  ReservedPatchRecord: {
    __assertStep: assertPgClassSingleStep,
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of reservedPatchsUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_reservedPatchsPgResource.get(spec);
    },
    rowId($record) {
      return $record.get("id");
    }
  },
  ReservedInputRecord: {
    __assertStep: assertPgClassSingleStep,
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of reserved_inputUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_reserved_inputPgResource.get(spec);
    },
    rowId($record) {
      return $record.get("id");
    }
  },
  DefaultValue: {
    __assertStep: assertPgClassSingleStep,
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of default_valueUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_default_valuePgResource.get(spec);
    },
    rowId($record) {
      return $record.get("id");
    },
    nullValue($record) {
      return $record.get("null_value");
    }
  },
  NoPrimaryKey: {
    __assertStep: assertPgClassSingleStep,
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of no_primary_keyUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_no_primary_keyPgResource.get(spec);
    },
    rowId($record) {
      return $record.get("id");
    }
  },
  UniqueForeignKey: {
    __assertStep: assertPgClassSingleStep,
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of unique_foreign_keyUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_unique_foreign_keyPgResource.get(spec);
    },
    compoundKey1($record) {
      return $record.get("compound_key_1");
    },
    compoundKey2($record) {
      return $record.get("compound_key_2");
    },
    cCompoundKeyByCompoundKey1AndCompoundKey2($record) {
      return resource_c_compound_keyPgResource.get({
        person_id_1: $record.get("compound_key_1"),
        person_id_2: $record.get("compound_key_2")
      });
    }
  },
  CCompoundKey: {
    __assertStep: assertPgClassSingleStep,
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of c_compound_keyUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_c_compound_keyPgResource.get(spec);
    },
    personId2($record) {
      return $record.get("person_id_2");
    },
    personId1($record) {
      return $record.get("person_id_1");
    },
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
    uniqueForeignKeyByCompoundKey1AndCompoundKey2($record) {
      return resource_unique_foreign_keyPgResource.get({
        compound_key_1: $record.get("person_id_1"),
        compound_key_2: $record.get("person_id_2")
      });
    }
  },
  CPerson: {
    __assertStep: assertPgClassSingleStep,
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of c_personUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_c_personPgResource.get(spec);
    },
    computedOut($in, args, _info) {
      const {
        $row,
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_c_person_computed_out(args), true);
      const from = pgFromExpression($row, resource_c_person_computed_outPgResource.from, resource_c_person_computed_outPgResource.parameters, selectArgs);
      return pgClassExpression($row, resource_c_person_computed_outPgResource.codec, undefined)`${from}`;
    },
    firstName($in, args, _info) {
      const {
        $row,
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_c_person_computed_out(args), true);
      const from = pgFromExpression($row, resource_c_person_first_namePgResource.from, resource_c_person_first_namePgResource.parameters, selectArgs);
      return pgClassExpression($row, resource_c_person_first_namePgResource.codec, undefined)`${from}`;
    },
    computedOutOut($in, args, _info) {
      const {
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_c_person_computed_out(args));
      return resource_c_person_computed_out_outPgResource.execute(selectArgs);
    },
    computedInout($in, args, _info) {
      const {
        $row,
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_c_person_computed_inout(args), true);
      const from = pgFromExpression($row, resource_c_person_computed_inoutPgResource.from, resource_c_person_computed_inoutPgResource.parameters, selectArgs);
      return pgClassExpression($row, resource_c_person_computed_inoutPgResource.codec, undefined)`${from}`;
    },
    computedInoutOut($in, args, _info) {
      const {
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_c_person_computed_inout_out(args));
      return resource_c_person_computed_inout_outPgResource.execute(selectArgs);
    },
    exists($in, args, _info) {
      const {
        $row,
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_c_person_exists(args), true);
      const from = pgFromExpression($row, resource_c_person_existsPgResource.from, resource_c_person_existsPgResource.parameters, selectArgs);
      return pgClassExpression($row, resource_c_person_existsPgResource.codec, undefined)`${from}`;
    },
    computedFirstArgInoutOut($in, args, _info) {
      const {
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_c_person_computed_out(args));
      return resource_c_person_computed_first_arg_inout_outPgResource.execute(selectArgs);
    },
    optionalMissingMiddle1($in, args, _info) {
      const {
        $row,
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_c_person_optional_missing_middle_1(args), true);
      const from = pgFromExpression($row, resource_c_person_optional_missing_middle_1PgResource.from, resource_c_person_optional_missing_middle_1PgResource.parameters, selectArgs);
      return pgClassExpression($row, resource_c_person_optional_missing_middle_1PgResource.codec, undefined)`${from}`;
    },
    optionalMissingMiddle2($in, args, _info) {
      const {
        $row,
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_c_person_optional_missing_middle_2(args), true);
      const from = pgFromExpression($row, resource_c_person_optional_missing_middle_2PgResource.from, resource_c_person_optional_missing_middle_2PgResource.parameters, selectArgs);
      return pgClassExpression($row, resource_c_person_optional_missing_middle_2PgResource.codec, undefined)`${from}`;
    },
    optionalMissingMiddle3($in, args, _info) {
      const {
        $row,
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_c_person_optional_missing_middle_3(args), true);
      const from = pgFromExpression($row, resource_c_person_optional_missing_middle_3PgResource.from, resource_c_person_optional_missing_middle_3PgResource.parameters, selectArgs);
      return pgClassExpression($row, resource_c_person_optional_missing_middle_3PgResource.codec, undefined)`${from}`;
    },
    optionalMissingMiddle4($in, args, _info) {
      const {
        $row,
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_c_person_optional_missing_middle_4(args), true);
      const from = pgFromExpression($row, resource_c_person_optional_missing_middle_4PgResource.from, resource_c_person_optional_missing_middle_4PgResource.parameters, selectArgs);
      return pgClassExpression($row, resource_c_person_optional_missing_middle_4PgResource.codec, undefined)`${from}`;
    },
    optionalMissingMiddle5($in, args, _info) {
      const {
        $row,
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_c_person_optional_missing_middle_5(args), true);
      const from = pgFromExpression($row, resource_c_person_optional_missing_middle_5PgResource.from, resource_c_person_optional_missing_middle_5PgResource.parameters, selectArgs);
      return pgClassExpression($row, resource_c_person_optional_missing_middle_5PgResource.codec, undefined)`${from}`;
    },
    computedComplex($in, args, _info) {
      const {
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_c_person_computed_complex(args));
      return resource_c_person_computed_complexPgResource.execute(selectArgs);
    },
    firstPost($in, args, _info) {
      const {
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_c_person_computed_out(args));
      return resource_c_person_first_postPgResource.execute(selectArgs);
    },
    computedFirstArgInout($in, args, _info) {
      const {
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_c_person_computed_out(args));
      return resource_c_person_computed_first_arg_inoutPgResource.execute(selectArgs);
    },
    friends: {
      plan($parent, args, info) {
        const $select = getSelectPlanFromParentAndArgs16($parent, args, info);
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
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        after(_, $connection, val) {
          $connection.setAfter(val.getRaw());
        }
      }
    },
    typeFunctionConnection: {
      plan($parent, args, info) {
        const $select = getSelectPlanFromParentAndArgs17($parent, args, info);
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
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        after(_, $connection, val) {
          $connection.setAfter(val.getRaw());
        }
      }
    },
    typeFunction($in, args, _info) {
      const {
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_c_person_type_function(args));
      return resource_c_person_type_functionPgResource.execute(selectArgs);
    },
    typeFunctionList($in, args, _info) {
      const {
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_c_person_computed_out(args));
      return resource_c_person_type_function_listPgResource.execute(selectArgs);
    },
    rowId($record) {
      return $record.get("id");
    },
    name($record) {
      return $record.get("person_full_name");
    },
    site($record) {
      const $plan = $record.get("site");
      const $select = pgSelectSingleFromRecord(resource_frmcdc_bWrappedUrlPgResource, $plan);
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
    postsByAuthorId: {
      plan($record) {
        const $records = resource_postPgResource.find({
          author_id: $record.get("id")
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
    foreignKeysByPersonId: {
      plan($record) {
        const $records = resource_foreign_keyPgResource.find({
          person_id: $record.get("id")
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
    cPersonSecretByPersonId($record) {
      return resource_c_person_secretPgResource.get({
        person_id: $record.get("id")
      });
    },
    cLeftArmByPersonId($record) {
      return resource_c_left_armPgResource.get({
        person_id: $record.get("id")
      });
    },
    cCompoundKeysByPersonId1: {
      plan($record) {
        const $records = resource_c_compound_keyPgResource.find({
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
    cCompoundKeysByPersonId2: {
      plan($record) {
        const $records = resource_c_compound_keyPgResource.find({
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
    }
  },
  CPersonComputedOutOutRecord: {
    __assertStep: assertPgClassSingleStep
  },
  CPersonComputedInoutOutRecord: {
    __assertStep: assertPgClassSingleStep
  },
  BEmail: {
    serialize: GraphQLString.serialize,
    parseValue: GraphQLString.parseValue,
    parseLiteral: GraphQLString.parseLiteral
  },
  CPersonComputedFirstArgInoutOutRecord: {
    __assertStep: assertPgClassSingleStep,
    person($record) {
      const $plan = $record.get("person");
      const $select = pgSelectSingleFromRecord(resource_c_personPgResource, $plan);
      $select.getClassStep().setTrusted();
      return $select;
    }
  },
  CPersonComputedComplexRecord: {
    __assertStep: assertPgClassSingleStep,
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
  },
  CCompoundType: {
    __assertStep: assertPgClassSingleStep,
    computedField($in, args, _info) {
      const {
        $row,
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_c_person_computed_out(args), true);
      const from = pgFromExpression($row, resource_c_compound_type_computed_fieldPgResource.from, resource_c_compound_type_computed_fieldPgResource.parameters, selectArgs);
      return pgClassExpression($row, resource_c_compound_type_computed_fieldPgResource.codec, undefined)`${from}`;
    },
    query($in, args, _info) {
      const {
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_c_person_computed_out(args));
      return resource_b_compound_type_queryPgResource.execute(selectArgs);
    },
    queryCompoundTypeArray($in, args, _info) {
      const {
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_c_person_computed_out(args));
      return resource_query_compound_type_arrayPgResource.execute(selectArgs);
    },
    arrayQuery($in, args, _info) {
      const {
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_c_person_computed_out(args));
      return resource_b_compound_type_array_queryPgResource.execute(selectArgs);
    },
    fooBar($record) {
      return $record.get("foo_bar");
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
  BEnumCaps: {
    _0_BAR: {
      value: "0_BAR"
    }
  },
  BEnumWithEmptyString: {
    _EMPTY_: {
      value: ""
    }
  },
  Interval: {
    __assertStep: assertExecutableStep
  },
  Post: {
    __assertStep: assertPgClassSingleStep,
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of postUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_postPgResource.get(spec);
    },
    computedIntervalSet: {
      plan($parent, args, info) {
        const $select = getSelectPlanFromParentAndArgs18($parent, args, info);
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
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        after(_, $connection, val) {
          $connection.setAfter(val.getRaw());
        }
      }
    },
    computedIntervalArray($in, args, _info) {
      const {
        $row,
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_c_person_computed_out(args), true);
      const from = pgFromExpression($row, resource_post_computed_interval_arrayPgResource.from, resource_post_computed_interval_arrayPgResource.parameters, selectArgs);
      return pgClassExpression($row, resource_post_computed_interval_arrayPgResource.codec, undefined)`${from}`;
    },
    computedTextArray($in, args, _info) {
      const {
        $row,
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_c_person_computed_out(args), true);
      const from = pgFromExpression($row, resource_post_computed_text_arrayPgResource.from, resource_post_computed_text_arrayPgResource.parameters, selectArgs);
      return pgClassExpression($row, resource_post_computed_text_arrayPgResource.codec, undefined)`${from}`;
    },
    computedWithOptionalArg($in, args, _info) {
      const {
        $row,
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_post_computed_with_optional_arg(args), true);
      const from = pgFromExpression($row, resource_post_computed_with_optional_argPgResource.from, resource_post_computed_with_optional_argPgResource.parameters, selectArgs);
      return pgClassExpression($row, resource_post_computed_with_optional_argPgResource.codec, undefined)`${from}`;
    },
    computedWithRequiredArg($in, args, _info) {
      const {
        $row,
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_post_computed_with_required_arg(args), true);
      const from = pgFromExpression($row, resource_post_computed_with_required_argPgResource.from, resource_post_computed_with_required_argPgResource.parameters, selectArgs);
      return pgClassExpression($row, resource_post_computed_with_required_argPgResource.codec, undefined)`${from}`;
    },
    headlineTrimmed($in, args, _info) {
      const {
        $row,
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_post_headline_trimmed(args), true);
      const from = pgFromExpression($row, resource_post_headline_trimmedPgResource.from, resource_post_headline_trimmedPgResource.parameters, selectArgs);
      return pgClassExpression($row, resource_post_headline_trimmedPgResource.codec, undefined)`${from}`;
    },
    headlineTrimmedNoDefaults($in, args, _info) {
      const {
        $row,
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_post_headline_trimmed_no_defaults(args), true);
      const from = pgFromExpression($row, resource_post_headline_trimmed_no_defaultsPgResource.from, resource_post_headline_trimmed_no_defaultsPgResource.parameters, selectArgs);
      return pgClassExpression($row, resource_post_headline_trimmed_no_defaultsPgResource.codec, undefined)`${from}`;
    },
    headlineTrimmedStrict($in, args, _info) {
      const {
        $row,
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_post_headline_trimmed_strict(args), true);
      const from = pgFromExpression($row, resource_post_headline_trimmed_strictPgResource.from, resource_post_headline_trimmed_strictPgResource.parameters, selectArgs);
      return pgClassExpression($row, resource_post_headline_trimmed_strictPgResource.codec, undefined)`${from}`;
    },
    computedCompoundTypeArray($in, args, _info) {
      const {
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_post_computed_compound_type_array(args));
      return resource_post_computed_compound_type_arrayPgResource.execute(selectArgs);
    },
    rowId($record) {
      return $record.get("id");
    },
    authorId($record) {
      return $record.get("author_id");
    },
    comptypes($record) {
      const $val = $record.get("comptypes");
      const $select = pgSelectFromRecords(resource_frmcdc_comptypePgResource, $val);
      $select.setTrusted();
      return $select;
    },
    cPersonByAuthorId($record) {
      return resource_c_personPgResource.get({
        id: $record.get("author_id")
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
    bTypeByRowId($record) {
      return resource_b_typesPgResource.get({
        id: $record.get("id")
      });
    }
  },
  PostComputedIntervalSetConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  PostComputedIntervalSetEdge: {
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
  CCompoundTypeInput: {
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
  AnEnum: {
    ASTERISK: {
      value: "*"
    },
    ASTERISK__ASTERISK: {
      value: "**"
    },
    ASTERISK__ASTERISK__ASTERISK: {
      value: "***"
    },
    foo_ASTERISK: {
      value: "foo*"
    },
    foo_ASTERISK_: {
      value: "foo*_"
    },
    _foo_ASTERISK: {
      value: "_foo*"
    },
    ASTERISK_bar: {
      value: "*bar"
    },
    ASTERISK_bar_: {
      value: "*bar_"
    },
    _ASTERISK_bar_: {
      value: "_*bar_"
    },
    ASTERISK_baz_ASTERISK: {
      value: "*baz*"
    },
    _ASTERISK_baz_ASTERISK_: {
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
  BTypeConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  BType: {
    __assertStep: assertPgClassSingleStep,
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of b_typesUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_b_typesPgResource.get(spec);
    },
    rowId($record) {
      return $record.get("id");
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
      const $select = pgSelectSingleFromRecord(resource_frmcdc_cCompoundTypePgResource, $plan);
      $select.coalesceToEmptyObject();
      $select.getClassStep().setTrusted();
      return $select;
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
    },
    postBySmallint($record) {
      return resource_postPgResource.get({
        id: $record.get("smallint")
      });
    },
    postByRowId($record) {
      return resource_postPgResource.get({
        id: $record.get("id")
      });
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
  BAnotherInt: {
    serialize: GraphQLInt.serialize,
    parseValue: GraphQLInt.parseValue,
    parseLiteral: GraphQLInt.parseLiteral
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
  BNestedCompoundType: {
    __assertStep: assertPgClassSingleStep,
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
  CidrAddress: {
    serialize: UUIDSerialize,
    parseValue: UUIDSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"CidrAddress" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
    }
  },
  MacAddress: {
    serialize: UUIDSerialize,
    parseValue: UUIDSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"MacAddress" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
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
  BTypeEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  BTypeCondition: {
    rowId($condition, val) {
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
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, bColorCodec)}`;
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
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, bAnotherIntCodec)}`;
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
    money($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "money",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.money)}`;
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
    ltree($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "ltree",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, spec_bTypes_attributes_ltree_codec_ltree)}`;
        }
      });
    }
  },
  BTypeOrderBy: {
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
  CPersonConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  CPersonEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  BWrappedUrl: {
    __assertStep: assertPgClassSingleStep
  },
  BNotNullUrl: {
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
  PostConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  PostEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  PostCondition: {
    rowId($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "id",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    },
    headline($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "headline",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
        }
      });
    },
    body($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "body",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
        }
      });
    },
    authorId($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "author_id",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    }
  },
  PostOrderBy: {
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
    }
  },
  ForeignKeyConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  ForeignKey: {
    __assertStep: assertPgClassSingleStep,
    personId($record) {
      return $record.get("person_id");
    },
    compoundKey1($record) {
      return $record.get("compound_key_1");
    },
    compoundKey2($record) {
      return $record.get("compound_key_2");
    },
    cCompoundKeyByCompoundKey1AndCompoundKey2($record) {
      return resource_c_compound_keyPgResource.get({
        person_id_1: $record.get("compound_key_1"),
        person_id_2: $record.get("compound_key_2")
      });
    },
    cPersonByPersonId($record) {
      return resource_c_personPgResource.get({
        id: $record.get("person_id")
      });
    }
  },
  ForeignKeyEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  ForeignKeyCondition: {
    personId($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "person_id",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    },
    compoundKey1($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "compound_key_1",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    },
    compoundKey2($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "compound_key_2",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    }
  },
  ForeignKeyOrderBy: {
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
    },
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
    }
  },
  CPersonSecret: {
    __assertStep: assertPgClassSingleStep,
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of c_person_secretUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_c_person_secretPgResource.get(spec);
    },
    personId($record) {
      return $record.get("person_id");
    },
    secret($record) {
      return $record.get("sekrit");
    },
    cPersonByPersonId($record) {
      return resource_c_personPgResource.get({
        id: $record.get("person_id")
      });
    }
  },
  CLeftArm: {
    __assertStep: assertPgClassSingleStep,
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of c_left_armUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_c_left_armPgResource.get(spec);
    },
    rowId($record) {
      return $record.get("id");
    },
    personId($record) {
      return $record.get("person_id");
    },
    lengthInMetres($record) {
      return $record.get("length_in_metres");
    },
    cPersonByPersonId($record) {
      return resource_c_personPgResource.get({
        id: $record.get("person_id")
      });
    }
  },
  CCompoundKeyConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  CCompoundKeyEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  CCompoundKeyCondition: {
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
  CCompoundKeyOrderBy: {
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
  CMyTable: {
    __assertStep: assertPgClassSingleStep,
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of c_my_tableUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_c_my_tablePgResource.get(spec);
    },
    rowId($record) {
      return $record.get("id");
    },
    jsonData($record) {
      return $record.get("json_data");
    }
  },
  ViewTable: {
    __assertStep: assertPgClassSingleStep,
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of view_tableUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_view_tablePgResource.get(spec);
    },
    rowId($record) {
      return $record.get("id");
    }
  },
  SimilarTable1: {
    __assertStep: assertPgClassSingleStep,
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of similar_table_1Uniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_similar_table_1PgResource.get(spec);
    },
    rowId($record) {
      return $record.get("id");
    }
  },
  SimilarTable2: {
    __assertStep: assertPgClassSingleStep,
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of similar_table_2Uniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_similar_table_2PgResource.get(spec);
    },
    rowId($record) {
      return $record.get("id");
    }
  },
  CNullTestRecord: {
    __assertStep: assertPgClassSingleStep,
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of c_null_test_recordUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_c_null_test_recordPgResource.get(spec);
    },
    rowId($record) {
      return $record.get("id");
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
  CIssue756: {
    __assertStep: assertPgClassSingleStep,
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of c_issue756Uniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_c_issue756PgResource.get(spec);
    },
    rowId($record) {
      return $record.get("id");
    }
  },
  CNotNullTimestamp: {
    serialize: UUIDSerialize,
    parseValue: UUIDSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"Datetime" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
    }
  },
  BList: {
    __assertStep: assertPgClassSingleStep,
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of b_listsUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_b_listsPgResource.get(spec);
    },
    rowId($record) {
      return $record.get("id");
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
    byteaArray($record) {
      return $record.get("bytea_array");
    },
    byteaArrayNn($record) {
      return $record.get("bytea_array_nn");
    }
  },
  CFuncOutSetofConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  CFuncOutSetofEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  QueryIntervalSetConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  QueryIntervalSetEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  StaticBigIntegerConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  StaticBigIntegerEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  CFuncReturnsTableOneColConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  CFuncReturnsTableOneColEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  CFuncOutOutRecord: {
    __assertStep: assertPgClassSingleStep,
    firstOut($record) {
      return $record.get("first_out");
    },
    secondOut($record) {
      return $record.get("second_out");
    }
  },
  CFuncOutOutSetofConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  CFuncOutOutSetofRecord: {
    __assertStep: assertPgClassSingleStep
  },
  CFuncOutOutSetofEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  CFuncOutOutUnnamedRecord: {
    __assertStep: assertPgClassSingleStep
  },
  CSearchTestSummariesConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  CSearchTestSummariesRecord: {
    __assertStep: assertPgClassSingleStep,
    totalDuration($record) {
      return $record.get("total_duration");
    }
  },
  CSearchTestSummariesEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  CFuncOutUnnamedOutOutUnnamedRecord: {
    __assertStep: assertPgClassSingleStep
  },
  CIntSetQueryConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  CIntSetQueryEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  CFuncReturnsTableMultiColConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  CFuncReturnsTableMultiColRecord: {
    __assertStep: assertPgClassSingleStep
  },
  CFuncReturnsTableMultiColEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  CFuncOutOutCompoundTypeRecord: {
    __assertStep: assertPgClassSingleStep,
    o2($record) {
      const $plan = $record.get("o2");
      const $select = pgSelectSingleFromRecord(resource_frmcdc_cCompoundTypePgResource, $plan);
      $select.getClassStep().setTrusted();
      return $select;
    }
  },
  CQueryOutputTwoRowsRecord: {
    __assertStep: assertPgClassSingleStep,
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
  },
  CCompoundTypeConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  CCompoundTypeEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  CFuncOutComplexRecord: {
    __assertStep: assertPgClassSingleStep,
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
  },
  CFuncOutComplexSetofConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  CFuncOutComplexSetofRecord: {
    __assertStep: assertPgClassSingleStep,
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
  },
  CFuncOutComplexSetofEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  NonUpdatableViewConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  NonUpdatableView: {
    __assertStep: assertPgClassSingleStep,
    column($record) {
      return $record.get("?column?");
    }
  },
  NonUpdatableViewEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  NonUpdatableViewCondition: {
    column($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "?column?",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    }
  },
  NonUpdatableViewOrderBy: {
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
  },
  InputConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  InputEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  InputCondition: {
    rowId($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "id",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    }
  },
  InputOrderBy: {
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
  },
  PatchConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  PatchEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  PatchCondition: {
    rowId($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "id",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    }
  },
  PatchOrderBy: {
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
  },
  ReservedConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  ReservedEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  ReservedCondition: {
    rowId($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "id",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    }
  },
  ReservedOrderBy: {
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
  },
  ReservedPatchRecordConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  ReservedPatchRecordEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  ReservedPatchRecordCondition: {
    rowId($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "id",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    }
  },
  ReservedPatchRecordOrderBy: {
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
  },
  ReservedInputRecordConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  ReservedInputRecordEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  ReservedInputRecordCondition: {
    rowId($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "id",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    }
  },
  ReservedInputRecordOrderBy: {
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
  },
  DefaultValueConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  DefaultValueEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  DefaultValueCondition: {
    rowId($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "id",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    },
    nullValue($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "null_value",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
        }
      });
    }
  },
  DefaultValueOrderBy: {
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
    },
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
    }
  },
  NoPrimaryKeyConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  NoPrimaryKeyEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  NoPrimaryKeyCondition: {
    rowId($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "id",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    },
    str($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "str",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
        }
      });
    }
  },
  NoPrimaryKeyOrderBy: {
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
  },
  TestviewConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  Testview: {
    __assertStep: assertPgClassSingleStep
  },
  TestviewEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  TestviewCondition: {
    testviewid($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "testviewid",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    },
    col1($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "col1",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    },
    col2($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "col2",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    }
  },
  TestviewOrderBy: {
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
    },
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
    }
  },
  UniqueForeignKeyConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  UniqueForeignKeyEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  UniqueForeignKeyCondition: {
    compoundKey1($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "compound_key_1",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    },
    compoundKey2($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "compound_key_2",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    }
  },
  UniqueForeignKeyOrderBy: {
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
  },
  CMyTableConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  CMyTableEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  CMyTableCondition: {
    rowId($condition, val) {
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
  CMyTableOrderBy: {
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
  CPersonSecretConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  CPersonSecretEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  CPersonSecretCondition: {
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
  CPersonSecretOrderBy: {
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
  ViewTableConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  ViewTableEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  ViewTableCondition: {
    rowId($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "id",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    },
    col1($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "col1",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    },
    col2($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "col2",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    }
  },
  ViewTableOrderBy: {
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
    },
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
    }
  },
  BUpdatableViewConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  BUpdatableView: {
    __assertStep: assertPgClassSingleStep
  },
  BUpdatableViewEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  BUpdatableViewCondition: {
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
  BUpdatableViewOrderBy: {
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
  SimilarTable1Connection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  SimilarTable1Edge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  SimilarTable1Condition: {
    rowId($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "id",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    },
    col1($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "col1",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    },
    col2($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "col2",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    },
    col3($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "col3",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    }
  },
  SimilarTable1OrderBy: {
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
    },
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
    }
  },
  SimilarTable2Connection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  SimilarTable2Edge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  SimilarTable2Condition: {
    rowId($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "id",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    },
    col3($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "col3",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    },
    col4($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "col4",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    },
    col5($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "col5",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    }
  },
  SimilarTable2OrderBy: {
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
    }
  },
  CNullTestRecordConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  CNullTestRecordEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  CNullTestRecordCondition: {
    rowId($condition, val) {
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
  CNullTestRecordOrderBy: {
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
  CEdgeCaseConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  CEdgeCase: {
    __assertStep: assertPgClassSingleStep,
    computed($in, args, _info) {
      const {
        $row,
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_c_person_computed_out(args), true);
      const from = pgFromExpression($row, resource_c_edge_case_computedPgResource.from, resource_c_edge_case_computedPgResource.parameters, selectArgs);
      return pgClassExpression($row, resource_c_edge_case_computedPgResource.codec, undefined)`${from}`;
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
  CEdgeCaseEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  CEdgeCaseCondition: {
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
  CEdgeCaseOrderBy: {
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
  CLeftArmConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  CLeftArmEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  CLeftArmCondition: {
    rowId($condition, val) {
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
  CLeftArmOrderBy: {
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
  CIssue756Connection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  CIssue756Edge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  CIssue756Condition: {
    rowId($condition, val) {
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
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, cNotNullTimestampCodec)}`;
        }
      });
    }
  },
  CIssue756OrderBy: {
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
  },
  CPersonCondition: {
    rowId($condition, val) {
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
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, bEmailCodec)}`;
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
    }
  },
  CPersonOrderBy: {
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
  BListConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  BListEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  BListCondition: {
    rowId($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "id",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    }
  },
  BListOrderBy: {
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
  },
  Mutation: {
    __assertStep: __ValueStep,
    cMutationOut: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_c_person_computed_out(args, ["input"]);
        const $result = resource_c_mutation_outPgResource.execute(selectArgs, "mutation");
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
    cMutationOutSetof: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_c_person_computed_out(args, ["input"]);
        const $result = resource_c_mutation_out_setofPgResource.execute(selectArgs, "mutation");
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
    cMutationOutUnnamed: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_c_person_computed_out(args, ["input"]);
        const $result = resource_c_mutation_out_unnamedPgResource.execute(selectArgs, "mutation");
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
    cNoArgsMutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_c_person_computed_out(args, ["input"]);
        const $result = resource_c_no_args_mutationPgResource.execute(selectArgs, "mutation");
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
    returnVoidMutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_c_person_computed_out(args, ["input"]);
        const $result = resource_return_void_mutationPgResource.execute(selectArgs, "mutation");
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
    mutationIntervalSet: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_c_person_computed_out(args, ["input"]);
        const $result = resource_mutation_interval_setPgResource.execute(selectArgs, "mutation");
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
    cMutationInOut: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_c_mutation_in_out(args, ["input"]);
        const $result = resource_c_mutation_in_outPgResource.execute(selectArgs, "mutation");
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
    cMutationReturnsTableOneCol: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_c_mutation_returns_table_one_col(args, ["input"]);
        const $result = resource_c_mutation_returns_table_one_colPgResource.execute(selectArgs, "mutation");
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
    cJsonIdentityMutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_c_json_identity_mutation(args, ["input"]);
        const $result = resource_c_json_identity_mutationPgResource.execute(selectArgs, "mutation");
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
    cJsonbIdentityMutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_c_jsonb_identity_mutation(args, ["input"]);
        const $result = resource_c_jsonb_identity_mutationPgResource.execute(selectArgs, "mutation");
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
    cJsonbIdentityMutationPlpgsql: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_c_jsonb_identity_mutation_plpgsql(args, ["input"]);
        const $result = resource_c_jsonb_identity_mutation_plpgsqlPgResource.execute(selectArgs, "mutation");
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
    cJsonbIdentityMutationPlpgsqlWithDefault: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_c_jsonb_identity_mutation_plpgsql_with_default(args, ["input"]);
        const $result = resource_c_jsonb_identity_mutation_plpgsql_with_defaultPgResource.execute(selectArgs, "mutation");
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
    add1Mutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_add_1_mutation(args, ["input"]);
        const $result = resource_add_1_mutationPgResource.execute(selectArgs, "mutation");
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
    add2Mutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_add_2_mutation(args, ["input"]);
        const $result = resource_add_2_mutationPgResource.execute(selectArgs, "mutation");
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
    add3Mutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_add_3_mutation(args, ["input"]);
        const $result = resource_add_3_mutationPgResource.execute(selectArgs, "mutation");
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
    add4Mutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_add_4_mutation(args, ["input"]);
        const $result = resource_add_4_mutationPgResource.execute(selectArgs, "mutation");
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
    add4MutationError: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_add_4_mutation_error(args, ["input"]);
        const $result = resource_add_4_mutation_errorPgResource.execute(selectArgs, "mutation");
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
    bMult1: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_b_mult_1(args, ["input"]);
        const $result = resource_b_mult_1PgResource.execute(selectArgs, "mutation");
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
    bMult2: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_b_mult_2(args, ["input"]);
        const $result = resource_b_mult_2PgResource.execute(selectArgs, "mutation");
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
    bMult3: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_b_mult_3(args, ["input"]);
        const $result = resource_b_mult_3PgResource.execute(selectArgs, "mutation");
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
    bMult4: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_b_mult_4(args, ["input"]);
        const $result = resource_b_mult_4PgResource.execute(selectArgs, "mutation");
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
    cMutationInInout: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_c_mutation_in_inout(args, ["input"]);
        const $result = resource_c_mutation_in_inoutPgResource.execute(selectArgs, "mutation");
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
    cMutationOutOut: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_c_person_computed_out(args, ["input"]);
        const $result = resource_c_mutation_out_outPgResource.execute(selectArgs, "mutation");
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
    cMutationOutOutSetof: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_c_person_computed_out(args, ["input"]);
        const $result = resource_c_mutation_out_out_setofPgResource.execute(selectArgs, "mutation");
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
    cMutationOutOutUnnamed: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_c_person_computed_out(args, ["input"]);
        const $result = resource_c_mutation_out_out_unnamedPgResource.execute(selectArgs, "mutation");
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
    cIntSetMutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_c_int_set_mutation(args, ["input"]);
        const $result = resource_c_int_set_mutationPgResource.execute(selectArgs, "mutation");
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
    cMutationOutUnnamedOutOutUnnamed: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_c_person_computed_out(args, ["input"]);
        const $result = resource_c_mutation_out_unnamed_out_out_unnamedPgResource.execute(selectArgs, "mutation");
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
    cMutationReturnsTableMultiCol: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_c_mutation_returns_table_multi_col(args, ["input"]);
        const $result = resource_c_mutation_returns_table_multi_colPgResource.execute(selectArgs, "mutation");
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
    bGuidFn: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_b_guid_fn(args, ["input"]);
        const $result = resource_b_guid_fnPgResource.execute(selectArgs, "mutation");
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
    mutationIntervalArray: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_c_person_computed_out(args, ["input"]);
        const $result = resource_mutation_interval_arrayPgResource.execute(selectArgs, "mutation");
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
    mutationTextArray: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_c_person_computed_out(args, ["input"]);
        const $result = resource_mutation_text_arrayPgResource.execute(selectArgs, "mutation");
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
    bListBdeMutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_b_list_bde_mutation(args, ["input"]);
        const $result = resource_b_list_bde_mutationPgResource.execute(selectArgs, "mutation");
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
    bAuthenticateFail: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_c_person_computed_out(args, ["input"]);
        const $result = resource_b_authenticate_failPgResource.execute(selectArgs, "mutation");
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
    bAuthenticate: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_b_authenticate(args, ["input"]);
        const $result = resource_b_authenticatePgResource.execute(selectArgs, "mutation");
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
    cLeftArmIdentity: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_c_left_arm_identity(args, ["input"]);
        const $result = resource_c_left_arm_identityPgResource.execute(selectArgs, "mutation");
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
    cIssue756Mutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_c_person_computed_out(args, ["input"]);
        const $result = resource_c_issue756_mutationPgResource.execute(selectArgs, "mutation");
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
    cIssue756SetMutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_c_person_computed_out(args, ["input"]);
        const $result = resource_c_issue756_set_mutationPgResource.execute(selectArgs, "mutation");
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
    bAuthenticateMany: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_b_authenticate_many(args, ["input"]);
        const $result = resource_b_authenticate_manyPgResource.execute(selectArgs, "mutation");
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
    bAuthenticatePayload: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_b_authenticate_payload(args, ["input"]);
        const $result = resource_b_authenticate_payloadPgResource.execute(selectArgs, "mutation");
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
    cTypesMutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_c_types_mutation(args, ["input"]);
        const $result = resource_c_types_mutationPgResource.execute(selectArgs, "mutation");
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
    cMutationOutOutCompoundType: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_c_mutation_out_out_compound_type(args, ["input"]);
        const $result = resource_c_mutation_out_out_compound_typePgResource.execute(selectArgs, "mutation");
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
    bCompoundTypeMutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_b_compound_type_mutation(args, ["input"]);
        const $result = resource_b_compound_type_mutationPgResource.execute(selectArgs, "mutation");
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
    bCompoundTypeSetMutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_b_compound_type_set_mutation(args, ["input"]);
        const $result = resource_b_compound_type_set_mutationPgResource.execute(selectArgs, "mutation");
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
    cListOfCompoundTypesMutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_c_list_of_compound_types_mutation(args, ["input"]);
        const $result = resource_c_list_of_compound_types_mutationPgResource.execute(selectArgs, "mutation");
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
    cTableMutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_c_table_mutation(args, ["input"]);
        const $result = resource_c_table_mutationPgResource.execute(selectArgs, "mutation");
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
    postWithSuffix: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_post_with_suffix(args, ["input"]);
        const $result = resource_post_with_suffixPgResource.execute(selectArgs, "mutation");
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
    mutationCompoundTypeArray: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_mutation_compound_type_array(args, ["input"]);
        const $result = resource_mutation_compound_type_arrayPgResource.execute(selectArgs, "mutation");
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
    bCompoundTypeArrayMutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_b_compound_type_array_mutation(args, ["input"]);
        const $result = resource_b_compound_type_array_mutationPgResource.execute(selectArgs, "mutation");
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
    postMany: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_post_many(args, ["input"]);
        const $result = resource_post_manyPgResource.execute(selectArgs, "mutation");
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
    cMutationOutComplex: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_c_mutation_out_complex(args, ["input"]);
        const $result = resource_c_mutation_out_complexPgResource.execute(selectArgs, "mutation");
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
    cMutationOutComplexSetof: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_c_mutation_out_complex_setof(args, ["input"]);
        const $result = resource_c_mutation_out_complex_setofPgResource.execute(selectArgs, "mutation");
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
    cMutationOutTable: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_c_person_computed_out(args, ["input"]);
        const $result = resource_c_mutation_out_tablePgResource.execute(selectArgs, "mutation");
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
    cMutationOutTableSetof: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_c_person_computed_out(args, ["input"]);
        const $result = resource_c_mutation_out_table_setofPgResource.execute(selectArgs, "mutation");
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
    cTableSetMutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_c_person_computed_out(args, ["input"]);
        const $result = resource_c_table_set_mutationPgResource.execute(selectArgs, "mutation");
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
    bTypeFunctionConnectionMutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_c_person_computed_out(args, ["input"]);
        const $result = resource_b_type_function_connection_mutationPgResource.execute(selectArgs, "mutation");
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
    bTypeFunctionMutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_b_type_function_mutation(args, ["input"]);
        const $result = resource_b_type_function_mutationPgResource.execute(selectArgs, "mutation");
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
    bTypeFunctionListMutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_c_person_computed_out(args, ["input"]);
        const $result = resource_b_type_function_list_mutationPgResource.execute(selectArgs, "mutation");
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
    createInput: {
      plan(_, args) {
        const $insert = pgInsertSingle(resource_inputsPgResource, Object.create(null));
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
    createPatch: {
      plan(_, args) {
        const $insert = pgInsertSingle(resource_patchsPgResource, Object.create(null));
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
    createReserved: {
      plan(_, args) {
        const $insert = pgInsertSingle(resource_reservedPgResource, Object.create(null));
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
    createReservedPatchRecord: {
      plan(_, args) {
        const $insert = pgInsertSingle(resource_reservedPatchsPgResource, Object.create(null));
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
    createReservedInputRecord: {
      plan(_, args) {
        const $insert = pgInsertSingle(resource_reserved_inputPgResource, Object.create(null));
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
    createDefaultValue: {
      plan(_, args) {
        const $insert = pgInsertSingle(resource_default_valuePgResource, Object.create(null));
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
    createForeignKey: {
      plan(_, args) {
        const $insert = pgInsertSingle(resource_foreign_keyPgResource, Object.create(null));
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
    createNoPrimaryKey: {
      plan(_, args) {
        const $insert = pgInsertSingle(resource_no_primary_keyPgResource, Object.create(null));
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
    createTestview: {
      plan(_, args) {
        const $insert = pgInsertSingle(resource_testviewPgResource, Object.create(null));
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
    createUniqueForeignKey: {
      plan(_, args) {
        const $insert = pgInsertSingle(resource_unique_foreign_keyPgResource, Object.create(null));
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
    createCMyTable: {
      plan(_, args) {
        const $insert = pgInsertSingle(resource_c_my_tablePgResource, Object.create(null));
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
    createCPersonSecret: {
      plan(_, args) {
        const $insert = pgInsertSingle(resource_c_person_secretPgResource, Object.create(null));
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
    createViewTable: {
      plan(_, args) {
        const $insert = pgInsertSingle(resource_view_tablePgResource, Object.create(null));
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
    createBUpdatableView: {
      plan(_, args) {
        const $insert = pgInsertSingle(resource_b_updatable_viewPgResource, Object.create(null));
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
    createCCompoundKey: {
      plan(_, args) {
        const $insert = pgInsertSingle(resource_c_compound_keyPgResource, Object.create(null));
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
    createSimilarTable1: {
      plan(_, args) {
        const $insert = pgInsertSingle(resource_similar_table_1PgResource, Object.create(null));
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
    createSimilarTable2: {
      plan(_, args) {
        const $insert = pgInsertSingle(resource_similar_table_2PgResource, Object.create(null));
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
    createCNullTestRecord: {
      plan(_, args) {
        const $insert = pgInsertSingle(resource_c_null_test_recordPgResource, Object.create(null));
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
    createCEdgeCase: {
      plan(_, args) {
        const $insert = pgInsertSingle(resource_c_edge_casePgResource, Object.create(null));
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
    createCLeftArm: {
      plan(_, args) {
        const $insert = pgInsertSingle(resource_c_left_armPgResource, Object.create(null));
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
    createCIssue756: {
      plan(_, args) {
        const $insert = pgInsertSingle(resource_c_issue756PgResource, Object.create(null));
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
    createPost: {
      plan(_, args) {
        const $insert = pgInsertSingle(resource_postPgResource, Object.create(null));
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
    createCPerson: {
      plan(_, args) {
        const $insert = pgInsertSingle(resource_c_personPgResource, Object.create(null));
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
    createBList: {
      plan(_, args) {
        const $insert = pgInsertSingle(resource_b_listsPgResource, Object.create(null));
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
    createBType: {
      plan(_, args) {
        const $insert = pgInsertSingle(resource_b_typesPgResource, Object.create(null));
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
      }
    }
  },
  CMutationOutPayload: {
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
  CMutationOutInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  CMutationOutSetofPayload: {
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
  CMutationOutSetofInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  CMutationOutUnnamedPayload: {
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
  CMutationOutUnnamedInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  CNoArgsMutationPayload: {
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
  CNoArgsMutationInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  ReturnVoidMutationPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      const $result = $object.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    query() {
      return rootValue();
    }
  },
  ReturnVoidMutationInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  MutationIntervalSetPayload: {
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
  MutationIntervalSetInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  CMutationInOutPayload: {
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
  CMutationInOutInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  CMutationReturnsTableOneColPayload: {
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
  CMutationReturnsTableOneColInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  CJsonIdentityMutationPayload: {
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
  CJsonIdentityMutationInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  CJsonbIdentityMutationPayload: {
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
  CJsonbIdentityMutationInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  CJsonbIdentityMutationPlpgsqlPayload: {
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
  CJsonbIdentityMutationPlpgsqlInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  CJsonbIdentityMutationPlpgsqlWithDefaultPayload: {
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
  CJsonbIdentityMutationPlpgsqlWithDefaultInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  Add1MutationPayload: {
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
  Add1MutationInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  Add2MutationPayload: {
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
  Add2MutationInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  Add3MutationPayload: {
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
  Add3MutationInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  Add4MutationPayload: {
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
  Add4MutationInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  Add4MutationErrorPayload: {
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
  Add4MutationErrorInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  BMult1Payload: {
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
  BMult1Input: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  BMult2Payload: {
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
  BMult2Input: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  BMult3Payload: {
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
  BMult3Input: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  BMult4Payload: {
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
  BMult4Input: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  CMutationInInoutPayload: {
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
  CMutationInInoutInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  CMutationOutOutPayload: {
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
  CMutationOutOutRecord: {
    __assertStep: assertPgClassSingleStep,
    firstOut($record) {
      return $record.get("first_out");
    },
    secondOut($record) {
      return $record.get("second_out");
    }
  },
  CMutationOutOutInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  CMutationOutOutSetofPayload: {
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
  CMutationOutOutSetofRecord: {
    __assertStep: assertPgClassSingleStep
  },
  CMutationOutOutSetofInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  CMutationOutOutUnnamedPayload: {
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
  CMutationOutOutUnnamedRecord: {
    __assertStep: assertPgClassSingleStep
  },
  CMutationOutOutUnnamedInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  CIntSetMutationPayload: {
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
  CIntSetMutationInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  CMutationOutUnnamedOutOutUnnamedPayload: {
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
  CMutationOutUnnamedOutOutUnnamedRecord: {
    __assertStep: assertPgClassSingleStep
  },
  CMutationOutUnnamedOutOutUnnamedInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  CMutationReturnsTableMultiColPayload: {
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
  CMutationReturnsTableMultiColRecord: {
    __assertStep: assertPgClassSingleStep
  },
  CMutationReturnsTableMultiColInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  BGuidFnPayload: {
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
  BGuid: {
    serialize: GraphQLString.serialize,
    parseValue: GraphQLString.parseValue,
    parseLiteral: GraphQLString.parseLiteral
  },
  BGuidFnInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  MutationIntervalArrayPayload: {
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
  MutationIntervalArrayInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  MutationTextArrayPayload: {
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
  MutationTextArrayInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  BListBdeMutationPayload: {
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
  BListBdeMutationInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  BAuthenticateFailPayload: {
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
  BJwtToken: {
    __assertStep: assertPgClassSingleStep
  },
  BAuthenticateFailInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  BAuthenticatePayload: {
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
  BAuthenticateInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  CLeftArmIdentityPayload: {
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
    cLeftArmEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = c_left_armUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_c_left_armPgResource.find(spec);
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
  CLeftArmIdentityInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  CLeftArmBaseInput: {
    __baked: createObjectAndApplyChildren,
    rowId(obj, val, {
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
  CIssue756MutationPayload: {
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
    },
    cIssue756Edge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = c_issue756Uniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_c_issue756PgResource.find(spec);
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
  CIssue756MutationInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  CIssue756SetMutationPayload: {
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
  CIssue756SetMutationInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  BAuthenticateManyPayload: {
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
  BAuthenticateManyInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  BAuthenticatePayloadPayload: {
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
  BAuthPayload: {
    __assertStep: assertPgClassSingleStep,
    jwt($record) {
      const $plan = $record.get("jwt");
      const $select = pgSelectSingleFromRecord(resource_frmcdc_bJwtTokenPgResource, $plan);
      $select.getClassStep().setTrusted();
      return $select;
    },
    rowId($record) {
      return $record.get("id");
    },
    cPersonByRowId($record) {
      return resource_c_personPgResource.get({
        id: $record.get("id")
      });
    }
  },
  BAuthenticatePayloadInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  CTypesMutationPayload: {
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
  CTypesMutationInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  CMutationOutOutCompoundTypePayload: {
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
  CMutationOutOutCompoundTypeRecord: {
    __assertStep: assertPgClassSingleStep,
    o2($record) {
      const $plan = $record.get("o2");
      const $select = pgSelectSingleFromRecord(resource_frmcdc_cCompoundTypePgResource, $plan);
      $select.getClassStep().setTrusted();
      return $select;
    }
  },
  CMutationOutOutCompoundTypeInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  BCompoundTypeMutationPayload: {
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
  BCompoundTypeMutationInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  BCompoundTypeSetMutationPayload: {
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
  BCompoundTypeSetMutationInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  CListOfCompoundTypesMutationPayload: {
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
  CListOfCompoundTypesMutationInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  CTableMutationPayload: {
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
    },
    postEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = postUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_postPgResource.find(spec);
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
  CTableMutationInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  PostWithSuffixPayload: {
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
    },
    postEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = postUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_postPgResource.find(spec);
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
  PostWithSuffixInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  PostInput: {
    __baked: createObjectAndApplyChildren,
    rowId(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    headline(obj, val, {
      field,
      schema
    }) {
      obj.set("headline", bakedInputRuntime(schema, field.type, val));
    },
    body(obj, val, {
      field,
      schema
    }) {
      obj.set("body", bakedInputRuntime(schema, field.type, val));
    },
    authorId(obj, val, {
      field,
      schema
    }) {
      obj.set("author_id", bakedInputRuntime(schema, field.type, val));
    },
    enums(obj, val, {
      field,
      schema
    }) {
      obj.set("enums", bakedInputRuntime(schema, field.type, val));
    },
    comptypes(obj, val, {
      field,
      schema
    }) {
      obj.set("comptypes", bakedInputRuntime(schema, field.type, val));
    }
  },
  ComptypeInput: {
    __baked: createObjectAndApplyChildren,
    schedule(obj, val, {
      field,
      schema
    }) {
      obj.set("schedule", bakedInputRuntime(schema, field.type, val));
    },
    isOptimised(obj, val, {
      field,
      schema
    }) {
      obj.set("is_optimised", bakedInputRuntime(schema, field.type, val));
    }
  },
  MutationCompoundTypeArrayPayload: {
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
  MutationCompoundTypeArrayInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  BCompoundTypeArrayMutationPayload: {
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
  BCompoundTypeArrayMutationInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  PostManyPayload: {
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
  PostManyInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  CMutationOutComplexPayload: {
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
  CMutationOutComplexRecord: {
    __assertStep: assertPgClassSingleStep,
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
  },
  CMutationOutComplexInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  CMutationOutComplexSetofPayload: {
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
  CMutationOutComplexSetofRecord: {
    __assertStep: assertPgClassSingleStep,
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
  },
  CMutationOutComplexSetofInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  CMutationOutTablePayload: {
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
    },
    cPersonEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = c_personUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_c_personPgResource.find(spec);
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
  CMutationOutTableInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  CMutationOutTableSetofPayload: {
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
  CMutationOutTableSetofInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  CTableSetMutationPayload: {
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
  CTableSetMutationInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  BTypeFunctionConnectionMutationPayload: {
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
  BTypeFunctionConnectionMutationInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  BTypeFunctionMutationPayload: {
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
    },
    bTypeEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = b_typesUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_b_typesPgResource.find(spec);
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
  BTypeFunctionMutationInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  BTypeFunctionListMutationPayload: {
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
  BTypeFunctionListMutationInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  CreateInputPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    input($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    inputEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = inputsUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_inputsPgResource.find(spec);
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
  CreateInputInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    input(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  InputInput: {
    __baked: createObjectAndApplyChildren,
    rowId(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    }
  },
  CreatePatchPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    patch($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    patchEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = patchsUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_patchsPgResource.find(spec);
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
  CreatePatchInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    patch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  PatchInput: {
    __baked: createObjectAndApplyChildren,
    rowId(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    }
  },
  CreateReservedPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    reserved($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    reservedEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = reservedUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_reservedPgResource.find(spec);
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
  CreateReservedInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    reserved(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  ReservedInput: {
    __baked: createObjectAndApplyChildren,
    rowId(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    }
  },
  CreateReservedPatchRecordPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    reservedPatchRecord($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    reservedPatchRecordEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = reservedPatchsUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_reservedPatchsPgResource.find(spec);
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
  CreateReservedPatchRecordInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    reservedPatchRecord(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  ReservedPatchRecordInput: {
    __baked: createObjectAndApplyChildren,
    rowId(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    }
  },
  CreateReservedInputRecordPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    reservedInputRecord($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    reservedInputRecordEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = reserved_inputUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_reserved_inputPgResource.find(spec);
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
  CreateReservedInputRecordInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    reservedInputRecord(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  ReservedInputRecordInput: {
    __baked: createObjectAndApplyChildren,
    rowId(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    }
  },
  CreateDefaultValuePayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    defaultValue($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    defaultValueEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = default_valueUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_default_valuePgResource.find(spec);
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
  CreateDefaultValueInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    defaultValue(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  DefaultValueInput: {
    __baked: createObjectAndApplyChildren,
    rowId(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    nullValue(obj, val, {
      field,
      schema
    }) {
      obj.set("null_value", bakedInputRuntime(schema, field.type, val));
    }
  },
  CreateForeignKeyPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    foreignKey($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  CreateForeignKeyInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    foreignKey(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  ForeignKeyInput: {
    __baked: createObjectAndApplyChildren,
    personId(obj, val, {
      field,
      schema
    }) {
      obj.set("person_id", bakedInputRuntime(schema, field.type, val));
    },
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
  },
  CreateNoPrimaryKeyPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    noPrimaryKey($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  CreateNoPrimaryKeyInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    noPrimaryKey(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  NoPrimaryKeyInput: {
    __baked: createObjectAndApplyChildren,
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
  },
  CreateTestviewPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    testview($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  CreateTestviewInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    testview(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  TestviewInput: {
    __baked: createObjectAndApplyChildren,
    testviewid(obj, val, {
      field,
      schema
    }) {
      obj.set("testviewid", bakedInputRuntime(schema, field.type, val));
    },
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
    }
  },
  CreateUniqueForeignKeyPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    uniqueForeignKey($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  CreateUniqueForeignKeyInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    uniqueForeignKey(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UniqueForeignKeyInput: {
    __baked: createObjectAndApplyChildren,
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
  },
  CreateCMyTablePayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    cMyTable($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    cMyTableEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = c_my_tableUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_c_my_tablePgResource.find(spec);
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
  CreateCMyTableInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    cMyTable(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  CMyTableInput: {
    __baked: createObjectAndApplyChildren,
    rowId(obj, val, {
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
  CreateCPersonSecretPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    cPersonSecret($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    cPersonSecretEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = c_person_secretUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_c_person_secretPgResource.find(spec);
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
  CreateCPersonSecretInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    cPersonSecret(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  CPersonSecretInput: {
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
  CreateViewTablePayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    viewTable($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    viewTableEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = view_tableUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_view_tablePgResource.find(spec);
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
  CreateViewTableInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    viewTable(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  ViewTableInput: {
    __baked: createObjectAndApplyChildren,
    rowId(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
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
    }
  },
  CreateBUpdatableViewPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    bUpdatableView($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  CreateBUpdatableViewInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    bUpdatableView(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  BUpdatableViewInput: {
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
  CreateCCompoundKeyPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    cCompoundKey($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    cCompoundKeyEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = c_compound_keyUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_c_compound_keyPgResource.find(spec);
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
  CreateCCompoundKeyInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    cCompoundKey(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  CCompoundKeyInput: {
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
  CreateSimilarTable1Payload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    similarTable1($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    similarTable1Edge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = similar_table_1Uniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_similar_table_1PgResource.find(spec);
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
  CreateSimilarTable1Input: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    similarTable1(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  SimilarTable1Input: {
    __baked: createObjectAndApplyChildren,
    rowId(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
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
    }
  },
  CreateSimilarTable2Payload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    similarTable2($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    similarTable2Edge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = similar_table_2Uniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_similar_table_2PgResource.find(spec);
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
  CreateSimilarTable2Input: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    similarTable2(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  SimilarTable2Input: {
    __baked: createObjectAndApplyChildren,
    rowId(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
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
    }
  },
  CreateCNullTestRecordPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    cNullTestRecord($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    cNullTestRecordEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = c_null_test_recordUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_c_null_test_recordPgResource.find(spec);
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
  CreateCNullTestRecordInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    cNullTestRecord(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  CNullTestRecordInput: {
    __baked: createObjectAndApplyChildren,
    rowId(obj, val, {
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
  CreateCEdgeCasePayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    cEdgeCase($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  CreateCEdgeCaseInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    cEdgeCase(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  CEdgeCaseInput: {
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
  CreateCLeftArmPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    cLeftArm($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    cLeftArmEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = c_left_armUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_c_left_armPgResource.find(spec);
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
  CreateCLeftArmInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    cLeftArm(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  CLeftArmInput: {
    __baked: createObjectAndApplyChildren,
    rowId(obj, val, {
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
  CreateCIssue756Payload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    cIssue756($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    cIssue756Edge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = c_issue756Uniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_c_issue756PgResource.find(spec);
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
  CreateCIssue756Input: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    cIssue756(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  CIssue756Input: {
    __baked: createObjectAndApplyChildren,
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
  },
  CreatePostPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    post($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    postEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = postUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_postPgResource.find(spec);
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
  CreatePostInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    post(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  CreateCPersonPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    cPerson($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    cPersonEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = c_personUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_c_personPgResource.find(spec);
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
  CreateCPersonInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    cPerson(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  CPersonInput: {
    __baked: createObjectAndApplyChildren,
    rowId(obj, val, {
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
  BWrappedUrlInput: {
    __baked: createObjectAndApplyChildren,
    url(obj, val, {
      field,
      schema
    }) {
      obj.set("url", bakedInputRuntime(schema, field.type, val));
    }
  },
  CreateBListPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    bList($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    bListEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = b_listsUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_b_listsPgResource.find(spec);
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
  CreateBListInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    bList(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  BListInput: {
    __baked: createObjectAndApplyChildren,
    rowId(obj, val, {
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
  CreateBTypePayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    bType($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    bTypeEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = b_typesUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_b_typesPgResource.find(spec);
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
  CreateBTypeInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    bType(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  BTypeInput: {
    __baked: createObjectAndApplyChildren,
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
  BNestedCompoundTypeInput: {
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
  UpdateInputPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    input($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    inputEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = inputsUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_inputsPgResource.find(spec);
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
  UpdateInputByRowIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    inputPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  InputPatch: {
    __baked: createObjectAndApplyChildren,
    rowId(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    }
  },
  UpdatePatchPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    patch($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    patchEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = patchsUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_patchsPgResource.find(spec);
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
  UpdatePatchByRowIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    patchPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  PatchPatch: {
    __baked: createObjectAndApplyChildren,
    rowId(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    }
  },
  UpdateReservedPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    reserved($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    reservedEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = reservedUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_reservedPgResource.find(spec);
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
  UpdateReservedByRowIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    reservedPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  ReservedPatch: {
    __baked: createObjectAndApplyChildren,
    rowId(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    }
  },
  UpdateReservedPatchRecordPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    reservedPatchRecord($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    reservedPatchRecordEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = reservedPatchsUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_reservedPatchsPgResource.find(spec);
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
  UpdateReservedPatchRecordByRowIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    reservedPatchRecordPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  ReservedPatchRecordPatch: {
    __baked: createObjectAndApplyChildren,
    rowId(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    }
  },
  UpdateReservedInputRecordPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    reservedInputRecord($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    reservedInputRecordEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = reserved_inputUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_reserved_inputPgResource.find(spec);
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
  UpdateReservedInputRecordByRowIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    reservedInputRecordPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  ReservedInputRecordPatch: {
    __baked: createObjectAndApplyChildren,
    rowId(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    }
  },
  UpdateDefaultValuePayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    defaultValue($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    defaultValueEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = default_valueUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_default_valuePgResource.find(spec);
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
  UpdateDefaultValueByRowIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    defaultValuePatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  DefaultValuePatch: {
    __baked: createObjectAndApplyChildren,
    rowId(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    nullValue(obj, val, {
      field,
      schema
    }) {
      obj.set("null_value", bakedInputRuntime(schema, field.type, val));
    }
  },
  UpdateNoPrimaryKeyPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    noPrimaryKey($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  UpdateNoPrimaryKeyByRowIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    noPrimaryKeyPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  NoPrimaryKeyPatch: {
    __baked: createObjectAndApplyChildren,
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
  },
  UpdateUniqueForeignKeyPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    uniqueForeignKey($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  UpdateUniqueForeignKeyByCompoundKey1AndCompoundKey2Input: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    uniqueForeignKeyPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UniqueForeignKeyPatch: {
    __baked: createObjectAndApplyChildren,
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
  },
  UpdateCMyTablePayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    cMyTable($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    cMyTableEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = c_my_tableUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_c_my_tablePgResource.find(spec);
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
  UpdateCMyTableByRowIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    cMyTablePatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  CMyTablePatch: {
    __baked: createObjectAndApplyChildren,
    rowId(obj, val, {
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
  UpdateCPersonSecretPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    cPersonSecret($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    cPersonSecretEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = c_person_secretUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_c_person_secretPgResource.find(spec);
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
  UpdateCPersonSecretByPersonIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    cPersonSecretPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  CPersonSecretPatch: {
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
  UpdateViewTablePayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    viewTable($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    viewTableEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = view_tableUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_view_tablePgResource.find(spec);
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
  UpdateViewTableByRowIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    viewTablePatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  ViewTablePatch: {
    __baked: createObjectAndApplyChildren,
    rowId(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
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
    }
  },
  UpdateCCompoundKeyPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    cCompoundKey($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    cCompoundKeyEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = c_compound_keyUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_c_compound_keyPgResource.find(spec);
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
  UpdateCCompoundKeyByPersonId1AndPersonId2Input: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    cCompoundKeyPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  CCompoundKeyPatch: {
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
  UpdateSimilarTable1Payload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    similarTable1($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    similarTable1Edge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = similar_table_1Uniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_similar_table_1PgResource.find(spec);
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
  UpdateSimilarTable1ByRowIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    similarTable1Patch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  SimilarTable1Patch: {
    __baked: createObjectAndApplyChildren,
    rowId(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
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
    }
  },
  UpdateSimilarTable2Payload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    similarTable2($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    similarTable2Edge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = similar_table_2Uniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_similar_table_2PgResource.find(spec);
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
  UpdateSimilarTable2ByRowIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    similarTable2Patch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  SimilarTable2Patch: {
    __baked: createObjectAndApplyChildren,
    rowId(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
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
    }
  },
  UpdateCNullTestRecordPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    cNullTestRecord($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    cNullTestRecordEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = c_null_test_recordUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_c_null_test_recordPgResource.find(spec);
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
  UpdateCNullTestRecordByRowIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    cNullTestRecordPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  CNullTestRecordPatch: {
    __baked: createObjectAndApplyChildren,
    rowId(obj, val, {
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
  UpdateCLeftArmPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    cLeftArm($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    cLeftArmEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = c_left_armUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_c_left_armPgResource.find(spec);
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
  UpdateCLeftArmByRowIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    cLeftArmPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  CLeftArmPatch: {
    __baked: createObjectAndApplyChildren,
    rowId(obj, val, {
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
  UpdateCLeftArmByPersonIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    cLeftArmPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UpdateCIssue756Payload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    cIssue756($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    cIssue756Edge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = c_issue756Uniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_c_issue756PgResource.find(spec);
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
  UpdateCIssue756ByRowIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    cIssue756Patch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  CIssue756Patch: {
    __baked: createObjectAndApplyChildren,
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
  },
  UpdatePostPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    post($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    postEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = postUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_postPgResource.find(spec);
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
  UpdatePostByRowIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    postPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  PostPatch: {
    __baked: createObjectAndApplyChildren,
    rowId(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    headline(obj, val, {
      field,
      schema
    }) {
      obj.set("headline", bakedInputRuntime(schema, field.type, val));
    },
    body(obj, val, {
      field,
      schema
    }) {
      obj.set("body", bakedInputRuntime(schema, field.type, val));
    },
    authorId(obj, val, {
      field,
      schema
    }) {
      obj.set("author_id", bakedInputRuntime(schema, field.type, val));
    },
    enums(obj, val, {
      field,
      schema
    }) {
      obj.set("enums", bakedInputRuntime(schema, field.type, val));
    },
    comptypes(obj, val, {
      field,
      schema
    }) {
      obj.set("comptypes", bakedInputRuntime(schema, field.type, val));
    }
  },
  UpdateCPersonPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    cPerson($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    cPersonEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = c_personUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_c_personPgResource.find(spec);
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
  UpdateCPersonByRowIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    cPersonPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  CPersonPatch: {
    __baked: createObjectAndApplyChildren,
    rowId(obj, val, {
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
  UpdateCPersonByEmailInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    cPersonPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UpdateBListPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    bList($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    bListEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = b_listsUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_b_listsPgResource.find(spec);
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
  UpdateBListByRowIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    bListPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  BListPatch: {
    __baked: createObjectAndApplyChildren,
    rowId(obj, val, {
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
  UpdateBTypePayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    bType($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    bTypeEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = b_typesUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_b_typesPgResource.find(spec);
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
  UpdateBTypeByRowIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    bTypePatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  BTypePatch: {
    __baked: createObjectAndApplyChildren,
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
  DeleteInputPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    input($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    inputEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = inputsUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_inputsPgResource.find(spec);
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
  DeleteInputByRowIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeletePatchPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    patch($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    patchEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = patchsUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_patchsPgResource.find(spec);
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
  DeletePatchByRowIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteReservedPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    reserved($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    reservedEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = reservedUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_reservedPgResource.find(spec);
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
  DeleteReservedByRowIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteReservedPatchRecordPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    reservedPatchRecord($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    reservedPatchRecordEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = reservedPatchsUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_reservedPatchsPgResource.find(spec);
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
  DeleteReservedPatchRecordByRowIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteReservedInputRecordPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    reservedInputRecord($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    reservedInputRecordEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = reserved_inputUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_reserved_inputPgResource.find(spec);
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
  DeleteReservedInputRecordByRowIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteDefaultValuePayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    defaultValue($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    defaultValueEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = default_valueUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_default_valuePgResource.find(spec);
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
  DeleteDefaultValueByRowIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteNoPrimaryKeyPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    noPrimaryKey($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  DeleteNoPrimaryKeyByRowIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteUniqueForeignKeyPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    uniqueForeignKey($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  DeleteUniqueForeignKeyByCompoundKey1AndCompoundKey2Input: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteCMyTablePayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    cMyTable($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    cMyTableEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = c_my_tableUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_c_my_tablePgResource.find(spec);
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
  DeleteCMyTableByRowIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteCPersonSecretPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    cPersonSecret($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    cPersonSecretEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = c_person_secretUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_c_person_secretPgResource.find(spec);
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
  DeleteCPersonSecretByPersonIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteViewTablePayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    viewTable($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    viewTableEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = view_tableUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_view_tablePgResource.find(spec);
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
  DeleteViewTableByRowIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteCCompoundKeyPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    cCompoundKey($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    cCompoundKeyEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = c_compound_keyUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_c_compound_keyPgResource.find(spec);
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
  DeleteCCompoundKeyByPersonId1AndPersonId2Input: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteSimilarTable1Payload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    similarTable1($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    similarTable1Edge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = similar_table_1Uniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_similar_table_1PgResource.find(spec);
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
  DeleteSimilarTable1ByRowIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteSimilarTable2Payload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    similarTable2($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    similarTable2Edge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = similar_table_2Uniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_similar_table_2PgResource.find(spec);
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
  DeleteSimilarTable2ByRowIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteCNullTestRecordPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    cNullTestRecord($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    cNullTestRecordEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = c_null_test_recordUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_c_null_test_recordPgResource.find(spec);
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
  DeleteCNullTestRecordByRowIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteCLeftArmPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    cLeftArm($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    cLeftArmEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = c_left_armUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_c_left_armPgResource.find(spec);
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
  DeleteCLeftArmByRowIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteCLeftArmByPersonIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteCIssue756Payload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    cIssue756($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    cIssue756Edge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = c_issue756Uniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_c_issue756PgResource.find(spec);
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
  DeleteCIssue756ByRowIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeletePostPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    post($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    postEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = postUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_postPgResource.find(spec);
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
  DeletePostByRowIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteCPersonPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    cPerson($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    cPersonEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = c_personUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_c_personPgResource.find(spec);
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
  DeleteCPersonByRowIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteCPersonByEmailInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteBListPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    bList($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    bListEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = b_listsUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_b_listsPgResource.find(spec);
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
  DeleteBListByRowIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteBTypePayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    bType($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    bTypeEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = b_typesUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_b_typesPgResource.find(spec);
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
  DeleteBTypeByRowIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  }
};
export const schema = makeGrafastSchema({
  typeDefs: typeDefs,
  plans: plans
});
