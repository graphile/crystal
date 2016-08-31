const {
  Catalog,
  CollectionKey,
  Relation,
  BasicObjectType,
  BasicObjectField,
  NullableType,
  AliasType,
  EnumType,
  integerType,
  stringType,
} = require('../')

const MockCollection = require('./MockCollection')
const MockPaginator = require('./MockPaginator')

const catalog = new Catalog()

module.exports = catalog

const emailType = new AliasType('email', stringType)

const personType =
  new BasicObjectType('person')
    .addField(new BasicObjectField('id', integerType))
    .addField(new BasicObjectField('name', stringType))
    .addField(new BasicObjectField('email', emailType))
    .addField(new BasicObjectField('firstName', new NullableType(stringType)))
    .addField(new BasicObjectField('lastName', new NullableType(stringType)))
    .addField(new BasicObjectField('about', new NullableType(stringType)))

const personCollection =
  new MockCollection(catalog, 'people', personType)

catalog.addCollection(personCollection)

const personIdKey = new CollectionKey(personCollection, 'id', integerType)
const personNameKey = new CollectionKey(personCollection, 'name', stringType)
const personEmailKey = new CollectionKey(personCollection, 'email', stringType)

const personPaginator = new MockPaginator('people', personType)
const personOrderings = [
  { name: 'id-asc' }, { name: 'id-desc' },
  { name: 'name-asc' }, { name: 'name-desc' },
  { name: 'firstName-asc' }, { name: 'firstName-desc' },
  { name: 'lastName-asc' }, { name: 'lastName-desc' },
]

personPaginator
  .setOrderings(personOrderings)
  .setDefaultOrdering(personOrderings[0])

personCollection
  .addKey(personIdKey)
  .addKey(personNameKey)
  .addKey(personEmailKey)
  .setPrimaryKey(personIdKey)
  .setPaginator(personPaginator)

const postStatusType = new EnumType('postStatus', ['unpublished', 'published'])

const postType =
  new BasicObjectType('post')
    .addField(new BasicObjectField('id', integerType))
    .addField(new BasicObjectField('authorId', integerType))
    .addField(new BasicObjectField('status', postStatusType))
    .addField(new BasicObjectField('headline', stringType))
    .addField(new BasicObjectField('body', new NullableType(stringType)))

const postCollection =
  new MockCollection(catalog, 'posts', postType)

catalog.addCollection(postCollection)

const postIdKey = new CollectionKey(postCollection, 'id', integerType)

const postPaginator = new MockPaginator('posts', postType)

const postOrderings = [
  { name: 'id-asc' }, { name: 'id-desc' },
  { name: 'authorId-asc' }, { name: 'authorId-desc' },
  { name: 'status-asc' }, { name: 'status-desc' },
  { name: 'headline-asc' }, { name: 'headline-desc' },
]

postPaginator
  .setOrderings(postOrderings)
  .setDefaultOrdering(postOrderings[0])

postCollection
  .addKey(postIdKey)
  .setPrimaryKey(postIdKey)
  .setPaginator(postPaginator)

catalog
  .addRelation(new Relation('author', postCollection, personIdKey))
