```mermaid
graph TD
    classDef path fill:#eee,stroke:#000,color:#000
    classDef plan fill:#fff,stroke-width:3px,color:#000
    classDef itemplan fill:#fff,stroke-width:6px,color:#000
    classDef sideeffectplan fill:#f00,stroke-width:6px,color:#000
    classDef bucket fill:#f6f6f6,color:#000,stroke-width:6px,text-align:left


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
    PgClassExpression_33["PgClassExpression[_33∈3]<br /><__relation...parent_id”>"]:::plan
    PgSelect_34[["PgSelect[_34∈3]<br /><relational_items>"]]:::plan
    First_38["First[_38∈3]"]:::plan
    PgSelectSingle_39["PgSelectSingle[_39∈3]<br /><relational_items>"]:::plan
    PgClassExpression_40["PgClassExpression[_40∈3]<br /><__relation...s__.”type”>"]:::plan
    PgPolymorphic_41["PgPolymorphic[_41∈3]"]:::plan
    PgSelect_43[["PgSelect[_43∈3]<br /><relational_topics>"]]:::plan
    First_47["First[_47∈3]"]:::plan
    PgSelectSingle_48["PgSelectSingle[_48∈5]<br /><relational_topics>"]:::plan
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
    PgClassExpression_65["PgClassExpression[_65∈5]<br /><__relation...__.”title”>"]:::plan
    PgSelect_67[["PgSelect[_67∈3]<br /><relational_posts>"]]:::plan
    First_71["First[_71∈3]"]:::plan
    PgSelectSingle_72["PgSelectSingle[_72∈6]<br /><relational_posts>"]:::plan
    PgClassExpression_89["PgClassExpression[_89∈6]<br /><__relation...__.”title”>"]:::plan
    PgClassExpression_90["PgClassExpression[_90∈6]<br /><__relation...scription”>"]:::plan
    PgClassExpression_91["PgClassExpression[_91∈6]<br /><__relation...s__.”note”>"]:::plan
    PgSelect_93[["PgSelect[_93∈3]<br /><relational_dividers>"]]:::plan
    First_97["First[_97∈3]"]:::plan
    PgSelectSingle_98["PgSelectSingle[_98∈7]<br /><relational_dividers>"]:::plan
    PgClassExpression_115["PgClassExpression[_115∈7]<br /><__relation...__.”title”>"]:::plan
    PgClassExpression_116["PgClassExpression[_116∈7]<br /><__relation...__.”color”>"]:::plan
    PgSelect_118[["PgSelect[_118∈3]<br /><relational_checklists>"]]:::plan
    First_122["First[_122∈3]"]:::plan
    PgSelectSingle_123["PgSelectSingle[_123∈8]<br /><relational_checklists>"]:::plan
    PgClassExpression_140["PgClassExpression[_140∈8]<br /><__relation...__.”title”>"]:::plan
    PgSelect_142[["PgSelect[_142∈3]<br /><relational_checklist_items>"]]:::plan
    First_146["First[_146∈3]"]:::plan
    PgSelectSingle_147["PgSelectSingle[_147∈9]<br /><relational_checklist_items>"]:::plan
    PgClassExpression_164["PgClassExpression[_164∈9]<br /><__relation...scription”>"]:::plan
    PgClassExpression_165["PgClassExpression[_165∈9]<br /><__relation...s__.”note”>"]:::plan
    PgClassExpression_168["PgClassExpression[_168∈3]<br /><__relation...__.”type2”>"]:::plan
    PgClassExpression_169["PgClassExpression[_169∈3]<br /><__relation...author_id”>"]:::plan
    PgSelect_170[["PgSelect[_170∈3]<br /><people>"]]:::plan
    First_174["First[_174∈3]"]:::plan
    PgSelectSingle_175["PgSelectSingle[_175∈3]<br /><people>"]:::plan
    PgClassExpression_176["PgClassExpression[_176∈3]<br /><__people__.”username”>"]:::plan
    PgClassExpression_177["PgClassExpression[_177∈3]<br /><__relation...”position”>"]:::plan
    PgClassExpression_178["PgClassExpression[_178∈3]<br /><__relation...reated_at”>"]:::plan
    PgClassExpression_179["PgClassExpression[_179∈3]<br /><__relation...pdated_at”>"]:::plan
    PgClassExpression_180["PgClassExpression[_180∈3]<br /><__relation..._archived”>"]:::plan
    PgClassExpression_181["PgClassExpression[_181∈3]<br /><__relation...chived_at”>"]:::plan
    PgClassExpression_182["PgClassExpression[_182∈4]<br /><__relation...__.”title”>"]:::plan
    PgSelect_184[["PgSelect[_184∈3]<br /><relational_posts>"]]:::plan
    First_188["First[_188∈3]"]:::plan
    PgSelectSingle_189["PgSelectSingle[_189∈10]<br /><relational_posts>"]:::plan
    PgClassExpression_339["PgClassExpression[_339∈10]<br /><__relation...__.”title”>"]:::plan
    PgClassExpression_340["PgClassExpression[_340∈10]<br /><__relation...scription”>"]:::plan
    PgClassExpression_341["PgClassExpression[_341∈10]<br /><__relation...s__.”note”>"]:::plan
    PgSelect_343[["PgSelect[_343∈3]<br /><relational_dividers>"]]:::plan
    First_347["First[_347∈3]"]:::plan
    PgSelectSingle_348["PgSelectSingle[_348∈11]<br /><relational_dividers>"]:::plan
    PgClassExpression_498["PgClassExpression[_498∈11]<br /><__relation...__.”title”>"]:::plan
    PgClassExpression_499["PgClassExpression[_499∈11]<br /><__relation...__.”color”>"]:::plan
    PgSelect_501[["PgSelect[_501∈3]<br /><relational_checklists>"]]:::plan
    First_505["First[_505∈3]"]:::plan
    PgSelectSingle_506["PgSelectSingle[_506∈12]<br /><relational_checklists>"]:::plan
    PgClassExpression_656["PgClassExpression[_656∈12]<br /><__relation...__.”title”>"]:::plan
    PgClassExpression_657["PgClassExpression[_657∈3]<br /><__relation...ems__.”id”>"]:::plan
    PgSelect_658[["PgSelect[_658∈3]<br /><relational_checklist_items>"]]:::plan
    First_662["First[_662∈3]"]:::plan
    PgSelectSingle_663["PgSelectSingle[_663∈13]<br /><relational_checklist_items>"]:::plan
    PgClassExpression_772["PgClassExpression[_772∈3]<br /><__relation...ems__.”id”>"]:::plan
    Access_802["Access[_802∈0]<br /><_3.pgSettings>"]:::plan
    Access_803["Access[_803∈0]<br /><_3.withPgClient>"]:::plan
    Object_804["Object[_804∈0]<br /><{pgSettings,withPgClient}>"]:::plan
    PgClassExpression_813["PgClassExpression[_813∈13]<br /><__relation...scription”>"]:::plan
    PgClassExpression_814["PgClassExpression[_814∈13]<br /><__relation...s__.”note”>"]:::plan

    %% plan dependencies
    __Value_5 --> __TrackedObject_6
    Object_804 --> PgSelect_7
    PgSelect_7 ==> __Item_11
    __Item_11 --> PgSelectSingle_12
    PgSelectSingle_12 --> PgClassExpression_13
    PgSelectSingle_12 --> PgClassExpression_14
    Object_804 --> PgSelect_15
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
    Object_804 --> PgSelect_27
    PgClassExpression_657 --> PgSelect_27
    PgSelect_27 --> First_31
    First_31 --> PgSelectSingle_32
    PgSelectSingle_23 --> PgClassExpression_33
    Object_804 --> PgSelect_34
    PgClassExpression_33 --> PgSelect_34
    PgSelect_34 --> First_38
    First_38 --> PgSelectSingle_39
    PgSelectSingle_39 --> PgClassExpression_40
    PgSelectSingle_39 --> PgPolymorphic_41
    PgClassExpression_40 --> PgPolymorphic_41
    Object_804 --> PgSelect_43
    PgClassExpression_772 --> PgSelect_43
    PgSelect_43 --> First_47
    First_47 --> PgSelectSingle_48
    PgSelectSingle_39 --> PgClassExpression_51
    PgSelectSingle_39 --> PgClassExpression_52
    Object_804 --> PgSelect_53
    PgClassExpression_52 --> PgSelect_53
    PgSelect_53 --> First_57
    First_57 --> PgSelectSingle_58
    PgSelectSingle_58 --> PgClassExpression_59
    PgSelectSingle_39 --> PgClassExpression_60
    PgSelectSingle_39 --> PgClassExpression_61
    PgSelectSingle_39 --> PgClassExpression_62
    PgSelectSingle_39 --> PgClassExpression_63
    PgSelectSingle_39 --> PgClassExpression_64
    PgSelectSingle_48 --> PgClassExpression_65
    Object_804 --> PgSelect_67
    PgClassExpression_772 --> PgSelect_67
    PgSelect_67 --> First_71
    First_71 --> PgSelectSingle_72
    PgSelectSingle_72 --> PgClassExpression_89
    PgSelectSingle_72 --> PgClassExpression_90
    PgSelectSingle_72 --> PgClassExpression_91
    Object_804 --> PgSelect_93
    PgClassExpression_772 --> PgSelect_93
    PgSelect_93 --> First_97
    First_97 --> PgSelectSingle_98
    PgSelectSingle_98 --> PgClassExpression_115
    PgSelectSingle_98 --> PgClassExpression_116
    Object_804 --> PgSelect_118
    PgClassExpression_772 --> PgSelect_118
    PgSelect_118 --> First_122
    First_122 --> PgSelectSingle_123
    PgSelectSingle_123 --> PgClassExpression_140
    Object_804 --> PgSelect_142
    PgClassExpression_772 --> PgSelect_142
    PgSelect_142 --> First_146
    First_146 --> PgSelectSingle_147
    PgSelectSingle_147 --> PgClassExpression_164
    PgSelectSingle_147 --> PgClassExpression_165
    PgSelectSingle_23 --> PgClassExpression_168
    PgSelectSingle_23 --> PgClassExpression_169
    Object_804 --> PgSelect_170
    PgClassExpression_169 --> PgSelect_170
    PgSelect_170 --> First_174
    First_174 --> PgSelectSingle_175
    PgSelectSingle_175 --> PgClassExpression_176
    PgSelectSingle_23 --> PgClassExpression_177
    PgSelectSingle_23 --> PgClassExpression_178
    PgSelectSingle_23 --> PgClassExpression_179
    PgSelectSingle_23 --> PgClassExpression_180
    PgSelectSingle_23 --> PgClassExpression_181
    PgSelectSingle_32 --> PgClassExpression_182
    Object_804 --> PgSelect_184
    PgClassExpression_657 --> PgSelect_184
    PgSelect_184 --> First_188
    First_188 --> PgSelectSingle_189
    PgSelectSingle_189 --> PgClassExpression_339
    PgSelectSingle_189 --> PgClassExpression_340
    PgSelectSingle_189 --> PgClassExpression_341
    Object_804 --> PgSelect_343
    PgClassExpression_657 --> PgSelect_343
    PgSelect_343 --> First_347
    First_347 --> PgSelectSingle_348
    PgSelectSingle_348 --> PgClassExpression_498
    PgSelectSingle_348 --> PgClassExpression_499
    Object_804 --> PgSelect_501
    PgClassExpression_657 --> PgSelect_501
    PgSelect_501 --> First_505
    First_505 --> PgSelectSingle_506
    PgSelectSingle_506 --> PgClassExpression_656
    PgSelectSingle_23 --> PgClassExpression_657
    Object_804 --> PgSelect_658
    PgClassExpression_657 --> PgSelect_658
    PgSelect_658 --> First_662
    First_662 --> PgSelectSingle_663
    PgSelectSingle_39 --> PgClassExpression_772
    __Value_3 --> Access_802
    __Value_3 --> Access_803
    Access_802 --> Object_804
    Access_803 --> Object_804
    PgSelectSingle_663 --> PgClassExpression_813
    PgSelectSingle_663 --> PgClassExpression_814

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
    P_65[">p…]>i…]>p…t>title x5"]
    PgClassExpression_65 -.-> P_65
    P_89[">p…]>i…]>p…t>title x5"]
    PgClassExpression_89 -.-> P_89
    P_90[">p…]>i…]>p…t>description x5"]
    PgClassExpression_90 -.-> P_90
    P_91[">p…]>i…]>p…t>note x5"]
    PgClassExpression_91 -.-> P_91
    P_115[">p…]>i…]>p…t>title x5"]
    PgClassExpression_115 -.-> P_115
    P_116[">p…]>i…]>p…t>color x5"]
    PgClassExpression_116 -.-> P_116
    P_140[">p…]>i…]>p…t>title x5"]
    PgClassExpression_140 -.-> P_140
    P_164[">p…]>i…]>p…t>description x5"]
    PgClassExpression_164 -.-> P_164
    P_165[">p…]>i…]>p…t>note x5"]
    PgClassExpression_165 -.-> P_165
    P_168[">p…]>i…]>type2 x5"]
    PgClassExpression_168 -.-> P_168
    P_175[">p…]>i…]>author x5"]
    PgSelectSingle_175 -.-> P_175
    P_176[">p…]>i…]>a…r>username x5"]
    PgClassExpression_176 -.-> P_176
    P_177[">p…]>i…]>position x5"]
    PgClassExpression_177 -.-> P_177
    P_178[">p…]>i…]>createdAt x5"]
    PgClassExpression_178 -.-> P_178
    P_179[">p…]>i…]>updatedAt x5"]
    PgClassExpression_179 -.-> P_179
    P_180[">p…]>i…]>isExplicitlyArchived x5"]
    PgClassExpression_180 -.-> P_180
    P_181[">p…]>i…]>archivedAt x5"]
    PgClassExpression_181 -.-> P_181
    P_182[">p…]>i…]>title"]
    PgClassExpression_182 -.-> P_182
    P_339[">p…]>i…]>title"]
    PgClassExpression_339 -.-> P_339
    P_340[">p…]>i…]>description"]
    PgClassExpression_340 -.-> P_340
    P_341[">p…]>i…]>note"]
    PgClassExpression_341 -.-> P_341
    P_498[">p…]>i…]>title"]
    PgClassExpression_498 -.-> P_498
    P_499[">p…]>i…]>color"]
    PgClassExpression_499 -.-> P_499
    P_656[">p…]>i…]>title"]
    PgClassExpression_656 -.-> P_656
    P_657[">p…]>i…]>id x5"]
    PgClassExpression_657 -.-> P_657
    P_772[">p…]>i…]>p…t>id x25"]
    PgClassExpression_772 -.-> P_772
    P_813[">p…]>i…]>description"]
    PgClassExpression_813 -.-> P_813
    P_814[">p…]>i…]>note"]
    PgClassExpression_814 -.-> P_814

    %% allocate buckets
    classDef bucket0 stroke:#696969
    class __Value_3,__Value_5,__TrackedObject_6,PgSelect_7,Access_802,Access_803,Object_804 bucket0
    classDef bucket1 stroke:#00bfff
    class __Item_11,PgSelectSingle_12,PgClassExpression_13,PgClassExpression_14,PgSelect_15,__ListTransform_19 bucket1
    classDef bucket2 stroke:#7f007f
    class __Item_20,PgSelectSingle_21 bucket2
    classDef bucket3 stroke:#ffa500
    class __Item_22,PgSelectSingle_23,PgClassExpression_24,PgPolymorphic_25,PgSelect_27,First_31,PgClassExpression_33,PgSelect_34,First_38,PgSelectSingle_39,PgClassExpression_40,PgPolymorphic_41,PgSelect_43,First_47,PgClassExpression_51,PgClassExpression_52,PgSelect_53,First_57,PgSelectSingle_58,PgClassExpression_59,PgClassExpression_60,PgClassExpression_61,PgClassExpression_62,PgClassExpression_63,PgClassExpression_64,PgSelect_67,First_71,PgSelect_93,First_97,PgSelect_118,First_122,PgSelect_142,First_146,PgClassExpression_168,PgClassExpression_169,PgSelect_170,First_174,PgSelectSingle_175,PgClassExpression_176,PgClassExpression_177,PgClassExpression_178,PgClassExpression_179,PgClassExpression_180,PgClassExpression_181,PgSelect_184,First_188,PgSelect_343,First_347,PgSelect_501,First_505,PgClassExpression_657,PgSelect_658,First_662,PgClassExpression_772 bucket3
    classDef bucket4 stroke:#0000ff
    class PgSelectSingle_32,PgClassExpression_182 bucket4
    classDef bucket5 stroke:#7fff00
    class PgSelectSingle_48,PgClassExpression_65 bucket5
    classDef bucket6 stroke:#ff1493
    class PgSelectSingle_72,PgClassExpression_89,PgClassExpression_90,PgClassExpression_91 bucket6
    classDef bucket7 stroke:#808000
    class PgSelectSingle_98,PgClassExpression_115,PgClassExpression_116 bucket7
    classDef bucket8 stroke:#dda0dd
    class PgSelectSingle_123,PgClassExpression_140 bucket8
    classDef bucket9 stroke:#ff0000
    class PgSelectSingle_147,PgClassExpression_164,PgClassExpression_165 bucket9
    classDef bucket10 stroke:#ffff00
    class PgSelectSingle_189,PgClassExpression_339,PgClassExpression_340,PgClassExpression_341 bucket10
    classDef bucket11 stroke:#00ffff
    class PgSelectSingle_348,PgClassExpression_498,PgClassExpression_499 bucket11
    classDef bucket12 stroke:#4169e1
    class PgSelectSingle_506,PgClassExpression_656 bucket12
    classDef bucket13 stroke:#3cb371
    class PgSelectSingle_663,PgClassExpression_813,PgClassExpression_814 bucket13

    subgraph Buckets
    Bucket0("Bucket 0 (root)<br />~<br />⠀ROOT <-O- _6<br />⠀⠀people <-A- _7"):::bucket
    style Bucket0 stroke:#696969
    Bucket1("Bucket 1 (item_11)<br />~>Query.people[]<br />⠀ROOT <-O- _12<br />⠀⠀username <-L- _13<br />⠀⠀items <-A- _19"):::bucket
    style Bucket1 stroke:#00bfff
    Bucket0 --> Bucket1
    Bucket2("Bucket 2 (item_20)"):::bucket
    style Bucket2 stroke:#7f007f
    Bucket1 --> Bucket2
    Bucket3("Bucket 3 (item_22)<br />~>Query.people[]>Person.items[]<br />⠀ROOT <-O- _25<br />⠀⠀type <-L- _24<br />⠀⠀parent <-O- _41<br />⠀⠀⠀parent.type <-L- _40<br />⠀⠀⠀parent.type2 <-L- _51<br />⠀⠀⠀parent.author <-O- _58<br />⠀⠀⠀⠀parent.author.username <-L- _59<br />⠀⠀⠀parent.position <-L- _60<br />⠀⠀⠀parent.createdAt <-L- _61<br />⠀⠀⠀parent.updatedAt <-L- _62<br />⠀⠀⠀parent.isExplicitlyArchived <-L- _63<br />⠀⠀⠀parent.archivedAt <-L- _64<br />⠀⠀⠀parent.id <-L- _772<br />⠀⠀type2 <-L- _168<br />⠀⠀author <-O- _175<br />⠀⠀⠀author.username <-L- _176<br />⠀⠀position <-L- _177<br />⠀⠀createdAt <-L- _178<br />⠀⠀updatedAt <-L- _179<br />⠀⠀isExplicitlyArchived <-L- _180<br />⠀⠀archivedAt <-L- _181<br />⠀⠀id <-L- _657"):::bucket
    style Bucket3 stroke:#ffa500
    Bucket1 --> Bucket3
    Bucket4("Bucket 4 (polymorphic_25[RelationalTopic])<br />~>Query.people[]>Person.items[]<br />⠀⠀title <-L- _182"):::bucket
    style Bucket4 stroke:#0000ff
    Bucket3 --> Bucket4
    Bucket5("Bucket 5 (polymorphic_41[RelationalTopic])<br />~>Query.people[]>Person.items[]>RelationalPost.parent<br />~>Query.people[]>Person.items[]>RelationalTopic.parent<br />~>Query.people[]>Person.items[]>RelationalDivider.parent<br />~>Query.people[]>Person.items[]>RelationalChecklist.parent<br />~>Query.people[]>Person.items[]>RelationalChecklistItem.parent<br />⠀⠀title <-L- _65"):::bucket
    style Bucket5 stroke:#7fff00
    Bucket3 --> Bucket5
    Bucket6("Bucket 6 (polymorphic_41[RelationalPost])<br />~>Query.people[]>Person.items[]>RelationalPost.parent<br />~>Query.people[]>Person.items[]>RelationalTopic.parent<br />~>Query.people[]>Person.items[]>RelationalDivider.parent<br />~>Query.people[]>Person.items[]>RelationalChecklist.parent<br />~>Query.people[]>Person.items[]>RelationalChecklistItem.parent<br />⠀⠀title <-L- _89<br />⠀⠀description <-L- _90<br />⠀⠀note <-L- _91"):::bucket
    style Bucket6 stroke:#ff1493
    Bucket3 --> Bucket6
    Bucket7("Bucket 7 (polymorphic_41[RelationalDivider])<br />~>Query.people[]>Person.items[]>RelationalPost.parent<br />~>Query.people[]>Person.items[]>RelationalTopic.parent<br />~>Query.people[]>Person.items[]>RelationalDivider.parent<br />~>Query.people[]>Person.items[]>RelationalChecklist.parent<br />~>Query.people[]>Person.items[]>RelationalChecklistItem.parent<br />⠀⠀title <-L- _115<br />⠀⠀color <-L- _116"):::bucket
    style Bucket7 stroke:#808000
    Bucket3 --> Bucket7
    Bucket8("Bucket 8 (polymorphic_41[RelationalChecklist])<br />~>Query.people[]>Person.items[]>RelationalPost.parent<br />~>Query.people[]>Person.items[]>RelationalTopic.parent<br />~>Query.people[]>Person.items[]>RelationalDivider.parent<br />~>Query.people[]>Person.items[]>RelationalChecklist.parent<br />~>Query.people[]>Person.items[]>RelationalChecklistItem.parent<br />⠀⠀title <-L- _140"):::bucket
    style Bucket8 stroke:#dda0dd
    Bucket3 --> Bucket8
    Bucket9("Bucket 9 (polymorphic_41[RelationalChecklistItem])<br />~>Query.people[]>Person.items[]>RelationalPost.parent<br />~>Query.people[]>Person.items[]>RelationalTopic.parent<br />~>Query.people[]>Person.items[]>RelationalDivider.parent<br />~>Query.people[]>Person.items[]>RelationalChecklist.parent<br />~>Query.people[]>Person.items[]>RelationalChecklistItem.parent<br />⠀⠀description <-L- _164<br />⠀⠀note <-L- _165"):::bucket
    style Bucket9 stroke:#ff0000
    Bucket3 --> Bucket9
    Bucket10("Bucket 10 (polymorphic_25[RelationalPost])<br />~>Query.people[]>Person.items[]<br />⠀⠀title <-L- _339<br />⠀⠀description <-L- _340<br />⠀⠀note <-L- _341"):::bucket
    style Bucket10 stroke:#ffff00
    Bucket3 --> Bucket10
    Bucket11("Bucket 11 (polymorphic_25[RelationalDivider])<br />~>Query.people[]>Person.items[]<br />⠀⠀title <-L- _498<br />⠀⠀color <-L- _499"):::bucket
    style Bucket11 stroke:#00ffff
    Bucket3 --> Bucket11
    Bucket12("Bucket 12 (polymorphic_25[RelationalChecklist])<br />~>Query.people[]>Person.items[]<br />⠀⠀title <-L- _656"):::bucket
    style Bucket12 stroke:#4169e1
    Bucket3 --> Bucket12
    Bucket13("Bucket 13 (polymorphic_25[RelationalChecklistItem])<br />~>Query.people[]>Person.items[]<br />⠀⠀description <-L- _813<br />⠀⠀note <-L- _814"):::bucket
    style Bucket13 stroke:#3cb371
    Bucket3 --> Bucket13
    end
```
