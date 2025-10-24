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
  _RawJSON: { input: any; output: any; }
};

export type ActiveCrawler = Character & Crawler & HasInventory & {
  __typename?: 'ActiveCrawler';
  bestFriend?: Maybe<ActiveCrawler>;
  crawlerNumber?: Maybe<Scalars['Int']['output']>;
  favouriteItem?: Maybe<Item>;
  friends?: Maybe<Array<Maybe<Character>>>;
  friendsConnection?: Maybe<CharacterConnection>;
  id: Scalars['Int']['output'];
  items?: Maybe<Array<Maybe<Item>>>;
  itemsConnection?: Maybe<ItemConnection>;
  name: Scalars['String']['output'];
  species?: Maybe<Species>;
};


export type ActiveCrawlerFriendsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type ActiveCrawlerFriendsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type ActiveCrawlerItemsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type ActiveCrawlerItemsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
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

export type CharacterConnection = {
  __typename?: 'CharacterConnection';
  edges?: Maybe<Array<Maybe<CharacterEdge>>>;
  nodes?: Maybe<Array<Maybe<Character>>>;
  pageInfo: PageInfo;
};

export type CharacterEdge = {
  __typename?: 'CharacterEdge';
  cursor: Scalars['String']['output'];
  node?: Maybe<Character>;
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
  canBeFoundIn?: Maybe<Array<Maybe<LootBox>>>;
  contents?: Maybe<Array<Maybe<Item>>>;
  creator?: Maybe<Crawler>;
  effect?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
};


export type ConsumableContentsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
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
  canBeFoundIn?: Maybe<Array<Maybe<LootBox>>>;
  contents?: Maybe<Array<Maybe<Item>>>;
  creator?: Maybe<Crawler>;
  currentDurability?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  maxDurability?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};


export type EquipmentContentsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
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


export type GuideFriendsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
};

export type HasContents = {
  contents?: Maybe<Array<Maybe<Item>>>;
};


export type HasContentsContentsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
};

export type HasInventory = {
  items?: Maybe<Array<Maybe<Item>>>;
  itemsConnection?: Maybe<ItemConnection>;
};


