import {
  Inventory,
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

const personOrderings = [
  { name: 'id-asc' }, { name: 'id-desc' },
  { name: 'name-asc' }, { name: 'name-desc' },
  { name: 'firstName-asc' }, { name: 'firstName-desc' },
  { name: 'lastName-asc' }, { name: 'lastName-desc' },
]

const personPaginator: Paginator<ObjectType.Value, Paginator.Ordering, mixed> = {
  name: 'people',
  type: personType,
  orderings: personOrderings,
  defaultOrdering: personOrderings[0],
  count: unimplementedFn,
  readPage: unimplementedFn,
}

const personCollection: Collection = {
  name: 'people',
  type: personType,
  keys: [personIdKey, personNameKey, personEmailKey],
  primaryKey: personIdKey,
  paginator: personPaginator,
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

const postOrderings = [
  { name: 'id-asc' }, { name: 'id-desc' },
  { name: 'authorId-asc' }, { name: 'authorId-desc' },
  { name: 'status-asc' }, { name: 'status-desc' },
  { name: 'headline-asc' }, { name: 'headline-desc' },
]

const postPaginator: Paginator<ObjectType.Value, Paginator.Ordering, mixed> = {
  name: 'posts',
  type: postType,
  orderings: postOrderings,
  defaultOrdering: postOrderings[0],
  count: unimplementedFn,
  readPage: unimplementedFn,
}

const postCollection: Collection = {
  name: 'posts',
  type: postType,
  keys: [postIdKey],
  primaryKey: postIdKey,
  paginator: postPaginator,
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
