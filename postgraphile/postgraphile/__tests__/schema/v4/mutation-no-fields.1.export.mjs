import { PgDeleteSingleStep, PgExecutor, TYPES, assertPgClassSingleStep, enumCodec, makeRegistry, pgDeleteSingle, pgInsertSingle, pgSelectFromRecord, recordCodec, sqlValueWithCodec } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ObjectStep, __ValueStep, access, assertStep, connection, constant, context, first, get as get2, inhibitOnNull, inspect, lambda, list, makeDecodeNodeId, makeGrafastSchema, object, rootValue, specFromNodeId } from "grafast";
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
const base64JSONNodeIdCodec = {
  name: "base64JSON",
  encode: Object.assign(function base64JSONEncode(value) {
    return Buffer.from(JSON.stringify(value), "utf8").toString("base64");
  }, {
    isSyncAndSafe: true
  }),
  decode: Object.assign(function base64JSONDecode(value) {
    return JSON.parse(Buffer.from(value, "base64").toString("utf8"));
  }, {
    isSyncAndSafe: true
  })
};
const nodeIdCodecs = {
  __proto__: null,
  raw: nodeIdHandler_Query.codec,
  base64JSON: base64JSONNodeIdCodec,
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
      pgSettings: ctx.get("pgSettings"),
      withPgClient: ctx.get("withPgClient")
    });
  }
});
const citationIdentifier = sql.identifier("no_fields", "citation");
const citationCodec = recordCodec({
  name: "citation",
  identifier: citationIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        isInsertable: false,
        isUpdatable: false
      }
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "no_fields",
      name: "citation"
    }
  },
  executor: executor
});
const citationUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const resource_citationPgResource = makeRegistry({
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
    citation: citationCodec,
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
    EntityKindsEnum: enumCodec({
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
    citation: {
      executor: executor,
      name: "citation",
      identifier: "main.no_fields.citation",
      from: citationIdentifier,
      codec: citationCodec,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "no_fields",
          name: "citation"
        }
      },
      uniques: citationUniques
    }
  },
  pgRelations: {
    __proto__: null
  }
}).pgResources["citation"];
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
const nodeIdHandler_Citation = makeTableNodeIdHandler({
  typeName: "Citation",
  identifier: "citations",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_citationPgResource,
  pk: citationUniques[0].attributes
});
const specForHandlerCache = new Map();
function specForHandler() {
  const existing = specForHandlerCache.get(nodeIdHandler_Citation);
  if (existing) {
    return existing;
  }
  function spec(nodeId) {
    // We only want to return the specifier if it matches
    // this handler; otherwise return null.
    if (nodeId == null) return null;
    try {
      const specifier = nodeIdHandler_Citation.codec.decode(nodeId);
      if (nodeIdHandler_Citation.match(specifier)) {
        return specifier;
      }
    } catch {
      // Ignore errors
    }
    return null;
  }
  spec.displayName = `specifier_${nodeIdHandler_Citation.typeName}_${nodeIdHandler_Citation.codec.name}`;
  spec.isSyncAndSafe = true; // Optimization
  specForHandlerCache.set(nodeIdHandler_Citation, spec);
  return spec;
}
const nodeFetcher_Citation = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler());
  return nodeIdHandler_Citation.get(nodeIdHandler_Citation.getSpec($decoded));
};
function qbWhereBuilder(qb) {
  return qb.whereBuilder();
}
const nodeIdHandlerByTypeName = {
  __proto__: null,
  Query: nodeIdHandler_Query,
  Citation: nodeIdHandler_Citation
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
const specFromArgs_Citation = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Citation, $nodeId);
};
function applyInputToUpdateOrDelete(_, $object) {
  return $object;
}
function queryPlan() {
  return rootValue();
}
const getPgSelectSingleFromMutationResult = (pkAttributes, $mutation) => {
  const $result = $mutation.getStepForKey("result", true);
  if (!$result) return null;
  if ($result instanceof PgDeleteSingleStep) {
    return pgSelectFromRecord($result.resource, $result.record());
  } else {
    const spec = pkAttributes.reduce((memo, attributeName) => {
      memo[attributeName] = $result.get(attributeName);
      return memo;
    }, Object.create(null));
    return resource_citationPgResource.find(spec);
  }
};
const pgMutationPayloadEdge = (pkAttributes, $mutation, fieldArgs) => {
  const $select = getPgSelectSingleFromMutationResult(pkAttributes, $mutation);
  if (!$select) return constant(null);
  fieldArgs.apply($select, "orderBy");
  const $connection = connection($select);
  return new EdgeStep($connection, first($connection));
};
function applyClientMutationIdForUpdateOrDelete(qb, val) {
  qb.setMeta("clientMutationId", val);
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

  """Get a single \`Citation\`."""
  citationById(id: Int!): Citation

  """Reads a single \`Citation\` using its globally unique \`ID\`."""
  citation(
    """The globally unique \`ID\` to be used in selecting a single \`Citation\`."""
    nodeId: ID!
  ): Citation

  """Reads and enables pagination through a set of \`Citation\`."""
  allCitations(
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
    condition: CitationCondition

    """The method to use when ordering \`Citation\`."""
    orderBy: [CitationsOrderBy!] = [PRIMARY_KEY_ASC]
  ): CitationsConnection
}

