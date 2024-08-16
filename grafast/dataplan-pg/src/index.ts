import type { GrafastSubscriber } from "grafast";
import { exportAsMany } from "grafast";

import {
  domainOfCodec,
  enumCodec,
  getCodecByPgCatalogTypeName,
  getInnerCodec,
  isEnumCodec,
  listOfCodec,
  ObjectFromPgCodecAttributes,
  PgCodecAttribute,
  PgCodecAttributeExtensions,
  PgCodecAttributes,
  PgCodecAttributeVia,
  PgCodecAttributeViaExplicit,
  PgEnumCodecSpec,
  PgRecordTypeCodecSpec,
  rangeOfCodec,
  recordCodec,
  TYPES,
} from "./codecs.js";
import {
  PgBox,
  PgCircle,
  PgHStore,
  PgInterval,
  PgLine,
  PgLseg,
  PgPath,
  PgPoint,
  PgPolygon,
} from "./codecUtils/index.js";
import {
  makePgResourceOptions,
  makeRegistry,
  makeRegistryBuilder,
  PgCodecRef,
  PgCodecRefExtensions,
  PgCodecRefPath,
  PgCodecRefPathEntry,
  PgCodecRefs,
  PgFunctionResourceOptions,
  PgRegistryBuilder,
  PgResource,
  PgResourceExtensions,
  PgResourceOptions,
  PgResourceParameter,
  PgResourceUnique,
  PgResourceUniqueExtensions,
} from "./datasource.js";
import {
  PgClient,
  PgClientQuery,
  PgClientResult,
  PgExecutor,
  PgExecutorContext,
  PgExecutorContextPlans,
  PgExecutorInput,
  PgExecutorMutationOptions,
  PgExecutorOptions,
  WithPgClient,
} from "./executor.js";
import { PgBooleanFilterStep } from "./filters/pgBooleanFilter.js";
import { PgClassFilterStep } from "./filters/pgClassFilter.js";
import { PgManyFilterStep } from "./filters/pgManyFilter.js";
import { PgOrFilterStep } from "./filters/pgOrFilter.js";
import {
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
  PgConditionLikeStep,
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
  PgTypedExecutableStep,
  PlanByUniques,
  TuplePlanMap,
} from "./interfaces.js";
import { PgLockableParameter, PgLockCallback } from "./pgLocker.js";
import type { PgAdaptor } from "./pgServices.js";
import {
  getWithPgClientFromPgService,
  withPgClientFromPgService,
  withSuperuserPgClientFromPgService,
} from "./pgServices.js";
import { PgContextPlugin } from "./plugins/PgContextPlugin.js";
import {
  pgClassExpression,
  PgClassExpressionStep,
} from "./steps/pgClassExpression.js";
import {
  PgConditionCapableParentStep,
  PgConditionStep,
  PgConditionStepExtensions,
  PgHavingConditionSpec,
  PgWhereConditionSpec,
  pgWhereConditionSpecListToSQL,
} from "./steps/pgCondition.js";
import { PgCursorStep } from "./steps/pgCursor.js";
import { pgDeleteSingle, PgDeleteSingleStep } from "./steps/pgDeleteSingle.js";
import { pgInsertSingle, PgInsertSingleStep } from "./steps/pgInsertSingle.js";
import { pgPageInfo, PgPageInfoStep } from "./steps/pgPageInfo.js";
import {
  pgPolymorphic,
  PgPolymorphicStep,
  PgPolymorphicTypeMap,
} from "./steps/pgPolymorphic.js";
import {
  digestsFromArgumentSpecs,
  pgSelect,
  PgSelectArgumentDigest,
  PgSelectArgumentSpec,
  pgSelectFromRecords,
  PgSelectIdentifierSpec,
  PgSelectMode,
  PgSelectOptions,
  PgSelectParsedCursorStep,
  PgSelectStep,
  sqlFromArgDigests,
} from "./steps/pgSelect.js";
import {
  pgSelectFromRecord,
  pgSelectSingleFromRecord,
  PgSelectSinglePlanOptions,
  PgSelectSingleStep,
} from "./steps/pgSelectSingle.js";
import {
  pgSingleTablePolymorphic,
  PgSingleTablePolymorphicStep,
} from "./steps/pgSingleTablePolymorphic.js";
import { PgTempTableStep } from "./steps/pgTempTable.js";
import {
  pgUnionAll,
  PgUnionAllSingleStep,
  PgUnionAllStep,
  PgUnionAllStepCondition,
  PgUnionAllStepConfig,
  PgUnionAllStepConfigAttributes,
  PgUnionAllStepMember,
  PgUnionAllStepOrder,
} from "./steps/pgUnionAll.js";
import { pgUpdateSingle, PgUpdateSingleStep } from "./steps/pgUpdateSingle.js";
import {
  pgValidateParsedCursor,
  PgValidateParsedCursorStep,
} from "./steps/pgValidateParsedCursor.js";
import { toPg, ToPgStep } from "./steps/toPg.js";
import {
  withPgClient,
  WithPgClientStep,
  WithPgClientStepCallback,
  withPgClientTransaction,
} from "./steps/withPgClient.js";
import { assertPgClassSingleStep } from "./utils.js";

