"use strict";
var _this = this;
var tslib_1 = require("tslib");
var withPgClient_1 = require("../../../../__tests__/utils/withPgClient");
var introspection_1 = require("../../../introspection");
var utils_1 = require("../../../utils");
var pgClientFromContext_ts_1 = require("../../pgClientFromContext.ts");
var PgCollection_1 = require("../PgCollection");
var PgCollectionKey_1 = require("../PgCollectionKey");
// This test suite can be flaky. Increase it’s timeout.
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 20;
var pgCatalogPromise = withPgClient_1.default(function (client) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, introspection_1.introspectDatabase(client, ['a', 'b', 'c'])];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); })();
var createContext = function (client) {
    return (_a = {}, _a[pgClientFromContext_ts_1.$$pgClient] = client, _a);
    var _a;
};
function withCollectionKeys(fn) {
    var _this = this;
    return function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _this = this;
        var pgCatalog;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, pgCatalogPromise];
                case 1:
                    pgCatalog = _a.sent();
                    return [4 /*yield*/, withPgClient_1.default(function (client) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var options, collectionKey1, collectionKey2;
                            return tslib_1.__generator(this, function (_a) {
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
                                return [2 /*return*/, {
                                        client: client,
                                        collectionKey1: collectionKey1,
                                        collectionKey2: collectionKey2,
                                    }];
                            });
                        }); })];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    }); };
}
test('name will be a concatenation of the attribute names with “and”', withCollectionKeys(function (_a) {
    var collectionKey1 = _a.collectionKey1, collectionKey2 = _a.collectionKey2;
    expect(collectionKey1.name).toBe('person_id_1_and_person_id_2');
    expect(collectionKey2.name).toBe('email');
}));
test('type will have fields for all of the respective attributes', withCollectionKeys(function (_a) {
    var collectionKey1 = _a.collectionKey1, collectionKey2 = _a.collectionKey2;
    expect(Array.from(collectionKey1.keyType.fields.keys())).toEqual(['person_id_1', 'person_id_2']);
    expect(Array.from(collectionKey2.keyType.fields.keys())).toEqual(['email']);
}));
test('read will get single values from a table', withCollectionKeys(function (_a) {
    var client = _a.client, collectionKey1 = _a.collectionKey1, collectionKey2 = _a.collectionKey2;
    return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
    });
}));
test('update will change values from a table', withCollectionKeys(function (_a) {
    var client = _a.client, collectionKey1 = _a.collectionKey1, collectionKey2 = _a.collectionKey2;
    return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
    });
}));
test('update fails when trying to patch a field that does not exist', withCollectionKeys(function (_a) {
    var client = _a.client, collectionKey1 = _a.collectionKey1, collectionKey2 = _a.collectionKey2;
    return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
    });
}));
test('update fails when trying to update a value that does not exist', withCollectionKeys(function (_a) {
    var client = _a.client, collectionKey1 = _a.collectionKey1, collectionKey2 = _a.collectionKey2;
    return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
    });
}));
test('delete will delete things from the database', withCollectionKeys(function (_a) {
    var client = _a.client, collectionKey1 = _a.collectionKey1, collectionKey2 = _a.collectionKey2;
    return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
    });
}));
test('delete fails when trying to remove a value that does not exist', withCollectionKeys(function (_a) {
    var client = _a.client, collectionKey1 = _a.collectionKey1, collectionKey2 = _a.collectionKey2;
    return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
    });
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGdDb2xsZWN0aW9uS2V5LXRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvcG9zdGdyZXMvaW52ZW50b3J5L2NvbGxlY3Rpb24vX190ZXN0c19fL1BnQ29sbGVjdGlvbktleS10ZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxpQkE2UUE7O0FBN1FBLHlFQUFtRTtBQUNuRSx3REFBMkQ7QUFDM0Qsd0NBQTRDO0FBQzVDLHVFQUF5RDtBQUN6RCxnREFBMEM7QUFDMUMsc0RBQWdEO0FBRWhELHVEQUF1RDtBQUN2RCxPQUFPLENBQUMsd0JBQXdCLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUU1QyxJQUFNLGdCQUFnQixHQUFHLHNCQUFZLENBQUMsVUFBTSxNQUFNOzs7b0JBQ3pDLHFCQUFNLGtDQUFrQixDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBQTtvQkFBeEQsc0JBQU8sU0FBaUQsRUFBQTs7O0tBQ3pELENBQUMsRUFBRSxDQUFBO0FBRUosSUFBTSxhQUFhLEdBQUcsVUFBQSxNQUFNO0lBQUksT0FBQSxVQUFHLEdBQUMsbUNBQVUsSUFBRyxNQUFNLEtBQUc7O0FBQTFCLENBQTBCLENBQUE7QUFFMUQsNEJBQTRCLEVBQUU7SUFBOUIsaUJBMENDO0lBekNDLE1BQU0sQ0FBQzs7Ozs7d0JBQ2EscUJBQU0sZ0JBQWdCLEVBQUE7O2dDQUF0QixTQUFzQjtvQkFDakMscUJBQU0sc0JBQVksQ0FBQyxVQUFNLE1BQU07Z0NBQzlCLE9BQU8sRUFJUCxjQUFjLEVBY2QsY0FBYzs7MENBbEJKO29DQUNkLGdCQUFnQixFQUFFLElBQUksR0FBRyxFQUFFO2lDQUM1QjtpREFFc0IsSUFBSSx5QkFBZSxDQUN4QyxJQUFJLHNCQUFZLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxjQUFjLENBQUMs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LENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQy9FLGNBQWMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUNqRixjQUFjLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDL0UsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQy9FLGNBQWMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUMvRSxjQUFjLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDL0UsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDMUUsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDMUUsY0FBYyxDQUFD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