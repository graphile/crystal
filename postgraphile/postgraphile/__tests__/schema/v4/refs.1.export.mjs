import { PgExecutor, TYPES, assertPgClassSingleStep, enumCodec, makeRegistry, recordCodec, sqlValueWithCodec } from "@dataplan/pg";
import { ConnectionStep, access, connection, constant, context, get as get2, inhibitOnNull, inspect, lambda, list, makeDecodeNodeId, makeGrafastSchema, object, rootValue } from "grafast";
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
const bookAuthorsIdentifier = sql.identifier("refs", "book_authors");
const bookAuthorsCodec = recordCodec({
  name: "bookAuthors",
  identifier: bookAuthorsIdentifier,
  attributes: {
    __proto__: null,
    book_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    pen_name_id: {
      description: undefined,
      codec: TYPES.int,
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
      schemaName: "refs",
      name: "book_authors"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const bookEditorsIdentifier = sql.identifier("refs", "book_editors");
const bookEditorsCodec = recordCodec({
  name: "bookEditors",
  identifier: bookEditorsIdentifier,
  attributes: {
    __proto__: null,
    book_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    person_id: {
      description: undefined,
      codec: TYPES.int,
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
      schemaName: "refs",
      name: "book_editors"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const booksIdentifier = sql.identifier("refs", "books");
const spec_books = {
  name: "books",
  identifier: booksIdentifier,
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
    title: {
      description: undefined,
      codec: TYPES.text,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    isbn: {
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
      schemaName: "refs",
      name: "books"
    },
    tags: {
      __proto__: null,
      ref: ["relatedPeople to:Person plural", "editors to:Person plural"],
      refVia: ["relatedPeople via:(id)->book_authors(book_id);(pen_name_id)->pen_names(id);(person_id)->people(id)", "relatedPeople via:(id)->book_editors(book_id);(person_id)->people(id)", "editors via:(id)->book_editors(book_id);(person_id)->people(id)"]
    },
    refDefinitions: {
      __proto__: null,
      relatedPeople: {
        singular: false,
        graphqlType: "Person",
        sourceGraphqlType: undefined,
        extensions: {
          via: undefined,
          tags: {
            behavior: undefined
          }
        }
      },
      editors: {
        singular: false,
        graphqlType: "Person",
        sourceGraphqlType: undefined,
        extensions: {
          via: undefined,
          tags: {
            behavior: undefined
          }
        }
      }
    }
  },
  executor: executor
};
const booksCodec = recordCodec(spec_books);
const penNamesIdentifier = sql.identifier("refs", "pen_names");
const penNamesCodec = recordCodec({
  name: "penNames",
  identifier: penNamesIdentifier,
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
    pen_name: {
      description: undefined,
      codec: TYPES.text,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    person_id: {
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
      schemaName: "refs",
      name: "pen_names"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const peopleIdentifier = sql.identifier("refs", "people");
const peopleCodec = recordCodec({
  name: "people",
  identifier: peopleIdentifier,
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
      schemaName: "refs",
      name: "people"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const postsIdentifier = sql.identifier("refs", "posts");
const postsCodec = recordCodec({
  name: "posts",
  identifier: postsIdentifier,
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
    user_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
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
      schemaName: "refs",
      name: "posts"
    },
    tags: {
      __proto__: null,
      ref: "author via:(user_id)->people(id) singular"
    },
    refDefinitions: {
      __proto__: null,
      author: {
        singular: true,
        graphqlType: undefined,
        sourceGraphqlType: undefined,
        extensions: {
          via: "(user_id)->people(id)",
          tags: {
            behavior: undefined
          }
        }
      }
    }
  },
  executor: executor
});
const book_authorsUniques = [{
  isPrimary: true,
  attributes: ["book_id", "pen_name_id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const registryConfig_pgResources_book_authors_book_authors = {
  executor: executor,
  name: "book_authors",
  identifier: "main.refs.book_authors",
  from: bookAuthorsIdentifier,
  codec: bookAuthorsCodec,
  uniques: book_authorsUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "refs",
      name: "book_authors"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {}
  }
};
const book_editorsUniques = [{
  isPrimary: true,
  attributes: ["book_id", "person_id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const registryConfig_pgResources_book_editors_book_editors = {
  executor: executor,
  name: "book_editors",
  identifier: "main.refs.book_editors",
  from: bookEditorsIdentifier,
  codec: bookEditorsCodec,
  uniques: book_editorsUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "refs",
      name: "book_editors"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {}
  }
};
const peopleUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const registryConfig_pgResources_people_people = {
  executor: executor,
  name: "people",
  identifier: "main.refs.people",
  from: peopleIdentifier,
  codec: peopleCodec,
  uniques: peopleUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "refs",
      name: "people"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {}
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
const registryConfig_pgResources_posts_posts = {
  executor: executor,
  name: "posts",
  identifier: "main.refs.posts",
  from: postsIdentifier,
  codec: postsCodec,
  uniques: postsUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "refs",
      name: "posts"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {
      ref: "author via:(user_id)->people(id) singular"
    }
  }
};
const booksUniques = [{
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
  attributes: ["isbn"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const registryConfig_pgResources_books_books = {
  executor: executor,
  name: "books",
  identifier: "main.refs.books",
  from: booksIdentifier,
  codec: booksCodec,
  uniques: booksUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "refs",
      name: "books"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {
      ref: spec_books.extensions.tags.ref,
      refVia: spec_books.extensions.tags.refVia
    }
  }
};
const pen_namesUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const registryConfig_pgResources_pen_names_pen_names = {
  executor: executor,
  name: "pen_names",
  identifier: "main.refs.pen_names",
  from: penNamesIdentifier,
  codec: penNamesCodec,
  uniques: pen_namesUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "refs",
      name: "pen_names"
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
    text: TYPES.text,
    varchar: TYPES.varchar,
    bpchar: TYPES.bpchar,
    int4: TYPES.int,
    bookAuthors: bookAuthorsCodec,
    bookEditors: bookEditorsCodec,
    books: booksCodec,
    penNames: penNamesCodec,
    people: peopleCodec,
    posts: postsCodec,
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
    book_authors: registryConfig_pgResources_book_authors_book_authors,
    book_editors: registryConfig_pgResources_book_editors_book_editors,
    people: registryConfig_pgResources_people_people,
    posts: registryConfig_pgResources_posts_posts,
    books: registryConfig_pgResources_books_books,
    pen_names: registryConfig_pgResources_pen_names_pen_names
  },
  pgRelations: {
    __proto__: null,
    bookAuthors: {
      __proto__: null,
      booksByMyBookId: {
        localCodec: bookAuthorsCodec,
        remoteResourceOptions: registryConfig_pgResources_books_books,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["book_id"],
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
      penNamesByMyPenNameId: {
        localCodec: bookAuthorsCodec,
        remoteResourceOptions: registryConfig_pgResources_pen_names_pen_names,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["pen_name_id"],
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
    bookEditors: {
      __proto__: null,
      booksByMyBookId: {
        localCodec: bookEditorsCodec,
        remoteResourceOptions: registryConfig_pgResources_books_books,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["book_id"],
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
      peopleByMyPersonId: {
        localCodec: bookEditorsCodec,
        remoteResourceOptions: registryConfig_pgResources_people_people,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["person_id"],
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
    books: {
      __proto__: null,
      bookAuthorsByTheirBookId: {
        localCodec: booksCodec,
        remoteResourceOptions: registryConfig_pgResources_book_authors_book_authors,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["book_id"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      bookEditorsByTheirBookId: {
        localCodec: booksCodec,
        remoteResourceOptions: registryConfig_pgResources_book_editors_book_editors,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["book_id"],
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
    penNames: {
      __proto__: null,
      peopleByMyPersonId: {
        localCodec: penNamesCodec,
        remoteResourceOptions: registryConfig_pgResources_people_people,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["person_id"],
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
      bookAuthorsByTheirPenNameId: {
        localCodec: penNamesCodec,
        remoteResourceOptions: registryConfig_pgResources_book_authors_book_authors,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["pen_name_id"],
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
    people: {
      __proto__: null,
      postsByTheirUserId: {
        localCodec: peopleCodec,
        remoteResourceOptions: registryConfig_pgResources_posts_posts,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["user_id"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            omit: true,
            behavior: ["-select", "-insert -select -node -connection -list -array -single -update -delete -queryField -mutationField -typeField -filter -filterBy -order -orderBy -query:resource:list -query:resource:connection -singularRelation:resource:list -singularRelation:resource:connection -manyRelation:resource:list -manyRelation:resource:connection -manyToMany"]
          }
        }
      },
      penNamesByTheirPersonId: {
        localCodec: peopleCodec,
        remoteResourceOptions: registryConfig_pgResources_pen_names_pen_names,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["person_id"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      bookEditorsByTheirPersonId: {
        localCodec: peopleCodec,
        remoteResourceOptions: registryConfig_pgResources_book_editors_book_editors,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["person_id"],
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
    posts: {
      __proto__: null,
      peopleByMyUserId: {
        localCodec: postsCodec,
        remoteResourceOptions: registryConfig_pgResources_people_people,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["user_id"],
        remoteAttributes: ["id"],
        isUnique: true,
        isReferencee: false,
        description: undefined,
        extensions: {
          tags: {
            omit: true,
            behavior: ["-select", "-insert -select -node -connection -list -array -single -update -delete -queryField -mutationField -typeField -filter -filterBy -order -orderBy -query:resource:list -query:resource:connection -singularRelation:resource:list -singularRelation:resource:connection -manyRelation:resource:list -manyRelation:resource:connection -manyToMany"]
          }
        }
      }
    }
  }
});
const resource_book_authorsPgResource = registry.pgResources["book_authors"];
const resource_book_editorsPgResource = registry.pgResources["book_editors"];
const resource_peoplePgResource = registry.pgResources["people"];
const resource_postsPgResource = registry.pgResources["posts"];
const resource_booksPgResource = registry.pgResources["books"];
const resource_pen_namesPgResource = registry.pgResources["pen_names"];
const nodeIdHandler_BookAuthor = {
  typeName: "BookAuthor",
  codec: nodeIdCodecs_base64JSON_base64JSON,
  deprecationReason: undefined,
  plan($record) {
    return list([constant("book_authors", false), $record.get("book_id"), $record.get("pen_name_id")]);
  },
  getSpec($list) {
    return {
      book_id: inhibitOnNull(access($list, [1])),
      pen_name_id: inhibitOnNull(access($list, [2]))
    };
  },
  getIdentifiers(value) {
    return value.slice(1);
  },
  get(spec) {
    return resource_book_authorsPgResource.get(spec);
  },
  match(obj) {
    return obj[0] === "book_authors";
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
const nodeFetcher_BookAuthor = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_BookAuthor));
  return nodeIdHandler_BookAuthor.get(nodeIdHandler_BookAuthor.getSpec($decoded));
};
const nodeIdHandler_BookEditor = {
  typeName: "BookEditor",
  codec: nodeIdCodecs_base64JSON_base64JSON,
  deprecationReason: undefined,
  plan($record) {
    return list([constant("book_editors", false), $record.get("book_id"), $record.get("person_id")]);
  },
  getSpec($list) {
    return {
      book_id: inhibitOnNull(access($list, [1])),
      person_id: inhibitOnNull(access($list, [2]))
    };
  },
  getIdentifiers(value) {
    return value.slice(1);
  },
  get(spec) {
    return resource_book_editorsPgResource.get(spec);
  },
  match(obj) {
    return obj[0] === "book_editors";
  }
};
const nodeFetcher_BookEditor = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_BookEditor));
  return nodeIdHandler_BookEditor.get(nodeIdHandler_BookEditor.getSpec($decoded));
};
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
    return resource_peoplePgResource.get(spec);
  },
  match(obj) {
    return obj[0] === "people";
  }
};
const nodeFetcher_Person = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Person));
  return nodeIdHandler_Person.get(nodeIdHandler_Person.getSpec($decoded));
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
    return resource_postsPgResource.get(spec);
  },
  match(obj) {
    return obj[0] === "posts";
  }
};
const nodeFetcher_Post = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Post));
  return nodeIdHandler_Post.get(nodeIdHandler_Post.getSpec($decoded));
};
const nodeIdHandler_Book = {
  typeName: "Book",
  codec: nodeIdCodecs_base64JSON_base64JSON,
  deprecationReason: undefined,
  plan($record) {
    return list([constant("books", false), $record.get("id")]);
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
    return resource_booksPgResource.get(spec);
  },
  match(obj) {
    return obj[0] === "books";
  }
};
const nodeFetcher_Book = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Book));
  return nodeIdHandler_Book.get(nodeIdHandler_Book.getSpec($decoded));
};
const nodeIdHandler_PenName = {
  typeName: "PenName",
  codec: nodeIdCodecs_base64JSON_base64JSON,
  deprecationReason: undefined,
  plan($record) {
    return list([constant("pen_names", false), $record.get("id")]);
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
    return resource_pen_namesPgResource.get(spec);
  },
  match(obj) {
    return obj[0] === "pen_names";
  }
};
const nodeFetcher_PenName = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_PenName));
  return nodeIdHandler_PenName.get(nodeIdHandler_PenName.getSpec($decoded));
};
function qbWhereBuilder(qb) {
  return qb.whereBuilder();
}
const nodeIdHandlerByTypeName = {
  __proto__: null,
  Query: nodeIdHandler_Query,
  BookAuthor: nodeIdHandler_BookAuthor,
  BookEditor: nodeIdHandler_BookEditor,
  Person: nodeIdHandler_Person,
  Post: nodeIdHandler_Post,
  Book: nodeIdHandler_Book,
  PenName: nodeIdHandler_PenName
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

  """Get a single \`BookAuthor\`."""
  bookAuthorByBookIdAndPenNameId(bookId: Int!, penNameId: Int!): BookAuthor

  """Get a single \`BookEditor\`."""
  bookEditorByBookIdAndPersonId(bookId: Int!, personId: Int!): BookEditor

  """Get a single \`Person\`."""
  personById(id: Int!): Person

  """Get a single \`Post\`."""
  postById(id: Int!): Post

  """Get a single \`Book\`."""
  bookById(id: Int!): Book

  """Get a single \`Book\`."""
  bookByIsbn(isbn: String!): Book

  """Get a single \`PenName\`."""
  penNameById(id: Int!): PenName

  """Reads a single \`BookAuthor\` using its globally unique \`ID\`."""
  bookAuthor(
    """
    The globally unique \`ID\` to be used in selecting a single \`BookAuthor\`.
    """
    nodeId: ID!
  ): BookAuthor

  """Reads a single \`BookEditor\` using its globally unique \`ID\`."""
  bookEditor(
    """
    The globally unique \`ID\` to be used in selecting a single \`BookEditor\`.
    """
    nodeId: ID!
  ): BookEditor

  """Reads a single \`Person\` using its globally unique \`ID\`."""
  person(
    """The globally unique \`ID\` to be used in selecting a single \`Person\`."""
    nodeId: ID!
  ): Person

  """Reads a single \`Post\` using its globally unique \`ID\`."""
  post(
    """The globally unique \`ID\` to be used in selecting a single \`Post\`."""
    nodeId: ID!
  ): Post

  """Reads a single \`Book\` using its globally unique \`ID\`."""
  book(
    """The globally unique \`ID\` to be used in selecting a single \`Book\`."""
    nodeId: ID!
  ): Book

  """Reads a single \`PenName\` using its globally unique \`ID\`."""
  penName(
    """The globally unique \`ID\` to be used in selecting a single \`PenName\`."""
    nodeId: ID!
  ): PenName

  """Reads and enables pagination through a set of \`BookAuthor\`."""
  allBookAuthors(
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
    condition: BookAuthorCondition

    """The method to use when ordering \`BookAuthor\`."""
    orderBy: [BookAuthorsOrderBy!] = [PRIMARY_KEY_ASC]
  ): BookAuthorsConnection

  """Reads and enables pagination through a set of \`BookEditor\`."""
  allBookEditors(
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
    condition: BookEditorCondition

    """The method to use when ordering \`BookEditor\`."""
    orderBy: [BookEditorsOrderBy!] = [PRIMARY_KEY_ASC]
  ): BookEditorsConnection

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

  """Reads and enables pagination through a set of \`Book\`."""
  allBooks(
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
    condition: BookCondition

    """The method to use when ordering \`Book\`."""
    orderBy: [BooksOrderBy!] = [PRIMARY_KEY_ASC]
  ): BooksConnection

  """Reads and enables pagination through a set of \`PenName\`."""
  allPenNames(
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
    condition: PenNameCondition

    """The method to use when ordering \`PenName\`."""
    orderBy: [PenNamesOrderBy!] = [PRIMARY_KEY_ASC]
  ): PenNamesConnection
}

"""An object with a globally unique \`ID\`."""
interface Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
}

type BookAuthor implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  bookId: Int!
  penNameId: Int!

  """Reads a single \`Book\` that is related to this \`BookAuthor\`."""
  bookByBookId: Book

  """Reads a single \`PenName\` that is related to this \`BookAuthor\`."""
  penNameByPenNameId: PenName
}

type Book implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  title: String!
  isbn: String

  """Reads and enables pagination through a set of \`BookAuthor\`."""
  bookAuthorsByBookId(
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
    condition: BookAuthorCondition

    """The method to use when ordering \`BookAuthor\`."""
    orderBy: [BookAuthorsOrderBy!] = [PRIMARY_KEY_ASC]
  ): BookAuthorsConnection!

  """Reads and enables pagination through a set of \`BookEditor\`."""
  bookEditorsByBookId(
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
    condition: BookEditorCondition

    """The method to use when ordering \`BookEditor\`."""
    orderBy: [BookEditorsOrderBy!] = [PRIMARY_KEY_ASC]
  ): BookEditorsConnection!

  """Reads and enables pagination through a set of \`Person\`."""
  relatedPeople(
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
  ): PeopleConnection!

  """Reads and enables pagination through a set of \`Person\`."""
  editors(
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
  ): PeopleConnection!
}

"""A connection to a list of \`BookAuthor\` values."""
type BookAuthorsConnection {
  """A list of \`BookAuthor\` objects."""
  nodes: [BookAuthor]!

  """
  A list of edges which contains the \`BookAuthor\` and cursor to aid in pagination.
  """
  edges: [BookAuthorsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`BookAuthor\` you could get from the connection."""
  totalCount: Int!
}

"""A \`BookAuthor\` edge in the connection."""
type BookAuthorsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`BookAuthor\` at the end of the edge."""
  node: BookAuthor
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
A condition to be used against \`BookAuthor\` object types. All fields are tested
for equality and combined with a logical ‘and.’
"""
input BookAuthorCondition {
  """Checks for equality with the object’s \`bookId\` field."""
  bookId: Int

  """Checks for equality with the object’s \`penNameId\` field."""
  penNameId: Int
}

"""Methods to use when ordering \`BookAuthor\`."""
enum BookAuthorsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  BOOK_ID_ASC
  BOOK_ID_DESC
  PEN_NAME_ID_ASC
  PEN_NAME_ID_DESC
}

"""A connection to a list of \`BookEditor\` values."""
type BookEditorsConnection {
  """A list of \`BookEditor\` objects."""
  nodes: [BookEditor]!

  """
  A list of edges which contains the \`BookEditor\` and cursor to aid in pagination.
  """
  edges: [BookEditorsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`BookEditor\` you could get from the connection."""
  totalCount: Int!
}

type BookEditor implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  bookId: Int!
  personId: Int!

  """Reads a single \`Book\` that is related to this \`BookEditor\`."""
  bookByBookId: Book

  """Reads a single \`Person\` that is related to this \`BookEditor\`."""
  personByPersonId: Person
}

type Person implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  name: String!

  """Reads and enables pagination through a set of \`PenName\`."""
  penNamesByPersonId(
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
    condition: PenNameCondition

    """The method to use when ordering \`PenName\`."""
    orderBy: [PenNamesOrderBy!] = [PRIMARY_KEY_ASC]
  ): PenNamesConnection!

  """Reads and enables pagination through a set of \`BookEditor\`."""
  bookEditorsByPersonId(
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
    condition: BookEditorCondition

    """The method to use when ordering \`BookEditor\`."""
    orderBy: [BookEditorsOrderBy!] = [PRIMARY_KEY_ASC]
  ): BookEditorsConnection!
}

"""A connection to a list of \`PenName\` values."""
type PenNamesConnection {
  """A list of \`PenName\` objects."""
  nodes: [PenName]!

  """
  A list of edges which contains the \`PenName\` and cursor to aid in pagination.
  """
  edges: [PenNamesEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`PenName\` you could get from the connection."""
  totalCount: Int!
}

type PenName implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  penName: String!
  personId: Int

  """Reads a single \`Person\` that is related to this \`PenName\`."""
  personByPersonId: Person

  """Reads and enables pagination through a set of \`BookAuthor\`."""
  bookAuthorsByPenNameId(
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
    condition: BookAuthorCondition

    """The method to use when ordering \`BookAuthor\`."""
    orderBy: [BookAuthorsOrderBy!] = [PRIMARY_KEY_ASC]
  ): BookAuthorsConnection!
}

"""A \`PenName\` edge in the connection."""
type PenNamesEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`PenName\` at the end of the edge."""
  node: PenName
}

"""
A condition to be used against \`PenName\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input PenNameCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`penName\` field."""
  penName: String

  """Checks for equality with the object’s \`personId\` field."""
  personId: Int
}

"""Methods to use when ordering \`PenName\`."""
enum PenNamesOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  PEN_NAME_ASC
  PEN_NAME_DESC
  PERSON_ID_ASC
  PERSON_ID_DESC
}

"""
A condition to be used against \`BookEditor\` object types. All fields are tested
for equality and combined with a logical ‘and.’
"""
input BookEditorCondition {
  """Checks for equality with the object’s \`bookId\` field."""
  bookId: Int

  """Checks for equality with the object’s \`personId\` field."""
  personId: Int
}

"""Methods to use when ordering \`BookEditor\`."""
enum BookEditorsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  BOOK_ID_ASC
  BOOK_ID_DESC
  PERSON_ID_ASC
  PERSON_ID_DESC
}

"""A \`BookEditor\` edge in the connection."""
type BookEditorsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`BookEditor\` at the end of the edge."""
  node: BookEditor
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
}

type Post implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!

  """Reads a single \`Person\` that is related to this \`Post\`."""
  author: Person!
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
}

"""Methods to use when ordering \`Post\`."""
enum PostsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
}

"""A connection to a list of \`Book\` values."""
type BooksConnection {
  """A list of \`Book\` objects."""
  nodes: [Book]!

  """
  A list of edges which contains the \`Book\` and cursor to aid in pagination.
  """
  edges: [BooksEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Book\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Book\` edge in the connection."""
type BooksEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Book\` at the end of the edge."""
  node: Book
}

"""
A condition to be used against \`Book\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input BookCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`title\` field."""
  title: String

  """Checks for equality with the object’s \`isbn\` field."""
  isbn: String
}

"""Methods to use when ordering \`Book\`."""
enum BooksOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  TITLE_ASC
  TITLE_DESC
  ISBN_ASC
  ISBN_DESC
}`;
export const objects = {
  Query: {
    assertStep() {
      return true;
    },
    plans: {
      allBookAuthors: {
        plan() {
          return connection(resource_book_authorsPgResource.find());
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
      allBookEditors: {
        plan() {
          return connection(resource_book_editorsPgResource.find());
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
      allBooks: {
        plan() {
          return connection(resource_booksPgResource.find());
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
      allPenNames: {
        plan() {
          return connection(resource_pen_namesPgResource.find());
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
          return connection(resource_peoplePgResource.find());
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
      book(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_Book($nodeId);
      },
      bookAuthor(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_BookAuthor($nodeId);
      },
      bookAuthorByBookIdAndPenNameId(_$root, {
        $bookId,
        $penNameId
      }) {
        return resource_book_authorsPgResource.get({
          book_id: $bookId,
          pen_name_id: $penNameId
        });
      },
      bookById(_$root, {
        $id
      }) {
        return resource_booksPgResource.get({
          id: $id
        });
      },
      bookByIsbn(_$root, {
        $isbn
      }) {
        return resource_booksPgResource.get({
          isbn: $isbn
        });
      },
      bookEditor(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_BookEditor($nodeId);
      },
      bookEditorByBookIdAndPersonId(_$root, {
        $bookId,
        $personId
      }) {
        return resource_book_editorsPgResource.get({
          book_id: $bookId,
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
      penName(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_PenName($nodeId);
      },
      penNameById(_$root, {
        $id
      }) {
        return resource_pen_namesPgResource.get({
          id: $id
        });
      },
      person(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_Person($nodeId);
      },
      personById(_$root, {
        $id
      }) {
        return resource_peoplePgResource.get({
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
      query() {
        return rootValue();
      }
    }
  },
  Book: {
    assertStep: assertPgClassSingleStep,
    plans: {
      bookAuthorsByBookId: {
        plan($record) {
          const $records = resource_book_authorsPgResource.find({
            book_id: $record.get("id")
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
      bookEditorsByBookId: {
        plan($record) {
          const $records = resource_book_editorsPgResource.find({
            book_id: $record.get("id")
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
      editors: {
        plan($record) {
          const $people = resource_peoplePgResource.find();
          let previousAlias = $people.alias;
          const book_editorsAlias = sql.identifier(Symbol("book_editors"));
          $people.join({
            type: "inner",
            from: resource_book_editorsPgResource.from,
            alias: book_editorsAlias,
            conditions: [sql`${previousAlias}.${sql.identifier("id")} = ${book_editorsAlias}.${sql.identifier("person_id")}`]
          });
          previousAlias = book_editorsAlias;
          $people.where(sql`${previousAlias}.${sql.identifier("book_id")} = ${$people.placeholder($record.get("id"))}`);
          return connection($people);
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
        const specifier = nodeIdHandler_Book.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Book.codec.name].encode);
      },
      relatedPeople: {
        plan($record) {
          const $people = resource_peoplePgResource.find();
          const subquery = sql.identifier(Symbol('subquery'));
          const selects = [];
          selects.push(sql`select __l1__.${sql.identifier("person_id")} as "0"
from ${resource_pen_namesPgResource.from} as __l1__
inner join ${resource_book_authorsPgResource.from} as __l0__
on (__l0__.${sql.identifier("pen_name_id")} = __l1__.${sql.identifier("id")})
where __l0__.${sql.identifier("book_id")} = ${$people.placeholder($record.get("id"))}`);
          selects.push(sql`select __l0__.${sql.identifier("person_id")} as "0"
from ${resource_book_editorsPgResource.from} as __l0__
where __l0__.${sql.identifier("book_id")} = ${$people.placeholder($record.get("id"))}`);
          $people.join({
            type: "inner",
            from: sql`(${sql.indent(sql.join(selects.map(s => sql.indent(s)), '\n\nunion all\n\n'))})`,
            alias: subquery,
            conditions: [sql`${$people.alias}.${sql.identifier("id")} = ${subquery}."0"`]
          });
          return connection($people);
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
      for (const pkCol of booksUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_booksPgResource.get(spec);
    }
  },
  BookAuthor: {
    assertStep: assertPgClassSingleStep,
    plans: {
      bookByBookId($record) {
        return resource_booksPgResource.get({
          id: $record.get("book_id")
        });
      },
      bookId($record) {
        return $record.get("book_id");
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_BookAuthor.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_BookAuthor.codec.name].encode);
      },
      penNameByPenNameId($record) {
        return resource_pen_namesPgResource.get({
          id: $record.get("pen_name_id")
        });
      },
      penNameId($record) {
        return $record.get("pen_name_id");
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of book_authorsUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_book_authorsPgResource.get(spec);
    }
  },
  BookAuthorsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
      }
    }
  },
  BookEditor: {
    assertStep: assertPgClassSingleStep,
    plans: {
      bookByBookId($record) {
        return resource_booksPgResource.get({
          id: $record.get("book_id")
        });
      },
      bookId($record) {
        return $record.get("book_id");
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_BookEditor.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_BookEditor.codec.name].encode);
      },
      personByPersonId($record) {
        return resource_peoplePgResource.get({
          id: $record.get("person_id")
        });
      },
      personId($record) {
        return $record.get("person_id");
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of book_editorsUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_book_editorsPgResource.get(spec);
    }
  },
  BookEditorsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
      }
    }
  },
  BooksConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
      }
    }
  },
  PenName: {
    assertStep: assertPgClassSingleStep,
    plans: {
      bookAuthorsByPenNameId: {
        plan($record) {
          const $records = resource_book_authorsPgResource.find({
            pen_name_id: $record.get("id")
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
        const specifier = nodeIdHandler_PenName.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_PenName.codec.name].encode);
      },
      penName($record) {
        return $record.get("pen_name");
      },
      personByPersonId($record) {
        return resource_peoplePgResource.get({
          id: $record.get("person_id")
        });
      },
      personId($record) {
        return $record.get("person_id");
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of pen_namesUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_pen_namesPgResource.get(spec);
    }
  },
  PenNamesConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
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
      bookEditorsByPersonId: {
        plan($record) {
          const $records = resource_book_editorsPgResource.find({
            person_id: $record.get("id")
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
        const specifier = nodeIdHandler_Person.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Person.codec.name].encode);
      },
      penNamesByPersonId: {
        plan($record) {
          const $records = resource_pen_namesPgResource.find({
            person_id: $record.get("id")
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
      for (const pkCol of peopleUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_peoplePgResource.get(spec);
    }
  },
  Post: {
    assertStep: assertPgClassSingleStep,
    plans: {
      author($record) {
        return resource_peoplePgResource.get({
          id: $record.get("user_id")
        });
      },
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
  BookAuthorCondition: {
    plans: {
      bookId($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "book_id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
      },
      penNameId($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "pen_name_id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
      }
    }
  },
  BookCondition: {
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
      isbn($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "isbn",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
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
      }
    }
  },
  BookEditorCondition: {
    plans: {
      bookId($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "book_id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
      },
      personId($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "person_id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
      }
    }
  },
  PenNameCondition: {
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
      penName($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "pen_name",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
          }
        });
      },
      personId($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "person_id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
      }
    }
  },
  PersonCondition: {
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
  PostCondition: {
    plans: {
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
  BookAuthorsOrderBy: {
    values: {
      BOOK_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "book_id",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      BOOK_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "book_id",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
      },
      PEN_NAME_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "pen_name_id",
          direction: "ASC"
        });
      },
      PEN_NAME_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "pen_name_id",
          direction: "DESC"
        });
      },
      PRIMARY_KEY_ASC(queryBuilder) {
        book_authorsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        book_authorsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      }
    }
  },
  BookEditorsOrderBy: {
    values: {
      BOOK_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "book_id",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      BOOK_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "book_id",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
      },
      PERSON_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "person_id",
          direction: "ASC"
        });
      },
      PERSON_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "person_id",
          direction: "DESC"
        });
      },
      PRIMARY_KEY_ASC(queryBuilder) {
        book_editorsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        book_editorsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      }
    }
  },
  BooksOrderBy: {
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
      ISBN_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "isbn",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      ISBN_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "isbn",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_ASC(queryBuilder) {
        booksUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        booksUniques[0].attributes.forEach(attributeName => {
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
  PenNamesOrderBy: {
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
      PEN_NAME_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "pen_name",
          direction: "ASC"
        });
      },
      PEN_NAME_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "pen_name",
          direction: "DESC"
        });
      },
      PERSON_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "person_id",
          direction: "ASC"
        });
      },
      PERSON_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "person_id",
          direction: "DESC"
        });
      },
      PRIMARY_KEY_ASC(queryBuilder) {
        pen_namesUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        pen_namesUniques[0].attributes.forEach(attributeName => {
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
        peopleUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        peopleUniques[0].attributes.forEach(attributeName => {
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
