import {
  Inventory,
  BasicObjectType,
  BasicObjectField,
  NullableType,
  AliasType,
  EnumType,
  integerType,
  stringType,
} from '../../../interface'

const emailType = new AliasType('email', stringType)

const personType =
  new BasicObjectType('person')
    .addField(new BasicObjectField('id', integerType))
    .addField(new BasicObjectField('name', stringType))
    .addField(new BasicObjectField('email', emailType))
    .addField(new BasicObjectField('firstName', new NullableType(stringType)))
    .addField(new BasicObjectField('lastName', new NullableType(stringType)))
    .addField(new BasicObjectField('about', new NullableType(stringType)))

const personIdKey = { name: 'id', type: integerType }
const personNameKey = { name: 'name', type: stringType }
const personEmailKey = { name: 'email', type: stringType }

const personOrderings = [
  { name: 'id-asc' }, { name: 'id-desc' },
  { name: 'name-asc' }, { name: 'name-desc' },
  { name: 'firstName-asc' }, { name: 'firstName-desc' },
  { name: 'lastName-asc' }, { name: 'lastName-desc' },
]

const personPaginator = {
  name: 'people',
  type: personType,
  orderings: new Set(personOrderings),
  defaultOrdering: personOrderings[0],
}

const personCollection = {
  name: 'people',
  type: personType,
  keys: new Set([personIdKey, personNameKey, personEmailKey]),
  primaryKey: personIdKey,
  paginator: personPaginator,
}

const postStatusType = new EnumType('postStatus', ['unpublished', 'published'])

const postType =
  new BasicObjectType('post')
    .addField(new BasicObjectField('id', integerType))
    .addField(new BasicObjectField('authorId', integerType))
    .addField(new BasicObjectField('status', postStatusType))
    .addField(new BasicObjectField('headline', stringType))
    .addField(new BasicObjectField('body', new NullableType(stringType)))

const postIdKey = { name: 'id', type: integerType }

const postOrderings = [
  { name: 'id-asc' }, { name: 'id-desc' },
  { name: 'authorId-asc' }, { name: 'authorId-desc' },
  { name: 'status-asc' }, { name: 'status-desc' },
  { name: 'headline-asc' }, { name: 'headline-desc' },
]

const postPaginator = {
  name: 'posts',
  type: postType,
  orderings: new Set(postOrderings),
  defaultOrdering: postOrderings[0],
}

const postCollection = {
  name: 'posts',
  type: postType,
  keys: new Set([postIdKey]),
  primaryKey: postIdKey,
  paginator: postPaginator,
}

const authorRelation = {
  name: 'author',
  tailCollection: postCollection,
  headCollection: personCollection,
  headCollectionKey: personIdKey,
}

export default (
  new Inventory()
    .addCollection(personCollection)
    .addCollection(postCollection)
    .addRelation(authorRelation)
)
