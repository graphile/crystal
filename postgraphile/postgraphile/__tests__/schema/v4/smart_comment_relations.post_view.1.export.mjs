import { PgDeleteSingleStep, PgExecutor, TYPES, assertPgClassSingleStep, enumCodec, makeRegistry, pgDeleteSingle, pgInsertSingle, pgSelectFromRecord, pgUpdateSingle, recordCodec, sqlValueWithCodec } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ObjectStep, __ValueStep, access, assertStep, bakedInputRuntime, connection, constant, context, createObjectAndApplyChildren, first, get as get2, inhibitOnNull, inspect, lambda, list, makeDecodeNodeId, makeGrafastSchema, markSyncAndSafe, object, rootValue, specFromNodeId } from "grafast";
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
const post_tableIdentifier = sql.identifier("smart_comment_relations", "post");
const post_tableCodec = recordCodec({
  name: "post_table",
  identifier: post_tableIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.text,
      notNull: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "smart_comment_relations",
      name: "post"
    },
    tags: {
      __proto__: null,
      name: "post_table",
      omit: true,
      behavior: ["-insert -select -node -connection -list -array -single -update -delete -queryField -mutationField -typeField -filter -filterBy -order -orderBy -query:resource:list -query:resource:connection -singularRelation:resource:list -singularRelation:resource:connection -manyRelation:resource:list -manyRelation:resource:connection -manyToMany"]
    }
  },
  executor: executor
});
const postsIdentifier = sql.identifier("smart_comment_relations", "post_view");
const postsCodec = recordCodec({
  name: "posts",
  identifier: postsIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.text,
      notNull: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "smart_comment_relations",
      name: "post_view"
    },
    tags: {
      __proto__: null,
      name: "posts",
      primaryKey: "id"
    }
  },
  executor: executor
});
const offer_tableIdentifier = sql.identifier("smart_comment_relations", "offer");
const offer_tableCodec = recordCodec({
  name: "offer_table",
  identifier: offer_tableIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    post_id: {
      codec: TYPES.text,
      notNull: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "smart_comment_relations",
      name: "offer"
    },
    tags: {
      __proto__: null,
      name: "offer_table",
      omit: true,
      behavior: ["-insert -select -node -connection -list -array -single -update -delete -queryField -mutationField -typeField -filter -filterBy -order -orderBy -query:resource:list -query:resource:connection -singularRelation:resource:list -singularRelation:resource:connection -manyRelation:resource:list -manyRelation:resource:connection -manyToMany"]
    }
  },
  executor: executor
});
const offersIdentifier = sql.identifier("smart_comment_relations", "offer_view");
const offersCodec = recordCodec({
  name: "offers",
  identifier: offersIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true
    },
    post_id: {
      codec: TYPES.text
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "smart_comment_relations",
      name: "offer_view"
    },
    tags: {
      __proto__: null,
      name: "offers",
      primaryKey: "id",
      foreignKey: "(post_id) references post_view"
    }
  },
  executor: executor
});
const streetsIdentifier = sql.identifier("smart_comment_relations", "streets");
const streetsCodec = recordCodec({
  name: "streets",
  identifier: streetsIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    name: {
      codec: TYPES.text,
      notNull: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "smart_comment_relations",
      name: "streets"
    },
    tags: {
      __proto__: null,
      unique: "name"
    }
  },
  executor: executor
});
const propertiesIdentifier = sql.identifier("smart_comment_relations", "properties");
const propertiesCodec = recordCodec({
  name: "properties",
  identifier: propertiesIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    street_id: {
      codec: TYPES.int,
      notNull: true
    },
    name_or_number: {
      codec: TYPES.text,
      notNull: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "smart_comment_relations",
      name: "properties"
    }
  },
  executor: executor
});
const streetPropertyIdentifier = sql.identifier("smart_comment_relations", "street_property");
const streetPropertyCodec = recordCodec({
  name: "streetProperty",
  identifier: streetPropertyIdentifier,
  attributes: {
    __proto__: null,
    str_id: {
      codec: TYPES.int,
      notNull: true
    },
    prop_id: {
      codec: TYPES.int,
      notNull: true
    },
    current_owner: {
      codec: TYPES.text
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "smart_comment_relations",
      name: "street_property"
    }
  },
  executor: executor
});
const housesIdentifier = sql.identifier("smart_comment_relations", "houses");
const housesCodec = recordCodec({
  name: "houses",
  identifier: housesIdentifier,
  attributes: {
    __proto__: null,
    building_name: {
      codec: TYPES.text
    },
    property_name_or_number: {
      codec: TYPES.text,
      notNull: true,
      extensions: {
        tags: {
          notNull: true
        }
      }
    },
    street_name: {
      codec: TYPES.text,
      notNull: true,
      extensions: {
        tags: {
          notNull: true
        }
      }
    },
    street_id: {
      codec: TYPES.int,
      notNull: true
    },
    building_id: {
      codec: TYPES.int
    },
    property_id: {
      codec: TYPES.int,
      notNull: true
    },
    floors: {
      codec: TYPES.int
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "smart_comment_relations",
      name: "houses"
    },
    tags: {
      __proto__: null,
      primaryKey: "street_id,property_id",
      foreignKey: ["(street_id) references smart_comment_relations.streets", "(building_id) references smart_comment_relations.buildings (id)", "(property_id) references properties", "(street_id, property_id) references street_property (str_id, prop_id)"]
    }
  },
  executor: executor
});
const buildingsIdentifier = sql.identifier("smart_comment_relations", "buildings");
const buildingsCodec = recordCodec({
  name: "buildings",
  identifier: buildingsIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    property_id: {
      codec: TYPES.int,
      notNull: true
    },
    name: {
      codec: TYPES.text,
      notNull: true
    },
    floors: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    is_primary: {
      codec: TYPES.boolean,
      notNull: true,
      hasDefault: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "smart_comment_relations",
      name: "buildings"
    },
    tags: {
      __proto__: null,
      foreignKey: "(name) references streets (name)|@fieldName namedAfterStreet|@foreignFieldName buildingsNamedAfterStreet|@foreignSimpleFieldName buildingsNamedAfterStreetList"
    }
  },
  executor: executor
});
const post_table_resourceOptionsConfig = {
  executor: executor,
  name: "post_table",
  identifier: "main.smart_comment_relations.post",
  from: post_tableIdentifier,
  codec: post_tableCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "smart_comment_relations",
      name: "post"
    },
    tags: {
      name: "post_table",
      omit: true,
      behavior: ["-insert -select -node -connection -list -array -single -update -delete -queryField -mutationField -typeField -filter -filterBy -order -orderBy -query:resource:list -query:resource:connection -singularRelation:resource:list -singularRelation:resource:connection -manyRelation:resource:list -manyRelation:resource:connection -manyToMany"]
    }
  },
  uniques: [{
    attributes: ["id"],
    isPrimary: true
  }]
};
const postsUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const posts_resourceOptionsConfig = {
  executor: executor,
  name: "posts",
  identifier: "main.smart_comment_relations.post_view",
  from: postsIdentifier,
  codec: postsCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "smart_comment_relations",
      name: "post_view"
    },
    tags: {
      name: "posts",
      primaryKey: "id"
    }
  },
  uniques: postsUniques
};
const offer_table_resourceOptionsConfig = {
  executor: executor,
  name: "offer_table",
  identifier: "main.smart_comment_relations.offer",
  from: offer_tableIdentifier,
  codec: offer_tableCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "smart_comment_relations",
      name: "offer"
    },
    tags: {
      name: "offer_table",
      omit: true,
      behavior: ["-insert -select -node -connection -list -array -single -update -delete -queryField -mutationField -typeField -filter -filterBy -order -orderBy -query:resource:list -query:resource:connection -singularRelation:resource:list -singularRelation:resource:connection -manyRelation:resource:list -manyRelation:resource:connection -manyToMany"]
    }
  },
  uniques: [{
    attributes: ["id"],
    isPrimary: true
  }]
};
const offersUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const offers_resourceOptionsConfig = {
  executor: executor,
  name: "offers",
  identifier: "main.smart_comment_relations.offer_view",
  from: offersIdentifier,
  codec: offersCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "smart_comment_relations",
      name: "offer_view"
    },
    tags: {
      name: "offers",
      primaryKey: "id",
      foreignKey: "(post_id) references post_view"
    }
  },
  uniques: offersUniques
};
const streetsUniques = [{
  attributes: ["id"],
  isPrimary: true
}, {
  attributes: ["name"]
}];
const streets_resourceOptionsConfig = {
  executor: executor,
  name: "streets",
  identifier: "main.smart_comment_relations.streets",
  from: streetsIdentifier,
  codec: streetsCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "smart_comment_relations",
      name: "streets"
    },
    tags: {
      unique: "name"
    }
  },
  uniques: streetsUniques
};
const propertiesUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const properties_resourceOptionsConfig = {
  executor: executor,
  name: "properties",
  identifier: "main.smart_comment_relations.properties",
  from: propertiesIdentifier,
  codec: propertiesCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "smart_comment_relations",
      name: "properties"
    }
  },
  uniques: propertiesUniques
};
const street_propertyUniques = [{
  attributes: ["str_id", "prop_id"],
  isPrimary: true
}];
const street_property_resourceOptionsConfig = {
  executor: executor,
  name: "street_property",
  identifier: "main.smart_comment_relations.street_property",
  from: streetPropertyIdentifier,
  codec: streetPropertyCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "smart_comment_relations",
      name: "street_property"
    }
  },
  uniques: street_propertyUniques
};
const housesUniques = [{
  attributes: ["street_id", "property_id"],
  isPrimary: true
}];
const houses_resourceOptionsConfig = {
  executor: executor,
  name: "houses",
  identifier: "main.smart_comment_relations.houses",
  from: housesIdentifier,
  codec: housesCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "smart_comment_relations",
      name: "houses"
    },
    isInsertable: false,
    isUpdatable: false,
    isDeletable: false,
    tags: {
      primaryKey: "street_id,property_id",
      foreignKey: ["(street_id) references smart_comment_relations.streets", "(building_id) references smart_comment_relations.buildings (id)", "(property_id) references properties", "(street_id, property_id) references street_property (str_id, prop_id)"]
    }
  },
  uniques: housesUniques
};
const buildingsUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const buildings_resourceOptionsConfig = {
  executor: executor,
  name: "buildings",
  identifier: "main.smart_comment_relations.buildings",
  from: buildingsIdentifier,
  codec: buildingsCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "smart_comment_relations",
      name: "buildings"
    },
    tags: {
      foreignKey: "(name) references streets (name)|@fieldName namedAfterStreet|@foreignFieldName buildingsNamedAfterStreet|@foreignSimpleFieldName buildingsNamedAfterStreetList"
    }
  },
  uniques: buildingsUniques
};
const registry = makeRegistry({
  pgExecutors: {
    __proto__: null,
    main: executor
  },
  pgCodecs: {
    __proto__: null,
    post_table: post_tableCodec,
    text: TYPES.text,
    posts: postsCodec,
    offer_table: offer_tableCodec,
    int4: TYPES.int,
    offers: offersCodec,
    streets: streetsCodec,
    properties: propertiesCodec,
    streetProperty: streetPropertyCodec,
    houses: housesCodec,
    varchar: TYPES.varchar,
    bpchar: TYPES.bpchar,
    bool: TYPES.boolean,
    buildings: buildingsCodec,
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
    post_table: post_table_resourceOptionsConfig,
    posts: posts_resourceOptionsConfig,
    offer_table: offer_table_resourceOptionsConfig,
    offers: offers_resourceOptionsConfig,
    streets: streets_resourceOptionsConfig,
    properties: properties_resourceOptionsConfig,
    street_property: street_property_resourceOptionsConfig,
    houses: houses_resourceOptionsConfig,
    buildings: buildings_resourceOptionsConfig
  },
  pgRelations: {
    __proto__: null,
    buildings: {
      __proto__: null,
      propertiesByMyPropertyId: {
        localCodec: buildingsCodec,
        remoteResourceOptions: properties_resourceOptionsConfig,
        localAttributes: ["property_id"],
        remoteAttributes: ["id"],
        isUnique: true
      },
      namedAfterStreet: {
        localCodec: buildingsCodec,
        remoteResourceOptions: streets_resourceOptionsConfig,
        localAttributes: ["name"],
        remoteAttributes: ["name"],
        isUnique: true,
        extensions: {
          tags: {
            fieldName: "namedAfterStreet",
            foreignFieldName: "buildingsNamedAfterStreet",
            foreignSimpleFieldName: "buildingsNamedAfterStreetList"
          }
        }
      },
      housesByTheirBuildingId: {
        localCodec: buildingsCodec,
        remoteResourceOptions: houses_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["building_id"],
        isReferencee: true
      }
    },
    houses: {
      __proto__: null,
      streetsByMyStreetId: {
        localCodec: housesCodec,
        remoteResourceOptions: streets_resourceOptionsConfig,
        localAttributes: ["street_id"],
        remoteAttributes: ["id"],
        isUnique: true
      },
      buildingsByMyBuildingId: {
        localCodec: housesCodec,
        remoteResourceOptions: buildings_resourceOptionsConfig,
        localAttributes: ["building_id"],
        remoteAttributes: ["id"],
        isUnique: true
      },
      propertiesByMyPropertyId: {
        localCodec: housesCodec,
        remoteResourceOptions: properties_resourceOptionsConfig,
        localAttributes: ["property_id"],
        remoteAttributes: ["id"],
        isUnique: true
      },
      streetPropertyByMyStreetIdAndPropertyId: {
        localCodec: housesCodec,
        remoteResourceOptions: street_property_resourceOptionsConfig,
        localAttributes: ["street_id", "property_id"],
        remoteAttributes: ["str_id", "prop_id"],
        isUnique: true
      }
    },
    offer_table: {
      __proto__: null,
      postTableByMyPostId: {
        localCodec: offer_tableCodec,
        remoteResourceOptions: post_table_resourceOptionsConfig,
        localAttributes: ["post_id"],
        remoteAttributes: ["id"],
        isUnique: true
      }
    },
    offers: {
      __proto__: null,
      postsByMyPostId: {
        localCodec: offersCodec,
        remoteResourceOptions: posts_resourceOptionsConfig,
        localAttributes: ["post_id"],
        remoteAttributes: ["id"],
        isUnique: true
      }
    },
    post_table: {
      __proto__: null,
      offerTablesByTheirPostId: {
        localCodec: post_tableCodec,
        remoteResourceOptions: offer_table_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["post_id"],
        isReferencee: true
      }
    },
    posts: {
      __proto__: null,
      offersByTheirPostId: {
        localCodec: postsCodec,
        remoteResourceOptions: offers_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["post_id"],
        isReferencee: true
      }
    },
    properties: {
      __proto__: null,
      streetsByMyStreetId: {
        localCodec: propertiesCodec,
        remoteResourceOptions: streets_resourceOptionsConfig,
        localAttributes: ["street_id"],
        remoteAttributes: ["id"],
        isUnique: true
      },
      streetPropertiesByTheirPropId: {
        localCodec: propertiesCodec,
        remoteResourceOptions: street_property_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["prop_id"],
        isReferencee: true
      },
      buildingsByTheirPropertyId: {
        localCodec: propertiesCodec,
        remoteResourceOptions: buildings_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["property_id"],
        isReferencee: true
      },
      housesByTheirPropertyId: {
        localCodec: propertiesCodec,
        remoteResourceOptions: houses_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["property_id"],
        isReferencee: true
      }
    },
    streetProperty: {
      __proto__: null,
      propertiesByMyPropId: {
        localCodec: streetPropertyCodec,
        remoteResourceOptions: properties_resourceOptionsConfig,
        localAttributes: ["prop_id"],
        remoteAttributes: ["id"],
        isUnique: true
      },
      streetsByMyStrId: {
        localCodec: streetPropertyCodec,
        remoteResourceOptions: streets_resourceOptionsConfig,
        localAttributes: ["str_id"],
        remoteAttributes: ["id"],
        isUnique: true
      },
      housesByTheirStreetIdAndPropertyId: {
        localCodec: streetPropertyCodec,
        remoteResourceOptions: houses_resourceOptionsConfig,
        localAttributes: ["str_id", "prop_id"],
        remoteAttributes: ["street_id", "property_id"],
        isUnique: true,
        isReferencee: true
      }
    },
    streets: {
      __proto__: null,
      propertiesByTheirStreetId: {
        localCodec: streetsCodec,
        remoteResourceOptions: properties_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["street_id"],
        isReferencee: true
      },
      streetPropertiesByTheirStrId: {
        localCodec: streetsCodec,
        remoteResourceOptions: street_property_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["str_id"],
        isReferencee: true
      },
      buildingsNamedAfterStreet: {
        localCodec: streetsCodec,
        remoteResourceOptions: buildings_resourceOptionsConfig,
        localAttributes: ["name"],
        remoteAttributes: ["name"],
        isReferencee: true,
        extensions: {
          tags: {
            fieldName: "namedAfterStreet",
            foreignFieldName: "buildingsNamedAfterStreet",
            foreignSimpleFieldName: "buildingsNamedAfterStreetList"
          }
        }
      },
      housesByTheirStreetId: {
        localCodec: streetsCodec,
        remoteResourceOptions: houses_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["street_id"],
        isReferencee: true
      }
    }
  }
});
const resource_postsPgResource = registry.pgResources["posts"];
const resource_offersPgResource = registry.pgResources["offers"];
const resource_streetsPgResource = registry.pgResources["streets"];
const resource_propertiesPgResource = registry.pgResources["properties"];
const resource_street_propertyPgResource = registry.pgResources["street_property"];
const resource_housesPgResource = registry.pgResources["houses"];
const resource_buildingsPgResource = registry.pgResources["buildings"];
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
const nodeIdHandler_Post = makeTableNodeIdHandler({
  typeName: "Post",
  identifier: "post_views",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_postsPgResource,
  pk: postsUniques[0].attributes
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
const nodeFetcher_Post = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Post));
  return nodeIdHandler_Post.get(nodeIdHandler_Post.getSpec($decoded));
};
const nodeIdHandler_Offer = makeTableNodeIdHandler({
  typeName: "Offer",
  identifier: "offer_views",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_offersPgResource,
  pk: offersUniques[0].attributes
});
const nodeFetcher_Offer = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Offer));
  return nodeIdHandler_Offer.get(nodeIdHandler_Offer.getSpec($decoded));
};
const nodeIdHandler_Street = makeTableNodeIdHandler({
  typeName: "Street",
  identifier: "streets",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_streetsPgResource,
  pk: streetsUniques[0].attributes
});
const nodeFetcher_Street = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Street));
  return nodeIdHandler_Street.get(nodeIdHandler_Street.getSpec($decoded));
};
const nodeIdHandler_Property = makeTableNodeIdHandler({
  typeName: "Property",
  identifier: "properties",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_propertiesPgResource,
  pk: propertiesUniques[0].attributes
});
const nodeFetcher_Property = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Property));
  return nodeIdHandler_Property.get(nodeIdHandler_Property.getSpec($decoded));
};
const nodeIdHandler_StreetProperty = makeTableNodeIdHandler({
  typeName: "StreetProperty",
  identifier: "street_properties",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_street_propertyPgResource,
  pk: street_propertyUniques[0].attributes
});
const nodeFetcher_StreetProperty = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_StreetProperty));
  return nodeIdHandler_StreetProperty.get(nodeIdHandler_StreetProperty.getSpec($decoded));
};
const nodeIdHandler_House = makeTableNodeIdHandler({
  typeName: "House",
  identifier: "houses",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_housesPgResource,
  pk: housesUniques[0].attributes
});
const nodeFetcher_House = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_House));
  return nodeIdHandler_House.get(nodeIdHandler_House.getSpec($decoded));
};
const nodeIdHandler_Building = makeTableNodeIdHandler({
  typeName: "Building",
  identifier: "buildings",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_buildingsPgResource,
  pk: buildingsUniques[0].attributes
});
const nodeFetcher_Building = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Building));
  return nodeIdHandler_Building.get(nodeIdHandler_Building.getSpec($decoded));
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
  Post: nodeIdHandler_Post,
  Offer: nodeIdHandler_Offer,
  Street: nodeIdHandler_Street,
  Property: nodeIdHandler_Property,
  StreetProperty: nodeIdHandler_StreetProperty,
  House: nodeIdHandler_House,
  Building: nodeIdHandler_Building
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
const OfferCondition_idApply = ($condition, val) => applyAttributeCondition("id", TYPES.int, $condition, val);
const OffersOrderBy_ID_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "id",
    direction: "ASC"
  });
  queryBuilder.setOrderIsUnique();
};
const OffersOrderBy_ID_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "id",
    direction: "DESC"
  });
  queryBuilder.setOrderIsUnique();
};
const Property_streetIdPlan = $record => {
  return $record.get("street_id");
};
const Property_streetByStreetIdPlan = $record => resource_streetsPgResource.get({
  id: $record.get("street_id")
});
const House_propertyIdPlan = $record => {
  return $record.get("property_id");
};
const House_propertyByPropertyIdPlan = $record => resource_propertiesPgResource.get({
  id: $record.get("property_id")
});
const HouseCondition_streetIdApply = ($condition, val) => applyAttributeCondition("street_id", TYPES.int, $condition, val);
const HouseCondition_propertyIdApply = ($condition, val) => applyAttributeCondition("property_id", TYPES.int, $condition, val);
const HouseCondition_floorsApply = ($condition, val) => applyAttributeCondition("floors", TYPES.int, $condition, val);
const HousesOrderBy_PROPERTY_ID_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "property_id",
    direction: "ASC"
  });
};
const HousesOrderBy_PROPERTY_ID_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "property_id",
    direction: "DESC"
  });
};
const HousesOrderBy_FLOORS_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "floors",
    direction: "ASC"
  });
};
const HousesOrderBy_FLOORS_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "floors",
    direction: "DESC"
  });
};
const BuildingCondition_nameApply = ($condition, val) => applyAttributeCondition("name", TYPES.text, $condition, val);
function applyInputToInsert(_, $object) {
  return $object;
}
const specFromArgs_Post = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Post, $nodeId);
};
function applyInputToUpdateOrDelete(_, $object) {
  return $object;
}
const specFromArgs_Offer = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Offer, $nodeId);
};
const specFromArgs_Street = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Street, $nodeId);
};
const specFromArgs_Property = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Property, $nodeId);
};
const specFromArgs_StreetProperty = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_StreetProperty, $nodeId);
};
const specFromArgs_Building = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Building, $nodeId);
};
function getClientMutationIdForCreatePlan($mutation) {
  const $insert = $mutation.getStepForKey("result");
  return $insert.getMeta("clientMutationId");
}
function planCreatePayloadResult($object) {
  return $object.get("result");
}
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
const CreatePostPayload_postEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_postsPgResource, postsUniques[0].attributes, $mutation, fieldArgs);
function applyClientMutationIdForCreate(qb, val) {
  qb.setMeta("clientMutationId", val);
}
function applyCreateFields(qb, arg) {
  if (arg != null) {
    return qb.setBuilder();
  }
}
function PostInput_idApply(obj, val, {
  field,
  schema
}) {
  obj.set("id", bakedInputRuntime(schema, field.type, val));
}
const CreateOfferPayload_offerEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_offersPgResource, offersUniques[0].attributes, $mutation, fieldArgs);
const CreateOfferPayload_postByPostIdPlan = $record => resource_postsPgResource.get({
  id: $record.get("result").get("post_id")
});
function OfferInput_postIdApply(obj, val, {
  field,
  schema
}) {
  obj.set("post_id", bakedInputRuntime(schema, field.type, val));
}
const CreateStreetPayload_streetEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_streetsPgResource, streetsUniques[0].attributes, $mutation, fieldArgs);
function StreetInput_nameApply(obj, val, {
  field,
  schema
}) {
  obj.set("name", bakedInputRuntime(schema, field.type, val));
}
const CreatePropertyPayload_propertyEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_propertiesPgResource, propertiesUniques[0].attributes, $mutation, fieldArgs);
const CreatePropertyPayload_streetByStreetIdPlan = $record => resource_streetsPgResource.get({
  id: $record.get("result").get("street_id")
});
function PropertyInput_streetIdApply(obj, val, {
  field,
  schema
}) {
  obj.set("street_id", bakedInputRuntime(schema, field.type, val));
}
function PropertyInput_nameOrNumberApply(obj, val, {
  field,
  schema
}) {
  obj.set("name_or_number", bakedInputRuntime(schema, field.type, val));
}
const CreateStreetPropertyPayload_streetPropertyEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_street_propertyPgResource, street_propertyUniques[0].attributes, $mutation, fieldArgs);
const CreateStreetPropertyPayload_propertyByPropIdPlan = $record => resource_propertiesPgResource.get({
  id: $record.get("result").get("prop_id")
});
const CreateStreetPropertyPayload_streetByStrIdPlan = $record => resource_streetsPgResource.get({
  id: $record.get("result").get("str_id")
});
function StreetPropertyInput_strIdApply(obj, val, {
  field,
  schema
}) {
  obj.set("str_id", bakedInputRuntime(schema, field.type, val));
}
function StreetPropertyInput_propIdApply(obj, val, {
  field,
  schema
}) {
  obj.set("prop_id", bakedInputRuntime(schema, field.type, val));
}
function StreetPropertyInput_currentOwnerApply(obj, val, {
  field,
  schema
}) {
  obj.set("current_owner", bakedInputRuntime(schema, field.type, val));
}
const CreateBuildingPayload_buildingEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_buildingsPgResource, buildingsUniques[0].attributes, $mutation, fieldArgs);
const CreateBuildingPayload_propertyByPropertyIdPlan = $record => resource_propertiesPgResource.get({
  id: $record.get("result").get("property_id")
});
const CreateBuildingPayload_namedAfterStreetPlan = $record => resource_streetsPgResource.get({
  name: $record.get("result").get("name")
});
function BuildingInput_propertyIdApply(obj, val, {
  field,
  schema
}) {
  obj.set("property_id", bakedInputRuntime(schema, field.type, val));
}
function BuildingInput_floorsApply(obj, val, {
  field,
  schema
}) {
  obj.set("floors", bakedInputRuntime(schema, field.type, val));
}
function BuildingInput_isPrimaryApply(obj, val, {
  field,
  schema
}) {
  obj.set("is_primary", bakedInputRuntime(schema, field.type, val));
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

  """Get a single \`Post\`."""
  postById(id: String!): Post

  """Get a single \`Offer\`."""
  offerById(id: Int!): Offer

  """Get a single \`Street\`."""
  streetById(id: Int!): Street

  """Get a single \`Street\`."""
  streetByName(name: String!): Street

  """Get a single \`Property\`."""
  propertyById(id: Int!): Property

  """Get a single \`StreetProperty\`."""
  streetPropertyByStrIdAndPropId(strId: Int!, propId: Int!): StreetProperty

  """Get a single \`House\`."""
  houseByStreetIdAndPropertyId(streetId: Int!, propertyId: Int!): House

  """Get a single \`Building\`."""
  buildingById(id: Int!): Building

  """Reads a single \`Post\` using its globally unique \`ID\`."""
  post(
    """The globally unique \`ID\` to be used in selecting a single \`Post\`."""
    nodeId: ID!
  ): Post

  """Reads a single \`Offer\` using its globally unique \`ID\`."""
  offer(
    """The globally unique \`ID\` to be used in selecting a single \`Offer\`."""
    nodeId: ID!
  ): Offer

  """Reads a single \`Street\` using its globally unique \`ID\`."""
  street(
    """The globally unique \`ID\` to be used in selecting a single \`Street\`."""
    nodeId: ID!
  ): Street

  """Reads a single \`Property\` using its globally unique \`ID\`."""
  property(
    """The globally unique \`ID\` to be used in selecting a single \`Property\`."""
    nodeId: ID!
  ): Property

  """Reads a single \`StreetProperty\` using its globally unique \`ID\`."""
  streetProperty(
    """
    The globally unique \`ID\` to be used in selecting a single \`StreetProperty\`.
    """
    nodeId: ID!
  ): StreetProperty

  """Reads a single \`House\` using its globally unique \`ID\`."""
  house(
    """The globally unique \`ID\` to be used in selecting a single \`House\`."""
    nodeId: ID!
  ): House

  """Reads a single \`Building\` using its globally unique \`ID\`."""
  building(
    """The globally unique \`ID\` to be used in selecting a single \`Building\`."""
    nodeId: ID!
  ): Building

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

  """Reads and enables pagination through a set of \`Offer\`."""
  allOffers(
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
    condition: OfferCondition

    """The method to use when ordering \`Offer\`."""
    orderBy: [OffersOrderBy!] = [PRIMARY_KEY_ASC]
  ): OffersConnection

  """Reads and enables pagination through a set of \`Street\`."""
  allStreets(
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
    condition: StreetCondition

    """The method to use when ordering \`Street\`."""
    orderBy: [StreetsOrderBy!] = [PRIMARY_KEY_ASC]
  ): StreetsConnection

  """Reads and enables pagination through a set of \`Property\`."""
  allProperties(
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
    condition: PropertyCondition

    """The method to use when ordering \`Property\`."""
    orderBy: [PropertiesOrderBy!] = [PRIMARY_KEY_ASC]
  ): PropertiesConnection

  """Reads and enables pagination through a set of \`StreetProperty\`."""
  allStreetProperties(
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
    condition: StreetPropertyCondition

    """The method to use when ordering \`StreetProperty\`."""
    orderBy: [StreetPropertiesOrderBy!] = [PRIMARY_KEY_ASC]
  ): StreetPropertiesConnection

  """Reads and enables pagination through a set of \`House\`."""
  allHouses(
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
    condition: HouseCondition

    """The method to use when ordering \`House\`."""
    orderBy: [HousesOrderBy!] = [PRIMARY_KEY_ASC]
  ): HousesConnection

  """Reads and enables pagination through a set of \`Building\`."""
  allBuildings(
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
    condition: BuildingCondition

    """The method to use when ordering \`Building\`."""
    orderBy: [BuildingsOrderBy!] = [PRIMARY_KEY_ASC]
  ): BuildingsConnection
}

