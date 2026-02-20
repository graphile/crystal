import type { GrafastSubscriber } from "grafast";
import { exportAsMany } from "grafast";
export { sql } from "pg-sql2";

import type {
  ObjectFromPgCodecAttributes,
  PgCodecAttribute,
  PgCodecAttributeExtensions,
  PgCodecAttributes,
  PgCodecAttributeVia,
  PgCodecAttributeViaExplicit,
  PgEnumCodecSpec,
  PgRecordTypeCodecSpec,
} from "./codecs.ts";
import {
  domainOfCodec,
  enumCodec,
  getCodecByPgCatalogTypeName,
  getInnerCodec,
  isEnumCodec,
  LIST_TYPES,
  listOfCodec,
  rangeOfCodec,
  recordCodec,
  sqlValueWithCodec,
  TYPES,
} from "./codecs.ts";
import type {
  PgBox,
  PgCircle,
  PgHStore,
  PgInterval,
  PgLine,
  PgLseg,
  PgPath,
  PgPoint,
  PgPolygon,
} from "./codecUtils/index.ts";
import type {
  PgCodecRef,
  PgCodecRefExtensions,
  PgCodecRefPath,
  PgCodecRefPathEntry,
  PgCodecRefs,
  PgFunctionResourceOptions,
  PgRegistryBuilder,
  PgResourceExtensions,
  PgResourceOptions,
  PgResourceParameter,
  PgResourceUnique,
  PgResourceUniqueExtensions,
} from "./datasource.ts";
import {
  makeRegistry,
  makeRegistryBuilder,
  PgResource,
  pgResourceOptions,
} from "./datasource.ts";
import type {
  PgClient,
  PgClientQuery,
  PgClientResult,
  PgExecutorContext,
  PgExecutorContextPlans,
  PgExecutorInput,
  PgExecutorMutationOptions,
  PgExecutorOptions,
  WithPgClient,
} from "./executor.ts";
import { PgExecutor } from "./executor.ts";
import { PgBooleanFilter } from "./filters/pgBooleanFilter.ts";
import { PgClassFilter } from "./filters/pgClassFilter.ts";
import { PgManyFilter } from "./filters/pgManyFilter.ts";
import { PgOrFilter } from "./filters/pgOrFilter.ts";
import type {
  GetPgCodecAttributes,
  GetPgRegistryCodecRelations,
  GetPgRegistryCodecs,
  GetPgRegistrySources,
  GetPgResourceAttributes,
  GetPgResourceCodec,
  GetPgResourceRegistry,
  GetPgResourceRelations,
  GetPgResourceUniques,
  KeysOfType,
  MakePgServiceOptions,
  PgClassSingleStep,
  PgCodec,
  PgCodecAnyScalar,
  PgCodecExtensions,
  PgCodecList,
  PgCodecPolymorphism,
  PgCodecPolymorphismRelational,
  PgCodecPolymorphismRelationalTypeSpec,
  PgCodecPolymorphismSingle,
  PgCodecPolymorphismSingleTypeAttributeSpec,
  PgCodecPolymorphismSingleTypeSpec,
  PgCodecPolymorphismUnion,
  PgCodecRelation,
  PgCodecRelationConfig,
  PgCodecRelationExtensions,
  PgCodecWithAttributes,
  PgConditionLike,
  PgDecode,
  PgEncode,
  PgEnumCodec,
  PgEnumValue,
  PgGroupSpec,
  PgOrderSpec,
  PgRefDefinition,
  PgRefDefinitionExtensions,
  PgRefDefinitions,
  PgRegistry,
  PgSelectQueryBuilderCallback,
  PgTypedStep,
  PgUnionAllQueryBuilderCallback,
  PlanByUniques,
  TuplePlanMap,
} from "./interfaces.ts";
import type { PgLockableParameter, PgLockCallback } from "./pgLocker.ts";
import type { PgAdaptor } from "./pgServices.ts";
import {
  getWithPgClientFromPgService,
  withPgClientFromPgService,
  withSuperuserPgClientFromPgService,
} from "./pgServices.ts";
import { PgContextPlugin } from "./plugins/PgContextPlugin.ts";
import {
  pgClassExpression,
  PgClassExpressionStep,
} from "./steps/pgClassExpression.ts";
import type {
  PgConditionCapableParent,
  PgHavingConditionSpec,
  PgWhereConditionSpec,
} from "./steps/pgCondition.ts";
import {
  PgCondition,
  pgWhereConditionSpecListToSQL,
} from "./steps/pgCondition.ts";
import { PgCursorStep } from "./steps/pgCursor.ts";
import type { PgDeleteSingleQueryBuilder } from "./steps/pgDeleteSingle.ts";
import { pgDeleteSingle, PgDeleteSingleStep } from "./steps/pgDeleteSingle.ts";
import type { PgInsertSingleQueryBuilder } from "./steps/pgInsertSingle.ts";
import { pgInsertSingle, PgInsertSingleStep } from "./steps/pgInsertSingle.ts";
import type {
  PgGroupDetails,
  PgSelectArgumentDigest,
  PgSelectArgumentRuntimeValue,
  PgSelectArgumentSpec,
  PgSelectIdentifierSpec,
  PgSelectMode,
  PgSelectOptions,
  PgSelectParsedCursorStep,
  PgSelectQueryBuilder,
} from "./steps/pgSelect.ts";
import {
  generatePgParameterAnalysis,
  pgFromExpression,
  pgFromExpressionRuntime,
  pgSelect,
  pgSelectFromRecords,
  PgSelectRowsStep,
  PgSelectStep,
  sqlFromArgDigests,
} from "./steps/pgSelect.ts";
import type { PgSelectSinglePlanOptions } from "./steps/pgSelectSingle.ts";
import {
  pgSelectFromRecord,
  pgSelectSingleFromRecord,
  PgSelectSingleStep,
} from "./steps/pgSelectSingle.ts";
import { PgTempTable } from "./steps/pgTempTable.ts";
import type {
  PgUnionAllQueryBuilder,
  PgUnionAllStepCondition,
  PgUnionAllStepConfig,
  PgUnionAllStepConfigAttributes,
  PgUnionAllStepMember,
  PgUnionAllStepOrder,
} from "./steps/pgUnionAll.ts";
import {
  pgUnionAll,
  PgUnionAllRowsStep,
  PgUnionAllSingleStep,
  PgUnionAllStep,
} from "./steps/pgUnionAll.ts";
import type { PgUpdateSingleQueryBuilder } from "./steps/pgUpdateSingle.ts";
import { pgUpdateSingle, PgUpdateSingleStep } from "./steps/pgUpdateSingle.ts";
import {
  pgValidateParsedCursor,
  PgValidateParsedCursorStep,
} from "./steps/pgValidateParsedCursor.ts";
import { toPg, ToPgStep } from "./steps/toPg.ts";
import type { SideEffectWithPgClientStepCallback } from "./steps/withPgClient.ts";
import {
  loadManyWithPgClient,
  loadOneWithPgClient,
  sideEffectWithPgClient,
  SideEffectWithPgClientStep,
  sideEffectWithPgClientTransaction,
  withPgClient,
  withPgClientTransaction,
} from "./steps/withPgClient.ts";
import { assertPgClassSingleStep } from "./utils.ts";

