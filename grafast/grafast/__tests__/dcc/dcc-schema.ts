/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import { resolvePreset } from "graphile-config";

import type { AbstractTypePlanner, FieldArgs, Step } from "../../dist/index.js";
import {
  coalesce,
  constant,
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
  ClubData,
  CrawlerData,
  Database,
  ItemSpec,
  LocationData,
  NpcData,
} from "./dcc-data.js";
import {
  batchGetClubById,
  batchGetConsumableById,
  batchGetCrawlerById,
  batchGetEquipmentById,
  batchGetLocationsByFloorNumber,
  batchGetMiscItemById,
  batchGetNpcById,
  batchGetSafeRoomById,
  batchGetStairwellById,
  batchGetUtilityItemById,
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
        GONDII
        BOPCA
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
        bestFriend: Character
        saferoomLocation: String
      }
      type Manager implements NPC & Character & HasInventory {
        id: Int!
        name: String!
        species: Species
        items: [Item]
        exCrawler: Boolean
        friends: [Character]
        bestFriend: Character
        client: ActiveCrawler
      }
      type Security implements NPC & Character {
        id: Int!
        name: String!
        species: Species
        exCrawler: Boolean
        friends: [Character]
        bestFriend: Character
        clients: [ActiveCrawler!]
      }
      type Staff implements NPC & Character & HasInventory {
        id: Int!
        name: String!
        species: Species
        exCrawler: Boolean
        bestFriend: Character
        friends: [Character]
        items: [Item]
      }
      interface NPC implements Character {
        id: Int!
        name: String!
        species: Species
        exCrawler: Boolean
        bestFriend: Character
        friends: [Character]
      }
      interface Character {
        id: Int!
        name: String!
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
        bestFriend: ActiveCrawler
        crawlerNumber: Int
      }
      interface Item {
        id: Int!
        name: String
      }
      interface HasContents {
        contents: [Item]
      }
      interface Created {
        creator: Crawler
      }
      type Equipment implements Item & Created & HasContents {
        id: Int!
        name: String
        contents: [Item]
        creator: Crawler
        currentDurability: Int
        maxDurability: Int
      }
      type Consumable implements Item & Created & HasContents {
        id: Int!
        name: String
        contents: [Item]
        creator: Crawler
        effect: String
      }
      type MiscItem implements Item {
        id: Int!
        name: String
      }
      type UtilityItem implements Item {
        id: Int!
        name: String
      }

      type LootBox {
        id: Int!
      }
      type LootData {
        id: Int!
        itemType: String!
        itemId: Int!
        lootBoxId: Int!
        percentageChance: Int
      }

      interface Location {
        id: Int!
        name: String!
        floors: [Floor!]!
      }

      union SafeRoomStock = Consumable | MiscItem | Equipment
      union ClubStock = Consumable | MiscItem | UtilityItem

      type SafeRoom implements Location {
        id: Int!
        name: String!
        floors: [Floor!]!
        hasPersonalSpace: Boolean
        manager: NPC
        stock: [SafeRoomStock]
      }

      type Club implements Location {
        id: Int!
        name: String!
        floors: [Floor!]!
        manager: NPC
        security: [Security!]
        tagline: String!
        stock: [ClubStock]
      }

      type Stairwell implements Location {
        id: Int!
        name: String!
        floors: [Floor!]!
      }

      type BetaLocation implements Location {
        id: Int!
        name: String!
        floors: [Floor!]!
      }

      type Floor {
        number: Int!
        locations: [Location]
      }

      enum ItemType {
        Equipment
        Consumable
        UtilityItem
        MiscItem
      }

      type Query {
        crawler(id: Int!): Crawler
        character(id: Int!): Character

        floor(number: Int!): Floor
        brokenItem: Item
        item(type: ItemType!, id: Int!): Item
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
        GONDII: { value: "Gondii" },
        BOPCA: { value: "Bopca Protector" },
      },

      Query: {
        crawler(_: any, { $id }: FieldArgs) {
          const $data = context().get("data");
          return loadOne($id as Step<number>, $data, null, batchGetCrawlerById);
        },
        character(_: any, { $id }: FieldArgs) {
          return $id;
        },
        floor(_: any, { $number }: FieldArgs) {
          return lambda($number, getFloor);
        },
        brokenItem() {
          return constant("Utility:999");
        },
        item(_: any, { $type, $id }: FieldArgs) {
          return lambda([$type, $id], ([type, id]) => `${type}:${id}`);
        },
      },
      ActiveCrawler: {
        bestFriend($activeCrawler: Step<CrawlerData>) {
          const $id = inhibitOnNull(get($activeCrawler, "bestFriend"));
          const $data = context().get("data");
          return loadOne($id, $data, null, batchGetCrawlerById);
        },
        friends($activeCrawler: Step<CrawlerData>) {
          const $ids = get($activeCrawler, "friends");
          return $ids;
        },
      },
      Manager: {
        ...SharedNpcResolvers,
        client($manager: Step<NpcData>) {
          const $id = inhibitOnNull(get($manager, "client"));
          const $data = context().get("data");
          return loadOne($id, $data, null, batchGetCrawlerById);
        },
      },
      Security: {
        ...SharedNpcResolvers,

        clients($security: Step<NpcData>) {
          const $ids = inhibitOnNull(get($security, "clients"));
          return each($ids, ($id) => {
            const $data = context().get("data");
            return loadOne($id, $data, null, batchGetCrawlerById);
          });
        },
      },
      Guide: {
        ...SharedNpcResolvers,
      },
      Staff: {
        ...SharedNpcResolvers,
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
          } as AbstractTypePlanner;
        },
      },
      NPC: {
        __planType($npcId: Step<number>) {
          const $data = context().get("data");
          // TODO: Inhibit on null shouldn't be needed here
          const $npc = loadOne(
            inhibitOnNull($npcId),
            $data,
            null,
            batchGetNpcById,
          );
          const $__typename = lambda($npc, npcToTypeName);

          return {
            $__typename,
            planForType(t) {
              return $npc;
            },
          } as AbstractTypePlanner;
        },
      },

      Item: ItemResolver,
      SafeRoomStock: ItemResolver,
      ClubStock: ItemResolver,

      Equipment: {
        creator: getCreator,
      },
      Consumable: {
        creator: getCreator,
      },
      UtilityItem: {},
      MiscItem: {},
      Floor: {
        locations($floor: Step<FloorData>) {
          const $number = get($floor, "number");
          const $data = context().get("data");
          return loadMany($number, $data, null, batchGetLocationsByFloorNumber);
        },
      },
      Location: {
        __planType($location: Step<LocationData>): AbstractTypePlanner {
          const $data = context().get("data");
          const $__typename = get($location, "type");
          return {
            $__typename,
            planForType(t) {
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
              if (t.name === "Stairwell") {
                const $stairwell = loadOne(
                  $id,
                  $data,
                  null,
                  batchGetStairwellById,
                );
                return delegate(
                  $stairwell,
                  ["type", "name", "floors", "id"],
                  $location,
                );
              }
              if (t.name === "BetaLocation") {
                // This is to check that explicitly returning null here works as expected
                return null;
              }
              return null;
            },
          };
        },
      },
      SafeRoom: {
        ...SharedLocationResolvers,
      },
      Club: {
        ...SharedLocationResolvers,
        security($club: Step<ClubData & LocationData>) {
          const $ids = inhibitOnNull(get($club, "security"));
          return each($ids, ($id) => {
            const $data = context().get("data");
            return loadOne($id, $data, null, batchGetNpcById);
          });
        },
      },
      Stairwell: {
        ...SharedLocationResolvers,
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

const SharedLocationResolvers = {
  floors($place: Step<LocationData>) {
    const $floors = get($place, "floors") as Step<number[]>;
    return each($floors, ($floor) => lambda($floor, getFloor));
  },
};

const SharedNpcResolvers = {
  bestFriend($npc: Step<NpcData>) {
    const $id = get($npc, "bestFriend");
    return $id;
  },
};

const ItemResolver = {
  __planType($itemSpec: Step<ItemSpec>): AbstractTypePlanner {
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
        if (t.name === "UtilityItem") {
          return loadOne($id, $data, null, batchGetUtilityItemById);
        }
        if (t.name === "MiscItem") {
          return loadOne($id, $data, null, batchGetMiscItemById);
        }
        return null;
      },
    };
  },
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
  if (["Manager", "Security", "Guide", "Staff"].includes(npc.type)) {
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
