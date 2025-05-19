/* ALL OF THIS IS TYPESCRIPT, NOT GRAPHQL */

import type { LoadManyCallback, LoadOneCallback } from "../../dist";

type ItemSpec = `${"Equipment" | "Consumable" | "MiscItem"}:${number}`;

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
  type: "Manager" | "Security" | "Guide";
  species: "Changeling" | "Rock Monster" | "Half Elf";
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
  items?: ItemSpec[];
  /** @deprecated */
  type?: string;
}

export interface EquipmentData extends ItemData {}

export interface ConsumableData extends ItemData {}

export interface MiscItemData extends ItemData {}

export interface Database {
  crawlers: readonly CrawlerData[];
  npcs: readonly NpcData[];
  equipment: readonly EquipmentData[];
  consumables: readonly ConsumableData[];
  miscItems: readonly MiscItemData[];
}

export function makeData(): Database {
  return {
    crawlers: [
      {
        id: 101,
        species: "Human",
        name: "Carl",
        items: [
          "Equipment:201",
          "Equipment:202",
          "Equipment:203",
          "Consumable:201",
          "Consumable:202",
          "Consumable:203",
          "Consumable:204",
          "Consumable:205",
          "Consumable:206",
        ],
        favouriteItem: "Equipment:203",
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
          "Consumable:202",
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
          "Consumable:202",
          "Consumable:203",
        ],
        friends: [101, 102, 105],
      },
      {
        id: 105,
        species: "Human",
        name: "Elle",
        items: ["Consumable:202", "Consumable:203"],
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
    ],
    equipment: [
      { id: 201, name: "Cloak of Stoutness" },
      { id: 202, name: "Toe Ring of the Splatter Skunk" },
      { id: 203, name: "Enchanted War Gauntlet" },
      { id: 204, name: "Enchanted Crown" },
      { id: 205, name: "Enchanted Tiara of Mana" },
      { id: 206, name: "Enchanted Anklet" },
      { id: 207, name: "Enchanted Repeating Crossbow" },
      { id: 208, name: "Longsword" },
      { id: 209, name: "Enchanted Cloak" },
      {
        /* This item can have an inventory */
        id: 210,
        name: "Ugly Backpack With a Completely Useless Design",
        creator: 101,
        items: [
          "MiscItem:201",
          "MiscItem:201",
          "MiscItem:202",
          "MiscItem:202",
          "MiscItem:203",
          "MiscItem:203",
        ],
      },
    ],
    consumables: [
      { id: 201, name: "Rev-Up Immunity Smoothie", type: "Consumable" },
      { id: 202, name: "Bandage", type: "Consumable" },
      { id: 203, name: "Mana Potion", type: "Consumable" },
      { id: 204, name: "Healing Potion", type: "Consumable" },
      {
        id: 205,
        name: "Dolores Doesn't Splat Potion",
        type: "Consumable",
        creator: 106,
      },
      {
        id: 206,
        name: "Carl's Jug O' Boom",
        type: "Consumable",
        creator: 101,
      },
    ],
    miscItems: [
      {
        id: 201,
        name: "Scrap Metal",
        type: "Misc",
      },
      {
        id: 202,
        name: "Scrap Metal Pole",
        type: "Misc",
      },
      {
        id: 203,
        name: "Metal Bearing",
        type: "Misc",
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
  console.dir(idsList);
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
  console.dir(idsList);
  return idsList.map((ids) =>
    ids.map((id) => data.npcs.find((c) => c.id === id)),
  );
};
