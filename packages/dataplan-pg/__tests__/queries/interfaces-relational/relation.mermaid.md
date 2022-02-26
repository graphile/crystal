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
    InputStaticLeaf_7["InputStaticLeaf[_7∈0]"]:::plan
    PgSelect_8[["PgSelect[_8∈0]<br /><relational_items>"]]:::plan
    First_12["First[_12∈0]"]:::plan
    PgSelectSingle_13["PgSelectSingle[_13∈0]<br /><relational_items>"]:::plan
    PgClassExpression_14["PgClassExpression[_14∈0]<br /><__relation...s__.”type”>"]:::plan
    PgPolymorphic_15["PgPolymorphic[_15∈0]"]:::plan
    First_28["First[_28∈0]"]:::plan
    PgSelectSingle_29["PgSelectSingle[_29∈0]<br /><relational_items>"]:::plan
    PgClassExpression_30["PgClassExpression[_30∈0]<br /><__relation...s__.”type”>"]:::plan
    PgPolymorphic_31["PgPolymorphic[_31∈0]"]:::plan
    First_45["First[_45∈0]"]:::plan
    PgSelectSingle_46["PgSelectSingle[_46∈0]<br /><people>"]:::plan
    PgClassExpression_47["PgClassExpression[_47∈0]<br /><__people__.”username”>"]:::plan
    PgClassExpression_404["PgClassExpression[_404∈0]<br /><__relation...ems__.”id”>"]:::plan
    PgClassExpression_484["PgClassExpression[_484∈0]<br /><__relation...ems__.”id”>"]:::plan
    Access_494["Access[_494∈0]<br /><_3.pgSettings>"]:::plan
    Access_495["Access[_495∈0]<br /><_3.withPgClient>"]:::plan
    Object_496["Object[_496∈0]<br /><{pgSettings,withPgClient}>"]:::plan
    Map_501["Map[_501∈0]<br /><_29:{”0”:2}>"]:::plan
    List_502["List[_502∈0]<br /><_501>"]:::plan
    Map_503["Map[_503∈0]<br /><_13:{”0”:2,”1”:3,”2”:4}>"]:::plan
    List_504["List[_504∈0]<br /><_503>"]:::plan

    %% plan dependencies
    __Value_5 --> __TrackedObject_6
    Object_496 --> PgSelect_8
    InputStaticLeaf_7 --> PgSelect_8
    PgSelect_8 --> First_12
    First_12 --> PgSelectSingle_13
    PgSelectSingle_13 --> PgClassExpression_14
    PgSelectSingle_13 --> PgPolymorphic_15
    PgClassExpression_14 --> PgPolymorphic_15
    List_504 --> First_28
    First_28 --> PgSelectSingle_29
    PgSelectSingle_29 --> PgClassExpression_30
    PgSelectSingle_29 --> PgPolymorphic_31
    PgClassExpression_30 --> PgPolymorphic_31
    List_502 --> First_45
    First_45 --> PgSelectSingle_46
    PgSelectSingle_46 --> PgClassExpression_47
    PgSelectSingle_13 --> PgClassExpression_404
    PgSelectSingle_29 --> PgClassExpression_484
    __Value_3 --> Access_494
    __Value_3 --> Access_495
    Access_494 --> Object_496
    Access_495 --> Object_496
    PgSelectSingle_29 --> Map_501
    Map_501 --> List_502
    PgSelectSingle_13 --> Map_503
    Map_503 --> List_504

    %% plan-to-path relationships
    P_6["~"]
    __TrackedObject_6 -.-> P_6
    P_15[">item"]
    PgPolymorphic_15 -.-> P_15
    P_31[">item>parent x5"]
    PgPolymorphic_31 -.-> P_31
    P_46[">item>p…t>author x25"]
    PgSelectSingle_46 -.-> P_46
    P_47[">item>p…t>a…r>username x25"]
    PgClassExpression_47 -.-> P_47
    P_404[">item>id x5"]
    PgClassExpression_404 -.-> P_404
    P_484[">item>p…t>id x25"]
    PgClassExpression_484 -.-> P_484

    %% allocate buckets
    classDef bucket0 stroke:#696969
    class __Value_3,__Value_5,__TrackedObject_6,InputStaticLeaf_7,PgSelect_8,First_12,PgSelectSingle_13,PgClassExpression_14,PgPolymorphic_15,First_28,PgSelectSingle_29,PgClassExpression_30,PgPolymorphic_31,First_45,PgSelectSingle_46,PgClassExpression_47,PgClassExpression_404,PgClassExpression_484,Access_494,Access_495,Object_496,Map_501,List_502,Map_503,List_504 bucket0
```
