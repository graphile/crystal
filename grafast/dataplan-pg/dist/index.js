"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pgValidateParsedCursor = exports.PgUpdateSingleStep = exports.pgUpdateSingle = exports.PgUnionAllStep = exports.PgUnionAllSingleStep = exports.PgUnionAllRowsStep = exports.pgUnionAll = exports.PgTempTable = exports.PgSingleTablePolymorphicStep = exports.pgSingleTablePolymorphic = exports.PgSelectStep = exports.PgSelectSingleStep = exports.pgSelectSingleFromRecord = exports.PgSelectRowsStep = exports.pgSelectFromRecords = exports.pgSelectFromRecord = exports.pgSelect = exports.PgResource = exports.PgPolymorphicStep = exports.pgPolymorphic = exports.PgPageInfoStep = exports.pgPageInfo = exports.PgOrFilter = exports.PgManyFilter = exports.PgInsertSingleStep = exports.pgInsertSingle = exports.pgFromExpressionRuntime = exports.pgFromExpression = exports.PgExecutor = exports.PgDeleteSingleStep = exports.pgDeleteSingle = exports.PgCursorStep = exports.PgContextPlugin = exports.PgCondition = exports.PgClassFilter = exports.PgClassExpressionStep = exports.pgClassExpression = exports.PgBooleanFilter = exports.makeRegistryBuilder = exports.makeRegistry = exports.makePgResourceOptions = exports.listOfCodec = exports.isEnumCodec = exports.getWithPgClientFromPgService = exports.getInnerCodec = exports.getCodecByPgCatalogTypeName = exports.generatePgParameterAnalysis = exports.enumCodec = exports.domainOfCodec = exports.assertPgClassSingleStep = void 0;
exports.version = exports.withSuperuserPgClientFromPgService = exports.withPgClientTransaction = exports.WithPgClientStep = exports.withPgClientFromPgService = exports.withPgClient = exports.TYPES = exports.ToPgStep = exports.toPg = exports.sqlValueWithCodec = exports.sqlFromArgDigests = exports.recordCodec = exports.rangeOfCodec = exports.pgWhereConditionSpecListToSQL = exports.PgValidateParsedCursorStep = void 0;
const grafast_1 = require("grafast");
const codecs_js_1 = require("./codecs.js");
Object.defineProperty(exports, "domainOfCodec", { enumerable: true, get: function () { return codecs_js_1.domainOfCodec; } });
Object.defineProperty(exports, "enumCodec", { enumerable: true, get: function () { return codecs_js_1.enumCodec; } });
Object.defineProperty(exports, "getCodecByPgCatalogTypeName", { enumerable: true, get: function () { return codecs_js_1.getCodecByPgCatalogTypeName; } });
Object.defineProperty(exports, "getInnerCodec", { enumerable: true, get: function () { return codecs_js_1.getInnerCodec; } });
Object.defineProperty(exports, "isEnumCodec", { enumerable: true, get: function () { return codecs_js_1.isEnumCodec; } });
Object.defineProperty(exports, "listOfCodec", { enumerable: true, get: function () { return codecs_js_1.listOfCodec; } });
Object.defineProperty(exports, "rangeOfCodec", { enumerable: true, get: function () { return codecs_js_1.rangeOfCodec; } });
Object.defineProperty(exports, "recordCodec", { enumerable: true, get: function () { return codecs_js_1.recordCodec; } });
Object.defineProperty(exports, "sqlValueWithCodec", { enumerable: true, get: function () { return codecs_js_1.sqlValueWithCodec; } });
Object.defineProperty(exports, "TYPES", { enumerable: true, get: function () { return codecs_js_1.TYPES; } });
const datasource_js_1 = require("./datasource.js");
Object.defineProperty(exports, "makePgResourceOptions", { enumerable: true, get: function () { return datasource_js_1.makePgResourceOptions; } });
Object.defineProperty(exports, "makeRegistry", { enumerable: true, get: function () { return datasource_js_1.makeRegistry; } });
Object.defineProperty(exports, "makeRegistryBuilder", { enumerable: true, get: function () { return datasource_js_1.makeRegistryBuilder; } });
Object.defineProperty(exports, "PgResource", { enumerable: true, get: function () { return datasource_js_1.PgResource; } });
const executor_js_1 = require("./executor.js");
Object.defineProperty(exports, "PgExecutor", { enumerable: true, get: function () { return executor_js_1.PgExecutor; } });
const pgBooleanFilter_js_1 = require("./filters/pgBooleanFilter.js");
Object.defineProperty(exports, "PgBooleanFilter", { enumerable: true, get: function () { return pgBooleanFilter_js_1.PgBooleanFilter; } });
const pgClassFilter_js_1 = require("./filters/pgClassFilter.js");
Object.defineProperty(exports, "PgClassFilter", { enumerable: true, get: function () { return pgClassFilter_js_1.PgClassFilter; } });
const pgManyFilter_js_1 = require("./filters/pgManyFilter.js");
Object.defineProperty(exports, "PgManyFilter", { enumerable: true, get: function () { return pgManyFilter_js_1.PgManyFilter; } });
const pgOrFilter_js_1 = require("./filters/pgOrFilter.js");
Object.defineProperty(exports, "PgOrFilter", { enumerable: true, get: function () { return pgOrFilter_js_1.PgOrFilter; } });
const pgServices_js_1 = require("./pgServices.js");
Object.defineProperty(exports, "getWithPgClientFromPgService", { enumerable: true, get: function () { return pgServices_js_1.getWithPgClientFromPgService; } });
Object.defineProperty(exports, "withPgClientFromPgService", { enumerable: true, get: function () { return pgServices_js_1.withPgClientFromPgService; } });
Object.defineProperty(exports, "withSuperuserPgClientFromPgService", { enumerable: true, get: function () { return pgServices_js_1.withSuperuserPgClientFromPgService; } });
const PgContextPlugin_js_1 = require("./plugins/PgContextPlugin.js");
Object.defineProperty(exports, "PgContextPlugin", { enumerable: true, get: function () { return PgContextPlugin_js_1.PgContextPlugin; } });
const pgClassExpression_js_1 = require("./steps/pgClassExpression.js");
Object.defineProperty(exports, "pgClassExpression", { enumerable: true, get: function () { return pgClassExpression_js_1.pgClassExpression; } });
Object.defineProperty(exports, "PgClassExpressionStep", { enumerable: true, get: function () { return pgClassExpression_js_1.PgClassExpressionStep; } });
const pgCondition_js_1 = require("./steps/pgCondition.js");
Object.defineProperty(exports, "PgCondition", { enumerable: true, get: function () { return pgCondition_js_1.PgCondition; } });
Object.defineProperty(exports, "pgWhereConditionSpecListToSQL", { enumerable: true, get: function () { return pgCondition_js_1.pgWhereConditionSpecListToSQL; } });
const pgCursor_js_1 = require("./steps/pgCursor.js");
Object.defineProperty(exports, "PgCursorStep", { enumerable: true, get: function () { return pgCursor_js_1.PgCursorStep; } });
const pgDeleteSingle_js_1 = require("./steps/pgDeleteSingle.js");
Object.defineProperty(exports, "pgDeleteSingle", { enumerable: true, get: function () { return pgDeleteSingle_js_1.pgDeleteSingle; } });
Object.defineProperty(exports, "PgDeleteSingleStep", { enumerable: true, get: function () { return pgDeleteSingle_js_1.PgDeleteSingleStep; } });
const pgInsertSingle_js_1 = require("./steps/pgInsertSingle.js");
Object.defineProperty(exports, "pgInsertSingle", { enumerable: true, get: function () { return pgInsertSingle_js_1.pgInsertSingle; } });
Object.defineProperty(exports, "PgInsertSingleStep", { enumerable: true, get: function () { return pgInsertSingle_js_1.PgInsertSingleStep; } });
const pgPageInfo_js_1 = require("./steps/pgPageInfo.js");
Object.defineProperty(exports, "pgPageInfo", { enumerable: true, get: function () { return pgPageInfo_js_1.pgPageInfo; } });
Object.defineProperty(exports, "PgPageInfoStep", { enumerable: true, get: function () { return pgPageInfo_js_1.PgPageInfoStep; } });
const pgPolymorphic_js_1 = require("./steps/pgPolymorphic.js");
Object.defineProperty(exports, "pgPolymorphic", { enumerable: true, get: function () { return pgPolymorphic_js_1.pgPolymorphic; } });
Object.defineProperty(exports, "PgPolymorphicStep", { enumerable: true, get: function () { return pgPolymorphic_js_1.PgPolymorphicStep; } });
const pgSelect_js_1 = require("./steps/pgSelect.js");
Object.defineProperty(exports, "generatePgParameterAnalysis", { enumerable: true, get: function () { return pgSelect_js_1.generatePgParameterAnalysis; } });
Object.defineProperty(exports, "pgFromExpression", { enumerable: true, get: function () { return pgSelect_js_1.pgFromExpression; } });
Object.defineProperty(exports, "pgFromExpressionRuntime", { enumerable: true, get: function () { return pgSelect_js_1.pgFromExpressionRuntime; } });
Object.defineProperty(exports, "pgSelect", { enumerable: true, get: function () { return pgSelect_js_1.pgSelect; } });
Object.defineProperty(exports, "pgSelectFromRecords", { enumerable: true, get: function () { return pgSelect_js_1.pgSelectFromRecords; } });
Object.defineProperty(exports, "PgSelectRowsStep", { enumerable: true, get: function () { return pgSelect_js_1.PgSelectRowsStep; } });
Object.defineProperty(exports, "PgSelectStep", { enumerable: true, get: function () { return pgSelect_js_1.PgSelectStep; } });
Object.defineProperty(exports, "sqlFromArgDigests", { enumerable: true, get: function () { return pgSelect_js_1.sqlFromArgDigests; } });
const pgSelectSingle_js_1 = require("./steps/pgSelectSingle.js");
Object.defineProperty(exports, "pgSelectFromRecord", { enumerable: true, get: function () { return pgSelectSingle_js_1.pgSelectFromRecord; } });
Object.defineProperty(exports, "pgSelectSingleFromRecord", { enumerable: true, get: function () { return pgSelectSingle_js_1.pgSelectSingleFromRecord; } });
Object.defineProperty(exports, "PgSelectSingleStep", { enumerable: true, get: function () { return pgSelectSingle_js_1.PgSelectSingleStep; } });
const pgSingleTablePolymorphic_js_1 = require("./steps/pgSingleTablePolymorphic.js");
Object.defineProperty(exports, "pgSingleTablePolymorphic", { enumerable: true, get: function () { return pgSingleTablePolymorphic_js_1.pgSingleTablePolymorphic; } });
Object.defineProperty(exports, "PgSingleTablePolymorphicStep", { enumerable: true, get: function () { return pgSingleTablePolymorphic_js_1.PgSingleTablePolymorphicStep; } });
const pgTempTable_js_1 = require("./steps/pgTempTable.js");
Object.defineProperty(exports, "PgTempTable", { enumerable: true, get: function () { return pgTempTable_js_1.PgTempTable; } });
const pgUnionAll_js_1 = require("./steps/pgUnionAll.js");
Object.defineProperty(exports, "pgUnionAll", { enumerable: true, get: function () { return pgUnionAll_js_1.pgUnionAll; } });
Object.defineProperty(exports, "PgUnionAllRowsStep", { enumerable: true, get: function () { return pgUnionAll_js_1.PgUnionAllRowsStep; } });
Object.defineProperty(exports, "PgUnionAllSingleStep", { enumerable: true, get: function () { return pgUnionAll_js_1.PgUnionAllSingleStep; } });
Object.defineProperty(exports, "PgUnionAllStep", { enumerable: true, get: function () { return pgUnionAll_js_1.PgUnionAllStep; } });
const pgUpdateSingle_js_1 = require("./steps/pgUpdateSingle.js");
Object.defineProperty(exports, "pgUpdateSingle", { enumerable: true, get: function () { return pgUpdateSingle_js_1.pgUpdateSingle; } });
Object.defineProperty(exports, "PgUpdateSingleStep", { enumerable: true, get: function () { return pgUpdateSingle_js_1.PgUpdateSingleStep; } });
const pgValidateParsedCursor_js_1 = require("./steps/pgValidateParsedCursor.js");
Object.defineProperty(exports, "pgValidateParsedCursor", { enumerable: true, get: function () { return pgValidateParsedCursor_js_1.pgValidateParsedCursor; } });
Object.defineProperty(exports, "PgValidateParsedCursorStep", { enumerable: true, get: function () { return pgValidateParsedCursor_js_1.PgValidateParsedCursorStep; } });
const toPg_js_1 = require("./steps/toPg.js");
Object.defineProperty(exports, "toPg", { enumerable: true, get: function () { return toPg_js_1.toPg; } });
Object.defineProperty(exports, "ToPgStep", { enumerable: true, get: function () { return toPg_js_1.ToPgStep; } });
const withPgClient_js_1 = require("./steps/withPgClient.js");
Object.defineProperty(exports, "withPgClient", { enumerable: true, get: function () { return withPgClient_js_1.withPgClient; } });
Object.defineProperty(exports, "WithPgClientStep", { enumerable: true, get: function () { return withPgClient_js_1.WithPgClientStep; } });
Object.defineProperty(exports, "withPgClientTransaction", { enumerable: true, get: function () { return withPgClient_js_1.withPgClientTransaction; } });
const utils_js_1 = require("./utils.js");
Object.defineProperty(exports, "assertPgClassSingleStep", { enumerable: true, get: function () { return utils_js_1.assertPgClassSingleStep; } });
(0, grafast_1.exportAsMany)("@dataplan/pg", {
    assertPgClassSingleStep: utils_js_1.assertPgClassSingleStep,
    domainOfCodec: codecs_js_1.domainOfCodec,
    getInnerCodec: codecs_js_1.getInnerCodec,
    enumCodec: codecs_js_1.enumCodec,
    getCodecByPgCatalogTypeName: codecs_js_1.getCodecByPgCatalogTypeName,
    isEnumCodec: codecs_js_1.isEnumCodec,
    listOfCodec: codecs_js_1.listOfCodec,
    rangeOfCodec: codecs_js_1.rangeOfCodec,
    recordCodec: codecs_js_1.recordCodec,
    sqlValueWithCodec: codecs_js_1.sqlValueWithCodec,
    makeRegistryBuilder: datasource_js_1.makeRegistryBuilder,
    makeRegistry: datasource_js_1.makeRegistry,
    makePgResourceOptions: datasource_js_1.makePgResourceOptions,
    TYPES: codecs_js_1.TYPES,
    PgResource: datasource_js_1.PgResource,
    PgExecutor: executor_js_1.PgExecutor,
    PgBooleanFilter: pgBooleanFilter_js_1.PgBooleanFilter,
    PgClassFilter: pgClassFilter_js_1.PgClassFilter,
    PgManyFilter: pgManyFilter_js_1.PgManyFilter,
    PgOrFilter: pgOrFilter_js_1.PgOrFilter,
    pgClassExpression: pgClassExpression_js_1.pgClassExpression,
    PgClassExpressionStep: pgClassExpression_js_1.PgClassExpressionStep,
    PgCondition: pgCondition_js_1.PgCondition,
    pgWhereConditionSpecListToSQL: pgCondition_js_1.pgWhereConditionSpecListToSQL,
    PgCursorStep: pgCursor_js_1.PgCursorStep,
    pgDeleteSingle: pgDeleteSingle_js_1.pgDeleteSingle,
    PgDeleteSingleStep: pgDeleteSingle_js_1.PgDeleteSingleStep,
    pgInsertSingle: pgInsertSingle_js_1.pgInsertSingle,
    PgInsertSingleStep: pgInsertSingle_js_1.PgInsertSingleStep,
    pgPageInfo: pgPageInfo_js_1.pgPageInfo,
    PgPageInfoStep: pgPageInfo_js_1.PgPageInfoStep,
    pgPolymorphic: pgPolymorphic_js_1.pgPolymorphic,
    PgPolymorphicStep: pgPolymorphic_js_1.PgPolymorphicStep,
    pgSelect: pgSelect_js_1.pgSelect,
    pgFromExpressionRuntime: pgSelect_js_1.pgFromExpressionRuntime,
    pgFromExpression: pgSelect_js_1.pgFromExpression,
    generatePgParameterAnalysis: pgSelect_js_1.generatePgParameterAnalysis,
    pgSelectFromRecords: pgSelect_js_1.pgSelectFromRecords,
    PgSelectStep: pgSelect_js_1.PgSelectStep,
    PgSelectRowsStep: pgSelect_js_1.PgSelectRowsStep,
    sqlFromArgDigests: pgSelect_js_1.sqlFromArgDigests,
    pgSelectFromRecord: pgSelectSingle_js_1.pgSelectFromRecord,
    pgSelectSingleFromRecord: pgSelectSingle_js_1.pgSelectSingleFromRecord,
    PgSelectSingleStep: pgSelectSingle_js_1.PgSelectSingleStep,
    pgSingleTablePolymorphic: pgSingleTablePolymorphic_js_1.pgSingleTablePolymorphic,
    pgUnionAll: pgUnionAll_js_1.pgUnionAll,
    PgUnionAllSingleStep: pgUnionAll_js_1.PgUnionAllSingleStep,
    PgUnionAllRowsStep: pgUnionAll_js_1.PgUnionAllRowsStep,
    PgUnionAllStep: pgUnionAll_js_1.PgUnionAllStep,
    PgSingleTablePolymorphicStep: pgSingleTablePolymorphic_js_1.PgSingleTablePolymorphicStep,
    pgUpdateSingle: pgUpdateSingle_js_1.pgUpdateSingle,
    PgUpdateSingleStep: pgUpdateSingle_js_1.PgUpdateSingleStep,
    pgValidateParsedCursor: pgValidateParsedCursor_js_1.pgValidateParsedCursor,
    PgValidateParsedCursorStep: pgValidateParsedCursor_js_1.PgValidateParsedCursorStep,
    PgTempTable: pgTempTable_js_1.PgTempTable,
    toPg: toPg_js_1.toPg,
    ToPgStep: toPg_js_1.ToPgStep,
    withPgClient: withPgClient_js_1.withPgClient,
    withPgClientTransaction: withPgClient_js_1.withPgClientTransaction,
    WithPgClientStep: withPgClient_js_1.WithPgClientStep,
    getWithPgClientFromPgService: pgServices_js_1.getWithPgClientFromPgService,
    withPgClientFromPgService: pgServices_js_1.withPgClientFromPgService,
    withSuperuserPgClientFromPgService: pgServices_js_1.withSuperuserPgClientFromPgService,
    PgContextPlugin: PgContextPlugin_js_1.PgContextPlugin,
});
var version_js_1 = require("./version.js");
Object.defineProperty(exports, "version", { enumerable: true, get: function () { return version_js_1.version; } });
//# sourceMappingURL=index.js.map