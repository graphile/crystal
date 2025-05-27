TODO: Review the plan diagram and experiment with a new way of handling the
polymorphism here. Lootbox is not polymorphic but Item is. Currently (May 2025)
the plan has more parallel paths than it should as many of the paths could
theoretically be collapsed down or deduplicated such that only one path is
executed, but not using the current way of deduplication due to the way the
schema is written.

```mermaid
graph TD

  Access --> LoadEquipment & LoadConsumable & LoadMiscItem & LoadUtilityItem

  LoadEquipment --> Access_1
  Access_1 --> List_1
  List_1 --> GetLootDataByItemType_1
  GetLootDataByItemType_1 --> Equipment
  Equipment --> GetLootBoxByID_1

  LoadConsumable --> Access_2
  Access_2 --> List_2
  List_2 --> GetLootDataByItemType_2
  GetLootDataByItemType_2 --> Consumable
  Consumable --> GetLootBoxByID_2

  LoadMiscItem --> Access_3
  Access_3 --> List_3
  List_3 --> GetLootDataByItemType_3
  GetLootDataByItemType_3 --> MiscItem
  MiscItem --> GetLootBoxByID_3

  LoadUtilityItem --> Access_4
  Access_4 --> List_4
  List_4 --> GetLootDataByItemType_4
  GetLootDataByItemType_4 --> UtilityItem
  UtilityItem --> GetLootBoxByID_4
```
