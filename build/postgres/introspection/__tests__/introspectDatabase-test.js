"use strict";
var _this = this;
var tslib_1 = require("tslib");
var withPgClient_1 = require("../../../__tests__/utils/withPgClient");
var introspectDatabase_1 = require("../introspectDatabase");
// This test suite can be flaky. Increase it’s timeout.
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 20;
/**
 * Gets a local identifier that is independent of the object id assigned by
 * PostgreSql which will be consistent across tests.
 *
 * Just a concatenation of the PostgreSql object’s kind and name. For
 * attributes we also include the number.
 */
var getLocalId = function (pgObject) {
    if (pgObject.kind === 'attribute')
        return pgObject.kind + "-" + pgObject.name + "-" + pgObject.num;
    return pgObject.kind + "-" + pgObject.name;
};
/**
 * A utility for the following `format` function that creates a helper to
 * replace certain properties with their local id equivalents (see
 * `getLocalId` above).
 */
var withLocalIds = function (properties) { return function (pgObject) {
    var pgObjectLocalIds = {};
    for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
        var property = properties_1[_i];
        if (pgObject[property] != null)
            pgObjectLocalIds[property] = getLocalId(pgObject);
    }
    return Object.assign({}, pgObject, pgObjectLocalIds);
}; };
/**
 * A utility function to help sort arrays. Almost identical to the Lodash
 * `_.sortBy` function.
 */
var sortBy = function (getKey) { return function (a, b) {
    var aKey = getKey(a);
    var bKey = getKey(b);
    if (aKey > bKey)
        return 1;
    if (aKey < bKey)
        return -1;
    return 0;
}; };
/**
 * Formats a `PgCatalog` object into a form that is easily snapshotable by
 * Jest. This gives us all the benefits of snapshot testing.
 */
var format = function (catalog) { return ({
    namespaces: Array.from(catalog._namespaces.values())
        .map(function (namespace) { return Object.assign({}, namespace, {
        id: namespace.name,
    }); })
        .sort(sortBy(function (_a) {
        var id = _a.id;
        return id;
    })),
    classes: Array.from(catalog._classes.values())
        .map(function (klass) { return Object.assign({}, klass, {
        id: klass.name,
        namespaceId: catalog.getNamespace(klass.namespaceId) ? catalog.getNamespace(klass.namespaceId).name : '__external__',
        typeId: catalog.getType(klass.typeId).name,
    }); })
        .sort(sortBy(function (_a) {
        var id = _a.id;
        return id;
    })),
    attributes: Array.from(catalog._attributes.values())
        .map(function (attribute) { return Object.assign({}, attribute, {
        classId: catalog.getClass(attribute.classId).name,
        typeId: catalog.getType(attribute.typeId).name,
    }); })
        .sort(sortBy(function (_a) {
        var classId = _a.classId, num = _a.num;
        return classId + "-" + num;
    })),
    types: Array.from(catalog._types.values())
        .map(function (type) { return Object.assign({}, type, {
        id: type.name,
        namespaceId: catalog.getNamespace(type.namespaceId) ? catalog.getNamespace(type.namespaceId).name : null,
        classId: type.classId ? catalog.assertGetClass(type.classId).name : null,
        domainBaseTypeId: type.domainBaseTypeId ? catalog.assertGetType(type.domainBaseTypeId).name : null,
        rangeSubTypeId: type.rangeSubTypeId ? catalog.assertGetType(type.rangeSubTypeId).name : null,
        arrayItemTypeId: type.arrayItemTypeId ? catalog.assertGetType(type.arrayItemTypeId).name : null,
    }); })
        .filter(function (namespace) { return Boolean(namespace.namespaceId); })
        .sort(sortBy(function (_a) {
        var id = _a.id;
        return id;
    })),
    constraints: Array.from(catalog._constraints)
        .map(function (constraint) { return Object.assign({}, constraint, {
        classId: catalog.getClass(constraint.classId).name,
        foreignClassId: constraint.foreignClassId ? catalog.getClass(constraint.foreignClassId).name : null,
    }); }),
    procedure: Array.from(catalog._procedures)
        .map(function (procedure) { return Object.assign({}, procedure, {
        namespaceId: catalog.getNamespace(procedure.namespaceId).name,
        returnTypeId: catalog.getType(procedure.returnTypeId).name,
        argTypeIds: procedure.argTypeIds.map(function (typeId) { return catalog.getType(typeId).name; }),
    }); })
        .sort(sortBy(function (_a) {
        var name = _a.name, argTypeIds = _a.argTypeIds;
        return name + "-" + argTypeIds.join('-');
    })),
}); };
test('will get everything needed in an introspection', withPgClient_1.default(function (client) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var _a, _b, _c, _d;
    return tslib_1.__generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = expect;
                _c = format;
                return [4 /*yield*/, introspectDatabase_1.default(client, ['a', 'b', 'c'])];
            case 1:
                _a.apply(void 0, [_c.apply(void 0, [_e.sent()])]).toMatchSnapshot();
                return [2 /*return*/];
        }
    });
}); }));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50cm9zcGVjdERhdGFiYXNlLXRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcG9zdGdyZXMvaW50cm9zcGVjdGlvbi9fX3Rlc3RzX18vaW50cm9zcGVjdERhdGFiYXNlLXRlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLGlCQTRHQTs7QUE1R0Esc0VBQWdFO0FBRWhFLDREQUFzRDtBQUV0RCx1REFBdUQ7QUFDdkQsT0FBTyxDQUFDLHdCQUF3QixHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFFNUM7Ozs7OztHQU1HO0FBQ0gsSUFBTSxVQUFVLEdBQUcsVUFBQSxRQUFRO0lBQ3pCLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEtBQUssV0FBVyxDQUFDO1FBQ2hDLE1BQU0sQ0FBSSxRQUFRLENBQUMsSUFBSSxTQUFJLFFBQVEsQ0FBQyxJQUFJLFNBQUksUUFBUSxDQUFDLEdBQUssQ0FBQTtJQUU1RCxNQUFNLENBQUksUUFBUSxDQUFDLElBQUksU0FBSSxRQUFRLENBQUMsSUFBTSxDQUFBO0FBQzVDLENBQUMsQ0FBQTtBQUVEOzs7O0dBSUc7QUFDSCxJQUFNLFlBQVksR0FBRyxVQUFBLFVBQVUsSUFBSSxPQUFBLFVBQUEsUUFBUTtJQUN6QyxJQUFNLGdCQUFnQixHQUFHLEVBQUUsQ0FBQTtJQUUzQixHQUFHLENBQUMsQ0FBbUIsVUFBVSxFQUFWLHlCQUFVLEVBQVYsd0JBQVUsRUFBVixJQUFVO1FBQTVCLElBQU0sUUFBUSxtQkFBQTtRQUNqQixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxDQUFDO1lBQzdCLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtLQUFBO0lBRXJELE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQTtBQUN0RCxD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