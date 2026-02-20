import { PgDeleteSingleStep, PgExecutor, TYPES, assertPgClassSingleStep, enumCodec, makeRegistry, pgDeleteSingle, pgInsertSingle, pgSelectFromRecord, pgUpdateSingle, recordCodec, sqlValueWithCodec } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ObjectStep, __ValueStep, access, assertStep, bakedInputRuntime, connection, constant, context, createObjectAndApplyChildren, first, get as get2, inhibitOnNull, inspect, lambda, list, makeDecodeNodeId, makeGrafastSchema, object, rootValue, specFromNodeId } from "grafast";
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
const fileIdentifier = sql.identifier("inheritence", "file");
const fileCodec = recordCodec({
  name: "file",
  identifier: fileIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    filename: {
      codec: TYPES.text,
      notNull: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "inheritence",
      name: "file"
    }
  },
  executor: executor
});
const userIdentifier = sql.identifier("inheritence", "user");
const userCodec = recordCodec({
  name: "user",
  identifier: userIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    name: {
      codec: TYPES.text,
      notNull: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "inheritence",
      name: "user"
    }
  },
  executor: executor
});
const userFileIdentifier = sql.identifier("inheritence", "user_file");
const userFileCodec = recordCodec({
  name: "userFile",
  identifier: userFileIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    filename: {
      codec: TYPES.text,
      notNull: true
    },
    user_id: {
      codec: TYPES.int,
      notNull: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "inheritence",
      name: "user_file"
    }
  },
  executor: executor
});
const fileUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const userUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const user_resourceOptionsConfig = {
  executor: executor,
  name: "user",
  identifier: "main.inheritence.user",
  from: userIdentifier,
  codec: userCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "inheritence",
      name: "user"
    }
  },
  uniques: userUniques
};
const user_fileUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const user_file_resourceOptionsConfig = {
  executor: executor,
  name: "user_file",
  identifier: "main.inheritence.user_file",
  from: userFileIdentifier,
  codec: userFileCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "inheritence",
      name: "user_file"
    }
  },
  uniques: user_fileUniques
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
    file: fileCodec,
    user: userCodec,
    userFile: userFileCodec,
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
    file: {
      executor: executor,
      name: "file",
      identifier: "main.inheritence.file",
      from: fileIdentifier,
      codec: fileCodec,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "inheritence",
          name: "file"
        }
      },
      uniques: fileUniques
    },
    user: user_resourceOptionsConfig,
    user_file: user_file_resourceOptionsConfig
  },
  pgRelations: {
    __proto__: null,
    user: {
      __proto__: null,
      userFilesByTheirUserId: {
        localCodec: userCodec,
        remoteResourceOptions: user_file_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["user_id"],
        isReferencee: true
      }
    },
    userFile: {
      __proto__: null,
      userByMyUserId: {
        localCodec: userFileCodec,
        remoteResourceOptions: user_resourceOptionsConfig,
        localAttributes: ["user_id"],
        remoteAttributes: ["id"],
        isUnique: true
      }
    }
  }
});
const resource_filePgResource = registry.pgResources["file"];
const resource_userPgResource = registry.pgResources["user"];
const resource_user_filePgResource = registry.pgResources["user_file"];
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
const nodeIdHandler_File = makeTableNodeIdHandler({
  typeName: "File",
  identifier: "files",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_filePgResource,
  pk: fileUniques[0].attributes
});
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
const nodeFetcher_File = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_File));
  return nodeIdHandler_File.get(nodeIdHandler_File.getSpec($decoded));
};
const nodeIdHandler_User = makeTableNodeIdHandler({
  typeName: "User",
  identifier: "users",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_userPgResource,
  pk: userUniques[0].attributes
});
const nodeFetcher_User = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_User));
  return nodeIdHandler_User.get(nodeIdHandler_User.getSpec($decoded));
};
const nodeIdHandler_UserFile = makeTableNodeIdHandler({
  typeName: "UserFile",
  identifier: "user_files",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: resource_user_filePgResource,
  pk: user_fileUniques[0].attributes
});
const nodeFetcher_UserFile = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_UserFile));
  return nodeIdHandler_UserFile.get(nodeIdHandler_UserFile.getSpec($decoded));
};
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
  File: nodeIdHandler_File,
  User: nodeIdHandler_User,
  UserFile: nodeIdHandler_UserFile
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
const totalCountConnectionPlan = $connection => $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
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
function applyInputToInsert(_, $object) {
  return $object;
}
const specFromArgs_File = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_File, $nodeId);
};
function applyInputToUpdateOrDelete(_, $object) {
  return $object;
}
const specFromArgs_User = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_User, $nodeId);
};
const specFromArgs_UserFile = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_UserFile, $nodeId);
};
const specFromArgs_File2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_File, $nodeId);
};
const specFromArgs_User2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_User, $nodeId);
};
const specFromArgs_UserFile2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_UserFile, $nodeId);
};
function getClientMutationIdForCreatePlan($mutation) {
  const $insert = $mutation.getStepForKey("result");
  return $insert.getMeta("clientMutationId");
}
function planCreatePayloadResult($object) {
  return $object.get("result");
}
function queryPlan() {
  return rootValue();
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
function applyClientMutationIdForCreate(qb, val) {
  qb.setMeta("clientMutationId", val);
}
function applyCreateFields(qb, arg) {
  if (arg != null) {
    return qb.setBuilder();
  }
}
function getClientMutationIdForUpdateOrDeletePlan($mutation) {
  const $result = $mutation.getStepForKey("result");
  return $result.getMeta("clientMutationId");
}
function planUpdateOrDeletePayloadResult($object) {
  return $object.get("result");
}
function applyClientMutationIdForUpdateOrDelete(qb, val) {
  qb.setMeta("clientMutationId", val);
}
function applyPatchFields(qb, arg) {
  if (arg != null) {
    return qb.setBuilder();
  }
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

  """Get a single \`File\`."""
  fileById(id: Int!): File

  """Get a single \`User\`."""
  userById(id: Int!): User

  """Get a single \`UserFile\`."""
  userFileById(id: Int!): UserFile

  """Reads a single \`File\` using its globally unique \`ID\`."""
  file(
    """The globally unique \`ID\` to be used in selecting a single \`File\`."""
    nodeId: ID!
  ): File

  """Reads a single \`User\` using its globally unique \`ID\`."""
  user(
    """The globally unique \`ID\` to be used in selecting a single \`User\`."""
    nodeId: ID!
  ): User

  """Reads a single \`UserFile\` using its globally unique \`ID\`."""
  userFile(
    """The globally unique \`ID\` to be used in selecting a single \`UserFile\`."""
    nodeId: ID!
  ): UserFile

  """Reads and enables pagination through a set of \`File\`."""
  allFiles(
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
    condition: FileCondition

    """The method to use when ordering \`File\`."""
    orderBy: [FilesOrderBy!] = [PRIMARY_KEY_ASC]
  ): FilesConnection

  """Reads and enables pagination through a set of \`User\`."""
  allUsers(
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
    condition: UserCondition

    """The method to use when ordering \`User\`."""
    orderBy: [UsersOrderBy!] = [PRIMARY_KEY_ASC]
  ): UsersConnection

  """Reads and enables pagination through a set of \`UserFile\`."""
  allUserFiles(
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
    condition: UserFileCondition

    """The method to use when ordering \`UserFile\`."""
    orderBy: [UserFilesOrderBy!] = [PRIMARY_KEY_ASC]
  ): UserFilesConnection
}

"""An object with a globally unique \`ID\`."""
interface Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
}

