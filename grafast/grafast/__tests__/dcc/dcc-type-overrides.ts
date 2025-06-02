import type { Maybe, Step } from "../../dist";
import type {
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

// IMPORTANT: Steps must represent the nullable version (suitable for returning
// from a plan resolver). Should you wish to specify a different (non-nullable)
// version that's suitable as a field plan resolver's first argument, use the
// `source:` key in addition to specifying `nullable:`.
export type Overrides = {
  // Unions
  SafeRoomStock: {
    nullable: Step<Maybe<ItemSpec>>;
  };
  ClubStock: {
    nullable: Step<Maybe<ItemSpec>>;
  };

  // Interfaces
  Crawler: {
    nullable: Step<Maybe<CrawlerData>>;
  };
  Character: {
    nullable: Step<Maybe<number>>;
  };
  NPC: {
    nullable: Step<Maybe<number>>;
  };
  Item: {
    nullable: Step<Maybe<ItemSpec>>;
  };
  Location: {
    nullable: Step<Maybe<LocationData>>;
  };

  // Objects
  Query: {
    nullable: Step<Maybe<Record<string, any>>>;
  };
  ActiveCrawler: {
    nullable: Step<Maybe<CrawlerData>>;
  };
  Manager: {
    nullable: Step<Maybe<NpcData>>;
  };
  Security: {
    nullable: Step<Maybe<NpcData>>;
  };
  Guide: {
    nullable: Step<Maybe<NpcData>>;
  };
  Staff: {
    nullable: Step<Maybe<NpcData>>;
  };
  Equipment: {
    nullable: Step<Maybe<EquipmentData>>;
  };
  Consumable: {
    nullable: Step<Maybe<ConsumableData>>;
  };
  UtilityItem: {
    nullable: Step<Maybe<UtilityItemData>>;
  };
  MiscItem: {
    nullable: Step<Maybe<MiscItemData>>;
  };
  Floor: {
    nullable: Step<Maybe<FloorData>>;
  };
  SafeRoom: {
    nullable: Step<Maybe<LocationData> & SafeRoomData>;
  };
  Club: {
    nullable: Step<Maybe<LocationData> & ClubData>;
  };
};
