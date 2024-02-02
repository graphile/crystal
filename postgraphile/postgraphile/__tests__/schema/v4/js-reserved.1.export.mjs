import { PgDeleteSingleStep, PgExecutor, PgSelectSingleStep, PgSelectStep, PgUnionAllStep, TYPES, assertPgClassSingleStep, enumCodec, makeRegistry, pgClassExpression, pgDeleteSingle, pgInsertSingle, pgSelectFromRecord, pgSelectSingleFromRecord, pgUpdateSingle, recordCodec, sqlFromArgDigests } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ObjectStep, SafeError, __ValueStep, access, assertEdgeCapableStep, assertExecutableStep, assertPageInfoCapableStep, connection, constant, context, first, getEnumValueConfig, lambda, list, makeGrafastSchema, node, object, rootValue, specFromNodeId, stepAMayDependOnStepB } from "grafast";
import { sql } from "pg-sql2";
import { inspect } from "util";
const attributes_type_codec_itemType = enumCodec({
  name: "itemType",
  identifier: sql.identifier(...["js_reserved", "item_type"]),
  values: ["TOPIC", "STATUS"],
  description: undefined,
  extensions: {
    oid: "1377187",
    pg: {
      serviceName: "main",
      schemaName: "js_reserved",
      name: "item_type"
    },
    tags: Object.create(null)
  }
});
const attributes = Object.assign(Object.create(null), {
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
    codec: attributes_type_codec_itemType,
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
const extensions2 = {
  oid: "1377208",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "js_reserved",
    name: "relational_topics"
  },
  tags: Object.create(null),
  relationalInterfaceCodecName: "relationalItems"
};
const parts2 = ["js_reserved", "relational_topics"];
const sqlIdent2 = sql.identifier(...parts2);
const spec_relationalTopics = {
  name: "relationalTopics",
  identifier: sqlIdent2,
  attributes,
  description: undefined,
  extensions: extensions2,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_relationalTopics_relationalTopics = recordCodec(spec_relationalTopics);
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
});
const extensions3 = {
  oid: "1377293",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "js_reserved",
    name: "__proto__"
  },
  tags: Object.create(null)
};
const parts3 = ["js_reserved", "__proto__"];
const sqlIdent3 = sql.identifier(...parts3);
const spec___proto__ = {
  name: "__proto__",
  identifier: sqlIdent3,
  attributes: attributes_object_Object_,
  description: undefined,
  extensions: extensions3,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs___proto_____proto__ = recordCodec(spec___proto__);
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
});
const extensions4 = {
  oid: "1377164",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "js_reserved",
    name: "building"
  },
  tags: Object.create(null)
};
const parts4 = ["js_reserved", "building"];
const sqlIdent4 = sql.identifier(...parts4);
const spec_building = {
  name: "building",
  identifier: sqlIdent4,
  attributes: attributes_object_Object_2,
  description: undefined,
  extensions: extensions4,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_building_building = recordCodec(spec_building);
const attributes_object_Object_3 = Object.assign(Object.create(null), {
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
});
const extensions5 = {
  oid: "1377269",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "js_reserved",
    name: "constructor"
  },
  tags: Object.create(null)
};
const parts5 = ["js_reserved", "constructor"];
const sqlIdent5 = sql.identifier(...parts5);
const spec_constructor = {
  name: "constructor",
  identifier: sqlIdent5,
  attributes: attributes_object_Object_3,
  description: undefined,
  extensions: extensions5,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_constructor_constructor = recordCodec(spec_constructor);
const attributes2 = Object.assign(Object.create(null), {
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
});
const extensions6 = {
  oid: "1377245",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "js_reserved",
    name: "crop"
  },
  tags: Object.create(null)
};
const parts6 = ["js_reserved", "crop"];
const sqlIdent6 = sql.identifier(...parts6);
const spec_crop = {
  name: "crop",
  identifier: sqlIdent6,
  attributes: attributes2,
  description: undefined,
  extensions: extensions6,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_crop_crop = recordCodec(spec_crop);
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
});
const extensions7 = {
  oid: "1377175",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "js_reserved",
    name: "machine"
  },
  tags: Object.create(null)
};
const parts7 = ["js_reserved", "machine"];
const sqlIdent7 = sql.identifier(...parts7);
const spec_machine = {
  name: "machine",
  identifier: sqlIdent7,
  attributes: attributes3,
  description: undefined,
  extensions: extensions7,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_machine_machine = recordCodec(spec_machine);
const attributes4 = Object.assign(Object.create(null), {
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
});
const extensions8 = {
  oid: "1377256",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "js_reserved",
    name: "material"
  },
  tags: Object.create(null)
};
const parts8 = ["js_reserved", "material"];
const sqlIdent8 = sql.identifier(...parts8);
const spec_material = {
  name: "material",
  identifier: sqlIdent8,
  attributes: attributes4,
  description: undefined,
  extensions: extensions8,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_material_material = recordCodec(spec_material);
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
});
const extensions9 = {
  oid: "1377304",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "js_reserved",
    name: "null"
  },
  tags: Object.create(null)
};
const parts9 = ["js_reserved", "null"];
const sqlIdent9 = sql.identifier(...parts9);
const spec_null = {
  name: "null",
  identifier: sqlIdent9,
  attributes: attributes5,
  description: undefined,
  extensions: extensions9,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_null_null = recordCodec(spec_null);
const attributes6 = Object.fromEntries([[id, {
  description: undefined,
  codec: TYPES.int,
  notNull: true,
  hasDefault: true,
  extensions: {
    tags: {}
  }
}], [brand, {
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
}]]);
const extensions10 = {
  oid: "1377234",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "js_reserved",
    name: "project"
  },
  tags: Object.create(null)
};
const parts10 = ["js_reserved", "project"];
const sqlIdent10 = sql.identifier(...parts10);
const spec_project = {
  name: "project",
  identifier: sqlIdent10,
  attributes: attributes6,
  description: undefined,
  extensions: extensions10,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_project_project = recordCodec(spec_project);
const attributes7 = Object.assign(Object.create(null), {
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
    codec: attributes_type_codec_itemType,
    notNull: true,
    hasDefault: true,
    via: "relationalItemsByMyId",
    restrictedAccess: undefined,
    description: undefined,
    extensions: {
      tags: attributes.type.extensions.tags
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
      tags: attributes.constructor.extensions.tags
    }
  }
});
const extensions11 = {
  oid: "1377220",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "js_reserved",
    name: "relational_status"
  },
  tags: Object.create(null),
  relationalInterfaceCodecName: "relationalItems"
};
const parts11 = ["js_reserved", "relational_status"];
const sqlIdent11 = sql.identifier(...parts11);
const spec_relationalStatus = {
  name: "relationalStatus",
  identifier: sqlIdent11,
  attributes: attributes7,
  description: undefined,
  extensions: extensions11,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_relationalStatus_relationalStatus = recordCodec(spec_relationalStatus);
const attributes8 = Object.assign(Object.create(null), {
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
});
const extensions12 = {
  oid: "1377282",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "js_reserved",
    name: "yield"
  },
  tags: Object.create(null)
};
const parts12 = ["js_reserved", "yield"];
const sqlIdent12 = sql.identifier(...parts12);
const spec_yield = {
  name: "yield",
  identifier: sqlIdent12,
  attributes: attributes8,
  description: undefined,
  extensions: extensions12,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_yield_yield = recordCodec(spec_yield);
const attributes9 = Object.assign(Object.create(null), {
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
});
const extensions13 = {
  oid: "1377317",
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "js_reserved",
    name: "reserved"
  },
  tags: Object.create(null)
};
const parts13 = ["js_reserved", "reserved"];
const sqlIdent13 = sql.identifier(...parts13);
const spec_reserved = {
  name: "reserved",
  identifier: sqlIdent13,
  attributes: attributes9,
  description: undefined,
  extensions: extensions13,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_reserved_reserved = recordCodec(spec_reserved);
const attributes10 = Object.assign(Object.create(null), {
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
    codec: attributes_type_codec_itemType,
    notNull: true,
    hasDefault: true,
    extensions: {
      tags: attributes.type.extensions.tags
    }
  },
  constructor: {
    description: undefined,
    codec: TYPES.text,
    notNull: false,
    hasDefault: false,
    extensions: {
      tags: attributes.constructor.extensions.tags
    }
  }
});
const extensions14 = {
  oid: "1377194",
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
};
const parts14 = ["js_reserved", "relational_items"];
const sqlIdent14 = sql.identifier(...parts14);
const spec_relationalItems = {
  name: "relationalItems",
  identifier: sqlIdent14,
  attributes: attributes10,
  description: undefined,
  extensions: extensions14,
  executor: executor_mainPgExecutor
};
const registryConfig_pgCodecs_relationalItems_relationalItems = recordCodec(spec_relationalItems);
const extensions15 = {
  pg: {
    serviceName: "main",
    schemaName: "js_reserved",
    name: "await"
  },
  tags: {
    behavior: ["queryField -mutationField -typeField", "-filter -order"]
  }
};
const parts15 = ["js_reserved", "await"];
const sqlIdent15 = sql.identifier(...parts15);
const extensions16 = {
  pg: {
    serviceName: "main",
    schemaName: "js_reserved",
    name: "case"
  },
  tags: {
    behavior: ["queryField -mutationField -typeField", "-filter -order"]
  }
};
const parts16 = ["js_reserved", "case"];
const sqlIdent16 = sql.identifier(...parts16);
const fromCallback2 = (...args) => sql`${sqlIdent16}(${sqlFromArgDigests(args)})`;
const parameters2 = [{
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
}];
const extensions17 = {
  pg: {
    serviceName: "main",
    schemaName: "js_reserved",
    name: "valueOf"
  },
  tags: {
    behavior: ["queryField -mutationField -typeField", "-filter -order"]
  }
};
const parts17 = ["js_reserved", "valueOf"];
const sqlIdent17 = sql.identifier(...parts17);
const fromCallback3 = (...args) => sql`${sqlIdent17}(${sqlFromArgDigests(args)})`;
const parameters3 = [{
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
}];
const extensions18 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "js_reserved",
    name: "relational_topics"
  },
  tags: {}
};
const uniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_relational_topics_relational_topics = {
  executor: executor_mainPgExecutor,
  name: "relational_topics",
  identifier: "main.js_reserved.relational_topics",
  from: registryConfig_pgCodecs_relationalTopics_relationalTopics.sqlType,
  codec: registryConfig_pgCodecs_relationalTopics_relationalTopics,
  uniques,
  isVirtual: false,
  description: undefined,
  extensions: extensions18
};
const extensions19 = {
  pg: {
    serviceName: "main",
    schemaName: "js_reserved",
    name: "null_yield"
  },
  tags: {
    behavior: ["-queryField -mutationField typeField", "-filter -order"]
  }
};
const parts18 = ["js_reserved", "null_yield"];
const sqlIdent18 = sql.identifier(...parts18);
const fromCallback4 = (...args) => sql`${sqlIdent18}(${sqlFromArgDigests(args)})`;
const parameters4 = [{
  name: "n",
  required: true,
  notNull: false,
  codec: registryConfig_pgCodecs_null_null
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
}];
const extensions20 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "js_reserved",
    name: "__proto__"
  },
  tags: {}
};
const uniques2 = [{
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
const extensions21 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "js_reserved",
    name: "building"
  },
  tags: {}
};
const uniques3 = [{
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
  executor: executor_mainPgExecutor,
  name: "building",
  identifier: "main.js_reserved.building",
  from: registryConfig_pgCodecs_building_building.sqlType,
  codec: registryConfig_pgCodecs_building_building,
  uniques: uniques3,
  isVirtual: false,
  description: undefined,
  extensions: extensions21
};
const extensions22 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "js_reserved",
    name: "constructor"
  },
  tags: {}
};
const uniques4 = [{
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
const extensions23 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "js_reserved",
    name: "crop"
  },
  tags: {}
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
  attributes: ["yield"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const extensions24 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "js_reserved",
    name: "machine"
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
const registryConfig_pgResources_machine_machine = {
  executor: executor_mainPgExecutor,
  name: "machine",
  identifier: "main.js_reserved.machine",
  from: registryConfig_pgCodecs_machine_machine.sqlType,
  codec: registryConfig_pgCodecs_machine_machine,
  uniques: uniques6,
  isVirtual: false,
  description: undefined,
  extensions: extensions24
};
const extensions25 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "js_reserved",
    name: "material"
  },
  tags: {}
};
const uniques7 = [{
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
const extensions26 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "js_reserved",
    name: "null"
  },
  tags: {}
};
const uniques8 = [{
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
const extensions27 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "js_reserved",
    name: "project"
  },
  tags: {}
};
const uniques9 = [{
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
const extensions28 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "js_reserved",
    name: "relational_status"
  },
  tags: {}
};
const uniques10 = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_relational_status_relational_status = {
  executor: executor_mainPgExecutor,
  name: "relational_status",
  identifier: "main.js_reserved.relational_status",
  from: registryConfig_pgCodecs_relationalStatus_relationalStatus.sqlType,
  codec: registryConfig_pgCodecs_relationalStatus_relationalStatus,
  uniques: uniques10,
  isVirtual: false,
  description: undefined,
  extensions: extensions28
};
const extensions29 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "js_reserved",
    name: "yield"
  },
  tags: {}
};
const uniques11 = [{
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
const extensions30 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "js_reserved",
    name: "reserved"
  },
  tags: {}
};
const uniques12 = [{
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
const extensions31 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "js_reserved",
    name: "relational_items"
  },
  tags: {
    interface: "mode:relational type:type",
    type: extensions14.tags.type
  }
};
const uniques13 = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_relational_items_relational_items = {
  executor: executor_mainPgExecutor,
  name: "relational_items",
  identifier: "main.js_reserved.relational_items",
  from: registryConfig_pgCodecs_relationalItems_relationalItems.sqlType,
  codec: registryConfig_pgCodecs_relationalItems_relationalItems,
  uniques: uniques13,
  isVirtual: false,
  description: undefined,
  extensions: extensions31
};
const registryConfig = {
  pgCodecs: Object.fromEntries([[int4, TYPES.int], [relationalTopics, registryConfig_pgCodecs_relationalTopics_relationalTopics], [text, TYPES.text], ["__proto__", registryConfig_pgCodecs___proto_____proto__], [building, registryConfig_pgCodecs_building_building], [constructor, registryConfig_pgCodecs_constructor_constructor], [crop, registryConfig_pgCodecs_crop_crop], [machine, registryConfig_pgCodecs_machine_machine], [material, registryConfig_pgCodecs_material_material], [null, registryConfig_pgCodecs_null_null], [project, registryConfig_pgCodecs_project_project], [relationalStatus, registryConfig_pgCodecs_relationalStatus_relationalStatus], [yield, registryConfig_pgCodecs_yield_yield], [reserved, registryConfig_pgCodecs_reserved_reserved], [relationalItems, registryConfig_pgCodecs_relationalItems_relationalItems], [itemType, attributes_type_codec_itemType], [varchar, TYPES.varchar], [bpchar, TYPES.bpchar]]),
  pgResources: Object.fromEntries([[await, {
    executor: executor_mainPgExecutor,
    name: "await",
    identifier: "main.js_reserved.await(int4,int4,int4,int4)",
    from(...args) {
      return sql`${sqlIdent15}(${sqlFromArgDigests(args)})`;
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
    extensions: extensions15,
    description: undefined
  }], [case, {
    executor: executor_mainPgExecutor,
    name: "case",
    identifier: "main.js_reserved.case(int4,int4,int4,int4)",
    from: fromCallback2,
    parameters: parameters2,
    isUnique: !false,
    codec: TYPES.int,
    uniques: [],
    isMutation: false,
    extensions: extensions16,
    description: undefined
  }], [valueOf, {
    executor: executor_mainPgExecutor,
    name: "valueOf",
    identifier: "main.js_reserved.valueOf(int4,int4,int4,int4)",
    from: fromCallback3,
    parameters: parameters3,
    isUnique: !false,
    codec: TYPES.int,
    uniques: [],
    isMutation: false,
    extensions: extensions17,
    description: undefined
  }], [relational_topics, registryConfig_pgResources_relational_topics_relational_topics], [null_yield, {
    executor: executor_mainPgExecutor,
    name: "null_yield",
    identifier: "main.js_reserved.null_yield(js_reserved.null,int4,int4,int4,int4)",
    from: fromCallback4,
    parameters: parameters4,
    isUnique: !false,
    codec: TYPES.int,
    uniques: [],
    isMutation: false,
    extensions: extensions19,
    description: undefined
  }], ["__proto__", {
    executor: executor_mainPgExecutor,
    name: "__proto__",
    identifier: "main.js_reserved.__proto__",
    from: registryConfig_pgCodecs___proto_____proto__.sqlType,
    codec: registryConfig_pgCodecs___proto_____proto__,
    uniques: uniques2,
    isVirtual: false,
    description: undefined,
    extensions: extensions20
  }], [building, registryConfig_pgResources_building_building], [constructor, {
    executor: executor_mainPgExecutor,
    name: "constructor",
    identifier: "main.js_reserved.constructor",
    from: registryConfig_pgCodecs_constructor_constructor.sqlType,
    codec: registryConfig_pgCodecs_constructor_constructor,
    uniques: uniques4,
    isVirtual: false,
    description: undefined,
    extensions: extensions22
  }], [crop, {
    executor: executor_mainPgExecutor,
    name: "crop",
    identifier: "main.js_reserved.crop",
    from: registryConfig_pgCodecs_crop_crop.sqlType,
    codec: registryConfig_pgCodecs_crop_crop,
    uniques: uniques5,
    isVirtual: false,
    description: undefined,
    extensions: extensions23
  }], [machine, registryConfig_pgResources_machine_machine], [material, {
    executor: executor_mainPgExecutor,
    name: "material",
    identifier: "main.js_reserved.material",
    from: registryConfig_pgCodecs_material_material.sqlType,
    codec: registryConfig_pgCodecs_material_material,
    uniques: uniques7,
    isVirtual: false,
    description: undefined,
    extensions: extensions25
  }], [null, {
    executor: executor_mainPgExecutor,
    name: "null",
    identifier: "main.js_reserved.null",
    from: registryConfig_pgCodecs_null_null.sqlType,
    codec: registryConfig_pgCodecs_null_null,
    uniques: uniques8,
    isVirtual: false,
    description: undefined,
    extensions: extensions26
  }], [project, {
    executor: executor_mainPgExecutor,
    name: "project",
    identifier: "main.js_reserved.project",
    from: registryConfig_pgCodecs_project_project.sqlType,
    codec: registryConfig_pgCodecs_project_project,
    uniques: uniques9,
    isVirtual: false,
    description: undefined,
    extensions: extensions27
  }], [relational_status, registryConfig_pgResources_relational_status_relational_status], [yield, {
    executor: executor_mainPgExecutor,
    name: "yield",
    identifier: "main.js_reserved.yield",
    from: registryConfig_pgCodecs_yield_yield.sqlType,
    codec: registryConfig_pgCodecs_yield_yield,
    uniques: uniques11,
    isVirtual: false,
    description: undefined,
    extensions: extensions29
  }], [reserved, {
    executor: executor_mainPgExecutor,
    name: "reserved",
    identifier: "main.js_reserved.reserved",
    from: registryConfig_pgCodecs_reserved_reserved.sqlType,
    codec: registryConfig_pgCodecs_reserved_reserved,
    uniques: uniques12,
    isVirtual: false,
    description: undefined,
    extensions: extensions30
  }], [relational_items, registryConfig_pgResources_relational_items_relational_items]]),
  pgRelations: Object.assign(Object.create(null), {
    building: Object.assign(Object.create(null), {
      machinesByTheirConstructor: {
        localCodec: registryConfig_pgCodecs_building_building,
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
        localCodec: registryConfig_pgCodecs_building_building,
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
        localCodec: registryConfig_pgCodecs_machine_machine,
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
        localCodec: registryConfig_pgCodecs_relationalItems_relationalItems,
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
        localCodec: registryConfig_pgCodecs_relationalItems_relationalItems,
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
        localCodec: registryConfig_pgCodecs_relationalItems_relationalItems,
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
        localCodec: registryConfig_pgCodecs_relationalStatus_relationalStatus,
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
        localCodec: registryConfig_pgCodecs_relationalTopics_relationalTopics,
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
const handler2 = {
  typeName: "RelationalTopic",
  codec: {
    name: "base64JSON",
    encode(value) {
      return Buffer.from(JSON.stringify(value), "utf8").toString("base64");
    },
    decode(value) {
      return JSON.parse(Buffer.from(value, "base64").toString("utf8"));
    }
  },
  deprecationReason: undefined,
  plan($record) {
    return list([constant("relational_topics", false), $record.get("id")]);
  },
  getSpec($list) {
    return {
      id: access($list, [1])
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
    encode(value) {
      return typeof value === "string" ? value : null;
    },
    decode(value) {
      return typeof value === "string" ? value : null;
    }
  },
  base64JSON: handler2.codec,
  pipeString: {
    name: "pipeString",
    encode(value) {
      return Array.isArray(value) ? value.join("|") : null;
    },
    decode(value) {
      return typeof value === "string" ? value.split("|") : null;
    }
  }
});
const building_buildingPgResource = registry.pgResources["building"];
const relational_items_relational_itemsPgResource = registry.pgResources["relational_items"];
const relational_status_relational_statusPgResource = registry.pgResources["relational_status"];
const handler2 = {
  typeName: "Building",
  codec: handler2.codec,
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
function Building_machinesByConstructor_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Building_machinesByConstructor_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Building_machinesByConstructor_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Building_machinesByConstructor_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Building_machinesByConstructor_after_applyPlan(_, $connection, val) {
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
function Building_machinesByConstructorList_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Building_machinesByConstructorList_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
const specFromRecord2 = $record => {
  return registryConfig.pgRelations.building.relationalItemsByTheirConstructor.remoteAttributes.reduce((memo, remoteAttributeName, i) => {
    memo[remoteAttributeName] = $record.get(registryConfig.pgRelations.building.relationalItemsByTheirConstructor.localAttributes[i]);
    return memo;
  }, Object.create(null));
};
function Building_relationalItemsByConstructor_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Building_relationalItemsByConstructor_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Building_relationalItemsByConstructor_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Building_relationalItemsByConstructor_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Building_relationalItemsByConstructor_after_applyPlan(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
function Building_relationalItemsByConstructorList_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Building_relationalItemsByConstructorList_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function MachinesConnection_nodesPlan($connection) {
  return $connection.nodes();
}
function MachinesConnection_edgesPlan($connection) {
  return $connection.edges();
}
function MachinesConnection_pageInfoPlan($connection) {
  // TYPES: why is this a TypeScript issue without the 'any'?
  return $connection.pageInfo();
}
const handler3 = {
  typeName: "Machine",
  codec: handler2.codec,
  deprecationReason: undefined,
  plan($record) {
    return list([constant("machines", false), $record.get("id")]);
  },
  getSpec($list) {
    return {
      id: access($list, [1])
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
function PageInfo_hasNextPagePlan($pageInfo) {
  return $pageInfo.hasNextPage();
}
function PageInfo_hasPreviousPagePlan($pageInfo) {
  return $pageInfo.hasPreviousPage();
}
function RelationalItemsConnection_nodesPlan($connection) {
  return $connection.nodes();
}
function RelationalItemsConnection_edgesPlan($connection) {
  return $connection.edges();
}
function RelationalItemsConnection_pageInfoPlan($connection) {
  // TYPES: why is this a TypeScript issue without the 'any'?
  return $connection.pageInfo();
}
const handler4 = {
  typeName: "RelationalStatus",
  codec: handler2.codec,
  deprecationReason: undefined,
  plan($record) {
    return list([constant("relational_statuses", false), $record.get("id")]);
  },
  getSpec($list) {
    return {
      id: access($list, [1])
    };
  },
  get(spec) {
    return relational_status_relational_statusPgResource.get(spec);
  },
  match(obj) {
    return obj[0] === "relational_statuses";
  }
};
function Query_queryPlan() {
  return rootValue();
}
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
  RelationalTopic: handler2,
  _Proto__: {
    typeName: "_Proto__",
    codec: handler2.codec,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("__proto__S", false), ...uniques2[0].attributes.map(attribute => $record.get(attribute))]);
    },
    getSpec($list) {
      const spec = uniques2[0].attributes.reduce((memo, attribute, index) => {
        memo[attribute] = access($list, [index + 1]);
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
    codec: handler2.codec,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("constructors", false), $record.get("id")]);
    },
    getSpec($list) {
      return {
        id: access($list, [1])
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
    codec: handler2.codec,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("crops", false), $record.get("id")]);
    },
    getSpec($list) {
      return {
        id: access($list, [1])
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
    codec: handler2.codec,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("materials", false), $record.get("id")]);
    },
    getSpec($list) {
      return {
        id: access($list, [1])
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
    codec: handler2.codec,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("nulls", false), $record.get("id")]);
    },
    getSpec($list) {
      return {
        id: access($list, [1])
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
    codec: handler2.codec,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("projects", false), $record.get("id")]);
    },
    getSpec($list) {
      return {
        id: access($list, [1])
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
    codec: handler2.codec,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("yields", false), $record.get("id")]);
    },
    getSpec($list) {
      return {
        id: access($list, [1])
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
    codec: handler2.codec,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("reserveds", false), $record.get("id")]);
    },
    getSpec($list) {
      return {
        id: access($list, [1])
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
function Query_allRelationalTopicsList_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allRelationalTopicsList_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allRelationalTopics_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allRelationalTopics_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Query_allRelationalTopics_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allRelationalTopics_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Query_allRelationalTopics_after_applyPlan(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
function Query_allProtoSList_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allProtoSList_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allProtoS_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allProtoS_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Query_allProtoS_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allProtoS_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Query_allProtoS_after_applyPlan(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
function Query_allBuildingsList_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allBuildingsList_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
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
function Query_allConstructorsList_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allConstructorsList_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allConstructors_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allConstructors_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Query_allConstructors_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allConstructors_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Query_allConstructors_after_applyPlan(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
function Query_allCropsList_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allCropsList_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allCrops_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allCrops_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Query_allCrops_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allCrops_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Query_allCrops_after_applyPlan(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
function Query_allMachinesList_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allMachinesList_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allMachines_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allMachines_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Query_allMachines_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allMachines_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Query_allMachines_after_applyPlan(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
function Query_allMaterialsList_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allMaterialsList_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allMaterials_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allMaterials_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Query_allMaterials_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allMaterials_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Query_allMaterials_after_applyPlan(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
function Query_allNullsList_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allNullsList_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allNulls_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allNulls_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Query_allNulls_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allNulls_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Query_allNulls_after_applyPlan(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
function Query_allProjectsList_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allProjectsList_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allProjects_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allProjects_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Query_allProjects_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allProjects_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Query_allProjects_after_applyPlan(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
function Query_allRelationalStatusesList_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allRelationalStatusesList_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allRelationalStatuses_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allRelationalStatuses_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Query_allRelationalStatuses_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allRelationalStatuses_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Query_allRelationalStatuses_after_applyPlan(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
function Query_allYieldsList_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allYieldsList_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allYields_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allYields_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Query_allYields_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allYields_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Query_allYields_after_applyPlan(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
function Query_allReservedsList_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allReservedsList_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allReserveds_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allReserveds_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Query_allReserveds_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allReserveds_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Query_allReserveds_after_applyPlan(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
function Query_allRelationalItemsList_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allRelationalItemsList_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allRelationalItems_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allRelationalItems_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Query_allRelationalItems_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allRelationalItems_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Query_allRelationalItems_after_applyPlan(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
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
function RelationalTopicsConnection_nodesPlan($connection) {
  return $connection.nodes();
}
function RelationalTopicsConnection_edgesPlan($connection) {
  return $connection.edges();
}
function RelationalTopicsConnection_pageInfoPlan($connection) {
  // TYPES: why is this a TypeScript issue without the 'any'?
  return $connection.pageInfo();
}
function _Proto__SConnection_nodesPlan($connection) {
  return $connection.nodes();
}
function _Proto__SConnection_edgesPlan($connection) {
  return $connection.edges();
}
function _Proto__SConnection_pageInfoPlan($connection) {
  // TYPES: why is this a TypeScript issue without the 'any'?
  return $connection.pageInfo();
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
function ConstructorsConnection_nodesPlan($connection) {
  return $connection.nodes();
}
function ConstructorsConnection_edgesPlan($connection) {
  return $connection.edges();
}
function ConstructorsConnection_pageInfoPlan($connection) {
  // TYPES: why is this a TypeScript issue without the 'any'?
  return $connection.pageInfo();
}
function CropsConnection_nodesPlan($connection) {
  return $connection.nodes();
}
function CropsConnection_edgesPlan($connection) {
  return $connection.edges();
}
function CropsConnection_pageInfoPlan($connection) {
  // TYPES: why is this a TypeScript issue without the 'any'?
  return $connection.pageInfo();
}
function MaterialsConnection_nodesPlan($connection) {
  return $connection.nodes();
}
function MaterialsConnection_edgesPlan($connection) {
  return $connection.edges();
}
function MaterialsConnection_pageInfoPlan($connection) {
  // TYPES: why is this a TypeScript issue without the 'any'?
  return $connection.pageInfo();
}
function NullsConnection_nodesPlan($connection) {
  return $connection.nodes();
}
function NullsConnection_edgesPlan($connection) {
  return $connection.edges();
}
function NullsConnection_pageInfoPlan($connection) {
  // TYPES: why is this a TypeScript issue without the 'any'?
  return $connection.pageInfo();
}
function ProjectsConnection_nodesPlan($connection) {
  return $connection.nodes();
}
function ProjectsConnection_edgesPlan($connection) {
  return $connection.edges();
}
function ProjectsConnection_pageInfoPlan($connection) {
  // TYPES: why is this a TypeScript issue without the 'any'?
  return $connection.pageInfo();
}
function RelationalStatusesConnection_nodesPlan($connection) {
  return $connection.nodes();
}
function RelationalStatusesConnection_edgesPlan($connection) {
  return $connection.edges();
}
function RelationalStatusesConnection_pageInfoPlan($connection) {
  // TYPES: why is this a TypeScript issue without the 'any'?
  return $connection.pageInfo();
}
function YieldsConnection_nodesPlan($connection) {
  return $connection.nodes();
}
function YieldsConnection_edgesPlan($connection) {
  return $connection.edges();
}
function YieldsConnection_pageInfoPlan($connection) {
  // TYPES: why is this a TypeScript issue without the 'any'?
  return $connection.pageInfo();
}
function ReservedsConnection_nodesPlan($connection) {
  return $connection.nodes();
}
function ReservedsConnection_edgesPlan($connection) {
  return $connection.edges();
}
function ReservedsConnection_pageInfoPlan($connection) {
  // TYPES: why is this a TypeScript issue without the 'any'?
  return $connection.pageInfo();
}
function Mutation_createProto___input_applyPlan(_, $object) {
  return $object;
}
function Mutation_createBuilding_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_createConstructor_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_createCrop_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_createMachine_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_createMaterial_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_createNull_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_createProject_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_createYield_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_createReserved_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName._Proto__, $nodeId);
};
function Mutation_updateProto___input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updateProtoById_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updateProtoByName_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs2 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(handler2, $nodeId);
};
function Mutation_updateBuilding_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updateBuildingById_input_applyPlan(_, $object) {
  return $object;
}
const uniqueAttributes = [["constructor", "constructor"]];
const specFromArgs3 = args => {
  return uniqueAttributes.reduce((memo, [attributeName, fieldName]) => {
    memo[attributeName] = args.get(["input", fieldName]);
    return memo;
  }, Object.create(null));
};
function Mutation_updateBuildingByConstructor_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs4 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Constructor, $nodeId);
};
function Mutation_updateConstructor_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updateConstructorById_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updateConstructorByExport_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updateConstructorByName_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs5 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Crop, $nodeId);
};
function Mutation_updateCrop_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updateCropById_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updateCropByYield_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs6 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(handler3, $nodeId);
};
function Mutation_updateMachine_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updateMachineById_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs7 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Material, $nodeId);
};
function Mutation_updateMaterial_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updateMaterialById_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updateMaterialByClass_input_applyPlan(_, $object) {
  return $object;
}
const uniqueAttributes2 = [["valueOf", "valueOf"]];
const specFromArgs8 = args => {
  return uniqueAttributes2.reduce((memo, [attributeName, fieldName]) => {
    memo[attributeName] = args.get(["input", fieldName]);
    return memo;
  }, Object.create(null));
};
function Mutation_updateMaterialByValueOf_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs9 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Null, $nodeId);
};
function Mutation_updateNull_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updateNullById_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updateNullByBreak_input_applyPlan(_, $object) {
  return $object;
}
const uniqueAttributes3 = [["hasOwnProperty", "hasOwnProperty"]];
const specFromArgs10 = args => {
  return uniqueAttributes3.reduce((memo, [attributeName, fieldName]) => {
    memo[attributeName] = args.get(["input", fieldName]);
    return memo;
  }, Object.create(null));
};
function Mutation_updateNullByHasOwnProperty_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs11 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Project, $nodeId);
};
function Mutation_updateProject_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updateProjectById_input_applyPlan(_, $object) {
  return $object;
}
const uniqueAttributes4 = [["__proto__", "_proto__"]];
const specFromArgs12 = args => {
  return uniqueAttributes4.reduce((memo, [attributeName, fieldName]) => {
    memo[attributeName] = args.get(["input", fieldName]);
    return memo;
  }, Object.create(null));
};
function Mutation_updateProjectByProto___input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs13 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Yield, $nodeId);
};
function Mutation_updateYield_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updateYieldById_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updateYieldByExport_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs14 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Reserved, $nodeId);
};
function Mutation_updateReserved_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updateReservedById_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updateReservedByCase_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updateReservedByDo_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updateReservedByNull_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs15 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName._Proto__, $nodeId);
};
function Mutation_deleteProto___input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deleteProtoById_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deleteProtoByName_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs16 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(handler2, $nodeId);
};
function Mutation_deleteBuilding_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deleteBuildingById_input_applyPlan(_, $object) {
  return $object;
}
const uniqueAttributes5 = [["constructor", "constructor"]];
const specFromArgs17 = args => {
  return uniqueAttributes5.reduce((memo, [attributeName, fieldName]) => {
    memo[attributeName] = args.get(["input", fieldName]);
    return memo;
  }, Object.create(null));
};
function Mutation_deleteBuildingByConstructor_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs18 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Constructor, $nodeId);
};
function Mutation_deleteConstructor_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deleteConstructorById_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deleteConstructorByExport_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deleteConstructorByName_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs19 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Crop, $nodeId);
};
function Mutation_deleteCrop_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deleteCropById_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deleteCropByYield_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs20 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(handler3, $nodeId);
};
function Mutation_deleteMachine_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deleteMachineById_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs21 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Material, $nodeId);
};
function Mutation_deleteMaterial_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deleteMaterialById_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deleteMaterialByClass_input_applyPlan(_, $object) {
  return $object;
}
const uniqueAttributes6 = [["valueOf", "valueOf"]];
const specFromArgs22 = args => {
  return uniqueAttributes6.reduce((memo, [attributeName, fieldName]) => {
    memo[attributeName] = args.get(["input", fieldName]);
    return memo;
  }, Object.create(null));
};
function Mutation_deleteMaterialByValueOf_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs23 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Null, $nodeId);
};
function Mutation_deleteNull_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deleteNullById_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deleteNullByBreak_input_applyPlan(_, $object) {
  return $object;
}
const uniqueAttributes7 = [["hasOwnProperty", "hasOwnProperty"]];
const specFromArgs24 = args => {
  return uniqueAttributes7.reduce((memo, [attributeName, fieldName]) => {
    memo[attributeName] = args.get(["input", fieldName]);
    return memo;
  }, Object.create(null));
};
function Mutation_deleteNullByHasOwnProperty_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs25 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Project, $nodeId);
};
function Mutation_deleteProject_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deleteProjectById_input_applyPlan(_, $object) {
  return $object;
}
const uniqueAttributes8 = [["__proto__", "_proto__"]];
const specFromArgs26 = args => {
  return uniqueAttributes8.reduce((memo, [attributeName, fieldName]) => {
    memo[attributeName] = args.get(["input", fieldName]);
    return memo;
  }, Object.create(null));
};
function Mutation_deleteProjectByProto___input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs27 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Yield, $nodeId);
};
function Mutation_deleteYield_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deleteYieldById_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deleteYieldByExport_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs28 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Reserved, $nodeId);
};
function Mutation_deleteReserved_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deleteReservedById_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deleteReservedByCase_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deleteReservedByDo_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deleteReservedByNull_input_applyPlan(_, $object) {
  return $object;
}
function CreateProtoPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function CreateProtoPayload__proto__Plan($object) {
  return $object.get("result");
}
function CreateProtoPayload_queryPlan() {
  return rootValue();
}
function CreateProtoInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function CreateProtoInput__proto___applyPlan($object) {
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
function CreateConstructorPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function CreateConstructorPayload_constructorPlan($object) {
  return $object.get("result");
}
function CreateConstructorPayload_queryPlan() {
  return rootValue();
}
function CreateConstructorInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function CreateConstructorInput_constructor_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function CreateCropPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function CreateCropPayload_cropPlan($object) {
  return $object.get("result");
}
function CreateCropPayload_queryPlan() {
  return rootValue();
}
function CreateCropInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function CreateCropInput_crop_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function CreateMachinePayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function CreateMachinePayload_machinePlan($object) {
  return $object.get("result");
}
function CreateMachinePayload_queryPlan() {
  return rootValue();
}
const specFromRecord4 = $record => {
  return registryConfig.pgRelations.machine.buildingByMyConstructor.remoteAttributes.reduce((memo, remoteAttributeName, i) => {
    memo[remoteAttributeName] = $record.get(registryConfig.pgRelations.machine.buildingByMyConstructor.localAttributes[i]);
    return memo;
  }, Object.create(null));
};
function CreateMachineInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function CreateMachineInput_machine_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function CreateMaterialPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function CreateMaterialPayload_materialPlan($object) {
  return $object.get("result");
}
function CreateMaterialPayload_queryPlan() {
  return rootValue();
}
function CreateMaterialInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function CreateMaterialInput_material_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function CreateNullPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function CreateNullPayload_nullPlan($object) {
  return $object.get("result");
}
function CreateNullPayload_queryPlan() {
  return rootValue();
}
function CreateNullInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function CreateNullInput_null_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function CreateProjectPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function CreateProjectPayload_projectPlan($object) {
  return $object.get("result");
}
function CreateProjectPayload_queryPlan() {
  return rootValue();
}
function CreateProjectInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function CreateProjectInput_project_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function CreateYieldPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function CreateYieldPayload_yieldPlan($object) {
  return $object.get("result");
}
function CreateYieldPayload_queryPlan() {
  return rootValue();
}
function CreateYieldInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function CreateYieldInput_yield_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function CreateReservedPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function CreateReservedPayload_reservedPlan($object) {
  return $object.get("result");
}
function CreateReservedPayload_queryPlan() {
  return rootValue();
}
function CreateReservedInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function CreateReservedInput_reserved_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateProtoPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function UpdateProtoPayload__proto__Plan($object) {
  return $object.get("result");
}
function UpdateProtoPayload_queryPlan() {
  return rootValue();
}
function UpdateProtoInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateProtoInput__protoPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateProtoByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateProtoByIdInput__protoPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateProtoByNameInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateProtoByNameInput__protoPatch_applyPlan($object) {
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
function UpdateBuildingByConstructorInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateBuildingByConstructorInput_buildingPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateConstructorPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function UpdateConstructorPayload_constructorPlan($object) {
  return $object.get("result");
}
function UpdateConstructorPayload_queryPlan() {
  return rootValue();
}
function UpdateConstructorInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateConstructorInput_constructorPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateConstructorByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateConstructorByIdInput_constructorPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateConstructorByExportInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateConstructorByExportInput_constructorPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateConstructorByNameInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateConstructorByNameInput_constructorPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateCropPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function UpdateCropPayload_cropPlan($object) {
  return $object.get("result");
}
function UpdateCropPayload_queryPlan() {
  return rootValue();
}
function UpdateCropInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateCropInput_cropPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateCropByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateCropByIdInput_cropPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateCropByYieldInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateCropByYieldInput_cropPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateMachinePayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function UpdateMachinePayload_machinePlan($object) {
  return $object.get("result");
}
function UpdateMachinePayload_queryPlan() {
  return rootValue();
}
const specFromRecord5 = $record => {
  return registryConfig.pgRelations.machine.buildingByMyConstructor.remoteAttributes.reduce((memo, remoteAttributeName, i) => {
    memo[remoteAttributeName] = $record.get(registryConfig.pgRelations.machine.buildingByMyConstructor.localAttributes[i]);
    return memo;
  }, Object.create(null));
};
function UpdateMachineInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateMachineInput_machinePatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateMachineByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateMachineByIdInput_machinePatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateMaterialPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function UpdateMaterialPayload_materialPlan($object) {
  return $object.get("result");
}
function UpdateMaterialPayload_queryPlan() {
  return rootValue();
}
function UpdateMaterialInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateMaterialInput_materialPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateMaterialByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateMaterialByIdInput_materialPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateMaterialByClassInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateMaterialByClassInput_materialPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateMaterialByValueOfInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateMaterialByValueOfInput_materialPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateNullPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function UpdateNullPayload_nullPlan($object) {
  return $object.get("result");
}
function UpdateNullPayload_queryPlan() {
  return rootValue();
}
function UpdateNullInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateNullInput_nullPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateNullByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateNullByIdInput_nullPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateNullByBreakInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateNullByBreakInput_nullPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateNullByHasOwnPropertyInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateNullByHasOwnPropertyInput_nullPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateProjectPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function UpdateProjectPayload_projectPlan($object) {
  return $object.get("result");
}
function UpdateProjectPayload_queryPlan() {
  return rootValue();
}
function UpdateProjectInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateProjectInput_projectPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateProjectByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateProjectByIdInput_projectPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateProjectByProtoInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateProjectByProtoInput_projectPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateYieldPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function UpdateYieldPayload_yieldPlan($object) {
  return $object.get("result");
}
function UpdateYieldPayload_queryPlan() {
  return rootValue();
}
function UpdateYieldInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateYieldInput_yieldPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateYieldByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateYieldByIdInput_yieldPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateYieldByExportInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateYieldByExportInput_yieldPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateReservedPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function UpdateReservedPayload_reservedPlan($object) {
  return $object.get("result");
}
function UpdateReservedPayload_queryPlan() {
  return rootValue();
}
function UpdateReservedInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateReservedInput_reservedPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateReservedByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateReservedByIdInput_reservedPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateReservedByCaseInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateReservedByCaseInput_reservedPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateReservedByDoInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateReservedByDoInput_reservedPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateReservedByNullInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateReservedByNullInput_reservedPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function DeleteProtoPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function DeleteProtoPayload__proto__Plan($object) {
  return $object.get("result");
}
function DeleteProtoPayload_queryPlan() {
  return rootValue();
}
function DeleteProtoInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteProtoByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteProtoByNameInput_clientMutationId_applyPlan($input, val) {
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
function DeleteBuildingByConstructorInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteConstructorPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function DeleteConstructorPayload_constructorPlan($object) {
  return $object.get("result");
}
function DeleteConstructorPayload_queryPlan() {
  return rootValue();
}
function DeleteConstructorInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteConstructorByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteConstructorByExportInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteConstructorByNameInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteCropPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function DeleteCropPayload_cropPlan($object) {
  return $object.get("result");
}
function DeleteCropPayload_queryPlan() {
  return rootValue();
}
function DeleteCropInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteCropByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteCropByYieldInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteMachinePayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function DeleteMachinePayload_machinePlan($object) {
  return $object.get("result");
}
function DeleteMachinePayload_queryPlan() {
  return rootValue();
}
const specFromRecord6 = $record => {
  return registryConfig.pgRelations.machine.buildingByMyConstructor.remoteAttributes.reduce((memo, remoteAttributeName, i) => {
    memo[remoteAttributeName] = $record.get(registryConfig.pgRelations.machine.buildingByMyConstructor.localAttributes[i]);
    return memo;
  }, Object.create(null));
};
function DeleteMachineInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteMachineByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteMaterialPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function DeleteMaterialPayload_materialPlan($object) {
  return $object.get("result");
}
function DeleteMaterialPayload_queryPlan() {
  return rootValue();
}
function DeleteMaterialInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteMaterialByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteMaterialByClassInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteMaterialByValueOfInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteNullPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function DeleteNullPayload_nullPlan($object) {
  return $object.get("result");
}
function DeleteNullPayload_queryPlan() {
  return rootValue();
}
function DeleteNullInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteNullByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteNullByBreakInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteNullByHasOwnPropertyInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteProjectPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function DeleteProjectPayload_projectPlan($object) {
  return $object.get("result");
}
function DeleteProjectPayload_queryPlan() {
  return rootValue();
}
function DeleteProjectInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteProjectByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteProjectByProtoInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteYieldPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function DeleteYieldPayload_yieldPlan($object) {
  return $object.get("result");
}
function DeleteYieldPayload_queryPlan() {
  return rootValue();
}
function DeleteYieldInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteYieldByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteYieldByExportInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteReservedPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function DeleteReservedPayload_reservedPlan($object) {
  return $object.get("result");
}
function DeleteReservedPayload_queryPlan() {
  return rootValue();
}
function DeleteReservedInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteReservedByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteReservedByCaseInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteReservedByDoInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteReservedByNullInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
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
          applyPlan: Building_machinesByConstructor_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Building_machinesByConstructor_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Building_machinesByConstructor_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Building_machinesByConstructor_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Building_machinesByConstructor_after_applyPlan
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
          applyPlan: Building_machinesByConstructorList_first_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Building_machinesByConstructorList_offset_applyPlan
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
          applyPlan: Building_relationalItemsByConstructor_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Building_relationalItemsByConstructor_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Building_relationalItemsByConstructor_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Building_relationalItemsByConstructor_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Building_relationalItemsByConstructor_after_applyPlan
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
          applyPlan: Building_relationalItemsByConstructorList_first_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Building_relationalItemsByConstructorList_offset_applyPlan
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
    nodes: MachinesConnection_nodesPlan,
    edges: MachinesConnection_edgesPlan,
    pageInfo: MachinesConnection_pageInfoPlan,
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
  MachinesOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        uniques6[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_machine_machine.attributes[attributeName];
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
          const attribute = registryConfig_pgCodecs_machine_machine.attributes[attributeName];
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes3.id.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes3.input.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes3.constructor.codec)}`;
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
    nodes: RelationalItemsConnection_nodesPlan,
    edges: RelationalItemsConnection_edgesPlan,
    pageInfo: RelationalItemsConnection_pageInfoPlan,
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
        uniques13[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_relationalItems_relationalItems.attributes[attributeName];
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
        uniques13[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_relationalItems_relationalItems.attributes[attributeName];
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes10.id.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes10.type.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes10.constructor.codec)}`;
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
    query: Query_queryPlan,
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
          applyPlan: Query_allRelationalTopicsList_first_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allRelationalTopicsList_offset_applyPlan
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
          applyPlan: Query_allRelationalTopics_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allRelationalTopics_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allRelationalTopics_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allRelationalTopics_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allRelationalTopics_after_applyPlan
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
          applyPlan: Query_allProtoSList_first_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allProtoSList_offset_applyPlan
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
          applyPlan: Query_allProtoS_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allProtoS_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allProtoS_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allProtoS_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allProtoS_after_applyPlan
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
          applyPlan: Query_allBuildingsList_first_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allBuildingsList_offset_applyPlan
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
    },
    allConstructorsList: {
      plan() {
        return pgResource_constructorPgResource.find();
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allConstructorsList_first_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allConstructorsList_offset_applyPlan
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
          applyPlan: Query_allConstructors_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allConstructors_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allConstructors_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allConstructors_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allConstructors_after_applyPlan
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
          applyPlan: Query_allCropsList_first_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allCropsList_offset_applyPlan
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
          applyPlan: Query_allCrops_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allCrops_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allCrops_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allCrops_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allCrops_after_applyPlan
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
          applyPlan: Query_allMachinesList_first_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allMachinesList_offset_applyPlan
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
          applyPlan: Query_allMachines_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allMachines_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allMachines_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allMachines_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allMachines_after_applyPlan
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
          applyPlan: Query_allMaterialsList_first_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allMaterialsList_offset_applyPlan
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
          applyPlan: Query_allMaterials_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allMaterials_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allMaterials_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allMaterials_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allMaterials_after_applyPlan
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
          applyPlan: Query_allNullsList_first_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allNullsList_offset_applyPlan
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
          applyPlan: Query_allNulls_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allNulls_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allNulls_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allNulls_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allNulls_after_applyPlan
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
          applyPlan: Query_allProjectsList_first_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allProjectsList_offset_applyPlan
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
          applyPlan: Query_allProjects_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allProjects_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allProjects_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allProjects_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allProjects_after_applyPlan
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
          applyPlan: Query_allRelationalStatusesList_first_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allRelationalStatusesList_offset_applyPlan
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
          applyPlan: Query_allRelationalStatuses_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allRelationalStatuses_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allRelationalStatuses_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allRelationalStatuses_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allRelationalStatuses_after_applyPlan
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
          applyPlan: Query_allYieldsList_first_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allYieldsList_offset_applyPlan
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
          applyPlan: Query_allYields_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allYields_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allYields_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allYields_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allYields_after_applyPlan
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
          applyPlan: Query_allReservedsList_first_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allReservedsList_offset_applyPlan
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
          applyPlan: Query_allReserveds_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allReserveds_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allReserveds_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allReserveds_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allReserveds_after_applyPlan
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
          applyPlan: Query_allRelationalItemsList_first_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allRelationalItemsList_offset_applyPlan
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
          applyPlan: Query_allRelationalItems_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allRelationalItems_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allRelationalItems_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allRelationalItems_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allRelationalItems_after_applyPlan
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
        uniques[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_relationalTopics_relationalTopics.attributes[attributeName];
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
        uniques[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_relationalTopics_relationalTopics.attributes[attributeName];
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes.id.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes.title.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes.type.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes.constructor.codec)}`;
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
    nodes: RelationalTopicsConnection_nodesPlan,
    edges: RelationalTopicsConnection_edgesPlan,
    pageInfo: RelationalTopicsConnection_pageInfoPlan,
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
        uniques2[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs___proto_____proto__.attributes[attributeName];
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
          const attribute = registryConfig_pgCodecs___proto_____proto__.attributes[attributeName];
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes_object_Object_.brand.codec)}`;
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
    nodes: _Proto__SConnection_nodesPlan,
    edges: _Proto__SConnection_edgesPlan,
    pageInfo: _Proto__SConnection_pageInfoPlan,
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
        uniques3[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_building_building.attributes[attributeName];
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
        uniques3[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_building_building.attributes[attributeName];
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes_object_Object_2.id.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes_object_Object_2.constructor.codec)}`;
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
  ConstructorsOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        uniques4[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_constructor_constructor.attributes[attributeName];
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
          const attribute = registryConfig_pgCodecs_constructor_constructor.attributes[attributeName];
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes_object_Object_3.id.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes_object_Object_3.name.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes_object_Object_3.export.codec)}`;
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
    nodes: ConstructorsConnection_nodesPlan,
    edges: ConstructorsConnection_edgesPlan,
    pageInfo: ConstructorsConnection_pageInfoPlan,
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
        uniques5[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_crop_crop.attributes[attributeName];
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
          const attribute = registryConfig_pgCodecs_crop_crop.attributes[attributeName];
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes2.id.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes2.yield.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes2.amount.codec)}`;
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
    nodes: CropsConnection_nodesPlan,
    edges: CropsConnection_edgesPlan,
    pageInfo: CropsConnection_pageInfoPlan,
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
        uniques7[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_material_material.attributes[attributeName];
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
          const attribute = registryConfig_pgCodecs_material_material.attributes[attributeName];
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes4.id.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes4.class.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes4.valueOf.codec)}`;
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
    nodes: MaterialsConnection_nodesPlan,
    edges: MaterialsConnection_edgesPlan,
    pageInfo: MaterialsConnection_pageInfoPlan,
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
        uniques8[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_null_null.attributes[attributeName];
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
          const attribute = registryConfig_pgCodecs_null_null.attributes[attributeName];
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes5.id.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes5.hasOwnProperty.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes5.break.codec)}`;
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
    nodes: NullsConnection_nodesPlan,
    edges: NullsConnection_edgesPlan,
    pageInfo: NullsConnection_pageInfoPlan,
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
        uniques9[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_project_project.attributes[attributeName];
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
          const attribute = registryConfig_pgCodecs_project_project.attributes[attributeName];
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes6.id.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes6.brand.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes6["__proto__"].codec)}`;
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
    nodes: ProjectsConnection_nodesPlan,
    edges: ProjectsConnection_edgesPlan,
    pageInfo: ProjectsConnection_pageInfoPlan,
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
        uniques10[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_relationalStatus_relationalStatus.attributes[attributeName];
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
        uniques10[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_relationalStatus_relationalStatus.attributes[attributeName];
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes7.id.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes7.description.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes7.note.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes7.type.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes7.constructor.codec)}`;
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
    nodes: RelationalStatusesConnection_nodesPlan,
    edges: RelationalStatusesConnection_edgesPlan,
    pageInfo: RelationalStatusesConnection_pageInfoPlan,
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
        uniques11[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_yield_yield.attributes[attributeName];
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
        uniques11[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_yield_yield.attributes[attributeName];
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes8.id.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes8.crop.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes8.export.codec)}`;
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
    nodes: YieldsConnection_nodesPlan,
    edges: YieldsConnection_edgesPlan,
    pageInfo: YieldsConnection_pageInfoPlan,
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
        uniques12[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_reserved_reserved.attributes[attributeName];
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
        uniques12[0].attributes.forEach(attributeName => {
          const attribute = registryConfig_pgCodecs_reserved_reserved.attributes[attributeName];
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes9.id.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes9.null.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes9.case.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), attributes9.do.codec)}`;
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
    nodes: ReservedsConnection_nodesPlan,
    edges: ReservedsConnection_edgesPlan,
    pageInfo: ReservedsConnection_pageInfoPlan,
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
          applyPlan: Mutation_createProto___input_applyPlan
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
          applyPlan: Mutation_createBuilding_input_applyPlan
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
          applyPlan: Mutation_createConstructor_input_applyPlan
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
          applyPlan: Mutation_createCrop_input_applyPlan
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
          applyPlan: Mutation_createMachine_input_applyPlan
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
          applyPlan: Mutation_createMaterial_input_applyPlan
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
          applyPlan: Mutation_createNull_input_applyPlan
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
          applyPlan: Mutation_createProject_input_applyPlan
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
          applyPlan: Mutation_createYield_input_applyPlan
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
          applyPlan: Mutation_createReserved_input_applyPlan
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
          applyPlan: Mutation_updateProto___input_applyPlan
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
          applyPlan: Mutation_updateProtoById_input_applyPlan
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
          applyPlan: Mutation_updateProtoByName_input_applyPlan
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
          applyPlan: Mutation_updateBuilding_input_applyPlan
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
          applyPlan: Mutation_updateBuildingById_input_applyPlan
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
          applyPlan: Mutation_updateBuildingByConstructor_input_applyPlan
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
          applyPlan: Mutation_updateConstructor_input_applyPlan
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
          applyPlan: Mutation_updateConstructorById_input_applyPlan
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
          applyPlan: Mutation_updateConstructorByExport_input_applyPlan
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
          applyPlan: Mutation_updateConstructorByName_input_applyPlan
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
          applyPlan: Mutation_updateCrop_input_applyPlan
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
          applyPlan: Mutation_updateCropById_input_applyPlan
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
          applyPlan: Mutation_updateCropByYield_input_applyPlan
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
          applyPlan: Mutation_updateMachine_input_applyPlan
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
          applyPlan: Mutation_updateMachineById_input_applyPlan
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
          applyPlan: Mutation_updateMaterial_input_applyPlan
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
          applyPlan: Mutation_updateMaterialById_input_applyPlan
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
          applyPlan: Mutation_updateMaterialByClass_input_applyPlan
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
          applyPlan: Mutation_updateMaterialByValueOf_input_applyPlan
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
          applyPlan: Mutation_updateNull_input_applyPlan
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
          applyPlan: Mutation_updateNullById_input_applyPlan
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
          applyPlan: Mutation_updateNullByBreak_input_applyPlan
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
          applyPlan: Mutation_updateNullByHasOwnProperty_input_applyPlan
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
          applyPlan: Mutation_updateProject_input_applyPlan
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
          applyPlan: Mutation_updateProjectById_input_applyPlan
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
          applyPlan: Mutation_updateProjectByProto___input_applyPlan
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
          applyPlan: Mutation_updateYield_input_applyPlan
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
          applyPlan: Mutation_updateYieldById_input_applyPlan
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
          applyPlan: Mutation_updateYieldByExport_input_applyPlan
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
          applyPlan: Mutation_updateReserved_input_applyPlan
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
          applyPlan: Mutation_updateReservedById_input_applyPlan
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
          applyPlan: Mutation_updateReservedByCase_input_applyPlan
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
          applyPlan: Mutation_updateReservedByDo_input_applyPlan
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
          applyPlan: Mutation_updateReservedByNull_input_applyPlan
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
          applyPlan: Mutation_deleteProto___input_applyPlan
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
          applyPlan: Mutation_deleteProtoById_input_applyPlan
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
          applyPlan: Mutation_deleteProtoByName_input_applyPlan
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
          applyPlan: Mutation_deleteBuilding_input_applyPlan
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
          applyPlan: Mutation_deleteBuildingById_input_applyPlan
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
          applyPlan: Mutation_deleteBuildingByConstructor_input_applyPlan
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
          applyPlan: Mutation_deleteConstructor_input_applyPlan
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
          applyPlan: Mutation_deleteConstructorById_input_applyPlan
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
          applyPlan: Mutation_deleteConstructorByExport_input_applyPlan
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
          applyPlan: Mutation_deleteConstructorByName_input_applyPlan
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
          applyPlan: Mutation_deleteCrop_input_applyPlan
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
          applyPlan: Mutation_deleteCropById_input_applyPlan
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
          applyPlan: Mutation_deleteCropByYield_input_applyPlan
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
          applyPlan: Mutation_deleteMachine_input_applyPlan
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
          applyPlan: Mutation_deleteMachineById_input_applyPlan
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
          applyPlan: Mutation_deleteMaterial_input_applyPlan
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
          applyPlan: Mutation_deleteMaterialById_input_applyPlan
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
          applyPlan: Mutation_deleteMaterialByClass_input_applyPlan
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
          applyPlan: Mutation_deleteMaterialByValueOf_input_applyPlan
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
          applyPlan: Mutation_deleteNull_input_applyPlan
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
          applyPlan: Mutation_deleteNullById_input_applyPlan
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
          applyPlan: Mutation_deleteNullByBreak_input_applyPlan
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
          applyPlan: Mutation_deleteNullByHasOwnProperty_input_applyPlan
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
          applyPlan: Mutation_deleteProject_input_applyPlan
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
          applyPlan: Mutation_deleteProjectById_input_applyPlan
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
          applyPlan: Mutation_deleteProjectByProto___input_applyPlan
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
          applyPlan: Mutation_deleteYield_input_applyPlan
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
          applyPlan: Mutation_deleteYieldById_input_applyPlan
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
          applyPlan: Mutation_deleteYieldByExport_input_applyPlan
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
          applyPlan: Mutation_deleteReserved_input_applyPlan
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
          applyPlan: Mutation_deleteReservedById_input_applyPlan
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
          applyPlan: Mutation_deleteReservedByCase_input_applyPlan
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
          applyPlan: Mutation_deleteReservedByDo_input_applyPlan
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
          applyPlan: Mutation_deleteReservedByNull_input_applyPlan
        }
      }
    }
  },
  CreateProtoPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId: CreateProtoPayload_clientMutationIdPlan,
    _proto__: CreateProtoPayload__proto__Plan,
    query: CreateProtoPayload_queryPlan,
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
            const spec = uniques2[0].attributes.reduce((memo, attributeName) => {
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
      applyPlan: CreateProtoInput_clientMutationId_applyPlan,
      autoApplyAfterParentApplyPlan: true
    },
    _proto__: {
      applyPlan: CreateProtoInput__proto___applyPlan,
      autoApplyAfterParentApplyPlan: true
    }
  },
  _Proto__Input: {
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
            const spec = uniques3[0].attributes.reduce((memo, attributeName) => {
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
    clientMutationId: CreateConstructorPayload_clientMutationIdPlan,
    constructor: CreateConstructorPayload_constructorPlan,
    query: CreateConstructorPayload_queryPlan,
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
            const spec = uniques4[0].attributes.reduce((memo, attributeName) => {
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
      applyPlan: CreateConstructorInput_clientMutationId_applyPlan,
      autoApplyAfterParentApplyPlan: true
    },
    constructor: {
      applyPlan: CreateConstructorInput_constructor_applyPlan,
      autoApplyAfterParentApplyPlan: true
    }
  },
  ConstructorInput: {
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
    clientMutationId: CreateCropPayload_clientMutationIdPlan,
    crop: CreateCropPayload_cropPlan,
    query: CreateCropPayload_queryPlan,
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
            const spec = uniques5[0].attributes.reduce((memo, attributeName) => {
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
      applyPlan: CreateCropInput_clientMutationId_applyPlan,
      autoApplyAfterParentApplyPlan: true
    },
    crop: {
      applyPlan: CreateCropInput_crop_applyPlan,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CropInput: {
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
    clientMutationId: CreateMachinePayload_clientMutationIdPlan,
    machine: CreateMachinePayload_machinePlan,
    query: CreateMachinePayload_queryPlan,
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
            const spec = uniques6[0].attributes.reduce((memo, attributeName) => {
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
      applyPlan: CreateMachineInput_clientMutationId_applyPlan,
      autoApplyAfterParentApplyPlan: true
    },
    machine: {
      applyPlan: CreateMachineInput_machine_applyPlan,
      autoApplyAfterParentApplyPlan: true
    }
  },
  MachineInput: {
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
    clientMutationId: CreateMaterialPayload_clientMutationIdPlan,
    material: CreateMaterialPayload_materialPlan,
    query: CreateMaterialPayload_queryPlan,
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
            const spec = uniques7[0].attributes.reduce((memo, attributeName) => {
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
      applyPlan: CreateMaterialInput_clientMutationId_applyPlan,
      autoApplyAfterParentApplyPlan: true
    },
    material: {
      applyPlan: CreateMaterialInput_material_applyPlan,
      autoApplyAfterParentApplyPlan: true
    }
  },
  MaterialInput: {
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
    clientMutationId: CreateNullPayload_clientMutationIdPlan,
    null: CreateNullPayload_nullPlan,
    query: CreateNullPayload_queryPlan,
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
            const spec = uniques8[0].attributes.reduce((memo, attributeName) => {
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
      applyPlan: CreateNullInput_clientMutationId_applyPlan,
      autoApplyAfterParentApplyPlan: true
    },
    null: {
      applyPlan: CreateNullInput_null_applyPlan,
      autoApplyAfterParentApplyPlan: true
    }
  },
  NullInput: {
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
    clientMutationId: CreateProjectPayload_clientMutationIdPlan,
    project: CreateProjectPayload_projectPlan,
    query: CreateProjectPayload_queryPlan,
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
            const spec = uniques9[0].attributes.reduce((memo, attributeName) => {
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
      applyPlan: CreateProjectInput_clientMutationId_applyPlan,
      autoApplyAfterParentApplyPlan: true
    },
    project: {
      applyPlan: CreateProjectInput_project_applyPlan,
      autoApplyAfterParentApplyPlan: true
    }
  },
  ProjectInput: {
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
    clientMutationId: CreateYieldPayload_clientMutationIdPlan,
    yield: CreateYieldPayload_yieldPlan,
    query: CreateYieldPayload_queryPlan,
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
            const spec = uniques11[0].attributes.reduce((memo, attributeName) => {
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
      applyPlan: CreateYieldInput_clientMutationId_applyPlan,
      autoApplyAfterParentApplyPlan: true
    },
    yield: {
      applyPlan: CreateYieldInput_yield_applyPlan,
      autoApplyAfterParentApplyPlan: true
    }
  },
  YieldInput: {
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
    clientMutationId: CreateReservedPayload_clientMutationIdPlan,
    reserved: CreateReservedPayload_reservedPlan,
    query: CreateReservedPayload_queryPlan,
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
            const spec = uniques12[0].attributes.reduce((memo, attributeName) => {
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
      applyPlan: CreateReservedInput_clientMutationId_applyPlan,
      autoApplyAfterParentApplyPlan: true
    },
    reserved: {
      applyPlan: CreateReservedInput_reserved_applyPlan,
      autoApplyAfterParentApplyPlan: true
    }
  },
  ReservedInput: {
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
    clientMutationId: UpdateProtoPayload_clientMutationIdPlan,
    _proto__: UpdateProtoPayload__proto__Plan,
    query: UpdateProtoPayload_queryPlan,
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
            const spec = uniques2[0].attributes.reduce((memo, attributeName) => {
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
      applyPlan: UpdateProtoInput_clientMutationId_applyPlan
    },
    nodeId: undefined,
    _protoPatch: {
      applyPlan: UpdateProtoInput__protoPatch_applyPlan
    }
  },
  _ProtoPatch: {
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
      applyPlan: UpdateProtoByIdInput_clientMutationId_applyPlan
    },
    id: undefined,
    _protoPatch: {
      applyPlan: UpdateProtoByIdInput__protoPatch_applyPlan
    }
  },
  UpdateProtoByNameInput: {
    clientMutationId: {
      applyPlan: UpdateProtoByNameInput_clientMutationId_applyPlan
    },
    name: undefined,
    _protoPatch: {
      applyPlan: UpdateProtoByNameInput__protoPatch_applyPlan
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
            const spec = uniques3[0].attributes.reduce((memo, attributeName) => {
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
      applyPlan: UpdateBuildingByIdInput_clientMutationId_applyPlan
    },
    id: undefined,
    buildingPatch: {
      applyPlan: UpdateBuildingByIdInput_buildingPatch_applyPlan
    }
  },
  UpdateBuildingByConstructorInput: {
    clientMutationId: {
      applyPlan: UpdateBuildingByConstructorInput_clientMutationId_applyPlan
    },
    constructor: undefined,
    buildingPatch: {
      applyPlan: UpdateBuildingByConstructorInput_buildingPatch_applyPlan
    }
  },
  UpdateConstructorPayload: {
    __assertStep: ObjectStep,
    clientMutationId: UpdateConstructorPayload_clientMutationIdPlan,
    constructor: UpdateConstructorPayload_constructorPlan,
    query: UpdateConstructorPayload_queryPlan,
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
            const spec = uniques4[0].attributes.reduce((memo, attributeName) => {
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
      applyPlan: UpdateConstructorInput_clientMutationId_applyPlan
    },
    nodeId: undefined,
    constructorPatch: {
      applyPlan: UpdateConstructorInput_constructorPatch_applyPlan
    }
  },
  ConstructorPatch: {
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
      applyPlan: UpdateConstructorByIdInput_clientMutationId_applyPlan
    },
    id: undefined,
    constructorPatch: {
      applyPlan: UpdateConstructorByIdInput_constructorPatch_applyPlan
    }
  },
  UpdateConstructorByExportInput: {
    clientMutationId: {
      applyPlan: UpdateConstructorByExportInput_clientMutationId_applyPlan
    },
    export: undefined,
    constructorPatch: {
      applyPlan: UpdateConstructorByExportInput_constructorPatch_applyPlan
    }
  },
  UpdateConstructorByNameInput: {
    clientMutationId: {
      applyPlan: UpdateConstructorByNameInput_clientMutationId_applyPlan
    },
    name: undefined,
    constructorPatch: {
      applyPlan: UpdateConstructorByNameInput_constructorPatch_applyPlan
    }
  },
  UpdateCropPayload: {
    __assertStep: ObjectStep,
    clientMutationId: UpdateCropPayload_clientMutationIdPlan,
    crop: UpdateCropPayload_cropPlan,
    query: UpdateCropPayload_queryPlan,
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
            const spec = uniques5[0].attributes.reduce((memo, attributeName) => {
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
      applyPlan: UpdateCropInput_clientMutationId_applyPlan
    },
    nodeId: undefined,
    cropPatch: {
      applyPlan: UpdateCropInput_cropPatch_applyPlan
    }
  },
  CropPatch: {
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
      applyPlan: UpdateCropByIdInput_clientMutationId_applyPlan
    },
    id: undefined,
    cropPatch: {
      applyPlan: UpdateCropByIdInput_cropPatch_applyPlan
    }
  },
  UpdateCropByYieldInput: {
    clientMutationId: {
      applyPlan: UpdateCropByYieldInput_clientMutationId_applyPlan
    },
    yield: undefined,
    cropPatch: {
      applyPlan: UpdateCropByYieldInput_cropPatch_applyPlan
    }
  },
  UpdateMachinePayload: {
    __assertStep: ObjectStep,
    clientMutationId: UpdateMachinePayload_clientMutationIdPlan,
    machine: UpdateMachinePayload_machinePlan,
    query: UpdateMachinePayload_queryPlan,
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
            const spec = uniques6[0].attributes.reduce((memo, attributeName) => {
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
      applyPlan: UpdateMachineInput_clientMutationId_applyPlan
    },
    nodeId: undefined,
    machinePatch: {
      applyPlan: UpdateMachineInput_machinePatch_applyPlan
    }
  },
  MachinePatch: {
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
      applyPlan: UpdateMachineByIdInput_clientMutationId_applyPlan
    },
    id: undefined,
    machinePatch: {
      applyPlan: UpdateMachineByIdInput_machinePatch_applyPlan
    }
  },
  UpdateMaterialPayload: {
    __assertStep: ObjectStep,
    clientMutationId: UpdateMaterialPayload_clientMutationIdPlan,
    material: UpdateMaterialPayload_materialPlan,
    query: UpdateMaterialPayload_queryPlan,
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
            const spec = uniques7[0].attributes.reduce((memo, attributeName) => {
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
      applyPlan: UpdateMaterialInput_clientMutationId_applyPlan
    },
    nodeId: undefined,
    materialPatch: {
      applyPlan: UpdateMaterialInput_materialPatch_applyPlan
    }
  },
  MaterialPatch: {
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
      applyPlan: UpdateMaterialByIdInput_clientMutationId_applyPlan
    },
    id: undefined,
    materialPatch: {
      applyPlan: UpdateMaterialByIdInput_materialPatch_applyPlan
    }
  },
  UpdateMaterialByClassInput: {
    clientMutationId: {
      applyPlan: UpdateMaterialByClassInput_clientMutationId_applyPlan
    },
    class: undefined,
    materialPatch: {
      applyPlan: UpdateMaterialByClassInput_materialPatch_applyPlan
    }
  },
  UpdateMaterialByValueOfInput: {
    clientMutationId: {
      applyPlan: UpdateMaterialByValueOfInput_clientMutationId_applyPlan
    },
    valueOf: undefined,
    materialPatch: {
      applyPlan: UpdateMaterialByValueOfInput_materialPatch_applyPlan
    }
  },
  UpdateNullPayload: {
    __assertStep: ObjectStep,
    clientMutationId: UpdateNullPayload_clientMutationIdPlan,
    null: UpdateNullPayload_nullPlan,
    query: UpdateNullPayload_queryPlan,
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
            const spec = uniques8[0].attributes.reduce((memo, attributeName) => {
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
      applyPlan: UpdateNullInput_clientMutationId_applyPlan
    },
    nodeId: undefined,
    nullPatch: {
      applyPlan: UpdateNullInput_nullPatch_applyPlan
    }
  },
  NullPatch: {
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
      applyPlan: UpdateNullByIdInput_clientMutationId_applyPlan
    },
    id: undefined,
    nullPatch: {
      applyPlan: UpdateNullByIdInput_nullPatch_applyPlan
    }
  },
  UpdateNullByBreakInput: {
    clientMutationId: {
      applyPlan: UpdateNullByBreakInput_clientMutationId_applyPlan
    },
    break: undefined,
    nullPatch: {
      applyPlan: UpdateNullByBreakInput_nullPatch_applyPlan
    }
  },
  UpdateNullByHasOwnPropertyInput: {
    clientMutationId: {
      applyPlan: UpdateNullByHasOwnPropertyInput_clientMutationId_applyPlan
    },
    hasOwnProperty: undefined,
    nullPatch: {
      applyPlan: UpdateNullByHasOwnPropertyInput_nullPatch_applyPlan
    }
  },
  UpdateProjectPayload: {
    __assertStep: ObjectStep,
    clientMutationId: UpdateProjectPayload_clientMutationIdPlan,
    project: UpdateProjectPayload_projectPlan,
    query: UpdateProjectPayload_queryPlan,
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
            const spec = uniques9[0].attributes.reduce((memo, attributeName) => {
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
      applyPlan: UpdateProjectInput_clientMutationId_applyPlan
    },
    nodeId: undefined,
    projectPatch: {
      applyPlan: UpdateProjectInput_projectPatch_applyPlan
    }
  },
  ProjectPatch: {
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
      applyPlan: UpdateProjectByIdInput_clientMutationId_applyPlan
    },
    id: undefined,
    projectPatch: {
      applyPlan: UpdateProjectByIdInput_projectPatch_applyPlan
    }
  },
  UpdateProjectByProtoInput: {
    clientMutationId: {
      applyPlan: UpdateProjectByProtoInput_clientMutationId_applyPlan
    },
    _proto__: undefined,
    projectPatch: {
      applyPlan: UpdateProjectByProtoInput_projectPatch_applyPlan
    }
  },
  UpdateYieldPayload: {
    __assertStep: ObjectStep,
    clientMutationId: UpdateYieldPayload_clientMutationIdPlan,
    yield: UpdateYieldPayload_yieldPlan,
    query: UpdateYieldPayload_queryPlan,
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
            const spec = uniques11[0].attributes.reduce((memo, attributeName) => {
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
      applyPlan: UpdateYieldInput_clientMutationId_applyPlan
    },
    nodeId: undefined,
    yieldPatch: {
      applyPlan: UpdateYieldInput_yieldPatch_applyPlan
    }
  },
  YieldPatch: {
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
      applyPlan: UpdateYieldByIdInput_clientMutationId_applyPlan
    },
    id: undefined,
    yieldPatch: {
      applyPlan: UpdateYieldByIdInput_yieldPatch_applyPlan
    }
  },
  UpdateYieldByExportInput: {
    clientMutationId: {
      applyPlan: UpdateYieldByExportInput_clientMutationId_applyPlan
    },
    export: undefined,
    yieldPatch: {
      applyPlan: UpdateYieldByExportInput_yieldPatch_applyPlan
    }
  },
  UpdateReservedPayload: {
    __assertStep: ObjectStep,
    clientMutationId: UpdateReservedPayload_clientMutationIdPlan,
    reserved: UpdateReservedPayload_reservedPlan,
    query: UpdateReservedPayload_queryPlan,
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
            const spec = uniques12[0].attributes.reduce((memo, attributeName) => {
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
      applyPlan: UpdateReservedInput_clientMutationId_applyPlan
    },
    nodeId: undefined,
    reservedPatch: {
      applyPlan: UpdateReservedInput_reservedPatch_applyPlan
    }
  },
  ReservedPatch: {
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
      applyPlan: UpdateReservedByIdInput_clientMutationId_applyPlan
    },
    id: undefined,
    reservedPatch: {
      applyPlan: UpdateReservedByIdInput_reservedPatch_applyPlan
    }
  },
  UpdateReservedByCaseInput: {
    clientMutationId: {
      applyPlan: UpdateReservedByCaseInput_clientMutationId_applyPlan
    },
    case: undefined,
    reservedPatch: {
      applyPlan: UpdateReservedByCaseInput_reservedPatch_applyPlan
    }
  },
  UpdateReservedByDoInput: {
    clientMutationId: {
      applyPlan: UpdateReservedByDoInput_clientMutationId_applyPlan
    },
    do: undefined,
    reservedPatch: {
      applyPlan: UpdateReservedByDoInput_reservedPatch_applyPlan
    }
  },
  UpdateReservedByNullInput: {
    clientMutationId: {
      applyPlan: UpdateReservedByNullInput_clientMutationId_applyPlan
    },
    null: undefined,
    reservedPatch: {
      applyPlan: UpdateReservedByNullInput_reservedPatch_applyPlan
    }
  },
  DeleteProtoPayload: {
    __assertStep: ObjectStep,
    clientMutationId: DeleteProtoPayload_clientMutationIdPlan,
    _proto__: DeleteProtoPayload__proto__Plan,
    deletedProtoId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName._Proto__.plan($record);
      return lambda(specifier, handler2.codec.encode);
    },
    query: DeleteProtoPayload_queryPlan,
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
            const spec = uniques2[0].attributes.reduce((memo, attributeName) => {
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
      applyPlan: DeleteProtoInput_clientMutationId_applyPlan
    },
    nodeId: undefined
  },
  DeleteProtoByIdInput: {
    clientMutationId: {
      applyPlan: DeleteProtoByIdInput_clientMutationId_applyPlan
    },
    id: undefined
  },
  DeleteProtoByNameInput: {
    clientMutationId: {
      applyPlan: DeleteProtoByNameInput_clientMutationId_applyPlan
    },
    name: undefined
  },
  DeleteBuildingPayload: {
    __assertStep: ObjectStep,
    clientMutationId: DeleteBuildingPayload_clientMutationIdPlan,
    building: DeleteBuildingPayload_buildingPlan,
    deletedBuildingId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = handler2.plan($record);
      return lambda(specifier, handler2.codec.encode);
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
            const spec = uniques3[0].attributes.reduce((memo, attributeName) => {
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
      applyPlan: DeleteBuildingInput_clientMutationId_applyPlan
    },
    nodeId: undefined
  },
  DeleteBuildingByIdInput: {
    clientMutationId: {
      applyPlan: DeleteBuildingByIdInput_clientMutationId_applyPlan
    },
    id: undefined
  },
  DeleteBuildingByConstructorInput: {
    clientMutationId: {
      applyPlan: DeleteBuildingByConstructorInput_clientMutationId_applyPlan
    },
    constructor: undefined
  },
  DeleteConstructorPayload: {
    __assertStep: ObjectStep,
    clientMutationId: DeleteConstructorPayload_clientMutationIdPlan,
    constructor: DeleteConstructorPayload_constructorPlan,
    deletedConstructorId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.Constructor.plan($record);
      return lambda(specifier, handler2.codec.encode);
    },
    query: DeleteConstructorPayload_queryPlan,
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
            const spec = uniques4[0].attributes.reduce((memo, attributeName) => {
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
      applyPlan: DeleteConstructorInput_clientMutationId_applyPlan
    },
    nodeId: undefined
  },
  DeleteConstructorByIdInput: {
    clientMutationId: {
      applyPlan: DeleteConstructorByIdInput_clientMutationId_applyPlan
    },
    id: undefined
  },
  DeleteConstructorByExportInput: {
    clientMutationId: {
      applyPlan: DeleteConstructorByExportInput_clientMutationId_applyPlan
    },
    export: undefined
  },
  DeleteConstructorByNameInput: {
    clientMutationId: {
      applyPlan: DeleteConstructorByNameInput_clientMutationId_applyPlan
    },
    name: undefined
  },
  DeleteCropPayload: {
    __assertStep: ObjectStep,
    clientMutationId: DeleteCropPayload_clientMutationIdPlan,
    crop: DeleteCropPayload_cropPlan,
    deletedCropId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.Crop.plan($record);
      return lambda(specifier, handler2.codec.encode);
    },
    query: DeleteCropPayload_queryPlan,
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
            const spec = uniques5[0].attributes.reduce((memo, attributeName) => {
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
      applyPlan: DeleteCropInput_clientMutationId_applyPlan
    },
    nodeId: undefined
  },
  DeleteCropByIdInput: {
    clientMutationId: {
      applyPlan: DeleteCropByIdInput_clientMutationId_applyPlan
    },
    id: undefined
  },
  DeleteCropByYieldInput: {
    clientMutationId: {
      applyPlan: DeleteCropByYieldInput_clientMutationId_applyPlan
    },
    yield: undefined
  },
  DeleteMachinePayload: {
    __assertStep: ObjectStep,
    clientMutationId: DeleteMachinePayload_clientMutationIdPlan,
    machine: DeleteMachinePayload_machinePlan,
    deletedMachineId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = handler3.plan($record);
      return lambda(specifier, handler2.codec.encode);
    },
    query: DeleteMachinePayload_queryPlan,
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
            const spec = uniques6[0].attributes.reduce((memo, attributeName) => {
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
      applyPlan: DeleteMachineInput_clientMutationId_applyPlan
    },
    nodeId: undefined
  },
  DeleteMachineByIdInput: {
    clientMutationId: {
      applyPlan: DeleteMachineByIdInput_clientMutationId_applyPlan
    },
    id: undefined
  },
  DeleteMaterialPayload: {
    __assertStep: ObjectStep,
    clientMutationId: DeleteMaterialPayload_clientMutationIdPlan,
    material: DeleteMaterialPayload_materialPlan,
    deletedMaterialId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.Material.plan($record);
      return lambda(specifier, handler2.codec.encode);
    },
    query: DeleteMaterialPayload_queryPlan,
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
            const spec = uniques7[0].attributes.reduce((memo, attributeName) => {
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
      applyPlan: DeleteMaterialInput_clientMutationId_applyPlan
    },
    nodeId: undefined
  },
  DeleteMaterialByIdInput: {
    clientMutationId: {
      applyPlan: DeleteMaterialByIdInput_clientMutationId_applyPlan
    },
    id: undefined
  },
  DeleteMaterialByClassInput: {
    clientMutationId: {
      applyPlan: DeleteMaterialByClassInput_clientMutationId_applyPlan
    },
    class: undefined
  },
  DeleteMaterialByValueOfInput: {
    clientMutationId: {
      applyPlan: DeleteMaterialByValueOfInput_clientMutationId_applyPlan
    },
    valueOf: undefined
  },
  DeleteNullPayload: {
    __assertStep: ObjectStep,
    clientMutationId: DeleteNullPayload_clientMutationIdPlan,
    null: DeleteNullPayload_nullPlan,
    deletedNullId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.Null.plan($record);
      return lambda(specifier, handler2.codec.encode);
    },
    query: DeleteNullPayload_queryPlan,
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
            const spec = uniques8[0].attributes.reduce((memo, attributeName) => {
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
      applyPlan: DeleteNullInput_clientMutationId_applyPlan
    },
    nodeId: undefined
  },
  DeleteNullByIdInput: {
    clientMutationId: {
      applyPlan: DeleteNullByIdInput_clientMutationId_applyPlan
    },
    id: undefined
  },
  DeleteNullByBreakInput: {
    clientMutationId: {
      applyPlan: DeleteNullByBreakInput_clientMutationId_applyPlan
    },
    break: undefined
  },
  DeleteNullByHasOwnPropertyInput: {
    clientMutationId: {
      applyPlan: DeleteNullByHasOwnPropertyInput_clientMutationId_applyPlan
    },
    hasOwnProperty: undefined
  },
  DeleteProjectPayload: {
    __assertStep: ObjectStep,
    clientMutationId: DeleteProjectPayload_clientMutationIdPlan,
    project: DeleteProjectPayload_projectPlan,
    deletedProjectId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.Project.plan($record);
      return lambda(specifier, handler2.codec.encode);
    },
    query: DeleteProjectPayload_queryPlan,
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
            const spec = uniques9[0].attributes.reduce((memo, attributeName) => {
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
      applyPlan: DeleteProjectInput_clientMutationId_applyPlan
    },
    nodeId: undefined
  },
  DeleteProjectByIdInput: {
    clientMutationId: {
      applyPlan: DeleteProjectByIdInput_clientMutationId_applyPlan
    },
    id: undefined
  },
  DeleteProjectByProtoInput: {
    clientMutationId: {
      applyPlan: DeleteProjectByProtoInput_clientMutationId_applyPlan
    },
    _proto__: undefined
  },
  DeleteYieldPayload: {
    __assertStep: ObjectStep,
    clientMutationId: DeleteYieldPayload_clientMutationIdPlan,
    yield: DeleteYieldPayload_yieldPlan,
    deletedYieldId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.Yield.plan($record);
      return lambda(specifier, handler2.codec.encode);
    },
    query: DeleteYieldPayload_queryPlan,
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
            const spec = uniques11[0].attributes.reduce((memo, attributeName) => {
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
      applyPlan: DeleteYieldInput_clientMutationId_applyPlan
    },
    nodeId: undefined
  },
  DeleteYieldByIdInput: {
    clientMutationId: {
      applyPlan: DeleteYieldByIdInput_clientMutationId_applyPlan
    },
    id: undefined
  },
  DeleteYieldByExportInput: {
    clientMutationId: {
      applyPlan: DeleteYieldByExportInput_clientMutationId_applyPlan
    },
    export: undefined
  },
  DeleteReservedPayload: {
    __assertStep: ObjectStep,
    clientMutationId: DeleteReservedPayload_clientMutationIdPlan,
    reserved: DeleteReservedPayload_reservedPlan,
    deletedReservedId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.Reserved.plan($record);
      return lambda(specifier, handler2.codec.encode);
    },
    query: DeleteReservedPayload_queryPlan,
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
            const spec = uniques12[0].attributes.reduce((memo, attributeName) => {
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
      applyPlan: DeleteReservedInput_clientMutationId_applyPlan
    },
    nodeId: undefined
  },
  DeleteReservedByIdInput: {
    clientMutationId: {
      applyPlan: DeleteReservedByIdInput_clientMutationId_applyPlan
    },
    id: undefined
  },
  DeleteReservedByCaseInput: {
    clientMutationId: {
      applyPlan: DeleteReservedByCaseInput_clientMutationId_applyPlan
    },
    case: undefined
  },
  DeleteReservedByDoInput: {
    clientMutationId: {
      applyPlan: DeleteReservedByDoInput_clientMutationId_applyPlan
    },
    do: undefined
  },
  DeleteReservedByNullInput: {
    clientMutationId: {
      applyPlan: DeleteReservedByNullInput_clientMutationId_applyPlan
    },
    null: undefined
  }
};
export const schema = makeGrafastSchema({
  typeDefs: typeDefs,
  plans: plans
});