"""An object with a globally unique \`ID\`."""
interface Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
}

type Citation implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
}

"""A connection to a list of \`Citation\` values."""
type CitationsConnection {
  """A list of \`Citation\` objects."""
  nodes: [Citation]!

  """
  A list of edges which contains the \`Citation\` and cursor to aid in pagination.
  """
  edges: [CitationsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Citation\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Citation\` edge in the connection."""
type CitationsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Citation\` at the end of the edge."""
  node: Citation
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
A condition to be used against \`Citation\` object types. All fields are tested
for equality and combined with a logical ‘and.’
"""
input CitationCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int
}

"""Methods to use when ordering \`Citation\`."""
enum CitationsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
}

"""
The root mutation type which contains root level fields which mutate data.
"""
type Mutation {
  """Creates a single \`Citation\`."""
  createCitation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateCitationInput!
  ): CreateCitationPayload

  """Deletes a single \`Citation\` using its globally unique id."""
  deleteCitation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteCitationInput!
  ): DeleteCitationPayload

  """Deletes a single \`Citation\` using a unique key."""
  deleteCitationById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteCitationByIdInput!
  ): DeleteCitationPayload
}

"""The output of our create \`Citation\` mutation."""
type CreateCitationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Citation\` that was created by this mutation."""
  citation: Citation

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Citation\`. May be used by Relay 1."""
  citationEdge(
    """The method to use when ordering \`Citation\`."""
    orderBy: [CitationsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): CitationsEdge
}

"""All input for the create \`Citation\` mutation."""
input CreateCitationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
}

"""The output of our delete \`Citation\` mutation."""
type DeleteCitationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Citation\` that was deleted by this mutation."""
  citation: Citation
  deletedCitationId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Citation\`. May be used by Relay 1."""
  citationEdge(
    """The method to use when ordering \`Citation\`."""
    orderBy: [CitationsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): CitationsEdge
}

"""All input for the \`deleteCitation\` mutation."""
input DeleteCitationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Citation\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteCitationById\` mutation."""
input DeleteCitationByIdInput {
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
      allCitations: {
        plan() {
          return connection(resource_citationPgResource.find());
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
      citation(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_Citation($nodeId);
      },
      citationById(_$root, {
        $id
      }) {
        return resource_citationPgResource.get({
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
      query() {
        return rootValue();
      }
    }
  },
  Mutation: {
    assertStep: __ValueStep,
    plans: {
      createCitation: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_citationPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input(_, $object) {
            return $object;
          }
        }
      },
      deleteCitation: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_citationPgResource, specFromArgs_Citation(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteCitationById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_citationPgResource, {
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
      }
    }
  },
  Citation: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nodeId($parent) {
        const specifier = nodeIdHandler_Citation.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Citation.codec.name].encode);
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of citationUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_citationPgResource.get(spec);
    }
  },
  CitationsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
      }
    }
  },
  CreateCitationPayload: {
    assertStep: assertStep,
    plans: {
      citation($object) {
        return $object.get("result");
      },
      citationEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(citationUniques[0].attributes, $mutation, fieldArgs);
      },
      clientMutationId($mutation) {
        const $insert = $mutation.getStepForKey("result");
        return $insert.getMeta("clientMutationId");
      },
      query: queryPlan
    }
  },
  DeleteCitationPayload: {
    assertStep: ObjectStep,
    plans: {
      citation($object) {
        return $object.get("result");
      },
      citationEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(citationUniques[0].attributes, $mutation, fieldArgs);
      },
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      deletedCitationId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Citation.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      query: queryPlan
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
  CitationCondition: {
    plans: {
      id($condition, val) {
        return applyAttributeCondition("id", TYPES.int, $condition, val);
      }
    }
  },
  CreateCitationInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeleteCitationByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteCitationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
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
  CitationsOrderBy: {
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
        citationUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        citationUniques[0].attributes.forEach(attributeName => {
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
