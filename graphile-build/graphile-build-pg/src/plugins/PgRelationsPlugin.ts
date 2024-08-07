import "./PgTablesPlugin.js";
import "graphile-config";

import type {
  PgCodec,
  PgCodecRef,
  PgCodecRefPath,
  PgCodecRelation,
  PgCodecRelationConfig,
  PgCodecWithAttributes,
  PgRefDefinition,
  PgRegistry,
  PgResource,
  PgResourceOptions,
  PgSelectSingleStep,
  PgUnionAllStepConfigAttributes,
  PgUnionAllStepMember,
} from "@dataplan/pg";
import { pgUnionAll } from "@dataplan/pg";
import type { ExecutableStep, ObjectStep } from "grafast";
import { arraysMatch, connection } from "grafast";
import type { GraphQLFieldConfigMap, GraphQLObjectType } from "grafast/graphql";
import { EXPORTABLE, gatherConfig } from "graphile-build";
import type { PgAttribute, PgClass, PgConstraint } from "pg-introspection";
import sql from "pg-sql2";
import type { TE } from "tamedevil";
import te, { Idents, isSafeObjectPropertyName } from "tamedevil";

import { resolveResourceRefPath, tagToString } from "../utils.js";
import { version } from "../version.js";

const ref_connection = te.ref(connection, "connection");
const ref_sql = te.ref(sql, "sql");

declare global {
  namespace GraphileBuild {
    interface SchemaOptions {
      pgMutationPayloadRelations?: boolean;
    }
    interface PgRelationsPluginRelationDetails {
      registry: PgRegistry;
      codec: PgCodecWithAttributes;
      relationName: string;
    }
    interface PgRelationsPluginRefDetails {
      registry: PgRegistry;
      codec: PgCodecWithAttributes;
      ref: PgCodecRef;
    }

    interface ScopeObjectFieldsField {
      isPgSingleRelationField?: boolean;
      isPgManyRelationConnectionField?: boolean;
      isPgManyRelationListField?: boolean;
      pgRelationDetails?: PgRelationsPluginRelationDetails;
      /** @experimental */
      pgRefDetails?: PgRelationsPluginRefDetails;
    }
    interface Inflection {
      resourceRelationName(
        this: Inflection,
        details: {
          serviceName: string;
          pgConstraint: PgConstraint;
          localClass: PgClass;
          localAttributes: PgAttribute[];
          foreignClass: PgClass;
          foreignAttributes: PgAttribute[];
          isUnique: boolean;
          isReferencee: boolean;
        },
      ): string;
      singleRelation(
        this: Inflection,
        details: PgRelationsPluginRelationDetails,
      ): string;
      singleRelationBackwards(
        this: Inflection,
        details: PgRelationsPluginRelationDetails,
      ): string;
      _manyRelation(
        this: Inflection,
        details: PgRelationsPluginRelationDetails,
      ): string;
      manyRelationConnection(
        this: Inflection,
        details: PgRelationsPluginRelationDetails,
      ): string;
      manyRelationList(
        this: Inflection,
        details: PgRelationsPluginRelationDetails,
      ): string;
    }
  }

  namespace DataplanPg {
    interface PgCodecRelationExtensions {
      /** The (singular) forward relation name */
      fieldName?: string;
      /** The (singular) backward relation name for a FK against a unique combo */
      foreignSingleFieldName?: string;
      /** The (plural) backward relation name for a FK when exposed as a list (rather than a connection) */
      foreignSimpleFieldName?: string;
      /** The (generally plural) backward relation name, also used as a fallback from foreignSimpleFieldName, foreignSingleFieldName */
      foreignFieldName?: string;
    }
  }

  namespace GraphileConfig {
    interface GatherHelpers {
      pgRelations: {
        addRelation(
          event: {
            pgClass: PgClass;
            serviceName: string;
            resourceOptions: PgResourceOptions;
          },
          pgConstraint: PgConstraint,
          isReferencee?: boolean,
        ): Promise<void>;
      };
    }
    interface GatherHooks {
      pgRelations_relation(event: {
        serviceName: string;
        pgClass: PgClass;
        pgConstraint: PgConstraint;
        relation: PgCodecRelationConfig;
      }): Promise<void> | void;
    }
  }
}

interface State {}
const EMPTY_OBJECT = Object.freeze({});

