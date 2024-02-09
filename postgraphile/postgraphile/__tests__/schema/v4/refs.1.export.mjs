import { PgExecutor, PgSelectStep, PgUnionAllStep, TYPES, assertPgClassSingleStep, makeRegistry, recordCodec } from "@dataplan/pg";
import { ConnectionStep, SafeError, access, assertEdgeCapableStep, assertPageInfoCapableStep, connection, constant, context, getEnumValueConfig, lambda, list, makeGrafastSchema, node, object, rootValue } from "grafast";
import { sql } from "pg-sql2";
import { inspect } from "util";
function Query_queryPlan() {
  return rootValue();
}
const handler = {
  typeName: "Query",
  codec: {
    name: "raw",
    encode(value) {
      return typeof value === "string" ? value : null;
    },
    decode(value) {
      return typeof value === "string" ? value : null;
    }
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
function base64JSONDecode(value) {
  return JSON.parse(Buffer.from(value, "base64").toString("utf8"));
}
function base64JSONEncode(value) {
  return Buffer.from(JSON.stringify(value), "utf8").toString("base64");
}
const nodeIdCodecs_base64JSON_base64JSON = {
  name: "base64JSON",
  encode: base64JSONEncode,
  decode: base64JSONDecode
};
function pipeStringDecode(value) {
  return typeof value === "string" ? value.split("|") : null;
}
function pipeStringEncode(value) {
  return Array.isArray(value) ? value.join("|") : null;
}
const nodeIdCodecs = Object.assign(Object.create(null), {
  raw: handler.codec,
  base64JSON: nodeIdCodecs_base64JSON_base64JSON,
  pipeString: {
    name: "pipeString",
    encode: pipeStringEncode,
    decode: pipeStringDecode
  }
});
const peopleAttributes = Object.assign(Object.create(null), {
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
const peopleIdentifier = sql.identifier(...["refs", "people"]);
const peopleCodecSpec = {
  name: "people",
  identifier: peopleIdentifier,
  attributes: peopleAttributes,
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "refs",
      name: "people"
    },
    tags: Object.create(null)
  },
  executor: executor_mainPgExecutor
};
const peopleCodec = recordCodec(peopleCodecSpec);
const postsAttributes = Object.assign(Object.create(null), {
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
        behavior: ["-*"]
      }
    }
  }
});
const extensions2 = {
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "refs",
    name: "posts"
  },
  tags: Object.assign(Object.create(null), {
    ref: "author via:(user_id)->people(id) singular"
  }),
  refDefinitions: Object.assign(Object.create(null), {
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
  })
};
const parts2 = ["refs", "posts"];
const postsIdentifier = sql.identifier(...parts2);
const postsCodecSpec = {
  name: "posts",
  identifier: postsIdentifier,
  attributes: postsAttributes,
  description: undefined,
  extensions: extensions2,
  executor: executor_mainPgExecutor
};
const postsCodec = recordCodec(postsCodecSpec);
const extensions3 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "refs",
    name: "people"
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
const registryConfig_pgResources_people_people = {
  executor: executor_mainPgExecutor,
  name: "people",
  identifier: "main.refs.people",
  from: peopleCodec.sqlType,
  codec: peopleCodec,
  uniques,
  isVirtual: false,
  description: undefined,
  extensions: extensions3
};
const extensions4 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "refs",
    name: "posts"
  },
  tags: {
    ref: "author via:(user_id)->people(id) singular"
  }
};
const uniques2 = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_posts_posts = {
  executor: executor_mainPgExecutor,
  name: "posts",
  identifier: "main.refs.posts",
  from: postsCodec.sqlType,
  codec: postsCodec,
  uniques: uniques2,
  isVirtual: false,
  description: undefined,
  extensions: extensions4
};
const registry = makeRegistry({
  pgCodecs: Object.assign(Object.create(null), {
    text: TYPES.text,
    varchar: TYPES.varchar,
    bpchar: TYPES.bpchar,
    int4: TYPES.int,
    people: peopleCodec,
    posts: postsCodec
  }),
  pgResources: Object.assign(Object.create(null), {
    people: registryConfig_pgResources_people_people,
    posts: registryConfig_pgResources_posts_posts
  }),
  pgRelations: Object.assign(Object.create(null), {
    people: Object.assign(Object.create(null), {
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
            behavior: ["-select", "-*"]
          }
        }
      }
    }),
    posts: Object.assign(Object.create(null), {
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
            behavior: ["-select", "-*"]
          }
        }
      }
    })
  })
});
const pgResource_peoplePgResource = registry.pgResources["people"];
const pgResource_postsPgResource = registry.pgResources["posts"];
const nodeIdHandlerByTypeName = Object.assign(Object.create(null), {
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
        id: access($list, [1])
      };
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
        id: access($list, [1])
      };
    },
    get(spec) {
      return pgResource_postsPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "posts";
    }
  }
});
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
function Query_allPeople_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allPeople_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Query_allPeople_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allPeople_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Query_allPeople_after_applyPlan(_, $connection, val) {
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
function Query_allPosts_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allPosts_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Query_allPosts_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allPosts_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Query_allPosts_after_applyPlan(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
function PeopleConnection_nodesPlan($connection) {
  return $connection.nodes();
}
function PeopleConnection_edgesPlan($connection) {
  return $connection.edges();
}
function PeopleConnection_pageInfoPlan($connection) {
  // TYPES: why is this a TypeScript issue without the 'any'?
  return $connection.pageInfo();
}
function PageInfo_hasNextPagePlan($pageInfo) {
  return $pageInfo.hasNextPage();
}
function PageInfo_hasPreviousPagePlan($pageInfo) {
  return $pageInfo.hasPreviousPage();
}
function PostsConnection_nodesPlan($connection) {
  return $connection.nodes();
}
function PostsConnection_edgesPlan($connection) {
  return $connection.edges();
}
function PostsConnection_pageInfoPlan($connection) {
  // TYPES: why is this a TypeScript issue without the 'any'?
  return $connection.pageInfo();
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
    query: Query_queryPlan,
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
    personById: {
      plan(_$root, args) {
        return pgResource_peoplePgResource.get({
          id: args.get("id")
        });
      },
      args: {
        id: undefined
      }
    },
    postById: {
      plan(_$root, args) {
        return pgResource_postsPgResource.get({
          id: args.get("id")
        });
      },
      args: {
        id: undefined
      }
    },
    person: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    post: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher2($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    allPeople: {
      plan() {
        return connection(pgResource_peoplePgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allPeople_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allPeople_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allPeople_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allPeople_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allPeople_after_applyPlan
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
    },
    allPosts: {
      plan() {
        return connection(pgResource_postsPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allPosts_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allPosts_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allPosts_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allPosts_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allPosts_after_applyPlan
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
    nodes: PeopleConnection_nodesPlan,
    edges: PeopleConnection_edgesPlan,
    pageInfo: PeopleConnection_pageInfoPlan,
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
  PeopleOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        uniques[0].attributes.forEach(attributeName => {
          const attribute = peopleCodec.attributes[attributeName];
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
          const attribute = peopleCodec.attributes[attributeName];
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
              return sql`${expression} = ${$condition.placeholder(val.get(), peopleAttributes.id.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), peopleAttributes.name.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  PostsConnection: {
    __assertStep: ConnectionStep,
    nodes: PostsConnection_nodesPlan,
    edges: PostsConnection_edgesPlan,
    pageInfo: PostsConnection_pageInfoPlan,
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
        uniques2[0].attributes.forEach(attributeName => {
          const attribute = postsCodec.attributes[attributeName];
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
          const attribute = postsCodec.attributes[attributeName];
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
              return sql`${expression} = ${$condition.placeholder(val.get(), postsAttributes.id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  }
};
export const schema = makeGrafastSchema({
  typeDefs: typeDefs,
  plans: plans
});
