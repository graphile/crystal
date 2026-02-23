import { LIST_TYPES, PgDeleteSingleStep, PgExecutor, TYPES, assertPgClassSingleStep, enumCodec, makeRegistry, pgDeleteSingle, pgInsertSingle, pgSelectFromRecord, pgUpdateSingle, recordCodec, sqlValueWithCodec } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ObjectStep, __ValueStep, access, assertStep, bakedInputRuntime, connection, constant, context, createObjectAndApplyChildren, first, get as get2, inhibitOnNull, inspect, lambda, list, makeDecodeNodeId, makeGrafastSchema, markSyncAndSafe, object, rootValue, specFromNodeId } from "grafast";
import { GraphQLError, Kind } from "graphql";
import { sql } from "pg-sql2";
const rawNodeIdCodec = {
  name: "raw",
  encode: markSyncAndSafe(function rawEncode(value) {
    return typeof value === "string" ? value : null;
  }),
  decode: markSyncAndSafe(function rawDecode(value) {
    return typeof value === "string" ? value : null;
  })
};
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
    return rootValue();
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
const geomIdentifier = sql.identifier("geometry", "geom");
const geomCodec = recordCodec({
  name: "geom",
  identifier: geomIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    point: {
      codec: TYPES.point
    },
    points: {
      codec: LIST_TYPES.point
    },
    line: {
      codec: TYPES.line
    },
    lines: {
      codec: LIST_TYPES.line
    },
    lseg: {
      codec: TYPES.lseg
    },
    lsegs: {
      codec: LIST_TYPES.lseg
    },
    box: {
      codec: TYPES.box
    },
    boxes: {
      codec: LIST_TYPES.box
    },
    open_path: {
      codec: TYPES.path
    },
    open_paths: {
      codec: LIST_TYPES.path
    },
    closed_path: {
      codec: TYPES.path
    },
    closed_paths: {
      codec: LIST_TYPES.path
    },
    polygon: {
      codec: TYPES.polygon
    },
    polygons: {
      codec: LIST_TYPES.polygon
    },
    circle: {
      codec: TYPES.circle
    },
    circles: {
      codec: LIST_TYPES.circle
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "geometry",
      name: "geom"
    }
  },
  executor: executor
});
const geomUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const resource_geomPgResource = makeRegistry({
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
    pointArray: LIST_TYPES.point,
    line: TYPES.line,
    lineArray: LIST_TYPES.line,
    lseg: TYPES.lseg,
    lsegArray: LIST_TYPES.lseg,
    box: TYPES.box,
    boxArray: LIST_TYPES.box,
    path: TYPES.path,
    pathArray: LIST_TYPES.path,
    polygon: TYPES.polygon,
    polygonArray: LIST_TYPES.polygon,
    circle: TYPES.circle,
    circleArray: LIST_TYPES.circle,
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
    geom: {
      executor: executor,
      name: "geom",
      identifier: "main.geometry.geom",
      from: geomIdentifier,
      codec: geomCodec,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "geometry",
          name: "geom"
        }
      },
      uniques: geomUniques
    }
  },
  pgRelations: {
    __proto__: null
  }
}).pgResources["geom"];
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
const nodeIdHandler_Geom = makeTableNodeIdHandler({
  typeName: "Geom",
  identifier: "geoms",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_geomPgResource,
  pk: geomUniques[0].attributes
});
const specForHandlerCache = new Map();
function specForHandler() {
  const existing = specForHandlerCache.get(nodeIdHandler_Geom);
  if (existing) {
    return existing;
  }
  const spec = markSyncAndSafe(function spec(nodeId) {
    // We only want to return the specifier if it matches
    // this handler; otherwise return null.
    if (nodeId == null) return null;
    try {
      const specifier = nodeIdHandler_Geom.codec.decode(nodeId);
      if (nodeIdHandler_Geom.match(specifier)) {
        return specifier;
      }
    } catch {
      // Ignore errors
    }
    return null;
  }, `specifier_${nodeIdHandler_Geom.typeName}_${nodeIdHandler_Geom.codec.name}`);
  specForHandlerCache.set(nodeIdHandler_Geom, spec);
  return spec;
}
const nodeFetcher_Geom = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler());
  return nodeIdHandler_Geom.get(nodeIdHandler_Geom.getSpec($decoded));
};
function qbWhereBuilder(qb) {
  return qb.whereBuilder();
}
const nodeIdHandlerByTypeName = {
  __proto__: null,
  Query: nodeIdHandler_Query,
  Geom: nodeIdHandler_Geom
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
const specFromArgs_Geom = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Geom, $nodeId);
};
function applyInputToUpdateOrDelete(_, $object) {
  return $object;
}
function planCreatePayloadResult($object) {
  return $object.get("result");
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
    return resource_geomPgResource.find(spec);
  }
};
const pgMutationPayloadEdge = (pkAttributes, $mutation, fieldArgs) => {
  const $select = getPgSelectSingleFromMutationResult(pkAttributes, $mutation);
  if (!$select) return constant(null);
  fieldArgs.apply($select, "orderBy");
  const $connection = connection($select);
  return new EdgeStep($connection, first($connection));
};
const CreateGeomPayload_geomEdgePlan = ($mutation, fieldArgs) => pgMutationPayloadEdge(geomUniques[0].attributes, $mutation, fieldArgs);
function applyClientMutationIdForCreate(qb, val) {
  qb.setMeta("clientMutationId", val);
}
function applyCreateFields(qb, arg) {
  if (arg != null) {
    return qb.setBuilder();
  }
}
function GeomInput_idApply(obj, val, {
  field,
  schema
}) {
  obj.set("id", bakedInputRuntime(schema, field.type, val));
}
function GeomInput_pointApply(obj, val, {
  field,
  schema
}) {
  obj.set("point", bakedInputRuntime(schema, field.type, val));
}
function GeomInput_pointsApply(obj, val, {
  field,
  schema
}) {
  obj.set("points", bakedInputRuntime(schema, field.type, val));
}
function GeomInput_lineApply(obj, val, {
  field,
  schema
}) {
  obj.set("line", bakedInputRuntime(schema, field.type, val));
}
function GeomInput_linesApply(obj, val, {
  field,
  schema
}) {
  obj.set("lines", bakedInputRuntime(schema, field.type, val));
}
function GeomInput_lsegApply(obj, val, {
  field,
  schema
}) {
  obj.set("lseg", bakedInputRuntime(schema, field.type, val));
}
function GeomInput_lsegsApply(obj, val, {
  field,
  schema
}) {
  obj.set("lsegs", bakedInputRuntime(schema, field.type, val));
}
function GeomInput_boxApply(obj, val, {
  field,
  schema
}) {
  obj.set("box", bakedInputRuntime(schema, field.type, val));
}
function GeomInput_boxesApply(obj, val, {
  field,
  schema
}) {
  obj.set("boxes", bakedInputRuntime(schema, field.type, val));
}
function GeomInput_openPathApply(obj, val, {
  field,
  schema
}) {
  obj.set("open_path", bakedInputRuntime(schema, field.type, val));
}
function GeomInput_openPathsApply(obj, val, {
  field,
  schema
}) {
  obj.set("open_paths", bakedInputRuntime(schema, field.type, val));
}
function GeomInput_closedPathApply(obj, val, {
  field,
  schema
}) {
  obj.set("closed_path", bakedInputRuntime(schema, field.type, val));
}
function GeomInput_closedPathsApply(obj, val, {
  field,
  schema
}) {
  obj.set("closed_paths", bakedInputRuntime(schema, field.type, val));
}
function GeomInput_polygonApply(obj, val, {
  field,
  schema
}) {
  obj.set("polygon", bakedInputRuntime(schema, field.type, val));
}
function GeomInput_polygonsApply(obj, val, {
  field,
  schema
}) {
  obj.set("polygons", bakedInputRuntime(schema, field.type, val));
}
function GeomInput_circleApply(obj, val, {
  field,
  schema
}) {
  obj.set("circle", bakedInputRuntime(schema, field.type, val));
}
function GeomInput_circlesApply(obj, val, {
  field,
  schema
}) {
  obj.set("circles", bakedInputRuntime(schema, field.type, val));
}
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

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: GeomCondition

    """The method to use when ordering \`Geom\`."""
    orderBy: [GeomsOrderBy!] = [PRIMARY_KEY_ASC]
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
  points: [Point]
  line: Line
  lines: [Line]
  lseg: LineSegment
  lsegs: [LineSegment]
  box: Box
  boxes: [Box]
  openPath: Path
  openPaths: [Path]
  closedPath: Path
  closedPaths: [Path]
  polygon: Polygon
  polygons: [Polygon]
  circle: Circle
  circles: [Circle]
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

