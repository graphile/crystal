```mermaid
graph TD
    classDef path fill:#eee,stroke:#000,color:#000
    classDef plan fill:#fff,stroke-width:3px,color:#000
    classDef itemplan fill:#fff,stroke-width:6px,color:#000
    classDef sideeffectplan fill:#f00,stroke-width:6px,color:#000
    classDef bucket fill:#f6f6f6,color:#000,stroke-width:6px,text-align:left


    %% define plans
    __Value_0["__Value[_0∈0]"]:::plan
    __Value_3["__Value[_3∈0]<br />ᐸcontextᐳ"]:::plan
    InputStaticLeaf_7["InputStaticLeaf[_7∈0]"]:::plan
    PgSelect_8[["PgSelect[_8∈0]<br />ᐸrelational_itemsᐳ"]]:::plan
    First_12["First[_12∈0]"]:::plan
    PgSelectSingle_13["PgSelectSingle[_13∈0]<br />ᐸrelational_itemsᐳ"]:::plan
    PgClassExpression_14["PgClassExpression[_14∈0]<br />ᐸ__relation...s__.”type”ᐳ"]:::plan
    PgPolymorphic_15["PgPolymorphic[_15∈0]"]:::plan
    PgClassExpression_23["PgClassExpression[_23∈0]<br />ᐸ__relation...parent_id”ᐳ"]:::plan
    PgSelect_24[["PgSelect[_24∈0]<br />ᐸrelational_itemsᐳ"]]:::plan
    First_28["First[_28∈0]"]:::plan
    PgSelectSingle_29["PgSelectSingle[_29∈0]<br />ᐸrelational_itemsᐳ"]:::plan
    PgClassExpression_30["PgClassExpression[_30∈0]<br />ᐸ__relation...s__.”type”ᐳ"]:::plan
    PgPolymorphic_31["PgPolymorphic[_31∈0]"]:::plan
    PgClassExpression_40["PgClassExpression[_40∈0]<br />ᐸ__relation...author_id”ᐳ"]:::plan
    PgSelect_41[["PgSelect[_41∈0]<br />ᐸpeopleᐳ"]]:::plan
    First_45["First[_45∈0]"]:::plan
    PgSelectSingle_46["PgSelectSingle[_46∈0]<br />ᐸpeopleᐳ"]:::plan
    PgClassExpression_47["PgClassExpression[_47∈0]<br />ᐸ__people__.”username”ᐳ"]:::plan
    PgClassExpression_404["PgClassExpression[_404∈0]<br />ᐸ__relation...ems__.”id”ᐳ"]:::plan
    PgClassExpression_484["PgClassExpression[_484∈0]<br />ᐸ__relation...ems__.”id”ᐳ"]:::plan
    Access_494["Access[_494∈0]<br />ᐸ_3.pgSettingsᐳ"]:::plan
    Access_495["Access[_495∈0]<br />ᐸ_3.withPgClientᐳ"]:::plan
    Object_496["Object[_496∈0]<br />ᐸ{pgSettings,withPgClient}ᐳ"]:::plan

    %% plan dependencies
    Object_496 --> PgSelect_8
    InputStaticLeaf_7 --> PgSelect_8
    PgSelect_8 --> First_12
    First_12 --> PgSelectSingle_13
    PgSelectSingle_13 --> PgClassExpression_14
    PgSelectSingle_13 --> PgPolymorphic_15
    PgClassExpression_14 --> PgPolymorphic_15
    PgSelectSingle_13 --> PgClassExpression_23
    Object_496 --> PgSelect_24
    PgClassExpression_23 --> PgSelect_24
    PgSelect_24 --> First_28
    First_28 --> PgSelectSingle_29
    PgSelectSingle_29 --> PgClassExpression_30
    PgSelectSingle_29 --> PgPolymorphic_31
    PgClassExpression_30 --> PgPolymorphic_31
    PgSelectSingle_29 --> PgClassExpression_40
    Object_496 --> PgSelect_41
    PgClassExpression_40 --> PgSelect_41
    PgSelect_41 --> First_45
    First_45 --> PgSelectSingle_46
    PgSelectSingle_46 --> PgClassExpression_47
    PgSelectSingle_13 --> PgClassExpression_404
    PgSelectSingle_29 --> PgClassExpression_484
    __Value_3 --> Access_494
    __Value_3 --> Access_495
    Access_494 --> Object_496
    Access_495 --> Object_496

    %% plan-to-path relationships
    P_0["~"]
    __Value_0 -.-> P_0
    P_15["ᐳitem"]
    PgPolymorphic_15 -.-> P_15
    P_31["ᐳitemᐳparent x5"]
    PgPolymorphic_31 -.-> P_31
    P_46["ᐳitemᐳp…tᐳauthor x25"]
    PgSelectSingle_46 -.-> P_46
    P_47["ᐳitemᐳp…tᐳa…rᐳusername x25"]
    PgClassExpression_47 -.-> P_47
    P_404["ᐳitemᐳid x5"]
    PgClassExpression_404 -.-> P_404
    P_484["ᐳitemᐳp…tᐳid x25"]
    PgClassExpression_484 -.-> P_484

    %% allocate buckets
    classDef bucket0 stroke:#696969
    class __Value_0,__Value_3,InputStaticLeaf_7,PgSelect_8,First_12,PgSelectSingle_13,PgClassExpression_14,PgPolymorphic_15,PgClassExpression_23,PgSelect_24,First_28,PgSelectSingle_29,PgClassExpression_30,PgPolymorphic_31,PgClassExpression_40,PgSelect_41,First_45,PgSelectSingle_46,PgClassExpression_47,PgClassExpression_404,PgClassExpression_484,Access_494,Access_495,Object_496 bucket0

    subgraph "Buckets for queries/interfaces-relational/relation"
    Bucket0("Bucket 0 (root)<br />~<br />⠀ROOT ᐸ-O- _0<br />⠀⠀item ᐸ-O- _15<br />⠀⠀⠀item.parent ᐸ-O- _31<br />⠀⠀⠀⠀item.parent.author ᐸ-O- _46<br />⠀⠀⠀⠀⠀item.parent.author.username ᐸ-L- _47<br />⠀⠀⠀⠀item.parent.id ᐸ-L- _484<br />⠀⠀⠀item.id ᐸ-L- _404"):::bucket
    style Bucket0 stroke:#696969
    end
```
