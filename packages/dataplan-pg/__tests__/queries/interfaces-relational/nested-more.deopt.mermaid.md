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
    PgClassExpression_33["PgClassExpression[_33∈3]<br /><__relation...parent_id”>"]:::plan
    PgSelect_34[["PgSelect[_34∈3]<br /><relational_items>"]]:::plan
    First_38["First[_38∈3]"]:::plan
    PgSelectSingle_39["PgSelectSingle[_39∈3]<br /><relational_items>"]:::plan
    PgClassExpression_40["PgClassExpression[_40∈3]<br /><__relation...s__.”type”>"]:::plan
    PgPolymorphic_41["PgPolymorphic[_41∈3]"]:::plan
    PgClassExpression_51["PgClassExpression[_51∈3]<br /><__relation...__.”type2”>"]:::plan
    PgClassExpression_52["PgClassExpression[_52∈3]<br /><__relation...author_id”>"]:::plan
    PgSelect_53[["PgSelect[_53∈3]<br /><people>"]]:::plan
    First_57["First[_57∈3]"]:::plan
    PgSelectSingle_58["PgSelectSingle[_58∈3]<br /><people>"]:::plan
    PgClassExpression_59["PgClassExpression[_59∈3]<br /><__people__.”username”>"]:::plan
    PgClassExpression_60["PgClassExpression[_60∈3]<br /><__relation...”position”>"]:::plan
    PgClassExpression_61["PgClassExpression[_61∈3]<br /><__relation...reated_at”>"]:::plan
    PgClassExpression_62["PgClassExpression[_62∈3]<br /><__relation...pdated_at”>"]:::plan
    PgClassExpression_63["PgClassExpression[_63∈3]<br /><__relation..._archived”>"]:::plan
    PgClassExpression_64["PgClassExpression[_64∈3]<br /><__relation...chived_at”>"]:::plan
    PgClassExpression_159["PgClassExpression[_159∈3]<br /><__relation...__.”type2”>"]:::plan
    PgClassExpression_160["PgClassExpression[_160∈3]<br /><__relation...author_id”>"]:::plan
    PgSelect_161[["PgSelect[_161∈3]<br /><people>"]]:::plan
    First_165["First[_165∈3]"]:::plan
    PgSelectSingle_166["PgSelectSingle[_166∈3]<br /><people>"]:::plan
    PgClassExpression_167["PgClassExpression[_167∈3]<br /><__people__.”username”>"]:::plan
    PgClassExpression_168["PgClassExpression[_168∈3]<br /><__relation...”position”>"]:::plan
    PgClassExpression_169["PgClassExpression[_169∈3]<br /><__relation...reated_at”>"]:::plan
    PgClassExpression_170["PgClassExpression[_170∈3]<br /><__relation...pdated_at”>"]:::plan
    PgClassExpression_171["PgClassExpression[_171∈3]<br /><__relation..._archived”>"]:::plan
    PgClassExpression_172["PgClassExpression[_172∈3]<br /><__relation...chived_at”>"]:::plan
    PgClassExpression_614["PgClassExpression[_614∈3]<br /><__relation...ems__.”id”>"]:::plan
    PgClassExpression_722["PgClassExpression[_722∈3]<br /><__relation...ems__.”id”>"]:::plan
    Access_750["Access[_750∈0]<br /><_3.pgSettings>"]:::plan
    Access_751["Access[_751∈0]<br /><_3.withPgClient>"]:::plan
    Object_752["Object[_752∈0]<br /><{pgSettings,withPgClient}>"]:::plan

    %% plan dependencies
    __Value_5 --> __TrackedObject_6
    Object_752 --> PgSelect_7
    PgSelect_7 ==> __Item_11
    __Item_11 --> PgSelectSingle_12
    PgSelectSingle_12 --> PgClassExpression_13
    PgSelectSingle_12 --> PgClassExpression_14
    Object_752 --> PgSelect_15
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
    PgSelectSingle_23 --> PgClassExpression_33
    Object_752 --> PgSelect_34
    PgClassExpression_33 --> PgSelect_34
    PgSelect_34 --> First_38
    First_38 --> PgSelectSingle_39
    PgSelectSingle_39 --> PgClassExpression_40
    PgSelectSingle_39 --> PgPolymorphic_41
    PgClassExpression_40 --> PgPolymorphic_41
    PgSelectSingle_39 --> PgClassExpression_51
    PgSelectSingle_39 --> PgClassExpression_52
    Object_752 --> PgSelect_53
    PgClassExpression_52 --> PgSelect_53
    PgSelect_53 --> First_57
    First_57 --> PgSelectSingle_58
    PgSelectSingle_58 --> PgClassExpression_59
    PgSelectSingle_39 --> PgClassExpression_60
    PgSelectSingle_39 --> PgClassExpression_61
    PgSelectSingle_39 --> PgClassExpression_62
    PgSelectSingle_39 --> PgClassExpression_63
    PgSelectSingle_39 --> PgClassExpression_64
    PgSelectSingle_23 --> PgClassExpression_159
    PgSelectSingle_23 --> PgClassExpression_160
    Object_752 --> PgSelect_161
    PgClassExpression_160 --> PgSelect_161
    PgSelect_161 --> First_165
    First_165 --> PgSelectSingle_166
    PgSelectSingle_166 --> PgClassExpression_167
    PgSelectSingle_23 --> PgClassExpression_168
    PgSelectSingle_23 --> PgClassExpression_169
    PgSelectSingle_23 --> PgClassExpression_170
    PgSelectSingle_23 --> PgClassExpression_171
    PgSelectSingle_23 --> PgClassExpression_172
    PgSelectSingle_23 --> PgClassExpression_614
    PgSelectSingle_39 --> PgClassExpression_722
    __Value_3 --> Access_750
    __Value_3 --> Access_751
    Access_750 --> Object_752
    Access_751 --> Object_752

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
    P_40[">p…]>i…]>p…t>type x25"]
    PgClassExpression_40 -.-> P_40
    P_41[">p…]>i…]>parent x5"]
    PgPolymorphic_41 -.-> P_41
    P_51[">p…]>i…]>p…t>type2 x25"]
    PgClassExpression_51 -.-> P_51
    P_58[">p…]>i…]>p…t>author x25"]
    PgSelectSingle_58 -.-> P_58
    P_59[">p…]>i…]>p…t>a…r>username x25"]
    PgClassExpression_59 -.-> P_59
    P_60[">p…]>i…]>p…t>position x25"]
    PgClassExpression_60 -.-> P_60
    P_61[">p…]>i…]>p…t>createdAt x25"]
    PgClassExpression_61 -.-> P_61
    P_62[">p…]>i…]>p…t>updatedAt x25"]
    PgClassExpression_62 -.-> P_62
    P_63[">p…]>i…]>p…t>isExplicitlyArchived x25"]
    PgClassExpression_63 -.-> P_63
    P_64[">p…]>i…]>p…t>archivedAt x25"]
    PgClassExpression_64 -.-> P_64
    P_159[">p…]>i…]>type2 x5"]
    PgClassExpression_159 -.-> P_159
    P_166[">p…]>i…]>author x5"]
    PgSelectSingle_166 -.-> P_166
    P_167[">p…]>i…]>a…r>username x5"]
    PgClassExpression_167 -.-> P_167
    P_168[">p…]>i…]>position x5"]
    PgClassExpression_168 -.-> P_168
    P_169[">p…]>i…]>createdAt x5"]
    PgClassExpression_169 -.-> P_169
    P_170[">p…]>i…]>updatedAt x5"]
    PgClassExpression_170 -.-> P_170
    P_171[">p…]>i…]>isExplicitlyArchived x5"]
    PgClassExpression_171 -.-> P_171
    P_172[">p…]>i…]>archivedAt x5"]
    PgClassExpression_172 -.-> P_172
    P_614[">p…]>i…]>id x5"]
    PgClassExpression_614 -.-> P_614
    P_722[">p…]>i…]>p…t>id x25"]
    PgClassExpression_722 -.-> P_722

    %% allocate buckets
    classDef bucket0 stroke:#696969
    class __Value_3,__Value_5,__TrackedObject_6,PgSelect_7,Access_750,Access_751,Object_752 bucket0
    classDef bucket1 stroke:#a52a2a
    class __Item_11,PgSelectSingle_12,PgClassExpression_13,PgClassExpression_14,PgSelect_15,__ListTransform_19 bucket1
    classDef bucket2 stroke:#808000
    class __Item_20,PgSelectSingle_21 bucket2
    classDef bucket3 stroke:#3cb371
    class __Item_22,PgSelectSingle_23,PgClassExpression_24,PgPolymorphic_25,PgClassExpression_33,PgSelect_34,First_38,PgSelectSingle_39,PgClassExpression_40,PgPolymorphic_41,PgClassExpression_51,PgClassExpression_52,PgSelect_53,First_57,PgSelectSingle_58,PgClassExpression_59,PgClassExpression_60,PgClassExpression_61,PgClassExpression_62,PgClassExpression_63,PgClassExpression_64,PgClassExpression_159,PgClassExpression_160,PgSelect_161,First_165,PgSelectSingle_166,PgClassExpression_167,PgClassExpression_168,PgClassExpression_169,PgClassExpression_170,PgClassExpression_171,PgClassExpression_172,PgClassExpression_614,PgClassExpression_722 bucket3

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
    end
```
