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
    __ListTransform_19["__ListTransform[_19∈1]<br /><each:_15>"]:::plan
    __Item_20>"__Item[_20∈2]<br /><_563>"]:::itemplan
    PgSelectSingle_21["PgSelectSingle[_21∈2]<br /><single_table_items>"]:::plan
    __Item_22>"__Item[_22∈3]<br /><_19>"]:::itemplan
    PgSelectSingle_23["PgSelectSingle[_23∈3]<br /><single_table_items>"]:::plan
    PgClassExpression_24["PgClassExpression[_24∈3]<br /><__single_t...s__.”type”>"]:::plan
    Lambda_25["Lambda[_25∈3]"]:::plan
    PgSingleTablePolymorphic_26["PgSingleTablePolymorphic[_26∈3]"]:::plan
    PgClassExpression_27["PgClassExpression[_27∈4]<br /><__single_t...parent_id”>"]:::plan
    First_32["First[_32∈4]"]:::plan
    PgSelectSingle_33["PgSelectSingle[_33∈4]<br /><single_table_items>"]:::plan
    PgClassExpression_34["PgClassExpression[_34∈4]<br /><__single_t...s__.”type”>"]:::plan
    Lambda_35["Lambda[_35∈4]"]:::plan
    PgSingleTablePolymorphic_36["PgSingleTablePolymorphic[_36∈4]"]:::plan
    PgClassExpression_39["PgClassExpression[_39∈5]<br /><__single_t...__.”type2”>"]:::plan
    First_45["First[_45∈5]"]:::plan
    PgSelectSingle_46["PgSelectSingle[_46∈5]<br /><people>"]:::plan
    PgClassExpression_47["PgClassExpression[_47∈5]<br /><__people__.”username”>"]:::plan
    PgClassExpression_48["PgClassExpression[_48∈5]<br /><__single_t...”position”>"]:::plan
    PgClassExpression_49["PgClassExpression[_49∈5]<br /><__single_t...reated_at”>"]:::plan
    PgClassExpression_50["PgClassExpression[_50∈5]<br /><__single_t...pdated_at”>"]:::plan
    PgClassExpression_51["PgClassExpression[_51∈5]<br /><__single_t..._archived”>"]:::plan
    PgClassExpression_52["PgClassExpression[_52∈5]<br /><__single_t...chived_at”>"]:::plan
    PgClassExpression_117["PgClassExpression[_117∈4]<br /><__single_t...ems__.”id”>"]:::plan
    PgClassExpression_119["PgClassExpression[_119∈4]<br /><__single_t...__.”type2”>"]:::plan
    First_125["First[_125∈4]"]:::plan
    PgSelectSingle_126["PgSelectSingle[_126∈4]<br /><people>"]:::plan
    PgClassExpression_127["PgClassExpression[_127∈4]<br /><__people__.”username”>"]:::plan
    PgClassExpression_128["PgClassExpression[_128∈4]<br /><__single_t...”position”>"]:::plan
    PgClassExpression_129["PgClassExpression[_129∈4]<br /><__single_t...reated_at”>"]:::plan
    PgClassExpression_130["PgClassExpression[_130∈4]<br /><__single_t...pdated_at”>"]:::plan
    PgClassExpression_131["PgClassExpression[_131∈4]<br /><__single_t..._archived”>"]:::plan
    PgClassExpression_132["PgClassExpression[_132∈4]<br /><__single_t...chived_at”>"]:::plan
    Access_546["Access[_546∈0]<br /><_3.pgSettings>"]:::plan
    Access_547["Access[_547∈0]<br /><_3.withPgClient>"]:::plan
    Object_548["Object[_548∈0]<br /><{pgSettings,withPgClient}>"]:::plan
    Map_557["Map[_557∈5]<br /><_33:{”0”:2}>"]:::plan
    List_558["List[_558∈5]<br /><_557>"]:::plan
    Map_559["Map[_559∈4]<br /><_23:{”0”:1,”1”:2,”2”:3,”3”:4,”4”:5,”5”:6,”6”:7,”7”:8}>"]:::plan
    List_560["List[_560∈4]<br /><_559>"]:::plan
    Map_561["Map[_561∈4]<br /><_23:{”0”:12}>"]:::plan
    List_562["List[_562∈4]<br /><_561>"]:::plan
    Access_563["Access[_563∈1]<br /><_11.1>"]:::plan

    %% plan dependencies
    __Value_5 --> __TrackedObject_6
    Object_548 --> PgSelect_7
    PgSelect_7 ==> __Item_11
    __Item_11 --> PgSelectSingle_12
    PgSelectSingle_12 --> PgClassExpression_13
    Access_563 --> __ListTransform_19
    PgSelectSingle_21 -.-> __ListTransform_19
    Access_563 -.-> __Item_20
    __Item_20 --> PgSelectSingle_21
    __ListTransform_19 ==> __Item_22
    __Item_22 --> PgSelectSingle_23
    PgSelectSingle_23 --> PgClassExpression_24
    PgClassExpression_24 --> Lambda_25
    Lambda_25 --> PgSingleTablePolymorphic_26
    PgSelectSingle_23 --> PgSingleTablePolymorphic_26
    PgSelectSingle_23 --> PgClassExpression_27
    List_560 --> First_32
    First_32 --> PgSelectSingle_33
    PgSelectSingle_33 --> PgClassExpression_34
    PgClassExpression_34 --> Lambda_35
    Lambda_35 --> PgSingleTablePolymorphic_36
    PgSelectSingle_33 --> PgSingleTablePolymorphic_36
    PgSelectSingle_33 --> PgClassExpression_39
    List_558 --> First_45
    First_45 --> PgSelectSingle_46
    PgSelectSingle_46 --> PgClassExpression_47
    PgSelectSingle_33 --> PgClassExpression_48
    PgSelectSingle_33 --> PgClassExpression_49
    PgSelectSingle_33 --> PgClassExpression_50
    PgSelectSingle_33 --> PgClassExpression_51
    PgSelectSingle_33 --> PgClassExpression_52
    PgSelectSingle_23 --> PgClassExpression_117
    PgSelectSingle_23 --> PgClassExpression_119
    List_562 --> First_125
    First_125 --> PgSelectSingle_126
    PgSelectSingle_126 --> PgClassExpression_127
    PgSelectSingle_23 --> PgClassExpression_128
    PgSelectSingle_23 --> PgClassExpression_129
    PgSelectSingle_23 --> PgClassExpression_130
    PgSelectSingle_23 --> PgClassExpression_131
    PgSelectSingle_23 --> PgClassExpression_132
    __Value_3 --> Access_546
    __Value_3 --> Access_547
    Access_546 --> Object_548
    Access_547 --> Object_548
    PgSelectSingle_33 --> Map_557
    Map_557 --> List_558
    PgSelectSingle_23 --> Map_559
    Map_559 --> List_560
    PgSelectSingle_23 --> Map_561
    Map_561 --> List_562
    __Item_11 --> Access_563

    %% plan-to-path relationships
    P_6["~"]
    __TrackedObject_6 -.-> P_6
    P_7[">people"]
    PgSelect_7 -.-> P_7
    P_12[">people[]"]
    PgSelectSingle_12 -.-> P_12
    P_13[">p…]>username"]
    PgClassExpression_13 -.-> P_13
    P_21[">p…]>items@_19[]"]
    PgSelectSingle_21 -.-> P_21
    P_19[">p…]>items"]
    __ListTransform_19 -.-> P_19
    P_26[">p…]>items[]"]
    PgSingleTablePolymorphic_26 -.-> P_26
    P_36[">p…]>i…]>parent x5"]
    PgSingleTablePolymorphic_36 -.-> P_36
    P_27[">p…]>i…]>p…t>id x25"]
    PgClassExpression_27 -.-> P_27
    P_34[">p…]>i…]>p…t>type x25"]
    PgClassExpression_34 -.-> P_34
    P_39[">p…]>i…]>p…t>type2 x25"]
    PgClassExpression_39 -.-> P_39
    P_46[">p…]>i…]>p…t>author x25"]
    PgSelectSingle_46 -.-> P_46
    P_47[">p…]>i…]>p…t>a…r>username x25"]
    PgClassExpression_47 -.-> P_47
    P_48[">p…]>i…]>p…t>position x25"]
    PgClassExpression_48 -.-> P_48
    P_49[">p…]>i…]>p…t>createdAt x25"]
    PgClassExpression_49 -.-> P_49
    P_50[">p…]>i…]>p…t>updatedAt x25"]
    PgClassExpression_50 -.-> P_50
    P_51[">p…]>i…]>p…t>isExplicitlyArchived x25"]
    PgClassExpression_51 -.-> P_51
    P_52[">p…]>i…]>p…t>archivedAt x25"]
    PgClassExpression_52 -.-> P_52
    P_117[">p…]>i…]>id x5"]
    PgClassExpression_117 -.-> P_117
    P_24[">p…]>i…]>type x5"]
    PgClassExpression_24 -.-> P_24
    P_119[">p…]>i…]>type2 x5"]
    PgClassExpression_119 -.-> P_119
    P_126[">p…]>i…]>author x5"]
    PgSelectSingle_126 -.-> P_126
    P_127[">p…]>i…]>a…r>username x5"]
    PgClassExpression_127 -.-> P_127
    P_128[">p…]>i…]>position x5"]
    PgClassExpression_128 -.-> P_128
    P_129[">p…]>i…]>createdAt x5"]
    PgClassExpression_129 -.-> P_129
    P_130[">p…]>i…]>updatedAt x5"]
    PgClassExpression_130 -.-> P_130
    P_131[">p…]>i…]>isExplicitlyArchived x5"]
    PgClassExpression_131 -.-> P_131
    P_132[">p…]>i…]>archivedAt x5"]
    PgClassExpression_132 -.-> P_132

    %% allocate buckets
    classDef bucket0 stroke:#696969
    class __Value_3,__Value_5,__TrackedObject_6,PgSelect_7,Access_546,Access_547,Object_548 bucket0
    classDef bucket1 stroke:#a52a2a
    class __Item_11,PgSelectSingle_12,PgClassExpression_13,__ListTransform_19,Access_563 bucket1
    classDef bucket2 stroke:#808000
    class __Item_20,PgSelectSingle_21 bucket2
    classDef bucket3 stroke:#3cb371
    class __Item_22,PgSelectSingle_23,PgClassExpression_24,Lambda_25,PgSingleTablePolymorphic_26 bucket3
    classDef bucket4 stroke:#7f007f
    class PgClassExpression_27,First_32,PgSelectSingle_33,PgClassExpression_34,Lambda_35,PgSingleTablePolymorphic_36,PgClassExpression_117,PgClassExpression_119,First_125,PgSelectSingle_126,PgClassExpression_127,PgClassExpression_128,PgClassExpression_129,PgClassExpression_130,PgClassExpression_131,PgClassExpression_132,Map_559,List_560,Map_561,List_562 bucket4
    classDef bucket5 stroke:#ff0000
    class PgClassExpression_39,First_45,PgSelectSingle_46,PgClassExpression_47,PgClassExpression_48,PgClassExpression_49,PgClassExpression_50,PgClassExpression_51,PgClassExpression_52,Map_557,List_558 bucket5

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
    Bucket4("Bucket 4 (polymorphic_26[SingleTableTopic|SingleTablePost|SingleTableDivider|SingleTableChecklist|SingleTableChecklistItem])<br />~>Query.people[]>Person.items[]"):::bucket
    style Bucket4 stroke:#7f007f
    Bucket3 --> Bucket4
    Bucket5("Bucket 5 (polymorphic_36[SingleTableTopic|SingleTablePost|SingleTableDivider|SingleTableChecklist|SingleTableChecklistItem])<br />~>Query.people[]>Person.items[]>SingleTablePost.parent<br />~>Query.people[]>Person.items[]>SingleTableTopic.parent<br />~>Query.people[]>Person.items[]>SingleTableDivider.parent<br />~>Query.people[]>Person.items[]>SingleTableChecklist.parent<br />~>Query.people[]>Person.items[]>SingleTableChecklistItem.parent"):::bucket
    style Bucket5 stroke:#ff0000
    Bucket4 --> Bucket5
    end
```
