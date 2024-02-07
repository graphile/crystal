import { PgDeleteSingleStep, PgExecutor, PgSelectStep, PgUnionAllStep, TYPES, assertPgClassSingleStep, makeRegistry, pgDeleteSingle, pgInsertSingle, pgSelectFromRecord, pgUpdateSingle, recordCodec } from "@dataplan/pg";
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
const extensions = {
  oid: "1468518",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "smart_comment_relations",
    name: "post"
  },
  tags: Object.assign(Object.create(null), {
    name: "post_table",
    omit: true,
    behavior: ["-*"]
  })
};
const spec_post_table = {
  name: "post_table",
  identifier: sql.identifier(...["smart_comment_relations", "post"]),
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.text,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    }
  }),
  description: undefined,
  extensions,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_post_table_post_table = recordCodec(spec_post_table);
const attributes2 = Object.assign(Object.create(null), {
  id: {
    description: undefined,
    codec: TYPES.text,
    notNull: true,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  }
});
const extensions2 = {
  oid: "1468539",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "smart_comment_relations",
    name: "post_view"
  },
  tags: Object.assign(Object.create(null), {
    name: "posts",
    primaryKey: "id"
  })
};
const parts2 = ["smart_comment_relations", "post_view"];
const sqlIdent2 = sql.identifier(...parts2);
const spec_posts = {
  name: "posts",
  identifier: sqlIdent2,
  attributes: attributes2,
  description: undefined,
  extensions: extensions2,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_posts_posts = recordCodec(spec_posts);
const attributes3 = Object.assign(Object.create(null), {
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
});
const extensions3 = {
  oid: "1468526",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "smart_comment_relations",
    name: "offer"
  },
  tags: Object.assign(Object.create(null), {
    name: "offer_table",
    omit: true,
    behavior: ["-*"]
  })
};
const parts3 = ["smart_comment_relations", "offer"];
const sqlIdent3 = sql.identifier(...parts3);
const spec_offer_table = {
  name: "offer_table",
  identifier: sqlIdent3,
  attributes: attributes3,
  description: undefined,
  extensions: extensions3,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_offer_table_offer_table = recordCodec(spec_offer_table);
const attributes4 = Object.assign(Object.create(null), {
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
});
const extensions4 = {
  oid: "1468543",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "smart_comment_relations",
    name: "offer_view"
  },
  tags: Object.assign(Object.create(null), {
    name: "offers",
    primaryKey: "id",
    foreignKey: "(post_id) references post"
  })
};
const parts4 = ["smart_comment_relations", "offer_view"];
const sqlIdent4 = sql.identifier(...parts4);
const spec_offers = {
  name: "offers",
  identifier: sqlIdent4,
  attributes: attributes4,
  description: undefined,
  extensions: extensions4,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_offers_offers = recordCodec(spec_offers);
const attributes_object_Object_ = Object.assign(Object.create(null), {
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
});
const extensions5 = {
  oid: "1468458",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "smart_comment_relations",
    name: "streets"
  },
  tags: Object.assign(Object.create(null), {
    unique: "name"
  })
};
const parts5 = ["smart_comment_relations", "streets"];
const sqlIdent5 = sql.identifier(...parts5);
const spec_streets = {
  name: "streets",
  identifier: sqlIdent5,
  attributes: attributes_object_Object_,
  description: undefined,
  extensions: extensions5,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_streets_streets = recordCodec(spec_streets);
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
});
const extensions6 = {
  oid: "1468467",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "smart_comment_relations",
    name: "properties"
  },
  tags: Object.create(null)
};
const parts6 = ["smart_comment_relations", "properties"];
const sqlIdent6 = sql.identifier(...parts6);
const spec_properties = {
  name: "properties",
  identifier: sqlIdent6,
  attributes: attributes5,
  description: undefined,
  extensions: extensions6,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_properties_properties = recordCodec(spec_properties);
const attributes6 = Object.assign(Object.create(null), {
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
});
const extensions7 = {
  oid: "1468480",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "smart_comment_relations",
    name: "street_property"
  },
  tags: Object.create(null)
};
const parts7 = ["smart_comment_relations", "street_property"];
const sqlIdent7 = sql.identifier(...parts7);
const spec_streetProperty = {
  name: "streetProperty",
  identifier: sqlIdent7,
  attributes: attributes6,
  description: undefined,
  extensions: extensions7,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_streetProperty_streetProperty = recordCodec(spec_streetProperty);
const attributes7 = Object.assign(Object.create(null), {
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
});
const extensions8 = {
  oid: "1468514",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "smart_comment_relations",
    name: "houses"
  },
  tags: Object.assign(Object.create(null), {
    primaryKey: "street_id,property_id",
    foreignKey: ["(street_id) references smart_comment_relations.streets", "(building_id) references smart_comment_relations.buildings (id)", "(property_id) references properties", "(street_id, property_id) references street_property (str_id, prop_id)"]
  })
};
const parts8 = ["smart_comment_relations", "houses"];
const sqlIdent8 = sql.identifier(...parts8);
const spec_houses = {
  name: "houses",
  identifier: sqlIdent8,
  attributes: attributes7,
  description: undefined,
  extensions: extensions8,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_houses_houses = recordCodec(spec_houses);
const attributes_object_Object_2 = Object.assign(Object.create(null), {
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
});
const extensions9 = {
  oid: "1468498",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "smart_comment_relations",
    name: "buildings"
  },
  tags: Object.assign(Object.create(null), {
    foreignKey: "(name) references streets (name)|@fieldName namedAfterStreet|@foreignFieldName buildingsNamedAfterStreet|@foreignSimpleFieldName buildingsNamedAfterStreetList"
  })
};
const parts9 = ["smart_comment_relations", "buildings"];
const sqlIdent9 = sql.identifier(...parts9);
const spec_buildings = {
  name: "buildings",
  identifier: sqlIdent9,
  attributes: attributes_object_Object_2,
  description: undefined,
  extensions: extensions9,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_buildings_buildings = recordCodec(spec_buildings);
const extensions10 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "smart_comment_relations",
    name: "post"
  },
  tags: {
    name: "post_table",
    omit: true,
    behavior: extensions.tags.behavior
  }
};
const registryConfig_pgResources_post_table_post_table = {
  executor: executor_mainPgExecutor,
  name: "post_table",
  identifier: "main.smart_comment_relations.post",
  from: registryConfig_pgCodecs_post_table_post_table.sqlType,
  codec: registryConfig_pgCodecs_post_table_post_table,
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
  extensions: extensions10
};
const extensions11 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "smart_comment_relations",
    name: "post_view"
  },
  tags: {
    name: "posts",
    primaryKey: "id"
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
const extensions12 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "smart_comment_relations",
    name: "offer"
  },
  tags: {
    name: "offer_table",
    omit: true,
    behavior: extensions3.tags.behavior
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
const registryConfig_pgResources_offer_table_offer_table = {
  executor: executor_mainPgExecutor,
  name: "offer_table",
  identifier: "main.smart_comment_relations.offer",
  from: registryConfig_pgCodecs_offer_table_offer_table.sqlType,
  codec: registryConfig_pgCodecs_offer_table_offer_table,
  uniques: uniques3,
  isVirtual: false,
  description: undefined,
  extensions: extensions12
};
const extensions13 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "smart_comment_relations",
    name: "offer_view"
  },
  tags: {
    name: "offers",
    primaryKey: "id",
    foreignKey: "(post_id) references post"
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
const registryConfig_pgResources_offers_offers = {
  executor: executor_mainPgExecutor,
  name: "offers",
  identifier: "main.smart_comment_relations.offer_view",
  from: registryConfig_pgCodecs_offers_offers.sqlType,
  codec: registryConfig_pgCodecs_offers_offers,
  uniques: uniques4,
  isVirtual: false,
  description: undefined,
  extensions: extensions13
};
const extensions14 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "smart_comment_relations",
    name: "streets"
  },
  tags: {
    unique: "name"
  }
};
const uniques5 = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}, {
  isPrimary: false,
  attributes: ["name"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_streets_streets = {
  executor: executor_mainPgExecutor,
  name: "streets",
  identifier: "main.smart_comment_relations.streets",
  from: registryConfig_pgCodecs_streets_streets.sqlType,
  codec: registryConfig_pgCodecs_streets_streets,
  uniques: uniques5,
  isVirtual: false,
  description: undefined,
  extensions: extensions14
};
const extensions15 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "smart_comment_relations",
    name: "properties"
  },
  tags: {}
};
const uniques6 = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_properties_properties = {
  executor: executor_mainPgExecutor,
  name: "properties",
  identifier: "main.smart_comment_relations.properties",
  from: registryConfig_pgCodecs_properties_properties.sqlType,
  codec: registryConfig_pgCodecs_properties_properties,
  uniques: uniques6,
  isVirtual: false,
  description: undefined,
  extensions: extensions15
};
const extensions16 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "smart_comment_relations",
    name: "street_property"
  },
  tags: {}
};
const uniques7 = [{
  isPrimary: true,
  attributes: ["str_id", "prop_id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_street_property_street_property = {
  executor: executor_mainPgExecutor,
  name: "street_property",
  identifier: "main.smart_comment_relations.street_property",
  from: registryConfig_pgCodecs_streetProperty_streetProperty.sqlType,
  codec: registryConfig_pgCodecs_streetProperty_streetProperty,
  uniques: uniques7,
  isVirtual: false,
  description: undefined,
  extensions: extensions16
};
const extensions17 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "smart_comment_relations",
    name: "houses"
  },
  tags: {
    primaryKey: "street_id,property_id",
    foreignKey: extensions8.tags.foreignKey,
    behavior: ["-insert", "-update", "-delete"]
  }
};
const uniques8 = [{
  isPrimary: true,
  attributes: ["street_id", "property_id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_houses_houses = {
  executor: executor_mainPgExecutor,
  name: "houses",
  identifier: "main.smart_comment_relations.houses",
  from: registryConfig_pgCodecs_houses_houses.sqlType,
  codec: registryConfig_pgCodecs_houses_houses,
  uniques: uniques8,
  isVirtual: false,
  description: undefined,
  extensions: extensions17
};
const extensions18 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "smart_comment_relations",
    name: "buildings"
  },
  tags: {
    foreignKey: "(name) references streets (name)|@fieldName namedAfterStreet|@foreignFieldName buildingsNamedAfterStreet|@foreignSimpleFieldName buildingsNamedAfterStreetList"
  }
};
const uniques9 = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_buildings_buildings = {
  executor: executor_mainPgExecutor,
  name: "buildings",
  identifier: "main.smart_comment_relations.buildings",
  from: registryConfig_pgCodecs_buildings_buildings.sqlType,
  codec: registryConfig_pgCodecs_buildings_buildings,
  uniques: uniques9,
  isVirtual: false,
  description: undefined,
  extensions: extensions18
};
const registry = makeRegistry({
  pgCodecs: Object.assign(Object.create(null), {
    post_table: registryConfig_pgCodecs_post_table_post_table,
    text: TYPES.text,
    posts: registryConfig_pgCodecs_posts_posts,
    offer_table: registryConfig_pgCodecs_offer_table_offer_table,
    int4: TYPES.int,
    offers: registryConfig_pgCodecs_offers_offers,
    streets: registryConfig_pgCodecs_streets_streets,
    properties: registryConfig_pgCodecs_properties_properties,
    streetProperty: registryConfig_pgCodecs_streetProperty_streetProperty,
    houses: registryConfig_pgCodecs_houses_houses,
    varchar: TYPES.varchar,
    bpchar: TYPES.bpchar,
    bool: TYPES.boolean,
    buildings: registryConfig_pgCodecs_buildings_buildings
  }),
  pgResources: Object.assign(Object.create(null), {
    post_table: registryConfig_pgResources_post_table_post_table,
    posts: {
      executor: executor_mainPgExecutor,
      name: "posts",
      identifier: "main.smart_comment_relations.post_view",
      from: registryConfig_pgCodecs_posts_posts.sqlType,
      codec: registryConfig_pgCodecs_posts_posts,
      uniques: uniques2,
      isVirtual: false,
      description: undefined,
      extensions: extensions11
    },
    offer_table: registryConfig_pgResources_offer_table_offer_table,
    offers: registryConfig_pgResources_offers_offers,
    streets: registryConfig_pgResources_streets_streets,
    properties: registryConfig_pgResources_properties_properties,
    street_property: registryConfig_pgResources_street_property_street_property,
    houses: registryConfig_pgResources_houses_houses,
    buildings: registryConfig_pgResources_buildings_buildings
  }),
  pgRelations: Object.assign(Object.create(null), {
    buildings: Object.assign(Object.create(null), {
      propertiesByMyPropertyId: {
        localCodec: registryConfig_pgCodecs_buildings_buildings,
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
        localCodec: registryConfig_pgCodecs_buildings_buildings,
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
        localCodec: registryConfig_pgCodecs_buildings_buildings,
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
    }),
    houses: Object.assign(Object.create(null), {
      streetsByMyStreetId: {
        localCodec: registryConfig_pgCodecs_houses_houses,
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
        localCodec: registryConfig_pgCodecs_houses_houses,
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
        localCodec: registryConfig_pgCodecs_houses_houses,
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
        localCodec: registryConfig_pgCodecs_houses_houses,
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
    }),
    offer_table: Object.assign(Object.create(null), {
      postTableByMyPostId: {
        localCodec: registryConfig_pgCodecs_offer_table_offer_table,
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
    }),
    offers: Object.assign(Object.create(null), {
      postTableByMyPostId: {
        localCodec: registryConfig_pgCodecs_offers_offers,
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
    }),
    post_table: Object.assign(Object.create(null), {
      offerTablesByTheirPostId: {
        localCodec: registryConfig_pgCodecs_post_table_post_table,
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
        localCodec: registryConfig_pgCodecs_post_table_post_table,
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
    }),
    properties: Object.assign(Object.create(null), {
      streetsByMyStreetId: {
        localCodec: registryConfig_pgCodecs_properties_properties,
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
        localCodec: registryConfig_pgCodecs_properties_properties,
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
        localCodec: registryConfig_pgCodecs_properties_properties,
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
        localCodec: registryConfig_pgCodecs_properties_properties,
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
    }),
    streetProperty: Object.assign(Object.create(null), {
      propertiesByMyPropId: {
        localCodec: registryConfig_pgCodecs_streetProperty_streetProperty,
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
        localCodec: registryConfig_pgCodecs_streetProperty_streetProperty,
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
        localCodec: registryConfig_pgCodecs_streetProperty_streetProperty,
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
    }),
    streets: Object.assign(Object.create(null), {
      propertiesByTheirStreetId: {
        localCodec: registryConfig_pgCodecs_streets_streets,
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
        localCodec: registryConfig_pgCodecs_streets_streets,
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
        localCodec: registryConfig_pgCodecs_streets_streets,
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
        localCodec: registryConfig_pgCodecs_streets_streets,
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
    })
  })
});
const pgResource_postsPgResource = registry.pgResources["posts"];
const pgResource_offersPgResource = registry.pgResources["offers"];
const pgResource_streetsPgResource = registry.pgResources["streets"];
const pgResource_propertiesPgResource = registry.pgResources["properties"];
const pgResource_street_propertyPgResource = registry.pgResources["street_property"];
const pgResource_housesPgResource = registry.pgResources["houses"];
const pgResource_buildingsPgResource = registry.pgResources["buildings"];
const nodeIdHandlerByTypeName = Object.assign(Object.create(null), {
  Query: handler,
  Post: {
    typeName: "Post",
    codec: nodeIdCodecs_base64JSON_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("post_views", false), $record.get("id")]);
    },
    getSpec($list) {
      return {
        id: access($list, [1])
      };
    },
    get(spec) {
      return pgResource_postsPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "post_views";
    }
  },
  Offer: {
    typeName: "Offer",
    codec: nodeIdCodecs_base64JSON_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("offer_views", false), $record.get("id")]);
    },
    getSpec($list) {
      return {
        id: access($list, [1])
      };
    },
    get(spec) {
      return pgResource_offersPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "offer_views";
    }
  },
  Street: {
    typeName: "Street",
    codec: nodeIdCodecs_base64JSON_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("streets", false), $record.get("id")]);
    },
    getSpec($list) {
      return {
        id: access($list, [1])
      };
    },
    get(spec) {
      return pgResource_streetsPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "streets";
    }
  },
  Property: {
    typeName: "Property",
    codec: nodeIdCodecs_base64JSON_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("properties", false), $record.get("id")]);
    },
    getSpec($list) {
      return {
        id: access($list, [1])
      };
    },
    get(spec) {
      return pgResource_propertiesPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "properties";
    }
  },
  StreetProperty: {
    typeName: "StreetProperty",
    codec: nodeIdCodecs_base64JSON_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("street_properties", false), $record.get("str_id"), $record.get("prop_id")]);
    },
    getSpec($list) {
      return {
        str_id: access($list, [1]),
        prop_id: access($list, [2])
      };
    },
    get(spec) {
      return pgResource_street_propertyPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "street_properties";
    }
  },
  House: {
    typeName: "House",
    codec: nodeIdCodecs_base64JSON_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("houses", false), $record.get("street_id"), $record.get("property_id")]);
    },
    getSpec($list) {
      return {
        street_id: access($list, [1]),
        property_id: access($list, [2])
      };
    },
    get(spec) {
      return pgResource_housesPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "houses";
    }
  },
  Building: {
    typeName: "Building",
    codec: nodeIdCodecs_base64JSON_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("buildings", false), $record.get("id")]);
    },
    getSpec($list) {
      return {
        id: access($list, [1])
      };
    },
    get(spec) {
      return pgResource_buildingsPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "buildings";
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
})(nodeIdHandlerByTypeName.Post);
const fetcher2 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName.Offer);
const fetcher3 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName.Street);
const fetcher4 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName.Property);
const fetcher5 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName.StreetProperty);
const fetcher6 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName.House);
const fetcher7 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName.Building);
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
function Query_allOffers_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allOffers_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Query_allOffers_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allOffers_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Query_allOffers_after_applyPlan(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
function Query_allStreets_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allStreets_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Query_allStreets_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allStreets_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Query_allStreets_after_applyPlan(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
function Query_allProperties_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allProperties_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Query_allProperties_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allProperties_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Query_allProperties_after_applyPlan(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
function Query_allStreetProperties_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allStreetProperties_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Query_allStreetProperties_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allStreetProperties_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Query_allStreetProperties_after_applyPlan(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
function Query_allHouses_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allHouses_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Query_allHouses_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allHouses_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Query_allHouses_after_applyPlan(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
function Query_allBuildings_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allBuildings_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Query_allBuildings_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allBuildings_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Query_allBuildings_after_applyPlan(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
function Street_propertiesByStreetId_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Street_propertiesByStreetId_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Street_propertiesByStreetId_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Street_propertiesByStreetId_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Street_propertiesByStreetId_after_applyPlan(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
function Street_streetPropertiesByStrId_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Street_streetPropertiesByStrId_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Street_streetPropertiesByStrId_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Street_streetPropertiesByStrId_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Street_streetPropertiesByStrId_after_applyPlan(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
function Street_buildingsNamedAfterStreet_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Street_buildingsNamedAfterStreet_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Street_buildingsNamedAfterStreet_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Street_buildingsNamedAfterStreet_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Street_buildingsNamedAfterStreet_after_applyPlan(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
function Street_housesByStreetId_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Street_housesByStreetId_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Street_housesByStreetId_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Street_housesByStreetId_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Street_housesByStreetId_after_applyPlan(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
function PropertiesConnection_nodesPlan($connection) {
  return $connection.nodes();
}
function PropertiesConnection_edgesPlan($connection) {
  return $connection.edges();
}
function PropertiesConnection_pageInfoPlan($connection) {
  // TYPES: why is this a TypeScript issue without the 'any'?
  return $connection.pageInfo();
}
function Property_streetPropertiesByPropId_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Property_streetPropertiesByPropId_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Property_streetPropertiesByPropId_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Property_streetPropertiesByPropId_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Property_streetPropertiesByPropId_after_applyPlan(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
function Property_buildingsByPropertyId_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Property_buildingsByPropertyId_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Property_buildingsByPropertyId_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Property_buildingsByPropertyId_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Property_buildingsByPropertyId_after_applyPlan(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
function Property_housesByPropertyId_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Property_housesByPropertyId_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Property_housesByPropertyId_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Property_housesByPropertyId_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Property_housesByPropertyId_after_applyPlan(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
function StreetPropertiesConnection_nodesPlan($connection) {
  return $connection.nodes();
}
function StreetPropertiesConnection_edgesPlan($connection) {
  return $connection.edges();
}
function StreetPropertiesConnection_pageInfoPlan($connection) {
  // TYPES: why is this a TypeScript issue without the 'any'?
  return $connection.pageInfo();
}
function Building_housesByBuildingId_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Building_housesByBuildingId_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Building_housesByBuildingId_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Building_housesByBuildingId_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Building_housesByBuildingId_after_applyPlan(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
function HousesConnection_nodesPlan($connection) {
  return $connection.nodes();
}
function HousesConnection_edgesPlan($connection) {
  return $connection.edges();
}
function HousesConnection_pageInfoPlan($connection) {
  // TYPES: why is this a TypeScript issue without the 'any'?
  return $connection.pageInfo();
}
function PageInfo_hasNextPagePlan($pageInfo) {
  return $pageInfo.hasNextPage();
}
function PageInfo_hasPreviousPagePlan($pageInfo) {
  return $pageInfo.hasPreviousPage();
}
function BuildingsConnection_nodesPlan($connection) {
  return $connection.nodes();
}
function BuildingsConnection_edgesPlan($connection) {
  return $connection.edges();
}
function BuildingsConnection_pageInfoPlan($connection) {
  // TYPES: why is this a TypeScript issue without the 'any'?
  return $connection.pageInfo();
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
function OffersConnection_nodesPlan($connection) {
  return $connection.nodes();
}
function OffersConnection_edgesPlan($connection) {
  return $connection.edges();
}
function OffersConnection_pageInfoPlan($connection) {
  // TYPES: why is this a TypeScript issue without the 'any'?
  return $connection.pageInfo();
}
function StreetsConnection_nodesPlan($connection) {
  return $connection.nodes();
}
function StreetsConnection_edgesPlan($connection) {
  return $connection.edges();
}
function StreetsConnection_pageInfoPlan($connection) {
  // TYPES: why is this a TypeScript issue without the 'any'?
  return $connection.pageInfo();
}
function Mutation_createPost_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_createOffer_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_createStreet_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_createProperty_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_createStreetProperty_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_createBuilding_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Post, $nodeId);
};
function Mutation_updatePost_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updatePostById_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs2 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Offer, $nodeId);
};
function Mutation_updateOffer_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updateOfferById_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs3 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Street, $nodeId);
};
function Mutation_updateStreet_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updateStreetById_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updateStreetByName_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs4 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Property, $nodeId);
};
function Mutation_updateProperty_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updatePropertyById_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs5 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.StreetProperty, $nodeId);
};
function Mutation_updateStreetProperty_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updateStreetPropertyByStrIdAndPropId_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs6 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Building, $nodeId);
};
function Mutation_updateBuilding_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updateBuildingById_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs7 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Post, $nodeId);
};
function Mutation_deletePost_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deletePostById_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs8 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Offer, $nodeId);
};
function Mutation_deleteOffer_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deleteOfferById_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs9 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Street, $nodeId);
};
function Mutation_deleteStreet_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deleteStreetById_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deleteStreetByName_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs10 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Property, $nodeId);
};
function Mutation_deleteProperty_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deletePropertyById_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs11 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.StreetProperty, $nodeId);
};
function Mutation_deleteStreetProperty_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deleteStreetPropertyByStrIdAndPropId_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs12 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Building, $nodeId);
};
function Mutation_deleteBuilding_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deleteBuildingById_input_applyPlan(_, $object) {
  return $object;
}
function CreatePostPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function CreatePostPayload_postPlan($object) {
  return $object.get("result");
}
function CreatePostPayload_queryPlan() {
  return rootValue();
}
function CreatePostInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function CreatePostInput_post_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function CreateOfferPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function CreateOfferPayload_offerPlan($object) {
  return $object.get("result");
}
function CreateOfferPayload_queryPlan() {
  return rootValue();
}
function CreateOfferInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function CreateOfferInput_offer_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function CreateStreetPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function CreateStreetPayload_streetPlan($object) {
  return $object.get("result");
}
function CreateStreetPayload_queryPlan() {
  return rootValue();
}
function CreateStreetInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function CreateStreetInput_street_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function CreatePropertyPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function CreatePropertyPayload_propertyPlan($object) {
  return $object.get("result");
}
function CreatePropertyPayload_queryPlan() {
  return rootValue();
}
function CreatePropertyInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function CreatePropertyInput_property_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function CreateStreetPropertyPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function CreateStreetPropertyPayload_streetPropertyPlan($object) {
  return $object.get("result");
}
function CreateStreetPropertyPayload_queryPlan() {
  return rootValue();
}
function CreateStreetPropertyInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function CreateStreetPropertyInput_streetProperty_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function CreateBuildingPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function CreateBuildingPayload_buildingPlan($object) {
  return $object.get("result");
}
function CreateBuildingPayload_queryPlan() {
  return rootValue();
}
function CreateBuildingInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function CreateBuildingInput_building_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdatePostPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function UpdatePostPayload_postPlan($object) {
  return $object.get("result");
}
function UpdatePostPayload_queryPlan() {
  return rootValue();
}
function UpdatePostInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdatePostInput_postPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdatePostByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdatePostByIdInput_postPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateOfferPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function UpdateOfferPayload_offerPlan($object) {
  return $object.get("result");
}
function UpdateOfferPayload_queryPlan() {
  return rootValue();
}
function UpdateOfferInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateOfferInput_offerPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateOfferByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateOfferByIdInput_offerPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateStreetPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function UpdateStreetPayload_streetPlan($object) {
  return $object.get("result");
}
function UpdateStreetPayload_queryPlan() {
  return rootValue();
}
function UpdateStreetInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateStreetInput_streetPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateStreetByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateStreetByIdInput_streetPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateStreetByNameInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateStreetByNameInput_streetPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdatePropertyPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function UpdatePropertyPayload_propertyPlan($object) {
  return $object.get("result");
}
function UpdatePropertyPayload_queryPlan() {
  return rootValue();
}
function UpdatePropertyInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdatePropertyInput_propertyPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdatePropertyByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdatePropertyByIdInput_propertyPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateStreetPropertyPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function UpdateStreetPropertyPayload_streetPropertyPlan($object) {
  return $object.get("result");
}
function UpdateStreetPropertyPayload_queryPlan() {
  return rootValue();
}
function UpdateStreetPropertyInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateStreetPropertyInput_streetPropertyPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateStreetPropertyByStrIdAndPropIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateStreetPropertyByStrIdAndPropIdInput_streetPropertyPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateBuildingPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function UpdateBuildingPayload_buildingPlan($object) {
  return $object.get("result");
}
function UpdateBuildingPayload_queryPlan() {
  return rootValue();
}
function UpdateBuildingInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateBuildingInput_buildingPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateBuildingByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateBuildingByIdInput_buildingPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function DeletePostPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function DeletePostPayload_postPlan($object) {
  return $object.get("result");
}
function DeletePostPayload_queryPlan() {
  return rootValue();
}
function DeletePostInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeletePostByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteOfferPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function DeleteOfferPayload_offerPlan($object) {
  return $object.get("result");
}
function DeleteOfferPayload_queryPlan() {
  return rootValue();
}
function DeleteOfferInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteOfferByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteStreetPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function DeleteStreetPayload_streetPlan($object) {
  return $object.get("result");
}
function DeleteStreetPayload_queryPlan() {
  return rootValue();
}
function DeleteStreetInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteStreetByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteStreetByNameInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeletePropertyPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function DeletePropertyPayload_propertyPlan($object) {
  return $object.get("result");
}
function DeletePropertyPayload_queryPlan() {
  return rootValue();
}
function DeletePropertyInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeletePropertyByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteStreetPropertyPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function DeleteStreetPropertyPayload_streetPropertyPlan($object) {
  return $object.get("result");
}
function DeleteStreetPropertyPayload_queryPlan() {
  return rootValue();
}
function DeleteStreetPropertyInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteStreetPropertyByStrIdAndPropIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteBuildingPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function DeleteBuildingPayload_buildingPlan($object) {
  return $object.get("result");
}
function DeleteBuildingPayload_queryPlan() {
  return rootValue();
}
function DeleteBuildingInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteBuildingByIdInput_clientMutationId_applyPlan($input, val) {
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

    """The method to use when ordering \`Post\`."""
    orderBy: [PostsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: PostCondition
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

    """The method to use when ordering \`Offer\`."""
    orderBy: [OffersOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: OfferCondition
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

    """The method to use when ordering \`Street\`."""
    orderBy: [StreetsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: StreetCondition
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

    """The method to use when ordering \`Property\`."""
    orderBy: [PropertiesOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: PropertyCondition
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

    """The method to use when ordering \`StreetProperty\`."""
    orderBy: [StreetPropertiesOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: StreetPropertyCondition
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

    """The method to use when ordering \`House\`."""
    orderBy: [HousesOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: HouseCondition
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

    """The method to use when ordering \`Building\`."""
    orderBy: [BuildingsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: BuildingCondition
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

    """The method to use when ordering \`Property\`."""
    orderBy: [PropertiesOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: PropertyCondition
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

    """The method to use when ordering \`StreetProperty\`."""
    orderBy: [StreetPropertiesOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: StreetPropertyCondition
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

    """The method to use when ordering \`Building\`."""
    orderBy: [BuildingsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: BuildingCondition
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

    """The method to use when ordering \`House\`."""
    orderBy: [HousesOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: HouseCondition
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

    """The method to use when ordering \`StreetProperty\`."""
    orderBy: [StreetPropertiesOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: StreetPropertyCondition
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

    """The method to use when ordering \`Building\`."""
    orderBy: [BuildingsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: BuildingCondition
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

    """The method to use when ordering \`House\`."""
    orderBy: [HousesOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: HouseCondition
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

    """The method to use when ordering \`House\`."""
    orderBy: [HousesOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: HouseCondition
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

"""A \`StreetProperty\` edge in the connection."""
type StreetPropertiesEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`StreetProperty\` at the end of the edge."""
  node: StreetProperty
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

"""A \`Property\` edge in the connection."""
type PropertiesEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Property\` at the end of the edge."""
  node: Property
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

"""Methods to use when ordering \`Post\`."""
enum PostsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
}

"""
A condition to be used against \`Post\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input PostCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: String
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

"""
A condition to be used against \`Offer\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input OfferCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`postId\` field."""
  postId: String
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
A condition to be used against \`Street\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input StreetCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`name\` field."""
  name: String
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
    postById: {
      plan(_$root, args) {
        return pgResource_postsPgResource.get({
          id: args.get("id")
        });
      },
      args: {
        id: undefined
      }
    },
    offerById: {
      plan(_$root, args) {
        return pgResource_offersPgResource.get({
          id: args.get("id")
        });
      },
      args: {
        id: undefined
      }
    },
    streetById: {
      plan(_$root, args) {
        return pgResource_streetsPgResource.get({
          id: args.get("id")
        });
      },
      args: {
        id: undefined
      }
    },
    streetByName: {
      plan(_$root, args) {
        return pgResource_streetsPgResource.get({
          name: args.get("name")
        });
      },
      args: {
        name: undefined
      }
    },
    propertyById: {
      plan(_$root, args) {
        return pgResource_propertiesPgResource.get({
          id: args.get("id")
        });
      },
      args: {
        id: undefined
      }
    },
    streetPropertyByStrIdAndPropId: {
      plan(_$root, args) {
        return pgResource_street_propertyPgResource.get({
          str_id: args.get("strId"),
          prop_id: args.get("propId")
        });
      },
      args: {
        strId: undefined,
        propId: undefined
      }
    },
    houseByStreetIdAndPropertyId: {
      plan(_$root, args) {
        return pgResource_housesPgResource.get({
          street_id: args.get("streetId"),
          property_id: args.get("propertyId")
        });
      },
      args: {
        streetId: undefined,
        propertyId: undefined
      }
    },
    buildingById: {
      plan(_$root, args) {
        return pgResource_buildingsPgResource.get({
          id: args.get("id")
        });
      },
      args: {
        id: undefined
      }
    },
    post: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    offer: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher2($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    street: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher3($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    property: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher4($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    streetProperty: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher5($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    house: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher6($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    building: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher7($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    allPosts: {
      plan() {
        return connection(pgResource_postsPgResource.find());
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
    allOffers: {
      plan() {
        return connection(pgResource_offersPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allOffers_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allOffers_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allOffers_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allOffers_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allOffers_after_applyPlan
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("OffersOrderBy"));
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
    allStreets: {
      plan() {
        return connection(pgResource_streetsPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allStreets_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allStreets_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allStreets_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allStreets_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allStreets_after_applyPlan
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("StreetsOrderBy"));
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
    allProperties: {
      plan() {
        return connection(pgResource_propertiesPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allProperties_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allProperties_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allProperties_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allProperties_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allProperties_after_applyPlan
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("PropertiesOrderBy"));
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
    allStreetProperties: {
      plan() {
        return connection(pgResource_street_propertyPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allStreetProperties_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allStreetProperties_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allStreetProperties_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allStreetProperties_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allStreetProperties_after_applyPlan
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("StreetPropertiesOrderBy"));
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
    allHouses: {
      plan() {
        return connection(pgResource_housesPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allHouses_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allHouses_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allHouses_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allHouses_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allHouses_after_applyPlan
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("HousesOrderBy"));
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
    allBuildings: {
      plan() {
        return connection(pgResource_buildingsPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allBuildings_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allBuildings_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allBuildings_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allBuildings_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allBuildings_after_applyPlan
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("BuildingsOrderBy"));
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
  Post: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.Post.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Post.codec.name].encode);
    },
    id($record) {
      return $record.get("id");
    }
  },
  Offer: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.Offer.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Offer.codec.name].encode);
    },
    id($record) {
      return $record.get("id");
    },
    postId($record) {
      return $record.get("post_id");
    }
  },
  Street: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.Street.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Street.codec.name].encode);
    },
    id($record) {
      return $record.get("id");
    },
    name($record) {
      return $record.get("name");
    },
    propertiesByStreetId: {
      plan($record) {
        const $records = pgResource_propertiesPgResource.find({
          street_id: $record.get("id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan: Street_propertiesByStreetId_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Street_propertiesByStreetId_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Street_propertiesByStreetId_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Street_propertiesByStreetId_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Street_propertiesByStreetId_after_applyPlan
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("PropertiesOrderBy"));
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
    streetPropertiesByStrId: {
      plan($record) {
        const $records = pgResource_street_propertyPgResource.find({
          str_id: $record.get("id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan: Street_streetPropertiesByStrId_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Street_streetPropertiesByStrId_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Street_streetPropertiesByStrId_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Street_streetPropertiesByStrId_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Street_streetPropertiesByStrId_after_applyPlan
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("StreetPropertiesOrderBy"));
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
    buildingsNamedAfterStreet: {
      plan($record) {
        const $records = pgResource_buildingsPgResource.find({
          name: $record.get("name")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan: Street_buildingsNamedAfterStreet_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Street_buildingsNamedAfterStreet_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Street_buildingsNamedAfterStreet_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Street_buildingsNamedAfterStreet_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Street_buildingsNamedAfterStreet_after_applyPlan
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("BuildingsOrderBy"));
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
    housesByStreetId: {
      plan($record) {
        const $records = pgResource_housesPgResource.find({
          street_id: $record.get("id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan: Street_housesByStreetId_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Street_housesByStreetId_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Street_housesByStreetId_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Street_housesByStreetId_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Street_housesByStreetId_after_applyPlan
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("HousesOrderBy"));
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
  PropertiesConnection: {
    __assertStep: ConnectionStep,
    nodes: PropertiesConnection_nodesPlan,
    edges: PropertiesConnection_edgesPlan,
    pageInfo: PropertiesConnection_pageInfoPlan,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  Property: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.Property.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Property.codec.name].encode);
    },
    id($record) {
      return $record.get("id");
    },
    streetId($record) {
      return $record.get("street_id");
    },
    nameOrNumber($record) {
      return $record.get("name_or_number");
    },
    streetByStreetId($record) {
      return pgResource_streetsPgResource.get({
        id: $record.get("street_id")
      });
    },
    streetPropertiesByPropId: {
      plan($record) {
        const $records = pgResource_street_propertyPgResource.find({
          prop_id: $record.get("id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan: Property_streetPropertiesByPropId_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Property_streetPropertiesByPropId_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Property_streetPropertiesByPropId_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Property_streetPropertiesByPropId_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Property_streetPropertiesByPropId_after_applyPlan
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("StreetPropertiesOrderBy"));
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
    buildingsByPropertyId: {
      plan($record) {
        const $records = pgResource_buildingsPgResource.find({
          property_id: $record.get("id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan: Property_buildingsByPropertyId_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Property_buildingsByPropertyId_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Property_buildingsByPropertyId_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Property_buildingsByPropertyId_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Property_buildingsByPropertyId_after_applyPlan
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("BuildingsOrderBy"));
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
    housesByPropertyId: {
      plan($record) {
        const $records = pgResource_housesPgResource.find({
          property_id: $record.get("id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan: Property_housesByPropertyId_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Property_housesByPropertyId_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Property_housesByPropertyId_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Property_housesByPropertyId_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Property_housesByPropertyId_after_applyPlan
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("HousesOrderBy"));
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
  StreetPropertiesConnection: {
    __assertStep: ConnectionStep,
    nodes: StreetPropertiesConnection_nodesPlan,
    edges: StreetPropertiesConnection_edgesPlan,
    pageInfo: StreetPropertiesConnection_pageInfoPlan,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  StreetProperty: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.StreetProperty.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.StreetProperty.codec.name].encode);
    },
    strId($record) {
      return $record.get("str_id");
    },
    propId($record) {
      return $record.get("prop_id");
    },
    currentOwner($record) {
      return $record.get("current_owner");
    },
    propertyByPropId($record) {
      return pgResource_propertiesPgResource.get({
        id: $record.get("prop_id")
      });
    },
    streetByStrId($record) {
      return pgResource_streetsPgResource.get({
        id: $record.get("str_id")
      });
    },
    houseByStreetIdAndPropertyId($record) {
      return pgResource_housesPgResource.get({
        street_id: $record.get("str_id"),
        property_id: $record.get("prop_id")
      });
    }
  },
  House: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.House.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.House.codec.name].encode);
    },
    buildingName($record) {
      return $record.get("building_name");
    },
    propertyNameOrNumber($record) {
      return $record.get("property_name_or_number");
    },
    streetName($record) {
      return $record.get("street_name");
    },
    streetId($record) {
      return $record.get("street_id");
    },
    buildingId($record) {
      return $record.get("building_id");
    },
    propertyId($record) {
      return $record.get("property_id");
    },
    floors($record) {
      return $record.get("floors");
    },
    streetByStreetId($record) {
      return pgResource_streetsPgResource.get({
        id: $record.get("street_id")
      });
    },
    buildingByBuildingId($record) {
      return pgResource_buildingsPgResource.get({
        id: $record.get("building_id")
      });
    },
    propertyByPropertyId($record) {
      return pgResource_propertiesPgResource.get({
        id: $record.get("property_id")
      });
    },
    streetPropertyByStreetIdAndPropertyId($record) {
      return pgResource_street_propertyPgResource.get({
        str_id: $record.get("street_id"),
        prop_id: $record.get("property_id")
      });
    }
  },
  Building: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.Building.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Building.codec.name].encode);
    },
    id($record) {
      return $record.get("id");
    },
    propertyId($record) {
      return $record.get("property_id");
    },
    name($record) {
      return $record.get("name");
    },
    floors($record) {
      return $record.get("floors");
    },
    isPrimary($record) {
      return $record.get("is_primary");
    },
    propertyByPropertyId($record) {
      return pgResource_propertiesPgResource.get({
        id: $record.get("property_id")
      });
    },
    namedAfterStreet($record) {
      return pgResource_streetsPgResource.get({
        name: $record.get("name")
      });
    },
    housesByBuildingId: {
      plan($record) {
        const $records = pgResource_housesPgResource.find({
          building_id: $record.get("id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan: Building_housesByBuildingId_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Building_housesByBuildingId_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Building_housesByBuildingId_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Building_housesByBuildingId_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Building_housesByBuildingId_after_applyPlan
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("HousesOrderBy"));
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
  HousesConnection: {
    __assertStep: ConnectionStep,
    nodes: HousesConnection_nodesPlan,
    edges: HousesConnection_edgesPlan,
    pageInfo: HousesConnection_pageInfoPlan,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  HousesEdge: {
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
  HousesOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        uniques8[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_houses_houses.attributes[attributeName];
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
        uniques8[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_houses_houses.attributes[attributeName];
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
    BUILDING_NAME_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "building_name",
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
    BUILDING_NAME_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "building_name",
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
    PROPERTY_NAME_OR_NUMBER_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "property_name_or_number",
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
    PROPERTY_NAME_OR_NUMBER_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "property_name_or_number",
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
    STREET_NAME_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "street_name",
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
    STREET_NAME_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "street_name",
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
    STREET_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "street_id",
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
    STREET_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "street_id",
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
    BUILDING_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "building_id",
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
    BUILDING_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "building_id",
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
    PROPERTY_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "property_id",
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
    PROPERTY_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "property_id",
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
    FLOORS_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "floors",
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
    FLOORS_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "floors",
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
  HouseCondition: {
    buildingName: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "building_name",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "building_name",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes7.building_name.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    propertyNameOrNumber: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "property_name_or_number",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "property_name_or_number",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes7.property_name_or_number.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    streetName: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "street_name",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "street_name",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes7.street_name.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    streetId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "street_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "street_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes7.street_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    buildingId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "building_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "building_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes7.building_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    propertyId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "property_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "property_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes7.property_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    floors: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "floors",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "floors",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes7.floors.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  StreetPropertiesEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  StreetPropertiesOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        uniques7[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_streetProperty_streetProperty.attributes[attributeName];
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
        uniques7[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_streetProperty_streetProperty.attributes[attributeName];
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
    STR_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "str_id",
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
    STR_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "str_id",
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
    PROP_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "prop_id",
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
    PROP_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "prop_id",
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
    CURRENT_OWNER_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "current_owner",
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
    CURRENT_OWNER_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "current_owner",
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
  StreetPropertyCondition: {
    strId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "str_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "str_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes6.str_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    propId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "prop_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "prop_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes6.prop_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    currentOwner: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "current_owner",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "current_owner",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes6.current_owner.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  BuildingsConnection: {
    __assertStep: ConnectionStep,
    nodes: BuildingsConnection_nodesPlan,
    edges: BuildingsConnection_edgesPlan,
    pageInfo: BuildingsConnection_pageInfoPlan,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  BuildingsEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  BuildingsOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        uniques9[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_buildings_buildings.attributes[attributeName];
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
        uniques9[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_buildings_buildings.attributes[attributeName];
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
    PROPERTY_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "property_id",
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
    PROPERTY_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "property_id",
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
    NAME_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "name",
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
          attribute: "name",
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
    FLOORS_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "floors",
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
    FLOORS_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "floors",
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
    IS_PRIMARY_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "is_primary",
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
    IS_PRIMARY_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "is_primary",
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
  BuildingCondition: {
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes_object_Object_2.id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    propertyId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "property_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "property_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes_object_Object_2.property_id.codec)}`;
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
            attribute: "name",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "name",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes_object_Object_2.name.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    floors: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "floors",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "floors",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes_object_Object_2.floors.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    isPrimary: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "is_primary",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "is_primary",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes_object_Object_2.is_primary.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  PropertiesEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  PropertiesOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        uniques6[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_properties_properties.attributes[attributeName];
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
        uniques6[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_properties_properties.attributes[attributeName];
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
    STREET_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "street_id",
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
    STREET_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "street_id",
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
    NAME_OR_NUMBER_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "name_or_number",
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
    NAME_OR_NUMBER_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "name_or_number",
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
  PropertyCondition: {
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
    streetId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "street_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "street_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes5.street_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    nameOrNumber: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "name_or_number",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "name_or_number",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes5.name_or_number.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
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
  PostsEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  PostsOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        uniques2[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_posts_posts.attributes[attributeName];
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
        uniques2[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_posts_posts.attributes[attributeName];
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes2.id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  OffersConnection: {
    __assertStep: ConnectionStep,
    nodes: OffersConnection_nodesPlan,
    edges: OffersConnection_edgesPlan,
    pageInfo: OffersConnection_pageInfoPlan,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  OffersEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  OffersOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        uniques4[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_offers_offers.attributes[attributeName];
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
          const attribute = registryConfig_pgCodecs_offers_offers.attributes[attributeName];
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
    POST_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "post_id",
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
    POST_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "post_id",
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
  OfferCondition: {
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
    postId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "post_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "post_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes4.post_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  StreetsConnection: {
    __assertStep: ConnectionStep,
    nodes: StreetsConnection_nodesPlan,
    edges: StreetsConnection_edgesPlan,
    pageInfo: StreetsConnection_pageInfoPlan,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  StreetsEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  StreetsOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        uniques5[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_streets_streets.attributes[attributeName];
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
          const attribute = registryConfig_pgCodecs_streets_streets.attributes[attributeName];
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
          attribute: "name",
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
    NAME_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "name",
          direction: "DESC",
          ...(undefined != null ? {
            nulls: undefined ? "LAST" : "FIRST"
          } : null)
        });
        if (true) {
          plan.setOrderIsUnique();
        }
      }
    }
  },
  StreetCondition: {
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes_object_Object_.id.codec)}`;
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
            attribute: "name",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "name",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes_object_Object_.name.codec)}`;
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
    createPost: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_postsPgResource, Object.create(null))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan: Mutation_createPost_input_applyPlan
        }
      }
    },
    createOffer: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_offersPgResource, Object.create(null))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan: Mutation_createOffer_input_applyPlan
        }
      }
    },
    createStreet: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_streetsPgResource, Object.create(null))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan: Mutation_createStreet_input_applyPlan
        }
      }
    },
    createProperty: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_propertiesPgResource, Object.create(null))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan: Mutation_createProperty_input_applyPlan
        }
      }
    },
    createStreetProperty: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_street_propertyPgResource, Object.create(null))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan: Mutation_createStreetProperty_input_applyPlan
        }
      }
    },
    createBuilding: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_buildingsPgResource, Object.create(null))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan: Mutation_createBuilding_input_applyPlan
        }
      }
    },
    updatePost: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_postsPgResource, specFromArgs(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_updatePost_input_applyPlan
        }
      }
    },
    updatePostById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_postsPgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_updatePostById_input_applyPlan
        }
      }
    },
    updateOffer: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_offersPgResource, specFromArgs2(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_updateOffer_input_applyPlan
        }
      }
    },
    updateOfferById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_offersPgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_updateOfferById_input_applyPlan
        }
      }
    },
    updateStreet: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_streetsPgResource, specFromArgs3(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_updateStreet_input_applyPlan
        }
      }
    },
    updateStreetById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_streetsPgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_updateStreetById_input_applyPlan
        }
      }
    },
    updateStreetByName: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_streetsPgResource, {
            name: args.get(['input', "name"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_updateStreetByName_input_applyPlan
        }
      }
    },
    updateProperty: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_propertiesPgResource, specFromArgs4(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_updateProperty_input_applyPlan
        }
      }
    },
    updatePropertyById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_propertiesPgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_updatePropertyById_input_applyPlan
        }
      }
    },
    updateStreetProperty: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_street_propertyPgResource, specFromArgs5(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_updateStreetProperty_input_applyPlan
        }
      }
    },
    updateStreetPropertyByStrIdAndPropId: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_street_propertyPgResource, {
            str_id: args.get(['input', "strId"]),
            prop_id: args.get(['input', "propId"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_updateStreetPropertyByStrIdAndPropId_input_applyPlan
        }
      }
    },
    updateBuilding: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_buildingsPgResource, specFromArgs6(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_updateBuilding_input_applyPlan
        }
      }
    },
    updateBuildingById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_buildingsPgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_updateBuildingById_input_applyPlan
        }
      }
    },
    deletePost: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_postsPgResource, specFromArgs7(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_deletePost_input_applyPlan
        }
      }
    },
    deletePostById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_postsPgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_deletePostById_input_applyPlan
        }
      }
    },
    deleteOffer: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_offersPgResource, specFromArgs8(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_deleteOffer_input_applyPlan
        }
      }
    },
    deleteOfferById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_offersPgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_deleteOfferById_input_applyPlan
        }
      }
    },
    deleteStreet: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_streetsPgResource, specFromArgs9(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_deleteStreet_input_applyPlan
        }
      }
    },
    deleteStreetById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_streetsPgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_deleteStreetById_input_applyPlan
        }
      }
    },
    deleteStreetByName: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_streetsPgResource, {
            name: args.get(['input', "name"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_deleteStreetByName_input_applyPlan
        }
      }
    },
    deleteProperty: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_propertiesPgResource, specFromArgs10(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_deleteProperty_input_applyPlan
        }
      }
    },
    deletePropertyById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_propertiesPgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_deletePropertyById_input_applyPlan
        }
      }
    },
    deleteStreetProperty: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_street_propertyPgResource, specFromArgs11(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_deleteStreetProperty_input_applyPlan
        }
      }
    },
    deleteStreetPropertyByStrIdAndPropId: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_street_propertyPgResource, {
            str_id: args.get(['input', "strId"]),
            prop_id: args.get(['input', "propId"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_deleteStreetPropertyByStrIdAndPropId_input_applyPlan
        }
      }
    },
    deleteBuilding: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_buildingsPgResource, specFromArgs12(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_deleteBuilding_input_applyPlan
        }
      }
    },
    deleteBuildingById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_buildingsPgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_deleteBuildingById_input_applyPlan
        }
      }
    }
  },
  CreatePostPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId: CreatePostPayload_clientMutationIdPlan,
    post: CreatePostPayload_postPlan,
    query: CreatePostPayload_queryPlan,
    postEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = uniques2[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_postsPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("PostsOrderBy"));
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
  CreatePostInput: {
    clientMutationId: {
      applyPlan: CreatePostInput_clientMutationId_applyPlan,
      autoApplyAfterParentApplyPlan: true
    },
    post: {
      applyPlan: CreatePostInput_post_applyPlan,
      autoApplyAfterParentApplyPlan: true
    }
  },
  PostInput: {
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreateOfferPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId: CreateOfferPayload_clientMutationIdPlan,
    offer: CreateOfferPayload_offerPlan,
    query: CreateOfferPayload_queryPlan,
    offerEdge: {
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
            return pgResource_offersPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("OffersOrderBy"));
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
  CreateOfferInput: {
    clientMutationId: {
      applyPlan: CreateOfferInput_clientMutationId_applyPlan,
      autoApplyAfterParentApplyPlan: true
    },
    offer: {
      applyPlan: CreateOfferInput_offer_applyPlan,
      autoApplyAfterParentApplyPlan: true
    }
  },
  OfferInput: {
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    postId: {
      applyPlan($insert, val) {
        $insert.set("post_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreateStreetPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId: CreateStreetPayload_clientMutationIdPlan,
    street: CreateStreetPayload_streetPlan,
    query: CreateStreetPayload_queryPlan,
    streetEdge: {
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
            return pgResource_streetsPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("StreetsOrderBy"));
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
  CreateStreetInput: {
    clientMutationId: {
      applyPlan: CreateStreetInput_clientMutationId_applyPlan,
      autoApplyAfterParentApplyPlan: true
    },
    street: {
      applyPlan: CreateStreetInput_street_applyPlan,
      autoApplyAfterParentApplyPlan: true
    }
  },
  StreetInput: {
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    name: {
      applyPlan($insert, val) {
        $insert.set("name", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreatePropertyPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId: CreatePropertyPayload_clientMutationIdPlan,
    property: CreatePropertyPayload_propertyPlan,
    query: CreatePropertyPayload_queryPlan,
    propertyEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = uniques6[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_propertiesPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("PropertiesOrderBy"));
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
    streetByStreetId($record) {
      return pgResource_streetsPgResource.get({
        id: $record.get("result").get("street_id")
      });
    }
  },
  CreatePropertyInput: {
    clientMutationId: {
      applyPlan: CreatePropertyInput_clientMutationId_applyPlan,
      autoApplyAfterParentApplyPlan: true
    },
    property: {
      applyPlan: CreatePropertyInput_property_applyPlan,
      autoApplyAfterParentApplyPlan: true
    }
  },
  PropertyInput: {
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    streetId: {
      applyPlan($insert, val) {
        $insert.set("street_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    nameOrNumber: {
      applyPlan($insert, val) {
        $insert.set("name_or_number", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreateStreetPropertyPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId: CreateStreetPropertyPayload_clientMutationIdPlan,
    streetProperty: CreateStreetPropertyPayload_streetPropertyPlan,
    query: CreateStreetPropertyPayload_queryPlan,
    streetPropertyEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = uniques7[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_street_propertyPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("StreetPropertiesOrderBy"));
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
    propertyByPropId($record) {
      return pgResource_propertiesPgResource.get({
        id: $record.get("result").get("prop_id")
      });
    },
    streetByStrId($record) {
      return pgResource_streetsPgResource.get({
        id: $record.get("result").get("str_id")
      });
    }
  },
  CreateStreetPropertyInput: {
    clientMutationId: {
      applyPlan: CreateStreetPropertyInput_clientMutationId_applyPlan,
      autoApplyAfterParentApplyPlan: true
    },
    streetProperty: {
      applyPlan: CreateStreetPropertyInput_streetProperty_applyPlan,
      autoApplyAfterParentApplyPlan: true
    }
  },
  StreetPropertyInput: {
    strId: {
      applyPlan($insert, val) {
        $insert.set("str_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    propId: {
      applyPlan($insert, val) {
        $insert.set("prop_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    currentOwner: {
      applyPlan($insert, val) {
        $insert.set("current_owner", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreateBuildingPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId: CreateBuildingPayload_clientMutationIdPlan,
    building: CreateBuildingPayload_buildingPlan,
    query: CreateBuildingPayload_queryPlan,
    buildingEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = uniques9[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_buildingsPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("BuildingsOrderBy"));
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
    propertyByPropertyId($record) {
      return pgResource_propertiesPgResource.get({
        id: $record.get("result").get("property_id")
      });
    },
    namedAfterStreet($record) {
      return pgResource_streetsPgResource.get({
        name: $record.get("result").get("name")
      });
    }
  },
  CreateBuildingInput: {
    clientMutationId: {
      applyPlan: CreateBuildingInput_clientMutationId_applyPlan,
      autoApplyAfterParentApplyPlan: true
    },
    building: {
      applyPlan: CreateBuildingInput_building_applyPlan,
      autoApplyAfterParentApplyPlan: true
    }
  },
  BuildingInput: {
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    propertyId: {
      applyPlan($insert, val) {
        $insert.set("property_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    name: {
      applyPlan($insert, val) {
        $insert.set("name", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    floors: {
      applyPlan($insert, val) {
        $insert.set("floors", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    isPrimary: {
      applyPlan($insert, val) {
        $insert.set("is_primary", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdatePostPayload: {
    __assertStep: ObjectStep,
    clientMutationId: UpdatePostPayload_clientMutationIdPlan,
    post: UpdatePostPayload_postPlan,
    query: UpdatePostPayload_queryPlan,
    postEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = uniques2[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_postsPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("PostsOrderBy"));
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
  UpdatePostInput: {
    clientMutationId: {
      applyPlan: UpdatePostInput_clientMutationId_applyPlan
    },
    nodeId: undefined,
    postPatch: {
      applyPlan: UpdatePostInput_postPatch_applyPlan
    }
  },
  PostPatch: {
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdatePostByIdInput: {
    clientMutationId: {
      applyPlan: UpdatePostByIdInput_clientMutationId_applyPlan
    },
    id: undefined,
    postPatch: {
      applyPlan: UpdatePostByIdInput_postPatch_applyPlan
    }
  },
  UpdateOfferPayload: {
    __assertStep: ObjectStep,
    clientMutationId: UpdateOfferPayload_clientMutationIdPlan,
    offer: UpdateOfferPayload_offerPlan,
    query: UpdateOfferPayload_queryPlan,
    offerEdge: {
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
            return pgResource_offersPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("OffersOrderBy"));
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
  UpdateOfferInput: {
    clientMutationId: {
      applyPlan: UpdateOfferInput_clientMutationId_applyPlan
    },
    nodeId: undefined,
    offerPatch: {
      applyPlan: UpdateOfferInput_offerPatch_applyPlan
    }
  },
  OfferPatch: {
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    postId: {
      applyPlan($insert, val) {
        $insert.set("post_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateOfferByIdInput: {
    clientMutationId: {
      applyPlan: UpdateOfferByIdInput_clientMutationId_applyPlan
    },
    id: undefined,
    offerPatch: {
      applyPlan: UpdateOfferByIdInput_offerPatch_applyPlan
    }
  },
  UpdateStreetPayload: {
    __assertStep: ObjectStep,
    clientMutationId: UpdateStreetPayload_clientMutationIdPlan,
    street: UpdateStreetPayload_streetPlan,
    query: UpdateStreetPayload_queryPlan,
    streetEdge: {
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
            return pgResource_streetsPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("StreetsOrderBy"));
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
  UpdateStreetInput: {
    clientMutationId: {
      applyPlan: UpdateStreetInput_clientMutationId_applyPlan
    },
    nodeId: undefined,
    streetPatch: {
      applyPlan: UpdateStreetInput_streetPatch_applyPlan
    }
  },
  StreetPatch: {
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    name: {
      applyPlan($insert, val) {
        $insert.set("name", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateStreetByIdInput: {
    clientMutationId: {
      applyPlan: UpdateStreetByIdInput_clientMutationId_applyPlan
    },
    id: undefined,
    streetPatch: {
      applyPlan: UpdateStreetByIdInput_streetPatch_applyPlan
    }
  },
  UpdateStreetByNameInput: {
    clientMutationId: {
      applyPlan: UpdateStreetByNameInput_clientMutationId_applyPlan
    },
    name: undefined,
    streetPatch: {
      applyPlan: UpdateStreetByNameInput_streetPatch_applyPlan
    }
  },
  UpdatePropertyPayload: {
    __assertStep: ObjectStep,
    clientMutationId: UpdatePropertyPayload_clientMutationIdPlan,
    property: UpdatePropertyPayload_propertyPlan,
    query: UpdatePropertyPayload_queryPlan,
    propertyEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = uniques6[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_propertiesPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("PropertiesOrderBy"));
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
    streetByStreetId($record) {
      return pgResource_streetsPgResource.get({
        id: $record.get("result").get("street_id")
      });
    }
  },
  UpdatePropertyInput: {
    clientMutationId: {
      applyPlan: UpdatePropertyInput_clientMutationId_applyPlan
    },
    nodeId: undefined,
    propertyPatch: {
      applyPlan: UpdatePropertyInput_propertyPatch_applyPlan
    }
  },
  PropertyPatch: {
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    streetId: {
      applyPlan($insert, val) {
        $insert.set("street_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    nameOrNumber: {
      applyPlan($insert, val) {
        $insert.set("name_or_number", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdatePropertyByIdInput: {
    clientMutationId: {
      applyPlan: UpdatePropertyByIdInput_clientMutationId_applyPlan
    },
    id: undefined,
    propertyPatch: {
      applyPlan: UpdatePropertyByIdInput_propertyPatch_applyPlan
    }
  },
  UpdateStreetPropertyPayload: {
    __assertStep: ObjectStep,
    clientMutationId: UpdateStreetPropertyPayload_clientMutationIdPlan,
    streetProperty: UpdateStreetPropertyPayload_streetPropertyPlan,
    query: UpdateStreetPropertyPayload_queryPlan,
    streetPropertyEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = uniques7[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_street_propertyPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("StreetPropertiesOrderBy"));
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
    propertyByPropId($record) {
      return pgResource_propertiesPgResource.get({
        id: $record.get("result").get("prop_id")
      });
    },
    streetByStrId($record) {
      return pgResource_streetsPgResource.get({
        id: $record.get("result").get("str_id")
      });
    }
  },
  UpdateStreetPropertyInput: {
    clientMutationId: {
      applyPlan: UpdateStreetPropertyInput_clientMutationId_applyPlan
    },
    nodeId: undefined,
    streetPropertyPatch: {
      applyPlan: UpdateStreetPropertyInput_streetPropertyPatch_applyPlan
    }
  },
  StreetPropertyPatch: {
    strId: {
      applyPlan($insert, val) {
        $insert.set("str_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    propId: {
      applyPlan($insert, val) {
        $insert.set("prop_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    currentOwner: {
      applyPlan($insert, val) {
        $insert.set("current_owner", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateStreetPropertyByStrIdAndPropIdInput: {
    clientMutationId: {
      applyPlan: UpdateStreetPropertyByStrIdAndPropIdInput_clientMutationId_applyPlan
    },
    strId: undefined,
    propId: undefined,
    streetPropertyPatch: {
      applyPlan: UpdateStreetPropertyByStrIdAndPropIdInput_streetPropertyPatch_applyPlan
    }
  },
  UpdateBuildingPayload: {
    __assertStep: ObjectStep,
    clientMutationId: UpdateBuildingPayload_clientMutationIdPlan,
    building: UpdateBuildingPayload_buildingPlan,
    query: UpdateBuildingPayload_queryPlan,
    buildingEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = uniques9[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_buildingsPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("BuildingsOrderBy"));
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
    propertyByPropertyId($record) {
      return pgResource_propertiesPgResource.get({
        id: $record.get("result").get("property_id")
      });
    },
    namedAfterStreet($record) {
      return pgResource_streetsPgResource.get({
        name: $record.get("result").get("name")
      });
    }
  },
  UpdateBuildingInput: {
    clientMutationId: {
      applyPlan: UpdateBuildingInput_clientMutationId_applyPlan
    },
    nodeId: undefined,
    buildingPatch: {
      applyPlan: UpdateBuildingInput_buildingPatch_applyPlan
    }
  },
  BuildingPatch: {
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    propertyId: {
      applyPlan($insert, val) {
        $insert.set("property_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    name: {
      applyPlan($insert, val) {
        $insert.set("name", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    floors: {
      applyPlan($insert, val) {
        $insert.set("floors", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    isPrimary: {
      applyPlan($insert, val) {
        $insert.set("is_primary", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateBuildingByIdInput: {
    clientMutationId: {
      applyPlan: UpdateBuildingByIdInput_clientMutationId_applyPlan
    },
    id: undefined,
    buildingPatch: {
      applyPlan: UpdateBuildingByIdInput_buildingPatch_applyPlan
    }
  },
  DeletePostPayload: {
    __assertStep: ObjectStep,
    clientMutationId: DeletePostPayload_clientMutationIdPlan,
    post: DeletePostPayload_postPlan,
    deletedPostViewId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.Post.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query: DeletePostPayload_queryPlan,
    postEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = uniques2[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_postsPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("PostsOrderBy"));
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
  DeletePostInput: {
    clientMutationId: {
      applyPlan: DeletePostInput_clientMutationId_applyPlan
    },
    nodeId: undefined
  },
  DeletePostByIdInput: {
    clientMutationId: {
      applyPlan: DeletePostByIdInput_clientMutationId_applyPlan
    },
    id: undefined
  },
  DeleteOfferPayload: {
    __assertStep: ObjectStep,
    clientMutationId: DeleteOfferPayload_clientMutationIdPlan,
    offer: DeleteOfferPayload_offerPlan,
    deletedOfferViewId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.Offer.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query: DeleteOfferPayload_queryPlan,
    offerEdge: {
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
            return pgResource_offersPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("OffersOrderBy"));
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
  DeleteOfferInput: {
    clientMutationId: {
      applyPlan: DeleteOfferInput_clientMutationId_applyPlan
    },
    nodeId: undefined
  },
  DeleteOfferByIdInput: {
    clientMutationId: {
      applyPlan: DeleteOfferByIdInput_clientMutationId_applyPlan
    },
    id: undefined
  },
  DeleteStreetPayload: {
    __assertStep: ObjectStep,
    clientMutationId: DeleteStreetPayload_clientMutationIdPlan,
    street: DeleteStreetPayload_streetPlan,
    deletedStreetId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.Street.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query: DeleteStreetPayload_queryPlan,
    streetEdge: {
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
            return pgResource_streetsPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("StreetsOrderBy"));
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
  DeleteStreetInput: {
    clientMutationId: {
      applyPlan: DeleteStreetInput_clientMutationId_applyPlan
    },
    nodeId: undefined
  },
  DeleteStreetByIdInput: {
    clientMutationId: {
      applyPlan: DeleteStreetByIdInput_clientMutationId_applyPlan
    },
    id: undefined
  },
  DeleteStreetByNameInput: {
    clientMutationId: {
      applyPlan: DeleteStreetByNameInput_clientMutationId_applyPlan
    },
    name: undefined
  },
  DeletePropertyPayload: {
    __assertStep: ObjectStep,
    clientMutationId: DeletePropertyPayload_clientMutationIdPlan,
    property: DeletePropertyPayload_propertyPlan,
    deletedPropertyId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.Property.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query: DeletePropertyPayload_queryPlan,
    propertyEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = uniques6[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_propertiesPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("PropertiesOrderBy"));
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
    streetByStreetId($record) {
      return pgResource_streetsPgResource.get({
        id: $record.get("result").get("street_id")
      });
    }
  },
  DeletePropertyInput: {
    clientMutationId: {
      applyPlan: DeletePropertyInput_clientMutationId_applyPlan
    },
    nodeId: undefined
  },
  DeletePropertyByIdInput: {
    clientMutationId: {
      applyPlan: DeletePropertyByIdInput_clientMutationId_applyPlan
    },
    id: undefined
  },
  DeleteStreetPropertyPayload: {
    __assertStep: ObjectStep,
    clientMutationId: DeleteStreetPropertyPayload_clientMutationIdPlan,
    streetProperty: DeleteStreetPropertyPayload_streetPropertyPlan,
    deletedStreetPropertyId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.StreetProperty.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query: DeleteStreetPropertyPayload_queryPlan,
    streetPropertyEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = uniques7[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_street_propertyPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("StreetPropertiesOrderBy"));
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
    propertyByPropId($record) {
      return pgResource_propertiesPgResource.get({
        id: $record.get("result").get("prop_id")
      });
    },
    streetByStrId($record) {
      return pgResource_streetsPgResource.get({
        id: $record.get("result").get("str_id")
      });
    }
  },
  DeleteStreetPropertyInput: {
    clientMutationId: {
      applyPlan: DeleteStreetPropertyInput_clientMutationId_applyPlan
    },
    nodeId: undefined
  },
  DeleteStreetPropertyByStrIdAndPropIdInput: {
    clientMutationId: {
      applyPlan: DeleteStreetPropertyByStrIdAndPropIdInput_clientMutationId_applyPlan
    },
    strId: undefined,
    propId: undefined
  },
  DeleteBuildingPayload: {
    __assertStep: ObjectStep,
    clientMutationId: DeleteBuildingPayload_clientMutationIdPlan,
    building: DeleteBuildingPayload_buildingPlan,
    deletedBuildingId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.Building.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query: DeleteBuildingPayload_queryPlan,
    buildingEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = uniques9[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_buildingsPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("BuildingsOrderBy"));
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
    propertyByPropertyId($record) {
      return pgResource_propertiesPgResource.get({
        id: $record.get("result").get("property_id")
      });
    },
    namedAfterStreet($record) {
      return pgResource_streetsPgResource.get({
        name: $record.get("result").get("name")
      });
    }
  },
  DeleteBuildingInput: {
    clientMutationId: {
      applyPlan: DeleteBuildingInput_clientMutationId_applyPlan
    },
    nodeId: undefined
  },
  DeleteBuildingByIdInput: {
    clientMutationId: {
      applyPlan: DeleteBuildingByIdInput_clientMutationId_applyPlan
    },
    id: undefined
  }
};
export const schema = makeGrafastSchema({
  typeDefs: typeDefs,
  plans: plans
});
