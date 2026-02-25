import { PgDeleteSingleStep, PgExecutor, PgSelectSingleStep, TYPES, assertPgClassSingleStep, enumCodec, makeRegistry, pgClassExpression, pgDeleteSingle, pgFromExpression, pgInsertSingle, pgSelectFromRecord, pgSelectSingleFromRecord, pgUpdateSingle, recordCodec, sqlFromArgDigests, sqlValueWithCodec } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ObjectStep, __ValueStep, access, assertStep, bakedInput, bakedInputRuntime, connection, constant, context, createObjectAndApplyChildren, first, get as get2, inhibitOnNull, inspect, lambda, list, makeDecodeNodeId, makeGrafastSchema, markSyncAndSafe, object, operationPlan, rootValue, specFromNodeId, stepAMayDependOnStepB, trap } from "grafast";
import { GraphQLError, Kind } from "graphql";
import { sql } from "pg-sql2";
const pkCols = ["id"];
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
    }
  }
});
const relationalTopicsCodec = recordCodec({
  name: "relationalTopics",
  identifier: relationalTopicsIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      identicalVia: "relationalItemsByMyId"
    },
    title: {
      codec: TYPES.text,
      notNull: true
    },
    type: {
      codec: itemTypeCodec,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    constructor: {
      codec: TYPES.text,
      notNull: undefined,
      hasDefault: undefined,
      via: "relationalItemsByMyId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "js_reserved",
      name: "relational_topics"
    },
    relationalInterfaceCodecName: "relationalItems"
  },
  executor: executor
});
const __proto__Identifier = sql.identifier("js_reserved", "__proto__");
const __proto__Codec = recordCodec({
  name: "__proto__",
  identifier: __proto__Identifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    name: {
      codec: TYPES.text
    },
    brand: {
      codec: TYPES.text
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "js_reserved",
      name: "__proto__"
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
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    name: {
      codec: TYPES.text
    },
    constructor: {
      codec: TYPES.text
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "js_reserved",
      name: "building"
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
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    name: {
      codec: TYPES.text
    },
    export: {
      codec: TYPES.text
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "js_reserved",
      name: "constructor"
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
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    yield: {
      codec: TYPES.text
    },
    amount: {
      codec: TYPES.int
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "js_reserved",
      name: "crop"
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
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    input: {
      codec: TYPES.text
    },
    constructor: {
      codec: TYPES.text
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "js_reserved",
      name: "machine"
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
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    class: {
      codec: TYPES.text
    },
    valueOf: {
      codec: TYPES.text
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "js_reserved",
      name: "material"
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
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    hasOwnProperty: {
      codec: TYPES.text
    },
    break: {
      codec: TYPES.text
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "js_reserved",
      name: "null"
    }
  },
  executor: executor
});
const projectIdentifier = sql.identifier("js_reserved", "project");
const projectCodec = recordCodec({
  name: "project",
  identifier: projectIdentifier,
  attributes: Object.fromEntries([["id", {
    codec: TYPES.int,
    notNull: true,
    hasDefault: true
  }], ["brand", {
    codec: TYPES.text
  }], ["__proto__", {
    codec: TYPES.text
  }]]),
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "js_reserved",
      name: "project"
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
      codec: TYPES.int,
      notNull: true,
      identicalVia: "relationalItemsByMyId"
    },
    description: {
      codec: TYPES.text,
      hasDefault: true
    },
    note: {
      codec: TYPES.text
    },
    type: {
      codec: itemTypeCodec,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    constructor: {
      codec: TYPES.text,
      notNull: undefined,
      hasDefault: undefined,
      via: "relationalItemsByMyId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "js_reserved",
      name: "relational_status"
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
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    crop: {
      codec: TYPES.text
    },
    export: {
      codec: TYPES.text
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "js_reserved",
      name: "yield"
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
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    null: {
      codec: TYPES.text
    },
    case: {
      codec: TYPES.text
    },
    do: {
      codec: TYPES.text
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "js_reserved",
      name: "reserved"
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
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    type: {
      codec: itemTypeCodec,
      notNull: true,
      hasDefault: true
    },
    constructor: {
      codec: TYPES.text
    }
  },
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
const relational_topics_resourceOptionsConfig = {
  executor: executor,
  name: "relational_topics",
  identifier: "main.js_reserved.relational_topics",
  from: relationalTopicsIdentifier,
  codec: relationalTopicsCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "js_reserved",
      name: "relational_topics"
    }
  },
  uniques: [{
    attributes: pkCols,
    isPrimary: true
  }]
};
const __proto__Uniques = [{
  attributes: ["id"],
  isPrimary: true
}, {
  attributes: ["name"]
}];
const buildingUniques = [{
  attributes: ["id"],
  isPrimary: true
}, {
  attributes: ["constructor"]
}];
const building_resourceOptionsConfig = {
  executor: executor,
  name: "building",
  identifier: "main.js_reserved.building",
  from: buildingIdentifier,
  codec: buildingCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "js_reserved",
      name: "building"
    }
  },
  uniques: buildingUniques
};
const constructorUniques = [{
  attributes: ["id"],
  isPrimary: true
}, {
  attributes: ["export"]
}, {
  attributes: ["name"]
}];
const cropUniques = [{
  attributes: ["id"],
  isPrimary: true
}, {
  attributes: ["yield"]
}];
const machineUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const machine_resourceOptionsConfig = {
  executor: executor,
  name: "machine",
  identifier: "main.js_reserved.machine",
  from: machineIdentifier,
  codec: machineCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "js_reserved",
      name: "machine"
    }
  },
  uniques: machineUniques
};
const materialUniques = [{
  attributes: ["id"],
  isPrimary: true
}, {
  attributes: ["class"]
}, {
  attributes: ["valueOf"]
}];
const nullUniques = [{
  attributes: ["id"],
  isPrimary: true
}, {
  attributes: ["break"]
}, {
  attributes: ["hasOwnProperty"]
}];
const projectUniques = [{
  attributes: ["id"],
  isPrimary: true
}, {
  attributes: ["__proto__"]
}];
const relational_statusUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const relational_status_resourceOptionsConfig = {
  executor: executor,
  name: "relational_status",
  identifier: "main.js_reserved.relational_status",
  from: relationalStatusIdentifier,
  codec: relationalStatusCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "js_reserved",
      name: "relational_status"
    }
  },
  uniques: relational_statusUniques
};
const yieldUniques = [{
  attributes: ["id"],
  isPrimary: true
}, {
  attributes: ["export"]
}];
const reservedUniques = [{
  attributes: ["id"],
  isPrimary: true
}, {
  attributes: ["case"]
}, {
  attributes: ["do"]
}, {
  attributes: ["null"]
}];
const relational_itemsUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const relational_items_resourceOptionsConfig = {
  executor: executor,
  name: "relational_items",
  identifier: "main.js_reserved.relational_items",
  from: relationalItemsIdentifier,
  codec: relationalItemsCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "js_reserved",
      name: "relational_items"
    },
    tags: {
      interface: "mode:relational type:type",
      type: ["TOPIC references:relational_topics", "STATUS references:relational_status"]
    }
  },
  uniques: relational_itemsUniques
};
const registryConfig = {
  pgExecutors: {
    __proto__: null,
    main: executor
  },
  pgCodecs: Object.fromEntries([["int4", TYPES.int], ["relationalTopics", relationalTopicsCodec], ["text", TYPES.text], ["__proto__", __proto__Codec], ["building", buildingCodec], ["constructor", constructorCodec], ["crop", cropCodec], ["machine", machineCodec], ["material", materialCodec], ["null", nullCodec], ["project", projectCodec], ["relationalStatus", relationalStatusCodec], ["yield", yieldCodec], ["reserved", reservedCodec], ["relationalItems", relationalItemsCodec], ["itemType", itemTypeCodec], ["varchar", TYPES.varchar], ["bpchar", TYPES.bpchar], ["LetterAToDEnum", enumCodec({
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
  })], ["LetterAToDViaViewEnum", enumCodec({
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
  })], ["EnumTheFirstEnum", enumCodec({
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
  })], ["EnumTheSecondEnum", enumCodec({
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
  })], ["LotsOfEnumsEnum3Enum", enumCodec({
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
  })], ["LotsOfEnumsEnum4Enum", enumCodec({
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
  })], ["SimpleEnumEnum", enumCodec({
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
  })], ["EntityKindsEnum", enumCodec({
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
  })], ["EnumTableTransportationEnum", enumCodec({
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
  })], ["LengthStatusEnum", enumCodec({
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
  })], ["StageOptionsEnum", enumCodec({
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
  })]]),
  pgResources: Object.fromEntries([["await", {
    executor: executor,
    name: "await",
    identifier: "main.js_reserved.await(int4,int4,int4,int4)",
    from(...args) {
      return sql`${awaitFunctionIdentifer}(${sqlFromArgDigests(args)})`;
    },
    parameters: [{
      name: "yield",
      codec: TYPES.int
    }, {
      name: "__proto__",
      codec: TYPES.int
    }, {
      name: "constructor",
      codec: TYPES.int
    }, {
      name: "hasOwnProperty",
      codec: TYPES.int
    }],
    codec: TYPES.int,
    hasImplicitOrder: false,
    extensions: {
      pg: {
        serviceName: "main",
        schemaName: "js_reserved",
        name: "await"
      }
    },
    isUnique: true
  }], ["case", {
    executor: executor,
    name: "case",
    identifier: "main.js_reserved.case(int4,int4,int4,int4)",
    from(...args) {
      return sql`${caseFunctionIdentifer}(${sqlFromArgDigests(args)})`;
    },
    parameters: [{
      name: "yield",
      codec: TYPES.int
    }, {
      name: "__proto__",
      codec: TYPES.int
    }, {
      name: "constructor",
      codec: TYPES.int
    }, {
      name: "hasOwnProperty",
      codec: TYPES.int
    }],
    codec: TYPES.int,
    hasImplicitOrder: false,
    extensions: {
      pg: {
        serviceName: "main",
        schemaName: "js_reserved",
        name: "case"
      }
    },
    isUnique: true
  }], ["valueOf", {
    executor: executor,
    name: "valueOf",
    identifier: "main.js_reserved.valueOf(int4,int4,int4,int4)",
    from(...args) {
      return sql`${valueOfFunctionIdentifer}(${sqlFromArgDigests(args)})`;
    },
    parameters: [{
      name: "yield",
      codec: TYPES.int
    }, {
      name: "__proto__",
      codec: TYPES.int
    }, {
      name: "constructor",
      codec: TYPES.int
    }, {
      name: "hasOwnProperty",
      codec: TYPES.int
    }],
    codec: TYPES.int,
    hasImplicitOrder: false,
    extensions: {
      pg: {
        serviceName: "main",
        schemaName: "js_reserved",
        name: "valueOf"
      }
    },
    isUnique: true
  }], ["null_yield", {
    executor: executor,
    name: "null_yield",
    identifier: "main.js_reserved.null_yield(js_reserved.null,int4,int4,int4,int4)",
    from(...args) {
      return sql`${null_yieldFunctionIdentifer}(${sqlFromArgDigests(args)})`;
    },
    parameters: [{
      name: "n",
      codec: nullCodec
    }, {
      name: "yield",
      codec: TYPES.int
    }, {
      name: "__proto__",
      codec: TYPES.int
    }, {
      name: "constructor",
      codec: TYPES.int
    }, {
      name: "valueOf",
      codec: TYPES.int
    }],
    codec: TYPES.int,
    hasImplicitOrder: false,
    extensions: {
      pg: {
        serviceName: "main",
        schemaName: "js_reserved",
        name: "null_yield"
      }
    },
    isUnique: true
  }], ["relational_topics", relational_topics_resourceOptionsConfig], ["__proto__", {
    executor: executor,
    name: "__proto__",
    identifier: "main.js_reserved.__proto__",
    from: __proto__Identifier,
    codec: __proto__Codec,
    extensions: {
      pg: {
        serviceName: "main",
        schemaName: "js_reserved",
        name: "__proto__"
      }
    },
    uniques: __proto__Uniques
  }], ["building", building_resourceOptionsConfig], ["constructor", {
    executor: executor,
    name: "constructor",
    identifier: "main.js_reserved.constructor",
    from: constructorIdentifier,
    codec: constructorCodec,
    extensions: {
      pg: {
        serviceName: "main",
        schemaName: "js_reserved",
        name: "constructor"
      }
    },
    uniques: constructorUniques
  }], ["crop", {
    executor: executor,
    name: "crop",
    identifier: "main.js_reserved.crop",
    from: cropIdentifier,
    codec: cropCodec,
    extensions: {
      pg: {
        serviceName: "main",
        schemaName: "js_reserved",
        name: "crop"
      }
    },
    uniques: cropUniques
  }], ["machine", machine_resourceOptionsConfig], ["material", {
    executor: executor,
    name: "material",
    identifier: "main.js_reserved.material",
    from: materialIdentifier,
    codec: materialCodec,
    extensions: {
      pg: {
        serviceName: "main",
        schemaName: "js_reserved",
        name: "material"
      }
    },
    uniques: materialUniques
  }], ["null", {
    executor: executor,
    name: "null",
    identifier: "main.js_reserved.null",
    from: nullIdentifier,
    codec: nullCodec,
    extensions: {
      pg: {
        serviceName: "main",
        schemaName: "js_reserved",
        name: "null"
      }
    },
    uniques: nullUniques
  }], ["project", {
    executor: executor,
    name: "project",
    identifier: "main.js_reserved.project",
    from: projectIdentifier,
    codec: projectCodec,
    extensions: {
      pg: {
        serviceName: "main",
        schemaName: "js_reserved",
        name: "project"
      }
    },
    uniques: projectUniques
  }], ["relational_status", relational_status_resourceOptionsConfig], ["yield", {
    executor: executor,
    name: "yield",
    identifier: "main.js_reserved.yield",
    from: yieldIdentifier,
    codec: yieldCodec,
    extensions: {
      pg: {
        serviceName: "main",
        schemaName: "js_reserved",
        name: "yield"
      }
    },
    uniques: yieldUniques
  }], ["reserved", {
    executor: executor,
    name: "reserved",
    identifier: "main.js_reserved.reserved",
    from: reservedIdentifier,
    codec: reservedCodec,
    extensions: {
      pg: {
        serviceName: "main",
        schemaName: "js_reserved",
        name: "reserved"
      }
    },
    uniques: reservedUniques
  }], ["relational_items", relational_items_resourceOptionsConfig]]),
  pgRelations: {
    __proto__: null,
    building: {
      __proto__: null,
      machinesByTheirConstructor: {
        localCodec: buildingCodec,
        remoteResourceOptions: machine_resourceOptionsConfig,
        localAttributes: ["constructor"],
        remoteAttributes: ["constructor"],
        isReferencee: true
      },
      relationalItemsByTheirConstructor: {
        localCodec: buildingCodec,
        remoteResourceOptions: relational_items_resourceOptionsConfig,
        localAttributes: ["constructor"],
        remoteAttributes: ["constructor"],
        isReferencee: true
      }
    },
    machine: {
      __proto__: null,
      buildingByMyConstructor: {
        localCodec: machineCodec,
        remoteResourceOptions: building_resourceOptionsConfig,
        localAttributes: ["constructor"],
        remoteAttributes: ["constructor"],
        isUnique: true
      }
    },
    relationalItems: {
      __proto__: null,
      buildingByMyConstructor: {
        localCodec: relationalItemsCodec,
        remoteResourceOptions: building_resourceOptionsConfig,
        localAttributes: ["constructor"],
        remoteAttributes: ["constructor"],
        isUnique: true
      },
      relationalTopicsByTheirId: {
        localCodec: relationalItemsCodec,
        remoteResourceOptions: relational_topics_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["id"],
        isUnique: true,
        isReferencee: true
      },
      relationalStatusByTheirId: {
        localCodec: relationalItemsCodec,
        remoteResourceOptions: relational_status_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["id"],
        isUnique: true,
        isReferencee: true
      }
    },
    relationalStatus: {
      __proto__: null,
      relationalItemsByMyId: {
        localCodec: relationalStatusCodec,
        remoteResourceOptions: relational_items_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["id"],
        isUnique: true
      }
    },
    relationalTopics: {
      __proto__: null,
      relationalItemsByMyId: {
        localCodec: relationalTopicsCodec,
        remoteResourceOptions: relational_items_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["id"],
        isUnique: true
      }
    }
  }
};
const registry = makeRegistry(registryConfig);
const resource_relational_topicsPgResource = registry.pgResources["relational_topics"];
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
const base64JSONNodeIdCodec = {
  name: "base64JSON",
  encode: markSyncAndSafe(function base64JSONEncode(value) {
    return Buffer.from(JSON.stringify(value), "utf8").toString("base64");
  }),
  decode: markSyncAndSafe(function base64JSONDecode(value) {
    return JSON.parse(Buffer.from(value, "base64").toString("utf8"));
  })
};
const nodeIdHandler_RelationalTopic = makeTableNodeIdHandler({
  typeName: "RelationalTopic",
  identifier: "relational_topics",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_relational_topicsPgResource,
  pk: pkCols
});
const rawNodeIdCodec = {
  name: "raw",
  encode: markSyncAndSafe(function rawEncode(value) {
    return typeof value === "string" ? value : null;
  }),
  decode: markSyncAndSafe(function rawDecode(value) {
    return typeof value === "string" ? value : null;
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
const building_buildingPgResource = registry.pgResources["building"];
const relational_items_relational_itemsPgResource = registry.pgResources["relational_items"];
function RelationalTopic_buildingByConstructorPlan($record) {
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
const spec_resource___proto__PgResource = registry.pgResources["__proto__"];
const nodeIdHandler__Proto__ = makeTableNodeIdHandler({
  typeName: "_Proto__",
  identifier: "__proto__S",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: spec_resource___proto__PgResource,
  pk: __proto__Uniques[0].attributes
});
const nodeIdHandler_Building = makeTableNodeIdHandler({
  typeName: "Building",
  identifier: "buildings",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: building_buildingPgResource,
  pk: buildingUniques[0].attributes
});
const spec_resource_constructorPgResource = registry.pgResources["constructor"];
const nodeIdHandler_Constructor = makeTableNodeIdHandler({
  typeName: "Constructor",
  identifier: "constructors",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: spec_resource_constructorPgResource,
  pk: constructorUniques[0].attributes
});
const spec_resource_cropPgResource = registry.pgResources["crop"];
const nodeIdHandler_Crop = makeTableNodeIdHandler({
  typeName: "Crop",
  identifier: "crops",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: spec_resource_cropPgResource,
  pk: cropUniques[0].attributes
});
const spec_resource_machinePgResource = registry.pgResources["machine"];
const nodeIdHandler_Machine = makeTableNodeIdHandler({
  typeName: "Machine",
  identifier: "machines",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: spec_resource_machinePgResource,
  pk: machineUniques[0].attributes
});
const spec_resource_materialPgResource = registry.pgResources["material"];
const nodeIdHandler_Material = makeTableNodeIdHandler({
  typeName: "Material",
  identifier: "materials",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: spec_resource_materialPgResource,
  pk: materialUniques[0].attributes
});
const spec_resource_nullPgResource = registry.pgResources["null"];
const nodeIdHandler_Null = makeTableNodeIdHandler({
  typeName: "Null",
  identifier: "nulls",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: spec_resource_nullPgResource,
  pk: nullUniques[0].attributes
});
const spec_resource_projectPgResource = registry.pgResources["project"];
const nodeIdHandler_Project = makeTableNodeIdHandler({
  typeName: "Project",
  identifier: "projects",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: spec_resource_projectPgResource,
  pk: projectUniques[0].attributes
});
const spec_resource_relational_statusPgResource = registry.pgResources["relational_status"];
const nodeIdHandler_RelationalStatus = makeTableNodeIdHandler({
  typeName: "RelationalStatus",
  identifier: "relational_statuses",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: spec_resource_relational_statusPgResource,
  pk: relational_statusUniques[0].attributes
});
const spec_resource_yieldPgResource = registry.pgResources["yield"];
const nodeIdHandler_Yield = makeTableNodeIdHandler({
  typeName: "Yield",
  identifier: "yields",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: spec_resource_yieldPgResource,
  pk: yieldUniques[0].attributes
});
const spec_resource_reservedPgResource = registry.pgResources["reserved"];
const nodeIdHandler_Reserved = makeTableNodeIdHandler({
  typeName: "Reserved",
  identifier: "reserveds",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: spec_resource_reservedPgResource,
  pk: reservedUniques[0].attributes
});
const nodeIdHandlerByTypeName = {
  __proto__: null,
  Query: {
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
  },
  RelationalTopic: nodeIdHandler_RelationalTopic,
  _Proto__: nodeIdHandler__Proto__,
  Building: nodeIdHandler_Building,
  Constructor: nodeIdHandler_Constructor,
  Crop: nodeIdHandler_Crop,
  Machine: nodeIdHandler_Machine,
  Material: nodeIdHandler_Material,
  Null: nodeIdHandler_Null,
  Project: nodeIdHandler_Project,
  RelationalStatus: nodeIdHandler_RelationalStatus,
  Yield: nodeIdHandler_Yield,
  Reserved: nodeIdHandler_Reserved
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
const relational_items_pkColumnsByRelatedCodecName = Object.fromEntries([["relationalTopics", pkCols], ["relationalStatus", relational_statusUniques[0].attributes]]);
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
const applyConditionArg = (_condition, $select, arg) => {
  arg.apply($select, qbWhereBuilder);
};
function applyOrderByArg(parent, $select, value) {
  value.apply($select);
}
const specFromRecord2 = $record => {
  return registryConfig.pgRelations.building.relationalItemsByTheirConstructor.remoteAttributes.reduce((memo, remoteAttributeName, i) => {
    memo[remoteAttributeName] = $record.get(registryConfig.pgRelations.building.relationalItemsByTheirConstructor.localAttributes[i]);
    return memo;
  }, Object.create(null));
};
const totalCountConnectionPlan = $connection => $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
const specFromRecord3 = $record => {
  return registryConfig.pgRelations.machine.buildingByMyConstructor.remoteAttributes.reduce((memo, remoteAttributeName, i) => {
    memo[remoteAttributeName] = $record.get(registryConfig.pgRelations.machine.buildingByMyConstructor.localAttributes[i]);
    return memo;
  }, Object.create(null));
};
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
const MachineCondition_idApply = ($condition, val) => applyAttributeCondition("id", TYPES.int, $condition, val);
const MachineCondition_constructorApply = ($condition, val) => applyAttributeCondition("constructor", TYPES.text, $condition, val);
const MachinesOrderBy_ID_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "id",
    direction: "ASC"
  });
  queryBuilder.setOrderIsUnique();
};
const MachinesOrderBy_ID_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "id",
    direction: "DESC"
  });
  queryBuilder.setOrderIsUnique();
};
const MachinesOrderBy_CONSTRUCTOR_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "constructor",
    direction: "ASC"
  });
};
const MachinesOrderBy_CONSTRUCTOR_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "constructor",
    direction: "DESC"
  });
};
const RelationalItemsOrderBy_TYPE_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "type",
    direction: "DESC"
  });
};
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
  pgCodec: TYPES.int,
  postgresArgName: "yield"
}, {
  graphqlArgName: "_proto__",
  pgCodec: TYPES.int,
  postgresArgName: "__proto__"
}, {
  graphqlArgName: "constructor",
  pgCodec: TYPES.int,
  postgresArgName: "constructor"
}, {
  graphqlArgName: "hasOwnProperty",
  pgCodec: TYPES.int,
  postgresArgName: "hasOwnProperty"
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
const makeArgs_await = (args, path = []) => argDetailsSimple_await.map(details => makeArg(path, args, details));
const resource_awaitPgResource = registry.pgResources["await"];
const argDetailsSimple_case = [{
  graphqlArgName: "yield",
  pgCodec: TYPES.int,
  postgresArgName: "yield"
}, {
  graphqlArgName: "_proto__",
  pgCodec: TYPES.int,
  postgresArgName: "__proto__"
}, {
  graphqlArgName: "constructor",
  pgCodec: TYPES.int,
  postgresArgName: "constructor"
}, {
  graphqlArgName: "hasOwnProperty",
  pgCodec: TYPES.int,
  postgresArgName: "hasOwnProperty"
}];
const makeArgs_case = (args, path = []) => argDetailsSimple_case.map(details => makeArg(path, args, details));
const resource_casePgResource = registry.pgResources["case"];
const argDetailsSimple_valueOf = [{
  graphqlArgName: "yield",
  pgCodec: TYPES.int,
  postgresArgName: "yield"
}, {
  graphqlArgName: "_proto__",
  pgCodec: TYPES.int,
  postgresArgName: "__proto__"
}, {
  graphqlArgName: "constructor",
  pgCodec: TYPES.int,
  postgresArgName: "constructor"
}, {
  graphqlArgName: "hasOwnProperty",
  pgCodec: TYPES.int,
  postgresArgName: "hasOwnProperty"
}];
const makeArgs_valueOf = (args, path = []) => argDetailsSimple_valueOf.map(details => makeArg(path, args, details));
const resource_valueOfPgResource = registry.pgResources["valueOf"];
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
const nodeFetcher_RelationalTopic = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_RelationalTopic));
  return nodeIdHandler_RelationalTopic.get(nodeIdHandler_RelationalTopic.getSpec($decoded));
};
const nodeFetcher__Proto__ = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler__Proto__));
  return nodeIdHandler__Proto__.get(nodeIdHandler__Proto__.getSpec($decoded));
};
const nodeFetcher_Building = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Building));
  return nodeIdHandler_Building.get(nodeIdHandler_Building.getSpec($decoded));
};
const nodeFetcher_Constructor = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Constructor));
  return nodeIdHandler_Constructor.get(nodeIdHandler_Constructor.getSpec($decoded));
};
const nodeFetcher_Crop = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Crop));
  return nodeIdHandler_Crop.get(nodeIdHandler_Crop.getSpec($decoded));
};
const nodeFetcher_Machine = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Machine));
  return nodeIdHandler_Machine.get(nodeIdHandler_Machine.getSpec($decoded));
};
const nodeFetcher_Material = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Material));
  return nodeIdHandler_Material.get(nodeIdHandler_Material.getSpec($decoded));
};
const nodeFetcher_Null = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Null));
  return nodeIdHandler_Null.get(nodeIdHandler_Null.getSpec($decoded));
};
const nodeFetcher_Project = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Project));
  return nodeIdHandler_Project.get(nodeIdHandler_Project.getSpec($decoded));
};
const nodeFetcher_RelationalStatus = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_RelationalStatus));
  return nodeIdHandler_RelationalStatus.get(nodeIdHandler_RelationalStatus.getSpec($decoded));
};
const nodeFetcher_Yield = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Yield));
  return nodeIdHandler_Yield.get(nodeIdHandler_Yield.getSpec($decoded));
};
const nodeFetcher_Reserved = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Reserved));
  return nodeIdHandler_Reserved.get(nodeIdHandler_Reserved.getSpec($decoded));
};
const argDetailsSimple_null_yield = [{
  graphqlArgName: "yield",
  pgCodec: TYPES.int,
  postgresArgName: "yield"
}, {
  graphqlArgName: "_proto__",
  pgCodec: TYPES.int,
  postgresArgName: "__proto__"
}, {
  graphqlArgName: "constructor",
  pgCodec: TYPES.int,
  postgresArgName: "constructor"
}, {
  graphqlArgName: "valueOf",
  pgCodec: TYPES.int,
  postgresArgName: "valueOf"
}];
const makeArgs_null_yield = (args, path = []) => argDetailsSimple_null_yield.map(details => makeArg(path, args, details));
const resource_null_yieldPgResource = registry.pgResources["null_yield"];
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
    const canUseExpressionDirectly = $in instanceof PgSelectSingleStep && $in.getClassStep().mode !== "mutation" && extraSelectArgs.every(a => stepAMayDependOnStepB($in.getClassStep(), a.step));
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
const scalarComputed = ($in, args) => {
  const {
    $row,
    selectArgs
  } = pgFunctionArgumentsFromArgs($in, args, true);
  const from = pgFromExpression($row, resource_null_yieldPgResource.from, resource_null_yieldPgResource.parameters, selectArgs);
  return pgClassExpression($row, resource_null_yieldPgResource.codec, undefined)`${from}`;
};
function RelationalTopicCondition_typeApply($condition, val) {
  const queryBuilder = $condition.dangerouslyGetParent();
  const alias = queryBuilder.singleRelation("relationalItemsByMyId");
  const expression = sql`${alias}.${sql.identifier("type")}`;
  const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, itemTypeCodec)}`;
  $condition.where(condition);
}
function RelationalTopicCondition_constructorApply($condition, val) {
  const queryBuilder = $condition.dangerouslyGetParent();
  const alias = queryBuilder.singleRelation("relationalItemsByMyId");
  const expression = sql`${alias}.${sql.identifier("constructor")}`;
  const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
  $condition.where(condition);
}
const RelationalTopicsOrderBy_TYPE_ASCApply = queryBuilder => {
  const alias = queryBuilder.singleRelation("relationalItemsByMyId");
  queryBuilder.orderBy({
    fragment: sql`${alias}.${sql.identifier("type")}`,
    codec: itemTypeCodec,
    direction: "ASC"
  });
};
const RelationalTopicsOrderBy_CONSTRUCTOR_ASCApply = queryBuilder => {
  const alias = queryBuilder.singleRelation("relationalItemsByMyId");
  queryBuilder.orderBy({
    fragment: sql`${alias}.${sql.identifier("constructor")}`,
    codec: TYPES.text,
    direction: "ASC"
  });
};
const _ProtoCondition_nameApply = ($condition, val) => applyAttributeCondition("name", TYPES.text, $condition, val);
const _ProtoCondition_brandApply = ($condition, val) => applyAttributeCondition("brand", TYPES.text, $condition, val);
const _ProtoSOrderBy_NAME_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "name",
    direction: "ASC"
  });
  queryBuilder.setOrderIsUnique();
};
const _ProtoSOrderBy_NAME_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "name",
    direction: "DESC"
  });
  queryBuilder.setOrderIsUnique();
};
const _ProtoSOrderBy_BRAND_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "brand",
    direction: "ASC"
  });
};
const _ProtoSOrderBy_BRAND_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "brand",
    direction: "DESC"
  });
};
const ConstructorCondition_exportApply = ($condition, val) => applyAttributeCondition("export", TYPES.text, $condition, val);
const ConstructorsOrderBy_EXPORT_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "export",
    direction: "ASC"
  });
  queryBuilder.setOrderIsUnique();
};
const ConstructorsOrderBy_EXPORT_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "export",
    direction: "DESC"
  });
  queryBuilder.setOrderIsUnique();
};
function applyInputToInsert(_, $object) {
  return $object;
}
const specFromArgs__Proto__ = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler__Proto__, $nodeId);
};
function applyInputToUpdateOrDelete(_, $object) {
  return $object;
}
const specFromArgs_Building = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Building, $nodeId);
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
  return specFromNodeId(nodeIdHandler_Constructor, $nodeId);
};
const specFromArgs_Crop = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Crop, $nodeId);
};
const specFromArgs_Machine = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Machine, $nodeId);
};
const specFromArgs_Material = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Material, $nodeId);
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
  return specFromNodeId(nodeIdHandler_Null, $nodeId);
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
  return specFromNodeId(nodeIdHandler_Project, $nodeId);
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
  return specFromNodeId(nodeIdHandler_Yield, $nodeId);
};
const specFromArgs_Reserved = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Reserved, $nodeId);
};
const uniqueAttributes5 = [["constructor", "constructor"]];
const specFromArgs_Building4 = args => {
  return uniqueAttributes5.reduce((memo, [attributeName, fieldName]) => {
    memo[attributeName] = args.getRaw(["input", fieldName]);
    return memo;
  }, Object.create(null));
};
const uniqueAttributes6 = [["valueOf", "valueOf"]];
const specFromArgs_Material4 = args => {
  return uniqueAttributes6.reduce((memo, [attributeName, fieldName]) => {
    memo[attributeName] = args.getRaw(["input", fieldName]);
    return memo;
  }, Object.create(null));
};
const uniqueAttributes7 = [["hasOwnProperty", "hasOwnProperty"]];
const specFromArgs_Null4 = args => {
  return uniqueAttributes7.reduce((memo, [attributeName, fieldName]) => {
    memo[attributeName] = args.getRaw(["input", fieldName]);
    return memo;
  }, Object.create(null));
};
const uniqueAttributes8 = [["__proto__", "_proto__"]];
const specFromArgs_Project4 = args => {
  return uniqueAttributes8.reduce((memo, [attributeName, fieldName]) => {
    memo[attributeName] = args.getRaw(["input", fieldName]);
    return memo;
  }, Object.create(null));
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
const CreateProtoPayload__protoEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(spec_resource___proto__PgResource, __proto__Uniques[0].attributes, $mutation, fieldArgs);
function applyClientMutationIdForCreate(qb, val) {
  qb.setMeta("clientMutationId", val);
}
function applyCreateFields(qb, arg) {
  if (arg != null) {
    return qb.setBuilder();
  }
}
function _Proto__Input_idApply(obj, val, info) {
  obj.set("id", bakedInputRuntime(info.schema, info.field.type, val));
}
function _Proto__Input_nameApply(obj, val, info) {
  obj.set("name", bakedInputRuntime(info.schema, info.field.type, val));
}
function _Proto__Input_brandApply(obj, val, info) {
  obj.set("brand", bakedInputRuntime(info.schema, info.field.type, val));
}
const CreateBuildingPayload_buildingEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(building_buildingPgResource, buildingUniques[0].attributes, $mutation, fieldArgs);
function BuildingInput_constructorApply(obj, val, info) {
  obj.set("constructor", bakedInputRuntime(info.schema, info.field.type, val));
}
const CreateConstructorPayload_constructorEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(spec_resource_constructorPgResource, constructorUniques[0].attributes, $mutation, fieldArgs);
function ConstructorInput_exportApply(obj, val, info) {
  obj.set("export", bakedInputRuntime(info.schema, info.field.type, val));
}
const CreateCropPayload_cropEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(spec_resource_cropPgResource, cropUniques[0].attributes, $mutation, fieldArgs);
function CropInput_yieldApply(obj, val, info) {
  obj.set("yield", bakedInputRuntime(info.schema, info.field.type, val));
}
function CropInput_amountApply(obj, val, info) {
  obj.set("amount", bakedInputRuntime(info.schema, info.field.type, val));
}
const CreateMachinePayload_machineEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(spec_resource_machinePgResource, machineUniques[0].attributes, $mutation, fieldArgs);
function CreateMachinePayload_buildingByConstructorPlan($in) {
  const $record = $in.get("result");
  return building_buildingPgResource.get(specFromRecord3($record));
}
function MachineInput_inputApply(obj, val, info) {
  obj.set("input", bakedInputRuntime(info.schema, info.field.type, val));
}
const CreateMaterialPayload_materialEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(spec_resource_materialPgResource, materialUniques[0].attributes, $mutation, fieldArgs);
function MaterialInput_classApply(obj, val, info) {
  obj.set("class", bakedInputRuntime(info.schema, info.field.type, val));
}
function MaterialInput_valueOfApply(obj, val, info) {
  obj.set("valueOf", bakedInputRuntime(info.schema, info.field.type, val));
}
const CreateNullPayload_nullEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(spec_resource_nullPgResource, nullUniques[0].attributes, $mutation, fieldArgs);
function NullInput_hasOwnPropertyApply(obj, val, info) {
  obj.set("hasOwnProperty", bakedInputRuntime(info.schema, info.field.type, val));
}
function NullInput_breakApply(obj, val, info) {
  obj.set("break", bakedInputRuntime(info.schema, info.field.type, val));
}
const CreateProjectPayload_projectEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(spec_resource_projectPgResource, projectUniques[0].attributes, $mutation, fieldArgs);
function ProjectInput__proto__Apply(obj, val, info) {
  obj.set("__proto__", bakedInputRuntime(info.schema, info.field.type, val));
}
const CreateYieldPayload_yieldEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(spec_resource_yieldPgResource, yieldUniques[0].attributes, $mutation, fieldArgs);
function YieldInput_cropApply(obj, val, info) {
  obj.set("crop", bakedInputRuntime(info.schema, info.field.type, val));
}
const CreateReservedPayload_reservedEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(spec_resource_reservedPgResource, reservedUniques[0].attributes, $mutation, fieldArgs);
function ReservedInput_nullApply(obj, val, info) {
  obj.set("null", bakedInputRuntime(info.schema, info.field.type, val));
}
function ReservedInput_caseApply(obj, val, info) {
  obj.set("case", bakedInputRuntime(info.schema, info.field.type, val));
}
function ReservedInput_doApply(obj, val, info) {
  obj.set("do", bakedInputRuntime(info.schema, info.field.type, val));
}
function getClientMutationIdForUpdateOrDeletePlan($mutation) {
  const $result = $mutation.getStepForKey("result");
  return $result.getMeta("clientMutationId");
}
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
export const objects = {
  Query: {
    assertStep() {
      return true;
    },
    plans: {
      _proto__(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher__Proto__($nodeId);
      },
      _protoById(_$root, {
        $id
      }) {
        return spec_resource___proto__PgResource.get({
          id: $id
        });
      },
      _protoByName(_$root, {
        $name
      }) {
        return spec_resource___proto__PgResource.get({
          name: $name
        });
      },
      allBuildings: {
        plan() {
          return connection(building_buildingPgResource.find());
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
      allBuildingsList: {
        plan() {
          return building_buildingPgResource.find();
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg,
          condition: applyConditionArg,
          orderBy: applyOrderByArg
        }
      },
      allConstructors: {
        plan() {
          return connection(spec_resource_constructorPgResource.find());
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
      allConstructorsList: {
        plan() {
          return spec_resource_constructorPgResource.find();
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg,
          condition: applyConditionArg,
          orderBy: applyOrderByArg
        }
      },
      allCrops: {
        plan() {
          return connection(spec_resource_cropPgResource.find());
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
      allCropsList: {
        plan() {
          return spec_resource_cropPgResource.find();
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg,
          condition: applyConditionArg,
          orderBy: applyOrderByArg
        }
      },
      allMachines: {
        plan() {
          return connection(spec_resource_machinePgResource.find());
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
      allMachinesList: {
        plan() {
          return spec_resource_machinePgResource.find();
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg,
          condition: applyConditionArg,
          orderBy: applyOrderByArg
        }
      },
      allMaterials: {
        plan() {
          return connection(spec_resource_materialPgResource.find());
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
      allMaterialsList: {
        plan() {
          return spec_resource_materialPgResource.find();
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg,
          condition: applyConditionArg,
          orderBy: applyOrderByArg
        }
      },
      allNulls: {
        plan() {
          return connection(spec_resource_nullPgResource.find());
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
      allNullsList: {
        plan() {
          return spec_resource_nullPgResource.find();
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg,
          condition: applyConditionArg,
          orderBy: applyOrderByArg
        }
      },
      allProjects: {
        plan() {
          return connection(spec_resource_projectPgResource.find());
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
      allProjectsList: {
        plan() {
          return spec_resource_projectPgResource.find();
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg,
          condition: applyConditionArg,
          orderBy: applyOrderByArg
        }
      },
      allProtoS: {
        plan() {
          return connection(spec_resource___proto__PgResource.find());
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
      allProtoSList: {
        plan() {
          return spec_resource___proto__PgResource.find();
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg,
          condition: applyConditionArg,
          orderBy: applyOrderByArg
        }
      },
      allRelationalItems: {
        plan() {
          return connection(relational_items_relational_itemsPgResource.find());
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
      allRelationalItemsList: {
        plan() {
          return relational_items_relational_itemsPgResource.find();
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg,
          condition: applyConditionArg,
          orderBy: applyOrderByArg
        }
      },
      allRelationalStatuses: {
        plan() {
          return connection(spec_resource_relational_statusPgResource.find());
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
      allRelationalStatusesList: {
        plan() {
          return spec_resource_relational_statusPgResource.find();
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg,
          condition: applyConditionArg,
          orderBy: applyOrderByArg
        }
      },
      allRelationalTopics: {
        plan() {
          return connection(resource_relational_topicsPgResource.find());
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
      allRelationalTopicsList: {
        plan() {
          return resource_relational_topicsPgResource.find();
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg,
          condition: applyConditionArg,
          orderBy: applyOrderByArg
        }
      },
      allReserveds: {
        plan() {
          return connection(spec_resource_reservedPgResource.find());
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
      allReservedsList: {
        plan() {
          return spec_resource_reservedPgResource.find();
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg,
          condition: applyConditionArg,
          orderBy: applyOrderByArg
        }
      },
      allYields: {
        plan() {
          return connection(spec_resource_yieldPgResource.find());
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
      allYieldsList: {
        plan() {
          return spec_resource_yieldPgResource.find();
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg,
          condition: applyConditionArg,
          orderBy: applyOrderByArg
        }
      },
      await($root, args, _info) {
        const selectArgs = makeArgs_await(args);
        return resource_awaitPgResource.execute(selectArgs);
      },
      building(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_Building($nodeId);
      },
      buildingByConstructor(_$root, args) {
        const spec = Object.create(null);
        for (const attributeName in detailsByAttributeName) {
          spec[attributeName] = args.getRaw(detailsByAttributeName[attributeName].graphqlName);
        }
        return building_buildingPgResource.get(spec);
      },
      buildingById(_$root, {
        $id
      }) {
        return building_buildingPgResource.get({
          id: $id
        });
      },
      case($root, args, _info) {
        const selectArgs = makeArgs_case(args);
        return resource_casePgResource.execute(selectArgs);
      },
      constructor(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_Constructor($nodeId);
      },
      constructorByExport(_$root, {
        $export
      }) {
        return spec_resource_constructorPgResource.get({
          export: $export
        });
      },
      constructorById(_$root, {
        $id
      }) {
        return spec_resource_constructorPgResource.get({
          id: $id
        });
      },
      constructorByName(_$root, {
        $name
      }) {
        return spec_resource_constructorPgResource.get({
          name: $name
        });
      },
      crop(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_Crop($nodeId);
      },
      cropById(_$root, {
        $id
      }) {
        return spec_resource_cropPgResource.get({
          id: $id
        });
      },
      cropByYield(_$root, {
        $yield
      }) {
        return spec_resource_cropPgResource.get({
          yield: $yield
        });
      },
      machine(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_Machine($nodeId);
      },
      machineById(_$root, {
        $id
      }) {
        return spec_resource_machinePgResource.get({
          id: $id
        });
      },
      material(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_Material($nodeId);
      },
      materialByClass(_$root, {
        $class
      }) {
        return spec_resource_materialPgResource.get({
          class: $class
        });
      },
      materialById(_$root, {
        $id
      }) {
        return spec_resource_materialPgResource.get({
          id: $id
        });
      },
      materialByValueOf(_$root, args) {
        const spec = Object.create(null);
        for (const attributeName in detailsByAttributeName2) {
          spec[attributeName] = args.getRaw(detailsByAttributeName2[attributeName].graphqlName);
        }
        return spec_resource_materialPgResource.get(spec);
      },
      node(_$root, fieldArgs) {
        return fieldArgs.getRaw("nodeId");
      },
      nodeId($parent) {
        const specifier = nodeIdHandlerByTypeName.Query.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Query.codec.name].encode);
      },
      null(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_Null($nodeId);
      },
      nullByBreak(_$root, {
        $break
      }) {
        return spec_resource_nullPgResource.get({
          break: $break
        });
      },
      nullByHasOwnProperty(_$root, args) {
        const spec = Object.create(null);
        for (const attributeName in detailsByAttributeName3) {
          spec[attributeName] = args.getRaw(detailsByAttributeName3[attributeName].graphqlName);
        }
        return spec_resource_nullPgResource.get(spec);
      },
      nullById(_$root, {
        $id
      }) {
        return spec_resource_nullPgResource.get({
          id: $id
        });
      },
      project(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_Project($nodeId);
      },
      projectById(_$root, {
        $id
      }) {
        return spec_resource_projectPgResource.get({
          id: $id
        });
      },
      projectByProto__(_$root, args) {
        const spec = Object.create(null);
        for (const attributeName in detailsByAttributeName4) {
          spec[attributeName] = args.getRaw(detailsByAttributeName4[attributeName].graphqlName);
        }
        return spec_resource_projectPgResource.get(spec);
      },
      query() {
        return rootValue();
      },
      relationalStatus(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_RelationalStatus($nodeId);
      },
      relationalStatusById(_$root, {
        $id
      }) {
        return spec_resource_relational_statusPgResource.get({
          id: $id
        });
      },
      relationalTopic(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_RelationalTopic($nodeId);
      },
      relationalTopicById(_$root, {
        $id
      }) {
        return resource_relational_topicsPgResource.get({
          id: $id
        });
      },
      reserved(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_Reserved($nodeId);
      },
      reservedByCase(_$root, {
        $case
      }) {
        return spec_resource_reservedPgResource.get({
          case: $case
        });
      },
      reservedByDo(_$root, {
        $do
      }) {
        return spec_resource_reservedPgResource.get({
          do: $do
        });
      },
      reservedById(_$root, {
        $id
      }) {
        return spec_resource_reservedPgResource.get({
          id: $id
        });
      },
      reservedByNull(_$root, {
        $null
      }) {
        return spec_resource_reservedPgResource.get({
          null: $null
        });
      },
      valueOf($root, args, _info) {
        const selectArgs = makeArgs_valueOf(args);
        return resource_valueOfPgResource.execute(selectArgs);
      },
      yield(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_Yield($nodeId);
      },
      yieldByExport(_$root, {
        $export
      }) {
        return spec_resource_yieldPgResource.get({
          export: $export
        });
      },
      yieldById(_$root, {
        $id
      }) {
        return spec_resource_yieldPgResource.get({
          id: $id
        });
      }
    }
  },
  Mutation: {
    assertStep: __ValueStep,
    plans: {
      createBuilding: {
        plan(_, args) {
          const $insert = pgInsertSingle(building_buildingPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createConstructor: {
        plan(_, args) {
          const $insert = pgInsertSingle(spec_resource_constructorPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createCrop: {
        plan(_, args) {
          const $insert = pgInsertSingle(spec_resource_cropPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createMachine: {
        plan(_, args) {
          const $insert = pgInsertSingle(spec_resource_machinePgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createMaterial: {
        plan(_, args) {
          const $insert = pgInsertSingle(spec_resource_materialPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createNull: {
        plan(_, args) {
          const $insert = pgInsertSingle(spec_resource_nullPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createProject: {
        plan(_, args) {
          const $insert = pgInsertSingle(spec_resource_projectPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createProto__: {
        plan(_, args) {
          const $insert = pgInsertSingle(spec_resource___proto__PgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createReserved: {
        plan(_, args) {
          const $insert = pgInsertSingle(spec_resource_reservedPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createYield: {
        plan(_, args) {
          const $insert = pgInsertSingle(spec_resource_yieldPgResource);
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
          const $delete = pgDeleteSingle(building_buildingPgResource, specFromArgs_Building(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
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
          input: applyInputToUpdateOrDelete
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
          input: applyInputToUpdateOrDelete
        }
      },
      deleteConstructor: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_constructorPgResource, specFromArgs_Constructor(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteConstructorByExport: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_constructorPgResource, {
            export: args.getRaw(['input', "export"])
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
      deleteConstructorById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_constructorPgResource, {
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
      deleteConstructorByName: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_constructorPgResource, {
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
      deleteCrop: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_cropPgResource, specFromArgs_Crop(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteCropById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_cropPgResource, {
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
      deleteCropByYield: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_cropPgResource, {
            yield: args.getRaw(['input', "yield"])
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
      deleteMachine: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_machinePgResource, specFromArgs_Machine(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteMachineById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_machinePgResource, {
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
      deleteMaterial: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_materialPgResource, specFromArgs_Material(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteMaterialByClass: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_materialPgResource, {
            class: args.getRaw(['input', "class"])
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
      deleteMaterialById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_materialPgResource, {
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
      deleteMaterialByValueOf: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_materialPgResource, specFromArgs_Material4(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteNull: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_nullPgResource, specFromArgs_Null(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteNullByBreak: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_nullPgResource, {
            break: args.getRaw(['input', "break"])
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
      deleteNullByHasOwnProperty: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_nullPgResource, specFromArgs_Null4(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteNullById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_nullPgResource, {
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
      deleteProject: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_projectPgResource, specFromArgs_Project(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteProjectById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_projectPgResource, {
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
      deleteProjectByProto__: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_projectPgResource, specFromArgs_Project4(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteProto__: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource___proto__PgResource, specFromArgs__Proto__(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteProtoById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource___proto__PgResource, {
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
      deleteProtoByName: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource___proto__PgResource, {
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
      deleteReserved: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_reservedPgResource, specFromArgs_Reserved(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteReservedByCase: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_reservedPgResource, {
            case: args.getRaw(['input', "case"])
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
      deleteReservedByDo: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_reservedPgResource, {
            do: args.getRaw(['input', "do"])
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
      deleteReservedById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_reservedPgResource, {
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
      deleteReservedByNull: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_reservedPgResource, {
            null: args.getRaw(['input', "null"])
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
      deleteYield: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_yieldPgResource, specFromArgs_Yield(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteYieldByExport: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_yieldPgResource, {
            export: args.getRaw(['input', "export"])
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
      deleteYieldById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_yieldPgResource, {
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
      updateBuilding: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(building_buildingPgResource, specFromArgs_Building(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
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
          input: applyInputToUpdateOrDelete
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
          input: applyInputToUpdateOrDelete
        }
      },
      updateConstructor: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_constructorPgResource, specFromArgs_Constructor(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateConstructorByExport: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_constructorPgResource, {
            export: args.getRaw(['input', "export"])
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
      updateConstructorById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_constructorPgResource, {
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
      updateConstructorByName: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_constructorPgResource, {
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
      updateCrop: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_cropPgResource, specFromArgs_Crop(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateCropById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_cropPgResource, {
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
      updateCropByYield: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_cropPgResource, {
            yield: args.getRaw(['input', "yield"])
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
      updateMachine: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_machinePgResource, specFromArgs_Machine(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateMachineById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_machinePgResource, {
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
      updateMaterial: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_materialPgResource, specFromArgs_Material(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateMaterialByClass: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_materialPgResource, {
            class: args.getRaw(['input', "class"])
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
      updateMaterialById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_materialPgResource, {
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
      updateMaterialByValueOf: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_materialPgResource, specFromArgs_Material2(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateNull: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_nullPgResource, specFromArgs_Null(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateNullByBreak: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_nullPgResource, {
            break: args.getRaw(['input', "break"])
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
      updateNullByHasOwnProperty: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_nullPgResource, specFromArgs_Null2(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateNullById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_nullPgResource, {
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
      updateProject: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_projectPgResource, specFromArgs_Project(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateProjectById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_projectPgResource, {
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
      updateProjectByProto__: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_projectPgResource, specFromArgs_Project2(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateProto__: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource___proto__PgResource, specFromArgs__Proto__(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateProtoById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource___proto__PgResource, {
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
      updateProtoByName: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource___proto__PgResource, {
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
      updateReserved: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_reservedPgResource, specFromArgs_Reserved(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateReservedByCase: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_reservedPgResource, {
            case: args.getRaw(['input', "case"])
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
      updateReservedByDo: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_reservedPgResource, {
            do: args.getRaw(['input', "do"])
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
      updateReservedById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_reservedPgResource, {
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
      updateReservedByNull: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_reservedPgResource, {
            null: args.getRaw(['input', "null"])
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
      updateYield: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_yieldPgResource, specFromArgs_Yield(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateYieldByExport: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_yieldPgResource, {
            export: args.getRaw(['input', "export"])
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
      updateYieldById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_yieldPgResource, {
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
  _Proto__: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nodeId($parent) {
        const specifier = nodeIdHandler__Proto__.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler__Proto__.codec.name].encode);
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of __proto__Uniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return spec_resource___proto__PgResource.get(spec);
    }
  },
  _Proto__SConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  Building: {
    assertStep: assertPgClassSingleStep,
    plans: {
      machinesByConstructor: {
        plan($record) {
          return connection(spec_resource_machinePgResource.find(specFromRecord($record)));
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
      machinesByConstructorList: {
        plan($record) {
          return spec_resource_machinePgResource.find(specFromRecord($record));
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg,
          condition: applyConditionArg,
          orderBy: applyOrderByArg
        }
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_Building.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Building.codec.name].encode);
      },
      relationalItemsByConstructor: {
        plan($record) {
          return connection(relational_items_relational_itemsPgResource.find(specFromRecord2($record)));
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
      relationalItemsByConstructorList: {
        plan($record) {
          return relational_items_relational_itemsPgResource.find(specFromRecord2($record));
        },
        args: {
          first: applyFirstArg,
          offset: applyOffsetArg,
          condition: applyConditionArg,
          orderBy: applyOrderByArg
        }
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of buildingUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return building_buildingPgResource.get(spec);
    }
  },
  BuildingsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  Constructor: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nodeId($parent) {
        const specifier = nodeIdHandler_Constructor.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Constructor.codec.name].encode);
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of constructorUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return spec_resource_constructorPgResource.get(spec);
    }
  },
  ConstructorsConnection: {
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
      query: queryPlan
    }
  },
  CreateConstructorPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      constructor: planCreatePayloadResult,
      constructorEdge: CreateConstructorPayload_constructorEdgePlan,
      query: queryPlan
    }
  },
  CreateCropPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      crop: planCreatePayloadResult,
      cropEdge: CreateCropPayload_cropEdgePlan,
      query: queryPlan
    }
  },
  CreateMachinePayload: {
    assertStep: assertStep,
    plans: {
      buildingByConstructor: CreateMachinePayload_buildingByConstructorPlan,
      clientMutationId: getClientMutationIdForCreatePlan,
      machine: planCreatePayloadResult,
      machineEdge: CreateMachinePayload_machineEdgePlan,
      query: queryPlan
    }
  },
  CreateMaterialPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      material: planCreatePayloadResult,
      materialEdge: CreateMaterialPayload_materialEdgePlan,
      query: queryPlan
    }
  },
  CreateNullPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      null: planCreatePayloadResult,
      nullEdge: CreateNullPayload_nullEdgePlan,
      query: queryPlan
    }
  },
  CreateProjectPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      project: planCreatePayloadResult,
      projectEdge: CreateProjectPayload_projectEdgePlan,
      query: queryPlan
    }
  },
  CreateProtoPayload: {
    assertStep: assertStep,
    plans: {
      _proto__: planCreatePayloadResult,
      _protoEdge: CreateProtoPayload__protoEdgePlan,
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan
    }
  },
  CreateReservedPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan,
      reserved: planCreatePayloadResult,
      reservedEdge: CreateReservedPayload_reservedEdgePlan
    }
  },
  CreateYieldPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan,
      yield: planCreatePayloadResult,
      yieldEdge: CreateYieldPayload_yieldEdgePlan
    }
  },
  Crop: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nodeId($parent) {
        const specifier = nodeIdHandler_Crop.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Crop.codec.name].encode);
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of cropUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return spec_resource_cropPgResource.get(spec);
    }
  },
  CropsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
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
      query: queryPlan
    }
  },
  DeleteConstructorPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      constructor: planCreatePayloadResult,
      constructorEdge: CreateConstructorPayload_constructorEdgePlan,
      deletedConstructorId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Constructor.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      query: queryPlan
    }
  },
  DeleteCropPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      crop: planCreatePayloadResult,
      cropEdge: CreateCropPayload_cropEdgePlan,
      deletedCropId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Crop.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      query: queryPlan
    }
  },
  DeleteMachinePayload: {
    assertStep: ObjectStep,
    plans: {
      buildingByConstructor: CreateMachinePayload_buildingByConstructorPlan,
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedMachineId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Machine.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      machine: planCreatePayloadResult,
      machineEdge: CreateMachinePayload_machineEdgePlan,
      query: queryPlan
    }
  },
  DeleteMaterialPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedMaterialId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Material.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      material: planCreatePayloadResult,
      materialEdge: CreateMaterialPayload_materialEdgePlan,
      query: queryPlan
    }
  },
  DeleteNullPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedNullId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Null.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      null: planCreatePayloadResult,
      nullEdge: CreateNullPayload_nullEdgePlan,
      query: queryPlan
    }
  },
  DeleteProjectPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedProjectId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Project.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      project: planCreatePayloadResult,
      projectEdge: CreateProjectPayload_projectEdgePlan,
      query: queryPlan
    }
  },
  DeleteProtoPayload: {
    assertStep: ObjectStep,
    plans: {
      _proto__: planCreatePayloadResult,
      _protoEdge: CreateProtoPayload__protoEdgePlan,
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedProtoId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler__Proto__.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      query: queryPlan
    }
  },
  DeleteReservedPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedReservedId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Reserved.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      query: queryPlan,
      reserved: planCreatePayloadResult,
      reservedEdge: CreateReservedPayload_reservedEdgePlan
    }
  },
  DeleteYieldPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedYieldId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Yield.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      query: queryPlan,
      yield: planCreatePayloadResult,
      yieldEdge: CreateYieldPayload_yieldEdgePlan
    }
  },
  Machine: {
    assertStep: assertPgClassSingleStep,
    plans: {
      buildingByConstructor($record) {
        return building_buildingPgResource.get(specFromRecord3($record));
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_Machine.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Machine.codec.name].encode);
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of machineUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return spec_resource_machinePgResource.get(spec);
    }
  },
  MachinesConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  Material: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nodeId($parent) {
        const specifier = nodeIdHandler_Material.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Material.codec.name].encode);
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of materialUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return spec_resource_materialPgResource.get(spec);
    }
  },
  MaterialsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  Null: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nodeId($parent) {
        const specifier = nodeIdHandler_Null.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Null.codec.name].encode);
      },
      yield($in, args, _info) {
        return scalarComputed($in, makeArgs_null_yield(args));
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of nullUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return spec_resource_nullPgResource.get(spec);
    }
  },
  NullsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  Project: {
    assertStep: assertPgClassSingleStep,
    plans: {
      _proto__($record) {
        return $record.get("__proto__");
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_Project.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Project.codec.name].encode);
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of projectUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return spec_resource_projectPgResource.get(spec);
    }
  },
  ProjectsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  RelationalItemsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  RelationalStatus: {
    assertStep: assertPgClassSingleStep,
    plans: {
      buildingByConstructor: RelationalTopic_buildingByConstructorPlan,
      nodeId($parent) {
        const specifier = nodeIdHandler_RelationalStatus.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_RelationalStatus.codec.name].encode);
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of relational_statusUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return spec_resource_relational_statusPgResource.get(spec);
    }
  },
  RelationalStatusesConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  RelationalTopic: {
    assertStep: assertPgClassSingleStep,
    plans: {
      buildingByConstructor: RelationalTopic_buildingByConstructorPlan,
      nodeId($parent) {
        const specifier = nodeIdHandler_RelationalTopic.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_RelationalTopic.codec.name].encode);
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of pkCols) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_relational_topicsPgResource.get(spec);
    }
  },
  RelationalTopicsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  Reserved: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nodeId($parent) {
        const specifier = nodeIdHandler_Reserved.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Reserved.codec.name].encode);
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of reservedUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return spec_resource_reservedPgResource.get(spec);
    }
  },
  ReservedsConnection: {
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
      query: queryPlan
    }
  },
  UpdateConstructorPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      constructor: planCreatePayloadResult,
      constructorEdge: CreateConstructorPayload_constructorEdgePlan,
      query: queryPlan
    }
  },
  UpdateCropPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      crop: planCreatePayloadResult,
      cropEdge: CreateCropPayload_cropEdgePlan,
      query: queryPlan
    }
  },
  UpdateMachinePayload: {
    assertStep: ObjectStep,
    plans: {
      buildingByConstructor: CreateMachinePayload_buildingByConstructorPlan,
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      machine: planCreatePayloadResult,
      machineEdge: CreateMachinePayload_machineEdgePlan,
      query: queryPlan
    }
  },
  UpdateMaterialPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      material: planCreatePayloadResult,
      materialEdge: CreateMaterialPayload_materialEdgePlan,
      query: queryPlan
    }
  },
  UpdateNullPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      null: planCreatePayloadResult,
      nullEdge: CreateNullPayload_nullEdgePlan,
      query: queryPlan
    }
  },
  UpdateProjectPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      project: planCreatePayloadResult,
      projectEdge: CreateProjectPayload_projectEdgePlan,
      query: queryPlan
    }
  },
  UpdateProtoPayload: {
    assertStep: ObjectStep,
    plans: {
      _proto__: planCreatePayloadResult,
      _protoEdge: CreateProtoPayload__protoEdgePlan,
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan
    }
  },
  UpdateReservedPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan,
      reserved: planCreatePayloadResult,
      reservedEdge: CreateReservedPayload_reservedEdgePlan
    }
  },
  UpdateYieldPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan,
      yield: planCreatePayloadResult,
      yieldEdge: CreateYieldPayload_yieldEdgePlan
    }
  },
  Yield: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nodeId($parent) {
        const specifier = nodeIdHandler_Yield.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Yield.codec.name].encode);
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of yieldUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return spec_resource_yieldPgResource.get(spec);
    }
  },
  YieldsConnection: {
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
  },
  RelationalItem: {
    toSpecifier(step) {
      if (step instanceof PgSelectSingleStep &&
      // NOTE: don't compare `resource` directly since it
      // could be a function.
      step.resource.codec !== relational_items_relational_itemsPgResource.codec) {
        // Assume it's a child; return description of base
        const pkColumns = relational_items_pkColumnsByRelatedCodecName[step.resource.codec.name];
        if (!pkColumns) {
          throw new Error(`Expected a relational record for ${relational_items_relational_itemsPgResource.name}, but '${step.resource.codec.name}' does not seem to be related!`);
        }
        return object(Object.fromEntries(relational_itemsUniques[0].attributes.map((attrName, idx) => [attrName, get2(step, pkColumns[idx])])));
      } else {
        // Assume it is or describes the base:
        return object(Object.fromEntries(relational_itemsUniques[0].attributes.map(attrName => [attrName, get2(step, attrName)])));
      }
    },
    planType($specifier, {
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
  }
};
export const inputObjects = {
  _Proto__Input: {
    baked: createObjectAndApplyChildren,
    plans: {
      brand: _Proto__Input_brandApply,
      id: _Proto__Input_idApply,
      name: _Proto__Input_nameApply
    }
  },
  _ProtoCondition: {
    plans: {
      brand: _ProtoCondition_brandApply,
      id: MachineCondition_idApply,
      name: _ProtoCondition_nameApply
    }
  },
  _ProtoPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      brand: _Proto__Input_brandApply,
      id: _Proto__Input_idApply,
      name: _Proto__Input_nameApply
    }
  },
  BuildingCondition: {
    plans: {
      constructor: MachineCondition_constructorApply,
      id: MachineCondition_idApply,
      name: _ProtoCondition_nameApply
    }
  },
  BuildingInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      constructor: BuildingInput_constructorApply,
      id: _Proto__Input_idApply,
      name: _Proto__Input_nameApply
    }
  },
  BuildingPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      constructor: BuildingInput_constructorApply,
      id: _Proto__Input_idApply,
      name: _Proto__Input_nameApply
    }
  },
  ConstructorCondition: {
    plans: {
      export: ConstructorCondition_exportApply,
      id: MachineCondition_idApply,
      name: _ProtoCondition_nameApply
    }
  },
  ConstructorInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      export: ConstructorInput_exportApply,
      id: _Proto__Input_idApply,
      name: _Proto__Input_nameApply
    }
  },
  ConstructorPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      export: ConstructorInput_exportApply,
      id: _Proto__Input_idApply,
      name: _Proto__Input_nameApply
    }
  },
  CreateBuildingInput: {
    plans: {
      building: applyCreateFields,
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  CreateConstructorInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      constructor: applyCreateFields
    }
  },
  CreateCropInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      crop: applyCreateFields
    }
  },
  CreateMachineInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      machine: applyCreateFields
    }
  },
  CreateMaterialInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      material: applyCreateFields
    }
  },
  CreateNullInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      null: applyCreateFields
    }
  },
  CreateProjectInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      project: applyCreateFields
    }
  },
  CreateProtoInput: {
    plans: {
      _proto__: applyCreateFields,
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  CreateReservedInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      reserved: applyCreateFields
    }
  },
  CreateYieldInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      yield: applyCreateFields
    }
  },
  CropCondition: {
    plans: {
      amount($condition, val) {
        return applyAttributeCondition("amount", TYPES.int, $condition, val);
      },
      id: MachineCondition_idApply,
      yield($condition, val) {
        return applyAttributeCondition("yield", TYPES.text, $condition, val);
      }
    }
  },
  CropInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      amount: CropInput_amountApply,
      id: _Proto__Input_idApply,
      yield: CropInput_yieldApply
    }
  },
  CropPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      amount: CropInput_amountApply,
      id: _Proto__Input_idApply,
      yield: CropInput_yieldApply
    }
  },
  DeleteBuildingByConstructorInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
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
  DeleteConstructorByExportInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteConstructorByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteConstructorByNameInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteConstructorInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteCropByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteCropByYieldInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteCropInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteMachineByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteMachineInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteMaterialByClassInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteMaterialByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteMaterialByValueOfInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteMaterialInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteNullByBreakInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteNullByHasOwnPropertyInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteNullByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteNullInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteProjectByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteProjectByProtoInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteProjectInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteProtoByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteProtoByNameInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteProtoInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteReservedByCaseInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteReservedByDoInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteReservedByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteReservedByNullInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteReservedInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteYieldByExportInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteYieldByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  DeleteYieldInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  MachineCondition: {
    plans: {
      constructor: MachineCondition_constructorApply,
      id: MachineCondition_idApply,
      input($condition, val) {
        return applyAttributeCondition("input", TYPES.text, $condition, val);
      }
    }
  },
  MachineInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      constructor: BuildingInput_constructorApply,
      id: _Proto__Input_idApply,
      input: MachineInput_inputApply
    }
  },
  MachinePatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      constructor: BuildingInput_constructorApply,
      id: _Proto__Input_idApply,
      input: MachineInput_inputApply
    }
  },
  MaterialCondition: {
    plans: {
      class($condition, val) {
        return applyAttributeCondition("class", TYPES.text, $condition, val);
      },
      id: MachineCondition_idApply,
      valueOf($condition, val) {
        return applyAttributeCondition("valueOf", TYPES.text, $condition, val);
      }
    }
  },
  MaterialInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      class: MaterialInput_classApply,
      id: _Proto__Input_idApply,
      valueOf: MaterialInput_valueOfApply
    }
  },
  MaterialPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      class: MaterialInput_classApply,
      id: _Proto__Input_idApply,
      valueOf: MaterialInput_valueOfApply
    }
  },
  NullCondition: {
    plans: {
      break($condition, val) {
        return applyAttributeCondition("break", TYPES.text, $condition, val);
      },
      hasOwnProperty($condition, val) {
        return applyAttributeCondition("hasOwnProperty", TYPES.text, $condition, val);
      },
      id: MachineCondition_idApply
    }
  },
  NullInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      break: NullInput_breakApply,
      hasOwnProperty: NullInput_hasOwnPropertyApply,
      id: _Proto__Input_idApply
    }
  },
  NullPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      break: NullInput_breakApply,
      hasOwnProperty: NullInput_hasOwnPropertyApply,
      id: _Proto__Input_idApply
    }
  },
  ProjectCondition: {
    plans: {
      _proto__($condition, val) {
        return applyAttributeCondition("__proto__", TYPES.text, $condition, val);
      },
      brand: _ProtoCondition_brandApply,
      id: MachineCondition_idApply
    }
  },
  ProjectInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      _proto__: ProjectInput__proto__Apply,
      brand: _Proto__Input_brandApply,
      id: _Proto__Input_idApply
    }
  },
  ProjectPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      _proto__: ProjectInput__proto__Apply,
      brand: _Proto__Input_brandApply,
      id: _Proto__Input_idApply
    }
  },
  RelationalItemCondition: {
    plans: {
      constructor: MachineCondition_constructorApply,
      id: MachineCondition_idApply,
      type($condition, val) {
        return applyAttributeCondition("type", itemTypeCodec, $condition, val);
      }
    }
  },
  RelationalStatusCondition: {
    plans: {
      constructor: RelationalTopicCondition_constructorApply,
      description($condition, val) {
        return applyAttributeCondition("description", TYPES.text, $condition, val);
      },
      id: MachineCondition_idApply,
      note($condition, val) {
        return applyAttributeCondition("note", TYPES.text, $condition, val);
      },
      type: RelationalTopicCondition_typeApply
    }
  },
  RelationalTopicCondition: {
    plans: {
      constructor: RelationalTopicCondition_constructorApply,
      id: MachineCondition_idApply,
      title($condition, val) {
        return applyAttributeCondition("title", TYPES.text, $condition, val);
      },
      type: RelationalTopicCondition_typeApply
    }
  },
  ReservedCondition: {
    plans: {
      case($condition, val) {
        return applyAttributeCondition("case", TYPES.text, $condition, val);
      },
      do($condition, val) {
        return applyAttributeCondition("do", TYPES.text, $condition, val);
      },
      id: MachineCondition_idApply,
      null($condition, val) {
        return applyAttributeCondition("null", TYPES.text, $condition, val);
      }
    }
  },
  ReservedInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      case: ReservedInput_caseApply,
      do: ReservedInput_doApply,
      id: _Proto__Input_idApply,
      null: ReservedInput_nullApply
    }
  },
  ReservedPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      case: ReservedInput_caseApply,
      do: ReservedInput_doApply,
      id: _Proto__Input_idApply,
      null: ReservedInput_nullApply
    }
  },
  UpdateBuildingByConstructorInput: {
    plans: {
      buildingPatch: applyCreateFields,
      clientMutationId: applyClientMutationIdForCreate
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
  UpdateConstructorByExportInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      constructorPatch: applyCreateFields
    }
  },
  UpdateConstructorByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      constructorPatch: applyCreateFields
    }
  },
  UpdateConstructorByNameInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      constructorPatch: applyCreateFields
    }
  },
  UpdateConstructorInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      constructorPatch: applyCreateFields
    }
  },
  UpdateCropByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      cropPatch: applyCreateFields
    }
  },
  UpdateCropByYieldInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      cropPatch: applyCreateFields
    }
  },
  UpdateCropInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      cropPatch: applyCreateFields
    }
  },
  UpdateMachineByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      machinePatch: applyCreateFields
    }
  },
  UpdateMachineInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      machinePatch: applyCreateFields
    }
  },
  UpdateMaterialByClassInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      materialPatch: applyCreateFields
    }
  },
  UpdateMaterialByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      materialPatch: applyCreateFields
    }
  },
  UpdateMaterialByValueOfInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      materialPatch: applyCreateFields
    }
  },
  UpdateMaterialInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      materialPatch: applyCreateFields
    }
  },
  UpdateNullByBreakInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      nullPatch: applyCreateFields
    }
  },
  UpdateNullByHasOwnPropertyInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      nullPatch: applyCreateFields
    }
  },
  UpdateNullByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      nullPatch: applyCreateFields
    }
  },
  UpdateNullInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      nullPatch: applyCreateFields
    }
  },
  UpdateProjectByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      projectPatch: applyCreateFields
    }
  },
  UpdateProjectByProtoInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      projectPatch: applyCreateFields
    }
  },
  UpdateProjectInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      projectPatch: applyCreateFields
    }
  },
  UpdateProtoByIdInput: {
    plans: {
      _protoPatch: applyCreateFields,
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  UpdateProtoByNameInput: {
    plans: {
      _protoPatch: applyCreateFields,
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  UpdateProtoInput: {
    plans: {
      _protoPatch: applyCreateFields,
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  UpdateReservedByCaseInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      reservedPatch: applyCreateFields
    }
  },
  UpdateReservedByDoInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      reservedPatch: applyCreateFields
    }
  },
  UpdateReservedByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      reservedPatch: applyCreateFields
    }
  },
  UpdateReservedByNullInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      reservedPatch: applyCreateFields
    }
  },
  UpdateReservedInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      reservedPatch: applyCreateFields
    }
  },
  UpdateYieldByExportInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      yieldPatch: applyCreateFields
    }
  },
  UpdateYieldByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      yieldPatch: applyCreateFields
    }
  },
  UpdateYieldInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      yieldPatch: applyCreateFields
    }
  },
  YieldCondition: {
    plans: {
      crop($condition, val) {
        return applyAttributeCondition("crop", TYPES.text, $condition, val);
      },
      export: ConstructorCondition_exportApply,
      id: MachineCondition_idApply
    }
  },
  YieldInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      crop: YieldInput_cropApply,
      export: ConstructorInput_exportApply,
      id: _Proto__Input_idApply
    }
  },
  YieldPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      crop: YieldInput_cropApply,
      export: ConstructorInput_exportApply,
      id: _Proto__Input_idApply
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
  _ProtoSOrderBy: {
    values: {
      BRAND_ASC: _ProtoSOrderBy_BRAND_ASCApply,
      BRAND_DESC: _ProtoSOrderBy_BRAND_DESCApply,
      ID_ASC: MachinesOrderBy_ID_ASCApply,
      ID_DESC: MachinesOrderBy_ID_DESCApply,
      NAME_ASC: _ProtoSOrderBy_NAME_ASCApply,
      NAME_DESC: _ProtoSOrderBy_NAME_DESCApply,
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
      }
    }
  },
  BuildingsOrderBy: {
    values: {
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
      },
      ID_ASC: MachinesOrderBy_ID_ASCApply,
      ID_DESC: MachinesOrderBy_ID_DESCApply,
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
      }
    }
  },
  ConstructorsOrderBy: {
    values: {
      EXPORT_ASC: ConstructorsOrderBy_EXPORT_ASCApply,
      EXPORT_DESC: ConstructorsOrderBy_EXPORT_DESCApply,
      ID_ASC: MachinesOrderBy_ID_ASCApply,
      ID_DESC: MachinesOrderBy_ID_DESCApply,
      NAME_ASC: _ProtoSOrderBy_NAME_ASCApply,
      NAME_DESC: _ProtoSOrderBy_NAME_DESCApply,
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
      }
    }
  },
  CropsOrderBy: {
    values: {
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
      },
      ID_ASC: MachinesOrderBy_ID_ASCApply,
      ID_DESC: MachinesOrderBy_ID_DESCApply,
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
      }
    }
  },
  MachinesOrderBy: {
    values: {
      CONSTRUCTOR_ASC: MachinesOrderBy_CONSTRUCTOR_ASCApply,
      CONSTRUCTOR_DESC: MachinesOrderBy_CONSTRUCTOR_DESCApply,
      ID_ASC: MachinesOrderBy_ID_ASCApply,
      ID_DESC: MachinesOrderBy_ID_DESCApply,
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
      }
    }
  },
  MaterialsOrderBy: {
    values: {
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
      ID_ASC: MachinesOrderBy_ID_ASCApply,
      ID_DESC: MachinesOrderBy_ID_DESCApply,
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
    }
  },
  NullsOrderBy: {
    values: {
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
      ID_ASC: MachinesOrderBy_ID_ASCApply,
      ID_DESC: MachinesOrderBy_ID_DESCApply,
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
      }
    }
  },
  ProjectsOrderBy: {
    values: {
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
      },
      BRAND_ASC: _ProtoSOrderBy_BRAND_ASCApply,
      BRAND_DESC: _ProtoSOrderBy_BRAND_DESCApply,
      ID_ASC: MachinesOrderBy_ID_ASCApply,
      ID_DESC: MachinesOrderBy_ID_DESCApply,
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
      }
    }
  },
  RelationalItemsOrderBy: {
    values: {
      CONSTRUCTOR_ASC: MachinesOrderBy_CONSTRUCTOR_ASCApply,
      CONSTRUCTOR_DESC: MachinesOrderBy_CONSTRUCTOR_DESCApply,
      ID_ASC: MachinesOrderBy_ID_ASCApply,
      ID_DESC: MachinesOrderBy_ID_DESCApply,
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
      TYPE_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "type",
          direction: "ASC"
        });
      },
      TYPE_DESC: RelationalItemsOrderBy_TYPE_DESCApply
    }
  },
  RelationalStatusesOrderBy: {
    values: {
      CONSTRUCTOR_ASC: RelationalTopicsOrderBy_CONSTRUCTOR_ASCApply,
      CONSTRUCTOR_DESC: MachinesOrderBy_CONSTRUCTOR_DESCApply,
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
      ID_ASC: MachinesOrderBy_ID_ASCApply,
      ID_DESC: MachinesOrderBy_ID_DESCApply,
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
      TYPE_ASC: RelationalTopicsOrderBy_TYPE_ASCApply,
      TYPE_DESC: RelationalItemsOrderBy_TYPE_DESCApply
    }
  },
  RelationalTopicsOrderBy: {
    values: {
      CONSTRUCTOR_ASC: RelationalTopicsOrderBy_CONSTRUCTOR_ASCApply,
      CONSTRUCTOR_DESC: MachinesOrderBy_CONSTRUCTOR_DESCApply,
      ID_ASC: MachinesOrderBy_ID_ASCApply,
      ID_DESC: MachinesOrderBy_ID_DESCApply,
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
      TYPE_ASC: RelationalTopicsOrderBy_TYPE_ASCApply,
      TYPE_DESC: RelationalItemsOrderBy_TYPE_DESCApply
    }
  },
  ReservedsOrderBy: {
    values: {
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
      },
      ID_ASC: MachinesOrderBy_ID_ASCApply,
      ID_DESC: MachinesOrderBy_ID_DESCApply,
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
      }
    }
  },
  YieldsOrderBy: {
    values: {
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
      EXPORT_ASC: ConstructorsOrderBy_EXPORT_ASCApply,
      EXPORT_DESC: ConstructorsOrderBy_EXPORT_DESCApply,
      ID_ASC: MachinesOrderBy_ID_ASCApply,
      ID_DESC: MachinesOrderBy_ID_DESCApply,
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
