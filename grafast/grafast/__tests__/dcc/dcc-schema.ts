/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import { resolvePreset } from "graphile-config";

import type {
  FieldArgs,
  InterfacePlan,
  Maybe,
  Step,
} from "../../dist/index.js";
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
} from "../../dist/index.js";
import type {
  CrawlerData,
  Database,
  FloorData,
  ItemSpec,
  ItemType,
  LocationData,
  NpcData,
} from "./dcc-data.js";
import {
  batchGetClubById,
  batchGetConsumableById,
  batchGetCrawlerById,
  batchGetEquipmentById,
  batchGetLocationsByFloorNumber,
  batchGetLootBoxById,
  batchGetLootDataByItemTypeAndId,
  batchGetLootDataByLootBoxId,
  batchGetMiscItemById,
  batchGetNpcById,
  batchGetSafeRoomById,
  batchGetStairwellById,
  batchGetUtilityItemById,
  makeDb,
} from "./dcc-data.js";
import { typedMakeGrafastSchema } from "./dcc-types.js";
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
      dccDb: Database;
    }
  }
}

export const makeBaseArgs = () => {
  const schema = typedMakeGrafastSchema({
    enableDeferStream: true,
    typeDefs: /* GraphQL */ `
      # For the tests
      directive @incremental on QUERY | MUTATION | SUBSCRIPTION
      scalar _RawJSON
      directive @variables(values: _RawJSON!) on QUERY | MUTATION | SUBSCRIPTION

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
        items(first: Int): [Item]
      }

      type Guide implements NPC & Character {
        id: Int!
        name: String!
        species: Species
        exCrawler: Boolean
        friends(first: Int): [Character]
        bestFriend: Character
        saferoomLocation: String
      }
      type Manager implements NPC & Character & HasInventory {
        id: Int!
        name: String!
        species: Species
        items(first: Int): [Item]
        exCrawler: Boolean
        friends(first: Int): [Character]
        bestFriend: Character
        client: ActiveCrawler
      }
      type Security implements NPC & Character {
        id: Int!
        name: String!
        species: Species
        exCrawler: Boolean
        friends(first: Int): [Character]
        bestFriend: Character
        clients: [ActiveCrawler!]
      }
      type Staff implements NPC & Character & HasInventory {
        id: Int!
        name: String!
        species: Species
        exCrawler: Boolean
        bestFriend: Character
        friends(first: Int): [Character]
        items(first: Int): [Item]
      }
      interface NPC implements Character {
        id: Int!
        name: String!
        species: Species
        exCrawler: Boolean
        bestFriend: Character
        friends(first: Int): [Character]
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
        items(first: Int): [Item]
        favouriteItem: Item
        friends(first: Int): [Character]
        bestFriend: ActiveCrawler
        crawlerNumber: Int
      }
      interface Item {
        id: Int!
        name: String
        canBeFoundIn: [LootBox]
      }
      interface HasContents {
        contents(first: Int): [Item]
      }
      interface Created {
        creator: Crawler
      }
      type Equipment implements Item & Created & HasContents {
        id: Int!
        name: String
        canBeFoundIn: [LootBox]
        contents(first: Int): [Item]
        creator: Crawler
        currentDurability: Int
        maxDurability: Int
      }
      type Consumable implements Item & Created & HasContents {
        id: Int!
        name: String
        canBeFoundIn: [LootBox]
        contents(first: Int): [Item]
        creator: Crawler
        effect: String
      }
      type MiscItem implements Item {
        id: Int!
        name: String
        canBeFoundIn: [LootBox]
      }
      type UtilityItem implements Item {
        id: Int!
        name: String
        canBeFoundIn: [LootBox]
      }

      type LootBox {
        id: Int!
        tier: String
        category: String
        possibleItems: [Item]
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
        npc(id: Int!): NPC
        floor(number: Int!): Floor
        item(type: ItemType!, id: Int!): Item

        """
        Returns the value "Utility:999" which indicates a typeName of
        "Utility", which does not exist. The correct typeName is "UtilityItem",
        but we want to test when the value is wrong.
        """
        brokenItem: Item
      }
    `,
    enums: {
      Species: {
        values: {
          HUMAN: { value: "Human" },
          CAT: { value: "Cat" },
          CROCODILIAN: { value: "Crocodilian" },
          CHANGELING: { value: "Changeling" },
          ROCK_MONSTER: { value: "Rock Monster" },
          HALF_ELF: { value: "Half Elf" },
          GONDII: { value: "Gondii" },
          BOPCA: { value: "Bopca Protector" },
        },
      },
    },
    objects: {
      Query: {
        plans: {
          crawler(_, { $id }) {
            const $db = context().get("dccDb");
            return loadOne($id, $db, null, batchGetCrawlerById);
          },
          character(_, { $id }) {
            return $id;
          },
          floor(_, { $number }) {
            return lambda($number, getFloor);
          },
          npc(_, { $id }) {
            return $id;
          },
          brokenItem() {
            return constant("Utility:999" as ItemSpec);
          },
          item(_, { $type, $id }) {
            return lambda(
              [$type, $id],
              ([type, id]) => `${type}:${id}` as const,
            );
          },
        },
      },
      ActiveCrawler: {
        plans: {
          bestFriend($activeCrawler) {
            const $id = inhibitOnNull(get($activeCrawler, "bestFriend"));
            const $db = context().get("dccDb");
            return loadOne($id, $db, null, batchGetCrawlerById);
          },
          friends($activeCrawler, { $first }) {
            const $ids = get($activeCrawler, "friends");
            return lambda([$ids, $first], applyLimit);
          },
          items($crawler, { $first }) {
            const $items = get($crawler, "items");
            return lambda([$items, $first], applyLimit);
          },
        },
      },
      Manager: {
        plans: {
          ...SharedNpcResolvers,
          client($manager) {
            const $id = inhibitOnNull(get($manager, "client"));
            const $db = context().get("dccDb");
            return loadOne($id, $db, null, batchGetCrawlerById);
          },
          items($npc, { $first }) {
            const $items = get($npc, "items");
            return lambda([$items, $first], applyLimit);
          },
        },
      },
      Security: {
        plans: {
          ...SharedNpcResolvers,

          clients($security) {
            const $ids = inhibitOnNull(get($security, "clients"));
            return each($ids, ($id) => {
              const $db = context().get("dccDb");
              return loadOne($id, $db, null, batchGetCrawlerById);
            });
          },
        },
      },
      Guide: {
        plans: {
          ...SharedNpcResolvers,
        },
      },
      Staff: {
        plans: {
          ...SharedNpcResolvers,
          items($npc, { $first }) {
            const $items = get($npc, "items");
            return lambda([$items, $first], applyLimit);
          },
        },
      },

      Equipment: {
        plans: {
          creator: getCreator,
          canBeFoundIn($item) {
            const $id = get($item, "id");
            const $type = constant("Equipment");
            return lootBoxesForItem($type, $id);
          },
        },
      },
      Consumable: {
        plans: {
          creator: getCreator,
          canBeFoundIn($item) {
            const $id = get($item, "id");
            const $type = constant("Consumable");
            return lootBoxesForItem($type, $id);
          },
        },
      },
      UtilityItem: {
        plans: {
          canBeFoundIn($item) {
            const $id = get($item, "id");
            const $type = constant("UtilityItem");
            return lootBoxesForItem($type, $id);
          },
        },
      },
      MiscItem: {
        plans: {
          canBeFoundIn($item) {
            const $id = get($item, "id");
            const $type = constant("MiscItem");
            return lootBoxesForItem($type, $id);
          },
        },
      },
      Floor: {
        plans: {
          locations($floor) {
            const $number = get($floor, "number");
            const $db = context().get("dccDb");
            return loadMany($number, $db, null, batchGetLocationsByFloorNumber);
          },
        },
      },
      SafeRoom: {
        plans: {
          ...SharedLocationResolvers,
        },
      },
      Club: {
        plans: {
          ...SharedLocationResolvers,
          security($club) {
            const $ids = inhibitOnNull(get($club, "security"));
            return each($ids, ($id) => {
              const $db = context().get("dccDb");
              return loadOne($id, $db, null, batchGetNpcById);
            });
          },
        },
      },
      Stairwell: {
        plans: {
          ...SharedLocationResolvers,
        },
      },
      LootBox: {
        plans: {
          possibleItems($lootBox) {
            const $id = get($lootBox, "id");
            const $db = context().get("dccDb");

            const $lootData = inhibitOnNull(
              loadMany($id, $db, null, batchGetLootDataByLootBoxId),
            );
            return each($lootData, ($lootDatum) => {
              const $id = get($lootDatum, "itemId");
              const $type = get($lootDatum, "itemType");
              return lambda([$type, $id], encodeItemSpec);
            });
          },
        },
      },
    },
    unions: {
      SafeRoomStock: ItemResolver,
      ClubStock: ItemResolver,
    },
    interfaces: {
      Crawler: {
        planType($crawler) {
          const $__typename = lambda($crawler, crawlerToTypeName);
          return { $__typename };
        },
      },
      Character: {
        planType($specifier) {
          const $db = context().get("dccDb");

          const $crawlerId = inhibitOnNull(
            lambda($specifier, extractCrawlerId),
          );
          const $crawler = inhibitOnNull(
            loadOne($crawlerId, $db, null, batchGetCrawlerById),
          );
          const $crawlerTypename = lambda($crawler, crawlerToTypeName);

          const $npcId = inhibitOnNull(lambda($specifier, extractNpcId));
          const $npc = inhibitOnNull(
            loadOne($npcId, $db, null, batchGetNpcById),
          );
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
          };
        },
      },
      NPC: {
        planType($npcId) {
          const $db = context().get("dccDb");
          const $npc = inhibitOnNull(
            loadOne($npcId, $db, null, batchGetNpcById),
          );
          const $__typename = lambda(inhibitOnNull($npc), npcToTypeName);

          return {
            $__typename,
            planForType(t) {
              return $npc;
            },
          };
        },
      },
      Item: ItemResolver,

      Location: {
        planType($location) {
          const $db = context().get("dccDb");
          const $__typename = get($location, "type");
          return {
            $__typename,
            planForType(t) {
              const $id = get($location, "id");

              if (t.name === "SafeRoom") {
                const $saferoom = loadOne($id, $db, null, batchGetSafeRoomById);
                return delegate(
                  $saferoom,
                  ["type", "name", "floors", "id"],
                  $location,
                );
              }
              if (t.name === "Club") {
                const $club = loadOne($id, $db, null, batchGetClubById);
                return delegate(
                  $club,
                  ["type", "name", "floors", "id"],
                  $location,
                );
              }
              if (t.name === "Stairwell") {
                const $stairwell = loadOne(
                  $id,
                  $db,
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
    },
  });
  const dccDb = makeDb();
  return {
    schema,
    resolvedPreset,
    requestContext,
    variableValues: {},
    contextValue: { dccDb },
  };
};

function lootBoxesForItem($type: Step<string>, $id: Step<number>) {
  const $db = context().get("dccDb");

  const $lootData = inhibitOnNull(
    loadMany([$type, $id], $db, null, batchGetLootDataByItemTypeAndId),
  );
  return each($lootData, ($lootDatum) => {
    const $db = context().get("dccDb");

    return loadOne(
      get($lootDatum, "lootBoxId"),
      $db,
      null,
      batchGetLootBoxById,
    );
  });
}

const SharedLocationResolvers = {
  floors($place: Step<LocationData>) {
    const $floors = get($place, "floors");
    return each($floors, ($floor) => lambda($floor, getFloor));
  },
};

const SharedNpcResolvers = {
  friends(
    $npc: Step<NpcData>,
    { $first }: FieldArgs<{ first: Maybe<number> }>,
  ) {
    const $friends = get($npc, "friends");
    return lambda([$friends, $first], applyLimit);
  },
  bestFriend($npc: Step<NpcData>) {
    const $id = get($npc, "bestFriend");
    return $id;
  },
};

function applyLimit<T>([list, count]: readonly [
  list: ReadonlyArray<T> | null | undefined,
  count: Maybe<number>,
]) {
  if (list == null) return list;
  if (count != null) return list.slice(0, count);
  return list;
}

const ItemResolver = {
  planType($itemSpec) {
    const $decoded = lambda($itemSpec, decodeItemSpec);
    const $__typename = get($decoded, "__typename");
    return {
      $__typename,
      planForType(t) {
        const $id = get($decoded, "id");
        const $db = context().get("dccDb");

        if (t.name === "Equipment") {
          return loadOne($id, $db, null, batchGetEquipmentById);
        }
        if (t.name === "Consumable") {
          return loadOne($id, $db, null, batchGetConsumableById);
        }
        if (t.name === "UtilityItem") {
          return loadOne($id, $db, null, batchGetUtilityItemById);
        }
        if (t.name === "MiscItem") {
          return loadOne($id, $db, null, batchGetMiscItemById);
        }
        return null;
      },
    };
  },
} as InterfacePlan<Step<ItemSpec>>;

function getCreator($source: Step<{ creator?: number }>) {
  const $db = context().get("dccDb");
  const $id = inhibitOnNull(get($source, "creator"));
  return loadOne($id, $db, null, batchGetCrawlerById);
}

function crawlerToTypeName(crawler: CrawlerData): string | null {
  if (crawler.deleted) return "DeletedCrawler";
  return "ActiveCrawler";
}

function npcToTypeName(npc: NpcData): string | null {
  if (!npc) return null;
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

function encodeItemSpec([type, id]: readonly [
  type: ItemType,
  id: number,
]): ItemSpec {
  return `${type}:${id}`;
}

function getFloor(number: number): FloorData | null {
  if (number >= 1 && number <= 18) {
    return { number };
  }
  return null;
}
