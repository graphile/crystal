/* tslint:disable no-any */
"use strict";
var interface_1 = require("../../../interface");
var unimplementedFn = function () { throw new Error('Unimplemented.'); };
var emailType = {
    kind: 'ALIAS',
    name: 'email',
    baseType: interface_1.stringType,
    isTypeOf: unimplementedFn,
};
var personType = new interface_1.BasicObjectType({
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
var personIdKey = {
    collection: null,
    name: 'id',
    keyType: interface_1.integerType,
    getKeyFromValue: unimplementedFn,
    read: unimplementedFn,
    update: unimplementedFn,
    delete: unimplementedFn,
};
var personNameKey = {
    collection: null,
    name: 'name',
    keyType: interface_1.stringType,
    getKeyFromValue: unimplementedFn,
    read: unimplementedFn,
};
var personEmailKey = {
    collection: null,
    name: 'email',
    keyType: interface_1.stringType,
    getKeyFromValue: unimplementedFn,
    read: unimplementedFn,
    update: unimplementedFn,
};
var personOrderings = new Map([
    ['id-asc', { readPage: unimplementedFn }],
    ['id-desc', { readPage: unimplementedFn }],
    ['name-asc', { readPage: unimplementedFn }],
    ['name-desc', { readPage: unimplementedFn }],
    ['firstName-asc', { readPage: unimplementedFn }],
    ['firstName-desc', { readPage: unimplementedFn }],
    ['lastName-asc', { readPage: unimplementedFn }],
    ['lastName-desc', { readPage: unimplementedFn }],
]);
var personPaginator = {
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
var postStatusType = {
    kind: 'ENUM',
    name: 'postStatus',
    variants: new Map([['unpublished', 'unpublished'], ['published', 'published']]),
    isTypeOf: unimplementedFn,
};
var postType = new interface_1.BasicObjectType({
    name: 'post',
    fields: new Map([
        ['id', { type: interface_1.integerType }],
        ['authorId', { type: interface_1.integerType }],
        ['status', { type: postStatusType }],
        ['headline', { type: interface_1.stringType }],
        ['body', { type: new interface_1.NullableType(interface_1.stringType) }],
    ]),
});
var postIdKey = {
    collection: null,
    name: 'id',
    keyType: interface_1.integerType,
    getKeyFromValue: unimplementedFn,
    read: unimplementedFn,
    update: unimplementedFn,
    delete: unimplementedFn,
};
var postOrderings = new Map([
    ['id-asc', { readPage: unimplementedFn }],
    ['id-desc', { readPage: unimplementedFn }],
    ['authorId-asc', { readPage: unimplementedFn }],
    ['authorId-desc', { readPage: unimplementedFn }],
    ['status-asc', { readPage: unimplementedFn }],
    ['status-desc', { readPage: unimplementedFn }],
    ['headline-asc', { readPage: unimplementedFn }],
    ['headline-desc', { readPage: unimplementedFn }],
]);
var postPaginator = {
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
var authorRelation = {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ydW1JbnZlbnRvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZ3JhcGhxbC9fX3Rlc3RzX18vZml4dHVyZXMvZm9ydW1JbnZlbnRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsMkJBQTJCOztBQUUzQixnREFhMkI7QUFFM0IsSUFBTSxlQUFlLEdBQVEsY0FBUSxNQUFNLElBQUksS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUEsQ0FBQyxDQUFDLENBQUE7QUFFeEUsSUFBTSxTQUFTLEdBQXNCO0lBQ25DLElBQUksRUFBRSxPQUFPO0lBQ2IsSUFBSSxFQUFFLE9BQU87SUFDYixRQUFRLEVBQUUsc0JBQVU7SUFDcEIsUUFBUSxFQUFFLGVBQWU7Q0FDMUIsQ0FBQTtBQUVELElBQU0sVUFBVSxHQUFHLElBQUksMkJBQWUsQ0FBQztJQUNyQyxJQUFJLEVBQUUsUUFBUTtJQUNkLE1BQU0sRUFBRSxJQUFJLEdBQUcsQ0FBdUM7UUFDcEQsQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsdUJBQVcsRUFBRSxDQUFDO1FBQzdCLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLHNCQUFVLEVBQUUsQ0FBQztRQUM5QixDQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsQ0FBQztRQUM5QixDQUFDLFdBQVcsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLHdCQUFZLENBQUMsc0JBQVUsQ0FBQyxFQUFFLENBQUM7UUFDckQsQ0FBQyxVQUFVLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSx3QkFBWSxDQUFDLHNCQUFVLENBQUMsRUFBRSxDQUFDO1FBQ3BELENBQUMsT0FBTyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksd0JBQVksQ0FBQyxzQkFBVSxDQUFDLEVBQUUsQ0FBQztLQUNsRCxDQUFDO0NBQ0gsQ0FBQyxDQUFBO0FBRUYsSUFBTSxXQUFXLEdBQWlEO0lBQ2hFLFVBQVUsRUFBRSxJ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