type File implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  filename: String!
}

type User implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  name: String!

  """Reads and enables pagination through a set of \`UserFile\`."""
  userFilesByUserId(
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
    condition: UserFileCondition

    """The method to use when ordering \`UserFile\`."""
    orderBy: [UserFilesOrderBy!] = [PRIMARY_KEY_ASC]
  ): UserFilesConnection!
}

"""A connection to a list of \`UserFile\` values."""
type UserFilesConnection {
  """A list of \`UserFile\` objects."""
  nodes: [UserFile]!

  """
  A list of edges which contains the \`UserFile\` and cursor to aid in pagination.
  """
  edges: [UserFilesEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`UserFile\` you could get from the connection."""
  totalCount: Int!
}

type UserFile implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  filename: String!
  userId: Int!

  """Reads a single \`User\` that is related to this \`UserFile\`."""
  userByUserId: User
}

"""A \`UserFile\` edge in the connection."""
type UserFilesEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`UserFile\` at the end of the edge."""
  node: UserFile
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
A condition to be used against \`UserFile\` object types. All fields are tested
for equality and combined with a logical ‘and.’
"""
input UserFileCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`filename\` field."""
  filename: String

  """Checks for equality with the object’s \`userId\` field."""
  userId: Int
}

"""Methods to use when ordering \`UserFile\`."""
enum UserFilesOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  FILENAME_ASC
  FILENAME_DESC
  USER_ID_ASC
  USER_ID_DESC
}

"""A connection to a list of \`File\` values."""
type FilesConnection {
  """A list of \`File\` objects."""
  nodes: [File]!

  """
  A list of edges which contains the \`File\` and cursor to aid in pagination.
  """
  edges: [FilesEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`File\` you could get from the connection."""
  totalCount: Int!
}

"""A \`File\` edge in the connection."""
type FilesEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`File\` at the end of the edge."""
  node: File
}

"""
A condition to be used against \`File\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input FileCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`filename\` field."""
  filename: String
}

"""Methods to use when ordering \`File\`."""
enum FilesOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  FILENAME_ASC
  FILENAME_DESC
}

"""A connection to a list of \`User\` values."""
type UsersConnection {
  """A list of \`User\` objects."""
  nodes: [User]!

  """
  A list of edges which contains the \`User\` and cursor to aid in pagination.
  """
  edges: [UsersEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`User\` you could get from the connection."""
  totalCount: Int!
}

"""A \`User\` edge in the connection."""
type UsersEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`User\` at the end of the edge."""
  node: User
}

"""
A condition to be used against \`User\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input UserCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`name\` field."""
  name: String
}

"""Methods to use when ordering \`User\`."""
enum UsersOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  NAME_ASC
  NAME_DESC
}

"""
The root mutation type which contains root level fields which mutate data.
"""
type Mutation {
  """Creates a single \`File\`."""
  createFile(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateFileInput!
  ): CreateFilePayload

  """Creates a single \`User\`."""
  createUser(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateUserInput!
  ): CreateUserPayload

  """Creates a single \`UserFile\`."""
  createUserFile(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateUserFileInput!
  ): CreateUserFilePayload

  """Updates a single \`File\` using its globally unique id and a patch."""
  updateFile(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateFileInput!
  ): UpdateFilePayload

  """Updates a single \`File\` using a unique key and a patch."""
  updateFileById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateFileByIdInput!
  ): UpdateFilePayload

  """Updates a single \`User\` using its globally unique id and a patch."""
  updateUser(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateUserInput!
  ): UpdateUserPayload

  """Updates a single \`User\` using a unique key and a patch."""
  updateUserById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateUserByIdInput!
  ): UpdateUserPayload

  """Updates a single \`UserFile\` using its globally unique id and a patch."""
  updateUserFile(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateUserFileInput!
  ): UpdateUserFilePayload

  """Updates a single \`UserFile\` using a unique key and a patch."""
  updateUserFileById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateUserFileByIdInput!
  ): UpdateUserFilePayload

  """Deletes a single \`File\` using its globally unique id."""
  deleteFile(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteFileInput!
  ): DeleteFilePayload

  """Deletes a single \`File\` using a unique key."""
  deleteFileById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteFileByIdInput!
  ): DeleteFilePayload

  """Deletes a single \`User\` using its globally unique id."""
  deleteUser(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteUserInput!
  ): DeleteUserPayload

  """Deletes a single \`User\` using a unique key."""
  deleteUserById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteUserByIdInput!
  ): DeleteUserPayload

  """Deletes a single \`UserFile\` using its globally unique id."""
  deleteUserFile(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteUserFileInput!
  ): DeleteUserFilePayload

  """Deletes a single \`UserFile\` using a unique key."""
  deleteUserFileById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteUserFileByIdInput!
  ): DeleteUserFilePayload
}

"""The output of our create \`File\` mutation."""
type CreateFilePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`File\` that was created by this mutation."""
  file: File

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`File\`. May be used by Relay 1."""
  fileEdge(
    """The method to use when ordering \`File\`."""
    orderBy: [FilesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): FilesEdge
}

"""All input for the create \`File\` mutation."""
input CreateFileInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`File\` to be created by this mutation."""
  file: FileInput!
}

"""An input for mutations affecting \`File\`"""
input FileInput {
  id: Int
  filename: String!
}

"""The output of our create \`User\` mutation."""
type CreateUserPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`User\` that was created by this mutation."""
  user: User

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`User\`. May be used by Relay 1."""
  userEdge(
    """The method to use when ordering \`User\`."""
    orderBy: [UsersOrderBy!]! = [PRIMARY_KEY_ASC]
  ): UsersEdge
}

"""All input for the create \`User\` mutation."""
input CreateUserInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`User\` to be created by this mutation."""
  user: UserInput!
}

"""An input for mutations affecting \`User\`"""
input UserInput {
  id: Int
  name: String!
}

"""The output of our create \`UserFile\` mutation."""
type CreateUserFilePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`UserFile\` that was created by this mutation."""
  userFile: UserFile

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`UserFile\`. May be used by Relay 1."""
  userFileEdge(
    """The method to use when ordering \`UserFile\`."""
    orderBy: [UserFilesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): UserFilesEdge

  """Reads a single \`User\` that is related to this \`UserFile\`."""
  userByUserId: User
}

"""All input for the create \`UserFile\` mutation."""
input CreateUserFileInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`UserFile\` to be created by this mutation."""
  userFile: UserFileInput!
}

"""An input for mutations affecting \`UserFile\`"""
input UserFileInput {
  id: Int
  filename: String!
  userId: Int!
}

"""The output of our update \`File\` mutation."""
type UpdateFilePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`File\` that was updated by this mutation."""
  file: File

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`File\`. May be used by Relay 1."""
  fileEdge(
    """The method to use when ordering \`File\`."""
    orderBy: [FilesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): FilesEdge
}

"""All input for the \`updateFile\` mutation."""
input UpdateFileInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`File\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`File\` being updated.
  """
  filePatch: FilePatch!
}

"""Represents an update to a \`File\`. Fields that are set will be updated."""
input FilePatch {
  id: Int
  filename: String
}

"""All input for the \`updateFileById\` mutation."""
input UpdateFileByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`File\` being updated.
  """
  filePatch: FilePatch!
}

"""The output of our update \`User\` mutation."""
type UpdateUserPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`User\` that was updated by this mutation."""
  user: User

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`User\`. May be used by Relay 1."""
  userEdge(
    """The method to use when ordering \`User\`."""
    orderBy: [UsersOrderBy!]! = [PRIMARY_KEY_ASC]
  ): UsersEdge
}

"""All input for the \`updateUser\` mutation."""
input UpdateUserInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`User\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`User\` being updated.
  """
  userPatch: UserPatch!
}

"""Represents an update to a \`User\`. Fields that are set will be updated."""
input UserPatch {
  id: Int
  name: String
}

"""All input for the \`updateUserById\` mutation."""
input UpdateUserByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`User\` being updated.
  """
  userPatch: UserPatch!
}

"""The output of our update \`UserFile\` mutation."""
type UpdateUserFilePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`UserFile\` that was updated by this mutation."""
  userFile: UserFile

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`UserFile\`. May be used by Relay 1."""
  userFileEdge(
    """The method to use when ordering \`UserFile\`."""
    orderBy: [UserFilesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): UserFilesEdge

  """Reads a single \`User\` that is related to this \`UserFile\`."""
  userByUserId: User
}

"""All input for the \`updateUserFile\` mutation."""
input UpdateUserFileInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`UserFile\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`UserFile\` being updated.
  """
  userFilePatch: UserFilePatch!
}

"""
Represents an update to a \`UserFile\`. Fields that are set will be updated.
"""
input UserFilePatch {
  id: Int
  filename: String
  userId: Int
}

"""All input for the \`updateUserFileById\` mutation."""
input UpdateUserFileByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`UserFile\` being updated.
  """
  userFilePatch: UserFilePatch!
}

"""The output of our delete \`File\` mutation."""
type DeleteFilePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`File\` that was deleted by this mutation."""
  file: File
  deletedFileId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`File\`. May be used by Relay 1."""
  fileEdge(
    """The method to use when ordering \`File\`."""
    orderBy: [FilesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): FilesEdge
}

"""All input for the \`deleteFile\` mutation."""
input DeleteFileInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`File\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteFileById\` mutation."""
input DeleteFileByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!
}

"""The output of our delete \`User\` mutation."""
type DeleteUserPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`User\` that was deleted by this mutation."""
  user: User
  deletedUserId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`User\`. May be used by Relay 1."""
  userEdge(
    """The method to use when ordering \`User\`."""
    orderBy: [UsersOrderBy!]! = [PRIMARY_KEY_ASC]
  ): UsersEdge
}

"""All input for the \`deleteUser\` mutation."""
input DeleteUserInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`User\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteUserById\` mutation."""
input DeleteUserByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!
}

"""The output of our delete \`UserFile\` mutation."""
type DeleteUserFilePayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`UserFile\` that was deleted by this mutation."""
  userFile: UserFile
  deletedUserFileId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`UserFile\`. May be used by Relay 1."""
  userFileEdge(
    """The method to use when ordering \`UserFile\`."""
    orderBy: [UserFilesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): UserFilesEdge

  """Reads a single \`User\` that is related to this \`UserFile\`."""
  userByUserId: User
}

"""All input for the \`deleteUserFile\` mutation."""
input DeleteUserFileInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`UserFile\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteUserFileById\` mutation."""
input DeleteUserFileByIdInput {
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
      allFiles: {
        plan() {
          return connection(resource_filePgResource.find());
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
      allUserFiles: {
        plan() {
          return connection(resource_user_filePgResource.find());
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
      allUsers: {
        plan() {
          return connection(resource_userPgResource.find());
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
      file(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_File($nodeId);
      },
      fileById(_$root, {
        $id
      }) {
        return resource_filePgResource.get({
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
      },
      user(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_User($nodeId);
      },
      userById(_$root, {
        $id
      }) {
        return resource_userPgResource.get({
          id: $id
        });
      },
      userFile(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_UserFile($nodeId);
      },
      userFileById(_$root, {
        $id
      }) {
        return resource_user_filePgResource.get({
          id: $id
        });
      }
    }
  },
  Mutation: {
    assertStep: __ValueStep,
    plans: {
      createFile: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_filePgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createUser: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_userPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createUserFile: {
        plan(_, args) {
          const $insert = pgInsertSingle(resource_user_filePgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      deleteFile: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_filePgResource, specFromArgs_File2(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteFileById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_filePgResource, {
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
      deleteUser: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_userPgResource, specFromArgs_User2(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteUserById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_userPgResource, {
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
      deleteUserFile: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_user_filePgResource, specFromArgs_UserFile2(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteUserFileById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(resource_user_filePgResource, {
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
      updateFile: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_filePgResource, specFromArgs_File(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateFileById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_filePgResource, {
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
      updateUser: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_userPgResource, specFromArgs_User(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateUserById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_userPgResource, {
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
      updateUserFile: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_user_filePgResource, specFromArgs_UserFile(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateUserFileById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(resource_user_filePgResource, {
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
  CreateFilePayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      file: planCreatePayloadResult,
      fileEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_filePgResource, fileUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  CreateUserFilePayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan,
      userByUserId($record) {
        return resource_userPgResource.get({
          id: $record.get("result").get("user_id")
        });
      },
      userFile: planCreatePayloadResult,
      userFileEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_user_filePgResource, user_fileUniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  CreateUserPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan,
      user: planCreatePayloadResult,
      userEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_userPgResource, userUniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  DeleteFilePayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedFileId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_File.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      file: planUpdateOrDeletePayloadResult,
      fileEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_filePgResource, fileUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  DeleteUserFilePayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedUserFileId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_UserFile.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      query: queryPlan,
      userByUserId($record) {
        return resource_userPgResource.get({
          id: $record.get("result").get("user_id")
        });
      },
      userFile: planUpdateOrDeletePayloadResult,
      userFileEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_user_filePgResource, user_fileUniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  DeleteUserPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedUserId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_User.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      query: queryPlan,
      user: planUpdateOrDeletePayloadResult,
      userEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_userPgResource, userUniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  File: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nodeId($parent) {
        const specifier = nodeIdHandler_File.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_File.codec.name].encode);
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of fileUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_filePgResource.get(spec);
    }
  },
  FilesConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  UpdateFilePayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      file: planUpdateOrDeletePayloadResult,
      fileEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_filePgResource, fileUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  UpdateUserFilePayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan,
      userByUserId($record) {
        return resource_userPgResource.get({
          id: $record.get("result").get("user_id")
        });
      },
      userFile: planUpdateOrDeletePayloadResult,
      userFileEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_user_filePgResource, user_fileUniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  UpdateUserPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan,
      user: planUpdateOrDeletePayloadResult,
      userEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(resource_userPgResource, userUniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  User: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nodeId($parent) {
        const specifier = nodeIdHandler_User.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_User.codec.name].encode);
      },
      userFilesByUserId: {
        plan($record) {
          const $records = resource_user_filePgResource.find({
            user_id: $record.get("id")
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
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of userUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_userPgResource.get(spec);
    }
  },
  UserFile: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nodeId($parent) {
        const specifier = nodeIdHandler_UserFile.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_UserFile.codec.name].encode);
      },
      userByUserId($record) {
        return resource_userPgResource.get({
          id: $record.get("user_id")
        });
      },
      userId($record) {
        return $record.get("user_id");
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of user_fileUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_user_filePgResource.get(spec);
    }
  },
  UserFilesConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  UsersConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
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
  CreateFileInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      file: applyCreateFields
    }
  },
  CreateUserFileInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      userFile: applyCreateFields
    }
  },
  CreateUserInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      user: applyCreateFields
    }
  },
  DeleteFileByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteFileInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteUserByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteUserFileByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteUserFileInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteUserInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  FileCondition: {
    plans: {
      filename($condition, val) {
        return applyAttributeCondition("filename", TYPES.text, $condition, val);
      },
      id($condition, val) {
        return applyAttributeCondition("id", TYPES.int, $condition, val);
      }
    }
  },
  FileInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      filename(obj, val, {
        field,
        schema
      }) {
        obj.set("filename", bakedInputRuntime(schema, field.type, val));
      },
      id(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  FilePatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      filename(obj, val, {
        field,
        schema
      }) {
        obj.set("filename", bakedInputRuntime(schema, field.type, val));
      },
      id(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  UpdateFileByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      filePatch: applyPatchFields
    }
  },
  UpdateFileInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      filePatch: applyPatchFields
    }
  },
  UpdateUserByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      userPatch: applyPatchFields
    }
  },
  UpdateUserFileByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      userFilePatch: applyPatchFields
    }
  },
  UpdateUserFileInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      userFilePatch: applyPatchFields
    }
  },
  UpdateUserInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      userPatch: applyPatchFields
    }
  },
  UserCondition: {
    plans: {
      id($condition, val) {
        return applyAttributeCondition("id", TYPES.int, $condition, val);
      },
      name($condition, val) {
        return applyAttributeCondition("name", TYPES.text, $condition, val);
      }
    }
  },
  UserFileCondition: {
    plans: {
      filename($condition, val) {
        return applyAttributeCondition("filename", TYPES.text, $condition, val);
      },
      id($condition, val) {
        return applyAttributeCondition("id", TYPES.int, $condition, val);
      },
      userId($condition, val) {
        return applyAttributeCondition("user_id", TYPES.int, $condition, val);
      }
    }
  },
  UserFileInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      filename(obj, val, {
        field,
        schema
      }) {
        obj.set("filename", bakedInputRuntime(schema, field.type, val));
      },
      id(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      },
      userId(obj, val, {
        field,
        schema
      }) {
        obj.set("user_id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  UserFilePatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      filename(obj, val, {
        field,
        schema
      }) {
        obj.set("filename", bakedInputRuntime(schema, field.type, val));
      },
      id(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      },
      userId(obj, val, {
        field,
        schema
      }) {
        obj.set("user_id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  UserInput: {
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
  UserPatch: {
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
  FilesOrderBy: {
    values: {
      FILENAME_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "filename",
          direction: "ASC"
        });
      },
      FILENAME_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "filename",
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
        fileUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        fileUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      }
    }
  },
  UserFilesOrderBy: {
    values: {
      FILENAME_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "filename",
          direction: "ASC"
        });
      },
      FILENAME_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "filename",
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
        user_fileUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        user_fileUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      USER_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "user_id",
          direction: "ASC"
        });
      },
      USER_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "user_id",
          direction: "DESC"
        });
      }
    }
  },
  UsersOrderBy: {
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
        userUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        userUniques[0].attributes.forEach(attributeName => {
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
