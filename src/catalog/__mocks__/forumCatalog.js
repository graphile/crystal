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

const personCollection =
  new MockCollection(catalog, 'people', personType)

const personIdKey = new CollectionKey(personCollection, 'id', integerType)
const personNameKey = new CollectionKey(personCollection, 'name', stringType)
const personEmailKey = new CollectionKey(personCollection, 'email', stringType)

personCollection.setPrimaryKey(personIdKey)

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

const postIdKey = new CollectionKey(postCollection, 'id', integerType)

postCollection.setPrimaryKey(postIdKey)

catalog
  .addRelation(new Relation('author', postCollection, personIdKey))
