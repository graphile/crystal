/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import { resolvePreset } from "graphile-config";

import type {
  FieldArgs,
  PolymorphicTypePlanner,
  Step,
} from "../../dist/index.js";
import {
  coalesce,
  context,
  each,
  get,
  inhibitOnNull,
  lambda,
  loadMany,
  loadOne,
  makeGrafastSchema,
} from "../../dist/index.js";
import type {
  CrawlerData,
  Database,
  EquipmentData,
  ItemSpec,
  LocationData,
  NpcData,
} from "./dcc-data.js";
import {
  batchGetClubById,
  batchGetConsumableById,
  batchGetCrawlerById,
  batchGetEquipmentById,
  batchGetLocationById,
  batchGetLocationsByFloorNumber,
  batchGetMiscItemById,
  batchGetNpcById,
  batchGetSafeRoomById,
  makeData,
} from "./dcc-data.js";
import { delegate } from "./delegate.js";

const resolvedPreset = resolvePreset({
  grafast: {
    explain: true,
  },
});
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
      interface HasInventory {
        items: [Item]
      }

      type Guide implements NPC & Character {
        id: Int!
        name: String!
        species: Species
        exCrawler: Boolean
        friends: [Character]
        saferoomLocation: String
      }
      type Manager implements NPC & Character & HasInventory {
        id: Int!
        name: String!
        species: Species
        items: [Item]
        exCrawler: Boolean
        friends: [Character]
        client: ActiveCrawler
      }
      type Security implements NPC & Character {
        id: Int!
        name: String!
        species: Species
        exCrawler: Boolean
        friends: [Character]
        clients: [ActiveCrawler!]
      }
      interface NPC implements Character {
        id: Int!
        name: String!
        species: Species
        exCrawler: Boolean
        friends: [Character]
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
      type ActiveCrawler implements Crawler & Character & HasInventory {
        id: Int!
        name: String!
        species: Species
        items: [Item]
        favouriteItem: Item
        friends: [Character]
        bestFriend: Character
        crawlerNumber: Int
      }
      interface Item {
        id: Int!
        name: String
        contents: [Item]
      }
      interface Created {
        creator: Crawler
        contents: [Item]
      }
      type Equipment implements Item & Created {
        id: Int!
        name: String
        contents: [Item]
        creator: Crawler
        currentDurability: Int
        maxDurability: Int
      }
      type Consumable implements Item & Created {
        id: Int!
        name: String
        contents: [Item]
        creator: Crawler
        effect: String
      }
      type MiscItem implements Item {
        id: Int!
        name: String
        contents: [Item]
      }
      interface Location {
        id: Int!
        name: String!
        floors: [Floor!]!
      }

      type SafeRoom implements Location {
        id: Int!
        name: String!
        floors: [Floor!]!
        hasPersonalSpace: Boolean!
        hasStaff: Boolean
      }

      type Club implements Location {
        id: Int!
        name: String!
        floors: [Floor!]!
        manager: NPC
        security: [Security!]
        tagline: String!
      }

      type Floor {
        number: Int!
        locations: [Location]
      }

      type Query {
        crawler(id: Int!): Crawler
        floor(number: Int!): Floor
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
        crawler(_: any, { $id }: FieldArgs) {
          const $data = context().get("data");
          return loadOne($id as Step<number>, $data, null, batchGetCrawlerById);
        },
        floor(_: any, { $number }: FieldArgs) {
          return lambda($number, getFloor);
        },
      },
      ActiveCrawler: {
        bestFriend($activeCrawler: Step<CrawlerData>) {
          const $id = get($activeCrawler, "bestFriend");
          return $id;
        },
        friends($activeCrawler: Step<CrawlerData>) {
          const $ids = get($activeCrawler, "friends");
          return $ids;
        },
      },
      Manager: {
        client($manager: Step<NpcData>) {
          const $id = inhibitOnNull(get($manager, "client"));
          const $data = context().get("data");
          return loadOne($id, $data, null, batchGetCrawlerById);
        },
      },
      Security: {
        clients($security: Step<NpcData>) {
          const $ids = inhibitOnNull(get($security, "clients"));
          return each($ids, ($id) => {
            const $data = context().get("data");
            return loadOne($id, $data, null, batchGetCrawlerById);
          });
        },
      },
      Crawler: {
        __planType($crawler: Step<CrawlerData>) {
          const $__typename = lambda($crawler, crawlerToTypeName);
          return { $__typename };
        },
      },
      Character: {
        __planType($specifier: Step<number>) {
          const $data = context().get("data");

          const $crawlerId = inhibitOnNull(
            lambda($specifier, extractCrawlerId),
          );
          const $crawler = loadOne(
            $crawlerId,
            $data,
            null,
            batchGetCrawlerById,
          );
          const $crawlerTypename = lambda(
            $crawler as Step<CrawlerData>,
            crawlerToTypeName,
          );

          const $npcId = inhibitOnNull(
            lambda($specifier, extractNpcId),
          ) as Step<number>;
          const $npc = loadOne($npcId, $data, null, batchGetNpcById);
          const $npcTypename = lambda($npc, npcToTypeName);

          const $__typename = coalesce([$crawlerTypename, $npcTypename]);
          return {
            $__typename,
            planForType(t) {
              if (t.getInterfaces().some((iface) => iface.name === "Crawler")) {
                return $crawler;
              } else if (
                t.getInterfaces().some((iface) => iface.name === "NPC")
              ) {
                return $npc;
              } else {
                return null;
              }
            },
          } as PolymorphicTypePlanner;
        },
      },
      Item: {
        __planType($itemSpec: Step<ItemSpec>): PolymorphicTypePlanner {
          const $decoded = lambda($itemSpec, decodeItemSpec);
          const $__typename = get($decoded, "__typename");
          return {
            $__typename,
            planForType(t) {
              const $id = get($decoded, "id");
              const $data = context().get("data");

              if (t.name === "Equipment") {
                return loadOne($id, $data, null, batchGetEquipmentById);
              }
              if (t.name === "Consumable") {
                return loadOne($id, $data, null, batchGetConsumableById);
              }
              if (t.name === "MiscItem") {
                return loadOne($id, $data, null, batchGetMiscItemById);
              }
              return null;
            },
          };
        },
      },
      Equipment: {
        creator: getCreator,
      },
      Consumable: {
        creator: getCreator,
      },
      MiscItem: {},
      Floor: {
        locations($floor: Step<FloorData>) {
          const $number = get($floor, "number");
          const $data = context().get("data");
          return loadMany($number, $data, null, batchGetLocationsByFloorNumber);
        },
      },
      Location: {
        __planType($location: Step<LocationData>): PolymorphicTypePlanner {
          const $data = context().get("data");
          const $__typename = get($location, "type");
          return {
            $__typename,
            planForType(t) {
              console.log("plan type", t.name);
              const $id = get($location, "id");

              if (t.name === "SafeRoom") {
                const $saferoom = loadOne(
                  $id,
                  $data,
                  null,
                  batchGetSafeRoomById,
                );
                return delegate(
                  $saferoom,
                  ["type", "name", "floors", "id"],
                  $location,
                );
              }
              if (t.name === "Club") {
                const $club = loadOne($id, $data, null, batchGetClubById);
                return delegate(
                  $club,
                  ["type", "name", "floors", "id"],
                  $location,
                );
              }
              console.log("unexpected type", t.name);
              return null;
            },
          };
        },
      },
      SafeRoom: {
        floors($saferoom) {
          const $floors = get($saferoom, "floors") as Step<number[]>;
          return each($floors, ($floor) => lambda($floor, getFloor));
        },
      },
      Club: {
        floors($club) {
          const $floors = get($club, "floors") as Step<number[]>;
          return each($floors, ($floor) => lambda($floor, getFloor));
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

function getCreator($source: Step<{ creator?: number }>) {
  const $data = context().get("data");
  const $id = inhibitOnNull(get($source, "creator"));
  return loadOne($id, $data, null, batchGetCrawlerById);
}

function crawlerToTypeName(crawler: CrawlerData): string | null {
  if (crawler.deleted) return "DeletedCrawler";
  return "ActiveCrawler";
}

function npcToTypeName(npc: NpcData): string | null {
  if (["Manager", "Security", "Guide"].includes(npc.type)) {
    return npc.type;
  } else {
    console.warn(`${npc.type} is not yet a supported type of NPC in GraphQL`);
    return null;
  }
}

function extractCrawlerId(id: number) {
  if (id > 100 && id < 200) return id;
  else return null;
}
function extractNpcId(id: number) {
  if (id > 300 && id < 400) return id;
  else return null;
}

function decodeItemSpec(itemSpec: ItemSpec): {
  __typename: string;
  id: number;
} {
  const [__typename, rawID] = itemSpec.split(":");
  const id = parseInt(rawID, 10);
  return { __typename, id };
}

interface FloorData {
  number: number;
}

function getFloor(number: number): FloorData | null {
  if (number >= 1 && number <= 18) {
    return { number };
  }
  return null;
}
