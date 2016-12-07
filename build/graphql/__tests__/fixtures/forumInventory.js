/* tslint:disable no-any */
"use strict";
const interface_1 = require('../../../interface');
const unimplementedFn = () => { throw new Error('Unimplemented.'); };
const emailType = new interface_1.AliasType({
    name: 'email',
    baseType: interface_1.stringType,
});
const personType = new interface_1.ObjectType({
    name: 'person',
    fields: new Map([
        ['id', { type: interface_1.integerType }],
        ['name', { type: interface_1.stringType }],
        ['email', { type: emailType }],
        ['firstName', { type: new interface_1.NullableType(interface_1.stringType) }],
        ['lastName', { type: new interface_1.NullableType(interface_1.stringType) }],
        ['about', { type: new interface_1.NullableType(interface_1.stringType) }],
    ]),
});
const personIdKey = {
    collection: null,
    name: 'id',
    keyType: interface_1.integerType,
    getKeyFromValue: unimplementedFn,
    read: unimplementedFn,
    update: unimplementedFn,
    delete: unimplementedFn,
};
const personNameKey = {
    collection: null,
    name: 'name',
    keyType: interface_1.stringType,
    getKeyFromValue: unimplementedFn,
    read: unimplementedFn,
};
const personEmailKey = {
    collection: null,
    name: 'email',
    keyType: interface_1.stringType,
    getKeyFromValue: unimplementedFn,
    read: unimplementedFn,
    update: unimplementedFn,
};
const personOrderings = new Map([
    ['id-asc', { readPage: unimplementedFn }],
    ['id-desc', { readPage: unimplementedFn }],
    ['name-asc', { readPage: unimplementedFn }],
    ['name-desc', { readPage: unimplementedFn }],
    ['firstName-asc', { readPage: unimplementedFn }],
    ['firstName-desc', { readPage: unimplementedFn }],
    ['lastName-asc', { readPage: unimplementedFn }],
    ['lastName-desc', { readPage: unimplementedFn }],
]);
const personPaginator = {
    name: 'people',
    itemType: personType,
    orderings: personOrderings,
    defaultOrdering: personOrderings.get('name-asc'),
    count: unimplementedFn,
};
exports.personCollection = {
    name: 'people',
    type: personType,
    keys: [personIdKey, personNameKey, personEmailKey],
    primaryKey: personIdKey,
    paginator: personPaginator,
    create: unimplementedFn,
};
Object.assign(personIdKey, { collection: exports.personCollection });
Object.assign(personNameKey, { collection: exports.personCollection });
Object.assign(personEmailKey, { collection: exports.personCollection });
const postStatusType = new interface_1.EnumType({
    name: 'postStatus',
    variants: new Set(['unpublished', 'published']),
});
const postType = new interface_1.ObjectType({
    name: 'post',
    fields: new Map([
        ['id', { type: interface_1.integerType }],
        ['authorId', { type: interface_1.integerType }],
        ['status', { type: postStatusType }],
        ['headline', { type: interface_1.stringType }],
        ['body', { type: new interface_1.NullableType(interface_1.stringType) }],
    ]),
});
const postIdKey = {
    collection: null,
    name: 'id',
    keyType: interface_1.integerType,
    getKeyFromValue: unimplementedFn,
    read: unimplementedFn,
    update: unimplementedFn,
    delete: unimplementedFn,
};
const postOrderings = new Map([
    ['id-asc', { readPage: unimplementedFn }],
    ['id-desc', { readPage: unimplementedFn }],
    ['authorId-asc', { readPage: unimplementedFn }],
    ['authorId-desc', { readPage: unimplementedFn }],
    ['status-asc', { readPage: unimplementedFn }],
    ['status-desc', { readPage: unimplementedFn }],
    ['headline-asc', { readPage: unimplementedFn }],
    ['headline-desc', { readPage: unimplementedFn }],
]);
const postPaginator = {
    name: 'posts',
    itemType: postType,
    orderings: postOrderings,
    defaultOrdering: postOrderings.get('headline-asc'),
    count: unimplementedFn,
};
exports.postCollection = {
    name: 'posts',
    type: postType,
    keys: [postIdKey],
    primaryKey: postIdKey,
    paginator: postPaginator,
    create: unimplementedFn,
};
Object.assign(postIdKey, { collection: exports.postCollection });
const authorRelation = {
    name: 'author',
    tailCollection: exports.postCollection,
    headCollectionKey: personIdKey,
    getHeadKeyFromTailValue: unimplementedFn,
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (new interface_1.Inventory()
    .addCollection(exports.personCollection)
    .addCollection(exports.postCollection)
    .addRelation(authorRelation));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ydW1JbnZlbnRvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZ3JhcGhxbC9fX3Rlc3RzX18vZml4dHVyZXMvZm9ydW1JbnZlbnRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsMkJBQTJCOztBQUUzQiw0QkFhTyxvQkFFUCxDQUFDLENBRjBCO0FBRTNCLE1BQU0sZUFBZSxHQUFRLFFBQVEsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBLENBQUMsQ0FBQyxDQUFBO0FBRXhFLE1BQU0sU0FBUyxHQUFHLElBQUkscUJBQVMsQ0FBQztJQUM5QixJQUFJLEVBQUUsT0FBTztJQUNiLFFBQVEsRUFBRSxzQkFBVTtDQUNyQixDQUFDLENBQUE7QUFFRixNQUFNLFVBQVUsR0FBRyxJQUFJLHNCQUFVLENBQUM7SUFDaEMsSUFBSSxFQUFFLFFBQVE7SUFDZCxNQUFNLEVBQUUsSUFBSSxHQUFHLENBQWtDO1FBQy9DLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLHVCQUFXLEVBQUUsQ0FBQztRQUM3QixDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxzQkFBVSxFQUFFLENBQUM7UUFDOUIsQ0FBQyxPQUFPLEVBQUUsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLENBQUM7UUFDOUIsQ0FBQyxXQUFXLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSx3QkFBWSxDQUFDLHNCQUFVLENBQUMsRUFBRSxDQUFDO1FBQ3JELENBQUMsVUFBVSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksd0JBQVksQ0FBQyxzQkFBVSxDQUFDLEVBQUUsQ0FBQztRQUNwRCxDQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLHdCQUFZLENBQUMsc0JBQVUsQ0FBQyxFQUFFLENBQUM7S0FDbEQsQ0FBQztDQUNILENBQUMsQ0FBQTtBQUVGLE1BQU0sV0FBVyxHQUEwQjtJQUN6QyxVQUFVLEVBQUUsSUFBVztJ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