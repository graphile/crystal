import { PgDeleteSingleStep, PgExecutor, TYPES, assertPgClassSingleStep, makeRegistry, pgDeleteSingle, pgInsertSingle, pgSelectFromRecord, pgUpdateSingle, recordCodec, sqlValueWithCodec } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ObjectStep, __ValueStep, access, assertEdgeCapableStep, assertExecutableStep, assertPageInfoCapableStep, bakedInputRuntime, connection, constant, context, createObjectAndApplyChildren, first, get as get2, inhibitOnNull, inspect, lambda, list, makeDecodeNodeId, makeGrafastSchema, object, rootValue, specFromNodeId } from "grafast";
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
const fileIdentifier = sql.identifier("inheritence", "file");
const fileCodec = recordCodec({
  name: "file",
  identifier: fileIdentifier,
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
    filename: {
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
      schemaName: "inheritence",
      name: "file"
    },
    tags: {
      __proto__: null
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
      schemaName: "inheritence",
      name: "user"
    },
    tags: {
      __proto__: null
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
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {}
      }
    },
    filename: {
      description: undefined,
      codec: TYPES.text,
      notNull: true,
      hasDefault: false,
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
        tags: {}
      }
    }
  },
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "inheritence",
      name: "user_file"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const fileUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const userUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const registryConfig_pgResources_user_user = {
  executor: executor,
  name: "user",
  identifier: "main.inheritence.user",
  from: userIdentifier,
  codec: userCodec,
  uniques: userUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "inheritence",
      name: "user"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {}
  }
};
const user_fileUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: fileUniques[0].extensions.tags
  }
}];
const registryConfig_pgResources_user_file_user_file = {
  executor: executor,
  name: "user_file",
  identifier: "main.inheritence.user_file",
  from: userFileIdentifier,
  codec: userFileCodec,
  uniques: user_fileUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "inheritence",
      name: "user_file"
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
    file: fileCodec,
    user: userCodec,
    userFile: userFileCodec
  },
  pgResources: {
    __proto__: null,
    file: {
      executor: executor,
      name: "file",
      identifier: "main.inheritence.file",
      from: fileIdentifier,
      codec: fileCodec,
      uniques: fileUniques,
      isVirtual: false,
      description: undefined,
      extensions: {
        description: undefined,
        pg: {
          serviceName: "main",
          schemaName: "inheritence",
          name: "file"
        },
        isInsertable: true,
        isUpdatable: true,
        isDeletable: true,
        tags: {}
      }
    },
    user: registryConfig_pgResources_user_user,
    user_file: registryConfig_pgResources_user_file_user_file
  },
  pgRelations: {
    __proto__: null,
    user: {
      __proto__: null,
      userFilesByTheirUserId: {
        localCodec: userCodec,
        remoteResourceOptions: registryConfig_pgResources_user_file_user_file,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["user_id"],
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
    userFile: {
      __proto__: null,
      userByMyUserId: {
        localCodec: userFileCodec,
        remoteResourceOptions: registryConfig_pgResources_user_user,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["user_id"],
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
    }
  }
});
const resource_filePgResource = registry.pgResources["file"];
const resource_userPgResource = registry.pgResources["user"];
const resource_user_filePgResource = registry.pgResources["user_file"];
const nodeIdHandler_File = {
  typeName: "File",
  codec: nodeIdCodecs_base64JSON_base64JSON,
  deprecationReason: undefined,
  plan($record) {
    return list([constant("files", false), $record.get("id")]);
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
    return resource_filePgResource.get(spec);
  },
  match(obj) {
    return obj[0] === "files";
  }
};
function specForHandler(handler) {
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
  return spec;
}
const nodeFetcher_File = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_File));
  return nodeIdHandler_File.get(nodeIdHandler_File.getSpec($decoded));
};
const nodeIdHandler_User = {
  typeName: "User",
  codec: nodeIdCodecs_base64JSON_base64JSON,
  deprecationReason: undefined,
  plan($record) {
    return list([constant("users", false), $record.get("id")]);
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
    return resource_userPgResource.get(spec);
  },
  match(obj) {
    return obj[0] === "users";
  }
};
const nodeFetcher_User = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_User));
  return nodeIdHandler_User.get(nodeIdHandler_User.getSpec($decoded));
};
const nodeIdHandler_UserFile = {
  typeName: "UserFile",
  codec: nodeIdCodecs_base64JSON_base64JSON,
  deprecationReason: undefined,
  plan($record) {
    return list([constant("user_files", false), $record.get("id")]);
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
    return resource_user_filePgResource.get(spec);
  },
  match(obj) {
    return obj[0] === "user_files";
  }
};
const nodeFetcher_UserFile = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_UserFile));
  return nodeIdHandler_UserFile.get(nodeIdHandler_UserFile.getSpec($decoded));
};
function qbWhereBuilder(qb) {
  return qb.whereBuilder();
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
function CursorSerialize(value) {
  return "" + value;
}
const specFromArgs_File = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_File, $nodeId);
};
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
export const plans = {
  Query: {
    __assertStep() {
      return true;
    },
    query() {
      return rootValue();
    },
    nodeId($parent) {
      const specifier = nodeIdHandler_Query.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandler_Query.codec.name].encode);
    },
    node(_$root, fieldArgs) {
      return fieldArgs.getRaw("nodeId");
    },
    fileById(_$root, {
      $id
    }) {
      return resource_filePgResource.get({
        id: $id
      });
    },
    userById(_$root, {
      $id
    }) {
      return resource_userPgResource.get({
        id: $id
      });
    },
    userFileById(_$root, {
      $id
    }) {
      return resource_user_filePgResource.get({
        id: $id
      });
    },
    file(_$parent, args) {
      const $nodeId = args.getRaw("nodeId");
      return nodeFetcher_File($nodeId);
    },
    user(_$parent, args) {
      const $nodeId = args.getRaw("nodeId");
      return nodeFetcher_User($nodeId);
    },
    userFile(_$parent, args) {
      const $nodeId = args.getRaw("nodeId");
      return nodeFetcher_UserFile($nodeId);
    },
    allFiles: {
      plan() {
        return connection(resource_filePgResource.find());
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
    allUsers: {
      plan() {
        return connection(resource_userPgResource.find());
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
    allUserFiles: {
      plan() {
        return connection(resource_user_filePgResource.find());
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
  Node: {
    __planType($nodeId) {
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
  },
  File: {
    __assertStep: assertPgClassSingleStep,
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of fileUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_filePgResource.get(spec);
    },
    nodeId($parent) {
      const specifier = nodeIdHandler_File.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandler_File.codec.name].encode);
    }
  },
  User: {
    __assertStep: assertPgClassSingleStep,
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of userUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_userPgResource.get(spec);
    },
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
  UserFilesConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  UserFile: {
    __assertStep: assertPgClassSingleStep,
    __planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of user_fileUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_user_filePgResource.get(spec);
    },
    nodeId($parent) {
      const specifier = nodeIdHandler_UserFile.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandler_UserFile.codec.name].encode);
    },
    userId($record) {
      return $record.get("user_id");
    },
    userByUserId($record) {
      return resource_userPgResource.get({
        id: $record.get("user_id")
      });
    }
  },
  UserFilesEdge: {
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
  UserFileCondition: {
    id($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "id",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    },
    filename($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "filename",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
        }
      });
    },
    userId($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "user_id",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    }
  },
  UserFilesOrderBy: {
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
  },
  FilesConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  FilesEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  FileCondition: {
    id($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "id",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        }
      });
    },
    filename($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "filename",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
        }
      });
    }
  },
  FilesOrderBy: {
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
    }
  },
  UsersConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
    }
  },
  UsersEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  UserCondition: {
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
  },
  UsersOrderBy: {
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
    }
  },
  Mutation: {
    __assertStep: __ValueStep,
    createFile: {
      plan(_, args) {
        const $insert = pgInsertSingle(resource_filePgResource, Object.create(null));
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
    createUser: {
      plan(_, args) {
        const $insert = pgInsertSingle(resource_userPgResource, Object.create(null));
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
    createUserFile: {
      plan(_, args) {
        const $insert = pgInsertSingle(resource_user_filePgResource, Object.create(null));
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
    updateFile: {
      plan(_$root, args) {
        const $update = pgUpdateSingle(resource_filePgResource, specFromArgs_File(args));
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
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
        input(_, $object) {
          return $object;
        }
      }
    }
  },
  CreateFilePayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    file($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    fileEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = fileUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_filePgResource.find(spec);
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
  CreateFileInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    file(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  FileInput: {
    __baked: createObjectAndApplyChildren,
    id(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    filename(obj, val, {
      field,
      schema
    }) {
      obj.set("filename", bakedInputRuntime(schema, field.type, val));
    }
  },
  CreateUserPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    user($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    userEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = userUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_userPgResource.find(spec);
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
  CreateUserInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    user(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UserInput: {
    __baked: createObjectAndApplyChildren,
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
  },
  CreateUserFilePayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      const $insert = $mutation.getStepForKey("result");
      return $insert.getMeta("clientMutationId");
    },
    userFile($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    userFileEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = user_fileUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_user_filePgResource.find(spec);
        }
      })();
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    },
    userByUserId($record) {
      return resource_userPgResource.get({
        id: $record.get("result").get("user_id")
      });
    }
  },
  CreateUserFileInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    userFile(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UserFileInput: {
    __baked: createObjectAndApplyChildren,
    id(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    filename(obj, val, {
      field,
      schema
    }) {
      obj.set("filename", bakedInputRuntime(schema, field.type, val));
    },
    userId(obj, val, {
      field,
      schema
    }) {
      obj.set("user_id", bakedInputRuntime(schema, field.type, val));
    }
  },
  UpdateFilePayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    file($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    fileEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = fileUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_filePgResource.find(spec);
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
  UpdateFileInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    filePatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  FilePatch: {
    __baked: createObjectAndApplyChildren,
    id(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    filename(obj, val, {
      field,
      schema
    }) {
      obj.set("filename", bakedInputRuntime(schema, field.type, val));
    }
  },
  UpdateFileByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    filePatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UpdateUserPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    user($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    userEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = userUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_userPgResource.find(spec);
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
  UpdateUserInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    userPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UserPatch: {
    __baked: createObjectAndApplyChildren,
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
  },
  UpdateUserByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    userPatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UpdateUserFilePayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    userFile($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    userFileEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = user_fileUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_user_filePgResource.find(spec);
        }
      })();
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    },
    userByUserId($record) {
      return resource_userPgResource.get({
        id: $record.get("result").get("user_id")
      });
    }
  },
  UpdateUserFileInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    userFilePatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  UserFilePatch: {
    __baked: createObjectAndApplyChildren,
    id(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    filename(obj, val, {
      field,
      schema
    }) {
      obj.set("filename", bakedInputRuntime(schema, field.type, val));
    },
    userId(obj, val, {
      field,
      schema
    }) {
      obj.set("user_id", bakedInputRuntime(schema, field.type, val));
    }
  },
  UpdateUserFileByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    userFilePatch(qb, arg) {
      if (arg != null) {
        return qb.setBuilder();
      }
    }
  },
  DeleteFilePayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    file($object) {
      return $object.get("result");
    },
    deletedFileId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandler_File.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    fileEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = fileUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_filePgResource.find(spec);
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
  DeleteFileInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteFileByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteUserPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    user($object) {
      return $object.get("result");
    },
    deletedUserId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandler_User.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    userEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = userUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_userPgResource.find(spec);
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
  DeleteUserInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteUserByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteUserFilePayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      const $result = $mutation.getStepForKey("result");
      return $result.getMeta("clientMutationId");
    },
    userFile($object) {
      return $object.get("result");
    },
    deletedUserFileId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandler_UserFile.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query() {
      return rootValue();
    },
    userFileEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", true);
      if (!$result) {
        return constant(null);
      }
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) {
          return pgSelectFromRecord($result.resource, $result.record());
        } else {
          const spec = user_fileUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_user_filePgResource.find(spec);
        }
      })();
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select);
      // NOTE: you must not use `$single = $select.single()`
      // here because doing so will mark the row as unique, and
      // then the ordering logic (and thus cursor) will differ.
      const $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    },
    userByUserId($record) {
      return resource_userPgResource.get({
        id: $record.get("result").get("user_id")
      });
    }
  },
  DeleteUserFileInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeleteUserFileByIdInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  }
};
export const schema = makeGrafastSchema({
  typeDefs: typeDefs,
  plans: plans
});
