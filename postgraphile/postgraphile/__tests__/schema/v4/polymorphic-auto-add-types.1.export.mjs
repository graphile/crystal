import { PgExecutor, PgResource, PgSelectSingleStep, PgUnionAllSingleStep, TYPES, assertPgClassSingleStep, enumCodec, makeRegistry, pgClassExpression, pgFromExpression, pgSelectSingleFromRecord, pgUnionAll, recordCodec, sqlFromArgDigests, sqlValueWithCodec } from "@dataplan/pg";
import { ConnectionStep, ConstantStep, bakedInput, connection, context, get as get2, lambda, makeGrafastSchema, object, operationPlan, rootValue, stepAMayDependOnStepB, trap } from "grafast";
import { GraphQLError, Kind } from "graphql";
import { sql } from "pg-sql2";
const EMPTY_ARRAY = Object.freeze([]);
const makeArgs_first_party_vulnerabilities_cvss_score_int = () => EMPTY_ARRAY;
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
const single_table_items_meaning_of_life_getSelectPlanFromParentAndArgs = ($in, args, _info) => {
  return scalarComputed(resource_single_table_items_meaning_of_lifePgResource, $in, makeArgs_first_party_vulnerabilities_cvss_score_int(args));
};
const SingleTableTopic_parentIdPlan = $record => {
  return $record.get("parent_id");
};
const SingleTableTopic_rootTopicIdPlan = $record => {
  return $record.get("root_topic_id");
};
const SingleTableTopic_authorIdPlan = $record => {
  return $record.get("author_id");
};
const SingleTableTopic_createdAtPlan = $record => {
  return $record.get("created_at");
};
const SingleTableTopic_updatedAtPlan = $record => {
  return $record.get("updated_at");
};
const SingleTableTopic_isExplicitlyArchivedPlan = $record => {
  return $record.get("is_explicitly_archived");
};
const SingleTableTopic_archivedAtPlan = $record => {
  return $record.get("archived_at");
};
const otherSource_peoplePgResource = registry.pgResources["people"];
const SingleTableTopic_personByAuthorIdPlan = $record => otherSource_peoplePgResource.get({
  person_id: $record.get("author_id")
});
const otherSource_single_table_itemsPgResource = registry.pgResources["single_table_items"];
const SingleTableTopic_singleTableItemByParentIdPlan = $record => otherSource_single_table_itemsPgResource.get({
  id: $record.get("parent_id")
});
const SingleTableTopic_singleTableItemsByParentIdPlan = $record => {
  const $records = otherSource_single_table_itemsPgResource.find({
    parent_id: $record.get("id")
  });
  return connection($records);
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
const otherSource_single_table_item_relationsPgResource = registry.pgResources["single_table_item_relations"];
const SingleTableTopic_singleTableItemRelationsByChildIdPlan = $record => {
  const $records = otherSource_single_table_item_relationsPgResource.find({
    child_id: $record.get("id")
  });
  return connection($records);
};
const SingleTableTopic_singleTableItemRelationsByParentIdPlan = $record => {
  const $records = otherSource_single_table_item_relationsPgResource.find({
    parent_id: $record.get("id")
  });
  return connection($records);
};
const otherSource_single_table_item_relation_composite_pksPgResource = registry.pgResources["single_table_item_relation_composite_pks"];
const SingleTableTopic_singleTableItemRelationCompositePksByChildIdPlan = $record => {
  const $records = otherSource_single_table_item_relation_composite_pksPgResource.find({
    child_id: $record.get("id")
  });
  return connection($records);
};
const SingleTableTopic_singleTableItemRelationCompositePksByParentIdPlan = $record => {
  const $records = otherSource_single_table_item_relation_composite_pksPgResource.find({
    parent_id: $record.get("id")
  });
  return connection($records);
};
const SingleTableTopic_rootTopicPlan = $record => otherSource_single_table_itemsPgResource.get({
  id: $record.get("root_topic_id")
});
const SingleTableItem_typeNameFromType = ((interfaceTypeName, polymorphism) => {
  function typeNameFromType(typeVal) {
    if (typeof typeVal !== "string") return null;
    return polymorphism.types[typeVal]?.name ?? null;
  }
  typeNameFromType.displayName = `${interfaceTypeName}_typeNameFromType`;
  return typeNameFromType;
})("SingleTableItem", spec_singleTableItems.polymorphism);
function toString(value) {
  return "" + value;
}
const Person_personIdPlan = $record => {
  return $record.get("person_id");
};
const otherSource_log_entriesPgResource = registry.pgResources["log_entries"];
const otherSource_relational_itemsPgResource = registry.pgResources["relational_items"];
const members_0_resource_aws_applicationsPgResource = registry.pgResources["aws_applications"];
const members_1_resource_gcp_applicationsPgResource = registry.pgResources["gcp_applications"];
const members = [{
  resource: members_0_resource_aws_applicationsPgResource,
  typeName: "AwsApplication",
  path: []
}, {
  resource: members_1_resource_gcp_applicationsPgResource,
  typeName: "GcpApplication",
  path: []
}];
const paths = [{
  resource: members_0_resource_aws_applicationsPgResource,
  hasReferencee: true,
  isUnique: false,
  layers: [{
    relationName: "awsApplicationsByTheirPersonId",
    localAttributes: registryConfig.pgRelations.people.awsApplicationsByTheirPersonId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.people.awsApplicationsByTheirPersonId.remoteAttributes,
    resource: members_0_resource_aws_applicationsPgResource,
    isUnique: false
  }]
}, {
  resource: members_1_resource_gcp_applicationsPgResource,
  hasReferencee: true,
  isUnique: false,
  layers: [{
    relationName: "gcpApplicationsByTheirPersonId",
    localAttributes: registryConfig.pgRelations.people.gcpApplicationsByTheirPersonId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.people.gcpApplicationsByTheirPersonId.remoteAttributes,
    resource: members_1_resource_gcp_applicationsPgResource,
    isUnique: false
  }]
}];
const resourceByTypeName = {
  __proto__: null,
  AwsApplication: members_0_resource_aws_applicationsPgResource,
  GcpApplication: members_1_resource_gcp_applicationsPgResource
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
const LogEntry_organizationIdPlan = $record => {
  return $record.get("organization_id");
};
const otherSource_organizationsPgResource = registry.pgResources["organizations"];
const LogEntry_organizationByOrganizationIdPlan = $record => otherSource_organizationsPgResource.get({
  organization_id: $record.get("organization_id")
});
const LogEntry_personByPersonIdPlan = $record => otherSource_peoplePgResource.get({
  person_id: $record.get("person_id")
});
const attributes = {};
const members2 = [{
  resource: otherSource_peoplePgResource,
  typeName: "Person",
  path: []
}, {
  resource: otherSource_organizationsPgResource,
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
  resource: otherSource_organizationsPgResource,
  hasReferencee: false,
  isUnique: true,
  layers: [{
    relationName: "organizationsByMyOrganizationId",
    localAttributes: registryConfig.pgRelations.logEntries.organizationsByMyOrganizationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.logEntries.organizationsByMyOrganizationId.remoteAttributes,
    resource: otherSource_organizationsPgResource,
    isUnique: true
  }]
}];
const resourceByTypeName2 = {
  __proto__: null,
  Person: otherSource_peoplePgResource,
  Organization: otherSource_organizationsPgResource
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
const LogEntryCondition_idApply = ($condition, val) => applyAttributeCondition("id", TYPES.int, $condition, val);
const LogEntryCondition_personIdApply = ($condition, val) => applyAttributeCondition("person_id", TYPES.int, $condition, val);
const LogEntryCondition_organizationIdApply = ($condition, val) => applyAttributeCondition("organization_id", TYPES.int, $condition, val);
const LogEntriesOrderBy_ID_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "id",
    direction: "ASC"
  });
  queryBuilder.setOrderIsUnique();
};
const LogEntriesOrderBy_ID_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "id",
    direction: "DESC"
  });
  queryBuilder.setOrderIsUnique();
};
const resourceByTypeName3 = {
  __proto__: null,
  Organization: otherSource_organizationsPgResource,
  Person: otherSource_peoplePgResource
};
const SingleTableItemCondition_typeApply = ($condition, val) => applyAttributeCondition("type", itemTypeCodec, $condition, val);
const SingleTableItemCondition_parentIdApply = ($condition, val) => applyAttributeCondition("parent_id", TYPES.int, $condition, val);
const SingleTableItemCondition_rootTopicIdApply = ($condition, val) => applyAttributeCondition("root_topic_id", TYPES.int, $condition, val);
const SingleTableItemCondition_authorIdApply = ($condition, val) => applyAttributeCondition("author_id", TYPES.int, $condition, val);
const SingleTableItemCondition_positionApply = ($condition, val) => applyAttributeCondition("position", TYPES.bigint, $condition, val);
const SingleTableItemCondition_createdAtApply = ($condition, val) => applyAttributeCondition("created_at", TYPES.timestamptz, $condition, val);
const SingleTableItemCondition_updatedAtApply = ($condition, val) => applyAttributeCondition("updated_at", TYPES.timestamptz, $condition, val);
const SingleTableItemCondition_isExplicitlyArchivedApply = ($condition, val) => applyAttributeCondition("is_explicitly_archived", TYPES.boolean, $condition, val);
const SingleTableItemCondition_archivedAtApply = ($condition, val) => applyAttributeCondition("archived_at", TYPES.timestamptz, $condition, val);
const SingleTableItemsOrderBy_TYPE_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "type",
    direction: "ASC"
  });
};
const SingleTableItemsOrderBy_TYPE_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "type",
    direction: "DESC"
  });
};
const SingleTableItemsOrderBy_PARENT_ID_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "parent_id",
    direction: "ASC"
  });
};
const SingleTableItemsOrderBy_PARENT_ID_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "parent_id",
    direction: "DESC"
  });
};
const SingleTableItemsOrderBy_ROOT_TOPIC_ID_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "root_topic_id",
    direction: "ASC"
  });
};
const SingleTableItemsOrderBy_ROOT_TOPIC_ID_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "root_topic_id",
    direction: "DESC"
  });
};
const SingleTableItemsOrderBy_AUTHOR_ID_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "author_id",
    direction: "ASC"
  });
};
const SingleTableItemsOrderBy_AUTHOR_ID_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "author_id",
    direction: "DESC"
  });
};
const SingleTableItemsOrderBy_POSITION_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "position",
    direction: "ASC"
  });
};
const SingleTableItemsOrderBy_POSITION_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "position",
    direction: "DESC"
  });
};
const SingleTableItemsOrderBy_CREATED_AT_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "created_at",
    direction: "ASC"
  });
};
const SingleTableItemsOrderBy_CREATED_AT_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "created_at",
    direction: "DESC"
  });
};
const SingleTableItemsOrderBy_UPDATED_AT_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "updated_at",
    direction: "ASC"
  });
};
const SingleTableItemsOrderBy_UPDATED_AT_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "updated_at",
    direction: "DESC"
  });
};
const SingleTableItemsOrderBy_IS_EXPLICITLY_ARCHIVED_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "is_explicitly_archived",
    direction: "ASC"
  });
};
const SingleTableItemsOrderBy_IS_EXPLICITLY_ARCHIVED_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "is_explicitly_archived",
    direction: "DESC"
  });
};
const SingleTableItemsOrderBy_ARCHIVED_AT_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "archived_at",
    direction: "ASC"
  });
};
const SingleTableItemsOrderBy_ARCHIVED_AT_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "archived_at",
    direction: "DESC"
  });
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
const resource_relational_item_relationsPgResource = registry.pgResources["relational_item_relations"];
const RelationalItemRelation_childIdPlan = $record => {
  return $record.get("child_id");
};
const RelationalItemRelation_relationalItemByChildIdPlan = $record => otherSource_relational_itemsPgResource.get({
  id: $record.get("child_id")
});
const RelationalItemRelation_relationalItemByParentIdPlan = $record => otherSource_relational_itemsPgResource.get({
  id: $record.get("parent_id")
});
const resource_relational_item_relation_composite_pksPgResource = registry.pgResources["relational_item_relation_composite_pks"];
function ApplicationToSpecifier($step) {
  if ($step instanceof PgUnionAllSingleStep) {
    return $step.toSpecifier();
  } else {
    return $step;
  }
}
const resourceByTypeName4 = {
  __proto__: null,
  AwsApplication: members_0_resource_aws_applicationsPgResource,
  GcpApplication: members_1_resource_gcp_applicationsPgResource
};
const resourceByTypeName_FirstPartyVulnerability_first_party_vulnerabilitiesPgResource = registry.pgResources["first_party_vulnerabilities"];
const resourceByTypeName_ThirdPartyVulnerability_third_party_vulnerabilitiesPgResource = registry.pgResources["third_party_vulnerabilities"];
const resourceByTypeName5 = {
  __proto__: null,
  FirstPartyVulnerability: resourceByTypeName_FirstPartyVulnerability_first_party_vulnerabilitiesPgResource,
  ThirdPartyVulnerability: resourceByTypeName_ThirdPartyVulnerability_third_party_vulnerabilitiesPgResource
};
const ApplicationCondition_nameApply = ($condition, val) => applyAttributeCondition("name", TYPES.text, $condition, val);
const ApplicationsOrderBy_ID_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "id",
    direction: "ASC"
  });
};
const ApplicationsOrderBy_ID_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "id",
    direction: "DESC"
  });
};
const ApplicationsOrderBy_NAME_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "name",
    direction: "ASC"
  });
};
const ApplicationsOrderBy_NAME_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "name",
    direction: "DESC"
  });
};
const SingleTableItemRelation_singleTableItemByChildIdPlan = $record => otherSource_single_table_itemsPgResource.get({
  id: $record.get("child_id")
});
const SingleTableItemRelationCondition_childIdApply = ($condition, val) => applyAttributeCondition("child_id", TYPES.int, $condition, val);
const SingleTableItemRelationsOrderBy_PARENT_ID_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "parent_id",
    direction: "ASC"
  });
  queryBuilder.setOrderIsUnique();
};
const SingleTableItemRelationsOrderBy_PARENT_ID_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "parent_id",
    direction: "DESC"
  });
  queryBuilder.setOrderIsUnique();
};
const SingleTableItemRelationsOrderBy_CHILD_ID_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "child_id",
    direction: "ASC"
  });
};
const SingleTableItemRelationsOrderBy_CHILD_ID_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "child_id",
    direction: "DESC"
  });
};
const SingleTablePost_priorityIdPlan = $record => {
  return $record.get("priority_id");
};
const otherSource_prioritiesPgResource = registry.pgResources["priorities"];
const SingleTablePost_priorityByPriorityIdPlan = $record => otherSource_prioritiesPgResource.get({
  id: $record.get("priority_id")
});
const resource_relational_topicsPgResource = registry.pgResources["relational_topics"];
const resource_relational_topics_parent_fnPgResource = registry.pgResources["relational_topics_parent_fn"];
const resource_relational_postsPgResource = registry.pgResources["relational_posts"];
const resource_relational_dividersPgResource = registry.pgResources["relational_dividers"];
const resource_relational_checklistsPgResource = registry.pgResources["relational_checklists"];
const resource_relational_checklist_itemsPgResource = registry.pgResources["relational_checklist_items"];
const MovieCollection_col001Plan = $record => {
  return $record.get("col_001");
};
const MovieCollection_col002Plan = $record => {
  return $record.get("col_002");
};
const MovieCollection_col003Plan = $record => {
  return $record.get("col_003");
};
const MovieCollection_col004Plan = $record => {
  return $record.get("col_004");
};
const MovieCollection_col005Plan = $record => {
  return $record.get("col_005");
};
const MovieCollection_col006Plan = $record => {
  return $record.get("col_006");
};
const MovieCollection_col007Plan = $record => {
  return $record.get("col_007");
};
const MovieCollection_col008Plan = $record => {
  return $record.get("col_008");
};
const MovieCollection_col009Plan = $record => {
  return $record.get("col_009");
};
const MovieCollection_col010Plan = $record => {
  return $record.get("col_010");
};
const MovieCollection_col011Plan = $record => {
  return $record.get("col_011");
};
const MovieCollection_col012Plan = $record => {
  return $record.get("col_012");
};
const MovieCollection_col013Plan = $record => {
  return $record.get("col_013");
};
const MovieCollection_col014Plan = $record => {
  return $record.get("col_014");
};
const MovieCollection_col015Plan = $record => {
  return $record.get("col_015");
};
const MovieCollection_col016Plan = $record => {
  return $record.get("col_016");
};
const MovieCollection_col017Plan = $record => {
  return $record.get("col_017");
};
const MovieCollection_col018Plan = $record => {
  return $record.get("col_018");
};
const MovieCollection_col019Plan = $record => {
  return $record.get("col_019");
};
const MovieCollection_col020Plan = $record => {
  return $record.get("col_020");
};
const MovieCollection_col021Plan = $record => {
  return $record.get("col_021");
};
const MovieCollection_col022Plan = $record => {
  return $record.get("col_022");
};
const MovieCollection_col023Plan = $record => {
  return $record.get("col_023");
};
const MovieCollection_col024Plan = $record => {
  return $record.get("col_024");
};
const MovieCollection_col025Plan = $record => {
  return $record.get("col_025");
};
const MovieCollection_col026Plan = $record => {
  return $record.get("col_026");
};
const MovieCollection_col027Plan = $record => {
  return $record.get("col_027");
};
const MovieCollection_col028Plan = $record => {
  return $record.get("col_028");
};
const MovieCollection_col029Plan = $record => {
  return $record.get("col_029");
};
const MovieCollection_col030Plan = $record => {
  return $record.get("col_030");
};
const MovieCollection_col031Plan = $record => {
  return $record.get("col_031");
};
const MovieCollection_col032Plan = $record => {
  return $record.get("col_032");
};
const MovieCollection_col033Plan = $record => {
  return $record.get("col_033");
};
const MovieCollection_col034Plan = $record => {
  return $record.get("col_034");
};
const MovieCollection_col035Plan = $record => {
  return $record.get("col_035");
};
const MovieCollection_col036Plan = $record => {
  return $record.get("col_036");
};
const MovieCollection_col037Plan = $record => {
  return $record.get("col_037");
};
const MovieCollection_col038Plan = $record => {
  return $record.get("col_038");
};
const MovieCollection_col039Plan = $record => {
  return $record.get("col_039");
};
const MovieCollection_col040Plan = $record => {
  return $record.get("col_040");
};
const MovieCollection_col041Plan = $record => {
  return $record.get("col_041");
};
const MovieCollection_col042Plan = $record => {
  return $record.get("col_042");
};
const MovieCollection_col043Plan = $record => {
  return $record.get("col_043");
};
const MovieCollection_col044Plan = $record => {
  return $record.get("col_044");
};
const MovieCollection_col045Plan = $record => {
  return $record.get("col_045");
};
const MovieCollection_col046Plan = $record => {
  return $record.get("col_046");
};
const MovieCollection_col047Plan = $record => {
  return $record.get("col_047");
};
const MovieCollection_col048Plan = $record => {
  return $record.get("col_048");
};
const MovieCollection_col049Plan = $record => {
  return $record.get("col_049");
};
const MovieCollection_col050Plan = $record => {
  return $record.get("col_050");
};
const MovieCollection_col051Plan = $record => {
  return $record.get("col_051");
};
const MovieCollection_col052Plan = $record => {
  return $record.get("col_052");
};
const MovieCollection_col053Plan = $record => {
  return $record.get("col_053");
};
const MovieCollection_col054Plan = $record => {
  return $record.get("col_054");
};
const MovieCollection_col055Plan = $record => {
  return $record.get("col_055");
};
const MovieCollection_col056Plan = $record => {
  return $record.get("col_056");
};
const MovieCollection_col057Plan = $record => {
  return $record.get("col_057");
};
const MovieCollection_col058Plan = $record => {
  return $record.get("col_058");
};
const MovieCollection_col059Plan = $record => {
  return $record.get("col_059");
};
const MovieCollection_col060Plan = $record => {
  return $record.get("col_060");
};
const MovieCollection_col061Plan = $record => {
  return $record.get("col_061");
};
const MovieCollection_col062Plan = $record => {
  return $record.get("col_062");
};
const MovieCollection_col063Plan = $record => {
  return $record.get("col_063");
};
const MovieCollection_col064Plan = $record => {
  return $record.get("col_064");
};
const MovieCollection_col065Plan = $record => {
  return $record.get("col_065");
};
const MovieCollection_col066Plan = $record => {
  return $record.get("col_066");
};
const MovieCollection_col067Plan = $record => {
  return $record.get("col_067");
};
const MovieCollection_col068Plan = $record => {
  return $record.get("col_068");
};
const MovieCollection_col069Plan = $record => {
  return $record.get("col_069");
};
const MovieCollection_col070Plan = $record => {
  return $record.get("col_070");
};
const MovieCollection_col071Plan = $record => {
  return $record.get("col_071");
};
const MovieCollection_col072Plan = $record => {
  return $record.get("col_072");
};
const MovieCollection_col073Plan = $record => {
  return $record.get("col_073");
};
const MovieCollection_col074Plan = $record => {
  return $record.get("col_074");
};
const MovieCollection_col075Plan = $record => {
  return $record.get("col_075");
};
const MovieCollection_col076Plan = $record => {
  return $record.get("col_076");
};
const MovieCollection_col077Plan = $record => {
  return $record.get("col_077");
};
const MovieCollection_col078Plan = $record => {
  return $record.get("col_078");
};
const MovieCollection_col079Plan = $record => {
  return $record.get("col_079");
};
const MovieCollection_col080Plan = $record => {
  return $record.get("col_080");
};
const MovieCollection_col081Plan = $record => {
  return $record.get("col_081");
};
const MovieCollection_col082Plan = $record => {
  return $record.get("col_082");
};
const MovieCollection_col083Plan = $record => {
  return $record.get("col_083");
};
const MovieCollection_col084Plan = $record => {
  return $record.get("col_084");
};
const MovieCollection_col085Plan = $record => {
  return $record.get("col_085");
};
const MovieCollection_col086Plan = $record => {
  return $record.get("col_086");
};
const MovieCollection_col087Plan = $record => {
  return $record.get("col_087");
};
const MovieCollection_col088Plan = $record => {
  return $record.get("col_088");
};
const MovieCollection_col089Plan = $record => {
  return $record.get("col_089");
};
const MovieCollection_col090Plan = $record => {
  return $record.get("col_090");
};
const MovieCollection_col091Plan = $record => {
  return $record.get("col_091");
};
const MovieCollection_col092Plan = $record => {
  return $record.get("col_092");
};
const MovieCollection_col093Plan = $record => {
  return $record.get("col_093");
};
const MovieCollection_col094Plan = $record => {
  return $record.get("col_094");
};
const MovieCollection_col095Plan = $record => {
  return $record.get("col_095");
};
const MovieCollection_col096Plan = $record => {
  return $record.get("col_096");
};
const MovieCollection_col097Plan = $record => {
  return $record.get("col_097");
};
const MovieCollection_col098Plan = $record => {
  return $record.get("col_098");
};
const MovieCollection_col099Plan = $record => {
  return $record.get("col_099");
};
const MovieCollection_col100Plan = $record => {
  return $record.get("col_100");
};
const resource_collectionsPgResource = registry.pgResources["collections"];
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
const members3 = [{
  resource: resourceByTypeName_FirstPartyVulnerability_first_party_vulnerabilitiesPgResource,
  typeName: "FirstPartyVulnerability"
}, {
  resource: resourceByTypeName_ThirdPartyVulnerability_third_party_vulnerabilitiesPgResource,
  typeName: "ThirdPartyVulnerability"
}];
const resourceByTypeName6 = {
  __proto__: null,
  FirstPartyVulnerability: resourceByTypeName_FirstPartyVulnerability_first_party_vulnerabilitiesPgResource,
  ThirdPartyVulnerability: resourceByTypeName_ThirdPartyVulnerability_third_party_vulnerabilitiesPgResource
};
const members4 = [{
  resource: members_0_resource_aws_applicationsPgResource,
  typeName: "AwsApplication"
}, {
  resource: members_1_resource_gcp_applicationsPgResource,
  typeName: "GcpApplication"
}];
const resourceByTypeName7 = {
  __proto__: null,
  AwsApplication: members_0_resource_aws_applicationsPgResource,
  GcpApplication: members_1_resource_gcp_applicationsPgResource
};
const members5 = [];
const resourceByTypeName8 = {
  __proto__: null
};
const resourceByTypeName9 = {
  __proto__: null
};
const RelationalChecklistCondition_titleApply = ($condition, val) => applyAttributeCondition("title", TYPES.text, $condition, val);
const RelationalChecklistsOrderBy_TITLE_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "title",
    direction: "ASC"
  });
};
const RelationalChecklistsOrderBy_TITLE_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "title",
    direction: "DESC"
  });
};
const RelationalChecklistItemCondition_descriptionApply = ($condition, val) => applyAttributeCondition("description", TYPES.text, $condition, val);
const RelationalChecklistItemCondition_noteApply = ($condition, val) => applyAttributeCondition("note", TYPES.text, $condition, val);
const RelationalChecklistItemsOrderBy_DESCRIPTION_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "description",
    direction: "ASC"
  });
};
const RelationalChecklistItemsOrderBy_DESCRIPTION_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "description",
    direction: "DESC"
  });
};
const RelationalChecklistItemsOrderBy_NOTE_ASCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "note",
    direction: "ASC"
  });
};
const RelationalChecklistItemsOrderBy_NOTE_DESCApply = queryBuilder => {
  queryBuilder.orderBy({
    attribute: "note",
    direction: "DESC"
  });
};
const resource_first_party_vulnerabilities_cvss_score_intPgResource = registry.pgResources["first_party_vulnerabilities_cvss_score_int"];
const FirstPartyVulnerability_cvssScorePlan = $record => {
  return $record.get("cvss_score");
};
const members_0_resource_aws_application_first_party_vulnerabilitiesPgResource = registry.pgResources["aws_application_first_party_vulnerabilities"];
const members_1_resource_gcp_application_first_party_vulnerabilitiesPgResource = registry.pgResources["gcp_application_first_party_vulnerabilities"];
const members6 = [{
  resource: members_0_resource_aws_application_first_party_vulnerabilitiesPgResource,
  typeName: "AwsApplication",
  path: [{
    relationName: "awsApplicationsByMyAwsApplicationId"
  }]
}, {
  resource: members_1_resource_gcp_application_first_party_vulnerabilitiesPgResource,
  typeName: "GcpApplication",
  path: [{
    relationName: "gcpApplicationsByMyGcpApplicationId"
  }]
}];
const paths3 = [{
  resource: members_0_resource_aws_applicationsPgResource,
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
    resource: members_0_resource_aws_applicationsPgResource,
    isUnique: true
  }]
}, {
  resource: members_1_resource_gcp_applicationsPgResource,
  hasReferencee: true,
  isUnique: false,
  layers: [{
    relationName: "gcpApplicationFirstPartyVulnerabilitiesByTheirFirstPartyVulnerabilityId",
    localAttributes: registryConfig.pgRelations.firstPartyVulnerabilities.gcpApplicationFirstPartyVulnerabilitiesByTheirFirstPartyVulnerabilityId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.firstPartyVulnerabilities.gcpApplicationFirstPartyVulnerabilitiesByTheirFirstPartyVulnerabilityId.remoteAttributes,
    resource: members_1_resource_gcp_application_first_party_vulnerabilitiesPgResource,
    isUnique: false
  }, {
    relationName: "gcpApplicationsByMyGcpApplicationId",
    localAttributes: registryConfig.pgRelations.gcpApplicationFirstPartyVulnerabilities.gcpApplicationsByMyGcpApplicationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.gcpApplicationFirstPartyVulnerabilities.gcpApplicationsByMyGcpApplicationId.remoteAttributes,
    resource: members_1_resource_gcp_applicationsPgResource,
    isUnique: true
  }]
}];
const resourceByTypeName10 = {
  __proto__: null,
  AwsApplication: members_0_resource_aws_applicationsPgResource,
  GcpApplication: members_1_resource_gcp_applicationsPgResource
};
const attributes2 = {};
const members7 = [{
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
  resource: members_1_resource_gcp_application_first_party_vulnerabilitiesPgResource,
  typeName: "Person",
  path: [{
    relationName: "gcpApplicationsByMyGcpApplicationId"
  }, {
    relationName: "peopleByMyPersonId"
  }]
}, {
  resource: members_1_resource_gcp_application_first_party_vulnerabilitiesPgResource,
  typeName: "Organization",
  path: [{
    relationName: "gcpApplicationsByMyGcpApplicationId"
  }, {
    relationName: "organizationsByMyOrganizationId"
  }]
}];
const paths4 = [{
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
    resource: members_0_resource_aws_applicationsPgResource,
    isUnique: true
  }, {
    relationName: "peopleByMyPersonId",
    localAttributes: registryConfig.pgRelations.awsApplications.peopleByMyPersonId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.awsApplications.peopleByMyPersonId.remoteAttributes,
    resource: otherSource_peoplePgResource,
    isUnique: true
  }]
}, {
  resource: otherSource_organizationsPgResource,
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
    resource: members_0_resource_aws_applicationsPgResource,
    isUnique: true
  }, {
    relationName: "organizationsByMyOrganizationId",
    localAttributes: registryConfig.pgRelations.awsApplications.organizationsByMyOrganizationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.awsApplications.organizationsByMyOrganizationId.remoteAttributes,
    resource: otherSource_organizationsPgResource,
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
    resource: members_1_resource_gcp_application_first_party_vulnerabilitiesPgResource,
    isUnique: false
  }, {
    relationName: "gcpApplicationsByMyGcpApplicationId",
    localAttributes: registryConfig.pgRelations.gcpApplicationFirstPartyVulnerabilities.gcpApplicationsByMyGcpApplicationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.gcpApplicationFirstPartyVulnerabilities.gcpApplicationsByMyGcpApplicationId.remoteAttributes,
    resource: members_1_resource_gcp_applicationsPgResource,
    isUnique: true
  }, {
    relationName: "peopleByMyPersonId",
    localAttributes: registryConfig.pgRelations.gcpApplications.peopleByMyPersonId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.gcpApplications.peopleByMyPersonId.remoteAttributes,
    resource: otherSource_peoplePgResource,
    isUnique: true
  }]
}, {
  resource: otherSource_organizationsPgResource,
  hasReferencee: true,
  isUnique: false,
  layers: [{
    relationName: "gcpApplicationFirstPartyVulnerabilitiesByTheirFirstPartyVulnerabilityId",
    localAttributes: registryConfig.pgRelations.firstPartyVulnerabilities.gcpApplicationFirstPartyVulnerabilitiesByTheirFirstPartyVulnerabilityId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.firstPartyVulnerabilities.gcpApplicationFirstPartyVulnerabilitiesByTheirFirstPartyVulnerabilityId.remoteAttributes,
    resource: members_1_resource_gcp_application_first_party_vulnerabilitiesPgResource,
    isUnique: false
  }, {
    relationName: "gcpApplicationsByMyGcpApplicationId",
    localAttributes: registryConfig.pgRelations.gcpApplicationFirstPartyVulnerabilities.gcpApplicationsByMyGcpApplicationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.gcpApplicationFirstPartyVulnerabilities.gcpApplicationsByMyGcpApplicationId.remoteAttributes,
    resource: members_1_resource_gcp_applicationsPgResource,
    isUnique: true
  }, {
    relationName: "organizationsByMyOrganizationId",
    localAttributes: registryConfig.pgRelations.gcpApplications.organizationsByMyOrganizationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.gcpApplications.organizationsByMyOrganizationId.remoteAttributes,
    resource: otherSource_organizationsPgResource,
    isUnique: true
  }]
}];
const resourceByTypeName11 = {
  __proto__: null,
  Person: otherSource_peoplePgResource,
  Organization: otherSource_organizationsPgResource
};
const GcpApplication_lastDeployedPlan = $record => {
  return $record.get("last_deployed");
};
const members_1_resource_gcp_application_third_party_vulnerabilitiesPgResource = registry.pgResources["gcp_application_third_party_vulnerabilities"];
const members8 = [{
  resource: members_1_resource_gcp_application_first_party_vulnerabilitiesPgResource,
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
  resource: resourceByTypeName_FirstPartyVulnerability_first_party_vulnerabilitiesPgResource,
  hasReferencee: true,
  isUnique: false,
  layers: [{
    relationName: "gcpApplicationFirstPartyVulnerabilitiesByTheirGcpApplicationId",
    localAttributes: registryConfig.pgRelations.gcpApplications.gcpApplicationFirstPartyVulnerabilitiesByTheirGcpApplicationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.gcpApplications.gcpApplicationFirstPartyVulnerabilitiesByTheirGcpApplicationId.remoteAttributes,
    resource: members_1_resource_gcp_application_first_party_vulnerabilitiesPgResource,
    isUnique: false
  }, {
    relationName: "firstPartyVulnerabilitiesByMyFirstPartyVulnerabilityId",
    localAttributes: registryConfig.pgRelations.gcpApplicationFirstPartyVulnerabilities.firstPartyVulnerabilitiesByMyFirstPartyVulnerabilityId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.gcpApplicationFirstPartyVulnerabilities.firstPartyVulnerabilitiesByMyFirstPartyVulnerabilityId.remoteAttributes,
    resource: resourceByTypeName_FirstPartyVulnerability_first_party_vulnerabilitiesPgResource,
    isUnique: true
  }]
}, {
  resource: resourceByTypeName_ThirdPartyVulnerability_third_party_vulnerabilitiesPgResource,
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
    resource: resourceByTypeName_ThirdPartyVulnerability_third_party_vulnerabilitiesPgResource,
    isUnique: true
  }]
}];
const resourceByTypeName12 = {
  __proto__: null,
  FirstPartyVulnerability: resourceByTypeName_FirstPartyVulnerability_first_party_vulnerabilitiesPgResource,
  ThirdPartyVulnerability: resourceByTypeName_ThirdPartyVulnerability_third_party_vulnerabilitiesPgResource
};
const attributes3 = {};
const members9 = [{
  resource: otherSource_peoplePgResource,
  typeName: "Person",
  path: []
}, {
  resource: otherSource_organizationsPgResource,
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
  resource: otherSource_organizationsPgResource,
  hasReferencee: false,
  isUnique: true,
  layers: [{
    relationName: "organizationsByMyOrganizationId",
    localAttributes: registryConfig.pgRelations.gcpApplications.organizationsByMyOrganizationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.gcpApplications.organizationsByMyOrganizationId.remoteAttributes,
    resource: otherSource_organizationsPgResource,
    isUnique: true
  }]
}];
const resourceByTypeName13 = {
  __proto__: null,
  Person: otherSource_peoplePgResource,
  Organization: otherSource_organizationsPgResource
};
const members_1_resource_aws_application_third_party_vulnerabilitiesPgResource = registry.pgResources["aws_application_third_party_vulnerabilities"];
const members10 = [{
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
const paths7 = [{
  resource: resourceByTypeName_FirstPartyVulnerability_first_party_vulnerabilitiesPgResource,
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
    resource: resourceByTypeName_FirstPartyVulnerability_first_party_vulnerabilitiesPgResource,
    isUnique: true
  }]
}, {
  resource: resourceByTypeName_ThirdPartyVulnerability_third_party_vulnerabilitiesPgResource,
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
    resource: resourceByTypeName_ThirdPartyVulnerability_third_party_vulnerabilitiesPgResource,
    isUnique: true
  }]
}];
const resourceByTypeName14 = {
  __proto__: null,
  FirstPartyVulnerability: resourceByTypeName_FirstPartyVulnerability_first_party_vulnerabilitiesPgResource,
  ThirdPartyVulnerability: resourceByTypeName_ThirdPartyVulnerability_third_party_vulnerabilitiesPgResource
};
const attributes4 = {};
const members11 = [{
  resource: otherSource_peoplePgResource,
  typeName: "Person",
  path: []
}, {
  resource: otherSource_organizationsPgResource,
  typeName: "Organization",
  path: []
}];
const paths8 = [{
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
  resource: otherSource_organizationsPgResource,
  hasReferencee: false,
  isUnique: true,
  layers: [{
    relationName: "organizationsByMyOrganizationId",
    localAttributes: registryConfig.pgRelations.awsApplications.organizationsByMyOrganizationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.awsApplications.organizationsByMyOrganizationId.remoteAttributes,
    resource: otherSource_organizationsPgResource,
    isUnique: true
  }]
}];
const resourceByTypeName15 = {
  __proto__: null,
  Person: otherSource_peoplePgResource,
  Organization: otherSource_organizationsPgResource
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
  resource: members_0_resource_aws_applicationsPgResource,
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
    resource: members_0_resource_aws_applicationsPgResource,
    isUnique: true
  }]
}, {
  resource: members_1_resource_gcp_applicationsPgResource,
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
    resource: members_1_resource_gcp_applicationsPgResource,
    isUnique: true
  }]
}];
const resourceByTypeName16 = {
  __proto__: null,
  AwsApplication: members_0_resource_aws_applicationsPgResource,
  GcpApplication: members_1_resource_gcp_applicationsPgResource
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
    resource: members_0_resource_aws_applicationsPgResource,
    isUnique: true
  }, {
    relationName: "peopleByMyPersonId",
    localAttributes: registryConfig.pgRelations.awsApplications.peopleByMyPersonId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.awsApplications.peopleByMyPersonId.remoteAttributes,
    resource: otherSource_peoplePgResource,
    isUnique: true
  }]
}, {
  resource: otherSource_organizationsPgResource,
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
    resource: members_0_resource_aws_applicationsPgResource,
    isUnique: true
  }, {
    relationName: "organizationsByMyOrganizationId",
    localAttributes: registryConfig.pgRelations.awsApplications.organizationsByMyOrganizationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.awsApplications.organizationsByMyOrganizationId.remoteAttributes,
    resource: otherSource_organizationsPgResource,
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
    resource: members_1_resource_gcp_applicationsPgResource,
    isUnique: true
  }, {
    relationName: "peopleByMyPersonId",
    localAttributes: registryConfig.pgRelations.gcpApplications.peopleByMyPersonId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.gcpApplications.peopleByMyPersonId.remoteAttributes,
    resource: otherSource_peoplePgResource,
    isUnique: true
  }]
}, {
  resource: otherSource_organizationsPgResource,
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
    resource: members_1_resource_gcp_applicationsPgResource,
    isUnique: true
  }, {
    relationName: "organizationsByMyOrganizationId",
    localAttributes: registryConfig.pgRelations.gcpApplications.organizationsByMyOrganizationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.gcpApplications.organizationsByMyOrganizationId.remoteAttributes,
    resource: otherSource_organizationsPgResource,
    isUnique: true
  }]
}];
const resourceByTypeName17 = {
  __proto__: null,
  Person: otherSource_peoplePgResource,
  Organization: otherSource_organizationsPgResource
};
export const typeDefs = /* GraphQL */`type SingleTableTopic implements SingleTableItem {
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

interface SingleTableItem {
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

type Person {
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

type LogEntry {
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

type Organization {
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

union PersonOrOrganization = Organization | Person

"""A \`LogEntry\` edge in the connection."""
type LogEntriesEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`LogEntry\` at the end of the edge."""
  node: LogEntry
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

interface RelationalItem {
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

type RelationalItemRelation {
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

type RelationalItemRelationCompositePk {
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

interface Application {
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

interface Vulnerability {
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

"""A \`Application\` edge in the connection."""
type ApplicationsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Application\` at the end of the edge."""
  node: Application
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

type SingleTableItemRelation {
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

type SingleTableItemRelationCompositePk {
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

type SingleTablePost implements SingleTableItem {
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

type Priority {
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

type SingleTableDivider implements SingleTableItem {
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

type SingleTableChecklist implements SingleTableItem {
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

type SingleTableChecklistItem implements SingleTableItem {
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

type RelationalTopic implements RelationalItem {
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

type RelationalPost implements RelationalItem {
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

type RelationalDivider implements RelationalItem {
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

type RelationalChecklist implements RelationalItem {
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

type RelationalChecklistItem implements RelationalItem {
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

type MovieCollection implements Collection {
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

interface Collection {
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

type SeriesCollection implements Collection {
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
type Query {
  """
  Exposes the root query type nested one level down. This is helpful for Relay 1
  which can only query top level fields if they are in a particular form.
  """
  query: Query!

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

interface ZeroImplementation {
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

type FirstPartyVulnerability implements Vulnerability {
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

type GcpApplication implements Application {
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

type AwsApplication implements Application {
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

type ThirdPartyVulnerability implements Vulnerability {
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
            resourceByTypeName: resourceByTypeName7,
            members: members4,
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
      allLogEntries: {
        plan() {
          return connection(otherSource_log_entriesPgResource.find());
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
          return connection(otherSource_organizationsPgResource.find());
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
          return connection(otherSource_prioritiesPgResource.find());
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
          return connection(resource_relational_checklist_itemsPgResource.find());
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
          return connection(resource_relational_checklistsPgResource.find());
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
          return connection(resource_relational_dividersPgResource.find());
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
          return connection(resource_relational_item_relation_composite_pksPgResource.find());
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
          return connection(resource_relational_item_relationsPgResource.find());
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
          return connection(resource_relational_postsPgResource.find());
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
          return connection(resource_relational_topicsPgResource.find());
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
          return connection(otherSource_single_table_itemsPgResource.find());
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
      allVulnerabilities: {
        plan() {
          const $list = pgUnionAll({
            attributes: spec_Vulnerability.attributes,
            resourceByTypeName: resourceByTypeName6,
            members: members3,
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
            resourceByTypeName: resourceByTypeName8,
            members: members5,
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
      getSingleTableTopicById($root, args, _info) {
        const selectArgs = makeArgs_get_single_table_topic_by_id(args);
        return resource_get_single_table_topic_by_idPgResource.execute(selectArgs);
      },
      logEntryById(_$root, {
        $id
      }) {
        return otherSource_log_entriesPgResource.get({
          id: $id
        });
      },
      organizationByName(_$root, {
        $name
      }) {
        return otherSource_organizationsPgResource.get({
          name: $name
        });
      },
      organizationByOrganizationId(_$root, {
        $organizationId
      }) {
        return otherSource_organizationsPgResource.get({
          organization_id: $organizationId
        });
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
      priorityById(_$root, {
        $id
      }) {
        return otherSource_prioritiesPgResource.get({
          id: $id
        });
      },
      query() {
        return rootValue();
      },
      relationalChecklistByChecklistItemId(_$root, {
        $checklistItemId
      }) {
        return resource_relational_checklistsPgResource.get({
          checklist_item_id: $checklistItemId
        });
      },
      relationalChecklistItemByChecklistItemItemId(_$root, {
        $checklistItemItemId
      }) {
        return resource_relational_checklist_itemsPgResource.get({
          checklist_item_item_id: $checklistItemItemId
        });
      },
      relationalDividerByDividerItemId(_$root, {
        $dividerItemId
      }) {
        return resource_relational_dividersPgResource.get({
          divider_item_id: $dividerItemId
        });
      },
      relationalItemByIdFn($root, args, _info) {
        const selectArgs = makeArgs_relational_item_by_id_fn(args);
        return resource_relational_item_by_id_fnPgResource.execute(selectArgs);
      },
      relationalItemRelationById(_$root, {
        $id
      }) {
        return resource_relational_item_relationsPgResource.get({
          id: $id
        });
      },
      relationalItemRelationByParentIdAndChildId(_$root, {
        $parentId,
        $childId
      }) {
        return resource_relational_item_relationsPgResource.get({
          parent_id: $parentId,
          child_id: $childId
        });
      },
      relationalItemRelationCompositePkByParentIdAndChildId(_$root, {
        $parentId,
        $childId
      }) {
        return resource_relational_item_relation_composite_pksPgResource.get({
          parent_id: $parentId,
          child_id: $childId
        });
      },
      relationalPostByPostItemId(_$root, {
        $postItemId
      }) {
        return resource_relational_postsPgResource.get({
          post_item_id: $postItemId
        });
      },
      relationalTopicByIdFn($root, args, _info) {
        const selectArgs = makeArgs_relational_topic_by_id_fn(args);
        return resource_relational_topic_by_id_fnPgResource.execute(selectArgs);
      },
      relationalTopicByTopicItemId(_$root, {
        $topicItemId
      }) {
        return resource_relational_topicsPgResource.get({
          topic_item_id: $topicItemId
        });
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
      singleTableItemRelationCompositePkByParentIdAndChildId(_$root, {
        $parentId,
        $childId
      }) {
        return otherSource_single_table_item_relation_composite_pksPgResource.get({
          parent_id: $parentId,
          child_id: $childId
        });
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
      lastDeployed: GcpApplication_lastDeployedPlan,
      organizationByOrganizationId: LogEntry_organizationByOrganizationIdPlan,
      organizationId: LogEntry_organizationIdPlan,
      owner($parent) {
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
          resourceByTypeName: resourceByTypeName15,
          members: members11,
          name: "owner"
        });
        return $list.single();
      },
      personByPersonId: LogEntry_personByPersonIdPlan,
      personId: Person_personIdPlan,
      vulnerabilities: {
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
            attributes: spec_Vulnerability.attributes,
            resourceByTypeName: resourceByTypeName14,
            members: members10,
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
      return members_0_resource_aws_applicationsPgResource.get(spec);
    }
  },
  CollectionsConnection: {
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
          for (let i = 0, l = paths3.length; i < l; i++) {
            const path = paths3[i];
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
            attributes: spec_Application.attributes,
            resourceByTypeName: resourceByTypeName10,
            members: members6,
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
      cvssScore: FirstPartyVulnerability_cvssScorePlan,
      cvssScoreInt($in, args, _info) {
        return scalarComputed(resource_first_party_vulnerabilities_cvss_score_intPgResource, $in, makeArgs_first_party_vulnerabilities_cvss_score_int(args));
      },
      owners($parent) {
        const $record = $parent;
        for (let i = 0, l = paths4.length; i < l; i++) {
          const path = paths4[i];
          const firstLayer = path.layers[0];
          const member = members7[i];
          member.match = firstLayer.localAttributes.reduce((memo, col, idx) => {
            memo[firstLayer.remoteAttributes[idx]] = {
              step: $record.get(col)
            };
            return memo;
          }, Object.create(null));
        }
        const $list = pgUnionAll({
          attributes: attributes2,
          resourceByTypeName: resourceByTypeName11,
          members: members7,
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
      return resourceByTypeName_FirstPartyVulnerability_first_party_vulnerabilitiesPgResource.get(spec);
    }
  },
  GcpApplication: {
    assertStep: assertPgClassSingleStep,
    plans: {
      gcpId($record) {
        return $record.get("gcp_id");
      },
      lastDeployed: GcpApplication_lastDeployedPlan,
      organizationByOrganizationId: LogEntry_organizationByOrganizationIdPlan,
      organizationId: LogEntry_organizationIdPlan,
      owner($parent) {
        const $record = $parent;
        for (let i = 0, l = paths6.length; i < l; i++) {
          const path = paths6[i];
          const firstLayer = path.layers[0];
          const member = members9[i];
          member.match = firstLayer.localAttributes.reduce((memo, col, idx) => {
            memo[firstLayer.remoteAttributes[idx]] = {
              step: $record.get(col)
            };
            return memo;
          }, Object.create(null));
        }
        const $list = pgUnionAll({
          attributes: attributes3,
          resourceByTypeName: resourceByTypeName13,
          members: members9,
          name: "owner"
        });
        return $list.single();
      },
      personByPersonId: LogEntry_personByPersonIdPlan,
      personId: Person_personIdPlan,
      vulnerabilities: {
        plan($parent) {
          const $record = $parent;
          for (let i = 0, l = paths5.length; i < l; i++) {
            const path = paths5[i];
            const firstLayer = path.layers[0];
            const member = members8[i];
            member.match = firstLayer.localAttributes.reduce((memo, col, idx) => {
              memo[firstLayer.remoteAttributes[idx]] = {
                step: $record.get(col)
              };
              return memo;
            }, Object.create(null));
          }
          const $list = pgUnionAll({
            attributes: spec_Vulnerability.attributes,
            resourceByTypeName: resourceByTypeName12,
            members: members8,
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
      return members_1_resource_gcp_applicationsPgResource.get(spec);
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
      organizationByOrganizationId: LogEntry_organizationByOrganizationIdPlan,
      organizationId: LogEntry_organizationIdPlan,
      personByPersonId: LogEntry_personByPersonIdPlan,
      personId: Person_personIdPlan
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of log_entriesUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return otherSource_log_entriesPgResource.get(spec);
    }
  },
  MovieCollection: {
    assertStep: assertPgClassSingleStep,
    plans: {
      col001: MovieCollection_col001Plan,
      col002: MovieCollection_col002Plan,
      col003: MovieCollection_col003Plan,
      col004: MovieCollection_col004Plan,
      col005: MovieCollection_col005Plan,
      col006: MovieCollection_col006Plan,
      col007: MovieCollection_col007Plan,
      col008: MovieCollection_col008Plan,
      col009: MovieCollection_col009Plan,
      col010: MovieCollection_col010Plan,
      col011: MovieCollection_col011Plan,
      col012: MovieCollection_col012Plan,
      col013: MovieCollection_col013Plan,
      col014: MovieCollection_col014Plan,
      col015: MovieCollection_col015Plan,
      col016: MovieCollection_col016Plan,
      col017: MovieCollection_col017Plan,
      col018: MovieCollection_col018Plan,
      col019: MovieCollection_col019Plan,
      col020: MovieCollection_col020Plan,
      col021: MovieCollection_col021Plan,
      col022: MovieCollection_col022Plan,
      col023: MovieCollection_col023Plan,
      col024: MovieCollection_col024Plan,
      col025: MovieCollection_col025Plan,
      col026: MovieCollection_col026Plan,
      col027: MovieCollection_col027Plan,
      col028: MovieCollection_col028Plan,
      col029: MovieCollection_col029Plan,
      col030: MovieCollection_col030Plan,
      col031: MovieCollection_col031Plan,
      col032: MovieCollection_col032Plan,
      col033: MovieCollection_col033Plan,
      col034: MovieCollection_col034Plan,
      col035: MovieCollection_col035Plan,
      col036: MovieCollection_col036Plan,
      col037: MovieCollection_col037Plan,
      col038: MovieCollection_col038Plan,
      col039: MovieCollection_col039Plan,
      col040: MovieCollection_col040Plan,
      col041: MovieCollection_col041Plan,
      col042: MovieCollection_col042Plan,
      col043: MovieCollection_col043Plan,
      col044: MovieCollection_col044Plan,
      col045: MovieCollection_col045Plan,
      col046: MovieCollection_col046Plan,
      col047: MovieCollection_col047Plan,
      col048: MovieCollection_col048Plan,
      col049: MovieCollection_col049Plan,
      col050: MovieCollection_col050Plan,
      col051: MovieCollection_col051Plan,
      col052: MovieCollection_col052Plan,
      col053: MovieCollection_col053Plan,
      col054: MovieCollection_col054Plan,
      col055: MovieCollection_col055Plan,
      col056: MovieCollection_col056Plan,
      col057: MovieCollection_col057Plan,
      col058: MovieCollection_col058Plan,
      col059: MovieCollection_col059Plan,
      col060: MovieCollection_col060Plan,
      col061: MovieCollection_col061Plan,
      col062: MovieCollection_col062Plan,
      col063: MovieCollection_col063Plan,
      col064: MovieCollection_col064Plan,
      col065: MovieCollection_col065Plan,
      col066: MovieCollection_col066Plan,
      col067: MovieCollection_col067Plan,
      col068: MovieCollection_col068Plan,
      col069: MovieCollection_col069Plan,
      col070: MovieCollection_col070Plan,
      col071: MovieCollection_col071Plan,
      col072: MovieCollection_col072Plan,
      col073: MovieCollection_col073Plan,
      col074: MovieCollection_col074Plan,
      col075: MovieCollection_col075Plan,
      col076: MovieCollection_col076Plan,
      col077: MovieCollection_col077Plan,
      col078: MovieCollection_col078Plan,
      col079: MovieCollection_col079Plan,
      col080: MovieCollection_col080Plan,
      col081: MovieCollection_col081Plan,
      col082: MovieCollection_col082Plan,
      col083: MovieCollection_col083Plan,
      col084: MovieCollection_col084Plan,
      col085: MovieCollection_col085Plan,
      col086: MovieCollection_col086Plan,
      col087: MovieCollection_col087Plan,
      col088: MovieCollection_col088Plan,
      col089: MovieCollection_col089Plan,
      col090: MovieCollection_col090Plan,
      col091: MovieCollection_col091Plan,
      col092: MovieCollection_col092Plan,
      col093: MovieCollection_col093Plan,
      col094: MovieCollection_col094Plan,
      col095: MovieCollection_col095Plan,
      col096: MovieCollection_col096Plan,
      col097: MovieCollection_col097Plan,
      col098: MovieCollection_col098Plan,
      col099: MovieCollection_col099Plan,
      col100: MovieCollection_col100Plan,
      createdAt: SingleTableTopic_createdAtPlan
    }
  },
  Organization: {
    assertStep: assertPgClassSingleStep,
    plans: {
      logEntriesByOrganizationId: {
        plan($record) {
          const $records = otherSource_log_entriesPgResource.find({
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
      organizationId: LogEntry_organizationIdPlan
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of organizationsUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return otherSource_organizationsPgResource.get(spec);
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
      logEntriesByPersonId: {
        plan($record) {
          const $records = otherSource_log_entriesPgResource.find({
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
      personId: Person_personIdPlan,
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
          const $records = otherSource_single_table_itemsPgResource.find({
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
      singleTableItemsByPriorityId: {
        plan($record) {
          const $records = otherSource_single_table_itemsPgResource.find({
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
      return otherSource_prioritiesPgResource.get(spec);
    }
  },
  RelationalChecklist: {
    assertStep: assertPgClassSingleStep,
    plans: {
      archivedAt: SingleTableTopic_archivedAtPlan,
      authorId: SingleTableTopic_authorIdPlan,
      createdAt: SingleTableTopic_createdAtPlan,
      isExplicitlyArchived: SingleTableTopic_isExplicitlyArchivedPlan,
      parentId: SingleTableTopic_parentIdPlan,
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
          const $relational_item_relation_composite_pks = resource_relational_item_relation_composite_pksPgResource.find();
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
          const $relational_item_relation_composite_pks = resource_relational_item_relation_composite_pksPgResource.find();
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
          const $relational_item_relations = resource_relational_item_relationsPgResource.find();
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
          const $relational_item_relations = resource_relational_item_relationsPgResource.find();
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
        const $relational_topics = resource_relational_topicsPgResource.find();
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
      rootTopicId: SingleTableTopic_rootTopicIdPlan,
      updatedAt: SingleTableTopic_updatedAtPlan
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of relational_checklistsUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_relational_checklistsPgResource.get(spec);
    }
  },
  RelationalChecklistItem: {
    assertStep: assertPgClassSingleStep,
    plans: {
      archivedAt: SingleTableTopic_archivedAtPlan,
      authorId: SingleTableTopic_authorIdPlan,
      createdAt: SingleTableTopic_createdAtPlan,
      isExplicitlyArchived: SingleTableTopic_isExplicitlyArchivedPlan,
      parentId: SingleTableTopic_parentIdPlan,
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
          const $relational_item_relation_composite_pks = resource_relational_item_relation_composite_pksPgResource.find();
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
          const $relational_item_relation_composite_pks = resource_relational_item_relation_composite_pksPgResource.find();
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
          const $relational_item_relations = resource_relational_item_relationsPgResource.find();
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
          const $relational_item_relations = resource_relational_item_relationsPgResource.find();
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
        const $relational_topics = resource_relational_topicsPgResource.find();
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
      rootTopicId: SingleTableTopic_rootTopicIdPlan,
      updatedAt: SingleTableTopic_updatedAtPlan
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of relational_checklist_itemsUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_relational_checklist_itemsPgResource.get(spec);
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
      archivedAt: SingleTableTopic_archivedAtPlan,
      authorId: SingleTableTopic_authorIdPlan,
      createdAt: SingleTableTopic_createdAtPlan,
      isExplicitlyArchived: SingleTableTopic_isExplicitlyArchivedPlan,
      parentId: SingleTableTopic_parentIdPlan,
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
          const $relational_item_relation_composite_pks = resource_relational_item_relation_composite_pksPgResource.find();
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
          const $relational_item_relation_composite_pks = resource_relational_item_relation_composite_pksPgResource.find();
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
          const $relational_item_relations = resource_relational_item_relationsPgResource.find();
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
          const $relational_item_relations = resource_relational_item_relationsPgResource.find();
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
        const $relational_topics = resource_relational_topicsPgResource.find();
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
      rootTopicId: SingleTableTopic_rootTopicIdPlan,
      updatedAt: SingleTableTopic_updatedAtPlan
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of relational_dividersUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_relational_dividersPgResource.get(spec);
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
      childId: RelationalItemRelation_childIdPlan,
      parentId: SingleTableTopic_parentIdPlan,
      relationalItemByChildId: RelationalItemRelation_relationalItemByChildIdPlan,
      relationalItemByParentId: RelationalItemRelation_relationalItemByParentIdPlan
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of relational_item_relationsUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_relational_item_relationsPgResource.get(spec);
    }
  },
  RelationalItemRelationCompositePk: {
    assertStep: assertPgClassSingleStep,
    plans: {
      childId: RelationalItemRelation_childIdPlan,
      parentId: SingleTableTopic_parentIdPlan,
      relationalItemByChildId: RelationalItemRelation_relationalItemByChildIdPlan,
      relationalItemByParentId: RelationalItemRelation_relationalItemByParentIdPlan
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of relational_item_relation_composite_pksUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_relational_item_relation_composite_pksPgResource.get(spec);
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
      archivedAt: SingleTableTopic_archivedAtPlan,
      authorId: SingleTableTopic_authorIdPlan,
      createdAt: SingleTableTopic_createdAtPlan,
      isExplicitlyArchived: SingleTableTopic_isExplicitlyArchivedPlan,
      parentId: SingleTableTopic_parentIdPlan,
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
          const $relational_item_relation_composite_pks = resource_relational_item_relation_composite_pksPgResource.find();
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
          const $relational_item_relation_composite_pks = resource_relational_item_relation_composite_pksPgResource.find();
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
          const $relational_item_relations = resource_relational_item_relationsPgResource.find();
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
          const $relational_item_relations = resource_relational_item_relationsPgResource.find();
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
        const $relational_topics = resource_relational_topicsPgResource.find();
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
      rootTopicId: SingleTableTopic_rootTopicIdPlan,
      updatedAt: SingleTableTopic_updatedAtPlan
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of relational_postsUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_relational_postsPgResource.get(spec);
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
      archivedAt: SingleTableTopic_archivedAtPlan,
      authorId: SingleTableTopic_authorIdPlan,
      createdAt: SingleTableTopic_createdAtPlan,
      isExplicitlyArchived: SingleTableTopic_isExplicitlyArchivedPlan,
      parentFn($in, args, _info) {
        const details = pgFunctionArgumentsFromArgs($in, makeArgs_first_party_vulnerabilities_cvss_score_int(args));
        return resource_relational_topics_parent_fnPgResource.execute(details.selectArgs);
      },
      parentId: SingleTableTopic_parentIdPlan,
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
          const $relational_item_relation_composite_pks = resource_relational_item_relation_composite_pksPgResource.find();
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
          const $relational_item_relation_composite_pks = resource_relational_item_relation_composite_pksPgResource.find();
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
          const $relational_item_relations = resource_relational_item_relationsPgResource.find();
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
          const $relational_item_relations = resource_relational_item_relationsPgResource.find();
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
        const $relational_topics = resource_relational_topicsPgResource.find();
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
      rootTopicId: SingleTableTopic_rootTopicIdPlan,
      updatedAt: SingleTableTopic_updatedAtPlan
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of relational_topicsUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return resource_relational_topicsPgResource.get(spec);
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
      col001: MovieCollection_col001Plan,
      col002: MovieCollection_col002Plan,
      col003: MovieCollection_col003Plan,
      col004: MovieCollection_col004Plan,
      col005: MovieCollection_col005Plan,
      col006: MovieCollection_col006Plan,
      col007: MovieCollection_col007Plan,
      col008: MovieCollection_col008Plan,
      col009: MovieCollection_col009Plan,
      col010: MovieCollection_col010Plan,
      col011: MovieCollection_col011Plan,
      col012: MovieCollection_col012Plan,
      col013: MovieCollection_col013Plan,
      col014: MovieCollection_col014Plan,
      col015: MovieCollection_col015Plan,
      col016: MovieCollection_col016Plan,
      col017: MovieCollection_col017Plan,
      col018: MovieCollection_col018Plan,
      col019: MovieCollection_col019Plan,
      col020: MovieCollection_col020Plan,
      col021: MovieCollection_col021Plan,
      col022: MovieCollection_col022Plan,
      col023: MovieCollection_col023Plan,
      col024: MovieCollection_col024Plan,
      col025: MovieCollection_col025Plan,
      col026: MovieCollection_col026Plan,
      col027: MovieCollection_col027Plan,
      col028: MovieCollection_col028Plan,
      col029: MovieCollection_col029Plan,
      col030: MovieCollection_col030Plan,
      col031: MovieCollection_col031Plan,
      col032: MovieCollection_col032Plan,
      col033: MovieCollection_col033Plan,
      col034: MovieCollection_col034Plan,
      col035: MovieCollection_col035Plan,
      col036: MovieCollection_col036Plan,
      col037: MovieCollection_col037Plan,
      col038: MovieCollection_col038Plan,
      col039: MovieCollection_col039Plan,
      col040: MovieCollection_col040Plan,
      col041: MovieCollection_col041Plan,
      col042: MovieCollection_col042Plan,
      col043: MovieCollection_col043Plan,
      col044: MovieCollection_col044Plan,
      col045: MovieCollection_col045Plan,
      col046: MovieCollection_col046Plan,
      col047: MovieCollection_col047Plan,
      col048: MovieCollection_col048Plan,
      col049: MovieCollection_col049Plan,
      col050: MovieCollection_col050Plan,
      col051: MovieCollection_col051Plan,
      col052: MovieCollection_col052Plan,
      col053: MovieCollection_col053Plan,
      col054: MovieCollection_col054Plan,
      col055: MovieCollection_col055Plan,
      col056: MovieCollection_col056Plan,
      col057: MovieCollection_col057Plan,
      col058: MovieCollection_col058Plan,
      col059: MovieCollection_col059Plan,
      col060: MovieCollection_col060Plan,
      col061: MovieCollection_col061Plan,
      col062: MovieCollection_col062Plan,
      col063: MovieCollection_col063Plan,
      col064: MovieCollection_col064Plan,
      col065: MovieCollection_col065Plan,
      col066: MovieCollection_col066Plan,
      col067: MovieCollection_col067Plan,
      col068: MovieCollection_col068Plan,
      col069: MovieCollection_col069Plan,
      col070: MovieCollection_col070Plan,
      col071: MovieCollection_col071Plan,
      col072: MovieCollection_col072Plan,
      col073: MovieCollection_col073Plan,
      col074: MovieCollection_col074Plan,
      col075: MovieCollection_col075Plan,
      col076: MovieCollection_col076Plan,
      col077: MovieCollection_col077Plan,
      col078: MovieCollection_col078Plan,
      col079: MovieCollection_col079Plan,
      col080: MovieCollection_col080Plan,
      col081: MovieCollection_col081Plan,
      col082: MovieCollection_col082Plan,
      col083: MovieCollection_col083Plan,
      col084: MovieCollection_col084Plan,
      col085: MovieCollection_col085Plan,
      col086: MovieCollection_col086Plan,
      col087: MovieCollection_col087Plan,
      col088: MovieCollection_col088Plan,
      col089: MovieCollection_col089Plan,
      col090: MovieCollection_col090Plan,
      col091: MovieCollection_col091Plan,
      col092: MovieCollection_col092Plan,
      col093: MovieCollection_col093Plan,
      col094: MovieCollection_col094Plan,
      col095: MovieCollection_col095Plan,
      col096: MovieCollection_col096Plan,
      col097: MovieCollection_col097Plan,
      col098: MovieCollection_col098Plan,
      col099: MovieCollection_col099Plan,
      col100: MovieCollection_col100Plan,
      createdAt: SingleTableTopic_createdAtPlan
    }
  },
  SingleTableChecklist: {
    assertStep: assertPgClassSingleStep,
    plans: {
      archivedAt: SingleTableTopic_archivedAtPlan,
      authorId: SingleTableTopic_authorIdPlan,
      createdAt: SingleTableTopic_createdAtPlan,
      isExplicitlyArchived: SingleTableTopic_isExplicitlyArchivedPlan,
      meaningOfLife: single_table_items_meaning_of_life_getSelectPlanFromParentAndArgs,
      parentId: SingleTableTopic_parentIdPlan,
      personByAuthorId: SingleTableTopic_personByAuthorIdPlan,
      rootChecklistTopic: SingleTableTopic_rootTopicPlan,
      rootTopic: SingleTableTopic_rootTopicPlan,
      rootTopicId: SingleTableTopic_rootTopicIdPlan,
      singleTableItemByParentId: SingleTableTopic_singleTableItemByParentIdPlan,
      singleTableItemRelationCompositePksByChildId: {
        plan: SingleTableTopic_singleTableItemRelationCompositePksByChildIdPlan,
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
        plan: SingleTableTopic_singleTableItemRelationCompositePksByParentIdPlan,
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
        plan: SingleTableTopic_singleTableItemRelationsByChildIdPlan,
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
        plan: SingleTableTopic_singleTableItemRelationsByParentIdPlan,
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
        plan: SingleTableTopic_singleTableItemsByParentIdPlan,
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
      updatedAt: SingleTableTopic_updatedAtPlan
    }
  },
  SingleTableChecklistItem: {
    assertStep: assertPgClassSingleStep,
    plans: {
      archivedAt: SingleTableTopic_archivedAtPlan,
      authorId: SingleTableTopic_authorIdPlan,
      createdAt: SingleTableTopic_createdAtPlan,
      isExplicitlyArchived: SingleTableTopic_isExplicitlyArchivedPlan,
      meaningOfLife: single_table_items_meaning_of_life_getSelectPlanFromParentAndArgs,
      parentId: SingleTableTopic_parentIdPlan,
      personByAuthorId: SingleTableTopic_personByAuthorIdPlan,
      priorityByPriorityId: SingleTablePost_priorityByPriorityIdPlan,
      priorityId: SingleTablePost_priorityIdPlan,
      rootTopic: SingleTableTopic_rootTopicPlan,
      rootTopicId: SingleTableTopic_rootTopicIdPlan,
      singleTableItemByParentId: SingleTableTopic_singleTableItemByParentIdPlan,
      singleTableItemRelationCompositePksByChildId: {
        plan: SingleTableTopic_singleTableItemRelationCompositePksByChildIdPlan,
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
        plan: SingleTableTopic_singleTableItemRelationCompositePksByParentIdPlan,
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
        plan: SingleTableTopic_singleTableItemRelationsByChildIdPlan,
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
        plan: SingleTableTopic_singleTableItemRelationsByParentIdPlan,
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
        plan: SingleTableTopic_singleTableItemsByParentIdPlan,
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
      updatedAt: SingleTableTopic_updatedAtPlan
    }
  },
  SingleTableDivider: {
    assertStep: assertPgClassSingleStep,
    plans: {
      archivedAt: SingleTableTopic_archivedAtPlan,
      authorId: SingleTableTopic_authorIdPlan,
      createdAt: SingleTableTopic_createdAtPlan,
      isExplicitlyArchived: SingleTableTopic_isExplicitlyArchivedPlan,
      meaningOfLife: single_table_items_meaning_of_life_getSelectPlanFromParentAndArgs,
      parentId: SingleTableTopic_parentIdPlan,
      personByAuthorId: SingleTableTopic_personByAuthorIdPlan,
      rootTopic: SingleTableTopic_rootTopicPlan,
      rootTopicId: SingleTableTopic_rootTopicIdPlan,
      singleTableItemByParentId: SingleTableTopic_singleTableItemByParentIdPlan,
      singleTableItemRelationCompositePksByChildId: {
        plan: SingleTableTopic_singleTableItemRelationCompositePksByChildIdPlan,
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
        plan: SingleTableTopic_singleTableItemRelationCompositePksByParentIdPlan,
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
        plan: SingleTableTopic_singleTableItemRelationsByChildIdPlan,
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
        plan: SingleTableTopic_singleTableItemRelationsByParentIdPlan,
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
        plan: SingleTableTopic_singleTableItemsByParentIdPlan,
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
      updatedAt: SingleTableTopic_updatedAtPlan
    }
  },
  SingleTableItemRelation: {
    assertStep: assertPgClassSingleStep,
    plans: {
      childId: RelationalItemRelation_childIdPlan,
      parentId: SingleTableTopic_parentIdPlan,
      singleTableItemByChildId: SingleTableItemRelation_singleTableItemByChildIdPlan,
      singleTableItemByParentId: SingleTableTopic_singleTableItemByParentIdPlan
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
      childId: RelationalItemRelation_childIdPlan,
      parentId: SingleTableTopic_parentIdPlan,
      singleTableItemByChildId: SingleTableItemRelation_singleTableItemByChildIdPlan,
      singleTableItemByParentId: SingleTableTopic_singleTableItemByParentIdPlan
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
      archivedAt: SingleTableTopic_archivedAtPlan,
      authorId: SingleTableTopic_authorIdPlan,
      createdAt: SingleTableTopic_createdAtPlan,
      isExplicitlyArchived: SingleTableTopic_isExplicitlyArchivedPlan,
      meaningOfLife: single_table_items_meaning_of_life_getSelectPlanFromParentAndArgs,
      parentId: SingleTableTopic_parentIdPlan,
      personByAuthorId: SingleTableTopic_personByAuthorIdPlan,
      priorityByPriorityId: SingleTablePost_priorityByPriorityIdPlan,
      priorityId: SingleTablePost_priorityIdPlan,
      rootTopic: SingleTableTopic_rootTopicPlan,
      rootTopicId: SingleTableTopic_rootTopicIdPlan,
      singleTableItemByParentId: SingleTableTopic_singleTableItemByParentIdPlan,
      singleTableItemRelationCompositePksByChildId: {
        plan: SingleTableTopic_singleTableItemRelationCompositePksByChildIdPlan,
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
        plan: SingleTableTopic_singleTableItemRelationCompositePksByParentIdPlan,
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
        plan: SingleTableTopic_singleTableItemRelationsByChildIdPlan,
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
        plan: SingleTableTopic_singleTableItemRelationsByParentIdPlan,
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
        plan: SingleTableTopic_singleTableItemsByParentIdPlan,
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
      updatedAt: SingleTableTopic_updatedAtPlan
    }
  },
  SingleTableTopic: {
    assertStep: assertPgClassSingleStep,
    plans: {
      archivedAt: SingleTableTopic_archivedAtPlan,
      authorId: SingleTableTopic_authorIdPlan,
      createdAt: SingleTableTopic_createdAtPlan,
      isExplicitlyArchived: SingleTableTopic_isExplicitlyArchivedPlan,
      meaningOfLife: single_table_items_meaning_of_life_getSelectPlanFromParentAndArgs,
      parentId: SingleTableTopic_parentIdPlan,
      personByAuthorId: SingleTableTopic_personByAuthorIdPlan,
      rootTopic: SingleTableTopic_rootTopicPlan,
      rootTopicId: SingleTableTopic_rootTopicIdPlan,
      singleTableItemByParentId: SingleTableTopic_singleTableItemByParentIdPlan,
      singleTableItemRelationCompositePksByChildId: {
        plan: SingleTableTopic_singleTableItemRelationCompositePksByChildIdPlan,
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
        plan: SingleTableTopic_singleTableItemRelationCompositePksByParentIdPlan,
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
        plan: SingleTableTopic_singleTableItemRelationsByChildIdPlan,
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
        plan: SingleTableTopic_singleTableItemRelationsByParentIdPlan,
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
        plan: SingleTableTopic_singleTableItemsByParentIdPlan,
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
      updatedAt: SingleTableTopic_updatedAtPlan
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
            resourceByTypeName: resourceByTypeName16,
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
      cvssScore: FirstPartyVulnerability_cvssScorePlan,
      cvssScoreInt($in, args, _info) {
        return scalarComputed(resource_third_party_vulnerabilities_cvss_score_intPgResource, $in, makeArgs_first_party_vulnerabilities_cvss_score_int(args));
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
          resourceByTypeName: resourceByTypeName17,
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
      return resourceByTypeName_ThirdPartyVulnerability_third_party_vulnerabilitiesPgResource.get(spec);
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
    toSpecifier: ApplicationToSpecifier,
    planType($specifier) {
      const $__typename = get2($specifier, "__typename");
      return {
        $__typename,
        planForType(t) {
          const resource = resourceByTypeName4[t.name];
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
      const $record = $inStep instanceof PgSelectSingleStep ? $inStep : otherSource_single_table_itemsPgResource.get(Object.fromEntries(single_table_itemsUniques[0].attributes.map(attrName => [attrName, get2($inStep, attrName)])));
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
    toSpecifier: ApplicationToSpecifier,
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
  ZeroImplementation: {
    toSpecifier: ApplicationToSpecifier,
    planType($specifier) {
      const $__typename = get2($specifier, "__typename");
      return {
        $__typename,
        planForType(t) {
          const resource = resourceByTypeName9[t.name];
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
          const resource = resourceByTypeName3[t.name];
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
      id: LogEntryCondition_idApply,
      lastDeployed($condition, val) {
        return applyAttributeCondition("last_deployed", TYPES.timestamptz, $condition, val);
      },
      name: ApplicationCondition_nameApply
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
      createdAt: SingleTableItemCondition_createdAtApply,
      episodes($condition, val) {
        return applyAttributeCondition("episodes", TYPES.int, $condition, val);
      },
      id($condition, val) {
        return applyAttributeCondition("id", TYPES.text, $condition, val);
      },
      name: ApplicationCondition_nameApply,
      recommendations($condition, val) {
        return applyAttributeCondition("recommendations", TYPES.jsonb, $condition, val);
      },
      type($condition, val) {
        return applyAttributeCondition("type", TYPES.text, $condition, val);
      }
    }
  },
  LogEntryCondition: {
    plans: {
      id: LogEntryCondition_idApply,
      organizationId: LogEntryCondition_organizationIdApply,
      personId: LogEntryCondition_personIdApply,
      text($condition, val) {
        return applyAttributeCondition("text", TYPES.text, $condition, val);
      }
    }
  },
  OrganizationCondition: {
    plans: {
      name: ApplicationCondition_nameApply,
      organizationId: LogEntryCondition_organizationIdApply
    }
  },
  PersonCondition: {
    plans: {
      personId: LogEntryCondition_personIdApply,
      username($condition, val) {
        return applyAttributeCondition("username", TYPES.text, $condition, val);
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
      title: RelationalChecklistCondition_titleApply,
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
      description: RelationalChecklistItemCondition_descriptionApply,
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
      note: RelationalChecklistItemCondition_noteApply,
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
      title: RelationalChecklistCondition_titleApply,
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
      archivedAt: SingleTableItemCondition_archivedAtApply,
      authorId: SingleTableItemCondition_authorIdApply,
      createdAt: SingleTableItemCondition_createdAtApply,
      id: LogEntryCondition_idApply,
      isExplicitlyArchived: SingleTableItemCondition_isExplicitlyArchivedApply,
      parentId: SingleTableItemCondition_parentIdApply,
      position: SingleTableItemCondition_positionApply,
      rootTopicId: SingleTableItemCondition_rootTopicIdApply,
      type: SingleTableItemCondition_typeApply,
      updatedAt: SingleTableItemCondition_updatedAtApply
    }
  },
  RelationalItemRelationCompositePkCondition: {
    plans: {
      childId: SingleTableItemRelationCondition_childIdApply,
      parentId: SingleTableItemCondition_parentIdApply
    }
  },
  RelationalItemRelationCondition: {
    plans: {
      childId: SingleTableItemRelationCondition_childIdApply,
      id: LogEntryCondition_idApply,
      parentId: SingleTableItemCondition_parentIdApply
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
      description: RelationalChecklistItemCondition_descriptionApply,
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
      note: RelationalChecklistItemCondition_noteApply,
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
      title: RelationalChecklistCondition_titleApply,
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
      title: RelationalChecklistCondition_titleApply,
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
      archivedAt: SingleTableItemCondition_archivedAtApply,
      authorId: SingleTableItemCondition_authorIdApply,
      createdAt: SingleTableItemCondition_createdAtApply,
      id: LogEntryCondition_idApply,
      isExplicitlyArchived: SingleTableItemCondition_isExplicitlyArchivedApply,
      parentId: SingleTableItemCondition_parentIdApply,
      position: SingleTableItemCondition_positionApply,
      rootTopicId: SingleTableItemCondition_rootTopicIdApply,
      type: SingleTableItemCondition_typeApply,
      updatedAt: SingleTableItemCondition_updatedAtApply
    }
  },
  SingleTableItemRelationCompositePkCondition: {
    plans: {
      childId: SingleTableItemRelationCondition_childIdApply,
      parentId: SingleTableItemCondition_parentIdApply
    }
  },
  SingleTableItemRelationCondition: {
    plans: {
      childId: SingleTableItemRelationCondition_childIdApply,
      id: LogEntryCondition_idApply,
      parentId: SingleTableItemCondition_parentIdApply
    }
  },
  VulnerabilityCondition: {
    plans: {
      cvssScore($condition, val) {
        return applyAttributeCondition("cvss_score", TYPES.float, $condition, val);
      },
      id: LogEntryCondition_idApply,
      name: ApplicationCondition_nameApply
    }
  },
  ZeroImplementationCondition: {
    plans: {
      id: LogEntryCondition_idApply,
      name: ApplicationCondition_nameApply
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
      ID_ASC: ApplicationsOrderBy_ID_ASCApply,
      ID_DESC: ApplicationsOrderBy_ID_DESCApply,
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
      NAME_ASC: ApplicationsOrderBy_NAME_ASCApply,
      NAME_DESC: ApplicationsOrderBy_NAME_DESCApply
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
      CREATED_AT_ASC: SingleTableItemsOrderBy_CREATED_AT_ASCApply,
      CREATED_AT_DESC: SingleTableItemsOrderBy_CREATED_AT_DESCApply,
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
      ID_ASC: LogEntriesOrderBy_ID_ASCApply,
      ID_DESC: LogEntriesOrderBy_ID_DESCApply,
      NAME_ASC: ApplicationsOrderBy_NAME_ASCApply,
      NAME_DESC: ApplicationsOrderBy_NAME_DESCApply,
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
      TYPE_ASC: SingleTableItemsOrderBy_TYPE_ASCApply,
      TYPE_DESC: SingleTableItemsOrderBy_TYPE_DESCApply
    }
  },
  LogEntriesOrderBy: {
    values: {
      ID_ASC: LogEntriesOrderBy_ID_ASCApply,
      ID_DESC: LogEntriesOrderBy_ID_DESCApply,
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
      ARCHIVED_AT_DESC: SingleTableItemsOrderBy_ARCHIVED_AT_DESCApply,
      AUTHOR_ID_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("author_id")}`,
          codec: TYPES.int,
          direction: "ASC"
        });
      },
      AUTHOR_ID_DESC: SingleTableItemsOrderBy_AUTHOR_ID_DESCApply,
      CREATED_AT_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("created_at")}`,
          codec: TYPES.timestamptz,
          direction: "ASC"
        });
      },
      CREATED_AT_DESC: SingleTableItemsOrderBy_CREATED_AT_DESCApply,
      DESCRIPTION_ASC: RelationalChecklistItemsOrderBy_DESCRIPTION_ASCApply,
      DESCRIPTION_DESC: RelationalChecklistItemsOrderBy_DESCRIPTION_DESCApply,
      ID_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("id")}`,
          codec: TYPES.int,
          direction: "ASC"
        });
      },
      ID_DESC: ApplicationsOrderBy_ID_DESCApply,
      IS_EXPLICITLY_ARCHIVED_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("is_explicitly_archived")}`,
          codec: TYPES.boolean,
          direction: "ASC"
        });
      },
      IS_EXPLICITLY_ARCHIVED_DESC: SingleTableItemsOrderBy_IS_EXPLICITLY_ARCHIVED_DESCApply,
      NOTE_ASC: RelationalChecklistItemsOrderBy_NOTE_ASCApply,
      NOTE_DESC: RelationalChecklistItemsOrderBy_NOTE_DESCApply,
      PARENT_ID_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("parent_id")}`,
          codec: TYPES.int,
          direction: "ASC"
        });
      },
      PARENT_ID_DESC: SingleTableItemsOrderBy_PARENT_ID_DESCApply,
      POSITION_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("position")}`,
          codec: TYPES.bigint,
          direction: "ASC"
        });
      },
      POSITION_DESC: SingleTableItemsOrderBy_POSITION_DESCApply,
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
      ROOT_TOPIC_ID_DESC: SingleTableItemsOrderBy_ROOT_TOPIC_ID_DESCApply,
      TYPE_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("type")}`,
          codec: itemTypeCodec,
          direction: "ASC"
        });
      },
      TYPE_DESC: SingleTableItemsOrderBy_TYPE_DESCApply,
      UPDATED_AT_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("updated_at")}`,
          codec: TYPES.timestamptz,
          direction: "ASC"
        });
      },
      UPDATED_AT_DESC: SingleTableItemsOrderBy_UPDATED_AT_DESCApply
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
      ARCHIVED_AT_DESC: SingleTableItemsOrderBy_ARCHIVED_AT_DESCApply,
      AUTHOR_ID_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("author_id")}`,
          codec: TYPES.int,
          direction: "ASC"
        });
      },
      AUTHOR_ID_DESC: SingleTableItemsOrderBy_AUTHOR_ID_DESCApply,
      CREATED_AT_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("created_at")}`,
          codec: TYPES.timestamptz,
          direction: "ASC"
        });
      },
      CREATED_AT_DESC: SingleTableItemsOrderBy_CREATED_AT_DESCApply,
      ID_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("id")}`,
          codec: TYPES.int,
          direction: "ASC"
        });
      },
      ID_DESC: ApplicationsOrderBy_ID_DESCApply,
      IS_EXPLICITLY_ARCHIVED_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("is_explicitly_archived")}`,
          codec: TYPES.boolean,
          direction: "ASC"
        });
      },
      IS_EXPLICITLY_ARCHIVED_DESC: SingleTableItemsOrderBy_IS_EXPLICITLY_ARCHIVED_DESCApply,
      PARENT_ID_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("parent_id")}`,
          codec: TYPES.int,
          direction: "ASC"
        });
      },
      PARENT_ID_DESC: SingleTableItemsOrderBy_PARENT_ID_DESCApply,
      POSITION_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("position")}`,
          codec: TYPES.bigint,
          direction: "ASC"
        });
      },
      POSITION_DESC: SingleTableItemsOrderBy_POSITION_DESCApply,
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
      ROOT_TOPIC_ID_DESC: SingleTableItemsOrderBy_ROOT_TOPIC_ID_DESCApply,
      TITLE_ASC: RelationalChecklistsOrderBy_TITLE_ASCApply,
      TITLE_DESC: RelationalChecklistsOrderBy_TITLE_DESCApply,
      TYPE_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("type")}`,
          codec: itemTypeCodec,
          direction: "ASC"
        });
      },
      TYPE_DESC: SingleTableItemsOrderBy_TYPE_DESCApply,
      UPDATED_AT_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyChecklistItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("updated_at")}`,
          codec: TYPES.timestamptz,
          direction: "ASC"
        });
      },
      UPDATED_AT_DESC: SingleTableItemsOrderBy_UPDATED_AT_DESCApply
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
      ARCHIVED_AT_DESC: SingleTableItemsOrderBy_ARCHIVED_AT_DESCApply,
      AUTHOR_ID_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyDividerItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("author_id")}`,
          codec: TYPES.int,
          direction: "ASC"
        });
      },
      AUTHOR_ID_DESC: SingleTableItemsOrderBy_AUTHOR_ID_DESCApply,
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
      CREATED_AT_DESC: SingleTableItemsOrderBy_CREATED_AT_DESCApply,
      ID_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyDividerItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("id")}`,
          codec: TYPES.int,
          direction: "ASC"
        });
      },
      ID_DESC: ApplicationsOrderBy_ID_DESCApply,
      IS_EXPLICITLY_ARCHIVED_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyDividerItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("is_explicitly_archived")}`,
          codec: TYPES.boolean,
          direction: "ASC"
        });
      },
      IS_EXPLICITLY_ARCHIVED_DESC: SingleTableItemsOrderBy_IS_EXPLICITLY_ARCHIVED_DESCApply,
      PARENT_ID_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyDividerItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("parent_id")}`,
          codec: TYPES.int,
          direction: "ASC"
        });
      },
      PARENT_ID_DESC: SingleTableItemsOrderBy_PARENT_ID_DESCApply,
      POSITION_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyDividerItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("position")}`,
          codec: TYPES.bigint,
          direction: "ASC"
        });
      },
      POSITION_DESC: SingleTableItemsOrderBy_POSITION_DESCApply,
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
      ROOT_TOPIC_ID_DESC: SingleTableItemsOrderBy_ROOT_TOPIC_ID_DESCApply,
      TITLE_ASC: RelationalChecklistsOrderBy_TITLE_ASCApply,
      TITLE_DESC: RelationalChecklistsOrderBy_TITLE_DESCApply,
      TYPE_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyDividerItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("type")}`,
          codec: itemTypeCodec,
          direction: "ASC"
        });
      },
      TYPE_DESC: SingleTableItemsOrderBy_TYPE_DESCApply,
      UPDATED_AT_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyDividerItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("updated_at")}`,
          codec: TYPES.timestamptz,
          direction: "ASC"
        });
      },
      UPDATED_AT_DESC: SingleTableItemsOrderBy_UPDATED_AT_DESCApply
    }
  },
  RelationalItemRelationCompositePksOrderBy: {
    values: {
      CHILD_ID_ASC: SingleTableItemRelationsOrderBy_CHILD_ID_ASCApply,
      CHILD_ID_DESC: SingleTableItemRelationsOrderBy_CHILD_ID_DESCApply,
      PARENT_ID_ASC: SingleTableItemRelationsOrderBy_PARENT_ID_ASCApply,
      PARENT_ID_DESC: SingleTableItemRelationsOrderBy_PARENT_ID_DESCApply,
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
      CHILD_ID_ASC: SingleTableItemRelationsOrderBy_CHILD_ID_ASCApply,
      CHILD_ID_DESC: SingleTableItemRelationsOrderBy_CHILD_ID_DESCApply,
      ID_ASC: LogEntriesOrderBy_ID_ASCApply,
      ID_DESC: LogEntriesOrderBy_ID_DESCApply,
      PARENT_ID_ASC: SingleTableItemRelationsOrderBy_PARENT_ID_ASCApply,
      PARENT_ID_DESC: SingleTableItemRelationsOrderBy_PARENT_ID_DESCApply,
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
      ARCHIVED_AT_ASC: SingleTableItemsOrderBy_ARCHIVED_AT_ASCApply,
      ARCHIVED_AT_DESC: SingleTableItemsOrderBy_ARCHIVED_AT_DESCApply,
      AUTHOR_ID_ASC: SingleTableItemsOrderBy_AUTHOR_ID_ASCApply,
      AUTHOR_ID_DESC: SingleTableItemsOrderBy_AUTHOR_ID_DESCApply,
      CREATED_AT_ASC: SingleTableItemsOrderBy_CREATED_AT_ASCApply,
      CREATED_AT_DESC: SingleTableItemsOrderBy_CREATED_AT_DESCApply,
      ID_ASC: LogEntriesOrderBy_ID_ASCApply,
      ID_DESC: LogEntriesOrderBy_ID_DESCApply,
      IS_EXPLICITLY_ARCHIVED_ASC: SingleTableItemsOrderBy_IS_EXPLICITLY_ARCHIVED_ASCApply,
      IS_EXPLICITLY_ARCHIVED_DESC: SingleTableItemsOrderBy_IS_EXPLICITLY_ARCHIVED_DESCApply,
      PARENT_ID_ASC: SingleTableItemsOrderBy_PARENT_ID_ASCApply,
      PARENT_ID_DESC: SingleTableItemsOrderBy_PARENT_ID_DESCApply,
      POSITION_ASC: SingleTableItemsOrderBy_POSITION_ASCApply,
      POSITION_DESC: SingleTableItemsOrderBy_POSITION_DESCApply,
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
      ROOT_TOPIC_ID_ASC: SingleTableItemsOrderBy_ROOT_TOPIC_ID_ASCApply,
      ROOT_TOPIC_ID_DESC: SingleTableItemsOrderBy_ROOT_TOPIC_ID_DESCApply,
      TYPE_ASC: SingleTableItemsOrderBy_TYPE_ASCApply,
      TYPE_DESC: SingleTableItemsOrderBy_TYPE_DESCApply,
      UPDATED_AT_ASC: SingleTableItemsOrderBy_UPDATED_AT_ASCApply,
      UPDATED_AT_DESC: SingleTableItemsOrderBy_UPDATED_AT_DESCApply
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
      ARCHIVED_AT_DESC: SingleTableItemsOrderBy_ARCHIVED_AT_DESCApply,
      AUTHOR_ID_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyPostItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("author_id")}`,
          codec: TYPES.int,
          direction: "ASC"
        });
      },
      AUTHOR_ID_DESC: SingleTableItemsOrderBy_AUTHOR_ID_DESCApply,
      CREATED_AT_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyPostItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("created_at")}`,
          codec: TYPES.timestamptz,
          direction: "ASC"
        });
      },
      CREATED_AT_DESC: SingleTableItemsOrderBy_CREATED_AT_DESCApply,
      DESCRIPTION_ASC: RelationalChecklistItemsOrderBy_DESCRIPTION_ASCApply,
      DESCRIPTION_DESC: RelationalChecklistItemsOrderBy_DESCRIPTION_DESCApply,
      ID_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyPostItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("id")}`,
          codec: TYPES.int,
          direction: "ASC"
        });
      },
      ID_DESC: ApplicationsOrderBy_ID_DESCApply,
      IS_EXPLICITLY_ARCHIVED_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyPostItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("is_explicitly_archived")}`,
          codec: TYPES.boolean,
          direction: "ASC"
        });
      },
      IS_EXPLICITLY_ARCHIVED_DESC: SingleTableItemsOrderBy_IS_EXPLICITLY_ARCHIVED_DESCApply,
      NOTE_ASC: RelationalChecklistItemsOrderBy_NOTE_ASCApply,
      NOTE_DESC: RelationalChecklistItemsOrderBy_NOTE_DESCApply,
      PARENT_ID_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyPostItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("parent_id")}`,
          codec: TYPES.int,
          direction: "ASC"
        });
      },
      PARENT_ID_DESC: SingleTableItemsOrderBy_PARENT_ID_DESCApply,
      POSITION_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyPostItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("position")}`,
          codec: TYPES.bigint,
          direction: "ASC"
        });
      },
      POSITION_DESC: SingleTableItemsOrderBy_POSITION_DESCApply,
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
      ROOT_TOPIC_ID_DESC: SingleTableItemsOrderBy_ROOT_TOPIC_ID_DESCApply,
      TITLE_ASC: RelationalChecklistsOrderBy_TITLE_ASCApply,
      TITLE_DESC: RelationalChecklistsOrderBy_TITLE_DESCApply,
      TYPE_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyPostItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("type")}`,
          codec: itemTypeCodec,
          direction: "ASC"
        });
      },
      TYPE_DESC: SingleTableItemsOrderBy_TYPE_DESCApply,
      UPDATED_AT_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyPostItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("updated_at")}`,
          codec: TYPES.timestamptz,
          direction: "ASC"
        });
      },
      UPDATED_AT_DESC: SingleTableItemsOrderBy_UPDATED_AT_DESCApply
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
      ARCHIVED_AT_DESC: SingleTableItemsOrderBy_ARCHIVED_AT_DESCApply,
      AUTHOR_ID_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyTopicItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("author_id")}`,
          codec: TYPES.int,
          direction: "ASC"
        });
      },
      AUTHOR_ID_DESC: SingleTableItemsOrderBy_AUTHOR_ID_DESCApply,
      CREATED_AT_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyTopicItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("created_at")}`,
          codec: TYPES.timestamptz,
          direction: "ASC"
        });
      },
      CREATED_AT_DESC: SingleTableItemsOrderBy_CREATED_AT_DESCApply,
      ID_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyTopicItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("id")}`,
          codec: TYPES.int,
          direction: "ASC"
        });
      },
      ID_DESC: ApplicationsOrderBy_ID_DESCApply,
      IS_EXPLICITLY_ARCHIVED_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyTopicItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("is_explicitly_archived")}`,
          codec: TYPES.boolean,
          direction: "ASC"
        });
      },
      IS_EXPLICITLY_ARCHIVED_DESC: SingleTableItemsOrderBy_IS_EXPLICITLY_ARCHIVED_DESCApply,
      PARENT_ID_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyTopicItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("parent_id")}`,
          codec: TYPES.int,
          direction: "ASC"
        });
      },
      PARENT_ID_DESC: SingleTableItemsOrderBy_PARENT_ID_DESCApply,
      POSITION_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyTopicItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("position")}`,
          codec: TYPES.bigint,
          direction: "ASC"
        });
      },
      POSITION_DESC: SingleTableItemsOrderBy_POSITION_DESCApply,
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
      ROOT_TOPIC_ID_DESC: SingleTableItemsOrderBy_ROOT_TOPIC_ID_DESCApply,
      TITLE_ASC: RelationalChecklistsOrderBy_TITLE_ASCApply,
      TITLE_DESC: RelationalChecklistsOrderBy_TITLE_DESCApply,
      TYPE_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyTopicItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("type")}`,
          codec: itemTypeCodec,
          direction: "ASC"
        });
      },
      TYPE_DESC: SingleTableItemsOrderBy_TYPE_DESCApply,
      UPDATED_AT_ASC(queryBuilder) {
        const alias = queryBuilder.singleRelation("relationalItemsByMyTopicItemId");
        queryBuilder.orderBy({
          fragment: sql`${alias}.${sql.identifier("updated_at")}`,
          codec: TYPES.timestamptz,
          direction: "ASC"
        });
      },
      UPDATED_AT_DESC: SingleTableItemsOrderBy_UPDATED_AT_DESCApply
    }
  },
  SingleTableItemRelationCompositePksOrderBy: {
    values: {
      CHILD_ID_ASC: SingleTableItemRelationsOrderBy_CHILD_ID_ASCApply,
      CHILD_ID_DESC: SingleTableItemRelationsOrderBy_CHILD_ID_DESCApply,
      PARENT_ID_ASC: SingleTableItemRelationsOrderBy_PARENT_ID_ASCApply,
      PARENT_ID_DESC: SingleTableItemRelationsOrderBy_PARENT_ID_DESCApply,
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
      CHILD_ID_ASC: SingleTableItemRelationsOrderBy_CHILD_ID_ASCApply,
      CHILD_ID_DESC: SingleTableItemRelationsOrderBy_CHILD_ID_DESCApply,
      ID_ASC: LogEntriesOrderBy_ID_ASCApply,
      ID_DESC: LogEntriesOrderBy_ID_DESCApply,
      PARENT_ID_ASC: SingleTableItemRelationsOrderBy_PARENT_ID_ASCApply,
      PARENT_ID_DESC: SingleTableItemRelationsOrderBy_PARENT_ID_DESCApply,
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
      ARCHIVED_AT_ASC: SingleTableItemsOrderBy_ARCHIVED_AT_ASCApply,
      ARCHIVED_AT_DESC: SingleTableItemsOrderBy_ARCHIVED_AT_DESCApply,
      AUTHOR_ID_ASC: SingleTableItemsOrderBy_AUTHOR_ID_ASCApply,
      AUTHOR_ID_DESC: SingleTableItemsOrderBy_AUTHOR_ID_DESCApply,
      CREATED_AT_ASC: SingleTableItemsOrderBy_CREATED_AT_ASCApply,
      CREATED_AT_DESC: SingleTableItemsOrderBy_CREATED_AT_DESCApply,
      ID_ASC: LogEntriesOrderBy_ID_ASCApply,
      ID_DESC: LogEntriesOrderBy_ID_DESCApply,
      IS_EXPLICITLY_ARCHIVED_ASC: SingleTableItemsOrderBy_IS_EXPLICITLY_ARCHIVED_ASCApply,
      IS_EXPLICITLY_ARCHIVED_DESC: SingleTableItemsOrderBy_IS_EXPLICITLY_ARCHIVED_DESCApply,
      PARENT_ID_ASC: SingleTableItemsOrderBy_PARENT_ID_ASCApply,
      PARENT_ID_DESC: SingleTableItemsOrderBy_PARENT_ID_DESCApply,
      POSITION_ASC: SingleTableItemsOrderBy_POSITION_ASCApply,
      POSITION_DESC: SingleTableItemsOrderBy_POSITION_DESCApply,
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
      ROOT_TOPIC_ID_ASC: SingleTableItemsOrderBy_ROOT_TOPIC_ID_ASCApply,
      ROOT_TOPIC_ID_DESC: SingleTableItemsOrderBy_ROOT_TOPIC_ID_DESCApply,
      TYPE_ASC: SingleTableItemsOrderBy_TYPE_ASCApply,
      TYPE_DESC: SingleTableItemsOrderBy_TYPE_DESCApply,
      UPDATED_AT_ASC: SingleTableItemsOrderBy_UPDATED_AT_ASCApply,
      UPDATED_AT_DESC: SingleTableItemsOrderBy_UPDATED_AT_DESCApply
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
      ID_ASC: ApplicationsOrderBy_ID_ASCApply,
      ID_DESC: ApplicationsOrderBy_ID_DESCApply,
      NAME_ASC: ApplicationsOrderBy_NAME_ASCApply,
      NAME_DESC: ApplicationsOrderBy_NAME_DESCApply
    }
  },
  ZeroImplementationsOrderBy: {
    values: {
      ID_ASC: ApplicationsOrderBy_ID_ASCApply,
      ID_DESC: ApplicationsOrderBy_ID_DESCApply,
      NAME_ASC: ApplicationsOrderBy_NAME_ASCApply,
      NAME_DESC: ApplicationsOrderBy_NAME_DESCApply
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
