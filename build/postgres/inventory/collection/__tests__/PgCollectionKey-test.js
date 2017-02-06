"use strict";
var _this = this;
var tslib_1 = require("tslib");
var withPgClient_1 = require("../../../__tests__/fixtures/withPgClient");
var introspection_1 = require("../../../introspection");
var utils_1 = require("../../../utils");
var pgClientFromContext_ts_1 = require("../../pgClientFromContext.ts");
var PgCollection_1 = require("../PgCollection");
var PgCollectionKey_1 = require("../PgCollectionKey");
// This test suite can be flaky. Increase it’s timeout.
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 20;
/** @type {PgCollectionKey} */
var collectionKey1;
/** @type {PgCollectionKey} */
var collectionKey2;
var createContext = function (client) {
    return (_a = {}, _a[pgClientFromContext_ts_1.$$pgClient] = client, _a);
    var _a;
};
beforeEach(withPgClient_1.default(function (client) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var pgCatalog, options;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, introspection_1.introspectDatabase(client, ['a', 'b', 'c'])];
            case 1:
                pgCatalog = _a.sent();
                options = {
                    renameAttributes: new Map(),
                };
                collectionKey1 = new PgCollectionKey_1.default(new PgCollection_1.default(options, pgCatalog, pgCatalog.getClassByName('c', 'compound_key')), {
                    kind: 'constraint',
                    name: 'compound_key_pkey',
                    type: 'p',
                    classId: pgCatalog.getClassByName('c', 'compound_key').id,
                    keyAttributeNums: [
                        pgCatalog.getAttributeByName('c', 'compound_key', 'person_id_1').num,
                        pgCatalog.getAttributeByName('c', 'compound_key', 'person_id_2').num,
                    ],
                });
                collectionKey2 = new PgCollectionKey_1.default(new PgCollection_1.default(options, pgCatalog, pgCatalog.getClassByName('c', 'person')), {
                    kind: 'constraint',
                    name: 'person_unique_email',
                    type: 'u',
                    classId: pgCatalog.getClassByName('c', 'person').id,
                    keyAttributeNums: [
                        pgCatalog.getAttributeByName('c', 'person', 'email').num,
                    ],
                });
                return [2 /*return*/];
        }
    });
}); }));
test('name will be a concatenation of the attribute names with “and”', function () {
    expect(collectionKey1.name).toBe('person_id_1_and_person_id_2');
    expect(collectionKey2.name).toBe('email');
});
test('type will have fields for all of the respective attributes', function () {
    expect(Array.from(collectionKey1.keyType.fields.keys())).toEqual(['person_id_1', 'person_id_2']);
    expect(Array.from(collectionKey2.keyType.fields.keys())).toEqual(['email']);
});
test('read will get single values from a table', withPgClient_1.default(function (client) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var context, values;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                context = createContext(client);
                return [4 /*yield*/, client.query("\n    insert into c.person (id, name, email, about) values\n      (1, 'John Smith', 'john.smith@email.com', null),\n      (2, 'Sara Smith', 'sara.smith@email.com', null),\n      (3, 'Budd Deey', 'budd.deey@email.com', 'Just a friendly human');\n  ")];
            case 1:
                _a.sent();
                return [4 /*yield*/, client.query("\n    insert into c.compound_key (person_id_1, person_id_2) values\n      (1, 2),\n      (2, 1),\n      (3, 2),\n      (3, 1);\n  ")];
            case 2:
                _a.sent();
                client.query.mockClear();
                return [4 /*yield*/, Promise.all([
                        collectionKey1.read(context, new Map([['person_id_1', 3], ['person_id_2', 2]])),
                        collectionKey1.read(context, new Map([['person_id_1', 2], ['person_id_2', 200]])),
                        collectionKey1.read(context, new Map([['person_id_1', 1], ['person_id_2', 2]])),
                        collectionKey1.read(context, new Map([['person_id_1', 3], ['person_id_2', 1]])),
                        collectionKey1.read(context, new Map([['person_id_1', 3], ['person_id_2', 3]])),
                        collectionKey1.read(context, new Map([['person_id_2', 1], ['person_id_1', 2]])),
                        collectionKey2.read(context, new Map([['email', 'sara.smith@email.com']])),
                        collectionKey2.read(context, new Map([['email', 'john.smith@email.com']])),
                        collectionKey2.read(context, new Map([['email', 'does.not.exist@email.com']])),
                        collectionKey2.read(context, new Map([['email', 'budd.deey@email.com']])),
                    ])];
            case 3:
                values = _a.sent();
                // Ensure that even though we did a lot of reads, we only actually queried
                // the database twice. Thanks `dataloader`!
                expect(client.query.mock.calls.length).toBe(2);
                expect(values.map(function (value) { return value == null ? null : utils_1.mapToObject(value); })).toEqual([
                    { 'person_id_1': 3, 'person_id_2': 2, extra: null },
                    null,
                    { 'person_id_1': 1, 'person_id_2': 2, extra: null },
                    { 'person_id_1': 3, 'person_id_2': 1, extra: null },
                    null,
                    { 'person_id_1': 2, 'person_id_2': 1, extra: null },
                    { id: 2, name: 'Sara Smith', email: 'sara.smith@email.com', about: null, created_at: values[6].get('created_at') },
                    { id: 1, name: 'John Smith', email: 'john.smith@email.com', about: null, created_at: values[7].get('created_at') },
                    null,
                    { id: 3, name: 'Budd Deey', email: 'budd.deey@email.com', about: 'Just a friendly human', created_at: values[9].get('created_at') },
                ]);
                return [2 /*return*/];
        }
    });
}); }));
test('update will change values from a table', withPgClient_1.default(function (client) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var context, values, expectedValues, pgQueryResult;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                context = createContext(client);
                return [4 /*yield*/, client.query("\n    insert into c.person (id, name, email, about) values\n      (1, 'John Smith', 'john.smith@email.com', null),\n      (2, 'Sara Smith', 'sara.smith@email.com', null),\n      (3, 'Budd Deey', 'budd.deey@email.com', 'Just a friendly human');\n  ")];
            case 1:
                _a.sent();
                return [4 /*yield*/, client.query("\n    insert into c.compound_key (person_id_1, person_id_2) values\n      (3, 2);\n  ")];
            case 2:
                _a.sent();
                return [4 /*yield*/, Promise.all([
                        collectionKey1.update(context, new Map([['person_id_1', 3], ['person_id_2', 2]]), new Map([['person_id_2', 3]])),
                        collectionKey2.update(context, new Map([['email', 'john.smith@email.com']]), new Map([['about', 'Yolo swag!']])),
                        collectionKey2.update(context, new Map([['email', 'sara.smith@email.com']]), new Map([['name', 'Sarah Smith'], ['email', 'sarah.smith@email.com'], ['about', 'Yolo swag!']])),
                        collectionKey2.update(context, new Map([['email', 'budd.deey@email.com']]), new Map([['about', null]])),
                    ])];
            case 3:
                values = _a.sent();
                expectedValues = [
                    { 'person_id_1': 3, 'person_id_2': 3, extra: null },
                    { id: 1, name: 'John Smith', email: 'john.smith@email.com', about: 'Yolo swag!', created_at: values[1].get('created_at') },
                    { id: 2, name: 'Sarah Smith', email: 'sarah.smith@email.com', about: 'Yolo swag!', created_at: values[2].get('created_at') },
                    { id: 3, name: 'Budd Deey', email: 'budd.deey@email.com', about: null, created_at: values[3].get('created_at') },
                ];
                expect(values.map(utils_1.mapToObject)).toEqual(expectedValues);
                return [4 /*yield*/, client.query("\n    select row_to_json(x) as object from c.compound_key as x\n    union all\n    select row_to_json(x) as object from c.person as x\n  ")];
            case 4:
                pgQueryResult = _a.sent();
                expect(pgQueryResult.rows.map(function (_a) {
                    var object = _a.object;
                    return object;
                })).toEqual(expectedValues);
                return [2 /*return*/];
        }
    });
}); }));
test('update fails when trying to patch a field that does not exist', withPgClient_1.default(function (client) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var context, error_1;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                context = createContext(client);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, collectionKey1.update(context, new Map([['person_id_1', 1], ['person_id_2', 2]]), new Map([['a', 1]]))];
            case 2:
                _a.sent();
                expect(true).toBe(false);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                expect(error_1.message).toBe('Cannot update field named \'a\' because it does not exist in collection \'compound_keys\'.');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); }));
