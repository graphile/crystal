import { PgDeleteSingleStep, PgExecutor, PgSelectSingleStep, PgSelectStep, PgUnionAllStep, TYPES, assertPgClassSingleStep, enumCodec, makeRegistry, pgClassExpression, pgDeleteSingle, pgInsertSingle, pgSelectFromRecord, pgSelectSingleFromRecord, pgUpdateSingle, recordCodec, sqlFromArgDigests } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ObjectStep, SafeError, __ValueStep, access, assertEdgeCapableStep, assertExecutableStep, assertPageInfoCapableStep, connection, constant, context, first, getEnumValueConfig, inhibitOnNull, lambda, list, makeGrafastSchema, node, object, rootValue, specFromNodeId, stepAMayDependOnStepB } from "grafast";
import { GraphQLError, Kind } from "graphql";
import { sql } from "pg-sql2";
import { inspect } from "util";
const handler_codec_base64JSON = {
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
const relationalTopicsIdentifier = sql.identifier("js_reserved", "relational_topics");
const itemTypeCodec = enumCodec({
  name: "itemType",
  identifier: sql.identifier("js_reserved", "item_type"),
  values: ["TOPIC", "STATUS"],
  description: undefined,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "js_reserved",
      name: "item_type"
    },
    tags: Object.create(null)
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
const spec_relationalTopics = {
  name: "relationalTopics",
  identifier: relationalTopicsIdentifier,
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      },
      identicalVia: "relationalItemsByMyId"
    },
    title: {
      description: undefined,
      codec: TYPES.text,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    type: {
      codec: itemTypeCodec,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: {}
      }
    },
    constructor: {
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      via: "relationalItemsByMyId",
      restrictedAccess: undefined,
      description: undefined,
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
      schemaName: "js_reserved",
      name: "relational_topics"
    },
    tags: Object.create(null),
    relationalInterfaceCodecName: "relationalItems"
  },
  executor: executor
};
const relationalTopicsCodec = recordCodec(spec_relationalTopics);
const __proto__Identifier = sql.identifier("js_reserved", "__proto__");
const spec___proto__ = {
  name: "__proto__",
  identifier: __proto__Identifier,
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
    name: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    brand: {
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
      schemaName: "js_reserved",
      name: "__proto__"
    },
    tags: Object.create(null)
  },
  executor: executor
};
const __proto__Codec = recordCodec(spec___proto__);
const buildingIdentifier = sql.identifier("js_reserved", "building");
const spec_building = {
  name: "building",
  identifier: buildingIdentifier,
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
    name: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    constructor: {
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
      schemaName: "js_reserved",
      name: "building"
    },
    tags: Object.create(null)
  },
  executor: executor
};
const buildingCodec = recordCodec(spec_building);
const constructorIdentifier = sql.identifier("js_reserved", "constructor");
const spec_constructor = {
  name: "constructor",
  identifier: constructorIdentifier,
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
    name: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    export: {
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
      schemaName: "js_reserved",
      name: "constructor"
    },
    tags: Object.create(null)
  },
  executor: executor
};
const constructorCodec = recordCodec(spec_constructor);
const cropIdentifier = sql.identifier("js_reserved", "crop");
const spec_crop = {
  name: "crop",
  identifier: cropIdentifier,
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
    yield: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    amount: {
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
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "js_reserved",
      name: "crop"
    },
    tags: Object.create(null)
  },
  executor: executor
};
const cropCodec = recordCodec(spec_crop);
const machineIdentifier = sql.identifier("js_reserved", "machine");
const spec_machine = {
  name: "machine",
  identifier: machineIdentifier,
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
    input: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    constructor: {
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
      schemaName: "js_reserved",
      name: "machine"
    },
    tags: Object.create(null)
  },
  executor: executor
};
const machineCodec = recordCodec(spec_machine);
const materialIdentifier = sql.identifier("js_reserved", "material");
const spec_material = {
  name: "material",
  identifier: materialIdentifier,
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
    class: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    valueOf: {
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
      schemaName: "js_reserved",
      name: "material"
    },
    tags: Object.create(null)
  },
  executor: executor
};
const materialCodec = recordCodec(spec_material);
const nullIdentifier = sql.identifier("js_reserved", "null");
const spec_null = {
  name: "null",
  identifier: nullIdentifier,
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
    hasOwnProperty: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    break: {
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
      schemaName: "js_reserved",
      name: "null"
    },
    tags: Object.create(null)
  },
  executor: executor
};
const nullCodec = recordCodec(spec_null);
const projectIdentifier = sql.identifier("js_reserved", "project");
const spec_project = {
  name: "project",
  identifier: projectIdentifier,
  attributes: Object.fromEntries([["id", {
    description: undefined,
    codec: TYPES.int,
    notNull: true,
    hasDefault: true,
    extensions: {
      tags: {}
    }
  }], ["brand", {
    description: undefined,
    codec: TYPES.text,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  }], ["__proto__", {
    description: undefined,
    codec: TYPES.text,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: {}
    }
  }]]),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "js_reserved",
      name: "project"
    },
    tags: Object.create(null)
  },
  executor: executor
};
const projectCodec = recordCodec(spec_project);
const relationalStatusIdentifier = sql.identifier("js_reserved", "relational_status");
const spec_relationalStatus = {
  name: "relationalStatus",
  identifier: relationalStatusIdentifier,
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      },
      identicalVia: "relationalItemsByMyId"
    },
    description: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: true,
      extensions: {
        tags: {}
      }
    },
    note: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    type: {
      codec: itemTypeCodec,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: spec_relationalTopics.attributes.type.extensions.tags
      }
    },
    constructor: {
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      via: "relationalItemsByMyId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: spec_relationalTopics.attributes.constructor.extensions.tags
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "js_reserved",
      name: "relational_status"
    },
    tags: Object.create(null),
    relationalInterfaceCodecName: "relationalItems"
  },
  executor: executor
};
const relationalStatusCodec = recordCodec(spec_relationalStatus);
const yieldIdentifier = sql.identifier("js_reserved", "yield");
const spec_yield = {
  name: "yield",
  identifier: yieldIdentifier,
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
    crop: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    export: {
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
      schemaName: "js_reserved",
      name: "yield"
    },
    tags: Object.create(null)
  },
  executor: executor
};
const yieldCodec = recordCodec(spec_yield);
const reservedIdentifier = sql.identifier("js_reserved", "reserved");
const spec_reserved = {
  name: "reserved",
  identifier: reservedIdentifier,
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
    null: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    case: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    do: {
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
      schemaName: "js_reserved",
      name: "reserved"
    },
    tags: Object.create(null)
  },
  executor: executor
};
const reservedCodec = recordCodec(spec_reserved);
const relationalItemsIdentifier = sql.identifier("js_reserved", "relational_items");
const spec_relationalItems = {
  name: "relationalItems",
  identifier: relationalItemsIdentifier,
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
    type: {
      description: undefined,
      codec: itemTypeCodec,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: spec_relationalTopics.attributes.type.extensions.tags
      }
    },
    constructor: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: spec_relationalTopics.attributes.constructor.extensions.tags
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "js_reserved",
      name: "relational_items"
    },
    tags: Object.assign(Object.create(null), {
      interface: "mode:relational type:type",
      type: ["TOPIC references:relational_topics", "STATUS references:relational_status"]
    })
  },
  executor: executor,
  polymorphism: {
    mode: "relational",
    typeAttributes: ["type"],
    types: Object.assign(Object.create(null), {
      TOPIC: {
        name: "RelationalTopic",
        references: "relational_topics",
        relationName: "relationalTopicsByTheirId"
      },
      STATUS: {
        name: "RelationalStatus",
        references: "relational_status",
        relationName: "relationalStatusByTheirId"
      }
    })
  }
};
const relationalItemsCodec = recordCodec(spec_relationalItems);
const awaitFunctionIdentifer = sql.identifier("js_reserved", "await");
const caseFunctionIdentifer = sql.identifier("js_reserved", "case");
const valueOfFunctionIdentifer = sql.identifier("js_reserved", "valueOf");
const null_yieldFunctionIdentifer = sql.identifier("js_reserved", "null_yield");
const relational_topicsUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_relational_topics_relational_topics = {
  executor: executor,
  name: "relational_topics",
  identifier: "main.js_reserved.relational_topics",
  from: relationalTopicsIdentifier,
  codec: relationalTopicsCodec,
  uniques: relational_topicsUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "js_reserved",
      name: "relational_topics"
    },
    tags: {}
  }
};
const __proto__Uniques = [{
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
const buildingUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}, {
  isPrimary: false,
  attributes: ["constructor"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_building_building = {
  executor: executor,
  name: "building",
  identifier: "main.js_reserved.building",
  from: buildingIdentifier,
  codec: buildingCodec,
  uniques: buildingUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "js_reserved",
      name: "building"
    },
    tags: {}
  }
};
const constructorUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}, {
  isPrimary: false,
  attributes: ["export"],
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
const cropUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}, {
  isPrimary: false,
  attributes: ["yield"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const machineUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_machine_machine = {
  executor: executor,
  name: "machine",
  identifier: "main.js_reserved.machine",
  from: machineIdentifier,
  codec: machineCodec,
  uniques: machineUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "js_reserved",
      name: "machine"
    },
    tags: {}
  }
};
const materialUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}, {
  isPrimary: false,
  attributes: ["class"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}, {
  isPrimary: false,
  attributes: ["valueOf"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const nullUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}, {
  isPrimary: false,
  attributes: ["break"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}, {
  isPrimary: false,
  attributes: ["hasOwnProperty"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const projectUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}, {
  isPrimary: false,
  attributes: ["__proto__"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const relational_statusUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_relational_status_relational_status = {
  executor: executor,
  name: "relational_status",
  identifier: "main.js_reserved.relational_status",
  from: relationalStatusIdentifier,
  codec: relationalStatusCodec,
  uniques: relational_statusUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "js_reserved",
      name: "relational_status"
    },
    tags: {}
  }
};
const yieldUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}, {
  isPrimary: false,
  attributes: ["export"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const reservedUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}, {
  isPrimary: false,
  attributes: ["case"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}, {
  isPrimary: false,
  attributes: ["do"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}, {
  isPrimary: false,
  attributes: ["null"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const relational_itemsUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_relational_items_relational_items = {
  executor: executor,
  name: "relational_items",
  identifier: "main.js_reserved.relational_items",
  from: relationalItemsIdentifier,
  codec: relationalItemsCodec,
  uniques: relational_itemsUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "js_reserved",
      name: "relational_items"
    },
    tags: {
      interface: "mode:relational type:type",
      type: spec_relationalItems.extensions.tags.type
    }
  }
};
const registryConfig = {
  pgCodecs: Object.fromEntries([["int4", TYPES.int], ["relationalTopics", relationalTopicsCodec], ["text", TYPES.text], ["__proto__", __proto__Codec], ["building", buildingCodec], ["constructor", constructorCodec], ["crop", cropCodec], ["machine", machineCodec], ["material", materialCodec], ["null", nullCodec], ["project", projectCodec], ["relationalStatus", relationalStatusCodec], ["yield", yieldCodec], ["reserved", reservedCodec], ["relationalItems", relationalItemsCodec], ["itemType", itemTypeCodec], ["varchar", TYPES.varchar], ["bpchar", TYPES.bpchar]]),
  pgResources: Object.fromEntries([["await", {
    executor,
    name: "await",
    identifier: "main.js_reserved.await(int4,int4,int4,int4)",
    from(...args) {
      return sql`${awaitFunctionIdentifer}(${sqlFromArgDigests(args)})`;
    },
    parameters: [{
      name: "yield",
      required: true,
      notNull: false,
      codec: TYPES.int
    }, {
      name: "__proto__",
      required: true,
      notNull: false,
      codec: TYPES.int
    }, {
      name: "constructor",
      required: true,
      notNull: false,
      codec: TYPES.int
    }, {
      name: "hasOwnProperty",
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
        schemaName: "js_reserved",
        name: "await"
      },
      tags: {
        behavior: ["queryField -mutationField -typeField", "-filter -order"]
      }
    },
    description: undefined
  }], ["case", {
    executor,
    name: "case",
    identifier: "main.js_reserved.case(int4,int4,int4,int4)",
    from(...args) {
      return sql`${caseFunctionIdentifer}(${sqlFromArgDigests(args)})`;
    },
    parameters: [{
      name: "yield",
      required: true,
      notNull: false,
      codec: TYPES.int
    }, {
      name: "__proto__",
      required: true,
      notNull: false,
      codec: TYPES.int
    }, {
      name: "constructor",
      required: true,
      notNull: false,
      codec: TYPES.int
    }, {
      name: "hasOwnProperty",
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
        schemaName: "js_reserved",
        name: "case"
      },
      tags: {
        behavior: ["queryField -mutationField -typeField", "-filter -order"]
      }
    },
    description: undefined
  }], ["valueOf", {
    executor,
    name: "valueOf",
    identifier: "main.js_reserved.valueOf(int4,int4,int4,int4)",
    from(...args) {
      return sql`${valueOfFunctionIdentifer}(${sqlFromArgDigests(args)})`;
    },
    parameters: [{
      name: "yield",
      required: true,
      notNull: false,
      codec: TYPES.int
    }, {
      name: "__proto__",
      required: true,
      notNull: false,
      codec: TYPES.int
    }, {
      name: "constructor",
      required: true,
      notNull: false,
      codec: TYPES.int
    }, {
      name: "hasOwnProperty",
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
        schemaName: "js_reserved",
        name: "valueOf"
      },
      tags: {
        behavior: ["queryField -mutationField -typeField", "-filter -order"]
      }
    },
    description: undefined
  }], ["null_yield", {
    executor,
    name: "null_yield",
    identifier: "main.js_reserved.null_yield(js_reserved.null,int4,int4,int4,int4)",
    from(...args) {
      return sql`${null_yieldFunctionIdentifer}(${sqlFromArgDigests(args)})`;
    },
    parameters: [{
      name: "n",
      required: true,
      notNull: false,
      codec: nullCodec
    }, {
      name: "yield",
      required: true,
      notNull: false,
      codec: TYPES.int
    }, {
      name: "__proto__",
      required: true,
      notNull: false,
      codec: TYPES.int
    }, {
      name: "constructor",
      required: true,
      notNull: false,
      codec: TYPES.int
    }, {
      name: "valueOf",
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
        schemaName: "js_reserved",
        name: "null_yield"
      },
      tags: {
        behavior: ["-queryField -mutationField typeField", "-filter -order"]
      }
    },
    description: undefined
  }], ["relational_topics", registryConfig_pgResources_relational_topics_relational_topics], ["__proto__", {
    executor: executor,
    name: "__proto__",
    identifier: "main.js_reserved.__proto__",
    from: __proto__Identifier,
    codec: __proto__Codec,
    uniques: __proto__Uniques,
    isVirtual: false,
    description: undefined,
    extensions: {
      description: undefined,
      pg: {
        serviceName: "main",
        schemaName: "js_reserved",
        name: "__proto__"
      },
      tags: {}
    }
  }], ["building", registryConfig_pgResources_building_building], ["constructor", {
    executor: executor,
    name: "constructor",
    identifier: "main.js_reserved.constructor",
    from: constructorIdentifier,
    codec: constructorCodec,
    uniques: constructorUniques,
    isVirtual: false,
    description: undefined,
    extensions: {
      description: undefined,
      pg: {
        serviceName: "main",
        schemaName: "js_reserved",
        name: "constructor"
      },
      tags: {}
    }
  }], ["crop", {
    executor: executor,
    name: "crop",
    identifier: "main.js_reserved.crop",
    from: cropIdentifier,
    codec: cropCodec,
    uniques: cropUniques,
    isVirtual: false,
    description: undefined,
    extensions: {
      description: undefined,
      pg: {
        serviceName: "main",
        schemaName: "js_reserved",
        name: "crop"
      },
      tags: {}
    }
  }], ["machine", registryConfig_pgResources_machine_machine], ["material", {
    executor: executor,
    name: "material",
    identifier: "main.js_reserved.material",
    from: materialIdentifier,
    codec: materialCodec,
    uniques: materialUniques,
    isVirtual: false,
    description: undefined,
    extensions: {
      description: undefined,
      pg: {
        serviceName: "main",
        schemaName: "js_reserved",
        name: "material"
      },
      tags: {}
    }
  }], ["null", {
    executor: executor,
    name: "null",
    identifier: "main.js_reserved.null",
    from: nullIdentifier,
    codec: nullCodec,
    uniques: nullUniques,
    isVirtual: false,
    description: undefined,
    extensions: {
      description: undefined,
      pg: {
        serviceName: "main",
        schemaName: "js_reserved",
        name: "null"
      },
      tags: {}
    }
  }], ["project", {
    executor: executor,
    name: "project",
    identifier: "main.js_reserved.project",
    from: projectIdentifier,
    codec: projectCodec,
    uniques: projectUniques,
    isVirtual: false,
    description: undefined,
    extensions: {
      description: undefined,
      pg: {
        serviceName: "main",
        schemaName: "js_reserved",
        name: "project"
      },
      tags: {}
    }
  }], ["relational_status", registryConfig_pgResources_relational_status_relational_status], ["yield", {
    executor: executor,
    name: "yield",
    identifier: "main.js_reserved.yield",
    from: yieldIdentifier,
    codec: yieldCodec,
    uniques: yieldUniques,
    isVirtual: false,
    description: undefined,
    extensions: {
      description: undefined,
      pg: {
        serviceName: "main",
        schemaName: "js_reserved",
        name: "yield"
      },
      tags: {}
    }
  }], ["reserved", {
    executor: executor,
    name: "reserved",
    identifier: "main.js_reserved.reserved",
    from: reservedIdentifier,
    codec: reservedCodec,
    uniques: reservedUniques,
    isVirtual: false,
    description: undefined,
    extensions: {
      description: undefined,
      pg: {
        serviceName: "main",
        schemaName: "js_reserved",
        name: "reserved"
      },
      tags: {}
    }
  }], ["relational_items", registryConfig_pgResources_relational_items_relational_items]]),
  pgRelations: Object.assign(Object.create(null), {
    building: Object.assign(Object.create(null), {
      machinesByTheirConstructor: {
        localCodec: buildingCodec,
        remoteResourceOptions: registryConfig_pgResources_machine_machine,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["constructor"],
        remoteAttributes: ["constructor"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      relationalItemsByTheirConstructor: {
        localCodec: buildingCodec,
        remoteResourceOptions: registryConfig_pgResources_relational_items_relational_items,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["constructor"],
        remoteAttributes: ["constructor"],
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
    machine: Object.assign(Object.create(null), {
      buildingByMyConstructor: {
        localCodec: machineCodec,
        remoteResourceOptions: registryConfig_pgResources_building_building,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["constructor"],
        remoteAttributes: ["constructor"],
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
    relationalItems: Object.assign(Object.create(null), {
      buildingByMyConstructor: {
        localCodec: relationalItemsCodec,
        remoteResourceOptions: registryConfig_pgResources_building_building,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["constructor"],
        remoteAttributes: ["constructor"],
        isUnique: true,
        isReferencee: false,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      relationalTopicsByTheirId: {
        localCodec: relationalItemsCodec,
        remoteResourceOptions: registryConfig_pgResources_relational_topics_relational_topics,
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
      },
      relationalStatusByTheirId: {
        localCodec: relationalItemsCodec,
        remoteResourceOptions: registryConfig_pgResources_relational_status_relational_status,
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
    relationalStatus: Object.assign(Object.create(null), {
      relationalItemsByMyId: {
        localCodec: relationalStatusCodec,
        remoteResourceOptions: registryConfig_pgResources_relational_items_relational_items,
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
    relationalTopics: Object.assign(Object.create(null), {
      relationalItemsByMyId: {
        localCodec: relationalTopicsCodec,
        remoteResourceOptions: registryConfig_pgResources_relational_items_relational_items,
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
    })
  })
};
const registry = makeRegistry(registryConfig);
const pgResource_relational_topicsPgResource = registry.pgResources["relational_topics"];
const handler = {
  typeName: "RelationalTopic",
  codec: handler_codec_base64JSON,
  deprecationReason: undefined,
  plan($record) {
    return list([constant("relational_topics", false), $record.get("id")]);
  },
  getSpec($list) {
    return {
      id: inhibitOnNull(access($list, [1]))
    };
  },
  get(spec) {
    return pgResource_relational_topicsPgResource.get(spec);
  },
  match(obj) {
    return obj[0] === "relational_topics";
  }
};
const nodeIdCodecs = Object.assign(Object.create(null), {
  raw: {
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
  base64JSON: handler_codec_base64JSON,
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
const building_buildingPgResource = registry.pgResources["building"];
const relational_items_relational_itemsPgResource = registry.pgResources["relational_items"];
const relational_status_relational_statusPgResource = registry.pgResources["relational_status"];
const handler2 = {
  typeName: "Building",
  codec: handler_codec_base64JSON,
  deprecationReason: undefined,
  plan($record) {
    return list([constant("buildings", false), $record.get("id")]);
  },
  getSpec($list) {
    return {
      id: inhibitOnNull(access($list, [1]))
    };
  },
  get(spec) {
    return building_buildingPgResource.get(spec);
  },
  match(obj) {
    return obj[0] === "buildings";
  }
};
const otherSource_machinePgResource = registry.pgResources["machine"];
const specFromRecord = $record => {
  return registryConfig.pgRelations.building.machinesByTheirConstructor.remoteAttributes.reduce((memo, remoteAttributeName, i) => {
    memo[remoteAttributeName] = $record.get(registryConfig.pgRelations.building.machinesByTheirConstructor.localAttributes[i]);
    return memo;
  }, Object.create(null));
};
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
const specFromRecord2 = $record => {
  return registryConfig.pgRelations.building.relationalItemsByTheirConstructor.remoteAttributes.reduce((memo, remoteAttributeName, i) => {
    memo[remoteAttributeName] = $record.get(registryConfig.pgRelations.building.relationalItemsByTheirConstructor.localAttributes[i]);
    return memo;
  }, Object.create(null));
};
const handler3 = {
  typeName: "Machine",
  codec: handler_codec_base64JSON,
  deprecationReason: undefined,
  plan($record) {
    return list([constant("machines", false), $record.get("id")]);
  },
  getSpec($list) {
    return {
      id: inhibitOnNull(access($list, [1]))
    };
  },
  get(spec) {
    return otherSource_machinePgResource.get(spec);
  },
  match(obj) {
    return obj[0] === "machines";
  }
};
const specFromRecord3 = $record => {
  return registryConfig.pgRelations.machine.buildingByMyConstructor.remoteAttributes.reduce((memo, remoteAttributeName, i) => {
    memo[remoteAttributeName] = $record.get(registryConfig.pgRelations.machine.buildingByMyConstructor.localAttributes[i]);
    return memo;
  }, Object.create(null));
};
function CursorSerialize(value) {
  return "" + value;
}
const handler4 = {
  typeName: "RelationalStatus",
  codec: handler_codec_base64JSON,
  deprecationReason: undefined,
  plan($record) {
    return list([constant("relational_statuses", false), $record.get("id")]);
  },
  getSpec($list) {
    return {
      id: inhibitOnNull(access($list, [1]))
    };
  },
  get(spec) {
    return relational_status_relational_statusPgResource.get(spec);
  },
  match(obj) {
    return obj[0] === "relational_statuses";
  }
};
const handler5 = {
  typeName: "Query",
  codec: nodeIdCodecs.raw,
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
const pgResource___proto__PgResource = registry.pgResources["__proto__"];
const pgResource_constructorPgResource = registry.pgResources["constructor"];
const pgResource_cropPgResource = registry.pgResources["crop"];
const pgResource_materialPgResource = registry.pgResources["material"];
const pgResource_nullPgResource = registry.pgResources["null"];
const pgResource_projectPgResource = registry.pgResources["project"];
const pgResource_yieldPgResource = registry.pgResources["yield"];
const pgResource_reservedPgResource = registry.pgResources["reserved"];
const nodeIdHandlerByTypeName = Object.assign(Object.create(null), {
  Query: handler5,
  RelationalTopic: handler,
  _Proto__: {
    typeName: "_Proto__",
    codec: handler_codec_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("__proto__S", false), ...__proto__Uniques[0].attributes.map(attribute => $record.get(attribute))]);
    },
    getSpec($list) {
      const spec = __proto__Uniques[0].attributes.reduce((memo, attribute, index) => {
        memo[attribute] = inhibitOnNull(access($list, [index + 1]));
        return memo;
      }, Object.create(null));
      return spec;
    },
    get(spec) {
      return pgResource___proto__PgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "__proto__S";
    }
  },
  Building: handler2,
  Constructor: {
    typeName: "Constructor",
    codec: handler_codec_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("constructors", false), $record.get("id")]);
    },
    getSpec($list) {
      return {
        id: inhibitOnNull(access($list, [1]))
      };
    },
    get(spec) {
      return pgResource_constructorPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "constructors";
    }
  },
  Crop: {
    typeName: "Crop",
    codec: handler_codec_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("crops", false), $record.get("id")]);
    },
    getSpec($list) {
      return {
        id: inhibitOnNull(access($list, [1]))
      };
    },
    get(spec) {
      return pgResource_cropPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "crops";
    }
  },
  Machine: handler3,
  Material: {
    typeName: "Material",
    codec: handler_codec_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("materials", false), $record.get("id")]);
    },
    getSpec($list) {
      return {
        id: inhibitOnNull(access($list, [1]))
      };
    },
    get(spec) {
      return pgResource_materialPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "materials";
    }
  },
  Null: {
    typeName: "Null",
    codec: handler_codec_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("nulls", false), $record.get("id")]);
    },
    getSpec($list) {
      return {
        id: inhibitOnNull(access($list, [1]))
      };
    },
    get(spec) {
      return pgResource_nullPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "nulls";
    }
  },
  Project: {
    typeName: "Project",
    codec: handler_codec_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("projects", false), $record.get("id")]);
    },
    getSpec($list) {
      return {
        id: inhibitOnNull(access($list, [1]))
      };
    },
    get(spec) {
      return pgResource_projectPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "projects";
    }
  },
  RelationalStatus: handler4,
  Yield: {
    typeName: "Yield",
    codec: handler_codec_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("yields", false), $record.get("id")]);
    },
    getSpec($list) {
      return {
        id: inhibitOnNull(access($list, [1]))
      };
    },
    get(spec) {
      return pgResource_yieldPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "yields";
    }
  },
  Reserved: {
    typeName: "Reserved",
    codec: handler_codec_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("reserveds", false), $record.get("id")]);
    },
    getSpec($list) {
      return {
        id: inhibitOnNull(access($list, [1]))
      };
    },
    get(spec) {
      return pgResource_reservedPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "reserveds";
    }
  }
});
const detailsByAttributeName = Object.assign(Object.create(null), {
  constructor: {
    graphqlName: "constructor",
    codec: TYPES.text
  }
});
const detailsByAttributeName2 = Object.assign(Object.create(null), {
  valueOf: {
    graphqlName: "valueOf",
    codec: TYPES.text
  }
});
const detailsByAttributeName3 = Object.assign(Object.create(null), {
  hasOwnProperty: {
    graphqlName: "hasOwnProperty",
    codec: TYPES.text
  }
});
const detailsByAttributeName4 = Object.fromEntries([["__proto__", {
  graphqlName: "_proto__",
  codec: TYPES.text
}]]);
const argDetailsSimple = [{
  graphqlArgName: "yield",
  postgresArgName: "yield",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "_proto__",
  postgresArgName: "__proto__",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "constructor",
  postgresArgName: "constructor",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "hasOwnProperty",
  postgresArgName: "hasOwnProperty",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 4; i++) {
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
const resource_awaitPgResource = registry.pgResources["await"];
const argDetailsSimple2 = [{
  graphqlArgName: "yield",
  postgresArgName: "yield",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "_proto__",
  postgresArgName: "__proto__",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "constructor",
  postgresArgName: "constructor",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "hasOwnProperty",
  postgresArgName: "hasOwnProperty",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs2 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 4; i++) {
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
const resource_casePgResource = registry.pgResources["case"];
const argDetailsSimple3 = [{
  graphqlArgName: "yield",
  postgresArgName: "yield",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "_proto__",
  postgresArgName: "__proto__",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "constructor",
  postgresArgName: "constructor",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "hasOwnProperty",
  postgresArgName: "hasOwnProperty",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs3 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 4; i++) {
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
const resource_valueOfPgResource = registry.pgResources["valueOf"];
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
const fetcher = (() => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})();
const fetcher2 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName._Proto__);
const fetcher3 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(handler2);
const fetcher4 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName.Constructor);
const fetcher5 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName.Crop);
const fetcher6 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(handler3);
const fetcher7 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName.Material);
const fetcher8 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName.Null);
const fetcher9 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName.Project);
const fetcher10 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(handler4);
const fetcher11 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName.Yield);
const fetcher12 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName.Reserved);
function hasRecord($row) {
  return "record" in $row && typeof $row.record === "function";
}
const argDetailsSimple4 = [{
  graphqlArgName: "yield",
  postgresArgName: "yield",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "_proto__",
  postgresArgName: "__proto__",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "constructor",
  postgresArgName: "constructor",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}, {
  graphqlArgName: "valueOf",
  postgresArgName: "valueOf",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs4 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 4; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple4[i];
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
const resource_null_yieldPgResource = registry.pgResources["null_yield"];
const specFromArgs = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName._Proto__, $nodeId);
};
const specFromArgs2 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(handler2, $nodeId);
};
const uniqueAttributes = [["constructor", "constructor"]];
const specFromArgs3 = args => {
  return uniqueAttributes.reduce((memo, [attributeName, fieldName]) => {
    memo[attributeName] = args.get(["input", fieldName]);
    return memo;
  }, Object.create(null));
};
const specFromArgs4 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Constructor, $nodeId);
};
const specFromArgs5 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Crop, $nodeId);
};
const specFromArgs6 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(handler3, $nodeId);
};
const specFromArgs7 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Material, $nodeId);
};
const uniqueAttributes2 = [["valueOf", "valueOf"]];
const specFromArgs8 = args => {
  return uniqueAttributes2.reduce((memo, [attributeName, fieldName]) => {
    memo[attributeName] = args.get(["input", fieldName]);
    return memo;
  }, Object.create(null));
};
const specFromArgs9 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Null, $nodeId);
};
const uniqueAttributes3 = [["hasOwnProperty", "hasOwnProperty"]];
const specFromArgs10 = args => {
  return uniqueAttributes3.reduce((memo, [attributeName, fieldName]) => {
    memo[attributeName] = args.get(["input", fieldName]);
    return memo;
  }, Object.create(null));
};
const specFromArgs11 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Project, $nodeId);
};
const uniqueAttributes4 = [["__proto__", "_proto__"]];
const specFromArgs12 = args => {
  return uniqueAttributes4.reduce((memo, [attributeName, fieldName]) => {
    memo[attributeName] = args.get(["input", fieldName]);
    return memo;
  }, Object.create(null));
};
const specFromArgs13 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Yield, $nodeId);
};
const specFromArgs14 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Reserved, $nodeId);
};
const specFromArgs15 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName._Proto__, $nodeId);
};
const specFromArgs16 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(handler2, $nodeId);
};
const uniqueAttributes5 = [["constructor", "constructor"]];
const specFromArgs17 = args => {
  return uniqueAttributes5.reduce((memo, [attributeName, fieldName]) => {
    memo[attributeName] = args.get(["input", fieldName]);
    return memo;
  }, Object.create(null));
};
const specFromArgs18 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Constructor, $nodeId);
};
const specFromArgs19 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Crop, $nodeId);
};
const specFromArgs20 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(handler3, $nodeId);
};
const specFromArgs21 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Material, $nodeId);
};
const uniqueAttributes6 = [["valueOf", "valueOf"]];
const specFromArgs22 = args => {
  return uniqueAttributes6.reduce((memo, [attributeName, fieldName]) => {
    memo[attributeName] = args.get(["input", fieldName]);
    return memo;
  }, Object.create(null));
};
const specFromArgs23 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Null, $nodeId);
};
const uniqueAttributes7 = [["hasOwnProperty", "hasOwnProperty"]];
const specFromArgs24 = args => {
  return uniqueAttributes7.reduce((memo, [attributeName, fieldName]) => {
    memo[attributeName] = args.get(["input", fieldName]);
    return memo;
  }, Object.create(null));
};
const specFromArgs25 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Project, $nodeId);
};
const uniqueAttributes8 = [["__proto__", "_proto__"]];
const specFromArgs26 = args => {
  return uniqueAttributes8.reduce((memo, [attributeName, fieldName]) => {
    memo[attributeName] = args.get(["input", fieldName]);
    return memo;
  }, Object.create(null));
};
const specFromArgs27 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Yield, $nodeId);
};
const specFromArgs28 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Reserved, $nodeId);
};
const specFromRecord4 = $record => {
  return registryConfig.pgRelations.machine.buildingByMyConstructor.remoteAttributes.reduce((memo, remoteAttributeName, i) => {
    memo[remoteAttributeName] = $record.get(registryConfig.pgRelations.machine.buildingByMyConstructor.localAttributes[i]);
    return memo;
  }, Object.create(null));
};
const specFromRecord5 = $record => {
  return registryConfig.pgRelations.machine.buildingByMyConstructor.remoteAttributes.reduce((memo, remoteAttributeName, i) => {
    memo[remoteAttributeName] = $record.get(registryConfig.pgRelations.machine.buildingByMyConstructor.localAttributes[i]);
    return memo;
  }, Object.create(null));
};
const specFromRecord6 = $record => {
  return registryConfig.pgRelations.machine.buildingByMyConstructor.remoteAttributes.reduce((memo, remoteAttributeName, i) => {
    memo[remoteAttributeName] = $record.get(registryConfig.pgRelations.machine.buildingByMyConstructor.localAttributes[i]);
    return memo;
  }, Object.create(null));
};
export const typeDefs = /* GraphQL */`type RelationalTopic implements Node & RelationalItem {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  title: String!
  type: ItemType!
  constructor: String

  """Reads a single \`Building\` that is related to this \`RelationalTopic\`."""
  buildingByConstructor: Building

  """
  Reads a single \`RelationalTopic\` that is related to this \`RelationalTopic\`.
  """
  relationalTopicById: RelationalTopic

  """
  Reads a single \`RelationalStatus\` that is related to this \`RelationalTopic\`.
  """
  relationalStatusById: RelationalStatus
}

"""An object with a globally unique \`ID\`."""
interface Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
}

interface RelationalItem implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  type: ItemType!
  constructor: String

  """Reads a single \`Building\` that is related to this \`RelationalItem\`."""
  buildingByConstructor: Building
}

enum ItemType {
  TOPIC
  STATUS
}

type Building implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  name: String
  constructor: String

  """Reads and enables pagination through a set of \`Machine\`."""
  machinesByConstructor(
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

    """The method to use when ordering \`Machine\`."""
    orderBy: [MachinesOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: MachineCondition
  ): MachinesConnection!

  """Reads and enables pagination through a set of \`Machine\`."""
  machinesByConstructorList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int

    """The method to use when ordering \`Machine\`."""
    orderBy: [MachinesOrderBy!]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: MachineCondition
  ): [Machine!]!

  """Reads and enables pagination through a set of \`RelationalItem\`."""
  relationalItemsByConstructor(
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

    """The method to use when ordering \`RelationalItem\`."""
    orderBy: [RelationalItemsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalItemCondition
  ): RelationalItemsConnection!

  """Reads and enables pagination through a set of \`RelationalItem\`."""
  relationalItemsByConstructorList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int

    """The method to use when ordering \`RelationalItem\`."""
    orderBy: [RelationalItemsOrderBy!]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalItemCondition
  ): [RelationalItem!]!
}

"""A connection to a list of \`Machine\` values."""
type MachinesConnection {
  """A list of \`Machine\` objects."""
  nodes: [Machine]!

  """
  A list of edges which contains the \`Machine\` and cursor to aid in pagination.
  """
  edges: [MachinesEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Machine\` you could get from the connection."""
  totalCount: Int!
}

type Machine implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  input: String
  constructor: String

  """Reads a single \`Building\` that is related to this \`Machine\`."""
  buildingByConstructor: Building
}

"""A \`Machine\` edge in the connection."""
type MachinesEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Machine\` at the end of the edge."""
  node: Machine
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

"""Methods to use when ordering \`Machine\`."""
enum MachinesOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  INPUT_ASC
  INPUT_DESC
  CONSTRUCTOR_ASC
  CONSTRUCTOR_DESC
}

"""
A condition to be used against \`Machine\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input MachineCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`input\` field."""
  input: String

  """Checks for equality with the object’s \`constructor\` field."""
  constructor: String
}

"""A connection to a list of \`RelationalItem\` values."""
type RelationalItemsConnection {
  """A list of \`RelationalItem\` objects."""
  nodes: [RelationalItem]!

  """
  A list of edges which contains the \`RelationalItem\` and cursor to aid in pagination.
  """
  edges: [RelationalItemsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`RelationalItem\` you could get from the connection."""
  totalCount: Int!
}

"""A \`RelationalItem\` edge in the connection."""
type RelationalItemsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`RelationalItem\` at the end of the edge."""
  node: RelationalItem
}

"""Methods to use when ordering \`RelationalItem\`."""
enum RelationalItemsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  TYPE_ASC
  TYPE_DESC
  CONSTRUCTOR_ASC
  CONSTRUCTOR_DESC
}

"""
A condition to be used against \`RelationalItem\` object types. All fields are
tested for equality and combined with a logical ‘and.’
"""
input RelationalItemCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`type\` field."""
  type: ItemType

  """Checks for equality with the object’s \`constructor\` field."""
  constructor: String
}

type RelationalStatus implements Node & RelationalItem {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  description: String
  note: String
  type: ItemType!
  constructor: String

  """Reads a single \`Building\` that is related to this \`RelationalStatus\`."""
  buildingByConstructor: Building

  """
  Reads a single \`RelationalTopic\` that is related to this \`RelationalStatus\`.
  """
  relationalTopicById: RelationalTopic

  """
  Reads a single \`RelationalStatus\` that is related to this \`RelationalStatus\`.
  """
  relationalStatusById: RelationalStatus
}

"""The root query type which gives access points into the data universe."""
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

  """Get a single \`RelationalTopic\`."""
  relationalTopicById(id: Int!): RelationalTopic

  """Get a single \`_Proto__\`."""
  _protoById(id: Int!): _Proto__

  """Get a single \`_Proto__\`."""
  _protoByName(name: String!): _Proto__

  """Get a single \`Building\`."""
  buildingById(id: Int!): Building

  """Get a single \`Building\`."""
  buildingByConstructor(constructor: String!): Building

  """Get a single \`Constructor\`."""
  constructorById(id: Int!): Constructor

  """Get a single \`Constructor\`."""
  constructorByExport(export: String!): Constructor

  """Get a single \`Constructor\`."""
  constructorByName(name: String!): Constructor

  """Get a single \`Crop\`."""
  cropById(id: Int!): Crop

  """Get a single \`Crop\`."""
  cropByYield(yield: String!): Crop

  """Get a single \`Machine\`."""
  machineById(id: Int!): Machine

  """Get a single \`Material\`."""
  materialById(id: Int!): Material

  """Get a single \`Material\`."""
  materialByClass(class: String!): Material

  """Get a single \`Material\`."""
  materialByValueOf(valueOf: String!): Material

  """Get a single \`Null\`."""
  nullById(id: Int!): Null

  """Get a single \`Null\`."""
  nullByBreak(break: String!): Null

  """Get a single \`Null\`."""
  nullByHasOwnProperty(hasOwnProperty: String!): Null

  """Get a single \`Project\`."""
  projectById(id: Int!): Project

  """Get a single \`Project\`."""
  projectByProto__(_proto__: String!): Project

  """Get a single \`RelationalStatus\`."""
  relationalStatusById(id: Int!): RelationalStatus

  """Get a single \`Yield\`."""
  yieldById(id: Int!): Yield

  """Get a single \`Yield\`."""
  yieldByExport(export: String!): Yield

  """Get a single \`Reserved\`."""
  reservedById(id: Int!): Reserved

  """Get a single \`Reserved\`."""
  reservedByCase(case: String!): Reserved

  """Get a single \`Reserved\`."""
  reservedByDo(do: String!): Reserved

  """Get a single \`Reserved\`."""
  reservedByNull(null: String!): Reserved
  await(yield: Int, _proto__: Int, constructor: Int, hasOwnProperty: Int): Int
  case(yield: Int, _proto__: Int, constructor: Int, hasOwnProperty: Int): Int
  valueOf(yield: Int, _proto__: Int, constructor: Int, hasOwnProperty: Int): Int

  """Reads a single \`RelationalTopic\` using its globally unique \`ID\`."""
  relationalTopic(
    """
    The globally unique \`ID\` to be used in selecting a single \`RelationalTopic\`.
    """
    nodeId: ID!
  ): RelationalTopic

  """Reads a single \`_Proto__\` using its globally unique \`ID\`."""
  _proto__(
    """The globally unique \`ID\` to be used in selecting a single \`_Proto__\`."""
    nodeId: ID!
  ): _Proto__

  """Reads a single \`Building\` using its globally unique \`ID\`."""
  building(
    """The globally unique \`ID\` to be used in selecting a single \`Building\`."""
    nodeId: ID!
  ): Building

  """Reads a single \`Constructor\` using its globally unique \`ID\`."""
  constructor(
    """
    The globally unique \`ID\` to be used in selecting a single \`Constructor\`.
    """
    nodeId: ID!
  ): Constructor

  """Reads a single \`Crop\` using its globally unique \`ID\`."""
  crop(
    """The globally unique \`ID\` to be used in selecting a single \`Crop\`."""
    nodeId: ID!
  ): Crop

  """Reads a single \`Machine\` using its globally unique \`ID\`."""
  machine(
    """The globally unique \`ID\` to be used in selecting a single \`Machine\`."""
    nodeId: ID!
  ): Machine

  """Reads a single \`Material\` using its globally unique \`ID\`."""
  material(
    """The globally unique \`ID\` to be used in selecting a single \`Material\`."""
    nodeId: ID!
  ): Material

  """Reads a single \`Null\` using its globally unique \`ID\`."""
  null(
    """The globally unique \`ID\` to be used in selecting a single \`Null\`."""
    nodeId: ID!
  ): Null

  """Reads a single \`Project\` using its globally unique \`ID\`."""
  project(
    """The globally unique \`ID\` to be used in selecting a single \`Project\`."""
    nodeId: ID!
  ): Project

  """Reads a single \`RelationalStatus\` using its globally unique \`ID\`."""
  relationalStatus(
    """
    The globally unique \`ID\` to be used in selecting a single \`RelationalStatus\`.
    """
    nodeId: ID!
  ): RelationalStatus

  """Reads a single \`Yield\` using its globally unique \`ID\`."""
  yield(
    """The globally unique \`ID\` to be used in selecting a single \`Yield\`."""
    nodeId: ID!
  ): Yield

  """Reads a single \`Reserved\` using its globally unique \`ID\`."""
  reserved(
    """The globally unique \`ID\` to be used in selecting a single \`Reserved\`."""
    nodeId: ID!
  ): Reserved

  """Reads a set of \`RelationalTopic\`."""
  allRelationalTopicsList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int

    """The method to use when ordering \`RelationalTopic\`."""
    orderBy: [RelationalTopicsOrderBy!]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalTopicCondition
  ): [RelationalTopic!]

  """Reads and enables pagination through a set of \`RelationalTopic\`."""
  allRelationalTopics(
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

    """The method to use when ordering \`RelationalTopic\`."""
    orderBy: [RelationalTopicsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalTopicCondition
  ): RelationalTopicsConnection

  """Reads a set of \`_Proto__\`."""
  allProtoSList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int

    """The method to use when ordering \`_Proto__\`."""
    orderBy: [_ProtoSOrderBy!]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: _ProtoCondition
  ): [_Proto__!]

  """Reads and enables pagination through a set of \`_Proto__\`."""
  allProtoS(
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

    """The method to use when ordering \`_Proto__\`."""
    orderBy: [_ProtoSOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: _ProtoCondition
  ): _Proto__SConnection

  """Reads a set of \`Building\`."""
  allBuildingsList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int

    """The method to use when ordering \`Building\`."""
    orderBy: [BuildingsOrderBy!]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: BuildingCondition
  ): [Building!]

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

  """Reads a set of \`Constructor\`."""
  allConstructorsList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int

    """The method to use when ordering \`Constructor\`."""
    orderBy: [ConstructorsOrderBy!]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: ConstructorCondition
  ): [Constructor!]

  """Reads and enables pagination through a set of \`Constructor\`."""
  allConstructors(
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

    """The method to use when ordering \`Constructor\`."""
    orderBy: [ConstructorsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: ConstructorCondition
  ): ConstructorsConnection

  """Reads a set of \`Crop\`."""
  allCropsList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int

    """The method to use when ordering \`Crop\`."""
    orderBy: [CropsOrderBy!]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: CropCondition
  ): [Crop!]

  """Reads and enables pagination through a set of \`Crop\`."""
  allCrops(
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

    """The method to use when ordering \`Crop\`."""
    orderBy: [CropsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: CropCondition
  ): CropsConnection

  """Reads a set of \`Machine\`."""
  allMachinesList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int

    """The method to use when ordering \`Machine\`."""
    orderBy: [MachinesOrderBy!]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: MachineCondition
  ): [Machine!]

  """Reads and enables pagination through a set of \`Machine\`."""
  allMachines(
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

    """The method to use when ordering \`Machine\`."""
    orderBy: [MachinesOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: MachineCondition
  ): MachinesConnection

  """Reads a set of \`Material\`."""
  allMaterialsList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int

    """The method to use when ordering \`Material\`."""
    orderBy: [MaterialsOrderBy!]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: MaterialCondition
  ): [Material!]

  """Reads and enables pagination through a set of \`Material\`."""
  allMaterials(
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

    """The method to use when ordering \`Material\`."""
    orderBy: [MaterialsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: MaterialCondition
  ): MaterialsConnection

  """Reads a set of \`Null\`."""
  allNullsList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int

    """The method to use when ordering \`Null\`."""
    orderBy: [NullsOrderBy!]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: NullCondition
  ): [Null!]

  """Reads and enables pagination through a set of \`Null\`."""
  allNulls(
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

    """The method to use when ordering \`Null\`."""
    orderBy: [NullsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: NullCondition
  ): NullsConnection

  """Reads a set of \`Project\`."""
  allProjectsList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int

    """The method to use when ordering \`Project\`."""
    orderBy: [ProjectsOrderBy!]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: ProjectCondition
  ): [Project!]

  """Reads and enables pagination through a set of \`Project\`."""
  allProjects(
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

    """The method to use when ordering \`Project\`."""
    orderBy: [ProjectsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: ProjectCondition
  ): ProjectsConnection

  """Reads a set of \`RelationalStatus\`."""
  allRelationalStatusesList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int

    """The method to use when ordering \`RelationalStatus\`."""
    orderBy: [RelationalStatusesOrderBy!]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalStatusCondition
  ): [RelationalStatus!]

  """Reads and enables pagination through a set of \`RelationalStatus\`."""
  allRelationalStatuses(
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

    """The method to use when ordering \`RelationalStatus\`."""
    orderBy: [RelationalStatusesOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalStatusCondition
  ): RelationalStatusesConnection

  """Reads a set of \`Yield\`."""
  allYieldsList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int

    """The method to use when ordering \`Yield\`."""
    orderBy: [YieldsOrderBy!]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: YieldCondition
  ): [Yield!]

  """Reads and enables pagination through a set of \`Yield\`."""
  allYields(
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

    """The method to use when ordering \`Yield\`."""
    orderBy: [YieldsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: YieldCondition
  ): YieldsConnection

  """Reads a set of \`Reserved\`."""
  allReservedsList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int

    """The method to use when ordering \`Reserved\`."""
    orderBy: [ReservedsOrderBy!]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: ReservedCondition
  ): [Reserved!]

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

    """The method to use when ordering \`Reserved\`."""
    orderBy: [ReservedsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: ReservedCondition
  ): ReservedsConnection

  """Reads a set of \`RelationalItem\`."""
  allRelationalItemsList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int

    """The method to use when ordering \`RelationalItem\`."""
    orderBy: [RelationalItemsOrderBy!]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalItemCondition
  ): [RelationalItem!]

  """Reads and enables pagination through a set of \`RelationalItem\`."""
  allRelationalItems(
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

    """The method to use when ordering \`RelationalItem\`."""
    orderBy: [RelationalItemsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalItemCondition
  ): RelationalItemsConnection
}

type _Proto__ implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  name: String
  brand: String
}

type Constructor implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  name: String
  export: String
}

type Crop implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  yield: String
  amount: Int
}

type Material implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  class: String
  valueOf: String
}

type Null implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  yield(yield: Int, _proto__: Int, constructor: Int, valueOf: Int): Int
  id: Int!
  hasOwnProperty: String
  break: String
}

type Project implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  brand: String
  _proto__: String
}

type Yield implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  crop: String
  export: String
}

type Reserved implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  null: String
  case: String
  do: String
}

"""Methods to use when ordering \`RelationalTopic\`."""
enum RelationalTopicsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  TITLE_ASC
  TITLE_DESC
  TYPE_ASC
  TYPE_DESC
  CONSTRUCTOR_ASC
  CONSTRUCTOR_DESC
}

"""
A condition to be used against \`RelationalTopic\` object types. All fields are
tested for equality and combined with a logical ‘and.’
"""
input RelationalTopicCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`title\` field."""
  title: String

  """Checks for equality with the object’s \`type\` field."""
  type: ItemType

  """Checks for equality with the object’s \`constructor\` field."""
  constructor: String
}

"""A connection to a list of \`RelationalTopic\` values."""
type RelationalTopicsConnection {
  """A list of \`RelationalTopic\` objects."""
  nodes: [RelationalTopic]!

  """
  A list of edges which contains the \`RelationalTopic\` and cursor to aid in pagination.
  """
  edges: [RelationalTopicsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """
  The count of *all* \`RelationalTopic\` you could get from the connection.
  """
  totalCount: Int!
}

"""A \`RelationalTopic\` edge in the connection."""
type RelationalTopicsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`RelationalTopic\` at the end of the edge."""
  node: RelationalTopic
}

"""Methods to use when ordering \`_Proto__\`."""
enum _ProtoSOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  NAME_ASC
  NAME_DESC
  BRAND_ASC
  BRAND_DESC
}

"""
A condition to be used against \`_Proto__\` object types. All fields are tested
for equality and combined with a logical ‘and.’
"""
input _ProtoCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`name\` field."""
  name: String

  """Checks for equality with the object’s \`brand\` field."""
  brand: String
}

"""A connection to a list of \`_Proto__\` values."""
type _Proto__SConnection {
  """A list of \`_Proto__\` objects."""
  nodes: [_Proto__]!

  """
  A list of edges which contains the \`_Proto__\` and cursor to aid in pagination.
  """
  edges: [_Proto__SEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`_Proto__\` you could get from the connection."""
  totalCount: Int!
}

"""A \`_Proto__\` edge in the connection."""
type _Proto__SEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`_Proto__\` at the end of the edge."""
  node: _Proto__
}

"""Methods to use when ordering \`Building\`."""
enum BuildingsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  NAME_ASC
  NAME_DESC
  CONSTRUCTOR_ASC
  CONSTRUCTOR_DESC
}

"""
A condition to be used against \`Building\` object types. All fields are tested
for equality and combined with a logical ‘and.’
"""
input BuildingCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`name\` field."""
  name: String

  """Checks for equality with the object’s \`constructor\` field."""
  constructor: String
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

"""Methods to use when ordering \`Constructor\`."""
enum ConstructorsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  NAME_ASC
  NAME_DESC
  EXPORT_ASC
  EXPORT_DESC
}

"""
A condition to be used against \`Constructor\` object types. All fields are tested
for equality and combined with a logical ‘and.’
"""
input ConstructorCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`name\` field."""
  name: String

  """Checks for equality with the object’s \`export\` field."""
  export: String
}

"""A connection to a list of \`Constructor\` values."""
type ConstructorsConnection {
  """A list of \`Constructor\` objects."""
  nodes: [Constructor]!

  """
  A list of edges which contains the \`Constructor\` and cursor to aid in pagination.
  """
  edges: [ConstructorsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Constructor\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Constructor\` edge in the connection."""
type ConstructorsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Constructor\` at the end of the edge."""
  node: Constructor
}

"""Methods to use when ordering \`Crop\`."""
enum CropsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  YIELD_ASC
  YIELD_DESC
  AMOUNT_ASC
  AMOUNT_DESC
}

"""
A condition to be used against \`Crop\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input CropCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`yield\` field."""
  yield: String

  """Checks for equality with the object’s \`amount\` field."""
  amount: Int
}

"""A connection to a list of \`Crop\` values."""
type CropsConnection {
  """A list of \`Crop\` objects."""
  nodes: [Crop]!

  """
  A list of edges which contains the \`Crop\` and cursor to aid in pagination.
  """
  edges: [CropsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Crop\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Crop\` edge in the connection."""
type CropsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Crop\` at the end of the edge."""
  node: Crop
}

"""Methods to use when ordering \`Material\`."""
enum MaterialsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  CLASS_ASC
  CLASS_DESC
  VALUE_OF_ASC
  VALUE_OF_DESC
}

"""
A condition to be used against \`Material\` object types. All fields are tested
for equality and combined with a logical ‘and.’
"""
input MaterialCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`class\` field."""
  class: String

  """Checks for equality with the object’s \`valueOf\` field."""
  valueOf: String
}

"""A connection to a list of \`Material\` values."""
type MaterialsConnection {
  """A list of \`Material\` objects."""
  nodes: [Material]!

  """
  A list of edges which contains the \`Material\` and cursor to aid in pagination.
  """
  edges: [MaterialsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Material\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Material\` edge in the connection."""
type MaterialsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Material\` at the end of the edge."""
  node: Material
}

"""Methods to use when ordering \`Null\`."""
enum NullsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  HAS_OWN_PROPERTY_ASC
  HAS_OWN_PROPERTY_DESC
  BREAK_ASC
  BREAK_DESC
}

"""
A condition to be used against \`Null\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input NullCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`hasOwnProperty\` field."""
  hasOwnProperty: String

  """Checks for equality with the object’s \`break\` field."""
  break: String
}

"""A connection to a list of \`Null\` values."""
type NullsConnection {
  """A list of \`Null\` objects."""
  nodes: [Null]!

  """
  A list of edges which contains the \`Null\` and cursor to aid in pagination.
  """
  edges: [NullsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Null\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Null\` edge in the connection."""
type NullsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Null\` at the end of the edge."""
  node: Null
}

"""Methods to use when ordering \`Project\`."""
enum ProjectsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  BRAND_ASC
  BRAND_DESC
  _PROTO_ASC
  _PROTO_DESC
}

"""
A condition to be used against \`Project\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input ProjectCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`brand\` field."""
  brand: String

  """Checks for equality with the object’s \`_proto__\` field."""
  _proto__: String
}

"""A connection to a list of \`Project\` values."""
type ProjectsConnection {
  """A list of \`Project\` objects."""
  nodes: [Project]!

  """
  A list of edges which contains the \`Project\` and cursor to aid in pagination.
  """
  edges: [ProjectsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Project\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Project\` edge in the connection."""
type ProjectsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Project\` at the end of the edge."""
  node: Project
}

"""Methods to use when ordering \`RelationalStatus\`."""
enum RelationalStatusesOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  DESCRIPTION_ASC
  DESCRIPTION_DESC
  NOTE_ASC
  NOTE_DESC
  TYPE_ASC
  TYPE_DESC
  CONSTRUCTOR_ASC
  CONSTRUCTOR_DESC
}

"""
A condition to be used against \`RelationalStatus\` object types. All fields are
tested for equality and combined with a logical ‘and.’
"""
input RelationalStatusCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`description\` field."""
  description: String

  """Checks for equality with the object’s \`note\` field."""
  note: String

  """Checks for equality with the object’s \`type\` field."""
  type: ItemType

  """Checks for equality with the object’s \`constructor\` field."""
  constructor: String
}

"""A connection to a list of \`RelationalStatus\` values."""
type RelationalStatusesConnection {
  """A list of \`RelationalStatus\` objects."""
  nodes: [RelationalStatus]!

  """
  A list of edges which contains the \`RelationalStatus\` and cursor to aid in pagination.
  """
  edges: [RelationalStatusesEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """
  The count of *all* \`RelationalStatus\` you could get from the connection.
  """
  totalCount: Int!
}

"""A \`RelationalStatus\` edge in the connection."""
type RelationalStatusesEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`RelationalStatus\` at the end of the edge."""
  node: RelationalStatus
}

"""Methods to use when ordering \`Yield\`."""
enum YieldsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  CROP_ASC
  CROP_DESC
  EXPORT_ASC
  EXPORT_DESC
}

"""
A condition to be used against \`Yield\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input YieldCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`crop\` field."""
  crop: String

  """Checks for equality with the object’s \`export\` field."""
  export: String
}

"""A connection to a list of \`Yield\` values."""
type YieldsConnection {
  """A list of \`Yield\` objects."""
  nodes: [Yield]!

  """
  A list of edges which contains the \`Yield\` and cursor to aid in pagination.
  """
  edges: [YieldsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Yield\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Yield\` edge in the connection."""
type YieldsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Yield\` at the end of the edge."""
  node: Yield
}

"""Methods to use when ordering \`Reserved\`."""
enum ReservedsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  NULL_ASC
  NULL_DESC
  CASE_ASC
  CASE_DESC
  DO_ASC
  DO_DESC
}

"""
A condition to be used against \`Reserved\` object types. All fields are tested
for equality and combined with a logical ‘and.’
"""
input ReservedCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`null\` field."""
  null: String

  """Checks for equality with the object’s \`case\` field."""
  case: String

  """Checks for equality with the object’s \`do\` field."""
  do: String
}

"""A connection to a list of \`Reserved\` values."""
type ReservedsConnection {
  """A list of \`Reserved\` objects."""
  nodes: [Reserved]!

  """
  A list of edges which contains the \`Reserved\` and cursor to aid in pagination.
  """
  edges: [ReservedsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Reserved\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Reserved\` edge in the connection."""
type ReservedsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Reserved\` at the end of the edge."""
  node: Reserved
}

"""
The root mutation type which contains root level fields which mutate data.
"""
type Mutation {
  """Creates a single \`_Proto__\`."""
  createProto__(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateProtoInput!
  ): CreateProtoPayload

  """Creates a single \`Building\`."""
  createBuilding(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateBuildingInput!
  ): CreateBuildingPayload

  """Creates a single \`Constructor\`."""
  createConstructor(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateConstructorInput!
  ): CreateConstructorPayload

  """Creates a single \`Crop\`."""
  createCrop(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateCropInput!
  ): CreateCropPayload

  """Creates a single \`Machine\`."""
  createMachine(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateMachineInput!
  ): CreateMachinePayload

  """Creates a single \`Material\`."""
  createMaterial(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateMaterialInput!
  ): CreateMaterialPayload

  """Creates a single \`Null\`."""
  createNull(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateNullInput!
  ): CreateNullPayload

  """Creates a single \`Project\`."""
  createProject(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateProjectInput!
  ): CreateProjectPayload

  """Creates a single \`Yield\`."""
  createYield(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateYieldInput!
  ): CreateYieldPayload

  """Creates a single \`Reserved\`."""
  createReserved(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateReservedInput!
  ): CreateReservedPayload

  """Updates a single \`_Proto__\` using its globally unique id and a patch."""
  updateProto__(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateProtoInput!
  ): UpdateProtoPayload

  """Updates a single \`_Proto__\` using a unique key and a patch."""
  updateProtoById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateProtoByIdInput!
  ): UpdateProtoPayload

  """Updates a single \`_Proto__\` using a unique key and a patch."""
  updateProtoByName(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateProtoByNameInput!
  ): UpdateProtoPayload

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

  """Updates a single \`Building\` using a unique key and a patch."""
  updateBuildingByConstructor(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateBuildingByConstructorInput!
  ): UpdateBuildingPayload

  """
  Updates a single \`Constructor\` using its globally unique id and a patch.
  """
  updateConstructor(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateConstructorInput!
  ): UpdateConstructorPayload

  """Updates a single \`Constructor\` using a unique key and a patch."""
  updateConstructorById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateConstructorByIdInput!
  ): UpdateConstructorPayload

  """Updates a single \`Constructor\` using a unique key and a patch."""
  updateConstructorByExport(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateConstructorByExportInput!
  ): UpdateConstructorPayload

  """Updates a single \`Constructor\` using a unique key and a patch."""
  updateConstructorByName(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateConstructorByNameInput!
  ): UpdateConstructorPayload

  """Updates a single \`Crop\` using its globally unique id and a patch."""
  updateCrop(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateCropInput!
  ): UpdateCropPayload

  """Updates a single \`Crop\` using a unique key and a patch."""
  updateCropById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateCropByIdInput!
  ): UpdateCropPayload

  """Updates a single \`Crop\` using a unique key and a patch."""
  updateCropByYield(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateCropByYieldInput!
  ): UpdateCropPayload

  """Updates a single \`Machine\` using its globally unique id and a patch."""
  updateMachine(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateMachineInput!
  ): UpdateMachinePayload

  """Updates a single \`Machine\` using a unique key and a patch."""
  updateMachineById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateMachineByIdInput!
  ): UpdateMachinePayload

  """Updates a single \`Material\` using its globally unique id and a patch."""
  updateMaterial(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateMaterialInput!
  ): UpdateMaterialPayload

  """Updates a single \`Material\` using a unique key and a patch."""
  updateMaterialById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateMaterialByIdInput!
  ): UpdateMaterialPayload

  """Updates a single \`Material\` using a unique key and a patch."""
  updateMaterialByClass(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateMaterialByClassInput!
  ): UpdateMaterialPayload

  """Updates a single \`Material\` using a unique key and a patch."""
  updateMaterialByValueOf(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateMaterialByValueOfInput!
  ): UpdateMaterialPayload

  """Updates a single \`Null\` using its globally unique id and a patch."""
  updateNull(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateNullInput!
  ): UpdateNullPayload

  """Updates a single \`Null\` using a unique key and a patch."""
  updateNullById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateNullByIdInput!
  ): UpdateNullPayload

  """Updates a single \`Null\` using a unique key and a patch."""
  updateNullByBreak(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateNullByBreakInput!
  ): UpdateNullPayload

  """Updates a single \`Null\` using a unique key and a patch."""
  updateNullByHasOwnProperty(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateNullByHasOwnPropertyInput!
  ): UpdateNullPayload

  """Updates a single \`Project\` using its globally unique id and a patch."""
  updateProject(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateProjectInput!
  ): UpdateProjectPayload

  """Updates a single \`Project\` using a unique key and a patch."""
  updateProjectById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateProjectByIdInput!
  ): UpdateProjectPayload

  """Updates a single \`Project\` using a unique key and a patch."""
  updateProjectByProto__(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateProjectByProtoInput!
  ): UpdateProjectPayload

  """Updates a single \`Yield\` using its globally unique id and a patch."""
  updateYield(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateYieldInput!
  ): UpdateYieldPayload

  """Updates a single \`Yield\` using a unique key and a patch."""
  updateYieldById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateYieldByIdInput!
  ): UpdateYieldPayload

  """Updates a single \`Yield\` using a unique key and a patch."""
  updateYieldByExport(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateYieldByExportInput!
  ): UpdateYieldPayload

  """Updates a single \`Reserved\` using its globally unique id and a patch."""
  updateReserved(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateReservedInput!
  ): UpdateReservedPayload

  """Updates a single \`Reserved\` using a unique key and a patch."""
  updateReservedById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateReservedByIdInput!
  ): UpdateReservedPayload

  """Updates a single \`Reserved\` using a unique key and a patch."""
  updateReservedByCase(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateReservedByCaseInput!
  ): UpdateReservedPayload

  """Updates a single \`Reserved\` using a unique key and a patch."""
  updateReservedByDo(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateReservedByDoInput!
  ): UpdateReservedPayload

  """Updates a single \`Reserved\` using a unique key and a patch."""
  updateReservedByNull(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateReservedByNullInput!
  ): UpdateReservedPayload

  """Deletes a single \`_Proto__\` using its globally unique id."""
  deleteProto__(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteProtoInput!
  ): DeleteProtoPayload

  """Deletes a single \`_Proto__\` using a unique key."""
  deleteProtoById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteProtoByIdInput!
  ): DeleteProtoPayload

  """Deletes a single \`_Proto__\` using a unique key."""
  deleteProtoByName(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteProtoByNameInput!
  ): DeleteProtoPayload

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

  """Deletes a single \`Building\` using a unique key."""
  deleteBuildingByConstructor(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteBuildingByConstructorInput!
  ): DeleteBuildingPayload

  """Deletes a single \`Constructor\` using its globally unique id."""
  deleteConstructor(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteConstructorInput!
  ): DeleteConstructorPayload

  """Deletes a single \`Constructor\` using a unique key."""
  deleteConstructorById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteConstructorByIdInput!
  ): DeleteConstructorPayload

  """Deletes a single \`Constructor\` using a unique key."""
  deleteConstructorByExport(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteConstructorByExportInput!
  ): DeleteConstructorPayload

  """Deletes a single \`Constructor\` using a unique key."""
  deleteConstructorByName(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteConstructorByNameInput!
  ): DeleteConstructorPayload

  """Deletes a single \`Crop\` using its globally unique id."""
  deleteCrop(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteCropInput!
  ): DeleteCropPayload

  """Deletes a single \`Crop\` using a unique key."""
  deleteCropById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteCropByIdInput!
  ): DeleteCropPayload

  """Deletes a single \`Crop\` using a unique key."""
  deleteCropByYield(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteCropByYieldInput!
  ): DeleteCropPayload

  """Deletes a single \`Machine\` using its globally unique id."""
  deleteMachine(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteMachineInput!
  ): DeleteMachinePayload

  """Deletes a single \`Machine\` using a unique key."""
  deleteMachineById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteMachineByIdInput!
  ): DeleteMachinePayload

  """Deletes a single \`Material\` using its globally unique id."""
  deleteMaterial(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteMaterialInput!
  ): DeleteMaterialPayload

  """Deletes a single \`Material\` using a unique key."""
  deleteMaterialById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteMaterialByIdInput!
  ): DeleteMaterialPayload

  """Deletes a single \`Material\` using a unique key."""
  deleteMaterialByClass(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteMaterialByClassInput!
  ): DeleteMaterialPayload

  """Deletes a single \`Material\` using a unique key."""
  deleteMaterialByValueOf(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteMaterialByValueOfInput!
  ): DeleteMaterialPayload

  """Deletes a single \`Null\` using its globally unique id."""
  deleteNull(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteNullInput!
  ): DeleteNullPayload

  """Deletes a single \`Null\` using a unique key."""
  deleteNullById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteNullByIdInput!
  ): DeleteNullPayload

  """Deletes a single \`Null\` using a unique key."""
  deleteNullByBreak(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteNullByBreakInput!
  ): DeleteNullPayload

  """Deletes a single \`Null\` using a unique key."""
  deleteNullByHasOwnProperty(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteNullByHasOwnPropertyInput!
  ): DeleteNullPayload

  """Deletes a single \`Project\` using its globally unique id."""
  deleteProject(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteProjectInput!
  ): DeleteProjectPayload

  """Deletes a single \`Project\` using a unique key."""
  deleteProjectById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteProjectByIdInput!
  ): DeleteProjectPayload

  """Deletes a single \`Project\` using a unique key."""
  deleteProjectByProto__(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteProjectByProtoInput!
  ): DeleteProjectPayload

  """Deletes a single \`Yield\` using its globally unique id."""
  deleteYield(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteYieldInput!
  ): DeleteYieldPayload

  """Deletes a single \`Yield\` using a unique key."""
  deleteYieldById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteYieldByIdInput!
  ): DeleteYieldPayload

  """Deletes a single \`Yield\` using a unique key."""
  deleteYieldByExport(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteYieldByExportInput!
  ): DeleteYieldPayload

  """Deletes a single \`Reserved\` using its globally unique id."""
  deleteReserved(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteReservedInput!
  ): DeleteReservedPayload

  """Deletes a single \`Reserved\` using a unique key."""
  deleteReservedById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteReservedByIdInput!
  ): DeleteReservedPayload

  """Deletes a single \`Reserved\` using a unique key."""
  deleteReservedByCase(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteReservedByCaseInput!
  ): DeleteReservedPayload

  """Deletes a single \`Reserved\` using a unique key."""
  deleteReservedByDo(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteReservedByDoInput!
  ): DeleteReservedPayload

  """Deletes a single \`Reserved\` using a unique key."""
  deleteReservedByNull(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteReservedByNullInput!
  ): DeleteReservedPayload
}

"""The output of our create \`_Proto__\` mutation."""
type CreateProtoPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`_Proto__\` that was created by this mutation."""
  _proto__: _Proto__

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`_Proto__\`. May be used by Relay 1."""
  _protoEdge(
    """The method to use when ordering \`_Proto__\`."""
    orderBy: [_ProtoSOrderBy!]! = [PRIMARY_KEY_ASC]
  ): _Proto__SEdge
}

"""All input for the create \`_Proto__\` mutation."""
input CreateProtoInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`_Proto__\` to be created by this mutation."""
  _proto__: _Proto__Input!
}

"""An input for mutations affecting \`_Proto__\`"""
input _Proto__Input {
  id: Int
  name: String
  brand: String
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
  name: String
  constructor: String
}

"""The output of our create \`Constructor\` mutation."""
type CreateConstructorPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Constructor\` that was created by this mutation."""
  constructor: Constructor

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Constructor\`. May be used by Relay 1."""
  constructorEdge(
    """The method to use when ordering \`Constructor\`."""
    orderBy: [ConstructorsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ConstructorsEdge
}

"""All input for the create \`Constructor\` mutation."""
input CreateConstructorInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`Constructor\` to be created by this mutation."""
  constructor: ConstructorInput!
}

"""An input for mutations affecting \`Constructor\`"""
input ConstructorInput {
  id: Int
  name: String
  export: String
}

"""The output of our create \`Crop\` mutation."""
type CreateCropPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Crop\` that was created by this mutation."""
  crop: Crop

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Crop\`. May be used by Relay 1."""
  cropEdge(
    """The method to use when ordering \`Crop\`."""
    orderBy: [CropsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): CropsEdge
}

"""All input for the create \`Crop\` mutation."""
input CreateCropInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`Crop\` to be created by this mutation."""
  crop: CropInput!
}

"""An input for mutations affecting \`Crop\`"""
input CropInput {
  id: Int
  yield: String
  amount: Int
}

"""The output of our create \`Machine\` mutation."""
type CreateMachinePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Machine\` that was created by this mutation."""
  machine: Machine

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Machine\`. May be used by Relay 1."""
  machineEdge(
    """The method to use when ordering \`Machine\`."""
    orderBy: [MachinesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): MachinesEdge

  """Reads a single \`Building\` that is related to this \`Machine\`."""
  buildingByConstructor: Building
}

"""All input for the create \`Machine\` mutation."""
input CreateMachineInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`Machine\` to be created by this mutation."""
  machine: MachineInput!
}

"""An input for mutations affecting \`Machine\`"""
input MachineInput {
  id: Int
  input: String
  constructor: String
}

"""The output of our create \`Material\` mutation."""
type CreateMaterialPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Material\` that was created by this mutation."""
  material: Material

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Material\`. May be used by Relay 1."""
  materialEdge(
    """The method to use when ordering \`Material\`."""
    orderBy: [MaterialsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): MaterialsEdge
}

"""All input for the create \`Material\` mutation."""
input CreateMaterialInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`Material\` to be created by this mutation."""
  material: MaterialInput!
}

"""An input for mutations affecting \`Material\`"""
input MaterialInput {
  id: Int
  class: String
  valueOf: String
}

"""The output of our create \`Null\` mutation."""
type CreateNullPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Null\` that was created by this mutation."""
  null: Null

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Null\`. May be used by Relay 1."""
  nullEdge(
    """The method to use when ordering \`Null\`."""
    orderBy: [NullsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): NullsEdge
}

"""All input for the create \`Null\` mutation."""
input CreateNullInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`Null\` to be created by this mutation."""
  null: NullInput!
}

"""An input for mutations affecting \`Null\`"""
input NullInput {
  id: Int
  hasOwnProperty: String
  break: String
}

"""The output of our create \`Project\` mutation."""
type CreateProjectPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Project\` that was created by this mutation."""
  project: Project

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Project\`. May be used by Relay 1."""
  projectEdge(
    """The method to use when ordering \`Project\`."""
    orderBy: [ProjectsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ProjectsEdge
}

"""All input for the create \`Project\` mutation."""
input CreateProjectInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`Project\` to be created by this mutation."""
  project: ProjectInput!
}

"""An input for mutations affecting \`Project\`"""
input ProjectInput {
  id: Int
  brand: String
  _proto__: String
}

"""The output of our create \`Yield\` mutation."""
type CreateYieldPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Yield\` that was created by this mutation."""
  yield: Yield

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Yield\`. May be used by Relay 1."""
  yieldEdge(
    """The method to use when ordering \`Yield\`."""
    orderBy: [YieldsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): YieldsEdge
}

"""All input for the create \`Yield\` mutation."""
input CreateYieldInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`Yield\` to be created by this mutation."""
  yield: YieldInput!
}

"""An input for mutations affecting \`Yield\`"""
input YieldInput {
  id: Int
  crop: String
  export: String
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
    orderBy: [ReservedsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ReservedsEdge
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
  id: Int
  null: String
  case: String
  do: String
}

"""The output of our update \`_Proto__\` mutation."""
type UpdateProtoPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`_Proto__\` that was updated by this mutation."""
  _proto__: _Proto__

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`_Proto__\`. May be used by Relay 1."""
  _protoEdge(
    """The method to use when ordering \`_Proto__\`."""
    orderBy: [_ProtoSOrderBy!]! = [PRIMARY_KEY_ASC]
  ): _Proto__SEdge
}

"""All input for the \`updateProto__\` mutation."""
input UpdateProtoInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`_Proto__\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`_Proto__\` being updated.
  """
  _protoPatch: _ProtoPatch!
}

"""
Represents an update to a \`_Proto__\`. Fields that are set will be updated.
"""
input _ProtoPatch {
  id: Int
  name: String
  brand: String
}

"""All input for the \`updateProtoById\` mutation."""
input UpdateProtoByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`_Proto__\` being updated.
  """
  _protoPatch: _ProtoPatch!
}

"""All input for the \`updateProtoByName\` mutation."""
input UpdateProtoByNameInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  name: String!

  """
  An object where the defined keys will be set on the \`_Proto__\` being updated.
  """
  _protoPatch: _ProtoPatch!
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
  name: String
  constructor: String
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

"""All input for the \`updateBuildingByConstructor\` mutation."""
input UpdateBuildingByConstructorInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  constructor: String!

  """
  An object where the defined keys will be set on the \`Building\` being updated.
  """
  buildingPatch: BuildingPatch!
}

"""The output of our update \`Constructor\` mutation."""
type UpdateConstructorPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Constructor\` that was updated by this mutation."""
  constructor: Constructor

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Constructor\`. May be used by Relay 1."""
  constructorEdge(
    """The method to use when ordering \`Constructor\`."""
    orderBy: [ConstructorsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ConstructorsEdge
}

"""All input for the \`updateConstructor\` mutation."""
input UpdateConstructorInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Constructor\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`Constructor\` being updated.
  """
  constructorPatch: ConstructorPatch!
}

"""
Represents an update to a \`Constructor\`. Fields that are set will be updated.
"""
input ConstructorPatch {
  id: Int
  name: String
  export: String
}

"""All input for the \`updateConstructorById\` mutation."""
input UpdateConstructorByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`Constructor\` being updated.
  """
  constructorPatch: ConstructorPatch!
}

"""All input for the \`updateConstructorByExport\` mutation."""
input UpdateConstructorByExportInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  export: String!

  """
  An object where the defined keys will be set on the \`Constructor\` being updated.
  """
  constructorPatch: ConstructorPatch!
}

"""All input for the \`updateConstructorByName\` mutation."""
input UpdateConstructorByNameInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  name: String!

  """
  An object where the defined keys will be set on the \`Constructor\` being updated.
  """
  constructorPatch: ConstructorPatch!
}

"""The output of our update \`Crop\` mutation."""
type UpdateCropPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Crop\` that was updated by this mutation."""
  crop: Crop

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Crop\`. May be used by Relay 1."""
  cropEdge(
    """The method to use when ordering \`Crop\`."""
    orderBy: [CropsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): CropsEdge
}

"""All input for the \`updateCrop\` mutation."""
input UpdateCropInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Crop\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`Crop\` being updated.
  """
  cropPatch: CropPatch!
}

"""Represents an update to a \`Crop\`. Fields that are set will be updated."""
input CropPatch {
  id: Int
  yield: String
  amount: Int
}

"""All input for the \`updateCropById\` mutation."""
input UpdateCropByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`Crop\` being updated.
  """
  cropPatch: CropPatch!
}

"""All input for the \`updateCropByYield\` mutation."""
input UpdateCropByYieldInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  yield: String!

  """
  An object where the defined keys will be set on the \`Crop\` being updated.
  """
  cropPatch: CropPatch!
}

"""The output of our update \`Machine\` mutation."""
type UpdateMachinePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Machine\` that was updated by this mutation."""
  machine: Machine

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Machine\`. May be used by Relay 1."""
  machineEdge(
    """The method to use when ordering \`Machine\`."""
    orderBy: [MachinesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): MachinesEdge

  """Reads a single \`Building\` that is related to this \`Machine\`."""
  buildingByConstructor: Building
}

"""All input for the \`updateMachine\` mutation."""
input UpdateMachineInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Machine\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`Machine\` being updated.
  """
  machinePatch: MachinePatch!
}

"""
Represents an update to a \`Machine\`. Fields that are set will be updated.
"""
input MachinePatch {
  id: Int
  input: String
  constructor: String
}

"""All input for the \`updateMachineById\` mutation."""
input UpdateMachineByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`Machine\` being updated.
  """
  machinePatch: MachinePatch!
}

"""The output of our update \`Material\` mutation."""
type UpdateMaterialPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Material\` that was updated by this mutation."""
  material: Material

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Material\`. May be used by Relay 1."""
  materialEdge(
    """The method to use when ordering \`Material\`."""
    orderBy: [MaterialsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): MaterialsEdge
}

"""All input for the \`updateMaterial\` mutation."""
input UpdateMaterialInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Material\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`Material\` being updated.
  """
  materialPatch: MaterialPatch!
}

"""
Represents an update to a \`Material\`. Fields that are set will be updated.
"""
input MaterialPatch {
  id: Int
  class: String
  valueOf: String
}

"""All input for the \`updateMaterialById\` mutation."""
input UpdateMaterialByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`Material\` being updated.
  """
  materialPatch: MaterialPatch!
}

"""All input for the \`updateMaterialByClass\` mutation."""
input UpdateMaterialByClassInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  class: String!

  """
  An object where the defined keys will be set on the \`Material\` being updated.
  """
  materialPatch: MaterialPatch!
}

"""All input for the \`updateMaterialByValueOf\` mutation."""
input UpdateMaterialByValueOfInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  valueOf: String!

  """
  An object where the defined keys will be set on the \`Material\` being updated.
  """
  materialPatch: MaterialPatch!
}

"""The output of our update \`Null\` mutation."""
type UpdateNullPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Null\` that was updated by this mutation."""
  null: Null

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Null\`. May be used by Relay 1."""
  nullEdge(
    """The method to use when ordering \`Null\`."""
    orderBy: [NullsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): NullsEdge
}

"""All input for the \`updateNull\` mutation."""
input UpdateNullInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Null\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`Null\` being updated.
  """
  nullPatch: NullPatch!
}

"""Represents an update to a \`Null\`. Fields that are set will be updated."""
input NullPatch {
  id: Int
  hasOwnProperty: String
  break: String
}

"""All input for the \`updateNullById\` mutation."""
input UpdateNullByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`Null\` being updated.
  """
  nullPatch: NullPatch!
}

"""All input for the \`updateNullByBreak\` mutation."""
input UpdateNullByBreakInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  break: String!

  """
  An object where the defined keys will be set on the \`Null\` being updated.
  """
  nullPatch: NullPatch!
}

"""All input for the \`updateNullByHasOwnProperty\` mutation."""
input UpdateNullByHasOwnPropertyInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  hasOwnProperty: String!

  """
  An object where the defined keys will be set on the \`Null\` being updated.
  """
  nullPatch: NullPatch!
}

"""The output of our update \`Project\` mutation."""
type UpdateProjectPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Project\` that was updated by this mutation."""
  project: Project

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Project\`. May be used by Relay 1."""
  projectEdge(
    """The method to use when ordering \`Project\`."""
    orderBy: [ProjectsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ProjectsEdge
}

"""All input for the \`updateProject\` mutation."""
input UpdateProjectInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Project\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`Project\` being updated.
  """
  projectPatch: ProjectPatch!
}

"""
Represents an update to a \`Project\`. Fields that are set will be updated.
"""
input ProjectPatch {
  id: Int
  brand: String
  _proto__: String
}

"""All input for the \`updateProjectById\` mutation."""
input UpdateProjectByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`Project\` being updated.
  """
  projectPatch: ProjectPatch!
}

"""All input for the \`updateProjectByProto__\` mutation."""
input UpdateProjectByProtoInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  _proto__: String!

  """
  An object where the defined keys will be set on the \`Project\` being updated.
  """
  projectPatch: ProjectPatch!
}

"""The output of our update \`Yield\` mutation."""
type UpdateYieldPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Yield\` that was updated by this mutation."""
  yield: Yield

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Yield\`. May be used by Relay 1."""
  yieldEdge(
    """The method to use when ordering \`Yield\`."""
    orderBy: [YieldsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): YieldsEdge
}

"""All input for the \`updateYield\` mutation."""
input UpdateYieldInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Yield\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`Yield\` being updated.
  """
  yieldPatch: YieldPatch!
}

"""
Represents an update to a \`Yield\`. Fields that are set will be updated.
"""
input YieldPatch {
  id: Int
  crop: String
  export: String
}

"""All input for the \`updateYieldById\` mutation."""
input UpdateYieldByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`Yield\` being updated.
  """
  yieldPatch: YieldPatch!
}

"""All input for the \`updateYieldByExport\` mutation."""
input UpdateYieldByExportInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  export: String!

  """
  An object where the defined keys will be set on the \`Yield\` being updated.
  """
  yieldPatch: YieldPatch!
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
    orderBy: [ReservedsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ReservedsEdge
}

"""All input for the \`updateReserved\` mutation."""
input UpdateReservedInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Reserved\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`Reserved\` being updated.
  """
  reservedPatch: ReservedPatch!
}

"""
Represents an update to a \`Reserved\`. Fields that are set will be updated.
"""
input ReservedPatch {
  id: Int
  null: String
  case: String
  do: String
}

"""All input for the \`updateReservedById\` mutation."""
input UpdateReservedByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`Reserved\` being updated.
  """
  reservedPatch: ReservedPatch!
}

"""All input for the \`updateReservedByCase\` mutation."""
input UpdateReservedByCaseInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  case: String!

  """
  An object where the defined keys will be set on the \`Reserved\` being updated.
  """
  reservedPatch: ReservedPatch!
}

"""All input for the \`updateReservedByDo\` mutation."""
input UpdateReservedByDoInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  do: String!

  """
  An object where the defined keys will be set on the \`Reserved\` being updated.
  """
  reservedPatch: ReservedPatch!
}

"""All input for the \`updateReservedByNull\` mutation."""
input UpdateReservedByNullInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  null: String!

  """
  An object where the defined keys will be set on the \`Reserved\` being updated.
  """
  reservedPatch: ReservedPatch!
}

"""The output of our delete \`_Proto__\` mutation."""
type DeleteProtoPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`_Proto__\` that was deleted by this mutation."""
  _proto__: _Proto__
  deletedProtoId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`_Proto__\`. May be used by Relay 1."""
  _protoEdge(
    """The method to use when ordering \`_Proto__\`."""
    orderBy: [_ProtoSOrderBy!]! = [PRIMARY_KEY_ASC]
  ): _Proto__SEdge
}

"""All input for the \`deleteProto__\` mutation."""
input DeleteProtoInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`_Proto__\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteProtoById\` mutation."""
input DeleteProtoByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!
}

"""All input for the \`deleteProtoByName\` mutation."""
input DeleteProtoByNameInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  name: String!
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
}

"""All input for the \`deleteBuildingByConstructor\` mutation."""
input DeleteBuildingByConstructorInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  constructor: String!
}

"""The output of our delete \`Constructor\` mutation."""
type DeleteConstructorPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Constructor\` that was deleted by this mutation."""
  constructor: Constructor
  deletedConstructorId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Constructor\`. May be used by Relay 1."""
  constructorEdge(
    """The method to use when ordering \`Constructor\`."""
    orderBy: [ConstructorsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ConstructorsEdge
}

"""All input for the \`deleteConstructor\` mutation."""
input DeleteConstructorInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Constructor\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteConstructorById\` mutation."""
input DeleteConstructorByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!
}

"""All input for the \`deleteConstructorByExport\` mutation."""
input DeleteConstructorByExportInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  export: String!
}

"""All input for the \`deleteConstructorByName\` mutation."""
input DeleteConstructorByNameInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  name: String!
}

"""The output of our delete \`Crop\` mutation."""
type DeleteCropPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Crop\` that was deleted by this mutation."""
  crop: Crop
  deletedCropId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Crop\`. May be used by Relay 1."""
  cropEdge(
    """The method to use when ordering \`Crop\`."""
    orderBy: [CropsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): CropsEdge
}

"""All input for the \`deleteCrop\` mutation."""
input DeleteCropInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Crop\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteCropById\` mutation."""
input DeleteCropByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!
}

"""All input for the \`deleteCropByYield\` mutation."""
input DeleteCropByYieldInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  yield: String!
}

"""The output of our delete \`Machine\` mutation."""
type DeleteMachinePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Machine\` that was deleted by this mutation."""
  machine: Machine
  deletedMachineId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Machine\`. May be used by Relay 1."""
  machineEdge(
    """The method to use when ordering \`Machine\`."""
    orderBy: [MachinesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): MachinesEdge

  """Reads a single \`Building\` that is related to this \`Machine\`."""
  buildingByConstructor: Building
}

"""All input for the \`deleteMachine\` mutation."""
input DeleteMachineInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Machine\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteMachineById\` mutation."""
input DeleteMachineByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!
}

"""The output of our delete \`Material\` mutation."""
type DeleteMaterialPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Material\` that was deleted by this mutation."""
  material: Material
  deletedMaterialId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Material\`. May be used by Relay 1."""
  materialEdge(
    """The method to use when ordering \`Material\`."""
    orderBy: [MaterialsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): MaterialsEdge
}

"""All input for the \`deleteMaterial\` mutation."""
input DeleteMaterialInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Material\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteMaterialById\` mutation."""
input DeleteMaterialByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!
}

"""All input for the \`deleteMaterialByClass\` mutation."""
input DeleteMaterialByClassInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  class: String!
}

"""All input for the \`deleteMaterialByValueOf\` mutation."""
input DeleteMaterialByValueOfInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  valueOf: String!
}

"""The output of our delete \`Null\` mutation."""
type DeleteNullPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Null\` that was deleted by this mutation."""
  null: Null
  deletedNullId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Null\`. May be used by Relay 1."""
  nullEdge(
    """The method to use when ordering \`Null\`."""
    orderBy: [NullsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): NullsEdge
}

"""All input for the \`deleteNull\` mutation."""
input DeleteNullInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Null\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteNullById\` mutation."""
input DeleteNullByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!
}

"""All input for the \`deleteNullByBreak\` mutation."""
input DeleteNullByBreakInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  break: String!
}

"""All input for the \`deleteNullByHasOwnProperty\` mutation."""
input DeleteNullByHasOwnPropertyInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  hasOwnProperty: String!
}

"""The output of our delete \`Project\` mutation."""
type DeleteProjectPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Project\` that was deleted by this mutation."""
  project: Project
  deletedProjectId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Project\`. May be used by Relay 1."""
  projectEdge(
    """The method to use when ordering \`Project\`."""
    orderBy: [ProjectsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ProjectsEdge
}

"""All input for the \`deleteProject\` mutation."""
input DeleteProjectInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Project\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteProjectById\` mutation."""
input DeleteProjectByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!
}

"""All input for the \`deleteProjectByProto__\` mutation."""
input DeleteProjectByProtoInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  _proto__: String!
}

"""The output of our delete \`Yield\` mutation."""
type DeleteYieldPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Yield\` that was deleted by this mutation."""
  yield: Yield
  deletedYieldId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Yield\`. May be used by Relay 1."""
  yieldEdge(
    """The method to use when ordering \`Yield\`."""
    orderBy: [YieldsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): YieldsEdge
}

"""All input for the \`deleteYield\` mutation."""
input DeleteYieldInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Yield\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteYieldById\` mutation."""
input DeleteYieldByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!
}

"""All input for the \`deleteYieldByExport\` mutation."""
input DeleteYieldByExportInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  export: String!
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
  deletedReservedId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Reserved\`. May be used by Relay 1."""
  reservedEdge(
    """The method to use when ordering \`Reserved\`."""
    orderBy: [ReservedsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ReservedsEdge
}

"""All input for the \`deleteReserved\` mutation."""
input DeleteReservedInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Reserved\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteReservedById\` mutation."""
input DeleteReservedByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!
}

"""All input for the \`deleteReservedByCase\` mutation."""
input DeleteReservedByCaseInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  case: String!
}

"""All input for the \`deleteReservedByDo\` mutation."""
input DeleteReservedByDoInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  do: String!
}

"""All input for the \`deleteReservedByNull\` mutation."""
input DeleteReservedByNullInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  null: String!
}`;
export const plans = {
  RelationalTopic: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = handler.plan($parent);
      return lambda(specifier, nodeIdCodecs[handler.codec.name].encode);
    },
    id($record) {
      return $record.get("id");
    },
    title($record) {
      return $record.get("title");
    },
    type($record) {
      return $record.get("type");
    },
    constructor($record) {
      return $record.get("constructor");
    },
    buildingByConstructor($record) {
      const $buildings = building_buildingPgResource.find();
      let previousAlias = $buildings.alias;
      const relational_itemsAlias = sql.identifier(Symbol("relational_items"));
      $buildings.join({
        type: "inner",
        from: relational_items_relational_itemsPgResource.from,
        alias: relational_itemsAlias,
        conditions: [sql`${previousAlias}.${sql.identifier("constructor")} = ${relational_itemsAlias}.${sql.identifier("constructor")}`]
      });
      previousAlias = relational_itemsAlias;
      $buildings.where(sql`${previousAlias}.${sql.identifier("id")} = ${$buildings.placeholder($record.get("id"))}`);
      return $buildings.single();
    },
    relationalTopicById($record) {
      const $relational_topics = pgResource_relational_topicsPgResource.find();
      let previousAlias = $relational_topics.alias;
      const relational_itemsAlias = sql.identifier(Symbol("relational_items"));
      $relational_topics.join({
        type: "inner",
        from: relational_items_relational_itemsPgResource.from,
        alias: relational_itemsAlias,
        conditions: [sql`${previousAlias}.${sql.identifier("id")} = ${relational_itemsAlias}.${sql.identifier("id")}`]
      });
      previousAlias = relational_itemsAlias;
      $relational_topics.where(sql`${previousAlias}.${sql.identifier("id")} = ${$relational_topics.placeholder($record.get("id"))}`);
      return $relational_topics.single();
    },
    relationalStatusById($record) {
      const $relational_statuses = relational_status_relational_statusPgResource.find();
      let previousAlias = $relational_statuses.alias;
      const relational_itemsAlias = sql.identifier(Symbol("relational_items"));
      $relational_statuses.join({
        type: "inner",
        from: relational_items_relational_itemsPgResource.from,
        alias: relational_itemsAlias,
        conditions: [sql`${previousAlias}.${sql.identifier("id")} = ${relational_itemsAlias}.${sql.identifier("id")}`]
      });
      previousAlias = relational_itemsAlias;
      $relational_statuses.where(sql`${previousAlias}.${sql.identifier("id")} = ${$relational_statuses.placeholder($record.get("id"))}`);
      return $relational_statuses.single();
    }
  },
  Building: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = handler2.plan($parent);
      return lambda(specifier, nodeIdCodecs[handler2.codec.name].encode);
    },
    id($record) {
      return $record.get("id");
    },
    name($record) {
      return $record.get("name");
    },
    constructor($record) {
      return $record.get("constructor");
    },
    machinesByConstructor: {
      plan($record) {
        return connection(otherSource_machinePgResource.find(specFromRecord($record)));
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
            applyOrderToPlan($select, $value, info.schema.getType("MachinesOrderBy"));
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
    machinesByConstructorList: {
      plan($record) {
        return otherSource_machinePgResource.find(specFromRecord($record));
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $select, val, info) {
            const $value = val.getRaw();
            applyOrderToPlan($select, $value, info.schema.getType("MachinesOrderBy"));
            return null;
          }
        },
        condition: {
          autoApplyAfterParentPlan: true,
          applyPlan(_condition, $select) {
            return $select.wherePlan();
          }
        }
      }
    },
    relationalItemsByConstructor: {
      plan($record) {
        return connection(relational_items_relational_itemsPgResource.find(specFromRecord2($record)));
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
            applyOrderToPlan($select, $value, info.schema.getType("RelationalItemsOrderBy"));
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
    relationalItemsByConstructorList: {
      plan($record) {
        return relational_items_relational_itemsPgResource.find(specFromRecord2($record));
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $select, val, info) {
            const $value = val.getRaw();
            applyOrderToPlan($select, $value, info.schema.getType("RelationalItemsOrderBy"));
            return null;
          }
        },
        condition: {
          autoApplyAfterParentPlan: true,
          applyPlan(_condition, $select) {
            return $select.wherePlan();
          }
        }
      }
    }
  },
  MachinesConnection: {
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
  Machine: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = handler3.plan($parent);
      return lambda(specifier, nodeIdCodecs[handler3.codec.name].encode);
    },
    id($record) {
      return $record.get("id");
    },
    input($record) {
      return $record.get("input");
    },
    constructor($record) {
      return $record.get("constructor");
    },
    buildingByConstructor($record) {
      return building_buildingPgResource.get(specFromRecord3($record));
    }
  },
  MachinesEdge: {
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
  MachinesOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        machineUniques[0].attributes.forEach(attributeName => {
          const attribute = machineCodec.attributes[attributeName];
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
        machineUniques[0].attributes.forEach(attributeName => {
          const attribute = machineCodec.attributes[attributeName];
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
    INPUT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "input",
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
    INPUT_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "input",
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
    CONSTRUCTOR_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "constructor",
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
    CONSTRUCTOR_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "constructor",
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
  MachineCondition: {
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_machine.attributes.id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    input: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "input",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "input",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_machine.attributes.input.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    constructor: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "constructor",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "constructor",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_machine.attributes.constructor.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  RelationalItemsConnection: {
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
  RelationalItemsEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  RelationalItemsOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        relational_itemsUniques[0].attributes.forEach(attributeName => {
          const attribute = relationalItemsCodec.attributes[attributeName];
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
        relational_itemsUniques[0].attributes.forEach(attributeName => {
          const attribute = relationalItemsCodec.attributes[attributeName];
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
    TYPE_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "type",
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
    TYPE_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "type",
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
    CONSTRUCTOR_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "constructor",
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
    CONSTRUCTOR_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "constructor",
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
  RelationalItemCondition: {
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalItems.attributes.id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    type: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "type",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "type",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalItems.attributes.type.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    constructor: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "constructor",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "constructor",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalItems.attributes.constructor.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  RelationalStatus: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = handler4.plan($parent);
      return lambda(specifier, nodeIdCodecs[handler4.codec.name].encode);
    },
    id($record) {
      return $record.get("id");
    },
    description($record) {
      return $record.get("description");
    },
    note($record) {
      return $record.get("note");
    },
    type($record) {
      return $record.get("type");
    },
    constructor($record) {
      return $record.get("constructor");
    },
    buildingByConstructor($record) {
      const $buildings = building_buildingPgResource.find();
      let previousAlias = $buildings.alias;
      const relational_itemsAlias = sql.identifier(Symbol("relational_items"));
      $buildings.join({
        type: "inner",
        from: relational_items_relational_itemsPgResource.from,
        alias: relational_itemsAlias,
        conditions: [sql`${previousAlias}.${sql.identifier("constructor")} = ${relational_itemsAlias}.${sql.identifier("constructor")}`]
      });
      previousAlias = relational_itemsAlias;
      $buildings.where(sql`${previousAlias}.${sql.identifier("id")} = ${$buildings.placeholder($record.get("id"))}`);
      return $buildings.single();
    },
    relationalTopicById($record) {
      const $relational_topics = pgResource_relational_topicsPgResource.find();
      let previousAlias = $relational_topics.alias;
      const relational_itemsAlias = sql.identifier(Symbol("relational_items"));
      $relational_topics.join({
        type: "inner",
        from: relational_items_relational_itemsPgResource.from,
        alias: relational_itemsAlias,
        conditions: [sql`${previousAlias}.${sql.identifier("id")} = ${relational_itemsAlias}.${sql.identifier("id")}`]
      });
      previousAlias = relational_itemsAlias;
      $relational_topics.where(sql`${previousAlias}.${sql.identifier("id")} = ${$relational_topics.placeholder($record.get("id"))}`);
      return $relational_topics.single();
    },
    relationalStatusById($record) {
      const $relational_statuses = relational_status_relational_statusPgResource.find();
      let previousAlias = $relational_statuses.alias;
      const relational_itemsAlias = sql.identifier(Symbol("relational_items"));
      $relational_statuses.join({
        type: "inner",
        from: relational_items_relational_itemsPgResource.from,
        alias: relational_itemsAlias,
        conditions: [sql`${previousAlias}.${sql.identifier("id")} = ${relational_itemsAlias}.${sql.identifier("id")}`]
      });
      previousAlias = relational_itemsAlias;
      $relational_statuses.where(sql`${previousAlias}.${sql.identifier("id")} = ${$relational_statuses.placeholder($record.get("id"))}`);
      return $relational_statuses.single();
    }
  },
  Query: {
    __assertStep() {
      return true;
    },
    query() {
      return rootValue();
    },
    nodeId($parent) {
      const specifier = handler5.plan($parent);
      return lambda(specifier, nodeIdCodecs[handler5.codec.name].encode);
    },
    node: {
      plan(_$root, args) {
        return node(nodeIdHandlerByTypeName, args.get("nodeId"));
      },
      args: {
        nodeId: undefined
      }
    },
    relationalTopicById: {
      plan(_$root, args) {
        return pgResource_relational_topicsPgResource.get({
          id: args.get("id")
        });
      },
      args: {
        id: undefined
      }
    },
    _protoById: {
      plan(_$root, args) {
        return pgResource___proto__PgResource.get({
          id: args.get("id")
        });
      },
      args: {
        id: undefined
      }
    },
    _protoByName: {
      plan(_$root, args) {
        return pgResource___proto__PgResource.get({
          name: args.get("name")
        });
      },
      args: {
        name: undefined
      }
    },
    buildingById: {
      plan(_$root, args) {
        return building_buildingPgResource.get({
          id: args.get("id")
        });
      },
      args: {
        id: undefined
      }
    },
    buildingByConstructor: {
      plan(_$root, args) {
        const spec = Object.create(null);
        for (const attributeName in detailsByAttributeName) {
          spec[attributeName] = args.get(detailsByAttributeName[attributeName].graphqlName);
        }
        return building_buildingPgResource.get(spec);
      },
      args: {
        constructor: undefined
      }
    },
    constructorById: {
      plan(_$root, args) {
        return pgResource_constructorPgResource.get({
          id: args.get("id")
        });
      },
      args: {
        id: undefined
      }
    },
    constructorByExport: {
      plan(_$root, args) {
        return pgResource_constructorPgResource.get({
          export: args.get("export")
        });
      },
      args: {
        export: undefined
      }
    },
    constructorByName: {
      plan(_$root, args) {
        return pgResource_constructorPgResource.get({
          name: args.get("name")
        });
      },
      args: {
        name: undefined
      }
    },
    cropById: {
      plan(_$root, args) {
        return pgResource_cropPgResource.get({
          id: args.get("id")
        });
      },
      args: {
        id: undefined
      }
    },
    cropByYield: {
      plan(_$root, args) {
        return pgResource_cropPgResource.get({
          yield: args.get("yield")
        });
      },
      args: {
        yield: undefined
      }
    },
    machineById: {
      plan(_$root, args) {
        return otherSource_machinePgResource.get({
          id: args.get("id")
        });
      },
      args: {
        id: undefined
      }
    },
    materialById: {
      plan(_$root, args) {
        return pgResource_materialPgResource.get({
          id: args.get("id")
        });
      },
      args: {
        id: undefined
      }
    },
    materialByClass: {
      plan(_$root, args) {
        return pgResource_materialPgResource.get({
          class: args.get("class")
        });
      },
      args: {
        class: undefined
      }
    },
    materialByValueOf: {
      plan(_$root, args) {
        const spec = Object.create(null);
        for (const attributeName in detailsByAttributeName2) {
          spec[attributeName] = args.get(detailsByAttributeName2[attributeName].graphqlName);
        }
        return pgResource_materialPgResource.get(spec);
      },
      args: {
        valueOf: undefined
      }
    },
    nullById: {
      plan(_$root, args) {
        return pgResource_nullPgResource.get({
          id: args.get("id")
        });
      },
      args: {
        id: undefined
      }
    },
    nullByBreak: {
      plan(_$root, args) {
        return pgResource_nullPgResource.get({
          break: args.get("break")
        });
      },
      args: {
        break: undefined
      }
    },
    nullByHasOwnProperty: {
      plan(_$root, args) {
        const spec = Object.create(null);
        for (const attributeName in detailsByAttributeName3) {
          spec[attributeName] = args.get(detailsByAttributeName3[attributeName].graphqlName);
        }
        return pgResource_nullPgResource.get(spec);
      },
      args: {
        hasOwnProperty: undefined
      }
    },
    projectById: {
      plan(_$root, args) {
        return pgResource_projectPgResource.get({
          id: args.get("id")
        });
      },
      args: {
        id: undefined
      }
    },
    projectByProto__: {
      plan(_$root, args) {
        const spec = Object.create(null);
        for (const attributeName in detailsByAttributeName4) {
          spec[attributeName] = args.get(detailsByAttributeName4[attributeName].graphqlName);
        }
        return pgResource_projectPgResource.get(spec);
      },
      args: {
        _proto__: undefined
      }
    },
    relationalStatusById: {
      plan(_$root, args) {
        return relational_status_relational_statusPgResource.get({
          id: args.get("id")
        });
      },
      args: {
        id: undefined
      }
    },
    yieldById: {
      plan(_$root, args) {
        return pgResource_yieldPgResource.get({
          id: args.get("id")
        });
      },
      args: {
        id: undefined
      }
    },
    yieldByExport: {
      plan(_$root, args) {
        return pgResource_yieldPgResource.get({
          export: args.get("export")
        });
      },
      args: {
        export: undefined
      }
    },
    reservedById: {
      plan(_$root, args) {
        return pgResource_reservedPgResource.get({
          id: args.get("id")
        });
      },
      args: {
        id: undefined
      }
    },
    reservedByCase: {
      plan(_$root, args) {
        return pgResource_reservedPgResource.get({
          case: args.get("case")
        });
      },
      args: {
        case: undefined
      }
    },
    reservedByDo: {
      plan(_$root, args) {
        return pgResource_reservedPgResource.get({
          do: args.get("do")
        });
      },
      args: {
        do: undefined
      }
    },
    reservedByNull: {
      plan(_$root, args) {
        return pgResource_reservedPgResource.get({
          null: args.get("null")
        });
      },
      args: {
        null: undefined
      }
    },
    await: {
      plan($root, args, _info) {
        const selectArgs = makeArgs(args);
        return resource_awaitPgResource.execute(selectArgs);
      },
      args: {
        yield: undefined,
        _proto__: undefined,
        constructor: undefined,
        hasOwnProperty: undefined
      }
    },
    case: {
      plan($root, args, _info) {
        const selectArgs = makeArgs2(args);
        return resource_casePgResource.execute(selectArgs);
      },
      args: {
        yield: undefined,
        _proto__: undefined,
        constructor: undefined,
        hasOwnProperty: undefined
      }
    },
    valueOf: {
      plan($root, args, _info) {
        const selectArgs = makeArgs3(args);
        return resource_valueOfPgResource.execute(selectArgs);
      },
      args: {
        yield: undefined,
        _proto__: undefined,
        constructor: undefined,
        hasOwnProperty: undefined
      }
    },
    relationalTopic: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    _proto__: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher2($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    building: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher3($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    constructor: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher4($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    crop: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher5($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    machine: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher6($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    material: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher7($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    null: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher8($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    project: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher9($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    relationalStatus: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher10($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    yield: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher11($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    reserved: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher12($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    allRelationalTopicsList: {
      plan() {
        return pgResource_relational_topicsPgResource.find();
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $select, val, info) {
            const $value = val.getRaw();
            applyOrderToPlan($select, $value, info.schema.getType("RelationalTopicsOrderBy"));
            return null;
          }
        },
        condition: {
          autoApplyAfterParentPlan: true,
          applyPlan(_condition, $select) {
            return $select.wherePlan();
          }
        }
      }
    },
    allRelationalTopics: {
      plan() {
        return connection(pgResource_relational_topicsPgResource.find());
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
            applyOrderToPlan($select, $value, info.schema.getType("RelationalTopicsOrderBy"));
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
    allProtoSList: {
      plan() {
        return pgResource___proto__PgResource.find();
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $select, val, info) {
            const $value = val.getRaw();
            applyOrderToPlan($select, $value, info.schema.getType("_ProtoSOrderBy"));
            return null;
          }
        },
        condition: {
          autoApplyAfterParentPlan: true,
          applyPlan(_condition, $select) {
            return $select.wherePlan();
          }
        }
      }
    },
    allProtoS: {
      plan() {
        return connection(pgResource___proto__PgResource.find());
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
            applyOrderToPlan($select, $value, info.schema.getType("_ProtoSOrderBy"));
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
    allBuildingsList: {
      plan() {
        return building_buildingPgResource.find();
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $select, val, info) {
            const $value = val.getRaw();
            applyOrderToPlan($select, $value, info.schema.getType("BuildingsOrderBy"));
            return null;
          }
        },
        condition: {
          autoApplyAfterParentPlan: true,
          applyPlan(_condition, $select) {
            return $select.wherePlan();
          }
        }
      }
    },
    allBuildings: {
      plan() {
        return connection(building_buildingPgResource.find());
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
    allConstructorsList: {
      plan() {
        return pgResource_constructorPgResource.find();
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $select, val, info) {
            const $value = val.getRaw();
            applyOrderToPlan($select, $value, info.schema.getType("ConstructorsOrderBy"));
            return null;
          }
        },
        condition: {
          autoApplyAfterParentPlan: true,
          applyPlan(_condition, $select) {
            return $select.wherePlan();
          }
        }
      }
    },
    allConstructors: {
      plan() {
        return connection(pgResource_constructorPgResource.find());
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
            applyOrderToPlan($select, $value, info.schema.getType("ConstructorsOrderBy"));
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
    allCropsList: {
      plan() {
        return pgResource_cropPgResource.find();
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $select, val, info) {
            const $value = val.getRaw();
            applyOrderToPlan($select, $value, info.schema.getType("CropsOrderBy"));
            return null;
          }
        },
        condition: {
          autoApplyAfterParentPlan: true,
          applyPlan(_condition, $select) {
            return $select.wherePlan();
          }
        }
      }
    },
    allCrops: {
      plan() {
        return connection(pgResource_cropPgResource.find());
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
            applyOrderToPlan($select, $value, info.schema.getType("CropsOrderBy"));
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
    allMachinesList: {
      plan() {
        return otherSource_machinePgResource.find();
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $select, val, info) {
            const $value = val.getRaw();
            applyOrderToPlan($select, $value, info.schema.getType("MachinesOrderBy"));
            return null;
          }
        },
        condition: {
          autoApplyAfterParentPlan: true,
          applyPlan(_condition, $select) {
            return $select.wherePlan();
          }
        }
      }
    },
    allMachines: {
      plan() {
        return connection(otherSource_machinePgResource.find());
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
            applyOrderToPlan($select, $value, info.schema.getType("MachinesOrderBy"));
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
    allMaterialsList: {
      plan() {
        return pgResource_materialPgResource.find();
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $select, val, info) {
            const $value = val.getRaw();
            applyOrderToPlan($select, $value, info.schema.getType("MaterialsOrderBy"));
            return null;
          }
        },
        condition: {
          autoApplyAfterParentPlan: true,
          applyPlan(_condition, $select) {
            return $select.wherePlan();
          }
        }
      }
    },
    allMaterials: {
      plan() {
        return connection(pgResource_materialPgResource.find());
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
            applyOrderToPlan($select, $value, info.schema.getType("MaterialsOrderBy"));
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
    allNullsList: {
      plan() {
        return pgResource_nullPgResource.find();
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $select, val, info) {
            const $value = val.getRaw();
            applyOrderToPlan($select, $value, info.schema.getType("NullsOrderBy"));
            return null;
          }
        },
        condition: {
          autoApplyAfterParentPlan: true,
          applyPlan(_condition, $select) {
            return $select.wherePlan();
          }
        }
      }
    },
    allNulls: {
      plan() {
        return connection(pgResource_nullPgResource.find());
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
            applyOrderToPlan($select, $value, info.schema.getType("NullsOrderBy"));
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
    allProjectsList: {
      plan() {
        return pgResource_projectPgResource.find();
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $select, val, info) {
            const $value = val.getRaw();
            applyOrderToPlan($select, $value, info.schema.getType("ProjectsOrderBy"));
            return null;
          }
        },
        condition: {
          autoApplyAfterParentPlan: true,
          applyPlan(_condition, $select) {
            return $select.wherePlan();
          }
        }
      }
    },
    allProjects: {
      plan() {
        return connection(pgResource_projectPgResource.find());
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
            applyOrderToPlan($select, $value, info.schema.getType("ProjectsOrderBy"));
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
    allRelationalStatusesList: {
      plan() {
        return relational_status_relational_statusPgResource.find();
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $select, val, info) {
            const $value = val.getRaw();
            applyOrderToPlan($select, $value, info.schema.getType("RelationalStatusesOrderBy"));
            return null;
          }
        },
        condition: {
          autoApplyAfterParentPlan: true,
          applyPlan(_condition, $select) {
            return $select.wherePlan();
          }
        }
      }
    },
    allRelationalStatuses: {
      plan() {
        return connection(relational_status_relational_statusPgResource.find());
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
            applyOrderToPlan($select, $value, info.schema.getType("RelationalStatusesOrderBy"));
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
    allYieldsList: {
      plan() {
        return pgResource_yieldPgResource.find();
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $select, val, info) {
            const $value = val.getRaw();
            applyOrderToPlan($select, $value, info.schema.getType("YieldsOrderBy"));
            return null;
          }
        },
        condition: {
          autoApplyAfterParentPlan: true,
          applyPlan(_condition, $select) {
            return $select.wherePlan();
          }
        }
      }
    },
    allYields: {
      plan() {
        return connection(pgResource_yieldPgResource.find());
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
            applyOrderToPlan($select, $value, info.schema.getType("YieldsOrderBy"));
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
    allReservedsList: {
      plan() {
        return pgResource_reservedPgResource.find();
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $select, val, info) {
            const $value = val.getRaw();
            applyOrderToPlan($select, $value, info.schema.getType("ReservedsOrderBy"));
            return null;
          }
        },
        condition: {
          autoApplyAfterParentPlan: true,
          applyPlan(_condition, $select) {
            return $select.wherePlan();
          }
        }
      }
    },
    allReserveds: {
      plan() {
        return connection(pgResource_reservedPgResource.find());
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
            applyOrderToPlan($select, $value, info.schema.getType("ReservedsOrderBy"));
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
    allRelationalItemsList: {
      plan() {
        return relational_items_relational_itemsPgResource.find();
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $select, val, info) {
            const $value = val.getRaw();
            applyOrderToPlan($select, $value, info.schema.getType("RelationalItemsOrderBy"));
            return null;
          }
        },
        condition: {
          autoApplyAfterParentPlan: true,
          applyPlan(_condition, $select) {
            return $select.wherePlan();
          }
        }
      }
    },
    allRelationalItems: {
      plan() {
        return connection(relational_items_relational_itemsPgResource.find());
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
            applyOrderToPlan($select, $value, info.schema.getType("RelationalItemsOrderBy"));
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
  _Proto__: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName._Proto__.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName._Proto__.codec.name].encode);
    },
    id($record) {
      return $record.get("id");
    },
    name($record) {
      return $record.get("name");
    },
    brand($record) {
      return $record.get("brand");
    }
  },
  Constructor: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.Constructor.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Constructor.codec.name].encode);
    },
    id($record) {
      return $record.get("id");
    },
    name($record) {
      return $record.get("name");
    },
    export($record) {
      return $record.get("export");
    }
  },
  Crop: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.Crop.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Crop.codec.name].encode);
    },
    id($record) {
      return $record.get("id");
    },
    yield($record) {
      return $record.get("yield");
    },
    amount($record) {
      return $record.get("amount");
    }
  },
  Material: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.Material.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Material.codec.name].encode);
    },
    id($record) {
      return $record.get("id");
    },
    class($record) {
      return $record.get("class");
    },
    valueOf($record) {
      return $record.get("valueOf");
    }
  },
  Null: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.Null.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Null.codec.name].encode);
    },
    yield: {
      plan($in, args, _info) {
        if (!hasRecord($in)) {
          throw new Error(`Invalid plan, exepcted 'PgSelectSingleStep', 'PgInsertSingleStep', 'PgUpdateSingleStep' or 'PgDeleteSingleStep', but found ${$in}`);
        }
        const extraSelectArgs = makeArgs4(args);
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
        if (resource_null_yieldPgResource.isUnique && !resource_null_yieldPgResource.codec.attributes && typeof resource_null_yieldPgResource.from === "function") {
          // This is a scalar computed attribute, let's inline the expression
          const placeholders = selectArgs.map((arg, i) => {
            if (i === 0) {
              return $row.getClassStep().alias;
            } else if ("pgCodec" in arg && arg.pgCodec) {
              return $row.placeholder(arg.step, arg.pgCodec);
            } else {
              return $row.placeholder(arg.step);
            }
          });
          return pgClassExpression($row, resource_null_yieldPgResource.codec)`${resource_null_yieldPgResource.from(...placeholders.map(placeholder => ({
            placeholder
          })))}`;
        }
        // PERF: or here, if scalar add select to `$row`?
        return resource_null_yieldPgResource.execute(selectArgs);
      },
      args: {
        yield: undefined,
        _proto__: undefined,
        constructor: undefined,
        valueOf: undefined
      }
    },
    id($record) {
      return $record.get("id");
    },
    hasOwnProperty($record) {
      return $record.get("hasOwnProperty");
    },
    break($record) {
      return $record.get("break");
    }
  },
  Project: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.Project.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Project.codec.name].encode);
    },
    id($record) {
      return $record.get("id");
    },
    brand($record) {
      return $record.get("brand");
    },
    _proto__($record) {
      return $record.get("__proto__");
    }
  },
  Yield: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.Yield.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Yield.codec.name].encode);
    },
    id($record) {
      return $record.get("id");
    },
    crop($record) {
      return $record.get("crop");
    },
    export($record) {
      return $record.get("export");
    }
  },
  Reserved: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.Reserved.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Reserved.codec.name].encode);
    },
    id($record) {
      return $record.get("id");
    },
    null($record) {
      return $record.get("null");
    },
    case($record) {
      return $record.get("case");
    },
    do($record) {
      return $record.get("do");
    }
  },
  RelationalTopicsOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        relational_topicsUniques[0].attributes.forEach(attributeName => {
          const attribute = relationalTopicsCodec.attributes[attributeName];
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
        relational_topicsUniques[0].attributes.forEach(attributeName => {
          const attribute = relationalTopicsCodec.attributes[attributeName];
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
    TITLE_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "title",
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
    TITLE_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "title",
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
    TYPE_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "type",
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
    TYPE_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "type",
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
    CONSTRUCTOR_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "constructor",
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
    CONSTRUCTOR_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "constructor",
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
  RelationalTopicCondition: {
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalTopics.attributes.id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    title: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "title",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "title",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalTopics.attributes.title.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    type: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "type",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "type",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalTopics.attributes.type.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    constructor: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "constructor",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "constructor",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalTopics.attributes.constructor.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  RelationalTopicsConnection: {
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
  RelationalTopicsEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  _ProtoSOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        __proto__Uniques[0].attributes.forEach(attributeName => {
          const attribute = __proto__Codec.attributes[attributeName];
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
        __proto__Uniques[0].attributes.forEach(attributeName => {
          const attribute = __proto__Codec.attributes[attributeName];
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
    },
    BRAND_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "brand",
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
    BRAND_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "brand",
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
  _ProtoCondition: {
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec___proto__.attributes.id.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec___proto__.attributes.name.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    brand: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "brand",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "brand",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec___proto__.attributes.brand.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  _Proto__SConnection: {
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
  _Proto__SEdge: {
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
        buildingUniques[0].attributes.forEach(attributeName => {
          const attribute = buildingCodec.attributes[attributeName];
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
        buildingUniques[0].attributes.forEach(attributeName => {
          const attribute = buildingCodec.attributes[attributeName];
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
    CONSTRUCTOR_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "constructor",
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
    CONSTRUCTOR_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "constructor",
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_building.attributes.id.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_building.attributes.name.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    constructor: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "constructor",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "constructor",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_building.attributes.constructor.codec)}`;
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
  BuildingsEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  ConstructorsOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        constructorUniques[0].attributes.forEach(attributeName => {
          const attribute = constructorCodec.attributes[attributeName];
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
        constructorUniques[0].attributes.forEach(attributeName => {
          const attribute = constructorCodec.attributes[attributeName];
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
    },
    EXPORT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "export",
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
    EXPORT_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "export",
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
  ConstructorCondition: {
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_constructor.attributes.id.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_constructor.attributes.name.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    export: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "export",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "export",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_constructor.attributes.export.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  ConstructorsConnection: {
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
  ConstructorsEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  CropsOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        cropUniques[0].attributes.forEach(attributeName => {
          const attribute = cropCodec.attributes[attributeName];
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
        cropUniques[0].attributes.forEach(attributeName => {
          const attribute = cropCodec.attributes[attributeName];
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
    YIELD_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "yield",
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
    YIELD_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "yield",
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
    AMOUNT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "amount",
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
    AMOUNT_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "amount",
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
  CropCondition: {
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_crop.attributes.id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    yield: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "yield",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "yield",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_crop.attributes.yield.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    amount: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "amount",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "amount",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_crop.attributes.amount.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CropsConnection: {
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
  CropsEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  MaterialsOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        materialUniques[0].attributes.forEach(attributeName => {
          const attribute = materialCodec.attributes[attributeName];
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
        materialUniques[0].attributes.forEach(attributeName => {
          const attribute = materialCodec.attributes[attributeName];
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
    CLASS_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "class",
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
    CLASS_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "class",
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
    VALUE_OF_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "valueOf",
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
    VALUE_OF_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "valueOf",
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
  MaterialCondition: {
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_material.attributes.id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    class: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "class",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "class",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_material.attributes.class.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    valueOf: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "valueOf",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "valueOf",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_material.attributes.valueOf.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  MaterialsConnection: {
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
  MaterialsEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  NullsOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        nullUniques[0].attributes.forEach(attributeName => {
          const attribute = nullCodec.attributes[attributeName];
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
        nullUniques[0].attributes.forEach(attributeName => {
          const attribute = nullCodec.attributes[attributeName];
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
    HAS_OWN_PROPERTY_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "hasOwnProperty",
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
    HAS_OWN_PROPERTY_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "hasOwnProperty",
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
    BREAK_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "break",
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
    BREAK_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "break",
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
  NullCondition: {
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_null.attributes.id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    hasOwnProperty: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "hasOwnProperty",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "hasOwnProperty",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_null.attributes.hasOwnProperty.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    break: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "break",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "break",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_null.attributes.break.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  NullsConnection: {
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
  NullsEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  ProjectsOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        projectUniques[0].attributes.forEach(attributeName => {
          const attribute = projectCodec.attributes[attributeName];
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
        projectUniques[0].attributes.forEach(attributeName => {
          const attribute = projectCodec.attributes[attributeName];
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
    BRAND_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "brand",
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
    BRAND_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "brand",
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
    _PROTO_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "__proto__",
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
    _PROTO_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "__proto__",
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
  ProjectCondition: {
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_project.attributes["id"].codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    brand: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "brand",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "brand",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_project.attributes["brand"].codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    _proto__: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "__proto__",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "__proto__",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_project.attributes["__proto__"].codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  ProjectsConnection: {
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
  ProjectsEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  RelationalStatusesOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        relational_statusUniques[0].attributes.forEach(attributeName => {
          const attribute = relationalStatusCodec.attributes[attributeName];
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
        relational_statusUniques[0].attributes.forEach(attributeName => {
          const attribute = relationalStatusCodec.attributes[attributeName];
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
    },
    NOTE_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "note",
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
    NOTE_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "note",
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
    TYPE_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "type",
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
    TYPE_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "type",
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
    CONSTRUCTOR_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "constructor",
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
    CONSTRUCTOR_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "constructor",
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
  RelationalStatusCondition: {
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalStatus.attributes.id.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalStatus.attributes.description.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    note: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "note",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "note",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalStatus.attributes.note.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    type: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "type",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "type",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalStatus.attributes.type.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    constructor: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "constructor",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "constructor",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalStatus.attributes.constructor.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  RelationalStatusesConnection: {
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
  RelationalStatusesEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  YieldsOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        yieldUniques[0].attributes.forEach(attributeName => {
          const attribute = yieldCodec.attributes[attributeName];
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
        yieldUniques[0].attributes.forEach(attributeName => {
          const attribute = yieldCodec.attributes[attributeName];
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
    CROP_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "crop",
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
    CROP_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "crop",
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
    EXPORT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "export",
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
    EXPORT_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "export",
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
  YieldCondition: {
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_yield.attributes.id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    crop: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "crop",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "crop",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_yield.attributes.crop.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    export: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "export",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "export",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_yield.attributes.export.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  YieldsConnection: {
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
  YieldsEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  ReservedsOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        reservedUniques[0].attributes.forEach(attributeName => {
          const attribute = reservedCodec.attributes[attributeName];
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
        reservedUniques[0].attributes.forEach(attributeName => {
          const attribute = reservedCodec.attributes[attributeName];
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
    NULL_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "null",
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
    NULL_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "null",
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
    CASE_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "case",
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
    CASE_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "case",
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
    DO_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "do",
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
    DO_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "do",
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
  ReservedCondition: {
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_reserved.attributes.id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    null: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "null",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "null",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_reserved.attributes.null.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    case: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "case",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "case",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_reserved.attributes.case.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    do: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "do",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "do",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_reserved.attributes.do.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  ReservedsConnection: {
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
  ReservedsEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  Mutation: {
    __assertStep: __ValueStep,
    createProto__: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource___proto__PgResource, Object.create(null))
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
    createBuilding: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(building_buildingPgResource, Object.create(null))
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
    createConstructor: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_constructorPgResource, Object.create(null))
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
    createCrop: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_cropPgResource, Object.create(null))
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
    createMachine: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(otherSource_machinePgResource, Object.create(null))
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
    createMaterial: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_materialPgResource, Object.create(null))
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
    createNull: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_nullPgResource, Object.create(null))
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
    createProject: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_projectPgResource, Object.create(null))
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
    createYield: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_yieldPgResource, Object.create(null))
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
    createReserved: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_reservedPgResource, Object.create(null))
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
    updateProto__: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource___proto__PgResource, specFromArgs(args))
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
    updateProtoById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource___proto__PgResource, {
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
    updateProtoByName: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource___proto__PgResource, {
            name: args.get(['input', "name"])
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
    updateBuilding: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(building_buildingPgResource, specFromArgs2(args))
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
    updateBuildingById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(building_buildingPgResource, {
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
    updateBuildingByConstructor: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(building_buildingPgResource, specFromArgs3(args))
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
    updateConstructor: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_constructorPgResource, specFromArgs4(args))
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
    updateConstructorById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_constructorPgResource, {
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
    updateConstructorByExport: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_constructorPgResource, {
            export: args.get(['input', "export"])
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
    updateConstructorByName: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_constructorPgResource, {
            name: args.get(['input', "name"])
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
    updateCrop: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_cropPgResource, specFromArgs5(args))
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
    updateCropById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_cropPgResource, {
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
    updateCropByYield: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_cropPgResource, {
            yield: args.get(['input', "yield"])
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
    updateMachine: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(otherSource_machinePgResource, specFromArgs6(args))
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
    updateMachineById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(otherSource_machinePgResource, {
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
    updateMaterial: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_materialPgResource, specFromArgs7(args))
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
    updateMaterialById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_materialPgResource, {
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
    updateMaterialByClass: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_materialPgResource, {
            class: args.get(['input', "class"])
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
    updateMaterialByValueOf: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_materialPgResource, specFromArgs8(args))
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
    updateNull: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_nullPgResource, specFromArgs9(args))
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
    updateNullById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_nullPgResource, {
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
    updateNullByBreak: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_nullPgResource, {
            break: args.get(['input', "break"])
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
    updateNullByHasOwnProperty: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_nullPgResource, specFromArgs10(args))
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
    updateProject: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_projectPgResource, specFromArgs11(args))
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
    updateProjectById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_projectPgResource, {
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
    updateProjectByProto__: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_projectPgResource, specFromArgs12(args))
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
    updateYield: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_yieldPgResource, specFromArgs13(args))
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
    updateYieldById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_yieldPgResource, {
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
    updateYieldByExport: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_yieldPgResource, {
            export: args.get(['input', "export"])
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
    updateReserved: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_reservedPgResource, specFromArgs14(args))
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
    updateReservedById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_reservedPgResource, {
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
    updateReservedByCase: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_reservedPgResource, {
            case: args.get(['input', "case"])
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
    updateReservedByDo: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_reservedPgResource, {
            do: args.get(['input', "do"])
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
    updateReservedByNull: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_reservedPgResource, {
            null: args.get(['input', "null"])
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
    deleteProto__: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource___proto__PgResource, specFromArgs15(args))
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
    deleteProtoById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource___proto__PgResource, {
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
    deleteProtoByName: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource___proto__PgResource, {
            name: args.get(['input', "name"])
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
    deleteBuilding: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(building_buildingPgResource, specFromArgs16(args))
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
    deleteBuildingById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(building_buildingPgResource, {
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
    deleteBuildingByConstructor: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(building_buildingPgResource, specFromArgs17(args))
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
    deleteConstructor: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_constructorPgResource, specFromArgs18(args))
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
    deleteConstructorById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_constructorPgResource, {
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
    deleteConstructorByExport: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_constructorPgResource, {
            export: args.get(['input', "export"])
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
    deleteConstructorByName: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_constructorPgResource, {
            name: args.get(['input', "name"])
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
    deleteCrop: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_cropPgResource, specFromArgs19(args))
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
    deleteCropById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_cropPgResource, {
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
    deleteCropByYield: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_cropPgResource, {
            yield: args.get(['input', "yield"])
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
    deleteMachine: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(otherSource_machinePgResource, specFromArgs20(args))
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
    deleteMachineById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(otherSource_machinePgResource, {
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
    deleteMaterial: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_materialPgResource, specFromArgs21(args))
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
    deleteMaterialById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_materialPgResource, {
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
    deleteMaterialByClass: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_materialPgResource, {
            class: args.get(['input', "class"])
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
    deleteMaterialByValueOf: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_materialPgResource, specFromArgs22(args))
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
    deleteNull: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_nullPgResource, specFromArgs23(args))
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
    deleteNullById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_nullPgResource, {
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
    deleteNullByBreak: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_nullPgResource, {
            break: args.get(['input', "break"])
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
    deleteNullByHasOwnProperty: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_nullPgResource, specFromArgs24(args))
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
    deleteProject: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_projectPgResource, specFromArgs25(args))
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
    deleteProjectById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_projectPgResource, {
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
    deleteProjectByProto__: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_projectPgResource, specFromArgs26(args))
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
    deleteYield: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_yieldPgResource, specFromArgs27(args))
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
    deleteYieldById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_yieldPgResource, {
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
    deleteYieldByExport: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_yieldPgResource, {
            export: args.get(['input', "export"])
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
    deleteReserved: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_reservedPgResource, specFromArgs28(args))
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
    deleteReservedById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_reservedPgResource, {
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
    deleteReservedByCase: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_reservedPgResource, {
            case: args.get(['input', "case"])
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
    deleteReservedByDo: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_reservedPgResource, {
            do: args.get(['input', "do"])
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
    deleteReservedByNull: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_reservedPgResource, {
            null: args.get(['input', "null"])
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
  CreateProtoPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    _proto__($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    _protoEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = __proto__Uniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource___proto__PgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("_ProtoSOrderBy"));
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
  CreateProtoInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    _proto__: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  _Proto__Input: {
    "__inputPlan": function _Proto__Input_inputPlan() {
      return object(Object.create(null));
    },
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
    },
    brand: {
      applyPlan($insert, val) {
        $insert.set("brand", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreateBuildingPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    building($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
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
            const spec = buildingUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return building_buildingPgResource.find(spec);
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
    }
  },
  CreateBuildingInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    building: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  BuildingInput: {
    "__inputPlan": function BuildingInput_inputPlan() {
      return object(Object.create(null));
    },
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
    },
    constructor: {
      applyPlan($insert, val) {
        $insert.set("constructor", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreateConstructorPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    constructor($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    constructorEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = constructorUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_constructorPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("ConstructorsOrderBy"));
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
  CreateConstructorInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    constructor: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  ConstructorInput: {
    "__inputPlan": function ConstructorInput_inputPlan() {
      return object(Object.create(null));
    },
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
    },
    export: {
      applyPlan($insert, val) {
        $insert.set("export", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreateCropPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    crop($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    cropEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = cropUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_cropPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("CropsOrderBy"));
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
  CreateCropInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    crop: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  CropInput: {
    "__inputPlan": function CropInput_inputPlan() {
      return object(Object.create(null));
    },
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    yield: {
      applyPlan($insert, val) {
        $insert.set("yield", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    amount: {
      applyPlan($insert, val) {
        $insert.set("amount", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreateMachinePayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    machine($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    machineEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = machineUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return otherSource_machinePgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("MachinesOrderBy"));
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
    buildingByConstructor($in) {
      const $record = $in.get("result");
      return building_buildingPgResource.get(specFromRecord4($record));
    }
  },
  CreateMachineInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    machine: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  MachineInput: {
    "__inputPlan": function MachineInput_inputPlan() {
      return object(Object.create(null));
    },
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    input: {
      applyPlan($insert, val) {
        $insert.set("input", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    constructor: {
      applyPlan($insert, val) {
        $insert.set("constructor", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreateMaterialPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    material($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    materialEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = materialUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_materialPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("MaterialsOrderBy"));
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
  CreateMaterialInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    material: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  MaterialInput: {
    "__inputPlan": function MaterialInput_inputPlan() {
      return object(Object.create(null));
    },
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    class: {
      applyPlan($insert, val) {
        $insert.set("class", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    valueOf: {
      applyPlan($insert, val) {
        $insert.set("valueOf", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreateNullPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    null($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    nullEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = nullUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_nullPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("NullsOrderBy"));
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
  CreateNullInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    null: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  NullInput: {
    "__inputPlan": function NullInput_inputPlan() {
      return object(Object.create(null));
    },
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    hasOwnProperty: {
      applyPlan($insert, val) {
        $insert.set("hasOwnProperty", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    break: {
      applyPlan($insert, val) {
        $insert.set("break", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreateProjectPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    project($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    projectEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = projectUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_projectPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("ProjectsOrderBy"));
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
  CreateProjectInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    project: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  ProjectInput: {
    "__inputPlan": function ProjectInput_inputPlan() {
      return object(Object.create(null));
    },
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    brand: {
      applyPlan($insert, val) {
        $insert.set("brand", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    _proto__: {
      applyPlan($insert, val) {
        $insert.set("__proto__", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreateYieldPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    yield($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    yieldEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = yieldUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_yieldPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("YieldsOrderBy"));
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
  CreateYieldInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    yield: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  YieldInput: {
    "__inputPlan": function YieldInput_inputPlan() {
      return object(Object.create(null));
    },
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    crop: {
      applyPlan($insert, val) {
        $insert.set("crop", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    export: {
      applyPlan($insert, val) {
        $insert.set("export", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreateReservedPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    reserved($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    reservedEdge: {
      plan($mutation, args, info) {
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
            return pgResource_reservedPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("ReservedsOrderBy"));
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
  CreateReservedInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    reserved: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  ReservedInput: {
    "__inputPlan": function ReservedInput_inputPlan() {
      return object(Object.create(null));
    },
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    null: {
      applyPlan($insert, val) {
        $insert.set("null", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    case: {
      applyPlan($insert, val) {
        $insert.set("case", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    do: {
      applyPlan($insert, val) {
        $insert.set("do", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateProtoPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    _proto__($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    _protoEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = __proto__Uniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource___proto__PgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("_ProtoSOrderBy"));
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
  UpdateProtoInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined,
    _protoPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  _ProtoPatch: {
    "__inputPlan": function _ProtoPatch_inputPlan() {
      return object(Object.create(null));
    },
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
    },
    brand: {
      applyPlan($insert, val) {
        $insert.set("brand", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateProtoByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined,
    _protoPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  UpdateProtoByNameInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    name: undefined,
    _protoPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  UpdateBuildingPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    building($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
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
            const spec = buildingUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return building_buildingPgResource.find(spec);
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
    }
  },
  UpdateBuildingInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined,
    buildingPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  BuildingPatch: {
    "__inputPlan": function BuildingPatch_inputPlan() {
      return object(Object.create(null));
    },
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
    },
    constructor: {
      applyPlan($insert, val) {
        $insert.set("constructor", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateBuildingByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined,
    buildingPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  UpdateBuildingByConstructorInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    constructor: undefined,
    buildingPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  UpdateConstructorPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    constructor($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    constructorEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = constructorUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_constructorPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("ConstructorsOrderBy"));
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
  UpdateConstructorInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined,
    constructorPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  ConstructorPatch: {
    "__inputPlan": function ConstructorPatch_inputPlan() {
      return object(Object.create(null));
    },
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
    },
    export: {
      applyPlan($insert, val) {
        $insert.set("export", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateConstructorByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined,
    constructorPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  UpdateConstructorByExportInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    export: undefined,
    constructorPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  UpdateConstructorByNameInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    name: undefined,
    constructorPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  UpdateCropPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    crop($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    cropEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = cropUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_cropPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("CropsOrderBy"));
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
  UpdateCropInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined,
    cropPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  CropPatch: {
    "__inputPlan": function CropPatch_inputPlan() {
      return object(Object.create(null));
    },
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    yield: {
      applyPlan($insert, val) {
        $insert.set("yield", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    amount: {
      applyPlan($insert, val) {
        $insert.set("amount", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateCropByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined,
    cropPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  UpdateCropByYieldInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    yield: undefined,
    cropPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  UpdateMachinePayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    machine($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    machineEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = machineUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return otherSource_machinePgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("MachinesOrderBy"));
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
    buildingByConstructor($in) {
      const $record = $in.get("result");
      return building_buildingPgResource.get(specFromRecord5($record));
    }
  },
  UpdateMachineInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined,
    machinePatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  MachinePatch: {
    "__inputPlan": function MachinePatch_inputPlan() {
      return object(Object.create(null));
    },
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    input: {
      applyPlan($insert, val) {
        $insert.set("input", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    constructor: {
      applyPlan($insert, val) {
        $insert.set("constructor", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateMachineByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined,
    machinePatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  UpdateMaterialPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    material($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    materialEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = materialUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_materialPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("MaterialsOrderBy"));
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
  UpdateMaterialInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined,
    materialPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  MaterialPatch: {
    "__inputPlan": function MaterialPatch_inputPlan() {
      return object(Object.create(null));
    },
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    class: {
      applyPlan($insert, val) {
        $insert.set("class", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    valueOf: {
      applyPlan($insert, val) {
        $insert.set("valueOf", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateMaterialByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined,
    materialPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  UpdateMaterialByClassInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    class: undefined,
    materialPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  UpdateMaterialByValueOfInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    valueOf: undefined,
    materialPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  UpdateNullPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    null($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    nullEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = nullUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_nullPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("NullsOrderBy"));
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
  UpdateNullInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined,
    nullPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  NullPatch: {
    "__inputPlan": function NullPatch_inputPlan() {
      return object(Object.create(null));
    },
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    hasOwnProperty: {
      applyPlan($insert, val) {
        $insert.set("hasOwnProperty", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    break: {
      applyPlan($insert, val) {
        $insert.set("break", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateNullByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined,
    nullPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  UpdateNullByBreakInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    break: undefined,
    nullPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  UpdateNullByHasOwnPropertyInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    hasOwnProperty: undefined,
    nullPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  UpdateProjectPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    project($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    projectEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = projectUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_projectPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("ProjectsOrderBy"));
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
  UpdateProjectInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined,
    projectPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  ProjectPatch: {
    "__inputPlan": function ProjectPatch_inputPlan() {
      return object(Object.create(null));
    },
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    brand: {
      applyPlan($insert, val) {
        $insert.set("brand", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    _proto__: {
      applyPlan($insert, val) {
        $insert.set("__proto__", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateProjectByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined,
    projectPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  UpdateProjectByProtoInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    _proto__: undefined,
    projectPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  UpdateYieldPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    yield($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    yieldEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = yieldUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_yieldPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("YieldsOrderBy"));
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
  UpdateYieldInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined,
    yieldPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  YieldPatch: {
    "__inputPlan": function YieldPatch_inputPlan() {
      return object(Object.create(null));
    },
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    crop: {
      applyPlan($insert, val) {
        $insert.set("crop", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    export: {
      applyPlan($insert, val) {
        $insert.set("export", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateYieldByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined,
    yieldPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  UpdateYieldByExportInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    export: undefined,
    yieldPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  UpdateReservedPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    reserved($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    reservedEdge: {
      plan($mutation, args, info) {
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
            return pgResource_reservedPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("ReservedsOrderBy"));
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
  UpdateReservedInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined,
    reservedPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  ReservedPatch: {
    "__inputPlan": function ReservedPatch_inputPlan() {
      return object(Object.create(null));
    },
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    null: {
      applyPlan($insert, val) {
        $insert.set("null", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    case: {
      applyPlan($insert, val) {
        $insert.set("case", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    do: {
      applyPlan($insert, val) {
        $insert.set("do", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateReservedByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined,
    reservedPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  UpdateReservedByCaseInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    case: undefined,
    reservedPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  UpdateReservedByDoInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    do: undefined,
    reservedPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  UpdateReservedByNullInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    null: undefined,
    reservedPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  DeleteProtoPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    _proto__($object) {
      return $object.get("result");
    },
    deletedProtoId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName._Proto__.plan($record);
      return lambda(specifier, handler_codec_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    _protoEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = __proto__Uniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource___proto__PgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("_ProtoSOrderBy"));
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
  DeleteProtoInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined
  },
  DeleteProtoByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined
  },
  DeleteProtoByNameInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    name: undefined
  },
  DeleteBuildingPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    building($object) {
      return $object.get("result");
    },
    deletedBuildingId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = handler2.plan($record);
      return lambda(specifier, handler_codec_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
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
            const spec = buildingUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return building_buildingPgResource.find(spec);
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
    }
  },
  DeleteBuildingInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined
  },
  DeleteBuildingByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined
  },
  DeleteBuildingByConstructorInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    constructor: undefined
  },
  DeleteConstructorPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    constructor($object) {
      return $object.get("result");
    },
    deletedConstructorId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.Constructor.plan($record);
      return lambda(specifier, handler_codec_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    constructorEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = constructorUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_constructorPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("ConstructorsOrderBy"));
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
  DeleteConstructorInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined
  },
  DeleteConstructorByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined
  },
  DeleteConstructorByExportInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    export: undefined
  },
  DeleteConstructorByNameInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    name: undefined
  },
  DeleteCropPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    crop($object) {
      return $object.get("result");
    },
    deletedCropId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.Crop.plan($record);
      return lambda(specifier, handler_codec_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    cropEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = cropUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_cropPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("CropsOrderBy"));
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
  DeleteCropInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined
  },
  DeleteCropByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined
  },
  DeleteCropByYieldInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    yield: undefined
  },
  DeleteMachinePayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    machine($object) {
      return $object.get("result");
    },
    deletedMachineId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = handler3.plan($record);
      return lambda(specifier, handler_codec_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    machineEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = machineUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return otherSource_machinePgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("MachinesOrderBy"));
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
    buildingByConstructor($in) {
      const $record = $in.get("result");
      return building_buildingPgResource.get(specFromRecord6($record));
    }
  },
  DeleteMachineInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined
  },
  DeleteMachineByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined
  },
  DeleteMaterialPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    material($object) {
      return $object.get("result");
    },
    deletedMaterialId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.Material.plan($record);
      return lambda(specifier, handler_codec_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    materialEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = materialUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_materialPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("MaterialsOrderBy"));
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
  DeleteMaterialInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined
  },
  DeleteMaterialByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined
  },
  DeleteMaterialByClassInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    class: undefined
  },
  DeleteMaterialByValueOfInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    valueOf: undefined
  },
  DeleteNullPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    null($object) {
      return $object.get("result");
    },
    deletedNullId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.Null.plan($record);
      return lambda(specifier, handler_codec_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    nullEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = nullUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_nullPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("NullsOrderBy"));
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
  DeleteNullInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined
  },
  DeleteNullByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined
  },
  DeleteNullByBreakInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    break: undefined
  },
  DeleteNullByHasOwnPropertyInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    hasOwnProperty: undefined
  },
  DeleteProjectPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    project($object) {
      return $object.get("result");
    },
    deletedProjectId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.Project.plan($record);
      return lambda(specifier, handler_codec_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    projectEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = projectUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_projectPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("ProjectsOrderBy"));
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
  DeleteProjectInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined
  },
  DeleteProjectByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined
  },
  DeleteProjectByProtoInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    _proto__: undefined
  },
  DeleteYieldPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    yield($object) {
      return $object.get("result");
    },
    deletedYieldId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.Yield.plan($record);
      return lambda(specifier, handler_codec_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    yieldEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = yieldUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_yieldPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("YieldsOrderBy"));
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
  DeleteYieldInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined
  },
  DeleteYieldByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined
  },
  DeleteYieldByExportInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    export: undefined
  },
  DeleteReservedPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    reserved($object) {
      return $object.get("result");
    },
    deletedReservedId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.Reserved.plan($record);
      return lambda(specifier, handler_codec_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    reservedEdge: {
      plan($mutation, args, info) {
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
            return pgResource_reservedPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("ReservedsOrderBy"));
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
  DeleteReservedInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined
  },
  DeleteReservedByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined
  },
  DeleteReservedByCaseInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    case: undefined
  },
  DeleteReservedByDoInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    do: undefined
  },
  DeleteReservedByNullInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    null: undefined
  }
};
export const schema = makeGrafastSchema({
  typeDefs: typeDefs,
  plans: plans
});
