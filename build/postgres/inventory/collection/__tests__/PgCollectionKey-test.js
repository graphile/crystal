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
/**
 * @type {PgCollectionKey}
 */
let collectionKey1, collectionKey2;
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
        { 'person_id_1': 3, 'person_id_2': 2, 'extra': null },
        null,
        { 'person_id_1': 1, 'person_id_2': 2, 'extra': null },
        { 'person_id_1': 3, 'person_id_2': 1, 'extra': null },
        null,
        { 'person_id_1': 2, 'person_id_2': 1, 'extra': null },
        { 'id': 2, 'name': 'Sara Smith', 'email': 'sara.smith@email.com', 'about': null, 'created_at': values[6].get('created_at') },
        { 'id': 1, 'name': 'John Smith', 'email': 'john.smith@email.com', 'about': null, 'created_at': values[7].get('created_at') },
        null,
        { 'id': 3, 'name': 'Budd Deey', 'email': 'budd.deey@email.com', 'about': 'Just a friendly human', 'created_at': values[9].get('created_at') },
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
        { 'person_id_1': 3, 'person_id_2': 3, 'extra': null },
        { 'id': 1, 'name': 'John Smith', email: 'john.smith@email.com', 'about': 'Yolo swag!', 'created_at': values[1].get('created_at') },
        { 'id': 2, 'name': 'Sarah Smith', email: 'sarah.smith@email.com', 'about': 'Yolo swag!', 'created_at': values[2].get('created_at') },
        { 'id': 3, 'name': 'Budd Deey', email: 'budd.deey@email.com', 'about': null, 'created_at': values[3].get('created_at') },
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
        { 'person_id_1': 1, 'person_id_2': 2, 'extra': null },
        { 'person_id_1': 2, 'person_id_2': 1, 'extra': null },
        { 'person_id_1': 3, 'person_id_2': 1, 'extra': null },
        { 'id': 1, 'name': 'John Smith', 'email': 'john.smith@email.com', 'about': null, 'created_at': values[3].get('created_at') },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGdDb2xsZWN0aW9uS2V5LXRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvcG9zdGdyZXMvaW52ZW50b3J5L2NvbGxlY3Rpb24vX190ZXN0c19fL1BnQ29sbGVjdGlvbktleS10ZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLCtCQUF5QiwwQ0FDekIsQ0FBQyxDQURrRTtBQUNuRSxnQ0FBbUMsd0JBQ25DLENBQUMsQ0FEMEQ7QUFDM0Qsd0JBQTRCLGdCQUM1QixDQUFDLENBRDJDO0FBQzVDLHlDQUEyQiw4QkFDM0IsQ0FBQyxDQUR3RDtBQUN6RCwrQkFBeUIsaUJBQ3pCLENBQUMsQ0FEeUM7QUFDMUMsa0NBQTRCLG9CQUc1QixDQUFDLENBSCtDO0FBRWhELHVEQUF1RDtBQUN2RCxPQUFPLENBQUMsd0JBQXdCLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUU1Qzs7R0FFRztBQUNILElBQUksY0FBYyxFQUFFLGNBQWMsQ0FBQTtBQUVsQyxNQUFNLGFBQWEsR0FBRyxNQUFNLElBQUksQ0FBQyxFQUFFLENBQUMsbUNBQVUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUE7QUFFMUQsVUFBVSxDQUFDLHNCQUFZLENBQUMsQ0FBTSxNQUFNO0lBQ2xDLE1BQU0sU0FBUyxHQUFHLE1BQU0sa0NBQWtCLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFBO0lBRW5FLE1BQU0sT0FBTyxHQUFHO1FBQ2QsZ0JBQWdCLEVBQUUsSUFBSSxHQUFHLEVBQUU7S0FDNUIsQ0FBQTtJQUVELGNBQWMsR0FBRyxJQUFJLHlCQUFlLENBQ2xDLElBQUksc0JBQVksQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLGNBQWMsQ0FBQyxDQUFDLEVBQ25GO1FBQ0UsSUFBSSxFQUFFLFlBQVk7UUFDbEIs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Q0FBQyxDQUFDLENBQUM7UUFDL0UsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0UsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0UsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0UsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxRSxjQUFjLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFFLGNBQWMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsMEJBQTBCLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUUsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUMxRSxDQUFDLENBQUE7SUFFRiwwRUFBMEU7SUFDMUUsMkNBQTJDO0lBQzNDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBRTlDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssSUFBSSxLQUFLLElBQUksSUFBSSxHQUFHLElBQUksR0FBRyxtQkFBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFDN0UsRUFBRSxhQUFhLEVBQUUsQ0FBQyxFQUFFLGFBQWEsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRTtRQUNyRCxJQUFJO1FBQ0osRUFBRSxhQUFhLEVBQUUsQ0FBQyxFQUFFLGFBQWEsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRTtRQUNyRCxFQUFFLGFBQWEsRUFBRSxDQUFDLEVBQUUsYUFBYSxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFO1FBQ3JELElBQUk7UUFDSixFQUFFLGFBQWEsRUFBRSxDQUFDLEVBQUUsYUFBYSxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFO1FBQ3JELEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFO1FBQzVILEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFO1FBQzVILElBQUk7UUFDSixFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFO0tBQzlJLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQSxDQUFDLENBQUMsQ0FBQTtBQUVILElBQUksQ0FBQyx3Q0FBd0MsRUFBRSxzQkFBWSxDQUFDLENBQU0sTUFBTTtJQUN0RSxNQUFNLE9BQU8sR0FBRyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUE7SUFFckMsTUFBTSxNQUFNLENBQUMsS0FBSyxDQUFDOzs7OztHQUtsQixDQUFDLENBQUE7SUFFRixNQUFNLE1BQU0sQ0FBQyxLQUFLLENBQUM7OztHQUdsQixDQUFDLENBQUE7SUFFRixNQUFNLE1BQU0sR0FBRyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUM7UUFDL0IsY0FBYyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEgsY0FBYyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoSCxjQUFjLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsYUFBYSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsdUJBQXVCLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0ssY0FBYyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUN4RyxDQUFDLENBQUE7SUFFRixNQUFNLGNBQWMsR0FBRztRQUNyQixFQUFFLGFBQWEsRUFBRSxDQUFDLEVBQUUsYUFBYSxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFO1FBQ3JELEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxzQkFBc0IsRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFO1FBQ2xJLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSx1QkFBdUIsRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFO1FBQ3BJLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxxQkFBcUIsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFO0tBQ3pILENBQUE7SUFFRCxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBVyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUE7SUFFdkQsTUFBTSxhQUFhLEdBQUcsTUFBTSxNQUFNLENBQUMsS0FBSyxDQUFDOzs7O0dBSXhDLENBQUMsQ0FBQTtJQUVGLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUE7QUFDaEYsQ0FBQyxDQUFBLENBQUMsQ0FBQyxDQUFBO0FBRUgsSUFBSSxDQUFDLCtEQUErRCxFQUFFLHNCQUFZLENBQUMsQ0FBTSxNQUFNO0lBQzdGLE1BQU0sT0FBTyxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUVyQyxJQUFJLENBQUM7UUFDSCxNQUFNLGNBQWMsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDNUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUMxQixDQUNBO0lBQUEsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNiLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLDRGQUE0RixDQUFDLENBQUE7SUFDMUgsQ0FBQztBQUNILENBQUMsQ0FBQSxDQUFDLENBQUMsQ0FBQTtBQUVILElBQUksQ0FBQyxnRUFBZ0UsRUFBRSxzQkFBWSxDQUFDLENBQU0sTUFBTTtJQUM5RixNQUFNLE9BQU8sR0FBRyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUE7SUFFckMsSUFBSSxDQUFDO1FBQ0gsTUFBTSxjQUFjLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLDBCQUEwQixDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDcEgsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUMxQixDQUNBO0lBQUEsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNiLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLG1HQUFtRyxDQUFDLENBQUE7SUFDakksQ0FBQztBQUNILENBQUMsQ0FBQSxDQUFDLENBQUMsQ0FBQTtBQUVILElBQUksQ0FBQyw2Q0FBNkMsRUFBRSxzQkFBWSxDQUFDLENBQU0sTUFBTTtJQUMzRSxNQUFNLE9BQU8sR0FBRyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUE7SUFFckMsTUFBTSxNQUFNLENBQUMsS0FBSyxDQUFDOzs7OztHQUtsQixDQUFDLENBQUE7SUFFRixNQUFNLE1BQU0sQ0FBQyxLQUFLLENBQUM7Ozs7OztHQU1sQixDQUFDLENBQUE7SUFFRixNQUFNLFdBQVcsR0FBRzs7OztHQUluQixDQUFBO0lBRUQsTUFBTSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsR0FBRyxNQUFNLE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUE7SUFFN0QsTUFBTSxNQUFNLEdBQUcsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDO1FBQy9CLGNBQWMsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pGLGNBQWMsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pGLGNBQWMsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pGLGNBQWMsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDN0UsQ0FBQyxDQUFBO0lBRUYsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUJBQVcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1FBQ3RDLEVBQUUsYUFBYSxFQUFFLENBQUMsRUFBRSxhQUFhLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUU7UUFDckQsRUFBRSxhQUFhLEVBQUUsQ0FBQyxFQUFFLGFBQWEsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRTtRQUNyRCxFQUFFLGFBQWEsRUFBRSxDQUFDLEVBQUUsYUFBYSxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFO1FBQ3JELEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFO0tBQzdILENBQUMsQ0FBQTtJQUVGLE1BQU0sQ0FBQyxDQUFDLE1BQU0sTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUMxRyxDQUFDLENBQUEsQ0FBQyxDQUFDLENBQUE7QUFFSCxJQUFJLENBQUMsZ0VBQWdFLEVBQUUsc0JBQVksQ0FBQyxDQUFNLE1BQU07SUFDOUYsTUFBTSxPQUFPLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBRXJDLElBQUksQ0FBQztRQUNILE1BQU0sY0FBYyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUN2RixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQzFCLENBQ0E7SUFBQSxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ2IsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsc0ZBQXNGLENBQUMsQ0FBQTtJQUNwSCxDQUFDO0FBQ0gsQ0FBQyxDQUFBLENBQUMsQ0FBQyxDQUFBIn0=