import { PgDeleteSingleStep, PgExecutor, PgResource, PgSelectSingleStep, PgSelectStep, TYPES, assertPgClassSingleStep, makeRegistry, pgClassExpression, pgDeleteSingle, pgFromExpression, pgInsertSingle, pgSelectFromRecord, pgSelectSingleFromRecord, pgUpdateSingle, recordCodec, sqlFromArgDigests, sqlValueWithCodec } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ObjectStep, __ValueStep, access, assertExecutableStep, bakedInput, bakedInputRuntime, connection, constant, context, createObjectAndApplyChildren, first, get as get2, inhibitOnNull, inspect, lambda, list, makeDecodeNodeId, makeGrafastSchema, object, operationPlan, rootValue, specFromNodeId, stepAMayDependOnStepB, trap } from "grafast";
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
const flambleIdentifier = sql.identifier("d", "flibble");
const flambleCodec = recordCodec({
  name: "flamble",
  identifier: flambleIdentifier,
  attributes: {
    __proto__: null,
    f: {
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
    isTableLike: false,
    pg: {
      serviceName: "main",
      schemaName: "d",
      name: "flibble"
    },
    tags: {
      __proto__: null,
      name: "flamble"
    }
  },
  executor: executor
});
const renamed_tableIdentifier = sql.identifier("d", "original_table");
const renamed_tableCodec = recordCodec({
  name: "renamed_table",
  identifier: renamed_tableIdentifier,
  attributes: {
    __proto__: null,
    col1: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {
          name: "colA"
        }
      }
    }
  },
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "d",
      name: "original_table"
    },
    tags: {
      __proto__: null,
      name: "renamed_table"
    }
  },
  executor: executor
});
const filmsIdentifier = sql.identifier("d", "films");
const filmsCodec = recordCodec({
  name: "films",
  identifier: filmsIdentifier,
  attributes: {
    __proto__: null,
    code: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    title: {
      description: undefined,
      codec: TYPES.varchar,
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
      schemaName: "d",
      name: "films"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const studiosIdentifier = sql.identifier("d", "studios");
const studiosCodec = recordCodec({
  name: "studios",
  identifier: studiosIdentifier,
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
    name: {
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
      schemaName: "d",
      name: "studios"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const postIdentifier = sql.identifier("d", "post");
const postCodec = recordCodec({
  name: "post",
  identifier: postIdentifier,
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
    body: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    author_id: {
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
      schemaName: "d",
      name: "post"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const tvEpisodesIdentifier = sql.identifier("d", "tv_episodes");
const tvEpisodesCodec = recordCodec({
  name: "tvEpisodes",
  identifier: tvEpisodesIdentifier,
  attributes: {
    __proto__: null,
    code: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    title: {
      description: undefined,
      codec: TYPES.varchar,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    show_id: {
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
      schemaName: "d",
      name: "tv_episodes"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const tvShowsIdentifier = sql.identifier("d", "tv_shows");
const spec_tvShows = {
  name: "tvShows",
  identifier: tvShowsIdentifier,
  attributes: {
    __proto__: null,
    code: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    title: {
      description: undefined,
      codec: TYPES.varchar,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    studio_id: {
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
      schemaName: "d",
      name: "tv_shows"
    },
    tags: {
      __proto__: null,
      omit: "order",
      behavior: ["-order -orderBy"]
    }
  },
  executor: executor
};
const tvShowsCodec = recordCodec(spec_tvShows);
const jwtTokenIdentifier = sql.identifier("d", "jwt_token");
const jwtTokenCodec = recordCodec({
  name: "jwtToken",
  identifier: jwtTokenIdentifier,
  attributes: {
    __proto__: null,
    role: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    exp: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    a: {
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
    isTableLike: false,
    pg: {
      serviceName: "main",
      schemaName: "d",
      name: "jwt_token"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const personIdentifier = sql.identifier("d", "person");
const personCodec = recordCodec({
  name: "person",
  identifier: personIdentifier,
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
    first_name: {
      description: undefined,
      codec: TYPES.varchar,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    last_name: {
      description: undefined,
      codec: TYPES.varchar,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    col_no_create: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: true,
      extensions: {
        tags: {
          omit: "create",
          behavior: ["-insert"]
        }
      }
    },
    col_no_update: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: true,
      extensions: {
        tags: {
          omit: "update",
          behavior: ["-update"]
        }
      }
    },
    col_no_order: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: true,
      extensions: {
        tags: {
          omit: "order",
          behavior: ["-order -orderBy"]
        }
      }
    },
    col_no_filter: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: true,
      extensions: {
        tags: {
          omit: "filter",
          behavior: ["-filter -filterBy"]
        }
      }
    },
    col_no_create_update: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: true,
      extensions: {
        tags: {
          omit: "create,update",
          behavior: ["-insert -update"]
        }
      }
    },
    col_no_create_update_order_filter: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: true,
      extensions: {
        tags: {
          omit: "create,update,order,filter",
          behavior: ["-insert -update -order -orderBy -filter -filterBy"]
        }
      }
    },
    col_no_anything: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: true,
      extensions: {
        tags: {
          omit: true,
          behavior: ["-insert -select -node -connection -list -array -single -update -delete -queryField -mutationField -typeField -filter -filterBy -order -orderBy -query:resource:list -query:resource:connection -singularRelation:resource:list -singularRelation:resource:connection -manyRelation:resource:list -manyRelation:resource:connection -manyToMany"]
        }
      }
    }
  },
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "d",
      name: "person"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const original_functionFunctionIdentifer = sql.identifier("d", "original_function");
const getflambleFunctionIdentifer = sql.identifier("d", "getflamble");
const filmsUniques = [{
  isPrimary: true,
  attributes: ["code"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const studiosUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const registryConfig_pgResources_studios_studios = {
  executor: executor,
  name: "studios",
  identifier: "main.d.studios",
  from: studiosIdentifier,
  codec: studiosCodec,
  uniques: studiosUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "d",
      name: "studios"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {}
  }
};
const postUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const registryConfig_pgResources_post_post = {
  executor: executor,
  name: "post",
  identifier: "main.d.post",
  from: postIdentifier,
  codec: postCodec,
  uniques: postUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "d",
      name: "post"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {}
  }
};
const tv_episodesUniques = [{
  isPrimary: true,
  attributes: ["code"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const registryConfig_pgResources_tv_episodes_tv_episodes = {
  executor: executor,
  name: "tv_episodes",
  identifier: "main.d.tv_episodes",
  from: tvEpisodesIdentifier,
  codec: tvEpisodesCodec,
  uniques: tv_episodesUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "d",
      name: "tv_episodes"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {}
  }
};
const tv_showsUniques = [{
  isPrimary: true,
  attributes: ["code"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const registryConfig_pgResources_tv_shows_tv_shows = {
  executor: executor,
  name: "tv_shows",
  identifier: "main.d.tv_shows",
  from: tvShowsIdentifier,
  codec: tvShowsCodec,
  uniques: tv_showsUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "d",
      name: "tv_shows"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {
      omit: "order",
      behavior: spec_tvShows.extensions.tags.behavior
    }
  }
};
const authenticateFunctionIdentifer = sql.identifier("d", "authenticate");
const person_full_nameFunctionIdentifer = sql.identifier("d", "person_full_name");
const search_postsFunctionIdentifer = sql.identifier("d", "search_posts");
const personUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null,
      fieldName: "findPersonById"
    }
  }
}];
const registryConfig_pgResources_person_person = {
  executor: executor,
  name: "person",
  identifier: "main.d.person",
  from: personIdentifier,
  codec: personCodec,
  uniques: personUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "d",
      name: "person"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {}
  }
};
const registry = makeRegistry({
  pgExecutors: {
    __proto__: null,
    main: executor
  },
  pgCodecs: {
    __proto__: null,
    int4: TYPES.int,
    flamble: flambleCodec,
    text: TYPES.text,
    renamed_table: renamed_tableCodec,
    films: filmsCodec,
    varchar: TYPES.varchar,
    studios: studiosCodec,
    post: postCodec,
    tvEpisodes: tvEpisodesCodec,
    tvShows: tvShowsCodec,
    jwtToken: jwtTokenCodec,
    person: personCodec,
    bpchar: TYPES.bpchar
  },
  pgResources: {
    __proto__: null,
    renamed_function: {
      executor,
      name: "renamed_function",
      identifier: "main.d.original_function()",
      from(...args) {
        return sql`${original_functionFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: false,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "d",
          name: "original_function"
        },
        tags: {
          name: "renamed_function"
        }
      },
      description: undefined
    },
    getflamble: PgResource.functionResourceOptions({
      executor: executor,
      name: "flamble",
      identifier: "main.d.flibble",
      from: flambleIdentifier,
      codec: flambleCodec,
      uniques: [],
      isVirtual: true,
      description: undefined,
      extensions: {
        description: undefined,
        pg: {
          serviceName: "main",
          schemaName: "d",
          name: "flibble"
        },
        isInsertable: false,
        isUpdatable: false,
        isDeletable: false,
        tags: {
          name: "flamble"
        }
      }
    }, {
      name: "getflamble",
      identifier: "main.d.getflamble()",
      from(...args) {
        return sql`${getflambleFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsArray: false,
      returnsSetof: true,
      isMutation: true,
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "d",
          name: "getflamble"
        },
        tags: {}
      },
      description: undefined
    }),
    renamed_table: {
      executor: executor,
      name: "renamed_table",
      identifier: "main.d.original_table",
      from: renamed_tableIdentifier,
      codec: renamed_tableCodec,
      uniques: [],
      isVirtual: false,
      description: undefined,
      extensions: {
        description: undefined,
        pg: {
          serviceName: "main",
          schemaName: "d",
          name: "original_table"
        },
        isInsertable: true,
        isUpdatable: true,
        isDeletable: true,
        tags: {
          name: "renamed_table"
        }
      }
    },
    films: {
      executor: executor,
      name: "films",
      identifier: "main.d.films",
      from: filmsIdentifier,
      codec: filmsCodec,
      uniques: filmsUniques,
      isVirtual: false,
      description: undefined,
      extensions: {
        description: undefined,
        pg: {
          serviceName: "main",
          schemaName: "d",
          name: "films"
        },
        isInsertable: true,
        isUpdatable: true,
        isDeletable: true,
        tags: {}
      }
    },
    studios: registryConfig_pgResources_studios_studios,
    post: registryConfig_pgResources_post_post,
    tv_episodes: registryConfig_pgResources_tv_episodes_tv_episodes,
    tv_shows: registryConfig_pgResources_tv_shows_tv_shows,
    login: PgResource.functionResourceOptions({
      executor: executor,
      name: "jwt_token",
      identifier: "main.d.jwt_token",
      from: jwtTokenIdentifier,
      codec: jwtTokenCodec,
      uniques: [],
      isVirtual: true,
      description: undefined,
      extensions: {
        description: undefined,
        pg: {
          serviceName: "main",
          schemaName: "d",
          name: "jwt_token"
        },
        isInsertable: false,
        isUpdatable: false,
        isDeletable: false,
        tags: {}
      }
    }, {
      name: "login",
      identifier: "main.d.authenticate(int4)",
      from(...args) {
        return sql`${authenticateFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "a",
        required: true,
        notNull: false,
        codec: TYPES.int
      }],
      returnsArray: false,
      returnsSetof: false,
      isMutation: true,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "d",
          name: "authenticate"
        },
        tags: {
          name: "login",
          resultFieldName: "token"
        }
      },
      description: undefined
    }),
    person_full_name: {
      executor,
      name: "person_full_name",
      identifier: "main.d.person_full_name(d.person)",
      from(...args) {
        return sql`${person_full_nameFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "n",
        required: true,
        notNull: false,
        codec: personCodec,
        extensions: {
          variant: "nodeId"
        }
      }],
      isUnique: !false,
      codec: TYPES.varchar,
      uniques: [],
      isMutation: false,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "d",
          name: "person_full_name"
        },
        tags: {
          fieldName: "name",
          behavior: "+queryField",
          arg0variant: "nodeId"
        }
      },
      description: undefined
    },
    returnPostsMatching: PgResource.functionResourceOptions(registryConfig_pgResources_post_post, {
      name: "returnPostsMatching",
      identifier: "main.d.search_posts(text)",
      from(...args) {
        return sql`${search_postsFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "search",
        required: true,
        notNull: false,
        codec: TYPES.text
      }],
      returnsArray: false,
      returnsSetof: true,
      isMutation: false,
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "d",
          name: "search_posts"
        },
        tags: {
          name: "returnPostsMatching"
        }
      },
      description: undefined
    }),
    person: registryConfig_pgResources_person_person
  },
  pgRelations: {
    __proto__: null,
    person: {
      __proto__: null,
      posts: {
        localCodec: personCodec,
        remoteResourceOptions: registryConfig_pgResources_post_post,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["author_id"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            foreignFieldName: "posts",
            fieldName: "author",
            behavior: []
          }
        }
      }
    },
    post: {
      __proto__: null,
      author: {
        localCodec: postCodec,
        remoteResourceOptions: registryConfig_pgResources_person_person,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["author_id"],
        remoteAttributes: ["id"],
        isUnique: true,
        isReferencee: false,
        description: undefined,
        extensions: {
          tags: {
            foreignFieldName: "posts",
            fieldName: "author",
            behavior: []
          }
        }
      }
    },
    studios: {
      __proto__: null,
      tvShowsByTheirStudioId: {
        localCodec: studiosCodec,
        remoteResourceOptions: registryConfig_pgResources_tv_shows_tv_shows,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["studio_id"],
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
    tvEpisodes: {
      __proto__: null,
      tvShowsByMyShowId: {
        localCodec: tvEpisodesCodec,
        remoteResourceOptions: registryConfig_pgResources_tv_shows_tv_shows,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["show_id"],
        remoteAttributes: ["code"],
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
    tvShows: {
      __proto__: null,
      studiosByMyStudioId: {
        localCodec: tvShowsCodec,
        remoteResourceOptions: registryConfig_pgResources_studios_studios,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["studio_id"],
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
      tvEpisodesByTheirShowId: {
        localCodec: tvShowsCodec,
        remoteResourceOptions: registryConfig_pgResources_tv_episodes_tv_episodes,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["code"],
        remoteAttributes: ["show_id"],
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
const resource_filmsPgResource = registry.pgResources["films"];
const resource_studiosPgResource = registry.pgResources["studios"];
const resource_postPgResource = registry.pgResources["post"];
const resource_tv_episodesPgResource = registry.pgResources["tv_episodes"];
const resource_tv_showsPgResource = registry.pgResources["tv_shows"];
const resource_personPgResource = registry.pgResources["person"];
const EMPTY_ARRAY = [];
const makeArgs_person_full_name = () => EMPTY_ARRAY;
const resource_renamed_functionPgResource = registry.pgResources["renamed_function"];
const nodeIdHandler_Person = {
  typeName: "Person",
  codec: nodeIdCodecs_base64JSON_base64JSON,
  deprecationReason: undefined,
  plan($record) {
    return list([constant("people", false), $record.get("id")]);
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
    return resource_personPgResource.get(spec);
  },
  match(obj) {
    return obj[0] === "people";
  }
};
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
const getSpec = $nodeId => {
  // TODO: should change this to a common method like
  // `const $decoded = getDecodedNodeIdForHandler(handler, $nodeId)`
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Person));
  return nodeIdHandler_Person.getSpec($decoded);
};
const argDetailsSimple_person_full_name = [{
  graphqlArgName: "n",
  postgresArgName: "n",
  pgCodec: personCodec,
  required: true,
  fetcher($nodeId) {
    return resource_personPgResource.get(getSpec($nodeId));
  }
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
const makeArgs_person_full_name2 = (args, path = []) => argDetailsSimple_person_full_name.map(details => makeArg(path, args, details));
const resource_person_full_namePgResource = registry.pgResources["person_full_name"];
const argDetailsSimple_returnPostsMatching = [{
  graphqlArgName: "search",
  postgresArgName: "search",
  pgCodec: TYPES.text,
  required: true,
  fetcher: null
}];
const makeArgs_returnPostsMatching = (args, path = []) => argDetailsSimple_returnPostsMatching.map(details => makeArg(path, args, details));
const resource_returnPostsMatchingPgResource = registry.pgResources["returnPostsMatching"];
const getSelectPlanFromParentAndArgs = ($root, args, _info) => {
  const selectArgs = makeArgs_returnPostsMatching(args);
  return resource_returnPostsMatchingPgResource.execute(selectArgs);
};
const nodeIdHandler_Film = {
  typeName: "Film",
  codec: nodeIdCodecs_base64JSON_base64JSON,
  deprecationReason: undefined,
  plan($record) {
    return list([constant("films", false), $record.get("code")]);
  },
  getSpec($list) {
    return {
      code: inhibitOnNull(access($list, [1]))
    };
  },
  getIdentifiers(value) {
    return value.slice(1);
  },
  get(spec) {
    return resource_filmsPgResource.get(spec);
  },
  match(obj) {
    return obj[0] === "films";
  }
};
const nodeFetcher_Film = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Film));
  return nodeIdHandler_Film.get(nodeIdHandler_Film.getSpec($decoded));
};
const nodeIdHandler_Studio = {
  typeName: "Studio",
  codec: nodeIdCodecs_base64JSON_base64JSON,
  deprecationReason: undefined,
  plan($record) {
    return list([constant("studios", false), $record.get("id")]);
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
    return resource_studiosPgResource.get(spec);
  },
  match(obj) {
    return obj[0] === "studios";
  }
};
const nodeFetcher_Studio = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Studio));
  return nodeIdHandler_Studio.get(nodeIdHandler_Studio.getSpec($decoded));
};
const nodeIdHandler_Post = {
  typeName: "Post",
  codec: nodeIdCodecs_base64JSON_base64JSON,
  deprecationReason: undefined,
  plan($record) {
    return list([constant("posts", false), $record.get("id")]);
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
    return resource_postPgResource.get(spec);
  },
  match(obj) {
    return obj[0] === "posts";
  }
};
const nodeFetcher_Post = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Post));
  return nodeIdHandler_Post.get(nodeIdHandler_Post.getSpec($decoded));
};
const nodeIdHandler_TvEpisode = {
  typeName: "TvEpisode",
  codec: nodeIdCodecs_base64JSON_base64JSON,
  deprecationReason: undefined,
  plan($record) {
    return list([constant("tv_episodes", false), $record.get("code")]);
  },
  getSpec($list) {
    return {
      code: inhibitOnNull(access($list, [1]))
    };
  },
  getIdentifiers(value) {
    return value.slice(1);
  },
  get(spec) {
    return resource_tv_episodesPgResource.get(spec);
  },
  match(obj) {
    return obj[0] === "tv_episodes";
  }
};
const nodeFetcher_TvEpisode = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_TvEpisode));
  return nodeIdHandler_TvEpisode.get(nodeIdHandler_TvEpisode.getSpec($decoded));
};
const nodeIdHandler_TvShow = {
  typeName: "TvShow",
  codec: nodeIdCodecs_base64JSON_base64JSON,
  deprecationReason: undefined,
  plan($record) {
    return list([constant("tv_shows", false), $record.get("code")]);
  },
  getSpec($list) {
    return {
      code: inhibitOnNull(access($list, [1]))
    };
  },
  getIdentifiers(value) {
    return value.slice(1);
  },
  get(spec) {
    return resource_tv_showsPgResource.get(spec);
  },
  match(obj) {
    return obj[0] === "tv_shows";
  }
};
const nodeFetcher_TvShow = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_TvShow));
  return nodeIdHandler_TvShow.get(nodeIdHandler_TvShow.getSpec($decoded));
};
const nodeFetcher_Person = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Person));
  return nodeIdHandler_Person.get(nodeIdHandler_Person.getSpec($decoded));
};
const resource_renamed_tablePgResource = registry.pgResources["renamed_table"];
function qbWhereBuilder(qb) {
  return qb.whereBuilder();
}
const nodeIdHandlerByTypeName = {
  __proto__: null,
  Query: nodeIdHandler_Query,
  Film: nodeIdHandler_Film,
  Studio: nodeIdHandler_Studio,
  Post: nodeIdHandler_Post,
  TvEpisode: nodeIdHandler_TvEpisode,
  TvShow: nodeIdHandler_TvShow,
  Person: nodeIdHandler_Person
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
const resource_getflamblePgResource = registry.pgResources["getflamble"];
const argDetailsSimple_login = [{
  graphqlArgName: "a",
  postgresArgName: "a",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs_login = (args, path = []) => argDetailsSimple_login.map(details => makeArg(path, args, details));
const resource_loginPgResource = registry.pgResources["login"];
const specFromArgs_Film = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Film, $nodeId);
};
const specFromArgs_Studio = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Studio, $nodeId);
};
const specFromArgs_Post = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Post, $nodeId);
};
const specFromArgs_TvEpisode = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_TvEpisode, $nodeId);
};
const specFromArgs_TvShow = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_TvShow, $nodeId);
};
const specFromArgs_Person = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Person, $nodeId);
};
const specFromArgs_Film2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Film, $nodeId);
};
const specFromArgs_Studio2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Studio, $nodeId);
};
const specFromArgs_Post2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Post, $nodeId);
};
const specFromArgs_TvEpisode2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_TvEpisode, $nodeId);
};
const specFromArgs_TvShow2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_TvShow, $nodeId);
};
const specFromArgs_Person2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Person, $nodeId);
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

  """Get a single \`Film\`."""
  filmByCode(code: Int!): Film

  """Get a single \`Studio\`."""
  studioById(id: Int!): Studio

  """Get a single \`Post\`."""
  postById(id: Int!): Post

  """Get a single \`TvEpisode\`."""
  tvEpisodeByCode(code: Int!): TvEpisode

  """Get a single \`TvShow\`."""
  tvShowByCode(code: Int!): TvShow

  """Get a single \`Person\`."""
  findPersonById(id: Int!): Person
  renamedFunction: Int
  personFullName(n: ID): String

  """Reads and enables pagination through a set of \`Post\`."""
  returnPostsMatching(
    search: String

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
  ): PostsConnection

  """Reads a single \`Film\` using its globally unique \`ID\`."""
  film(
    """The globally unique \`ID\` to be used in selecting a single \`Film\`."""
    nodeId: ID!
  ): Film

  """Reads a single \`Studio\` using its globally unique \`ID\`."""
  studio(
    """The globally unique \`ID\` to be used in selecting a single \`Studio\`."""
    nodeId: ID!
  ): Studio

  """Reads a single \`Post\` using its globally unique \`ID\`."""
  post(
    """The globally unique \`ID\` to be used in selecting a single \`Post\`."""
    nodeId: ID!
  ): Post

  """Reads a single \`TvEpisode\` using its globally unique \`ID\`."""
  tvEpisode(
    """The globally unique \`ID\` to be used in selecting a single \`TvEpisode\`."""
    nodeId: ID!
  ): TvEpisode

  """Reads a single \`TvShow\` using its globally unique \`ID\`."""
  tvShow(
    """The globally unique \`ID\` to be used in selecting a single \`TvShow\`."""
    nodeId: ID!
  ): TvShow

  """Reads a single \`Person\` using its globally unique \`ID\`."""
  person(
    """The globally unique \`ID\` to be used in selecting a single \`Person\`."""
    nodeId: ID!
  ): Person

  """Reads and enables pagination through a set of \`RenamedTable\`."""
  allRenamedTables(
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
    condition: RenamedTableCondition

    """The method to use when ordering \`RenamedTable\`."""
    orderBy: [RenamedTablesOrderBy!] = [NATURAL]
  ): RenamedTablesConnection

  """Reads and enables pagination through a set of \`Film\`."""
  allFilms(
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
    condition: FilmCondition

    """The method to use when ordering \`Film\`."""
    orderBy: [FilmsOrderBy!] = [PRIMARY_KEY_ASC]
  ): FilmsConnection

  """Reads and enables pagination through a set of \`Studio\`."""
  allStudios(
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
    condition: StudioCondition

    """The method to use when ordering \`Studio\`."""
    orderBy: [StudiosOrderBy!] = [PRIMARY_KEY_ASC]
  ): StudiosConnection

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

  """Reads and enables pagination through a set of \`TvEpisode\`."""
  allTvEpisodes(
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
    condition: TvEpisodeCondition

    """The method to use when ordering \`TvEpisode\`."""
    orderBy: [TvEpisodesOrderBy!] = [PRIMARY_KEY_ASC]
  ): TvEpisodesConnection

  """Reads and enables pagination through a set of \`TvShow\`."""
  allTvShows(
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
    condition: TvShowCondition
  ): TvShowsConnection

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
}

"""An object with a globally unique \`ID\`."""
interface Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
}

type Film implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  code: Int!
  title: String
}

type Studio implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  name: String

  """Reads and enables pagination through a set of \`TvShow\`."""
  tvShowsByStudioId(
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
    condition: TvShowCondition
  ): TvShowsConnection!
}

"""A connection to a list of \`TvShow\` values."""
type TvShowsConnection {
  """A list of \`TvShow\` objects."""
  nodes: [TvShow]!

  """
  A list of edges which contains the \`TvShow\` and cursor to aid in pagination.
  """
  edges: [TvShowsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`TvShow\` you could get from the connection."""
  totalCount: Int!
}

type TvShow implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  code: Int!
  title: String
  studioId: Int

  """Reads a single \`Studio\` that is related to this \`TvShow\`."""
  studioByStudioId: Studio

  """Reads and enables pagination through a set of \`TvEpisode\`."""
  tvEpisodesByShowId(
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
    condition: TvEpisodeCondition

    """The method to use when ordering \`TvEpisode\`."""
    orderBy: [TvEpisodesOrderBy!] = [PRIMARY_KEY_ASC]
  ): TvEpisodesConnection!
}

"""A connection to a list of \`TvEpisode\` values."""
type TvEpisodesConnection {
  """A list of \`TvEpisode\` objects."""
  nodes: [TvEpisode]!

  """
  A list of edges which contains the \`TvEpisode\` and cursor to aid in pagination.
  """
  edges: [TvEpisodesEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`TvEpisode\` you could get from the connection."""
  totalCount: Int!
}

type TvEpisode implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  code: Int!
  title: String
  showId: Int

  """Reads a single \`TvShow\` that is related to this \`TvEpisode\`."""
  tvShowByShowId: TvShow
}

"""A \`TvEpisode\` edge in the connection."""
type TvEpisodesEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`TvEpisode\` at the end of the edge."""
  node: TvEpisode
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
A condition to be used against \`TvEpisode\` object types. All fields are tested
for equality and combined with a logical ‘and.’
"""
input TvEpisodeCondition {
  """Checks for equality with the object’s \`code\` field."""
  code: Int

  """Checks for equality with the object’s \`title\` field."""
  title: String

  """Checks for equality with the object’s \`showId\` field."""
  showId: Int
}

"""Methods to use when ordering \`TvEpisode\`."""
enum TvEpisodesOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  CODE_ASC
  CODE_DESC
  TITLE_ASC
  TITLE_DESC
  SHOW_ID_ASC
  SHOW_ID_DESC
}

"""A \`TvShow\` edge in the connection."""
type TvShowsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`TvShow\` at the end of the edge."""
  node: TvShow
}

"""
A condition to be used against \`TvShow\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input TvShowCondition {
  """Checks for equality with the object’s \`code\` field."""
  code: Int

  """Checks for equality with the object’s \`title\` field."""
  title: String

  """Checks for equality with the object’s \`studioId\` field."""
  studioId: Int
}

type Post implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  body: String
  authorId: Int

  """Reads a single \`Person\` that is related to this \`Post\`."""
  author: Person
}

type Person implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  name: String
  id: Int!
  firstName: String
  lastName: String
  colNoCreate: String
  colNoUpdate: String
  colNoOrder: String
  colNoFilter: String
  colNoCreateUpdate: String
  colNoCreateUpdateOrderFilter: String

  """Reads and enables pagination through a set of \`Post\`."""
  posts(
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
  id: Int

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
  BODY_ASC
  BODY_DESC
  AUTHOR_ID_ASC
  AUTHOR_ID_DESC
}

"""A connection to a list of \`RenamedTable\` values."""
type RenamedTablesConnection {
  """A list of \`RenamedTable\` objects."""
  nodes: [RenamedTable]!

  """
  A list of edges which contains the \`RenamedTable\` and cursor to aid in pagination.
  """
  edges: [RenamedTablesEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`RenamedTable\` you could get from the connection."""
  totalCount: Int!
}

type RenamedTable {
  colA: Int
}

"""A \`RenamedTable\` edge in the connection."""
type RenamedTablesEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`RenamedTable\` at the end of the edge."""
  node: RenamedTable
}

"""
A condition to be used against \`RenamedTable\` object types. All fields are
tested for equality and combined with a logical ‘and.’
"""
input RenamedTableCondition {
  """Checks for equality with the object’s \`colA\` field."""
  colA: Int
}

"""Methods to use when ordering \`RenamedTable\`."""
enum RenamedTablesOrderBy {
  NATURAL
  COL_A_ASC
  COL_A_DESC
}

"""A connection to a list of \`Film\` values."""
type FilmsConnection {
  """A list of \`Film\` objects."""
  nodes: [Film]!

  """
  A list of edges which contains the \`Film\` and cursor to aid in pagination.
  """
  edges: [FilmsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Film\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Film\` edge in the connection."""
type FilmsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Film\` at the end of the edge."""
  node: Film
}

"""
A condition to be used against \`Film\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input FilmCondition {
  """Checks for equality with the object’s \`code\` field."""
  code: Int

  """Checks for equality with the object’s \`title\` field."""
  title: String
}

"""Methods to use when ordering \`Film\`."""
enum FilmsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  CODE_ASC
  CODE_DESC
  TITLE_ASC
  TITLE_DESC
}

"""A connection to a list of \`Studio\` values."""
type StudiosConnection {
  """A list of \`Studio\` objects."""
  nodes: [Studio]!

  """
  A list of edges which contains the \`Studio\` and cursor to aid in pagination.
  """
  edges: [StudiosEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Studio\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Studio\` edge in the connection."""
type StudiosEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Studio\` at the end of the edge."""
  node: Studio
}

"""
A condition to be used against \`Studio\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input StudioCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`name\` field."""
  name: String
}

"""Methods to use when ordering \`Studio\`."""
enum StudiosOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  NAME_ASC
  NAME_DESC
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

  """Checks for equality with the object’s \`firstName\` field."""
  firstName: String

  """Checks for equality with the object’s \`lastName\` field."""
  lastName: String

  """Checks for equality with the object’s \`colNoCreate\` field."""
  colNoCreate: String

  """Checks for equality with the object’s \`colNoUpdate\` field."""
  colNoUpdate: String

  """Checks for equality with the object’s \`colNoOrder\` field."""
  colNoOrder: String

  """Checks for equality with the object’s \`colNoCreateUpdate\` field."""
  colNoCreateUpdate: String
}

"""Methods to use when ordering \`Person\`."""
enum PeopleOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  FIRST_NAME_ASC
  FIRST_NAME_DESC
  LAST_NAME_ASC
  LAST_NAME_DESC
  COL_NO_CREATE_ASC
  COL_NO_CREATE_DESC
  COL_NO_UPDATE_ASC
  COL_NO_UPDATE_DESC
  COL_NO_FILTER_ASC
  COL_NO_FILTER_DESC
  COL_NO_CREATE_UPDATE_ASC
  COL_NO_CREATE_UPDATE_DESC
}

"""
The root mutation type which contains root level fields which mutate data.
"""
type Mutation {
  getflamble(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: GetflambleInput!
  ): GetflamblePayload
  login(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: LoginInput!
  ): LoginPayload

  """Creates a single \`RenamedTable\`."""
  createRenamedTable(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateRenamedTableInput!
  ): CreateRenamedTablePayload

  """Creates a single \`Film\`."""
  createFilm(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateFilmInput!
  ): CreateFilmPayload

  """Creates a single \`Studio\`."""
  createStudio(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateStudioInput!
  ): CreateStudioPayload

  """Creates a single \`Post\`."""
  createPost(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreatePostInput!
  ): CreatePostPayload

  """Creates a single \`TvEpisode\`."""
  createTvEpisode(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateTvEpisodeInput!
  ): CreateTvEpisodePayload

  """Creates a single \`TvShow\`."""
  createTvShow(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateTvShowInput!
  ): CreateTvShowPayload

  """Creates a single \`Person\`."""
  createPerson(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreatePersonInput!
  ): CreatePersonPayload

  """Updates a single \`Film\` using its globally unique id and a patch."""
  updateFilm(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateFilmInput!
  ): UpdateFilmPayload

  """Updates a single \`Film\` using a unique key and a patch."""
  updateFilmByCode(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateFilmByCodeInput!
  ): UpdateFilmPayload

  """Updates a single \`Studio\` using its globally unique id and a patch."""
  updateStudio(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateStudioInput!
  ): UpdateStudioPayload

  """Updates a single \`Studio\` using a unique key and a patch."""
  updateStudioById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateStudioByIdInput!
  ): UpdateStudioPayload

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

  """Updates a single \`TvEpisode\` using its globally unique id and a patch."""
  updateTvEpisode(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateTvEpisodeInput!
  ): UpdateTvEpisodePayload

  """Updates a single \`TvEpisode\` using a unique key and a patch."""
  updateTvEpisodeByCode(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateTvEpisodeByCodeInput!
  ): UpdateTvEpisodePayload

  """Updates a single \`TvShow\` using its globally unique id and a patch."""
  updateTvShow(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateTvShowInput!
  ): UpdateTvShowPayload

  """Updates a single \`TvShow\` using a unique key and a patch."""
  updateTvShowByCode(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateTvShowByCodeInput!
  ): UpdateTvShowPayload

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

  """Deletes a single \`Film\` using its globally unique id."""
  deleteFilm(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteFilmInput!
  ): DeleteFilmPayload

  """Deletes a single \`Film\` using a unique key."""
  deleteFilmByCode(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteFilmByCodeInput!
  ): DeleteFilmPayload

  """Deletes a single \`Studio\` using its globally unique id."""
  deleteStudio(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteStudioInput!
  ): DeleteStudioPayload

  """Deletes a single \`Studio\` using a unique key."""
  deleteStudioById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteStudioByIdInput!
  ): DeleteStudioPayload

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

  """Deletes a single \`TvEpisode\` using its globally unique id."""
  deleteTvEpisode(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteTvEpisodeInput!
  ): DeleteTvEpisodePayload

  """Deletes a single \`TvEpisode\` using a unique key."""
  deleteTvEpisodeByCode(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteTvEpisodeByCodeInput!
  ): DeleteTvEpisodePayload

  """Deletes a single \`TvShow\` using its globally unique id."""
  deleteTvShow(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteTvShowInput!
  ): DeleteTvShowPayload

  """Deletes a single \`TvShow\` using a unique key."""
  deleteTvShowByCode(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteTvShowByCodeInput!
  ): DeleteTvShowPayload

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
}

"""The output of our \`getflamble\` mutation."""
type GetflamblePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  flambles: [Flamble]

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

type Flamble {
  f: String
}

"""All input for the \`getflamble\` mutation."""
input GetflambleInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
}

"""The output of our \`login\` mutation."""
type LoginPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  token: JwtToken

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

type JwtToken {
  role: String
  exp: Int
  a: Int
}

"""All input for the \`login\` mutation."""
input LoginInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  a: Int
}

"""The output of our create \`RenamedTable\` mutation."""
type CreateRenamedTablePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`RenamedTable\` that was created by this mutation."""
  renamedTable: RenamedTable

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the create \`RenamedTable\` mutation."""
input CreateRenamedTableInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`RenamedTable\` to be created by this mutation."""
  renamedTable: RenamedTableInput!
}

"""An input for mutations affecting \`RenamedTable\`"""
input RenamedTableInput {
  colA: Int
}

"""The output of our create \`Film\` mutation."""
type CreateFilmPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Film\` that was created by this mutation."""
  film: Film

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Film\`. May be used by Relay 1."""
  filmEdge(
    """The method to use when ordering \`Film\`."""
    orderBy: [FilmsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): FilmsEdge
}

"""All input for the create \`Film\` mutation."""
input CreateFilmInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`Film\` to be created by this mutation."""
  film: FilmInput!
}

"""An input for mutations affecting \`Film\`"""
input FilmInput {
  code: Int!
  title: String
}

"""The output of our create \`Studio\` mutation."""
type CreateStudioPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Studio\` that was created by this mutation."""
  studio: Studio

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Studio\`. May be used by Relay 1."""
  studioEdge(
    """The method to use when ordering \`Studio\`."""
    orderBy: [StudiosOrderBy!]! = [PRIMARY_KEY_ASC]
  ): StudiosEdge
}

"""All input for the create \`Studio\` mutation."""
input CreateStudioInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`Studio\` to be created by this mutation."""
  studio: StudioInput!
}

"""An input for mutations affecting \`Studio\`"""
input StudioInput {
  id: Int!
  name: String
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

  """Reads a single \`Person\` that is related to this \`Post\`."""
  author: Person
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
  id: Int
  body: String
  authorId: Int
}

"""The output of our create \`TvEpisode\` mutation."""
type CreateTvEpisodePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`TvEpisode\` that was created by this mutation."""
  tvEpisode: TvEpisode

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`TvEpisode\`. May be used by Relay 1."""
  tvEpisodeEdge(
    """The method to use when ordering \`TvEpisode\`."""
    orderBy: [TvEpisodesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): TvEpisodesEdge

  """Reads a single \`TvShow\` that is related to this \`TvEpisode\`."""
  tvShowByShowId: TvShow
}

"""All input for the create \`TvEpisode\` mutation."""
input CreateTvEpisodeInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`TvEpisode\` to be created by this mutation."""
  tvEpisode: TvEpisodeInput!
}

"""An input for mutations affecting \`TvEpisode\`"""
input TvEpisodeInput {
  code: Int!
  title: String
  showId: Int
}

"""The output of our create \`TvShow\` mutation."""
type CreateTvShowPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`TvShow\` that was created by this mutation."""
  tvShow: TvShow

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """Reads a single \`Studio\` that is related to this \`TvShow\`."""
  studioByStudioId: Studio
}

"""All input for the create \`TvShow\` mutation."""
input CreateTvShowInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`TvShow\` to be created by this mutation."""
  tvShow: TvShowInput!
}

"""An input for mutations affecting \`TvShow\`"""
input TvShowInput {
  code: Int!
  title: String
  studioId: Int
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
  id: Int
  firstName: String
  lastName: String
  colNoUpdate: String
  colNoOrder: String
  colNoFilter: String
}

"""The output of our update \`Film\` mutation."""
type UpdateFilmPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Film\` that was updated by this mutation."""
  film: Film

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Film\`. May be used by Relay 1."""
  filmEdge(
    """The method to use when ordering \`Film\`."""
    orderBy: [FilmsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): FilmsEdge
}

"""All input for the \`updateFilm\` mutation."""
input UpdateFilmInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Film\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`Film\` being updated.
  """
  filmPatch: FilmPatch!
}

"""Represents an update to a \`Film\`. Fields that are set will be updated."""
input FilmPatch {
  code: Int
  title: String
}

"""All input for the \`updateFilmByCode\` mutation."""
input UpdateFilmByCodeInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  code: Int!

  """
  An object where the defined keys will be set on the \`Film\` being updated.
  """
  filmPatch: FilmPatch!
}

"""The output of our update \`Studio\` mutation."""
type UpdateStudioPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Studio\` that was updated by this mutation."""
  studio: Studio

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Studio\`. May be used by Relay 1."""
  studioEdge(
    """The method to use when ordering \`Studio\`."""
    orderBy: [StudiosOrderBy!]! = [PRIMARY_KEY_ASC]
  ): StudiosEdge
}

"""All input for the \`updateStudio\` mutation."""
input UpdateStudioInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Studio\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`Studio\` being updated.
  """
  studioPatch: StudioPatch!
}

"""
Represents an update to a \`Studio\`. Fields that are set will be updated.
"""
input StudioPatch {
  id: Int
  name: String
}

"""All input for the \`updateStudioById\` mutation."""
input UpdateStudioByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`Studio\` being updated.
  """
  studioPatch: StudioPatch!
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

  """Reads a single \`Person\` that is related to this \`Post\`."""
  author: Person
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
  id: Int
  body: String
  authorId: Int
}

"""All input for the \`updatePostById\` mutation."""
input UpdatePostByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`Post\` being updated.
  """
  postPatch: PostPatch!
}

"""The output of our update \`TvEpisode\` mutation."""
type UpdateTvEpisodePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`TvEpisode\` that was updated by this mutation."""
  tvEpisode: TvEpisode

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`TvEpisode\`. May be used by Relay 1."""
  tvEpisodeEdge(
    """The method to use when ordering \`TvEpisode\`."""
    orderBy: [TvEpisodesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): TvEpisodesEdge

  """Reads a single \`TvShow\` that is related to this \`TvEpisode\`."""
  tvShowByShowId: TvShow
}

"""All input for the \`updateTvEpisode\` mutation."""
input UpdateTvEpisodeInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`TvEpisode\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`TvEpisode\` being updated.
  """
  tvEpisodePatch: TvEpisodePatch!
}

"""
Represents an update to a \`TvEpisode\`. Fields that are set will be updated.
"""
input TvEpisodePatch {
  code: Int
  title: String
  showId: Int
}

"""All input for the \`updateTvEpisodeByCode\` mutation."""
input UpdateTvEpisodeByCodeInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  code: Int!

  """
  An object where the defined keys will be set on the \`TvEpisode\` being updated.
  """
  tvEpisodePatch: TvEpisodePatch!
}

"""The output of our update \`TvShow\` mutation."""
type UpdateTvShowPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`TvShow\` that was updated by this mutation."""
  tvShow: TvShow

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """Reads a single \`Studio\` that is related to this \`TvShow\`."""
  studioByStudioId: Studio
}

"""All input for the \`updateTvShow\` mutation."""
input UpdateTvShowInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`TvShow\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`TvShow\` being updated.
  """
  tvShowPatch: TvShowPatch!
}

"""
Represents an update to a \`TvShow\`. Fields that are set will be updated.
"""
input TvShowPatch {
  code: Int
  title: String
  studioId: Int
}

"""All input for the \`updateTvShowByCode\` mutation."""
input UpdateTvShowByCodeInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  code: Int!

  """
  An object where the defined keys will be set on the \`TvShow\` being updated.
  """
  tvShowPatch: TvShowPatch!
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
  id: Int
  firstName: String
  lastName: String
  colNoCreate: String
  colNoOrder: String
  colNoFilter: String
}

"""All input for the \`updatePersonById\` mutation."""
input UpdatePersonByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`Person\` being updated.
  """
  personPatch: PersonPatch!
}

"""The output of our delete \`Film\` mutation."""
type DeleteFilmPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Film\` that was deleted by this mutation."""
  film: Film
  deletedFilmId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Film\`. May be used by Relay 1."""
  filmEdge(
    """The method to use when ordering \`Film\`."""
    orderBy: [FilmsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): FilmsEdge
}

"""All input for the \`deleteFilm\` mutation."""
input DeleteFilmInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Film\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteFilmByCode\` mutation."""
input DeleteFilmByCodeInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  code: Int!
}

"""The output of our delete \`Studio\` mutation."""
type DeleteStudioPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Studio\` that was deleted by this mutation."""
  studio: Studio
  deletedStudioId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Studio\`. May be used by Relay 1."""
  studioEdge(
    """The method to use when ordering \`Studio\`."""
    orderBy: [StudiosOrderBy!]! = [PRIMARY_KEY_ASC]
  ): StudiosEdge
}

"""All input for the \`deleteStudio\` mutation."""
input DeleteStudioInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Studio\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteStudioById\` mutation."""
input DeleteStudioByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!
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
  deletedPostId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Post\`. May be used by Relay 1."""
  postEdge(
    """The method to use when ordering \`Post\`."""
    orderBy: [PostsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PostsEdge

  """Reads a single \`Person\` that is related to this \`Post\`."""
  author: Person
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
  id: Int!
}

"""The output of our delete \`TvEpisode\` mutation."""
type DeleteTvEpisodePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`TvEpisode\` that was deleted by this mutation."""
  tvEpisode: TvEpisode
  deletedTvEpisodeId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`TvEpisode\`. May be used by Relay 1."""
  tvEpisodeEdge(
    """The method to use when ordering \`TvEpisode\`."""
    orderBy: [TvEpisodesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): TvEpisodesEdge

  """Reads a single \`TvShow\` that is related to this \`TvEpisode\`."""
  tvShowByShowId: TvShow
}

"""All input for the \`deleteTvEpisode\` mutation."""
input DeleteTvEpisodeInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`TvEpisode\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteTvEpisodeByCode\` mutation."""
input DeleteTvEpisodeByCodeInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  code: Int!
}

"""The output of our delete \`TvShow\` mutation."""
type DeleteTvShowPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`TvShow\` that was deleted by this mutation."""
  tvShow: TvShow
  deletedTvShowId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """Reads a single \`Studio\` that is related to this \`TvShow\`."""
  studioByStudioId: Studio
}

"""All input for the \`deleteTvShow\` mutation."""
input DeleteTvShowInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`TvShow\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteTvShowByCode\` mutation."""
input DeleteTvShowByCodeInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  code: Int!
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
  id: Int!
}`;
export const objects = {
  Query: {
    assertStep() {
      return true;
    },
    plans: {
      allFilms: {
        plan() {
          return connection(resource_filmsPgResource.find());
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
      allPeople: {
        plan() {
          return connection(resource_personPgResource.find());
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
          return connection(resource_postPgResource.find());
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
      allRenamedTables: {
        plan() {
          return connection(resource_renamed_tablePgResource.find());
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
      allStudios: {
        plan() {
          return connection(resource_studiosPgResource.find());
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
      allTvEpisodes: {
        plan() {
          return connection(resource_tv_episodesPgResource.find());
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
      allTvShows: {
        plan() {
          return connection(resource_tv_showsPgResource.find());
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
          }
        }
      },
      film(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_Film($nodeId);
      },
      filmByCode(_$root, {
        $code
      }) {
        return resource_filmsPgResource.get({
          code: $code
        });
      },
      findPersonById(_$root, {
        $id
      }) {
        return resource_personPgResource.get({
          id: $id
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
      personFullName($root, args, _info) {
        const selectArgs = makeArgs_person_full_name2(args);
        return resource_person_full_namePgResource.execute(selectArgs);
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
        return rootValue();
      },
      renamedFunction($root, args, _info) {
        const selectArgs = makeArgs_person_full_name(args);
        return resource_renamed_functionPgResource.execute(selectArgs);
      },
      returnPostsMatching: {
        plan($parent, args, info) {
          const $select = getSelectPlanFromParentAndArgs($parent, args, info);
          return connection($select);
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
          }
        }
      },
      studio(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_Studio($nodeId);
      },
      studioById(_$root, {
        $id
      }) {
        return resource_studiosPgResource.get({
          id: $id
        });
      },
      tvEpisode(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_TvEpisode($nodeId);
      },
      tvEpisodeByCode(_$root, {
        $code
      }) {
        return resource_tv_episodesPgResource.get({
          code: $code
        });
      },
      tvShow(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_TvShow($nodeId);
      },
      tvShowByCode(_$root, {
        $code
      }) {
        return resource_tv_showsPgResource.get({
          code: $code
        });
      }
    }
  },
  Mutation: {
    assertStep: __ValueStep,
    plans: {
      createFilm: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_filmsPgResource, Object.create(null));
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
      createPerson: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_personPgResource, Object.create(null));
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
          const $insert = pgInsertSingle(resource_postPgResource, Object.create(null));
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
      createRenamedTable: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_renamed_tablePgResource, Object.create(null));
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
      createStudio: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_studiosPgResource, Object.create(null));
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
      createTvEpisode: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_tv_episodesPgResource, Object.create(null));
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
      createTvShow: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_tv_showsPgResource, Object.create(null));
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
      deleteFilm: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_filmsPgResource, specFromArgs_Film2(args));
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
      deleteFilmByCode: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_filmsPgResource, {
            code: args.getRaw(['input', "code"])
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
      deletePerson: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_personPgResource, specFromArgs_Person2(args));
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
          input(_, $object) {
            return $object;
          }
        }
      },
      deletePost: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_postPgResource, specFromArgs_Post2(args));
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
          const $delete = pgDeleteSingle(resource_postPgResource, {
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
      deleteStudio: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_studiosPgResource, specFromArgs_Studio2(args));
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
      deleteStudioById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_studiosPgResource, {
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
      deleteTvEpisode: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_tv_episodesPgResource, specFromArgs_TvEpisode2(args));
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
      deleteTvEpisodeByCode: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_tv_episodesPgResource, {
            code: args.getRaw(['input', "code"])
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
      deleteTvShow: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_tv_showsPgResource, specFromArgs_TvShow2(args));
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
      deleteTvShowByCode: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_tv_showsPgResource, {
            code: args.getRaw(['input', "code"])
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
      getflamble: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_person_full_name(args, ["input"]);
          const $result = resource_getflamblePgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input(_, $object, arg) {
            // We might have any number of step types here; we need
            // to get back to the underlying pgSelect.
            const $result = $object.getStepForKey("result");
            const $parent = "getParentStep" in $result ? $result.getParentStep() : $result;
            const $pgSelect = "getClassStep" in $parent ? $parent.getClassStep() : $parent;
            if ($pgSelect instanceof PgSelectStep) {
              // Mostly so `clientMutationId` works!
              arg.apply($pgSelect);
            } else {
              throw new Error(`Could not determine PgSelectStep for ${$result}`);
            }
          }
        }
      },
      login: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_login(args, ["input"]);
          const $result = resource_loginPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input(_, $object, arg) {
            // We might have any number of step types here; we need
            // to get back to the underlying pgSelect.
            const $result = $object.getStepForKey("result");
            const $parent = "getParentStep" in $result ? $result.getParentStep() : $result;
            const $pgSelect = "getClassStep" in $parent ? $parent.getClassStep() : $parent;
            if ($pgSelect instanceof PgSelectStep) {
              // Mostly so `clientMutationId` works!
              arg.apply($pgSelect);
            } else {
              throw new Error(`Could not determine PgSelectStep for ${$result}`);
            }
          }
        }
      },
      updateFilm: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_filmsPgResource, specFromArgs_Film(args));
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
      updateFilmByCode: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_filmsPgResource, {
            code: args.getRaw(['input', "code"])
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
      updatePerson: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_personPgResource, specFromArgs_Person(args));
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
          input(_, $object) {
            return $object;
          }
        }
      },
      updatePost: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_postPgResource, specFromArgs_Post(args));
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
          const $update = pgUpdateSingle(resource_postPgResource, {
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
      updateStudio: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_studiosPgResource, specFromArgs_Studio(args));
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
      updateStudioById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_studiosPgResource, {
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
      updateTvEpisode: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_tv_episodesPgResource, specFromArgs_TvEpisode(args));
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
      updateTvEpisodeByCode: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_tv_episodesPgResource, {
            code: args.getRaw(['input', "code"])
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
      updateTvShow: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_tv_showsPgResource, specFromArgs_TvShow(args));
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
      updateTvShowByCode: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_tv_showsPgResource, {
            code: args.getRaw(['input', "code"])
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
  CreateFilmPayload: {
    assertStep: assertExecutableStep,
    plans: {
      clientMutationId($mutation) {
        const $insert = $mutation.getStepForKey("result");
        return $insert.getMeta("clientMutationId");
      },
      film($object) {
        return $object.get("result");
      },
      filmEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_filmsPgResource, filmsUniques[0].attributes, $mutation, fieldArgs);
      },
      query() {
        return rootValue();
      }
    }
  },
  CreatePersonPayload: {
    assertStep: assertExecutableStep,
    plans: {
      clientMutationId($mutation) {
        const $insert = $mutation.getStepForKey("result");
        return $insert.getMeta("clientMutationId");
      },
      person($object) {
        return $object.get("result");
      },
      personEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_personPgResource, personUniques[0].attributes, $mutation, fieldArgs);
      },
      query() {
        return rootValue();
      }
    }
  },
  CreatePostPayload: {
    assertStep: assertExecutableStep,
    plans: {
      author($record) {
        return resource_personPgResource.get({
          id: $record.get("result").get("author_id")
        });
      },
      clientMutationId($mutation) {
        const $insert = $mutation.getStepForKey("result");
        return $insert.getMeta("clientMutationId");
      },
      post($object) {
        return $object.get("result");
      },
      postEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_postPgResource, postUniques[0].attributes, $mutation, fieldArgs);
      },
      query() {
        return rootValue();
      }
    }
  },
  CreateRenamedTablePayload: {
    assertStep: assertExecutableStep,
    plans: {
      clientMutationId($mutation) {
        const $insert = $mutation.getStepForKey("result");
        return $insert.getMeta("clientMutationId");
      },
      query() {
        return rootValue();
      },
      renamedTable($object) {
        return $object.get("result");
      }
    }
  },
  CreateStudioPayload: {
    assertStep: assertExecutableStep,
    plans: {
      clientMutationId($mutation) {
        const $insert = $mutation.getStepForKey("result");
        return $insert.getMeta("clientMutationId");
      },
      query() {
        return rootValue();
      },
      studio($object) {
        return $object.get("result");
      },
      studioEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_studiosPgResource, studiosUniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  CreateTvEpisodePayload: {
    assertStep: assertExecutableStep,
    plans: {
      clientMutationId($mutation) {
        const $insert = $mutation.getStepForKey("result");
        return $insert.getMeta("clientMutationId");
      },
      query() {
        return rootValue();
      },
      tvEpisode($object) {
        return $object.get("result");
      },
      tvEpisodeEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_tv_episodesPgResource, tv_episodesUniques[0].attributes, $mutation, fieldArgs);
      },
      tvShowByShowId($record) {
        return resource_tv_showsPgResource.get({
          code: $record.get("result").get("show_id")
        });
      }
    }
  },
  CreateTvShowPayload: {
    assertStep: assertExecutableStep,
    plans: {
      clientMutationId($mutation) {
        const $insert = $mutation.getStepForKey("result");
        return $insert.getMeta("clientMutationId");
      },
      query() {
        return rootValue();
      },
      studioByStudioId($record) {
        return resource_studiosPgResource.get({
          id: $record.get("result").get("studio_id")
        });
      },
      tvShow($object) {
        return $object.get("result");
      }
    }
  },
  DeleteFilmPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      deletedFilmId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Film.plan($record);
        return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
      },
      film($object) {
        return $object.get("result");
      },
      filmEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_filmsPgResource, filmsUniques[0].attributes, $mutation, fieldArgs);
      },
      query() {
        return rootValue();
      }
    }
  },
  DeletePersonPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      deletedPersonId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Person.plan($record);
        return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
      },
      person($object) {
        return $object.get("result");
      },
      personEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_personPgResource, personUniques[0].attributes, $mutation, fieldArgs);
      },
      query() {
        return rootValue();
      }
    }
  },
  DeletePostPayload: {
    assertStep: ObjectStep,
    plans: {
      author($record) {
        return resource_personPgResource.get({
          id: $record.get("result").get("author_id")
        });
      },
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      deletedPostId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Post.plan($record);
        return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
      },
      post($object) {
        return $object.get("result");
      },
      postEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_postPgResource, postUniques[0].attributes, $mutation, fieldArgs);
      },
      query() {
        return rootValue();
      }
    }
  },
  DeleteStudioPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      deletedStudioId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Studio.plan($record);
        return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
      },
      query() {
        return rootValue();
      },
      studio($object) {
        return $object.get("result");
      },
      studioEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_studiosPgResource, studiosUniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  DeleteTvEpisodePayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      deletedTvEpisodeId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_TvEpisode.plan($record);
        return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
      },
      query() {
        return rootValue();
      },
      tvEpisode($object) {
        return $object.get("result");
      },
      tvEpisodeEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_tv_episodesPgResource, tv_episodesUniques[0].attributes, $mutation, fieldArgs);
      },
      tvShowByShowId($record) {
        return resource_tv_showsPgResource.get({
          code: $record.get("result").get("show_id")
        });
      }
    }
  },
  DeleteTvShowPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      deletedTvShowId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_TvShow.plan($record);
        return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
      },
      query() {
        return rootValue();
      },
      studioByStudioId($record) {
        return resource_studiosPgResource.get({
          id: $record.get("result").get("studio_id")
        });
      },
      tvShow($object) {
        return $object.get("result");
      }
    }
  },
  Film: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nodeId($parent) {
        const specifier = nodeIdHandler_Film.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Film.codec.name].encode);
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of filmsUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_filmsPgResource.get(spec);
    }
  },
  FilmsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
      }
    }
  },
  Flamble: {
    assertStep: assertPgClassSingleStep
  },
  GetflamblePayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($object) {
        const $result = $object.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      flambles($object) {
        return $object.get("result");
      },
      query() {
        return rootValue();
      }
    }
  },
  JwtToken: {
    assertStep: assertPgClassSingleStep
  },
  LoginPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($object) {
        const $result = $object.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      query() {
        return rootValue();
      },
      token($object) {
        return $object.get("result");
      }
    }
  },
  PeopleConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
      }
    }
  },
  Person: {
    assertStep: assertPgClassSingleStep,
    plans: {
      colNoCreate($record) {
        return $record.get("col_no_create");
      },
      colNoCreateUpdate($record) {
        return $record.get("col_no_create_update");
      },
      colNoCreateUpdateOrderFilter($record) {
        return $record.get("col_no_create_update_order_filter");
      },
      colNoFilter($record) {
        return $record.get("col_no_filter");
      },
      colNoOrder($record) {
        return $record.get("col_no_order");
      },
      colNoUpdate($record) {
        return $record.get("col_no_update");
      },
      firstName($record) {
        return $record.get("first_name");
      },
      lastName($record) {
        return $record.get("last_name");
      },
      name($in, args, _info) {
        const {
          $row,
          selectArgs
        } = pgFunctionArgumentsFromArgs($in, makeArgs_person_full_name(args), true);
        const from = pgFromExpression($row, resource_person_full_namePgResource.from, resource_person_full_namePgResource.parameters, selectArgs);
        return pgClassExpression($row, resource_person_full_namePgResource.codec, undefined)`${from}`;
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_Person.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Person.codec.name].encode);
      },
      posts: {
        plan($record) {
          const $records = resource_postPgResource.find({
            author_id: $record.get("id")
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
      for (const pkCol of personUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_personPgResource.get(spec);
    }
  },
  Post: {
    assertStep: assertPgClassSingleStep,
    plans: {
      author($record) {
        return resource_personPgResource.get({
          id: $record.get("author_id")
        });
      },
      authorId($record) {
        return $record.get("author_id");
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_Post.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Post.codec.name].encode);
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
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
      }
    }
  },
  RenamedTable: {
    assertStep: assertPgClassSingleStep,
    plans: {
      colA($record) {
        return $record.get("col1");
      }
    }
  },
  RenamedTablesConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
      }
    }
  },
  Studio: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nodeId($parent) {
        const specifier = nodeIdHandler_Studio.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Studio.codec.name].encode);
      },
      tvShowsByStudioId: {
        plan($record) {
          const $records = resource_tv_showsPgResource.find({
            studio_id: $record.get("id")
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
          }
        }
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of studiosUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_studiosPgResource.get(spec);
    }
  },
  StudiosConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
      }
    }
  },
  TvEpisode: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nodeId($parent) {
        const specifier = nodeIdHandler_TvEpisode.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_TvEpisode.codec.name].encode);
      },
      showId($record) {
        return $record.get("show_id");
      },
      tvShowByShowId($record) {
        return resource_tv_showsPgResource.get({
          code: $record.get("show_id")
        });
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of tv_episodesUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_tv_episodesPgResource.get(spec);
    }
  },
  TvEpisodesConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
      }
    }
  },
  TvShow: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nodeId($parent) {
        const specifier = nodeIdHandler_TvShow.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_TvShow.codec.name].encode);
      },
      studioByStudioId($record) {
        return resource_studiosPgResource.get({
          id: $record.get("studio_id")
        });
      },
      studioId($record) {
        return $record.get("studio_id");
      },
      tvEpisodesByShowId: {
        plan($record) {
          const $records = resource_tv_episodesPgResource.find({
            show_id: $record.get("code")
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
      for (const pkCol of tv_showsUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_tv_showsPgResource.get(spec);
    }
  },
  TvShowsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
      }
    }
  },
  UpdateFilmPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      film($object) {
        return $object.get("result");
      },
      filmEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_filmsPgResource, filmsUniques[0].attributes, $mutation, fieldArgs);
      },
      query() {
        return rootValue();
      }
    }
  },
  UpdatePersonPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      person($object) {
        return $object.get("result");
      },
      personEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_personPgResource, personUniques[0].attributes, $mutation, fieldArgs);
      },
      query() {
        return rootValue();
      }
    }
  },
  UpdatePostPayload: {
    assertStep: ObjectStep,
    plans: {
      author($record) {
        return resource_personPgResource.get({
          id: $record.get("result").get("author_id")
        });
      },
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      post($object) {
        return $object.get("result");
      },
      postEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_postPgResource, postUniques[0].attributes, $mutation, fieldArgs);
      },
      query() {
        return rootValue();
      }
    }
  },
  UpdateStudioPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      query() {
        return rootValue();
      },
      studio($object) {
        return $object.get("result");
      },
      studioEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_studiosPgResource, studiosUniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  UpdateTvEpisodePayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      query() {
        return rootValue();
      },
      tvEpisode($object) {
        return $object.get("result");
      },
      tvEpisodeEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_tv_episodesPgResource, tv_episodesUniques[0].attributes, $mutation, fieldArgs);
      },
      tvShowByShowId($record) {
        return resource_tv_showsPgResource.get({
          code: $record.get("result").get("show_id")
        });
      }
    }
  },
  UpdateTvShowPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      query() {
        return rootValue();
      },
      studioByStudioId($record) {
        return resource_studiosPgResource.get({
          id: $record.get("result").get("studio_id")
        });
      },
      tvShow($object) {
        return $object.get("result");
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
  CreateFilmInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      film(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  CreatePersonInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      person(qb, arg) {
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
  CreateRenamedTableInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      renamedTable(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  CreateStudioInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      studio(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  CreateTvEpisodeInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      tvEpisode(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  CreateTvShowInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      tvShow(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  DeleteFilmByCodeInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeleteFilmInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeletePersonByIdInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeletePersonInput: {
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
  DeleteStudioByIdInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeleteStudioInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeleteTvEpisodeByCodeInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeleteTvEpisodeInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeleteTvShowByCodeInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeleteTvShowInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  FilmCondition: {
    plans: {
      code($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "code",
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
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.varchar)}`;
          }
        });
      }
    }
  },
  FilmInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      code(obj, val, {
        field,
        schema
      }) {
        obj.set("code", bakedInputRuntime(schema, field.type, val));
      },
      title(obj, val, {
        field,
        schema
      }) {
        obj.set("title", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  FilmPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      code(obj, val, {
        field,
        schema
      }) {
        obj.set("code", bakedInputRuntime(schema, field.type, val));
      },
      title(obj, val, {
        field,
        schema
      }) {
        obj.set("title", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  GetflambleInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  LoginInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  PersonCondition: {
    plans: {
      colNoCreate($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "col_no_create",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
          }
        });
      },
      colNoCreateUpdate($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "col_no_create_update",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
          }
        });
      },
      colNoOrder($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "col_no_order",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
          }
        });
      },
      colNoUpdate($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "col_no_update",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
          }
        });
      },
      firstName($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "first_name",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.varchar)}`;
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
      lastName($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "last_name",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.varchar)}`;
          }
        });
      }
    }
  },
  PersonInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      colNoFilter(obj, val, {
        field,
        schema
      }) {
        obj.set("col_no_filter", bakedInputRuntime(schema, field.type, val));
      },
      colNoOrder(obj, val, {
        field,
        schema
      }) {
        obj.set("col_no_order", bakedInputRuntime(schema, field.type, val));
      },
      colNoUpdate(obj, val, {
        field,
        schema
      }) {
        obj.set("col_no_update", bakedInputRuntime(schema, field.type, val));
      },
      firstName(obj, val, {
        field,
        schema
      }) {
        obj.set("first_name", bakedInputRuntime(schema, field.type, val));
      },
      id(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      },
      lastName(obj, val, {
        field,
        schema
      }) {
        obj.set("last_name", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  PersonPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      colNoCreate(obj, val, {
        field,
        schema
      }) {
        obj.set("col_no_create", bakedInputRuntime(schema, field.type, val));
      },
      colNoFilter(obj, val, {
        field,
        schema
      }) {
        obj.set("col_no_filter", bakedInputRuntime(schema, field.type, val));
      },
      colNoOrder(obj, val, {
        field,
        schema
      }) {
        obj.set("col_no_order", bakedInputRuntime(schema, field.type, val));
      },
      firstName(obj, val, {
        field,
        schema
      }) {
        obj.set("first_name", bakedInputRuntime(schema, field.type, val));
      },
      id(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      },
      lastName(obj, val, {
        field,
        schema
      }) {
        obj.set("last_name", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  PostCondition: {
    plans: {
      authorId($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "author_id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
      },
      body($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "body",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
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
      }
    }
  },
  PostInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      authorId(obj, val, {
        field,
        schema
      }) {
        obj.set("author_id", bakedInputRuntime(schema, field.type, val));
      },
      body(obj, val, {
        field,
        schema
      }) {
        obj.set("body", bakedInputRuntime(schema, field.type, val));
      },
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
      authorId(obj, val, {
        field,
        schema
      }) {
        obj.set("author_id", bakedInputRuntime(schema, field.type, val));
      },
      body(obj, val, {
        field,
        schema
      }) {
        obj.set("body", bakedInputRuntime(schema, field.type, val));
      },
      id(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  RenamedTableCondition: {
    plans: {
      colA($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "col1",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
      }
    }
  },
  RenamedTableInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      colA(obj, val, {
        field,
        schema
      }) {
        obj.set("col1", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  StudioCondition: {
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
  StudioInput: {
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
  StudioPatch: {
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
  TvEpisodeCondition: {
    plans: {
      code($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "code",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
      },
      showId($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "show_id",
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
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.varchar)}`;
          }
        });
      }
    }
  },
  TvEpisodeInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      code(obj, val, {
        field,
        schema
      }) {
        obj.set("code", bakedInputRuntime(schema, field.type, val));
      },
      showId(obj, val, {
        field,
        schema
      }) {
        obj.set("show_id", bakedInputRuntime(schema, field.type, val));
      },
      title(obj, val, {
        field,
        schema
      }) {
        obj.set("title", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  TvEpisodePatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      code(obj, val, {
        field,
        schema
      }) {
        obj.set("code", bakedInputRuntime(schema, field.type, val));
      },
      showId(obj, val, {
        field,
        schema
      }) {
        obj.set("show_id", bakedInputRuntime(schema, field.type, val));
      },
      title(obj, val, {
        field,
        schema
      }) {
        obj.set("title", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  TvShowCondition: {
    plans: {
      code($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "code",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
      },
      studioId($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "studio_id",
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
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.varchar)}`;
          }
        });
      }
    }
  },
  TvShowInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      code(obj, val, {
        field,
        schema
      }) {
        obj.set("code", bakedInputRuntime(schema, field.type, val));
      },
      studioId(obj, val, {
        field,
        schema
      }) {
        obj.set("studio_id", bakedInputRuntime(schema, field.type, val));
      },
      title(obj, val, {
        field,
        schema
      }) {
        obj.set("title", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  TvShowPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      code(obj, val, {
        field,
        schema
      }) {
        obj.set("code", bakedInputRuntime(schema, field.type, val));
      },
      studioId(obj, val, {
        field,
        schema
      }) {
        obj.set("studio_id", bakedInputRuntime(schema, field.type, val));
      },
      title(obj, val, {
        field,
        schema
      }) {
        obj.set("title", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  UpdateFilmByCodeInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      filmPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  UpdateFilmInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      filmPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  UpdatePersonByIdInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      personPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  UpdatePersonInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      personPatch(qb, arg) {
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
  UpdateStudioByIdInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      studioPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  UpdateStudioInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      studioPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  UpdateTvEpisodeByCodeInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      tvEpisodePatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  UpdateTvEpisodeInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      tvEpisodePatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  UpdateTvShowByCodeInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      tvShowPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  UpdateTvShowInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      tvShowPatch(qb, arg) {
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
  FilmsOrderBy: {
    values: {
      CODE_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "code",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      CODE_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "code",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_ASC(queryBuilder) {
        filmsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        filmsUniques[0].attributes.forEach(attributeName => {
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
      }
    }
  },
  PeopleOrderBy: {
    values: {
      COL_NO_CREATE_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_no_create",
          direction: "ASC"
        });
      },
      COL_NO_CREATE_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_no_create",
          direction: "DESC"
        });
      },
      COL_NO_CREATE_UPDATE_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_no_create_update",
          direction: "ASC"
        });
      },
      COL_NO_CREATE_UPDATE_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_no_create_update",
          direction: "DESC"
        });
      },
      COL_NO_FILTER_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_no_filter",
          direction: "ASC"
        });
      },
      COL_NO_FILTER_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_no_filter",
          direction: "DESC"
        });
      },
      COL_NO_UPDATE_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_no_update",
          direction: "ASC"
        });
      },
      COL_NO_UPDATE_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_no_update",
          direction: "DESC"
        });
      },
      FIRST_NAME_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "first_name",
          direction: "ASC"
        });
      },
      FIRST_NAME_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "first_name",
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
      LAST_NAME_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "last_name",
          direction: "ASC"
        });
      },
      LAST_NAME_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "last_name",
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
  },
  RenamedTablesOrderBy: {
    values: {
      COL_A_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col1",
          direction: "ASC"
        });
      },
      COL_A_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col1",
          direction: "DESC"
        });
      }
    }
  },
  StudiosOrderBy: {
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
        studiosUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        studiosUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      }
    }
  },
  TvEpisodesOrderBy: {
    values: {
      CODE_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "code",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      CODE_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "code",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_ASC(queryBuilder) {
        tv_episodesUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        tv_episodesUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      SHOW_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "show_id",
          direction: "ASC"
        });
      },
      SHOW_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "show_id",
          direction: "DESC"
        });
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
