import { PgDeleteSingleStep, PgExecutor, PgResource, PgSelectSingleStep, PgSelectStep, PgUnionAllStep, TYPES, assertPgClassSingleStep, makeRegistry, pgClassExpression, pgDeleteSingle, pgInsertSingle, pgSelectFromRecord, pgSelectSingleFromRecord, pgUpdateSingle, recordCodec, sqlFromArgDigests } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ObjectStep, SafeError, __ValueStep, access, assertEdgeCapableStep, assertExecutableStep, assertPageInfoCapableStep, connection, constant, context, first, getEnumValueConfig, lambda, list, makeGrafastSchema, node, object, rootValue, specFromNodeId, stepAMayDependOnStepB } from "grafast";
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
    notNull: false,
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
const peopleIdentifier = sql.identifier(...["simple_collections", "people"]);
const peopleCodecSpec = {
  name: "people",
  identifier: peopleIdentifier,
  attributes: peopleAttributes,
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "simple_collections",
      name: "people"
    },
    tags: Object.create(null)
  },
  executor: executor_mainPgExecutor
};
const peopleCodec = recordCodec(peopleCodecSpec);
const petsAttributes = Object.assign(Object.create(null), {
  id: {
    description: undefined,
    codec: TYPES.int,
    notNull: true,
    hasDefault: true,
    extensions: {
      tags: {}
    }
  },
  owner_id: {
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
});
const extensions2 = {
  isTableLike: true,
  pg: {
    serviceName: "main",
    schemaName: "simple_collections",
    name: "pets"
  },
  tags: Object.create(null)
};
const parts2 = ["simple_collections", "pets"];
const petsIdentifier = sql.identifier(...parts2);
const petsCodecSpec = {
  name: "pets",
  identifier: petsIdentifier,
  attributes: petsAttributes,
  description: undefined,
  extensions: extensions2,
  executor: executor_mainPgExecutor
};
const petsCodec = recordCodec(petsCodecSpec);
const extensions3 = {
  description: undefined,
  pg: {
    serviceName: "main",
    schemaName: "simple_collections",
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
  identifier: "main.simple_collections.people",
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
    schemaName: "simple_collections",
    name: "pets"
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
const registryConfig_pgResources_pets_pets = {
  executor: executor_mainPgExecutor,
  name: "pets",
  identifier: "main.simple_collections.pets",
  from: petsCodec.sqlType,
  codec: petsCodec,
  uniques: uniques2,
  isVirtual: false,
  description: undefined,
  extensions: extensions4
};
const parts3 = ["simple_collections", "people_odd_pets"];
const sqlIdent = sql.identifier(...parts3);
const options_people_odd_pets = {
  name: "people_odd_pets",
  identifier: "main.simple_collections.people_odd_pets(simple_collections.people)",
  from(...args) {
    return sql`${sqlIdent}(${sqlFromArgDigests(args)})`;
  },
  parameters: [{
    name: "p",
    required: true,
    notNull: false,
    codec: peopleCodec
  }],
  returnsArray: false,
  returnsSetof: true,
  isMutation: false,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "simple_collections",
      name: "people_odd_pets"
    },
    tags: {
      behavior: ["-queryField -mutationField typeField", "-filter -order"]
    }
  },
  description: undefined
};
const registry = makeRegistry({
  pgCodecs: Object.assign(Object.create(null), {
    people: peopleCodec,
    int4: TYPES.int,
    text: TYPES.text,
    pets: petsCodec,
    varchar: TYPES.varchar,
    bpchar: TYPES.bpchar
  }),
  pgResources: Object.assign(Object.create(null), {
    people: registryConfig_pgResources_people_people,
    pets: registryConfig_pgResources_pets_pets,
    people_odd_pets: PgResource.functionResourceOptions(registryConfig_pgResources_pets_pets, options_people_odd_pets)
  }),
  pgRelations: Object.assign(Object.create(null), {
    people: Object.assign(Object.create(null), {
      petsByTheirOwnerId: {
        localCodec: peopleCodec,
        remoteResourceOptions: registryConfig_pgResources_pets_pets,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["owner_id"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            simpleCollections: "only",
            behavior: ["+list -connection"]
          }
        }
      }
    }),
    pets: Object.assign(Object.create(null), {
      peopleByMyOwnerId: {
        localCodec: petsCodec,
        remoteResourceOptions: registryConfig_pgResources_people_people,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["owner_id"],
        remoteAttributes: ["id"],
        isUnique: true,
        isReferencee: false,
        description: undefined,
        extensions: {
          tags: {
            simpleCollections: "only",
            behavior: ["+list -connection"]
          }
        }
      }
    })
  })
});
const pgResource_peoplePgResource = registry.pgResources["people"];
const pgResource_petsPgResource = registry.pgResources["pets"];
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
  Pet: {
    typeName: "Pet",
    codec: nodeIdCodecs_base64JSON_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("pets", false), $record.get("id")]);
    },
    getSpec($list) {
      return {
        id: access($list, [1])
      };
    },
    get(spec) {
      return pgResource_petsPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "pets";
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
})(nodeIdHandlerByTypeName.Pet);
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
function Query_allPets_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Query_allPets_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Query_allPets_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Query_allPets_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Query_allPets_after_applyPlan(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
function hasRecord($row) {
  return "record" in $row && typeof $row.record === "function";
}
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
const resource_people_odd_petsPgResource = registry.pgResources["people_odd_pets"];
const getSelectPlanFromParentAndArgs = ($in, args, _info) => {
  if (!hasRecord($in)) {
    throw new Error(`Invalid plan, exepcted 'PgSelectSingleStep', 'PgInsertSingleStep', 'PgUpdateSingleStep' or 'PgDeleteSingleStep', but found ${$in}`);
  }
  const extraSelectArgs = makeArgs(args);
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
  if (resource_people_odd_petsPgResource.isUnique && !resource_people_odd_petsPgResource.codec.attributes && typeof resource_people_odd_petsPgResource.from === "function") {
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
    return pgClassExpression($row, resource_people_odd_petsPgResource.codec)`${resource_people_odd_petsPgResource.from(...placeholders.map(placeholder => ({
      placeholder
    })))}`;
  }
  // PERF: or here, if scalar add select to `$row`?
  return resource_people_odd_petsPgResource.execute(selectArgs);
};
function Person_oddPetsPlan($parent, args, info) {
  const $select = getSelectPlanFromParentAndArgs($parent, args, info);
  return connection($select, $item => $item, $item => $item.getParentStep ? $item.getParentStep().cursor() : $item.cursor());
}
function Person_oddPets_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Person_oddPets_last_applyPlan(_, $connection, val) {
  $connection.setLast(val.getRaw());
}
function Person_oddPets_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function Person_oddPets_before_applyPlan(_, $connection, val) {
  $connection.setBefore(val.getRaw());
}
function Person_oddPets_after_applyPlan(_, $connection, val) {
  $connection.setAfter(val.getRaw());
}
function Person_petsByOwnerIdList_first_applyPlan(_, $connection, arg) {
  $connection.setFirst(arg.getRaw());
}
function Person_petsByOwnerIdList_offset_applyPlan(_, $connection, val) {
  $connection.setOffset(val.getRaw());
}
function PetsConnection_nodesPlan($connection) {
  return $connection.nodes();
}
function PetsConnection_edgesPlan($connection) {
  return $connection.edges();
}
function PetsConnection_pageInfoPlan($connection) {
  // TYPES: why is this a TypeScript issue without the 'any'?
  return $connection.pageInfo();
}
function PageInfo_hasNextPagePlan($pageInfo) {
  return $pageInfo.hasNextPage();
}
function PageInfo_hasPreviousPagePlan($pageInfo) {
  return $pageInfo.hasPreviousPage();
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
function Mutation_createPerson_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_createPet_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Person, $nodeId);
};
function Mutation_updatePerson_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updatePersonById_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs2 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Pet, $nodeId);
};
function Mutation_updatePet_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_updatePetById_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs3 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Person, $nodeId);
};
function Mutation_deletePerson_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deletePersonById_input_applyPlan(_, $object) {
  return $object;
}
const specFromArgs4 = args => {
  const $nodeId = args.get(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Pet, $nodeId);
};
function Mutation_deletePet_input_applyPlan(_, $object) {
  return $object;
}
function Mutation_deletePetById_input_applyPlan(_, $object) {
  return $object;
}
function CreatePersonPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function CreatePersonPayload_personPlan($object) {
  return $object.get("result");
}
function CreatePersonPayload_queryPlan() {
  return rootValue();
}
function CreatePersonInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function CreatePersonInput_person_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function CreatePetPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function CreatePetPayload_petPlan($object) {
  return $object.get("result");
}
function CreatePetPayload_queryPlan() {
  return rootValue();
}
function CreatePetInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function CreatePetInput_pet_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdatePersonPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function UpdatePersonPayload_personPlan($object) {
  return $object.get("result");
}
function UpdatePersonPayload_queryPlan() {
  return rootValue();
}
function UpdatePersonInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdatePersonInput_personPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdatePersonByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdatePersonByIdInput_personPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdatePetPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function UpdatePetPayload_petPlan($object) {
  return $object.get("result");
}
function UpdatePetPayload_queryPlan() {
  return rootValue();
}
function UpdatePetInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdatePetInput_petPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function UpdatePetByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function UpdatePetByIdInput_petPatch_applyPlan($object) {
  const $record = $object.getStepForKey("result");
  return $record.setPlan();
}
function DeletePersonPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function DeletePersonPayload_personPlan($object) {
  return $object.get("result");
}
function DeletePersonPayload_queryPlan() {
  return rootValue();
}
function DeletePersonInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeletePersonByIdInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeletePetPayload_clientMutationIdPlan($mutation) {
  return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
}
function DeletePetPayload_petPlan($object) {
  return $object.get("result");
}
function DeletePetPayload_queryPlan() {
  return rootValue();
}
function DeletePetInput_clientMutationId_applyPlan($input, val) {
  $input.set("clientMutationId", val.get());
}
function DeletePetByIdInput_clientMutationId_applyPlan($input, val) {
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

  """Get a single \`Person\`."""
  personById(id: Int!): Person

  """Get a single \`Pet\`."""
  petById(id: Int!): Pet

  """Reads a single \`Person\` using its globally unique \`ID\`."""
  person(
    """The globally unique \`ID\` to be used in selecting a single \`Person\`."""
    nodeId: ID!
  ): Person

  """Reads a single \`Pet\` using its globally unique \`ID\`."""
  pet(
    """The globally unique \`ID\` to be used in selecting a single \`Pet\`."""
    nodeId: ID!
  ): Pet

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

  """Reads and enables pagination through a set of \`Pet\`."""
  allPets(
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

    """The method to use when ordering \`Pet\`."""
    orderBy: [PetsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: PetCondition
  ): PetsConnection
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

  """Reads and enables pagination through a set of \`Pet\`."""
  oddPets(
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
  ): PetsConnection!
  id: Int!
  name: String

  """Reads and enables pagination through a set of \`Pet\`."""
  petsByOwnerIdList(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Skip the first \`n\` values."""
    offset: Int

    """The method to use when ordering \`Pet\`."""
    orderBy: [PetsOrderBy!]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: PetCondition
  ): [Pet!]!
}

"""A connection to a list of \`Pet\` values."""
type PetsConnection {
  """A list of \`Pet\` objects."""
  nodes: [Pet!]!

  """
  A list of edges which contains the \`Pet\` and cursor to aid in pagination.
  """
  edges: [PetsEdge!]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Pet\` you could get from the connection."""
  totalCount: Int!
}

type Pet implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  ownerId: Int!
  name: String

  """Reads a single \`Person\` that is related to this \`Pet\`."""
  personByOwnerId: Person
}

"""A \`Pet\` edge in the connection."""
type PetsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Pet\` at the end of the edge."""
  node: Pet!
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

"""Methods to use when ordering \`Pet\`."""
enum PetsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  OWNER_ID_ASC
  OWNER_ID_DESC
  NAME_ASC
  NAME_DESC
}

"""
A condition to be used against \`Pet\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input PetCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`ownerId\` field."""
  ownerId: Int

  """Checks for equality with the object’s \`name\` field."""
  name: String
}

"""A connection to a list of \`Person\` values."""
type PeopleConnection {
  """A list of \`Person\` objects."""
  nodes: [Person!]!

  """
  A list of edges which contains the \`Person\` and cursor to aid in pagination.
  """
  edges: [PeopleEdge!]!

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
  node: Person!
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

"""
The root mutation type which contains root level fields which mutate data.
"""
type Mutation {
  """Creates a single \`Person\`."""
  createPerson(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreatePersonInput!
  ): CreatePersonPayload

  """Creates a single \`Pet\`."""
  createPet(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreatePetInput!
  ): CreatePetPayload

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

  """Updates a single \`Pet\` using its globally unique id and a patch."""
  updatePet(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdatePetInput!
  ): UpdatePetPayload

  """Updates a single \`Pet\` using a unique key and a patch."""
  updatePetById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdatePetByIdInput!
  ): UpdatePetPayload

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

  """Deletes a single \`Pet\` using its globally unique id."""
  deletePet(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeletePetInput!
  ): DeletePetPayload

  """Deletes a single \`Pet\` using a unique key."""
  deletePetById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeletePetByIdInput!
  ): DeletePetPayload
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
  name: String
}

"""The output of our create \`Pet\` mutation."""
type CreatePetPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Pet\` that was created by this mutation."""
  pet: Pet

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Pet\`. May be used by Relay 1."""
  petEdge(
    """The method to use when ordering \`Pet\`."""
    orderBy: [PetsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PetsEdge

  """Reads a single \`Person\` that is related to this \`Pet\`."""
  personByOwnerId: Person
}

"""All input for the create \`Pet\` mutation."""
input CreatePetInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`Pet\` to be created by this mutation."""
  pet: PetInput!
}

"""An input for mutations affecting \`Pet\`"""
input PetInput {
  id: Int
  ownerId: Int!
  name: String
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
  name: String
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

"""The output of our update \`Pet\` mutation."""
type UpdatePetPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Pet\` that was updated by this mutation."""
  pet: Pet

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Pet\`. May be used by Relay 1."""
  petEdge(
    """The method to use when ordering \`Pet\`."""
    orderBy: [PetsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PetsEdge

  """Reads a single \`Person\` that is related to this \`Pet\`."""
  personByOwnerId: Person
}

"""All input for the \`updatePet\` mutation."""
input UpdatePetInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Pet\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`Pet\` being updated.
  """
  petPatch: PetPatch!
}

"""Represents an update to a \`Pet\`. Fields that are set will be updated."""
input PetPatch {
  id: Int
  ownerId: Int
  name: String
}

"""All input for the \`updatePetById\` mutation."""
input UpdatePetByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`Pet\` being updated.
  """
  petPatch: PetPatch!
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
}

"""The output of our delete \`Pet\` mutation."""
type DeletePetPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Pet\` that was deleted by this mutation."""
  pet: Pet
  deletedPetId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Pet\`. May be used by Relay 1."""
  petEdge(
    """The method to use when ordering \`Pet\`."""
    orderBy: [PetsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PetsEdge

  """Reads a single \`Person\` that is related to this \`Pet\`."""
  personByOwnerId: Person
}

"""All input for the \`deletePet\` mutation."""
input DeletePetInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Pet\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deletePetById\` mutation."""
input DeletePetByIdInput {
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
    petById: {
      plan(_$root, args) {
        return pgResource_petsPgResource.get({
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
    pet: {
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
    allPets: {
      plan() {
        return connection(pgResource_petsPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allPets_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allPets_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allPets_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allPets_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Query_allPets_after_applyPlan
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("PetsOrderBy"));
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
    oddPets: {
      plan: Person_oddPetsPlan,
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan: Person_oddPets_first_applyPlan
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan: Person_oddPets_last_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Person_oddPets_offset_applyPlan
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan: Person_oddPets_before_applyPlan
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan: Person_oddPets_after_applyPlan
        }
      }
    },
    id($record) {
      return $record.get("id");
    },
    name($record) {
      return $record.get("name");
    },
    petsByOwnerIdList: {
      plan($record) {
        return pgResource_petsPgResource.find({
          owner_id: $record.get("id")
        });
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan: Person_petsByOwnerIdList_first_applyPlan
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan: Person_petsByOwnerIdList_offset_applyPlan
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $select, val, info) {
            const $value = val.getRaw();
            applyOrderToPlan($select, $value, info.schema.getType("PetsOrderBy"));
            return null;
          }
        },
        condition: {
          autoApplyAfterParentPlan: true,
          applyPlan(_condition, $select) {
            return $select.wherePlan();
          }
        }
      }
    }
  },
  PetsConnection: {
    __assertStep: ConnectionStep,
    nodes: PetsConnection_nodesPlan,
    edges: PetsConnection_edgesPlan,
    pageInfo: PetsConnection_pageInfoPlan,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  Pet: {
    __assertStep: assertPgClassSingleStep,
    nodeId($parent) {
      const specifier = nodeIdHandlerByTypeName.Pet.plan($parent);
      return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Pet.codec.name].encode);
    },
    id($record) {
      return $record.get("id");
    },
    ownerId($record) {
      return $record.get("owner_id");
    },
    name($record) {
      return $record.get("name");
    },
    personByOwnerId($record) {
      return pgResource_peoplePgResource.get({
        id: $record.get("owner_id")
      });
    }
  },
  PetsEdge: {
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
  PetsOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        uniques2[0].attributes.forEach(attributeName => {
          const attribute = petsCodec.attributes[attributeName];
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
          const attribute = petsCodec.attributes[attributeName];
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
    OWNER_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "owner_id",
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
    OWNER_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "owner_id",
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
  PetCondition: {
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
              return sql`${expression} = ${$condition.placeholder(val.get(), petsAttributes.id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    ownerId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "owner_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "owner_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), petsAttributes.owner_id.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), petsAttributes.name.codec)}`;
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
  Mutation: {
    __assertStep: __ValueStep,
    createPerson: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_peoplePgResource, Object.create(null))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan: Mutation_createPerson_input_applyPlan
        }
      }
    },
    createPet: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(pgResource_petsPgResource, Object.create(null))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan: Mutation_createPet_input_applyPlan
        }
      }
    },
    updatePerson: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_peoplePgResource, specFromArgs(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_updatePerson_input_applyPlan
        }
      }
    },
    updatePersonById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_peoplePgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_updatePersonById_input_applyPlan
        }
      }
    },
    updatePet: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_petsPgResource, specFromArgs2(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_updatePet_input_applyPlan
        }
      }
    },
    updatePetById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(pgResource_petsPgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_updatePetById_input_applyPlan
        }
      }
    },
    deletePerson: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_peoplePgResource, specFromArgs3(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_deletePerson_input_applyPlan
        }
      }
    },
    deletePersonById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_peoplePgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_deletePersonById_input_applyPlan
        }
      }
    },
    deletePet: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_petsPgResource, specFromArgs4(args))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_deletePet_input_applyPlan
        }
      }
    },
    deletePetById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(pgResource_petsPgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan: Mutation_deletePetById_input_applyPlan
        }
      }
    }
  },
  CreatePersonPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId: CreatePersonPayload_clientMutationIdPlan,
    person: CreatePersonPayload_personPlan,
    query: CreatePersonPayload_queryPlan,
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
            const spec = uniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_peoplePgResource.find(spec);
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
      applyPlan: CreatePersonInput_clientMutationId_applyPlan,
      autoApplyAfterParentApplyPlan: true
    },
    person: {
      applyPlan: CreatePersonInput_person_applyPlan,
      autoApplyAfterParentApplyPlan: true
    }
  },
  PersonInput: {
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
  CreatePetPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId: CreatePetPayload_clientMutationIdPlan,
    pet: CreatePetPayload_petPlan,
    query: CreatePetPayload_queryPlan,
    petEdge: {
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
            return pgResource_petsPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("PetsOrderBy"));
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
    personByOwnerId($record) {
      return pgResource_peoplePgResource.get({
        id: $record.get("result").get("owner_id")
      });
    }
  },
  CreatePetInput: {
    clientMutationId: {
      applyPlan: CreatePetInput_clientMutationId_applyPlan,
      autoApplyAfterParentApplyPlan: true
    },
    pet: {
      applyPlan: CreatePetInput_pet_applyPlan,
      autoApplyAfterParentApplyPlan: true
    }
  },
  PetInput: {
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    ownerId: {
      applyPlan($insert, val) {
        $insert.set("owner_id", val.get());
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
  UpdatePersonPayload: {
    __assertStep: ObjectStep,
    clientMutationId: UpdatePersonPayload_clientMutationIdPlan,
    person: UpdatePersonPayload_personPlan,
    query: UpdatePersonPayload_queryPlan,
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
            const spec = uniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_peoplePgResource.find(spec);
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
      applyPlan: UpdatePersonInput_clientMutationId_applyPlan
    },
    nodeId: undefined,
    personPatch: {
      applyPlan: UpdatePersonInput_personPatch_applyPlan
    }
  },
  PersonPatch: {
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
  UpdatePersonByIdInput: {
    clientMutationId: {
      applyPlan: UpdatePersonByIdInput_clientMutationId_applyPlan
    },
    id: undefined,
    personPatch: {
      applyPlan: UpdatePersonByIdInput_personPatch_applyPlan
    }
  },
  UpdatePetPayload: {
    __assertStep: ObjectStep,
    clientMutationId: UpdatePetPayload_clientMutationIdPlan,
    pet: UpdatePetPayload_petPlan,
    query: UpdatePetPayload_queryPlan,
    petEdge: {
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
            return pgResource_petsPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("PetsOrderBy"));
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
    personByOwnerId($record) {
      return pgResource_peoplePgResource.get({
        id: $record.get("result").get("owner_id")
      });
    }
  },
  UpdatePetInput: {
    clientMutationId: {
      applyPlan: UpdatePetInput_clientMutationId_applyPlan
    },
    nodeId: undefined,
    petPatch: {
      applyPlan: UpdatePetInput_petPatch_applyPlan
    }
  },
  PetPatch: {
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    ownerId: {
      applyPlan($insert, val) {
        $insert.set("owner_id", val.get());
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
  UpdatePetByIdInput: {
    clientMutationId: {
      applyPlan: UpdatePetByIdInput_clientMutationId_applyPlan
    },
    id: undefined,
    petPatch: {
      applyPlan: UpdatePetByIdInput_petPatch_applyPlan
    }
  },
  DeletePersonPayload: {
    __assertStep: ObjectStep,
    clientMutationId: DeletePersonPayload_clientMutationIdPlan,
    person: DeletePersonPayload_personPlan,
    deletedPersonId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.Person.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query: DeletePersonPayload_queryPlan,
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
            const spec = uniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return pgResource_peoplePgResource.find(spec);
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
      applyPlan: DeletePersonInput_clientMutationId_applyPlan
    },
    nodeId: undefined
  },
  DeletePersonByIdInput: {
    clientMutationId: {
      applyPlan: DeletePersonByIdInput_clientMutationId_applyPlan
    },
    id: undefined
  },
  DeletePetPayload: {
    __assertStep: ObjectStep,
    clientMutationId: DeletePetPayload_clientMutationIdPlan,
    pet: DeletePetPayload_petPlan,
    deletedPetId($object) {
      const $record = $object.getStepForKey("result");
      const specifier = nodeIdHandlerByTypeName.Pet.plan($record);
      return lambda(specifier, nodeIdCodecs_base64JSON_base64JSON.encode);
    },
    query: DeletePetPayload_queryPlan,
    petEdge: {
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
            return pgResource_petsPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("PetsOrderBy"));
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
    personByOwnerId($record) {
      return pgResource_peoplePgResource.get({
        id: $record.get("result").get("owner_id")
      });
    }
  },
  DeletePetInput: {
    clientMutationId: {
      applyPlan: DeletePetInput_clientMutationId_applyPlan
    },
    nodeId: undefined
  },
  DeletePetByIdInput: {
    clientMutationId: {
      applyPlan: DeletePetByIdInput_clientMutationId_applyPlan
    },
    id: undefined
  }
};
export const schema = makeGrafastSchema({
  typeDefs: typeDefs,
  plans: plans
});
