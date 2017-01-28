/* tslint:disable no-any */

import {
  Inventory,
  Condition,
  Collection,
  CollectionKey,
  Paginator,
  Relation,
  NullableType,
  AliasType,
  EnumType,
  BasicObjectType,
  integerType,
  stringType,
} from '../../../interface'

const unimplementedFn: any = () => { throw new Error('Unimplemented.') }

const emailType: AliasType<string> = {
  kind: 'ALIAS',
  name: 'email',
  baseType: stringType,
  isTypeOf: unimplementedFn,
}

const personType = new BasicObjectType({
  name: 'person',
  fields: new Map<string, BasicObjectType.Field<mixed>>([
    ['id', { type: integerType }],
    ['name', { type: stringType }],
    ['email', { type: emailType }],
    ['firstName', { type: new NullableType(stringType) }],
    ['lastName', { type: new NullableType(stringType) }],
    ['about', { type: new NullableType(stringType) }],
  ]),
})

const personIdKey: CollectionKey<BasicObjectType.Value, number> = {
  collection: null as any,
  name: 'id',
  keyType: integerType,
  getKeyFromValue: unimplementedFn,
  read: unimplementedFn,
  update: unimplementedFn,
  delete: unimplementedFn,
}

const personNameKey: CollectionKey<BasicObjectType.Value, string> = {
  collection: null as any,
  name: 'name',
  keyType: stringType,
  getKeyFromValue: unimplementedFn,
  read: unimplementedFn,
}

const personEmailKey: CollectionKey<BasicObjectType.Value, string> = {
  collection: null as any,
  name: 'email',
  keyType: stringType,
  getKeyFromValue: unimplementedFn,
  read: unimplementedFn,
  update: unimplementedFn,
}

const personOrderings = new Map<string, Paginator.Ordering<Condition, BasicObjectType.Value, mixed>>([
  ['id-asc', { readPage: unimplementedFn }],
  ['id-desc', { readPage: unimplementedFn }],
  ['name-asc', { readPage: unimplementedFn }],
  ['name-desc', { readPage: unimplementedFn }],
  ['firstName-asc', { readPage: unimplementedFn }],
  ['firstName-desc', { readPage: unimplementedFn }],
  ['lastName-asc', { readPage: unimplementedFn }],
  ['lastName-desc', { readPage: unimplementedFn }],
])

const personPaginator: Paginator<Condition, BasicObjectType.Value> = {
  name: 'people',
  itemType: personType,
  orderings: personOrderings,
  defaultOrdering: personOrderings.get('name-asc')!,
  count: unimplementedFn,
}

export const personCollection: Collection<BasicObjectType.Value> = {
  name: 'people',
  type: personType,
  keys: [personIdKey, personNameKey, personEmailKey],
  primaryKey: personIdKey,
  paginator: personPaginator,
  create: unimplementedFn,
}

Object.assign(personIdKey, { collection: personCollection })
Object.assign(personNameKey, { collection: personCollection })
Object.assign(personEmailKey, { collection: personCollection })

const postStatusType: EnumType<string> = {
  kind: 'ENUM',
  name: 'postStatus',
  variants: new Map([['unpublished', 'unpublished'], ['published', 'published']]),
  isTypeOf: unimplementedFn,
}

const postType = new BasicObjectType({
  name: 'post',
  fields: new Map<string, BasicObjectType.Field<mixed>>([
    ['id', { type: integerType }],
    ['authorId', { type: integerType }],
    ['status', { type: postStatusType }],
    ['headline', { type: stringType }],
    ['body', { type: new NullableType(stringType) }],
  ]),
})

const postIdKey: CollectionKey<BasicObjectType.Value, number> = {
  collection: null as any,
  name: 'id',
  keyType: integerType,
  getKeyFromValue: unimplementedFn,
  read: unimplementedFn,
  update: unimplementedFn,
  delete: unimplementedFn,
}

const postOrderings = new Map<string, Paginator.Ordering<Condition, BasicObjectType.Value, mixed>>([
  ['id-asc', { readPage: unimplementedFn }],
  ['id-desc', { readPage: unimplementedFn }],
  ['authorId-asc', { readPage: unimplementedFn }],
  ['authorId-desc', { readPage: unimplementedFn }],
  ['status-asc', { readPage: unimplementedFn }],
  ['status-desc', { readPage: unimplementedFn }],
  ['headline-asc', { readPage: unimplementedFn }],
  ['headline-desc', { readPage: unimplementedFn }],
])

const postPaginator: Paginator<Condition, BasicObjectType.Value> = {
  name: 'posts',
  itemType: postType,
  orderings: postOrderings,
  defaultOrdering: postOrderings.get('headline-asc')!,
  count: unimplementedFn,
}

export const postCollection: Collection<BasicObjectType.Value> = {
  name: 'posts',
  type: postType,
  keys: [postIdKey],
  primaryKey: postIdKey,
  paginator: postPaginator,
  create: unimplementedFn,
}

Object.assign(postIdKey, { collection: postCollection })

const authorRelation: Relation<BasicObjectType.Value, BasicObjectType.Value, number> = {
  name: 'author',
  tailCollection: postCollection,
  headCollectionKey: personIdKey,
  getHeadKeyFromTailValue: unimplementedFn,
}

export default (
  new Inventory()
    .addCollection(personCollection)
    .addCollection(postCollection)
    .addRelation(authorRelation)
)
