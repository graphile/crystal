// Generated GraphQL SDK (auto-generated – do not edit)

import type { AbstractTypePlanner, EnumPlan, FieldArgs, GrafastSchemaSpec, InputObjectPlan, InterfacePlan, ObjectPlan, ScalarPlan, Step, UnionPlan } from '../../dist';
import { makeGrafastSchema } from '../../dist';
import type { Overrides } from './dcc-type-overrides.ts';

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
    ActiveCrawler?: ObjectPlan<Get<"ActiveCrawler", "source", Step>>;
    BetaLocation?: ObjectPlan<Get<"BetaLocation", "source", Step>>;
    Club?: ObjectPlan<Get<"Club", "source", Step>>;
    Consumable?: ObjectPlan<Get<"Consumable", "source", Step>>;
    DeletedCrawler?: ObjectPlan<Get<"DeletedCrawler", "source", Step>>;
    Equipment?: ObjectPlan<Get<"Equipment", "source", Step>>;
    Floor?: ObjectPlan<Get<"Floor", "source", Step>>;
    Guide?: ObjectPlan<Get<"Guide", "source", Step>>;
    LootBox?: ObjectPlan<Get<"LootBox", "source", Step>>;
    LootData?: ObjectPlan<Get<"LootData", "source", Step>>;
    Manager?: ObjectPlan<Get<"Manager", "source", Step>>;
    MiscItem?: ObjectPlan<Get<"MiscItem", "source", Step>>;
    Query?: ObjectPlan<Get<"Query", "source", Step>>;
    SafeRoom?: ObjectPlan<Get<"SafeRoom", "source", Step>>;
    Security?: ObjectPlan<Get<"Security", "source", Step>>;
    Staff?: ObjectPlan<Get<"Staff", "source", Step>>;
    Stairwell?: ObjectPlan<Get<"Stairwell", "source", Step>>;
    UtilityItem?: ObjectPlan<Get<"UtilityItem", "source", Step>>;
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
