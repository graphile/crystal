"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const withPgClient_1 = require('../../__tests__/fixtures/withPgClient');
const introspectDatabase_1 = require('../introspectDatabase');
// This test suite can be flaky. Increase it’s timeout.
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 20;
/**
 * Gets a local identifier that is independent of the object id assigned by
 * PostgreSql which will be consistent across tests.
 *
 * Just a concatenation of the PostgreSql object’s kind and name. For
 * attributes we also include the number.
 */
const getLocalId = pgObject => {
    if (pgObject.kind === 'attribute')
        return `${pgObject.kind}-${pgObject.name}-${pgObject.num}`;
    return `${pgObject.kind}-${pgObject.name}`;
};
/**
 * A utility for the following `format` function that creates a helper to
 * replace certain properties with their local id equivalents (see
 * `getLocalId` above).
 */
const withLocalIds = properties => pgObject => {
    const pgObjectLocalIds = {};
    for (const property of properties)
        if (pgObject[property] != null)
            pgObjectLocalIds[property] = getLocalId(pgObject);
    return Object.assign({}, pgObject, pgObjectLocalIds);
};
/**
 * A utility function to help sort arrays. Almost identical to the Lodash
 * `_.sortBy` function.
 */
const sortBy = getKey => (a, b) => {
    const aKey = getKey(a);
    const bKey = getKey(b);
    if (aKey > bKey)
        return 1;
    if (aKey < bKey)
        return -1;
    return 0;
};
/**
 * Formats a `PgCatalog` object into a form that is easily snapshotable by
 * Jest. This gives us all the benefits of snapshot testing.
 */
const format = catalog => ({
    namespaces: Array.from(catalog._namespaces.values())
        .map(namespace => Object.assign({}, namespace, {
        id: namespace.name,
    }))
        .sort(sortBy(({ id }) => id)),
    classes: Array.from(catalog._classes.values())
        .map(klass => Object.assign({}, klass, {
        id: klass.name,
        namespaceId: catalog.getNamespace(klass.namespaceId) ? catalog.getNamespace(klass.namespaceId).name : '__external__',
        typeId: catalog.getType(klass.typeId).name,
    }))
        .sort(sortBy(({ id }) => id)),
    attributes: Array.from(catalog._attributes.values())
        .map(attribute => Object.assign({}, attribute, {
        classId: catalog.getClass(attribute.classId).name,
        typeId: catalog.getType(attribute.typeId).name,
    }))
        .sort(sortBy(({ classId, num }) => `${classId}-${num}`)),
    types: Array.from(catalog._types.values())
        .map(type => Object.assign({}, type, {
        id: type.name,
        namespaceId: catalog.getNamespace(type.namespaceId) ? catalog.getNamespace(type.namespaceId).name : null,
        classId: type.classId ? catalog.assertGetClass(type.classId).name : null,
        domainBaseTypeId: type.domainBaseTypeId ? catalog.assertGetType(type.domainBaseTypeId).name : null,
        rangeSubTypeId: type.rangeSubTypeId ? catalog.assertGetType(type.rangeSubTypeId).name : null,
        arrayItemTypeId: type.arrayItemTypeId ? catalog.assertGetType(type.arrayItemTypeId).name : null,
    }))
        .filter(namespace => Boolean(namespace.namespaceId))
        .sort(sortBy(({ id }) => id)),
    constraints: Array.from(catalog._constraints)
        .map(constraint => Object.assign({}, constraint, {
        classId: catalog.getClass(constraint.classId).name,
        foreignClassId: constraint.foreignClassId ? catalog.getClass(constraint.foreignClassId).name : null,
    })),
    procedure: Array.from(catalog._procedures)
        .map(procedure => Object.assign({}, procedure, {
        namespaceId: catalog.getNamespace(procedure.namespaceId).name,
        returnTypeId: catalog.getType(procedure.returnTypeId).name,
        argTypeIds: procedure.argTypeIds.map(typeId => catalog.getType(typeId).name),
    }))
        .sort(sortBy(({ name, argTypeIds }) => `${name}-${argTypeIds.join('-')}`)),
});
test('will get everything needed in an introspection', withPgClient_1.default((client) => __awaiter(this, void 0, void 0, function* () {
    expect(format(yield introspectDatabase_1.default(client, ['a', 'b', 'c']))).toMatchSnapshot();
    // TODO: expect(format(await introspectDatabase(client, ['a']))).toMatchSnapshot()
})));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50cm9zcGVjdERhdGFiYXNlLXRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcG9zdGdyZXMvaW50cm9zcGVjdGlvbi9fX3Rlc3RzX18vaW50cm9zcGVjdERhdGFiYXNlLXRlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsK0JBQXlCLHVDQUN6QixDQUFDLENBRCtEO0FBRWhFLHFDQUErQix1QkFHL0IsQ0FBQyxDQUhxRDtBQUV0RCx1REFBdUQ7QUFDdkQsT0FBTyxDQUFDLHdCQUF3QixHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFFNUM7Ozs7OztHQU1HO0FBQ0gsTUFBTSxVQUFVLEdBQUcsUUFBUTtJQUN6QixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxLQUFLLFdBQVcsQ0FBQztRQUNoQyxNQUFNLENBQUMsR0FBRyxRQUFRLENBQUMsSUFBSSxJQUFJLFFBQVEsQ0FBQyxJQUFJLElBQUksUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFBO0lBRTVELE1BQU0sQ0FBQyxHQUFHLFFBQVEsQ0FBQyxJQUFJLElBQUksUUFBUSxDQUFDLElBQUksRUFBRSxDQUFBO0FBQzVDLENBQUMsQ0FBQTtBQUVEOzs7O0dBSUc7QUFDSCxNQUFNLFlBQVksR0FBRyxVQUFVLElBQUksUUFBUTtJQUN6QyxNQUFNLGdCQUFnQixHQUFHLEVBQUUsQ0FBQTtJQUUzQixHQUFHLENBQUMsQ0FBQyxNQUFNLFFBQVEsSUFBSSxVQUFVLENBQUM7UUFDaEMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUksQ0FBQztZQUM3QixnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUE7SUFFckQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFBO0FBQ3RELENBQUMsQ0FBQTtBQUVEOzs7R0FHRztBQUNILE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQzVCLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUN0QixNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDdEIsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7SUFDekIsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUMxQixNQUFNLENBQUMsQ0FBQyxDQUFBO0FBQ1YsQ0FBQyxDQUFBO0FBRUQ7OztHQUdHO0FBQ0gsTUFBTSxNQUFNLEdBQUcsT0FBTyxJQUFJLENBQUM7SUFDekIsVUFBVSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNqRCxHQUFHLENBQUMsU0FBUyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLFNBQVMsRUFBRTtRQUM3QyxFQUFFLEVBQUUsU0FBUyxDQUFDLElBQUk7S0FDbkIsQ0FBQyxDQUFDO1NBQ0YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7SUFFL0IsT0FBTyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUMzQyxHQUFHLENBQUMsS0FBSyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRTtRQUNyQyxFQUFFLEVBQUUsS0FBSyxDQUFDLElBQUk7UUFDZCxXQUFXLEVBQUUsT0FBTyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMs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