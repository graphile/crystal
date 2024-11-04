import { PgDeleteSingleStep, PgExecutor, PgResource, PgSelectSingleStep, PgSelectStep, PgUnionAllStep, TYPES, assertPgClassSingleStep, makeRegistry, pgClassExpression, pgDeleteSingle, pgInsertSingle, pgSelectFromRecord, pgSelectSingleFromRecord, pgUpdateSingle, recordCodec, sqlFromArgDigests } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ObjectStep, SafeError, __ValueStep, access, assertEdgeCapableStep, assertExecutableStep, assertPageInfoCapableStep, connection, constant, context, first, getEnumValueConfig, inhibitOnNull, lambda, list, makeGrafastSchema, node, object, rootValue, specFromNodeId, stepAMayDependOnStepB } from "grafast";
import { GraphQLError, Kind } from "graphql";
import { sql } from "pg-sql2";
import { inspect } from "util";
const handler = {
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
const nodeIdCodecs = Object.assign(Object.create(null), {
  raw: handler.codec,
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
const flambleIdentifier = sql.identifier("d", "flibble");
const flambleCodec = recordCodec({
  name: "flamble",
  identifier: flambleIdentifier,
  attributes: Object.assign(Object.create(null), {
    f: {
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
    isTableLike: false,
    pg: {
      serviceName: "main",
      schemaName: "d",
      name: "flibble"
    },
    tags: Object.assign(Object.create(null), {
      name: "flamble"
    })
  },
  executor: executor
});
const renamed_tableIdentifier = sql.identifier("d", "original_table");
const spec_renamed_table = {
  name: "renamed_table",
  identifier: renamed_tableIdentifier,
  attributes: Object.assign(Object.create(null), {
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
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "d",
      name: "original_table"
    },
    tags: Object.assign(Object.create(null), {
      name: "renamed_table"
    })
  },
  executor: executor
};
const renamed_tableCodec = recordCodec(spec_renamed_table);
const filmsIdentifier = sql.identifier("d", "films");
const spec_films = {
  name: "films",
  identifier: filmsIdentifier,
  attributes: Object.assign(Object.create(null), {
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
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "d",
      name: "films"
    },
    tags: Object.assign(Object.create(null), {
      omit: "delete",
      behavior: ["-delete"]
    })
  },
  executor: executor
};
const filmsCodec = recordCodec(spec_films);
const studiosIdentifier = sql.identifier("d", "studios");
const spec_studios = {
  name: "studios",
  identifier: studiosIdentifier,
  attributes: Object.assign(Object.create(null), {
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
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "d",
      name: "studios"
    },
    tags: Object.create(null)
  },
  executor: executor
};
const studiosCodec = recordCodec(spec_studios);
const postIdentifier = sql.identifier("d", "post");
const spec_post = {
  name: "post",
  identifier: postIdentifier,
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
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "d",
      name: "post"
    },
    tags: Object.create(null)
  },
  executor: executor
};
const postCodec = recordCodec(spec_post);
const tvEpisodesIdentifier = sql.identifier("d", "tv_episodes");
const spec_tvEpisodes = {
  name: "tvEpisodes",
  identifier: tvEpisodesIdentifier,
  attributes: Object.assign(Object.create(null), {
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
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "d",
      name: "tv_episodes"
    },
    tags: Object.create(null)
  },
  executor: executor
};
const tvEpisodesCodec = recordCodec(spec_tvEpisodes);
const tvShowsIdentifier = sql.identifier("d", "tv_shows");
const spec_tvShows = {
  name: "tvShows",
  identifier: tvShowsIdentifier,
  attributes: Object.assign(Object.create(null), {
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
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "d",
      name: "tv_shows"
    },
    tags: Object.create(null)
  },
  executor: executor
};
const tvShowsCodec = recordCodec(spec_tvShows);
const jwtTokenIdentifier = sql.identifier("d", "jwt_token");
const jwtTokenCodec = recordCodec({
  name: "jwtToken",
  identifier: jwtTokenIdentifier,
  attributes: Object.assign(Object.create(null), {
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
  }),
  description: undefined,
  extensions: {
    isTableLike: false,
    pg: {
      serviceName: "main",
      schemaName: "d",
      name: "jwt_token"
    },
    tags: Object.create(null)
  },
  executor: executor
});
const personIdentifier = sql.identifier("d", "person");
const spec_person = {
  name: "person",
  identifier: personIdentifier,
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
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "d",
      name: "person"
    },
    tags: Object.create(null)
  },
  executor: executor
};
const personCodec = recordCodec(spec_person);
const original_functionFunctionIdentifer = sql.identifier("d", "original_function");
const getflambleFunctionIdentifer = sql.identifier("d", "getflamble");
const filmsUniques = [{
  isPrimary: true,
  attributes: ["code"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const studiosUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
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
    tags: Object.create(null)
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
    tags: Object.create(null)
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
    tags: Object.create(null)
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
    tags: {}
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
    tags: Object.assign(Object.create(null), {
      fieldName: "findPersonById"
    })
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
  pgExecutors: Object.assign(Object.create(null), {
    main: executor
  }),
  pgCodecs: Object.assign(Object.create(null), {
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
  }),
  pgResources: Object.assign(Object.create(null), {
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
        tags: {
          omit: "delete",
          behavior: spec_films.extensions.tags.behavior
        }
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
  }),
  pgRelations: Object.assign(Object.create(null), {
    person: Object.assign(Object.create(null), {
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
    }),
    post: Object.assign(Object.create(null), {
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
    }),
    studios: Object.assign(Object.create(null), {
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
    }),
    tvEpisodes: Object.assign(Object.create(null), {
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
    }),
    tvShows: Object.assign(Object.create(null), {
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
    })
  })
});
const pgResource_filmsPgResource = registry.pgResources["films"];
const pgResource_studiosPgResource = registry.pgResources["studios"];
const pgResource_postPgResource = registry.pgResources["post"];
const pgResource_tv_episodesPgResource = registry.pgResources["tv_episodes"];
const pgResource_tv_showsPgResource = registry.pgResources["tv_shows"];
const pgResource_personPgResource = registry.pgResources["person"];
const nodeIdHandlerByTypeName = Object.assign(Object.create(null), {
  Query: handler,
  Film: {
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
    get(spec) {
      return pgResource_filmsPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "films";
    }
  },
  Studio: {
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
    get(spec) {
      return pgResource_studiosPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "studios";
    }
  },
  Post: {
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
    get(spec) {
      return pgResource_postPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "posts";
    }
  },
  TvEpisode: {
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
    get(spec) {
      return pgResource_tv_episodesPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "tv_episodes";
    }
  },
  TvShow: {
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
    get(spec) {
      return pgResource_tv_showsPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "tv_shows";
    }
  },
  Person: {
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
    get(spec) {
      return pgResource_personPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "people";
    }
  }
});
const argDetailsSimple = [];
const makeArgs = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 0; i++) {
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
const resource_renamed_functionPgResource = registry.pgResources["renamed_function"];
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
const getSpec = $nodeId => {
  // TODO: should change this to a common method like
  // `const $decoded = getDecodedNodeIdForHandler(handler, $nodeId)`
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandlerByTypeName.Person));
  return nodeIdHandlerByTypeName.Person.getSpec($decoded);
};
const argDetailsSimple2 = [{
  graphqlArgName: "n",
  postgresArgName: "n",
  pgCodec: personCodec,
  required: true,
  fetcher($nodeId) {
    return pgResource_personPgResource.get(getSpec($nodeId));
  }
}];
const makeArgs2 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 1; i++) {
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
const resource_person_full_namePgResource = registry.pgResources["person_full_name"];
const argDetailsSimple3 = [{
  graphqlArgName: "search",
  postgresArgName: "search",
  pgCodec: TYPES.text,
  required: true,
  fetcher: null
}];
const makeArgs3 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 1; i++) {
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
const resource_returnPostsMatchingPgResource = registry.pgResources["returnPostsMatching"];
const getSelectPlanFromParentAndArgs = ($root, args, _info) => {
  const selectArgs = makeArgs3(args);
  return resource_returnPostsMatchingPgResource.execute(selectArgs);
};
const fetcher = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName.Film);
const fetcher2 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName.Studio);
const fetcher3 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName.Post);
const fetcher4 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName.TvEpisode);
const fetcher5 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName.TvShow);
const fetcher6 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName.Person);
const resource_renamed_tablePgResource = registry.pgResources["renamed_table"];
const applyOrderToPlan = ($select, $value, TableOrderByType) => {
  if (!("evalLength" in $value)) {
    return;
  }
  const length = $value.evalLength();
  if (length == null) {
    return;
  }
  for (let i = 0; i < length; i++) {
    const order = $value.at(i).eval();
    if (order == null) continue;
    const config = getEnumValueConfig(TableOrderByType, order);
    const plan = config?.extensions?.grafast?.applyPlan;
    if (typeof plan !== "function") {
      console.error(`Internal server error: invalid orderBy configuration: expected function, but received ${inspect(plan)}`);
      throw new SafeError("Internal server error: invalid orderBy configuration");
    }
    plan($select);
  }
};
function CursorSerialize(value) {
  return "" + value;
}
function hasRecord($row) {
  return "record" in $row && typeof $row.record === "function";
}
const argDetailsSimple4 = [];
const makeArgs4 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 0; i++) {
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
const argDetailsSimple5 = [];
const makeArgs5 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 0; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple5[i];
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
const resource_getflamblePgResource = registry.pgResources["getflamble"];
const argDetailsSimple6 = [{
  graphqlArgName: "a",
  postgresArgName: "a",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs6 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 1; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple6[i];
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
const resource_loginPgResource = registry.pgResources["login"];
const specFromArgs = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Film, $nodeId);
};
const specFromArgs2 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Studio, $nodeId);
};
const specFromArgs3 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Post, $nodeId);
};
const specFromArgs4 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.TvEpisode, $nodeId);
};
const specFromArgs5 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.TvShow, $nodeId);
};
const specFromArgs6 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Person, $nodeId);
};
const specFromArgs7 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Studio, $nodeId);
};
const specFromArgs8 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Post, $nodeId);
};
const specFromArgs9 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.TvEpisode, $nodeId);
};
const specFromArgs10 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.TvShow, $nodeId);
};
const specFromArgs11 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Person, $nodeId);
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

    """The method to use when ordering \`RenamedTable\`."""
    orderBy: [RenamedTablesOrderBy!] = [NATURAL]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RenamedTableCondition
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

    """The method to use when ordering \`Film\`."""
    orderBy: [FilmsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: FilmCondition
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

    """The method to use when ordering \`Studio\`."""
    orderBy: [StudiosOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: StudioCondition
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

    """The method to use when ordering \`Post\`."""
    orderBy: [PostsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: PostCondition
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

    """The method to use when ordering \`TvEpisode\`."""
    orderBy: [TvEpisodesOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: TvEpisodeCondition
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

    """The method to use when ordering \`TvShow\`."""
    orderBy: [TvShowsOrderBy!] = [PRIMARY_KEY_ASC]

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

    """The method to use when ordering \`Person\`."""
    orderBy: [PeopleOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: PersonCondition
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

    """The method to use when ordering \`TvShow\`."""
    orderBy: [TvShowsOrderBy!] = [PRIMARY_KEY_ASC]

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

    """The method to use when ordering \`TvEpisode\`."""
    orderBy: [TvEpisodesOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: TvEpisodeCondition
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

"""A \`TvShow\` edge in the connection."""
type TvShowsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`TvShow\` at the end of the edge."""
  node: TvShow
}

"""Methods to use when ordering \`TvShow\`."""
enum TvShowsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  CODE_ASC
  CODE_DESC
  TITLE_ASC
  TITLE_DESC
  STUDIO_ID_ASC
  STUDIO_ID_DESC
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

    """The method to use when ordering \`Post\`."""
    orderBy: [PostsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: PostCondition
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

"""Methods to use when ordering \`RenamedTable\`."""
enum RenamedTablesOrderBy {
  NATURAL
  COL_A_ASC
  COL_A_DESC
}

"""
A condition to be used against \`RenamedTable\` object types. All fields are
tested for equality and combined with a logical ‘and.’
"""
input RenamedTableCondition {
  """Checks for equality with the object’s \`colA\` field."""
  colA: Int
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

"""
A condition to be used against \`Film\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input FilmCondition {
  """Checks for equality with the object’s \`code\` field."""
  code: Int

  """Checks for equality with the object’s \`title\` field."""
  title: String
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

"""
A condition to be used against \`Studio\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input StudioCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`name\` field."""
  name: String
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

  """An edge for our \`TvShow\`. May be used by Relay 1."""
  tvShowEdge(
    """The method to use when ordering \`TvShow\`."""
    orderBy: [TvShowsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): TvShowsEdge

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

  """An edge for our \`TvShow\`. May be used by Relay 1."""
  tvShowEdge(
    """The method to use when ordering \`TvShow\`."""
    orderBy: [TvShowsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): TvShowsEdge

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

  """An edge for our \`TvShow\`. May be used by Relay 1."""
  tvShowEdge(
    """The method to use when ordering \`TvShow\`."""
    orderBy: [TvShowsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): TvShowsEdge

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
export const plans = {
  Query: {
    __assertStep() {
      return true;
    },
    query() {
      return rootValue();
    },
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
    filmByCode: {
      plan(_$root, args) {
        return pgResource_filmsPgResource.get({
          code: args.get("code")
        });
      },
      args: {
        code: undefined
      }
    },
    studioById: {
      plan(_$root, args) {
        return pgResource_studiosPgResource.get({
          id: args.get("id")
        });
      },
      args: {
        id: undefined
      }
    },
    postById: {
      plan(_$root, args) {
        return pgResource_postPgResource.get({
          id: args.get("id")
        });
      },
      args: {
        id: undefined
      }
    },
    tvEpisodeByCode: {
      plan(_$root, args) {
        return pgResource_tv_episodesPgResource.get({
          code: args.get("code")
        });
      },
      args: {
        code: undefined
      }
    },
    tvShowByCode: {
      plan(_$root, args) {
        return pgResource_tv_showsPgResource.get({
          code: args.get("code")
        });
      },
      args: {
        code: undefined
      }
    },
    findPersonById: {
      plan(_$root, args) {
        return pgResource_personPgResource.get({
          id: args.get("id")
        });
      },
      args: {
        id: undefined
      }
    },
    renamedFunction($root, args, _info) {
      const selectArgs = makeArgs(args);
      return resource_renamed_functionPgResource.execute(selectArgs);
    },
    personFullName: {
      plan($root, args, _info) {
        const selectArgs = makeArgs2(args);
        return resource_person_full_namePgResource.execute(selectArgs);
      },
      args: {
        n: undefined
      }
    },
    returnPostsMatching: {
      plan($parent, args, info) {
        const $select = getSelectPlanFromParentAndArgs($parent, args, info);
        return connection($select, {
          // nodePlan: ($item) => $item,
          cursorPlan($item) {
            return $item.getParentStep ? $item.getParentStep().cursor() : $item.cursor();
          }
        });
      },
      args: {
        search: undefined,
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
        }
      }
    },
    film: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    studio: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher2($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    post: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher3($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    tvEpisode: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher4($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    tvShow: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher5($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    person: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher6($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    allRenamedTables: {
      plan() {
        return connection(resource_renamed_tablePgResource.find());
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
            applyOrderToPlan($select, $value, info.schema.getType("RenamedTablesOrderBy"));
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
    allFilms: {
      plan() {
        return connection(pgResource_filmsPgResource.find());
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
            applyOrderToPlan($select, $value, info.schema.getType("FilmsOrderBy"));
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
    allStudios: {
      plan() {
        return connection(pgResource_studiosPgResource.find());
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
            applyOrderToPlan($select, $value, info.schema.getType("StudiosOrderBy"));
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
    allPosts: {
      plan() {
        return connection(pgResource_postPgResource.find());
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
    allTvEpisodes: {
      plan() {
        return connection(pgResource_tv_episodesPgResource.find());
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
            applyOrderToPlan($select, $value, info.schema.getType("TvEpisodesOrderBy"));
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
    allTvShows: {
      plan() {
        return connection(pgResource_tv_showsPgResource.find());
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
            applyOrderToPlan($select, $value, info.schema.getType("TvShowsOrderBy"));
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
    allPeople: {
      plan() {
        return connection(pgResource_personPgResource.find());
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
            applyOrderToPlan($select, $value, info.schema.getType("PeopleOrderBy"));
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
  Film: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.Film.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Film.codec.name].encode);
    },
    code($record) {
      return $record.get("code");
    },
    title($record) {
      return $record.get("title");
    }
  },
  Studio: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.Studio.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Studio.codec.name].encode);
    },
    id($record) {
      return $record.get("id");
    },
    name($record) {
      return $record.get("name");
    },
    tvShowsByStudioId: {
      plan($record) {
        const $records = pgResource_tv_showsPgResource.find({
          studio_id: $record.get("id")
        });
        return connection($records);
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
            applyOrderToPlan($select, $value, info.schema.getType("TvShowsOrderBy"));
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
  TvShowsConnection: {
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
  TvShow: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.TvShow.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.TvShow.codec.name].encode);
    },
    code($record) {
      return $record.get("code");
    },
    title($record) {
      return $record.get("title");
    },
    studioId($record) {
      return $record.get("studio_id");
    },
    studioByStudioId($record) {
      return pgResource_studiosPgResource.get({
        id: $record.get("studio_id")
      });
    },
    tvEpisodesByShowId: {
      plan($record) {
        const $records = pgResource_tv_episodesPgResource.find({
          show_id: $record.get("code")
        });
        return connection($records);
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
            applyOrderToPlan($select, $value, info.schema.getType("TvEpisodesOrderBy"));
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
  TvEpisodesConnection: {
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
  TvEpisode: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.TvEpisode.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.TvEpisode.codec.name].encode);
    },
    code($record) {
      return $record.get("code");
    },
    title($record) {
      return $record.get("title");
    },
    showId($record) {
      return $record.get("show_id");
    },
    tvShowByShowId($record) {
      return pgResource_tv_showsPgResource.get({
        code: $record.get("show_id")
      });
    }
  },
  TvEpisodesEdge: {
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
  TvEpisodesOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        tv_episodesUniques[0].attributes.forEach(attributeName => {
          const attribute = tvEpisodesCodec.attributes[attributeName];
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
        tv_episodesUniques[0].attributes.forEach(attributeName => {
          const attribute = tvEpisodesCodec.attributes[attributeName];
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
    CODE_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "code",
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
    CODE_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "code",
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
    SHOW_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "show_id",
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
    SHOW_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "show_id",
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
  TvEpisodeCondition: {
    code: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "code",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "code",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_tvEpisodes.attributes.code.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_tvEpisodes.attributes.title.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    showId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "show_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "show_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_tvEpisodes.attributes.show_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  TvShowsEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  TvShowsOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        tv_showsUniques[0].attributes.forEach(attributeName => {
          const attribute = tvShowsCodec.attributes[attributeName];
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
        tv_showsUniques[0].attributes.forEach(attributeName => {
          const attribute = tvShowsCodec.attributes[attributeName];
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
    CODE_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "code",
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
    CODE_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "code",
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
    STUDIO_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "studio_id",
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
    STUDIO_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "studio_id",
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
  TvShowCondition: {
    code: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "code",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "code",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_tvShows.attributes.code.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_tvShows.attributes.title.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    studioId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "studio_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "studio_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_tvShows.attributes.studio_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
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
    },
    body($record) {
      return $record.get("body");
    },
    authorId($record) {
      return $record.get("author_id");
    },
    author($record) {
      return pgResource_personPgResource.get({
        id: $record.get("author_id")
      });
    }
  },
  Person: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.Person.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Person.codec.name].encode);
    },
    name($in, args, _info) {
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
      if (resource_person_full_namePgResource.isUnique && !resource_person_full_namePgResource.codec.attributes && typeof resource_person_full_namePgResource.from === "function") {
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
        return pgClassExpression($row, resource_person_full_namePgResource.codec)`${resource_person_full_namePgResource.from(...placeholders.map(placeholder => ({
          placeholder
        })))}`;
      }
      // PERF: or here, if scalar add select to `$row`?
      return resource_person_full_namePgResource.execute(selectArgs);
    },
    id($record) {
      return $record.get("id");
    },
    firstName($record) {
      return $record.get("first_name");
    },
    lastName($record) {
      return $record.get("last_name");
    },
    colNoCreate($record) {
      return $record.get("col_no_create");
    },
    colNoUpdate($record) {
      return $record.get("col_no_update");
    },
    colNoOrder($record) {
      return $record.get("col_no_order");
    },
    colNoFilter($record) {
      return $record.get("col_no_filter");
    },
    colNoCreateUpdate($record) {
      return $record.get("col_no_create_update");
    },
    colNoCreateUpdateOrderFilter($record) {
      return $record.get("col_no_create_update_order_filter");
    },
    posts: {
      plan($record) {
        const $records = pgResource_postPgResource.find({
          author_id: $record.get("id")
        });
        return connection($records);
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
    }
  },
  PostsConnection: {
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
        postUniques[0].attributes.forEach(attributeName => {
          const attribute = postCodec.attributes[attributeName];
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
        postUniques[0].attributes.forEach(attributeName => {
          const attribute = postCodec.attributes[attributeName];
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
    BODY_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "body",
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
    BODY_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "body",
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
    AUTHOR_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "author_id",
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
    AUTHOR_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "author_id",
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_post.attributes.id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    body: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "body",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "body",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_post.attributes.body.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    authorId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "author_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "author_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_post.attributes.author_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  RenamedTablesConnection: {
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
  RenamedTable: {
    __assertStep: assertPgClassSingleStep,
    colA($record) {
      return $record.get("col1");
    }
  },
  RenamedTablesEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  RenamedTablesOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    COL_A_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "col1",
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
    COL_A_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "col1",
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
  RenamedTableCondition: {
    colA: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "col1",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "col1",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_renamed_table.attributes.col1.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  FilmsConnection: {
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
  FilmsEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  FilmsOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        filmsUniques[0].attributes.forEach(attributeName => {
          const attribute = filmsCodec.attributes[attributeName];
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
        filmsUniques[0].attributes.forEach(attributeName => {
          const attribute = filmsCodec.attributes[attributeName];
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
    CODE_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "code",
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
    CODE_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "code",
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
    }
  },
  FilmCondition: {
    code: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "code",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "code",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_films.attributes.code.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_films.attributes.title.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  StudiosConnection: {
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
  StudiosEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  StudiosOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        studiosUniques[0].attributes.forEach(attributeName => {
          const attribute = studiosCodec.attributes[attributeName];
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
        studiosUniques[0].attributes.forEach(attributeName => {
          const attribute = studiosCodec.attributes[attributeName];
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
    }
  },
  StudioCondition: {
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_studios.attributes.id.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_studios.attributes.name.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  PeopleConnection: {
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
  PeopleEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  PeopleOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        personUniques[0].attributes.forEach(attributeName => {
          const attribute = personCodec.attributes[attributeName];
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
        personUniques[0].attributes.forEach(attributeName => {
          const attribute = personCodec.attributes[attributeName];
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
    FIRST_NAME_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "first_name",
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
    FIRST_NAME_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "first_name",
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
    LAST_NAME_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "last_name",
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
    LAST_NAME_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "last_name",
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
    COL_NO_CREATE_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "col_no_create",
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
    COL_NO_CREATE_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "col_no_create",
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
    COL_NO_UPDATE_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "col_no_update",
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
    COL_NO_UPDATE_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "col_no_update",
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
    COL_NO_FILTER_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "col_no_filter",
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
    COL_NO_FILTER_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "col_no_filter",
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
    COL_NO_CREATE_UPDATE_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "col_no_create_update",
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
    COL_NO_CREATE_UPDATE_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "col_no_create_update",
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
  PersonCondition: {
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_person.attributes.id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    firstName: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "first_name",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "first_name",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_person.attributes.first_name.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    lastName: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "last_name",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "last_name",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_person.attributes.last_name.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    colNoCreate: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "col_no_create",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "col_no_create",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_person.attributes.col_no_create.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    colNoUpdate: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "col_no_update",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "col_no_update",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_person.attributes.col_no_update.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    colNoOrder: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "col_no_order",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "col_no_order",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_person.attributes.col_no_order.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    colNoCreateUpdate: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "col_no_create_update",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "col_no_create_update",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_person.attributes.col_no_create_update.codec)}`;
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
    getflamble: {
      plan($root, args, _info) {
        const selectArgs = makeArgs5(args, ["input"]);
        const $result = resource_getflamblePgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
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
    login: {
      plan($root, args, _info) {
        const selectArgs = makeArgs6(args, ["input"]);
        const $result = resource_loginPgResource.execute(selectArgs, "mutation");
        return object({
          result: $result
        });
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
    createRenamedTable: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(resource_renamed_tablePgResource, Object.create(null))
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
    createFilm: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_filmsPgResource, Object.create(null))
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
    createStudio: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_studiosPgResource, Object.create(null))
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
    createPost: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_postPgResource, Object.create(null))
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
    createTvEpisode: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_tv_episodesPgResource, Object.create(null))
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
    createTvShow: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_tv_showsPgResource, Object.create(null))
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
    createPerson: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_personPgResource, Object.create(null))
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
    updateFilm: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_filmsPgResource, specFromArgs(args))
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
    updateFilmByCode: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_filmsPgResource, {
            code: args.get(['input', "code"])
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
    updateStudio: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_studiosPgResource, specFromArgs2(args))
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
    updateStudioById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_studiosPgResource, {
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
    updatePost: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_postPgResource, specFromArgs3(args))
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
    updatePostById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_postPgResource, {
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
    updateTvEpisode: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_tv_episodesPgResource, specFromArgs4(args))
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
    updateTvEpisodeByCode: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_tv_episodesPgResource, {
            code: args.get(['input', "code"])
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
    updateTvShow: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_tv_showsPgResource, specFromArgs5(args))
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
    updateTvShowByCode: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_tv_showsPgResource, {
            code: args.get(['input', "code"])
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
    updatePerson: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_personPgResource, specFromArgs6(args))
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
    updatePersonById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_personPgResource, {
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
    deleteStudio: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_studiosPgResource, specFromArgs7(args))
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
    deleteStudioById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_studiosPgResource, {
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
    deletePost: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_postPgResource, specFromArgs8(args))
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
    deletePostById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_postPgResource, {
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
    deleteTvEpisode: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_tv_episodesPgResource, specFromArgs9(args))
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
    deleteTvEpisodeByCode: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_tv_episodesPgResource, {
            code: args.get(['input', "code"])
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
    deleteTvShow: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_tv_showsPgResource, specFromArgs10(args))
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
    deleteTvShowByCode: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_tv_showsPgResource, {
            code: args.get(['input', "code"])
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
    deletePerson: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_personPgResource, specFromArgs11(args))
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
    deletePersonById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_personPgResource, {
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
    }
  },
  GetflamblePayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      return $object.getStepForKey("clientMutationId", true) ?? constant(undefined);
    },
    flambles($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  Flamble: {
    __assertStep: assertPgClassSingleStep,
    f($record) {
      return $record.get("f");
    }
  },
  GetflambleInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  LoginPayload: {
    __assertStep: ObjectStep,
    clientMutationId($object) {
      return $object.getStepForKey("clientMutationId", true) ?? constant(undefined);
    },
    token($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  JwtToken: {
    __assertStep: assertPgClassSingleStep,
    role($record) {
      return $record.get("role");
    },
    exp($record) {
      return $record.get("exp");
    },
    a($record) {
      return $record.get("a");
    }
  },
  LoginInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    a: undefined
  },
  CreateRenamedTablePayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    renamedTable($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    }
  },
  CreateRenamedTableInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    renamedTable: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  RenamedTableInput: {
    "__inputPlan": function RenamedTableInput_inputPlan() {
      return object(Object.create(null));
    },
    colA: {
      applyPlan($insert, val) {
        $insert.set("col1", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreateFilmPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    film($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    filmEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = filmsUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_filmsPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("FilmsOrderBy"));
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
  CreateFilmInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    film: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  FilmInput: {
    "__inputPlan": function FilmInput_inputPlan() {
      return object(Object.create(null));
    },
    code: {
      applyPlan($insert, val) {
        $insert.set("code", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    title: {
      applyPlan($insert, val) {
        $insert.set("title", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreateStudioPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    studio($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    studioEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = studiosUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_studiosPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("StudiosOrderBy"));
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
  CreateStudioInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    studio: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  StudioInput: {
    "__inputPlan": function StudioInput_inputPlan() {
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
    }
  },
  CreatePostPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    post($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
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
            const spec = postUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_postPgResource.find(spec);
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
    },
    author($record) {
      return pgResource_personPgResource.get({
        id: $record.get("result").get("author_id")
      });
    }
  },
  CreatePostInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    post: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  PostInput: {
    "__inputPlan": function PostInput_inputPlan() {
      return object(Object.create(null));
    },
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    body: {
      applyPlan($insert, val) {
        $insert.set("body", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    authorId: {
      applyPlan($insert, val) {
        $insert.set("author_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreateTvEpisodePayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    tvEpisode($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    tvEpisodeEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = tv_episodesUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_tv_episodesPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("TvEpisodesOrderBy"));
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
    tvShowByShowId($record) {
      return pgResource_tv_showsPgResource.get({
        code: $record.get("result").get("show_id")
      });
    }
  },
  CreateTvEpisodeInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    tvEpisode: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  TvEpisodeInput: {
    "__inputPlan": function TvEpisodeInput_inputPlan() {
      return object(Object.create(null));
    },
    code: {
      applyPlan($insert, val) {
        $insert.set("code", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    title: {
      applyPlan($insert, val) {
        $insert.set("title", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    showId: {
      applyPlan($insert, val) {
        $insert.set("show_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreateTvShowPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    tvShow($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    tvShowEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = tv_showsUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_tv_showsPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("TvShowsOrderBy"));
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
    studioByStudioId($record) {
      return pgResource_studiosPgResource.get({
        id: $record.get("result").get("studio_id")
      });
    }
  },
  CreateTvShowInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    tvShow: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  TvShowInput: {
    "__inputPlan": function TvShowInput_inputPlan() {
      return object(Object.create(null));
    },
    code: {
      applyPlan($insert, val) {
        $insert.set("code", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    title: {
      applyPlan($insert, val) {
        $insert.set("title", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    studioId: {
      applyPlan($insert, val) {
        $insert.set("studio_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreatePersonPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    person($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    personEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = personUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_personPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("PeopleOrderBy"));
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
  CreatePersonInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    person: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  PersonInput: {
    "__inputPlan": function PersonInput_inputPlan() {
      return object(Object.create(null));
    },
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    firstName: {
      applyPlan($insert, val) {
        $insert.set("first_name", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    lastName: {
      applyPlan($insert, val) {
        $insert.set("last_name", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    colNoUpdate: {
      applyPlan($insert, val) {
        $insert.set("col_no_update", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    colNoOrder: {
      applyPlan($insert, val) {
        $insert.set("col_no_order", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    colNoFilter: {
      applyPlan($insert, val) {
        $insert.set("col_no_filter", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateFilmPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    film($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    filmEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = filmsUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_filmsPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("FilmsOrderBy"));
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
  UpdateFilmInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined,
    filmPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  FilmPatch: {
    "__inputPlan": function FilmPatch_inputPlan() {
      return object(Object.create(null));
    },
    code: {
      applyPlan($insert, val) {
        $insert.set("code", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    title: {
      applyPlan($insert, val) {
        $insert.set("title", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateFilmByCodeInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    code: undefined,
    filmPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  UpdateStudioPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    studio($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    studioEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = studiosUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_studiosPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("StudiosOrderBy"));
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
  UpdateStudioInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined,
    studioPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  StudioPatch: {
    "__inputPlan": function StudioPatch_inputPlan() {
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
    }
  },
  UpdateStudioByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined,
    studioPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  UpdatePostPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    post($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
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
            const spec = postUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_postPgResource.find(spec);
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
    },
    author($record) {
      return pgResource_personPgResource.get({
        id: $record.get("result").get("author_id")
      });
    }
  },
  UpdatePostInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined,
    postPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  PostPatch: {
    "__inputPlan": function PostPatch_inputPlan() {
      return object(Object.create(null));
    },
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    body: {
      applyPlan($insert, val) {
        $insert.set("body", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    authorId: {
      applyPlan($insert, val) {
        $insert.set("author_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdatePostByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined,
    postPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  UpdateTvEpisodePayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    tvEpisode($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    tvEpisodeEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = tv_episodesUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_tv_episodesPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("TvEpisodesOrderBy"));
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
    tvShowByShowId($record) {
      return pgResource_tv_showsPgResource.get({
        code: $record.get("result").get("show_id")
      });
    }
  },
  UpdateTvEpisodeInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined,
    tvEpisodePatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  TvEpisodePatch: {
    "__inputPlan": function TvEpisodePatch_inputPlan() {
      return object(Object.create(null));
    },
    code: {
      applyPlan($insert, val) {
        $insert.set("code", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    title: {
      applyPlan($insert, val) {
        $insert.set("title", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    showId: {
      applyPlan($insert, val) {
        $insert.set("show_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateTvEpisodeByCodeInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    code: undefined,
    tvEpisodePatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  UpdateTvShowPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    tvShow($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    tvShowEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = tv_showsUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_tv_showsPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("TvShowsOrderBy"));
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
    studioByStudioId($record) {
      return pgResource_studiosPgResource.get({
        id: $record.get("result").get("studio_id")
      });
    }
  },
  UpdateTvShowInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined,
    tvShowPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  TvShowPatch: {
    "__inputPlan": function TvShowPatch_inputPlan() {
      return object(Object.create(null));
    },
    code: {
      applyPlan($insert, val) {
        $insert.set("code", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    title: {
      applyPlan($insert, val) {
        $insert.set("title", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    studioId: {
      applyPlan($insert, val) {
        $insert.set("studio_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateTvShowByCodeInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    code: undefined,
    tvShowPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  UpdatePersonPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    person($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    personEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = personUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_personPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("PeopleOrderBy"));
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
  UpdatePersonInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined,
    personPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  PersonPatch: {
    "__inputPlan": function PersonPatch_inputPlan() {
      return object(Object.create(null));
    },
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    firstName: {
      applyPlan($insert, val) {
        $insert.set("first_name", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    lastName: {
      applyPlan($insert, val) {
        $insert.set("last_name", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    colNoCreate: {
      applyPlan($insert, val) {
        $insert.set("col_no_create", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    colNoOrder: {
      applyPlan($insert, val) {
        $insert.set("col_no_order", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    colNoFilter: {
      applyPlan($insert, val) {
        $insert.set("col_no_filter", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdatePersonByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined,
    personPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  DeleteStudioPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    studio($object) {
      return $object.get("result");
    },
    deletedStudioId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.Studio.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    studioEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = studiosUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_studiosPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("StudiosOrderBy"));
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
  DeleteStudioInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined
  },
  DeleteStudioByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined
  },
  DeletePostPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    post($object) {
      return $object.get("result");
    },
    deletedPostId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.Post.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
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
            const spec = postUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_postPgResource.find(spec);
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
    },
    author($record) {
      return pgResource_personPgResource.get({
        id: $record.get("result").get("author_id")
      });
    }
  },
  DeletePostInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined
  },
  DeletePostByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined
  },
  DeleteTvEpisodePayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    tvEpisode($object) {
      return $object.get("result");
    },
    deletedTvEpisodeId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.TvEpisode.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    tvEpisodeEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = tv_episodesUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_tv_episodesPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("TvEpisodesOrderBy"));
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
    tvShowByShowId($record) {
      return pgResource_tv_showsPgResource.get({
        code: $record.get("result").get("show_id")
      });
    }
  },
  DeleteTvEpisodeInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined
  },
  DeleteTvEpisodeByCodeInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    code: undefined
  },
  DeleteTvShowPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    tvShow($object) {
      return $object.get("result");
    },
    deletedTvShowId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.TvShow.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    tvShowEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = tv_showsUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_tv_showsPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("TvShowsOrderBy"));
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
    studioByStudioId($record) {
      return pgResource_studiosPgResource.get({
        id: $record.get("result").get("studio_id")
      });
    }
  },
  DeleteTvShowInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined
  },
  DeleteTvShowByCodeInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    code: undefined
  },
  DeletePersonPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    person($object) {
      return $object.get("result");
    },
    deletedPersonId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.Person.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    personEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = personUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_personPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("PeopleOrderBy"));
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
  DeletePersonInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    nodeId: undefined
  },
  DeletePersonByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined
  }
};
export const schema = makeGrafastSchema({
  typeDefs: typeDefs,
  plans: plans
});
