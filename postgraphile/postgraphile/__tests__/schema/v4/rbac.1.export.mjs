import { LIST_TYPES, PgDeleteSingleStep, PgExecutor, PgResource, PgSelectStep, TYPES, assertPgClassSingleStep, domainOfCodec, enumCodec, listOfCodec, makeRegistry, pgDeleteSingle, pgInsertSingle, pgSelectFromRecord, pgSelectSingleFromRecord, pgUpdateSingle, recordCodec, sqlFromArgDigests, sqlValueWithCodec } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ObjectStep, __ValueStep, access, assertStep, bakedInput, bakedInputRuntime, connection, constant, context, createObjectAndApplyChildren, first, get as get2, inhibitOnNull, inspect, lambda, list, makeDecodeNodeId, makeGrafastSchema, markSyncAndSafe, object, operationPlan, specFromNodeId, trap } from "grafast";
import { GraphQLError, GraphQLString, Kind } from "graphql";
import { sql } from "pg-sql2";
const EMPTY_OBJECT = Object.freeze({});
const rawNodeIdCodec = {
  name: "raw",
  encode: markSyncAndSafe(function rawEncode(value) {
    return typeof value === "string" ? value : null;
  }),
  decode: markSyncAndSafe(function rawDecode(value) {
    return typeof value === "string" ? value : null;
  })
};
const EMPTY_OBJECT2 = Object.freeze({});
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
    return constant(EMPTY_OBJECT2);
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
const postIdentifier = sql.identifier("a", "post");
const anEnumCodec = enumCodec({
  name: "anEnum",
  identifier: sql.identifier("a", "an_enum"),
  values: ["awaiting", "rejected", "published", "*", "**", "***", "foo*", "foo*_", "_foo*", "*bar", "*bar_", "_*bar_", "*baz*", "_*baz*_", "%", ">=", "~~", "$"],
  description: undefined,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "an_enum"
    }
  }
});
const anEnumArrayCodec = listOfCodec(anEnumCodec, {
  name: "anEnumArray",
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "_an_enum"
    }
  }
});
const comptypeCodec = recordCodec({
  name: "comptype",
  identifier: sql.identifier("a", "comptype"),
  attributes: {
    __proto__: null,
    schedule: {
      codec: TYPES.timestamptz
    },
    is_optimised: {
      codec: TYPES.boolean
    }
  },
  extensions: {
    isTableLike: false,
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "comptype"
    }
  },
  executor: executor
});
const comptypeArrayCodec = listOfCodec(comptypeCodec, {
  name: "comptypeArray",
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "_comptype"
    }
  }
});
const postCodec = recordCodec({
  name: "post",
  identifier: postIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: false,
        canUpdate: false
      }
    },
    headline: {
      codec: TYPES.text,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: false,
        canUpdate: false
      }
    },
    body: {
      codec: TYPES.text,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: false,
        canUpdate: false
      }
    },
    author_id: {
      codec: TYPES.int,
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: false,
        canUpdate: false
      }
    },
    enums: {
      codec: anEnumArrayCodec,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    comptypes: {
      codec: comptypeArrayCodec,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "post"
    }
  },
  executor: executor
});
const leftArmIdentifier = sql.identifier("c", "left_arm");
const leftArmCodec = recordCodec({
  name: "leftArm",
  identifier: leftArmIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: false,
        canUpdate: false
      }
    },
    person_id: {
      codec: TYPES.int,
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: false,
        canUpdate: false
      }
    },
    length_in_metres: {
      codec: TYPES.float,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: false
      }
    },
    mood: {
      codec: TYPES.text,
      notNull: true,
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: false,
        canUpdate: true
      }
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "left_arm"
    }
  },
  executor: executor,
  description: "Tracks metadata about the left arms of various people"
});
const compoundKeyIdentifier = sql.identifier("c", "compound_key");
const compoundKeyCodec = recordCodec({
  name: "compoundKey",
  identifier: compoundKeyIdentifier,
  attributes: {
    __proto__: null,
    person_id_2: {
      codec: TYPES.int,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    person_id_1: {
      codec: TYPES.int,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    },
    extra: {
      codec: TYPES.boolean,
      extensions: {
        __proto__: null,
        canSelect: false,
        canInsert: false,
        canUpdate: false
      }
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "compound_key"
    }
  },
  executor: executor
});
const jwtTokenCodec = recordCodec({
  name: "jwtToken",
  identifier: sql.identifier("b", "jwt_token"),
  attributes: {
    __proto__: null,
    role: {
      codec: TYPES.text
    },
    exp: {
      codec: TYPES.bigint
    },
    a: {
      codec: TYPES.int
    },
    b: {
      codec: TYPES.numeric
    },
    c: {
      codec: TYPES.bigint
    }
  },
  extensions: {
    isTableLike: false,
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "jwt_token"
    }
  },
  executor: executor
});
const colorCodec = enumCodec({
  name: "color",
  identifier: sql.identifier("b", "color"),
  values: ["red", "green", "blue"],
  description: "Represents the colours red, green and blue.",
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "color"
    }
  }
});
const enumCapsCodec = enumCodec({
  name: "enumCaps",
  identifier: sql.identifier("b", "enum_caps"),
  values: ["FOO_BAR", "BAR_FOO", "BAZ_QUX", "0_BAR"],
  description: undefined,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "enum_caps"
    }
  }
});
const enumWithEmptyStringCodec = enumCodec({
  name: "enumWithEmptyString",
  identifier: sql.identifier("b", "enum_with_empty_string"),
  values: ["", "one", "two"],
  description: undefined,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "enum_with_empty_string"
    }
  }
});
const compoundTypeCodec = recordCodec({
  name: "compoundType",
  identifier: sql.identifier("c", "compound_type"),
  attributes: {
    __proto__: null,
    a: {
      codec: TYPES.int
    },
    b: {
      codec: TYPES.text
    },
    c: {
      codec: colorCodec
    },
    d: {
      codec: TYPES.uuid
    },
    e: {
      codec: enumCapsCodec
    },
    f: {
      codec: enumWithEmptyStringCodec
    },
    g: {
      codec: TYPES.interval
    },
    foo_bar: {
      codec: TYPES.int
    }
  },
  extensions: {
    isTableLike: false,
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "compound_type"
    }
  },
  executor: executor,
  description: "Awesome feature!"
});
const notNullUrlCodec = domainOfCodec(TYPES.varchar, "notNullUrl", sql.identifier("b", "not_null_url"), {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "not_null_url"
    }
  },
  notNull: true
});
const emailCodec = domainOfCodec(TYPES.text, "email", sql.identifier("b", "email"), {
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "email"
    }
  }
});
const wrappedUrlCodec = recordCodec({
  name: "wrappedUrl",
  identifier: sql.identifier("b", "wrapped_url"),
  attributes: {
    __proto__: null,
    url: {
      codec: notNullUrlCodec,
      notNull: true
    }
  },
  extensions: {
    isTableLike: false,
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "wrapped_url"
    }
  },
  executor: executor
});
const authPayloadCodec = recordCodec({
  name: "authPayload",
  identifier: sql.identifier("b", "auth_payload"),
  attributes: {
    __proto__: null,
    jwt: {
      codec: jwtTokenCodec
    },
    id: {
      codec: TYPES.int
    },
    admin: {
      codec: TYPES.boolean
    }
  },
  extensions: {
    isTableLike: false,
    pg: {
      serviceName: "main",
      schemaName: "b",
      name: "auth_payload"
    },
    tags: {
      __proto__: null,
      foreignKey: "(id) references c.person"
    }
  },
  executor: executor
});
const personIdentifier = sql.identifier("c", "person");
const personCodec = recordCodec({
  name: "person",
  identifier: personIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      description: "The primary unique identifier for the person",
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: false,
        canUpdate: false
      }
    },
    person_full_name: {
      codec: TYPES.varchar,
      notNull: true,
      description: "The person\u2019s name",
      extensions: {
        tags: {
          name: "name"
        },
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    aliases: {
      codec: LIST_TYPES.text,
      notNull: true,
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    about: {
      codec: TYPES.text,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    email: {
      codec: emailCodec,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    site: {
      codec: wrappedUrlCodec,
      extensions: {
        tags: {
          deprecated: "Don\u2019t use me"
        },
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    config: {
      codec: TYPES.hstore,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: false,
        canUpdate: false
      }
    },
    last_login_from_ip: {
      codec: TYPES.inet,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: false,
        canUpdate: false
      }
    },
    last_login_from_subnet: {
      codec: TYPES.cidr,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: false,
        canUpdate: false
      }
    },
    user_mac: {
      codec: TYPES.macaddr,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: false,
        canUpdate: false
      }
    },
    created_at: {
      codec: TYPES.timestamp,
      hasDefault: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: false,
        canUpdate: false
      }
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "person"
    }
  },
  executor: executor,
  description: "Person test comment"
});
const personSecretIdentifier = sql.identifier("c", "person_secret");
const personSecretCodec = recordCodec({
  name: "personSecret",
  identifier: personSecretIdentifier,
  attributes: {
    __proto__: null,
    person_id: {
      codec: TYPES.int,
      notNull: true,
      extensions: {
        __proto__: null,
        canSelect: true,
        canInsert: false,
        canUpdate: false
      }
    },
    sekrit: {
      codec: TYPES.text,
      description: "A secret held by the associated Person",
      extensions: {
        tags: {
          name: "secret"
        },
        canSelect: true,
        canInsert: true,
        canUpdate: false
      }
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "person_secret"
    },
    tags: {
      __proto__: null,
      deprecated: "This is deprecated (comment on table c.person_secret)."
    }
  },
  executor: executor,
  description: "Tracks the person's secret"
});
const postUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const post_resourceOptionsConfig = {
  executor: executor,
  name: "post",
  identifier: "main.a.post",
  from: postIdentifier,
  codec: postCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "a",
      name: "post"
    },
    canSelect: true,
    canInsert: false,
    canUpdate: false,
    canDelete: false
  },
  uniques: postUniques
};
const left_armUniques = [{
  attributes: ["id"],
  isPrimary: true
}, {
  attributes: ["person_id"]
}];
const left_arm_resourceOptionsConfig = {
  executor: executor,
  name: "left_arm",
  identifier: "main.c.left_arm",
  from: leftArmIdentifier,
  codec: leftArmCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "left_arm"
    },
    canSelect: true,
    canInsert: true,
    canUpdate: true,
    canDelete: true
  },
  uniques: left_armUniques,
  description: "Tracks metadata about the left arms of various people"
};
const personUniques = [{
  attributes: ["id"],
  isPrimary: true
}, {
  attributes: ["email"]
}];
const person_resourceOptionsConfig = {
  executor: executor,
  name: "person",
  identifier: "main.c.person",
  from: personIdentifier,
  codec: personCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "person"
    },
    canSelect: true,
    canInsert: true,
    canUpdate: true,
    canDelete: true
  },
  uniques: personUniques,
  description: "Person test comment"
};
const person_secretUniques = [{
  attributes: ["person_id"],
  isPrimary: true
}];
const person_secret_resourceOptionsConfig = {
  executor: executor,
  name: "person_secret",
  identifier: "main.c.person_secret",
  from: personSecretIdentifier,
  codec: personSecretCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "person_secret"
    },
    tags: {
      deprecated: "This is deprecated (comment on table c.person_secret)."
    },
    canSelect: true,
    canInsert: true,
    canUpdate: false,
    canDelete: true
  },
  uniques: person_secretUniques,
  description: "Tracks the person's secret"
};
const compound_keyUniques = [{
  attributes: ["person_id_1", "person_id_2"],
  isPrimary: true
}];
const compound_key_resourceOptionsConfig = {
  executor: executor,
  name: "compound_key",
  identifier: "main.c.compound_key",
  from: compoundKeyIdentifier,
  codec: compoundKeyCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "c",
      name: "compound_key"
    },
    canSelect: false,
    canInsert: false,
    canUpdate: false,
    canDelete: false
  },
  uniques: compound_keyUniques
};
const post_with_suffixFunctionIdentifer = sql.identifier("a", "post_with_suffix");
const current_user_idFunctionIdentifer = sql.identifier("c", "current_user_id");
const left_arm_identityFunctionIdentifer = sql.identifier("c", "left_arm_identity");
const read_pg_settingsFunctionIdentifer = sql.identifier("c", "read_pg_settings");
const return_table_without_grantsFunctionIdentifer = sql.identifier("c", "return_table_without_grants");
const registry = makeRegistry({
  pgExecutors: {
    __proto__: null,
    main: executor
  },
  pgCodecs: {
    __proto__: null,
    post: postCodec,
    int4: TYPES.int,
    text: TYPES.text,
    anEnumArray: anEnumArrayCodec,
    anEnum: anEnumCodec,
    comptypeArray: comptypeArrayCodec,
    comptype: comptypeCodec,
    timestamptz: TYPES.timestamptz,
    bool: TYPES.boolean,
    leftArm: leftArmCodec,
    float8: TYPES.float,
    json: TYPES.json,
    compoundKey: compoundKeyCodec,
    jwtToken: jwtTokenCodec,
    int8: TYPES.bigint,
    numeric: TYPES.numeric,
    compoundType: compoundTypeCodec,
    color: colorCodec,
    uuid: TYPES.uuid,
    enumCaps: enumCapsCodec,
    enumWithEmptyString: enumWithEmptyStringCodec,
    interval: TYPES.interval,
    notNullUrl: notNullUrlCodec,
    varchar: TYPES.varchar,
    textArray: LIST_TYPES.text,
    email: emailCodec,
    wrappedUrl: wrappedUrlCodec,
    hstore: TYPES.hstore,
    inet: TYPES.inet,
    cidr: TYPES.cidr,
    macaddr: TYPES.macaddr,
    timestamp: TYPES.timestamp,
    tablefuncCrosstab2: recordCodec({
      name: "tablefuncCrosstab2",
      identifier: sql.identifier("a", "tablefunc_crosstab_2"),
      attributes: {
        __proto__: null,
        row_name: {
          codec: TYPES.text
        },
        category_1: {
          codec: TYPES.text
        },
        category_2: {
          codec: TYPES.text
        }
      },
      extensions: {
        isTableLike: false,
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "tablefunc_crosstab_2"
        }
      },
      executor: executor
    }),
    tablefuncCrosstab3: recordCodec({
      name: "tablefuncCrosstab3",
      identifier: sql.identifier("a", "tablefunc_crosstab_3"),
      attributes: {
        __proto__: null,
        row_name: {
          codec: TYPES.text
        },
        category_1: {
          codec: TYPES.text
        },
        category_2: {
          codec: TYPES.text
        },
        category_3: {
          codec: TYPES.text
        }
      },
      extensions: {
        isTableLike: false,
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "tablefunc_crosstab_3"
        }
      },
      executor: executor
    }),
    tablefuncCrosstab4: recordCodec({
      name: "tablefuncCrosstab4",
      identifier: sql.identifier("a", "tablefunc_crosstab_4"),
      attributes: {
        __proto__: null,
        row_name: {
          codec: TYPES.text
        },
        category_1: {
          codec: TYPES.text
        },
        category_2: {
          codec: TYPES.text
        },
        category_3: {
          codec: TYPES.text
        },
        category_4: {
          codec: TYPES.text
        }
      },
      extensions: {
        isTableLike: false,
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "tablefunc_crosstab_4"
        }
      },
      executor: executor
    }),
    authPayload: authPayloadCodec,
    nestedCompoundType: recordCodec({
      name: "nestedCompoundType",
      identifier: sql.identifier("b", "nested_compound_type"),
      attributes: {
        __proto__: null,
        a: {
          codec: compoundTypeCodec
        },
        b: {
          codec: compoundTypeCodec
        },
        baz_buz: {
          codec: TYPES.int
        }
      },
      extensions: {
        isTableLike: false,
        pg: {
          serviceName: "main",
          schemaName: "b",
          name: "nested_compound_type"
        }
      },
      executor: executor
    }),
    person: personCodec,
    personSecret: personSecretCodec
  },
  pgResources: {
    __proto__: null,
    post: post_resourceOptionsConfig,
    left_arm: left_arm_resourceOptionsConfig,
    person: person_resourceOptionsConfig,
    person_secret: person_secret_resourceOptionsConfig,
    compound_key: compound_key_resourceOptionsConfig,
    post_with_suffix: PgResource.functionResourceOptions(post_resourceOptionsConfig, {
      name: "post_with_suffix",
      identifier: "main.a.post_with_suffix(a.post,text)",
      from(...args) {
        return sql`${post_with_suffixFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "post",
        codec: postCodec
      }, {
        name: "suffix",
        codec: TYPES.text
      }],
      returnsSetof: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "a",
          name: "post_with_suffix"
        },
        tags: {
          deprecated: "This is deprecated (comment on function a.post_with_suffix)."
        },
        canExecute: true
      },
      isMutation: true
    }),
    current_user_id: {
      executor: executor,
      name: "current_user_id",
      identifier: "main.c.current_user_id()",
      from(...args) {
        return sql`${current_user_idFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      codec: TYPES.int,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "current_user_id"
        },
        canExecute: true
      },
      isUnique: true
    },
    left_arm_identity: PgResource.functionResourceOptions(left_arm_resourceOptionsConfig, {
      name: "left_arm_identity",
      identifier: "main.c.left_arm_identity(c.left_arm)",
      from(...args) {
        return sql`${left_arm_identityFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "left_arm",
        codec: leftArmCodec,
        extensions: {
          variant: "base"
        }
      }],
      returnsSetof: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "left_arm_identity"
        },
        tags: {
          arg0variant: "base",
          resultFieldName: "leftArm"
        },
        canExecute: true
      },
      isMutation: true
    }),
    read_pg_settings: {
      executor: executor,
      name: "read_pg_settings",
      identifier: "main.c.read_pg_settings()",
      from(...args) {
        return sql`${read_pg_settingsFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      codec: TYPES.json,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "read_pg_settings"
        },
        canExecute: true
      },
      isUnique: true
    },
    return_table_without_grants: PgResource.functionResourceOptions(compound_key_resourceOptionsConfig, {
      name: "return_table_without_grants",
      identifier: "main.c.return_table_without_grants()",
      from(...args) {
        return sql`${return_table_without_grantsFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsSetof: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "c",
          name: "return_table_without_grants"
        },
        canExecute: true
      }
    })
  },
  pgRelations: {
    __proto__: null,
    post: {
      __proto__: null,
      personByMyAuthorId: {
        localCodec: postCodec,
        remoteResourceOptions: person_resourceOptionsConfig,
        localAttributes: ["author_id"],
        remoteAttributes: ["id"],
        isUnique: true
      }
    },
    authPayload: {
      __proto__: null,
      personByMyId: {
        localCodec: authPayloadCodec,
        remoteResourceOptions: person_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["id"],
        isUnique: true
      }
    },
    leftArm: {
      __proto__: null,
      personByMyPersonId: {
        localCodec: leftArmCodec,
        remoteResourceOptions: person_resourceOptionsConfig,
        localAttributes: ["person_id"],
        remoteAttributes: ["id"],
        isUnique: true
      }
    },
    person: {
      __proto__: null,
      postsByTheirAuthorId: {
        localCodec: personCodec,
        remoteResourceOptions: post_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["author_id"],
        isReferencee: true
      },
      personSecretByTheirPersonId: {
        localCodec: personCodec,
        remoteResourceOptions: person_secret_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["person_id"],
        isUnique: true,
        isReferencee: true,
        description: "This `Person`'s `PersonSecret`.",
        extensions: {
          tags: {
            forwardDescription: "The `Person` this `PersonSecret` belongs to.",
            backwardDescription: "This `Person`'s `PersonSecret`."
          }
        }
      },
      leftArmByTheirPersonId: {
        localCodec: personCodec,
        remoteResourceOptions: left_arm_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["person_id"],
        isUnique: true,
        isReferencee: true
      },
      compoundKeysByTheirPersonId1: {
        localCodec: personCodec,
        remoteResourceOptions: compound_key_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["person_id_1"],
        isReferencee: true
      },
      compoundKeysByTheirPersonId2: {
        localCodec: personCodec,
        remoteResourceOptions: compound_key_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["person_id_2"],
        isReferencee: true
      }
    },
    personSecret: {
      __proto__: null,
      personByMyPersonId: {
        localCodec: personSecretCodec,
        remoteResourceOptions: person_resourceOptionsConfig,
        localAttributes: ["person_id"],
        remoteAttributes: ["id"],
        isUnique: true,
        description: "The `Person` this `PersonSecret` belongs to.",
        extensions: {
          tags: {
            forwardDescription: "The `Person` this `PersonSecret` belongs to.",
            backwardDescription: "This `Person`'s `PersonSecret`."
          }
        }
      }
    },
    compoundKey: {
      __proto__: null,
      personByMyPersonId1: {
        localCodec: compoundKeyCodec,
        remoteResourceOptions: person_resourceOptionsConfig,
        localAttributes: ["person_id_1"],
        remoteAttributes: ["id"],
        isUnique: true
      },
      personByMyPersonId2: {
        localCodec: compoundKeyCodec,
        remoteResourceOptions: person_resourceOptionsConfig,
        localAttributes: ["person_id_2"],
        remoteAttributes: ["id"],
        isUnique: true
      }
    }
  }
});
const resource_postPgResource = registry.pgResources["post"];
const resource_left_armPgResource = registry.pgResources["left_arm"];
const resource_personPgResource = registry.pgResources["person"];
const resource_person_secretPgResource = registry.pgResources["person_secret"];
const makeArgs_current_user_id = () => [];
const resource_current_user_idPgResource = registry.pgResources["current_user_id"];
const resource_read_pg_settingsPgResource = registry.pgResources["read_pg_settings"];
const resource_return_table_without_grantsPgResource = registry.pgResources["return_table_without_grants"];
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
  identifier: "posts",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_postPgResource,
  pk: postUniques[0].attributes
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
const nodeIdHandler_LeftArm = makeTableNodeIdHandler({
  typeName: "LeftArm",
  identifier: "left_arms",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_left_armPgResource,
  pk: left_armUniques[0].attributes
});
const nodeFetcher_LeftArm = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_LeftArm));
  return nodeIdHandler_LeftArm.get(nodeIdHandler_LeftArm.getSpec($decoded));
};
const nodeIdHandler_Person = makeTableNodeIdHandler({
  typeName: "Person",
  identifier: "people",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_personPgResource,
  pk: personUniques[0].attributes
});
const nodeFetcher_Person = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Person));
  return nodeIdHandler_Person.get(nodeIdHandler_Person.getSpec($decoded));
};
const nodeIdHandler_PersonSecret = makeTableNodeIdHandler({
  typeName: "PersonSecret",
  identifier: "person_secrets",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_person_secretPgResource,
  pk: person_secretUniques[0].attributes,
  deprecationReason: "This is deprecated (comment on table c.person_secret)."
});
const nodeFetcher_PersonSecret = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandler_PersonSecret);
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
  LeftArm: nodeIdHandler_LeftArm,
  Person: nodeIdHandler_Person,
  PersonSecret: nodeIdHandler_PersonSecret
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
const resource_frmcdc_wrappedUrlPgResource = registry.pgResources["frmcdc_wrappedUrl"];
const isValidHstoreObject = obj => {
  if (obj === null) {
    // Null is okay
    return true;
  } else if (typeof obj === "object") {
    // A hash with string/null values is also okay
    const keys = Object.keys(obj);
    for (const key of keys) {
      const val = obj[key];
      if (val === null) {
        // Null is okay
      } else if (typeof val === "string") {
        // String is okay
      } else {
        // Everything else is invalid.
        return false;
      }
    }
    return true;
  } else {
    // Everything else is invalid.
    return false;
  }
};
const parseValueLiteral = (ast, variables) => {
  switch (ast.kind) {
    case Kind.INT:
    case Kind.FLOAT:
      // Number isn't really okay, but we'll coerce it to a string anyway.
      return String(parseFloat(ast.value));
    case Kind.STRING:
      // String is okay.
      return String(ast.value);
    case Kind.NULL:
      // Null is okay.
      return null;
    case Kind.VARIABLE:
      {
        // Variable is okay if that variable is either a string or null.
        const name = ast.name.value;
        const value = variables ? variables[name] : undefined;
        if (value === null || typeof value === "string") {
          return value;
        }
        return undefined;
      }
    default:
      // Everything else is invalid.
      return undefined;
  }
};
function toString(value) {
  return "" + value;
}
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
const PostCondition_idApply = ($condition, val) => applyAttributeCondition("id", TYPES.int, $condition, val);
const PostsOrderBy_ID_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "id",
    direction: "ASC"
  });
  queryBuilder.setOrderIsUnique();
};
const PostsOrderBy_ID_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "id",
    direction: "DESC"
  });
  queryBuilder.setOrderIsUnique();
};
const PersonSecret_personIdPlan = $record => {
  return $record.get("person_id");
};
const PersonSecret_personByPersonIdPlan = $record => resource_personPgResource.get({
  id: $record.get("person_id")
});
const resource_compound_keyPgResource = registry.pgResources["compound_key"];
const LeftArmCondition_personIdApply = ($condition, val) => applyAttributeCondition("person_id", TYPES.int, $condition, val);
const LeftArmsOrderBy_PERSON_ID_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "person_id",
    direction: "ASC"
  });
  queryBuilder.setOrderIsUnique();
};
const LeftArmsOrderBy_PERSON_ID_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "person_id",
    direction: "DESC"
  });
  queryBuilder.setOrderIsUnique();
};
const argDetailsSimple_left_arm_identity = [{
  graphqlArgName: "leftArm",
  pgCodec: leftArmCodec,
  postgresArgName: "left_arm"
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
const makeArgs_left_arm_identity = (args, path = []) => argDetailsSimple_left_arm_identity.map(details => makeArg(path, args, details));
const resource_left_arm_identityPgResource = registry.pgResources["left_arm_identity"];
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
const specFromArgs_LeftArm = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_LeftArm, $nodeId);
};
function applyInputToUpdateOrDelete(_, $object) {
  return $object;
}
const specFromArgs_Person = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Person, $nodeId);
};
const specFromArgs_PersonSecret = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_PersonSecret, $nodeId);
};
const EMPTY_OBJECT3 = Object.freeze({});
function queryPlan() {
  return constant(EMPTY_OBJECT3);
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
const LeftArmIdentityPayload_leftArmEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_left_armPgResource, left_armUniques[0].attributes, $mutation, fieldArgs);
const LeftArmIdentityPayload_personByPersonIdPlan = $record => resource_personPgResource.get({
  id: $record.get("result").get("person_id")
});
function applyClientMutationIdForCustomMutation(qb, val) {
  qb.setMeta("clientMutationId", val);
}
function LeftArmBaseInput_lengthInMetresApply(obj, val, info) {
  obj.set("length_in_metres", bakedInputRuntime(info.schema, info.field.type, val));
}
function LeftArmBaseInput_moodApply(obj, val, info) {
  obj.set("mood", bakedInputRuntime(info.schema, info.field.type, val));
}
function getClientMutationIdForCreatePlan($mutation) {
  const $insert = $mutation.getStepForKey("result");
  return $insert.getMeta("clientMutationId");
}
function planCreatePayloadResult($object) {
  return $object.get("result");
}
function applyCreateFields(qb, arg) {
  if (arg != null) {
    return qb.setBuilder();
  }
}
const CreatePersonPayload_personEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_personPgResource, personUniques[0].attributes, $mutation, fieldArgs);
function PersonInput_nameApply(obj, val, info) {
  obj.set("person_full_name", bakedInputRuntime(info.schema, info.field.type, val));
}
function PersonInput_aliasesApply(obj, val, info) {
  obj.set("aliases", bakedInputRuntime(info.schema, info.field.type, val));
}
function PersonInput_aboutApply(obj, val, info) {
  obj.set("about", bakedInputRuntime(info.schema, info.field.type, val));
}
function PersonInput_emailApply(obj, val, info) {
  obj.set("email", bakedInputRuntime(info.schema, info.field.type, val));
}
function PersonInput_siteApply(obj, val, info) {
  obj.set("site", bakedInputRuntime(info.schema, info.field.type, val));
}
const CreatePersonSecretPayload_personSecretEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(resource_person_secretPgResource, person_secretUniques[0].attributes, $mutation, fieldArgs);
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
  postById(id: Int!): Post

  """Get a single \`LeftArm\`."""
  leftArmById(id: Int!): LeftArm

  """Get a single \`LeftArm\`."""
  leftArmByPersonId(personId: Int!): LeftArm

  """Get a single \`Person\`."""
  personById(id: Int!): Person

  """Get a single \`Person\`."""
  personByEmail(email: Email!): Person

  """Get a single \`PersonSecret\`."""
  personSecretByPersonId(personId: Int!): PersonSecret @deprecated(reason: "This is deprecated (comment on table c.person_secret).")
  currentUserId: Int
  readPgSettings: JSON
  returnTableWithoutGrants: CompoundKey

  """Reads a single \`Post\` using its globally unique \`ID\`."""
  post(
    """The globally unique \`ID\` to be used in selecting a single \`Post\`."""
    nodeId: ID!
  ): Post

  """Reads a single \`LeftArm\` using its globally unique \`ID\`."""
  leftArm(
    """The globally unique \`ID\` to be used in selecting a single \`LeftArm\`."""
    nodeId: ID!
  ): LeftArm

  """Reads a single \`Person\` using its globally unique \`ID\`."""
  person(
    """The globally unique \`ID\` to be used in selecting a single \`Person\`."""
    nodeId: ID!
  ): Person

  """Reads a single \`PersonSecret\` using its globally unique \`ID\`."""
  personSecret(
    """
    The globally unique \`ID\` to be used in selecting a single \`PersonSecret\`.
    """
    nodeId: ID!
  ): PersonSecret @deprecated(reason: "This is deprecated (comment on table c.person_secret).")

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

  """Reads and enables pagination through a set of \`LeftArm\`."""
  allLeftArms(
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
    condition: LeftArmCondition

    """The method to use when ordering \`LeftArm\`."""
    orderBy: [LeftArmsOrderBy!] = [PRIMARY_KEY_ASC]
  ): LeftArmsConnection

  """Reads and enables pagination through a set of \`Person\`."""
  allPeople(
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
    condition: PersonCondition

    """The method to use when ordering \`Person\`."""
    orderBy: [PeopleOrderBy!] = [PRIMARY_KEY_ASC]
  ): PeopleConnection

  """Reads and enables pagination through a set of \`PersonSecret\`."""
  allPersonSecrets(
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
    condition: PersonSecretCondition

    """The method to use when ordering \`PersonSecret\`."""
    orderBy: [PersonSecretsOrderBy!] = [PRIMARY_KEY_ASC]
  ): PersonSecretsConnection @deprecated(reason: "This is deprecated (comment on table c.person_secret).")
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
  id: Int!
  headline: String!
  body: String
  authorId: Int

  """Reads a single \`Person\` that is related to this \`Post\`."""
  personByAuthorId: Person
}

"""Person test comment"""
type Person implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!

  """The primary unique identifier for the person"""
  id: Int!

  """The person’s name"""
  name: String!
  aliases: [String]!
  about: String
  email: Email!
  site: WrappedUrl @deprecated(reason: "Don’t use me")
  config: KeyValueHash
  lastLoginFromIp: InternetAddress
  lastLoginFromSubnet: String
  userMac: String
  createdAt: Datetime

  """Reads and enables pagination through a set of \`Post\`."""
  postsByAuthorId(
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
  ): PostsConnection!

  """This \`Person\`'s \`PersonSecret\`."""
  personSecretByPersonId: PersonSecret @deprecated(reason: "This is deprecated (comment on table c.person_secret).")

  """Reads a single \`LeftArm\` that is related to this \`Person\`."""
  leftArmByPersonId: LeftArm
}

scalar Email

type WrappedUrl {
  url: NotNullUrl!
}

scalar NotNullUrl

"""
A set of key/value pairs, keys are strings, values may be a string or null. Exposed as a JSON object.
"""
scalar KeyValueHash

"""An IPv4 or IPv6 host address, and optionally its subnet."""
scalar InternetAddress

"""
A point in time as described by the [ISO
8601](https://en.wikipedia.org/wiki/ISO_8601) and, if it has a timezone, [RFC
3339](https://datatracker.ietf.org/doc/html/rfc3339) standards. Input values
that do not conform to both ISO 8601 and RFC 3339 may be coerced, which may lead
to unexpected results.
"""
scalar Datetime

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
A condition to be used against \`Post\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input PostCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`headline\` field."""
  headline: String

  """Checks for equality with the object’s \`body\` field."""
  body: String

  """Checks for equality with the object’s \`authorId\` field."""
  authorId: Int
}

"""Methods to use when ordering \`Post\`."""
enum PostsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  HEADLINE_ASC
  HEADLINE_DESC
  BODY_ASC
  BODY_DESC
  AUTHOR_ID_ASC
  AUTHOR_ID_DESC
}

"""Tracks the person's secret"""
type PersonSecret implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  personId: Int!

  """A secret held by the associated Person"""
  secret: String

  """The \`Person\` this \`PersonSecret\` belongs to."""
  personByPersonId: Person
}

"""Tracks metadata about the left arms of various people"""
type LeftArm implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  personId: Int
  lengthInMetres: Float
  mood: String!

  """Reads a single \`Person\` that is related to this \`LeftArm\`."""
  personByPersonId: Person
}

"""
A JavaScript object encoded in the JSON format as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).
"""
scalar JSON

type CompoundKey {
  personId2: Int!
  personId1: Int!
  extra: Boolean

  """Reads a single \`Person\` that is related to this \`CompoundKey\`."""
  personByPersonId1: Person

  """Reads a single \`Person\` that is related to this \`CompoundKey\`."""
  personByPersonId2: Person
}

"""A connection to a list of \`LeftArm\` values."""
type LeftArmsConnection {
  """A list of \`LeftArm\` objects."""
  nodes: [LeftArm]!

  """
  A list of edges which contains the \`LeftArm\` and cursor to aid in pagination.
  """
  edges: [LeftArmsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`LeftArm\` you could get from the connection."""
  totalCount: Int!
}

"""A \`LeftArm\` edge in the connection."""
type LeftArmsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`LeftArm\` at the end of the edge."""
  node: LeftArm
}

"""
A condition to be used against \`LeftArm\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input LeftArmCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`personId\` field."""
  personId: Int

  """Checks for equality with the object’s \`lengthInMetres\` field."""
  lengthInMetres: Float

  """Checks for equality with the object’s \`mood\` field."""
  mood: String
}

"""Methods to use when ordering \`LeftArm\`."""
enum LeftArmsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  PERSON_ID_ASC
  PERSON_ID_DESC
  LENGTH_IN_METRES_ASC
  LENGTH_IN_METRES_DESC
  MOOD_ASC
  MOOD_DESC
}

"""A connection to a list of \`Person\` values."""
type PeopleConnection {
  """A list of \`Person\` objects."""
  nodes: [Person]!

  """
  A list of edges which contains the \`Person\` and cursor to aid in pagination.
  """
  edges: [PeopleEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Person\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Person\` edge in the connection."""
type PeopleEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Person\` at the end of the edge."""
  node: Person
}

"""
A condition to be used against \`Person\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input PersonCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`name\` field."""
  name: String

  """Checks for equality with the object’s \`aliases\` field."""
  aliases: [String]

  """Checks for equality with the object’s \`about\` field."""
  about: String

  """Checks for equality with the object’s \`email\` field."""
  email: Email

  """Checks for equality with the object’s \`site\` field."""
  site: WrappedUrlInput

  """Checks for equality with the object’s \`config\` field."""
  config: KeyValueHash

  """Checks for equality with the object’s \`lastLoginFromIp\` field."""
  lastLoginFromIp: InternetAddress

  """Checks for equality with the object’s \`lastLoginFromSubnet\` field."""
  lastLoginFromSubnet: String

  """Checks for equality with the object’s \`userMac\` field."""
  userMac: String

  """Checks for equality with the object’s \`createdAt\` field."""
  createdAt: Datetime
}

"""An input for mutations affecting \`WrappedUrl\`"""
input WrappedUrlInput {
  url: NotNullUrl!
}

"""Methods to use when ordering \`Person\`."""
enum PeopleOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  NAME_ASC
  NAME_DESC
  ABOUT_ASC
  ABOUT_DESC
  EMAIL_ASC
  EMAIL_DESC
  SITE_ASC
  SITE_DESC
  CONFIG_ASC
  CONFIG_DESC
  LAST_LOGIN_FROM_IP_ASC
  LAST_LOGIN_FROM_IP_DESC
  LAST_LOGIN_FROM_SUBNET_ASC
  LAST_LOGIN_FROM_SUBNET_DESC
  USER_MAC_ASC
  USER_MAC_DESC
  CREATED_AT_ASC
  CREATED_AT_DESC
}

"""A connection to a list of \`PersonSecret\` values."""
type PersonSecretsConnection {
  """A list of \`PersonSecret\` objects."""
  nodes: [PersonSecret]!

  """
  A list of edges which contains the \`PersonSecret\` and cursor to aid in pagination.
  """
  edges: [PersonSecretsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`PersonSecret\` you could get from the connection."""
  totalCount: Int!
}

"""A \`PersonSecret\` edge in the connection."""
type PersonSecretsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`PersonSecret\` at the end of the edge."""
  node: PersonSecret
}

"""
A condition to be used against \`PersonSecret\` object types. All fields are
tested for equality and combined with a logical ‘and.’
"""
input PersonSecretCondition {
  """Checks for equality with the object’s \`personId\` field."""
  personId: Int

  """Checks for equality with the object’s \`secret\` field."""
  secret: String
}

"""Methods to use when ordering \`PersonSecret\`."""
enum PersonSecretsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  PERSON_ID_ASC
  PERSON_ID_DESC
  SECRET_ASC
  SECRET_DESC
}

"""
The root mutation type which contains root level fields which mutate data.
"""
type Mutation {
  leftArmIdentity(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: LeftArmIdentityInput!
  ): LeftArmIdentityPayload

  """Creates a single \`LeftArm\`."""
  createLeftArm(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateLeftArmInput!
  ): CreateLeftArmPayload

  """Creates a single \`Person\`."""
  createPerson(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreatePersonInput!
  ): CreatePersonPayload

  """Creates a single \`PersonSecret\`."""
  createPersonSecret(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreatePersonSecretInput!
  ): CreatePersonSecretPayload @deprecated(reason: "This is deprecated (comment on table c.person_secret).")

  """Updates a single \`LeftArm\` using its globally unique id and a patch."""
  updateLeftArm(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateLeftArmInput!
  ): UpdateLeftArmPayload

  """Updates a single \`LeftArm\` using a unique key and a patch."""
  updateLeftArmById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateLeftArmByIdInput!
  ): UpdateLeftArmPayload

  """Updates a single \`LeftArm\` using a unique key and a patch."""
  updateLeftArmByPersonId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateLeftArmByPersonIdInput!
  ): UpdateLeftArmPayload

  """Updates a single \`Person\` using its globally unique id and a patch."""
  updatePerson(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdatePersonInput!
  ): UpdatePersonPayload

  """Updates a single \`Person\` using a unique key and a patch."""
  updatePersonById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdatePersonByIdInput!
  ): UpdatePersonPayload

  """Updates a single \`Person\` using a unique key and a patch."""
  updatePersonByEmail(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdatePersonByEmailInput!
  ): UpdatePersonPayload

  """Deletes a single \`LeftArm\` using its globally unique id."""
  deleteLeftArm(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteLeftArmInput!
  ): DeleteLeftArmPayload

  """Deletes a single \`LeftArm\` using a unique key."""
  deleteLeftArmById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteLeftArmByIdInput!
  ): DeleteLeftArmPayload

  """Deletes a single \`LeftArm\` using a unique key."""
  deleteLeftArmByPersonId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteLeftArmByPersonIdInput!
  ): DeleteLeftArmPayload

  """Deletes a single \`Person\` using its globally unique id."""
  deletePerson(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeletePersonInput!
  ): DeletePersonPayload

  """Deletes a single \`Person\` using a unique key."""
  deletePersonById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeletePersonByIdInput!
  ): DeletePersonPayload

  """Deletes a single \`Person\` using a unique key."""
  deletePersonByEmail(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeletePersonByEmailInput!
  ): DeletePersonPayload

  """Deletes a single \`PersonSecret\` using its globally unique id."""
  deletePersonSecret(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeletePersonSecretInput!
  ): DeletePersonSecretPayload @deprecated(reason: "This is deprecated (comment on table c.person_secret).")

  """Deletes a single \`PersonSecret\` using a unique key."""
  deletePersonSecretByPersonId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeletePersonSecretByPersonIdInput!
  ): DeletePersonSecretPayload @deprecated(reason: "This is deprecated (comment on table c.person_secret).")
}

"""The output of our \`leftArmIdentity\` mutation."""
type LeftArmIdentityPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  leftArm: LeftArm

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`LeftArm\`. May be used by Relay 1."""
  leftArmEdge(
    """The method to use when ordering \`LeftArm\`."""
    orderBy: [LeftArmsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): LeftArmsEdge

  """Reads a single \`Person\` that is related to this \`LeftArm\`."""
  personByPersonId: Person
}

"""All input for the \`leftArmIdentity\` mutation."""
input LeftArmIdentityInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  leftArm: LeftArmBaseInput
}

"""An input representation of \`LeftArm\` with nullable fields."""
input LeftArmBaseInput {
  id: Int
  personId: Int
  lengthInMetres: Float
  mood: String
}

"""The output of our create \`LeftArm\` mutation."""
type CreateLeftArmPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`LeftArm\` that was created by this mutation."""
  leftArm: LeftArm

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`LeftArm\`. May be used by Relay 1."""
  leftArmEdge(
    """The method to use when ordering \`LeftArm\`."""
    orderBy: [LeftArmsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): LeftArmsEdge

  """Reads a single \`Person\` that is related to this \`LeftArm\`."""
  personByPersonId: Person
}

"""All input for the create \`LeftArm\` mutation."""
input CreateLeftArmInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`LeftArm\` to be created by this mutation."""
  leftArm: LeftArmInput!
}

"""An input for mutations affecting \`LeftArm\`"""
input LeftArmInput {
  lengthInMetres: Float
}

"""The output of our create \`Person\` mutation."""
type CreatePersonPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Person\` that was created by this mutation."""
  person: Person

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Person\`. May be used by Relay 1."""
  personEdge(
    """The method to use when ordering \`Person\`."""
    orderBy: [PeopleOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PeopleEdge
}

"""All input for the create \`Person\` mutation."""
input CreatePersonInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`Person\` to be created by this mutation."""
  person: PersonInput!
}

"""An input for mutations affecting \`Person\`"""
input PersonInput {
  """The person’s name"""
  name: String!
  aliases: [String]
  about: String
  email: Email!
  site: WrappedUrlInput
}

"""The output of our create \`PersonSecret\` mutation."""
type CreatePersonSecretPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`PersonSecret\` that was created by this mutation."""
  personSecret: PersonSecret @deprecated(reason: "This is deprecated (comment on table c.person_secret).")

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`PersonSecret\`. May be used by Relay 1."""
  personSecretEdge(
    """The method to use when ordering \`PersonSecret\`."""
    orderBy: [PersonSecretsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PersonSecretsEdge @deprecated(reason: "This is deprecated (comment on table c.person_secret).")

  """The \`Person\` this \`PersonSecret\` belongs to."""
  personByPersonId: Person
}

"""All input for the create \`PersonSecret\` mutation."""
input CreatePersonSecretInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`PersonSecret\` to be created by this mutation."""
  personSecret: PersonSecretInput!
}

"""An input for mutations affecting \`PersonSecret\`"""
input PersonSecretInput {
  """A secret held by the associated Person"""
  secret: String
}

"""The output of our update \`LeftArm\` mutation."""
type UpdateLeftArmPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`LeftArm\` that was updated by this mutation."""
  leftArm: LeftArm

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`LeftArm\`. May be used by Relay 1."""
  leftArmEdge(
    """The method to use when ordering \`LeftArm\`."""
    orderBy: [LeftArmsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): LeftArmsEdge

  """Reads a single \`Person\` that is related to this \`LeftArm\`."""
  personByPersonId: Person
}

"""All input for the \`updateLeftArm\` mutation."""
input UpdateLeftArmInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`LeftArm\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`LeftArm\` being updated.
  """
  leftArmPatch: LeftArmPatch!
}

"""
Represents an update to a \`LeftArm\`. Fields that are set will be updated.
"""
input LeftArmPatch {
  mood: String
}

"""All input for the \`updateLeftArmById\` mutation."""
input UpdateLeftArmByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`LeftArm\` being updated.
  """
  leftArmPatch: LeftArmPatch!
}

"""All input for the \`updateLeftArmByPersonId\` mutation."""
input UpdateLeftArmByPersonIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  personId: Int!

  """
  An object where the defined keys will be set on the \`LeftArm\` being updated.
  """
  leftArmPatch: LeftArmPatch!
}

"""The output of our update \`Person\` mutation."""
type UpdatePersonPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Person\` that was updated by this mutation."""
  person: Person

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Person\`. May be used by Relay 1."""
  personEdge(
    """The method to use when ordering \`Person\`."""
    orderBy: [PeopleOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PeopleEdge
}

"""All input for the \`updatePerson\` mutation."""
input UpdatePersonInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Person\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`Person\` being updated.
  """
  personPatch: PersonPatch!
}

"""
Represents an update to a \`Person\`. Fields that are set will be updated.
"""
input PersonPatch {
  """The person’s name"""
  name: String
  aliases: [String]
  about: String
  email: Email
  site: WrappedUrlInput
}

"""All input for the \`updatePersonById\` mutation."""
input UpdatePersonByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The primary unique identifier for the person"""
  id: Int!

  """
  An object where the defined keys will be set on the \`Person\` being updated.
  """
  personPatch: PersonPatch!
}

"""All input for the \`updatePersonByEmail\` mutation."""
input UpdatePersonByEmailInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  email: Email!

  """
  An object where the defined keys will be set on the \`Person\` being updated.
  """
  personPatch: PersonPatch!
}

"""The output of our delete \`LeftArm\` mutation."""
type DeleteLeftArmPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`LeftArm\` that was deleted by this mutation."""
  leftArm: LeftArm
  deletedLeftArmId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`LeftArm\`. May be used by Relay 1."""
  leftArmEdge(
    """The method to use when ordering \`LeftArm\`."""
    orderBy: [LeftArmsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): LeftArmsEdge

  """Reads a single \`Person\` that is related to this \`LeftArm\`."""
  personByPersonId: Person
}

"""All input for the \`deleteLeftArm\` mutation."""
input DeleteLeftArmInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`LeftArm\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteLeftArmById\` mutation."""
input DeleteLeftArmByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!
}

"""All input for the \`deleteLeftArmByPersonId\` mutation."""
input DeleteLeftArmByPersonIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  personId: Int!
}

"""The output of our delete \`Person\` mutation."""
type DeletePersonPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Person\` that was deleted by this mutation."""
  person: Person
  deletedPersonId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Person\`. May be used by Relay 1."""
  personEdge(
    """The method to use when ordering \`Person\`."""
    orderBy: [PeopleOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PeopleEdge
}

"""All input for the \`deletePerson\` mutation."""
input DeletePersonInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Person\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deletePersonById\` mutation."""
input DeletePersonByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The primary unique identifier for the person"""
  id: Int!
}

"""All input for the \`deletePersonByEmail\` mutation."""
input DeletePersonByEmailInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  email: Email!
}

"""The output of our delete \`PersonSecret\` mutation."""
type DeletePersonSecretPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`PersonSecret\` that was deleted by this mutation."""
  personSecret: PersonSecret
  deletedPersonSecretId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`PersonSecret\`. May be used by Relay 1."""
  personSecretEdge(
    """The method to use when ordering \`PersonSecret\`."""
    orderBy: [PersonSecretsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PersonSecretsEdge @deprecated(reason: "This is deprecated (comment on table c.person_secret).")

  """The \`Person\` this \`PersonSecret\` belongs to."""
  personByPersonId: Person
}

"""All input for the \`deletePersonSecret\` mutation."""
input DeletePersonSecretInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`PersonSecret\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deletePersonSecretByPersonId\` mutation."""
input DeletePersonSecretByPersonIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  personId: Int!
}`;
export const objects = {
  Query: {
    assertStep() {
      return true;
    },
    plans: {
      allLeftArms: {
        plan() {
          return connection(resource_left_armPgResource.find());
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
      allPeople: {
        plan() {
          return connection(resource_personPgResource.find());
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
      allPersonSecrets: {
        plan() {
          return connection(resource_person_secretPgResource.find());
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
          return connection(resource_postPgResource.find());
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
      currentUserId($root, args, _info) {
        const selectArgs = makeArgs_current_user_id(args);
        return resource_current_user_idPgResource.execute(selectArgs);
      },
      leftArm(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_LeftArm($nodeId);
      },
      leftArmById(_$root, {
        $id
      }) {
        return resource_left_armPgResource.get({
          id: $id
        });
      },
      leftArmByPersonId(_$root, {
        $personId
      }) {
        return resource_left_armPgResource.get({
          person_id: $personId
        });
      },
      node(_$root, fieldArgs) {
        return fieldArgs.getRaw("nodeId");
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_Query.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Query.codec.name].encode);
      },
      person(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_Person($nodeId);
      },
      personByEmail(_$root, {
        $email
      }) {
        return resource_personPgResource.get({
          email: $email
        });
      },
      personById(_$root, {
        $id
      }) {
        return resource_personPgResource.get({
          id: $id
        });
      },
      personSecret(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_PersonSecret($nodeId);
      },
      personSecretByPersonId(_$root, {
        $personId
      }) {
        return resource_person_secretPgResource.get({
          person_id: $personId
        });
      },
      post(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_Post($nodeId);
      },
      postById(_$root, {
        $id
      }) {
        return resource_postPgResource.get({
          id: $id
        });
      },
      query() {
        return constant(EMPTY_OBJECT);
      },
      readPgSettings($root, args, _info) {
        const selectArgs = makeArgs_current_user_id(args);
        return resource_read_pg_settingsPgResource.execute(selectArgs);
      },
      returnTableWithoutGrants($root, args, _info) {
        const selectArgs = makeArgs_current_user_id(args);
        return resource_return_table_without_grantsPgResource.execute(selectArgs);
      }
    }
  },
  Mutation: {
    assertStep: __ValueStep,
    plans: {
      createLeftArm: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_left_armPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createPerson: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_personPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createPersonSecret: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_person_secretPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      deleteLeftArm: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_left_armPgResource, specFromArgs_LeftArm(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteLeftArmById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_left_armPgResource, {
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
      deleteLeftArmByPersonId: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_left_armPgResource, {
            person_id: args.getRaw(['input', "personId"])
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
      deletePerson: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_personPgResource, specFromArgs_Person(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deletePersonByEmail: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_personPgResource, {
            email: args.getRaw(['input', "email"])
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
      deletePersonById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_personPgResource, {
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
      deletePersonSecret: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_person_secretPgResource, specFromArgs_PersonSecret(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deletePersonSecretByPersonId: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_person_secretPgResource, {
            person_id: args.getRaw(['input', "personId"])
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
      leftArmIdentity: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_left_arm_identity(args, ["input"]);
          const $result = resource_left_arm_identityPgResource.execute(selectArgs, "mutation");
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
      updateLeftArm: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_left_armPgResource, specFromArgs_LeftArm(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateLeftArmById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_left_armPgResource, {
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
      updateLeftArmByPersonId: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_left_armPgResource, {
            person_id: args.getRaw(['input', "personId"])
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
      updatePerson: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_personPgResource, specFromArgs_Person(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updatePersonByEmail: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_personPgResource, {
            email: args.getRaw(['input', "email"])
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
      updatePersonById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_personPgResource, {
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
  CompoundKey: {
    assertStep: assertPgClassSingleStep,
    plans: {
      personByPersonId1($record) {
        return resource_personPgResource.get({
          id: $record.get("person_id_1")
        });
      },
      personByPersonId2($record) {
        return resource_personPgResource.get({
          id: $record.get("person_id_2")
        });
      },
      personId1($record) {
        return $record.get("person_id_1");
      },
      personId2($record) {
        return $record.get("person_id_2");
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of compound_keyUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_compound_keyPgResource.get(spec);
    }
  },
  CreateLeftArmPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      leftArm: planCreatePayloadResult,
      leftArmEdge: LeftArmIdentityPayload_leftArmEdgePlan,
      personByPersonId: LeftArmIdentityPayload_personByPersonIdPlan,
      query: queryPlan
    }
  },
  CreatePersonPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      person: planCreatePayloadResult,
      personEdge: CreatePersonPayload_personEdgePlan,
      query: queryPlan
    }
  },
  CreatePersonSecretPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      personByPersonId: LeftArmIdentityPayload_personByPersonIdPlan,
      personSecret: planCreatePayloadResult,
      personSecretEdge: CreatePersonSecretPayload_personSecretEdgePlan,
      query: queryPlan
    }
  },
  DeleteLeftArmPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedLeftArmId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_LeftArm.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      leftArm: planCreatePayloadResult,
      leftArmEdge: LeftArmIdentityPayload_leftArmEdgePlan,
      personByPersonId: LeftArmIdentityPayload_personByPersonIdPlan,
      query: queryPlan
    }
  },
  DeletePersonPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedPersonId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Person.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      person: planCreatePayloadResult,
      personEdge: CreatePersonPayload_personEdgePlan,
      query: queryPlan
    }
  },
  DeletePersonSecretPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedPersonSecretId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_PersonSecret.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      personByPersonId: LeftArmIdentityPayload_personByPersonIdPlan,
      personSecret: planCreatePayloadResult,
      personSecretEdge: CreatePersonSecretPayload_personSecretEdgePlan,
      query: queryPlan
    }
  },
  LeftArm: {
    assertStep: assertPgClassSingleStep,
    plans: {
      lengthInMetres($record) {
        return $record.get("length_in_metres");
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_LeftArm.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_LeftArm.codec.name].encode);
      },
      personByPersonId: PersonSecret_personByPersonIdPlan,
      personId: PersonSecret_personIdPlan
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of left_armUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_left_armPgResource.get(spec);
    }
  },
  LeftArmIdentityPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($object) {
        const $result = $object.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      leftArm($object) {
        return $object.get("result");
      },
      leftArmEdge: LeftArmIdentityPayload_leftArmEdgePlan,
      personByPersonId: LeftArmIdentityPayload_personByPersonIdPlan,
      query: queryPlan
    }
  },
  LeftArmsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  PeopleConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  Person: {
    assertStep: assertPgClassSingleStep,
    plans: {
      createdAt($record) {
        return $record.get("created_at");
      },
      lastLoginFromIp($record) {
        return $record.get("last_login_from_ip");
      },
      lastLoginFromSubnet($record) {
        return $record.get("last_login_from_subnet");
      },
      leftArmByPersonId($record) {
        return resource_left_armPgResource.get({
          person_id: $record.get("id")
        });
      },
      name($record) {
        return $record.get("person_full_name");
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_Person.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Person.codec.name].encode);
      },
      personSecretByPersonId($record) {
        return resource_person_secretPgResource.get({
          person_id: $record.get("id")
        });
      },
      postsByAuthorId: {
        plan($record) {
          const $records = resource_postPgResource.find({
            author_id: $record.get("id")
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
      site($record) {
        const $plan = $record.get("site");
        const $select = pgSelectSingleFromRecord(resource_frmcdc_wrappedUrlPgResource, $plan);
        $select.getClassStep().setTrusted();
        return $select;
      },
      userMac($record) {
        return $record.get("user_mac");
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of personUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_personPgResource.get(spec);
    }
  },
  PersonSecret: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nodeId($parent) {
        const specifier = nodeIdHandler_PersonSecret.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_PersonSecret.codec.name].encode);
      },
      personByPersonId: PersonSecret_personByPersonIdPlan,
      personId: PersonSecret_personIdPlan,
      secret($record) {
        return $record.get("sekrit");
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of person_secretUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_person_secretPgResource.get(spec);
    }
  },
  PersonSecretsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  Post: {
    assertStep: assertPgClassSingleStep,
    plans: {
      authorId($record) {
        return $record.get("author_id");
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_Post.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Post.codec.name].encode);
      },
      personByAuthorId($record) {
        return resource_personPgResource.get({
          id: $record.get("author_id")
        });
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of postUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_postPgResource.get(spec);
    }
  },
  PostsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  UpdateLeftArmPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      leftArm: planCreatePayloadResult,
      leftArmEdge: LeftArmIdentityPayload_leftArmEdgePlan,
      personByPersonId: LeftArmIdentityPayload_personByPersonIdPlan,
      query: queryPlan
    }
  },
  UpdatePersonPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      person: planCreatePayloadResult,
      personEdge: CreatePersonPayload_personEdgePlan,
      query: queryPlan
    }
  },
  WrappedUrl: {
    assertStep: assertPgClassSingleStep
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
  CreateLeftArmInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      leftArm: applyCreateFields
    }
  },
  CreatePersonInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      person: applyCreateFields
    }
  },
  CreatePersonSecretInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      personSecret: applyCreateFields
    }
  },
  DeleteLeftArmByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeleteLeftArmByPersonIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeleteLeftArmInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeletePersonByEmailInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeletePersonByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeletePersonInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeletePersonSecretByPersonIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  DeletePersonSecretInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  LeftArmBaseInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      id(obj, val, info) {
        obj.set("id", bakedInputRuntime(info.schema, info.field.type, val));
      },
      lengthInMetres: LeftArmBaseInput_lengthInMetresApply,
      mood: LeftArmBaseInput_moodApply,
      personId(obj, val, info) {
        obj.set("person_id", bakedInputRuntime(info.schema, info.field.type, val));
      }
    }
  },
  LeftArmCondition: {
    plans: {
      id: PostCondition_idApply,
      lengthInMetres($condition, val) {
        return applyAttributeCondition("length_in_metres", TYPES.float, $condition, val);
      },
      mood($condition, val) {
        return applyAttributeCondition("mood", TYPES.text, $condition, val);
      },
      personId: LeftArmCondition_personIdApply
    }
  },
  LeftArmIdentityInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation
    }
  },
  LeftArmInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      lengthInMetres: LeftArmBaseInput_lengthInMetresApply
    }
  },
  LeftArmPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      mood: LeftArmBaseInput_moodApply
    }
  },
  PersonCondition: {
    plans: {
      about($condition, val) {
        return applyAttributeCondition("about", TYPES.text, $condition, val);
      },
      aliases($condition, val) {
        return applyAttributeCondition("aliases", LIST_TYPES.text, $condition, val);
      },
      config($condition, val) {
        return applyAttributeCondition("config", TYPES.hstore, $condition, val);
      },
      createdAt($condition, val) {
        return applyAttributeCondition("created_at", TYPES.timestamp, $condition, val);
      },
      email($condition, val) {
        return applyAttributeCondition("email", emailCodec, $condition, val);
      },
      id: PostCondition_idApply,
      lastLoginFromIp($condition, val) {
        return applyAttributeCondition("last_login_from_ip", TYPES.inet, $condition, val);
      },
      lastLoginFromSubnet($condition, val) {
        return applyAttributeCondition("last_login_from_subnet", TYPES.cidr, $condition, val);
      },
      name($condition, val) {
        return applyAttributeCondition("person_full_name", TYPES.varchar, $condition, val);
      },
      site($condition, val) {
        return applyAttributeCondition("site", wrappedUrlCodec, $condition, val);
      },
      userMac($condition, val) {
        return applyAttributeCondition("user_mac", TYPES.macaddr, $condition, val);
      }
    }
  },
  PersonInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      about: PersonInput_aboutApply,
      aliases: PersonInput_aliasesApply,
      email: PersonInput_emailApply,
      name: PersonInput_nameApply,
      site: PersonInput_siteApply
    }
  },
  PersonPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      about: PersonInput_aboutApply,
      aliases: PersonInput_aliasesApply,
      email: PersonInput_emailApply,
      name: PersonInput_nameApply,
      site: PersonInput_siteApply
    }
  },
  PersonSecretCondition: {
    plans: {
      personId: LeftArmCondition_personIdApply,
      secret($condition, val) {
        return applyAttributeCondition("sekrit", TYPES.text, $condition, val);
      }
    }
  },
  PersonSecretInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      secret(obj, val, info) {
        obj.set("sekrit", bakedInputRuntime(info.schema, info.field.type, val));
      }
    }
  },
  PostCondition: {
    plans: {
      authorId($condition, val) {
        return applyAttributeCondition("author_id", TYPES.int, $condition, val);
      },
      body($condition, val) {
        return applyAttributeCondition("body", TYPES.text, $condition, val);
      },
      headline($condition, val) {
        return applyAttributeCondition("headline", TYPES.text, $condition, val);
      },
      id: PostCondition_idApply
    }
  },
  UpdateLeftArmByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      leftArmPatch: applyCreateFields
    }
  },
  UpdateLeftArmByPersonIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      leftArmPatch: applyCreateFields
    }
  },
  UpdateLeftArmInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      leftArmPatch: applyCreateFields
    }
  },
  UpdatePersonByEmailInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      personPatch: applyCreateFields
    }
  },
  UpdatePersonByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      personPatch: applyCreateFields
    }
  },
  UpdatePersonInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCustomMutation,
      personPatch: applyCreateFields
    }
  },
  WrappedUrlInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      url(obj, val, info) {
        obj.set("url", bakedInputRuntime(info.schema, info.field.type, val));
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
      throw new GraphQLError(`Cursor can only parse string values (kind='${ast.kind}')`);
    }
  },
  Datetime: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`Datetime can only parse string values (kind='${ast.kind}')`);
    }
  },
  Email: {
    serialize: GraphQLString.serialize,
    parseValue: GraphQLString.parseValue,
    parseLiteral: GraphQLString.parseLiteral
  },
  InternetAddress: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`InternetAddress can only parse string values (kind='${ast.kind}')`);
    }
  },
  JSON: {
    serialize(value) {
      return JSON.stringify(value);
    },
    parseValue(value) {
      return JSON.parse(value);
    },
    parseLiteral(ast, _variables) {
      if (ast.kind === Kind.STRING) {
        return JSON.parse(ast.value);
      } else {
        return undefined;
      }
    }
  },
  KeyValueHash: {
    serialize(value) {
      return value;
    },
    parseValue(obj) {
      if (isValidHstoreObject(obj)) {
        return obj;
      }
      throw new GraphQLError(`This is not a valid KeyValueHash object, it must be a key/value hash where keys and values are both strings (or null).`);
    },
    parseLiteral(ast, variables) {
      switch (ast.kind) {
        case Kind.OBJECT:
          {
            const value = ast.fields.reduce((memo, field) => {
              memo[field.name.value] = parseValueLiteral(field.value, variables);
              return memo;
            }, Object.create(null));
            if (!isValidHstoreObject(value)) {
              return undefined;
            }
            return value;
          }
        case Kind.NULL:
          return null;
        case Kind.VARIABLE:
          {
            const name = ast.name.value;
            const value = variables ? variables[name] : undefined;
            if (!isValidHstoreObject(value)) {
              return undefined;
            }
            return value;
          }
        default:
          return undefined;
      }
    }
  },
  NotNullUrl: {
    serialize: GraphQLString.serialize,
    parseValue: GraphQLString.parseValue,
    parseLiteral: GraphQLString.parseLiteral
  }
};
export const enums = {
  LeftArmsOrderBy: {
    values: {
      ID_ASC: PostsOrderBy_ID_ASCApply,
      ID_DESC: PostsOrderBy_ID_DESCApply,
      LENGTH_IN_METRES_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "length_in_metres",
          direction: "ASC"
        });
      },
      LENGTH_IN_METRES_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "length_in_metres",
          direction: "DESC"
        });
      },
      MOOD_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "mood",
          direction: "ASC"
        });
      },
      MOOD_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "mood",
          direction: "DESC"
        });
      },
      PERSON_ID_ASC: LeftArmsOrderBy_PERSON_ID_ASCApply,
      PERSON_ID_DESC: LeftArmsOrderBy_PERSON_ID_DESCApply,
      PRIMARY_KEY_ASC(queryBuilder) {
        left_armUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        left_armUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      }
    }
  },
  PeopleOrderBy: {
    values: {
      ABOUT_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "about",
          direction: "ASC"
        });
      },
      ABOUT_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "about",
          direction: "DESC"
        });
      },
      CONFIG_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "config",
          direction: "ASC"
        });
      },
      CONFIG_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "config",
          direction: "DESC"
        });
      },
      CREATED_AT_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "created_at",
          direction: "ASC"
        });
      },
      CREATED_AT_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "created_at",
          direction: "DESC"
        });
      },
      EMAIL_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "email",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      EMAIL_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "email",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
      },
      ID_ASC: PostsOrderBy_ID_ASCApply,
      ID_DESC: PostsOrderBy_ID_DESCApply,
      LAST_LOGIN_FROM_IP_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "last_login_from_ip",
          direction: "ASC"
        });
      },
      LAST_LOGIN_FROM_IP_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "last_login_from_ip",
          direction: "DESC"
        });
      },
      LAST_LOGIN_FROM_SUBNET_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "last_login_from_subnet",
          direction: "ASC"
        });
      },
      LAST_LOGIN_FROM_SUBNET_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "last_login_from_subnet",
          direction: "DESC"
        });
      },
      NAME_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "person_full_name",
          direction: "ASC"
        });
      },
      NAME_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "person_full_name",
          direction: "DESC"
        });
      },
      PRIMARY_KEY_ASC(queryBuilder) {
        personUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        personUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      SITE_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "site",
          direction: "ASC"
        });
      },
      SITE_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "site",
          direction: "DESC"
        });
      },
      USER_MAC_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "user_mac",
          direction: "ASC"
        });
      },
      USER_MAC_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "user_mac",
          direction: "DESC"
        });
      }
    }
  },
  PersonSecretsOrderBy: {
    values: {
      PERSON_ID_ASC: LeftArmsOrderBy_PERSON_ID_ASCApply,
      PERSON_ID_DESC: LeftArmsOrderBy_PERSON_ID_DESCApply,
      PRIMARY_KEY_ASC(queryBuilder) {
        person_secretUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        person_secretUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      SECRET_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "sekrit",
          direction: "ASC"
        });
      },
      SECRET_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "sekrit",
          direction: "DESC"
        });
      }
    }
  },
  PostsOrderBy: {
    values: {
      AUTHOR_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "author_id",
          direction: "ASC"
        });
      },
      AUTHOR_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "author_id",
          direction: "DESC"
        });
      },
      BODY_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "body",
          direction: "ASC"
        });
      },
      BODY_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "body",
          direction: "DESC"
        });
      },
      HEADLINE_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "headline",
          direction: "ASC"
        });
      },
      HEADLINE_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "headline",
          direction: "DESC"
        });
      },
      ID_ASC: PostsOrderBy_ID_ASCApply,
      ID_DESC: PostsOrderBy_ID_DESCApply,
      PRIMARY_KEY_ASC(queryBuilder) {
        postUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        postUniques[0].attributes.forEach(attributeName => {
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
