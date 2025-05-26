import { Step } from "../../dist";
import {
  ClubData,
  ConsumableData,
  CrawlerData,
  EquipmentData,
  FloorData,
  ItemSpec,
  LocationData,
  MiscItemData,
  NpcData,
  SafeRoomData,
  UtilityItemData,
} from "./dcc-data";

export type Overrides = {
  // Unions
  SafeRoomStock: {
    source: Step<ItemSpec>;
  };
  ClubStock: {
    source: Step<ItemSpec>;
  };

  // Interfaces
  Crawler: {
    source: Step<CrawlerData>;
  };
  Character: {
    source: Step<number>;
  };
  NPC: {
    source: Step<number>;
  };
  Item: {
    source: Step<ItemSpec>;
  };
  Location: {
    source: Step<LocationData>;
  };

  // Objects
  Query: {
    source: Step;
  };
  ActiveCrawler: {
    source: Step<CrawlerData>;
  };
  Manager: {
    source: Step<NpcData>;
  };
  Security: {
    source: Step<NpcData>;
  };
  Guide: {
    source: Step<NpcData>;
  };
  Staff: {
    source: Step<NpcData>;
  };
  Equipment: {
    source: Step<EquipmentData>;
  };
  Consumable: {
    source: Step<ConsumableData>;
  };
  UtilityItem: {
    source: Step<UtilityItemData>;
  };
  MiscItem: {
    source: Step<MiscItemData>;
  };
  Floor: {
    source: Step<FloorData>;
  };
  SafeRoom: {
    source: Step<LocationData & SafeRoomData>;
  };
  Club: {
    source: Step<LocationData & ClubData>;
  };
};
