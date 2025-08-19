import { PgDeleteSingleStep, PgExecutor, TYPES, assertPgClassSingleStep, makeRegistry, pgDeleteSingle, pgInsertSingle, pgSelectFromRecord, pgUpdateSingle, recordCodec, sqlValueWithCodec } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ObjectStep, __ValueStep, access, assertExecutableStep, bakedInputRuntime, connection, constant, context, createObjectAndApplyChildren, first, get as get2, inhibitOnNull, inspect, lambda, list, makeDecodeNodeId, makeGrafastSchema, object, rootValue, specFromNodeId } from "grafast";
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
const post_tableIdentifier = sql.identifier("smart_comment_relations", "post");
const spec_post_table = {
  name: "post_table",
  identifier: post_tableIdentifier,
  attributes: {
    __proto__: null,
    id: {
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
};
const post_tableCodec = recordCodec(spec_post_table);
const postsIdentifier = sql.identifier("smart_comment_relations", "post_view");
const postsCodec = recordCodec({
  name: "posts",
  identifier: postsIdentifier,
  attributes: {
    __proto__: null,
    id: {
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
const spec_offer_table = {
  name: "offer_table",
  identifier: offer_tableIdentifier,
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
    post_id: {
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
};
const offer_tableCodec = recordCodec(spec_offer_table);
const offersIdentifier = sql.identifier("smart_comment_relations", "offer_view");
const offersCodec = recordCodec({
  name: "offers",
  identifier: offersIdentifier,
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
    post_id: {
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
      schemaName: "smart_comment_relations",
      name: "offer_view"
    },
    tags: {
      __proto__: null,
      name: "offers",
      primaryKey: "id",
      foreignKey: "(post_id) references post"
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
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {}
      }
    },
    name: {
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
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {}
      }
    },
    street_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    name_or_number: {
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
      schemaName: "smart_comment_relations",
      name: "properties"
    },
    tags: {
      __proto__: null
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
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    prop_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    current_owner: {
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
      schemaName: "smart_comment_relations",
      name: "street_property"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const housesIdentifier = sql.identifier("smart_comment_relations", "houses");
const spec_houses = {
  name: "houses",
  identifier: housesIdentifier,
  attributes: {
    __proto__: null,
    building_name: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    property_name_or_number: {
      description: undefined,
      codec: TYPES.text,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {
          notNull: true
        }
      }
    },
    street_name: {
      description: undefined,
      codec: TYPES.text,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {
          notNull: true
        }
      }
    },
    street_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    building_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    property_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    floors: {
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
};
const housesCodec = recordCodec(spec_houses);
const buildingsIdentifier = sql.identifier("smart_comment_relations", "buildings");
const buildingsCodec = recordCodec({
  name: "buildings",
  identifier: buildingsIdentifier,
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
    property_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    name: {
      description: undefined,
      codec: TYPES.text,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    floors: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {}
      }
    },
    is_primary: {
      description: undefined,
      codec: TYPES.boolean,
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
const registryConfig_pgResources_post_table_post_table = {
  executor: executor,
  name: "post_table",
  identifier: "main.smart_comment_relations.post",
  from: post_tableIdentifier,
  codec: post_tableCodec,
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
      schemaName: "smart_comment_relations",
      name: "post"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {
      name: "post_table",
      omit: true,
      behavior: spec_post_table.extensions.tags.behavior
    }
  }
};
const postsUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const registryConfig_pgResources_offer_table_offer_table = {
  executor: executor,
  name: "offer_table",
  identifier: "main.smart_comment_relations.offer",
  from: offer_tableIdentifier,
  codec: offer_tableCodec,
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
      schemaName: "smart_comment_relations",
      name: "offer"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {
      name: "offer_table",
      omit: true,
      behavior: spec_offer_table.extensions.tags.behavior
    }
  }
};
const offersUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const registryConfig_pgResources_offers_offers = {
  executor: executor,
  name: "offers",
  identifier: "main.smart_comment_relations.offer_view",
  from: offersIdentifier,
  codec: offersCodec,
  uniques: offersUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "smart_comment_relations",
      name: "offer_view"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {
      name: "offers",
      primaryKey: "id",
      foreignKey: "(post_id) references post"
    }
  }
};
const streetsUniques = [{
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
  attributes: ["name"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const registryConfig_pgResources_streets_streets = {
  executor: executor,
  name: "streets",
  identifier: "main.smart_comment_relations.streets",
  from: streetsIdentifier,
  codec: streetsCodec,
  uniques: streetsUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "smart_comment_relations",
      name: "streets"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {
      unique: "name"
    }
  }
};
const propertiesUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const registryConfig_pgResources_properties_properties = {
  executor: executor,
  name: "properties",
  identifier: "main.smart_comment_relations.properties",
  from: propertiesIdentifier,
  codec: propertiesCodec,
  uniques: propertiesUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "smart_comment_relations",
      name: "properties"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {}
  }
};
const street_propertyUniques = [{
  isPrimary: true,
  attributes: ["str_id", "prop_id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const registryConfig_pgResources_street_property_street_property = {
  executor: executor,
  name: "street_property",
  identifier: "main.smart_comment_relations.street_property",
  from: streetPropertyIdentifier,
  codec: streetPropertyCodec,
  uniques: street_propertyUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "smart_comment_relations",
      name: "street_property"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {}
  }
};
const housesUniques = [{
  isPrimary: true,
  attributes: ["street_id", "property_id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const registryConfig_pgResources_houses_houses = {
  executor: executor,
  name: "houses",
  identifier: "main.smart_comment_relations.houses",
  from: housesIdentifier,
  codec: housesCodec,
  uniques: housesUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
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
      foreignKey: spec_houses.extensions.tags.foreignKey
    }
  }
};
const buildingsUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const registryConfig_pgResources_buildings_buildings = {
  executor: executor,
  name: "buildings",
  identifier: "main.smart_comment_relations.buildings",
  from: buildingsIdentifier,
  codec: buildingsCodec,
  uniques: buildingsUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "smart_comment_relations",
      name: "buildings"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {
      foreignKey: "(name) references streets (name)|@fieldName namedAfterStreet|@foreignFieldName buildingsNamedAfterStreet|@foreignSimpleFieldName buildingsNamedAfterStreetList"
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
    buildings: buildingsCodec
  },
  pgResources: {
    __proto__: null,
    post_table: registryConfig_pgResources_post_table_post_table,
    posts: {
      executor: executor,
      name: "posts",
      identifier: "main.smart_comment_relations.post_view",
      from: postsIdentifier,
      codec: postsCodec,
      uniques: postsUniques,
      isVirtual: false,
      description: undefined,
      extensions: {
        description: undefined,
        pg: {
          serviceName: "main",
          schemaName: "smart_comment_relations",
          name: "post_view"
        },
        isInsertable: true,
        isUpdatable: true,
        isDeletable: true,
        tags: {
          name: "posts",
          primaryKey: "id"
        }
      }
    },
    offer_table: registryConfig_pgResources_offer_table_offer_table,
    offers: registryConfig_pgResources_offers_offers,
    streets: registryConfig_pgResources_streets_streets,
    properties: registryConfig_pgResources_properties_properties,
    street_property: registryConfig_pgResources_street_property_street_property,
    houses: registryConfig_pgResources_houses_houses,
    buildings: registryConfig_pgResources_buildings_buildings
  },
  pgRelations: {
    __proto__: null,
    buildings: {
      __proto__: null,
      propertiesByMyPropertyId: {
        localCodec: buildingsCodec,
        remoteResourceOptions: registryConfig_pgResources_properties_properties,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["property_id"],
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
      namedAfterStreet: {
        localCodec: buildingsCodec,
        remoteResourceOptions: registryConfig_pgResources_streets_streets,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["name"],
        remoteAttributes: ["name"],
        isUnique: true,
        isReferencee: false,
        description: undefined,
        extensions: {
          tags: {
            fieldName: "namedAfterStreet",
            foreignFieldName: "buildingsNamedAfterStreet",
            foreignSimpleFieldName: "buildingsNamedAfterStreetList",
            behavior: []
          }
        }
      },
      housesByTheirBuildingId: {
        localCodec: buildingsCodec,
        remoteResourceOptions: registryConfig_pgResources_houses_houses,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["building_id"],
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
    houses: {
      __proto__: null,
      streetsByMyStreetId: {
        localCodec: housesCodec,
        remoteResourceOptions: registryConfig_pgResources_streets_streets,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["street_id"],
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
      buildingsByMyBuildingId: {
        localCodec: housesCodec,
        remoteResourceOptions: registryConfig_pgResources_buildings_buildings,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["building_id"],
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
      propertiesByMyPropertyId: {
        localCodec: housesCodec,
        remoteResourceOptions: registryConfig_pgResources_properties_properties,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["property_id"],
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
      streetPropertyByMyStreetIdAndPropertyId: {
        localCodec: housesCodec,
        remoteResourceOptions: registryConfig_pgResources_street_property_street_property,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["street_id", "property_id"],
        remoteAttributes: ["str_id", "prop_id"],
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
    offer_table: {
      __proto__: null,
      postTableByMyPostId: {
        localCodec: offer_tableCodec,
        remoteResourceOptions: registryConfig_pgResources_post_table_post_table,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["post_id"],
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
    offers: {
      __proto__: null,
      postTableByMyPostId: {
        localCodec: offersCodec,
        remoteResourceOptions: registryConfig_pgResources_post_table_post_table,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["post_id"],
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
    post_table: {
      __proto__: null,
      offerTablesByTheirPostId: {
        localCodec: post_tableCodec,
        remoteResourceOptions: registryConfig_pgResources_offer_table_offer_table,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["post_id"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      offersByTheirPostId: {
        localCodec: post_tableCodec,
        remoteResourceOptions: registryConfig_pgResources_offers_offers,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["post_id"],
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
    properties: {
      __proto__: null,
      streetsByMyStreetId: {
        localCodec: propertiesCodec,
        remoteResourceOptions: registryConfig_pgResources_streets_streets,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["street_id"],
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
      streetPropertiesByTheirPropId: {
        localCodec: propertiesCodec,
        remoteResourceOptions: registryConfig_pgResources_street_property_street_property,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["prop_id"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      buildingsByTheirPropertyId: {
        localCodec: propertiesCodec,
        remoteResourceOptions: registryConfig_pgResources_buildings_buildings,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["property_id"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      housesByTheirPropertyId: {
        localCodec: propertiesCodec,
        remoteResourceOptions: registryConfig_pgResources_houses_houses,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["property_id"],
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
    streetProperty: {
      __proto__: null,
      propertiesByMyPropId: {
        localCodec: streetPropertyCodec,
        remoteResourceOptions: registryConfig_pgResources_properties_properties,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["prop_id"],
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
      streetsByMyStrId: {
        localCodec: streetPropertyCodec,
        remoteResourceOptions: registryConfig_pgResources_streets_streets,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["str_id"],
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
      housesByTheirStreetIdAndPropertyId: {
        localCodec: streetPropertyCodec,
        remoteResourceOptions: registryConfig_pgResources_houses_houses,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["str_id", "prop_id"],
        remoteAttributes: ["street_id", "property_id"],
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
    streets: {
      __proto__: null,
      propertiesByTheirStreetId: {
        localCodec: streetsCodec,
        remoteResourceOptions: registryConfig_pgResources_properties_properties,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["street_id"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      streetPropertiesByTheirStrId: {
        localCodec: streetsCodec,
        remoteResourceOptions: registryConfig_pgResources_street_property_street_property,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["str_id"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      buildingsNamedAfterStreet: {
        localCodec: streetsCodec,
        remoteResourceOptions: registryConfig_pgResources_buildings_buildings,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["name"],
        remoteAttributes: ["name"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            fieldName: "namedAfterStreet",
            foreignFieldName: "buildingsNamedAfterStreet",
            foreignSimpleFieldName: "buildingsNamedAfterStreetList",
            behavior: []
          }
        }
      },
      housesByTheirStreetId: {
        localCodec: streetsCodec,
        remoteResourceOptions: registryConfig_pgResources_houses_houses,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["street_id"],
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
const resource_postsPgResource = registry.pgResources["posts"];
const resource_offersPgResource = registry.pgResources["offers"];
const resource_streetsPgResource = registry.pgResources["streets"];
const resource_propertiesPgResource = registry.pgResources["properties"];
const resource_street_propertyPgResource = registry.pgResources["street_property"];
const resource_housesPgResource = registry.pgResources["houses"];
const resource_buildingsPgResource = registry.pgResources["buildings"];
const nodeIdHandler_Post = {
  typeName: "Post",
  codec: nodeIdCodecs_base64JSON_base64JSON,
  deprecationReason: undefined,
  plan($record) {
    return list([constant("post_views", false), $record.get("id")]);
  },
  getSpec($list) {
    return {
      id: inhibitOnNull(access($list, [1]))
    };
  },
  getIdentifiers(value) {
    return value.slice(1);
  },
  get(spec) {
    return resource_postsPgResource.get(spec);
  },
  match(obj) {
    return obj[0] === "post_views";
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
const nodeFetcher_Post = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Post));
  return nodeIdHandler_Post.get(nodeIdHandler_Post.getSpec($decoded));
};
const nodeIdHandler_Offer = {
  typeName: "Offer",
  codec: nodeIdCodecs_base64JSON_base64JSON,
  deprecationReason: undefined,
  plan($record) {
    return list([constant("offer_views", false), $record.get("id")]);
  },
  getSpec($list) {
    return {
      id: inhibitOnNull(access($list, [1]))
    };
  },
  getIdentifiers(value) {
    return value.slice(1);
  },
  get(spec) {
    return resource_offersPgResource.get(spec);
  },
  match(obj) {
    return obj[0] === "offer_views";
  }
};
const nodeFetcher_Offer = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Offer));
  return nodeIdHandler_Offer.get(nodeIdHandler_Offer.getSpec($decoded));
};
const nodeIdHandler_Street = {
  typeName: "Street",
  codec: nodeIdCodecs_base64JSON_base64JSON,
  deprecationReason: undefined,
  plan($record) {
    return list([constant("streets", false), $record.get("id")]);
  },
  getSpec($list) {
    return {
      id: inhibitOnNull(access($list, [1]))
    };
  },
  getIdentifiers(value) {
    return value.slice(1);
  },
  get(spec) {
    return resource_streetsPgResource.get(spec);
  },
  match(obj) {
    return obj[0] === "streets";
  }
};
const nodeFetcher_Street = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Street));
  return nodeIdHandler_Street.get(nodeIdHandler_Street.getSpec($decoded));
};
const nodeIdHandler_Property = {
  typeName: "Property",
  codec: nodeIdCodecs_base64JSON_base64JSON,
  deprecationReason: undefined,
  plan($record) {
    return list([constant("properties", false), $record.get("id")]);
  },
  getSpec($list) {
    return {
      id: inhibitOnNull(access($list, [1]))
    };
  },
  getIdentifiers(value) {
    return value.slice(1);
  },
  get(spec) {
    return resource_propertiesPgResource.get(spec);
  },
  match(obj) {
    return obj[0] === "properties";
  }
};
const nodeFetcher_Property = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Property));
  return nodeIdHandler_Property.get(nodeIdHandler_Property.getSpec($decoded));
};
const nodeIdHandler_StreetProperty = {
  typeName: "StreetProperty",
  codec: nodeIdCodecs_base64JSON_base64JSON,
  deprecationReason: undefined,
  plan($record) {
    return list([constant("street_properties", false), $record.get("str_id"), $record.get("prop_id")]);
  },
  getSpec($list) {
    return {
      str_id: inhibitOnNull(access($list, [1])),
      prop_id: inhibitOnNull(access($list, [2]))
    };
  },
  getIdentifiers(value) {
    return value.slice(1);
  },
  get(spec) {
    return resource_street_propertyPgResource.get(spec);
  },
  match(obj) {
    return obj[0] === "street_properties";
  }
};
const nodeFetcher_StreetProperty = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_StreetProperty));
  return nodeIdHandler_StreetProperty.get(nodeIdHandler_StreetProperty.getSpec($decoded));
};
const nodeIdHandler_House = {
  typeName: "House",
  codec: nodeIdCodecs_base64JSON_base64JSON,
  deprecationReason: undefined,
  plan($record) {
    return list([constant("houses", false), $record.get("street_id"), $record.get("property_id")]);
  },
  getSpec($list) {
    return {
      street_id: inhibitOnNull(access($list, [1])),
      property_id: inhibitOnNull(access($list, [2]))
    };
  },
  getIdentifiers(value) {
    return value.slice(1);
  },
  get(spec) {
    return resource_housesPgResource.get(spec);
  },
  match(obj) {
    return obj[0] === "houses";
  }
};
const nodeFetcher_House = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_House));
  return nodeIdHandler_House.get(nodeIdHandler_House.getSpec($decoded));
};
const nodeIdHandler_Building = {
  typeName: "Building",
  codec: nodeIdCodecs_base64JSON_base64JSON,
  deprecationReason: undefined,
  plan($record) {
    return list([constant("buildings", false), $record.get("id")]);
  },
  getSpec($list) {
    return {
      id: inhibitOnNull(access($list, [1]))
    };
  },
  getIdentifiers(value) {
    return value.slice(1);
  },
  get(spec) {
    return resource_buildingsPgResource.get(spec);
  },
  match(obj) {
    return obj[0] === "buildings";
  }
};
const nodeFetcher_Building = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Building));
  return nodeIdHandler_Building.get(nodeIdHandler_Building.getSpec($decoded));
};
function qbWhereBuilder(qb) {
  return qb.whereBuilder();
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
function CursorSerialize(value) {
  return "" + value;
}
const specFromArgs_Post = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Post, $nodeId);
};
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
const specFromArgs_Post2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Post, $nodeId);
};
const specFromArgs_Offer2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Offer, $nodeId);
};
const specFromArgs_Street2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Street, $nodeId);
};
const specFromArgs_Property2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Property, $nodeId);
};
const specFromArgs_StreetProperty2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_StreetProperty, $nodeId);
};
const specFromArgs_Building2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Building, $nodeId);
};
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
}

type Offer implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  postId: String
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

"""A \`Offer\` edge in the connection."""
type OffersEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Offer\` at the end of the edge."""
  node: Offer
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
      allHouses: {
        plan() {
          return connection(resource_housesPgResource.find());
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
      allOffers: {
        plan() {
          return connection(resource_offersPgResource.find());
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
          return connection(resource_postsPgResource.find());
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
      allProperties: {
        plan() {
          return connection(resource_propertiesPgResource.find());
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
      allStreetProperties: {
        plan() {
          return connection(resource_street_propertyPgResource.find());
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
      allStreets: {
        plan() {
          return connection(resource_streetsPgResource.find());
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
          const $insert = pgInsertSingle(resource_buildingsPgResource, Object.create(null));
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
      createOffer: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_offersPgResource, Object.create(null));
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
          const $insert = pgInsertSingle(resource_postsPgResource, Object.create(null));
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
      createProperty: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_propertiesPgResource, Object.create(null));
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
      createStreet: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_streetsPgResource, Object.create(null));
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
      createStreetProperty: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_street_propertyPgResource, Object.create(null));
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
      deleteBuilding: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_buildingsPgResource, specFromArgs_Building2(args));
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
          input(_, $object) {
            return $object;
          }
        }
      },
      deleteOffer: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_offersPgResource, specFromArgs_Offer2(args));
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
          input(_, $object) {
            return $object;
          }
        }
      },
      deletePost: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_postsPgResource, specFromArgs_Post2(args));
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
          input(_, $object) {
            return $object;
          }
        }
      },
      deleteProperty: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_propertiesPgResource, specFromArgs_Property2(args));
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
          input(_, $object) {
            return $object;
          }
        }
      },
      deleteStreet: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_streetsPgResource, specFromArgs_Street2(args));
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
          input(_, $object) {
            return $object;
          }
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
          input(_, $object) {
            return $object;
          }
        }
      },
      deleteStreetProperty: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_street_propertyPgResource, specFromArgs_StreetProperty2(args));
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
          input(_, $object) {
            return $object;
          }
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
          input(_, $object) {
            return $object;
          }
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
          input(_, $object) {
            return $object;
          }
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
          input(_, $object) {
            return $object;
          }
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
          input(_, $object) {
            return $object;
          }
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
          input(_, $object) {
            return $object;
          }
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
          input(_, $object) {
            return $object;
          }
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
          input(_, $object) {
            return $object;
          }
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
          input(_, $object) {
            return $object;
          }
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
          input(_, $object) {
            return $object;
          }
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
          input(_, $object) {
            return $object;
          }
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
          input(_, $object) {
            return $object;
          }
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
          input(_, $object) {
            return $object;
          }
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
          input(_, $object) {
            return $object;
          }
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
      propertyByPropertyId($record) {
        return resource_propertiesPgResource.get({
          id: $record.get("property_id")
        });
      },
      propertyId($record) {
        return $record.get("property_id");
      }
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
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
      }
    }
  },
  CreateBuildingPayload: {
    assertStep: assertExecutableStep,
    plans: {
      building($object) {
        return $object.get("result");
      },
      buildingEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_buildingsPgResource, buildingsUniques[0].attributes, $mutation, fieldArgs);
      },
      clientMutationId($mutation) {
        const $insert = $mutation.getStepForKey("result");
        return $insert.getMeta("clientMutationId");
      },
      namedAfterStreet($record) {
        return resource_streetsPgResource.get({
          name: $record.get("result").get("name")
        });
      },
      propertyByPropertyId($record) {
        return resource_propertiesPgResource.get({
          id: $record.get("result").get("property_id")
        });
      },
      query() {
        return rootValue();
      }
    }
  },
  CreateOfferPayload: {
    assertStep: assertExecutableStep,
    plans: {
      clientMutationId($mutation) {
        const $insert = $mutation.getStepForKey("result");
        return $insert.getMeta("clientMutationId");
      },
      offer($object) {
        return $object.get("result");
      },
      offerEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_offersPgResource, offersUniques[0].attributes, $mutation, fieldArgs);
      },
      query() {
        return rootValue();
      }
    }
  },
  CreatePostPayload: {
    assertStep: assertExecutableStep,
    plans: {
      clientMutationId($mutation) {
        const $insert = $mutation.getStepForKey("result");
        return $insert.getMeta("clientMutationId");
      },
      post($object) {
        return $object.get("result");
      },
      postEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_postsPgResource, postsUniques[0].attributes, $mutation, fieldArgs);
      },
      query() {
        return rootValue();
      }
    }
  },
  CreatePropertyPayload: {
    assertStep: assertExecutableStep,
    plans: {
      clientMutationId($mutation) {
        const $insert = $mutation.getStepForKey("result");
        return $insert.getMeta("clientMutationId");
      },
      property($object) {
        return $object.get("result");
      },
      propertyEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_propertiesPgResource, propertiesUniques[0].attributes, $mutation, fieldArgs);
      },
      query() {
        return rootValue();
      },
      streetByStreetId($record) {
        return resource_streetsPgResource.get({
          id: $record.get("result").get("street_id")
        });
      }
    }
  },
  CreateStreetPayload: {
    assertStep: assertExecutableStep,
    plans: {
      clientMutationId($mutation) {
        const $insert = $mutation.getStepForKey("result");
        return $insert.getMeta("clientMutationId");
      },
      query() {
        return rootValue();
      },
      street($object) {
        return $object.get("result");
      },
      streetEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_streetsPgResource, streetsUniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  CreateStreetPropertyPayload: {
    assertStep: assertExecutableStep,
    plans: {
      clientMutationId($mutation) {
        const $insert = $mutation.getStepForKey("result");
        return $insert.getMeta("clientMutationId");
      },
      propertyByPropId($record) {
        return resource_propertiesPgResource.get({
          id: $record.get("result").get("prop_id")
        });
      },
      query() {
        return rootValue();
      },
      streetByStrId($record) {
        return resource_streetsPgResource.get({
          id: $record.get("result").get("str_id")
        });
      },
      streetProperty($object) {
        return $object.get("result");
      },
      streetPropertyEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_street_propertyPgResource, street_propertyUniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  DeleteBuildingPayload: {
    assertStep: ObjectStep,
    plans: {
      building($object) {
        return $object.get("result");
      },
      buildingEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_buildingsPgResource, buildingsUniques[0].attributes, $mutation, fieldArgs);
      },
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      deletedBuildingId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Building.plan($record);
        return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
      },
      namedAfterStreet($record) {
        return resource_streetsPgResource.get({
          name: $record.get("result").get("name")
        });
      },
      propertyByPropertyId($record) {
        return resource_propertiesPgResource.get({
          id: $record.get("result").get("property_id")
        });
      },
      query() {
        return rootValue();
      }
    }
  },
  DeleteOfferPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      deletedOfferViewId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Offer.plan($record);
        return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
      },
      offer($object) {
        return $object.get("result");
      },
      offerEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_offersPgResource, offersUniques[0].attributes, $mutation, fieldArgs);
      },
      query() {
        return rootValue();
      }
    }
  },
  DeletePostPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      deletedPostViewId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Post.plan($record);
        return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
      },
      post($object) {
        return $object.get("result");
      },
      postEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_postsPgResource, postsUniques[0].attributes, $mutation, fieldArgs);
      },
      query() {
        return rootValue();
      }
    }
  },
  DeletePropertyPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      deletedPropertyId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Property.plan($record);
        return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
      },
      property($object) {
        return $object.get("result");
      },
      propertyEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_propertiesPgResource, propertiesUniques[0].attributes, $mutation, fieldArgs);
      },
      query() {
        return rootValue();
      },
      streetByStreetId($record) {
        return resource_streetsPgResource.get({
          id: $record.get("result").get("street_id")
        });
      }
    }
  },
  DeleteStreetPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      deletedStreetId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Street.plan($record);
        return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
      },
      query() {
        return rootValue();
      },
      street($object) {
        return $object.get("result");
      },
      streetEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_streetsPgResource, streetsUniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  DeleteStreetPropertyPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      deletedStreetPropertyId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_StreetProperty.plan($record);
        return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
      },
      propertyByPropId($record) {
        return resource_propertiesPgResource.get({
          id: $record.get("result").get("prop_id")
        });
      },
      query() {
        return rootValue();
      },
      streetByStrId($record) {
        return resource_streetsPgResource.get({
          id: $record.get("result").get("str_id")
        });
      },
      streetProperty($object) {
        return $object.get("result");
      },
      streetPropertyEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_street_propertyPgResource, street_propertyUniques[0].attributes, $mutation, fieldArgs);
      }
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
      propertyByPropertyId($record) {
        return resource_propertiesPgResource.get({
          id: $record.get("property_id")
        });
      },
      propertyId($record) {
        return $record.get("property_id");
      },
      propertyNameOrNumber($record) {
        return $record.get("property_name_or_number");
      },
      streetByStreetId($record) {
        return resource_streetsPgResource.get({
          id: $record.get("street_id")
        });
      },
      streetId($record) {
        return $record.get("street_id");
      },
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
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
      }
    }
  },
  Offer: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nodeId($parent) {
        const specifier = nodeIdHandler_Offer.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Offer.codec.name].encode);
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
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
      }
    }
  },
  Post: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nodeId($parent) {
        const specifier = nodeIdHandler_Post.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Post.codec.name].encode);
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
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
      }
    }
  },
  PropertiesConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
      }
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
      housesByPropertyId: {
        plan($record) {
          const $records = resource_housesPgResource.find({
            property_id: $record.get("id")
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
      nameOrNumber($record) {
        return $record.get("name_or_number");
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_Property.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Property.codec.name].encode);
      },
      streetByStreetId($record) {
        return resource_streetsPgResource.get({
          id: $record.get("street_id")
        });
      },
      streetId($record) {
        return $record.get("street_id");
      },
      streetPropertiesByPropId: {
        plan($record) {
          const $records = resource_street_propertyPgResource.find({
            prop_id: $record.get("id")
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
      housesByStreetId: {
        plan($record) {
          const $records = resource_housesPgResource.find({
            street_id: $record.get("id")
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
      streetPropertiesByStrId: {
        plan($record) {
          const $records = resource_street_propertyPgResource.find({
            str_id: $record.get("id")
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
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
      }
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
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
      }
    }
  },
  UpdateBuildingPayload: {
    assertStep: ObjectStep,
    plans: {
      building($object) {
        return $object.get("result");
      },
      buildingEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_buildingsPgResource, buildingsUniques[0].attributes, $mutation, fieldArgs);
      },
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      namedAfterStreet($record) {
        return resource_streetsPgResource.get({
          name: $record.get("result").get("name")
        });
      },
      propertyByPropertyId($record) {
        return resource_propertiesPgResource.get({
          id: $record.get("result").get("property_id")
        });
      },
      query() {
        return rootValue();
      }
    }
  },
  UpdateOfferPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      offer($object) {
        return $object.get("result");
      },
      offerEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_offersPgResource, offersUniques[0].attributes, $mutation, fieldArgs);
      },
      query() {
        return rootValue();
      }
    }
  },
  UpdatePostPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      post($object) {
        return $object.get("result");
      },
      postEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_postsPgResource, postsUniques[0].attributes, $mutation, fieldArgs);
      },
      query() {
        return rootValue();
      }
    }
  },
  UpdatePropertyPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      property($object) {
        return $object.get("result");
      },
      propertyEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_propertiesPgResource, propertiesUniques[0].attributes, $mutation, fieldArgs);
      },
      query() {
        return rootValue();
      },
      streetByStreetId($record) {
        return resource_streetsPgResource.get({
          id: $record.get("result").get("street_id")
        });
      }
    }
  },
  UpdateStreetPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      query() {
        return rootValue();
      },
      street($object) {
        return $object.get("result");
      },
      streetEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_streetsPgResource, streetsUniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  UpdateStreetPropertyPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      propertyByPropId($record) {
        return resource_propertiesPgResource.get({
          id: $record.get("result").get("prop_id")
        });
      },
      query() {
        return rootValue();
      },
      streetByStrId($record) {
        return resource_streetsPgResource.get({
          id: $record.get("result").get("str_id")
        });
      },
      streetProperty($object) {
        return $object.get("result");
      },
      streetPropertyEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_street_propertyPgResource, street_propertyUniques[0].attributes, $mutation, fieldArgs);
      }
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
      floors($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "floors",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
      },
      id($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
      },
      isPrimary($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "is_primary",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.boolean)}`;
          }
        });
      },
      name($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "name",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
          }
        });
      },
      propertyId($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "property_id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
      }
    }
  },
  BuildingInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      floors(obj, val, {
        field,
        schema
      }) {
        obj.set("floors", bakedInputRuntime(schema, field.type, val));
      },
      id(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      },
      isPrimary(obj, val, {
        field,
        schema
      }) {
        obj.set("is_primary", bakedInputRuntime(schema, field.type, val));
      },
      name(obj, val, {
        field,
        schema
      }) {
        obj.set("name", bakedInputRuntime(schema, field.type, val));
      },
      propertyId(obj, val, {
        field,
        schema
      }) {
        obj.set("property_id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  BuildingPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      floors(obj, val, {
        field,
        schema
      }) {
        obj.set("floors", bakedInputRuntime(schema, field.type, val));
      },
      id(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      },
      isPrimary(obj, val, {
        field,
        schema
      }) {
        obj.set("is_primary", bakedInputRuntime(schema, field.type, val));
      },
      name(obj, val, {
        field,
        schema
      }) {
        obj.set("name", bakedInputRuntime(schema, field.type, val));
      },
      propertyId(obj, val, {
        field,
        schema
      }) {
        obj.set("property_id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  CreateBuildingInput: {
    plans: {
      building(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      },
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  CreateOfferInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      offer(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  CreatePostInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      post(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  CreatePropertyInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      property(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  CreateStreetInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      street(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  CreateStreetPropertyInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      streetProperty(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  DeleteBuildingByIdInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeleteBuildingInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeleteOfferByIdInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeleteOfferInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeletePostByIdInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeletePostInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeletePropertyByIdInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeletePropertyInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeleteStreetByIdInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeleteStreetByNameInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeleteStreetInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeleteStreetPropertyByStrIdAndPropIdInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeleteStreetPropertyInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  HouseCondition: {
    plans: {
      buildingId($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "building_id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
      },
      buildingName($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "building_name",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
          }
        });
      },
      floors($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "floors",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
      },
      propertyId($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "property_id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
      },
      propertyNameOrNumber($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "property_name_or_number",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
          }
        });
      },
      streetId($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "street_id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
      },
      streetName($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "street_name",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
          }
        });
      }
    }
  },
  OfferCondition: {
    plans: {
      id($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
      },
      postId($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "post_id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
          }
        });
      }
    }
  },
  OfferInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      id(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      },
      postId(obj, val, {
        field,
        schema
      }) {
        obj.set("post_id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  OfferPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      id(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      },
      postId(obj, val, {
        field,
        schema
      }) {
        obj.set("post_id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  PostCondition: {
    plans: {
      id($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
          }
        });
      }
    }
  },
  PostInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      id(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  PostPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      id(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  PropertyCondition: {
    plans: {
      id($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
      },
      nameOrNumber($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "name_or_number",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
          }
        });
      },
      streetId($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "street_id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
      }
    }
  },
  PropertyInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      id(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      },
      nameOrNumber(obj, val, {
        field,
        schema
      }) {
        obj.set("name_or_number", bakedInputRuntime(schema, field.type, val));
      },
      streetId(obj, val, {
        field,
        schema
      }) {
        obj.set("street_id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  PropertyPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      id(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      },
      nameOrNumber(obj, val, {
        field,
        schema
      }) {
        obj.set("name_or_number", bakedInputRuntime(schema, field.type, val));
      },
      streetId(obj, val, {
        field,
        schema
      }) {
        obj.set("street_id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  StreetCondition: {
    plans: {
      id($condition, val) {
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
          attribute: "name",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
          }
        });
      }
    }
  },
  StreetInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      id(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      },
      name(obj, val, {
        field,
        schema
      }) {
        obj.set("name", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  StreetPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      id(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      },
      name(obj, val, {
        field,
        schema
      }) {
        obj.set("name", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  StreetPropertyCondition: {
    plans: {
      currentOwner($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "current_owner",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
          }
        });
      },
      propId($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "prop_id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
      },
      strId($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "str_id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
      }
    }
  },
  StreetPropertyInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      currentOwner(obj, val, {
        field,
        schema
      }) {
        obj.set("current_owner", bakedInputRuntime(schema, field.type, val));
      },
      propId(obj, val, {
        field,
        schema
      }) {
        obj.set("prop_id", bakedInputRuntime(schema, field.type, val));
      },
      strId(obj, val, {
        field,
        schema
      }) {
        obj.set("str_id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  StreetPropertyPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      currentOwner(obj, val, {
        field,
        schema
      }) {
        obj.set("current_owner", bakedInputRuntime(schema, field.type, val));
      },
      propId(obj, val, {
        field,
        schema
      }) {
        obj.set("prop_id", bakedInputRuntime(schema, field.type, val));
      },
      strId(obj, val, {
        field,
        schema
      }) {
        obj.set("str_id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  UpdateBuildingByIdInput: {
    plans: {
      buildingPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      },
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  UpdateBuildingInput: {
    plans: {
      buildingPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      },
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  UpdateOfferByIdInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      offerPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  UpdateOfferInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      offerPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  UpdatePostByIdInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      postPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  UpdatePostInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      postPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  UpdatePropertyByIdInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      propertyPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  UpdatePropertyInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      propertyPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  UpdateStreetByIdInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      streetPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  UpdateStreetByNameInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      streetPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  UpdateStreetInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      streetPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  UpdateStreetPropertyByStrIdAndPropIdInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      streetPropertyPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  UpdateStreetPropertyInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      streetPropertyPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  }
};
export const scalars = {
  Cursor: {
    serialize: CursorSerialize,
    parseValue: CursorSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"Cursor" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
    }
  }
};
export const enums = {
  BuildingsOrderBy: {
    values: {
      FLOORS_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "floors",
          direction: "ASC"
        });
      },
      FLOORS_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "floors",
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
      PROPERTY_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "property_id",
          direction: "ASC"
        });
      },
      PROPERTY_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "property_id",
          direction: "DESC"
        });
      }
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
      FLOORS_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "floors",
          direction: "ASC"
        });
      },
      FLOORS_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "floors",
          direction: "DESC"
        });
      },
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
      PROPERTY_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "property_id",
          direction: "ASC"
        });
      },
      PROPERTY_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "property_id",
          direction: "DESC"
        });
      },
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