export type {
  GetPgCodecAttributes,
  GetPgRegistryCodecRelations,
  GetPgRegistryCodecs,
  GetPgRegistrySources,
  GetPgResourceAttributes,
  GetPgResourceCodec,
  GetPgResourceRegistry,
  GetPgResourceRelations,
  GetPgResourceUniques,
  KeysOfType,
  MakePgServiceOptions,
  ObjectFromPgCodecAttributes,
  PgAdaptor,
  PgBox,
  PgCircle,
  PgClassSingleStep,
  PgClient,
  PgClientQuery,
  PgClientResult,
  PgCodec,
  PgCodecAnyScalar,
  PgCodecAttribute,
  PgCodecAttributeExtensions,
  PgCodecAttributes,
  PgCodecAttributeVia,
  PgCodecAttributeViaExplicit,
  PgCodecExtensions,
  PgCodecList,
  PgCodecPolymorphism,
  PgCodecPolymorphismRelational,
  PgCodecPolymorphismRelationalTypeSpec,
  PgCodecPolymorphismSingle,
  PgCodecPolymorphismSingleTypeAttributeSpec,
  PgCodecPolymorphismSingleTypeSpec,
  PgCodecPolymorphismUnion,
  PgCodecRef,
  PgCodecRefExtensions,
  PgCodecRefPath,
  PgCodecRefPathEntry,
  PgCodecRefs,
  PgCodecRelation,
  PgCodecRelationConfig,
  PgCodecRelationExtensions,
  PgCodecWithAttributes,
  PgConditionCapableParent,
  PgConditionLike,
  PgDecode,
  PgDeleteSingleQueryBuilder,
  PgEncode,
  PgEnumCodec,
  PgEnumCodecSpec,
  PgEnumValue,
  PgExecutorContext,
  PgExecutorContextPlans,
  PgExecutorInput,
  PgExecutorMutationOptions,
  PgExecutorOptions,
  PgFunctionResourceOptions,
  PgGroupDetails,
  PgGroupSpec,
  PgHavingConditionSpec,
  PgHStore,
  PgInsertSingleQueryBuilder,
  PgInterval,
  PgLine,
  PgLockableParameter,
  PgLockCallback,
  PgLseg,
  PgOrderSpec,
  PgPath,
  PgPoint,
  PgPolygon,
  PgRecordTypeCodecSpec,
  PgRefDefinition,
  PgRefDefinitionExtensions,
  PgRefDefinitions,
  PgRegistry,
  PgRegistryBuilder,
  PgResourceExtensions,
  PgResourceOptions,
  PgResourceParameter,
  PgResourceUnique,
  PgResourceUniqueExtensions,
  PgSelectArgumentDigest,
  PgSelectArgumentRuntimeValue,
  PgSelectArgumentSpec,
  PgSelectIdentifierSpec,
  PgSelectMode,
  PgSelectOptions,
  PgSelectParsedCursorStep,
  PgSelectQueryBuilder,
  PgSelectQueryBuilderCallback,
  PgSelectSinglePlanOptions,
  PgTypedStep,
  PgUnionAllQueryBuilder,
  PgUnionAllQueryBuilderCallback,
  PgUnionAllStepCondition,
  PgUnionAllStepConfig,
  PgUnionAllStepConfigAttributes,
  PgUnionAllStepMember,
  PgUnionAllStepOrder,
  PgUpdateSingleQueryBuilder,
  PgWhereConditionSpec,
  PlanByUniques,
  SideEffectWithPgClientStepCallback,
  TuplePlanMap,
  WithPgClient,
};
export {
  assertPgClassSingleStep,
  domainOfCodec,
  enumCodec,
  generatePgParameterAnalysis,
  getCodecByPgCatalogTypeName,
  getInnerCodec,
  getWithPgClientFromPgService,
  isEnumCodec,
  LIST_TYPES,
  listOfCodec,
  loadManyWithPgClient,
  loadOneWithPgClient,
  pgResourceOptions as makePgResourceOptions,
  makeRegistry,
  makeRegistryBuilder,
  PgBooleanFilter,
  pgClassExpression,
  PgClassExpressionStep,
  PgClassFilter,
  PgCondition,
  PgContextPlugin,
  PgCursorStep,
  pgDeleteSingle,
  PgDeleteSingleStep,
  PgExecutor,
  pgFromExpression,
  pgFromExpressionRuntime,
  pgInsertSingle,
  PgInsertSingleStep,
  PgManyFilter,
  PgOrFilter,
  PgResource,
  pgResourceOptions,
  pgSelect,
  pgSelectFromRecord,
  pgSelectFromRecords,
  PgSelectRowsStep,
  pgSelectSingleFromRecord,
  PgSelectSingleStep,
  PgSelectStep,
  PgTempTable,
  pgUnionAll,
  PgUnionAllRowsStep,
  PgUnionAllSingleStep,
  PgUnionAllStep,
  pgUpdateSingle,
  PgUpdateSingleStep,
  pgValidateParsedCursor,
  PgValidateParsedCursorStep,
  pgWhereConditionSpecListToSQL,
  rangeOfCodec,
  recordCodec,
  sideEffectWithPgClient,
  SideEffectWithPgClientStep,
  sideEffectWithPgClientTransaction,
  sqlFromArgDigests,
  sqlValueWithCodec,
  toPg,
  ToPgStep,
  TYPES,
  withPgClient,
  withPgClientFromPgService,
  withPgClientTransaction,
  withSuperuserPgClientFromPgService,
};

