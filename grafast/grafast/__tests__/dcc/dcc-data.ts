/* ALL OF THIS IS TYPESCRIPT, NOT GRAPHQL */

import type { LoadManyCallback, LoadOneCallback } from "../../dist";

export type ItemSpec =
  `${"Equipment" | "Consumable" | "UtilityItem" | "MiscItem"}:${number}`;
export type LocationType = "SafeRoom" | "Club";

export interface CrawlerData {
  id: number;
  species: "Human" | "Cat" | "Crocodilian";
  name: string;
  items?: ItemSpec[];
  favouriteItem?: ItemSpec;
  friends?: number[];
  bestFriend?: number;
  crawlerNumber?: number;
  deleted?: true;
}

export interface NpcData {
  id: number;
  type: "Manager" | "Security" | "Guide" | "ClubStaff";
  species: "Changeling" | "Rock Monster" | "Half Elf" | "Gondii";
  name: string;
  exCrawler?: boolean;
  client?: number;
  clients?: number[];
  items?: ItemSpec[];
  friends?: number[];
}

export interface ItemData {
  id: number;
  name: string;
  creator?: number;
  contents?: ItemSpec[];
  /** @deprecated */
  type?: string;
}

export interface EquipmentData extends ItemData {
  currentDurability?: number;
  maxDurability: number;
  contents?: ItemSpec[];
}

export interface ConsumableData extends ItemData {
  effect?: string;
  contents?: ItemSpec[];
}

export interface UtilityItemData extends ItemData {
  contents?: ItemSpec[];
}

export interface MiscItemData extends ItemData {}

export interface LocationData {
  id: number;
  name: string;
  type: LocationType;
  floors: number[];
}

export interface SafeRoomData {
  id: number;
  hasPersonalSpace: boolean;
  hasStaff?: true;
  stock?: ItemSpec[];
}

export interface ClubData {
  id: number;
  manager?: number;
  security?: number[];
  tagline: String;
}

export interface Database {
  crawlers: readonly CrawlerData[];
  npcs: readonly NpcData[];
  equipment: readonly EquipmentData[];
  consumables: readonly ConsumableData[];
  utilityItems: readonly UtilityItemData[];
  miscItems: readonly MiscItemData[];
  locations: readonly LocationData[];
  saferooms: readonly SafeRoomData[];
  clubs: readonly ClubData[];
}

