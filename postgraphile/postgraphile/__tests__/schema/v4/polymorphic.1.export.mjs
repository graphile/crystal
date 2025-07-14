import { PgDeleteSingleStep, PgExecutor, PgResource, PgSelectSingleStep, PgSelectStep, PgUnionAllSingleStep, TYPES, assertPgClassSingleStep, enumCodec, makeRegistry, pgClassExpression, pgDeleteSingle, pgFromExpression, pgInsertSingle, pgSelectFromRecord, pgSelectSingleFromRecord, pgUnionAll, pgUpdateSingle, recordCodec, sqlFromArgDigests, sqlValueWithCodec } from "@dataplan/pg";
import { ConnectionStep, ConstantStep, EdgeStep, ObjectStep, __ValueStep, access, assertEdgeCapableStep, assertExecutableStep, assertPageInfoCapableStep, bakedInput, bakedInputRuntime, connection, constant, context, createObjectAndApplyChildren, first, get as get2, inhibitOnNull, inspect, lambda, list, makeDecodeNodeId, makeGrafastSchema, object, operationPlan, rootValue, specFromNodeId, stepAMayDependOnStepB, trap } from "grafast";
import { GraphQLError, Kind } from "graphql";
import { sql } from "pg-sql2";
const nodeIdHandler_SingleTableTopic_codec_base64JSON = {
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
  attributes: {
    __proto__: null,
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
  },
  description: undefined,
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
};
const awsApplicationFirstPartyVulnerabilitiesCodec = recordCodec(spec_awsApplicationFirstPartyVulnerabilities);
const awsApplicationThirdPartyVulnerabilitiesIdentifier = sql.identifier("polymorphic", "aws_application_third_party_vulnerabilities");
const spec_awsApplicationThirdPartyVulnerabilities = {
  name: "awsApplicationThirdPartyVulnerabilities",
  identifier: awsApplicationThirdPartyVulnerabilitiesIdentifier,
  attributes: {
    __proto__: null,
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
  },
  description: undefined,
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
};
const awsApplicationThirdPartyVulnerabilitiesCodec = recordCodec(spec_awsApplicationThirdPartyVulnerabilities);
const gcpApplicationFirstPartyVulnerabilitiesIdentifier = sql.identifier("polymorphic", "gcp_application_first_party_vulnerabilities");
const spec_gcpApplicationFirstPartyVulnerabilities = {
  name: "gcpApplicationFirstPartyVulnerabilities",
  identifier: gcpApplicationFirstPartyVulnerabilitiesIdentifier,
  attributes: {
    __proto__: null,
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
  },
  description: undefined,
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
};
const gcpApplicationFirstPartyVulnerabilitiesCodec = recordCodec(spec_gcpApplicationFirstPartyVulnerabilities);
const gcpApplicationThirdPartyVulnerabilitiesIdentifier = sql.identifier("polymorphic", "gcp_application_third_party_vulnerabilities");
const spec_gcpApplicationThirdPartyVulnerabilities = {
  name: "gcpApplicationThirdPartyVulnerabilities",
  identifier: gcpApplicationThirdPartyVulnerabilitiesIdentifier,
  attributes: {
    __proto__: null,
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
  },
  description: undefined,
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
};
const gcpApplicationThirdPartyVulnerabilitiesCodec = recordCodec(spec_gcpApplicationThirdPartyVulnerabilities);
const organizationsIdentifier = sql.identifier("polymorphic", "organizations");
const organizationsCodec = recordCodec({
  name: "organizations",
  identifier: organizationsIdentifier,
  attributes: {
    __proto__: null,
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
  },
  description: undefined,
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
const spec_people = {
  name: "people",
  identifier: peopleIdentifier,
  attributes: {
    __proto__: null,
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
  },
  description: undefined,
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
};
const peopleCodec = recordCodec(spec_people);
const prioritiesIdentifier = sql.identifier("polymorphic", "priorities");
const spec_priorities = {
  name: "priorities",
  identifier: prioritiesIdentifier,
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
    title: {
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
    tags: {
      __proto__: null
    }
  }
});
const spec_relationalChecklists = {
  name: "relationalChecklists",
  identifier: relationalChecklistsIdentifier,
  attributes: {
    __proto__: null,
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
  },
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "relational_checklists"
    },
    tags: {
      __proto__: null
    },
    relationalInterfaceCodecName: "relationalItems"
  },
  executor: executor
};
const relationalChecklistsCodec = recordCodec(spec_relationalChecklists);
const relationalItemRelationCompositePksIdentifier = sql.identifier("polymorphic", "relational_item_relation_composite_pks");
const relationalItemRelationCompositePksCodec = recordCodec({
  name: "relationalItemRelationCompositePks",
  identifier: relationalItemRelationCompositePksIdentifier,
  attributes: {
    __proto__: null,
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
  },
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "relational_item_relation_composite_pks"
    },
    tags: {
      __proto__: null
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
  },
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "relational_topics"
    },
    tags: {
      __proto__: null
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
  },
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "single_table_item_relation_composite_pks"
    },
    tags: {
      __proto__: null
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
  },
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "relational_checklist_items"
    },
    tags: {
      __proto__: null
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
  },
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "relational_dividers"
    },
    tags: {
      __proto__: null
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
  },
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "relational_item_relations"
    },
    tags: {
      __proto__: null
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
  },
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "single_table_item_relations"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
});
const logEntriesIdentifier = sql.identifier("polymorphic", "log_entries");
const spec_logEntries = {
  name: "logEntries",
  identifier: logEntriesIdentifier,
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
  },
  description: undefined,
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
};
const logEntriesCodec = recordCodec(spec_logEntries);
const relationalPostsIdentifier = sql.identifier("polymorphic", "relational_posts");
const relationalPostsCodec = recordCodec({
  name: "relationalPosts",
  identifier: relationalPostsIdentifier,
  attributes: {
    __proto__: null,
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
  },
  description: undefined,
  extensions: {
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "polymorphic",
      name: "relational_posts"
    },
    tags: {
      __proto__: null
    },
    relationalInterfaceCodecName: "relationalItems"
  },
  executor: executor
});
const firstPartyVulnerabilitiesIdentifier = sql.identifier("polymorphic", "first_party_vulnerabilities");
const spec_firstPartyVulnerabilities = {
  name: "firstPartyVulnerabilities",
  identifier: firstPartyVulnerabilitiesIdentifier,
  attributes: {
    __proto__: null,
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
  },
  description: undefined,
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
};
const firstPartyVulnerabilitiesCodec = recordCodec(spec_firstPartyVulnerabilities);
const thirdPartyVulnerabilitiesIdentifier = sql.identifier("polymorphic", "third_party_vulnerabilities");
const spec_thirdPartyVulnerabilities = {
  name: "thirdPartyVulnerabilities",
  identifier: thirdPartyVulnerabilitiesIdentifier,
  attributes: {
    __proto__: null,
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
  },
  description: undefined,
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
};
const thirdPartyVulnerabilitiesCodec = recordCodec(spec_thirdPartyVulnerabilities);
const ApplicationIdentifier = sql.identifier("polymorphic", "applications");
const spec_Application = {
  name: "Application",
  identifier: ApplicationIdentifier,
  attributes: {
    __proto__: null,
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
  },
  description: undefined,
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
const spec_awsApplications = {
  name: "awsApplications",
  identifier: awsApplicationsIdentifier,
  attributes: {
    __proto__: null,
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
  },
  description: undefined,
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
};
const awsApplicationsCodec = recordCodec(spec_awsApplications);
const gcpApplicationsIdentifier = sql.identifier("polymorphic", "gcp_applications");
const spec_gcpApplications = {
  name: "gcpApplications",
  identifier: gcpApplicationsIdentifier,
  attributes: {
    __proto__: null,
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
  },
  description: undefined,
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
};
const gcpApplicationsCodec = recordCodec(spec_gcpApplications);
const singleTableItemsIdentifier = sql.identifier("polymorphic", "single_table_items");
const spec_singleTableItems = {
  name: "singleTableItems",
  identifier: singleTableItemsIdentifier,
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
  },
  description: undefined,
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
  },
  description: undefined,
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
const spec_Vulnerability = {
  name: "Vulnerability",
  identifier: sql.identifier("polymorphic", "vulnerabilities"),
  attributes: {
    __proto__: null,
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
  },
  description: undefined,
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
  },
  description: undefined,
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
      tags: {
        __proto__: null
      }
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
      tags: {
        __proto__: null
      }
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
      tags: {
        __proto__: null
      }
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
      tags: {
        __proto__: null
      }
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
    tags: {
      __proto__: null
    }
  }
}, {
  isPrimary: false,
  attributes: ["name"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
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
    tags: {
      __proto__: null
    }
  }
}, {
  isPrimary: false,
  attributes: ["username"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
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
const prioritiesUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const registryConfig_pgResources_priorities_priorities = {
  executor: executor,
  name: "priorities",
  identifier: "main.polymorphic.priorities",
  from: prioritiesIdentifier,
  codec: prioritiesCodec,
  uniques: prioritiesUniques,
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
    tags: {
      __proto__: null
    }
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
    tags: {
      __proto__: null
    }
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
    tags: {
      __proto__: null
    }
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
    tags: {
      __proto__: null
    }
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
    tags: {
      __proto__: null
    }
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
    tags: {
      __proto__: null
    }
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
    tags: {
      __proto__: null
    }
  }
}, {
  isPrimary: false,
  attributes: ["parent_id", "child_id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
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
    tags: {
      __proto__: null
    }
  }
}, {
  isPrimary: false,
  attributes: ["parent_id", "child_id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
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
    tags: {
      __proto__: null
    }
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
    tags: {
      __proto__: null
    }
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
const relational_topic_by_id_fnFunctionIdentifer = sql.identifier("polymorphic", "relational_topic_by_id_fn");
const first_party_vulnerabilities_cvss_score_intFunctionIdentifer = sql.identifier("polymorphic", "first_party_vulnerabilities_cvss_score_int");
const third_party_vulnerabilities_cvss_score_intFunctionIdentifer = sql.identifier("polymorphic", "third_party_vulnerabilities_cvss_score_int");
const first_party_vulnerabilitiesUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
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
    tags: {
      __proto__: null
    }
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
const favorite_applicationFunctionIdentifer = sql.identifier("polymorphic", "favorite_application");
const resourceConfig_Application = {
  executor: executor,
  name: "Application",
  identifier: "main.polymorphic.applications",
  from: ApplicationIdentifier,
  codec: ApplicationCodec,
  uniques: [],
  isVirtual: true,
  description: undefined,
  extensions: {
    description: undefined,
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
  }
};
const favorite_applicationsFunctionIdentifer = sql.identifier("polymorphic", "favorite_applications");
const aws_applicationsUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
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
    tags: {
      __proto__: null
    }
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
const single_table_items_meaning_of_lifeFunctionIdentifer = sql.identifier("polymorphic", "single_table_items_meaning_of_life");
const custom_delete_relational_itemFunctionIdentifer = sql.identifier("polymorphic", "custom_delete_relational_item");
const relational_items_meaning_of_lifeFunctionIdentifer = sql.identifier("polymorphic", "relational_items_meaning_of_life");
const single_table_itemsUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
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
    tags: {
      __proto__: null
    }
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
const all_relational_items_fnFunctionIdentifer = sql.identifier("polymorphic", "all_relational_items_fn");
const relational_item_by_id_fnFunctionIdentifer = sql.identifier("polymorphic", "relational_item_by_id_fn");
const relational_topics_parent_fnFunctionIdentifer = sql.identifier("polymorphic", "relational_topics_parent_fn");
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
    varchar: TYPES.varchar,
    bpchar: TYPES.bpchar,
    Vulnerability: recordCodec(spec_Vulnerability),
    ZeroImplementation: recordCodec(spec_ZeroImplementation)
  },
  pgResources: {
    __proto__: null,
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
    relational_topic_by_id_fn: PgResource.functionResourceOptions(registryConfig_pgResources_relational_topics_relational_topics, {
      name: "relational_topic_by_id_fn",
      identifier: "main.polymorphic.relational_topic_by_id_fn(int4)",
      from(...args) {
        return sql`${relational_topic_by_id_fnFunctionIdentifer}(${sqlFromArgDigests(args)})`;
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "polymorphic",
          name: "relational_topic_by_id_fn"
        },
        tags: {}
      },
      description: undefined
    }),
    first_party_vulnerabilities_cvss_score_int: {
      executor,
      name: "first_party_vulnerabilities_cvss_score_int",
      identifier: "main.polymorphic.first_party_vulnerabilities_cvss_score_int(polymorphic.first_party_vulnerabilities)",
      from(...args) {
        return sql`${first_party_vulnerabilities_cvss_score_intFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "r",
        required: true,
        notNull: false,
        codec: firstPartyVulnerabilitiesCodec
      }],
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: false,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "polymorphic",
          name: "first_party_vulnerabilities_cvss_score_int"
        },
        tags: {}
      },
      description: undefined
    },
    third_party_vulnerabilities_cvss_score_int: {
      executor,
      name: "third_party_vulnerabilities_cvss_score_int",
      identifier: "main.polymorphic.third_party_vulnerabilities_cvss_score_int(polymorphic.third_party_vulnerabilities)",
      from(...args) {
        return sql`${third_party_vulnerabilities_cvss_score_intFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "r",
        required: true,
        notNull: false,
        codec: thirdPartyVulnerabilitiesCodec
      }],
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: false,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "polymorphic",
          name: "third_party_vulnerabilities_cvss_score_int"
        },
        tags: {}
      },
      description: undefined
    },
    first_party_vulnerabilities: registryConfig_pgResources_first_party_vulnerabilities_first_party_vulnerabilities,
    third_party_vulnerabilities: registryConfig_pgResources_third_party_vulnerabilities_third_party_vulnerabilities,
    favorite_application: PgResource.functionResourceOptions(resourceConfig_Application, {
      name: "favorite_application",
      identifier: "main.polymorphic.favorite_application()",
      from(...args) {
        return sql`${favorite_applicationFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsArray: false,
      returnsSetof: false,
      isMutation: false,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "polymorphic",
          name: "favorite_application"
        },
        tags: {}
      },
      description: undefined
    }),
    favorite_applications: PgResource.functionResourceOptions(resourceConfig_Application, {
      name: "favorite_applications",
      identifier: "main.polymorphic.favorite_applications()",
      from(...args) {
        return sql`${favorite_applicationsFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsArray: false,
      returnsSetof: true,
      isMutation: false,
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "polymorphic",
          name: "favorite_applications"
        },
        tags: {}
      },
      description: undefined
    }),
    aws_applications: registryConfig_pgResources_aws_applications_aws_applications,
    gcp_applications: registryConfig_pgResources_gcp_applications_gcp_applications,
    single_table_items_meaning_of_life: {
      executor,
      name: "single_table_items_meaning_of_life",
      identifier: "main.polymorphic.single_table_items_meaning_of_life(polymorphic.single_table_items)",
      from(...args) {
        return sql`${single_table_items_meaning_of_lifeFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "sti",
        required: true,
        notNull: false,
        codec: singleTableItemsCodec
      }],
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: false,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "polymorphic",
          name: "single_table_items_meaning_of_life"
        },
        tags: {}
      },
      description: undefined
    },
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
      description: undefined
    },
    relational_items_meaning_of_life: {
      executor,
      name: "relational_items_meaning_of_life",
      identifier: "main.polymorphic.relational_items_meaning_of_life(polymorphic.relational_items)",
      from(...args) {
        return sql`${relational_items_meaning_of_lifeFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "ri",
        required: true,
        notNull: false,
        codec: relationalItemsCodec
      }],
      isUnique: !false,
      codec: TYPES.int,
      uniques: [],
      isMutation: false,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "polymorphic",
          name: "relational_items_meaning_of_life"
        },
        tags: {}
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
      hasImplicitOrder: true,
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
      hasImplicitOrder: false,
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
    relational_items: registryConfig_pgResources_relational_items_relational_items,
    all_relational_items_fn: PgResource.functionResourceOptions(registryConfig_pgResources_relational_items_relational_items, {
      name: "all_relational_items_fn",
      identifier: "main.polymorphic.all_relational_items_fn()",
      from(...args) {
        return sql`${all_relational_items_fnFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [],
      returnsArray: false,
      returnsSetof: true,
      isMutation: false,
      hasImplicitOrder: true,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "polymorphic",
          name: "all_relational_items_fn"
        },
        tags: {}
      },
      description: undefined
    }),
    relational_item_by_id_fn: PgResource.functionResourceOptions(registryConfig_pgResources_relational_items_relational_items, {
      name: "relational_item_by_id_fn",
      identifier: "main.polymorphic.relational_item_by_id_fn(int4)",
      from(...args) {
        return sql`${relational_item_by_id_fnFunctionIdentifer}(${sqlFromArgDigests(args)})`;
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
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "polymorphic",
          name: "relational_item_by_id_fn"
        },
        tags: {}
      },
      description: undefined
    }),
    relational_topics_parent_fn: PgResource.functionResourceOptions(registryConfig_pgResources_relational_items_relational_items, {
      name: "relational_topics_parent_fn",
      identifier: "main.polymorphic.relational_topics_parent_fn(polymorphic.relational_topics)",
      from(...args) {
        return sql`${relational_topics_parent_fnFunctionIdentifer}(${sqlFromArgDigests(args)})`;
      },
      parameters: [{
        name: "t",
        required: true,
        notNull: false,
        codec: relationalTopicsCodec
      }],
      returnsArray: false,
      returnsSetof: false,
      isMutation: false,
      hasImplicitOrder: false,
      extensions: {
        pg: {
          serviceName: "main",
          schemaName: "polymorphic",
          name: "relational_topics_parent_fn"
        },
        tags: {}
      },
      description: undefined
    })
  },
  pgRelations: {
    __proto__: null,
    awsApplicationFirstPartyVulnerabilities: {
      __proto__: null,
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
    },
    awsApplicationThirdPartyVulnerabilities: {
      __proto__: null,
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
    },
    awsApplications: {
      __proto__: null,
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
    },
    firstPartyVulnerabilities: {
      __proto__: null,
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
    },
    gcpApplicationFirstPartyVulnerabilities: {
      __proto__: null,
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
    },
    gcpApplicationThirdPartyVulnerabilities: {
      __proto__: null,
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
    },
    gcpApplications: {
      __proto__: null,
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
    },
    logEntries: {
      __proto__: null,
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
    },
    organizations: {
      __proto__: null,
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
    },
    people: {
      __proto__: null,
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
    },
    priorities: {
      __proto__: null,
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
    },
    relationalChecklistItems: {
      __proto__: null,
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
    },
    relationalChecklists: {
      __proto__: null,
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
    },
    relationalDividers: {
      __proto__: null,
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
    },
    relationalItemRelationCompositePks: {
      __proto__: null,
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
    },
    relationalItemRelations: {
      __proto__: null,
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
    },
    relationalItems: {
      __proto__: null,
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
    },
    relationalPosts: {
      __proto__: null,
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
    },
    relationalTopics: {
      __proto__: null,
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
    },
    singleTableItemRelationCompositePks: {
      __proto__: null,
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
    },
    singleTableItemRelations: {
      __proto__: null,
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
    },
    singleTableItems: {
      __proto__: null,
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
    },
    thirdPartyVulnerabilities: {
      __proto__: null,
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
    }
  }
};
const registry = makeRegistry(registryConfig);
const resource_single_table_itemsPgResource = registry.pgResources["single_table_items"];
const nodeIdHandler_SingleTableTopic = {
  typeName: "SingleTableTopic",
  codec: nodeIdHandler_SingleTableTopic_codec_base64JSON,
  deprecationReason: undefined,
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
  base64JSON: nodeIdHandler_SingleTableTopic_codec_base64JSON,
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
    const canUseExpressionDirectly = $in instanceof PgSelectSingleStep && extraSelectArgs.every(a => stepAMayDependOnStepB($in.getClassStep(), a.step));
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
const resource_single_table_items_meaning_of_lifePgResource = registry.pgResources["single_table_items_meaning_of_life"];
const otherSource_peoplePgResource = registry.pgResources["people"];
function qbWhereBuilder(qb) {
  return qb.whereBuilder();
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
const pgResource_organizationsPgResource = registry.pgResources["organizations"];
const pgResource_prioritiesPgResource = registry.pgResources["priorities"];
const pgResource_relational_checklistsPgResource = registry.pgResources["relational_checklists"];
const pgResource_relational_item_relation_composite_pksPgResource = registry.pgResources["relational_item_relation_composite_pks"];
const pgResource_relational_topicsPgResource = registry.pgResources["relational_topics"];
const pgResource_relational_checklist_itemsPgResource = registry.pgResources["relational_checklist_items"];
const pgResource_relational_dividersPgResource = registry.pgResources["relational_dividers"];
const pgResource_relational_item_relationsPgResource = registry.pgResources["relational_item_relations"];
const pgResource_log_entriesPgResource = registry.pgResources["log_entries"];
const pgResource_relational_postsPgResource = registry.pgResources["relational_posts"];
const pgResource_first_party_vulnerabilitiesPgResource = registry.pgResources["first_party_vulnerabilities"];
const pgResource_third_party_vulnerabilitiesPgResource = registry.pgResources["third_party_vulnerabilities"];
const pgResource_aws_applicationsPgResource = registry.pgResources["aws_applications"];
const pgResource_gcp_applicationsPgResource = registry.pgResources["gcp_applications"];
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
    codec: nodeIdHandler_SingleTableTopic_codec_base64JSON,
    deprecationReason: undefined,
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
    codec: nodeIdHandler_SingleTableTopic_codec_base64JSON,
    deprecationReason: undefined,
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
    codec: nodeIdHandler_SingleTableTopic_codec_base64JSON,
    deprecationReason: undefined,
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
    codec: nodeIdHandler_SingleTableTopic_codec_base64JSON,
    deprecationReason: undefined,
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
  Organization: {
    typeName: "Organization",
    codec: nodeIdHandler_SingleTableTopic_codec_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("organizations", false), $record.get("organization_id")]);
    },
    getSpec($list) {
      return {
        organization_id: inhibitOnNull(access($list, [1]))
      };
    },
    getIdentifiers(value) {
      return value.slice(1);
    },
    get(spec) {
      return pgResource_organizationsPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "organizations";
    }
  },
  Person: {
    typeName: "Person",
    codec: nodeIdHandler_SingleTableTopic_codec_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("people", false), $record.get("person_id")]);
    },
    getSpec($list) {
      return {
        person_id: inhibitOnNull(access($list, [1]))
      };
    },
    getIdentifiers(value) {
      return value.slice(1);
    },
    get(spec) {
      return otherSource_peoplePgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "people";
    }
  },
  Priority: {
    typeName: "Priority",
    codec: nodeIdHandler_SingleTableTopic_codec_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("priorities", false), $record.get("id")]);
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
      return pgResource_prioritiesPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "priorities";
    }
  },
  RelationalChecklist: {
    typeName: "RelationalChecklist",
    codec: nodeIdHandler_SingleTableTopic_codec_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("relational_checklists", false), $record.get("checklist_item_id")]);
    },
    getSpec($list) {
      return {
        checklist_item_id: inhibitOnNull(access($list, [1]))
      };
    },
    getIdentifiers(value) {
      return value.slice(1);
    },
    get(spec) {
      return pgResource_relational_checklistsPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "relational_checklists";
    }
  },
  RelationalItemRelationCompositePk: {
    typeName: "RelationalItemRelationCompositePk",
    codec: nodeIdHandler_SingleTableTopic_codec_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("relational_item_relation_composite_pks", false), $record.get("parent_id"), $record.get("child_id")]);
    },
    getSpec($list) {
      return {
        parent_id: inhibitOnNull(access($list, [1])),
        child_id: inhibitOnNull(access($list, [2]))
      };
    },
    getIdentifiers(value) {
      return value.slice(1);
    },
    get(spec) {
      return pgResource_relational_item_relation_composite_pksPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "relational_item_relation_composite_pks";
    }
  },
  RelationalTopic: {
    typeName: "RelationalTopic",
    codec: nodeIdHandler_SingleTableTopic_codec_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("relational_topics", false), $record.get("topic_item_id")]);
    },
    getSpec($list) {
      return {
        topic_item_id: inhibitOnNull(access($list, [1]))
      };
    },
    getIdentifiers(value) {
      return value.slice(1);
    },
    get(spec) {
      return pgResource_relational_topicsPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "relational_topics";
    }
  },
  SingleTableItemRelationCompositePk: {
    typeName: "SingleTableItemRelationCompositePk",
    codec: nodeIdHandler_SingleTableTopic_codec_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("single_table_item_relation_composite_pks", false), $record.get("parent_id"), $record.get("child_id")]);
    },
    getSpec($list) {
      return {
        parent_id: inhibitOnNull(access($list, [1])),
        child_id: inhibitOnNull(access($list, [2]))
      };
    },
    getIdentifiers(value) {
      return value.slice(1);
    },
    get(spec) {
      return otherSource_single_table_item_relation_composite_pksPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "single_table_item_relation_composite_pks";
    }
  },
  RelationalChecklistItem: {
    typeName: "RelationalChecklistItem",
    codec: nodeIdHandler_SingleTableTopic_codec_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("relational_checklist_items", false), $record.get("checklist_item_item_id")]);
    },
    getSpec($list) {
      return {
        checklist_item_item_id: inhibitOnNull(access($list, [1]))
      };
    },
    getIdentifiers(value) {
      return value.slice(1);
    },
    get(spec) {
      return pgResource_relational_checklist_itemsPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "relational_checklist_items";
    }
  },
  RelationalDivider: {
    typeName: "RelationalDivider",
    codec: nodeIdHandler_SingleTableTopic_codec_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("relational_dividers", false), $record.get("divider_item_id")]);
    },
    getSpec($list) {
      return {
        divider_item_id: inhibitOnNull(access($list, [1]))
      };
    },
    getIdentifiers(value) {
      return value.slice(1);
    },
    get(spec) {
      return pgResource_relational_dividersPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "relational_dividers";
    }
  },
  RelationalItemRelation: {
    typeName: "RelationalItemRelation",
    codec: nodeIdHandler_SingleTableTopic_codec_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("relational_item_relations", false), $record.get("id")]);
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
      return pgResource_relational_item_relationsPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "relational_item_relations";
    }
  },
  SingleTableItemRelation: {
    typeName: "SingleTableItemRelation",
    codec: nodeIdHandler_SingleTableTopic_codec_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("single_table_item_relations", false), $record.get("id")]);
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
      return otherSource_single_table_item_relationsPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "single_table_item_relations";
    }
  },
  LogEntry: {
    typeName: "LogEntry",
    codec: nodeIdHandler_SingleTableTopic_codec_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("log_entries", false), $record.get("id")]);
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
      return pgResource_log_entriesPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "log_entries";
    }
  },
  RelationalPost: {
    typeName: "RelationalPost",
    codec: nodeIdHandler_SingleTableTopic_codec_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("relational_posts", false), $record.get("post_item_id")]);
    },
    getSpec($list) {
      return {
        post_item_id: inhibitOnNull(access($list, [1]))
      };
    },
    getIdentifiers(value) {
      return value.slice(1);
    },
    get(spec) {
      return pgResource_relational_postsPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "relational_posts";
    }
  },
  FirstPartyVulnerability: {
    typeName: "FirstPartyVulnerability",
    codec: nodeIdHandler_SingleTableTopic_codec_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("first_party_vulnerabilities", false), $record.get("id")]);
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
      return pgResource_first_party_vulnerabilitiesPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "first_party_vulnerabilities";
    }
  },
  ThirdPartyVulnerability: {
    typeName: "ThirdPartyVulnerability",
    codec: nodeIdHandler_SingleTableTopic_codec_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("third_party_vulnerabilities", false), $record.get("id")]);
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
      return pgResource_third_party_vulnerabilitiesPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "third_party_vulnerabilities";
    }
  },
  AwsApplication: {
    typeName: "AwsApplication",
    codec: nodeIdHandler_SingleTableTopic_codec_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("aws_applications", false), $record.get("id")]);
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
      return pgResource_aws_applicationsPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "aws_applications";
    }
  },
  GcpApplication: {
    typeName: "GcpApplication",
    codec: nodeIdHandler_SingleTableTopic_codec_base64JSON,
    deprecationReason: undefined,
    plan($record) {
      return list([constant("gcp_applications", false), $record.get("id")]);
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
      return pgResource_gcp_applicationsPgResource.get(spec);
    },
    match(obj) {
      return obj[0] === "gcp_applications";
    }
  }
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
function BigIntSerialize(value) {
  return "" + value;
}
const otherSource_relational_itemsPgResource = registry.pgResources["relational_items"];
const members = [{
  resource: pgResource_aws_applicationsPgResource,
  typeName: "AwsApplication",
  path: []
}, {
  resource: pgResource_gcp_applicationsPgResource,
  typeName: "GcpApplication",
  path: []
}];
const paths = [{
  resource: pgResource_aws_applicationsPgResource,
  hasReferencee: true,
  isUnique: false,
  layers: [{
    relationName: "awsApplicationsByTheirPersonId",
    localAttributes: registryConfig.pgRelations.people.awsApplicationsByTheirPersonId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.people.awsApplicationsByTheirPersonId.remoteAttributes,
    resource: pgResource_aws_applicationsPgResource,
    isUnique: false
  }]
}, {
  resource: pgResource_gcp_applicationsPgResource,
  hasReferencee: true,
  isUnique: false,
  layers: [{
    relationName: "gcpApplicationsByTheirPersonId",
    localAttributes: registryConfig.pgRelations.people.gcpApplicationsByTheirPersonId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.people.gcpApplicationsByTheirPersonId.remoteAttributes,
    resource: pgResource_gcp_applicationsPgResource,
    isUnique: false
  }]
}];
const resourceByTypeName = {
  __proto__: null,
  AwsApplication: pgResource_aws_applicationsPgResource,
  GcpApplication: pgResource_gcp_applicationsPgResource
};
function limitToTypes(ltt) {
  if (ltt) {
    return qb => qb.limitToTypes(ltt);
  } else {
    return () => {};
  }
}
const attributes = {};
const members2 = [{
  resource: otherSource_peoplePgResource,
  typeName: "Person",
  path: []
}, {
  resource: pgResource_organizationsPgResource,
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
  resource: pgResource_organizationsPgResource,
  hasReferencee: false,
  isUnique: true,
  layers: [{
    relationName: "organizationsByMyOrganizationId",
    localAttributes: registryConfig.pgRelations.logEntries.organizationsByMyOrganizationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.logEntries.organizationsByMyOrganizationId.remoteAttributes,
    resource: pgResource_organizationsPgResource,
    isUnique: true
  }]
}];
const resourceByTypeName2 = {
  __proto__: null,
  Person: otherSource_peoplePgResource,
  Organization: pgResource_organizationsPgResource
};
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
  resource: pgResource_first_party_vulnerabilitiesPgResource,
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
    resource: pgResource_first_party_vulnerabilitiesPgResource,
    isUnique: true
  }]
}, {
  resource: pgResource_third_party_vulnerabilitiesPgResource,
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
    resource: pgResource_third_party_vulnerabilitiesPgResource,
    isUnique: true
  }]
}];
const resourceByTypeName3 = {
  __proto__: null,
  FirstPartyVulnerability: pgResource_first_party_vulnerabilitiesPgResource,
  ThirdPartyVulnerability: pgResource_third_party_vulnerabilitiesPgResource
};
const attributes2 = {};
const members4 = [{
  resource: otherSource_peoplePgResource,
  typeName: "Person",
  path: []
}, {
  resource: pgResource_organizationsPgResource,
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
  resource: pgResource_organizationsPgResource,
  hasReferencee: false,
  isUnique: true,
  layers: [{
    relationName: "organizationsByMyOrganizationId",
    localAttributes: registryConfig.pgRelations.awsApplications.organizationsByMyOrganizationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.awsApplications.organizationsByMyOrganizationId.remoteAttributes,
    resource: pgResource_organizationsPgResource,
    isUnique: true
  }]
}];
const resourceByTypeName4 = {
  __proto__: null,
  Person: otherSource_peoplePgResource,
  Organization: pgResource_organizationsPgResource
};
const resourceByTypeName5 = {
  __proto__: null,
  AwsApplication: pgResource_aws_applicationsPgResource,
  GcpApplication: pgResource_gcp_applicationsPgResource
};
const resourceByTypeName6 = {
  __proto__: null,
  FirstPartyVulnerability: pgResource_first_party_vulnerabilitiesPgResource,
  ThirdPartyVulnerability: pgResource_third_party_vulnerabilitiesPgResource
};
const resourceByTypeName7 = {
  __proto__: null,
  Organization: pgResource_organizationsPgResource,
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
  resource: pgResource_first_party_vulnerabilitiesPgResource,
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
    resource: pgResource_first_party_vulnerabilitiesPgResource,
    isUnique: true
  }]
}, {
  resource: pgResource_third_party_vulnerabilitiesPgResource,
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
    resource: pgResource_third_party_vulnerabilitiesPgResource,
    isUnique: true
  }]
}];
const resourceByTypeName8 = {
  __proto__: null,
  FirstPartyVulnerability: pgResource_first_party_vulnerabilitiesPgResource,
  ThirdPartyVulnerability: pgResource_third_party_vulnerabilitiesPgResource
};
const attributes3 = {};
const members6 = [{
  resource: otherSource_peoplePgResource,
  typeName: "Person",
  path: []
}, {
  resource: pgResource_organizationsPgResource,
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
  resource: pgResource_organizationsPgResource,
  hasReferencee: false,
  isUnique: true,
  layers: [{
    relationName: "organizationsByMyOrganizationId",
    localAttributes: registryConfig.pgRelations.gcpApplications.organizationsByMyOrganizationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.gcpApplications.organizationsByMyOrganizationId.remoteAttributes,
    resource: pgResource_organizationsPgResource,
    isUnique: true
  }]
}];
const resourceByTypeName9 = {
  __proto__: null,
  Person: otherSource_peoplePgResource,
  Organization: pgResource_organizationsPgResource
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
const argDetailsSimple_relational_topic_by_id_fn = [{
  graphqlArgName: "id",
  postgresArgName: "id",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
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
const getSelectPlanFromParentAndArgs = ($root, args, _info) => {
  const selectArgs = makeArgs_first_party_vulnerabilities_cvss_score_int(args);
  return resource_all_single_tablesPgResource.execute(selectArgs);
};
const argDetailsSimple_get_single_table_topic_by_id = [{
  graphqlArgName: "id",
  postgresArgName: "id",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs_get_single_table_topic_by_id = (args, path = []) => argDetailsSimple_get_single_table_topic_by_id.map(details => makeArg(path, args, details));
const resource_get_single_table_topic_by_idPgResource = registry.pgResources["get_single_table_topic_by_id"];
const resource_all_relational_items_fnPgResource = registry.pgResources["all_relational_items_fn"];
const getSelectPlanFromParentAndArgs2 = ($root, args, _info) => {
  const selectArgs = makeArgs_first_party_vulnerabilities_cvss_score_int(args);
  return resource_all_relational_items_fnPgResource.execute(selectArgs);
};
const argDetailsSimple_relational_item_by_id_fn = [{
  graphqlArgName: "id",
  postgresArgName: "id",
  pgCodec: TYPES.int,
  required: true,
  fetcher: null
}];
const makeArgs_relational_item_by_id_fn = (args, path = []) => argDetailsSimple_relational_item_by_id_fn.map(details => makeArg(path, args, details));
const resource_relational_item_by_id_fnPgResource = registry.pgResources["relational_item_by_id_fn"];
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
const nodeFetcher_Organization = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandlerByTypeName.Organization));
  return nodeIdHandlerByTypeName.Organization.get(nodeIdHandlerByTypeName.Organization.getSpec($decoded));
};
const nodeFetcher_Person = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandlerByTypeName.Person));
  return nodeIdHandlerByTypeName.Person.get(nodeIdHandlerByTypeName.Person.getSpec($decoded));
};
const nodeFetcher_Priority = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandlerByTypeName.Priority));
  return nodeIdHandlerByTypeName.Priority.get(nodeIdHandlerByTypeName.Priority.getSpec($decoded));
};
const nodeFetcher_RelationalChecklist = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandlerByTypeName.RelationalChecklist));
  return nodeIdHandlerByTypeName.RelationalChecklist.get(nodeIdHandlerByTypeName.RelationalChecklist.getSpec($decoded));
};
const nodeFetcher_RelationalItemRelationCompositePk = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandlerByTypeName.RelationalItemRelationCompositePk));
  return nodeIdHandlerByTypeName.RelationalItemRelationCompositePk.get(nodeIdHandlerByTypeName.RelationalItemRelationCompositePk.getSpec($decoded));
};
const nodeFetcher_RelationalTopic = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandlerByTypeName.RelationalTopic));
  return nodeIdHandlerByTypeName.RelationalTopic.get(nodeIdHandlerByTypeName.RelationalTopic.getSpec($decoded));
};
const nodeFetcher_SingleTableItemRelationCompositePk = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandlerByTypeName.SingleTableItemRelationCompositePk));
  return nodeIdHandlerByTypeName.SingleTableItemRelationCompositePk.get(nodeIdHandlerByTypeName.SingleTableItemRelationCompositePk.getSpec($decoded));
};
const nodeFetcher_RelationalChecklistItem = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandlerByTypeName.RelationalChecklistItem));
  return nodeIdHandlerByTypeName.RelationalChecklistItem.get(nodeIdHandlerByTypeName.RelationalChecklistItem.getSpec($decoded));
};
const nodeFetcher_RelationalDivider = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandlerByTypeName.RelationalDivider));
  return nodeIdHandlerByTypeName.RelationalDivider.get(nodeIdHandlerByTypeName.RelationalDivider.getSpec($decoded));
};
const nodeFetcher_RelationalItemRelation = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandlerByTypeName.RelationalItemRelation));
  return nodeIdHandlerByTypeName.RelationalItemRelation.get(nodeIdHandlerByTypeName.RelationalItemRelation.getSpec($decoded));
};
const nodeFetcher_SingleTableItemRelation = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandlerByTypeName.SingleTableItemRelation));
  return nodeIdHandlerByTypeName.SingleTableItemRelation.get(nodeIdHandlerByTypeName.SingleTableItemRelation.getSpec($decoded));
};
const nodeFetcher_LogEntry = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandlerByTypeName.LogEntry));
  return nodeIdHandlerByTypeName.LogEntry.get(nodeIdHandlerByTypeName.LogEntry.getSpec($decoded));
};
const nodeFetcher_RelationalPost = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandlerByTypeName.RelationalPost));
  return nodeIdHandlerByTypeName.RelationalPost.get(nodeIdHandlerByTypeName.RelationalPost.getSpec($decoded));
};
const nodeFetcher_FirstPartyVulnerability = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandlerByTypeName.FirstPartyVulnerability));
  return nodeIdHandlerByTypeName.FirstPartyVulnerability.get(nodeIdHandlerByTypeName.FirstPartyVulnerability.getSpec($decoded));
};
const nodeFetcher_ThirdPartyVulnerability = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandlerByTypeName.ThirdPartyVulnerability));
  return nodeIdHandlerByTypeName.ThirdPartyVulnerability.get(nodeIdHandlerByTypeName.ThirdPartyVulnerability.getSpec($decoded));
};
const nodeFetcher_AwsApplication = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandlerByTypeName.AwsApplication));
  return nodeIdHandlerByTypeName.AwsApplication.get(nodeIdHandlerByTypeName.AwsApplication.getSpec($decoded));
};
const nodeFetcher_GcpApplication = $nodeId => {
  const $decoded = lambda($nodeId, specForHandler(nodeIdHandlerByTypeName.GcpApplication));
  return nodeIdHandlerByTypeName.GcpApplication.get(nodeIdHandlerByTypeName.GcpApplication.getSpec($decoded));
};
const members7 = [{
  resource: pgResource_first_party_vulnerabilitiesPgResource,
  typeName: "FirstPartyVulnerability"
}, {
  resource: pgResource_third_party_vulnerabilitiesPgResource,
  typeName: "ThirdPartyVulnerability"
}];
const resourceByTypeName10 = {
  __proto__: null,
  FirstPartyVulnerability: pgResource_first_party_vulnerabilitiesPgResource,
  ThirdPartyVulnerability: pgResource_third_party_vulnerabilitiesPgResource
};
const members8 = [{
  resource: pgResource_aws_applicationsPgResource,
  typeName: "AwsApplication"
}, {
  resource: pgResource_gcp_applicationsPgResource,
  typeName: "GcpApplication"
}];
const resourceByTypeName11 = {
  __proto__: null,
  AwsApplication: pgResource_aws_applicationsPgResource,
  GcpApplication: pgResource_gcp_applicationsPgResource
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
  resource: pgResource_aws_applicationsPgResource,
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
    resource: pgResource_aws_applicationsPgResource,
    isUnique: true
  }]
}, {
  resource: pgResource_gcp_applicationsPgResource,
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
    resource: pgResource_gcp_applicationsPgResource,
    isUnique: true
  }]
}];
const resourceByTypeName13 = {
  __proto__: null,
  AwsApplication: pgResource_aws_applicationsPgResource,
  GcpApplication: pgResource_gcp_applicationsPgResource
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
    resource: pgResource_aws_applicationsPgResource,
    isUnique: true
  }, {
    relationName: "peopleByMyPersonId",
    localAttributes: registryConfig.pgRelations.awsApplications.peopleByMyPersonId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.awsApplications.peopleByMyPersonId.remoteAttributes,
    resource: otherSource_peoplePgResource,
    isUnique: true
  }]
}, {
  resource: pgResource_organizationsPgResource,
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
    resource: pgResource_aws_applicationsPgResource,
    isUnique: true
  }, {
    relationName: "organizationsByMyOrganizationId",
    localAttributes: registryConfig.pgRelations.awsApplications.organizationsByMyOrganizationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.awsApplications.organizationsByMyOrganizationId.remoteAttributes,
    resource: pgResource_organizationsPgResource,
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
    resource: pgResource_gcp_applicationsPgResource,
    isUnique: true
  }, {
    relationName: "peopleByMyPersonId",
    localAttributes: registryConfig.pgRelations.gcpApplications.peopleByMyPersonId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.gcpApplications.peopleByMyPersonId.remoteAttributes,
    resource: otherSource_peoplePgResource,
    isUnique: true
  }]
}, {
  resource: pgResource_organizationsPgResource,
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
    resource: pgResource_gcp_applicationsPgResource,
    isUnique: true
  }, {
    relationName: "organizationsByMyOrganizationId",
    localAttributes: registryConfig.pgRelations.gcpApplications.organizationsByMyOrganizationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.gcpApplications.organizationsByMyOrganizationId.remoteAttributes,
    resource: pgResource_organizationsPgResource,
    isUnique: true
  }]
}];
const resourceByTypeName14 = {
  __proto__: null,
  Person: otherSource_peoplePgResource,
  Organization: pgResource_organizationsPgResource
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
  resource: pgResource_aws_applicationsPgResource,
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
    resource: pgResource_aws_applicationsPgResource,
    isUnique: true
  }]
}, {
  resource: pgResource_gcp_applicationsPgResource,
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
    resource: pgResource_gcp_applicationsPgResource,
    isUnique: true
  }]
}];
const resourceByTypeName15 = {
  __proto__: null,
  AwsApplication: pgResource_aws_applicationsPgResource,
  GcpApplication: pgResource_gcp_applicationsPgResource
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
    resource: pgResource_aws_applicationsPgResource,
    isUnique: true
  }, {
    relationName: "peopleByMyPersonId",
    localAttributes: registryConfig.pgRelations.awsApplications.peopleByMyPersonId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.awsApplications.peopleByMyPersonId.remoteAttributes,
    resource: otherSource_peoplePgResource,
    isUnique: true
  }]
}, {
  resource: pgResource_organizationsPgResource,
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
    resource: pgResource_aws_applicationsPgResource,
    isUnique: true
  }, {
    relationName: "organizationsByMyOrganizationId",
    localAttributes: registryConfig.pgRelations.awsApplications.organizationsByMyOrganizationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.awsApplications.organizationsByMyOrganizationId.remoteAttributes,
    resource: pgResource_organizationsPgResource,
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
    resource: pgResource_gcp_applicationsPgResource,
    isUnique: true
  }, {
    relationName: "peopleByMyPersonId",
    localAttributes: registryConfig.pgRelations.gcpApplications.peopleByMyPersonId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.gcpApplications.peopleByMyPersonId.remoteAttributes,
    resource: otherSource_peoplePgResource,
    isUnique: true
  }]
}, {
  resource: pgResource_organizationsPgResource,
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
    resource: pgResource_gcp_applicationsPgResource,
    isUnique: true
  }, {
    relationName: "organizationsByMyOrganizationId",
    localAttributes: registryConfig.pgRelations.gcpApplications.organizationsByMyOrganizationId.localAttributes,
    remoteAttributes: registryConfig.pgRelations.gcpApplications.organizationsByMyOrganizationId.remoteAttributes,
    resource: pgResource_organizationsPgResource,
    isUnique: true
  }]
}];
const resourceByTypeName16 = {
  __proto__: null,
  Person: otherSource_peoplePgResource,
  Organization: pgResource_organizationsPgResource
};
const resourceByTypeName17 = {
  __proto__: null
};
const decodeNodeId2 = makeDecodeNodeId([nodeIdHandlerByTypeName.RelationalTopic, nodeIdHandlerByTypeName.RelationalPost, nodeIdHandlerByTypeName.RelationalDivider, nodeIdHandlerByTypeName.RelationalChecklist, nodeIdHandlerByTypeName.RelationalChecklistItem]);
const details = [{
  remotePkAttributes: relational_topicsUniques[0].attributes,
  handler: nodeIdHandlerByTypeName.RelationalTopic
}, {
  remotePkAttributes: relational_postsUniques[0].attributes,
  handler: nodeIdHandlerByTypeName.RelationalPost
}, {
  remotePkAttributes: relational_dividersUniques[0].attributes,
  handler: nodeIdHandlerByTypeName.RelationalDivider
}, {
  remotePkAttributes: relational_checklistsUniques[0].attributes,
  handler: nodeIdHandlerByTypeName.RelationalChecklist
}, {
  remotePkAttributes: relational_checklist_itemsUniques[0].attributes,
  handler: nodeIdHandlerByTypeName.RelationalChecklistItem
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
  postgresArgName: "nodeId",
  pgCodec: relationalItemsCodec,
  required: true,
  fetcher($nodeId) {
    return otherSource_relational_itemsPgResource.get(getSpec($nodeId));
  }
}];
const makeArgs_custom_delete_relational_item = (args, path = []) => argDetailsSimple_custom_delete_relational_item.map(details => makeArg(path, args, details));
const resource_custom_delete_relational_itemPgResource = registry.pgResources["custom_delete_relational_item"];
const specFromArgs_Organization = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Organization, $nodeId);
};
const specFromArgs_Person = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Person, $nodeId);
};
const specFromArgs_RelationalItemRelationCompositePk = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.RelationalItemRelationCompositePk, $nodeId);
};
const specFromArgs_SingleTableItemRelationCompositePk = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.SingleTableItemRelationCompositePk, $nodeId);
};
const specFromArgs_RelationalItemRelation = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.RelationalItemRelation, $nodeId);
};
const specFromArgs_SingleTableItemRelation = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.SingleTableItemRelation, $nodeId);
};
const specFromArgs_LogEntry = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.LogEntry, $nodeId);
};
const specFromArgs_FirstPartyVulnerability = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.FirstPartyVulnerability, $nodeId);
};
const specFromArgs_ThirdPartyVulnerability = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.ThirdPartyVulnerability, $nodeId);
};
const specFromArgs_AwsApplication = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.AwsApplication, $nodeId);
};
const specFromArgs_GcpApplication = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.GcpApplication, $nodeId);
};
const specFromArgs_Organization2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Organization, $nodeId);
};
const specFromArgs_Person2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.Person, $nodeId);
};
const specFromArgs_RelationalItemRelationCompositePk2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.RelationalItemRelationCompositePk, $nodeId);
};
const specFromArgs_SingleTableItemRelationCompositePk2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.SingleTableItemRelationCompositePk, $nodeId);
};
const specFromArgs_RelationalItemRelation2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.RelationalItemRelation, $nodeId);
};
const specFromArgs_SingleTableItemRelation2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.SingleTableItemRelation, $nodeId);
};
const specFromArgs_LogEntry2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.LogEntry, $nodeId);
};
const specFromArgs_FirstPartyVulnerability2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.FirstPartyVulnerability, $nodeId);
};
const specFromArgs_ThirdPartyVulnerability2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.ThirdPartyVulnerability, $nodeId);
};
const specFromArgs_AwsApplication2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.AwsApplication, $nodeId);
};
const specFromArgs_GcpApplication2 = args => {
  const $nodeId = args.getRaw(["input", "nodeId"]);
  return specFromNodeId(nodeIdHandlerByTypeName.GcpApplication, $nodeId);
};
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
          only($parent, $connection, fieldArgs) {
            const $union = $connection.getSubplan();
            const $ltt = fieldArgs.getRaw();
            if ($ltt instanceof ConstantStep && $ltt.data == null) {
              // No action
            } else {
              $union.apply(lambda($ltt, limitToTypes));
            }
          },
          orderBy(parent, $connection, value) {
            const $select = $connection.getSubplan();
            value.apply($select);
          }
        }
      },
      allAwsApplications: {
        plan() {
          return connection(pgResource_aws_applicationsPgResource.find());
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
      allFirstPartyVulnerabilities: {
        plan() {
          return connection(pgResource_first_party_vulnerabilitiesPgResource.find());
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
      allGcpApplications: {
        plan() {
          return connection(pgResource_gcp_applicationsPgResource.find());
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
      allLogEntries: {
        plan() {
          return connection(pgResource_log_entriesPgResource.find());
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
      allOrganizations: {
        plan() {
          return connection(pgResource_organizationsPgResource.find());
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
      allPeople: {
        plan() {
          return connection(otherSource_peoplePgResource.find());
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
      allPriorities: {
        plan() {
          return connection(pgResource_prioritiesPgResource.find());
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
          }
        }
      },
      allRelationalChecklistItems: {
        plan() {
          return connection(pgResource_relational_checklist_itemsPgResource.find());
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
      allRelationalChecklists: {
        plan() {
          return connection(pgResource_relational_checklistsPgResource.find());
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
      allRelationalDividers: {
        plan() {
          return connection(pgResource_relational_dividersPgResource.find());
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
      allRelationalItemRelationCompositePks: {
        plan() {
          return connection(pgResource_relational_item_relation_composite_pksPgResource.find());
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
      allRelationalItemRelations: {
        plan() {
          return connection(pgResource_relational_item_relationsPgResource.find());
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
      allRelationalItems: {
        plan() {
          return connection(otherSource_relational_itemsPgResource.find());
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
      allRelationalItemsFn: {
        plan($parent, args, info) {
          const $select = getSelectPlanFromParentAndArgs2($parent, args, info);
          return connection($select, {
            cursorPlan($item) {
              return $item.getParentStep ? $item.getParentStep().cursor() : $item.cursor();
            }
          });
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
          }
        }
      },
      allRelationalPosts: {
        plan() {
          return connection(pgResource_relational_postsPgResource.find());
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
      allRelationalTopics: {
        plan() {
          return connection(pgResource_relational_topicsPgResource.find());
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
      allSingleTableItemRelationCompositePks: {
        plan() {
          return connection(otherSource_single_table_item_relation_composite_pksPgResource.find());
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
      allSingleTableItemRelations: {
        plan() {
          return connection(otherSource_single_table_item_relationsPgResource.find());
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
      allSingleTableItems: {
        plan() {
          return connection(resource_single_table_itemsPgResource.find());
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
      allSingleTables: {
        plan($parent, args, info) {
          const $select = getSelectPlanFromParentAndArgs($parent, args, info);
          return connection($select, {
            cursorPlan($item) {
              return $item.getParentStep ? $item.getParentStep().cursor() : $item.cursor();
            }
          });
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
          }
        }
      },
      allThirdPartyVulnerabilities: {
        plan() {
          return connection(pgResource_third_party_vulnerabilitiesPgResource.find());
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
          only($parent, $connection, fieldArgs) {
            const $union = $connection.getSubplan();
            const $ltt = fieldArgs.getRaw();
            if ($ltt instanceof ConstantStep && $ltt.data == null) {
              // No action
            } else {
              $union.apply(lambda($ltt, limitToTypes));
            }
          },
          orderBy(parent, $connection, value) {
            const $select = $connection.getSubplan();
            value.apply($select);
          }
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
      awsApplication(_$parent, args) {
        const $nodeId = args.getRaw("nodeId");
        return nodeFetcher_AwsApplication($nodeId);
      },
      awsApplicationById(_$root, {
        $id
      }) {
        return pgResource_aws_applicationsPgResource.get({
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
        return pgResource_first_party_vulnerabilitiesPgResource.get({
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
        return pgResource_gcp_applicationsPgResource.get({
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
        return pgResource_log_entriesPgResource.get({
          id: $id
        });
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
        return pgResource_organizationsPgResource.get({
          name: $name
        });
      },
      organizationByOrganizationId(_$root, {
        $organizationId
      }) {
        return pgResource_organizationsPgResource.get({
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
        return pgResource_prioritiesPgResource.get({
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
        return pgResource_relational_checklistsPgResource.get({
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
        return pgResource_relational_checklist_itemsPgResource.get({
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
        return pgResource_relational_dividersPgResource.get({
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
        return pgResource_relational_item_relationsPgResource.get({
          id: $id
        });
      },
      relationalItemRelationByParentIdAndChildId(_$root, {
        $parentId,
        $childId
      }) {
        return pgResource_relational_item_relationsPgResource.get({
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
        return pgResource_relational_item_relation_composite_pksPgResource.get({
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
        return pgResource_relational_postsPgResource.get({
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
        return pgResource_relational_topicsPgResource.get({
          topic_item_id: $topicItemId
        });
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
        return pgResource_third_party_vulnerabilitiesPgResource.get({
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
          const $insert = pgInsertSingle(pgResource_aws_applicationsPgResource, Object.create(null));
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
      createFirstPartyVulnerability: {
        plan(_, args) {
          const $insert = pgInsertSingle(pgResource_first_party_vulnerabilitiesPgResource, Object.create(null));
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
      createGcpApplication: {
        plan(_, args) {
          const $insert = pgInsertSingle(pgResource_gcp_applicationsPgResource, Object.create(null));
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
      createLogEntry: {
        plan(_, args) {
          const $insert = pgInsertSingle(pgResource_log_entriesPgResource, Object.create(null));
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
      createOrganization: {
        plan(_, args) {
          const $insert = pgInsertSingle(pgResource_organizationsPgResource, Object.create(null));
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
      createPerson: {
        plan(_, args) {
          const $insert = pgInsertSingle(otherSource_peoplePgResource, Object.create(null));
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
      createRelationalItemRelation: {
        plan(_, args) {
          const $insert = pgInsertSingle(pgResource_relational_item_relationsPgResource, Object.create(null));
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
      createRelationalItemRelationCompositePk: {
        plan(_, args) {
          const $insert = pgInsertSingle(pgResource_relational_item_relation_composite_pksPgResource, Object.create(null));
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
      createSingleTableItemRelation: {
        plan(_, args) {
          const $insert = pgInsertSingle(otherSource_single_table_item_relationsPgResource, Object.create(null));
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
      createSingleTableItemRelationCompositePk: {
        plan(_, args) {
          const $insert = pgInsertSingle(otherSource_single_table_item_relation_composite_pksPgResource, Object.create(null));
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
      createThirdPartyVulnerability: {
        plan(_, args) {
          const $insert = pgInsertSingle(pgResource_third_party_vulnerabilitiesPgResource, Object.create(null));
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
      customDeleteRelationalItem: {
        plan($root, args, _info) {
          const selectArgs = makeArgs_custom_delete_relational_item(args, ["input"]);
          const $result = resource_custom_delete_relational_itemPgResource.execute(selectArgs, "mutation");
          return object({
            result: $result
          });
        },
        args: {
          input(_, $object, arg) {
            // We might have any number of step types here; we need
            // to get back to the underlying pgSelect.
            const $result = $object.getStepForKey("result");
            const $parent = "getParentStep" in $result ? $result.getParentStep() : $result;
            const $pgSelect = "getClassStep" in $parent ? $parent.getClassStep() : $parent;
            if ($pgSelect instanceof PgSelectStep) {
              // Mostly so `clientMutationId` works!
              arg.apply($pgSelect);
            } else {
              throw new Error(`Could not determine PgSelectStep for ${$result}`);
            }
          }
        }
      },
      deleteAwsApplication: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(pgResource_aws_applicationsPgResource, specFromArgs_AwsApplication2(args));
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
      deleteAwsApplicationById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(pgResource_aws_applicationsPgResource, {
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
      deleteFirstPartyVulnerability: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(pgResource_first_party_vulnerabilitiesPgResource, specFromArgs_FirstPartyVulnerability2(args));
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
      deleteFirstPartyVulnerabilityById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(pgResource_first_party_vulnerabilitiesPgResource, {
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
      deleteGcpApplication: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(pgResource_gcp_applicationsPgResource, specFromArgs_GcpApplication2(args));
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
      deleteGcpApplicationById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(pgResource_gcp_applicationsPgResource, {
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
      deleteLogEntry: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(pgResource_log_entriesPgResource, specFromArgs_LogEntry2(args));
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
      deleteLogEntryById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(pgResource_log_entriesPgResource, {
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
      deleteOrganization: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(pgResource_organizationsPgResource, specFromArgs_Organization2(args));
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
      deleteOrganizationByName: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(pgResource_organizationsPgResource, {
            name: args.getRaw(['input', "name"])
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
      deleteOrganizationByOrganizationId: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(pgResource_organizationsPgResource, {
            organization_id: args.getRaw(['input', "organizationId"])
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
      deletePerson: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(otherSource_peoplePgResource, specFromArgs_Person2(args));
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
          input(_, $object) {
            return $object;
          }
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
          input(_, $object) {
            return $object;
          }
        }
      },
      deleteRelationalItemRelation: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(pgResource_relational_item_relationsPgResource, specFromArgs_RelationalItemRelation2(args));
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
      deleteRelationalItemRelationById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(pgResource_relational_item_relationsPgResource, {
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
      deleteRelationalItemRelationByParentIdAndChildId: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(pgResource_relational_item_relationsPgResource, {
            parent_id: args.getRaw(['input', "parentId"]),
            child_id: args.getRaw(['input', "childId"])
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
      deleteRelationalItemRelationCompositePk: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(pgResource_relational_item_relation_composite_pksPgResource, specFromArgs_RelationalItemRelationCompositePk2(args));
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
      deleteRelationalItemRelationCompositePkByParentIdAndChildId: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(pgResource_relational_item_relation_composite_pksPgResource, {
            parent_id: args.getRaw(['input', "parentId"]),
            child_id: args.getRaw(['input', "childId"])
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
      deleteSingleTableItemRelation: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(otherSource_single_table_item_relationsPgResource, specFromArgs_SingleTableItemRelation2(args));
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
          input(_, $object) {
            return $object;
          }
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
          input(_, $object) {
            return $object;
          }
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
          input(_, $object) {
            return $object;
          }
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
          input(_, $object) {
            return $object;
          }
        }
      },
      deleteThirdPartyVulnerability: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(pgResource_third_party_vulnerabilitiesPgResource, specFromArgs_ThirdPartyVulnerability2(args));
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
      deleteThirdPartyVulnerabilityById: {
        plan(_$root, args) {
          const $delete = pgDeleteSingle(pgResource_third_party_vulnerabilitiesPgResource, {
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
      updateAwsApplication: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(pgResource_aws_applicationsPgResource, specFromArgs_AwsApplication(args));
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
      updateAwsApplicationById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(pgResource_aws_applicationsPgResource, {
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
      updateFirstPartyVulnerability: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(pgResource_first_party_vulnerabilitiesPgResource, specFromArgs_FirstPartyVulnerability(args));
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
      updateFirstPartyVulnerabilityById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(pgResource_first_party_vulnerabilitiesPgResource, {
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
      updateGcpApplication: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(pgResource_gcp_applicationsPgResource, specFromArgs_GcpApplication(args));
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
      updateGcpApplicationById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(pgResource_gcp_applicationsPgResource, {
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
      updateLogEntry: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(pgResource_log_entriesPgResource, specFromArgs_LogEntry(args));
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
      updateLogEntryById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(pgResource_log_entriesPgResource, {
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
      updateOrganization: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(pgResource_organizationsPgResource, specFromArgs_Organization(args));
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
      updateOrganizationByName: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(pgResource_organizationsPgResource, {
            name: args.getRaw(['input', "name"])
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
      updateOrganizationByOrganizationId: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(pgResource_organizationsPgResource, {
            organization_id: args.getRaw(['input', "organizationId"])
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
      updatePerson: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(otherSource_peoplePgResource, specFromArgs_Person(args));
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
          input(_, $object) {
            return $object;
          }
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
          input(_, $object) {
            return $object;
          }
        }
      },
      updateRelationalItemRelation: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(pgResource_relational_item_relationsPgResource, specFromArgs_RelationalItemRelation(args));
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
      updateRelationalItemRelationById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(pgResource_relational_item_relationsPgResource, {
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
      updateRelationalItemRelationByParentIdAndChildId: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(pgResource_relational_item_relationsPgResource, {
            parent_id: args.getRaw(['input', "parentId"]),
            child_id: args.getRaw(['input', "childId"])
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
      updateRelationalItemRelationCompositePk: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(pgResource_relational_item_relation_composite_pksPgResource, specFromArgs_RelationalItemRelationCompositePk(args));
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
      updateRelationalItemRelationCompositePkByParentIdAndChildId: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(pgResource_relational_item_relation_composite_pksPgResource, {
            parent_id: args.getRaw(['input', "parentId"]),
            child_id: args.getRaw(['input', "childId"])
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
      updateSingleTableItemRelation: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(otherSource_single_table_item_relationsPgResource, specFromArgs_SingleTableItemRelation(args));
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
          input(_, $object) {
            return $object;
          }
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
          input(_, $object) {
            return $object;
          }
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
          input(_, $object) {
            return $object;
          }
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
          input(_, $object) {
            return $object;
          }
        }
      },
      updateThirdPartyVulnerability: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(pgResource_third_party_vulnerabilitiesPgResource, specFromArgs_ThirdPartyVulnerability(args));
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
      updateThirdPartyVulnerabilityById: {
        plan(_$root, args) {
          const $update = pgUpdateSingle(pgResource_third_party_vulnerabilitiesPgResource, {
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
      }
    }
  },
  ApplicationsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
      }
    }
  },
  ApplicationsEdge: {
    assertStep: assertEdgeCapableStep,
    plans: {
      cursor($edge) {
        return $edge.cursor();
      },
      node($edge) {
        return $edge.node();
      }
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
        const specifier = nodeIdHandlerByTypeName.AwsApplication.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.AwsApplication.codec.name].encode);
      },
      organizationByOrganizationId($record) {
        return pgResource_organizationsPgResource.get({
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
          only($parent, $connection, fieldArgs) {
            const $union = $connection.getSubplan();
            const $ltt = fieldArgs.getRaw();
            if ($ltt instanceof ConstantStep && $ltt.data == null) {
              // No action
            } else {
              $union.apply(lambda($ltt, limitToTypes));
            }
          },
          orderBy(parent, $connection, value) {
            const $select = $connection.getSubplan();
            value.apply($select);
          }
        }
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of aws_applicationsUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return pgResource_aws_applicationsPgResource.get(spec);
    }
  },
  AwsApplicationsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
      }
    }
  },
  AwsApplicationsEdge: {
    assertStep: assertEdgeCapableStep,
    plans: {
      cursor($edge) {
        return $edge.cursor();
      },
      node($edge) {
        return $edge.node();
      }
    }
  },
  CreateAwsApplicationPayload: {
    assertStep: assertExecutableStep,
    plans: {
      awsApplication($object) {
        return $object.get("result");
      },
      awsApplicationEdge($mutation, fieldArgs) {
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
            return pgResource_aws_applicationsPgResource.find(spec);
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
      clientMutationId($mutation) {
        const $insert = $mutation.getStepForKey("result");
        return $insert.getMeta("clientMutationId");
      },
      organizationByOrganizationId($record) {
        return pgResource_organizationsPgResource.get({
          organization_id: $record.get("result").get("organization_id")
        });
      },
      personByPersonId($record) {
        return otherSource_peoplePgResource.get({
          person_id: $record.get("result").get("person_id")
        });
      },
      query() {
        return rootValue();
      }
    }
  },
  CreateFirstPartyVulnerabilityPayload: {
    assertStep: assertExecutableStep,
    plans: {
      clientMutationId($mutation) {
        const $insert = $mutation.getStepForKey("result");
        return $insert.getMeta("clientMutationId");
      },
      firstPartyVulnerability($object) {
        return $object.get("result");
      },
      firstPartyVulnerabilityEdge($mutation, fieldArgs) {
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
            return pgResource_first_party_vulnerabilitiesPgResource.find(spec);
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
      query() {
        return rootValue();
      }
    }
  },
  CreateGcpApplicationPayload: {
    assertStep: assertExecutableStep,
    plans: {
      clientMutationId($mutation) {
        const $insert = $mutation.getStepForKey("result");
        return $insert.getMeta("clientMutationId");
      },
      gcpApplication($object) {
        return $object.get("result");
      },
      gcpApplicationEdge($mutation, fieldArgs) {
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
            return pgResource_gcp_applicationsPgResource.find(spec);
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
      organizationByOrganizationId($record) {
        return pgResource_organizationsPgResource.get({
          organization_id: $record.get("result").get("organization_id")
        });
      },
      personByPersonId($record) {
        return otherSource_peoplePgResource.get({
          person_id: $record.get("result").get("person_id")
        });
      },
      query() {
        return rootValue();
      }
    }
  },
  CreateLogEntryPayload: {
    assertStep: assertExecutableStep,
    plans: {
      clientMutationId($mutation) {
        const $insert = $mutation.getStepForKey("result");
        return $insert.getMeta("clientMutationId");
      },
      logEntry($object) {
        return $object.get("result");
      },
      logEntryEdge($mutation, fieldArgs) {
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
            return pgResource_log_entriesPgResource.find(spec);
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
      organizationByOrganizationId($record) {
        return pgResource_organizationsPgResource.get({
          organization_id: $record.get("result").get("organization_id")
        });
      },
      personByPersonId($record) {
        return otherSource_peoplePgResource.get({
          person_id: $record.get("result").get("person_id")
        });
      },
      query() {
        return rootValue();
      }
    }
  },
  CreateOrganizationPayload: {
    assertStep: assertExecutableStep,
    plans: {
      clientMutationId($mutation) {
        const $insert = $mutation.getStepForKey("result");
        return $insert.getMeta("clientMutationId");
      },
      organization($object) {
        return $object.get("result");
      },
      organizationEdge($mutation, fieldArgs) {
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
            return pgResource_organizationsPgResource.find(spec);
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
      query() {
        return rootValue();
      }
    }
  },
  CreatePersonPayload: {
    assertStep: assertExecutableStep,
    plans: {
      clientMutationId($mutation) {
        const $insert = $mutation.getStepForKey("result");
        return $insert.getMeta("clientMutationId");
      },
      person($object) {
        return $object.get("result");
      },
      personEdge($mutation, fieldArgs) {
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
        fieldArgs.apply($select, "orderBy");
        const $connection = connection($select);
        // NOTE: you must not use `$single = $select.single()`
        // here because doing so will mark the row as unique, and
        // then the ordering logic (and thus cursor) will differ.
        const $single = $select.row(first($select));
        return new EdgeStep($connection, $single);
      },
      query() {
        return rootValue();
      }
    }
  },
  CreateRelationalItemRelationCompositePkPayload: {
    assertStep: assertExecutableStep,
    plans: {
      clientMutationId($mutation) {
        const $insert = $mutation.getStepForKey("result");
        return $insert.getMeta("clientMutationId");
      },
      query() {
        return rootValue();
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
      },
      relationalItemRelationCompositePk($object) {
        return $object.get("result");
      },
      relationalItemRelationCompositePkEdge($mutation, fieldArgs) {
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
            return pgResource_relational_item_relation_composite_pksPgResource.find(spec);
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
    }
  },
  CreateRelationalItemRelationPayload: {
    assertStep: assertExecutableStep,
    plans: {
      clientMutationId($mutation) {
        const $insert = $mutation.getStepForKey("result");
        return $insert.getMeta("clientMutationId");
      },
      query() {
        return rootValue();
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
      },
      relationalItemRelation($object) {
        return $object.get("result");
      },
      relationalItemRelationEdge($mutation, fieldArgs) {
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
            return pgResource_relational_item_relationsPgResource.find(spec);
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
    }
  },
  CreateSingleTableItemRelationCompositePkPayload: {
    assertStep: assertExecutableStep,
    plans: {
      clientMutationId($mutation) {
        const $insert = $mutation.getStepForKey("result");
        return $insert.getMeta("clientMutationId");
      },
      query() {
        return rootValue();
      },
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
      singleTableItemRelationCompositePk($object) {
        return $object.get("result");
      },
      singleTableItemRelationCompositePkEdge($mutation, fieldArgs) {
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
        fieldArgs.apply($select, "orderBy");
        const $connection = connection($select);
        // NOTE: you must not use `$single = $select.single()`
        // here because doing so will mark the row as unique, and
        // then the ordering logic (and thus cursor) will differ.
        const $single = $select.row(first($select));
        return new EdgeStep($connection, $single);
      }
    }
  },
  CreateSingleTableItemRelationPayload: {
    assertStep: assertExecutableStep,
    plans: {
      clientMutationId($mutation) {
        const $insert = $mutation.getStepForKey("result");
        return $insert.getMeta("clientMutationId");
      },
      query() {
        return rootValue();
      },
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
      singleTableItemRelation($object) {
        return $object.get("result");
      },
      singleTableItemRelationEdge($mutation, fieldArgs) {
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
        fieldArgs.apply($select, "orderBy");
        const $connection = connection($select);
        // NOTE: you must not use `$single = $select.single()`
        // here because doing so will mark the row as unique, and
        // then the ordering logic (and thus cursor) will differ.
        const $single = $select.row(first($select));
        return new EdgeStep($connection, $single);
      }
    }
  },
  CreateThirdPartyVulnerabilityPayload: {
    assertStep: assertExecutableStep,
    plans: {
      clientMutationId($mutation) {
        const $insert = $mutation.getStepForKey("result");
        return $insert.getMeta("clientMutationId");
      },
      query() {
        return rootValue();
      },
      thirdPartyVulnerability($object) {
        return $object.get("result");
      },
      thirdPartyVulnerabilityEdge($mutation, fieldArgs) {
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
            return pgResource_third_party_vulnerabilitiesPgResource.find(spec);
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
      query() {
        return rootValue();
      }
    }
  },
  DeleteAwsApplicationPayload: {
    assertStep: ObjectStep,
    plans: {
      awsApplication($object) {
        return $object.get("result");
      },
      awsApplicationEdge($mutation, fieldArgs) {
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
            return pgResource_aws_applicationsPgResource.find(spec);
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
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      deletedAwsApplicationId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandlerByTypeName.AwsApplication.plan($record);
        return lambda(specifier, nodeIdHandler_SingleTableTopic_codec_base64JSON.encode);
      },
      organizationByOrganizationId($record) {
        return pgResource_organizationsPgResource.get({
          organization_id: $record.get("result").get("organization_id")
        });
      },
      personByPersonId($record) {
        return otherSource_peoplePgResource.get({
          person_id: $record.get("result").get("person_id")
        });
      },
      query() {
        return rootValue();
      }
    }
  },
  DeleteFirstPartyVulnerabilityPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      deletedFirstPartyVulnerabilityId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandlerByTypeName.FirstPartyVulnerability.plan($record);
        return lambda(specifier, nodeIdHandler_SingleTableTopic_codec_base64JSON.encode);
      },
      firstPartyVulnerability($object) {
        return $object.get("result");
      },
      firstPartyVulnerabilityEdge($mutation, fieldArgs) {
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
            return pgResource_first_party_vulnerabilitiesPgResource.find(spec);
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
      query() {
        return rootValue();
      }
    }
  },
  DeleteGcpApplicationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      deletedGcpApplicationId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandlerByTypeName.GcpApplication.plan($record);
        return lambda(specifier, nodeIdHandler_SingleTableTopic_codec_base64JSON.encode);
      },
      gcpApplication($object) {
        return $object.get("result");
      },
      gcpApplicationEdge($mutation, fieldArgs) {
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
            return pgResource_gcp_applicationsPgResource.find(spec);
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
      organizationByOrganizationId($record) {
        return pgResource_organizationsPgResource.get({
          organization_id: $record.get("result").get("organization_id")
        });
      },
      personByPersonId($record) {
        return otherSource_peoplePgResource.get({
          person_id: $record.get("result").get("person_id")
        });
      },
      query() {
        return rootValue();
      }
    }
  },
  DeleteLogEntryPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      deletedLogEntryId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandlerByTypeName.LogEntry.plan($record);
        return lambda(specifier, nodeIdHandler_SingleTableTopic_codec_base64JSON.encode);
      },
      logEntry($object) {
        return $object.get("result");
      },
      logEntryEdge($mutation, fieldArgs) {
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
            return pgResource_log_entriesPgResource.find(spec);
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
      organizationByOrganizationId($record) {
        return pgResource_organizationsPgResource.get({
          organization_id: $record.get("result").get("organization_id")
        });
      },
      personByPersonId($record) {
        return otherSource_peoplePgResource.get({
          person_id: $record.get("result").get("person_id")
        });
      },
      query() {
        return rootValue();
      }
    }
  },
  DeleteOrganizationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      deletedOrganizationId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandlerByTypeName.Organization.plan($record);
        return lambda(specifier, nodeIdHandler_SingleTableTopic_codec_base64JSON.encode);
      },
      organization($object) {
        return $object.get("result");
      },
      organizationEdge($mutation, fieldArgs) {
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
            return pgResource_organizationsPgResource.find(spec);
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
      query() {
        return rootValue();
      }
    }
  },
  DeletePersonPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      deletedPersonId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandlerByTypeName.Person.plan($record);
        return lambda(specifier, nodeIdHandler_SingleTableTopic_codec_base64JSON.encode);
      },
      person($object) {
        return $object.get("result");
      },
      personEdge($mutation, fieldArgs) {
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
        fieldArgs.apply($select, "orderBy");
        const $connection = connection($select);
        // NOTE: you must not use `$single = $select.single()`
        // here because doing so will mark the row as unique, and
        // then the ordering logic (and thus cursor) will differ.
        const $single = $select.row(first($select));
        return new EdgeStep($connection, $single);
      },
      query() {
        return rootValue();
      }
    }
  },
  DeleteRelationalItemRelationCompositePkPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      deletedRelationalItemRelationCompositePkId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandlerByTypeName.RelationalItemRelationCompositePk.plan($record);
        return lambda(specifier, nodeIdHandler_SingleTableTopic_codec_base64JSON.encode);
      },
      query() {
        return rootValue();
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
      },
      relationalItemRelationCompositePk($object) {
        return $object.get("result");
      },
      relationalItemRelationCompositePkEdge($mutation, fieldArgs) {
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
            return pgResource_relational_item_relation_composite_pksPgResource.find(spec);
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
    }
  },
  DeleteRelationalItemRelationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      deletedRelationalItemRelationId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandlerByTypeName.RelationalItemRelation.plan($record);
        return lambda(specifier, nodeIdHandler_SingleTableTopic_codec_base64JSON.encode);
      },
      query() {
        return rootValue();
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
      },
      relationalItemRelation($object) {
        return $object.get("result");
      },
      relationalItemRelationEdge($mutation, fieldArgs) {
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
            return pgResource_relational_item_relationsPgResource.find(spec);
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
    }
  },
  DeleteSingleTableItemRelationCompositePkPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      deletedSingleTableItemRelationCompositePkId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandlerByTypeName.SingleTableItemRelationCompositePk.plan($record);
        return lambda(specifier, nodeIdHandler_SingleTableTopic_codec_base64JSON.encode);
      },
      query() {
        return rootValue();
      },
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
      singleTableItemRelationCompositePk($object) {
        return $object.get("result");
      },
      singleTableItemRelationCompositePkEdge($mutation, fieldArgs) {
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
        fieldArgs.apply($select, "orderBy");
        const $connection = connection($select);
        // NOTE: you must not use `$single = $select.single()`
        // here because doing so will mark the row as unique, and
        // then the ordering logic (and thus cursor) will differ.
        const $single = $select.row(first($select));
        return new EdgeStep($connection, $single);
      }
    }
  },
  DeleteSingleTableItemRelationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      deletedSingleTableItemRelationId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandlerByTypeName.SingleTableItemRelation.plan($record);
        return lambda(specifier, nodeIdHandler_SingleTableTopic_codec_base64JSON.encode);
      },
      query() {
        return rootValue();
      },
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
      singleTableItemRelation($object) {
        return $object.get("result");
      },
      singleTableItemRelationEdge($mutation, fieldArgs) {
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
        fieldArgs.apply($select, "orderBy");
        const $connection = connection($select);
        // NOTE: you must not use `$single = $select.single()`
        // here because doing so will mark the row as unique, and
        // then the ordering logic (and thus cursor) will differ.
        const $single = $select.row(first($select));
        return new EdgeStep($connection, $single);
      }
    }
  },
  DeleteThirdPartyVulnerabilityPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      deletedThirdPartyVulnerabilityId($object) {
        const $record = $object.getStepForKey("result");
        const specifier = nodeIdHandlerByTypeName.ThirdPartyVulnerability.plan($record);
        return lambda(specifier, nodeIdHandler_SingleTableTopic_codec_base64JSON.encode);
      },
      query() {
        return rootValue();
      },
      thirdPartyVulnerability($object) {
        return $object.get("result");
      },
      thirdPartyVulnerabilityEdge($mutation, fieldArgs) {
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
            return pgResource_third_party_vulnerabilitiesPgResource.find(spec);
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
    }
  },
  FirstPartyVulnerabilitiesConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
      }
    }
  },
  FirstPartyVulnerabilitiesEdge: {
    assertStep: assertEdgeCapableStep,
    plans: {
      cursor($edge) {
        return $edge.cursor();
      },
      node($edge) {
        return $edge.node();
      }
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
          only($parent, $connection, fieldArgs) {
            const $union = $connection.getSubplan();
            const $ltt = fieldArgs.getRaw();
            if ($ltt instanceof ConstantStep && $ltt.data == null) {
              // No action
            } else {
              $union.apply(lambda($ltt, limitToTypes));
            }
          },
          orderBy(parent, $connection, value) {
            const $select = $connection.getSubplan();
            value.apply($select);
          }
        }
      },
      cvssScore($record) {
        return $record.get("cvss_score");
      },
      cvssScoreInt($in, args, _info) {
        const {
          $row,
          selectArgs
        } = pgFunctionArgumentsFromArgs($in, makeArgs_first_party_vulnerabilities_cvss_score_int(args), true);
        const from = pgFromExpression($row, resource_first_party_vulnerabilities_cvss_score_intPgResource.from, resource_first_party_vulnerabilities_cvss_score_intPgResource.parameters, selectArgs);
        return pgClassExpression($row, resource_first_party_vulnerabilities_cvss_score_intPgResource.codec, undefined)`${from}`;
      },
      nodeId($parent) {
        const specifier = nodeIdHandlerByTypeName.FirstPartyVulnerability.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.FirstPartyVulnerability.codec.name].encode);
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
      return pgResource_first_party_vulnerabilitiesPgResource.get(spec);
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
        const specifier = nodeIdHandlerByTypeName.GcpApplication.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.GcpApplication.codec.name].encode);
      },
      organizationByOrganizationId($record) {
        return pgResource_organizationsPgResource.get({
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
          only($parent, $connection, fieldArgs) {
            const $union = $connection.getSubplan();
            const $ltt = fieldArgs.getRaw();
            if ($ltt instanceof ConstantStep && $ltt.data == null) {
              // No action
            } else {
              $union.apply(lambda($ltt, limitToTypes));
            }
          },
          orderBy(parent, $connection, value) {
            const $select = $connection.getSubplan();
            value.apply($select);
          }
        }
      }
    },
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of gcp_applicationsUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return pgResource_gcp_applicationsPgResource.get(spec);
    }
  },
  GcpApplicationsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
      }
    }
  },
  GcpApplicationsEdge: {
    assertStep: assertEdgeCapableStep,
    plans: {
      cursor($edge) {
        return $edge.cursor();
      },
      node($edge) {
        return $edge.node();
      }
    }
  },
  LogEntriesConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
      }
    }
  },
  LogEntriesEdge: {
    assertStep: assertEdgeCapableStep,
    plans: {
      cursor($edge) {
        return $edge.cursor();
      },
      node($edge) {
        return $edge.node();
      }
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
        const specifier = nodeIdHandlerByTypeName.LogEntry.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.LogEntry.codec.name].encode);
      },
      organizationByOrganizationId($record) {
        return pgResource_organizationsPgResource.get({
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
      return pgResource_log_entriesPgResource.get(spec);
    }
  },
  Organization: {
    assertStep: assertPgClassSingleStep,
    plans: {
      awsApplicationsByOrganizationId: {
        plan($record) {
          const $records = pgResource_aws_applicationsPgResource.find({
            organization_id: $record.get("organization_id")
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
      },
      gcpApplicationsByOrganizationId: {
        plan($record) {
          const $records = pgResource_gcp_applicationsPgResource.find({
            organization_id: $record.get("organization_id")
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
      },
      logEntriesByOrganizationId: {
        plan($record) {
          const $records = pgResource_log_entriesPgResource.find({
            organization_id: $record.get("organization_id")
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
      },
      nodeId($parent) {
        const specifier = nodeIdHandlerByTypeName.Organization.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Organization.codec.name].encode);
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
      return pgResource_organizationsPgResource.get(spec);
    }
  },
  OrganizationsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
      }
    }
  },
  OrganizationsEdge: {
    assertStep: assertEdgeCapableStep,
    plans: {
      cursor($edge) {
        return $edge.cursor();
      },
      node($edge) {
        return $edge.node();
      }
    }
  },
  PageInfo: {
    assertStep: assertPageInfoCapableStep,
    plans: {
      endCursor($pageInfo) {
        return $pageInfo.endCursor();
      },
      hasNextPage($pageInfo) {
        return $pageInfo.hasNextPage();
      },
      hasPreviousPage($pageInfo) {
        return $pageInfo.hasPreviousPage();
      },
      startCursor($pageInfo) {
        return $pageInfo.startCursor();
      }
    }
  },
  PeopleConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
      }
    }
  },
  PeopleEdge: {
    assertStep: assertEdgeCapableStep,
    plans: {
      cursor($edge) {
        return $edge.cursor();
      },
      node($edge) {
        return $edge.node();
      }
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
          only($parent, $connection, fieldArgs) {
            const $union = $connection.getSubplan();
            const $ltt = fieldArgs.getRaw();
            if ($ltt instanceof ConstantStep && $ltt.data == null) {
              // No action
            } else {
              $union.apply(lambda($ltt, limitToTypes));
            }
          },
          orderBy(parent, $connection, value) {
            const $select = $connection.getSubplan();
            value.apply($select);
          }
        }
      },
      awsApplicationsByPersonId: {
        plan($record) {
          const $records = pgResource_aws_applicationsPgResource.find({
            person_id: $record.get("person_id")
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
      },
      gcpApplicationsByPersonId: {
        plan($record) {
          const $records = pgResource_gcp_applicationsPgResource.find({
            person_id: $record.get("person_id")
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
      },
      logEntriesByPersonId: {
        plan($record) {
          const $records = pgResource_log_entriesPgResource.find({
            person_id: $record.get("person_id")
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
      },
      nodeId($parent) {
        const specifier = nodeIdHandlerByTypeName.Person.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Person.codec.name].encode);
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
      singleTableItemsByAuthorId: {
        plan($record) {
          const $records = resource_single_table_itemsPgResource.find({
            author_id: $record.get("person_id")
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
  PersonOrOrganizationEdge: {
    assertStep: assertEdgeCapableStep,
    plans: {
      cursor($edge) {
        return $edge.cursor();
      },
      node($edge) {
        return $edge.node();
      }
    }
  },
  PrioritiesConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
      }
    }
  },
  PrioritiesEdge: {
    assertStep: assertEdgeCapableStep,
    plans: {
      cursor($edge) {
        return $edge.cursor();
      },
      node($edge) {
        return $edge.node();
      }
    }
  },
  Priority: {
    assertStep: assertPgClassSingleStep,
    plans: {
      nodeId($parent) {
        const specifier = nodeIdHandlerByTypeName.Priority.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.Priority.codec.name].encode);
      },
      singleTableItemsByPriorityId: {
        plan($record) {
          const $records = resource_single_table_itemsPgResource.find({
            priority_id: $record.get("id")
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
    planType($specifier) {
      const spec = Object.create(null);
      for (const pkCol of prioritiesUniques[0].attributes) {
        spec[pkCol] = get2($specifier, pkCol);
      }
      return pgResource_prioritiesPgResource.get(spec);
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
        const specifier = nodeIdHandlerByTypeName.RelationalChecklist.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.RelationalChecklist.codec.name].encode);
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
          const $relational_item_relation_composite_pks = pgResource_relational_item_relation_composite_pksPgResource.find();
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
      relationalItemRelationCompositePksByParentId: {
        plan($record) {
          const $relational_item_relation_composite_pks = pgResource_relational_item_relation_composite_pksPgResource.find();
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
      relationalItemRelationsByChildId: {
        plan($record) {
          const $relational_item_relations = pgResource_relational_item_relationsPgResource.find();
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
      relationalItemRelationsByParentId: {
        plan($record) {
          const $relational_item_relations = pgResource_relational_item_relationsPgResource.find();
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
      relationalTopicByRootTopicId($record) {
        const $relational_topics = pgResource_relational_topicsPgResource.find();
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
      return pgResource_relational_checklistsPgResource.get(spec);
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
        const specifier = nodeIdHandlerByTypeName.RelationalChecklistItem.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.RelationalChecklistItem.codec.name].encode);
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
          const $relational_item_relation_composite_pks = pgResource_relational_item_relation_composite_pksPgResource.find();
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
      relationalItemRelationCompositePksByParentId: {
        plan($record) {
          const $relational_item_relation_composite_pks = pgResource_relational_item_relation_composite_pksPgResource.find();
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
      relationalItemRelationsByChildId: {
        plan($record) {
          const $relational_item_relations = pgResource_relational_item_relationsPgResource.find();
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
      relationalItemRelationsByParentId: {
        plan($record) {
          const $relational_item_relations = pgResource_relational_item_relationsPgResource.find();
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
      relationalTopicByRootTopicId($record) {
        const $relational_topics = pgResource_relational_topicsPgResource.find();
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
      return pgResource_relational_checklist_itemsPgResource.get(spec);
    }
  },
  RelationalChecklistItemsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
      }
    }
  },
  RelationalChecklistItemsEdge: {
    assertStep: assertEdgeCapableStep,
    plans: {
      cursor($edge) {
        return $edge.cursor();
      },
      node($edge) {
        return $edge.node();
      }
    }
  },
  RelationalChecklistsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
      }
    }
  },
  RelationalChecklistsEdge: {
    assertStep: assertEdgeCapableStep,
    plans: {
      cursor($edge) {
        return $edge.cursor();
      },
      node($edge) {
        return $edge.node();
      }
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
        const specifier = nodeIdHandlerByTypeName.RelationalDivider.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.RelationalDivider.codec.name].encode);
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
          const $relational_item_relation_composite_pks = pgResource_relational_item_relation_composite_pksPgResource.find();
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
      relationalItemRelationCompositePksByParentId: {
        plan($record) {
          const $relational_item_relation_composite_pks = pgResource_relational_item_relation_composite_pksPgResource.find();
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
      relationalItemRelationsByChildId: {
        plan($record) {
          const $relational_item_relations = pgResource_relational_item_relationsPgResource.find();
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
      relationalItemRelationsByParentId: {
        plan($record) {
          const $relational_item_relations = pgResource_relational_item_relationsPgResource.find();
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
      relationalTopicByRootTopicId($record) {
        const $relational_topics = pgResource_relational_topicsPgResource.find();
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
      return pgResource_relational_dividersPgResource.get(spec);
    }
  },
  RelationalDividersConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
      }
    }
  },
  RelationalDividersEdge: {
    assertStep: assertEdgeCapableStep,
    plans: {
      cursor($edge) {
        return $edge.cursor();
      },
      node($edge) {
        return $edge.node();
      }
    }
  },
  RelationalItemRelation: {
    assertStep: assertPgClassSingleStep,
    plans: {
      childId($record) {
        return $record.get("child_id");
      },
      nodeId($parent) {
        const specifier = nodeIdHandlerByTypeName.RelationalItemRelation.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.RelationalItemRelation.codec.name].encode);
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
      return pgResource_relational_item_relationsPgResource.get(spec);
    }
  },
  RelationalItemRelationCompositePk: {
    assertStep: assertPgClassSingleStep,
    plans: {
      childId($record) {
        return $record.get("child_id");
      },
      nodeId($parent) {
        const specifier = nodeIdHandlerByTypeName.RelationalItemRelationCompositePk.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.RelationalItemRelationCompositePk.codec.name].encode);
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
      return pgResource_relational_item_relation_composite_pksPgResource.get(spec);
    }
  },
  RelationalItemRelationCompositePksConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
      }
    }
  },
  RelationalItemRelationCompositePksEdge: {
    assertStep: assertEdgeCapableStep,
    plans: {
      cursor($edge) {
        return $edge.cursor();
      },
      node($edge) {
        return $edge.node();
      }
    }
  },
  RelationalItemRelationsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
      }
    }
  },
  RelationalItemRelationsEdge: {
    assertStep: assertEdgeCapableStep,
    plans: {
      cursor($edge) {
        return $edge.cursor();
      },
      node($edge) {
        return $edge.node();
      }
    }
  },
  RelationalItemsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
      }
    }
  },
  RelationalItemsEdge: {
    assertStep: assertEdgeCapableStep,
    plans: {
      cursor($edge) {
        return $edge.cursor();
      },
      node($edge) {
        return $edge.node();
      }
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
        const specifier = nodeIdHandlerByTypeName.RelationalPost.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.RelationalPost.codec.name].encode);
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
          const $relational_item_relation_composite_pks = pgResource_relational_item_relation_composite_pksPgResource.find();
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
      relationalItemRelationCompositePksByParentId: {
        plan($record) {
          const $relational_item_relation_composite_pks = pgResource_relational_item_relation_composite_pksPgResource.find();
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
      relationalItemRelationsByChildId: {
        plan($record) {
          const $relational_item_relations = pgResource_relational_item_relationsPgResource.find();
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
      relationalItemRelationsByParentId: {
        plan($record) {
          const $relational_item_relations = pgResource_relational_item_relationsPgResource.find();
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
      relationalTopicByRootTopicId($record) {
        const $relational_topics = pgResource_relational_topicsPgResource.find();
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
      return pgResource_relational_postsPgResource.get(spec);
    }
  },
  RelationalPostsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
      }
    }
  },
  RelationalPostsEdge: {
    assertStep: assertEdgeCapableStep,
    plans: {
      cursor($edge) {
        return $edge.cursor();
      },
      node($edge) {
        return $edge.node();
      }
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
        const specifier = nodeIdHandlerByTypeName.RelationalTopic.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.RelationalTopic.codec.name].encode);
      },
      parentFn($in, args, _info) {
        const {
          selectArgs
        } = pgFunctionArgumentsFromArgs($in, makeArgs_first_party_vulnerabilities_cvss_score_int(args));
        return resource_relational_topics_parent_fnPgResource.execute(selectArgs);
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
          const $relational_item_relation_composite_pks = pgResource_relational_item_relation_composite_pksPgResource.find();
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
      relationalItemRelationCompositePksByParentId: {
        plan($record) {
          const $relational_item_relation_composite_pks = pgResource_relational_item_relation_composite_pksPgResource.find();
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
      relationalItemRelationsByChildId: {
        plan($record) {
          const $relational_item_relations = pgResource_relational_item_relationsPgResource.find();
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
      relationalItemRelationsByParentId: {
        plan($record) {
          const $relational_item_relations = pgResource_relational_item_relationsPgResource.find();
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
      relationalItemsByRootTopicId: {
        plan($record) {
          const $records = otherSource_relational_itemsPgResource.find({
            root_topic_id: $record.get("topic_item_id")
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
      },
      relationalTopicByRootTopicId($record) {
        const $relational_topics = pgResource_relational_topicsPgResource.find();
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
      return pgResource_relational_topicsPgResource.get(spec);
    }
  },
  RelationalTopicsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
      }
    }
  },
  RelationalTopicsEdge: {
    assertStep: assertEdgeCapableStep,
    plans: {
      cursor($edge) {
        return $edge.cursor();
      },
      node($edge) {
        return $edge.node();
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
        const {
          $row,
          selectArgs
        } = pgFunctionArgumentsFromArgs($in, makeArgs_first_party_vulnerabilities_cvss_score_int(args), true);
        const from = pgFromExpression($row, resource_single_table_items_meaning_of_lifePgResource.from, resource_single_table_items_meaning_of_lifePgResource.parameters, selectArgs);
        return pgClassExpression($row, resource_single_table_items_meaning_of_lifePgResource.codec, undefined)`${from}`;
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
      singleTableItemRelationCompositePksByParentId: {
        plan($record) {
          const $records = otherSource_single_table_item_relation_composite_pksPgResource.find({
            parent_id: $record.get("id")
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
      },
      singleTableItemRelationsByChildId: {
        plan($record) {
          const $records = otherSource_single_table_item_relationsPgResource.find({
            child_id: $record.get("id")
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
      },
      singleTableItemRelationsByParentId: {
        plan($record) {
          const $records = otherSource_single_table_item_relationsPgResource.find({
            parent_id: $record.get("id")
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
      },
      singleTableItemsByParentId: {
        plan($record) {
          const $records = resource_single_table_itemsPgResource.find({
            parent_id: $record.get("id")
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
        const {
          $row,
          selectArgs
        } = pgFunctionArgumentsFromArgs($in, makeArgs_first_party_vulnerabilities_cvss_score_int(args), true);
        const from = pgFromExpression($row, resource_single_table_items_meaning_of_lifePgResource.from, resource_single_table_items_meaning_of_lifePgResource.parameters, selectArgs);
        return pgClassExpression($row, resource_single_table_items_meaning_of_lifePgResource.codec, undefined)`${from}`;
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
        return pgResource_prioritiesPgResource.get({
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
      singleTableItemRelationCompositePksByParentId: {
        plan($record) {
          const $records = otherSource_single_table_item_relation_composite_pksPgResource.find({
            parent_id: $record.get("id")
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
      },
      singleTableItemRelationsByChildId: {
        plan($record) {
          const $records = otherSource_single_table_item_relationsPgResource.find({
            child_id: $record.get("id")
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
      },
      singleTableItemRelationsByParentId: {
        plan($record) {
          const $records = otherSource_single_table_item_relationsPgResource.find({
            parent_id: $record.get("id")
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
      },
      singleTableItemsByParentId: {
        plan($record) {
          const $records = resource_single_table_itemsPgResource.find({
            parent_id: $record.get("id")
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
        const {
          $row,
          selectArgs
        } = pgFunctionArgumentsFromArgs($in, makeArgs_first_party_vulnerabilities_cvss_score_int(args), true);
        const from = pgFromExpression($row, resource_single_table_items_meaning_of_lifePgResource.from, resource_single_table_items_meaning_of_lifePgResource.parameters, selectArgs);
        return pgClassExpression($row, resource_single_table_items_meaning_of_lifePgResource.codec, undefined)`${from}`;
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
      singleTableItemRelationCompositePksByParentId: {
        plan($record) {
          const $records = otherSource_single_table_item_relation_composite_pksPgResource.find({
            parent_id: $record.get("id")
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
      },
      singleTableItemRelationsByChildId: {
        plan($record) {
          const $records = otherSource_single_table_item_relationsPgResource.find({
            child_id: $record.get("id")
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
      },
      singleTableItemRelationsByParentId: {
        plan($record) {
          const $records = otherSource_single_table_item_relationsPgResource.find({
            parent_id: $record.get("id")
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
      },
      singleTableItemsByParentId: {
        plan($record) {
          const $records = resource_single_table_itemsPgResource.find({
            parent_id: $record.get("id")
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
        const specifier = nodeIdHandlerByTypeName.SingleTableItemRelation.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.SingleTableItemRelation.codec.name].encode);
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
        const specifier = nodeIdHandlerByTypeName.SingleTableItemRelationCompositePk.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.SingleTableItemRelationCompositePk.codec.name].encode);
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
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
      }
    }
  },
  SingleTableItemRelationCompositePksEdge: {
    assertStep: assertEdgeCapableStep,
    plans: {
      cursor($edge) {
        return $edge.cursor();
      },
      node($edge) {
        return $edge.node();
      }
    }
  },
  SingleTableItemRelationsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
      }
    }
  },
  SingleTableItemRelationsEdge: {
    assertStep: assertEdgeCapableStep,
    plans: {
      cursor($edge) {
        return $edge.cursor();
      },
      node($edge) {
        return $edge.node();
      }
    }
  },
  SingleTableItemsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
      }
    }
  },
  SingleTableItemsEdge: {
    assertStep: assertEdgeCapableStep,
    plans: {
      cursor($edge) {
        return $edge.cursor();
      },
      node($edge) {
        return $edge.node();
      }
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
        const {
          $row,
          selectArgs
        } = pgFunctionArgumentsFromArgs($in, makeArgs_first_party_vulnerabilities_cvss_score_int(args), true);
        const from = pgFromExpression($row, resource_single_table_items_meaning_of_lifePgResource.from, resource_single_table_items_meaning_of_lifePgResource.parameters, selectArgs);
        return pgClassExpression($row, resource_single_table_items_meaning_of_lifePgResource.codec, undefined)`${from}`;
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
        return pgResource_prioritiesPgResource.get({
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
      singleTableItemRelationCompositePksByParentId: {
        plan($record) {
          const $records = otherSource_single_table_item_relation_composite_pksPgResource.find({
            parent_id: $record.get("id")
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
      },
      singleTableItemRelationsByChildId: {
        plan($record) {
          const $records = otherSource_single_table_item_relationsPgResource.find({
            child_id: $record.get("id")
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
      },
      singleTableItemRelationsByParentId: {
        plan($record) {
          const $records = otherSource_single_table_item_relationsPgResource.find({
            parent_id: $record.get("id")
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
      },
      singleTableItemsByParentId: {
        plan($record) {
          const $records = resource_single_table_itemsPgResource.find({
            parent_id: $record.get("id")
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
        const {
          $row,
          selectArgs
        } = pgFunctionArgumentsFromArgs($in, makeArgs_first_party_vulnerabilities_cvss_score_int(args), true);
        const from = pgFromExpression($row, resource_single_table_items_meaning_of_lifePgResource.from, resource_single_table_items_meaning_of_lifePgResource.parameters, selectArgs);
        return pgClassExpression($row, resource_single_table_items_meaning_of_lifePgResource.codec, undefined)`${from}`;
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
      singleTableItemRelationCompositePksByParentId: {
        plan($record) {
          const $records = otherSource_single_table_item_relation_composite_pksPgResource.find({
            parent_id: $record.get("id")
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
      },
      singleTableItemRelationsByChildId: {
        plan($record) {
          const $records = otherSource_single_table_item_relationsPgResource.find({
            child_id: $record.get("id")
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
      },
      singleTableItemRelationsByParentId: {
        plan($record) {
          const $records = otherSource_single_table_item_relationsPgResource.find({
            parent_id: $record.get("id")
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
      },
      singleTableItemsByParentId: {
        plan($record) {
          const $records = resource_single_table_itemsPgResource.find({
            parent_id: $record.get("id")
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
      },
      updatedAt($record) {
        return $record.get("updated_at");
      }
    }
  },
  ThirdPartyVulnerabilitiesConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
      }
    }
  },
  ThirdPartyVulnerabilitiesEdge: {
    assertStep: assertEdgeCapableStep,
    plans: {
      cursor($edge) {
        return $edge.cursor();
      },
      node($edge) {
        return $edge.node();
      }
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
          only($parent, $connection, fieldArgs) {
            const $union = $connection.getSubplan();
            const $ltt = fieldArgs.getRaw();
            if ($ltt instanceof ConstantStep && $ltt.data == null) {
              // No action
            } else {
              $union.apply(lambda($ltt, limitToTypes));
            }
          },
          orderBy(parent, $connection, value) {
            const $select = $connection.getSubplan();
            value.apply($select);
          }
        }
      },
      cvssScore($record) {
        return $record.get("cvss_score");
      },
      cvssScoreInt($in, args, _info) {
        const {
          $row,
          selectArgs
        } = pgFunctionArgumentsFromArgs($in, makeArgs_first_party_vulnerabilities_cvss_score_int(args), true);
        const from = pgFromExpression($row, resource_third_party_vulnerabilities_cvss_score_intPgResource.from, resource_third_party_vulnerabilities_cvss_score_intPgResource.parameters, selectArgs);
        return pgClassExpression($row, resource_third_party_vulnerabilities_cvss_score_intPgResource.codec, undefined)`${from}`;
      },
      nodeId($parent) {
        const specifier = nodeIdHandlerByTypeName.ThirdPartyVulnerability.plan($parent);
        return lambda(specifier, nodeIdCodecs[nodeIdHandlerByTypeName.ThirdPartyVulnerability.codec.name].encode);
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
      return pgResource_third_party_vulnerabilitiesPgResource.get(spec);
    }
  },
  UpdateAwsApplicationPayload: {
    assertStep: ObjectStep,
    plans: {
      awsApplication($object) {
        return $object.get("result");
      },
      awsApplicationEdge($mutation, fieldArgs) {
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
            return pgResource_aws_applicationsPgResource.find(spec);
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
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      organizationByOrganizationId($record) {
        return pgResource_organizationsPgResource.get({
          organization_id: $record.get("result").get("organization_id")
        });
      },
      personByPersonId($record) {
        return otherSource_peoplePgResource.get({
          person_id: $record.get("result").get("person_id")
        });
      },
      query() {
        return rootValue();
      }
    }
  },
  UpdateFirstPartyVulnerabilityPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      firstPartyVulnerability($object) {
        return $object.get("result");
      },
      firstPartyVulnerabilityEdge($mutation, fieldArgs) {
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
            return pgResource_first_party_vulnerabilitiesPgResource.find(spec);
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
      query() {
        return rootValue();
      }
    }
  },
  UpdateGcpApplicationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      gcpApplication($object) {
        return $object.get("result");
      },
      gcpApplicationEdge($mutation, fieldArgs) {
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
            return pgResource_gcp_applicationsPgResource.find(spec);
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
      organizationByOrganizationId($record) {
        return pgResource_organizationsPgResource.get({
          organization_id: $record.get("result").get("organization_id")
        });
      },
      personByPersonId($record) {
        return otherSource_peoplePgResource.get({
          person_id: $record.get("result").get("person_id")
        });
      },
      query() {
        return rootValue();
      }
    }
  },
  UpdateLogEntryPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      logEntry($object) {
        return $object.get("result");
      },
      logEntryEdge($mutation, fieldArgs) {
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
            return pgResource_log_entriesPgResource.find(spec);
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
      organizationByOrganizationId($record) {
        return pgResource_organizationsPgResource.get({
          organization_id: $record.get("result").get("organization_id")
        });
      },
      personByPersonId($record) {
        return otherSource_peoplePgResource.get({
          person_id: $record.get("result").get("person_id")
        });
      },
      query() {
        return rootValue();
      }
    }
  },
  UpdateOrganizationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      organization($object) {
        return $object.get("result");
      },
      organizationEdge($mutation, fieldArgs) {
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
            return pgResource_organizationsPgResource.find(spec);
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
      query() {
        return rootValue();
      }
    }
  },
  UpdatePersonPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      person($object) {
        return $object.get("result");
      },
      personEdge($mutation, fieldArgs) {
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
        fieldArgs.apply($select, "orderBy");
        const $connection = connection($select);
        // NOTE: you must not use `$single = $select.single()`
        // here because doing so will mark the row as unique, and
        // then the ordering logic (and thus cursor) will differ.
        const $single = $select.row(first($select));
        return new EdgeStep($connection, $single);
      },
      query() {
        return rootValue();
      }
    }
  },
  UpdateRelationalItemRelationCompositePkPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      query() {
        return rootValue();
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
      },
      relationalItemRelationCompositePk($object) {
        return $object.get("result");
      },
      relationalItemRelationCompositePkEdge($mutation, fieldArgs) {
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
            return pgResource_relational_item_relation_composite_pksPgResource.find(spec);
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
    }
  },
  UpdateRelationalItemRelationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      query() {
        return rootValue();
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
      },
      relationalItemRelation($object) {
        return $object.get("result");
      },
      relationalItemRelationEdge($mutation, fieldArgs) {
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
            return pgResource_relational_item_relationsPgResource.find(spec);
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
    }
  },
  UpdateSingleTableItemRelationCompositePkPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      query() {
        return rootValue();
      },
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
      singleTableItemRelationCompositePk($object) {
        return $object.get("result");
      },
      singleTableItemRelationCompositePkEdge($mutation, fieldArgs) {
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
        fieldArgs.apply($select, "orderBy");
        const $connection = connection($select);
        // NOTE: you must not use `$single = $select.single()`
        // here because doing so will mark the row as unique, and
        // then the ordering logic (and thus cursor) will differ.
        const $single = $select.row(first($select));
        return new EdgeStep($connection, $single);
      }
    }
  },
  UpdateSingleTableItemRelationPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      query() {
        return rootValue();
      },
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
      singleTableItemRelation($object) {
        return $object.get("result");
      },
      singleTableItemRelationEdge($mutation, fieldArgs) {
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
        fieldArgs.apply($select, "orderBy");
        const $connection = connection($select);
        // NOTE: you must not use `$single = $select.single()`
        // here because doing so will mark the row as unique, and
        // then the ordering logic (and thus cursor) will differ.
        const $single = $select.row(first($select));
        return new EdgeStep($connection, $single);
      }
    }
  },
  UpdateThirdPartyVulnerabilityPayload: {
    assertStep: ObjectStep,
    plans: {
      clientMutationId($mutation) {
        const $result = $mutation.getStepForKey("result");
        return $result.getMeta("clientMutationId");
      },
      query() {
        return rootValue();
      },
      thirdPartyVulnerability($object) {
        return $object.get("result");
      },
      thirdPartyVulnerabilityEdge($mutation, fieldArgs) {
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
            return pgResource_third_party_vulnerabilitiesPgResource.find(spec);
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
    }
  },
  VulnerabilitiesConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
      }
    }
  },
  VulnerabilitiesEdge: {
    assertStep: assertEdgeCapableStep,
    plans: {
      cursor($edge) {
        return $edge.cursor();
      },
      node($edge) {
        return $edge.node();
      }
    }
  },
  ZeroImplementationsConnection: {
    assertStep: ConnectionStep,
    plans: {
      totalCount($connection) {
        return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, false);
      }
    }
  },
  ZeroImplementationsEdge: {
    assertStep: assertEdgeCapableStep,
    plans: {
      cursor($edge) {
        return $edge.cursor();
      },
      node($edge) {
        return $edge.node();
      }
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
        $condition.where({
          type: "attribute",
          attribute: "id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
      },
      lastDeployed($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "last_deployed",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.timestamptz)}`;
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
    }
  },
  AwsApplicationCondition: {
    plans: {
      awsId($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "aws_id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
          }
        });
      },
      id($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
      },
      lastDeployed($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "last_deployed",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.timestamptz)}`;
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
      },
      organizationId($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "organization_id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
      },
      personId($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "person_id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
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
  CreateAwsApplicationInput: {
    plans: {
      awsApplication(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      },
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  CreateFirstPartyVulnerabilityInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      firstPartyVulnerability(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  CreateGcpApplicationInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      gcpApplication(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  CreateLogEntryInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      logEntry(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  CreateOrganizationInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      organization(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  CreatePersonInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      person(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  CreateRelationalItemRelationCompositePkInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      relationalItemRelationCompositePk(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  CreateRelationalItemRelationInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      relationalItemRelation(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  CreateSingleTableItemRelationCompositePkInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      singleTableItemRelationCompositePk(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  CreateSingleTableItemRelationInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      singleTableItemRelation(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  CreateThirdPartyVulnerabilityInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      thirdPartyVulnerability(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
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
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeleteAwsApplicationInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeleteFirstPartyVulnerabilityByIdInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeleteFirstPartyVulnerabilityInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeleteGcpApplicationByIdInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeleteGcpApplicationInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeleteLogEntryByIdInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeleteLogEntryInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeleteOrganizationByNameInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeleteOrganizationByOrganizationIdInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeleteOrganizationInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeletePersonByPersonIdInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeletePersonByUsernameInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeletePersonInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeleteRelationalItemRelationByIdInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeleteRelationalItemRelationByParentIdAndChildIdInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeleteRelationalItemRelationCompositePkByParentIdAndChildIdInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeleteRelationalItemRelationCompositePkInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeleteRelationalItemRelationInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeleteSingleTableItemRelationByIdInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeleteSingleTableItemRelationByParentIdAndChildIdInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeleteSingleTableItemRelationCompositePkByParentIdAndChildIdInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeleteSingleTableItemRelationCompositePkInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeleteSingleTableItemRelationInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeleteThirdPartyVulnerabilityByIdInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  DeleteThirdPartyVulnerabilityInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  FirstPartyVulnerabilityCondition: {
    plans: {
      cvssScore($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "cvss_score",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.float)}`;
          }
        });
      },
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
      },
      teamName($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "team_name",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
          }
        });
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
        $condition.where({
          type: "attribute",
          attribute: "gcp_id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
          }
        });
      },
      id($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
      },
      lastDeployed($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "last_deployed",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.timestamptz)}`;
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
      },
      organizationId($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "organization_id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
      },
      personId($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "person_id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
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
        $condition.where({
          type: "attribute",
          attribute: "id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
      },
      organizationId($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "organization_id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
      },
      personId($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "person_id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
      },
      text($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "text",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
          }
        });
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
        $condition.where({
          type: "attribute",
          attribute: "name",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
          }
        });
      },
      organizationId($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "organization_id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
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
        $condition.where({
          type: "attribute",
          attribute: "person_id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
      },
      username($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "username",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
          }
        });
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
        $condition.where({
          type: "attribute",
          attribute: "title",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
          }
        });
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
        $condition.where({
          type: "attribute",
          attribute: "description",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
          }
        });
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
        $condition.where({
          type: "attribute",
          attribute: "note",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
          }
        });
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
        $condition.where({
          type: "attribute",
          attribute: "color",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
          }
        });
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
        $condition.where({
          type: "attribute",
          attribute: "title",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
          }
        });
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
        $condition.where({
          type: "attribute",
          attribute: "archived_at",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.timestamptz)}`;
          }
        });
      },
      authorId($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "author_id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
      },
      createdAt($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "created_at",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.timestamptz)}`;
          }
        });
      },
      id($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
      },
      isExplicitlyArchived($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "is_explicitly_archived",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.boolean)}`;
          }
        });
      },
      parentId($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "parent_id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
      },
      position($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "position",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.bigint)}`;
          }
        });
      },
      rootTopicId($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "root_topic_id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
      },
      type($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "type",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, itemTypeCodec)}`;
          }
        });
      },
      updatedAt($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "updated_at",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.timestamptz)}`;
          }
        });
      }
    }
  },
  RelationalItemRelationCompositePkCondition: {
    plans: {
      childId($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "child_id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
      },
      parentId($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "parent_id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
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
        $condition.where({
          type: "attribute",
          attribute: "child_id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
      },
      id($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
      },
      parentId($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "parent_id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
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
        $condition.where({
          type: "attribute",
          attribute: "description",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
          }
        });
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
        $condition.where({
          type: "attribute",
          attribute: "note",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
          }
        });
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
        $condition.where({
          type: "attribute",
          attribute: "title",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
          }
        });
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
        $condition.where({
          type: "attribute",
          attribute: "title",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
          }
        });
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
        $condition.where({
          type: "attribute",
          attribute: "archived_at",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.timestamptz)}`;
          }
        });
      },
      authorId($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "author_id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
      },
      createdAt($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "created_at",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.timestamptz)}`;
          }
        });
      },
      id($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
      },
      isExplicitlyArchived($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "is_explicitly_archived",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.boolean)}`;
          }
        });
      },
      parentId($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "parent_id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
      },
      position($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "position",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.bigint)}`;
          }
        });
      },
      rootTopicId($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "root_topic_id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
      },
      type($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "type",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, itemTypeCodec)}`;
          }
        });
      },
      updatedAt($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "updated_at",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.timestamptz)}`;
          }
        });
      }
    }
  },
  SingleTableItemRelationCompositePkCondition: {
    plans: {
      childId($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "child_id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
      },
      parentId($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "parent_id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
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
        $condition.where({
          type: "attribute",
          attribute: "child_id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
      },
      id($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
      },
      parentId($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "parent_id",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.int)}`;
          }
        });
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
        $condition.where({
          type: "attribute",
          attribute: "cvss_score",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.float)}`;
          }
        });
      },
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
      },
      vendorName($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "vendor_name",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
          }
        });
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
      awsApplicationPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      },
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  UpdateAwsApplicationInput: {
    plans: {
      awsApplicationPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      },
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      }
    }
  },
  UpdateFirstPartyVulnerabilityByIdInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      firstPartyVulnerabilityPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  UpdateFirstPartyVulnerabilityInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      firstPartyVulnerabilityPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  UpdateGcpApplicationByIdInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      gcpApplicationPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  UpdateGcpApplicationInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      gcpApplicationPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  UpdateLogEntryByIdInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      logEntryPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  UpdateLogEntryInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      logEntryPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  UpdateOrganizationByNameInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      organizationPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  UpdateOrganizationByOrganizationIdInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      organizationPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  UpdateOrganizationInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      organizationPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  UpdatePersonByPersonIdInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      personPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  UpdatePersonByUsernameInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      personPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  UpdatePersonInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      personPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  UpdateRelationalItemRelationByIdInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      relationalItemRelationPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  UpdateRelationalItemRelationByParentIdAndChildIdInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      relationalItemRelationPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  UpdateRelationalItemRelationCompositePkByParentIdAndChildIdInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      relationalItemRelationCompositePkPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  UpdateRelationalItemRelationCompositePkInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      relationalItemRelationCompositePkPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  UpdateRelationalItemRelationInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      relationalItemRelationPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  UpdateSingleTableItemRelationByIdInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      singleTableItemRelationPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  UpdateSingleTableItemRelationByParentIdAndChildIdInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      singleTableItemRelationPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  UpdateSingleTableItemRelationCompositePkByParentIdAndChildIdInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      singleTableItemRelationCompositePkPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  UpdateSingleTableItemRelationCompositePkInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      singleTableItemRelationCompositePkPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  UpdateSingleTableItemRelationInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      singleTableItemRelationPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  UpdateThirdPartyVulnerabilityByIdInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      thirdPartyVulnerabilityPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  UpdateThirdPartyVulnerabilityInput: {
    plans: {
      clientMutationId(qb, val) {
        qb.setMeta("clientMutationId", val);
      },
      thirdPartyVulnerabilityPatch(qb, arg) {
        if (arg != null) {
          return qb.setBuilder();
        }
      }
    }
  },
  VulnerabilityCondition: {
    plans: {
      cvssScore($condition, val) {
        $condition.where({
          type: "attribute",
          attribute: "cvss_score",
          callback(expression) {
            return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.float)}`;
          }
        });
      },
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
    }
  },
  ZeroImplementationCondition: {
    plans: {
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
    }
  }
};
export const scalars = {
  BigInt: {
    serialize: BigIntSerialize,
    parseValue: BigIntSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"BigInt" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
    }
  },
  Cursor: {
    serialize: BigIntSerialize,
    parseValue: BigIntSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"Cursor" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
    }
  },
  Datetime: {
    serialize: BigIntSerialize,
    parseValue: BigIntSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(`${"Datetime" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      }
      return ast.value;
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
