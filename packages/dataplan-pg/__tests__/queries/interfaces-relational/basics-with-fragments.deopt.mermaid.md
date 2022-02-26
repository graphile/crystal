```mermaid
graph TD
    classDef path fill:#eee,stroke:#000,color:#000
    classDef plan fill:#fff,stroke-width:3px,color:#000
    classDef itemplan fill:#fff,stroke-width:6px,color:#000
    classDef sideeffectplan fill:#f00,stroke-width:6px,color:#000
    classDef bucket fill:#f6f6f6,color:#000,stroke-width:6px


    %% define plans
    __Value_3["__Value[_3∈0]<br /><context>"]:::plan
    __Value_5["__Value[_5∈0]<br /><rootValue>"]:::plan
    __TrackedObject_6["__TrackedObject[_6∈0]"]:::plan
    PgSelect_7[["PgSelect[_7∈0]<br /><people>"]]:::plan
    __Item_11>"__Item[_11∈1]<br /><_7>"]:::itemplan
    PgSelectSingle_12["PgSelectSingle[_12∈1]<br /><people>"]:::plan
    PgClassExpression_13["PgClassExpression[_13∈1]<br /><__people__.”username”>"]:::plan
    PgClassExpression_14["PgClassExpression[_14∈1]<br /><__people__.”person_id”>"]:::plan
    PgSelect_15[["PgSelect[_15∈1]<br /><relational_items>"]]:::plan
    __ListTransform_19["__ListTransform[_19∈1]<br /><each:_15>"]:::plan
    __Item_20>"__Item[_20∈2]<br /><_15>"]:::itemplan
    PgSelectSingle_21["PgSelectSingle[_21∈2]<br /><relational_items>"]:::plan
    __Item_22>"__Item[_22∈3]<br /><_19>"]:::itemplan
    PgSelectSingle_23["PgSelectSingle[_23∈3]<br /><relational_items>"]:::plan
    PgClassExpression_24["PgClassExpression[_24∈3]<br /><__relation...s__.”type”>"]:::plan
    PgPolymorphic_25["PgPolymorphic[_25∈3]"]:::plan
    PgSelect_27[["PgSelect[_27∈3]<br /><relational_topics>"]]:::plan
    First_31["First[_31∈3]"]:::plan
    PgSelectSingle_32["PgSelectSingle[_32∈4]<br /><relational_topics>"]:::plan
    PgClassExpression_35["PgClassExpression[_35∈3]<br /><__relation...__.”type2”>"]:::plan
    PgClassExpression_36["PgClassExpression[_36∈3]<br /><__relation...”position”>"]:::plan
    PgClassExpression_37["PgClassExpression[_37∈3]<br /><__relation...reated_at”>"]:::plan
    PgClassExpression_38["PgClassExpression[_38∈3]<br /><__relation...pdated_at”>"]:::plan
    PgClassExpression_39["PgClassExpression[_39∈3]<br /><__relation..._archived”>"]:::plan
    PgClassExpression_40["PgClassExpression[_40∈3]<br /><__relation...chived_at”>"]:::plan
    PgClassExpression_41["PgClassExpression[_41∈4]<br /><__relation...__.”title”>"]:::plan
    PgSelect_43[["PgSelect[_43∈3]<br /><relational_posts>"]]:::plan
    First_47["First[_47∈3]"]:::plan
    PgSelectSingle_48["PgSelectSingle[_48∈5]<br /><relational_posts>"]:::plan
    PgClassExpression_57["PgClassExpression[_57∈5]<br /><__relation...__.”title”>"]:::plan
    PgClassExpression_58["PgClassExpression[_58∈5]<br /><__relation...scription”>"]:::plan
    PgClassExpression_59["PgClassExpression[_59∈5]<br /><__relation...s__.”note”>"]:::plan
    PgSelect_61[["PgSelect[_61∈3]<br /><relational_dividers>"]]:::plan
    First_65["First[_65∈3]"]:::plan
    PgSelectSingle_66["PgSelectSingle[_66∈6]<br /><relational_dividers>"]:::plan
    PgClassExpression_75["PgClassExpression[_75∈6]<br /><__relation...__.”title”>"]:::plan
    PgClassExpression_76["PgClassExpression[_76∈6]<br /><__relation...__.”color”>"]:::plan
    PgSelect_78[["PgSelect[_78∈3]<br /><relational_checklists>"]]:::plan
    First_82["First[_82∈3]"]:::plan
    PgSelectSingle_83["PgSelectSingle[_83∈7]<br /><relational_checklists>"]:::plan
    PgClassExpression_92["PgClassExpression[_92∈7]<br /><__relation...__.”title”>"]:::plan
    PgClassExpression_93["PgClassExpression[_93∈3]<br /><__relation...ems__.”id”>"]:::plan
    PgSelect_94[["PgSelect[_94∈3]<br /><relational_checklist_items>"]]:::plan
    Access_95["Access[_95∈0]<br /><_3.pgSettings>"]:::plan
    Access_96["Access[_96∈0]<br /><_3.withPgClient>"]:::plan
    Object_97["Object[_97∈0]<br /><{pgSettings,withPgClient}>"]:::plan
    First_98["First[_98∈3]"]:::plan
    PgSelectSingle_99["PgSelectSingle[_99∈8]<br /><relational_checklist_items>"]:::plan
    PgClassExpression_108["PgClassExpression[_108∈8]<br /><__relation...scription”>"]:::plan
    PgClassExpression_109["PgClassExpression[_109∈8]<br /><__relation...s__.”note”>"]:::plan

    %% plan dependencies
    __Value_5 --> __TrackedObject_6
    Object_97 --> PgSelect_7
    PgSelect_7 ==> __Item_11
    __Item_11 --> PgSelectSingle_12
    PgSelectSingle_12 --> PgClassExpression_13
    PgSelectSingle_12 --> PgClassExpression_14
    Object_97 --> PgSelect_15
    PgClassExpression_14 --> PgSelect_15
    PgSelect_15 --> __ListTransform_19
    PgSelectSingle_21 -.-> __ListTransform_19
    PgSelect_15 -.-> __Item_20
    __Item_20 --> PgSelectSingle_21
    __ListTransform_19 ==> __Item_22
    __Item_22 --> PgSelectSingle_23
    PgSelectSingle_23 --> PgClassExpression_24
    PgSelectSingle_23 --> PgPolymorphic_25
    PgClassExpression_24 --> PgPolymorphic_25
    Object_97 --> PgSelect_27
    PgClassExpression_93 --> PgSelect_27
    PgSelect_27 --> First_31
    First_31 --> PgSelectSingle_32
    PgSelectSingle_23 --> PgClassExpression_35
    PgSelectSingle_23 --> PgClassExpression_36
    PgSelectSingle_23 --> PgClassExpression_37
    PgSelectSingle_23 --> PgClassExpression_38
    PgSelectSingle_23 --> PgClassExpression_39
    PgSelectSingle_23 --> PgClassExpression_40
    PgSelectSingle_32 --> PgClassExpression_41
    Object_97 --> PgSelect_43
    PgClassExpression_93 --> PgSelect_43
    PgSelect_43 --> First_47
    First_47 --> PgSelectSingle_48
    PgSelectSingle_48 --> PgClassExpression_57
    PgSelectSingle_48 --> PgClassExpression_58
    PgSelectSingle_48 --> PgClassExpression_59
    Object_97 --> PgSelect_61
    PgClassExpression_93 --> PgSelect_61
    PgSelect_61 --> First_65
    First_65 --> PgSelectSingle_66
    PgSelectSingle_66 --> PgClassExpression_75
    PgSelectSingle_66 --> PgClassExpression_76
    Object_97 --> PgSelect_78
    PgClassExpression_93 --> PgSelect_78
    PgSelect_78 --> First_82
    First_82 --> PgSelectSingle_83
    PgSelectSingle_83 --> PgClassExpression_92
    PgSelectSingle_23 --> PgClassExpression_93
    Object_97 --> PgSelect_94
    PgClassExpression_93 --> PgSelect_94
    __Value_3 --> Access_95
    __Value_3 --> Access_96
    Access_95 --> Object_97
    Access_96 --> Object_97
    PgSelect_94 --> First_98
    First_98 --> PgSelectSingle_99
    PgSelectSingle_99 --> PgClassExpression_108
    PgSelectSingle_99 --> PgClassExpression_109

    %% plan-to-path relationships
    P_6["~"]
    __TrackedObject_6 -.-> P_6
    P_7[">people"]
    PgSelect_7 -.-> P_7
    P_12[">people[]"]
    PgSelectSingle_12 -.-> P_12
    P_13[">p…]>username"]
    PgClassExpression_13 -.-> P_13
    P_19[">p…]>items"]
    __ListTransform_19 -.-> P_19
    P_21[">p…]>items@_19[]"]
    PgSelectSingle_21 -.-> P_21
    P_24[">p…]>i…]>type x5"]
    PgClassExpression_24 -.-> P_24
    P_25[">p…]>items[]"]
    PgPolymorphic_25 -.-> P_25
    P_35[">p…]>i…]>type2 x5"]
    PgClassExpression_35 -.-> P_35
    P_36[">p…]>i…]>position x5"]
    PgClassExpression_36 -.-> P_36
    P_37[">p…]>i…]>createdAt x5"]
    PgClassExpression_37 -.-> P_37
    P_38[">p…]>i…]>updatedAt x5"]
    PgClassExpression_38 -.-> P_38
    P_39[">p…]>i…]>isExplicitlyArchived x5"]
    PgClassExpression_39 -.-> P_39
    P_40[">p…]>i…]>archivedAt x5"]
    PgClassExpression_40 -.-> P_40
    P_41[">p…]>i…]>title"]
    PgClassExpression_41 -.-> P_41
    P_57[">p…]>i…]>title"]
    PgClassExpression_57 -.-> P_57
    P_58[">p…]>i…]>description"]
    PgClassExpression_58 -.-> P_58
    P_59[">p…]>i…]>note"]
    PgClassExpression_59 -.-> P_59
    P_75[">p…]>i…]>title"]
    PgClassExpression_75 -.-> P_75
    P_76[">p…]>i…]>color"]
    PgClassExpression_76 -.-> P_76
    P_92[">p…]>i…]>title"]
    PgClassExpression_92 -.-> P_92
    P_93[">p…]>i…]>id x5"]
    PgClassExpression_93 -.-> P_93
    P_108[">p…]>i…]>description"]
    PgClassExpression_108 -.-> P_108
    P_109[">p…]>i…]>note"]
    PgClassExpression_109 -.-> P_109

    %% allocate buckets
    classDef bucket0 stroke:#696969
    class __Value_3,__Value_5,__TrackedObject_6,PgSelect_7,Access_95,Access_96,Object_97 bucket0
    classDef bucket1 stroke:#a52a2a
    class __Item_11,PgSelectSingle_12,PgClassExpression_13,PgClassExpression_14,PgSelect_15,__ListTransform_19 bucket1
    classDef bucket2 stroke:#808000
    class __Item_20,PgSelectSingle_21 bucket2
    classDef bucket3 stroke:#3cb371
    class __Item_22,PgSelectSingle_23,PgClassExpression_24,PgPolymorphic_25,PgSelect_27,First_31,PgClassExpression_35,PgClassExpression_36,PgClassExpression_37,PgClassExpression_38,PgClassExpression_39,PgClassExpression_40,PgSelect_43,First_47,PgSelect_61,First_65,PgSelect_78,First_82,PgClassExpression_93,PgSelect_94,First_98 bucket3
    classDef bucket4 stroke:#7f007f
    class PgSelectSingle_32,PgClassExpression_41 bucket4
    classDef bucket5 stroke:#ff0000
    class PgSelectSingle_48,PgClassExpression_57,PgClassExpression_58,PgClassExpression_59 bucket5
    classDef bucket6 stroke:#ffa500
    class PgSelectSingle_66,PgClassExpression_75,PgClassExpression_76 bucket6
    classDef bucket7 stroke:#ffff00
    class PgSelectSingle_83,PgClassExpression_92 bucket7
    classDef bucket8 stroke:#7fff00
    class PgSelectSingle_99,PgClassExpression_108,PgClassExpression_109 bucket8

    subgraph Buckets
    Bucket0("Bucket 0 (root)<br />~"):::bucket
    style Bucket0 stroke:#696969
    Bucket1("Bucket 1 (item_11)<br />~>Query.people[]"):::bucket
    style Bucket1 stroke:#a52a2a
    Bucket0 --> Bucket1
    Bucket2("Bucket 2 (item_20)"):::bucket
    style Bucket2 stroke:#808000
    Bucket1 --> Bucket2
    Bucket3("Bucket 3 (item_22)<br />~>Query.people[]>Person.items[]"):::bucket
    style Bucket3 stroke:#3cb371
    Bucket1 --> Bucket3
    Bucket4("Bucket 4 (polymorphic_25[RelationalTopic])<br />~>Query.people[]>Person.items[]"):::bucket
    style Bucket4 stroke:#7f007f
    Bucket3 --> Bucket4
    Bucket5("Bucket 5 (polymorphic_25[RelationalPost])<br />~>Query.people[]>Person.items[]"):::bucket
    style Bucket5 stroke:#ff0000
    Bucket3 --> Bucket5
    Bucket6("Bucket 6 (polymorphic_25[RelationalDivider])<br />~>Query.people[]>Person.items[]"):::bucket
    style Bucket6 stroke:#ffa500
    Bucket3 --> Bucket6
    Bucket7("Bucket 7 (polymorphic_25[RelationalChecklist])<br />~>Query.people[]>Person.items[]"):::bucket
    style Bucket7 stroke:#ffff00
    Bucket3 --> Bucket7
    Bucket8("Bucket 8 (polymorphic_25[RelationalChecklistItem])<br />~>Query.people[]>Person.items[]"):::bucket
    style Bucket8 stroke:#7fff00
    Bucket3 --> Bucket8
    end
```