export function makeData(): Database {
  return {
    crawlers: [
      {
        id: 101,
        species: "Human",
        name: "Carl",
        items: [
          "UtilityItem:206",
          "Equipment:201",
          "Equipment:202",
          "Equipment:203",
          "Consumable:201",
          "UtilityItem:202",
          "Consumable:203",
          "Consumable:204",
          "Consumable:205",
          "Consumable:206",
          "Equipment:211",
        ],
        favouriteItem: "Equipment:211",
        friends: [102, 103, 104, 105, 301],
        bestFriend: 102,
        crawlerNumber: 4122,
      },
      {
        id: 102,
        species: "Cat",
        name: "Princess Donut",
        items: [
          "Equipment:204",
          "Equipment:206",
          "Consumable:201",
          "UtilityItem:202",
          "Consumable:203",
          "Consumable:204",
          "Consumable:205",
        ],
        favouriteItem: "Equipment:205" /* Favourite item is not in inventory */,
        friends: [101, 103, 104, 105, 301, 302, 303],
        bestFriend: 101,
        crawlerNumber: 4119,
      },
      {
        id: 103,
        species: "Human",
        name: "Katia",
        items: [
          "Equipment:207",
          "Consumable:203",
          "Consumable:204",
          "Equipment:210",
        ],
        favouriteItem: "Equipment:210" /* Favourite item has a creator */,
        friends: [101, 102],
        bestFriend: 107 /* Best friend is deleted */,
        crawlerNumber: 9077265,
      },
      {
        id: 104,
        species: "Human",
        name: "Imani",
        items: [
          "Equipment:208",
          "Equipment:209",
          "Consumable:204",
          "UtilityItem:202",
          "Consumable:203",
        ],
        friends: [101, 102, 105],
      },
      {
        id: 105,
        species: "Human",
        name: "Elle",
        items: ["UtilityItem:202", "Consumable:203"],
        friends: [101, 102, 104],
      },
      {
        id: 106,
        species: "Crocodilian",
        name: "Dolores",
        items: ["Consumable:205"],
      },
      { id: 107, species: "Human", name: "Hekla", deleted: true },
    ],
    npcs: [
      {
        id: 301,
        type: "Manager",
        species: "Changeling",
        name: "Mordecai",
        exCrawler: true,
        client: 102,
        items: ["Consumable:203", "Consumable:203", "Consumable:203"],
        friends: [101, 102, 103],
      },
      {
        id: 302,
        type: "Security",
        species: "Rock Monster",
        name: "Bomo",
        friends: [102, 303],
        clients: [101, 102, 103],
      },
      {
        id: 303,
        type: "Security",
        species: "Rock Monster",
        name: "Sledge",
        friends: [102, 302],
        clients: [101, 102, 103],
      },

      {
        id: 304,
        type: "Manager",
        species: "Half Elf",
        name: "Tiatha",
        exCrawler: true,
        client: 105,
      },
      {
        id: 305,
        type: "ClubStaff",
        species: "Gondii",
        name: "Orren",
      },
    ],
    equipment: [
      {
        id: 201,
        name: "Cloak of Stoutness",
        currentDurability: 300,
        maxDurability: 300,
      },
      {
        id: 202,
        name: "Toe Ring of the Splatter Skunk",
        currentDurability: 50,
        maxDurability: 1000,
      },
      {
        id: 203,
        name: "Enchanted War Gauntlet",
        currentDurability: 50,
        maxDurability: 1800,
      },
      { id: 204, name: "Enchanted Crown", maxDurability: 5000 },
      {
        id: 205,
        name: "Enchanted Tiara of Mana",
        currentDurability: 0,
        maxDurability: 2500,
      },
      { id: 206, name: "Enchanted Anklet", maxDurability: 100 },
      {
        id: 207,
        name: "Enchanted Repeating Crossbow",
        currentDurability: 1500,
        maxDurability: 3000,
      },
      {
        id: 208,
        name: "Longsword",
        currentDurability: 10000,
        maxDurability: 10000,
      },
      {
        id: 209,
        name: "Enchanted Cloak",
        currentDurability: 70,
        maxDurability: 400,
      },
      {
        /* This item can have an inventory */
        id: 210,
        name: "Ugly Backpack With a Completely Useless Design",
        creator: 101,
        currentDurability: 100,
        maxDurability: 100,
        contents: [
          "MiscItem:201",
          "MiscItem:201",
          "MiscItem:202",
          "MiscItem:202",
          "MiscItem:203",
          "MiscItem:203",
        ],
      },
      {
        id: 211,
        name: "Enchanted Anarchist's Battle Rattle",
        maxDurability: 10000,
        currentDurability: 10000,
        contents: ["Equipment:212", "Equipment:213"],
      },
      { id: 212, name: "Earth Upgrade Patch", maxDurability: 10000 },
      { id: 213, name: "Skyfowl Upgrade Patch", maxDurability: 10000 },
    ],
    consumables: [
      {
        id: 201,
        name: "Rev-Up Immunity Smoothie",
        effect:
          "Temporary immunity to all health-seeping conditions and debuffs",
      },
      {
        id: 203,
        name: "Mana Potion",
        effect: "Fully restores MP",
      },
      {
        id: 204,
        name: "Healing Potion",
        effect: "Heal 50%+ total health",
      },
      {
        id: 205,
        name: "Dolores Doesn't Splat Potion",
        creator: 106,
        effect: "Soften impact surface. Impact x 5",
        contents: ["Consumable:207", "Consumable:208"],
      },
      {
        id: 206,
        name: "Carl's Jug O' Boom",
        creator: 101,
        effect:
          "Intense Fire for (Incendiary Device Handling Skill Level x 15) sec.",
        contents: ["Consumable:209", "MiscItem:204", "MiscItem:205"],
      },
      {
        id: 207,
        name: "Crowd Blast Potion",
        effect: "Imitates the Crowd Blast skill",
      },
      {
        id: 208,
        name: "Rock Buffalo Potion",
        effect: "A required component of Dolores Doesn't Splat Potion",
      },
      {
        id: 209,
        name: "Goblin Oil",
        effect: "Has many uses",
      },
    ],
    utilityItems: [
      { id: 202, name: "Bandage" },
      {
        id: 206,
        name: "Fireball or Custard? Scratchcard",
      },
    ],
    miscItems: [
      {
        id: 201,
        name: "Scrap Metal",
      },
      {
        id: 202,
        name: "Scrap Metal Pole",
      },
      {
        id: 203,
        name: "Metal Bearing",
      },
      {
        id: 204,
        name: "Low-Grade Moonshine Jug",
      },
      {
        id: 205,
        name: "Torch",
      },
    ],
    locations: [
      { id: 101, type: "SafeRoom", name: "Peruvian Taco Bell", floors: [1, 2] },
      { id: 102, type: "SafeRoom", name: "DMV waiting room", floors: [1, 2] },
      { id: 103, type: "Club", name: "Tutorial Guild", floors: [1, 2] },
      {
        id: 201,
        type: "SafeRoom",
        name: "French storm shelter",
        floors: [2, 3],
      },
      { id: 301, type: "Club", name: "Desperado Club", floors: [3, 4, 5] },
      { id: 302, type: "Club", name: "Club Vanquisher", floors: [3, 4, 5] },
    ],
    saferooms: [
      {
        id: 101,
        hasPersonalSpace: true,
        hasStaff: true,
        stock: ["Consumable:203", "Consumable:204", "Consumable:209"],
      },
      {
        id: 102,
        hasPersonalSpace: false,
        hasStaff: true,
      },
      {
        id: 201,
        hasPersonalSpace: false,
      },
      {
        /* An orphaned saferoom sharing the id of a club */
        id: 301,
        hasPersonalSpace: true,
        hasStaff: true,
        stock: ["Consumable:203", "Consumable:204"],
      },
    ],
    clubs: [
      {
        id: 103,
        manager: 301,
        tagline: "Crawlers are recommended to join, but not required",
      },
      {
        id: 301,
        manager: 305,
        security: [302, 303],
        tagline: "So fun it hurts",
      },
      {
        id: 302,
        tagline: "Heathens will find no solace here",
      },
    ],
  };
}

