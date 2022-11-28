import "graphile-build";
import "./PgTablesPlugin.js";
import "graphile-config";

import type {
  PgRefDefinition,
  PgSelectSingleStep,
  PgSource,
  PgSourceRef,
  PgSourceRefPath,
  PgSourceRelation,
  PgTypeCodec,
  PgUnionAllStepConfigAttributes,
  PgUnionAllStepMember,
} from "@dataplan/pg";
import { PgSourceBuilder, pgUnionAll } from "@dataplan/pg";
import type { ExecutableStep, ObjectStep } from "grafast";
import {
  arraysMatch,
  connection,
  evalSafeProperty,
  isSafeObjectPropertyName,
  list,
  object,
} from "grafast";
import type { PluginHook } from "graphile-config";
import { EXPORTABLE } from "graphile-export";
import type { GraphQLFieldConfigMap, GraphQLObjectType } from "graphql";
import type { PgAttribute, PgClass, PgConstraint } from "pg-introspection";
import sql from "pg-sql2";

import { getBehavior } from "../behavior.js";
import { version } from "../index.js";
import { Idents, tagToString } from "../utils.js";

declare global {
  namespace GraphileBuild {
    interface PgRelationsPluginRelationDetails {
      source: PgSource<any, any, any, any>;
      relationName: string;
    }

    interface ScopeObjectFieldsField {
      isPgSingleRelationField?: boolean;
      isPgManyRelationConnectionField?: boolean;
      isPgManyRelationListField?: boolean;
      pgRelationDetails?: PgRelationsPluginRelationDetails;
      behavior?: string;
    }
    interface Inflection {
      sourceRelationName(
        this: Inflection,
        details: {
          databaseName: string;
          pgConstraint: PgConstraint;
          localClass: PgClass;
          localColumns: PgAttribute[];
          foreignClass: PgClass;
          foreignColumns: PgAttribute[];
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
}

declare module "@dataplan/pg" {
  interface PgSourceRelationExtensions {
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

declare global {
  namespace GraphileConfig {
    interface GatherHelpers {
      pgRelations: {
        addRelation(
          event: {
            pgClass: PgClass;
            databaseName: string;
            relations: GraphileConfig.PgTablesPluginSourceRelations;
          },
          pgConstraint: PgConstraint,
          isReferencee?: boolean,
        ): Promise<void>;
      };
    }
    interface GatherHooks {
      pgRelations_relation: PluginHook<
        (event: {
          databaseName: string;
          pgClass: PgClass;
          pgConstraint: PgConstraint;
          relation: PgSourceRelation<any, any>;
        }) => Promise<void> | void
      >;
    }
  }
}

interface State {}
interface Cache {}

// TODO: split this into one plugin for gathering and another for schema
export const PgRelationsPlugin: GraphileConfig.Plugin = {
  name: "PgRelationsPlugin",
  description:
    "Creates relationships between the @dataplan/pg data sources, and mirrors these relationships into the GraphQL schema",
  version,
  after: ["smart-tags", "PgFakeConstraintsPlugin", "PgTablesPlugin"],

  inflection: {
    add: {
      sourceRelationName(
        options,
        {
          databaseName,
          pgConstraint,
          localClass: _localClass,
          localColumns,
          foreignClass,
          foreignColumns,
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
        const remoteName = this.tableSourceName({
          databaseName,
          pgClass: foreignClass,
        });
        const columns = !isReferencee
          ? // We have a column referencing another table
            localColumns
          : // The other table has a constraint that references us; this is the backwards relation.
            foreignColumns;
        const columnNames = columns.map((col) => col.attname);
        return this.camelCase(
          `${isUnique ? remoteName : this.pluralize(remoteName)}-by-${
            isReferencee ? "their" : "my"
          }-${columnNames.join("-and-")}`,
        );
      },

      singleRelation(options, details) {
        const { source, relationName } = details;
        const relation: PgSourceRelation<any, any> =
          source.getRelation(relationName);
        const codec = relation.source.codec;
        if (typeof relation.extensions?.tags.fieldName === "string") {
          return relation.extensions.tags.fieldName;
        }
        // E.g. posts(author_id) references users(id)
        const remoteType = this.tableType(relation.source.codec);
        const localColumns = relation.localColumns as string[];
        return this.camelCase(
          `${remoteType}-by-${this._joinColumnNames(codec, localColumns)}`,
        );
      },
      singleRelationBackwards(options, details) {
        const { source, relationName } = details;
        const relation: PgSourceRelation<any, any> =
          source.getRelation(relationName);
        if (
          typeof relation.extensions?.tags.foreignSingleFieldName === "string"
        ) {
          return relation.extensions.tags.foreignSingleFieldName;
        }
        if (typeof relation.extensions?.tags.foreignFieldName === "string") {
          return relation.extensions.tags.foreignFieldName;
        }
        // E.g. posts(author_id) references users(id)
        const remoteType = this.tableType(relation.source.codec);
        const remoteColumns = relation.remoteColumns as string[];
        return this.camelCase(
          `${remoteType}-by-${this._joinColumnNames(
            relation.source.codec,
            remoteColumns,
          )}`,
        );
      },
      _manyRelation(options, details) {
        const { source, relationName } = details;
        const relation: PgSourceRelation<any, any> =
          source.getRelation(relationName);
        // E.g. users(id) references posts(author_id)
        const remoteType = this.tableType(relation.source.codec);
        const remoteColumns = relation.remoteColumns as string[];
        return this.camelCase(
          `${this.pluralize(remoteType)}-by-${this._joinColumnNames(
            relation.source.codec,
            remoteColumns,
          )}`,
        );
      },
      manyRelationConnection(options, details) {
        const { source, relationName } = details;
        const relation: PgSourceRelation<any, any> =
          source.getRelation(relationName);
        const baseOverride = relation.extensions?.tags.foreignFieldName;
        if (typeof baseOverride === "string") {
          return this.connectionField(this.camelCase(baseOverride));
        }
        return this.connectionField(this._manyRelation(details));
      },
      manyRelationList(options, details) {
        const { source, relationName } = details;
        const relation: PgSourceRelation<any, any> =
          source.getRelation(relationName);
        const override = relation.extensions?.tags.foreignSimpleFieldName;
        if (typeof override === "string") {
          return this.camelCase(override);
        }
        const baseOverride = relation.extensions?.tags.foreignFieldName;
        if (typeof baseOverride === "string") {
          return this.listField(this.camelCase(baseOverride));
        }
        return this.listField(this._manyRelation(details));
      },
    },
  },

  gather: <GraphileConfig.PluginGatherConfig<"pgRelations", State, Cache>>{
    namespace: "pgRelations",
    initialState: (): State => ({}),
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
        const localColumnNumbers = isReferencee
          ? pgConstraint.confkey!
          : pgConstraint.conkey!;
        const foreignColumnNumbers = isReferencee
          ? pgConstraint.conkey!
          : pgConstraint.confkey!;
        const isUnique = !isReferencee
          ? true
          : (() => {
              // This relationship is unique if the REFERENCED table (not us!)
              // has a unique constraint on the remoteColumns the relationship
              // specifies (or a subset thereof).
              const foreignUniqueColumnOnlyConstraints = foreignClass
                .getConstraints()!
                .filter(
                  (c) =>
                    ["u", "p"].includes(c.contype) &&
                    c.conkey?.every((k) => k > 0),
                );
              const foreignUniqueColumnNumberCombinations =
                foreignUniqueColumnOnlyConstraints.map((c) => c.conkey!);
              const isUnique = foreignUniqueColumnNumberCombinations.some(
                (foreignUniqueColumnNumbers) => {
                  return foreignUniqueColumnNumbers.every(
                    (n) => n > 0 && pgConstraint.conkey!.includes(n),
                  );
                },
              );
              return isUnique;
            })();
        const { databaseName, relations } = event;
        const localColumns = await Promise.all(
          localColumnNumbers.map((key) =>
            info.helpers.pgIntrospection.getAttribute(
              databaseName,
              pgClass._id,
              key,
            ),
          ),
        );
        const foreignColumns = await Promise.all(
          foreignColumnNumbers.map((key) =>
            info.helpers.pgIntrospection.getAttribute(
              databaseName,
              foreignClass!._id,
              key,
            ),
          ),
        );
        const foreignSource = await info.helpers.pgTables.getSourceBuilder(
          databaseName,
          foreignClass,
        );
        if (!foreignSource || foreignSource.isVirtual) {
          return;
        }
        const relationName = info.inflection.sourceRelationName({
          databaseName,
          pgConstraint,
          localClass: pgClass,
          localColumns: localColumns as PgAttribute[],
          foreignClass,
          foreignColumns: foreignColumns as PgAttribute[],
          isUnique,
          isReferencee,
        });
        const existingRelation = relations[relationName];
        const { tags } = pgConstraint.getTagsAndDescription();
        const description = isReferencee
          ? tags.backwardDescription
          : tags.forwardDescription;
        const newRelation: PgSourceRelation<any, any> = {
          localColumns: localColumns.map((c) => c!.attname),
          remoteColumns: foreignColumns.map((c) => c!.attname),
          source: foreignSource,
          isUnique,
          isReferencee,
          description:
            typeof description === "string" ? description : undefined,
          extensions: {
            tags,
          },
        };
        await info.process("pgRelations_relation", {
          databaseName,
          pgClass,
          pgConstraint,
          relation: newRelation,
        });
        if (existingRelation) {
          const isEquivalent =
            existingRelation.isUnique === newRelation.isUnique &&
            existingRelation.isReferencee === newRelation.isReferencee &&
            arraysMatch(
              existingRelation.localColumns,
              newRelation.localColumns,
            ) &&
            arraysMatch(
              existingRelation.remoteColumns,
              newRelation.remoteColumns,
            ) &&
            existingRelation.source === newRelation.source;
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
        relations[relationName] = newRelation;
      },
    },
    hooks: {
      async pgTables_PgSourceBuilder_relations(info, event) {
        const { pgClass, databaseName } = event;
        const constraints =
          await info.helpers.pgIntrospection.getConstraintsForClass(
            databaseName,
            pgClass._id,
          );

        const foreignConstraints =
          await info.helpers.pgIntrospection.getForeignConstraintsForClass(
            databaseName,
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
  },

  schema: {
    hooks: {
      GraphQLInterfaceType_fields: addRelations,
      GraphQLObjectType_fields: addRelations,
    },
  },
};

function makeSpecString(
  identifier: string,
  localColumns: readonly string[],
  remoteColumns: readonly string[],
) {
  return `{ ${remoteColumns
    .map(
      (remoteColumnName, i) =>
        `${evalSafeProperty(
          remoteColumnName as string,
        )}: ${identifier}.get(${JSON.stringify(localColumns[i])})`,
    )
    .join(", ")} }`;
}

function makeRelationPlans(
  localColumns: readonly string[],
  remoteColumns: readonly string[],
  otherSource: PgSource<any, any, any, any>,
  isMutationPayload: boolean,
) {
  const recordOrResult = isMutationPayload
    ? `$record.get("result")`
    : `$record`;
  const clean =
    remoteColumns.every(
      (remoteColumnName) =>
        typeof remoteColumnName === "string" &&
        isSafeObjectPropertyName(remoteColumnName),
    ) &&
    localColumns.every(
      (localColumnName) =>
        typeof localColumnName === "string" &&
        isSafeObjectPropertyName(localColumnName),
    );

  const specString = makeSpecString(
    recordOrResult,
    localColumns,
    remoteColumns,
  );

  const specFromRecord = EXPORTABLE(
    (localColumns, remoteColumns) =>
      ($record: PgSelectSingleStep<any, any, any, any>) => {
        return remoteColumns.reduce((memo, remoteColumnName, i) => {
          memo[remoteColumnName] = $record.get(localColumns[i] as string);
          return memo;
        }, Object.create(null));
      },
    [localColumns, remoteColumns],
  );
  type MutationPayload = ObjectStep<{
    result: PgSelectSingleStep<any, any, any, any>;
  }>;

  const singleRecordPlan = clean
    ? // Optimise function for both execution and export.
      // eslint-disable-next-line graphile-export/exhaustive-deps
      (EXPORTABLE(
        new Function(
          "otherSource",
          `return $record => otherSource.get(${specString})`,
        ) as any,
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
          function plan($record: PgSelectSingleStep<any, any, any, any>) {
            return otherSource.get(specFromRecord($record));
          },
        [otherSource, specFromRecord],
      );

  const listPlan = clean
    ? // eslint-disable-next-line graphile-export/exhaustive-deps
      (EXPORTABLE(
        new Function(
          "otherSource",
          `return $record => otherSource.find(${specString})`,
        ) as any,
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
          function plan($record: PgSelectSingleStep<any, any, any, any>) {
            return otherSource.find(specFromRecord($record));
          },
        [otherSource, specFromRecord],
      );

  const connectionPlan = clean
    ? // eslint-disable-next-line graphile-export/exhaustive-deps
      (EXPORTABLE(
        new Function(
          "otherSource",
          "connection",
          `return $record => {
  const $records = otherSource.find(${specString});
  return connection($records);
}`,
        ) as any,
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
          function plan($record: PgSelectSingleStep<any, any, any, any>) {
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
    options: { simpleCollections },
  } = build;
  const { Self, scope, fieldWithHooks } = context;

  // const objectMode = context.type === "GraphQLObjectType";

  const { pgCodec } = scope;
  const isPgTableType =
    "isPgTableType" in scope ? scope.isPgTableType : undefined;
  const pgTypeSource = "pgTypeSource" in scope ? scope.pgTypeSource : undefined;
  const isMutationPayload =
    "isMutationPayload" in scope ? scope.isMutationPayload : undefined;
  const pgPolymorphism =
    "pgPolymorphism" in scope ? scope.pgPolymorphism : undefined;

  const codec = pgTypeSource?.codec ?? pgCodec;
  // TODO: make it so isMutationPayload doesn't trigger this by default (only in V4 compatibility mode)
  if (!(isPgTableType || isMutationPayload || pgPolymorphism) || !codec) {
    return fields;
  }
  // TODO: change the default so that we don't do this on
  // isMutationPayload; only do that for V4 compat. (It's redundant vs
  // just using the object type directly)
  const source =
    pgTypeSource ??
    build.input.pgSources.find((s) => s.codec === codec && !s.parameters) ??
    build.input.pgSources.find((s) => s.codec === codec && s.isUnique);
  if (!source && !codec.extensions?.refDefinitions) {
    return fields;
  }
  if (source && source.parameters && !source.isUnique) {
    return fields;
  }
  const relations: {
    [identifier: string]: PgSourceRelation<any, any>;
  } = source?.getRelations();

  // Don't use refs on mutation payloads
  const refDefinitionList: Array<{
    refName: string;
    refDefinition: PgRefDefinition;
    ref?: PgSourceRef;
    codec?: PgTypeCodec<any, any, any, any>;
  }> = isMutationPayload
    ? []
    : source
    ? Object.entries(source.refs).map(([refName, spec]) => ({
        refName,
        refDefinition: spec.definition,
        ref: spec,
      }))
    : Object.entries(codec.extensions?.refDefinitions ?? {}).map(
        ([refName, refDefinition]) => ({
          refName,
          refDefinition,
          codec,
        }),
      );

  type Layer = {
    relationName: string;
    localColumns: string[];
    source: PgSource<any, any, any, any>;
    remoteColumns: string[];
    isUnique: boolean;
  };

  const resolvePath = (path: PgSourceRefPath) => {
    if (!source) {
      throw new Error(`Cannot call resolvePath unless there's a source`);
    }
    const result = {
      source: source,
      hasReferencee: false,
      isUnique: true,
      layers: [] as Layer[],
    };
    for (const pathEntry of path) {
      const relation: PgSourceRelation<any, any> = result.source.getRelation(
        pathEntry.relationName,
      );
      const {
        isReferencee,
        localColumns,
        remoteColumns,
        source: sourceOrBuilder,
        isUnique,
      } = relation;
      const source =
        sourceOrBuilder instanceof PgSourceBuilder
          ? sourceOrBuilder.get()
          : sourceOrBuilder;
      if (isReferencee) {
        result.hasReferencee = true;
      }
      if (!isUnique) {
        result.isUnique = false;
      }
      result.layers.push({
        relationName: pathEntry.relationName,
        localColumns: localColumns as string[],
        remoteColumns: remoteColumns as string[],
        source,
        isUnique,
      });
      result.source =
        relation.source instanceof PgSourceBuilder
          ? relation.source.get()
          : relation.source;
    }
    return result;
  };

  type Digest = {
    identifier: string;
    isReferencee: boolean;
    isUnique: boolean;
    behavior: string;
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
    pgSource?: PgSource<any, any, any, any>;
    pgCodec: PgTypeCodec<any, any, any, any> | undefined;
    pgRelationDetails?: GraphileBuild.PgRelationsPluginRelationDetails;
    relatedTypeName: string;
  };

  const digests: Digest[] = [];

  if (source) {
    // Digest relations
    for (const [relationName, relation] of Object.entries(relations)) {
      const {
        localColumns,
        remoteColumns,
        source: otherSourceOrBuilder,
        extensions,
        isReferencee,
      } = relation;
      if (isMutationPayload && isReferencee) {
        // Don't add backwards relations to mutation payloads
        continue;
      }
      const otherSource =
        otherSourceOrBuilder instanceof PgSourceBuilder
          ? otherSourceOrBuilder.get()
          : otherSourceOrBuilder;
      // The behavior is the relation behavior PLUS the remote table
      // behavior. But the relation settings win.
      const behavior =
        getBehavior(otherSource.extensions) + " " + getBehavior(extensions);
      const otherCodec = otherSource.codec;
      const typeName = build.inflection.tableType(otherCodec);
      const connectionTypeName =
        build.inflection.tableConnectionType(otherCodec);

      const deprecationReason =
        tagToString(relation.extensions?.tags?.deprecated) ??
        tagToString(relation.source.extensions?.tags?.deprecated);

      const relationDetails: GraphileBuild.PgRelationsPluginRelationDetails = {
        source,
        relationName,
      };

      const { singleRecordPlan, listPlan, connectionPlan } = makeRelationPlans(
        localColumns as string[],
        remoteColumns as string[],
        otherSource,
        isMutationPayload ?? false,
      );
      const singleRecordFieldName = relation.isReferencee
        ? build.inflection.singleRelationBackwards(relationDetails)
        : build.inflection.singleRelation(relationDetails);
      const connectionFieldName =
        build.inflection.manyRelationConnection(relationDetails);
      const listFieldName = build.inflection.manyRelationList(relationDetails);
      const digest: Digest = {
        identifier: relationName,
        isReferencee: relation.isReferencee ?? false,
        behavior,
        isUnique: relation.isUnique,
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
        pgSource: otherSource,
        pgCodec: otherSource.codec,
        pgRelationDetails: relationDetails,
        relatedTypeName: build.inflection.tableType(codec),
      };
      digests.push(digest);
    }
  }

  // Digest refs
  for (const {
    refName: identifier,
    refDefinition: refSpec,
    ref,
  } of refDefinitionList) {
    let hasReferencee;
    let sharedCodec: PgTypeCodec<any, any, any, any> | undefined = undefined;
    let sharedSource: PgSource<any, any, any, any> | undefined = undefined;
    let behavior;
    let typeName;
    let singleRecordPlan;
    let listPlan;
    let connectionPlan;
    if (ref && source) {
      const paths = ref.paths.map(resolvePath);
      if (paths.length === 0) continue;
      const firstSource = paths[0].source;
      const hasExactlyOneSource = paths.every((p) => p.source === firstSource);
      const firstCodec = firstSource.codec;
      const hasExactlyOneCodec = paths.every(
        (p) => p.source.codec === firstCodec,
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

      // TODO: if there's only one path do we still need union?
      const needsPgUnionAll =
        sharedCodec?.polymorphism?.mode === "union" || paths.length > 1;

      // If we're pulling from a shared codec into a PgUnionAllStep then we can
      // use that codec's columns as shared attributes; otherwise there are not
      // shared attributes (equivalent to a GraphQL union).
      const unionAttributes: PgUnionAllStepConfigAttributes<any> | undefined =
        sharedCodec?.columns;

      // const isUnique = paths.every((p) => p.isUnique);

      // TODO: shouldn't the ref behavior override the source behavior?
      behavior =
        (hasExactlyOneSource ? getBehavior(firstSource.extensions) + " " : "") +
        getBehavior(refSpec.extensions);

      // Shortcut simple relation alias
      ({ singleRecordPlan, listPlan, connectionPlan } = (() => {
        // Add forbidden names here

        if (ref.paths.length === 1 && ref.paths[0].length === 1) {
          const relation: PgSourceRelation<any, any> = source.getRelation(
            ref.paths[0][0].relationName,
          );
          const otherSource =
            relation.source instanceof PgSourceBuilder
              ? relation.source.get()
              : relation.source;
          return makeRelationPlans(
            relation.localColumns as string[],
            relation.remoteColumns as string[],
            otherSource,
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
            try {
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

              const functionLines: string[] = [];
              if (isMutationPayload) {
                functionLines.push(`return ($in) => {`);
                functionLines.push(`  const $record = $in.get("result");`);
              } else {
                functionLines.push(`return ($record) => {`);
              }

              let previousIdentifier = "$record";
              const argNames: string[] = [
                "list",
                "object",
                "connection",
                "sql",
              ];
              const argValues: any[] = [list, object, connection, sql];
              let isStillSingular = true;
              for (let i = 0, l = path.layers.length; i < l; i++) {
                const layer = path.layers[i];
                const { localColumns, remoteColumns, source, isUnique } = layer;
                if (
                  !(
                    localColumns.every(isSafeObjectPropertyName) &&
                    remoteColumns.every(isSafeObjectPropertyName)
                  )
                ) {
                  throw new Error(
                    "Unsafe identifier found, falling back to slow mode",
                  );
                }
                const sourceName = idents.makeSafeIdentifier(
                  `${source.name}Source`,
                );
                argNames.push(sourceName);
                argValues.push(source);
                if (isStillSingular) {
                  if (!isUnique) {
                    isStillSingular = false;
                  }
                  const newIdentifier = idents.makeSafeIdentifier(
                    `$${
                      isUnique
                        ? build.inflection.singularize(source.name)
                        : build.inflection.pluralize(source.name)
                    }`,
                  );
                  const specString = makeSpecString(
                    previousIdentifier,
                    localColumns,
                    remoteColumns,
                  );
                  functionLines.push(
                    `  const ${newIdentifier} = ${sourceName}.${
                      isUnique ? "get" : "find"
                    }(${specString});`,
                  );
                  previousIdentifier = newIdentifier;
                } else {
                  const newIdentifier = idents.makeSafeIdentifier(
                    `$${build.inflection.pluralize(source.name)}`,
                  );
                  /*
            const tupleIdentifier = makeSafeIdentifier(
              `${previousIdentifier}Tuples`,
            );
            functionLines.push(
              `  const ${tupleIdentifier} = each(${previousIdentifier}, ($entry) => object({ ${localColumns
                .map(
                  (c) =>
                    `${evalSafeProperty(c)}: $entry.get(${JSON.stringify(c)})`,
                )
                .join(", ")} }));`,
            );
            functionLines.push(`  ${newIdentifier}.where(sql\`\${}\`);`);
            */
                  const specString = makeSpecString(
                    "$entry",
                    localColumns,
                    remoteColumns,
                  );
                  functionLines.push(
                    `  const ${newIdentifier} = each(${previousIdentifier}, ($entry) => ${sourceName}.get(${specString}));`,
                  );
                  previousIdentifier = newIdentifier;
                }
              }

              if (isStillSingular && !single) {
                functionLines.push(
                  `  const $list = list([${previousIdentifier}]);`,
                );
                previousIdentifier = "$list";
              }

              if (isConnection) {
                functionLines.push(
                  `  return connection(${previousIdentifier});`,
                );
              } else {
                functionLines.push(`  return ${previousIdentifier};`);
              }
              functionLines.push(`}`);
              const functionBody = functionLines.join("\n");
              return new Function(...argNames, functionBody)(...argValues);
            } catch (e) {
              console.error(e);
              // TODO: fallback if unsafe
              throw new Error(
                "GraphileInternalError<94fe5fe8-74a4-418b-93ea-beac09b64b5d>: TODO: implement slow mode when identifiers are not JSON-to-JS-safe (or expand the definition of JSON-to-JS safe)",
              );
            }
          };
          const singleRecordPlan = makePlanResolver("singleRecord");
          const listPlan = makePlanResolver("list");
          const connectionPlan = makePlanResolver("connection");
          return { singleRecordPlan, listPlan, connectionPlan };
        } else {
          const makePlanResolver = (
            mode: "singleRecord" | "list" | "connection",
          ) => {
            const single = mode === "singleRecord";
            const isConnection = mode === "connection";
            const attributes: PgUnionAllStepConfigAttributes<string> =
              unionAttributes ?? {};
            const sourceByTypeName: {
              [typeName: string]: PgSource<any, any, any, any>;
            } = Object.create(null);
            const members: PgUnionAllStepMember<string>[] = [];
            for (const path of paths) {
              const [firstLayer, ...rest] = path.layers;
              const memberPath: PgSourceRefPath = [];
              let finalSource = firstLayer.source;
              for (const layer of rest) {
                const { relationName } = layer;
                memberPath!.push({ relationName });
                finalSource = layer.source;
              }
              const typeName = build.inflection.tableType(finalSource.codec);
              const member: PgUnionAllStepMember<string> = {
                source: firstLayer.source,
                typeName,
                path: memberPath,
              };
              members.push(member);
              if (!sourceByTypeName[typeName]) {
                sourceByTypeName[typeName] = finalSource;
              }
            }
            return EXPORTABLE(
              (
                  attributes,
                  connection,
                  isConnection,
                  isMutationPayload,
                  members,
                  paths,
                  pgUnionAll,
                  single,
                  sourceByTypeName,
                ) =>
                ($parent: ExecutableStep<any>) => {
                  const $record = isMutationPayload
                    ? (
                        $parent as ObjectStep<{
                          result: PgSelectSingleStep<any, any, any, any>;
                        }>
                      ).get("result")
                    : ($parent as PgSelectSingleStep<any, any, any, any>);
                  for (let i = 0, l = paths.length; i < l; i++) {
                    const path = paths[i];
                    const firstLayer = path.layers[0];
                    const member = members[i];
                    member.match = firstLayer.localColumns.reduce(
                      (memo, col, idx) => {
                        memo[firstLayer.remoteColumns[idx]] = {
                          step: $record.get(col),
                        };
                        return memo;
                      },
                      Object.create(null),
                    );
                  }
                  const $list = pgUnionAll({
                    attributes,
                    sourceByTypeName,
                    members,
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
                isConnection,
                isMutationPayload,
                members,
                paths,
                pgUnionAll,
                single,
                sourceByTypeName,
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
      behavior = getBehavior(refSpec.extensions);
      typeName = refSpec.graphqlType;
      if (!typeName) {
        // TODO: remove this restriction
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

    const digest: Digest = {
      identifier,
      isReferencee: hasReferencee,
      pgCodec: sharedCodec,
      pgSource: sharedSource,
      isUnique: !!refSpec.singular,
      behavior: behavior ?? "",
      typeName,
      connectionTypeName,
      singleRecordFieldName,
      connectionFieldName,
      listFieldName,
      singleRecordPlan,
      listPlan,
      connectionPlan,
      relatedTypeName: context.Self.name,
    };
    digests.push(digest);
  }

  return digests.reduce((memo, digest) => {
    const {
      isUnique,
      behavior,
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
      pgSource,
      pgCodec: pgFieldCodec,
      pgRelationDetails,
      relatedTypeName,
    } = digest;
    const relationTypeScope = isUnique ? `singularRelation` : `manyRelation`;
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
    const defaultBehavior = isUnique
      ? "single -singularRelation:list -singularRelation:connection"
      : simpleCollections === "both"
      ? "connection list"
      : simpleCollections === "only"
      ? "list"
      : "connection";

    if (
      isUnique &&
      build.behavior.matches(
        behavior,
        `${relationTypeScope}:single`,
        defaultBehavior,
      )
    ) {
      const fieldName = singleRecordFieldName;
      fields = extend(
        fields,
        {
          [fieldName]: fieldWithHooks(
            {
              fieldName,
              fieldBehaviorScope: `${relationTypeScope}:single`,
              isPgSingleRelationField: true,
              behavior,
              pgRelationDetails,
            },
            {
              description:
                description ??
                `Reads a single \`${typeName}\` that is related to this \`${relatedTypeName}\`.`,
              // TODO: handle nullability
              type: OtherType,
              plan: singleRecordPlan,
              deprecationReason,
            },
          ),
        },
        `Adding '${identifier}' single relation field to ${Self.name}`,
        "recoverable",
      );
    }

    if (
      isReferencee &&
      build.behavior.matches(
        behavior,
        `${relationTypeScope}:connection`,
        defaultBehavior,
      )
    ) {
      const ConnectionType = build.getTypeByName(connectionTypeName);
      if (ConnectionType) {
        const fieldName = connectionFieldName;
        fields = extend(
          fields,
          {
            [fieldName]: fieldWithHooks(
              {
                fieldName,
                fieldBehaviorScope: `${relationTypeScope}:connection`,
                // TODO: rename to pgFieldSource?
                pgSource,
                pgFieldCodec,
                isPgFieldConnection: true,
                isPgManyRelationConnectionField: true,
                // TODO: rename to pgFieldRelationDetails?
                pgRelationDetails,
                // TODO: rename to pgFieldBehavior?
                behavior,
              },
              {
                description:
                  description ??
                  `Reads and enables pagination through a set of \`${typeName}\`.`,
                // TODO: handle nullability
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

    if (
      isReferencee &&
      build.behavior.matches(
        behavior,
        `${relationTypeScope}:list`,
        defaultBehavior,
      )
    ) {
      const fieldName = listFieldName;
      fields = extend(
        fields,
        {
          [fieldName]: fieldWithHooks(
            {
              fieldName,
              fieldBehaviorScope: `${relationTypeScope}:list`,
              pgSource,
              pgFieldCodec,
              isPgFieldSimpleCollection: true,
              isPgManyRelationListField: true,
              pgRelationDetails,
              behavior,
            },
            {
              description,
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
