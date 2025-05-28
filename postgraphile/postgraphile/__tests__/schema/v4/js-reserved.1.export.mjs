import { PgDeleteSingleStep, PgExecutor, PgSelectSingleStep, TYPES, assertPgClassSingleStep, enumCodec, makeRegistry, pgClassExpression, pgDeleteSingle, pgFromExpression, pgInsertSingle, pgSelectFromRecord, pgSelectSingleFromRecord, pgUpdateSingle, recordCodec, sqlFromArgDigests, sqlValueWithCodec } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ObjectStep, __ValueStep, access, assertEdgeCapableStep, assertExecutableStep, assertPageInfoCapableStep, bakedInput, bakedInputRuntime, connection, constant, context, createObjectAndApplyChildren, first, get as get2, inhibitOnNull, inspect, lambda, list, makeDecodeNodeId, makeGrafastSchema, object, rootValue, specFromNodeId, stepAMayDependOnStepB } from "grafast";
import { GraphQLError, Kind } from "graphql";
import { sql } from "pg-sql2";
const pkCols = ["id"];
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
    tags: {
      __proto__: null
    }
  }
});
const spec_relationalTopics = {
  name: "relationalTopics",
  identifier: relationalTopicsIdentifier,
  attributes: {
    __proto__: null,
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
  },
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "js_reserved",
      name: "relational_topics"
    },
    tags: {
      __proto__: null
    },
    relationalInterfaceCodecName: "relationalItems"
  },
  executor: executor
};
const relationalTopicsCodec = recordCodec(spec_relationalTopics);
const __proto__Identifier = sql.identifier("js_reserved", "__proto__");
const __proto__Codec = recordCodec({
  name: "__proto__",
  identifier: __proto__Identifier,
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
  },
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "js_reserved",
      name: "__proto__"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const buildingIdentifier = sql.identifier("js_reserved", "building");
const buildingCodec = recordCodec({
  name: "building",
  identifier: buildingIdentifier,
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
  },
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "js_reserved",
      name: "building"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const constructorIdentifier = sql.identifier("js_reserved", "constructor");
const constructorCodec = recordCodec({
  name: "constructor",
  identifier: constructorIdentifier,
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
  },
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "js_reserved",
      name: "constructor"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const cropIdentifier = sql.identifier("js_reserved", "crop");
const cropCodec = recordCodec({
  name: "crop",
  identifier: cropIdentifier,
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
  },
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "js_reserved",
      name: "crop"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const machineIdentifier = sql.identifier("js_reserved", "machine");
const machineCodec = recordCodec({
  name: "machine",
  identifier: machineIdentifier,
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
  },
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "js_reserved",
      name: "machine"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const materialIdentifier = sql.identifier("js_reserved", "material");
const materialCodec = recordCodec({
  name: "material",
  identifier: materialIdentifier,
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
  },
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "js_reserved",
      name: "material"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const nullIdentifier = sql.identifier("js_reserved", "null");
const nullCodec = recordCodec({
  name: "null",
  identifier: nullIdentifier,
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
  },
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "js_reserved",
      name: "null"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const projectIdentifier = sql.identifier("js_reserved", "project");
const projectCodec = recordCodec({
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
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const relationalStatusIdentifier = sql.identifier("js_reserved", "relational_status");
const relationalStatusCodec = recordCodec({
  name: "relationalStatus",
  identifier: relationalStatusIdentifier,
  attributes: {
    __proto__: null,
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
  },
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "js_reserved",
      name: "relational_status"
    },
    tags: {
      __proto__: null
    },
    relationalInterfaceCodecName: "relationalItems"
  },
  executor: executor
});
const yieldIdentifier = sql.identifier("js_reserved", "yield");
const yieldCodec = recordCodec({
  name: "yield",
  identifier: yieldIdentifier,
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
  },
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "js_reserved",
      name: "yield"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const reservedIdentifier = sql.identifier("js_reserved", "reserved");
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
  },
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "js_reserved",
      name: "reserved"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const relationalItemsIdentifier = sql.identifier("js_reserved", "relational_items");
const spec_relationalItems = {
  name: "relationalItems",
  identifier: relationalItemsIdentifier,
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
  },
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "js_reserved",
      name: "relational_items"
    },
    tags: {
      __proto__: null,
      interface: "mode:relational type:type",
      type: ["TOPIC references:relational_topics", "STATUS references:relational_status"]
    }
  },
  executor: executor,
  polymorphism: {
    mode: "relational",
    typeAttributes: ["type"],
    types: {
      __proto__: null,
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
    }
  }
};
const relationalItemsCodec = recordCodec(spec_relationalItems);
const awaitFunctionIdentifer = sql.identifier("js_reserved", "await");
const caseFunctionIdentifer = sql.identifier("js_reserved", "case");
const valueOfFunctionIdentifer = sql.identifier("js_reserved", "valueOf");
const null_yieldFunctionIdentifer = sql.identifier("js_reserved", "null_yield");
const registryConfig_pgResources_relational_topics_relational_topics = {
  executor: executor,
  name: "relational_topics",
  identifier: "main.js_reserved.relational_topics",
  from: relationalTopicsIdentifier,
  codec: relationalTopicsCodec,
  uniques: [{
    isPrimary: true,
    attributes: pkCols,
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
      schemaName: "js_reserved",
      name: "relational_topics"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {}
  }
};
const __proto__Uniques = [{
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
const buildingUniques = [{
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
  attributes: ["constructor"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
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
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {}
  }
};
const constructorUniques = [{
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
  attributes: ["export"],
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
const cropUniques = [{
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
  attributes: ["yield"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const machineUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
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
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {}
  }
};
const materialUniques = [{
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
  attributes: ["class"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}, {
  isPrimary: false,
  attributes: ["valueOf"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const nullUniques = [{
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
  attributes: ["break"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}, {
  isPrimary: false,
  attributes: ["hasOwnProperty"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const projectUniques = [{
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
  attributes: ["__proto__"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const relational_statusUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
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
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {}
  }
};
const yieldUniques = [{
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
  attributes: ["export"],
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
}, {
  isPrimary: false,
  attributes: ["case"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}, {
  isPrimary: false,
  attributes: ["do"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}, {
  isPrimary: false,
  attributes: ["null"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const relational_itemsUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
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
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {
      interface: "mode:relational type:type",
      type: spec_relationalItems.extensions.tags.type
    }
  }
};
const registryConfig = {
  pgExecutors: {
    __proto__: null,
    main: executor
  },
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
    hasImplicitOrder: false,
    extensions: {
      pg: {
        serviceName: "main",
        schemaName: "js_reserved",
        name: "await"
      },
      tags: {}
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
    hasImplicitOrder: false,
    extensions: {
      pg: {
        serviceName: "main",
        schemaName: "js_reserved",
        name: "case"
      },
      tags: {}
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
    hasImplicitOrder: false,
    extensions: {
      pg: {
        serviceName: "main",
        schemaName: "js_reserved",
        name: "valueOf"
      },
      tags: {}
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
    hasImplicitOrder: false,
    extensions: {
      pg: {
        serviceName: "main",
        schemaName: "js_reserved",
        name: "null_yield"
      },
      tags: {}
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
      isInsertable: true,
      isUpdatable: true,
      isDeletable: true,
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
      isInsertable: true,
      isUpdatable: true,
      isDeletable: true,
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
      isInsertable: true,
      isUpdatable: true,
      isDeletable: true,
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
      isInsertable: true,
      isUpdatable: true,
      isDeletable: true,
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
      isInsertable: true,
      isUpdatable: true,
      isDeletable: true,
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
      isInsertable: true,
      isUpdatable: true,
      isDeletable: true,
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
      isInsertable: true,
      isUpdatable: true,
      isDeletable: true,
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
      isInsertable: true,
      isUpdatable: true,
      isDeletable: true,
      tags: {}
    }
  }], ["relational_items", registryConfig_pgResources_relational_items_relational_items]]),
  pgRelations: {
    __proto__: null,
    building: {
      __proto__: null,
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
    },
    machine: {
      __proto__: null,
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
    },
    relationalItems: {
      __proto__: null,
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
    },
    relationalStatus: {
      __proto__: null,
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
    },
    relationalTopics: {
      __proto__: null,
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
    }
  }
};
const registry = makeRegistry(registryConfig);
const resource_relational_topicsPgResource = registry.pgResources["relational_topics"];
const nodeIdHandler_RelationalTopic_codec_base64JSON = {
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
const nodeIdHandler_RelationalTopic = {
  typeName: "RelationalTopic",
  codec: nodeIdHandler_RelationalTopic_codec_base64JSON,
  deprecationReason: undefined,
  plan($record) {
    return list([constant("relational_topics", false), $record.get("id")]);
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
    return resource_relational_topicsPgResource.get(spec);
  },
  match(obj) {
    return obj[0] === "relational_topics";
  }
};
const nodeIdCodecs = {
  __proto__: null,
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
  base64JSON: nodeIdHandler_RelationalTopic_codec_base64JSON,
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
const building_buildingPgResource = registry.pgResources["building"];
const relational_items_relational_itemsPgResource = registry.pgResources["relational_items"];
const pgResource___proto__PgResource = registry.pgResources["__proto__"];
const pgResource_constructorPgResource = registry.pgResources["constructor"];
const pgResource_cropPgResource = registry.pgResources["crop"];
const pgResource_machinePgResource = registry.pgResources["machine"];
const pgResource_materialPgResource = registry.pgResources["material"];
const pgResource_nullPgResource = registry.pgResources["null"];
const pgResource_projectPgResource = registry.pgResources["project"];
const pgResource_relational_statusPgResource = registry.pgResources["relational_status"];
const pgResource_yieldPgResource = registry.pgResources["yield"];
const pgResource_reservedPgResource = registry.pgResources["reserved"];
const nodeIdHandlerByTypeName = {
  __proto__: null,
  Query: {
    typeName: "Query",
    codec: nodeIdCodecs.raw,
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
  },
  RelationalTopic: nodeIdHandler_RelationalTopic,
  _Proto__: {
    typeName: "_Proto__",
    codec: nodeIdHandler_RelationalTopic_codec_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("__proto__S", false), ...__proto__Uniques[0].attributes.map(attribute => $record.get(attribute))]);
    },
    getSpec($list) {
      const spec = __proto__Uniques[0].attributes.reduce((memo, attribute, index) => {
        memo[attribute] = access($list, [index + 1]);
        return memo;
      }, Object.create(null));
      return spec;
    },
    getIdentifiers(value) {
      return value.slice(1);
    },
    get(spec) {
      return pgResource___proto__PgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "__proto__S";
    }
  },
  Building: {
    typeName: "Building",
    codec: nodeIdHandler_RelationalTopic_codec_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("buildings", false), $record.get("id")]);
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
      return building_buildingPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "buildings";
    }
  },
  Constructor: {
    typeName: "Constructor",
    codec: nodeIdHandler_RelationalTopic_codec_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("constructors", false), $record.get("id")]);
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
      return pgResource_constructorPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "constructors";
    }
  },
  Crop: {
    typeName: "Crop",
    codec: nodeIdHandler_RelationalTopic_codec_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("crops", false), $record.get("id")]);
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
      return pgResource_cropPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "crops";
    }
  },
  Machine: {
    typeName: "Machine",
    codec: nodeIdHandler_RelationalTopic_codec_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("machines", false), $record.get("id")]);
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
      return pgResource_machinePgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "machines";
    }
  },
  Material: {
    typeName: "Material",
    codec: nodeIdHandler_RelationalTopic_codec_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("materials", false), $record.get("id")]);
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
      return pgResource_materialPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "materials";
    }
  },
  Null: {
    typeName: "Null",
    codec: nodeIdHandler_RelationalTopic_codec_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("nulls", false), $record.get("id")]);
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
      return pgResource_nullPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "nulls";
    }
  },
  Project: {
    typeName: "Project",
    codec: nodeIdHandler_RelationalTopic_codec_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("projects", false), $record.get("id")]);
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
      return pgResource_projectPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "projects";
    }
  },
  RelationalStatus: {
    typeName: "RelationalStatus",
    codec: nodeIdHandler_RelationalTopic_codec_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("relational_statuses", false), $record.get("id")]);
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
      return pgResource_relational_statusPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "relational_statuses";
    }
  },
  Yield: {
    typeName: "Yield",
    codec: nodeIdHandler_RelationalTopic_codec_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("yields", false), $record.get("id")]);
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
      return pgResource_yieldPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "yields";
    }
  },
  Reserved: {
    typeName: "Reserved",
    codec: nodeIdHandler_RelationalTopic_codec_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("reserveds", false), $record.get("id")]);
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
      return pgResource_reservedPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "reserveds";
    }
  }
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
const RelationalItem_typeNameFromType = ((interfaceTypeName, polymorphism) => {
  function typeNameFromType(typeVal) {
    if (typeof typeVal !== "string") return null;
    return polymorphism.types[typeVal]?.name ?? null;
  }
  typeNameFromType.displayName = `${interfaceTypeName}_typeNameFromType`;
  return typeNameFromType;
})("RelationalItem", spec_relationalItems.polymorphism);
const specFromRecord = $record => {
  return registryConfig.pgRelations.building.machinesByTheirConstructor.remoteAttributes.reduce((memo, remoteAttributeName, i) => {
    memo[remoteAttributeName] = $record.get(registryConfig.pgRelations.building.machinesByTheirConstructor.localAttributes[i]);
    return memo;
  }, Object.create(null));
};
function qbWhereBuilder(qb) {
  return qb.whereBuilder();
}
const specFromRecord2 = $record => {
  return registryConfig.pgRelations.building.relationalItemsByTheirConstructor.remoteAttributes.reduce((memo, remoteAttributeName, i) => {
    memo[remoteAttributeName] = $record.get(registryConfig.pgRelations.building.relationalItemsByTheirConstructor.localAttributes[i]);
    return memo;
  }, Object.create(null));
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
const detailsByAttributeName = {
  __proto__: null,
  constructor: {
    graphqlName: "constructor",
    codec: TYPES.text
  }
};
const detailsByAttributeName2 = {
  __proto__: null,
  valueOf: {
    graphqlName: "valueOf",
    codec: TYPES.text
  }
};
const detailsByAttributeName3 = {
  __proto__: null,
  hasOwnProperty: {
    graphqlName: "hasOwnProperty",
    codec: TYPES.text
  }
};
const detailsByAttributeName4 = Object.fromEntries([["__proto__", {
  graphqlName: "_proto__",
  codec: TYPES.text
}]]);
const argDetailsSimple_await = [{
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
const makeArgs_await = (args, path = []) => argDetailsSimple_await.map(details => makeArg(path, args, details));
const resource_awaitPgResource = registry.pgResources["await"];
const argDetailsSimple_case = [{
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
const makeArgs_case = (args, path = []) => argDetailsSimple_case.map(details => makeArg(path, args, details));
const resource_casePgResource = registry.pgResources["case"];
const argDetailsSimple_valueOf = [{
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
const makeArgs_valueOf = (args, path = []) => argDetailsSimple_valueOf.map(details => makeArg(path, args, details));
const resource_valueOfPgResource = registry.pgResources["valueOf"];
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
const nodeFetcher_RelationalTopic = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_RelationalTopic));
  return nodeIdHandler_RelationalTopic.get(nodeIdHandler_RelationalTopic.getSpec(inhibitOnNull($decoded)));
};
const nodeFetcher__Proto__ = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandlerByTypeName._Proto__));
  return nodeIdHandlerByTypeName._Proto__.get(nodeIdHandlerByTypeName._Proto__.getSpec(inhibitOnNull($decoded)));
};
const nodeFetcher_Building = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandlerByTypeName.Building));
  return nodeIdHandlerByTypeName.Building.get(nodeIdHandlerByTypeName.Building.getSpec(inhibitOnNull($decoded)));
};
const nodeFetcher_Constructor = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandlerByTypeName.Constructor));
  return nodeIdHandlerByTypeName.Constructor.get(nodeIdHandlerByTypeName.Constructor.getSpec(inhibitOnNull($decoded)));
};
const nodeFetcher_Crop = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandlerByTypeName.Crop));
  return nodeIdHandlerByTypeName.Crop.get(nodeIdHandlerByTypeName.Crop.getSpec(inhibitOnNull($decoded)));
};
const nodeFetcher_Machine = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandlerByTypeName.Machine));
  return nodeIdHandlerByTypeName.Machine.get(nodeIdHandlerByTypeName.Machine.getSpec(inhibitOnNull($decoded)));
};
const nodeFetcher_Material = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandlerByTypeName.Material));
  return nodeIdHandlerByTypeName.Material.get(nodeIdHandlerByTypeName.Material.getSpec(inhibitOnNull($decoded)));
};
const nodeFetcher_Null = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandlerByTypeName.Null));
  return nodeIdHandlerByTypeName.Null.get(nodeIdHandlerByTypeName.Null.getSpec(inhibitOnNull($decoded)));
};
const nodeFetcher_Project = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandlerByTypeName.Project));
  return nodeIdHandlerByTypeName.Project.get(nodeIdHandlerByTypeName.Project.getSpec(inhibitOnNull($decoded)));
};
const nodeFetcher_RelationalStatus = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandlerByTypeName.RelationalStatus));
  return nodeIdHandlerByTypeName.RelationalStatus.get(nodeIdHandlerByTypeName.RelationalStatus.getSpec(inhibitOnNull($decoded)));
};
const nodeFetcher_Yield = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandlerByTypeName.Yield));
  return nodeIdHandlerByTypeName.Yield.get(nodeIdHandlerByTypeName.Yield.getSpec(inhibitOnNull($decoded)));
};
const nodeFetcher_Reserved = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandlerByTypeName.Reserved));
  return nodeIdHandlerByTypeName.Reserved.get(nodeIdHandlerByTypeName.Reserved.getSpec(inhibitOnNull($decoded)));
};
const argDetailsSimple_null_yield = [{
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
const makeArgs_null_yield = (args, path = []) => argDetailsSimple_null_yield.map(details => makeArg(path, args, details));
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
const resource_null_yieldPgResource = registry.pgResources["null_yield"];
const specFromArgs__Proto__ = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName._Proto__, inhibitOnNull($nodeId));
};
const specFromArgs_Building = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Building, inhibitOnNull($nodeId));
};
const uniqueAttributes = [["constructor", "constructor"]];
const specFromArgs_Building2 = args => {
  return uniqueAttributes.reduce((memo, [attributeName, fieldName]) => {
    memo[attributeName] = args.getRaw(["input", fieldName]);
    return memo;
  }, Object.create(null));
};
const specFromArgs_Constructor = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Constructor, inhibitOnNull($nodeId));
};
const specFromArgs_Crop = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Crop, inhibitOnNull($nodeId));
};
const specFromArgs_Machine = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Machine, inhibitOnNull($nodeId));
};
const specFromArgs_Material = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Material, inhibitOnNull($nodeId));
};
const uniqueAttributes2 = [["valueOf", "valueOf"]];
const specFromArgs_Material2 = args => {
  return uniqueAttributes2.reduce((memo, [attributeName, fieldName]) => {
    memo[attributeName] = args.getRaw(["input", fieldName]);
    return memo;
  }, Object.create(null));
};
const specFromArgs_Null = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Null, inhibitOnNull($nodeId));
};
const uniqueAttributes3 = [["hasOwnProperty", "hasOwnProperty"]];
const specFromArgs_Null2 = args => {
  return uniqueAttributes3.reduce((memo, [attributeName, fieldName]) => {
    memo[attributeName] = args.getRaw(["input", fieldName]);
    return memo;
  }, Object.create(null));
};
const specFromArgs_Project = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Project, inhibitOnNull($nodeId));
};
const uniqueAttributes4 = [["__proto__", "_proto__"]];
const specFromArgs_Project2 = args => {
  return uniqueAttributes4.reduce((memo, [attributeName, fieldName]) => {
    memo[attributeName] = args.getRaw(["input", fieldName]);
    return memo;
  }, Object.create(null));
};
const specFromArgs_Yield = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Yield, inhibitOnNull($nodeId));
};
const specFromArgs_Reserved = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Reserved, inhibitOnNull($nodeId));
};
const specFromArgs__Proto__2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName._Proto__, inhibitOnNull($nodeId));
};
const specFromArgs_Building3 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Building, inhibitOnNull($nodeId));
};
const uniqueAttributes5 = [["constructor", "constructor"]];
const specFromArgs_Building4 = args => {
  return uniqueAttributes5.reduce((memo, [attributeName, fieldName]) => {
    memo[attributeName] = args.getRaw(["input", fieldName]);
    return memo;
  }, Object.create(null));
};
const specFromArgs_Constructor2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Constructor, inhibitOnNull($nodeId));
};
const specFromArgs_Crop2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Crop, inhibitOnNull($nodeId));
};
const specFromArgs_Machine2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Machine, inhibitOnNull($nodeId));
};
const specFromArgs_Material3 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Material, inhibitOnNull($nodeId));
};
const uniqueAttributes6 = [["valueOf", "valueOf"]];
const specFromArgs_Material4 = args => {
  return uniqueAttributes6.reduce((memo, [attributeName, fieldName]) => {
    memo[attributeName] = args.getRaw(["input", fieldName]);
    return memo;
  }, Object.create(null));
};
const specFromArgs_Null3 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Null, inhibitOnNull($nodeId));
};
const uniqueAttributes7 = [["hasOwnProperty", "hasOwnProperty"]];
const specFromArgs_Null4 = args => {
  return uniqueAttributes7.reduce((memo, [attributeName, fieldName]) => {
    memo[attributeName] = args.getRaw(["input", fieldName]);
    return memo;
  }, Object.create(null));
};
const specFromArgs_Project3 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Project, inhibitOnNull($nodeId));
};
const uniqueAttributes8 = [["__proto__", "_proto__"]];
const specFromArgs_Project4 = args => {
  return uniqueAttributes8.reduce((memo, [attributeName, fieldName]) => {
    memo[attributeName] = args.getRaw(["input", fieldName]);
    return memo;
  }, Object.create(null));
};
const specFromArgs_Yield2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Yield, inhibitOnNull($nodeId));
};
const specFromArgs_Reserved2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Reserved, inhibitOnNull($nodeId));
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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: MachineCondition

    """The method to use when ordering \`Machine\`."""
    orderBy: [MachinesOrderBy!] = [PRIMARY_KEY_ASC]
  ): MachinesConnection!

  """Reads and enables pagination through a set of \`Machine\`."""
  machinesByConstructorList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: MachineCondition

    """The method to use when ordering \`Machine\`."""
    orderBy: [MachinesOrderBy!]
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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalItemCondition

    """The method to use when ordering \`RelationalItem\`."""
    orderBy: [RelationalItemsOrderBy!] = [PRIMARY_KEY_ASC]
  ): RelationalItemsConnection!

  """Reads and enables pagination through a set of \`RelationalItem\`."""
  relationalItemsByConstructorList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalItemCondition

    """The method to use when ordering \`RelationalItem\`."""
    orderBy: [RelationalItemsOrderBy!]
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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalTopicCondition

    """The method to use when ordering \`RelationalTopic\`."""
    orderBy: [RelationalTopicsOrderBy!]
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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalTopicCondition

    """The method to use when ordering \`RelationalTopic\`."""
    orderBy: [RelationalTopicsOrderBy!] = [PRIMARY_KEY_ASC]
  ): RelationalTopicsConnection

  """Reads a set of \`_Proto__\`."""
  allProtoSList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: _ProtoCondition

    """The method to use when ordering \`_Proto__\`."""
    orderBy: [_ProtoSOrderBy!]
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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: _ProtoCondition

    """The method to use when ordering \`_Proto__\`."""
    orderBy: [_ProtoSOrderBy!] = [PRIMARY_KEY_ASC]
  ): _Proto__SConnection

  """Reads a set of \`Building\`."""
  allBuildingsList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: BuildingCondition

    """The method to use when ordering \`Building\`."""
    orderBy: [BuildingsOrderBy!]
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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: BuildingCondition

    """The method to use when ordering \`Building\`."""
    orderBy: [BuildingsOrderBy!] = [PRIMARY_KEY_ASC]
  ): BuildingsConnection

  """Reads a set of \`Constructor\`."""
  allConstructorsList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: ConstructorCondition

    """The method to use when ordering \`Constructor\`."""
    orderBy: [ConstructorsOrderBy!]
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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: ConstructorCondition

    """The method to use when ordering \`Constructor\`."""
    orderBy: [ConstructorsOrderBy!] = [PRIMARY_KEY_ASC]
  ): ConstructorsConnection

  """Reads a set of \`Crop\`."""
  allCropsList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: CropCondition

    """The method to use when ordering \`Crop\`."""
    orderBy: [CropsOrderBy!]
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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: CropCondition

    """The method to use when ordering \`Crop\`."""
    orderBy: [CropsOrderBy!] = [PRIMARY_KEY_ASC]
  ): CropsConnection

  """Reads a set of \`Machine\`."""
  allMachinesList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: MachineCondition

    """The method to use when ordering \`Machine\`."""
    orderBy: [MachinesOrderBy!]
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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: MachineCondition

    """The method to use when ordering \`Machine\`."""
    orderBy: [MachinesOrderBy!] = [PRIMARY_KEY_ASC]
  ): MachinesConnection

  """Reads a set of \`Material\`."""
  allMaterialsList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: MaterialCondition

    """The method to use when ordering \`Material\`."""
    orderBy: [MaterialsOrderBy!]
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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: MaterialCondition

    """The method to use when ordering \`Material\`."""
    orderBy: [MaterialsOrderBy!] = [PRIMARY_KEY_ASC]
  ): MaterialsConnection

  """Reads a set of \`Null\`."""
  allNullsList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: NullCondition

    """The method to use when ordering \`Null\`."""
    orderBy: [NullsOrderBy!]
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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: NullCondition

    """The method to use when ordering \`Null\`."""
    orderBy: [NullsOrderBy!] = [PRIMARY_KEY_ASC]
  ): NullsConnection

  """Reads a set of \`Project\`."""
  allProjectsList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: ProjectCondition

    """The method to use when ordering \`Project\`."""
    orderBy: [ProjectsOrderBy!]
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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: ProjectCondition

    """The method to use when ordering \`Project\`."""
    orderBy: [ProjectsOrderBy!] = [PRIMARY_KEY_ASC]
  ): ProjectsConnection

  """Reads a set of \`RelationalStatus\`."""
  allRelationalStatusesList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalStatusCondition

    """The method to use when ordering \`RelationalStatus\`."""
    orderBy: [RelationalStatusesOrderBy!]
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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalStatusCondition

    """The method to use when ordering \`RelationalStatus\`."""
    orderBy: [RelationalStatusesOrderBy!] = [PRIMARY_KEY_ASC]
  ): RelationalStatusesConnection

  """Reads a set of \`Yield\`."""
  allYieldsList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: YieldCondition

    """The method to use when ordering \`Yield\`."""
    orderBy: [YieldsOrderBy!]
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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: YieldCondition

    """The method to use when ordering \`Yield\`."""
    orderBy: [YieldsOrderBy!] = [PRIMARY_KEY_ASC]
  ): YieldsConnection

  """Reads a set of \`Reserved\`."""
  allReservedsList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: ReservedCondition

    """The method to use when ordering \`Reserved\`."""
    orderBy: [ReservedsOrderBy!]
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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: ReservedCondition

    """The method to use when ordering \`Reserved\`."""
    orderBy: [ReservedsOrderBy!] = [PRIMARY_KEY_ASC]
  ): ReservedsConnection

  """Reads a set of \`RelationalItem\`."""
  allRelationalItemsList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalItemCondition

    """The method to use when ordering \`RelationalItem\`."""
    orderBy: [RelationalItemsOrderBy!]
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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalItemCondition

    """The method to use when ordering \`RelationalItem\`."""
    orderBy: [RelationalItemsOrderBy!] = [PRIMARY_KEY_ASC]
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
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of pkCols) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_relational_topicsPgResource.get(spec);
    },
    nodeId($parent) {
      const specifier = nodeIdHandler_RelationalTopic.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandler_RelationalTopic.codec.name].encode);
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
  RelationalItem: {
    __toSpecifier(step) {
      if (step instanceof PgSelectSingleStep && step.resource !== relational_items_relational_itemsPgResource) {
        // Assume it's a child; return description of base
        // PERF: ideally we'd use relationship
        // traversal instead, this would both be
        // shorter and also cacheable.
        const stepPk = step.resource.uniques.find(u => u.isPrimary)?.attributes;
        if (!stepPk) {
          throw new Error(`Expected a relational record for ${relational_items_relational_itemsPgResource.name}, but found one for ${step.resource.name} which has no primary key!`);
        }
        if (stepPk.length !== relational_itemsUniques[0].attributes.length) {
          throw new Error(`Expected a relational record for ${relational_items_relational_itemsPgResource.name}, but found one for ${step.resource.name} which has a primary key with a different number of columns!`);
        }
        return object(Object.fromEntries(relational_itemsUniques[0].attributes.map((attrName, idx) => [attrName, get2(step, stepPk[idx])])));
      } else {
        // Assume it is or describes the base:
        return object(Object.fromEntries(relational_itemsUniques[0].attributes.map(attrName => [attrName, get2(step, attrName)])));
      }
    },
    __planType($specifier, {
      $original
    }) {
      const $inStep = $original ?? $specifier;
      // A PgSelectSingleStep representing the base relational table
      const $base = (() => {
        if ($inStep instanceof PgSelectSingleStep) {
          if ($inStep.resource.codec === relational_items_relational_itemsPgResource.codec) {
            // It's the core table; that's what we want!
            return $inStep;
          } else {
            // Assume it's a child; get base record by primary key
            // PERF: ideally we'd use relationship
            // traversal instead, this would both be
            // shorter and also cacheable.
            const stepPk = $inStep.resource.uniques.find(u => u.isPrimary)?.attributes;
            if (!stepPk) {
              throw new Error(`Expected a relational record for ${relational_items_relational_itemsPgResource.name}, but found one for ${$inStep.resource.name} which has no primary key!`);
            }
            if (stepPk.length !== relational_itemsUniques[0].attributes.length) {
              throw new Error(`Expected a relational record for ${relational_items_relational_itemsPgResource.name}, but found one for ${$inStep.resource.name} which has a primary key with a different number of columns!`);
            }
            return relational_items_relational_itemsPgResource.get(Object.fromEntries(relational_itemsUniques[0].attributes.map((attrName, idx) => [attrName, get2($inStep, stepPk[idx])])));
          }
        } else {
          // Assume it's an object representing the base table
          return relational_items_relational_itemsPgResource.get(Object.fromEntries(relational_itemsUniques[0].attributes.map(attrName => [attrName, get2($inStep, attrName)])));
        }
      })();
      const $typeVal = get2($base, "type");
      const $__typename = lambda($typeVal, RelationalItem_typeNameFromType, true);
      return {
        $__typename,
        planForType(type) {
          const spec = Object.values(spec_relationalItems.polymorphism.types).find(s => s.name === type.name);
          if (!spec) {
            throw new Error(`${this} Could not find matching name for relational polymorphic '${type.name}'`);
          }
          return $base.singleRelation(spec.relationName);
        }
      };
    }
  },
  Building: {
    __assertStep: assertPgClassSingleStep,
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of buildingUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return building_buildingPgResource.get(spec);
    },
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.Building.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Building.codec.name].encode);
    },
    machinesByConstructor: {
      plan($record) {
        return connection(pgResource_machinePgResource.find(specFromRecord($record)));
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
    machinesByConstructorList: {
      plan($record) {
        return pgResource_machinePgResource.find(specFromRecord($record));
      },
      args: {
        first(_, $connection, arg) {
          $connection.setFirst(arg.getRaw());
        },
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        condition(_condition, $select, arg) {
          arg.apply($select, qbWhereBuilder);
        },
        orderBy(parent, $select, value) {
          value.apply($select);
        }
      }
    },
    relationalItemsByConstructor: {
      plan($record) {
        return connection(relational_items_relational_itemsPgResource.find(specFromRecord2($record)));
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
    relationalItemsByConstructorList: {
      plan($record) {
        return relational_items_relational_itemsPgResource.find(specFromRecord2($record));
      },
      args: {
        first(_, $connection, arg) {
          $connection.setFirst(arg.getRaw());
        },
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        condition(_condition, $select, arg) {
          arg.apply($select, qbWhereBuilder);
        },
        orderBy(parent, $select, value) {
          value.apply($select);
        }
      }
    }
  },
  MachinesConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  Machine: {
    __assertStep: assertPgClassSingleStep,
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of machineUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return pgResource_machinePgResource.get(spec);
    },
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.Machine.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Machine.codec.name].encode);
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
  MachineCondition: {
    id($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "id",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    },
    input($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "input",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
        }
      });
    },
    constructor($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "constructor",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
        }
      });
    }
  },
  MachinesOrderBy: {
    PRIMARY_KEY_ASC(queryBuilder) {
      machineUniques[0].attributes.forEach(attributeName => {
        queryBuilder.orderBy({
          attribute: attributeName,
          direction: "ASC"
        });
      });
      queryBuilder.setOrderIsUnique();
    },
    PRIMARY_KEY_DESC(queryBuilder) {
      machineUniques[0].attributes.forEach(attributeName => {
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
    INPUT_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "input",
        direction: "ASC"
      });
    },
    INPUT_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "input",
        direction: "DESC"
      });
    },
    CONSTRUCTOR_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "constructor",
        direction: "ASC"
      });
    },
    CONSTRUCTOR_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "constructor",
        direction: "DESC"
      });
    }
  },
  RelationalItemsConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
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
  RelationalItemCondition: {
    id($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "id",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    },
    type($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "type",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, itemTypeCodec)}`;
        }
      });
    },
    constructor($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "constructor",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
        }
      });
    }
  },
  RelationalItemsOrderBy: {
    PRIMARY_KEY_ASC(queryBuilder) {
      relational_itemsUniques[0].attributes.forEach(attributeName => {
        queryBuilder.orderBy({
          attribute: attributeName,
          direction: "ASC"
        });
      });
      queryBuilder.setOrderIsUnique();
    },
    PRIMARY_KEY_DESC(queryBuilder) {
      relational_itemsUniques[0].attributes.forEach(attributeName => {
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
    TYPE_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "type",
        direction: "ASC"
      });
    },
    TYPE_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "type",
        direction: "DESC"
      });
    },
    CONSTRUCTOR_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "constructor",
        direction: "ASC"
      });
    },
    CONSTRUCTOR_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "constructor",
        direction: "DESC"
      });
    }
  },
  RelationalStatus: {
    __assertStep: assertPgClassSingleStep,
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of relational_statusUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return pgResource_relational_statusPgResource.get(spec);
    },
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.RelationalStatus.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.RelationalStatus.codec.name].encode);
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
      const specifier = nodeIdHandlerByTypeName.Query.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Query.codec.name].encode);
    },
    node(_$root, fieldArgs) {
      return fieldArgs.getRaw("nodeId");
    },
    relationalTopicById(_$root, {
      $id
    }) {
      return resource_relational_topicsPgResource.get({
        id: $id
      });
    },
    _protoById(_$root, {
      $id
    }) {
      return pgResource___proto__PgResource.get({
        id: $id
      });
    },
    _protoByName(_$root, {
      $name
    }) {
      return pgResource___proto__PgResource.get({
        name: $name
      });
    },
    buildingById(_$root, {
      $id
    }) {
      return building_buildingPgResource.get({
        id: $id
      });
    },
    buildingByConstructor(_$root, args) {
      const spec = Object.create(null);
      for (const attributeName in detailsByAttributeName) {
        spec[attributeName] = args.getRaw(detailsByAttributeName[attributeName].graphqlName);
      }
      return building_buildingPgResource.get(spec);
    },
    constructorById(_$root, {
      $id
    }) {
      return pgResource_constructorPgResource.get({
        id: $id
      });
    },
    constructorByExport(_$root, {
      $export
    }) {
      return pgResource_constructorPgResource.get({
        export: $export
      });
    },
    constructorByName(_$root, {
      $name
    }) {
      return pgResource_constructorPgResource.get({
        name: $name
      });
    },
    cropById(_$root, {
      $id
    }) {
      return pgResource_cropPgResource.get({
        id: $id
      });
    },
    cropByYield(_$root, {
      $yield
    }) {
      return pgResource_cropPgResource.get({
        yield: $yield
      });
    },
    machineById(_$root, {
      $id
    }) {
      return pgResource_machinePgResource.get({
        id: $id
      });
    },
    materialById(_$root, {
      $id
    }) {
      return pgResource_materialPgResource.get({
        id: $id
      });
    },
    materialByClass(_$root, {
      $class
    }) {
      return pgResource_materialPgResource.get({
        class: $class
      });
    },
    materialByValueOf(_$root, args) {
      const spec = Object.create(null);
      for (const attributeName in detailsByAttributeName2) {
        spec[attributeName] = args.getRaw(detailsByAttributeName2[attributeName].graphqlName);
      }
      return pgResource_materialPgResource.get(spec);
    },
    nullById(_$root, {
      $id
    }) {
      return pgResource_nullPgResource.get({
        id: $id
      });
    },
    nullByBreak(_$root, {
      $break
    }) {
      return pgResource_nullPgResource.get({
        break: $break
      });
    },
    nullByHasOwnProperty(_$root, args) {
      const spec = Object.create(null);
      for (const attributeName in detailsByAttributeName3) {
        spec[attributeName] = args.getRaw(detailsByAttributeName3[attributeName].graphqlName);
      }
      return pgResource_nullPgResource.get(spec);
    },
    projectById(_$root, {
      $id
    }) {
      return pgResource_projectPgResource.get({
        id: $id
      });
    },
    projectByProto__(_$root, args) {
      const spec = Object.create(null);
      for (const attributeName in detailsByAttributeName4) {
        spec[attributeName] = args.getRaw(detailsByAttributeName4[attributeName].graphqlName);
      }
      return pgResource_projectPgResource.get(spec);
    },
    relationalStatusById(_$root, {
      $id
    }) {
      return pgResource_relational_statusPgResource.get({
        id: $id
      });
    },
    yieldById(_$root, {
      $id
    }) {
      return pgResource_yieldPgResource.get({
        id: $id
      });
    },
    yieldByExport(_$root, {
      $export
    }) {
      return pgResource_yieldPgResource.get({
        export: $export
      });
    },
    reservedById(_$root, {
      $id
    }) {
      return pgResource_reservedPgResource.get({
        id: $id
      });
    },
    reservedByCase(_$root, {
      $case
    }) {
      return pgResource_reservedPgResource.get({
        case: $case
      });
    },
    reservedByDo(_$root, {
      $do
    }) {
      return pgResource_reservedPgResource.get({
        do: $do
      });
    },
    reservedByNull(_$root, {
      $null
    }) {
      return pgResource_reservedPgResource.get({
        null: $null
      });
    },
    await($root, args, _info) {
      const selectArgs = makeArgs_await(args);
      return resource_awaitPgResource.execute(selectArgs);
    },
    case($root, args, _info) {
      const selectArgs = makeArgs_case(args);
      return resource_casePgResource.execute(selectArgs);
    },
    valueOf($root, args, _info) {
      const selectArgs = makeArgs_valueOf(args);
      return resource_valueOfPgResource.execute(selectArgs);
    },
    relationalTopic(_$parent, args) {
      const $nodeId = args.getRaw("nodeId");
      return nodeFetcher_RelationalTopic($nodeId);
    },
    _proto__(_$parent, args) {
      const $nodeId = args.getRaw("nodeId");
      return nodeFetcher__Proto__($nodeId);
    },
    building(_$parent, args) {
      const $nodeId = args.getRaw("nodeId");
      return nodeFetcher_Building($nodeId);
    },
    constructor(_$parent, args) {
      const $nodeId = args.getRaw("nodeId");
      return nodeFetcher_Constructor($nodeId);
    },
    crop(_$parent, args) {
      const $nodeId = args.getRaw("nodeId");
      return nodeFetcher_Crop($nodeId);
    },
    machine(_$parent, args) {
      const $nodeId = args.getRaw("nodeId");
      return nodeFetcher_Machine($nodeId);
    },
    material(_$parent, args) {
      const $nodeId = args.getRaw("nodeId");
      return nodeFetcher_Material($nodeId);
    },
    null(_$parent, args) {
      const $nodeId = args.getRaw("nodeId");
      return nodeFetcher_Null($nodeId);
    },
    project(_$parent, args) {
      const $nodeId = args.getRaw("nodeId");
      return nodeFetcher_Project($nodeId);
    },
    relationalStatus(_$parent, args) {
      const $nodeId = args.getRaw("nodeId");
      return nodeFetcher_RelationalStatus($nodeId);
    },
    yield(_$parent, args) {
      const $nodeId = args.getRaw("nodeId");
      return nodeFetcher_Yield($nodeId);
    },
    reserved(_$parent, args) {
      const $nodeId = args.getRaw("nodeId");
      return nodeFetcher_Reserved($nodeId);
    },
    allRelationalTopicsList: {
      plan() {
        return resource_relational_topicsPgResource.find();
      },
      args: {
        first(_, $connection, arg) {
          $connection.setFirst(arg.getRaw());
        },
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        condition(_condition, $select, arg) {
          arg.apply($select, qbWhereBuilder);
        },
        orderBy(parent, $select, value) {
          value.apply($select);
        }
      }
    },
    allRelationalTopics: {
      plan() {
        return connection(resource_relational_topicsPgResource.find());
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
    allProtoSList: {
      plan() {
        return pgResource___proto__PgResource.find();
      },
      args: {
        first(_, $connection, arg) {
          $connection.setFirst(arg.getRaw());
        },
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        condition(_condition, $select, arg) {
          arg.apply($select, qbWhereBuilder);
        },
        orderBy(parent, $select, value) {
          value.apply($select);
        }
      }
    },
    allProtoS: {
      plan() {
        return connection(pgResource___proto__PgResource.find());
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
    allBuildingsList: {
      plan() {
        return building_buildingPgResource.find();
      },
      args: {
        first(_, $connection, arg) {
          $connection.setFirst(arg.getRaw());
        },
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        condition(_condition, $select, arg) {
          arg.apply($select, qbWhereBuilder);
        },
        orderBy(parent, $select, value) {
          value.apply($select);
        }
      }
    },
    allBuildings: {
      plan() {
        return connection(building_buildingPgResource.find());
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
    allConstructorsList: {
      plan() {
        return pgResource_constructorPgResource.find();
      },
      args: {
        first(_, $connection, arg) {
          $connection.setFirst(arg.getRaw());
        },
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        condition(_condition, $select, arg) {
          arg.apply($select, qbWhereBuilder);
        },
        orderBy(parent, $select, value) {
          value.apply($select);
        }
      }
    },
    allConstructors: {
      plan() {
        return connection(pgResource_constructorPgResource.find());
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
    allCropsList: {
      plan() {
        return pgResource_cropPgResource.find();
      },
      args: {
        first(_, $connection, arg) {
          $connection.setFirst(arg.getRaw());
        },
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        condition(_condition, $select, arg) {
          arg.apply($select, qbWhereBuilder);
        },
        orderBy(parent, $select, value) {
          value.apply($select);
        }
      }
    },
    allCrops: {
      plan() {
        return connection(pgResource_cropPgResource.find());
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
    allMachinesList: {
      plan() {
        return pgResource_machinePgResource.find();
      },
      args: {
        first(_, $connection, arg) {
          $connection.setFirst(arg.getRaw());
        },
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        condition(_condition, $select, arg) {
          arg.apply($select, qbWhereBuilder);
        },
        orderBy(parent, $select, value) {
          value.apply($select);
        }
      }
    },
    allMachines: {
      plan() {
        return connection(pgResource_machinePgResource.find());
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
    allMaterialsList: {
      plan() {
        return pgResource_materialPgResource.find();
      },
      args: {
        first(_, $connection, arg) {
          $connection.setFirst(arg.getRaw());
        },
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        condition(_condition, $select, arg) {
          arg.apply($select, qbWhereBuilder);
        },
        orderBy(parent, $select, value) {
          value.apply($select);
        }
      }
    },
    allMaterials: {
      plan() {
        return connection(pgResource_materialPgResource.find());
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
    allNullsList: {
      plan() {
        return pgResource_nullPgResource.find();
      },
      args: {
        first(_, $connection, arg) {
          $connection.setFirst(arg.getRaw());
        },
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        condition(_condition, $select, arg) {
          arg.apply($select, qbWhereBuilder);
        },
        orderBy(parent, $select, value) {
          value.apply($select);
        }
      }
    },
    allNulls: {
      plan() {
        return connection(pgResource_nullPgResource.find());
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
    allProjectsList: {
      plan() {
        return pgResource_projectPgResource.find();
      },
      args: {
        first(_, $connection, arg) {
          $connection.setFirst(arg.getRaw());
        },
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        condition(_condition, $select, arg) {
          arg.apply($select, qbWhereBuilder);
        },
        orderBy(parent, $select, value) {
          value.apply($select);
        }
      }
    },
    allProjects: {
      plan() {
        return connection(pgResource_projectPgResource.find());
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
    allRelationalStatusesList: {
      plan() {
        return pgResource_relational_statusPgResource.find();
      },
      args: {
        first(_, $connection, arg) {
          $connection.setFirst(arg.getRaw());
        },
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        condition(_condition, $select, arg) {
          arg.apply($select, qbWhereBuilder);
        },
        orderBy(parent, $select, value) {
          value.apply($select);
        }
      }
    },
    allRelationalStatuses: {
      plan() {
        return connection(pgResource_relational_statusPgResource.find());
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
    allYieldsList: {
      plan() {
        return pgResource_yieldPgResource.find();
      },
      args: {
        first(_, $connection, arg) {
          $connection.setFirst(arg.getRaw());
        },
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        condition(_condition, $select, arg) {
          arg.apply($select, qbWhereBuilder);
        },
        orderBy(parent, $select, value) {
          value.apply($select);
        }
      }
    },
    allYields: {
      plan() {
        return connection(pgResource_yieldPgResource.find());
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
    allReservedsList: {
      plan() {
        return pgResource_reservedPgResource.find();
      },
      args: {
        first(_, $connection, arg) {
          $connection.setFirst(arg.getRaw());
        },
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        condition(_condition, $select, arg) {
          arg.apply($select, qbWhereBuilder);
        },
        orderBy(parent, $select, value) {
          value.apply($select);
        }
      }
    },
    allReserveds: {
      plan() {
        return connection(pgResource_reservedPgResource.find());
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
    allRelationalItemsList: {
      plan() {
        return relational_items_relational_itemsPgResource.find();
      },
      args: {
        first(_, $connection, arg) {
          $connection.setFirst(arg.getRaw());
        },
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        condition(_condition, $select, arg) {
          arg.apply($select, qbWhereBuilder);
        },
        orderBy(parent, $select, value) {
          value.apply($select);
        }
      }
    },
    allRelationalItems: {
      plan() {
        return connection(relational_items_relational_itemsPgResource.find());
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
  _Proto__: {
    __assertStep: assertPgClassSingleStep,
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of __proto__Uniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return pgResource___proto__PgResource.get(spec);
    },
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName._Proto__.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName._Proto__.codec.name].encode);
    }
  },
  Constructor: {
    __assertStep: assertPgClassSingleStep,
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of constructorUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return pgResource_constructorPgResource.get(spec);
    },
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.Constructor.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Constructor.codec.name].encode);
    }
  },
  Crop: {
    __assertStep: assertPgClassSingleStep,
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of cropUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return pgResource_cropPgResource.get(spec);
    },
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.Crop.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Crop.codec.name].encode);
    }
  },
  Material: {
    __assertStep: assertPgClassSingleStep,
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of materialUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return pgResource_materialPgResource.get(spec);
    },
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.Material.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Material.codec.name].encode);
    }
  },
  Null: {
    __assertStep: assertPgClassSingleStep,
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of nullUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return pgResource_nullPgResource.get(spec);
    },
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.Null.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Null.codec.name].encode);
    },
    yield($in, args, _info) {
      const {
        $row,
        selectArgs
      } = pgFunctionArgumentsFromArgs($in, makeArgs_null_yield(args), true);
      const from = pgFromExpression($row, resource_null_yieldPgResource.from, resource_null_yieldPgResource.parameters, selectArgs);
      return pgClassExpression($row, resource_null_yieldPgResource.codec, undefined)`${from}`;
    }
  },
  Project: {
    __assertStep: assertPgClassSingleStep,
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of projectUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return pgResource_projectPgResource.get(spec);
    },
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.Project.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Project.codec.name].encode);
    },
    _proto__($record) {
      return $record.get("__proto__");
    }
  },
  Yield: {
    __assertStep: assertPgClassSingleStep,
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of yieldUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return pgResource_yieldPgResource.get(spec);
    },
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.Yield.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Yield.codec.name].encode);
    }
  },
  Reserved: {
    __assertStep: assertPgClassSingleStep,
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of reservedUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return pgResource_reservedPgResource.get(spec);
    },
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.Reserved.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Reserved.codec.name].encode);
    }
  },
  RelationalTopicCondition: {
    id($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "id",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    },
    title($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "title",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
        }
      });
    },
    type($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "type",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, itemTypeCodec)}`;
        }
      });
    },
    constructor($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "constructor",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
        }
      });
    }
  },
  RelationalTopicsOrderBy: {
    PRIMARY_KEY_ASC(queryBuilder) {
      pkCols.forEach(attributeName => {
        queryBuilder.orderBy({
          attribute: attributeName,
          direction: "ASC"
        });
      });
      queryBuilder.setOrderIsUnique();
    },
    PRIMARY_KEY_DESC(queryBuilder) {
      pkCols.forEach(attributeName => {
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
    TITLE_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "title",
        direction: "ASC"
      });
    },
    TITLE_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "title",
        direction: "DESC"
      });
    },
    TYPE_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "type",
        direction: "ASC"
      });
    },
    TYPE_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "type",
        direction: "DESC"
      });
    },
    CONSTRUCTOR_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "constructor",
        direction: "ASC"
      });
    },
    CONSTRUCTOR_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "constructor",
        direction: "DESC"
      });
    }
  },
  RelationalTopicsConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
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
  _ProtoCondition: {
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
    },
    brand($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "brand",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
        }
      });
    }
  },
  _ProtoSOrderBy: {
    PRIMARY_KEY_ASC(queryBuilder) {
      __proto__Uniques[0].attributes.forEach(attributeName => {
        queryBuilder.orderBy({
          attribute: attributeName,
          direction: "ASC"
        });
      });
      queryBuilder.setOrderIsUnique();
    },
    PRIMARY_KEY_DESC(queryBuilder) {
      __proto__Uniques[0].attributes.forEach(attributeName => {
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
    BRAND_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "brand",
        direction: "ASC"
      });
    },
    BRAND_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "brand",
        direction: "DESC"
      });
    }
  },
  _Proto__SConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
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
  BuildingCondition: {
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
    },
    constructor($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "constructor",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
        }
      });
    }
  },
  BuildingsOrderBy: {
    PRIMARY_KEY_ASC(queryBuilder) {
      buildingUniques[0].attributes.forEach(attributeName => {
        queryBuilder.orderBy({
          attribute: attributeName,
          direction: "ASC"
        });
      });
      queryBuilder.setOrderIsUnique();
    },
    PRIMARY_KEY_DESC(queryBuilder) {
      buildingUniques[0].attributes.forEach(attributeName => {
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
    CONSTRUCTOR_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "constructor",
        direction: "ASC"
      });
      queryBuilder.setOrderIsUnique();
    },
    CONSTRUCTOR_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "constructor",
        direction: "DESC"
      });
      queryBuilder.setOrderIsUnique();
    }
  },
  BuildingsConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
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
  ConstructorCondition: {
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
    },
    export($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "export",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
        }
      });
    }
  },
  ConstructorsOrderBy: {
    PRIMARY_KEY_ASC(queryBuilder) {
      constructorUniques[0].attributes.forEach(attributeName => {
        queryBuilder.orderBy({
          attribute: attributeName,
          direction: "ASC"
        });
      });
      queryBuilder.setOrderIsUnique();
    },
    PRIMARY_KEY_DESC(queryBuilder) {
      constructorUniques[0].attributes.forEach(attributeName => {
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
    EXPORT_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "export",
        direction: "ASC"
      });
      queryBuilder.setOrderIsUnique();
    },
    EXPORT_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "export",
        direction: "DESC"
      });
      queryBuilder.setOrderIsUnique();
    }
  },
  ConstructorsConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
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
  CropCondition: {
    id($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "id",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    },
    yield($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "yield",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
        }
      });
    },
    amount($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "amount",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    }
  },
  CropsOrderBy: {
    PRIMARY_KEY_ASC(queryBuilder) {
      cropUniques[0].attributes.forEach(attributeName => {
        queryBuilder.orderBy({
          attribute: attributeName,
          direction: "ASC"
        });
      });
      queryBuilder.setOrderIsUnique();
    },
    PRIMARY_KEY_DESC(queryBuilder) {
      cropUniques[0].attributes.forEach(attributeName => {
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
    YIELD_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "yield",
        direction: "ASC"
      });
      queryBuilder.setOrderIsUnique();
    },
    YIELD_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "yield",
        direction: "DESC"
      });
      queryBuilder.setOrderIsUnique();
    },
    AMOUNT_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "amount",
        direction: "ASC"
      });
    },
    AMOUNT_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "amount",
        direction: "DESC"
      });
    }
  },
  CropsConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
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
  MaterialCondition: {
    id($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "id",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    },
    class($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "class",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
        }
      });
    },
    valueOf($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "valueOf",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
        }
      });
    }
  },
  MaterialsOrderBy: {
    PRIMARY_KEY_ASC(queryBuilder) {
      materialUniques[0].attributes.forEach(attributeName => {
        queryBuilder.orderBy({
          attribute: attributeName,
          direction: "ASC"
        });
      });
      queryBuilder.setOrderIsUnique();
    },
    PRIMARY_KEY_DESC(queryBuilder) {
      materialUniques[0].attributes.forEach(attributeName => {
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
    CLASS_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "class",
        direction: "ASC"
      });
      queryBuilder.setOrderIsUnique();
    },
    CLASS_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "class",
        direction: "DESC"
      });
      queryBuilder.setOrderIsUnique();
    },
    VALUE_OF_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "valueOf",
        direction: "ASC"
      });
      queryBuilder.setOrderIsUnique();
    },
    VALUE_OF_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "valueOf",
        direction: "DESC"
      });
      queryBuilder.setOrderIsUnique();
    }
  },
  MaterialsConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
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
  NullCondition: {
    id($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "id",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    },
    hasOwnProperty($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "hasOwnProperty",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
        }
      });
    },
    break($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "break",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
        }
      });
    }
  },
  NullsOrderBy: {
    PRIMARY_KEY_ASC(queryBuilder) {
      nullUniques[0].attributes.forEach(attributeName => {
        queryBuilder.orderBy({
          attribute: attributeName,
          direction: "ASC"
        });
      });
      queryBuilder.setOrderIsUnique();
    },
    PRIMARY_KEY_DESC(queryBuilder) {
      nullUniques[0].attributes.forEach(attributeName => {
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
    HAS_OWN_PROPERTY_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "hasOwnProperty",
        direction: "ASC"
      });
      queryBuilder.setOrderIsUnique();
    },
    HAS_OWN_PROPERTY_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "hasOwnProperty",
        direction: "DESC"
      });
      queryBuilder.setOrderIsUnique();
    },
    BREAK_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "break",
        direction: "ASC"
      });
      queryBuilder.setOrderIsUnique();
    },
    BREAK_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "break",
        direction: "DESC"
      });
      queryBuilder.setOrderIsUnique();
    }
  },
  NullsConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
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
  ProjectCondition: {
    id($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "id",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    },
    brand($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "brand",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
        }
      });
    },
    _proto__($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "__proto__",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
        }
      });
    }
  },
  ProjectsOrderBy: {
    PRIMARY_KEY_ASC(queryBuilder) {
      projectUniques[0].attributes.forEach(attributeName => {
        queryBuilder.orderBy({
          attribute: attributeName,
          direction: "ASC"
        });
      });
      queryBuilder.setOrderIsUnique();
    },
    PRIMARY_KEY_DESC(queryBuilder) {
      projectUniques[0].attributes.forEach(attributeName => {
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
    BRAND_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "brand",
        direction: "ASC"
      });
    },
    BRAND_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "brand",
        direction: "DESC"
      });
    },
    _PROTO_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "__proto__",
        direction: "ASC"
      });
      queryBuilder.setOrderIsUnique();
    },
    _PROTO_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "__proto__",
        direction: "DESC"
      });
      queryBuilder.setOrderIsUnique();
    }
  },
  ProjectsConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
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
  RelationalStatusCondition: {
    id($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "id",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
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
    note($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "note",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
        }
      });
    },
    type($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "type",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, itemTypeCodec)}`;
        }
      });
    },
    constructor($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "constructor",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
        }
      });
    }
  },
  RelationalStatusesOrderBy: {
    PRIMARY_KEY_ASC(queryBuilder) {
      relational_statusUniques[0].attributes.forEach(attributeName => {
        queryBuilder.orderBy({
          attribute: attributeName,
          direction: "ASC"
        });
      });
      queryBuilder.setOrderIsUnique();
    },
    PRIMARY_KEY_DESC(queryBuilder) {
      relational_statusUniques[0].attributes.forEach(attributeName => {
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
    NOTE_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "note",
        direction: "ASC"
      });
    },
    NOTE_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "note",
        direction: "DESC"
      });
    },
    TYPE_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "type",
        direction: "ASC"
      });
    },
    TYPE_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "type",
        direction: "DESC"
      });
    },
    CONSTRUCTOR_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "constructor",
        direction: "ASC"
      });
    },
    CONSTRUCTOR_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "constructor",
        direction: "DESC"
      });
    }
  },
  RelationalStatusesConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
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
  YieldCondition: {
    id($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "id",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    },
    crop($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "crop",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
        }
      });
    },
    export($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "export",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
        }
      });
    }
  },
  YieldsOrderBy: {
    PRIMARY_KEY_ASC(queryBuilder) {
      yieldUniques[0].attributes.forEach(attributeName => {
        queryBuilder.orderBy({
          attribute: attributeName,
          direction: "ASC"
        });
      });
      queryBuilder.setOrderIsUnique();
    },
    PRIMARY_KEY_DESC(queryBuilder) {
      yieldUniques[0].attributes.forEach(attributeName => {
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
    CROP_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "crop",
        direction: "ASC"
      });
    },
    CROP_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "crop",
        direction: "DESC"
      });
    },
    EXPORT_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "export",
        direction: "ASC"
      });
      queryBuilder.setOrderIsUnique();
    },
    EXPORT_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "export",
        direction: "DESC"
      });
      queryBuilder.setOrderIsUnique();
    }
  },
  YieldsConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
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
  ReservedCondition: {
    id($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "id",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    },
    null($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "null",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
        }
      });
    },
    case($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "case",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
        }
      });
    },
    do($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "do",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
        }
      });
    }
  },
  ReservedsOrderBy: {
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
    NULL_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "null",
        direction: "ASC"
      });
      queryBuilder.setOrderIsUnique();
    },
    NULL_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "null",
        direction: "DESC"
      });
      queryBuilder.setOrderIsUnique();
    },
    CASE_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "case",
        direction: "ASC"
      });
      queryBuilder.setOrderIsUnique();
    },
    CASE_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "case",
        direction: "DESC"
      });
      queryBuilder.setOrderIsUnique();
    },
    DO_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "do",
        direction: "ASC"
      });
      queryBuilder.setOrderIsUnique();
    },
    DO_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "do",
        direction: "DESC"
      });
      queryBuilder.setOrderIsUnique();
    }
  },
  ReservedsConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
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
        const $insert = pgInsertSingle(pgResource___proto__PgResource, Object.create(null));
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
    createBuilding: {
      plan(_, args) {
        const $insert = pgInsertSingle(building_buildingPgResource, Object.create(null));
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
    createConstructor: {
      plan(_, args) {
        const $insert = pgInsertSingle(pgResource_constructorPgResource, Object.create(null));
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
    createCrop: {
      plan(_, args) {
        const $insert = pgInsertSingle(pgResource_cropPgResource, Object.create(null));
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
    createMachine: {
      plan(_, args) {
        const $insert = pgInsertSingle(pgResource_machinePgResource, Object.create(null));
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
    createMaterial: {
      plan(_, args) {
        const $insert = pgInsertSingle(pgResource_materialPgResource, Object.create(null));
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
    createNull: {
      plan(_, args) {
        const $insert = pgInsertSingle(pgResource_nullPgResource, Object.create(null));
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
    createProject: {
      plan(_, args) {
        const $insert = pgInsertSingle(pgResource_projectPgResource, Object.create(null));
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
    createYield: {
      plan(_, args) {
        const $insert = pgInsertSingle(pgResource_yieldPgResource, Object.create(null));
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
        const $insert = pgInsertSingle(pgResource_reservedPgResource, Object.create(null));
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
    updateProto__: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(pgResource___proto__PgResource, specFromArgs__Proto__(args));
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
    updateProtoById: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(pgResource___proto__PgResource, {
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
    updateProtoByName: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(pgResource___proto__PgResource, {
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
    updateBuilding: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(building_buildingPgResource, specFromArgs_Building(args));
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
        const $update = pgUpdateSingle(building_buildingPgResource, {
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
    updateBuildingByConstructor: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(building_buildingPgResource, specFromArgs_Building2(args));
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
    updateConstructor: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(pgResource_constructorPgResource, specFromArgs_Constructor(args));
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
    updateConstructorById: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(pgResource_constructorPgResource, {
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
    updateConstructorByExport: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(pgResource_constructorPgResource, {
          export: args.getRaw(['input', "export"])
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
    updateConstructorByName: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(pgResource_constructorPgResource, {
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
    updateCrop: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(pgResource_cropPgResource, specFromArgs_Crop(args));
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
    updateCropById: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(pgResource_cropPgResource, {
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
    updateCropByYield: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(pgResource_cropPgResource, {
          yield: args.getRaw(['input', "yield"])
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
    updateMachine: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(pgResource_machinePgResource, specFromArgs_Machine(args));
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
    updateMachineById: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(pgResource_machinePgResource, {
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
    updateMaterial: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(pgResource_materialPgResource, specFromArgs_Material(args));
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
    updateMaterialById: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(pgResource_materialPgResource, {
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
    updateMaterialByClass: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(pgResource_materialPgResource, {
          class: args.getRaw(['input', "class"])
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
    updateMaterialByValueOf: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(pgResource_materialPgResource, specFromArgs_Material2(args));
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
    updateNull: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(pgResource_nullPgResource, specFromArgs_Null(args));
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
    updateNullById: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(pgResource_nullPgResource, {
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
    updateNullByBreak: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(pgResource_nullPgResource, {
          break: args.getRaw(['input', "break"])
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
    updateNullByHasOwnProperty: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(pgResource_nullPgResource, specFromArgs_Null2(args));
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
    updateProject: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(pgResource_projectPgResource, specFromArgs_Project(args));
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
    updateProjectById: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(pgResource_projectPgResource, {
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
    updateProjectByProto__: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(pgResource_projectPgResource, specFromArgs_Project2(args));
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
    updateYield: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(pgResource_yieldPgResource, specFromArgs_Yield(args));
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
    updateYieldById: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(pgResource_yieldPgResource, {
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
    updateYieldByExport: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(pgResource_yieldPgResource, {
          export: args.getRaw(['input', "export"])
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
    updateReserved: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(pgResource_reservedPgResource, specFromArgs_Reserved(args));
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
    updateReservedById: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(pgResource_reservedPgResource, {
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
    updateReservedByCase: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(pgResource_reservedPgResource, {
          case: args.getRaw(['input', "case"])
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
    updateReservedByDo: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(pgResource_reservedPgResource, {
          do: args.getRaw(['input', "do"])
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
    updateReservedByNull: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(pgResource_reservedPgResource, {
          null: args.getRaw(['input', "null"])
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
    deleteProto__: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(pgResource___proto__PgResource, specFromArgs__Proto__2(args));
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
    deleteProtoById: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(pgResource___proto__PgResource, {
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
    deleteProtoByName: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(pgResource___proto__PgResource, {
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
    deleteBuilding: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(building_buildingPgResource, specFromArgs_Building3(args));
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
        const $delete = pgDeleteSingle(building_buildingPgResource, {
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
    deleteBuildingByConstructor: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(building_buildingPgResource, specFromArgs_Building4(args));
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
    deleteConstructor: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(pgResource_constructorPgResource, specFromArgs_Constructor2(args));
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
    deleteConstructorById: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(pgResource_constructorPgResource, {
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
    deleteConstructorByExport: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(pgResource_constructorPgResource, {
          export: args.getRaw(['input', "export"])
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
    deleteConstructorByName: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(pgResource_constructorPgResource, {
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
    deleteCrop: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(pgResource_cropPgResource, specFromArgs_Crop2(args));
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
    deleteCropById: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(pgResource_cropPgResource, {
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
    deleteCropByYield: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(pgResource_cropPgResource, {
          yield: args.getRaw(['input', "yield"])
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
    deleteMachine: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(pgResource_machinePgResource, specFromArgs_Machine2(args));
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
    deleteMachineById: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(pgResource_machinePgResource, {
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
    deleteMaterial: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(pgResource_materialPgResource, specFromArgs_Material3(args));
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
    deleteMaterialById: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(pgResource_materialPgResource, {
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
    deleteMaterialByClass: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(pgResource_materialPgResource, {
          class: args.getRaw(['input', "class"])
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
    deleteMaterialByValueOf: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(pgResource_materialPgResource, specFromArgs_Material4(args));
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
    deleteNull: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(pgResource_nullPgResource, specFromArgs_Null3(args));
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
    deleteNullById: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(pgResource_nullPgResource, {
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
    deleteNullByBreak: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(pgResource_nullPgResource, {
          break: args.getRaw(['input', "break"])
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
    deleteNullByHasOwnProperty: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(pgResource_nullPgResource, specFromArgs_Null4(args));
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
    deleteProject: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(pgResource_projectPgResource, specFromArgs_Project3(args));
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
    deleteProjectById: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(pgResource_projectPgResource, {
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
    deleteProjectByProto__: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(pgResource_projectPgResource, specFromArgs_Project4(args));
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
    deleteYield: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(pgResource_yieldPgResource, specFromArgs_Yield2(args));
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
    deleteYieldById: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(pgResource_yieldPgResource, {
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
    deleteYieldByExport: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(pgResource_yieldPgResource, {
          export: args.getRaw(['input', "export"])
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
    deleteReserved: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(pgResource_reservedPgResource, specFromArgs_Reserved2(args));
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
    deleteReservedById: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(pgResource_reservedPgResource, {
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
    deleteReservedByCase: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(pgResource_reservedPgResource, {
          case: args.getRaw(['input', "case"])
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
    deleteReservedByDo: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(pgResource_reservedPgResource, {
          do: args.getRaw(['input', "do"])
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
    deleteReservedByNull: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(pgResource_reservedPgResource, {
          null: args.getRaw(['input', "null"])
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
  CreateProtoPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    _proto__($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    _protoEdge($mutation, fieldArgs) {
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
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    }
  },
  CreateProtoInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    _proto__(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  _Proto__Input: {
    __baked: createObjectAndApplyChildren,
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
    },
    brand(obj, val, {
      field,
      schema
    }) {
      obj.set("brand", bakedInputRuntime(schema, field.type, val));
    }
  },
  CreateBuildingPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    building($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    buildingEdge($mutation, fieldArgs) {
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
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    }
  },
  CreateBuildingInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    building(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  BuildingInput: {
    __baked: createObjectAndApplyChildren,
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
    },
    constructor(obj, val, {
      field,
      schema
    }) {
      obj.set("constructor", bakedInputRuntime(schema, field.type, val));
    }
  },
  CreateConstructorPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    constructor($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    constructorEdge($mutation, fieldArgs) {
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
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    }
  },
  CreateConstructorInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    constructor(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  ConstructorInput: {
    __baked: createObjectAndApplyChildren,
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
    },
    export(obj, val, {
      field,
      schema
    }) {
      obj.set("export", bakedInputRuntime(schema, field.type, val));
    }
  },
  CreateCropPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    crop($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    cropEdge($mutation, fieldArgs) {
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
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    }
  },
  CreateCropInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    crop(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  CropInput: {
    __baked: createObjectAndApplyChildren,
    id(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    yield(obj, val, {
      field,
      schema
    }) {
      obj.set("yield", bakedInputRuntime(schema, field.type, val));
    },
    amount(obj, val, {
      field,
      schema
    }) {
      obj.set("amount", bakedInputRuntime(schema, field.type, val));
    }
  },
  CreateMachinePayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    machine($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    machineEdge($mutation, fieldArgs) {
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
          return pgResource_machinePgResource.find(spec);
        }
      })();
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    },
    buildingByConstructor($in) {
      const $record = $in.get("result");
      return building_buildingPgResource.get(specFromRecord4($record));
    }
  },
  CreateMachineInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    machine(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  MachineInput: {
    __baked: createObjectAndApplyChildren,
    id(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    input(obj, val, {
      field,
      schema
    }) {
      obj.set("input", bakedInputRuntime(schema, field.type, val));
    },
    constructor(obj, val, {
      field,
      schema
    }) {
      obj.set("constructor", bakedInputRuntime(schema, field.type, val));
    }
  },
  CreateMaterialPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    material($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    materialEdge($mutation, fieldArgs) {
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
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    }
  },
  CreateMaterialInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    material(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  MaterialInput: {
    __baked: createObjectAndApplyChildren,
    id(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    class(obj, val, {
      field,
      schema
    }) {
      obj.set("class", bakedInputRuntime(schema, field.type, val));
    },
    valueOf(obj, val, {
      field,
      schema
    }) {
      obj.set("valueOf", bakedInputRuntime(schema, field.type, val));
    }
  },
  CreateNullPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    null($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    nullEdge($mutation, fieldArgs) {
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
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    }
  },
  CreateNullInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    null(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  NullInput: {
    __baked: createObjectAndApplyChildren,
    id(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    hasOwnProperty(obj, val, {
      field,
      schema
    }) {
      obj.set("hasOwnProperty", bakedInputRuntime(schema, field.type, val));
    },
    break(obj, val, {
      field,
      schema
    }) {
      obj.set("break", bakedInputRuntime(schema, field.type, val));
    }
  },
  CreateProjectPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    project($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    projectEdge($mutation, fieldArgs) {
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
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    }
  },
  CreateProjectInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    project(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  ProjectInput: {
    __baked: createObjectAndApplyChildren,
    id(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    brand(obj, val, {
      field,
      schema
    }) {
      obj.set("brand", bakedInputRuntime(schema, field.type, val));
    },
    _proto__(obj, val, {
      field,
      schema
    }) {
      obj.set("__proto__", bakedInputRuntime(schema, field.type, val));
    }
  },
  CreateYieldPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    yield($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    yieldEdge($mutation, fieldArgs) {
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
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    }
  },
  CreateYieldInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    yield(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  YieldInput: {
    __baked: createObjectAndApplyChildren,
    id(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    crop(obj, val, {
      field,
      schema
    }) {
      obj.set("crop", bakedInputRuntime(schema, field.type, val));
    },
    export(obj, val, {
      field,
      schema
    }) {
      obj.set("export", bakedInputRuntime(schema, field.type, val));
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
          return pgResource_reservedPgResource.find(spec);
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
    id(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    null(obj, val, {
      field,
      schema
    }) {
      obj.set("null", bakedInputRuntime(schema, field.type, val));
    },
    case(obj, val, {
      field,
      schema
    }) {
      obj.set("case", bakedInputRuntime(schema, field.type, val));
    },
    do(obj, val, {
      field,
      schema
    }) {
      obj.set("do", bakedInputRuntime(schema, field.type, val));
    }
  },
  UpdateProtoPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    _proto__($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    _protoEdge($mutation, fieldArgs) {
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
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    }
  },
  UpdateProtoInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    _protoPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  _ProtoPatch: {
    __baked: createObjectAndApplyChildren,
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
    },
    brand(obj, val, {
      field,
      schema
    }) {
      obj.set("brand", bakedInputRuntime(schema, field.type, val));
    }
  },
  UpdateProtoByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    _protoPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UpdateProtoByNameInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    _protoPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UpdateBuildingPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    building($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    buildingEdge($mutation, fieldArgs) {
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
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    }
  },
  UpdateBuildingInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    buildingPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  BuildingPatch: {
    __baked: createObjectAndApplyChildren,
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
    },
    constructor(obj, val, {
      field,
      schema
    }) {
      obj.set("constructor", bakedInputRuntime(schema, field.type, val));
    }
  },
  UpdateBuildingByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    buildingPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UpdateBuildingByConstructorInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    buildingPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UpdateConstructorPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    constructor($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    constructorEdge($mutation, fieldArgs) {
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
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    }
  },
  UpdateConstructorInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    constructorPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  ConstructorPatch: {
    __baked: createObjectAndApplyChildren,
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
    },
    export(obj, val, {
      field,
      schema
    }) {
      obj.set("export", bakedInputRuntime(schema, field.type, val));
    }
  },
  UpdateConstructorByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    constructorPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UpdateConstructorByExportInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    constructorPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UpdateConstructorByNameInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    constructorPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UpdateCropPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    crop($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    cropEdge($mutation, fieldArgs) {
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
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    }
  },
  UpdateCropInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    cropPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  CropPatch: {
    __baked: createObjectAndApplyChildren,
    id(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    yield(obj, val, {
      field,
      schema
    }) {
      obj.set("yield", bakedInputRuntime(schema, field.type, val));
    },
    amount(obj, val, {
      field,
      schema
    }) {
      obj.set("amount", bakedInputRuntime(schema, field.type, val));
    }
  },
  UpdateCropByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    cropPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UpdateCropByYieldInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    cropPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UpdateMachinePayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    machine($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    machineEdge($mutation, fieldArgs) {
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
          return pgResource_machinePgResource.find(spec);
        }
      })();
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    },
    buildingByConstructor($in) {
      const $record = $in.get("result");
      return building_buildingPgResource.get(specFromRecord5($record));
    }
  },
  UpdateMachineInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    machinePatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  MachinePatch: {
    __baked: createObjectAndApplyChildren,
    id(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    input(obj, val, {
      field,
      schema
    }) {
      obj.set("input", bakedInputRuntime(schema, field.type, val));
    },
    constructor(obj, val, {
      field,
      schema
    }) {
      obj.set("constructor", bakedInputRuntime(schema, field.type, val));
    }
  },
  UpdateMachineByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    machinePatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UpdateMaterialPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    material($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    materialEdge($mutation, fieldArgs) {
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
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    }
  },
  UpdateMaterialInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    materialPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  MaterialPatch: {
    __baked: createObjectAndApplyChildren,
    id(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    class(obj, val, {
      field,
      schema
    }) {
      obj.set("class", bakedInputRuntime(schema, field.type, val));
    },
    valueOf(obj, val, {
      field,
      schema
    }) {
      obj.set("valueOf", bakedInputRuntime(schema, field.type, val));
    }
  },
  UpdateMaterialByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    materialPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UpdateMaterialByClassInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    materialPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UpdateMaterialByValueOfInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    materialPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UpdateNullPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    null($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    nullEdge($mutation, fieldArgs) {
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
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    }
  },
  UpdateNullInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    nullPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  NullPatch: {
    __baked: createObjectAndApplyChildren,
    id(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    hasOwnProperty(obj, val, {
      field,
      schema
    }) {
      obj.set("hasOwnProperty", bakedInputRuntime(schema, field.type, val));
    },
    break(obj, val, {
      field,
      schema
    }) {
      obj.set("break", bakedInputRuntime(schema, field.type, val));
    }
  },
  UpdateNullByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    nullPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UpdateNullByBreakInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    nullPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UpdateNullByHasOwnPropertyInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    nullPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UpdateProjectPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    project($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    projectEdge($mutation, fieldArgs) {
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
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    }
  },
  UpdateProjectInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    projectPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  ProjectPatch: {
    __baked: createObjectAndApplyChildren,
    id(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    brand(obj, val, {
      field,
      schema
    }) {
      obj.set("brand", bakedInputRuntime(schema, field.type, val));
    },
    _proto__(obj, val, {
      field,
      schema
    }) {
      obj.set("__proto__", bakedInputRuntime(schema, field.type, val));
    }
  },
  UpdateProjectByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    projectPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UpdateProjectByProtoInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    projectPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UpdateYieldPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    yield($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    yieldEdge($mutation, fieldArgs) {
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
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    }
  },
  UpdateYieldInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    yieldPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  YieldPatch: {
    __baked: createObjectAndApplyChildren,
    id(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    crop(obj, val, {
      field,
      schema
    }) {
      obj.set("crop", bakedInputRuntime(schema, field.type, val));
    },
    export(obj, val, {
      field,
      schema
    }) {
      obj.set("export", bakedInputRuntime(schema, field.type, val));
    }
  },
  UpdateYieldByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    yieldPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UpdateYieldByExportInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    yieldPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
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
          return pgResource_reservedPgResource.find(spec);
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
  UpdateReservedInput: {
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
    id(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    null(obj, val, {
      field,
      schema
    }) {
      obj.set("null", bakedInputRuntime(schema, field.type, val));
    },
    case(obj, val, {
      field,
      schema
    }) {
      obj.set("case", bakedInputRuntime(schema, field.type, val));
    },
    do(obj, val, {
      field,
      schema
    }) {
      obj.set("do", bakedInputRuntime(schema, field.type, val));
    }
  },
  UpdateReservedByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    reservedPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UpdateReservedByCaseInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    reservedPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UpdateReservedByDoInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    reservedPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UpdateReservedByNullInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    reservedPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  DeleteProtoPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    _proto__($object) {
      return $object.get("result");
    },
    deletedProtoId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName._Proto__.plan($record);
      return lambda(specifier, nodeIdHandler_RelationalTopic_codec_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    _protoEdge($mutation, fieldArgs) {
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
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    }
  },
  DeleteProtoInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteProtoByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteProtoByNameInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteBuildingPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    building($object) {
      return $object.get("result");
    },
    deletedBuildingId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.Building.plan($record);
      return lambda(specifier, nodeIdHandler_RelationalTopic_codec_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    buildingEdge($mutation, fieldArgs) {
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
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    }
  },
  DeleteBuildingInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteBuildingByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteBuildingByConstructorInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteConstructorPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    constructor($object) {
      return $object.get("result");
    },
    deletedConstructorId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.Constructor.plan($record);
      return lambda(specifier, nodeIdHandler_RelationalTopic_codec_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    constructorEdge($mutation, fieldArgs) {
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
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    }
  },
  DeleteConstructorInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteConstructorByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteConstructorByExportInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteConstructorByNameInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteCropPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    crop($object) {
      return $object.get("result");
    },
    deletedCropId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.Crop.plan($record);
      return lambda(specifier, nodeIdHandler_RelationalTopic_codec_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    cropEdge($mutation, fieldArgs) {
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
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    }
  },
  DeleteCropInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteCropByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteCropByYieldInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteMachinePayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    machine($object) {
      return $object.get("result");
    },
    deletedMachineId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.Machine.plan($record);
      return lambda(specifier, nodeIdHandler_RelationalTopic_codec_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    machineEdge($mutation, fieldArgs) {
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
          return pgResource_machinePgResource.find(spec);
        }
      })();
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    },
    buildingByConstructor($in) {
      const $record = $in.get("result");
      return building_buildingPgResource.get(specFromRecord6($record));
    }
  },
  DeleteMachineInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteMachineByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteMaterialPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    material($object) {
      return $object.get("result");
    },
    deletedMaterialId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.Material.plan($record);
      return lambda(specifier, nodeIdHandler_RelationalTopic_codec_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    materialEdge($mutation, fieldArgs) {
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
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    }
  },
  DeleteMaterialInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteMaterialByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteMaterialByClassInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteMaterialByValueOfInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteNullPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    null($object) {
      return $object.get("result");
    },
    deletedNullId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.Null.plan($record);
      return lambda(specifier, nodeIdHandler_RelationalTopic_codec_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    nullEdge($mutation, fieldArgs) {
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
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    }
  },
  DeleteNullInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteNullByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteNullByBreakInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteNullByHasOwnPropertyInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteProjectPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    project($object) {
      return $object.get("result");
    },
    deletedProjectId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.Project.plan($record);
      return lambda(specifier, nodeIdHandler_RelationalTopic_codec_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    projectEdge($mutation, fieldArgs) {
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
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    }
  },
  DeleteProjectInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteProjectByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteProjectByProtoInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteYieldPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    yield($object) {
      return $object.get("result");
    },
    deletedYieldId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.Yield.plan($record);
      return lambda(specifier, nodeIdHandler_RelationalTopic_codec_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    yieldEdge($mutation, fieldArgs) {
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
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    }
  },
  DeleteYieldInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteYieldByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteYieldByExportInput: {
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
    deletedReservedId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.Reserved.plan($record);
      return lambda(specifier, nodeIdHandler_RelationalTopic_codec_base64JSON.encode);
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
          return pgResource_reservedPgResource.find(spec);
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
  DeleteReservedInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteReservedByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteReservedByCaseInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteReservedByDoInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteReservedByNullInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  }
};
export const schema = makeGrafastSchema({
  typeDefs: typeDefs,
  plans: plans
});
