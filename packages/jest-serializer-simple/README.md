# jest-serializer-simple

A Jest serializer to simplify your snapshots.

Sometimes you just want to print an object or a string without all the escapes
and `Object [null prototype] {` annotations. When you want that, this is a
simple solution for it.

## Usage:

```
yarn add jest-serializer-simple
```

Then add it to your Jest config:

```js
module.exports = {
  testEnvironment: "node",
  snapshotSerializers: [`jest-serializer-simple`],
  //...
};
```

To tell Jest that you want the object to be printed simply, you must wrap it in
an object with just the `__` key: `{ __: YOUR_VALUE_HERE }`, for example:

```js
expect({ __: data }).toMatchInlineSnapshot(`
  {
    forums: [
      {
        name: 'Cats',
      },
      {
        name: 'Dogs',
      },
      {
        name: 'Postgres',
      },
    ],
  }
`);
```
