/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import { resolvePreset } from "graphile-config";

import {
  constant,
  context,
  lambda,
  loadOne,
  makeGrafastSchema,
  Step,
  get,
  loadMany,
} from "../../dist/index.js";
import {
  CrawlerData,
  Database,
  batchGetCrawlerById,
  batchGetCrawlersByIds,
  makeData,
} from "./dcc-data.js";

const resolvedPreset = resolvePreset({});
const requestContext = {};

declare global {
  namespace Grafast {
    interface Context {
      data: Database;
    }
  }
}

export const makeBaseArgs = () => {
  const schema = makeGrafastSchema({
    typeDefs: /* GraphQL */ `
      enum Species {
        HUMAN
        CAT
        CROCODILIAN
        CHANGELING
        ROCK_MONSTER
        HALF_ELF
      }
      type Guide implements NPC & Character {
        id: Int!
        name: String!
        species: Species
        exCrawler: Boolean
        saferoomLocation: String
      }
      type Manager implements NPC & Character {
        id: Int!
        name: String!
        species: Species
        exCrawler: Boolean
        client: ActiveCrawler
      }
      interface NPC implements Character {
        id: Int!
        name: String!
        species: Species
        exCrawler: Boolean
      }
      interface Character {
        id: Int!
        name: String
      }
      interface Crawler implements Character {
        id: Int!
        name: String!
        crawlerNumber: Int
      }
      type DeletedCrawler implements Crawler & Character {
        id: Int!
        name: String!
        crawlerNumber: Int
      }
      type ActiveCrawler implements Crawler & Character {
        id: Int!
        name: String!
        species: Species
        items: [Item]
        favouriteItem: Item
        friends: [Character]
        bestFriend: Character
        crawlerNumber: Int
      }
      type Item {
        id: Int!
      }
      type Query {
        crawler(id: Int!): Crawler
      }
    `,
    plans: {
      Species: {
        HUMAN: { value: "Human" },
        CAT: { value: "Cat" },
        CROCODILIAN: { value: "Crocodilian" },
        CHANGELING: { value: "Changeling" },
        ROCK_MONSTER: { value: "Rock Monster" },
        HALF_ELF: { value: "Half Elf" },
      },

      Query: {
        crawler(_, { $id }) {
          const $data = context().get("data");
          return loadOne($id as Step<number>, $data, null, batchGetCrawlerById);
        },
      },
      ActiveCrawler: {
        bestFriend($activeCrawler) {
          const $data = context().get("data");
          const $id = get($activeCrawler, "bestFriend") as Step<number>;
          return loadOne($id, $data, null, batchGetCrawlerById);
        },
        friends($activeCrawler) {
          const $data = context().get("data");
          const $ids = get($activeCrawler, "friends") as Step<number[]>;
          return loadMany($ids, $data, null, batchGetCrawlersByIds);
        },
      },
      Crawler: {
        __planType($crawler) {
          const $__typename = lambda(
            $crawler as Step<CrawlerData>,
            crawlerToTypeName,
          );
          return { $__typename };
        },
      },
    },
  });
  const data = makeData();
  return {
    schema,
    resolvedPreset,
    requestContext,
    variableValues: {},
    contextValue: { data },
  };
};

function crawlerToTypeName(crawler: CrawlerData): string | null {
  if (crawler.deleted) return "DeletedCrawler";
  return "ActiveCrawler";
}