exportAsMany("@dataplan/pg", {
  assertPgClassSingleStep,
  domainOfCodec,
  getInnerCodec,
  enumCodec,
  getCodecByPgCatalogTypeName,
  isEnumCodec,
  listOfCodec,
  rangeOfCodec,
  recordCodec,
  sqlValueWithCodec,
  makeRegistryBuilder,
  makeRegistry,
  pgResourceOptions,
  TYPES,
  LIST_TYPES,
  PgResource,
  PgExecutor,
  PgBooleanFilter,
  PgClassFilter,
  PgManyFilter,
  PgOrFilter,
  pgClassExpression,
  PgClassExpressionStep,
  PgCondition,
  pgWhereConditionSpecListToSQL,
  PgCursorStep,
  pgDeleteSingle,
  PgDeleteSingleStep,
  pgInsertSingle,
  PgInsertSingleStep,
  pgSelect,
  pgFromExpressionRuntime,
  pgFromExpression,
  generatePgParameterAnalysis,
  pgSelectFromRecords,
  PgSelectStep,
  PgSelectRowsStep,
  sqlFromArgDigests,
  pgSelectFromRecord,
  pgSelectSingleFromRecord,
  PgSelectSingleStep,
  pgUnionAll,
  PgUnionAllSingleStep,
  PgUnionAllRowsStep,
  PgUnionAllStep,
  pgUpdateSingle,
  PgUpdateSingleStep,
  pgValidateParsedCursor,
  PgValidateParsedCursorStep,
  PgTempTable,
  toPg,
  ToPgStep,
  loadOneWithPgClient,
  loadManyWithPgClient,
  sideEffectWithPgClient,
  sideEffectWithPgClientTransaction,
  SideEffectWithPgClientStep,
  getWithPgClientFromPgService,
  withPgClientFromPgService,
  withSuperuserPgClientFromPgService,
  PgContextPlugin,
});