export type HasInventoryItemsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type HasInventoryItemsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type Item = {
  canBeFoundIn?: Maybe<Array<Maybe<LootBox>>>;
  id: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

export type ItemConnection = {
  __typename?: 'ItemConnection';
  edges?: Maybe<Array<Maybe<ItemEdge>>>;
  nodes?: Maybe<Array<Maybe<Item>>>;
  pageInfo: PageInfo;
};

export type ItemEdge = {
  __typename?: 'ItemEdge';
  cursor: Scalars['String']['output'];
  node?: Maybe<Item>;
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
  category?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  possibleItems?: Maybe<Array<Maybe<Item>>>;
  tier?: Maybe<Scalars['String']['output']>;
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
  itemsConnection?: Maybe<ItemConnection>;
  name: Scalars['String']['output'];
  species?: Maybe<Species>;
};


export type ManagerFriendsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type ManagerItemsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type ManagerItemsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type MiscItem = Item & {
  __typename?: 'MiscItem';
  canBeFoundIn?: Maybe<Array<Maybe<LootBox>>>;
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


export type NpcFriendsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
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
  npc?: Maybe<Npc>;
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


export type QueryNpcArgs = {
  id: Scalars['Int']['input'];
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


export type SecurityFriendsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
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
  itemsConnection?: Maybe<ItemConnection>;
  name: Scalars['String']['output'];
  species?: Maybe<Species>;
};


export type StaffFriendsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type StaffItemsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type StaffItemsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type Stairwell = Location & {
  __typename?: 'Stairwell';
  floors: Array<Floor>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type UtilityItem = Item & {
  __typename?: 'UtilityItem';
  canBeFoundIn?: Maybe<Array<Maybe<LootBox>>>;
  id: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

// Generated GraphQL SDK (auto-generated – do not edit)

import type { EnumPlan, EnumValueInput, FieldPlan, InputFieldPlan, GrafastSchemaConfig, InputObjectPlan, InterfacePlan, ObjectPlan, ScalarPlan, Step, UnionPlan, StepRepresentingList } from '../../dist/index.js';
import { makeGrafastSchema } from '../../dist/index.js';
import type { Overrides } from './dcc-type-overrides.ts';

type NoArguments = Record<string, never>;
type NonNullStep<TStep extends Step> = TStep & Step<TStep extends Step<infer U> ? NonNullable<U> : any>;
type ListOfStep<TStep extends Step> = StepRepresentingList<TStep extends Step<infer U> ? U : any, TStep>;
type StepData<TStep extends Step> = TStep extends Step<infer U> ? U : never;

type Get<
  TTypeName extends string,
  TProp extends string,
  TFallback = any,
> = TTypeName extends keyof Overrides
  ? TProp extends keyof Overrides[TTypeName]
    ? NonNullable<Overrides[TTypeName][TProp]>
    : TFallback
  : TFallback;

export interface TypedGrafastSchemaSpec extends Omit<GrafastSchemaConfig, 'objects' | 'interfaces' | 'unions' | 'inputObjects' | 'scalars' | 'enums'> {
  objects?: {
    ActiveCrawler?: Omit<ObjectPlan<Get<"ActiveCrawler", "source", NonNullStep<Get<"ActiveCrawler", "nullable", Step>>>>, 'plans'> & {
      plans?: {
        bestFriend?: FieldPlan<Get<"ActiveCrawler", "source", NonNullStep<Get<"ActiveCrawler", "nullable", Step>>>, NoArguments, Get<"ActiveCrawler", "nullable", Step>>;
        crawlerNumber?: FieldPlan<Get<"ActiveCrawler", "source", NonNullStep<Get<"ActiveCrawler", "nullable", Step>>>, NoArguments, Get<"Int", "nullable", Step>>;
        favouriteItem?: FieldPlan<Get<"ActiveCrawler", "source", NonNullStep<Get<"ActiveCrawler", "nullable", Step>>>, NoArguments, Get<"Item", "nullable", Step>>;
        friends?: FieldPlan<Get<"ActiveCrawler", "source", NonNullStep<Get<"ActiveCrawler", "nullable", Step>>>, ActiveCrawlerFriendsArgs, Get<"Character", "list", ListOfStep<Get<"Character", "nullable", Step>>>>;
        friendsConnection?: FieldPlan<Get<"ActiveCrawler", "source", NonNullStep<Get<"ActiveCrawler", "nullable", Step>>>, ActiveCrawlerFriendsConnectionArgs, Get<"CharacterConnection", "nullable", Step>>;
        id?: FieldPlan<Get<"ActiveCrawler", "source", NonNullStep<Get<"ActiveCrawler", "nullable", Step>>>, NoArguments, NonNullStep<Get<"Int", "nullable", Step>>>;
        items?: FieldPlan<Get<"ActiveCrawler", "source", NonNullStep<Get<"ActiveCrawler", "nullable", Step>>>, ActiveCrawlerItemsArgs, Get<"Item", "list", ListOfStep<Get<"Item", "nullable", Step>>>>;
        itemsConnection?: FieldPlan<Get<"ActiveCrawler", "source", NonNullStep<Get<"ActiveCrawler", "nullable", Step>>>, ActiveCrawlerItemsConnectionArgs, Get<"ItemConnection", "nullable", Step>>;
        name?: FieldPlan<Get<"ActiveCrawler", "source", NonNullStep<Get<"ActiveCrawler", "nullable", Step>>>, NoArguments, NonNullStep<Get<"String", "nullable", Step>>>;
        species?: FieldPlan<Get<"ActiveCrawler", "source", NonNullStep<Get<"ActiveCrawler", "nullable", Step>>>, NoArguments, Get<"Species", "nullable", Step>>;
      }
    };
    BetaLocation?: Omit<ObjectPlan<Get<"BetaLocation", "source", NonNullStep<Get<"BetaLocation", "nullable", Step>>>>, 'plans'> & {
      plans?: {
        floors?: FieldPlan<Get<"BetaLocation", "source", NonNullStep<Get<"BetaLocation", "nullable", Step>>>, NoArguments, NonNullStep<Get<"Floor", "list", ListOfStep<NonNullStep<Get<"Floor", "nullable", Step>>>>>>;
        id?: FieldPlan<Get<"BetaLocation", "source", NonNullStep<Get<"BetaLocation", "nullable", Step>>>, NoArguments, NonNullStep<Get<"Int", "nullable", Step>>>;
        name?: FieldPlan<Get<"BetaLocation", "source", NonNullStep<Get<"BetaLocation", "nullable", Step>>>, NoArguments, NonNullStep<Get<"String", "nullable", Step>>>;
      }
    };
    CharacterConnection?: Omit<ObjectPlan<Get<"CharacterConnection", "source", NonNullStep<Get<"CharacterConnection", "nullable", Step>>>>, 'plans'> & {
      plans?: {
        edges?: FieldPlan<Get<"CharacterConnection", "source", NonNullStep<Get<"CharacterConnection", "nullable", Step>>>, NoArguments, Get<"CharacterEdge", "list", ListOfStep<Get<"CharacterEdge", "nullable", Step>>>>;
        nodes?: FieldPlan<Get<"CharacterConnection", "source", NonNullStep<Get<"CharacterConnection", "nullable", Step>>>, NoArguments, Get<"Character", "list", ListOfStep<Get<"Character", "nullable", Step>>>>;
        pageInfo?: FieldPlan<Get<"CharacterConnection", "source", NonNullStep<Get<"CharacterConnection", "nullable", Step>>>, NoArguments, NonNullStep<Get<"PageInfo", "nullable", Step>>>;
      }
    };
    CharacterEdge?: Omit<ObjectPlan<Get<"CharacterEdge", "source", NonNullStep<Get<"CharacterEdge", "nullable", Step>>>>, 'plans'> & {
      plans?: {
        cursor?: FieldPlan<Get<"CharacterEdge", "source", NonNullStep<Get<"CharacterEdge", "nullable", Step>>>, NoArguments, NonNullStep<Get<"String", "nullable", Step>>>;
        node?: FieldPlan<Get<"CharacterEdge", "source", NonNullStep<Get<"CharacterEdge", "nullable", Step>>>, NoArguments, Get<"Character", "nullable", Step>>;
      }
    };
    Club?: Omit<ObjectPlan<Get<"Club", "source", NonNullStep<Get<"Club", "nullable", Step>>>>, 'plans'> & {
      plans?: {
        floors?: FieldPlan<Get<"Club", "source", NonNullStep<Get<"Club", "nullable", Step>>>, NoArguments, NonNullStep<Get<"Floor", "list", ListOfStep<NonNullStep<Get<"Floor", "nullable", Step>>>>>>;
        id?: FieldPlan<Get<"Club", "source", NonNullStep<Get<"Club", "nullable", Step>>>, NoArguments, NonNullStep<Get<"Int", "nullable", Step>>>;
        manager?: FieldPlan<Get<"Club", "source", NonNullStep<Get<"Club", "nullable", Step>>>, NoArguments, Get<"NPC", "nullable", Step>>;
        name?: FieldPlan<Get<"Club", "source", NonNullStep<Get<"Club", "nullable", Step>>>, NoArguments, NonNullStep<Get<"String", "nullable", Step>>>;
        security?: FieldPlan<Get<"Club", "source", NonNullStep<Get<"Club", "nullable", Step>>>, NoArguments, Get<"Security", "list", ListOfStep<NonNullStep<Get<"Security", "nullable", Step>>>>>;
        stock?: FieldPlan<Get<"Club", "source", NonNullStep<Get<"Club", "nullable", Step>>>, NoArguments, Get<"ClubStock", "list", ListOfStep<Get<"ClubStock", "nullable", Step>>>>;
        tagline?: FieldPlan<Get<"Club", "source", NonNullStep<Get<"Club", "nullable", Step>>>, NoArguments, NonNullStep<Get<"String", "nullable", Step>>>;
      }
    };
    Consumable?: Omit<ObjectPlan<Get<"Consumable", "source", NonNullStep<Get<"Consumable", "nullable", Step>>>>, 'plans'> & {
      plans?: {
        canBeFoundIn?: FieldPlan<Get<"Consumable", "source", NonNullStep<Get<"Consumable", "nullable", Step>>>, NoArguments, Get<"LootBox", "list", ListOfStep<Get<"LootBox", "nullable", Step>>>>;
        contents?: FieldPlan<Get<"Consumable", "source", NonNullStep<Get<"Consumable", "nullable", Step>>>, ConsumableContentsArgs, Get<"Item", "list", ListOfStep<Get<"Item", "nullable", Step>>>>;
        creator?: FieldPlan<Get<"Consumable", "source", NonNullStep<Get<"Consumable", "nullable", Step>>>, NoArguments, Get<"Crawler", "nullable", Step>>;
        effect?: FieldPlan<Get<"Consumable", "source", NonNullStep<Get<"Consumable", "nullable", Step>>>, NoArguments, Get<"String", "nullable", Step>>;
        id?: FieldPlan<Get<"Consumable", "source", NonNullStep<Get<"Consumable", "nullable", Step>>>, NoArguments, NonNullStep<Get<"Int", "nullable", Step>>>;
        name?: FieldPlan<Get<"Consumable", "source", NonNullStep<Get<"Consumable", "nullable", Step>>>, NoArguments, Get<"String", "nullable", Step>>;
      }
    };
    DeletedCrawler?: Omit<ObjectPlan<Get<"DeletedCrawler", "source", NonNullStep<Get<"DeletedCrawler", "nullable", Step>>>>, 'plans'> & {
      plans?: {
        crawlerNumber?: FieldPlan<Get<"DeletedCrawler", "source", NonNullStep<Get<"DeletedCrawler", "nullable", Step>>>, NoArguments, Get<"Int", "nullable", Step>>;
        id?: FieldPlan<Get<"DeletedCrawler", "source", NonNullStep<Get<"DeletedCrawler", "nullable", Step>>>, NoArguments, NonNullStep<Get<"Int", "nullable", Step>>>;
        name?: FieldPlan<Get<"DeletedCrawler", "source", NonNullStep<Get<"DeletedCrawler", "nullable", Step>>>, NoArguments, NonNullStep<Get<"String", "nullable", Step>>>;
      }
    };
    Equipment?: Omit<ObjectPlan<Get<"Equipment", "source", NonNullStep<Get<"Equipment", "nullable", Step>>>>, 'plans'> & {
      plans?: {
        canBeFoundIn?: FieldPlan<Get<"Equipment", "source", NonNullStep<Get<"Equipment", "nullable", Step>>>, NoArguments, Get<"LootBox", "list", ListOfStep<Get<"LootBox", "nullable", Step>>>>;
        contents?: FieldPlan<Get<"Equipment", "source", NonNullStep<Get<"Equipment", "nullable", Step>>>, EquipmentContentsArgs, Get<"Item", "list", ListOfStep<Get<"Item", "nullable", Step>>>>;
        creator?: FieldPlan<Get<"Equipment", "source", NonNullStep<Get<"Equipment", "nullable", Step>>>, NoArguments, Get<"Crawler", "nullable", Step>>;
        currentDurability?: FieldPlan<Get<"Equipment", "source", NonNullStep<Get<"Equipment", "nullable", Step>>>, NoArguments, Get<"Int", "nullable", Step>>;
        id?: FieldPlan<Get<"Equipment", "source", NonNullStep<Get<"Equipment", "nullable", Step>>>, NoArguments, NonNullStep<Get<"Int", "nullable", Step>>>;
        maxDurability?: FieldPlan<Get<"Equipment", "source", NonNullStep<Get<"Equipment", "nullable", Step>>>, NoArguments, Get<"Int", "nullable", Step>>;
        name?: FieldPlan<Get<"Equipment", "source", NonNullStep<Get<"Equipment", "nullable", Step>>>, NoArguments, Get<"String", "nullable", Step>>;
      }
    };
    Floor?: Omit<ObjectPlan<Get<"Floor", "source", NonNullStep<Get<"Floor", "nullable", Step>>>>, 'plans'> & {
      plans?: {
        locations?: FieldPlan<Get<"Floor", "source", NonNullStep<Get<"Floor", "nullable", Step>>>, NoArguments, Get<"Location", "list", ListOfStep<Get<"Location", "nullable", Step>>>>;
        number?: FieldPlan<Get<"Floor", "source", NonNullStep<Get<"Floor", "nullable", Step>>>, NoArguments, NonNullStep<Get<"Int", "nullable", Step>>>;
      }
    };
    Guide?: Omit<ObjectPlan<Get<"Guide", "source", NonNullStep<Get<"Guide", "nullable", Step>>>>, 'plans'> & {
      plans?: {
        bestFriend?: FieldPlan<Get<"Guide", "source", NonNullStep<Get<"Guide", "nullable", Step>>>, NoArguments, Get<"Character", "nullable", Step>>;
        exCrawler?: FieldPlan<Get<"Guide", "source", NonNullStep<Get<"Guide", "nullable", Step>>>, NoArguments, Get<"Boolean", "nullable", Step>>;
        friends?: FieldPlan<Get<"Guide", "source", NonNullStep<Get<"Guide", "nullable", Step>>>, GuideFriendsArgs, Get<"Character", "list", ListOfStep<Get<"Character", "nullable", Step>>>>;
        id?: FieldPlan<Get<"Guide", "source", NonNullStep<Get<"Guide", "nullable", Step>>>, NoArguments, NonNullStep<Get<"Int", "nullable", Step>>>;
        name?: FieldPlan<Get<"Guide", "source", NonNullStep<Get<"Guide", "nullable", Step>>>, NoArguments, NonNullStep<Get<"String", "nullable", Step>>>;
        saferoomLocation?: FieldPlan<Get<"Guide", "source", NonNullStep<Get<"Guide", "nullable", Step>>>, NoArguments, Get<"String", "nullable", Step>>;
        species?: FieldPlan<Get<"Guide", "source", NonNullStep<Get<"Guide", "nullable", Step>>>, NoArguments, Get<"Species", "nullable", Step>>;
      }
    };
    ItemConnection?: Omit<ObjectPlan<Get<"ItemConnection", "source", NonNullStep<Get<"ItemConnection", "nullable", Step>>>>, 'plans'> & {
      plans?: {
        edges?: FieldPlan<Get<"ItemConnection", "source", NonNullStep<Get<"ItemConnection", "nullable", Step>>>, NoArguments, Get<"ItemEdge", "list", ListOfStep<Get<"ItemEdge", "nullable", Step>>>>;
        nodes?: FieldPlan<Get<"ItemConnection", "source", NonNullStep<Get<"ItemConnection", "nullable", Step>>>, NoArguments, Get<"Item", "list", ListOfStep<Get<"Item", "nullable", Step>>>>;
        pageInfo?: FieldPlan<Get<"ItemConnection", "source", NonNullStep<Get<"ItemConnection", "nullable", Step>>>, NoArguments, NonNullStep<Get<"PageInfo", "nullable", Step>>>;
      }
    };
    ItemEdge?: Omit<ObjectPlan<Get<"ItemEdge", "source", NonNullStep<Get<"ItemEdge", "nullable", Step>>>>, 'plans'> & {
      plans?: {
        cursor?: FieldPlan<Get<"ItemEdge", "source", NonNullStep<Get<"ItemEdge", "nullable", Step>>>, NoArguments, NonNullStep<Get<"String", "nullable", Step>>>;
        node?: FieldPlan<Get<"ItemEdge", "source", NonNullStep<Get<"ItemEdge", "nullable", Step>>>, NoArguments, Get<"Item", "nullable", Step>>;
      }
    };
    LootBox?: Omit<ObjectPlan<Get<"LootBox", "source", NonNullStep<Get<"LootBox", "nullable", Step>>>>, 'plans'> & {
      plans?: {
        category?: FieldPlan<Get<"LootBox", "source", NonNullStep<Get<"LootBox", "nullable", Step>>>, NoArguments, Get<"String", "nullable", Step>>;
        id?: FieldPlan<Get<"LootBox", "source", NonNullStep<Get<"LootBox", "nullable", Step>>>, NoArguments, NonNullStep<Get<"Int", "nullable", Step>>>;
        possibleItems?: FieldPlan<Get<"LootBox", "source", NonNullStep<Get<"LootBox", "nullable", Step>>>, NoArguments, Get<"Item", "list", ListOfStep<Get<"Item", "nullable", Step>>>>;
        tier?: FieldPlan<Get<"LootBox", "source", NonNullStep<Get<"LootBox", "nullable", Step>>>, NoArguments, Get<"String", "nullable", Step>>;
      }
    };
    LootData?: Omit<ObjectPlan<Get<"LootData", "source", NonNullStep<Get<"LootData", "nullable", Step>>>>, 'plans'> & {
      plans?: {
        id?: FieldPlan<Get<"LootData", "source", NonNullStep<Get<"LootData", "nullable", Step>>>, NoArguments, NonNullStep<Get<"Int", "nullable", Step>>>;
        itemId?: FieldPlan<Get<"LootData", "source", NonNullStep<Get<"LootData", "nullable", Step>>>, NoArguments, NonNullStep<Get<"Int", "nullable", Step>>>;
        itemType?: FieldPlan<Get<"LootData", "source", NonNullStep<Get<"LootData", "nullable", Step>>>, NoArguments, NonNullStep<Get<"String", "nullable", Step>>>;
        lootBoxId?: FieldPlan<Get<"LootData", "source", NonNullStep<Get<"LootData", "nullable", Step>>>, NoArguments, NonNullStep<Get<"Int", "nullable", Step>>>;
        percentageChance?: FieldPlan<Get<"LootData", "source", NonNullStep<Get<"LootData", "nullable", Step>>>, NoArguments, Get<"Int", "nullable", Step>>;
      }
    };
    Manager?: Omit<ObjectPlan<Get<"Manager", "source", NonNullStep<Get<"Manager", "nullable", Step>>>>, 'plans'> & {
      plans?: {
        bestFriend?: FieldPlan<Get<"Manager", "source", NonNullStep<Get<"Manager", "nullable", Step>>>, NoArguments, Get<"Character", "nullable", Step>>;
        client?: FieldPlan<Get<"Manager", "source", NonNullStep<Get<"Manager", "nullable", Step>>>, NoArguments, Get<"ActiveCrawler", "nullable", Step>>;
        exCrawler?: FieldPlan<Get<"Manager", "source", NonNullStep<Get<"Manager", "nullable", Step>>>, NoArguments, Get<"Boolean", "nullable", Step>>;
        friends?: FieldPlan<Get<"Manager", "source", NonNullStep<Get<"Manager", "nullable", Step>>>, ManagerFriendsArgs, Get<"Character", "list", ListOfStep<Get<"Character", "nullable", Step>>>>;
        id?: FieldPlan<Get<"Manager", "source", NonNullStep<Get<"Manager", "nullable", Step>>>, NoArguments, NonNullStep<Get<"Int", "nullable", Step>>>;
        items?: FieldPlan<Get<"Manager", "source", NonNullStep<Get<"Manager", "nullable", Step>>>, ManagerItemsArgs, Get<"Item", "list", ListOfStep<Get<"Item", "nullable", Step>>>>;
        itemsConnection?: FieldPlan<Get<"Manager", "source", NonNullStep<Get<"Manager", "nullable", Step>>>, ManagerItemsConnectionArgs, Get<"ItemConnection", "nullable", Step>>;
        name?: FieldPlan<Get<"Manager", "source", NonNullStep<Get<"Manager", "nullable", Step>>>, NoArguments, NonNullStep<Get<"String", "nullable", Step>>>;
        species?: FieldPlan<Get<"Manager", "source", NonNullStep<Get<"Manager", "nullable", Step>>>, NoArguments, Get<"Species", "nullable", Step>>;
      }
    };
    MiscItem?: Omit<ObjectPlan<Get<"MiscItem", "source", NonNullStep<Get<"MiscItem", "nullable", Step>>>>, 'plans'> & {
      plans?: {
        canBeFoundIn?: FieldPlan<Get<"MiscItem", "source", NonNullStep<Get<"MiscItem", "nullable", Step>>>, NoArguments, Get<"LootBox", "list", ListOfStep<Get<"LootBox", "nullable", Step>>>>;
        id?: FieldPlan<Get<"MiscItem", "source", NonNullStep<Get<"MiscItem", "nullable", Step>>>, NoArguments, NonNullStep<Get<"Int", "nullable", Step>>>;
        name?: FieldPlan<Get<"MiscItem", "source", NonNullStep<Get<"MiscItem", "nullable", Step>>>, NoArguments, Get<"String", "nullable", Step>>;
      }
    };
    PageInfo?: Omit<ObjectPlan<Get<"PageInfo", "source", NonNullStep<Get<"PageInfo", "nullable", Step>>>>, 'plans'> & {
      plans?: {
        endCursor?: FieldPlan<Get<"PageInfo", "source", NonNullStep<Get<"PageInfo", "nullable", Step>>>, NoArguments, Get<"String", "nullable", Step>>;
        hasNextPage?: FieldPlan<Get<"PageInfo", "source", NonNullStep<Get<"PageInfo", "nullable", Step>>>, NoArguments, NonNullStep<Get<"Boolean", "nullable", Step>>>;
        hasPreviousPage?: FieldPlan<Get<"PageInfo", "source", NonNullStep<Get<"PageInfo", "nullable", Step>>>, NoArguments, NonNullStep<Get<"Boolean", "nullable", Step>>>;
        startCursor?: FieldPlan<Get<"PageInfo", "source", NonNullStep<Get<"PageInfo", "nullable", Step>>>, NoArguments, Get<"String", "nullable", Step>>;
      }
    };
    Query?: Omit<ObjectPlan<Get<"Query", "source", NonNullStep<Get<"Query", "nullable", Step>>>>, 'plans'> & {
      plans?: {
        brokenItem?: FieldPlan<Get<"Query", "source", NonNullStep<Get<"Query", "nullable", Step>>>, NoArguments, Get<"Item", "nullable", Step>>;
        character?: FieldPlan<Get<"Query", "source", NonNullStep<Get<"Query", "nullable", Step>>>, QueryCharacterArgs, Get<"Character", "nullable", Step>>;
        crawler?: FieldPlan<Get<"Query", "source", NonNullStep<Get<"Query", "nullable", Step>>>, QueryCrawlerArgs, Get<"Crawler", "nullable", Step>>;
        floor?: FieldPlan<Get<"Query", "source", NonNullStep<Get<"Query", "nullable", Step>>>, QueryFloorArgs, Get<"Floor", "nullable", Step>>;
        item?: FieldPlan<Get<"Query", "source", NonNullStep<Get<"Query", "nullable", Step>>>, QueryItemArgs, Get<"Item", "nullable", Step>>;
        npc?: FieldPlan<Get<"Query", "source", NonNullStep<Get<"Query", "nullable", Step>>>, QueryNpcArgs, Get<"NPC", "nullable", Step>>;
      }
    };
    SafeRoom?: Omit<ObjectPlan<Get<"SafeRoom", "source", NonNullStep<Get<"SafeRoom", "nullable", Step>>>>, 'plans'> & {
      plans?: {
        floors?: FieldPlan<Get<"SafeRoom", "source", NonNullStep<Get<"SafeRoom", "nullable", Step>>>, NoArguments, NonNullStep<Get<"Floor", "list", ListOfStep<NonNullStep<Get<"Floor", "nullable", Step>>>>>>;
        hasPersonalSpace?: FieldPlan<Get<"SafeRoom", "source", NonNullStep<Get<"SafeRoom", "nullable", Step>>>, NoArguments, Get<"Boolean", "nullable", Step>>;
        id?: FieldPlan<Get<"SafeRoom", "source", NonNullStep<Get<"SafeRoom", "nullable", Step>>>, NoArguments, NonNullStep<Get<"Int", "nullable", Step>>>;
        manager?: FieldPlan<Get<"SafeRoom", "source", NonNullStep<Get<"SafeRoom", "nullable", Step>>>, NoArguments, Get<"NPC", "nullable", Step>>;
        name?: FieldPlan<Get<"SafeRoom", "source", NonNullStep<Get<"SafeRoom", "nullable", Step>>>, NoArguments, NonNullStep<Get<"String", "nullable", Step>>>;
        stock?: FieldPlan<Get<"SafeRoom", "source", NonNullStep<Get<"SafeRoom", "nullable", Step>>>, NoArguments, Get<"SafeRoomStock", "list", ListOfStep<Get<"SafeRoomStock", "nullable", Step>>>>;
      }
    };
    Security?: Omit<ObjectPlan<Get<"Security", "source", NonNullStep<Get<"Security", "nullable", Step>>>>, 'plans'> & {
      plans?: {
        bestFriend?: FieldPlan<Get<"Security", "source", NonNullStep<Get<"Security", "nullable", Step>>>, NoArguments, Get<"Character", "nullable", Step>>;
        clients?: FieldPlan<Get<"Security", "source", NonNullStep<Get<"Security", "nullable", Step>>>, NoArguments, Get<"ActiveCrawler", "list", ListOfStep<NonNullStep<Get<"ActiveCrawler", "nullable", Step>>>>>;
        exCrawler?: FieldPlan<Get<"Security", "source", NonNullStep<Get<"Security", "nullable", Step>>>, NoArguments, Get<"Boolean", "nullable", Step>>;
        friends?: FieldPlan<Get<"Security", "source", NonNullStep<Get<"Security", "nullable", Step>>>, SecurityFriendsArgs, Get<"Character", "list", ListOfStep<Get<"Character", "nullable", Step>>>>;
        id?: FieldPlan<Get<"Security", "source", NonNullStep<Get<"Security", "nullable", Step>>>, NoArguments, NonNullStep<Get<"Int", "nullable", Step>>>;
        name?: FieldPlan<Get<"Security", "source", NonNullStep<Get<"Security", "nullable", Step>>>, NoArguments, NonNullStep<Get<"String", "nullable", Step>>>;
        species?: FieldPlan<Get<"Security", "source", NonNullStep<Get<"Security", "nullable", Step>>>, NoArguments, Get<"Species", "nullable", Step>>;
      }
    };
    Staff?: Omit<ObjectPlan<Get<"Staff", "source", NonNullStep<Get<"Staff", "nullable", Step>>>>, 'plans'> & {
      plans?: {
        bestFriend?: FieldPlan<Get<"Staff", "source", NonNullStep<Get<"Staff", "nullable", Step>>>, NoArguments, Get<"Character", "nullable", Step>>;
        exCrawler?: FieldPlan<Get<"Staff", "source", NonNullStep<Get<"Staff", "nullable", Step>>>, NoArguments, Get<"Boolean", "nullable", Step>>;
        friends?: FieldPlan<Get<"Staff", "source", NonNullStep<Get<"Staff", "nullable", Step>>>, StaffFriendsArgs, Get<"Character", "list", ListOfStep<Get<"Character", "nullable", Step>>>>;
        id?: FieldPlan<Get<"Staff", "source", NonNullStep<Get<"Staff", "nullable", Step>>>, NoArguments, NonNullStep<Get<"Int", "nullable", Step>>>;
        items?: FieldPlan<Get<"Staff", "source", NonNullStep<Get<"Staff", "nullable", Step>>>, StaffItemsArgs, Get<"Item", "list", ListOfStep<Get<"Item", "nullable", Step>>>>;
        itemsConnection?: FieldPlan<Get<"Staff", "source", NonNullStep<Get<"Staff", "nullable", Step>>>, StaffItemsConnectionArgs, Get<"ItemConnection", "nullable", Step>>;
        name?: FieldPlan<Get<"Staff", "source", NonNullStep<Get<"Staff", "nullable", Step>>>, NoArguments, NonNullStep<Get<"String", "nullable", Step>>>;
        species?: FieldPlan<Get<"Staff", "source", NonNullStep<Get<"Staff", "nullable", Step>>>, NoArguments, Get<"Species", "nullable", Step>>;
      }
    };
    Stairwell?: Omit<ObjectPlan<Get<"Stairwell", "source", NonNullStep<Get<"Stairwell", "nullable", Step>>>>, 'plans'> & {
      plans?: {
        floors?: FieldPlan<Get<"Stairwell", "source", NonNullStep<Get<"Stairwell", "nullable", Step>>>, NoArguments, NonNullStep<Get<"Floor", "list", ListOfStep<NonNullStep<Get<"Floor", "nullable", Step>>>>>>;
        id?: FieldPlan<Get<"Stairwell", "source", NonNullStep<Get<"Stairwell", "nullable", Step>>>, NoArguments, NonNullStep<Get<"Int", "nullable", Step>>>;
        name?: FieldPlan<Get<"Stairwell", "source", NonNullStep<Get<"Stairwell", "nullable", Step>>>, NoArguments, NonNullStep<Get<"String", "nullable", Step>>>;
      }
    };
    UtilityItem?: Omit<ObjectPlan<Get<"UtilityItem", "source", NonNullStep<Get<"UtilityItem", "nullable", Step>>>>, 'plans'> & {
      plans?: {
        canBeFoundIn?: FieldPlan<Get<"UtilityItem", "source", NonNullStep<Get<"UtilityItem", "nullable", Step>>>, NoArguments, Get<"LootBox", "list", ListOfStep<Get<"LootBox", "nullable", Step>>>>;
        id?: FieldPlan<Get<"UtilityItem", "source", NonNullStep<Get<"UtilityItem", "nullable", Step>>>, NoArguments, NonNullStep<Get<"Int", "nullable", Step>>>;
        name?: FieldPlan<Get<"UtilityItem", "source", NonNullStep<Get<"UtilityItem", "nullable", Step>>>, NoArguments, Get<"String", "nullable", Step>>;
      }
    };
  }
  interfaces?: {
    Character?: InterfacePlan<
      Get<"Character", "specifier", StepData<Get<"Character", "source", NonNullStep<Get<"Character", "nullable", Step>>>>>,
      Get<"Character", "source", NonNullStep<Get<"Character", "nullable", Step>>>
    >;
    Crawler?: InterfacePlan<
      Get<"Crawler", "specifier", StepData<Get<"Crawler", "source", NonNullStep<Get<"Crawler", "nullable", Step>>>>>,
      Get<"Crawler", "source", NonNullStep<Get<"Crawler", "nullable", Step>>>
    >;
    Created?: InterfacePlan<
      Get<"Created", "specifier", StepData<Get<"Created", "source", NonNullStep<Get<"Created", "nullable", Step>>>>>,
      Get<"Created", "source", NonNullStep<Get<"Created", "nullable", Step>>>
    >;
    HasContents?: InterfacePlan<
      Get<"HasContents", "specifier", StepData<Get<"HasContents", "source", NonNullStep<Get<"HasContents", "nullable", Step>>>>>,
      Get<"HasContents", "source", NonNullStep<Get<"HasContents", "nullable", Step>>>
    >;
    HasInventory?: InterfacePlan<
      Get<"HasInventory", "specifier", StepData<Get<"HasInventory", "source", NonNullStep<Get<"HasInventory", "nullable", Step>>>>>,
      Get<"HasInventory", "source", NonNullStep<Get<"HasInventory", "nullable", Step>>>
    >;
    Item?: InterfacePlan<
      Get<"Item", "specifier", StepData<Get<"Item", "source", NonNullStep<Get<"Item", "nullable", Step>>>>>,
      Get<"Item", "source", NonNullStep<Get<"Item", "nullable", Step>>>
    >;
    Location?: InterfacePlan<
      Get<"Location", "specifier", StepData<Get<"Location", "source", NonNullStep<Get<"Location", "nullable", Step>>>>>,
      Get<"Location", "source", NonNullStep<Get<"Location", "nullable", Step>>>
    >;
    NPC?: InterfacePlan<
      Get<"NPC", "specifier", StepData<Get<"NPC", "source", NonNullStep<Get<"NPC", "nullable", Step>>>>>,
      Get<"NPC", "source", NonNullStep<Get<"NPC", "nullable", Step>>>
    >;
  }
  unions?: {
    ClubStock?: UnionPlan<
      Get<"ClubStock", "specifier", StepData<Get<"ClubStock", "source", NonNullStep<Get<"ClubStock", "nullable", Step>>>>>,
      Get<"ClubStock", "source", NonNullStep<Get<"ClubStock", "nullable", Step>>>
    >;
    SafeRoomStock?: UnionPlan<
      Get<"SafeRoomStock", "specifier", StepData<Get<"SafeRoomStock", "source", NonNullStep<Get<"SafeRoomStock", "nullable", Step>>>>>,
      Get<"SafeRoomStock", "source", NonNullStep<Get<"SafeRoomStock", "nullable", Step>>>
    >;
  }
  inputObjects?: {
  }
  scalars?: {
    _RawJSON?: ScalarPlan;
  }
  enums?: {
    ItemType?: Omit<EnumPlan, 'values'> & {
      values?: {
        Consumable?: EnumValueInput;
        Equipment?: EnumValueInput;
        MiscItem?: EnumValueInput;
        UtilityItem?: EnumValueInput;
      }
    };
    Species?: Omit<EnumPlan, 'values'> & {
      values?: {
        BOPCA?: EnumValueInput;
        CAT?: EnumValueInput;
        CHANGELING?: EnumValueInput;
        CROCODILIAN?: EnumValueInput;
        GONDII?: EnumValueInput;
        HALF_ELF?: EnumValueInput;
        HUMAN?: EnumValueInput;
        ROCK_MONSTER?: EnumValueInput;
      }
    };
  }
};

export function typedMakeGrafastSchema(spec: TypedGrafastSchemaSpec) {
  return makeGrafastSchema(spec);
}
