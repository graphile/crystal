import { PgDeleteSingleStep, PgExecutor, PgSelectStep, TYPES, assertPgClassSingleStep, enumCodec, makeRegistry, pgDeleteSingle, pgInsertSingle, pgSelectFromRecord, pgUpdateSingle, recordCodec, sqlFromArgDigests, sqlValueWithCodec } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ObjectStep, __ValueStep, access, assertStep, bakedInput, bakedInputRuntime, connection, constant, context, createObjectAndApplyChildren, first, get as get2, inhibitOnNull, inspect, lambda, list, makeDecodeNodeId, makeGrafastSchema, markSyncAndSafe, object, operationPlan, rootValue, specFromNodeId, trap } from "grafast";
import { GraphQLError, Kind } from "graphql";
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
const abcdIdentifier = sql.identifier("enum_tables", "abcd");
const abcdCodec = recordCodec({
  name: "abcd",
  identifier: abcdIdentifier,
  attributes: {
    __proto__: null,
    letter: {
      codec: TYPES.text,
      notNull: true
    },
    description: {
      codec: TYPES.text,
      extensions: {
        tags: {
          enumDescription: true
        }
      }
    }
  },
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
      codec: TYPES.text,
      notNull: true
    },
    description: {
      codec: TYPES.text
    }
  },
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
      codec: TYPES.text,
      notNull: true
    },
    description: {
      codec: TYPES.text
    }
  },
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
});
const letterDescriptionsCodec = recordCodec({
  name: "letterDescriptions",
  identifier: letterDescriptionsIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    letter: {
      codec: spec_letterDescriptions_attributes_letter_codec_LetterAToDEnum,
      notNull: true
    },
    letter_via_view: {
      codec: spec_letterDescriptions_attributes_letter_via_view_codec_LetterAToDViaViewEnum,
      notNull: true
    },
    description: {
      codec: TYPES.text
    }
  },
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
});
const referencingTableCodec = recordCodec({
  name: "referencingTable",
  identifier: referencingTableIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    enum_1: {
      codec: spec_referencingTable_attributes_enum_1_codec_EnumTheFirstEnum
    },
    enum_2: {
      codec: spec_referencingTable_attributes_enum_2_codec_EnumTheSecondEnum
    },
    enum_3: {
      codec: spec_referencingTable_attributes_enum_3_codec_LotsOfEnumsEnum3Enum
    },
    simple_enum: {
      codec: spec_referencingTable_attributes_simple_enum_codec_SimpleEnumEnum
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "enum_tables",
      name: "referencing_table"
    }
  },
  executor: executor
});
const lotsOfEnumsIdentifier = sql.identifier("enum_tables", "lots_of_enums");
const lotsOfEnumsCodec = recordCodec({
  name: "lotsOfEnums",
  identifier: lotsOfEnumsIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    enum_1: {
      codec: TYPES.text
    },
    enum_2: {
      codec: TYPES.varchar
    },
    enum_3: {
      codec: TYPES.bpchar
    },
    enum_4: {
      codec: TYPES.text
    },
    description: {
      codec: TYPES.text
    }
  },
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
});
const abcd_resourceOptionsConfig = {
  executor: executor,
  name: "abcd",
  identifier: "main.enum_tables.abcd",
  from: abcdIdentifier,
  codec: abcdCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "enum_tables",
      name: "abcd"
    },
    tags: {
      enum: true,
      enumName: "LetterAToD"
    }
  },
  uniques: [{
    attributes: ["letter"],
    isPrimary: true
  }]
};
const abcd_view_resourceOptionsConfig = {
  executor: executor,
  name: "abcd_view",
  identifier: "main.enum_tables.abcd_view",
  from: abcdViewIdentifier,
  codec: abcdViewCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "enum_tables",
      name: "abcd_view"
    },
    tags: {
      primaryKey: "letter",
      enum: true,
      enumName: "LetterAToDViaView"
    }
  },
  uniques: [{
    attributes: ["letter"],
    isPrimary: true
  }]
};
const simple_enum_resourceOptionsConfig = {
  executor: executor,
  name: "simple_enum",
  identifier: "main.enum_tables.simple_enum",
  from: simpleEnumIdentifier,
  codec: simpleEnumCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "enum_tables",
      name: "simple_enum"
    },
    tags: {
      enum: true
    }
  },
  uniques: [{
    attributes: ["value"],
    isPrimary: true
  }]
};
const referencing_table_mutationFunctionIdentifer = sql.identifier("enum_tables", "referencing_table_mutation");
const letter_descriptionsUniques = [{
  attributes: ["id"],
  isPrimary: true
}, {
  attributes: ["letter"]
}, {
  attributes: ["letter_via_view"]
}];
const letter_descriptions_resourceOptionsConfig = {
  executor: executor,
  name: "letter_descriptions",
  identifier: "main.enum_tables.letter_descriptions",
  from: letterDescriptionsIdentifier,
  codec: letterDescriptionsCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "enum_tables",
      name: "letter_descriptions"
    },
    tags: {
      foreignKey: "(letter_via_view) references enum_tables.abcd_view"
    }
  },
  uniques: letter_descriptionsUniques
};
const referencing_tableUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const referencing_table_resourceOptionsConfig = {
  executor: executor,
  name: "referencing_table",
  identifier: "main.enum_tables.referencing_table",
  from: referencingTableIdentifier,
  codec: referencingTableCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "enum_tables",
      name: "referencing_table"
    }
  },
  uniques: referencing_tableUniques
};
const lots_of_enums_resourceOptionsConfig = {
  executor: executor,
  name: "lots_of_enums",
  identifier: "main.enum_tables.lots_of_enums",
  from: lotsOfEnumsIdentifier,
  codec: lotsOfEnumsCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "enum_tables",
      name: "lots_of_enums"
    },
    tags: {
      omit: true,
      behavior: ["-insert -select -node -connection -list -array -single -update -delete -queryField -mutationField -typeField -filter -filterBy -order -orderBy -query:resource:list -query:resource:connection -singularRelation:resource:list -singularRelation:resource:connection -manyRelation:resource:list -manyRelation:resource:connection -manyToMany"]
    }
  },
  uniques: [{
    attributes: ["id"],
    isPrimary: true
  }, {
    attributes: ["enum_1"],
    extensions: {
      tags: {
        __proto__: null,
        enum: true,
        enumName: "EnumTheFirst"
      }
    }
  }, {
    attributes: ["enum_2"],
    extensions: {
      tags: {
        __proto__: null,
        enum: true,
        enumName: "EnumTheSecond"
      }
    }
  }, {
    attributes: ["enum_3"],
    extensions: {
      tags: {
        __proto__: null,
        enum: true
      }
    }
  }, {
    attributes: ["enum_4"],
    extensions: {
      tags: {
        __proto__: null,
        enum: true
      }
    }
  }]
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
    bpchar: TYPES.bpchar,
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
    abcd: abcd_resourceOptionsConfig,
    abcd_view: abcd_view_resourceOptionsConfig,
    simple_enum: simple_enum_resourceOptionsConfig,
    referencing_table_mutation: {
      executor: executor,
      name: "referencing_table_mutation",
      identifier: "main.enum_tables.referencing_table_mutation(enum_tables.referencing_table)",
      from(...args) {
        return sql`${referencing_table_mutationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "t",
        codec: referencingTableCodec,
        required: true
      }],
      codec: TYPES.int,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "enum_tables",
          name: "referencing_table_mutation"
        }
      },
      isUnique: true,
      isMutation: true
    },
    letter_descriptions: letter_descriptions_resourceOptionsConfig,
    referencing_table: referencing_table_resourceOptionsConfig,
    lots_of_enums: lots_of_enums_resourceOptionsConfig
  },
  pgRelations: {
    __proto__: null,
    abcd: {
      __proto__: null,
      letterDescriptionsByTheirLetter: {
        localCodec: abcdCodec,
        remoteResourceOptions: letter_descriptions_resourceOptionsConfig,
        localAttributes: ["letter"],
        remoteAttributes: ["letter"],
        isUnique: true,
        isReferencee: true
      }
    },
    abcdView: {
      __proto__: null,
      letterDescriptionsByTheirLetterViaView: {
        localCodec: abcdViewCodec,
        remoteResourceOptions: letter_descriptions_resourceOptionsConfig,
        localAttributes: ["letter"],
        remoteAttributes: ["letter_via_view"],
        isUnique: true,
        isReferencee: true
      }
    },
    letterDescriptions: {
      __proto__: null,
      abcdViewByMyLetterViaView: {
        localCodec: letterDescriptionsCodec,
        remoteResourceOptions: abcd_view_resourceOptionsConfig,
        localAttributes: ["letter_via_view"],
        remoteAttributes: ["letter"],
        isUnique: true
      },
      abcdByMyLetter: {
        localCodec: letterDescriptionsCodec,
        remoteResourceOptions: abcd_resourceOptionsConfig,
        localAttributes: ["letter"],
        remoteAttributes: ["letter"],
        isUnique: true
      }
    },
    lotsOfEnums: {
      __proto__: null,
      referencingTablesByTheirEnum1: {
        localCodec: lotsOfEnumsCodec,
        remoteResourceOptions: referencing_table_resourceOptionsConfig,
        localAttributes: ["enum_1"],
        remoteAttributes: ["enum_1"],
        isReferencee: true
      },
      referencingTablesByTheirEnum2: {
        localCodec: lotsOfEnumsCodec,
        remoteResourceOptions: referencing_table_resourceOptionsConfig,
        localAttributes: ["enum_2"],
        remoteAttributes: ["enum_2"],
        isReferencee: true
      },
      referencingTablesByTheirEnum3: {
        localCodec: lotsOfEnumsCodec,
        remoteResourceOptions: referencing_table_resourceOptionsConfig,
        localAttributes: ["enum_3"],
        remoteAttributes: ["enum_3"],
        isReferencee: true
      }
    },
    referencingTable: {
      __proto__: null,
      lotsOfEnumsByMyEnum1: {
        localCodec: referencingTableCodec,
        remoteResourceOptions: lots_of_enums_resourceOptionsConfig,
        localAttributes: ["enum_1"],
        remoteAttributes: ["enum_1"],
        isUnique: true
      },
      lotsOfEnumsByMyEnum2: {
        localCodec: referencingTableCodec,
        remoteResourceOptions: lots_of_enums_resourceOptionsConfig,
        localAttributes: ["enum_2"],
        remoteAttributes: ["enum_2"],
        isUnique: true
      },
      lotsOfEnumsByMyEnum3: {
        localCodec: referencingTableCodec,
        remoteResourceOptions: lots_of_enums_resourceOptionsConfig,
        localAttributes: ["enum_3"],
        remoteAttributes: ["enum_3"],
        isUnique: true
      },
      simpleEnumByMySimpleEnum: {
        localCodec: referencingTableCodec,
        remoteResourceOptions: simple_enum_resourceOptionsConfig,
        localAttributes: ["simple_enum"],
        remoteAttributes: ["value"],
        isUnique: true
      }
    },
    simpleEnum: {
      __proto__: null,
      referencingTablesByTheirSimpleEnum: {
        localCodec: simpleEnumCodec,
        remoteResourceOptions: referencing_table_resourceOptionsConfig,
        localAttributes: ["value"],
        remoteAttributes: ["simple_enum"],
        isReferencee: true
      }
    }
  }
});
const resource_letter_descriptionsPgResource = registry.pgResources["letter_descriptions"];
const resource_referencing_tablePgResource = registry.pgResources["referencing_table"];
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
const nodeIdHandler_LetterDescription = makeTableNodeIdHandler({
  typeName: "LetterDescription",
  identifier: "letter_descriptions",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_letter_descriptionsPgResource,
  pk: letter_descriptionsUniques[0].attributes
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
const nodeFetcher_LetterDescription = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_LetterDescription));
  return nodeIdHandler_LetterDescription.get(nodeIdHandler_LetterDescription.getSpec($decoded));
};
const nodeIdHandler_ReferencingTable = makeTableNodeIdHandler({
  typeName: "ReferencingTable",
  identifier: "referencing_tables",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_referencing_tablePgResource,
  pk: referencing_tableUniques[0].attributes
});
const nodeFetcher_ReferencingTable = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_ReferencingTable));
  return nodeIdHandler_ReferencingTable.get(nodeIdHandler_ReferencingTable.getSpec($decoded));
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
const totalCountConnectionPlan = $connection => $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
function toString(value) {
  return "" + value;
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
const LetterDescriptionCondition_idApply = ($condition, val) => applyAttributeCondition("id", TYPES.int, $condition, val);
const LetterDescriptionsOrderBy_ID_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "id",
    direction: "ASC"
  });
  queryBuilder.setOrderIsUnique();
};
const LetterDescriptionsOrderBy_ID_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "id",
    direction: "DESC"
  });
  queryBuilder.setOrderIsUnique();
};
const argDetailsSimple_referencing_table_mutation = [{
  graphqlArgName: "t",
  pgCodec: referencingTableCodec,
  postgresArgName: "t",
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
const makeArgs_referencing_table_mutation = (args, path = []) => argDetailsSimple_referencing_table_mutation.map(details => makeArg(path, args, details));
const resource_referencing_table_mutationPgResource = registry.pgResources["referencing_table_mutation"];
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
const specFromArgs_LetterDescription = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_LetterDescription, $nodeId);
};
function applyInputToUpdateOrDelete(_, $object) {
  return $object;
}
const specFromArgs_ReferencingTable = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_ReferencingTable, $nodeId);
};
function queryPlan() {
  return rootValue();
}
function applyClientMutationIdForCustomMutation(qb, val) {
  qb.setMeta("clientMutationId", val);
}
function ReferencingTableInput_idApply(obj, val, info) {
  obj.set("id", bakedInputRuntime(info.schema, info.field.type, val));
}
function ReferencingTableInput_enum1Apply(obj, val, info) {
  obj.set("enum_1", bakedInputRuntime(info.schema, info.field.type, val));
}
function ReferencingTableInput_enum2Apply(obj, val, info) {
  obj.set("enum_2", bakedInputRuntime(info.schema, info.field.type, val));
}
function ReferencingTableInput_enum3Apply(obj, val, info) {
  obj.set("enum_3", bakedInputRuntime(info.schema, info.field.type, val));
}
function ReferencingTableInput_simpleEnumApply(obj, val, info) {
  obj.set("simple_enum", bakedInputRuntime(info.schema, info.field.type, val));
}
function getClientMutationIdForCreatePlan($mutation) {
  const $insert = $mutation.getStepForKey("result");
  return $insert.getMeta("clientMutationId");
}
function planCreatePayloadResult($object) {
  return $object.get("result");
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
const CreateLetterDescriptionPayload_letterDescriptionEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_letter_descriptionsPgResource, letter_descriptionsUniques[0].attributes, $mutation, fieldArgs);
function applyCreateFields(qb, arg) {
  if (arg != null) {
    return qb.setBuilder();
  }
}
function LetterDescriptionInput_letterApply(obj, val, info) {
  obj.set("letter", bakedInputRuntime(info.schema, info.field.type, val));
}
function LetterDescriptionInput_letterViaViewApply(obj, val, info) {
  obj.set("letter_via_view", bakedInputRuntime(info.schema, info.field.type, val));
}
function LetterDescriptionInput_descriptionApply(obj, val, info) {
  obj.set("description", bakedInputRuntime(info.schema, info.field.type, val));
}
const CreateReferencingTablePayload_referencingTableEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_referencing_tablePgResource, referencing_tableUniques[0].attributes, $mutation, fieldArgs);
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
export const objects = {
  Query: {
    assertStep() {
      return true;
    },
    plans: {
      allLetterDescriptions: {
        plan() {
          return connection(resource_letter_descriptionsPgResource.find());
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
      allReferencingTables: {
        plan() {
          return connection(resource_referencing_tablePgResource.find());
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
      letterDescription(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_LetterDescription($nodeId);
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
      referencingTable(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_ReferencingTable($nodeId);
      },
      referencingTableById(_$root, {
        $id
      }) {
        return resource_referencing_tablePgResource.get({
          id: $id
        });
      }
    }
  },
  Mutation: {
    assertStep: __ValueStep,
    plans: {
      createLetterDescription: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_letter_descriptionsPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createReferencingTable: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_referencing_tablePgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      deleteLetterDescription: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_letter_descriptionsPgResource, specFromArgs_LetterDescription(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
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
          input: applyInputToUpdateOrDelete
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
          input: applyInputToUpdateOrDelete
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
          input: applyInputToUpdateOrDelete
        }
      },
      deleteReferencingTable: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_referencing_tablePgResource, specFromArgs_ReferencingTable(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
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
          input: applyInputToUpdateOrDelete
        }
      },
      referencingTableMutation: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_referencing_table_mutation(args, ["input"]);
          const $result = resource_referencing_table_mutationPgResource.execute(selectArgs, "mutation");
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
      updateLetterDescription: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_letter_descriptionsPgResource, specFromArgs_LetterDescription(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
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
          input: applyInputToUpdateOrDelete
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
          input: applyInputToUpdateOrDelete
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
          input: applyInputToUpdateOrDelete
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
          input: applyInputToUpdateOrDelete
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
          input: applyInputToUpdateOrDelete
        }
      }
    }
  },
  CreateLetterDescriptionPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      letterDescription: planCreatePayloadResult,
      letterDescriptionEdge: CreateLetterDescriptionPayload_letterDescriptionEdgePlan,
      query: queryPlan
    }
  },
  CreateReferencingTablePayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan,
      referencingTable: planCreatePayloadResult,
      referencingTableEdge: CreateReferencingTablePayload_referencingTableEdgePlan
    }
  },
  DeleteLetterDescriptionPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedLetterDescriptionId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_LetterDescription.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      letterDescription: planCreatePayloadResult,
      letterDescriptionEdge: CreateLetterDescriptionPayload_letterDescriptionEdgePlan,
      query: queryPlan
    }
  },
  DeleteReferencingTablePayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedReferencingTableId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_ReferencingTable.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      query: queryPlan,
      referencingTable: planCreatePayloadResult,
      referencingTableEdge: CreateReferencingTablePayload_referencingTableEdgePlan
    }
  },
  LetterDescription: {
    assertStep: assertPgClassSingleStep,
    plans: {
      letterViaView($record) {
        return $record.get("letter_via_view");
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_LetterDescription.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_LetterDescription.codec.name].encode);
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of letter_descriptionsUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_letter_descriptionsPgResource.get(spec);
    }
  },
  LetterDescriptionsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  ReferencingTable: {
    assertStep: assertPgClassSingleStep,
    plans: {
      enum1($record) {
        return $record.get("enum_1");
      },
      enum2($record) {
        return $record.get("enum_2");
      },
      enum3($record) {
        return $record.get("enum_3");
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_ReferencingTable.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_ReferencingTable.codec.name].encode);
      },
      simpleEnum($record) {
        return $record.get("simple_enum");
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of referencing_tableUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_referencing_tablePgResource.get(spec);
    }
  },
  ReferencingTableMutationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($object) {
        const $result = $object.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      integer($object) {
        return $object.get("result");
      },
      query: queryPlan
    }
  },
  ReferencingTablesConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  UpdateLetterDescriptionPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      letterDescription: planCreatePayloadResult,
      letterDescriptionEdge: CreateLetterDescriptionPayload_letterDescriptionEdgePlan,
      query: queryPlan
    }
  },
  UpdateReferencingTablePayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan,
      referencingTable: planCreatePayloadResult,
      referencingTableEdge: CreateReferencingTablePayload_referencingTableEdgePlan
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
  CreateLetterDescriptionInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      letterDescription: applyCreateFields
    }
  },
  CreateReferencingTableInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      referencingTable: applyCreateFields
    }
  },
  DeleteLetterDescriptionByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeleteLetterDescriptionByLetterInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeleteLetterDescriptionByLetterViaViewInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeleteLetterDescriptionInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeleteReferencingTableByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeleteReferencingTableInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  LetterDescriptionCondition: {
    plans: {
      description($condition, val) {
        return applyAttributeCondition("description", TYPES.text, $condition, val);
      },
      id: LetterDescriptionCondition_idApply,
      letter($condition, val) {
        return applyAttributeCondition("letter", spec_letterDescriptions_attributes_letter_codec_LetterAToDEnum, $condition, val);
      },
      letterViaView($condition, val) {
        return applyAttributeCondition("letter_via_view", spec_letterDescriptions_attributes_letter_via_view_codec_LetterAToDViaViewEnum, $condition, val);
      }
    }
  },
  LetterDescriptionInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      description: LetterDescriptionInput_descriptionApply,
      id: ReferencingTableInput_idApply,
      letter: LetterDescriptionInput_letterApply,
      letterViaView: LetterDescriptionInput_letterViaViewApply
    }
  },
  LetterDescriptionPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      description: LetterDescriptionInput_descriptionApply,
      id: ReferencingTableInput_idApply,
      letter: LetterDescriptionInput_letterApply,
      letterViaView: LetterDescriptionInput_letterViaViewApply
    }
  },
  ReferencingTableCondition: {
    plans: {
      enum1($condition, val) {
        return applyAttributeCondition("enum_1", spec_referencingTable_attributes_enum_1_codec_EnumTheFirstEnum, $condition, val);
      },
      enum2($condition, val) {
        return applyAttributeCondition("enum_2", spec_referencingTable_attributes_enum_2_codec_EnumTheSecondEnum, $condition, val);
      },
      enum3($condition, val) {
        return applyAttributeCondition("enum_3", spec_referencingTable_attributes_enum_3_codec_LotsOfEnumsEnum3Enum, $condition, val);
      },
      id: LetterDescriptionCondition_idApply,
      simpleEnum($condition, val) {
        return applyAttributeCondition("simple_enum", spec_referencingTable_attributes_simple_enum_codec_SimpleEnumEnum, $condition, val);
      }
    }
  },
  ReferencingTableInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      enum1: ReferencingTableInput_enum1Apply,
      enum2: ReferencingTableInput_enum2Apply,
      enum3: ReferencingTableInput_enum3Apply,
      id: ReferencingTableInput_idApply,
      simpleEnum: ReferencingTableInput_simpleEnumApply
    }
  },
  ReferencingTableMutationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  ReferencingTablePatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      enum1: ReferencingTableInput_enum1Apply,
      enum2: ReferencingTableInput_enum2Apply,
      enum3: ReferencingTableInput_enum3Apply,
      id: ReferencingTableInput_idApply,
      simpleEnum: ReferencingTableInput_simpleEnumApply
    }
  },
  UpdateLetterDescriptionByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      letterDescriptionPatch: applyCreateFields
    }
  },
  UpdateLetterDescriptionByLetterInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      letterDescriptionPatch: applyCreateFields
    }
  },
  UpdateLetterDescriptionByLetterViaViewInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      letterDescriptionPatch: applyCreateFields
    }
  },
  UpdateLetterDescriptionInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      letterDescriptionPatch: applyCreateFields
    }
  },
  UpdateReferencingTableByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      referencingTablePatch: applyCreateFields
    }
  },
  UpdateReferencingTableInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      referencingTablePatch: applyCreateFields
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
  }
};
export const enums = {
  EnumTheFirst: {
    values: {
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
    }
  },
  EnumTheSecond: {
    values: {
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
    }
  },
  LetterDescriptionsOrderBy: {
    values: {
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
      ID_ASC: LetterDescriptionsOrderBy_ID_ASCApply,
      ID_DESC: LetterDescriptionsOrderBy_ID_DESCApply,
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
      }
    }
  },
  LotsOfEnumsEnum3: {
    values: {
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
    }
  },
  ReferencingTablesOrderBy: {
    values: {
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
      ID_ASC: LetterDescriptionsOrderBy_ID_ASCApply,
      ID_DESC: LetterDescriptionsOrderBy_ID_DESCApply,
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
    }
  },
  SimpleEnum: {
    values: {
      BAR: {
        value: "Bar"
      },
      BAZ: {
        value: "Baz"
      },
      FOO: {
        value: "Foo"
      },
      QUX: {
        value: "Qux"
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