export const batchGetCrawlerById: LoadOneCallback<
  number,
  CrawlerData,
  never,
  Database
> = (ids, { unary: data }) => {
  return ids.map((id) => data.crawlers.find((c) => c.id === id));
};

export const batchGetCrawlersByIds: LoadManyCallback<
  number[],
  CrawlerData | undefined,
  never,
  Database
> = (idsList, { unary: data }) => {
  return idsList.map((ids) =>
    ids.map((id) => data.crawlers.find((c) => c.id === id)),
  );
};

export const batchGetNpcById: LoadOneCallback<
  number,
  NpcData,
  never,
  Database
> = (ids, { unary: data }) => {
  return ids.map((id) => data.npcs.find((c) => c.id === id));
};

export const batchGetNpcsByIds: LoadManyCallback<
  number[],
  NpcData | undefined,
  never,
  Database
> = (idsList, { unary: data }) => {
  return idsList.map((ids) =>
    ids.map((id) => data.npcs.find((c) => c.id === id)),
  );
};

export const batchGetEquipmentById: LoadOneCallback<
  number,
  EquipmentData,
  never,
  Database
> = (ids, { unary: data }) => {
  return ids.map((id) => data.equipment.find((c) => c.id === id));
};

export const batchGetConsumableById: LoadOneCallback<
  number,
  ConsumableData,
  never,
  Database
> = (ids, { unary: data }) => {
  return ids.map((id) => data.consumables.find((c) => c.id === id));
};

export const batchGetUtilityItemById: LoadOneCallback<
  number,
  UtilityItemData,
  never,
  Database
> = (ids, { unary: data }) => {
  return ids.map((id) => data.utilityItems.find((c) => c.id === id));
};

export const batchGetMiscItemById: LoadOneCallback<
  number,
  MiscItemData,
  never,
  Database
> = (ids, { unary: data }) => {
  return ids.map((id) => data.miscItems.find((c) => c.id === id));
};

export const batchGetLocationsByFloorNumber: LoadManyCallback<
  number,
  LocationData,
  never,
  Database
> = (floorNumberList, { unary: data }) => {
  return floorNumberList.map((floorNumber) =>
    data.locations.filter((c) => c.floors.includes(floorNumber)),
  );
};

export const batchGetLocationById: LoadOneCallback<
  number,
  LocationData,
  never,
  Database
> = (ids, { unary: data }) => {
  return ids.map((id) => data.locations.find((c) => c.id === id));
};

export const batchGetSafeRoomById: LoadOneCallback<
  number,
  SafeRoomData,
  never,
  Database
> = (ids, { unary: data }) => {
  return ids.map((id) => data.saferooms.find((c) => c.id === id));
};

export const batchGetClubById: LoadOneCallback<
  number,
  ClubData,
  never,
  Database
> = (ids, { unary: data }) => {
  return ids.map((id) => data.clubs.find((c) => c.id === id));
};