// TODO: split this into one plugin for gathering and another for schema
export const PgRelationsPlugin: GraphileConfig.Plugin = {
  name: "PgRelationsPlugin",
  description:
    "Creates relationships between the @dataplan/pg resources, and mirrors these relationships into the GraphQL schema",
  version,
  after: ["smart-tags", "PgFakeConstraintsPlugin", "PgTablesPlugin"],

  inflection: {
    add: {
      resourceRelationName(
        options,
        {
          serviceName,
          pgConstraint,
          localClass: _localClass,
          localAttributes,
          foreignClass,
          foreignAttributes,
          isUnique,
          isReferencee,
        },
      ) {
        const { tags } = pgConstraint.getTagsAndDescription();
        if (!isReferencee && typeof tags.fieldName === "string") {
          return tags.fieldName;
        }
        if (isReferencee && typeof tags.foreignFieldName === "string") {
          return tags.foreignFieldName;
        }
        const remoteName = this.tableResourceName({
          serviceName,
          pgClass: foreignClass,
        });
        const attributes = !isReferencee
          ? // We have a attribute referencing another table
            localAttributes
          : // The other table has a constraint that references us; this is the backwards relation.
            foreignAttributes;
        const attributeNames = attributes.map((col) => col.attname);
        return this.camelCase(
          `${isUnique ? remoteName : this.pluralize(remoteName)}-by-${
            isReferencee ? "their" : "my"
          }-${attributeNames.join("-and-")}`,
        );
      },

      singleRelation(options, details) {
        const { registry, codec, relationName } = details;
        const relation = registry.pgRelations[codec.name]?.[relationName];
        //const codec = relation.remoteResource.codec;
        if (typeof relation.extensions?.tags.fieldName === "string") {
          return relation.extensions.tags.fieldName;
        }
        // E.g. posts(author_id) references users(id)
        const remoteType = this.tableType(relation.remoteResource.codec);
        const localAttributes = relation.localAttributes as string[];
        return this.camelCase(
          `${remoteType}-by-${this._joinAttributeNames(
            codec,
            localAttributes,
          )}`,
        );
      },
      singleRelationBackwards(options, details) {
        const { registry, codec, relationName } = details;
        const relation = registry.pgRelations[codec.name]?.[relationName];
        if (
          typeof relation.extensions?.tags.foreignSingleFieldName === "string"
        ) {
          return relation.extensions.tags.foreignSingleFieldName;
        }
        if (typeof relation.extensions?.tags.foreignFieldName === "string") {
          return relation.extensions.tags.foreignFieldName;
        }
        // E.g. posts(author_id) references users(id)
        const remoteType = this.tableType(relation.remoteResource.codec);
        const remoteAttributes = relation.remoteAttributes as string[];
        return this.camelCase(
          `${remoteType}-by-${this._joinAttributeNames(
            relation.remoteResource.codec,
            remoteAttributes,
          )}`,
        );
      },
      _manyRelation(options, details) {
        const { registry, codec, relationName } = details;
        const relation = registry.pgRelations[codec.name]?.[relationName];
        const baseOverride = relation.extensions?.tags.foreignFieldName;
        if (typeof baseOverride === "string") {
          return baseOverride;
        }
        // E.g. users(id) references posts(author_id)
        const remoteType = this.tableType(relation.remoteResource.codec);
        const remoteAttributes = relation.remoteAttributes as string[];
        return this.camelCase(
          `${this.pluralize(remoteType)}-by-${this._joinAttributeNames(
            relation.remoteResource.codec,
            remoteAttributes,
          )}`,
        );
      },
      manyRelationConnection(options, details) {
        const { registry, codec, relationName } = details;
        const relation = registry.pgRelations[codec.name]?.[relationName];
        const override = relation.extensions?.tags.foreignConnectionFieldName;
        if (typeof override === "string") {
          return override;
        }
        return this.connectionField(this._manyRelation(details));
      },
      manyRelationList(options, details) {
        const { registry, codec, relationName } = details;
        const relation = registry.pgRelations[codec.name]?.[relationName];
        const override = relation.extensions?.tags.foreignSimpleFieldName;
        if (typeof override === "string") {
          return override;
        }
        return this.listField(this._manyRelation(details));
      },
    },
  },

  gather: gatherConfig({
    namespace: "pgRelations",
    initialCache() {
      return EMPTY_OBJECT;
    },
    initialState: (): State => Object.create(null),
    helpers: {
      async addRelation(info, event, pgConstraint, isReferencee = false) {
        const pgClass = isReferencee
          ? pgConstraint.getForeignClass()
          : pgConstraint.getClass();
        const foreignClass = isReferencee
          ? pgConstraint.getClass()
          : pgConstraint.getForeignClass();
        if (!pgClass || !foreignClass) {
          throw new Error(`Invalid introspection`);
        }
        const localAttributeNumbers = isReferencee
          ? pgConstraint.confkey!
          : pgConstraint.conkey!;
        const foreignAttributeNumbers = isReferencee
          ? pgConstraint.conkey!
          : pgConstraint.confkey!;
        const isUnique = !isReferencee
          ? true
          : (() => {
              // This relationship is unique if the REFERENCED table (not us!)
              // has a unique constraint on the remoteAttributes the relationship
              // specifies (or a subset thereof).
              const foreignUniqueAttributeOnlyConstraints = foreignClass
                .getConstraints()!
                .filter(
                  (c) =>
                    ["u", "p"].includes(c.contype) &&
                    c.conkey?.every((k) => k > 0),
                );
              const foreignUniqueAttributeNumberCombinations =
                foreignUniqueAttributeOnlyConstraints.map((c) => c.conkey!);
              const isUnique = foreignUniqueAttributeNumberCombinations.some(
                (foreignUniqueAttributeNumbers) => {
                  return foreignUniqueAttributeNumbers.every(
                    (n) => n > 0 && pgConstraint.conkey!.includes(n),
                  );
                },
              );
              return isUnique;
            })();
        const { serviceName } = event;
        const localAttributes = await Promise.all(
          localAttributeNumbers.map((key) =>
            info.helpers.pgIntrospection.getAttribute(
              serviceName,
              pgClass._id,
              key,
            ),
          ),
        );
        const localCodec = await info.helpers.pgCodecs.getCodecFromClass(
          serviceName,
          pgClass._id,
        );
        const foreignAttributes = await Promise.all(
          foreignAttributeNumbers.map((key) =>
            info.helpers.pgIntrospection.getAttribute(
              serviceName,
              foreignClass!._id,
              key,
            ),
          ),
        );
        const foreignResourceOptions =
          (await info.helpers.pgTables.getResourceOptions(
            serviceName,
            foreignClass,
          )) as PgResourceOptions<any, PgCodecWithAttributes, any, any>;
        if (
          !localCodec ||
          !foreignResourceOptions ||
          foreignResourceOptions.isVirtual
        ) {
          return;
        }
        const relationName = info.inflection.resourceRelationName({
          serviceName,
          pgConstraint,
          localClass: pgClass,
          localAttributes: localAttributes as PgAttribute[],
          foreignClass,
          foreignAttributes: foreignAttributes as PgAttribute[],
          isUnique,
          isReferencee,
        });
        const registryBuilder =
          await info.helpers.pgRegistry.getRegistryBuilder();
        const { codec } = event.resourceOptions;
        let localCodecPolymorphicTypes: string[] | undefined = undefined;
        if (codec.polymorphism?.mode === "single") {
          const poly = codec.polymorphism;
          if (
            localAttributes.every((attr) =>
              poly.commonAttributes.includes(attr!.attname),
            )
          ) {
            // Common to all types
          } else {
            if (isReferencee) {
              // ENHANCE: consider supporting backward relationships for single
              // table polymorphic types. It's not immediately clear what the
              // user would want in these cases: is it separate fields for each
              // type (that would inflate the schema), or is it a relation to
              // the underlying polymorphic type even though we know certain
              // concrete types from it will never appear? For now we're
              // skipping it entirely because then we can add whatever makes
              // sense later.
              return;
            }
            localCodecPolymorphicTypes = [];
            for (const [typeKey, typeDetails] of Object.entries(poly.types)) {
              if (
                localAttributes.every(
                  (attr) =>
                    poly.commonAttributes.includes(attr!.attname) ||
                    typeDetails.attributes.some(
                      (a) => a.attribute === attr!.attname,
                    ),
                )
              ) {
                // MATCH!
                localCodecPolymorphicTypes.push(typeKey);
              }
            }
          }
        }
        const existingRelation =
          registryBuilder.getRegistryConfig().pgRelations[codec.name]?.[
            relationName
          ];
        const { tags: rawTags, description: constraintDescription } =
          pgConstraint.getTagsAndDescription();
        // Clone the tags because we use the same tags on both relations
        // (in both directions) but don't want modifications made to one
        // to affect the other.
        const tags = JSON.parse(JSON.stringify(rawTags));
        const description = isReferencee
          ? tags.backwardDescription
          : tags.forwardDescription ?? constraintDescription;
        const baseBehavior = tags.behavior;
        const specificBehavior = isReferencee
          ? tags.backwardBehavior
          : tags.forwardBehavior;
        const behavior = combineBehaviors(baseBehavior, specificBehavior);
        const newRelation: PgCodecRelationConfig = {
          localCodec: localCodec as PgCodecWithAttributes,
          localCodecPolymorphicTypes,
          localAttributes: localAttributes.map((c) => c!.attname),
          remoteAttributes: foreignAttributes.map((c) => c!.attname),
          remoteResourceOptions: foreignResourceOptions,
          isUnique,
          isReferencee,
          description:
            typeof description === "string" ? description : undefined,
          extensions: {
            tags: {
              ...tags,
              behavior,
            },
          },
        };
        await info.process("pgRelations_relation", {
          serviceName,
          pgClass,
          pgConstraint,
          relation: newRelation,
        });
        if (existingRelation) {
          const isEquivalent =
            existingRelation.isUnique === newRelation.isUnique &&
            existingRelation.isReferencee === newRelation.isReferencee &&
            arraysMatch(
              existingRelation.localAttributes,
              newRelation.localAttributes,
            ) &&
            arraysMatch(
              existingRelation.remoteAttributes,
              newRelation.remoteAttributes,
            ) &&
            existingRelation.remoteResourceOptions ===
              newRelation.remoteResourceOptions;
          const message = `Attempted to add a ${
            isReferencee ? "backwards" : "forwards"
          } relation named '${relationName}' to '${pgClass.relname}' for ${
            isEquivalent ? "equivalent " : ""
          }constraint '${pgConstraint.conname}' on '${
            pgClass.getNamespace()!.nspname
          }.${
            pgClass.relname
          }', but a relation by that name already exists; consider renaming the relation by overriding the 'sourceRelationName' inflector`;
          if (isEquivalent) {
            console.warn(message);
            return;
          } else {
            throw new Error(message);
          }
        }
        registryBuilder.addRelation(
          codec as PgCodecWithAttributes,
          relationName,
          newRelation.remoteResourceOptions,
          newRelation,
        );
      },
    },
    hooks: {
      async pgTables_PgResourceOptions_relations(info, event) {
        const { pgClass, serviceName } = event;
        const constraints =
          await info.helpers.pgIntrospection.getConstraintsForClass(
            serviceName,
            pgClass._id,
          );

        const foreignConstraints =
          await info.helpers.pgIntrospection.getForeignConstraintsForClass(
            serviceName,
            pgClass._id,
          );

        for (const constraint of constraints) {
          if (constraint.contype === "f") {
            await info.helpers.pgRelations.addRelation(event, constraint);
          }
        }
        for (const constraint of foreignConstraints) {
          if (constraint.contype === "f") {
            await info.helpers.pgRelations.addRelation(event, constraint, true);
          }
        }
      },
    },
  }),

  schema: {
    entityBehavior: {
      pgCodecRelation: {
        provides: ["inferred"],
        before: ["override"],
        after: ["default"],
        callback(behavior, entity) {
          if (entity.isUnique) {
            return [
              behavior,
              "single -singularRelation:resource:list -singularRelation:resource:connection",
            ];
          } else {
            return behavior;
          }
        },
      },
      pgCodecRef: {
        provides: ["inferred"],
        before: ["override"],
        after: ["default"],
        callback(behavior, [codec, refName]) {
          const ref = codec.refs?.[refName];
          if (ref?.definition.singular) {
            return [
              behavior,
              "single -singularRelation:resource:list -singularRelation:resource:connection",
            ];
          } else {
            return behavior;
          }
        },
      },
      pgRefDefinition: {
        provides: ["inferred"],
        before: ["override"],
        after: ["default"],
        callback(behavior, entity) {
          if (entity.singular) {
            return [
              behavior,
              "single -singularRelation:resource:list -singularRelation:resource:connection",
            ];
          } else {
            return behavior;
          }
        },
      },
    },
    hooks: {
      GraphQLInterfaceType_fields: addRelations,
      GraphQLObjectType_fields: addRelations,
    },
  },
};

