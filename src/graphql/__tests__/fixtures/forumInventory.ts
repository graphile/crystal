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
  ObjectType,
  integerType,
  stringType,
} from '../../../interface'

const unimplementedFn: any = () => { throw new Error('Unimplemented.') }

const emailType = new AliasType({
  name: 'email',
  baseType: stringType,
})

const personType = new ObjectType({
  name: 'person',
  fields: new Map<string, ObjectType.Field<mixed>>([
    ['id', { type: integerType }],
    ['name', { type: stringType }],
    ['email', { type: emailType }],
    ['firstName', { type: new NullableType(stringType) }],
    ['lastName', { type: new NullableType(stringType) }],
    ['about', { type: new NullableType(stringType) }],
  ]),
})

const personIdKey: CollectionKey<number> = {
  collection: null as any,
  name: 'id',
  keyType: integerType,
  getKeyFromValue: unimplementedFn,
  read: unimplementedFn,
}

const personNameKey: CollectionKey<string> = {
  collection: null as any,
  name: 'name',
  keyType: stringType,
  getKeyFromValue: unimplementedFn,
  read: unimplementedFn,
}

const personEmailKey: CollectionKey<string> = {
  collection: null as any,
  name: 'email',
  keyType: stringType,
  getKeyFromValue: unimplementedFn,
  read: unimplementedFn,
}

const personOrderings = new Map(
  <Array<[string, Paginator.Ordering<Condition, ObjectType.Value, mixed>]>> [
    ['id-asc', { readPage: unimplementedFn }],
    ['id-desc', { readPage: unimplementedFn }],
    ['name-asc', { readPage: unimplementedFn }],
    ['name-desc', { readPage: unimplementedFn }],
    ['firstName-asc', { readPage: unimplementedFn }],
    ['firstName-desc', { readPage: unimplementedFn }],
    ['lastName-asc', { readPage: unimplementedFn }],
    ['lastName-desc', { readPage: unimplementedFn }],
  ]
)

const personPaginator: Paginator<Condition, ObjectType.Value> = {
  name: 'people',
  itemType: personType,
  orderings: personOrderings,
  defaultOrdering: personOrderings.get('name-asc')!,
  count: unimplementedFn,
}

export const personCollection: Collection = {
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

const postStatusType = new EnumType({
  name: 'postStatus',
  variants: new Set(['unpublished', 'published']),
})

const postType = new ObjectType({
  name: 'post',
  fields: new Map<string, ObjectType.Field<mixed>>([
    ['id', { type: integerType }],
    ['authorId', { type: integerType }],
    ['status', { type: postStatusType }],
    ['headline', { type: stringType }],
    ['body', { type: new NullableType(stringType) }],
  ]),
})

const postIdKey: CollectionKey<number> = {
  collection: null as any,
  name: 'id',
  keyType: integerType,
  getKeyFromValue: unimplementedFn,
  read: unimplementedFn,
}

const postOrderings = new Map(
  <Array<[string, Paginator.Ordering<Condition, ObjectType.Value, mixed>]>> [
    ['id-asc', { readPage: unimplementedFn }],
    ['id-desc', { readPage: unimplementedFn }],
    ['authorId-asc', { readPage: unimplementedFn }],
    ['authorId-desc', { readPage: unimplementedFn }],
    ['status-asc', { readPage: unimplementedFn }],
    ['status-desc', { readPage: unimplementedFn }],
    ['headline-asc', { readPage: unimplementedFn }],
    ['headline-desc', { readPage: unimplementedFn }],
  ]
)

const postPaginator: Paginator<Condition, ObjectType.Value> = {
  name: 'posts',
  itemType: postType,
  orderings: postOrderings,
  defaultOrdering: postOrderings.get('headline-asc')!,
  count: unimplementedFn,
}

export const postCollection: Collection = {
  name: 'posts',
  type: postType,
  keys: [postIdKey],
  primaryKey: postIdKey,
  paginator: postPaginator,
  create: unimplementedFn,
}

Object.assign(postIdKey, { collection: postCollection })

const authorRelation: Relation<number> = {
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
