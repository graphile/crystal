Development
-----------

```
npm install -g lerna yarn
yarn
lerna bootstrap
```

GraphQL conflict
----------------

If you get an error like the below:

`GraphQL conflict for 'GraphQLObjectType' detected! Multiple versions of graphql exist in your node_modules?`

it means the peerDependencies have been installed locally in each package which is not what we want (we want them installed in the root `node_modules`.

To solve this, we need to re-bootstrap:

```
rm -Rf packages/*/node_modules
yarn
lerna bootstrap
```