export { version } from "./version.ts";

declare global {
  namespace GraphileConfig {
    interface PgServiceConfiguration<
      TAdaptor extends
        keyof GraphileConfig.PgAdaptors = keyof GraphileConfig.PgAdaptors,
    > {
      name: string;
      schemas?: string[];

      adaptor: PgAdaptor<TAdaptor>;
      adaptorSettings?: GraphileConfig.PgAdaptors[TAdaptor]["adaptorSettings"];

      /** The key on 'context' where the withPgClient function will be sourced */
      withPgClientKey: KeysOfType<
        Grafast.Context & object,
        WithPgClient<GraphileConfig.PgAdaptors[TAdaptor]["client"]>
      >;

      /** Return settings to set in the session */
      pgSettings?:
        | ((
            requestContext: Grafast.RequestContext,
          ) => Record<string, string | undefined>)
        | Record<string, string | undefined>
        | null;

      /** Settings to set in the session that performs introspection (during gather phase) */
      pgSettingsForIntrospection?: Record<string, string | undefined> | null;

      /** The key on 'context' where the pgSettings for this DB will be sourced */
      pgSettingsKey?: KeysOfType<
        Grafast.Context & object,
        Record<string, string | undefined> | null | undefined
      >;

      /** The GrafastSubscriber to use for subscriptions */
      pgSubscriber?: GrafastSubscriber<Record<string, string>> | null;

      /** Where on the context should the PgSubscriber be stored? */
      pgSubscriberKey?: KeysOfType<
        Grafast.Context & object,
        GrafastSubscriber<any> | null | undefined
      >;

      /**
       * Call this when you no longer need this service configuration any more;
       * releases any created resources (e.g. connection pools).
       */
      release?: () => void | PromiseLike<void>;
    }

    interface Preset {
      pgServices?: ReadonlyArray<
        {
          [Key in keyof GraphileConfig.PgAdaptors]: PgServiceConfiguration<Key>;
        }[keyof GraphileConfig.PgAdaptors]
      >;
    }

    interface PgAdaptors {
      /*
       * Add your adaptor configurations via declaration merging; they should
       * conform to this:
       *
       * ```
       * [moduleName: string]: {
       *   adaptorSettings: { ... } | undefined;
       *   makePgServiceOptions: MakePgServiceOptions & { ... };
       *   client: PgClient & MyPgClientStuff;
       * };
       * ```
       */
    }
  }
  namespace DataplanPg {
    interface PgConditionExtensions {}
    /**
     * Custom metadata for a codec
     */
    interface PgCodecExtensions {
      oid?: string;
      listItemNonNull?: boolean;
    }

    /**
     * Extra metadata you can attach to a unique constraint.
     */
    interface PgResourceUniqueExtensions {}

    /**
     * Space for extra metadata about this resource
     */
    interface PgResourceExtensions {}

    interface PgResourceParameterExtensions {
      variant?: string;
    }

    interface PgCodecRefExtensions {}
    interface PgCodecAttributeExtensions {}
    interface PgRefDefinitionExtensions {}
    interface PgCodecRelationExtensions {}
  }
}
