import { PgDeleteSingleStep, PgExecutor, TYPES, assertPgClassSingleStep, enumCodec, makeRegistry, pgDeleteSingle, pgInsertSingle, pgSelectFromRecord, pgUpdateSingle, recordCodec, sqlValueWithCodec } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ObjectStep, __ValueStep, access, assertStep, bakedInputRuntime, connection, constant, context, createObjectAndApplyChildren, first, get as get2, inhibitOnNull, inspect, lambda, list, makeDecodeNodeId, makeGrafastSchema, object, rootValue, specFromNodeId } from "grafast";
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
const entityKindsIdentifier = sql.identifier("partitions", "entity_kinds");
const entityKindsCodec = recordCodec({
  name: "entityKinds",
  identifier: entityKindsIdentifier,
  attributes: {
    __proto__: null,
    kind: {
      codec: TYPES.text,
      notNull: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "partitions",
      name: "entity_kinds"
    },
    tags: {
      __proto__: null,
      enum: true
    }
  },
  executor: executor
});
const locationsIdentifier = sql.identifier("partitions", "locations");
const locationsCodec = recordCodec({
  name: "locations",
  identifier: locationsIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.uuid,
      notNull: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "partitions",
      name: "locations"
    }
  },
  executor: executor
});
const photosIdentifier = sql.identifier("partitions", "photos");
const photosCodec = recordCodec({
  name: "photos",
  identifier: photosIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.uuid,
      notNull: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "partitions",
      name: "photos"
    }
  },
  executor: executor
});
const profilesIdentifier = sql.identifier("partitions", "profiles");
const profilesCodec = recordCodec({
  name: "profiles",
  identifier: profilesIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.uuid,
      notNull: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "partitions",
      name: "profiles"
    }
  },
  executor: executor
});
const usersIdentifier = sql.identifier("partitions", "users");
const usersCodec = recordCodec({
  name: "users",
  identifier: usersIdentifier,
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
      schemaName: "partitions",
      name: "users"
    }
  },
  executor: executor
});
const locationTagsIdentifier = sql.identifier("partitions", "location_tags");
const spec_locationTags_attributes_entity_kind_codec_EntityKindsEnum = enumCodec({
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
});
const locationTagsCodec = recordCodec({
  name: "locationTags",
  identifier: locationTagsIdentifier,
  attributes: {
    __proto__: null,
    entity_kind: {
      codec: spec_locationTags_attributes_entity_kind_codec_EntityKindsEnum,
      notNull: true
    },
    entity_id: {
      codec: TYPES.uuid,
      notNull: true
    },
    tag: {
      codec: TYPES.citext,
      notNull: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "partitions",
      name: "location_tags"
    }
  },
  executor: executor
});
const measurementsIdentifier = sql.identifier("partitions", "measurements");
const measurementsCodec = recordCodec({
  name: "measurements",
  identifier: measurementsIdentifier,
  attributes: {
    __proto__: null,
    timestamp: {
      codec: TYPES.timestamptz,
      notNull: true
    },
    key: {
      codec: TYPES.text,
      notNull: true
    },
    value: {
      codec: TYPES.float
    },
    user_id: {
      codec: TYPES.int,
      notNull: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "partitions",
      name: "measurements"
    }
  },
  executor: executor
});
const measurementsY2022Identifier = sql.identifier("partitions", "measurements_y2022");
const measurementsY2022Codec = recordCodec({
  name: "measurementsY2022",
  identifier: measurementsY2022Identifier,
  attributes: {
    __proto__: null,
    timestamp: {
      codec: TYPES.timestamptz,
      notNull: true
    },
    key: {
      codec: TYPES.text,
      notNull: true
    },
    value: {
      codec: TYPES.float
    },
    user_id: {
      codec: TYPES.int,
      notNull: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "partitions",
      name: "measurements_y2022"
    }
  },
  executor: executor
});
const measurementsY2023Identifier = sql.identifier("partitions", "measurements_y2023");
const measurementsY2023Codec = recordCodec({
  name: "measurementsY2023",
  identifier: measurementsY2023Identifier,
  attributes: {
    __proto__: null,
    timestamp: {
      codec: TYPES.timestamptz,
      notNull: true
    },
    key: {
      codec: TYPES.text,
      notNull: true
    },
    value: {
      codec: TYPES.float
    },
    user_id: {
      codec: TYPES.int,
      notNull: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "partitions",
      name: "measurements_y2023"
    }
  },
  executor: executor
});
const measurementsY2024Identifier = sql.identifier("partitions", "measurements_y2024");
const measurementsY2024Codec = recordCodec({
  name: "measurementsY2024",
  identifier: measurementsY2024Identifier,
  attributes: {
    __proto__: null,
    timestamp: {
      codec: TYPES.timestamptz,
      notNull: true
    },
    key: {
      codec: TYPES.text,
      notNull: true
    },
    value: {
      codec: TYPES.float
    },
    user_id: {
      codec: TYPES.int,
      notNull: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "partitions",
      name: "measurements_y2024"
    }
  },
  executor: executor
});
const photoTagsIdentifier = sql.identifier("partitions", "photo_tags");
const photoTagsCodec = recordCodec({
  name: "photoTags",
  identifier: photoTagsIdentifier,
  attributes: {
    __proto__: null,
    entity_kind: {
      codec: spec_locationTags_attributes_entity_kind_codec_EntityKindsEnum,
      notNull: true
    },
    entity_id: {
      codec: TYPES.uuid,
      notNull: true
    },
    tag: {
      codec: TYPES.citext,
      notNull: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "partitions",
      name: "photo_tags"
    }
  },
  executor: executor
});
const profileTagsIdentifier = sql.identifier("partitions", "profile_tags");
const profileTagsCodec = recordCodec({
  name: "profileTags",
  identifier: profileTagsIdentifier,
  attributes: {
    __proto__: null,
    entity_kind: {
      codec: spec_locationTags_attributes_entity_kind_codec_EntityKindsEnum,
      notNull: true
    },
    entity_id: {
      codec: TYPES.uuid,
      notNull: true
    },
    tag: {
      codec: TYPES.citext,
      notNull: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "partitions",
      name: "profile_tags"
    }
  },
  executor: executor
});
const tagsIdentifier = sql.identifier("partitions", "tags");
const tagsCodec = recordCodec({
  name: "tags",
  identifier: tagsIdentifier,
  attributes: {
    __proto__: null,
    entity_kind: {
      codec: spec_locationTags_attributes_entity_kind_codec_EntityKindsEnum,
      notNull: true
    },
    entity_id: {
      codec: TYPES.uuid,
      notNull: true
    },
    tag: {
      codec: TYPES.citext,
      notNull: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "partitions",
      name: "tags"
    },
    tags: {
      __proto__: null,
      partitionExpose: "child"
    }
  },
  executor: executor
});
const entity_kinds_resourceOptionsConfig = {
  executor: executor,
  name: "entity_kinds",
  identifier: "main.partitions.entity_kinds",
  from: entityKindsIdentifier,
  codec: entityKindsCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "partitions",
      name: "entity_kinds"
    },
    tags: {
      enum: true
    }
  },
  uniques: [{
    attributes: ["kind"],
    isPrimary: true
  }]
};
const locationsUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const locations_resourceOptionsConfig = {
  executor: executor,
  name: "locations",
  identifier: "main.partitions.locations",
  from: locationsIdentifier,
  codec: locationsCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "partitions",
      name: "locations"
    }
  },
  uniques: locationsUniques
};
const photosUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const photos_resourceOptionsConfig = {
  executor: executor,
  name: "photos",
  identifier: "main.partitions.photos",
  from: photosIdentifier,
  codec: photosCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "partitions",
      name: "photos"
    }
  },
  uniques: photosUniques
};
const profilesUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const profiles_resourceOptionsConfig = {
  executor: executor,
  name: "profiles",
  identifier: "main.partitions.profiles",
  from: profilesIdentifier,
  codec: profilesCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "partitions",
      name: "profiles"
    }
  },
  uniques: profilesUniques
};
const usersUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const users_resourceOptionsConfig = {
  executor: executor,
  name: "users",
  identifier: "main.partitions.users",
  from: usersIdentifier,
  codec: usersCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "partitions",
      name: "users"
    }
  },
  uniques: usersUniques
};
const measurementsUniques = [{
  attributes: ["timestamp", "key"],
  isPrimary: true
}];
const measurements_resourceOptionsConfig = {
  executor: executor,
  name: "measurements",
  identifier: "main.partitions.measurements",
  from: measurementsIdentifier,
  codec: measurementsCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "partitions",
      name: "measurements"
    },
    hasPartitions: true
  },
  uniques: measurementsUniques
};
const tags_resourceOptionsConfig = {
  executor: executor,
  name: "tags",
  identifier: "main.partitions.tags",
  from: tagsIdentifier,
  codec: tagsCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "partitions",
      name: "tags"
    },
    hasPartitions: true,
    tags: {
      partitionExpose: "child"
    }
  },
  uniques: [{
    attributes: ["entity_kind", "entity_id", "tag"],
    isPrimary: true
  }]
};
const measurements_y2022_resourceOptionsConfig = {
  executor: executor,
  name: "measurements_y2022",
  identifier: "main.partitions.measurements_y2022",
  from: measurementsY2022Identifier,
  codec: measurementsY2022Codec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "partitions",
      name: "measurements_y2022"
    },
    partitionParent: {
      schemaName: "partitions",
      name: "measurements"
    }
  },
  uniques: [{
    attributes: ["timestamp", "key"],
    isPrimary: true
  }]
};
const measurements_y2023_resourceOptionsConfig = {
  executor: executor,
  name: "measurements_y2023",
  identifier: "main.partitions.measurements_y2023",
  from: measurementsY2023Identifier,
  codec: measurementsY2023Codec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "partitions",
      name: "measurements_y2023"
    },
    partitionParent: {
      schemaName: "partitions",
      name: "measurements"
    }
  },
  uniques: [{
    attributes: ["timestamp", "key"],
    isPrimary: true
  }]
};
const measurements_y2024_resourceOptionsConfig = {
  executor: executor,
  name: "measurements_y2024",
  identifier: "main.partitions.measurements_y2024",
  from: measurementsY2024Identifier,
  codec: measurementsY2024Codec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "partitions",
      name: "measurements_y2024"
    },
    partitionParent: {
      schemaName: "partitions",
      name: "measurements"
    }
  },
  uniques: [{
    attributes: ["timestamp", "key"],
    isPrimary: true
  }]
};
const location_tagsUniques = [{
  attributes: ["entity_kind", "entity_id", "tag"],
  isPrimary: true
}];
const location_tags_resourceOptionsConfig = {
  executor: executor,
  name: "location_tags",
  identifier: "main.partitions.location_tags",
  from: locationTagsIdentifier,
  codec: locationTagsCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "partitions",
      name: "location_tags"
    },
    partitionParent: {
      schemaName: "partitions",
      name: "tags"
    }
  },
  uniques: location_tagsUniques
};
const photo_tagsUniques = [{
  attributes: ["entity_kind", "entity_id", "tag"],
  isPrimary: true
}];
const photo_tags_resourceOptionsConfig = {
  executor: executor,
  name: "photo_tags",
  identifier: "main.partitions.photo_tags",
  from: photoTagsIdentifier,
  codec: photoTagsCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "partitions",
      name: "photo_tags"
    },
    partitionParent: {
      schemaName: "partitions",
      name: "tags"
    }
  },
  uniques: photo_tagsUniques
};
const profile_tagsUniques = [{
  attributes: ["entity_kind", "entity_id", "tag"],
  isPrimary: true
}];
const profile_tags_resourceOptionsConfig = {
  executor: executor,
  name: "profile_tags",
  identifier: "main.partitions.profile_tags",
  from: profileTagsIdentifier,
  codec: profileTagsCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "partitions",
      name: "profile_tags"
    },
    partitionParent: {
      schemaName: "partitions",
      name: "tags"
    }
  },
  uniques: profile_tagsUniques
};
const registry = makeRegistry({
  pgExecutors: {
    __proto__: null,
    main: executor
  },
  pgCodecs: {
    __proto__: null,
    entityKinds: entityKindsCodec,
    text: TYPES.text,
    locations: locationsCodec,
    uuid: TYPES.uuid,
    photos: photosCodec,
    profiles: profilesCodec,
    users: usersCodec,
    int4: TYPES.int,
    varchar: TYPES.varchar,
    bpchar: TYPES.bpchar,
    timestamptz: TYPES.timestamptz,
    citext: TYPES.citext,
    float8: TYPES.float,
    locationTags: locationTagsCodec,
    EntityKindsEnum: spec_locationTags_attributes_entity_kind_codec_EntityKindsEnum,
    measurements: measurementsCodec,
    measurementsY2022: measurementsY2022Codec,
    measurementsY2023: measurementsY2023Codec,
    measurementsY2024: measurementsY2024Codec,
    photoTags: photoTagsCodec,
    profileTags: profileTagsCodec,
    tags: tagsCodec,
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
    entity_kinds: entity_kinds_resourceOptionsConfig,
    locations: locations_resourceOptionsConfig,
    photos: photos_resourceOptionsConfig,
    profiles: profiles_resourceOptionsConfig,
    users: users_resourceOptionsConfig,
    measurements: measurements_resourceOptionsConfig,
    tags: tags_resourceOptionsConfig,
    measurements_y2022: measurements_y2022_resourceOptionsConfig,
    measurements_y2023: measurements_y2023_resourceOptionsConfig,
    measurements_y2024: measurements_y2024_resourceOptionsConfig,
    location_tags: location_tags_resourceOptionsConfig,
    photo_tags: photo_tags_resourceOptionsConfig,
    profile_tags: profile_tags_resourceOptionsConfig
  },
  pgRelations: {
    __proto__: null,
    entityKinds: {
      __proto__: null,
      tagsByTheirEntityKind: {
        localCodec: entityKindsCodec,
        remoteResourceOptions: tags_resourceOptionsConfig,
        localAttributes: ["kind"],
        remoteAttributes: ["entity_kind"],
        isReferencee: true
      },
      photoTagsByTheirEntityKind: {
        localCodec: entityKindsCodec,
        remoteResourceOptions: photo_tags_resourceOptionsConfig,
        localAttributes: ["kind"],
        remoteAttributes: ["entity_kind"],
        isReferencee: true
      },
      locationTagsByTheirEntityKind: {
        localCodec: entityKindsCodec,
        remoteResourceOptions: location_tags_resourceOptionsConfig,
        localAttributes: ["kind"],
        remoteAttributes: ["entity_kind"],
        isReferencee: true
      },
      profileTagsByTheirEntityKind: {
        localCodec: entityKindsCodec,
        remoteResourceOptions: profile_tags_resourceOptionsConfig,
        localAttributes: ["kind"],
        remoteAttributes: ["entity_kind"],
        isReferencee: true
      }
    },
    locationTags: {
      __proto__: null,
      locationsByMyEntityId: {
        localCodec: locationTagsCodec,
        remoteResourceOptions: locations_resourceOptionsConfig,
        localAttributes: ["entity_id"],
        remoteAttributes: ["id"],
        isUnique: true
      },
      entityKindsByMyEntityKind: {
        localCodec: locationTagsCodec,
        remoteResourceOptions: entity_kinds_resourceOptionsConfig,
        localAttributes: ["entity_kind"],
        remoteAttributes: ["kind"],
        isUnique: true
      }
    },
    locations: {
      __proto__: null,
      locationTagsByTheirEntityId: {
        localCodec: locationsCodec,
        remoteResourceOptions: location_tags_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["entity_id"],
        isReferencee: true
      }
    },
    measurements: {
      __proto__: null,
      usersByMyUserId: {
        localCodec: measurementsCodec,
        remoteResourceOptions: users_resourceOptionsConfig,
        localAttributes: ["user_id"],
        remoteAttributes: ["id"],
        isUnique: true
      }
    },
    measurementsY2022: {
      __proto__: null,
      usersByMyUserId: {
        localCodec: measurementsY2022Codec,
        remoteResourceOptions: users_resourceOptionsConfig,
        localAttributes: ["user_id"],
        remoteAttributes: ["id"],
        isUnique: true
      }
    },
    measurementsY2023: {
      __proto__: null,
      usersByMyUserId: {
        localCodec: measurementsY2023Codec,
        remoteResourceOptions: users_resourceOptionsConfig,
        localAttributes: ["user_id"],
        remoteAttributes: ["id"],
        isUnique: true
      }
    },
    measurementsY2024: {
      __proto__: null,
      usersByMyUserId: {
        localCodec: measurementsY2024Codec,
        remoteResourceOptions: users_resourceOptionsConfig,
        localAttributes: ["user_id"],
        remoteAttributes: ["id"],
        isUnique: true
      }
    },
    photoTags: {
      __proto__: null,
      photosByMyEntityId: {
        localCodec: photoTagsCodec,
        remoteResourceOptions: photos_resourceOptionsConfig,
        localAttributes: ["entity_id"],
        remoteAttributes: ["id"],
        isUnique: true
      },
      entityKindsByMyEntityKind: {
        localCodec: photoTagsCodec,
        remoteResourceOptions: entity_kinds_resourceOptionsConfig,
        localAttributes: ["entity_kind"],
        remoteAttributes: ["kind"],
        isUnique: true
      }
    },
    photos: {
      __proto__: null,
      photoTagsByTheirEntityId: {
        localCodec: photosCodec,
        remoteResourceOptions: photo_tags_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["entity_id"],
        isReferencee: true
      }
    },
    profileTags: {
      __proto__: null,
      profilesByMyEntityId: {
        localCodec: profileTagsCodec,
        remoteResourceOptions: profiles_resourceOptionsConfig,
        localAttributes: ["entity_id"],
        remoteAttributes: ["id"],
        isUnique: true
      },
      entityKindsByMyEntityKind: {
        localCodec: profileTagsCodec,
        remoteResourceOptions: entity_kinds_resourceOptionsConfig,
        localAttributes: ["entity_kind"],
        remoteAttributes: ["kind"],
        isUnique: true
      }
    },
    profiles: {
      __proto__: null,
      profileTagsByTheirEntityId: {
        localCodec: profilesCodec,
        remoteResourceOptions: profile_tags_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["entity_id"],
        isReferencee: true
      }
    },
    tags: {
      __proto__: null,
      entityKindsByMyEntityKind: {
        localCodec: tagsCodec,
        remoteResourceOptions: entity_kinds_resourceOptionsConfig,
        localAttributes: ["entity_kind"],
        remoteAttributes: ["kind"],
        isUnique: true
      }
    },
    users: {
      __proto__: null,
      measurementsByTheirUserId: {
        localCodec: usersCodec,
        remoteResourceOptions: measurements_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["user_id"],
        isReferencee: true
      },
      measurementsY2022SByTheirUserId: {
        localCodec: usersCodec,
        remoteResourceOptions: measurements_y2022_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["user_id"],
        isReferencee: true
      },
      measurementsY2023SByTheirUserId: {
        localCodec: usersCodec,
        remoteResourceOptions: measurements_y2023_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["user_id"],
        isReferencee: true
      },
      measurementsY2024SByTheirUserId: {
        localCodec: usersCodec,
        remoteResourceOptions: measurements_y2024_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["user_id"],
        isReferencee: true
      }
    }
  }
});
const resource_locationsPgResource = registry.pgResources["locations"];
const resource_photosPgResource = registry.pgResources["photos"];
const resource_profilesPgResource = registry.pgResources["profiles"];
const resource_usersPgResource = registry.pgResources["users"];
const resource_measurementsPgResource = registry.pgResources["measurements"];
const resource_location_tagsPgResource = registry.pgResources["location_tags"];
const resource_photo_tagsPgResource = registry.pgResources["photo_tags"];
const resource_profile_tagsPgResource = registry.pgResources["profile_tags"];
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
const nodeIdHandler_Location = makeTableNodeIdHandler({
  typeName: "Location",
  identifier: "locations",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_locationsPgResource,
  pk: locationsUniques[0].attributes
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
const nodeFetcher_Location = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Location));
  return nodeIdHandler_Location.get(nodeIdHandler_Location.getSpec($decoded));
};
const nodeIdHandler_Photo = makeTableNodeIdHandler({
  typeName: "Photo",
  identifier: "photos",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_photosPgResource,
  pk: photosUniques[0].attributes
});
const nodeFetcher_Photo = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Photo));
  return nodeIdHandler_Photo.get(nodeIdHandler_Photo.getSpec($decoded));
};
const nodeIdHandler_Profile = makeTableNodeIdHandler({
  typeName: "Profile",
  identifier: "profiles",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_profilesPgResource,
  pk: profilesUniques[0].attributes
});
const nodeFetcher_Profile = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Profile));
  return nodeIdHandler_Profile.get(nodeIdHandler_Profile.getSpec($decoded));
};
const nodeIdHandler_User = makeTableNodeIdHandler({
  typeName: "User",
  identifier: "users",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_usersPgResource,
  pk: usersUniques[0].attributes
});
const nodeFetcher_User = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_User));
  return nodeIdHandler_User.get(nodeIdHandler_User.getSpec($decoded));
};
const nodeIdHandler_Measurement = makeTableNodeIdHandler({
  typeName: "Measurement",
  identifier: "measurements",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_measurementsPgResource,
  pk: measurementsUniques[0].attributes
});
const nodeFetcher_Measurement = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Measurement));
  return nodeIdHandler_Measurement.get(nodeIdHandler_Measurement.getSpec($decoded));
};
const nodeIdHandler_LocationTag = makeTableNodeIdHandler({
  typeName: "LocationTag",
  identifier: "location_tags",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_location_tagsPgResource,
  pk: location_tagsUniques[0].attributes
});
const nodeFetcher_LocationTag = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_LocationTag));
  return nodeIdHandler_LocationTag.get(nodeIdHandler_LocationTag.getSpec($decoded));
};
const nodeIdHandler_PhotoTag = makeTableNodeIdHandler({
  typeName: "PhotoTag",
  identifier: "photo_tags",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_photo_tagsPgResource,
  pk: photo_tagsUniques[0].attributes
});
const nodeFetcher_PhotoTag = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_PhotoTag));
  return nodeIdHandler_PhotoTag.get(nodeIdHandler_PhotoTag.getSpec($decoded));
};
const nodeIdHandler_ProfileTag = makeTableNodeIdHandler({
  typeName: "ProfileTag",
  identifier: "profile_tags",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_profile_tagsPgResource,
  pk: profile_tagsUniques[0].attributes
});
const nodeFetcher_ProfileTag = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_ProfileTag));
  return nodeIdHandler_ProfileTag.get(nodeIdHandler_ProfileTag.getSpec($decoded));
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
  Location: nodeIdHandler_Location,
  Photo: nodeIdHandler_Photo,
  Profile: nodeIdHandler_Profile,
  User: nodeIdHandler_User,
  Measurement: nodeIdHandler_Measurement,
  LocationTag: nodeIdHandler_LocationTag,
  PhotoTag: nodeIdHandler_PhotoTag,
  ProfileTag: nodeIdHandler_ProfileTag
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
function toString(value) {
  return "" + value;
}
const coerce = string => {
  if (!/^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i.test(string)) {
    throw new GraphQLError("Invalid UUID, expected 32 hexadecimal characters, optionally with hyphens");
  }
  return string;
};
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
function applyInputToInsert(_, $object) {
  return $object;
}
const specFromArgs_Location = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Location, $nodeId);
};
function applyInputToUpdateOrDelete(_, $object) {
  return $object;
}
const specFromArgs_Photo = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Photo, $nodeId);
};
const specFromArgs_Profile = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Profile, $nodeId);
};
const specFromArgs_User = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_User, $nodeId);
};
const specFromArgs_Measurement = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Measurement, $nodeId);
};
const specFromArgs_LocationTag = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_LocationTag, $nodeId);
};
const specFromArgs_PhotoTag = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_PhotoTag, $nodeId);
};
const specFromArgs_ProfileTag = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_ProfileTag, $nodeId);
};
const specFromArgs_Location2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Location, $nodeId);
};
const specFromArgs_Photo2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Photo, $nodeId);
};
const specFromArgs_Profile2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Profile, $nodeId);
};
const specFromArgs_User2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_User, $nodeId);
};
const specFromArgs_Measurement2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Measurement, $nodeId);
};
const specFromArgs_LocationTag2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_LocationTag, $nodeId);
};
const specFromArgs_PhotoTag2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_PhotoTag, $nodeId);
};
const specFromArgs_ProfileTag2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_ProfileTag, $nodeId);
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

  """Get a single \`Location\`."""
  locationById(id: UUID!): Location

  """Get a single \`Photo\`."""
  photoById(id: UUID!): Photo

  """Get a single \`Profile\`."""
  profileById(id: UUID!): Profile

  """Get a single \`User\`."""
  userById(id: Int!): User

  """Get a single \`Measurement\`."""
  measurementByTimestampAndKey(timestamp: Datetime!, key: String!): Measurement

  """Get a single \`LocationTag\`."""
  locationTagByEntityKindAndEntityIdAndTag(entityKind: EntityKinds!, entityId: UUID!, tag: String!): LocationTag

  """Get a single \`PhotoTag\`."""
  photoTagByEntityKindAndEntityIdAndTag(entityKind: EntityKinds!, entityId: UUID!, tag: String!): PhotoTag

  """Get a single \`ProfileTag\`."""
  profileTagByEntityKindAndEntityIdAndTag(entityKind: EntityKinds!, entityId: UUID!, tag: String!): ProfileTag

  """Reads a single \`Location\` using its globally unique \`ID\`."""
  location(
    """The globally unique \`ID\` to be used in selecting a single \`Location\`."""
    nodeId: ID!
  ): Location

  """Reads a single \`Photo\` using its globally unique \`ID\`."""
  photo(
    """The globally unique \`ID\` to be used in selecting a single \`Photo\`."""
    nodeId: ID!
  ): Photo

  """Reads a single \`Profile\` using its globally unique \`ID\`."""
  profile(
    """The globally unique \`ID\` to be used in selecting a single \`Profile\`."""
    nodeId: ID!
  ): Profile

  """Reads a single \`User\` using its globally unique \`ID\`."""
  user(
    """The globally unique \`ID\` to be used in selecting a single \`User\`."""
    nodeId: ID!
  ): User

  """Reads a single \`Measurement\` using its globally unique \`ID\`."""
  measurement(
    """
    The globally unique \`ID\` to be used in selecting a single \`Measurement\`.
    """
    nodeId: ID!
  ): Measurement

  """Reads a single \`LocationTag\` using its globally unique \`ID\`."""
  locationTag(
    """
    The globally unique \`ID\` to be used in selecting a single \`LocationTag\`.
    """
    nodeId: ID!
  ): LocationTag

  """Reads a single \`PhotoTag\` using its globally unique \`ID\`."""
  photoTag(
    """The globally unique \`ID\` to be used in selecting a single \`PhotoTag\`."""
    nodeId: ID!
  ): PhotoTag

  """Reads a single \`ProfileTag\` using its globally unique \`ID\`."""
  profileTag(
    """
    The globally unique \`ID\` to be used in selecting a single \`ProfileTag\`.
    """
    nodeId: ID!
  ): ProfileTag

  """Reads and enables pagination through a set of \`Location\`."""
  allLocations(
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
    condition: LocationCondition

    """The method to use when ordering \`Location\`."""
    orderBy: [LocationsOrderBy!] = [PRIMARY_KEY_ASC]
  ): LocationsConnection

  """Reads and enables pagination through a set of \`Photo\`."""
  allPhotos(
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
    condition: PhotoCondition

    """The method to use when ordering \`Photo\`."""
    orderBy: [PhotosOrderBy!] = [PRIMARY_KEY_ASC]
  ): PhotosConnection

  """Reads and enables pagination through a set of \`Profile\`."""
  allProfiles(
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
    condition: ProfileCondition

    """The method to use when ordering \`Profile\`."""
    orderBy: [ProfilesOrderBy!] = [PRIMARY_KEY_ASC]
  ): ProfilesConnection

  """Reads and enables pagination through a set of \`User\`."""
  allUsers(
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
    condition: UserCondition

    """The method to use when ordering \`User\`."""
    orderBy: [UsersOrderBy!] = [PRIMARY_KEY_ASC]
  ): UsersConnection

  """Reads and enables pagination through a set of \`Measurement\`."""
  allMeasurements(
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
    condition: MeasurementCondition

    """The method to use when ordering \`Measurement\`."""
    orderBy: [MeasurementsOrderBy!] = [PRIMARY_KEY_ASC]
  ): MeasurementsConnection

  """Reads and enables pagination through a set of \`LocationTag\`."""
  allLocationTags(
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
    condition: LocationTagCondition

    """The method to use when ordering \`LocationTag\`."""
    orderBy: [LocationTagsOrderBy!] = [PRIMARY_KEY_ASC]
  ): LocationTagsConnection

  """Reads and enables pagination through a set of \`PhotoTag\`."""
  allPhotoTags(
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
    condition: PhotoTagCondition

    """The method to use when ordering \`PhotoTag\`."""
    orderBy: [PhotoTagsOrderBy!] = [PRIMARY_KEY_ASC]
  ): PhotoTagsConnection

  """Reads and enables pagination through a set of \`ProfileTag\`."""
  allProfileTags(
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
    condition: ProfileTagCondition

    """The method to use when ordering \`ProfileTag\`."""
    orderBy: [ProfileTagsOrderBy!] = [PRIMARY_KEY_ASC]
  ): ProfileTagsConnection
}

