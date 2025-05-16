/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import { expect } from "chai";
import type { ExecutionResult } from "graphql";
import { it } from "mocha";

import { grafast } from "../../dist/index.js";
import { makeBaseArgs } from "./dcc-schema.js";

it("Load Carl's friends", async () => {
  const baseArgs = makeBaseArgs();
  const source = /* GraphQL */ `
    {
      crawler(id: 101) {
        id
        name
        ... on ActiveCrawler {
          species
          friends {
            id
            name
          }
        }
      }
    }
  `;
  const result = (await grafast({
    ...baseArgs,
    source,
  })) as ExecutionResult;
  if (result.errors) {
    console.dir(result.errors);
  }
  expect(result.errors).not.to.exist;
  expect(JSON.stringify(result.data, null, 2)).to.deep.equal(`\
{
  "crawler": {
    "id": 101,
    "name": "Carl",
    "species": "HUMAN",
    "friends": [
      {
        "id": 102,
        "name": "Princess Donut"
      },
      {
        "id": 103,
        "name": "Katia"
      },
      {
        "id": 104,
        "name": "Imani"
      },
      {
        "id": 105,
        "name": "Elle"
      },
      {
        "id": 301,
        "name": "Mordecai"
      }
    ]
  }
}`);
});

it("Load Donut's friends of friends", async () => {
  const baseArgs = makeBaseArgs();
  const source = /* GraphQL */ `
    {
      crawler(id: 102) {
        id
        name
        ... on ActiveCrawler {
          species
          friends {
            __typename
            id
            name
            ... on ActiveCrawler {
              friends {
                id
                name
              }
            }
            ... on NPC {
              exCrawler
            }
            ... on Manager {
              client {
                id
                name
              }
            }
            ... on Security {
              clients {
                id
                name
              }
            }
          }
        }
      }
    }
  `;
  const result = (await grafast({
    ...baseArgs,
    source,
  })) as ExecutionResult;
  if (result.errors) {
    console.dir(result.errors);
  }
  expect(result.errors).not.to.exist;
  expect(JSON.stringify(result.data, null, 2)).to.deep.equal(`\
{
  "crawler": {
    "id": 102,
    "name": "Princess Donut",
    "species": "CAT",
    "friends": [
      {
        "__typename": "ActiveCrawler",
        "id": 101,
        "name": "Carl",
        "friends": [
          {
            "id": 102,
            "name": "Princess Donut"
          },
          {
            "id": 103,
            "name": "Katia"
          },
          {
            "id": 104,
            "name": "Imani"
          },
          {
            "id": 105,
            "name": "Elle"
          },
          {
            "id": 301,
            "name": "Mordecai"
          }
        ]
      },
      {
        "__typename": "ActiveCrawler",
        "id": 103,
        "name": "Katia",
        "friends": [
          {
            "id": 101,
            "name": "Carl"
          },
          {
            "id": 102,
            "name": "Princess Donut"
          }
        ]
      },
      {
        "__typename": "ActiveCrawler",
        "id": 104,
        "name": "Imani",
        "friends": [
          {
            "id": 101,
            "name": "Carl"
          },
          {
            "id": 102,
            "name": "Princess Donut"
          },
          {
            "id": 105,
            "name": "Elle"
          }
        ]
      },
      {
        "__typename": "ActiveCrawler",
        "id": 105,
        "name": "Elle",
        "friends": [
          {
            "id": 101,
            "name": "Carl"
          },
          {
            "id": 102,
            "name": "Princess Donut"
          },
          {
            "id": 104,
            "name": "Imani"
          }
        ]
      },
      {
        "__typename": "Manager",
        "id": 301,
        "name": "Mordecai",
        "exCrawler": true,
        "client": {
          "id": 102,
          "name": "Princess Donut"
        }
      },
      {
        "__typename": "Security",
        "id": 302,
        "name": "Bomo",
        "exCrawler": null,
        "clients": [
          {
            "id": 101,
            "name": "Carl"
          },
          {
            "id": 102,
            "name": "Princess Donut"
          },
          {
            "id": 103,
            "name": "Katia"
          }
        ]
      },
      {
        "__typename": "Security",
        "id": 303,
        "name": "Sledge",
        "exCrawler": null,
        "clients": [
          {
            "id": 101,
            "name": "Carl"
          },
          {
            "id": 102,
            "name": "Princess Donut"
          },
          {
            "id": 103,
            "name": "Katia"
          }
        ]
      }
    ]
  }
}`);
});
