/* ALL OF THIS IS TYPESCRIPT, NOT GRAPHQL */

interface Crawler {
  id: number;
  species: "Human" | "Cat" | "Crocodilian";
  name: string;
  items?: number[];
  favouriteItem?: number;
  friends?: number[];
  bestFriend?: number;
}

interface Npc {
  id: number;
  type: "Manager" | "Security";
  species: "Changeling" | "Rock Monster" | "Half Elf";
  name: string;
  items?: number[];
  friends?: number[];
}

interface Item {
  id: number;
  name: string;
  type: "Equipment" | "Consumable";
  creator?: number;
}

interface Database {
  crawlers: readonly Crawler[];
  npcs: readonly Npc[];
  items: readonly Item[];
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
      },
      {
        id: 102,
        species: "Cat",
        name: "Princess Donut",
        items: [204, 205, 206, 207, 211, 212, 213, 214],
        favouriteItem: 206,
        friends: [101, 103, 104, 105, 301, 302, 303],
        bestFriend: 101,
      },
      {
        id: 103,
        species: "Human",
        name: "Katia",
        items: [208, 213, 214, 216],
        favouriteItem: 209,
        friends: [101, 102],
      },
      {
        id: 104,
        species: "Human",
        name: "Imani",
        items: [209, 210, 210, 212, 213],
        friends: [101, 102, 105, 304],
        bestFriend: 105,
      },
      {
        id: 105,
        species: "Human",
        name: "Elle",
        items: [212, 213],
        friends: [101, 102, 104, 304],
        bestFriend: 104,
      },
      { id: 106, species: "Crocodilian", name: "Dolores", items: [214] },
    ],
    npcs: [
      {
        id: 301,
        type: "Manager",
        species: "Changeling",
        name: "Mordecai",
        items: [],
        friends: [101, 102, 103],
      },
      {
        id: 302,
        type: "Security",
        species: "Rock Monster",
        name: "Bomo",
        items: [],
        friends: [102, 303],
      },
      {
        id: 303,
        type: "Security",
        species: "Rock Monster",
        name: "Sledge",
        items: [],
        friends: [102, 302],
      },

      {
        id: 304,
        type: "Manager",
        species: "Half Elf",
        name: "Tiatha",
        items: [],
        friends: [104, 105],
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
        id: 216,
        name: "Ugly Backpack With a Completely Useless Design",
        type: "Equipment",
        creator: 101,
      },
    ],
  };
}
