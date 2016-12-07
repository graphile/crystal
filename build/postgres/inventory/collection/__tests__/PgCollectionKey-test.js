"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const withPgClient_1 = require('../../../__tests__/fixtures/withPgClient');
const introspection_1 = require('../../../introspection');
const utils_1 = require('../../../utils');
const pgClientFromContext_ts_1 = require('../../pgClientFromContext.ts');
const PgCollection_1 = require('../PgCollection');
const PgCollectionKey_1 = require('../PgCollectionKey');
// This test suite can be flaky. Increase it’s timeout.
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 20;
/** @type {PgCollectionKey} */
let collectionKey1;
/** @type {PgCollectionKey} */
let collectionKey2;
const createContext = client => ({ [pgClientFromContext_ts_1.$$pgClient]: client });
beforeEach(withPgClient_1.default((client) => __awaiter(this, void 0, void 0, function* () {
    const pgCatalog = yield introspection_1.introspectDatabase(client, ['a', 'b', 'c']);
    const options = {
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
})));
test('name will be a concatenation of the attribute names with “and”', () => {
    expect(collectionKey1.name).toBe('person_id_1_and_person_id_2');
    expect(collectionKey2.name).toBe('email');
});
test('type will have fields for all of the respective attributes', () => {
    expect(Array.from(collectionKey1.keyType.fields.keys())).toEqual(['person_id_1', 'person_id_2']);
    expect(Array.from(collectionKey2.keyType.fields.keys())).toEqual(['email']);
});
test('read will get single values from a table', withPgClient_1.default((client) => __awaiter(this, void 0, void 0, function* () {
    const context = createContext(client);
    yield client.query(`
    insert into c.person (id, name, email, about) values
      (1, 'John Smith', 'john.smith@email.com', null),
      (2, 'Sara Smith', 'sara.smith@email.com', null),
      (3, 'Budd Deey', 'budd.deey@email.com', 'Just a friendly human');
  `);
    yield client.query(`
    insert into c.compound_key (person_id_1, person_id_2) values
      (1, 2),
      (2, 1),
      (3, 2),
      (3, 1);
  `);
    client.query.mockClear();
    const values = yield Promise.all([
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
    ]);
    // Ensure that even though we did a lot of reads, we only actually queried
    // the database twice. Thanks `dataloader`!
    expect(client.query.mock.calls.length).toBe(2);
    expect(values.map(value => value == null ? null : utils_1.mapToObject(value))).toEqual([
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
})));
test('update will change values from a table', withPgClient_1.default((client) => __awaiter(this, void 0, void 0, function* () {
    const context = createContext(client);
    yield client.query(`
    insert into c.person (id, name, email, about) values
      (1, 'John Smith', 'john.smith@email.com', null),
      (2, 'Sara Smith', 'sara.smith@email.com', null),
      (3, 'Budd Deey', 'budd.deey@email.com', 'Just a friendly human');
  `);
    yield client.query(`
    insert into c.compound_key (person_id_1, person_id_2) values
      (3, 2);
  `);
    const values = yield Promise.all([
        collectionKey1.update(context, new Map([['person_id_1', 3], ['person_id_2', 2]]), new Map([['person_id_2', 3]])),
        collectionKey2.update(context, new Map([['email', 'john.smith@email.com']]), new Map([['about', 'Yolo swag!']])),
        collectionKey2.update(context, new Map([['email', 'sara.smith@email.com']]), new Map([['name', 'Sarah Smith'], ['email', 'sarah.smith@email.com'], ['about', 'Yolo swag!']])),
        collectionKey2.update(context, new Map([['email', 'budd.deey@email.com']]), new Map([['about', null]])),
    ]);
    const expectedValues = [
        { 'person_id_1': 3, 'person_id_2': 3, extra: null },
        { id: 1, name: 'John Smith', email: 'john.smith@email.com', about: 'Yolo swag!', created_at: values[1].get('created_at') },
        { id: 2, name: 'Sarah Smith', email: 'sarah.smith@email.com', about: 'Yolo swag!', created_at: values[2].get('created_at') },
        { id: 3, name: 'Budd Deey', email: 'budd.deey@email.com', about: null, created_at: values[3].get('created_at') },
    ];
    expect(values.map(utils_1.mapToObject)).toEqual(expectedValues);
    const pgQueryResult = yield client.query(`
    select row_to_json(x) as object from c.compound_key as x
    union all
    select row_to_json(x) as object from c.person as x
  `);
    expect(pgQueryResult.rows.map(({ object }) => object)).toEqual(expectedValues);
})));
test('update fails when trying to patch a field that does not exist', withPgClient_1.default((client) => __awaiter(this, void 0, void 0, function* () {
    const context = createContext(client);
    try {
        yield collectionKey1.update(context, new Map([['person_id_1', 1], ['person_id_2', 2]]), new Map([['a', 1]]));
        expect(true).toBe(false);
    }
    catch (error) {
        expect(error.message).toBe('Cannot update field named \'a\' because it does not exist in collection \'compound_keys\'.');
    }
})));
test('update fails when trying to update a value that does not exist', withPgClient_1.default((client) => __awaiter(this, void 0, void 0, function* () {
    const context = createContext(client);
    try {
        yield collectionKey2.update(context, new Map([['email', 'does.not.exist@email.com']]), new Map([['about', 'xxxx']]));
        expect(true).toBe(false);
    }
    catch (error) {
        expect(error.message).toBe('No values were updated in collection \'people\' using key \'email\' because no values were found.');
    }
})));
test('delete will delete things from the database', withPgClient_1.default((client) => __awaiter(this, void 0, void 0, function* () {
    const context = createContext(client);
    yield client.query(`
    insert into c.person (id, name, email, about) values
      (1, 'John Smith', 'john.smith@email.com', null),
      (2, 'Sara Smith', 'sara.smith@email.com', null),
      (3, 'Budd Deey', 'budd.deey@email.com', 'Just a friendly human');
  `);
    yield client.query(`
    insert into c.compound_key (person_id_1, person_id_2) values
      (1, 2),
      (2, 1),
      (3, 2),
      (3, 1);
  `);
    const selectQuery = `
    select row_to_json(x) as object from c.compound_key as x
    union all
    select row_to_json(x) as object from c.person as x
  `;
    const { rows: initialRows } = yield client.query(selectQuery);
    const values = yield Promise.all([
        collectionKey1.delete(context, new Map([['person_id_1', 1], ['person_id_2', 2]])),
        collectionKey1.delete(context, new Map([['person_id_1', 2], ['person_id_2', 1]])),
        collectionKey1.delete(context, new Map([['person_id_1', 3], ['person_id_2', 1]])),
        collectionKey2.delete(context, new Map([['email', 'john.smith@email.com']])),
    ]);
    expect(values.map(utils_1.mapToObject)).toEqual([
        { 'person_id_1': 1, 'person_id_2': 2, extra: null },
        { 'person_id_1': 2, 'person_id_2': 1, extra: null },
        { 'person_id_1': 3, 'person_id_2': 1, extra: null },
        { id: 1, name: 'John Smith', email: 'john.smith@email.com', about: null, created_at: values[3].get('created_at') },
    ]);
    expect((yield client.query(selectQuery)).rows).toEqual([initialRows[2], initialRows[5], initialRows[6]]);
})));
test('delete fails when trying to remove a value that does not exist', withPgClient_1.default((client) => __awaiter(this, void 0, void 0, function* () {
    const context = createContext(client);
    try {
        yield collectionKey1.delete(context, new Map([['person_id_1', 1], ['person_id_2', 2]]));
        expect(true).toBe(false);
    }
    catch (error) {
        expect(error.message).toBe('No values were deleted in collection \'compound_keys\' because no values were found.');
    }
})));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGdDb2xsZWN0aW9uS2V5LXRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvcG9zdGdyZXMvaW52ZW50b3J5L2NvbGxlY3Rpb24vX190ZXN0c19fL1BnQ29sbGVjdGlvbktleS10ZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLCtCQUF5QiwwQ0FDekIsQ0FBQyxDQURrRTtBQUNuRSxnQ0FBbUMsd0JBQ25DLENBQUMsQ0FEMEQ7QUFDM0Qsd0JBQTRCLGdCQUM1QixDQUFDLENBRDJDO0FBQzVDLHlDQUEyQiw4QkFDM0IsQ0FBQyxDQUR3RDtBQUN6RCwrQkFBeUIsaUJBQ3pCLENBQUMsQ0FEeUM7QUFDMUMsa0NBQTRCLG9CQUc1QixDQUFDLENBSCtDO0FBRWhELHVEQUF1RDtBQUN2RCxPQUFPLENBQUMsd0JBQXdCLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUU1Qyw4QkFBOEI7QUFDOUIsSUFBSSxjQUFjLENBQUE7QUFFbEIsOEJBQThCO0FBQzlCLElBQUksY0FBYyxDQUFBO0FBRWxCLE1BQU0sYUFBYSxHQUFHLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyxtQ0FBVSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQTtBQUUxRCxVQUFVLENBQUMsc0JBQVksQ0FBQyxDQUFNLE1BQU07SUFDbEMsTUFBTSxTQUFTLEdBQUcsTUFBTSxrQ0FBa0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUE7SUFFbkUsTUFBTSxPQUFPLEdBQUc7UUFDZCxnQkFBZ0IsRUFBRSxJQUFJLEdBQUcsRUFBRTtLQUM1QixDQUFBO0lBRUQsY0FBYyxHQUFHLElBQUkseUJBQWUsQ0FDbEMsSUFBSSxzQkFBWSxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUUsY0FBYyxDQUFDLENBQUMsRUFDbkY7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