import { PgDeleteSingleStep, PgExecutor, PgSelectStep, TYPES, assertPgClassSingleStep, enumCodec, makeRegistry, pgDeleteSingle, pgInsertSingle, pgSelectFromRecord, pgUpdateSingle, recordCodec, sqlFromArgDigests, sqlValueWithCodec } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ObjectStep, __ValueStep, access, assertEdgeCapableStep, assertExecutableStep, assertPageInfoCapableStep, bakedInput, bakedInputRuntime, connection, constant, context, createObjectAndApplyChildren, first, get as get2, inhibitOnNull, inspect, lambda, list, makeDecodeNodeId, makeGrafastSchema, object, rootValue, specFromNodeId } from "grafast";
import { GraphQLError, Kind } from "graphql";
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
const abcdIdentifier = sql.identifier("enum_tables", "abcd");
const abcdCodec = recordCodec({
  name: "abcd",
  identifier: abcdIdentifier,
  attributes: {
    __proto__: null,
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
  },
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "enum_tables",
      name: "abcd"
    },
    tags: {
      __proto__: null,
      enum: true,
      enumName: "LetterAToD"
    }
  },
  executor: executor
});
const abcdViewIdentifier = sql.identifier("enum_tables", "abcd_view");
const abcdViewCodec = recordCodec({
  name: "abcdView",
  identifier: abcdViewIdentifier,
  attributes: {
    __proto__: null,
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
  },
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "enum_tables",
      name: "abcd_view"
    },
    tags: {
      __proto__: null,
      primaryKey: "letter",
      enum: true,
      enumName: "LetterAToDViaView"
    }
  },
  executor: executor
});
const simpleEnumIdentifier = sql.identifier("enum_tables", "simple_enum");
const simpleEnumCodec = recordCodec({
  name: "simpleEnum",
  identifier: simpleEnumIdentifier,
  attributes: {
    __proto__: null,
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
  },
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "enum_tables",
      name: "simple_enum"
    },
    tags: {
      __proto__: null,
      enum: true
    }
  },
  executor: executor
});
const letterDescriptionsIdentifier = sql.identifier("enum_tables", "letter_descriptions");
const spec_letterDescriptions_attributes_letter_codec_LetterAToDEnum = enumCodec({
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
    tags: {
      name: "LetterAToD"
    }
  }
});
const spec_letterDescriptions_attributes_letter_via_view_codec_LetterAToDViaViewEnum = enumCodec({
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
    tags: {
      name: "LetterAToDViaView"
    }
  }
});
const letterDescriptionsCodec = recordCodec({
  name: "letterDescriptions",
  identifier: letterDescriptionsIdentifier,
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
    letter: {
      description: undefined,
      codec: spec_letterDescriptions_attributes_letter_codec_LetterAToDEnum,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    letter_via_view: {
      description: undefined,
      codec: spec_letterDescriptions_attributes_letter_via_view_codec_LetterAToDViaViewEnum,
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
  },
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "enum_tables",
      name: "letter_descriptions"
    },
    tags: {
      __proto__: null,
      foreignKey: "(letter_via_view) references enum_tables.abcd_view"
    }
  },
  executor: executor
});
const referencingTableIdentifier = sql.identifier("enum_tables", "referencing_table");
const spec_referencingTable_attributes_enum_1_codec_EnumTheFirstEnum = enumCodec({
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
    tags: {
      name: "EnumTheFirst"
    }
  }
});
const spec_referencingTable_attributes_enum_2_codec_EnumTheSecondEnum = enumCodec({
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
    tags: {
      name: "EnumTheSecond"
    }
  }
});
const spec_referencingTable_attributes_enum_3_codec_LotsOfEnumsEnum3Enum = enumCodec({
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
    tags: {
      name: "LotsOfEnumsEnum3"
    }
  }
});
const spec_referencingTable_attributes_simple_enum_codec_SimpleEnumEnum = enumCodec({
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
    tags: {
      name: "SimpleEnum"
    }
  }
});
const referencingTableCodec = recordCodec({
  name: "referencingTable",
  identifier: referencingTableIdentifier,
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
    enum_1: {
      description: undefined,
      codec: spec_referencingTable_attributes_enum_1_codec_EnumTheFirstEnum,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    enum_2: {
      description: undefined,
      codec: spec_referencingTable_attributes_enum_2_codec_EnumTheSecondEnum,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    enum_3: {
      description: undefined,
      codec: spec_referencingTable_attributes_enum_3_codec_LotsOfEnumsEnum3Enum,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    simple_enum: {
      description: undefined,
      codec: spec_referencingTable_attributes_simple_enum_codec_SimpleEnumEnum,
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
      schemaName: "enum_tables",
      name: "referencing_table"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const lotsOfEnumsIdentifier = sql.identifier("enum_tables", "lots_of_enums");
const spec_lotsOfEnums = {
  name: "lotsOfEnums",
  identifier: lotsOfEnumsIdentifier,
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
  },
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "enum_tables",
      name: "lots_of_enums"
    },
    tags: {
      __proto__: null,
      omit: true,
      behavior: ["-insert -select -node -connection -list -array -single -update -delete -queryField -mutationField -typeField -filter -filterBy -order -orderBy -query:resource:list -query:resource:connection -singularRelation:resource:list -singularRelation:resource:connection -manyRelation:resource:list -manyRelation:resource:connection -manyToMany"]
    }
  },
  executor: executor
};
const lotsOfEnumsCodec = recordCodec(spec_lotsOfEnums);
const registryConfig_pgResources_abcd_abcd = {
  executor: executor,
  name: "abcd",
  identifier: "main.enum_tables.abcd",
  from: abcdIdentifier,
  codec: abcdCodec,
  uniques: [{
    isPrimary: true,
    attributes: ["letter"],
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
      schemaName: "enum_tables",
      name: "abcd"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {
      enum: true,
      enumName: "LetterAToD"
    }
  }
};
const registryConfig_pgResources_abcd_view_abcd_view = {
  executor: executor,
  name: "abcd_view",
  identifier: "main.enum_tables.abcd_view",
  from: abcdViewIdentifier,
  codec: abcdViewCodec,
  uniques: [{
    isPrimary: true,
    attributes: ["letter"],
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
      schemaName: "enum_tables",
      name: "abcd_view"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {
      primaryKey: "letter",
      enum: true,
      enumName: "LetterAToDViaView"
    }
  }
};
const registryConfig_pgResources_simple_enum_simple_enum = {
  executor: executor,
  name: "simple_enum",
  identifier: "main.enum_tables.simple_enum",
  from: simpleEnumIdentifier,
  codec: simpleEnumCodec,
  uniques: [{
    isPrimary: true,
    attributes: ["value"],
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
      schemaName: "enum_tables",
      name: "simple_enum"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {
      enum: true
    }
  }
};
const referencing_table_mutationFunctionIdentifer = sql.identifier("enum_tables", "referencing_table_mutation");
const letter_descriptionsUniques = [{
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
  attributes: ["letter"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}, {
  isPrimary: false,
  attributes: ["letter_via_view"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const registryConfig_pgResources_letter_descriptions_letter_descriptions = {
  executor: executor,
  name: "letter_descriptions",
  identifier: "main.enum_tables.letter_descriptions",
  from: letterDescriptionsIdentifier,
  codec: letterDescriptionsCodec,
  uniques: letter_descriptionsUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "enum_tables",
      name: "letter_descriptions"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {
      foreignKey: "(letter_via_view) references enum_tables.abcd_view"
    }
  }
};
const referencing_tableUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const registryConfig_pgResources_referencing_table_referencing_table = {
  executor: executor,
  name: "referencing_table",
  identifier: "main.enum_tables.referencing_table",
  from: referencingTableIdentifier,
  codec: referencingTableCodec,
  uniques: referencing_tableUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "enum_tables",
      name: "referencing_table"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {}
  }
};
const registryConfig_pgResources_lots_of_enums_lots_of_enums = {
  executor: executor,
  name: "lots_of_enums",
  identifier: "main.enum_tables.lots_of_enums",
  from: lotsOfEnumsIdentifier,
  codec: lotsOfEnumsCodec,
  uniques: [{
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
    attributes: ["enum_1"],
    description: undefined,
    extensions: {
      tags: {
        __proto__: null,
        enum: true,
        enumName: "EnumTheFirst"
      }
    }
  }, {
    isPrimary: false,
    attributes: ["enum_2"],
    description: undefined,
    extensions: {
      tags: {
        __proto__: null,
        enum: true,
        enumName: "EnumTheSecond"
      }
    }
  }, {
    isPrimary: false,
    attributes: ["enum_3"],
    description: undefined,
    extensions: {
      tags: {
        __proto__: null,
        enum: true
      }
    }
  }, {
    isPrimary: false,
    attributes: ["enum_4"],
    description: undefined,
    extensions: {
      tags: {
        __proto__: null,
        enum: true
      }
    }
  }],
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "enum_tables",
      name: "lots_of_enums"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {
      omit: true,
      behavior: spec_lotsOfEnums.extensions.tags.behavior
    }
  }
};
const registry = makeRegistry({
  pgExecutors: {
    __proto__: null,
    main: executor
  },
  pgCodecs: {
    __proto__: null,
    abcd: abcdCodec,
    text: TYPES.text,
    abcdView: abcdViewCodec,
    simpleEnum: simpleEnumCodec,
    int4: TYPES.int,
    letterDescriptions: letterDescriptionsCodec,
    LetterAToDEnum: spec_letterDescriptions_attributes_letter_codec_LetterAToDEnum,
    LetterAToDViaViewEnum: spec_letterDescriptions_attributes_letter_via_view_codec_LetterAToDViaViewEnum,
    referencingTable: referencingTableCodec,
    EnumTheFirstEnum: spec_referencingTable_attributes_enum_1_codec_EnumTheFirstEnum,
    EnumTheSecondEnum: spec_referencingTable_attributes_enum_2_codec_EnumTheSecondEnum,
    LotsOfEnumsEnum3Enum: spec_referencingTable_attributes_enum_3_codec_LotsOfEnumsEnum3Enum,
    SimpleEnumEnum: spec_referencingTable_attributes_simple_enum_codec_SimpleEnumEnum,
    lotsOfEnums: lotsOfEnumsCodec,
    varchar: TYPES.varchar,
    bpchar: TYPES.bpchar
  },
  pgResources: {
    __proto__: null,
    abcd: registryConfig_pgResources_abcd_abcd,
    abcd_view: registryConfig_pgResources_abcd_view_abcd_view,
    simple_enum: registryConfig_pgResources_simple_enum_simple_enum,
    referencing_table_mutation: {
      executor,
      name: "referencing_table_mutation",
      identifier: "main.enum_tables.referencing_table_mutation(enum_tables.referencing_table)",
      from(...args) {
        return sql`${referencing_table_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "t",
        required: true,
        notNull: false,
        codec: referencingTableCodec
      }],
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: true,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "enum_tables",
          name: "referencing_table_mutation"
        },
        tags: {}
      },
      description: undefined
    },
    letter_descriptions: registryConfig_pgResources_letter_descriptions_letter_descriptions,
    referencing_table: registryConfig_pgResources_referencing_table_referencing_table,
    lots_of_enums: registryConfig_pgResources_lots_of_enums_lots_of_enums
  },
  pgRelations: {
    __proto__: null,
    abcd: {
      __proto__: null,
      letterDescriptionsByTheirLetter: {
        localCodec: abcdCodec,
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
    },
    abcdView: {
      __proto__: null,
      letterDescriptionsByTheirLetterViaView: {
        localCodec: abcdViewCodec,
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
    },
    letterDescriptions: {
      __proto__: null,
      abcdViewByMyLetterViaView: {
        localCodec: letterDescriptionsCodec,
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
        localCodec: letterDescriptionsCodec,
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
    },
    lotsOfEnums: {
      __proto__: null,
      referencingTablesByTheirEnum1: {
        localCodec: lotsOfEnumsCodec,
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
        localCodec: lotsOfEnumsCodec,
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
        localCodec: lotsOfEnumsCodec,
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
    },
    referencingTable: {
      __proto__: null,
      lotsOfEnumsByMyEnum1: {
        localCodec: referencingTableCodec,
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
        localCodec: referencingTableCodec,
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
        localCodec: referencingTableCodec,
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
        localCodec: referencingTableCodec,
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
    },
    simpleEnum: {
      __proto__: null,
      referencingTablesByTheirSimpleEnum: {
        localCodec: simpleEnumCodec,
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
    }
  }
});
const resource_letter_descriptionsPgResource = registry.pgResources["letter_descriptions"];
const resource_referencing_tablePgResource = registry.pgResources["referencing_table"];
const nodeIdHandler_LetterDescription = {
  typeName: "LetterDescription",
  codec: nodeIdCodecs_base64JSON_base64JSON,
  deprecationReason: undefined,
  plan($record) {
    return list([constant("letter_descriptions", false), $record.get("id")]);
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
    return resource_letter_descriptionsPgResource.get(spec);
  },
  match(obj) {
    return obj[0] === "letter_descriptions";
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
const nodeFetcher_LetterDescription = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_LetterDescription));
  return nodeIdHandler_LetterDescription.get(nodeIdHandler_LetterDescription.getSpec(inhibitOnNull($decoded)));
};
const nodeIdHandler_ReferencingTable = {
  typeName: "ReferencingTable",
  codec: nodeIdCodecs_base64JSON_base64JSON,
  deprecationReason: undefined,
  plan($record) {
    return list([constant("referencing_tables", false), $record.get("id")]);
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
    return resource_referencing_tablePgResource.get(spec);
  },
  match(obj) {
    return obj[0] === "referencing_tables";
  }
};
const nodeFetcher_ReferencingTable = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_ReferencingTable));
  return nodeIdHandler_ReferencingTable.get(nodeIdHandler_ReferencingTable.getSpec(inhibitOnNull($decoded)));
};
function qbWhereBuilder(qb) {
  return qb.whereBuilder();
}
const nodeIdHandlerByTypeName = {
  __proto__: null,
  Query: nodeIdHandler_Query,
  LetterDescription: nodeIdHandler_LetterDescription,
  ReferencingTable: nodeIdHandler_ReferencingTable
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
function CursorSerialize(value) {
  return "" + value;
}
const argDetailsSimple_referencing_table_mutation = [{
  graphqlArgName: "t",
  postgresArgName: "t",
  pgCodec: referencingTableCodec,
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
const makeArgs_referencing_table_mutation = (args, path = []) => argDetailsSimple_referencing_table_mutation.map(details => makeArg(path, args, details));
const resource_referencing_table_mutationPgResource = registry.pgResources["referencing_table_mutation"];
const specFromArgs_LetterDescription = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_LetterDescription, inhibitOnNull($nodeId));
};
const specFromArgs_ReferencingTable = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_ReferencingTable, inhibitOnNull($nodeId));
};
const specFromArgs_LetterDescription2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_LetterDescription, inhibitOnNull($nodeId));
};
const specFromArgs_ReferencingTable2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_ReferencingTable, inhibitOnNull($nodeId));
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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: LetterDescriptionCondition

    """The method to use when ordering \`LetterDescription\`."""
    orderBy: [LetterDescriptionsOrderBy!] = [PRIMARY_KEY_ASC]
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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: ReferencingTableCondition

    """The method to use when ordering \`ReferencingTable\`."""
    orderBy: [ReferencingTablesOrderBy!] = [PRIMARY_KEY_ASC]
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
    letterDescriptionById(_$root, {
      $id
    }) {
      return resource_letter_descriptionsPgResource.get({
        id: $id
      });
    },
    letterDescriptionByLetter(_$root, {
      $letter
    }) {
      return resource_letter_descriptionsPgResource.get({
        letter: $letter
      });
    },
    letterDescriptionByLetterViaView(_$root, {
      $letterViaView
    }) {
      return resource_letter_descriptionsPgResource.get({
        letter_via_view: $letterViaView
      });
    },
    referencingTableById(_$root, {
      $id
    }) {
      return resource_referencing_tablePgResource.get({
        id: $id
      });
    },
    letterDescription(_$parent, args) {
      const $nodeId = args.getRaw("nodeId");
      return nodeFetcher_LetterDescription($nodeId);
    },
    referencingTable(_$parent, args) {
      const $nodeId = args.getRaw("nodeId");
      return nodeFetcher_ReferencingTable($nodeId);
    },
    allLetterDescriptions: {
      plan() {
        return connection(resource_letter_descriptionsPgResource.find());
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
    allReferencingTables: {
      plan() {
        return connection(resource_referencing_tablePgResource.find());
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
  LetterDescription: {
    __assertStep: assertPgClassSingleStep,
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of letter_descriptionsUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_letter_descriptionsPgResource.get(spec);
    },
    nodeId($parent) {
      const specifier = nodeIdHandler_LetterDescription.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandler_LetterDescription.codec.name].encode);
    },
    letterViaView($record) {
      return $record.get("letter_via_view");
    }
  },
  ReferencingTable: {
    __assertStep: assertPgClassSingleStep,
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of referencing_tableUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_referencing_tablePgResource.get(spec);
    },
    nodeId($parent) {
      const specifier = nodeIdHandler_ReferencingTable.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandler_ReferencingTable.codec.name].encode);
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
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
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
  Cursor: {
    serialize: CursorSerialize,
    parseValue: CursorSerialize,
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
  LetterDescriptionCondition: {
    id($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "id",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    },
    letter($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "letter",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, spec_letterDescriptions_attributes_letter_codec_LetterAToDEnum)}`;
        }
      });
    },
    letterViaView($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "letter_via_view",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, spec_letterDescriptions_attributes_letter_via_view_codec_LetterAToDViaViewEnum)}`;
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
    }
  },
  LetterDescriptionsOrderBy: {
    PRIMARY_KEY_ASC(queryBuilder) {
      letter_descriptionsUniques[0].attributes.forEach(attributeName => {
        queryBuilder.orderBy({
          attribute: attributeName,
          direction: "ASC"
        });
      });
      queryBuilder.setOrderIsUnique();
    },
    PRIMARY_KEY_DESC(queryBuilder) {
      letter_descriptionsUniques[0].attributes.forEach(attributeName => {
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
    LETTER_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "letter",
        direction: "ASC"
      });
      queryBuilder.setOrderIsUnique();
    },
    LETTER_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "letter",
        direction: "DESC"
      });
      queryBuilder.setOrderIsUnique();
    },
    LETTER_VIA_VIEW_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "letter_via_view",
        direction: "ASC"
      });
      queryBuilder.setOrderIsUnique();
    },
    LETTER_VIA_VIEW_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "letter_via_view",
        direction: "DESC"
      });
      queryBuilder.setOrderIsUnique();
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
    }
  },
  ReferencingTablesConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
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
  ReferencingTableCondition: {
    id($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "id",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    },
    enum1($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "enum_1",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, spec_referencingTable_attributes_enum_1_codec_EnumTheFirstEnum)}`;
        }
      });
    },
    enum2($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "enum_2",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, spec_referencingTable_attributes_enum_2_codec_EnumTheSecondEnum)}`;
        }
      });
    },
    enum3($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "enum_3",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, spec_referencingTable_attributes_enum_3_codec_LotsOfEnumsEnum3Enum)}`;
        }
      });
    },
    simpleEnum($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "simple_enum",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, spec_referencingTable_attributes_simple_enum_codec_SimpleEnumEnum)}`;
        }
      });
    }
  },
  ReferencingTablesOrderBy: {
    PRIMARY_KEY_ASC(queryBuilder) {
      referencing_tableUniques[0].attributes.forEach(attributeName => {
        queryBuilder.orderBy({
          attribute: attributeName,
          direction: "ASC"
        });
      });
      queryBuilder.setOrderIsUnique();
    },
    PRIMARY_KEY_DESC(queryBuilder) {
      referencing_tableUniques[0].attributes.forEach(attributeName => {
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
    ENUM_1_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "enum_1",
        direction: "ASC"
      });
    },
    ENUM_1_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "enum_1",
        direction: "DESC"
      });
    },
    ENUM_2_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "enum_2",
        direction: "ASC"
      });
    },
    ENUM_2_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "enum_2",
        direction: "DESC"
      });
    },
    ENUM_3_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "enum_3",
        direction: "ASC"
      });
    },
    ENUM_3_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "enum_3",
        direction: "DESC"
      });
    },
    SIMPLE_ENUM_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "simple_enum",
        direction: "ASC"
      });
    },
    SIMPLE_ENUM_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "simple_enum",
        direction: "DESC"
      });
    }
  },
  Mutation: {
    __assertStep: __ValueStep,
    referencingTableMutation: {
      plan($root, args, _info) {
        const selectArgs = makeArgs_referencing_table_mutation(args, ["input"]);
        const $result = resource_referencing_table_mutationPgResource.execute(selectArgs, "mutation");
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
    createLetterDescription: {
      plan(_, args) {
        const $insert = pgInsertSingle(resource_letter_descriptionsPgResource, Object.create(null));
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
    createReferencingTable: {
      plan(_, args) {
        const $insert = pgInsertSingle(resource_referencing_tablePgResource, Object.create(null));
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
    updateLetterDescription: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(resource_letter_descriptionsPgResource, specFromArgs_LetterDescription(args));
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
    updateLetterDescriptionById: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(resource_letter_descriptionsPgResource, {
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
    updateLetterDescriptionByLetter: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(resource_letter_descriptionsPgResource, {
          letter: args.getRaw(['input', "letter"])
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
    updateLetterDescriptionByLetterViaView: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(resource_letter_descriptionsPgResource, {
          letter_via_view: args.getRaw(['input', "letterViaView"])
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
    updateReferencingTable: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(resource_referencing_tablePgResource, specFromArgs_ReferencingTable(args));
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
    updateReferencingTableById: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(resource_referencing_tablePgResource, {
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
    deleteLetterDescription: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(resource_letter_descriptionsPgResource, specFromArgs_LetterDescription2(args));
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
    deleteLetterDescriptionById: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(resource_letter_descriptionsPgResource, {
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
    deleteLetterDescriptionByLetter: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(resource_letter_descriptionsPgResource, {
          letter: args.getRaw(['input', "letter"])
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
    deleteLetterDescriptionByLetterViaView: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(resource_letter_descriptionsPgResource, {
          letter_via_view: args.getRaw(['input', "letterViaView"])
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
    deleteReferencingTable: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(resource_referencing_tablePgResource, specFromArgs_ReferencingTable2(args));
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
    deleteReferencingTableById: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(resource_referencing_tablePgResource, {
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
  ReferencingTableMutationPayload: {
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
  ReferencingTableMutationInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  ReferencingTableInput: {
    __baked: createObjectAndApplyChildren,
    id(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    enum1(obj, val, {
      field,
      schema
    }) {
      obj.set("enum_1", bakedInputRuntime(schema, field.type, val));
    },
    enum2(obj, val, {
      field,
      schema
    }) {
      obj.set("enum_2", bakedInputRuntime(schema, field.type, val));
    },
    enum3(obj, val, {
      field,
      schema
    }) {
      obj.set("enum_3", bakedInputRuntime(schema, field.type, val));
    },
    simpleEnum(obj, val, {
      field,
      schema
    }) {
      obj.set("simple_enum", bakedInputRuntime(schema, field.type, val));
    }
  },
  CreateLetterDescriptionPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    letterDescription($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    letterDescriptionEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = letter_descriptionsUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_letter_descriptionsPgResource.find(spec);
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
  CreateLetterDescriptionInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    letterDescription(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  LetterDescriptionInput: {
    __baked: createObjectAndApplyChildren,
    id(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    letter(obj, val, {
      field,
      schema
    }) {
      obj.set("letter", bakedInputRuntime(schema, field.type, val));
    },
    letterViaView(obj, val, {
      field,
      schema
    }) {
      obj.set("letter_via_view", bakedInputRuntime(schema, field.type, val));
    },
    description(obj, val, {
      field,
      schema
    }) {
      obj.set("description", bakedInputRuntime(schema, field.type, val));
    }
  },
  CreateReferencingTablePayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    referencingTable($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    referencingTableEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = referencing_tableUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_referencing_tablePgResource.find(spec);
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
  CreateReferencingTableInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    referencingTable(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UpdateLetterDescriptionPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    letterDescription($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    letterDescriptionEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = letter_descriptionsUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_letter_descriptionsPgResource.find(spec);
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
  UpdateLetterDescriptionInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    letterDescriptionPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  LetterDescriptionPatch: {
    __baked: createObjectAndApplyChildren,
    id(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    letter(obj, val, {
      field,
      schema
    }) {
      obj.set("letter", bakedInputRuntime(schema, field.type, val));
    },
    letterViaView(obj, val, {
      field,
      schema
    }) {
      obj.set("letter_via_view", bakedInputRuntime(schema, field.type, val));
    },
    description(obj, val, {
      field,
      schema
    }) {
      obj.set("description", bakedInputRuntime(schema, field.type, val));
    }
  },
  UpdateLetterDescriptionByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    letterDescriptionPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UpdateLetterDescriptionByLetterInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    letterDescriptionPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UpdateLetterDescriptionByLetterViaViewInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    letterDescriptionPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UpdateReferencingTablePayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    referencingTable($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    referencingTableEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = referencing_tableUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_referencing_tablePgResource.find(spec);
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
  UpdateReferencingTableInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    referencingTablePatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  ReferencingTablePatch: {
    __baked: createObjectAndApplyChildren,
    id(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    enum1(obj, val, {
      field,
      schema
    }) {
      obj.set("enum_1", bakedInputRuntime(schema, field.type, val));
    },
    enum2(obj, val, {
      field,
      schema
    }) {
      obj.set("enum_2", bakedInputRuntime(schema, field.type, val));
    },
    enum3(obj, val, {
      field,
      schema
    }) {
      obj.set("enum_3", bakedInputRuntime(schema, field.type, val));
    },
    simpleEnum(obj, val, {
      field,
      schema
    }) {
      obj.set("simple_enum", bakedInputRuntime(schema, field.type, val));
    }
  },
  UpdateReferencingTableByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    referencingTablePatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  DeleteLetterDescriptionPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    letterDescription($object) {
      return $object.get("result");
    },
    deletedLetterDescriptionId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandler_LetterDescription.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    letterDescriptionEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = letter_descriptionsUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_letter_descriptionsPgResource.find(spec);
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
  DeleteLetterDescriptionInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteLetterDescriptionByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteLetterDescriptionByLetterInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteLetterDescriptionByLetterViaViewInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteReferencingTablePayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    referencingTable($object) {
      return $object.get("result");
    },
    deletedReferencingTableId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandler_ReferencingTable.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    referencingTableEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = referencing_tableUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_referencing_tablePgResource.find(spec);
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
  DeleteReferencingTableInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteReferencingTableByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  }
};
export const schema = makeGrafastSchema({
  typeDefs: typeDefs,
  plans: plans
});
