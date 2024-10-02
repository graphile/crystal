import { PgDeleteSingleStep, PgExecutor, PgResource, PgSelectStep, PgUnionAllStep, TYPES, assertPgClassSingleStep, enumCodec, makeRegistry, pgDeleteSingle, pgInsertSingle, pgSelectFromRecord, pgUnionAll, pgUpdateSingle, recordCodec, sqlFromArgDigests } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ObjectStep, SafeError, __ValueStep, assertEdgeCapableStep, assertExecutableStep, assertPageInfoCapableStep, connection, constant, context, first, getEnumValueConfig, makeGrafastSchema, object, rootValue } from "grafast";
import { GraphQLError, Kind } from "graphql";
import { sql } from "pg-sql2";
import { inspect } from "util";
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
const awsApplicationFirstPartyVulnerabilitiesIdentifier = sql.identifier("polymorphic", "aws_application_first_party_vulnerabilities");
const spec_awsApplicationFirstPartyVulnerabilities = {
  name: "awsApplicationFirstPartyVulnerabilities",
  identifier: awsApplicationFirstPartyVulnerabilitiesIdentifier,
  attributes: Object.assign(Object.create(null), {
    aws_application_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    first_party_vulnerability_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "aws_application_first_party_vulnerabilities"
    },
    tags: Object.assign(Object.create(null), {
      omit: true,
      behavior: ["-insert -select -node -connection -list -array -single -update -delete -queryField -mutationField -typeField -filter -filterBy -order -orderBy -query:resource:list -query:resource:connection -singularRelation:resource:list -singularRelation:resource:connection -manyRelation:resource:list -manyRelation:resource:connection -manyToMany"]
    })
  },
  executor: executor
};
const awsApplicationFirstPartyVulnerabilitiesCodec = recordCodec(spec_awsApplicationFirstPartyVulnerabilities);
const awsApplicationThirdPartyVulnerabilitiesIdentifier = sql.identifier("polymorphic", "aws_application_third_party_vulnerabilities");
const spec_awsApplicationThirdPartyVulnerabilities = {
  name: "awsApplicationThirdPartyVulnerabilities",
  identifier: awsApplicationThirdPartyVulnerabilitiesIdentifier,
  attributes: Object.assign(Object.create(null), {
    aws_application_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    third_party_vulnerability_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "aws_application_third_party_vulnerabilities"
    },
    tags: Object.assign(Object.create(null), {
      omit: true,
      behavior: ["-insert -select -node -connection -list -array -single -update -delete -queryField -mutationField -typeField -filter -filterBy -order -orderBy -query:resource:list -query:resource:connection -singularRelation:resource:list -singularRelation:resource:connection -manyRelation:resource:list -manyRelation:resource:connection -manyToMany"]
    })
  },
  executor: executor
};
const awsApplicationThirdPartyVulnerabilitiesCodec = recordCodec(spec_awsApplicationThirdPartyVulnerabilities);
const gcpApplicationFirstPartyVulnerabilitiesIdentifier = sql.identifier("polymorphic", "gcp_application_first_party_vulnerabilities");
const spec_gcpApplicationFirstPartyVulnerabilities = {
  name: "gcpApplicationFirstPartyVulnerabilities",
  identifier: gcpApplicationFirstPartyVulnerabilitiesIdentifier,
  attributes: Object.assign(Object.create(null), {
    gcp_application_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    first_party_vulnerability_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "gcp_application_first_party_vulnerabilities"
    },
    tags: Object.assign(Object.create(null), {
      omit: true,
      behavior: ["-insert -select -node -connection -list -array -single -update -delete -queryField -mutationField -typeField -filter -filterBy -order -orderBy -query:resource:list -query:resource:connection -singularRelation:resource:list -singularRelation:resource:connection -manyRelation:resource:list -manyRelation:resource:connection -manyToMany"]
    })
  },
  executor: executor
};
const gcpApplicationFirstPartyVulnerabilitiesCodec = recordCodec(spec_gcpApplicationFirstPartyVulnerabilities);
const gcpApplicationThirdPartyVulnerabilitiesIdentifier = sql.identifier("polymorphic", "gcp_application_third_party_vulnerabilities");
const spec_gcpApplicationThirdPartyVulnerabilities = {
  name: "gcpApplicationThirdPartyVulnerabilities",
  identifier: gcpApplicationThirdPartyVulnerabilitiesIdentifier,
  attributes: Object.assign(Object.create(null), {
    gcp_application_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    third_party_vulnerability_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "gcp_application_third_party_vulnerabilities"
    },
    tags: Object.assign(Object.create(null), {
      omit: true,
      behavior: ["-insert -select -node -connection -list -array -single -update -delete -queryField -mutationField -typeField -filter -filterBy -order -orderBy -query:resource:list -query:resource:connection -singularRelation:resource:list -singularRelation:resource:connection -manyRelation:resource:list -manyRelation:resource:connection -manyToMany"]
    })
  },
  executor: executor
};
const gcpApplicationThirdPartyVulnerabilitiesCodec = recordCodec(spec_gcpApplicationThirdPartyVulnerabilities);
const organizationsIdentifier = sql.identifier("polymorphic", "organizations");
const spec_organizations = {
  name: "organizations",
  identifier: organizationsIdentifier,
  attributes: Object.assign(Object.create(null), {
    organization_id: {
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
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "organizations"
    },
    tags: Object.assign(Object.create(null), {
      unionMember: "PersonOrOrganization"
    })
  },
  executor: executor
};
const organizationsCodec = recordCodec(spec_organizations);
const peopleIdentifier = sql.identifier("polymorphic", "people");
const spec_people = {
  name: "people",
  identifier: peopleIdentifier,
  attributes: Object.assign(Object.create(null), {
    person_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {}
      }
    },
    username: {
      description: undefined,
      codec: TYPES.text,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "people"
    },
    tags: Object.assign(Object.create(null), {
      unionMember: "PersonOrOrganization",
      ref: "applications to:Application",
      refVia: ["applications via:aws_applications", "applications via:gcp_applications"]
    }),
    refDefinitions: Object.assign(Object.create(null), {
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
    })
  },
  executor: executor
};
const peopleCodec = recordCodec(spec_people);
const prioritiesIdentifier = sql.identifier("polymorphic", "priorities");
const spec_priorities = {
  name: "priorities",
  identifier: prioritiesIdentifier,
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {}
      }
    },
    title: {
      description: undefined,
      codec: TYPES.text,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "priorities"
    },
    tags: Object.assign(Object.create(null), {
      omit: "create,update,delete,filter,order",
      behavior: ["-insert -update -delete -filter -filterBy -order -orderBy"]
    })
  },
  executor: executor
};
const prioritiesCodec = recordCodec(spec_priorities);
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
    },
    tags: Object.create(null)
  }
});
const spec_relationalChecklists = {
  name: "relationalChecklists",
  identifier: relationalChecklistsIdentifier,
  attributes: Object.assign(Object.create(null), {
    checklist_item_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    title: {
      description: undefined,
      codec: TYPES.text,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyChecklistItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: {}
      }
    },
    type: {
      codec: itemTypeCodec,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyChecklistItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: {}
      }
    },
    parent_id: {
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      via: "relationalItemsByMyChecklistItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: {}
      }
    },
    root_topic_id: {
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      via: "relationalItemsByMyChecklistItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: {}
      }
    },
    author_id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      via: "relationalItemsByMyChecklistItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: {}
      }
    },
    position: {
      codec: TYPES.bigint,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyChecklistItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: {}
      }
    },
    created_at: {
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyChecklistItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: {}
      }
    },
    updated_at: {
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyChecklistItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: {}
      }
    },
    is_explicitly_archived: {
      codec: TYPES.boolean,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyChecklistItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: {}
      }
    },
    archived_at: {
      codec: TYPES.timestamptz,
      notNull: false,
      hasDefault: false,
      via: "relationalItemsByMyChecklistItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: {}
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "relational_checklists"
    },
    tags: Object.create(null),
    relationalInterfaceCodecName: "relationalItems"
  },
  executor: executor
};
const relationalChecklistsCodec = recordCodec(spec_relationalChecklists);
const relationalItemRelationCompositePksIdentifier = sql.identifier("polymorphic", "relational_item_relation_composite_pks");
const spec_relationalItemRelationCompositePks = {
  name: "relationalItemRelationCompositePks",
  identifier: relationalItemRelationCompositePksIdentifier,
  attributes: Object.assign(Object.create(null), {
    parent_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    child_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "relational_item_relation_composite_pks"
    },
    tags: Object.create(null)
  },
  executor: executor
};
const relationalItemRelationCompositePksCodec = recordCodec(spec_relationalItemRelationCompositePks);
const relationalTopicsIdentifier = sql.identifier("polymorphic", "relational_topics");
const spec_relationalTopics = {
  name: "relationalTopics",
  identifier: relationalTopicsIdentifier,
  attributes: Object.assign(Object.create(null), {
    topic_item_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    title: {
      description: undefined,
      codec: TYPES.text,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyTopicItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: spec_relationalChecklists.attributes.id.extensions.tags
      }
    },
    type: {
      codec: itemTypeCodec,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyTopicItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: spec_relationalChecklists.attributes.type.extensions.tags
      }
    },
    parent_id: {
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      via: "relationalItemsByMyTopicItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: spec_relationalChecklists.attributes.parent_id.extensions.tags
      }
    },
    root_topic_id: {
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      via: "relationalItemsByMyTopicItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: spec_relationalChecklists.attributes.root_topic_id.extensions.tags
      }
    },
    author_id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      via: "relationalItemsByMyTopicItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: spec_relationalChecklists.attributes.author_id.extensions.tags
      }
    },
    position: {
      codec: TYPES.bigint,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyTopicItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: spec_relationalChecklists.attributes.position.extensions.tags
      }
    },
    created_at: {
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyTopicItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: spec_relationalChecklists.attributes.created_at.extensions.tags
      }
    },
    updated_at: {
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyTopicItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: spec_relationalChecklists.attributes.updated_at.extensions.tags
      }
    },
    is_explicitly_archived: {
      codec: TYPES.boolean,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyTopicItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: spec_relationalChecklists.attributes.is_explicitly_archived.extensions.tags
      }
    },
    archived_at: {
      codec: TYPES.timestamptz,
      notNull: false,
      hasDefault: false,
      via: "relationalItemsByMyTopicItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: spec_relationalChecklists.attributes.archived_at.extensions.tags
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "relational_topics"
    },
    tags: Object.create(null),
    relationalInterfaceCodecName: "relationalItems"
  },
  executor: executor
};
const relationalTopicsCodec = recordCodec(spec_relationalTopics);
const singleTableItemRelationCompositePksIdentifier = sql.identifier("polymorphic", "single_table_item_relation_composite_pks");
const spec_singleTableItemRelationCompositePks = {
  name: "singleTableItemRelationCompositePks",
  identifier: singleTableItemRelationCompositePksIdentifier,
  attributes: Object.assign(Object.create(null), {
    parent_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    child_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "single_table_item_relation_composite_pks"
    },
    tags: Object.create(null)
  },
  executor: executor
};
const singleTableItemRelationCompositePksCodec = recordCodec(spec_singleTableItemRelationCompositePks);
const relationalChecklistItemsIdentifier = sql.identifier("polymorphic", "relational_checklist_items");
const spec_relationalChecklistItems = {
  name: "relationalChecklistItems",
  identifier: relationalChecklistItemsIdentifier,
  attributes: Object.assign(Object.create(null), {
    checklist_item_item_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    description: {
      description: undefined,
      codec: TYPES.text,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    note: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyChecklistItemItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: spec_relationalChecklists.attributes.id.extensions.tags
      }
    },
    type: {
      codec: itemTypeCodec,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyChecklistItemItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: spec_relationalChecklists.attributes.type.extensions.tags
      }
    },
    parent_id: {
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      via: "relationalItemsByMyChecklistItemItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: spec_relationalChecklists.attributes.parent_id.extensions.tags
      }
    },
    root_topic_id: {
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      via: "relationalItemsByMyChecklistItemItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: spec_relationalChecklists.attributes.root_topic_id.extensions.tags
      }
    },
    author_id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      via: "relationalItemsByMyChecklistItemItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: spec_relationalChecklists.attributes.author_id.extensions.tags
      }
    },
    position: {
      codec: TYPES.bigint,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyChecklistItemItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: spec_relationalChecklists.attributes.position.extensions.tags
      }
    },
    created_at: {
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyChecklistItemItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: spec_relationalChecklists.attributes.created_at.extensions.tags
      }
    },
    updated_at: {
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyChecklistItemItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: spec_relationalChecklists.attributes.updated_at.extensions.tags
      }
    },
    is_explicitly_archived: {
      codec: TYPES.boolean,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyChecklistItemItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: spec_relationalChecklists.attributes.is_explicitly_archived.extensions.tags
      }
    },
    archived_at: {
      codec: TYPES.timestamptz,
      notNull: false,
      hasDefault: false,
      via: "relationalItemsByMyChecklistItemItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: spec_relationalChecklists.attributes.archived_at.extensions.tags
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "relational_checklist_items"
    },
    tags: Object.create(null),
    relationalInterfaceCodecName: "relationalItems"
  },
  executor: executor
};
const relationalChecklistItemsCodec = recordCodec(spec_relationalChecklistItems);
const relationalDividersIdentifier = sql.identifier("polymorphic", "relational_dividers");
const spec_relationalDividers = {
  name: "relationalDividers",
  identifier: relationalDividersIdentifier,
  attributes: Object.assign(Object.create(null), {
    divider_item_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    title: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    color: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyDividerItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: spec_relationalChecklists.attributes.id.extensions.tags
      }
    },
    type: {
      codec: itemTypeCodec,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyDividerItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: spec_relationalChecklists.attributes.type.extensions.tags
      }
    },
    parent_id: {
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      via: "relationalItemsByMyDividerItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: spec_relationalChecklists.attributes.parent_id.extensions.tags
      }
    },
    root_topic_id: {
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      via: "relationalItemsByMyDividerItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: spec_relationalChecklists.attributes.root_topic_id.extensions.tags
      }
    },
    author_id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      via: "relationalItemsByMyDividerItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: spec_relationalChecklists.attributes.author_id.extensions.tags
      }
    },
    position: {
      codec: TYPES.bigint,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyDividerItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: spec_relationalChecklists.attributes.position.extensions.tags
      }
    },
    created_at: {
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyDividerItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: spec_relationalChecklists.attributes.created_at.extensions.tags
      }
    },
    updated_at: {
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyDividerItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: spec_relationalChecklists.attributes.updated_at.extensions.tags
      }
    },
    is_explicitly_archived: {
      codec: TYPES.boolean,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyDividerItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: spec_relationalChecklists.attributes.is_explicitly_archived.extensions.tags
      }
    },
    archived_at: {
      codec: TYPES.timestamptz,
      notNull: false,
      hasDefault: false,
      via: "relationalItemsByMyDividerItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: spec_relationalChecklists.attributes.archived_at.extensions.tags
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "relational_dividers"
    },
    tags: Object.create(null),
    relationalInterfaceCodecName: "relationalItems"
  },
  executor: executor
};
const relationalDividersCodec = recordCodec(spec_relationalDividers);
const relationalItemRelationsIdentifier = sql.identifier("polymorphic", "relational_item_relations");
const spec_relationalItemRelations = {
  name: "relationalItemRelations",
  identifier: relationalItemRelationsIdentifier,
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {}
      }
    },
    parent_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    child_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "relational_item_relations"
    },
    tags: Object.create(null)
  },
  executor: executor
};
const relationalItemRelationsCodec = recordCodec(spec_relationalItemRelations);
const singleTableItemRelationsIdentifier = sql.identifier("polymorphic", "single_table_item_relations");
const spec_singleTableItemRelations = {
  name: "singleTableItemRelations",
  identifier: singleTableItemRelationsIdentifier,
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {}
      }
    },
    parent_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    child_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "single_table_item_relations"
    },
    tags: Object.create(null)
  },
  executor: executor
};
const singleTableItemRelationsCodec = recordCodec(spec_singleTableItemRelations);
const logEntriesIdentifier = sql.identifier("polymorphic", "log_entries");
const spec_logEntries = {
  name: "logEntries",
  identifier: logEntriesIdentifier,
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {}
      }
    },
    person_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    organization_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    text: {
      description: undefined,
      codec: TYPES.text,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "log_entries"
    },
    tags: Object.assign(Object.create(null), {
      ref: "author to:PersonOrOrganization singular",
      refVia: ["author via:people", "author via:organizations"]
    }),
    refDefinitions: Object.assign(Object.create(null), {
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
    })
  },
  executor: executor
};
const logEntriesCodec = recordCodec(spec_logEntries);
const relationalPostsIdentifier = sql.identifier("polymorphic", "relational_posts");
const spec_relationalPosts = {
  name: "relationalPosts",
  identifier: relationalPostsIdentifier,
  attributes: Object.assign(Object.create(null), {
    post_item_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    title: {
      description: undefined,
      codec: TYPES.text,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    description: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: true,
      extensions: {
        tags: {}
      }
    },
    note: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyPostItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: spec_relationalChecklists.attributes.id.extensions.tags
      }
    },
    type: {
      codec: itemTypeCodec,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyPostItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: spec_relationalChecklists.attributes.type.extensions.tags
      }
    },
    parent_id: {
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      via: "relationalItemsByMyPostItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: spec_relationalChecklists.attributes.parent_id.extensions.tags
      }
    },
    root_topic_id: {
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      via: "relationalItemsByMyPostItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: spec_relationalChecklists.attributes.root_topic_id.extensions.tags
      }
    },
    author_id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      via: "relationalItemsByMyPostItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: spec_relationalChecklists.attributes.author_id.extensions.tags
      }
    },
    position: {
      codec: TYPES.bigint,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyPostItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: spec_relationalChecklists.attributes.position.extensions.tags
      }
    },
    created_at: {
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyPostItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: spec_relationalChecklists.attributes.created_at.extensions.tags
      }
    },
    updated_at: {
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyPostItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: spec_relationalChecklists.attributes.updated_at.extensions.tags
      }
    },
    is_explicitly_archived: {
      codec: TYPES.boolean,
      notNull: true,
      hasDefault: true,
      via: "relationalItemsByMyPostItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: spec_relationalChecklists.attributes.is_explicitly_archived.extensions.tags
      }
    },
    archived_at: {
      codec: TYPES.timestamptz,
      notNull: false,
      hasDefault: false,
      via: "relationalItemsByMyPostItemId",
      restrictedAccess: undefined,
      description: undefined,
      extensions: {
        tags: spec_relationalChecklists.attributes.archived_at.extensions.tags
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "relational_posts"
    },
    tags: Object.create(null),
    relationalInterfaceCodecName: "relationalItems"
  },
  executor: executor
};
const relationalPostsCodec = recordCodec(spec_relationalPosts);
const firstPartyVulnerabilitiesIdentifier = sql.identifier("polymorphic", "first_party_vulnerabilities");
const spec_firstPartyVulnerabilities = {
  name: "firstPartyVulnerabilities",
  identifier: firstPartyVulnerabilitiesIdentifier,
  attributes: Object.assign(Object.create(null), {
    id: {
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
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    cvss_score: {
      description: undefined,
      codec: TYPES.float,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    team_name: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "first_party_vulnerabilities"
    },
    tags: Object.assign(Object.create(null), {
      implements: "Vulnerability",
      ref: ["applications to:Application plural", "owners to:PersonOrOrganization plural"],
      refVia: ["applications via:aws_application_first_party_vulnerabilities;aws_applications", "applications via:gcp_application_first_party_vulnerabilities;gcp_applications", "owners via:aws_application_first_party_vulnerabilities;aws_applications;people", "owners via:aws_application_first_party_vulnerabilities;aws_applications;organizations", "owners via:gcp_application_first_party_vulnerabilities;gcp_applications;people", "owners via:gcp_application_first_party_vulnerabilities;gcp_applications;organizations"]
    }),
    refDefinitions: Object.assign(Object.create(null), {
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
    })
  },
  executor: executor
};
const firstPartyVulnerabilitiesCodec = recordCodec(spec_firstPartyVulnerabilities);
const thirdPartyVulnerabilitiesIdentifier = sql.identifier("polymorphic", "third_party_vulnerabilities");
const spec_thirdPartyVulnerabilities = {
  name: "thirdPartyVulnerabilities",
  identifier: thirdPartyVulnerabilitiesIdentifier,
  attributes: Object.assign(Object.create(null), {
    id: {
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
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    cvss_score: {
      description: undefined,
      codec: TYPES.float,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    vendor_name: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "third_party_vulnerabilities"
    },
    tags: Object.assign(Object.create(null), {
      implements: "Vulnerability",
      ref: ["applications to:Application plural", "owners to:PersonOrOrganization plural"],
      refVia: ["applications via:aws_application_third_party_vulnerabilities;aws_applications", "applications via:gcp_application_third_party_vulnerabilities;gcp_applications", "owners via:aws_application_third_party_vulnerabilities;aws_applications;people", "owners via:aws_application_third_party_vulnerabilities;aws_applications;organizations", "owners via:gcp_application_third_party_vulnerabilities;gcp_applications;people", "owners via:gcp_application_third_party_vulnerabilities;gcp_applications;organizations"]
    }),
    refDefinitions: Object.assign(Object.create(null), {
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
    })
  },
  executor: executor
};
const thirdPartyVulnerabilitiesCodec = recordCodec(spec_thirdPartyVulnerabilities);
const awsApplicationsIdentifier = sql.identifier("polymorphic", "aws_applications");
const spec_awsApplications = {
  name: "awsApplications",
  identifier: awsApplicationsIdentifier,
  attributes: Object.assign(Object.create(null), {
    id: {
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
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    last_deployed: {
      description: undefined,
      codec: TYPES.timestamptz,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    person_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    organization_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    aws_id: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "aws_applications"
    },
    tags: Object.assign(Object.create(null), {
      implements: "Application",
      ref: ["vulnerabilities to:Vulnerability plural", "owner to:PersonOrOrganization singular"],
      refVia: ["vulnerabilities via:(id)->aws_application_first_party_vulnerabilities(aws_application_id);(first_party_vulnerability_id)->first_party_vulnerabilities(id)", "vulnerabilities via:(id)->aws_application_third_party_vulnerabilities(aws_application_id);(third_party_vulnerability_id)->third_party_vulnerabilities(id)", "owner via:people", "owner via:organizations"]
    }),
    refDefinitions: Object.assign(Object.create(null), {
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
    })
  },
  executor: executor
};
const awsApplicationsCodec = recordCodec(spec_awsApplications);
const gcpApplicationsIdentifier = sql.identifier("polymorphic", "gcp_applications");
const spec_gcpApplications = {
  name: "gcpApplications",
  identifier: gcpApplicationsIdentifier,
  attributes: Object.assign(Object.create(null), {
    id: {
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
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    last_deployed: {
      description: undefined,
      codec: TYPES.timestamptz,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    person_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    organization_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    gcp_id: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "gcp_applications"
    },
    tags: Object.assign(Object.create(null), {
      implements: "Application",
      ref: ["vulnerabilities to:Vulnerability plural", "owner to:PersonOrOrganization singular"],
      refVia: ["vulnerabilities via:(id)->gcp_application_first_party_vulnerabilities(gcp_application_id);(first_party_vulnerability_id)->first_party_vulnerabilities(id)", "vulnerabilities via:(id)->gcp_application_third_party_vulnerabilities(gcp_application_id);(third_party_vulnerability_id)->third_party_vulnerabilities(id)", "owner via:people", "owner via:organizations"]
    }),
    refDefinitions: Object.assign(Object.create(null), {
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
    })
  },
  executor: executor
};
const gcpApplicationsCodec = recordCodec(spec_gcpApplications);
const singleTableItemsIdentifier = sql.identifier("polymorphic", "single_table_items");
const spec_singleTableItems = {
  name: "singleTableItems",
  identifier: singleTableItemsIdentifier,
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {}
      }
    },
    type: {
      description: undefined,
      codec: itemTypeCodec,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {}
      }
    },
    parent_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    root_topic_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    author_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    position: {
      description: undefined,
      codec: TYPES.bigint,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {}
      }
    },
    created_at: {
      description: undefined,
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {}
      }
    },
    updated_at: {
      description: undefined,
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {}
      }
    },
    is_explicitly_archived: {
      description: undefined,
      codec: TYPES.boolean,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {}
      }
    },
    archived_at: {
      description: undefined,
      codec: TYPES.timestamptz,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    title: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    description: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    note: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    color: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    },
    priority_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "single_table_items"
    },
    tags: Object.assign(Object.create(null), {
      interface: "mode:single type:type",
      type: ["TOPIC name:SingleTableTopic attributes:title!", "POST name:SingleTablePost attributes:title>subject,description,note,priority_id", "DIVIDER name:SingleTableDivider attributes:title,color", "CHECKLIST name:SingleTableChecklist attributes:title", "CHECKLIST_ITEM name:SingleTableChecklistItem attributes:description,note,priority_id"],
      ref: ["rootTopic to:SingleTableTopic singular via:(root_topic_id)->polymorphic.single_table_items(id)", "rootChecklistTopic from:SingleTableChecklist to:SingleTableTopic singular via:(root_topic_id)->polymorphic.single_table_items(id)"]
    }),
    refDefinitions: Object.assign(Object.create(null), {
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
    })
  },
  executor: executor,
  polymorphism: {
    mode: "single",
    commonAttributes: ["id", "type", "parent_id", "root_topic_id", "author_id", "position", "created_at", "updated_at", "is_explicitly_archived", "archived_at"],
    typeAttributes: ["type"],
    types: Object.assign(Object.create(null), {
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
    })
  }
};
const singleTableItemsCodec = recordCodec(spec_singleTableItems);
const relationalItemsIdentifier = sql.identifier("polymorphic", "relational_items");
const spec_relationalItems = {
  name: "relationalItems",
  identifier: relationalItemsIdentifier,
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: spec_relationalChecklists.attributes.id.extensions.tags
      }
    },
    type: {
      description: undefined,
      codec: itemTypeCodec,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: spec_relationalChecklists.attributes.type.extensions.tags
      }
    },
    parent_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: spec_relationalChecklists.attributes.parent_id.extensions.tags
      }
    },
    root_topic_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: spec_relationalChecklists.attributes.root_topic_id.extensions.tags
      }
    },
    author_id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: spec_relationalChecklists.attributes.author_id.extensions.tags
      }
    },
    position: {
      description: undefined,
      codec: TYPES.bigint,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: spec_relationalChecklists.attributes.position.extensions.tags
      }
    },
    created_at: {
      description: undefined,
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: spec_relationalChecklists.attributes.created_at.extensions.tags
      }
    },
    updated_at: {
      description: undefined,
      codec: TYPES.timestamptz,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: spec_relationalChecklists.attributes.updated_at.extensions.tags
      }
    },
    is_explicitly_archived: {
      description: undefined,
      codec: TYPES.boolean,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: spec_relationalChecklists.attributes.is_explicitly_archived.extensions.tags
      }
    },
    archived_at: {
      description: undefined,
      codec: TYPES.timestamptz,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: spec_relationalChecklists.attributes.archived_at.extensions.tags
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "relational_items"
    },
    tags: Object.assign(Object.create(null), {
      interface: "mode:relational",
      type: ["TOPIC references:relational_topics", "POST references:relational_posts", "DIVIDER references:relational_dividers", "CHECKLIST references:relational_checklists", "CHECKLIST_ITEM references:relational_checklist_items"]
    })
  },
  executor: executor,
  polymorphism: {
    mode: "relational",
    typeAttributes: ["type"],
    types: Object.assign(Object.create(null), {
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
    })
  }
};
const relationalItemsCodec = recordCodec(spec_relationalItems);
const spec_Application = {
  name: "Application",
  identifier: sql.identifier("polymorphic", "applications"),
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {
          notNull: true
        }
      }
    },
    name: {
      description: undefined,
      codec: TYPES.text,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {
          notNull: true
        }
      }
    },
    last_deployed: {
      description: undefined,
      codec: TYPES.timestamptz,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {}
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: false,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "applications"
    },
    tags: Object.assign(Object.create(null), {
      interface: "mode:union",
      name: "Application",
      behavior: "node",
      ref: ["vulnerabilities to:Vulnerability plural", "owner to:PersonOrOrganization singular"]
    }),
    refDefinitions: Object.assign(Object.create(null), {
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
    })
  },
  executor: executor,
  polymorphism: {
    mode: "union"
  }
};
const spec_Vulnerability = {
  name: "Vulnerability",
  identifier: sql.identifier("polymorphic", "vulnerabilities"),
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.int,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {
          notNull: true
        }
      }
    },
    name: {
      description: undefined,
      codec: TYPES.text,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {
          notNull: true
        }
      }
    },
    cvss_score: {
      description: undefined,
      codec: TYPES.float,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {
          notNull: true
        }
      }
    }
  }),
  description: undefined,
  extensions: {
    isTableLike: false,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "vulnerabilities"
    },
    tags: Object.assign(Object.create(null), {
      interface: "mode:union",
      name: "Vulnerability",
      behavior: "node",
      ref: ["applications to:Application plural", "owners to:PersonOrOrganization plural"]
    }),
    refDefinitions: Object.assign(Object.create(null), {
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
    })
  },
  executor: executor,
  polymorphism: {
    mode: "union"
  }
};
const spec_ZeroImplementation = {
  name: "ZeroImplementation",
  identifier: sql.identifier("polymorphic", "zero_implementation"),
  attributes: Object.assign(Object.create(null), {
    id: {
      description: undefined,
      codec: TYPES.int,
      notNull: false,
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
  }),
  description: undefined,
  extensions: {
    isTableLike: false,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "zero_implementation"
    },
    tags: Object.assign(Object.create(null), {
      interface: "mode:union",
      name: "ZeroImplementation",
      behavior: "node"
    })
  },
  executor: executor,
  polymorphism: {
    mode: "union"
  }
};
const registryConfig_pgResources_aws_application_first_party_vulnerabilities_aws_application_first_party_vulnerabilities = {
  executor: executor,
  name: "aws_application_first_party_vulnerabilities",
  identifier: "main.polymorphic.aws_application_first_party_vulnerabilities",
  from: awsApplicationFirstPartyVulnerabilitiesIdentifier,
  codec: awsApplicationFirstPartyVulnerabilitiesCodec,
  uniques: [{
    isPrimary: true,
    attributes: ["aws_application_id", "first_party_vulnerability_id"],
    description: undefined,
    extensions: {
      tags: Object.create(null)
    }
  }],
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "aws_application_first_party_vulnerabilities"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {
      omit: true,
      behavior: spec_awsApplicationFirstPartyVulnerabilities.extensions.tags.behavior
    }
  }
};
const registryConfig_pgResources_aws_application_third_party_vulnerabilities_aws_application_third_party_vulnerabilities = {
  executor: executor,
  name: "aws_application_third_party_vulnerabilities",
  identifier: "main.polymorphic.aws_application_third_party_vulnerabilities",
  from: awsApplicationThirdPartyVulnerabilitiesIdentifier,
  codec: awsApplicationThirdPartyVulnerabilitiesCodec,
  uniques: [{
    isPrimary: true,
    attributes: ["aws_application_id", "third_party_vulnerability_id"],
    description: undefined,
    extensions: {
      tags: Object.create(null)
    }
  }],
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "aws_application_third_party_vulnerabilities"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {
      omit: true,
      behavior: spec_awsApplicationThirdPartyVulnerabilities.extensions.tags.behavior
    }
  }
};
const registryConfig_pgResources_gcp_application_first_party_vulnerabilities_gcp_application_first_party_vulnerabilities = {
  executor: executor,
  name: "gcp_application_first_party_vulnerabilities",
  identifier: "main.polymorphic.gcp_application_first_party_vulnerabilities",
  from: gcpApplicationFirstPartyVulnerabilitiesIdentifier,
  codec: gcpApplicationFirstPartyVulnerabilitiesCodec,
  uniques: [{
    isPrimary: true,
    attributes: ["gcp_application_id", "first_party_vulnerability_id"],
    description: undefined,
    extensions: {
      tags: Object.create(null)
    }
  }],
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "gcp_application_first_party_vulnerabilities"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {
      omit: true,
      behavior: spec_gcpApplicationFirstPartyVulnerabilities.extensions.tags.behavior
    }
  }
};
const registryConfig_pgResources_gcp_application_third_party_vulnerabilities_gcp_application_third_party_vulnerabilities = {
  executor: executor,
  name: "gcp_application_third_party_vulnerabilities",
  identifier: "main.polymorphic.gcp_application_third_party_vulnerabilities",
  from: gcpApplicationThirdPartyVulnerabilitiesIdentifier,
  codec: gcpApplicationThirdPartyVulnerabilitiesCodec,
  uniques: [{
    isPrimary: true,
    attributes: ["gcp_application_id", "third_party_vulnerability_id"],
    description: undefined,
    extensions: {
      tags: Object.create(null)
    }
  }],
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "gcp_application_third_party_vulnerabilities"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {
      omit: true,
      behavior: spec_gcpApplicationThirdPartyVulnerabilities.extensions.tags.behavior
    }
  }
};
const organizationsUniques = [{
  isPrimary: true,
  attributes: ["organization_id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}, {
  isPrimary: false,
  attributes: ["name"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_organizations_organizations = {
  executor: executor,
  name: "organizations",
  identifier: "main.polymorphic.organizations",
  from: organizationsIdentifier,
  codec: organizationsCodec,
  uniques: organizationsUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "organizations"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {
      unionMember: "PersonOrOrganization"
    }
  }
};
const peopleUniques = [{
  isPrimary: true,
  attributes: ["person_id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}, {
  isPrimary: false,
  attributes: ["username"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_people_people = {
  executor: executor,
  name: "people",
  identifier: "main.polymorphic.people",
  from: peopleIdentifier,
  codec: peopleCodec,
  uniques: peopleUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "people"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {
      unionMember: "PersonOrOrganization",
      ref: "applications to:Application",
      refVia: spec_people.extensions.tags.refVia
    }
  }
};
const registryConfig_pgResources_priorities_priorities = {
  executor: executor,
  name: "priorities",
  identifier: "main.polymorphic.priorities",
  from: prioritiesIdentifier,
  codec: prioritiesCodec,
  uniques: [{
    isPrimary: true,
    attributes: ["id"],
    description: undefined,
    extensions: {
      tags: Object.create(null)
    }
  }],
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "priorities"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {
      omit: "create,update,delete,filter,order",
      behavior: spec_priorities.extensions.tags.behavior
    }
  }
};
const relational_checklistsUniques = [{
  isPrimary: true,
  attributes: ["checklist_item_id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_relational_checklists_relational_checklists = {
  executor: executor,
  name: "relational_checklists",
  identifier: "main.polymorphic.relational_checklists",
  from: relationalChecklistsIdentifier,
  codec: relationalChecklistsCodec,
  uniques: relational_checklistsUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "relational_checklists"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {}
  }
};
const relational_item_relation_composite_pksUniques = [{
  isPrimary: true,
  attributes: ["parent_id", "child_id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_relational_item_relation_composite_pks_relational_item_relation_composite_pks = {
  executor: executor,
  name: "relational_item_relation_composite_pks",
  identifier: "main.polymorphic.relational_item_relation_composite_pks",
  from: relationalItemRelationCompositePksIdentifier,
  codec: relationalItemRelationCompositePksCodec,
  uniques: relational_item_relation_composite_pksUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "relational_item_relation_composite_pks"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {}
  }
};
const relational_topicsUniques = [{
  isPrimary: true,
  attributes: ["topic_item_id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_relational_topics_relational_topics = {
  executor: executor,
  name: "relational_topics",
  identifier: "main.polymorphic.relational_topics",
  from: relationalTopicsIdentifier,
  codec: relationalTopicsCodec,
  uniques: relational_topicsUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "relational_topics"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {}
  }
};
const single_table_item_relation_composite_pksUniques = [{
  isPrimary: true,
  attributes: ["parent_id", "child_id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_single_table_item_relation_composite_pks_single_table_item_relation_composite_pks = {
  executor: executor,
  name: "single_table_item_relation_composite_pks",
  identifier: "main.polymorphic.single_table_item_relation_composite_pks",
  from: singleTableItemRelationCompositePksIdentifier,
  codec: singleTableItemRelationCompositePksCodec,
  uniques: single_table_item_relation_composite_pksUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "single_table_item_relation_composite_pks"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {}
  }
};
const relational_checklist_itemsUniques = [{
  isPrimary: true,
  attributes: ["checklist_item_item_id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_relational_checklist_items_relational_checklist_items = {
  executor: executor,
  name: "relational_checklist_items",
  identifier: "main.polymorphic.relational_checklist_items",
  from: relationalChecklistItemsIdentifier,
  codec: relationalChecklistItemsCodec,
  uniques: relational_checklist_itemsUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "relational_checklist_items"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {}
  }
};
const relational_dividersUniques = [{
  isPrimary: true,
  attributes: ["divider_item_id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_relational_dividers_relational_dividers = {
  executor: executor,
  name: "relational_dividers",
  identifier: "main.polymorphic.relational_dividers",
  from: relationalDividersIdentifier,
  codec: relationalDividersCodec,
  uniques: relational_dividersUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "relational_dividers"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {}
  }
};
const relational_item_relationsUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}, {
  isPrimary: false,
  attributes: ["parent_id", "child_id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_relational_item_relations_relational_item_relations = {
  executor: executor,
  name: "relational_item_relations",
  identifier: "main.polymorphic.relational_item_relations",
  from: relationalItemRelationsIdentifier,
  codec: relationalItemRelationsCodec,
  uniques: relational_item_relationsUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "relational_item_relations"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {}
  }
};
const single_table_item_relationsUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}, {
  isPrimary: false,
  attributes: ["parent_id", "child_id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_single_table_item_relations_single_table_item_relations = {
  executor: executor,
  name: "single_table_item_relations",
  identifier: "main.polymorphic.single_table_item_relations",
  from: singleTableItemRelationsIdentifier,
  codec: singleTableItemRelationsCodec,
  uniques: single_table_item_relationsUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "single_table_item_relations"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {}
  }
};
const log_entriesUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_log_entries_log_entries = {
  executor: executor,
  name: "log_entries",
  identifier: "main.polymorphic.log_entries",
  from: logEntriesIdentifier,
  codec: logEntriesCodec,
  uniques: log_entriesUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "log_entries"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {
      ref: "author to:PersonOrOrganization singular",
      refVia: spec_logEntries.extensions.tags.refVia
    }
  }
};
const relational_postsUniques = [{
  isPrimary: true,
  attributes: ["post_item_id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_relational_posts_relational_posts = {
  executor: executor,
  name: "relational_posts",
  identifier: "main.polymorphic.relational_posts",
  from: relationalPostsIdentifier,
  codec: relationalPostsCodec,
  uniques: relational_postsUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "relational_posts"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {}
  }
};
const first_party_vulnerabilitiesUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_first_party_vulnerabilities_first_party_vulnerabilities = {
  executor: executor,
  name: "first_party_vulnerabilities",
  identifier: "main.polymorphic.first_party_vulnerabilities",
  from: firstPartyVulnerabilitiesIdentifier,
  codec: firstPartyVulnerabilitiesCodec,
  uniques: first_party_vulnerabilitiesUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "first_party_vulnerabilities"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {
      implements: "Vulnerability",
      ref: spec_firstPartyVulnerabilities.extensions.tags.ref,
      refVia: spec_firstPartyVulnerabilities.extensions.tags.refVia
    }
  }
};
const third_party_vulnerabilitiesUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_third_party_vulnerabilities_third_party_vulnerabilities = {
  executor: executor,
  name: "third_party_vulnerabilities",
  identifier: "main.polymorphic.third_party_vulnerabilities",
  from: thirdPartyVulnerabilitiesIdentifier,
  codec: thirdPartyVulnerabilitiesCodec,
  uniques: third_party_vulnerabilitiesUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "third_party_vulnerabilities"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {
      implements: "Vulnerability",
      ref: spec_thirdPartyVulnerabilities.extensions.tags.ref,
      refVia: spec_thirdPartyVulnerabilities.extensions.tags.refVia
    }
  }
};
const aws_applicationsUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_aws_applications_aws_applications = {
  executor: executor,
  name: "aws_applications",
  identifier: "main.polymorphic.aws_applications",
  from: awsApplicationsIdentifier,
  codec: awsApplicationsCodec,
  uniques: aws_applicationsUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "aws_applications"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {
      implements: "Application",
      ref: spec_awsApplications.extensions.tags.ref,
      refVia: spec_awsApplications.extensions.tags.refVia
    }
  }
};
const gcp_applicationsUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_gcp_applications_gcp_applications = {
  executor: executor,
  name: "gcp_applications",
  identifier: "main.polymorphic.gcp_applications",
  from: gcpApplicationsIdentifier,
  codec: gcpApplicationsCodec,
  uniques: gcp_applicationsUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "gcp_applications"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {
      implements: "Application",
      ref: spec_gcpApplications.extensions.tags.ref,
      refVia: spec_gcpApplications.extensions.tags.refVia
    }
  }
};
const custom_delete_relational_itemFunctionIdentifer = sql.identifier("polymorphic", "custom_delete_relational_item");
const single_table_itemsUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_single_table_items_single_table_items = {
  executor: executor,
  name: "single_table_items",
  identifier: "main.polymorphic.single_table_items",
  from: singleTableItemsIdentifier,
  codec: singleTableItemsCodec,
  uniques: single_table_itemsUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "single_table_items"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {
      interface: "mode:single type:type",
      type: spec_singleTableItems.extensions.tags.type,
      ref: spec_singleTableItems.extensions.tags.ref
    }
  }
};
const all_single_tablesFunctionIdentifer = sql.identifier("polymorphic", "all_single_tables");
const get_single_table_topic_by_idFunctionIdentifer = sql.identifier("polymorphic", "get_single_table_topic_by_id");
const relational_itemsUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: Object.create(null)
  }
}];
const registryConfig_pgResources_relational_items_relational_items = {
  executor: executor,
  name: "relational_items",
  identifier: "main.polymorphic.relational_items",
  from: relationalItemsIdentifier,
  codec: relationalItemsCodec,
  uniques: relational_itemsUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "relational_items"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {
      interface: "mode:relational",
      type: spec_relationalItems.extensions.tags.type
    }
  }
};
const registryConfig = {
  pgExecutors: Object.assign(Object.create(null), {
    main: executor
  }),
  pgCodecs: Object.assign(Object.create(null), {
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
    awsApplications: awsApplicationsCodec,
    timestamptz: TYPES.timestamptz,
    gcpApplications: gcpApplicationsCodec,
    bool: TYPES.boolean,
    singleTableItems: singleTableItemsCodec,
    itemType: itemTypeCodec,
    int8: TYPES.bigint,
    relationalItems: relationalItemsCodec,
    varchar: TYPES.varchar,
    bpchar: TYPES.bpchar,
    Application: recordCodec(spec_Application),
    Vulnerability: recordCodec(spec_Vulnerability),
    ZeroImplementation: recordCodec(spec_ZeroImplementation)
  }),
  pgResources: Object.assign(Object.create(null), {
    aws_application_first_party_vulnerabilities: registryConfig_pgResources_aws_application_first_party_vulnerabilities_aws_application_first_party_vulnerabilities,
    aws_application_third_party_vulnerabilities: registryConfig_pgResources_aws_application_third_party_vulnerabilities_aws_application_third_party_vulnerabilities,
    gcp_application_first_party_vulnerabilities: registryConfig_pgResources_gcp_application_first_party_vulnerabilities_gcp_application_first_party_vulnerabilities,
    gcp_application_third_party_vulnerabilities: registryConfig_pgResources_gcp_application_third_party_vulnerabilities_gcp_application_third_party_vulnerabilities,
    organizations: registryConfig_pgResources_organizations_organizations,
    people: registryConfig_pgResources_people_people,
    priorities: registryConfig_pgResources_priorities_priorities,
    relational_checklists: registryConfig_pgResources_relational_checklists_relational_checklists,
    relational_item_relation_composite_pks: registryConfig_pgResources_relational_item_relation_composite_pks_relational_item_relation_composite_pks,
    relational_topics: registryConfig_pgResources_relational_topics_relational_topics,
    single_table_item_relation_composite_pks: registryConfig_pgResources_single_table_item_relation_composite_pks_single_table_item_relation_composite_pks,
    relational_checklist_items: registryConfig_pgResources_relational_checklist_items_relational_checklist_items,
    relational_dividers: registryConfig_pgResources_relational_dividers_relational_dividers,
    relational_item_relations: registryConfig_pgResources_relational_item_relations_relational_item_relations,
    single_table_item_relations: registryConfig_pgResources_single_table_item_relations_single_table_item_relations,
    log_entries: registryConfig_pgResources_log_entries_log_entries,
    relational_posts: registryConfig_pgResources_relational_posts_relational_posts,
    first_party_vulnerabilities: registryConfig_pgResources_first_party_vulnerabilities_first_party_vulnerabilities,
    third_party_vulnerabilities: registryConfig_pgResources_third_party_vulnerabilities_third_party_vulnerabilities,
    aws_applications: registryConfig_pgResources_aws_applications_aws_applications,
    gcp_applications: registryConfig_pgResources_gcp_applications_gcp_applications,
    custom_delete_relational_item: {
      executor,
      name: "custom_delete_relational_item",
      identifier: "main.polymorphic.custom_delete_relational_item(polymorphic.relational_items)",
      from(...args) {
        return sql`${custom_delete_relational_itemFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "nodeId",
        required: true,
        notNull: false,
        codec: relationalItemsCodec,
        extensions: {
          variant: "nodeId"
        }
      }],
      isUnique: !false,
      codec: TYPES.boolean,
      uniques: [],
      isMutation: true,
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
      description: undefined
    },
    single_table_items: registryConfig_pgResources_single_table_items_single_table_items,
    all_single_tables: PgResource.functionResourceOptions(registryConfig_pgResources_single_table_items_single_table_items, {
      name: "all_single_tables",
      identifier: "main.polymorphic.all_single_tables()",
      from(...args) {
        return sql`${all_single_tablesFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsArray: false,
      returnsSetof: true,
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "polymorphic",
          name: "all_single_tables"
        },
        tags: {}
      },
      description: undefined
    }),
    get_single_table_topic_by_id: PgResource.functionResourceOptions(registryConfig_pgResources_single_table_items_single_table_items, {
      name: "get_single_table_topic_by_id",
      identifier: "main.polymorphic.get_single_table_topic_by_id(int4)",
      from(...args) {
        return sql`${get_single_table_topic_by_idFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "id",
        required: true,
        notNull: false,
        codec: TYPES.int
      }],
      returnsArray: false,
      returnsSetof: false,
      isMutation: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "polymorphic",
          name: "get_single_table_topic_by_id"
        },
        tags: {
          returnType: "SingleTableTopic"
        }
      },
      description: undefined
    }),
    relational_items: registryConfig_pgResources_relational_items_relational_items
  }),
  pgRelations: Object.assign(Object.create(null), {
    awsApplicationFirstPartyVulnerabilities: Object.assign(Object.create(null), {
      firstPartyVulnerabilitiesByMyFirstPartyVulnerabilityId: {
        localCodec: awsApplicationFirstPartyVulnerabilitiesCodec,
        remoteResourceOptions: registryConfig_pgResources_first_party_vulnerabilities_first_party_vulnerabilities,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["first_party_vulnerability_id"],
        remoteAttributes: ["id"],
        isUnique: true,
        isReferencee: false,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      awsApplicationsByMyAwsApplicationId: {
        localCodec: awsApplicationFirstPartyVulnerabilitiesCodec,
        remoteResourceOptions: registryConfig_pgResources_aws_applications_aws_applications,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["aws_application_id"],
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
    }),
    awsApplicationThirdPartyVulnerabilities: Object.assign(Object.create(null), {
      thirdPartyVulnerabilitiesByMyThirdPartyVulnerabilityId: {
        localCodec: awsApplicationThirdPartyVulnerabilitiesCodec,
        remoteResourceOptions: registryConfig_pgResources_third_party_vulnerabilities_third_party_vulnerabilities,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["third_party_vulnerability_id"],
        remoteAttributes: ["id"],
        isUnique: true,
        isReferencee: false,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      awsApplicationsByMyAwsApplicationId: {
        localCodec: awsApplicationThirdPartyVulnerabilitiesCodec,
        remoteResourceOptions: registryConfig_pgResources_aws_applications_aws_applications,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["aws_application_id"],
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
    }),
    awsApplications: Object.assign(Object.create(null), {
      organizationsByMyOrganizationId: {
        localCodec: awsApplicationsCodec,
        remoteResourceOptions: registryConfig_pgResources_organizations_organizations,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["organization_id"],
        remoteAttributes: ["organization_id"],
        isUnique: true,
        isReferencee: false,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      peopleByMyPersonId: {
        localCodec: awsApplicationsCodec,
        remoteResourceOptions: registryConfig_pgResources_people_people,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["person_id"],
        remoteAttributes: ["person_id"],
        isUnique: true,
        isReferencee: false,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      awsApplicationFirstPartyVulnerabilitiesByTheirAwsApplicationId: {
        localCodec: awsApplicationsCodec,
        remoteResourceOptions: registryConfig_pgResources_aws_application_first_party_vulnerabilities_aws_application_first_party_vulnerabilities,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["aws_application_id"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      awsApplicationThirdPartyVulnerabilitiesByTheirAwsApplicationId: {
        localCodec: awsApplicationsCodec,
        remoteResourceOptions: registryConfig_pgResources_aws_application_third_party_vulnerabilities_aws_application_third_party_vulnerabilities,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["aws_application_id"],
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
    firstPartyVulnerabilities: Object.assign(Object.create(null), {
      awsApplicationFirstPartyVulnerabilitiesByTheirFirstPartyVulnerabilityId: {
        localCodec: firstPartyVulnerabilitiesCodec,
        remoteResourceOptions: registryConfig_pgResources_aws_application_first_party_vulnerabilities_aws_application_first_party_vulnerabilities,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["first_party_vulnerability_id"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      gcpApplicationFirstPartyVulnerabilitiesByTheirFirstPartyVulnerabilityId: {
        localCodec: firstPartyVulnerabilitiesCodec,
        remoteResourceOptions: registryConfig_pgResources_gcp_application_first_party_vulnerabilities_gcp_application_first_party_vulnerabilities,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["first_party_vulnerability_id"],
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
    gcpApplicationFirstPartyVulnerabilities: Object.assign(Object.create(null), {
      firstPartyVulnerabilitiesByMyFirstPartyVulnerabilityId: {
        localCodec: gcpApplicationFirstPartyVulnerabilitiesCodec,
        remoteResourceOptions: registryConfig_pgResources_first_party_vulnerabilities_first_party_vulnerabilities,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["first_party_vulnerability_id"],
        remoteAttributes: ["id"],
        isUnique: true,
        isReferencee: false,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      gcpApplicationsByMyGcpApplicationId: {
        localCodec: gcpApplicationFirstPartyVulnerabilitiesCodec,
        remoteResourceOptions: registryConfig_pgResources_gcp_applications_gcp_applications,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["gcp_application_id"],
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
    }),
    gcpApplicationThirdPartyVulnerabilities: Object.assign(Object.create(null), {
      thirdPartyVulnerabilitiesByMyThirdPartyVulnerabilityId: {
        localCodec: gcpApplicationThirdPartyVulnerabilitiesCodec,
        remoteResourceOptions: registryConfig_pgResources_third_party_vulnerabilities_third_party_vulnerabilities,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["third_party_vulnerability_id"],
        remoteAttributes: ["id"],
        isUnique: true,
        isReferencee: false,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      gcpApplicationsByMyGcpApplicationId: {
        localCodec: gcpApplicationThirdPartyVulnerabilitiesCodec,
        remoteResourceOptions: registryConfig_pgResources_gcp_applications_gcp_applications,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["gcp_application_id"],
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
    }),
    gcpApplications: Object.assign(Object.create(null), {
      organizationsByMyOrganizationId: {
        localCodec: gcpApplicationsCodec,
        remoteResourceOptions: registryConfig_pgResources_organizations_organizations,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["organization_id"],
        remoteAttributes: ["organization_id"],
        isUnique: true,
        isReferencee: false,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      peopleByMyPersonId: {
        localCodec: gcpApplicationsCodec,
        remoteResourceOptions: registryConfig_pgResources_people_people,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["person_id"],
        remoteAttributes: ["person_id"],
        isUnique: true,
        isReferencee: false,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      gcpApplicationFirstPartyVulnerabilitiesByTheirGcpApplicationId: {
        localCodec: gcpApplicationsCodec,
        remoteResourceOptions: registryConfig_pgResources_gcp_application_first_party_vulnerabilities_gcp_application_first_party_vulnerabilities,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["gcp_application_id"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      gcpApplicationThirdPartyVulnerabilitiesByTheirGcpApplicationId: {
        localCodec: gcpApplicationsCodec,
        remoteResourceOptions: registryConfig_pgResources_gcp_application_third_party_vulnerabilities_gcp_application_third_party_vulnerabilities,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["gcp_application_id"],
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
    logEntries: Object.assign(Object.create(null), {
      organizationsByMyOrganizationId: {
        localCodec: logEntriesCodec,
        remoteResourceOptions: registryConfig_pgResources_organizations_organizations,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["organization_id"],
        remoteAttributes: ["organization_id"],
        isUnique: true,
        isReferencee: false,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      peopleByMyPersonId: {
        localCodec: logEntriesCodec,
        remoteResourceOptions: registryConfig_pgResources_people_people,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["person_id"],
        remoteAttributes: ["person_id"],
        isUnique: true,
        isReferencee: false,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      }
    }),
    organizations: Object.assign(Object.create(null), {
      logEntriesByTheirOrganizationId: {
        localCodec: organizationsCodec,
        remoteResourceOptions: registryConfig_pgResources_log_entries_log_entries,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["organization_id"],
        remoteAttributes: ["organization_id"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      awsApplicationsByTheirOrganizationId: {
        localCodec: organizationsCodec,
        remoteResourceOptions: registryConfig_pgResources_aws_applications_aws_applications,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["organization_id"],
        remoteAttributes: ["organization_id"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      gcpApplicationsByTheirOrganizationId: {
        localCodec: organizationsCodec,
        remoteResourceOptions: registryConfig_pgResources_gcp_applications_gcp_applications,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["organization_id"],
        remoteAttributes: ["organization_id"],
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
    people: Object.assign(Object.create(null), {
      logEntriesByTheirPersonId: {
        localCodec: peopleCodec,
        remoteResourceOptions: registryConfig_pgResources_log_entries_log_entries,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["person_id"],
        remoteAttributes: ["person_id"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      singleTableItemsByTheirAuthorId: {
        localCodec: peopleCodec,
        remoteResourceOptions: registryConfig_pgResources_single_table_items_single_table_items,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["person_id"],
        remoteAttributes: ["author_id"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      relationalItemsByTheirAuthorId: {
        localCodec: peopleCodec,
        remoteResourceOptions: registryConfig_pgResources_relational_items_relational_items,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["person_id"],
        remoteAttributes: ["author_id"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      awsApplicationsByTheirPersonId: {
        localCodec: peopleCodec,
        remoteResourceOptions: registryConfig_pgResources_aws_applications_aws_applications,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["person_id"],
        remoteAttributes: ["person_id"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      gcpApplicationsByTheirPersonId: {
        localCodec: peopleCodec,
        remoteResourceOptions: registryConfig_pgResources_gcp_applications_gcp_applications,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["person_id"],
        remoteAttributes: ["person_id"],
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
    priorities: Object.assign(Object.create(null), {
      singleTableItemsByTheirPriorityId: {
        localCodec: prioritiesCodec,
        remoteResourceOptions: registryConfig_pgResources_single_table_items_single_table_items,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["priority_id"],
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
    relationalChecklistItems: Object.assign(Object.create(null), {
      relationalItemsByMyChecklistItemItemId: {
        localCodec: relationalChecklistItemsCodec,
        remoteResourceOptions: registryConfig_pgResources_relational_items_relational_items,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["checklist_item_item_id"],
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
    }),
    relationalChecklists: Object.assign(Object.create(null), {
      relationalItemsByMyChecklistItemId: {
        localCodec: relationalChecklistsCodec,
        remoteResourceOptions: registryConfig_pgResources_relational_items_relational_items,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["checklist_item_id"],
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
    }),
    relationalDividers: Object.assign(Object.create(null), {
      relationalItemsByMyDividerItemId: {
        localCodec: relationalDividersCodec,
        remoteResourceOptions: registryConfig_pgResources_relational_items_relational_items,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["divider_item_id"],
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
    }),
    relationalItemRelationCompositePks: Object.assign(Object.create(null), {
      relationalItemsByMyChildId: {
        localCodec: relationalItemRelationCompositePksCodec,
        remoteResourceOptions: registryConfig_pgResources_relational_items_relational_items,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["child_id"],
        remoteAttributes: ["id"],
        isUnique: true,
        isReferencee: false,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      relationalItemsByMyParentId: {
        localCodec: relationalItemRelationCompositePksCodec,
        remoteResourceOptions: registryConfig_pgResources_relational_items_relational_items,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["parent_id"],
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
    }),
    relationalItemRelations: Object.assign(Object.create(null), {
      relationalItemsByMyChildId: {
        localCodec: relationalItemRelationsCodec,
        remoteResourceOptions: registryConfig_pgResources_relational_items_relational_items,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["child_id"],
        remoteAttributes: ["id"],
        isUnique: true,
        isReferencee: false,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      relationalItemsByMyParentId: {
        localCodec: relationalItemRelationsCodec,
        remoteResourceOptions: registryConfig_pgResources_relational_items_relational_items,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["parent_id"],
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
    }),
    relationalItems: Object.assign(Object.create(null), {
      peopleByMyAuthorId: {
        localCodec: relationalItemsCodec,
        remoteResourceOptions: registryConfig_pgResources_people_people,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["author_id"],
        remoteAttributes: ["person_id"],
        isUnique: true,
        isReferencee: false,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      relationalItemsByMyParentId: {
        localCodec: relationalItemsCodec,
        remoteResourceOptions: registryConfig_pgResources_relational_items_relational_items,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["parent_id"],
        remoteAttributes: ["id"],
        isUnique: true,
        isReferencee: false,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      relationalTopicsByMyRootTopicId: {
        localCodec: relationalItemsCodec,
        remoteResourceOptions: registryConfig_pgResources_relational_topics_relational_topics,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["root_topic_id"],
        remoteAttributes: ["topic_item_id"],
        isUnique: true,
        isReferencee: false,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      relationalItemsByTheirParentId: {
        localCodec: relationalItemsCodec,
        remoteResourceOptions: registryConfig_pgResources_relational_items_relational_items,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["parent_id"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      relationalTopicsByTheirTopicItemId: {
        localCodec: relationalItemsCodec,
        remoteResourceOptions: registryConfig_pgResources_relational_topics_relational_topics,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["topic_item_id"],
        isUnique: true,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      relationalPostsByTheirPostItemId: {
        localCodec: relationalItemsCodec,
        remoteResourceOptions: registryConfig_pgResources_relational_posts_relational_posts,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["post_item_id"],
        isUnique: true,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      relationalDividersByTheirDividerItemId: {
        localCodec: relationalItemsCodec,
        remoteResourceOptions: registryConfig_pgResources_relational_dividers_relational_dividers,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["divider_item_id"],
        isUnique: true,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      relationalChecklistsByTheirChecklistItemId: {
        localCodec: relationalItemsCodec,
        remoteResourceOptions: registryConfig_pgResources_relational_checklists_relational_checklists,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["checklist_item_id"],
        isUnique: true,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      relationalChecklistItemsByTheirChecklistItemItemId: {
        localCodec: relationalItemsCodec,
        remoteResourceOptions: registryConfig_pgResources_relational_checklist_items_relational_checklist_items,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["checklist_item_item_id"],
        isUnique: true,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      relationalItemRelationsByTheirChildId: {
        localCodec: relationalItemsCodec,
        remoteResourceOptions: registryConfig_pgResources_relational_item_relations_relational_item_relations,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["child_id"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      relationalItemRelationsByTheirParentId: {
        localCodec: relationalItemsCodec,
        remoteResourceOptions: registryConfig_pgResources_relational_item_relations_relational_item_relations,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["parent_id"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      relationalItemRelationCompositePksByTheirChildId: {
        localCodec: relationalItemsCodec,
        remoteResourceOptions: registryConfig_pgResources_relational_item_relation_composite_pks_relational_item_relation_composite_pks,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["child_id"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      relationalItemRelationCompositePksByTheirParentId: {
        localCodec: relationalItemsCodec,
        remoteResourceOptions: registryConfig_pgResources_relational_item_relation_composite_pks_relational_item_relation_composite_pks,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["parent_id"],
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
    relationalPosts: Object.assign(Object.create(null), {
      relationalItemsByMyPostItemId: {
        localCodec: relationalPostsCodec,
        remoteResourceOptions: registryConfig_pgResources_relational_items_relational_items,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["post_item_id"],
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
    }),
    relationalTopics: Object.assign(Object.create(null), {
      relationalItemsByMyTopicItemId: {
        localCodec: relationalTopicsCodec,
        remoteResourceOptions: registryConfig_pgResources_relational_items_relational_items,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["topic_item_id"],
        remoteAttributes: ["id"],
        isUnique: true,
        isReferencee: false,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      relationalItemsByTheirRootTopicId: {
        localCodec: relationalTopicsCodec,
        remoteResourceOptions: registryConfig_pgResources_relational_items_relational_items,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["topic_item_id"],
        remoteAttributes: ["root_topic_id"],
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
    singleTableItemRelationCompositePks: Object.assign(Object.create(null), {
      singleTableItemsByMyChildId: {
        localCodec: singleTableItemRelationCompositePksCodec,
        remoteResourceOptions: registryConfig_pgResources_single_table_items_single_table_items,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["child_id"],
        remoteAttributes: ["id"],
        isUnique: true,
        isReferencee: false,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      singleTableItemsByMyParentId: {
        localCodec: singleTableItemRelationCompositePksCodec,
        remoteResourceOptions: registryConfig_pgResources_single_table_items_single_table_items,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["parent_id"],
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
    }),
    singleTableItemRelations: Object.assign(Object.create(null), {
      singleTableItemsByMyChildId: {
        localCodec: singleTableItemRelationsCodec,
        remoteResourceOptions: registryConfig_pgResources_single_table_items_single_table_items,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["child_id"],
        remoteAttributes: ["id"],
        isUnique: true,
        isReferencee: false,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      singleTableItemsByMyParentId: {
        localCodec: singleTableItemRelationsCodec,
        remoteResourceOptions: registryConfig_pgResources_single_table_items_single_table_items,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["parent_id"],
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
    }),
    singleTableItems: Object.assign(Object.create(null), {
      peopleByMyAuthorId: {
        localCodec: singleTableItemsCodec,
        remoteResourceOptions: registryConfig_pgResources_people_people,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["author_id"],
        remoteAttributes: ["person_id"],
        isUnique: true,
        isReferencee: false,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      singleTableItemsByMyParentId: {
        localCodec: singleTableItemsCodec,
        remoteResourceOptions: registryConfig_pgResources_single_table_items_single_table_items,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["parent_id"],
        remoteAttributes: ["id"],
        isUnique: true,
        isReferencee: false,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      prioritiesByMyPriorityId: {
        localCodec: singleTableItemsCodec,
        remoteResourceOptions: registryConfig_pgResources_priorities_priorities,
        localCodecPolymorphicTypes: ["POST", "CHECKLIST_ITEM"],
        localAttributes: ["priority_id"],
        remoteAttributes: ["id"],
        isUnique: true,
        isReferencee: false,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      singleTableItemsByMyRootTopicId: {
        localCodec: singleTableItemsCodec,
        remoteResourceOptions: registryConfig_pgResources_single_table_items_single_table_items,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["root_topic_id"],
        remoteAttributes: ["id"],
        isUnique: true,
        isReferencee: false,
        description: undefined,
        extensions: {
          tags: {
            behavior: ["-*"]
          }
        }
      },
      singleTableItemsByTheirParentId: {
        localCodec: singleTableItemsCodec,
        remoteResourceOptions: registryConfig_pgResources_single_table_items_single_table_items,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["parent_id"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      singleTableItemsByTheirRootTopicId: {
        localCodec: singleTableItemsCodec,
        remoteResourceOptions: registryConfig_pgResources_single_table_items_single_table_items,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["root_topic_id"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: ["-*"]
          }
        }
      },
      singleTableItemRelationsByTheirChildId: {
        localCodec: singleTableItemsCodec,
        remoteResourceOptions: registryConfig_pgResources_single_table_item_relations_single_table_item_relations,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["child_id"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      singleTableItemRelationsByTheirParentId: {
        localCodec: singleTableItemsCodec,
        remoteResourceOptions: registryConfig_pgResources_single_table_item_relations_single_table_item_relations,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["parent_id"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      singleTableItemRelationCompositePksByTheirChildId: {
        localCodec: singleTableItemsCodec,
        remoteResourceOptions: registryConfig_pgResources_single_table_item_relation_composite_pks_single_table_item_relation_composite_pks,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["child_id"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      singleTableItemRelationCompositePksByTheirParentId: {
        localCodec: singleTableItemsCodec,
        remoteResourceOptions: registryConfig_pgResources_single_table_item_relation_composite_pks_single_table_item_relation_composite_pks,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["parent_id"],
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
    thirdPartyVulnerabilities: Object.assign(Object.create(null), {
      awsApplicationThirdPartyVulnerabilitiesByTheirThirdPartyVulnerabilityId: {
        localCodec: thirdPartyVulnerabilitiesCodec,
        remoteResourceOptions: registryConfig_pgResources_aws_application_third_party_vulnerabilities_aws_application_third_party_vulnerabilities,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["third_party_vulnerability_id"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      },
      gcpApplicationThirdPartyVulnerabilitiesByTheirThirdPartyVulnerabilityId: {
        localCodec: thirdPartyVulnerabilitiesCodec,
        remoteResourceOptions: registryConfig_pgResources_gcp_application_third_party_vulnerabilities_gcp_application_third_party_vulnerabilities,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["third_party_vulnerability_id"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      }
    })
  })
};
const registry = makeRegistry(registryConfig);
const otherSource_peoplePgResource = registry.pgResources["people"];
const otherSource_single_table_itemsPgResource = registry.pgResources["single_table_items"];
const applyOrderToPlan = ($select, $value, TableOrderByType) => {
  if (!("evalLength" in $value)) {
    return;
  }
  const length = $value.evalLength();
  if (length == null) {
    return;
  }
  for (let i = 0; i < length; i++) {
    const order = $value.at(i).eval();
    if (order == null) continue;
    const config = getEnumValueConfig(TableOrderByType, order);
    const plan = config?.extensions?.grafast?.applyPlan;
    if (typeof plan !== "function") {
      console.error(`Internal server error: invalid orderBy configuration: expected function, but received ${inspect(plan)}`);
      throw new SafeError("Internal server error: invalid orderBy configuration");
    }
    plan($select);
  }
};
const otherSource_single_table_item_relationsPgResource = registry.pgResources["single_table_item_relations"];
const otherSource_single_table_item_relation_composite_pksPgResource = registry.pgResources["single_table_item_relation_composite_pks"];
const otherSource_prioritiesPgResource = registry.pgResources["priorities"];
const otherSource_relational_itemsPgResource = registry.pgResources["relational_items"];
const relational_topics_relational_topicsPgResource = registry.pgResources["relational_topics"];
const relational_item_relations_relational_item_relationsPgResource = registry.pgResources["relational_item_relations"];
const relational_item_relation_composite_pks_relational_item_relation_composite_pksPgResource = registry.pgResources["relational_item_relation_composite_pks"];
const resource_organizationsPgResource = registry.pgResources["organizations"];
const resource_relational_checklistsPgResource = registry.pgResources["relational_checklists"];
const resource_relational_checklist_itemsPgResource = registry.pgResources["relational_checklist_items"];
const resource_relational_dividersPgResource = registry.pgResources["relational_dividers"];
const resource_log_entriesPgResource = registry.pgResources["log_entries"];
const resource_relational_postsPgResource = registry.pgResources["relational_posts"];
const resource_first_party_vulnerabilitiesPgResource = registry.pgResources["first_party_vulnerabilities"];
const resource_third_party_vulnerabilitiesPgResource = registry.pgResources["third_party_vulnerabilities"];
const resource_aws_applicationsPgResource = registry.pgResources["aws_applications"];
const resource_gcp_applicationsPgResource = registry.pgResources["gcp_applications"];
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
const resource_all_single_tablesPgResource = registry.pgResources["all_single_tables"];
const getSelectPlanFromParentAndArgs = ($root, args, _info) => {
  const selectArgs = makeArgs(args);
  return resource_all_single_tablesPgResource.execute(selectArgs);
};
const argDetailsSimple2 = [{
  graphqlArgName: "id",
  postgresArgName: "id",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs2 = (args, path = []) => {
  const selectArgs = [];
  let skipped = false;
  for (let i = 0; i < 1; i++) {
    const {
      graphqlArgName,
      postgresArgName,
      pgCodec,
      required,
      fetcher
    } = argDetailsSimple2[i];
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
const resource_get_single_table_topic_by_idPgResource = registry.pgResources["get_single_table_topic_by_id"];
const members = [{
  resource: resource_first_party_vulnerabilitiesPgResource,
  typeName: "FirstPartyVulnerability"
}, {
  resource: resource_third_party_vulnerabilitiesPgResource,
  typeName: "ThirdPartyVulnerability"
}];
const resourceByTypeName = Object.assign(Object.create(null), {
  FirstPartyVulnerability: resource_first_party_vulnerabilitiesPgResource,
  ThirdPartyVulnerability: resource_third_party_vulnerabilitiesPgResource
});
const members2 = [{
  resource: resource_aws_applicationsPgResource,
  typeName: "AwsApplication"
}, {
  resource: resource_gcp_applicationsPgResource,
  typeName: "GcpApplication"
}];
const resourceByTypeName2 = Object.assign(Object.create(null), {
  AwsApplication: resource_aws_applicationsPgResource,
  GcpApplication: resource_gcp_applicationsPgResource
});
const members3 = [];
const resourceByTypeName3 = Object.create(null);
const attributes = {};
const members4 = [{
  resource: otherSource_peoplePgResource,
  typeName: "Person",
  path: []
}, {
  resource: resource_organizationsPgResource,
  typeName: "Organization",
  path: []
}];
const paths = [{
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
  resource: resource_organizationsPgResource,
  hasReferencee: false,
  isUnique: true,
  layers: [{
    relationName: "organizationsByMyOrganizationId",
    localAttributes: registryConfig.pgRelations.logEntries.organizationsByMyOrganizationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.logEntries.organizationsByMyOrganizationId.remoteAttributes,
    resource: resource_organizationsPgResource,
    isUnique: true
  }]
}];
const resourceByTypeName4 = Object.assign(Object.create(null), {
  Person: otherSource_peoplePgResource,
  Organization: resource_organizationsPgResource
});
const members5 = [{
  resource: resource_aws_applicationsPgResource,
  typeName: "AwsApplication",
  path: []
}, {
  resource: resource_gcp_applicationsPgResource,
  typeName: "GcpApplication",
  path: []
}];
const paths2 = [{
  resource: resource_aws_applicationsPgResource,
  hasReferencee: true,
  isUnique: false,
  layers: [{
    relationName: "awsApplicationsByTheirPersonId",
    localAttributes: registryConfig.pgRelations.people.awsApplicationsByTheirPersonId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.people.awsApplicationsByTheirPersonId.remoteAttributes,
    resource: resource_aws_applicationsPgResource,
    isUnique: false
  }]
}, {
  resource: resource_gcp_applicationsPgResource,
  hasReferencee: true,
  isUnique: false,
  layers: [{
    relationName: "gcpApplicationsByTheirPersonId",
    localAttributes: registryConfig.pgRelations.people.gcpApplicationsByTheirPersonId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.people.gcpApplicationsByTheirPersonId.remoteAttributes,
    resource: resource_gcp_applicationsPgResource,
    isUnique: false
  }]
}];
const resourceByTypeName5 = Object.assign(Object.create(null), {
  AwsApplication: resource_aws_applicationsPgResource,
  GcpApplication: resource_gcp_applicationsPgResource
});
function CursorSerialize(value) {
  return "" + value;
}
const members_0_resource_aws_application_first_party_vulnerabilitiesPgResource = registry.pgResources["aws_application_first_party_vulnerabilities"];
const members_1_resource_aws_application_third_party_vulnerabilitiesPgResource = registry.pgResources["aws_application_third_party_vulnerabilities"];
const members6 = [{
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
  resource: resource_first_party_vulnerabilitiesPgResource,
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
    resource: resource_first_party_vulnerabilitiesPgResource,
    isUnique: true
  }]
}, {
  resource: resource_third_party_vulnerabilitiesPgResource,
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
    resource: resource_third_party_vulnerabilitiesPgResource,
    isUnique: true
  }]
}];
const resourceByTypeName6 = Object.assign(Object.create(null), {
  FirstPartyVulnerability: resource_first_party_vulnerabilitiesPgResource,
  ThirdPartyVulnerability: resource_third_party_vulnerabilitiesPgResource
});
const attributes2 = {};
const members7 = [{
  resource: otherSource_peoplePgResource,
  typeName: "Person",
  path: []
}, {
  resource: resource_organizationsPgResource,
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
  resource: resource_organizationsPgResource,
  hasReferencee: false,
  isUnique: true,
  layers: [{
    relationName: "organizationsByMyOrganizationId",
    localAttributes: registryConfig.pgRelations.awsApplications.organizationsByMyOrganizationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.awsApplications.organizationsByMyOrganizationId.remoteAttributes,
    resource: resource_organizationsPgResource,
    isUnique: true
  }]
}];
const resourceByTypeName7 = Object.assign(Object.create(null), {
  Person: otherSource_peoplePgResource,
  Organization: resource_organizationsPgResource
});
const members_0_resource_gcp_application_first_party_vulnerabilitiesPgResource = registry.pgResources["gcp_application_first_party_vulnerabilities"];
const members_1_resource_gcp_application_third_party_vulnerabilitiesPgResource = registry.pgResources["gcp_application_third_party_vulnerabilities"];
const members8 = [{
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
  resource: resource_first_party_vulnerabilitiesPgResource,
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
    resource: resource_first_party_vulnerabilitiesPgResource,
    isUnique: true
  }]
}, {
  resource: resource_third_party_vulnerabilitiesPgResource,
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
    resource: resource_third_party_vulnerabilitiesPgResource,
    isUnique: true
  }]
}];
const resourceByTypeName8 = Object.assign(Object.create(null), {
  FirstPartyVulnerability: resource_first_party_vulnerabilitiesPgResource,
  ThirdPartyVulnerability: resource_third_party_vulnerabilitiesPgResource
});
const attributes3 = {};
const members9 = [{
  resource: otherSource_peoplePgResource,
  typeName: "Person",
  path: []
}, {
  resource: resource_organizationsPgResource,
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
  resource: resource_organizationsPgResource,
  hasReferencee: false,
  isUnique: true,
  layers: [{
    relationName: "organizationsByMyOrganizationId",
    localAttributes: registryConfig.pgRelations.gcpApplications.organizationsByMyOrganizationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.gcpApplications.organizationsByMyOrganizationId.remoteAttributes,
    resource: resource_organizationsPgResource,
    isUnique: true
  }]
}];
const resourceByTypeName9 = Object.assign(Object.create(null), {
  Person: otherSource_peoplePgResource,
  Organization: resource_organizationsPgResource
});
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
  resource: resource_aws_applicationsPgResource,
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
    resource: resource_aws_applicationsPgResource,
    isUnique: true
  }]
}, {
  resource: resource_gcp_applicationsPgResource,
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
    resource: resource_gcp_applicationsPgResource,
    isUnique: true
  }]
}];
const resourceByTypeName10 = Object.assign(Object.create(null), {
  AwsApplication: resource_aws_applicationsPgResource,
  GcpApplication: resource_gcp_applicationsPgResource
});
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
    resource: resource_aws_applicationsPgResource,
    isUnique: true
  }, {
    relationName: "peopleByMyPersonId",
    localAttributes: registryConfig.pgRelations.awsApplications.peopleByMyPersonId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.awsApplications.peopleByMyPersonId.remoteAttributes,
    resource: otherSource_peoplePgResource,
    isUnique: true
  }]
}, {
  resource: resource_organizationsPgResource,
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
    resource: resource_aws_applicationsPgResource,
    isUnique: true
  }, {
    relationName: "organizationsByMyOrganizationId",
    localAttributes: registryConfig.pgRelations.awsApplications.organizationsByMyOrganizationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.awsApplications.organizationsByMyOrganizationId.remoteAttributes,
    resource: resource_organizationsPgResource,
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
    resource: resource_gcp_applicationsPgResource,
    isUnique: true
  }, {
    relationName: "peopleByMyPersonId",
    localAttributes: registryConfig.pgRelations.gcpApplications.peopleByMyPersonId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.gcpApplications.peopleByMyPersonId.remoteAttributes,
    resource: otherSource_peoplePgResource,
    isUnique: true
  }]
}, {
  resource: resource_organizationsPgResource,
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
    resource: resource_gcp_applicationsPgResource,
    isUnique: true
  }, {
    relationName: "organizationsByMyOrganizationId",
    localAttributes: registryConfig.pgRelations.gcpApplications.organizationsByMyOrganizationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.gcpApplications.organizationsByMyOrganizationId.remoteAttributes,
    resource: resource_organizationsPgResource,
    isUnique: true
  }]
}];
const resourceByTypeName11 = Object.assign(Object.create(null), {
  Person: otherSource_peoplePgResource,
  Organization: resource_organizationsPgResource
});
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
  resource: resource_aws_applicationsPgResource,
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
    resource: resource_aws_applicationsPgResource,
    isUnique: true
  }]
}, {
  resource: resource_gcp_applicationsPgResource,
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
    resource: resource_gcp_applicationsPgResource,
    isUnique: true
  }]
}];
const resourceByTypeName12 = Object.assign(Object.create(null), {
  AwsApplication: resource_aws_applicationsPgResource,
  GcpApplication: resource_gcp_applicationsPgResource
});
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
    resource: resource_aws_applicationsPgResource,
    isUnique: true
  }, {
    relationName: "peopleByMyPersonId",
    localAttributes: registryConfig.pgRelations.awsApplications.peopleByMyPersonId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.awsApplications.peopleByMyPersonId.remoteAttributes,
    resource: otherSource_peoplePgResource,
    isUnique: true
  }]
}, {
  resource: resource_organizationsPgResource,
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
    resource: resource_aws_applicationsPgResource,
    isUnique: true
  }, {
    relationName: "organizationsByMyOrganizationId",
    localAttributes: registryConfig.pgRelations.awsApplications.organizationsByMyOrganizationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.awsApplications.organizationsByMyOrganizationId.remoteAttributes,
    resource: resource_organizationsPgResource,
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
    resource: resource_gcp_applicationsPgResource,
    isUnique: true
  }, {
    relationName: "peopleByMyPersonId",
    localAttributes: registryConfig.pgRelations.gcpApplications.peopleByMyPersonId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.gcpApplications.peopleByMyPersonId.remoteAttributes,
    resource: otherSource_peoplePgResource,
    isUnique: true
  }]
}, {
  resource: resource_organizationsPgResource,
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
    resource: resource_gcp_applicationsPgResource,
    isUnique: true
  }, {
    relationName: "organizationsByMyOrganizationId",
    localAttributes: registryConfig.pgRelations.gcpApplications.organizationsByMyOrganizationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.gcpApplications.organizationsByMyOrganizationId.remoteAttributes,
    resource: resource_organizationsPgResource,
    isUnique: true
  }]
}];
const resourceByTypeName13 = Object.assign(Object.create(null), {
  Person: otherSource_peoplePgResource,
  Organization: resource_organizationsPgResource
});
export const typeDefs = /* GraphQL */`type SingleTableTopic implements SingleTableItem {
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

    """The method to use when ordering \`SingleTableItem\`."""
    orderBy: [SingleTableItemsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: SingleTableItemCondition
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

    """The method to use when ordering \`SingleTableItemRelation\`."""
    orderBy: [SingleTableItemRelationsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: SingleTableItemRelationCondition
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

    """The method to use when ordering \`SingleTableItemRelation\`."""
    orderBy: [SingleTableItemRelationsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: SingleTableItemRelationCondition
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

    """The method to use when ordering \`SingleTableItemRelationCompositePk\`."""
    orderBy: [SingleTableItemRelationCompositePksOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: SingleTableItemRelationCompositePkCondition
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

    """The method to use when ordering \`SingleTableItemRelationCompositePk\`."""
    orderBy: [SingleTableItemRelationCompositePksOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: SingleTableItemRelationCompositePkCondition
  ): SingleTableItemRelationCompositePksConnection!

  """
  Reads a single \`SingleTableTopic\` that is related to this \`SingleTableTopic\`.
  """
  rootTopic: SingleTableTopic
}

type SingleTablePost implements SingleTableItem {
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

    """The method to use when ordering \`SingleTableItem\`."""
    orderBy: [SingleTableItemsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: SingleTableItemCondition
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

    """The method to use when ordering \`SingleTableItemRelation\`."""
    orderBy: [SingleTableItemRelationsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: SingleTableItemRelationCondition
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

    """The method to use when ordering \`SingleTableItemRelation\`."""
    orderBy: [SingleTableItemRelationsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: SingleTableItemRelationCondition
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

    """The method to use when ordering \`SingleTableItemRelationCompositePk\`."""
    orderBy: [SingleTableItemRelationCompositePksOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: SingleTableItemRelationCompositePkCondition
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

    """The method to use when ordering \`SingleTableItemRelationCompositePk\`."""
    orderBy: [SingleTableItemRelationCompositePksOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: SingleTableItemRelationCompositePkCondition
  ): SingleTableItemRelationCompositePksConnection!

  """
  Reads a single \`SingleTableTopic\` that is related to this \`SingleTablePost\`.
  """
  rootTopic: SingleTableTopic
}

type SingleTableDivider implements SingleTableItem {
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

    """The method to use when ordering \`SingleTableItem\`."""
    orderBy: [SingleTableItemsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: SingleTableItemCondition
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

    """The method to use when ordering \`SingleTableItemRelation\`."""
    orderBy: [SingleTableItemRelationsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: SingleTableItemRelationCondition
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

    """The method to use when ordering \`SingleTableItemRelation\`."""
    orderBy: [SingleTableItemRelationsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: SingleTableItemRelationCondition
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

    """The method to use when ordering \`SingleTableItemRelationCompositePk\`."""
    orderBy: [SingleTableItemRelationCompositePksOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: SingleTableItemRelationCompositePkCondition
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

    """The method to use when ordering \`SingleTableItemRelationCompositePk\`."""
    orderBy: [SingleTableItemRelationCompositePksOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: SingleTableItemRelationCompositePkCondition
  ): SingleTableItemRelationCompositePksConnection!

  """
  Reads a single \`SingleTableTopic\` that is related to this \`SingleTableDivider\`.
  """
  rootTopic: SingleTableTopic
}

type SingleTableChecklist implements SingleTableItem {
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

    """The method to use when ordering \`SingleTableItem\`."""
    orderBy: [SingleTableItemsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: SingleTableItemCondition
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

    """The method to use when ordering \`SingleTableItemRelation\`."""
    orderBy: [SingleTableItemRelationsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: SingleTableItemRelationCondition
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

    """The method to use when ordering \`SingleTableItemRelation\`."""
    orderBy: [SingleTableItemRelationsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: SingleTableItemRelationCondition
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

    """The method to use when ordering \`SingleTableItemRelationCompositePk\`."""
    orderBy: [SingleTableItemRelationCompositePksOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: SingleTableItemRelationCompositePkCondition
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

    """The method to use when ordering \`SingleTableItemRelationCompositePk\`."""
    orderBy: [SingleTableItemRelationCompositePksOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: SingleTableItemRelationCompositePkCondition
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

    """The method to use when ordering \`SingleTableItem\`."""
    orderBy: [SingleTableItemsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: SingleTableItemCondition
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

    """The method to use when ordering \`SingleTableItemRelation\`."""
    orderBy: [SingleTableItemRelationsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: SingleTableItemRelationCondition
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

    """The method to use when ordering \`SingleTableItemRelation\`."""
    orderBy: [SingleTableItemRelationsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: SingleTableItemRelationCondition
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

    """The method to use when ordering \`SingleTableItemRelationCompositePk\`."""
    orderBy: [SingleTableItemRelationCompositePksOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: SingleTableItemRelationCompositePkCondition
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

    """The method to use when ordering \`SingleTableItemRelationCompositePk\`."""
    orderBy: [SingleTableItemRelationCompositePksOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: SingleTableItemRelationCompositePkCondition
  ): SingleTableItemRelationCompositePksConnection!

  """
  Reads a single \`SingleTableTopic\` that is related to this \`SingleTableChecklistItem\`.
  """
  rootTopic: SingleTableTopic
}

type RelationalTopic implements RelationalItem {
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

    """The method to use when ordering \`RelationalItem\`."""
    orderBy: [RelationalItemsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalItemCondition
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

    """The method to use when ordering \`RelationalItem\`."""
    orderBy: [RelationalItemsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalItemCondition
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

    """The method to use when ordering \`RelationalItemRelation\`."""
    orderBy: [RelationalItemRelationsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalItemRelationCondition
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

    """The method to use when ordering \`RelationalItemRelation\`."""
    orderBy: [RelationalItemRelationsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalItemRelationCondition
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

    """The method to use when ordering \`RelationalItemRelationCompositePk\`."""
    orderBy: [RelationalItemRelationCompositePksOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalItemRelationCompositePkCondition
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

    """The method to use when ordering \`RelationalItemRelationCompositePk\`."""
    orderBy: [RelationalItemRelationCompositePksOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalItemRelationCompositePkCondition
  ): RelationalItemRelationCompositePksConnection!
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

    """The method to use when ordering \`RelationalItem\`."""
    orderBy: [RelationalItemsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalItemCondition
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

    """The method to use when ordering \`RelationalItemRelation\`."""
    orderBy: [RelationalItemRelationsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalItemRelationCondition
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

    """The method to use when ordering \`RelationalItemRelation\`."""
    orderBy: [RelationalItemRelationsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalItemRelationCondition
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

    """The method to use when ordering \`RelationalItemRelationCompositePk\`."""
    orderBy: [RelationalItemRelationCompositePksOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalItemRelationCompositePkCondition
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

    """The method to use when ordering \`RelationalItemRelationCompositePk\`."""
    orderBy: [RelationalItemRelationCompositePksOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalItemRelationCompositePkCondition
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

    """The method to use when ordering \`RelationalItem\`."""
    orderBy: [RelationalItemsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalItemCondition
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

    """The method to use when ordering \`RelationalItemRelation\`."""
    orderBy: [RelationalItemRelationsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalItemRelationCondition
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

    """The method to use when ordering \`RelationalItemRelation\`."""
    orderBy: [RelationalItemRelationsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalItemRelationCondition
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

    """The method to use when ordering \`RelationalItemRelationCompositePk\`."""
    orderBy: [RelationalItemRelationCompositePksOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalItemRelationCompositePkCondition
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

    """The method to use when ordering \`RelationalItemRelationCompositePk\`."""
    orderBy: [RelationalItemRelationCompositePksOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalItemRelationCompositePkCondition
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

    """The method to use when ordering \`RelationalItem\`."""
    orderBy: [RelationalItemsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalItemCondition
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

    """The method to use when ordering \`RelationalItemRelation\`."""
    orderBy: [RelationalItemRelationsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalItemRelationCondition
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

    """The method to use when ordering \`RelationalItemRelation\`."""
    orderBy: [RelationalItemRelationsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalItemRelationCondition
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

    """The method to use when ordering \`RelationalItemRelationCompositePk\`."""
    orderBy: [RelationalItemRelationCompositePksOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalItemRelationCompositePkCondition
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

    """The method to use when ordering \`RelationalItemRelationCompositePk\`."""
    orderBy: [RelationalItemRelationCompositePksOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalItemRelationCompositePkCondition
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

    """The method to use when ordering \`RelationalItem\`."""
    orderBy: [RelationalItemsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalItemCondition
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

    """The method to use when ordering \`RelationalItemRelation\`."""
    orderBy: [RelationalItemRelationsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalItemRelationCondition
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

    """The method to use when ordering \`RelationalItemRelation\`."""
    orderBy: [RelationalItemRelationsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalItemRelationCondition
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

    """The method to use when ordering \`RelationalItemRelationCompositePk\`."""
    orderBy: [RelationalItemRelationCompositePksOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalItemRelationCompositePkCondition
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

    """The method to use when ordering \`RelationalItemRelationCompositePk\`."""
    orderBy: [RelationalItemRelationCompositePksOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalItemRelationCompositePkCondition
  ): RelationalItemRelationCompositePksConnection!
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

  """Get a single \`FirstPartyVulnerability\`."""
  firstPartyVulnerabilityById(id: Int!): FirstPartyVulnerability

  """Get a single \`ThirdPartyVulnerability\`."""
  thirdPartyVulnerabilityById(id: Int!): ThirdPartyVulnerability

  """Get a single \`AwsApplication\`."""
  awsApplicationById(id: Int!): AwsApplication

  """Get a single \`GcpApplication\`."""
  gcpApplicationById(id: Int!): GcpApplication

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

    """The method to use when ordering \`Vulnerability\`."""
    orderBy: [VulnerabilitiesOrderBy!]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: VulnerabilityCondition

    """Filter results to only those of the given types"""
    only: [VulnerabilityType!] @deprecated(reason: "EXPERIMENTAL")
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

    """The method to use when ordering \`Application\`."""
    orderBy: [ApplicationsOrderBy!]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: ApplicationCondition

    """Filter results to only those of the given types"""
    only: [ApplicationType!] @deprecated(reason: "EXPERIMENTAL")
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

    """The method to use when ordering \`ZeroImplementation\`."""
    orderBy: [ZeroImplementationsOrderBy!]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: ZeroImplementationCondition
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

    """The method to use when ordering \`Organization\`."""
    orderBy: [OrganizationsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: OrganizationCondition
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

    """The method to use when ordering \`Person\`."""
    orderBy: [PeopleOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: PersonCondition
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

    """The method to use when ordering \`RelationalChecklist\`."""
    orderBy: [RelationalChecklistsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalChecklistCondition
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

    """The method to use when ordering \`RelationalItemRelationCompositePk\`."""
    orderBy: [RelationalItemRelationCompositePksOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalItemRelationCompositePkCondition
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

    """The method to use when ordering \`RelationalTopic\`."""
    orderBy: [RelationalTopicsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalTopicCondition
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

    """The method to use when ordering \`SingleTableItemRelationCompositePk\`."""
    orderBy: [SingleTableItemRelationCompositePksOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: SingleTableItemRelationCompositePkCondition
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

    """The method to use when ordering \`RelationalChecklistItem\`."""
    orderBy: [RelationalChecklistItemsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalChecklistItemCondition
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

    """The method to use when ordering \`RelationalDivider\`."""
    orderBy: [RelationalDividersOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalDividerCondition
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

    """The method to use when ordering \`RelationalItemRelation\`."""
    orderBy: [RelationalItemRelationsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalItemRelationCondition
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

    """The method to use when ordering \`SingleTableItemRelation\`."""
    orderBy: [SingleTableItemRelationsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: SingleTableItemRelationCondition
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

    """The method to use when ordering \`LogEntry\`."""
    orderBy: [LogEntriesOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: LogEntryCondition
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

    """The method to use when ordering \`RelationalPost\`."""
    orderBy: [RelationalPostsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalPostCondition
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

    """The method to use when ordering \`FirstPartyVulnerability\`."""
    orderBy: [FirstPartyVulnerabilitiesOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: FirstPartyVulnerabilityCondition
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

    """The method to use when ordering \`ThirdPartyVulnerability\`."""
    orderBy: [ThirdPartyVulnerabilitiesOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: ThirdPartyVulnerabilityCondition
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

    """The method to use when ordering \`AwsApplication\`."""
    orderBy: [AwsApplicationsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: AwsApplicationCondition
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

    """The method to use when ordering \`GcpApplication\`."""
    orderBy: [GcpApplicationsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: GcpApplicationCondition
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

    """The method to use when ordering \`SingleTableItem\`."""
    orderBy: [SingleTableItemsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: SingleTableItemCondition
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

    """The method to use when ordering \`RelationalItem\`."""
    orderBy: [RelationalItemsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalItemCondition
  ): RelationalItemsConnection
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

    """The method to use when ordering \`LogEntry\`."""
    orderBy: [LogEntriesOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: LogEntryCondition
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

    """The method to use when ordering \`AwsApplication\`."""
    orderBy: [AwsApplicationsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: AwsApplicationCondition
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

    """The method to use when ordering \`GcpApplication\`."""
    orderBy: [GcpApplicationsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: GcpApplicationCondition
  ): GcpApplicationsConnection!
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

    """The method to use when ordering \`LogEntry\`."""
    orderBy: [LogEntriesOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: LogEntryCondition
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

    """The method to use when ordering \`SingleTableItem\`."""
    orderBy: [SingleTableItemsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: SingleTableItemCondition
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

    """The method to use when ordering \`RelationalItem\`."""
    orderBy: [RelationalItemsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: RelationalItemCondition
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

    """The method to use when ordering \`AwsApplication\`."""
    orderBy: [AwsApplicationsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: AwsApplicationCondition
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

    """The method to use when ordering \`GcpApplication\`."""
    orderBy: [GcpApplicationsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: GcpApplicationCondition
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

    """The method to use when ordering \`Application\`."""
    orderBy: [ApplicationsOrderBy!]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: ApplicationCondition

    """Filter results to only those of the given types"""
    only: [ApplicationType!] @deprecated(reason: "EXPERIMENTAL")
  ): ApplicationsConnection!
}

"""A location in a connection that can be used for resuming pagination."""
scalar Cursor

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

"""A \`SingleTableItem\` edge in the connection."""
type SingleTableItemsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`SingleTableItem\` at the end of the edge."""
  node: SingleTableItem
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

    """The method to use when ordering \`Vulnerability\`."""
    orderBy: [VulnerabilitiesOrderBy!]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: VulnerabilityCondition

    """Filter results to only those of the given types"""
    only: [VulnerabilityType!] @deprecated(reason: "EXPERIMENTAL")
  ): VulnerabilitiesConnection!

  """
  Reads a single \`PersonOrOrganization\` that is related to this \`AwsApplication\`.
  """
  owner: PersonOrOrganization
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

"""A \`AwsApplication\` edge in the connection."""
type AwsApplicationsEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`AwsApplication\` at the end of the edge."""
  node: AwsApplication
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

    """The method to use when ordering \`Vulnerability\`."""
    orderBy: [VulnerabilitiesOrderBy!]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: VulnerabilityCondition

    """Filter results to only those of the given types"""
    only: [VulnerabilityType!] @deprecated(reason: "EXPERIMENTAL")
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

"""A \`LogEntry\` edge in the connection."""
type LogEntriesEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`LogEntry\` at the end of the edge."""
  node: LogEntry
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

    """The method to use when ordering \`SingleTableItem\`."""
    orderBy: [SingleTableItemsOrderBy!] = [PRIMARY_KEY_ASC]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: SingleTableItemCondition
  ): SingleTableItemsConnection!
}

type FirstPartyVulnerability implements Vulnerability {
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

    """The method to use when ordering \`Application\`."""
    orderBy: [ApplicationsOrderBy!]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: ApplicationCondition

    """Filter results to only those of the given types"""
    only: [ApplicationType!] @deprecated(reason: "EXPERIMENTAL")
  ): ApplicationsConnection!

  """Reads and enables pagination through a set of \`PersonOrOrganization\`."""
  owners: PersonOrOrganizationConnection!
}

type ThirdPartyVulnerability implements Vulnerability {
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

    """The method to use when ordering \`Application\`."""
    orderBy: [ApplicationsOrderBy!]

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: ApplicationCondition

    """Filter results to only those of the given types"""
    only: [ApplicationType!] @deprecated(reason: "EXPERIMENTAL")
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

"""Methods to use when ordering \`ZeroImplementation\`."""
enum ZeroImplementationsOrderBy {
  NATURAL
  ID_ASC
  ID_DESC
  NAME_ASC
  NAME_DESC
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

"""
A condition to be used against \`Person\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input PersonCondition {
  """Checks for equality with the object’s \`personId\` field."""
  personId: Int

  """Checks for equality with the object’s \`username\` field."""
  username: String
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

"""
The root mutation type which contains root level fields which mutate data.
"""
type Mutation {
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
  Updates a single \`RelationalItemRelationCompositePk\` using a unique key and a patch.
  """
  updateRelationalItemRelationCompositePkByParentIdAndChildId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateRelationalItemRelationCompositePkByParentIdAndChildIdInput!
  ): UpdateRelationalItemRelationCompositePkPayload

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

  """Updates a single \`LogEntry\` using a unique key and a patch."""
  updateLogEntryById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateLogEntryByIdInput!
  ): UpdateLogEntryPayload

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
  Updates a single \`ThirdPartyVulnerability\` using a unique key and a patch.
  """
  updateThirdPartyVulnerabilityById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateThirdPartyVulnerabilityByIdInput!
  ): UpdateThirdPartyVulnerabilityPayload

  """Updates a single \`AwsApplication\` using a unique key and a patch."""
  updateAwsApplicationById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateAwsApplicationByIdInput!
  ): UpdateAwsApplicationPayload

  """Updates a single \`GcpApplication\` using a unique key and a patch."""
  updateGcpApplicationById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateGcpApplicationByIdInput!
  ): UpdateGcpApplicationPayload

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
  Deletes a single \`RelationalItemRelationCompositePk\` using a unique key.
  """
  deleteRelationalItemRelationCompositePkByParentIdAndChildId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteRelationalItemRelationCompositePkByParentIdAndChildIdInput!
  ): DeleteRelationalItemRelationCompositePkPayload

  """
  Deletes a single \`SingleTableItemRelationCompositePk\` using a unique key.
  """
  deleteSingleTableItemRelationCompositePkByParentIdAndChildId(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteSingleTableItemRelationCompositePkByParentIdAndChildIdInput!
  ): DeleteSingleTableItemRelationCompositePkPayload

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

  """Deletes a single \`LogEntry\` using a unique key."""
  deleteLogEntryById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteLogEntryByIdInput!
  ): DeleteLogEntryPayload

  """Deletes a single \`FirstPartyVulnerability\` using a unique key."""
  deleteFirstPartyVulnerabilityById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteFirstPartyVulnerabilityByIdInput!
  ): DeleteFirstPartyVulnerabilityPayload

  """Deletes a single \`ThirdPartyVulnerability\` using a unique key."""
  deleteThirdPartyVulnerabilityById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteThirdPartyVulnerabilityByIdInput!
  ): DeleteThirdPartyVulnerabilityPayload

  """Deletes a single \`AwsApplication\` using a unique key."""
  deleteAwsApplicationById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteAwsApplicationByIdInput!
  ): DeleteAwsApplicationPayload

  """Deletes a single \`GcpApplication\` using a unique key."""
  deleteGcpApplicationById(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteGcpApplicationByIdInput!
  ): DeleteGcpApplicationPayload
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

"""
Represents an update to a \`Organization\`. Fields that are set will be updated.
"""
input OrganizationPatch {
  organizationId: Int
  name: String
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

"""
Represents an update to a \`Person\`. Fields that are set will be updated.
"""
input PersonPatch {
  personId: Int
  username: String
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
Represents an update to a \`RelationalItemRelationCompositePk\`. Fields that are set will be updated.
"""
input RelationalItemRelationCompositePkPatch {
  parentId: Int
  childId: Int
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

"""
Represents an update to a \`SingleTableItemRelationCompositePk\`. Fields that are set will be updated.
"""
input SingleTableItemRelationCompositePkPatch {
  parentId: Int
  childId: Int
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
Represents an update to a \`RelationalItemRelation\`. Fields that are set will be updated.
"""
input RelationalItemRelationPatch {
  id: Int
  parentId: Int
  childId: Int
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
Represents an update to a \`SingleTableItemRelation\`. Fields that are set will be updated.
"""
input SingleTableItemRelationPatch {
  id: Int
  parentId: Int
  childId: Int
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

"""
Represents an update to a \`LogEntry\`. Fields that are set will be updated.
"""
input LogEntryPatch {
  id: Int
  personId: Int
  organizationId: Int
  text: String
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

"""
Represents an update to a \`FirstPartyVulnerability\`. Fields that are set will be updated.
"""
input FirstPartyVulnerabilityPatch {
  id: Int
  name: String
  cvssScore: Float
  teamName: String
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

"""
Represents an update to a \`ThirdPartyVulnerability\`. Fields that are set will be updated.
"""
input ThirdPartyVulnerabilityPatch {
  id: Int
  name: String
  cvssScore: Float
  vendorName: String
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

"""The output of our delete \`Organization\` mutation."""
type DeleteOrganizationPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Organization\` that was deleted by this mutation."""
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

"""All input for the \`deleteGcpApplicationById\` mutation."""
input DeleteGcpApplicationByIdInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  id: Int!
}`;
export const plans = {
  SingleTableTopic: {
    __assertStep: assertPgClassSingleStep,
    id($record) {
      return $record.get("id");
    },
    type($record) {
      return $record.get("type");
    },
    parentId($record) {
      return $record.get("parent_id");
    },
    rootTopicId($record) {
      return $record.get("root_topic_id");
    },
    authorId($record) {
      return $record.get("author_id");
    },
    position($record) {
      return $record.get("position");
    },
    createdAt($record) {
      return $record.get("created_at");
    },
    updatedAt($record) {
      return $record.get("updated_at");
    },
    isExplicitlyArchived($record) {
      return $record.get("is_explicitly_archived");
    },
    archivedAt($record) {
      return $record.get("archived_at");
    },
    title($record) {
      return $record.get("title");
    },
    personByAuthorId($record) {
      return otherSource_peoplePgResource.get({
        person_id: $record.get("author_id")
      });
    },
    singleTableItemByParentId($record) {
      return otherSource_single_table_itemsPgResource.get({
        id: $record.get("parent_id")
      });
    },
    singleTableItemsByParentId: {
      plan($record) {
        const $records = otherSource_single_table_itemsPgResource.find({
          parent_id: $record.get("id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("SingleTableItemsOrderBy"));
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
    singleTableItemRelationsByChildId: {
      plan($record) {
        const $records = otherSource_single_table_item_relationsPgResource.find({
          child_id: $record.get("id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("SingleTableItemRelationsOrderBy"));
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
    singleTableItemRelationsByParentId: {
      plan($record) {
        const $records = otherSource_single_table_item_relationsPgResource.find({
          parent_id: $record.get("id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("SingleTableItemRelationsOrderBy"));
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
    singleTableItemRelationCompositePksByChildId: {
      plan($record) {
        const $records = otherSource_single_table_item_relation_composite_pksPgResource.find({
          child_id: $record.get("id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("SingleTableItemRelationCompositePksOrderBy"));
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
    singleTableItemRelationCompositePksByParentId: {
      plan($record) {
        const $records = otherSource_single_table_item_relation_composite_pksPgResource.find({
          parent_id: $record.get("id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("SingleTableItemRelationCompositePksOrderBy"));
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
    rootTopic($record) {
      return otherSource_single_table_itemsPgResource.get({
        id: $record.get("root_topic_id")
      });
    }
  },
  SingleTablePost: {
    __assertStep: assertPgClassSingleStep,
    id($record) {
      return $record.get("id");
    },
    type($record) {
      return $record.get("type");
    },
    parentId($record) {
      return $record.get("parent_id");
    },
    rootTopicId($record) {
      return $record.get("root_topic_id");
    },
    authorId($record) {
      return $record.get("author_id");
    },
    position($record) {
      return $record.get("position");
    },
    createdAt($record) {
      return $record.get("created_at");
    },
    updatedAt($record) {
      return $record.get("updated_at");
    },
    isExplicitlyArchived($record) {
      return $record.get("is_explicitly_archived");
    },
    archivedAt($record) {
      return $record.get("archived_at");
    },
    subject($record) {
      return $record.get("title");
    },
    description($record) {
      return $record.get("description");
    },
    note($record) {
      return $record.get("note");
    },
    priorityId($record) {
      return $record.get("priority_id");
    },
    personByAuthorId($record) {
      return otherSource_peoplePgResource.get({
        person_id: $record.get("author_id")
      });
    },
    singleTableItemByParentId($record) {
      return otherSource_single_table_itemsPgResource.get({
        id: $record.get("parent_id")
      });
    },
    priorityByPriorityId($record) {
      return otherSource_prioritiesPgResource.get({
        id: $record.get("priority_id")
      });
    },
    singleTableItemsByParentId: {
      plan($record) {
        const $records = otherSource_single_table_itemsPgResource.find({
          parent_id: $record.get("id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("SingleTableItemsOrderBy"));
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
    singleTableItemRelationsByChildId: {
      plan($record) {
        const $records = otherSource_single_table_item_relationsPgResource.find({
          child_id: $record.get("id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("SingleTableItemRelationsOrderBy"));
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
    singleTableItemRelationsByParentId: {
      plan($record) {
        const $records = otherSource_single_table_item_relationsPgResource.find({
          parent_id: $record.get("id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("SingleTableItemRelationsOrderBy"));
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
    singleTableItemRelationCompositePksByChildId: {
      plan($record) {
        const $records = otherSource_single_table_item_relation_composite_pksPgResource.find({
          child_id: $record.get("id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("SingleTableItemRelationCompositePksOrderBy"));
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
    singleTableItemRelationCompositePksByParentId: {
      plan($record) {
        const $records = otherSource_single_table_item_relation_composite_pksPgResource.find({
          parent_id: $record.get("id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("SingleTableItemRelationCompositePksOrderBy"));
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
    rootTopic($record) {
      return otherSource_single_table_itemsPgResource.get({
        id: $record.get("root_topic_id")
      });
    }
  },
  SingleTableDivider: {
    __assertStep: assertPgClassSingleStep,
    id($record) {
      return $record.get("id");
    },
    type($record) {
      return $record.get("type");
    },
    parentId($record) {
      return $record.get("parent_id");
    },
    rootTopicId($record) {
      return $record.get("root_topic_id");
    },
    authorId($record) {
      return $record.get("author_id");
    },
    position($record) {
      return $record.get("position");
    },
    createdAt($record) {
      return $record.get("created_at");
    },
    updatedAt($record) {
      return $record.get("updated_at");
    },
    isExplicitlyArchived($record) {
      return $record.get("is_explicitly_archived");
    },
    archivedAt($record) {
      return $record.get("archived_at");
    },
    title($record) {
      return $record.get("title");
    },
    color($record) {
      return $record.get("color");
    },
    personByAuthorId($record) {
      return otherSource_peoplePgResource.get({
        person_id: $record.get("author_id")
      });
    },
    singleTableItemByParentId($record) {
      return otherSource_single_table_itemsPgResource.get({
        id: $record.get("parent_id")
      });
    },
    singleTableItemsByParentId: {
      plan($record) {
        const $records = otherSource_single_table_itemsPgResource.find({
          parent_id: $record.get("id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("SingleTableItemsOrderBy"));
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
    singleTableItemRelationsByChildId: {
      plan($record) {
        const $records = otherSource_single_table_item_relationsPgResource.find({
          child_id: $record.get("id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("SingleTableItemRelationsOrderBy"));
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
    singleTableItemRelationsByParentId: {
      plan($record) {
        const $records = otherSource_single_table_item_relationsPgResource.find({
          parent_id: $record.get("id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("SingleTableItemRelationsOrderBy"));
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
    singleTableItemRelationCompositePksByChildId: {
      plan($record) {
        const $records = otherSource_single_table_item_relation_composite_pksPgResource.find({
          child_id: $record.get("id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("SingleTableItemRelationCompositePksOrderBy"));
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
    singleTableItemRelationCompositePksByParentId: {
      plan($record) {
        const $records = otherSource_single_table_item_relation_composite_pksPgResource.find({
          parent_id: $record.get("id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("SingleTableItemRelationCompositePksOrderBy"));
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
    rootTopic($record) {
      return otherSource_single_table_itemsPgResource.get({
        id: $record.get("root_topic_id")
      });
    }
  },
  SingleTableChecklist: {
    __assertStep: assertPgClassSingleStep,
    id($record) {
      return $record.get("id");
    },
    type($record) {
      return $record.get("type");
    },
    parentId($record) {
      return $record.get("parent_id");
    },
    rootTopicId($record) {
      return $record.get("root_topic_id");
    },
    authorId($record) {
      return $record.get("author_id");
    },
    position($record) {
      return $record.get("position");
    },
    createdAt($record) {
      return $record.get("created_at");
    },
    updatedAt($record) {
      return $record.get("updated_at");
    },
    isExplicitlyArchived($record) {
      return $record.get("is_explicitly_archived");
    },
    archivedAt($record) {
      return $record.get("archived_at");
    },
    title($record) {
      return $record.get("title");
    },
    personByAuthorId($record) {
      return otherSource_peoplePgResource.get({
        person_id: $record.get("author_id")
      });
    },
    singleTableItemByParentId($record) {
      return otherSource_single_table_itemsPgResource.get({
        id: $record.get("parent_id")
      });
    },
    singleTableItemsByParentId: {
      plan($record) {
        const $records = otherSource_single_table_itemsPgResource.find({
          parent_id: $record.get("id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("SingleTableItemsOrderBy"));
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
    singleTableItemRelationsByChildId: {
      plan($record) {
        const $records = otherSource_single_table_item_relationsPgResource.find({
          child_id: $record.get("id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("SingleTableItemRelationsOrderBy"));
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
    singleTableItemRelationsByParentId: {
      plan($record) {
        const $records = otherSource_single_table_item_relationsPgResource.find({
          parent_id: $record.get("id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("SingleTableItemRelationsOrderBy"));
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
    singleTableItemRelationCompositePksByChildId: {
      plan($record) {
        const $records = otherSource_single_table_item_relation_composite_pksPgResource.find({
          child_id: $record.get("id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("SingleTableItemRelationCompositePksOrderBy"));
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
    singleTableItemRelationCompositePksByParentId: {
      plan($record) {
        const $records = otherSource_single_table_item_relation_composite_pksPgResource.find({
          parent_id: $record.get("id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("SingleTableItemRelationCompositePksOrderBy"));
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
    rootTopic($record) {
      return otherSource_single_table_itemsPgResource.get({
        id: $record.get("root_topic_id")
      });
    },
    rootChecklistTopic($record) {
      return otherSource_single_table_itemsPgResource.get({
        id: $record.get("root_topic_id")
      });
    }
  },
  SingleTableChecklistItem: {
    __assertStep: assertPgClassSingleStep,
    id($record) {
      return $record.get("id");
    },
    type($record) {
      return $record.get("type");
    },
    parentId($record) {
      return $record.get("parent_id");
    },
    rootTopicId($record) {
      return $record.get("root_topic_id");
    },
    authorId($record) {
      return $record.get("author_id");
    },
    position($record) {
      return $record.get("position");
    },
    createdAt($record) {
      return $record.get("created_at");
    },
    updatedAt($record) {
      return $record.get("updated_at");
    },
    isExplicitlyArchived($record) {
      return $record.get("is_explicitly_archived");
    },
    archivedAt($record) {
      return $record.get("archived_at");
    },
    description($record) {
      return $record.get("description");
    },
    note($record) {
      return $record.get("note");
    },
    priorityId($record) {
      return $record.get("priority_id");
    },
    personByAuthorId($record) {
      return otherSource_peoplePgResource.get({
        person_id: $record.get("author_id")
      });
    },
    singleTableItemByParentId($record) {
      return otherSource_single_table_itemsPgResource.get({
        id: $record.get("parent_id")
      });
    },
    priorityByPriorityId($record) {
      return otherSource_prioritiesPgResource.get({
        id: $record.get("priority_id")
      });
    },
    singleTableItemsByParentId: {
      plan($record) {
        const $records = otherSource_single_table_itemsPgResource.find({
          parent_id: $record.get("id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("SingleTableItemsOrderBy"));
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
    singleTableItemRelationsByChildId: {
      plan($record) {
        const $records = otherSource_single_table_item_relationsPgResource.find({
          child_id: $record.get("id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("SingleTableItemRelationsOrderBy"));
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
    singleTableItemRelationsByParentId: {
      plan($record) {
        const $records = otherSource_single_table_item_relationsPgResource.find({
          parent_id: $record.get("id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("SingleTableItemRelationsOrderBy"));
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
    singleTableItemRelationCompositePksByChildId: {
      plan($record) {
        const $records = otherSource_single_table_item_relation_composite_pksPgResource.find({
          child_id: $record.get("id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("SingleTableItemRelationCompositePksOrderBy"));
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
    singleTableItemRelationCompositePksByParentId: {
      plan($record) {
        const $records = otherSource_single_table_item_relation_composite_pksPgResource.find({
          parent_id: $record.get("id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("SingleTableItemRelationCompositePksOrderBy"));
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
    rootTopic($record) {
      return otherSource_single_table_itemsPgResource.get({
        id: $record.get("root_topic_id")
      });
    }
  },
  RelationalTopic: {
    __assertStep: assertPgClassSingleStep,
    title($record) {
      return $record.get("title");
    },
    id($record) {
      return $record.get("id");
    },
    type($record) {
      return $record.get("type");
    },
    parentId($record) {
      return $record.get("parent_id");
    },
    rootTopicId($record) {
      return $record.get("root_topic_id");
    },
    authorId($record) {
      return $record.get("author_id");
    },
    position($record) {
      return $record.get("position");
    },
    createdAt($record) {
      return $record.get("created_at");
    },
    updatedAt($record) {
      return $record.get("updated_at");
    },
    isExplicitlyArchived($record) {
      return $record.get("is_explicitly_archived");
    },
    archivedAt($record) {
      return $record.get("archived_at");
    },
    relationalItemsByRootTopicId: {
      plan($record) {
        const $records = otherSource_relational_itemsPgResource.find({
          root_topic_id: $record.get("topic_item_id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("RelationalItemsOrderBy"));
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
    relationalTopicByRootTopicId($record) {
      const $relational_topics = relational_topics_relational_topicsPgResource.find();
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
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("RelationalItemsOrderBy"));
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
    relationalItemRelationsByChildId: {
      plan($record) {
        const $relational_item_relations = relational_item_relations_relational_item_relationsPgResource.find();
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
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("RelationalItemRelationsOrderBy"));
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
    relationalItemRelationsByParentId: {
      plan($record) {
        const $relational_item_relations = relational_item_relations_relational_item_relationsPgResource.find();
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
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("RelationalItemRelationsOrderBy"));
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
    relationalItemRelationCompositePksByChildId: {
      plan($record) {
        const $relational_item_relation_composite_pks = relational_item_relation_composite_pks_relational_item_relation_composite_pksPgResource.find();
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
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("RelationalItemRelationCompositePksOrderBy"));
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
    relationalItemRelationCompositePksByParentId: {
      plan($record) {
        const $relational_item_relation_composite_pks = relational_item_relation_composite_pks_relational_item_relation_composite_pksPgResource.find();
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
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("RelationalItemRelationCompositePksOrderBy"));
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
  RelationalPost: {
    __assertStep: assertPgClassSingleStep,
    title($record) {
      return $record.get("title");
    },
    description($record) {
      return $record.get("description");
    },
    note($record) {
      return $record.get("note");
    },
    id($record) {
      return $record.get("id");
    },
    type($record) {
      return $record.get("type");
    },
    parentId($record) {
      return $record.get("parent_id");
    },
    rootTopicId($record) {
      return $record.get("root_topic_id");
    },
    authorId($record) {
      return $record.get("author_id");
    },
    position($record) {
      return $record.get("position");
    },
    createdAt($record) {
      return $record.get("created_at");
    },
    updatedAt($record) {
      return $record.get("updated_at");
    },
    isExplicitlyArchived($record) {
      return $record.get("is_explicitly_archived");
    },
    archivedAt($record) {
      return $record.get("archived_at");
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
    relationalTopicByRootTopicId($record) {
      const $relational_topics = relational_topics_relational_topicsPgResource.find();
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
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("RelationalItemsOrderBy"));
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
    relationalItemRelationsByChildId: {
      plan($record) {
        const $relational_item_relations = relational_item_relations_relational_item_relationsPgResource.find();
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
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("RelationalItemRelationsOrderBy"));
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
    relationalItemRelationsByParentId: {
      plan($record) {
        const $relational_item_relations = relational_item_relations_relational_item_relationsPgResource.find();
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
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("RelationalItemRelationsOrderBy"));
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
    relationalItemRelationCompositePksByChildId: {
      plan($record) {
        const $relational_item_relation_composite_pks = relational_item_relation_composite_pks_relational_item_relation_composite_pksPgResource.find();
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
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("RelationalItemRelationCompositePksOrderBy"));
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
    relationalItemRelationCompositePksByParentId: {
      plan($record) {
        const $relational_item_relation_composite_pks = relational_item_relation_composite_pks_relational_item_relation_composite_pksPgResource.find();
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
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("RelationalItemRelationCompositePksOrderBy"));
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
  RelationalDivider: {
    __assertStep: assertPgClassSingleStep,
    title($record) {
      return $record.get("title");
    },
    color($record) {
      return $record.get("color");
    },
    id($record) {
      return $record.get("id");
    },
    type($record) {
      return $record.get("type");
    },
    parentId($record) {
      return $record.get("parent_id");
    },
    rootTopicId($record) {
      return $record.get("root_topic_id");
    },
    authorId($record) {
      return $record.get("author_id");
    },
    position($record) {
      return $record.get("position");
    },
    createdAt($record) {
      return $record.get("created_at");
    },
    updatedAt($record) {
      return $record.get("updated_at");
    },
    isExplicitlyArchived($record) {
      return $record.get("is_explicitly_archived");
    },
    archivedAt($record) {
      return $record.get("archived_at");
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
    relationalTopicByRootTopicId($record) {
      const $relational_topics = relational_topics_relational_topicsPgResource.find();
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
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("RelationalItemsOrderBy"));
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
    relationalItemRelationsByChildId: {
      plan($record) {
        const $relational_item_relations = relational_item_relations_relational_item_relationsPgResource.find();
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
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("RelationalItemRelationsOrderBy"));
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
    relationalItemRelationsByParentId: {
      plan($record) {
        const $relational_item_relations = relational_item_relations_relational_item_relationsPgResource.find();
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
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("RelationalItemRelationsOrderBy"));
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
    relationalItemRelationCompositePksByChildId: {
      plan($record) {
        const $relational_item_relation_composite_pks = relational_item_relation_composite_pks_relational_item_relation_composite_pksPgResource.find();
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
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("RelationalItemRelationCompositePksOrderBy"));
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
    relationalItemRelationCompositePksByParentId: {
      plan($record) {
        const $relational_item_relation_composite_pks = relational_item_relation_composite_pks_relational_item_relation_composite_pksPgResource.find();
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
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("RelationalItemRelationCompositePksOrderBy"));
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
  RelationalChecklist: {
    __assertStep: assertPgClassSingleStep,
    title($record) {
      return $record.get("title");
    },
    id($record) {
      return $record.get("id");
    },
    type($record) {
      return $record.get("type");
    },
    parentId($record) {
      return $record.get("parent_id");
    },
    rootTopicId($record) {
      return $record.get("root_topic_id");
    },
    authorId($record) {
      return $record.get("author_id");
    },
    position($record) {
      return $record.get("position");
    },
    createdAt($record) {
      return $record.get("created_at");
    },
    updatedAt($record) {
      return $record.get("updated_at");
    },
    isExplicitlyArchived($record) {
      return $record.get("is_explicitly_archived");
    },
    archivedAt($record) {
      return $record.get("archived_at");
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
    relationalTopicByRootTopicId($record) {
      const $relational_topics = relational_topics_relational_topicsPgResource.find();
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
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("RelationalItemsOrderBy"));
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
    relationalItemRelationsByChildId: {
      plan($record) {
        const $relational_item_relations = relational_item_relations_relational_item_relationsPgResource.find();
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
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("RelationalItemRelationsOrderBy"));
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
    relationalItemRelationsByParentId: {
      plan($record) {
        const $relational_item_relations = relational_item_relations_relational_item_relationsPgResource.find();
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
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("RelationalItemRelationsOrderBy"));
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
    relationalItemRelationCompositePksByChildId: {
      plan($record) {
        const $relational_item_relation_composite_pks = relational_item_relation_composite_pks_relational_item_relation_composite_pksPgResource.find();
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
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("RelationalItemRelationCompositePksOrderBy"));
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
    relationalItemRelationCompositePksByParentId: {
      plan($record) {
        const $relational_item_relation_composite_pks = relational_item_relation_composite_pks_relational_item_relation_composite_pksPgResource.find();
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
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("RelationalItemRelationCompositePksOrderBy"));
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
  RelationalChecklistItem: {
    __assertStep: assertPgClassSingleStep,
    description($record) {
      return $record.get("description");
    },
    note($record) {
      return $record.get("note");
    },
    id($record) {
      return $record.get("id");
    },
    type($record) {
      return $record.get("type");
    },
    parentId($record) {
      return $record.get("parent_id");
    },
    rootTopicId($record) {
      return $record.get("root_topic_id");
    },
    authorId($record) {
      return $record.get("author_id");
    },
    position($record) {
      return $record.get("position");
    },
    createdAt($record) {
      return $record.get("created_at");
    },
    updatedAt($record) {
      return $record.get("updated_at");
    },
    isExplicitlyArchived($record) {
      return $record.get("is_explicitly_archived");
    },
    archivedAt($record) {
      return $record.get("archived_at");
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
    relationalTopicByRootTopicId($record) {
      const $relational_topics = relational_topics_relational_topicsPgResource.find();
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
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("RelationalItemsOrderBy"));
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
    relationalItemRelationsByChildId: {
      plan($record) {
        const $relational_item_relations = relational_item_relations_relational_item_relationsPgResource.find();
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
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("RelationalItemRelationsOrderBy"));
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
    relationalItemRelationsByParentId: {
      plan($record) {
        const $relational_item_relations = relational_item_relations_relational_item_relationsPgResource.find();
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
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("RelationalItemRelationsOrderBy"));
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
    relationalItemRelationCompositePksByChildId: {
      plan($record) {
        const $relational_item_relation_composite_pks = relational_item_relation_composite_pks_relational_item_relation_composite_pksPgResource.find();
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
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("RelationalItemRelationCompositePksOrderBy"));
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
    relationalItemRelationCompositePksByParentId: {
      plan($record) {
        const $relational_item_relation_composite_pks = relational_item_relation_composite_pks_relational_item_relation_composite_pksPgResource.find();
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
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("RelationalItemRelationCompositePksOrderBy"));
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
  Query: {
    __assertStep() {
      return true;
    },
    query() {
      return rootValue();
    },
    organizationByOrganizationId: {
      plan(_$root, args) {
        return resource_organizationsPgResource.get({
          organization_id: args.get("organizationId")
        });
      },
      args: {
        organizationId: undefined
      }
    },
    organizationByName: {
      plan(_$root, args) {
        return resource_organizationsPgResource.get({
          name: args.get("name")
        });
      },
      args: {
        name: undefined
      }
    },
    personByPersonId: {
      plan(_$root, args) {
        return otherSource_peoplePgResource.get({
          person_id: args.get("personId")
        });
      },
      args: {
        personId: undefined
      }
    },
    personByUsername: {
      plan(_$root, args) {
        return otherSource_peoplePgResource.get({
          username: args.get("username")
        });
      },
      args: {
        username: undefined
      }
    },
    priorityById: {
      plan(_$root, args) {
        return otherSource_prioritiesPgResource.get({
          id: args.get("id")
        });
      },
      args: {
        id: undefined
      }
    },
    relationalChecklistByChecklistItemId: {
      plan(_$root, args) {
        return resource_relational_checklistsPgResource.get({
          checklist_item_id: args.get("checklistItemId")
        });
      },
      args: {
        checklistItemId: undefined
      }
    },
    relationalItemRelationCompositePkByParentIdAndChildId: {
      plan(_$root, args) {
        return relational_item_relation_composite_pks_relational_item_relation_composite_pksPgResource.get({
          parent_id: args.get("parentId"),
          child_id: args.get("childId")
        });
      },
      args: {
        parentId: undefined,
        childId: undefined
      }
    },
    relationalTopicByTopicItemId: {
      plan(_$root, args) {
        return relational_topics_relational_topicsPgResource.get({
          topic_item_id: args.get("topicItemId")
        });
      },
      args: {
        topicItemId: undefined
      }
    },
    singleTableItemRelationCompositePkByParentIdAndChildId: {
      plan(_$root, args) {
        return otherSource_single_table_item_relation_composite_pksPgResource.get({
          parent_id: args.get("parentId"),
          child_id: args.get("childId")
        });
      },
      args: {
        parentId: undefined,
        childId: undefined
      }
    },
    relationalChecklistItemByChecklistItemItemId: {
      plan(_$root, args) {
        return resource_relational_checklist_itemsPgResource.get({
          checklist_item_item_id: args.get("checklistItemItemId")
        });
      },
      args: {
        checklistItemItemId: undefined
      }
    },
    relationalDividerByDividerItemId: {
      plan(_$root, args) {
        return resource_relational_dividersPgResource.get({
          divider_item_id: args.get("dividerItemId")
        });
      },
      args: {
        dividerItemId: undefined
      }
    },
    relationalItemRelationById: {
      plan(_$root, args) {
        return relational_item_relations_relational_item_relationsPgResource.get({
          id: args.get("id")
        });
      },
      args: {
        id: undefined
      }
    },
    relationalItemRelationByParentIdAndChildId: {
      plan(_$root, args) {
        return relational_item_relations_relational_item_relationsPgResource.get({
          parent_id: args.get("parentId"),
          child_id: args.get("childId")
        });
      },
      args: {
        parentId: undefined,
        childId: undefined
      }
    },
    singleTableItemRelationById: {
      plan(_$root, args) {
        return otherSource_single_table_item_relationsPgResource.get({
          id: args.get("id")
        });
      },
      args: {
        id: undefined
      }
    },
    singleTableItemRelationByParentIdAndChildId: {
      plan(_$root, args) {
        return otherSource_single_table_item_relationsPgResource.get({
          parent_id: args.get("parentId"),
          child_id: args.get("childId")
        });
      },
      args: {
        parentId: undefined,
        childId: undefined
      }
    },
    logEntryById: {
      plan(_$root, args) {
        return resource_log_entriesPgResource.get({
          id: args.get("id")
        });
      },
      args: {
        id: undefined
      }
    },
    relationalPostByPostItemId: {
      plan(_$root, args) {
        return resource_relational_postsPgResource.get({
          post_item_id: args.get("postItemId")
        });
      },
      args: {
        postItemId: undefined
      }
    },
    firstPartyVulnerabilityById: {
      plan(_$root, args) {
        return resource_first_party_vulnerabilitiesPgResource.get({
          id: args.get("id")
        });
      },
      args: {
        id: undefined
      }
    },
    thirdPartyVulnerabilityById: {
      plan(_$root, args) {
        return resource_third_party_vulnerabilitiesPgResource.get({
          id: args.get("id")
        });
      },
      args: {
        id: undefined
      }
    },
    awsApplicationById: {
      plan(_$root, args) {
        return resource_aws_applicationsPgResource.get({
          id: args.get("id")
        });
      },
      args: {
        id: undefined
      }
    },
    gcpApplicationById: {
      plan(_$root, args) {
        return resource_gcp_applicationsPgResource.get({
          id: args.get("id")
        });
      },
      args: {
        id: undefined
      }
    },
    allSingleTables: {
      plan($parent, args, info) {
        const $select = getSelectPlanFromParentAndArgs($parent, args, info);
        return connection($select, {
          // nodePlan: ($item) => $item,
          cursorPlan($item) {
            return $item.getParentStep ? $item.getParentStep().cursor() : $item.cursor();
          }
        });
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        }
      }
    },
    getSingleTableTopicById: {
      plan($root, args, _info) {
        const selectArgs = makeArgs2(args);
        return resource_get_single_table_topic_by_idPgResource.execute(selectArgs);
      },
      args: {
        id: undefined
      }
    },
    allVulnerabilities: {
      plan() {
        const $list = pgUnionAll({
          attributes: spec_Vulnerability.attributes,
          resourceByTypeName,
          members,
          name: "Vulnerability"
        });
        return true ? connection($list) : $list;
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("VulnerabilitiesOrderBy"));
            return null;
          }
        },
        condition: {
          autoApplyAfterParentPlan: true,
          applyPlan(_condition, $connection) {
            const $select = $connection.getSubplan();
            return $select.wherePlan();
          }
        },
        only: {
          autoApplyAfterParentPlan: true,
          applyPlan($parent, $connection, fieldArgs) {
            const $union = $connection.getSubplan();
            $union.limitToTypes(fieldArgs.getRaw().eval());
          }
        }
      }
    },
    allApplications: {
      plan() {
        const $list = pgUnionAll({
          attributes: spec_Application.attributes,
          resourceByTypeName: resourceByTypeName2,
          members: members2,
          name: "Application"
        });
        return true ? connection($list) : $list;
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("ApplicationsOrderBy"));
            return null;
          }
        },
        condition: {
          autoApplyAfterParentPlan: true,
          applyPlan(_condition, $connection) {
            const $select = $connection.getSubplan();
            return $select.wherePlan();
          }
        },
        only: {
          autoApplyAfterParentPlan: true,
          applyPlan($parent, $connection, fieldArgs) {
            const $union = $connection.getSubplan();
            $union.limitToTypes(fieldArgs.getRaw().eval());
          }
        }
      }
    },
    allZeroImplementations: {
      plan() {
        const $list = pgUnionAll({
          attributes: spec_ZeroImplementation.attributes,
          resourceByTypeName: resourceByTypeName3,
          members: members3,
          name: "ZeroImplementation"
        });
        return true ? connection($list) : $list;
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("ZeroImplementationsOrderBy"));
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
    allOrganizations: {
      plan() {
        return connection(resource_organizationsPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("OrganizationsOrderBy"));
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
    allPeople: {
      plan() {
        return connection(otherSource_peoplePgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
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
    allPriorities: {
      plan() {
        return connection(otherSource_prioritiesPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        }
      }
    },
    allRelationalChecklists: {
      plan() {
        return connection(resource_relational_checklistsPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("RelationalChecklistsOrderBy"));
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
    allRelationalItemRelationCompositePks: {
      plan() {
        return connection(relational_item_relation_composite_pks_relational_item_relation_composite_pksPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("RelationalItemRelationCompositePksOrderBy"));
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
    allRelationalTopics: {
      plan() {
        return connection(relational_topics_relational_topicsPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("RelationalTopicsOrderBy"));
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
    allSingleTableItemRelationCompositePks: {
      plan() {
        return connection(otherSource_single_table_item_relation_composite_pksPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("SingleTableItemRelationCompositePksOrderBy"));
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
    allRelationalChecklistItems: {
      plan() {
        return connection(resource_relational_checklist_itemsPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("RelationalChecklistItemsOrderBy"));
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
    allRelationalDividers: {
      plan() {
        return connection(resource_relational_dividersPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("RelationalDividersOrderBy"));
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
    allRelationalItemRelations: {
      plan() {
        return connection(relational_item_relations_relational_item_relationsPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("RelationalItemRelationsOrderBy"));
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
    allSingleTableItemRelations: {
      plan() {
        return connection(otherSource_single_table_item_relationsPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("SingleTableItemRelationsOrderBy"));
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
    allLogEntries: {
      plan() {
        return connection(resource_log_entriesPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("LogEntriesOrderBy"));
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
    allRelationalPosts: {
      plan() {
        return connection(resource_relational_postsPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("RelationalPostsOrderBy"));
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
    allFirstPartyVulnerabilities: {
      plan() {
        return connection(resource_first_party_vulnerabilitiesPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("FirstPartyVulnerabilitiesOrderBy"));
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
    allThirdPartyVulnerabilities: {
      plan() {
        return connection(resource_third_party_vulnerabilitiesPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("ThirdPartyVulnerabilitiesOrderBy"));
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
    allAwsApplications: {
      plan() {
        return connection(resource_aws_applicationsPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("AwsApplicationsOrderBy"));
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
    allGcpApplications: {
      plan() {
        return connection(resource_gcp_applicationsPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("GcpApplicationsOrderBy"));
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
    allSingleTableItems: {
      plan() {
        return connection(otherSource_single_table_itemsPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("SingleTableItemsOrderBy"));
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
    allRelationalItems: {
      plan() {
        return connection(otherSource_relational_itemsPgResource.find());
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("RelationalItemsOrderBy"));
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
  Organization: {
    __assertStep: assertPgClassSingleStep,
    organizationId($record) {
      return $record.get("organization_id");
    },
    name($record) {
      return $record.get("name");
    },
    logEntriesByOrganizationId: {
      plan($record) {
        const $records = resource_log_entriesPgResource.find({
          organization_id: $record.get("organization_id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("LogEntriesOrderBy"));
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
    awsApplicationsByOrganizationId: {
      plan($record) {
        const $records = resource_aws_applicationsPgResource.find({
          organization_id: $record.get("organization_id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("AwsApplicationsOrderBy"));
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
    gcpApplicationsByOrganizationId: {
      plan($record) {
        const $records = resource_gcp_applicationsPgResource.find({
          organization_id: $record.get("organization_id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("GcpApplicationsOrderBy"));
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
  LogEntriesConnection: {
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
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  LogEntry: {
    __assertStep: assertPgClassSingleStep,
    id($record) {
      return $record.get("id");
    },
    personId($record) {
      return $record.get("person_id");
    },
    organizationId($record) {
      return $record.get("organization_id");
    },
    text($record) {
      return $record.get("text");
    },
    organizationByOrganizationId($record) {
      return resource_organizationsPgResource.get({
        organization_id: $record.get("organization_id")
      });
    },
    personByPersonId($record) {
      return otherSource_peoplePgResource.get({
        person_id: $record.get("person_id")
      });
    },
    author($parent) {
      const $record = undefined ? $parent.get("result") : $parent;
      for (let i = 0, l = paths.length; i < l; i++) {
        const path = paths[i];
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
        attributes,
        resourceByTypeName: resourceByTypeName4,
        members: members4,
        name: "author"
      });
      if (false) {
        return connection($list);
      } else if (true) {
        return $list.single();
      } else {
        return $list;
      }
    }
  },
  Person: {
    __assertStep: assertPgClassSingleStep,
    personId($record) {
      return $record.get("person_id");
    },
    username($record) {
      return $record.get("username");
    },
    logEntriesByPersonId: {
      plan($record) {
        const $records = resource_log_entriesPgResource.find({
          person_id: $record.get("person_id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("LogEntriesOrderBy"));
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
    singleTableItemsByAuthorId: {
      plan($record) {
        const $records = otherSource_single_table_itemsPgResource.find({
          author_id: $record.get("person_id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("SingleTableItemsOrderBy"));
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
    relationalItemsByAuthorId: {
      plan($record) {
        const $records = otherSource_relational_itemsPgResource.find({
          author_id: $record.get("person_id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("RelationalItemsOrderBy"));
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
    awsApplicationsByPersonId: {
      plan($record) {
        const $records = resource_aws_applicationsPgResource.find({
          person_id: $record.get("person_id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("AwsApplicationsOrderBy"));
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
    gcpApplicationsByPersonId: {
      plan($record) {
        const $records = resource_gcp_applicationsPgResource.find({
          person_id: $record.get("person_id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("GcpApplicationsOrderBy"));
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
    applications: {
      plan($parent) {
        const $record = undefined ? $parent.get("result") : $parent;
        for (let i = 0, l = paths2.length; i < l; i++) {
          const path = paths2[i];
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
          attributes: spec_Application.attributes,
          resourceByTypeName: resourceByTypeName5,
          members: members5,
          name: "applications"
        });
        if (true) {
          return connection($list);
        } else if (false) {
          return $list.single();
        } else {
          return $list;
        }
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("ApplicationsOrderBy"));
            return null;
          }
        },
        condition: {
          autoApplyAfterParentPlan: true,
          applyPlan(_condition, $connection) {
            const $select = $connection.getSubplan();
            return $select.wherePlan();
          }
        },
        only: {
          autoApplyAfterParentPlan: true,
          applyPlan($parent, $connection, fieldArgs) {
            const $union = $connection.getSubplan();
            $union.limitToTypes(fieldArgs.getRaw().eval());
          }
        }
      }
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
  LogEntriesOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        log_entriesUniques[0].attributes.forEach(attributeName => {
          const attribute = logEntriesCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
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
        log_entriesUniques[0].attributes.forEach(attributeName => {
          const attribute = logEntriesCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
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
    PERSON_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "person_id",
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
    PERSON_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "person_id",
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
    ORGANIZATION_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "organization_id",
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
    ORGANIZATION_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "organization_id",
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
    TEXT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "text",
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
    TEXT_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "text",
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
  LogEntryCondition: {
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_logEntries.attributes.id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    personId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "person_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "person_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_logEntries.attributes.person_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    organizationId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "organization_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "organization_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_logEntries.attributes.organization_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    text: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "text",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "text",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_logEntries.attributes.text.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  SingleTableItemsConnection: {
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
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  BigInt: {
    serialize: CursorSerialize,
    parseValue: CursorSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"BigInt" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
    }
  },
  Datetime: {
    serialize: CursorSerialize,
    parseValue: CursorSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"Datetime" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
    }
  },
  SingleTableItemRelationsConnection: {
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
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  SingleTableItemRelation: {
    __assertStep: assertPgClassSingleStep,
    id($record) {
      return $record.get("id");
    },
    parentId($record) {
      return $record.get("parent_id");
    },
    childId($record) {
      return $record.get("child_id");
    },
    singleTableItemByChildId($record) {
      return otherSource_single_table_itemsPgResource.get({
        id: $record.get("child_id")
      });
    },
    singleTableItemByParentId($record) {
      return otherSource_single_table_itemsPgResource.get({
        id: $record.get("parent_id")
      });
    }
  },
  SingleTableItemRelationsEdge: {
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
  SingleTableItemRelationCompositePksConnection: {
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
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  SingleTableItemRelationCompositePk: {
    __assertStep: assertPgClassSingleStep,
    parentId($record) {
      return $record.get("parent_id");
    },
    childId($record) {
      return $record.get("child_id");
    },
    singleTableItemByChildId($record) {
      return otherSource_single_table_itemsPgResource.get({
        id: $record.get("child_id")
      });
    },
    singleTableItemByParentId($record) {
      return otherSource_single_table_itemsPgResource.get({
        id: $record.get("parent_id")
      });
    }
  },
  SingleTableItemRelationCompositePksEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  SingleTableItemsEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  SingleTableItemsOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        single_table_itemsUniques[0].attributes.forEach(attributeName => {
          const attribute = singleTableItemsCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
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
        single_table_itemsUniques[0].attributes.forEach(attributeName => {
          const attribute = singleTableItemsCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
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
    TYPE_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "type",
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
    TYPE_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "type",
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
    PARENT_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "parent_id",
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
    PARENT_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "parent_id",
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
    ROOT_TOPIC_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "root_topic_id",
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
    ROOT_TOPIC_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "root_topic_id",
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
    AUTHOR_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "author_id",
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
    AUTHOR_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "author_id",
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
    POSITION_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "position",
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
    POSITION_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "position",
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
    CREATED_AT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "created_at",
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
    CREATED_AT_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "created_at",
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
    UPDATED_AT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "updated_at",
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
    UPDATED_AT_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "updated_at",
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
    IS_EXPLICITLY_ARCHIVED_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "is_explicitly_archived",
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
    IS_EXPLICITLY_ARCHIVED_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "is_explicitly_archived",
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
    ARCHIVED_AT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "archived_at",
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
    ARCHIVED_AT_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "archived_at",
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
  SingleTableItemCondition: {
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_singleTableItems.attributes.id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    type: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "type",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "type",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_singleTableItems.attributes.type.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    parentId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "parent_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "parent_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_singleTableItems.attributes.parent_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    rootTopicId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "root_topic_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "root_topic_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_singleTableItems.attributes.root_topic_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    authorId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "author_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "author_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_singleTableItems.attributes.author_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    position: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "position",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "position",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_singleTableItems.attributes.position.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    createdAt: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "created_at",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "created_at",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_singleTableItems.attributes.created_at.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    updatedAt: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "updated_at",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "updated_at",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_singleTableItems.attributes.updated_at.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    isExplicitlyArchived: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "is_explicitly_archived",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "is_explicitly_archived",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_singleTableItems.attributes.is_explicitly_archived.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    archivedAt: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "archived_at",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "archived_at",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_singleTableItems.attributes.archived_at.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  RelationalItemsConnection: {
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
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  RelationalItemRelationsConnection: {
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
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  RelationalItemRelation: {
    __assertStep: assertPgClassSingleStep,
    id($record) {
      return $record.get("id");
    },
    parentId($record) {
      return $record.get("parent_id");
    },
    childId($record) {
      return $record.get("child_id");
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
  RelationalItemRelationsEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  RelationalItemRelationCompositePksConnection: {
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
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  RelationalItemRelationCompositePk: {
    __assertStep: assertPgClassSingleStep,
    parentId($record) {
      return $record.get("parent_id");
    },
    childId($record) {
      return $record.get("child_id");
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
  RelationalItemRelationCompositePksEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  RelationalItemsEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  RelationalItemsOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        relational_itemsUniques[0].attributes.forEach(attributeName => {
          const attribute = relationalItemsCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
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
        relational_itemsUniques[0].attributes.forEach(attributeName => {
          const attribute = relationalItemsCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
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
    TYPE_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "type",
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
    TYPE_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "type",
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
    PARENT_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "parent_id",
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
    PARENT_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "parent_id",
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
    ROOT_TOPIC_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "root_topic_id",
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
    ROOT_TOPIC_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "root_topic_id",
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
    AUTHOR_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "author_id",
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
    AUTHOR_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "author_id",
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
    POSITION_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "position",
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
    POSITION_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "position",
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
    CREATED_AT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "created_at",
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
    CREATED_AT_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "created_at",
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
    UPDATED_AT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "updated_at",
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
    UPDATED_AT_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "updated_at",
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
    IS_EXPLICITLY_ARCHIVED_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "is_explicitly_archived",
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
    IS_EXPLICITLY_ARCHIVED_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "is_explicitly_archived",
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
    ARCHIVED_AT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "archived_at",
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
    ARCHIVED_AT_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "archived_at",
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
  RelationalItemCondition: {
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalItems.attributes.id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    type: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "type",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "type",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalItems.attributes.type.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    parentId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "parent_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "parent_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalItems.attributes.parent_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    rootTopicId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "root_topic_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "root_topic_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalItems.attributes.root_topic_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    authorId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "author_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "author_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalItems.attributes.author_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    position: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "position",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "position",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalItems.attributes.position.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    createdAt: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "created_at",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "created_at",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalItems.attributes.created_at.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    updatedAt: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "updated_at",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "updated_at",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalItems.attributes.updated_at.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    isExplicitlyArchived: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "is_explicitly_archived",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "is_explicitly_archived",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalItems.attributes.is_explicitly_archived.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    archivedAt: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "archived_at",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "archived_at",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalItems.attributes.archived_at.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  AwsApplicationsConnection: {
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
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  AwsApplication: {
    __assertStep: assertPgClassSingleStep,
    id($record) {
      return $record.get("id");
    },
    name($record) {
      return $record.get("name");
    },
    lastDeployed($record) {
      return $record.get("last_deployed");
    },
    personId($record) {
      return $record.get("person_id");
    },
    organizationId($record) {
      return $record.get("organization_id");
    },
    awsId($record) {
      return $record.get("aws_id");
    },
    organizationByOrganizationId($record) {
      return resource_organizationsPgResource.get({
        organization_id: $record.get("organization_id")
      });
    },
    personByPersonId($record) {
      return otherSource_peoplePgResource.get({
        person_id: $record.get("person_id")
      });
    },
    vulnerabilities: {
      plan($parent) {
        const $record = undefined ? $parent.get("result") : $parent;
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
          attributes: spec_Vulnerability.attributes,
          resourceByTypeName: resourceByTypeName6,
          members: members6,
          name: "vulnerabilities"
        });
        if (true) {
          return connection($list);
        } else if (false) {
          return $list.single();
        } else {
          return $list;
        }
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("VulnerabilitiesOrderBy"));
            return null;
          }
        },
        condition: {
          autoApplyAfterParentPlan: true,
          applyPlan(_condition, $connection) {
            const $select = $connection.getSubplan();
            return $select.wherePlan();
          }
        },
        only: {
          autoApplyAfterParentPlan: true,
          applyPlan($parent, $connection, fieldArgs) {
            const $union = $connection.getSubplan();
            $union.limitToTypes(fieldArgs.getRaw().eval());
          }
        }
      }
    },
    owner($parent) {
      const $record = undefined ? $parent.get("result") : $parent;
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
        resourceByTypeName: resourceByTypeName7,
        members: members7,
        name: "owner"
      });
      if (false) {
        return connection($list);
      } else if (true) {
        return $list.single();
      } else {
        return $list;
      }
    }
  },
  VulnerabilitiesConnection: {
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
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  ApplicationsConnection: {
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
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  ApplicationsEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  PersonOrOrganizationConnection: {
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
    }
  },
  PersonOrOrganizationEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  VulnerabilitiesEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  VulnerabilitiesOrderBy: {
    NATURAL: {
      applyPlan() {}
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
        if (false) {
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
    },
    CVSS_SCORE_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "cvss_score",
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
    CVSS_SCORE_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "cvss_score",
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
  VulnerabilityCondition: {
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_Vulnerability.attributes.id.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_Vulnerability.attributes.name.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    cvssScore: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "cvss_score",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "cvss_score",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_Vulnerability.attributes.cvss_score.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  AwsApplicationsEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  AwsApplicationsOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        aws_applicationsUniques[0].attributes.forEach(attributeName => {
          const attribute = awsApplicationsCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
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
        aws_applicationsUniques[0].attributes.forEach(attributeName => {
          const attribute = awsApplicationsCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
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
    },
    LAST_DEPLOYED_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "last_deployed",
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
    LAST_DEPLOYED_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "last_deployed",
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
    PERSON_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "person_id",
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
    PERSON_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "person_id",
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
    ORGANIZATION_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "organization_id",
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
    ORGANIZATION_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "organization_id",
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
    AWS_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "aws_id",
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
    AWS_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "aws_id",
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
  AwsApplicationCondition: {
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_awsApplications.attributes.id.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_awsApplications.attributes.name.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    lastDeployed: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "last_deployed",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "last_deployed",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_awsApplications.attributes.last_deployed.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    personId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "person_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "person_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_awsApplications.attributes.person_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    organizationId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "organization_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "organization_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_awsApplications.attributes.organization_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    awsId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "aws_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "aws_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_awsApplications.attributes.aws_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  GcpApplicationsConnection: {
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
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  GcpApplication: {
    __assertStep: assertPgClassSingleStep,
    id($record) {
      return $record.get("id");
    },
    name($record) {
      return $record.get("name");
    },
    lastDeployed($record) {
      return $record.get("last_deployed");
    },
    personId($record) {
      return $record.get("person_id");
    },
    organizationId($record) {
      return $record.get("organization_id");
    },
    gcpId($record) {
      return $record.get("gcp_id");
    },
    organizationByOrganizationId($record) {
      return resource_organizationsPgResource.get({
        organization_id: $record.get("organization_id")
      });
    },
    personByPersonId($record) {
      return otherSource_peoplePgResource.get({
        person_id: $record.get("person_id")
      });
    },
    vulnerabilities: {
      plan($parent) {
        const $record = undefined ? $parent.get("result") : $parent;
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
          resourceByTypeName: resourceByTypeName8,
          members: members8,
          name: "vulnerabilities"
        });
        if (true) {
          return connection($list);
        } else if (false) {
          return $list.single();
        } else {
          return $list;
        }
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("VulnerabilitiesOrderBy"));
            return null;
          }
        },
        condition: {
          autoApplyAfterParentPlan: true,
          applyPlan(_condition, $connection) {
            const $select = $connection.getSubplan();
            return $select.wherePlan();
          }
        },
        only: {
          autoApplyAfterParentPlan: true,
          applyPlan($parent, $connection, fieldArgs) {
            const $union = $connection.getSubplan();
            $union.limitToTypes(fieldArgs.getRaw().eval());
          }
        }
      }
    },
    owner($parent) {
      const $record = undefined ? $parent.get("result") : $parent;
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
        resourceByTypeName: resourceByTypeName9,
        members: members9,
        name: "owner"
      });
      if (false) {
        return connection($list);
      } else if (true) {
        return $list.single();
      } else {
        return $list;
      }
    }
  },
  GcpApplicationsEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  GcpApplicationsOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        gcp_applicationsUniques[0].attributes.forEach(attributeName => {
          const attribute = gcpApplicationsCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
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
        gcp_applicationsUniques[0].attributes.forEach(attributeName => {
          const attribute = gcpApplicationsCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
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
    },
    LAST_DEPLOYED_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "last_deployed",
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
    LAST_DEPLOYED_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "last_deployed",
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
    PERSON_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "person_id",
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
    PERSON_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "person_id",
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
    ORGANIZATION_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "organization_id",
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
    ORGANIZATION_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "organization_id",
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
    GCP_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "gcp_id",
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
    GCP_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "gcp_id",
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
  GcpApplicationCondition: {
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_gcpApplications.attributes.id.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_gcpApplications.attributes.name.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    lastDeployed: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "last_deployed",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "last_deployed",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_gcpApplications.attributes.last_deployed.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    personId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "person_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "person_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_gcpApplications.attributes.person_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    organizationId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "organization_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "organization_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_gcpApplications.attributes.organization_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    gcpId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "gcp_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "gcp_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_gcpApplications.attributes.gcp_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  ApplicationsOrderBy: {
    NATURAL: {
      applyPlan() {}
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
        if (false) {
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
    },
    LAST_DEPLOYED_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "last_deployed",
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
    LAST_DEPLOYED_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "last_deployed",
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
  ApplicationCondition: {
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_Application.attributes.id.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_Application.attributes.name.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    lastDeployed: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "last_deployed",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "last_deployed",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_Application.attributes.last_deployed.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  LogEntriesEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  Priority: {
    __assertStep: assertPgClassSingleStep,
    id($record) {
      return $record.get("id");
    },
    title($record) {
      return $record.get("title");
    },
    singleTableItemsByPriorityId: {
      plan($record) {
        const $records = otherSource_single_table_itemsPgResource.find({
          priority_id: $record.get("id")
        });
        return connection($records);
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("SingleTableItemsOrderBy"));
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
  FirstPartyVulnerability: {
    __assertStep: assertPgClassSingleStep,
    id($record) {
      return $record.get("id");
    },
    name($record) {
      return $record.get("name");
    },
    cvssScore($record) {
      return $record.get("cvss_score");
    },
    teamName($record) {
      return $record.get("team_name");
    },
    applications: {
      plan($parent) {
        const $record = undefined ? $parent.get("result") : $parent;
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
          resourceByTypeName: resourceByTypeName10,
          members: members10,
          name: "applications"
        });
        if (true) {
          return connection($list);
        } else if (false) {
          return $list.single();
        } else {
          return $list;
        }
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("ApplicationsOrderBy"));
            return null;
          }
        },
        condition: {
          autoApplyAfterParentPlan: true,
          applyPlan(_condition, $connection) {
            const $select = $connection.getSubplan();
            return $select.wherePlan();
          }
        },
        only: {
          autoApplyAfterParentPlan: true,
          applyPlan($parent, $connection, fieldArgs) {
            const $union = $connection.getSubplan();
            $union.limitToTypes(fieldArgs.getRaw().eval());
          }
        }
      }
    },
    owners($parent) {
      const $record = undefined ? $parent.get("result") : $parent;
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
        resourceByTypeName: resourceByTypeName11,
        members: members11,
        name: "owners"
      });
      if (true) {
        return connection($list);
      } else if (false) {
        return $list.single();
      } else {
        return $list;
      }
    }
  },
  ThirdPartyVulnerability: {
    __assertStep: assertPgClassSingleStep,
    id($record) {
      return $record.get("id");
    },
    name($record) {
      return $record.get("name");
    },
    cvssScore($record) {
      return $record.get("cvss_score");
    },
    vendorName($record) {
      return $record.get("vendor_name");
    },
    applications: {
      plan($parent) {
        const $record = undefined ? $parent.get("result") : $parent;
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
          resourceByTypeName: resourceByTypeName12,
          members: members12,
          name: "applications"
        });
        if (true) {
          return connection($list);
        } else if (false) {
          return $list.single();
        } else {
          return $list;
        }
      },
      args: {
        first: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, arg) {
            $connection.setFirst(arg.getRaw());
          }
        },
        last: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setLast(val.getRaw());
          }
        },
        offset: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setOffset(val.getRaw());
          }
        },
        before: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setBefore(val.getRaw());
          }
        },
        after: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val) {
            $connection.setAfter(val.getRaw());
          }
        },
        orderBy: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $connection, val, info) {
            const $value = val.getRaw();
            const $select = $connection.getSubplan();
            applyOrderToPlan($select, $value, info.schema.getType("ApplicationsOrderBy"));
            return null;
          }
        },
        condition: {
          autoApplyAfterParentPlan: true,
          applyPlan(_condition, $connection) {
            const $select = $connection.getSubplan();
            return $select.wherePlan();
          }
        },
        only: {
          autoApplyAfterParentPlan: true,
          applyPlan($parent, $connection, fieldArgs) {
            const $union = $connection.getSubplan();
            $union.limitToTypes(fieldArgs.getRaw().eval());
          }
        }
      }
    },
    owners($parent) {
      const $record = undefined ? $parent.get("result") : $parent;
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
        resourceByTypeName: resourceByTypeName13,
        members: members13,
        name: "owners"
      });
      if (true) {
        return connection($list);
      } else if (false) {
        return $list.single();
      } else {
        return $list;
      }
    }
  },
  ZeroImplementationsConnection: {
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
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  ZeroImplementationsEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  ZeroImplementationsOrderBy: {
    NATURAL: {
      applyPlan() {}
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
        if (false) {
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
  ZeroImplementationCondition: {
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_ZeroImplementation.attributes.id.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_ZeroImplementation.attributes.name.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  OrganizationsConnection: {
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
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  OrganizationsEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  OrganizationsOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        organizationsUniques[0].attributes.forEach(attributeName => {
          const attribute = organizationsCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
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
        organizationsUniques[0].attributes.forEach(attributeName => {
          const attribute = organizationsCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
            direction: "DESC",
            ...(undefined != null ? {
              nulls: undefined ? "LAST" : "FIRST"
            } : null)
          });
        });
        step.setOrderIsUnique();
      }
    },
    ORGANIZATION_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "organization_id",
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
    ORGANIZATION_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "organization_id",
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
        if (true) {
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
        if (true) {
          plan.setOrderIsUnique();
        }
      }
    }
  },
  OrganizationCondition: {
    organizationId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "organization_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "organization_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_organizations.attributes.organization_id.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_organizations.attributes.name.codec)}`;
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
        peopleUniques[0].attributes.forEach(attributeName => {
          const attribute = peopleCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
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
        peopleUniques[0].attributes.forEach(attributeName => {
          const attribute = peopleCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
            direction: "DESC",
            ...(undefined != null ? {
              nulls: undefined ? "LAST" : "FIRST"
            } : null)
          });
        });
        step.setOrderIsUnique();
      }
    },
    PERSON_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "person_id",
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
    PERSON_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "person_id",
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
    USERNAME_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "username",
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
    USERNAME_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "username",
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
  PersonCondition: {
    personId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "person_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "person_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_people.attributes.person_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    username: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "username",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "username",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_people.attributes.username.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  PrioritiesConnection: {
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
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  PrioritiesEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  RelationalChecklistsConnection: {
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
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  RelationalChecklistsEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  RelationalChecklistsOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        relational_checklistsUniques[0].attributes.forEach(attributeName => {
          const attribute = relationalChecklistsCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
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
        relational_checklistsUniques[0].attributes.forEach(attributeName => {
          const attribute = relationalChecklistsCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
            direction: "DESC",
            ...(undefined != null ? {
              nulls: undefined ? "LAST" : "FIRST"
            } : null)
          });
        });
        step.setOrderIsUnique();
      }
    },
    TITLE_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "title",
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
    TITLE_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "title",
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
        if (false) {
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
        if (false) {
          plan.setOrderIsUnique();
        }
      }
    },
    TYPE_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "type",
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
    TYPE_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "type",
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
    PARENT_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "parent_id",
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
    PARENT_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "parent_id",
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
    ROOT_TOPIC_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "root_topic_id",
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
    ROOT_TOPIC_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "root_topic_id",
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
    AUTHOR_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "author_id",
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
    AUTHOR_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "author_id",
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
    POSITION_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "position",
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
    POSITION_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "position",
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
    CREATED_AT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "created_at",
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
    CREATED_AT_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "created_at",
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
    UPDATED_AT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "updated_at",
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
    UPDATED_AT_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "updated_at",
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
    IS_EXPLICITLY_ARCHIVED_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "is_explicitly_archived",
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
    IS_EXPLICITLY_ARCHIVED_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "is_explicitly_archived",
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
    ARCHIVED_AT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "archived_at",
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
    ARCHIVED_AT_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "archived_at",
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
  RelationalChecklistCondition: {
    title: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "title",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "title",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalChecklists.attributes.title.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalChecklists.attributes.id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    type: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "type",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "type",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalChecklists.attributes.type.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    parentId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "parent_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "parent_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalChecklists.attributes.parent_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    rootTopicId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "root_topic_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "root_topic_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalChecklists.attributes.root_topic_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    authorId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "author_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "author_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalChecklists.attributes.author_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    position: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "position",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "position",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalChecklists.attributes.position.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    createdAt: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "created_at",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "created_at",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalChecklists.attributes.created_at.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    updatedAt: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "updated_at",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "updated_at",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalChecklists.attributes.updated_at.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    isExplicitlyArchived: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "is_explicitly_archived",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "is_explicitly_archived",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalChecklists.attributes.is_explicitly_archived.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    archivedAt: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "archived_at",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "archived_at",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalChecklists.attributes.archived_at.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  RelationalItemRelationCompositePksOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        relational_item_relation_composite_pksUniques[0].attributes.forEach(attributeName => {
          const attribute = relationalItemRelationCompositePksCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
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
        relational_item_relation_composite_pksUniques[0].attributes.forEach(attributeName => {
          const attribute = relationalItemRelationCompositePksCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
            direction: "DESC",
            ...(undefined != null ? {
              nulls: undefined ? "LAST" : "FIRST"
            } : null)
          });
        });
        step.setOrderIsUnique();
      }
    },
    PARENT_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "parent_id",
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
    PARENT_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "parent_id",
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
    CHILD_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "child_id",
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
    CHILD_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "child_id",
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
  RelationalItemRelationCompositePkCondition: {
    parentId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "parent_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "parent_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalItemRelationCompositePks.attributes.parent_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    childId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "child_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "child_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalItemRelationCompositePks.attributes.child_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  RelationalTopicsConnection: {
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
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  RelationalTopicsEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  RelationalTopicsOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        relational_topicsUniques[0].attributes.forEach(attributeName => {
          const attribute = relationalTopicsCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
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
        relational_topicsUniques[0].attributes.forEach(attributeName => {
          const attribute = relationalTopicsCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
            direction: "DESC",
            ...(undefined != null ? {
              nulls: undefined ? "LAST" : "FIRST"
            } : null)
          });
        });
        step.setOrderIsUnique();
      }
    },
    TITLE_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "title",
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
    TITLE_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "title",
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
        if (false) {
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
        if (false) {
          plan.setOrderIsUnique();
        }
      }
    },
    TYPE_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "type",
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
    TYPE_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "type",
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
    PARENT_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "parent_id",
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
    PARENT_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "parent_id",
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
    ROOT_TOPIC_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "root_topic_id",
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
    ROOT_TOPIC_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "root_topic_id",
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
    AUTHOR_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "author_id",
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
    AUTHOR_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "author_id",
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
    POSITION_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "position",
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
    POSITION_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "position",
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
    CREATED_AT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "created_at",
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
    CREATED_AT_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "created_at",
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
    UPDATED_AT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "updated_at",
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
    UPDATED_AT_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "updated_at",
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
    IS_EXPLICITLY_ARCHIVED_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "is_explicitly_archived",
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
    IS_EXPLICITLY_ARCHIVED_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "is_explicitly_archived",
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
    ARCHIVED_AT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "archived_at",
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
    ARCHIVED_AT_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "archived_at",
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
  RelationalTopicCondition: {
    title: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "title",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "title",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalTopics.attributes.title.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalTopics.attributes.id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    type: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "type",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "type",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalTopics.attributes.type.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    parentId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "parent_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "parent_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalTopics.attributes.parent_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    rootTopicId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "root_topic_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "root_topic_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalTopics.attributes.root_topic_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    authorId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "author_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "author_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalTopics.attributes.author_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    position: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "position",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "position",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalTopics.attributes.position.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    createdAt: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "created_at",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "created_at",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalTopics.attributes.created_at.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    updatedAt: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "updated_at",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "updated_at",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalTopics.attributes.updated_at.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    isExplicitlyArchived: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "is_explicitly_archived",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "is_explicitly_archived",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalTopics.attributes.is_explicitly_archived.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    archivedAt: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "archived_at",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "archived_at",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalTopics.attributes.archived_at.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  SingleTableItemRelationCompositePksOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        single_table_item_relation_composite_pksUniques[0].attributes.forEach(attributeName => {
          const attribute = singleTableItemRelationCompositePksCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
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
        single_table_item_relation_composite_pksUniques[0].attributes.forEach(attributeName => {
          const attribute = singleTableItemRelationCompositePksCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
            direction: "DESC",
            ...(undefined != null ? {
              nulls: undefined ? "LAST" : "FIRST"
            } : null)
          });
        });
        step.setOrderIsUnique();
      }
    },
    PARENT_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "parent_id",
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
    PARENT_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "parent_id",
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
    CHILD_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "child_id",
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
    CHILD_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "child_id",
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
  SingleTableItemRelationCompositePkCondition: {
    parentId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "parent_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "parent_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_singleTableItemRelationCompositePks.attributes.parent_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    childId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "child_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "child_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_singleTableItemRelationCompositePks.attributes.child_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  RelationalChecklistItemsConnection: {
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
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  RelationalChecklistItemsEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  RelationalChecklistItemsOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        relational_checklist_itemsUniques[0].attributes.forEach(attributeName => {
          const attribute = relationalChecklistItemsCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
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
        relational_checklist_itemsUniques[0].attributes.forEach(attributeName => {
          const attribute = relationalChecklistItemsCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
            direction: "DESC",
            ...(undefined != null ? {
              nulls: undefined ? "LAST" : "FIRST"
            } : null)
          });
        });
        step.setOrderIsUnique();
      }
    },
    DESCRIPTION_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "description",
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
    DESCRIPTION_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "description",
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
    NOTE_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "note",
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
    NOTE_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "note",
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
        if (false) {
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
        if (false) {
          plan.setOrderIsUnique();
        }
      }
    },
    TYPE_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "type",
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
    TYPE_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "type",
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
    PARENT_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "parent_id",
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
    PARENT_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "parent_id",
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
    ROOT_TOPIC_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "root_topic_id",
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
    ROOT_TOPIC_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "root_topic_id",
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
    AUTHOR_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "author_id",
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
    AUTHOR_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "author_id",
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
    POSITION_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "position",
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
    POSITION_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "position",
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
    CREATED_AT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "created_at",
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
    CREATED_AT_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "created_at",
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
    UPDATED_AT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "updated_at",
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
    UPDATED_AT_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "updated_at",
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
    IS_EXPLICITLY_ARCHIVED_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "is_explicitly_archived",
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
    IS_EXPLICITLY_ARCHIVED_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "is_explicitly_archived",
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
    ARCHIVED_AT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "archived_at",
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
    ARCHIVED_AT_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "archived_at",
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
  RelationalChecklistItemCondition: {
    description: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "description",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "description",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalChecklistItems.attributes.description.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    note: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "note",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "note",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalChecklistItems.attributes.note.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalChecklistItems.attributes.id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    type: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "type",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "type",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalChecklistItems.attributes.type.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    parentId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "parent_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "parent_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalChecklistItems.attributes.parent_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    rootTopicId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "root_topic_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "root_topic_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalChecklistItems.attributes.root_topic_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    authorId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "author_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "author_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalChecklistItems.attributes.author_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    position: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "position",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "position",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalChecklistItems.attributes.position.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    createdAt: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "created_at",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "created_at",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalChecklistItems.attributes.created_at.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    updatedAt: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "updated_at",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "updated_at",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalChecklistItems.attributes.updated_at.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    isExplicitlyArchived: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "is_explicitly_archived",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "is_explicitly_archived",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalChecklistItems.attributes.is_explicitly_archived.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    archivedAt: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "archived_at",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "archived_at",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalChecklistItems.attributes.archived_at.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  RelationalDividersConnection: {
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
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  RelationalDividersEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  RelationalDividersOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        relational_dividersUniques[0].attributes.forEach(attributeName => {
          const attribute = relationalDividersCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
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
        relational_dividersUniques[0].attributes.forEach(attributeName => {
          const attribute = relationalDividersCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
            direction: "DESC",
            ...(undefined != null ? {
              nulls: undefined ? "LAST" : "FIRST"
            } : null)
          });
        });
        step.setOrderIsUnique();
      }
    },
    TITLE_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "title",
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
    TITLE_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "title",
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
    COLOR_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "color",
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
    COLOR_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "color",
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
        if (false) {
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
        if (false) {
          plan.setOrderIsUnique();
        }
      }
    },
    TYPE_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "type",
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
    TYPE_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "type",
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
    PARENT_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "parent_id",
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
    PARENT_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "parent_id",
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
    ROOT_TOPIC_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "root_topic_id",
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
    ROOT_TOPIC_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "root_topic_id",
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
    AUTHOR_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "author_id",
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
    AUTHOR_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "author_id",
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
    POSITION_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "position",
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
    POSITION_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "position",
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
    CREATED_AT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "created_at",
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
    CREATED_AT_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "created_at",
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
    UPDATED_AT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "updated_at",
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
    UPDATED_AT_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "updated_at",
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
    IS_EXPLICITLY_ARCHIVED_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "is_explicitly_archived",
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
    IS_EXPLICITLY_ARCHIVED_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "is_explicitly_archived",
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
    ARCHIVED_AT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "archived_at",
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
    ARCHIVED_AT_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "archived_at",
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
  RelationalDividerCondition: {
    title: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "title",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "title",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalDividers.attributes.title.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    color: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "color",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "color",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalDividers.attributes.color.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalDividers.attributes.id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    type: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "type",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "type",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalDividers.attributes.type.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    parentId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "parent_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "parent_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalDividers.attributes.parent_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    rootTopicId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "root_topic_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "root_topic_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalDividers.attributes.root_topic_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    authorId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "author_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "author_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalDividers.attributes.author_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    position: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "position",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "position",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalDividers.attributes.position.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    createdAt: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "created_at",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "created_at",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalDividers.attributes.created_at.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    updatedAt: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "updated_at",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "updated_at",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalDividers.attributes.updated_at.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    isExplicitlyArchived: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "is_explicitly_archived",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "is_explicitly_archived",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalDividers.attributes.is_explicitly_archived.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    archivedAt: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "archived_at",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "archived_at",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalDividers.attributes.archived_at.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  RelationalItemRelationsOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        relational_item_relationsUniques[0].attributes.forEach(attributeName => {
          const attribute = relationalItemRelationsCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
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
        relational_item_relationsUniques[0].attributes.forEach(attributeName => {
          const attribute = relationalItemRelationsCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
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
    PARENT_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "parent_id",
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
    PARENT_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "parent_id",
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
    CHILD_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "child_id",
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
    CHILD_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "child_id",
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
  RelationalItemRelationCondition: {
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalItemRelations.attributes.id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    parentId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "parent_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "parent_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalItemRelations.attributes.parent_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    childId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "child_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "child_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalItemRelations.attributes.child_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  SingleTableItemRelationsOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        single_table_item_relationsUniques[0].attributes.forEach(attributeName => {
          const attribute = singleTableItemRelationsCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
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
        single_table_item_relationsUniques[0].attributes.forEach(attributeName => {
          const attribute = singleTableItemRelationsCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
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
    PARENT_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "parent_id",
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
    PARENT_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "parent_id",
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
    CHILD_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "child_id",
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
    CHILD_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "child_id",
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
  SingleTableItemRelationCondition: {
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_singleTableItemRelations.attributes.id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    parentId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "parent_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "parent_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_singleTableItemRelations.attributes.parent_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    childId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "child_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "child_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_singleTableItemRelations.attributes.child_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  RelationalPostsConnection: {
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
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  RelationalPostsEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  RelationalPostsOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        relational_postsUniques[0].attributes.forEach(attributeName => {
          const attribute = relationalPostsCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
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
        relational_postsUniques[0].attributes.forEach(attributeName => {
          const attribute = relationalPostsCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
            direction: "DESC",
            ...(undefined != null ? {
              nulls: undefined ? "LAST" : "FIRST"
            } : null)
          });
        });
        step.setOrderIsUnique();
      }
    },
    TITLE_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "title",
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
    TITLE_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "title",
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
    DESCRIPTION_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "description",
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
    DESCRIPTION_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "description",
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
    NOTE_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "note",
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
    NOTE_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "note",
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
        if (false) {
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
        if (false) {
          plan.setOrderIsUnique();
        }
      }
    },
    TYPE_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "type",
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
    TYPE_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "type",
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
    PARENT_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "parent_id",
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
    PARENT_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "parent_id",
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
    ROOT_TOPIC_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "root_topic_id",
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
    ROOT_TOPIC_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "root_topic_id",
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
    AUTHOR_ID_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "author_id",
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
    AUTHOR_ID_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "author_id",
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
    POSITION_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "position",
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
    POSITION_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "position",
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
    CREATED_AT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "created_at",
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
    CREATED_AT_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "created_at",
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
    UPDATED_AT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "updated_at",
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
    UPDATED_AT_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "updated_at",
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
    IS_EXPLICITLY_ARCHIVED_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "is_explicitly_archived",
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
    IS_EXPLICITLY_ARCHIVED_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "is_explicitly_archived",
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
    ARCHIVED_AT_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "archived_at",
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
    ARCHIVED_AT_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "archived_at",
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
  RelationalPostCondition: {
    title: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "title",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "title",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalPosts.attributes.title.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    description: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "description",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "description",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalPosts.attributes.description.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    note: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "note",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "note",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalPosts.attributes.note.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalPosts.attributes.id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    type: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "type",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "type",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalPosts.attributes.type.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    parentId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "parent_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "parent_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalPosts.attributes.parent_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    rootTopicId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "root_topic_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "root_topic_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalPosts.attributes.root_topic_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    authorId: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "author_id",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "author_id",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalPosts.attributes.author_id.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    position: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "position",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "position",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalPosts.attributes.position.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    createdAt: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "created_at",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "created_at",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalPosts.attributes.created_at.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    updatedAt: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "updated_at",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "updated_at",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalPosts.attributes.updated_at.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    isExplicitlyArchived: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "is_explicitly_archived",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "is_explicitly_archived",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalPosts.attributes.is_explicitly_archived.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    archivedAt: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "archived_at",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "archived_at",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_relationalPosts.attributes.archived_at.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  FirstPartyVulnerabilitiesConnection: {
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
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  FirstPartyVulnerabilitiesEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  FirstPartyVulnerabilitiesOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        first_party_vulnerabilitiesUniques[0].attributes.forEach(attributeName => {
          const attribute = firstPartyVulnerabilitiesCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
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
        first_party_vulnerabilitiesUniques[0].attributes.forEach(attributeName => {
          const attribute = firstPartyVulnerabilitiesCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
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
    },
    CVSS_SCORE_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "cvss_score",
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
    CVSS_SCORE_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "cvss_score",
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
    TEAM_NAME_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "team_name",
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
    TEAM_NAME_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "team_name",
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
  FirstPartyVulnerabilityCondition: {
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_firstPartyVulnerabilities.attributes.id.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_firstPartyVulnerabilities.attributes.name.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    cvssScore: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "cvss_score",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "cvss_score",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_firstPartyVulnerabilities.attributes.cvss_score.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    teamName: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "team_name",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "team_name",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_firstPartyVulnerabilities.attributes.team_name.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  ThirdPartyVulnerabilitiesConnection: {
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
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint);
    }
  },
  ThirdPartyVulnerabilitiesEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  ThirdPartyVulnerabilitiesOrderBy: {
    NATURAL: {
      applyPlan() {}
    },
    PRIMARY_KEY_ASC: {
      applyPlan(step) {
        third_party_vulnerabilitiesUniques[0].attributes.forEach(attributeName => {
          const attribute = thirdPartyVulnerabilitiesCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
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
        third_party_vulnerabilitiesUniques[0].attributes.forEach(attributeName => {
          const attribute = thirdPartyVulnerabilitiesCodec.attributes[attributeName];
          step.orderBy({
            codec: attribute.codec,
            fragment: sql`${step}.${sql.identifier(attributeName)}`,
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
    },
    CVSS_SCORE_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "cvss_score",
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
    CVSS_SCORE_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "cvss_score",
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
    VENDOR_NAME_ASC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "vendor_name",
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
    VENDOR_NAME_DESC: {
      applyPlan(plan) {
        if (!(plan instanceof PgSelectStep) && !(plan instanceof PgUnionAllStep)) {
          throw new Error("Expected a PgSelectStep or PgUnionAllStep when applying ordering value");
        }
        plan.orderBy({
          attribute: "vendor_name",
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
  ThirdPartyVulnerabilityCondition: {
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_thirdPartyVulnerabilities.attributes.id.codec)}`;
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
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_thirdPartyVulnerabilities.attributes.name.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    cvssScore: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "cvss_score",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "cvss_score",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_thirdPartyVulnerabilities.attributes.cvss_score.codec)}`;
            }
          });
        }
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    vendorName: {
      applyPlan($condition, val) {
        if (val.getRaw().evalIs(null)) {
          $condition.where({
            type: "attribute",
            attribute: "vendor_name",
            callback(expression) {
              return sql`${expression} is null`;
            }
          });
        } else {
          $condition.where({
            type: "attribute",
            attribute: "vendor_name",
            callback(expression) {
              return sql`${expression} = ${$condition.placeholder(val.get(), spec_thirdPartyVulnerabilities.attributes.vendor_name.codec)}`;
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
    createOrganization: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(resource_organizationsPgResource, Object.create(null))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    createPerson: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(otherSource_peoplePgResource, Object.create(null))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    createRelationalItemRelationCompositePk: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(relational_item_relation_composite_pks_relational_item_relation_composite_pksPgResource, Object.create(null))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    createSingleTableItemRelationCompositePk: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(otherSource_single_table_item_relation_composite_pksPgResource, Object.create(null))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    createRelationalItemRelation: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(relational_item_relations_relational_item_relationsPgResource, Object.create(null))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    createSingleTableItemRelation: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(otherSource_single_table_item_relationsPgResource, Object.create(null))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    createLogEntry: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(resource_log_entriesPgResource, Object.create(null))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    createFirstPartyVulnerability: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(resource_first_party_vulnerabilitiesPgResource, Object.create(null))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    createThirdPartyVulnerability: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(resource_third_party_vulnerabilitiesPgResource, Object.create(null))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    createAwsApplication: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(resource_aws_applicationsPgResource, Object.create(null))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    createGcpApplication: {
      plan(_, args) {
        const plan = object({
          result: pgInsertSingle(resource_gcp_applicationsPgResource, Object.create(null))
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          autoApplyAfterParentPlan: true,
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    updateOrganizationByOrganizationId: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(resource_organizationsPgResource, {
            organization_id: args.get(['input', "organizationId"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    updateOrganizationByName: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(resource_organizationsPgResource, {
            name: args.get(['input', "name"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    updatePersonByPersonId: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(otherSource_peoplePgResource, {
            person_id: args.get(['input', "personId"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    updatePersonByUsername: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(otherSource_peoplePgResource, {
            username: args.get(['input', "username"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    updateRelationalItemRelationCompositePkByParentIdAndChildId: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(relational_item_relation_composite_pks_relational_item_relation_composite_pksPgResource, {
            parent_id: args.get(['input', "parentId"]),
            child_id: args.get(['input', "childId"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    updateSingleTableItemRelationCompositePkByParentIdAndChildId: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(otherSource_single_table_item_relation_composite_pksPgResource, {
            parent_id: args.get(['input', "parentId"]),
            child_id: args.get(['input', "childId"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    updateRelationalItemRelationById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(relational_item_relations_relational_item_relationsPgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    updateRelationalItemRelationByParentIdAndChildId: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(relational_item_relations_relational_item_relationsPgResource, {
            parent_id: args.get(['input', "parentId"]),
            child_id: args.get(['input', "childId"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    updateSingleTableItemRelationById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(otherSource_single_table_item_relationsPgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    updateSingleTableItemRelationByParentIdAndChildId: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(otherSource_single_table_item_relationsPgResource, {
            parent_id: args.get(['input', "parentId"]),
            child_id: args.get(['input', "childId"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    updateLogEntryById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(resource_log_entriesPgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    updateFirstPartyVulnerabilityById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(resource_first_party_vulnerabilitiesPgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    updateThirdPartyVulnerabilityById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(resource_third_party_vulnerabilitiesPgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    updateAwsApplicationById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(resource_aws_applicationsPgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    updateGcpApplicationById: {
      plan(_$root, args) {
        const plan = object({
          result: pgUpdateSingle(resource_gcp_applicationsPgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    deleteOrganizationByOrganizationId: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(resource_organizationsPgResource, {
            organization_id: args.get(['input', "organizationId"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    deleteOrganizationByName: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(resource_organizationsPgResource, {
            name: args.get(['input', "name"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    deletePersonByPersonId: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(otherSource_peoplePgResource, {
            person_id: args.get(['input', "personId"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    deletePersonByUsername: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(otherSource_peoplePgResource, {
            username: args.get(['input', "username"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    deleteRelationalItemRelationCompositePkByParentIdAndChildId: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(relational_item_relation_composite_pks_relational_item_relation_composite_pksPgResource, {
            parent_id: args.get(['input', "parentId"]),
            child_id: args.get(['input', "childId"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    deleteSingleTableItemRelationCompositePkByParentIdAndChildId: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(otherSource_single_table_item_relation_composite_pksPgResource, {
            parent_id: args.get(['input', "parentId"]),
            child_id: args.get(['input', "childId"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    deleteRelationalItemRelationById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(relational_item_relations_relational_item_relationsPgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    deleteRelationalItemRelationByParentIdAndChildId: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(relational_item_relations_relational_item_relationsPgResource, {
            parent_id: args.get(['input', "parentId"]),
            child_id: args.get(['input', "childId"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    deleteSingleTableItemRelationById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(otherSource_single_table_item_relationsPgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    deleteSingleTableItemRelationByParentIdAndChildId: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(otherSource_single_table_item_relationsPgResource, {
            parent_id: args.get(['input', "parentId"]),
            child_id: args.get(['input', "childId"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    deleteLogEntryById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(resource_log_entriesPgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    deleteFirstPartyVulnerabilityById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(resource_first_party_vulnerabilitiesPgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    deleteThirdPartyVulnerabilityById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(resource_third_party_vulnerabilitiesPgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    deleteAwsApplicationById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(resource_aws_applicationsPgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    },
    deleteGcpApplicationById: {
      plan(_$root, args) {
        const plan = object({
          result: pgDeleteSingle(resource_gcp_applicationsPgResource, {
            id: args.get(['input', "id"])
          })
        });
        args.apply(plan);
        return plan;
      },
      args: {
        input: {
          applyPlan(_, $object) {
            return $object;
          }
        }
      }
    }
  },
  CreateOrganizationPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    organization($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    organizationEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = organizationsUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return resource_organizationsPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("OrganizationsOrderBy"));
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
  CreateOrganizationInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    organization: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  OrganizationInput: {
    "__inputPlan": function OrganizationInput_inputPlan() {
      return object(Object.create(null));
    },
    organizationId: {
      applyPlan($insert, val) {
        $insert.set("organization_id", val.get());
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
  CreatePersonPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    person($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
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
            const spec = peopleUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return otherSource_peoplePgResource.find(spec);
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
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    person: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  PersonInput: {
    "__inputPlan": function PersonInput_inputPlan() {
      return object(Object.create(null));
    },
    personId: {
      applyPlan($insert, val) {
        $insert.set("person_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    username: {
      applyPlan($insert, val) {
        $insert.set("username", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreateRelationalItemRelationCompositePkPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    relationalItemRelationCompositePk($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    relationalItemRelationCompositePkEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = relational_item_relation_composite_pksUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return relational_item_relation_composite_pks_relational_item_relation_composite_pksPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("RelationalItemRelationCompositePksOrderBy"));
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
    relationalItemByChildId($record) {
      return otherSource_relational_itemsPgResource.get({
        id: $record.get("result").get("child_id")
      });
    },
    relationalItemByParentId($record) {
      return otherSource_relational_itemsPgResource.get({
        id: $record.get("result").get("parent_id")
      });
    }
  },
  CreateRelationalItemRelationCompositePkInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    relationalItemRelationCompositePk: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  RelationalItemRelationCompositePkInput: {
    "__inputPlan": function RelationalItemRelationCompositePkInput_inputPlan() {
      return object(Object.create(null));
    },
    parentId: {
      applyPlan($insert, val) {
        $insert.set("parent_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    childId: {
      applyPlan($insert, val) {
        $insert.set("child_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreateSingleTableItemRelationCompositePkPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    singleTableItemRelationCompositePk($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    singleTableItemRelationCompositePkEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = single_table_item_relation_composite_pksUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return otherSource_single_table_item_relation_composite_pksPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("SingleTableItemRelationCompositePksOrderBy"));
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
    singleTableItemByChildId($record) {
      return otherSource_single_table_itemsPgResource.get({
        id: $record.get("result").get("child_id")
      });
    },
    singleTableItemByParentId($record) {
      return otherSource_single_table_itemsPgResource.get({
        id: $record.get("result").get("parent_id")
      });
    }
  },
  CreateSingleTableItemRelationCompositePkInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    singleTableItemRelationCompositePk: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  SingleTableItemRelationCompositePkInput: {
    "__inputPlan": function SingleTableItemRelationCompositePkInput_inputPlan() {
      return object(Object.create(null));
    },
    parentId: {
      applyPlan($insert, val) {
        $insert.set("parent_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    childId: {
      applyPlan($insert, val) {
        $insert.set("child_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreateRelationalItemRelationPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    relationalItemRelation($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    relationalItemRelationEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = relational_item_relationsUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return relational_item_relations_relational_item_relationsPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("RelationalItemRelationsOrderBy"));
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
    relationalItemByChildId($record) {
      return otherSource_relational_itemsPgResource.get({
        id: $record.get("result").get("child_id")
      });
    },
    relationalItemByParentId($record) {
      return otherSource_relational_itemsPgResource.get({
        id: $record.get("result").get("parent_id")
      });
    }
  },
  CreateRelationalItemRelationInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    relationalItemRelation: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  RelationalItemRelationInput: {
    "__inputPlan": function RelationalItemRelationInput_inputPlan() {
      return object(Object.create(null));
    },
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    parentId: {
      applyPlan($insert, val) {
        $insert.set("parent_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    childId: {
      applyPlan($insert, val) {
        $insert.set("child_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreateSingleTableItemRelationPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    singleTableItemRelation($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    singleTableItemRelationEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = single_table_item_relationsUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return otherSource_single_table_item_relationsPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("SingleTableItemRelationsOrderBy"));
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
    singleTableItemByChildId($record) {
      return otherSource_single_table_itemsPgResource.get({
        id: $record.get("result").get("child_id")
      });
    },
    singleTableItemByParentId($record) {
      return otherSource_single_table_itemsPgResource.get({
        id: $record.get("result").get("parent_id")
      });
    }
  },
  CreateSingleTableItemRelationInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    singleTableItemRelation: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  SingleTableItemRelationInput: {
    "__inputPlan": function SingleTableItemRelationInput_inputPlan() {
      return object(Object.create(null));
    },
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    parentId: {
      applyPlan($insert, val) {
        $insert.set("parent_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    childId: {
      applyPlan($insert, val) {
        $insert.set("child_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreateLogEntryPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    logEntry($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    logEntryEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = log_entriesUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return resource_log_entriesPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("LogEntriesOrderBy"));
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
    organizationByOrganizationId($record) {
      return resource_organizationsPgResource.get({
        organization_id: $record.get("result").get("organization_id")
      });
    },
    personByPersonId($record) {
      return otherSource_peoplePgResource.get({
        person_id: $record.get("result").get("person_id")
      });
    }
  },
  CreateLogEntryInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    logEntry: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  LogEntryInput: {
    "__inputPlan": function LogEntryInput_inputPlan() {
      return object(Object.create(null));
    },
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    personId: {
      applyPlan($insert, val) {
        $insert.set("person_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    organizationId: {
      applyPlan($insert, val) {
        $insert.set("organization_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    text: {
      applyPlan($insert, val) {
        $insert.set("text", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreateFirstPartyVulnerabilityPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    firstPartyVulnerability($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    firstPartyVulnerabilityEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = first_party_vulnerabilitiesUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return resource_first_party_vulnerabilitiesPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("FirstPartyVulnerabilitiesOrderBy"));
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
  CreateFirstPartyVulnerabilityInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    firstPartyVulnerability: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  FirstPartyVulnerabilityInput: {
    "__inputPlan": function FirstPartyVulnerabilityInput_inputPlan() {
      return object(Object.create(null));
    },
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
    },
    cvssScore: {
      applyPlan($insert, val) {
        $insert.set("cvss_score", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    teamName: {
      applyPlan($insert, val) {
        $insert.set("team_name", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreateThirdPartyVulnerabilityPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    thirdPartyVulnerability($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    thirdPartyVulnerabilityEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = third_party_vulnerabilitiesUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return resource_third_party_vulnerabilitiesPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("ThirdPartyVulnerabilitiesOrderBy"));
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
  CreateThirdPartyVulnerabilityInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    thirdPartyVulnerability: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  ThirdPartyVulnerabilityInput: {
    "__inputPlan": function ThirdPartyVulnerabilityInput_inputPlan() {
      return object(Object.create(null));
    },
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
    },
    cvssScore: {
      applyPlan($insert, val) {
        $insert.set("cvss_score", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    vendorName: {
      applyPlan($insert, val) {
        $insert.set("vendor_name", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreateAwsApplicationPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    awsApplication($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    awsApplicationEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = aws_applicationsUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return resource_aws_applicationsPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("AwsApplicationsOrderBy"));
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
    organizationByOrganizationId($record) {
      return resource_organizationsPgResource.get({
        organization_id: $record.get("result").get("organization_id")
      });
    },
    personByPersonId($record) {
      return otherSource_peoplePgResource.get({
        person_id: $record.get("result").get("person_id")
      });
    }
  },
  CreateAwsApplicationInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    awsApplication: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  AwsApplicationInput: {
    "__inputPlan": function AwsApplicationInput_inputPlan() {
      return object(Object.create(null));
    },
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
    },
    lastDeployed: {
      applyPlan($insert, val) {
        $insert.set("last_deployed", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    personId: {
      applyPlan($insert, val) {
        $insert.set("person_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    organizationId: {
      applyPlan($insert, val) {
        $insert.set("organization_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    awsId: {
      applyPlan($insert, val) {
        $insert.set("aws_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  CreateGcpApplicationPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    gcpApplication($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    gcpApplicationEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = gcp_applicationsUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return resource_gcp_applicationsPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("GcpApplicationsOrderBy"));
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
    organizationByOrganizationId($record) {
      return resource_organizationsPgResource.get({
        organization_id: $record.get("result").get("organization_id")
      });
    },
    personByPersonId($record) {
      return otherSource_peoplePgResource.get({
        person_id: $record.get("result").get("person_id")
      });
    }
  },
  CreateGcpApplicationInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      },
      autoApplyAfterParentApplyPlan: true
    },
    gcpApplication: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      },
      autoApplyAfterParentApplyPlan: true
    }
  },
  GcpApplicationInput: {
    "__inputPlan": function GcpApplicationInput_inputPlan() {
      return object(Object.create(null));
    },
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
    },
    lastDeployed: {
      applyPlan($insert, val) {
        $insert.set("last_deployed", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    personId: {
      applyPlan($insert, val) {
        $insert.set("person_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    organizationId: {
      applyPlan($insert, val) {
        $insert.set("organization_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    gcpId: {
      applyPlan($insert, val) {
        $insert.set("gcp_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateOrganizationPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    organization($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    organizationEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = organizationsUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return resource_organizationsPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("OrganizationsOrderBy"));
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
  UpdateOrganizationByOrganizationIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    organizationId: undefined,
    organizationPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  OrganizationPatch: {
    "__inputPlan": function OrganizationPatch_inputPlan() {
      return object(Object.create(null));
    },
    organizationId: {
      applyPlan($insert, val) {
        $insert.set("organization_id", val.get());
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
  UpdateOrganizationByNameInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    name: undefined,
    organizationPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  UpdatePersonPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    person($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
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
            const spec = peopleUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return otherSource_peoplePgResource.find(spec);
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
  UpdatePersonByPersonIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    personId: undefined,
    personPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  PersonPatch: {
    "__inputPlan": function PersonPatch_inputPlan() {
      return object(Object.create(null));
    },
    personId: {
      applyPlan($insert, val) {
        $insert.set("person_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    username: {
      applyPlan($insert, val) {
        $insert.set("username", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdatePersonByUsernameInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    username: undefined,
    personPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  UpdateRelationalItemRelationCompositePkPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    relationalItemRelationCompositePk($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    relationalItemRelationCompositePkEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = relational_item_relation_composite_pksUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return relational_item_relation_composite_pks_relational_item_relation_composite_pksPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("RelationalItemRelationCompositePksOrderBy"));
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
    relationalItemByChildId($record) {
      return otherSource_relational_itemsPgResource.get({
        id: $record.get("result").get("child_id")
      });
    },
    relationalItemByParentId($record) {
      return otherSource_relational_itemsPgResource.get({
        id: $record.get("result").get("parent_id")
      });
    }
  },
  UpdateRelationalItemRelationCompositePkByParentIdAndChildIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    parentId: undefined,
    childId: undefined,
    relationalItemRelationCompositePkPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  RelationalItemRelationCompositePkPatch: {
    "__inputPlan": function RelationalItemRelationCompositePkPatch_inputPlan() {
      return object(Object.create(null));
    },
    parentId: {
      applyPlan($insert, val) {
        $insert.set("parent_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    childId: {
      applyPlan($insert, val) {
        $insert.set("child_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateSingleTableItemRelationCompositePkPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    singleTableItemRelationCompositePk($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    singleTableItemRelationCompositePkEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = single_table_item_relation_composite_pksUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return otherSource_single_table_item_relation_composite_pksPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("SingleTableItemRelationCompositePksOrderBy"));
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
    singleTableItemByChildId($record) {
      return otherSource_single_table_itemsPgResource.get({
        id: $record.get("result").get("child_id")
      });
    },
    singleTableItemByParentId($record) {
      return otherSource_single_table_itemsPgResource.get({
        id: $record.get("result").get("parent_id")
      });
    }
  },
  UpdateSingleTableItemRelationCompositePkByParentIdAndChildIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    parentId: undefined,
    childId: undefined,
    singleTableItemRelationCompositePkPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  SingleTableItemRelationCompositePkPatch: {
    "__inputPlan": function SingleTableItemRelationCompositePkPatch_inputPlan() {
      return object(Object.create(null));
    },
    parentId: {
      applyPlan($insert, val) {
        $insert.set("parent_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    childId: {
      applyPlan($insert, val) {
        $insert.set("child_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateRelationalItemRelationPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    relationalItemRelation($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    relationalItemRelationEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = relational_item_relationsUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return relational_item_relations_relational_item_relationsPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("RelationalItemRelationsOrderBy"));
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
    relationalItemByChildId($record) {
      return otherSource_relational_itemsPgResource.get({
        id: $record.get("result").get("child_id")
      });
    },
    relationalItemByParentId($record) {
      return otherSource_relational_itemsPgResource.get({
        id: $record.get("result").get("parent_id")
      });
    }
  },
  UpdateRelationalItemRelationByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined,
    relationalItemRelationPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  RelationalItemRelationPatch: {
    "__inputPlan": function RelationalItemRelationPatch_inputPlan() {
      return object(Object.create(null));
    },
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    parentId: {
      applyPlan($insert, val) {
        $insert.set("parent_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    childId: {
      applyPlan($insert, val) {
        $insert.set("child_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateRelationalItemRelationByParentIdAndChildIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    parentId: undefined,
    childId: undefined,
    relationalItemRelationPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  UpdateSingleTableItemRelationPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    singleTableItemRelation($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    singleTableItemRelationEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = single_table_item_relationsUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return otherSource_single_table_item_relationsPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("SingleTableItemRelationsOrderBy"));
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
    singleTableItemByChildId($record) {
      return otherSource_single_table_itemsPgResource.get({
        id: $record.get("result").get("child_id")
      });
    },
    singleTableItemByParentId($record) {
      return otherSource_single_table_itemsPgResource.get({
        id: $record.get("result").get("parent_id")
      });
    }
  },
  UpdateSingleTableItemRelationByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined,
    singleTableItemRelationPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  SingleTableItemRelationPatch: {
    "__inputPlan": function SingleTableItemRelationPatch_inputPlan() {
      return object(Object.create(null));
    },
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    parentId: {
      applyPlan($insert, val) {
        $insert.set("parent_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    childId: {
      applyPlan($insert, val) {
        $insert.set("child_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateSingleTableItemRelationByParentIdAndChildIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    parentId: undefined,
    childId: undefined,
    singleTableItemRelationPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  UpdateLogEntryPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    logEntry($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    logEntryEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = log_entriesUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return resource_log_entriesPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("LogEntriesOrderBy"));
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
    organizationByOrganizationId($record) {
      return resource_organizationsPgResource.get({
        organization_id: $record.get("result").get("organization_id")
      });
    },
    personByPersonId($record) {
      return otherSource_peoplePgResource.get({
        person_id: $record.get("result").get("person_id")
      });
    }
  },
  UpdateLogEntryByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined,
    logEntryPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  LogEntryPatch: {
    "__inputPlan": function LogEntryPatch_inputPlan() {
      return object(Object.create(null));
    },
    id: {
      applyPlan($insert, val) {
        $insert.set("id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    personId: {
      applyPlan($insert, val) {
        $insert.set("person_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    organizationId: {
      applyPlan($insert, val) {
        $insert.set("organization_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    text: {
      applyPlan($insert, val) {
        $insert.set("text", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateFirstPartyVulnerabilityPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    firstPartyVulnerability($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    firstPartyVulnerabilityEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = first_party_vulnerabilitiesUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return resource_first_party_vulnerabilitiesPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("FirstPartyVulnerabilitiesOrderBy"));
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
  UpdateFirstPartyVulnerabilityByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined,
    firstPartyVulnerabilityPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  FirstPartyVulnerabilityPatch: {
    "__inputPlan": function FirstPartyVulnerabilityPatch_inputPlan() {
      return object(Object.create(null));
    },
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
    },
    cvssScore: {
      applyPlan($insert, val) {
        $insert.set("cvss_score", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    teamName: {
      applyPlan($insert, val) {
        $insert.set("team_name", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateThirdPartyVulnerabilityPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    thirdPartyVulnerability($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    thirdPartyVulnerabilityEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = third_party_vulnerabilitiesUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return resource_third_party_vulnerabilitiesPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("ThirdPartyVulnerabilitiesOrderBy"));
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
  UpdateThirdPartyVulnerabilityByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined,
    thirdPartyVulnerabilityPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  ThirdPartyVulnerabilityPatch: {
    "__inputPlan": function ThirdPartyVulnerabilityPatch_inputPlan() {
      return object(Object.create(null));
    },
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
    },
    cvssScore: {
      applyPlan($insert, val) {
        $insert.set("cvss_score", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    vendorName: {
      applyPlan($insert, val) {
        $insert.set("vendor_name", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateAwsApplicationPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    awsApplication($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    awsApplicationEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = aws_applicationsUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return resource_aws_applicationsPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("AwsApplicationsOrderBy"));
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
    organizationByOrganizationId($record) {
      return resource_organizationsPgResource.get({
        organization_id: $record.get("result").get("organization_id")
      });
    },
    personByPersonId($record) {
      return otherSource_peoplePgResource.get({
        person_id: $record.get("result").get("person_id")
      });
    }
  },
  UpdateAwsApplicationByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined,
    awsApplicationPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  AwsApplicationPatch: {
    "__inputPlan": function AwsApplicationPatch_inputPlan() {
      return object(Object.create(null));
    },
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
    },
    lastDeployed: {
      applyPlan($insert, val) {
        $insert.set("last_deployed", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    personId: {
      applyPlan($insert, val) {
        $insert.set("person_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    organizationId: {
      applyPlan($insert, val) {
        $insert.set("organization_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    awsId: {
      applyPlan($insert, val) {
        $insert.set("aws_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  UpdateGcpApplicationPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    gcpApplication($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    gcpApplicationEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = gcp_applicationsUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return resource_gcp_applicationsPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("GcpApplicationsOrderBy"));
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
    organizationByOrganizationId($record) {
      return resource_organizationsPgResource.get({
        organization_id: $record.get("result").get("organization_id")
      });
    },
    personByPersonId($record) {
      return otherSource_peoplePgResource.get({
        person_id: $record.get("result").get("person_id")
      });
    }
  },
  UpdateGcpApplicationByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined,
    gcpApplicationPatch: {
      applyPlan($object) {
        const $record = $object.getStepForKey("result");
        return $record.setPlan();
      }
    }
  },
  GcpApplicationPatch: {
    "__inputPlan": function GcpApplicationPatch_inputPlan() {
      return object(Object.create(null));
    },
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
    },
    lastDeployed: {
      applyPlan($insert, val) {
        $insert.set("last_deployed", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    personId: {
      applyPlan($insert, val) {
        $insert.set("person_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    organizationId: {
      applyPlan($insert, val) {
        $insert.set("organization_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    },
    gcpId: {
      applyPlan($insert, val) {
        $insert.set("gcp_id", val.get());
      },
      autoApplyAfterParentInputPlan: true,
      autoApplyAfterParentApplyPlan: true
    }
  },
  DeleteOrganizationPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    organization($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    organizationEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = organizationsUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return resource_organizationsPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("OrganizationsOrderBy"));
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
  DeleteOrganizationByOrganizationIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    organizationId: undefined
  },
  DeleteOrganizationByNameInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    name: undefined
  },
  DeletePersonPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    person($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
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
            const spec = peopleUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return otherSource_peoplePgResource.find(spec);
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
  DeletePersonByPersonIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    personId: undefined
  },
  DeletePersonByUsernameInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    username: undefined
  },
  DeleteRelationalItemRelationCompositePkPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    relationalItemRelationCompositePk($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    relationalItemRelationCompositePkEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = relational_item_relation_composite_pksUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return relational_item_relation_composite_pks_relational_item_relation_composite_pksPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("RelationalItemRelationCompositePksOrderBy"));
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
    relationalItemByChildId($record) {
      return otherSource_relational_itemsPgResource.get({
        id: $record.get("result").get("child_id")
      });
    },
    relationalItemByParentId($record) {
      return otherSource_relational_itemsPgResource.get({
        id: $record.get("result").get("parent_id")
      });
    }
  },
  DeleteRelationalItemRelationCompositePkByParentIdAndChildIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    parentId: undefined,
    childId: undefined
  },
  DeleteSingleTableItemRelationCompositePkPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    singleTableItemRelationCompositePk($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    singleTableItemRelationCompositePkEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = single_table_item_relation_composite_pksUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return otherSource_single_table_item_relation_composite_pksPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("SingleTableItemRelationCompositePksOrderBy"));
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
    singleTableItemByChildId($record) {
      return otherSource_single_table_itemsPgResource.get({
        id: $record.get("result").get("child_id")
      });
    },
    singleTableItemByParentId($record) {
      return otherSource_single_table_itemsPgResource.get({
        id: $record.get("result").get("parent_id")
      });
    }
  },
  DeleteSingleTableItemRelationCompositePkByParentIdAndChildIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    parentId: undefined,
    childId: undefined
  },
  DeleteRelationalItemRelationPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    relationalItemRelation($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    relationalItemRelationEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = relational_item_relationsUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return relational_item_relations_relational_item_relationsPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("RelationalItemRelationsOrderBy"));
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
    relationalItemByChildId($record) {
      return otherSource_relational_itemsPgResource.get({
        id: $record.get("result").get("child_id")
      });
    },
    relationalItemByParentId($record) {
      return otherSource_relational_itemsPgResource.get({
        id: $record.get("result").get("parent_id")
      });
    }
  },
  DeleteRelationalItemRelationByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined
  },
  DeleteRelationalItemRelationByParentIdAndChildIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    parentId: undefined,
    childId: undefined
  },
  DeleteSingleTableItemRelationPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    singleTableItemRelation($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    singleTableItemRelationEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = single_table_item_relationsUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return otherSource_single_table_item_relationsPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("SingleTableItemRelationsOrderBy"));
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
    singleTableItemByChildId($record) {
      return otherSource_single_table_itemsPgResource.get({
        id: $record.get("result").get("child_id")
      });
    },
    singleTableItemByParentId($record) {
      return otherSource_single_table_itemsPgResource.get({
        id: $record.get("result").get("parent_id")
      });
    }
  },
  DeleteSingleTableItemRelationByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined
  },
  DeleteSingleTableItemRelationByParentIdAndChildIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    parentId: undefined,
    childId: undefined
  },
  DeleteLogEntryPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    logEntry($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    logEntryEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = log_entriesUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return resource_log_entriesPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("LogEntriesOrderBy"));
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
    organizationByOrganizationId($record) {
      return resource_organizationsPgResource.get({
        organization_id: $record.get("result").get("organization_id")
      });
    },
    personByPersonId($record) {
      return otherSource_peoplePgResource.get({
        person_id: $record.get("result").get("person_id")
      });
    }
  },
  DeleteLogEntryByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined
  },
  DeleteFirstPartyVulnerabilityPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    firstPartyVulnerability($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    firstPartyVulnerabilityEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = first_party_vulnerabilitiesUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return resource_first_party_vulnerabilitiesPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("FirstPartyVulnerabilitiesOrderBy"));
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
  DeleteFirstPartyVulnerabilityByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined
  },
  DeleteThirdPartyVulnerabilityPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    thirdPartyVulnerability($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    thirdPartyVulnerabilityEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = third_party_vulnerabilitiesUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return resource_third_party_vulnerabilitiesPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("ThirdPartyVulnerabilitiesOrderBy"));
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
  DeleteThirdPartyVulnerabilityByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined
  },
  DeleteAwsApplicationPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    awsApplication($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    awsApplicationEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = aws_applicationsUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return resource_aws_applicationsPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("AwsApplicationsOrderBy"));
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
    organizationByOrganizationId($record) {
      return resource_organizationsPgResource.get({
        organization_id: $record.get("result").get("organization_id")
      });
    },
    personByPersonId($record) {
      return otherSource_peoplePgResource.get({
        person_id: $record.get("result").get("person_id")
      });
    }
  },
  DeleteAwsApplicationByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined
  },
  DeleteGcpApplicationPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("clientMutationId", true) ?? constant(null);
    },
    gcpApplication($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    gcpApplicationEdge: {
      plan($mutation, args, info) {
        const $result = $mutation.getStepForKey("result", true);
        if (!$result) {
          return constant(null);
        }
        const $select = (() => {
          if ($result instanceof PgDeleteSingleStep) {
            return pgSelectFromRecord($result.resource, $result.record());
          } else {
            const spec = gcp_applicationsUniques[0].attributes.reduce((memo, attributeName) => {
              memo[attributeName] = $result.get(attributeName);
              return memo;
            }, Object.create(null));
            return resource_gcp_applicationsPgResource.find(spec);
          }
        })();
        // Perform ordering
        const $value = args.getRaw("orderBy");
        applyOrderToPlan($select, $value, info.schema.getType("GcpApplicationsOrderBy"));
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
    organizationByOrganizationId($record) {
      return resource_organizationsPgResource.get({
        organization_id: $record.get("result").get("organization_id")
      });
    },
    personByPersonId($record) {
      return otherSource_peoplePgResource.get({
        person_id: $record.get("result").get("person_id")
      });
    }
  },
  DeleteGcpApplicationByIdInput: {
    clientMutationId: {
      applyPlan($input, val) {
        $input.set("clientMutationId", val.get());
      }
    },
    id: undefined
  }
};
export const schema = makeGrafastSchema({
  typeDefs: typeDefs,
  plans: plans
});
