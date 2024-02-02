import { PgDeleteSingleStep, PgExecutor, PgSelectStep, PgUnionAllStep, TYPES, assertPgClassSingleStep, makeRegistry, pgDeleteSingle, pgInsertSingle, pgSelectFromRecord, pgUpdateSingle, recordCodec, sqlFromArgDigests } from "@dataplan/pg";
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
const nodeIdCodecs = Object.assign(Object.create(null), {
  raw: handler.codec,
  base64JSON: {
    name: "base64JSON",
    encode(value) {
      return Buffer.from(JSON.stringify(value), "utf8").toString("base64");
    },
    decode(value) {
      return JSON.parse(Buffer.from(value, "base64").toString("utf8"));
    }
  },
  pipeString: {
    name: "pipeString",
    encode(value) {
      return Array.isArray(value) ? value.join("|") : null;
    },
    decode(value) {
      return typeof value === "string" ? value.split("|") : null;
    }
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
const extensions = {
  oid: "1376693",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "enum_tables",
    name: "abcd"
  },
  tags: Object.assign(Object.create(null), {
    enum: true,
    enumName: "LetterAToD",
    behavior: ["-*"]
  })
};
const spec_abcd = {
  name: "abcd",
  identifier: sql.identifier(...["enum_tables", "abcd"]),
  attributes: Object.assign(Object.create(null), {
    letter: {
      description: undefined,
      codec: TYPES.text,
      notNull: true,
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
        tags: {
          enumDescription: true
        }
      }
    }
  }),
  description: undefined,
  extensions,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_abcd_abcd = recordCodec(spec_abcd);
const attributes2 = Object.assign(Object.create(null), {
  letter: {
    description: undefined,
    codec: TYPES.text,
    notNull: true,
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
  }
});
const extensions2 = {
  oid: "1376700",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "enum_tables",
    name: "abcd_view"
  },
  tags: Object.assign(Object.create(null), {
    primaryKey: "letter",
    enum: true,
    enumName: "LetterAToDViaView",
    behavior: ["-*"]
  })
};
const parts2 = ["enum_tables", "abcd_view"];
const sqlIdent2 = sql.identifier(...parts2);
const spec_abcdView = {
  name: "abcdView",
  identifier: sqlIdent2,
  attributes: attributes2,
  description: undefined,
  extensions: extensions2,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_abcdView_abcdView = recordCodec(spec_abcdView);
const attributes3 = Object.assign(Object.create(null), {
  value: {
    description: undefined,
    codec: TYPES.text,
    notNull: true,
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
  }
});
const extensions3 = {
  oid: "1376686",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "enum_tables",
    name: "simple_enum"
  },
  tags: Object.assign(Object.create(null), {
    enum: true,
    behavior: ["-*"]
  })
};
const parts3 = ["enum_tables", "simple_enum"];
const sqlIdent3 = sql.identifier(...parts3);
const spec_simpleEnum = {
  name: "simpleEnum",
  identifier: sqlIdent3,
  attributes: attributes3,
  description: undefined,
  extensions: extensions3,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_simpleEnum_simpleEnum = recordCodec(spec_simpleEnum);
const attributes_letter_codec_LetterAToDEnum = registry.pgCodecs["LetterAToDEnum"];
const attributes_letter_via_view_codec_LetterAToDViaViewEnum = registry.pgCodecs["LetterAToDViaViewEnum"];
const attributes4 = Object.assign(Object.create(null), {
  id: {
    description: undefined,
    codec: TYPES.int,
    notNull: true,
    hasDefault: true,
    extensions: {
      tags: {}
    }
  },
  letter: {
    description: undefined,
    codec: attributes_letter_codec_LetterAToDEnum,
    notNull: true,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  },
  letter_via_view: {
    description: undefined,
    codec: attributes_letter_via_view_codec_LetterAToDViaViewEnum,
    notNull: true,
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
  }
});
const extensions4 = {
  oid: "1376705",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "enum_tables",
    name: "letter_descriptions"
  },
  tags: Object.assign(Object.create(null), {
    foreignKey: "(letter_via_view) references enum_tables.abcd_view"
  })
};
const parts4 = ["enum_tables", "letter_descriptions"];
const sqlIdent4 = sql.identifier(...parts4);
const spec_letterDescriptions = {
  name: "letterDescriptions",
  identifier: sqlIdent4,
  attributes: attributes4,
  description: undefined,
  extensions: extensions4,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_letterDescriptions_letterDescriptions = recordCodec(spec_letterDescriptions);
const attributes_enum_1_codec_EnumTheFirstEnum = registry.pgCodecs["EnumTheFirstEnum"];
const attributes_enum_2_codec_EnumTheSecondEnum = registry.pgCodecs["EnumTheSecondEnum"];
const attributes_enum_3_codec_LotsOfEnumsEnum3Enum = registry.pgCodecs["LotsOfEnumsEnum3Enum"];
const attributes_simple_enum_codec_SimpleEnumEnum = registry.pgCodecs["SimpleEnumEnum"];
const attributes5 = Object.assign(Object.create(null), {
  id: {
    description: undefined,
    codec: TYPES.int,
    notNull: true,
    hasDefault: true,
    extensions: {
      tags: {}
    }
  },
  enum_1: {
    description: undefined,
    codec: attributes_enum_1_codec_EnumTheFirstEnum,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  },
  enum_2: {
    description: undefined,
    codec: attributes_enum_2_codec_EnumTheSecondEnum,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  },
  enum_3: {
    description: undefined,
    codec: attributes_enum_3_codec_LotsOfEnumsEnum3Enum,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  },
  simple_enum: {
    description: undefined,
    codec: attributes_simple_enum_codec_SimpleEnumEnum,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  }
});
const extensions5 = {
  oid: "1376740",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "enum_tables",
    name: "referencing_table"
  },
  tags: Object.create(null)
};
const parts5 = ["enum_tables", "referencing_table"];
const sqlIdent5 = sql.identifier(...parts5);
const spec_referencingTable = {
  name: "referencingTable",
  identifier: sqlIdent5,
  attributes: attributes5,
  description: undefined,
  extensions: extensions5,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_referencingTable_referencingTable = recordCodec(spec_referencingTable);
const attributes6 = Object.assign(Object.create(null), {
  id: {
    description: undefined,
    codec: TYPES.int,
    notNull: true,
    hasDefault: true,
    extensions: {
      tags: {}
    }
  },
  enum_1: {
    description: undefined,
    codec: TYPES.text,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  },
  enum_2: {
    description: undefined,
    codec: TYPES.varchar,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  },
  enum_3: {
    description: undefined,
    codec: TYPES.bpchar,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  },
  enum_4: {
    description: undefined,
    codec: TYPES.text,
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
  }
});
const extensions6 = {
  oid: "1376723",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "enum_tables",
    name: "lots_of_enums"
  },
  tags: Object.assign(Object.create(null), {
    omit: true,
    behavior: ["-*"]
  })
};
const parts6 = ["enum_tables", "lots_of_enums"];
const sqlIdent6 = sql.identifier(...parts6);
const spec_lotsOfEnums = {
  name: "lotsOfEnums",
  identifier: sqlIdent6,
  attributes: attributes6,
  description: undefined,
  extensions: extensions6,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_lotsOfEnums_lotsOfEnums = recordCodec(spec_lotsOfEnums);
const extensions7 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "enum_tables",
    name: "abcd"
  },
  tags: {
    enum: true,
    enumName: "LetterAToD",
    behavior: extensions.tags.behavior
  }
};
const registryConfig_pgResources_abcd_abcd = {
  executor: executor_mainPgExecutor,
  name: "abcd",
  identifier: "main.enum_tables.abcd",
  from: registryConfig_pgCodecs_abcd_abcd.sqlType,
  codec: registryConfig_pgCodecs_abcd_abcd,
  uniques: [{
    isPrimary: true,
    attributes: ["letter"],
    description: undefined,
    extensions: {
      tags: Object.create(null)
    }
  }],
  isVirtual: false,
  description: undefined,
  extensions: extensions7
};
const extensions8 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "enum_tables",
    name: "abcd_view"
  },
  tags: {
    primaryKey: "letter",
    enum: true,
    enumName: "LetterAToDViaView",
    behavior: extensions2.tags.behavior
  }
};
const uniques2 = [{
  isPrimary: true,
  attributes: ["letter"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_abcd_view_abcd_view = {
  executor: executor_mainPgExecutor,
  name: "abcd_view",
  identifier: "main.enum_tables.abcd_view",
  from: registryConfig_pgCodecs_abcdView_abcdView.sqlType,
  codec: registryConfig_pgCodecs_abcdView_abcdView,
  uniques: uniques2,
  isVirtual: false,
  description: undefined,
  extensions: extensions8
};
const extensions9 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "enum_tables",
    name: "simple_enum"
  },
  tags: {
    enum: true,
    behavior: extensions3.tags.behavior
  }
};
const uniques3 = [{
  isPrimary: true,
  attributes: ["value"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_simple_enum_simple_enum = {
  executor: executor_mainPgExecutor,
  name: "simple_enum",
  identifier: "main.enum_tables.simple_enum",
  from: registryConfig_pgCodecs_simpleEnum_simpleEnum.sqlType,
  codec: registryConfig_pgCodecs_simpleEnum_simpleEnum,
  uniques: uniques3,
  isVirtual: false,
  description: undefined,
  extensions: extensions9
};
const extensions10 = {
  pg: {
    serviceName: "main",
    schemaName: "enum_tables",
    name: "referencing_table_mutation"
  },
  tags: {
    behavior: ["-queryField mutationField -typeField", "-filter -order"]
  }
};
const parts7 = ["enum_tables", "referencing_table_mutation"];
const sqlIdent7 = sql.identifier(...parts7);
const extensions11 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "enum_tables",
    name: "letter_descriptions"
  },
  tags: {
    foreignKey: "(letter_via_view) references enum_tables.abcd_view"
  }
};
const uniques4 = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}, {
  isPrimary: false,
  attributes: ["letter"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}, {
  isPrimary: false,
  attributes: ["letter_via_view"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_letter_descriptions_letter_descriptions = {
  executor: executor_mainPgExecutor,
  name: "letter_descriptions",
  identifier: "main.enum_tables.letter_descriptions",
  from: registryConfig_pgCodecs_letterDescriptions_letterDescriptions.sqlType,
  codec: registryConfig_pgCodecs_letterDescriptions_letterDescriptions,
  uniques: uniques4,
  isVirtual: false,
  description: undefined,
  extensions: extensions11
};
const extensions12 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "enum_tables",
    name: "referencing_table"
  },
  tags: {}
};
const uniques5 = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_referencing_table_referencing_table = {
  executor: executor_mainPgExecutor,
  name: "referencing_table",
  identifier: "main.enum_tables.referencing_table",
  from: registryConfig_pgCodecs_referencingTable_referencingTable.sqlType,
  codec: registryConfig_pgCodecs_referencingTable_referencingTable,
  uniques: uniques5,
  isVirtual: false,
  description: undefined,
  extensions: extensions12
};
const extensions13 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "enum_tables",
    name: "lots_of_enums"
  },
  tags: {
    omit: true,
    behavior: extensions6.tags.behavior
  }
};
const uniques6 = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}, {
  isPrimary: false,
  attributes: ["enum_1"],
  description: undefined,
  extensions: {
    tags: Object.assign(Object.create(null), {
      enum: true,
      enumName: "EnumTheFirst"
    })
  }
}, {
  isPrimary: false,
  attributes: ["enum_2"],
  description: undefined,
  extensions: {
    tags: Object.assign(Object.create(null), {
      enum: true,
      enumName: "EnumTheSecond"
    })
  }
}, {
  isPrimary: false,
  attributes: ["enum_3"],
  description: undefined,
  extensions: {
    tags: Object.assign(Object.create(null), {
      enum: true
    })
  }
}, {
  isPrimary: false,
  attributes: ["enum_4"],
  description: undefined,
  extensions: {
    tags: Object.assign(Object.create(null), {
      enum: true
    })
  }
}];
const registryConfig_pgResources_lots_of_enums_lots_of_enums = {
  executor: executor_mainPgExecutor,
  name: "lots_of_enums",
  identifier: "main.enum_tables.lots_of_enums",
  from: registryConfig_pgCodecs_lotsOfEnums_lotsOfEnums.sqlType,
  codec: registryConfig_pgCodecs_lotsOfEnums_lotsOfEnums,
  uniques: uniques6,
  isVirtual: false,
  description: undefined,
  extensions: extensions13
};
const registry = makeRegistry({
  pgCodecs: Object.assign(Object.create(null), {
    abcd: registryConfig_pgCodecs_abcd_abcd,
    text: TYPES.text,
    abcdView: registryConfig_pgCodecs_abcdView_abcdView,
    simpleEnum: registryConfig_pgCodecs_simpleEnum_simpleEnum,
    int4: TYPES.int,
    letterDescriptions: registryConfig_pgCodecs_letterDescriptions_letterDescriptions,
    LetterAToDEnum: attributes_letter_codec_LetterAToDEnum,
    LetterAToDViaViewEnum: attributes_letter_via_view_codec_LetterAToDViaViewEnum,
    referencingTable: registryConfig_pgCodecs_referencingTable_referencingTable,
    EnumTheFirstEnum: attributes_enum_1_codec_EnumTheFirstEnum,
    EnumTheSecondEnum: attributes_enum_2_codec_EnumTheSecondEnum,
    LotsOfEnumsEnum3Enum: attributes_enum_3_codec_LotsOfEnumsEnum3Enum,
    SimpleEnumEnum: attributes_simple_enum_codec_SimpleEnumEnum,
    lotsOfEnums: registryConfig_pgCodecs_lotsOfEnums_lotsOfEnums,
    varchar: TYPES.varchar,
    bpchar: TYPES.bpchar
  }),
  pgResources: Object.assign(Object.create(null), {
    abcd: registryConfig_pgResources_abcd_abcd,
    abcd_view: registryConfig_pgResources_abcd_view_abcd_view,
    simple_enum: registryConfig_pgResources_simple_enum_simple_enum,
    referencing_table_mutation: {
      executor: executor_mainPgExecutor,
      name: "referencing_table_mutation",
      identifier: "main.enum_tables.referencing_table_mutation(enum_tables.referencing_table)",
      from(...args) {
        return sql`${sqlIdent7}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "t",
        required: true,
        notNull: false,
        codec: registryConfig_pgCodecs_referencingTable_referencingTable
      }],
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: true,
      extensions: extensions10,
      description: undefined
    },
    letter_descriptions: registryConfig_pgResources_letter_descriptions_letter_descriptions,
    referencing_table: registryConfig_pgResources_referencing_table_referencing_table,
    lots_of_enums: registryConfig_pgResources_lots_of_enums_lots_of_enums
  }),
  pgRelations: Object.assign(Object.create(null), {
    abcd: Object.assign(Object.create(null), {
      letterDescriptionsByTheirLetter: {
        localCodec: registryConfig_pgCodecs_abcd_abcd,
        remoteResourceOptions: registryConfig_pgResources_letter_descriptions_letter_descriptions,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["letter"],
        remoteAttributes: ["letter"],
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
    abcdView: Object.assign(Object.create(null), {
      letterDescriptionsByTheirLetterViaView: {
        localCodec: registryConfig_pgCodecs_abcdView_abcdView,
        remoteResourceOptions: registryConfig_pgResources_letter_descriptions_letter_descriptions,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["letter"],
        remoteAttributes: ["letter_via_view"],
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
    letterDescriptions: Object.assign(Object.create(null), {
      abcdViewByMyLetterViaView: {
        localCodec: registryConfig_pgCodecs_letterDescriptions_letterDescriptions,
        remoteResourceOptions: registryConfig_pgResources_abcd_view_abcd_view,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["letter_via_view"],
        remoteAttributes: ["letter"],
        isUnique: true,
        isReferencee: false,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      abcdByMyLetter: {
        localCodec: registryConfig_pgCodecs_letterDescriptions_letterDescriptions,
        remoteResourceOptions: registryConfig_pgResources_abcd_abcd,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["letter"],
        remoteAttributes: ["letter"],
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
    lotsOfEnums: Object.assign(Object.create(null), {
      referencingTablesByTheirEnum1: {
        localCodec: registryConfig_pgCodecs_lotsOfEnums_lotsOfEnums,
        remoteResourceOptions: registryConfig_pgResources_referencing_table_referencing_table,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["enum_1"],
        remoteAttributes: ["enum_1"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      referencingTablesByTheirEnum2: {
        localCodec: registryConfig_pgCodecs_lotsOfEnums_lotsOfEnums,
        remoteResourceOptions: registryConfig_pgResources_referencing_table_referencing_table,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["enum_2"],
        remoteAttributes: ["enum_2"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      referencingTablesByTheirEnum3: {
        localCodec: registryConfig_pgCodecs_lotsOfEnums_lotsOfEnums,
        remoteResourceOptions: registryConfig_pgResources_referencing_table_referencing_table,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["enum_3"],
        remoteAttributes: ["enum_3"],
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
    referencingTable: Object.assign(Object.create(null), {
      lotsOfEnumsByMyEnum1: {
        localCodec: registryConfig_pgCodecs_referencingTable_referencingTable,
        remoteResourceOptions: registryConfig_pgResources_lots_of_enums_lots_of_enums,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["enum_1"],
        remoteAttributes: ["enum_1"],
        isUnique: true,
        isReferencee: false,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      lotsOfEnumsByMyEnum2: {
        localCodec: registryConfig_pgCodecs_referencingTable_referencingTable,
        remoteResourceOptions: registryConfig_pgResources_lots_of_enums_lots_of_enums,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["enum_2"],
        remoteAttributes: ["enum_2"],
        isUnique: true,
        isReferencee: false,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      lotsOfEnumsByMyEnum3: {
        localCodec: registryConfig_pgCodecs_referencingTable_referencingTable,
        remoteResourceOptions: registryConfig_pgResources_lots_of_enums_lots_of_enums,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["enum_3"],
        remoteAttributes: ["enum_3"],
        isUnique: true,
        isReferencee: false,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      simpleEnumByMySimpleEnum: {
        localCodec: registryConfig_pgCodecs_referencingTable_referencingTable,
        remoteResourceOptions: registryConfig_pgResources_simple_enum_simple_enum,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["simple_enum"],
        remoteAttributes: ["value"],
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
    simpleEnum: Object.assign(Object.create(null), {
      referencingTablesByTheirSimpleEnum: {
        localCodec: registryConfig_pgCodecs_simpleEnum_simpleEnum,
        remoteResourceOptions: registryConfig_pgResources_referencing_table_referencing_table,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["value"],
        remoteAttributes: ["simple_enum"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      }
    })
  })
});
const pgResource_letter_descriptionsPgResource = registry.pgResources["letter_descriptions"];
const pgResource_referencing_tablePgResource = registry.pgResources["referencing_table"];
const nodeIdHandlerByTypeName = Object.assign(Object.create(null), {
  Query: handler,
  LetterDescription: {
    typeName: "LetterDescription",
    codec: nodeIdCodecs.base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("letter_descriptions", false), $record.get("id")]);
    },
    getSpec($list) {
      return {
        id: access($list, [1])
      };
    },
    get(spec) {
      return pgResource_letter_descriptionsPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "letter_descriptions";
    }
  },
  ReferencingTable: {
    typeName: "ReferencingTable",
    codec: nodeIdCodecs.base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("referencing_tables", false), $record.get("id")]);
    },
    getSpec($list) {
      return {
        id: access($list, [1])
      };
    },
    get(spec) {
      return pgResource_referencing_tablePgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "referencing_tables";
    }
  }
});
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
})(nodeIdHandlerByTypeName.LetterDescription);
const fetcher2 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName.ReferencingTable);
function Query_allLetterDescriptions_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allLetterDescriptions_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Query_allLetterDescriptions_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allLetterDescriptions_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Query_allLetterDescriptions_after_applyPlan(_, $connection, val) {
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
function Query_allReferencingTables_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allReferencingTables_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Query_allReferencingTables_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allReferencingTables_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Query_allReferencingTables_after_applyPlan(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
function LetterDescriptionsConnection_nodesPlan($connection) {
  return $connection.nodes();
}
function LetterDescriptionsConnection_edgesPlan($connection) {
  return $connection.edges();
}
function LetterDescriptionsConnection_pageInfoPlan($connection) {
  // TYPES: why is this a TypeScript issue without the 'any'?
  return $connection.pageInfo();
}
function PageInfo_hasNextPagePlan($pageInfo) {
  return $pageInfo.hasNextPage();
}
function PageInfo_hasPreviousPagePlan($pageInfo) {
  return $pageInfo.hasPreviousPage();
}
function ReferencingTablesConnection_nodesPlan($connection) {
  return $connection.nodes();
}
function ReferencingTablesConnection_edgesPlan($connection) {
  return $connection.edges();
}
function ReferencingTablesConnection_pageInfoPlan($connection) {
  // TYPES: why is this a TypeScript issue without the 'any'?
  return $connection.pageInfo();
}
const argDetailsSimple = [{
  graphqlArgName: "t",
  postgresArgName: "t",
  pgCodec: registryConfig_pgCodecs_referencingTable_referencingTable,
  required: true,
  fetcher: null
}];
const makeArgs = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 1; i++) {
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
const resource_referencing_table_mutationPgResource = registry.pgResources["referencing_table_mutation"];
function Mutation_referencingTableMutation_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_createLetterDescription_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_createReferencingTable_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.LetterDescription, $nodeId);
};
function Mutation_updateLetterDescription_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updateLetterDescriptionById_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updateLetterDescriptionByLetter_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updateLetterDescriptionByLetterViaView_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs2 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.ReferencingTable, $nodeId);
};
function Mutation_updateReferencingTable_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updateReferencingTableById_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs3 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.LetterDescription, $nodeId);
};
function Mutation_deleteLetterDescription_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deleteLetterDescriptionById_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deleteLetterDescriptionByLetter_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deleteLetterDescriptionByLetterViaView_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs4 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.ReferencingTable, $nodeId);
};
function Mutation_deleteReferencingTable_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deleteReferencingTableById_input_applyPlan(_, $object) {
  return $object;
}
function ReferencingTableMutationPayload_clientMutationIdPlan($object) {
  return $object.getStepForKey("clientMutationId", true) ?? constant(undefined);
}
function ReferencingTableMutationPayload_queryPlan() {
  return rootValue();
}
function ReferencingTableMutationInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function CreateLetterDescriptionPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function CreateLetterDescriptionPayload_letterDescriptionPlan($object) {
  return $object.get("result");
}
function CreateLetterDescriptionPayload_queryPlan() {
  return rootValue();
}
function CreateLetterDescriptionInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function CreateLetterDescriptionInput_letterDescription_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function CreateReferencingTablePayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function CreateReferencingTablePayload_referencingTablePlan($object) {
  return $object.get("result");
}
function CreateReferencingTablePayload_queryPlan() {
  return rootValue();
}
function CreateReferencingTableInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function CreateReferencingTableInput_referencingTable_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateLetterDescriptionPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function UpdateLetterDescriptionPayload_letterDescriptionPlan($object) {
  return $object.get("result");
}
function UpdateLetterDescriptionPayload_queryPlan() {
  return rootValue();
}
function UpdateLetterDescriptionInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateLetterDescriptionInput_letterDescriptionPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateLetterDescriptionByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateLetterDescriptionByIdInput_letterDescriptionPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateLetterDescriptionByLetterInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateLetterDescriptionByLetterInput_letterDescriptionPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateLetterDescriptionByLetterViaViewInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateLetterDescriptionByLetterViaViewInput_letterDescriptionPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateReferencingTablePayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function UpdateReferencingTablePayload_referencingTablePlan($object) {
  return $object.get("result");
}
function UpdateReferencingTablePayload_queryPlan() {
  return rootValue();
}
function UpdateReferencingTableInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateReferencingTableInput_referencingTablePatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateReferencingTableByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateReferencingTableByIdInput_referencingTablePatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function DeleteLetterDescriptionPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function DeleteLetterDescriptionPayload_letterDescriptionPlan($object) {
  return $object.get("result");
}
function DeleteLetterDescriptionPayload_queryPlan() {
  return rootValue();
}
function DeleteLetterDescriptionInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteLetterDescriptionByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteLetterDescriptionByLetterInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteLetterDescriptionByLetterViaViewInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteReferencingTablePayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function DeleteReferencingTablePayload_referencingTablePlan($object) {
  return $object.get("result");
}
function DeleteReferencingTablePayload_queryPlan() {
  return rootValue();
}
function DeleteReferencingTableInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteReferencingTableByIdInput_clientMutationId_applyPlan($input, val) {
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

  """Get a single \`LetterDescription\`."""
  letterDescriptionById(id: Int!): LetterDescription

  """Get a single \`LetterDescription\`."""
  letterDescriptionByLetter(letter: LetterAToD!): LetterDescription

  """Get a single \`LetterDescription\`."""
  letterDescriptionByLetterViaView(letterViaView: LetterAToDViaView!): LetterDescription

  """Get a single \`ReferencingTable\`."""
  referencingTableById(id: Int!): ReferencingTable

  """Reads a single \`LetterDescription\` using its globally unique \`ID\`."""
  letterDescription(
    """
    The globally unique \`ID\` to be used in selecting a single \`LetterDescription\`.
    """
    nodeId: ID!
  ): LetterDescription

  """Reads a single \`ReferencingTable\` using its globally unique \`ID\`."""
  referencingTable(
    """
    The globally unique \`ID\` to be used in selecting a single \`ReferencingTable\`.
    """
    nodeId: ID!
  ): ReferencingTable

  """Reads and enables pagination through a set of \`LetterDescription\`."""
  allLetterDescriptions(
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

    """The method to use when ordering \`LetterDescription\`."""
    orderBy: [LetterDescriptionsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: LetterDescriptionCondition
  ): LetterDescriptionsConnection

  """Reads and enables pagination through a set of \`ReferencingTable\`."""
  allReferencingTables(
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

    """The method to use when ordering \`ReferencingTable\`."""
    orderBy: [ReferencingTablesOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: ReferencingTableCondition
  ): ReferencingTablesConnection
}

"""An object with a globally unique \`ID\`."""
interface Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
}

type LetterDescription implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  letter: LetterAToD!
  letterViaView: LetterAToDViaView!
  description: String
}

enum LetterAToD {
  """The letter A"""
  A

  """The letter B"""
  B

  """The letter C"""
  C

  """The letter D"""
  D
}

enum LetterAToDViaView {
  """The letter A"""
  A

  """The letter B"""
  B

  """The letter C"""
  C

  """The letter D"""
  D
}

type ReferencingTable implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  enum1: EnumTheFirst
  enum2: EnumTheSecond
  enum3: LotsOfEnumsEnum3
  simpleEnum: SimpleEnum
}

enum EnumTheFirst {
  """Desc A1"""
  A1

  """Desc A2"""
  A2

  """Desc A3"""
  A3

  """Desc A4"""
  A4
}

enum EnumTheSecond {
  """Desc B1"""
  B1

  """Desc B2"""
  B2

  """Desc B3"""
  B3

  """Desc B4"""
  B4
}

enum LotsOfEnumsEnum3 {
  """Desc C1"""
  C1

  """Desc C2"""
  C2

  """Desc C3"""
  C3

  """Desc C4"""
  C4
}

enum SimpleEnum {
  """The first metasyntactic variable"""
  FOO
  BAR

  """The third metasyntactic variable, very similar to its predecessor"""
  BAZ
  QUX
}

"""A connection to a list of \`LetterDescription\` values."""
type LetterDescriptionsConnection {
  """A list of \`LetterDescription\` objects."""
  nodes: [LetterDescription]!

  """
  A list of edges which contains the \`LetterDescription\` and cursor to aid in pagination.
  """
  edges: [LetterDescriptionsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """
  The count of *all* \`LetterDescription\` you could get from the connection.
  """
  totalCount: Int!
}

"""A \`LetterDescription\` edge in the connection."""
type LetterDescriptionsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`LetterDescription\` at the end of the edge."""
  node: LetterDescription
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

"""Methods to use when ordering \`LetterDescription\`."""
enum LetterDescriptionsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  LETTER_ASC
  LETTER_DESC
  LETTER_VIA_VIEW_ASC
  LETTER_VIA_VIEW_DESC
  DESCRIPTION_ASC
  DESCRIPTION_DESC
}

"""
A condition to be used against \`LetterDescription\` object types. All fields are
tested for equality and combined with a logical ‘and.’
"""
input LetterDescriptionCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`letter\` field."""
  letter: LetterAToD

  """Checks for equality with the object’s \`letterViaView\` field."""
  letterViaView: LetterAToDViaView

  """Checks for equality with the object’s \`description\` field."""
  description: String
}

"""A connection to a list of \`ReferencingTable\` values."""
type ReferencingTablesConnection {
  """A list of \`ReferencingTable\` objects."""
  nodes: [ReferencingTable]!

  """
  A list of edges which contains the \`ReferencingTable\` and cursor to aid in pagination.
  """
  edges: [ReferencingTablesEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """
  The count of *all* \`ReferencingTable\` you could get from the connection.
  """
  totalCount: Int!
}

"""A \`ReferencingTable\` edge in the connection."""
type ReferencingTablesEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`ReferencingTable\` at the end of the edge."""
  node: ReferencingTable
}

"""Methods to use when ordering \`ReferencingTable\`."""
enum ReferencingTablesOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  ENUM_1_ASC
  ENUM_1_DESC
  ENUM_2_ASC
  ENUM_2_DESC
  ENUM_3_ASC
  ENUM_3_DESC
  SIMPLE_ENUM_ASC
  SIMPLE_ENUM_DESC
}

"""
A condition to be used against \`ReferencingTable\` object types. All fields are
tested for equality and combined with a logical ‘and.’
"""
input ReferencingTableCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`enum1\` field."""
  enum1: EnumTheFirst

  """Checks for equality with the object’s \`enum2\` field."""
  enum2: EnumTheSecond

  """Checks for equality with the object’s \`enum3\` field."""
  enum3: LotsOfEnumsEnum3

  """Checks for equality with the object’s \`simpleEnum\` field."""
  simpleEnum: SimpleEnum
}

"""
The root mutation type which contains root level fields which mutate data.
"""
type Mutation {
  referencingTableMutation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: ReferencingTableMutationInput!
  ): ReferencingTableMutationPayload

  """Creates a single \`LetterDescription\`."""
  createLetterDescription(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateLetterDescriptionInput!
  ): CreateLetterDescriptionPayload

  """Creates a single \`ReferencingTable\`."""
  createReferencingTable(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateReferencingTableInput!
  ): CreateReferencingTablePayload

  """
  Updates a single \`LetterDescription\` using its globally unique id and a patch.
  """
  updateLetterDescription(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateLetterDescriptionInput!
  ): UpdateLetterDescriptionPayload

  """Updates a single \`LetterDescription\` using a unique key and a patch."""
  updateLetterDescriptionById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateLetterDescriptionByIdInput!
  ): UpdateLetterDescriptionPayload

  """Updates a single \`LetterDescription\` using a unique key and a patch."""
  updateLetterDescriptionByLetter(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateLetterDescriptionByLetterInput!
  ): UpdateLetterDescriptionPayload

  """Updates a single \`LetterDescription\` using a unique key and a patch."""
  updateLetterDescriptionByLetterViaView(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateLetterDescriptionByLetterViaViewInput!
  ): UpdateLetterDescriptionPayload

  """
  Updates a single \`ReferencingTable\` using its globally unique id and a patch.
  """
  updateReferencingTable(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateReferencingTableInput!
  ): UpdateReferencingTablePayload

  """Updates a single \`ReferencingTable\` using a unique key and a patch."""
  updateReferencingTableById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateReferencingTableByIdInput!
  ): UpdateReferencingTablePayload

  """Deletes a single \`LetterDescription\` using its globally unique id."""
  deleteLetterDescription(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteLetterDescriptionInput!
  ): DeleteLetterDescriptionPayload

  """Deletes a single \`LetterDescription\` using a unique key."""
  deleteLetterDescriptionById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteLetterDescriptionByIdInput!
  ): DeleteLetterDescriptionPayload

  """Deletes a single \`LetterDescription\` using a unique key."""
  deleteLetterDescriptionByLetter(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteLetterDescriptionByLetterInput!
  ): DeleteLetterDescriptionPayload

  """Deletes a single \`LetterDescription\` using a unique key."""
  deleteLetterDescriptionByLetterViaView(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteLetterDescriptionByLetterViaViewInput!
  ): DeleteLetterDescriptionPayload

  """Deletes a single \`ReferencingTable\` using its globally unique id."""
  deleteReferencingTable(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteReferencingTableInput!
  ): DeleteReferencingTablePayload

  """Deletes a single \`ReferencingTable\` using a unique key."""
  deleteReferencingTableById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteReferencingTableByIdInput!
  ): DeleteReferencingTablePayload
}

"""The output of our \`referencingTableMutation\` mutation."""
type ReferencingTableMutationPayload {
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

"""All input for the \`referencingTableMutation\` mutation."""
input ReferencingTableMutationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  t: ReferencingTableInput
}

"""An input for mutations affecting \`ReferencingTable\`"""
input ReferencingTableInput {
  id: Int
  enum1: EnumTheFirst
  enum2: EnumTheSecond
  enum3: LotsOfEnumsEnum3
  simpleEnum: SimpleEnum
}

"""The output of our create \`LetterDescription\` mutation."""
type CreateLetterDescriptionPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`LetterDescription\` that was created by this mutation."""
  letterDescription: LetterDescription

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`LetterDescription\`. May be used by Relay 1."""
  letterDescriptionEdge(
    """The method to use when ordering \`LetterDescription\`."""
    orderBy: [LetterDescriptionsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): LetterDescriptionsEdge
}

"""All input for the create \`LetterDescription\` mutation."""
input CreateLetterDescriptionInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`LetterDescription\` to be created by this mutation."""
  letterDescription: LetterDescriptionInput!
}

"""An input for mutations affecting \`LetterDescription\`"""
input LetterDescriptionInput {
  id: Int
  letter: LetterAToD!
  letterViaView: LetterAToDViaView!
  description: String
}

"""The output of our create \`ReferencingTable\` mutation."""
type CreateReferencingTablePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`ReferencingTable\` that was created by this mutation."""
  referencingTable: ReferencingTable

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`ReferencingTable\`. May be used by Relay 1."""
  referencingTableEdge(
    """The method to use when ordering \`ReferencingTable\`."""
    orderBy: [ReferencingTablesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ReferencingTablesEdge
}

"""All input for the create \`ReferencingTable\` mutation."""
input CreateReferencingTableInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`ReferencingTable\` to be created by this mutation."""
  referencingTable: ReferencingTableInput!
}

"""The output of our update \`LetterDescription\` mutation."""
type UpdateLetterDescriptionPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`LetterDescription\` that was updated by this mutation."""
  letterDescription: LetterDescription

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`LetterDescription\`. May be used by Relay 1."""
  letterDescriptionEdge(
    """The method to use when ordering \`LetterDescription\`."""
    orderBy: [LetterDescriptionsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): LetterDescriptionsEdge
}

"""All input for the \`updateLetterDescription\` mutation."""
input UpdateLetterDescriptionInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`LetterDescription\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`LetterDescription\` being updated.
  """
  letterDescriptionPatch: LetterDescriptionPatch!
}

"""
Represents an update to a \`LetterDescription\`. Fields that are set will be updated.
"""
input LetterDescriptionPatch {
  id: Int
  letter: LetterAToD
  letterViaView: LetterAToDViaView
  description: String
}

"""All input for the \`updateLetterDescriptionById\` mutation."""
input UpdateLetterDescriptionByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`LetterDescription\` being updated.
  """
  letterDescriptionPatch: LetterDescriptionPatch!
}

"""All input for the \`updateLetterDescriptionByLetter\` mutation."""
input UpdateLetterDescriptionByLetterInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  letter: LetterAToD!

  """
  An object where the defined keys will be set on the \`LetterDescription\` being updated.
  """
  letterDescriptionPatch: LetterDescriptionPatch!
}

"""All input for the \`updateLetterDescriptionByLetterViaView\` mutation."""
input UpdateLetterDescriptionByLetterViaViewInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  letterViaView: LetterAToDViaView!

  """
  An object where the defined keys will be set on the \`LetterDescription\` being updated.
  """
  letterDescriptionPatch: LetterDescriptionPatch!
}

"""The output of our update \`ReferencingTable\` mutation."""
type UpdateReferencingTablePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`ReferencingTable\` that was updated by this mutation."""
  referencingTable: ReferencingTable

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`ReferencingTable\`. May be used by Relay 1."""
  referencingTableEdge(
    """The method to use when ordering \`ReferencingTable\`."""
    orderBy: [ReferencingTablesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ReferencingTablesEdge
}

"""All input for the \`updateReferencingTable\` mutation."""
input UpdateReferencingTableInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`ReferencingTable\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`ReferencingTable\` being updated.
  """
  referencingTablePatch: ReferencingTablePatch!
}

"""
Represents an update to a \`ReferencingTable\`. Fields that are set will be updated.
"""
input ReferencingTablePatch {
  id: Int
  enum1: EnumTheFirst
  enum2: EnumTheSecond
  enum3: LotsOfEnumsEnum3
  simpleEnum: SimpleEnum
}

"""All input for the \`updateReferencingTableById\` mutation."""
input UpdateReferencingTableByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`ReferencingTable\` being updated.
  """
  referencingTablePatch: ReferencingTablePatch!
}

"""The output of our delete \`LetterDescription\` mutation."""
type DeleteLetterDescriptionPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`LetterDescription\` that was deleted by this mutation."""
  letterDescription: LetterDescription
  deletedLetterDescriptionId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`LetterDescription\`. May be used by Relay 1."""
  letterDescriptionEdge(
    """The method to use when ordering \`LetterDescription\`."""
    orderBy: [LetterDescriptionsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): LetterDescriptionsEdge
}

"""All input for the \`deleteLetterDescription\` mutation."""
input DeleteLetterDescriptionInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`LetterDescription\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteLetterDescriptionById\` mutation."""
input DeleteLetterDescriptionByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!
}

"""All input for the \`deleteLetterDescriptionByLetter\` mutation."""
input DeleteLetterDescriptionByLetterInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  letter: LetterAToD!
}

"""All input for the \`deleteLetterDescriptionByLetterViaView\` mutation."""
input DeleteLetterDescriptionByLetterViaViewInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  letterViaView: LetterAToDViaView!
}

"""The output of our delete \`ReferencingTable\` mutation."""
type DeleteReferencingTablePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`ReferencingTable\` that was deleted by this mutation."""
  referencingTable: ReferencingTable
  deletedReferencingTableId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`ReferencingTable\`. May be used by Relay 1."""
  referencingTableEdge(
    """The method to use when ordering \`ReferencingTable\`."""
    orderBy: [ReferencingTablesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ReferencingTablesEdge
}

"""All input for the \`deleteReferencingTable\` mutation."""
input DeleteReferencingTableInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`ReferencingTable\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteReferencingTableById\` mutation."""
input DeleteReferencingTableByIdInput {
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
    letterDescriptionById: {
      plan(_$root, args) {
        return pgResource_letter_descriptionsPgResource.get({
          id: args.get("id")
        });
      },
      args: {
        id: undefined
      }
    },
    letterDescriptionByLetter: {
      plan(_$root, args) {
        return pgResource_letter_descriptionsPgResource.get({
          letter: args.get("letter")
        });
      },
      args: {
        letter: undefined
      }
    },
    letterDescriptionByLetterViaView: {
      plan(_$root, args) {
        return pgResource_letter_descriptionsPgResource.get({
          letter_via_view: args.get("letterViaView")
        });
      },
      args: {
        letterViaView: undefined
      }
    },
    referencingTableById: {
      plan(_$root, args) {
        return pgResource_referencing_tablePgResource.get({
          id: args.get("id")
        });
      },
      args: {
        id: undefined
      }
    },
    letterDescription: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    referencingTable: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher2($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    allLetterDescriptions: {
      plan() {
        return connection(pgResource_letter_descriptionsPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allLetterDescriptions_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allLetterDescriptions_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allLetterDescriptions_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allLetterDescriptions_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allLetterDescriptions_after_applyPlan
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("LetterDescriptionsOrderBy"));
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
    allReferencingTables: {
      plan() {
        return connection(pgResource_referencing_tablePgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allReferencingTables_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allReferencingTables_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allReferencingTables_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allReferencingTables_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allReferencingTables_after_applyPlan
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("ReferencingTablesOrderBy"));
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
  LetterDescription: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.LetterDescription.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.LetterDescription.codec.name].encode);
    },
    id($record) {
      return $record.get("id");
    },
    letter($record) {
      return $record.get("letter");
    },
    letterViaView($record) {
      return $record.get("letter_via_view");
    },
    description($record) {
      return $record.get("description");
    }
  },
  ReferencingTable: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.ReferencingTable.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.ReferencingTable.codec.name].encode);
    },
    id($record) {
      return $record.get("id");
    },
    enum1($record) {
      return $record.get("enum_1");
    },
    enum2($record) {
      return $record.get("enum_2");
    },
    enum3($record) {
      return $record.get("enum_3");
    },
    simpleEnum($record) {
      return $record.get("simple_enum");
    }
  },
  EnumTheFirst: {
    A1: {
      value: "a1"
    },
    A2: {
      value: "a2"
    },
    A3: {
      value: "a3"
    },
    A4: {
      value: "a4"
    }
  },
  EnumTheSecond: {
    B1: {
      value: "b1"
    },
    B2: {
      value: "b2"
    },
    B3: {
      value: "b3"
    },
    B4: {
      value: "b4"
    }
  },
  LotsOfEnumsEnum3: {
    C1: {
      value: "c1"
    },
    C2: {
      value: "c2"
    },
    C3: {
      value: "c3"
    },
    C4: {
      value: "c4"
    }
  },
  SimpleEnum: {
    FOO: {
      value: "Foo"
    },
    BAR: {
      value: "Bar"
    },
    BAZ: {
      value: "Baz"
    },
    QUX: {
      value: "Qux"
    }
  },
  LetterDescriptionsConnection: {
    __assertStep: ConnectionStep,
    nodes: LetterDescriptionsConnection_nodesPlan,
    edges: LetterDescriptionsConnection_edgesPlan,
    pageInfo: LetterDescriptionsConnection_pageInfoPlan,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  LetterDescriptionsEdge: {
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
  LetterDescriptionsOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        uniques4[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_letterDescriptions_letterDescriptions.attributes[attributeName];
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
        uniques4[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_letterDescriptions_letterDescriptions.attributes[attributeName];
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
    LETTER_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "letter",
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
    LETTER_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "letter",
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
    LETTER_VIA_VIEW_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "letter_via_view",
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
    LETTER_VIA_VIEW_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "letter_via_view",
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
    DESCRIPTION_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "description",
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
    DESCRIPTION_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "description",
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
  LetterDescriptionCondition: {
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes4.id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    letter: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "letter",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "letter",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes4.letter.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    letterViaView: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "letter_via_view",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "letter_via_view",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes4.letter_via_view.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    description: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "description",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "description",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes4.description.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  ReferencingTablesConnection: {
    __assertStep: ConnectionStep,
    nodes: ReferencingTablesConnection_nodesPlan,
    edges: ReferencingTablesConnection_edgesPlan,
    pageInfo: ReferencingTablesConnection_pageInfoPlan,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  ReferencingTablesEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  ReferencingTablesOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        uniques5[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_referencingTable_referencingTable.attributes[attributeName];
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
        uniques5[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_referencingTable_referencingTable.attributes[attributeName];
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
    ENUM_1_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "enum_1",
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
    ENUM_1_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "enum_1",
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
    ENUM_2_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "enum_2",
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
    ENUM_2_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "enum_2",
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
    ENUM_3_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "enum_3",
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
    ENUM_3_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "enum_3",
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
    SIMPLE_ENUM_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "simple_enum",
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
    SIMPLE_ENUM_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "simple_enum",
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
  ReferencingTableCondition: {
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes5.id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    enum1: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "enum_1",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "enum_1",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes5.enum_1.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    enum2: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "enum_2",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "enum_2",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes5.enum_2.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    enum3: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "enum_3",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "enum_3",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes5.enum_3.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    simpleEnum: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "simple_enum",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "simple_enum",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes5.simple_enum.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  Mutation: {
    __assertStep: __ValueStep,
    referencingTableMutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs(args, ["input"]);
        const $result = resource_referencing_table_mutationPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan: Mutation_referencingTableMutation_input_applyPlan
        }
      }
    },
    createLetterDescription: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_letter_descriptionsPgResource, Object.create(null))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan: Mutation_createLetterDescription_input_applyPlan
        }
      }
    },
    createReferencingTable: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_referencing_tablePgResource, Object.create(null))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan: Mutation_createReferencingTable_input_applyPlan
        }
      }
    },
    updateLetterDescription: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_letter_descriptionsPgResource, specFromArgs(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_updateLetterDescription_input_applyPlan
        }
      }
    },
    updateLetterDescriptionById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_letter_descriptionsPgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_updateLetterDescriptionById_input_applyPlan
        }
      }
    },
    updateLetterDescriptionByLetter: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_letter_descriptionsPgResource, {
            letter: args.get(['input', "letter"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_updateLetterDescriptionByLetter_input_applyPlan
        }
      }
    },
    updateLetterDescriptionByLetterViaView: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_letter_descriptionsPgResource, {
            letter_via_view: args.get(['input', "letterViaView"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_updateLetterDescriptionByLetterViaView_input_applyPlan
        }
      }
    },
    updateReferencingTable: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_referencing_tablePgResource, specFromArgs2(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_updateReferencingTable_input_applyPlan
        }
      }
    },
    updateReferencingTableById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_referencing_tablePgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_updateReferencingTableById_input_applyPlan
        }
      }
    },
    deleteLetterDescription: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_letter_descriptionsPgResource, specFromArgs3(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_deleteLetterDescription_input_applyPlan
        }
      }
    },
    deleteLetterDescriptionById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_letter_descriptionsPgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_deleteLetterDescriptionById_input_applyPlan
        }
      }
    },
    deleteLetterDescriptionByLetter: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_letter_descriptionsPgResource, {
            letter: args.get(['input', "letter"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_deleteLetterDescriptionByLetter_input_applyPlan
        }
      }
    },
    deleteLetterDescriptionByLetterViaView: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_letter_descriptionsPgResource, {
            letter_via_view: args.get(['input', "letterViaView"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_deleteLetterDescriptionByLetterViaView_input_applyPlan
        }
      }
    },
    deleteReferencingTable: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_referencing_tablePgResource, specFromArgs4(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_deleteReferencingTable_input_applyPlan
        }
      }
    },
    deleteReferencingTableById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_referencing_tablePgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_deleteReferencingTableById_input_applyPlan
        }
      }
    }
  },
  ReferencingTableMutationPayload: {
    __assertStep: ObjectStep,
    clientMutationId: ReferencingTableMutationPayload_clientMutationIdPlan,
    integer($object) {
      return $object.get("result");
    },
    query: ReferencingTableMutationPayload_queryPlan
  },
  ReferencingTableMutationInput: {
    clientMutationId: {
      applyPlan: ReferencingTableMutationInput_clientMutationId_applyPlan,
      autoApplyAfterParentApplyPlan: true
    },
    t: undefined
  },
  ReferencingTableInput: {
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    enum1: {
      applyPlan($insert, val) {
        $insert.set("enum_1", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    enum2: {
      applyPlan($insert, val) {
        $insert.set("enum_2", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    enum3: {
      applyPlan($insert, val) {
        $insert.set("enum_3", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    simpleEnum: {
      applyPlan($insert, val) {
        $insert.set("simple_enum", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreateLetterDescriptionPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId: CreateLetterDescriptionPayload_clientMutationIdPlan,
    letterDescription: CreateLetterDescriptionPayload_letterDescriptionPlan,
    query: CreateLetterDescriptionPayload_queryPlan,
    letterDescriptionEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = uniques4[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_letter_descriptionsPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("LetterDescriptionsOrderBy"));
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
  CreateLetterDescriptionInput: {
    clientMutationId: {
      applyPlan: CreateLetterDescriptionInput_clientMutationId_applyPlan,
      autoApplyAfterParentApplyPlan: true
    },
    letterDescription: {
      applyPlan: CreateLetterDescriptionInput_letterDescription_applyPlan,
      autoApplyAfterParentApplyPlan: true
    }
  },
  LetterDescriptionInput: {
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    letter: {
      applyPlan($insert, val) {
        $insert.set("letter", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    letterViaView: {
      applyPlan($insert, val) {
        $insert.set("letter_via_view", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    description: {
      applyPlan($insert, val) {
        $insert.set("description", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreateReferencingTablePayload: {
    __assertStep: assertExecutableStep,
    clientMutationId: CreateReferencingTablePayload_clientMutationIdPlan,
    referencingTable: CreateReferencingTablePayload_referencingTablePlan,
    query: CreateReferencingTablePayload_queryPlan,
    referencingTableEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = uniques5[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_referencing_tablePgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("ReferencingTablesOrderBy"));
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
  CreateReferencingTableInput: {
    clientMutationId: {
      applyPlan: CreateReferencingTableInput_clientMutationId_applyPlan,
      autoApplyAfterParentApplyPlan: true
    },
    referencingTable: {
      applyPlan: CreateReferencingTableInput_referencingTable_applyPlan,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateLetterDescriptionPayload: {
    __assertStep: ObjectStep,
    clientMutationId: UpdateLetterDescriptionPayload_clientMutationIdPlan,
    letterDescription: UpdateLetterDescriptionPayload_letterDescriptionPlan,
    query: UpdateLetterDescriptionPayload_queryPlan,
    letterDescriptionEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = uniques4[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_letter_descriptionsPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("LetterDescriptionsOrderBy"));
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
  UpdateLetterDescriptionInput: {
    clientMutationId: {
      applyPlan: UpdateLetterDescriptionInput_clientMutationId_applyPlan
    },
    nodeId: undefined,
    letterDescriptionPatch: {
      applyPlan: UpdateLetterDescriptionInput_letterDescriptionPatch_applyPlan
    }
  },
  LetterDescriptionPatch: {
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    letter: {
      applyPlan($insert, val) {
        $insert.set("letter", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    letterViaView: {
      applyPlan($insert, val) {
        $insert.set("letter_via_view", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    description: {
      applyPlan($insert, val) {
        $insert.set("description", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateLetterDescriptionByIdInput: {
    clientMutationId: {
      applyPlan: UpdateLetterDescriptionByIdInput_clientMutationId_applyPlan
    },
    id: undefined,
    letterDescriptionPatch: {
      applyPlan: UpdateLetterDescriptionByIdInput_letterDescriptionPatch_applyPlan
    }
  },
  UpdateLetterDescriptionByLetterInput: {
    clientMutationId: {
      applyPlan: UpdateLetterDescriptionByLetterInput_clientMutationId_applyPlan
    },
    letter: undefined,
    letterDescriptionPatch: {
      applyPlan: UpdateLetterDescriptionByLetterInput_letterDescriptionPatch_applyPlan
    }
  },
  UpdateLetterDescriptionByLetterViaViewInput: {
    clientMutationId: {
      applyPlan: UpdateLetterDescriptionByLetterViaViewInput_clientMutationId_applyPlan
    },
    letterViaView: undefined,
    letterDescriptionPatch: {
      applyPlan: UpdateLetterDescriptionByLetterViaViewInput_letterDescriptionPatch_applyPlan
    }
  },
  UpdateReferencingTablePayload: {
    __assertStep: ObjectStep,
    clientMutationId: UpdateReferencingTablePayload_clientMutationIdPlan,
    referencingTable: UpdateReferencingTablePayload_referencingTablePlan,
    query: UpdateReferencingTablePayload_queryPlan,
    referencingTableEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = uniques5[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_referencing_tablePgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("ReferencingTablesOrderBy"));
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
  UpdateReferencingTableInput: {
    clientMutationId: {
      applyPlan: UpdateReferencingTableInput_clientMutationId_applyPlan
    },
    nodeId: undefined,
    referencingTablePatch: {
      applyPlan: UpdateReferencingTableInput_referencingTablePatch_applyPlan
    }
  },
  ReferencingTablePatch: {
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    enum1: {
      applyPlan($insert, val) {
        $insert.set("enum_1", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    enum2: {
      applyPlan($insert, val) {
        $insert.set("enum_2", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    enum3: {
      applyPlan($insert, val) {
        $insert.set("enum_3", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    simpleEnum: {
      applyPlan($insert, val) {
        $insert.set("simple_enum", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateReferencingTableByIdInput: {
    clientMutationId: {
      applyPlan: UpdateReferencingTableByIdInput_clientMutationId_applyPlan
    },
    id: undefined,
    referencingTablePatch: {
      applyPlan: UpdateReferencingTableByIdInput_referencingTablePatch_applyPlan
    }
  },
  DeleteLetterDescriptionPayload: {
    __assertStep: ObjectStep,
    clientMutationId: DeleteLetterDescriptionPayload_clientMutationIdPlan,
    letterDescription: DeleteLetterDescriptionPayload_letterDescriptionPlan,
    deletedLetterDescriptionId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.LetterDescription.plan($record);
      return lambda(specifier, nodeIdCodecs.base64JSON.encode);
    },
    query: DeleteLetterDescriptionPayload_queryPlan,
    letterDescriptionEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = uniques4[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_letter_descriptionsPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("LetterDescriptionsOrderBy"));
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
  DeleteLetterDescriptionInput: {
    clientMutationId: {
      applyPlan: DeleteLetterDescriptionInput_clientMutationId_applyPlan
    },
    nodeId: undefined
  },
  DeleteLetterDescriptionByIdInput: {
    clientMutationId: {
      applyPlan: DeleteLetterDescriptionByIdInput_clientMutationId_applyPlan
    },
    id: undefined
  },
  DeleteLetterDescriptionByLetterInput: {
    clientMutationId: {
      applyPlan: DeleteLetterDescriptionByLetterInput_clientMutationId_applyPlan
    },
    letter: undefined
  },
  DeleteLetterDescriptionByLetterViaViewInput: {
    clientMutationId: {
      applyPlan: DeleteLetterDescriptionByLetterViaViewInput_clientMutationId_applyPlan
    },
    letterViaView: undefined
  },
  DeleteReferencingTablePayload: {
    __assertStep: ObjectStep,
    clientMutationId: DeleteReferencingTablePayload_clientMutationIdPlan,
    referencingTable: DeleteReferencingTablePayload_referencingTablePlan,
    deletedReferencingTableId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.ReferencingTable.plan($record);
      return lambda(specifier, nodeIdCodecs.base64JSON.encode);
    },
    query: DeleteReferencingTablePayload_queryPlan,
    referencingTableEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = uniques5[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_referencing_tablePgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("ReferencingTablesOrderBy"));
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
  DeleteReferencingTableInput: {
    clientMutationId: {
      applyPlan: DeleteReferencingTableInput_clientMutationId_applyPlan
    },
    nodeId: undefined
  },
  DeleteReferencingTableByIdInput: {
    clientMutationId: {
      applyPlan: DeleteReferencingTableByIdInput_clientMutationId_applyPlan
    },
    id: undefined
  }
};
export const schema = makeGrafastSchema({
  typeDefs: typeDefs,
  plans: plans
});