"""An object with a globally unique \`ID\`."""
interface Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
}

type Post implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: String!

  """Reads and enables pagination through a set of \`Offer\`."""
  offersByPostId(
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
    condition: OfferCondition

    """The method to use when ordering \`Offer\`."""
    orderBy: [OffersOrderBy!] = [PRIMARY_KEY_ASC]
  ): OffersConnection!
}

"""A connection to a list of \`Offer\` values."""
type OffersConnection {
  """A list of \`Offer\` objects."""
  nodes: [Offer]!

  """
  A list of edges which contains the \`Offer\` and cursor to aid in pagination.
  """
  edges: [OffersEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Offer\` you could get from the connection."""
  totalCount: Int!
}

type Offer implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  postId: String

  """Reads a single \`Post\` that is related to this \`Offer\`."""
  postByPostId: Post
}

"""A \`Offer\` edge in the connection."""
type OffersEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Offer\` at the end of the edge."""
  node: Offer
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
A condition to be used against \`Offer\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input OfferCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`postId\` field."""
  postId: String
}

"""Methods to use when ordering \`Offer\`."""
enum OffersOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  POST_ID_ASC
  POST_ID_DESC
}

type Street implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  name: String!

  """Reads and enables pagination through a set of \`Property\`."""
  propertiesByStreetId(
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
    condition: PropertyCondition

    """The method to use when ordering \`Property\`."""
    orderBy: [PropertiesOrderBy!] = [PRIMARY_KEY_ASC]
  ): PropertiesConnection!

  """Reads and enables pagination through a set of \`StreetProperty\`."""
  streetPropertiesByStrId(
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
    condition: StreetPropertyCondition

    """The method to use when ordering \`StreetProperty\`."""
    orderBy: [StreetPropertiesOrderBy!] = [PRIMARY_KEY_ASC]
  ): StreetPropertiesConnection!

  """Reads and enables pagination through a set of \`Building\`."""
  buildingsNamedAfterStreet(
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
    condition: BuildingCondition

    """The method to use when ordering \`Building\`."""
    orderBy: [BuildingsOrderBy!] = [PRIMARY_KEY_ASC]
  ): BuildingsConnection!

  """Reads and enables pagination through a set of \`House\`."""
  housesByStreetId(
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
    condition: HouseCondition

    """The method to use when ordering \`House\`."""
    orderBy: [HousesOrderBy!] = [PRIMARY_KEY_ASC]
  ): HousesConnection!
}

"""A connection to a list of \`Property\` values."""
type PropertiesConnection {
  """A list of \`Property\` objects."""
  nodes: [Property]!

  """
  A list of edges which contains the \`Property\` and cursor to aid in pagination.
  """
  edges: [PropertiesEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Property\` you could get from the connection."""
  totalCount: Int!
}

type Property implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  streetId: Int!
  nameOrNumber: String!

  """Reads a single \`Street\` that is related to this \`Property\`."""
  streetByStreetId: Street

  """Reads and enables pagination through a set of \`StreetProperty\`."""
  streetPropertiesByPropId(
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
    condition: StreetPropertyCondition

    """The method to use when ordering \`StreetProperty\`."""
    orderBy: [StreetPropertiesOrderBy!] = [PRIMARY_KEY_ASC]
  ): StreetPropertiesConnection!

  """Reads and enables pagination through a set of \`Building\`."""
  buildingsByPropertyId(
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
    condition: BuildingCondition

    """The method to use when ordering \`Building\`."""
    orderBy: [BuildingsOrderBy!] = [PRIMARY_KEY_ASC]
  ): BuildingsConnection!

  """Reads and enables pagination through a set of \`House\`."""
  housesByPropertyId(
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
    condition: HouseCondition

    """The method to use when ordering \`House\`."""
    orderBy: [HousesOrderBy!] = [PRIMARY_KEY_ASC]
  ): HousesConnection!
}

"""A connection to a list of \`StreetProperty\` values."""
type StreetPropertiesConnection {
  """A list of \`StreetProperty\` objects."""
  nodes: [StreetProperty]!

  """
  A list of edges which contains the \`StreetProperty\` and cursor to aid in pagination.
  """
  edges: [StreetPropertiesEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`StreetProperty\` you could get from the connection."""
  totalCount: Int!
}

type StreetProperty implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  strId: Int!
  propId: Int!
  currentOwner: String

  """Reads a single \`Property\` that is related to this \`StreetProperty\`."""
  propertyByPropId: Property

  """Reads a single \`Street\` that is related to this \`StreetProperty\`."""
  streetByStrId: Street

  """Reads a single \`House\` that is related to this \`StreetProperty\`."""
  houseByStreetIdAndPropertyId: House
}

type House implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  buildingName: String
  propertyNameOrNumber: String!
  streetName: String!
  streetId: Int!
  buildingId: Int
  propertyId: Int!
  floors: Int

  """Reads a single \`Street\` that is related to this \`House\`."""
  streetByStreetId: Street

  """Reads a single \`Building\` that is related to this \`House\`."""
  buildingByBuildingId: Building

  """Reads a single \`Property\` that is related to this \`House\`."""
  propertyByPropertyId: Property

  """Reads a single \`StreetProperty\` that is related to this \`House\`."""
  streetPropertyByStreetIdAndPropertyId: StreetProperty
}

type Building implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  propertyId: Int!
  name: String!
  floors: Int!
  isPrimary: Boolean!

  """Reads a single \`Property\` that is related to this \`Building\`."""
  propertyByPropertyId: Property

  """Reads a single \`Street\` that is related to this \`Building\`."""
  namedAfterStreet: Street

  """Reads and enables pagination through a set of \`House\`."""
  housesByBuildingId(
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
    condition: HouseCondition

    """The method to use when ordering \`House\`."""
    orderBy: [HousesOrderBy!] = [PRIMARY_KEY_ASC]
  ): HousesConnection!
}

"""A connection to a list of \`House\` values."""
type HousesConnection {
  """A list of \`House\` objects."""
  nodes: [House]!

  """
  A list of edges which contains the \`House\` and cursor to aid in pagination.
  """
  edges: [HousesEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`House\` you could get from the connection."""
  totalCount: Int!
}

"""A \`House\` edge in the connection."""
type HousesEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`House\` at the end of the edge."""
  node: House
}

"""
A condition to be used against \`House\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input HouseCondition {
  """Checks for equality with the object’s \`buildingName\` field."""
  buildingName: String

  """Checks for equality with the object’s \`propertyNameOrNumber\` field."""
  propertyNameOrNumber: String

  """Checks for equality with the object’s \`streetName\` field."""
  streetName: String

  """Checks for equality with the object’s \`streetId\` field."""
  streetId: Int

  """Checks for equality with the object’s \`buildingId\` field."""
  buildingId: Int

  """Checks for equality with the object’s \`propertyId\` field."""
  propertyId: Int

  """Checks for equality with the object’s \`floors\` field."""
  floors: Int
}

"""Methods to use when ordering \`House\`."""
enum HousesOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  BUILDING_NAME_ASC
  BUILDING_NAME_DESC
  PROPERTY_NAME_OR_NUMBER_ASC
  PROPERTY_NAME_OR_NUMBER_DESC
  STREET_NAME_ASC
  STREET_NAME_DESC
  STREET_ID_ASC
  STREET_ID_DESC
  BUILDING_ID_ASC
  BUILDING_ID_DESC
  PROPERTY_ID_ASC
  PROPERTY_ID_DESC
  FLOORS_ASC
  FLOORS_DESC
}

"""A \`StreetProperty\` edge in the connection."""
type StreetPropertiesEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`StreetProperty\` at the end of the edge."""
  node: StreetProperty
}

"""
A condition to be used against \`StreetProperty\` object types. All fields are
tested for equality and combined with a logical ‘and.’
"""
input StreetPropertyCondition {
  """Checks for equality with the object’s \`strId\` field."""
  strId: Int

  """Checks for equality with the object’s \`propId\` field."""
  propId: Int

  """Checks for equality with the object’s \`currentOwner\` field."""
  currentOwner: String
}

"""Methods to use when ordering \`StreetProperty\`."""
enum StreetPropertiesOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  STR_ID_ASC
  STR_ID_DESC
  PROP_ID_ASC
  PROP_ID_DESC
  CURRENT_OWNER_ASC
  CURRENT_OWNER_DESC
}

"""A connection to a list of \`Building\` values."""
type BuildingsConnection {
  """A list of \`Building\` objects."""
  nodes: [Building]!

  """
  A list of edges which contains the \`Building\` and cursor to aid in pagination.
  """
  edges: [BuildingsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Building\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Building\` edge in the connection."""
type BuildingsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Building\` at the end of the edge."""
  node: Building
}

"""
A condition to be used against \`Building\` object types. All fields are tested
for equality and combined with a logical ‘and.’
"""
input BuildingCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`propertyId\` field."""
  propertyId: Int

  """Checks for equality with the object’s \`name\` field."""
  name: String

  """Checks for equality with the object’s \`floors\` field."""
  floors: Int

  """Checks for equality with the object’s \`isPrimary\` field."""
  isPrimary: Boolean
}

"""Methods to use when ordering \`Building\`."""
enum BuildingsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  PROPERTY_ID_ASC
  PROPERTY_ID_DESC
  NAME_ASC
  NAME_DESC
  FLOORS_ASC
  FLOORS_DESC
  IS_PRIMARY_ASC
  IS_PRIMARY_DESC
}

"""A \`Property\` edge in the connection."""
type PropertiesEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Property\` at the end of the edge."""
  node: Property
}

"""
A condition to be used against \`Property\` object types. All fields are tested
for equality and combined with a logical ‘and.’
"""
input PropertyCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`streetId\` field."""
  streetId: Int

  """Checks for equality with the object’s \`nameOrNumber\` field."""
  nameOrNumber: String
}

"""Methods to use when ordering \`Property\`."""
enum PropertiesOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  STREET_ID_ASC
  STREET_ID_DESC
  NAME_OR_NUMBER_ASC
  NAME_OR_NUMBER_DESC
}

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

"""A \`Post\` edge in the connection."""
type PostsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Post\` at the end of the edge."""
  node: Post
}

"""
A condition to be used against \`Post\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input PostCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: String
}

"""Methods to use when ordering \`Post\`."""
enum PostsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
}

"""A connection to a list of \`Street\` values."""
type StreetsConnection {
  """A list of \`Street\` objects."""
  nodes: [Street]!

  """
  A list of edges which contains the \`Street\` and cursor to aid in pagination.
  """
  edges: [StreetsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Street\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Street\` edge in the connection."""
type StreetsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Street\` at the end of the edge."""
  node: Street
}

"""
A condition to be used against \`Street\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input StreetCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`name\` field."""
  name: String
}

"""Methods to use when ordering \`Street\`."""
enum StreetsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  NAME_ASC
  NAME_DESC
}

"""
The root mutation type which contains root level fields which mutate data.
"""
type Mutation {
  """Creates a single \`Post\`."""
  createPost(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreatePostInput!
  ): CreatePostPayload

  """Creates a single \`Offer\`."""
  createOffer(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateOfferInput!
  ): CreateOfferPayload

  """Creates a single \`Street\`."""
  createStreet(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateStreetInput!
  ): CreateStreetPayload

  """Creates a single \`Property\`."""
  createProperty(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreatePropertyInput!
  ): CreatePropertyPayload

  """Creates a single \`StreetProperty\`."""
  createStreetProperty(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateStreetPropertyInput!
  ): CreateStreetPropertyPayload

  """Creates a single \`Building\`."""
  createBuilding(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateBuildingInput!
  ): CreateBuildingPayload

  """Updates a single \`Post\` using its globally unique id and a patch."""
  updatePost(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdatePostInput!
  ): UpdatePostPayload

  """Updates a single \`Post\` using a unique key and a patch."""
  updatePostById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdatePostByIdInput!
  ): UpdatePostPayload

  """Updates a single \`Offer\` using its globally unique id and a patch."""
  updateOffer(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateOfferInput!
  ): UpdateOfferPayload

  """Updates a single \`Offer\` using a unique key and a patch."""
  updateOfferById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateOfferByIdInput!
  ): UpdateOfferPayload

  """Updates a single \`Street\` using its globally unique id and a patch."""
  updateStreet(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateStreetInput!
  ): UpdateStreetPayload

  """Updates a single \`Street\` using a unique key and a patch."""
  updateStreetById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateStreetByIdInput!
  ): UpdateStreetPayload

  """Updates a single \`Street\` using a unique key and a patch."""
  updateStreetByName(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateStreetByNameInput!
  ): UpdateStreetPayload

  """Updates a single \`Property\` using its globally unique id and a patch."""
  updateProperty(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdatePropertyInput!
  ): UpdatePropertyPayload

  """Updates a single \`Property\` using a unique key and a patch."""
  updatePropertyById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdatePropertyByIdInput!
  ): UpdatePropertyPayload

  """
  Updates a single \`StreetProperty\` using its globally unique id and a patch.
  """
  updateStreetProperty(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateStreetPropertyInput!
  ): UpdateStreetPropertyPayload

  """Updates a single \`StreetProperty\` using a unique key and a patch."""
  updateStreetPropertyByStrIdAndPropId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateStreetPropertyByStrIdAndPropIdInput!
  ): UpdateStreetPropertyPayload

  """Updates a single \`Building\` using its globally unique id and a patch."""
  updateBuilding(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateBuildingInput!
  ): UpdateBuildingPayload

  """Updates a single \`Building\` using a unique key and a patch."""
  updateBuildingById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateBuildingByIdInput!
  ): UpdateBuildingPayload

  """Deletes a single \`Post\` using its globally unique id."""
  deletePost(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeletePostInput!
  ): DeletePostPayload

  """Deletes a single \`Post\` using a unique key."""
  deletePostById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeletePostByIdInput!
  ): DeletePostPayload

  """Deletes a single \`Offer\` using its globally unique id."""
  deleteOffer(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteOfferInput!
  ): DeleteOfferPayload

  """Deletes a single \`Offer\` using a unique key."""
  deleteOfferById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteOfferByIdInput!
  ): DeleteOfferPayload

  """Deletes a single \`Street\` using its globally unique id."""
  deleteStreet(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteStreetInput!
  ): DeleteStreetPayload

  """Deletes a single \`Street\` using a unique key."""
  deleteStreetById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteStreetByIdInput!
  ): DeleteStreetPayload

  """Deletes a single \`Street\` using a unique key."""
  deleteStreetByName(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteStreetByNameInput!
  ): DeleteStreetPayload

  """Deletes a single \`Property\` using its globally unique id."""
  deleteProperty(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeletePropertyInput!
  ): DeletePropertyPayload

  """Deletes a single \`Property\` using a unique key."""
  deletePropertyById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeletePropertyByIdInput!
  ): DeletePropertyPayload

  """Deletes a single \`StreetProperty\` using its globally unique id."""
  deleteStreetProperty(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteStreetPropertyInput!
  ): DeleteStreetPropertyPayload

  """Deletes a single \`StreetProperty\` using a unique key."""
  deleteStreetPropertyByStrIdAndPropId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteStreetPropertyByStrIdAndPropIdInput!
  ): DeleteStreetPropertyPayload

  """Deletes a single \`Building\` using its globally unique id."""
  deleteBuilding(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteBuildingInput!
  ): DeleteBuildingPayload

  """Deletes a single \`Building\` using a unique key."""
  deleteBuildingById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteBuildingByIdInput!
  ): DeleteBuildingPayload
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
    orderBy: [PostsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PostsEdge
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

"""An input for mutations affecting \`Post\`"""
input PostInput {
  id: String!
}

"""The output of our create \`Offer\` mutation."""
type CreateOfferPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Offer\` that was created by this mutation."""
  offer: Offer

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Offer\`. May be used by Relay 1."""
  offerEdge(
    """The method to use when ordering \`Offer\`."""
    orderBy: [OffersOrderBy!]! = [PRIMARY_KEY_ASC]
  ): OffersEdge

  """Reads a single \`Post\` that is related to this \`Offer\`."""
  postByPostId: Post
}

"""All input for the create \`Offer\` mutation."""
input CreateOfferInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`Offer\` to be created by this mutation."""
  offer: OfferInput!
}

"""An input for mutations affecting \`Offer\`"""
input OfferInput {
  id: Int!
  postId: String
}

"""The output of our create \`Street\` mutation."""
type CreateStreetPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Street\` that was created by this mutation."""
  street: Street

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Street\`. May be used by Relay 1."""
  streetEdge(
    """The method to use when ordering \`Street\`."""
    orderBy: [StreetsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): StreetsEdge
}

"""All input for the create \`Street\` mutation."""
input CreateStreetInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`Street\` to be created by this mutation."""
  street: StreetInput!
}

"""An input for mutations affecting \`Street\`"""
input StreetInput {
  id: Int
  name: String!
}

"""The output of our create \`Property\` mutation."""
type CreatePropertyPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Property\` that was created by this mutation."""
  property: Property

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Property\`. May be used by Relay 1."""
  propertyEdge(
    """The method to use when ordering \`Property\`."""
    orderBy: [PropertiesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PropertiesEdge

  """Reads a single \`Street\` that is related to this \`Property\`."""
  streetByStreetId: Street
}

"""All input for the create \`Property\` mutation."""
input CreatePropertyInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`Property\` to be created by this mutation."""
  property: PropertyInput!
}

"""An input for mutations affecting \`Property\`"""
input PropertyInput {
  id: Int
  streetId: Int!
  nameOrNumber: String!
}

"""The output of our create \`StreetProperty\` mutation."""
type CreateStreetPropertyPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`StreetProperty\` that was created by this mutation."""
  streetProperty: StreetProperty

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`StreetProperty\`. May be used by Relay 1."""
  streetPropertyEdge(
    """The method to use when ordering \`StreetProperty\`."""
    orderBy: [StreetPropertiesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): StreetPropertiesEdge

  """Reads a single \`Property\` that is related to this \`StreetProperty\`."""
  propertyByPropId: Property

  """Reads a single \`Street\` that is related to this \`StreetProperty\`."""
  streetByStrId: Street
}

"""All input for the create \`StreetProperty\` mutation."""
input CreateStreetPropertyInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`StreetProperty\` to be created by this mutation."""
  streetProperty: StreetPropertyInput!
}

"""An input for mutations affecting \`StreetProperty\`"""
input StreetPropertyInput {
  strId: Int!
  propId: Int!
  currentOwner: String
}

"""The output of our create \`Building\` mutation."""
type CreateBuildingPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Building\` that was created by this mutation."""
  building: Building

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Building\`. May be used by Relay 1."""
  buildingEdge(
    """The method to use when ordering \`Building\`."""
    orderBy: [BuildingsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): BuildingsEdge

  """Reads a single \`Property\` that is related to this \`Building\`."""
  propertyByPropertyId: Property

  """Reads a single \`Street\` that is related to this \`Building\`."""
  namedAfterStreet: Street
}

"""All input for the create \`Building\` mutation."""
input CreateBuildingInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`Building\` to be created by this mutation."""
  building: BuildingInput!
}

"""An input for mutations affecting \`Building\`"""
input BuildingInput {
  id: Int
  propertyId: Int!
  name: String!
  floors: Int
  isPrimary: Boolean
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
    orderBy: [PostsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PostsEdge
}

"""All input for the \`updatePost\` mutation."""
input UpdatePostInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Post\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`Post\` being updated.
  """
  postPatch: PostPatch!
}

"""Represents an update to a \`Post\`. Fields that are set will be updated."""
input PostPatch {
  id: String
}

"""All input for the \`updatePostById\` mutation."""
input UpdatePostByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: String!

  """
  An object where the defined keys will be set on the \`Post\` being updated.
  """
  postPatch: PostPatch!
}

"""The output of our update \`Offer\` mutation."""
type UpdateOfferPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Offer\` that was updated by this mutation."""
  offer: Offer

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Offer\`. May be used by Relay 1."""
  offerEdge(
    """The method to use when ordering \`Offer\`."""
    orderBy: [OffersOrderBy!]! = [PRIMARY_KEY_ASC]
  ): OffersEdge

  """Reads a single \`Post\` that is related to this \`Offer\`."""
  postByPostId: Post
}

"""All input for the \`updateOffer\` mutation."""
input UpdateOfferInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Offer\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`Offer\` being updated.
  """
  offerPatch: OfferPatch!
}

"""
Represents an update to a \`Offer\`. Fields that are set will be updated.
"""
input OfferPatch {
  id: Int
  postId: String
}

"""All input for the \`updateOfferById\` mutation."""
input UpdateOfferByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`Offer\` being updated.
  """
  offerPatch: OfferPatch!
}

"""The output of our update \`Street\` mutation."""
type UpdateStreetPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Street\` that was updated by this mutation."""
  street: Street

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Street\`. May be used by Relay 1."""
  streetEdge(
    """The method to use when ordering \`Street\`."""
    orderBy: [StreetsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): StreetsEdge
}

"""All input for the \`updateStreet\` mutation."""
input UpdateStreetInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Street\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`Street\` being updated.
  """
  streetPatch: StreetPatch!
}

"""
Represents an update to a \`Street\`. Fields that are set will be updated.
"""
input StreetPatch {
  id: Int
  name: String
}

"""All input for the \`updateStreetById\` mutation."""
input UpdateStreetByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`Street\` being updated.
  """
  streetPatch: StreetPatch!
}

"""All input for the \`updateStreetByName\` mutation."""
input UpdateStreetByNameInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  name: String!

  """
  An object where the defined keys will be set on the \`Street\` being updated.
  """
  streetPatch: StreetPatch!
}

"""The output of our update \`Property\` mutation."""
type UpdatePropertyPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Property\` that was updated by this mutation."""
  property: Property

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Property\`. May be used by Relay 1."""
  propertyEdge(
    """The method to use when ordering \`Property\`."""
    orderBy: [PropertiesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PropertiesEdge

  """Reads a single \`Street\` that is related to this \`Property\`."""
  streetByStreetId: Street
}

"""All input for the \`updateProperty\` mutation."""
input UpdatePropertyInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Property\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`Property\` being updated.
  """
  propertyPatch: PropertyPatch!
}

"""
Represents an update to a \`Property\`. Fields that are set will be updated.
"""
input PropertyPatch {
  id: Int
  streetId: Int
  nameOrNumber: String
}

"""All input for the \`updatePropertyById\` mutation."""
input UpdatePropertyByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`Property\` being updated.
  """
  propertyPatch: PropertyPatch!
}

"""The output of our update \`StreetProperty\` mutation."""
type UpdateStreetPropertyPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`StreetProperty\` that was updated by this mutation."""
  streetProperty: StreetProperty

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`StreetProperty\`. May be used by Relay 1."""
  streetPropertyEdge(
    """The method to use when ordering \`StreetProperty\`."""
    orderBy: [StreetPropertiesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): StreetPropertiesEdge

  """Reads a single \`Property\` that is related to this \`StreetProperty\`."""
  propertyByPropId: Property

  """Reads a single \`Street\` that is related to this \`StreetProperty\`."""
  streetByStrId: Street
}

"""All input for the \`updateStreetProperty\` mutation."""
input UpdateStreetPropertyInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`StreetProperty\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`StreetProperty\` being updated.
  """
  streetPropertyPatch: StreetPropertyPatch!
}

"""
Represents an update to a \`StreetProperty\`. Fields that are set will be updated.
"""
input StreetPropertyPatch {
  strId: Int
  propId: Int
  currentOwner: String
}

"""All input for the \`updateStreetPropertyByStrIdAndPropId\` mutation."""
input UpdateStreetPropertyByStrIdAndPropIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  strId: Int!
  propId: Int!

  """
  An object where the defined keys will be set on the \`StreetProperty\` being updated.
  """
  streetPropertyPatch: StreetPropertyPatch!
}

"""The output of our update \`Building\` mutation."""
type UpdateBuildingPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Building\` that was updated by this mutation."""
  building: Building

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Building\`. May be used by Relay 1."""
  buildingEdge(
    """The method to use when ordering \`Building\`."""
    orderBy: [BuildingsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): BuildingsEdge

  """Reads a single \`Property\` that is related to this \`Building\`."""
  propertyByPropertyId: Property

  """Reads a single \`Street\` that is related to this \`Building\`."""
  namedAfterStreet: Street
}

"""All input for the \`updateBuilding\` mutation."""
input UpdateBuildingInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Building\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`Building\` being updated.
  """
  buildingPatch: BuildingPatch!
}

"""
Represents an update to a \`Building\`. Fields that are set will be updated.
"""
input BuildingPatch {
  id: Int
  propertyId: Int
  name: String
  floors: Int
  isPrimary: Boolean
}

"""All input for the \`updateBuildingById\` mutation."""
input UpdateBuildingByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`Building\` being updated.
  """
  buildingPatch: BuildingPatch!
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
  deletedPostViewId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Post\`. May be used by Relay 1."""
  postEdge(
    """The method to use when ordering \`Post\`."""
    orderBy: [PostsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PostsEdge
}

"""All input for the \`deletePost\` mutation."""
input DeletePostInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Post\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deletePostById\` mutation."""
input DeletePostByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: String!
}

"""The output of our delete \`Offer\` mutation."""
type DeleteOfferPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Offer\` that was deleted by this mutation."""
  offer: Offer
  deletedOfferViewId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Offer\`. May be used by Relay 1."""
  offerEdge(
    """The method to use when ordering \`Offer\`."""
    orderBy: [OffersOrderBy!]! = [PRIMARY_KEY_ASC]
  ): OffersEdge

  """Reads a single \`Post\` that is related to this \`Offer\`."""
  postByPostId: Post
}

"""All input for the \`deleteOffer\` mutation."""
input DeleteOfferInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Offer\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteOfferById\` mutation."""
input DeleteOfferByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!
}

"""The output of our delete \`Street\` mutation."""
type DeleteStreetPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Street\` that was deleted by this mutation."""
  street: Street
  deletedStreetId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Street\`. May be used by Relay 1."""
  streetEdge(
    """The method to use when ordering \`Street\`."""
    orderBy: [StreetsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): StreetsEdge
}

"""All input for the \`deleteStreet\` mutation."""
input DeleteStreetInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Street\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteStreetById\` mutation."""
input DeleteStreetByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!
}

"""All input for the \`deleteStreetByName\` mutation."""
input DeleteStreetByNameInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  name: String!
}

"""The output of our delete \`Property\` mutation."""
type DeletePropertyPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Property\` that was deleted by this mutation."""
  property: Property
  deletedPropertyId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Property\`. May be used by Relay 1."""
  propertyEdge(
    """The method to use when ordering \`Property\`."""
    orderBy: [PropertiesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PropertiesEdge

  """Reads a single \`Street\` that is related to this \`Property\`."""
  streetByStreetId: Street
}

"""All input for the \`deleteProperty\` mutation."""
input DeletePropertyInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Property\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deletePropertyById\` mutation."""
input DeletePropertyByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!
}

"""The output of our delete \`StreetProperty\` mutation."""
type DeleteStreetPropertyPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`StreetProperty\` that was deleted by this mutation."""
  streetProperty: StreetProperty
  deletedStreetPropertyId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`StreetProperty\`. May be used by Relay 1."""
  streetPropertyEdge(
    """The method to use when ordering \`StreetProperty\`."""
    orderBy: [StreetPropertiesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): StreetPropertiesEdge

  """Reads a single \`Property\` that is related to this \`StreetProperty\`."""
  propertyByPropId: Property

  """Reads a single \`Street\` that is related to this \`StreetProperty\`."""
  streetByStrId: Street
}

"""All input for the \`deleteStreetProperty\` mutation."""
input DeleteStreetPropertyInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`StreetProperty\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteStreetPropertyByStrIdAndPropId\` mutation."""
input DeleteStreetPropertyByStrIdAndPropIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  strId: Int!
  propId: Int!
}

"""The output of our delete \`Building\` mutation."""
type DeleteBuildingPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Building\` that was deleted by this mutation."""
  building: Building
  deletedBuildingId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Building\`. May be used by Relay 1."""
  buildingEdge(
    """The method to use when ordering \`Building\`."""
    orderBy: [BuildingsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): BuildingsEdge

  """Reads a single \`Property\` that is related to this \`Building\`."""
  propertyByPropertyId: Property

  """Reads a single \`Street\` that is related to this \`Building\`."""
  namedAfterStreet: Street
}

"""All input for the \`deleteBuilding\` mutation."""
input DeleteBuildingInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Building\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteBuildingById\` mutation."""
input DeleteBuildingByIdInput {
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
      allBuildings: {
        plan() {
          return connection(resource_buildingsPgResource.find());
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
      allHouses: {
        plan() {
          return connection(resource_housesPgResource.find());
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
      allOffers: {
        plan() {
          return connection(resource_offersPgResource.find());
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
          return connection(resource_postsPgResource.find());
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
      allProperties: {
        plan() {
          return connection(resource_propertiesPgResource.find());
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
      allStreetProperties: {
        plan() {
          return connection(resource_street_propertyPgResource.find());
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
      allStreets: {
        plan() {
          return connection(resource_streetsPgResource.find());
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
      building(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_Building($nodeId);
      },
      buildingById(_$root, {
        $id
      }) {
        return resource_buildingsPgResource.get({
          id: $id
        });
      },
      house(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_House($nodeId);
      },
      houseByStreetIdAndPropertyId(_$root, {
        $streetId,
        $propertyId
      }) {
        return resource_housesPgResource.get({
          street_id: $streetId,
          property_id: $propertyId
        });
      },
      node(_$root, fieldArgs) {
        return fieldArgs.getRaw("nodeId");
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_Query.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Query.codec.name].encode);
      },
      offer(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_Offer($nodeId);
      },
      offerById(_$root, {
        $id
      }) {
        return resource_offersPgResource.get({
          id: $id
        });
      },
      post(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_Post($nodeId);
      },
      postById(_$root, {
        $id
      }) {
        return resource_postsPgResource.get({
          id: $id
        });
      },
      property(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_Property($nodeId);
      },
      propertyById(_$root, {
        $id
      }) {
        return resource_propertiesPgResource.get({
          id: $id
        });
      },
      query() {
        return rootValue();
      },
      street(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_Street($nodeId);
      },
      streetById(_$root, {
        $id
      }) {
        return resource_streetsPgResource.get({
          id: $id
        });
      },
      streetByName(_$root, {
        $name
      }) {
        return resource_streetsPgResource.get({
          name: $name
        });
      },
      streetProperty(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_StreetProperty($nodeId);
      },
      streetPropertyByStrIdAndPropId(_$root, {
        $strId,
        $propId
      }) {
        return resource_street_propertyPgResource.get({
          str_id: $strId,
          prop_id: $propId
        });
      }
    }
  },
  Mutation: {
    assertStep: __ValueStep,
    plans: {
      createBuilding: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_buildingsPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createOffer: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_offersPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createPost: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_postsPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createProperty: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_propertiesPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createStreet: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_streetsPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createStreetProperty: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_street_propertyPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      deleteBuilding: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_buildingsPgResource, specFromArgs_Building(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteBuildingById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_buildingsPgResource, {
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
      deleteOffer: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_offersPgResource, specFromArgs_Offer(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteOfferById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_offersPgResource, {
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
      deletePost: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_postsPgResource, specFromArgs_Post(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deletePostById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_postsPgResource, {
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
      deleteProperty: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_propertiesPgResource, specFromArgs_Property(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deletePropertyById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_propertiesPgResource, {
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
      deleteStreet: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_streetsPgResource, specFromArgs_Street(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteStreetById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_streetsPgResource, {
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
      deleteStreetByName: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_streetsPgResource, {
            name: args.getRaw(['input', "name"])
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
      deleteStreetProperty: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_street_propertyPgResource, specFromArgs_StreetProperty(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteStreetPropertyByStrIdAndPropId: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_street_propertyPgResource, {
            str_id: args.getRaw(['input', "strId"]),
            prop_id: args.getRaw(['input', "propId"])
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
      updateBuilding: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_buildingsPgResource, specFromArgs_Building(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateBuildingById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_buildingsPgResource, {
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
      updateOffer: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_offersPgResource, specFromArgs_Offer(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateOfferById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_offersPgResource, {
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
      updatePost: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_postsPgResource, specFromArgs_Post(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updatePostById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_postsPgResource, {
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
      updateProperty: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_propertiesPgResource, specFromArgs_Property(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updatePropertyById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_propertiesPgResource, {
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
      updateStreet: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_streetsPgResource, specFromArgs_Street(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateStreetById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_streetsPgResource, {
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
      updateStreetByName: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_streetsPgResource, {
            name: args.getRaw(['input', "name"])
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
      updateStreetProperty: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_street_propertyPgResource, specFromArgs_StreetProperty(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateStreetPropertyByStrIdAndPropId: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_street_propertyPgResource, {
            str_id: args.getRaw(['input', "strId"]),
            prop_id: args.getRaw(['input', "propId"])
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
  Building: {
    assertStep: assertPgClassSingleStep,
    plans: {
      housesByBuildingId: {
        plan($record) {
          const $records = resource_housesPgResource.find({
            building_id: $record.get("id")
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
      isPrimary($record) {
        return $record.get("is_primary");
      },
      namedAfterStreet($record) {
        return resource_streetsPgResource.get({
          name: $record.get("name")
        });
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_Building.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Building.codec.name].encode);
      },
      propertyByPropertyId: House_propertyByPropertyIdPlan,
      propertyId: House_propertyIdPlan
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of buildingsUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_buildingsPgResource.get(spec);
    }
  },
  BuildingsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  CreateBuildingPayload: {
    assertStep: assertStep,
    plans: {
      building: planCreatePayloadResult,
      buildingEdge: CreateBuildingPayload_buildingEdgePlan,
      clientMutationId: getClientMutationIdForCreatePlan,
      namedAfterStreet: CreateBuildingPayload_namedAfterStreetPlan,
      propertyByPropertyId: CreateBuildingPayload_propertyByPropertyIdPlan,
      query: queryPlan
    }
  },
  CreateOfferPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      offer: planCreatePayloadResult,
      offerEdge: CreateOfferPayload_offerEdgePlan,
      postByPostId: CreateOfferPayload_postByPostIdPlan,
      query: queryPlan
    }
  },
  CreatePostPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      post: planCreatePayloadResult,
      postEdge: CreatePostPayload_postEdgePlan,
      query: queryPlan
    }
  },
  CreatePropertyPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      property: planCreatePayloadResult,
      propertyEdge: CreatePropertyPayload_propertyEdgePlan,
      query: queryPlan,
      streetByStreetId: CreatePropertyPayload_streetByStreetIdPlan
    }
  },
  CreateStreetPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan,
      street: planCreatePayloadResult,
      streetEdge: CreateStreetPayload_streetEdgePlan
    }
  },
  CreateStreetPropertyPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      propertyByPropId: CreateStreetPropertyPayload_propertyByPropIdPlan,
      query: queryPlan,
      streetByStrId: CreateStreetPropertyPayload_streetByStrIdPlan,
      streetProperty: planCreatePayloadResult,
      streetPropertyEdge: CreateStreetPropertyPayload_streetPropertyEdgePlan
    }
  },
  DeleteBuildingPayload: {
    assertStep: ObjectStep,
    plans: {
      building: planCreatePayloadResult,
      buildingEdge: CreateBuildingPayload_buildingEdgePlan,
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedBuildingId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Building.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      namedAfterStreet: CreateBuildingPayload_namedAfterStreetPlan,
      propertyByPropertyId: CreateBuildingPayload_propertyByPropertyIdPlan,
      query: queryPlan
    }
  },
  DeleteOfferPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedOfferViewId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Offer.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      offer: planCreatePayloadResult,
      offerEdge: CreateOfferPayload_offerEdgePlan,
      postByPostId: CreateOfferPayload_postByPostIdPlan,
      query: queryPlan
    }
  },
  DeletePostPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedPostViewId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Post.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      post: planCreatePayloadResult,
      postEdge: CreatePostPayload_postEdgePlan,
      query: queryPlan
    }
  },
  DeletePropertyPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedPropertyId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Property.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      property: planCreatePayloadResult,
      propertyEdge: CreatePropertyPayload_propertyEdgePlan,
      query: queryPlan,
      streetByStreetId: CreatePropertyPayload_streetByStreetIdPlan
    }
  },
  DeleteStreetPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedStreetId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Street.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      query: queryPlan,
      street: planCreatePayloadResult,
      streetEdge: CreateStreetPayload_streetEdgePlan
    }
  },
  DeleteStreetPropertyPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedStreetPropertyId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_StreetProperty.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      propertyByPropId: CreateStreetPropertyPayload_propertyByPropIdPlan,
      query: queryPlan,
      streetByStrId: CreateStreetPropertyPayload_streetByStrIdPlan,
      streetProperty: planCreatePayloadResult,
      streetPropertyEdge: CreateStreetPropertyPayload_streetPropertyEdgePlan
    }
  },
  House: {
    assertStep: assertPgClassSingleStep,
    plans: {
      buildingByBuildingId($record) {
        return resource_buildingsPgResource.get({
          id: $record.get("building_id")
        });
      },
      buildingId($record) {
        return $record.get("building_id");
      },
      buildingName($record) {
        return $record.get("building_name");
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_House.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_House.codec.name].encode);
      },
      propertyByPropertyId: House_propertyByPropertyIdPlan,
      propertyId: House_propertyIdPlan,
      propertyNameOrNumber($record) {
        return $record.get("property_name_or_number");
      },
      streetByStreetId: Property_streetByStreetIdPlan,
      streetId: Property_streetIdPlan,
      streetName($record) {
        return $record.get("street_name");
      },
      streetPropertyByStreetIdAndPropertyId($record) {
        return resource_street_propertyPgResource.get({
          str_id: $record.get("street_id"),
          prop_id: $record.get("property_id")
        });
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of housesUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_housesPgResource.get(spec);
    }
  },
  HousesConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  Offer: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nodeId($parent) {
        const specifier = nodeIdHandler_Offer.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Offer.codec.name].encode);
      },
      postByPostId($record) {
        return resource_postsPgResource.get({
          id: $record.get("post_id")
        });
      },
      postId($record) {
        return $record.get("post_id");
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of offersUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_offersPgResource.get(spec);
    }
  },
  OffersConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  Post: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nodeId($parent) {
        const specifier = nodeIdHandler_Post.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Post.codec.name].encode);
      },
      offersByPostId: {
        plan($record) {
          const $records = resource_offersPgResource.find({
            post_id: $record.get("id")
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
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of postsUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_postsPgResource.get(spec);
    }
  },
  PostsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  PropertiesConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  Property: {
    assertStep: assertPgClassSingleStep,
    plans: {
      buildingsByPropertyId: {
        plan($record) {
          const $records = resource_buildingsPgResource.find({
            property_id: $record.get("id")
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
      housesByPropertyId: {
        plan($record) {
          const $records = resource_housesPgResource.find({
            property_id: $record.get("id")
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
      nameOrNumber($record) {
        return $record.get("name_or_number");
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_Property.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Property.codec.name].encode);
      },
      streetByStreetId: Property_streetByStreetIdPlan,
      streetId: Property_streetIdPlan,
      streetPropertiesByPropId: {
        plan($record) {
          const $records = resource_street_propertyPgResource.find({
            prop_id: $record.get("id")
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
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of propertiesUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_propertiesPgResource.get(spec);
    }
  },
  Street: {
    assertStep: assertPgClassSingleStep,
    plans: {
      buildingsNamedAfterStreet: {
        plan($record) {
          const $records = resource_buildingsPgResource.find({
            name: $record.get("name")
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
      housesByStreetId: {
        plan($record) {
          const $records = resource_housesPgResource.find({
            street_id: $record.get("id")
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
      nodeId($parent) {
        const specifier = nodeIdHandler_Street.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Street.codec.name].encode);
      },
      propertiesByStreetId: {
        plan($record) {
          const $records = resource_propertiesPgResource.find({
            street_id: $record.get("id")
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
      streetPropertiesByStrId: {
        plan($record) {
          const $records = resource_street_propertyPgResource.find({
            str_id: $record.get("id")
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
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of streetsUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_streetsPgResource.get(spec);
    }
  },
  StreetPropertiesConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  StreetProperty: {
    assertStep: assertPgClassSingleStep,
    plans: {
      currentOwner($record) {
        return $record.get("current_owner");
      },
      houseByStreetIdAndPropertyId($record) {
        return resource_housesPgResource.get({
          street_id: $record.get("str_id"),
          property_id: $record.get("prop_id")
        });
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_StreetProperty.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_StreetProperty.codec.name].encode);
      },
      propertyByPropId($record) {
        return resource_propertiesPgResource.get({
          id: $record.get("prop_id")
        });
      },
      propId($record) {
        return $record.get("prop_id");
      },
      streetByStrId($record) {
        return resource_streetsPgResource.get({
          id: $record.get("str_id")
        });
      },
      strId($record) {
        return $record.get("str_id");
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of street_propertyUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_street_propertyPgResource.get(spec);
    }
  },
  StreetsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  UpdateBuildingPayload: {
    assertStep: ObjectStep,
    plans: {
      building: planCreatePayloadResult,
      buildingEdge: CreateBuildingPayload_buildingEdgePlan,
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      namedAfterStreet: CreateBuildingPayload_namedAfterStreetPlan,
      propertyByPropertyId: CreateBuildingPayload_propertyByPropertyIdPlan,
      query: queryPlan
    }
  },
  UpdateOfferPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      offer: planCreatePayloadResult,
      offerEdge: CreateOfferPayload_offerEdgePlan,
      postByPostId: CreateOfferPayload_postByPostIdPlan,
      query: queryPlan
    }
  },
  UpdatePostPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      post: planCreatePayloadResult,
      postEdge: CreatePostPayload_postEdgePlan,
      query: queryPlan
    }
  },
  UpdatePropertyPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      property: planCreatePayloadResult,
      propertyEdge: CreatePropertyPayload_propertyEdgePlan,
      query: queryPlan,
      streetByStreetId: CreatePropertyPayload_streetByStreetIdPlan
    }
  },
  UpdateStreetPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan,
      street: planCreatePayloadResult,
      streetEdge: CreateStreetPayload_streetEdgePlan
    }
  },
  UpdateStreetPropertyPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      propertyByPropId: CreateStreetPropertyPayload_propertyByPropIdPlan,
      query: queryPlan,
      streetByStrId: CreateStreetPropertyPayload_streetByStrIdPlan,
      streetProperty: planCreatePayloadResult,
      streetPropertyEdge: CreateStreetPropertyPayload_streetPropertyEdgePlan
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
  BuildingCondition: {
    plans: {
      floors: HouseCondition_floorsApply,
      id: OfferCondition_idApply,
      isPrimary($condition, val) {
        return applyAttributeCondition("is_primary", TYPES.boolean, $condition, val);
      },
      name: BuildingCondition_nameApply,
      propertyId: HouseCondition_propertyIdApply
    }
  },
  BuildingInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      floors: BuildingInput_floorsApply,
      id: PostInput_idApply,
      isPrimary: BuildingInput_isPrimaryApply,
      name: StreetInput_nameApply,
      propertyId: BuildingInput_propertyIdApply
    }
  },
  BuildingPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      floors: BuildingInput_floorsApply,
      id: PostInput_idApply,
      isPrimary: BuildingInput_isPrimaryApply,
      name: StreetInput_nameApply,
      propertyId: BuildingInput_propertyIdApply
    }
  },
  CreateBuildingInput: {
    plans: {
      building: applyCreateFields,
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  CreateOfferInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      offer: applyCreateFields
    }
  },
  CreatePostInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      post: applyCreateFields
    }
  },
  CreatePropertyInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      property: applyCreateFields
    }
  },
  CreateStreetInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      street: applyCreateFields
    }
  },
  CreateStreetPropertyInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      streetProperty: applyCreateFields
    }
  },
  DeleteBuildingByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteBuildingInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteOfferByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteOfferInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeletePostByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeletePostInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeletePropertyByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeletePropertyInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteStreetByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteStreetByNameInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteStreetInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteStreetPropertyByStrIdAndPropIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteStreetPropertyInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  HouseCondition: {
    plans: {
      buildingId($condition, val) {
        return applyAttributeCondition("building_id", TYPES.int, $condition, val);
      },
      buildingName($condition, val) {
        return applyAttributeCondition("building_name", TYPES.text, $condition, val);
      },
      floors: HouseCondition_floorsApply,
      propertyId: HouseCondition_propertyIdApply,
      propertyNameOrNumber($condition, val) {
        return applyAttributeCondition("property_name_or_number", TYPES.text, $condition, val);
      },
      streetId: HouseCondition_streetIdApply,
      streetName($condition, val) {
        return applyAttributeCondition("street_name", TYPES.text, $condition, val);
      }
    }
  },
  OfferCondition: {
    plans: {
      id: OfferCondition_idApply,
      postId($condition, val) {
        return applyAttributeCondition("post_id", TYPES.text, $condition, val);
      }
    }
  },
  OfferInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      id: PostInput_idApply,
      postId: OfferInput_postIdApply
    }
  },
  OfferPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      id: PostInput_idApply,
      postId: OfferInput_postIdApply
    }
  },
  PostCondition: {
    plans: {
      id($condition, val) {
        return applyAttributeCondition("id", TYPES.text, $condition, val);
      }
    }
  },
  PostInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      id: PostInput_idApply
    }
  },
  PostPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      id: PostInput_idApply
    }
  },
  PropertyCondition: {
    plans: {
      id: OfferCondition_idApply,
      nameOrNumber($condition, val) {
        return applyAttributeCondition("name_or_number", TYPES.text, $condition, val);
      },
      streetId: HouseCondition_streetIdApply
    }
  },
  PropertyInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      id: PostInput_idApply,
      nameOrNumber: PropertyInput_nameOrNumberApply,
      streetId: PropertyInput_streetIdApply
    }
  },
  PropertyPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      id: PostInput_idApply,
      nameOrNumber: PropertyInput_nameOrNumberApply,
      streetId: PropertyInput_streetIdApply
    }
  },
  StreetCondition: {
    plans: {
      id: OfferCondition_idApply,
      name: BuildingCondition_nameApply
    }
  },
  StreetInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      id: PostInput_idApply,
      name: StreetInput_nameApply
    }
  },
  StreetPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      id: PostInput_idApply,
      name: StreetInput_nameApply
    }
  },
  StreetPropertyCondition: {
    plans: {
      currentOwner($condition, val) {
        return applyAttributeCondition("current_owner", TYPES.text, $condition, val);
      },
      propId($condition, val) {
        return applyAttributeCondition("prop_id", TYPES.int, $condition, val);
      },
      strId($condition, val) {
        return applyAttributeCondition("str_id", TYPES.int, $condition, val);
      }
    }
  },
  StreetPropertyInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      currentOwner: StreetPropertyInput_currentOwnerApply,
      propId: StreetPropertyInput_propIdApply,
      strId: StreetPropertyInput_strIdApply
    }
  },
  StreetPropertyPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      currentOwner: StreetPropertyInput_currentOwnerApply,
      propId: StreetPropertyInput_propIdApply,
      strId: StreetPropertyInput_strIdApply
    }
  },
  UpdateBuildingByIdInput: {
    plans: {
      buildingPatch: applyCreateFields,
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  UpdateBuildingInput: {
    plans: {
      buildingPatch: applyCreateFields,
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  UpdateOfferByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      offerPatch: applyCreateFields
    }
  },
  UpdateOfferInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      offerPatch: applyCreateFields
    }
  },
  UpdatePostByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      postPatch: applyCreateFields
    }
  },
  UpdatePostInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      postPatch: applyCreateFields
    }
  },
  UpdatePropertyByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      propertyPatch: applyCreateFields
    }
  },
  UpdatePropertyInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      propertyPatch: applyCreateFields
    }
  },
  UpdateStreetByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      streetPatch: applyCreateFields
    }
  },
  UpdateStreetByNameInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      streetPatch: applyCreateFields
    }
  },
  UpdateStreetInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      streetPatch: applyCreateFields
    }
  },
  UpdateStreetPropertyByStrIdAndPropIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      streetPropertyPatch: applyCreateFields
    }
  },
  UpdateStreetPropertyInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      streetPropertyPatch: applyCreateFields
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
  BuildingsOrderBy: {
    values: {
      FLOORS_ASC: HousesOrderBy_FLOORS_ASCApply,
      FLOORS_DESC: HousesOrderBy_FLOORS_DESCApply,
      ID_ASC: OffersOrderBy_ID_ASCApply,
      ID_DESC: OffersOrderBy_ID_DESCApply,
      IS_PRIMARY_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "is_primary",
          direction: "ASC"
        });
      },
      IS_PRIMARY_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "is_primary",
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
      PRIMARY_KEY_ASC(queryBuilder) {
        buildingsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        buildingsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PROPERTY_ID_ASC: HousesOrderBy_PROPERTY_ID_ASCApply,
      PROPERTY_ID_DESC: HousesOrderBy_PROPERTY_ID_DESCApply
    }
  },
  HousesOrderBy: {
    values: {
      BUILDING_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "building_id",
          direction: "ASC"
        });
      },
      BUILDING_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "building_id",
          direction: "DESC"
        });
      },
      BUILDING_NAME_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "building_name",
          direction: "ASC"
        });
      },
      BUILDING_NAME_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "building_name",
          direction: "DESC"
        });
      },
      FLOORS_ASC: HousesOrderBy_FLOORS_ASCApply,
      FLOORS_DESC: HousesOrderBy_FLOORS_DESCApply,
      PRIMARY_KEY_ASC(queryBuilder) {
        housesUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        housesUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PROPERTY_ID_ASC: HousesOrderBy_PROPERTY_ID_ASCApply,
      PROPERTY_ID_DESC: HousesOrderBy_PROPERTY_ID_DESCApply,
      PROPERTY_NAME_OR_NUMBER_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "property_name_or_number",
          direction: "ASC"
        });
      },
      PROPERTY_NAME_OR_NUMBER_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "property_name_or_number",
          direction: "DESC"
        });
      },
      STREET_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "street_id",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      STREET_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "street_id",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
      },
      STREET_NAME_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "street_name",
          direction: "ASC"
        });
      },
      STREET_NAME_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "street_name",
          direction: "DESC"
        });
      }
    }
  },
  OffersOrderBy: {
    values: {
      ID_ASC: OffersOrderBy_ID_ASCApply,
      ID_DESC: OffersOrderBy_ID_DESCApply,
      POST_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "post_id",
          direction: "ASC"
        });
      },
      POST_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "post_id",
          direction: "DESC"
        });
      },
      PRIMARY_KEY_ASC(queryBuilder) {
        offersUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        offersUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      }
    }
  },
  PostsOrderBy: {
    values: {
      ID_ASC: OffersOrderBy_ID_ASCApply,
      ID_DESC: OffersOrderBy_ID_DESCApply,
      PRIMARY_KEY_ASC(queryBuilder) {
        postsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        postsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      }
    }
  },
  PropertiesOrderBy: {
    values: {
      ID_ASC: OffersOrderBy_ID_ASCApply,
      ID_DESC: OffersOrderBy_ID_DESCApply,
      NAME_OR_NUMBER_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "name_or_number",
          direction: "ASC"
        });
      },
      NAME_OR_NUMBER_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "name_or_number",
          direction: "DESC"
        });
      },
      PRIMARY_KEY_ASC(queryBuilder) {
        propertiesUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        propertiesUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      STREET_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "street_id",
          direction: "ASC"
        });
      },
      STREET_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "street_id",
          direction: "DESC"
        });
      }
    }
  },
  StreetPropertiesOrderBy: {
    values: {
      CURRENT_OWNER_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "current_owner",
          direction: "ASC"
        });
      },
      CURRENT_OWNER_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "current_owner",
          direction: "DESC"
        });
      },
      PRIMARY_KEY_ASC(queryBuilder) {
        street_propertyUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        street_propertyUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PROP_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "prop_id",
          direction: "ASC"
        });
      },
      PROP_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "prop_id",
          direction: "DESC"
        });
      },
      STR_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "str_id",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      STR_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "str_id",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
      }
    }
  },
  StreetsOrderBy: {
    values: {
      ID_ASC: OffersOrderBy_ID_ASCApply,
      ID_DESC: OffersOrderBy_ID_DESCApply,
      NAME_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "name",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      NAME_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "name",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_ASC(queryBuilder) {
        streetsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        streetsUniques[0].attributes.forEach(attributeName => {
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
