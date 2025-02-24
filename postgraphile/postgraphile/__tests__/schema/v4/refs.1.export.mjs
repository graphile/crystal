import { PgExecutor, TYPES, assertPgClassSingleStep, makeRegistry, recordCodec, sqlValueWithCodec } from "@dataplan/pg";
import { ConnectionStep, access, assertEdgeCapableStep, assertPageInfoCapableStep, connection, constant, context, inhibitOnNull, lambda, list, makeGrafastSchema, node, object, rootValue } from "grafast";
import { GraphQLError, Kind } from "graphql";
import { sql } from "pg-sql2";
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
    people: peopleCodec,
    posts: postsCodec
  },
  pgResources: {
    __proto__: null,
    people: registryConfig_pgResources_people_people,
    posts: registryConfig_pgResources_posts_posts
  },
  pgRelations: {
    __proto__: null,
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
const pgResource_peoplePgResource = registry.pgResources["people"];
const pgResource_postsPgResource = registry.pgResources["posts"];
const nodeIdHandlerByTypeName = {
  __proto__: null,
  Query: handler,
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
    getIdentifiers(value) {
      return value.slice(1);
    },
    get(spec) {
      return pgResource_peoplePgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "people";
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
    getIdentifiers(value) {
      return value.slice(1);
    },
    get(spec) {
      return pgResource_postsPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "posts";
    }
  }
};
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
})(nodeIdHandlerByTypeName.Person);
const fetcher2 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName.Post);
function qbWhereBuilder(qb) {
  return qb.whereBuilder();
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

  """Get a single \`Person\`."""
  personById(id: Int!): Person

  """Get a single \`Post\`."""
  postById(id: Int!): Post

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
}

"""An object with a globally unique \`ID\`."""
interface Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
}

type Person implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  name: String!
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

