export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type ActiveCrawler = Character & Crawler & HasInventory & {
  __typename?: 'ActiveCrawler';
  bestFriend?: Maybe<ActiveCrawler>;
  crawlerNumber?: Maybe<Scalars['Int']['output']>;
  favouriteItem?: Maybe<Item>;
  friends?: Maybe<Array<Maybe<Character>>>;
  id: Scalars['Int']['output'];
  items?: Maybe<Array<Maybe<Item>>>;
  name: Scalars['String']['output'];
  species?: Maybe<Species>;
};

export type BetaLocation = Location & {
  __typename?: 'BetaLocation';
  floors: Array<Floor>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type Character = {
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type Club = Location & {
  __typename?: 'Club';
  floors: Array<Floor>;
  id: Scalars['Int']['output'];
  manager?: Maybe<Npc>;
  name: Scalars['String']['output'];
  security?: Maybe<Array<Security>>;
  stock?: Maybe<Array<Maybe<ClubStock>>>;
  tagline: Scalars['String']['output'];
};

export type ClubStock = Consumable | MiscItem | UtilityItem;

export type Consumable = Created & HasContents & Item & {
  __typename?: 'Consumable';
  contents?: Maybe<Array<Maybe<Item>>>;
  creator?: Maybe<Crawler>;
  effect?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

export type Crawler = {
  crawlerNumber?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type Created = {
  creator?: Maybe<Crawler>;
};

export type DeletedCrawler = Character & Crawler & {
  __typename?: 'DeletedCrawler';
  crawlerNumber?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type Equipment = Created & HasContents & Item & {
  __typename?: 'Equipment';
  contents?: Maybe<Array<Maybe<Item>>>;
  creator?: Maybe<Crawler>;
  currentDurability?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  maxDurability?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type Floor = {
  __typename?: 'Floor';
  locations?: Maybe<Array<Maybe<Location>>>;
  number: Scalars['Int']['output'];
};

export type Guide = Character & Npc & {
  __typename?: 'Guide';
  bestFriend?: Maybe<Character>;
  exCrawler?: Maybe<Scalars['Boolean']['output']>;
  friends?: Maybe<Array<Maybe<Character>>>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  saferoomLocation?: Maybe<Scalars['String']['output']>;
  species?: Maybe<Species>;
};

export type HasContents = {
  contents?: Maybe<Array<Maybe<Item>>>;
};

export type HasInventory = {
  items?: Maybe<Array<Maybe<Item>>>;
};

export type Item = {
  id: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

export enum ItemType {
  Consumable = 'Consumable',
  Equipment = 'Equipment',
  MiscItem = 'MiscItem',
  UtilityItem = 'UtilityItem'
}

export type Location = {
  floors: Array<Floor>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type LootBox = {
  __typename?: 'LootBox';
  id: Scalars['Int']['output'];
};

export type LootData = {
  __typename?: 'LootData';
  id: Scalars['Int']['output'];
  itemId: Scalars['Int']['output'];
  itemType: Scalars['String']['output'];
  lootBoxId: Scalars['Int']['output'];
  percentageChance?: Maybe<Scalars['Int']['output']>;
};

export type Manager = Character & HasInventory & Npc & {
  __typename?: 'Manager';
  bestFriend?: Maybe<Character>;
  client?: Maybe<ActiveCrawler>;
  exCrawler?: Maybe<Scalars['Boolean']['output']>;
  friends?: Maybe<Array<Maybe<Character>>>;
  id: Scalars['Int']['output'];
  items?: Maybe<Array<Maybe<Item>>>;
  name: Scalars['String']['output'];
  species?: Maybe<Species>;
};

export type MiscItem = Item & {
  __typename?: 'MiscItem';
  id: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

export type Npc = {
  bestFriend?: Maybe<Character>;
  exCrawler?: Maybe<Scalars['Boolean']['output']>;
  friends?: Maybe<Array<Maybe<Character>>>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  species?: Maybe<Species>;
};

export type Query = {
  __typename?: 'Query';
  /**
   * Returns the value "Utility:999" which indicates a typeName of
   * "Utility", which does not exist. The correct typeName is "UtilityItem",
   * but we want to test when the value is wrong.
   */
  brokenItem?: Maybe<Item>;
  character?: Maybe<Character>;
  crawler?: Maybe<Crawler>;
  floor?: Maybe<Floor>;
  item?: Maybe<Item>;
};


export type QueryCharacterArgs = {
  id: Scalars['Int']['input'];
};


export type QueryCrawlerArgs = {
  id: Scalars['Int']['input'];
};


export type QueryFloorArgs = {
  number: Scalars['Int']['input'];
};


export type QueryItemArgs = {
  id: Scalars['Int']['input'];
  type: ItemType;
};

export type SafeRoom = Location & {
  __typename?: 'SafeRoom';
  floors: Array<Floor>;
  hasPersonalSpace?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['Int']['output'];
  manager?: Maybe<Npc>;
  name: Scalars['String']['output'];
  stock?: Maybe<Array<Maybe<SafeRoomStock>>>;
};

export type SafeRoomStock = Consumable | Equipment | MiscItem;

export type Security = Character & Npc & {
  __typename?: 'Security';
  bestFriend?: Maybe<Character>;
  clients?: Maybe<Array<ActiveCrawler>>;
  exCrawler?: Maybe<Scalars['Boolean']['output']>;
  friends?: Maybe<Array<Maybe<Character>>>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  species?: Maybe<Species>;
};

export enum Species {
  Bopca = 'BOPCA',
  Cat = 'CAT',
  Changeling = 'CHANGELING',
  Crocodilian = 'CROCODILIAN',
  Gondii = 'GONDII',
  HalfElf = 'HALF_ELF',
  Human = 'HUMAN',
  RockMonster = 'ROCK_MONSTER'
}

export type Staff = Character & HasInventory & Npc & {
  __typename?: 'Staff';
  bestFriend?: Maybe<Character>;
  exCrawler?: Maybe<Scalars['Boolean']['output']>;
  friends?: Maybe<Array<Maybe<Character>>>;
  id: Scalars['Int']['output'];
  items?: Maybe<Array<Maybe<Item>>>;
  name: Scalars['String']['output'];
  species?: Maybe<Species>;
};

export type Stairwell = Location & {
  __typename?: 'Stairwell';
  floors: Array<Floor>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type UtilityItem = Item & {
  __typename?: 'UtilityItem';
  id: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

// Generated GraphQL SDK (auto-generated – do not edit)

import type { EnumPlan, FieldPlan, InputFieldPlan, GrafastSchemaSpec, InputObjectPlan, InterfacePlan, ObjectPlan, ScalarPlan, Step, UnionPlan } from '../../dist';
import { makeGrafastSchema } from '../../dist';
import type { Overrides } from './dcc-type-overrides.ts';

type NoArguments = Record<string, never>;

type Get<
  TTypeName extends string,
  TProp extends string,
  TFallback = any,
> = TTypeName extends keyof Overrides
  ? TProp extends keyof Overrides[TTypeName]
    ? NonNullable<Overrides[TTypeName][TProp]>
    : TFallback
  : TFallback;

export interface TypedGrafastSchemaSpec extends Omit<GrafastSchemaSpec, 'objectPlans' | 'interfacePlans' | 'unionPlans' | 'inputObjectPlans' | 'scalarPlans' | 'enumPlans'> {
  objectPlans?: {
    ActiveCrawler?: Omit<ObjectPlan<Get<"ActiveCrawler", "source", Step>>, 'fields'> & {
      fields?: {
        bestFriend?: FieldPlan<Get<"ActiveCrawler", "source", Step>, NoArguments, any>;
        crawlerNumber?: FieldPlan<Get<"ActiveCrawler", "source", Step>, NoArguments, any>;
        favouriteItem?: FieldPlan<Get<"ActiveCrawler", "source", Step>, NoArguments, any>;
        friends?: FieldPlan<Get<"ActiveCrawler", "source", Step>, NoArguments, any>;
        id?: FieldPlan<Get<"ActiveCrawler", "source", Step>, NoArguments, any>;
        items?: FieldPlan<Get<"ActiveCrawler", "source", Step>, NoArguments, any>;
        name?: FieldPlan<Get<"ActiveCrawler", "source", Step>, NoArguments, any>;
        species?: FieldPlan<Get<"ActiveCrawler", "source", Step>, NoArguments, any>;
      }
    };
    BetaLocation?: Omit<ObjectPlan<Get<"BetaLocation", "source", Step>>, 'fields'> & {
      fields?: {
        floors?: FieldPlan<Get<"BetaLocation", "source", Step>, NoArguments, any>;
        id?: FieldPlan<Get<"BetaLocation", "source", Step>, NoArguments, any>;
        name?: FieldPlan<Get<"BetaLocation", "source", Step>, NoArguments, any>;
      }
    };
    Club?: Omit<ObjectPlan<Get<"Club", "source", Step>>, 'fields'> & {
      fields?: {
        floors?: FieldPlan<Get<"Club", "source", Step>, NoArguments, any>;
        id?: FieldPlan<Get<"Club", "source", Step>, NoArguments, any>;
        manager?: FieldPlan<Get<"Club", "source", Step>, NoArguments, any>;
        name?: FieldPlan<Get<"Club", "source", Step>, NoArguments, any>;
        security?: FieldPlan<Get<"Club", "source", Step>, NoArguments, any>;
        stock?: FieldPlan<Get<"Club", "source", Step>, NoArguments, any>;
        tagline?: FieldPlan<Get<"Club", "source", Step>, NoArguments, any>;
      }
    };
    Consumable?: Omit<ObjectPlan<Get<"Consumable", "source", Step>>, 'fields'> & {
      fields?: {
        contents?: FieldPlan<Get<"Consumable", "source", Step>, NoArguments, any>;
        creator?: FieldPlan<Get<"Consumable", "source", Step>, NoArguments, any>;
        effect?: FieldPlan<Get<"Consumable", "source", Step>, NoArguments, any>;
        id?: FieldPlan<Get<"Consumable", "source", Step>, NoArguments, any>;
        name?: FieldPlan<Get<"Consumable", "source", Step>, NoArguments, any>;
      }
    };
    DeletedCrawler?: Omit<ObjectPlan<Get<"DeletedCrawler", "source", Step>>, 'fields'> & {
      fields?: {
        crawlerNumber?: FieldPlan<Get<"DeletedCrawler", "source", Step>, NoArguments, any>;
        id?: FieldPlan<Get<"DeletedCrawler", "source", Step>, NoArguments, any>;
        name?: FieldPlan<Get<"DeletedCrawler", "source", Step>, NoArguments, any>;
      }
    };
    Equipment?: Omit<ObjectPlan<Get<"Equipment", "source", Step>>, 'fields'> & {
      fields?: {
        contents?: FieldPlan<Get<"Equipment", "source", Step>, NoArguments, any>;
        creator?: FieldPlan<Get<"Equipment", "source", Step>, NoArguments, any>;
        currentDurability?: FieldPlan<Get<"Equipment", "source", Step>, NoArguments, any>;
        id?: FieldPlan<Get<"Equipment", "source", Step>, NoArguments, any>;
        maxDurability?: FieldPlan<Get<"Equipment", "source", Step>, NoArguments, any>;
        name?: FieldPlan<Get<"Equipment", "source", Step>, NoArguments, any>;
      }
    };
    Floor?: Omit<ObjectPlan<Get<"Floor", "source", Step>>, 'fields'> & {
      fields?: {
        locations?: FieldPlan<Get<"Floor", "source", Step>, NoArguments, any>;
        number?: FieldPlan<Get<"Floor", "source", Step>, NoArguments, any>;
      }
    };
    Guide?: Omit<ObjectPlan<Get<"Guide", "source", Step>>, 'fields'> & {
      fields?: {
        bestFriend?: FieldPlan<Get<"Guide", "source", Step>, NoArguments, any>;
        exCrawler?: FieldPlan<Get<"Guide", "source", Step>, NoArguments, any>;
        friends?: FieldPlan<Get<"Guide", "source", Step>, NoArguments, any>;
        id?: FieldPlan<Get<"Guide", "source", Step>, NoArguments, any>;
        name?: FieldPlan<Get<"Guide", "source", Step>, NoArguments, any>;
        saferoomLocation?: FieldPlan<Get<"Guide", "source", Step>, NoArguments, any>;
        species?: FieldPlan<Get<"Guide", "source", Step>, NoArguments, any>;
      }
    };
    LootBox?: Omit<ObjectPlan<Get<"LootBox", "source", Step>>, 'fields'> & {
      fields?: {
        id?: FieldPlan<Get<"LootBox", "source", Step>, NoArguments, any>;
      }
    };
    LootData?: Omit<ObjectPlan<Get<"LootData", "source", Step>>, 'fields'> & {
      fields?: {
        id?: FieldPlan<Get<"LootData", "source", Step>, NoArguments, any>;
        itemId?: FieldPlan<Get<"LootData", "source", Step>, NoArguments, any>;
        itemType?: FieldPlan<Get<"LootData", "source", Step>, NoArguments, any>;
        lootBoxId?: FieldPlan<Get<"LootData", "source", Step>, NoArguments, any>;
        percentageChance?: FieldPlan<Get<"LootData", "source", Step>, NoArguments, any>;
      }
    };
    Manager?: Omit<ObjectPlan<Get<"Manager", "source", Step>>, 'fields'> & {
      fields?: {
        bestFriend?: FieldPlan<Get<"Manager", "source", Step>, NoArguments, any>;
        client?: FieldPlan<Get<"Manager", "source", Step>, NoArguments, any>;
        exCrawler?: FieldPlan<Get<"Manager", "source", Step>, NoArguments, any>;
        friends?: FieldPlan<Get<"Manager", "source", Step>, NoArguments, any>;
        id?: FieldPlan<Get<"Manager", "source", Step>, NoArguments, any>;
        items?: FieldPlan<Get<"Manager", "source", Step>, NoArguments, any>;
        name?: FieldPlan<Get<"Manager", "source", Step>, NoArguments, any>;
        species?: FieldPlan<Get<"Manager", "source", Step>, NoArguments, any>;
      }
    };
    MiscItem?: Omit<ObjectPlan<Get<"MiscItem", "source", Step>>, 'fields'> & {
      fields?: {
        id?: FieldPlan<Get<"MiscItem", "source", Step>, NoArguments, any>;
        name?: FieldPlan<Get<"MiscItem", "source", Step>, NoArguments, any>;
      }
    };
    Query?: Omit<ObjectPlan<Get<"Query", "source", Step>>, 'fields'> & {
      fields?: {
        brokenItem?: FieldPlan<Get<"Query", "source", Step>, NoArguments, any>;
        character?: FieldPlan<Get<"Query", "source", Step>, QueryCharacterArgs, any>;
        crawler?: FieldPlan<Get<"Query", "source", Step>, QueryCrawlerArgs, any>;
        floor?: FieldPlan<Get<"Query", "source", Step>, QueryFloorArgs, any>;
        item?: FieldPlan<Get<"Query", "source", Step>, QueryItemArgs, any>;
      }
    };
    SafeRoom?: Omit<ObjectPlan<Get<"SafeRoom", "source", Step>>, 'fields'> & {
      fields?: {
        floors?: FieldPlan<Get<"SafeRoom", "source", Step>, NoArguments, any>;
        hasPersonalSpace?: FieldPlan<Get<"SafeRoom", "source", Step>, NoArguments, any>;
        id?: FieldPlan<Get<"SafeRoom", "source", Step>, NoArguments, any>;
        manager?: FieldPlan<Get<"SafeRoom", "source", Step>, NoArguments, any>;
        name?: FieldPlan<Get<"SafeRoom", "source", Step>, NoArguments, any>;
        stock?: FieldPlan<Get<"SafeRoom", "source", Step>, NoArguments, any>;
      }
    };
    Security?: Omit<ObjectPlan<Get<"Security", "source", Step>>, 'fields'> & {
      fields?: {
        bestFriend?: FieldPlan<Get<"Security", "source", Step>, NoArguments, any>;
        clients?: FieldPlan<Get<"Security", "source", Step>, NoArguments, any>;
        exCrawler?: FieldPlan<Get<"Security", "source", Step>, NoArguments, any>;
        friends?: FieldPlan<Get<"Security", "source", Step>, NoArguments, any>;
        id?: FieldPlan<Get<"Security", "source", Step>, NoArguments, any>;
        name?: FieldPlan<Get<"Security", "source", Step>, NoArguments, any>;
        species?: FieldPlan<Get<"Security", "source", Step>, NoArguments, any>;
      }
    };
    Staff?: Omit<ObjectPlan<Get<"Staff", "source", Step>>, 'fields'> & {
      fields?: {
        bestFriend?: FieldPlan<Get<"Staff", "source", Step>, NoArguments, any>;
        exCrawler?: FieldPlan<Get<"Staff", "source", Step>, NoArguments, any>;
        friends?: FieldPlan<Get<"Staff", "source", Step>, NoArguments, any>;
        id?: FieldPlan<Get<"Staff", "source", Step>, NoArguments, any>;
        items?: FieldPlan<Get<"Staff", "source", Step>, NoArguments, any>;
        name?: FieldPlan<Get<"Staff", "source", Step>, NoArguments, any>;
        species?: FieldPlan<Get<"Staff", "source", Step>, NoArguments, any>;
      }
    };
    Stairwell?: Omit<ObjectPlan<Get<"Stairwell", "source", Step>>, 'fields'> & {
      fields?: {
        floors?: FieldPlan<Get<"Stairwell", "source", Step>, NoArguments, any>;
        id?: FieldPlan<Get<"Stairwell", "source", Step>, NoArguments, any>;
        name?: FieldPlan<Get<"Stairwell", "source", Step>, NoArguments, any>;
      }
    };
    UtilityItem?: Omit<ObjectPlan<Get<"UtilityItem", "source", Step>>, 'fields'> & {
      fields?: {
        id?: FieldPlan<Get<"UtilityItem", "source", Step>, NoArguments, any>;
        name?: FieldPlan<Get<"UtilityItem", "source", Step>, NoArguments, any>;
      }
    };
  }
  interfacePlans?: {
    Character?: InterfacePlan<
      Get<"Character", "source", Step>,
      Get<"Character", "specifier", Get<"Character", "source", Step>>
    >;
    Crawler?: InterfacePlan<
      Get<"Crawler", "source", Step>,
      Get<"Crawler", "specifier", Get<"Crawler", "source", Step>>
    >;
    Created?: InterfacePlan<
      Get<"Created", "source", Step>,
      Get<"Created", "specifier", Get<"Created", "source", Step>>
    >;
    HasContents?: InterfacePlan<
      Get<"HasContents", "source", Step>,
      Get<"HasContents", "specifier", Get<"HasContents", "source", Step>>
    >;
    HasInventory?: InterfacePlan<
      Get<"HasInventory", "source", Step>,
      Get<"HasInventory", "specifier", Get<"HasInventory", "source", Step>>
    >;
    Item?: InterfacePlan<
      Get<"Item", "source", Step>,
      Get<"Item", "specifier", Get<"Item", "source", Step>>
    >;
    Location?: InterfacePlan<
      Get<"Location", "source", Step>,
      Get<"Location", "specifier", Get<"Location", "source", Step>>
    >;
    NPC?: InterfacePlan<
      Get<"NPC", "source", Step>,
      Get<"NPC", "specifier", Get<"NPC", "source", Step>>
    >;
  }
  unionPlans?: {
    ClubStock?: UnionPlan<
      Get<"ClubStock", "source", Step>,
      Get<"ClubStock", "specifier", Get<"ClubStock", "source", Step>>
    >;
    SafeRoomStock?: UnionPlan<
      Get<"SafeRoomStock", "source", Step>,
      Get<"SafeRoomStock", "specifier", Get<"SafeRoomStock", "source", Step>>
    >;
  }
  inputObjectPlans?: {
  }
  scalarPlans?: {
    Boolean?: ScalarPlan;
    Int?: ScalarPlan;
    String?: ScalarPlan;
  }
  enumPlans?: {
    ItemType?: EnumPlan;
    Species?: EnumPlan;
  }
};

export function typedMakeGrafastSchema(spec: TypedGrafastSchemaSpec) {
  return makeGrafastSchema(spec);
}
