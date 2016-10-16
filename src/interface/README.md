# Abstract Data Interface
PostGraphQL would eventually like to support more than just PostgreSQL and GraphQL. Perhaps maybe MySQL and REST. So in order to do this we need a type system that is sufficiently expressive to describe all of the best features of PostgreSQL that we want to expose in PostGraphQL, but also flexible enough to be (eventually) used with different databases. In this document we’ll discuss the high level designs for this interface.

## Types
The abstract data interface is based off of a type system. That type system may be found in the `type` folder. This type system is similar to that of Haskell or TypeScript’s and intends to completely describe any form of data that may be produced by a database. From a traditional relational database perspective one of the foundational types in this system may be “row.” Instead, our type system is based off of objects. This is because a relational database “row” may be just as easily be described as an object, and in PostgreSQL composite custom types may also be described as an object (note, PostgreSQL JSON types are not considered objects because in PostgreSQL, the JSON type is untyped).

Throughout the code base we use the term “type” and “value.” A “value” may have an associated “type.” So for example, a value may be `2` and its type would be `number`. Not every value has a type, and a value could have one or more types. Type checking is done with a function defined by the type. If a value passes that function’s test the value is of that type.

## Collections
Instead of using the relational database term “table” or the PostgreSQL term “class,” this interface abstracts the idea of a table into a collection. This way views, materialized views, foreign data tables, and more may all be considered a collection. Any list of typed values is a collection. Note that every value in a collection must be a part of the same type.

### Collection Key
A collection may have zero to many keys. A collection key represents a unique identifier of value’s in a collection. Say there is a collection of people with a unique id and a unique email address. That person collection would have two collection keys, one for the id and one for the email address.

A collection may also specify a single primary key. This primary key will be used as the main way to access a value in the collection. In our person collection example, the primary key would be the unique id.

You may use a collection key to read/update/delete single values at a time.

## Relations
A relation is a static definition of a relationship between the values of two collections. See the `Relation.ts` source file for more information.