"""
A condition to be used against \`Person\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input PersonCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`name\` field."""
  name: String
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
  id: Int
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
    node(_$root, args) {
      return node(nodeIdHandlerByTypeName, args.getRaw("nodeId"));
    },
    personById(_$root, args) {
      return pgResource_peoplePgResource.get({
        id: args.getRaw("id")
      });
    },
    postById(_$root, args) {
      return pgResource_postsPgResource.get({
        id: args.getRaw("id")
      });
    },
    person(_$parent, args) {
      const $nodeId = args.getRaw("nodeId");
      return fetcher($nodeId);
    },
    post(_$parent, args) {
      const $nodeId = args.getRaw("nodeId");
      return fetcher2($nodeId);
    },
    allPeople: {
      plan() {
        return connection(pgResource_peoplePgResource.find());
      },
      args: {
        first: {
          __proto__: null,
          grafast: {
            applyPlan(_, $connection, arg) {
              $connection.setFirst(arg.getRaw());
            }
          }
        },
        last: {
          __proto__: null,
          grafast: {
            applyPlan(_, $connection, val) {
              $connection.setLast(val.getRaw());
            }
          }
        },
        offset: {
          __proto__: null,
          grafast: {
            applyPlan(_, $connection, val) {
              $connection.setOffset(val.getRaw());
            }
          }
        },
        before: {
          __proto__: null,
          grafast: {
            applyPlan(_, $connection, val) {
              $connection.setBefore(val.getRaw());
            }
          }
        },
        after: {
          __proto__: null,
          grafast: {
            applyPlan(_, $connection, val) {
              $connection.setAfter(val.getRaw());
            }
          }
        },
        orderBy: {
          __proto__: null,
          grafast: {
            applyPlan(parent, $connection, value) {
              const $select = $connection.getSubplan();
              value.apply($select);
            }
          }
        },
        condition: {
          __proto__: null,
          grafast: {
            applyPlan(_condition, $connection, arg) {
              const $select = $connection.getSubplan();
              arg.apply($select, qbWhereBuilder);
            }
          }
        }
      }
    },
    allPosts: {
      plan() {
        return connection(pgResource_postsPgResource.find());
      },
      args: {
        first: {
          __proto__: null,
          grafast: {
            applyPlan(_, $connection, arg) {
              $connection.setFirst(arg.getRaw());
            }
          }
        },
        last: {
          __proto__: null,
          grafast: {
            applyPlan(_, $connection, val) {
              $connection.setLast(val.getRaw());
            }
          }
        },
        offset: {
          __proto__: null,
          grafast: {
            applyPlan(_, $connection, val) {
              $connection.setOffset(val.getRaw());
            }
          }
        },
        before: {
          __proto__: null,
          grafast: {
            applyPlan(_, $connection, val) {
              $connection.setBefore(val.getRaw());
            }
          }
        },
        after: {
          __proto__: null,
          grafast: {
            applyPlan(_, $connection, val) {
              $connection.setAfter(val.getRaw());
            }
          }
        },
        orderBy: {
          __proto__: null,
          grafast: {
            applyPlan(parent, $connection, value) {
              const $select = $connection.getSubplan();
              value.apply($select);
            }
          }
        },
        condition: {
          __proto__: null,
          grafast: {
            applyPlan(_condition, $connection, arg) {
              const $select = $connection.getSubplan();
              arg.apply($select, qbWhereBuilder);
            }
          }
        }
      }
    }
  },
  Person: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.Person.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Person.codec.name].encode);
    },
    id($record) {
      return $record.get("id");
    },
    name($record) {
      return $record.get("name");
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
    author($record) {
      return pgResource_peoplePgResource.get({
        id: $record.get("user_id")
      });
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
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
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
  PeopleOrderBy: {
    PRIMARY_KEY_ASC: {
      extensions: {
        __proto__: null,
        grafast: {
          apply(queryBuilder) {
            peopleUniques[0].attributes.forEach(attributeName => {
              queryBuilder.orderBy({
                attribute: attributeName,
                direction: "ASC",
                ...(undefined != null ? {
                  nulls: undefined ? "LAST" : "FIRST"
                } : null)
              });
            });
            queryBuilder.setOrderIsUnique();
          }
        }
      }
    },
    PRIMARY_KEY_DESC: {
      extensions: {
        __proto__: null,
        grafast: {
          apply(queryBuilder) {
            peopleUniques[0].attributes.forEach(attributeName => {
              queryBuilder.orderBy({
                attribute: attributeName,
                direction: "DESC",
                ...(undefined != null ? {
                  nulls: undefined ? "LAST" : "FIRST"
                } : null)
              });
            });
            queryBuilder.setOrderIsUnique();
          }
        }
      }
    },
    ID_ASC: {
      extensions: {
        __proto__: null,
        grafast: {
          apply(queryBuilder) {
            queryBuilder.orderBy({
              attribute: "id",
              direction: "ASC",
              ...(undefined != null ? {
                nulls: undefined ? "LAST" : "FIRST"
              } : null)
            });
            if (true) {
              queryBuilder.setOrderIsUnique();
            }
          }
        }
      }
    },
    ID_DESC: {
      extensions: {
        __proto__: null,
        grafast: {
          apply(queryBuilder) {
            queryBuilder.orderBy({
              attribute: "id",
              direction: "DESC",
              ...(undefined != null ? {
                nulls: undefined ? "LAST" : "FIRST"
              } : null)
            });
            if (true) {
              queryBuilder.setOrderIsUnique();
            }
          }
        }
      }
    },
    NAME_ASC: {
      extensions: {
        __proto__: null,
        grafast: {
          apply(queryBuilder) {
            queryBuilder.orderBy({
              attribute: "name",
              direction: "ASC",
              ...(undefined != null ? {
                nulls: undefined ? "LAST" : "FIRST"
              } : null)
            });
            if (false) {
              queryBuilder.setOrderIsUnique();
            }
          }
        }
      }
    },
    NAME_DESC: {
      extensions: {
        __proto__: null,
        grafast: {
          apply(queryBuilder) {
            queryBuilder.orderBy({
              attribute: "name",
              direction: "DESC",
              ...(undefined != null ? {
                nulls: undefined ? "LAST" : "FIRST"
              } : null)
            });
            if (false) {
              queryBuilder.setOrderIsUnique();
            }
          }
        }
      }
    }
  },
  PersonCondition: {
    id: {
      apply($condition, val) {
        if (val === null) {
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
              return sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
            }
          });
        }
      }
    },
    name: {
      apply($condition, val) {
        if (val === null) {
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
              return sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
            }
          });
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
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
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
    PRIMARY_KEY_ASC: {
      extensions: {
        __proto__: null,
        grafast: {
          apply(queryBuilder) {
            postsUniques[0].attributes.forEach(attributeName => {
              queryBuilder.orderBy({
                attribute: attributeName,
                direction: "ASC",
                ...(undefined != null ? {
                  nulls: undefined ? "LAST" : "FIRST"
                } : null)
              });
            });
            queryBuilder.setOrderIsUnique();
          }
        }
      }
    },
    PRIMARY_KEY_DESC: {
      extensions: {
        __proto__: null,
        grafast: {
          apply(queryBuilder) {
            postsUniques[0].attributes.forEach(attributeName => {
              queryBuilder.orderBy({
                attribute: attributeName,
                direction: "DESC",
                ...(undefined != null ? {
                  nulls: undefined ? "LAST" : "FIRST"
                } : null)
              });
            });
            queryBuilder.setOrderIsUnique();
          }
        }
      }
    },
    ID_ASC: {
      extensions: {
        __proto__: null,
        grafast: {
          apply(queryBuilder) {
            queryBuilder.orderBy({
              attribute: "id",
              direction: "ASC",
              ...(undefined != null ? {
                nulls: undefined ? "LAST" : "FIRST"
              } : null)
            });
            if (true) {
              queryBuilder.setOrderIsUnique();
            }
          }
        }
      }
    },
    ID_DESC: {
      extensions: {
        __proto__: null,
        grafast: {
          apply(queryBuilder) {
            queryBuilder.orderBy({
              attribute: "id",
              direction: "DESC",
              ...(undefined != null ? {
                nulls: undefined ? "LAST" : "FIRST"
              } : null)
            });
            if (true) {
              queryBuilder.setOrderIsUnique();
            }
          }
        }
      }
    }
  },
  PostCondition: {
    id: {
      apply($condition, val) {
        if (val === null) {
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
              return sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
            }
          });
        }
      }
    }
  }
};
export const schema = makeGrafastSchema({
  typeDefs: typeDefs,
  plans: plans
});
