import { PgDeleteSingleStep, PgExecutor, PgSelectStep, PgUnionAllStep, TYPES, assertPgClassSingleStep, enumCodec, makeRegistry, pgDeleteSingle, pgInsertSingle, pgSelectFromRecord, pgUpdateSingle, recordCodec, sqlFromArgDigests } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ObjectStep, SafeError, __ValueStep, access, assertEdgeCapableStep, assertExecutableStep, assertPageInfoCapableStep, connection, constant, context, first, getEnumValueConfig, inhibitOnNull, lambda, list, makeGrafastSchema, node, object, rootValue, specFromNodeId } from "grafast";
import { GraphQLError, Kind } from "graphql";
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
const abcdIdentifier = sql.identifier("enum_tables", "abcd");
const abcdCodec = recordCodec({
  name: "abcd",
  identifier: abcdIdentifier,
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
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "enum_tables",
      name: "abcd"
    },
    tags: Object.assign(Object.create(null), {
      enum: true,
      enumName: "LetterAToD"
    })
  },
  executor: executor
});
const abcdViewIdentifier = sql.identifier("enum_tables", "abcd_view");
const abcdViewCodec = recordCodec({
  name: "abcdView",
  identifier: abcdViewIdentifier,
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
        tags: {}
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "enum_tables",
      name: "abcd_view"
    },
    tags: Object.assign(Object.create(null), {
      primaryKey: "letter",
      enum: true,
      enumName: "LetterAToDViaView"
    })
  },
  executor: executor
});
const simpleEnumIdentifier = sql.identifier("enum_tables", "simple_enum");
const simpleEnumCodec = recordCodec({
  name: "simpleEnum",
  identifier: simpleEnumIdentifier,
  attributes: Object.assign(Object.create(null), {
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
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "enum_tables",
      name: "simple_enum"
    },
    tags: Object.assign(Object.create(null), {
      enum: true
    })
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
const spec_letterDescriptions = {
  name: "letterDescriptions",
  identifier: letterDescriptionsIdentifier,
  attributes: Object.assign(Object.create(null), {
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
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "enum_tables",
      name: "letter_descriptions"
    },
    tags: Object.assign(Object.create(null), {
      foreignKey: "(letter_via_view) references enum_tables.abcd_view"
    })
  },
  executor: executor
};
const letterDescriptionsCodec = recordCodec(spec_letterDescriptions);
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
const spec_referencingTable = {
  name: "referencingTable",
  identifier: referencingTableIdentifier,
  attributes: Object.assign(Object.create(null), {
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
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "enum_tables",
      name: "referencing_table"
    },
    tags: Object.create(null)
  },
  executor: executor
};
const referencingTableCodec = recordCodec(spec_referencingTable);
const lotsOfEnumsIdentifier = sql.identifier("enum_tables", "lots_of_enums");
const spec_lotsOfEnums = {
  name: "lotsOfEnums",
  identifier: lotsOfEnumsIdentifier,
  attributes: Object.assign(Object.create(null), {
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
  }),
  description: undefined,
  extensions: {
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
      tags: Object.create(null)
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
      tags: Object.create(null)
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
      tags: Object.create(null)
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
    tags: Object.create(null)
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
  pgExecutors: Object.assign(Object.create(null), {
    main: executor
  }),
  pgCodecs: Object.assign(Object.create(null), {
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
  }),
  pgResources: Object.assign(Object.create(null), {
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
  }),
  pgRelations: Object.assign(Object.create(null), {
    abcd: Object.assign(Object.create(null), {
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
    }),
    abcdView: Object.assign(Object.create(null), {
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
    }),
    letterDescriptions: Object.assign(Object.create(null), {
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
    }),
    lotsOfEnums: Object.assign(Object.create(null), {
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
    }),
    referencingTable: Object.assign(Object.create(null), {
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
    }),
    simpleEnum: Object.assign(Object.create(null), {
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
    })
  })
});
const pgResource_letter_descriptionsPgResource = registry.pgResources["letter_descriptions"];
const pgResource_referencing_tablePgResource = registry.pgResources["referencing_table"];
const nodeIdHandlerByTypeName = Object.assign(Object.create(null), {
  Query: handler,
  LetterDescription: {
    typeName: "LetterDescription",
    codec: nodeIdCodecs_base64JSON_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("letter_descriptions", false), $record.get("id")]);
    },
    getSpec($list) {
      return {
        id: inhibitOnNull(access($list, [1]))
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
    codec: nodeIdCodecs_base64JSON_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("referencing_tables", false), $record.get("id")]);
    },
    getSpec($list) {
      return {
        id: inhibitOnNull(access($list, [1]))
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
function CursorSerialize(value) {
  return "" + value;
}
const argDetailsSimple = [{
  graphqlArgName: "t",
  postgresArgName: "t",
  pgCodec: referencingTableCodec,
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
const specFromArgs = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.LetterDescription, $nodeId);
};
const specFromArgs2 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.ReferencingTable, $nodeId);
};
const specFromArgs3 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.LetterDescription, $nodeId);
};
const specFromArgs4 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.ReferencingTable, $nodeId);
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
  LetterDescriptionsOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        letter_descriptionsUniques[0].attributes.forEach(attributeName => {
          const attribute = letterDescriptionsCodec.attributes[attributeName];
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
        letter_descriptionsUniques[0].attributes.forEach(attributeName => {
          const attribute = letterDescriptionsCodec.attributes[attributeName];
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_letterDescriptions.attributes.id.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_letterDescriptions.attributes.letter.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_letterDescriptions.attributes.letter_via_view.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_letterDescriptions.attributes.description.codec)}`;
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
        referencing_tableUniques[0].attributes.forEach(attributeName => {
          const attribute = referencingTableCodec.attributes[attributeName];
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
        referencing_tableUniques[0].attributes.forEach(attributeName => {
          const attribute = referencingTableCodec.attributes[attributeName];
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_referencingTable.attributes.id.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_referencingTable.attributes.enum_1.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_referencingTable.attributes.enum_2.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_referencingTable.attributes.enum_3.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_referencingTable.attributes.simple_enum.codec)}`;
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
          applyPlan(_, $object) {
            return $object;
          }
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
          applyPlan(_, $object) {
            return $object;
          }
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
          applyPlan(_, $object) {
            return $object;
          }
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
          applyPlan(_, $object) {
            return $object;
          }
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
          applyPlan(_, $object) {
            return $object;
          }
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
          applyPlan(_, $object) {
            return $object;
          }
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
          applyPlan(_, $object) {
            return $object;
          }
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
          applyPlan(_, $object) {
            return $object;
          }
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
          applyPlan(_, $object) {
            return $object;
          }
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
          applyPlan(_, $object) {
            return $object;
          }
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
          applyPlan(_, $object) {
            return $object;
          }
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
          applyPlan(_, $object) {
            return $object;
          }
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
          applyPlan(_, $object) {
            return $object;
          }
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
          applyPlan(_, $object) {
            return $object;
          }
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
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    }
  },
  ReferencingTableMutationPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      return $object.getStepForKey("clientMutationId", true) ?? constant(undefined);
    },
    integer($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  ReferencingTableMutationInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    t: undefined
  },
  ReferencingTableInput: {
    "__inputPlan": function ReferencingTableInput_inputPlan() {
      return object(Object.create(null));
    },
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
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    letterDescription($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
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
            const spec = letter_descriptionsUniques[0].attributes.reduce((memo, attributeName) => {
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
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    letterDescription: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  LetterDescriptionInput: {
    "__inputPlan": function LetterDescriptionInput_inputPlan() {
      return object(Object.create(null));
    },
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
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    referencingTable($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
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
            const spec = referencing_tableUniques[0].attributes.reduce((memo, attributeName) => {
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
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    referencingTable: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateLetterDescriptionPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    letterDescription($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
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
            const spec = letter_descriptionsUniques[0].attributes.reduce((memo, attributeName) => {
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
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined,
    letterDescriptionPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  LetterDescriptionPatch: {
    "__inputPlan": function LetterDescriptionPatch_inputPlan() {
      return object(Object.create(null));
    },
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
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined,
    letterDescriptionPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  UpdateLetterDescriptionByLetterInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    letter: undefined,
    letterDescriptionPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  UpdateLetterDescriptionByLetterViaViewInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    letterViaView: undefined,
    letterDescriptionPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  UpdateReferencingTablePayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    referencingTable($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
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
            const spec = referencing_tableUniques[0].attributes.reduce((memo, attributeName) => {
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
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined,
    referencingTablePatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  ReferencingTablePatch: {
    "__inputPlan": function ReferencingTablePatch_inputPlan() {
      return object(Object.create(null));
    },
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
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined,
    referencingTablePatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  DeleteLetterDescriptionPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    letterDescription($object) {
      return $object.get("result");
    },
    deletedLetterDescriptionId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.LetterDescription.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
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
            const spec = letter_descriptionsUniques[0].attributes.reduce((memo, attributeName) => {
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
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined
  },
  DeleteLetterDescriptionByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined
  },
  DeleteLetterDescriptionByLetterInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    letter: undefined
  },
  DeleteLetterDescriptionByLetterViaViewInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    letterViaView: undefined
  },
  DeleteReferencingTablePayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    referencingTable($object) {
      return $object.get("result");
    },
    deletedReferencingTableId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.ReferencingTable.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
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
            const spec = referencing_tableUniques[0].attributes.reduce((memo, attributeName) => {
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
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined
  },
  DeleteReferencingTableByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined
  }
};
export const schema = makeGrafastSchema({
  typeDefs: typeDefs,
  plans: plans
});
