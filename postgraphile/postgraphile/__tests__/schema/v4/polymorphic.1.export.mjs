import { PgDeleteSingleStep, PgExecutor, PgResource, PgSelectSingleStep, PgSelectStep, PgUnionAllSingleStep, TYPES, assertPgClassSingleStep, enumCodec, makeRegistry, pgClassExpression, pgDeleteSingle, pgFromExpression, pgInsertSingle, pgSelectFromRecord, pgSelectSingleFromRecord, pgUnionAll, pgUpdateSingle, recordCodec, sqlFromArgDigests, sqlValueWithCodec } from "@dataplan/pg";
import { ConnectionStep, ConstantStep, EdgeStep, ObjectStep, __ValueStep, access, assertStep, bakedInput, bakedInputRuntime, connection, constant, context, createObjectAndApplyChildren, first, get as get2, inhibitOnNull, inspect, lambda, list, makeDecodeNodeId, makeGrafastSchema, object, operationPlan, rootValue, specFromNodeId, stepAMayDependOnStepB, trap } from "grafast";
import { GraphQLError, Kind } from "graphql";
import { sql } from "pg-sql2";
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
const awsApplicationFirstPartyVulnerabilitiesIdentifier = sql.identifier("polymorphic", "aws_application_first_party_vulnerabilities");
const awsApplicationFirstPartyVulnerabilitiesCodec = recordCodec({
  name: "awsApplicationFirstPartyVulnerabilities",
  identifier: awsApplicationFirstPartyVulnerabilitiesIdentifier,
  attributes: {
    __proto__: null,
    aws_application_id: {
      codec: TYPES.int,
      notNull: true
    },
    first_party_vulnerability_id: {
      codec: TYPES.int,
      notNull: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "aws_application_first_party_vulnerabilities"
    },
    tags: {
      __proto__: null,
      omit: true,
      behavior: ["-insert -select -node -connection -list -array -single -update -delete -queryField -mutationField -typeField -filter -filterBy -order -orderBy -query:resource:list -query:resource:connection -singularRelation:resource:list -singularRelation:resource:connection -manyRelation:resource:list -manyRelation:resource:connection -manyToMany"]
    }
  },
  executor: executor
});
const awsApplicationThirdPartyVulnerabilitiesIdentifier = sql.identifier("polymorphic", "aws_application_third_party_vulnerabilities");
const awsApplicationThirdPartyVulnerabilitiesCodec = recordCodec({
  name: "awsApplicationThirdPartyVulnerabilities",
  identifier: awsApplicationThirdPartyVulnerabilitiesIdentifier,
  attributes: {
    __proto__: null,
    aws_application_id: {
      codec: TYPES.int,
      notNull: true
    },
    third_party_vulnerability_id: {
      codec: TYPES.int,
      notNull: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "aws_application_third_party_vulnerabilities"
    },
    tags: {
      __proto__: null,
      omit: true,
      behavior: ["-insert -select -node -connection -list -array -single -update -delete -queryField -mutationField -typeField -filter -filterBy -order -orderBy -query:resource:list -query:resource:connection -singularRelation:resource:list -singularRelation:resource:connection -manyRelation:resource:list -manyRelation:resource:connection -manyToMany"]
    }
  },
  executor: executor
});
const gcpApplicationFirstPartyVulnerabilitiesIdentifier = sql.identifier("polymorphic", "gcp_application_first_party_vulnerabilities");
const gcpApplicationFirstPartyVulnerabilitiesCodec = recordCodec({
  name: "gcpApplicationFirstPartyVulnerabilities",
  identifier: gcpApplicationFirstPartyVulnerabilitiesIdentifier,
  attributes: {
    __proto__: null,
    gcp_application_id: {
      codec: TYPES.int,
      notNull: true
    },
    first_party_vulnerability_id: {
      codec: TYPES.int,
      notNull: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "gcp_application_first_party_vulnerabilities"
    },
    tags: {
      __proto__: null,
      omit: true,
      behavior: ["-insert -select -node -connection -list -array -single -update -delete -queryField -mutationField -typeField -filter -filterBy -order -orderBy -query:resource:list -query:resource:connection -singularRelation:resource:list -singularRelation:resource:connection -manyRelation:resource:list -manyRelation:resource:connection -manyToMany"]
    }
  },
  executor: executor
});
const gcpApplicationThirdPartyVulnerabilitiesIdentifier = sql.identifier("polymorphic", "gcp_application_third_party_vulnerabilities");
const gcpApplicationThirdPartyVulnerabilitiesCodec = recordCodec({
  name: "gcpApplicationThirdPartyVulnerabilities",
  identifier: gcpApplicationThirdPartyVulnerabilitiesIdentifier,
  attributes: {
    __proto__: null,
    gcp_application_id: {
      codec: TYPES.int,
      notNull: true
    },
    third_party_vulnerability_id: {
      codec: TYPES.int,
      notNull: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "gcp_application_third_party_vulnerabilities"
    },
    tags: {
      __proto__: null,
      omit: true,
      behavior: ["-insert -select -node -connection -list -array -single -update -delete -queryField -mutationField -typeField -filter -filterBy -order -orderBy -query:resource:list -query:resource:connection -singularRelation:resource:list -singularRelation:resource:connection -manyRelation:resource:list -manyRelation:resource:connection -manyToMany"]
    }
  },
  executor: executor
});
const organizationsIdentifier = sql.identifier("polymorphic", "organizations");
const organizationsCodec = recordCodec({
  name: "organizations",
  identifier: organizationsIdentifier,
  attributes: {
    __proto__: null,
    organization_id: {
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
      schemaName: "polymorphic",
      name: "organizations"
    },
    tags: {
      __proto__: null,
      unionMember: "PersonOrOrganization"
    }
  },
  executor: executor
});
const peopleIdentifier = sql.identifier("polymorphic", "people");
const peopleCodec = recordCodec({
  name: "people",
  identifier: peopleIdentifier,
  attributes: {
    __proto__: null,
    person_id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    username: {
      codec: TYPES.text,
      notNull: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "people"
    },
    tags: {
      __proto__: null,
      unionMember: "PersonOrOrganization",
      ref: "applications to:Application",
      refVia: ["applications via:aws_applications", "applications via:gcp_applications"]
    },
    refDefinitions: {
      __proto__: null,
      applications: {
        singular: false,
        graphqlType: "Application",
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
});
const prioritiesIdentifier = sql.identifier("polymorphic", "priorities");
const prioritiesCodec = recordCodec({
  name: "priorities",
  identifier: prioritiesIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    title: {
      codec: TYPES.text,
      notNull: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "priorities"
    },
    tags: {
      __proto__: null,
      omit: "create,update,delete,filter,order",
      behavior: ["-insert -update -delete -filter -filterBy -order -orderBy"]
    }
  },
  executor: executor
});
const relationalChecklistsIdentifier = sql.identifier("polymorphic", "relational_checklists");
const itemTypeCodec = enumCodec({
  name: "itemType",
  identifier: sql.identifier("polymorphic", "item_type"),
  values: ["TOPIC", "POST", "DIVIDER", "CHECKLIST", "CHECKLIST_ITEM"],
  description: undefined,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "item_type"
    }
  }
});
const relationalChecklistsCodec = recordCodec({
  name: "relationalChecklists",
  identifier: relationalChecklistsIdentifier,
  attributes: {
    __proto__: null,
    checklist_item_id: {
      codec: TYPES.int,
      notNull: true
    },
    title: {
      codec: TYPES.text,
      notNull: true
    },
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyChecklistItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    type: {
      codec: itemTypeCodec,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyChecklistItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    parent_id: {
      codec: TYPES.int,
      notNull: undefined,
      hasDefault: undefined,
      via: "relationalItemsByMyChecklistItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    root_topic_id: {
      codec: TYPES.int,
      notNull: undefined,
      hasDefault: undefined,
      via: "relationalItemsByMyChecklistItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    author_id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: undefined,
      via: "relationalItemsByMyChecklistItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    position: {
      codec: TYPES.bigint,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyChecklistItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    created_at: {
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyChecklistItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    updated_at: {
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyChecklistItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    is_explicitly_archived: {
      codec: TYPES.boolean,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyChecklistItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    archived_at: {
      codec: TYPES.timestamptz,
      notNull: undefined,
      hasDefault: undefined,
      via: "relationalItemsByMyChecklistItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "relational_checklists"
    },
    relationalInterfaceCodecName: "relationalItems"
  },
  executor: executor
});
const relationalItemRelationCompositePksIdentifier = sql.identifier("polymorphic", "relational_item_relation_composite_pks");
const relationalItemRelationCompositePksCodec = recordCodec({
  name: "relationalItemRelationCompositePks",
  identifier: relationalItemRelationCompositePksIdentifier,
  attributes: {
    __proto__: null,
    parent_id: {
      codec: TYPES.int,
      notNull: true
    },
    child_id: {
      codec: TYPES.int,
      notNull: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "relational_item_relation_composite_pks"
    }
  },
  executor: executor
});
const relationalTopicsIdentifier = sql.identifier("polymorphic", "relational_topics");
const relationalTopicsCodec = recordCodec({
  name: "relationalTopics",
  identifier: relationalTopicsIdentifier,
  attributes: {
    __proto__: null,
    topic_item_id: {
      codec: TYPES.int,
      notNull: true
    },
    title: {
      codec: TYPES.text,
      notNull: true
    },
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyTopicItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    type: {
      codec: itemTypeCodec,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyTopicItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    parent_id: {
      codec: TYPES.int,
      notNull: undefined,
      hasDefault: undefined,
      via: "relationalItemsByMyTopicItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    root_topic_id: {
      codec: TYPES.int,
      notNull: undefined,
      hasDefault: undefined,
      via: "relationalItemsByMyTopicItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    author_id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: undefined,
      via: "relationalItemsByMyTopicItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    position: {
      codec: TYPES.bigint,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyTopicItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    created_at: {
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyTopicItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    updated_at: {
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyTopicItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    is_explicitly_archived: {
      codec: TYPES.boolean,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyTopicItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    archived_at: {
      codec: TYPES.timestamptz,
      notNull: undefined,
      hasDefault: undefined,
      via: "relationalItemsByMyTopicItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "relational_topics"
    },
    relationalInterfaceCodecName: "relationalItems"
  },
  executor: executor
});
const singleTableItemRelationCompositePksIdentifier = sql.identifier("polymorphic", "single_table_item_relation_composite_pks");
const singleTableItemRelationCompositePksCodec = recordCodec({
  name: "singleTableItemRelationCompositePks",
  identifier: singleTableItemRelationCompositePksIdentifier,
  attributes: {
    __proto__: null,
    parent_id: {
      codec: TYPES.int,
      notNull: true
    },
    child_id: {
      codec: TYPES.int,
      notNull: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "single_table_item_relation_composite_pks"
    }
  },
  executor: executor
});
const relationalChecklistItemsIdentifier = sql.identifier("polymorphic", "relational_checklist_items");
const relationalChecklistItemsCodec = recordCodec({
  name: "relationalChecklistItems",
  identifier: relationalChecklistItemsIdentifier,
  attributes: {
    __proto__: null,
    checklist_item_item_id: {
      codec: TYPES.int,
      notNull: true
    },
    description: {
      codec: TYPES.text,
      notNull: true
    },
    note: {
      codec: TYPES.text
    },
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyChecklistItemItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    type: {
      codec: itemTypeCodec,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyChecklistItemItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    parent_id: {
      codec: TYPES.int,
      notNull: undefined,
      hasDefault: undefined,
      via: "relationalItemsByMyChecklistItemItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    root_topic_id: {
      codec: TYPES.int,
      notNull: undefined,
      hasDefault: undefined,
      via: "relationalItemsByMyChecklistItemItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    author_id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: undefined,
      via: "relationalItemsByMyChecklistItemItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    position: {
      codec: TYPES.bigint,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyChecklistItemItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    created_at: {
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyChecklistItemItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    updated_at: {
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyChecklistItemItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    is_explicitly_archived: {
      codec: TYPES.boolean,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyChecklistItemItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    archived_at: {
      codec: TYPES.timestamptz,
      notNull: undefined,
      hasDefault: undefined,
      via: "relationalItemsByMyChecklistItemItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "relational_checklist_items"
    },
    relationalInterfaceCodecName: "relationalItems"
  },
  executor: executor
});
const relationalDividersIdentifier = sql.identifier("polymorphic", "relational_dividers");
const relationalDividersCodec = recordCodec({
  name: "relationalDividers",
  identifier: relationalDividersIdentifier,
  attributes: {
    __proto__: null,
    divider_item_id: {
      codec: TYPES.int,
      notNull: true
    },
    title: {
      codec: TYPES.text
    },
    color: {
      codec: TYPES.text
    },
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyDividerItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    type: {
      codec: itemTypeCodec,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyDividerItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    parent_id: {
      codec: TYPES.int,
      notNull: undefined,
      hasDefault: undefined,
      via: "relationalItemsByMyDividerItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    root_topic_id: {
      codec: TYPES.int,
      notNull: undefined,
      hasDefault: undefined,
      via: "relationalItemsByMyDividerItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    author_id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: undefined,
      via: "relationalItemsByMyDividerItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    position: {
      codec: TYPES.bigint,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyDividerItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    created_at: {
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyDividerItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    updated_at: {
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyDividerItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    is_explicitly_archived: {
      codec: TYPES.boolean,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyDividerItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    archived_at: {
      codec: TYPES.timestamptz,
      notNull: undefined,
      hasDefault: undefined,
      via: "relationalItemsByMyDividerItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "relational_dividers"
    },
    relationalInterfaceCodecName: "relationalItems"
  },
  executor: executor
});
const relationalItemRelationsIdentifier = sql.identifier("polymorphic", "relational_item_relations");
const relationalItemRelationsCodec = recordCodec({
  name: "relationalItemRelations",
  identifier: relationalItemRelationsIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    parent_id: {
      codec: TYPES.int,
      notNull: true
    },
    child_id: {
      codec: TYPES.int,
      notNull: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "relational_item_relations"
    }
  },
  executor: executor
});
const singleTableItemRelationsIdentifier = sql.identifier("polymorphic", "single_table_item_relations");
const singleTableItemRelationsCodec = recordCodec({
  name: "singleTableItemRelations",
  identifier: singleTableItemRelationsIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    parent_id: {
      codec: TYPES.int,
      notNull: true
    },
    child_id: {
      codec: TYPES.int,
      notNull: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "single_table_item_relations"
    }
  },
  executor: executor
});
const logEntriesIdentifier = sql.identifier("polymorphic", "log_entries");
const logEntriesCodec = recordCodec({
  name: "logEntries",
  identifier: logEntriesIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    person_id: {
      codec: TYPES.int
    },
    organization_id: {
      codec: TYPES.int
    },
    text: {
      codec: TYPES.text,
      notNull: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "log_entries"
    },
    tags: {
      __proto__: null,
      ref: "author to:PersonOrOrganization singular",
      refVia: ["author via:people", "author via:organizations"]
    },
    refDefinitions: {
      __proto__: null,
      author: {
        singular: true,
        graphqlType: "PersonOrOrganization",
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
});
const relationalPostsIdentifier = sql.identifier("polymorphic", "relational_posts");
const relationalPostsCodec = recordCodec({
  name: "relationalPosts",
  identifier: relationalPostsIdentifier,
  attributes: {
    __proto__: null,
    post_item_id: {
      codec: TYPES.int,
      notNull: true
    },
    title: {
      codec: TYPES.text,
      notNull: true
    },
    description: {
      codec: TYPES.text,
      hasDefault: true
    },
    note: {
      codec: TYPES.text
    },
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyPostItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    type: {
      codec: itemTypeCodec,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyPostItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    parent_id: {
      codec: TYPES.int,
      notNull: undefined,
      hasDefault: undefined,
      via: "relationalItemsByMyPostItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    root_topic_id: {
      codec: TYPES.int,
      notNull: undefined,
      hasDefault: undefined,
      via: "relationalItemsByMyPostItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    author_id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: undefined,
      via: "relationalItemsByMyPostItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    position: {
      codec: TYPES.bigint,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyPostItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    created_at: {
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyPostItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    updated_at: {
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyPostItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    is_explicitly_archived: {
      codec: TYPES.boolean,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyPostItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    },
    archived_at: {
      codec: TYPES.timestamptz,
      notNull: undefined,
      hasDefault: undefined,
      via: "relationalItemsByMyPostItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {}
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "relational_posts"
    },
    relationalInterfaceCodecName: "relationalItems"
  },
  executor: executor
});
const firstPartyVulnerabilitiesIdentifier = sql.identifier("polymorphic", "first_party_vulnerabilities");
const firstPartyVulnerabilitiesCodec = recordCodec({
  name: "firstPartyVulnerabilities",
  identifier: firstPartyVulnerabilitiesIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true
    },
    name: {
      codec: TYPES.text,
      notNull: true
    },
    cvss_score: {
      codec: TYPES.float,
      notNull: true
    },
    team_name: {
      codec: TYPES.text
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "first_party_vulnerabilities"
    },
    tags: {
      __proto__: null,
      implements: "Vulnerability",
      ref: ["applications to:Application plural", "owners to:PersonOrOrganization plural"],
      refVia: ["applications via:aws_application_first_party_vulnerabilities;aws_applications", "applications via:gcp_application_first_party_vulnerabilities;gcp_applications", "owners via:aws_application_first_party_vulnerabilities;aws_applications;people", "owners via:aws_application_first_party_vulnerabilities;aws_applications;organizations", "owners via:gcp_application_first_party_vulnerabilities;gcp_applications;people", "owners via:gcp_application_first_party_vulnerabilities;gcp_applications;organizations"]
    },
    refDefinitions: {
      __proto__: null,
      applications: {
        singular: false,
        graphqlType: "Application",
        sourceGraphqlType: undefined,
        extensions: {
          via: undefined,
          tags: {
            behavior: undefined
          }
        }
      },
      owners: {
        singular: false,
        graphqlType: "PersonOrOrganization",
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
});
const thirdPartyVulnerabilitiesIdentifier = sql.identifier("polymorphic", "third_party_vulnerabilities");
const thirdPartyVulnerabilitiesCodec = recordCodec({
  name: "thirdPartyVulnerabilities",
  identifier: thirdPartyVulnerabilitiesIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true
    },
    name: {
      codec: TYPES.text,
      notNull: true
    },
    cvss_score: {
      codec: TYPES.float,
      notNull: true
    },
    vendor_name: {
      codec: TYPES.text
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "third_party_vulnerabilities"
    },
    tags: {
      __proto__: null,
      implements: "Vulnerability",
      ref: ["applications to:Application plural", "owners to:PersonOrOrganization plural"],
      refVia: ["applications via:aws_application_third_party_vulnerabilities;aws_applications", "applications via:gcp_application_third_party_vulnerabilities;gcp_applications", "owners via:aws_application_third_party_vulnerabilities;aws_applications;people", "owners via:aws_application_third_party_vulnerabilities;aws_applications;organizations", "owners via:gcp_application_third_party_vulnerabilities;gcp_applications;people", "owners via:gcp_application_third_party_vulnerabilities;gcp_applications;organizations"]
    },
    refDefinitions: {
      __proto__: null,
      applications: {
        singular: false,
        graphqlType: "Application",
        sourceGraphqlType: undefined,
        extensions: {
          via: undefined,
          tags: {
            behavior: undefined
          }
        }
      },
      owners: {
        singular: false,
        graphqlType: "PersonOrOrganization",
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
});
const ApplicationIdentifier = sql.identifier("polymorphic", "applications");
const spec_Application = {
  name: "Application",
  identifier: ApplicationIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      extensions: {
        tags: {
          notNull: true
        }
      }
    },
    name: {
      codec: TYPES.text,
      notNull: true,
      extensions: {
        tags: {
          notNull: true
        }
      }
    },
    last_deployed: {
      codec: TYPES.timestamptz
    }
  },
  extensions: {
    isTableLike: false,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "applications"
    },
    tags: {
      __proto__: null,
      interface: "mode:union",
      name: "Application",
      behavior: "node",
      ref: ["vulnerabilities to:Vulnerability plural", "owner to:PersonOrOrganization singular"]
    },
    refDefinitions: {
      __proto__: null,
      vulnerabilities: {
        singular: false,
        graphqlType: "Vulnerability",
        sourceGraphqlType: undefined,
        extensions: {
          via: undefined,
          tags: {
            behavior: undefined
          }
        }
      },
      owner: {
        singular: true,
        graphqlType: "PersonOrOrganization",
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
  executor: executor,
  polymorphism: {
    mode: "union"
  }
};
const ApplicationCodec = recordCodec(spec_Application);
const awsApplicationsIdentifier = sql.identifier("polymorphic", "aws_applications");
const awsApplicationsCodec = recordCodec({
  name: "awsApplications",
  identifier: awsApplicationsIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true
    },
    name: {
      codec: TYPES.text,
      notNull: true
    },
    last_deployed: {
      codec: TYPES.timestamptz
    },
    person_id: {
      codec: TYPES.int
    },
    organization_id: {
      codec: TYPES.int
    },
    aws_id: {
      codec: TYPES.text
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "aws_applications"
    },
    tags: {
      __proto__: null,
      implements: "Application",
      ref: ["vulnerabilities to:Vulnerability plural", "owner to:PersonOrOrganization singular"],
      refVia: ["vulnerabilities via:(id)->aws_application_first_party_vulnerabilities(aws_application_id);(first_party_vulnerability_id)->first_party_vulnerabilities(id)", "vulnerabilities via:(id)->aws_application_third_party_vulnerabilities(aws_application_id);(third_party_vulnerability_id)->third_party_vulnerabilities(id)", "owner via:people", "owner via:organizations"]
    },
    refDefinitions: {
      __proto__: null,
      vulnerabilities: {
        singular: false,
        graphqlType: "Vulnerability",
        sourceGraphqlType: undefined,
        extensions: {
          via: undefined,
          tags: {
            behavior: undefined
          }
        }
      },
      owner: {
        singular: true,
        graphqlType: "PersonOrOrganization",
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
});
const gcpApplicationsIdentifier = sql.identifier("polymorphic", "gcp_applications");
const gcpApplicationsCodec = recordCodec({
  name: "gcpApplications",
  identifier: gcpApplicationsIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true
    },
    name: {
      codec: TYPES.text,
      notNull: true
    },
    last_deployed: {
      codec: TYPES.timestamptz
    },
    person_id: {
      codec: TYPES.int
    },
    organization_id: {
      codec: TYPES.int
    },
    gcp_id: {
      codec: TYPES.text
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "gcp_applications"
    },
    tags: {
      __proto__: null,
      implements: "Application",
      ref: ["vulnerabilities to:Vulnerability plural", "owner to:PersonOrOrganization singular"],
      refVia: ["vulnerabilities via:(id)->gcp_application_first_party_vulnerabilities(gcp_application_id);(first_party_vulnerability_id)->first_party_vulnerabilities(id)", "vulnerabilities via:(id)->gcp_application_third_party_vulnerabilities(gcp_application_id);(third_party_vulnerability_id)->third_party_vulnerabilities(id)", "owner via:people", "owner via:organizations"]
    },
    refDefinitions: {
      __proto__: null,
      vulnerabilities: {
        singular: false,
        graphqlType: "Vulnerability",
        sourceGraphqlType: undefined,
        extensions: {
          via: undefined,
          tags: {
            behavior: undefined
          }
        }
      },
      owner: {
        singular: true,
        graphqlType: "PersonOrOrganization",
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
});
const singleTableItemsIdentifier = sql.identifier("polymorphic", "single_table_items");
const spec_singleTableItems = {
  name: "singleTableItems",
  identifier: singleTableItemsIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    type: {
      codec: itemTypeCodec,
      notNull: true,
      hasDefault: true
    },
    parent_id: {
      codec: TYPES.int
    },
    root_topic_id: {
      codec: TYPES.int
    },
    author_id: {
      codec: TYPES.int,
      notNull: true
    },
    position: {
      codec: TYPES.bigint,
      notNull: true,
      hasDefault: true
    },
    created_at: {
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true
    },
    updated_at: {
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true
    },
    is_explicitly_archived: {
      codec: TYPES.boolean,
      notNull: true,
      hasDefault: true
    },
    archived_at: {
      codec: TYPES.timestamptz
    },
    title: {
      codec: TYPES.text
    },
    description: {
      codec: TYPES.text
    },
    note: {
      codec: TYPES.text
    },
    color: {
      codec: TYPES.text
    },
    priority_id: {
      codec: TYPES.int
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "single_table_items"
    },
    tags: {
      __proto__: null,
      interface: "mode:single type:type",
      type: ["TOPIC name:SingleTableTopic attributes:title!", "POST name:SingleTablePost attributes:title>subject,description,note,priority_id", "DIVIDER name:SingleTableDivider attributes:title,color", "CHECKLIST name:SingleTableChecklist attributes:title", "CHECKLIST_ITEM name:SingleTableChecklistItem attributes:description,note,priority_id"],
      ref: ["rootTopic to:SingleTableTopic singular via:(root_topic_id)->polymorphic.single_table_items(id)", "rootChecklistTopic from:SingleTableChecklist to:SingleTableTopic singular via:(root_topic_id)->polymorphic.single_table_items(id)"]
    },
    refDefinitions: {
      __proto__: null,
      rootTopic: {
        singular: true,
        graphqlType: "SingleTableTopic",
        sourceGraphqlType: undefined,
        extensions: {
          via: "(root_topic_id)->polymorphic.single_table_items(id)",
          tags: {
            behavior: undefined
          }
        }
      },
      rootChecklistTopic: {
        singular: true,
        graphqlType: "SingleTableTopic",
        sourceGraphqlType: "SingleTableChecklist",
        extensions: {
          via: "(root_topic_id)->polymorphic.single_table_items(id)",
          tags: {
            behavior: undefined
          }
        }
      }
    }
  },
  executor: executor,
  polymorphism: {
    mode: "single",
    commonAttributes: ["id", "type", "parent_id", "root_topic_id", "author_id", "position", "created_at", "updated_at", "is_explicitly_archived", "archived_at"],
    typeAttributes: ["type"],
    types: {
      __proto__: null,
      TOPIC: {
        name: "SingleTableTopic",
        attributes: [{
          attribute: "title",
          isNotNull: true,
          rename: undefined
        }]
      },
      POST: {
        name: "SingleTablePost",
        attributes: [{
          attribute: "title",
          isNotNull: false,
          rename: "subject"
        }, {
          attribute: "description",
          isNotNull: false,
          rename: undefined
        }, {
          attribute: "note",
          isNotNull: false,
          rename: undefined
        }, {
          attribute: "priority_id",
          isNotNull: false,
          rename: undefined
        }]
      },
      DIVIDER: {
        name: "SingleTableDivider",
        attributes: [{
          attribute: "title",
          isNotNull: false,
          rename: undefined
        }, {
          attribute: "color",
          isNotNull: false,
          rename: undefined
        }]
      },
      CHECKLIST: {
        name: "SingleTableChecklist",
        attributes: [{
          attribute: "title",
          isNotNull: false,
          rename: undefined
        }]
      },
      CHECKLIST_ITEM: {
        name: "SingleTableChecklistItem",
        attributes: [{
          attribute: "description",
          isNotNull: false,
          rename: undefined
        }, {
          attribute: "note",
          isNotNull: false,
          rename: undefined
        }, {
          attribute: "priority_id",
          isNotNull: false,
          rename: undefined
        }]
      }
    }
  }
};
const singleTableItemsCodec = recordCodec(spec_singleTableItems);
const relationalItemsIdentifier = sql.identifier("polymorphic", "relational_items");
const spec_relationalItems = {
  name: "relationalItems",
  identifier: relationalItemsIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true
    },
    type: {
      codec: itemTypeCodec,
      notNull: true,
      hasDefault: true
    },
    parent_id: {
      codec: TYPES.int
    },
    root_topic_id: {
      codec: TYPES.int
    },
    author_id: {
      codec: TYPES.int,
      notNull: true
    },
    position: {
      codec: TYPES.bigint,
      notNull: true,
      hasDefault: true
    },
    created_at: {
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true
    },
    updated_at: {
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true
    },
    is_explicitly_archived: {
      codec: TYPES.boolean,
      notNull: true,
      hasDefault: true
    },
    archived_at: {
      codec: TYPES.timestamptz
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "relational_items"
    },
    tags: {
      __proto__: null,
      interface: "mode:relational",
      type: ["TOPIC references:relational_topics", "POST references:relational_posts", "DIVIDER references:relational_dividers", "CHECKLIST references:relational_checklists", "CHECKLIST_ITEM references:relational_checklist_items"]
    }
  },
  executor: executor,
  polymorphism: {
    mode: "relational",
    typeAttributes: ["type"],
    types: {
      __proto__: null,
      TOPIC: {
        name: "RelationalTopic",
        references: "relational_topics",
        relationName: "relationalTopicsByTheirTopicItemId"
      },
      POST: {
        name: "RelationalPost",
        references: "relational_posts",
        relationName: "relationalPostsByTheirPostItemId"
      },
      DIVIDER: {
        name: "RelationalDivider",
        references: "relational_dividers",
        relationName: "relationalDividersByTheirDividerItemId"
      },
      CHECKLIST: {
        name: "RelationalChecklist",
        references: "relational_checklists",
        relationName: "relationalChecklistsByTheirChecklistItemId"
      },
      CHECKLIST_ITEM: {
        name: "RelationalChecklistItem",
        references: "relational_checklist_items",
        relationName: "relationalChecklistItemsByTheirChecklistItemItemId"
      }
    }
  }
};
const relationalItemsCodec = recordCodec(spec_relationalItems);
const collectionsIdentifier = sql.identifier("polymorphic", "collections");
const spec_collections = {
  name: "collections",
  identifier: collectionsIdentifier,
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.text,
      notNull: true
    },
    name: {
      codec: TYPES.text,
      notNull: true
    },
    type: {
      codec: TYPES.text,
      notNull: true
    },
    episodes: {
      codec: TYPES.int
    },
    recommendations: {
      codec: TYPES.jsonb
    },
    col_001: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_002: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_003: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_004: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_005: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_006: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_007: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_008: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_009: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_010: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_011: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_012: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_013: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_014: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_015: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_016: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_017: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_018: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_019: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_020: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_021: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_022: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_023: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_024: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_025: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_026: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_027: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_028: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_029: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_030: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_031: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_032: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_033: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_034: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_035: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_036: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_037: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_038: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_039: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_040: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_041: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_042: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_043: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_044: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_045: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_046: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_047: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_048: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_049: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_050: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_051: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_052: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_053: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_054: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_055: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_056: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_057: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_058: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_059: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_060: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_061: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_062: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_063: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_064: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_065: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_066: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_067: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_068: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_069: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_070: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_071: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_072: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_073: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_074: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_075: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_076: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_077: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_078: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_079: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_080: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_081: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_082: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_083: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_084: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_085: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_086: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_087: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_088: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_089: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_090: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_091: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_092: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_093: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_094: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_095: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_096: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_097: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_098: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_099: {
      codec: TYPES.text,
      hasDefault: true
    },
    col_100: {
      codec: TYPES.text,
      hasDefault: true
    },
    created_at: {
      codec: TYPES.timestamptz,
      hasDefault: true
    }
  },
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "collections"
    },
    tags: {
      __proto__: null,
      interface: "mode:single type:type",
      type: ["movie name:MovieCollection", "series name:SeriesCollection"]
    }
  },
  executor: executor,
  polymorphism: {
    mode: "single",
    commonAttributes: ["id", "name", "type", "episodes", "recommendations", "col_001", "col_002", "col_003", "col_004", "col_005", "col_006", "col_007", "col_008", "col_009", "col_010", "col_011", "col_012", "col_013", "col_014", "col_015", "col_016", "col_017", "col_018", "col_019", "col_020", "col_021", "col_022", "col_023", "col_024", "col_025", "col_026", "col_027", "col_028", "col_029", "col_030", "col_031", "col_032", "col_033", "col_034", "col_035", "col_036", "col_037", "col_038", "col_039", "col_040", "col_041", "col_042", "col_043", "col_044", "col_045", "col_046", "col_047", "col_048", "col_049", "col_050", "col_051", "col_052", "col_053", "col_054", "col_055", "col_056", "col_057", "col_058", "col_059", "col_060", "col_061", "col_062", "col_063", "col_064", "col_065", "col_066", "col_067", "col_068", "col_069", "col_070", "col_071", "col_072", "col_073", "col_074", "col_075", "col_076", "col_077", "col_078", "col_079", "col_080", "col_081", "col_082", "col_083", "col_084", "col_085", "col_086", "col_087", "col_088", "col_089", "col_090", "col_091", "col_092", "col_093", "col_094", "col_095", "col_096", "col_097", "col_098", "col_099", "col_100", "created_at"],
    typeAttributes: ["type"],
    types: {
      __proto__: null,
      movie: {
        name: "MovieCollection",
        attributes: []
      },
      series: {
        name: "SeriesCollection",
        attributes: []
      }
    }
  }
};
const collectionsCodec = recordCodec(spec_collections);
const spec_Vulnerability = {
  name: "Vulnerability",
  identifier: sql.identifier("polymorphic", "vulnerabilities"),
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int,
      notNull: true,
      extensions: {
        tags: {
          notNull: true
        }
      }
    },
    name: {
      codec: TYPES.text,
      notNull: true,
      extensions: {
        tags: {
          notNull: true
        }
      }
    },
    cvss_score: {
      codec: TYPES.float,
      notNull: true,
      extensions: {
        tags: {
          notNull: true
        }
      }
    }
  },
  extensions: {
    isTableLike: false,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "vulnerabilities"
    },
    tags: {
      __proto__: null,
      interface: "mode:union",
      name: "Vulnerability",
      behavior: "node",
      ref: ["applications to:Application plural", "owners to:PersonOrOrganization plural"]
    },
    refDefinitions: {
      __proto__: null,
      applications: {
        singular: false,
        graphqlType: "Application",
        sourceGraphqlType: undefined,
        extensions: {
          via: undefined,
          tags: {
            behavior: undefined
          }
        }
      },
      owners: {
        singular: false,
        graphqlType: "PersonOrOrganization",
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
  executor: executor,
  polymorphism: {
    mode: "union"
  }
};
const spec_ZeroImplementation = {
  name: "ZeroImplementation",
  identifier: sql.identifier("polymorphic", "zero_implementation"),
  attributes: {
    __proto__: null,
    id: {
      codec: TYPES.int
    },
    name: {
      codec: TYPES.text
    }
  },
  extensions: {
    isTableLike: false,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "zero_implementation"
    },
    tags: {
      __proto__: null,
      interface: "mode:union",
      name: "ZeroImplementation",
      behavior: "node"
    }
  },
  executor: executor,
  polymorphism: {
    mode: "union"
  }
};
const aws_application_first_party_vulnerabilities_resourceOptionsConfig = {
  executor: executor,
  name: "aws_application_first_party_vulnerabilities",
  identifier: "main.polymorphic.aws_application_first_party_vulnerabilities",
  from: awsApplicationFirstPartyVulnerabilitiesIdentifier,
  codec: awsApplicationFirstPartyVulnerabilitiesCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "aws_application_first_party_vulnerabilities"
    },
    tags: {
      omit: true,
      behavior: ["-insert -select -node -connection -list -array -single -update -delete -queryField -mutationField -typeField -filter -filterBy -order -orderBy -query:resource:list -query:resource:connection -singularRelation:resource:list -singularRelation:resource:connection -manyRelation:resource:list -manyRelation:resource:connection -manyToMany"]
    }
  },
  uniques: [{
    attributes: ["aws_application_id", "first_party_vulnerability_id"],
    isPrimary: true
  }]
};
const aws_application_third_party_vulnerabilities_resourceOptionsConfig = {
  executor: executor,
  name: "aws_application_third_party_vulnerabilities",
  identifier: "main.polymorphic.aws_application_third_party_vulnerabilities",
  from: awsApplicationThirdPartyVulnerabilitiesIdentifier,
  codec: awsApplicationThirdPartyVulnerabilitiesCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "aws_application_third_party_vulnerabilities"
    },
    tags: {
      omit: true,
      behavior: ["-insert -select -node -connection -list -array -single -update -delete -queryField -mutationField -typeField -filter -filterBy -order -orderBy -query:resource:list -query:resource:connection -singularRelation:resource:list -singularRelation:resource:connection -manyRelation:resource:list -manyRelation:resource:connection -manyToMany"]
    }
  },
  uniques: [{
    attributes: ["aws_application_id", "third_party_vulnerability_id"],
    isPrimary: true
  }]
};
const gcp_application_first_party_vulnerabilities_resourceOptionsConfig = {
  executor: executor,
  name: "gcp_application_first_party_vulnerabilities",
  identifier: "main.polymorphic.gcp_application_first_party_vulnerabilities",
  from: gcpApplicationFirstPartyVulnerabilitiesIdentifier,
  codec: gcpApplicationFirstPartyVulnerabilitiesCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "gcp_application_first_party_vulnerabilities"
    },
    tags: {
      omit: true,
      behavior: ["-insert -select -node -connection -list -array -single -update -delete -queryField -mutationField -typeField -filter -filterBy -order -orderBy -query:resource:list -query:resource:connection -singularRelation:resource:list -singularRelation:resource:connection -manyRelation:resource:list -manyRelation:resource:connection -manyToMany"]
    }
  },
  uniques: [{
    attributes: ["gcp_application_id", "first_party_vulnerability_id"],
    isPrimary: true
  }]
};
const gcp_application_third_party_vulnerabilities_resourceOptionsConfig = {
  executor: executor,
  name: "gcp_application_third_party_vulnerabilities",
  identifier: "main.polymorphic.gcp_application_third_party_vulnerabilities",
  from: gcpApplicationThirdPartyVulnerabilitiesIdentifier,
  codec: gcpApplicationThirdPartyVulnerabilitiesCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "gcp_application_third_party_vulnerabilities"
    },
    tags: {
      omit: true,
      behavior: ["-insert -select -node -connection -list -array -single -update -delete -queryField -mutationField -typeField -filter -filterBy -order -orderBy -query:resource:list -query:resource:connection -singularRelation:resource:list -singularRelation:resource:connection -manyRelation:resource:list -manyRelation:resource:connection -manyToMany"]
    }
  },
  uniques: [{
    attributes: ["gcp_application_id", "third_party_vulnerability_id"],
    isPrimary: true
  }]
};
const organizationsUniques = [{
  attributes: ["organization_id"],
  isPrimary: true
}, {
  attributes: ["name"]
}];
const organizations_resourceOptionsConfig = {
  executor: executor,
  name: "organizations",
  identifier: "main.polymorphic.organizations",
  from: organizationsIdentifier,
  codec: organizationsCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "organizations"
    },
    tags: {
      unionMember: "PersonOrOrganization"
    }
  },
  uniques: organizationsUniques
};
const peopleUniques = [{
  attributes: ["person_id"],
  isPrimary: true
}, {
  attributes: ["username"]
}];
const people_resourceOptionsConfig = {
  executor: executor,
  name: "people",
  identifier: "main.polymorphic.people",
  from: peopleIdentifier,
  codec: peopleCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "people"
    },
    tags: {
      unionMember: "PersonOrOrganization",
      ref: "applications to:Application",
      refVia: ["applications via:aws_applications", "applications via:gcp_applications"]
    }
  },
  uniques: peopleUniques
};
const prioritiesUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const priorities_resourceOptionsConfig = {
  executor: executor,
  name: "priorities",
  identifier: "main.polymorphic.priorities",
  from: prioritiesIdentifier,
  codec: prioritiesCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "priorities"
    },
    tags: {
      omit: "create,update,delete,filter,order",
      behavior: ["-insert -update -delete -filter -filterBy -order -orderBy"]
    }
  },
  uniques: prioritiesUniques
};
const relational_checklistsUniques = [{
  attributes: ["checklist_item_id"],
  isPrimary: true
}];
const relational_checklists_resourceOptionsConfig = {
  executor: executor,
  name: "relational_checklists",
  identifier: "main.polymorphic.relational_checklists",
  from: relationalChecklistsIdentifier,
  codec: relationalChecklistsCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "relational_checklists"
    }
  },
  uniques: relational_checklistsUniques
};
const relational_item_relation_composite_pksUniques = [{
  attributes: ["parent_id", "child_id"],
  isPrimary: true
}];
const relational_item_relation_composite_pks_resourceOptionsConfig = {
  executor: executor,
  name: "relational_item_relation_composite_pks",
  identifier: "main.polymorphic.relational_item_relation_composite_pks",
  from: relationalItemRelationCompositePksIdentifier,
  codec: relationalItemRelationCompositePksCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "relational_item_relation_composite_pks"
    }
  },
  uniques: relational_item_relation_composite_pksUniques
};
const relational_topicsUniques = [{
  attributes: ["topic_item_id"],
  isPrimary: true
}];
const relational_topics_resourceOptionsConfig = {
  executor: executor,
  name: "relational_topics",
  identifier: "main.polymorphic.relational_topics",
  from: relationalTopicsIdentifier,
  codec: relationalTopicsCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "relational_topics"
    }
  },
  uniques: relational_topicsUniques
};
const single_table_item_relation_composite_pksUniques = [{
  attributes: ["parent_id", "child_id"],
  isPrimary: true
}];
const single_table_item_relation_composite_pks_resourceOptionsConfig = {
  executor: executor,
  name: "single_table_item_relation_composite_pks",
  identifier: "main.polymorphic.single_table_item_relation_composite_pks",
  from: singleTableItemRelationCompositePksIdentifier,
  codec: singleTableItemRelationCompositePksCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "single_table_item_relation_composite_pks"
    }
  },
  uniques: single_table_item_relation_composite_pksUniques
};
const relational_checklist_itemsUniques = [{
  attributes: ["checklist_item_item_id"],
  isPrimary: true
}];
const relational_checklist_items_resourceOptionsConfig = {
  executor: executor,
  name: "relational_checklist_items",
  identifier: "main.polymorphic.relational_checklist_items",
  from: relationalChecklistItemsIdentifier,
  codec: relationalChecklistItemsCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "relational_checklist_items"
    }
  },
  uniques: relational_checklist_itemsUniques
};
const relational_dividersUniques = [{
  attributes: ["divider_item_id"],
  isPrimary: true
}];
const relational_dividers_resourceOptionsConfig = {
  executor: executor,
  name: "relational_dividers",
  identifier: "main.polymorphic.relational_dividers",
  from: relationalDividersIdentifier,
  codec: relationalDividersCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "relational_dividers"
    }
  },
  uniques: relational_dividersUniques
};
const relational_item_relationsUniques = [{
  attributes: ["id"],
  isPrimary: true
}, {
  attributes: ["parent_id", "child_id"]
}];
const relational_item_relations_resourceOptionsConfig = {
  executor: executor,
  name: "relational_item_relations",
  identifier: "main.polymorphic.relational_item_relations",
  from: relationalItemRelationsIdentifier,
  codec: relationalItemRelationsCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "relational_item_relations"
    }
  },
  uniques: relational_item_relationsUniques
};
const single_table_item_relationsUniques = [{
  attributes: ["id"],
  isPrimary: true
}, {
  attributes: ["parent_id", "child_id"]
}];
const single_table_item_relations_resourceOptionsConfig = {
  executor: executor,
  name: "single_table_item_relations",
  identifier: "main.polymorphic.single_table_item_relations",
  from: singleTableItemRelationsIdentifier,
  codec: singleTableItemRelationsCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "single_table_item_relations"
    }
  },
  uniques: single_table_item_relationsUniques
};
const log_entriesUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const log_entries_resourceOptionsConfig = {
  executor: executor,
  name: "log_entries",
  identifier: "main.polymorphic.log_entries",
  from: logEntriesIdentifier,
  codec: logEntriesCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "log_entries"
    },
    tags: {
      ref: "author to:PersonOrOrganization singular",
      refVia: ["author via:people", "author via:organizations"]
    }
  },
  uniques: log_entriesUniques
};
const relational_postsUniques = [{
  attributes: ["post_item_id"],
  isPrimary: true
}];
const relational_posts_resourceOptionsConfig = {
  executor: executor,
  name: "relational_posts",
  identifier: "main.polymorphic.relational_posts",
  from: relationalPostsIdentifier,
  codec: relationalPostsCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "relational_posts"
    }
  },
  uniques: relational_postsUniques
};
const first_party_vulnerabilities_cvss_score_intFunctionIdentifer = sql.identifier("polymorphic", "first_party_vulnerabilities_cvss_score_int");
const third_party_vulnerabilities_cvss_score_intFunctionIdentifer = sql.identifier("polymorphic", "third_party_vulnerabilities_cvss_score_int");
const relational_topic_by_id_fnFunctionIdentifer = sql.identifier("polymorphic", "relational_topic_by_id_fn");
const first_party_vulnerabilitiesUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const first_party_vulnerabilities_resourceOptionsConfig = {
  executor: executor,
  name: "first_party_vulnerabilities",
  identifier: "main.polymorphic.first_party_vulnerabilities",
  from: firstPartyVulnerabilitiesIdentifier,
  codec: firstPartyVulnerabilitiesCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "first_party_vulnerabilities"
    },
    tags: {
      implements: "Vulnerability",
      ref: ["applications to:Application plural", "owners to:PersonOrOrganization plural"],
      refVia: ["applications via:aws_application_first_party_vulnerabilities;aws_applications", "applications via:gcp_application_first_party_vulnerabilities;gcp_applications", "owners via:aws_application_first_party_vulnerabilities;aws_applications;people", "owners via:aws_application_first_party_vulnerabilities;aws_applications;organizations", "owners via:gcp_application_first_party_vulnerabilities;gcp_applications;people", "owners via:gcp_application_first_party_vulnerabilities;gcp_applications;organizations"]
    }
  },
  uniques: first_party_vulnerabilitiesUniques
};
const third_party_vulnerabilitiesUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const third_party_vulnerabilities_resourceOptionsConfig = {
  executor: executor,
  name: "third_party_vulnerabilities",
  identifier: "main.polymorphic.third_party_vulnerabilities",
  from: thirdPartyVulnerabilitiesIdentifier,
  codec: thirdPartyVulnerabilitiesCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "third_party_vulnerabilities"
    },
    tags: {
      implements: "Vulnerability",
      ref: ["applications to:Application plural", "owners to:PersonOrOrganization plural"],
      refVia: ["applications via:aws_application_third_party_vulnerabilities;aws_applications", "applications via:gcp_application_third_party_vulnerabilities;gcp_applications", "owners via:aws_application_third_party_vulnerabilities;aws_applications;people", "owners via:aws_application_third_party_vulnerabilities;aws_applications;organizations", "owners via:gcp_application_third_party_vulnerabilities;gcp_applications;people", "owners via:gcp_application_third_party_vulnerabilities;gcp_applications;organizations"]
    }
  },
  uniques: third_party_vulnerabilitiesUniques
};
const favorite_applicationFunctionIdentifer = sql.identifier("polymorphic", "favorite_application");
const Application_resourceOptionsConfig = {
  executor: executor,
  name: "Application",
  identifier: "main.polymorphic.applications",
  from: ApplicationIdentifier,
  codec: ApplicationCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "applications"
    },
    isInsertable: false,
    isUpdatable: false,
    isDeletable: false,
    tags: {
      interface: "mode:union",
      name: "Application",
      behavior: "node",
      ref: ["vulnerabilities to:Vulnerability plural", "owner to:PersonOrOrganization singular"]
    }
  },
  isVirtual: true
};
const favorite_applicationsFunctionIdentifer = sql.identifier("polymorphic", "favorite_applications");
const aws_applicationsUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const aws_applications_resourceOptionsConfig = {
  executor: executor,
  name: "aws_applications",
  identifier: "main.polymorphic.aws_applications",
  from: awsApplicationsIdentifier,
  codec: awsApplicationsCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "aws_applications"
    },
    tags: {
      implements: "Application",
      ref: ["vulnerabilities to:Vulnerability plural", "owner to:PersonOrOrganization singular"],
      refVia: ["vulnerabilities via:(id)->aws_application_first_party_vulnerabilities(aws_application_id);(first_party_vulnerability_id)->first_party_vulnerabilities(id)", "vulnerabilities via:(id)->aws_application_third_party_vulnerabilities(aws_application_id);(third_party_vulnerability_id)->third_party_vulnerabilities(id)", "owner via:people", "owner via:organizations"]
    }
  },
  uniques: aws_applicationsUniques
};
const gcp_applicationsUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const gcp_applications_resourceOptionsConfig = {
  executor: executor,
  name: "gcp_applications",
  identifier: "main.polymorphic.gcp_applications",
  from: gcpApplicationsIdentifier,
  codec: gcpApplicationsCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "gcp_applications"
    },
    tags: {
      implements: "Application",
      ref: ["vulnerabilities to:Vulnerability plural", "owner to:PersonOrOrganization singular"],
      refVia: ["vulnerabilities via:(id)->gcp_application_first_party_vulnerabilities(gcp_application_id);(first_party_vulnerability_id)->first_party_vulnerabilities(id)", "vulnerabilities via:(id)->gcp_application_third_party_vulnerabilities(gcp_application_id);(third_party_vulnerability_id)->third_party_vulnerabilities(id)", "owner via:people", "owner via:organizations"]
    }
  },
  uniques: gcp_applicationsUniques
};
const single_table_items_meaning_of_lifeFunctionIdentifer = sql.identifier("polymorphic", "single_table_items_meaning_of_life");
const custom_delete_relational_itemFunctionIdentifer = sql.identifier("polymorphic", "custom_delete_relational_item");
const relational_items_meaning_of_lifeFunctionIdentifer = sql.identifier("polymorphic", "relational_items_meaning_of_life");
const single_table_itemsUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const single_table_items_resourceOptionsConfig = {
  executor: executor,
  name: "single_table_items",
  identifier: "main.polymorphic.single_table_items",
  from: singleTableItemsIdentifier,
  codec: singleTableItemsCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "single_table_items"
    },
    tags: {
      interface: "mode:single type:type",
      type: ["TOPIC name:SingleTableTopic attributes:title!", "POST name:SingleTablePost attributes:title>subject,description,note,priority_id", "DIVIDER name:SingleTableDivider attributes:title,color", "CHECKLIST name:SingleTableChecklist attributes:title", "CHECKLIST_ITEM name:SingleTableChecklistItem attributes:description,note,priority_id"],
      ref: ["rootTopic to:SingleTableTopic singular via:(root_topic_id)->polymorphic.single_table_items(id)", "rootChecklistTopic from:SingleTableChecklist to:SingleTableTopic singular via:(root_topic_id)->polymorphic.single_table_items(id)"]
    }
  },
  uniques: single_table_itemsUniques
};
const all_single_tablesFunctionIdentifer = sql.identifier("polymorphic", "all_single_tables");
const get_single_table_topic_by_idFunctionIdentifer = sql.identifier("polymorphic", "get_single_table_topic_by_id");
const relational_itemsUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const relational_items_resourceOptionsConfig = {
  executor: executor,
  name: "relational_items",
  identifier: "main.polymorphic.relational_items",
  from: relationalItemsIdentifier,
  codec: relationalItemsCodec,
  extensions: {
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "relational_items"
    },
    tags: {
      interface: "mode:relational",
      type: ["TOPIC references:relational_topics", "POST references:relational_posts", "DIVIDER references:relational_dividers", "CHECKLIST references:relational_checklists", "CHECKLIST_ITEM references:relational_checklist_items"]
    }
  },
  uniques: relational_itemsUniques
};
const all_relational_items_fnFunctionIdentifer = sql.identifier("polymorphic", "all_relational_items_fn");
const relational_item_by_id_fnFunctionIdentifer = sql.identifier("polymorphic", "relational_item_by_id_fn");
const relational_topics_parent_fnFunctionIdentifer = sql.identifier("polymorphic", "relational_topics_parent_fn");
const collectionsUniques = [{
  attributes: ["id"],
  isPrimary: true
}];
const registryConfig = {
  pgExecutors: {
    __proto__: null,
    main: executor
  },
  pgCodecs: {
    __proto__: null,
    awsApplicationFirstPartyVulnerabilities: awsApplicationFirstPartyVulnerabilitiesCodec,
    int4: TYPES.int,
    awsApplicationThirdPartyVulnerabilities: awsApplicationThirdPartyVulnerabilitiesCodec,
    gcpApplicationFirstPartyVulnerabilities: gcpApplicationFirstPartyVulnerabilitiesCodec,
    gcpApplicationThirdPartyVulnerabilities: gcpApplicationThirdPartyVulnerabilitiesCodec,
    organizations: organizationsCodec,
    text: TYPES.text,
    people: peopleCodec,
    priorities: prioritiesCodec,
    relationalChecklists: relationalChecklistsCodec,
    relationalItemRelationCompositePks: relationalItemRelationCompositePksCodec,
    relationalTopics: relationalTopicsCodec,
    singleTableItemRelationCompositePks: singleTableItemRelationCompositePksCodec,
    relationalChecklistItems: relationalChecklistItemsCodec,
    relationalDividers: relationalDividersCodec,
    relationalItemRelations: relationalItemRelationsCodec,
    singleTableItemRelations: singleTableItemRelationsCodec,
    logEntries: logEntriesCodec,
    relationalPosts: relationalPostsCodec,
    firstPartyVulnerabilities: firstPartyVulnerabilitiesCodec,
    float8: TYPES.float,
    thirdPartyVulnerabilities: thirdPartyVulnerabilitiesCodec,
    Application: ApplicationCodec,
    timestamptz: TYPES.timestamptz,
    awsApplications: awsApplicationsCodec,
    gcpApplications: gcpApplicationsCodec,
    bool: TYPES.boolean,
    singleTableItems: singleTableItemsCodec,
    itemType: itemTypeCodec,
    int8: TYPES.bigint,
    relationalItems: relationalItemsCodec,
    collections: collectionsCodec,
    jsonb: TYPES.jsonb,
    varchar: TYPES.varchar,
    bpchar: TYPES.bpchar,
    Vulnerability: recordCodec(spec_Vulnerability),
    ZeroImplementation: recordCodec(spec_ZeroImplementation),
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
    aws_application_first_party_vulnerabilities: aws_application_first_party_vulnerabilities_resourceOptionsConfig,
    aws_application_third_party_vulnerabilities: aws_application_third_party_vulnerabilities_resourceOptionsConfig,
    gcp_application_first_party_vulnerabilities: gcp_application_first_party_vulnerabilities_resourceOptionsConfig,
    gcp_application_third_party_vulnerabilities: gcp_application_third_party_vulnerabilities_resourceOptionsConfig,
    organizations: organizations_resourceOptionsConfig,
    people: people_resourceOptionsConfig,
    priorities: priorities_resourceOptionsConfig,
    relational_checklists: relational_checklists_resourceOptionsConfig,
    relational_item_relation_composite_pks: relational_item_relation_composite_pks_resourceOptionsConfig,
    relational_topics: relational_topics_resourceOptionsConfig,
    single_table_item_relation_composite_pks: single_table_item_relation_composite_pks_resourceOptionsConfig,
    relational_checklist_items: relational_checklist_items_resourceOptionsConfig,
    relational_dividers: relational_dividers_resourceOptionsConfig,
    relational_item_relations: relational_item_relations_resourceOptionsConfig,
    single_table_item_relations: single_table_item_relations_resourceOptionsConfig,
    log_entries: log_entries_resourceOptionsConfig,
    relational_posts: relational_posts_resourceOptionsConfig,
    first_party_vulnerabilities_cvss_score_int: {
      executor: executor,
      name: "first_party_vulnerabilities_cvss_score_int",
      identifier: "main.polymorphic.first_party_vulnerabilities_cvss_score_int(polymorphic.first_party_vulnerabilities)",
      from(...args) {
        return sql`${first_party_vulnerabilities_cvss_score_intFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "r",
        codec: firstPartyVulnerabilitiesCodec,
        required: true
      }],
      codec: TYPES.int,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "polymorphic",
          name: "first_party_vulnerabilities_cvss_score_int"
        }
      },
      isUnique: true
    },
    third_party_vulnerabilities_cvss_score_int: {
      executor: executor,
      name: "third_party_vulnerabilities_cvss_score_int",
      identifier: "main.polymorphic.third_party_vulnerabilities_cvss_score_int(polymorphic.third_party_vulnerabilities)",
      from(...args) {
        return sql`${third_party_vulnerabilities_cvss_score_intFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "r",
        codec: thirdPartyVulnerabilitiesCodec,
        required: true
      }],
      codec: TYPES.int,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "polymorphic",
          name: "third_party_vulnerabilities_cvss_score_int"
        }
      },
      isUnique: true
    },
    relational_topic_by_id_fn: PgResource.functionResourceOptions(relational_topics_resourceOptionsConfig, {
      name: "relational_topic_by_id_fn",
      identifier: "main.polymorphic.relational_topic_by_id_fn(int4)",
      from(...args) {
        return sql`${relational_topic_by_id_fnFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "id",
        codec: TYPES.int,
        required: true
      }],
      returnsSetof: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "polymorphic",
          name: "relational_topic_by_id_fn"
        }
      }
    }),
    first_party_vulnerabilities: first_party_vulnerabilities_resourceOptionsConfig,
    third_party_vulnerabilities: third_party_vulnerabilities_resourceOptionsConfig,
    favorite_application: PgResource.functionResourceOptions(Application_resourceOptionsConfig, {
      name: "favorite_application",
      identifier: "main.polymorphic.favorite_application()",
      from(...args) {
        return sql`${favorite_applicationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsSetof: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "polymorphic",
          name: "favorite_application"
        }
      }
    }),
    favorite_applications: PgResource.functionResourceOptions(Application_resourceOptionsConfig, {
      name: "favorite_applications",
      identifier: "main.polymorphic.favorite_applications()",
      from(...args) {
        return sql`${favorite_applicationsFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsSetof: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "polymorphic",
          name: "favorite_applications"
        }
      },
      hasImplicitOrder: true
    }),
    aws_applications: aws_applications_resourceOptionsConfig,
    gcp_applications: gcp_applications_resourceOptionsConfig,
    single_table_items_meaning_of_life: {
      executor: executor,
      name: "single_table_items_meaning_of_life",
      identifier: "main.polymorphic.single_table_items_meaning_of_life(polymorphic.single_table_items)",
      from(...args) {
        return sql`${single_table_items_meaning_of_lifeFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "sti",
        codec: singleTableItemsCodec,
        required: true
      }],
      codec: TYPES.int,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "polymorphic",
          name: "single_table_items_meaning_of_life"
        }
      },
      isUnique: true
    },
    custom_delete_relational_item: {
      executor: executor,
      name: "custom_delete_relational_item",
      identifier: "main.polymorphic.custom_delete_relational_item(polymorphic.relational_items)",
      from(...args) {
        return sql`${custom_delete_relational_itemFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "nodeId",
        codec: relationalItemsCodec,
        required: true,
        extensions: {
          variant: "nodeId"
        }
      }],
      codec: TYPES.boolean,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "polymorphic",
          name: "custom_delete_relational_item"
        },
        tags: {
          arg0variant: "nodeId"
        }
      },
      isUnique: true,
      isMutation: true
    },
    relational_items_meaning_of_life: {
      executor: executor,
      name: "relational_items_meaning_of_life",
      identifier: "main.polymorphic.relational_items_meaning_of_life(polymorphic.relational_items)",
      from(...args) {
        return sql`${relational_items_meaning_of_lifeFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "ri",
        codec: relationalItemsCodec,
        required: true
      }],
      codec: TYPES.int,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "polymorphic",
          name: "relational_items_meaning_of_life"
        }
      },
      isUnique: true
    },
    single_table_items: single_table_items_resourceOptionsConfig,
    all_single_tables: PgResource.functionResourceOptions(single_table_items_resourceOptionsConfig, {
      name: "all_single_tables",
      identifier: "main.polymorphic.all_single_tables()",
      from(...args) {
        return sql`${all_single_tablesFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsSetof: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "polymorphic",
          name: "all_single_tables"
        }
      },
      hasImplicitOrder: true
    }),
    get_single_table_topic_by_id: PgResource.functionResourceOptions(single_table_items_resourceOptionsConfig, {
      name: "get_single_table_topic_by_id",
      identifier: "main.polymorphic.get_single_table_topic_by_id(int4)",
      from(...args) {
        return sql`${get_single_table_topic_by_idFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "id",
        codec: TYPES.int,
        required: true
      }],
      returnsSetof: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "polymorphic",
          name: "get_single_table_topic_by_id"
        },
        tags: {
          returnType: "SingleTableTopic"
        }
      }
    }),
    relational_items: relational_items_resourceOptionsConfig,
    all_relational_items_fn: PgResource.functionResourceOptions(relational_items_resourceOptionsConfig, {
      name: "all_relational_items_fn",
      identifier: "main.polymorphic.all_relational_items_fn()",
      from(...args) {
        return sql`${all_relational_items_fnFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsSetof: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "polymorphic",
          name: "all_relational_items_fn"
        }
      },
      hasImplicitOrder: true
    }),
    relational_item_by_id_fn: PgResource.functionResourceOptions(relational_items_resourceOptionsConfig, {
      name: "relational_item_by_id_fn",
      identifier: "main.polymorphic.relational_item_by_id_fn(int4)",
      from(...args) {
        return sql`${relational_item_by_id_fnFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "id",
        codec: TYPES.int,
        required: true
      }],
      returnsSetof: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "polymorphic",
          name: "relational_item_by_id_fn"
        }
      }
    }),
    relational_topics_parent_fn: PgResource.functionResourceOptions(relational_items_resourceOptionsConfig, {
      name: "relational_topics_parent_fn",
      identifier: "main.polymorphic.relational_topics_parent_fn(polymorphic.relational_topics)",
      from(...args) {
        return sql`${relational_topics_parent_fnFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "t",
        codec: relationalTopicsCodec,
        required: true
      }],
      returnsSetof: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "polymorphic",
          name: "relational_topics_parent_fn"
        }
      }
    }),
    collections: {
      executor: executor,
      name: "collections",
      identifier: "main.polymorphic.collections",
      from: collectionsIdentifier,
      codec: collectionsCodec,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "polymorphic",
          name: "collections"
        },
        tags: {
          interface: "mode:single type:type",
          type: ["movie name:MovieCollection", "series name:SeriesCollection"]
        }
      },
      uniques: collectionsUniques
    }
  },
  pgRelations: {
    __proto__: null,
    awsApplicationFirstPartyVulnerabilities: {
      __proto__: null,
      firstPartyVulnerabilitiesByMyFirstPartyVulnerabilityId: {
        localCodec: awsApplicationFirstPartyVulnerabilitiesCodec,
        remoteResourceOptions: first_party_vulnerabilities_resourceOptionsConfig,
        localAttributes: ["first_party_vulnerability_id"],
        remoteAttributes: ["id"],
        isUnique: true
      },
      awsApplicationsByMyAwsApplicationId: {
        localCodec: awsApplicationFirstPartyVulnerabilitiesCodec,
        remoteResourceOptions: aws_applications_resourceOptionsConfig,
        localAttributes: ["aws_application_id"],
        remoteAttributes: ["id"],
        isUnique: true
      }
    },
    awsApplicationThirdPartyVulnerabilities: {
      __proto__: null,
      thirdPartyVulnerabilitiesByMyThirdPartyVulnerabilityId: {
        localCodec: awsApplicationThirdPartyVulnerabilitiesCodec,
        remoteResourceOptions: third_party_vulnerabilities_resourceOptionsConfig,
        localAttributes: ["third_party_vulnerability_id"],
        remoteAttributes: ["id"],
        isUnique: true
      },
      awsApplicationsByMyAwsApplicationId: {
        localCodec: awsApplicationThirdPartyVulnerabilitiesCodec,
        remoteResourceOptions: aws_applications_resourceOptionsConfig,
        localAttributes: ["aws_application_id"],
        remoteAttributes: ["id"],
        isUnique: true
      }
    },
    awsApplications: {
      __proto__: null,
      organizationsByMyOrganizationId: {
        localCodec: awsApplicationsCodec,
        remoteResourceOptions: organizations_resourceOptionsConfig,
        localAttributes: ["organization_id"],
        remoteAttributes: ["organization_id"],
        isUnique: true
      },
      peopleByMyPersonId: {
        localCodec: awsApplicationsCodec,
        remoteResourceOptions: people_resourceOptionsConfig,
        localAttributes: ["person_id"],
        remoteAttributes: ["person_id"],
        isUnique: true
      },
      awsApplicationFirstPartyVulnerabilitiesByTheirAwsApplicationId: {
        localCodec: awsApplicationsCodec,
        remoteResourceOptions: aws_application_first_party_vulnerabilities_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["aws_application_id"],
        isReferencee: true
      },
      awsApplicationThirdPartyVulnerabilitiesByTheirAwsApplicationId: {
        localCodec: awsApplicationsCodec,
        remoteResourceOptions: aws_application_third_party_vulnerabilities_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["aws_application_id"],
        isReferencee: true
      }
    },
    firstPartyVulnerabilities: {
      __proto__: null,
      awsApplicationFirstPartyVulnerabilitiesByTheirFirstPartyVulnerabilityId: {
        localCodec: firstPartyVulnerabilitiesCodec,
        remoteResourceOptions: aws_application_first_party_vulnerabilities_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["first_party_vulnerability_id"],
        isReferencee: true
      },
      gcpApplicationFirstPartyVulnerabilitiesByTheirFirstPartyVulnerabilityId: {
        localCodec: firstPartyVulnerabilitiesCodec,
        remoteResourceOptions: gcp_application_first_party_vulnerabilities_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["first_party_vulnerability_id"],
        isReferencee: true
      }
    },
    gcpApplicationFirstPartyVulnerabilities: {
      __proto__: null,
      firstPartyVulnerabilitiesByMyFirstPartyVulnerabilityId: {
        localCodec: gcpApplicationFirstPartyVulnerabilitiesCodec,
        remoteResourceOptions: first_party_vulnerabilities_resourceOptionsConfig,
        localAttributes: ["first_party_vulnerability_id"],
        remoteAttributes: ["id"],
        isUnique: true
      },
      gcpApplicationsByMyGcpApplicationId: {
        localCodec: gcpApplicationFirstPartyVulnerabilitiesCodec,
        remoteResourceOptions: gcp_applications_resourceOptionsConfig,
        localAttributes: ["gcp_application_id"],
        remoteAttributes: ["id"],
        isUnique: true
      }
    },
    gcpApplicationThirdPartyVulnerabilities: {
      __proto__: null,
      thirdPartyVulnerabilitiesByMyThirdPartyVulnerabilityId: {
        localCodec: gcpApplicationThirdPartyVulnerabilitiesCodec,
        remoteResourceOptions: third_party_vulnerabilities_resourceOptionsConfig,
        localAttributes: ["third_party_vulnerability_id"],
        remoteAttributes: ["id"],
        isUnique: true
      },
      gcpApplicationsByMyGcpApplicationId: {
        localCodec: gcpApplicationThirdPartyVulnerabilitiesCodec,
        remoteResourceOptions: gcp_applications_resourceOptionsConfig,
        localAttributes: ["gcp_application_id"],
        remoteAttributes: ["id"],
        isUnique: true
      }
    },
    gcpApplications: {
      __proto__: null,
      organizationsByMyOrganizationId: {
        localCodec: gcpApplicationsCodec,
        remoteResourceOptions: organizations_resourceOptionsConfig,
        localAttributes: ["organization_id"],
        remoteAttributes: ["organization_id"],
        isUnique: true
      },
      peopleByMyPersonId: {
        localCodec: gcpApplicationsCodec,
        remoteResourceOptions: people_resourceOptionsConfig,
        localAttributes: ["person_id"],
        remoteAttributes: ["person_id"],
        isUnique: true
      },
      gcpApplicationFirstPartyVulnerabilitiesByTheirGcpApplicationId: {
        localCodec: gcpApplicationsCodec,
        remoteResourceOptions: gcp_application_first_party_vulnerabilities_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["gcp_application_id"],
        isReferencee: true
      },
      gcpApplicationThirdPartyVulnerabilitiesByTheirGcpApplicationId: {
        localCodec: gcpApplicationsCodec,
        remoteResourceOptions: gcp_application_third_party_vulnerabilities_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["gcp_application_id"],
        isReferencee: true
      }
    },
    logEntries: {
      __proto__: null,
      organizationsByMyOrganizationId: {
        localCodec: logEntriesCodec,
        remoteResourceOptions: organizations_resourceOptionsConfig,
        localAttributes: ["organization_id"],
        remoteAttributes: ["organization_id"],
        isUnique: true
      },
      peopleByMyPersonId: {
        localCodec: logEntriesCodec,
        remoteResourceOptions: people_resourceOptionsConfig,
        localAttributes: ["person_id"],
        remoteAttributes: ["person_id"],
        isUnique: true
      }
    },
    organizations: {
      __proto__: null,
      logEntriesByTheirOrganizationId: {
        localCodec: organizationsCodec,
        remoteResourceOptions: log_entries_resourceOptionsConfig,
        localAttributes: ["organization_id"],
        remoteAttributes: ["organization_id"],
        isReferencee: true
      },
      awsApplicationsByTheirOrganizationId: {
        localCodec: organizationsCodec,
        remoteResourceOptions: aws_applications_resourceOptionsConfig,
        localAttributes: ["organization_id"],
        remoteAttributes: ["organization_id"],
        isReferencee: true
      },
      gcpApplicationsByTheirOrganizationId: {
        localCodec: organizationsCodec,
        remoteResourceOptions: gcp_applications_resourceOptionsConfig,
        localAttributes: ["organization_id"],
        remoteAttributes: ["organization_id"],
        isReferencee: true
      }
    },
    people: {
      __proto__: null,
      logEntriesByTheirPersonId: {
        localCodec: peopleCodec,
        remoteResourceOptions: log_entries_resourceOptionsConfig,
        localAttributes: ["person_id"],
        remoteAttributes: ["person_id"],
        isReferencee: true
      },
      singleTableItemsByTheirAuthorId: {
        localCodec: peopleCodec,
        remoteResourceOptions: single_table_items_resourceOptionsConfig,
        localAttributes: ["person_id"],
        remoteAttributes: ["author_id"],
        isReferencee: true
      },
      relationalItemsByTheirAuthorId: {
        localCodec: peopleCodec,
        remoteResourceOptions: relational_items_resourceOptionsConfig,
        localAttributes: ["person_id"],
        remoteAttributes: ["author_id"],
        isReferencee: true
      },
      awsApplicationsByTheirPersonId: {
        localCodec: peopleCodec,
        remoteResourceOptions: aws_applications_resourceOptionsConfig,
        localAttributes: ["person_id"],
        remoteAttributes: ["person_id"],
        isReferencee: true
      },
      gcpApplicationsByTheirPersonId: {
        localCodec: peopleCodec,
        remoteResourceOptions: gcp_applications_resourceOptionsConfig,
        localAttributes: ["person_id"],
        remoteAttributes: ["person_id"],
        isReferencee: true
      }
    },
    priorities: {
      __proto__: null,
      singleTableItemsByTheirPriorityId: {
        localCodec: prioritiesCodec,
        remoteResourceOptions: single_table_items_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["priority_id"],
        isReferencee: true
      }
    },
    relationalChecklistItems: {
      __proto__: null,
      relationalItemsByMyChecklistItemItemId: {
        localCodec: relationalChecklistItemsCodec,
        remoteResourceOptions: relational_items_resourceOptionsConfig,
        localAttributes: ["checklist_item_item_id"],
        remoteAttributes: ["id"],
        isUnique: true
      }
    },
    relationalChecklists: {
      __proto__: null,
      relationalItemsByMyChecklistItemId: {
        localCodec: relationalChecklistsCodec,
        remoteResourceOptions: relational_items_resourceOptionsConfig,
        localAttributes: ["checklist_item_id"],
        remoteAttributes: ["id"],
        isUnique: true
      }
    },
    relationalDividers: {
      __proto__: null,
      relationalItemsByMyDividerItemId: {
        localCodec: relationalDividersCodec,
        remoteResourceOptions: relational_items_resourceOptionsConfig,
        localAttributes: ["divider_item_id"],
        remoteAttributes: ["id"],
        isUnique: true
      }
    },
    relationalItemRelationCompositePks: {
      __proto__: null,
      relationalItemsByMyChildId: {
        localCodec: relationalItemRelationCompositePksCodec,
        remoteResourceOptions: relational_items_resourceOptionsConfig,
        localAttributes: ["child_id"],
        remoteAttributes: ["id"],
        isUnique: true
      },
      relationalItemsByMyParentId: {
        localCodec: relationalItemRelationCompositePksCodec,
        remoteResourceOptions: relational_items_resourceOptionsConfig,
        localAttributes: ["parent_id"],
        remoteAttributes: ["id"],
        isUnique: true
      }
    },
    relationalItemRelations: {
      __proto__: null,
      relationalItemsByMyChildId: {
        localCodec: relationalItemRelationsCodec,
        remoteResourceOptions: relational_items_resourceOptionsConfig,
        localAttributes: ["child_id"],
        remoteAttributes: ["id"],
        isUnique: true
      },
      relationalItemsByMyParentId: {
        localCodec: relationalItemRelationsCodec,
        remoteResourceOptions: relational_items_resourceOptionsConfig,
        localAttributes: ["parent_id"],
        remoteAttributes: ["id"],
        isUnique: true
      }
    },
    relationalItems: {
      __proto__: null,
      peopleByMyAuthorId: {
        localCodec: relationalItemsCodec,
        remoteResourceOptions: people_resourceOptionsConfig,
        localAttributes: ["author_id"],
        remoteAttributes: ["person_id"],
        isUnique: true
      },
      relationalItemsByMyParentId: {
        localCodec: relationalItemsCodec,
        remoteResourceOptions: relational_items_resourceOptionsConfig,
        localAttributes: ["parent_id"],
        remoteAttributes: ["id"],
        isUnique: true
      },
      relationalTopicsByMyRootTopicId: {
        localCodec: relationalItemsCodec,
        remoteResourceOptions: relational_topics_resourceOptionsConfig,
        localAttributes: ["root_topic_id"],
        remoteAttributes: ["topic_item_id"],
        isUnique: true
      },
      relationalItemsByTheirParentId: {
        localCodec: relationalItemsCodec,
        remoteResourceOptions: relational_items_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["parent_id"],
        isReferencee: true
      },
      relationalTopicsByTheirTopicItemId: {
        localCodec: relationalItemsCodec,
        remoteResourceOptions: relational_topics_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["topic_item_id"],
        isUnique: true,
        isReferencee: true
      },
      relationalPostsByTheirPostItemId: {
        localCodec: relationalItemsCodec,
        remoteResourceOptions: relational_posts_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["post_item_id"],
        isUnique: true,
        isReferencee: true
      },
      relationalDividersByTheirDividerItemId: {
        localCodec: relationalItemsCodec,
        remoteResourceOptions: relational_dividers_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["divider_item_id"],
        isUnique: true,
        isReferencee: true
      },
      relationalChecklistsByTheirChecklistItemId: {
        localCodec: relationalItemsCodec,
        remoteResourceOptions: relational_checklists_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["checklist_item_id"],
        isUnique: true,
        isReferencee: true
      },
      relationalChecklistItemsByTheirChecklistItemItemId: {
        localCodec: relationalItemsCodec,
        remoteResourceOptions: relational_checklist_items_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["checklist_item_item_id"],
        isUnique: true,
        isReferencee: true
      },
      relationalItemRelationsByTheirChildId: {
        localCodec: relationalItemsCodec,
        remoteResourceOptions: relational_item_relations_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["child_id"],
        isReferencee: true
      },
      relationalItemRelationsByTheirParentId: {
        localCodec: relationalItemsCodec,
        remoteResourceOptions: relational_item_relations_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["parent_id"],
        isReferencee: true
      },
      relationalItemRelationCompositePksByTheirChildId: {
        localCodec: relationalItemsCodec,
        remoteResourceOptions: relational_item_relation_composite_pks_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["child_id"],
        isReferencee: true
      },
      relationalItemRelationCompositePksByTheirParentId: {
        localCodec: relationalItemsCodec,
        remoteResourceOptions: relational_item_relation_composite_pks_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["parent_id"],
        isReferencee: true
      }
    },
    relationalPosts: {
      __proto__: null,
      relationalItemsByMyPostItemId: {
        localCodec: relationalPostsCodec,
        remoteResourceOptions: relational_items_resourceOptionsConfig,
        localAttributes: ["post_item_id"],
        remoteAttributes: ["id"],
        isUnique: true
      }
    },
    relationalTopics: {
      __proto__: null,
      relationalItemsByMyTopicItemId: {
        localCodec: relationalTopicsCodec,
        remoteResourceOptions: relational_items_resourceOptionsConfig,
        localAttributes: ["topic_item_id"],
        remoteAttributes: ["id"],
        isUnique: true
      },
      relationalItemsByTheirRootTopicId: {
        localCodec: relationalTopicsCodec,
        remoteResourceOptions: relational_items_resourceOptionsConfig,
        localAttributes: ["topic_item_id"],
        remoteAttributes: ["root_topic_id"],
        isReferencee: true
      }
    },
    singleTableItemRelationCompositePks: {
      __proto__: null,
      singleTableItemsByMyChildId: {
        localCodec: singleTableItemRelationCompositePksCodec,
        remoteResourceOptions: single_table_items_resourceOptionsConfig,
        localAttributes: ["child_id"],
        remoteAttributes: ["id"],
        isUnique: true
      },
      singleTableItemsByMyParentId: {
        localCodec: singleTableItemRelationCompositePksCodec,
        remoteResourceOptions: single_table_items_resourceOptionsConfig,
        localAttributes: ["parent_id"],
        remoteAttributes: ["id"],
        isUnique: true
      }
    },
    singleTableItemRelations: {
      __proto__: null,
      singleTableItemsByMyChildId: {
        localCodec: singleTableItemRelationsCodec,
        remoteResourceOptions: single_table_items_resourceOptionsConfig,
        localAttributes: ["child_id"],
        remoteAttributes: ["id"],
        isUnique: true
      },
      singleTableItemsByMyParentId: {
        localCodec: singleTableItemRelationsCodec,
        remoteResourceOptions: single_table_items_resourceOptionsConfig,
        localAttributes: ["parent_id"],
        remoteAttributes: ["id"],
        isUnique: true
      }
    },
    singleTableItems: {
      __proto__: null,
      peopleByMyAuthorId: {
        localCodec: singleTableItemsCodec,
        remoteResourceOptions: people_resourceOptionsConfig,
        localAttributes: ["author_id"],
        remoteAttributes: ["person_id"],
        isUnique: true
      },
      singleTableItemsByMyParentId: {
        localCodec: singleTableItemsCodec,
        remoteResourceOptions: single_table_items_resourceOptionsConfig,
        localAttributes: ["parent_id"],
        remoteAttributes: ["id"],
        isUnique: true
      },
      prioritiesByMyPriorityId: {
        localCodec: singleTableItemsCodec,
        remoteResourceOptions: priorities_resourceOptionsConfig,
        localAttributes: ["priority_id"],
        remoteAttributes: ["id"],
        isUnique: true,
        localCodecPolymorphicTypes: ["POST", "CHECKLIST_ITEM"]
      },
      singleTableItemsByMyRootTopicId: {
        localCodec: singleTableItemsCodec,
        remoteResourceOptions: single_table_items_resourceOptionsConfig,
        localAttributes: ["root_topic_id"],
        remoteAttributes: ["id"],
        isUnique: true,
        extensions: {
          tags: {
            behavior: ["-*"]
          }
        }
      },
      singleTableItemsByTheirParentId: {
        localCodec: singleTableItemsCodec,
        remoteResourceOptions: single_table_items_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["parent_id"],
        isReferencee: true
      },
      singleTableItemsByTheirRootTopicId: {
        localCodec: singleTableItemsCodec,
        remoteResourceOptions: single_table_items_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["root_topic_id"],
        isReferencee: true,
        extensions: {
          tags: {
            behavior: ["-*"]
          }
        }
      },
      singleTableItemRelationsByTheirChildId: {
        localCodec: singleTableItemsCodec,
        remoteResourceOptions: single_table_item_relations_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["child_id"],
        isReferencee: true
      },
      singleTableItemRelationsByTheirParentId: {
        localCodec: singleTableItemsCodec,
        remoteResourceOptions: single_table_item_relations_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["parent_id"],
        isReferencee: true
      },
      singleTableItemRelationCompositePksByTheirChildId: {
        localCodec: singleTableItemsCodec,
        remoteResourceOptions: single_table_item_relation_composite_pks_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["child_id"],
        isReferencee: true
      },
      singleTableItemRelationCompositePksByTheirParentId: {
        localCodec: singleTableItemsCodec,
        remoteResourceOptions: single_table_item_relation_composite_pks_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["parent_id"],
        isReferencee: true
      }
    },
    thirdPartyVulnerabilities: {
      __proto__: null,
      awsApplicationThirdPartyVulnerabilitiesByTheirThirdPartyVulnerabilityId: {
        localCodec: thirdPartyVulnerabilitiesCodec,
        remoteResourceOptions: aws_application_third_party_vulnerabilities_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["third_party_vulnerability_id"],
        isReferencee: true
      },
      gcpApplicationThirdPartyVulnerabilitiesByTheirThirdPartyVulnerabilityId: {
        localCodec: thirdPartyVulnerabilitiesCodec,
        remoteResourceOptions: gcp_application_third_party_vulnerabilities_resourceOptionsConfig,
        localAttributes: ["id"],
        remoteAttributes: ["third_party_vulnerability_id"],
        isReferencee: true
      }
    }
  }
};
const registry = makeRegistry(registryConfig);
const resource_single_table_itemsPgResource = registry.pgResources["single_table_items"];
const nodeIdHandler_SingleTableTopic = {
  typeName: "SingleTableTopic",
  codec: base64JSONNodeIdCodec,
  plan($record) {
    return list([constant("SingleTableTopic", false), $record.get("id")]);
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
    return resource_single_table_itemsPgResource.get(spec);
  },
  match(obj) {
    return obj[0] === "SingleTableTopic";
  }
};
const nodeIdCodecs = {
  __proto__: null,
  raw: {
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
const EMPTY_ARRAY = [];
const makeArgs_first_party_vulnerabilities_cvss_score_int = () => EMPTY_ARRAY;
const resource_single_table_items_meaning_of_lifePgResource = registry.pgResources["single_table_items_meaning_of_life"];
function hasRecord($row) {
  return "record" in $row && typeof $row.record === "function";
}
const pgFunctionArgumentsFromArgs = (() => {
  function pgFunctionArgumentsFromArgs($in, extraSelectArgs, inlining = false) {
    if (!hasRecord($in)) {
      throw new Error(`Invalid plan, exepcted 'PgSelectSingleStep', 'PgInsertSingleStep', 'PgUpdateSingleStep' or 'PgDeleteSingleStep', but found ${$in}`);
    }
    /**
     * An optimisation - if all our dependencies are
     * compatible with the expression's class plan then we
     * can inline ourselves into that, otherwise we must
     * issue the query separately.
     */
    const canUseExpressionDirectly = $in instanceof PgSelectSingleStep && $in.getClassStep().mode !== "mutation" && extraSelectArgs.every(a => stepAMayDependOnStepB($in.getClassStep(), a.step));
    const $row = canUseExpressionDirectly ? $in : pgSelectSingleFromRecord($in.resource, $in.record());
    const selectArgs = [{
      step: $row.record()
    }, ...extraSelectArgs];
    if (inlining) {
      // This is a scalar computed attribute, let's inline the expression
      const newSelectArgs = selectArgs.map((arg, i) => {
        if (i === 0) {
          const {
            step,
            ...rest
          } = arg;
          return {
            ...rest,
            placeholder: $row.getClassStep().alias
          };
        } else {
          return arg;
        }
      });
      return {
        $row,
        selectArgs: newSelectArgs
      };
    } else {
      return {
        $row,
        selectArgs: selectArgs
      };
    }
  }
  return pgFunctionArgumentsFromArgs;
})();
const scalarComputed = (resource, $in, args) => {
  const {
    $row,
    selectArgs
  } = pgFunctionArgumentsFromArgs($in, args, true);
  const from = pgFromExpression($row, resource.from, resource.parameters, selectArgs);
  return pgClassExpression($row, resource.codec, undefined)`${from}`;
};
const otherSource_peoplePgResource = registry.pgResources["people"];
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
const otherSource_single_table_item_relationsPgResource = registry.pgResources["single_table_item_relations"];
const otherSource_single_table_item_relation_composite_pksPgResource = registry.pgResources["single_table_item_relation_composite_pks"];
const SingleTableItem_typeNameFromType = ((interfaceTypeName, polymorphism) => {
  function typeNameFromType(typeVal) {
    if (typeof typeVal !== "string") return null;
    return polymorphism.types[typeVal]?.name ?? null;
  }
  typeNameFromType.displayName = `${interfaceTypeName}_typeNameFromType`;
  return typeNameFromType;
})("SingleTableItem", spec_singleTableItems.polymorphism);
const resource_collectionsPgResource = registry.pgResources["collections"];
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
const spec_resource_organizationsPgResource = registry.pgResources["organizations"];
const nodeIdHandler_Organization = makeTableNodeIdHandler({
  typeName: "Organization",
  identifier: "organizations",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: spec_resource_organizationsPgResource,
  pk: organizationsUniques[0].attributes
});
const nodeIdHandler_Person = makeTableNodeIdHandler({
  typeName: "Person",
  identifier: "people",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: otherSource_peoplePgResource,
  pk: peopleUniques[0].attributes
});
const spec_resource_prioritiesPgResource = registry.pgResources["priorities"];
const nodeIdHandler_Priority = makeTableNodeIdHandler({
  typeName: "Priority",
  identifier: "priorities",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: spec_resource_prioritiesPgResource,
  pk: prioritiesUniques[0].attributes
});
const spec_resource_relational_checklistsPgResource = registry.pgResources["relational_checklists"];
const nodeIdHandler_RelationalChecklist = makeTableNodeIdHandler({
  typeName: "RelationalChecklist",
  identifier: "relational_checklists",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: spec_resource_relational_checklistsPgResource,
  pk: relational_checklistsUniques[0].attributes
});
const spec_resource_relational_item_relation_composite_pksPgResource = registry.pgResources["relational_item_relation_composite_pks"];
const nodeIdHandler_RelationalItemRelationCompositePk = makeTableNodeIdHandler({
  typeName: "RelationalItemRelationCompositePk",
  identifier: "relational_item_relation_composite_pks",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: spec_resource_relational_item_relation_composite_pksPgResource,
  pk: relational_item_relation_composite_pksUniques[0].attributes
});
const spec_resource_relational_topicsPgResource = registry.pgResources["relational_topics"];
const nodeIdHandler_RelationalTopic = makeTableNodeIdHandler({
  typeName: "RelationalTopic",
  identifier: "relational_topics",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: spec_resource_relational_topicsPgResource,
  pk: relational_topicsUniques[0].attributes
});
const nodeIdHandler_SingleTableItemRelationCompositePk = makeTableNodeIdHandler({
  typeName: "SingleTableItemRelationCompositePk",
  identifier: "single_table_item_relation_composite_pks",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: otherSource_single_table_item_relation_composite_pksPgResource,
  pk: single_table_item_relation_composite_pksUniques[0].attributes
});
const spec_resource_relational_checklist_itemsPgResource = registry.pgResources["relational_checklist_items"];
const nodeIdHandler_RelationalChecklistItem = makeTableNodeIdHandler({
  typeName: "RelationalChecklistItem",
  identifier: "relational_checklist_items",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: spec_resource_relational_checklist_itemsPgResource,
  pk: relational_checklist_itemsUniques[0].attributes
});
const spec_resource_relational_dividersPgResource = registry.pgResources["relational_dividers"];
const nodeIdHandler_RelationalDivider = makeTableNodeIdHandler({
  typeName: "RelationalDivider",
  identifier: "relational_dividers",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: spec_resource_relational_dividersPgResource,
  pk: relational_dividersUniques[0].attributes
});
const spec_resource_relational_item_relationsPgResource = registry.pgResources["relational_item_relations"];
const nodeIdHandler_RelationalItemRelation = makeTableNodeIdHandler({
  typeName: "RelationalItemRelation",
  identifier: "relational_item_relations",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: spec_resource_relational_item_relationsPgResource,
  pk: relational_item_relationsUniques[0].attributes
});
const nodeIdHandler_SingleTableItemRelation = makeTableNodeIdHandler({
  typeName: "SingleTableItemRelation",
  identifier: "single_table_item_relations",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: otherSource_single_table_item_relationsPgResource,
  pk: single_table_item_relationsUniques[0].attributes
});
const spec_resource_log_entriesPgResource = registry.pgResources["log_entries"];
const nodeIdHandler_LogEntry = makeTableNodeIdHandler({
  typeName: "LogEntry",
  identifier: "log_entries",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: spec_resource_log_entriesPgResource,
  pk: log_entriesUniques[0].attributes
});
const spec_resource_relational_postsPgResource = registry.pgResources["relational_posts"];
const nodeIdHandler_RelationalPost = makeTableNodeIdHandler({
  typeName: "RelationalPost",
  identifier: "relational_posts",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: spec_resource_relational_postsPgResource,
  pk: relational_postsUniques[0].attributes
});
const spec_resource_first_party_vulnerabilitiesPgResource = registry.pgResources["first_party_vulnerabilities"];
const nodeIdHandler_FirstPartyVulnerability = makeTableNodeIdHandler({
  typeName: "FirstPartyVulnerability",
  identifier: "first_party_vulnerabilities",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: spec_resource_first_party_vulnerabilitiesPgResource,
  pk: first_party_vulnerabilitiesUniques[0].attributes
});
const spec_resource_third_party_vulnerabilitiesPgResource = registry.pgResources["third_party_vulnerabilities"];
const nodeIdHandler_ThirdPartyVulnerability = makeTableNodeIdHandler({
  typeName: "ThirdPartyVulnerability",
  identifier: "third_party_vulnerabilities",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: spec_resource_third_party_vulnerabilitiesPgResource,
  pk: third_party_vulnerabilitiesUniques[0].attributes
});
const spec_resource_aws_applicationsPgResource = registry.pgResources["aws_applications"];
const nodeIdHandler_AwsApplication = makeTableNodeIdHandler({
  typeName: "AwsApplication",
  identifier: "aws_applications",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: spec_resource_aws_applicationsPgResource,
  pk: aws_applicationsUniques[0].attributes
});
const spec_resource_gcp_applicationsPgResource = registry.pgResources["gcp_applications"];
const nodeIdHandler_GcpApplication = makeTableNodeIdHandler({
  typeName: "GcpApplication",
  identifier: "gcp_applications",
  nodeIdCodec: base64JSONNodeIdCodec,
  resource: spec_resource_gcp_applicationsPgResource,
  pk: gcp_applicationsUniques[0].attributes
});
const nodeIdHandlerByTypeName = {
  __proto__: null,
  Query: {
    typeName: "Query",
    codec: nodeIdCodecs.raw,
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
  },
  SingleTableTopic: nodeIdHandler_SingleTableTopic,
  SingleTablePost: {
    typeName: "SingleTablePost",
    codec: base64JSONNodeIdCodec,
    plan($record) {
      return list([constant("SingleTablePost", false), $record.get("id")]);
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
      return resource_single_table_itemsPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "SingleTablePost";
    }
  },
  SingleTableDivider: {
    typeName: "SingleTableDivider",
    codec: base64JSONNodeIdCodec,
    plan($record) {
      return list([constant("SingleTableDivider", false), $record.get("id")]);
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
      return resource_single_table_itemsPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "SingleTableDivider";
    }
  },
  SingleTableChecklist: {
    typeName: "SingleTableChecklist",
    codec: base64JSONNodeIdCodec,
    plan($record) {
      return list([constant("SingleTableChecklist", false), $record.get("id")]);
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
      return resource_single_table_itemsPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "SingleTableChecklist";
    }
  },
  SingleTableChecklistItem: {
    typeName: "SingleTableChecklistItem",
    codec: base64JSONNodeIdCodec,
    plan($record) {
      return list([constant("SingleTableChecklistItem", false), $record.get("id")]);
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
      return resource_single_table_itemsPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "SingleTableChecklistItem";
    }
  },
  MovieCollection: {
    typeName: "MovieCollection",
    codec: base64JSONNodeIdCodec,
    plan($record) {
      return list([constant("MovieCollection", false), $record.get("id")]);
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
      return resource_collectionsPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "MovieCollection";
    }
  },
  SeriesCollection: {
    typeName: "SeriesCollection",
    codec: base64JSONNodeIdCodec,
    plan($record) {
      return list([constant("SeriesCollection", false), $record.get("id")]);
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
      return resource_collectionsPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "SeriesCollection";
    }
  },
  Organization: nodeIdHandler_Organization,
  Person: nodeIdHandler_Person,
  Priority: nodeIdHandler_Priority,
  RelationalChecklist: nodeIdHandler_RelationalChecklist,
  RelationalItemRelationCompositePk: nodeIdHandler_RelationalItemRelationCompositePk,
  RelationalTopic: nodeIdHandler_RelationalTopic,
  SingleTableItemRelationCompositePk: nodeIdHandler_SingleTableItemRelationCompositePk,
  RelationalChecklistItem: nodeIdHandler_RelationalChecklistItem,
  RelationalDivider: nodeIdHandler_RelationalDivider,
  RelationalItemRelation: nodeIdHandler_RelationalItemRelation,
  SingleTableItemRelation: nodeIdHandler_SingleTableItemRelation,
  LogEntry: nodeIdHandler_LogEntry,
  RelationalPost: nodeIdHandler_RelationalPost,
  FirstPartyVulnerability: nodeIdHandler_FirstPartyVulnerability,
  ThirdPartyVulnerability: nodeIdHandler_ThirdPartyVulnerability,
  AwsApplication: nodeIdHandler_AwsApplication,
  GcpApplication: nodeIdHandler_GcpApplication
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
const otherSource_relational_itemsPgResource = registry.pgResources["relational_items"];
const members = [{
  resource: spec_resource_aws_applicationsPgResource,
  typeName: "AwsApplication",
  path: []
}, {
  resource: spec_resource_gcp_applicationsPgResource,
  typeName: "GcpApplication",
  path: []
}];
const paths = [{
  resource: spec_resource_aws_applicationsPgResource,
  hasReferencee: true,
  isUnique: false,
  layers: [{
    relationName: "awsApplicationsByTheirPersonId",
    localAttributes: registryConfig.pgRelations.people.awsApplicationsByTheirPersonId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.people.awsApplicationsByTheirPersonId.remoteAttributes,
    resource: spec_resource_aws_applicationsPgResource,
    isUnique: false
  }]
}, {
  resource: spec_resource_gcp_applicationsPgResource,
  hasReferencee: true,
  isUnique: false,
  layers: [{
    relationName: "gcpApplicationsByTheirPersonId",
    localAttributes: registryConfig.pgRelations.people.gcpApplicationsByTheirPersonId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.people.gcpApplicationsByTheirPersonId.remoteAttributes,
    resource: spec_resource_gcp_applicationsPgResource,
    isUnique: false
  }]
}];
const resourceByTypeName = {
  __proto__: null,
  AwsApplication: spec_resource_aws_applicationsPgResource,
  GcpApplication: spec_resource_gcp_applicationsPgResource
};
function limitToTypes(ltt) {
  if (ltt) {
    return qb => qb.limitToTypes(ltt);
  } else {
    return () => {};
  }
}
const applyConnectionLimitToTypes = ($parent, $connection, fieldArgs) => {
  const $union = $connection.getSubplan();
  const $ltt = fieldArgs.getRaw();
  if ($ltt instanceof ConstantStep && $ltt.data == null) {
    // No action
  } else {
    $union.apply(lambda($ltt, limitToTypes));
  }
};
const totalCountConnectionPlan = $connection => $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
const attributes = {};
const members2 = [{
  resource: otherSource_peoplePgResource,
  typeName: "Person",
  path: []
}, {
  resource: spec_resource_organizationsPgResource,
  typeName: "Organization",
  path: []
}];
const paths2 = [{
  resource: otherSource_peoplePgResource,
  hasReferencee: false,
  isUnique: true,
  layers: [{
    relationName: "peopleByMyPersonId",
    localAttributes: registryConfig.pgRelations.logEntries.peopleByMyPersonId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.logEntries.peopleByMyPersonId.remoteAttributes,
    resource: otherSource_peoplePgResource,
    isUnique: true
  }]
}, {
  resource: spec_resource_organizationsPgResource,
  hasReferencee: false,
  isUnique: true,
  layers: [{
    relationName: "organizationsByMyOrganizationId",
    localAttributes: registryConfig.pgRelations.logEntries.organizationsByMyOrganizationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.logEntries.organizationsByMyOrganizationId.remoteAttributes,
    resource: spec_resource_organizationsPgResource,
    isUnique: true
  }]
}];
const resourceByTypeName2 = {
  __proto__: null,
  Person: otherSource_peoplePgResource,
  Organization: spec_resource_organizationsPgResource
};
function applyAttributeCondition(attributeName, attributeCodec, $condition, val) {
  $condition.where({
    type: "attribute",
    attribute: attributeName,
    callback(expression) {
      return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, attributeCodec)}`;
    }
  });
}
const members_0_resource_aws_application_first_party_vulnerabilitiesPgResource = registry.pgResources["aws_application_first_party_vulnerabilities"];
const members_1_resource_aws_application_third_party_vulnerabilitiesPgResource = registry.pgResources["aws_application_third_party_vulnerabilities"];
const members3 = [{
  resource: members_0_resource_aws_application_first_party_vulnerabilitiesPgResource,
  typeName: "FirstPartyVulnerability",
  path: [{
    relationName: "firstPartyVulnerabilitiesByMyFirstPartyVulnerabilityId"
  }]
}, {
  resource: members_1_resource_aws_application_third_party_vulnerabilitiesPgResource,
  typeName: "ThirdPartyVulnerability",
  path: [{
    relationName: "thirdPartyVulnerabilitiesByMyThirdPartyVulnerabilityId"
  }]
}];
const paths3 = [{
  resource: spec_resource_first_party_vulnerabilitiesPgResource,
  hasReferencee: true,
  isUnique: false,
  layers: [{
    relationName: "awsApplicationFirstPartyVulnerabilitiesByTheirAwsApplicationId",
    localAttributes: registryConfig.pgRelations.awsApplications.awsApplicationFirstPartyVulnerabilitiesByTheirAwsApplicationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.awsApplications.awsApplicationFirstPartyVulnerabilitiesByTheirAwsApplicationId.remoteAttributes,
    resource: members_0_resource_aws_application_first_party_vulnerabilitiesPgResource,
    isUnique: false
  }, {
    relationName: "firstPartyVulnerabilitiesByMyFirstPartyVulnerabilityId",
    localAttributes: registryConfig.pgRelations.awsApplicationFirstPartyVulnerabilities.firstPartyVulnerabilitiesByMyFirstPartyVulnerabilityId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.awsApplicationFirstPartyVulnerabilities.firstPartyVulnerabilitiesByMyFirstPartyVulnerabilityId.remoteAttributes,
    resource: spec_resource_first_party_vulnerabilitiesPgResource,
    isUnique: true
  }]
}, {
  resource: spec_resource_third_party_vulnerabilitiesPgResource,
  hasReferencee: true,
  isUnique: false,
  layers: [{
    relationName: "awsApplicationThirdPartyVulnerabilitiesByTheirAwsApplicationId",
    localAttributes: registryConfig.pgRelations.awsApplications.awsApplicationThirdPartyVulnerabilitiesByTheirAwsApplicationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.awsApplications.awsApplicationThirdPartyVulnerabilitiesByTheirAwsApplicationId.remoteAttributes,
    resource: members_1_resource_aws_application_third_party_vulnerabilitiesPgResource,
    isUnique: false
  }, {
    relationName: "thirdPartyVulnerabilitiesByMyThirdPartyVulnerabilityId",
    localAttributes: registryConfig.pgRelations.awsApplicationThirdPartyVulnerabilities.thirdPartyVulnerabilitiesByMyThirdPartyVulnerabilityId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.awsApplicationThirdPartyVulnerabilities.thirdPartyVulnerabilitiesByMyThirdPartyVulnerabilityId.remoteAttributes,
    resource: spec_resource_third_party_vulnerabilitiesPgResource,
    isUnique: true
  }]
}];
const resourceByTypeName3 = {
  __proto__: null,
  FirstPartyVulnerability: spec_resource_first_party_vulnerabilitiesPgResource,
  ThirdPartyVulnerability: spec_resource_third_party_vulnerabilitiesPgResource
};
const attributes2 = {};
const members4 = [{
  resource: otherSource_peoplePgResource,
  typeName: "Person",
  path: []
}, {
  resource: spec_resource_organizationsPgResource,
  typeName: "Organization",
  path: []
}];
const paths4 = [{
  resource: otherSource_peoplePgResource,
  hasReferencee: false,
  isUnique: true,
  layers: [{
    relationName: "peopleByMyPersonId",
    localAttributes: registryConfig.pgRelations.awsApplications.peopleByMyPersonId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.awsApplications.peopleByMyPersonId.remoteAttributes,
    resource: otherSource_peoplePgResource,
    isUnique: true
  }]
}, {
  resource: spec_resource_organizationsPgResource,
  hasReferencee: false,
  isUnique: true,
  layers: [{
    relationName: "organizationsByMyOrganizationId",
    localAttributes: registryConfig.pgRelations.awsApplications.organizationsByMyOrganizationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.awsApplications.organizationsByMyOrganizationId.remoteAttributes,
    resource: spec_resource_organizationsPgResource,
    isUnique: true
  }]
}];
const resourceByTypeName4 = {
  __proto__: null,
  Person: otherSource_peoplePgResource,
  Organization: spec_resource_organizationsPgResource
};
const resourceByTypeName5 = {
  __proto__: null,
  AwsApplication: spec_resource_aws_applicationsPgResource,
  GcpApplication: spec_resource_gcp_applicationsPgResource
};
const resourceByTypeName6 = {
  __proto__: null,
  FirstPartyVulnerability: spec_resource_first_party_vulnerabilitiesPgResource,
  ThirdPartyVulnerability: spec_resource_third_party_vulnerabilitiesPgResource
};
const resourceByTypeName7 = {
  __proto__: null,
  Organization: spec_resource_organizationsPgResource,
  Person: otherSource_peoplePgResource
};
const members_0_resource_gcp_application_first_party_vulnerabilitiesPgResource = registry.pgResources["gcp_application_first_party_vulnerabilities"];
const members_1_resource_gcp_application_third_party_vulnerabilitiesPgResource = registry.pgResources["gcp_application_third_party_vulnerabilities"];
const members5 = [{
  resource: members_0_resource_gcp_application_first_party_vulnerabilitiesPgResource,
  typeName: "FirstPartyVulnerability",
  path: [{
    relationName: "firstPartyVulnerabilitiesByMyFirstPartyVulnerabilityId"
  }]
}, {
  resource: members_1_resource_gcp_application_third_party_vulnerabilitiesPgResource,
  typeName: "ThirdPartyVulnerability",
  path: [{
    relationName: "thirdPartyVulnerabilitiesByMyThirdPartyVulnerabilityId"
  }]
}];
const paths5 = [{
  resource: spec_resource_first_party_vulnerabilitiesPgResource,
  hasReferencee: true,
  isUnique: false,
  layers: [{
    relationName: "gcpApplicationFirstPartyVulnerabilitiesByTheirGcpApplicationId",
    localAttributes: registryConfig.pgRelations.gcpApplications.gcpApplicationFirstPartyVulnerabilitiesByTheirGcpApplicationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.gcpApplications.gcpApplicationFirstPartyVulnerabilitiesByTheirGcpApplicationId.remoteAttributes,
    resource: members_0_resource_gcp_application_first_party_vulnerabilitiesPgResource,
    isUnique: false
  }, {
    relationName: "firstPartyVulnerabilitiesByMyFirstPartyVulnerabilityId",
    localAttributes: registryConfig.pgRelations.gcpApplicationFirstPartyVulnerabilities.firstPartyVulnerabilitiesByMyFirstPartyVulnerabilityId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.gcpApplicationFirstPartyVulnerabilities.firstPartyVulnerabilitiesByMyFirstPartyVulnerabilityId.remoteAttributes,
    resource: spec_resource_first_party_vulnerabilitiesPgResource,
    isUnique: true
  }]
}, {
  resource: spec_resource_third_party_vulnerabilitiesPgResource,
  hasReferencee: true,
  isUnique: false,
  layers: [{
    relationName: "gcpApplicationThirdPartyVulnerabilitiesByTheirGcpApplicationId",
    localAttributes: registryConfig.pgRelations.gcpApplications.gcpApplicationThirdPartyVulnerabilitiesByTheirGcpApplicationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.gcpApplications.gcpApplicationThirdPartyVulnerabilitiesByTheirGcpApplicationId.remoteAttributes,
    resource: members_1_resource_gcp_application_third_party_vulnerabilitiesPgResource,
    isUnique: false
  }, {
    relationName: "thirdPartyVulnerabilitiesByMyThirdPartyVulnerabilityId",
    localAttributes: registryConfig.pgRelations.gcpApplicationThirdPartyVulnerabilities.thirdPartyVulnerabilitiesByMyThirdPartyVulnerabilityId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.gcpApplicationThirdPartyVulnerabilities.thirdPartyVulnerabilitiesByMyThirdPartyVulnerabilityId.remoteAttributes,
    resource: spec_resource_third_party_vulnerabilitiesPgResource,
    isUnique: true
  }]
}];
const resourceByTypeName8 = {
  __proto__: null,
  FirstPartyVulnerability: spec_resource_first_party_vulnerabilitiesPgResource,
  ThirdPartyVulnerability: spec_resource_third_party_vulnerabilitiesPgResource
};
const attributes3 = {};
const members6 = [{
  resource: otherSource_peoplePgResource,
  typeName: "Person",
  path: []
}, {
  resource: spec_resource_organizationsPgResource,
  typeName: "Organization",
  path: []
}];
const paths6 = [{
  resource: otherSource_peoplePgResource,
  hasReferencee: false,
  isUnique: true,
  layers: [{
    relationName: "peopleByMyPersonId",
    localAttributes: registryConfig.pgRelations.gcpApplications.peopleByMyPersonId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.gcpApplications.peopleByMyPersonId.remoteAttributes,
    resource: otherSource_peoplePgResource,
    isUnique: true
  }]
}, {
  resource: spec_resource_organizationsPgResource,
  hasReferencee: false,
  isUnique: true,
  layers: [{
    relationName: "organizationsByMyOrganizationId",
    localAttributes: registryConfig.pgRelations.gcpApplications.organizationsByMyOrganizationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.gcpApplications.organizationsByMyOrganizationId.remoteAttributes,
    resource: spec_resource_organizationsPgResource,
    isUnique: true
  }]
}];
const resourceByTypeName9 = {
  __proto__: null,
  Person: otherSource_peoplePgResource,
  Organization: spec_resource_organizationsPgResource
};
const relational_items_pkColumnsByRelatedCodecName = Object.fromEntries([["relationalTopics", relational_topicsUniques[0].attributes], ["relationalPosts", relational_postsUniques[0].attributes], ["relationalDividers", relational_dividersUniques[0].attributes], ["relationalChecklists", relational_checklistsUniques[0].attributes], ["relationalChecklistItems", relational_checklist_itemsUniques[0].attributes]]);
const RelationalItem_typeNameFromType = ((interfaceTypeName, polymorphism) => {
  function typeNameFromType(typeVal) {
    if (typeof typeVal !== "string") return null;
    return polymorphism.types[typeVal]?.name ?? null;
  }
  typeNameFromType.displayName = `${interfaceTypeName}_typeNameFromType`;
  return typeNameFromType;
})("RelationalItem", spec_relationalItems.polymorphism);
const resource_relational_topics_parent_fnPgResource = registry.pgResources["relational_topics_parent_fn"];
const Collection_typeNameFromType = ((interfaceTypeName, polymorphism) => {
  function typeNameFromType(typeVal) {
    if (typeof typeVal !== "string") return null;
    return polymorphism.types[typeVal]?.name ?? null;
  }
  typeNameFromType.displayName = `${interfaceTypeName}_typeNameFromType`;
  return typeNameFromType;
})("Collection", spec_collections.polymorphism);
const argDetailsSimple_relational_topic_by_id_fn = [{
  graphqlArgName: "id",
  pgCodec: TYPES.int,
  postgresArgName: "id",
  required: true
}];
function makeArg(path, args, details) {
  const {
    graphqlArgName,
    postgresArgName,
    pgCodec,
    fetcher
  } = details;
  const fullPath = [...path, graphqlArgName];
  const $raw = args.getRaw(fullPath);
  // TODO: this should maybe be operationPlan().withLatestSideEffectLayerPlan()
  const step = operationPlan().withRootLayerPlan(() => fetcher ? trap(fetcher($raw).record(), 4) : bakedInput(args.typeAt(fullPath), $raw));
  return {
    step,
    pgCodec,
    name: postgresArgName ?? undefined
  };
}
const makeArgs_relational_topic_by_id_fn = (args, path = []) => argDetailsSimple_relational_topic_by_id_fn.map(details => makeArg(path, args, details));
const resource_relational_topic_by_id_fnPgResource = registry.pgResources["relational_topic_by_id_fn"];
const resource_all_single_tablesPgResource = registry.pgResources["all_single_tables"];
const all_single_tables_getSelectPlanFromParentAndArgs = ($root, args, _info) => {
  const selectArgs = makeArgs_first_party_vulnerabilities_cvss_score_int(args);
  return resource_all_single_tablesPgResource.execute(selectArgs);
};
const argDetailsSimple_get_single_table_topic_by_id = [{
  graphqlArgName: "id",
  pgCodec: TYPES.int,
  postgresArgName: "id",
  required: true
}];
const makeArgs_get_single_table_topic_by_id = (args, path = []) => argDetailsSimple_get_single_table_topic_by_id.map(details => makeArg(path, args, details));
const resource_get_single_table_topic_by_idPgResource = registry.pgResources["get_single_table_topic_by_id"];
const resource_all_relational_items_fnPgResource = registry.pgResources["all_relational_items_fn"];
const all_relational_items_fn_getSelectPlanFromParentAndArgs = ($root, args, _info) => {
  const selectArgs = makeArgs_first_party_vulnerabilities_cvss_score_int(args);
  return resource_all_relational_items_fnPgResource.execute(selectArgs);
};
const argDetailsSimple_relational_item_by_id_fn = [{
  graphqlArgName: "id",
  pgCodec: TYPES.int,
  postgresArgName: "id",
  required: true
}];
const makeArgs_relational_item_by_id_fn = (args, path = []) => argDetailsSimple_relational_item_by_id_fn.map(details => makeArg(path, args, details));
const resource_relational_item_by_id_fnPgResource = registry.pgResources["relational_item_by_id_fn"];
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
const nodeFetcher_SingleTableTopic = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_SingleTableTopic));
  return nodeIdHandler_SingleTableTopic.get(nodeIdHandler_SingleTableTopic.getSpec($decoded));
};
const nodeFetcher_SingleTablePost = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandlerByTypeName.SingleTablePost));
  return nodeIdHandlerByTypeName.SingleTablePost.get(nodeIdHandlerByTypeName.SingleTablePost.getSpec($decoded));
};
const nodeFetcher_SingleTableDivider = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandlerByTypeName.SingleTableDivider));
  return nodeIdHandlerByTypeName.SingleTableDivider.get(nodeIdHandlerByTypeName.SingleTableDivider.getSpec($decoded));
};
const nodeFetcher_SingleTableChecklist = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandlerByTypeName.SingleTableChecklist));
  return nodeIdHandlerByTypeName.SingleTableChecklist.get(nodeIdHandlerByTypeName.SingleTableChecklist.getSpec($decoded));
};
const nodeFetcher_SingleTableChecklistItem = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandlerByTypeName.SingleTableChecklistItem));
  return nodeIdHandlerByTypeName.SingleTableChecklistItem.get(nodeIdHandlerByTypeName.SingleTableChecklistItem.getSpec($decoded));
};
const nodeFetcher_MovieCollection = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandlerByTypeName.MovieCollection));
  return nodeIdHandlerByTypeName.MovieCollection.get(nodeIdHandlerByTypeName.MovieCollection.getSpec($decoded));
};
const nodeFetcher_SeriesCollection = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandlerByTypeName.SeriesCollection));
  return nodeIdHandlerByTypeName.SeriesCollection.get(nodeIdHandlerByTypeName.SeriesCollection.getSpec($decoded));
};
const nodeFetcher_Organization = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Organization));
  return nodeIdHandler_Organization.get(nodeIdHandler_Organization.getSpec($decoded));
};
const nodeFetcher_Person = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Person));
  return nodeIdHandler_Person.get(nodeIdHandler_Person.getSpec($decoded));
};
const nodeFetcher_Priority = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_Priority));
  return nodeIdHandler_Priority.get(nodeIdHandler_Priority.getSpec($decoded));
};
const nodeFetcher_RelationalChecklist = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_RelationalChecklist));
  return nodeIdHandler_RelationalChecklist.get(nodeIdHandler_RelationalChecklist.getSpec($decoded));
};
const nodeFetcher_RelationalItemRelationCompositePk = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_RelationalItemRelationCompositePk));
  return nodeIdHandler_RelationalItemRelationCompositePk.get(nodeIdHandler_RelationalItemRelationCompositePk.getSpec($decoded));
};
const nodeFetcher_RelationalTopic = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_RelationalTopic));
  return nodeIdHandler_RelationalTopic.get(nodeIdHandler_RelationalTopic.getSpec($decoded));
};
const nodeFetcher_SingleTableItemRelationCompositePk = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_SingleTableItemRelationCompositePk));
  return nodeIdHandler_SingleTableItemRelationCompositePk.get(nodeIdHandler_SingleTableItemRelationCompositePk.getSpec($decoded));
};
const nodeFetcher_RelationalChecklistItem = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_RelationalChecklistItem));
  return nodeIdHandler_RelationalChecklistItem.get(nodeIdHandler_RelationalChecklistItem.getSpec($decoded));
};
const nodeFetcher_RelationalDivider = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_RelationalDivider));
  return nodeIdHandler_RelationalDivider.get(nodeIdHandler_RelationalDivider.getSpec($decoded));
};
const nodeFetcher_RelationalItemRelation = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_RelationalItemRelation));
  return nodeIdHandler_RelationalItemRelation.get(nodeIdHandler_RelationalItemRelation.getSpec($decoded));
};
const nodeFetcher_SingleTableItemRelation = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_SingleTableItemRelation));
  return nodeIdHandler_SingleTableItemRelation.get(nodeIdHandler_SingleTableItemRelation.getSpec($decoded));
};
const nodeFetcher_LogEntry = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_LogEntry));
  return nodeIdHandler_LogEntry.get(nodeIdHandler_LogEntry.getSpec($decoded));
};
const nodeFetcher_RelationalPost = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_RelationalPost));
  return nodeIdHandler_RelationalPost.get(nodeIdHandler_RelationalPost.getSpec($decoded));
};
const nodeFetcher_FirstPartyVulnerability = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_FirstPartyVulnerability));
  return nodeIdHandler_FirstPartyVulnerability.get(nodeIdHandler_FirstPartyVulnerability.getSpec($decoded));
};
const nodeFetcher_ThirdPartyVulnerability = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_ThirdPartyVulnerability));
  return nodeIdHandler_ThirdPartyVulnerability.get(nodeIdHandler_ThirdPartyVulnerability.getSpec($decoded));
};
const nodeFetcher_AwsApplication = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_AwsApplication));
  return nodeIdHandler_AwsApplication.get(nodeIdHandler_AwsApplication.getSpec($decoded));
};
const nodeFetcher_GcpApplication = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandler_GcpApplication));
  return nodeIdHandler_GcpApplication.get(nodeIdHandler_GcpApplication.getSpec($decoded));
};
const members7 = [{
  resource: spec_resource_first_party_vulnerabilitiesPgResource,
  typeName: "FirstPartyVulnerability"
}, {
  resource: spec_resource_third_party_vulnerabilitiesPgResource,
  typeName: "ThirdPartyVulnerability"
}];
const resourceByTypeName10 = {
  __proto__: null,
  FirstPartyVulnerability: spec_resource_first_party_vulnerabilitiesPgResource,
  ThirdPartyVulnerability: spec_resource_third_party_vulnerabilitiesPgResource
};
const members8 = [{
  resource: spec_resource_aws_applicationsPgResource,
  typeName: "AwsApplication"
}, {
  resource: spec_resource_gcp_applicationsPgResource,
  typeName: "GcpApplication"
}];
const resourceByTypeName11 = {
  __proto__: null,
  AwsApplication: spec_resource_aws_applicationsPgResource,
  GcpApplication: spec_resource_gcp_applicationsPgResource
};
const members9 = [];
const resourceByTypeName12 = {
  __proto__: null
};
const resource_first_party_vulnerabilities_cvss_score_intPgResource = registry.pgResources["first_party_vulnerabilities_cvss_score_int"];
const members10 = [{
  resource: members_0_resource_aws_application_first_party_vulnerabilitiesPgResource,
  typeName: "AwsApplication",
  path: [{
    relationName: "awsApplicationsByMyAwsApplicationId"
  }]
}, {
  resource: members_0_resource_gcp_application_first_party_vulnerabilitiesPgResource,
  typeName: "GcpApplication",
  path: [{
    relationName: "gcpApplicationsByMyGcpApplicationId"
  }]
}];
const paths7 = [{
  resource: spec_resource_aws_applicationsPgResource,
  hasReferencee: true,
  isUnique: false,
  layers: [{
    relationName: "awsApplicationFirstPartyVulnerabilitiesByTheirFirstPartyVulnerabilityId",
    localAttributes: registryConfig.pgRelations.firstPartyVulnerabilities.awsApplicationFirstPartyVulnerabilitiesByTheirFirstPartyVulnerabilityId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.firstPartyVulnerabilities.awsApplicationFirstPartyVulnerabilitiesByTheirFirstPartyVulnerabilityId.remoteAttributes,
    resource: members_0_resource_aws_application_first_party_vulnerabilitiesPgResource,
    isUnique: false
  }, {
    relationName: "awsApplicationsByMyAwsApplicationId",
    localAttributes: registryConfig.pgRelations.awsApplicationFirstPartyVulnerabilities.awsApplicationsByMyAwsApplicationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.awsApplicationFirstPartyVulnerabilities.awsApplicationsByMyAwsApplicationId.remoteAttributes,
    resource: spec_resource_aws_applicationsPgResource,
    isUnique: true
  }]
}, {
  resource: spec_resource_gcp_applicationsPgResource,
  hasReferencee: true,
  isUnique: false,
  layers: [{
    relationName: "gcpApplicationFirstPartyVulnerabilitiesByTheirFirstPartyVulnerabilityId",
    localAttributes: registryConfig.pgRelations.firstPartyVulnerabilities.gcpApplicationFirstPartyVulnerabilitiesByTheirFirstPartyVulnerabilityId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.firstPartyVulnerabilities.gcpApplicationFirstPartyVulnerabilitiesByTheirFirstPartyVulnerabilityId.remoteAttributes,
    resource: members_0_resource_gcp_application_first_party_vulnerabilitiesPgResource,
    isUnique: false
  }, {
    relationName: "gcpApplicationsByMyGcpApplicationId",
    localAttributes: registryConfig.pgRelations.gcpApplicationFirstPartyVulnerabilities.gcpApplicationsByMyGcpApplicationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.gcpApplicationFirstPartyVulnerabilities.gcpApplicationsByMyGcpApplicationId.remoteAttributes,
    resource: spec_resource_gcp_applicationsPgResource,
    isUnique: true
  }]
}];
const resourceByTypeName13 = {
  __proto__: null,
  AwsApplication: spec_resource_aws_applicationsPgResource,
  GcpApplication: spec_resource_gcp_applicationsPgResource
};
const attributes4 = {};
const members11 = [{
  resource: members_0_resource_aws_application_first_party_vulnerabilitiesPgResource,
  typeName: "Person",
  path: [{
    relationName: "awsApplicationsByMyAwsApplicationId"
  }, {
    relationName: "peopleByMyPersonId"
  }]
}, {
  resource: members_0_resource_aws_application_first_party_vulnerabilitiesPgResource,
  typeName: "Organization",
  path: [{
    relationName: "awsApplicationsByMyAwsApplicationId"
  }, {
    relationName: "organizationsByMyOrganizationId"
  }]
}, {
  resource: members_0_resource_gcp_application_first_party_vulnerabilitiesPgResource,
  typeName: "Person",
  path: [{
    relationName: "gcpApplicationsByMyGcpApplicationId"
  }, {
    relationName: "peopleByMyPersonId"
  }]
}, {
  resource: members_0_resource_gcp_application_first_party_vulnerabilitiesPgResource,
  typeName: "Organization",
  path: [{
    relationName: "gcpApplicationsByMyGcpApplicationId"
  }, {
    relationName: "organizationsByMyOrganizationId"
  }]
}];
const paths8 = [{
  resource: otherSource_peoplePgResource,
  hasReferencee: true,
  isUnique: false,
  layers: [{
    relationName: "awsApplicationFirstPartyVulnerabilitiesByTheirFirstPartyVulnerabilityId",
    localAttributes: registryConfig.pgRelations.firstPartyVulnerabilities.awsApplicationFirstPartyVulnerabilitiesByTheirFirstPartyVulnerabilityId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.firstPartyVulnerabilities.awsApplicationFirstPartyVulnerabilitiesByTheirFirstPartyVulnerabilityId.remoteAttributes,
    resource: members_0_resource_aws_application_first_party_vulnerabilitiesPgResource,
    isUnique: false
  }, {
    relationName: "awsApplicationsByMyAwsApplicationId",
    localAttributes: registryConfig.pgRelations.awsApplicationFirstPartyVulnerabilities.awsApplicationsByMyAwsApplicationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.awsApplicationFirstPartyVulnerabilities.awsApplicationsByMyAwsApplicationId.remoteAttributes,
    resource: spec_resource_aws_applicationsPgResource,
    isUnique: true
  }, {
    relationName: "peopleByMyPersonId",
    localAttributes: registryConfig.pgRelations.awsApplications.peopleByMyPersonId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.awsApplications.peopleByMyPersonId.remoteAttributes,
    resource: otherSource_peoplePgResource,
    isUnique: true
  }]
}, {
  resource: spec_resource_organizationsPgResource,
  hasReferencee: true,
  isUnique: false,
  layers: [{
    relationName: "awsApplicationFirstPartyVulnerabilitiesByTheirFirstPartyVulnerabilityId",
    localAttributes: registryConfig.pgRelations.firstPartyVulnerabilities.awsApplicationFirstPartyVulnerabilitiesByTheirFirstPartyVulnerabilityId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.firstPartyVulnerabilities.awsApplicationFirstPartyVulnerabilitiesByTheirFirstPartyVulnerabilityId.remoteAttributes,
    resource: members_0_resource_aws_application_first_party_vulnerabilitiesPgResource,
    isUnique: false
  }, {
    relationName: "awsApplicationsByMyAwsApplicationId",
    localAttributes: registryConfig.pgRelations.awsApplicationFirstPartyVulnerabilities.awsApplicationsByMyAwsApplicationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.awsApplicationFirstPartyVulnerabilities.awsApplicationsByMyAwsApplicationId.remoteAttributes,
    resource: spec_resource_aws_applicationsPgResource,
    isUnique: true
  }, {
    relationName: "organizationsByMyOrganizationId",
    localAttributes: registryConfig.pgRelations.awsApplications.organizationsByMyOrganizationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.awsApplications.organizationsByMyOrganizationId.remoteAttributes,
    resource: spec_resource_organizationsPgResource,
    isUnique: true
  }]
}, {
  resource: otherSource_peoplePgResource,
  hasReferencee: true,
  isUnique: false,
  layers: [{
    relationName: "gcpApplicationFirstPartyVulnerabilitiesByTheirFirstPartyVulnerabilityId",
    localAttributes: registryConfig.pgRelations.firstPartyVulnerabilities.gcpApplicationFirstPartyVulnerabilitiesByTheirFirstPartyVulnerabilityId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.firstPartyVulnerabilities.gcpApplicationFirstPartyVulnerabilitiesByTheirFirstPartyVulnerabilityId.remoteAttributes,
    resource: members_0_resource_gcp_application_first_party_vulnerabilitiesPgResource,
    isUnique: false
  }, {
    relationName: "gcpApplicationsByMyGcpApplicationId",
    localAttributes: registryConfig.pgRelations.gcpApplicationFirstPartyVulnerabilities.gcpApplicationsByMyGcpApplicationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.gcpApplicationFirstPartyVulnerabilities.gcpApplicationsByMyGcpApplicationId.remoteAttributes,
    resource: spec_resource_gcp_applicationsPgResource,
    isUnique: true
  }, {
    relationName: "peopleByMyPersonId",
    localAttributes: registryConfig.pgRelations.gcpApplications.peopleByMyPersonId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.gcpApplications.peopleByMyPersonId.remoteAttributes,
    resource: otherSource_peoplePgResource,
    isUnique: true
  }]
}, {
  resource: spec_resource_organizationsPgResource,
  hasReferencee: true,
  isUnique: false,
  layers: [{
    relationName: "gcpApplicationFirstPartyVulnerabilitiesByTheirFirstPartyVulnerabilityId",
    localAttributes: registryConfig.pgRelations.firstPartyVulnerabilities.gcpApplicationFirstPartyVulnerabilitiesByTheirFirstPartyVulnerabilityId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.firstPartyVulnerabilities.gcpApplicationFirstPartyVulnerabilitiesByTheirFirstPartyVulnerabilityId.remoteAttributes,
    resource: members_0_resource_gcp_application_first_party_vulnerabilitiesPgResource,
    isUnique: false
  }, {
    relationName: "gcpApplicationsByMyGcpApplicationId",
    localAttributes: registryConfig.pgRelations.gcpApplicationFirstPartyVulnerabilities.gcpApplicationsByMyGcpApplicationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.gcpApplicationFirstPartyVulnerabilities.gcpApplicationsByMyGcpApplicationId.remoteAttributes,
    resource: spec_resource_gcp_applicationsPgResource,
    isUnique: true
  }, {
    relationName: "organizationsByMyOrganizationId",
    localAttributes: registryConfig.pgRelations.gcpApplications.organizationsByMyOrganizationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.gcpApplications.organizationsByMyOrganizationId.remoteAttributes,
    resource: spec_resource_organizationsPgResource,
    isUnique: true
  }]
}];
const resourceByTypeName14 = {
  __proto__: null,
  Person: otherSource_peoplePgResource,
  Organization: spec_resource_organizationsPgResource
};
const resource_third_party_vulnerabilities_cvss_score_intPgResource = registry.pgResources["third_party_vulnerabilities_cvss_score_int"];
const members12 = [{
  resource: members_1_resource_aws_application_third_party_vulnerabilitiesPgResource,
  typeName: "AwsApplication",
  path: [{
    relationName: "awsApplicationsByMyAwsApplicationId"
  }]
}, {
  resource: members_1_resource_gcp_application_third_party_vulnerabilitiesPgResource,
  typeName: "GcpApplication",
  path: [{
    relationName: "gcpApplicationsByMyGcpApplicationId"
  }]
}];
const paths9 = [{
  resource: spec_resource_aws_applicationsPgResource,
  hasReferencee: true,
  isUnique: false,
  layers: [{
    relationName: "awsApplicationThirdPartyVulnerabilitiesByTheirThirdPartyVulnerabilityId",
    localAttributes: registryConfig.pgRelations.thirdPartyVulnerabilities.awsApplicationThirdPartyVulnerabilitiesByTheirThirdPartyVulnerabilityId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.thirdPartyVulnerabilities.awsApplicationThirdPartyVulnerabilitiesByTheirThirdPartyVulnerabilityId.remoteAttributes,
    resource: members_1_resource_aws_application_third_party_vulnerabilitiesPgResource,
    isUnique: false
  }, {
    relationName: "awsApplicationsByMyAwsApplicationId",
    localAttributes: registryConfig.pgRelations.awsApplicationThirdPartyVulnerabilities.awsApplicationsByMyAwsApplicationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.awsApplicationThirdPartyVulnerabilities.awsApplicationsByMyAwsApplicationId.remoteAttributes,
    resource: spec_resource_aws_applicationsPgResource,
    isUnique: true
  }]
}, {
  resource: spec_resource_gcp_applicationsPgResource,
  hasReferencee: true,
  isUnique: false,
  layers: [{
    relationName: "gcpApplicationThirdPartyVulnerabilitiesByTheirThirdPartyVulnerabilityId",
    localAttributes: registryConfig.pgRelations.thirdPartyVulnerabilities.gcpApplicationThirdPartyVulnerabilitiesByTheirThirdPartyVulnerabilityId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.thirdPartyVulnerabilities.gcpApplicationThirdPartyVulnerabilitiesByTheirThirdPartyVulnerabilityId.remoteAttributes,
    resource: members_1_resource_gcp_application_third_party_vulnerabilitiesPgResource,
    isUnique: false
  }, {
    relationName: "gcpApplicationsByMyGcpApplicationId",
    localAttributes: registryConfig.pgRelations.gcpApplicationThirdPartyVulnerabilities.gcpApplicationsByMyGcpApplicationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.gcpApplicationThirdPartyVulnerabilities.gcpApplicationsByMyGcpApplicationId.remoteAttributes,
    resource: spec_resource_gcp_applicationsPgResource,
    isUnique: true
  }]
}];
const resourceByTypeName15 = {
  __proto__: null,
  AwsApplication: spec_resource_aws_applicationsPgResource,
  GcpApplication: spec_resource_gcp_applicationsPgResource
};
const attributes5 = {};
const members13 = [{
  resource: members_1_resource_aws_application_third_party_vulnerabilitiesPgResource,
  typeName: "Person",
  path: [{
    relationName: "awsApplicationsByMyAwsApplicationId"
  }, {
    relationName: "peopleByMyPersonId"
  }]
}, {
  resource: members_1_resource_aws_application_third_party_vulnerabilitiesPgResource,
  typeName: "Organization",
  path: [{
    relationName: "awsApplicationsByMyAwsApplicationId"
  }, {
    relationName: "organizationsByMyOrganizationId"
  }]
}, {
  resource: members_1_resource_gcp_application_third_party_vulnerabilitiesPgResource,
  typeName: "Person",
  path: [{
    relationName: "gcpApplicationsByMyGcpApplicationId"
  }, {
    relationName: "peopleByMyPersonId"
  }]
}, {
  resource: members_1_resource_gcp_application_third_party_vulnerabilitiesPgResource,
  typeName: "Organization",
  path: [{
    relationName: "gcpApplicationsByMyGcpApplicationId"
  }, {
    relationName: "organizationsByMyOrganizationId"
  }]
}];
const paths10 = [{
  resource: otherSource_peoplePgResource,
  hasReferencee: true,
  isUnique: false,
  layers: [{
    relationName: "awsApplicationThirdPartyVulnerabilitiesByTheirThirdPartyVulnerabilityId",
    localAttributes: registryConfig.pgRelations.thirdPartyVulnerabilities.awsApplicationThirdPartyVulnerabilitiesByTheirThirdPartyVulnerabilityId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.thirdPartyVulnerabilities.awsApplicationThirdPartyVulnerabilitiesByTheirThirdPartyVulnerabilityId.remoteAttributes,
    resource: members_1_resource_aws_application_third_party_vulnerabilitiesPgResource,
    isUnique: false
  }, {
    relationName: "awsApplicationsByMyAwsApplicationId",
    localAttributes: registryConfig.pgRelations.awsApplicationThirdPartyVulnerabilities.awsApplicationsByMyAwsApplicationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.awsApplicationThirdPartyVulnerabilities.awsApplicationsByMyAwsApplicationId.remoteAttributes,
    resource: spec_resource_aws_applicationsPgResource,
    isUnique: true
  }, {
    relationName: "peopleByMyPersonId",
    localAttributes: registryConfig.pgRelations.awsApplications.peopleByMyPersonId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.awsApplications.peopleByMyPersonId.remoteAttributes,
    resource: otherSource_peoplePgResource,
    isUnique: true
  }]
}, {
  resource: spec_resource_organizationsPgResource,
  hasReferencee: true,
  isUnique: false,
  layers: [{
    relationName: "awsApplicationThirdPartyVulnerabilitiesByTheirThirdPartyVulnerabilityId",
    localAttributes: registryConfig.pgRelations.thirdPartyVulnerabilities.awsApplicationThirdPartyVulnerabilitiesByTheirThirdPartyVulnerabilityId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.thirdPartyVulnerabilities.awsApplicationThirdPartyVulnerabilitiesByTheirThirdPartyVulnerabilityId.remoteAttributes,
    resource: members_1_resource_aws_application_third_party_vulnerabilitiesPgResource,
    isUnique: false
  }, {
    relationName: "awsApplicationsByMyAwsApplicationId",
    localAttributes: registryConfig.pgRelations.awsApplicationThirdPartyVulnerabilities.awsApplicationsByMyAwsApplicationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.awsApplicationThirdPartyVulnerabilities.awsApplicationsByMyAwsApplicationId.remoteAttributes,
    resource: spec_resource_aws_applicationsPgResource,
    isUnique: true
  }, {
    relationName: "organizationsByMyOrganizationId",
    localAttributes: registryConfig.pgRelations.awsApplications.organizationsByMyOrganizationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.awsApplications.organizationsByMyOrganizationId.remoteAttributes,
    resource: spec_resource_organizationsPgResource,
    isUnique: true
  }]
}, {
  resource: otherSource_peoplePgResource,
  hasReferencee: true,
  isUnique: false,
  layers: [{
    relationName: "gcpApplicationThirdPartyVulnerabilitiesByTheirThirdPartyVulnerabilityId",
    localAttributes: registryConfig.pgRelations.thirdPartyVulnerabilities.gcpApplicationThirdPartyVulnerabilitiesByTheirThirdPartyVulnerabilityId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.thirdPartyVulnerabilities.gcpApplicationThirdPartyVulnerabilitiesByTheirThirdPartyVulnerabilityId.remoteAttributes,
    resource: members_1_resource_gcp_application_third_party_vulnerabilitiesPgResource,
    isUnique: false
  }, {
    relationName: "gcpApplicationsByMyGcpApplicationId",
    localAttributes: registryConfig.pgRelations.gcpApplicationThirdPartyVulnerabilities.gcpApplicationsByMyGcpApplicationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.gcpApplicationThirdPartyVulnerabilities.gcpApplicationsByMyGcpApplicationId.remoteAttributes,
    resource: spec_resource_gcp_applicationsPgResource,
    isUnique: true
  }, {
    relationName: "peopleByMyPersonId",
    localAttributes: registryConfig.pgRelations.gcpApplications.peopleByMyPersonId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.gcpApplications.peopleByMyPersonId.remoteAttributes,
    resource: otherSource_peoplePgResource,
    isUnique: true
  }]
}, {
  resource: spec_resource_organizationsPgResource,
  hasReferencee: true,
  isUnique: false,
  layers: [{
    relationName: "gcpApplicationThirdPartyVulnerabilitiesByTheirThirdPartyVulnerabilityId",
    localAttributes: registryConfig.pgRelations.thirdPartyVulnerabilities.gcpApplicationThirdPartyVulnerabilitiesByTheirThirdPartyVulnerabilityId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.thirdPartyVulnerabilities.gcpApplicationThirdPartyVulnerabilitiesByTheirThirdPartyVulnerabilityId.remoteAttributes,
    resource: members_1_resource_gcp_application_third_party_vulnerabilitiesPgResource,
    isUnique: false
  }, {
    relationName: "gcpApplicationsByMyGcpApplicationId",
    localAttributes: registryConfig.pgRelations.gcpApplicationThirdPartyVulnerabilities.gcpApplicationsByMyGcpApplicationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.gcpApplicationThirdPartyVulnerabilities.gcpApplicationsByMyGcpApplicationId.remoteAttributes,
    resource: spec_resource_gcp_applicationsPgResource,
    isUnique: true
  }, {
    relationName: "organizationsByMyOrganizationId",
    localAttributes: registryConfig.pgRelations.gcpApplications.organizationsByMyOrganizationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.gcpApplications.organizationsByMyOrganizationId.remoteAttributes,
    resource: spec_resource_organizationsPgResource,
    isUnique: true
  }]
}];
const resourceByTypeName16 = {
  __proto__: null,
  Person: otherSource_peoplePgResource,
  Organization: spec_resource_organizationsPgResource
};
const resourceByTypeName17 = {
  __proto__: null
};
const decodeNodeId2 = makeDecodeNodeId([nodeIdHandler_RelationalTopic, nodeIdHandler_RelationalPost, nodeIdHandler_RelationalDivider, nodeIdHandler_RelationalChecklist, nodeIdHandler_RelationalChecklistItem]);
const details = [{
  remotePkAttributes: relational_topicsUniques[0].attributes,
  handler: nodeIdHandler_RelationalTopic
}, {
  remotePkAttributes: relational_postsUniques[0].attributes,
  handler: nodeIdHandler_RelationalPost
}, {
  remotePkAttributes: relational_dividersUniques[0].attributes,
  handler: nodeIdHandler_RelationalDivider
}, {
  remotePkAttributes: relational_checklistsUniques[0].attributes,
  handler: nodeIdHandler_RelationalChecklist
}, {
  remotePkAttributes: relational_checklist_itemsUniques[0].attributes,
  handler: nodeIdHandler_RelationalChecklistItem
}];
const getSpec = $nodeId => {
  const $specifier = decodeNodeId2($nodeId);
  const $handlerMatches = list(details.map(({
    handler,
    remotePkAttributes
  }) => {
    const spec = handler.getSpec(access($specifier, handler.codec.name));
    return object({
      match: lambda($specifier, specifier => {
        const value = specifier?.[handler.codec.name];
        return value != null ? handler.match(value) : false;
      }),
      pks: list(remotePkAttributes.map(n => spec[n]))
    });
  }));
  const $pkValues = lambda($handlerMatches, handlerMatches => {
    const match = handlerMatches.find(pk => pk.match);
    return match?.pks;
  }, true);
  return relational_itemsUniques[0].attributes.reduce((memo, pkAttribute, i) => {
    memo[pkAttribute] = access($pkValues, i);
    return memo;
  }, Object.create(null));
};
const argDetailsSimple_custom_delete_relational_item = [{
  graphqlArgName: "nodeId",
  pgCodec: relationalItemsCodec,
  postgresArgName: "nodeId",
  required: true,
  fetcher($nodeId) {
    return otherSource_relational_itemsPgResource.get(getSpec($nodeId));
  }
}];
const makeArgs_custom_delete_relational_item = (args, path = []) => argDetailsSimple_custom_delete_relational_item.map(details => makeArg(path, args, details));
const resource_custom_delete_relational_itemPgResource = registry.pgResources["custom_delete_relational_item"];
function pgSelectFromPayload($payload) {
  const $result = $payload.getStepForKey("result");
  const $parent = "getParentStep" in $result ? $result.getParentStep() : $result;
  const $pgSelect = "getClassStep" in $parent ? $parent.getClassStep() : $parent;
  if ($pgSelect instanceof PgSelectStep) {
    return $pgSelect;
  } else {
    throw new Error(`Could not determine PgSelectStep for ${$result}`);
  }
}
function applyInputToInsert(_, $object) {
  return $object;
}
const specFromArgs_Organization = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Organization, $nodeId);
};
function applyInputToUpdateOrDelete(_, $object) {
  return $object;
}
const specFromArgs_Person = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Person, $nodeId);
};
const specFromArgs_RelationalItemRelationCompositePk = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_RelationalItemRelationCompositePk, $nodeId);
};
const specFromArgs_SingleTableItemRelationCompositePk = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_SingleTableItemRelationCompositePk, $nodeId);
};
const specFromArgs_RelationalItemRelation = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_RelationalItemRelation, $nodeId);
};
const specFromArgs_SingleTableItemRelation = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_SingleTableItemRelation, $nodeId);
};
const specFromArgs_LogEntry = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_LogEntry, $nodeId);
};
const specFromArgs_FirstPartyVulnerability = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_FirstPartyVulnerability, $nodeId);
};
const specFromArgs_ThirdPartyVulnerability = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_ThirdPartyVulnerability, $nodeId);
};
const specFromArgs_AwsApplication = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_AwsApplication, $nodeId);
};
const specFromArgs_GcpApplication = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_GcpApplication, $nodeId);
};
const specFromArgs_Organization2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Organization, $nodeId);
};
const specFromArgs_Person2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_Person, $nodeId);
};
const specFromArgs_RelationalItemRelationCompositePk2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_RelationalItemRelationCompositePk, $nodeId);
};
const specFromArgs_SingleTableItemRelationCompositePk2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_SingleTableItemRelationCompositePk, $nodeId);
};
const specFromArgs_RelationalItemRelation2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_RelationalItemRelation, $nodeId);
};
const specFromArgs_SingleTableItemRelation2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_SingleTableItemRelation, $nodeId);
};
const specFromArgs_LogEntry2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_LogEntry, $nodeId);
};
const specFromArgs_FirstPartyVulnerability2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_FirstPartyVulnerability, $nodeId);
};
const specFromArgs_ThirdPartyVulnerability2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_ThirdPartyVulnerability, $nodeId);
};
const specFromArgs_AwsApplication2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_AwsApplication, $nodeId);
};
const specFromArgs_GcpApplication2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandler_GcpApplication, $nodeId);
};
function queryPlan() {
  return rootValue();
}
function getClientMutationIdForCreatePlan($mutation) {
  const $insert = $mutation.getStepForKey("result");
  return $insert.getMeta("clientMutationId");
}
function planCreatePayloadResult($object) {
  return $object.get("result");
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
export const typeDefs = /* GraphQL */`type SingleTableTopic implements SingleTableItem & Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  meaningOfLife: Int
  id: Int!
  type: ItemType!
  parentId: Int
  rootTopicId: Int
  authorId: Int!
  position: BigInt!
  createdAt: Datetime!
  updatedAt: Datetime!
  isExplicitlyArchived: Boolean!
  archivedAt: Datetime
  title: String!

  """Reads a single \`Person\` that is related to this \`SingleTableItem\`."""
  personByAuthorId: Person

  """
  Reads a single \`SingleTableItem\` that is related to this \`SingleTableItem\`.
  """
  singleTableItemByParentId: SingleTableItem

  """Reads and enables pagination through a set of \`SingleTableItem\`."""
  singleTableItemsByParentId(
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
    condition: SingleTableItemCondition

    """The method to use when ordering \`SingleTableItem\`."""
    orderBy: [SingleTableItemsOrderBy!] = [PRIMARY_KEY_ASC]
  ): SingleTableItemsConnection!

  """
  Reads and enables pagination through a set of \`SingleTableItemRelation\`.
  """
  singleTableItemRelationsByChildId(
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
    condition: SingleTableItemRelationCondition

    """The method to use when ordering \`SingleTableItemRelation\`."""
    orderBy: [SingleTableItemRelationsOrderBy!] = [PRIMARY_KEY_ASC]
  ): SingleTableItemRelationsConnection!

  """
  Reads and enables pagination through a set of \`SingleTableItemRelation\`.
  """
  singleTableItemRelationsByParentId(
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
    condition: SingleTableItemRelationCondition

    """The method to use when ordering \`SingleTableItemRelation\`."""
    orderBy: [SingleTableItemRelationsOrderBy!] = [PRIMARY_KEY_ASC]
  ): SingleTableItemRelationsConnection!

  """
  Reads and enables pagination through a set of \`SingleTableItemRelationCompositePk\`.
  """
  singleTableItemRelationCompositePksByChildId(
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
    condition: SingleTableItemRelationCompositePkCondition

    """The method to use when ordering \`SingleTableItemRelationCompositePk\`."""
    orderBy: [SingleTableItemRelationCompositePksOrderBy!] = [PRIMARY_KEY_ASC]
  ): SingleTableItemRelationCompositePksConnection!

  """
  Reads and enables pagination through a set of \`SingleTableItemRelationCompositePk\`.
  """
  singleTableItemRelationCompositePksByParentId(
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
    condition: SingleTableItemRelationCompositePkCondition

    """The method to use when ordering \`SingleTableItemRelationCompositePk\`."""
    orderBy: [SingleTableItemRelationCompositePksOrderBy!] = [PRIMARY_KEY_ASC]
  ): SingleTableItemRelationCompositePksConnection!

  """
  Reads a single \`SingleTableTopic\` that is related to this \`SingleTableTopic\`.
  """
  rootTopic: SingleTableTopic
}

interface SingleTableItem implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  type: ItemType!
  parentId: Int
  rootTopicId: Int
  authorId: Int!
  position: BigInt!
  createdAt: Datetime!
  updatedAt: Datetime!
  isExplicitlyArchived: Boolean!
  archivedAt: Datetime

  """Reads a single \`Person\` that is related to this \`SingleTableItem\`."""
  personByAuthorId: Person

  """
  Reads a single \`SingleTableItem\` that is related to this \`SingleTableItem\`.
  """
  singleTableItemByParentId: SingleTableItem

  """Reads and enables pagination through a set of \`SingleTableItem\`."""
  singleTableItemsByParentId(
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
  ): SingleTableItemsConnection!

  """
  Reads and enables pagination through a set of \`SingleTableItemRelation\`.
  """
  singleTableItemRelationsByChildId(
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
  ): SingleTableItemRelationsConnection!

  """
  Reads and enables pagination through a set of \`SingleTableItemRelation\`.
  """
  singleTableItemRelationsByParentId(
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
  ): SingleTableItemRelationsConnection!

  """
  Reads and enables pagination through a set of \`SingleTableItemRelationCompositePk\`.
  """
  singleTableItemRelationCompositePksByChildId(
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
  ): SingleTableItemRelationCompositePksConnection!

  """
  Reads and enables pagination through a set of \`SingleTableItemRelationCompositePk\`.
  """
  singleTableItemRelationCompositePksByParentId(
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
  ): SingleTableItemRelationCompositePksConnection!

  """
  Reads a single \`SingleTableTopic\` that is related to this \`SingleTableItem\`.
  """
  rootTopic: SingleTableTopic
}

"""An object with a globally unique \`ID\`."""
interface Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
}

enum ItemType {
  TOPIC
  POST
  DIVIDER
  CHECKLIST
  CHECKLIST_ITEM
}

"""
A signed eight-byte integer. The upper big integer values are greater than the
max value for a JavaScript number. Therefore all big integers will be output as
strings and not numbers.
"""
scalar BigInt

"""
A point in time as described by the [ISO
8601](https://en.wikipedia.org/wiki/ISO_8601) and, if it has a timezone, [RFC
3339](https://datatracker.ietf.org/doc/html/rfc3339) standards. Input values
that do not conform to both ISO 8601 and RFC 3339 may be coerced, which may lead
to unexpected results.
"""
scalar Datetime

type Person implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  personId: Int!
  username: String!

  """Reads and enables pagination through a set of \`LogEntry\`."""
  logEntriesByPersonId(
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
    condition: LogEntryCondition

    """The method to use when ordering \`LogEntry\`."""
    orderBy: [LogEntriesOrderBy!] = [PRIMARY_KEY_ASC]
  ): LogEntriesConnection!

  """Reads and enables pagination through a set of \`SingleTableItem\`."""
  singleTableItemsByAuthorId(
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
    condition: SingleTableItemCondition

    """The method to use when ordering \`SingleTableItem\`."""
    orderBy: [SingleTableItemsOrderBy!] = [PRIMARY_KEY_ASC]
  ): SingleTableItemsConnection!

  """Reads and enables pagination through a set of \`RelationalItem\`."""
  relationalItemsByAuthorId(
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
    condition: RelationalItemCondition

    """The method to use when ordering \`RelationalItem\`."""
    orderBy: [RelationalItemsOrderBy!] = [PRIMARY_KEY_ASC]
  ): RelationalItemsConnection!

  """Reads and enables pagination through a set of \`AwsApplication\`."""
  awsApplicationsByPersonId(
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
    condition: AwsApplicationCondition

    """The method to use when ordering \`AwsApplication\`."""
    orderBy: [AwsApplicationsOrderBy!] = [PRIMARY_KEY_ASC]
  ): AwsApplicationsConnection!

  """Reads and enables pagination through a set of \`GcpApplication\`."""
  gcpApplicationsByPersonId(
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
    condition: GcpApplicationCondition

    """The method to use when ordering \`GcpApplication\`."""
    orderBy: [GcpApplicationsOrderBy!] = [PRIMARY_KEY_ASC]
  ): GcpApplicationsConnection!

  """Reads and enables pagination through a set of \`Application\`."""
  applications(
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
    condition: ApplicationCondition

    """Filter results to only those of the given types"""
    only: [ApplicationType!] @deprecated(reason: "EXPERIMENTAL")

    """The method to use when ordering \`Application\`."""
    orderBy: [ApplicationsOrderBy!]
  ): ApplicationsConnection!
}

"""A connection to a list of \`LogEntry\` values."""
type LogEntriesConnection {
  """A list of \`LogEntry\` objects."""
  nodes: [LogEntry]!

  """
  A list of edges which contains the \`LogEntry\` and cursor to aid in pagination.
  """
  edges: [LogEntriesEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`LogEntry\` you could get from the connection."""
  totalCount: Int!
}

type LogEntry implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  personId: Int
  organizationId: Int
  text: String!

  """Reads a single \`Organization\` that is related to this \`LogEntry\`."""
  organizationByOrganizationId: Organization

  """Reads a single \`Person\` that is related to this \`LogEntry\`."""
  personByPersonId: Person

  """
  Reads a single \`PersonOrOrganization\` that is related to this \`LogEntry\`.
  """
  author: PersonOrOrganization
}

type Organization implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  organizationId: Int!
  name: String!

  """Reads and enables pagination through a set of \`LogEntry\`."""
  logEntriesByOrganizationId(
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
    condition: LogEntryCondition

    """The method to use when ordering \`LogEntry\`."""
    orderBy: [LogEntriesOrderBy!] = [PRIMARY_KEY_ASC]
  ): LogEntriesConnection!

  """Reads and enables pagination through a set of \`AwsApplication\`."""
  awsApplicationsByOrganizationId(
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
    condition: AwsApplicationCondition

    """The method to use when ordering \`AwsApplication\`."""
    orderBy: [AwsApplicationsOrderBy!] = [PRIMARY_KEY_ASC]
  ): AwsApplicationsConnection!

  """Reads and enables pagination through a set of \`GcpApplication\`."""
  gcpApplicationsByOrganizationId(
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
    condition: GcpApplicationCondition

    """The method to use when ordering \`GcpApplication\`."""
    orderBy: [GcpApplicationsOrderBy!] = [PRIMARY_KEY_ASC]
  ): GcpApplicationsConnection!
}

"""A location in a connection that can be used for resuming pagination."""
scalar Cursor

"""
A condition to be used against \`LogEntry\` object types. All fields are tested
for equality and combined with a logical ‘and.’
"""
input LogEntryCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`personId\` field."""
  personId: Int

  """Checks for equality with the object’s \`organizationId\` field."""
  organizationId: Int

  """Checks for equality with the object’s \`text\` field."""
  text: String
}

"""Methods to use when ordering \`LogEntry\`."""
enum LogEntriesOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  PERSON_ID_ASC
  PERSON_ID_DESC
  ORGANIZATION_ID_ASC
  ORGANIZATION_ID_DESC
  TEXT_ASC
  TEXT_DESC
}

"""A connection to a list of \`AwsApplication\` values."""
type AwsApplicationsConnection {
  """A list of \`AwsApplication\` objects."""
  nodes: [AwsApplication]!

  """
  A list of edges which contains the \`AwsApplication\` and cursor to aid in pagination.
  """
  edges: [AwsApplicationsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`AwsApplication\` you could get from the connection."""
  totalCount: Int!
}

type AwsApplication implements Node & Application {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  name: String!
  lastDeployed: Datetime
  personId: Int
  organizationId: Int
  awsId: String

  """
  Reads a single \`Organization\` that is related to this \`AwsApplication\`.
  """
  organizationByOrganizationId: Organization

  """Reads a single \`Person\` that is related to this \`AwsApplication\`."""
  personByPersonId: Person

  """Reads and enables pagination through a set of \`Vulnerability\`."""
  vulnerabilities(
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
    condition: VulnerabilityCondition

    """Filter results to only those of the given types"""
    only: [VulnerabilityType!] @deprecated(reason: "EXPERIMENTAL")

    """The method to use when ordering \`Vulnerability\`."""
    orderBy: [VulnerabilitiesOrderBy!]
  ): VulnerabilitiesConnection!

  """
  Reads a single \`PersonOrOrganization\` that is related to this \`AwsApplication\`.
  """
  owner: PersonOrOrganization
}

interface Application implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  name: String!
  lastDeployed: Datetime

  """Reads and enables pagination through a set of \`Vulnerability\`."""
  vulnerabilities(
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

    """Filter results to only those of the given types"""
    only: [VulnerabilityType!] @deprecated(reason: "EXPERIMENTAL")
  ): VulnerabilitiesConnection!

  """
  Reads a single \`PersonOrOrganization\` that is related to this \`Application\`.
  """
  owner: PersonOrOrganization
}

"""A connection to a list of \`Vulnerability\` values."""
type VulnerabilitiesConnection {
  """A list of \`Vulnerability\` objects."""
  nodes: [Vulnerability]!

  """
  A list of edges which contains the \`Vulnerability\` and cursor to aid in pagination.
  """
  edges: [VulnerabilitiesEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Vulnerability\` you could get from the connection."""
  totalCount: Int!
}

interface Vulnerability implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  name: String!
  cvssScore: Float!

  """Reads and enables pagination through a set of \`Application\`."""
  applications(
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

    """Filter results to only those of the given types"""
    only: [ApplicationType!] @deprecated(reason: "EXPERIMENTAL")
  ): ApplicationsConnection!

  """Reads and enables pagination through a set of \`PersonOrOrganization\`."""
  owners: PersonOrOrganizationConnection!
}

"""A connection to a list of \`Application\` values."""
type ApplicationsConnection {
  """A list of \`Application\` objects."""
  nodes: [Application]!

  """
  A list of edges which contains the \`Application\` and cursor to aid in pagination.
  """
  edges: [ApplicationsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Application\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Application\` edge in the connection."""
type ApplicationsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Application\` at the end of the edge."""
  node: Application
}

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

enum ApplicationType {
  AwsApplication
  GcpApplication
}

"""A connection to a list of \`PersonOrOrganization\` values."""
type PersonOrOrganizationConnection {
  """A list of \`PersonOrOrganization\` objects."""
  nodes: [PersonOrOrganization]!

  """
  A list of edges which contains the \`PersonOrOrganization\` and cursor to aid in pagination.
  """
  edges: [PersonOrOrganizationEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!
}

union PersonOrOrganization = Organization | Person

"""A \`PersonOrOrganization\` edge in the connection."""
type PersonOrOrganizationEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`PersonOrOrganization\` at the end of the edge."""
  node: PersonOrOrganization
}

"""A \`Vulnerability\` edge in the connection."""
type VulnerabilitiesEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Vulnerability\` at the end of the edge."""
  node: Vulnerability
}

enum VulnerabilityType {
  FirstPartyVulnerability
  ThirdPartyVulnerability
}

"""
A condition to be used against \`Vulnerability\` object types. All fields are
tested for equality and combined with a logical ‘and.’
"""
input VulnerabilityCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`name\` field."""
  name: String

  """Checks for equality with the object’s \`cvssScore\` field."""
  cvssScore: Float
}

"""Methods to use when ordering \`Vulnerability\`."""
enum VulnerabilitiesOrderBy {
  NATURAL
  ID_ASC
  ID_DESC
  NAME_ASC
  NAME_DESC
  CVSS_SCORE_ASC
  CVSS_SCORE_DESC
}

"""A \`AwsApplication\` edge in the connection."""
type AwsApplicationsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`AwsApplication\` at the end of the edge."""
  node: AwsApplication
}

"""
A condition to be used against \`AwsApplication\` object types. All fields are
tested for equality and combined with a logical ‘and.’
"""
input AwsApplicationCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`name\` field."""
  name: String

  """Checks for equality with the object’s \`lastDeployed\` field."""
  lastDeployed: Datetime

  """Checks for equality with the object’s \`personId\` field."""
  personId: Int

  """Checks for equality with the object’s \`organizationId\` field."""
  organizationId: Int

  """Checks for equality with the object’s \`awsId\` field."""
  awsId: String
}

"""Methods to use when ordering \`AwsApplication\`."""
enum AwsApplicationsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  NAME_ASC
  NAME_DESC
  LAST_DEPLOYED_ASC
  LAST_DEPLOYED_DESC
  PERSON_ID_ASC
  PERSON_ID_DESC
  ORGANIZATION_ID_ASC
  ORGANIZATION_ID_DESC
  AWS_ID_ASC
  AWS_ID_DESC
}

"""A connection to a list of \`GcpApplication\` values."""
type GcpApplicationsConnection {
  """A list of \`GcpApplication\` objects."""
  nodes: [GcpApplication]!

  """
  A list of edges which contains the \`GcpApplication\` and cursor to aid in pagination.
  """
  edges: [GcpApplicationsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`GcpApplication\` you could get from the connection."""
  totalCount: Int!
}

type GcpApplication implements Node & Application {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  name: String!
  lastDeployed: Datetime
  personId: Int
  organizationId: Int
  gcpId: String

  """
  Reads a single \`Organization\` that is related to this \`GcpApplication\`.
  """
  organizationByOrganizationId: Organization

  """Reads a single \`Person\` that is related to this \`GcpApplication\`."""
  personByPersonId: Person

  """Reads and enables pagination through a set of \`Vulnerability\`."""
  vulnerabilities(
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
    condition: VulnerabilityCondition

    """Filter results to only those of the given types"""
    only: [VulnerabilityType!] @deprecated(reason: "EXPERIMENTAL")

    """The method to use when ordering \`Vulnerability\`."""
    orderBy: [VulnerabilitiesOrderBy!]
  ): VulnerabilitiesConnection!

  """
  Reads a single \`PersonOrOrganization\` that is related to this \`GcpApplication\`.
  """
  owner: PersonOrOrganization
}

"""A \`GcpApplication\` edge in the connection."""
type GcpApplicationsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`GcpApplication\` at the end of the edge."""
  node: GcpApplication
}

"""
A condition to be used against \`GcpApplication\` object types. All fields are
tested for equality and combined with a logical ‘and.’
"""
input GcpApplicationCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`name\` field."""
  name: String

  """Checks for equality with the object’s \`lastDeployed\` field."""
  lastDeployed: Datetime

  """Checks for equality with the object’s \`personId\` field."""
  personId: Int

  """Checks for equality with the object’s \`organizationId\` field."""
  organizationId: Int

  """Checks for equality with the object’s \`gcpId\` field."""
  gcpId: String
}

"""Methods to use when ordering \`GcpApplication\`."""
enum GcpApplicationsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  NAME_ASC
  NAME_DESC
  LAST_DEPLOYED_ASC
  LAST_DEPLOYED_DESC
  PERSON_ID_ASC
  PERSON_ID_DESC
  ORGANIZATION_ID_ASC
  ORGANIZATION_ID_DESC
  GCP_ID_ASC
  GCP_ID_DESC
}

"""A \`LogEntry\` edge in the connection."""
type LogEntriesEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`LogEntry\` at the end of the edge."""
  node: LogEntry
}

"""A connection to a list of \`SingleTableItem\` values."""
type SingleTableItemsConnection {
  """A list of \`SingleTableItem\` objects."""
  nodes: [SingleTableItem]!

  """
  A list of edges which contains the \`SingleTableItem\` and cursor to aid in pagination.
  """
  edges: [SingleTableItemsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """
  The count of *all* \`SingleTableItem\` you could get from the connection.
  """
  totalCount: Int!
}

"""A \`SingleTableItem\` edge in the connection."""
type SingleTableItemsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`SingleTableItem\` at the end of the edge."""
  node: SingleTableItem
}

"""
A condition to be used against \`SingleTableItem\` object types. All fields are
tested for equality and combined with a logical ‘and.’
"""
input SingleTableItemCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`type\` field."""
  type: ItemType

  """Checks for equality with the object’s \`parentId\` field."""
  parentId: Int

  """Checks for equality with the object’s \`rootTopicId\` field."""
  rootTopicId: Int

  """Checks for equality with the object’s \`authorId\` field."""
  authorId: Int

  """Checks for equality with the object’s \`position\` field."""
  position: BigInt

  """Checks for equality with the object’s \`createdAt\` field."""
  createdAt: Datetime

  """Checks for equality with the object’s \`updatedAt\` field."""
  updatedAt: Datetime

  """Checks for equality with the object’s \`isExplicitlyArchived\` field."""
  isExplicitlyArchived: Boolean

  """Checks for equality with the object’s \`archivedAt\` field."""
  archivedAt: Datetime
}

"""Methods to use when ordering \`SingleTableItem\`."""
enum SingleTableItemsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  TYPE_ASC
  TYPE_DESC
  PARENT_ID_ASC
  PARENT_ID_DESC
  ROOT_TOPIC_ID_ASC
  ROOT_TOPIC_ID_DESC
  AUTHOR_ID_ASC
  AUTHOR_ID_DESC
  POSITION_ASC
  POSITION_DESC
  CREATED_AT_ASC
  CREATED_AT_DESC
  UPDATED_AT_ASC
  UPDATED_AT_DESC
  IS_EXPLICITLY_ARCHIVED_ASC
  IS_EXPLICITLY_ARCHIVED_DESC
  ARCHIVED_AT_ASC
  ARCHIVED_AT_DESC
}

"""A connection to a list of \`RelationalItem\` values."""
type RelationalItemsConnection {
  """A list of \`RelationalItem\` objects."""
  nodes: [RelationalItem]!

  """
  A list of edges which contains the \`RelationalItem\` and cursor to aid in pagination.
  """
  edges: [RelationalItemsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`RelationalItem\` you could get from the connection."""
  totalCount: Int!
}

interface RelationalItem implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  type: ItemType!
  parentId: Int
  rootTopicId: Int
  authorId: Int!
  position: BigInt!
  createdAt: Datetime!
  updatedAt: Datetime!
  isExplicitlyArchived: Boolean!
  archivedAt: Datetime

  """Reads a single \`Person\` that is related to this \`RelationalItem\`."""
  personByAuthorId: Person

  """
  Reads a single \`RelationalItem\` that is related to this \`RelationalItem\`.
  """
  relationalItemByParentId: RelationalItem

  """
  Reads a single \`RelationalTopic\` that is related to this \`RelationalItem\`.
  """
  relationalTopicByRootTopicId: RelationalTopic

  """Reads and enables pagination through a set of \`RelationalItem\`."""
  relationalItemsByParentId(
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
  ): RelationalItemsConnection!

  """
  Reads and enables pagination through a set of \`RelationalItemRelation\`.
  """
  relationalItemRelationsByChildId(
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
  ): RelationalItemRelationsConnection!

  """
  Reads and enables pagination through a set of \`RelationalItemRelation\`.
  """
  relationalItemRelationsByParentId(
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
  ): RelationalItemRelationsConnection!

  """
  Reads and enables pagination through a set of \`RelationalItemRelationCompositePk\`.
  """
  relationalItemRelationCompositePksByChildId(
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
  ): RelationalItemRelationCompositePksConnection!

  """
  Reads and enables pagination through a set of \`RelationalItemRelationCompositePk\`.
  """
  relationalItemRelationCompositePksByParentId(
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
  ): RelationalItemRelationCompositePksConnection!
}

"""A connection to a list of \`RelationalItemRelation\` values."""
type RelationalItemRelationsConnection {
  """A list of \`RelationalItemRelation\` objects."""
  nodes: [RelationalItemRelation]!

  """
  A list of edges which contains the \`RelationalItemRelation\` and cursor to aid in pagination.
  """
  edges: [RelationalItemRelationsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """
  The count of *all* \`RelationalItemRelation\` you could get from the connection.
  """
  totalCount: Int!
}

type RelationalItemRelation implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  parentId: Int!
  childId: Int!

  """
  Reads a single \`RelationalItem\` that is related to this \`RelationalItemRelation\`.
  """
  relationalItemByChildId: RelationalItem

  """
  Reads a single \`RelationalItem\` that is related to this \`RelationalItemRelation\`.
  """
  relationalItemByParentId: RelationalItem
}

"""A \`RelationalItemRelation\` edge in the connection."""
type RelationalItemRelationsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`RelationalItemRelation\` at the end of the edge."""
  node: RelationalItemRelation
}

"""A connection to a list of \`RelationalItemRelationCompositePk\` values."""
type RelationalItemRelationCompositePksConnection {
  """A list of \`RelationalItemRelationCompositePk\` objects."""
  nodes: [RelationalItemRelationCompositePk]!

  """
  A list of edges which contains the \`RelationalItemRelationCompositePk\` and cursor to aid in pagination.
  """
  edges: [RelationalItemRelationCompositePksEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """
  The count of *all* \`RelationalItemRelationCompositePk\` you could get from the connection.
  """
  totalCount: Int!
}

type RelationalItemRelationCompositePk implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  parentId: Int!
  childId: Int!

  """
  Reads a single \`RelationalItem\` that is related to this \`RelationalItemRelationCompositePk\`.
  """
  relationalItemByChildId: RelationalItem

  """
  Reads a single \`RelationalItem\` that is related to this \`RelationalItemRelationCompositePk\`.
  """
  relationalItemByParentId: RelationalItem
}

"""A \`RelationalItemRelationCompositePk\` edge in the connection."""
type RelationalItemRelationCompositePksEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`RelationalItemRelationCompositePk\` at the end of the edge."""
  node: RelationalItemRelationCompositePk
}

"""A \`RelationalItem\` edge in the connection."""
type RelationalItemsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`RelationalItem\` at the end of the edge."""
  node: RelationalItem
}

"""
A condition to be used against \`RelationalItem\` object types. All fields are
tested for equality and combined with a logical ‘and.’
"""
input RelationalItemCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`type\` field."""
  type: ItemType

  """Checks for equality with the object’s \`parentId\` field."""
  parentId: Int

  """Checks for equality with the object’s \`rootTopicId\` field."""
  rootTopicId: Int

  """Checks for equality with the object’s \`authorId\` field."""
  authorId: Int

  """Checks for equality with the object’s \`position\` field."""
  position: BigInt

  """Checks for equality with the object’s \`createdAt\` field."""
  createdAt: Datetime

  """Checks for equality with the object’s \`updatedAt\` field."""
  updatedAt: Datetime

  """Checks for equality with the object’s \`isExplicitlyArchived\` field."""
  isExplicitlyArchived: Boolean

  """Checks for equality with the object’s \`archivedAt\` field."""
  archivedAt: Datetime
}

"""Methods to use when ordering \`RelationalItem\`."""
enum RelationalItemsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  TYPE_ASC
  TYPE_DESC
  PARENT_ID_ASC
  PARENT_ID_DESC
  ROOT_TOPIC_ID_ASC
  ROOT_TOPIC_ID_DESC
  AUTHOR_ID_ASC
  AUTHOR_ID_DESC
  POSITION_ASC
  POSITION_DESC
  CREATED_AT_ASC
  CREATED_AT_DESC
  UPDATED_AT_ASC
  UPDATED_AT_DESC
  IS_EXPLICITLY_ARCHIVED_ASC
  IS_EXPLICITLY_ARCHIVED_DESC
  ARCHIVED_AT_ASC
  ARCHIVED_AT_DESC
}

"""
A condition to be used against \`Application\` object types. All fields are tested
for equality and combined with a logical ‘and.’
"""
input ApplicationCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`name\` field."""
  name: String

  """Checks for equality with the object’s \`lastDeployed\` field."""
  lastDeployed: Datetime
}

"""Methods to use when ordering \`Application\`."""
enum ApplicationsOrderBy {
  NATURAL
  ID_ASC
  ID_DESC
  NAME_ASC
  NAME_DESC
  LAST_DEPLOYED_ASC
  LAST_DEPLOYED_DESC
}

"""A connection to a list of \`SingleTableItemRelation\` values."""
type SingleTableItemRelationsConnection {
  """A list of \`SingleTableItemRelation\` objects."""
  nodes: [SingleTableItemRelation]!

  """
  A list of edges which contains the \`SingleTableItemRelation\` and cursor to aid in pagination.
  """
  edges: [SingleTableItemRelationsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """
  The count of *all* \`SingleTableItemRelation\` you could get from the connection.
  """
  totalCount: Int!
}

type SingleTableItemRelation implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  parentId: Int!
  childId: Int!

  """
  Reads a single \`SingleTableItem\` that is related to this \`SingleTableItemRelation\`.
  """
  singleTableItemByChildId: SingleTableItem

  """
  Reads a single \`SingleTableItem\` that is related to this \`SingleTableItemRelation\`.
  """
  singleTableItemByParentId: SingleTableItem
}

"""A \`SingleTableItemRelation\` edge in the connection."""
type SingleTableItemRelationsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`SingleTableItemRelation\` at the end of the edge."""
  node: SingleTableItemRelation
}

"""A connection to a list of \`SingleTableItemRelationCompositePk\` values."""
type SingleTableItemRelationCompositePksConnection {
  """A list of \`SingleTableItemRelationCompositePk\` objects."""
  nodes: [SingleTableItemRelationCompositePk]!

  """
  A list of edges which contains the \`SingleTableItemRelationCompositePk\` and cursor to aid in pagination.
  """
  edges: [SingleTableItemRelationCompositePksEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """
  The count of *all* \`SingleTableItemRelationCompositePk\` you could get from the connection.
  """
  totalCount: Int!
}

type SingleTableItemRelationCompositePk implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  parentId: Int!
  childId: Int!

  """
  Reads a single \`SingleTableItem\` that is related to this \`SingleTableItemRelationCompositePk\`.
  """
  singleTableItemByChildId: SingleTableItem

  """
  Reads a single \`SingleTableItem\` that is related to this \`SingleTableItemRelationCompositePk\`.
  """
  singleTableItemByParentId: SingleTableItem
}

"""A \`SingleTableItemRelationCompositePk\` edge in the connection."""
type SingleTableItemRelationCompositePksEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`SingleTableItemRelationCompositePk\` at the end of the edge."""
  node: SingleTableItemRelationCompositePk
}

"""
A condition to be used against \`SingleTableItemRelation\` object types. All
fields are tested for equality and combined with a logical ‘and.’
"""
input SingleTableItemRelationCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`parentId\` field."""
  parentId: Int

  """Checks for equality with the object’s \`childId\` field."""
  childId: Int
}

"""Methods to use when ordering \`SingleTableItemRelation\`."""
enum SingleTableItemRelationsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  PARENT_ID_ASC
  PARENT_ID_DESC
  CHILD_ID_ASC
  CHILD_ID_DESC
}

"""
A condition to be used against \`SingleTableItemRelationCompositePk\` object
types. All fields are tested for equality and combined with a logical ‘and.’
"""
input SingleTableItemRelationCompositePkCondition {
  """Checks for equality with the object’s \`parentId\` field."""
  parentId: Int

  """Checks for equality with the object’s \`childId\` field."""
  childId: Int
}

"""Methods to use when ordering \`SingleTableItemRelationCompositePk\`."""
enum SingleTableItemRelationCompositePksOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  PARENT_ID_ASC
  PARENT_ID_DESC
  CHILD_ID_ASC
  CHILD_ID_DESC
}

type SingleTablePost implements SingleTableItem & Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  meaningOfLife: Int
  id: Int!
  type: ItemType!
  parentId: Int
  rootTopicId: Int
  authorId: Int!
  position: BigInt!
  createdAt: Datetime!
  updatedAt: Datetime!
  isExplicitlyArchived: Boolean!
  archivedAt: Datetime
  subject: String
  description: String
  note: String
  priorityId: Int

  """Reads a single \`Person\` that is related to this \`SingleTableItem\`."""
  personByAuthorId: Person

  """
  Reads a single \`SingleTableItem\` that is related to this \`SingleTableItem\`.
  """
  singleTableItemByParentId: SingleTableItem

  """Reads a single \`Priority\` that is related to this \`SingleTableItem\`."""
  priorityByPriorityId: Priority

  """Reads and enables pagination through a set of \`SingleTableItem\`."""
  singleTableItemsByParentId(
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
    condition: SingleTableItemCondition

    """The method to use when ordering \`SingleTableItem\`."""
    orderBy: [SingleTableItemsOrderBy!] = [PRIMARY_KEY_ASC]
  ): SingleTableItemsConnection!

  """
  Reads and enables pagination through a set of \`SingleTableItemRelation\`.
  """
  singleTableItemRelationsByChildId(
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
    condition: SingleTableItemRelationCondition

    """The method to use when ordering \`SingleTableItemRelation\`."""
    orderBy: [SingleTableItemRelationsOrderBy!] = [PRIMARY_KEY_ASC]
  ): SingleTableItemRelationsConnection!

  """
  Reads and enables pagination through a set of \`SingleTableItemRelation\`.
  """
  singleTableItemRelationsByParentId(
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
    condition: SingleTableItemRelationCondition

    """The method to use when ordering \`SingleTableItemRelation\`."""
    orderBy: [SingleTableItemRelationsOrderBy!] = [PRIMARY_KEY_ASC]
  ): SingleTableItemRelationsConnection!

  """
  Reads and enables pagination through a set of \`SingleTableItemRelationCompositePk\`.
  """
  singleTableItemRelationCompositePksByChildId(
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
    condition: SingleTableItemRelationCompositePkCondition

    """The method to use when ordering \`SingleTableItemRelationCompositePk\`."""
    orderBy: [SingleTableItemRelationCompositePksOrderBy!] = [PRIMARY_KEY_ASC]
  ): SingleTableItemRelationCompositePksConnection!

  """
  Reads and enables pagination through a set of \`SingleTableItemRelationCompositePk\`.
  """
  singleTableItemRelationCompositePksByParentId(
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
    condition: SingleTableItemRelationCompositePkCondition

    """The method to use when ordering \`SingleTableItemRelationCompositePk\`."""
    orderBy: [SingleTableItemRelationCompositePksOrderBy!] = [PRIMARY_KEY_ASC]
  ): SingleTableItemRelationCompositePksConnection!

  """
  Reads a single \`SingleTableTopic\` that is related to this \`SingleTablePost\`.
  """
  rootTopic: SingleTableTopic
}

type Priority implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int!
  title: String!

  """Reads and enables pagination through a set of \`SingleTableItem\`."""
  singleTableItemsByPriorityId(
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
    condition: SingleTableItemCondition

    """The method to use when ordering \`SingleTableItem\`."""
    orderBy: [SingleTableItemsOrderBy!] = [PRIMARY_KEY_ASC]
  ): SingleTableItemsConnection!
}

type SingleTableDivider implements SingleTableItem & Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  meaningOfLife: Int
  id: Int!
  type: ItemType!
  parentId: Int
  rootTopicId: Int
  authorId: Int!
  position: BigInt!
  createdAt: Datetime!
  updatedAt: Datetime!
  isExplicitlyArchived: Boolean!
  archivedAt: Datetime
  title: String
  color: String

  """Reads a single \`Person\` that is related to this \`SingleTableItem\`."""
  personByAuthorId: Person

  """
  Reads a single \`SingleTableItem\` that is related to this \`SingleTableItem\`.
  """
  singleTableItemByParentId: SingleTableItem

  """Reads and enables pagination through a set of \`SingleTableItem\`."""
  singleTableItemsByParentId(
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
    condition: SingleTableItemCondition

    """The method to use when ordering \`SingleTableItem\`."""
    orderBy: [SingleTableItemsOrderBy!] = [PRIMARY_KEY_ASC]
  ): SingleTableItemsConnection!

  """
  Reads and enables pagination through a set of \`SingleTableItemRelation\`.
  """
  singleTableItemRelationsByChildId(
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
    condition: SingleTableItemRelationCondition

    """The method to use when ordering \`SingleTableItemRelation\`."""
    orderBy: [SingleTableItemRelationsOrderBy!] = [PRIMARY_KEY_ASC]
  ): SingleTableItemRelationsConnection!

  """
  Reads and enables pagination through a set of \`SingleTableItemRelation\`.
  """
  singleTableItemRelationsByParentId(
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
    condition: SingleTableItemRelationCondition

    """The method to use when ordering \`SingleTableItemRelation\`."""
    orderBy: [SingleTableItemRelationsOrderBy!] = [PRIMARY_KEY_ASC]
  ): SingleTableItemRelationsConnection!

  """
  Reads and enables pagination through a set of \`SingleTableItemRelationCompositePk\`.
  """
  singleTableItemRelationCompositePksByChildId(
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
    condition: SingleTableItemRelationCompositePkCondition

    """The method to use when ordering \`SingleTableItemRelationCompositePk\`."""
    orderBy: [SingleTableItemRelationCompositePksOrderBy!] = [PRIMARY_KEY_ASC]
  ): SingleTableItemRelationCompositePksConnection!

  """
  Reads and enables pagination through a set of \`SingleTableItemRelationCompositePk\`.
  """
  singleTableItemRelationCompositePksByParentId(
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
    condition: SingleTableItemRelationCompositePkCondition

    """The method to use when ordering \`SingleTableItemRelationCompositePk\`."""
    orderBy: [SingleTableItemRelationCompositePksOrderBy!] = [PRIMARY_KEY_ASC]
  ): SingleTableItemRelationCompositePksConnection!

  """
  Reads a single \`SingleTableTopic\` that is related to this \`SingleTableDivider\`.
  """
  rootTopic: SingleTableTopic
}

type SingleTableChecklist implements SingleTableItem & Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  meaningOfLife: Int
  id: Int!
  type: ItemType!
  parentId: Int
  rootTopicId: Int
  authorId: Int!
  position: BigInt!
  createdAt: Datetime!
  updatedAt: Datetime!
  isExplicitlyArchived: Boolean!
  archivedAt: Datetime
  title: String

  """Reads a single \`Person\` that is related to this \`SingleTableItem\`."""
  personByAuthorId: Person

  """
  Reads a single \`SingleTableItem\` that is related to this \`SingleTableItem\`.
  """
  singleTableItemByParentId: SingleTableItem

  """Reads and enables pagination through a set of \`SingleTableItem\`."""
  singleTableItemsByParentId(
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
    condition: SingleTableItemCondition

    """The method to use when ordering \`SingleTableItem\`."""
    orderBy: [SingleTableItemsOrderBy!] = [PRIMARY_KEY_ASC]
  ): SingleTableItemsConnection!

  """
  Reads and enables pagination through a set of \`SingleTableItemRelation\`.
  """
  singleTableItemRelationsByChildId(
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
    condition: SingleTableItemRelationCondition

    """The method to use when ordering \`SingleTableItemRelation\`."""
    orderBy: [SingleTableItemRelationsOrderBy!] = [PRIMARY_KEY_ASC]
  ): SingleTableItemRelationsConnection!

  """
  Reads and enables pagination through a set of \`SingleTableItemRelation\`.
  """
  singleTableItemRelationsByParentId(
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
    condition: SingleTableItemRelationCondition

    """The method to use when ordering \`SingleTableItemRelation\`."""
    orderBy: [SingleTableItemRelationsOrderBy!] = [PRIMARY_KEY_ASC]
  ): SingleTableItemRelationsConnection!

  """
  Reads and enables pagination through a set of \`SingleTableItemRelationCompositePk\`.
  """
  singleTableItemRelationCompositePksByChildId(
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
    condition: SingleTableItemRelationCompositePkCondition

    """The method to use when ordering \`SingleTableItemRelationCompositePk\`."""
    orderBy: [SingleTableItemRelationCompositePksOrderBy!] = [PRIMARY_KEY_ASC]
  ): SingleTableItemRelationCompositePksConnection!

  """
  Reads and enables pagination through a set of \`SingleTableItemRelationCompositePk\`.
  """
  singleTableItemRelationCompositePksByParentId(
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
    condition: SingleTableItemRelationCompositePkCondition

    """The method to use when ordering \`SingleTableItemRelationCompositePk\`."""
    orderBy: [SingleTableItemRelationCompositePksOrderBy!] = [PRIMARY_KEY_ASC]
  ): SingleTableItemRelationCompositePksConnection!

  """
  Reads a single \`SingleTableTopic\` that is related to this \`SingleTableChecklist\`.
  """
  rootTopic: SingleTableTopic

  """
  Reads a single \`SingleTableTopic\` that is related to this \`SingleTableChecklist\`.
  """
  rootChecklistTopic: SingleTableTopic
}

type SingleTableChecklistItem implements SingleTableItem & Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  meaningOfLife: Int
  id: Int!
  type: ItemType!
  parentId: Int
  rootTopicId: Int
  authorId: Int!
  position: BigInt!
  createdAt: Datetime!
  updatedAt: Datetime!
  isExplicitlyArchived: Boolean!
  archivedAt: Datetime
  description: String
  note: String
  priorityId: Int

  """Reads a single \`Person\` that is related to this \`SingleTableItem\`."""
  personByAuthorId: Person

  """
  Reads a single \`SingleTableItem\` that is related to this \`SingleTableItem\`.
  """
  singleTableItemByParentId: SingleTableItem

  """Reads a single \`Priority\` that is related to this \`SingleTableItem\`."""
  priorityByPriorityId: Priority

  """Reads and enables pagination through a set of \`SingleTableItem\`."""
  singleTableItemsByParentId(
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
    condition: SingleTableItemCondition

    """The method to use when ordering \`SingleTableItem\`."""
    orderBy: [SingleTableItemsOrderBy!] = [PRIMARY_KEY_ASC]
  ): SingleTableItemsConnection!

  """
  Reads and enables pagination through a set of \`SingleTableItemRelation\`.
  """
  singleTableItemRelationsByChildId(
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
    condition: SingleTableItemRelationCondition

    """The method to use when ordering \`SingleTableItemRelation\`."""
    orderBy: [SingleTableItemRelationsOrderBy!] = [PRIMARY_KEY_ASC]
  ): SingleTableItemRelationsConnection!

  """
  Reads and enables pagination through a set of \`SingleTableItemRelation\`.
  """
  singleTableItemRelationsByParentId(
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
    condition: SingleTableItemRelationCondition

    """The method to use when ordering \`SingleTableItemRelation\`."""
    orderBy: [SingleTableItemRelationsOrderBy!] = [PRIMARY_KEY_ASC]
  ): SingleTableItemRelationsConnection!

  """
  Reads and enables pagination through a set of \`SingleTableItemRelationCompositePk\`.
  """
  singleTableItemRelationCompositePksByChildId(
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
    condition: SingleTableItemRelationCompositePkCondition

    """The method to use when ordering \`SingleTableItemRelationCompositePk\`."""
    orderBy: [SingleTableItemRelationCompositePksOrderBy!] = [PRIMARY_KEY_ASC]
  ): SingleTableItemRelationCompositePksConnection!

  """
  Reads and enables pagination through a set of \`SingleTableItemRelationCompositePk\`.
  """
  singleTableItemRelationCompositePksByParentId(
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
    condition: SingleTableItemRelationCompositePkCondition

    """The method to use when ordering \`SingleTableItemRelationCompositePk\`."""
    orderBy: [SingleTableItemRelationCompositePksOrderBy!] = [PRIMARY_KEY_ASC]
  ): SingleTableItemRelationCompositePksConnection!

  """
  Reads a single \`SingleTableTopic\` that is related to this \`SingleTableChecklistItem\`.
  """
  rootTopic: SingleTableTopic
}

type RelationalTopic implements Node & RelationalItem {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  parentFn: RelationalItem
  title: String!
  id: Int!
  type: ItemType!
  parentId: Int
  rootTopicId: Int
  authorId: Int!
  position: BigInt!
  createdAt: Datetime!
  updatedAt: Datetime!
  isExplicitlyArchived: Boolean!
  archivedAt: Datetime

  """Reads and enables pagination through a set of \`RelationalItem\`."""
  relationalItemsByRootTopicId(
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
    condition: RelationalItemCondition

    """The method to use when ordering \`RelationalItem\`."""
    orderBy: [RelationalItemsOrderBy!] = [PRIMARY_KEY_ASC]
  ): RelationalItemsConnection!

  """Reads a single \`Person\` that is related to this \`RelationalTopic\`."""
  personByAuthorId: Person

  """
  Reads a single \`RelationalItem\` that is related to this \`RelationalTopic\`.
  """
  relationalItemByParentId: RelationalItem

  """
  Reads a single \`RelationalTopic\` that is related to this \`RelationalTopic\`.
  """
  relationalTopicByRootTopicId: RelationalTopic

  """Reads and enables pagination through a set of \`RelationalItem\`."""
  relationalItemsByParentId(
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
    condition: RelationalItemCondition

    """The method to use when ordering \`RelationalItem\`."""
    orderBy: [RelationalItemsOrderBy!] = [PRIMARY_KEY_ASC]
  ): RelationalItemsConnection!

  """
  Reads and enables pagination through a set of \`RelationalItemRelation\`.
  """
  relationalItemRelationsByChildId(
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
    condition: RelationalItemRelationCondition

    """The method to use when ordering \`RelationalItemRelation\`."""
    orderBy: [RelationalItemRelationsOrderBy!] = [PRIMARY_KEY_ASC]
  ): RelationalItemRelationsConnection!

  """
  Reads and enables pagination through a set of \`RelationalItemRelation\`.
  """
  relationalItemRelationsByParentId(
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
    condition: RelationalItemRelationCondition

    """The method to use when ordering \`RelationalItemRelation\`."""
    orderBy: [RelationalItemRelationsOrderBy!] = [PRIMARY_KEY_ASC]
  ): RelationalItemRelationsConnection!

  """
  Reads and enables pagination through a set of \`RelationalItemRelationCompositePk\`.
  """
  relationalItemRelationCompositePksByChildId(
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
    condition: RelationalItemRelationCompositePkCondition

    """The method to use when ordering \`RelationalItemRelationCompositePk\`."""
    orderBy: [RelationalItemRelationCompositePksOrderBy!] = [PRIMARY_KEY_ASC]
  ): RelationalItemRelationCompositePksConnection!

  """
  Reads and enables pagination through a set of \`RelationalItemRelationCompositePk\`.
  """
  relationalItemRelationCompositePksByParentId(
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
    condition: RelationalItemRelationCompositePkCondition

    """The method to use when ordering \`RelationalItemRelationCompositePk\`."""
    orderBy: [RelationalItemRelationCompositePksOrderBy!] = [PRIMARY_KEY_ASC]
  ): RelationalItemRelationCompositePksConnection!
}

"""
A condition to be used against \`RelationalItemRelation\` object types. All fields
are tested for equality and combined with a logical ‘and.’
"""
input RelationalItemRelationCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`parentId\` field."""
  parentId: Int

  """Checks for equality with the object’s \`childId\` field."""
  childId: Int
}

"""Methods to use when ordering \`RelationalItemRelation\`."""
enum RelationalItemRelationsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  PARENT_ID_ASC
  PARENT_ID_DESC
  CHILD_ID_ASC
  CHILD_ID_DESC
}

"""
A condition to be used against \`RelationalItemRelationCompositePk\` object types.
All fields are tested for equality and combined with a logical ‘and.’
"""
input RelationalItemRelationCompositePkCondition {
  """Checks for equality with the object’s \`parentId\` field."""
  parentId: Int

  """Checks for equality with the object’s \`childId\` field."""
  childId: Int
}

"""Methods to use when ordering \`RelationalItemRelationCompositePk\`."""
enum RelationalItemRelationCompositePksOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  PARENT_ID_ASC
  PARENT_ID_DESC
  CHILD_ID_ASC
  CHILD_ID_DESC
}

type RelationalPost implements Node & RelationalItem {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  title: String!
  description: String
  note: String
  id: Int!
  type: ItemType!
  parentId: Int
  rootTopicId: Int
  authorId: Int!
  position: BigInt!
  createdAt: Datetime!
  updatedAt: Datetime!
  isExplicitlyArchived: Boolean!
  archivedAt: Datetime

  """Reads a single \`Person\` that is related to this \`RelationalPost\`."""
  personByAuthorId: Person

  """
  Reads a single \`RelationalItem\` that is related to this \`RelationalPost\`.
  """
  relationalItemByParentId: RelationalItem

  """
  Reads a single \`RelationalTopic\` that is related to this \`RelationalPost\`.
  """
  relationalTopicByRootTopicId: RelationalTopic

  """Reads and enables pagination through a set of \`RelationalItem\`."""
  relationalItemsByParentId(
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
    condition: RelationalItemCondition

    """The method to use when ordering \`RelationalItem\`."""
    orderBy: [RelationalItemsOrderBy!] = [PRIMARY_KEY_ASC]
  ): RelationalItemsConnection!

  """
  Reads and enables pagination through a set of \`RelationalItemRelation\`.
  """
  relationalItemRelationsByChildId(
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
    condition: RelationalItemRelationCondition

    """The method to use when ordering \`RelationalItemRelation\`."""
    orderBy: [RelationalItemRelationsOrderBy!] = [PRIMARY_KEY_ASC]
  ): RelationalItemRelationsConnection!

  """
  Reads and enables pagination through a set of \`RelationalItemRelation\`.
  """
  relationalItemRelationsByParentId(
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
    condition: RelationalItemRelationCondition

    """The method to use when ordering \`RelationalItemRelation\`."""
    orderBy: [RelationalItemRelationsOrderBy!] = [PRIMARY_KEY_ASC]
  ): RelationalItemRelationsConnection!

  """
  Reads and enables pagination through a set of \`RelationalItemRelationCompositePk\`.
  """
  relationalItemRelationCompositePksByChildId(
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
    condition: RelationalItemRelationCompositePkCondition

    """The method to use when ordering \`RelationalItemRelationCompositePk\`."""
    orderBy: [RelationalItemRelationCompositePksOrderBy!] = [PRIMARY_KEY_ASC]
  ): RelationalItemRelationCompositePksConnection!

  """
  Reads and enables pagination through a set of \`RelationalItemRelationCompositePk\`.
  """
  relationalItemRelationCompositePksByParentId(
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
    condition: RelationalItemRelationCompositePkCondition

    """The method to use when ordering \`RelationalItemRelationCompositePk\`."""
    orderBy: [RelationalItemRelationCompositePksOrderBy!] = [PRIMARY_KEY_ASC]
  ): RelationalItemRelationCompositePksConnection!
}

type RelationalDivider implements Node & RelationalItem {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  title: String
  color: String
  id: Int!
  type: ItemType!
  parentId: Int
  rootTopicId: Int
  authorId: Int!
  position: BigInt!
  createdAt: Datetime!
  updatedAt: Datetime!
  isExplicitlyArchived: Boolean!
  archivedAt: Datetime

  """Reads a single \`Person\` that is related to this \`RelationalDivider\`."""
  personByAuthorId: Person

  """
  Reads a single \`RelationalItem\` that is related to this \`RelationalDivider\`.
  """
  relationalItemByParentId: RelationalItem

  """
  Reads a single \`RelationalTopic\` that is related to this \`RelationalDivider\`.
  """
  relationalTopicByRootTopicId: RelationalTopic

  """Reads and enables pagination through a set of \`RelationalItem\`."""
  relationalItemsByParentId(
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
    condition: RelationalItemCondition

    """The method to use when ordering \`RelationalItem\`."""
    orderBy: [RelationalItemsOrderBy!] = [PRIMARY_KEY_ASC]
  ): RelationalItemsConnection!

  """
  Reads and enables pagination through a set of \`RelationalItemRelation\`.
  """
  relationalItemRelationsByChildId(
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
    condition: RelationalItemRelationCondition

    """The method to use when ordering \`RelationalItemRelation\`."""
    orderBy: [RelationalItemRelationsOrderBy!] = [PRIMARY_KEY_ASC]
  ): RelationalItemRelationsConnection!

  """
  Reads and enables pagination through a set of \`RelationalItemRelation\`.
  """
  relationalItemRelationsByParentId(
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
    condition: RelationalItemRelationCondition

    """The method to use when ordering \`RelationalItemRelation\`."""
    orderBy: [RelationalItemRelationsOrderBy!] = [PRIMARY_KEY_ASC]
  ): RelationalItemRelationsConnection!

  """
  Reads and enables pagination through a set of \`RelationalItemRelationCompositePk\`.
  """
  relationalItemRelationCompositePksByChildId(
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
    condition: RelationalItemRelationCompositePkCondition

    """The method to use when ordering \`RelationalItemRelationCompositePk\`."""
    orderBy: [RelationalItemRelationCompositePksOrderBy!] = [PRIMARY_KEY_ASC]
  ): RelationalItemRelationCompositePksConnection!

  """
  Reads and enables pagination through a set of \`RelationalItemRelationCompositePk\`.
  """
  relationalItemRelationCompositePksByParentId(
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
    condition: RelationalItemRelationCompositePkCondition

    """The method to use when ordering \`RelationalItemRelationCompositePk\`."""
    orderBy: [RelationalItemRelationCompositePksOrderBy!] = [PRIMARY_KEY_ASC]
  ): RelationalItemRelationCompositePksConnection!
}

type RelationalChecklist implements Node & RelationalItem {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  title: String!
  id: Int!
  type: ItemType!
  parentId: Int
  rootTopicId: Int
  authorId: Int!
  position: BigInt!
  createdAt: Datetime!
  updatedAt: Datetime!
  isExplicitlyArchived: Boolean!
  archivedAt: Datetime

  """Reads a single \`Person\` that is related to this \`RelationalChecklist\`."""
  personByAuthorId: Person

  """
  Reads a single \`RelationalItem\` that is related to this \`RelationalChecklist\`.
  """
  relationalItemByParentId: RelationalItem

  """
  Reads a single \`RelationalTopic\` that is related to this \`RelationalChecklist\`.
  """
  relationalTopicByRootTopicId: RelationalTopic

  """Reads and enables pagination through a set of \`RelationalItem\`."""
  relationalItemsByParentId(
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
    condition: RelationalItemCondition

    """The method to use when ordering \`RelationalItem\`."""
    orderBy: [RelationalItemsOrderBy!] = [PRIMARY_KEY_ASC]
  ): RelationalItemsConnection!

  """
  Reads and enables pagination through a set of \`RelationalItemRelation\`.
  """
  relationalItemRelationsByChildId(
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
    condition: RelationalItemRelationCondition

    """The method to use when ordering \`RelationalItemRelation\`."""
    orderBy: [RelationalItemRelationsOrderBy!] = [PRIMARY_KEY_ASC]
  ): RelationalItemRelationsConnection!

  """
  Reads and enables pagination through a set of \`RelationalItemRelation\`.
  """
  relationalItemRelationsByParentId(
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
    condition: RelationalItemRelationCondition

    """The method to use when ordering \`RelationalItemRelation\`."""
    orderBy: [RelationalItemRelationsOrderBy!] = [PRIMARY_KEY_ASC]
  ): RelationalItemRelationsConnection!

  """
  Reads and enables pagination through a set of \`RelationalItemRelationCompositePk\`.
  """
  relationalItemRelationCompositePksByChildId(
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
    condition: RelationalItemRelationCompositePkCondition

    """The method to use when ordering \`RelationalItemRelationCompositePk\`."""
    orderBy: [RelationalItemRelationCompositePksOrderBy!] = [PRIMARY_KEY_ASC]
  ): RelationalItemRelationCompositePksConnection!

  """
  Reads and enables pagination through a set of \`RelationalItemRelationCompositePk\`.
  """
  relationalItemRelationCompositePksByParentId(
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
    condition: RelationalItemRelationCompositePkCondition

    """The method to use when ordering \`RelationalItemRelationCompositePk\`."""
    orderBy: [RelationalItemRelationCompositePksOrderBy!] = [PRIMARY_KEY_ASC]
  ): RelationalItemRelationCompositePksConnection!
}

type RelationalChecklistItem implements Node & RelationalItem {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  description: String!
  note: String
  id: Int!
  type: ItemType!
  parentId: Int
  rootTopicId: Int
  authorId: Int!
  position: BigInt!
  createdAt: Datetime!
  updatedAt: Datetime!
  isExplicitlyArchived: Boolean!
  archivedAt: Datetime

  """
  Reads a single \`Person\` that is related to this \`RelationalChecklistItem\`.
  """
  personByAuthorId: Person

  """
  Reads a single \`RelationalItem\` that is related to this \`RelationalChecklistItem\`.
  """
  relationalItemByParentId: RelationalItem

  """
  Reads a single \`RelationalTopic\` that is related to this \`RelationalChecklistItem\`.
  """
  relationalTopicByRootTopicId: RelationalTopic

  """Reads and enables pagination through a set of \`RelationalItem\`."""
  relationalItemsByParentId(
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
    condition: RelationalItemCondition

    """The method to use when ordering \`RelationalItem\`."""
    orderBy: [RelationalItemsOrderBy!] = [PRIMARY_KEY_ASC]
  ): RelationalItemsConnection!

  """
  Reads and enables pagination through a set of \`RelationalItemRelation\`.
  """
  relationalItemRelationsByChildId(
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
    condition: RelationalItemRelationCondition

    """The method to use when ordering \`RelationalItemRelation\`."""
    orderBy: [RelationalItemRelationsOrderBy!] = [PRIMARY_KEY_ASC]
  ): RelationalItemRelationsConnection!

  """
  Reads and enables pagination through a set of \`RelationalItemRelation\`.
  """
  relationalItemRelationsByParentId(
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
    condition: RelationalItemRelationCondition

    """The method to use when ordering \`RelationalItemRelation\`."""
    orderBy: [RelationalItemRelationsOrderBy!] = [PRIMARY_KEY_ASC]
  ): RelationalItemRelationsConnection!

  """
  Reads and enables pagination through a set of \`RelationalItemRelationCompositePk\`.
  """
  relationalItemRelationCompositePksByChildId(
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
    condition: RelationalItemRelationCompositePkCondition

    """The method to use when ordering \`RelationalItemRelationCompositePk\`."""
    orderBy: [RelationalItemRelationCompositePksOrderBy!] = [PRIMARY_KEY_ASC]
  ): RelationalItemRelationCompositePksConnection!

  """
  Reads and enables pagination through a set of \`RelationalItemRelationCompositePk\`.
  """
  relationalItemRelationCompositePksByParentId(
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
    condition: RelationalItemRelationCompositePkCondition

    """The method to use when ordering \`RelationalItemRelationCompositePk\`."""
    orderBy: [RelationalItemRelationCompositePksOrderBy!] = [PRIMARY_KEY_ASC]
  ): RelationalItemRelationCompositePksConnection!
}

type MovieCollection implements Collection & Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: String!
  name: String!
  type: String!
  episodes: Int
  recommendations: JSON
  col001: String
  col002: String
  col003: String
  col004: String
  col005: String
  col006: String
  col007: String
  col008: String
  col009: String
  col010: String
  col011: String
  col012: String
  col013: String
  col014: String
  col015: String
  col016: String
  col017: String
  col018: String
  col019: String
  col020: String
  col021: String
  col022: String
  col023: String
  col024: String
  col025: String
  col026: String
  col027: String
  col028: String
  col029: String
  col030: String
  col031: String
  col032: String
  col033: String
  col034: String
  col035: String
  col036: String
  col037: String
  col038: String
  col039: String
  col040: String
  col041: String
  col042: String
  col043: String
  col044: String
  col045: String
  col046: String
  col047: String
  col048: String
  col049: String
  col050: String
  col051: String
  col052: String
  col053: String
  col054: String
  col055: String
  col056: String
  col057: String
  col058: String
  col059: String
  col060: String
  col061: String
  col062: String
  col063: String
  col064: String
  col065: String
  col066: String
  col067: String
  col068: String
  col069: String
  col070: String
  col071: String
  col072: String
  col073: String
  col074: String
  col075: String
  col076: String
  col077: String
  col078: String
  col079: String
  col080: String
  col081: String
  col082: String
  col083: String
  col084: String
  col085: String
  col086: String
  col087: String
  col088: String
  col089: String
  col090: String
  col091: String
  col092: String
  col093: String
  col094: String
  col095: String
  col096: String
  col097: String
  col098: String
  col099: String
  col100: String
  createdAt: Datetime
}

interface Collection implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: String!
  name: String!
  type: String!
  episodes: Int
  recommendations: JSON
  col001: String
  col002: String
  col003: String
  col004: String
  col005: String
  col006: String
  col007: String
  col008: String
  col009: String
  col010: String
  col011: String
  col012: String
  col013: String
  col014: String
  col015: String
  col016: String
  col017: String
  col018: String
  col019: String
  col020: String
  col021: String
  col022: String
  col023: String
  col024: String
  col025: String
  col026: String
  col027: String
  col028: String
  col029: String
  col030: String
  col031: String
  col032: String
  col033: String
  col034: String
  col035: String
  col036: String
  col037: String
  col038: String
  col039: String
  col040: String
  col041: String
  col042: String
  col043: String
  col044: String
  col045: String
  col046: String
  col047: String
  col048: String
  col049: String
  col050: String
  col051: String
  col052: String
  col053: String
  col054: String
  col055: String
  col056: String
  col057: String
  col058: String
  col059: String
  col060: String
  col061: String
  col062: String
  col063: String
  col064: String
  col065: String
  col066: String
  col067: String
  col068: String
  col069: String
  col070: String
  col071: String
  col072: String
  col073: String
  col074: String
  col075: String
  col076: String
  col077: String
  col078: String
  col079: String
  col080: String
  col081: String
  col082: String
  col083: String
  col084: String
  col085: String
  col086: String
  col087: String
  col088: String
  col089: String
  col090: String
  col091: String
  col092: String
  col093: String
  col094: String
  col095: String
  col096: String
  col097: String
  col098: String
  col099: String
  col100: String
  createdAt: Datetime
}

"""
A JavaScript object encoded in the JSON format as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).
"""
scalar JSON

type SeriesCollection implements Collection & Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: String!
  name: String!
  type: String!
  episodes: Int
  recommendations: JSON
  col001: String
  col002: String
  col003: String
  col004: String
  col005: String
  col006: String
  col007: String
  col008: String
  col009: String
  col010: String
  col011: String
  col012: String
  col013: String
  col014: String
  col015: String
  col016: String
  col017: String
  col018: String
  col019: String
  col020: String
  col021: String
  col022: String
  col023: String
  col024: String
  col025: String
  col026: String
  col027: String
  col028: String
  col029: String
  col030: String
  col031: String
  col032: String
  col033: String
  col034: String
  col035: String
  col036: String
  col037: String
  col038: String
  col039: String
  col040: String
  col041: String
  col042: String
  col043: String
  col044: String
  col045: String
  col046: String
  col047: String
  col048: String
  col049: String
  col050: String
  col051: String
  col052: String
  col053: String
  col054: String
  col055: String
  col056: String
  col057: String
  col058: String
  col059: String
  col060: String
  col061: String
  col062: String
  col063: String
  col064: String
  col065: String
  col066: String
  col067: String
  col068: String
  col069: String
  col070: String
  col071: String
  col072: String
  col073: String
  col074: String
  col075: String
  col076: String
  col077: String
  col078: String
  col079: String
  col080: String
  col081: String
  col082: String
  col083: String
  col084: String
  col085: String
  col086: String
  col087: String
  col088: String
  col089: String
  col090: String
  col091: String
  col092: String
  col093: String
  col094: String
  col095: String
  col096: String
  col097: String
  col098: String
  col099: String
  col100: String
  createdAt: Datetime
}

"""The root query type which gives access points into the data universe."""
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

  """Get a single \`Organization\`."""
  organizationByOrganizationId(organizationId: Int!): Organization

  """Get a single \`Organization\`."""
  organizationByName(name: String!): Organization

  """Get a single \`Person\`."""
  personByPersonId(personId: Int!): Person

  """Get a single \`Person\`."""
  personByUsername(username: String!): Person

  """Get a single \`Priority\`."""
  priorityById(id: Int!): Priority

  """Get a single \`RelationalChecklist\`."""
  relationalChecklistByChecklistItemId(checklistItemId: Int!): RelationalChecklist

  """Get a single \`RelationalItemRelationCompositePk\`."""
  relationalItemRelationCompositePkByParentIdAndChildId(parentId: Int!, childId: Int!): RelationalItemRelationCompositePk

  """Get a single \`RelationalTopic\`."""
  relationalTopicByTopicItemId(topicItemId: Int!): RelationalTopic

  """Get a single \`SingleTableItemRelationCompositePk\`."""
  singleTableItemRelationCompositePkByParentIdAndChildId(parentId: Int!, childId: Int!): SingleTableItemRelationCompositePk

  """Get a single \`RelationalChecklistItem\`."""
  relationalChecklistItemByChecklistItemItemId(checklistItemItemId: Int!): RelationalChecklistItem

  """Get a single \`RelationalDivider\`."""
  relationalDividerByDividerItemId(dividerItemId: Int!): RelationalDivider

  """Get a single \`RelationalItemRelation\`."""
  relationalItemRelationById(id: Int!): RelationalItemRelation

  """Get a single \`RelationalItemRelation\`."""
  relationalItemRelationByParentIdAndChildId(parentId: Int!, childId: Int!): RelationalItemRelation

  """Get a single \`SingleTableItemRelation\`."""
  singleTableItemRelationById(id: Int!): SingleTableItemRelation

  """Get a single \`SingleTableItemRelation\`."""
  singleTableItemRelationByParentIdAndChildId(parentId: Int!, childId: Int!): SingleTableItemRelation

  """Get a single \`LogEntry\`."""
  logEntryById(id: Int!): LogEntry

  """Get a single \`RelationalPost\`."""
  relationalPostByPostItemId(postItemId: Int!): RelationalPost

  """Get a single \`FirstPartyVulnerability\`."""
  firstPartyVulnerabilityById(id: Int!): FirstPartyVulnerability

  """Get a single \`ThirdPartyVulnerability\`."""
  thirdPartyVulnerabilityById(id: Int!): ThirdPartyVulnerability

  """Get a single \`AwsApplication\`."""
  awsApplicationById(id: Int!): AwsApplication

  """Get a single \`GcpApplication\`."""
  gcpApplicationById(id: Int!): GcpApplication
  relationalTopicByIdFn(id: Int): RelationalTopic

  """Reads and enables pagination through a set of \`SingleTableItem\`."""
  allSingleTables(
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
  ): SingleTableItemsConnection
  getSingleTableTopicById(id: Int): SingleTableTopic

  """Reads and enables pagination through a set of \`RelationalItem\`."""
  allRelationalItemsFn(
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
  ): RelationalItemsConnection
  relationalItemByIdFn(id: Int): RelationalItem

  """Reads a single \`SingleTableTopic\` using its globally unique \`ID\`."""
  singleTableTopic(
    """
    The globally unique \`ID\` to be used in selecting a single \`SingleTableTopic\`.
    """
    nodeId: ID!
  ): SingleTableTopic

  """Reads a single \`SingleTablePost\` using its globally unique \`ID\`."""
  singleTablePost(
    """
    The globally unique \`ID\` to be used in selecting a single \`SingleTablePost\`.
    """
    nodeId: ID!
  ): SingleTablePost

  """Reads a single \`SingleTableDivider\` using its globally unique \`ID\`."""
  singleTableDivider(
    """
    The globally unique \`ID\` to be used in selecting a single \`SingleTableDivider\`.
    """
    nodeId: ID!
  ): SingleTableDivider

  """Reads a single \`SingleTableChecklist\` using its globally unique \`ID\`."""
  singleTableChecklist(
    """
    The globally unique \`ID\` to be used in selecting a single \`SingleTableChecklist\`.
    """
    nodeId: ID!
  ): SingleTableChecklist

  """
  Reads a single \`SingleTableChecklistItem\` using its globally unique \`ID\`.
  """
  singleTableChecklistItem(
    """
    The globally unique \`ID\` to be used in selecting a single \`SingleTableChecklistItem\`.
    """
    nodeId: ID!
  ): SingleTableChecklistItem

  """Reads a single \`MovieCollection\` using its globally unique \`ID\`."""
  movieCollection(
    """
    The globally unique \`ID\` to be used in selecting a single \`MovieCollection\`.
    """
    nodeId: ID!
  ): MovieCollection

  """Reads a single \`SeriesCollection\` using its globally unique \`ID\`."""
  seriesCollection(
    """
    The globally unique \`ID\` to be used in selecting a single \`SeriesCollection\`.
    """
    nodeId: ID!
  ): SeriesCollection

  """Reads a single \`Organization\` using its globally unique \`ID\`."""
  organization(
    """
    The globally unique \`ID\` to be used in selecting a single \`Organization\`.
    """
    nodeId: ID!
  ): Organization

  """Reads a single \`Person\` using its globally unique \`ID\`."""
  person(
    """The globally unique \`ID\` to be used in selecting a single \`Person\`."""
    nodeId: ID!
  ): Person

  """Reads a single \`Priority\` using its globally unique \`ID\`."""
  priority(
    """The globally unique \`ID\` to be used in selecting a single \`Priority\`."""
    nodeId: ID!
  ): Priority

  """Reads a single \`RelationalChecklist\` using its globally unique \`ID\`."""
  relationalChecklist(
    """
    The globally unique \`ID\` to be used in selecting a single \`RelationalChecklist\`.
    """
    nodeId: ID!
  ): RelationalChecklist

  """
  Reads a single \`RelationalItemRelationCompositePk\` using its globally unique \`ID\`.
  """
  relationalItemRelationCompositePk(
    """
    The globally unique \`ID\` to be used in selecting a single \`RelationalItemRelationCompositePk\`.
    """
    nodeId: ID!
  ): RelationalItemRelationCompositePk

  """Reads a single \`RelationalTopic\` using its globally unique \`ID\`."""
  relationalTopic(
    """
    The globally unique \`ID\` to be used in selecting a single \`RelationalTopic\`.
    """
    nodeId: ID!
  ): RelationalTopic

  """
  Reads a single \`SingleTableItemRelationCompositePk\` using its globally unique \`ID\`.
  """
  singleTableItemRelationCompositePk(
    """
    The globally unique \`ID\` to be used in selecting a single \`SingleTableItemRelationCompositePk\`.
    """
    nodeId: ID!
  ): SingleTableItemRelationCompositePk

  """
  Reads a single \`RelationalChecklistItem\` using its globally unique \`ID\`.
  """
  relationalChecklistItem(
    """
    The globally unique \`ID\` to be used in selecting a single \`RelationalChecklistItem\`.
    """
    nodeId: ID!
  ): RelationalChecklistItem

  """Reads a single \`RelationalDivider\` using its globally unique \`ID\`."""
  relationalDivider(
    """
    The globally unique \`ID\` to be used in selecting a single \`RelationalDivider\`.
    """
    nodeId: ID!
  ): RelationalDivider

  """
  Reads a single \`RelationalItemRelation\` using its globally unique \`ID\`.
  """
  relationalItemRelation(
    """
    The globally unique \`ID\` to be used in selecting a single \`RelationalItemRelation\`.
    """
    nodeId: ID!
  ): RelationalItemRelation

  """
  Reads a single \`SingleTableItemRelation\` using its globally unique \`ID\`.
  """
  singleTableItemRelation(
    """
    The globally unique \`ID\` to be used in selecting a single \`SingleTableItemRelation\`.
    """
    nodeId: ID!
  ): SingleTableItemRelation

  """Reads a single \`LogEntry\` using its globally unique \`ID\`."""
  logEntry(
    """The globally unique \`ID\` to be used in selecting a single \`LogEntry\`."""
    nodeId: ID!
  ): LogEntry

  """Reads a single \`RelationalPost\` using its globally unique \`ID\`."""
  relationalPost(
    """
    The globally unique \`ID\` to be used in selecting a single \`RelationalPost\`.
    """
    nodeId: ID!
  ): RelationalPost

  """
  Reads a single \`FirstPartyVulnerability\` using its globally unique \`ID\`.
  """
  firstPartyVulnerability(
    """
    The globally unique \`ID\` to be used in selecting a single \`FirstPartyVulnerability\`.
    """
    nodeId: ID!
  ): FirstPartyVulnerability

  """
  Reads a single \`ThirdPartyVulnerability\` using its globally unique \`ID\`.
  """
  thirdPartyVulnerability(
    """
    The globally unique \`ID\` to be used in selecting a single \`ThirdPartyVulnerability\`.
    """
    nodeId: ID!
  ): ThirdPartyVulnerability

  """Reads a single \`AwsApplication\` using its globally unique \`ID\`."""
  awsApplication(
    """
    The globally unique \`ID\` to be used in selecting a single \`AwsApplication\`.
    """
    nodeId: ID!
  ): AwsApplication

  """Reads a single \`GcpApplication\` using its globally unique \`ID\`."""
  gcpApplication(
    """
    The globally unique \`ID\` to be used in selecting a single \`GcpApplication\`.
    """
    nodeId: ID!
  ): GcpApplication
  allVulnerabilities(
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
    condition: VulnerabilityCondition

    """Filter results to only those of the given types"""
    only: [VulnerabilityType!] @deprecated(reason: "EXPERIMENTAL")

    """The method to use when ordering \`Vulnerability\`."""
    orderBy: [VulnerabilitiesOrderBy!]
  ): VulnerabilitiesConnection
  allApplications(
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
    condition: ApplicationCondition

    """Filter results to only those of the given types"""
    only: [ApplicationType!] @deprecated(reason: "EXPERIMENTAL")

    """The method to use when ordering \`Application\`."""
    orderBy: [ApplicationsOrderBy!]
  ): ApplicationsConnection
  allZeroImplementations(
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
    condition: ZeroImplementationCondition

    """The method to use when ordering \`ZeroImplementation\`."""
    orderBy: [ZeroImplementationsOrderBy!]
  ): ZeroImplementationsConnection

  """Reads and enables pagination through a set of \`Organization\`."""
  allOrganizations(
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
    condition: OrganizationCondition

    """The method to use when ordering \`Organization\`."""
    orderBy: [OrganizationsOrderBy!] = [PRIMARY_KEY_ASC]
  ): OrganizationsConnection

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

  """Reads and enables pagination through a set of \`Priority\`."""
  allPriorities(
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
  ): PrioritiesConnection

  """Reads and enables pagination through a set of \`RelationalChecklist\`."""
  allRelationalChecklists(
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
    condition: RelationalChecklistCondition

    """The method to use when ordering \`RelationalChecklist\`."""
    orderBy: [RelationalChecklistsOrderBy!] = [PRIMARY_KEY_ASC]
  ): RelationalChecklistsConnection

  """
  Reads and enables pagination through a set of \`RelationalItemRelationCompositePk\`.
  """
  allRelationalItemRelationCompositePks(
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
    condition: RelationalItemRelationCompositePkCondition

    """The method to use when ordering \`RelationalItemRelationCompositePk\`."""
    orderBy: [RelationalItemRelationCompositePksOrderBy!] = [PRIMARY_KEY_ASC]
  ): RelationalItemRelationCompositePksConnection

  """Reads and enables pagination through a set of \`RelationalTopic\`."""
  allRelationalTopics(
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
    condition: RelationalTopicCondition

    """The method to use when ordering \`RelationalTopic\`."""
    orderBy: [RelationalTopicsOrderBy!] = [PRIMARY_KEY_ASC]
  ): RelationalTopicsConnection

  """
  Reads and enables pagination through a set of \`SingleTableItemRelationCompositePk\`.
  """
  allSingleTableItemRelationCompositePks(
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
    condition: SingleTableItemRelationCompositePkCondition

    """The method to use when ordering \`SingleTableItemRelationCompositePk\`."""
    orderBy: [SingleTableItemRelationCompositePksOrderBy!] = [PRIMARY_KEY_ASC]
  ): SingleTableItemRelationCompositePksConnection

  """
  Reads and enables pagination through a set of \`RelationalChecklistItem\`.
  """
  allRelationalChecklistItems(
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
    condition: RelationalChecklistItemCondition

    """The method to use when ordering \`RelationalChecklistItem\`."""
    orderBy: [RelationalChecklistItemsOrderBy!] = [PRIMARY_KEY_ASC]
  ): RelationalChecklistItemsConnection

  """Reads and enables pagination through a set of \`RelationalDivider\`."""
  allRelationalDividers(
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
    condition: RelationalDividerCondition

    """The method to use when ordering \`RelationalDivider\`."""
    orderBy: [RelationalDividersOrderBy!] = [PRIMARY_KEY_ASC]
  ): RelationalDividersConnection

  """
  Reads and enables pagination through a set of \`RelationalItemRelation\`.
  """
  allRelationalItemRelations(
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
    condition: RelationalItemRelationCondition

    """The method to use when ordering \`RelationalItemRelation\`."""
    orderBy: [RelationalItemRelationsOrderBy!] = [PRIMARY_KEY_ASC]
  ): RelationalItemRelationsConnection

  """
  Reads and enables pagination through a set of \`SingleTableItemRelation\`.
  """
  allSingleTableItemRelations(
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
    condition: SingleTableItemRelationCondition

    """The method to use when ordering \`SingleTableItemRelation\`."""
    orderBy: [SingleTableItemRelationsOrderBy!] = [PRIMARY_KEY_ASC]
  ): SingleTableItemRelationsConnection

  """Reads and enables pagination through a set of \`LogEntry\`."""
  allLogEntries(
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
    condition: LogEntryCondition

    """The method to use when ordering \`LogEntry\`."""
    orderBy: [LogEntriesOrderBy!] = [PRIMARY_KEY_ASC]
  ): LogEntriesConnection

  """Reads and enables pagination through a set of \`RelationalPost\`."""
  allRelationalPosts(
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
    condition: RelationalPostCondition

    """The method to use when ordering \`RelationalPost\`."""
    orderBy: [RelationalPostsOrderBy!] = [PRIMARY_KEY_ASC]
  ): RelationalPostsConnection

  """
  Reads and enables pagination through a set of \`FirstPartyVulnerability\`.
  """
  allFirstPartyVulnerabilities(
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
    condition: FirstPartyVulnerabilityCondition

    """The method to use when ordering \`FirstPartyVulnerability\`."""
    orderBy: [FirstPartyVulnerabilitiesOrderBy!] = [PRIMARY_KEY_ASC]
  ): FirstPartyVulnerabilitiesConnection

  """
  Reads and enables pagination through a set of \`ThirdPartyVulnerability\`.
  """
  allThirdPartyVulnerabilities(
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
    condition: ThirdPartyVulnerabilityCondition

    """The method to use when ordering \`ThirdPartyVulnerability\`."""
    orderBy: [ThirdPartyVulnerabilitiesOrderBy!] = [PRIMARY_KEY_ASC]
  ): ThirdPartyVulnerabilitiesConnection

  """Reads and enables pagination through a set of \`AwsApplication\`."""
  allAwsApplications(
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
    condition: AwsApplicationCondition

    """The method to use when ordering \`AwsApplication\`."""
    orderBy: [AwsApplicationsOrderBy!] = [PRIMARY_KEY_ASC]
  ): AwsApplicationsConnection

  """Reads and enables pagination through a set of \`GcpApplication\`."""
  allGcpApplications(
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
    condition: GcpApplicationCondition

    """The method to use when ordering \`GcpApplication\`."""
    orderBy: [GcpApplicationsOrderBy!] = [PRIMARY_KEY_ASC]
  ): GcpApplicationsConnection

  """Reads and enables pagination through a set of \`SingleTableItem\`."""
  allSingleTableItems(
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
    condition: SingleTableItemCondition

    """The method to use when ordering \`SingleTableItem\`."""
    orderBy: [SingleTableItemsOrderBy!] = [PRIMARY_KEY_ASC]
  ): SingleTableItemsConnection

  """Reads and enables pagination through a set of \`RelationalItem\`."""
  allRelationalItems(
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
    condition: RelationalItemCondition

    """The method to use when ordering \`RelationalItem\`."""
    orderBy: [RelationalItemsOrderBy!] = [PRIMARY_KEY_ASC]
  ): RelationalItemsConnection

  """Reads and enables pagination through a set of \`Collection\`."""
  allCollections(
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
    condition: CollectionCondition

    """The method to use when ordering \`Collection\`."""
    orderBy: [CollectionsOrderBy!] = [PRIMARY_KEY_ASC]
  ): CollectionsConnection
}

type FirstPartyVulnerability implements Node & Vulnerability {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  cvssScoreInt: Int
  id: Int!
  name: String!
  cvssScore: Float!
  teamName: String

  """Reads and enables pagination through a set of \`Application\`."""
  applications(
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
    condition: ApplicationCondition

    """Filter results to only those of the given types"""
    only: [ApplicationType!] @deprecated(reason: "EXPERIMENTAL")

    """The method to use when ordering \`Application\`."""
    orderBy: [ApplicationsOrderBy!]
  ): ApplicationsConnection!

  """Reads and enables pagination through a set of \`PersonOrOrganization\`."""
  owners: PersonOrOrganizationConnection!
}

type ThirdPartyVulnerability implements Node & Vulnerability {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  cvssScoreInt: Int
  id: Int!
  name: String!
  cvssScore: Float!
  vendorName: String

  """Reads and enables pagination through a set of \`Application\`."""
  applications(
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
    condition: ApplicationCondition

    """Filter results to only those of the given types"""
    only: [ApplicationType!] @deprecated(reason: "EXPERIMENTAL")

    """The method to use when ordering \`Application\`."""
    orderBy: [ApplicationsOrderBy!]
  ): ApplicationsConnection!

  """Reads and enables pagination through a set of \`PersonOrOrganization\`."""
  owners: PersonOrOrganizationConnection!
}

"""A connection to a list of \`ZeroImplementation\` values."""
type ZeroImplementationsConnection {
  """A list of \`ZeroImplementation\` objects."""
  nodes: [ZeroImplementation]!

  """
  A list of edges which contains the \`ZeroImplementation\` and cursor to aid in pagination.
  """
  edges: [ZeroImplementationsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """
  The count of *all* \`ZeroImplementation\` you could get from the connection.
  """
  totalCount: Int!
}

interface ZeroImplementation implements Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  nodeId: ID!
  id: Int
  name: String
}

"""A \`ZeroImplementation\` edge in the connection."""
type ZeroImplementationsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`ZeroImplementation\` at the end of the edge."""
  node: ZeroImplementation
}

"""
A condition to be used against \`ZeroImplementation\` object types. All fields are
tested for equality and combined with a logical ‘and.’
"""
input ZeroImplementationCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`name\` field."""
  name: String
}

"""Methods to use when ordering \`ZeroImplementation\`."""
enum ZeroImplementationsOrderBy {
  NATURAL
  ID_ASC
  ID_DESC
  NAME_ASC
  NAME_DESC
}

"""A connection to a list of \`Organization\` values."""
type OrganizationsConnection {
  """A list of \`Organization\` objects."""
  nodes: [Organization]!

  """
  A list of edges which contains the \`Organization\` and cursor to aid in pagination.
  """
  edges: [OrganizationsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Organization\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Organization\` edge in the connection."""
type OrganizationsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Organization\` at the end of the edge."""
  node: Organization
}

"""
A condition to be used against \`Organization\` object types. All fields are
tested for equality and combined with a logical ‘and.’
"""
input OrganizationCondition {
  """Checks for equality with the object’s \`organizationId\` field."""
  organizationId: Int

  """Checks for equality with the object’s \`name\` field."""
  name: String
}

"""Methods to use when ordering \`Organization\`."""
enum OrganizationsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ORGANIZATION_ID_ASC
  ORGANIZATION_ID_DESC
  NAME_ASC
  NAME_DESC
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
  """Checks for equality with the object’s \`personId\` field."""
  personId: Int

  """Checks for equality with the object’s \`username\` field."""
  username: String
}

"""Methods to use when ordering \`Person\`."""
enum PeopleOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  PERSON_ID_ASC
  PERSON_ID_DESC
  USERNAME_ASC
  USERNAME_DESC
}

"""A connection to a list of \`Priority\` values."""
type PrioritiesConnection {
  """A list of \`Priority\` objects."""
  nodes: [Priority]!

  """
  A list of edges which contains the \`Priority\` and cursor to aid in pagination.
  """
  edges: [PrioritiesEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Priority\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Priority\` edge in the connection."""
type PrioritiesEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Priority\` at the end of the edge."""
  node: Priority
}

"""A connection to a list of \`RelationalChecklist\` values."""
type RelationalChecklistsConnection {
  """A list of \`RelationalChecklist\` objects."""
  nodes: [RelationalChecklist]!

  """
  A list of edges which contains the \`RelationalChecklist\` and cursor to aid in pagination.
  """
  edges: [RelationalChecklistsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """
  The count of *all* \`RelationalChecklist\` you could get from the connection.
  """
  totalCount: Int!
}

"""A \`RelationalChecklist\` edge in the connection."""
type RelationalChecklistsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`RelationalChecklist\` at the end of the edge."""
  node: RelationalChecklist
}

"""
A condition to be used against \`RelationalChecklist\` object types. All fields
are tested for equality and combined with a logical ‘and.’
"""
input RelationalChecklistCondition {
  """Checks for equality with the object’s \`title\` field."""
  title: String

  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`type\` field."""
  type: ItemType

  """Checks for equality with the object’s \`parentId\` field."""
  parentId: Int

  """Checks for equality with the object’s \`rootTopicId\` field."""
  rootTopicId: Int

  """Checks for equality with the object’s \`authorId\` field."""
  authorId: Int

  """Checks for equality with the object’s \`position\` field."""
  position: BigInt

  """Checks for equality with the object’s \`createdAt\` field."""
  createdAt: Datetime

  """Checks for equality with the object’s \`updatedAt\` field."""
  updatedAt: Datetime

  """Checks for equality with the object’s \`isExplicitlyArchived\` field."""
  isExplicitlyArchived: Boolean

  """Checks for equality with the object’s \`archivedAt\` field."""
  archivedAt: Datetime
}

"""Methods to use when ordering \`RelationalChecklist\`."""
enum RelationalChecklistsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  TITLE_ASC
  TITLE_DESC
  ID_ASC
  ID_DESC
  TYPE_ASC
  TYPE_DESC
  PARENT_ID_ASC
  PARENT_ID_DESC
  ROOT_TOPIC_ID_ASC
  ROOT_TOPIC_ID_DESC
  AUTHOR_ID_ASC
  AUTHOR_ID_DESC
  POSITION_ASC
  POSITION_DESC
  CREATED_AT_ASC
  CREATED_AT_DESC
  UPDATED_AT_ASC
  UPDATED_AT_DESC
  IS_EXPLICITLY_ARCHIVED_ASC
  IS_EXPLICITLY_ARCHIVED_DESC
  ARCHIVED_AT_ASC
  ARCHIVED_AT_DESC
}

"""A connection to a list of \`RelationalTopic\` values."""
type RelationalTopicsConnection {
  """A list of \`RelationalTopic\` objects."""
  nodes: [RelationalTopic]!

  """
  A list of edges which contains the \`RelationalTopic\` and cursor to aid in pagination.
  """
  edges: [RelationalTopicsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """
  The count of *all* \`RelationalTopic\` you could get from the connection.
  """
  totalCount: Int!
}

"""A \`RelationalTopic\` edge in the connection."""
type RelationalTopicsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`RelationalTopic\` at the end of the edge."""
  node: RelationalTopic
}

"""
A condition to be used against \`RelationalTopic\` object types. All fields are
tested for equality and combined with a logical ‘and.’
"""
input RelationalTopicCondition {
  """Checks for equality with the object’s \`title\` field."""
  title: String

  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`type\` field."""
  type: ItemType

  """Checks for equality with the object’s \`parentId\` field."""
  parentId: Int

  """Checks for equality with the object’s \`rootTopicId\` field."""
  rootTopicId: Int

  """Checks for equality with the object’s \`authorId\` field."""
  authorId: Int

  """Checks for equality with the object’s \`position\` field."""
  position: BigInt

  """Checks for equality with the object’s \`createdAt\` field."""
  createdAt: Datetime

  """Checks for equality with the object’s \`updatedAt\` field."""
  updatedAt: Datetime

  """Checks for equality with the object’s \`isExplicitlyArchived\` field."""
  isExplicitlyArchived: Boolean

  """Checks for equality with the object’s \`archivedAt\` field."""
  archivedAt: Datetime
}

"""Methods to use when ordering \`RelationalTopic\`."""
enum RelationalTopicsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  TITLE_ASC
  TITLE_DESC
  ID_ASC
  ID_DESC
  TYPE_ASC
  TYPE_DESC
  PARENT_ID_ASC
  PARENT_ID_DESC
  ROOT_TOPIC_ID_ASC
  ROOT_TOPIC_ID_DESC
  AUTHOR_ID_ASC
  AUTHOR_ID_DESC
  POSITION_ASC
  POSITION_DESC
  CREATED_AT_ASC
  CREATED_AT_DESC
  UPDATED_AT_ASC
  UPDATED_AT_DESC
  IS_EXPLICITLY_ARCHIVED_ASC
  IS_EXPLICITLY_ARCHIVED_DESC
  ARCHIVED_AT_ASC
  ARCHIVED_AT_DESC
}

"""A connection to a list of \`RelationalChecklistItem\` values."""
type RelationalChecklistItemsConnection {
  """A list of \`RelationalChecklistItem\` objects."""
  nodes: [RelationalChecklistItem]!

  """
  A list of edges which contains the \`RelationalChecklistItem\` and cursor to aid in pagination.
  """
  edges: [RelationalChecklistItemsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """
  The count of *all* \`RelationalChecklistItem\` you could get from the connection.
  """
  totalCount: Int!
}

"""A \`RelationalChecklistItem\` edge in the connection."""
type RelationalChecklistItemsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`RelationalChecklistItem\` at the end of the edge."""
  node: RelationalChecklistItem
}

"""
A condition to be used against \`RelationalChecklistItem\` object types. All
fields are tested for equality and combined with a logical ‘and.’
"""
input RelationalChecklistItemCondition {
  """Checks for equality with the object’s \`description\` field."""
  description: String

  """Checks for equality with the object’s \`note\` field."""
  note: String

  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`type\` field."""
  type: ItemType

  """Checks for equality with the object’s \`parentId\` field."""
  parentId: Int

  """Checks for equality with the object’s \`rootTopicId\` field."""
  rootTopicId: Int

  """Checks for equality with the object’s \`authorId\` field."""
  authorId: Int

  """Checks for equality with the object’s \`position\` field."""
  position: BigInt

  """Checks for equality with the object’s \`createdAt\` field."""
  createdAt: Datetime

  """Checks for equality with the object’s \`updatedAt\` field."""
  updatedAt: Datetime

  """Checks for equality with the object’s \`isExplicitlyArchived\` field."""
  isExplicitlyArchived: Boolean

  """Checks for equality with the object’s \`archivedAt\` field."""
  archivedAt: Datetime
}

"""Methods to use when ordering \`RelationalChecklistItem\`."""
enum RelationalChecklistItemsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  DESCRIPTION_ASC
  DESCRIPTION_DESC
  NOTE_ASC
  NOTE_DESC
  ID_ASC
  ID_DESC
  TYPE_ASC
  TYPE_DESC
  PARENT_ID_ASC
  PARENT_ID_DESC
  ROOT_TOPIC_ID_ASC
  ROOT_TOPIC_ID_DESC
  AUTHOR_ID_ASC
  AUTHOR_ID_DESC
  POSITION_ASC
  POSITION_DESC
  CREATED_AT_ASC
  CREATED_AT_DESC
  UPDATED_AT_ASC
  UPDATED_AT_DESC
  IS_EXPLICITLY_ARCHIVED_ASC
  IS_EXPLICITLY_ARCHIVED_DESC
  ARCHIVED_AT_ASC
  ARCHIVED_AT_DESC
}

"""A connection to a list of \`RelationalDivider\` values."""
type RelationalDividersConnection {
  """A list of \`RelationalDivider\` objects."""
  nodes: [RelationalDivider]!

  """
  A list of edges which contains the \`RelationalDivider\` and cursor to aid in pagination.
  """
  edges: [RelationalDividersEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """
  The count of *all* \`RelationalDivider\` you could get from the connection.
  """
  totalCount: Int!
}

"""A \`RelationalDivider\` edge in the connection."""
type RelationalDividersEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`RelationalDivider\` at the end of the edge."""
  node: RelationalDivider
}

"""
A condition to be used against \`RelationalDivider\` object types. All fields are
tested for equality and combined with a logical ‘and.’
"""
input RelationalDividerCondition {
  """Checks for equality with the object’s \`title\` field."""
  title: String

  """Checks for equality with the object’s \`color\` field."""
  color: String

  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`type\` field."""
  type: ItemType

  """Checks for equality with the object’s \`parentId\` field."""
  parentId: Int

  """Checks for equality with the object’s \`rootTopicId\` field."""
  rootTopicId: Int

  """Checks for equality with the object’s \`authorId\` field."""
  authorId: Int

  """Checks for equality with the object’s \`position\` field."""
  position: BigInt

  """Checks for equality with the object’s \`createdAt\` field."""
  createdAt: Datetime

  """Checks for equality with the object’s \`updatedAt\` field."""
  updatedAt: Datetime

  """Checks for equality with the object’s \`isExplicitlyArchived\` field."""
  isExplicitlyArchived: Boolean

  """Checks for equality with the object’s \`archivedAt\` field."""
  archivedAt: Datetime
}

"""Methods to use when ordering \`RelationalDivider\`."""
enum RelationalDividersOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  TITLE_ASC
  TITLE_DESC
  COLOR_ASC
  COLOR_DESC
  ID_ASC
  ID_DESC
  TYPE_ASC
  TYPE_DESC
  PARENT_ID_ASC
  PARENT_ID_DESC
  ROOT_TOPIC_ID_ASC
  ROOT_TOPIC_ID_DESC
  AUTHOR_ID_ASC
  AUTHOR_ID_DESC
  POSITION_ASC
  POSITION_DESC
  CREATED_AT_ASC
  CREATED_AT_DESC
  UPDATED_AT_ASC
  UPDATED_AT_DESC
  IS_EXPLICITLY_ARCHIVED_ASC
  IS_EXPLICITLY_ARCHIVED_DESC
  ARCHIVED_AT_ASC
  ARCHIVED_AT_DESC
}

"""A connection to a list of \`RelationalPost\` values."""
type RelationalPostsConnection {
  """A list of \`RelationalPost\` objects."""
  nodes: [RelationalPost]!

  """
  A list of edges which contains the \`RelationalPost\` and cursor to aid in pagination.
  """
  edges: [RelationalPostsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`RelationalPost\` you could get from the connection."""
  totalCount: Int!
}

"""A \`RelationalPost\` edge in the connection."""
type RelationalPostsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`RelationalPost\` at the end of the edge."""
  node: RelationalPost
}

"""
A condition to be used against \`RelationalPost\` object types. All fields are
tested for equality and combined with a logical ‘and.’
"""
input RelationalPostCondition {
  """Checks for equality with the object’s \`title\` field."""
  title: String

  """Checks for equality with the object’s \`description\` field."""
  description: String

  """Checks for equality with the object’s \`note\` field."""
  note: String

  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`type\` field."""
  type: ItemType

  """Checks for equality with the object’s \`parentId\` field."""
  parentId: Int

  """Checks for equality with the object’s \`rootTopicId\` field."""
  rootTopicId: Int

  """Checks for equality with the object’s \`authorId\` field."""
  authorId: Int

  """Checks for equality with the object’s \`position\` field."""
  position: BigInt

  """Checks for equality with the object’s \`createdAt\` field."""
  createdAt: Datetime

  """Checks for equality with the object’s \`updatedAt\` field."""
  updatedAt: Datetime

  """Checks for equality with the object’s \`isExplicitlyArchived\` field."""
  isExplicitlyArchived: Boolean

  """Checks for equality with the object’s \`archivedAt\` field."""
  archivedAt: Datetime
}

"""Methods to use when ordering \`RelationalPost\`."""
enum RelationalPostsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  TITLE_ASC
  TITLE_DESC
  DESCRIPTION_ASC
  DESCRIPTION_DESC
  NOTE_ASC
  NOTE_DESC
  ID_ASC
  ID_DESC
  TYPE_ASC
  TYPE_DESC
  PARENT_ID_ASC
  PARENT_ID_DESC
  ROOT_TOPIC_ID_ASC
  ROOT_TOPIC_ID_DESC
  AUTHOR_ID_ASC
  AUTHOR_ID_DESC
  POSITION_ASC
  POSITION_DESC
  CREATED_AT_ASC
  CREATED_AT_DESC
  UPDATED_AT_ASC
  UPDATED_AT_DESC
  IS_EXPLICITLY_ARCHIVED_ASC
  IS_EXPLICITLY_ARCHIVED_DESC
  ARCHIVED_AT_ASC
  ARCHIVED_AT_DESC
}

"""A connection to a list of \`FirstPartyVulnerability\` values."""
type FirstPartyVulnerabilitiesConnection {
  """A list of \`FirstPartyVulnerability\` objects."""
  nodes: [FirstPartyVulnerability]!

  """
  A list of edges which contains the \`FirstPartyVulnerability\` and cursor to aid in pagination.
  """
  edges: [FirstPartyVulnerabilitiesEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """
  The count of *all* \`FirstPartyVulnerability\` you could get from the connection.
  """
  totalCount: Int!
}

"""A \`FirstPartyVulnerability\` edge in the connection."""
type FirstPartyVulnerabilitiesEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`FirstPartyVulnerability\` at the end of the edge."""
  node: FirstPartyVulnerability
}

"""
A condition to be used against \`FirstPartyVulnerability\` object types. All
fields are tested for equality and combined with a logical ‘and.’
"""
input FirstPartyVulnerabilityCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`name\` field."""
  name: String

  """Checks for equality with the object’s \`cvssScore\` field."""
  cvssScore: Float

  """Checks for equality with the object’s \`teamName\` field."""
  teamName: String
}

"""Methods to use when ordering \`FirstPartyVulnerability\`."""
enum FirstPartyVulnerabilitiesOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  NAME_ASC
  NAME_DESC
  CVSS_SCORE_ASC
  CVSS_SCORE_DESC
  TEAM_NAME_ASC
  TEAM_NAME_DESC
}

"""A connection to a list of \`ThirdPartyVulnerability\` values."""
type ThirdPartyVulnerabilitiesConnection {
  """A list of \`ThirdPartyVulnerability\` objects."""
  nodes: [ThirdPartyVulnerability]!

  """
  A list of edges which contains the \`ThirdPartyVulnerability\` and cursor to aid in pagination.
  """
  edges: [ThirdPartyVulnerabilitiesEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """
  The count of *all* \`ThirdPartyVulnerability\` you could get from the connection.
  """
  totalCount: Int!
}

"""A \`ThirdPartyVulnerability\` edge in the connection."""
type ThirdPartyVulnerabilitiesEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`ThirdPartyVulnerability\` at the end of the edge."""
  node: ThirdPartyVulnerability
}

"""
A condition to be used against \`ThirdPartyVulnerability\` object types. All
fields are tested for equality and combined with a logical ‘and.’
"""
input ThirdPartyVulnerabilityCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: Int

  """Checks for equality with the object’s \`name\` field."""
  name: String

  """Checks for equality with the object’s \`cvssScore\` field."""
  cvssScore: Float

  """Checks for equality with the object’s \`vendorName\` field."""
  vendorName: String
}

"""Methods to use when ordering \`ThirdPartyVulnerability\`."""
enum ThirdPartyVulnerabilitiesOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  NAME_ASC
  NAME_DESC
  CVSS_SCORE_ASC
  CVSS_SCORE_DESC
  VENDOR_NAME_ASC
  VENDOR_NAME_DESC
}

"""A connection to a list of \`Collection\` values."""
type CollectionsConnection {
  """A list of \`Collection\` objects."""
  nodes: [Collection]!

  """
  A list of edges which contains the \`Collection\` and cursor to aid in pagination.
  """
  edges: [CollectionsEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Collection\` you could get from the connection."""
  totalCount: Int!
}

"""A \`Collection\` edge in the connection."""
type CollectionsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Collection\` at the end of the edge."""
  node: Collection
}

"""
A condition to be used against \`Collection\` object types. All fields are tested
for equality and combined with a logical ‘and.’
"""
input CollectionCondition {
  """Checks for equality with the object’s \`id\` field."""
  id: String

  """Checks for equality with the object’s \`name\` field."""
  name: String

  """Checks for equality with the object’s \`type\` field."""
  type: String

  """Checks for equality with the object’s \`episodes\` field."""
  episodes: Int

  """Checks for equality with the object’s \`recommendations\` field."""
  recommendations: JSON

  """Checks for equality with the object’s \`col001\` field."""
  col001: String

  """Checks for equality with the object’s \`col002\` field."""
  col002: String

  """Checks for equality with the object’s \`col003\` field."""
  col003: String

  """Checks for equality with the object’s \`col004\` field."""
  col004: String

  """Checks for equality with the object’s \`col005\` field."""
  col005: String

  """Checks for equality with the object’s \`col006\` field."""
  col006: String

  """Checks for equality with the object’s \`col007\` field."""
  col007: String

  """Checks for equality with the object’s \`col008\` field."""
  col008: String

  """Checks for equality with the object’s \`col009\` field."""
  col009: String

  """Checks for equality with the object’s \`col010\` field."""
  col010: String

  """Checks for equality with the object’s \`col011\` field."""
  col011: String

  """Checks for equality with the object’s \`col012\` field."""
  col012: String

  """Checks for equality with the object’s \`col013\` field."""
  col013: String

  """Checks for equality with the object’s \`col014\` field."""
  col014: String

  """Checks for equality with the object’s \`col015\` field."""
  col015: String

  """Checks for equality with the object’s \`col016\` field."""
  col016: String

  """Checks for equality with the object’s \`col017\` field."""
  col017: String

  """Checks for equality with the object’s \`col018\` field."""
  col018: String

  """Checks for equality with the object’s \`col019\` field."""
  col019: String

  """Checks for equality with the object’s \`col020\` field."""
  col020: String

  """Checks for equality with the object’s \`col021\` field."""
  col021: String

  """Checks for equality with the object’s \`col022\` field."""
  col022: String

  """Checks for equality with the object’s \`col023\` field."""
  col023: String

  """Checks for equality with the object’s \`col024\` field."""
  col024: String

  """Checks for equality with the object’s \`col025\` field."""
  col025: String

  """Checks for equality with the object’s \`col026\` field."""
  col026: String

  """Checks for equality with the object’s \`col027\` field."""
  col027: String

  """Checks for equality with the object’s \`col028\` field."""
  col028: String

  """Checks for equality with the object’s \`col029\` field."""
  col029: String

  """Checks for equality with the object’s \`col030\` field."""
  col030: String

  """Checks for equality with the object’s \`col031\` field."""
  col031: String

  """Checks for equality with the object’s \`col032\` field."""
  col032: String

  """Checks for equality with the object’s \`col033\` field."""
  col033: String

  """Checks for equality with the object’s \`col034\` field."""
  col034: String

  """Checks for equality with the object’s \`col035\` field."""
  col035: String

  """Checks for equality with the object’s \`col036\` field."""
  col036: String

  """Checks for equality with the object’s \`col037\` field."""
  col037: String

  """Checks for equality with the object’s \`col038\` field."""
  col038: String

  """Checks for equality with the object’s \`col039\` field."""
  col039: String

  """Checks for equality with the object’s \`col040\` field."""
  col040: String

  """Checks for equality with the object’s \`col041\` field."""
  col041: String

  """Checks for equality with the object’s \`col042\` field."""
  col042: String

  """Checks for equality with the object’s \`col043\` field."""
  col043: String

  """Checks for equality with the object’s \`col044\` field."""
  col044: String

  """Checks for equality with the object’s \`col045\` field."""
  col045: String

  """Checks for equality with the object’s \`col046\` field."""
  col046: String

  """Checks for equality with the object’s \`col047\` field."""
  col047: String

  """Checks for equality with the object’s \`col048\` field."""
  col048: String

  """Checks for equality with the object’s \`col049\` field."""
  col049: String

  """Checks for equality with the object’s \`col050\` field."""
  col050: String

  """Checks for equality with the object’s \`col051\` field."""
  col051: String

  """Checks for equality with the object’s \`col052\` field."""
  col052: String

  """Checks for equality with the object’s \`col053\` field."""
  col053: String

  """Checks for equality with the object’s \`col054\` field."""
  col054: String

  """Checks for equality with the object’s \`col055\` field."""
  col055: String

  """Checks for equality with the object’s \`col056\` field."""
  col056: String

  """Checks for equality with the object’s \`col057\` field."""
  col057: String

  """Checks for equality with the object’s \`col058\` field."""
  col058: String

  """Checks for equality with the object’s \`col059\` field."""
  col059: String

  """Checks for equality with the object’s \`col060\` field."""
  col060: String

  """Checks for equality with the object’s \`col061\` field."""
  col061: String

  """Checks for equality with the object’s \`col062\` field."""
  col062: String

  """Checks for equality with the object’s \`col063\` field."""
  col063: String

  """Checks for equality with the object’s \`col064\` field."""
  col064: String

  """Checks for equality with the object’s \`col065\` field."""
  col065: String

  """Checks for equality with the object’s \`col066\` field."""
  col066: String

  """Checks for equality with the object’s \`col067\` field."""
  col067: String

  """Checks for equality with the object’s \`col068\` field."""
  col068: String

  """Checks for equality with the object’s \`col069\` field."""
  col069: String

  """Checks for equality with the object’s \`col070\` field."""
  col070: String

  """Checks for equality with the object’s \`col071\` field."""
  col071: String

  """Checks for equality with the object’s \`col072\` field."""
  col072: String

  """Checks for equality with the object’s \`col073\` field."""
  col073: String

  """Checks for equality with the object’s \`col074\` field."""
  col074: String

  """Checks for equality with the object’s \`col075\` field."""
  col075: String

  """Checks for equality with the object’s \`col076\` field."""
  col076: String

  """Checks for equality with the object’s \`col077\` field."""
  col077: String

  """Checks for equality with the object’s \`col078\` field."""
  col078: String

  """Checks for equality with the object’s \`col079\` field."""
  col079: String

  """Checks for equality with the object’s \`col080\` field."""
  col080: String

  """Checks for equality with the object’s \`col081\` field."""
  col081: String

  """Checks for equality with the object’s \`col082\` field."""
  col082: String

  """Checks for equality with the object’s \`col083\` field."""
  col083: String

  """Checks for equality with the object’s \`col084\` field."""
  col084: String

  """Checks for equality with the object’s \`col085\` field."""
  col085: String

  """Checks for equality with the object’s \`col086\` field."""
  col086: String

  """Checks for equality with the object’s \`col087\` field."""
  col087: String

  """Checks for equality with the object’s \`col088\` field."""
  col088: String

  """Checks for equality with the object’s \`col089\` field."""
  col089: String

  """Checks for equality with the object’s \`col090\` field."""
  col090: String

  """Checks for equality with the object’s \`col091\` field."""
  col091: String

  """Checks for equality with the object’s \`col092\` field."""
  col092: String

  """Checks for equality with the object’s \`col093\` field."""
  col093: String

  """Checks for equality with the object’s \`col094\` field."""
  col094: String

  """Checks for equality with the object’s \`col095\` field."""
  col095: String

  """Checks for equality with the object’s \`col096\` field."""
  col096: String

  """Checks for equality with the object’s \`col097\` field."""
  col097: String

  """Checks for equality with the object’s \`col098\` field."""
  col098: String

  """Checks for equality with the object’s \`col099\` field."""
  col099: String

  """Checks for equality with the object’s \`col100\` field."""
  col100: String

  """Checks for equality with the object’s \`createdAt\` field."""
  createdAt: Datetime
}

"""Methods to use when ordering \`Collection\`."""
enum CollectionsOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ID_ASC
  ID_DESC
  NAME_ASC
  NAME_DESC
  TYPE_ASC
  TYPE_DESC
  EPISODES_ASC
  EPISODES_DESC
  RECOMMENDATIONS_ASC
  RECOMMENDATIONS_DESC
  COL_001_ASC
  COL_001_DESC
  COL_002_ASC
  COL_002_DESC
  COL_003_ASC
  COL_003_DESC
  COL_004_ASC
  COL_004_DESC
  COL_005_ASC
  COL_005_DESC
  COL_006_ASC
  COL_006_DESC
  COL_007_ASC
  COL_007_DESC
  COL_008_ASC
  COL_008_DESC
  COL_009_ASC
  COL_009_DESC
  COL_010_ASC
  COL_010_DESC
  COL_011_ASC
  COL_011_DESC
  COL_012_ASC
  COL_012_DESC
  COL_013_ASC
  COL_013_DESC
  COL_014_ASC
  COL_014_DESC
  COL_015_ASC
  COL_015_DESC
  COL_016_ASC
  COL_016_DESC
  COL_017_ASC
  COL_017_DESC
  COL_018_ASC
  COL_018_DESC
  COL_019_ASC
  COL_019_DESC
  COL_020_ASC
  COL_020_DESC
  COL_021_ASC
  COL_021_DESC
  COL_022_ASC
  COL_022_DESC
  COL_023_ASC
  COL_023_DESC
  COL_024_ASC
  COL_024_DESC
  COL_025_ASC
  COL_025_DESC
  COL_026_ASC
  COL_026_DESC
  COL_027_ASC
  COL_027_DESC
  COL_028_ASC
  COL_028_DESC
  COL_029_ASC
  COL_029_DESC
  COL_030_ASC
  COL_030_DESC
  COL_031_ASC
  COL_031_DESC
  COL_032_ASC
  COL_032_DESC
  COL_033_ASC
  COL_033_DESC
  COL_034_ASC
  COL_034_DESC
  COL_035_ASC
  COL_035_DESC
  COL_036_ASC
  COL_036_DESC
  COL_037_ASC
  COL_037_DESC
  COL_038_ASC
  COL_038_DESC
  COL_039_ASC
  COL_039_DESC
  COL_040_ASC
  COL_040_DESC
  COL_041_ASC
  COL_041_DESC
  COL_042_ASC
  COL_042_DESC
  COL_043_ASC
  COL_043_DESC
  COL_044_ASC
  COL_044_DESC
  COL_045_ASC
  COL_045_DESC
  COL_046_ASC
  COL_046_DESC
  COL_047_ASC
  COL_047_DESC
  COL_048_ASC
  COL_048_DESC
  COL_049_ASC
  COL_049_DESC
  COL_050_ASC
  COL_050_DESC
  COL_051_ASC
  COL_051_DESC
  COL_052_ASC
  COL_052_DESC
  COL_053_ASC
  COL_053_DESC
  COL_054_ASC
  COL_054_DESC
  COL_055_ASC
  COL_055_DESC
  COL_056_ASC
  COL_056_DESC
  COL_057_ASC
  COL_057_DESC
  COL_058_ASC
  COL_058_DESC
  COL_059_ASC
  COL_059_DESC
  COL_060_ASC
  COL_060_DESC
  COL_061_ASC
  COL_061_DESC
  COL_062_ASC
  COL_062_DESC
  COL_063_ASC
  COL_063_DESC
  COL_064_ASC
  COL_064_DESC
  COL_065_ASC
  COL_065_DESC
  COL_066_ASC
  COL_066_DESC
  COL_067_ASC
  COL_067_DESC
  COL_068_ASC
  COL_068_DESC
  COL_069_ASC
  COL_069_DESC
  COL_070_ASC
  COL_070_DESC
  COL_071_ASC
  COL_071_DESC
  COL_072_ASC
  COL_072_DESC
  COL_073_ASC
  COL_073_DESC
  COL_074_ASC
  COL_074_DESC
  COL_075_ASC
  COL_075_DESC
  COL_076_ASC
  COL_076_DESC
  COL_077_ASC
  COL_077_DESC
  COL_078_ASC
  COL_078_DESC
  COL_079_ASC
  COL_079_DESC
  COL_080_ASC
  COL_080_DESC
  COL_081_ASC
  COL_081_DESC
  COL_082_ASC
  COL_082_DESC
  COL_083_ASC
  COL_083_DESC
  COL_084_ASC
  COL_084_DESC
  COL_085_ASC
  COL_085_DESC
  COL_086_ASC
  COL_086_DESC
  COL_087_ASC
  COL_087_DESC
  COL_088_ASC
  COL_088_DESC
  COL_089_ASC
  COL_089_DESC
  COL_090_ASC
  COL_090_DESC
  COL_091_ASC
  COL_091_DESC
  COL_092_ASC
  COL_092_DESC
  COL_093_ASC
  COL_093_DESC
  COL_094_ASC
  COL_094_DESC
  COL_095_ASC
  COL_095_DESC
  COL_096_ASC
  COL_096_DESC
  COL_097_ASC
  COL_097_DESC
  COL_098_ASC
  COL_098_DESC
  COL_099_ASC
  COL_099_DESC
  COL_100_ASC
  COL_100_DESC
  CREATED_AT_ASC
  CREATED_AT_DESC
}

"""
The root mutation type which contains root level fields which mutate data.
"""
type Mutation {
  customDeleteRelationalItem(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CustomDeleteRelationalItemInput!
  ): CustomDeleteRelationalItemPayload

  """Creates a single \`Organization\`."""
  createOrganization(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateOrganizationInput!
  ): CreateOrganizationPayload

  """Creates a single \`Person\`."""
  createPerson(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreatePersonInput!
  ): CreatePersonPayload

  """Creates a single \`RelationalItemRelationCompositePk\`."""
  createRelationalItemRelationCompositePk(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateRelationalItemRelationCompositePkInput!
  ): CreateRelationalItemRelationCompositePkPayload

  """Creates a single \`SingleTableItemRelationCompositePk\`."""
  createSingleTableItemRelationCompositePk(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateSingleTableItemRelationCompositePkInput!
  ): CreateSingleTableItemRelationCompositePkPayload

  """Creates a single \`RelationalItemRelation\`."""
  createRelationalItemRelation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateRelationalItemRelationInput!
  ): CreateRelationalItemRelationPayload

  """Creates a single \`SingleTableItemRelation\`."""
  createSingleTableItemRelation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateSingleTableItemRelationInput!
  ): CreateSingleTableItemRelationPayload

  """Creates a single \`LogEntry\`."""
  createLogEntry(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateLogEntryInput!
  ): CreateLogEntryPayload

  """Creates a single \`FirstPartyVulnerability\`."""
  createFirstPartyVulnerability(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateFirstPartyVulnerabilityInput!
  ): CreateFirstPartyVulnerabilityPayload

  """Creates a single \`ThirdPartyVulnerability\`."""
  createThirdPartyVulnerability(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateThirdPartyVulnerabilityInput!
  ): CreateThirdPartyVulnerabilityPayload

  """Creates a single \`AwsApplication\`."""
  createAwsApplication(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateAwsApplicationInput!
  ): CreateAwsApplicationPayload

  """Creates a single \`GcpApplication\`."""
  createGcpApplication(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateGcpApplicationInput!
  ): CreateGcpApplicationPayload

  """
  Updates a single \`Organization\` using its globally unique id and a patch.
  """
  updateOrganization(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateOrganizationInput!
  ): UpdateOrganizationPayload

  """Updates a single \`Organization\` using a unique key and a patch."""
  updateOrganizationByOrganizationId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateOrganizationByOrganizationIdInput!
  ): UpdateOrganizationPayload

  """Updates a single \`Organization\` using a unique key and a patch."""
  updateOrganizationByName(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateOrganizationByNameInput!
  ): UpdateOrganizationPayload

  """Updates a single \`Person\` using its globally unique id and a patch."""
  updatePerson(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdatePersonInput!
  ): UpdatePersonPayload

  """Updates a single \`Person\` using a unique key and a patch."""
  updatePersonByPersonId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdatePersonByPersonIdInput!
  ): UpdatePersonPayload

  """Updates a single \`Person\` using a unique key and a patch."""
  updatePersonByUsername(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdatePersonByUsernameInput!
  ): UpdatePersonPayload

  """
  Updates a single \`RelationalItemRelationCompositePk\` using its globally unique id and a patch.
  """
  updateRelationalItemRelationCompositePk(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateRelationalItemRelationCompositePkInput!
  ): UpdateRelationalItemRelationCompositePkPayload

  """
  Updates a single \`RelationalItemRelationCompositePk\` using a unique key and a patch.
  """
  updateRelationalItemRelationCompositePkByParentIdAndChildId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateRelationalItemRelationCompositePkByParentIdAndChildIdInput!
  ): UpdateRelationalItemRelationCompositePkPayload

  """
  Updates a single \`SingleTableItemRelationCompositePk\` using its globally unique id and a patch.
  """
  updateSingleTableItemRelationCompositePk(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateSingleTableItemRelationCompositePkInput!
  ): UpdateSingleTableItemRelationCompositePkPayload

  """
  Updates a single \`SingleTableItemRelationCompositePk\` using a unique key and a patch.
  """
  updateSingleTableItemRelationCompositePkByParentIdAndChildId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateSingleTableItemRelationCompositePkByParentIdAndChildIdInput!
  ): UpdateSingleTableItemRelationCompositePkPayload

  """
  Updates a single \`RelationalItemRelation\` using its globally unique id and a patch.
  """
  updateRelationalItemRelation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateRelationalItemRelationInput!
  ): UpdateRelationalItemRelationPayload

  """
  Updates a single \`RelationalItemRelation\` using a unique key and a patch.
  """
  updateRelationalItemRelationById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateRelationalItemRelationByIdInput!
  ): UpdateRelationalItemRelationPayload

  """
  Updates a single \`RelationalItemRelation\` using a unique key and a patch.
  """
  updateRelationalItemRelationByParentIdAndChildId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateRelationalItemRelationByParentIdAndChildIdInput!
  ): UpdateRelationalItemRelationPayload

  """
  Updates a single \`SingleTableItemRelation\` using its globally unique id and a patch.
  """
  updateSingleTableItemRelation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateSingleTableItemRelationInput!
  ): UpdateSingleTableItemRelationPayload

  """
  Updates a single \`SingleTableItemRelation\` using a unique key and a patch.
  """
  updateSingleTableItemRelationById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateSingleTableItemRelationByIdInput!
  ): UpdateSingleTableItemRelationPayload

  """
  Updates a single \`SingleTableItemRelation\` using a unique key and a patch.
  """
  updateSingleTableItemRelationByParentIdAndChildId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateSingleTableItemRelationByParentIdAndChildIdInput!
  ): UpdateSingleTableItemRelationPayload

  """Updates a single \`LogEntry\` using its globally unique id and a patch."""
  updateLogEntry(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateLogEntryInput!
  ): UpdateLogEntryPayload

  """Updates a single \`LogEntry\` using a unique key and a patch."""
  updateLogEntryById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateLogEntryByIdInput!
  ): UpdateLogEntryPayload

  """
  Updates a single \`FirstPartyVulnerability\` using its globally unique id and a patch.
  """
  updateFirstPartyVulnerability(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateFirstPartyVulnerabilityInput!
  ): UpdateFirstPartyVulnerabilityPayload

  """
  Updates a single \`FirstPartyVulnerability\` using a unique key and a patch.
  """
  updateFirstPartyVulnerabilityById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateFirstPartyVulnerabilityByIdInput!
  ): UpdateFirstPartyVulnerabilityPayload

  """
  Updates a single \`ThirdPartyVulnerability\` using its globally unique id and a patch.
  """
  updateThirdPartyVulnerability(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateThirdPartyVulnerabilityInput!
  ): UpdateThirdPartyVulnerabilityPayload

  """
  Updates a single \`ThirdPartyVulnerability\` using a unique key and a patch.
  """
  updateThirdPartyVulnerabilityById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateThirdPartyVulnerabilityByIdInput!
  ): UpdateThirdPartyVulnerabilityPayload

  """
  Updates a single \`AwsApplication\` using its globally unique id and a patch.
  """
  updateAwsApplication(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateAwsApplicationInput!
  ): UpdateAwsApplicationPayload

  """Updates a single \`AwsApplication\` using a unique key and a patch."""
  updateAwsApplicationById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateAwsApplicationByIdInput!
  ): UpdateAwsApplicationPayload

  """
  Updates a single \`GcpApplication\` using its globally unique id and a patch.
  """
  updateGcpApplication(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateGcpApplicationInput!
  ): UpdateGcpApplicationPayload

  """Updates a single \`GcpApplication\` using a unique key and a patch."""
  updateGcpApplicationById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateGcpApplicationByIdInput!
  ): UpdateGcpApplicationPayload

  """Deletes a single \`Organization\` using its globally unique id."""
  deleteOrganization(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteOrganizationInput!
  ): DeleteOrganizationPayload

  """Deletes a single \`Organization\` using a unique key."""
  deleteOrganizationByOrganizationId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteOrganizationByOrganizationIdInput!
  ): DeleteOrganizationPayload

  """Deletes a single \`Organization\` using a unique key."""
  deleteOrganizationByName(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteOrganizationByNameInput!
  ): DeleteOrganizationPayload

  """Deletes a single \`Person\` using its globally unique id."""
  deletePerson(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeletePersonInput!
  ): DeletePersonPayload

  """Deletes a single \`Person\` using a unique key."""
  deletePersonByPersonId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeletePersonByPersonIdInput!
  ): DeletePersonPayload

  """Deletes a single \`Person\` using a unique key."""
  deletePersonByUsername(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeletePersonByUsernameInput!
  ): DeletePersonPayload

  """
  Deletes a single \`RelationalItemRelationCompositePk\` using its globally unique id.
  """
  deleteRelationalItemRelationCompositePk(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteRelationalItemRelationCompositePkInput!
  ): DeleteRelationalItemRelationCompositePkPayload

  """
  Deletes a single \`RelationalItemRelationCompositePk\` using a unique key.
  """
  deleteRelationalItemRelationCompositePkByParentIdAndChildId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteRelationalItemRelationCompositePkByParentIdAndChildIdInput!
  ): DeleteRelationalItemRelationCompositePkPayload

  """
  Deletes a single \`SingleTableItemRelationCompositePk\` using its globally unique id.
  """
  deleteSingleTableItemRelationCompositePk(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteSingleTableItemRelationCompositePkInput!
  ): DeleteSingleTableItemRelationCompositePkPayload

  """
  Deletes a single \`SingleTableItemRelationCompositePk\` using a unique key.
  """
  deleteSingleTableItemRelationCompositePkByParentIdAndChildId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteSingleTableItemRelationCompositePkByParentIdAndChildIdInput!
  ): DeleteSingleTableItemRelationCompositePkPayload

  """
  Deletes a single \`RelationalItemRelation\` using its globally unique id.
  """
  deleteRelationalItemRelation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteRelationalItemRelationInput!
  ): DeleteRelationalItemRelationPayload

  """Deletes a single \`RelationalItemRelation\` using a unique key."""
  deleteRelationalItemRelationById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteRelationalItemRelationByIdInput!
  ): DeleteRelationalItemRelationPayload

  """Deletes a single \`RelationalItemRelation\` using a unique key."""
  deleteRelationalItemRelationByParentIdAndChildId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteRelationalItemRelationByParentIdAndChildIdInput!
  ): DeleteRelationalItemRelationPayload

  """
  Deletes a single \`SingleTableItemRelation\` using its globally unique id.
  """
  deleteSingleTableItemRelation(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteSingleTableItemRelationInput!
  ): DeleteSingleTableItemRelationPayload

  """Deletes a single \`SingleTableItemRelation\` using a unique key."""
  deleteSingleTableItemRelationById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteSingleTableItemRelationByIdInput!
  ): DeleteSingleTableItemRelationPayload

  """Deletes a single \`SingleTableItemRelation\` using a unique key."""
  deleteSingleTableItemRelationByParentIdAndChildId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteSingleTableItemRelationByParentIdAndChildIdInput!
  ): DeleteSingleTableItemRelationPayload

  """Deletes a single \`LogEntry\` using its globally unique id."""
  deleteLogEntry(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteLogEntryInput!
  ): DeleteLogEntryPayload

  """Deletes a single \`LogEntry\` using a unique key."""
  deleteLogEntryById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteLogEntryByIdInput!
  ): DeleteLogEntryPayload

  """
  Deletes a single \`FirstPartyVulnerability\` using its globally unique id.
  """
  deleteFirstPartyVulnerability(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteFirstPartyVulnerabilityInput!
  ): DeleteFirstPartyVulnerabilityPayload

  """Deletes a single \`FirstPartyVulnerability\` using a unique key."""
  deleteFirstPartyVulnerabilityById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteFirstPartyVulnerabilityByIdInput!
  ): DeleteFirstPartyVulnerabilityPayload

  """
  Deletes a single \`ThirdPartyVulnerability\` using its globally unique id.
  """
  deleteThirdPartyVulnerability(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteThirdPartyVulnerabilityInput!
  ): DeleteThirdPartyVulnerabilityPayload

  """Deletes a single \`ThirdPartyVulnerability\` using a unique key."""
  deleteThirdPartyVulnerabilityById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteThirdPartyVulnerabilityByIdInput!
  ): DeleteThirdPartyVulnerabilityPayload

  """Deletes a single \`AwsApplication\` using its globally unique id."""
  deleteAwsApplication(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteAwsApplicationInput!
  ): DeleteAwsApplicationPayload

  """Deletes a single \`AwsApplication\` using a unique key."""
  deleteAwsApplicationById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteAwsApplicationByIdInput!
  ): DeleteAwsApplicationPayload

  """Deletes a single \`GcpApplication\` using its globally unique id."""
  deleteGcpApplication(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteGcpApplicationInput!
  ): DeleteGcpApplicationPayload

  """Deletes a single \`GcpApplication\` using a unique key."""
  deleteGcpApplicationById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteGcpApplicationByIdInput!
  ): DeleteGcpApplicationPayload
}

"""The output of our \`customDeleteRelationalItem\` mutation."""
type CustomDeleteRelationalItemPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String
  boolean: Boolean

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query
}

"""All input for the \`customDeleteRelationalItem\` mutation."""
input CustomDeleteRelationalItemInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  nodeId: ID
}

"""The output of our create \`Organization\` mutation."""
type CreateOrganizationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Organization\` that was created by this mutation."""
  organization: Organization

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Organization\`. May be used by Relay 1."""
  organizationEdge(
    """The method to use when ordering \`Organization\`."""
    orderBy: [OrganizationsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): OrganizationsEdge
}

"""All input for the create \`Organization\` mutation."""
input CreateOrganizationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`Organization\` to be created by this mutation."""
  organization: OrganizationInput!
}

"""An input for mutations affecting \`Organization\`"""
input OrganizationInput {
  organizationId: Int
  name: String!
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
  personId: Int
  username: String!
}

"""The output of our create \`RelationalItemRelationCompositePk\` mutation."""
type CreateRelationalItemRelationCompositePkPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """
  The \`RelationalItemRelationCompositePk\` that was created by this mutation.
  """
  relationalItemRelationCompositePk: RelationalItemRelationCompositePk

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """
  An edge for our \`RelationalItemRelationCompositePk\`. May be used by Relay 1.
  """
  relationalItemRelationCompositePkEdge(
    """The method to use when ordering \`RelationalItemRelationCompositePk\`."""
    orderBy: [RelationalItemRelationCompositePksOrderBy!]! = [PRIMARY_KEY_ASC]
  ): RelationalItemRelationCompositePksEdge

  """
  Reads a single \`RelationalItem\` that is related to this \`RelationalItemRelationCompositePk\`.
  """
  relationalItemByChildId: RelationalItem

  """
  Reads a single \`RelationalItem\` that is related to this \`RelationalItemRelationCompositePk\`.
  """
  relationalItemByParentId: RelationalItem
}

"""All input for the create \`RelationalItemRelationCompositePk\` mutation."""
input CreateRelationalItemRelationCompositePkInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The \`RelationalItemRelationCompositePk\` to be created by this mutation.
  """
  relationalItemRelationCompositePk: RelationalItemRelationCompositePkInput!
}

"""An input for mutations affecting \`RelationalItemRelationCompositePk\`"""
input RelationalItemRelationCompositePkInput {
  parentId: Int!
  childId: Int!
}

"""
The output of our create \`SingleTableItemRelationCompositePk\` mutation.
"""
type CreateSingleTableItemRelationCompositePkPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """
  The \`SingleTableItemRelationCompositePk\` that was created by this mutation.
  """
  singleTableItemRelationCompositePk: SingleTableItemRelationCompositePk

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """
  An edge for our \`SingleTableItemRelationCompositePk\`. May be used by Relay 1.
  """
  singleTableItemRelationCompositePkEdge(
    """The method to use when ordering \`SingleTableItemRelationCompositePk\`."""
    orderBy: [SingleTableItemRelationCompositePksOrderBy!]! = [PRIMARY_KEY_ASC]
  ): SingleTableItemRelationCompositePksEdge

  """
  Reads a single \`SingleTableItem\` that is related to this \`SingleTableItemRelationCompositePk\`.
  """
  singleTableItemByChildId: SingleTableItem

  """
  Reads a single \`SingleTableItem\` that is related to this \`SingleTableItemRelationCompositePk\`.
  """
  singleTableItemByParentId: SingleTableItem
}

"""
All input for the create \`SingleTableItemRelationCompositePk\` mutation.
"""
input CreateSingleTableItemRelationCompositePkInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The \`SingleTableItemRelationCompositePk\` to be created by this mutation.
  """
  singleTableItemRelationCompositePk: SingleTableItemRelationCompositePkInput!
}

"""An input for mutations affecting \`SingleTableItemRelationCompositePk\`"""
input SingleTableItemRelationCompositePkInput {
  parentId: Int!
  childId: Int!
}

"""The output of our create \`RelationalItemRelation\` mutation."""
type CreateRelationalItemRelationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`RelationalItemRelation\` that was created by this mutation."""
  relationalItemRelation: RelationalItemRelation

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`RelationalItemRelation\`. May be used by Relay 1."""
  relationalItemRelationEdge(
    """The method to use when ordering \`RelationalItemRelation\`."""
    orderBy: [RelationalItemRelationsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): RelationalItemRelationsEdge

  """
  Reads a single \`RelationalItem\` that is related to this \`RelationalItemRelation\`.
  """
  relationalItemByChildId: RelationalItem

  """
  Reads a single \`RelationalItem\` that is related to this \`RelationalItemRelation\`.
  """
  relationalItemByParentId: RelationalItem
}

"""All input for the create \`RelationalItemRelation\` mutation."""
input CreateRelationalItemRelationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`RelationalItemRelation\` to be created by this mutation."""
  relationalItemRelation: RelationalItemRelationInput!
}

"""An input for mutations affecting \`RelationalItemRelation\`"""
input RelationalItemRelationInput {
  id: Int
  parentId: Int!
  childId: Int!
}

"""The output of our create \`SingleTableItemRelation\` mutation."""
type CreateSingleTableItemRelationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`SingleTableItemRelation\` that was created by this mutation."""
  singleTableItemRelation: SingleTableItemRelation

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`SingleTableItemRelation\`. May be used by Relay 1."""
  singleTableItemRelationEdge(
    """The method to use when ordering \`SingleTableItemRelation\`."""
    orderBy: [SingleTableItemRelationsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): SingleTableItemRelationsEdge

  """
  Reads a single \`SingleTableItem\` that is related to this \`SingleTableItemRelation\`.
  """
  singleTableItemByChildId: SingleTableItem

  """
  Reads a single \`SingleTableItem\` that is related to this \`SingleTableItemRelation\`.
  """
  singleTableItemByParentId: SingleTableItem
}

"""All input for the create \`SingleTableItemRelation\` mutation."""
input CreateSingleTableItemRelationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`SingleTableItemRelation\` to be created by this mutation."""
  singleTableItemRelation: SingleTableItemRelationInput!
}

"""An input for mutations affecting \`SingleTableItemRelation\`"""
input SingleTableItemRelationInput {
  id: Int
  parentId: Int!
  childId: Int!
}

"""The output of our create \`LogEntry\` mutation."""
type CreateLogEntryPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`LogEntry\` that was created by this mutation."""
  logEntry: LogEntry

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`LogEntry\`. May be used by Relay 1."""
  logEntryEdge(
    """The method to use when ordering \`LogEntry\`."""
    orderBy: [LogEntriesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): LogEntriesEdge

  """Reads a single \`Organization\` that is related to this \`LogEntry\`."""
  organizationByOrganizationId: Organization

  """Reads a single \`Person\` that is related to this \`LogEntry\`."""
  personByPersonId: Person
}

"""All input for the create \`LogEntry\` mutation."""
input CreateLogEntryInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`LogEntry\` to be created by this mutation."""
  logEntry: LogEntryInput!
}

"""An input for mutations affecting \`LogEntry\`"""
input LogEntryInput {
  id: Int
  personId: Int
  organizationId: Int
  text: String!
}

"""The output of our create \`FirstPartyVulnerability\` mutation."""
type CreateFirstPartyVulnerabilityPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`FirstPartyVulnerability\` that was created by this mutation."""
  firstPartyVulnerability: FirstPartyVulnerability

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`FirstPartyVulnerability\`. May be used by Relay 1."""
  firstPartyVulnerabilityEdge(
    """The method to use when ordering \`FirstPartyVulnerability\`."""
    orderBy: [FirstPartyVulnerabilitiesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): FirstPartyVulnerabilitiesEdge
}

"""All input for the create \`FirstPartyVulnerability\` mutation."""
input CreateFirstPartyVulnerabilityInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`FirstPartyVulnerability\` to be created by this mutation."""
  firstPartyVulnerability: FirstPartyVulnerabilityInput!
}

"""An input for mutations affecting \`FirstPartyVulnerability\`"""
input FirstPartyVulnerabilityInput {
  id: Int!
  name: String!
  cvssScore: Float!
  teamName: String
}

"""The output of our create \`ThirdPartyVulnerability\` mutation."""
type CreateThirdPartyVulnerabilityPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`ThirdPartyVulnerability\` that was created by this mutation."""
  thirdPartyVulnerability: ThirdPartyVulnerability

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`ThirdPartyVulnerability\`. May be used by Relay 1."""
  thirdPartyVulnerabilityEdge(
    """The method to use when ordering \`ThirdPartyVulnerability\`."""
    orderBy: [ThirdPartyVulnerabilitiesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ThirdPartyVulnerabilitiesEdge
}

"""All input for the create \`ThirdPartyVulnerability\` mutation."""
input CreateThirdPartyVulnerabilityInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`ThirdPartyVulnerability\` to be created by this mutation."""
  thirdPartyVulnerability: ThirdPartyVulnerabilityInput!
}

"""An input for mutations affecting \`ThirdPartyVulnerability\`"""
input ThirdPartyVulnerabilityInput {
  id: Int!
  name: String!
  cvssScore: Float!
  vendorName: String
}

"""The output of our create \`AwsApplication\` mutation."""
type CreateAwsApplicationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`AwsApplication\` that was created by this mutation."""
  awsApplication: AwsApplication

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`AwsApplication\`. May be used by Relay 1."""
  awsApplicationEdge(
    """The method to use when ordering \`AwsApplication\`."""
    orderBy: [AwsApplicationsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): AwsApplicationsEdge

  """
  Reads a single \`Organization\` that is related to this \`AwsApplication\`.
  """
  organizationByOrganizationId: Organization

  """Reads a single \`Person\` that is related to this \`AwsApplication\`."""
  personByPersonId: Person
}

"""All input for the create \`AwsApplication\` mutation."""
input CreateAwsApplicationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`AwsApplication\` to be created by this mutation."""
  awsApplication: AwsApplicationInput!
}

"""An input for mutations affecting \`AwsApplication\`"""
input AwsApplicationInput {
  id: Int!
  name: String!
  lastDeployed: Datetime
  personId: Int
  organizationId: Int
  awsId: String
}

"""The output of our create \`GcpApplication\` mutation."""
type CreateGcpApplicationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`GcpApplication\` that was created by this mutation."""
  gcpApplication: GcpApplication

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`GcpApplication\`. May be used by Relay 1."""
  gcpApplicationEdge(
    """The method to use when ordering \`GcpApplication\`."""
    orderBy: [GcpApplicationsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): GcpApplicationsEdge

  """
  Reads a single \`Organization\` that is related to this \`GcpApplication\`.
  """
  organizationByOrganizationId: Organization

  """Reads a single \`Person\` that is related to this \`GcpApplication\`."""
  personByPersonId: Person
}

"""All input for the create \`GcpApplication\` mutation."""
input CreateGcpApplicationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`GcpApplication\` to be created by this mutation."""
  gcpApplication: GcpApplicationInput!
}

"""An input for mutations affecting \`GcpApplication\`"""
input GcpApplicationInput {
  id: Int!
  name: String!
  lastDeployed: Datetime
  personId: Int
  organizationId: Int
  gcpId: String
}

"""The output of our update \`Organization\` mutation."""
type UpdateOrganizationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Organization\` that was updated by this mutation."""
  organization: Organization

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Organization\`. May be used by Relay 1."""
  organizationEdge(
    """The method to use when ordering \`Organization\`."""
    orderBy: [OrganizationsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): OrganizationsEdge
}

"""All input for the \`updateOrganization\` mutation."""
input UpdateOrganizationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Organization\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`Organization\` being updated.
  """
  organizationPatch: OrganizationPatch!
}

"""
Represents an update to a \`Organization\`. Fields that are set will be updated.
"""
input OrganizationPatch {
  organizationId: Int
  name: String
}

"""All input for the \`updateOrganizationByOrganizationId\` mutation."""
input UpdateOrganizationByOrganizationIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  organizationId: Int!

  """
  An object where the defined keys will be set on the \`Organization\` being updated.
  """
  organizationPatch: OrganizationPatch!
}

"""All input for the \`updateOrganizationByName\` mutation."""
input UpdateOrganizationByNameInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  name: String!

  """
  An object where the defined keys will be set on the \`Organization\` being updated.
  """
  organizationPatch: OrganizationPatch!
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
  personId: Int
  username: String
}

"""All input for the \`updatePersonByPersonId\` mutation."""
input UpdatePersonByPersonIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  personId: Int!

  """
  An object where the defined keys will be set on the \`Person\` being updated.
  """
  personPatch: PersonPatch!
}

"""All input for the \`updatePersonByUsername\` mutation."""
input UpdatePersonByUsernameInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  username: String!

  """
  An object where the defined keys will be set on the \`Person\` being updated.
  """
  personPatch: PersonPatch!
}

"""The output of our update \`RelationalItemRelationCompositePk\` mutation."""
type UpdateRelationalItemRelationCompositePkPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """
  The \`RelationalItemRelationCompositePk\` that was updated by this mutation.
  """
  relationalItemRelationCompositePk: RelationalItemRelationCompositePk

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """
  An edge for our \`RelationalItemRelationCompositePk\`. May be used by Relay 1.
  """
  relationalItemRelationCompositePkEdge(
    """The method to use when ordering \`RelationalItemRelationCompositePk\`."""
    orderBy: [RelationalItemRelationCompositePksOrderBy!]! = [PRIMARY_KEY_ASC]
  ): RelationalItemRelationCompositePksEdge

  """
  Reads a single \`RelationalItem\` that is related to this \`RelationalItemRelationCompositePk\`.
  """
  relationalItemByChildId: RelationalItem

  """
  Reads a single \`RelationalItem\` that is related to this \`RelationalItemRelationCompositePk\`.
  """
  relationalItemByParentId: RelationalItem
}

"""All input for the \`updateRelationalItemRelationCompositePk\` mutation."""
input UpdateRelationalItemRelationCompositePkInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`RelationalItemRelationCompositePk\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`RelationalItemRelationCompositePk\` being updated.
  """
  relationalItemRelationCompositePkPatch: RelationalItemRelationCompositePkPatch!
}

"""
Represents an update to a \`RelationalItemRelationCompositePk\`. Fields that are set will be updated.
"""
input RelationalItemRelationCompositePkPatch {
  parentId: Int
  childId: Int
}

"""
All input for the \`updateRelationalItemRelationCompositePkByParentIdAndChildId\` mutation.
"""
input UpdateRelationalItemRelationCompositePkByParentIdAndChildIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  parentId: Int!
  childId: Int!

  """
  An object where the defined keys will be set on the \`RelationalItemRelationCompositePk\` being updated.
  """
  relationalItemRelationCompositePkPatch: RelationalItemRelationCompositePkPatch!
}

"""
The output of our update \`SingleTableItemRelationCompositePk\` mutation.
"""
type UpdateSingleTableItemRelationCompositePkPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """
  The \`SingleTableItemRelationCompositePk\` that was updated by this mutation.
  """
  singleTableItemRelationCompositePk: SingleTableItemRelationCompositePk

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """
  An edge for our \`SingleTableItemRelationCompositePk\`. May be used by Relay 1.
  """
  singleTableItemRelationCompositePkEdge(
    """The method to use when ordering \`SingleTableItemRelationCompositePk\`."""
    orderBy: [SingleTableItemRelationCompositePksOrderBy!]! = [PRIMARY_KEY_ASC]
  ): SingleTableItemRelationCompositePksEdge

  """
  Reads a single \`SingleTableItem\` that is related to this \`SingleTableItemRelationCompositePk\`.
  """
  singleTableItemByChildId: SingleTableItem

  """
  Reads a single \`SingleTableItem\` that is related to this \`SingleTableItemRelationCompositePk\`.
  """
  singleTableItemByParentId: SingleTableItem
}

"""All input for the \`updateSingleTableItemRelationCompositePk\` mutation."""
input UpdateSingleTableItemRelationCompositePkInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`SingleTableItemRelationCompositePk\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`SingleTableItemRelationCompositePk\` being updated.
  """
  singleTableItemRelationCompositePkPatch: SingleTableItemRelationCompositePkPatch!
}

"""
Represents an update to a \`SingleTableItemRelationCompositePk\`. Fields that are set will be updated.
"""
input SingleTableItemRelationCompositePkPatch {
  parentId: Int
  childId: Int
}

"""
All input for the \`updateSingleTableItemRelationCompositePkByParentIdAndChildId\` mutation.
"""
input UpdateSingleTableItemRelationCompositePkByParentIdAndChildIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  parentId: Int!
  childId: Int!

  """
  An object where the defined keys will be set on the \`SingleTableItemRelationCompositePk\` being updated.
  """
  singleTableItemRelationCompositePkPatch: SingleTableItemRelationCompositePkPatch!
}

"""The output of our update \`RelationalItemRelation\` mutation."""
type UpdateRelationalItemRelationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`RelationalItemRelation\` that was updated by this mutation."""
  relationalItemRelation: RelationalItemRelation

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`RelationalItemRelation\`. May be used by Relay 1."""
  relationalItemRelationEdge(
    """The method to use when ordering \`RelationalItemRelation\`."""
    orderBy: [RelationalItemRelationsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): RelationalItemRelationsEdge

  """
  Reads a single \`RelationalItem\` that is related to this \`RelationalItemRelation\`.
  """
  relationalItemByChildId: RelationalItem

  """
  Reads a single \`RelationalItem\` that is related to this \`RelationalItemRelation\`.
  """
  relationalItemByParentId: RelationalItem
}

"""All input for the \`updateRelationalItemRelation\` mutation."""
input UpdateRelationalItemRelationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`RelationalItemRelation\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`RelationalItemRelation\` being updated.
  """
  relationalItemRelationPatch: RelationalItemRelationPatch!
}

"""
Represents an update to a \`RelationalItemRelation\`. Fields that are set will be updated.
"""
input RelationalItemRelationPatch {
  id: Int
  parentId: Int
  childId: Int
}

"""All input for the \`updateRelationalItemRelationById\` mutation."""
input UpdateRelationalItemRelationByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`RelationalItemRelation\` being updated.
  """
  relationalItemRelationPatch: RelationalItemRelationPatch!
}

"""
All input for the \`updateRelationalItemRelationByParentIdAndChildId\` mutation.
"""
input UpdateRelationalItemRelationByParentIdAndChildIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  parentId: Int!
  childId: Int!

  """
  An object where the defined keys will be set on the \`RelationalItemRelation\` being updated.
  """
  relationalItemRelationPatch: RelationalItemRelationPatch!
}

"""The output of our update \`SingleTableItemRelation\` mutation."""
type UpdateSingleTableItemRelationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`SingleTableItemRelation\` that was updated by this mutation."""
  singleTableItemRelation: SingleTableItemRelation

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`SingleTableItemRelation\`. May be used by Relay 1."""
  singleTableItemRelationEdge(
    """The method to use when ordering \`SingleTableItemRelation\`."""
    orderBy: [SingleTableItemRelationsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): SingleTableItemRelationsEdge

  """
  Reads a single \`SingleTableItem\` that is related to this \`SingleTableItemRelation\`.
  """
  singleTableItemByChildId: SingleTableItem

  """
  Reads a single \`SingleTableItem\` that is related to this \`SingleTableItemRelation\`.
  """
  singleTableItemByParentId: SingleTableItem
}

"""All input for the \`updateSingleTableItemRelation\` mutation."""
input UpdateSingleTableItemRelationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`SingleTableItemRelation\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`SingleTableItemRelation\` being updated.
  """
  singleTableItemRelationPatch: SingleTableItemRelationPatch!
}

"""
Represents an update to a \`SingleTableItemRelation\`. Fields that are set will be updated.
"""
input SingleTableItemRelationPatch {
  id: Int
  parentId: Int
  childId: Int
}

"""All input for the \`updateSingleTableItemRelationById\` mutation."""
input UpdateSingleTableItemRelationByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`SingleTableItemRelation\` being updated.
  """
  singleTableItemRelationPatch: SingleTableItemRelationPatch!
}

"""
All input for the \`updateSingleTableItemRelationByParentIdAndChildId\` mutation.
"""
input UpdateSingleTableItemRelationByParentIdAndChildIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  parentId: Int!
  childId: Int!

  """
  An object where the defined keys will be set on the \`SingleTableItemRelation\` being updated.
  """
  singleTableItemRelationPatch: SingleTableItemRelationPatch!
}

"""The output of our update \`LogEntry\` mutation."""
type UpdateLogEntryPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`LogEntry\` that was updated by this mutation."""
  logEntry: LogEntry

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`LogEntry\`. May be used by Relay 1."""
  logEntryEdge(
    """The method to use when ordering \`LogEntry\`."""
    orderBy: [LogEntriesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): LogEntriesEdge

  """Reads a single \`Organization\` that is related to this \`LogEntry\`."""
  organizationByOrganizationId: Organization

  """Reads a single \`Person\` that is related to this \`LogEntry\`."""
  personByPersonId: Person
}

"""All input for the \`updateLogEntry\` mutation."""
input UpdateLogEntryInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`LogEntry\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`LogEntry\` being updated.
  """
  logEntryPatch: LogEntryPatch!
}

"""
Represents an update to a \`LogEntry\`. Fields that are set will be updated.
"""
input LogEntryPatch {
  id: Int
  personId: Int
  organizationId: Int
  text: String
}

"""All input for the \`updateLogEntryById\` mutation."""
input UpdateLogEntryByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`LogEntry\` being updated.
  """
  logEntryPatch: LogEntryPatch!
}

"""The output of our update \`FirstPartyVulnerability\` mutation."""
type UpdateFirstPartyVulnerabilityPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`FirstPartyVulnerability\` that was updated by this mutation."""
  firstPartyVulnerability: FirstPartyVulnerability

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`FirstPartyVulnerability\`. May be used by Relay 1."""
  firstPartyVulnerabilityEdge(
    """The method to use when ordering \`FirstPartyVulnerability\`."""
    orderBy: [FirstPartyVulnerabilitiesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): FirstPartyVulnerabilitiesEdge
}

"""All input for the \`updateFirstPartyVulnerability\` mutation."""
input UpdateFirstPartyVulnerabilityInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`FirstPartyVulnerability\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`FirstPartyVulnerability\` being updated.
  """
  firstPartyVulnerabilityPatch: FirstPartyVulnerabilityPatch!
}

"""
Represents an update to a \`FirstPartyVulnerability\`. Fields that are set will be updated.
"""
input FirstPartyVulnerabilityPatch {
  id: Int
  name: String
  cvssScore: Float
  teamName: String
}

"""All input for the \`updateFirstPartyVulnerabilityById\` mutation."""
input UpdateFirstPartyVulnerabilityByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`FirstPartyVulnerability\` being updated.
  """
  firstPartyVulnerabilityPatch: FirstPartyVulnerabilityPatch!
}

"""The output of our update \`ThirdPartyVulnerability\` mutation."""
type UpdateThirdPartyVulnerabilityPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`ThirdPartyVulnerability\` that was updated by this mutation."""
  thirdPartyVulnerability: ThirdPartyVulnerability

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`ThirdPartyVulnerability\`. May be used by Relay 1."""
  thirdPartyVulnerabilityEdge(
    """The method to use when ordering \`ThirdPartyVulnerability\`."""
    orderBy: [ThirdPartyVulnerabilitiesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ThirdPartyVulnerabilitiesEdge
}

"""All input for the \`updateThirdPartyVulnerability\` mutation."""
input UpdateThirdPartyVulnerabilityInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`ThirdPartyVulnerability\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`ThirdPartyVulnerability\` being updated.
  """
  thirdPartyVulnerabilityPatch: ThirdPartyVulnerabilityPatch!
}

"""
Represents an update to a \`ThirdPartyVulnerability\`. Fields that are set will be updated.
"""
input ThirdPartyVulnerabilityPatch {
  id: Int
  name: String
  cvssScore: Float
  vendorName: String
}

"""All input for the \`updateThirdPartyVulnerabilityById\` mutation."""
input UpdateThirdPartyVulnerabilityByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`ThirdPartyVulnerability\` being updated.
  """
  thirdPartyVulnerabilityPatch: ThirdPartyVulnerabilityPatch!
}

"""The output of our update \`AwsApplication\` mutation."""
type UpdateAwsApplicationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`AwsApplication\` that was updated by this mutation."""
  awsApplication: AwsApplication

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`AwsApplication\`. May be used by Relay 1."""
  awsApplicationEdge(
    """The method to use when ordering \`AwsApplication\`."""
    orderBy: [AwsApplicationsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): AwsApplicationsEdge

  """
  Reads a single \`Organization\` that is related to this \`AwsApplication\`.
  """
  organizationByOrganizationId: Organization

  """Reads a single \`Person\` that is related to this \`AwsApplication\`."""
  personByPersonId: Person
}

"""All input for the \`updateAwsApplication\` mutation."""
input UpdateAwsApplicationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`AwsApplication\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`AwsApplication\` being updated.
  """
  awsApplicationPatch: AwsApplicationPatch!
}

"""
Represents an update to a \`AwsApplication\`. Fields that are set will be updated.
"""
input AwsApplicationPatch {
  id: Int
  name: String
  lastDeployed: Datetime
  personId: Int
  organizationId: Int
  awsId: String
}

"""All input for the \`updateAwsApplicationById\` mutation."""
input UpdateAwsApplicationByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`AwsApplication\` being updated.
  """
  awsApplicationPatch: AwsApplicationPatch!
}

"""The output of our update \`GcpApplication\` mutation."""
type UpdateGcpApplicationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`GcpApplication\` that was updated by this mutation."""
  gcpApplication: GcpApplication

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`GcpApplication\`. May be used by Relay 1."""
  gcpApplicationEdge(
    """The method to use when ordering \`GcpApplication\`."""
    orderBy: [GcpApplicationsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): GcpApplicationsEdge

  """
  Reads a single \`Organization\` that is related to this \`GcpApplication\`.
  """
  organizationByOrganizationId: Organization

  """Reads a single \`Person\` that is related to this \`GcpApplication\`."""
  personByPersonId: Person
}

"""All input for the \`updateGcpApplication\` mutation."""
input UpdateGcpApplicationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`GcpApplication\` to be updated.
  """
  nodeId: ID!

  """
  An object where the defined keys will be set on the \`GcpApplication\` being updated.
  """
  gcpApplicationPatch: GcpApplicationPatch!
}

"""
Represents an update to a \`GcpApplication\`. Fields that are set will be updated.
"""
input GcpApplicationPatch {
  id: Int
  name: String
  lastDeployed: Datetime
  personId: Int
  organizationId: Int
  gcpId: String
}

"""All input for the \`updateGcpApplicationById\` mutation."""
input UpdateGcpApplicationByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!

  """
  An object where the defined keys will be set on the \`GcpApplication\` being updated.
  """
  gcpApplicationPatch: GcpApplicationPatch!
}

"""The output of our delete \`Organization\` mutation."""
type DeleteOrganizationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Organization\` that was deleted by this mutation."""
  organization: Organization
  deletedOrganizationId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Organization\`. May be used by Relay 1."""
  organizationEdge(
    """The method to use when ordering \`Organization\`."""
    orderBy: [OrganizationsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): OrganizationsEdge
}

"""All input for the \`deleteOrganization\` mutation."""
input DeleteOrganizationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`Organization\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteOrganizationByOrganizationId\` mutation."""
input DeleteOrganizationByOrganizationIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  organizationId: Int!
}

"""All input for the \`deleteOrganizationByName\` mutation."""
input DeleteOrganizationByNameInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  name: String!
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

"""All input for the \`deletePersonByPersonId\` mutation."""
input DeletePersonByPersonIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  personId: Int!
}

"""All input for the \`deletePersonByUsername\` mutation."""
input DeletePersonByUsernameInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  username: String!
}

"""The output of our delete \`RelationalItemRelationCompositePk\` mutation."""
type DeleteRelationalItemRelationCompositePkPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """
  The \`RelationalItemRelationCompositePk\` that was deleted by this mutation.
  """
  relationalItemRelationCompositePk: RelationalItemRelationCompositePk
  deletedRelationalItemRelationCompositePkId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """
  An edge for our \`RelationalItemRelationCompositePk\`. May be used by Relay 1.
  """
  relationalItemRelationCompositePkEdge(
    """The method to use when ordering \`RelationalItemRelationCompositePk\`."""
    orderBy: [RelationalItemRelationCompositePksOrderBy!]! = [PRIMARY_KEY_ASC]
  ): RelationalItemRelationCompositePksEdge

  """
  Reads a single \`RelationalItem\` that is related to this \`RelationalItemRelationCompositePk\`.
  """
  relationalItemByChildId: RelationalItem

  """
  Reads a single \`RelationalItem\` that is related to this \`RelationalItemRelationCompositePk\`.
  """
  relationalItemByParentId: RelationalItem
}

"""All input for the \`deleteRelationalItemRelationCompositePk\` mutation."""
input DeleteRelationalItemRelationCompositePkInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`RelationalItemRelationCompositePk\` to be deleted.
  """
  nodeId: ID!
}

"""
All input for the \`deleteRelationalItemRelationCompositePkByParentIdAndChildId\` mutation.
"""
input DeleteRelationalItemRelationCompositePkByParentIdAndChildIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  parentId: Int!
  childId: Int!
}

"""
The output of our delete \`SingleTableItemRelationCompositePk\` mutation.
"""
type DeleteSingleTableItemRelationCompositePkPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """
  The \`SingleTableItemRelationCompositePk\` that was deleted by this mutation.
  """
  singleTableItemRelationCompositePk: SingleTableItemRelationCompositePk
  deletedSingleTableItemRelationCompositePkId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """
  An edge for our \`SingleTableItemRelationCompositePk\`. May be used by Relay 1.
  """
  singleTableItemRelationCompositePkEdge(
    """The method to use when ordering \`SingleTableItemRelationCompositePk\`."""
    orderBy: [SingleTableItemRelationCompositePksOrderBy!]! = [PRIMARY_KEY_ASC]
  ): SingleTableItemRelationCompositePksEdge

  """
  Reads a single \`SingleTableItem\` that is related to this \`SingleTableItemRelationCompositePk\`.
  """
  singleTableItemByChildId: SingleTableItem

  """
  Reads a single \`SingleTableItem\` that is related to this \`SingleTableItemRelationCompositePk\`.
  """
  singleTableItemByParentId: SingleTableItem
}

"""All input for the \`deleteSingleTableItemRelationCompositePk\` mutation."""
input DeleteSingleTableItemRelationCompositePkInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`SingleTableItemRelationCompositePk\` to be deleted.
  """
  nodeId: ID!
}

"""
All input for the \`deleteSingleTableItemRelationCompositePkByParentIdAndChildId\` mutation.
"""
input DeleteSingleTableItemRelationCompositePkByParentIdAndChildIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  parentId: Int!
  childId: Int!
}

"""The output of our delete \`RelationalItemRelation\` mutation."""
type DeleteRelationalItemRelationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`RelationalItemRelation\` that was deleted by this mutation."""
  relationalItemRelation: RelationalItemRelation
  deletedRelationalItemRelationId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`RelationalItemRelation\`. May be used by Relay 1."""
  relationalItemRelationEdge(
    """The method to use when ordering \`RelationalItemRelation\`."""
    orderBy: [RelationalItemRelationsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): RelationalItemRelationsEdge

  """
  Reads a single \`RelationalItem\` that is related to this \`RelationalItemRelation\`.
  """
  relationalItemByChildId: RelationalItem

  """
  Reads a single \`RelationalItem\` that is related to this \`RelationalItemRelation\`.
  """
  relationalItemByParentId: RelationalItem
}

"""All input for the \`deleteRelationalItemRelation\` mutation."""
input DeleteRelationalItemRelationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`RelationalItemRelation\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteRelationalItemRelationById\` mutation."""
input DeleteRelationalItemRelationByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!
}

"""
All input for the \`deleteRelationalItemRelationByParentIdAndChildId\` mutation.
"""
input DeleteRelationalItemRelationByParentIdAndChildIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  parentId: Int!
  childId: Int!
}

"""The output of our delete \`SingleTableItemRelation\` mutation."""
type DeleteSingleTableItemRelationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`SingleTableItemRelation\` that was deleted by this mutation."""
  singleTableItemRelation: SingleTableItemRelation
  deletedSingleTableItemRelationId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`SingleTableItemRelation\`. May be used by Relay 1."""
  singleTableItemRelationEdge(
    """The method to use when ordering \`SingleTableItemRelation\`."""
    orderBy: [SingleTableItemRelationsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): SingleTableItemRelationsEdge

  """
  Reads a single \`SingleTableItem\` that is related to this \`SingleTableItemRelation\`.
  """
  singleTableItemByChildId: SingleTableItem

  """
  Reads a single \`SingleTableItem\` that is related to this \`SingleTableItemRelation\`.
  """
  singleTableItemByParentId: SingleTableItem
}

"""All input for the \`deleteSingleTableItemRelation\` mutation."""
input DeleteSingleTableItemRelationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`SingleTableItemRelation\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteSingleTableItemRelationById\` mutation."""
input DeleteSingleTableItemRelationByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!
}

"""
All input for the \`deleteSingleTableItemRelationByParentIdAndChildId\` mutation.
"""
input DeleteSingleTableItemRelationByParentIdAndChildIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  parentId: Int!
  childId: Int!
}

"""The output of our delete \`LogEntry\` mutation."""
type DeleteLogEntryPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`LogEntry\` that was deleted by this mutation."""
  logEntry: LogEntry
  deletedLogEntryId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`LogEntry\`. May be used by Relay 1."""
  logEntryEdge(
    """The method to use when ordering \`LogEntry\`."""
    orderBy: [LogEntriesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): LogEntriesEdge

  """Reads a single \`Organization\` that is related to this \`LogEntry\`."""
  organizationByOrganizationId: Organization

  """Reads a single \`Person\` that is related to this \`LogEntry\`."""
  personByPersonId: Person
}

"""All input for the \`deleteLogEntry\` mutation."""
input DeleteLogEntryInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`LogEntry\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteLogEntryById\` mutation."""
input DeleteLogEntryByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!
}

"""The output of our delete \`FirstPartyVulnerability\` mutation."""
type DeleteFirstPartyVulnerabilityPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`FirstPartyVulnerability\` that was deleted by this mutation."""
  firstPartyVulnerability: FirstPartyVulnerability
  deletedFirstPartyVulnerabilityId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`FirstPartyVulnerability\`. May be used by Relay 1."""
  firstPartyVulnerabilityEdge(
    """The method to use when ordering \`FirstPartyVulnerability\`."""
    orderBy: [FirstPartyVulnerabilitiesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): FirstPartyVulnerabilitiesEdge
}

"""All input for the \`deleteFirstPartyVulnerability\` mutation."""
input DeleteFirstPartyVulnerabilityInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`FirstPartyVulnerability\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteFirstPartyVulnerabilityById\` mutation."""
input DeleteFirstPartyVulnerabilityByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!
}

"""The output of our delete \`ThirdPartyVulnerability\` mutation."""
type DeleteThirdPartyVulnerabilityPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`ThirdPartyVulnerability\` that was deleted by this mutation."""
  thirdPartyVulnerability: ThirdPartyVulnerability
  deletedThirdPartyVulnerabilityId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`ThirdPartyVulnerability\`. May be used by Relay 1."""
  thirdPartyVulnerabilityEdge(
    """The method to use when ordering \`ThirdPartyVulnerability\`."""
    orderBy: [ThirdPartyVulnerabilitiesOrderBy!]! = [PRIMARY_KEY_ASC]
  ): ThirdPartyVulnerabilitiesEdge
}

"""All input for the \`deleteThirdPartyVulnerability\` mutation."""
input DeleteThirdPartyVulnerabilityInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`ThirdPartyVulnerability\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteThirdPartyVulnerabilityById\` mutation."""
input DeleteThirdPartyVulnerabilityByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!
}

"""The output of our delete \`AwsApplication\` mutation."""
type DeleteAwsApplicationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`AwsApplication\` that was deleted by this mutation."""
  awsApplication: AwsApplication
  deletedAwsApplicationId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`AwsApplication\`. May be used by Relay 1."""
  awsApplicationEdge(
    """The method to use when ordering \`AwsApplication\`."""
    orderBy: [AwsApplicationsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): AwsApplicationsEdge

  """
  Reads a single \`Organization\` that is related to this \`AwsApplication\`.
  """
  organizationByOrganizationId: Organization

  """Reads a single \`Person\` that is related to this \`AwsApplication\`."""
  personByPersonId: Person
}

"""All input for the \`deleteAwsApplication\` mutation."""
input DeleteAwsApplicationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`AwsApplication\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteAwsApplicationById\` mutation."""
input DeleteAwsApplicationByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!
}

"""The output of our delete \`GcpApplication\` mutation."""
type DeleteGcpApplicationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`GcpApplication\` that was deleted by this mutation."""
  gcpApplication: GcpApplication
  deletedGcpApplicationId: ID

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`GcpApplication\`. May be used by Relay 1."""
  gcpApplicationEdge(
    """The method to use when ordering \`GcpApplication\`."""
    orderBy: [GcpApplicationsOrderBy!]! = [PRIMARY_KEY_ASC]
  ): GcpApplicationsEdge

  """
  Reads a single \`Organization\` that is related to this \`GcpApplication\`.
  """
  organizationByOrganizationId: Organization

  """Reads a single \`Person\` that is related to this \`GcpApplication\`."""
  personByPersonId: Person
}

"""All input for the \`deleteGcpApplication\` mutation."""
input DeleteGcpApplicationInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """
  The globally unique \`ID\` which will identify a single \`GcpApplication\` to be deleted.
  """
  nodeId: ID!
}

"""All input for the \`deleteGcpApplicationById\` mutation."""
input DeleteGcpApplicationByIdInput {
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
      allApplications: {
        plan() {
          const $list = pgUnionAll({
            attributes: spec_Application.attributes,
            resourceByTypeName: resourceByTypeName11,
            members: members8,
            name: "Application"
          });
          return connection($list);
        },
        args: {
          first: applyFirstArg,
          last: applyLastArg,
          offset: applyOffsetArg,
          before: applyBeforeArg,
          after: applyAfterArg,
          condition: applyConditionArgToConnection,
          only: applyConnectionLimitToTypes,
          orderBy: applyOrderByArgToConnection
        }
      },
      allAwsApplications: {
        plan() {
          return connection(spec_resource_aws_applicationsPgResource.find());
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
      allCollections: {
        plan() {
          return connection(resource_collectionsPgResource.find());
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
      allFirstPartyVulnerabilities: {
        plan() {
          return connection(spec_resource_first_party_vulnerabilitiesPgResource.find());
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
      allGcpApplications: {
        plan() {
          return connection(spec_resource_gcp_applicationsPgResource.find());
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
      allLogEntries: {
        plan() {
          return connection(spec_resource_log_entriesPgResource.find());
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
      allOrganizations: {
        plan() {
          return connection(spec_resource_organizationsPgResource.find());
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
      allPeople: {
        plan() {
          return connection(otherSource_peoplePgResource.find());
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
      allPriorities: {
        plan() {
          return connection(spec_resource_prioritiesPgResource.find());
        },
        args: {
          first: applyFirstArg,
          last: applyLastArg,
          offset: applyOffsetArg,
          before: applyBeforeArg,
          after: applyAfterArg
        }
      },
      allRelationalChecklistItems: {
        plan() {
          return connection(spec_resource_relational_checklist_itemsPgResource.find());
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
      allRelationalChecklists: {
        plan() {
          return connection(spec_resource_relational_checklistsPgResource.find());
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
      allRelationalDividers: {
        plan() {
          return connection(spec_resource_relational_dividersPgResource.find());
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
      allRelationalItemRelationCompositePks: {
        plan() {
          return connection(spec_resource_relational_item_relation_composite_pksPgResource.find());
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
      allRelationalItemRelations: {
        plan() {
          return connection(spec_resource_relational_item_relationsPgResource.find());
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
      allRelationalItems: {
        plan() {
          return connection(otherSource_relational_itemsPgResource.find());
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
      allRelationalItemsFn: {
        plan($parent, args, info) {
          const $select = all_relational_items_fn_getSelectPlanFromParentAndArgs($parent, args, info);
          return connection($select);
        },
        args: {
          first: applyFirstArg,
          last: applyLastArg,
          offset: applyOffsetArg,
          before: applyBeforeArg,
          after: applyAfterArg
        }
      },
      allRelationalPosts: {
        plan() {
          return connection(spec_resource_relational_postsPgResource.find());
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
      allRelationalTopics: {
        plan() {
          return connection(spec_resource_relational_topicsPgResource.find());
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
      allSingleTableItemRelationCompositePks: {
        plan() {
          return connection(otherSource_single_table_item_relation_composite_pksPgResource.find());
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
      allSingleTableItemRelations: {
        plan() {
          return connection(otherSource_single_table_item_relationsPgResource.find());
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
      allSingleTableItems: {
        plan() {
          return connection(resource_single_table_itemsPgResource.find());
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
      allSingleTables: {
        plan($parent, args, info) {
          const $select = all_single_tables_getSelectPlanFromParentAndArgs($parent, args, info);
          return connection($select);
        },
        args: {
          first: applyFirstArg,
          last: applyLastArg,
          offset: applyOffsetArg,
          before: applyBeforeArg,
          after: applyAfterArg
        }
      },
      allThirdPartyVulnerabilities: {
        plan() {
          return connection(spec_resource_third_party_vulnerabilitiesPgResource.find());
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
      allVulnerabilities: {
        plan() {
          const $list = pgUnionAll({
            attributes: spec_Vulnerability.attributes,
            resourceByTypeName: resourceByTypeName10,
            members: members7,
            name: "Vulnerability"
          });
          return connection($list);
        },
        args: {
          first: applyFirstArg,
          last: applyLastArg,
          offset: applyOffsetArg,
          before: applyBeforeArg,
          after: applyAfterArg,
          condition: applyConditionArgToConnection,
          only: applyConnectionLimitToTypes,
          orderBy: applyOrderByArgToConnection
        }
      },
      allZeroImplementations: {
        plan() {
          const $list = pgUnionAll({
            attributes: spec_ZeroImplementation.attributes,
            resourceByTypeName: resourceByTypeName12,
            members: members9,
            name: "ZeroImplementation"
          });
          return connection($list);
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
      awsApplication(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_AwsApplication($nodeId);
      },
      awsApplicationById(_$root, {
        $id
      }) {
        return spec_resource_aws_applicationsPgResource.get({
          id: $id
        });
      },
      firstPartyVulnerability(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_FirstPartyVulnerability($nodeId);
      },
      firstPartyVulnerabilityById(_$root, {
        $id
      }) {
        return spec_resource_first_party_vulnerabilitiesPgResource.get({
          id: $id
        });
      },
      gcpApplication(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_GcpApplication($nodeId);
      },
      gcpApplicationById(_$root, {
        $id
      }) {
        return spec_resource_gcp_applicationsPgResource.get({
          id: $id
        });
      },
      getSingleTableTopicById($root, args, _info) {
        const selectArgs = makeArgs_get_single_table_topic_by_id(args);
        return resource_get_single_table_topic_by_idPgResource.execute(selectArgs);
      },
      logEntry(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_LogEntry($nodeId);
      },
      logEntryById(_$root, {
        $id
      }) {
        return spec_resource_log_entriesPgResource.get({
          id: $id
        });
      },
      movieCollection(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_MovieCollection($nodeId);
      },
      node(_$root, fieldArgs) {
        return fieldArgs.getRaw("nodeId");
      },
      nodeId($parent) {
        const specifier = nodeIdHandlerByTypeName.Query.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Query.codec.name].encode);
      },
      organization(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_Organization($nodeId);
      },
      organizationByName(_$root, {
        $name
      }) {
        return spec_resource_organizationsPgResource.get({
          name: $name
        });
      },
      organizationByOrganizationId(_$root, {
        $organizationId
      }) {
        return spec_resource_organizationsPgResource.get({
          organization_id: $organizationId
        });
      },
      person(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_Person($nodeId);
      },
      personByPersonId(_$root, {
        $personId
      }) {
        return otherSource_peoplePgResource.get({
          person_id: $personId
        });
      },
      personByUsername(_$root, {
        $username
      }) {
        return otherSource_peoplePgResource.get({
          username: $username
        });
      },
      priority(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_Priority($nodeId);
      },
      priorityById(_$root, {
        $id
      }) {
        return spec_resource_prioritiesPgResource.get({
          id: $id
        });
      },
      query() {
        return rootValue();
      },
      relationalChecklist(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_RelationalChecklist($nodeId);
      },
      relationalChecklistByChecklistItemId(_$root, {
        $checklistItemId
      }) {
        return spec_resource_relational_checklistsPgResource.get({
          checklist_item_id: $checklistItemId
        });
      },
      relationalChecklistItem(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_RelationalChecklistItem($nodeId);
      },
      relationalChecklistItemByChecklistItemItemId(_$root, {
        $checklistItemItemId
      }) {
        return spec_resource_relational_checklist_itemsPgResource.get({
          checklist_item_item_id: $checklistItemItemId
        });
      },
      relationalDivider(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_RelationalDivider($nodeId);
      },
      relationalDividerByDividerItemId(_$root, {
        $dividerItemId
      }) {
        return spec_resource_relational_dividersPgResource.get({
          divider_item_id: $dividerItemId
        });
      },
      relationalItemByIdFn($root, args, _info) {
        const selectArgs = makeArgs_relational_item_by_id_fn(args);
        return resource_relational_item_by_id_fnPgResource.execute(selectArgs);
      },
      relationalItemRelation(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_RelationalItemRelation($nodeId);
      },
      relationalItemRelationById(_$root, {
        $id
      }) {
        return spec_resource_relational_item_relationsPgResource.get({
          id: $id
        });
      },
      relationalItemRelationByParentIdAndChildId(_$root, {
        $parentId,
        $childId
      }) {
        return spec_resource_relational_item_relationsPgResource.get({
          parent_id: $parentId,
          child_id: $childId
        });
      },
      relationalItemRelationCompositePk(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_RelationalItemRelationCompositePk($nodeId);
      },
      relationalItemRelationCompositePkByParentIdAndChildId(_$root, {
        $parentId,
        $childId
      }) {
        return spec_resource_relational_item_relation_composite_pksPgResource.get({
          parent_id: $parentId,
          child_id: $childId
        });
      },
      relationalPost(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_RelationalPost($nodeId);
      },
      relationalPostByPostItemId(_$root, {
        $postItemId
      }) {
        return spec_resource_relational_postsPgResource.get({
          post_item_id: $postItemId
        });
      },
      relationalTopic(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_RelationalTopic($nodeId);
      },
      relationalTopicByIdFn($root, args, _info) {
        const selectArgs = makeArgs_relational_topic_by_id_fn(args);
        return resource_relational_topic_by_id_fnPgResource.execute(selectArgs);
      },
      relationalTopicByTopicItemId(_$root, {
        $topicItemId
      }) {
        return spec_resource_relational_topicsPgResource.get({
          topic_item_id: $topicItemId
        });
      },
      seriesCollection(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_SeriesCollection($nodeId);
      },
      singleTableChecklist(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_SingleTableChecklist($nodeId);
      },
      singleTableChecklistItem(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_SingleTableChecklistItem($nodeId);
      },
      singleTableDivider(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_SingleTableDivider($nodeId);
      },
      singleTableItemRelation(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_SingleTableItemRelation($nodeId);
      },
      singleTableItemRelationById(_$root, {
        $id
      }) {
        return otherSource_single_table_item_relationsPgResource.get({
          id: $id
        });
      },
      singleTableItemRelationByParentIdAndChildId(_$root, {
        $parentId,
        $childId
      }) {
        return otherSource_single_table_item_relationsPgResource.get({
          parent_id: $parentId,
          child_id: $childId
        });
      },
      singleTableItemRelationCompositePk(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_SingleTableItemRelationCompositePk($nodeId);
      },
      singleTableItemRelationCompositePkByParentIdAndChildId(_$root, {
        $parentId,
        $childId
      }) {
        return otherSource_single_table_item_relation_composite_pksPgResource.get({
          parent_id: $parentId,
          child_id: $childId
        });
      },
      singleTablePost(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_SingleTablePost($nodeId);
      },
      singleTableTopic(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_SingleTableTopic($nodeId);
      },
      thirdPartyVulnerability(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_ThirdPartyVulnerability($nodeId);
      },
      thirdPartyVulnerabilityById(_$root, {
        $id
      }) {
        return spec_resource_third_party_vulnerabilitiesPgResource.get({
          id: $id
        });
      }
    }
  },
  Mutation: {
    assertStep: __ValueStep,
    plans: {
      createAwsApplication: {
        plan(_, args) {
          const $insert = pgInsertSingle(spec_resource_aws_applicationsPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createFirstPartyVulnerability: {
        plan(_, args) {
          const $insert = pgInsertSingle(spec_resource_first_party_vulnerabilitiesPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createGcpApplication: {
        plan(_, args) {
          const $insert = pgInsertSingle(spec_resource_gcp_applicationsPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createLogEntry: {
        plan(_, args) {
          const $insert = pgInsertSingle(spec_resource_log_entriesPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createOrganization: {
        plan(_, args) {
          const $insert = pgInsertSingle(spec_resource_organizationsPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createPerson: {
        plan(_, args) {
          const $insert = pgInsertSingle(otherSource_peoplePgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createRelationalItemRelation: {
        plan(_, args) {
          const $insert = pgInsertSingle(spec_resource_relational_item_relationsPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createRelationalItemRelationCompositePk: {
        plan(_, args) {
          const $insert = pgInsertSingle(spec_resource_relational_item_relation_composite_pksPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createSingleTableItemRelation: {
        plan(_, args) {
          const $insert = pgInsertSingle(otherSource_single_table_item_relationsPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createSingleTableItemRelationCompositePk: {
        plan(_, args) {
          const $insert = pgInsertSingle(otherSource_single_table_item_relation_composite_pksPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      createThirdPartyVulnerability: {
        plan(_, args) {
          const $insert = pgInsertSingle(spec_resource_third_party_vulnerabilitiesPgResource);
          args.apply($insert);
          return object({
            result: $insert
          });
        },
        args: {
          input: applyInputToInsert
        }
      },
      customDeleteRelationalItem: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_custom_delete_relational_item(args, ["input"]);
          const $result = resource_custom_delete_relational_itemPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input(_, $payload, arg) {
            const $pgSelect = pgSelectFromPayload($payload);
            arg.apply($pgSelect);
          }
        }
      },
      deleteAwsApplication: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_aws_applicationsPgResource, specFromArgs_AwsApplication2(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteAwsApplicationById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_aws_applicationsPgResource, {
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
      deleteFirstPartyVulnerability: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_first_party_vulnerabilitiesPgResource, specFromArgs_FirstPartyVulnerability2(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteFirstPartyVulnerabilityById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_first_party_vulnerabilitiesPgResource, {
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
      deleteGcpApplication: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_gcp_applicationsPgResource, specFromArgs_GcpApplication2(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteGcpApplicationById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_gcp_applicationsPgResource, {
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
      deleteLogEntry: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_log_entriesPgResource, specFromArgs_LogEntry2(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteLogEntryById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_log_entriesPgResource, {
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
      deleteOrganization: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_organizationsPgResource, specFromArgs_Organization2(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteOrganizationByName: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_organizationsPgResource, {
            name: args.getRaw(['input', "name"])
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
      deleteOrganizationByOrganizationId: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_organizationsPgResource, {
            organization_id: args.getRaw(['input', "organizationId"])
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
      deletePerson: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(otherSource_peoplePgResource, specFromArgs_Person2(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deletePersonByPersonId: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(otherSource_peoplePgResource, {
            person_id: args.getRaw(['input', "personId"])
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
      deletePersonByUsername: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(otherSource_peoplePgResource, {
            username: args.getRaw(['input', "username"])
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
      deleteRelationalItemRelation: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_relational_item_relationsPgResource, specFromArgs_RelationalItemRelation2(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteRelationalItemRelationById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_relational_item_relationsPgResource, {
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
      deleteRelationalItemRelationByParentIdAndChildId: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_relational_item_relationsPgResource, {
            parent_id: args.getRaw(['input', "parentId"]),
            child_id: args.getRaw(['input', "childId"])
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
      deleteRelationalItemRelationCompositePk: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_relational_item_relation_composite_pksPgResource, specFromArgs_RelationalItemRelationCompositePk2(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteRelationalItemRelationCompositePkByParentIdAndChildId: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_relational_item_relation_composite_pksPgResource, {
            parent_id: args.getRaw(['input', "parentId"]),
            child_id: args.getRaw(['input', "childId"])
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
      deleteSingleTableItemRelation: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(otherSource_single_table_item_relationsPgResource, specFromArgs_SingleTableItemRelation2(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteSingleTableItemRelationById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(otherSource_single_table_item_relationsPgResource, {
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
      deleteSingleTableItemRelationByParentIdAndChildId: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(otherSource_single_table_item_relationsPgResource, {
            parent_id: args.getRaw(['input', "parentId"]),
            child_id: args.getRaw(['input', "childId"])
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
      deleteSingleTableItemRelationCompositePk: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(otherSource_single_table_item_relation_composite_pksPgResource, specFromArgs_SingleTableItemRelationCompositePk2(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteSingleTableItemRelationCompositePkByParentIdAndChildId: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(otherSource_single_table_item_relation_composite_pksPgResource, {
            parent_id: args.getRaw(['input', "parentId"]),
            child_id: args.getRaw(['input', "childId"])
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
      deleteThirdPartyVulnerability: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_third_party_vulnerabilitiesPgResource, specFromArgs_ThirdPartyVulnerability2(args));
          args.apply($delete);
          return object({
            result: $delete
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      deleteThirdPartyVulnerabilityById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(spec_resource_third_party_vulnerabilitiesPgResource, {
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
      updateAwsApplication: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_aws_applicationsPgResource, specFromArgs_AwsApplication(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateAwsApplicationById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_aws_applicationsPgResource, {
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
      updateFirstPartyVulnerability: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_first_party_vulnerabilitiesPgResource, specFromArgs_FirstPartyVulnerability(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateFirstPartyVulnerabilityById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_first_party_vulnerabilitiesPgResource, {
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
      updateGcpApplication: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_gcp_applicationsPgResource, specFromArgs_GcpApplication(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateGcpApplicationById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_gcp_applicationsPgResource, {
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
      updateLogEntry: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_log_entriesPgResource, specFromArgs_LogEntry(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateLogEntryById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_log_entriesPgResource, {
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
      updateOrganization: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_organizationsPgResource, specFromArgs_Organization(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateOrganizationByName: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_organizationsPgResource, {
            name: args.getRaw(['input', "name"])
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
      updateOrganizationByOrganizationId: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_organizationsPgResource, {
            organization_id: args.getRaw(['input', "organizationId"])
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
      updatePerson: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(otherSource_peoplePgResource, specFromArgs_Person(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updatePersonByPersonId: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(otherSource_peoplePgResource, {
            person_id: args.getRaw(['input', "personId"])
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
      updatePersonByUsername: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(otherSource_peoplePgResource, {
            username: args.getRaw(['input', "username"])
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
      updateRelationalItemRelation: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_relational_item_relationsPgResource, specFromArgs_RelationalItemRelation(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateRelationalItemRelationById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_relational_item_relationsPgResource, {
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
      updateRelationalItemRelationByParentIdAndChildId: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_relational_item_relationsPgResource, {
            parent_id: args.getRaw(['input', "parentId"]),
            child_id: args.getRaw(['input', "childId"])
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
      updateRelationalItemRelationCompositePk: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_relational_item_relation_composite_pksPgResource, specFromArgs_RelationalItemRelationCompositePk(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateRelationalItemRelationCompositePkByParentIdAndChildId: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_relational_item_relation_composite_pksPgResource, {
            parent_id: args.getRaw(['input', "parentId"]),
            child_id: args.getRaw(['input', "childId"])
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
      updateSingleTableItemRelation: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(otherSource_single_table_item_relationsPgResource, specFromArgs_SingleTableItemRelation(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateSingleTableItemRelationById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(otherSource_single_table_item_relationsPgResource, {
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
      updateSingleTableItemRelationByParentIdAndChildId: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(otherSource_single_table_item_relationsPgResource, {
            parent_id: args.getRaw(['input', "parentId"]),
            child_id: args.getRaw(['input', "childId"])
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
      updateSingleTableItemRelationCompositePk: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(otherSource_single_table_item_relation_composite_pksPgResource, specFromArgs_SingleTableItemRelationCompositePk(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateSingleTableItemRelationCompositePkByParentIdAndChildId: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(otherSource_single_table_item_relation_composite_pksPgResource, {
            parent_id: args.getRaw(['input', "parentId"]),
            child_id: args.getRaw(['input', "childId"])
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
      updateThirdPartyVulnerability: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_third_party_vulnerabilitiesPgResource, specFromArgs_ThirdPartyVulnerability(args));
          args.apply($update);
          return object({
            result: $update
          });
        },
        args: {
          input: applyInputToUpdateOrDelete
        }
      },
      updateThirdPartyVulnerabilityById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(spec_resource_third_party_vulnerabilitiesPgResource, {
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
  ApplicationsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  AwsApplication: {
    assertStep: assertPgClassSingleStep,
    plans: {
      awsId($record) {
        return $record.get("aws_id");
      },
      lastDeployed($record) {
        return $record.get("last_deployed");
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_AwsApplication.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_AwsApplication.codec.name].encode);
      },
      organizationByOrganizationId($record) {
        return spec_resource_organizationsPgResource.get({
          organization_id: $record.get("organization_id")
        });
      },
      organizationId($record) {
        return $record.get("organization_id");
      },
      owner($parent) {
        const $record = $parent;
        for (let i = 0, l = paths4.length; i < l; i++) {
          const path = paths4[i];
          const firstLayer = path.layers[0];
          const member = members4[i];
          member.match = firstLayer.localAttributes.reduce((memo, col, idx) => {
            memo[firstLayer.remoteAttributes[idx]] = {
              step: $record.get(col)
            };
            return memo;
          }, Object.create(null));
        }
        const $list = pgUnionAll({
          attributes: attributes2,
          resourceByTypeName: resourceByTypeName4,
          members: members4,
          name: "owner"
        });
        return $list.single();
      },
      personByPersonId($record) {
        return otherSource_peoplePgResource.get({
          person_id: $record.get("person_id")
        });
      },
      personId($record) {
        return $record.get("person_id");
      },
      vulnerabilities: {
        plan($parent) {
          const $record = $parent;
          for (let i = 0, l = paths3.length; i < l; i++) {
            const path = paths3[i];
            const firstLayer = path.layers[0];
            const member = members3[i];
            member.match = firstLayer.localAttributes.reduce((memo, col, idx) => {
              memo[firstLayer.remoteAttributes[idx]] = {
                step: $record.get(col)
              };
              return memo;
            }, Object.create(null));
          }
          const $list = pgUnionAll({
            attributes: spec_Vulnerability.attributes,
            resourceByTypeName: resourceByTypeName3,
            members: members3,
            name: "vulnerabilities"
          });
          return connection($list);
        },
        args: {
          first: applyFirstArg,
          last: applyLastArg,
          offset: applyOffsetArg,
          before: applyBeforeArg,
          after: applyAfterArg,
          condition: applyConditionArgToConnection,
          only: applyConnectionLimitToTypes,
          orderBy: applyOrderByArgToConnection
        }
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of aws_applicationsUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return spec_resource_aws_applicationsPgResource.get(spec);
    }
  },
  AwsApplicationsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  CollectionsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  CreateAwsApplicationPayload: {
    assertStep: assertStep,
    plans: {
      awsApplication: planCreatePayloadResult,
      awsApplicationEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(spec_resource_aws_applicationsPgResource, aws_applicationsUniques[0].attributes, $mutation, fieldArgs);
      },
      clientMutationId: getClientMutationIdForCreatePlan,
      organizationByOrganizationId($record) {
        return spec_resource_organizationsPgResource.get({
          organization_id: $record.get("result").get("organization_id")
        });
      },
      personByPersonId($record) {
        return otherSource_peoplePgResource.get({
          person_id: $record.get("result").get("person_id")
        });
      },
      query: queryPlan
    }
  },
  CreateFirstPartyVulnerabilityPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      firstPartyVulnerability: planCreatePayloadResult,
      firstPartyVulnerabilityEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(spec_resource_first_party_vulnerabilitiesPgResource, first_party_vulnerabilitiesUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  CreateGcpApplicationPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      gcpApplication: planCreatePayloadResult,
      gcpApplicationEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(spec_resource_gcp_applicationsPgResource, gcp_applicationsUniques[0].attributes, $mutation, fieldArgs);
      },
      organizationByOrganizationId($record) {
        return spec_resource_organizationsPgResource.get({
          organization_id: $record.get("result").get("organization_id")
        });
      },
      personByPersonId($record) {
        return otherSource_peoplePgResource.get({
          person_id: $record.get("result").get("person_id")
        });
      },
      query: queryPlan
    }
  },
  CreateLogEntryPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      logEntry: planCreatePayloadResult,
      logEntryEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(spec_resource_log_entriesPgResource, log_entriesUniques[0].attributes, $mutation, fieldArgs);
      },
      organizationByOrganizationId($record) {
        return spec_resource_organizationsPgResource.get({
          organization_id: $record.get("result").get("organization_id")
        });
      },
      personByPersonId($record) {
        return otherSource_peoplePgResource.get({
          person_id: $record.get("result").get("person_id")
        });
      },
      query: queryPlan
    }
  },
  CreateOrganizationPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      organization: planCreatePayloadResult,
      organizationEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(spec_resource_organizationsPgResource, organizationsUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  CreatePersonPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      person: planCreatePayloadResult,
      personEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(otherSource_peoplePgResource, peopleUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  CreateRelationalItemRelationCompositePkPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan,
      relationalItemByChildId($record) {
        return otherSource_relational_itemsPgResource.get({
          id: $record.get("result").get("child_id")
        });
      },
      relationalItemByParentId($record) {
        return otherSource_relational_itemsPgResource.get({
          id: $record.get("result").get("parent_id")
        });
      },
      relationalItemRelationCompositePk: planCreatePayloadResult,
      relationalItemRelationCompositePkEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(spec_resource_relational_item_relation_composite_pksPgResource, relational_item_relation_composite_pksUniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  CreateRelationalItemRelationPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan,
      relationalItemByChildId($record) {
        return otherSource_relational_itemsPgResource.get({
          id: $record.get("result").get("child_id")
        });
      },
      relationalItemByParentId($record) {
        return otherSource_relational_itemsPgResource.get({
          id: $record.get("result").get("parent_id")
        });
      },
      relationalItemRelation: planCreatePayloadResult,
      relationalItemRelationEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(spec_resource_relational_item_relationsPgResource, relational_item_relationsUniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  CreateSingleTableItemRelationCompositePkPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan,
      singleTableItemByChildId($record) {
        return resource_single_table_itemsPgResource.get({
          id: $record.get("result").get("child_id")
        });
      },
      singleTableItemByParentId($record) {
        return resource_single_table_itemsPgResource.get({
          id: $record.get("result").get("parent_id")
        });
      },
      singleTableItemRelationCompositePk: planCreatePayloadResult,
      singleTableItemRelationCompositePkEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(otherSource_single_table_item_relation_composite_pksPgResource, single_table_item_relation_composite_pksUniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  CreateSingleTableItemRelationPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan,
      singleTableItemByChildId($record) {
        return resource_single_table_itemsPgResource.get({
          id: $record.get("result").get("child_id")
        });
      },
      singleTableItemByParentId($record) {
        return resource_single_table_itemsPgResource.get({
          id: $record.get("result").get("parent_id")
        });
      },
      singleTableItemRelation: planCreatePayloadResult,
      singleTableItemRelationEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(otherSource_single_table_item_relationsPgResource, single_table_item_relationsUniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  CreateThirdPartyVulnerabilityPayload: {
    assertStep: assertStep,
    plans: {
      clientMutationId: getClientMutationIdForCreatePlan,
      query: queryPlan,
      thirdPartyVulnerability: planCreatePayloadResult,
      thirdPartyVulnerabilityEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(spec_resource_third_party_vulnerabilitiesPgResource, third_party_vulnerabilitiesUniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  CustomDeleteRelationalItemPayload: {
    assertStep: ObjectStep,
    plans: {
      boolean($object) {
        return $object.get("result");
      },
      clientMutationId($object) {
        const $result = $object.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      query: queryPlan
    }
  },
  DeleteAwsApplicationPayload: {
    assertStep: ObjectStep,
    plans: {
      awsApplication: planUpdateOrDeletePayloadResult,
      awsApplicationEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(spec_resource_aws_applicationsPgResource, aws_applicationsUniques[0].attributes, $mutation, fieldArgs);
      },
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedAwsApplicationId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_AwsApplication.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      organizationByOrganizationId($record) {
        return spec_resource_organizationsPgResource.get({
          organization_id: $record.get("result").get("organization_id")
        });
      },
      personByPersonId($record) {
        return otherSource_peoplePgResource.get({
          person_id: $record.get("result").get("person_id")
        });
      },
      query: queryPlan
    }
  },
  DeleteFirstPartyVulnerabilityPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedFirstPartyVulnerabilityId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_FirstPartyVulnerability.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      firstPartyVulnerability: planUpdateOrDeletePayloadResult,
      firstPartyVulnerabilityEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(spec_resource_first_party_vulnerabilitiesPgResource, first_party_vulnerabilitiesUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  DeleteGcpApplicationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedGcpApplicationId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_GcpApplication.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      gcpApplication: planUpdateOrDeletePayloadResult,
      gcpApplicationEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(spec_resource_gcp_applicationsPgResource, gcp_applicationsUniques[0].attributes, $mutation, fieldArgs);
      },
      organizationByOrganizationId($record) {
        return spec_resource_organizationsPgResource.get({
          organization_id: $record.get("result").get("organization_id")
        });
      },
      personByPersonId($record) {
        return otherSource_peoplePgResource.get({
          person_id: $record.get("result").get("person_id")
        });
      },
      query: queryPlan
    }
  },
  DeleteLogEntryPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedLogEntryId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_LogEntry.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      logEntry: planUpdateOrDeletePayloadResult,
      logEntryEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(spec_resource_log_entriesPgResource, log_entriesUniques[0].attributes, $mutation, fieldArgs);
      },
      organizationByOrganizationId($record) {
        return spec_resource_organizationsPgResource.get({
          organization_id: $record.get("result").get("organization_id")
        });
      },
      personByPersonId($record) {
        return otherSource_peoplePgResource.get({
          person_id: $record.get("result").get("person_id")
        });
      },
      query: queryPlan
    }
  },
  DeleteOrganizationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedOrganizationId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Organization.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      organization: planUpdateOrDeletePayloadResult,
      organizationEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(spec_resource_organizationsPgResource, organizationsUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  DeletePersonPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedPersonId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_Person.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      person: planUpdateOrDeletePayloadResult,
      personEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(otherSource_peoplePgResource, peopleUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  DeleteRelationalItemRelationCompositePkPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedRelationalItemRelationCompositePkId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_RelationalItemRelationCompositePk.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      query: queryPlan,
      relationalItemByChildId($record) {
        return otherSource_relational_itemsPgResource.get({
          id: $record.get("result").get("child_id")
        });
      },
      relationalItemByParentId($record) {
        return otherSource_relational_itemsPgResource.get({
          id: $record.get("result").get("parent_id")
        });
      },
      relationalItemRelationCompositePk: planUpdateOrDeletePayloadResult,
      relationalItemRelationCompositePkEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(spec_resource_relational_item_relation_composite_pksPgResource, relational_item_relation_composite_pksUniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  DeleteRelationalItemRelationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedRelationalItemRelationId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_RelationalItemRelation.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      query: queryPlan,
      relationalItemByChildId($record) {
        return otherSource_relational_itemsPgResource.get({
          id: $record.get("result").get("child_id")
        });
      },
      relationalItemByParentId($record) {
        return otherSource_relational_itemsPgResource.get({
          id: $record.get("result").get("parent_id")
        });
      },
      relationalItemRelation: planUpdateOrDeletePayloadResult,
      relationalItemRelationEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(spec_resource_relational_item_relationsPgResource, relational_item_relationsUniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  DeleteSingleTableItemRelationCompositePkPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedSingleTableItemRelationCompositePkId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_SingleTableItemRelationCompositePk.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      query: queryPlan,
      singleTableItemByChildId($record) {
        return resource_single_table_itemsPgResource.get({
          id: $record.get("result").get("child_id")
        });
      },
      singleTableItemByParentId($record) {
        return resource_single_table_itemsPgResource.get({
          id: $record.get("result").get("parent_id")
        });
      },
      singleTableItemRelationCompositePk: planUpdateOrDeletePayloadResult,
      singleTableItemRelationCompositePkEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(otherSource_single_table_item_relation_composite_pksPgResource, single_table_item_relation_composite_pksUniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  DeleteSingleTableItemRelationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedSingleTableItemRelationId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_SingleTableItemRelation.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      query: queryPlan,
      singleTableItemByChildId($record) {
        return resource_single_table_itemsPgResource.get({
          id: $record.get("result").get("child_id")
        });
      },
      singleTableItemByParentId($record) {
        return resource_single_table_itemsPgResource.get({
          id: $record.get("result").get("parent_id")
        });
      },
      singleTableItemRelation: planUpdateOrDeletePayloadResult,
      singleTableItemRelationEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(otherSource_single_table_item_relationsPgResource, single_table_item_relationsUniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  DeleteThirdPartyVulnerabilityPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      deletedThirdPartyVulnerabilityId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandler_ThirdPartyVulnerability.plan($record);
        return lambda(specifier, base64JSONNodeIdCodec.encode);
      },
      query: queryPlan,
      thirdPartyVulnerability: planUpdateOrDeletePayloadResult,
      thirdPartyVulnerabilityEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(spec_resource_third_party_vulnerabilitiesPgResource, third_party_vulnerabilitiesUniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  FirstPartyVulnerabilitiesConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  FirstPartyVulnerability: {
    assertStep: assertPgClassSingleStep,
    plans: {
      applications: {
        plan($parent) {
          const $record = $parent;
          for (let i = 0, l = paths7.length; i < l; i++) {
            const path = paths7[i];
            const firstLayer = path.layers[0];
            const member = members10[i];
            member.match = firstLayer.localAttributes.reduce((memo, col, idx) => {
              memo[firstLayer.remoteAttributes[idx]] = {
                step: $record.get(col)
              };
              return memo;
            }, Object.create(null));
          }
          const $list = pgUnionAll({
            attributes: spec_Application.attributes,
            resourceByTypeName: resourceByTypeName13,
            members: members10,
            name: "applications"
          });
          return connection($list);
        },
        args: {
          first: applyFirstArg,
          last: applyLastArg,
          offset: applyOffsetArg,
          before: applyBeforeArg,
          after: applyAfterArg,
          condition: applyConditionArgToConnection,
          only: applyConnectionLimitToTypes,
          orderBy: applyOrderByArgToConnection
        }
      },
      cvssScore($record) {
        return $record.get("cvss_score");
      },
      cvssScoreInt($in, args, _info) {
        return scalarComputed(resource_first_party_vulnerabilities_cvss_score_intPgResource, $in, makeArgs_first_party_vulnerabilities_cvss_score_int(args));
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_FirstPartyVulnerability.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_FirstPartyVulnerability.codec.name].encode);
      },
      owners($parent) {
        const $record = $parent;
        for (let i = 0, l = paths8.length; i < l; i++) {
          const path = paths8[i];
          const firstLayer = path.layers[0];
          const member = members11[i];
          member.match = firstLayer.localAttributes.reduce((memo, col, idx) => {
            memo[firstLayer.remoteAttributes[idx]] = {
              step: $record.get(col)
            };
            return memo;
          }, Object.create(null));
        }
        const $list = pgUnionAll({
          attributes: attributes4,
          resourceByTypeName: resourceByTypeName14,
          members: members11,
          name: "owners"
        });
        return connection($list);
      },
      teamName($record) {
        return $record.get("team_name");
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of first_party_vulnerabilitiesUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return spec_resource_first_party_vulnerabilitiesPgResource.get(spec);
    }
  },
  GcpApplication: {
    assertStep: assertPgClassSingleStep,
    plans: {
      gcpId($record) {
        return $record.get("gcp_id");
      },
      lastDeployed($record) {
        return $record.get("last_deployed");
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_GcpApplication.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_GcpApplication.codec.name].encode);
      },
      organizationByOrganizationId($record) {
        return spec_resource_organizationsPgResource.get({
          organization_id: $record.get("organization_id")
        });
      },
      organizationId($record) {
        return $record.get("organization_id");
      },
      owner($parent) {
        const $record = $parent;
        for (let i = 0, l = paths6.length; i < l; i++) {
          const path = paths6[i];
          const firstLayer = path.layers[0];
          const member = members6[i];
          member.match = firstLayer.localAttributes.reduce((memo, col, idx) => {
            memo[firstLayer.remoteAttributes[idx]] = {
              step: $record.get(col)
            };
            return memo;
          }, Object.create(null));
        }
        const $list = pgUnionAll({
          attributes: attributes3,
          resourceByTypeName: resourceByTypeName9,
          members: members6,
          name: "owner"
        });
        return $list.single();
      },
      personByPersonId($record) {
        return otherSource_peoplePgResource.get({
          person_id: $record.get("person_id")
        });
      },
      personId($record) {
        return $record.get("person_id");
      },
      vulnerabilities: {
        plan($parent) {
          const $record = $parent;
          for (let i = 0, l = paths5.length; i < l; i++) {
            const path = paths5[i];
            const firstLayer = path.layers[0];
            const member = members5[i];
            member.match = firstLayer.localAttributes.reduce((memo, col, idx) => {
              memo[firstLayer.remoteAttributes[idx]] = {
                step: $record.get(col)
              };
              return memo;
            }, Object.create(null));
          }
          const $list = pgUnionAll({
            attributes: spec_Vulnerability.attributes,
            resourceByTypeName: resourceByTypeName8,
            members: members5,
            name: "vulnerabilities"
          });
          return connection($list);
        },
        args: {
          first: applyFirstArg,
          last: applyLastArg,
          offset: applyOffsetArg,
          before: applyBeforeArg,
          after: applyAfterArg,
          condition: applyConditionArgToConnection,
          only: applyConnectionLimitToTypes,
          orderBy: applyOrderByArgToConnection
        }
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of gcp_applicationsUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return spec_resource_gcp_applicationsPgResource.get(spec);
    }
  },
  GcpApplicationsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  LogEntriesConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  LogEntry: {
    assertStep: assertPgClassSingleStep,
    plans: {
      author($parent) {
        const $record = $parent;
        for (let i = 0, l = paths2.length; i < l; i++) {
          const path = paths2[i];
          const firstLayer = path.layers[0];
          const member = members2[i];
          member.match = firstLayer.localAttributes.reduce((memo, col, idx) => {
            memo[firstLayer.remoteAttributes[idx]] = {
              step: $record.get(col)
            };
            return memo;
          }, Object.create(null));
        }
        const $list = pgUnionAll({
          attributes,
          resourceByTypeName: resourceByTypeName2,
          members: members2,
          name: "author"
        });
        return $list.single();
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_LogEntry.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_LogEntry.codec.name].encode);
      },
      organizationByOrganizationId($record) {
        return spec_resource_organizationsPgResource.get({
          organization_id: $record.get("organization_id")
        });
      },
      organizationId($record) {
        return $record.get("organization_id");
      },
      personByPersonId($record) {
        return otherSource_peoplePgResource.get({
          person_id: $record.get("person_id")
        });
      },
      personId($record) {
        return $record.get("person_id");
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of log_entriesUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return spec_resource_log_entriesPgResource.get(spec);
    }
  },
  MovieCollection: {
    assertStep: assertPgClassSingleStep,
    plans: {
      col001($record) {
        return $record.get("col_001");
      },
      col002($record) {
        return $record.get("col_002");
      },
      col003($record) {
        return $record.get("col_003");
      },
      col004($record) {
        return $record.get("col_004");
      },
      col005($record) {
        return $record.get("col_005");
      },
      col006($record) {
        return $record.get("col_006");
      },
      col007($record) {
        return $record.get("col_007");
      },
      col008($record) {
        return $record.get("col_008");
      },
      col009($record) {
        return $record.get("col_009");
      },
      col010($record) {
        return $record.get("col_010");
      },
      col011($record) {
        return $record.get("col_011");
      },
      col012($record) {
        return $record.get("col_012");
      },
      col013($record) {
        return $record.get("col_013");
      },
      col014($record) {
        return $record.get("col_014");
      },
      col015($record) {
        return $record.get("col_015");
      },
      col016($record) {
        return $record.get("col_016");
      },
      col017($record) {
        return $record.get("col_017");
      },
      col018($record) {
        return $record.get("col_018");
      },
      col019($record) {
        return $record.get("col_019");
      },
      col020($record) {
        return $record.get("col_020");
      },
      col021($record) {
        return $record.get("col_021");
      },
      col022($record) {
        return $record.get("col_022");
      },
      col023($record) {
        return $record.get("col_023");
      },
      col024($record) {
        return $record.get("col_024");
      },
      col025($record) {
        return $record.get("col_025");
      },
      col026($record) {
        return $record.get("col_026");
      },
      col027($record) {
        return $record.get("col_027");
      },
      col028($record) {
        return $record.get("col_028");
      },
      col029($record) {
        return $record.get("col_029");
      },
      col030($record) {
        return $record.get("col_030");
      },
      col031($record) {
        return $record.get("col_031");
      },
      col032($record) {
        return $record.get("col_032");
      },
      col033($record) {
        return $record.get("col_033");
      },
      col034($record) {
        return $record.get("col_034");
      },
      col035($record) {
        return $record.get("col_035");
      },
      col036($record) {
        return $record.get("col_036");
      },
      col037($record) {
        return $record.get("col_037");
      },
      col038($record) {
        return $record.get("col_038");
      },
      col039($record) {
        return $record.get("col_039");
      },
      col040($record) {
        return $record.get("col_040");
      },
      col041($record) {
        return $record.get("col_041");
      },
      col042($record) {
        return $record.get("col_042");
      },
      col043($record) {
        return $record.get("col_043");
      },
      col044($record) {
        return $record.get("col_044");
      },
      col045($record) {
        return $record.get("col_045");
      },
      col046($record) {
        return $record.get("col_046");
      },
      col047($record) {
        return $record.get("col_047");
      },
      col048($record) {
        return $record.get("col_048");
      },
      col049($record) {
        return $record.get("col_049");
      },
      col050($record) {
        return $record.get("col_050");
      },
      col051($record) {
        return $record.get("col_051");
      },
      col052($record) {
        return $record.get("col_052");
      },
      col053($record) {
        return $record.get("col_053");
      },
      col054($record) {
        return $record.get("col_054");
      },
      col055($record) {
        return $record.get("col_055");
      },
      col056($record) {
        return $record.get("col_056");
      },
      col057($record) {
        return $record.get("col_057");
      },
      col058($record) {
        return $record.get("col_058");
      },
      col059($record) {
        return $record.get("col_059");
      },
      col060($record) {
        return $record.get("col_060");
      },
      col061($record) {
        return $record.get("col_061");
      },
      col062($record) {
        return $record.get("col_062");
      },
      col063($record) {
        return $record.get("col_063");
      },
      col064($record) {
        return $record.get("col_064");
      },
      col065($record) {
        return $record.get("col_065");
      },
      col066($record) {
        return $record.get("col_066");
      },
      col067($record) {
        return $record.get("col_067");
      },
      col068($record) {
        return $record.get("col_068");
      },
      col069($record) {
        return $record.get("col_069");
      },
      col070($record) {
        return $record.get("col_070");
      },
      col071($record) {
        return $record.get("col_071");
      },
      col072($record) {
        return $record.get("col_072");
      },
      col073($record) {
        return $record.get("col_073");
      },
      col074($record) {
        return $record.get("col_074");
      },
      col075($record) {
        return $record.get("col_075");
      },
      col076($record) {
        return $record.get("col_076");
      },
      col077($record) {
        return $record.get("col_077");
      },
      col078($record) {
        return $record.get("col_078");
      },
      col079($record) {
        return $record.get("col_079");
      },
      col080($record) {
        return $record.get("col_080");
      },
      col081($record) {
        return $record.get("col_081");
      },
      col082($record) {
        return $record.get("col_082");
      },
      col083($record) {
        return $record.get("col_083");
      },
      col084($record) {
        return $record.get("col_084");
      },
      col085($record) {
        return $record.get("col_085");
      },
      col086($record) {
        return $record.get("col_086");
      },
      col087($record) {
        return $record.get("col_087");
      },
      col088($record) {
        return $record.get("col_088");
      },
      col089($record) {
        return $record.get("col_089");
      },
      col090($record) {
        return $record.get("col_090");
      },
      col091($record) {
        return $record.get("col_091");
      },
      col092($record) {
        return $record.get("col_092");
      },
      col093($record) {
        return $record.get("col_093");
      },
      col094($record) {
        return $record.get("col_094");
      },
      col095($record) {
        return $record.get("col_095");
      },
      col096($record) {
        return $record.get("col_096");
      },
      col097($record) {
        return $record.get("col_097");
      },
      col098($record) {
        return $record.get("col_098");
      },
      col099($record) {
        return $record.get("col_099");
      },
      col100($record) {
        return $record.get("col_100");
      },
      createdAt($record) {
        return $record.get("created_at");
      },
      nodeId($parent) {
        const specifier = nodeIdHandlerByTypeName.MovieCollection.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.MovieCollection.codec.name].encode);
      }
    }
  },
  Organization: {
    assertStep: assertPgClassSingleStep,
    plans: {
      awsApplicationsByOrganizationId: {
        plan($record) {
          const $records = spec_resource_aws_applicationsPgResource.find({
            organization_id: $record.get("organization_id")
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
      },
      gcpApplicationsByOrganizationId: {
        plan($record) {
          const $records = spec_resource_gcp_applicationsPgResource.find({
            organization_id: $record.get("organization_id")
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
      },
      logEntriesByOrganizationId: {
        plan($record) {
          const $records = spec_resource_log_entriesPgResource.find({
            organization_id: $record.get("organization_id")
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
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_Organization.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Organization.codec.name].encode);
      },
      organizationId($record) {
        return $record.get("organization_id");
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of organizationsUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return spec_resource_organizationsPgResource.get(spec);
    }
  },
  OrganizationsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  PeopleConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  Person: {
    assertStep: assertPgClassSingleStep,
    plans: {
      applications: {
        plan($parent) {
          const $record = $parent;
          for (let i = 0, l = paths.length; i < l; i++) {
            const path = paths[i];
            const firstLayer = path.layers[0];
            const member = members[i];
            member.match = firstLayer.localAttributes.reduce((memo, col, idx) => {
              memo[firstLayer.remoteAttributes[idx]] = {
                step: $record.get(col)
              };
              return memo;
            }, Object.create(null));
          }
          const $list = pgUnionAll({
            attributes: spec_Application.attributes,
            resourceByTypeName,
            members,
            name: "applications"
          });
          return connection($list);
        },
        args: {
          first: applyFirstArg,
          last: applyLastArg,
          offset: applyOffsetArg,
          before: applyBeforeArg,
          after: applyAfterArg,
          condition: applyConditionArgToConnection,
          only: applyConnectionLimitToTypes,
          orderBy: applyOrderByArgToConnection
        }
      },
      awsApplicationsByPersonId: {
        plan($record) {
          const $records = spec_resource_aws_applicationsPgResource.find({
            person_id: $record.get("person_id")
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
      },
      gcpApplicationsByPersonId: {
        plan($record) {
          const $records = spec_resource_gcp_applicationsPgResource.find({
            person_id: $record.get("person_id")
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
      },
      logEntriesByPersonId: {
        plan($record) {
          const $records = spec_resource_log_entriesPgResource.find({
            person_id: $record.get("person_id")
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
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_Person.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Person.codec.name].encode);
      },
      personId($record) {
        return $record.get("person_id");
      },
      relationalItemsByAuthorId: {
        plan($record) {
          const $records = otherSource_relational_itemsPgResource.find({
            author_id: $record.get("person_id")
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
      },
      singleTableItemsByAuthorId: {
        plan($record) {
          const $records = resource_single_table_itemsPgResource.find({
            author_id: $record.get("person_id")
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
      for (const pkCol of peopleUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return otherSource_peoplePgResource.get(spec);
    }
  },
  PersonOrOrganizationConnection: {
    assertStep: ConnectionStep
  },
  PrioritiesConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  Priority: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nodeId($parent) {
        const specifier = nodeIdHandler_Priority.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_Priority.codec.name].encode);
      },
      singleTableItemsByPriorityId: {
        plan($record) {
          const $records = resource_single_table_itemsPgResource.find({
            priority_id: $record.get("id")
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
      for (const pkCol of prioritiesUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return spec_resource_prioritiesPgResource.get(spec);
    }
  },
  RelationalChecklist: {
    assertStep: assertPgClassSingleStep,
    plans: {
      archivedAt($record) {
        return $record.get("archived_at");
      },
      authorId($record) {
        return $record.get("author_id");
      },
      createdAt($record) {
        return $record.get("created_at");
      },
      isExplicitlyArchived($record) {
        return $record.get("is_explicitly_archived");
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_RelationalChecklist.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_RelationalChecklist.codec.name].encode);
      },
      parentId($record) {
        return $record.get("parent_id");
      },
      personByAuthorId($record) {
        const $people = otherSource_peoplePgResource.find();
        let previousAlias = $people.alias;
        const relational_itemsAlias = sql.identifier(Symbol("relational_items"));
        $people.join({
          type: "inner",
          from: otherSource_relational_itemsPgResource.from,
          alias: relational_itemsAlias,
          conditions: [sql`${previousAlias}.${sql.identifier("person_id")} = ${relational_itemsAlias}.${sql.identifier("author_id")}`]
        });
        previousAlias = relational_itemsAlias;
        $people.where(sql`${previousAlias}.${sql.identifier("id")} = ${$people.placeholder($record.get("checklist_item_id"))}`);
        return $people.single();
      },
      relationalItemByParentId($record) {
        const $relational_items = otherSource_relational_itemsPgResource.find();
        let previousAlias = $relational_items.alias;
        const relational_itemsAlias = sql.identifier(Symbol("relational_items"));
        $relational_items.join({
          type: "inner",
          from: otherSource_relational_itemsPgResource.from,
          alias: relational_itemsAlias,
          conditions: [sql`${previousAlias}.${sql.identifier("id")} = ${relational_itemsAlias}.${sql.identifier("parent_id")}`]
        });
        previousAlias = relational_itemsAlias;
        $relational_items.where(sql`${previousAlias}.${sql.identifier("id")} = ${$relational_items.placeholder($record.get("checklist_item_id"))}`);
        return $relational_items.single();
      },
      relationalItemRelationCompositePksByChildId: {
        plan($record) {
          const $relational_item_relation_composite_pks = spec_resource_relational_item_relation_composite_pksPgResource.find();
          let previousAlias = $relational_item_relation_composite_pks.alias;
          const relational_itemsAlias = sql.identifier(Symbol("relational_items"));
          $relational_item_relation_composite_pks.join({
            type: "inner",
            from: otherSource_relational_itemsPgResource.from,
            alias: relational_itemsAlias,
            conditions: [sql`${previousAlias}.${sql.identifier("child_id")} = ${relational_itemsAlias}.${sql.identifier("id")}`]
          });
          previousAlias = relational_itemsAlias;
          $relational_item_relation_composite_pks.where(sql`${previousAlias}.${sql.identifier("id")} = ${$relational_item_relation_composite_pks.placeholder($record.get("checklist_item_id"))}`);
          return connection($relational_item_relation_composite_pks);
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
      relationalItemRelationCompositePksByParentId: {
        plan($record) {
          const $relational_item_relation_composite_pks = spec_resource_relational_item_relation_composite_pksPgResource.find();
          let previousAlias = $relational_item_relation_composite_pks.alias;
          const relational_itemsAlias = sql.identifier(Symbol("relational_items"));
          $relational_item_relation_composite_pks.join({
            type: "inner",
            from: otherSource_relational_itemsPgResource.from,
            alias: relational_itemsAlias,
            conditions: [sql`${previousAlias}.${sql.identifier("parent_id")} = ${relational_itemsAlias}.${sql.identifier("id")}`]
          });
          previousAlias = relational_itemsAlias;
          $relational_item_relation_composite_pks.where(sql`${previousAlias}.${sql.identifier("id")} = ${$relational_item_relation_composite_pks.placeholder($record.get("checklist_item_id"))}`);
          return connection($relational_item_relation_composite_pks);
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
      relationalItemRelationsByChildId: {
        plan($record) {
          const $relational_item_relations = spec_resource_relational_item_relationsPgResource.find();
          let previousAlias = $relational_item_relations.alias;
          const relational_itemsAlias = sql.identifier(Symbol("relational_items"));
          $relational_item_relations.join({
            type: "inner",
            from: otherSource_relational_itemsPgResource.from,
            alias: relational_itemsAlias,
            conditions: [sql`${previousAlias}.${sql.identifier("child_id")} = ${relational_itemsAlias}.${sql.identifier("id")}`]
          });
          previousAlias = relational_itemsAlias;
          $relational_item_relations.where(sql`${previousAlias}.${sql.identifier("id")} = ${$relational_item_relations.placeholder($record.get("checklist_item_id"))}`);
          return connection($relational_item_relations);
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
      relationalItemRelationsByParentId: {
        plan($record) {
          const $relational_item_relations = spec_resource_relational_item_relationsPgResource.find();
          let previousAlias = $relational_item_relations.alias;
          const relational_itemsAlias = sql.identifier(Symbol("relational_items"));
          $relational_item_relations.join({
            type: "inner",
            from: otherSource_relational_itemsPgResource.from,
            alias: relational_itemsAlias,
            conditions: [sql`${previousAlias}.${sql.identifier("parent_id")} = ${relational_itemsAlias}.${sql.identifier("id")}`]
          });
          previousAlias = relational_itemsAlias;
          $relational_item_relations.where(sql`${previousAlias}.${sql.identifier("id")} = ${$relational_item_relations.placeholder($record.get("checklist_item_id"))}`);
          return connection($relational_item_relations);
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
      relationalItemsByParentId: {
        plan($record) {
          const $relational_items = otherSource_relational_itemsPgResource.find();
          let previousAlias = $relational_items.alias;
          const relational_itemsAlias = sql.identifier(Symbol("relational_items"));
          $relational_items.join({
            type: "inner",
            from: otherSource_relational_itemsPgResource.from,
            alias: relational_itemsAlias,
            conditions: [sql`${previousAlias}.${sql.identifier("parent_id")} = ${relational_itemsAlias}.${sql.identifier("id")}`]
          });
          previousAlias = relational_itemsAlias;
          $relational_items.where(sql`${previousAlias}.${sql.identifier("id")} = ${$relational_items.placeholder($record.get("checklist_item_id"))}`);
          return connection($relational_items);
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
      relationalTopicByRootTopicId($record) {
        const $relational_topics = spec_resource_relational_topicsPgResource.find();
        let previousAlias = $relational_topics.alias;
        const relational_itemsAlias = sql.identifier(Symbol("relational_items"));
        $relational_topics.join({
          type: "inner",
          from: otherSource_relational_itemsPgResource.from,
          alias: relational_itemsAlias,
          conditions: [sql`${previousAlias}.${sql.identifier("topic_item_id")} = ${relational_itemsAlias}.${sql.identifier("root_topic_id")}`]
        });
        previousAlias = relational_itemsAlias;
        $relational_topics.where(sql`${previousAlias}.${sql.identifier("id")} = ${$relational_topics.placeholder($record.get("checklist_item_id"))}`);
        return $relational_topics.single();
      },
      rootTopicId($record) {
        return $record.get("root_topic_id");
      },
      updatedAt($record) {
        return $record.get("updated_at");
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of relational_checklistsUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return spec_resource_relational_checklistsPgResource.get(spec);
    }
  },
  RelationalChecklistItem: {
    assertStep: assertPgClassSingleStep,
    plans: {
      archivedAt($record) {
        return $record.get("archived_at");
      },
      authorId($record) {
        return $record.get("author_id");
      },
      createdAt($record) {
        return $record.get("created_at");
      },
      isExplicitlyArchived($record) {
        return $record.get("is_explicitly_archived");
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_RelationalChecklistItem.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_RelationalChecklistItem.codec.name].encode);
      },
      parentId($record) {
        return $record.get("parent_id");
      },
      personByAuthorId($record) {
        const $people = otherSource_peoplePgResource.find();
        let previousAlias = $people.alias;
        const relational_itemsAlias = sql.identifier(Symbol("relational_items"));
        $people.join({
          type: "inner",
          from: otherSource_relational_itemsPgResource.from,
          alias: relational_itemsAlias,
          conditions: [sql`${previousAlias}.${sql.identifier("person_id")} = ${relational_itemsAlias}.${sql.identifier("author_id")}`]
        });
        previousAlias = relational_itemsAlias;
        $people.where(sql`${previousAlias}.${sql.identifier("id")} = ${$people.placeholder($record.get("checklist_item_item_id"))}`);
        return $people.single();
      },
      relationalItemByParentId($record) {
        const $relational_items = otherSource_relational_itemsPgResource.find();
        let previousAlias = $relational_items.alias;
        const relational_itemsAlias = sql.identifier(Symbol("relational_items"));
        $relational_items.join({
          type: "inner",
          from: otherSource_relational_itemsPgResource.from,
          alias: relational_itemsAlias,
          conditions: [sql`${previousAlias}.${sql.identifier("id")} = ${relational_itemsAlias}.${sql.identifier("parent_id")}`]
        });
        previousAlias = relational_itemsAlias;
        $relational_items.where(sql`${previousAlias}.${sql.identifier("id")} = ${$relational_items.placeholder($record.get("checklist_item_item_id"))}`);
        return $relational_items.single();
      },
      relationalItemRelationCompositePksByChildId: {
        plan($record) {
          const $relational_item_relation_composite_pks = spec_resource_relational_item_relation_composite_pksPgResource.find();
          let previousAlias = $relational_item_relation_composite_pks.alias;
          const relational_itemsAlias = sql.identifier(Symbol("relational_items"));
          $relational_item_relation_composite_pks.join({
            type: "inner",
            from: otherSource_relational_itemsPgResource.from,
            alias: relational_itemsAlias,
            conditions: [sql`${previousAlias}.${sql.identifier("child_id")} = ${relational_itemsAlias}.${sql.identifier("id")}`]
          });
          previousAlias = relational_itemsAlias;
          $relational_item_relation_composite_pks.where(sql`${previousAlias}.${sql.identifier("id")} = ${$relational_item_relation_composite_pks.placeholder($record.get("checklist_item_item_id"))}`);
          return connection($relational_item_relation_composite_pks);
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
      relationalItemRelationCompositePksByParentId: {
        plan($record) {
          const $relational_item_relation_composite_pks = spec_resource_relational_item_relation_composite_pksPgResource.find();
          let previousAlias = $relational_item_relation_composite_pks.alias;
          const relational_itemsAlias = sql.identifier(Symbol("relational_items"));
          $relational_item_relation_composite_pks.join({
            type: "inner",
            from: otherSource_relational_itemsPgResource.from,
            alias: relational_itemsAlias,
            conditions: [sql`${previousAlias}.${sql.identifier("parent_id")} = ${relational_itemsAlias}.${sql.identifier("id")}`]
          });
          previousAlias = relational_itemsAlias;
          $relational_item_relation_composite_pks.where(sql`${previousAlias}.${sql.identifier("id")} = ${$relational_item_relation_composite_pks.placeholder($record.get("checklist_item_item_id"))}`);
          return connection($relational_item_relation_composite_pks);
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
      relationalItemRelationsByChildId: {
        plan($record) {
          const $relational_item_relations = spec_resource_relational_item_relationsPgResource.find();
          let previousAlias = $relational_item_relations.alias;
          const relational_itemsAlias = sql.identifier(Symbol("relational_items"));
          $relational_item_relations.join({
            type: "inner",
            from: otherSource_relational_itemsPgResource.from,
            alias: relational_itemsAlias,
            conditions: [sql`${previousAlias}.${sql.identifier("child_id")} = ${relational_itemsAlias}.${sql.identifier("id")}`]
          });
          previousAlias = relational_itemsAlias;
          $relational_item_relations.where(sql`${previousAlias}.${sql.identifier("id")} = ${$relational_item_relations.placeholder($record.get("checklist_item_item_id"))}`);
          return connection($relational_item_relations);
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
      relationalItemRelationsByParentId: {
        plan($record) {
          const $relational_item_relations = spec_resource_relational_item_relationsPgResource.find();
          let previousAlias = $relational_item_relations.alias;
          const relational_itemsAlias = sql.identifier(Symbol("relational_items"));
          $relational_item_relations.join({
            type: "inner",
            from: otherSource_relational_itemsPgResource.from,
            alias: relational_itemsAlias,
            conditions: [sql`${previousAlias}.${sql.identifier("parent_id")} = ${relational_itemsAlias}.${sql.identifier("id")}`]
          });
          previousAlias = relational_itemsAlias;
          $relational_item_relations.where(sql`${previousAlias}.${sql.identifier("id")} = ${$relational_item_relations.placeholder($record.get("checklist_item_item_id"))}`);
          return connection($relational_item_relations);
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
      relationalItemsByParentId: {
        plan($record) {
          const $relational_items = otherSource_relational_itemsPgResource.find();
          let previousAlias = $relational_items.alias;
          const relational_itemsAlias = sql.identifier(Symbol("relational_items"));
          $relational_items.join({
            type: "inner",
            from: otherSource_relational_itemsPgResource.from,
            alias: relational_itemsAlias,
            conditions: [sql`${previousAlias}.${sql.identifier("parent_id")} = ${relational_itemsAlias}.${sql.identifier("id")}`]
          });
          previousAlias = relational_itemsAlias;
          $relational_items.where(sql`${previousAlias}.${sql.identifier("id")} = ${$relational_items.placeholder($record.get("checklist_item_item_id"))}`);
          return connection($relational_items);
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
      relationalTopicByRootTopicId($record) {
        const $relational_topics = spec_resource_relational_topicsPgResource.find();
        let previousAlias = $relational_topics.alias;
        const relational_itemsAlias = sql.identifier(Symbol("relational_items"));
        $relational_topics.join({
          type: "inner",
          from: otherSource_relational_itemsPgResource.from,
          alias: relational_itemsAlias,
          conditions: [sql`${previousAlias}.${sql.identifier("topic_item_id")} = ${relational_itemsAlias}.${sql.identifier("root_topic_id")}`]
        });
        previousAlias = relational_itemsAlias;
        $relational_topics.where(sql`${previousAlias}.${sql.identifier("id")} = ${$relational_topics.placeholder($record.get("checklist_item_item_id"))}`);
        return $relational_topics.single();
      },
      rootTopicId($record) {
        return $record.get("root_topic_id");
      },
      updatedAt($record) {
        return $record.get("updated_at");
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of relational_checklist_itemsUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return spec_resource_relational_checklist_itemsPgResource.get(spec);
    }
  },
  RelationalChecklistItemsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  RelationalChecklistsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  RelationalDivider: {
    assertStep: assertPgClassSingleStep,
    plans: {
      archivedAt($record) {
        return $record.get("archived_at");
      },
      authorId($record) {
        return $record.get("author_id");
      },
      createdAt($record) {
        return $record.get("created_at");
      },
      isExplicitlyArchived($record) {
        return $record.get("is_explicitly_archived");
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_RelationalDivider.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_RelationalDivider.codec.name].encode);
      },
      parentId($record) {
        return $record.get("parent_id");
      },
      personByAuthorId($record) {
        const $people = otherSource_peoplePgResource.find();
        let previousAlias = $people.alias;
        const relational_itemsAlias = sql.identifier(Symbol("relational_items"));
        $people.join({
          type: "inner",
          from: otherSource_relational_itemsPgResource.from,
          alias: relational_itemsAlias,
          conditions: [sql`${previousAlias}.${sql.identifier("person_id")} = ${relational_itemsAlias}.${sql.identifier("author_id")}`]
        });
        previousAlias = relational_itemsAlias;
        $people.where(sql`${previousAlias}.${sql.identifier("id")} = ${$people.placeholder($record.get("divider_item_id"))}`);
        return $people.single();
      },
      relationalItemByParentId($record) {
        const $relational_items = otherSource_relational_itemsPgResource.find();
        let previousAlias = $relational_items.alias;
        const relational_itemsAlias = sql.identifier(Symbol("relational_items"));
        $relational_items.join({
          type: "inner",
          from: otherSource_relational_itemsPgResource.from,
          alias: relational_itemsAlias,
          conditions: [sql`${previousAlias}.${sql.identifier("id")} = ${relational_itemsAlias}.${sql.identifier("parent_id")}`]
        });
        previousAlias = relational_itemsAlias;
        $relational_items.where(sql`${previousAlias}.${sql.identifier("id")} = ${$relational_items.placeholder($record.get("divider_item_id"))}`);
        return $relational_items.single();
      },
      relationalItemRelationCompositePksByChildId: {
        plan($record) {
          const $relational_item_relation_composite_pks = spec_resource_relational_item_relation_composite_pksPgResource.find();
          let previousAlias = $relational_item_relation_composite_pks.alias;
          const relational_itemsAlias = sql.identifier(Symbol("relational_items"));
          $relational_item_relation_composite_pks.join({
            type: "inner",
            from: otherSource_relational_itemsPgResource.from,
            alias: relational_itemsAlias,
            conditions: [sql`${previousAlias}.${sql.identifier("child_id")} = ${relational_itemsAlias}.${sql.identifier("id")}`]
          });
          previousAlias = relational_itemsAlias;
          $relational_item_relation_composite_pks.where(sql`${previousAlias}.${sql.identifier("id")} = ${$relational_item_relation_composite_pks.placeholder($record.get("divider_item_id"))}`);
          return connection($relational_item_relation_composite_pks);
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
      relationalItemRelationCompositePksByParentId: {
        plan($record) {
          const $relational_item_relation_composite_pks = spec_resource_relational_item_relation_composite_pksPgResource.find();
          let previousAlias = $relational_item_relation_composite_pks.alias;
          const relational_itemsAlias = sql.identifier(Symbol("relational_items"));
          $relational_item_relation_composite_pks.join({
            type: "inner",
            from: otherSource_relational_itemsPgResource.from,
            alias: relational_itemsAlias,
            conditions: [sql`${previousAlias}.${sql.identifier("parent_id")} = ${relational_itemsAlias}.${sql.identifier("id")}`]
          });
          previousAlias = relational_itemsAlias;
          $relational_item_relation_composite_pks.where(sql`${previousAlias}.${sql.identifier("id")} = ${$relational_item_relation_composite_pks.placeholder($record.get("divider_item_id"))}`);
          return connection($relational_item_relation_composite_pks);
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
      relationalItemRelationsByChildId: {
        plan($record) {
          const $relational_item_relations = spec_resource_relational_item_relationsPgResource.find();
          let previousAlias = $relational_item_relations.alias;
          const relational_itemsAlias = sql.identifier(Symbol("relational_items"));
          $relational_item_relations.join({
            type: "inner",
            from: otherSource_relational_itemsPgResource.from,
            alias: relational_itemsAlias,
            conditions: [sql`${previousAlias}.${sql.identifier("child_id")} = ${relational_itemsAlias}.${sql.identifier("id")}`]
          });
          previousAlias = relational_itemsAlias;
          $relational_item_relations.where(sql`${previousAlias}.${sql.identifier("id")} = ${$relational_item_relations.placeholder($record.get("divider_item_id"))}`);
          return connection($relational_item_relations);
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
      relationalItemRelationsByParentId: {
        plan($record) {
          const $relational_item_relations = spec_resource_relational_item_relationsPgResource.find();
          let previousAlias = $relational_item_relations.alias;
          const relational_itemsAlias = sql.identifier(Symbol("relational_items"));
          $relational_item_relations.join({
            type: "inner",
            from: otherSource_relational_itemsPgResource.from,
            alias: relational_itemsAlias,
            conditions: [sql`${previousAlias}.${sql.identifier("parent_id")} = ${relational_itemsAlias}.${sql.identifier("id")}`]
          });
          previousAlias = relational_itemsAlias;
          $relational_item_relations.where(sql`${previousAlias}.${sql.identifier("id")} = ${$relational_item_relations.placeholder($record.get("divider_item_id"))}`);
          return connection($relational_item_relations);
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
      relationalItemsByParentId: {
        plan($record) {
          const $relational_items = otherSource_relational_itemsPgResource.find();
          let previousAlias = $relational_items.alias;
          const relational_itemsAlias = sql.identifier(Symbol("relational_items"));
          $relational_items.join({
            type: "inner",
            from: otherSource_relational_itemsPgResource.from,
            alias: relational_itemsAlias,
            conditions: [sql`${previousAlias}.${sql.identifier("parent_id")} = ${relational_itemsAlias}.${sql.identifier("id")}`]
          });
          previousAlias = relational_itemsAlias;
          $relational_items.where(sql`${previousAlias}.${sql.identifier("id")} = ${$relational_items.placeholder($record.get("divider_item_id"))}`);
          return connection($relational_items);
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
      relationalTopicByRootTopicId($record) {
        const $relational_topics = spec_resource_relational_topicsPgResource.find();
        let previousAlias = $relational_topics.alias;
        const relational_itemsAlias = sql.identifier(Symbol("relational_items"));
        $relational_topics.join({
          type: "inner",
          from: otherSource_relational_itemsPgResource.from,
          alias: relational_itemsAlias,
          conditions: [sql`${previousAlias}.${sql.identifier("topic_item_id")} = ${relational_itemsAlias}.${sql.identifier("root_topic_id")}`]
        });
        previousAlias = relational_itemsAlias;
        $relational_topics.where(sql`${previousAlias}.${sql.identifier("id")} = ${$relational_topics.placeholder($record.get("divider_item_id"))}`);
        return $relational_topics.single();
      },
      rootTopicId($record) {
        return $record.get("root_topic_id");
      },
      updatedAt($record) {
        return $record.get("updated_at");
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of relational_dividersUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return spec_resource_relational_dividersPgResource.get(spec);
    }
  },
  RelationalDividersConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  RelationalItemRelation: {
    assertStep: assertPgClassSingleStep,
    plans: {
      childId($record) {
        return $record.get("child_id");
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_RelationalItemRelation.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_RelationalItemRelation.codec.name].encode);
      },
      parentId($record) {
        return $record.get("parent_id");
      },
      relationalItemByChildId($record) {
        return otherSource_relational_itemsPgResource.get({
          id: $record.get("child_id")
        });
      },
      relationalItemByParentId($record) {
        return otherSource_relational_itemsPgResource.get({
          id: $record.get("parent_id")
        });
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of relational_item_relationsUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return spec_resource_relational_item_relationsPgResource.get(spec);
    }
  },
  RelationalItemRelationCompositePk: {
    assertStep: assertPgClassSingleStep,
    plans: {
      childId($record) {
        return $record.get("child_id");
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_RelationalItemRelationCompositePk.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_RelationalItemRelationCompositePk.codec.name].encode);
      },
      parentId($record) {
        return $record.get("parent_id");
      },
      relationalItemByChildId($record) {
        return otherSource_relational_itemsPgResource.get({
          id: $record.get("child_id")
        });
      },
      relationalItemByParentId($record) {
        return otherSource_relational_itemsPgResource.get({
          id: $record.get("parent_id")
        });
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of relational_item_relation_composite_pksUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return spec_resource_relational_item_relation_composite_pksPgResource.get(spec);
    }
  },
  RelationalItemRelationCompositePksConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  RelationalItemRelationsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  RelationalItemsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  RelationalPost: {
    assertStep: assertPgClassSingleStep,
    plans: {
      archivedAt($record) {
        return $record.get("archived_at");
      },
      authorId($record) {
        return $record.get("author_id");
      },
      createdAt($record) {
        return $record.get("created_at");
      },
      isExplicitlyArchived($record) {
        return $record.get("is_explicitly_archived");
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_RelationalPost.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_RelationalPost.codec.name].encode);
      },
      parentId($record) {
        return $record.get("parent_id");
      },
      personByAuthorId($record) {
        const $people = otherSource_peoplePgResource.find();
        let previousAlias = $people.alias;
        const relational_itemsAlias = sql.identifier(Symbol("relational_items"));
        $people.join({
          type: "inner",
          from: otherSource_relational_itemsPgResource.from,
          alias: relational_itemsAlias,
          conditions: [sql`${previousAlias}.${sql.identifier("person_id")} = ${relational_itemsAlias}.${sql.identifier("author_id")}`]
        });
        previousAlias = relational_itemsAlias;
        $people.where(sql`${previousAlias}.${sql.identifier("id")} = ${$people.placeholder($record.get("post_item_id"))}`);
        return $people.single();
      },
      relationalItemByParentId($record) {
        const $relational_items = otherSource_relational_itemsPgResource.find();
        let previousAlias = $relational_items.alias;
        const relational_itemsAlias = sql.identifier(Symbol("relational_items"));
        $relational_items.join({
          type: "inner",
          from: otherSource_relational_itemsPgResource.from,
          alias: relational_itemsAlias,
          conditions: [sql`${previousAlias}.${sql.identifier("id")} = ${relational_itemsAlias}.${sql.identifier("parent_id")}`]
        });
        previousAlias = relational_itemsAlias;
        $relational_items.where(sql`${previousAlias}.${sql.identifier("id")} = ${$relational_items.placeholder($record.get("post_item_id"))}`);
        return $relational_items.single();
      },
      relationalItemRelationCompositePksByChildId: {
        plan($record) {
          const $relational_item_relation_composite_pks = spec_resource_relational_item_relation_composite_pksPgResource.find();
          let previousAlias = $relational_item_relation_composite_pks.alias;
          const relational_itemsAlias = sql.identifier(Symbol("relational_items"));
          $relational_item_relation_composite_pks.join({
            type: "inner",
            from: otherSource_relational_itemsPgResource.from,
            alias: relational_itemsAlias,
            conditions: [sql`${previousAlias}.${sql.identifier("child_id")} = ${relational_itemsAlias}.${sql.identifier("id")}`]
          });
          previousAlias = relational_itemsAlias;
          $relational_item_relation_composite_pks.where(sql`${previousAlias}.${sql.identifier("id")} = ${$relational_item_relation_composite_pks.placeholder($record.get("post_item_id"))}`);
          return connection($relational_item_relation_composite_pks);
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
      relationalItemRelationCompositePksByParentId: {
        plan($record) {
          const $relational_item_relation_composite_pks = spec_resource_relational_item_relation_composite_pksPgResource.find();
          let previousAlias = $relational_item_relation_composite_pks.alias;
          const relational_itemsAlias = sql.identifier(Symbol("relational_items"));
          $relational_item_relation_composite_pks.join({
            type: "inner",
            from: otherSource_relational_itemsPgResource.from,
            alias: relational_itemsAlias,
            conditions: [sql`${previousAlias}.${sql.identifier("parent_id")} = ${relational_itemsAlias}.${sql.identifier("id")}`]
          });
          previousAlias = relational_itemsAlias;
          $relational_item_relation_composite_pks.where(sql`${previousAlias}.${sql.identifier("id")} = ${$relational_item_relation_composite_pks.placeholder($record.get("post_item_id"))}`);
          return connection($relational_item_relation_composite_pks);
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
      relationalItemRelationsByChildId: {
        plan($record) {
          const $relational_item_relations = spec_resource_relational_item_relationsPgResource.find();
          let previousAlias = $relational_item_relations.alias;
          const relational_itemsAlias = sql.identifier(Symbol("relational_items"));
          $relational_item_relations.join({
            type: "inner",
            from: otherSource_relational_itemsPgResource.from,
            alias: relational_itemsAlias,
            conditions: [sql`${previousAlias}.${sql.identifier("child_id")} = ${relational_itemsAlias}.${sql.identifier("id")}`]
          });
          previousAlias = relational_itemsAlias;
          $relational_item_relations.where(sql`${previousAlias}.${sql.identifier("id")} = ${$relational_item_relations.placeholder($record.get("post_item_id"))}`);
          return connection($relational_item_relations);
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
      relationalItemRelationsByParentId: {
        plan($record) {
          const $relational_item_relations = spec_resource_relational_item_relationsPgResource.find();
          let previousAlias = $relational_item_relations.alias;
          const relational_itemsAlias = sql.identifier(Symbol("relational_items"));
          $relational_item_relations.join({
            type: "inner",
            from: otherSource_relational_itemsPgResource.from,
            alias: relational_itemsAlias,
            conditions: [sql`${previousAlias}.${sql.identifier("parent_id")} = ${relational_itemsAlias}.${sql.identifier("id")}`]
          });
          previousAlias = relational_itemsAlias;
          $relational_item_relations.where(sql`${previousAlias}.${sql.identifier("id")} = ${$relational_item_relations.placeholder($record.get("post_item_id"))}`);
          return connection($relational_item_relations);
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
      relationalItemsByParentId: {
        plan($record) {
          const $relational_items = otherSource_relational_itemsPgResource.find();
          let previousAlias = $relational_items.alias;
          const relational_itemsAlias = sql.identifier(Symbol("relational_items"));
          $relational_items.join({
            type: "inner",
            from: otherSource_relational_itemsPgResource.from,
            alias: relational_itemsAlias,
            conditions: [sql`${previousAlias}.${sql.identifier("parent_id")} = ${relational_itemsAlias}.${sql.identifier("id")}`]
          });
          previousAlias = relational_itemsAlias;
          $relational_items.where(sql`${previousAlias}.${sql.identifier("id")} = ${$relational_items.placeholder($record.get("post_item_id"))}`);
          return connection($relational_items);
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
      relationalTopicByRootTopicId($record) {
        const $relational_topics = spec_resource_relational_topicsPgResource.find();
        let previousAlias = $relational_topics.alias;
        const relational_itemsAlias = sql.identifier(Symbol("relational_items"));
        $relational_topics.join({
          type: "inner",
          from: otherSource_relational_itemsPgResource.from,
          alias: relational_itemsAlias,
          conditions: [sql`${previousAlias}.${sql.identifier("topic_item_id")} = ${relational_itemsAlias}.${sql.identifier("root_topic_id")}`]
        });
        previousAlias = relational_itemsAlias;
        $relational_topics.where(sql`${previousAlias}.${sql.identifier("id")} = ${$relational_topics.placeholder($record.get("post_item_id"))}`);
        return $relational_topics.single();
      },
      rootTopicId($record) {
        return $record.get("root_topic_id");
      },
      updatedAt($record) {
        return $record.get("updated_at");
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of relational_postsUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return spec_resource_relational_postsPgResource.get(spec);
    }
  },
  RelationalPostsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  RelationalTopic: {
    assertStep: assertPgClassSingleStep,
    plans: {
      archivedAt($record) {
        return $record.get("archived_at");
      },
      authorId($record) {
        return $record.get("author_id");
      },
      createdAt($record) {
        return $record.get("created_at");
      },
      isExplicitlyArchived($record) {
        return $record.get("is_explicitly_archived");
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_RelationalTopic.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_RelationalTopic.codec.name].encode);
      },
      parentFn($in, args, _info) {
        const details = pgFunctionArgumentsFromArgs($in, makeArgs_first_party_vulnerabilities_cvss_score_int(args));
        return resource_relational_topics_parent_fnPgResource.execute(details.selectArgs);
      },
      parentId($record) {
        return $record.get("parent_id");
      },
      personByAuthorId($record) {
        const $people = otherSource_peoplePgResource.find();
        let previousAlias = $people.alias;
        const relational_itemsAlias = sql.identifier(Symbol("relational_items"));
        $people.join({
          type: "inner",
          from: otherSource_relational_itemsPgResource.from,
          alias: relational_itemsAlias,
          conditions: [sql`${previousAlias}.${sql.identifier("person_id")} = ${relational_itemsAlias}.${sql.identifier("author_id")}`]
        });
        previousAlias = relational_itemsAlias;
        $people.where(sql`${previousAlias}.${sql.identifier("id")} = ${$people.placeholder($record.get("topic_item_id"))}`);
        return $people.single();
      },
      relationalItemByParentId($record) {
        const $relational_items = otherSource_relational_itemsPgResource.find();
        let previousAlias = $relational_items.alias;
        const relational_itemsAlias = sql.identifier(Symbol("relational_items"));
        $relational_items.join({
          type: "inner",
          from: otherSource_relational_itemsPgResource.from,
          alias: relational_itemsAlias,
          conditions: [sql`${previousAlias}.${sql.identifier("id")} = ${relational_itemsAlias}.${sql.identifier("parent_id")}`]
        });
        previousAlias = relational_itemsAlias;
        $relational_items.where(sql`${previousAlias}.${sql.identifier("id")} = ${$relational_items.placeholder($record.get("topic_item_id"))}`);
        return $relational_items.single();
      },
      relationalItemRelationCompositePksByChildId: {
        plan($record) {
          const $relational_item_relation_composite_pks = spec_resource_relational_item_relation_composite_pksPgResource.find();
          let previousAlias = $relational_item_relation_composite_pks.alias;
          const relational_itemsAlias = sql.identifier(Symbol("relational_items"));
          $relational_item_relation_composite_pks.join({
            type: "inner",
            from: otherSource_relational_itemsPgResource.from,
            alias: relational_itemsAlias,
            conditions: [sql`${previousAlias}.${sql.identifier("child_id")} = ${relational_itemsAlias}.${sql.identifier("id")}`]
          });
          previousAlias = relational_itemsAlias;
          $relational_item_relation_composite_pks.where(sql`${previousAlias}.${sql.identifier("id")} = ${$relational_item_relation_composite_pks.placeholder($record.get("topic_item_id"))}`);
          return connection($relational_item_relation_composite_pks);
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
      relationalItemRelationCompositePksByParentId: {
        plan($record) {
          const $relational_item_relation_composite_pks = spec_resource_relational_item_relation_composite_pksPgResource.find();
          let previousAlias = $relational_item_relation_composite_pks.alias;
          const relational_itemsAlias = sql.identifier(Symbol("relational_items"));
          $relational_item_relation_composite_pks.join({
            type: "inner",
            from: otherSource_relational_itemsPgResource.from,
            alias: relational_itemsAlias,
            conditions: [sql`${previousAlias}.${sql.identifier("parent_id")} = ${relational_itemsAlias}.${sql.identifier("id")}`]
          });
          previousAlias = relational_itemsAlias;
          $relational_item_relation_composite_pks.where(sql`${previousAlias}.${sql.identifier("id")} = ${$relational_item_relation_composite_pks.placeholder($record.get("topic_item_id"))}`);
          return connection($relational_item_relation_composite_pks);
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
      relationalItemRelationsByChildId: {
        plan($record) {
          const $relational_item_relations = spec_resource_relational_item_relationsPgResource.find();
          let previousAlias = $relational_item_relations.alias;
          const relational_itemsAlias = sql.identifier(Symbol("relational_items"));
          $relational_item_relations.join({
            type: "inner",
            from: otherSource_relational_itemsPgResource.from,
            alias: relational_itemsAlias,
            conditions: [sql`${previousAlias}.${sql.identifier("child_id")} = ${relational_itemsAlias}.${sql.identifier("id")}`]
          });
          previousAlias = relational_itemsAlias;
          $relational_item_relations.where(sql`${previousAlias}.${sql.identifier("id")} = ${$relational_item_relations.placeholder($record.get("topic_item_id"))}`);
          return connection($relational_item_relations);
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
      relationalItemRelationsByParentId: {
        plan($record) {
          const $relational_item_relations = spec_resource_relational_item_relationsPgResource.find();
          let previousAlias = $relational_item_relations.alias;
          const relational_itemsAlias = sql.identifier(Symbol("relational_items"));
          $relational_item_relations.join({
            type: "inner",
            from: otherSource_relational_itemsPgResource.from,
            alias: relational_itemsAlias,
            conditions: [sql`${previousAlias}.${sql.identifier("parent_id")} = ${relational_itemsAlias}.${sql.identifier("id")}`]
          });
          previousAlias = relational_itemsAlias;
          $relational_item_relations.where(sql`${previousAlias}.${sql.identifier("id")} = ${$relational_item_relations.placeholder($record.get("topic_item_id"))}`);
          return connection($relational_item_relations);
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
      relationalItemsByParentId: {
        plan($record) {
          const $relational_items = otherSource_relational_itemsPgResource.find();
          let previousAlias = $relational_items.alias;
          const relational_itemsAlias = sql.identifier(Symbol("relational_items"));
          $relational_items.join({
            type: "inner",
            from: otherSource_relational_itemsPgResource.from,
            alias: relational_itemsAlias,
            conditions: [sql`${previousAlias}.${sql.identifier("parent_id")} = ${relational_itemsAlias}.${sql.identifier("id")}`]
          });
          previousAlias = relational_itemsAlias;
          $relational_items.where(sql`${previousAlias}.${sql.identifier("id")} = ${$relational_items.placeholder($record.get("topic_item_id"))}`);
          return connection($relational_items);
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
      relationalItemsByRootTopicId: {
        plan($record) {
          const $records = otherSource_relational_itemsPgResource.find({
            root_topic_id: $record.get("topic_item_id")
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
      },
      relationalTopicByRootTopicId($record) {
        const $relational_topics = spec_resource_relational_topicsPgResource.find();
        let previousAlias = $relational_topics.alias;
        const relational_itemsAlias = sql.identifier(Symbol("relational_items"));
        $relational_topics.join({
          type: "inner",
          from: otherSource_relational_itemsPgResource.from,
          alias: relational_itemsAlias,
          conditions: [sql`${previousAlias}.${sql.identifier("topic_item_id")} = ${relational_itemsAlias}.${sql.identifier("root_topic_id")}`]
        });
        previousAlias = relational_itemsAlias;
        $relational_topics.where(sql`${previousAlias}.${sql.identifier("id")} = ${$relational_topics.placeholder($record.get("topic_item_id"))}`);
        return $relational_topics.single();
      },
      rootTopicId($record) {
        return $record.get("root_topic_id");
      },
      updatedAt($record) {
        return $record.get("updated_at");
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of relational_topicsUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return spec_resource_relational_topicsPgResource.get(spec);
    }
  },
  RelationalTopicsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  SeriesCollection: {
    assertStep: assertPgClassSingleStep,
    plans: {
      col001($record) {
        return $record.get("col_001");
      },
      col002($record) {
        return $record.get("col_002");
      },
      col003($record) {
        return $record.get("col_003");
      },
      col004($record) {
        return $record.get("col_004");
      },
      col005($record) {
        return $record.get("col_005");
      },
      col006($record) {
        return $record.get("col_006");
      },
      col007($record) {
        return $record.get("col_007");
      },
      col008($record) {
        return $record.get("col_008");
      },
      col009($record) {
        return $record.get("col_009");
      },
      col010($record) {
        return $record.get("col_010");
      },
      col011($record) {
        return $record.get("col_011");
      },
      col012($record) {
        return $record.get("col_012");
      },
      col013($record) {
        return $record.get("col_013");
      },
      col014($record) {
        return $record.get("col_014");
      },
      col015($record) {
        return $record.get("col_015");
      },
      col016($record) {
        return $record.get("col_016");
      },
      col017($record) {
        return $record.get("col_017");
      },
      col018($record) {
        return $record.get("col_018");
      },
      col019($record) {
        return $record.get("col_019");
      },
      col020($record) {
        return $record.get("col_020");
      },
      col021($record) {
        return $record.get("col_021");
      },
      col022($record) {
        return $record.get("col_022");
      },
      col023($record) {
        return $record.get("col_023");
      },
      col024($record) {
        return $record.get("col_024");
      },
      col025($record) {
        return $record.get("col_025");
      },
      col026($record) {
        return $record.get("col_026");
      },
      col027($record) {
        return $record.get("col_027");
      },
      col028($record) {
        return $record.get("col_028");
      },
      col029($record) {
        return $record.get("col_029");
      },
      col030($record) {
        return $record.get("col_030");
      },
      col031($record) {
        return $record.get("col_031");
      },
      col032($record) {
        return $record.get("col_032");
      },
      col033($record) {
        return $record.get("col_033");
      },
      col034($record) {
        return $record.get("col_034");
      },
      col035($record) {
        return $record.get("col_035");
      },
      col036($record) {
        return $record.get("col_036");
      },
      col037($record) {
        return $record.get("col_037");
      },
      col038($record) {
        return $record.get("col_038");
      },
      col039($record) {
        return $record.get("col_039");
      },
      col040($record) {
        return $record.get("col_040");
      },
      col041($record) {
        return $record.get("col_041");
      },
      col042($record) {
        return $record.get("col_042");
      },
      col043($record) {
        return $record.get("col_043");
      },
      col044($record) {
        return $record.get("col_044");
      },
      col045($record) {
        return $record.get("col_045");
      },
      col046($record) {
        return $record.get("col_046");
      },
      col047($record) {
        return $record.get("col_047");
      },
      col048($record) {
        return $record.get("col_048");
      },
      col049($record) {
        return $record.get("col_049");
      },
      col050($record) {
        return $record.get("col_050");
      },
      col051($record) {
        return $record.get("col_051");
      },
      col052($record) {
        return $record.get("col_052");
      },
      col053($record) {
        return $record.get("col_053");
      },
      col054($record) {
        return $record.get("col_054");
      },
      col055($record) {
        return $record.get("col_055");
      },
      col056($record) {
        return $record.get("col_056");
      },
      col057($record) {
        return $record.get("col_057");
      },
      col058($record) {
        return $record.get("col_058");
      },
      col059($record) {
        return $record.get("col_059");
      },
      col060($record) {
        return $record.get("col_060");
      },
      col061($record) {
        return $record.get("col_061");
      },
      col062($record) {
        return $record.get("col_062");
      },
      col063($record) {
        return $record.get("col_063");
      },
      col064($record) {
        return $record.get("col_064");
      },
      col065($record) {
        return $record.get("col_065");
      },
      col066($record) {
        return $record.get("col_066");
      },
      col067($record) {
        return $record.get("col_067");
      },
      col068($record) {
        return $record.get("col_068");
      },
      col069($record) {
        return $record.get("col_069");
      },
      col070($record) {
        return $record.get("col_070");
      },
      col071($record) {
        return $record.get("col_071");
      },
      col072($record) {
        return $record.get("col_072");
      },
      col073($record) {
        return $record.get("col_073");
      },
      col074($record) {
        return $record.get("col_074");
      },
      col075($record) {
        return $record.get("col_075");
      },
      col076($record) {
        return $record.get("col_076");
      },
      col077($record) {
        return $record.get("col_077");
      },
      col078($record) {
        return $record.get("col_078");
      },
      col079($record) {
        return $record.get("col_079");
      },
      col080($record) {
        return $record.get("col_080");
      },
      col081($record) {
        return $record.get("col_081");
      },
      col082($record) {
        return $record.get("col_082");
      },
      col083($record) {
        return $record.get("col_083");
      },
      col084($record) {
        return $record.get("col_084");
      },
      col085($record) {
        return $record.get("col_085");
      },
      col086($record) {
        return $record.get("col_086");
      },
      col087($record) {
        return $record.get("col_087");
      },
      col088($record) {
        return $record.get("col_088");
      },
      col089($record) {
        return $record.get("col_089");
      },
      col090($record) {
        return $record.get("col_090");
      },
      col091($record) {
        return $record.get("col_091");
      },
      col092($record) {
        return $record.get("col_092");
      },
      col093($record) {
        return $record.get("col_093");
      },
      col094($record) {
        return $record.get("col_094");
      },
      col095($record) {
        return $record.get("col_095");
      },
      col096($record) {
        return $record.get("col_096");
      },
      col097($record) {
        return $record.get("col_097");
      },
      col098($record) {
        return $record.get("col_098");
      },
      col099($record) {
        return $record.get("col_099");
      },
      col100($record) {
        return $record.get("col_100");
      },
      createdAt($record) {
        return $record.get("created_at");
      },
      nodeId($parent) {
        const specifier = nodeIdHandlerByTypeName.SeriesCollection.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.SeriesCollection.codec.name].encode);
      }
    }
  },
  SingleTableChecklist: {
    assertStep: assertPgClassSingleStep,
    plans: {
      archivedAt($record) {
        return $record.get("archived_at");
      },
      authorId($record) {
        return $record.get("author_id");
      },
      createdAt($record) {
        return $record.get("created_at");
      },
      isExplicitlyArchived($record) {
        return $record.get("is_explicitly_archived");
      },
      meaningOfLife($in, args, _info) {
        return scalarComputed(resource_single_table_items_meaning_of_lifePgResource, $in, makeArgs_first_party_vulnerabilities_cvss_score_int(args));
      },
      nodeId($parent) {
        const specifier = nodeIdHandlerByTypeName.SingleTableChecklist.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.SingleTableChecklist.codec.name].encode);
      },
      parentId($record) {
        return $record.get("parent_id");
      },
      personByAuthorId($record) {
        return otherSource_peoplePgResource.get({
          person_id: $record.get("author_id")
        });
      },
      rootChecklistTopic($record) {
        return resource_single_table_itemsPgResource.get({
          id: $record.get("root_topic_id")
        });
      },
      rootTopic($record) {
        return resource_single_table_itemsPgResource.get({
          id: $record.get("root_topic_id")
        });
      },
      rootTopicId($record) {
        return $record.get("root_topic_id");
      },
      singleTableItemByParentId($record) {
        return resource_single_table_itemsPgResource.get({
          id: $record.get("parent_id")
        });
      },
      singleTableItemRelationCompositePksByChildId: {
        plan($record) {
          const $records = otherSource_single_table_item_relation_composite_pksPgResource.find({
            child_id: $record.get("id")
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
      },
      singleTableItemRelationCompositePksByParentId: {
        plan($record) {
          const $records = otherSource_single_table_item_relation_composite_pksPgResource.find({
            parent_id: $record.get("id")
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
      },
      singleTableItemRelationsByChildId: {
        plan($record) {
          const $records = otherSource_single_table_item_relationsPgResource.find({
            child_id: $record.get("id")
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
      },
      singleTableItemRelationsByParentId: {
        plan($record) {
          const $records = otherSource_single_table_item_relationsPgResource.find({
            parent_id: $record.get("id")
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
      },
      singleTableItemsByParentId: {
        plan($record) {
          const $records = resource_single_table_itemsPgResource.find({
            parent_id: $record.get("id")
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
      },
      updatedAt($record) {
        return $record.get("updated_at");
      }
    }
  },
  SingleTableChecklistItem: {
    assertStep: assertPgClassSingleStep,
    plans: {
      archivedAt($record) {
        return $record.get("archived_at");
      },
      authorId($record) {
        return $record.get("author_id");
      },
      createdAt($record) {
        return $record.get("created_at");
      },
      isExplicitlyArchived($record) {
        return $record.get("is_explicitly_archived");
      },
      meaningOfLife($in, args, _info) {
        return scalarComputed(resource_single_table_items_meaning_of_lifePgResource, $in, makeArgs_first_party_vulnerabilities_cvss_score_int(args));
      },
      nodeId($parent) {
        const specifier = nodeIdHandlerByTypeName.SingleTableChecklistItem.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.SingleTableChecklistItem.codec.name].encode);
      },
      parentId($record) {
        return $record.get("parent_id");
      },
      personByAuthorId($record) {
        return otherSource_peoplePgResource.get({
          person_id: $record.get("author_id")
        });
      },
      priorityByPriorityId($record) {
        return spec_resource_prioritiesPgResource.get({
          id: $record.get("priority_id")
        });
      },
      priorityId($record) {
        return $record.get("priority_id");
      },
      rootTopic($record) {
        return resource_single_table_itemsPgResource.get({
          id: $record.get("root_topic_id")
        });
      },
      rootTopicId($record) {
        return $record.get("root_topic_id");
      },
      singleTableItemByParentId($record) {
        return resource_single_table_itemsPgResource.get({
          id: $record.get("parent_id")
        });
      },
      singleTableItemRelationCompositePksByChildId: {
        plan($record) {
          const $records = otherSource_single_table_item_relation_composite_pksPgResource.find({
            child_id: $record.get("id")
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
      },
      singleTableItemRelationCompositePksByParentId: {
        plan($record) {
          const $records = otherSource_single_table_item_relation_composite_pksPgResource.find({
            parent_id: $record.get("id")
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
      },
      singleTableItemRelationsByChildId: {
        plan($record) {
          const $records = otherSource_single_table_item_relationsPgResource.find({
            child_id: $record.get("id")
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
      },
      singleTableItemRelationsByParentId: {
        plan($record) {
          const $records = otherSource_single_table_item_relationsPgResource.find({
            parent_id: $record.get("id")
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
      },
      singleTableItemsByParentId: {
        plan($record) {
          const $records = resource_single_table_itemsPgResource.find({
            parent_id: $record.get("id")
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
      },
      updatedAt($record) {
        return $record.get("updated_at");
      }
    }
  },
  SingleTableDivider: {
    assertStep: assertPgClassSingleStep,
    plans: {
      archivedAt($record) {
        return $record.get("archived_at");
      },
      authorId($record) {
        return $record.get("author_id");
      },
      createdAt($record) {
        return $record.get("created_at");
      },
      isExplicitlyArchived($record) {
        return $record.get("is_explicitly_archived");
      },
      meaningOfLife($in, args, _info) {
        return scalarComputed(resource_single_table_items_meaning_of_lifePgResource, $in, makeArgs_first_party_vulnerabilities_cvss_score_int(args));
      },
      nodeId($parent) {
        const specifier = nodeIdHandlerByTypeName.SingleTableDivider.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.SingleTableDivider.codec.name].encode);
      },
      parentId($record) {
        return $record.get("parent_id");
      },
      personByAuthorId($record) {
        return otherSource_peoplePgResource.get({
          person_id: $record.get("author_id")
        });
      },
      rootTopic($record) {
        return resource_single_table_itemsPgResource.get({
          id: $record.get("root_topic_id")
        });
      },
      rootTopicId($record) {
        return $record.get("root_topic_id");
      },
      singleTableItemByParentId($record) {
        return resource_single_table_itemsPgResource.get({
          id: $record.get("parent_id")
        });
      },
      singleTableItemRelationCompositePksByChildId: {
        plan($record) {
          const $records = otherSource_single_table_item_relation_composite_pksPgResource.find({
            child_id: $record.get("id")
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
      },
      singleTableItemRelationCompositePksByParentId: {
        plan($record) {
          const $records = otherSource_single_table_item_relation_composite_pksPgResource.find({
            parent_id: $record.get("id")
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
      },
      singleTableItemRelationsByChildId: {
        plan($record) {
          const $records = otherSource_single_table_item_relationsPgResource.find({
            child_id: $record.get("id")
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
      },
      singleTableItemRelationsByParentId: {
        plan($record) {
          const $records = otherSource_single_table_item_relationsPgResource.find({
            parent_id: $record.get("id")
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
      },
      singleTableItemsByParentId: {
        plan($record) {
          const $records = resource_single_table_itemsPgResource.find({
            parent_id: $record.get("id")
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
      },
      updatedAt($record) {
        return $record.get("updated_at");
      }
    }
  },
  SingleTableItemRelation: {
    assertStep: assertPgClassSingleStep,
    plans: {
      childId($record) {
        return $record.get("child_id");
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_SingleTableItemRelation.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_SingleTableItemRelation.codec.name].encode);
      },
      parentId($record) {
        return $record.get("parent_id");
      },
      singleTableItemByChildId($record) {
        return resource_single_table_itemsPgResource.get({
          id: $record.get("child_id")
        });
      },
      singleTableItemByParentId($record) {
        return resource_single_table_itemsPgResource.get({
          id: $record.get("parent_id")
        });
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of single_table_item_relationsUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return otherSource_single_table_item_relationsPgResource.get(spec);
    }
  },
  SingleTableItemRelationCompositePk: {
    assertStep: assertPgClassSingleStep,
    plans: {
      childId($record) {
        return $record.get("child_id");
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_SingleTableItemRelationCompositePk.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_SingleTableItemRelationCompositePk.codec.name].encode);
      },
      parentId($record) {
        return $record.get("parent_id");
      },
      singleTableItemByChildId($record) {
        return resource_single_table_itemsPgResource.get({
          id: $record.get("child_id")
        });
      },
      singleTableItemByParentId($record) {
        return resource_single_table_itemsPgResource.get({
          id: $record.get("parent_id")
        });
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of single_table_item_relation_composite_pksUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return otherSource_single_table_item_relation_composite_pksPgResource.get(spec);
    }
  },
  SingleTableItemRelationCompositePksConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  SingleTableItemRelationsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  SingleTableItemsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  SingleTablePost: {
    assertStep: assertPgClassSingleStep,
    plans: {
      archivedAt($record) {
        return $record.get("archived_at");
      },
      authorId($record) {
        return $record.get("author_id");
      },
      createdAt($record) {
        return $record.get("created_at");
      },
      isExplicitlyArchived($record) {
        return $record.get("is_explicitly_archived");
      },
      meaningOfLife($in, args, _info) {
        return scalarComputed(resource_single_table_items_meaning_of_lifePgResource, $in, makeArgs_first_party_vulnerabilities_cvss_score_int(args));
      },
      nodeId($parent) {
        const specifier = nodeIdHandlerByTypeName.SingleTablePost.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.SingleTablePost.codec.name].encode);
      },
      parentId($record) {
        return $record.get("parent_id");
      },
      personByAuthorId($record) {
        return otherSource_peoplePgResource.get({
          person_id: $record.get("author_id")
        });
      },
      priorityByPriorityId($record) {
        return spec_resource_prioritiesPgResource.get({
          id: $record.get("priority_id")
        });
      },
      priorityId($record) {
        return $record.get("priority_id");
      },
      rootTopic($record) {
        return resource_single_table_itemsPgResource.get({
          id: $record.get("root_topic_id")
        });
      },
      rootTopicId($record) {
        return $record.get("root_topic_id");
      },
      singleTableItemByParentId($record) {
        return resource_single_table_itemsPgResource.get({
          id: $record.get("parent_id")
        });
      },
      singleTableItemRelationCompositePksByChildId: {
        plan($record) {
          const $records = otherSource_single_table_item_relation_composite_pksPgResource.find({
            child_id: $record.get("id")
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
      },
      singleTableItemRelationCompositePksByParentId: {
        plan($record) {
          const $records = otherSource_single_table_item_relation_composite_pksPgResource.find({
            parent_id: $record.get("id")
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
      },
      singleTableItemRelationsByChildId: {
        plan($record) {
          const $records = otherSource_single_table_item_relationsPgResource.find({
            child_id: $record.get("id")
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
      },
      singleTableItemRelationsByParentId: {
        plan($record) {
          const $records = otherSource_single_table_item_relationsPgResource.find({
            parent_id: $record.get("id")
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
      },
      singleTableItemsByParentId: {
        plan($record) {
          const $records = resource_single_table_itemsPgResource.find({
            parent_id: $record.get("id")
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
      },
      subject($record) {
        return $record.get("title");
      },
      updatedAt($record) {
        return $record.get("updated_at");
      }
    }
  },
  SingleTableTopic: {
    assertStep: assertPgClassSingleStep,
    plans: {
      archivedAt($record) {
        return $record.get("archived_at");
      },
      authorId($record) {
        return $record.get("author_id");
      },
      createdAt($record) {
        return $record.get("created_at");
      },
      isExplicitlyArchived($record) {
        return $record.get("is_explicitly_archived");
      },
      meaningOfLife($in, args, _info) {
        return scalarComputed(resource_single_table_items_meaning_of_lifePgResource, $in, makeArgs_first_party_vulnerabilities_cvss_score_int(args));
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_SingleTableTopic.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_SingleTableTopic.codec.name].encode);
      },
      parentId($record) {
        return $record.get("parent_id");
      },
      personByAuthorId($record) {
        return otherSource_peoplePgResource.get({
          person_id: $record.get("author_id")
        });
      },
      rootTopic($record) {
        return resource_single_table_itemsPgResource.get({
          id: $record.get("root_topic_id")
        });
      },
      rootTopicId($record) {
        return $record.get("root_topic_id");
      },
      singleTableItemByParentId($record) {
        return resource_single_table_itemsPgResource.get({
          id: $record.get("parent_id")
        });
      },
      singleTableItemRelationCompositePksByChildId: {
        plan($record) {
          const $records = otherSource_single_table_item_relation_composite_pksPgResource.find({
            child_id: $record.get("id")
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
      },
      singleTableItemRelationCompositePksByParentId: {
        plan($record) {
          const $records = otherSource_single_table_item_relation_composite_pksPgResource.find({
            parent_id: $record.get("id")
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
      },
      singleTableItemRelationsByChildId: {
        plan($record) {
          const $records = otherSource_single_table_item_relationsPgResource.find({
            child_id: $record.get("id")
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
      },
      singleTableItemRelationsByParentId: {
        plan($record) {
          const $records = otherSource_single_table_item_relationsPgResource.find({
            parent_id: $record.get("id")
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
      },
      singleTableItemsByParentId: {
        plan($record) {
          const $records = resource_single_table_itemsPgResource.find({
            parent_id: $record.get("id")
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
      },
      updatedAt($record) {
        return $record.get("updated_at");
      }
    }
  },
  ThirdPartyVulnerabilitiesConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  ThirdPartyVulnerability: {
    assertStep: assertPgClassSingleStep,
    plans: {
      applications: {
        plan($parent) {
          const $record = $parent;
          for (let i = 0, l = paths9.length; i < l; i++) {
            const path = paths9[i];
            const firstLayer = path.layers[0];
            const member = members12[i];
            member.match = firstLayer.localAttributes.reduce((memo, col, idx) => {
              memo[firstLayer.remoteAttributes[idx]] = {
                step: $record.get(col)
              };
              return memo;
            }, Object.create(null));
          }
          const $list = pgUnionAll({
            attributes: spec_Application.attributes,
            resourceByTypeName: resourceByTypeName15,
            members: members12,
            name: "applications"
          });
          return connection($list);
        },
        args: {
          first: applyFirstArg,
          last: applyLastArg,
          offset: applyOffsetArg,
          before: applyBeforeArg,
          after: applyAfterArg,
          condition: applyConditionArgToConnection,
          only: applyConnectionLimitToTypes,
          orderBy: applyOrderByArgToConnection
        }
      },
      cvssScore($record) {
        return $record.get("cvss_score");
      },
      cvssScoreInt($in, args, _info) {
        return scalarComputed(resource_third_party_vulnerabilities_cvss_score_intPgResource, $in, makeArgs_first_party_vulnerabilities_cvss_score_int(args));
      },
      nodeId($parent) {
        const specifier = nodeIdHandler_ThirdPartyVulnerability.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandler_ThirdPartyVulnerability.codec.name].encode);
      },
      owners($parent) {
        const $record = $parent;
        for (let i = 0, l = paths10.length; i < l; i++) {
          const path = paths10[i];
          const firstLayer = path.layers[0];
          const member = members13[i];
          member.match = firstLayer.localAttributes.reduce((memo, col, idx) => {
            memo[firstLayer.remoteAttributes[idx]] = {
              step: $record.get(col)
            };
            return memo;
          }, Object.create(null));
        }
        const $list = pgUnionAll({
          attributes: attributes5,
          resourceByTypeName: resourceByTypeName16,
          members: members13,
          name: "owners"
        });
        return connection($list);
      },
      vendorName($record) {
        return $record.get("vendor_name");
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of third_party_vulnerabilitiesUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return spec_resource_third_party_vulnerabilitiesPgResource.get(spec);
    }
  },
  UpdateAwsApplicationPayload: {
    assertStep: ObjectStep,
    plans: {
      awsApplication: planUpdateOrDeletePayloadResult,
      awsApplicationEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(spec_resource_aws_applicationsPgResource, aws_applicationsUniques[0].attributes, $mutation, fieldArgs);
      },
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      organizationByOrganizationId($record) {
        return spec_resource_organizationsPgResource.get({
          organization_id: $record.get("result").get("organization_id")
        });
      },
      personByPersonId($record) {
        return otherSource_peoplePgResource.get({
          person_id: $record.get("result").get("person_id")
        });
      },
      query: queryPlan
    }
  },
  UpdateFirstPartyVulnerabilityPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      firstPartyVulnerability: planUpdateOrDeletePayloadResult,
      firstPartyVulnerabilityEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(spec_resource_first_party_vulnerabilitiesPgResource, first_party_vulnerabilitiesUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  UpdateGcpApplicationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      gcpApplication: planUpdateOrDeletePayloadResult,
      gcpApplicationEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(spec_resource_gcp_applicationsPgResource, gcp_applicationsUniques[0].attributes, $mutation, fieldArgs);
      },
      organizationByOrganizationId($record) {
        return spec_resource_organizationsPgResource.get({
          organization_id: $record.get("result").get("organization_id")
        });
      },
      personByPersonId($record) {
        return otherSource_peoplePgResource.get({
          person_id: $record.get("result").get("person_id")
        });
      },
      query: queryPlan
    }
  },
  UpdateLogEntryPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      logEntry: planUpdateOrDeletePayloadResult,
      logEntryEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(spec_resource_log_entriesPgResource, log_entriesUniques[0].attributes, $mutation, fieldArgs);
      },
      organizationByOrganizationId($record) {
        return spec_resource_organizationsPgResource.get({
          organization_id: $record.get("result").get("organization_id")
        });
      },
      personByPersonId($record) {
        return otherSource_peoplePgResource.get({
          person_id: $record.get("result").get("person_id")
        });
      },
      query: queryPlan
    }
  },
  UpdateOrganizationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      organization: planUpdateOrDeletePayloadResult,
      organizationEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(spec_resource_organizationsPgResource, organizationsUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  UpdatePersonPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      person: planUpdateOrDeletePayloadResult,
      personEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(otherSource_peoplePgResource, peopleUniques[0].attributes, $mutation, fieldArgs);
      },
      query: queryPlan
    }
  },
  UpdateRelationalItemRelationCompositePkPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan,
      relationalItemByChildId($record) {
        return otherSource_relational_itemsPgResource.get({
          id: $record.get("result").get("child_id")
        });
      },
      relationalItemByParentId($record) {
        return otherSource_relational_itemsPgResource.get({
          id: $record.get("result").get("parent_id")
        });
      },
      relationalItemRelationCompositePk: planUpdateOrDeletePayloadResult,
      relationalItemRelationCompositePkEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(spec_resource_relational_item_relation_composite_pksPgResource, relational_item_relation_composite_pksUniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  UpdateRelationalItemRelationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan,
      relationalItemByChildId($record) {
        return otherSource_relational_itemsPgResource.get({
          id: $record.get("result").get("child_id")
        });
      },
      relationalItemByParentId($record) {
        return otherSource_relational_itemsPgResource.get({
          id: $record.get("result").get("parent_id")
        });
      },
      relationalItemRelation: planUpdateOrDeletePayloadResult,
      relationalItemRelationEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(spec_resource_relational_item_relationsPgResource, relational_item_relationsUniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  UpdateSingleTableItemRelationCompositePkPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan,
      singleTableItemByChildId($record) {
        return resource_single_table_itemsPgResource.get({
          id: $record.get("result").get("child_id")
        });
      },
      singleTableItemByParentId($record) {
        return resource_single_table_itemsPgResource.get({
          id: $record.get("result").get("parent_id")
        });
      },
      singleTableItemRelationCompositePk: planUpdateOrDeletePayloadResult,
      singleTableItemRelationCompositePkEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(otherSource_single_table_item_relation_composite_pksPgResource, single_table_item_relation_composite_pksUniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  UpdateSingleTableItemRelationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan,
      singleTableItemByChildId($record) {
        return resource_single_table_itemsPgResource.get({
          id: $record.get("result").get("child_id")
        });
      },
      singleTableItemByParentId($record) {
        return resource_single_table_itemsPgResource.get({
          id: $record.get("result").get("parent_id")
        });
      },
      singleTableItemRelation: planUpdateOrDeletePayloadResult,
      singleTableItemRelationEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(otherSource_single_table_item_relationsPgResource, single_table_item_relationsUniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  UpdateThirdPartyVulnerabilityPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId: getClientMutationIdForUpdateOrDeletePlan,
      query: queryPlan,
      thirdPartyVulnerability: planUpdateOrDeletePayloadResult,
      thirdPartyVulnerabilityEdge($mutation, fieldArgs) {
        return pgMutationPayloadEdge(spec_resource_third_party_vulnerabilitiesPgResource, third_party_vulnerabilitiesUniques[0].attributes, $mutation, fieldArgs);
      }
    }
  },
  VulnerabilitiesConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  },
  ZeroImplementationsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount: totalCountConnectionPlan
    }
  }
};
export const interfaces = {
  Application: {
    toSpecifier($step) {
      if ($step instanceof PgUnionAllSingleStep) {
        return $step.toSpecifier();
      } else {
        return $step;
      }
    },
    planType($specifier) {
      const $__typename = get2($specifier, "__typename");
      return {
        $__typename,
        planForType(t) {
          const resource = resourceByTypeName5[t.name];
          if (!resource) {
            throw new Error(`Type ${t.name} has no associated resource`);
          }
          const pk = resource.uniques.find(u => u.isPrimary) ?? resource.uniques[0];
          const spec = Object.create(null);
          for (const attrName of pk.attributes) {
            spec[attrName] = get2($specifier, attrName);
          }
          return resource.get(spec);
        }
      };
    }
  },
  Collection: {
    toSpecifier(step) {
      return object(Object.fromEntries(collectionsUniques[0].attributes.map(attrName => [attrName, get2(step, attrName)])));
    },
    planType($specifier, {
      $original
    }) {
      const $inStep = $original ?? $specifier;
      const $record = $inStep instanceof PgSelectSingleStep ? $inStep : resource_collectionsPgResource.get(Object.fromEntries(collectionsUniques[0].attributes.map(attrName => [attrName, get2($inStep, attrName)])));
      const $typeVal = get2($record, "type");
      const $__typename = lambda($typeVal, Collection_typeNameFromType, true);
      return {
        $__typename,
        planForType() {
          return $record;
        }
      };
    }
  },
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
  },
  RelationalItem: {
    toSpecifier(step) {
      if (step instanceof PgSelectSingleStep &&
      // NOTE: don't compare `resource` directly since it
      // could be a function.
      step.resource.codec !== otherSource_relational_itemsPgResource.codec) {
        // Assume it's a child; return description of base
        const pkColumns = relational_items_pkColumnsByRelatedCodecName[step.resource.codec.name];
        if (!pkColumns) {
          throw new Error(`Expected a relational record for ${otherSource_relational_itemsPgResource.name}, but '${step.resource.codec.name}' does not seem to be related!`);
        }
        return object(Object.fromEntries(relational_itemsUniques[0].attributes.map((attrName, idx) => [attrName, get2(step, pkColumns[idx])])));
      } else {
        // Assume it is or describes the base:
        return object(Object.fromEntries(relational_itemsUniques[0].attributes.map(attrName => [attrName, get2(step, attrName)])));
      }
    },
    planType($specifier, {
      $original
    }) {
      const $inStep = $original ?? $specifier;
      // A PgSelectSingleStep representing the base relational table
      const $base = (() => {
        if ($inStep instanceof PgSelectSingleStep) {
          if ($inStep.resource.codec === otherSource_relational_itemsPgResource.codec) {
            // It's the core table; that's what we want!
            return $inStep;
          } else {
            // Assume it's a child; get base record by primary key
            // PERF: ideally we'd use relationship
            // traversal instead, this would both be
            // shorter and also cacheable.
            const stepPk = $inStep.resource.uniques.find(u => u.isPrimary)?.attributes;
            if (!stepPk) {
              throw new Error(`Expected a relational record for ${otherSource_relational_itemsPgResource.name}, but found one for ${$inStep.resource.name} which has no primary key!`);
            }
            if (stepPk.length !== relational_itemsUniques[0].attributes.length) {
              throw new Error(`Expected a relational record for ${otherSource_relational_itemsPgResource.name}, but found one for ${$inStep.resource.name} which has a primary key with a different number of columns!`);
            }
            return otherSource_relational_itemsPgResource.get(Object.fromEntries(relational_itemsUniques[0].attributes.map((attrName, idx) => [attrName, get2($inStep, stepPk[idx])])));
          }
        } else {
          // Assume it's an object representing the base table
          return otherSource_relational_itemsPgResource.get(Object.fromEntries(relational_itemsUniques[0].attributes.map(attrName => [attrName, get2($inStep, attrName)])));
        }
      })();
      const $typeVal = get2($base, "type");
      const $__typename = lambda($typeVal, RelationalItem_typeNameFromType, true);
      return {
        $__typename,
        planForType(type) {
          const spec = Object.values(spec_relationalItems.polymorphism.types).find(s => s.name === type.name);
          if (!spec) {
            throw new Error(`${this} Could not find matching name for relational polymorphic '${type.name}'`);
          }
          return $base.singleRelation(spec.relationName);
        }
      };
    }
  },
  SingleTableItem: {
    toSpecifier(step) {
      return object(Object.fromEntries(single_table_itemsUniques[0].attributes.map(attrName => [attrName, get2(step, attrName)])));
    },
    planType($specifier, {
      $original
    }) {
      const $inStep = $original ?? $specifier;
      const $record = $inStep instanceof PgSelectSingleStep ? $inStep : resource_single_table_itemsPgResource.get(Object.fromEntries(single_table_itemsUniques[0].attributes.map(attrName => [attrName, get2($inStep, attrName)])));
      const $typeVal = get2($record, "type");
      const $__typename = lambda($typeVal, SingleTableItem_typeNameFromType, true);
      return {
        $__typename,
        planForType() {
          return $record;
        }
      };
    }
  },
  Vulnerability: {
    toSpecifier($step) {
      if ($step instanceof PgUnionAllSingleStep) {
        return $step.toSpecifier();
      } else {
        return $step;
      }
    },
    planType($specifier) {
      const $__typename = get2($specifier, "__typename");
      return {
        $__typename,
        planForType(t) {
          const resource = resourceByTypeName6[t.name];
          if (!resource) {
            throw new Error(`Type ${t.name} has no associated resource`);
          }
          const pk = resource.uniques.find(u => u.isPrimary) ?? resource.uniques[0];
          const spec = Object.create(null);
          for (const attrName of pk.attributes) {
            spec[attrName] = get2($specifier, attrName);
          }
          return resource.get(spec);
        }
      };
    }
  },
  ZeroImplementation: {
    toSpecifier($step) {
      if ($step instanceof PgUnionAllSingleStep) {
        return $step.toSpecifier();
      } else {
        return $step;
      }
    },
    planType($specifier) {
      const $__typename = get2($specifier, "__typename");
      return {
        $__typename,
        planForType(t) {
          const resource = resourceByTypeName17[t.name];
          if (!resource) {
            throw new Error(`Type ${t.name} has no associated resource`);
          }
          const pk = resource.uniques.find(u => u.isPrimary) ?? resource.uniques[0];
          const spec = Object.create(null);
          for (const attrName of pk.attributes) {
            spec[attrName] = get2($specifier, attrName);
          }
          return resource.get(spec);
        }
      };
    }
  }
};
export const unions = {
  PersonOrOrganization: {
    planType($specifier) {
      const $__typename = get2($specifier, "__typename");
      return {
        $__typename,
        planForType(t) {
          const resource = resourceByTypeName7[t.name];
          if (!resource) {
            throw new Error(`Could not determine resource for ${t.name}`);
          }
          const pk = resource.uniques.find(u => u.isPrimary) ?? resource.uniques[0];
          const spec = Object.create(null);
          for (const attrName of pk.attributes) {
            spec[attrName] = get2($specifier, attrName);
          }
          return resource.get(spec);
        }
      };
    }
  }
};
export const inputObjects = {
  ApplicationCondition: {
    plans: {
      id($condition, val) {
        return applyAttributeCondition("id", TYPES.int, $condition, val);
      },
      lastDeployed($condition, val) {
        return applyAttributeCondition("last_deployed", TYPES.timestamptz, $condition, val);
      },
      name($condition, val) {
        return applyAttributeCondition("name", TYPES.text, $condition, val);
      }
    }
  },
  AwsApplicationCondition: {
    plans: {
      awsId($condition, val) {
        return applyAttributeCondition("aws_id", TYPES.text, $condition, val);
      },
      id($condition, val) {
        return applyAttributeCondition("id", TYPES.int, $condition, val);
      },
      lastDeployed($condition, val) {
        return applyAttributeCondition("last_deployed", TYPES.timestamptz, $condition, val);
      },
      name($condition, val) {
        return applyAttributeCondition("name", TYPES.text, $condition, val);
      },
      organizationId($condition, val) {
        return applyAttributeCondition("organization_id", TYPES.int, $condition, val);
      },
      personId($condition, val) {
        return applyAttributeCondition("person_id", TYPES.int, $condition, val);
      }
    }
  },
  AwsApplicationInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      awsId(obj, val, {
        field,
        schema
      }) {
        obj.set("aws_id", bakedInputRuntime(schema, field.type, val));
      },
      id(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      },
      lastDeployed(obj, val, {
        field,
        schema
      }) {
        obj.set("last_deployed", bakedInputRuntime(schema, field.type, val));
      },
      name(obj, val, {
        field,
        schema
      }) {
        obj.set("name", bakedInputRuntime(schema, field.type, val));
      },
      organizationId(obj, val, {
        field,
        schema
      }) {
        obj.set("organization_id", bakedInputRuntime(schema, field.type, val));
      },
      personId(obj, val, {
        field,
        schema
      }) {
        obj.set("person_id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  AwsApplicationPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      awsId(obj, val, {
        field,
        schema
      }) {
        obj.set("aws_id", bakedInputRuntime(schema, field.type, val));
      },
      id(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      },
      lastDeployed(obj, val, {
        field,
        schema
      }) {
        obj.set("last_deployed", bakedInputRuntime(schema, field.type, val));
      },
      name(obj, val, {
        field,
        schema
      }) {
        obj.set("name", bakedInputRuntime(schema, field.type, val));
      },
      organizationId(obj, val, {
        field,
        schema
      }) {
        obj.set("organization_id", bakedInputRuntime(schema, field.type, val));
      },
      personId(obj, val, {
        field,
        schema
      }) {
        obj.set("person_id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  CollectionCondition: {
    plans: {
      col001($condition, val) {
        return applyAttributeCondition("col_001", TYPES.text, $condition, val);
      },
      col002($condition, val) {
        return applyAttributeCondition("col_002", TYPES.text, $condition, val);
      },
      col003($condition, val) {
        return applyAttributeCondition("col_003", TYPES.text, $condition, val);
      },
      col004($condition, val) {
        return applyAttributeCondition("col_004", TYPES.text, $condition, val);
      },
      col005($condition, val) {
        return applyAttributeCondition("col_005", TYPES.text, $condition, val);
      },
      col006($condition, val) {
        return applyAttributeCondition("col_006", TYPES.text, $condition, val);
      },
      col007($condition, val) {
        return applyAttributeCondition("col_007", TYPES.text, $condition, val);
      },
      col008($condition, val) {
        return applyAttributeCondition("col_008", TYPES.text, $condition, val);
      },
      col009($condition, val) {
        return applyAttributeCondition("col_009", TYPES.text, $condition, val);
      },
      col010($condition, val) {
        return applyAttributeCondition("col_010", TYPES.text, $condition, val);
      },
      col011($condition, val) {
        return applyAttributeCondition("col_011", TYPES.text, $condition, val);
      },
      col012($condition, val) {
        return applyAttributeCondition("col_012", TYPES.text, $condition, val);
      },
      col013($condition, val) {
        return applyAttributeCondition("col_013", TYPES.text, $condition, val);
      },
      col014($condition, val) {
        return applyAttributeCondition("col_014", TYPES.text, $condition, val);
      },
      col015($condition, val) {
        return applyAttributeCondition("col_015", TYPES.text, $condition, val);
      },
      col016($condition, val) {
        return applyAttributeCondition("col_016", TYPES.text, $condition, val);
      },
      col017($condition, val) {
        return applyAttributeCondition("col_017", TYPES.text, $condition, val);
      },
      col018($condition, val) {
        return applyAttributeCondition("col_018", TYPES.text, $condition, val);
      },
      col019($condition, val) {
        return applyAttributeCondition("col_019", TYPES.text, $condition, val);
      },
      col020($condition, val) {
        return applyAttributeCondition("col_020", TYPES.text, $condition, val);
      },
      col021($condition, val) {
        return applyAttributeCondition("col_021", TYPES.text, $condition, val);
      },
      col022($condition, val) {
        return applyAttributeCondition("col_022", TYPES.text, $condition, val);
      },
      col023($condition, val) {
        return applyAttributeCondition("col_023", TYPES.text, $condition, val);
      },
      col024($condition, val) {
        return applyAttributeCondition("col_024", TYPES.text, $condition, val);
      },
      col025($condition, val) {
        return applyAttributeCondition("col_025", TYPES.text, $condition, val);
      },
      col026($condition, val) {
        return applyAttributeCondition("col_026", TYPES.text, $condition, val);
      },
      col027($condition, val) {
        return applyAttributeCondition("col_027", TYPES.text, $condition, val);
      },
      col028($condition, val) {
        return applyAttributeCondition("col_028", TYPES.text, $condition, val);
      },
      col029($condition, val) {
        return applyAttributeCondition("col_029", TYPES.text, $condition, val);
      },
      col030($condition, val) {
        return applyAttributeCondition("col_030", TYPES.text, $condition, val);
      },
      col031($condition, val) {
        return applyAttributeCondition("col_031", TYPES.text, $condition, val);
      },
      col032($condition, val) {
        return applyAttributeCondition("col_032", TYPES.text, $condition, val);
      },
      col033($condition, val) {
        return applyAttributeCondition("col_033", TYPES.text, $condition, val);
      },
      col034($condition, val) {
        return applyAttributeCondition("col_034", TYPES.text, $condition, val);
      },
      col035($condition, val) {
        return applyAttributeCondition("col_035", TYPES.text, $condition, val);
      },
      col036($condition, val) {
        return applyAttributeCondition("col_036", TYPES.text, $condition, val);
      },
      col037($condition, val) {
        return applyAttributeCondition("col_037", TYPES.text, $condition, val);
      },
      col038($condition, val) {
        return applyAttributeCondition("col_038", TYPES.text, $condition, val);
      },
      col039($condition, val) {
        return applyAttributeCondition("col_039", TYPES.text, $condition, val);
      },
      col040($condition, val) {
        return applyAttributeCondition("col_040", TYPES.text, $condition, val);
      },
      col041($condition, val) {
        return applyAttributeCondition("col_041", TYPES.text, $condition, val);
      },
      col042($condition, val) {
        return applyAttributeCondition("col_042", TYPES.text, $condition, val);
      },
      col043($condition, val) {
        return applyAttributeCondition("col_043", TYPES.text, $condition, val);
      },
      col044($condition, val) {
        return applyAttributeCondition("col_044", TYPES.text, $condition, val);
      },
      col045($condition, val) {
        return applyAttributeCondition("col_045", TYPES.text, $condition, val);
      },
      col046($condition, val) {
        return applyAttributeCondition("col_046", TYPES.text, $condition, val);
      },
      col047($condition, val) {
        return applyAttributeCondition("col_047", TYPES.text, $condition, val);
      },
      col048($condition, val) {
        return applyAttributeCondition("col_048", TYPES.text, $condition, val);
      },
      col049($condition, val) {
        return applyAttributeCondition("col_049", TYPES.text, $condition, val);
      },
      col050($condition, val) {
        return applyAttributeCondition("col_050", TYPES.text, $condition, val);
      },
      col051($condition, val) {
        return applyAttributeCondition("col_051", TYPES.text, $condition, val);
      },
      col052($condition, val) {
        return applyAttributeCondition("col_052", TYPES.text, $condition, val);
      },
      col053($condition, val) {
        return applyAttributeCondition("col_053", TYPES.text, $condition, val);
      },
      col054($condition, val) {
        return applyAttributeCondition("col_054", TYPES.text, $condition, val);
      },
      col055($condition, val) {
        return applyAttributeCondition("col_055", TYPES.text, $condition, val);
      },
      col056($condition, val) {
        return applyAttributeCondition("col_056", TYPES.text, $condition, val);
      },
      col057($condition, val) {
        return applyAttributeCondition("col_057", TYPES.text, $condition, val);
      },
      col058($condition, val) {
        return applyAttributeCondition("col_058", TYPES.text, $condition, val);
      },
      col059($condition, val) {
        return applyAttributeCondition("col_059", TYPES.text, $condition, val);
      },
      col060($condition, val) {
        return applyAttributeCondition("col_060", TYPES.text, $condition, val);
      },
      col061($condition, val) {
        return applyAttributeCondition("col_061", TYPES.text, $condition, val);
      },
      col062($condition, val) {
        return applyAttributeCondition("col_062", TYPES.text, $condition, val);
      },
      col063($condition, val) {
        return applyAttributeCondition("col_063", TYPES.text, $condition, val);
      },
      col064($condition, val) {
        return applyAttributeCondition("col_064", TYPES.text, $condition, val);
      },
      col065($condition, val) {
        return applyAttributeCondition("col_065", TYPES.text, $condition, val);
      },
      col066($condition, val) {
        return applyAttributeCondition("col_066", TYPES.text, $condition, val);
      },
      col067($condition, val) {
        return applyAttributeCondition("col_067", TYPES.text, $condition, val);
      },
      col068($condition, val) {
        return applyAttributeCondition("col_068", TYPES.text, $condition, val);
      },
      col069($condition, val) {
        return applyAttributeCondition("col_069", TYPES.text, $condition, val);
      },
      col070($condition, val) {
        return applyAttributeCondition("col_070", TYPES.text, $condition, val);
      },
      col071($condition, val) {
        return applyAttributeCondition("col_071", TYPES.text, $condition, val);
      },
      col072($condition, val) {
        return applyAttributeCondition("col_072", TYPES.text, $condition, val);
      },
      col073($condition, val) {
        return applyAttributeCondition("col_073", TYPES.text, $condition, val);
      },
      col074($condition, val) {
        return applyAttributeCondition("col_074", TYPES.text, $condition, val);
      },
      col075($condition, val) {
        return applyAttributeCondition("col_075", TYPES.text, $condition, val);
      },
      col076($condition, val) {
        return applyAttributeCondition("col_076", TYPES.text, $condition, val);
      },
      col077($condition, val) {
        return applyAttributeCondition("col_077", TYPES.text, $condition, val);
      },
      col078($condition, val) {
        return applyAttributeCondition("col_078", TYPES.text, $condition, val);
      },
      col079($condition, val) {
        return applyAttributeCondition("col_079", TYPES.text, $condition, val);
      },
      col080($condition, val) {
        return applyAttributeCondition("col_080", TYPES.text, $condition, val);
      },
      col081($condition, val) {
        return applyAttributeCondition("col_081", TYPES.text, $condition, val);
      },
      col082($condition, val) {
        return applyAttributeCondition("col_082", TYPES.text, $condition, val);
      },
      col083($condition, val) {
        return applyAttributeCondition("col_083", TYPES.text, $condition, val);
      },
      col084($condition, val) {
        return applyAttributeCondition("col_084", TYPES.text, $condition, val);
      },
      col085($condition, val) {
        return applyAttributeCondition("col_085", TYPES.text, $condition, val);
      },
      col086($condition, val) {
        return applyAttributeCondition("col_086", TYPES.text, $condition, val);
      },
      col087($condition, val) {
        return applyAttributeCondition("col_087", TYPES.text, $condition, val);
      },
      col088($condition, val) {
        return applyAttributeCondition("col_088", TYPES.text, $condition, val);
      },
      col089($condition, val) {
        return applyAttributeCondition("col_089", TYPES.text, $condition, val);
      },
      col090($condition, val) {
        return applyAttributeCondition("col_090", TYPES.text, $condition, val);
      },
      col091($condition, val) {
        return applyAttributeCondition("col_091", TYPES.text, $condition, val);
      },
      col092($condition, val) {
        return applyAttributeCondition("col_092", TYPES.text, $condition, val);
      },
      col093($condition, val) {
        return applyAttributeCondition("col_093", TYPES.text, $condition, val);
      },
      col094($condition, val) {
        return applyAttributeCondition("col_094", TYPES.text, $condition, val);
      },
      col095($condition, val) {
        return applyAttributeCondition("col_095", TYPES.text, $condition, val);
      },
      col096($condition, val) {
        return applyAttributeCondition("col_096", TYPES.text, $condition, val);
      },
      col097($condition, val) {
        return applyAttributeCondition("col_097", TYPES.text, $condition, val);
      },
      col098($condition, val) {
        return applyAttributeCondition("col_098", TYPES.text, $condition, val);
      },
      col099($condition, val) {
        return applyAttributeCondition("col_099", TYPES.text, $condition, val);
      },
      col100($condition, val) {
        return applyAttributeCondition("col_100", TYPES.text, $condition, val);
      },
      createdAt($condition, val) {
        return applyAttributeCondition("created_at", TYPES.timestamptz, $condition, val);
      },
      episodes($condition, val) {
        return applyAttributeCondition("episodes", TYPES.int, $condition, val);
      },
      id($condition, val) {
        return applyAttributeCondition("id", TYPES.text, $condition, val);
      },
      name($condition, val) {
        return applyAttributeCondition("name", TYPES.text, $condition, val);
      },
      recommendations($condition, val) {
        return applyAttributeCondition("recommendations", TYPES.jsonb, $condition, val);
      },
      type($condition, val) {
        return applyAttributeCondition("type", TYPES.text, $condition, val);
      }
    }
  },
  CreateAwsApplicationInput: {
    plans: {
      awsApplication: applyCreateFields,
      clientMutationId: applyClientMutationIdForCreate
    }
  },
  CreateFirstPartyVulnerabilityInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      firstPartyVulnerability: applyCreateFields
    }
  },
  CreateGcpApplicationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      gcpApplication: applyCreateFields
    }
  },
  CreateLogEntryInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      logEntry: applyCreateFields
    }
  },
  CreateOrganizationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      organization: applyCreateFields
    }
  },
  CreatePersonInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      person: applyCreateFields
    }
  },
  CreateRelationalItemRelationCompositePkInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      relationalItemRelationCompositePk: applyCreateFields
    }
  },
  CreateRelationalItemRelationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      relationalItemRelation: applyCreateFields
    }
  },
  CreateSingleTableItemRelationCompositePkInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      singleTableItemRelationCompositePk: applyCreateFields
    }
  },
  CreateSingleTableItemRelationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      singleTableItemRelation: applyCreateFields
    }
  },
  CreateThirdPartyVulnerabilityInput: {
    plans: {
      clientMutationId: applyClientMutationIdForCreate,
      thirdPartyVulnerability: applyCreateFields
    }
  },
  CustomDeleteRelationalItemInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeleteAwsApplicationByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteAwsApplicationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteFirstPartyVulnerabilityByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteFirstPartyVulnerabilityInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteGcpApplicationByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteGcpApplicationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteLogEntryByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteLogEntryInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteOrganizationByNameInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteOrganizationByOrganizationIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteOrganizationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeletePersonByPersonIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeletePersonByUsernameInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeletePersonInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteRelationalItemRelationByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteRelationalItemRelationByParentIdAndChildIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteRelationalItemRelationCompositePkByParentIdAndChildIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteRelationalItemRelationCompositePkInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteRelationalItemRelationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteSingleTableItemRelationByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteSingleTableItemRelationByParentIdAndChildIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteSingleTableItemRelationCompositePkByParentIdAndChildIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteSingleTableItemRelationCompositePkInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteSingleTableItemRelationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteThirdPartyVulnerabilityByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  DeleteThirdPartyVulnerabilityInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  FirstPartyVulnerabilityCondition: {
    plans: {
      cvssScore($condition, val) {
        return applyAttributeCondition("cvss_score", TYPES.float, $condition, val);
      },
      id($condition, val) {
        return applyAttributeCondition("id", TYPES.int, $condition, val);
      },
      name($condition, val) {
        return applyAttributeCondition("name", TYPES.text, $condition, val);
      },
      teamName($condition, val) {
        return applyAttributeCondition("team_name", TYPES.text, $condition, val);
      }
    }
  },
  FirstPartyVulnerabilityInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      cvssScore(obj, val, {
        field,
        schema
      }) {
        obj.set("cvss_score", bakedInputRuntime(schema, field.type, val));
      },
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
      },
      teamName(obj, val, {
        field,
        schema
      }) {
        obj.set("team_name", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  FirstPartyVulnerabilityPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      cvssScore(obj, val, {
        field,
        schema
      }) {
        obj.set("cvss_score", bakedInputRuntime(schema, field.type, val));
      },
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
      },
      teamName(obj, val, {
        field,
        schema
      }) {
        obj.set("team_name", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  GcpApplicationCondition: {
    plans: {
      gcpId($condition, val) {
        return applyAttributeCondition("gcp_id", TYPES.text, $condition, val);
      },
      id($condition, val) {
        return applyAttributeCondition("id", TYPES.int, $condition, val);
      },
      lastDeployed($condition, val) {
        return applyAttributeCondition("last_deployed", TYPES.timestamptz, $condition, val);
      },
      name($condition, val) {
        return applyAttributeCondition("name", TYPES.text, $condition, val);
      },
      organizationId($condition, val) {
        return applyAttributeCondition("organization_id", TYPES.int, $condition, val);
      },
      personId($condition, val) {
        return applyAttributeCondition("person_id", TYPES.int, $condition, val);
      }
    }
  },
  GcpApplicationInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      gcpId(obj, val, {
        field,
        schema
      }) {
        obj.set("gcp_id", bakedInputRuntime(schema, field.type, val));
      },
      id(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      },
      lastDeployed(obj, val, {
        field,
        schema
      }) {
        obj.set("last_deployed", bakedInputRuntime(schema, field.type, val));
      },
      name(obj, val, {
        field,
        schema
      }) {
        obj.set("name", bakedInputRuntime(schema, field.type, val));
      },
      organizationId(obj, val, {
        field,
        schema
      }) {
        obj.set("organization_id", bakedInputRuntime(schema, field.type, val));
      },
      personId(obj, val, {
        field,
        schema
      }) {
        obj.set("person_id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  GcpApplicationPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      gcpId(obj, val, {
        field,
        schema
      }) {
        obj.set("gcp_id", bakedInputRuntime(schema, field.type, val));
      },
      id(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      },
      lastDeployed(obj, val, {
        field,
        schema
      }) {
        obj.set("last_deployed", bakedInputRuntime(schema, field.type, val));
      },
      name(obj, val, {
        field,
        schema
      }) {
        obj.set("name", bakedInputRuntime(schema, field.type, val));
      },
      organizationId(obj, val, {
        field,
        schema
      }) {
        obj.set("organization_id", bakedInputRuntime(schema, field.type, val));
      },
      personId(obj, val, {
        field,
        schema
      }) {
        obj.set("person_id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  LogEntryCondition: {
    plans: {
      id($condition, val) {
        return applyAttributeCondition("id", TYPES.int, $condition, val);
      },
      organizationId($condition, val) {
        return applyAttributeCondition("organization_id", TYPES.int, $condition, val);
      },
      personId($condition, val) {
        return applyAttributeCondition("person_id", TYPES.int, $condition, val);
      },
      text($condition, val) {
        return applyAttributeCondition("text", TYPES.text, $condition, val);
      }
    }
  },
  LogEntryInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      id(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      },
      organizationId(obj, val, {
        field,
        schema
      }) {
        obj.set("organization_id", bakedInputRuntime(schema, field.type, val));
      },
      personId(obj, val, {
        field,
        schema
      }) {
        obj.set("person_id", bakedInputRuntime(schema, field.type, val));
      },
      text(obj, val, {
        field,
        schema
      }) {
        obj.set("text", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  LogEntryPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      id(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      },
      organizationId(obj, val, {
        field,
        schema
      }) {
        obj.set("organization_id", bakedInputRuntime(schema, field.type, val));
      },
      personId(obj, val, {
        field,
        schema
      }) {
        obj.set("person_id", bakedInputRuntime(schema, field.type, val));
      },
      text(obj, val, {
        field,
        schema
      }) {
        obj.set("text", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  OrganizationCondition: {
    plans: {
      name($condition, val) {
        return applyAttributeCondition("name", TYPES.text, $condition, val);
      },
      organizationId($condition, val) {
        return applyAttributeCondition("organization_id", TYPES.int, $condition, val);
      }
    }
  },
  OrganizationInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      name(obj, val, {
        field,
        schema
      }) {
        obj.set("name", bakedInputRuntime(schema, field.type, val));
      },
      organizationId(obj, val, {
        field,
        schema
      }) {
        obj.set("organization_id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  OrganizationPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      name(obj, val, {
        field,
        schema
      }) {
        obj.set("name", bakedInputRuntime(schema, field.type, val));
      },
      organizationId(obj, val, {
        field,
        schema
      }) {
        obj.set("organization_id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  PersonCondition: {
    plans: {
      personId($condition, val) {
        return applyAttributeCondition("person_id", TYPES.int, $condition, val);
      },
      username($condition, val) {
        return applyAttributeCondition("username", TYPES.text, $condition, val);
      }
    }
  },
  PersonInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      personId(obj, val, {
        field,
        schema
      }) {
        obj.set("person_id", bakedInputRuntime(schema, field.type, val));
      },
      username(obj, val, {
        field,
        schema
      }) {
        obj.set("username", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  PersonPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      personId(obj, val, {
        field,
        schema
      }) {
        obj.set("person_id", bakedInputRuntime(schema, field.type, val));
      },
      username(obj, val, {
        field,
        schema
      }) {
        obj.set("username", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  RelationalChecklistCondition: {
    plans: {
      archivedAt($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemId");
        const expression = sql`${alias}.${sql.identifier("archived_at")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.timestamptz)}`;
        $condition.where(condition);
      },
      authorId($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemId");
        const expression = sql`${alias}.${sql.identifier("author_id")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        $condition.where(condition);
      },
      createdAt($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemId");
        const expression = sql`${alias}.${sql.identifier("created_at")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.timestamptz)}`;
        $condition.where(condition);
      },
      id($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemId");
        const expression = sql`${alias}.${sql.identifier("id")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        $condition.where(condition);
      },
      isExplicitlyArchived($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemId");
        const expression = sql`${alias}.${sql.identifier("is_explicitly_archived")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.boolean)}`;
        $condition.where(condition);
      },
      parentId($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemId");
        const expression = sql`${alias}.${sql.identifier("parent_id")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        $condition.where(condition);
      },
      position($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemId");
        const expression = sql`${alias}.${sql.identifier("position")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.bigint)}`;
        $condition.where(condition);
      },
      rootTopicId($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemId");
        const expression = sql`${alias}.${sql.identifier("root_topic_id")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        $condition.where(condition);
      },
      title($condition, val) {
        return applyAttributeCondition("title", TYPES.text, $condition, val);
      },
      type($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemId");
        const expression = sql`${alias}.${sql.identifier("type")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, itemTypeCodec)}`;
        $condition.where(condition);
      },
      updatedAt($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemId");
        const expression = sql`${alias}.${sql.identifier("updated_at")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.timestamptz)}`;
        $condition.where(condition);
      }
    }
  },
  RelationalChecklistItemCondition: {
    plans: {
      archivedAt($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemItemId");
        const expression = sql`${alias}.${sql.identifier("archived_at")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.timestamptz)}`;
        $condition.where(condition);
      },
      authorId($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemItemId");
        const expression = sql`${alias}.${sql.identifier("author_id")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        $condition.where(condition);
      },
      createdAt($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemItemId");
        const expression = sql`${alias}.${sql.identifier("created_at")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.timestamptz)}`;
        $condition.where(condition);
      },
      description($condition, val) {
        return applyAttributeCondition("description", TYPES.text, $condition, val);
      },
      id($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemItemId");
        const expression = sql`${alias}.${sql.identifier("id")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        $condition.where(condition);
      },
      isExplicitlyArchived($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemItemId");
        const expression = sql`${alias}.${sql.identifier("is_explicitly_archived")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.boolean)}`;
        $condition.where(condition);
      },
      note($condition, val) {
        return applyAttributeCondition("note", TYPES.text, $condition, val);
      },
      parentId($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemItemId");
        const expression = sql`${alias}.${sql.identifier("parent_id")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        $condition.where(condition);
      },
      position($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemItemId");
        const expression = sql`${alias}.${sql.identifier("position")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.bigint)}`;
        $condition.where(condition);
      },
      rootTopicId($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemItemId");
        const expression = sql`${alias}.${sql.identifier("root_topic_id")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        $condition.where(condition);
      },
      type($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemItemId");
        const expression = sql`${alias}.${sql.identifier("type")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, itemTypeCodec)}`;
        $condition.where(condition);
      },
      updatedAt($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemItemId");
        const expression = sql`${alias}.${sql.identifier("updated_at")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.timestamptz)}`;
        $condition.where(condition);
      }
    }
  },
  RelationalDividerCondition: {
    plans: {
      archivedAt($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyDividerItemId");
        const expression = sql`${alias}.${sql.identifier("archived_at")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.timestamptz)}`;
        $condition.where(condition);
      },
      authorId($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyDividerItemId");
        const expression = sql`${alias}.${sql.identifier("author_id")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        $condition.where(condition);
      },
      color($condition, val) {
        return applyAttributeCondition("color", TYPES.text, $condition, val);
      },
      createdAt($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyDividerItemId");
        const expression = sql`${alias}.${sql.identifier("created_at")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.timestamptz)}`;
        $condition.where(condition);
      },
      id($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyDividerItemId");
        const expression = sql`${alias}.${sql.identifier("id")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        $condition.where(condition);
      },
      isExplicitlyArchived($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyDividerItemId");
        const expression = sql`${alias}.${sql.identifier("is_explicitly_archived")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.boolean)}`;
        $condition.where(condition);
      },
      parentId($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyDividerItemId");
        const expression = sql`${alias}.${sql.identifier("parent_id")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        $condition.where(condition);
      },
      position($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyDividerItemId");
        const expression = sql`${alias}.${sql.identifier("position")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.bigint)}`;
        $condition.where(condition);
      },
      rootTopicId($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyDividerItemId");
        const expression = sql`${alias}.${sql.identifier("root_topic_id")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        $condition.where(condition);
      },
      title($condition, val) {
        return applyAttributeCondition("title", TYPES.text, $condition, val);
      },
      type($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyDividerItemId");
        const expression = sql`${alias}.${sql.identifier("type")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, itemTypeCodec)}`;
        $condition.where(condition);
      },
      updatedAt($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyDividerItemId");
        const expression = sql`${alias}.${sql.identifier("updated_at")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.timestamptz)}`;
        $condition.where(condition);
      }
    }
  },
  RelationalItemCondition: {
    plans: {
      archivedAt($condition, val) {
        return applyAttributeCondition("archived_at", TYPES.timestamptz, $condition, val);
      },
      authorId($condition, val) {
        return applyAttributeCondition("author_id", TYPES.int, $condition, val);
      },
      createdAt($condition, val) {
        return applyAttributeCondition("created_at", TYPES.timestamptz, $condition, val);
      },
      id($condition, val) {
        return applyAttributeCondition("id", TYPES.int, $condition, val);
      },
      isExplicitlyArchived($condition, val) {
        return applyAttributeCondition("is_explicitly_archived", TYPES.boolean, $condition, val);
      },
      parentId($condition, val) {
        return applyAttributeCondition("parent_id", TYPES.int, $condition, val);
      },
      position($condition, val) {
        return applyAttributeCondition("position", TYPES.bigint, $condition, val);
      },
      rootTopicId($condition, val) {
        return applyAttributeCondition("root_topic_id", TYPES.int, $condition, val);
      },
      type($condition, val) {
        return applyAttributeCondition("type", itemTypeCodec, $condition, val);
      },
      updatedAt($condition, val) {
        return applyAttributeCondition("updated_at", TYPES.timestamptz, $condition, val);
      }
    }
  },
  RelationalItemRelationCompositePkCondition: {
    plans: {
      childId($condition, val) {
        return applyAttributeCondition("child_id", TYPES.int, $condition, val);
      },
      parentId($condition, val) {
        return applyAttributeCondition("parent_id", TYPES.int, $condition, val);
      }
    }
  },
  RelationalItemRelationCompositePkInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      childId(obj, val, {
        field,
        schema
      }) {
        obj.set("child_id", bakedInputRuntime(schema, field.type, val));
      },
      parentId(obj, val, {
        field,
        schema
      }) {
        obj.set("parent_id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  RelationalItemRelationCompositePkPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      childId(obj, val, {
        field,
        schema
      }) {
        obj.set("child_id", bakedInputRuntime(schema, field.type, val));
      },
      parentId(obj, val, {
        field,
        schema
      }) {
        obj.set("parent_id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  RelationalItemRelationCondition: {
    plans: {
      childId($condition, val) {
        return applyAttributeCondition("child_id", TYPES.int, $condition, val);
      },
      id($condition, val) {
        return applyAttributeCondition("id", TYPES.int, $condition, val);
      },
      parentId($condition, val) {
        return applyAttributeCondition("parent_id", TYPES.int, $condition, val);
      }
    }
  },
  RelationalItemRelationInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      childId(obj, val, {
        field,
        schema
      }) {
        obj.set("child_id", bakedInputRuntime(schema, field.type, val));
      },
      id(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      },
      parentId(obj, val, {
        field,
        schema
      }) {
        obj.set("parent_id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  RelationalItemRelationPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      childId(obj, val, {
        field,
        schema
      }) {
        obj.set("child_id", bakedInputRuntime(schema, field.type, val));
      },
      id(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      },
      parentId(obj, val, {
        field,
        schema
      }) {
        obj.set("parent_id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  RelationalPostCondition: {
    plans: {
      archivedAt($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyPostItemId");
        const expression = sql`${alias}.${sql.identifier("archived_at")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.timestamptz)}`;
        $condition.where(condition);
      },
      authorId($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyPostItemId");
        const expression = sql`${alias}.${sql.identifier("author_id")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        $condition.where(condition);
      },
      createdAt($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyPostItemId");
        const expression = sql`${alias}.${sql.identifier("created_at")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.timestamptz)}`;
        $condition.where(condition);
      },
      description($condition, val) {
        return applyAttributeCondition("description", TYPES.text, $condition, val);
      },
      id($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyPostItemId");
        const expression = sql`${alias}.${sql.identifier("id")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        $condition.where(condition);
      },
      isExplicitlyArchived($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyPostItemId");
        const expression = sql`${alias}.${sql.identifier("is_explicitly_archived")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.boolean)}`;
        $condition.where(condition);
      },
      note($condition, val) {
        return applyAttributeCondition("note", TYPES.text, $condition, val);
      },
      parentId($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyPostItemId");
        const expression = sql`${alias}.${sql.identifier("parent_id")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        $condition.where(condition);
      },
      position($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyPostItemId");
        const expression = sql`${alias}.${sql.identifier("position")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.bigint)}`;
        $condition.where(condition);
      },
      rootTopicId($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyPostItemId");
        const expression = sql`${alias}.${sql.identifier("root_topic_id")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        $condition.where(condition);
      },
      title($condition, val) {
        return applyAttributeCondition("title", TYPES.text, $condition, val);
      },
      type($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyPostItemId");
        const expression = sql`${alias}.${sql.identifier("type")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, itemTypeCodec)}`;
        $condition.where(condition);
      },
      updatedAt($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyPostItemId");
        const expression = sql`${alias}.${sql.identifier("updated_at")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.timestamptz)}`;
        $condition.where(condition);
      }
    }
  },
  RelationalTopicCondition: {
    plans: {
      archivedAt($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyTopicItemId");
        const expression = sql`${alias}.${sql.identifier("archived_at")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.timestamptz)}`;
        $condition.where(condition);
      },
      authorId($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyTopicItemId");
        const expression = sql`${alias}.${sql.identifier("author_id")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        $condition.where(condition);
      },
      createdAt($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyTopicItemId");
        const expression = sql`${alias}.${sql.identifier("created_at")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.timestamptz)}`;
        $condition.where(condition);
      },
      id($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyTopicItemId");
        const expression = sql`${alias}.${sql.identifier("id")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        $condition.where(condition);
      },
      isExplicitlyArchived($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyTopicItemId");
        const expression = sql`${alias}.${sql.identifier("is_explicitly_archived")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.boolean)}`;
        $condition.where(condition);
      },
      parentId($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyTopicItemId");
        const expression = sql`${alias}.${sql.identifier("parent_id")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        $condition.where(condition);
      },
      position($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyTopicItemId");
        const expression = sql`${alias}.${sql.identifier("position")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.bigint)}`;
        $condition.where(condition);
      },
      rootTopicId($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyTopicItemId");
        const expression = sql`${alias}.${sql.identifier("root_topic_id")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
        $condition.where(condition);
      },
      title($condition, val) {
        return applyAttributeCondition("title", TYPES.text, $condition, val);
      },
      type($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyTopicItemId");
        const expression = sql`${alias}.${sql.identifier("type")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, itemTypeCodec)}`;
        $condition.where(condition);
      },
      updatedAt($condition, val) {
        const queryBuilder = $condition.dangerouslyGetParent();
        const alias = queryBuilder.singleRelation("relationalItemsByMyTopicItemId");
        const expression = sql`${alias}.${sql.identifier("updated_at")}`;
        const condition = val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.timestamptz)}`;
        $condition.where(condition);
      }
    }
  },
  SingleTableItemCondition: {
    plans: {
      archivedAt($condition, val) {
        return applyAttributeCondition("archived_at", TYPES.timestamptz, $condition, val);
      },
      authorId($condition, val) {
        return applyAttributeCondition("author_id", TYPES.int, $condition, val);
      },
      createdAt($condition, val) {
        return applyAttributeCondition("created_at", TYPES.timestamptz, $condition, val);
      },
      id($condition, val) {
        return applyAttributeCondition("id", TYPES.int, $condition, val);
      },
      isExplicitlyArchived($condition, val) {
        return applyAttributeCondition("is_explicitly_archived", TYPES.boolean, $condition, val);
      },
      parentId($condition, val) {
        return applyAttributeCondition("parent_id", TYPES.int, $condition, val);
      },
      position($condition, val) {
        return applyAttributeCondition("position", TYPES.bigint, $condition, val);
      },
      rootTopicId($condition, val) {
        return applyAttributeCondition("root_topic_id", TYPES.int, $condition, val);
      },
      type($condition, val) {
        return applyAttributeCondition("type", itemTypeCodec, $condition, val);
      },
      updatedAt($condition, val) {
        return applyAttributeCondition("updated_at", TYPES.timestamptz, $condition, val);
      }
    }
  },
  SingleTableItemRelationCompositePkCondition: {
    plans: {
      childId($condition, val) {
        return applyAttributeCondition("child_id", TYPES.int, $condition, val);
      },
      parentId($condition, val) {
        return applyAttributeCondition("parent_id", TYPES.int, $condition, val);
      }
    }
  },
  SingleTableItemRelationCompositePkInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      childId(obj, val, {
        field,
        schema
      }) {
        obj.set("child_id", bakedInputRuntime(schema, field.type, val));
      },
      parentId(obj, val, {
        field,
        schema
      }) {
        obj.set("parent_id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  SingleTableItemRelationCompositePkPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      childId(obj, val, {
        field,
        schema
      }) {
        obj.set("child_id", bakedInputRuntime(schema, field.type, val));
      },
      parentId(obj, val, {
        field,
        schema
      }) {
        obj.set("parent_id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  SingleTableItemRelationCondition: {
    plans: {
      childId($condition, val) {
        return applyAttributeCondition("child_id", TYPES.int, $condition, val);
      },
      id($condition, val) {
        return applyAttributeCondition("id", TYPES.int, $condition, val);
      },
      parentId($condition, val) {
        return applyAttributeCondition("parent_id", TYPES.int, $condition, val);
      }
    }
  },
  SingleTableItemRelationInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      childId(obj, val, {
        field,
        schema
      }) {
        obj.set("child_id", bakedInputRuntime(schema, field.type, val));
      },
      id(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      },
      parentId(obj, val, {
        field,
        schema
      }) {
        obj.set("parent_id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  SingleTableItemRelationPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      childId(obj, val, {
        field,
        schema
      }) {
        obj.set("child_id", bakedInputRuntime(schema, field.type, val));
      },
      id(obj, val, {
        field,
        schema
      }) {
        obj.set("id", bakedInputRuntime(schema, field.type, val));
      },
      parentId(obj, val, {
        field,
        schema
      }) {
        obj.set("parent_id", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  ThirdPartyVulnerabilityCondition: {
    plans: {
      cvssScore($condition, val) {
        return applyAttributeCondition("cvss_score", TYPES.float, $condition, val);
      },
      id($condition, val) {
        return applyAttributeCondition("id", TYPES.int, $condition, val);
      },
      name($condition, val) {
        return applyAttributeCondition("name", TYPES.text, $condition, val);
      },
      vendorName($condition, val) {
        return applyAttributeCondition("vendor_name", TYPES.text, $condition, val);
      }
    }
  },
  ThirdPartyVulnerabilityInput: {
    baked: createObjectAndApplyChildren,
    plans: {
      cvssScore(obj, val, {
        field,
        schema
      }) {
        obj.set("cvss_score", bakedInputRuntime(schema, field.type, val));
      },
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
      },
      vendorName(obj, val, {
        field,
        schema
      }) {
        obj.set("vendor_name", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  ThirdPartyVulnerabilityPatch: {
    baked: createObjectAndApplyChildren,
    plans: {
      cvssScore(obj, val, {
        field,
        schema
      }) {
        obj.set("cvss_score", bakedInputRuntime(schema, field.type, val));
      },
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
      },
      vendorName(obj, val, {
        field,
        schema
      }) {
        obj.set("vendor_name", bakedInputRuntime(schema, field.type, val));
      }
    }
  },
  UpdateAwsApplicationByIdInput: {
    plans: {
      awsApplicationPatch: applyPatchFields,
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  UpdateAwsApplicationInput: {
    plans: {
      awsApplicationPatch: applyPatchFields,
      clientMutationId: applyClientMutationIdForUpdateOrDelete
    }
  },
  UpdateFirstPartyVulnerabilityByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      firstPartyVulnerabilityPatch: applyPatchFields
    }
  },
  UpdateFirstPartyVulnerabilityInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      firstPartyVulnerabilityPatch: applyPatchFields
    }
  },
  UpdateGcpApplicationByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      gcpApplicationPatch: applyPatchFields
    }
  },
  UpdateGcpApplicationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      gcpApplicationPatch: applyPatchFields
    }
  },
  UpdateLogEntryByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      logEntryPatch: applyPatchFields
    }
  },
  UpdateLogEntryInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      logEntryPatch: applyPatchFields
    }
  },
  UpdateOrganizationByNameInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      organizationPatch: applyPatchFields
    }
  },
  UpdateOrganizationByOrganizationIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      organizationPatch: applyPatchFields
    }
  },
  UpdateOrganizationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      organizationPatch: applyPatchFields
    }
  },
  UpdatePersonByPersonIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      personPatch: applyPatchFields
    }
  },
  UpdatePersonByUsernameInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      personPatch: applyPatchFields
    }
  },
  UpdatePersonInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      personPatch: applyPatchFields
    }
  },
  UpdateRelationalItemRelationByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      relationalItemRelationPatch: applyPatchFields
    }
  },
  UpdateRelationalItemRelationByParentIdAndChildIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      relationalItemRelationPatch: applyPatchFields
    }
  },
  UpdateRelationalItemRelationCompositePkByParentIdAndChildIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      relationalItemRelationCompositePkPatch: applyPatchFields
    }
  },
  UpdateRelationalItemRelationCompositePkInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      relationalItemRelationCompositePkPatch: applyPatchFields
    }
  },
  UpdateRelationalItemRelationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      relationalItemRelationPatch: applyPatchFields
    }
  },
  UpdateSingleTableItemRelationByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      singleTableItemRelationPatch: applyPatchFields
    }
  },
  UpdateSingleTableItemRelationByParentIdAndChildIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      singleTableItemRelationPatch: applyPatchFields
    }
  },
  UpdateSingleTableItemRelationCompositePkByParentIdAndChildIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      singleTableItemRelationCompositePkPatch: applyPatchFields
    }
  },
  UpdateSingleTableItemRelationCompositePkInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      singleTableItemRelationCompositePkPatch: applyPatchFields
    }
  },
  UpdateSingleTableItemRelationInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      singleTableItemRelationPatch: applyPatchFields
    }
  },
  UpdateThirdPartyVulnerabilityByIdInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      thirdPartyVulnerabilityPatch: applyPatchFields
    }
  },
  UpdateThirdPartyVulnerabilityInput: {
    plans: {
      clientMutationId: applyClientMutationIdForUpdateOrDelete,
      thirdPartyVulnerabilityPatch: applyPatchFields
    }
  },
  VulnerabilityCondition: {
    plans: {
      cvssScore($condition, val) {
        return applyAttributeCondition("cvss_score", TYPES.float, $condition, val);
      },
      id($condition, val) {
        return applyAttributeCondition("id", TYPES.int, $condition, val);
      },
      name($condition, val) {
        return applyAttributeCondition("name", TYPES.text, $condition, val);
      }
    }
  },
  ZeroImplementationCondition: {
    plans: {
      id($condition, val) {
        return applyAttributeCondition("id", TYPES.int, $condition, val);
      },
      name($condition, val) {
        return applyAttributeCondition("name", TYPES.text, $condition, val);
      }
    }
  }
};
export const scalars = {
  BigInt: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`BigInt can only parse string values (kind='${ast.kind}')`);
    }
  },
  Cursor: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`Cursor can only parse string values (kind='${ast.kind}')`);
    }
  },
  Datetime: {
    serialize: toString,
    parseValue: toString,
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      throw new GraphQLError(`Datetime can only parse string values (kind='${ast.kind}')`);
    }
  },
  JSON: {
    serialize(value) {
      return JSON.stringify(value);
    },
    parseValue(value) {
      return JSON.parse(value);
    },
    parseLiteral(ast, _variables) {
      if (ast.kind === Kind.STRING) {
        return JSON.parse(ast.value);
      } else {
        return undefined;
      }
    }
  }
};
export const enums = {
  ApplicationsOrderBy: {
    values: {
      ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "ASC"
        });
      },
      ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "DESC"
        });
      },
      LAST_DEPLOYED_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "last_deployed",
          direction: "ASC"
        });
      },
      LAST_DEPLOYED_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "last_deployed",
          direction: "DESC"
        });
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
    }
  },
  AwsApplicationsOrderBy: {
    values: {
      AWS_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "aws_id",
          direction: "ASC"
        });
      },
      AWS_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "aws_id",
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
      LAST_DEPLOYED_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "last_deployed",
          direction: "ASC"
        });
      },
      LAST_DEPLOYED_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "last_deployed",
          direction: "DESC"
        });
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
      ORGANIZATION_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "organization_id",
          direction: "ASC"
        });
      },
      ORGANIZATION_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "organization_id",
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
        aws_applicationsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        aws_applicationsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      }
    }
  },
  CollectionsOrderBy: {
    values: {
      COL_001_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_001",
          direction: "ASC"
        });
      },
      COL_001_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_001",
          direction: "DESC"
        });
      },
      COL_002_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_002",
          direction: "ASC"
        });
      },
      COL_002_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_002",
          direction: "DESC"
        });
      },
      COL_003_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_003",
          direction: "ASC"
        });
      },
      COL_003_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_003",
          direction: "DESC"
        });
      },
      COL_004_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_004",
          direction: "ASC"
        });
      },
      COL_004_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_004",
          direction: "DESC"
        });
      },
      COL_005_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_005",
          direction: "ASC"
        });
      },
      COL_005_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_005",
          direction: "DESC"
        });
      },
      COL_006_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_006",
          direction: "ASC"
        });
      },
      COL_006_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_006",
          direction: "DESC"
        });
      },
      COL_007_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_007",
          direction: "ASC"
        });
      },
      COL_007_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_007",
          direction: "DESC"
        });
      },
      COL_008_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_008",
          direction: "ASC"
        });
      },
      COL_008_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_008",
          direction: "DESC"
        });
      },
      COL_009_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_009",
          direction: "ASC"
        });
      },
      COL_009_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_009",
          direction: "DESC"
        });
      },
      COL_010_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_010",
          direction: "ASC"
        });
      },
      COL_010_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_010",
          direction: "DESC"
        });
      },
      COL_011_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_011",
          direction: "ASC"
        });
      },
      COL_011_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_011",
          direction: "DESC"
        });
      },
      COL_012_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_012",
          direction: "ASC"
        });
      },
      COL_012_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_012",
          direction: "DESC"
        });
      },
      COL_013_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_013",
          direction: "ASC"
        });
      },
      COL_013_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_013",
          direction: "DESC"
        });
      },
      COL_014_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_014",
          direction: "ASC"
        });
      },
      COL_014_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_014",
          direction: "DESC"
        });
      },
      COL_015_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_015",
          direction: "ASC"
        });
      },
      COL_015_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_015",
          direction: "DESC"
        });
      },
      COL_016_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_016",
          direction: "ASC"
        });
      },
      COL_016_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_016",
          direction: "DESC"
        });
      },
      COL_017_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_017",
          direction: "ASC"
        });
      },
      COL_017_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_017",
          direction: "DESC"
        });
      },
      COL_018_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_018",
          direction: "ASC"
        });
      },
      COL_018_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_018",
          direction: "DESC"
        });
      },
      COL_019_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_019",
          direction: "ASC"
        });
      },
      COL_019_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_019",
          direction: "DESC"
        });
      },
      COL_020_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_020",
          direction: "ASC"
        });
      },
      COL_020_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_020",
          direction: "DESC"
        });
      },
      COL_021_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_021",
          direction: "ASC"
        });
      },
      COL_021_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_021",
          direction: "DESC"
        });
      },
      COL_022_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_022",
          direction: "ASC"
        });
      },
      COL_022_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_022",
          direction: "DESC"
        });
      },
      COL_023_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_023",
          direction: "ASC"
        });
      },
      COL_023_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_023",
          direction: "DESC"
        });
      },
      COL_024_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_024",
          direction: "ASC"
        });
      },
      COL_024_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_024",
          direction: "DESC"
        });
      },
      COL_025_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_025",
          direction: "ASC"
        });
      },
      COL_025_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_025",
          direction: "DESC"
        });
      },
      COL_026_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_026",
          direction: "ASC"
        });
      },
      COL_026_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_026",
          direction: "DESC"
        });
      },
      COL_027_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_027",
          direction: "ASC"
        });
      },
      COL_027_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_027",
          direction: "DESC"
        });
      },
      COL_028_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_028",
          direction: "ASC"
        });
      },
      COL_028_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_028",
          direction: "DESC"
        });
      },
      COL_029_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_029",
          direction: "ASC"
        });
      },
      COL_029_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_029",
          direction: "DESC"
        });
      },
      COL_030_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_030",
          direction: "ASC"
        });
      },
      COL_030_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_030",
          direction: "DESC"
        });
      },
      COL_031_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_031",
          direction: "ASC"
        });
      },
      COL_031_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_031",
          direction: "DESC"
        });
      },
      COL_032_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_032",
          direction: "ASC"
        });
      },
      COL_032_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_032",
          direction: "DESC"
        });
      },
      COL_033_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_033",
          direction: "ASC"
        });
      },
      COL_033_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_033",
          direction: "DESC"
        });
      },
      COL_034_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_034",
          direction: "ASC"
        });
      },
      COL_034_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_034",
          direction: "DESC"
        });
      },
      COL_035_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_035",
          direction: "ASC"
        });
      },
      COL_035_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_035",
          direction: "DESC"
        });
      },
      COL_036_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_036",
          direction: "ASC"
        });
      },
      COL_036_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_036",
          direction: "DESC"
        });
      },
      COL_037_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_037",
          direction: "ASC"
        });
      },
      COL_037_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_037",
          direction: "DESC"
        });
      },
      COL_038_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_038",
          direction: "ASC"
        });
      },
      COL_038_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_038",
          direction: "DESC"
        });
      },
      COL_039_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_039",
          direction: "ASC"
        });
      },
      COL_039_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_039",
          direction: "DESC"
        });
      },
      COL_040_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_040",
          direction: "ASC"
        });
      },
      COL_040_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_040",
          direction: "DESC"
        });
      },
      COL_041_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_041",
          direction: "ASC"
        });
      },
      COL_041_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_041",
          direction: "DESC"
        });
      },
      COL_042_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_042",
          direction: "ASC"
        });
      },
      COL_042_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_042",
          direction: "DESC"
        });
      },
      COL_043_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_043",
          direction: "ASC"
        });
      },
      COL_043_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_043",
          direction: "DESC"
        });
      },
      COL_044_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_044",
          direction: "ASC"
        });
      },
      COL_044_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_044",
          direction: "DESC"
        });
      },
      COL_045_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_045",
          direction: "ASC"
        });
      },
      COL_045_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_045",
          direction: "DESC"
        });
      },
      COL_046_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_046",
          direction: "ASC"
        });
      },
      COL_046_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_046",
          direction: "DESC"
        });
      },
      COL_047_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_047",
          direction: "ASC"
        });
      },
      COL_047_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_047",
          direction: "DESC"
        });
      },
      COL_048_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_048",
          direction: "ASC"
        });
      },
      COL_048_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_048",
          direction: "DESC"
        });
      },
      COL_049_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_049",
          direction: "ASC"
        });
      },
      COL_049_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_049",
          direction: "DESC"
        });
      },
      COL_050_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_050",
          direction: "ASC"
        });
      },
      COL_050_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_050",
          direction: "DESC"
        });
      },
      COL_051_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_051",
          direction: "ASC"
        });
      },
      COL_051_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_051",
          direction: "DESC"
        });
      },
      COL_052_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_052",
          direction: "ASC"
        });
      },
      COL_052_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_052",
          direction: "DESC"
        });
      },
      COL_053_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_053",
          direction: "ASC"
        });
      },
      COL_053_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_053",
          direction: "DESC"
        });
      },
      COL_054_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_054",
          direction: "ASC"
        });
      },
      COL_054_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_054",
          direction: "DESC"
        });
      },
      COL_055_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_055",
          direction: "ASC"
        });
      },
      COL_055_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_055",
          direction: "DESC"
        });
      },
      COL_056_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_056",
          direction: "ASC"
        });
      },
      COL_056_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_056",
          direction: "DESC"
        });
      },
      COL_057_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_057",
          direction: "ASC"
        });
      },
      COL_057_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_057",
          direction: "DESC"
        });
      },
      COL_058_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_058",
          direction: "ASC"
        });
      },
      COL_058_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_058",
          direction: "DESC"
        });
      },
      COL_059_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_059",
          direction: "ASC"
        });
      },
      COL_059_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_059",
          direction: "DESC"
        });
      },
      COL_060_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_060",
          direction: "ASC"
        });
      },
      COL_060_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_060",
          direction: "DESC"
        });
      },
      COL_061_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_061",
          direction: "ASC"
        });
      },
      COL_061_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_061",
          direction: "DESC"
        });
      },
      COL_062_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_062",
          direction: "ASC"
        });
      },
      COL_062_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_062",
          direction: "DESC"
        });
      },
      COL_063_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_063",
          direction: "ASC"
        });
      },
      COL_063_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_063",
          direction: "DESC"
        });
      },
      COL_064_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_064",
          direction: "ASC"
        });
      },
      COL_064_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_064",
          direction: "DESC"
        });
      },
      COL_065_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_065",
          direction: "ASC"
        });
      },
      COL_065_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_065",
          direction: "DESC"
        });
      },
      COL_066_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_066",
          direction: "ASC"
        });
      },
      COL_066_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_066",
          direction: "DESC"
        });
      },
      COL_067_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_067",
          direction: "ASC"
        });
      },
      COL_067_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_067",
          direction: "DESC"
        });
      },
      COL_068_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_068",
          direction: "ASC"
        });
      },
      COL_068_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_068",
          direction: "DESC"
        });
      },
      COL_069_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_069",
          direction: "ASC"
        });
      },
      COL_069_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_069",
          direction: "DESC"
        });
      },
      COL_070_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_070",
          direction: "ASC"
        });
      },
      COL_070_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_070",
          direction: "DESC"
        });
      },
      COL_071_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_071",
          direction: "ASC"
        });
      },
      COL_071_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_071",
          direction: "DESC"
        });
      },
      COL_072_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_072",
          direction: "ASC"
        });
      },
      COL_072_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_072",
          direction: "DESC"
        });
      },
      COL_073_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_073",
          direction: "ASC"
        });
      },
      COL_073_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_073",
          direction: "DESC"
        });
      },
      COL_074_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_074",
          direction: "ASC"
        });
      },
      COL_074_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_074",
          direction: "DESC"
        });
      },
      COL_075_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_075",
          direction: "ASC"
        });
      },
      COL_075_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_075",
          direction: "DESC"
        });
      },
      COL_076_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_076",
          direction: "ASC"
        });
      },
      COL_076_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_076",
          direction: "DESC"
        });
      },
      COL_077_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_077",
          direction: "ASC"
        });
      },
      COL_077_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_077",
          direction: "DESC"
        });
      },
      COL_078_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_078",
          direction: "ASC"
        });
      },
      COL_078_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_078",
          direction: "DESC"
        });
      },
      COL_079_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_079",
          direction: "ASC"
        });
      },
      COL_079_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_079",
          direction: "DESC"
        });
      },
      COL_080_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_080",
          direction: "ASC"
        });
      },
      COL_080_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_080",
          direction: "DESC"
        });
      },
      COL_081_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_081",
          direction: "ASC"
        });
      },
      COL_081_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_081",
          direction: "DESC"
        });
      },
      COL_082_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_082",
          direction: "ASC"
        });
      },
      COL_082_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_082",
          direction: "DESC"
        });
      },
      COL_083_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_083",
          direction: "ASC"
        });
      },
      COL_083_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_083",
          direction: "DESC"
        });
      },
      COL_084_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_084",
          direction: "ASC"
        });
      },
      COL_084_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_084",
          direction: "DESC"
        });
      },
      COL_085_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_085",
          direction: "ASC"
        });
      },
      COL_085_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_085",
          direction: "DESC"
        });
      },
      COL_086_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_086",
          direction: "ASC"
        });
      },
      COL_086_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_086",
          direction: "DESC"
        });
      },
      COL_087_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_087",
          direction: "ASC"
        });
      },
      COL_087_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_087",
          direction: "DESC"
        });
      },
      COL_088_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_088",
          direction: "ASC"
        });
      },
      COL_088_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_088",
          direction: "DESC"
        });
      },
      COL_089_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_089",
          direction: "ASC"
        });
      },
      COL_089_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_089",
          direction: "DESC"
        });
      },
      COL_090_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_090",
          direction: "ASC"
        });
      },
      COL_090_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_090",
          direction: "DESC"
        });
      },
      COL_091_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_091",
          direction: "ASC"
        });
      },
      COL_091_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_091",
          direction: "DESC"
        });
      },
      COL_092_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_092",
          direction: "ASC"
        });
      },
      COL_092_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_092",
          direction: "DESC"
        });
      },
      COL_093_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_093",
          direction: "ASC"
        });
      },
      COL_093_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_093",
          direction: "DESC"
        });
      },
      COL_094_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_094",
          direction: "ASC"
        });
      },
      COL_094_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_094",
          direction: "DESC"
        });
      },
      COL_095_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_095",
          direction: "ASC"
        });
      },
      COL_095_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_095",
          direction: "DESC"
        });
      },
      COL_096_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_096",
          direction: "ASC"
        });
      },
      COL_096_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_096",
          direction: "DESC"
        });
      },
      COL_097_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_097",
          direction: "ASC"
        });
      },
      COL_097_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_097",
          direction: "DESC"
        });
      },
      COL_098_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_098",
          direction: "ASC"
        });
      },
      COL_098_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_098",
          direction: "DESC"
        });
      },
      COL_099_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_099",
          direction: "ASC"
        });
      },
      COL_099_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_099",
          direction: "DESC"
        });
      },
      COL_100_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_100",
          direction: "ASC"
        });
      },
      COL_100_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "col_100",
          direction: "DESC"
        });
      },
      CREATED_AT_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "created_at",
          direction: "ASC"
        });
      },
      CREATED_AT_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "created_at",
          direction: "DESC"
        });
      },
      EPISODES_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "episodes",
          direction: "ASC"
        });
      },
      EPISODES_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "episodes",
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
        collectionsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        collectionsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      RECOMMENDATIONS_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "recommendations",
          direction: "ASC"
        });
      },
      RECOMMENDATIONS_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "recommendations",
          direction: "DESC"
        });
      },
      TYPE_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "type",
          direction: "ASC"
        });
      },
      TYPE_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "type",
          direction: "DESC"
        });
      }
    }
  },
  FirstPartyVulnerabilitiesOrderBy: {
    values: {
      CVSS_SCORE_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "cvss_score",
          direction: "ASC"
        });
      },
      CVSS_SCORE_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "cvss_score",
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
        first_party_vulnerabilitiesUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        first_party_vulnerabilitiesUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      TEAM_NAME_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "team_name",
          direction: "ASC"
        });
      },
      TEAM_NAME_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "team_name",
          direction: "DESC"
        });
      }
    }
  },
  GcpApplicationsOrderBy: {
    values: {
      GCP_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "gcp_id",
          direction: "ASC"
        });
      },
      GCP_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "gcp_id",
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
      LAST_DEPLOYED_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "last_deployed",
          direction: "ASC"
        });
      },
      LAST_DEPLOYED_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "last_deployed",
          direction: "DESC"
        });
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
      ORGANIZATION_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "organization_id",
          direction: "ASC"
        });
      },
      ORGANIZATION_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "organization_id",
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
        gcp_applicationsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        gcp_applicationsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      }
    }
  },
  LogEntriesOrderBy: {
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
      ORGANIZATION_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "organization_id",
          direction: "ASC"
        });
      },
      ORGANIZATION_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "organization_id",
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
        log_entriesUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        log_entriesUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      TEXT_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "text",
          direction: "ASC"
        });
      },
      TEXT_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "text",
          direction: "DESC"
        });
      }
    }
  },
  OrganizationsOrderBy: {
    values: {
      NAME_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "name",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      NAME_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "name",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
      },
      ORGANIZATION_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "organization_id",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      ORGANIZATION_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "organization_id",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_ASC(queryBuilder) {
        organizationsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        organizationsUniques[0].attributes.forEach(attributeName => {
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
      PERSON_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "person_id",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      PERSON_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "person_id",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
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
      },
      USERNAME_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "username",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      USERNAME_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "username",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
      }
    }
  },
  RelationalChecklistItemsOrderBy: {
    values: {
      ARCHIVED_AT_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("archived_at")}`,
          codec: TYPES.timestamptz,
          direction: "ASC"
        });
      },
      ARCHIVED_AT_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "archived_at",
          direction: "DESC"
        });
      },
      AUTHOR_ID_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("author_id")}`,
          codec: TYPES.int,
          direction: "ASC"
        });
      },
      AUTHOR_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "author_id",
          direction: "DESC"
        });
      },
      CREATED_AT_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("created_at")}`,
          codec: TYPES.timestamptz,
          direction: "ASC"
        });
      },
      CREATED_AT_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "created_at",
          direction: "DESC"
        });
      },
      DESCRIPTION_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "description",
          direction: "ASC"
        });
      },
      DESCRIPTION_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "description",
          direction: "DESC"
        });
      },
      ID_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("id")}`,
          codec: TYPES.int,
          direction: "ASC"
        });
      },
      ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "DESC"
        });
      },
      IS_EXPLICITLY_ARCHIVED_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("is_explicitly_archived")}`,
          codec: TYPES.boolean,
          direction: "ASC"
        });
      },
      IS_EXPLICITLY_ARCHIVED_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "is_explicitly_archived",
          direction: "DESC"
        });
      },
      NOTE_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "note",
          direction: "ASC"
        });
      },
      NOTE_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "note",
          direction: "DESC"
        });
      },
      PARENT_ID_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("parent_id")}`,
          codec: TYPES.int,
          direction: "ASC"
        });
      },
      PARENT_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "parent_id",
          direction: "DESC"
        });
      },
      POSITION_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("position")}`,
          codec: TYPES.bigint,
          direction: "ASC"
        });
      },
      POSITION_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "position",
          direction: "DESC"
        });
      },
      PRIMARY_KEY_ASC(queryBuilder) {
        relational_checklist_itemsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        relational_checklist_itemsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      ROOT_TOPIC_ID_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("root_topic_id")}`,
          codec: TYPES.int,
          direction: "ASC"
        });
      },
      ROOT_TOPIC_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "root_topic_id",
          direction: "DESC"
        });
      },
      TYPE_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("type")}`,
          codec: itemTypeCodec,
          direction: "ASC"
        });
      },
      TYPE_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "type",
          direction: "DESC"
        });
      },
      UPDATED_AT_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("updated_at")}`,
          codec: TYPES.timestamptz,
          direction: "ASC"
        });
      },
      UPDATED_AT_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "updated_at",
          direction: "DESC"
        });
      }
    }
  },
  RelationalChecklistsOrderBy: {
    values: {
      ARCHIVED_AT_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("archived_at")}`,
          codec: TYPES.timestamptz,
          direction: "ASC"
        });
      },
      ARCHIVED_AT_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "archived_at",
          direction: "DESC"
        });
      },
      AUTHOR_ID_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("author_id")}`,
          codec: TYPES.int,
          direction: "ASC"
        });
      },
      AUTHOR_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "author_id",
          direction: "DESC"
        });
      },
      CREATED_AT_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("created_at")}`,
          codec: TYPES.timestamptz,
          direction: "ASC"
        });
      },
      CREATED_AT_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "created_at",
          direction: "DESC"
        });
      },
      ID_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("id")}`,
          codec: TYPES.int,
          direction: "ASC"
        });
      },
      ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "DESC"
        });
      },
      IS_EXPLICITLY_ARCHIVED_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("is_explicitly_archived")}`,
          codec: TYPES.boolean,
          direction: "ASC"
        });
      },
      IS_EXPLICITLY_ARCHIVED_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "is_explicitly_archived",
          direction: "DESC"
        });
      },
      PARENT_ID_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("parent_id")}`,
          codec: TYPES.int,
          direction: "ASC"
        });
      },
      PARENT_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "parent_id",
          direction: "DESC"
        });
      },
      POSITION_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("position")}`,
          codec: TYPES.bigint,
          direction: "ASC"
        });
      },
      POSITION_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "position",
          direction: "DESC"
        });
      },
      PRIMARY_KEY_ASC(queryBuilder) {
        relational_checklistsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        relational_checklistsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      ROOT_TOPIC_ID_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("root_topic_id")}`,
          codec: TYPES.int,
          direction: "ASC"
        });
      },
      ROOT_TOPIC_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "root_topic_id",
          direction: "DESC"
        });
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
      },
      TYPE_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("type")}`,
          codec: itemTypeCodec,
          direction: "ASC"
        });
      },
      TYPE_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "type",
          direction: "DESC"
        });
      },
      UPDATED_AT_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("updated_at")}`,
          codec: TYPES.timestamptz,
          direction: "ASC"
        });
      },
      UPDATED_AT_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "updated_at",
          direction: "DESC"
        });
      }
    }
  },
  RelationalDividersOrderBy: {
    values: {
      ARCHIVED_AT_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyDividerItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("archived_at")}`,
          codec: TYPES.timestamptz,
          direction: "ASC"
        });
      },
      ARCHIVED_AT_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "archived_at",
          direction: "DESC"
        });
      },
      AUTHOR_ID_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyDividerItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("author_id")}`,
          codec: TYPES.int,
          direction: "ASC"
        });
      },
      AUTHOR_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "author_id",
          direction: "DESC"
        });
      },
      COLOR_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "color",
          direction: "ASC"
        });
      },
      COLOR_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "color",
          direction: "DESC"
        });
      },
      CREATED_AT_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyDividerItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("created_at")}`,
          codec: TYPES.timestamptz,
          direction: "ASC"
        });
      },
      CREATED_AT_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "created_at",
          direction: "DESC"
        });
      },
      ID_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyDividerItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("id")}`,
          codec: TYPES.int,
          direction: "ASC"
        });
      },
      ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "DESC"
        });
      },
      IS_EXPLICITLY_ARCHIVED_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyDividerItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("is_explicitly_archived")}`,
          codec: TYPES.boolean,
          direction: "ASC"
        });
      },
      IS_EXPLICITLY_ARCHIVED_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "is_explicitly_archived",
          direction: "DESC"
        });
      },
      PARENT_ID_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyDividerItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("parent_id")}`,
          codec: TYPES.int,
          direction: "ASC"
        });
      },
      PARENT_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "parent_id",
          direction: "DESC"
        });
      },
      POSITION_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyDividerItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("position")}`,
          codec: TYPES.bigint,
          direction: "ASC"
        });
      },
      POSITION_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "position",
          direction: "DESC"
        });
      },
      PRIMARY_KEY_ASC(queryBuilder) {
        relational_dividersUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        relational_dividersUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      ROOT_TOPIC_ID_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyDividerItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("root_topic_id")}`,
          codec: TYPES.int,
          direction: "ASC"
        });
      },
      ROOT_TOPIC_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "root_topic_id",
          direction: "DESC"
        });
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
      },
      TYPE_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyDividerItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("type")}`,
          codec: itemTypeCodec,
          direction: "ASC"
        });
      },
      TYPE_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "type",
          direction: "DESC"
        });
      },
      UPDATED_AT_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyDividerItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("updated_at")}`,
          codec: TYPES.timestamptz,
          direction: "ASC"
        });
      },
      UPDATED_AT_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "updated_at",
          direction: "DESC"
        });
      }
    }
  },
  RelationalItemRelationCompositePksOrderBy: {
    values: {
      CHILD_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "child_id",
          direction: "ASC"
        });
      },
      CHILD_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "child_id",
          direction: "DESC"
        });
      },
      PARENT_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "parent_id",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      PARENT_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "parent_id",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_ASC(queryBuilder) {
        relational_item_relation_composite_pksUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        relational_item_relation_composite_pksUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      }
    }
  },
  RelationalItemRelationsOrderBy: {
    values: {
      CHILD_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "child_id",
          direction: "ASC"
        });
      },
      CHILD_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "child_id",
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
      PARENT_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "parent_id",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      PARENT_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "parent_id",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_ASC(queryBuilder) {
        relational_item_relationsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        relational_item_relationsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      }
    }
  },
  RelationalItemsOrderBy: {
    values: {
      ARCHIVED_AT_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "archived_at",
          direction: "ASC"
        });
      },
      ARCHIVED_AT_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "archived_at",
          direction: "DESC"
        });
      },
      AUTHOR_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "author_id",
          direction: "ASC"
        });
      },
      AUTHOR_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "author_id",
          direction: "DESC"
        });
      },
      CREATED_AT_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "created_at",
          direction: "ASC"
        });
      },
      CREATED_AT_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "created_at",
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
      IS_EXPLICITLY_ARCHIVED_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "is_explicitly_archived",
          direction: "ASC"
        });
      },
      IS_EXPLICITLY_ARCHIVED_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "is_explicitly_archived",
          direction: "DESC"
        });
      },
      PARENT_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "parent_id",
          direction: "ASC"
        });
      },
      PARENT_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "parent_id",
          direction: "DESC"
        });
      },
      POSITION_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "position",
          direction: "ASC"
        });
      },
      POSITION_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "position",
          direction: "DESC"
        });
      },
      PRIMARY_KEY_ASC(queryBuilder) {
        relational_itemsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        relational_itemsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      ROOT_TOPIC_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "root_topic_id",
          direction: "ASC"
        });
      },
      ROOT_TOPIC_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "root_topic_id",
          direction: "DESC"
        });
      },
      TYPE_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "type",
          direction: "ASC"
        });
      },
      TYPE_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "type",
          direction: "DESC"
        });
      },
      UPDATED_AT_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "updated_at",
          direction: "ASC"
        });
      },
      UPDATED_AT_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "updated_at",
          direction: "DESC"
        });
      }
    }
  },
  RelationalPostsOrderBy: {
    values: {
      ARCHIVED_AT_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyPostItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("archived_at")}`,
          codec: TYPES.timestamptz,
          direction: "ASC"
        });
      },
      ARCHIVED_AT_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "archived_at",
          direction: "DESC"
        });
      },
      AUTHOR_ID_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyPostItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("author_id")}`,
          codec: TYPES.int,
          direction: "ASC"
        });
      },
      AUTHOR_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "author_id",
          direction: "DESC"
        });
      },
      CREATED_AT_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyPostItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("created_at")}`,
          codec: TYPES.timestamptz,
          direction: "ASC"
        });
      },
      CREATED_AT_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "created_at",
          direction: "DESC"
        });
      },
      DESCRIPTION_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "description",
          direction: "ASC"
        });
      },
      DESCRIPTION_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "description",
          direction: "DESC"
        });
      },
      ID_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyPostItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("id")}`,
          codec: TYPES.int,
          direction: "ASC"
        });
      },
      ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "DESC"
        });
      },
      IS_EXPLICITLY_ARCHIVED_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyPostItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("is_explicitly_archived")}`,
          codec: TYPES.boolean,
          direction: "ASC"
        });
      },
      IS_EXPLICITLY_ARCHIVED_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "is_explicitly_archived",
          direction: "DESC"
        });
      },
      NOTE_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "note",
          direction: "ASC"
        });
      },
      NOTE_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "note",
          direction: "DESC"
        });
      },
      PARENT_ID_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyPostItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("parent_id")}`,
          codec: TYPES.int,
          direction: "ASC"
        });
      },
      PARENT_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "parent_id",
          direction: "DESC"
        });
      },
      POSITION_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyPostItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("position")}`,
          codec: TYPES.bigint,
          direction: "ASC"
        });
      },
      POSITION_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "position",
          direction: "DESC"
        });
      },
      PRIMARY_KEY_ASC(queryBuilder) {
        relational_postsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        relational_postsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      ROOT_TOPIC_ID_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyPostItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("root_topic_id")}`,
          codec: TYPES.int,
          direction: "ASC"
        });
      },
      ROOT_TOPIC_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "root_topic_id",
          direction: "DESC"
        });
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
      },
      TYPE_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyPostItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("type")}`,
          codec: itemTypeCodec,
          direction: "ASC"
        });
      },
      TYPE_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "type",
          direction: "DESC"
        });
      },
      UPDATED_AT_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyPostItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("updated_at")}`,
          codec: TYPES.timestamptz,
          direction: "ASC"
        });
      },
      UPDATED_AT_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "updated_at",
          direction: "DESC"
        });
      }
    }
  },
  RelationalTopicsOrderBy: {
    values: {
      ARCHIVED_AT_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyTopicItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("archived_at")}`,
          codec: TYPES.timestamptz,
          direction: "ASC"
        });
      },
      ARCHIVED_AT_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "archived_at",
          direction: "DESC"
        });
      },
      AUTHOR_ID_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyTopicItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("author_id")}`,
          codec: TYPES.int,
          direction: "ASC"
        });
      },
      AUTHOR_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "author_id",
          direction: "DESC"
        });
      },
      CREATED_AT_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyTopicItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("created_at")}`,
          codec: TYPES.timestamptz,
          direction: "ASC"
        });
      },
      CREATED_AT_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "created_at",
          direction: "DESC"
        });
      },
      ID_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyTopicItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("id")}`,
          codec: TYPES.int,
          direction: "ASC"
        });
      },
      ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "DESC"
        });
      },
      IS_EXPLICITLY_ARCHIVED_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyTopicItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("is_explicitly_archived")}`,
          codec: TYPES.boolean,
          direction: "ASC"
        });
      },
      IS_EXPLICITLY_ARCHIVED_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "is_explicitly_archived",
          direction: "DESC"
        });
      },
      PARENT_ID_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyTopicItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("parent_id")}`,
          codec: TYPES.int,
          direction: "ASC"
        });
      },
      PARENT_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "parent_id",
          direction: "DESC"
        });
      },
      POSITION_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyTopicItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("position")}`,
          codec: TYPES.bigint,
          direction: "ASC"
        });
      },
      POSITION_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "position",
          direction: "DESC"
        });
      },
      PRIMARY_KEY_ASC(queryBuilder) {
        relational_topicsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        relational_topicsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      ROOT_TOPIC_ID_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyTopicItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("root_topic_id")}`,
          codec: TYPES.int,
          direction: "ASC"
        });
      },
      ROOT_TOPIC_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "root_topic_id",
          direction: "DESC"
        });
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
      },
      TYPE_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyTopicItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("type")}`,
          codec: itemTypeCodec,
          direction: "ASC"
        });
      },
      TYPE_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "type",
          direction: "DESC"
        });
      },
      UPDATED_AT_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyTopicItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("updated_at")}`,
          codec: TYPES.timestamptz,
          direction: "ASC"
        });
      },
      UPDATED_AT_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "updated_at",
          direction: "DESC"
        });
      }
    }
  },
  SingleTableItemRelationCompositePksOrderBy: {
    values: {
      CHILD_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "child_id",
          direction: "ASC"
        });
      },
      CHILD_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "child_id",
          direction: "DESC"
        });
      },
      PARENT_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "parent_id",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      PARENT_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "parent_id",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_ASC(queryBuilder) {
        single_table_item_relation_composite_pksUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        single_table_item_relation_composite_pksUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      }
    }
  },
  SingleTableItemRelationsOrderBy: {
    values: {
      CHILD_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "child_id",
          direction: "ASC"
        });
      },
      CHILD_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "child_id",
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
      PARENT_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "parent_id",
          direction: "ASC"
        });
        queryBuilder.setOrderIsUnique();
      },
      PARENT_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "parent_id",
          direction: "DESC"
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_ASC(queryBuilder) {
        single_table_item_relationsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        single_table_item_relationsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      }
    }
  },
  SingleTableItemsOrderBy: {
    values: {
      ARCHIVED_AT_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "archived_at",
          direction: "ASC"
        });
      },
      ARCHIVED_AT_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "archived_at",
          direction: "DESC"
        });
      },
      AUTHOR_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "author_id",
          direction: "ASC"
        });
      },
      AUTHOR_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "author_id",
          direction: "DESC"
        });
      },
      CREATED_AT_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "created_at",
          direction: "ASC"
        });
      },
      CREATED_AT_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "created_at",
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
      IS_EXPLICITLY_ARCHIVED_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "is_explicitly_archived",
          direction: "ASC"
        });
      },
      IS_EXPLICITLY_ARCHIVED_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "is_explicitly_archived",
          direction: "DESC"
        });
      },
      PARENT_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "parent_id",
          direction: "ASC"
        });
      },
      PARENT_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "parent_id",
          direction: "DESC"
        });
      },
      POSITION_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "position",
          direction: "ASC"
        });
      },
      POSITION_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "position",
          direction: "DESC"
        });
      },
      PRIMARY_KEY_ASC(queryBuilder) {
        single_table_itemsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        single_table_itemsUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      ROOT_TOPIC_ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "root_topic_id",
          direction: "ASC"
        });
      },
      ROOT_TOPIC_ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "root_topic_id",
          direction: "DESC"
        });
      },
      TYPE_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "type",
          direction: "ASC"
        });
      },
      TYPE_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "type",
          direction: "DESC"
        });
      },
      UPDATED_AT_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "updated_at",
          direction: "ASC"
        });
      },
      UPDATED_AT_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "updated_at",
          direction: "DESC"
        });
      }
    }
  },
  ThirdPartyVulnerabilitiesOrderBy: {
    values: {
      CVSS_SCORE_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "cvss_score",
          direction: "ASC"
        });
      },
      CVSS_SCORE_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "cvss_score",
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
        third_party_vulnerabilitiesUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "ASC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      PRIMARY_KEY_DESC(queryBuilder) {
        third_party_vulnerabilitiesUniques[0].attributes.forEach(attributeName => {
          queryBuilder.orderBy({
            attribute: attributeName,
            direction: "DESC"
          });
        });
        queryBuilder.setOrderIsUnique();
      },
      VENDOR_NAME_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "vendor_name",
          direction: "ASC"
        });
      },
      VENDOR_NAME_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "vendor_name",
          direction: "DESC"
        });
      }
    }
  },
  VulnerabilitiesOrderBy: {
    values: {
      CVSS_SCORE_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "cvss_score",
          direction: "ASC"
        });
      },
      CVSS_SCORE_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "cvss_score",
          direction: "DESC"
        });
      },
      ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "ASC"
        });
      },
      ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "DESC"
        });
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
    }
  },
  ZeroImplementationsOrderBy: {
    values: {
      ID_ASC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "ASC"
        });
      },
      ID_DESC(queryBuilder) {
        queryBuilder.orderBy({
          attribute: "id",
          direction: "DESC"
        });
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
    }
  }
};
export const schema = makeGrafastSchema({
  typeDefs: typeDefs,
  objects: objects,
  interfaces: interfaces,
  unions: unions,
  inputObjects: inputObjects,
  scalars: scalars,
  enums: enums
});
