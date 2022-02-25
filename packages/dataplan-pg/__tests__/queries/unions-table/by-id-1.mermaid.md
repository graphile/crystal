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
    PgSelect_8[["PgSelect[_8∈0]<br /><union_items>"]]:::plan
    Access_9["Access[_9∈0]<br /><_3.pgSettings>"]:::plan
    Access_10["Access[_10∈0]<br /><_3.withPgClient>"]:::plan
    Object_11["Object[_11∈0]<br /><{pgSettings,withPgClient}>"]:::plan
    First_12["First[_12∈0]"]:::plan
    PgSelectSingle_13["PgSelectSingle[_13∈0]<br /><union_items>"]:::plan
    PgClassExpression_14["PgClassExpression[_14∈0]<br /><__union_items__.”type”>"]:::plan
    PgPolymorphic_15["PgPolymorphic[_15∈0]"]:::plan
    First_21["First[_21∈0]"]:::plan
    PgSelectSingle_22["PgSelectSingle[_22∈1]<br /><union_topics>"]:::plan
    PgClassExpression_23["PgClassExpression[_23∈1]<br /><__union_topics__.”id”>"]:::plan
    PgClassExpression_24["PgClassExpression[_24∈1]<br /><__union_to...__.”title”>"]:::plan
    First_30["First[_30∈0]"]:::plan
    PgSelectSingle_31["PgSelectSingle[_31∈2]<br /><union_posts>"]:::plan
    PgClassExpression_32["PgClassExpression[_32∈2]<br /><__union_posts__.”id”>"]:::plan
    PgClassExpression_33["PgClassExpression[_33∈2]<br /><__union_posts__.”title”>"]:::plan
    PgClassExpression_34["PgClassExpression[_34∈2]<br /><__union_po...scription”>"]:::plan
    PgClassExpression_35["PgClassExpression[_35∈2]<br /><__union_posts__.”note”>"]:::plan
    First_41["First[_41∈0]"]:::plan
    PgSelectSingle_42["PgSelectSingle[_42∈3]<br /><union_dividers>"]:::plan
    PgClassExpression_43["PgClassExpression[_43∈3]<br /><__union_dividers__.”id”>"]:::plan
    PgClassExpression_44["PgClassExpression[_44∈3]<br /><__union_di...__.”title”>"]:::plan
    PgClassExpression_45["PgClassExpression[_45∈3]<br /><__union_di...__.”color”>"]:::plan
    First_51["First[_51∈0]"]:::plan
    PgSelectSingle_52["PgSelectSingle[_52∈4]<br /><union_checklists>"]:::plan
    PgClassExpression_53["PgClassExpression[_53∈4]<br /><__union_ch...sts__.”id”>"]:::plan
    PgClassExpression_54["PgClassExpression[_54∈4]<br /><__union_ch...__.”title”>"]:::plan
    First_60["First[_60∈0]"]:::plan
    PgSelectSingle_61["PgSelectSingle[_61∈5]<br /><union_checklist_items>"]:::plan
    PgClassExpression_62["PgClassExpression[_62∈5]<br /><__union_ch...ems__.”id”>"]:::plan
    PgClassExpression_63["PgClassExpression[_63∈5]<br /><__union_ch...scription”>"]:::plan
    PgClassExpression_64["PgClassExpression[_64∈5]<br /><__union_ch...s__.”note”>"]:::plan
    Map_65["Map[_65∈0]<br /><_13:{”0”:1,”1”:2}>"]:::plan
    List_66["List[_66∈0]<br /><_65>"]:::plan
    Map_67["Map[_67∈0]<br /><_13:{”0”:3,”1”:4,”2”:5,”3”:6}>"]:::plan
    List_68["List[_68∈0]<br /><_67>"]:::plan
    Map_69["Map[_69∈0]<br /><_13:{”0”:7,”1”:8,”2”:9}>"]:::plan
    List_70["List[_70∈0]<br /><_69>"]:::plan
    Map_71["Map[_71∈0]<br /><_13:{”0”:10,”1”:11}>"]:::plan
    List_72["List[_72∈0]<br /><_71>"]:::plan
    Map_73["Map[_73∈0]<br /><_13:{”0”:12,”1”:13,”2”:14}>"]:::plan
    List_74["List[_74∈0]<br /><_73>"]:::plan

    %% plan dependencies
    __Value_5 --> __TrackedObject_6
    Object_11 --> PgSelect_8
    InputStaticLeaf_7 --> PgSelect_8
    __Value_3 --> Access_9
    __Value_3 --> Access_10
    Access_9 --> Object_11
    Access_10 --> Object_11
    PgSelect_8 --> First_12
    First_12 --> PgSelectSingle_13
    PgSelectSingle_13 --> PgClassExpression_14
    PgSelectSingle_13 --> PgPolymorphic_15
    PgClassExpression_14 --> PgPolymorphic_15
    List_66 --> First_21
    First_21 --> PgSelectSingle_22
    PgSelectSingle_22 --> PgClassExpression_23
    PgSelectSingle_22 --> PgClassExpression_24
    List_68 --> First_30
    First_30 --> PgSelectSingle_31
    PgSelectSingle_31 --> PgClassExpression_32
    PgSelectSingle_31 --> PgClassExpression_33
    PgSelectSingle_31 --> PgClassExpression_34
    PgSelectSingle_31 --> PgClassExpression_35
    List_70 --> First_41
    First_41 --> PgSelectSingle_42
    PgSelectSingle_42 --> PgClassExpression_43
    PgSelectSingle_42 --> PgClassExpression_44
    PgSelectSingle_42 --> PgClassExpression_45
    List_72 --> First_51
    First_51 --> PgSelectSingle_52
    PgSelectSingle_52 --> PgClassExpression_53
    PgSelectSingle_52 --> PgClassExpression_54
    List_74 --> First_60
    First_60 --> PgSelectSingle_61
    PgSelectSingle_61 --> PgClassExpression_62
    PgSelectSingle_61 --> PgClassExpression_63
    PgSelectSingle_61 --> PgClassExpression_64
    PgSelectSingle_13 --> Map_65
    Map_65 --> List_66
    PgSelectSingle_13 --> Map_67
    Map_67 --> List_68
    PgSelectSingle_13 --> Map_69
    Map_69 --> List_70
    PgSelectSingle_13 --> Map_71
    Map_71 --> List_72
    PgSelectSingle_13 --> Map_73
    Map_73 --> List_74

    %% plan-to-path relationships
    P1["~"]
    __TrackedObject_6 -.-> P1
    P2[">item1"]
    PgPolymorphic_15 -.-> P2
    P3[">i…1>id"]
    PgClassExpression_23 -.-> P3
    P4[">i…1>title"]
    PgClassExpression_24 -.-> P4
    P5[">i…1>id"]
    PgClassExpression_32 -.-> P5
    P6[">i…1>title"]
    PgClassExpression_33 -.-> P6
    P7[">i…1>description"]
    PgClassExpression_34 -.-> P7
    P8[">i…1>note"]
    PgClassExpression_35 -.-> P8
    P9[">i…1>id"]
    PgClassExpression_43 -.-> P9
    P10[">i…1>title"]
    PgClassExpression_44 -.-> P10
    P11[">i…1>color"]
    PgClassExpression_45 -.-> P11
    P12[">i…1>id"]
    PgClassExpression_53 -.-> P12
    P13[">i…1>title"]
    PgClassExpression_54 -.-> P13
    P14[">i…1>id"]
    PgClassExpression_62 -.-> P14
    P15[">i…1>description"]
    PgClassExpression_63 -.-> P15
    P16[">i…1>note"]
    PgClassExpression_64 -.-> P16

    %% allocate buckets
    classDef bucket0 stroke:#696969
    class __Value_3,__Value_5,__TrackedObject_6,InputStaticLeaf_7,PgSelect_8,Access_9,Access_10,Object_11,First_12,PgSelectSingle_13,PgClassExpression_14,PgPolymorphic_15,First_21,First_30,First_41,First_51,First_60,Map_65,List_66,Map_67,List_68,Map_69,List_70,Map_71,List_72,Map_73,List_74 bucket0
    classDef bucket1 stroke:#a52a2a
    class PgSelectSingle_22,PgClassExpression_23,PgClassExpression_24 bucket1
    classDef bucket2 stroke:#808000
    class PgSelectSingle_31,PgClassExpression_32,PgClassExpression_33,PgClassExpression_34,PgClassExpression_35 bucket2
    classDef bucket3 stroke:#3cb371
    class PgSelectSingle_42,PgClassExpression_43,PgClassExpression_44,PgClassExpression_45 bucket3
    classDef bucket4 stroke:#7f007f
    class PgSelectSingle_52,PgClassExpression_53,PgClassExpression_54 bucket4
    classDef bucket5 stroke:#ff0000
    class PgSelectSingle_61,PgClassExpression_62,PgClassExpression_63,PgClassExpression_64 bucket5

    subgraph Buckets
    Bucket0("Bucket 0 (root)<br />~"):::bucket
    style Bucket0 stroke:#696969
    Bucket1("Bucket 1 (polymorphic_15[UnionTopic])<br />>item1"):::bucket
    style Bucket1 stroke:#a52a2a
    Bucket0 --> Bucket1
    Bucket2("Bucket 2 (polymorphic_15[UnionPost])<br />>item1"):::bucket
    style Bucket2 stroke:#808000
    Bucket0 --> Bucket2
    Bucket3("Bucket 3 (polymorphic_15[UnionDivider])<br />>item1"):::bucket
    style Bucket3 stroke:#3cb371
    Bucket0 --> Bucket3
    Bucket4("Bucket 4 (polymorphic_15[UnionChecklist])<br />>item1"):::bucket
    style Bucket4 stroke:#7f007f
    Bucket0 --> Bucket4
    Bucket5("Bucket 5 (polymorphic_15[UnionChecklistItem])<br />>item1"):::bucket
    style Bucket5 stroke:#ff0000
    Bucket0 --> Bucket5
    end
```
