import { PgDeleteSingleStep, PgExecutor, PgSelectStep, PgUnionAllStep, TYPES, assertPgClassSingleStep, makeRegistry, pgDeleteSingle, pgInsertSingle, pgSelectFromRecord, pgUpdateSingle, recordCodec } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ObjectStep, SafeError, __ValueStep, access, assertEdgeCapableStep, assertExecutableStep, assertPageInfoCapableStep, connection, constant, context, first, getEnumValueConfig, lambda, list, makeGrafastSchema, node, object, rootValue, specFromNodeId } from "grafast";
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
const fileAttributes = Object.assign(Object.create(null), {
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
const fileIdentifier = sql.identifier(...["inheritence", "file"]);
const fileCodecSpec = {
  name: "file",
  identifier: fileIdentifier,
  attributes: fileAttributes,
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "inheritence",
      name: "file"
    },
    tags: Object.create(null)
  },
  executor: executor_mainPgExecutor
};
const fileCodec = recordCodec(fileCodecSpec);
const userAttributes = Object.assign(Object.create(null), {
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
const extensions2 = {
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "inheritence",
    name: "user"
  },
  tags: Object.create(null)
};
const parts2 = ["inheritence", "user"];
const userIdentifier = sql.identifier(...parts2);
const userCodecSpec = {
  name: "user",
  identifier: userIdentifier,
  attributes: userAttributes,
  description: undefined,
  extensions: extensions2,
  executor: executor_mainPgExecutor
};
const userCodec = recordCodec(userCodecSpec);
const userFileAttributes = Object.assign(Object.create(null), {
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
});
const extensions3 = {
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "inheritence",
    name: "user_file"
  },
  tags: Object.create(null)
};
const parts3 = ["inheritence", "user_file"];
const userFileIdentifier = sql.identifier(...parts3);
const userFileCodecSpec = {
  name: "userFile",
  identifier: userFileIdentifier,
  attributes: userFileAttributes,
  description: undefined,
  extensions: extensions3,
  executor: executor_mainPgExecutor
};
const userFileCodec = recordCodec(userFileCodecSpec);
const extensions4 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "inheritence",
    name: "file"
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
const extensions5 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "inheritence",
    name: "user"
  },
  tags: {}
};
const uniques2 = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_user_user = {
  executor: executor_mainPgExecutor,
  name: "user",
  identifier: "main.inheritence.user",
  from: userCodec.sqlType,
  codec: userCodec,
  uniques: uniques2,
  isVirtual: false,
  description: undefined,
  extensions: extensions5
};
const extensions6 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "inheritence",
    name: "user_file"
  },
  tags: {}
};
const uniques3 = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: uniques[0].extensions.tags
  }
}];
const registryConfig_pgResources_user_file_user_file = {
  executor: executor_mainPgExecutor,
  name: "user_file",
  identifier: "main.inheritence.user_file",
  from: userFileCodec.sqlType,
  codec: userFileCodec,
  uniques: uniques3,
  isVirtual: false,
  description: undefined,
  extensions: extensions6
};
const registry = makeRegistry({
  pgCodecs: Object.assign(Object.create(null), {
    text: TYPES.text,
    varchar: TYPES.varchar,
    bpchar: TYPES.bpchar,
    int4: TYPES.int,
    file: fileCodec,
    user: userCodec,
    userFile: userFileCodec
  }),
  pgResources: Object.assign(Object.create(null), {
    file: {
      executor: executor_mainPgExecutor,
      name: "file",
      identifier: "main.inheritence.file",
      from: fileCodec.sqlType,
      codec: fileCodec,
      uniques,
      isVirtual: false,
      description: undefined,
      extensions: extensions4
    },
    user: registryConfig_pgResources_user_user,
    user_file: registryConfig_pgResources_user_file_user_file
  }),
  pgRelations: Object.assign(Object.create(null), {
    user: Object.assign(Object.create(null), {
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
    }),
    userFile: Object.assign(Object.create(null), {
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
    })
  })
});
const pgResource_filePgResource = registry.pgResources["file"];
const pgResource_userPgResource = registry.pgResources["user"];
const pgResource_user_filePgResource = registry.pgResources["user_file"];
const nodeIdHandlerByTypeName = Object.assign(Object.create(null), {
  Query: handler,
  File: {
    typeName: "File",
    codec: nodeIdCodecs_base64JSON_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("files", false), $record.get("id")]);
    },
    getSpec($list) {
      return {
        id: access($list, [1])
      };
    },
    get(spec) {
      return pgResource_filePgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "files";
    }
  },
  User: {
    typeName: "User",
    codec: nodeIdCodecs_base64JSON_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("users", false), $record.get("id")]);
    },
    getSpec($list) {
      return {
        id: access($list, [1])
      };
    },
    get(spec) {
      return pgResource_userPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "users";
    }
  },
  UserFile: {
    typeName: "UserFile",
    codec: nodeIdCodecs_base64JSON_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("user_files", false), $record.get("id")]);
    },
    getSpec($list) {
      return {
        id: access($list, [1])
      };
    },
    get(spec) {
      return pgResource_user_filePgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "user_files";
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
})(nodeIdHandlerByTypeName.File);
const fetcher2 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName.User);
const fetcher3 = (handler => {
  const fn = $nodeId => {
    const $decoded = lambda($nodeId, specForHandler(handler));
    return handler.get(handler.getSpec($decoded));
  };
  fn.deprecationReason = handler.deprecationReason;
  return fn;
})(nodeIdHandlerByTypeName.UserFile);
function Query_allFiles_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allFiles_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Query_allFiles_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allFiles_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Query_allFiles_after_applyPlan(_, $connection, val) {
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
function Query_allUsers_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allUsers_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Query_allUsers_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allUsers_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Query_allUsers_after_applyPlan(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
function Query_allUserFiles_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allUserFiles_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Query_allUserFiles_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allUserFiles_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Query_allUserFiles_after_applyPlan(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
function User_userFilesByUserId_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function User_userFilesByUserId_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function User_userFilesByUserId_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function User_userFilesByUserId_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function User_userFilesByUserId_after_applyPlan(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
function UserFilesConnection_nodesPlan($connection) {
  return $connection.nodes();
}
function UserFilesConnection_edgesPlan($connection) {
  return $connection.edges();
}
function UserFilesConnection_pageInfoPlan($connection) {
  // TYPES: why is this a TypeScript issue without the 'any'?
  return $connection.pageInfo();
}
function PageInfo_hasNextPagePlan($pageInfo) {
  return $pageInfo.hasNextPage();
}
function PageInfo_hasPreviousPagePlan($pageInfo) {
  return $pageInfo.hasPreviousPage();
}
function FilesConnection_nodesPlan($connection) {
  return $connection.nodes();
}
function FilesConnection_edgesPlan($connection) {
  return $connection.edges();
}
function FilesConnection_pageInfoPlan($connection) {
  // TYPES: why is this a TypeScript issue without the 'any'?
  return $connection.pageInfo();
}
function UsersConnection_nodesPlan($connection) {
  return $connection.nodes();
}
function UsersConnection_edgesPlan($connection) {
  return $connection.edges();
}
function UsersConnection_pageInfoPlan($connection) {
  // TYPES: why is this a TypeScript issue without the 'any'?
  return $connection.pageInfo();
}
function Mutation_createFile_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_createUser_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_createUserFile_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.File, $nodeId);
};
function Mutation_updateFile_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updateFileById_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs2 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.User, $nodeId);
};
function Mutation_updateUser_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updateUserById_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs3 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.UserFile, $nodeId);
};
function Mutation_updateUserFile_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updateUserFileById_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs4 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.File, $nodeId);
};
function Mutation_deleteFile_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deleteFileById_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs5 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.User, $nodeId);
};
function Mutation_deleteUser_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deleteUserById_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs6 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.UserFile, $nodeId);
};
function Mutation_deleteUserFile_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deleteUserFileById_input_applyPlan(_, $object) {
  return $object;
}
function CreateFilePayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function CreateFilePayload_filePlan($object) {
  return $object.get("result");
}
function CreateFilePayload_queryPlan() {
  return rootValue();
}
function CreateFileInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function CreateFileInput_file_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function CreateUserPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function CreateUserPayload_userPlan($object) {
  return $object.get("result");
}
function CreateUserPayload_queryPlan() {
  return rootValue();
}
function CreateUserInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function CreateUserInput_user_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function CreateUserFilePayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function CreateUserFilePayload_userFilePlan($object) {
  return $object.get("result");
}
function CreateUserFilePayload_queryPlan() {
  return rootValue();
}
function CreateUserFileInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function CreateUserFileInput_userFile_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateFilePayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function UpdateFilePayload_filePlan($object) {
  return $object.get("result");
}
function UpdateFilePayload_queryPlan() {
  return rootValue();
}
function UpdateFileInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateFileInput_filePatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateFileByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateFileByIdInput_filePatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateUserPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function UpdateUserPayload_userPlan($object) {
  return $object.get("result");
}
function UpdateUserPayload_queryPlan() {
  return rootValue();
}
function UpdateUserInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateUserInput_userPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateUserByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateUserByIdInput_userPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateUserFilePayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function UpdateUserFilePayload_userFilePlan($object) {
  return $object.get("result");
}
function UpdateUserFilePayload_queryPlan() {
  return rootValue();
}
function UpdateUserFileInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateUserFileInput_userFilePatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdateUserFileByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdateUserFileByIdInput_userFilePatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function DeleteFilePayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function DeleteFilePayload_filePlan($object) {
  return $object.get("result");
}
function DeleteFilePayload_queryPlan() {
  return rootValue();
}
function DeleteFileInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteFileByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteUserPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function DeleteUserPayload_userPlan($object) {
  return $object.get("result");
}
function DeleteUserPayload_queryPlan() {
  return rootValue();
}
function DeleteUserInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteUserByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteUserFilePayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function DeleteUserFilePayload_userFilePlan($object) {
  return $object.get("result");
}
function DeleteUserFilePayload_queryPlan() {
  return rootValue();
}
function DeleteUserFileInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeleteUserFileByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
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

    """The method to use when ordering \`File\`."""
    orderBy: [FilesOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: FileCondition
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

    """The method to use when ordering \`User\`."""
    orderBy: [UsersOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: UserCondition
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

    """The method to use when ordering \`UserFile\`."""
    orderBy: [UserFilesOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: UserFileCondition
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

    """The method to use when ordering \`UserFile\`."""
    orderBy: [UserFilesOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: UserFileCondition
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

"""
A condition to be used against \`File\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input FileCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`filename\` field."""
  filename: String
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
A condition to be used against \`User\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input UserCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`name\` field."""
  name: String
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
    fileById: {
      plan(_$root, args) {
        return pgResource_filePgResource.get({
          id: args.get("id")
        });
      },
      args: {
        id: undefined
      }
    },
    userById: {
      plan(_$root, args) {
        return pgResource_userPgResource.get({
          id: args.get("id")
        });
      },
      args: {
        id: undefined
      }
    },
    userFileById: {
      plan(_$root, args) {
        return pgResource_user_filePgResource.get({
          id: args.get("id")
        });
      },
      args: {
        id: undefined
      }
    },
    file: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    user: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher2($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    userFile: {
      plan(_$parent, args) {
        const $nodeId = args.get("nodeId");
        return fetcher3($nodeId);
      },
      args: {
        nodeId: undefined
      }
    },
    allFiles: {
      plan() {
        return connection(pgResource_filePgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allFiles_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allFiles_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allFiles_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allFiles_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allFiles_after_applyPlan
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("FilesOrderBy"));
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
    allUsers: {
      plan() {
        return connection(pgResource_userPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allUsers_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allUsers_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allUsers_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allUsers_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allUsers_after_applyPlan
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("UsersOrderBy"));
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
    allUserFiles: {
      plan() {
        return connection(pgResource_user_filePgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allUserFiles_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allUserFiles_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allUserFiles_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allUserFiles_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allUserFiles_after_applyPlan
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("UserFilesOrderBy"));
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
  File: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.File.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.File.codec.name].encode);
    },
    id($record) {
      return $record.get("id");
    },
    filename($record) {
      return $record.get("filename");
    }
  },
  User: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.User.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.User.codec.name].encode);
    },
    id($record) {
      return $record.get("id");
    },
    name($record) {
      return $record.get("name");
    },
    userFilesByUserId: {
      plan($record) {
        const $records = pgResource_user_filePgResource.find({
          user_id: $record.get("id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan: User_userFilesByUserId_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: User_userFilesByUserId_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: User_userFilesByUserId_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: User_userFilesByUserId_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: User_userFilesByUserId_after_applyPlan
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("UserFilesOrderBy"));
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
  UserFilesConnection: {
    __assertStep: ConnectionStep,
    nodes: UserFilesConnection_nodesPlan,
    edges: UserFilesConnection_edgesPlan,
    pageInfo: UserFilesConnection_pageInfoPlan,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  UserFile: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.UserFile.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.UserFile.codec.name].encode);
    },
    id($record) {
      return $record.get("id");
    },
    filename($record) {
      return $record.get("filename");
    },
    userId($record) {
      return $record.get("user_id");
    },
    userByUserId($record) {
      return pgResource_userPgResource.get({
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
  UserFilesOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        uniques3[0].attributes.forEach(attributeName => {
          const attribute = userFileCodec.attributes[attributeName];
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
        uniques3[0].attributes.forEach(attributeName => {
          const attribute = userFileCodec.attributes[attributeName];
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
    FILENAME_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "filename",
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
    FILENAME_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "filename",
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
    USER_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "user_id",
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
    USER_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "user_id",
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
  UserFileCondition: {
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
              return sql`${expression} = ${$condition.placeholder(val.get(), userFileAttributes.id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    filename: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "filename",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "filename",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), userFileAttributes.filename.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    userId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "user_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "user_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), userFileAttributes.user_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  FilesConnection: {
    __assertStep: ConnectionStep,
    nodes: FilesConnection_nodesPlan,
    edges: FilesConnection_edgesPlan,
    pageInfo: FilesConnection_pageInfoPlan,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
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
  FilesOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        uniques[0].attributes.forEach(attributeName => {
          const attribute = fileCodec.attributes[attributeName];
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
          const attribute = fileCodec.attributes[attributeName];
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
    FILENAME_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "filename",
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
    FILENAME_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "filename",
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
  FileCondition: {
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
              return sql`${expression} = ${$condition.placeholder(val.get(), fileAttributes.id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    filename: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "filename",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "filename",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), fileAttributes.filename.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UsersConnection: {
    __assertStep: ConnectionStep,
    nodes: UsersConnection_nodesPlan,
    edges: UsersConnection_edgesPlan,
    pageInfo: UsersConnection_pageInfoPlan,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
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
  UsersOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        uniques2[0].attributes.forEach(attributeName => {
          const attribute = userCodec.attributes[attributeName];
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
          const attribute = userCodec.attributes[attributeName];
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
  UserCondition: {
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
              return sql`${expression} = ${$condition.placeholder(val.get(), userAttributes.id.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), userAttributes.name.codec)}`;
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
    createFile: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_filePgResource, Object.create(null))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan: Mutation_createFile_input_applyPlan
        }
      }
    },
    createUser: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_userPgResource, Object.create(null))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan: Mutation_createUser_input_applyPlan
        }
      }
    },
    createUserFile: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_user_filePgResource, Object.create(null))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan: Mutation_createUserFile_input_applyPlan
        }
      }
    },
    updateFile: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_filePgResource, specFromArgs(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_updateFile_input_applyPlan
        }
      }
    },
    updateFileById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_filePgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_updateFileById_input_applyPlan
        }
      }
    },
    updateUser: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_userPgResource, specFromArgs2(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_updateUser_input_applyPlan
        }
      }
    },
    updateUserById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_userPgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_updateUserById_input_applyPlan
        }
      }
    },
    updateUserFile: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_user_filePgResource, specFromArgs3(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_updateUserFile_input_applyPlan
        }
      }
    },
    updateUserFileById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_user_filePgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_updateUserFileById_input_applyPlan
        }
      }
    },
    deleteFile: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_filePgResource, specFromArgs4(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_deleteFile_input_applyPlan
        }
      }
    },
    deleteFileById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_filePgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_deleteFileById_input_applyPlan
        }
      }
    },
    deleteUser: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_userPgResource, specFromArgs5(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_deleteUser_input_applyPlan
        }
      }
    },
    deleteUserById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_userPgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_deleteUserById_input_applyPlan
        }
      }
    },
    deleteUserFile: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_user_filePgResource, specFromArgs6(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_deleteUserFile_input_applyPlan
        }
      }
    },
    deleteUserFileById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_user_filePgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_deleteUserFileById_input_applyPlan
        }
      }
    }
  },
  CreateFilePayload: {
    __assertStep: assertExecutableStep,
    clientMutationId: CreateFilePayload_clientMutationIdPlan,
    file: CreateFilePayload_filePlan,
    query: CreateFilePayload_queryPlan,
    fileEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = uniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_filePgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("FilesOrderBy"));
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
  CreateFileInput: {
    clientMutationId: {
      applyPlan: CreateFileInput_clientMutationId_applyPlan,
      autoApplyAfterParentApplyPlan: true
    },
    file: {
      applyPlan: CreateFileInput_file_applyPlan,
      autoApplyAfterParentApplyPlan: true
    }
  },
  FileInput: {
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    filename: {
      applyPlan($insert, val) {
        $insert.set("filename", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreateUserPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId: CreateUserPayload_clientMutationIdPlan,
    user: CreateUserPayload_userPlan,
    query: CreateUserPayload_queryPlan,
    userEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = uniques2[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_userPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("UsersOrderBy"));
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
  CreateUserInput: {
    clientMutationId: {
      applyPlan: CreateUserInput_clientMutationId_applyPlan,
      autoApplyAfterParentApplyPlan: true
    },
    user: {
      applyPlan: CreateUserInput_user_applyPlan,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UserInput: {
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
  CreateUserFilePayload: {
    __assertStep: assertExecutableStep,
    clientMutationId: CreateUserFilePayload_clientMutationIdPlan,
    userFile: CreateUserFilePayload_userFilePlan,
    query: CreateUserFilePayload_queryPlan,
    userFileEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = uniques3[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_user_filePgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("UserFilesOrderBy"));
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
    userByUserId($record) {
      return pgResource_userPgResource.get({
        id: $record.get("result").get("user_id")
      });
    }
  },
  CreateUserFileInput: {
    clientMutationId: {
      applyPlan: CreateUserFileInput_clientMutationId_applyPlan,
      autoApplyAfterParentApplyPlan: true
    },
    userFile: {
      applyPlan: CreateUserFileInput_userFile_applyPlan,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UserFileInput: {
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    filename: {
      applyPlan($insert, val) {
        $insert.set("filename", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    userId: {
      applyPlan($insert, val) {
        $insert.set("user_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateFilePayload: {
    __assertStep: ObjectStep,
    clientMutationId: UpdateFilePayload_clientMutationIdPlan,
    file: UpdateFilePayload_filePlan,
    query: UpdateFilePayload_queryPlan,
    fileEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = uniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_filePgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("FilesOrderBy"));
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
  UpdateFileInput: {
    clientMutationId: {
      applyPlan: UpdateFileInput_clientMutationId_applyPlan
    },
    nodeId: undefined,
    filePatch: {
      applyPlan: UpdateFileInput_filePatch_applyPlan
    }
  },
  FilePatch: {
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    filename: {
      applyPlan($insert, val) {
        $insert.set("filename", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateFileByIdInput: {
    clientMutationId: {
      applyPlan: UpdateFileByIdInput_clientMutationId_applyPlan
    },
    id: undefined,
    filePatch: {
      applyPlan: UpdateFileByIdInput_filePatch_applyPlan
    }
  },
  UpdateUserPayload: {
    __assertStep: ObjectStep,
    clientMutationId: UpdateUserPayload_clientMutationIdPlan,
    user: UpdateUserPayload_userPlan,
    query: UpdateUserPayload_queryPlan,
    userEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = uniques2[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_userPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("UsersOrderBy"));
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
  UpdateUserInput: {
    clientMutationId: {
      applyPlan: UpdateUserInput_clientMutationId_applyPlan
    },
    nodeId: undefined,
    userPatch: {
      applyPlan: UpdateUserInput_userPatch_applyPlan
    }
  },
  UserPatch: {
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
  UpdateUserByIdInput: {
    clientMutationId: {
      applyPlan: UpdateUserByIdInput_clientMutationId_applyPlan
    },
    id: undefined,
    userPatch: {
      applyPlan: UpdateUserByIdInput_userPatch_applyPlan
    }
  },
  UpdateUserFilePayload: {
    __assertStep: ObjectStep,
    clientMutationId: UpdateUserFilePayload_clientMutationIdPlan,
    userFile: UpdateUserFilePayload_userFilePlan,
    query: UpdateUserFilePayload_queryPlan,
    userFileEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = uniques3[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_user_filePgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("UserFilesOrderBy"));
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
    userByUserId($record) {
      return pgResource_userPgResource.get({
        id: $record.get("result").get("user_id")
      });
    }
  },
  UpdateUserFileInput: {
    clientMutationId: {
      applyPlan: UpdateUserFileInput_clientMutationId_applyPlan
    },
    nodeId: undefined,
    userFilePatch: {
      applyPlan: UpdateUserFileInput_userFilePatch_applyPlan
    }
  },
  UserFilePatch: {
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    filename: {
      applyPlan($insert, val) {
        $insert.set("filename", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    userId: {
      applyPlan($insert, val) {
        $insert.set("user_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateUserFileByIdInput: {
    clientMutationId: {
      applyPlan: UpdateUserFileByIdInput_clientMutationId_applyPlan
    },
    id: undefined,
    userFilePatch: {
      applyPlan: UpdateUserFileByIdInput_userFilePatch_applyPlan
    }
  },
  DeleteFilePayload: {
    __assertStep: ObjectStep,
    clientMutationId: DeleteFilePayload_clientMutationIdPlan,
    file: DeleteFilePayload_filePlan,
    deletedFileId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.File.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query: DeleteFilePayload_queryPlan,
    fileEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = uniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_filePgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("FilesOrderBy"));
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
  DeleteFileInput: {
    clientMutationId: {
      applyPlan: DeleteFileInput_clientMutationId_applyPlan
    },
    nodeId: undefined
  },
  DeleteFileByIdInput: {
    clientMutationId: {
      applyPlan: DeleteFileByIdInput_clientMutationId_applyPlan
    },
    id: undefined
  },
  DeleteUserPayload: {
    __assertStep: ObjectStep,
    clientMutationId: DeleteUserPayload_clientMutationIdPlan,
    user: DeleteUserPayload_userPlan,
    deletedUserId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.User.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query: DeleteUserPayload_queryPlan,
    userEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = uniques2[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_userPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("UsersOrderBy"));
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
  DeleteUserInput: {
    clientMutationId: {
      applyPlan: DeleteUserInput_clientMutationId_applyPlan
    },
    nodeId: undefined
  },
  DeleteUserByIdInput: {
    clientMutationId: {
      applyPlan: DeleteUserByIdInput_clientMutationId_applyPlan
    },
    id: undefined
  },
  DeleteUserFilePayload: {
    __assertStep: ObjectStep,
    clientMutationId: DeleteUserFilePayload_clientMutationIdPlan,
    userFile: DeleteUserFilePayload_userFilePlan,
    deletedUserFileId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.UserFile.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query: DeleteUserFilePayload_queryPlan,
    userFileEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = uniques3[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_user_filePgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("UserFilesOrderBy"));
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
    userByUserId($record) {
      return pgResource_userPgResource.get({
        id: $record.get("result").get("user_id")
      });
    }
  },
  DeleteUserFileInput: {
    clientMutationId: {
      applyPlan: DeleteUserFileInput_clientMutationId_applyPlan
    },
    nodeId: undefined
  },
  DeleteUserFileByIdInput: {
    clientMutationId: {
      applyPlan: DeleteUserFileByIdInput_clientMutationId_applyPlan
    },
    id: undefined
  }
};
export const schema = makeGrafastSchema({
  typeDefs: typeDefs,
  plans: plans
});
