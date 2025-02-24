import { PgDeleteSingleStep, PgExecutor, TYPES, assertPgClassSingleStep, makeRegistry, pgDeleteSingle, pgInsertSingle, pgSelectFromRecord, pgUpdateSingle, recordCodec, sqlValueWithCodec } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ObjectStep, __ValueStep, access, assertEdgeCapableStep, assertExecutableStep, assertPageInfoCapableStep, bakedInputRuntime, connection, constant, context, createObjectAndApplyChildren, first, inhibitOnNull, lambda, list, makeGrafastSchema, node, object, rootValue, specFromNodeId } from "grafast";
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
const geomIdentifier = sql.identifier("geometry", "geom");
const geomCodec = recordCodec({
  name: "geom",
  identifier: geomIdentifier,
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
    point: {
      description: undefined,
      codec: TYPES.point,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    line: {
      description: undefined,
      codec: TYPES.line,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    lseg: {
      description: undefined,
      codec: TYPES.lseg,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    box: {
      description: undefined,
      codec: TYPES.box,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    open_path: {
      description: undefined,
      codec: TYPES.path,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    closed_path: {
      description: undefined,
      codec: TYPES.path,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    polygon: {
      description: undefined,
      codec: TYPES.polygon,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    circle: {
      description: undefined,
      codec: TYPES.circle,
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
      schemaName: "geometry",
      name: "geom"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const geomUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const pgResource_geomPgResource = makeRegistry({
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
    point: TYPES.point,
    geom: geomCodec,
    line: TYPES.line,
    lseg: TYPES.lseg,
    box: TYPES.box,
    path: TYPES.path,
    polygon: TYPES.polygon,
    circle: TYPES.circle
  },
  pgResources: {
    __proto__: null,
    geom: {
      executor: executor,
      name: "geom",
      identifier: "main.geometry.geom",
      from: geomIdentifier,
      codec: geomCodec,
      uniques: geomUniques,
      isVirtual: false,
      description: undefined,
      extensions: {
        description: undefined,
        pg: {
          serviceName: "main",
          schemaName: "geometry",
          name: "geom"
        },
        isInsertable: true,
        isUpdatable: true,
        isDeletable: true,
        tags: {}
      }
    }
  },
  pgRelations: {
    __proto__: null
  }
}).pgResources["geom"];
const nodeIdHandlerByTypeName = {
  __proto__: null,
  Query: handler,
  Geom: {
    typeName: "Geom",
    codec: nodeIdCodecs_base64JSON_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("geoms", false), $record.get("id")]);
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
      return pgResource_geomPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "geoms";
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
})(nodeIdHandlerByTypeName.Geom);
function qbWhereBuilder(qb) {
  return qb.whereBuilder();
}
function CursorSerialize(value) {
  return "" + value;
}
const specFromArgs = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Geom, $nodeId);
};
const specFromArgs2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Geom, $nodeId);
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

  """Get a single \`Geom\`."""
  geomById(id: Int!): Geom

  """Reads a single \`Geom\` using its globally unique \`ID\`."""
  geom(
    """The globally unique \`ID\` to be used in selecting a single \`Geom\`."""
    nodeId: ID!
  ): Geom

  """Reads and enables pagination through a set of \`Geom\`."""
  allGeoms(
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

    """The method to use when ordering \`Geom\`."""
    orderBy: [GeomsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: GeomCondition
  ): GeomsConnection
}

"""An object with a globally unique \`ID\`."""
interface Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
}

type Geom implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  point: Point
  line: Line
  lseg: LineSegment
  box: Box
  openPath: Path
  closedPath: Path
  polygon: Polygon
  circle: Circle
}

"""A cartesian point."""
type Point {
  x: Float!
  y: Float!
}

"""An infinite line that passes through points 'a' and 'b'."""
type Line {
  a: Point!
  b: Point!
}

"""An finite line between points 'a' and 'b'."""
type LineSegment {
  a: Point!
  b: Point!
}

"""A rectangular box defined by two opposite corners 'a' and 'b'"""
type Box {
  a: Point!
  b: Point!
}

"""A path (open or closed) made up of points"""
type Path {
  points: [Point!]!

  """True if this is a closed path (similar to a polygon), false otherwise."""
  isOpen: Boolean!
}

"""A polygon made up of points"""
type Polygon {
  points: [Point!]!
}

"""A circle about the given center point with the given radius"""
type Circle {
  center: Point!
  radius: Float!
}

"""A connection to a list of \`Geom\` values."""
type GeomsConnection {
  """A list of \`Geom\` objects."""
  nodes: [Geom]!

  """
  A list of edges which contains the \`Geom\` and cursor to aid in pagination.
  """
  edges: [GeomsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Geom\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Geom\` edge in the connection."""
type GeomsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Geom\` at the end of the edge."""
  node: Geom
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

"""Methods to use when ordering \`Geom\`."""
enum GeomsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  POINT_ASC
  POINT_DESC
  LINE_ASC
  LINE_DESC
  LSEG_ASC
  LSEG_DESC
  BOX_ASC
  BOX_DESC
  OPEN_PATH_ASC
  OPEN_PATH_DESC
  CLOSED_PATH_ASC
  CLOSED_PATH_DESC
  POLYGON_ASC
  POLYGON_DESC
  CIRCLE_ASC
  CIRCLE_DESC
}

"""
A condition to be used against \`Geom\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input GeomCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`point\` field."""
  point: PointInput

  """Checks for equality with the object’s \`line\` field."""
  line: LineInput

  """Checks for equality with the object’s \`lseg\` field."""
  lseg: LineSegmentInput

  """Checks for equality with the object’s \`box\` field."""
  box: BoxInput

  """Checks for equality with the object’s \`openPath\` field."""
  openPath: PathInput

  """Checks for equality with the object’s \`closedPath\` field."""
  closedPath: PathInput

  """Checks for equality with the object’s \`polygon\` field."""
  polygon: PolygonInput

  """Checks for equality with the object’s \`circle\` field."""
  circle: CircleInput
}

"""A cartesian point."""
input PointInput {
  x: Float!
  y: Float!
}

"""An infinite line that passes through points 'a' and 'b'."""
input LineInput {
  a: PointInput!
  b: PointInput!
}

"""An finite line between points 'a' and 'b'."""
input LineSegmentInput {
  a: PointInput!
  b: PointInput!
}

"""A rectangular box defined by two opposite corners 'a' and 'b'"""
input BoxInput {
  a: PointInput!
  b: PointInput!
}

"""A path (open or closed) made up of points"""
input PathInput {
  points: [PointInput!]!

  """True if this is a closed path (similar to a polygon), false otherwise."""
  isOpen: Boolean
}

"""A polygon made up of points"""
input PolygonInput {
  points: [PointInput!]!
}

"""A circle about the given center point with the given radius"""
input CircleInput {
  center: PointInput!
  radius: Float!
}

"""
The root mutation type which contains root level fields which mutate data.
"""
type Mutation {
  """Creates a single \`Geom\`."""
  createGeom(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateGeomInput!
  ): CreateGeomPayload

  """Updates a single \`Geom\` using its globally unique id and a patch."""
  updateGeom(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateGeomInput!
  ): UpdateGeomPayload

  """Updates a single \`Geom\` using a unique key and a patch."""
  updateGeomById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateGeomByIdInput!
  ): UpdateGeomPayload

  """Deletes a single \`Geom\` using its globally unique id."""
  deleteGeom(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteGeomInput!
  ): DeleteGeomPayload

  """Deletes a single \`Geom\` using a unique key."""
  deleteGeomById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteGeomByIdInput!
  ): DeleteGeomPayload
}

"""The output of our create \`Geom\` mutation."""
type CreateGeomPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Geom\` that was created by this mutation."""
  geom: Geom

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Geom\`. May be used by Relay 1."""
  geomEdge(
    """The method to use when ordering \`Geom\`."""
    orderBy: [GeomsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): GeomsEdge
}

"""All input for the create \`Geom\` mutation."""
input CreateGeomInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`Geom\` to be created by this mutation."""
  geom: GeomInput!
}

"""An input for mutations affecting \`Geom\`"""
input GeomInput {
  id: Int
  point: PointInput
  line: LineInput
  lseg: LineSegmentInput
  box: BoxInput
  openPath: PathInput
  closedPath: PathInput
  polygon: PolygonInput
  circle: CircleInput
}

"""The output of our update \`Geom\` mutation."""
type UpdateGeomPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Geom\` that was updated by this mutation."""
  geom: Geom

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Geom\`. May be used by Relay 1."""
  geomEdge(
    """The method to use when ordering \`Geom\`."""
    orderBy: [GeomsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): GeomsEdge
}

"""All input for the \`updateGeom\` mutation."""
input UpdateGeomInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Geom\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`Geom\` being updated.
  """
  geomPatch: GeomPatch!
}

"""Represents an update to a \`Geom\`. Fields that are set will be updated."""
input GeomPatch {
  id: Int
  point: PointInput
  line: LineInput
  lseg: LineSegmentInput
  box: BoxInput
  openPath: PathInput
  closedPath: PathInput
  polygon: PolygonInput
  circle: CircleInput
}

"""All input for the \`updateGeomById\` mutation."""
input UpdateGeomByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`Geom\` being updated.
  """
  geomPatch: GeomPatch!
}

"""The output of our delete \`Geom\` mutation."""
type DeleteGeomPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Geom\` that was deleted by this mutation."""
  geom: Geom
  deletedGeomId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Geom\`. May be used by Relay 1."""
  geomEdge(
    """The method to use when ordering \`Geom\`."""
    orderBy: [GeomsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): GeomsEdge
}

"""All input for the \`deleteGeom\` mutation."""
input DeleteGeomInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Geom\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteGeomById\` mutation."""
input DeleteGeomByIdInput {
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
    node(_$root, args) {
      return node(nodeIdHandlerByTypeName, args.getRaw("nodeId"));
    },
    geomById(_$root, args) {
      return pgResource_geomPgResource.get({
        id: args.getRaw("id")
      });
    },
    geom(_$parent, args) {
      const $nodeId = args.getRaw("nodeId");
      return fetcher($nodeId);
    },
    allGeoms: {
      plan() {
        return connection(pgResource_geomPgResource.find());
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
  Geom: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.Geom.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Geom.codec.name].encode);
    },
    id($record) {
      return $record.get("id");
    },
    point($record) {
      return $record.get("point");
    },
    line($record) {
      return $record.get("line");
    },
    lseg($record) {
      return $record.get("lseg");
    },
    box($record) {
      return $record.get("box");
    },
    openPath($record) {
      return $record.get("open_path");
    },
    closedPath($record) {
      return $record.get("closed_path");
    },
    polygon($record) {
      return $record.get("polygon");
    },
    circle($record) {
      return $record.get("circle");
    }
  },
  Point: {},
  Line: {},
  LineSegment: {},
  Box: {},
  Path: {},
  Polygon: {},
  Circle: {},
  GeomsConnection: {
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
  GeomsEdge: {
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
  GeomsOrderBy: {
    PRIMARY_KEY_ASC: {
      extensions: {
        __proto__: null,
        grafast: {
          apply(queryBuilder) {
            geomUniques[0].attributes.forEach(attributeName => {
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
            geomUniques[0].attributes.forEach(attributeName => {
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
    POINT_ASC: {
      extensions: {
        __proto__: null,
        grafast: {
          apply(queryBuilder) {
            queryBuilder.orderBy({
              attribute: "point",
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
    POINT_DESC: {
      extensions: {
        __proto__: null,
        grafast: {
          apply(queryBuilder) {
            queryBuilder.orderBy({
              attribute: "point",
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
    },
    LINE_ASC: {
      extensions: {
        __proto__: null,
        grafast: {
          apply(queryBuilder) {
            queryBuilder.orderBy({
              attribute: "line",
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
    LINE_DESC: {
      extensions: {
        __proto__: null,
        grafast: {
          apply(queryBuilder) {
            queryBuilder.orderBy({
              attribute: "line",
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
    },
    LSEG_ASC: {
      extensions: {
        __proto__: null,
        grafast: {
          apply(queryBuilder) {
            queryBuilder.orderBy({
              attribute: "lseg",
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
    LSEG_DESC: {
      extensions: {
        __proto__: null,
        grafast: {
          apply(queryBuilder) {
            queryBuilder.orderBy({
              attribute: "lseg",
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
    },
    BOX_ASC: {
      extensions: {
        __proto__: null,
        grafast: {
          apply(queryBuilder) {
            queryBuilder.orderBy({
              attribute: "box",
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
    BOX_DESC: {
      extensions: {
        __proto__: null,
        grafast: {
          apply(queryBuilder) {
            queryBuilder.orderBy({
              attribute: "box",
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
    },
    OPEN_PATH_ASC: {
      extensions: {
        __proto__: null,
        grafast: {
          apply(queryBuilder) {
            queryBuilder.orderBy({
              attribute: "open_path",
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
    OPEN_PATH_DESC: {
      extensions: {
        __proto__: null,
        grafast: {
          apply(queryBuilder) {
            queryBuilder.orderBy({
              attribute: "open_path",
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
    },
    CLOSED_PATH_ASC: {
      extensions: {
        __proto__: null,
        grafast: {
          apply(queryBuilder) {
            queryBuilder.orderBy({
              attribute: "closed_path",
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
    CLOSED_PATH_DESC: {
      extensions: {
        __proto__: null,
        grafast: {
          apply(queryBuilder) {
            queryBuilder.orderBy({
              attribute: "closed_path",
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
    },
    POLYGON_ASC: {
      extensions: {
        __proto__: null,
        grafast: {
          apply(queryBuilder) {
            queryBuilder.orderBy({
              attribute: "polygon",
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
    POLYGON_DESC: {
      extensions: {
        __proto__: null,
        grafast: {
          apply(queryBuilder) {
            queryBuilder.orderBy({
              attribute: "polygon",
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
    },
    CIRCLE_ASC: {
      extensions: {
        __proto__: null,
        grafast: {
          apply(queryBuilder) {
            queryBuilder.orderBy({
              attribute: "circle",
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
    CIRCLE_DESC: {
      extensions: {
        __proto__: null,
        grafast: {
          apply(queryBuilder) {
            queryBuilder.orderBy({
              attribute: "circle",
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
  GeomCondition: {
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
    point: {
      apply($condition, val) {
        if (val === null) {
          $condition.where({
            type: "attribute",
            attribute: "point",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "point",
            callback(expression) {
              return sql`${expression} = ${sqlValueWithCodec(val, TYPES.point)}`;
            }
          });
        }
      }
    },
    line: {
      apply($condition, val) {
        if (val === null) {
          $condition.where({
            type: "attribute",
            attribute: "line",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "line",
            callback(expression) {
              return sql`${expression} = ${sqlValueWithCodec(val, TYPES.line)}`;
            }
          });
        }
      }
    },
    lseg: {
      apply($condition, val) {
        if (val === null) {
          $condition.where({
            type: "attribute",
            attribute: "lseg",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "lseg",
            callback(expression) {
              return sql`${expression} = ${sqlValueWithCodec(val, TYPES.lseg)}`;
            }
          });
        }
      }
    },
    box: {
      apply($condition, val) {
        if (val === null) {
          $condition.where({
            type: "attribute",
            attribute: "box",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "box",
            callback(expression) {
              return sql`${expression} = ${sqlValueWithCodec(val, TYPES.box)}`;
            }
          });
        }
      }
    },
    openPath: {
      apply($condition, val) {
        if (val === null) {
          $condition.where({
            type: "attribute",
            attribute: "open_path",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "open_path",
            callback(expression) {
              return sql`${expression} = ${sqlValueWithCodec(val, TYPES.path)}`;
            }
          });
        }
      }
    },
    closedPath: {
      apply($condition, val) {
        if (val === null) {
          $condition.where({
            type: "attribute",
            attribute: "closed_path",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "closed_path",
            callback(expression) {
              return sql`${expression} = ${sqlValueWithCodec(val, TYPES.path)}`;
            }
          });
        }
      }
    },
    polygon: {
      apply($condition, val) {
        if (val === null) {
          $condition.where({
            type: "attribute",
            attribute: "polygon",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "polygon",
            callback(expression) {
              return sql`${expression} = ${sqlValueWithCodec(val, TYPES.polygon)}`;
            }
          });
        }
      }
    },
    circle: {
      apply($condition, val) {
        if (val === null) {
          $condition.where({
            type: "attribute",
            attribute: "circle",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "circle",
            callback(expression) {
              return sql`${expression} = ${sqlValueWithCodec(val, TYPES.circle)}`;
            }
          });
        }
      }
    }
  },
  PointInput: {
    x: undefined,
    y: undefined
  },
  LineInput: {
    a: undefined,
    b: undefined
  },
  LineSegmentInput: {
    a: undefined,
    b: undefined
  },
  BoxInput: {
    a: undefined,
    b: undefined
  },
  PathInput: {
    points: undefined,
    isOpen: undefined
  },
  PolygonInput: {
    points: undefined
  },
  CircleInput: {
    center: undefined,
    radius: undefined
  },
  Mutation: {
    __assertStep: __ValueStep,
    createGeom: {
      plan(_, args) {
        const $insert = pgInsertSingle(pgResource_geomPgResource, Object.create(null));
        args.apply($insert);
        const plan = object({
          result: $insert
        });
        return plan;
      },
      args: {
        input: {
          __proto__: null,
          grafast: {
            applyPlan(_, $object) {
              return $object;
            }
          }
        }
      }
    },
    updateGeom: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(pgResource_geomPgResource, specFromArgs(args));
        args.apply($update);
        return object({
          result: $update
        });
      },
      args: {
        input: {
          __proto__: null,
          grafast: {
            applyPlan(_, $object) {
              return $object;
            }
          }
        }
      }
    },
    updateGeomById: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(pgResource_geomPgResource, {
          id: args.getRaw(['input', "id"])
        });
        args.apply($update);
        return object({
          result: $update
        });
      },
      args: {
        input: {
          __proto__: null,
          grafast: {
            applyPlan(_, $object) {
              return $object;
            }
          }
        }
      }
    },
    deleteGeom: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(pgResource_geomPgResource, specFromArgs2(args));
        args.apply($delete);
        return object({
          result: $delete
        });
      },
      args: {
        input: {
          __proto__: null,
          grafast: {
            applyPlan(_, $object) {
              return $object;
            }
          }
        }
      }
    },
    deleteGeomById: {
      plan(_$root, args) {
        const $delete = pgDeleteSingle(pgResource_geomPgResource, {
          id: args.getRaw(['input', "id"])
        });
        args.apply($delete);
        return object({
          result: $delete
        });
      },
      args: {
        input: {
          __proto__: null,
          grafast: {
            applyPlan(_, $object) {
              return $object;
            }
          }
        }
      }
    }
  },
  CreateGeomPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    geom($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    geomEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = geomUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return pgResource_geomPgResource.find(spec);
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
  CreateGeomInput: {
    clientMutationId: {
      apply(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    },
    geom: {
      apply(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  GeomInput: {
    "__baked": createObjectAndApplyChildren,
    id: {
      apply(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      }
    },
    point: {
      apply(obj, val, {
        field,
        schema
      }) {
        obj.set("point", bakedInputRuntime(schema, field.type, val));
      }
    },
    line: {
      apply(obj, val, {
        field,
        schema
      }) {
        obj.set("line", bakedInputRuntime(schema, field.type, val));
      }
    },
    lseg: {
      apply(obj, val, {
        field,
        schema
      }) {
        obj.set("lseg", bakedInputRuntime(schema, field.type, val));
      }
    },
    box: {
      apply(obj, val, {
        field,
        schema
      }) {
        obj.set("box", bakedInputRuntime(schema, field.type, val));
      }
    },
    openPath: {
      apply(obj, val, {
        field,
        schema
      }) {
        obj.set("open_path", bakedInputRuntime(schema, field.type, val));
      }
    },
    closedPath: {
      apply(obj, val, {
        field,
        schema
      }) {
        obj.set("closed_path", bakedInputRuntime(schema, field.type, val));
      }
    },
    polygon: {
      apply(obj, val, {
        field,
        schema
      }) {
        obj.set("polygon", bakedInputRuntime(schema, field.type, val));
      }
    },
    circle: {
      apply(obj, val, {
        field,
        schema
      }) {
        obj.set("circle", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  UpdateGeomPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    geom($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    geomEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = geomUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return pgResource_geomPgResource.find(spec);
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
  UpdateGeomInput: {
    clientMutationId: {
      apply(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    },
    nodeId: undefined,
    geomPatch: {
      apply(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  GeomPatch: {
    "__baked": createObjectAndApplyChildren,
    id: {
      apply(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      }
    },
    point: {
      apply(obj, val, {
        field,
        schema
      }) {
        obj.set("point", bakedInputRuntime(schema, field.type, val));
      }
    },
    line: {
      apply(obj, val, {
        field,
        schema
      }) {
        obj.set("line", bakedInputRuntime(schema, field.type, val));
      }
    },
    lseg: {
      apply(obj, val, {
        field,
        schema
      }) {
        obj.set("lseg", bakedInputRuntime(schema, field.type, val));
      }
    },
    box: {
      apply(obj, val, {
        field,
        schema
      }) {
        obj.set("box", bakedInputRuntime(schema, field.type, val));
      }
    },
    openPath: {
      apply(obj, val, {
        field,
        schema
      }) {
        obj.set("open_path", bakedInputRuntime(schema, field.type, val));
      }
    },
    closedPath: {
      apply(obj, val, {
        field,
        schema
      }) {
        obj.set("closed_path", bakedInputRuntime(schema, field.type, val));
      }
    },
    polygon: {
      apply(obj, val, {
        field,
        schema
      }) {
        obj.set("polygon", bakedInputRuntime(schema, field.type, val));
      }
    },
    circle: {
      apply(obj, val, {
        field,
        schema
      }) {
        obj.set("circle", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  UpdateGeomByIdInput: {
    clientMutationId: {
      apply(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    },
    id: undefined,
    geomPatch: {
      apply(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  DeleteGeomPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    geom($object) {
      return $object.get("result");
    },
    deletedGeomId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.Geom.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    geomEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = geomUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return pgResource_geomPgResource.find(spec);
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
  DeleteGeomInput: {
    clientMutationId: {
      apply(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    },
    nodeId: undefined
  },
  DeleteGeomByIdInput: {
    clientMutationId: {
      apply(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    },
    id: undefined
  }
};
export const schema = makeGrafastSchema({
  typeDefs: typeDefs,
  plans: plans
});