function makeSpecString(
  identifier: TE,
  localAttributes: readonly string[],
  remoteAttributes: readonly string[],
) {
  return te`{ ${te.join(
    remoteAttributes.map(
      (remoteAttributeName, i) =>
        te`${te.safeKeyOrThrow(
          remoteAttributeName,
        )}: ${identifier}.get(${te.lit(localAttributes[i])})`,
    ),
    ", ",
  )} }`;
}

function makeRelationPlans(
  localAttributes: readonly string[],
  remoteAttributes: readonly string[],
  otherSource: PgResource,
  isMutationPayload: boolean,
) {
  const recordOrResult = isMutationPayload
    ? te`$record.get("result")`
    : te`$record`;
  const clean =
    remoteAttributes.every(
      (remoteAttributeName) =>
        typeof remoteAttributeName === "string" &&
        isSafeObjectPropertyName(remoteAttributeName),
    ) &&
    localAttributes.every(
      (localAttributeName) =>
        typeof localAttributeName === "string" &&
        isSafeObjectPropertyName(localAttributeName),
    );

  const specString = clean
    ? makeSpecString(recordOrResult, localAttributes, remoteAttributes)
    : null;

  const specFromRecord = EXPORTABLE(
    (localAttributes, remoteAttributes) => ($record: PgSelectSingleStep) => {
      return remoteAttributes.reduce((memo, remoteAttributeName, i) => {
        memo[remoteAttributeName] = $record.get(localAttributes[i] as string);
        return memo;
      }, Object.create(null));
    },
    [localAttributes, remoteAttributes],
  );
  type MutationPayload = ObjectStep<{
    result: PgSelectSingleStep;
  }>;

  const singleRecordPlan =
    clean && specString
      ? // Optimise function for both execution and export.
        // eslint-disable-next-line graphile-export/exhaustive-deps
        (EXPORTABLE(
          te.run`\
return function (otherSource) {
  return $record => otherSource.get(${specString});
}` as any,
          [otherSource],
        ) as any)
      : isMutationPayload
      ? EXPORTABLE(
          (otherSource, specFromRecord) =>
            function plan($in: MutationPayload) {
              const $record = $in.get("result");
              return otherSource.get(specFromRecord($record));
            },
          [otherSource, specFromRecord],
        )
      : EXPORTABLE(
          (otherSource, specFromRecord) =>
            function plan($record: PgSelectSingleStep) {
              return otherSource.get(specFromRecord($record));
            },
          [otherSource, specFromRecord],
        );

  const listPlan =
    clean && specString
      ? // eslint-disable-next-line graphile-export/exhaustive-deps
        (EXPORTABLE(
          te.run`\
return function (otherSource) {
  return $record => otherSource.find(${specString});
}` as any,
          [otherSource],
        ) as any)
      : isMutationPayload
      ? EXPORTABLE(
          (otherSource, specFromRecord) =>
            function plan($in: MutationPayload) {
              const $record = $in.get("result");
              return otherSource.find(specFromRecord($record));
            },
          [otherSource, specFromRecord],
        )
      : EXPORTABLE(
          (otherSource, specFromRecord) =>
            function plan($record: PgSelectSingleStep) {
              return otherSource.find(specFromRecord($record));
            },
          [otherSource, specFromRecord],
        );

  const connectionPlan =
    clean && specString
      ? // eslint-disable-next-line graphile-export/exhaustive-deps
        (EXPORTABLE(
          te.run`\
return function (otherSource, connection) {
  return $record => {
    const $records = otherSource.find(${specString});
    return connection($records);
  }
}` as any,
          [otherSource, connection],
        ) as any)
      : isMutationPayload
      ? EXPORTABLE(
          (connection, otherSource, specFromRecord) =>
            function plan($in: MutationPayload) {
              const $record = $in.get("result");
              return connection(otherSource.find(specFromRecord($record)));
            },
          [connection, otherSource, specFromRecord],
        )
      : EXPORTABLE(
          (connection, otherSource, specFromRecord) =>
            function plan($record: PgSelectSingleStep) {
              return connection(otherSource.find(specFromRecord($record)));
            },
          [connection, otherSource, specFromRecord],
        );
  return { singleRecordPlan, listPlan, connectionPlan };
}

