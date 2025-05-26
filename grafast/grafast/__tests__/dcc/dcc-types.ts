// Generated GraphQL SDK (auto-generated – do not edit)

import type { AbstractTypePlanner, EnumPlan, FieldArgs, GrafastSchemaSpec, InputObjectPlan, InterfacePlan, ObjectPlan, ScalarPlan, Step, UnionPlan } from '../../dist';
import { makeGrafastSchema } from '../../dist';
import type { Overrides } from './dcc-type-overrides.ts';

type Get<
  TOverrides extends { [typeName: string]: { source?: Step } },
  TTypeName extends string,
  TProp extends string,
  TFallback = any,
> = TTypeName extends keyof TOverrides
  ? TProp extends keyof TOverrides[TTypeName]
    ? NonNullable<TOverrides[TTypeName][TProp]>
    : TFallback
  : TFallback;

export interface TypedGrafastSchemaSpec extends Omit<GrafastSchemaSpec, 'objectPlans' | 'interfacePlans' | 'unionPlans' | 'inputObjectPlans' | 'scalarPlans' | 'enumPlans'> {
  objectPlans?: {
    ActiveCrawler?: ObjectPlan;
    BetaLocation?: ObjectPlan;
    Club?: ObjectPlan;
    Consumable?: ObjectPlan;
    DeletedCrawler?: ObjectPlan;
    Equipment?: ObjectPlan;
    Floor?: ObjectPlan;
    Guide?: ObjectPlan;
    LootBox?: ObjectPlan;
    LootData?: ObjectPlan;
    Manager?: ObjectPlan;
    MiscItem?: ObjectPlan;
    Query?: ObjectPlan;
    SafeRoom?: ObjectPlan;
    Security?: ObjectPlan;
    Staff?: ObjectPlan;
    Stairwell?: ObjectPlan;
    UtilityItem?: ObjectPlan;
  }
  interfacePlans?: {
    Character?: InterfacePlan<
      Get<Overrides, "Character", "source", Step>,
      Get<Overrides, "Character", "specifier", Get<Overrides, "Character", "source", Step>>
    >;
    Crawler?: InterfacePlan<
      Get<Overrides, "Crawler", "source", Step>,
      Get<Overrides, "Crawler", "specifier", Get<Overrides, "Crawler", "source", Step>>
    >;
    Created?: InterfacePlan<
      Get<Overrides, "Created", "source", Step>,
      Get<Overrides, "Created", "specifier", Get<Overrides, "Created", "source", Step>>
    >;
    HasContents?: InterfacePlan<
      Get<Overrides, "HasContents", "source", Step>,
      Get<Overrides, "HasContents", "specifier", Get<Overrides, "HasContents", "source", Step>>
    >;
    HasInventory?: InterfacePlan<
      Get<Overrides, "HasInventory", "source", Step>,
      Get<Overrides, "HasInventory", "specifier", Get<Overrides, "HasInventory", "source", Step>>
    >;
    Item?: InterfacePlan<
      Get<Overrides, "Item", "source", Step>,
      Get<Overrides, "Item", "specifier", Get<Overrides, "Item", "source", Step>>
    >;
    Location?: InterfacePlan<
      Get<Overrides, "Location", "source", Step>,
      Get<Overrides, "Location", "specifier", Get<Overrides, "Location", "source", Step>>
    >;
    NPC?: InterfacePlan<
      Get<Overrides, "NPC", "source", Step>,
      Get<Overrides, "NPC", "specifier", Get<Overrides, "NPC", "source", Step>>
    >;
  }
  unionPlans?: {
    ClubStock?: UnionPlan<
      Get<Overrides, "ClubStock", "source", Step>,
      Get<Overrides, "ClubStock", "specifier", Get<Overrides, "ClubStock", "source", Step>>
    >;
    SafeRoomStock?: UnionPlan<
      Get<Overrides, "SafeRoomStock", "source", Step>,
      Get<Overrides, "SafeRoomStock", "specifier", Get<Overrides, "SafeRoomStock", "source", Step>>
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
