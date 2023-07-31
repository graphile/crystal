# jest-serializer-graphql-schema

[![GitHub Sponsors](https://img.shields.io/github/sponsors/benjie?color=ff69b4&label=github%20sponsors)](https://github.com/sponsors/benjie)
[![Patreon sponsor button](https://img.shields.io/badge/sponsor-via%20Patreon-orange.svg)](https://patreon.com/benjie)
[![Discord chat room](https://img.shields.io/discord/489127045289476126.svg)](http://discord.gg/graphile)
[![Follow](https://img.shields.io/badge/twitter-@GraphileHQ-blue.svg)](https://twitter.com/GraphileHQ)

A serializer for doing
[snapshot testing](https://jestjs.io/docs/en/snapshot-testing) of
[GraphQL schemas](https://graphql.org/learn/schema/) using the
[Jest](https://jestjs.io/) testing framework.

This serializer only works on instances of the `GraphQLSchema` class exported
from [`graphql-js`](https://github.com/graphql/graphql-js). It does _not_ work
on <abbr title="abstract syntax tree">AST</abbr> objects.

<!-- SPONSORS_BEGIN -->

## Crowd-funded open-source software

To help us develop this software sustainably under the MIT license, we ask all
individuals and businesses that use it to help support its ongoing maintenance
and development via sponsorship.

### [Click here to find out more about sponsors and sponsorship.](https://www.graphile.org/sponsor/)

And please give some love to our featured sponsors 🤩:

<table><tr>
<td align="center"><a href="https://www.the-guild.dev/"><img src="https://graphile.org/images/sponsors/theguild.png" width="90" height="90" alt="The Guild" /><br />The Guild</a> *</td>
<td align="center"><a href="https://dovetailapp.com/"><img src="https://graphile.org/images/sponsors/dovetail.png" width="90" height="90" alt="Dovetail" /><br />Dovetail</a> *</td>
<td align="center"><a href="https://qwick.com/"><img src="https://graphile.org/images/sponsors/qwick.png" width="90" height="90" alt="Qwick" /><br />Qwick</a> *</td>
<td align="center"><a href="https://www.netflix.com/"><img src="https://graphile.org/images/sponsors/Netflix.png" width="90" height="90" alt="Netflix" /><br />Netflix</a> *</td>
</tr><tr>
<td align="center"><a href=""><img src="https://graphile.org/images/sponsors/chadf.png" width="90" height="90" alt="Chad Furman" /><br />Chad Furman</a> *</td>
<td align="center"><a href="https://stellate.co/"><img src="https://graphile.org/images/sponsors/Stellate.png" width="90" height="90" alt="Stellate" /><br />Stellate</a> *</td>
<td align="center"><a href="https://www.accenture.com/"><img src="https://graphile.org/images/sponsors/accenture.svg" width="90" height="90" alt="Accenture" /><br />Accenture</a> *</td>
</tr></table>

<em>\* Sponsors the entire Graphile suite</em>

<!-- SPONSORS_END -->

# Install

First, add this package as a devDependency:

```bash
# With npm
npm install --save-dev jest-serializer-graphql-schema

# With yarn
yarn add --dev jest-serializer-graphql-schema
```

Next, update your `package.json` file to
[let Jest know about the serializer](https://jestjs.io/docs/en/configuration#snapshotserializers-array-string):

```json
"jest": {
  "snapshotSerializers": ["jest-serializer-graphql-schema"]
}
```

# Simple Example

This test introspects the [Pokemon GraphQL API](https://graphql-pokemon.now.sh/)
to verify that the schema is consistent.

```ts
import fetch from "node-fetch";
import {
  getIntrospectionQuery,
  IntrospectionQuery,
  buildClientSchema,
} from "graphql";

const getSchema = async (url: string) => {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({ query: getIntrospectionQuery() }),
    headers: { "Content-Type": "application/json" },
  });
  const result = await (response.json() as Promise<{
    data: IntrospectionQuery;
  }>);
  return buildClientSchema(result.data);
};

test("Pokemon GraphQL API has a consistent schema", async () => {
  const schema = await getSchema("https://graphql-pokemon.now.sh");
  expect(schema).toMatchSnapshot();
});
```

This test will produce the following snapshot:

```graphql
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`Pokemon GraphQL API has a consistent schema 1`] = `
"""Represents a Pokémon's attack types"""
type Attack {
  """The name of this Pokémon attack"""
  name: String

  """The type of this Pokémon attack"""
  type: String

  """The damage of this Pokémon attack"""
  damage: Int
}

"""Represents a Pokémon"""
type Pokemon {
  """The ID of an object"""
  id: ID!

  """The identifier of this Pokémon"""
  number: String

  """The name of this Pokémon"""
  name: String

  """The minimum and maximum weight of this Pokémon"""
  weight: PokemonDimension

  """The minimum and maximum weight of this Pokémon"""
  height: PokemonDimension

  """The classification of this Pokémon"""
  classification: String

  """The type(s) of this Pokémon"""
  types: [String]

  """The type(s) of Pokémons that this Pokémon is resistant to"""
  resistant: [String]

  """The attacks of this Pokémon"""
  attacks: PokemonAttack

  """The type(s) of Pokémons that this Pokémon weak to"""
  weaknesses: [String]
  fleeRate: Float

  """The maximum CP of this Pokémon"""
  maxCP: Int

  """The evolutions of this Pokémon"""
  evolutions: [Pokemon]

  """The evolution requirements of this Pokémon"""
  evolutionRequirements: PokemonEvolutionRequirement

  """The maximum HP of this Pokémon"""
  maxHP: Int
  image: String
}

"""Represents a Pokémon's attack types"""
type PokemonAttack {
  """The fast attacks of this Pokémon"""
  fast: [Attack]

  """The special attacks of this Pokémon"""
  special: [Attack]
}

"""Represents a Pokémon's dimensions"""
type PokemonDimension {
  """The minimum value of this dimension"""
  minimum: String

  """The maximum value of this dimension"""
  maximum: String
}

"""Represents a Pokémon's requirement to evolve"""
type PokemonEvolutionRequirement {
  """The amount of candy to evolve"""
  amount: Int

  """The name of the candy to evolve"""
  name: String
}

"""Query any Pokémon by number or name"""
type Query {
  query: Query
  pokemons(first: Int!): [Pokemon]
  pokemon(id: String, name: String): Pokemon
}

`;
```

# Sorting Schemas

Note that by default, schemas are _not_ sorted before serialization. This means
that if the content of the schema is reordered, your snapshot test will fail. If
you don't care about the order of the content of your schema, sort your schema
before calling `.toMatchSnapshot()`, like this:

```ts
import { lexicographicSortSchema } from "graphql";

test("Pokemon GraphQL API has a consistent schema", async () => {
  const schema = await getSchema("https://graphql-pokemon.now.sh");
  expect(lexicographicSortSchema(schema)).toMatchSnapshot();
});
```