"""An object with a globally unique \`ID\`."""
interface Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
}

type Location implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: UUID!

  """Reads and enables pagination through a set of \`LocationTag\`."""
  locationTagsByEntityId(
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
    condition: LocationTagCondition

    """The method to use when ordering \`LocationTag\`."""
    orderBy: [LocationTagsOrderBy!] = [PRIMARY_KEY_ASC]
  ): LocationTagsConnection!
}

"""
A universally unique identifier as defined by [RFC 4122](https://tools.ietf.org/html/rfc4122).
"""
scalar UUID

"""A connection to a list of \`LocationTag\` values."""
type LocationTagsConnection {
  """A list of \`LocationTag\` objects."""
  nodes: [LocationTag]!

  """
  A list of edges which contains the \`LocationTag\` and cursor to aid in pagination.
  """
  edges: [LocationTagsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`LocationTag\` you could get from the connection."""
  totalCount: Int!
}

type LocationTag implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  entityKind: EntityKinds!
  entityId: UUID!
  tag: String!

  """Reads a single \`Location\` that is related to this \`LocationTag\`."""
  locationByEntityId: Location
}

enum EntityKinds {
  PHOTOS
  LOCATIONS
  PROFILES
}

"""A \`LocationTag\` edge in the connection."""
type LocationTagsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`LocationTag\` at the end of the edge."""
  node: LocationTag
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
A condition to be used against \`LocationTag\` object types. All fields are tested
for equality and combined with a logical ‘and.’
"""
input LocationTagCondition {
  """Checks for equality with the object’s \`entityKind\` field."""
  entityKind: EntityKinds

  """Checks for equality with the object’s \`entityId\` field."""
  entityId: UUID

  """Checks for equality with the object’s \`tag\` field."""
  tag: String
}

"""Methods to use when ordering \`LocationTag\`."""
enum LocationTagsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ENTITY_KIND_ASC
  ENTITY_KIND_DESC
  ENTITY_ID_ASC
  ENTITY_ID_DESC
  TAG_ASC
  TAG_DESC
}

type Photo implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: UUID!

  """Reads and enables pagination through a set of \`PhotoTag\`."""
  photoTagsByEntityId(
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
    condition: PhotoTagCondition

    """The method to use when ordering \`PhotoTag\`."""
    orderBy: [PhotoTagsOrderBy!] = [PRIMARY_KEY_ASC]
  ): PhotoTagsConnection!
}

"""A connection to a list of \`PhotoTag\` values."""
type PhotoTagsConnection {
  """A list of \`PhotoTag\` objects."""
  nodes: [PhotoTag]!

  """
  A list of edges which contains the \`PhotoTag\` and cursor to aid in pagination.
  """
  edges: [PhotoTagsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`PhotoTag\` you could get from the connection."""
  totalCount: Int!
}

type PhotoTag implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  entityKind: EntityKinds!
  entityId: UUID!
  tag: String!

  """Reads a single \`Photo\` that is related to this \`PhotoTag\`."""
  photoByEntityId: Photo
}

"""A \`PhotoTag\` edge in the connection."""
type PhotoTagsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`PhotoTag\` at the end of the edge."""
  node: PhotoTag
}

"""
A condition to be used against \`PhotoTag\` object types. All fields are tested
for equality and combined with a logical ‘and.’
"""
input PhotoTagCondition {
  """Checks for equality with the object’s \`entityKind\` field."""
  entityKind: EntityKinds

  """Checks for equality with the object’s \`entityId\` field."""
  entityId: UUID

  """Checks for equality with the object’s \`tag\` field."""
  tag: String
}

"""Methods to use when ordering \`PhotoTag\`."""
enum PhotoTagsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ENTITY_KIND_ASC
  ENTITY_KIND_DESC
  ENTITY_ID_ASC
  ENTITY_ID_DESC
  TAG_ASC
  TAG_DESC
}

type Profile implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: UUID!

  """Reads and enables pagination through a set of \`ProfileTag\`."""
  profileTagsByEntityId(
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
    condition: ProfileTagCondition

    """The method to use when ordering \`ProfileTag\`."""
    orderBy: [ProfileTagsOrderBy!] = [PRIMARY_KEY_ASC]
  ): ProfileTagsConnection!
}

"""A connection to a list of \`ProfileTag\` values."""
type ProfileTagsConnection {
  """A list of \`ProfileTag\` objects."""
  nodes: [ProfileTag]!

  """
  A list of edges which contains the \`ProfileTag\` and cursor to aid in pagination.
  """
  edges: [ProfileTagsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`ProfileTag\` you could get from the connection."""
  totalCount: Int!
}

type ProfileTag implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  entityKind: EntityKinds!
  entityId: UUID!
  tag: String!

  """Reads a single \`Profile\` that is related to this \`ProfileTag\`."""
  profileByEntityId: Profile
}

"""A \`ProfileTag\` edge in the connection."""
type ProfileTagsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`ProfileTag\` at the end of the edge."""
  node: ProfileTag
}

"""
A condition to be used against \`ProfileTag\` object types. All fields are tested
for equality and combined with a logical ‘and.’
"""
input ProfileTagCondition {
  """Checks for equality with the object’s \`entityKind\` field."""
  entityKind: EntityKinds

  """Checks for equality with the object’s \`entityId\` field."""
  entityId: UUID

  """Checks for equality with the object’s \`tag\` field."""
  tag: String
}

"""Methods to use when ordering \`ProfileTag\`."""
enum ProfileTagsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ENTITY_KIND_ASC
  ENTITY_KIND_DESC
  ENTITY_ID_ASC
  ENTITY_ID_DESC
  TAG_ASC
  TAG_DESC
}

type User implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  name: String!

  """Reads and enables pagination through a set of \`Measurement\`."""
  measurementsByUserId(
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
    condition: MeasurementCondition

    """The method to use when ordering \`Measurement\`."""
    orderBy: [MeasurementsOrderBy!] = [PRIMARY_KEY_ASC]
  ): MeasurementsConnection!
}

"""A connection to a list of \`Measurement\` values."""
type MeasurementsConnection {
  """A list of \`Measurement\` objects."""
  nodes: [Measurement]!

  """
  A list of edges which contains the \`Measurement\` and cursor to aid in pagination.
  """
  edges: [MeasurementsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Measurement\` you could get from the connection."""
  totalCount: Int!
}

type Measurement implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  timestamp: Datetime!
  key: String!
  value: Float
  userId: Int!

  """Reads a single \`User\` that is related to this \`Measurement\`."""
  userByUserId: User
}

"""
A point in time as described by the [ISO
8601](https://en.wikipedia.org/wiki/ISO_8601) and, if it has a timezone, [RFC
3339](https://datatracker.ietf.org/doc/html/rfc3339) standards. Input values
that do not conform to both ISO 8601 and RFC 3339 may be coerced, which may lead
to unexpected results.
"""
scalar Datetime

"""A \`Measurement\` edge in the connection."""
type MeasurementsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Measurement\` at the end of the edge."""
  node: Measurement
}

"""
A condition to be used against \`Measurement\` object types. All fields are tested
for equality and combined with a logical ‘and.’
"""
input MeasurementCondition {
  """Checks for equality with the object’s \`timestamp\` field."""
  timestamp: Datetime

  """Checks for equality with the object’s \`key\` field."""
  key: String

  """Checks for equality with the object’s \`value\` field."""
  value: Float

  """Checks for equality with the object’s \`userId\` field."""
  userId: Int
}

"""Methods to use when ordering \`Measurement\`."""
enum MeasurementsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  TIMESTAMP_ASC
  TIMESTAMP_DESC
  KEY_ASC
  KEY_DESC
  VALUE_ASC
  VALUE_DESC
  USER_ID_ASC
  USER_ID_DESC
}

"""A connection to a list of \`Location\` values."""
type LocationsConnection {
  """A list of \`Location\` objects."""
  nodes: [Location]!

  """
  A list of edges which contains the \`Location\` and cursor to aid in pagination.
  """
  edges: [LocationsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Location\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Location\` edge in the connection."""
type LocationsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Location\` at the end of the edge."""
  node: Location
}

"""
A condition to be used against \`Location\` object types. All fields are tested
for equality and combined with a logical ‘and.’
"""
input LocationCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: UUID
}

"""Methods to use when ordering \`Location\`."""
enum LocationsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
}

"""A connection to a list of \`Photo\` values."""
type PhotosConnection {
  """A list of \`Photo\` objects."""
  nodes: [Photo]!

  """
  A list of edges which contains the \`Photo\` and cursor to aid in pagination.
  """
  edges: [PhotosEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Photo\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Photo\` edge in the connection."""
type PhotosEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Photo\` at the end of the edge."""
  node: Photo
}

"""
A condition to be used against \`Photo\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input PhotoCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: UUID
}

"""Methods to use when ordering \`Photo\`."""
enum PhotosOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
}

"""A connection to a list of \`Profile\` values."""
type ProfilesConnection {
  """A list of \`Profile\` objects."""
  nodes: [Profile]!

  """
  A list of edges which contains the \`Profile\` and cursor to aid in pagination.
  """
  edges: [ProfilesEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Profile\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Profile\` edge in the connection."""
type ProfilesEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Profile\` at the end of the edge."""
  node: Profile
}

"""
A condition to be used against \`Profile\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input ProfileCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: UUID
}

"""Methods to use when ordering \`Profile\`."""
enum ProfilesOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
}

"""A connection to a list of \`User\` values."""
type UsersConnection {
  """A list of \`User\` objects."""
  nodes: [User]!

  """
  A list of edges which contains the \`User\` and cursor to aid in pagination.
  """
  edges: [UsersEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`User\` you could get from the connection."""
  totalCount: Int!
}

"""A \`User\` edge in the connection."""
type UsersEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`User\` at the end of the edge."""
  node: User
}

"""
A condition to be used against \`User\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input UserCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`name\` field."""
  name: String
}

"""Methods to use when ordering \`User\`."""
enum UsersOrderBy {
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
  """Creates a single \`Location\`."""
  createLocation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateLocationInput!
  ): CreateLocationPayload

  """Creates a single \`Photo\`."""
  createPhoto(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreatePhotoInput!
  ): CreatePhotoPayload

  """Creates a single \`Profile\`."""
  createProfile(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateProfileInput!
  ): CreateProfilePayload

  """Creates a single \`User\`."""
  createUser(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateUserInput!
  ): CreateUserPayload

  """Creates a single \`Measurement\`."""
  createMeasurement(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateMeasurementInput!
  ): CreateMeasurementPayload

  """Creates a single \`LocationTag\`."""
  createLocationTag(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateLocationTagInput!
  ): CreateLocationTagPayload

  """Creates a single \`PhotoTag\`."""
  createPhotoTag(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreatePhotoTagInput!
  ): CreatePhotoTagPayload

  """Creates a single \`ProfileTag\`."""
  createProfileTag(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateProfileTagInput!
  ): CreateProfileTagPayload

  """Updates a single \`Location\` using its globally unique id and a patch."""
  updateLocation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateLocationInput!
  ): UpdateLocationPayload

  """Updates a single \`Location\` using a unique key and a patch."""
  updateLocationById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateLocationByIdInput!
  ): UpdateLocationPayload

  """Updates a single \`Photo\` using its globally unique id and a patch."""
  updatePhoto(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdatePhotoInput!
  ): UpdatePhotoPayload

  """Updates a single \`Photo\` using a unique key and a patch."""
  updatePhotoById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdatePhotoByIdInput!
  ): UpdatePhotoPayload

  """Updates a single \`Profile\` using its globally unique id and a patch."""
  updateProfile(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateProfileInput!
  ): UpdateProfilePayload

  """Updates a single \`Profile\` using a unique key and a patch."""
  updateProfileById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateProfileByIdInput!
  ): UpdateProfilePayload

  """Updates a single \`User\` using its globally unique id and a patch."""
  updateUser(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateUserInput!
  ): UpdateUserPayload

  """Updates a single \`User\` using a unique key and a patch."""
  updateUserById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateUserByIdInput!
  ): UpdateUserPayload

  """
  Updates a single \`Measurement\` using its globally unique id and a patch.
  """
  updateMeasurement(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateMeasurementInput!
  ): UpdateMeasurementPayload

  """Updates a single \`Measurement\` using a unique key and a patch."""
  updateMeasurementByTimestampAndKey(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateMeasurementByTimestampAndKeyInput!
  ): UpdateMeasurementPayload

  """
  Updates a single \`LocationTag\` using its globally unique id and a patch.
  """
  updateLocationTag(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateLocationTagInput!
  ): UpdateLocationTagPayload

  """Updates a single \`LocationTag\` using a unique key and a patch."""
  updateLocationTagByEntityKindAndEntityIdAndTag(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateLocationTagByEntityKindAndEntityIdAndTagInput!
  ): UpdateLocationTagPayload

  """Updates a single \`PhotoTag\` using its globally unique id and a patch."""
  updatePhotoTag(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdatePhotoTagInput!
  ): UpdatePhotoTagPayload

  """Updates a single \`PhotoTag\` using a unique key and a patch."""
  updatePhotoTagByEntityKindAndEntityIdAndTag(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdatePhotoTagByEntityKindAndEntityIdAndTagInput!
  ): UpdatePhotoTagPayload

  """
  Updates a single \`ProfileTag\` using its globally unique id and a patch.
  """
  updateProfileTag(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateProfileTagInput!
  ): UpdateProfileTagPayload

  """Updates a single \`ProfileTag\` using a unique key and a patch."""
  updateProfileTagByEntityKindAndEntityIdAndTag(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateProfileTagByEntityKindAndEntityIdAndTagInput!
  ): UpdateProfileTagPayload

  """Deletes a single \`Location\` using its globally unique id."""
  deleteLocation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteLocationInput!
  ): DeleteLocationPayload

  """Deletes a single \`Location\` using a unique key."""
  deleteLocationById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteLocationByIdInput!
  ): DeleteLocationPayload

  """Deletes a single \`Photo\` using its globally unique id."""
  deletePhoto(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeletePhotoInput!
  ): DeletePhotoPayload

  """Deletes a single \`Photo\` using a unique key."""
  deletePhotoById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeletePhotoByIdInput!
  ): DeletePhotoPayload

  """Deletes a single \`Profile\` using its globally unique id."""
  deleteProfile(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteProfileInput!
  ): DeleteProfilePayload

  """Deletes a single \`Profile\` using a unique key."""
  deleteProfileById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteProfileByIdInput!
  ): DeleteProfilePayload

  """Deletes a single \`User\` using its globally unique id."""
  deleteUser(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteUserInput!
  ): DeleteUserPayload

  """Deletes a single \`User\` using a unique key."""
  deleteUserById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteUserByIdInput!
  ): DeleteUserPayload

  """Deletes a single \`Measurement\` using its globally unique id."""
  deleteMeasurement(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteMeasurementInput!
  ): DeleteMeasurementPayload

  """Deletes a single \`Measurement\` using a unique key."""
  deleteMeasurementByTimestampAndKey(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteMeasurementByTimestampAndKeyInput!
  ): DeleteMeasurementPayload

  """Deletes a single \`LocationTag\` using its globally unique id."""
  deleteLocationTag(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteLocationTagInput!
  ): DeleteLocationTagPayload

  """Deletes a single \`LocationTag\` using a unique key."""
  deleteLocationTagByEntityKindAndEntityIdAndTag(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteLocationTagByEntityKindAndEntityIdAndTagInput!
  ): DeleteLocationTagPayload

  """Deletes a single \`PhotoTag\` using its globally unique id."""
  deletePhotoTag(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeletePhotoTagInput!
  ): DeletePhotoTagPayload

  """Deletes a single \`PhotoTag\` using a unique key."""
  deletePhotoTagByEntityKindAndEntityIdAndTag(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeletePhotoTagByEntityKindAndEntityIdAndTagInput!
  ): DeletePhotoTagPayload

  """Deletes a single \`ProfileTag\` using its globally unique id."""
  deleteProfileTag(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteProfileTagInput!
  ): DeleteProfileTagPayload

  """Deletes a single \`ProfileTag\` using a unique key."""
  deleteProfileTagByEntityKindAndEntityIdAndTag(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteProfileTagByEntityKindAndEntityIdAndTagInput!
  ): DeleteProfileTagPayload
}

"""The output of our create \`Location\` mutation."""
type CreateLocationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Location\` that was created by this mutation."""
  location: Location

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Location\`. May be used by Relay 1."""
  locationEdge(
    """The method to use when ordering \`Location\`."""
    orderBy: [LocationsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): LocationsEdge
}

"""All input for the create \`Location\` mutation."""
input CreateLocationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`Location\` to be created by this mutation."""
  location: LocationInput!
}

"""An input for mutations affecting \`Location\`"""
input LocationInput {
  id: UUID!
}

"""The output of our create \`Photo\` mutation."""
type CreatePhotoPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Photo\` that was created by this mutation."""
  photo: Photo

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Photo\`. May be used by Relay 1."""
  photoEdge(
    """The method to use when ordering \`Photo\`."""
    orderBy: [PhotosOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PhotosEdge
}

"""All input for the create \`Photo\` mutation."""
input CreatePhotoInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`Photo\` to be created by this mutation."""
  photo: PhotoInput!
}

"""An input for mutations affecting \`Photo\`"""
input PhotoInput {
  id: UUID!
}

"""The output of our create \`Profile\` mutation."""
type CreateProfilePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Profile\` that was created by this mutation."""
  profile: Profile

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Profile\`. May be used by Relay 1."""
  profileEdge(
    """The method to use when ordering \`Profile\`."""
    orderBy: [ProfilesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ProfilesEdge
}

"""All input for the create \`Profile\` mutation."""
input CreateProfileInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`Profile\` to be created by this mutation."""
  profile: ProfileInput!
}

"""An input for mutations affecting \`Profile\`"""
input ProfileInput {
  id: UUID!
}

"""The output of our create \`User\` mutation."""
type CreateUserPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`User\` that was created by this mutation."""
  user: User

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`User\`. May be used by Relay 1."""
  userEdge(
    """The method to use when ordering \`User\`."""
    orderBy: [UsersOrderBy!]! = [PRIMARY_KEY_ASC]
  ): UsersEdge
}

"""All input for the create \`User\` mutation."""
input CreateUserInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`User\` to be created by this mutation."""
  user: UserInput!
}

"""An input for mutations affecting \`User\`"""
input UserInput {
  id: Int
  name: String!
}

"""The output of our create \`Measurement\` mutation."""
type CreateMeasurementPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Measurement\` that was created by this mutation."""
  measurement: Measurement

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Measurement\`. May be used by Relay 1."""
  measurementEdge(
    """The method to use when ordering \`Measurement\`."""
    orderBy: [MeasurementsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): MeasurementsEdge

  """Reads a single \`User\` that is related to this \`Measurement\`."""
  userByUserId: User
}

"""All input for the create \`Measurement\` mutation."""
input CreateMeasurementInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`Measurement\` to be created by this mutation."""
  measurement: MeasurementInput!
}

"""An input for mutations affecting \`Measurement\`"""
input MeasurementInput {
  timestamp: Datetime!
  key: String!
  value: Float
  userId: Int!
}

"""The output of our create \`LocationTag\` mutation."""
type CreateLocationTagPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`LocationTag\` that was created by this mutation."""
  locationTag: LocationTag

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`LocationTag\`. May be used by Relay 1."""
  locationTagEdge(
    """The method to use when ordering \`LocationTag\`."""
    orderBy: [LocationTagsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): LocationTagsEdge

  """Reads a single \`Location\` that is related to this \`LocationTag\`."""
  locationByEntityId: Location
}

"""All input for the create \`LocationTag\` mutation."""
input CreateLocationTagInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`LocationTag\` to be created by this mutation."""
  locationTag: LocationTagInput!
}

"""An input for mutations affecting \`LocationTag\`"""
input LocationTagInput {
  entityKind: EntityKinds!
  entityId: UUID!
  tag: String!
}

"""The output of our create \`PhotoTag\` mutation."""
type CreatePhotoTagPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`PhotoTag\` that was created by this mutation."""
  photoTag: PhotoTag

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`PhotoTag\`. May be used by Relay 1."""
  photoTagEdge(
    """The method to use when ordering \`PhotoTag\`."""
    orderBy: [PhotoTagsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PhotoTagsEdge

  """Reads a single \`Photo\` that is related to this \`PhotoTag\`."""
  photoByEntityId: Photo
}

"""All input for the create \`PhotoTag\` mutation."""
input CreatePhotoTagInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`PhotoTag\` to be created by this mutation."""
  photoTag: PhotoTagInput!
}

"""An input for mutations affecting \`PhotoTag\`"""
input PhotoTagInput {
  entityKind: EntityKinds!
  entityId: UUID!
  tag: String!
}

"""The output of our create \`ProfileTag\` mutation."""
type CreateProfileTagPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`ProfileTag\` that was created by this mutation."""
  profileTag: ProfileTag

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`ProfileTag\`. May be used by Relay 1."""
  profileTagEdge(
    """The method to use when ordering \`ProfileTag\`."""
    orderBy: [ProfileTagsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ProfileTagsEdge

  """Reads a single \`Profile\` that is related to this \`ProfileTag\`."""
  profileByEntityId: Profile
}

"""All input for the create \`ProfileTag\` mutation."""
input CreateProfileTagInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`ProfileTag\` to be created by this mutation."""
  profileTag: ProfileTagInput!
}

"""An input for mutations affecting \`ProfileTag\`"""
input ProfileTagInput {
  entityKind: EntityKinds!
  entityId: UUID!
  tag: String!
}

"""The output of our update \`Location\` mutation."""
type UpdateLocationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Location\` that was updated by this mutation."""
  location: Location

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Location\`. May be used by Relay 1."""
  locationEdge(
    """The method to use when ordering \`Location\`."""
    orderBy: [LocationsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): LocationsEdge
}

"""All input for the \`updateLocation\` mutation."""
input UpdateLocationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Location\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`Location\` being updated.
  """
  locationPatch: LocationPatch!
}

"""
Represents an update to a \`Location\`. Fields that are set will be updated.
"""
input LocationPatch {
  id: UUID
}

"""All input for the \`updateLocationById\` mutation."""
input UpdateLocationByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: UUID!

  """
  An object where the defined keys will be set on the \`Location\` being updated.
  """
  locationPatch: LocationPatch!
}

"""The output of our update \`Photo\` mutation."""
type UpdatePhotoPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Photo\` that was updated by this mutation."""
  photo: Photo

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Photo\`. May be used by Relay 1."""
  photoEdge(
    """The method to use when ordering \`Photo\`."""
    orderBy: [PhotosOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PhotosEdge
}

"""All input for the \`updatePhoto\` mutation."""
input UpdatePhotoInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Photo\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`Photo\` being updated.
  """
  photoPatch: PhotoPatch!
}

"""
Represents an update to a \`Photo\`. Fields that are set will be updated.
"""
input PhotoPatch {
  id: UUID
}

"""All input for the \`updatePhotoById\` mutation."""
input UpdatePhotoByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: UUID!

  """
  An object where the defined keys will be set on the \`Photo\` being updated.
  """
  photoPatch: PhotoPatch!
}

"""The output of our update \`Profile\` mutation."""
type UpdateProfilePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Profile\` that was updated by this mutation."""
  profile: Profile

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Profile\`. May be used by Relay 1."""
  profileEdge(
    """The method to use when ordering \`Profile\`."""
    orderBy: [ProfilesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ProfilesEdge
}

"""All input for the \`updateProfile\` mutation."""
input UpdateProfileInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Profile\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`Profile\` being updated.
  """
  profilePatch: ProfilePatch!
}

"""
Represents an update to a \`Profile\`. Fields that are set will be updated.
"""
input ProfilePatch {
  id: UUID
}

"""All input for the \`updateProfileById\` mutation."""
input UpdateProfileByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: UUID!

  """
  An object where the defined keys will be set on the \`Profile\` being updated.
  """
  profilePatch: ProfilePatch!
}

"""The output of our update \`User\` mutation."""
type UpdateUserPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`User\` that was updated by this mutation."""
  user: User

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`User\`. May be used by Relay 1."""
  userEdge(
    """The method to use when ordering \`User\`."""
    orderBy: [UsersOrderBy!]! = [PRIMARY_KEY_ASC]
  ): UsersEdge
}

"""All input for the \`updateUser\` mutation."""
input UpdateUserInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`User\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`User\` being updated.
  """
  userPatch: UserPatch!
}

"""Represents an update to a \`User\`. Fields that are set will be updated."""
input UserPatch {
  id: Int
  name: String
}

"""All input for the \`updateUserById\` mutation."""
input UpdateUserByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`User\` being updated.
  """
  userPatch: UserPatch!
}

"""The output of our update \`Measurement\` mutation."""
type UpdateMeasurementPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Measurement\` that was updated by this mutation."""
  measurement: Measurement

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Measurement\`. May be used by Relay 1."""
  measurementEdge(
    """The method to use when ordering \`Measurement\`."""
    orderBy: [MeasurementsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): MeasurementsEdge

  """Reads a single \`User\` that is related to this \`Measurement\`."""
  userByUserId: User
}

"""All input for the \`updateMeasurement\` mutation."""
input UpdateMeasurementInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Measurement\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`Measurement\` being updated.
  """
  measurementPatch: MeasurementPatch!
}

"""
Represents an update to a \`Measurement\`. Fields that are set will be updated.
"""
input MeasurementPatch {
  timestamp: Datetime
  key: String
  value: Float
  userId: Int
}

"""All input for the \`updateMeasurementByTimestampAndKey\` mutation."""
input UpdateMeasurementByTimestampAndKeyInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  timestamp: Datetime!
  key: String!

  """
  An object where the defined keys will be set on the \`Measurement\` being updated.
  """
  measurementPatch: MeasurementPatch!
}

"""The output of our update \`LocationTag\` mutation."""
type UpdateLocationTagPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`LocationTag\` that was updated by this mutation."""
  locationTag: LocationTag

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`LocationTag\`. May be used by Relay 1."""
  locationTagEdge(
    """The method to use when ordering \`LocationTag\`."""
    orderBy: [LocationTagsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): LocationTagsEdge

  """Reads a single \`Location\` that is related to this \`LocationTag\`."""
  locationByEntityId: Location
}

"""All input for the \`updateLocationTag\` mutation."""
input UpdateLocationTagInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`LocationTag\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`LocationTag\` being updated.
  """
  locationTagPatch: LocationTagPatch!
}

"""
Represents an update to a \`LocationTag\`. Fields that are set will be updated.
"""
input LocationTagPatch {
  entityKind: EntityKinds
  entityId: UUID
  tag: String
}

"""
All input for the \`updateLocationTagByEntityKindAndEntityIdAndTag\` mutation.
"""
input UpdateLocationTagByEntityKindAndEntityIdAndTagInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  entityKind: EntityKinds!
  entityId: UUID!
  tag: String!

  """
  An object where the defined keys will be set on the \`LocationTag\` being updated.
  """
  locationTagPatch: LocationTagPatch!
}

"""The output of our update \`PhotoTag\` mutation."""
type UpdatePhotoTagPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`PhotoTag\` that was updated by this mutation."""
  photoTag: PhotoTag

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`PhotoTag\`. May be used by Relay 1."""
  photoTagEdge(
    """The method to use when ordering \`PhotoTag\`."""
    orderBy: [PhotoTagsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PhotoTagsEdge

  """Reads a single \`Photo\` that is related to this \`PhotoTag\`."""
  photoByEntityId: Photo
}

"""All input for the \`updatePhotoTag\` mutation."""
input UpdatePhotoTagInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`PhotoTag\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`PhotoTag\` being updated.
  """
  photoTagPatch: PhotoTagPatch!
}

"""
Represents an update to a \`PhotoTag\`. Fields that are set will be updated.
"""
input PhotoTagPatch {
  entityKind: EntityKinds
  entityId: UUID
  tag: String
}

"""
All input for the \`updatePhotoTagByEntityKindAndEntityIdAndTag\` mutation.
"""
input UpdatePhotoTagByEntityKindAndEntityIdAndTagInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  entityKind: EntityKinds!
  entityId: UUID!
  tag: String!

  """
  An object where the defined keys will be set on the \`PhotoTag\` being updated.
  """
  photoTagPatch: PhotoTagPatch!
}

"""The output of our update \`ProfileTag\` mutation."""
type UpdateProfileTagPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`ProfileTag\` that was updated by this mutation."""
  profileTag: ProfileTag

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`ProfileTag\`. May be used by Relay 1."""
  profileTagEdge(
    """The method to use when ordering \`ProfileTag\`."""
    orderBy: [ProfileTagsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ProfileTagsEdge

  """Reads a single \`Profile\` that is related to this \`ProfileTag\`."""
  profileByEntityId: Profile
}

"""All input for the \`updateProfileTag\` mutation."""
input UpdateProfileTagInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`ProfileTag\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`ProfileTag\` being updated.
  """
  profileTagPatch: ProfileTagPatch!
}

"""
Represents an update to a \`ProfileTag\`. Fields that are set will be updated.
"""
input ProfileTagPatch {
  entityKind: EntityKinds
  entityId: UUID
  tag: String
}

"""
All input for the \`updateProfileTagByEntityKindAndEntityIdAndTag\` mutation.
"""
input UpdateProfileTagByEntityKindAndEntityIdAndTagInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  entityKind: EntityKinds!
  entityId: UUID!
  tag: String!

  """
  An object where the defined keys will be set on the \`ProfileTag\` being updated.
  """
  profileTagPatch: ProfileTagPatch!
}

"""The output of our delete \`Location\` mutation."""
type DeleteLocationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Location\` that was deleted by this mutation."""
  location: Location
  deletedLocationId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Location\`. May be used by Relay 1."""
  locationEdge(
    """The method to use when ordering \`Location\`."""
    orderBy: [LocationsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): LocationsEdge
}

"""All input for the \`deleteLocation\` mutation."""
input DeleteLocationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Location\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteLocationById\` mutation."""
input DeleteLocationByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: UUID!
}

"""The output of our delete \`Photo\` mutation."""
type DeletePhotoPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Photo\` that was deleted by this mutation."""
  photo: Photo
  deletedPhotoId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Photo\`. May be used by Relay 1."""
  photoEdge(
    """The method to use when ordering \`Photo\`."""
    orderBy: [PhotosOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PhotosEdge
}

"""All input for the \`deletePhoto\` mutation."""
input DeletePhotoInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Photo\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deletePhotoById\` mutation."""
input DeletePhotoByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: UUID!
}

"""The output of our delete \`Profile\` mutation."""
type DeleteProfilePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Profile\` that was deleted by this mutation."""
  profile: Profile
  deletedProfileId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Profile\`. May be used by Relay 1."""
  profileEdge(
    """The method to use when ordering \`Profile\`."""
    orderBy: [ProfilesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ProfilesEdge
}

"""All input for the \`deleteProfile\` mutation."""
input DeleteProfileInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Profile\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteProfileById\` mutation."""
input DeleteProfileByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: UUID!
}

"""The output of our delete \`User\` mutation."""
type DeleteUserPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`User\` that was deleted by this mutation."""
  user: User
  deletedUserId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`User\`. May be used by Relay 1."""
  userEdge(
    """The method to use when ordering \`User\`."""
    orderBy: [UsersOrderBy!]! = [PRIMARY_KEY_ASC]
  ): UsersEdge
}

"""All input for the \`deleteUser\` mutation."""
input DeleteUserInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`User\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteUserById\` mutation."""
input DeleteUserByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!
}

"""The output of our delete \`Measurement\` mutation."""
type DeleteMeasurementPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Measurement\` that was deleted by this mutation."""
  measurement: Measurement
  deletedMeasurementId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Measurement\`. May be used by Relay 1."""
  measurementEdge(
    """The method to use when ordering \`Measurement\`."""
    orderBy: [MeasurementsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): MeasurementsEdge

  """Reads a single \`User\` that is related to this \`Measurement\`."""
  userByUserId: User
}

"""All input for the \`deleteMeasurement\` mutation."""
input DeleteMeasurementInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Measurement\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteMeasurementByTimestampAndKey\` mutation."""
input DeleteMeasurementByTimestampAndKeyInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  timestamp: Datetime!
  key: String!
}

"""The output of our delete \`LocationTag\` mutation."""
type DeleteLocationTagPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`LocationTag\` that was deleted by this mutation."""
  locationTag: LocationTag
  deletedLocationTagId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`LocationTag\`. May be used by Relay 1."""
  locationTagEdge(
    """The method to use when ordering \`LocationTag\`."""
    orderBy: [LocationTagsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): LocationTagsEdge

  """Reads a single \`Location\` that is related to this \`LocationTag\`."""
  locationByEntityId: Location
}

"""All input for the \`deleteLocationTag\` mutation."""
input DeleteLocationTagInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`LocationTag\` to be deleted.
  """
  nodeId: ID!
}

"""
All input for the \`deleteLocationTagByEntityKindAndEntityIdAndTag\` mutation.
"""
input DeleteLocationTagByEntityKindAndEntityIdAndTagInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  entityKind: EntityKinds!
  entityId: UUID!
  tag: String!
}

"""The output of our delete \`PhotoTag\` mutation."""
type DeletePhotoTagPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`PhotoTag\` that was deleted by this mutation."""
  photoTag: PhotoTag
  deletedPhotoTagId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`PhotoTag\`. May be used by Relay 1."""
  photoTagEdge(
    """The method to use when ordering \`PhotoTag\`."""
    orderBy: [PhotoTagsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PhotoTagsEdge

  """Reads a single \`Photo\` that is related to this \`PhotoTag\`."""
  photoByEntityId: Photo
}

"""All input for the \`deletePhotoTag\` mutation."""
input DeletePhotoTagInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`PhotoTag\` to be deleted.
  """
  nodeId: ID!
}

"""
All input for the \`deletePhotoTagByEntityKindAndEntityIdAndTag\` mutation.
"""
input DeletePhotoTagByEntityKindAndEntityIdAndTagInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  entityKind: EntityKinds!
  entityId: UUID!
  tag: String!
}

"""The output of our delete \`ProfileTag\` mutation."""
type DeleteProfileTagPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`ProfileTag\` that was deleted by this mutation."""
  profileTag: ProfileTag
  deletedProfileTagId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`ProfileTag\`. May be used by Relay 1."""
  profileTagEdge(
    """The method to use when ordering \`ProfileTag\`."""
    orderBy: [ProfileTagsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ProfileTagsEdge

  """Reads a single \`Profile\` that is related to this \`ProfileTag\`."""
  profileByEntityId: Profile
}

"""All input for the \`deleteProfileTag\` mutation."""
input DeleteProfileTagInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`ProfileTag\` to be deleted.
  """
  nodeId: ID!
}

"""
All input for the \`deleteProfileTagByEntityKindAndEntityIdAndTag\` mutation.
"""
input DeleteProfileTagByEntityKindAndEntityIdAndTagInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  entityKind: EntityKinds!
  entityId: UUID!
  tag: String!
}`;
export const objects = {
  Query: {
    assertStep() {
      return true;
    },
    plans: {
      allLocations: {
        plan() {
          return connection(resource_locationsPgResource.find());
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
      allLocationTags: {
        plan() {
          return connection(resource_location_tagsPgResource.find());
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
      allMeasurements: {
        plan() {
          return connection(resource_measurementsPgResource.find());
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
      allPhotos: {
        plan() {
          return connection(resource_photosPgResource.find());
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
      allPhotoTags: {
        plan() {
          return connection(resource_photo_tagsPgResource.find());
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
      allProfiles: {
        plan() {
          return connection(resource_profilesPgResource.find());
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
      allProfileTags: {
        plan() {
          return connection(resource_profile_tagsPgResource.find());
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
      allUsers: {
        plan() {
          return connection(resource_usersPgResource.find());
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
      location(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_Location($nodeId);
      },
      locationById(_$root, {
        $id
      }) {
        return resource_locationsPgResource.get({
          id: $id
        });
      },
      locationTag(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_LocationTag($nodeId);
      },
      locationTagByEntityKindAndEntityIdAndTag(_$root, {
        $entityKind,
        $entityId,
        $tag
      }) {
        return resource_location_tagsPgResource.get({
          entity_kind: $entityKind,
          entity_id: $entityId,
          tag: $tag
        });
      },
      measurement(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_Measurement($nodeId);
      },
      measurementByTimestampAndKey(_$root, {
        $timestamp,
        $key
      }) {
        return resource_measurementsPgResource.get({
          timestamp: $timestamp,
          key: $key
        });
      },
      node(_$root, fieldArgs) {
        return fieldArgs.getRaw("nodeId");
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_Query.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Query.codec.name].encode);
      },
      photo(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_Photo($nodeId);
      },
      photoById(_$root, {
        $id
      }) {
        return resource_photosPgResource.get({
          id: $id
        });
      },
      photoTag(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_PhotoTag($nodeId);
      },
      photoTagByEntityKindAndEntityIdAndTag(_$root, {
        $entityKind,
        $entityId,
        $tag
      }) {
        return resource_photo_tagsPgResource.get({
          entity_kind: $entityKind,
          entity_id: $entityId,
          tag: $tag
        });
      },
      profile(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_Profile($nodeId);
      },
      profileById(_$root, {
        $id
      }) {
        return resource_profilesPgResource.get({
          id: $id
        });
      },
      profileTag(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_ProfileTag($nodeId);
      },
      profileTagByEntityKindAndEntityIdAndTag(_$root, {
        $entityKind,
        $entityId,
        $tag
      }) {
        return resource_profile_tagsPgResource.get({
          entity_kind: $entityKind,
          entity_id: $entityId,
          tag: $tag
        });
      },
      query() {
        return rootValue();
      },
      user(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_User($nodeId);
      },
      userById(_$root, {
        $id
      }) {
        return resource_usersPgResource.get({
          id: $id
        });
      }
    }
  },
  Mutation: {
    assertStep: __ValueStep,
    plans: {
      createLocation: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_locationsPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createLocationTag: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_location_tagsPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createMeasurement: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_measurementsPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createPhoto: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_photosPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createPhotoTag: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_photo_tagsPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createProfile: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_profilesPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createProfileTag: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_profile_tagsPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createUser: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_usersPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      deleteLocation: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_locationsPgResource, specFromArgs_Location2(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteLocationById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_locationsPgResource, {
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
      deleteLocationTag: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_location_tagsPgResource, specFromArgs_LocationTag2(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteLocationTagByEntityKindAndEntityIdAndTag: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_location_tagsPgResource, {
            entity_kind: args.getRaw(['input', "entityKind"]),
            entity_id: args.getRaw(['input', "entityId"]),
            tag: args.getRaw(['input', "tag"])
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
      deleteMeasurement: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_measurementsPgResource, specFromArgs_Measurement2(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteMeasurementByTimestampAndKey: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_measurementsPgResource, {
            timestamp: args.getRaw(['input', "timestamp"]),
            key: args.getRaw(['input', "key"])
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
      deletePhoto: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_photosPgResource, specFromArgs_Photo2(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deletePhotoById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_photosPgResource, {
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
      deletePhotoTag: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_photo_tagsPgResource, specFromArgs_PhotoTag2(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deletePhotoTagByEntityKindAndEntityIdAndTag: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_photo_tagsPgResource, {
            entity_kind: args.getRaw(['input', "entityKind"]),
            entity_id: args.getRaw(['input', "entityId"]),
            tag: args.getRaw(['input', "tag"])
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
      deleteProfile: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_profilesPgResource, specFromArgs_Profile2(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteProfileById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_profilesPgResource, {
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
      deleteProfileTag: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_profile_tagsPgResource, specFromArgs_ProfileTag2(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteProfileTagByEntityKindAndEntityIdAndTag: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_profile_tagsPgResource, {
            entity_kind: args.getRaw(['input', "entityKind"]),
            entity_id: args.getRaw(['input', "entityId"]),
            tag: args.getRaw(['input', "tag"])
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
      deleteUser: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_usersPgResource, specFromArgs_User2(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteUserById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_usersPgResource, {
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
      updateLocation: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_locationsPgResource, specFromArgs_Location(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateLocationById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_locationsPgResource, {
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
      updateLocationTag: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_location_tagsPgResource, specFromArgs_LocationTag(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateLocationTagByEntityKindAndEntityIdAndTag: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_location_tagsPgResource, {
            entity_kind: args.getRaw(['input', "entityKind"]),
            entity_id: args.getRaw(['input', "entityId"]),
            tag: args.getRaw(['input', "tag"])
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
      updateMeasurement: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_measurementsPgResource, specFromArgs_Measurement(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateMeasurementByTimestampAndKey: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_measurementsPgResource, {
            timestamp: args.getRaw(['input', "timestamp"]),
            key: args.getRaw(['input', "key"])
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
      updatePhoto: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_photosPgResource, specFromArgs_Photo(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updatePhotoById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_photosPgResource, {
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
      updatePhotoTag: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_photo_tagsPgResource, specFromArgs_PhotoTag(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updatePhotoTagByEntityKindAndEntityIdAndTag: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_photo_tagsPgResource, {
            entity_kind: args.getRaw(['input', "entityKind"]),
            entity_id: args.getRaw(['input', "entityId"]),
            tag: args.getRaw(['input', "tag"])
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
      updateProfile: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_profilesPgResource, specFromArgs_Profile(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateProfileById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_profilesPgResource, {
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
      updateProfileTag: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_profile_tagsPgResource, specFromArgs_ProfileTag(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateProfileTagByEntityKindAndEntityIdAndTag: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_profile_tagsPgResource, {
            entity_kind: args.getRaw(['input', "entityKind"]),
            entity_id: args.getRaw(['input', "entityId"]),
            tag: args.getRaw(['input', "tag"])
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
      updateUser: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_usersPgResource, specFromArgs_User(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateUserById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_usersPgResource, {
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
  CreateLocationPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      location: planCreatePayloadResult,
      locationEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_locationsPgResource, locationsUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  CreateLocationTagPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      locationByEntityId($record) {
        return resource_locationsPgResource.get({
          id: $record.get("result").get("entity_id")
        });
      },
      locationTag: planCreatePayloadResult,
      locationTagEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_location_tagsPgResource, location_tagsUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  CreateMeasurementPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      measurement: planCreatePayloadResult,
      measurementEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_measurementsPgResource, measurementsUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan,
      userByUserId($record) {
        return resource_usersPgResource.get({
          id: $record.get("result").get("user_id")
        });
      }
    }
  },
  CreatePhotoPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      photo: planCreatePayloadResult,
      photoEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_photosPgResource, photosUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  CreatePhotoTagPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      photoByEntityId($record) {
        return resource_photosPgResource.get({
          id: $record.get("result").get("entity_id")
        });
      },
      photoTag: planCreatePayloadResult,
      photoTagEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_photo_tagsPgResource, photo_tagsUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  CreateProfilePayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      profile: planCreatePayloadResult,
      profileEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_profilesPgResource, profilesUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  CreateProfileTagPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      profileByEntityId($record) {
        return resource_profilesPgResource.get({
          id: $record.get("result").get("entity_id")
        });
      },
      profileTag: planCreatePayloadResult,
      profileTagEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_profile_tagsPgResource, profile_tagsUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  CreateUserPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan,
      user: planCreatePayloadResult,
      userEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_usersPgResource, usersUniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  DeleteLocationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedLocationId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Location.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      location: planUpdateOrDeletePayloadResult,
      locationEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_locationsPgResource, locationsUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  DeleteLocationTagPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedLocationTagId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_LocationTag.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      locationByEntityId($record) {
        return resource_locationsPgResource.get({
          id: $record.get("result").get("entity_id")
        });
      },
      locationTag: planUpdateOrDeletePayloadResult,
      locationTagEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_location_tagsPgResource, location_tagsUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  DeleteMeasurementPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedMeasurementId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Measurement.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      measurement: planUpdateOrDeletePayloadResult,
      measurementEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_measurementsPgResource, measurementsUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan,
      userByUserId($record) {
        return resource_usersPgResource.get({
          id: $record.get("result").get("user_id")
        });
      }
    }
  },
  DeletePhotoPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedPhotoId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Photo.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      photo: planUpdateOrDeletePayloadResult,
      photoEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_photosPgResource, photosUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  DeletePhotoTagPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedPhotoTagId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_PhotoTag.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      photoByEntityId($record) {
        return resource_photosPgResource.get({
          id: $record.get("result").get("entity_id")
        });
      },
      photoTag: planUpdateOrDeletePayloadResult,
      photoTagEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_photo_tagsPgResource, photo_tagsUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  DeleteProfilePayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedProfileId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Profile.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      profile: planUpdateOrDeletePayloadResult,
      profileEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_profilesPgResource, profilesUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  DeleteProfileTagPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedProfileTagId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_ProfileTag.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      profileByEntityId($record) {
        return resource_profilesPgResource.get({
          id: $record.get("result").get("entity_id")
        });
      },
      profileTag: planUpdateOrDeletePayloadResult,
      profileTagEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_profile_tagsPgResource, profile_tagsUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  DeleteUserPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedUserId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_User.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      query: queryPlan,
      user: planUpdateOrDeletePayloadResult,
      userEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_usersPgResource, usersUniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  Location: {
    assertStep: assertPgClassSingleStep,
    plans: {
      locationTagsByEntityId: {
        plan($record) {
          const $records = resource_location_tagsPgResource.find({
            entity_id: $record.get("id")
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
        const specifier = nodeIdHandler_Location.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Location.codec.name].encode);
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of locationsUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_locationsPgResource.get(spec);
    }
  },
  LocationsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  LocationTag: {
    assertStep: assertPgClassSingleStep,
    plans: {
      entityId($record) {
        return $record.get("entity_id");
      },
      entityKind($record) {
        return $record.get("entity_kind");
      },
      locationByEntityId($record) {
        return resource_locationsPgResource.get({
          id: $record.get("entity_id")
        });
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_LocationTag.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_LocationTag.codec.name].encode);
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of location_tagsUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_location_tagsPgResource.get(spec);
    }
  },
  LocationTagsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  Measurement: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nodeId($parent) {
        const specifier = nodeIdHandler_Measurement.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Measurement.codec.name].encode);
      },
      userByUserId($record) {
        return resource_usersPgResource.get({
          id: $record.get("user_id")
        });
      },
      userId($record) {
        return $record.get("user_id");
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of measurementsUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_measurementsPgResource.get(spec);
    }
  },
  MeasurementsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  Photo: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nodeId($parent) {
        const specifier = nodeIdHandler_Photo.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Photo.codec.name].encode);
      },
      photoTagsByEntityId: {
        plan($record) {
          const $records = resource_photo_tagsPgResource.find({
            entity_id: $record.get("id")
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
      for (const pkCol of photosUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_photosPgResource.get(spec);
    }
  },
  PhotosConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  PhotoTag: {
    assertStep: assertPgClassSingleStep,
    plans: {
      entityId($record) {
        return $record.get("entity_id");
      },
      entityKind($record) {
        return $record.get("entity_kind");
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_PhotoTag.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_PhotoTag.codec.name].encode);
      },
      photoByEntityId($record) {
        return resource_photosPgResource.get({
          id: $record.get("entity_id")
        });
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of photo_tagsUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_photo_tagsPgResource.get(spec);
    }
  },
  PhotoTagsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  Profile: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nodeId($parent) {
        const specifier = nodeIdHandler_Profile.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Profile.codec.name].encode);
      },
      profileTagsByEntityId: {
        plan($record) {
          const $records = resource_profile_tagsPgResource.find({
            entity_id: $record.get("id")
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
      for (const pkCol of profilesUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_profilesPgResource.get(spec);
    }
  },
  ProfilesConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  ProfileTag: {
    assertStep: assertPgClassSingleStep,
    plans: {
      entityId($record) {
        return $record.get("entity_id");
      },
      entityKind($record) {
        return $record.get("entity_kind");
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_ProfileTag.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_ProfileTag.codec.name].encode);
      },
      profileByEntityId($record) {
        return resource_profilesPgResource.get({
          id: $record.get("entity_id")
        });
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of profile_tagsUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_profile_tagsPgResource.get(spec);
    }
  },
  ProfileTagsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  UpdateLocationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      location: planUpdateOrDeletePayloadResult,
      locationEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_locationsPgResource, locationsUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  UpdateLocationTagPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      locationByEntityId($record) {
        return resource_locationsPgResource.get({
          id: $record.get("result").get("entity_id")
        });
      },
      locationTag: planUpdateOrDeletePayloadResult,
      locationTagEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_location_tagsPgResource, location_tagsUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  UpdateMeasurementPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      measurement: planUpdateOrDeletePayloadResult,
      measurementEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_measurementsPgResource, measurementsUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan,
      userByUserId($record) {
        return resource_usersPgResource.get({
          id: $record.get("result").get("user_id")
        });
      }
    }
  },
  UpdatePhotoPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      photo: planUpdateOrDeletePayloadResult,
      photoEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_photosPgResource, photosUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  UpdatePhotoTagPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      photoByEntityId($record) {
        return resource_photosPgResource.get({
          id: $record.get("result").get("entity_id")
        });
      },
      photoTag: planUpdateOrDeletePayloadResult,
      photoTagEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_photo_tagsPgResource, photo_tagsUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  UpdateProfilePayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      profile: planUpdateOrDeletePayloadResult,
      profileEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_profilesPgResource, profilesUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  UpdateProfileTagPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      profileByEntityId($record) {
        return resource_profilesPgResource.get({
          id: $record.get("result").get("entity_id")
        });
      },
      profileTag: planUpdateOrDeletePayloadResult,
      profileTagEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_profile_tagsPgResource, profile_tagsUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  UpdateUserPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan,
      user: planUpdateOrDeletePayloadResult,
      userEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_usersPgResource, usersUniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  User: {
    assertStep: assertPgClassSingleStep,
    plans: {
      measurementsByUserId: {
        plan($record) {
          const $records = resource_measurementsPgResource.find({
            user_id: $record.get("id")
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
        const specifier = nodeIdHandler_User.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_User.codec.name].encode);
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of usersUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_usersPgResource.get(spec);
    }
  },
  UsersConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
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
  CreateLocationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      location: applyCreateFields
    }
  },
  CreateLocationTagInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      locationTag: applyCreateFields
    }
  },
  CreateMeasurementInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      measurement: applyCreateFields
    }
  },
  CreatePhotoInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      photo: applyCreateFields
    }
  },
  CreatePhotoTagInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      photoTag: applyCreateFields
    }
  },
  CreateProfileInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      profile: applyCreateFields
    }
  },
  CreateProfileTagInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      profileTag: applyCreateFields
    }
  },
  CreateUserInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      user: applyCreateFields
    }
  },
  DeleteLocationByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteLocationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteLocationTagByEntityKindAndEntityIdAndTagInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteLocationTagInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteMeasurementByTimestampAndKeyInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteMeasurementInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeletePhotoByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeletePhotoInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeletePhotoTagByEntityKindAndEntityIdAndTagInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeletePhotoTagInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteProfileByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteProfileInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteProfileTagByEntityKindAndEntityIdAndTagInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteProfileTagInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteUserByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteUserInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  LocationCondition: {
    plans: {
      id($condition, val) {
        return applyAttributeCondition("id", TYPES.uuid, $condition, val);
      }
    }
  },
  LocationInput: {
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
  LocationPatch: {
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
  LocationTagCondition: {
    plans: {
      entityId($condition, val) {
        return applyAttributeCondition("entity_id", TYPES.uuid, $condition, val);
      },
      entityKind($condition, val) {
        return applyAttributeCondition("entity_kind", spec_locationTags_attributes_entity_kind_codec_EntityKindsEnum, $condition, val);
      },
      tag($condition, val) {
        return applyAttributeCondition("tag", TYPES.citext, $condition, val);
      }
    }
  },
  LocationTagInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      entityId(obj, val, {
        field,
        schema
      }) {
        obj.set("entity_id", bakedInputRuntime(schema, field.type, val));
      },
      entityKind(obj, val, {
        field,
        schema
      }) {
        obj.set("entity_kind", bakedInputRuntime(schema, field.type, val));
      },
      tag(obj, val, {
        field,
        schema
      }) {
        obj.set("tag", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  LocationTagPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      entityId(obj, val, {
        field,
        schema
      }) {
        obj.set("entity_id", bakedInputRuntime(schema, field.type, val));
      },
      entityKind(obj, val, {
        field,
        schema
      }) {
        obj.set("entity_kind", bakedInputRuntime(schema, field.type, val));
      },
      tag(obj, val, {
        field,
        schema
      }) {
        obj.set("tag", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  MeasurementCondition: {
    plans: {
      key($condition, val) {
        return applyAttributeCondition("key", TYPES.text, $condition, val);
      },
      timestamp($condition, val) {
        return applyAttributeCondition("timestamp", TYPES.timestamptz, $condition, val);
      },
      userId($condition, val) {
        return applyAttributeCondition("user_id", TYPES.int, $condition, val);
      },
      value($condition, val) {
        return applyAttributeCondition("value", TYPES.float, $condition, val);
      }
    }
  },
  MeasurementInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      key(obj, val, {
        field,
        schema
      }) {
        obj.set("key", bakedInputRuntime(schema, field.type, val));
      },
      timestamp(obj, val, {
        field,
        schema
      }) {
        obj.set("timestamp", bakedInputRuntime(schema, field.type, val));
      },
      userId(obj, val, {
        field,
        schema
      }) {
        obj.set("user_id", bakedInputRuntime(schema, field.type, val));
      },
      value(obj, val, {
        field,
        schema
      }) {
        obj.set("value", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  MeasurementPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      key(obj, val, {
        field,
        schema
      }) {
        obj.set("key", bakedInputRuntime(schema, field.type, val));
      },
      timestamp(obj, val, {
        field,
        schema
      }) {
        obj.set("timestamp", bakedInputRuntime(schema, field.type, val));
      },
      userId(obj, val, {
        field,
        schema
      }) {
        obj.set("user_id", bakedInputRuntime(schema, field.type, val));
      },
      value(obj, val, {
        field,
        schema
      }) {
        obj.set("value", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  PhotoCondition: {
    plans: {
      id($condition, val) {
        return applyAttributeCondition("id", TYPES.uuid, $condition, val);
      }
    }
  },
  PhotoInput: {
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
  PhotoPatch: {
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
  PhotoTagCondition: {
    plans: {
      entityId($condition, val) {
        return applyAttributeCondition("entity_id", TYPES.uuid, $condition, val);
      },
      entityKind($condition, val) {
        return applyAttributeCondition("entity_kind", spec_locationTags_attributes_entity_kind_codec_EntityKindsEnum, $condition, val);
      },
      tag($condition, val) {
        return applyAttributeCondition("tag", TYPES.citext, $condition, val);
      }
    }
  },
  PhotoTagInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      entityId(obj, val, {
        field,
        schema
      }) {
        obj.set("entity_id", bakedInputRuntime(schema, field.type, val));
      },
      entityKind(obj, val, {
        field,
        schema
      }) {
        obj.set("entity_kind", bakedInputRuntime(schema, field.type, val));
      },
      tag(obj, val, {
        field,
        schema
      }) {
        obj.set("tag", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  PhotoTagPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      entityId(obj, val, {
        field,
        schema
      }) {
        obj.set("entity_id", bakedInputRuntime(schema, field.type, val));
      },
      entityKind(obj, val, {
        field,
        schema
      }) {
        obj.set("entity_kind", bakedInputRuntime(schema, field.type, val));
      },
      tag(obj, val, {
        field,
        schema
      }) {
        obj.set("tag", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  ProfileCondition: {
    plans: {
      id($condition, val) {
        return applyAttributeCondition("id", TYPES.uuid, $condition, val);
      }
    }
  },
  ProfileInput: {
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
  ProfilePatch: {
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
  ProfileTagCondition: {
    plans: {
      entityId($condition, val) {
        return applyAttributeCondition("entity_id", TYPES.uuid, $condition, val);
      },
      entityKind($condition, val) {
        return applyAttributeCondition("entity_kind", spec_locationTags_attributes_entity_kind_codec_EntityKindsEnum, $condition, val);
      },
      tag($condition, val) {
        return applyAttributeCondition("tag", TYPES.citext, $condition, val);
      }
    }
  },
  ProfileTagInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      entityId(obj, val, {
        field,
        schema
      }) {
        obj.set("entity_id", bakedInputRuntime(schema, field.type, val));
      },
      entityKind(obj, val, {
        field,
        schema
      }) {
        obj.set("entity_kind", bakedInputRuntime(schema, field.type, val));
      },
      tag(obj, val, {
        field,
        schema
      }) {
        obj.set("tag", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  ProfileTagPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      entityId(obj, val, {
        field,
        schema
      }) {
        obj.set("entity_id", bakedInputRuntime(schema, field.type, val));
      },
      entityKind(obj, val, {
        field,
        schema
      }) {
        obj.set("entity_kind", bakedInputRuntime(schema, field.type, val));
      },
      tag(obj, val, {
        field,
        schema
      }) {
        obj.set("tag", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  UpdateLocationByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      locationPatch: applyPatchFields
    }
  },
  UpdateLocationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      locationPatch: applyPatchFields
    }
  },
  UpdateLocationTagByEntityKindAndEntityIdAndTagInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      locationTagPatch: applyPatchFields
    }
  },
  UpdateLocationTagInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      locationTagPatch: applyPatchFields
    }
  },
  UpdateMeasurementByTimestampAndKeyInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      measurementPatch: applyPatchFields
    }
  },
  UpdateMeasurementInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      measurementPatch: applyPatchFields
    }
  },
  UpdatePhotoByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      photoPatch: applyPatchFields
    }
  },
  UpdatePhotoInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      photoPatch: applyPatchFields
    }
  },
  UpdatePhotoTagByEntityKindAndEntityIdAndTagInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      photoTagPatch: applyPatchFields
    }
  },
  UpdatePhotoTagInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      photoTagPatch: applyPatchFields
    }
  },
  UpdateProfileByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      profilePatch: applyPatchFields
    }
  },
  UpdateProfileInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      profilePatch: applyPatchFields
    }
  },
  UpdateProfileTagByEntityKindAndEntityIdAndTagInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      profileTagPatch: applyPatchFields
    }
  },
  UpdateProfileTagInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      profileTagPatch: applyPatchFields
    }
  },
  UpdateUserByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      userPatch: applyPatchFields
    }
  },
  UpdateUserInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      userPatch: applyPatchFields
    }
  },
  UserCondition: {
    plans: {
      id($condition, val) {
        return applyAttributeCondition("id", TYPES.int, $condition, val);
      },
      name($condition, val) {
        return applyAttributeCondition("name", TYPES.text, $condition, val);
      }
    }
  },
  UserInput: {
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
  UserPatch: {
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
      throw new GraphQLError(`${"Cursor" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
    }
  },
  Datetime: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`${"Datetime" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
    }
  },
  UUID: {
    serialize: toString,
    parseValue(value) {
      return coerce("" + value);
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return coerce(ast.value);
      }
      throw new GraphQLError(`${"UUID" ?? "This scalar"} can only parse string values (kind = '${ast.kind}')`);
    }
  }
};
export const enums = {
  EntityKinds: {
    values: {
      LOCATIONS: {
        value: "locations"
      },
      PHOTOS: {
        value: "photos"
      },
      PROFILES: {
        value: "profiles"
      }
    }
  },
  LocationsOrderBy: {
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
        locationsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        locationsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      }
    }
  },
  LocationTagsOrderBy: {
    values: {
      ENTITY_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "entity_id",
          direction: "ASC"
        });
      },
      ENTITY_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "entity_id",
          direction: "DESC"
        });
      },
      ENTITY_KIND_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "entity_kind",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      ENTITY_KIND_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "entity_kind",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_ASC(queryBuilder) {
        location_tagsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        location_tagsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      TAG_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "tag",
          direction: "ASC"
        });
      },
      TAG_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "tag",
          direction: "DESC"
        });
      }
    }
  },
  MeasurementsOrderBy: {
    values: {
      KEY_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "key",
          direction: "ASC"
        });
      },
      KEY_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "key",
          direction: "DESC"
        });
      },
      PRIMARY_KEY_ASC(queryBuilder) {
        measurementsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        measurementsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      TIMESTAMP_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "timestamp",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      TIMESTAMP_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "timestamp",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
      },
      USER_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "user_id",
          direction: "ASC"
        });
      },
      USER_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "user_id",
          direction: "DESC"
        });
      },
      VALUE_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "value",
          direction: "ASC"
        });
      },
      VALUE_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "value",
          direction: "DESC"
        });
      }
    }
  },
  PhotosOrderBy: {
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
        photosUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        photosUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      }
    }
  },
  PhotoTagsOrderBy: {
    values: {
      ENTITY_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "entity_id",
          direction: "ASC"
        });
      },
      ENTITY_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "entity_id",
          direction: "DESC"
        });
      },
      ENTITY_KIND_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "entity_kind",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      ENTITY_KIND_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "entity_kind",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_ASC(queryBuilder) {
        photo_tagsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        photo_tagsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      TAG_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "tag",
          direction: "ASC"
        });
      },
      TAG_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "tag",
          direction: "DESC"
        });
      }
    }
  },
  ProfilesOrderBy: {
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
        profilesUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        profilesUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      }
    }
  },
  ProfileTagsOrderBy: {
    values: {
      ENTITY_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "entity_id",
          direction: "ASC"
        });
      },
      ENTITY_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "entity_id",
          direction: "DESC"
        });
      },
      ENTITY_KIND_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "entity_kind",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      ENTITY_KIND_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "entity_kind",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_ASC(queryBuilder) {
        profile_tagsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        profile_tagsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      TAG_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "tag",
          direction: "ASC"
        });
      },
      TAG_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "tag",
          direction: "DESC"
        });
      }
    }
  },
  UsersOrderBy: {
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
      },
      NAME_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "name",
          direction: "DESC"
        });
      },
      PRIMARY_KEY_ASC(queryBuilder) {
        usersUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        usersUniques[0].attributes.forEach(attributeName => {
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