"""
A condition to be used against \`Geom\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input GeomCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`point\` field."""
  point: PointInput

  """Checks for equality with the object’s \`points\` field."""
  points: [PointInput]

  """Checks for equality with the object’s \`line\` field."""
  line: LineInput

  """Checks for equality with the object’s \`lines\` field."""
  lines: [LineInput]

  """Checks for equality with the object’s \`lseg\` field."""
  lseg: LineSegmentInput

  """Checks for equality with the object’s \`lsegs\` field."""
  lsegs: [LineSegmentInput]

  """Checks for equality with the object’s \`box\` field."""
  box: BoxInput

  """Checks for equality with the object’s \`boxes\` field."""
  boxes: [BoxInput]

  """Checks for equality with the object’s \`openPath\` field."""
  openPath: PathInput

  """Checks for equality with the object’s \`openPaths\` field."""
  openPaths: [PathInput]

  """Checks for equality with the object’s \`closedPath\` field."""
  closedPath: PathInput

  """Checks for equality with the object’s \`closedPaths\` field."""
  closedPaths: [PathInput]

  """Checks for equality with the object’s \`polygon\` field."""
  polygon: PolygonInput

  """Checks for equality with the object’s \`polygons\` field."""
  polygons: [PolygonInput]

  """Checks for equality with the object’s \`circle\` field."""
  circle: CircleInput

  """Checks for equality with the object’s \`circles\` field."""
  circles: [CircleInput]
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
  points: [PointInput]
  line: LineInput
  lines: [LineInput]
  lseg: LineSegmentInput
  lsegs: [LineSegmentInput]
  box: BoxInput
  boxes: [BoxInput]
  openPath: PathInput
  openPaths: [PathInput]
  closedPath: PathInput
  closedPaths: [PathInput]
  polygon: PolygonInput
  polygons: [PolygonInput]
  circle: CircleInput
  circles: [CircleInput]
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
  points: [PointInput]
  line: LineInput
  lines: [LineInput]
  lseg: LineSegmentInput
  lsegs: [LineSegmentInput]
  box: BoxInput
  boxes: [BoxInput]
  openPath: PathInput
  openPaths: [PathInput]
  closedPath: PathInput
  closedPaths: [PathInput]
  polygon: PolygonInput
  polygons: [PolygonInput]
  circle: CircleInput
  circles: [CircleInput]
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
export const objects = {
  Query: {
    assertStep() {
      return true;
    },
    plans: {
      allGeoms: {
        plan() {
          return connection(resource_geomPgResource.find());
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
      geom(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_Geom($nodeId);
      },
      geomById(_$root, {
        $id
      }) {
        return resource_geomPgResource.get({
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
      createGeom: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_geomPgResource);
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
      deleteGeom: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_geomPgResource, specFromArgs_Geom(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteGeomById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_geomPgResource, {
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
      updateGeom: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_geomPgResource, specFromArgs_Geom(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateGeomById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_geomPgResource, {
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
  CreateGeomPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId($mutation) {
        const $insert = $mutation.getStepForKey("result");
        return $insert.getMeta("clientMutationId");
      },
      geom: planCreatePayloadResult,
      geomEdge: CreateGeomPayload_geomEdgePlan,
      query: queryPlan
    }
  },
  DeleteGeomPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedGeomId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Geom.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      geom: planUpdateOrDeletePayloadResult,
      geomEdge: CreateGeomPayload_geomEdgePlan,
      query: queryPlan
    }
  },
  Geom: {
    assertStep: assertPgClassSingleStep,
    plans: {
      closedPath($record) {
        return $record.get("closed_path");
      },
      closedPaths($record) {
        return $record.get("closed_paths");
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_Geom.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Geom.codec.name].encode);
      },
      openPath($record) {
        return $record.get("open_path");
      },
      openPaths($record) {
        return $record.get("open_paths");
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of geomUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_geomPgResource.get(spec);
    }
  },
  GeomsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
      }
    }
  },
  UpdateGeomPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      geom: planCreatePayloadResult,
      geomEdge: CreateGeomPayload_geomEdgePlan,
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
  CreateGeomInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      geom: applyCreateFields
    }
  },
  DeleteGeomByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteGeomInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  GeomCondition: {
    plans: {
      box($condition, val) {
        return applyAttributeCondition("box", TYPES.box, $condition, val);
      },
      boxes($condition, val) {
        return applyAttributeCondition("boxes", LIST_TYPES.box, $condition, val);
      },
      circle($condition, val) {
        return applyAttributeCondition("circle", TYPES.circle, $condition, val);
      },
      circles($condition, val) {
        return applyAttributeCondition("circles", LIST_TYPES.circle, $condition, val);
      },
      closedPath($condition, val) {
        return applyAttributeCondition("closed_path", TYPES.path, $condition, val);
      },
      closedPaths($condition, val) {
        return applyAttributeCondition("closed_paths", LIST_TYPES.path, $condition, val);
      },
      id($condition, val) {
        return applyAttributeCondition("id", TYPES.int, $condition, val);
      },
      line($condition, val) {
        return applyAttributeCondition("line", TYPES.line, $condition, val);
      },
      lines($condition, val) {
        return applyAttributeCondition("lines", LIST_TYPES.line, $condition, val);
      },
      lseg($condition, val) {
        return applyAttributeCondition("lseg", TYPES.lseg, $condition, val);
      },
      lsegs($condition, val) {
        return applyAttributeCondition("lsegs", LIST_TYPES.lseg, $condition, val);
      },
      openPath($condition, val) {
        return applyAttributeCondition("open_path", TYPES.path, $condition, val);
      },
      openPaths($condition, val) {
        return applyAttributeCondition("open_paths", LIST_TYPES.path, $condition, val);
      },
      point($condition, val) {
        return applyAttributeCondition("point", TYPES.point, $condition, val);
      },
      points($condition, val) {
        return applyAttributeCondition("points", LIST_TYPES.point, $condition, val);
      },
      polygon($condition, val) {
        return applyAttributeCondition("polygon", TYPES.polygon, $condition, val);
      },
      polygons($condition, val) {
        return applyAttributeCondition("polygons", LIST_TYPES.polygon, $condition, val);
      }
    }
  },
  GeomInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      box: GeomInput_boxApply,
      boxes: GeomInput_boxesApply,
      circle: GeomInput_circleApply,
      circles: GeomInput_circlesApply,
      closedPath: GeomInput_closedPathApply,
      closedPaths: GeomInput_closedPathsApply,
      id: GeomInput_idApply,
      line: GeomInput_lineApply,
      lines: GeomInput_linesApply,
      lseg: GeomInput_lsegApply,
      lsegs: GeomInput_lsegsApply,
      openPath: GeomInput_openPathApply,
      openPaths: GeomInput_openPathsApply,
      point: GeomInput_pointApply,
      points: GeomInput_pointsApply,
      polygon: GeomInput_polygonApply,
      polygons: GeomInput_polygonsApply
    }
  },
  GeomPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      box: GeomInput_boxApply,
      boxes: GeomInput_boxesApply,
      circle: GeomInput_circleApply,
      circles: GeomInput_circlesApply,
      closedPath: GeomInput_closedPathApply,
      closedPaths: GeomInput_closedPathsApply,
      id: GeomInput_idApply,
      line: GeomInput_lineApply,
      lines: GeomInput_linesApply,
      lseg: GeomInput_lsegApply,
      lsegs: GeomInput_lsegsApply,
      openPath: GeomInput_openPathApply,
      openPaths: GeomInput_openPathsApply,
      point: GeomInput_pointApply,
      points: GeomInput_pointsApply,
      polygon: GeomInput_polygonApply,
      polygons: GeomInput_polygonsApply
    }
  },
  UpdateGeomByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      geomPatch: applyPatchFields
    }
  },
  UpdateGeomInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      geomPatch: applyCreateFields
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
  GeomsOrderBy: {
    values: {
      BOX_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "box",
          direction: "ASC"
        });
      },
      BOX_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "box",
          direction: "DESC"
        });
      },
      CIRCLE_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "circle",
          direction: "ASC"
        });
      },
      CIRCLE_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "circle",
          direction: "DESC"
        });
      },
      CLOSED_PATH_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "closed_path",
          direction: "ASC"
        });
      },
      CLOSED_PATH_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "closed_path",
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
      LINE_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "line",
          direction: "ASC"
        });
      },
      LINE_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "line",
          direction: "DESC"
        });
      },
      LSEG_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "lseg",
          direction: "ASC"
        });
      },
      LSEG_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "lseg",
          direction: "DESC"
        });
      },
      OPEN_PATH_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "open_path",
          direction: "ASC"
        });
      },
      OPEN_PATH_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "open_path",
          direction: "DESC"
        });
      },
      POINT_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "point",
          direction: "ASC"
        });
      },
      POINT_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "point",
          direction: "DESC"
        });
      },
      POLYGON_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "polygon",
          direction: "ASC"
        });
      },
      POLYGON_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "polygon",
          direction: "DESC"
        });
      },
      PRIMARY_KEY_ASC(queryBuilder) {
        geomUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        geomUniques[0].attributes.forEach(attributeName => {
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