export {
  assertPgClassSingleStep,
  digestsFromArgumentSpecs,
  domainOfCodec,
  enumCodec,
  getCodecByPgCatalogTypeName,
  getInnerCodec,
  GetPgCodecAttributes,
  GetPgRegistryCodecRelations,
  GetPgRegistryCodecs,
  GetPgRegistrySources,
  GetPgResourceAttributes,
  GetPgResourceCodec,
  GetPgResourceRegistry,
  GetPgResourceRelations,
  GetPgResourceUniques,
  getWithPgClientFromPgService,
  isEnumCodec,
  KeysOfType,
  listOfCodec,
  makePgResourceOptions,
  MakePgServiceOptions,
  makeRegistry,
  makeRegistryBuilder,
  ObjectFromPgCodecAttributes,
  PgAdaptor,
  PgBooleanFilterStep,
  PgBox,
  PgCircle,
  pgClassExpression,
  PgClassExpressionStep,
  PgClassFilterStep,
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
  PgConditionCapableParentStep,
  PgConditionLikeStep,
  PgConditionStep,
  PgConditionStepExtensions,
  PgContextPlugin,
  PgCursorStep,
  PgDecode,
  pgDeleteSingle,
  PgDeleteSingleStep,
  PgEncode,
  PgEnumCodec,
  PgEnumCodecSpec,
  PgEnumValue,
  PgExecutor,
  PgExecutorContext,
  PgExecutorContextPlans,
  PgExecutorInput,
  PgExecutorMutationOptions,
  PgExecutorOptions,
  PgFunctionResourceOptions,
  PgGroupSpec,
  PgHavingConditionSpec,
  PgHStore,
  pgInsertSingle,
  PgInsertSingleStep,
  PgInterval,
  PgLine,
  PgLockableParameter,
  PgLockCallback,
  PgLseg,
  PgManyFilterStep,
  PgOrderSpec,
  PgOrFilterStep,
  pgPageInfo,
  PgPageInfoStep,
  PgPath,
  PgPoint,
  PgPolygon,
  pgPolymorphic,
  PgPolymorphicStep,
  PgPolymorphicTypeMap,
  PgRecordTypeCodecSpec,
  PgRefDefinition,
  PgRefDefinitionExtensions,
  PgRefDefinitions,
  PgRegistry,
  PgRegistryBuilder,
  PgResource,
  PgResourceExtensions,
  PgResourceOptions,
  PgResourceParameter,
  PgResourceUnique,
  PgResourceUniqueExtensions,
  pgSelect,
  PgSelectArgumentDigest,
  PgSelectArgumentSpec,
  pgSelectFromRecord,
  pgSelectFromRecords,
  PgSelectIdentifierSpec,
  PgSelectMode,
  PgSelectOptions,
  PgSelectParsedCursorStep,
  pgSelectSingleFromRecord,
  PgSelectSinglePlanOptions,
  PgSelectSingleStep,
  PgSelectStep,
  pgSingleTablePolymorphic,
  PgSingleTablePolymorphicStep,
  PgTempTableStep,
  PgTypedExecutableStep,
  pgUnionAll,
  PgUnionAllSingleStep,
  PgUnionAllStep,
  PgUnionAllStepCondition,
  PgUnionAllStepConfig,
  PgUnionAllStepConfigAttributes,
  PgUnionAllStepMember,
  PgUnionAllStepOrder,
  pgUpdateSingle,
  PgUpdateSingleStep,
  pgValidateParsedCursor,
  PgValidateParsedCursorStep,
  PgWhereConditionSpec,
  pgWhereConditionSpecListToSQL,
  PlanByUniques,
  rangeOfCodec,
  recordCodec,
  sqlFromArgDigests,
  toPg,
  ToPgStep,
  TuplePlanMap,
  TYPES,
  WithPgClient,
  withPgClient,
  withPgClientFromPgService,
  WithPgClientStep,
  WithPgClientStepCallback,
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
  makeRegistryBuilder,
  makeRegistry,
  makePgResourceOptions,
  TYPES,
  PgResource,
  PgExecutor,
  PgBooleanFilterStep,
  PgClassFilterStep,
  PgManyFilterStep,
  PgOrFilterStep,
  pgClassExpression,
  PgClassExpressionStep,
  PgConditionStep,
  pgWhereConditionSpecListToSQL,
  PgCursorStep,
  pgDeleteSingle,
  PgDeleteSingleStep,
  pgInsertSingle,
  PgInsertSingleStep,
  pgPageInfo,
  PgPageInfoStep,
  pgPolymorphic,
  PgPolymorphicStep,
  pgSelect,
  digestsFromArgumentSpecs,
  pgSelectFromRecords,
  PgSelectStep,
  sqlFromArgDigests,
  pgSelectFromRecord,
  pgSelectSingleFromRecord,
  PgSelectSingleStep,
  pgSingleTablePolymorphic,
  pgUnionAll,
  PgUnionAllSingleStep,
  PgUnionAllStep,
  PgSingleTablePolymorphicStep,
  pgUpdateSingle,
  PgUpdateSingleStep,
  pgValidateParsedCursor,
  PgValidateParsedCursorStep,
  PgTempTableStep,
  toPg,
  ToPgStep,
  withPgClient,
  withPgClientTransaction,
  WithPgClientStep,
  getWithPgClientFromPgService,
  withPgClientFromPgService,
  withSuperuserPgClientFromPgService,
  PgContextPlugin,
});

export {
  /** @deprecated Use Pg prefix */
  PgBooleanFilterStep as BooleanFilterStep,
  /** @deprecated Use Pg prefix */
  PgClassFilterStep as ClassFilterStep,
  /** @deprecated Use Pg prefix */
  PgManyFilterStep as ManyFilterStep,
  /** @deprecated Use Pg prefix */
  PgOrFilterStep as OrFilterStep,
  /** @deprecated Use Pg prefix */
  PgTempTableStep as TempTableStep,
};

export { version } from "./version.js";

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
    interface PgConditionStepExtensions {}
    /**
     * Custom metadata for a codec
     */
    interface PgCodecExtensions {
      oid?: string;
      listItemNonNull?: boolean;
      isEnumTableEnum?: boolean;
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