test('update fails when trying to update a value that does not exist', withPgClient_1.default(function (client) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var context, error_2;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                context = createContext(client);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, collectionKey2.update(context, new Map([['email', 'does.not.exist@email.com']]), new Map([['about', 'xxxx']]))];
            case 2:
                _a.sent();
                expect(true).toBe(false);
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                expect(error_2.message).toBe('No values were updated in collection \'people\' using key \'email\' because no values were found.');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); }));
test('delete will delete things from the database', withPgClient_1.default(function (client) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var context, selectQuery, initialRows, values, _a, _b;
    return tslib_1.__generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                context = createContext(client);
                return [4 /*yield*/, client.query("\n    insert into c.person (id, name, email, about) values\n      (1, 'John Smith', 'john.smith@email.com', null),\n      (2, 'Sara Smith', 'sara.smith@email.com', null),\n      (3, 'Budd Deey', 'budd.deey@email.com', 'Just a friendly human');\n  ")];
            case 1:
                _c.sent();
                return [4 /*yield*/, client.query("\n    insert into c.compound_key (person_id_1, person_id_2) values\n      (1, 2),\n      (2, 1),\n      (3, 2),\n      (3, 1);\n  ")];
            case 2:
                _c.sent();
                selectQuery = "\n    select row_to_json(x) as object from c.compound_key as x\n    union all\n    select row_to_json(x) as object from c.person as x\n  ";
                return [4 /*yield*/, client.query(selectQuery)];
            case 3:
                initialRows = (_c.sent()).rows;
                return [4 /*yield*/, Promise.all([
                        collectionKey1.delete(context, new Map([['person_id_1', 1], ['person_id_2', 2]])),
                        collectionKey1.delete(context, new Map([['person_id_1', 2], ['person_id_2', 1]])),
                        collectionKey1.delete(context, new Map([['person_id_1', 3], ['person_id_2', 1]])),
                        collectionKey2.delete(context, new Map([['email', 'john.smith@email.com']])),
                    ])];
            case 4:
                values = _c.sent();
                expect(values.map(utils_1.mapToObject)).toEqual([
                    { 'person_id_1': 1, 'person_id_2': 2, extra: null },
                    { 'person_id_1': 2, 'person_id_2': 1, extra: null },
                    { 'person_id_1': 3, 'person_id_2': 1, extra: null },
                    { id: 1, name: 'John Smith', email: 'john.smith@email.com', about: null, created_at: values[3].get('created_at') },
                ]);
                _a = expect;
                return [4 /*yield*/, client.query(selectQuery)];
            case 5:
                _a.apply(void 0, [(_c.sent()).rows]).toEqual([initialRows[2], initialRows[5], initialRows[6]]);
                return [2 /*return*/];
        }
    });
}); }));
test('delete fails when trying to remove a value that does not exist', withPgClient_1.default(function (client) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var context, error_3;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                context = createContext(client);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, collectionKey1.delete(context, new Map([['person_id_1', 1], ['person_id_2', 2]]))];
            case 2:
                _a.sent();
                expect(true).toBe(false);
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                expect(error_3.message).toBe('No values were deleted in collection \'compound_keys\' because no values were found.');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); }));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGdDb2xsZWN0aW9uS2V5LXRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvcG9zdGdyZXMvaW52ZW50b3J5L2NvbGxlY3Rpb24vX190ZXN0c19fL1BnQ29sbGVjdGlvbktleS10ZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxpQkF3T0E7O0FBeE9BLHlFQUFtRTtBQUNuRSx3REFBMkQ7QUFDM0Qsd0NBQTRDO0FBQzVDLHVFQUF5RDtBQUN6RCxnREFBMEM7QUFDMUMsc0RBQWdEO0FBRWhELHVEQUF1RDtBQUN2RCxPQUFPLENBQUMsd0JBQXdCLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUU1Qyw4QkFBOEI7QUFDOUIsSUFBSSxjQUFjLENBQUE7QUFFbEIsOEJBQThCO0FBQzlCLElBQUksY0FBYyxDQUFBO0FBRWxCLElBQU0sYUFBYSxHQUFHLFVBQUEsTUFBTTtJQUFJLE9BQUEsVUFBRyxHQUFDLG1DQUFVLElBQUcsTUFBTSxLQUFHOztBQUExQixDQUEwQixDQUFBO0FBRTFELFVBQVUsQ0FBQyxzQkFBWSxDQUFDLFVBQU0sTUFBTTttQkFHNUIsT0FBTzs7O29CQUZLLHFCQUFNLGtDQUFrQixDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBQTs7NEJBQWpELFNBQWlEOzBCQUVuRDtvQkFDZCxnQkFBZ0IsRUFBRSxJQUFJLEdBQUcsRUFBRTtpQkFDNUI7Z0JBRUQsY0FBYyxHQUFHLElBQUkseUJBQWUsQ0FDbEMsSUFBSSxzQkFBWSxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUUsY0FBYyxDQUFDLENBQUMsRUFDbkY7b0JBQ0UsSUFBSSxFQUFFLFlBQVk7b0JBQ2xCLElBQUksRUFBRSxtQkFBbUI7b0JBQ3pCLElBQUksRUFBRSxHQUFHO29CQUNULE9BQU8sRUFBRSxTQUFTLENBQUMsY0FB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