function addRelations(
  fields: GraphQLFieldConfigMap<any, any>,
  build: GraphileBuild.Build,
  context:
    | GraphileBuild.ContextObjectFields
    | GraphileBuild.ContextInterfaceFields,
) {
  const {
    extend,
    graphql: {
      GraphQLList,
      GraphQLObjectType,
      GraphQLNonNull,
      GraphQLUnionType,
      GraphQLInterfaceType,
    },
  } = build;
  const { Self, scope, fieldWithHooks } = context;

  // const objectMode = context.type === "GraphQLObjectType";

  const { pgCodec } = scope;
  const isPgClassType =
    "isPgClassType" in scope ? scope.isPgClassType : undefined;
  const pgTypeResource =
    "pgTypeResource" in scope ? scope.pgTypeResource : undefined;
  const isMutationPayload =
    "isMutationPayload" in scope ? scope.isMutationPayload : undefined;
  const pgPolymorphism =
    "pgPolymorphism" in scope ? scope.pgPolymorphism : undefined;
  const pgPolymorphicSingleTableType =
    "pgPolymorphicSingleTableType" in scope
      ? scope.pgPolymorphicSingleTableType
      : undefined;

  const codec = (pgTypeResource?.codec ?? pgCodec) as PgCodecWithAttributes;
  if (
    (isMutationPayload && !build.options.pgMutationPayloadRelations) ||
    !(isPgClassType || isMutationPayload || pgPolymorphism) ||
    !codec ||
    !codec.attributes
  ) {
    return fields;
  }
  const resource = pgTypeResource ?? build.pgTableResource(codec);
  const relations: Record<string, PgCodecRelation> = (build.input.pgRegistry
    .pgRelations[codec.name] ?? Object.create(null)) as Record<
    string,
    PgCodecRelation
  >;

  if (resource && resource.parameters && !resource.isUnique) {
    return fields;
  }

  // Don't use refs on mutation payloads
  const refDefinitionList: Array<{
    codec: PgCodecWithAttributes;
    refName: string;
    refDefinition: PgRefDefinition;
    ref?: PgCodecRef;
  }> = isMutationPayload
    ? []
    : codec.refs
    ? Object.entries(codec.refs)
        .filter(
          ([, spec]) =>
            !spec.definition.sourceGraphqlType ||
            spec.definition.sourceGraphqlType === context.Self.name,
        )
        .map(([refName, spec]) => ({
          codec,
          refName,
          refDefinition: spec.definition,
          ref: spec,
        }))
    : Object.entries(
        codec.extensions?.refDefinitions ??
          (Object.create(null) as Record<string, never>),
      )
        .filter(
          ([, refDefinition]) =>
            !refDefinition.sourceGraphqlType ||
            refDefinition.sourceGraphqlType === context.Self.name,
        )
        .map(([refName, refDefinition]) => ({
          codec,
          refName,
          refDefinition,
        }));

  type Digest = {
    identifier: string;
    isReferencee: boolean;
    isUnique: boolean;
    relationTypeScope: string;
    shouldAddSingleField: boolean | undefined;
    shouldAddConnectionField: boolean | undefined;
    shouldAddListField: boolean | undefined;
    typeName: string;
    connectionTypeName: string;
    deprecationReason?: string;
    singleRecordPlan: any;
    listPlan: any;
    connectionPlan: any;
    singleRecordFieldName: string;
    listFieldName: string;
    connectionFieldName: string;
    description?: string;
    pgResource?: PgResource;
    pgCodec: PgCodec | undefined;
    pgRelationDetails?: GraphileBuild.PgRelationsPluginRelationDetails;
    pgRefDetails?: GraphileBuild.PgRelationsPluginRefDetails;
    relatedTypeName: string;
    isNonNull: boolean | undefined;
  };

  const digests: Digest[] = [];

  if (relations) {
    // Digest relations
    for (const [relationName, relation] of Object.entries(relations)) {
      const {
        localCodecPolymorphicTypes,
        localAttributes,
        remoteAttributes,
        remoteResource,
        isReferencee,
      } = relation;
      if (isMutationPayload && isReferencee) {
        // Don't add backwards relations to mutation payloads
        continue;
      }

      if (localCodecPolymorphicTypes) {
        if (!pgPolymorphicSingleTableType) {
          if (context.type === "GraphQLInterfaceType") {
            // Ignore on interface
            continue;
          } else {
            throw new Error(
              `Relationship indicates it only relates to certain polymorphic subtypes, but this type doesn't seem to be polymorphic?`,
            );
          }
        }
        if (
          !localCodecPolymorphicTypes.some(
            (t) => t === pgPolymorphicSingleTableType.typeIdentifier,
          )
        ) {
          // Does not apply to this polymorphic subtype; skip.
          continue;
        }
      }

      const isUnique = relation.isUnique;
      const otherCodec = remoteResource.codec;
      const typeName = build.inflection.tableType(otherCodec);
      const connectionTypeName =
        build.inflection.tableConnectionType(otherCodec);

      const deprecationReason =
        tagToString(relation.extensions?.tags?.deprecated) ??
        tagToString(relation.remoteResource.extensions?.tags?.deprecated);

      const relationDetails: GraphileBuild.PgRelationsPluginRelationDetails = {
        registry: build.input.pgRegistry,
        codec,
        relationName,
      };

      const { singleRecordPlan, listPlan, connectionPlan } = makeRelationPlans(
        localAttributes as string[],
        remoteAttributes as string[],
        remoteResource as PgResource,
        isMutationPayload ?? false,
      );
      const singleRecordFieldName = relation.isReferencee
        ? build.inflection.singleRelationBackwards(relationDetails)
        : build.inflection.singleRelation(relationDetails);
      const connectionFieldName =
        build.inflection.manyRelationConnection(relationDetails);
      const listFieldName = build.inflection.manyRelationList(relationDetails);

      const relationTypeScope = isUnique ? `singularRelation` : `manyRelation`;
      const shouldAddSingleField =
        isUnique &&
        build.behavior.pgCodecRelationMatches(
          relation,
          `${relationTypeScope}:resource:single`,
        );
      const shouldAddConnectionField = build.behavior.pgCodecRelationMatches(
        relation,
        `${relationTypeScope}:resource:connection`,
      );
      const shouldAddListField = build.behavior.pgCodecRelationMatches(
        relation,
        `${relationTypeScope}:resource:list`,
      );

      const digest: Digest = {
        identifier: relationName,
        isReferencee: relation.isReferencee ?? false,
        relationTypeScope,
        shouldAddSingleField,
        shouldAddConnectionField,
        shouldAddListField,
        isUnique,
        typeName,
        connectionTypeName,
        deprecationReason,
        singleRecordPlan,
        listPlan,
        connectionPlan,
        singleRecordFieldName,
        listFieldName,
        connectionFieldName,
        description: relation.description,
        pgResource: remoteResource,
        pgCodec: remoteResource.codec,
        pgRelationDetails: relationDetails,
        relatedTypeName: build.inflection.tableType(codec),
        isNonNull: relation.extensions?.tags?.notNull,
      };
      digests.push(digest);
    }
  }

  // Digest refs
  for (const {
    codec,
    refName: identifier,
    refDefinition: refSpec,
    ref,
  } of refDefinitionList) {
    const isUnique = !!refSpec.singular;
    let hasReferencee;
    let sharedCodec: PgCodec | undefined = undefined;
    let sharedSource: PgResource | undefined = undefined;
    let behavior: string;
    let typeName: string | null | undefined;
    let singleRecordPlan;
    let listPlan;
    let connectionPlan;
    if (ref && resource) {
      const paths = ref.paths.map((path) =>
        resolveResourceRefPath(resource, path),
      );
      if (paths.length === 0) continue;
      const firstSource = paths[0].resource;
      const hasExactlyOneSource = paths.every(
        (p) => p.resource === firstSource,
      );
      const firstCodec = firstSource.codec;
      const hasExactlyOneCodec = paths.every(
        (p) => p.resource.codec === firstCodec,
      );
      hasReferencee = paths.some((p) => p.hasReferencee);

      if (isMutationPayload && (paths.length !== 1 || hasReferencee)) {
        // Don't add backwards relations to mutation payloads
        continue;
      }

      typeName =
        refSpec.graphqlType ??
        (hasExactlyOneCodec ? build.inflection.tableType(firstCodec) : null);
      if (!typeName) {
        continue;
      }
      const type = build.getTypeByName(typeName);
      if (!type) {
        continue;
      }

      if (refSpec.graphqlType) {
        // If this is a union/interface, can we find the associated codec?

        const scope = build.scopeByType.get(type) as
          | GraphileBuild.ScopeObject
          | GraphileBuild.ScopeInterface
          | GraphileBuild.ScopeUnion
          | undefined
          | null;
        if (scope) {
          if ("pgCodec" in scope) {
            sharedCodec = scope.pgCodec;
          }
        }
      } else if (hasExactlyOneCodec) {
        sharedCodec = firstCodec;
      }

      if (hasExactlyOneSource) {
        sharedSource = firstSource;
      }

      // TEST: if there's only one path do we still need union?
      const needsPgUnionAll =
        sharedCodec?.polymorphism?.mode === "union" || paths.length > 1;

      // If we're pulling from a shared codec into a PgUnionAllStep then we can
      // use that codec's attributes as shared attributes; otherwise there are not
      // shared attributes (equivalent to a GraphQL union).
      const unionAttributes: PgUnionAllStepConfigAttributes<any> | undefined =
        sharedCodec?.attributes;

      // const isUnique = paths.every((p) => p.isUnique);

      behavior = hasExactlyOneSource
        ? `${build.behavior.pgResourceBehavior(
            firstSource,
          )} ${build.behavior.pgCodecRefBehavior([codec, identifier], false)}`
        : sharedCodec
        ? `${build.behavior.pgCodecBehavior(
            sharedCodec,
          )} ${build.behavior.pgCodecRefBehavior([codec, identifier], false)}`
        : build.behavior.pgCodecRefBehavior([codec, identifier]);

      // Shortcut simple relation alias
      ({ singleRecordPlan, listPlan, connectionPlan } = (() => {
        // Add forbidden names here

        if (ref.paths.length === 1 && ref.paths[0].length === 1) {
          const relation: PgCodecRelation = resource.getRelation(
            ref.paths[0][0].relationName,
          );
          const remoteResource = relation.remoteResource;
          return makeRelationPlans(
            relation.localAttributes as string[],
            relation.remoteAttributes as string[],
            remoteResource as PgResource,
            isMutationPayload ?? false,
          );
        } else if (!needsPgUnionAll) {
          // Definitely just one chain
          const path = paths[0];
          const makePlanResolver = (
            mode: "singleRecord" | "list" | "connection",
          ) => {
            const single = mode === "singleRecord";
            const isConnection = mode === "connection";
            const idents = new Idents();
            idents.forbid([
              "$list",
              "$in",
              "$record",
              "$entry",
              "$tuple",
              "list",
              "sql",
            ]);

            const functionLines: TE[] = [];
            if (isMutationPayload) {
              functionLines.push(
                te`return function PgRelationsPlugin_mutation_payload_relation($in) {`,
              );
              functionLines.push(te`  const $record = $in.get("result");`);
            } else {
              functionLines.push(
                te`return function PgRelationsPlugin_relation($record) {`,
              );
            }

            const finalLayer = path.layers[path.layers.length - 1];
            const ref_finalLayerResource = te.ref(
              finalLayer.resource,
              finalLayer.resource.name,
            );
            const collectionIdentifier = te.identifier(
              `$` + build.inflection.pluralize(finalLayer.resource.name),
            );
            functionLines.push(
              te`  const ${collectionIdentifier} = ${ref_finalLayerResource}.find();`,
            );
            // NOTE: do we ever need to make the above `DISTINCT ON (primary key)`?
            functionLines.push(
              te`  let previousAlias = ${collectionIdentifier}.alias;`,
            );

            // Process each layer
            for (let i = path.layers.length - 1; i >= 1; i--) {
              const layer = path.layers[i];
              const resource = path.layers[i - 1].resource;
              const { localAttributes, remoteAttributes } = layer;
              const ref_resource = te.ref(resource, resource.name);
              const layerAlias = te.identifier(resource.name + "Alias");
              functionLines.push(
                te`  const ${layerAlias} = ${ref_sql}.identifier(Symbol(${te.lit(
                  resource.name,
                )}));`,
              );
              functionLines.push(
                te`  ${collectionIdentifier}.join({
    type: "inner",
    from: ${ref_resource}.from,
    alias: ${layerAlias},
    conditions: [
      ${te.join(
        remoteAttributes.map((remoteAttrName, i) => {
          return te`${ref_sql}\`\${previousAlias}.\${${ref_sql}.identifier(${te.lit(
            remoteAttrName,
          )})} = \${${layerAlias}}.\${${ref_sql}.identifier(${te.lit(
            localAttributes[i],
          )})}\``;
        }),
        ",\n      ",
      )}
    ]
  });`,
              );
              functionLines.push(te`  previousAlias = ${layerAlias};`);
            }

            // Now apply `$record`
            {
              const firstLayer = path.layers[0];
              const { localAttributes, remoteAttributes } = firstLayer;
              remoteAttributes.forEach((remoteAttrName, i) => {
                functionLines.push(
                  te`  ${collectionIdentifier}.where(${ref_sql}\`\${previousAlias}.\${${ref_sql}.identifier(${te.lit(
                    remoteAttrName,
                  )})} = \${${collectionIdentifier}.placeholder($record.get(${te.lit(
                    localAttributes[i],
                  )}))}\`);`,
                );
              });
            }

            if (single) {
              functionLines.push(
                te`  return ${collectionIdentifier}.single();`,
              );
            } else if (isConnection) {
              functionLines.push(
                te`  return ${ref_connection}(${collectionIdentifier});`,
              );
            } else {
              functionLines.push(te`  return ${collectionIdentifier};`);
            }

            functionLines.push(te.cache`}`);
            return te.runExportable`${te.join(functionLines, "\n")}`;
          };
          const singleRecordPlan = makePlanResolver("singleRecord");
          const listPlan = makePlanResolver("list");
          const connectionPlan = makePlanResolver("connection");
          return { singleRecordPlan, listPlan, connectionPlan };
        } else {
          // Needs pgUnionAll
          const makePlanResolver = (
            mode: "singleRecord" | "list" | "connection",
          ) => {
            const single = mode === "singleRecord";
            const isConnection = mode === "connection";
            const attributes: PgUnionAllStepConfigAttributes<string> =
              unionAttributes ?? {};
            const resourceByTypeName: Record<string, PgResource> =
              Object.create(null);
            const members: PgUnionAllStepMember<string>[] = [];
            for (const path of paths) {
              const [firstLayer, ...rest] = path.layers;
              const memberPath: PgCodecRefPath = [];
              let finalResource = firstLayer.resource;
              for (const layer of rest) {
                const { relationName } = layer;
                memberPath!.push({ relationName });
                finalResource = layer.resource;
              }
              const typeName = build.inflection.tableType(finalResource.codec);
              const member: PgUnionAllStepMember<string> = {
                resource: firstLayer.resource,
                typeName,
                path: memberPath,
              };
              members.push(member);
              if (!resourceByTypeName[typeName]) {
                resourceByTypeName[typeName] = finalResource;
              }
            }
            return EXPORTABLE(
              (
                attributes,
                connection,
                identifier,
                isConnection,
                isMutationPayload,
                members,
                paths,
                pgUnionAll,
                resourceByTypeName,
                single,
              ) =>
                ($parent: ExecutableStep) => {
                  const $record = isMutationPayload
                    ? (
                        $parent as ObjectStep<{ result: PgSelectSingleStep }>
                      ).get("result")
                    : ($parent as PgSelectSingleStep);
                  for (let i = 0, l = paths.length; i < l; i++) {
                    const path = paths[i];
                    const firstLayer = path.layers[0];
                    const member = members[i];
                    member.match = firstLayer.localAttributes.reduce(
                      (memo, col, idx) => {
                        memo[firstLayer.remoteAttributes[idx]] = {
                          step: $record.get(col),
                        };
                        return memo;
                      },
                      Object.create(null),
                    );
                  }
                  const $list = pgUnionAll({
                    attributes,
                    resourceByTypeName,
                    members,
                    name: identifier,
                  });
                  if (isConnection) {
                    return connection($list);
                  } else if (single) {
                    return $list.single();
                  } else {
                    return $list;
                  }
                },
              [
                attributes,
                connection,
                identifier,
                isConnection,
                isMutationPayload,
                members,
                paths,
                pgUnionAll,
                resourceByTypeName,
                single,
              ],
            );
          };
          const singleRecordPlan = makePlanResolver("singleRecord");
          const listPlan = makePlanResolver("list");
          const connectionPlan = makePlanResolver("connection");
          return {
            singleRecordPlan,
            listPlan,
            connectionPlan,
          };
        }
      })());
    } else {
      hasReferencee = true;
      behavior = build.behavior.pgRefDefinitionBehavior(refSpec);
      typeName = refSpec.graphqlType;
      if (!typeName) {
        // ENHANCE: remove this restriction
        throw new Error(`@ref on polymorphic type must declare to:TargetType`);
      }
      const type = build.getTypeByName(typeName);
      if (!type) {
        continue;
      }

      if (refSpec.graphqlType) {
        // If this is a union/interface, can we find the associated codec?

        const scope = build.scopeByType.get(type) as
          | GraphileBuild.ScopeObject
          | GraphileBuild.ScopeInterface
          | GraphileBuild.ScopeUnion
          | undefined
          | null;
        if (scope) {
          if ("pgCodec" in scope) {
            sharedCodec = scope.pgCodec;
          }
        }
      }
    }

    const connectionTypeName = sharedCodec
      ? build.inflection.tableConnectionType(sharedCodec)
      : build.inflection.connectionType(typeName);

    const singleRecordFieldName = build.inflection.refSingle({
      refDefinition: refSpec,
      identifier,
    });
    const connectionFieldName = build.inflection.refConnection({
      refDefinition: refSpec,
      identifier,
    });
    const listFieldName = build.inflection.refList({
      refDefinition: refSpec,
      identifier,
    });

    if (!hasReferencee && !refSpec.singular) {
      console.warn(
        `Ignoring non-singular '@ref' with no "referencee" - this probably means you forgot to add 'singular' to your '@ref' spec even though it looks like a "belongs to" relationship. [type: ${
          Self.name
        }, codec: ${codec.name}, ref: ${identifier}${
          codec.extensions?.pg
            ? `, pg: ${codec.extensions?.pg?.serviceName}/${codec.extensions?.pg?.schemaName}.${codec.extensions?.pg?.name}`
            : ``
        }]`,
      );
    }

    const relationTypeScope = isUnique ? `singularRelation` : `manyRelation`;
    const shouldAddSingleField =
      isUnique &&
      build.behavior.stringMatches(
        behavior,
        `${relationTypeScope}:resource:single`,
      );
    const shouldAddConnectionField = build.behavior.stringMatches(
      behavior,
      `${relationTypeScope}:resource:connection`,
    );
    const shouldAddListField = build.behavior.stringMatches(
      behavior,
      `${relationTypeScope}:resource:list`,
    );

    const pgRefDetails: GraphileBuild.PgRelationsPluginRefDetails | undefined =
      ref
        ? {
            registry: build.input.pgRegistry,
            codec,
            ref: ref,
          }
        : undefined;

    const digest: Digest = {
      identifier,
      isReferencee: hasReferencee,
      pgCodec: sharedCodec,
      pgResource: sharedSource,
      isUnique,
      relationTypeScope,
      shouldAddSingleField,
      shouldAddConnectionField,
      shouldAddListField,
      typeName,
      connectionTypeName,
      singleRecordFieldName,
      connectionFieldName,
      listFieldName,
      singleRecordPlan,
      listPlan,
      connectionPlan,
      pgRefDetails,
      relatedTypeName: context.Self.name,
      isNonNull: ref?.extensions?.tags.notNull,
    };
    digests.push(digest);
  }

  return digests.reduce((memo, digest) => {
    const {
      isUnique,
      relationTypeScope,
      shouldAddSingleField,
      shouldAddConnectionField,
      shouldAddListField,
      typeName,
      connectionTypeName,
      deprecationReason,
      singleRecordFieldName,
      listFieldName,
      connectionFieldName,
      singleRecordPlan,
      listPlan,
      connectionPlan,
      isReferencee,
      identifier,
      description,
      pgResource: pgFieldResource,
      pgCodec: pgFieldCodec,
      pgRelationDetails,
      pgRefDetails,
      relatedTypeName,
    } = digest;
    const OtherType = build.getTypeByName(typeName);
    if (
      !OtherType ||
      !(
        OtherType instanceof GraphQLObjectType ||
        OtherType instanceof GraphQLInterfaceType ||
        OtherType instanceof GraphQLUnionType
      )
    ) {
      return memo;
    }
    let fields = memo;

    if (isUnique && shouldAddSingleField) {
      const fieldName = singleRecordFieldName;
      fields = extend(
        fields,
        {
          [fieldName]: fieldWithHooks(
            {
              fieldName,
              fieldBehaviorScope: `${relationTypeScope}:resource:single`,
              isPgSingleRelationField: true,
              pgRelationDetails,
              pgRefDetails,
            },
            {
              description:
                description ??
                `Reads a single \`${typeName}\` that is related to this \`${relatedTypeName}\`.`,
              // Defaults to nullable due to RLS
              type: build.nullableIf(!digest.isNonNull, OtherType),
              plan: singleRecordPlan,
              deprecationReason,
            },
          ),
        },
        `Adding field to GraphQL type '${Self.name}' for singular relation '${identifier}'`,
        "recoverable",
      );
    }

    if (isReferencee && shouldAddConnectionField) {
      const ConnectionType = build.getTypeByName(connectionTypeName);
      if (ConnectionType) {
        const fieldName = connectionFieldName;
        fields = extend(
          fields,
          {
            [fieldName]: fieldWithHooks(
              {
                fieldName,
                fieldBehaviorScope: `${relationTypeScope}:resource:connection`,
                pgFieldResource: pgFieldResource,
                pgFieldCodec,
                isPgFieldConnection: true,
                isPgManyRelationConnectionField: true,
                pgRelationDetails,
                pgRefDetails,
              },
              {
                description:
                  description ??
                  `Reads and enables pagination through a set of \`${typeName}\`.`,
                type: new GraphQLNonNull(ConnectionType as GraphQLObjectType),
                plan: connectionPlan,
                deprecationReason,
              },
            ),
          },
          `Adding '${identifier}' many relation connection field to ${Self.name}`,
          "recoverable",
        );
      } else {
        console.log(`Could not find connection type '${connectionTypeName}'`);
      }
    }

    if (isReferencee && shouldAddListField) {
      const fieldName = listFieldName;
      fields = extend(
        fields,
        {
          [fieldName]: fieldWithHooks(
            {
              fieldName,
              fieldBehaviorScope: `${relationTypeScope}:resource:list`,
              pgFieldResource: pgFieldResource,
              pgFieldCodec,
              isPgFieldSimpleCollection: true,
              isPgManyRelationListField: true,
              pgRelationDetails,
              pgRefDetails,
            },
            {
              description:
                description ??
                `Reads and enables pagination through a set of \`${typeName}\`.`,
              type: new GraphQLNonNull(
                new GraphQLList(new GraphQLNonNull(OtherType)),
              ),
              plan: listPlan,
              deprecationReason,
            },
          ),
        },
        `Adding '${identifier}' many relation list field to ${Self.name}`,
        "recoverable",
      );
    }

    return fields;
  }, fields);
}

function combineBehaviors(
  a: string | string[],
  b: string | string[],
): string[] {
  const aArr = Array.isArray(a) ? a : a ? [a] : [];
  const bArr = Array.isArray(b) ? b : b ? [b] : [];
  return [...aArr, ...bArr];
}
