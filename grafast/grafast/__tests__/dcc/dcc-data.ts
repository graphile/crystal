/* ALL OF THIS IS TYPESCRIPT, NOT GRAPHQL */

import type { LoadManyCallback, LoadOneCallback } from "../../dist";

export interface CrawlerData {
  id: number;
  species: "Human" | "Cat" | "Crocodilian";
  name: string;
  items?: number[];
  favouriteItem?: number;
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
  items?: number[];
  friends?: number[];
}

export interface ItemData {
  id: number;
  name: string;
  type: "Equipment" | "Consumable" | "Misc";
  creator?: number;
  items?: number[];
}

export interface Database {
  crawlers: readonly CrawlerData[];
  npcs: readonly NpcData[];
  items: readonly ItemData[];
}

export function makeData(): Database {
  return {
    crawlers: [
      {
        id: 101,
        species: "Human",
        name: "Carl",
        items: [201, 202, 203, 204, 211, 212, 213, 214, 215],
        favouriteItem: 203,
        friends: [102, 103, 104, 105, 301],
        bestFriend: 102,
        crawlerNumber: 4122,
      },
      {
        id: 102,
        species: "Cat",
        name: "Princess Donut",
        items: [204, 206, 207, 211, 212, 213, 214],
        favouriteItem: 205 /* Favourite item is not in inventory */,
        friends: [101, 103, 104, 105, 301, 302, 303],
        bestFriend: 101,
        crawlerNumber: 4119,
      },
      {
        id: 103,
        species: "Human",
        name: "Katia",
        items: [208, 213, 214, 216],
        favouriteItem: 216 /* Favourite item has a creator */,
        friends: [101, 102],
        bestFriend: 107 /* Best friend is deleted */,
        crawlerNumber: 9077265,
      },
      {
        id: 104,
        species: "Human",
        name: "Imani",
        items: [209, 210, 210, 212, 213],
        friends: [101, 102, 105],
      },
      {
        id: 105,
        species: "Human",
        name: "Elle",
        items: [212, 213],
        friends: [101, 102, 104],
      },
      { id: 106, species: "Crocodilian", name: "Dolores", items: [214] },
      { id: 107, species: "Human", name: "Hekla", deleted: true },
    ],
    npcs: [
      {
        id: 301,
        type: "Manager",
        species: "Changeling",
        name: "Mordecai",
        exCrawler: true,
        client: 101,
        items: [212, 212, 212],
        friends: [101, 102, 103],
      },
      {
        id: 302,
        type: "Security",
        species: "Rock Monster",
        name: "Bomo",
        friends: [102, 303],
      },
      {
        id: 303,
        type: "Security",
        species: "Rock Monster",
        name: "Sledge",
        friends: [102, 302],
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
    items: [
      { id: 201, name: "Cloak of Stoutness", type: "Equipment" },
      { id: 202, name: "Toe Ring of the Splatter Skunk", type: "Equipment" },
      { id: 203, name: "Enchanted War Gauntlet", type: "Equipment" },
      { id: 204, name: "Rev-Up Immunity Smoothie", type: "Consumable" },
      { id: 205, name: "Enchanted Crown", type: "Equipment" },
      { id: 206, name: "Enchanted Tiara of Mana", type: "Equipment" },
      { id: 207, name: "Enchanted Anklet", type: "Equipment" },
      { id: 208, name: "Enchanted Repeating Crossbow", type: "Equipment" },
      { id: 209, name: "Longsword", type: "Equipment" },
      { id: 210, name: "Enchanted Cloak", type: "Equipment" },
      { id: 211, name: "Bandage", type: "Consumable" },
      { id: 212, name: "Mana Potion", type: "Consumable" },
      { id: 213, name: "Healing Potion", type: "Consumable" },
      {
        id: 214,
        name: "Dolores Doesn't Splat Potion",
        type: "Consumable",
        creator: 106,
      },
      {
        id: 215,
        name: "Carl's Jug O' Boom",
        type: "Consumable",
        creator: 101,
      },
      {
        /* This item can have an inventory */
        id: 216,
        name: "Ugly Backpack With a Completely Useless Design",
        type: "Equipment",
        creator: 101,
        items: [217, 217, 218, 218, 219, 219],
      },
      {
        id: 217,
        name: "Scrap Metal",
        type: "Misc",
      },
      {
        id: 218,
        name: "Scrap Metal Pole",
        type: "Misc",
      },
      {
        id: 219,
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
